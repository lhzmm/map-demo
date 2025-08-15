<template>
  <div class="rainAreaLegend">
    <div class="legend-top-label">单位:(毫米)</div>
    <div class="legend-box">
      <div
        v-for="(item, index) in legendColorList"
        :key="index"
        class="legend-item"
      >
        <div
          :class="item.class"
          :style="{ background: item.color }"
          class="legend-item-rectangle"
        ></div>
        <div class="border"></div>
        <div class="legend-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      legendColorList: [
        {
          label: '250',
          color: 'linear-gradient(to bottom, #EF2DFF , #E228ED)',
        },
        {
          label: '100',
          color: 'linear-gradient(to bottom, #E228ED , #AF2AA7)',
        },
        {
          label: '50',
          color: 'linear-gradient(to bottom, #AF2AA7 , #A82D2F)',
        },
        {
          label: '25',
          color: 'linear-gradient(to bottom, #A82D2F , #FDA831)',
        },
        {
          label: '10',
          color: 'linear-gradient(to bottom, #FDA831 , #5DA32F)',
        },
        {
          label: '0.1',
          color: 'linear-gradient(to bottom, #5DA32F , #ACFBFF)',
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.rainAreaLegend {
  position: absolute;
  left: 20px;
  bottom: 23px;
  z-index: 1;
  background: #fff;
  padding: 10px;
  border-radius: 14px;
  .legend-top-label {
    color: #000;
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;
  }
  .legend-box {
    .legend-item {
      display: flex;
      color: #000;
      .legend-label {
        margin-left: 10px;
        font-size: 14px;
        height: 48px;
        line-height: 48px;
      }
      .legend-item-rectangle {
        width: 18px;
      }

    }
  }
}
</style>
