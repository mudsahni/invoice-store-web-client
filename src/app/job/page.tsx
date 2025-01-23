// src/app/shell/page.tsx
// src/app/shell/page.tsx or src/app/job/page.tsx
'use client';

import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf-worker/pdf.worker.min.mjs';

interface FormField {
    label: string;
    value: string | number;
    type: string;
}

const ShellPage = () => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Example JSON data
    const [formData, setFormData] = useState<Record<string, FormField>>({
        invoiceNumber: { label: "Invoice Number", value: "INV-001", type: "text" },
        date: { label: "Date", value: "2024-01-04", type: "date" },
        amount: { label: "Amount", value: 1500.00, type: "number" },
        vendor: { label: "Vendor", value: "Tech Solutions Inc", type: "text" },
    });

    const handleInputChange = (key: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }));
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex h-[calc(100vh-4rem)]">
                {/* PDF Viewer Column */}
                <div className="w-1/2 p-4 border-r border-gray-700">
                    <div className="bg-gray-800 rounded-lg h-full p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Document Viewer</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                                        className="text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                                    >
                                        -
                                    </button>
                                    <span className="text-white">{Math.round(scale * 100)}%</span>
                                    <button
                                        onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                                        className="text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                                    >
                                        +
                                    </button>
                                </div>
                                {numPages && (
                                    <div className="flex items-center space-x-2 text-white">
                                        <button
                                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                                            disabled={pageNumber <= 1}
                                            className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            ←
                                        </button>
                                        <span>Page {pageNumber} of {numPages}</span>
                                        <button
                                            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                                            disabled={pageNumber >= numPages}
                                            className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-700 rounded-lg h-[90%] overflow-auto flex items-center justify-center">
                            <Document
                                file="/test_pdf.pdf" // Replace with your PDF path
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex justify-center"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    className="shadow-lg"
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="w-1/2 p-4 overflow-y-auto">
                    <div className="bg-gray-800 rounded-lg h-full p-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Document Fields</h2>
                        <form className="space-y-4">
                            {Object.entries(formData).map(([key, field]) => (
                                <div key={key} className="space-y-2">
                                    <label
                                        htmlFor={key}
                                        className="block text-sm font-medium text-gray-300"
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        id={key}
                                        value={field.value}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShellPage;