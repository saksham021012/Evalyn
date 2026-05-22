import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIMULATION_TRACKS = {
    backend: {
        title: "Backend Engineering",
        question: "Design a rate limiter for a high-throughput API.",
        code: `class RateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate; // tokens per sec
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  
  allowRequest() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`,
        transcript: [
            { text: "For rate limiting at scale, I'd implement a token bucket algorithm.", delay: 500 },
            { text: " We can store token balances in Redis using a hash mapping client IDs.", delay: 2500 },
            { text: " This ensures O(1) checks and distributed atomic operations with Lua scripts.", delay: 4800 }
        ],
        feedback: [
            { label: "Algorithm Selection", value: "Token Bucket Chosen", time: "0:02" },
            { label: "Architecture", value: "Distributed state via Redis", time: "0:06" },
            { label: "Concurrency", value: "Lua atomic operations", time: "0:10" }
        ],
        scores: { correctness: 94, communication: 90, design: 88 }
    },
    systemDesign: {
        title: "System Design",
        question: "Design a real-time notification service for 100M active users.",
        code: `[Client] ---> [Load Balancer]
                     |
                     v
       [Notification API Gateway]
         /           |           \\
        v            v            v
  [Push Service] [Email Worker] [SMS Worker]
        |
        v
  [WebSockets]`,
        transcript: [
            { text: "To handle 100 million users, we need a decoupled messaging architecture.", delay: 500 },
            { text: " I'd put Kafka as the buffer to isolate API gateways from push workers.", delay: 2500 },
            { text: " Push connections will be maintained via persistent WebSockets on isolated nodes.", delay: 4800 }
        ],
        feedback: [
            { label: "Scale Planning", value: "Decoupled Gateway & Workers", time: "0:02" },
            { label: "Reliability", value: "Kafka broker buffers spikes", time: "0:06" },
            { label: "Networking", value: "Isolated stateful WebSockets", time: "0:10" }
        ],
        scores: { correctness: 90, communication: 94, design: 92 }
    },
    frontend: {
        title: "Frontend Architecture",
        question: "Optimize rendering for a virtualized list of 100,000 items.",
        code: `function VirtualList({ items, itemHeight, viewportHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  
  return <div style={{ height: items.length * itemHeight }} />
}`,
        transcript: [
            { text: "To prevent DOM bloat, we only render items currently in the viewport.", delay: 500 },
            { text: " We calculate the visible slice using the container scroll offset and height.", delay: 2500 },
            { text: " And we use absolute positioning with a translateY transform to layout rows.", delay: 4800 }
        ],
        feedback: [
            { label: "DOM Performance", value: "Viewport rendering only", time: "0:02" },
            { label: "State Management", value: "Scroll offset tracking", time: "0:06" },
            { label: "CSS Reflows", value: "GPU-accelerated translates", time: "0:10" }
        ],
        scores: { correctness: 92, communication: 89, design: 95 }
    }
};

function LiveSimulator() {
    const [activeTab, setActiveTab] = useState("backend");
    const [isPlaying, setIsPlaying] = useState(true);
    const [visibleText, setVisibleText] = useState("");
    const [displayedFeedback, setDisplayedFeedback] = useState([]);
    const [currentScores, setCurrentScores] = useState({ correctness: 0, communication: 0, design: 0 });
    const [key, setKey] = useState(0); // For restarting simulation
    const timersRef = useRef([]);
    const intervalsRef = useRef([]);

    const track = SIMULATION_TRACKS[activeTab];

    useEffect(() => {
        // Clear any existing timers and intervals
        timersRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
        timersRef.current = [];
        intervalsRef.current = [];

        if (!isPlaying) return;

        setVisibleText("");
        setDisplayedFeedback([]);
        setCurrentScores({ correctness: 0, communication: 0, design: 0 });

        // Transcript simulation
        track.transcript.forEach((paragraph, idx) => {
            const startTimeout = setTimeout(() => {
                const words = paragraph.text.trim().split(/\s+/);
                let currentWordIndex = 0;

                const interval = setInterval(() => {
                    if (currentWordIndex < words.length) {
                        const word = words[currentWordIndex];
                        if (word !== undefined) {
                            setVisibleText(prev => prev + (prev === "" ? "" : " ") + word);
                        }
                        currentWordIndex++;
                    } else {
                        clearInterval(interval);
                        intervalsRef.current = intervalsRef.current.filter(id => id !== interval);
                    }
                }, 120);

                intervalsRef.current.push(interval);

                // Add corresponding feedback flag
                if (track.feedback[idx]) {
                    setDisplayedFeedback(prev => [...prev, track.feedback[idx]]);
                }

                // Increment scores
                const pct = (idx + 1) / track.transcript.length;
                setCurrentScores({
                    correctness: Math.round(track.scores.correctness * pct),
                    communication: Math.round(track.scores.communication * pct),
                    design: Math.round(track.scores.design * pct)
                });
            }, paragraph.delay);

            timersRef.current.push(startTimeout);
        });

        return () => {
            timersRef.current.forEach(clearTimeout);
            intervalsRef.current.forEach(clearInterval);
        };
    }, [activeTab, isPlaying, key]);

    return (
        <div className="border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 rounded-xl overflow-hidden p-0.5">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-200/20">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                        LIVE_SIMULATOR : evalyn-instance
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-[#2b4c3f]">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full animate-pulse"></span>
                        ACTIVE
                    </span>
                </div>
                
                {/* Simulator Controls */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 hover:bg-zinc-100 rounded transition-colors text-zinc-400 hover:text-zinc-700"
                        title={isPlaying ? "Pause Simulator" : "Play Simulator"}
                    >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                        onClick={() => setKey(prev => prev + 1)}
                        className="p-1 hover:bg-zinc-100 rounded transition-colors text-zinc-400 hover:text-zinc-700"
                        title="Restart Simulation"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Interactive Track Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-200/10">
                {Object.entries(SIMULATION_TRACKS).map(([id, info]) => (
                    <button
                        key={id}
                        onClick={() => {
                            setActiveTab(id);
                            setKey(prev => prev + 1);
                        }}
                        className={`flex-1 text-center py-2.5 font-mono text-[10px] uppercase tracking-widest border-r border-zinc-200 last:border-r-0 transition-all ${
                            activeTab === id 
                                ? "text-[#2b4c3f] bg-white border-b-2 border-b-[#2b4c3f] font-bold" 
                                : "text-zinc-400 hover:text-zinc-700"
                        }`}
                    >
                        {info.title.split(" ")[0]}
                    </button>
                ))}
            </div>

            {/* Simulator Body */}
            <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 bg-zinc-50/10 md:h-[480px]">
                
                {/* Left Pane: Code/Context & Speech */}
                <div className="md:col-span-8 p-5 flex flex-col justify-between bg-white">
                    <div>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono block mb-1">
                            Active Question
                        </span>
                        <h4 className="text-[12px] text-zinc-800 leading-relaxed font-semibold mb-4 font-sans">
                            {track.question}
                        </h4>

                        {/* Speech Output */}
                        <div className="h-[125px] overflow-y-auto scrollbar-thin text-[11px] font-sans text-zinc-700 bg-[#eae8e3] p-4 rounded-xl leading-relaxed mb-4 relative pr-3">
                            {visibleText === "" ? (
                                <span className="text-zinc-500 italic">Simulating speaker input...</span>
                            ) : (
                                <span className="font-sans">
                                    {visibleText}
                                    <span className="inline-block w-1.5 h-3 bg-[#2b4c3f] ml-1 animate-pulse"></span>
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono block mb-2">
                            Environment Context
                        </span>
                        <pre className="text-[10px] text-zinc-600 overflow-x-auto leading-relaxed bg-[#faf9f6] p-4 border border-zinc-200 rounded-xl h-[145px] scrollbar-thin font-mono">
                            <code>{track.code}</code>
                        </pre>
                    </div>
                </div>

                {/* Right Pane: AI Analysis */}
                <div className="md:col-span-4 p-5 flex flex-col justify-between bg-zinc-50/20">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
                                Analysis
                            </span>
                            {/* Audio wave indicator */}
                            {isPlaying && (
                                <div className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 bg-[#2b4c3f] animate-pulse" style={{ height: '60%', animationDuration: '0.6s' }}></span>
                                    <span className="w-0.5 bg-[#2b4c3f] animate-pulse" style={{ height: '90%', animationDuration: '0.4s' }}></span>
                                    <span className="w-0.5 bg-[#2b4c3f] animate-pulse" style={{ height: '40%', animationDuration: '0.8s' }}></span>
                                    <span className="w-0.5 bg-[#2b4c3f] animate-pulse" style={{ height: '70%', animationDuration: '0.5s' }}></span>
                                </div>
                            )}
                        </div>

                        {/* Dynamic Evaluation Tags */}
                        <div className="h-[305px] overflow-y-auto scrollbar-thin space-y-2 pr-1">
                            <AnimatePresence>
                                {displayedFeedback.map((item, index) => {
                                    const isWarning = index === 2;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-start gap-2 p-3 rounded-xl border ${
                                                isWarning 
                                                    ? "bg-amber-50/80 border-amber-200/80 text-amber-900" 
                                                    : "bg-[#eae8e3] border-zinc-200 text-zinc-800"
                                            }`}
                                        >
                                            {isWarning ? (
                                                <span className="w-3.5 h-3.5 text-amber-600 font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">!</span>
                                            ) : (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2b4c3f] mt-0.5 shrink-0" />
                                            )}
                                            <div className="font-mono text-[9px] leading-tight">
                                                <span className={`uppercase font-bold tracking-wider mr-1 ${isWarning ? 'text-amber-700' : 'text-zinc-400'}`}>
                                                    // {item.label}
                                                </span>
                                                <p className="mt-0.5 font-sans text-[10px] leading-snug">{item.value}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Scoring Panel */}
            <div className="border-t border-zinc-200 grid grid-cols-3 divide-x divide-zinc-200 font-mono text-[10px] bg-white">
                <div className="p-4 flex flex-col justify-between">
                    <div>
                        <div className="text-zinc-400 text-[8px] uppercase tracking-widest font-mono mb-1.5">CORRECTNESS</div>
                        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-[#2b4c3f] h-full transition-all duration-500" style={{ width: `${currentScores.correctness}%` }}></div>
                        </div>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">{currentScores.correctness}%</div>
                </div>
                <div className="p-4 flex flex-col justify-between">
                    <div>
                        <div className="text-zinc-400 text-[8px] uppercase tracking-widest font-mono mb-1.5">CLARITY</div>
                        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-[#3b82f6] h-full transition-all duration-500" style={{ width: `${currentScores.communication}%` }}></div>
                        </div>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">{currentScores.communication}%</div>
                </div>
                <div className="p-4 flex flex-col justify-between">
                    <div>
                        <div className="text-zinc-400 text-[8px] uppercase tracking-widest font-mono mb-1.5">DESIGN DEPTH</div>
                        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-[#d97706] h-full transition-all duration-500" style={{ width: `${currentScores.design}%` }}></div>
                        </div>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">{currentScores.design}%</div>
                </div>
            </div>

        </div>
    );
}

export default LiveSimulator;
