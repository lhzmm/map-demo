<template>
  <div class="general-pop" ref="generalPop">
    <div class="label">{{ detail.stnm || '--' }}：</div>
    <div class="value">{{ detail.z || detail.z === 0 ? detail.z.toFixed(2) : "--" }}m</div>
  </div>
</template>

<script setup lang="ts">
import OverlayFactory from '@dc/dcmap-simple-ol/factory/OverlayFactory'
import { onMounted, ref, defineProps, watch } from 'vue'

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