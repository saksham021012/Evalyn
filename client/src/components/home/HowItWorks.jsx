import { Upload, Video, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

function HowItWorks() {
    const steps = [
        {
            icon: <Upload className="w-10 h-10 text-blue-500" />,
            title: "Upload Resume",
            description: "Upload your PDF or DOCX resume. Our AI instantly parses and analyzes your skills, experience, and suggests the perfect interview difficulty."
        },
        {
            icon: <Video className="w-10 h-10 text-blue-500" />,
            title: "AI Video Interview",
            description: "Answer AI-generated questions tailored to your profile. Record video responses with real-time speech-to-text transcription."
        },
        {
            icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
            title: "Get Detailed Feedback",
            description: "Receive comprehensive AI evaluation with scores, strengths, weaknesses, and resume claim verification for every answer."
        }
    ];

    return (
        <section id="how-it-works" className="py-20 px-6">
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
                        How it Works
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A simple and proven process to help you prepare, practice, and excel in your next technical interview.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="text-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-2xl mb-6"
                            >
                                {step.icon}
                            </motion.div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
