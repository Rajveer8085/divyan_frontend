export default function Avatar({ member, className = '', textClass = 'text-4xl md:text-5xl' }) {
  if (member.img) {
    return (
      <img
        src={member.img}
        alt={member.name}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`bg-gradient-to-br ${member.grad} flex items-center justify-center relative overflow-hidden ${className}`}>
      <div aria-hidden className="absolute inset-0 bg-dots opacity-20" />
      <span className={`relative font-display font-extrabold text-ink/85 tracking-tight ${textClass}`}>
        {member.initials}
      </span>
    </div>
  );
}
