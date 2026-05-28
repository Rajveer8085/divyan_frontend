import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import CountUp from '../components/CountUp';
import GlobeScene from '../components/GlobeScene';

const capabilities = [
  'Real-time marketplace operations',
  'Cloud-native application delivery',
  'Cross-channel campaign automation',
  '24/7 monitored infrastructure',
];

const Showcase = () => {
  return (
    <section id="showcase" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden border-y border-line">
      <div className="aurora opacity-70" aria-hidden />

      <div className="max-w-page mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-indigo" />
                <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">Platform · Global reach</span>
              </div>
            </Reveal>

            <h2 className="font-display font-extrabold text-h2 text-fg mb-6">
              <MaskReveal>One operating system</MaskReveal>{' '}
              <MaskReveal delay={120}><span className="grad-text">for global operations.</span></MaskReveal>
            </h2>

            <Reveal delay={140}>
              <p className="font-sans text-[15px] md:text-base text-mid leading-relaxed max-w-lg mb-8">
                From a single console we orchestrate marketplace accounts, application deployments, and
                marketing operations across continents — every node monitored, every signal connected.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {capabilities.map((c, i) => (
                <Reveal key={c} delay={120 + i * 90}>
                  <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                    <span className="inline-flex w-1.5 h-1.5 rounded-full bg-cyan shrink-0 shadow-glowCyan" />
                    <span className="font-sans text-[13.5px] text-fg/85">{c}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={160}>
              <div className="flex flex-wrap gap-8">
                <Metric value={<><CountUp to={40} format={(n) => `${n}+`} /></>} label="Countries reached" />
                <Metric value={<><CountUp to={99} format={(n) => `${n}.9%`} /></>} label="Uptime SLA" />
                <Metric value={<><CountUp to={1} format={(n) => `${n}M+`} /></>} label="Orders processed" />
              </div>
            </Reveal>
          </div>

          {/* 3D globe */}
          <Reveal variant="scale" delay={120} className="lg:col-span-6 relative h-[360px] sm:h-[460px] lg:h-[600px]">
            <div aria-hidden className="absolute inset-8 sm:inset-14 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 65%)' }} />
            <GlobeScene className="absolute inset-0" />
            <span className="hidden sm:inline-flex absolute bottom-4 left-4 items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Live network
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Metric = ({ value, label }) => (
  <div>
    <div className="font-display font-extrabold text-2xl md:text-3xl text-fg tracking-tight">{value}</div>
    <div className="font-sans text-[10px] md:text-[11px] uppercase tracking-widest text-soft mt-1">{label}</div>
  </div>
);

export default Showcase;
