// tailwind.config.js – Professional Monochrome Design
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep neutrals
        dark900: '#050505',
        dark800: '#0a0a0a',
        gray800: '#1a1a1a',
        gray700: '#2b2b2b',
        white05: '#ffffff0d', // ~5% opacity white
        white10: '#ffffff1a', // ~10% opacity
      },
      // Subtle gradient utilities using neutrals
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'glass-soft': 'linear-gradient(to bottom right, rgba(255,255,255,0.02), rgba(255,255,255,0.05))',
      },
      // Softer blur for glass effect
      backdropBlur: {
        glass: '8px',
      },
      // Delicate shadow for depth
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.4)',
      },
      // Light border for glass cards
      borderWidth: {
        glass: '1px',
      },
      // Opacity utility for subtle glows
      opacity: {
        glow: '0.12',
      },
    },
  },
  plugins: [],
};
