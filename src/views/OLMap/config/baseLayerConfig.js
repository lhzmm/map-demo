import { res, matrixIds, projectionExtent, projection } from '@dc/dcmap-simple-ol/config/mapConfig'
import { SourceTypeEnum, LayerTypeEnum } from '@dc/dcmap-simple-ol/enum/TypeEnum'

const tdtTk = 'e5abca32c01cf5fa9a82cd58d677fddd'
const qgjTk = 'DCXXKFB'
// 天地图 影像图
export const tdtImg = {
  type: LayerTypeEnum.tile,
  id: 'tdt_img',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  maxZoom: 18,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图影像图',
    url: `https://t{0-6}.tianditu.gov.cn/img_c/wmts?tk=${tdtTk}`,
    layer: 'img',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 天地图 矢量图
export const tdtVec = {
  type: LayerTypeEnum.tile,
  id: 'tdt_vec',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图矢量图',
    url: `https://t{0-6}.tianditu.gov.cn/vec_c/wmts?tk=${tdtTk}`,
    layer: 'vec',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 天地图 地形图
export const tdtTer = {
  type: LayerTypeEnum.tile,
  id: 'tdt_ter',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图地形图',
    url: `https://t{0-6}.tianditu.gov.cn/ter_c/wmts?tk=${tdtTk}`,
    layer: 'ter',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 天地图 影像注记
export const tdtImgAnno = {
  type: LayerTypeEnum.tile,
  id: 'tdt_img_anno',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图影像注记图',
    url: `https://t{0-6}.tianditu.gov.cn/cia_c/wmts?tk=${tdtTk}`,
    layer: 'cia',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 天地图 矢量注记
export const tdtVecAnno = {
  type: LayerTypeEnum.tile,
  id: 'tdt_vec_anno',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图矢量注记图',
    url: `https://t{0-6}.tianditu.gov.cn/cva_c/wmts?tk=${tdtTk}`,
    layer: 'cva',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 天地图 地形注记
export const tdtTerAnno = {
  type: LayerTypeEnum.tile,
  id: 'tdt_ter_anno',
  visible: true,
  className: 'baseLayer',
  zIndex: 5,
  source: {
    type: SourceTypeEnum.wmts,
    name: '天地图地形注记图',
    url: `https://t{0-6}.tianditu.gov.cn/cta_c/wmts?tk=${tdtTk}`,
    layer: 'cta',
    style: 'default',
    matrixSet: 'c',
    format: 'tiles',
    projectionExtent,
    resolutions: res,
    matrixIds,
  },
}
// 水利一张图矢量图
export const qgjVec = {
  type: LayerTypeEnum.tile,
  id: 'qgj_vec',
  visible: true,
  className: 'baseLayer',
  zIndex: 6,
  source: {
    type: SourceTypeEnum.xyz,
    projection,
    url: `https://sldtpt.slt.zj.gov.cn/${qgjTk}/PBS/rest/services/WYX2021/MapServer/tile/{z}/{y}/{x}`,
    resolutions: res,
    origin: [-180, 90],
    extent: [118.022522373009, 27.0296976180001, 123.249936819, 31.1825604519034],
    tileSize: 256,
  },
}
// 水利一张图影像图
export const qgjImg = {
  type: LayerTypeEnum.tile,
  id: 'qgj_img',
  visible: true,
  className: 'baseLayer',
  zIndex: 6,
  source: {
    type: SourceTypeEnum.xyz,
    projection,
    url: `https://sldtpt.slt.zj.gov.cn/${qgjTk}/arcgis/rest/services/basemap/ZJRasterMap/MapServer/tile/{z}/{y}/{x}`,
    resolutions: res,
    origin: [-180, 90],
    extent: [118.022522373009, 27.0296976180001, 123.249936819, 31.1825604519034],
    tileSize: 256,
  },
}
// 水利一张图影像图注记
export const qgjImgAnno = {
  type: LayerTypeEnum.tile,
  id: 'qgj_imgAnno',
  visible: true,
  className: 'baseLayer',
  zIndex: 6,
  source: {
    type: SourceTypeEnum.xyz,
    projection,
    url: `https://sldtpt.slt.zj.gov.cn/${qgjTk}/arcgis/rest/services/basemap/YingXiangZhuJi/MapServer/tile/{z}/{y}/{x}`,
    resolutions: res,
    origin: [-180, 90],
    extent: [118.022522373009, 27.0296976180001, 123.249936819, 31.1825604519034],
    tileSize: 256,
  },
}
// 水利一张图地形图
export const qgjTer = {
  type: LayerTypeEnum.tile,
  id: 'qgj_ter',
  visible: true,
  className: 'baseLayer',
  zIndex: 6,
  source: {
    type: SourceTypeEnum.xyz,
    projection,
    url: `https://sldtpt.slt.zj.gov.cn/${qgjTk}/PBS/rest/services/DXVectorMap2021/MapServer/tile/{z}/{y}/{x}`,
    resolutions: res,
    origin: [-180, 90],
    extent: [118.022522373009, 27.0296976180001, 123.249936819, 31.1825604519034],
    tileSize: 256,
  },
}
