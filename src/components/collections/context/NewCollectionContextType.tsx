import {PDFFile, ProcessedData} from "@/components/collections/PDFFile";
import React from "react";
import {CollectionStatusEvent} from "@/types/collections";


export interface NewCollectionContextType {
    pdfFiles: PDFFile[]
    setPdfFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>
    collectionName: string
    setCollectionName: React.Dispatch<React.SetStateAction<string>>
    processedData: ProcessedData
    setProcessedData: React.Dispatch<React.SetStateAction<ProcessedData>>
    selectedResult: string | null
    setSelectedResult: React.Dispatch<React.SetStateAction<string | null>>
    success: string
    setSuccess: React.Dispatch<React.SetStateAction<string>>
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>
    isProcessing: boolean
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    createCollectionEvents: CollectionStatusEvent[],
    setCreateCollectionEvents: React.Dispatch<React.SetStateAction<CollectionStatusEvent[]>>
}
