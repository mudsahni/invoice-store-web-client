import React from 'react'
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";
import {DocumentField} from "@/components/invoices/utils";
import {TrashIcon} from "lucide-react";
import {TaxCategory} from "@/types/invoice";

interface BilledAmountProps {
}

export const BilledAmountDetails: React.FC<BilledAmountProps> = () => {
    const {
        edit,
        editableInvoice: invoice,
        handleInvoiceChange,
        setEditableInvoice: setInvoice,
        validationErrors
    } = useInvoiceContext();

    const errors = validationErrors || {};

    // Add these alongside your other handlers
    const addTax = () => {
        setInvoice(prev => {
            const newInvoice = JSON.parse(JSON.stringify(prev));
            if (!newInvoice.billedAmount.taxes) {
                newInvoice.billedAmount.taxes = [];
            }
            newInvoice.billedAmount.taxes.push({});
            return newInvoice;
        });
    };

    const removeTax = (taxIndex: number) => {
        setInvoice(prev => {
            const newInvoice = JSON.parse(JSON.stringify(prev));
            newInvoice.billedAmount.taxes.splice(taxIndex, 1);
            return newInvoice;
        });
    };


    return (
        <div className="rounded-lg">
            <span className="text-lg font-medium text-gray-800">Billed Amount</span>
            <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocumentField
                        label="Sub Total"
                        type="number"
                        path="billedAmount.subTotal"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.billedAmount?.subTotal || ''}
                        error={errors['invoice.billedAmount.subTotal']?.message}
                    />
                    <DocumentField
                        label="Total"
                        type="number"
                        path="billedAmount.total"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.billedAmount?.total || ''}
                        error={errors['invoice.billedAmount.total']?.message}
                    />
                    <DocumentField
                        label="Balance Due"
                        type="number"
                        path="billedAmount.balanceDue"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.billedAmount?.balanceDue || ''}
                        error={errors['invoice.billedAmount.balanceDue']?.message}
                    />
                    <DocumentField
                        label="Previous Dues"
                        type="number"
                        path="billedAmount.previousDues"
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.billedAmount?.previousDues || ''}
                        error={errors['invoice.billedAmount.previousDues']?.message}
                    />
                </div>
                <DocumentField
                    label="Amount in Words"
                    type="text"
                    path="billedAmount.amountInWords"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.billedAmount?.amountInWords || ''}
                    error={errors['invoice.billedAmount.amountInWords']?.message}
                />
                {invoice.billedAmount?.taxes && invoice.billedAmount?.taxes?.map((tax, taxIndex) => (
                    <div key={taxIndex}>
                        <div
                            className="flex items-center align-middle justify-between mt-4">
                            <h4 className="text-sm text-gray-700 mb-2">{`Tax ${taxIndex + 1}`}</h4>
                            {
                                edit && <button
                                    type="button"
                                    onClick={() => removeTax(taxIndex)}
                                    className="text-red-600 hover:text-red-800 mb-2"
                                >
                                    <TrashIcon className="h-4 w-4"/>
                                </button>
                            }

                        </div>
                        <div key={taxIndex}
                             className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-2 rounded-md">
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={tax.category || ""}
                                    disabled={!edit}
                                    onChange={(e) => handleInvoiceChange(`billedAmount.taxes[${taxIndex}].category`, e.target.value)}
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
                                    disabled={!edit}
                                    placeholder="Rate"
                                    value={tax.rate || ""}
                                    onChange={(e) => handleInvoiceChange(`billedAmount.taxes[${taxIndex}].rate`, e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium text-gray-700">Amount
                                    (%)</label>
                                <input
                                    type="number"
                                    disabled={!edit}
                                    placeholder="Amount"
                                    value={tax.amount || ""}
                                    onChange={(e) => handleInvoiceChange(`billedAmount.taxes[${taxIndex}].amount`, e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    )
}