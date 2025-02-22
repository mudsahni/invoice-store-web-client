import {createContext, useContext} from "react";
import {InvoiceContextType} from "@/components/invoices/context/InvoiceContextType";

export const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoiceContext = () => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useShared must be used within a InvoiceContextProvider');
    }
    return context;
};

