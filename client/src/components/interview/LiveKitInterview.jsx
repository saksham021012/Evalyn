import { useState, useEffect, useRef } from 'react';
import {
    useRoomContext,
    useParticipants,
    useLocalParticipant,
    useTracks,
    RoomAudioRenderer
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import AgentCard from './livekit/AgentCard';
import CandidateFeed from './livekit/CandidateFeed';
import TranscriptionPanel from './livekit/TranscriptionPanel';

function LiveKitInterview({ sessionId, onEndSession }) {
    const room = useRoomContext();
    const participants = useParticipants();
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();
    
    // Find the remote agent participant
    const agentParticipant = participants.find(p => !p.isLocal);
    
    // Agent states: 'idle' | 'listening' | 'thinking' | 'speaking'
    const agentState = agentParticipant?.attributes?.['lk.agent.state'] || 'idle';
    const isAgentSpeaking = agentParticipant?.isSpeaking || false;
    
    // Get Agent's audio track reference for the BarVisualizer
    const microphoneTracks = useTracks([Track.Source.Microphone]);
    const agentAudioTrackRef = microphoneTracks.find(ref => ref?.participant && !ref.participant.isLocal);
    
    // Get Local candidate's camera track reference
    const cameraTracks = useTracks([Track.Source.Camera]);
    const localCamTrackRef = cameraTracks.find(ref => ref?.participant && ref.participant.isLocal);

    // Live transcript state
    const [messages, setMessages] = useState([]);
    const transcriptEndRef = useRef(null);

    // Auto-scroll transcripts
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Capture real-time transcriptions using LiveKit text stream handler
    useEffect(() => {
        if (!room) return;

        const handleTextStream = async (reader, participantInfo) => {
            try {
                const isTranscription = reader.info.attributes['lk.transcribed_track_id'] !== undefined;
                if (!isTranscription) return;

                const identity = participantInfo?.identity;
                const isLocal = identity && room.localParticipant && identity === room.localParticipant.identity;
                const speakerName = isLocal ? 'You' : 'Interviewer';
                
                // readAll resolves when the stream is complete for this segment
                const text = await reader.readAll();
                if (text && text.trim()) {
                    setMessages(prev => {
                        // Avoid exact duplicate consecutive messages
                        if (prev.length > 0 && prev[prev.length - 1].text === text.trim() && prev[prev.length - 1].sender === speakerName) {
                            return prev;
                        }
                        return [...prev, {
                            id: Math.random().toString(),
                            sender: speakerName,
                            text: text.trim(),
                            timestamp: new Date()
                        }];
                    });
                }
            } catch (err) {
                console.error('[LiveKitInterview] Error reading transcription stream:', err);
            }
        };

        room.registerTextStreamHandler('lk.transcription', handleTextStream);

        // Send a greeting reminder text to log just in case
        setMessages([
            {
                id: 'welcome',
                sender: 'System',
                text: 'Connected to AI Interviewer. Start speaking when you are ready.',
                timestamp: new Date()
            }
        ]);

        return () => {
            try {
                room.unregisterTextStreamHandler('lk.transcription');
            } catch (err) {
                console.error('[LiveKitInterview] Error unregistering text stream handler:', err);
            }
        };
    }, [room]);

    const toggleMic = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
        } catch (err) {
            console.error('Failed to toggle microphone:', err);
        }
    };

    const toggleCamera = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setCameraEnabled(!isCameraEnabled);
        } catch (err) {
            console.error('Failed to toggle camera:', err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto items-stretch">
            {/* RoomAudioRenderer mounts the audio element automatically for voice playback */}
            <RoomAudioRenderer />

            {/* Left Column: Stacked Agent and Candidate Video Feed (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <AgentCard 
                    agentState={agentState} 
                    isAgentSpeaking={isAgentSpeaking} 
                    agentAudioTrackRef={agentAudioTrackRef} 
                />
                <CandidateFeed 
                    isCameraEnabled={isCameraEnabled} 
                    localCamTrackRef={localCamTrackRef} 
                    isMicrophoneEnabled={isMicrophoneEnabled} 
                    toggleMic={toggleMic} 
                    toggleCamera={toggleCamera} 
                    onEndSession={onEndSession} 
                />
            </div>

            {/* Right Column: Live Transcription panel (5 cols) */}
            <TranscriptionPanel 
                messages={messages} 
                transcriptEndRef={transcriptEndRef} 
            />
        </div>
    );
}

export default LiveKitInterview;
