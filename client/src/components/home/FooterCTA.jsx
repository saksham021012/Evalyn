import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function FooterCTA() {
    return (
        <section className="py-20 px-6 bg-slate-900/50">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to land your dream job?
                </h2>
                <p className="text-gray-400 text-lg mb-10">
                    Join 10,000+ engineers practicing with AI-powered mock interviews every single day.
                </p>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        to="/signup"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-medium text-lg transition"
                    >
                        Create Your Account
                    </Link>
                </motion.div>
                <p className="text-gray-500 text-sm mt-4">
                    No credit card required
                </p>
            </motion.div>
        </section>
    );
}

export default FooterCTA;
