<template>
<div class="layer-exp">
  <Layer
    v-bind="configs1"
    @changeTabItem="changeTabItem"
    @changeActiveLayer="changeActiveLayer($event, configs1.keyId)"
  >
  </Layer>

  <Layer
    v-for="config in configs2"
    :key="config.keyId"
    v-bind="config"
    @changeTabItem="changeTabItem"
    @changeActiveLayer="changeActiveLayer($event, config.keyId)"
  >
  </Layer>

</div>
</template>

<script lang="tsx">
import Layer from './index.vue'
import { defineLayerProps } from './define'
import LayerImg from '@/assets/layer-img.png'

export default {
  components: {Layer},
  data() {
    return {
      activeLayers: [],
      activeLayer: [],
      activeLayer1: [],
      activeLayer2: [],
      activeTabItem: '',
      currentCheckedKeyId: '',
    }
  },
  computed: {
    configs1() {
      return defineLayerProps(
        {
          keyId: 'test',
          tabItem: {
            icon: 'icon-content-icon-tucengkongzhi',
            label: '测试图层',
            layout: 'vertical',
            labelPosition: 'outer',
          },
          checked: this.currentCheckedKeyId === 'test',
          placement: 'bottom',
          title: '图层控制',
          activeLayer: this.activeLayer,
          layerConfig: [
            {
              title: '监测图层',
              children: [
                {icon: 'icon-content-icon-yulaingzhan', name: '雨量站', id: 'rain_station', num: 0,},
                {icon: 'icon-content-icon-shuikuzhan', name: '水库站', id: 'reservoir_station', num: 10},
                {img: LayerImg, name: '重要村落', id: 'impVillage'},
              ]
            },
            {
              title: '隐患信息',
              children: [
                {icon: 'icon-content-icon-qiaoliang', name: '桥梁', id: 'bridge'},
                {icon: 'icon-content-icon-yanba', name: '堰坝', id: 'weirDam'},
              ]
            },
          ]
        }
      )
    },
    configs2() {
      return defineLayerProps([
        {
          keyId: 'test1',
          tabItem: {
            icon: 'icon-content-icon-tucengkongzhi',
            label: '测试图层1',
            layout: 'vertical',
            labelPosition: 'outer',
          },
          checked: this.currentCheckedKeyId === 'test1',
          placement: 'left',
          customTitleRender: () => {
            return <div class="custom-title">
              <div>自定义主体标题</div>
              <span>自定义小小标题</span>
            </div>
          },
          activeLayer: this.activeLayer1,
          layerConfig: [
            {icon: 'icon-content-icon-yulaingzhan', name: '雨量站', id: 'rain_station'},
            {icon: 'icon-content-icon-shuikuzhan', name: '水库站', id: 'reservoir_station', num: 10},
            {icon: 'icon-content-icon-qiaoliang', name: '桥梁', id: 'bridge'},
            {icon: 'icon-content-icon-yanba', name: '堰坝', id: 'weirDam'},
            {img: LayerImg, name: '重要村落', id: 'impVillage'},
          ],
          isMultiple: false,
        },
        {
          keyId: 'test2',
          tabItem: {
            img: LayerImg,
            label: '测试图层2',
            layout: 'vertical',
            labelPosition: 'inner',
          },
          checked: this.currentCheckedKeyId === 'test2',
          placement: 'right',
          title: '图层控制',
          activeLayer: this.activeLayer2,
          layerConfig: [
            {
              icon: 'icon-content-icon-yulaingzhan',
              name: '雨量站',
              id: 'rain_station',
              customRender: () => <div class="check-item" onClick={() => this.changeCustomLayerItem('rain_station')}>
                <div class="check-box">
                  <i class={{'icon-contnet-btn-xuanzhong': this.activeLayer2.includes('rain_station')}}></i>
                </div>
                <i class="icon-content-icon-yulaingzhan"></i>
                <div style="color: #fff">自定义雨量站</div>
              </div>
            },
            {icon: 'icon-content-icon-shuikuzhan', name: '水库站', id: 'reservoir_station', num: 10},
            {icon: 'icon-content-icon-qiaoliang', name: '桥梁', id: 'bridge'},
            {icon: 'icon-content-icon-yanba', name: '堰坝', id: 'weirDam'},
            {img: LayerImg, name: '重要村落', id: 'impVillage'},
          ],
        },
        {
          keyId: 'test3',
          tabItem: {
            icon: 'icon-content-icon-fangyuduixiang',
            label: '自定义',
            layout: 'horizontal'
          },
          checked: this.currentCheckedKeyId === 'test3',
          placement: 'bottom',
          title: '标题固定',
          customMainRender: () => <div class="custom-main">
            <div>我是自定义主体内容</div>
            <div>我是自定义主体内容</div>
            <div>我是自定义主体内容</div>
            <div>我是自定义主体内容</div>
            <div>我是自定义主体内容</div>
          </div>
        },
      ])
    }
  },
  methods: {
    changeTabItem(keyId: string | number){
      this.currentCheckedKeyId = this.currentCheckedKeyId === keyId ? '' : keyId
    },
    changeActiveLayer(val: (string | number)[], keyId:string){
      switch (keyId) {
        case 'test':
          this.activeLayer = val
          break
        case 'test1':
          this.activeLayer1 = val
          break
        case 'test2':
          this.activeLayer2 = val
          break
        default:
      }
      this.activeLayers = [...this.activeLayer1, ...this.activeLayer2]
    },
    changeCustomLayerItem(id:any) {
      if (this.activeLayer2.includes(id)) {
        this.activeLayer2 = this.activeLayer2.filter((item: any) => item !== id)
      } else {
        this.activeLayer2.push(id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.layer-exp{
  display: flex;
  align-items: center;
  justify-content: center;
  // flex-direction: column;
  gap: 20px;
}
/deep/ .custom-title{
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #fff;
  font-size: 16px;
  padding: 10px 0;
  span{
    color: #f75858;
    font-size: 12px;
  }
}
/deep/ .custom-main{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #fff;
  padding: 10px;
}
.test3{
  width: 300px;
  height: 200px;
  line-height: 30px;
  color: #fff;
}
</style>