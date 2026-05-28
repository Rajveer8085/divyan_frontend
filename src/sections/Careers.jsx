import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import Magnetic from '../components/Magnetic';
import useInView from '../components/useInView';

const openPositions = [
  {
    id: '01',
    title: 'Marketplace Account Manager',
    sub: 'Amazon SPN',
    department: 'E-Commerce Logistics',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    experience: '2+ yrs',
    desc: 'Engineer end-to-end marketplace operations. Verified expertise in Amazon SPN architecture, Flipkart cataloging, inventory health optimization, and ROAS-driven advertisement management.',
  },
  {
    id: '02',
    title: 'Full-Stack Software Engineer',
    sub: 'Java / React',
    department: 'Application Engineering',
    location: 'Remote',
    type: 'Full-Time',
    experience: '1–3 yrs',
    desc: 'Build low-latency web applications. Deep architecture knowledge of Java Spring Boot pipelines, RESTful microservices, MySQL normalization, and premium Tailwind/React frontends.',
  },
];

const Careers = () => {
  // Only mount the (heavy) background video once the section is near the viewport.
  const [sectionRef, near] = useInView({ threshold: 0, rootMargin: '0px 0px 800px 0px', once: true });

  return (
    <section
      ref={sectionRef}
      id="careers"
      className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden"
    >
      {/* Background video + overlays */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {near && (
          <video
            className="w-full h-full object-cover opacity-100"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/team-working.mp4" type="video/mp4" />
          </video>
        )}
        {/* Darkening layers for legibility + edge blend into neighbouring sections */}
        <div className="absolute inset-0 bg-ink/78" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-dots opacity-25" />
      </div>

      <div className="max-w-page mx-auto relative z-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">09 · Careers</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Operators and engineers</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">who ship at scale.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-fg/80 leading-relaxed">
              We hire sharp technical brains and strategic marketplace operators who want to build high-performance architectures.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {openPositions.map((job, i) => (
            <Reveal key={job.id} delay={80 + i * 130}>
              <a href="#contact" className="glass glass-hover group relative block rounded-2xl p-6 md:p-9">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
                  <div className="md:col-span-8">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-indigo bg-indigo/12 px-2.5 py-1 rounded-full">{job.department}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-soft bg-white/5 px-2.5 py-1 rounded-full">{job.type}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-soft bg-white/5 px-2.5 py-1 rounded-full">{job.location}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-soft bg-white/5 px-2.5 py-1 rounded-full">{job.experience}</span>
                    </div>
                    <h3 className="font-display font-extrabold text-2xl md:text-3xl text-fg leading-tight tracking-tight2 mb-3">
                      {job.title}
                      <span className="block md:inline grad-text md:ml-2.5 font-bold text-xl md:text-2xl">/ {job.sub}</span>
                    </h3>
                    <p className="font-sans text-[14px] text-fg/75 leading-relaxed max-w-2xl">{job.desc}</p>
                  </div>
                  <div className="md:col-span-4 md:text-right">
                    <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink bg-fg group-hover:bg-indigo group-hover:text-fg transition-colors duration-500 px-5 py-3 rounded-full">
                      Apply now <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl p-7 md:p-10 relative overflow-hidden bg-gradient-to-br from-indigo to-violet">
            <div aria-hidden className="absolute inset-0 bg-dots opacity-20" />
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8">
                <h4 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-tight tracking-tight2 mb-2">
                  Don't see a matching role?
                </h4>
                <p className="font-sans text-[14px] text-white/85 leading-relaxed max-w-xl">
                  Drop your system profile, portfolio, or GitHub repository data directly at our communication desk.
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Magnetic strength={0.18}>
                  <a href="#contact" className="inline-flex items-center gap-2.5 font-sans text-sm font-semibold text-ink bg-white hover:bg-white/90 px-6 py-3.5 rounded-full transition-colors duration-500">
                    Submit profile <span aria-hidden>→</span>
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Careers;
