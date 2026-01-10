import { AlertCircle, Mic, Keyboard, Chrome } from 'lucide-react';

function LiveTranscript({
    transcript,
    isRecording,
    isProcessing,
    useManualInput,
    onManualTextChange,
    manualText,
    speechError,
    onToggleInputMode
}) {
    if (!isRecording && !isProcessing) return null;

    const getErrorMessage = (errorType) => {
        switch (errorType) {
            case 'network':
                return 'Speech recognition is unavailable due to network restrictions.';
            case 'not-allowed':
                return 'Microphone access was denied. Grant microphone permissions or use manual text input.';
            case 'not-supported':
                return 'Speech recognition is not supported in this browser.';
            default:
                return 'Speech recognition encountered an error.';
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {/* Chrome Recommendation Banner - Only show when using manual input */}
            {useManualInput && speechError && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Chrome className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-blue-400 text-sm font-medium mb-1">💡 Recommended: Use Chrome for Better Experience</p>
                            <p className="text-blue-400/80 text-xs">
                                For the best interview experience with voice recognition, we recommend using Google Chrome or Microsoft Edge.
                                You can continue with manual text input in this browser.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Warning */}
            {speechError && !useManualInput && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-yellow-400 text-sm font-medium mb-1">Speech Recognition Unavailable</p>
                            <p className="text-yellow-400/80 text-xs">{getErrorMessage(speechError)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mode Toggle */}
            {isRecording && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleInputMode(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!useManualInput
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        Speech
                    </button>
                    <button
                        onClick={() => onToggleInputMode(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${useManualInput
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                            }`}
                    >
                        <Keyboard className="w-4 h-4" />
                        Type Answer
                    </button>
                </div>
            )}

            {/* Manual Text Input */}
            {isRecording && useManualInput && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Keyboard className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400 font-medium tracking-wide">TEXT INPUT MODE</span>
                        </div>
                        <span className="text-xs text-gray-500">{manualText?.length || 0} characters</span>
                    </div>
                    <textarea
                        value={manualText || ''}
                        onChange={(e) => onManualTextChange(e.target.value)}
                        placeholder="Type your detailed answer here... (Aim for 100+ words for better scores)"
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={8}
                        autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        💡 Tip: Provide detailed explanations with examples for higher scores
                    </p>
                </div>
            )}

            {/* Live Transcript Display */}
            {isRecording && !useManualInput && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400 font-medium tracking-wide">LIVE TRANSCRIPT</span>
                    </div>
                    <div className="text-white min-h-[60px] max-h-[120px] overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {transcript || <span className="text-gray-500 italic">Speak to see your answer transcribed here...</span>}
                    </div>
                </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center animate-pulse">
                    <p className="text-blue-400 font-bold tracking-wide text-sm mb-1">AI PROCESSING IN PROGRESS</p>
                    <p className="text-blue-400/60 text-xs text-center">Analyzing your response...</p>
                </div>
            )}
        </div>
    );
}

export default LiveTranscript;
