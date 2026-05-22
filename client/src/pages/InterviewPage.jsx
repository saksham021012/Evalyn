import { LiveKitRoom } from '@livekit/components-react';

import InterviewTopBar from '../components/interview/InterviewTopBar';
import LiveKitInterview from '../components/interview/LiveKitInterview';
import useInterview from '../hooks/useInterview';

import PreparingSession from '../components/interview/setup/PreparingSession';
import ConnectingRoom from '../components/interview/setup/ConnectingRoom';
import ConnectionFailed from '../components/interview/setup/ConnectionFailed';
import AnalyzingPerformance from '../components/interview/setup/AnalyzingPerformance';

function InterviewPage() {
    const {
        tokenData,
        isFetchingToken,
        tokenError,
        isFinalizing,
        evaluationProgress,
        sessionTime,
        handleEndSession,
        handleDisconnected,
        setTokenError,
        interviewSession,
        loading,
        isSessionLoading,
        sessionId
    } = useInterview();

    // Loading screen for preparing session
    if (isSessionLoading || (!interviewSession && loading)) {
        return <PreparingSession loading={true} interviewSession={interviewSession} />;
    }

    // Loader for LiveKit token fetching
    if (isFetchingToken || (!tokenData && !tokenError)) {
        return (
            <ConnectingRoom
                isFetchingToken={isFetchingToken}
                tokenData={tokenData}
                tokenError={tokenError}
            />
        );
    }

    // Error handler for LiveKit configuration issues
    if (tokenError) {
        return <ConnectionFailed tokenError={tokenError} onRetry={() => setTokenError(null)} />;
    }

    // Finalizing / Polling screen
    if (isFinalizing) {
        return (
            <AnalyzingPerformance
                isFinalizing={isFinalizing}
                evaluationProgress={evaluationProgress}
            />
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f5f4f0] select-none" style={{
            backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}>
            <div className="flex-1 flex flex-col">
                <InterviewTopBar
                    sessionTime={sessionTime}
                    onEndSession={handleEndSession}
                />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                    {tokenData && (
                        <LiveKitRoom
                            token={tokenData.token}
                            serverUrl={tokenData.serverUrl}
                            connect={true}
                            audio={true}
                            video={true}
                            onDisconnected={handleDisconnected}
                            className="w-full"
                        >
                            <LiveKitInterview 
                                sessionId={sessionId} 
                                onEndSession={handleEndSession} 
                            />
                        </LiveKitRoom>
                    )}
                </div>

                <div className="bg-white border-t border-[#e7e5e0] px-8 py-3 shrink-0">
                    <div className="flex items-center justify-between text-[10px] text-[#a8a29e] font-mono tracking-widest uppercase font-semibold">
                        <span>● LIVEKIT SYSTEM SECURED</span>
                        <span>TURN DETECTION SILERO VAD ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewPage;