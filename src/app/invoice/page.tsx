'use client';

import { useState } from 'react';
import { RecursiveJsonForm } from '@/components/parser/jsonviewer/RecursiveJsonForm';

const initialData = {
    "client_details": {
        "client": [
            "anthropic"
        ],
        "model": "claude-3-5-sonnet-20241022"
    },
    "created_by": "system",
    "created_date": "2025-01-04T11:31:26.397305",
    "error": null,
    "file_name": "94f1bd12dfda4d0eb0419e5c465105fb/2024_07_17_Tax_Invoice_Jagdamba_tools.pdf",
    "invoice": {
        "billed_amount": {
            "sub_total": 770,
            "total": 838
        },
        "billing_date": "27/3/24",
        "currency_code": null,
        "customer": {
            "gst_number": "07AFGFS0831M7D",
            "name": "Solanum and sons GSTDLLC"
        },
        "due_date": null,
        "invoice_number": "9360",
        "line_items": [
            {
                "amount": 770,
                "description": "High tea",
                "hsn_sac": "82",
                "rate": 770,
                "taxes": [
                    {
                        "amount": 64,
                        "category": "SGST"
                    },
                    {
                        "amount": 64,
                        "category": "CGST"
                    }
                ]
            }
        ],
        "place_of_supply": null,
        "vendor": {
            "address": "C-1483, Wazir Nagar, Kotla Mubarakpur, New Delhi-110003",
            "bank_details": {
                "account_number": "1536002100021505",
                "bank_name": "P.N. BANK",
                "branch": "Kotla New Delhi",
                "ifsc": "punb0153600"
            },
            "gst_number": "07AFMPG1836M1Z6",
            "name": "JAGDAMBA TOOLS & HARDWARE STORE"
        }
    },
    "is_image": true,
    "is_multi_page": false,
    "job_id": "94f1bd12dfda4d0eb0419e5c465105fb",
    "retry": false,
    "status": "success",
    "tenant": "perfect-accounting-and-shared-services",
    "updated_by": null,
    "updated_date": null,
    "validation": {
        "billed_amount": {
            "amount_in_words": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "minor",
                        "message": "amount_in_words is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "amount_in_words",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "balance_due": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "major",
                        "message": "balance_due is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "balance_due",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "previous_dues": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "minor",
                        "message": "previous_dues is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "previous_dues",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "sub_total": {
                "business_validation_status": "not-validated",
                "errors": [],
                "field": "sub_total",
                "field_validation_status": "valid",
                "notes": [],
                "value": {
                    "actual": 770,
                    "expected": null
                }
            },
            "total": {
                "business_validation_status": "not-validated",
                "errors": [],
                "field": "total",
                "field_validation_status": "valid",
                "notes": [],
                "value": {
                    "actual": 838,
                    "expected": null
                }
            }
        },
        "billing_date": {
            "business_validation_status": "not-validated",
            "errors": [],
            "field": "billing_date",
            "field_validation_status": "valid",
            "notes": [],
            "value": {
                "actual": "27/3/24",
                "expected": null
            }
        },
        "currency_code": {
            "business_validation_status": "not-validated",
            "errors": [
                {
                    "error_level": "minor",
                    "message": "currency_code is absent",
                    "validation_type": "presence"
                }
            ],
            "field": "currency_code",
            "field_validation_status": "absent",
            "notes": [],
            "value": {
                "actual": null,
                "expected": null
            }
        },
        "customer": {
            "billing_address": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "major",
                        "message": "billing_address is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "billing_address",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "gst_number": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "major",
                        "message": "gst_number range is not in range (15, 15)",
                        "validation_type": "range"
                    }
                ],
                "field": "gst_number",
                "field_validation_status": "invalid",
                "notes": [],
                "value": {
                    "actual": 14,
                    "expected": [
                        15,
                        15
                    ]
                }
            },
            "name": {
                "business_validation_status": "not-validated",
                "errors": [],
                "field": "name",
                "field_validation_status": "valid",
                "notes": [],
                "value": {
                    "actual": "Solanum and sons GSTDLLC",
                    "expected": null
                }
            },
            "pan": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "major",
                        "message": "pan is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "pan",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "shipping_address": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "minor",
                        "message": "shipping_address is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "shipping_address",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            }
        },
        "due_date": {
            "business_validation_status": "not-validated",
            "errors": [
                {
                    "error_level": "minor",
                    "message": "due_date is absent",
                    "validation_type": "presence"
                }
            ],
            "field": "due_date",
            "field_validation_status": "absent",
            "notes": [],
            "value": {
                "actual": null,
                "expected": null
            }
        },
        "invoice_number": {
            "business_validation_status": "not-validated",
            "errors": [],
            "field": "invoice_number",
            "field_validation_status": "valid",
            "notes": [],
            "value": {
                "actual": "9360",
                "expected": null
            }
        },
        "line_items": [
            {
                "amount": {
                    "business_validation_status": "mismatch",
                    "errors": [],
                    "field": "amount",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": 770,
                        "expected": null
                    }
                },
                "description": {
                    "business_validation_status": "not-validated",
                    "errors": [],
                    "field": "description",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": "High tea",
                        "expected": null
                    }
                },
                "discount": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "minor",
                            "message": "discount is absent",
                            "validation_type": "presence"
                        }
                    ],
                    "field": "discount",
                    "field_validation_status": "absent",
                    "notes": [],
                    "value": {
                        "actual": null,
                        "expected": null
                    }
                },
                "hsn_sac": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "major",
                            "message": "hsn_sac range is not in range (4, None)",
                            "validation_type": "range"
                        }
                    ],
                    "field": "hsn_sac",
                    "field_validation_status": "invalid",
                    "notes": [],
                    "value": {
                        "actual": 2,
                        "expected": [
                            4,
                            null
                        ]
                    }
                },
                "quantity": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "major",
                            "message": "quantity is absent",
                            "validation_type": "presence"
                        }
                    ],
                    "field": "quantity",
                    "field_validation_status": "absent",
                    "notes": [],
                    "value": {
                        "actual": null,
                        "expected": null
                    }
                },
                "rate": {
                    "business_validation_status": "not-validated",
                    "errors": [],
                    "field": "rate",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": 770,
                        "expected": null
                    }
                },
                "taxes": [
                    {
                        "amount": {
                            "business_validation_status": "cannot-be-validated",
                            "errors": [],
                            "field": "amount",
                            "field_validation_status": "valid",
                            "notes": [],
                            "value": {
                                "actual": 64,
                                "expected": null
                            }
                        },
                        "category": {
                            "business_validation_status": "not-validated",
                            "errors": [],
                            "field": "category",
                            "field_validation_status": "valid",
                            "notes": [],
                            "value": {
                                "actual": "SGST",
                                "expected": null
                            }
                        },
                        "rate": {
                            "business_validation_status": "derived",
                            "errors": [
                                {
                                    "error_level": "major",
                                    "message": "rate is absent",
                                    "validation_type": "presence"
                                }
                            ],
                            "field": "rate",
                            "field_validation_status": "absent",
                            "notes": [],
                            "value": {
                                "actual": null,
                                "expected": 492.8
                            }
                        }
                    },
                    {
                        "amount": {
                            "business_validation_status": "cannot-be-validated",
                            "errors": [],
                            "field": "amount",
                            "field_validation_status": "valid",
                            "notes": [],
                            "value": {
                                "actual": 64,
                                "expected": null
                            }
                        },
                        "category": {
                            "business_validation_status": "not-validated",
                            "errors": [],
                            "field": "category",
                            "field_validation_status": "valid",
                            "notes": [],
                            "value": {
                                "actual": "CGST",
                                "expected": null
                            }
                        },
                        "rate": {
                            "business_validation_status": "derived",
                            "errors": [
                                {
                                    "error_level": "major",
                                    "message": "rate is absent",
                                    "validation_type": "presence"
                                }
                            ],
                            "field": "rate",
                            "field_validation_status": "absent",
                            "notes": [],
                            "value": {
                                "actual": null,
                                "expected": 492.8
                            }
                        }
                    }
                ]
            }
        ],
        "place_of_supply": {
            "business_validation_status": "not-validated",
            "errors": [
                {
                    "error_level": "minor",
                    "message": "place_of_supply is absent",
                    "validation_type": "presence"
                }
            ],
            "field": "place_of_supply",
            "field_validation_status": "absent",
            "notes": [],
            "value": {
                "actual": null,
                "expected": null
            }
        },
        "vendor": {
            "address": {
                "business_validation_status": "not-validated",
                "errors": [],
                "field": "address",
                "field_validation_status": "valid",
                "notes": [],
                "value": {
                    "actual": "C-1483, Wazir Nagar, Kotla Mubarakpur, New Delhi-110003",
                    "expected": null
                }
            },
            "bank_details": {
                "account_number": {
                    "business_validation_status": "not-validated",
                    "errors": [],
                    "field": "account_number",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": "1536002100021505",
                        "expected": null
                    }
                },
                "bank_name": {
                    "business_validation_status": "not-validated",
                    "errors": [],
                    "field": "bank_name",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": "P.N. BANK",
                        "expected": null
                    }
                },
                "branch": {
                    "business_validation_status": "not-validated",
                    "errors": [],
                    "field": "branch",
                    "field_validation_status": "valid",
                    "notes": [],
                    "value": {
                        "actual": "Kotla New Delhi",
                        "expected": null
                    }
                },
                "branch_address": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "minor",
                            "message": "branch_address is absent",
                            "validation_type": "presence"
                        }
                    ],
                    "field": "branch_address",
                    "field_validation_status": "absent",
                    "notes": [],
                    "value": {
                        "actual": null,
                        "expected": null
                    }
                },
                "ifsc": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "major",
                            "message": "ifsc does not match pattern ^[A-Z]{4}0[A-Z0-9]{6}$",
                            "validation_type": "pattern"
                        }
                    ],
                    "field": "ifsc",
                    "field_validation_status": "invalid",
                    "notes": [],
                    "value": {
                        "actual": "punb0153600",
                        "expected": "^[A-Z]{4}0[A-Z0-9]{6}$"
                    }
                },
                "name": {
                    "business_validation_status": "not-validated",
                    "errors": [
                        {
                            "error_level": "major",
                            "message": "name is absent",
                            "validation_type": "presence"
                        }
                    ],
                    "field": "name",
                    "field_validation_status": "absent",
                    "notes": [],
                    "value": {
                        "actual": null,
                        "expected": null
                    }
                }
            },
            "gst_number": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "major",
                        "message": "gst_number does not match pattern ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{2}$",
                        "validation_type": "pattern"
                    }
                ],
                "field": "gst_number",
                "field_validation_status": "invalid",
                "notes": [],
                "value": {
                    "actual": "07AFMPG1836M1Z6",
                    "expected": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{2}$"
                }
            },
            "name": {
                "business_validation_status": "not-validated",
                "errors": [],
                "field": "name",
                "field_validation_status": "valid",
                "notes": [],
                "value": {
                    "actual": "JAGDAMBA TOOLS & HARDWARE STORE",
                    "expected": null
                }
            },
            "pan": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "minor",
                        "message": "pan is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "pan",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            },
            "upi_id": {
                "business_validation_status": "not-validated",
                "errors": [
                    {
                        "error_level": "minor",
                        "message": "upi_id is absent",
                        "validation_type": "presence"
                    }
                ],
                "field": "upi_id",
                "field_validation_status": "absent",
                "notes": [],
                "value": {
                    "actual": null,
                    "expected": null
                }
            }
        }
    }
}

export default function InvoiceFormPage() {
    const [formData, setFormData] = useState(initialData.invoice);

    const handleChange = (path: string[], value: any) => {
        const newData = { ...formData };
        let current = newData;

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;

        setFormData(newData);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Invoice Form</h1>
                <div className="bg-gray-800 rounded-lg p-6">
                    <RecursiveJsonForm
                        data={formData}
                        validation={initialData.validation}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}