import Reveal from './Reveal';
import MaskReveal from './MaskReveal';

const verticals = [
  { href: '#tech',     label: 'Application Dev'   },
  { href: '#tech',     label: 'Product Lifecycle' },
  { href: '#non-tech', label: 'Digital Strategy'  },
  { href: '#non-tech', label: 'Corporate Systems' },
];

const navigation = [
  { href: '#home',     label: 'Top'      },
  { href: '#services', label: 'Services' },
  { href: '#why-us',   label: 'Method'   },
  { href: '#team',     label: 'Team'     },
  { href: '#contact',  label: 'Contact'  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-fg pt-24 pb-10 px-5 sm:px-6 md:px-10 overflow-hidden">
      <div aria-hidden className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(110,139,255,0.18), transparent 70%)' }} />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase text-soft mb-10">
            <span>Colophon</span>
            <span>{year}</span>
          </div>
        </Reveal>

        <h2 className="font-display font-extrabold text-[clamp(2.5rem,11vw,9rem)] leading-[0.9] tracking-tight2 mb-14">
          <MaskReveal>Divyan</MaskReveal><span className="grad-text">.</span><MaskReveal delay={120}><span className="grad-text">tech</span></MaskReveal>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-line pt-12">
          <Reveal className="md:col-span-5" delay={60}>
            <p className="font-sans text-[14px] text-mid leading-relaxed max-w-sm">
              An integrated hub for high-performance enterprise application engineering and systematic business operational consulting.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-soft">Lucknow, IN · Est. 2008</span>
            </div>
          </Reveal>

          <Reveal className="md:col-span-3" delay={140}>
            <h4 className="font-mono text-[11px] tracking-widest uppercase text-soft mb-4">Verticals</h4>
            <ul className="space-y-3 font-display font-semibold text-[15px] text-fg/90">
              {verticals.map((v) => (
                <li key={v.label}><a href={v.href} className="hover:text-indigo transition-colors">{v.label}</a></li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="md:col-span-4" delay={220}>
            <h4 className="font-mono text-[11px] tracking-widest uppercase text-soft mb-4">Navigate</h4>
            <ul className="space-y-3 font-display font-semibold text-[15px] text-fg/90">
              {navigation.map((n) => (
                <li key={n.label}><a href={n.href} className="hover:text-indigo transition-colors">{n.label}</a></li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="border-t border-line mt-14 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] tracking-widest uppercase text-soft">
            <span>© {year} Divyan Technologies — All technical modules reserved.</span>
            <div className="flex gap-6">
              <a href="#contact" className="hover:text-fg transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-fg transition-colors">Terms</a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
