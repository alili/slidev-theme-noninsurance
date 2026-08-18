import { defineUnoSetup } from '@slidev/types'

const icons = [
  // used by the demo (example.md)
  'git-branch', 'shield-check', 'line-chart', 'monitor-play',
  'mail', 'message-circle', 'building-2', 'qr-code',
  // common extras
  'check', 'check-circle', 'arrow-right', 'arrow-left', 'arrow-up-right',
  'zap', 'rocket', 'target', 'users', 'user', 'database', 'server', 'cloud',
  'activity', 'trending-up', 'trending-down', 'alert-triangle', 'info',
  'calendar', 'clock', 'star', 'heart', 'settings', 'code', 'terminal',
  'layers', 'box', 'package', 'cpu', 'bar-chart-3', 'pie-chart', 'gauge',
  'shield', 'lock', 'key', 'search', 'filter', 'bell', 'flag', 'sparkles',
  'workflow', 'git-commit-horizontal', 'git-merge', 'globe', 'link', 'send',
]

const carbonIcons = [
  'arrow-left', 'arrow-right', 'maximize', 'minimize', 'apps',
  'moon', 'sun', 'pen', 'presentation-file', 'user-speaker',
  'information', 'camera', 'record', 'magic-wand'
]

export default defineUnoSetup(() => {
  return {
    safelist: [
      ...icons.map(n => `i-lucide-${n}`),
      ...icons.map(n => `i-lucide:${n}`),
      ...carbonIcons.map(n => `i-carbon-${n}`),
      ...carbonIcons.map(n => `i-carbon:${n}`),
    ],
  }
})
