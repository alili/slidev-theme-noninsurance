// The crimson layouts (steps / fact / contact / image bullets) render lucide
// icons through dynamic classes like `i-lucide-${name}`, which UnoCSS cannot
// discover by static analysis. Safelist the icons the theme's demo uses plus a
// set of common ones. If you reference another lucide icon in your own slides,
// add its `i-lucide-<name>` here (or write the static class directly).
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

export default {
  safelist: icons.map(n => `i-lucide-${n}`),
}
