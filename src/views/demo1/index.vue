<template>
  <div class="demo1">
    <DemoMap1 ref="demoMap1" />
  </div>
</template>

<script lang="ts" setup>
import DemoMap1 from '@/views/OLMap/DemoMap1.vue'

</script>

<style lang="less" scoped>
.demo1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>