import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PdfRenderInput } from '@/domain/pdf-plan/invoicePlan';
import { loadPdfRenderer } from './loadPdfRenderer';

export type PdfPreviewState =
  | { readonly status: 'pending' }
  | { readonly status: 'ready'; readonly url: string; readonly isUpdating: boolean }
  | { readonly status: 'failed' };

const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 2_000;

/**
 * Renders the invoice to a PDF object URL whenever its content changes.
 *
 * Rendering is synchronous CPU work, so it waits for a pause in typing, scaled to how long the
 * last render took on this machine. There is deliberately no maximum wait: a guaranteed
 * periodic render would freeze the form mid-sentence on a slow device.
 */
export function useInvoicePdf(input: PdfRenderInput, enabled: boolean) {
  const inputKey = JSON.stringify(input);
  const [preview, setPreview] = useState<PdfPreviewState>({ status: 'pending' });
  const [retryCount, setRetryCount] = useState(0);
  const latestRequestRef = useRef(0);
  const lastRenderMsRef = useRef<number | undefined>(undefined);
  const currentUrlRef = useRef<string | undefined>(undefined);

  const renderLatest = useEffectEvent(async (requestId: number) => {
    setPreview((current) =>
      current.status === 'ready' ? { ...current, isUpdating: true } : current,
    );
    const startedAt = performance.now();
    try {
      const render = await loadPdfRenderer();
      const blob = await render(input);
      // A newer edit superseded this render while it ran; its result is already stale.
      if (requestId !== latestRequestRef.current) {
        return;
      }
      lastRenderMsRef.current = performance.now() - startedAt;
      const previousUrl = currentUrlRef.current;
      const url = URL.createObjectURL(blob);
      currentUrlRef.current = url;
      setPreview({ status: 'ready', url, isUpdating: false });
      // Safe even while the old frame is still on screen: a loaded PDF no longer reads its URL.
      if (previousUrl !== undefined) {
        URL.revokeObjectURL(previousUrl);
      }
    } catch (error) {
      if (requestId !== latestRequestRef.current) {
        return;
      }
      console.error('Invoicer could not render the preview.', error);
      if (currentUrlRef.current !== undefined) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = undefined;
      }
      setPreview({ status: 'failed' });
    }
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;
    const lastRenderMs = lastRenderMsRef.current;
    const delay =
      lastRenderMs === undefined
        ? 0
        : Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, Math.round(lastRenderMs * 1.5)));
    const timer = window.setTimeout(() => {
      void renderLatest(requestId);
    }, delay);
    return () => {
      window.clearTimeout(timer);
    };
  }, [inputKey, retryCount, enabled]);

  function retry(): void {
    setPreview({ status: 'pending' });
    setRetryCount((count) => count + 1);
  }

  return { preview, retry };
}
