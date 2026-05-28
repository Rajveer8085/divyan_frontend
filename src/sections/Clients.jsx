import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';

/** EDITABLE PLACEHOLDERS — swap with real client/partner names (or logo images). */
const logos = ['E-Commerce', 'Marketplace', 'Nexora', 'Vertex', 'Lumen', 'Orbit Retail', 'Stratus', 'Apex Group'];

const testimonials = [
  {
    quote: 'Divyan rebuilt our marketplace operations from the ground up. Listing health and ROAS improved within the first quarter — execution was flawless.',
    name: 'Rohan Kapoor', role: 'VP E-Commerce', company: 'Nexora Retail', initials: 'RK', grad: 'from-indigo to-cyan',
  },
  {
    quote: 'Their engineering desk ships fast and stays accountable. Our ERP integration went live ahead of schedule with zero downtime.',
    name: 'Sara Williams', role: 'Director of Ops', company: 'Vertex Systems', initials: 'SW', grad: 'from-violet to-indigo',
  },
  {
    quote: 'A genuine partner, not a vendor. The 24/7 monitoring and transparent reporting give us complete confidence at scale.',
    name: 'Imran Sheikh', role: 'Founder', company: 'Orbit Retail', initials: 'IS', grad: 'from-cyan to-emerald',
  },
];

const Clients = () => {
  return (
    <section id="clients" className="relative bg-ink2 text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden border-y border-line">
      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">07 · Clients</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Trusted by teams</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">that ship at scale.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              From marketplace sellers to enterprise platforms — partners who depend on uptime, accuracy, and speed.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Logo marquee — full bleed */}
      <Reveal delay={80}>
        <div className="relative overflow-hidden border-y border-line py-7 mb-16
          [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex whitespace-nowrap marquee-track gap-12 items-center">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0 items-center">
                {logos.map((l) => (
                  <span key={l} className="inline-flex items-center gap-2.5 font-display font-bold text-xl md:text-2xl text-fg/35 hover:text-fg/70 transition-colors">
                    <span className="inline-block w-2.5 h-2.5 rotate-45 bg-current opacity-60" />
                    {l}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Testimonials */}
      <div className="max-w-page mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={80 + i * 110}>
              <figure className="glass glass-hover rounded-2xl p-6 md:p-7 h-full flex flex-col">
                <span className="font-display font-extrabold text-4xl grad-text leading-none mb-4">“</span>
                <blockquote className="font-sans text-[14px] text-fg/85 leading-relaxed flex-1">
                  {t.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-line">
                  <span className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-gradient-to-br ${t.grad} font-display font-bold text-ink/85 text-sm shrink-0`}>
                    {t.initials}
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display font-bold text-[14px] text-fg">{t.name}</span>
                    <span className="block font-sans text-[12px] text-soft">{t.role} · {t.company}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
