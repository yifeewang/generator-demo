<template>
  <div class="container" v-html="store.hxConfig.ruleText"></div>
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

.container {
  min-height: 100vh;
  height: 100%;
  font-size: 0.32rem;
  line-height: 1.5;
  padding: 0.1rem 0.2rem;
  background-color: #fff;
}
</style>
