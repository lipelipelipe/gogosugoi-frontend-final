// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'font-sans' como a família de fontes padrão, usando nossa variável --font-inter
        sans: ['var(--font-inter)', 'sans-serif'],
        // Define 'font-heading' como nossa fonte de anime estilizada, usando a variável --font-bangers
        heading: ['var(--font-bangers)', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config