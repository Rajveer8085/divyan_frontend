import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { creatorMe, creatorLogout } from '../../lib/creators';
import CreatorAuth from './CreatorAuth';
import CreatorDashboard from './CreatorDashboard';
import CreatorProfileWizard from './CreatorProfileWizard';

export default function CreatorApp() {
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'wizard'

  // Cookie-based session check — no token storage. Any non-OK = no session.
  const refresh = useCallback(async () => {
    try {
      const res = await creatorMe();
      setCreator(res.creator);
      return res.creator;
    } catch {
      setCreator(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await refresh();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [refresh]);

  const handleAuth = (c) => {
    setCreator(c);
    // new signups land in the wizard; returning users see the dashboard
    setView(c?.profileComplete ? 'dashboard' : 'wizard');
  };

  const handleLogout = async () => {
    try { await creatorLogout(); } catch { /* clear locally regardless */ }
    setCreator(null);
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-fg font-sans flex items-center justify-center">
        <span className="font-sans text-sm text-soft">Loading…</span>
      </div>
    );
  }

  if (!creator) {
    return <CreatorAuth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-ink text-fg font-sans">
      {/* Header */}
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-5 sm:px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <img src="/Logo.webp" alt="Divyan Technologies logo" width={28} height={28} className="w-7 h-7 object-contain" />
            <div className="leading-none">
              <div className="font-display font-bold text-[14px] tracking-tight">Creator Portal</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-soft mt-1">Divyan Technologies</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {view === 'wizard' && (
              <button onClick={() => setView('dashboard')} className="font-sans text-[13px] font-medium text-fg/70 hover:text-fg glass px-4 py-2 rounded-full transition-colors">
                Dashboard
              </button>
            )}
            <button onClick={handleLogout} className="font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-4 py-2 rounded-full transition-colors">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="px-5 sm:px-6 md:px-10 py-8 md:py-10">
        {view === 'dashboard' ? (
          <CreatorDashboard creator={creator} onEditProfile={() => setView('wizard')} />
        ) : (
          <CreatorProfileWizard
            creator={creator}
            onSaved={(c) => setCreator(c)}
            onExit={() => { refresh(); setView('dashboard'); }}
          />
        )}
      </main>
    </div>
  );
}
