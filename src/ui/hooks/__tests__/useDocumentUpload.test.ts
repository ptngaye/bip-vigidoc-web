import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

function createDeferredPromise<T>() {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve: resolve! };
}

describe('useDocumentUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useDocumentUpload());

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.selectedFile).toBeNull();
  });

  it('should auto-start upload on file selection', async () => {
    const deferred = createDeferredPromise<{ success: boolean; data?: VerificationResult }>();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockReturnValue(deferred.promise),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    expect(result.current.selectedFile).toBe(file);
    expect(result.current.status).toBe('uploading');
  });

  it('should transition to processing state', async () => {
    const deferred = createDeferredPromise<{ success: boolean; data?: VerificationResult }>();
    const { container } = await import('@infrastructure/di');
    vi.mocked(container.verifyDocument).mockReturnValue({
      execute: vi.fn().mockReturnValue(deferred.promise),
    });

    const { result } = renderHook(() => useDocumentUpload());
    const file = createMockFile();

    act(() => {
      result.current.selectFile(file);
    });

    expect(result.current.status).toBe('uploading');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(result.current.status).toBe('processing');
  });

  it('should complete upload successfully', async () => {
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
      await vi.runAllTimersAsync();
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
      await vi.runAllTimersAsync();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Un problème est survenu. Réessayez dans quelques instants.');
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
      await vi.runAllTimersAsync();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('File too large');
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
      await vi.runAllTimersAsync();
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
});
