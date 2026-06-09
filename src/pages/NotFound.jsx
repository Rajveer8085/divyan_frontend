import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink text-fg font-sans flex items-center justify-center px-5 relative overflow-hidden">
      <div className="aurora opacity-50" aria-hidden />
      <div className="relative text-center max-w-md">
        <p className="font-mono text-[11px] tracking-widest uppercase text-indigo mb-4">Error 404</p>
        <h1 className="font-display font-extrabold text-[clamp(3rem,12vw,6rem)] leading-none tracking-tight grad-text">404</h1>
        <h2 className="font-display font-bold text-xl md:text-2xl text-fg mt-4 tracking-tight">This page took a wrong turn.</h2>
        <p className="font-sans text-[14px] text-mid leading-relaxed mt-3">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-500 shadow-glow mt-8"
        >
          Back to home
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}
