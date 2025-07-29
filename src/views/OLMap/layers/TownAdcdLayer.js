import GeoJSON from 'ol/format/GeoJSON'
import { getMapAdcdFromSystem, getAdLevelBySystemAdcd, getGisDataByWfs, getSystemAdcdFromMap, getParentAdcdBySystemAdcd } from '@dc/dcmap-simple-ol/common/common'
import BaseVectorLayer from '@dc/dcmap-simple-ol/layers/base/BaseVectorLayer'
import FilterUtils from '@dc/dcmap-simple-ol/utils/FilterUtils'
import { townAdcdLayerConfig, geoServerConfig } from '../config/layerConfig'
/**
 * 行政区划边界
 */
class TownAdcdLayer extends BaseVectorLayer {
  /**
   * 图层配置
   * @param {Object} layerConfig -图层配置
   * @param {String} layerConfig.id -图层id
   * @param {LayerTypeEnum} layerConfig.type -图层类型
   * @param {Number} layerConfig.zIndex - 图层层级
   * @param {ol.Map} layerConfig.map - 地图
   * @param {Object} layerConfig.stroke - 线配置项
   * @param {String} layerConfig.stroke.color - 线颜色
   * @param {Number} layerConfig.stroke.width - 线宽
   * @param {Object} layerConfig.fill - 面配置
   * @param {String} layerConfig.fill.color - 面颜色
   * @param {Object} layerConfig.text - 文本配置
   * @param {Object} layerConfig.text.font - 字体配置
   * @param {String} layerConfig.text.color - 字体颜色
   * @param {String} layerConfig.text.haoColor - 字体描边颜色
   * @param {Number} layerConfig.text.haoWidth - 字体描边宽度
   *
   */
  constructor(layerConfig) {
    let config = townAdcdLayerConfig
    if (layerConfig) {
      config = Object.assign(townAdcdLayerConfig, layerConfig)
    }
    super(config)
    this.minLevel = 4
    this.maxLevel = 1
    this.parentAdcd = ''
  }

  /**
   * 加载行政区划边界
   * @param {ol.Map} map -地图
   * @param {String} adcd -系统中的行政区划编码 例如 浙江省：33
   */
  async load(map, adcd, datas) {
    if (!this.layer) {
      this.addLayer(map)
    }
    this.clear()
    const mapadcd = getMapAdcdFromSystem(adcd)
    const geoserverParams = geoServerConfig.wfsParams
    if (adcd.length === 4) {
      geoserverParams.typeName = 'ZhejiangAdminDivisionRough:county'
    } else if (adcd.length === 6) {
      geoserverParams.typeName = 'ZhejiangAdminDivisionRough:town'
    }
    const filter = `parent_code=${mapadcd}`
    geoserverParams.filter = FilterUtils.cqlFilterToFilter(filter, true)
    const result = await getGisDataByWfs(geoserverParams, `${geoServerConfig.url}/ZhejiangAdminDivisionRough/wms`)
    const features = new GeoJSON().readFeatures(result)
    features.forEach((feature) => {
      feature.setId(`${this.layerConfig.id}.${feature.get('admin_div_code')}`)
    })
    this.addFeatures(features)
    const source = this.getSource()
    if (datas) {
      datas.forEach((element) => {
        const feature = source.getFeatureById(`${this.layerConfig.id}.${element.adcd.padEnd(9, '0')}`)
        if (feature) {
          feature.set('properties', element)
        }
      })
    }
  }

  /**
   * 点击下钻功能
   */
  click(params) {
    const vm = params.getValueByKey('vm')
    const feature = params.getValueByKey('feature')
    const sysAdcd = getSystemAdcdFromMap(feature.get('admin_div_code'))
    const adLevel = getAdLevelBySystemAdcd(sysAdcd)
    if (adLevel !== vm.minLevel) { // 表示要下钻
      this.parentAdcd = getSystemAdcdFromMap(feature.get('parent_code'))
      vm.drillDown(sysAdcd)
      vm.isTopAdcd = false
    } else { // 表示已经是最小的层级了，无法下钻，将选中的元素丢到选中图层去就好了
      // vm.layers.orgSelectLayer.addFeatures([feature])
    }
  }

  /**
   * 返回上级地图
   */
  goBack(params) {
    const vm = params.getValueByKey('vm')
    const sysAdcd = this.parentAdcd
    const sysAdLevel = getAdLevelBySystemAdcd(sysAdcd)
    const parentAdcd = getParentAdcdBySystemAdcd(this.parentAdcd)
    if (sysAdLevel === vm.maxLevel) { // 表示不能返回上级
      vm.isTopAdcd = true
    }
    vm.drillDown(sysAdcd)
    this.parentAdcd = parentAdcd
  }
}
export default TownAdcdLayer
