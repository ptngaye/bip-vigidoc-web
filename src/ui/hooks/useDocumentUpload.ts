'use client';

import { useState, useCallback, useEffect } from 'react';
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

  useEffect(() => {
    if (state.status !== 'uploading' || !state.selectedFile) {
      return;
    }

    let cancelled = false;

    const performVerification = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (cancelled) return;

        setState(prev => ({ ...prev, status: 'processing' }));

        const verifyDocument = container.verifyDocument();
        const result = await verifyDocument.execute({ file: state.selectedFile! });

        if (cancelled) return;

        if (result.success) {
          console.log('Verification success:', result.data);
          console.log('Verification ID:', result.data.verificationId);
          setState(prev => ({
            ...prev,
            status: 'success',
            result: result.data,
            error: null,
          }));
        } else {
          const errorMessage =
            result.error instanceof DomainError
              ? result.error.message
              : 'Un problème est survenu. Réessayez dans quelques instants.';

          setState(prev => ({
            ...prev,
            status: 'error',
            error: errorMessage,
          }));
        }
      } catch (error) {
        if (cancelled) return;

        console.error('Verification error:', error);
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Une erreur inattendue est survenue. Veuillez réessayer.',
        }));
      }
    };

    performVerification();

    return () => {
      cancelled = true;
    };
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
