function QuestionCard({ question, isSpeaking, onStopSpeaking }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-400 text-sm font-medium">ACTIVE PROMPT</span>
                </div>
                {isSpeaking && (
                    <button
                        onClick={onStopSpeaking}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
                    >
                        <div className="flex gap-1">
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse"></div>
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>AI Speaking... (Click to stop)</span>
                    </button>
                )}
            </div>
            <p className="text-white text-xl leading-relaxed">
                {question}
            </p>
        </div>
    );
}

export default QuestionCard;
