import { defineMermaidSetup } from '@slidev/types'

// Crimson Deck mermaid theme — ported from the original design so flowcharts
// and sequence diagrams sit on the dark surface with the crimson accent.
export default defineMermaidSetup(() => {
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
      background: '#08080A',
      fontSize: '26px',
      primaryColor: '#1A1A1F',
      primaryTextColor: '#F2EFEE',
      primaryBorderColor: 'rgb(200,20,24)',
      secondaryColor: '#121215',
      secondaryTextColor: '#F2EFEE',
      secondaryBorderColor: 'rgba(255,255,255,0.18)',
      tertiaryColor: '#0E0E11',
      tertiaryTextColor: '#9C9AA2',
      tertiaryBorderColor: 'rgba(255,255,255,0.12)',
      lineColor: 'rgb(214,54,58)',
      textColor: '#F2EFEE',
      mainBkg: '#1A1A1F',
      nodeBorder: 'rgb(200,20,24)',
      nodeTextColor: '#F2EFEE',
      clusterBkg: '#101013',
      clusterBorder: 'rgba(255,255,255,0.14)',
      edgeLabelBackground: '#08080A',
      titleColor: '#F2EFEE',
      actorBkg: '#1A1A1F',
      actorBorder: 'rgb(200,20,24)',
      actorTextColor: '#F2EFEE',
      actorLineColor: 'rgba(255,255,255,0.25)',
      signalColor: '#F2EFEE',
      signalTextColor: '#F2EFEE',
      labelBoxBkgColor: 'rgb(200,20,24)',
      labelBoxBorderColor: 'rgb(200,20,24)',
      labelTextColor: '#FFFFFF',
      loopTextColor: '#F2EFEE',
      noteBkgColor: '#242429',
      noteTextColor: '#D7D4D2',
      noteBorderColor: 'rgba(255,255,255,0.16)',
      activationBkgColor: 'rgb(200,20,24)',
      activationBorderColor: 'rgb(200,20,24)',
      sequenceNumberColor: '#FFFFFF',
    },
  }
})
