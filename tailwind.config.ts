import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        hermes: {
          bg: '#1a1a2e',
          surface: '#16213e',
          elevated: '#1f2b47',
          border: '#2a3a5c',
          'border-bright': '#3d5a80',
          accent: '#e94560',
          'accent-dim': 'rgba(233, 69, 96, 0.15)',
          gold: '#c9a855',
          'gold-dim': 'rgba(201, 168, 85, 0.15)',
          text: '#e8e6e3',
          'text-dim': 'rgba(232, 230, 227, 0.5)',
          'text-muted': 'rgba(232, 230, 227, 0.3)',
          success: '#4ade80',
          warning: '#fbbf24',
          info: '#60a5fa',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'Monaco', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
