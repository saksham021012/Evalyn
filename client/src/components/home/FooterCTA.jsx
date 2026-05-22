import { Link } from 'react-router-dom';

function FooterCTA() {
    return (
        <section className="py-32 px-6 bg-transparent border-t border-zinc-200 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                
                <div className="inline-flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                        Diagnostics Sandbox
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1c1917] mb-6 font-serif">
                    Start diagnosing your technical gaps today.
                </h2>
                
                <p className="text-zinc-600 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed font-sans">
                    Join engineers using Evalyn to refine their system design patterns, concurrency details, and communication accuracy.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="w-full sm:w-auto inline-block bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white border border-[#2b4c3f] shadow-sm px-10 py-4 text-xs font-mono tracking-widest uppercase font-bold transition-all duration-200 rounded-xl"
                    >
                        Create Your Account
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto inline-block bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-sm px-10 py-4 text-xs font-mono tracking-widest uppercase font-bold transition-all duration-200 rounded-xl"
                    >
                        Access Dashboard
                    </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>// No credit card required</span>
                    <span className="hidden sm:inline text-zinc-300">•</span>
                    <span>// Instant compiler access</span>
                </div>

            </div>
        </section>
    );
}

export default FooterCTA;
