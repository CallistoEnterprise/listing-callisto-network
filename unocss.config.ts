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
    { 'app-container-center': 'container mx-auto px-12px md:px-24px lg:px-56px' },
    { 'app-container': 'max-w-1800px mx-auto px-12px md:px-24px lg:px-56px' },
    { 'app-h1': 'text-2xl md:text-3xl font-bold leading-tight text-gray-900' },
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
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
  theme: {
    colors: {
      app: {
        green: '#1db954',
        orange: '#ff9800',
        red: '#db302f',
        blue: '#87DAEC',
        darkBlue: '#141617',
        white: '#ffff',
        black: '#000000',
        gray: '##E5E7EB',
        greyStroke: ' #E0E0E0',
      },
    },
  },
})
