import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-black",
    "bg-[#1f3f66]",
    "bg-yellow-100",
    "bg-gray-200",
    "text-white",
    "bg-[#f5f5dc]",
    "bg-gradient-to-b",
    "from-[#f7d488]",
    "to-[#c99d3a]",
    "text-black",
    "border-white",
    "border-[#333]",
    "border-[#b8872b]",
    "bg-gradient-to-r from-[#3d3529] to-[#1a1a1a]",
    "bg-gradient-to-r from-purple-400 to-purple-600",
    "bg-blue-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-yellow-500",
    "border-[#b8872b]",
    "text-[#b8872b]",
     // Gender indicator classes
  'bg-blue-500',
  'bg-pink-500', 
  'bg-purple-500',
  'text-white',
  'text-xs',
  'px-2',
  'py-1',
  'rounded-full',
  'flex',
  'items-center',
  'gap-1',
  'opacity-0',
  'group-hover:opacity-100',
  'transition-opacity',
  'duration-300',
  'shadow-md',
  'text-sm',
  'capitalize',
  'font-medium',
  'hidden',
  'sm:inline',
  'absolute',
  'top-2',
  'right-2',

  // Category background classes
  'bg-gradient-to-br',
  'from-black',
  'via-gray-900',
  'to-purple-900',
  'from-pink-50',
  'via-white',
  'to-blue-50',
  'from-cyan-50',
  'via-blue-50',
  'to-teal-50',
    // Color classes
  'text-white',
  'text-gray-400',
  'text-gray-600',
  'text-gray-800',
  'text-yellow-400',
  'hover:text-yellow-400',
  'hover:text-pink-600',
  'hover:text-cyan-600',
  'group-hover:text-yellow-400',
  'group-hover:text-pink-600',
  'group-hover:text-cyan-600',

  // Background classes
  'bg-transparent',
  'bg-white',
  'bg-black',
  'bg-gradient-to-br',
  'from-gray-900',
  'to-black',
  'from-cyan-100',
  'to-blue-100',

  // Border classes
  'border',
  'border-2',
  'border-transparent',
  'border-gray-700/50',
  'hover:border-pink-200',
  'group-hover:border-pink-200',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',

  // Shadow classes
  'shadow-lg',
  'shadow-md',
  'shadow-2xl',
  'shadow-xl',
  'hover:shadow-xl',
  'group-hover:shadow-xl',
  'drop-shadow-2xl',

  // Transform classes
  'transform',
  'transition-all',
  'transition-colors',
  'transition-opacity',
  'duration-300',
  'duration-500',
  'hover:scale-105',
  'hover:scale-110',
  'group-hover:scale-110',
  'active:scale-95',

  // Position classes
  'relative',
  'absolute',
  'inset-0',
  'top-2',
  'right-2',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily:{
        bebas:['"Bebas Neue"','sans-serif']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;
