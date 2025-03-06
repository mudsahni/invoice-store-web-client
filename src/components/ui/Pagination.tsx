import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface TablePaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    pageSizeOptions?: number[];
}

const TablePagination = ({
                             currentPage,
                             totalItems,
                             itemsPerPage,
                             onPageChange,
                             onItemsPerPageChange,
                             pageSizeOptions = [10, 25, 50, 100]
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

    // Handle page size change
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);
        onItemsPerPageChange(newSize);
        // Reset to first page when changing page size
        onPageChange(1);
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
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-800">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{endIndex}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                    </p>

                    {/* Page size selector */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="page-size" className="text-sm text-gray-600">Show</label>
                        <select
                            id="page-size"
                            value={itemsPerPage}
                            onChange={handlePageSizeChange}
                            className="rounded-md border border-gray-300 bg-white py-1 px-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
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