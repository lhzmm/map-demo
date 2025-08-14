/**
 * @Author: dawnx
 * @Date: 2024-02-27
 * @LastEditTime: 2025-06-26
 * @LastEditors: dwanx
 * @Description: 等值线面图层-降雨分布图
 */
import GeoJSON from 'ol/format/GeoJSON'
import BaseVectorLayer from '@dc/dcmap-simple-ol/layers/base/BaseVectorLayer'
import { getAfterAuthUrl } from '@dc/dcmap-simple-ol/global/global'
import Axios from 'axios'
import { realTimeRainIsosurfaceLayer, realTimeRainIsosurfaceTextLayer } from '@/views/OLMap/config/layerConfig'
import { getRainfallEquivalentFirstStep, getRainfallEquivalentSecondStep } from '@/views/OLMap/config/layerRequest'

class RainFallLayer extends BaseVectorLayer {
  constructor() {
    super(realTimeRainIsosurfaceLayer)
    this.realTimeRainIsosurfaceTextLayer = new BaseVectorLayer(realTimeRainIsosurfaceTextLayer)
  }

  addLayer(map) {
    this.realTimeRainIsosurfaceTextLayer.addLayer(map)
    super.addLayer(map)
  }

  clear() {
    if (this.realTimeRainIsosurfaceTextLayer.getLayer()) {
      this.realTimeRainIsosurfaceTextLayer.clear()
    }
    super.clear()
  }

  async load(params) {
    const vm = params.getValueByKey('vm')
    const { map } = vm
    // 添加图层
    if (!this.layer) {
      this.addLayer(map)
    }
    // 清空图层
    this.clear()
    // 获取搜索参数
    const searchInfo = params.getValueByKey('searchInfo')
    // console.log(searchInfo)
    if (searchInfo.timeResult?.includes('minute')) {
      console.log('暂无分钟数据等值线面数据')
      return null
    }
    this.resFirst = await getRainfallEquivalentFirstStep(searchInfo)
    if (this.resFirst.rasterId) {
      const searchInfoSecond = {
        adcd: searchInfo.adcd,
        rasterId: this.resFirst.rasterId,
        apiMapType: searchInfo.apiMapType,
        id: searchInfo.id,
      }
      this.resSecond = await getRainfallEquivalentSecondStep(searchInfoSecond)
      if (this.resSecond) {
        const areaUrl = this.resSecond.body.contourPolygon
        Axios.get(getAfterAuthUrl(areaUrl), { }).then((res) => {
          const areaF = new GeoJSON().readFeatures(res.data)
          this.addFeatures(areaF)
        })
        const lineUrl = this.resSecond.body.contourLinestring
        Axios.get(getAfterAuthUrl(lineUrl), { }).then((res) => {
          const lineF = new GeoJSON().readFeatures(res.data)
          this.realTimeRainIsosurfaceTextLayer.addFeatures(lineF)
        })
      }
    } else {
      console.log(`暂无${searchInfo.hour}小时等值线面数据`)
    }
  }

  removeLayer(map) {
    if (this.realTimeRainIsosurfaceTextLayer) {
      this.realTimeRainIsosurfaceTextLayer.removeLayer(map)
    }
    super.removeLayer(map)
  }
}
export default RainFallLayer
