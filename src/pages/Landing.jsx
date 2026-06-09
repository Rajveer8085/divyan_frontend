import LenisProvider from '../components/LenisProvider';
import ScrollProgress from '../components/ScrollProgress';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import About from '../sections/About';
import Team from '../sections/Team';
import Technologies from '../sections/Technologies';
import Competencies from '../sections/Competencies';
import Showcase from '../sections/Showcase';
import Clients from '../sections/Clients';
import BrandBanner from '../sections/BrandBanner';
import Contact from '../sections/Contact';
import Careers from '../sections/Careers';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <LenisProvider>
      <div className="relative w-full min-h-screen bg-ink text-fg overflow-x-clip font-sans">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Team />
          <Technologies />
          <Competencies />
          <Showcase />
          <Clients />
          <BrandBanner />
          <Contact />
          <Careers />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
