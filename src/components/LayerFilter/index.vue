<script lang="jsx">

export default {
  name: 'Layer',
  props: {
    tabItem: {
      type: Object,
      default: () => ({}),
    },
    keyId: {
      type: [String, Number],
      default: '',
    },
    // 出现位置
    placement: {
      type: String,
      default: 'right',
    },
    // 是否选中
    checked: {
      type: Boolean,
      default: false,
    },
    // pop内容主体标题
    title: {
      type: String,
      default: '',
    },
    // 是否只触发点击效果
    isClick: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true,
    },
    // 图层配置
    layerConfig: {
      type: Array,
      default: () => ([])
    },
    // 图层选中集合
    activeLayer: {
      type: Array,
      default: () => ([])
    },
    // 自定义标题
    customTitleRender: {
      type: Function,
      default: null,
    },
    // 自定义主体
    customMainRender: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      popHeight: 0,
    }
  },
  watch: {
    checked() {
      this.onResize()
    },
    layerConfig() {
      this.onResize()
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    handleClickTabItem() {
      this.$emit('changeTabItem', this.keyId)
    },
    handleActiveLayer(id) {

      let tempAct = [...this.activeLayer]
      // 如果为单选
      if (!this.isMultiple) {
        this.$emit('changeActiveLayer', tempAct.includes(id) ? [] : [id])
        return
      }

      if (tempAct.includes(id)) {
        tempAct = tempAct.filter((item) => item !== id)
      } else {
        tempAct.push(id)
      }
      this.$emit('changeActiveLayer', tempAct)
    },
    onResize() {
      this.$nextTick(() => {
        if (this.checked) {
          const popContainer = this.$refs.popContainer
          this.popHeight = `${popContainer.offsetHeight}px`
        } else {
          this.popHeight = 0
        }
      })
    },
    renderIconOrImg(icon, img) {
      if (icon) return <i class={`icon ${icon}`}></i>
      if (img) return <img class="icon-img" src={img}  />
      return
    },
    // 绘制tabItem展示 Ui
    renderTabItem(tabItem) {
      if (typeof tabItem.customRender === 'function') {
        return tabItem.customRender()
      }

      const { icon, img, label, layout, labelPosition = 'inner' } = tabItem

      if (layout === 'vertical' && labelPosition === 'outer') {
        return <div class={`${layout}-${labelPosition}`} onClick={this.handleClickTabItem}>
          <div class={{'tab': true, 'active': this.checked}}>
            { this.renderIconOrImg(icon, img) }
          </div>
          <div class="label">{label}</div>
        </div>
      }

      return <div class={`${layout}-${labelPosition}`} onClick={this.handleClickTabItem}>
        <div class={{'tab': true, 'active': this.checked}}>
          { this.renderIconOrImg(icon, img) }
          <div class="label">{label}</div>
        </div>
      </div>
    },
    renderLayerItem(item) {
      const { icon, img, name, id, num, customRender } = item
      if (typeof customRender === 'function') {
        return customRender()
      }
      return <div class={{'active': this.activeLayer.includes(id), 'cursor': true, 'check-item': true}} onClick={() => this.handleActiveLayer(id)}>
        {this.renderIconOrImg(icon, img)}
        <div class="label">
          <span>{ name }</span>
          {num !== undefined ? <span> ({ num })</span> : ''}
        </div>
        <div class="check-box">
          <i class={{'icon-contnet-btn-xuanzhong': this.activeLayer.includes(id)}}></i>
        </div>
      </div>
    },
    // 绘制浮窗主标题
    renderPopTitle() {
      
      if (typeof this.customTitleRender === 'function') {
        return this.customTitleRender()
      }

      if (!this.title) return

      return <div class="pop-title">{this.title}</div>
    },
    renderPopMain() {
      if (typeof this.customMainRender === 'function') {
        return this.customMainRender()
      }

      if (!this.layerConfig.length) return

      if (this.layerConfig[0]?.children) {
        return this.layerConfig.map(item => <div class="both-layer">
          <div class="title">{ item.title }</div>
          {item.children?.map(layer => this.renderLayerItem(layer))}
        </div>)
      }
      return <div class="single-layer">
        { this.layerConfig.map(layer => this.renderLayerItem(layer)) }
      </div>
    }
  },
  render() {
    return ( this.keyId ?
      <div class="dc-layer">
        {this.renderTabItem(this.tabItem)}
        {
          !this.isClick ? (
          <div class={`${this.placement} pop-main`} style={{height: this.popHeight}}>
            <div class="pop-container" ref="popContainer">
              { this.renderPopTitle() }
              { this.renderPopMain() }
            </div>
          </div>)
          : ''
        }
      </div> : null
    )
  }
}
</script>

<style lang="less" scoped>
.dc-layer{
  position: relative;
  font-size: 14px;
  .horizontal-outer, .horizontal-inner{
    .tab{
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  .vertical-inner .tab{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .vertical-outer{
    display: flex;
    flex-direction: column;
    align-items: center;
    .label{
      color: #333;
    }
  }
  .tab{
    color: #fff;
    padding: 6px;
    border: 1px solid #4a64f7;
    border-radius: 4px;
    background-image: radial-gradient(#8697f8 20%, #4a64f7);
    cursor: pointer;
    &.active{
      background-image: radial-gradient(#bec037 20%, #fafc89);
      border-color: #fafc89;
    }
    .icon{
      font-size: 24px;
    }
    .icon-img{
      width: 24px;
    }
  }

  .pop-main{
    position: absolute;
    height: 0;
    min-width: 200px;
    text-align: center;
    transition: height .3s ease;
    overflow: hidden;
    z-index: 99;
    &.left{
      top: 0;
      right: calc(100% + 20px);
    }
    &.right{
      top: 0;
      left: calc(100% + 20px);
    }
    &.bottom{
      top: calc(100% + 20px);
      left: 50%;
      transform: translateX(-50%);
    }
    .pop-container{
      background-image: linear-gradient(0deg, #194dc5, #1644bf 0, #133ab9 0, #15379c 0, #16337e 0, #0d4d9a), linear-gradient(#0d4c99, #0d4c99);
      background-blend-mode: normal, normal;
      opacity: 0.95;
      border-radius: 8px;
      border: 1px solid #2593ee;
    }
    .pop-title{
      font-size: 16px;
      color: #fff;
      margin: 8px;
    }
  }
  .single-layer{
    padding: 0 10px 10px;
  }
  .both-layer {
    margin: 0 10px 10px;
    padding-bottom: 5px;
    background-color: #073673;
    border-radius: 8px;
    font-family: MicrosoftYaHei;
    &:first-child .title {
      padding-top: 8px;
    }
    &:last-child {
      padding-bottom: 10px;
    }
  }
  .title {
    font-size: 14px;
    color: #ffffff;
    padding-top: 5px;
    text-align: center;
    font-weight: bold;
    line-height: 28px;
  }
  .check-item {
    display: flex;
    align-items: center;
    min-width: 155px;
    gap: 10px;
    padding: 0 10px;
    line-height: 28px;
    cursor: pointer;

    &.active {
      .label {
        color: #ffffff;
      }
    }

    i {
      font-size: 16px;
      color: #248fe8;
    }
    .icon-img{
      width: 18px;
    }

    .label {
      flex-grow: 1;
      font-size: 14px;
      color: #b1dcff;
      white-space: nowrap;
    }

    .check-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      background-color: #07458f;
      box-shadow: -1px 0px 7px 0px rgba(93, 106, 113, 0.25);
      border-radius: 2px;
      border: solid 1px #6e9fe1;
      cursor: pointer;

      i {
        font-size: 12px;
        color: #00b8fd;
      }
    }
  }
}
</style>