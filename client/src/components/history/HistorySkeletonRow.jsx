function HistorySkeletonRow() {
    return (
        <tr className="animate-pulse bg-white">
            <td className="px-4 sm:px-6 py-6">
                <div className="h-4 bg-[#f5f4f0] rounded w-20" />
            </td>
            <td className="px-4 sm:px-6 py-6">
                <div className="h-4 bg-[#e7e5e0] rounded w-32" />
            </td>
            <td className="px-4 sm:px-6 py-6 hidden md:table-cell">
                <div className="h-4 bg-[#f5f4f0] rounded w-16" />
            </td>
            <td className="px-4 sm:px-6 py-6 hidden lg:table-cell">
                <div className="h-4 bg-[#f5f4f0] rounded w-12" />
            </td>
            <td className="px-4 sm:px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 bg-[#f5f4f0] rounded-full w-12 hidden sm:block" />
                    <div className="h-4 bg-[#e7e5e0] rounded w-10" />
                </div>
            </td>
            <td className="px-4 sm:px-6 py-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#f5f4f0] rounded-lg" />
                    <div className="w-7 h-7 bg-[#f5f4f0] rounded-lg" />
                </div>
            </td>
        </tr>
    );
}

export default HistorySkeletonRow;
