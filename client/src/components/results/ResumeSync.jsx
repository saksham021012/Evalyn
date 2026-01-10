import { CheckCircle } from 'lucide-react';

function ResumeSync({ items }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Resume Sync</h2>

            <div className="space-y-4">
                {(items || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-medium mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResumeSync;
