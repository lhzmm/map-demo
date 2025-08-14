<template>
  <div class="demo1">
    <DemoMap1 ref="demoMap1" :checkedLayers="checkedLayers" :checkLegendList="checkLegendList" />

    <lh-layer-filter
      v-bind="layerFilterConfigs"
      @changeTabItem="changeTabItem"
      @changeActiveLayer="changeActiveLayer"
    />

    <MapLegends
      v-if="currentShowLegend===ENUM.REALTIME_RAIN"
      :check-legend-list="checkLegendList"
      class="MapLegends"
      :legend-list="legendListConfigs"
      @changeCheckList="checkLegendListChange"
    />
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

import { ref, defineEmits, computed, onMounted } from 'vue'

const checkedKeyId = ref<string>('demo1')
const checkedLayers = ref<string[]>([])
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

const layerFilterConfigs = computed(() => {
  return defineLayerProps({
    keyId: 'demo1',
    tabItem: {
      icon: 'icon-content-icon-tucengkongzhi',
      label: '图层控制',
      layout: 'horizontal',
    },
    checked: checkedKeyId.value === 'demo1',
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

const currentShowLegend = computed(() => {
  const arr = checkedLayers.value
  return arr.length > 0 ? arr[arr.length - 1] : null
})

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

const changeTabItem = (keyId: string) => {
  checkedKeyId.value = checkedKeyId.value === keyId ? '' : keyId
}
const changeActiveLayer = (activeLayers: string[]) => {
  console.log('当前选中的图层:', activeLayers)
  checkedLayers.value = [...activeLayers]
}

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
}
</style>