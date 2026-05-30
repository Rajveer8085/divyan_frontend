import { useState, useEffect, useCallback } from 'react';
import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import Avatar from '../components/Avatar';
import { api, assetUrl } from '../lib/api';

// Shown only if the API is unreachable.
const FALLBACK_TEAM = [
  { id: 'f1', name: 'Anil Kushwah', role: 'Founder & CEO',                  initials: 'AK', tag: 'Leadership',  grad: 'from-indigo to-cyan',   img: null, quote: "We don't sell deliverables — we own outcomes." },
  { id: 'f2', name: 'Riya Sharma',  role: 'Chief Technology Officer',       initials: 'RS', tag: 'Engineering', grad: 'from-violet to-indigo', img: null, quote: 'Good architecture is invisible until the day it saves you.' },
  { id: 'f3', name: 'Vikram Singh', role: 'Head of Marketplace Operations', initials: 'VS', tag: 'Operations',  grad: 'from-cyan to-emerald',  img: null, quote: 'Every listing is a system. We engineer it like one.' },
  { id: 'f4', name: 'Neha Verma',   role: 'Director of Digital Marketing',  initials: 'NV', tag: 'Marketing',   grad: 'from-indigo to-violet', img: null, quote: 'Data tells us where to aim; creativity makes it land.' },
];

const AUTO_MS = 5000;

const Team = () => {
  const [members, setMembers] = useState(FALLBACK_TEAM);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    api('/api/employees')
      .then((res) => {
        if (active && Array.isArray(res.data) && res.data.length) {
          setMembers(res.data.map((m) => ({ ...m, img: m.img ? assetUrl(m.img) : null })));
        }
      })
      .catch(() => {/* keep fallback */});
    return () => { active = false; };
  }, []);

  const count = members.length;
  const m = members[index] || members[0];

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Keep index in range if member list changes
  useEffect(() => { setIndex((i) => (count ? i % count : 0)); }, [count]);

  // Auto-advance on a loop (pauses on hover)
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setTimeout(next, AUTO_MS);
    return () => clearTimeout(t);
  }, [index, paused, count, next]);

  if (!m) return null;

  return (
    <section id="team" className="relative bg-ink text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden">
      <div aria-hidden className="absolute -top-24 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(167,139,250,0.14), transparent 70%)' }} />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">04 · Team</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>The people behind</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">the systems.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              A focused bench of engineers, operators, and strategists accountable for every deployment and account we run.
            </p>
          </Reveal>
        </div>

        {/* Testimonial slider — medium centered card */}
        <Reveal delay={120}>
          <div
            className="relative max-w-2xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Side nav arrows */}
            <button
              onClick={prev}
              aria-label="Previous member"
              className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass inline-flex items-center justify-center text-fg/80 hover:text-fg hover:border-indigo/40 hover:scale-105 transition-all duration-300"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Next member"
              className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass inline-flex items-center justify-center text-fg/80 hover:text-fg hover:border-indigo/40 hover:scale-105 transition-all duration-300"
            >
              →
            </button>

            {/* Gradient-border card */}
            <div className="rounded-[28px] p-px bg-gradient-to-br from-indigo/50 via-white/10 to-violet/50 shadow-card">
              <div className="relative rounded-[27px] bg-ink2 overflow-hidden text-center px-8 sm:px-12 pt-14 pb-9">
                {/* Auto-advance progress */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                  <div
                    key={index}
                    className="h-full bg-gradient-to-r from-indigo via-cyan to-violet"
                    style={{ animation: paused ? 'none' : `spotlightBar ${AUTO_MS}ms linear forwards` }}
                  />
                </div>

                {/* Decorative quote mark + glow */}
                <span aria-hidden className="absolute top-5 left-7 font-display font-extrabold text-7xl leading-none grad-text opacity-25 select-none">“</span>
                <div aria-hidden className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 pointer-events-none"
                  style={{ background: 'radial-gradient(closest-side, rgba(110,139,255,0.18), transparent 70%)' }} />

                {/* Rounded profile photo with gradient ring */}
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6">
                  <div className="w-full h-full rounded-full p-[2.5px] bg-gradient-to-br from-indigo via-cyan to-violet shadow-glow">
                    <Avatar
                      key={m.id || m.name}
                      member={m}
                      className="w-full h-full rounded-full ring-2 ring-ink2 animate-[fadeIn_.5s_ease]"
                      textClass="text-3xl sm:text-4xl"
                    />
                  </div>
                  {m.tag && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-fg bg-indigo px-2.5 py-0.5 rounded-full shadow-glow">
                      {m.tag}
                    </span>
                  )}
                </div>

                {/* Quote + identity */}
                <div key={`q-${index}`} className="animate-[fadeIn_.5s_ease]">
                  <blockquote className="font-display font-semibold text-lg sm:text-[22px] text-fg leading-relaxed tracking-tight max-w-md mx-auto">
                    {m.quote}
                  </blockquote>

                  <div className="mt-6 flex flex-col items-center">
                    <span aria-hidden className="w-8 h-px bg-gradient-to-r from-transparent via-indigo to-transparent mb-3" />
                    <p className="font-display font-bold text-base text-fg">{m.name}</p>
                    <p className="font-sans text-[13px] text-mid mt-0.5">{m.role}</p>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-7">
                  {members.map((mem, i) => (
                    <button
                      key={mem.id || mem.name}
                      onClick={() => setIndex(i)}
                      aria-label={`View ${mem.name}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-indigo' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Team;
