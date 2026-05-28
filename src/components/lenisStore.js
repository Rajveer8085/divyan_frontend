let _lenis = null;

export const setLenis = (l) => { _lenis = l; };
export const stopLenis = () => { if (_lenis) _lenis.stop(); };
export const startLenis = () => { if (_lenis) _lenis.start(); };
