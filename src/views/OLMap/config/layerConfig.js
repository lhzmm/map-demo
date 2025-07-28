import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import Text from 'ol/style/Text'
import {
  LayerTypeEnum,
  SourceTypeEnum,
  StyleTypeEnum,
} from '@dc/dcmap-simple-ol/enum/TypeEnum'
import * as ENUM from '@/views/OLMap/config/enum'
import { getRiverList, getRainList } from '@/views/OLMap/config/layerRequest'

// 河道站图标
import riverGreen from '@/assets/mapImg/riverGreen.png'
import riverOrange from '@/assets/mapImg/riverOrange.png'
import riverRed from '@/assets/mapImg/riverRed.png'
import riverBlue from '@/assets/mapImg/riverBlue.png'
// 水库站图标
import reservoirGreen from '@/assets/mapImg/reservoirGreen.png'
import reservoirOrange from '@/assets/mapImg/reservoirOrange.png'

// 雨量站图标
import rain0 from '@/assets/mapImg/rain0.png'
import rain0_10 from '@/assets/mapImg/rain0-10mm.png'
import rain10_25 from '@/assets/mapImg/rain10-25mm.png'
import rain25_50 from '@/assets/mapImg/rain25-50mm.png'
import rain50_100 from '@/assets/mapImg/rain50-100mm.png'
import rain100_250 from '@/assets/mapImg/rain100-250mm.png'
import rain250 from '@/assets/mapImg/rain250mm.png'


const geoServerUrl = 'https://gis.dcyun.com:48475/geoserver'
export const geoServerConfig = {
  url: geoServerUrl,
  wfsParams: {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: '',
    outputformat: 'json',
  },
}

// 本级行政区划边界
export const adcdLayerConfig = {
  type: LayerTypeEnum.vector,
  id: 'rih',
  zIndex: 11,
  source: { type: SourceTypeEnum.vector },
  style: adcdStyle,
}
function adcdStyle(feature) {
  const text = feature.get('admin_div_name')
  const style = new Style({
    type: StyleTypeEnum.polygon,
    fill: new Fill({ color: 'rgba(0,0,0,0)' }),
    stroke: new Stroke({
      color: '#000080',
      width: 4,
    }),
  })
  return style
}

// 遮罩层-陪标用-待删除
export const shadeLayer = {
  id: 'shade',
  type: LayerTypeEnum.vectorImage,
  source: { type: SourceTypeEnum.vector },
  style: {
    type: StyleTypeEnum.polygon,
    fill: { color: '#04307200' },
  },
  zIndex: 5,
}

// 边界图层-雪糕层
export const orgAdcdWmsLayer = {
  id: 'orgadcdWms',
  type: LayerTypeEnum.image,
  source: {
    type: SourceTypeEnum.imagewms,
    url: 'https://gis.dcyun.com:48475/geoserver/ZhejiangAdminDivisionRough/wms',
    params: {
      LAYERS: '',
      VERSION: '1.3.0',
      SRS: 'EPSG:4326',
      STYLES: '',
    },
    crossOrigin: 'anonymous',
  },
  zIndex: 1,
}

// 河道水情图层
export const riverWaterLayer = {
  id: ENUM.REALTIME_RIVER_STATION,
  type: LayerTypeEnum.vector,
  zIndex: 40,
  source: { type: SourceTypeEnum.vector },
  style: realTimeWaterStyle,
  field: {
    id: 'stcd',
    lgtd: 'lgtd',
    lttd: 'lttd',
  },
  searchFunc: realTimeWaterSearchFunc,
  loadFunc: getRiverList,
  filter: {
    filterFunc(searchInfo, datas) {
      const waterTypeMap = {
        0: ENUM.REALTIME_RIVER_GREEN,
        1: ENUM.REALTIME_RIVER_ORANGE,
        2: ENUM.REALTIME_RIVER_RED,
      }
      let tempData = datas.map((element) => ({...element, watertype: waterTypeMap[element.status] }))
      const { filterType } = searchInfo

      if (filterType) {
        tempData = tempData.filter((element) => filterType.includes(element.watertype))
      }
      return tempData
    },
  },
}

function realTimeWaterSearchFunc(vm, searchInfo) {
  let params = {
    [ENUM.REALTIME_RESERVOIR_STATION]: {
      keyword: searchInfo.keyword,
      dscd: searchInfo.adcd,
      apiMapType: searchInfo.apiMapType,
      apiType: '1',
    },
    [ENUM.REALTIME_RIVER_STATION]: {
      keyword: searchInfo.keyword,
      dscd: searchInfo.adcd,
      apiType: '1',
      apiMapType: searchInfo.apiMapType,
    },
    [ENUM.GROUND_WATER]: {
      keyword: searchInfo.keyword,
      dscd: searchInfo.adcd,
      apiType: '1',
      apiMapType: searchInfo.apiMapType,
    },
  }[searchInfo.layerid]

  return params
}
// 水情样式
function realTimeWaterStyle(feature, res) {
  const { properties } = feature.getProperties()
  const styles = []
  let img = {
    [ENUM.REALTIME_RIVER_GREEN]: riverGreen,
    [ENUM.REALTIME_RIVER_ORANGE]: riverOrange,
    [ENUM.REALTIME_RIVER_RED]: riverRed,
    [ENUM.REALTIME_RESERVOIR_GREEN]: reservoirGreen,
    [ENUM.REALTIME_RESERVOIR_ORANGE]: reservoirOrange,
    [ENUM.REALTIME_RESERVOIR_OVER_GREEN]: reservoirOrange,
  }[properties.watertype] || reservoirBlue

  const icon = new Icon({
    src: img,
    scale: 1,
  })
  if (res <= 0.00034332275390625) {
    const text = new Text(textBack(`${properties.stnm}：${properties.z === null ? '--' : properties.z?.toFixed(2)}m`))
    styles.push(new Style({
      image: icon,
      text,
    }))
  } else {
    styles.push(new Style({ image: icon }))
  }
  return styles
}

// 实时雨情图层
export const realTimeRainLayer = {
  id: ENUM.REALTIME_RAIN,
  type: LayerTypeEnum.vector,
  zIndex: 30,
  source: { type: SourceTypeEnum.vector },
  style: realTimeRainStyle,
  field: {
    id: 'stcd',
    lgtd: 'lgtd',
    lttd: 'lttd',
  },
  searchFunc: realTimeRainSearchFunc,
  loadFunc: getRainList,
  filter: {
    filterFunc(searchInfo, datas) {
      const rainTypeMap = (val) => {
        if (val === 0) return ENUM.REALTIME_RAIN0
        if (val > 0 && val < 10) return ENUM.REALTIME_RAIN0_10
        if (val >= 10 && val < 25) return ENUM.REALTIME_RAIN10_25
        if (val >= 25 && val < 50) return ENUM.REALTIME_RAIN25_50
        if (val >= 50 && val < 100) return ENUM.REALTIME_RAIN50_100
        if (val >= 100 && val < 250) return ENUM.REALTIME_RAIN100_250
        if (val >= 250) return ENUM.REALTIME_RAIN250
        return null
      }
      let tempData = datas.map((element) => ({...element, rainType: rainTypeMap(element.drp) }))
      const { rainLegendChecked } = searchInfo

      if (rainLegendChecked) {
        tempData = tempData.filter((element) => rainLegendChecked.includes(element.rainType))
      }
      return tempData
    }
  }
}
function realTimeRainSearchFunc(vm, searchInfo) {
  return {
    stnm: searchInfo.stnm,
    adcd: searchInfo.adcd,
    endDate: searchInfo.endDate,
    startDate: searchInfo.startDate,
    rainStationType: searchInfo.rainStationType,
  }
}
// 雨情样式
function realTimeRainStyle(feature, res) {
  const { properties } = feature.getProperties()
  const styles = []
  let img = {
    [ENUM.REALTIME_RAIN0]: rain0,
    [ENUM.REALTIME_RAIN0_10]: rain0_10,
    [ENUM.REALTIME_RAIN10_25]: rain10_25,
    [ENUM.REALTIME_RAIN25_50]: rain25_50,
    [ENUM.REALTIME_RAIN50_100]: rain50_100,
    [ENUM.REALTIME_RAIN100_250]: rain100_250,
    [ENUM.REALTIME_RAIN250]: rain250,
  }[properties.rainType] || rain0

  const icon = new Icon({
    src: img,
    scale: 1,
  })

  if (res <= 0.00034332275390625) {
    const text = new Text(textBack(`${properties.stnm}：${properties.rainType}mm`))
    styles.push(new Style({
      image: icon,
      text,
    }))
  } else {
    styles.push(new Style({ image: icon }))
  }
  
  return styles
}

// 文字背景方法抽取处理-测站值
function textBack(name, isClick, offX, offY) {
  let offSetX = 20
  let offSetY = -30
  if (offX) offSetX = offX
  if (offY) offSetY = offY
  let backFillColor = '#0cBD6F'
  if (isClick) { backFillColor = '#DC143CB2' }
  return {
    text: `${(name)}`,
    font: '14px MicrosoftYaHei-Bold',
    fill: new Fill({ color: '#fff' }),
    offsetY: offSetY,
    offsetX: offSetX,
    textAlign: 'center',
    // 标签的背景填充
    backgroundStroke: new Stroke({
      color: '#D4EAC4',
      width: 1,
    }),
    backgroundFill: new Fill({ color: backFillColor }),
    padding: [5, 5, 5, 5],
  }
}