import React from 'react';
import {InvoicePage} from "@/components/invoices/InvoicePage";

export default async function Page(
    props: {
        params: Promise<{ id: string }>;
    }
) {
    const params = await props.params;

    return (
        <InvoicePage invoiceId={params.id}/>
    )
}