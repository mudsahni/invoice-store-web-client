'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, FolderOpen, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {useAuth} from "@/contexts/AuthContext";
import {random} from "nanoid";

interface PDFFile {
  id: string;
  selected: boolean;
  name: string;
  webkitRelativePath: string;
  type: string;
  size: number;
  lastModified: number;
  file: File;  // Store the actual File object
}

interface ProcessedData {
  [filename: string]: any;  // The parsed JSON data for each file
}

let fileCounter = 0;
const generateId = () => `pdf-${fileCounter++}`;

const PDFProcessingPage = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processedData, setProcessedData] = useState<ProcessedData>({});
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {user, name, email, role} = useAuth();

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Raw files from input:', files);

    const pdfFiles = files
      .filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
      .map(file => {
        // Keep the original File object in a property
        return {
          id: generateId(),
          selected: false,
          name: file.name,
          webkitRelativePath: file.webkitRelativePath,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          // Store the actual File object
          file: file
        };
      });

    console.log('Processed PDF files:', pdfFiles);
    setPdfFiles(pdfFiles);
    setError('');
    setSuccess('');
    setProcessedData({});
    setSelectedResult(null);

    if (files.length === 0) {
      setError('No folder selected');
    } else if (pdfFiles.length === 0) {
      setError('No PDF files found in the selected folder');
    }
  };

  const handleSelectAll = () => {
    setPdfFiles(prevFiles =>
      prevFiles.map(file => ({ ...file, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setPdfFiles(prevFiles =>
      prevFiles.map(file => ({ ...file, selected: false }))
    );
  };

  const toggleFileSelection = (fileId: string) => {
    setPdfFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFiles = pdfFiles.filter(file => file.selected);

    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file to process');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      // Log the files we're about to send
      console.log('Selected files:', selectedFiles);

      if (!user || !email) {
        throw new Error('User information not available');
      }

      formData.set('user_email', email);
      formData.set("collection_name", "test_collection" + Math.random() * 100);

      selectedFiles.forEach((pdfFile) => {
        // Use the stored File object
        const file = pdfFile.file;
        console.log(`Appending file: ${file.name}, size: ${file.size} bytes`);
        formData.append('pdfs', file, file.webkitRelativePath || file.name);
      });

      console.log('FormData:', formData.entries())

      // Log the FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      //https://invoice-processor-service-680783809446.asia-south1.run.app
      const response = await fetch('http://localhost:8080/api/v1/invoice-processor/process-pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process PDFs');

      const data = await response.json();
      setProcessedData(data.results);
      setSuccess(`Successfully processed ${selectedFiles.length} PDF files!`);

      // Select the first result by default
      const firstFileName = Object.keys(data.results)[0];
      if (firstFileName) {
        setSelectedResult(firstFileName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const selectedCount = pdfFiles.filter(file => file.selected).length;

  return (
    <main className="flex min-h-full flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-12">Perfect Accounting and Shared Services</h1>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">PDF Processing Dashboard</h1>
            <p className="text-gray-600">Select and process PDF files from a directory</p>
          </div>

          {/* File Selection and Upload Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFolderSelect}
                  className="hidden"
                  webkitdirectory=""
                  multiple
                />

                {pdfFiles.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={handleBrowseClick}
                  >
                    <FolderOpen className="h-12 w-12 text-gray-400 mb-3" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Click to browse for a folder</p>
                      <p className="text-xs text-gray-500 mt-1">Only PDF files will be processed</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {selectedCount} of {pdfFiles.length} PDF files selected
                      </div>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDeselectAll}
                        >
                          Deselect All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleBrowseClick}
                        >
                          Change Folder
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className={`${pdfFiles.length > 6 ? 'max-h-96' : ''} overflow-y-auto`}>
                        {pdfFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex items-center min-w-0 flex-1">
                              <Checkbox
                                checked={file.selected}
                                onCheckedChange={() => toggleFileSelection(file.id)}
                                className="mr-3 shrink-0"
                              />
                              <FileText className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-900 truncate">
                                  {file.webkitRelativePath ? file.webkitRelativePath.split('/').pop() : file.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {file.webkitRelativePath || file.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {pdfFiles.length > 0 && (
                <Button
                  type="submit"
                  disabled={isProcessing || selectedCount === 0}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing {selectedCount} files...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Process {selectedCount} Selected Files
                    </>
                  )}
                </Button>
              )}
            </form>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Results Section - Two Column Layout */}
          {Object.keys(processedData).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="grid grid-cols-12 divide-x divide-gray-200">
                {/* Left Column - File List */}
                <div className="col-span-4 max-h-[600px] overflow-y-auto">
                  {Object.keys(processedData).map((filename) => (
                    <div
                      key={filename}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedResult === filename ? 'bg-blue-50 hover:bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedResult(filename)}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                        <span className="text-sm text-gray-900 truncate">
                          {filename.split('/').pop()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column - JSON Display */}
                <div className="col-span-8 p-6">
                  {selectedResult ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Parsed Data for {selectedResult.split('/').pop()}
                      </h3>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">
                          {JSON.stringify(processedData[selectedResult], null, 2)}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Select a file to view its parsed data
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PDFProcessingPage;