'use client';
//
// import { useState } from 'react';
// import { RecursiveJsonForm } from '@/components/parser/jsonviewer/RecursiveJsonForm';
//
// const initialData = {
//     "client_details": {
//         "client": [
//             "anthropic"
//         ],
//         "model": "claude-3-5-sonnet-20241022"
//     },
//     "created_by": "system",
//     "created_date": "2025-01-04T11:31:26.397305",
//     "error": null,
//     "file_name": "94f1bd12dfda4d0eb0419e5c465105fb/2024_07_17_Tax_Invoice_Jagdamba_tools.pdf",
//     "invoice": {
//         "billed_amount": {
//             "sub_total": 770,
//             "total": 838
//         },
//         "billing_date": "27/3/24",
//         "currency_code": null,
//         "customer": {
//             "gst_number": "07AFGFS0831M7D",
//             "name": "Solanum and sons GSTDLLC"
//         },
//         "due_date": null,
//         "invoice_number": "9360",
//         "line_items": [
//             {
//                 "amount": 770,
//                 "description": "High tea",
//                 "hsn_sac": "82",
//                 "rate": 770,
//                 "taxes": [
//                     {
//                         "amount": 64,
//                         "category": "SGST"
//                     },
//                     {
//                         "amount": 64,
//                         "category": "CGST"
//                     }
//                 ]
//             }
//         ],
//         "place_of_supply": null,
//         "vendor": {
//             "address": "C-1483, Wazir Nagar, Kotla Mubarakpur, New Delhi-110003",
//             "bank_details": {
//                 "account_number": "1536002100021505",
//                 "bank_name": "P.N. BANK",
//                 "branch": "Kotla New Delhi",
//                 "ifsc": "punb0153600"
//             },
//             "gst_number": "07AFMPG1836M1Z6",
//             "name": "JAGDAMBA TOOLS & HARDWARE STORE"
//         }
//     },
//     "is_image": true,
//     "is_multi_page": false,
//     "job_id": "94f1bd12dfda4d0eb0419e5c465105fb",
//     "retry": false,
//     "status": "success",
//     "tenant": "perfect-accounting-and-shared-services",
//     "updated_by": null,
//     "updated_date": null,
//     "validation": {
//         "billed_amount": {
//             "amount_in_words": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "minor",
//                         "message": "amount_in_words is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "amount_in_words",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "balance_due": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "major",
//                         "message": "balance_due is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "balance_due",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "previous_dues": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "minor",
//                         "message": "previous_dues is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "previous_dues",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "sub_total": {
//                 "business_validation_status": "not-validated",
//                 "errors": [],
//                 "field": "sub_total",
//                 "field_validation_status": "valid",
//                 "notes": [],
//                 "value": {
//                     "actual": 770,
//                     "expected": null
//                 }
//             },
//             "total": {
//                 "business_validation_status": "not-validated",
//                 "errors": [],
//                 "field": "total",
//                 "field_validation_status": "valid",
//                 "notes": [],
//                 "value": {
//                     "actual": 838,
//                     "expected": null
//                 }
//             }
//         },
//         "billing_date": {
//             "business_validation_status": "not-validated",
//             "errors": [],
//             "field": "billing_date",
//             "field_validation_status": "valid",
//             "notes": [],
//             "value": {
//                 "actual": "27/3/24",
//                 "expected": null
//             }
//         },
//         "currency_code": {
//             "business_validation_status": "not-validated",
//             "errors": [
//                 {
//                     "error_level": "minor",
//                     "message": "currency_code is absent",
//                     "validation_type": "presence"
//                 }
//             ],
//             "field": "currency_code",
//             "field_validation_status": "absent",
//             "notes": [],
//             "value": {
//                 "actual": null,
//                 "expected": null
//             }
//         },
//         "customer": {
//             "billing_address": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "major",
//                         "message": "billing_address is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "billing_address",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "gst_number": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "major",
//                         "message": "gst_number range is not in range (15, 15)",
//                         "validation_type": "range"
//                     }
//                 ],
//                 "field": "gst_number",
//                 "field_validation_status": "invalid",
//                 "notes": [],
//                 "value": {
//                     "actual": 14,
//                     "expected": [
//                         15,
//                         15
//                     ]
//                 }
//             },
//             "name": {
//                 "business_validation_status": "not-validated",
//                 "errors": [],
//                 "field": "name",
//                 "field_validation_status": "valid",
//                 "notes": [],
//                 "value": {
//                     "actual": "Solanum and sons GSTDLLC",
//                     "expected": null
//                 }
//             },
//             "pan": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "major",
//                         "message": "pan is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "pan",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "shipping_address": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "minor",
//                         "message": "shipping_address is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "shipping_address",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             }
//         },
//         "due_date": {
//             "business_validation_status": "not-validated",
//             "errors": [
//                 {
//                     "error_level": "minor",
//                     "message": "due_date is absent",
//                     "validation_type": "presence"
//                 }
//             ],
//             "field": "due_date",
//             "field_validation_status": "absent",
//             "notes": [],
//             "value": {
//                 "actual": null,
//                 "expected": null
//             }
//         },
//         "invoice_number": {
//             "business_validation_status": "not-validated",
//             "errors": [],
//             "field": "invoice_number",
//             "field_validation_status": "valid",
//             "notes": [],
//             "value": {
//                 "actual": "9360",
//                 "expected": null
//             }
//         },
//         "line_items": [
//             {
//                 "amount": {
//                     "business_validation_status": "mismatch",
//                     "errors": [],
//                     "field": "amount",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": 770,
//                         "expected": null
//                     }
//                 },
//                 "description": {
//                     "business_validation_status": "not-validated",
//                     "errors": [],
//                     "field": "description",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": "High tea",
//                         "expected": null
//                     }
//                 },
//                 "discount": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "minor",
//                             "message": "discount is absent",
//                             "validation_type": "presence"
//                         }
//                     ],
//                     "field": "discount",
//                     "field_validation_status": "absent",
//                     "notes": [],
//                     "value": {
//                         "actual": null,
//                         "expected": null
//                     }
//                 },
//                 "hsn_sac": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "major",
//                             "message": "hsn_sac range is not in range (4, None)",
//                             "validation_type": "range"
//                         }
//                     ],
//                     "field": "hsn_sac",
//                     "field_validation_status": "invalid",
//                     "notes": [],
//                     "value": {
//                         "actual": 2,
//                         "expected": [
//                             4,
//                             null
//                         ]
//                     }
//                 },
//                 "quantity": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "major",
//                             "message": "quantity is absent",
//                             "validation_type": "presence"
//                         }
//                     ],
//                     "field": "quantity",
//                     "field_validation_status": "absent",
//                     "notes": [],
//                     "value": {
//                         "actual": null,
//                         "expected": null
//                     }
//                 },
//                 "rate": {
//                     "business_validation_status": "not-validated",
//                     "errors": [],
//                     "field": "rate",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": 770,
//                         "expected": null
//                     }
//                 },
//                 "taxes": [
//                     {
//                         "amount": {
//                             "business_validation_status": "cannot-be-validated",
//                             "errors": [],
//                             "field": "amount",
//                             "field_validation_status": "valid",
//                             "notes": [],
//                             "value": {
//                                 "actual": 64,
//                                 "expected": null
//                             }
//                         },
//                         "category": {
//                             "business_validation_status": "not-validated",
//                             "errors": [],
//                             "field": "category",
//                             "field_validation_status": "valid",
//                             "notes": [],
//                             "value": {
//                                 "actual": "SGST",
//                                 "expected": null
//                             }
//                         },
//                         "rate": {
//                             "business_validation_status": "derived",
//                             "errors": [
//                                 {
//                                     "error_level": "major",
//                                     "message": "rate is absent",
//                                     "validation_type": "presence"
//                                 }
//                             ],
//                             "field": "rate",
//                             "field_validation_status": "absent",
//                             "notes": [],
//                             "value": {
//                                 "actual": null,
//                                 "expected": 492.8
//                             }
//                         }
//                     },
//                     {
//                         "amount": {
//                             "business_validation_status": "cannot-be-validated",
//                             "errors": [],
//                             "field": "amount",
//                             "field_validation_status": "valid",
//                             "notes": [],
//                             "value": {
//                                 "actual": 64,
//                                 "expected": null
//                             }
//                         },
//                         "category": {
//                             "business_validation_status": "not-validated",
//                             "errors": [],
//                             "field": "category",
//                             "field_validation_status": "valid",
//                             "notes": [],
//                             "value": {
//                                 "actual": "CGST",
//                                 "expected": null
//                             }
//                         },
//                         "rate": {
//                             "business_validation_status": "derived",
//                             "errors": [
//                                 {
//                                     "error_level": "major",
//                                     "message": "rate is absent",
//                                     "validation_type": "presence"
//                                 }
//                             ],
//                             "field": "rate",
//                             "field_validation_status": "absent",
//                             "notes": [],
//                             "value": {
//                                 "actual": null,
//                                 "expected": 492.8
//                             }
//                         }
//                     }
//                 ]
//             }
//         ],
//         "place_of_supply": {
//             "business_validation_status": "not-validated",
//             "errors": [
//                 {
//                     "error_level": "minor",
//                     "message": "place_of_supply is absent",
//                     "validation_type": "presence"
//                 }
//             ],
//             "field": "place_of_supply",
//             "field_validation_status": "absent",
//             "notes": [],
//             "value": {
//                 "actual": null,
//                 "expected": null
//             }
//         },
//         "vendor": {
//             "address": {
//                 "business_validation_status": "not-validated",
//                 "errors": [],
//                 "field": "address",
//                 "field_validation_status": "valid",
//                 "notes": [],
//                 "value": {
//                     "actual": "C-1483, Wazir Nagar, Kotla Mubarakpur, New Delhi-110003",
//                     "expected": null
//                 }
//             },
//             "bank_details": {
//                 "account_number": {
//                     "business_validation_status": "not-validated",
//                     "errors": [],
//                     "field": "account_number",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": "1536002100021505",
//                         "expected": null
//                     }
//                 },
//                 "bank_name": {
//                     "business_validation_status": "not-validated",
//                     "errors": [],
//                     "field": "bank_name",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": "P.N. BANK",
//                         "expected": null
//                     }
//                 },
//                 "branch": {
//                     "business_validation_status": "not-validated",
//                     "errors": [],
//                     "field": "branch",
//                     "field_validation_status": "valid",
//                     "notes": [],
//                     "value": {
//                         "actual": "Kotla New Delhi",
//                         "expected": null
//                     }
//                 },
//                 "branch_address": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "minor",
//                             "message": "branch_address is absent",
//                             "validation_type": "presence"
//                         }
//                     ],
//                     "field": "branch_address",
//                     "field_validation_status": "absent",
//                     "notes": [],
//                     "value": {
//                         "actual": null,
//                         "expected": null
//                     }
//                 },
//                 "ifsc": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "major",
//                             "message": "ifsc does not match pattern ^[A-Z]{4}0[A-Z0-9]{6}$",
//                             "validation_type": "pattern"
//                         }
//                     ],
//                     "field": "ifsc",
//                     "field_validation_status": "invalid",
//                     "notes": [],
//                     "value": {
//                         "actual": "punb0153600",
//                         "expected": "^[A-Z]{4}0[A-Z0-9]{6}$"
//                     }
//                 },
//                 "name": {
//                     "business_validation_status": "not-validated",
//                     "errors": [
//                         {
//                             "error_level": "major",
//                             "message": "name is absent",
//                             "validation_type": "presence"
//                         }
//                     ],
//                     "field": "name",
//                     "field_validation_status": "absent",
//                     "notes": [],
//                     "value": {
//                         "actual": null,
//                         "expected": null
//                     }
//                 }
//             },
//             "gst_number": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "major",
//                         "message": "gst_number does not match pattern ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{2}$",
//                         "validation_type": "pattern"
//                     }
//                 ],
//                 "field": "gst_number",
//                 "field_validation_status": "invalid",
//                 "notes": [],
//                 "value": {
//                     "actual": "07AFMPG1836M1Z6",
//                     "expected": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{2}$"
//                 }
//             },
//             "name": {
//                 "business_validation_status": "not-validated",
//                 "errors": [],
//                 "field": "name",
//                 "field_validation_status": "valid",
//                 "notes": [],
//                 "value": {
//                     "actual": "JAGDAMBA TOOLS & HARDWARE STORE",
//                     "expected": null
//                 }
//             },
//             "pan": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "minor",
//                         "message": "pan is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "pan",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             },
//             "upi_id": {
//                 "business_validation_status": "not-validated",
//                 "errors": [
//                     {
//                         "error_level": "minor",
//                         "message": "upi_id is absent",
//                         "validation_type": "presence"
//                     }
//                 ],
//                 "field": "upi_id",
//                 "field_validation_status": "absent",
//                 "notes": [],
//                 "value": {
//                     "actual": null,
//                     "expected": null
//                 }
//             }
//         }
//     }
// }
//
// export default function InvoiceFormPage() {
//     const [formData, setFormData] = useState(initialData.invoice);
//
//     const handleChange = (path: string[], value: any) => {
//         const newData = { ...formData };
//         let current = newData;
//
//         for (let i = 0; i < path.length - 1; i++) {
//             current = current[path[i]];
//         }
//         current[path[path.length - 1]] = value;
//
//         setFormData(newData);
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-900 p-6">
//             <div className="max-w-4xl mx-auto">
//                 <h1 className="text-2xl font-bold text-white mb-6">Invoice Form</h1>
//                 <div className="bg-gray-800 rounded-lg p-6">
//                     <RecursiveJsonForm
//                         data={formData}
//                         validation={initialData.validation}
//                         onChange={handleChange}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, {useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import {TaxCategory} from "@/types/invoice";
import {TrashIcon} from "lucide-react";

interface InvoiceFormProps {
    // onSubmit: (data: InvoiceWrapper) => void;
}

export default function Page() {
    return (
        <InvoiceForm/>
    )
}
const InvoiceForm: React.FC<InvoiceFormProps> = () => {
    type SectionName = 'customer' | 'vendor' | 'billedAmount' | 'lineItems' | 'bankDetails';

// Define the type for the openSections state
    interface OpenSections {
        customer: boolean;
        vendor: boolean;
        billedAmount: boolean;
        lineItems: boolean;
        bankDetails: boolean;
    }

    const [openSections, setOpenSections] = useState<OpenSections>({
        customer: true,
        vendor: false,
        billedAmount: false,
        lineItems: false,
        bankDetails: false
    });
    const [lineItems, setLineItems] = useState([{}]);
    const [bankDetails, setBankDetails] = useState([{}]);

    const toggleSection = (section: SectionName) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const addLineItem = () => {
        setLineItems(prev => [...prev, {}]);
    };

    const removeLineItem = (index: number) => {
        setLineItems(prev => prev.filter((_, i) => i !== index));
    };

    const addBankDetail = () => {
        setBankDetails(prev => [...prev, {}]);
    };

    const removeBankDetail = (index: number) => {
        setBankDetails(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <form className="p-8 bg-neutral-50 rounded-xl">
                {/* Basic Invoice Details */}
                <div className="space-y-6 mb-8">
                    <h2 className="text-2xl/7 font-semibold text-neutral-800">Invoice Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Invoice Number</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Currency Code</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Billing Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Due Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Place of Supply</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <hr className="p-2"/>
                {/* Customer Section */}
                <div className="rounded-lg mb-6">
                    <span className="text-xl font-medium text-neutral-800">Customer Details</span>

                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">GST Number</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">PAN</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Billing Address</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Shipping Address</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
                <hr className="p-2"/>

                {/* Vendor Section */}
                <div className="rounded-lg mb-6">
                    <span className="text-xl font-medium text-neutral-800">Vendor Details</span>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">GST Number</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">PAN</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">UPI ID</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Address</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                rows={3}
                            />
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-4 bg-neutral-100 rounded-xl">
                            <div className="flex justify-between items-center p-4">
                                <h3 className="text-lg font-medium text-neutral-900">Bank Details</h3>
                                <button
                                    type="button"
                                    onClick={addBankDetail}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1"/>
                                    Add Bank
                                </button>
                            </div>
                            {bankDetails.map((_, index) => (
                                <div key={index} className="rounded-md p-4 space-y-4">
                                    <div className="flex justify-between">
                                        <span
                                            className="text-sm text-neutral-700 font-semibold">Bank #{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeBankDetail(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>

                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bank
                                                Name</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account
                                                Number</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">IFSC</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700">Branch</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Branch
                                            Address</label>
                                        <textarea
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <hr className="p-2"/>

                {/* Line Items Section */}
                <div className="rounded-lg pb-8">
                    <span className="text-lg font-medium text-neutral-800">Line Items</span>
                    <div className="py-y space-y-4">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={addLineItem}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                            >
                                <PlusIcon className="h-4 w-4 mr-1"/>
                                Add Line Item
                            </button>
                        </div>

                        {lineItems.map((_, index) => (
                            <div key={index} className="bg-neutral-100 rounded-xl p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-base font-medium text-neutral-800">Item {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeLineItem(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-neutral-700">Description</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">HSN/SAC</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Rate</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Amount</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Quantity
                                            Value</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Unit</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Discount */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Discount
                                            Percentage</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Discount
                                            Amount</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Taxes */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-neutral-700">Taxes</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <select
                                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm">
                                                {Object.values(TaxCategory).map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="Rate"
                                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <hr className="p-2"/>

                {/* Billed Amount Section */}
                <div className="rounded-lg">
                    <span className="text-lg font-medium text-neutral-800">Billed Amount</span>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Sub Total</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Total</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Balance Due</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Previous Dues</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount in Words</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>


                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="text-base px-4 py-2 bg-sky-200 border-2 border-sky-800 font-medium text-sky-800 rounded-lg hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                        Save Invoice
                    </button>
                </div>
            </form>
        </div>
    );
};
