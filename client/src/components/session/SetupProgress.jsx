function SetupProgress({ hasResume, hasRole, hasDifficulty }) {
    return (
        <>
            <div className="flex items-center justify-center gap-2.5 mt-8">
                <div className={`w-2 h-2 rounded-full ${hasResume ? 'bg-[#2b4c3f]' : 'bg-[#e7e5e0]'}`}></div>
                <div className={`w-2 h-2 rounded-full ${hasRole ? 'bg-[#2b4c3f]' : 'bg-[#e7e5e0]'}`}></div>
                <div className={`w-2 h-2 rounded-full ${hasDifficulty ? 'bg-[#2b4c3f]' : 'bg-[#e7e5e0]'}`}></div>
            </div>
            <p className="text-center font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mt-3 font-semibold">
                {hasResume ? 'RESUME UPLOADED' : 'READY TO INITIALIZE'}
            </p>
        </>
    );
}

export default SetupProgress;
