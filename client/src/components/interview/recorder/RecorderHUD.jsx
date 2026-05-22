function RecorderHUD({ signalQuality, isRecording, recordingTime, formatTime }) {
    return (
        <>
            {/* Signal Quality Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <div className="flex gap-1">
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                </div>
                <span className="text-green-400 text-xs font-medium">{signalQuality} SIGNAL</span>
                <span className="text-gray-400 text-xs">60fps</span>
            </div>

            {/* Recording Timer */}
            {isRecording && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-bold">{formatTime(recordingTime)}</span>
                    <span className="text-white/80 text-xs">ELAPSED</span>
                </div>
            )}

            {/* Max Time Indicator */}
            <div className="absolute top-4 right-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <span className="text-gray-400 text-xs">05:00</span>
                <span className="text-gray-600 text-xs ml-1">LEFT</span>
            </div>
        </>
    );
}

export default RecorderHUD;
