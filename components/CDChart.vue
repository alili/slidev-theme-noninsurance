<script setup lang="ts">
/**
 * CDChart — crimson-themed ECharts wrapper.
 *
 * The theme *styling* (colors, fonts, axes, legend) lives here; the *data* is
 * yours to pass from Markdown, so this component is reusable across decks:
 *
 *   <CDChart type="bar"
 *     :categories="['A','B','C']"
 *     :series="[{ name:'前', data:[1,2,3] }, { name:'后', data:[4,5,6] }]" />
 *
 *   <CDChart type="pie" :data="[{ name:'存储', value:42 }, { name:'计算', value:27 }]" />
 *
 *   <CDChart type="sankey" :nodes="[...]" :links="[...]" />
 *
 * Per-type data props (all optional — each falls back to sample data so the
 * chart is never empty before you edit it):
 *   bar / line      → categories: string[], series: [{ name, data, dashed?, area? }]
 *   scatter         → series: [{ data: [[x,y], …], color? }]
 *   pie / funnel    → data: [{ name, value, color? }]
 *   radar           → indicator: [{ name, max }], series: [{ name, value: number[] }]
 *   sankey          → nodes: [{ name, color? }], links: [{ source, target, value }]
 *   heatmap         → categories (x), yCategories (y), data: [[x,y,v], …]
 *
 * For anything the props don't cover, pass a full/partial ECharts `option`
 * (deep-merged over the themed preset). The host element must have a height.
 */
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: string
    categories?: (string | number)[]
    yCategories?: (string | number)[]
    series?: any[]
    data?: any[]
    nodes?: any[]
    links?: any[]
    indicator?: any[]
    option?: any
  }>(),
  { type: 'bar' },
)

const root = ref<HTMLElement | null>(null)
let echarts: any = null
let chart: any = null
let ro: ResizeObserver | null = null

function theme() {
  const cs = getComputedStyle(document.documentElement)
  return {
    accent: cs.getPropertyValue('--cd-accent').trim() || 'rgb(200,20,24)',
    fg: '#F2EFEE',
    muted: '#9C9AA2',
    line: 'rgba(255,255,255,0.11)',
    font: "'Noto Sans SC', system-ui, sans-serif",
  }
}

// ---- sample data (defaults; overridden by matching props) -----------------
const DEMO = {
  bar: {
    categories: ['订单 GMV', '流量归因', '库存快照', '财务对账'],
    series: [
      { name: '迁移前', data: [4980, 4340, 2480, 1310] },
      { name: '迁移后', data: [1840, 2260, 720, 1150] },
    ],
  },
  line: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    series: [
      { name: 'P95 延迟 (h)', data: [18, 16.4, 13.1, 10.2, 8.4, 7.1, 6.7], area: true },
      { name: 'P1 故障数', data: [6, 5, 4, 2, 1, 0, 0], dashed: true },
    ],
  },
  scatter: [
    { data: [[1.2, 14], [2.1, 18], [3.4, 16], [4.8, 22], [5.2, 19], [6.7, 26], [7.9, 24], [9.1, 31], [10.4, 28], [12.2, 33], [13.8, 30], [15.1, 36], [17.4, 34], [19.2, 38]] },
    { data: [[2.4, 62], [4.1, 74], [6.2, 88], [8.4, 104], [11.2, 121], [14.6, 138], [18.1, 152]], color: '#4A4A52' },
  ],
  pie: [
    { name: '存储', value: 42 },
    { name: '计算', value: 27 },
    { name: '流式集群', value: 18 },
    { name: '其他', value: 13 },
  ],
  funnel: [
    { name: '咨询接入', value: 86 },
    { name: '完成评估', value: 64 },
    { name: '提交定义', value: 48 },
    { name: '完成改造', value: 37 },
    { name: '上线运行', value: 31 },
  ],
  radarIndicator: [
    { name: '新鲜度', max: 5 }, { name: '可观测性', max: 5 }, { name: '成本效率', max: 5 },
    { name: '口径一致', max: 5 }, { name: '自助能力', max: 5 }, { name: '稳定性', max: 5 },
  ],
  radarSeries: [
    { name: '2026.01', value: [2, 2, 3, 1, 2, 3] },
    { name: '2026.07', value: [4.5, 4, 4, 4.5, 4, 4.5] },
  ],
  sankeyNodes: [
    { name: '业务库 CDC' }, { name: '日志埋点' }, { name: 'Kafka 接入层' }, { name: '明细层 DWD' },
    { name: '汇总层 DWS' }, { name: 'BI 看板' }, { name: '实时告警' }, { name: '归档冷存' },
  ],
  sankeyLinks: [
    { source: '业务库 CDC', target: 'Kafka 接入层', value: 62 },
    { source: '日志埋点', target: 'Kafka 接入层', value: 38 },
    { source: 'Kafka 接入层', target: '明细层 DWD', value: 74 },
    { source: 'Kafka 接入层', target: '归档冷存', value: 26 },
    { source: '明细层 DWD', target: '汇总层 DWS', value: 44 },
    { source: '明细层 DWD', target: '归档冷存', value: 30 },
    { source: '汇总层 DWS', target: 'BI 看板', value: 12 },
    { source: '汇总层 DWS', target: '实时告警', value: 8 },
    { source: '汇总层 DWS', target: '归档冷存', value: 24 },
  ],
  heatmapX: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  heatmapY: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  heatmapRaw: [
    [2, 1, 0, 3, 9, 8, 4, 3, 2, 4, 3, 1],
    [1, 0, 1, 2, 6, 5, 3, 2, 2, 3, 2, 1],
    [1, 1, 0, 2, 5, 4, 3, 3, 1, 2, 2, 0],
    [0, 1, 1, 2, 4, 6, 3, 2, 2, 3, 1, 1],
    [1, 0, 1, 3, 5, 7, 4, 4, 3, 5, 4, 2],
    [0, 0, 0, 1, 2, 3, 2, 1, 1, 2, 1, 0],
    [0, 1, 0, 1, 2, 2, 1, 1, 0, 1, 1, 0],
  ],
}

const SERIES_PALETTE = (t: any) => ['#2A2A31', t.accent, '#8E1D17', '#4A4A52', '#6b1418']
const PIE_PALETTE = (t: any) => [t.accent, '#8E1D17', '#4A4A52', '#2A2A31', '#6b1418', '#5A5A63']
const FUNNEL_PALETTE = (t: any) => ['#4A0B0E', '#7A0F12', '#A8151A', t.accent, '#D8262B', '#8E1D17']

function preset(kind: string, t: any, p: typeof props): any {
  const axisBase = {
    axisLine: { lineStyle: { color: t.line } },
    axisTick: { show: false },
    axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font },
    splitLine: { lineStyle: { color: t.line, type: 'dashed' } },
  }
  const legend = { textStyle: { color: t.muted, fontSize: 24, fontFamily: t.font }, itemGap: 32, top: 0, right: 0 }

  if (kind === 'bar') {
    const cats = p.categories ?? DEMO.bar.categories
    const ss = p.series ?? DEMO.bar.series
    return {
      backgroundColor: 'transparent', grid: { left: 90, right: 40, top: 80, bottom: 70 },
      legend, textStyle: { fontFamily: t.font }, tooltip: { show: false },
      xAxis: Object.assign({}, axisBase, { type: 'category', data: cats, splitLine: { show: false } }),
      yAxis: Object.assign({}, axisBase, { type: 'value' }),
      series: ss.map((s: any, i: number) => {
        const primary = i === ss.length - 1
        return {
          name: s.name, type: 'bar', barWidth: 54, data: s.data,
          itemStyle: { color: s.color ?? (primary ? t.accent : '#2A2A31') },
          label: { show: true, position: 'top', color: primary ? t.fg : t.muted, fontSize: 24, fontFamily: t.font },
        }
      }),
    }
  }

  if (kind === 'line') {
    const cats = p.categories ?? DEMO.line.categories
    const ss = p.series ?? DEMO.line.series
    return {
      backgroundColor: 'transparent', grid: { left: 90, right: 60, top: 80, bottom: 70 },
      legend, textStyle: { fontFamily: t.font }, tooltip: { show: false },
      xAxis: Object.assign({}, axisBase, { type: 'category', boundaryGap: false, data: cats, splitLine: { show: false } }),
      yAxis: Object.assign({}, axisBase, { type: 'value' }),
      series: ss.map((s: any, i: number) => {
        const dashed = s.dashed ?? i !== 0
        const area = s.area ?? i === 0
        return {
          name: s.name, type: 'line', smooth: true, symbolSize: 12,
          lineStyle: { width: dashed ? 3 : 5, color: dashed ? t.muted : t.accent, type: dashed ? 'dashed' : 'solid' },
          itemStyle: { color: dashed ? t.muted : t.accent },
          areaStyle: area ? { color: 'rgba(200,20,24,0.14)' } : undefined,
          data: s.data,
        }
      }),
    }
  }

  if (kind === 'scatter') {
    const ss = p.series ?? DEMO.scatter
    return {
      backgroundColor: 'transparent', grid: { left: 120, right: 70, top: 80, bottom: 130 },
      textStyle: { fontFamily: t.font }, tooltip: { show: false },
      xAxis: Object.assign({}, axisBase, { type: 'value', name: '日处理量 (TB)', nameLocation: 'middle', nameGap: 56, nameTextStyle: { color: t.muted, fontSize: 24, fontFamily: t.font } }),
      yAxis: Object.assign({}, axisBase, { type: 'value', name: 'P95 延迟 (min)', nameLocation: 'middle', nameGap: 84, nameTextStyle: { color: t.muted, fontSize: 24, fontFamily: t.font } }),
      series: ss.map((s: any, i: number) => ({
        type: 'scatter', symbolSize: 22,
        itemStyle: { color: s.color ?? (i === 0 ? t.accent : '#4A4A52'), opacity: i === 0 ? 0.85 : 0.7 },
        data: s.data,
      })),
    }
  }

  if (kind === 'pie') {
    const pal = PIE_PALETTE(t)
    const data = (p.data ?? DEMO.pie).map((it: any, i: number) => ({
      value: it.value, name: it.name, itemStyle: { color: it.color ?? pal[i % pal.length] },
    }))
    return {
      backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
      series: [{
        type: 'pie', radius: ['38%', '60%'], center: ['46%', '52%'], avoidLabelOverlap: true,
        itemStyle: { borderColor: '#121215', borderWidth: 4 },
        label: { color: t.fg, fontSize: 26, fontFamily: t.font, overflow: 'none', formatter: '{b}  {d}%' },
        labelLine: { lineStyle: { color: t.line } },
        data,
      }],
    }
  }

  if (kind === 'funnel') {
    const pal = FUNNEL_PALETTE(t)
    const data = (p.data ?? DEMO.funnel).map((it: any, i: number) => ({
      value: it.value, name: it.name, itemStyle: { color: it.color ?? pal[i % pal.length] },
    }))
    return {
      backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
      series: [{
        type: 'funnel', left: '10%', right: '10%', top: 70, bottom: 70, minSize: '28%', gap: 6, sort: 'descending',
        label: { position: 'inside', color: '#FFFFFF', fontSize: 26, fontFamily: t.font, formatter: '{b}  {c}' },
        labelLine: { show: false },
        itemStyle: { borderColor: '#121215', borderWidth: 3 },
        data,
      }],
    }
  }

  if (kind === 'radar') {
    const ss = p.series ?? DEMO.radarSeries
    return {
      backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
      radar: {
        center: ['50%', '52%'], radius: '62%', splitNumber: 5,
        indicator: p.indicator ?? DEMO.radarIndicator,
        axisName: { color: t.fg, fontSize: 26, fontFamily: t.font },
        splitLine: { lineStyle: { color: t.line } },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'transparent'] } },
        axisLine: { lineStyle: { color: t.line } },
      },
      series: [{
        type: 'radar', symbolSize: 10,
        data: ss.map((s: any, i: number) => {
          const primary = i === ss.length - 1
          return {
            value: s.value, name: s.name,
            lineStyle: { color: primary ? t.accent : t.muted, width: primary ? 5 : 3, type: primary ? 'solid' : 'dashed' },
            itemStyle: { color: primary ? t.accent : t.muted },
            areaStyle: { color: primary ? 'rgba(200,20,24,0.24)' : 'rgba(156,154,162,0.12)' },
          }
        }),
      }],
    }
  }

  if (kind === 'sankey') {
    const pal = [t.accent, '#8E1D17', t.accent, '#8E1D17', t.accent, '#4A4A52', '#4A4A52', '#2A2A31']
    const nodes = (p.nodes ?? DEMO.sankeyNodes).map((n: any, i: number) => ({
      name: n.name, itemStyle: { color: n.color ?? pal[i % pal.length] },
    }))
    return {
      backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
      series: [{
        type: 'sankey', left: 40, right: 220, top: 30, bottom: 30, nodeWidth: 22, nodeGap: 26,
        label: { color: t.fg, fontSize: 25, fontFamily: t.font },
        lineStyle: { color: 'gradient', opacity: 0.34, curveness: 0.5 },
        emphasis: { disabled: true },
        data: nodes,
        links: p.links ?? DEMO.sankeyLinks,
      }],
    }
  }

  if (kind === 'heatmap') {
    const hours = p.categories ?? DEMO.heatmapX
    const days = p.yCategories ?? DEMO.heatmapY
    let data = p.data
    if (!data) {
      data = []
      DEMO.heatmapRaw.forEach((row, d) => row.forEach((v, hIdx) => (data as any[]).push([hIdx, d, v])))
    }
    const max = data.reduce((m: number, d: any) => Math.max(m, d[2]), 0) || 9
    return {
      backgroundColor: 'transparent', grid: { left: 130, right: 60, top: 40, bottom: 130 },
      textStyle: { fontFamily: t.font }, tooltip: { show: false },
      xAxis: { type: 'category', data: hours, splitArea: { show: false }, axisLine: { lineStyle: { color: t.line } }, axisTick: { show: false }, axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font } },
      yAxis: { type: 'category', data: days, splitArea: { show: false }, axisLine: { lineStyle: { color: t.line } }, axisTick: { show: false }, axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font } },
      visualMap: { min: 0, max, orient: 'horizontal', left: 'center', bottom: 20, itemWidth: 22, itemHeight: 240, textStyle: { color: t.muted, fontSize: 24, fontFamily: t.font }, inRange: { color: ['#17171C', '#5B0F12', t.accent, '#FF6A5C'] } },
      series: [{ type: 'heatmap', data, label: { show: false }, itemStyle: { borderColor: '#08080A', borderWidth: 3 } }],
    }
  }

  return null
}

// deep-merge user `option` over the themed preset: objects merge, arrays replace
function isObj(x: any) {
  return x && typeof x === 'object' && !Array.isArray(x)
}
function deepMerge(base: any, over: any): any {
  if (!isObj(base) || !isObj(over)) return over
  const out: any = { ...base }
  for (const k in over) {
    out[k] = isObj(base[k]) && isObj(over[k]) ? deepMerge(base[k], over[k]) : over[k]
  }
  return out
}

function buildOption() {
  const base = preset(props.type, theme(), props)
  if (props.option) return base ? deepMerge(base, props.option) : props.option
  return base
}

async function render() {
  if (!root.value) return
  // Slidev mounts off-screen slides with 0-size DOM; ECharts can't lay out into
  // 0×0. Bail until the container has a real size — the ResizeObserver re-renders
  // once it does.
  if (!root.value.clientWidth || !root.value.clientHeight) return
  if (!echarts) echarts = await import('echarts')
  const opt = buildOption()
  if (!opt) return
  if (!chart) chart = echarts.init(root.value, null, { renderer: 'svg' })
  chart.setOption(opt, true)
  chart.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', render)
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    ro = new ResizeObserver(() => render())
    ro.observe(root.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', render)
  if (ro) { ro.disconnect(); ro = null }
  if (chart) { chart.dispose(); chart = null }
})

watch(
  () => [props.type, props.categories, props.yCategories, props.series, props.data, props.nodes, props.links, props.indicator, props.option],
  render,
  { deep: true },
)
</script>

<template>
  <div ref="root" class="cd-chart" />
</template>

<style scoped>
.cd-chart {
  width: 100%;
  height: 100%;
}
</style>
