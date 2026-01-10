function SetupProgress({ hasResume, hasRole, hasDifficulty }) {
    return (
        <>
            <div className="flex items-center justify-center gap-2 mt-8">
                <div className={`w-2 h-2 rounded-full ${hasResume ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${hasRole ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                <div className={`w-2 h-2 rounded-full ${hasDifficulty ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">
                {hasResume ? 'RESUME UPLOADED' : 'READY TO INITIALIZE'}
            </p>
        </>
    );
}

export default SetupProgress;
