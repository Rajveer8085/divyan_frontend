import { useState } from 'react';
import { creatorUpdateProfile } from '../../lib/creators';
import { TextField, TextArea, SelectField, CheckField, ChipsField } from './fields';
import {
  SOCIAL_PLATFORMS, AGE_RANGES, CURRENCIES, PAYOUT_METHODS,
  validateFullLegalName, validatePhone, validateDateOfBirth, maxLen,
  validateSocialProfile, validateGenderSplit, validateEngagementRate,
  validateUrlField, validatePan, validateGstin, validateIfsc, validateUpi,
  validateBankAccountNumber, validateMoney,
} from '../../lib/validation';

const STEPS = ['Identity', 'Audience', 'Portfolio', 'Commercials', 'Consent'];

const emptySocial = () => ({ platform: '', url: '', handle: '', followerCount: '', avgLikes: '', avgComments: '', avgShares: '' });

// Build the wizard's working state from the server creator object.
const fromCreator = (c = {}) => ({
  name: c.name || '',
  fullLegalName: c.fullLegalName || '',
  phone: c.phone || '',
  dateOfBirth: c.dateOfBirth ? c.dateOfBirth.slice(0, 10) : '',
  address: { line: '', city: '', state: '', pincode: '', country: 'India', ...(c.address || {}) },
  socialProfiles: (c.socialProfiles?.length ? c.socialProfiles : [emptySocial()]).map((s) => ({ ...emptySocial(), ...s })),
  audience: {
    primaryAgeRange: c.audience?.primaryAgeRange || '',
    genderSplit: { male: '', female: '', other: '', ...(c.audience?.genderSplit || {}) },
    topLocations: c.audience?.topLocations || [],
  },
  engagementRate: c.engagementRate ?? '',
  portfolioUrl: c.portfolioUrl || '',
  niche: c.niche || [],
  previousBrands: c.previousBrands || [],
  sampleContent: c.sampleContent || [],
  rateCard: { currency: 'INR', perVideo: '', perReel: '', perPost: '', ...(c.rateCard || {}) },
  payout: { method: '', upiId: '', paypalEmail: '', bankAccountName: '', bankAccountNumber: '', ifsc: '', ...(c.payout || {}) },
  tax: { pan: '', gstin: '', ...(c.tax || {}) },
  consent: { nda: false, brandGuidelines: false, ...(c.consent || {}) },
});

// Strip empties so we only PUT meaningful fields (partial update per spec).
const clean = (obj) => {
  if (Array.isArray(obj)) return obj;
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === '' || v == null) return;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const nested = clean(v);
      if (Object.keys(nested).length) out[k] = nested;
    } else {
      out[k] = v;
    }
  });
  return out;
};

const num = (v) => (v === '' || v == null ? undefined : Number(v));

export default function CreatorProfileWizard({ creator, onSaved, onExit }) {
  const [data, setData] = useState(() => fromCreator(creator));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null); // { type, text }

  // ── state setters ──
  const setField = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setNested = (group, k, v) => setData((d) => ({ ...d, [group]: { ...d[group], [k]: v } }));
  const setSocial = (i, k, v) =>
    setData((d) => ({ ...d, socialProfiles: d.socialProfiles.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const addSocial = () => setData((d) => ({ ...d, socialProfiles: [...d.socialProfiles, emptySocial()] }));
  const removeSocial = (i) =>
    setData((d) => ({ ...d, socialProfiles: d.socialProfiles.filter((_, idx) => idx !== i) }));

  // ── per-step validation + payload ──
  const buildStep = (s) => {
    const e = {};
    let payload = {};

    if (s === 0) {
      e.fullLegalName = validateFullLegalName(data.fullLegalName);
      e.phone = validatePhone(data.phone);
      e.dateOfBirth = validateDateOfBirth(data.dateOfBirth);
      e.addressLine = maxLen(data.address.line, 200, 'Address');
      payload = clean({
        name: data.name, fullLegalName: data.fullLegalName, phone: data.phone,
        dateOfBirth: data.dateOfBirth, address: data.address,
      });
    }

    if (s === 1) {
      const used = data.socialProfiles.filter((sp) => sp.platform || sp.url);
      used.forEach((sp, i) => {
        const spErr = validateSocialProfile(sp);
        if (Object.keys(spErr).length) e[`social-${i}`] = Object.values(spErr)[0];
      });
      e.genderSplit = validateGenderSplit(data.audience.genderSplit);
      e.engagementRate = validateEngagementRate(data.engagementRate);
      payload = clean({
        socialProfiles: used.map((sp) => clean({
          platform: sp.platform, url: sp.url, handle: sp.handle,
          followerCount: num(sp.followerCount), avgLikes: num(sp.avgLikes),
          avgComments: num(sp.avgComments), avgShares: num(sp.avgShares),
        })),
        audience: clean({
          primaryAgeRange: data.audience.primaryAgeRange,
          genderSplit: clean({
            male: num(data.audience.genderSplit.male),
            female: num(data.audience.genderSplit.female),
            other: num(data.audience.genderSplit.other),
          }),
          topLocations: data.audience.topLocations,
        }),
        engagementRate: num(data.engagementRate),
      });
      // socialProfiles must be sent whole even if some entries trimmed
      if (used.length) payload.socialProfiles = payload.socialProfiles || [];
    }

    if (s === 2) {
      e.portfolioUrl = validateUrlField(data.portfolioUrl, 'Portfolio URL');
      data.sampleContent.forEach((u, i) => { const er = validateUrlField(u, 'Sample link'); if (er) e[`sample-${i}`] = er; });
      payload = clean({
        portfolioUrl: data.portfolioUrl, niche: data.niche,
        previousBrands: data.previousBrands, sampleContent: data.sampleContent,
      });
    }

    if (s === 3) {
      e.perVideo = validateMoney(data.rateCard.perVideo, 'Per video');
      e.perReel = validateMoney(data.rateCard.perReel, 'Per reel');
      e.perPost = validateMoney(data.rateCard.perPost, 'Per post');
      e.upiId = validateUpi(data.payout.upiId);
      e.paypalEmail = data.payout.paypalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.payout.paypalEmail) ? 'Enter a valid PayPal email.' : '';
      e.bankAccountNumber = validateBankAccountNumber(data.payout.bankAccountNumber);
      e.ifsc = validateIfsc(data.payout.ifsc);
      e.bankAccountName = maxLen(data.payout.bankAccountName, 120, 'Account name');
      e.pan = validatePan(data.tax.pan);
      e.gstin = validateGstin(data.tax.gstin);
      payload = clean({
        rateCard: clean({
          currency: data.rateCard.currency, perVideo: num(data.rateCard.perVideo),
          perReel: num(data.rateCard.perReel), perPost: num(data.rateCard.perPost),
        }),
        payout: clean({
          method: data.payout.method, upiId: data.payout.upiId, paypalEmail: data.payout.paypalEmail,
          bankAccountName: data.payout.bankAccountName, bankAccountNumber: data.payout.bankAccountNumber,
          ifsc: data.payout.ifsc ? data.payout.ifsc.toUpperCase() : '',
        }),
        tax: clean({ pan: data.tax.pan ? data.tax.pan.toUpperCase() : '', gstin: data.tax.gstin ? data.tax.gstin.toUpperCase() : '' }),
      });
    }

    if (s === 4) {
      payload = { consent: { nda: !!data.consent.nda, brandGuidelines: !!data.consent.brandGuidelines } };
    }

    // drop empty error strings
    Object.keys(e).forEach((k) => !e[k] && delete e[k]);
    return { errors: e, payload };
  };

  const save = async (s, { advance = false } = {}) => {
    const { errors: e, payload } = buildStep(s);
    setErrors(e);
    if (Object.keys(e).length) { setBanner({ type: 'error', text: 'Please fix the highlighted fields.' }); return; }
    if (!Object.keys(payload).length) {
      setBanner(null);
      if (advance && s < STEPS.length - 1) setStep(s + 1);
      return;
    }
    setSaving(true);
    setBanner(null);
    try {
      const res = await creatorUpdateProfile(payload);
      onSaved?.(res.creator);
      setData(fromCreator(res.creator));
      setBanner({ type: 'success', text: 'Saved.' });
      if (advance && s < STEPS.length - 1) setStep(s + 1);
    } catch (err) {
      if (Array.isArray(err.errors)) {
        const fe = {};
        err.errors.forEach((x) => { fe[x.field] = x.message; });
        setErrors((prev) => ({ ...prev, ...fe }));
      }
      setBanner({ type: 'error', text: err.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <span className={`w-full h-1 rounded-full transition-colors ${i <= step ? 'bg-indigo' : 'bg-white/10'}`} />
            <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
              i === step ? 'text-fg' : 'text-soft group-hover:text-fg/80'
            }`}>{s}</span>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-xl tracking-tight mb-1">{STEPS[step]}</h2>
        <p className="font-sans text-[13px] text-mid mb-6">Step {step + 1} of {STEPS.length} · saved as you go.</p>

        {step === 0 && <StepIdentity data={data} errors={errors} setField={setField} setNested={setNested} />}
        {step === 1 && (
          <StepAudience data={data} errors={errors} setNested={setNested}
            setSocial={setSocial} addSocial={addSocial} removeSocial={removeSocial} setField={setField} />
        )}
        {step === 2 && <StepPortfolio data={data} errors={errors} setField={setField} />}
        {step === 3 && <StepCommercials data={data} errors={errors} setNested={setNested} />}
        {step === 4 && <StepConsent data={data} setNested={setNested} />}

        {banner && (
          <p role="status" className={`mt-5 text-[13px] rounded-xl px-4 py-3 border ${
            banner.type === 'success' ? 'text-emerald border-emerald/30 bg-emerald/10' : 'text-red-300 border-red-400/30 bg-red-400/10'
          }`}>{banner.text}</p>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between gap-3 mt-7 pt-6 border-t border-line">
          <button
            type="button"
            onClick={() => (step === 0 ? onExit?.() : setStep(step - 1))}
            className="font-sans text-[13px] font-medium text-fg/70 hover:text-fg glass px-4 py-2.5 rounded-full transition-colors"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => save(step)}
              disabled={saving}
              className="font-sans text-[13px] font-medium text-fg border border-line hover:border-indigo/40 px-4 py-2.5 rounded-full transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => (step === STEPS.length - 1 ? save(step, { advance: false }).then(() => onExit?.()) : save(step, { advance: true }))}
              disabled={saving}
              className="font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-5 py-2.5 rounded-full transition-colors shadow-glow disabled:opacity-60"
            >
              {step === STEPS.length - 1 ? 'Finish' : 'Save & continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Steps ───────────────────────────────────────────────
function StepIdentity({ data, errors, setField, setNested }) {
  const onChange = (e) => setField(e.target.name, e.target.value);
  const onAddr = (e) => setNested('address', e.target.name, e.target.value);
  return (
    <div className="space-y-4">
      <TextField label="Display name" name="name" value={data.name} onChange={onChange} placeholder="Aisha Khan" error={errors.name} />
      <TextField label="Full legal name" hint="as per government ID" name="fullLegalName" value={data.fullLegalName} onChange={onChange} placeholder="Aisha Khan" error={errors.fullLegalName} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Phone" name="phone" type="tel" value={data.phone} onChange={onChange} placeholder="+91 98765 43210" error={errors.phone} />
        <TextField label="Date of birth" hint="18+" name="dateOfBirth" type="date" value={data.dateOfBirth} onChange={onChange} error={errors.dateOfBirth} />
      </div>
      <TextField label="Address line" name="line" value={data.address.line} onChange={onAddr} placeholder="22 MG Road" error={errors.addressLine} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TextField label="City" name="city" value={data.address.city} onChange={onAddr} placeholder="Lucknow" />
        <TextField label="State" name="state" value={data.address.state} onChange={onAddr} placeholder="UP" />
        <TextField label="Pincode" name="pincode" value={data.address.pincode} onChange={onAddr} placeholder="226001" />
        <TextField label="Country" name="country" value={data.address.country} onChange={onAddr} placeholder="India" />
      </div>
    </div>
  );
}

function StepAudience({ data, errors, setNested, setSocial, addSocial, removeSocial, setField }) {
  const gs = data.audience.genderSplit;
  const onGs = (e) => setNested('audience', 'genderSplit', { ...gs, [e.target.name]: e.target.value });
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-[15px] text-fg">Social profiles</h3>
          {data.socialProfiles.length < 10 && (
            <button type="button" onClick={addSocial} className="font-sans text-[12px] font-medium text-indigo hover:text-fg transition-colors">+ Add platform</button>
          )}
        </div>
        <div className="space-y-4">
          {data.socialProfiles.map((sp, i) => (
            <div key={i} className="rounded-xl border border-line p-4 space-y-3 relative">
              {data.socialProfiles.length > 1 && (
                <button type="button" onClick={() => removeSocial(i)} aria-label="Remove" className="absolute top-3 right-3 text-soft hover:text-red-300 text-sm">✕</button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField label="Platform" name={`platform-${i}`} value={sp.platform} onChange={(e) => setSocial(i, 'platform', e.target.value)} options={SOCIAL_PLATFORMS} />
                <TextField label="Handle" name={`handle-${i}`} value={sp.handle} onChange={(e) => setSocial(i, 'handle', e.target.value)} placeholder="@aisha.codes" />
              </div>
              <TextField label="Profile URL" name={`url-${i}`} value={sp.url} onChange={(e) => setSocial(i, 'url', e.target.value)} placeholder="https://instagram.com/aisha.codes" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <TextField label="Followers" name={`fc-${i}`} type="number" value={sp.followerCount} onChange={(e) => setSocial(i, 'followerCount', e.target.value)} placeholder="84000" min="0" />
                <TextField label="Avg likes" name={`al-${i}`} type="number" value={sp.avgLikes} onChange={(e) => setSocial(i, 'avgLikes', e.target.value)} placeholder="5200" min="0" />
                <TextField label="Avg comments" name={`ac-${i}`} type="number" value={sp.avgComments} onChange={(e) => setSocial(i, 'avgComments', e.target.value)} placeholder="310" min="0" />
                <TextField label="Avg shares" name={`as-${i}`} type="number" value={sp.avgShares} onChange={(e) => setSocial(i, 'avgShares', e.target.value)} placeholder="95" min="0" />
              </div>
              {errors[`social-${i}`] && <p className="font-sans text-[12px] text-red-300">{errors[`social-${i}`]}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="Primary age range" name="primaryAgeRange" value={data.audience.primaryAgeRange}
          onChange={(e) => setNested('audience', 'primaryAgeRange', e.target.value)} options={AGE_RANGES} />
        <TextField label="Engagement rate" hint="% overall" name="engagementRate" type="number" value={data.engagementRate}
          onChange={(e) => setField('engagementRate', e.target.value)} placeholder="4.7" min="0" max="100" step="0.1" error={errors.engagementRate} />
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          <TextField label="Male %" name="male" type="number" value={gs.male} onChange={onGs} placeholder="55" min="0" max="100" />
          <TextField label="Female %" name="female" type="number" value={gs.female} onChange={onGs} placeholder="42" min="0" max="100" />
          <TextField label="Other %" name="other" type="number" value={gs.other} onChange={onGs} placeholder="3" min="0" max="100" />
        </div>
        {errors.genderSplit && <p className="mt-1.5 font-sans text-[12px] text-red-300">{errors.genderSplit}</p>}
      </div>

      <ChipsField label="Top locations" hint="one per line, up to 10" value={data.audience.topLocations}
        onChange={(v) => setNested('audience', 'topLocations', v.slice(0, 10))} placeholder={'Mumbai\nDelhi\nBengaluru'} />
    </div>
  );
}

function StepPortfolio({ data, errors, setField }) {
  return (
    <div className="space-y-4">
      <TextField label="Portfolio / media kit URL" name="portfolioUrl" value={data.portfolioUrl}
        onChange={(e) => setField('portfolioUrl', e.target.value)} placeholder="https://aisha.dev/media-kit.pdf" error={errors.portfolioUrl} />
      <ChipsField label="Niche / categories" hint="one per line, up to 10" value={data.niche}
        onChange={(v) => setField('niche', v.slice(0, 10))} placeholder={'Tech Tutorials\nCoding/Dev content'} />
      <ChipsField label="Previous brands" hint="one per line" value={data.previousBrands}
        onChange={(v) => setField('previousBrands', v.slice(0, 50))} placeholder={'Notion\nHostinger'} />
      <ChipsField label="Sample content links" hint="up to 5 URLs" value={data.sampleContent}
        onChange={(v) => setField('sampleContent', v.slice(0, 5))} placeholder={'https://youtube.com/watch?v=abc123'}
        error={errors['sample-0'] || errors['sample-1'] || errors['sample-2'] || errors['sample-3'] || errors['sample-4']} />
    </div>
  );
}

function StepCommercials({ data, errors, setNested }) {
  const rc = data.rateCard, po = data.payout, tx = data.tax;
  const onRc = (e) => setNested('rateCard', e.target.name, e.target.value);
  const onPo = (e) => setNested('payout', e.target.name, e.target.value);
  const onTx = (e) => setNested('tax', e.target.name, e.target.value);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-fg mb-3">Rate card</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SelectField label="Currency" name="currency" value={rc.currency} onChange={onRc} options={CURRENCIES} placeholder="INR" />
          <TextField label="Per video" name="perVideo" type="number" value={rc.perVideo} onChange={onRc} placeholder="25000" min="0" error={errors.perVideo} />
          <TextField label="Per reel" name="perReel" type="number" value={rc.perReel} onChange={onRc} placeholder="8000" min="0" error={errors.perReel} />
          <TextField label="Per post" name="perPost" type="number" value={rc.perPost} onChange={onRc} placeholder="5000" min="0" error={errors.perPost} />
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-[15px] text-fg mb-3">Payout</h3>
        <div className="space-y-3">
          <SelectField label="Method" name="method" value={po.method} onChange={onPo} options={PAYOUT_METHODS} />
          {po.method === 'upi' && (
            <TextField label="UPI ID" name="upiId" value={po.upiId} onChange={onPo} placeholder="aisha@oksbi" error={errors.upiId} />
          )}
          {po.method === 'paypal' && (
            <TextField label="PayPal email" name="paypalEmail" type="email" value={po.paypalEmail} onChange={onPo} placeholder="aisha@example.com" error={errors.paypalEmail} />
          )}
          {po.method === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField label="Account name" name="bankAccountName" value={po.bankAccountName} onChange={onPo} placeholder="Aisha Khan" error={errors.bankAccountName} />
              <TextField label="Account number" name="bankAccountNumber" value={po.bankAccountNumber} onChange={onPo} placeholder="12345678901" error={errors.bankAccountNumber} />
              <TextField label="IFSC" name="ifsc" value={po.ifsc} onChange={onPo} placeholder="HDFC0001234" error={errors.ifsc} />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-[15px] text-fg mb-3">Tax</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="PAN" name="pan" value={tx.pan} onChange={onTx} placeholder="ABCDE1234F" error={errors.pan} />
          <TextField label="GSTIN" hint="optional" name="gstin" value={tx.gstin} onChange={onTx} placeholder="09ABCDE1234F1Z5" error={errors.gstin} />
        </div>
      </div>
    </div>
  );
}

function StepConsent({ data, setNested }) {
  return (
    <div className="space-y-4">
      <p className="font-sans text-[13.5px] text-mid leading-relaxed">
        Both agreements are required before your application can be approved.
      </p>
      <div className="space-y-4 rounded-xl border border-line p-5">
        <CheckField label="I agree to the Non-Disclosure Agreement (NDA)." name="nda"
          checked={data.consent.nda} onChange={(e) => setNested('consent', 'nda', e.target.checked)} />
        <CheckField label="I agree to follow the Brand Guidelines for all collaborations." name="brandGuidelines"
          checked={data.consent.brandGuidelines} onChange={(e) => setNested('consent', 'brandGuidelines', e.target.checked)} />
      </div>
    </div>
  );
}
