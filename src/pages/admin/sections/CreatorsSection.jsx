import { useEffect, useState, useCallback } from 'react';
import { adminListCreators, adminVetCreator, adminDeleteCreator, CREATOR_STATUSES, STATUS_LABEL, STATUS_STYLE } from '../../../lib/creators';

const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

export default function CreatorsSection({ onAuthError }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');     // '' = all
  const [openId, setOpenId] = useState(null);   // expanded detail row

  const guard = (err) => { if (err.status === 401 || err.status === 403 || /session|authentication|unauthor/i.test(err.message || '')) onAuthError?.(); };

  const load = useCallback(async (status) => {
    setLoading(true); setError('');
    try {
      const res = await adminListCreators(status || undefined);
      setList(res.data || []);
    } catch (err) { setError(err.message); guard(err); } finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(filter); }, [filter, load]);

  const counts = CREATOR_STATUSES.reduce((acc, s) => { acc[s] = list.filter((c) => c.status === s).length; return acc; }, {});

  const onVetted = (updated) => setList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  const onDeleted = (id) => setList((prev) => prev.filter((c) => c.id !== id));

  return (
    <section>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-display font-bold text-lg tracking-tight">Creator signups</h2>
        <span className="font-mono text-[11px] text-soft">{list.length} shown</span>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <FilterChip active={filter === ''} onClick={() => setFilter('')} label="All" />
        {CREATOR_STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)} label={STATUS_LABEL[s]} count={filter === '' ? counts[s] : undefined} />
        ))}
      </div>

      {error && <p className="mb-4 text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">{error}</p>}

      {loading ? (
        <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">Loading…</div>
      ) : list.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">No creators{filter ? ` with status “${STATUS_LABEL[filter]}”` : ''} yet.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => (
            <CreatorRow key={c.id} c={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)}
              onVetted={onVetted} onDeleted={onDeleted} onAuthError={onAuthError} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, label, count }) {
  return (
    <button onClick={onClick}
      className={`font-sans text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
        active ? 'bg-fg text-ink border-fg' : 'text-fg/70 hover:text-fg border-line hover:border-indigo/40'
      }`}>
      {label}{count > 0 ? <span className="ml-1.5 opacity-70">{count}</span> : null}
    </button>
  );
}

function CreatorRow({ c, open, onToggle, onVetted, onDeleted, onAuthError }) {
  const [status, setStatus] = useState(c.status);
  const [rating, setRating] = useState(c.internalRating ?? '');
  const [remarks, setRemarks] = useState(c.adminRemarks ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const guard = (err) => { if (err.status === 401 || err.status === 403) onAuthError?.(); };

  const dirty = status !== c.status || String(rating) !== String(c.internalRating ?? '') || (remarks || '') !== (c.adminRemarks || '');

  const saveVet = async () => {
    setSaving(true); setMsg(null);
    try {
      const fields = {};
      if (status !== c.status) fields.status = status;
      if (String(rating) !== String(c.internalRating ?? '')) fields.internalRating = rating === '' ? undefined : Number(rating);
      if ((remarks || '') !== (c.adminRemarks || '')) fields.adminRemarks = remarks;
      const res = await adminVetCreator(c.id, fields);
      onVetted(res.data);
      setMsg({ type: 'success', text: 'Saved.' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); guard(err); } finally { setSaving(false); }
  };

  const del = async () => {
    if (!window.confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    try { await adminDeleteCreator(c.id); onDeleted(c.id); }
    catch (err) { setMsg({ type: 'error', text: err.message }); guard(err); }
  };

  return (
    <li className="glass rounded-2xl overflow-hidden">
      {/* Summary row */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center font-display font-bold text-ink/85 text-sm shrink-0">
          {initialsOf(c.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-[15px] text-fg truncate">{c.name}</h3>
            {!c.profileComplete && <span className="font-mono text-[9px] uppercase tracking-widest text-soft bg-white/5 border border-line px-2 py-0.5 rounded-full">Incomplete</span>}
          </div>
          <p className="font-sans text-[12.5px] text-mid truncate">{c.email}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {c.internalRating ? <span className="font-mono text-[12px] text-amber-300" title="Internal rating">{'★'.repeat(c.internalRating)}</span> : null}
          <span className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLE[c.status]}`}>
            {STATUS_LABEL[c.status]}
          </span>
          <span aria-hidden className={`text-soft transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
        </div>
      </button>

      {/* Expanded detail + vetting */}
      {open && (
        <div className="border-t border-line p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile facts */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-soft">Profile</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Fact label="Legal name" value={c.fullLegalName} />
              <Fact label="Phone" value={c.phone} />
              <Fact label="DOB" value={c.dateOfBirth ? c.dateOfBirth.slice(0, 10) : ''} />
              <Fact label="Location" value={[c.address?.city, c.address?.state].filter(Boolean).join(', ')} />
              <Fact label="Age range" value={c.audience?.primaryAgeRange} />
              <Fact label="Engagement" value={c.engagementRate != null ? `${c.engagementRate}%` : ''} />
              <Fact label="Niche" value={c.niche?.join(', ')} span />
              <Fact label="Signed up" value={fmtDate(c.createdAt)} span />
            </dl>

            {c.socialProfiles?.length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-soft mb-2">Socials</h4>
                <ul className="space-y-1.5">
                  {c.socialProfiles.map((s, i) => (
                    <li key={i} className="font-sans text-[12.5px] text-mid">
                      <span className="text-fg/90 capitalize">{s.platform}</span>
                      {s.followerCount != null && <> · {Number(s.followerCount).toLocaleString('en-IN')} followers</>}
                      {s.url && <> · <a href={s.url} target="_blank" rel="noreferrer" className="text-indigo hover:text-fg transition-colors break-all">link</a></>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.portfolioUrl && (
              <a href={c.portfolioUrl} target="_blank" rel="noreferrer" className="inline-block font-sans text-[12.5px] text-indigo hover:text-fg transition-colors break-all">
                View portfolio ↗
              </a>
            )}
          </div>

          {/* Vetting controls */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-soft">Vetting <span className="text-soft/60 normal-case tracking-normal">· admin only</span></h4>

            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-2.5 font-sans text-[14px] text-fg focus:outline-none focus:border-indigo transition-colors appearance-none cursor-pointer">
                {CREATOR_STATUSES.map((s) => <option key={s} value={s} className="bg-ink2">{STATUS_LABEL[s]}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Internal rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(rating === n ? '' : n)}
                    className={`w-8 h-8 rounded-lg border text-sm transition-colors ${
                      Number(rating) >= n ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' : 'border-line text-soft hover:text-fg'
                    }`}>★</button>
                ))}
                {rating !== '' && <button type="button" onClick={() => setRating('')} className="ml-1 font-sans text-[12px] text-soft hover:text-fg">clear</button>}
              </div>
            </div>

            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Admin remarks</label>
              <textarea rows="3" value={remarks} maxLength={1000} onChange={(e) => setRemarks(e.target.value)}
                placeholder="Internal campaign-fit notes…"
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[13.5px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors resize-none" />
            </div>

            {msg && <p className={`text-[12.5px] rounded-xl px-3.5 py-2 border ${msg.type === 'success' ? 'text-emerald border-emerald/30 bg-emerald/10' : 'text-red-300 border-red-400/30 bg-red-400/10'}`}>{msg.text}</p>}

            <div className="flex items-center gap-2 pt-1">
              <button onClick={saveVet} disabled={saving || !dirty}
                className="font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-5 py-2.5 rounded-full transition-colors shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Saving…' : 'Save vetting'}
              </button>
              <button onClick={del} className="font-sans text-[13px] font-medium text-red-300 hover:text-red-200 border border-red-400/20 hover:border-red-400/50 px-4 py-2.5 rounded-full transition-colors ml-auto">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function Fact({ label, value, span }) {
  const empty = value == null || value === '';
  return (
    <div className={span ? 'col-span-2' : ''}>
      <dt className="font-sans text-[10px] uppercase tracking-wider text-soft mb-0.5">{label}</dt>
      <dd className="font-sans text-[13px] text-fg/90 break-words">{empty ? <span className="text-soft/50 italic">—</span> : value}</dd>
    </div>
  );
}
