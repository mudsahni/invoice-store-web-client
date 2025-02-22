import React from 'react'
import {DocumentField} from "@/components/invoices/utils";
import {useInvoiceContext} from "@/components/invoices/context/InvoiceContext";

interface CustomerDetailsProps {
}


export const CustomerDetails: React.FC<CustomerDetailsProps> = () => {

    const {editableInvoice: invoice, handleInvoiceChange, edit, validationErrors} = useInvoiceContext();

    const errors = validationErrors || {};

    return (
        <div className="rounded-lg mb-6">
            <span className="text-xl font-medium text-gray-800">Customer Details</span>

            <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocumentField
                        label={"Name"}
                        type={"text"}
                        path={"customer.name"}
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.customer?.name || ""}
                        error={errors['invoice.customer.name']?.message}
                    />
                    <DocumentField
                        label={"GST Number"}
                        type={"text"}
                        path={"customer.email"}
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.customer?.gstNumber || ""}
                        error={errors['invoice.customer.gstNumber']?.message}
                    />
                    <DocumentField
                        label={"PAN"}
                        type={"text"}
                        path={"customer.pan"}
                        handleOnChange={handleInvoiceChange}
                        disabled={!edit}
                        value={invoice.customer?.pan || ""}
                        error={errors['invoice.customer.pan']?.message}
                    />
                </div>
                <DocumentField
                    label={"Billing Address"}
                    type={"textarea"}
                    path={"customer.billingAddress"}
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.customer?.billingAddress || ""}
                    error={errors['invoice.customer.billingAddress']?.message}
                />
                <DocumentField
                    label={"Shipping Address"}
                    type={"textarea"}
                    path={"customer.shippingAddress"}
                    handleOnChange={handleInvoiceChange}
                    disabled={!edit}
                    value={invoice.customer?.shippingAddress || ""}
                    error={errors['invoice.customer.shippingAddress']?.message}
                />
            </div>
        </div>

    )
}