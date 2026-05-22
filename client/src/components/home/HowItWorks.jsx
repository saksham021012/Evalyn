import { motion } from 'framer-motion';

function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Upload Your Resume",
            description: "Simply drag and drop your resume. Our system reads your profile to prepare custom questions tailored to your experience.",
            preview: (
                <div className="bg-[#eae8e3] p-4 border border-zinc-200 font-mono text-[10px] text-zinc-700 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-3 text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                        <span className="ml-1 text-[9px] uppercase tracking-wider text-zinc-400">resume_compiler.json</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed text-zinc-600">
{`{
  "profile": "Senior SRE",
  "technologies": ["K8s", "Go", "gRPC"],
  "target_level": "L6",
  "parsed_signals": 18
}`}
                    </pre>
                </div>
            )
        },
        {
            num: "02",
            title: "Start the Simulation",
            description: "Answer the questions out loud as if you were in a real interview. The system captures your response and translates it into text.",
            preview: (
                <div className="bg-[#eae8e3] p-4 border border-zinc-200 font-mono text-[10px] text-zinc-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] text-[#2b4c3f] uppercase tracking-widest font-semibold">// LIVE AUDIO STREAM</span>
                        <span className="text-zinc-500 text-[8px] animate-pulse">REC</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-6 my-2 px-1">
                        <span className="w-1 bg-zinc-300 h-2"></span>
                        <span className="w-1 bg-[#2b4c3f] h-5"></span>
                        <span className="w-1 bg-[#2b4c3f]/80 h-3"></span>
                        <span className="w-1 bg-zinc-400 h-4"></span>
                        <span className="w-1 bg-[#2b4c3f] h-6"></span>
                        <span className="w-1 bg-[#2b4c3f]/60 h-3"></span>
                        <span className="w-1 bg-zinc-300 h-2"></span>
                    </div>
                    <div className="text-[9px] text-zinc-600 leading-tight">
                        "For high-availability, I'd set up a multi-region cluster..."
                    </div>
                </div>
            )
        },
        {
            num: "03",
            title: "Get Your Feedback",
            description: "View a detailed breakdown of your scores, check where you did well, and get helpful tips on how to improve.",
            preview: (
                <div className="bg-[#eae8e3] p-4 border border-zinc-200 font-mono text-[10px] text-zinc-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3 text-zinc-500">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400">EVAL_REPORT_03.log</span>
                        <span className="text-[#2b4c3f] text-[9px] font-bold">COMPLETE</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between border-b border-zinc-200 pb-1">
                           <span className="text-zinc-500">SYSTEM DESIGN</span>
                           <span className="text-zinc-800 font-bold">89%</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-200 pb-1">
                           <span className="text-zinc-500">LATENCY RADAR</span>
                           <span className="text-zinc-800 font-bold">92%</span>
                        </div>
                        <div className="text-[9px] text-[#2b4c3f] leading-tight pt-1">
                            + Feedback: Expand on split-brain scenario.
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section id="how-it-works" className="py-32 px-6 bg-transparent border-t border-zinc-200">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="mb-24 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 justify-center">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                            The Methodology
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1c1917] mb-6 font-serif">
                        Engineered flow. Seamless execution.
                    </h2>
                    <p className="text-zinc-600 text-sm max-w-xl mx-auto leading-relaxed">
                        A rigorous three-step process built to replicate top-tier engineering mock cycles with precision analytics.
                    </p>
                </div>

                {/* Steps Horizontal/Grid Flow */}
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col justify-between p-6 border border-zinc-200 bg-white/50 hover:bg-white transition-all shadow-sm rounded-xl min-h-[380px]"
                        >
                            {/* Step Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="font-mono text-[11px] text-[#2b4c3f] font-bold bg-[#2b4c3f]/10 border border-[#2b4c3f]/25 px-2 py-0.5 rounded">
                                        STEP {step.num}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-[#1c1917] mb-3 font-serif">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-600 text-xs md:text-sm leading-relaxed mb-6">
                                    {step.description}
                                </p>
                            </div>

                            {/* Technical Live Preview */}
                            <div className="mt-auto">
                                {step.preview}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default HowItWorks;
