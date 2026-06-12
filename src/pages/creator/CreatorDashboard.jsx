import { STATUS_LABEL, STATUS_STYLE } from '../../lib/creators';

const STATUS_MESSAGE = {
  pending: 'Your application is received. Complete your profile so our team can review it.',
  under_review: 'Your profile is under review. We’ll update your status shortly.',
  approved: 'You’re approved! Our team will reach out about upcoming campaigns.',
  rejected: 'Your application was not approved this time. You can update your profile and reach out.',
  suspended: 'Your account is currently suspended. Contact us for details.',
};

export default function CreatorDashboard({ creator, onEditProfile }) {
  const c = creator || {};
  const complete = c.profileComplete;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Status card */}
      <div className="glass rounded-2xl p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-soft mb-2">Application status</p>
            <span className={`inline-flex items-center font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLE[c.status] || STATUS_STYLE.pending}`}>
              {STATUS_LABEL[c.status] || c.status}
            </span>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-fg">{c.name}</p>
            <p className="font-sans text-[12.5px] text-mid">{c.email}</p>
          </div>
        </div>
        <p className="font-sans text-[13.5px] text-mid leading-relaxed mt-5 pt-5 border-t border-line">
          {STATUS_MESSAGE[c.status] || ''}
        </p>
      </div>

      {/* Completion banner */}
      {!complete && (
        <div className="rounded-2xl p-6 border border-indigo/30 bg-indigo/8" style={{ backgroundColor: 'rgba(110,139,255,0.08)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-display font-bold text-[15px] text-fg mb-1">Complete your profile</h3>
              <p className="font-sans text-[13px] text-mid leading-relaxed max-w-md">
                Add your identity, at least one social profile, a niche, and accept both agreements to finish your application.
              </p>
            </div>
            <button onClick={onEditProfile}
              className="group inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-5 py-2.5 rounded-full transition-colors shadow-glow shrink-0">
              Complete now <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile overview */}
      <div className="glass rounded-2xl p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg tracking-tight">Your profile</h3>
          <button onClick={onEditProfile} className="font-sans text-[12px] font-medium text-fg/80 hover:text-fg border border-line hover:border-indigo/40 px-3 py-1.5 rounded-full transition-colors">
            {complete ? 'Edit profile' : 'Continue setup'}
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Row label="Legal name" value={c.fullLegalName} />
          <Row label="Phone" value={c.phone} />
          <Row label="Date of birth" value={c.dateOfBirth ? c.dateOfBirth.slice(0, 10) : ''} />
          <Row label="Location" value={[c.address?.city, c.address?.state].filter(Boolean).join(', ')} />
          <Row label="Social profiles" value={c.socialProfiles?.length ? `${c.socialProfiles.length} linked` : ''} />
          <Row label="Niche" value={c.niche?.join(', ')} />
          <Row label="Engagement rate" value={c.engagementRate != null ? `${c.engagementRate}%` : ''} />
          <Row label="Portfolio" value={c.portfolioUrl} isLink />
          <Row label="Consents" value={c.consent?.nda && c.consent?.brandGuidelines ? 'NDA + Brand Guidelines accepted' : 'Pending'} />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value, isLink }) {
  const empty = value == null || value === '';
  return (
    <div>
      <dt className="font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-1">{label}</dt>
      <dd className="font-sans text-[14px] text-fg/90 break-words">
        {empty ? <span className="text-soft/60 italic">Not provided</span>
          : isLink ? <a href={value} target="_blank" rel="noreferrer" className="text-indigo hover:text-fg transition-colors break-all">{value}</a>
          : value}
      </dd>
    </div>
  );
}
