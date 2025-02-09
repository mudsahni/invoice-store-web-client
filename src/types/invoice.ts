export interface InvoiceWrapper {
    invoice: Invoice;
}

export interface Invoice {
    invoiceNumber?: string;
    billingDate?: string;
    dueDate?: string;
    placeOfSupply?: string;
    currencyCode?: string;
    customer?: Customer;
    vendor?: Vendor;
    billedAmount?: BilledAmount;
    lineItems?: LineItem[];
}

export interface Customer {
    name?: string;
    billingAddress?: string;
    shippingAddress?: string;
    gstNumber?: string;
    pan?: string;
}

export interface Vendor {
    name?: string;
    address?: string;
    gstNumber?: string;
    bankDetails?: BankDetail[];
    pan?: string;
    upiId?: string;
}

export interface BankDetail {
    bankName?: string;
    accountNumber?: string;
    branchAddress?: string;
    ifsc?: string;
    branch?: string;
}

export interface BilledAmount {
    subTotal?: number;
    total?: number;
    balanceDue?: number;
    amountInWords?: string;
    previousDues?: number;
}

export interface LineItem {
    description?: string;
    hsnSac?: string;
    quantity?: Quantity;
    rate?: number;
    amount?: number;
    discount?: Discount;
    taxes?: Tax[];
}

export interface Discount {
    percentage?: number;
    amount?: number;
}

export interface Quantity {
    value?: number;
    unit?: string;
}

export enum TaxCategory {
    CGST = "CGST",
    SGST = "SGST",
    IGST = "IGST",
    CESS = "CESS",
    GST = "GST"
}

export interface Tax {
    category?: TaxCategory;
    rate?: number;
    amount?: number;
}