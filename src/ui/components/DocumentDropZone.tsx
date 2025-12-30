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
          'Format non pris en charge. Utilisez PDF, JPG ou PNG.'
        );
        return;
      }

      if (file.size > FileSize.maxBytes) {
        setValidationError('Fichier trop volumineux (max 10 Mo).');
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
      // Reset input to allow selecting same file again
      event.target.value = '';
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
        aria-label="Zone de dépôt de document. Appuyez sur Entrée ou Espace pour choisir un fichier."
        aria-disabled={isDisabled}
        aria-describedby={validationError ? 'dropzone-error' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-full min-h-[100px] px-6 py-4
          border-2 border-dashed rounded-xl
          transition-all duration-200 ease-in-out
          motion-reduce:transition-none
          ${
            isDisabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : isDragOver
                ? 'border-primary-500 bg-primary-50 cursor-copy'
                : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50 cursor-pointer'
          }
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          onChange={handleInputChange}
          disabled={isDisabled}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center text-center">
          <svg
            className={`w-8 h-8 mb-2 motion-reduce:transition-none transition-colors ${
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
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
              </p>
            </div>
          ) : isDragOver ? (
            <p className="text-sm font-medium text-primary-600">
              Relâchez pour déposer
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Déposer un document
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG — max 10 Mo
              </p>
            </div>
          )}
        </div>
      </div>

      {!selectedFile && !isDragOver && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={`
              text-sm font-medium text-primary-600 hover:text-primary-700
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Choisir un fichier
          </button>
        </div>
      )}

      {validationError && (
        <p
          id="dropzone-error"
          className="mt-3 text-sm text-red-600 text-center"
          role="alert"
        >
          {validationError}
        </p>
      )}
    </div>
  );
}
