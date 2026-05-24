import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { getInterviewSession } from '../services';

import CompletedHeader from '../components/interview/completed/CompletedHeader';
import ProgressCard from '../components/interview/completed/ProgressCard';
import MilestonesCard from '../components/interview/completed/MilestonesCard';
import CompletedActions from '../components/interview/completed/CompletedActions';

const INSIGHTS = [
    "Confidence and pacing are just as important as technical accuracy. Take a breath before speaking.",
    "When asked a technical question, structuring your explanation with the STAR method (Situation, Task, Action, Result) helps keep it concise.",
    "If you don't know the answer immediately, talk through your thought process out loud. Interviewers value how you think.",
    "Evaluations are personalized to the skills mentioned in your resume to measure matches and growth opportunities."
];

export default function InterviewCompletedPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('grading'); // grading | completed
    const [insightIndex, setInsightIndex] = useState(0);

    const pollingIntervalRef = useRef(null);

    // Rotate insights every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setInsightIndex((prev) => (prev + 1) % INSIGHTS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Initial fetch and poll
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await dispatch(getInterviewSession(sessionId, false));
                if (data) {
                    setSession(data);
                    setProgress(data.gradingProgress || 0);
                    setStatus(data.status);
                    
                    if (data.status === 'completed') {
                        setProgress(100);
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching session status in completion page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        pollingIntervalRef.current = setInterval(fetchStatus, 3000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [sessionId, dispatch]);

    const handleViewResults = () => {
        if (status === 'completed') {
            toast.success("Opening detailed performance report.");
            navigate(`/interview/results/${sessionId}`);
        } else {
            toast.error("Evaluation is still in progress. Please wait.");
        }
    };

    if (loading && !session) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex flex-col items-center justify-center p-8">
                <Loader2 className="w-10 h-10 text-[#2b4c3f] animate-spin mb-4" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Loading session data...</span>
            </div>
        );
    }

    const isGradingComplete = status === 'completed' || progress >= 100;

    return (
        <div className="min-h-screen bg-[#f5f4f0] flex flex-col justify-between select-none" style={{
            backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}>
            {/* Header Component */}
            <CompletedHeader />

            {/* Main Content */}
            <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                {/* Progress Card Component */}
                <ProgressCard 
                    sessionId={sessionId}
                    progress={progress}
                    isGradingComplete={isGradingComplete}
                    insightText={INSIGHTS[insightIndex]}
                />

                {/* Milestones Card Component */}
                <MilestonesCard 
                    progress={progress}
                    session={session}
                />
            </div>

            {/* Action Bar Component */}
            <CompletedActions 
                isGradingComplete={isGradingComplete}
                onGoToDashboard={() => navigate('/dashboard')}
                onViewResults={handleViewResults}
            />
        </div>
    );
}
