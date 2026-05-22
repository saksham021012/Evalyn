import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import FooterCTA from '../components/home/FooterCTA';

function HomePage() {
    return (
        <div className="min-h-screen bg-grid-pattern">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <FooterCTA />
        </div>
    );
}

export default HomePage;
