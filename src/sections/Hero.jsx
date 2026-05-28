import Reveal from '../components/Reveal';
import WordReveal from '../components/WordReveal';
import MaskReveal from '../components/MaskReveal';
import WireScene from '../components/WireScene';
import Magnetic from '../components/Magnetic';
import CountUp from '../components/CountUp';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-ink text-fg flex items-center pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden"
    >
      <div className="aurora" aria-hidden />
      <div aria-hidden className="absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

      <div className="max-w-page mx-auto px-5 sm:px-6 md:px-10 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <Reveal>
              <a
                href="#about"
                className="inline-flex items-center gap-2 font-sans text-[12px] font-medium text-fg/90 glass px-3 py-1.5 rounded-full mb-7 hover:border-indigo/40 transition-colors"
              >
                <span className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald opacity-70 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
                </span>
                Engineering since 2008
                <span aria-hidden className="text-soft">→</span>
              </a>
            </Reveal>

            <h1 className="font-display font-extrabold text-hero text-fg mx-auto lg:mx-0 max-w-[16ch]">
              <WordReveal text="Engineering innovation across" stagger={55} className="block" />
              <span className="block">
                <WordReveal text="digital & enterprise" stagger={55} delay={360} wordClassName="grad-text text-glow" />{' '}
                <WordReveal text="ecosystems." stagger={55} delay={640} />
              </span>
            </h1>

            <Reveal delay={820}>
              <p className="font-sans text-[15px] md:text-[17px] text-mid max-w-xl mx-auto lg:mx-0 mt-6 leading-[1.6]">
                We architect powerful software infrastructures while managing global-scale industrial
                and marketing operations with flawless execution.
              </p>
            </Reveal>

            <Reveal delay={960}>
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                <Magnetic strength={0.18}>
                  <a
                    href="#services"
                    className="group inline-flex items-center justify-center gap-2.5 font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-500 shadow-glow"
                  >
                    Explore services
                    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </a>
                </Magnetic>
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-2.5 font-sans text-sm font-semibold text-fg glass hover:border-indigo/40 px-6 py-3.5 rounded-full transition-all duration-300"
                >
                  Book a consult
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={1100}>
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <Stat value={<CountUp to={18} format={(n) => `${n}+`} />} label="Years" />
                <Stat value={<CountUp to={120} format={(n) => `${n}+`} />} label="Brands" />
                <Stat value={<><CountUp to={24} />/7</>} label="Support" />
              </div>
            </Reveal>
          </div>

          {/* 3D */}
          <Reveal
            variant="scale"
            delay={150}
            className="lg:col-span-5 relative h-[300px] sm:h-[400px] lg:h-[560px] order-first lg:order-none"
          >
            <div aria-hidden className="absolute inset-6 sm:inset-10 rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,139,255,0.22), transparent 65%)' }} />
            <WireScene className="absolute inset-0" size="lg" />
            <span className="hidden sm:block absolute top-3 left-3 font-mono text-[10px] tracking-[0.25em] uppercase text-soft">
              Fig.01 / Infrastructure
            </span>
            <span className="hidden sm:inline-flex absolute bottom-3 right-3 items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Scroll to rotate
            </span>
          </Reveal>
        </div>

        {/* Trusted strip */}
        <Reveal delay={160} className="mt-14 md:mt-20">
          <div className="border-t border-line pt-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-soft shrink-0">
              Trusted operations
            </span>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 font-display font-bold text-fg/40 text-base sm:text-lg tracking-tight">
              <MaskReveal>Amazon SPN</MaskReveal>
              <MaskReveal delay={80}>Flipkart</MaskReveal>
              <MaskReveal delay={160}>Enterprise ERP</MaskReveal>
              <MaskReveal delay={240}>Corporate Channels</MaskReveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Stat = ({ value, label }) => (
  <div className="text-center lg:text-left">
    <div className="font-display font-extrabold text-2xl sm:text-3xl text-fg tracking-tight">{value}</div>
    <div className="font-sans text-[10px] sm:text-[11px] text-soft mt-1 uppercase tracking-wider">{label}</div>
  </div>
);

export default Hero;
