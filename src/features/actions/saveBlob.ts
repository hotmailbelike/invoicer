// Firefox and Safari read the object URL asynchronously after the click; revoking it at once
// can cancel the save. A minute is far longer than any save needs to start.
const REVOKE_AFTER_MS = 60_000;

export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  // Firefox ignores clicks on a link that is not in the document.
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, REVOKE_AFTER_MS);
}
