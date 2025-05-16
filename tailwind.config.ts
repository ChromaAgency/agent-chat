import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // This is fine, but if you only use `app` router, it's not strictly needed
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Aquí puedes extender los valores por defecto de Tailwind CSS.
      // Por ejemplo, puedes agregar tus propios colores, fuentes, etc.
      colors: {
        'primary': '#6366f1', // Un color primario personalizado (indigo-500)
        'secondary': '#d946ef', // Un color secundario (violet-500)
        'accent': '#f43f5e',  //Un color acento (rose-500)
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Fuente sans-serif personalizada
        'mono': ['Menlo', 'monospace'],    // Fuente monoespaciada
      },
      spacing: {
        '128': '32rem', // Espaciado personalizado
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem', // Radio de borde extra grande
      },
    },
  },
  plugins: [
    // Aquí puedes agregar plugins de Tailwind CSS para extender su funcionalidad.
    // Por ejemplo, puedes agregar el plugin `@tailwindcss/forms` para estilizar
    // elementos de formulario de manera más fácil.
    // require('@tailwindcss/forms'),
  ],
};
export default config;
