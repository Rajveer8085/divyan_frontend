// Shared form field primitives for the creator profile wizard.

const baseInput = (error) =>
  `w-full bg-white/5 border rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none transition-colors ${
    error ? 'border-red-400/50 focus:border-red-400' : 'border-line focus:border-indigo'
  }`;

const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">
    {children}{hint && <span className="text-soft/70 normal-case tracking-normal"> · {hint}</span>}
  </label>
);

const ErrText = ({ error }) => (error ? <p className="mt-1.5 font-sans text-[12px] text-red-300">{error}</p> : null);

export function TextField({ label, hint, name, value, onChange, type = 'text', placeholder, error, ...rest }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input id={id} type={type} name={name} value={value ?? ''} onChange={onChange}
        placeholder={placeholder} aria-invalid={!!error} className={baseInput(error)} {...rest} />
      <ErrText error={error} />
    </div>
  );
}

export function TextArea({ label, hint, name, value, onChange, placeholder, error, rows = 3, ...rest }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <textarea id={id} name={name} rows={rows} value={value ?? ''} onChange={onChange}
        placeholder={placeholder} aria-invalid={!!error} className={`${baseInput(error)} resize-none`} {...rest} />
      <ErrText error={error} />
    </div>
  );
}

export function SelectField({ label, hint, name, value, onChange, options, error, placeholder = 'Select…' }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <select id={id} name={name} value={value ?? ''} onChange={onChange} aria-invalid={!!error}
        className={`${baseInput(error)} appearance-none cursor-pointer`}>
        <option value="" className="bg-ink2">{placeholder}</option>
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value;
          const lab = typeof o === 'string' ? o : o.label;
          return <option key={val} value={val} className="bg-ink2">{lab}</option>;
        })}
      </select>
      <ErrText error={error} />
    </div>
  );
}

export function CheckField({ label, name, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input type="checkbox" name={name} checked={!!checked} onChange={onChange}
        className="mt-0.5 w-4 h-4 rounded border-line bg-white/5 accent-indigo cursor-pointer shrink-0" />
      <span className="font-sans text-[13.5px] text-fg/85 leading-snug group-hover:text-fg transition-colors">{label}</span>
    </label>
  );
}

// Editable comma/line list → string[] (arrays are replaced whole per the API spec).
export function ChipsField({ label, hint, value = [], onChange, placeholder, error }) {
  const text = value.join('\n');
  return (
    <div>
      <Label hint={hint || 'one per line'}>{label}</Label>
      <textarea
        rows={3}
        value={text}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        placeholder={placeholder}
        className={`${baseInput(error)} resize-none`}
      />
      <ErrText error={error} />
    </div>
  );
}
