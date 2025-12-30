import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadCard } from '../UploadCard';
import { createMockFile } from '../../../test/createMockFile';

vi.mock('@infrastructure/di', () => ({
  container: {
    verifyDocument: vi.fn(() => ({
      execute: vi.fn().mockResolvedValue({
        success: true,
        data: {
          verificationId: 'test-uuid',
          verdict: 'valid',
        },
      }),
    })),
  },
}));

describe('UploadCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title and description', () => {
    render(<UploadCard />);

    expect(screen.getByText('Vous avez déjà un document ?')).toBeInTheDocument();
    expect(
      screen.getByText("Vérifiez l'authenticité d'un document administratif français.")
    ).toBeInTheDocument();
  });

  it('should render feature badges', () => {
    render(<UploadCard />);

    expect(screen.getByText('Analyse automatique')).toBeInTheDocument();
    expect(screen.getByText('Sans inscription')).toBeInTheDocument();
    expect(screen.getByText('Gratuit')).toBeInTheDocument();
  });

  it('should render document drop zone', () => {
    render(<UploadCard />);

    expect(screen.getByText('Déposer un document')).toBeInTheDocument();
  });

  it('should not show verify button when no file is selected', () => {
    render(<UploadCard />);

    expect(screen.queryByText('Vérifier le document')).not.toBeInTheDocument();
  });

  it('should show verify button when file is selected', async () => {
    const user = userEvent.setup();
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Vérifier le document')).toBeInTheDocument();
    });
  });

  it('should show loading state when uploading', async () => {
    const { container } = await import('@infrastructure/di');
    const mockExecute = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: {} }), 1000))
    );
    vi.mocked(container.verifyDocument).mockReturnValue({ execute: mockExecute });

    const user = userEvent.setup();
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Vérifier le document')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Vérifier le document'));

    await waitFor(() => {
      expect(screen.getByText('Analyse en cours...')).toBeInTheDocument();
    });
  });

  it('should show error message and retry button on failure', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: { message: 'Test error message' },
      }),
    });

    const user = userEvent.setup();
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Vérifier le document')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Vérifier le document'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Test error message');
      expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });
  });

  it('should reset state when clicking retry', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: { message: 'Test error' },
      }),
    });

    const user = userEvent.setup();
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Vérifier le document')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Vérifier le document'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Réessayer'));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Déposer un document')).toBeInTheDocument();
    });
  });
});
