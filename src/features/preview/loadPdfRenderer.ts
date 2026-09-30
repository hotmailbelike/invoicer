// The only module allowed to load the PDF runtime. Everything imported from @/pdf here is a
// type or an asset URL except the dynamic import(), which keeps @react-pdf/renderer out of the
// entry chunk until the first render asks for it.
import interRegularUrl from '@/pdf/fonts/inter-400.ttf?url';
import interSemiBoldUrl from '@/pdf/fonts/inter-600.ttf?url';
import type { InvoicePdfRenderer } from '@/pdf/createInvoicePdfRenderer';

async function fetchFontFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load the invoice font from ${url} (HTTP ${response.status}).`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function createRenderer(): Promise<InvoicePdfRenderer> {
  const [runtime, regular, semiBold] = await Promise.all([
    import('@/pdf/createInvoicePdfRenderer'),
    fetchFontFile(interRegularUrl),
    fetchFontFile(interSemiBoldUrl),
  ]);
  return runtime.createInvoicePdfRenderer({ regular, semiBold });
}

let rendererPromise: Promise<InvoicePdfRenderer> | undefined;

export function loadPdfRenderer(): Promise<InvoicePdfRenderer> {
  if (rendererPromise === undefined) {
    const attempt = createRenderer();
    rendererPromise = attempt;
    // Forget a failed load (offline, or a redeploy replaced the chunk) so the next call
    // retries instead of replaying the same rejection for the rest of the session.
    attempt.catch(() => {
      if (rendererPromise === attempt) {
        rendererPromise = undefined;
      }
    });
  }
  return rendererPromise;
}
