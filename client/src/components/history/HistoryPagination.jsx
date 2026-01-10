import { ChevronLeft, ChevronRight } from 'lucide-react';

function HistoryPagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
    // If no pages or just 1 page, we could hide it or just show basic info
    if (totalItems === 0) return null;

    return (
        <div className="mt-12 flex items-center justify-between">
            <p className="text-[#3a3a3b] text-sm font-bold tracking-tight">
                Showing <span className="text-[#8a8a8b]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="text-[#8a8a8b]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-[#8a8a8b]">{totalItems}</span> sessions
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#0f0f10] border border-[#1a1a1b] text-[#6a6a6b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all shadow-lg ${currentPage === i + 1
                            ? 'bg-blue-600 text-white shadow-blue-500/20'
                            : 'bg-[#0f0f10] border border-[#1a1a1b] text-[#6a6a6b] hover:text-white'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#0f0f10] border border-[#1a1a1b] text-[#6a6a6b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default HistoryPagination;
