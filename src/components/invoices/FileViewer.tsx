import React, {useState} from 'react'
import {openDB} from "idb";
import {LoadingSpinner} from "@/components/LoadingSpinner";

interface FileViewerProps {
    name: string;
    loading: boolean;
    downloadLink: string;
    fileType: string; // 'pdf' | 'image'
}

const DB_NAME = 'files-db';
const STORE_NAME = 'files';

const MIME_TYPES = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    tiff: 'image/tiff',
    tif: 'image/tiff'
};

const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    for (const [type, mimeType] of Object.entries(MIME_TYPES)) {
        if (extension === type) {
            return mimeType;
        }
    }
    return 'application/pdf'; // default to PDF
};


export const FileViewer: React.FC<FileViewerProps> = ({name, loading, downloadLink, fileType}) => {
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
                const storedFile = await db.get(STORE_NAME, name);

                if (storedFile) {
                    console.log('File found in IndexedDB');
                    const mimeType = getFileType(name);
                    const blob = new Blob([storedFile], {type: mimeType});
                    const url = URL.createObjectURL(blob);
                    setCachedUrl(url);
                } else {
                    console.log('Downloading file...');
                    const response = await fetch(downloadLink);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const fileBlob = await response.blob();
                    const expectedMimeType = getFileType(name);

                    // Verify file type
                    if (!fileBlob.type.includes(expectedMimeType)) {
                        console.warn('Unexpected file type:', fileBlob.type);
                    }

                    // Store in IndexedDB
                    const arrayBuffer = await fileBlob.arrayBuffer();
                    await db.put(STORE_NAME, arrayBuffer, name);

                    const url = URL.createObjectURL(fileBlob);
                    setCachedUrl(url);
                }
            } catch (error) {
                console.error('Error handling file:', error);
                setError('Failed to load file');
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

    if (loading) {
        return <div><LoadingSpinner size={5}/></div>;
    }


    // Render different components based on file type
    if (fileType.includes("image")) {
        return (
            <img
                src={cachedUrl || 'about:blank'}
                alt={name}
                className="w-full rounded-xl object-contain max-h-screen"
            />
        );
    }


    return (
        <iframe
            src={cachedUrl || 'about:blank'}
            className="w-full h-screen rounded-xl max-h-[100%]"
            title="File Viewer"
        />
    );
}