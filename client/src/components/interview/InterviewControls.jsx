import { RefreshCw, Edit3, StopCircle } from 'lucide-react';

function InterviewControls({
    isRecording,
    onToggleRecording,
    onReRecord,
    onSubmit,
    onSkip,
    skipsRemaining = 2,
    canSkip = true,
    canSubmit = false,
    isProcessing = false,
    useManualInput = false
}) {
    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-gray-400 text-sm">
                {skipsRemaining > 0 ? (
                    <span>Skips remaining: <span className="text-blue-400 font-medium">{skipsRemaining}/3</span></span>
                ) : (
                    <span className="text-red-400">No skips remaining</span>
                )}
            </div>
            <div className="flex items-center gap-3">
                {canSubmit && (
                    <button
                        onClick={onReRecord}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {useManualInput ? 'Clear & Restart' : 'Re-record'}
                    </button>
                )}

                <button
                    onClick={onToggleRecording}
                    disabled={isProcessing}
                    className={`px-8 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {isRecording ? (
                        <>
                            {useManualInput ? (
                                <>
                                    <Edit3 className="w-4 h-4" />
                                    Finish Writing
                                </>
                            ) : (
                                <>
                                    <StopCircle className="w-4 h-4" />
                                    Stop Recording
                                </>
                            )}
                        </>
                    ) : (
                        useManualInput ? 'Start Writing' : 'Start Recording'
                    )}
                </button>

                <button
                    onClick={onSubmit}
                    disabled={!canSubmit || isProcessing}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
                >
                    {isProcessing ? 'Submitting...' : 'Submit Answer'}
                </button>
            </div>

            <button
                onClick={onSkip}
                disabled={!canSkip || skipsRemaining <= 0 || isRecording || isProcessing}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Skip Question
                <span>→</span>
            </button>
        </div>
    );
}

export default InterviewControls;
