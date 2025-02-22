import React, {useState} from 'react'
import {openDB} from "idb";

interface FileViewerProps {
    name: string;
    loading: boolean;
    downloadLink: string;
}

const DB_NAME = 'files-db';
const STORE_NAME = 'pdfs';


export const FileViewer: React.FC<FileViewerProps> = ({name, loading, downloadLink}) => {
    const [cachedUrl, setCachedUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    React.useEffect(() => {
        const initializeDB = async () => {
            try {
                const db = await openDB(DB_NAME, 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains(STORE_NAME)) {
                            db.createObjectStore(STORE_NAME);
                        }
                    },
                });

                // Try to get the file from IndexedDB first
                const storedPdf = await db.get(STORE_NAME, name);

                if (storedPdf) {
                    console.log('PDF found in IndexedDB');
                    const blob = new Blob([storedPdf], {
                        type: 'application/pdf'
                    });
                    const url = URL.createObjectURL(blob);
                    setCachedUrl(url);
                } else {
                    console.log('Downloading PDF...');
                    const response = await fetch(downloadLink);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const pdfBlob = await response.blob();

                    // Verify we got a PDF
                    if (pdfBlob.type !== 'application/pdf') {
                        console.warn('Response is not a PDF:', pdfBlob.type);
                    }

                    // Store in IndexedDB
                    const arrayBuffer = await pdfBlob.arrayBuffer();
                    await db.put(STORE_NAME, arrayBuffer, name);

                    const url = URL.createObjectURL(pdfBlob);
                    setCachedUrl(url);
                }
            } catch (error) {
                console.error('Error handling PDF:', error);
                setError('Failed to load PDF');
                // Fallback to direct link
                setCachedUrl(downloadLink);
            }
        };

        if (downloadLink) {
            initializeDB();
        }

        return () => {
            if (cachedUrl && cachedUrl.startsWith('blob:')) {
                URL.revokeObjectURL(cachedUrl);
            }
        };
    }, [name, downloadLink]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            {
                loading ? <div>Loading...</div> : <iframe
                    src={cachedUrl || 'about:blank'}
                    className="w-full h-screen rounded-xl max-h-[100%]"
                    title="PDF Viewer"
                />
            }
        </>
    )
}