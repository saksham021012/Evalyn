import { MessageSquare, Video, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

function Features() {
    const features = [
        {
            icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
            title: "AI-Powered Resume Analysis",
            description: "Upload your resume and get instant AI analysis with skill categorization, experience evaluation, and personalized interview difficulty suggestions."
        },
        {
            icon: <Video className="w-8 h-8 text-blue-500" />,
            title: "Real-time Video Interviews",
            description: "Practice with AI-generated questions tailored to your resume. Record video responses with speech-to-text transcription for comprehensive feedback."
        },
        {
            icon: <FileText className="w-8 h-8 text-blue-500" />,
            title: "Detailed AI Feedback",
            description: "Receive instant evaluation on every answer with scores, strengths, weaknesses, and actionable suggestions to improve your performance."
        }
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section id="learn-more" className="py-20 px-6 bg-slate-900/50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Engineered for excellence
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Our platform is designed to help you succeed with cutting-edge AI technology and proven interview strategies.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors cursor-pointer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                                className="mb-4"
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Features;
