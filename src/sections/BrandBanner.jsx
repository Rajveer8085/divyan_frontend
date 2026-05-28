import Reveal from '../components/Reveal';
import Magnetic from '../components/Magnetic';

const BrandBanner = () => {
  return (
    <section id="brand" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden">
      <div className="aurora opacity-50" aria-hidden />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">Our promise</span>
            <span className="w-6 h-px bg-indigo" />
          </div>
        </Reveal>

        <Reveal variant="scale" delay={80}>
          <div className="relative rounded-3xl overflow-hidden border border-line shadow-card group">
            {/* Glow halo behind frame */}
            <div aria-hidden className="absolute -inset-px rounded-3xl pointer-events-none"
              style={{ boxShadow: '0 0 80px -20px rgba(34,211,238,0.4)' }} />

            <img
              src="/brand-banner.png"
              alt="Divyan Tech — Building Tomorrow, Together. Innovative IT solutions that empower businesses."
              loading="lazy"
              className="w-full h-auto block transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
            />

            {/* Edge blends so the banner melts into the dark theme */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-ink/70 to-transparent pointer-events-none" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />
            <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-3xl pointer-events-none" />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Magnetic strength={0.18}>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2.5 font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-7 py-3.5 rounded-full transition-colors duration-500 shadow-glow w-full sm:w-auto"
              >
                Start a project
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a
              href="#services"
              className="group inline-flex items-center justify-center gap-2.5 font-sans text-sm font-semibold text-fg glass hover:border-indigo/40 px-7 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              See what we do
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default BrandBanner;
