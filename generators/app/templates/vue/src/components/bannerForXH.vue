<template>
  <!-- 轮播banner -->

  <div :class="className" v-if="bannerList.length == 1">
    <img
      @click="onBannerClickProps(bannerList[0], 0)"
      class="bannerImg"
      :src="bannerList[0].picUrl"
    />
  </div>
  <div :class="className" v-else-if="bannerList.length > 1">
    <div class="swiper-container" :id="state.id" style="height: 100%">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :key="index + '0'" v-for="(item, index) in bannerList">
          <img class="bannerImg" :src="item.picUrl" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script setup>
import { httpXHReport } from '../utils/myCrypto.js';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import { useStore } from '../store';
import { onMounted, reactive, watch, defineEmits, defineProps } from 'vue';
import hostConfig from '../config';
const store = useStore();
const emit = defineEmits(['bannerVisitProps', 'bannerClickProps']);
const props = defineProps({
  className: {
    type: [String, Array],
    default: 'banner-box',
  },
  bannerList: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  id: +new Date(),
  bannerExposureFlag: [], // banner是否曝光标记
});
onMounted(() => {
  initSwiper();
  console.log('onMounted======', state.id);
  if (props.bannerList.length === 1) {
    onBannerVisitProps(props.bannerList[0], 0);
  }
});
// watch(props.bannerList, (newValue, oldValue) => {
//   console.log(8888, newValue, oldValue);
// });
const initSwiper = () => {
  // swiper.activeIndex，swiper与this都可指代当前swiper实例
  new Swiper('#' + state.id, {
    loop: true,
    autoplay: {
      disableOnInteraction: false,
    },
    pagination: { el: '.swiper-pagination' /* clickable: true */ },
    // direction: 'vertical',
    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
    // observeParents: true, // 修改swiper的父元素时，自动初始化swiper
    on: {
      slideChangeTransitionEnd: function () {
        const len = props.bannerList.length;
        const index = this.activeIndex > len ? this.activeIndex - len : this.activeIndex;
        // console.log('当前曝光的banner索引', index);
        onBannerVisitProps(props.bannerList[index - 1], index - 1);
      },
      click: function (e) {
        // console.log('点击banner索引', this.realIndex);
        onBannerClickProps(props.bannerList[this.realIndex], this.realIndex);
      },
    },
  });
};
// 星火banner点击 item：banner信息 index：banner索引
const onBannerClickProps = (item, index) => {
  // console.log('onBannerClickProps');
  try {
    reportXHClick(item);
  } catch (e) {
    console.log(e);
  }
  // 事件回传，todo something...
  emit('bannerClickProps', item, index);
};
const onBannerVisitProps = (item, index) => {
  if (state.bannerExposureFlag[index]) {
    return;
  }
  state.bannerExposureFlag[index] = true;
  emit('bannerVisitProps', item, index);
};

// 星火点击上报
const reportXHClick = item => {
  // console.log('reportXHClick', item);
  const { isNotice, sceneCode, sceneGroupCode, nth } = item;
  if (isNotice && +isNotice === 1) {
    const params = {
      sceneCode: sceneCode,
      operation: 'click',
      sceneGroupCode: sceneGroupCode,
      uid: store.uid,
      nth: nth,
    };
    httpXHReport({
      method: 'post',
      url: `${hostConfig.xinghuoURL}/gaoyang/userStatisticsService/dv/1.0/adBill`,
      data: params,
    })
      .then(res => {
        console.log('星火banner点击上报成功&&&&&&', res);
      })
      .catch(err => {
        console.log('星火banner点击上报失败*******', err);
      });
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin: 0 auto;
  // img {
  //   width: 100%;
  //   height: 100%;
  // }
  .swiper-wrapper,
  .swiper-slide {
    width: 100%;
    height: 100%;
  }
}
.banner-box {
  // border: 1px solid green;
  width: 690px;
  height: 170px;
  margin: 10px auto;
  img {
    width: 100%;
    height: 100%;
  }
}
// 弹窗的小banner
.banner-footer {
  // border: 1px solid red;
  width: 550px;
  height: 146px;
  margin-top: -20px;
  z-index: 9999;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
