import React from 'react'
import {DocumentField} from "@/components/invoices/utils";
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";

interface BasicDetailsProps {
}

export const BasicDetails: React.FC<BasicDetailsProps> = () => {


    const {edit, editableInvoice: invoice, handleInvoiceChange, validationErrors} = useInvoiceContext();

    const errors = validationErrors || {};

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <DocumentField
                    label="Invoice Number"
                    type="text"
                    path="invoiceNumber"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.invoiceNumber || ''}
                    error={errors['invoice.invoiceNumber']?.message}
                />
                <DocumentField
                    label="Currency Code"
                    type="text"
                    path="currencyCode"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.currencyCode || ''}
                    error={errors['invoice.currencyCode']?.message}
                />
                <DocumentField
                    label="Billing Date"
                    type="date"
                    path="billingDate"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.billingDate}
                    error={errors['invoice.billingDate']?.message}
                />
                <DocumentField
                    label="Due Date"
                    type="date"
                    path="dueDate"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''}
                    error={errors['invoice.dueDate']?.message}
                />
                <DocumentField
                    label="Place of Supply"
                    type="text"
                    path="placeOfSupply"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.placeOfSupply || ''}
                    error={errors['invoice.placeOfSupply']?.message}
                />
                <DocumentField
                    label="IRN Number"
                    type="text"
                    path="irnNumber"
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.irnNumber || ''}
                    error={errors['invoice.irnNumber']?.message}
                />
            </div>
        </div>
    )
}