import React from 'react';

export default function MilestonesCard({ progress, session }) {
    // Calculate dynamic milestones based on current progress
    const getMilestoneState = (milestoneProg) => {
        if (progress >= milestoneProg) return 'completed';
        if (progress > 0 && progress >= (milestoneProg - 20)) return 'active';
        return 'pending';
    };

    const formatDuration = (started, completed) => {
        if (!started) return 'N/A';
        const start = new Date(started);
        const end = completed ? new Date(completed) : new Date();
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        return `${Math.max(1, diffMins)} mins`;
    };

    return (
        <div className="w-full md:w-80 bg-white border border-[#e7e5e0] rounded-2xl p-6 shadow-sm flex flex-col justify-between self-stretch">
            <div>
                <h3 className="font-mono text-[10px] text-[#a8a29e] uppercase tracking-widest font-semibold border-b border-[#f0ede8] pb-3 mb-4">
                    Milestones
                </h3>
                
                <div className="space-y-4">
                    {[
                        { text: 'Session Finalized', val: 10 },
                        { text: 'Extracting Questions', val: 25 },
                        { text: 'Grading Responses', val: 80 },
                        { text: 'Generating Summary', val: 90 },
                        { text: 'Syncing Database', val: 100 },
                    ].map((milestone, idx) => {
                        const state = getMilestoneState(milestone.val);
                        return (
                            <div key={idx} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                                    state === 'completed' 
                                        ? 'bg-[#2b4c3f]/10 border-[#2b4c3f] text-[#2b4c3f]' 
                                        : state === 'active'
                                        ? 'bg-amber-50 border-amber-500 text-amber-600 animate-pulse'
                                        : 'bg-white border-[#e7e5e0]'
                                }`}>
                                    {state === 'completed' && <span className="text-[8px] font-bold">✓</span>}
                                    {state === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                                </div>
                                <span className={`text-xs font-mono tracking-tight transition-colors duration-300 ${
                                    state === 'completed' 
                                        ? 'text-[#1c1917] font-medium' 
                                        : state === 'active'
                                        ? 'text-amber-700 font-bold'
                                        : 'text-[#a8a29e]'
                                }`}>
                                    {milestone.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Metadata Card Footer */}
            <div className="mt-8 pt-4 border-t border-[#f0ede8]">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#a8a29e]">Role:</span>
                        <span className="text-[#57534e] font-semibold">{session?.role || 'Engineer'}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#a8a29e]">Difficulty:</span>
                        <span className="text-[#57534e] font-semibold capitalize">{session?.difficulty || 'Medium'}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#a8a29e]">Duration:</span>
                        <span className="text-[#57534e] font-semibold">
                            {formatDuration(session?.startedAt, session?.completedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
