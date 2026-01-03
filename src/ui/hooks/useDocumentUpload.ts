'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { VerificationResult } from '@domain/entities';
import { DomainError } from '@domain/errors';
import { container } from '@infrastructure/di';

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface UseDocumentUploadState {
  status: UploadStatus;
  result: VerificationResult | null;
  error: string | null;
  selectedFile: File | null;
}

export interface UseDocumentUploadActions {
  selectFile: (file: File) => void;
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
      status: 'uploading',
      result: null,
      error: null,
      selectedFile: file,
    });
  }, []);

  const verificationIdRef = useRef(0);

  useEffect(() => {
    if (state.status !== 'uploading' || !state.selectedFile) {
      return;
    }

    const fileToVerify = state.selectedFile;
    const currentVerificationId = ++verificationIdRef.current;

    const performVerification = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (verificationIdRef.current !== currentVerificationId) return;

        setState(prev => ({ ...prev, status: 'processing' }));

        const verifyDocument = container.verifyDocument();
        const result = await verifyDocument.execute({ file: fileToVerify });

        if (verificationIdRef.current !== currentVerificationId) return;

        if (result.success) {
          setState({
            status: 'success',
            result: result.data,
            error: null,
            selectedFile: fileToVerify,
          });
        } else {
          const errorMessage =
            result.error instanceof DomainError
              ? result.error.message
              : 'Un problème est survenu. Réessayez dans quelques instants.';

          setState({
            status: 'error',
            result: null,
            error: errorMessage,
            selectedFile: fileToVerify,
          });
        }
      } catch {
        if (verificationIdRef.current !== currentVerificationId) return;

        setState({
          status: 'error',
          result: null,
          error: 'Une erreur inattendue est survenue. Veuillez réessayer.',
          selectedFile: fileToVerify,
        });
      }
    };

    performVerification();
  }, [state.status, state.selectedFile]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    selectFile,
    reset,
  };
}
