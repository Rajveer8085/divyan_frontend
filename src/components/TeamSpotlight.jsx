import { useEffect, useCallback, useState } from 'react';
import Avatar from './Avatar';
import { stopLenis, startLenis } from './lenisStore';

const AUTO_MS = 4200;

export default function TeamSpotlight({ members, index, setIndex, onClose }) {
  const count = members.length;
  const m = members[index];
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count, setIndex]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count, setIndex]);

  // Lock smooth-scroll + page scroll while open
  useEffect(() => {
    stopLenis();
    document.body.style.overflow = 'hidden';
    return () => { startLenis(); document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  // Auto-advance (pauses on hover)
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTO_MS);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_.25s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Team member spotlight"
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-xl" />
      <div className="aurora opacity-50" aria-hidden />

      <div
        className="relative w-full max-w-3xl glass rounded-3xl overflow-hidden shadow-card"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Auto-advance progress */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            key={index}
            className="h-full bg-gradient-to-r from-indigo via-cyan to-violet"
            style={{ animation: paused ? 'none' : `spotlightBar ${AUTO_MS}ms linear forwards` }}
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 inline-flex items-center justify-center rounded-full glass text-fg/80 hover:text-fg hover:border-indigo/40 transition-colors"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Photo / avatar */}
          <div className="relative">
            <Avatar member={m} className="w-full h-56 sm:h-full sm:min-h-[360px] sm:rounded-none rounded-t-3xl" textClass="text-6xl sm:text-7xl" />
            <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-ink/70 bg-white/70 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {m.tag}
            </span>
          </div>

          {/* Details */}
          <div className="p-7 sm:p-9 flex flex-col justify-center">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-fg tracking-tight">{m.name}</h3>
            <p className="font-sans text-sm text-mid mt-1">{m.role}</p>
            <p className="font-sans text-[14px] text-fg/85 leading-relaxed mt-5 border-l-2 border-indigo pl-4 italic">
              “{m.quote}”
            </p>

            <div className="flex items-center justify-between mt-8">
              <span className="font-mono text-[11px] text-soft tracking-widest">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={prev} aria-label="Previous member" className="w-9 h-9 rounded-full glass inline-flex items-center justify-center text-fg/80 hover:text-fg hover:border-indigo/40 transition-colors">←</button>
                <button onClick={next} aria-label="Next member" className="w-9 h-9 rounded-full glass inline-flex items-center justify-center text-fg/80 hover:text-fg hover:border-indigo/40 transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 pb-5">
          {members.map((mem, i) => (
            <button
              key={mem.name}
              onClick={() => setIndex(i)}
              aria-label={`View ${mem.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-indigo' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
