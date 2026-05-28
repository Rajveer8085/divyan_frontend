import useInView from './useInView';

export default function WordReveal({
  text,
  as: Tag = 'span',
  stagger = 60,        // ms per word
  delay = 0,           // base delay before first word
  className = '',
  wordClassName = '',
  threshold = 0.2,
}) {
  const [ref, visible] = useInView({ threshold, once: true });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`word-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          <span
            className={`w ${wordClassName}`}
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            {w}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
