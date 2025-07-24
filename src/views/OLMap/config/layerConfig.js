import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import {
  LayerTypeEnum,
  SourceTypeEnum,
  StyleTypeEnum,
} from '@dc/dcmap-simple-ol/enum/TypeEnum'
import * as ENUM from '@/views/OLMap/config/enum'
import { getRiverList } from '@/views/OLMap/config/layerRequest'

// 河道站图标
import riverGreen from '@/assets/mapImg/riverGreen.png'
import riverOrange from '@/assets/mapImg/riverOrange.png'
import riverRed from '@/assets/mapImg/riverRed.png'
import riverBlue from '@/assets/mapImg/riverBlue.png'
// 水库站图标
import reservoirGreen from '@/assets/mapImg/reservoirGreen.png'
import reservoirOrange from '@/assets/mapImg/reservoirOrange.png'


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
      datas.forEach((element) => {
        const { status } = element
        if (status === 0 || status === '0') {
          element.watertype = ENUM.REALTIME_RIVER_GREEN
        } else if (status === 1 || status === '1') {
          element.watertype = ENUM.REALTIME_RIVER_ORANGE
        } else if (status === 2 || status === '2') {
          element.watertype = ENUM.REALTIME_RIVER_RED
        }
      })
      const { filterType } = searchInfo

      if (filterType) {
        datas = datas.filter((element) => filterType.includes(element.watertype))
      }
      return datas
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
  let img = reservoirGreen

  switch (properties.watertype) {
    case ENUM.REALTIME_RIVER_GREEN:
      img = riverGreen
      break
    case ENUM.REALTIME_RIVER_ORANGE:
      img = riverOrange
      break
    case ENUM.REALTIME_RIVER_RED:
      img = riverRed
      break
    case ENUM.REALTIME_RESERVOIR_GREEN:
      img = reservoirGreen
      break
    case ENUM.REALTIME_RESERVOIR_ORANGE:
      img = reservoirOrange
      break
    case ENUM.REALTIME_RESERVOIR_OVER_GREEN:
      img = reservoirOrange
      break 
    default:
      img = reservoirBlue
      break
  }

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