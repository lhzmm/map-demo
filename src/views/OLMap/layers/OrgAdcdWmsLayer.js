import BaseLayer from '@dc/dcmap-simple-ol/layers/base/BaseLayer'
import {
  getMapAdcdFromSystem,
  getAdLevelBySystemAdcd,
  getChildFeatureTypesByAdLevel,
} from '@dc/dcmap-simple-ol/common/common'
import { orgAdcdWmsLayer } from '../config/layerConfig'

/**
 * 行政区划边界图层 - wms方式无点击以及鼠标经过事件
 */
class OrgAdcdWmsLayer extends BaseLayer {
  /**
   * 图层配置
   * @param {Object} layerConfig - 图层配置
   * @param {String} layerConfig.id - 图层id
   * @param {String} layerConfig.type - 图层类型 必须为LayerTypeEnum.image
   * @param {Object} layerConfig.source - 数据源
   * @param {String} layerConfig.source.type - 数据源类型 必须为SourceTypeEnum.imagewms
   * @param {String} layerConfig.source.url - 数据源url 'https://gis.dcyun.com:48475/geoserver/ZhejiangAdminDivision/wms'
   * @param {Object} layerConfig.source.params - 请求参数
   * @param {Object} layerConfig.source.params.LAYERS - 行政区划图层 geoserver服务图层，不填，由代码自动计算出
   * @param {String} layerConfig.source.params.VERSION - 版本 写死1.3.0
   * @param {String} layerConfig.source.params.SRS - 投影坐标系 写死‘EPSG:4326’
   * @param {String} layerConfig.source.params.STYLES - 图层样式id geoserver中配置的图层样式id
   * @param {String} layerConfig.source.params.CQL_FILTER - 查询条件 类sql写法 例如1=1
   * @param {String} layerConfig.source.crossOrigin - 配置允许跨域  ‘anonymous’
   * @param {Number} layerConfig.zIndex - 图层层级
   * @param {Function} layerConfig.sldFunc - 样式函数 function(type){} 其中type为地图服务中的图层名
   */
  constructor(layerConfig) {
    let config = orgAdcdWmsLayer
    if (layerConfig) {
      config = Object.assign(orgAdcdWmsLayer, layerConfig)
    }
    super(config)
  }

  /**
   * 加载行政区划边界
   * @param {ol.Map} map - 地图
   * @param {String} adcd - 系统中的行政区划编码 例如金华：3307  浙江省：33
   */
  async load(map, adcd) {
    if (this.layer) {
      this.removeLayer(map)
    }
    const mapadcd = getMapAdcdFromSystem(adcd)
    const adLevel = getAdLevelBySystemAdcd(adcd)
    let featureType = ''
    if (adcd.length === 4) {
      featureType = 'ZhejiangAdminDivisionRough:city'
    } else if (adcd.length === 6) {
      featureType = 'ZhejiangAdminDivisionRough:county'
    }
    this.layerConfig.source.params.LAYERS = featureType
    this.layerConfig.source.params.CQL_FILTER = `admin_div_code=${mapadcd}`
    if (this.layerConfig.sldFunc) {
      this.layerConfig.source.params.sld_body = this.layerConfig.sldFunc(featureType)
    } else {
      this.layerConfig.source.params.sld_body = this.getOrgSld(featureType)
    }
    this.addLayer(map)
  }

  getOrgSld(type) {
    return `${'<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">'
            + '<sld:UserLayer>'
                + '<sld:LayerFeatureConstraints>'
                    + '<sld:FeatureTypeConstraint/>'
                + '</sld:LayerFeatureConstraints>'
                + '<sld:Name>'}${type}</sld:Name>`
                + '<sld:UserStyle>'
                    + '<sld:Name>vw polderPolygon</sld:Name>'
                    + '<sld:FeatureTypeStyle>'
                        + '<sld:Name>group0</sld:Name>'
                        + '<sld:FeatureTypeName>Feature</sld:FeatureTypeName>'
                        + '<sld:SemanticTypeIdentifier>generic:geometry</sld:SemanticTypeIdentifier>'
                        + '<sld:SemanticTypeIdentifier>simple</sld:SemanticTypeIdentifier>'
                        + '<sld:Rule>'
                            + '<sld:Name>riverlake</sld:Name>'
                            + '<sld:PolygonSymbolizer>'
                            + '<sld:Geometry>'
                                  + '<ogc:Function name="offset">'
                                  + '<ogc:PropertyName>wkb_geometry</ogc:PropertyName>'
                                    + '<ogc:Literal>0.0</ogc:Literal>'
                                    + '<ogc:Literal>-0.012</ogc:Literal>'
                                  + '</ogc:Function>'
                              + '</sld:Geometry>'
                                + '<sld:Fill>'
                                  + '<sld:CssParameter name="fill">#1a49d3</sld:CssParameter>'
                                  + '<sld:CssParameter name="fill-opacity">1</sld:CssParameter>'
                                + '</sld:Fill>'
                                + '<sld:Stroke>'
                                    + '<sld:CssParameter name="stroke">#2593ee</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-width">1</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-opacity">0.7</sld:CssParameter>'
                                + '</sld:Stroke>'
                                + '<sld:PerpendicularOffset>3</sld:PerpendicularOffset>'
                            + '</sld:PolygonSymbolizer>'
                            + '<sld:PolygonSymbolizer>'
                              + '<sld:Geometry>'
                                  + '<ogc:Function name="offset">'
                                  + '<ogc:PropertyName>wkb_geometry</ogc:PropertyName>'
                                    + '<ogc:Literal>0.0</ogc:Literal>'
                                    + '<ogc:Literal>-0.008</ogc:Literal>'
                                  + '</ogc:Function>'
                              + '</sld:Geometry>'
                                + '<sld:Fill>'
                                  + '<sld:CssParameter name="fill">#1a49d3</sld:CssParameter>'
                                  + '<sld:CssParameter name="fill-opacity">1</sld:CssParameter>'
                                + '</sld:Fill>'
                                + '<sld:Stroke>'
                                    + '<sld:CssParameter name="stroke">#2593ee</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-width">1</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-opacity">0.7</sld:CssParameter>'
                                + '</sld:Stroke>'
                                + '<sld:PerpendicularOffset>5</sld:PerpendicularOffset>'
                            + '</sld:PolygonSymbolizer>'
                            + '<sld:PolygonSymbolizer>'
                            + '<sld:Geometry>'
                                  + '<ogc:Function name="offset">'
                                  + '<ogc:PropertyName>wkb_geometry</ogc:PropertyName>'
                                      + '<ogc:Literal>0.0</ogc:Literal>'
                                      + '<ogc:Literal>-0.004</ogc:Literal>'
                                  + '</ogc:Function>'
                              + '</sld:Geometry>'
                                + '<sld:Fill>'
                                  + '<sld:CssParameter name="fill">#1a49d3</sld:CssParameter>'
                                  + '<sld:CssParameter name="fill-opacity">1</sld:CssParameter>'
                                + '</sld:Fill>'
                                + '<sld:Stroke>'
                                    + '<sld:CssParameter name="stroke">#2593ee</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-width">1</sld:CssParameter>'
                                    + '<sld:CssParameter name="stroke-opacity">0.7</sld:CssParameter>'
                                + '</sld:Stroke>'
                                + '<sld:PerpendicularOffset>3</sld:PerpendicularOffset>'
                            + '</sld:PolygonSymbolizer>'
                        + '</sld:Rule>'
                    + '</sld:FeatureTypeStyle>'
                + '</sld:UserStyle>'
            + '</sld:UserLayer>'
          + '</sld:StyledLayerDescriptor>'
  }
}
export default OrgAdcdWmsLayer
