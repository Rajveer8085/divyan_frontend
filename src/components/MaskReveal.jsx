import useInView from './useInView';

export default function MaskReveal({ children, delay = 0, className = '', threshold = 0.2 }) {
  const [ref, visible] = useInView({ threshold, once: true });
  return (
    <span ref={ref} className={`mask-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      <span className="mi" style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}
