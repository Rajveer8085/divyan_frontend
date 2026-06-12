import { useEffect, useRef, useState } from 'react';
import { api, assetUrl } from '../../../lib/api';

const EMPTY = { id: null, name: '', role: '', tag: '', quote: '' };

const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

function MiniAvatar({ member }) {
  if (member.img) {
    return <img src={assetUrl(member.img)} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />;
  }
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.grad || 'from-indigo to-cyan'} flex items-center justify-center font-display font-bold text-ink/85 text-sm`}>
      {member.initials || initialsOf(member.name)}
    </div>
  );
}

export default function TeamSection({ onAuthError }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileRef = useRef(null);

  const editing = Boolean(form.id);
  const guard = (err) => { if (err.status === 401 || err.status === 403 || /session|authentication|unauthor/i.test(err.message || '')) onAuthError?.(); };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api('/api/employees');
      setList(res.data || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onPhoto = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };
  const resetForm = () => {
    setForm(EMPTY); setPhotoFile(null); setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };
  const startEdit = (m) => {
    setForm({ id: m.id, name: m.name, role: m.role, tag: m.tag || '', quote: m.quote || '' });
    setPhotoFile(null);
    setPhotoPreview(m.img ? assetUrl(m.img) : null);
    setError(''); setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(''); setNotice('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('tag', form.tag);
      fd.append('quote', form.quote);
      if (photoFile) fd.append('photo', photoFile);

      if (editing) {
        await api(`/api/employees/${form.id}`, { method: 'PUT', body: fd, isForm: true, auth: true });
        setNotice('Member updated.');
      } else {
        await api('/api/employees', { method: 'POST', body: fd, isForm: true, auth: true });
        setNotice('Member added.');
      }
      resetForm();
      await load();
    } catch (err) { setError(err.message); guard(err); } finally { setSubmitting(false); }
  };
  const remove = async (m) => {
    if (!window.confirm(`Remove ${m.name}? This cannot be undone.`)) return;
    try {
      await api(`/api/employees/${m.id}`, { method: 'DELETE', auth: true });
      if (form.id === m.id) resetForm();
      await load();
    } catch (err) { setError(err.message); guard(err); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form */}
      <section className="lg:col-span-5">
        <form onSubmit={submit} className="glass rounded-2xl p-6 lg:sticky lg:top-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg tracking-tight">{editing ? 'Edit member' : 'Add member'}</h2>
            {editing && <button type="button" onClick={resetForm} className="font-sans text-[12px] text-soft hover:text-fg transition-colors">+ New instead</button>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center font-display font-bold text-ink/85">{initialsOf(form.name)}</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Photo {editing && '(leave empty to keep current)'}</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto}
                  className="block w-full text-[12px] text-mid file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-fg file:text-ink hover:file:bg-indigo hover:file:text-fg file:cursor-pointer" />
              </div>
            </div>

            <Field label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Anil Kushwah" required />
            <Field label="Role" name="role" value={form.role} onChange={onChange} placeholder="Founder & CEO" required />
            <Field label="Tag" name="tag" value={form.tag} onChange={onChange} placeholder="Leadership" />
            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Quote</label>
              <textarea name="quote" rows="3" value={form.quote} onChange={onChange} placeholder="A short personal quote…"
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors resize-none" />
            </div>

            {error && <p className="text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">{error}</p>}
            {notice && <p className="text-[13px] text-emerald border border-emerald/30 bg-emerald/10 rounded-xl px-4 py-2.5">{notice}</p>}

            <button type="submit" disabled={submitting}
              className="w-full font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-300 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="lg:col-span-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg tracking-tight">Team roster</h2>
          <span className="font-mono text-[11px] text-soft">{list.length} members</span>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">Loading…</div>
        ) : list.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">No members yet — add your first one.</div>
        ) : (
          <ul className="space-y-3">
            {list.map((m) => (
              <li key={m.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                <MiniAvatar member={m} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-[15px] text-fg truncate">{m.name}</h3>
                    {m.tag && <span className="font-mono text-[9px] uppercase tracking-widest text-indigo bg-indigo/12 px-2 py-0.5 rounded-full shrink-0">{m.tag}</span>}
                  </div>
                  <p className="font-sans text-[12.5px] text-mid truncate">{m.role}</p>
                  {m.quote && <p className="font-sans text-[12px] text-soft italic truncate mt-0.5">“{m.quote}”</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(m)} className="font-sans text-[12px] font-medium text-fg/80 hover:text-fg border border-line hover:border-indigo/40 px-3 py-1.5 rounded-full transition-colors">Edit</button>
                  <button onClick={() => remove(m)} className="font-sans text-[12px] font-medium text-red-300 hover:text-red-200 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 rounded-full transition-colors">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const Field = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors" />
  </div>
);
