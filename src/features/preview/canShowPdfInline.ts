// Only an explicit false opts out: browsers predating the property leave it undefined, and every
// desktop browser this app targets can display a PDF in a frame.
export const canShowPdfInline = navigator.pdfViewerEnabled !== false;
