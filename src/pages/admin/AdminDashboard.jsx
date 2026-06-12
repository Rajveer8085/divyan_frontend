import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeamSection from './sections/TeamSection';
import MessagesSection from './sections/MessagesSection';
import CreatorsSection from './sections/CreatorsSection';

const NAV = [
  { id: 'team',     label: 'Team',     icon: '◐', desc: 'Roster' },
  { id: 'creators', label: 'Creators', icon: '◇', desc: 'Signups & vetting' },
  { id: 'messages', label: 'Messages', icon: '✉', desc: 'Enquiries' },
];

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('team');
  const [unread, setUnread] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const go = (id) => { setTab(id); setNavOpen(false); };

  // Render helper (not a component) so it doesn't remount on each render.
  const renderNavLinks = () => (
    <nav className="space-y-1">
      {NAV.map((n) => {
        const active = tab === n.id;
        return (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            aria-current={active ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
              active ? 'bg-fg text-ink' : 'text-fg/70 hover:text-fg hover:bg-white/5'
            }`}
          >
            <span aria-hidden className="text-base w-5 text-center">{n.icon}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-sans text-[13.5px] font-semibold leading-tight">{n.label}</span>
              <span className={`block font-sans text-[11px] leading-tight ${active ? 'text-ink/60' : 'text-soft'}`}>{n.desc}</span>
            </span>
            {n.id === 'messages' && unread > 0 && (
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${active ? 'bg-ink text-fg' : 'bg-indigo text-fg'}`}>
                {unread}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink text-fg">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-ink/90 backdrop-blur-xl border-b border-line">
        <div className="px-5 h-14 flex items-center justify-between">
          <button onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={navOpen}
            className="flex items-center gap-2 font-sans text-[13px] font-semibold">
            <span className="flex flex-col gap-1">
              <span className="w-5 h-px bg-fg" /><span className="w-5 h-px bg-fg" /><span className="w-5 h-px bg-fg" />
            </span>
            Menu
          </button>
          <span className="font-display font-bold text-[14px]">{NAV.find((n) => n.id === tab)?.label}</span>
          <button onClick={onLogout} className="font-sans text-[12px] font-semibold text-ink bg-fg px-3 py-1.5 rounded-full">Log out</button>
        </div>
        {navOpen && (
          <div className="px-4 pb-4 border-t border-line pt-3">
            {renderNavLinks()}
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 min-h-screen border-r border-line p-5 sticky top-0">
          <div className="flex items-center gap-2.5 mb-8 px-1.5">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo to-cyan shadow-glow">
              <span className="font-display font-extrabold text-ink text-[15px]">D</span>
            </span>
            <div>
              <div className="font-display font-bold text-[14px] tracking-tight leading-none">Admin Console</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-soft mt-1">Divyan Technologies</div>
            </div>
          </div>

          {renderNavLinks()}

          <div className="mt-auto pt-5 space-y-1 border-t border-line">
            <Link to="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-fg/70 hover:text-fg hover:bg-white/5 transition-colors font-sans text-[13.5px] font-medium">
              <span aria-hidden className="w-5 text-center">↗</span> View site
            </Link>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-fg/70 hover:text-fg hover:bg-white/5 transition-colors font-sans text-[13.5px] font-medium">
              <span aria-hidden className="w-5 text-center">⏻</span> Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-5 sm:px-6 md:px-10 py-6 md:py-10">
          <div className="max-w-5xl mx-auto">
            <header className="hidden lg:block mb-8">
              <h1 className="font-display font-extrabold text-2xl tracking-tight">{NAV.find((n) => n.id === tab)?.label}</h1>
              <p className="font-sans text-[13px] text-mid mt-1">{NAV.find((n) => n.id === tab)?.desc}</p>
            </header>

            {tab === 'team' && <TeamSection onAuthError={onLogout} />}
            {tab === 'creators' && <CreatorsSection onAuthError={onLogout} />}
            {tab === 'messages' && <MessagesSection onAuthError={onLogout} onUnreadChange={setUnread} />}
          </div>
        </main>
      </div>
    </div>
  );
}
