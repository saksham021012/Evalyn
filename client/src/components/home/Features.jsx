import { motion } from 'framer-motion';

function Features() {
    const capabilities = [
        {
            num: "01",
            area: "PREPARATION",
            title: "Tailored Question Matching",
            description: "Evalyn analyzes your resume to understand your unique background. It then designs a custom interview track that directly targets the technologies and projects you have actually worked on."
        },
        {
            num: "02",
            area: "PRACTICE",
            title: "Real-Time Speaking Insights",
            description: "Practice speaking naturally in a realistic interface. Evalyn listens to your responses, instantly transcribing your answers and measuring your speaking speed, pauses, and overall clarity."
        },
        {
            num: "03",
            area: "EVALUATION",
            title: "Actionable Review Reports",
            description: "Receive an instant, easy-to-read summary of your performance. Evalyn highlights your strengths, points out areas for improvement, and gives you step-by-step suggestions to perfect your answers."
        }
    ];

    return (
        <section id="learn-more" className="py-32 px-6 bg-transparent border-t border-zinc-200 relative">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="mb-24">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                            Core capabilities
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1c1917] mb-6 font-serif">
                        Systematic evaluation. No guesswork.
                    </h2>
                    <p className="text-zinc-600 text-sm max-w-xl leading-relaxed">
                        Evalyn executes granular diagnostic audits on candidate responses, evaluating both raw technical correctness and verbal communication structure.
                    </p>
                </div>

                {/* Capabilities Grid with single-sided borders */}
                <div className="grid md:grid-cols-3 border-t border-l border-zinc-200">
                    {capabilities.map((item, index) => (
                        <div 
                            key={index}
                            className="border-r border-b border-zinc-200 p-8 md:p-10 bg-white/40 hover:bg-white/90 shadow-sm transition-colors duration-300 flex flex-col justify-between min-h-[300px]"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-8 font-mono">
                                    <span className="text-xs text-[#2b4c3f] font-semibold tracking-widest">
                                        {item.num}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                                        // {item.area}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#1c1917] mb-4 tracking-tight font-serif">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-zinc-200/40 flex justify-end font-mono">
                                <span className="text-[9px] text-zinc-400 uppercase tracking-wider">
                                    Status: Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Features;
