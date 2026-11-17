"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
export function PdfPreview({ file }) {
    const [pageCount, setPageCount] = useState(0);
    const [error, setError] = useState(false);
    return _jsxs("div", { className: "pdf-viewer", children: [error ? _jsxs("div", { className: "pdf-viewer__message", children: [_jsx("strong", { children: "We couldn\u2019t preview this PDF." }), _jsx("span", { children: "Your analysis is still ready to view." })] }) : _jsx(Document, { file: file, onLoadSuccess: ({ numPages }) => setPageCount(numPages), onLoadError: () => setError(true), loading: _jsx("div", { className: "pdf-viewer__message", children: "Opening your resume\u2026" }), error: _jsx("div", { className: "pdf-viewer__message", children: "We couldn\u2019t open this PDF." }), children: _jsx(Page, { pageNumber: 1, width: 390, renderTextLayer: false, renderAnnotationLayer: false, loading: _jsx("div", { className: "pdf-viewer__message", children: "Getting the page ready\u2026" }) }) }), !error && pageCount > 0 && _jsxs("span", { className: "pdf-viewer__count", children: ["Page 1 of ", pageCount] })] });
}
