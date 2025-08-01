import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import BaseMergeLayer from '@dc/dcmap-simple-ol/layers/base/BaseMergeLayer'
import * as ENUM from '@/views/OLMap/config/enum'

class TZMergeLayer extends BaseMergeLayer {
  async load(params) {
    const vm = params.getValueByKey('vm')

    const olMap = params.getValueByKey('olMap')
    let map
    if (olMap) {
      map = olMap.map
    } else {
      map = vm.map
    }
    // 获取搜索参数
    let searchInfo = params.getValueByKey('searchInfo')
    // 移除图层
    this.removeLayer(map)
    // 添加图层
    if (this.layerConfig.layerConfigFunc) {
      this.layerConfig = this.layerConfig.layerConfigFunc(this.layerConfig, searchInfo)
    }
    this.addLayer(map)

    // 表示搜索参数需要进行处理
    if (this.layerConfig.searchFunc) {
      searchInfo = this.layerConfig.searchFunc(vm, searchInfo)
    }
    // 获取数据
    // eslint-disable-next-line no-lonely-if
    let res = this.cacheDatas
    if (this.layerConfig.loadFunc) { // 并且没有缓存数据
      res = await this.layerConfig.loadFunc(searchInfo)

      if (res.riverWaterList) { // 表示是河道数据
        res = res.riverWaterList
      }
      if (res.rainList) { // 表示是雨情数据
        res = res.rainList
      }
      if (res.resWaterList) { // 表示是水库数据
        res = res.resWaterList
      }

    }
    this.searchInfo = searchInfo

    this.cacheDatas = JSON.parse(JSON.stringify(res))
    // 添加元素
    this.legendChange(params.getValueByKey('searchInfo'), res)

  }

  /**
   * 用于图例筛选用
   * @param {Object} searchInfo - 搜索参数
   * @param {Array} datas - 数据源
   */
  legendChange(searchInfo, datas) {
    // 清空图层
    this.clear()
    datas = datas || this.cacheDatas
    const { filter } = this.layerConfig
    if (filter) { // 表示需要进行图例的筛选
      if (filter.filterFunc) { // 自己写搜索操作函数
        datas = this.layerConfig.filter.filterFunc(searchInfo, datas)
      } else if (filter.field && filter.checkField) { // 表示采用通用的配置
        const checks = searchInfo[filter.checkField]
        if (checks) { // 先获取图例选中项
          datas = datas.filter((element) => checks.indexOf(element[filter.field]) !== -1)
        }
      }
    }
    this.addFeatures(datas)
  }

  addFeatures(datas) {
    const features = this.createFeatures(datas)
    super.addFeatures(features)
  }

  createFeatures(datas) {
    const { field, dataOperate } = this.layerConfig
    const features = []
    datas.forEach((element) => {
      if (element[field.lgtd] && element[field.lttd]) {
        element.lgtd = parseFloat(element[field.lgtd])
        element.lttd = parseFloat(element[field.lttd])
        element.fid = element[field.id]
        element.layerid = this.layerConfig.id
        if (dataOperate) {
          dataOperate(element)
        }
        const feature = new Feature({ geometry: new Point([parseFloat(element[field.lgtd]), parseFloat(element[field.lttd])]) })
        const { mapper } = this.layerConfig
        if (mapper) {
          Object.keys(mapper).forEach((key) => {
            element[key] = element[mapper[key]]
          })
        }
        if (field.id) {
          feature.setId(`${this.layerConfig.id}.${element[field.id]}`)
        }
        feature.set('properties', element)
        features.push(feature)
      }
    })
    return features
  }

  // 列表定位到地图
  gotoMap(params) {
    const row = params.getValueByKey('row')
    const vm = params.getValueByKey('vm')
    row.layerid = this.layerConfig.id
    setTimeout(() => {
      vm.otherDetailConfig = this.layerConfig.popConfig
      vm.otherDetail = row
      vm.otherPopShow = true
    }, 200)
  }

  mouseover(params) {
    const vm = params.getValueByKey('vm')
    const feature = params.getValueByKey('feature')
    const features = feature.get('features')
    if (features && features.length === 1) { // 表示是单个点
      const properties = features[0].get('properties')
      properties.layerid = this.layerConfig.id
      // vm.pops = [properties] // 原 vue2 写法, 现兼容 vue3 响应式更新
      vm.pops.splice(0, vm.pops.length, properties)
    } else if (!features) {
      const properties = feature.get('properties')
      properties.layerid = this.layerConfig.id
      // vm.pops = [properties] // 原 vue2 写法, 现兼容 vue3 响应式更新
      vm.pops.splice(0, vm.pops.length, properties)
    }
  }

  // 地图点击打开弹窗
  click(params) {
    const feature = params.getValueByKey('feature')
    params.setValueByKey('row', feature.get('properties'))
    this.gotoMap(params)
  }
}
export default TZMergeLayer
