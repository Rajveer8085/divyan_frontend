import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';

const techServices = [
  { id: '01', title: 'Application Engineering',     desc: 'Enterprise cloud systems, integrated ERP architectures, and responsive web & mobile software applications.', tags: ['Cloud', 'ERP', 'Web', 'Mobile'] },
  { id: '02', title: 'Product Management Lifecycle', desc: 'Data driven workflow alignment, full product customization, and analytical deployment modules.',              tags: ['Workflows', 'Analytics', 'Custom'] },
  { id: '03', title: '24/7 Technical Support',       desc: 'Continuous remote monitoring, comprehensive system maintenance, and modular support updates.',                tags: ['Monitoring', 'Maintenance', 'SLA'] },
];

const corporateServices = [
  { id: '04', title: 'E-Commerce & Account Management', desc: 'End-to-end marketplace operations: listing optimization, A+ content, cataloging, inventory analytics, and advertisement management across global e-commerce platforms.', tags: ['E-Commerce', 'Marketplace', 'A+ Content', 'Ads'] },
  { id: '05', title: 'Digital Marketing Strategy',      desc: 'Data backed search indexing, programmatic campaign optimization, lead funnel building, and sustainable audience conversion paths.',                                  tags: ['SEO', 'Performance', 'Funnels'] },
  { id: '06', title: 'Corporate Business Consulting',   desc: 'Operational workflow engineering, organizational scaling frameworks, and tactical cross-platform resource management.',                                              tags: ['Strategy', 'Scaling', 'Ops'] },
];

const Card = ({ item, accent }) => (
  <a href="#contact" className="glass glass-hover group relative block p-6 md:p-7 rounded-2xl h-full">
    <div className="flex items-center justify-between mb-6">
      <span className="font-mono text-[11px] tracking-widest text-soft">/ {item.id}</span>
      <span className={`inline-flex w-9 h-9 items-center justify-center rounded-full border border-line text-fg/60 transition-all duration-500 ${accent === 'cyan' ? 'group-hover:bg-cyan group-hover:text-ink group-hover:border-cyan' : 'group-hover:bg-indigo group-hover:text-fg group-hover:border-indigo'}`}>→</span>
    </div>
    <h3 className="font-display font-bold text-xl md:text-2xl text-fg leading-snug tracking-tight mb-3">{item.title}</h3>
    <p className="font-sans text-[14px] text-mid leading-relaxed mb-6">{item.desc}</p>
    <div className="flex flex-wrap gap-1.5 pt-5 border-t border-line">
      {item.tags.map((t) => (
        <span key={t} className={`font-sans text-[11px] font-medium px-2.5 py-1 rounded-full ${accent === 'cyan' ? 'bg-cyan/10 text-cyan' : 'bg-indigo/12 text-indigo'}`}>{t}</span>
      ))}
    </div>
  </a>
);

const Services = () => {
  return (
    <section id="services" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10">
      <div className="max-w-page mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">02 · What we do</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Two divisions.</MaskReveal>{' '}
            <MaskReveal delay={100}><span className="grad-text">One standard.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4 lg:pb-1.5" delay={140}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              Software engineering and corporate operations under one roof — both held to the same execution discipline.
            </p>
          </Reveal>
        </div>

        {/* Tech */}
        <div id="tech" className="mb-14">
          <Reveal>
            <div className="flex items-baseline justify-between mb-7 pb-4 border-b border-line">
              <h3 className="font-display font-bold text-lg md:text-xl text-fg tracking-tight">High-performance tech</h3>
              <span className="font-mono text-[11px] text-soft tracking-widest uppercase">Infrastructure</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {techServices.map((s, i) => (
              <Reveal key={s.id} delay={80 + i * 100}><Card item={s} accent="cyan" /></Reveal>
            ))}
          </div>
        </div>

        {/* Corporate */}
        <div id="non-tech">
          <Reveal>
            <div className="flex items-baseline justify-between mb-7 pb-4 border-b border-line">
              <h3 className="font-display font-bold text-lg md:text-xl text-fg tracking-tight">Strategic growth services</h3>
              <span className="font-mono text-[11px] text-soft tracking-widest uppercase">Operations</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {corporateServices.map((s, i) => (
              <Reveal key={s.id} delay={80 + i * 100}><Card item={s} accent="indigo" /></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
