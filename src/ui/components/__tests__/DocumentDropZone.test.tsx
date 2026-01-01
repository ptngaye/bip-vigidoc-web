import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentDropZone } from '../DocumentDropZone';
import { createMockFile } from '../../../test/createMockFile';

const DROP_ZONE_LABEL =
  'Zone de dépôt de document. Appuyez sur Entrée ou Espace pour choisir un fichier.';

describe('DocumentDropZone', () => {
  it('should render drop zone with correct text when no file selected', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    expect(screen.getByText('Déposer un document')).toBeInTheDocument();
    expect(screen.getByText('PDF, JPG, PNG — max 10 Mo')).toBeInTheDocument();
  });

  it('should display selected file name and size', () => {
    const file = createMockFile({ name: 'document.pdf', size: 2 * 1024 * 1024 });
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={file} />);

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.00 Mo')).toBeInTheDocument();
  });

  it('should call onFileSelect when valid file is selected via input', async () => {
    const onFileSelect = vi.fn();
    const user = userEvent.setup();

    render(<DocumentDropZone onFileSelect={onFileSelect} selectedFile={null} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createMockFile();

    await user.upload(input, file);

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('should show error for unsupported file type via drop', () => {
    const onFileSelect = vi.fn();
    render(<DocumentDropZone onFileSelect={onFileSelect} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });

    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const dataTransfer = { files: [invalidFile] };

    fireEvent.drop(dropZone, { dataTransfer, preventDefault: vi.fn() });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Format non pris en charge. Utilisez PDF, JPG ou PNG.'
    );
  });

  it('should show error for file too large via drop', () => {
    const onFileSelect = vi.fn();
    render(<DocumentDropZone onFileSelect={onFileSelect} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });

    const largeFile = createMockFile({ size: 11 * 1024 * 1024 });
    const dataTransfer = { files: [largeFile] };

    fireEvent.drop(dropZone, { dataTransfer, preventDefault: vi.fn() });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Fichier trop volumineux (max 10 Mo).');
  });

  it('should be accessible via keyboard', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    expect(dropZone).toHaveAttribute('tabIndex', '0');
  });

  it('should be disabled when isDisabled is true', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} isDisabled />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    expect(dropZone).toHaveAttribute('aria-disabled', 'true');
    expect(dropZone).toHaveAttribute('tabIndex', '-1');
  });

  it('should handle drag over event', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() });

    expect(dropZone).toHaveClass('border-primary-500');
  });

  it('should show "Relâchez pour déposer" text on drag over', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() });

    expect(screen.getByText('Relâchez pour déposer')).toBeInTheDocument();
  });

  it('should handle drag leave event', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() });
    fireEvent.dragLeave(dropZone, { preventDefault: vi.fn() });

    expect(dropZone).not.toHaveClass('border-primary-500');
  });

  it('should handle drop event with valid file', () => {
    const onFileSelect = vi.fn();
    render(<DocumentDropZone onFileSelect={onFileSelect} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    const file = createMockFile();

    const dataTransfer = {
      files: [file],
    };

    fireEvent.drop(dropZone, { dataTransfer, preventDefault: vi.fn() });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('should not handle drop when disabled', () => {
    const onFileSelect = vi.fn();
    render(<DocumentDropZone onFileSelect={onFileSelect} selectedFile={null} isDisabled />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    const file = createMockFile();

    const dataTransfer = {
      files: [file],
    };

    fireEvent.drop(dropZone, { dataTransfer, preventDefault: vi.fn() });

    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('should handle keyboard Enter key', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(dropZone, { key: 'Enter', preventDefault: vi.fn() });

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should handle keyboard Space key', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    const dropZone = screen.getByRole('button', { name: DROP_ZONE_LABEL });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(dropZone, { key: ' ', preventDefault: vi.fn() });

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should render "Choisir un fichier" button', () => {
    render(<DocumentDropZone onFileSelect={vi.fn()} selectedFile={null} />);

    expect(screen.getByRole('button', { name: 'Choisir un fichier' })).toBeInTheDocument();
  });
});
