import { useEffect, useState } from 'react';
import useInView from './useInView';

export default function CountUp({
  to,
  from = 0,
  duration = 1600,
  format = (n) => n,
  className = '',
}) {
  const [ref, visible] = useInView({ threshold: 0.4, once: true });
  const [n, setN] = useState(from);

  useEffect(() => {
    if (!visible) return;
    let raf;
    let start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, from, duration]);

  return <span ref={ref} className={className}>{format(Math.round(n))}</span>;
}
