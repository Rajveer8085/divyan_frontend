import { useState } from 'react';
import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import Magnetic from '../components/Magnetic';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999';

const details = [
  { label: 'Company',    value: 'Divyan Technologies Pvt. Ltd.', href: null },
  { label: 'Telephone',  value: '+91 9956905174',                href: 'tel:+919956905174' },
  { label: 'Email',      value: 'info@divyan.co.in',             href: 'mailto:info@divyan.co.in' },
  { label: 'Hours',      value: '09:30 – 18:00 IST · Mon–Sat',   href: null },
  { label: 'HQ',         value: '7th 704 BCC Tower, Sultanpur Road, Arjunganj, Lucknow, UP 226002, India', href: null },
];

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [feedback, setFeedback] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.errors?.[0]?.message || data.message || 'Something went wrong. Please try again.';
        throw new Error(msg);
      }

      setStatus('success');
      setFeedback(data.message || 'Thank you — your enquiry has been received.');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setFeedback(err.message || 'Network error. Please try again.');
    }
  };

  const submitting = status === 'submitting';

  return (
    <section id="contact" className="relative bg-ink2 text-fg py-24 md:py-28 px-5 sm:px-6 md:px-10 overflow-hidden border-y border-line">
      <div aria-hidden className="absolute -bottom-24 left-1/4 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(34,211,238,0.14), transparent 70%)' }} />

      <div className="max-w-page mx-auto relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-indigo" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo">08 · Contact</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <h2 className="lg:col-span-8 font-display font-extrabold text-h2 text-fg">
            <MaskReveal>Let's build something</MaskReveal>{' '}
            <MaskReveal delay={120}><span className="grad-text">that holds up.</span></MaskReveal>
          </h2>
          <Reveal className="lg:col-span-4" delay={160}>
            <p className="font-sans text-[15px] text-mid leading-relaxed">
              Reach out to establish product modules, customize enterprise applications, or consult on technical operations.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Reveal className="lg:col-span-5" variant="left">
            <div className="glass rounded-2xl p-6 md:p-7 h-full">
              <h3 className="font-mono text-[11px] tracking-widest uppercase text-soft mb-5">Office directory</h3>
              <dl className="divide-y divide-line">
                {details.map((d) => (
                  <div key={d.label} className="grid grid-cols-12 gap-3 py-3.5 items-baseline">
                    <dt className="col-span-4 font-sans text-[11px] uppercase tracking-wider text-soft font-medium">{d.label}</dt>
                    <dd className="col-span-8 font-display font-semibold text-[14px] md:text-[15px] text-fg">
                      {d.href ? <a href={d.href} className="hover:text-indigo transition-colors">{d.value}</a> : d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" variant="right" delay={120}>
            <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8" noValidate>
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="font-display font-bold text-lg md:text-xl text-fg tracking-tight">Send a brief</h3>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Reply &lt;24h
                </span>
              </div>

              <div className="space-y-4">
                <Field label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Anil Kushwah" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Corporate email" name="email" type="email" value={form.email} onChange={onChange} placeholder="client@company.com" />
                  <Field label="Contact number" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" required={false} />
                </div>
                <Field label="Subject" name="subject" value={form.subject} onChange={onChange} placeholder="Application Engineering / Marketing Deployment" />
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Operational outline</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={onChange}
                    placeholder="State your framework expectations or core business requirements…"
                    className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors resize-none"
                    required
                  />
                </div>

                {feedback && (
                  <p
                    role="status"
                    className={`text-[13px] rounded-xl px-4 py-3 border ${
                      status === 'success'
                        ? 'text-emerald border-emerald/30 bg-emerald/10'
                        : 'text-red-300 border-red-400/30 bg-red-400/10'
                    }`}
                  >
                    {feedback}
                  </p>
                )}

                <div className="pt-1">
                  <Magnetic strength={0.18}>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center gap-2.5 font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-7 py-3.5 rounded-full transition-colors duration-500 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending…' : 'Submit requirements'}
                      {!submitting && <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>}
                    </button>
                  </Magnetic>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, name, value, onChange, type = 'text', placeholder, required = true }) => (
  <div>
    <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors"
    />
  </div>
);

export default Contact;
