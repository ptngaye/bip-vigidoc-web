import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadCard } from '../UploadCard';
import { createMockFile } from '../../../test/createMockFile';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

function createDeferredPromise<T>() {
  let resolve: (value: T) => void;
  const promise = new Promise<T>(res => {
    resolve = res;
  });
  return { promise, resolve: resolve! };
}

describe('UploadCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render title and description', () => {
    render(<UploadCard />);

    expect(screen.getByText('Vous avez déjà un document ?')).toBeInTheDocument();
    expect(screen.getByText('Déposez-le pour vérifier son authenticité.')).toBeInTheDocument();
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

  it('should show uploading state when file is selected', async () => {
    const deferred = createDeferredPromise<{ success: boolean; data?: unknown }>();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockReturnValue(deferred.promise),
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    expect(screen.getByText('Téléversement en cours…')).toBeInTheDocument();
  });

  it('should show processing state after uploading', async () => {
    const deferred = createDeferredPromise<{ success: boolean; data?: unknown }>();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockReturnValue(deferred.promise),
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    expect(screen.getByText('Téléversement en cours…')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByText('Analyse du document…')).toBeInTheDocument();
  });

  it('should show error message and retry button on failure', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: { message: 'Test error message' },
      }),
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Un problème est survenu');
    expect(screen.getByText('Réessayer')).toBeInTheDocument();
  });

  it('should reset state when clicking retry', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: { message: 'Test error' },
      }),
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByText('Réessayer'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Déposer un document')).toBeInTheDocument();
  });

  it('should navigate to result page on success', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: true,
        data: {
          verificationId: 'test-verification-id',
          verdict: 'valid',
        },
      }),
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UploadCard />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mockPush).toHaveBeenCalledWith('/resultat/test-verification-id');
  });
});
