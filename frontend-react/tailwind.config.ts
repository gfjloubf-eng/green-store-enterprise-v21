import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color tokens — reference CSS variables
        primary: {
          DEFAULT: 'var(--gs-primary)',
          hover: 'var(--gs-primary-hover)',
          active: 'var(--gs-primary-active)',
          soft: 'var(--gs-primary-soft)',
          contrast: 'var(--gs-primary-contrast)',
        },
        secondary: {
          DEFAULT: 'var(--gs-secondary)',
          hover: 'var(--gs-secondary-hover)',
          soft: 'var(--gs-secondary-soft)',
        },
        accent: {
          DEFAULT: 'var(--gs-accent)',
          hover: 'var(--gs-accent-hover)',
          soft: 'var(--gs-accent-soft)',
        },
        surface: {
          DEFAULT: 'var(--gs-surface)',
          elevated: 'var(--gs-surface-elevated)',
        },
        background: {
          DEFAULT: 'var(--gs-background)',
        },
        foreground: {
          DEFAULT: 'var(--gs-foreground)',
          secondary: 'var(--gs-foreground-secondary)',
          muted: 'var(--gs-foreground-muted)',
          disabled: 'var(--gs-foreground-disabled)',
        },
        border: {
          DEFAULT: 'var(--gs-border)',
          hover: 'var(--gs-border-hover)',
          subtle: 'var(--gs-border-subtle)',
        },
        muted: {
          DEFAULT: 'var(--gs-muted)',
          hover: 'var(--gs-muted-hover)',
          foreground: 'var(--gs-muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--gs-card)',
          hover: 'var(--gs-card-hover)',
        },
        success: {
          DEFAULT: 'var(--gs-success)',
          soft: 'var(--gs-success-soft)',
        },
        warning: {
          DEFAULT: 'var(--gs-warning)',
          soft: 'var(--gs-warning-soft)',
        },
        danger: {
          DEFAULT: 'var(--gs-danger)',
          soft: 'var(--gs-danger-soft)',
        },
        info: {
          DEFAULT: 'var(--gs-info)',
          soft: 'var(--gs-info-soft)',
        },
        // Legacy gray aliases for compatibility
        gray: {
          50: 'var(--gs-foreground)',
          100: 'var(--gs-foreground)',
          200: 'var(--gs-foreground-secondary)',
          300: 'var(--gs-foreground-secondary)',
          400: 'var(--gs-foreground-secondary)',
          500: 'var(--gs-foreground-muted)',
          600: 'var(--gs-foreground-muted)',
          700: 'var(--gs-muted)',
          800: 'var(--gs-border)',
          900: 'var(--gs-surface)',
          950: 'var(--gs-background)',
        },
        emerald: {
          400: 'var(--gs-primary)',
          500: 'var(--gs-primary)',
          500: 'var(--gs-primary)',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': 'var(--gs-text-display)',
        'h1': 'var(--gs-text-h1)',
        'h2': 'var(--gs-text-h2)',
        'h3': 'var(--gs-text-h3)',
        'h4': 'var(--gs-text-h4)',
        'body': 'var(--gs-text-body)',
        'small': 'var(--gs-text-small)',
        'micro': 'var(--gs-text-micro)',
      },
      spacing: {
        '0_5': 'var(--gs-space-0_5)',
        '1_5': 'var(--gs-space-1_5)',
        '2_5': 'var(--gs-space-2_5)',
        '3_5': 'var(--gs-space-3_5)',
        '11': 'var(--gs-space-11)',
        '14': 'var(--gs-space-14)',
      },
      borderRadius: {
        'sm': 'var(--gs-radius-sm)',
        'md': 'var(--gs-radius-md)',
        'lg': 'var(--gs-radius-lg)',
        'xl': 'var(--gs-radius-xl)',
        '2xl': 'var(--gs-radius-2xl)',
      },
      boxShadow: {
        'xs': 'var(--gs-shadow-xs)',
        'sm': 'var(--gs-shadow-sm)',
        'md': 'var(--gs-shadow-md)',
        'lg': 'var(--gs-shadow-lg)',
        'xl': 'var(--gs-shadow-xl)',
        '2xl': 'var(--gs-shadow-2xl)',
        'card': 'var(--gs-shadow-card)',
        'dropdown': 'var(--gs-shadow-dropdown)',
        'modal': 'var(--gs-shadow-modal)',
      },
      backdropBlur: {
        xs: '2px',
        sm: 'var(--gs-blur-sm)',
        md: 'var(--gs-blur-md)',
        lg: 'var(--gs-blur-lg)',
        xl: 'var(--gs-blur-xl)',
      },
      zIndex: {
        'dropdown': 'var(--gs-z-dropdown)',
        'sticky': 'var(--gs-z-sticky)',
        'overlay': 'var(--gs-z-overlay)',
        'modal': 'var(--gs-z-modal)',
        'toast': 'var(--gs-z-toast)',
        'tooltip': 'var(--gs-z-tooltip)',
      },
      transitionDuration: {
        'fast': 'var(--gs-duration-fast)',
        'normal': 'var(--gs-duration-normal)',
        'medium': 'var(--gs-duration-medium)',
        'slow': 'var(--gs-duration-slow)',
        'slower': 'var(--gs-duration-slower)',
      },
      transitionTimingFunction: {
        'gs-standard': 'var(--gs-ease-in-out)',
        'gs-spring': 'var(--gs-ease-spring)',
        'gs-bounce': 'var(--gs-ease-bounce)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in var(--gs-duration-normal) var(--gs-ease-out)',
        'fade-out': 'fade-out var(--gs-duration-fast) var(--gs-ease-in)',
        'slide-in-up': 'slide-in-up var(--gs-duration-medium) var(--gs-ease-out)',
        'slide-in-down': 'slide-in-down var(--gs-duration-medium) var(--gs-ease-out)',
        'slide-in-left': 'slide-in-left var(--gs-duration-medium) var(--gs-ease-out)',
        'slide-in-right': 'slide-in-right var(--gs-duration-medium) var(--gs-ease-out)',
        'scale-in': 'scale-in var(--gs-duration-fast) var(--gs-ease-out)',
        'shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulse-soft 2s var(--gs-ease-in-out) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px var(--gs-primary-soft)' },
          '100%': { boxShadow: '0 0 20px rgba(5, 150, 105, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config

