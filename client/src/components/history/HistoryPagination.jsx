import { ChevronLeft, ChevronRight } from 'lucide-react';

function HistoryPagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
    if (totalItems === 0) return null;

    return (
        <div className="mt-8 flex items-center justify-between">
            <p className="text-[#57534e] font-mono text-[10px] tracking-widest uppercase">
                Showing <span className="font-bold text-[#1c1917]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-[#1c1917]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold text-[#1c1917]">{totalItems}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-white border border-[#e7e5e0] text-[#57534e] hover:bg-[#f5f4f0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-8 h-8 rounded-lg font-mono text-[10px] font-bold transition-all shadow-sm ${currentPage === i + 1
                            ? 'bg-[#2b4c3f] text-white border border-[#2b4c3f]'
                            : 'bg-white border border-[#e7e5e0] text-[#57534e] hover:bg-[#f5f4f0]'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-white border border-[#e7e5e0] text-[#57534e] hover:bg-[#f5f4f0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default HistoryPagination;
