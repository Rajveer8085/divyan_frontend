import { useState, useEffect } from 'react';
import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import Avatar from '../components/Avatar';
import TeamSpotlight from '../components/TeamSpotlight';
import { api, assetUrl } from '../lib/api';

// Shown only if the API is unreachable.
const FALLBACK_TEAM = [
  { id: 'f1', name: 'Anil Kushwah', role: 'Founder & CEO',                  initials: 'AK', tag: 'Leadership',  grad: 'from-indigo to-cyan',   img: null, quote: "We don't sell deliverables — we own outcomes." },
  { id: 'f2', name: 'Riya Sharma',  role: 'Chief Technology Officer',       initials: 'RS', tag: 'Engineering', grad: 'from-violet to-indigo', img: null, quote: 'Good architecture is invisible until the day it saves you.' },
  { id: 'f3', name: 'Vikram Singh', role: 'Head of Marketplace Operations', initials: 'VS', tag: 'Operations',  grad: 'from-cyan to-emerald',  img: null, quote: 'Every listing is a system. We engineer it like one.' },
  { id: 'f4', name: 'Neha Verma',   role: 'Director of Digital Marketing',  initials: 'NV', tag: 'Marketing',   grad: 'from-indigo to-violet', img: null, quote: 'Data tells us where to aim; creativity makes it land.' },
];

const Team = () => {
  const [members, setMembers] = useState(FALLBACK_TEAM);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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

  const openAt = (i) => { setIndex(i); setOpen(true); };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {members.map((m, i) => (
            <Reveal key={m.id || m.name} delay={60 + i * 80}>
              <button
                type="button"
                onClick={() => openAt(i)}
                className="glass glass-hover group rounded-2xl p-5 md:p-6 h-full w-full text-left flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <Avatar member={m} className="w-16 h-16 rounded-xl shrink-0" textClass="text-xl" />
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base md:text-lg text-fg tracking-tight truncate">{m.name}</h3>
                    <p className="font-sans text-[12.5px] text-mid leading-snug">{m.role}</p>
                    {m.tag && <span className="inline-block mt-1.5 font-mono text-[9px] uppercase tracking-widest text-indigo bg-indigo/12 px-2 py-0.5 rounded-full">{m.tag}</span>}
                  </div>
                </div>

                {m.quote && (
                  <p className="font-sans text-[13.5px] text-fg/75 leading-relaxed italic border-l-2 border-line group-hover:border-indigo pl-3.5 line-clamp-3 transition-colors flex-1">
                    “{m.quote}”
                  </p>
                )}

                <span className="inline-flex items-center gap-1.5 mt-5 pt-4 border-t border-line font-sans text-[12px] font-medium text-soft group-hover:text-indigo transition-colors">
                  View profile
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* View all */}
        {members.length > 0 && (
          <Reveal delay={120}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 glass rounded-2xl p-6 md:p-7">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {members.slice(0, 4).map((m) => (
                    <Avatar key={m.id || m.name} member={m} className="w-10 h-10 rounded-full ring-2 ring-ink" textClass="text-xs" />
                  ))}
                  {members.length > 4 && (
                    <span className="w-10 h-10 rounded-full ring-2 ring-ink bg-graphite flex items-center justify-center font-mono text-[11px] text-fg/80">
                      +{members.length - 4}
                    </span>
                  )}
                </div>
                <p className="font-sans text-[14px] text-mid">
                  Meet the full <span className="text-fg font-medium">{members.length}-person</span> bench.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openAt(0)}
                className="group inline-flex items-center gap-2.5 font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-500 shadow-glow w-full sm:w-auto justify-center"
              >
                View all team
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </Reveal>
        )}
      </div>

      {open && (
        <TeamSpotlight members={members} index={index} setIndex={setIndex} onClose={() => setOpen(false)} />
      )}
    </section>
  );
};

export default Team;
