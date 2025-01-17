/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		boxShadow: {
			'2xl-b-0': '0 0 50px -12px rgb(0 0 0 / 0.25)',
		  },	
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
  				'5': 'hsl(var(--chart-5))',
				'6': 'hsl(var(--chart-6))',
  			}
  		},
		transitionDelay: {
			'600': '600ms'
		},
		animation: {
			typewriterBlinkCursor: `
				typewriter 4s steps(44) 1s 1 normal both,
				blinkTextCursor 500ms steps(44) infinite normal
				`,
			slideIn4: 'slideIn4 0.7s ease-in-out forwards',
			slideIn5: 'slideIn4 0.8s ease-in-out forwards',
			slideIn6: 'slideIn6 0.9s ease-in-out forwards',
			slideIn7: 'slideIn7 1s ease-in-out forwards',
			slideIn8: 'slideIn8 1.2s ease-in-out forwards',
			slideIn10: 'slideIn10 1.4s ease-in-out forwards',
			slideInSpin10: 'slideInSpin10 1.0s ease-in-out forwards',
			shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
			listOpen: 'listOpen 0.5s ease-in-out forwards',
			pulse7: 'pulse7 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
		},
		keyframes: {
			typewriter: {
				'0%': {
					width: '0'
				},
				'100%': {
					width: '100%'
				}
			},
			blinkTextCursor: {
				'0%': {
					borderRightColor: 'rgba(255,255,255,.75)'
				},
				'100%': {
					borderRightColor: 'transparent'
				}
			},
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
			listOpen: {
				'0%': {
					opacity: '0',
					transform: 'translateY(-2rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0rem)'
				}
			},
			pulse7: {
				'50%': {
					opacity: '0.7'
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
			slideIn5: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-5rem)'
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
			},
			slideIn10: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-9rem)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			slideInSpin10: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-20rem) rotate(350deg)',	
				},
				'60%': {
					transform: 'translateX(3rem) rotate(370deg)',
				},
				'80%': {
					transform: 'translateX(-2rem) rotate(355deg)',
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0) rotate(360deg)'
				}
			}
		}
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
	require("tailwindcss-3d")
  ],
}

