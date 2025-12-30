'use client';

import { useCallback, useRef, useState } from 'react';
import { ContentType } from '@domain/value-objects';
import { FileSize } from '@domain/value-objects';

interface DocumentDropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isDisabled?: boolean;
}

export function DocumentDropZone({
  onFileSelect,
  selectedFile,
  isDisabled = false,
}: DocumentDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = useCallback(
    (file: File) => {
      setValidationError(null);

      if (!ContentType.isSupported(file.type)) {
        setValidationError(
          `Type de fichier non supporté. Formats acceptés : PDF, PNG, JPEG, WebP`
        );
        return;
      }

      if (file.size > FileSize.maxBytes) {
        setValidationError(`Fichier trop volumineux. Taille maximale : 10 Mo`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!isDisabled) {
        setIsDragOver(true);
      }
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      if (isDisabled) return;

      const file = event.dataTransfer.files[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [isDisabled, validateAndSelectFile]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [validateAndSelectFile]
  );

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      inputRef.current?.click();
    }
  }, [isDisabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if ((event.key === 'Enter' || event.key === ' ') && !isDisabled) {
        event.preventDefault();
        inputRef.current?.click();
      }
    },
    [isDisabled]
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label="Zone de dépôt de document"
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-full h-48 px-6 py-8
          border-2 border-dashed rounded-xl
          transition-all duration-200 ease-in-out
          ${
            isDisabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : isDragOver
                ? 'border-primary-500 bg-primary-50 cursor-copy'
                : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50 cursor-pointer'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
          onChange={handleInputChange}
          disabled={isDisabled}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center text-center">
          <svg
            className={`w-12 h-12 mb-3 ${
              isDragOver ? 'text-primary-500' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Déposer un document
              </p>
              <p className="text-xs text-gray-500">(PDF ou image)</p>
            </div>
          )}
        </div>
      </div>

      {validationError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
}
