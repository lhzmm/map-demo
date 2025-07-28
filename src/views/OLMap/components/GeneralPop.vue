<template>
  <div class="general-pop" ref="generalPop">
    <div class="label">{{ detail.stnm || '--' }}：</div>
    <div class="value">{{ popShowInfo.value }}{{popShowInfo.unit}}</div>
  </div>
</template>

<script setup lang="ts">
import OverlayFactory from '@dc/dcmap-simple-ol/factory/OverlayFactory'
import { onMounted, ref, defineProps, watch, computed } from 'vue'
import * as ENUM from '@/views/OLMap/config/enum'

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({})
  },
  map: {
    type: Object,
    default: null
  }
})
const generalPop = ref<HTMLElement | null>(null)
const generalPopConfig = {
  element: generalPop.value,
  autoPan: false,
  stopEvent: false,
  positioning: 'bottom-left',
}
let mouseoverPopOverlay: any = null

function initOverlay() {
  // 鼠标经过弹窗
  generalPopConfig.element = generalPop.value;
  mouseoverPopOverlay = OverlayFactory.createOverlay(generalPopConfig);
  props.map.addOverlay(mouseoverPopOverlay);
  mouseoverPopOverlay.setPosition(undefined);
}

const popShowInfo = computed(() => {
  const { layerid } = props.detail
  if (!layerid) return '--'
  let value = null
  let fixed = 1
  let unit = 'm'
  switch (layerid) {
    case ENUM.REALTIME_RAIN:
      value = props.detail.drp
      unit = 'mm'
      break
    case ENUM.REALTIME_RIVER_STATION:
      value = props.detail.z
      fixed = 2
      break
    default:
      value = null
  }
  return {
    value: (value || value === 0) ? value.toFixed(fixed) : "--",
    unit
  }
})

onMounted(() => {
  initOverlay()
  if (props.detail && props.detail.lgtd && props.detail.lttd) {
    mouseoverPopOverlay.setPosition([props.detail.lgtd, props.detail.lttd])
  }
});
</script>

<style lang="less" scoped>
.general-pop {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
  padding: 5px;
  background-color: #0cBD6F;
  border: 1PX solid #D4EAC4;
  border-radius: 4px;
  transform: translate(-50%, -16PX);
}
</style>