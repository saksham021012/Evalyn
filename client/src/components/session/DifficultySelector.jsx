function DifficultySelector({ difficulty, setDifficulty }) {
    return (
        <div className="mb-8">
            <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3 font-semibold">
                INTERVIEW DEPTH
            </label>
            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => setDifficulty('easy')}
                    className={`py-3 rounded-xl font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition border ${difficulty === 'easy'
                        ? 'bg-[#2b4c3f] text-white border-[#2b4c3f] shadow-sm'
                        : 'bg-white text-[#57534e] border-[#e7e5e0] hover:bg-[#f5f4f0]'
                        }`}
                >
                    EASY
                </button>
                <button
                    onClick={() => setDifficulty('medium')}
                    className={`py-3 rounded-xl font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition border ${difficulty === 'medium'
                        ? 'bg-[#2b4c3f] text-white border-[#2b4c3f] shadow-sm'
                        : 'bg-white text-[#57534e] border-[#e7e5e0] hover:bg-[#f5f4f0]'
                        }`}
                >
                    MEDIUM
                </button>
                <button
                    onClick={() => setDifficulty('hard')}
                    className={`py-3 rounded-xl font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition border ${difficulty === 'hard'
                        ? 'bg-[#2b4c3f] text-white border-[#2b4c3f] shadow-sm'
                        : 'bg-white text-[#57534e] border-[#e7e5e0] hover:bg-[#f5f4f0]'
                        }`}
                >
                    HARD
                </button>
            </div>
        </div>
    );
}

export default DifficultySelector;
