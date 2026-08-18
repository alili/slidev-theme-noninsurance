import { defineConfig, presetIcons } from 'unocss'
import lucide from '@iconify-json/lucide/icons.json'
import carbon from '@iconify-json/carbon/icons.json'

const lucideIcons = Object.keys(lucide.icons)
const carbonIcons = Object.keys(carbon.icons)

export default defineConfig({
  safelist: [
    ...lucideIcons.map(n => `i-lucide-${n}`),
    ...lucideIcons.map(n => `i-lucide:${n}`),
    ...lucideIcons.map(n => `i-iucide-${n}`),
    ...carbonIcons.map(n => `i-carbon-${n}`),
    ...carbonIcons.map(n => `i-carbon:${n}`),
  ],
  presets: [
    presetIcons({
      collections: {
        lucide: () => lucide,
        carbon: () => carbon,
      },
      scale: 1.2,
      warn: false,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
