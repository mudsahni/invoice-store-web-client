import React from 'react'
import {PlusIcon} from "@heroicons/react/20/solid";
import {TrashIcon} from "lucide-react";
import {TaxCategory} from "@/types/invoice";
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";
import {DocumentField} from "@/components/invoices/utils";


interface LineItemsDetailsProps {
}

export const LineItemsDetails: React.FC<LineItemsDetailsProps> = () => {

    const {
        edit,
        editableInvoice: invoice,
        handleInvoiceChange,
        setEditableInvoice: setInvoice,
        validationErrors
    } = useInvoiceContext();
    const errors = validationErrors || {};

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

    return (
        <div className="rounded-lg pb-8">
            <span className="text-lg font-medium text-gray-800">Line Items</span>
            <div className="py-y space-y-4">
                <div className="flex justify-end">
                    {
                        edit && <button
                            type="button"
                            onClick={addLineItem}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-1"/>
                            Add Line Item
                        </button>

                    }
                </div>

                {invoice.lineItems && invoice.lineItems.map((_, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="text-base font-medium text-gray-800">Item {index + 1}</h4>
                            {
                                edit && <button
                                    type="button"
                                    onClick={() => removeLineItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            }
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DocumentField
                                label="Description"
                                type="text"
                                path={`lineItems.${index}.description`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.description || ""}
                                error={errors[`invoice.lineItems.${index}.description`]?.message}
                            />
                            <DocumentField
                                label="HSN/SAC"
                                type="text"
                                path={`lineItems.${index}.hsnSac`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.hsnSac || ""}
                                error={errors[`invoice.lineItems.${index}.hsnSac`]?.message}
                            />
                            <DocumentField
                                label="Rate"
                                type="number"
                                path={`lineItems.${index}.rate`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.rate || ""}
                                error={errors[`invoice.lineItems.${index}.rate`]?.message}
                            />
                            <DocumentField
                                label="Amount"
                                type="number"
                                path={`lineItems.${index}.amount`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.amount || ""}
                                error={errors[`invoice.lineItems.${index}.amount`]?.message}
                            />
                        </div>

                        {/* Quantity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DocumentField
                                label="Quantity Value"
                                type="number"
                                path={`lineItems.${index}.quantity.value`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.quantity?.value || 1}
                                error={errors[`invoice.lineItems.${index}.quantity.value`]?.message}
                            />
                            <DocumentField
                                label="Unit"
                                type="text"
                                path={`lineItems.${index}.quantity.unit`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.quantity?.unit || ""}
                                error={errors[`invoice.lineItems.${index}.quantity.unit`]?.message}
                            />
                        </div>

                        {/* Discount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DocumentField
                                label="Discount Percentage"
                                type="text"
                                path={`lineItems.${index}.discount.percentage`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.discount?.percentage || ""}
                                error={errors[`invoice.lineItems.${index}.discount.percentage`]?.message}
                            />
                            <DocumentField
                                label="Discount Amount"
                                type="text"
                                path={`lineItems.${index}.discount.amount`}
                                handleOnChange={handleInvoiceChange}
                                disabled={!edit}
                                value={invoice.lineItems?.[index]?.discount?.amount || ""}
                                error={errors[`invoice.lineItems.${index}.discount.amount`]?.message}
                            />
                        </div>

                        {/* Taxes */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    className="block text-sm font-medium text-gray-700">Taxes</label>
                                {
                                    edit && <button
                                        type="button"
                                        onClick={() => addTax(index)}
                                        className="inline-flex items-center px-2 py-1 text-xs border border-transparent font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                                    >
                                        <PlusIcon className="h-3 w-3 mr-1"/>
                                        Add Tax
                                    </button>

                                }
                            </div>
                            {invoice.lineItems && invoice.lineItems[index]?.taxes && invoice.lineItems[index]?.taxes?.map((tax, taxIndex) => (
                                <div>
                                    <div
                                        className="flex items-center align-middle justify-between mt-4">
                                        <h4 className="text-sm text-gray-700 mb-2">{`Tax ${taxIndex + 1}`}</h4>
                                        {
                                            edit && <button
                                                type="button"
                                                onClick={() => removeTax(index, taxIndex)}
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
                                                disabled={!edit}
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
                                                disabled={!edit}
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

    )
}