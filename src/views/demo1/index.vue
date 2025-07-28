<template>
  <div class="demo1">
    <DemoMap1 ref="demoMap1" :checkedLayers="checkedLayers" />

    <lh-layer-filter
      v-bind="layerFilterConfigs"
      @changeTabItem="changeTabItem"
      @changeActiveLayer="changeActiveLayer"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineLayerProps } from '@/components/LayerFilter/define'
import DemoMap1 from '@/views/OLMap/DemoMap1.vue'
import * as ENUM from '@/views/OLMap/config/enum'

import { ref, defineEmits, computed } from 'vue'

const checkedKeyId = ref<string>('demo1')
const checkedLayers = ref<string[]>([])

const layerFilterConfigs = computed(() => {
  return defineLayerProps({
    keyId: 'demo1',
    tabItem: {
      icon: 'icon-content-icon-tucengkongzhi',
      label: '图层控制',
      layout: 'horizontal',
      labelPosition: 'outer',
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
          { icon: 'icon-content-icon-shuiweizhan', name: '河道站', id: ENUM.REALTIME_RIVER_STATION },
        ]
      }
    ]
  })
})

const changeTabItem = (keyId: string) => {
  checkedKeyId.value = checkedKeyId.value === keyId ? '' : keyId
}
const changeActiveLayer = (activeLayers: string[]) => {
  console.log('当前选中的图层:', activeLayers)
  checkedLayers.value = [...activeLayers]
}

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