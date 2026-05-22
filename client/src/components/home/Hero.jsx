import { Link } from 'react-router-dom';
import LiveSimulator from './LiveSimulator';

function Hero() {
    return (
        <section className="pt-36 pb-24 px-6 bg-transparent text-[#1c1917] overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Side: Editorial Typography & Minimal Copy */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 mb-6 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                        <span>SYSTEM VERSION 2.4.0</span>
                    </div>

                    <h1 className="text-[44px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-tight leading-[1.08] mb-8 font-serif text-[#1c1917]">
                        Technical<br />
                        interview<br />
                        prep<br />
                        that <span className="text-[#2b4c3f] italic font-serif font-normal">actually</span><br />
                        prepares<br />
                        you.
                    </h1>

                    <p className="text-zinc-600 text-[14px] sm:text-[15px] leading-relaxed mb-10 max-w-[400px] font-sans">
                        Practice system design, coding, and behavioral interviews in a realistic simulator. Get instant feedback on correctness, clarity, and depth.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <Link to="/signup" className="flex justify-center items-center bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-sm px-8 py-3.5 text-xs font-mono tracking-widest uppercase font-bold transition-all duration-200 rounded-xl">
                            Get Started Free
                        </Link>
                        <a href="#learn-more" className="flex justify-center items-center bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-sm px-8 py-3.5 text-xs font-mono tracking-widest uppercase font-bold transition-all duration-200 rounded-xl">
                            View Capabilities
                        </a>
                    </div>

                    {/* Trust list & scroll indicator */}
                    <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-4 text-[11px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#2b4c3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            No signup required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#2b4c3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Real-time feedback
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#2b4c3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            3 free sessions
                        </span>
                        
                        <a href="#learn-more" className="w-8 h-8 rounded-full bg-[#1c1917]/90 text-white flex items-center justify-center hover:bg-[#1c1917] transition-all ml-2 shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Right Side: Interactive Live Interview Simulator (Light Theme Card) */}
                <div className="lg:col-span-7">
                    <LiveSimulator />
                </div>

            </div>
        </section>
    );
}

export default Hero;
