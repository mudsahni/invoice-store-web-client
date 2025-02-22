import React, {useState} from 'react'
import {InvoiceContext} from "@/components/invoices/context/InvoiceContext";
import {Invoice} from "@/types/invoice";

interface InvoiceContextProviderProps {
    children: React.ReactNode
}

export const InvoiceContextProvider: React.FC<InvoiceContextProviderProps> = ({children}) => {
    const [edit, setEdit] = React.useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoice>({})
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: { field: string, message: string } }>({})
    const [editableInvoice, setEditableInvoice] = useState<Invoice>({})

    // Single handler for all invoice updates
    const handleInvoiceChange = (path: string, value: any) => {
        setEditableInvoice(prev => {
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

    const value = {
        edit,
        setEdit,
        invoice,
        setInvoice,
        editableInvoice,
        setEditableInvoice,
        validationErrors,
        setValidationErrors,
        handleInvoiceChange
    }
    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    )
}