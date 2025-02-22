'use client';
import React, {useState} from 'react'
import {ArrowPathIcon, PencilSquareIcon, PlusIcon} from "@heroicons/react/20/solid";
import {CurlyBracesIcon, FileIcon, SaveIcon, XCircleIcon} from "lucide-react";
import {documentService} from "@/services/documentService";
import {CacheManager} from "@/services/cacheManager";
import {CollectionDocument} from "@/types/collections";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import PageHeader from "@/components/ui/PageHeader";
import {FileViewer} from "@/components/invoices/FileViewer";
import {RawContentViewer} from "@/components/invoices/RawContentViewer";
import {DocumentIcon} from "@heroicons/react/16/solid";
import {MetadataDisplay} from "@/components/ui/MetadataDisplay";
import {StatusBadge} from "@/components/collection/utils";
import Content from '../ui/Content';
import {BasicDetails} from "@/components/invoices/BasicDetails";
import {VendorDetails} from "@/components/invoices/VendorDetails";
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";
import {PageLoadingSpinner} from "@/components/ui/PageLoadingSpinner";
import {CustomerDetails} from "@/components/invoices/CustomerDetails";
import {BilledAmountDetails} from "@/components/invoices/BilledAmountDetails";
import {LineItemsDetails} from "@/components/invoices/LineItemsDetails";
import {LoadingSpinner} from "@/components/LoadingSpinner";

interface InvoicePageProps {
    // onSubmit: (data: InvoiceWrapper) => void;
    invoiceId: string;
}

const documentCacheManager = new CacheManager<CollectionDocument>({
    prefix: 'document',
    ttl: 5 * 60 * 1000, // 5 minutes
    validator: (data) => data.id !== undefined
});

const documentDownloadLinkCache = new CacheManager<string>({
    prefix: 'documentDownloadLink',
    ttl: 50 * 60 * 1000, // 50 minutes
})

type NestedKeyOf<T> = {
    [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
}[keyof T & (string | number)];


export const InvoicePage: React.FC<InvoicePageProps> = ({invoiceId}) => {
    const [loading, setLoading] = useState(true);
    const [downloadLink, setDownloadLink] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const {
        edit,
        setEdit,
        invoice,
        editableInvoice,
        setInvoice,
        setEditableInvoice,
        setValidationErrors,
        validationErrors
    } = useInvoiceContext();


    const handleSaveDocument = async () => {
        setSaving(true);
        console.log("Saving document");
        setInvoice(editableInvoice)
        handleValidationRefresh()
        const fetchedDocument = await documentService.updateDocument(invoiceId, {
            structured: {invoice: editableInvoice},
            raw: JSON.stringify(editableInvoice, null, 2),
            errors: validationErrors
        })
        setDocument(fetchedDocument);
        documentCacheManager.set(invoiceId, fetchedDocument);
        if (fetchedDocument?.data?.structured?.invoice) {
            setInvoice(fetchedDocument.data.structured.invoice);
            setEditableInvoice(fetchedDocument.data.structured.invoice);
            if (fetchedDocument?.data?.errors) {
                setValidationErrors(fetchedDocument.data.errors)
            }
        }
        setSaving(false);
        setEdit(false)
    }
    const handleShowRawOrFile = () => {
        setShowRaw(prevState => !prevState);
    }


    const handleValidationRefresh = async () => {
        setValidating(true)
        console.log("Running the validation")
        const response = await documentService.validateDocument(invoiceId);
        console.log("Validation response", response);
        setValidationErrors(response);
        setValidating(false);
    }


    const handleCancelEdit = () => {
        setEdit(prevState => !prevState);
        setEditableInvoice(invoice);
    }

    const getDocument = async () => {
        try {
            setLoading(true);
            const documentFromCache = documentCacheManager.get(invoiceId);

            if (documentFromCache) {
                console.log("Document fetched from cache");
                setDocument(documentFromCache.data);
                // Safely set invoice data
                if (documentFromCache.data?.data?.structured?.invoice) {
                    setInvoice(documentFromCache.data.data.structured.invoice);
                    setEditableInvoice(documentFromCache.data.data.structured.invoice);
                    if (documentFromCache?.data?.data?.errors) {
                        setValidationErrors(documentFromCache.data.data.errors)
                    }
                }
            } else {
                console.log("Fetching document from service");
                const fetchedDocument = await documentService.getDocument(invoiceId);
                setDocument(fetchedDocument);
                documentCacheManager.set(invoiceId, fetchedDocument);

                // Safely set invoice data
                if (fetchedDocument?.data?.structured?.invoice) {
                    setInvoice(fetchedDocument.data.structured.invoice);
                    setEditableInvoice(fetchedDocument.data.structured.invoice);
                    if (fetchedDocument?.data?.errors) {
                        setValidationErrors(fetchedDocument.data.errors)
                    }
                }

            }
        } catch (error) {
            console.error('Error fetching document:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
            // first check the cache for download links, if not present or invalid, then fetch a new one
            const downloadLinkFromCache = documentDownloadLinkCache.get(invoiceId);
            if (downloadLinkFromCache) {
                setDownloadLink(downloadLinkFromCache.data);
            } else {
                const downloadDocumentResponse = await documentService.getDocumentDownloadLink(invoiceId);
                setDownloadLink(downloadDocumentResponse.downloadUrl);
                console.log(`Download Link: ${downloadDocumentResponse.downloadUrl}`)
            }
        }
    };

    // Fetch document on mount
    React.useEffect(() => {

        getDocument();

    }, [invoiceId]);

    const [document, setDocument] = useState<CollectionDocument | null>(null);

    if (loading) {
        return <PageLoadingSpinner/>
    }

    if (document === null || document === undefined || document.data.structured?.invoice === undefined) {
        return <div className="text-center text-gray-800">Document not found</div>
    }

    return (
        <Content>
            <Breadcrumbs/>
            <div className="my-4">
                <PageHeader title={"Document"}/>
            </div>
            <MetadataDisplay
                type={"Document"}
                name={document?.name || ""}
                items={[
                    {
                        id: "document_type",
                        label: "Document Type",
                        value: document?.type,
                        editable: false
                    },
                    {
                        id: "file_type",
                        label: "File Type",
                        value: document?.path,
                        editable: false
                    },
                    {
                        id: "collection_id",
                        label: "Collection",
                        value: document?.collectionId,
                        editable: false
                    }
                ]}
                date={document?.updatedAt ? new Date(document.updatedAt).toDateString() : new Date(document?.createdAt * 1000).toDateString()}
                icon={<FileIcon className={"h-4 mr-2"}/>}
                status={<StatusBadge status={document?.status.toString() || "Unavailable"}/>}
            />
            <div className="sm:flex justify-between sm:space-x-4 sm:space-y-0 space-y-4">
                <div className="sm:w-1/2 w-full h-full">
                    <div className="border-b border-gray-200 mb-4">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={handleShowRawOrFile}
                                className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${showRaw
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
            `}
                            >
                                <CurlyBracesIcon
                                    className={`
                    -ml-0.5 mr-2 h-4 w-4
                    ${showRaw ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                                />
                                Raw
                            </button>

                            <button
                                onClick={handleShowRawOrFile}
                                className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${!showRaw
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
            `}
                            >
                                <DocumentIcon
                                    className={`
                    -ml-0.5 mr-2 h-4 w-4
                    ${!showRaw ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                                />
                                File
                            </button>
                        </nav>
                    </div>
                    <div
                        className="w-full h-full mr-4 bg-gray-800 rounded-xl sm:p-2 p-2 sm:mb-0 mb-8 max-h-full overflow-y-scroll"
                    >
                        {
                            showRaw ?
                                <RawContentViewer loading={loading} content={document?.data.raw || ""}/> :
                                <FileViewer name={document.id} loading={loading} downloadLink={downloadLink || ""}/>
                        }

                    </div>
                </div>
                <div className="sm:w-1/2 w-full h-full ">
                    <div className="flex justify-end mb-8">
                        {
                            <>
                                <button
                                    disabled={saving || validating}
                                    onClick={handleCancelEdit}
                                    className={`flex mr-4 items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        edit
                                            ? 'text-red-800 border border-red-800 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500'
                                    }`}
                                >
                                    {edit ? (
                                        <XCircleIcon className="w-4 h-4 mr-2"/>
                                    ) : (
                                        <PencilSquareIcon className="w-4 h-4 mr-2"/>
                                    )}
                                    {edit ? 'Cancel' : 'Edit'}
                                </button>
                            </>
                        }
                        <div className="flex items-center space-x-4">
                            {edit && (
                                <button
                                    disabled={saving || validating}
                                    onClick={handleValidationRefresh}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-indigo-800 bg-indigo-100 border border-indigo-800 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {
                                        validating ? (
                                            <LoadingSpinner size={4} className="mr-2"/>
                                        ) : (
                                            <ArrowPathIcon className="w-4 h-4 mr-2"/>
                                        )
                                    }
                                    Validate
                                </button>
                            )}

                            {edit && (
                                <button
                                    onClick={handleSaveDocument}
                                    disabled={saving || validating}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-green-800 border-green-800 bg-green-100 border rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <LoadingSpinner size={4} className="mr-2"/>
                                    ) : (
                                        <SaveIcon className="w-4 h-4 mr-2"/>
                                    )}
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                    <form className="sm:p-8 p-4 bg-gray-50 rounded-xl flex flex-col h-screen">
                        <div className="flex justify-between items-center align-middle mb-8">
                            <h2 className="text-2xl/7 font-semibold text-gray-800">Document Content</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">

                            {/* Basic Invoice Details */}
                            <BasicDetails/>
                            <hr className="p-2"/>
                            {/* Customer Section */}
                            <CustomerDetails/>
                            <hr className="p-2"/>

                            {/* Vendor Section */}
                            <VendorDetails/>
                            <hr className="p-2"/>

                            {/* Line Items Section */}
                            <LineItemsDetails/>
                            <hr className="p-2"/>

                            {/* Billed Amount Section */}
                            <BilledAmountDetails/>
                        </div>
                    </form>
                </div>
            </div>
        </Content>
    );
};
