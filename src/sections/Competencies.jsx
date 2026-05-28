import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';

const features = [
  { id: '01', title: '24/7 Technical Support',        desc: 'Active engineering desks monitor deployments continuously, ensuring minimal downtime and instant remote incident resolution.' },
  { id: '02', title: 'Customized Module Development', desc: 'No rigid templates. Every enterprise software layer and campaign is engineered to align with your specific scale requirements.' },
  { id: '03', title: 'Cost-Effective Optimization',   desc: 'Cloud infrastructure management that maximizes production output with zero resource wastage or budget leaks.' },
  { id: '04', title: 'Scalable Core Architecture',    desc: 'From standalone web interfaces to large integrated retail systems, our platforms expand alongside your operations.' },
];

const Competencies = () => {
  return (
    <section id="why-us" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden">
      <div aria-hidden className="absolute top-0 right-0 w-[560px] h-[560px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(167,139,250,0.16), transparent 70%)' }} />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">06 · Method</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Built so that</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">nothing breaks.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              Engineered systems structured around absolute technical dependency and transparent service workflows.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((f, i) => (
            <Reveal key={f.id} delay={60 + i * 90}>
              <div className="glass glass-hover rounded-2xl p-6 h-full">
                <div className="flex items-baseline justify-between mb-5">
                  <span className="font-display font-extrabold text-3xl grad-text tracking-tight">/{f.id}</span>
                  <span className="font-mono text-[10px] text-soft uppercase tracking-widest">Doctrine</span>
                </div>
                <h3 className="font-display font-bold text-lg text-fg leading-snug tracking-tight mb-2.5">{f.title}</h3>
                <p className="font-sans text-[13px] text-mid leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="mt-16 overflow-hidden border-y border-line py-7">
            <div className="flex whitespace-nowrap marquee-track gap-10 font-display font-extrabold text-2xl md:text-4xl text-fg/30 tracking-tight">
              {Array.from({ length: 2 }).map((_, k) => (
                <div key={k} className="flex gap-10 shrink-0 items-center">
                  <span>Engineered certainty.</span><span className="grad-text">✦</span>
                  <span>Transparent workflows.</span><span className="grad-text">✦</span>
                  <span>Scaled outcomes.</span><span className="grad-text">✦</span>
                  <span>Since 2008.</span><span className="grad-text">✦</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Competencies;
