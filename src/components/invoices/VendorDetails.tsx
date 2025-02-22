import React from 'react'
import {DocumentField} from "@/components/invoices/utils";
import {PlusIcon} from "@heroicons/react/20/solid";
import {TrashIcon} from "lucide-react";
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";

interface VendorDetailsProps {
}

export const VendorDetails: React.FC<VendorDetailsProps> = () => {

    const {
        edit,
        editableInvoice: invoice,
        handleInvoiceChange,
        validationErrors,
        setEditableInvoice: setInvoice
    } = useInvoiceContext();

    const errors = validationErrors || {};

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

    return (
        <div className="rounded-lg mb-6">
            <span className="text-xl font-medium text-gray-800">Vendor Details</span>
            <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocumentField
                        label="Name"
                        type="text"
                        path="vendor.name"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.vendor?.name || ''}
                        error={errors['invoice.vendor.name']?.message}
                    />
                    <DocumentField
                        label="GST Number"
                        type="text"
                        path="vendor.gstNumber"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.vendor?.gstNumber || ''}
                        error={errors['invoice.vendor.gstNumber']?.message}
                    />
                    <DocumentField
                        label="PAN"
                        type="text"
                        path="vendor.pan"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.vendor?.pan || ''}
                        error={errors['invoice.vendor.pan']?.message}
                    />
                    <DocumentField
                        label="UPI ID"
                        type="text"
                        path="vendor.upiId"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.vendor?.upiId || ''}
                        error={errors['invoice.vendor.upiId']?.message}
                    />
                </div>
                <DocumentField
                    label="Address"
                    type="textarea"
                    path="vendor.address"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.vendor?.address || ''}
                    error={errors['invoice.vendor.address']?.message}
                />

                {/* Bank Details */}
                <div className="space-y-4 bg-gray-100 rounded-xl">
                    <div className="flex justify-between items-center p-4">
                        <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
                        {
                            edit && <button
                                type="button"
                                onClick={addBankDetail}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                            >
                                <PlusIcon className="h-4 w-4 mr-1"/>
                                Add Bank
                            </button>
                        }
                    </div>
                    {invoice.vendor?.bankDetails && invoice.vendor.bankDetails.map((_, index) => (
                        <div key={index} className="rounded-md p-4 space-y-4">
                            <div className="flex justify-between">
                                <span
                                    className="text-sm text-gray-700 font-semibold">Bank #{index + 1}</span>
                                {
                                    edit && <button
                                        type="button"
                                        onClick={() => removeBankDetail(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                }
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentField
                                    label="Bank Name"
                                    type="text"
                                    path={`vendor.bankDetails.${index}.bankName`}
                                    handleOnChange={handleInvoiceChange}
                                    disabled={!edit}
                                    value={invoice.vendor?.bankDetails?.[index]?.bankName || ""}
                                    error={errors[`invoice.vendor.bankDetails.${index}.bankName`]?.message}
                                />
                                <DocumentField
                                    label="Account Number"
                                    type="text"
                                    path={`vendor.bankDetails.${index}.accountNumber`}
                                    handleOnChange={handleInvoiceChange}
                                    disabled={!edit}
                                    value={invoice.vendor?.bankDetails?.[index]?.accountNumber || ""}
                                    error={errors[`invoice.vendor.bankDetails.${index}.accountNumber`]?.message}
                                />
                                <DocumentField
                                    label="IFSC"
                                    type="text"
                                    path={`vendor.bankDetails.${index}.ifsc`}
                                    handleOnChange={handleInvoiceChange}
                                    disabled={!edit}
                                    value={invoice.vendor?.bankDetails?.[index]?.ifsc || ""}
                                    error={errors[`invoice.vendor.bankDetails.${index}.ifsc`]?.message}
                                />
                                <DocumentField
                                    label="Branch"
                                    type="text"
                                    path={`vendor.bankDetails.${index}.branch`}
                                    handleOnChange={handleInvoiceChange}
                                    disabled={!edit}
                                    value={invoice.vendor?.bankDetails?.[index]?.branch || ""}
                                    error={errors[`invoice.vendor.bankDetails.${index}.branch`]?.message}
                                />
                            </div>
                            <DocumentField
                                label="Branch Address"
                                type="textarea"
                                path={`vendor.bankDetails.${index}.branchAddress`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.vendor?.bankDetails?.[index]?.branchAddress || ""}
                                error={errors[`invoice.vendor.bankDetails.${index}.branchAddress`]?.message}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}