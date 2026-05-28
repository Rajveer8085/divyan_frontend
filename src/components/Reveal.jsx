import useInView from './useInView';

export default function Reveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
  style: extraStyle = {},
  ...rest
}) {
  const [ref, visible] = useInView({ threshold, once });

  const base =
    variant === 'left'  ? 'reveal reveal-left'  :
    variant === 'right' ? 'reveal reveal-right' :
    variant === 'scale' ? 'reveal reveal-scale' :
                          'reveal';

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, ...extraStyle }}
      className={`${base} ${visible ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
