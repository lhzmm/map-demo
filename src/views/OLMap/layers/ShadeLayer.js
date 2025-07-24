/**
 * @Author: dawnx
 * @Date: 2022-07-08
 * @LastEditTime: 2023-12-18
 * @LastEditors: dwanx
 * @Description: 阴影遮罩
 */

import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { fromExtent } from 'ol/geom/Polygon'
import BaseVectorLayer from '@dc/dcmap-simple-ol/layers/base/BaseVectorLayer'
import {
  getAdLevelBySystemAdcd,
  getFeatureTypesByAdLevel,
  getGisDataByWfs,
  getMapAdcdFromSystem,
} from '@dc/dcmap-simple-ol/common/common'
import FilterUtils from '@dc/dcmap-simple-ol/utils/FilterUtils'
import { shadeLayer, geoServerConfig } from '@/views/OLMap/config/layerConfig'
/**
 * 遮罩层
 */
class ShadeLayer {
  changeExtent(map) {
    if (this.feature) {
      map.getView().fit(this.feature.getGeometry().getExtent())
    }
  }

  addLayer(map) {
    if (!this.layer) {
      this.layer = new BaseVectorLayer(shadeLayer)
      this.layer.addLayer(map)
    }
  }

  // geoserver遮罩层加载模式
  async load(map, adcd, needFit) {
    // 加载边界数据
    this.addLayer(map)
    this.layer.clear()
    const mapadcd = getMapAdcdFromSystem(adcd)
    const adLevel = getAdLevelBySystemAdcd(adcd)
    const featureType = getFeatureTypesByAdLevel(adLevel)
    const params = geoServerConfig.wfsParams
    params.typeName = featureType
    const cqlFilter = `admin_div_code=${mapadcd}`
    params.filter = FilterUtils.cqlFilterToFilter(cqlFilter, true)
    const result = await getGisDataByWfs(
      params,
      `${geoServerConfig.url}/ZhejiangAdminDivisionRough/wms`,
    )
    const features = new GeoJSON().readFeatures(result)
    if (features.length > 0) {
      this.feature = features[0]
      if (needFit) {
        map.getView().fit(features[0].getGeometry().getExtent())
      }
    }
    this.handleMask(features)
  }

  // 添加擦除层
  // eslint-disable-next-line class-methods-use-this
  erase(geom) {
    const extent = [-180, -90, 180, 90]
    const polygonRing = fromExtent(extent)
    const featureType = geom.getType()
    if (featureType === 'MultiPolygon') {
      geom.getPolygons().forEach((polygon) => {
        const LinearRings = polygon.getLinearRings()
        LinearRings.forEach((LinearRing) => {
          polygonRing.appendLinearRing(LinearRing)
        })
      })
    } else {
      const LinearRings = geom.getLinearRings()
      LinearRings.forEach((LinearRing) => {
        polygonRing.appendLinearRing(LinearRing)
      })
    }
    return polygonRing
  }

  // 添加掩膜层
  handleMask(fts) {
    const ft = fts[0]
    const coverGeom = this.erase(ft.getGeometry())
    const covertFt = new Feature({ geometry: coverGeom })
    this.layer.getSource().clear()
    this.layer.getSource().addFeature(covertFt)
  }
}

export default ShadeLayer
