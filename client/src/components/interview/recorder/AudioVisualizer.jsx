function AudioVisualizer({ isMicOn, isRecording }) {
    if (!isMicOn || !isRecording) return null;

    return (
        <div className="absolute bottom-20 left-4 right-4 flex items-center justify-center gap-1 h-12 bg-black/40 backdrop-blur-sm rounded-lg px-4">
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '20%' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.1s' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.2s' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.3s' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.4s' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.5s' }}></div>
            <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '20%', animationDelay: '0.6s' }}></div>
        </div>
    );
}

export default AudioVisualizer;
