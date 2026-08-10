import { defineMermaidSetup } from '@slidev/types'
import { accentPalette } from '../composables/accent'

// Crimson Deck mermaid theme — flowcharts and sequence diagrams sit on the dark
// surface with the deck's accent. The setup callback runs client-side when the
// first diagram renders, so the accent ramp has already been derived from
// `themeConfig.primary` by then and diagrams follow a custom primary too.
export default defineMermaidSetup(() => {
  const accent = accentPalette()
  const read = (name: string, fallback: string) => {
    if (typeof document === 'undefined') return fallback
    const host = document.body ?? document.documentElement
    return getComputedStyle(host).getPropertyValue(name).trim() || fallback
  }

  const bg = read('--cd-bg', '#08080A')
  const surface = read('--cd-surface', '#121215')
  const surface2 = read('--cd-surface-2', '#1A1A1F')
  const fg = read('--cd-fg', '#F2EFEE')
  const muted = read('--cd-muted', '#9C9AA2')

  return {
    theme: 'base',
    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
    flowchart: {
      htmlLabels: false,
      useMaxWidth: false,
      nodeSpacing: 70,
      rankSpacing: 90,
      padding: 18,
    },
    sequence: {
      useMaxWidth: false,
    },
    themeVariables: {
      darkMode: true,
      background: bg,
      fontSize: '26px',
      primaryColor: surface2,
      primaryTextColor: fg,
      primaryBorderColor: accent.accent,
      secondaryColor: surface,
      secondaryTextColor: fg,
      secondaryBorderColor: 'rgba(255,255,255,0.18)',
      tertiaryColor: '#0E0E11',
      tertiaryTextColor: muted,
      tertiaryBorderColor: 'rgba(255,255,255,0.12)',
      lineColor: accent.light,
      textColor: fg,
      mainBkg: surface2,
      nodeBorder: accent.accent,
      nodeTextColor: fg,
      clusterBkg: '#101013',
      clusterBorder: 'rgba(255,255,255,0.14)',
      edgeLabelBackground: bg,
      titleColor: fg,
      actorBkg: surface2,
      actorBorder: accent.accent,
      actorTextColor: fg,
      actorLineColor: 'rgba(255,255,255,0.25)',
      signalColor: fg,
      signalTextColor: fg,
      labelBoxBkgColor: accent.accent,
      labelBoxBorderColor: accent.accent,
      labelTextColor: accent.onAccent,
      loopTextColor: fg,
      noteBkgColor: '#242429',
      noteTextColor: '#D7D4D2',
      noteBorderColor: 'rgba(255,255,255,0.16)',
      activationBkgColor: accent.accent,
      activationBorderColor: accent.accent,
      sequenceNumberColor: accent.onAccent,
    },
  }
})
