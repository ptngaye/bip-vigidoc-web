'use client';

import { useState, useCallback } from 'react';
import type { VerificationResult } from '@domain/entities';
import { DomainError } from '@domain/errors';
import { container } from '@infrastructure/di';

export type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

export interface UseDocumentUploadState {
  status: UploadStatus;
  result: VerificationResult | null;
  error: string | null;
  selectedFile: File | null;
}

export interface UseDocumentUploadActions {
  selectFile: (file: File) => void;
  upload: () => Promise<void>;
  reset: () => void;
}

export type UseDocumentUploadReturn = UseDocumentUploadState & UseDocumentUploadActions;

const initialState: UseDocumentUploadState = {
  status: 'idle',
  result: null,
  error: null,
  selectedFile: null,
};

export function useDocumentUpload(): UseDocumentUploadReturn {
  const [state, setState] = useState<UseDocumentUploadState>(initialState);

  const selectFile = useCallback((file: File) => {
    setState({
      status: 'idle',
      result: null,
      error: null,
      selectedFile: file,
    });
  }, []);

  const upload = useCallback(async () => {
    if (!state.selectedFile) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Aucun fichier sélectionné',
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: 'uploading', error: null }));

    const verifyDocument = container.verifyDocument();
    const result = await verifyDocument.execute({ file: state.selectedFile });

    if (result.success) {
      setState((prev) => ({
        ...prev,
        status: 'success',
        result: result.data,
        error: null,
      }));
    } else {
      const errorMessage =
        result.error instanceof DomainError
          ? result.error.message
          : result.error.message;

      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
    }
  }, [state.selectedFile]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    selectFile,
    upload,
    reset,
  };
}
