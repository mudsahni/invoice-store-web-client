'use client';
import React, {useState} from 'react'
import {PlusIcon} from "@heroicons/react/20/solid";
import {TrashIcon} from "lucide-react";
import {Invoice, TaxCategory} from "@/types/invoice";
import {documentService} from "@/services/documentService";
import {CacheManager} from "@/services/cacheManager";
import {CollectionDocument} from "@/types/collections";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";

interface InvoicePageProps {
    // onSubmit: (data: InvoiceWrapper) => void;
    invoiceId: string;
}

const documentCacheManager = new CacheManager<CollectionDocument>({
    prefix: 'document',
    ttl: 5 * 60 * 1000, // 5 minutes
    validator: (data) => data.id !== undefined
});

type NestedKeyOf<T> = {
    [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
}[keyof T & (string | number)];


export const InvoicePage: React.FC<InvoicePageProps> = ({invoiceId}) => {
    type SectionName = 'customer' | 'vendor' | 'billedAmount' | 'lineItems' | 'bankDetails';
    const [loading, setLoading] = useState(true);
    const [downloadLink, setDownloadLink] = useState<string | null>(null);

    // Fetch document on mount
    React.useEffect(() => {
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
                    }
                } else {
                    console.log("Fetching document from service");
                    const fetchedDocument = await documentService.getDocument(invoiceId);
                    setDocument(fetchedDocument);
                    documentCacheManager.set(invoiceId, fetchedDocument);

                    // Safely set invoice data
                    if (fetchedDocument?.data?.structured?.invoice) {
                        setInvoice(fetchedDocument.data.structured.invoice);
                        // Initialize line items and bank details if they exist
                    }
                }
            } catch (error) {
                console.error('Error fetching document:', error);
                // Handle error appropriately
            } finally {
                setLoading(false);
                const downloadDocumentResponse = await documentService.downloadDocument(invoiceId);
                setDownloadLink(downloadDocumentResponse.downloadUrl);
                console.log(`Download Link: ${downloadDocumentResponse.downloadUrl}`)
            }
        };

        getDocument();

    }, [invoiceId]);

    const [document, setDocument] = useState<CollectionDocument | {}>({});
    const [invoice, setInvoice] = useState<Invoice>({})

    const addLineItem = () => {
        setInvoice(prev => ({
            ...prev,
            lineItems: [...(prev.lineItems || []), {}]
        }));
    };
    const removeLineItem = (index: number) => {
        setInvoice(prev => ({
            ...prev,
            lineItems: prev.lineItems?.filter((_, i) => i !== index) || []
        }));
    };


    // Similar handlers for bank details
    const addBankDetail = () => {
        setInvoice(prev => ({
            ...prev,
            vendor: {
                ...(prev.vendor || {}),
                bankDetails: [...(prev.vendor?.bankDetails || []), {}]
            }
        }));
    };

    const removeBankDetail = (index: number) => {
        setInvoice(prev => ({
            ...prev,
            vendor: {
                ...(prev.vendor || {}),
                bankDetails: prev.vendor?.bankDetails?.filter((_, i) => i !== index) || []
            }
        }));
    }

    // Add these alongside your other handlers
    const addTax = (lineItemIndex: number) => {
        setInvoice(prev => {
            const newInvoice = JSON.parse(JSON.stringify(prev));
            if (!newInvoice.lineItems[lineItemIndex].taxes) {
                newInvoice.lineItems[lineItemIndex].taxes = [];
            }
            newInvoice.lineItems[lineItemIndex].taxes.push({});
            return newInvoice;
        });
    };

    const removeTax = (lineItemIndex: number, taxIndex: number) => {
        setInvoice(prev => {
            const newInvoice = JSON.parse(JSON.stringify(prev));
            newInvoice.lineItems[lineItemIndex].taxes.splice(taxIndex, 1);
            return newInvoice;
        });
    };


    // Single handler for all invoice updates
    const handleInvoiceChange = (path: string, value: any) => {
        setInvoice(prev => {
            // Create a deep copy of the previous state
            const newInvoice = JSON.parse(JSON.stringify(prev));

            // Handle array paths (like lineItems[0].description)
            const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
            const keys = normalizedPath.split('.');

            let current = newInvoice;
            const lastKey = keys.pop()!;

            // Build the path if it doesn't exist
            for (const key of keys) {
                if (!(key in current)) {
                    // If next key is a number, initialize an array
                    const nextKey = keys[keys.indexOf(key) + 1];
                    current[key] = !isNaN(Number(nextKey)) ? [] : {};
                }
                current = current[key];
            }

            current[lastKey] = value;
            return newInvoice;
        });
    };


    return (
        <div className="max-w-8xl w-full mx-auto sm:py-8 sm:px-2 p-2 bg-gray-800 rounded-xl mt-8">
            <div className="mb-8 sm:pt-0 pt-4">
                <Breadcrumbs pages={
                    [
                        {name: "Invoices", href: "/invoices", current: false},
                        {name: "Invoice", href: `/invoices/${invoiceId}`, current: true}
                    ]
                }
                />

            </div>
            <div className="sm:flex justify-between">
                <div className="h-[100vh] min-h-[1000px] w-full mr-4 bg-gray-50 rounded-xl sm:p-8 p-4 sm:mb-0 mb-8">
                    {
                        loading ? <div>Loading...</div> : <iframe
                            src={downloadLink || "about:blank"}
                            className="w-full h-screen rounded-xl"
                            title="PDF Viewer"
                        />
                    }
                </div>
                <form className="sm:p-8 p-4 bg-gray-50 rounded-xl sm:w-[80%]">
                    {/* Basic Invoice Details */}
                    <div className="space-y-6 mb-8">
                        <h2 className="text-2xl/7 font-semibold text-gray-800">Invoice Details</h2>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                                <input
                                    value={invoice.invoiceNumber || ""}
                                    onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Currency Code</label>
                                <input
                                    value={invoice.currencyCode || ""}
                                    onChange={(e) => handleInvoiceChange('currencyCode', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Billing Date</label>
                                <input
                                    value={invoice.billingDate || ""}
                                    onChange={(e) => handleInvoiceChange('billingDate', e.target.value)}
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Place of Supply</label>
                                <input
                                    value={invoice.placeOfSupply || ""}
                                    onChange={(e) => handleInvoiceChange('placeOfSupply', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="p-2"/>
                    {/* Customer Section */}
                    <div className="rounded-lg mb-6">
                        <span className="text-xl font-medium text-gray-800">Customer Details</span>

                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        value={invoice.customer?.name || ""}
                                        onChange={(e) => handleInvoiceChange('customer.name', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                                    <input
                                        value={invoice.customer?.gstNumber || ""}
                                        onChange={(e) => handleInvoiceChange('customer.gstNumber', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                                    <input
                                        value={invoice.customer?.pan || ""}
                                        onChange={(e) => handleInvoiceChange('customer.pan', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                                <textarea
                                    value={invoice.customer?.billingAddress || ""}
                                    onChange={(e) => handleInvoiceChange('customer.billingAddress', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                                <textarea
                                    value={invoice.customer?.shippingAddress || ""}
                                    onChange={(e) => handleInvoiceChange('customer.shippingAddress', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="p-2"/>

                    {/* Vendor Section */}
                    <div className="rounded-lg mb-6">
                        <span className="text-xl font-medium text-gray-800">Vendor Details</span>
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        value={invoice.vendor?.name || ""}
                                        onChange={(e) => handleInvoiceChange('vendor.name', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                                    <input
                                        value={invoice.vendor?.gstNumber || ""}
                                        onChange={(e) => handleInvoiceChange('vendor.gstNumber', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                                    <input
                                        value={invoice.vendor?.pan || ""}
                                        onChange={(e) => handleInvoiceChange('vendor.pan', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                                    <input
                                        value={invoice.vendor?.upiId || ""}
                                        onChange={(e) => handleInvoiceChange('vendor.upiId', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    value={invoice.vendor?.address || ""}
                                    onChange={(e) => handleInvoiceChange('vendor.address', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    rows={3}
                                />
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-4 bg-gray-100 rounded-xl">
                                <div className="flex justify-between items-center p-4">
                                    <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
                                    <button
                                        type="button"
                                        onClick={addBankDetail}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1"/>
                                        Add Bank
                                    </button>
                                </div>
                                {invoice.vendor?.bankDetails && invoice.vendor.bankDetails.map((_, index) => (
                                    <div key={index} className="rounded-md p-4 space-y-4">
                                        <div className="flex justify-between">
                                        <span
                                            className="text-sm text-gray-700 font-semibold">Bank #{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeBankDetail(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>

                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Bank
                                                    Name</label>
                                                <input
                                                    value={invoice.vendor?.bankDetails?.[index]?.bankName || ""}
                                                    onChange={(e) => handleInvoiceChange(`vendor.bankDetails.${index}.bankName`, e.target.value)}
                                                    type="text"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Account
                                                    Number</label>
                                                <input
                                                    value={invoice.vendor?.bankDetails?.[index]?.accountNumber || ""}
                                                    onChange={(e) => handleInvoiceChange(`vendor.bankDetails.${index}.accountNumber`, e.target.value)}
                                                    type="text"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">IFSC</label>
                                                <input
                                                    value={invoice.vendor?.bankDetails?.[index]?.ifsc || ""}
                                                    onChange={(e) => handleInvoiceChange(`vendor.bankDetails.${index}.ifsc`, e.target.value)}
                                                    type="text"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700">Branch</label>
                                                <input
                                                    value={invoice.vendor?.bankDetails?.[index]?.branch || ""}
                                                    onChange={(e) => handleInvoiceChange(`vendor.bankDetails.${index}.branch`, e.target.value)}
                                                    type="text"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Branch
                                                Address</label>
                                            <textarea
                                                value={invoice.vendor?.bankDetails?.[index]?.branchAddress || ""}
                                                onChange={(e) => handleInvoiceChange(`vendor.bankDetails.${index}.branchAddress`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <hr className="p-2"/>

                    {/* Line Items Section */}
                    <div className="rounded-lg pb-8">
                        <span className="text-lg font-medium text-gray-800">Line Items</span>
                        <div className="py-y space-y-4">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={addLineItem}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1"/>
                                    Add Line Item
                                </button>
                            </div>

                            {invoice.lineItems && invoice.lineItems.map((_, index) => (
                                <div key={index} className="bg-gray-100 rounded-xl p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base font-medium text-gray-800">Item {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeLineItem(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700">Description</label>
                                            <input
                                                type="text"
                                                value={invoice.lineItems?.[index]?.description || ""}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.description`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700">HSN/SAC</label>
                                            <input
                                                type="text"
                                                value={invoice.lineItems?.[index]?.hsnSac || ""}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.hsnSac`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rate</label>
                                            <input
                                                type="number"
                                                value={invoice.lineItems?.[index]?.rate || ""}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.rate`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                                            <input
                                                type="number"
                                                value={invoice.lineItems?.[index]?.amount || ""}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.amount`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Quantity
                                                Value</label>
                                            <input
                                                type="number"
                                                value={invoice.lineItems?.[index]?.quantity?.value || 1}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.quantity.value`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Unit</label>
                                            <input
                                                type="text"
                                                value={invoice.lineItems?.[index]?.quantity?.unit || ""}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.quantity.unit`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Discount
                                                Percentage</label>
                                            <input
                                                type="number"
                                                value={invoice.lineItems?.[index]?.discount?.percentage || 0}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.discount.percentage`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Discount
                                                Amount</label>
                                            <input
                                                type="number"
                                                value={invoice.lineItems?.[index]?.discount?.amount || 0}
                                                onChange={(e) => handleInvoiceChange(`lineItems.${index}.discount.amount`, e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Taxes */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-medium text-gray-700">Taxes</label>
                                            <button
                                                type="button"
                                                onClick={() => addTax(index)}
                                                className="inline-flex items-center px-2 py-1 text-xs border border-transparent font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                                            >
                                                <PlusIcon className="h-3 w-3 mr-1"/>
                                                Add Tax
                                            </button>
                                        </div>
                                        {invoice.lineItems && invoice.lineItems[index]?.taxes && invoice.lineItems[index]?.taxes?.map((tax, taxIndex) => (
                                            <div>
                                                <div className="flex items-center align-middle justify-between mt-4">
                                                    <h4 className="text-sm text-gray-700 mb-2">{`Tax ${taxIndex + 1}`}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTax(index, taxIndex)}
                                                        className="text-red-600 hover:text-red-800 mb-2"
                                                    >
                                                        <TrashIcon className="h-4 w-4"/>
                                                    </button>

                                                </div>
                                                <div key={taxIndex}
                                                     className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-2 rounded-md">
                                                    <div className="space-y-2">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700">Category</label>
                                                        <select
                                                            value={tax.category || ""}
                                                            onChange={(e) => handleInvoiceChange(`lineItems.${index}.taxes.${taxIndex}.category`, e.target.value)}
                                                            aria-placeholder={tax.category || "Select Tax"}
                                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                        >
                                                            <option value="">{}</option>
                                                            {Object.values(TaxCategory).map(category => (
                                                                <option key={category}
                                                                        value={category}>{category}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700">Rate
                                                            (%)</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Rate"
                                                            value={tax.rate || ""}
                                                            onChange={(e) => handleInvoiceChange(`lineItems.${index}.taxes.${taxIndex}.rate`, e.target.value)}
                                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700">Amount
                                                            (%)</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            value={tax.amount || ""}
                                                            onChange={(e) => handleInvoiceChange(`lineItems.${index}.taxes.${taxIndex}.amount`, e.target.value)}
                                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="p-2"/>

                    {/* Billed Amount Section */}
                    <div className="rounded-lg">
                        <span className="text-lg font-medium text-gray-800">Billed Amount</span>
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sub Total</label>
                                    <input
                                        type="number"
                                        value={invoice.billedAmount?.subTotal || ""}
                                        onChange={(e) => handleInvoiceChange('billedAmount.subTotal', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total</label>
                                    <input
                                        type="number"
                                        value={invoice.billedAmount?.total || ""}
                                        onChange={(e) => handleInvoiceChange('billedAmount.total', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Balance Due</label>
                                    <input
                                        type="number"
                                        value={invoice.billedAmount?.balanceDue || ""}
                                        onChange={(e) => handleInvoiceChange('billedAmount.balanceDue', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Previous Dues</label>
                                    <input
                                        type="number"
                                        value={invoice.billedAmount?.previousDues || ""}
                                        onChange={(e) => handleInvoiceChange('billedAmount.previousDues', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount in Words</label>
                                <input
                                    type="text"
                                    value={invoice.billedAmount?.amountInWords || ""}
                                    onChange={(e) => handleInvoiceChange('billedAmount.amountInWords', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="text-base px-4 py-2 bg-sky-200 border-2 border-sky-800 font-medium text-sky-800 rounded-lg hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                            Save Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
