
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				amplie: {
					// Cores principais da marca baseadas na logo
					primary: '#9333ea', // Roxo principal
					'primary-dark': '#7c3aed', // Roxo mais escuro
					'primary-light': '#a855f7', // Roxo mais claro
					magenta: '#e879f9', // Magenta da logo
					'magenta-dark': '#d946ef', // Magenta escuro
					'magenta-light': '#f0abfc', // Magenta claro
					pink: '#ec4899', // Rosa da logo
					'pink-dark': '#db2777', // Rosa escuro
					'pink-light': '#f472b6', // Rosa claro
					// Cores de apoio
					sidebar: '#1a1d29',
					'sidebar-hover': '#2a2d3f',
					'sidebar-active': '#9333ea',
					secondary: '#6c7293',
					success: '#00d25b',
					warning: '#ffab00',
					danger: '#ea5455',
					'card-shadow': 'rgba(147, 51, 234, 0.1)',
					// Gradientes
					'gradient-primary': 'linear-gradient(135deg, #9333ea 0%, #e879f9 50%, #ec4899 100%)',
					'gradient-secondary': 'linear-gradient(135deg, #a855f7 0%, #f0abfc 100%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite'
			},
			boxShadow: {
				'amplie': '0 2px 12px rgba(147, 51, 234, 0.1)',
				'amplie-hover': '0 4px 20px rgba(147, 51, 234, 0.2)',
				'amplie-card': '0 4px 16px rgba(147, 51, 234, 0.08)'
			},
			backgroundImage: {
				'gradient-amplie': 'linear-gradient(135deg, #9333ea 0%, #e879f9 50%, #ec4899 100%)',
				'gradient-amplie-light': 'linear-gradient(135deg, #a855f7 0%, #f0abfc 100%)',
				'gradient-amplie-dark': 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
