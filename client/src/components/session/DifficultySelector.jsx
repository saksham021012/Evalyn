function DifficultySelector({ difficulty, setDifficulty }) {
    return (
        <div className="mb-8">
            <label className="block text-gray-400 text-xs font-medium mb-3">
                INTERVIEW DEPTH
            </label>
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => setDifficulty('easy')}
                    className={`py-3 rounded-lg font-medium transition ${difficulty === 'easy'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    EASY
                </button>
                <button
                    onClick={() => setDifficulty('medium')}
                    className={`py-3 rounded-lg font-medium transition ${difficulty === 'medium'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    MEDIUM
                </button>
                <button
                    onClick={() => setDifficulty('hard')}
                    className={`py-3 rounded-lg font-medium transition ${difficulty === 'hard'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                        }`}
                >
                    HARD
                </button>
            </div>
        </div>
    );
}

export default DifficultySelector;
