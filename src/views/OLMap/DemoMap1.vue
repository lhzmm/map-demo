<template>
  <div class="demo-map1">
    <div id="demoMap" ref="demoMap">
      <GeneralPop v-for="item in pops" :key="item.layerid + item.fid" :detail="item" :map="map" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapFactory from '@dc/dcmap-simple-ol/factory/MapFactory'
import mapConfig from '@dc/dcmap-simple-ol/config/mapConfig'
import LayerParams from '@dc/dcmap-simple-ol/common/LayerParams'
import { createToken } from '@dc/dcmap-simple-ol/global/global'
import LayerSwitch from '@/views/OLMap/layers/LayerSwitch'
import AdcdLayer from '@/views/OLMap/layers/AdcdLayer'
import ShadeLayer from '@/views/OLMap/layers/ShadeLayer'
import OrgAdcdWmsLayer from '@/views/OLMap/layers/OrgAdcdWmsLayer'
import TownAdcdLayer from '@/views/OLMap/layers/TownAdcdLayer'
import * as ENUM from '@/views/OLMap/config/enum'
import TZMergeLayer from '@/views/OLMap/impl/TZMergeLayer'
import { riverWaterLayer, realTimeRainLayer, reservoirWaterLayer } from '@/views/OLMap/config/layerConfig'
import GeneralPop from '@/views/OLMap/components/GeneralPop.vue'
import { ref, onMounted, defineEmits, defineProps, reactive, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  checkedLayers: {
    type: Array,
    default: () => ([])
  },
  checkLegendList: {
    type: Array,
    default: () => ([])
  },
})
const emits = defineEmits(['showMore'])

let map: any = null
let layers: any = {}
const demoMap = ref<HTMLDivElement | null>(null)
const zoom = ref<number>(8)
let pops = reactive<any[]>([]) // 弹窗数据
const prevLoadLayers = ref<string[]>([]) // 上一次加载图层
const currentLoadLayers = ref<string[]>([]) // 当前加载的图层
const adcd = ref<string>('330111')

const clickLayers = ref<string[]>([
  ENUM.REALTIME_RAIN,
  ENUM.REALTIME_RIVER_STATION,
  ENUM.REALTIME_RESERVOIR_STATION,
])
const mouseoverLayers = ref<string[]>([
  ENUM.REALTIME_RAIN,
  ENUM.REALTIME_RIVER_STATION,
  ENUM.REALTIME_RESERVOIR_STATION,
])

// 初始化地图
const initMap = async() => {
  await createToken()
  mapConfig.target = demoMap.value
  map = MapFactory.createMap(mapConfig)

  // 基本配置
  layers = {
    layerSwitch: new LayerSwitch(), // 底图
    shadeLayer: new ShadeLayer(), // 阴影图层
    adcdLayer: new AdcdLayer(), // 行政区划边界图层
    townAdcdLayer: new TownAdcdLayer(), // 镇级行政区划边界图层
    boundary: new OrgAdcdWmsLayer(),

    [ENUM.REALTIME_RAIN]: new TZMergeLayer(realTimeRainLayer),
    [ENUM.REALTIME_RIVER_STATION]: new TZMergeLayer(riverWaterLayer),
    [ENUM.REALTIME_RESERVOIR_STATION]: new TZMergeLayer(reservoirWaterLayer),
  }
  changeLayers(1) // 加载天地图底图
  changeBoundary() // 初始化边界
  initClick() // 添加点击事件
  initMouseOver() // 添加鼠标经过事件
  map.getView().on('change:resolution', checkZoom) // 添加获取层级方法

  // initLayers([ENUM.REALTIME_RAIN]) // 初始化图层

}

const initLayers = (layers: Array<string>) => {
  function findArrayDiff(newArr: Array<string>, oldArr: Array<string>) {
    const newSet = new Set(newArr);
    const oldSet = new Set(oldArr);
    // 新数组有而老数组没有的项（新增项）
    const added = newArr.filter(item => !oldSet.has(item));
    // 老数组有而新数组没有的项（删除项）
    const removed = oldArr.filter(item => !newSet.has(item));
    return { added, removed }
  }
  const tempLayers = [...layers]
  const {added, removed} = findArrayDiff(tempLayers, prevLoadLayers.value)
  loadLayersVisible(removed, false) // 删除图层
  loadLayersVisible(added, true) // 新增图层

  prevLoadLayers.value = [...tempLayers] // 更新上一次加载的图层
  currentLoadLayers.value = [...tempLayers] // 更新当前加载的图层
}
// 加载图层数据可见性
const loadLayersVisible = (layerIds: Array<string>, visible: Boolean = false) => {
  if (visible) {
    layerIds.forEach((layerId: string) => {
      if (!layers[layerId]) {
        console.warn(`图层 ${layerId} 不存在`)
        return
      }
      layers[layerId].load(new LayerParams({
        vm: { map, pops: pops },
        layerid: layerId,
        searchInfo: {
          adcd: adcd.value,
          layerId,
          keyword: '',
          endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          stnm: '',
          rainStationType: '',
        }
      }))
    })
  } else {
    layerIds.forEach((layerId: string) => {
      layers[layerId]?.removeLayer(map)
    })
  }
}
// 添加获取层级方法
const checkZoom = () => {
  zoom.value = map.getView().getZoom()
}
// 初始化点击事件
const initClick = () => {
  const handleClick = (evt: any) => {
    clearPop()
    let layerId:string | undefined
    const {coordinate: coord, pixel} = evt

    const clickLayer = clickLayers.value

    const clickFeature = map.forEachFeatureAtPixel(pixel, (feature:any, layer:any) => {
      if (!layer) return undefined
      if (clickLayer.indexOf(layer.get('id')) !== -1) { // 点击的元素是当前图层中需要点击事件的元素
        layerId = layer.get('id')
        return feature
      }
      return undefined
    })

    if (clickFeature) {
      let features = clickFeature.get('features') || [clickFeature]
      if (features.length > 1) {
        map.getView().setZoom(map.getView().getZoom() + 1)
        map.getView().setCenter(coord)
        return
      }
      if (clickLayers.value.includes(layerId)) {
        console.log(`点击图层 ${layerId}`,features[0].get('properties'), 998)
        emits('showMore', features[0].get('properties'))
      }
    }
  }
  map.on('click', handleClick)
}
// 初始化鼠标经过事件
const initMouseOver = () => {
  const handleMouseOver = (evt: any) => {
    clearPop()
    map.getTargetElement().style.cursor = 'auto'
    let layerId:string | undefined
    const {coordinate: coord, pixel} = evt
    const clickLayer = mouseoverLayers.value
    const clickFeature = map.forEachFeatureAtPixel(pixel, (feature: any, layer:any) => {
      if (!layer) return undefined
      if (clickLayer.indexOf(layer.get('id')) !== -1) { // 鼠标经过的元素是当前图层中需要点击事件的元素
        layerId = layer.get('id')
        return feature
      }
      return undefined
    })
    if (clickFeature) {
      let features = clickFeature.get('features') || [clickFeature]
      if (features.length > 1) {
        map.getView().setZoom(map.getView().getZoom() + 1)
        map.getView().setCenter(coord)
        return
      }
      if (zoom.value < 12) { // 表示有元素选中
        layers[layerId]?.mouseover(new LayerParams({
          vm: { map, pops: pops },
          layerid: layerId,
          feature: clickFeature,
          coord,
        }))
      }
    }
  }
  map.on('pointermove', handleMouseOver)
}
// 底图切换
const changeLayers = (val:number|string) => {
  layers.layerSwitch.changeLayers(val, map)
}
// 边界改变
const changeBoundary = () => {
  layers.shadeLayer.load(map, adcd.value, true)
  layers.adcdLayer.load(map, adcd.value)
  layers.townAdcdLayer.load(map, adcd.value)
}
// 清楚弹窗
const clearPop = () => {
  pops.splice(0, pops.length) // 清空弹窗数据
}

// 监听图层变化
watch(() => props.checkedLayers as string[], (newVal: string[]) => {
  initLayers(newVal)
}, { immediate: true })
// 监听图例筛选变化
watch(() => props.checkLegendList as string[], (newVal: string[]) => {
  const currentLayer: string = props.checkedLayers.length ? String(props.checkedLayers[props.checkedLayers.length - 1]) : ''
  layers[currentLayer]?.legendChange({rainLegendChecked: newVal })
}, { immediate: true })

onMounted(() => {
  if (demoMap.value) {
    initMap()
  }
})
</script>

<style lang="less" scoped>
.demo-map1{
  height: 100%;
  width: 100%;
  position: relative;
  #demoMap {
    width: 100%;
    height: 100%;
  }
}
</style>