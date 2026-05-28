import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import WireScene from '../components/WireScene';

const categories = [
  { id: '01', tag: 'Frontend', title: 'Frontend Engineering', skills: ['React.js', 'Tailwind CSS', 'JavaScript ES6+', 'TypeScript'] },
  { id: '02', tag: 'Backend',  title: 'Backend Architecture', skills: ['Spring Boot', 'Node.js', 'Express', 'REST APIs'] },
  { id: '03', tag: 'Data',     title: 'Database Management',  skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Data Modeling'] },
  { id: '04', tag: 'Cloud',    title: 'Cloud & Optimization', skills: ['AWS', 'Docker', 'Git', 'CI/CD'] },
];

const Technologies = () => {
  return (
    <section id="tech-stack" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 right-[-160px] w-[500px] h-[500px] opacity-50 pointer-events-none hidden lg:block">
        <WireScene className="w-full h-full" size="sm" />
      </div>

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">05 · Stack</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>The technology behind</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">every delivery.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              Scalable, low-latency applications backed by rigid production-ready engineering environments.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={80 + i * 100}>
              <div className="glass glass-hover rounded-2xl p-6 md:p-7 h-full">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-cyan bg-cyan/10 px-2.5 py-1 rounded-full">{c.tag}</span>
                  <span className="font-mono text-[11px] text-soft">/ {c.id}</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-fg leading-snug tracking-tight mb-5">{c.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <li key={s} className="font-sans text-[13px] font-medium text-fg/80 bg-white/5 border border-line px-3 py-1.5 rounded-full hover:bg-indigo hover:text-fg hover:border-indigo transition-colors duration-300">{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 glass rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo to-cyan text-ink font-display font-bold shrink-0">★</div>
            <p className="font-sans text-[14px] text-mid leading-relaxed">
              All codebases use clean separation of concerns, ensuring absolute agility for regular security patching and system resource scaling.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Technologies;
