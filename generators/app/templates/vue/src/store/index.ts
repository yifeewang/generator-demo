import { defineStore } from 'pinia';
// type obj={
//   hxConfig:null|Object
// }

export const useStore = defineStore('main', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      hxConfig: {} as any,
      urlParams: {} as any,
      uid: '',
      counter: 0,
      name: 'Eduardo',
    };
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
  getters: {
    doubleCount: state => state.counter * 2,
  },
});
