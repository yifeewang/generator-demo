import { createApp, toRaw } from 'vue';
import { createPinia, PiniaPlugin, PiniaPluginContext } from 'pinia';
import App from './App.vue';
import router from './router';
import { useStore } from '@/store/index';
// import store from './store/index2';

import hx from '@/libs/hx-sdk/hx-sdk.esm.js';
import '@/config';
import '@/mock';
import 'amfe-flexible';
import { Toast } from 'vant';
import 'vant/lib/index.css';
import axios from 'axios';

import { turnPage, getNetWorkType, terminal } from './utils/common.js';
import { BURY_LOG } from './apis';

console.log(process.env);

const app = createApp(App);
// 挂载实例
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$toast = Toast;
app.config.globalProperties.$turnPage = turnPage;

app
  .use(createPinia())
  .use(router)
  .mount('#app');
const store = useStore();

// 请求配置文件
hx.init({
  onConfig: (config: any) => {
    store.$patch({
      hxConfig: config,
      urlParams: hx.getParams(),
    });
  },
});
hx.getUid()
  .then((res: string) => {
    store.uid = res;
  })
  .catch((err: any) => {
    console.log('err-getUid', err);
  });

if (!store.hxConfig.canShare && (window as any).AlipayJSBridge) {
  (window as any).AlipayJSBridge.call('hideOptionMenu');
}
hx.setTitle(store.hxConfig.title);

const buryDate = data => {
  const json = {
    app_id: 'SF' + store.hxConfig.id,
    app_ver: store.hxConfig.version,
    tenant_code: '',
    uid: '',
    spm_value: '',
    action: '',
    // @ts-ignore
    spm_time: parseInt(new Date().getTime() / 1000),
    resource_spm: '',
    mobile: terminal(), //客户端机型信息
    browser: '', // 客户端浏览器信息
    browser_core: '', // 浏览器内核
    channel: '',
    channel2: '', //二级渠道
    other: '',
    device_brand: '',
    device_model: '',
    network: getNetWorkType(), // 网络类型
    os: navigator.platform, // 操作系统
    os_version: '', // 操作系统版本
    uri: '', //当前页面路径（绝对路径）
    user_agent: '',
    ...data,
    events: data.events ? JSON.stringify(data.events) : '',
  };
  BURY_LOG(json);
};
app.config.globalProperties.$buryDate = buryDate;
