/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                fontFamily: {
                        'brutalist': ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
                        'headline': ['Oswald', 'Impact', 'Arial Black', 'sans-serif'],
                        'mono-brutal': ['JetBrains Mono', 'Courier New', 'monospace'],
                        'display': ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
                        'body': ['Inter', 'system-ui', 'sans-serif']
                },
                fontWeight: {
                        'ultra': '900',
                        'black': '900'
                },
                letterSpacing: {
                        'extreme': '0.2em',
                        'brutal': '0.15em'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // PSPK Crimson Color Psychology Scheme
                        crimson: {
                                DEFAULT: 'var(--crimson-primary)',
                                primary: 'var(--crimson-primary)',
                                dark: 'var(--crimson-dark)',
                                light: 'var(--crimson-light)'
                        },
                        gold: {
                                DEFAULT: 'var(--gold-accent)',
                                accent: 'var(--gold-accent)',
                                light: 'var(--gold-light)',
                                dark: 'var(--gold-dark)',
                                brass: 'var(--brass-gold)'
                        },
                        pspk: {
                                black: 'var(--black-primary)',
                                'black-secondary': 'var(--black-secondary)',
                                'black-tertiary': 'var(--black-tertiary)',
                                'ash-white': 'var(--ash-white)',
                                'blood-red': 'var(--blood-red)',
                                'cta-primary': 'var(--cta-primary)',
                                'cta-secondary': 'var(--cta-secondary)',
                                'vault-badge': 'var(--vault-badge)',
                                success: 'var(--success-green)',
                                warning: 'var(--warning-orange)'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};