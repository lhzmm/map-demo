import Group from 'ol/layer/Group'
import BaseLayer from '@dc/dcmap-simple-ol/layers/base/BaseLayer'
import {
  tdtImg, tdtVec, tdtTer, qgjImg, qgjTer, qgjVec,
  tdtImgAnno, tdtVecAnno, tdtTerAnno,
} from '../config/baseLayerConfig'

class LayerSwitch {
  initLayerGroup(baseLayers, map) {
    this.removeLayers(map)
    const layers = []
    baseLayers.forEach((layerid) => {
      const layer = new BaseLayer(layerid)
      layers.push(layer.getLayer(map))
    })
    this.baseLayerGroup = new Group({ layers })
    map.addLayer(this.baseLayerGroup)
  }

  removeLayers(map) {
    if (this.baseLayerGroup) {
      map.removeLayer(this.baseLayerGroup)
    }
  }

  changeLayers(num, map) {
    const vm = this
    switch (num) {
      case '1':
      case 1:
        vm.initLayerGroup([tdtTer, qgjTer, tdtTerAnno], map)
        break
      case '2':
      case 2:
        vm.initLayerGroup([tdtImg, qgjImg, tdtImgAnno], map)
        break
      case '3':
      case 3:
        vm.initLayerGroup([tdtVec, qgjVec, tdtVecAnno], map)
        break
      default:
        vm.initLayerGroup([tdtVec, qgjVec, tdtVecAnno], map)
        break
    }
  }
}
export default LayerSwitch
