import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    { 'app-btn': 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-darkBlue/90 hover:bg-app-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-red/50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed' },
    { 'app-container-center': 'container mx-auto px-12px md:px-24px lg:px-56px' },
    { 'app-container': 'container mx-auto px-24px md:px-48px lg:px-72px' },
    { 'app-h1': 'text-2xl md:text-3xl font-bold leading-tight text-gray-900' },
    { 'app-h2': 'text-xl md:text-2xl font-bold leading-tight text-gray-600' },
    { 'app-section': 'py-32px md:pb-64px' },
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left md:w-400px md:w-720px md:w-920px md:w-1020px'.split(' '),
  theme: {
    colors: {
      app: {
        green: '#1db954',
        orange: '#ff9800',
        red: '#db302f',
        blue: '#87DAEC',
        darkBlue: '#284E66',
        deepBlue: '#141617',
        white: '#ffff',
        black: '#000000',
        gray: '##E5E7EB',
        greyStroke: ' #E0E0E0',
      },
    },
  },
})
