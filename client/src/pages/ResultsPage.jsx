import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Share2, FileCheck } from 'lucide-react';
import { getResults, downloadReport } from '../services';
import ResultsNavbar from '../components/results/ResultsNavbar';
import ExecutiveSummary from '../components/results/ExecutiveSummary';
import KeyTakeaways from '../components/results/KeyTakeaways';
import ScoreBreakdown from '../components/results/ScoreBreakdown';
import TopHighlights from '../components/results/TopHighlights';
import SessionEvidence from '../components/results/SessionEvidence';
import GrowthOpportunities from '../components/results/GrowthOpportunities';
import ResumeSync from '../components/results/ResumeSync';

function ResultsPage() {
    const { sessionId } = useParams();
    const dispatch = useDispatch();
    const { results } = useSelector((state) => state.results);
    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (sessionId) {
            dispatch(getResults(sessionId));
        }
    }, [sessionId, dispatch]);

    const handleDownload = () => {
        if (sessionId) {
            dispatch(downloadReport(sessionId));
        }
    };

    if (loading || !results) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center text-[#1c1917] bg-grid-pattern">
                <div className="text-center p-8 bg-white border border-[#e7e5e0] rounded-2xl shadow-sm max-w-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2b4c3f] mx-auto mb-4"></div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#78716c]">Generating report...</p>
                </div>
            </div>
        );
    }

    const candidate = results.candidate || { name: 'Candidate', role: 'Role', id: 'N/A' };
    const executiveSummary = results.executiveSummary || { score: 0, recommendation: 'Pending', description: 'No summary available' };

    return (
        <div className="min-h-screen bg-[#f5f4f0] bg-grid-pattern pb-12">
            <ResultsNavbar onDownload={handleDownload} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 text-[#78716c] text-xs sm:text-sm font-mono tracking-wider uppercase mb-4">
                        <span>Interviews</span>
                        <span>›</span>
                        <span className="text-[#1c1917] font-bold">{candidate.name}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] mb-2 font-serif tracking-tight">Detailed Interview Summary</h1>
                            <p className="text-sm sm:text-base text-[#78716c] font-mono">
                                Technical Assessment: {candidate.role} • Candidate ID {candidate.id}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="bg-[#2b4c3f]/10 text-[#2b4c3f] border border-[#2b4c3f]/20 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wider font-mono">
                                REVIEW COMPLETE
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - 2/3 width on desktop */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <ExecutiveSummary
                            score={executiveSummary.score}
                            recommendation={executiveSummary.recommendation}
                            description={executiveSummary.description}
                        />

                        <KeyTakeaways takeaways={results.keyTakeaways || []} />

                        <ScoreBreakdown scores={results.scoreBreakdown || []} />
                        
                        {(results.growthOpportunities && results.growthOpportunities.length > 0) && (
                            <GrowthOpportunities opportunities={results.growthOpportunities} />
                        )}
                    </div>

                    {/* Right Column - 1/3 width on desktop */}
                    <div className="space-y-4 sm:space-y-6">
                        <TopHighlights highlights={results.topHighlights || []} />
                        
                        {(results.resumeSync && results.resumeSync.length > 0) && (
                            <ResumeSync items={results.resumeSync} />
                        )}
                        
                        <SessionEvidence evidence={results.sessionEvidence || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsPage;
