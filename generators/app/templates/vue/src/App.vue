<template>
  <div
    class="app"
    v-if="store.uid"
    :style="{
      backgroundColor: store.hxConfig.pageColor,
    }"
  >
    <router-view />
  </div>
  <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store/index';
const store = useStore();
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
// body {
// background-color: v-bind('store.hxConfig.pageColor');
// background-color: #fec182ff;
// }
.app {
  height: 100%;
  min-height: 100vh;
  // background-color: #fec182ff;
}
.skeleton {
  width: 750px;
  height: 100%;
  min-height: 100vh;
  background: url('./assets/skeleton.png') no-repeat center top / 100% 100%;
}
</style>
