import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface TablePaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const TablePagination = ({
                             currentPage,
                             totalItems,
                             itemsPerPage,
                             onPageChange
                         }: TablePaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="mt-6 flex items-center justify-between pt-4">
            {/* Mobile pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-800">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{endIndex}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={previousPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-800 disabled:opacity-50 hover:bg-neutral-100"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5"/>
                        </button>

                        {/* Page numbers */}
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => onPageChange(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    currentPage === index + 1
                                        ? 'bg-neutral-100 text-gray-800'
                                        : 'text-gray-800 hover:bg-neutral-100'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-800 disabled:opacity-50 hover:bg-neutral-100"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5"/>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TablePagination;