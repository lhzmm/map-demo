<template>
  <div class="demo1">
    <DemoMap1 ref="demoMap1" :checkedLayers="checkedLayers" :checkLegendList="checkLegendList" :mapTimeParams="mapTimeParams" />

    <lh-layer-filter
      v-bind="layerFilterConfigs"
      @changeTabItem="changeTabItem"
      @changeActiveLayer="changeActiveLayer"
    />
    <lh-layer-filter
      class="time-filter"
      v-bind="timeFilterConfigs"
      @changeActiveLayer="changeActiveTime"
    />

    <MapLegends
      v-if="lastLayerChecked===ENUM.REALTIME_RAIN"
      :check-legend-list="checkLegendList"
      class="MapLegends"
      :legend-list="legendListConfigs"
      @changeCheckList="checkLegendListChange"
    />
    <RainAreaLegend v-if="lastLayerChecked===ENUM.REALTIME_RAIN_ISOSURFACE" />
  </div>
</template>

<script lang="ts" setup>
import rain0 from '@/assets/mapImg/rain0.png'
import rain0_10 from '@/assets/mapImg/rain0-10mm.png'
import rain10_25 from '@/assets/mapImg/rain10-25mm.png'
import rain25_50 from '@/assets/mapImg/rain25-50mm.png'
import rain50_100 from '@/assets/mapImg/rain50-100mm.png'
import rain100_250 from '@/assets/mapImg/rain100-250mm.png'
import rain250 from '@/assets/mapImg/rain250mm.png'
import { defineLayerProps } from '@/components/LayerFilter/define'
import DemoMap1 from '@/views/OLMap/DemoMap1.vue'
import * as ENUM from '@/views/OLMap/config/enum'
import MapLegends from './MapLegends.vue'
import RainAreaLegend from './RainAreaLegend.vue'
import dayjs from 'dayjs'
import type { MapTimeParams } from '@/utils/define'

import { ref, defineEmits, computed, onMounted } from 'vue'

const LAYERS_CONFIGS_KEY_ID = 'layersConfigsKeyId'
const CUSTOM_DATETIME = 'hourCustomDateTime'

const checkedKeyId = ref<string>(LAYERS_CONFIGS_KEY_ID)
const checkedLayers = ref<string[]>([])
const lastLayerChecked = ref<string>('')
const countInfo = ref<any>({
  count0: 0,
  count10: 0,
  count25: 0,
  count50: 0,
  count100: 0,
  count250: 0,
  countThan250: 0,
})
const checkLegendList = ref<string[]>([])

// 图层相关配置及逻辑
const layerFilterConfigs = computed(() => {
  return defineLayerProps({
    keyId: LAYERS_CONFIGS_KEY_ID,
    tabItem: {
      icon: 'icon-content-icon-tucengkongzhi',
      label: '图层控制',
      layout: 'horizontal',
    },
    checked: checkedKeyId.value === LAYERS_CONFIGS_KEY_ID,
    placement: 'bottom',
    title: '图层控制',
    activeLayer: checkedLayers.value,
    layerConfig: [
      {
        title: '监测图层',
        children: [
          { icon: 'icon-content-icon-yulaingzhan', name: '雨量站', id: ENUM.REALTIME_RAIN },
          { icon: 'icon-content-icon-yanchengshuiwei', name: '降雨等值面', id: ENUM.REALTIME_RAIN_ISOSURFACE },
          { icon: 'icon-content-icon-shuiweizhan', name: '河道站', id: ENUM.REALTIME_RIVER_STATION },
          { icon: 'icon-content-icon-shuikuzhan', name: '水库站', id: ENUM.REALTIME_RESERVOIR_STATION },
        ]
      }
    ],
    isMultiple: false,
  })
})
const changeTabItem = (keyId: string) => {
  checkedKeyId.value = checkedKeyId.value === keyId ? '' : keyId
  if (!checkedKeyId.value) {

  }
}
const changeActiveLayer = (activeLayers: string[]) => {
  console.log('当前选中的图层:', activeLayers)
  const lastLayer = [...activeLayers].pop() || ''
  if (lastLayer === ENUM.REALTIME_RAIN_ISOSURFACE) {
    changeActiveTime(['24,hour'])
  }
  checkedLayers.value = [...activeLayers]
  lastLayerChecked.value = lastLayer
}

// 时间筛选相关配置及逻辑
const customTimeRange = ref<string[]>([])
const mapTimeParams = ref<MapTimeParams>({
  startDate: dayjs().subtract(24, 'hour').format('YYYY-MM-DD HH:mm:00'),
  endDate: dayjs().format('YYYY-MM-DD HH:mm:00'),
  timeId: '24,hour'
})
const checkedTime = ref<(string | number)[]>(['24,hour'])
const timeFilterConfigs = computed(() => {
  // 没有图层选中
  if (!lastLayerChecked.value) return {}
  // 选中图层没有二级选择
  if (![ENUM.REALTIME_RAIN, ENUM.REALTIME_RAIN_ISOSURFACE].includes(lastLayerChecked.value)) return {}

  const layerConfig = [
    {
      title: '小时统计',
      children: [
        { name: '前1小时', id: '1,hour' },
        { name: '前3小时', id: '3,hour' },
        { name: '前6小时', id: '6,hour' },
        { name: '前12小时', id: '12,hour' },
        { name: '前24小时', id: '24,hour' },
        { name: '前48小时', id: '48,hour' },
      ]
    }
  ]
  if (lastLayerChecked.value === ENUM.REALTIME_RAIN) {
    layerConfig.unshift({
        title: '分钟统计',
        children: [
          { name: '近15分钟', id: '15,minute' },
          { name: '近30分钟', id: '30,minute' },
          { name: '近60分钟', id: '60,minute' },
          { name: '近120分钟', id: '120,minute' },
          { name: '近180分钟', id: '180,minute' },
        ]
      })
  }
  return defineLayerProps({
    keyId: 'time',
    tabItem: {
      icon: 'icon-content-btn-riqi',
      label: '时间筛选',
      layout: 'horizontal',
      customRender: () => '', // 不需要头部
    },
    checked: checkedKeyId.value === LAYERS_CONFIGS_KEY_ID, // 与图层同步展示或隐藏
    placement: 'bottom',
    title: '时间筛选',
    activeLayer: checkedTime.value,
    layerConfig,
    isMultiple: false,
  })
})
const getTime = (val: string):MapTimeParams => {
  let result = []
  if ([CUSTOM_DATETIME].includes(val)) {
    result = [...customTimeRange.value]
  } else {
    const [amount, unit] = val.split(',')
    const start = dayjs().subtract(Number(amount), unit as dayjs.ManipulateType)
    result = [
      start.format('YYYY-MM-DD HH:mm'),
      dayjs().format('YYYY-MM-DD HH:mm'),
    ]
  }
  const [startDate, endDate] = result
  return {
    startDate,
    endDate,
    timeId: val,
  }
}
const changeActiveTime = (activeTime: string[]) => {
  if (!activeTime.length) return
  checkedTime.value = [...activeTime]
  mapTimeParams.value = getTime(activeTime[0])
}

// 图例相关配置及逻辑
const legendListConfigs = computed(() => {
  return [
        {
          img: rain0,
          label: '0',
          count: countInfo.value.count0 ?? '--',
          value: ENUM.REALTIME_RAIN0,
        },
        {
          img: rain0_10,
          label: '0-10',
          count: countInfo.value.count10 ?? '--',
          value: ENUM.REALTIME_RAIN0_10,
        },
        {
          img: rain10_25,
          label: '10-25',
          count: countInfo.value.count25 ?? '--',
          value: ENUM.REALTIME_RAIN10_25,
        },
        {
          img: rain25_50,
          label: '25-50',
          count: countInfo.value.count50 ?? '--',
          value: ENUM.REALTIME_RAIN25_50,
        },
        {
          img: rain50_100,
          label: '50-100',
          count: countInfo.value.count100 ?? '--',
          value: ENUM.REALTIME_RAIN50_100,
        },
        {
          img: rain100_250,
          label: '100-250',
          count: countInfo.value.count250 ?? '--',
          value: ENUM.REALTIME_RAIN100_250,
        },
        {
          img: rain250,
          label: '≥250',
          count: countInfo.value.countThan250 ?? '--',
          value: ENUM.REALTIME_RAIN250,
        },
  ]
})
const checkLegendListChange = (list: string[]) => {
  checkLegendList.value = [...list]
  console.log('当前选中的图例:', list)
}

onMounted(() => {
  checkLegendList.value = [...legendListConfigs.value.map(item => item.value)]
})
</script>

<style lang="less" scoped>
.demo1 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dc-layer{
  position: absolute;
  top: 60px;
  left: 60px;
  &.time-filter{
    top: 98px;
    left: 315px;
  }
}
</style>