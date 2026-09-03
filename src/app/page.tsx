import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutBento from '@/components/AboutBento';
import PracticeAccordion from '@/components/PracticeAccordion';
import BlogSection from '@/components/BlogSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import DisclaimerModal from '@/components/DisclaimerModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent selection:bg-amber-500/30 selection:text-amber-200">
      <DisclaimerModal />
      <Navbar />
      
      <main className="relative">
        <HeroSection />
        <AboutBento />
        <PracticeAccordion />
        <BlogSection />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}