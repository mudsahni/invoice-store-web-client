// import React, {useState} from 'react';
// import {Document, Page,} from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
//
// // Set the worker source (try switching to cdnjs if needed)
// if (typeof window !== 'undefined') {
//     // Ensure the path starts with a leading slash
//     // pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs`;
//     pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.mjs`;
//
// }
//
// interface PDFViewerProps {
//     url: string;
// }
//
// const PDFViewer: React.FC<PDFViewerProps> = ({url}) => {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [pageNumber, setPageNumber] = useState<number>(1);
//     const [loading, setLoading] = useState<boolean>(true);
//
//     const onDocumentLoadSuccess = ({numPages}: { numPages: number }): void => {
//         console.log("PDF loaded successfully. Number of pages:", numPages);
//         setNumPages(numPages);
//         setLoading(false);
//     };
//
//     const onDocumentLoadError = (error: Error): void => {
//         console.error("Failed to load PDF:", error);
//         setLoading(false);
//     };
//
//     return (
//         <div className="flex flex-col items-center">
//             {loading && <div>Loading PDF...</div>}
//             <Document
//                 file={url}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={onDocumentLoadError}
//                 className="max-w-full"
//             >
//                 <Page
//                     pageNumber={pageNumber}
//                     renderTextLayer={true}
//                     renderAnnotationLayer={true}
//                     className="shadow-lg"
//                 />
//             </Document>
//             {numPages > 0 && (
//                 <div className="mt-4 flex items-center gap-4">
//                     <button
//                         onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
//                         disabled={pageNumber <= 1}
//                         className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//                     >
//                         Previous
//                     </button>
//                     <span>
//             Page {pageNumber} of {numPages}
//           </span>
//                     <button
//                         onClick={() => setPageNumber((page) => Math.min(numPages, page + 1))}
//                         disabled={pageNumber >= numPages}
//                         className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default PDFViewer;