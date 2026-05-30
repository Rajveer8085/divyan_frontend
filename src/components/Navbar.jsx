import { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';

const NAV_LINKS = [
  { href: '#services',   label: 'Services' },
  { href: '#about',      label: 'Company'  },
  { href: '#team',       label: 'Team'     },
  { href: '#tech-stack', label: 'Stack'    },
  { href: '#clients',    label: 'Clients'  },
  { href: '#careers',    label: 'Careers'  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled ? 'bg-ink/70 backdrop-blur-xl border-b border-line' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-page mx-auto px-5 sm:px-6 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2.5 select-none">
            <img
              src="/Logo.webp"
              alt="Divyan Technologies logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-bold text-[15px] tracking-tight text-fg">
              Divyan<span className="grad-text">.tech</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-1 glass rounded-full px-1.5 py-1.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex items-center font-sans text-[13px] font-medium text-fg/70 hover:text-fg px-3.5 py-1.5 rounded-full hover:bg-white/5 transition-colors duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.18}>
              <a
                href="#contact"
                className="hidden sm:inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-4 py-2.5 rounded-full transition-colors duration-500"
              >
                Book a call <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex flex-col items-end gap-1.5 p-1"
              aria-label="Toggle navigation"
            >
              <span className={`h-px bg-fg transition-all ${open ? 'w-5 -rotate-45 translate-y-[3px]' : 'w-6'}`} />
              <span className={`h-px bg-fg transition-all ${open ? 'w-5 rotate-45 -translate-y-[3px]' : 'w-4'}`} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div ref={drawerRef} className="fixed inset-x-0 top-16 z-40 bg-ink/95 backdrop-blur-xl border-b border-line md:hidden">
          <ul className="px-5 py-5 space-y-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block font-display font-bold text-2xl text-fg py-3 border-b border-line">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a href="#contact" onClick={() => setOpen(false)} className="block text-center font-sans text-sm font-semibold text-ink bg-fg py-3 rounded-full">
                Book a call →
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
