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
import { getRiverList, getRainList, getReservoirList } from '@/views/OLMap/config/layerRequest'

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

// 下级行政区划边界
export const townAdcdLayerConfig = {
  type: LayerTypeEnum.vector,
  id: 'townAdcdLayer',
  zIndex: 10,
  source: { type: SourceTypeEnum.vector },
  style: townAdcdLayerStyle,
}
function townAdcdLayerStyle(feature) {
  const text = feature.get('admin_div_name')
  const style = new Style({
    type: StyleTypeEnum.polygon,
    fill: new Fill({ color: 'rgba(0,0,0,0)' }),
    stroke: new Stroke({
      color: '#00BFFF',
      width: 1,
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
// 水库水情图层
export const reservoirWaterLayer = {
  id: ENUM.REALTIME_RESERVOIR_STATION,
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
  loadFunc: getReservoirList,
  filter: {
    filterFunc(searchInfo, datas) {
      const waterTypeMap = {
        0: ENUM.REALTIME_RESERVOIR_GREEN,
        1: ENUM.REALTIME_RESERVOIR_ORANGE,
        2: ENUM.REALTIME_RESERVOIR_OVER_GREEN,
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
        return ENUM.REALTIME_RAIN0
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
    const text = new Text(textBack(`${properties.stnm}：${properties.drp ?? '--'}mm`))
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

// 等值面数据
export const realTimeRainIsosurfaceLayer = {
  type: LayerTypeEnum.vectorImage,
  id: ENUM.REALTIME_RAIN_ISOSURFACE,
  zIndex: 10,
  source: { type: SourceTypeEnum.vector },
  style: realTimeRainIsosurfaceStyle,
}
// 等值线面配色
function realTimeRainIsosurfaceStyle(feature) {
  const style = new Style({ fill: new Fill({ color: '#A7FDFD66' }) })
  let color = '#A7FDFDB2'
  const { level } = feature.getProperties()

  if (level >= 450) color = '#CB0dF8B2'
  else if (level < 450 && level >= 400) color = '#D22DF9B2'
  else if (level < 400 && level >= 350) color = '#D94AFBB2'
  else if (level < 350 && level >= 300) color = '#E16AFCB2'
  else if (level < 300 && level >= 250) color = '#E98DFFB2'
  else if (level < 250 && level >= 220) color = '#FF0404B2'
  else if (level < 220 && level >= 190) color = '#FE1F1FB2'
  else if (level < 190 && level >= 160) color = '#FC3131B2'
  else if (level < 160 && level >= 130) color = '#FB4C4CB2'
  else if (level < 130 && level >= 100) color = '#FA6565B2'
  else if (level < 100 && level >= 90) color = '#EB5F0bB2'
  else if (level < 90 && level >= 80) color = '#EE6B1CB2'
  else if (level < 80 && level >= 70) color = '#F47D37B2'
  else if (level < 70 && level >= 60) color = '#F88948B2'
  else if (level < 60 && level >= 50) color = '#FC9B61B2'
  else if (level < 50 && level >= 45) color = '#FDDC51B2'
  else if (level < 45 && level >= 40) color = '#FDE066B2'
  else if (level < 40 && level >= 35) color = '#FCE580B2'
  else if (level < 35 && level >= 30) color = '#FBE995B2'
  else if (level < 30 && level >= 25) color = '#FAEEB4B2'
  else if (level < 25 && level >= 22) color = '#50B12DB2'
  else if (level < 22 && level >= 19) color = '#4FC22DB2'
  else if (level < 19 && level >= 16) color = '#4ED42DB2'
  else if (level < 16 && level >= 13) color = '#4CE62DB2'
  else if (level < 13 && level >= 10) color = '#4AFA2DB2'
  else if (level < 10 && level >= 8) color = '#3586FFB2'
  else if (level < 8 && level >= 6) color = '#58AAFFB2'
  else if (level < 6 && level >= 4) color = '#70C4FEB2'
  else if (level < 4 && level >= 2) color = '#86DBFEB2'
  else if (level < 2 && level >= 1) color = '#A7FDFDB2'
  else if (level < 1 && level > 0) color = '#A7FDFDB2'
  else color = '#A7FDFD00'

  style.getFill().setColor(color)
  return style
}
// 等值线数据——用来展示text
export const realTimeRainIsosurfaceTextLayer = {
  type: LayerTypeEnum.vectorImage,
  id: ENUM.REALTIME_RAIN_ISOSURFACE_TEXT,
  zIndex: 15,
  source: { type: SourceTypeEnum.vector },
  style: realTimeRainIsosurfaceTextStyle,
}
function realTimeRainIsosurfaceTextStyle(feature) {
  let width = ''
  const textColor = '#F63E33'
  let color = ''
  const { level } = feature.getProperties()
  let text = ''
  if (level === 450) {
    color = '#CB0dF8'
    text = '450'
    width = 2
  } else if (level === 250) {
    color = '#E98DFF'
    text = '250'
    width = 2
  } else if (level === 100) {
    color = '#FA6565'
    text = '100'
    width = 2
  } else if (level === 50) {
    color = '#FC9B61'
    text = '50'
    width = 2
  } else if (level === 25) {
    color = '#FAEEB4'
    text = '25'
    width = 2
  } else if (level === 10) {
    color = '#4AFA2D'
    text = '10'
    width = 2
  } else {
    color = '#A7FDFD'
  }
  if (level === 10 || level === 25 || level === 50 || level === 100 ||
    level === 250 || level === 450) {
    return new Style({
      stroke: new Stroke({
        color,
        width,
      }),
      text: new Text({
        text,
        font: '16px MicrosoftYaHei-Bold',
        fill: new Fill({ color: textColor }),
      }),
    })
  }
}