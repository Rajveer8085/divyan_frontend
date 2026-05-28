/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:     '#0A0A12',  // near-black canvas
        ink2:    '#0E0E1A',  // slightly raised
        surface: '#13131F',  // card surface
        surface2:'#181826',  // raised card
        line:    'rgba(255,255,255,0.08)',
        lineStrong: 'rgba(255,255,255,0.14)',
        fg:      '#F5F6FF',  // primary text
        mid:     '#A2A2BC',  // body
        soft:    '#6E6E88',  // captions
        indigo:  '#6E8BFF',  // primary accent
        indigoDeep: '#4D63E6',
        cyan:    '#22D3EE',  // secondary glow
        violet:  '#A78BFA',  // tertiary glow
        emerald: '#34D399',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tight2: '-0.035em',
      },
      fontSize: {
        // Production-grade, restrained hero sizing
        'hero': ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        'h2':   ['clamp(1.75rem, 3.6vw, 3rem)',  { lineHeight: '1.08', letterSpacing: '-0.025em' }],
      },
      maxWidth: {
        page: '1200px',
      },
      boxShadow: {
        glow:      '0 0 40px -8px rgba(110,139,255,0.45)',
        glowCyan:  '0 0 40px -8px rgba(34,211,238,0.4)',
        card:      '0 8px 30px rgba(0,0,0,0.4)',
        cardHover: '0 16px 50px rgba(0,0,0,0.55)',
      },
      transitionTimingFunction: {
        out:    'cubic-bezier(.2,.7,.2,1)',
        spring: 'cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
}
