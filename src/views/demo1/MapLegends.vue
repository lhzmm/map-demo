<template>
  <div
    :key="refreshIndex"
    ref="MapLegends"
    :style="{ width: width , height: height }"
    class="MapLegends"
    :class="{ ['legend-hidden']: isPull }"
  >
    <div class="header">
      <div class="header-left">
        <i class="icon-content-btn-xiangqing"></i>
        <span>图例</span>
      </div>
      <div class="header-right" @click="isPull = !isPull">{{ isPull ? '展开' : '收起' }}</div>
    </div>
    <div class="content">
      <el-checkbox-group
        v-model="checkList"
        :style="{gridTemplateRows: `repeat(${legendList.length>4?4:legendList.length}, 1fr)`}"
        :disabled="!useCheck"
        :class="useCheck?'':'no-check'"
        @change="$emit('changeCheckList', $event)"
      >
        <el-checkbox v-for="item in legendList" :key="item.value" :value="item.value">
          <div class="check-content">
            <img :src="item.img" alt="" />
            <div class="label">{{ item.label }} <span v-if="useCount">({{ item.count }})</span></div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
export default {
  components: {
    ElCheckbox,
    ElCheckboxGroup,
  },
  props: {
    checkLegendList: {
      type: Array,
      default: () => [],
    },
    legendList: {
      type: Array,
      default: () => [],
    },
    useCheck: {
      type: Boolean,
      default: true,
    },
    useCount: {
      type: Boolean,
      default: true,
    },
    needRefreshIsPull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPull: false,
      checkList: [],
      width: 'auto',
      height: 'auto',
      refreshIndex: 0,
    }
  },
  watch: {
    legendList() {
      if (this.needRefreshIsPull) {
        this.isPull = false
      }
      if (!this.isPull) {
        this.setAspect()
      }
    },
  },
  created() {
    this.checkList = this.checkLegendList
  },
  mounted() {
    this.setAspect()
    window.addEventListener('resize', this.setAspect)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setAspect)
  },
  methods: {
    setAspect() {
      this.width = 'auto'
      this.height = 'auto'
      this.refreshIndex += 1
      setTimeout(() => {
        this.width = `${this.$refs.MapLegends.offsetWidth}px`
        this.height = `${this.$refs.MapLegends.offsetHeight}px`
      }, 500)
    },
  },
}
</script>
<style lang="less" scoped>
.MapLegends {
  min-width: 110px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 10px 16px;
  background-color: #ffffff;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  left: 20px;
  bottom: 23px;
  z-index: 1;
  &.legend-hidden {
    width: 120px !important;
    height: 39px !important;
  }
  .header {
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    &-left {
      display: flex;
      align-items: center;
      i {
        font-size: 19px;
        color: #2e6ecd;
      }
      span {
        color: #000000;
        opacity: 0.9;
        margin-left: 1px;
      }
    }
    &-right {
      text-decoration: underline;
      color: #2e6ecd;
      cursor: pointer;
    }
  }
  .content {
    /deep/.el-checkbox-group {
      width: 100%;
      height: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-template-rows: repeat(4, 1fr);
      //   grid-template-columns: repeat(2, 1fr);
      justify-content: stretch;
      align-content: stretch;
      gap: 0 10px;
      &.no-check{
        .el-checkbox__input{
          display: none;
        }
        .el-checkbox__label{
          padding-left: 0;
        }
      }
      .el-checkbox {
        display: flex;
        align-items: center;
        margin-right: 0;
        &.is-disabled{
          cursor: auto;
        }
      }
      .el-checkbox__input.is-disabled+span.el-checkbox__label{
        cursor: text;
      }
    }
    .check-content {
      display: flex;
      align-items: center;
      line-height: 1;
      .label {
        color: #57667f;
      }
      img {
        width: 18px;
        margin-right: 9px;
      }
    }
  }
}
</style>
