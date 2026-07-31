<script setup lang="ts">
/**
 * CDChart — crimson-themed ECharts wrapper.
 *
 * Ships eight ready-made charts matching the deck design; pass `type` to pick
 * one, or pass a full ECharts `option` to render your own data:
 *   <CDChart type="bar" />
 *   <CDChart :option="myOption" />
 *
 * The host element must have a height (the chart fills 100% of its parent).
 */
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ type?: string; option?: any }>(), {
  type: 'bar',
})

const root = ref<HTMLElement | null>(null)
let echarts: any = null
let chart: any = null

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

function preset(kind: string, t: any): any {
  const axisBase = {
    axisLine: { lineStyle: { color: t.line } },
    axisTick: { show: false },
    axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font },
    splitLine: { lineStyle: { color: t.line, type: 'dashed' } },
  }
  const legend = { textStyle: { color: t.muted, fontSize: 24, fontFamily: t.font }, itemGap: 32, top: 0, right: 0 }

  if (kind === 'bar') return {
    backgroundColor: 'transparent', grid: { left: 90, right: 40, top: 80, bottom: 70 },
    legend, textStyle: { fontFamily: t.font }, tooltip: { show: false },
    xAxis: Object.assign({}, axisBase, { type: 'category', data: ['订单 GMV', '流量归因', '库存快照', '财务对账'], splitLine: { show: false } }),
    yAxis: Object.assign({}, axisBase, { type: 'value' }),
    series: [
      { name: '迁移前', type: 'bar', barWidth: 54, data: [4980, 4340, 2480, 1310], itemStyle: { color: '#2A2A31' }, label: { show: true, position: 'top', color: t.muted, fontSize: 24, fontFamily: t.font } },
      { name: '迁移后', type: 'bar', barWidth: 54, data: [1840, 2260, 720, 1150], itemStyle: { color: t.accent }, label: { show: true, position: 'top', color: t.fg, fontSize: 24, fontFamily: t.font } },
    ],
  }

  if (kind === 'pie') return {
    backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
    series: [{
      type: 'pie', radius: ['38%', '60%'], center: ['46%', '52%'], avoidLabelOverlap: true,
      itemStyle: { borderColor: '#121215', borderWidth: 4 },
      label: { color: t.fg, fontSize: 26, fontFamily: t.font, overflow: 'none', formatter: '{b}  {d}%' },
      labelLine: { lineStyle: { color: t.line } },
      data: [
        { value: 42, name: '存储', itemStyle: { color: t.accent } },
        { value: 27, name: '计算', itemStyle: { color: '#8E1D17' } },
        { value: 18, name: '流式集群', itemStyle: { color: '#4A4A52' } },
        { value: 13, name: '其他', itemStyle: { color: '#2A2A31' } },
      ],
    }],
  }

  if (kind === 'line') return {
    backgroundColor: 'transparent', grid: { left: 90, right: 60, top: 80, bottom: 70 },
    legend, textStyle: { fontFamily: t.font }, tooltip: { show: false },
    xAxis: Object.assign({}, axisBase, { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'], splitLine: { show: false } }),
    yAxis: Object.assign({}, axisBase, { type: 'value' }),
    series: [
      { name: 'P95 延迟 (h)', type: 'line', smooth: true, symbolSize: 12, lineStyle: { width: 5, color: t.accent }, itemStyle: { color: t.accent }, areaStyle: { color: 'rgba(200,20,24,0.14)' }, data: [18, 16.4, 13.1, 10.2, 8.4, 7.1, 6.7] },
      { name: 'P1 故障数', type: 'line', smooth: true, symbolSize: 12, lineStyle: { width: 3, color: t.muted, type: 'dashed' }, itemStyle: { color: t.muted }, data: [6, 5, 4, 2, 1, 0, 0] },
    ],
  }

  if (kind === 'scatter') return {
    backgroundColor: 'transparent', grid: { left: 120, right: 70, top: 80, bottom: 130 },
    textStyle: { fontFamily: t.font }, tooltip: { show: false },
    xAxis: Object.assign({}, axisBase, { type: 'value', name: '日处理量 (TB)', nameLocation: 'middle', nameGap: 56, nameTextStyle: { color: t.muted, fontSize: 24, fontFamily: t.font } }),
    yAxis: Object.assign({}, axisBase, { type: 'value', name: 'P95 延迟 (min)', nameLocation: 'middle', nameGap: 84, nameTextStyle: { color: t.muted, fontSize: 24, fontFamily: t.font } }),
    series: [
      { type: 'scatter', symbolSize: 22, itemStyle: { color: t.accent, opacity: 0.85 }, data: [[1.2, 14], [2.1, 18], [3.4, 16], [4.8, 22], [5.2, 19], [6.7, 26], [7.9, 24], [9.1, 31], [10.4, 28], [12.2, 33], [13.8, 30], [15.1, 36], [17.4, 34], [19.2, 38]] },
      { type: 'scatter', symbolSize: 22, itemStyle: { color: '#4A4A52', opacity: 0.7 }, data: [[2.4, 62], [4.1, 74], [6.2, 88], [8.4, 104], [11.2, 121], [14.6, 138], [18.1, 152]] },
    ],
  }

  if (kind === 'radar') return {
    backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
    radar: {
      center: ['50%', '52%'], radius: '62%', splitNumber: 5,
      indicator: [
        { name: '新鲜度', max: 5 }, { name: '可观测性', max: 5 }, { name: '成本效率', max: 5 },
        { name: '口径一致', max: 5 }, { name: '自助能力', max: 5 }, { name: '稳定性', max: 5 },
      ],
      axisName: { color: t.fg, fontSize: 26, fontFamily: t.font },
      splitLine: { lineStyle: { color: t.line } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'transparent'] } },
      axisLine: { lineStyle: { color: t.line } },
    },
    series: [{
      type: 'radar', symbolSize: 10,
      data: [
        { value: [2, 2, 3, 1, 2, 3], name: '2026.01', lineStyle: { color: t.muted, width: 3, type: 'dashed' }, itemStyle: { color: t.muted }, areaStyle: { color: 'rgba(156,154,162,0.12)' } },
        { value: [4.5, 4, 4, 4.5, 4, 4.5], name: '2026.07', lineStyle: { color: t.accent, width: 5 }, itemStyle: { color: t.accent }, areaStyle: { color: 'rgba(200,20,24,0.24)' } },
      ],
    }],
  }

  if (kind === 'sankey') return {
    backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
    series: [{
      type: 'sankey', left: 40, right: 220, top: 30, bottom: 30, nodeWidth: 22, nodeGap: 26,
      label: { color: t.fg, fontSize: 25, fontFamily: t.font },
      lineStyle: { color: 'gradient', opacity: 0.34, curveness: 0.5 },
      emphasis: { disabled: true },
      data: [
        { name: '业务库 CDC', itemStyle: { color: t.accent } },
        { name: '日志埋点', itemStyle: { color: '#8E1D17' } },
        { name: 'Kafka 接入层', itemStyle: { color: t.accent } },
        { name: '明细层 DWD', itemStyle: { color: '#8E1D17' } },
        { name: '汇总层 DWS', itemStyle: { color: t.accent } },
        { name: 'BI 看板', itemStyle: { color: '#4A4A52' } },
        { name: '实时告警', itemStyle: { color: '#4A4A52' } },
        { name: '归档冷存', itemStyle: { color: '#2A2A31' } },
      ],
      links: [
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
    }],
  }

  if (kind === 'funnel') return {
    backgroundColor: 'transparent', textStyle: { fontFamily: t.font }, tooltip: { show: false },
    series: [{
      type: 'funnel', left: '10%', right: '10%', top: 70, bottom: 70, minSize: '28%', gap: 6, sort: 'descending',
      label: { position: 'inside', color: '#FFFFFF', fontSize: 26, fontFamily: t.font, formatter: '{b}  {c}' },
      labelLine: { show: false },
      itemStyle: { borderColor: '#121215', borderWidth: 3 },
      data: [
        { value: 86, name: '咨询接入', itemStyle: { color: '#4A0B0E' } },
        { value: 64, name: '完成评估', itemStyle: { color: '#7A0F12' } },
        { value: 48, name: '提交定义', itemStyle: { color: '#A8151A' } },
        { value: 37, name: '完成改造', itemStyle: { color: t.accent } },
        { value: 31, name: '上线运行', itemStyle: { color: '#D8262B' } },
      ],
    }],
  }

  if (kind === 'heatmap') {
    const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const raw = [
      [2, 1, 0, 3, 9, 8, 4, 3, 2, 4, 3, 1],
      [1, 0, 1, 2, 6, 5, 3, 2, 2, 3, 2, 1],
      [1, 1, 0, 2, 5, 4, 3, 3, 1, 2, 2, 0],
      [0, 1, 1, 2, 4, 6, 3, 2, 2, 3, 1, 1],
      [1, 0, 1, 3, 5, 7, 4, 4, 3, 5, 4, 2],
      [0, 0, 0, 1, 2, 3, 2, 1, 1, 2, 1, 0],
      [0, 1, 0, 1, 2, 2, 1, 1, 0, 1, 1, 0],
    ]
    const data: any[] = []
    raw.forEach((row, d) => row.forEach((v, hIdx) => data.push([hIdx, d, v])))
    return {
      backgroundColor: 'transparent', grid: { left: 130, right: 60, top: 40, bottom: 130 },
      textStyle: { fontFamily: t.font }, tooltip: { show: false },
      xAxis: { type: 'category', data: hours, splitArea: { show: false }, axisLine: { lineStyle: { color: t.line } }, axisTick: { show: false }, axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font } },
      yAxis: { type: 'category', data: days, splitArea: { show: false }, axisLine: { lineStyle: { color: t.line } }, axisTick: { show: false }, axisLabel: { color: t.muted, fontSize: 24, fontFamily: t.font } },
      visualMap: { min: 0, max: 9, orient: 'horizontal', left: 'center', bottom: 20, itemWidth: 22, itemHeight: 240, textStyle: { color: t.muted, fontSize: 24, fontFamily: t.font }, inRange: { color: ['#17171C', '#5B0F12', t.accent, '#FF6A5C'] } },
      series: [{ type: 'heatmap', data, label: { show: false }, itemStyle: { borderColor: '#08080A', borderWidth: 3 } }],
    }
  }

  return null
}

async function render() {
  if (!root.value) return
  if (!echarts) echarts = await import('echarts')
  const opt = props.option ?? preset(props.type, theme())
  if (!opt) return
  if (!chart) chart = echarts.init(root.value, null, { renderer: 'svg' })
  chart.setOption(opt, true)
  chart.resize()
}

function onResize() {
  if (chart) chart.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (chart) { chart.dispose(); chart = null }
})

watch(() => [props.type, props.option], render, { deep: true })
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
