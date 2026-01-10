function InterviewCompleted({ onEndSession }) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8 font-inter">
            <div className="max-w-md text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-10 backdrop-blur-sm shadow-2xl shadow-blue-900/10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-lg shadow-green-500/20 animate-in zoom-in duration-500">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                    Session Complete
                </h1>
                <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                    You have successfully completed all interview questions. Our AI is ready to compile your performance analysis.
                </p>
                <button
                    onClick={onEndSession}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 active:scale-[0.98] tracking-wide uppercase text-sm"
                >
                    View Results
                </button>
            </div>
        </div>
    );
}

export default InterviewCompleted;
