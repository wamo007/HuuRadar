/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  			}
  		},
		transitionDelay: {
			'600': '600ms'
		},
		animation: {
			slideIn4: 'slideIn4 0.7s ease-out forwards',
			slideIn6: 'slideIn6 0.8s ease-out forwards',
			slideIn7: 'slideIn7 1s ease-out forwards',
			slideIn8: 'slideIn8 1.2s ease-out forwards',
			shake: "shake 0.6s cubic-bezier(.36,.07,.19,.97) both",
		},
		keyframes: {
			shake: {
				'10%, 90%': {
					transform: 'translateX(-1px)'
				},
				'20%, 80%': {
				transform: 'translateX(1px)'
				},
				'30%, 50%, 70%': {
				transform: 'translateX(-2px)'
				},
				'40%, 60%': {
				transform: 'translateX(2px)'
				}
			},
			slideIn4: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-4rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			slideIn6: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-6rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			slideIn7: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-7rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			slideIn8: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-8rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			}
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

