import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

function Hero() {
    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <span className="text-blue-400 text-sm font-medium tracking-wider uppercase">
                        AI-DRIVEN INTERVIEW PLATFORM
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                    Master the technical
                    <br />
                    interview with AI.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center text-gray-400 text-lg mb-10 max-w-2xl mx-auto"
                >
                    Evalyn is an AI-powered mock interview platform that evaluates interview responses through transcripts and delivers actionable feedback on communication and technical depth.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-center gap-4 mb-16"
                >
                    <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2"
                        >
                            Get Started for free
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Code Preview Section */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Code Editor Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 font-mono text-sm hover:border-blue-500/50 transition-colors"
                    >
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-gray-400 text-xs ml-2">solution.js</span>
                        </div>
                        <pre className="text-gray-300">
                            <code>
                                {`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`}
                            </code>
                        </pre>
                    </motion.div>

                    {/* AI Chat Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="mb-4 pb-3 border-b border-slate-700">
                            <span className="text-gray-400 text-sm">AI Feedback</span>
                        </div>
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
                            >
                                <p className="text-blue-300 text-sm">
                                    Great solution! Your approach using a hash map is optimal with O(n) time complexity.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.8 }}
                                className="bg-slate-700/50 rounded-lg p-4"
                            >
                                <p className="text-gray-300 text-sm">
                                    Try explaining the edge cases you considered.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
