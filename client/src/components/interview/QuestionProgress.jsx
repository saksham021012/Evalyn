function QuestionProgress({ currentIndex, total }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">QUESTION</span>
                <span className="text-blue-500 font-bold">
                    {currentIndex + 1} of {total}
                </span>
            </div>
            <div className="flex-1 mx-8 bg-slate-800 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}

export default QuestionProgress;
