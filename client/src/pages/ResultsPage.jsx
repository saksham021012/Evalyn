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
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Generating your comprehensive report...</p>
                </div>
            </div>
        );
    }

    const candidate = results.candidate || { name: 'Candidate', role: 'Role', id: 'N/A' };
    const executiveSummary = results.executiveSummary || { score: 0, recommendation: 'Pending', description: 'No summary available' };

    return (
        <div className="min-h-screen bg-black">
            <ResultsNavbar onDownload={handleDownload} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-4">
                        <span>Interviews</span>
                        <span>›</span>
                        <span className="text-white">{candidate.name}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Detailed Interview Summary</h1>
                            <p className="text-sm sm:text-base text-gray-400">
                                Technical Assessment: {candidate.role} • Candidate ID {candidate.id}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
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
                    </div>

                    {/* Right Column - 1/3 width on desktop */}
                    <div className="space-y-4 sm:space-y-6">
                        <TopHighlights highlights={results.topHighlights || []} />
                        <SessionEvidence evidence={results.sessionEvidence || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsPage;
