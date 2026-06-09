import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import CountUp from '../components/CountUp';

const timeline = [
  { year: 2008, title: 'Establishment & Global Entry',  desc: 'Inception of the organization, delivering foundational technology-enabled business frameworks for global enterprises.' },
  { year: 2018, title: 'Cross-Channel Expansion',       desc: 'Leveraging domain expertise to launch comprehensive consulting structures and corporate strategic alliances globally.' },
  { year: 2024, title: 'Marketplace Operations Pivot',  desc: 'Scaled non-technical operational desks, managing end-to-end seller profiles, cataloging, and corporate digital logistics.' },
  { year: 2026, title: 'Marketing Ecosystem Leaders',   desc: 'Driving high-yield account management across major e-commerce marketplaces and global selling networks.' },
];

const pillars = [
  { tag: 'Mission', title: 'Maximize client resource yield.',      desc: 'We manage high-converting merchant accounts and deploy top-tier marketplace optimization matrices — on time, within budget.' },
  { tag: 'Vision',  title: 'A global frontier in e-commerce ops.', desc: 'Enabling corporate partners to transform their operational visibility seamlessly across digital and physical channels.' },
  { tag: 'Values',  title: 'Accountability without exception.',    desc: 'Premium service certainty that no competitor matches, and structured responsiveness to strategic growth.' },
];

const About = () => {
  return (
    <section id="about" className="relative bg-ink2 text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-x-clip border-y border-line">
      <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[420px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(110,139,255,0.16), transparent 70%)' }} />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">03 · Company</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Engineered certainty,</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">since 2008.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              Divyan Technologies has engineered an extensive global presence in IT and consulting, delivering
              technology-enabled corporate solutions with operational certainty no competitor matches.
            </p>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <StatCell value={<CountUp to={2008} format={(n) => n} />} label="Established" />
          <StatCell value={<CountUp to={18} format={(n) => `${n}+`} />} label="Years operational" />
          <StatCell value={<CountUp to={120} format={(n) => `${n}+`} />} label="Brands managed" />
          <StatCell value={<CountUp to={4} />} label="Active markets" />
        </div>

        {/* Timeline — stacking cards that pin & overlap on scroll */}
        <div className="mb-20">
          <Reveal>
            <h3 className="font-display font-bold text-lg text-fg mb-1.5 tracking-tight">Growth milestones</h3>
            <p className="font-sans text-sm text-mid mb-9">2008 – 2026 · four moments that defined the firm. Scroll to stack.</p>
          </Reveal>

          {/* Each card sticks near the top; the next scrolls up and rests on it,
              offset down a touch so the previous card's year row peeks above. */}
          <div className="relative space-y-6 md:space-y-8">
            {timeline.map((m, i) => (
              <div
                key={m.year}
                className="sticky"
                style={{
                  top: `calc(5.5rem + ${i * 3.25}rem)`,
                  zIndex: i + 1,
                }}
              >
                <div className="glass rounded-2xl p-6 md:p-8 border border-lineStrong shadow-card relative overflow-hidden">
                  {/* top accent line */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/60 to-transparent" />
                  <div className="flex items-baseline justify-between mb-2.5">
                    <div className="font-display font-extrabold text-3xl md:text-4xl grad-text tracking-tight">
                      <CountUp to={m.year} format={(n) => n} />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-soft">Stage {String(i + 1).padStart(2, '0')}/04</span>
                  </div>
                  <h4 className="font-display font-bold text-lg md:text-xl text-fg mb-2 tracking-tight">{m.title}</h4>
                  <p className="font-sans text-[14px] md:text-[15px] text-mid leading-relaxed max-w-2xl">{m.desc}</p>
                </div>
              </div>
            ))}
            {/* Tail spacer so the last card can settle before the section ends */}
            <div aria-hidden className="h-[35vh]" />
          </div>
        </div>

        {/* Pillars */}
        <Reveal>
          <h3 className="font-display font-bold text-lg text-fg mb-1.5 tracking-tight">Operating principles</h3>
          <p className="font-sans text-sm text-mid mb-9">The discipline our team is held to.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.tag} delay={80 + i * 110}>
              <div className="glass glass-hover rounded-2xl p-6 md:p-7 h-full">
                <span className="inline-block font-mono text-[10px] tracking-widest uppercase text-indigo bg-indigo/12 px-2.5 py-1 rounded-full mb-4">{p.tag}</span>
                <h4 className="font-display font-bold text-lg md:text-xl text-fg leading-snug tracking-tight mb-2.5">{p.title}</h4>
                <p className="font-sans text-[13.5px] text-mid leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCell = ({ value, label }) => (
  <div className="glass rounded-2xl p-5 md:p-6">
    <div className="font-display font-extrabold text-2xl md:text-4xl text-fg tracking-tight">{value}</div>
    <div className="font-sans text-[10px] md:text-[11px] uppercase tracking-widest text-soft mt-1.5">{label}</div>
  </div>
);

export default About;
