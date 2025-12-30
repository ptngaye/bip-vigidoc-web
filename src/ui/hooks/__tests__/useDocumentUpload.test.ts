import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDocumentUpload } from '../useDocumentUpload';
import { VerificationResult } from '@domain/entities';
import { FileTooLargeError } from '@domain/errors';
import { VerificationFailedError } from '@application/errors';
import { createMockFile } from '../../../test/createMockFile';

vi.mock('@infrastructure/di', () => ({
  container: {
    verifyDocument: vi.fn(),
  },
}));

function createMockVerificationResult(): VerificationResult {
  return VerificationResult.create({
    verificationId: 'test-uuid',
    verdict: 'valid',
    detectedType: 'signed_2d_doc',
    trustLevel: 'high',
    requiresOnlineVerification: false,
    onlineVerificationUrl: null,
    documentType: null,
    documentTypeLabel: null,
    documentFamily: 'urssaf',
    emissionDate: null,
    issuer: null,
    extractedFields: {},
    failureCode: null,
    failureReason: null,
    warnings: [],
    file: null,
    verifiedAt: '2024-12-30T10:00:00Z',
  });
}

describe('useDocumentUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useDocumentUpload());

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.selectedFile).toBeNull();
  });

  it('should select file', () => {
    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    expect(result.current.selectedFile).toBe(file);
    expect(result.current.status).toBe('idle');
  });

  it('should upload file successfully', async () => {
    const mockResult = createMockVerificationResult();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({ success: true, data: mockResult }),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.error).toBeNull();
  });

  it('should handle upload error', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: new VerificationFailedError('Upload failed'),
      }),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Upload failed');
    expect(result.current.result).toBeNull();
  });

  it('should handle domain error', async () => {
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: new FileTooLargeError('File too large'),
      }),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('File too large');
  });

  it('should set error when uploading without file', async () => {
    const { result } = renderHook(() => useDocumentUpload());

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Aucun fichier sélectionné');
  });

  it('should reset state', async () => {
    const mockResult = createMockVerificationResult();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockResolvedValue({ success: true, data: mockResult }),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.status).toBe('success');

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.selectedFile).toBeNull();
  });

  it('should set uploading status during upload', async () => {
    const { container } = await import('@infrastructure/di');
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockReturnValue(promise),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    let uploadPromise: Promise<void>;
    act(() => {
      uploadPromise = result.current.upload();
    });

    expect(result.current.status).toBe('uploading');

    await act(async () => {
      resolvePromise!({ success: true, data: createMockVerificationResult() });
      await uploadPromise;
    });

    expect(result.current.status).toBe('success');
  });
});
