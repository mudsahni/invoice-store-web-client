import React from 'react'
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";
import {DocumentField} from "@/components/invoices/utils";

interface BilledAmountProps {
}

export const BilledAmountDetails: React.FC<BilledAmountProps> = () => {
    const {edit, editableInvoice: invoice, handleInvoiceChange, validationErrors} = useInvoiceContext();

    const errors = validationErrors || {};

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
            </div>
        </div>
    )
}