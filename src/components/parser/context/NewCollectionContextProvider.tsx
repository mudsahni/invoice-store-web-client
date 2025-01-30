import React, {ReactNode, useState} from "react";
import {PDFFile, ProcessedData} from "@/components/parser/PDFFile";
import { NewCollectionContext } from "./NewCollectionContext";
import {CollectionStatusEvent} from "@/types/collections";

export interface NewCollectionContextProviderProps {
    children: ReactNode;
}

export const NewCollectionContextProvider: React.FC<NewCollectionContextProviderProps> = ({ children }) => {
    const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [processedData, setProcessedData] = useState<ProcessedData>({});
    const [selectedResult, setSelectedResult] = useState<string | null>(null);
    const [collectionName, setCollectionName] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [createCollectionEvents, setCreateCollectionEvents] = useState<CollectionStatusEvent[]>([]);

    const value = {
        pdfFiles,
        setPdfFiles,
        collectionName,
        setCollectionName,
        processedData,
        setProcessedData,
        selectedResult,
        setSelectedResult,
        success,
        setSuccess,
        error,
        setError,
        isProcessing,
        setIsProcessing,
        createCollectionEvents,
        setCreateCollectionEvents
    };

    return (
        <NewCollectionContext.Provider value={value}>
            {children}
        </NewCollectionContext.Provider>
    );
};
