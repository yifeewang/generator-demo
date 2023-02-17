<template>
  <div
    class="home"
    :style="{
      background: `url(${hxConfig.pageBg}) no-repeat center top / contain`,
    }"
  >
    <div
      class="rule"
      :style="{
        background: `url(${hxConfig.ruleIcon}) no-repeat center top / contain`,
      }"
      @click="ruleClick"
    ></div>
    <div class="my-prize" @click="goMyPrize"></div>
    <div class="main">
      <div class="title">
        <img :src="hxConfig.titleBg" />
      </div>
      <div class="card-wrap">
        <img :src="hxConfig.cardList && hxConfig.cardList.card1" />
        <img :src="hxConfig.cardList && hxConfig.cardList.card2" />
        <img :src="hxConfig.cardList && hxConfig.cardList.card3" />
      </div>
      <div class="btn" @click="clickDraw">
        <img v-if="state.isDrawVO.remainingCount > 0" src="../assets/btn1.png" />
        <img v-else :src="hxConfig.moreBtn1" />
      </div>
    </div>
    <!-- <div class="banner">123</div> -->
    <bannerForXH
      v-if="state.xhBanner1.length"
      :bannerList="state.xhBanner1"
      @bannerVisitProps="bannerVisitProps"
      @bannerClickProps="bannerClickProps"
    />
    <div class="box-wrap" v-if="hxConfig.acCode2">
      <div class="box">
        <div class="item" v-for="item in state.huafeiCards" :key="item.id">
          <div class="it-time">
            {{ formatDateHandle(item.drawRuleVal) }}
            <!-- {{ formatDate(item.startDate, 'MM月DD日 HH:mm') }} -->
          </div>
          <div
            class="content"
            :style="{
              background: `url(${item.prizeImageUrl}) no-repeat center / contain`,
            }"
          >
            <!-- <div class="c-count">{{ item.prizeCount - item.usedCount }}</div> -->
            <div class="it-btn">
              <img
                v-if="btnStatus(item) === '即将开始'"
                src="../assets/btn0.png"
                @click="cardClick(item)"
              />
              <img
                v-if="btnStatus(item) === '立即抢'"
                src="../assets/btn2.png"
                @click="cardClick(item)"
              />
              <img
                v-if="btnStatus(item) === '已结束'"
                src="../assets/btn3.png"
                @click="cardClick(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="banner">123</div> -->
    <bannerForXH
      v-if="state.xhBanner2.length"
      :bannerList="state.xhBanner2"
      @bannerVisitProps="bannerVisitProps"
      @bannerClickProps="bannerClickProps"
    />
    <!-- <div class="tip"></div> -->
    <div class="act-time" v-if="hxConfig.bottomText">{{ hxConfig.bottomText }}</div>
    <Model
      v-if="state.isModalShow"
      :modelType="state.modelType"
      :curPrize="state.curPrize"
      :myPrizeList="state.myPrizeList"
      :modelTitle="state.modelTitle"
      :modelText="state.modelText"
      @closeHandle="closeHandle"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../store/index';
import { reactive, onMounted, getCurrentInstance, watch } from 'vue';
import Model from '@/components/Model.vue';
import { storeToRefs } from 'pinia';
import {
  QUERY_INFO_ALL,
  TEST,
  QUERY_STAR_FIRE_CONF,
  AWARD_QRY_LIST,
  EXCH_DRAW,
  ACT_DRAW,
  QUERY_SIGN_INFO,
  GET_PRIZE_LIST,
  BURY_LOG,
} from '../apis';
import bannerForXH from '../components/bannerForXH.vue';
// import hostConfig from '../config';

import {
  throttle,
  setTitle,
  getUid,
  showToast,
  getNetWorkType,
  terminal,
  compare,
  formatDate,
} from '../utils/common';

const { proxy } = getCurrentInstance();
const store = useStore();
const route = useRoute();
const router = useRouter();
const { name, hxConfig } = storeToRefs(store);
const SUCESS_CODE = 100000;
const state = reactive({
  isModalShow: false,
  modelType: '',
  modelTitle: '恭喜获得',
  modelText: '',
  curPrize: {},
  myPrizeList: [],
  huafeiCards: [] as any,
  xhBanner1: [],
  xhBanner2: [],
  isDrawVO: {},
  acStartTime: 0,
  acEndTime: 0,
  isJoin: false, //是否已经参加副活动
  isCardExposure: false,
});

// getUid();
onMounted(async () => {
  console.log('onMounted-home', store.hxConfig);

  // TEST({ phong: '18607168195' }).then(res => {
  //   console.log(888, res);
  // });
  await getActInfo();
  getXhBanner();
  getPrizeConfig();
  getPrize2();
  checkActTime();
  const json = {
    spm_value: 'aST20220901165351414.p1',
    action: '2',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
  };
  proxy.$buryDate(json);
});
// 测试mock数据
const testAxios = () => {
  // proxy.$axios.get('/mock/data').then(({ data: res }) => {
  //   console.log(res);
  // });
  // store.increment();
};

const clickDraw = async () => {
  console.log(state.isDrawVO);
  // 没机会
  if (!state.isDrawVO.remainingCount) {
    proxy.$turnPage(store.hxConfig.moreUrl1);
    return;
  }
  const json = {
    spm_value: 'aST20220901165351414.p1.m2.b2',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      position_click: {
        source_url: '',
        item_text: '立即领取',
      },
    },
  };
  proxy.$buryDate(json);
  // 不在活动时间
  if (!checkActTime()) return;
  const res = await ACT_DRAW({
    acCode: store.hxConfig.acCode1,
    uid: store.uid,
  });
  if (res.code == SUCESS_CODE) {
    console.log(res);
    state.curPrize = res.result;
    state.isModalShow = true;
    state.modelType = 'prizeBag';

    // 调all接口更新抽奖次数
    getActInfo();

    // 领取成功曝光
    const json = {
      spm_value: 'aST20220901165351414.p1.m4.b1',
      channel: store.urlParams.channel || 'self',
      uid: store.uid,
      action: '3',
      events: {
        /* fuyao_prize_exposure: {
          activity_accode: store.hxConfig.acCode1,
          prize_id: res.result.prizeId,
          prize_type: res.result.prizeType,
          prize_name: res.result.prizeName,
        }, */
        position_exposure: { source_url: '', item_text: '查看更多' },
      },
    };
    proxy.$buryDate(json);
  } else {
    console.log('抽奖失败');
    state.modelTitle = '活动太火爆了';
    state.modelText = '请稍后刷新重试';
    state.isModalShow = true;
    state.modelType = 'tips';
  }
};

const getActInfo = async () => {
  const params = {
    acCode: store.hxConfig.acCode1,
    uid: store.uid,
  };
  const res = await QUERY_INFO_ALL(params);
  if (res.code == SUCESS_CODE && res.result) {
    state.isDrawVO = res.result.isDrawVO;
    state.acStartTime = res.result.acStartTime;
    state.acEndTime = res.result.acEndTime;
  }
};

const getPrizeConfig = async () => {
  const params = {
    acCode: store.hxConfig.acCode2,
    uid: store.uid,
  };
  const res = await AWARD_QRY_LIST(params);
  if (res.code === SUCESS_CODE && res.result) {
    // const list = res.result.filter((item: any) => item.detailPicUrl).slice(0, 5);
    let toBeginArr = [] as any,
      beginArr = [] as any,
      endArr = [] as any;
    res.result.forEach(item => {
      item.drawRuleVal = JSON.parse(item.drawRuleVal);
      item.sortFlag =
        item.prizeCount - item.usedCount == 0
          ? 0
          : +new Date(item.drawRuleVal.startChangeTime.dateTime.replace(/-/g, '/')) || Infinity;
      let start = +new Date(item.drawRuleVal.startChangeTime.dateTime.replace(/-/g, '/')) || 0;
      let end = +new Date(item.drawRuleVal.endChangeTime.dateTime.replace(/-/g, '/')) || 0;
      if (start < +new Date() && +new Date() < end && item.prizeCount - item.usedCount !== 0) {
        // 已经开始
        beginArr.push(item);
      } else if (start > +new Date()) {
        // 即将开始
        toBeginArr.push(item);
      } else {
        // 已结束
        endArr.push(item);
      }
    });
    state.huafeiCards = [...beginArr, ...toBeginArr, ...endArr];
    // console.log(888, state.huafeiCards);

    // let sortList = res.result.sort(compare('sortFlag'));
    // drawRuleVal.endChangeTime.dateTime-startChangeTime
    // let canDrawArr = sortList.filter(item => {
    //   let start = +new Date(item.drawRuleVal.startChangeTime.dateTime.replace(/-/g, '/')) || 0;
    //   let end = +new Date(item.drawRuleVal.endChangeTime.dateTime.replace(/-/g, '/')) || 0;
    //   return start < +new Date() && +new Date() < end && item.prizeCount - item.usedCount !== 0;
    // });
    // // 先合并，后去重
    // let arr = [...canDrawArr, ...sortList];
    // let hash = {};
    // var newArr = arr.reduce((item, cur) => {
    //   hash[cur.prizeId] ? '' : (hash[cur.prizeId] = true && item.push(cur));
    //   return item;
    // }, []);
    // state.huafeiCards = newArr;

    // 立即抢曝光埋点
    if (state.isCardExposure) return;
    beginArr.forEach(item => {
      const json = {
        spm_value: 'aST20220901165351414.p1.m10.b1',
        channel: store.urlParams.channel || 'self',
        uid: store.uid,
        action: '3',
        events: {
          fuyao_prize_exposure: {
            activity_accode: store.hxConfig.acCode2,
            prize_id: item.prizeId,
            prize_type: item.prizeType,
            prize_name: item.prizeName,
          },
        },
      };
      proxy.$buryDate(json);
    });
  }
};

const getXhBanner = async () => {
  const { sceneGroupCode1, sceneGroupCode2 } = store.hxConfig;
  const codes = [sceneGroupCode1, sceneGroupCode2];
  try {
    let params = {
      sourceFrom: 'YUEYOU_APP',
      sceneGroupCode: codes.join(','),
      userId: store.uid,
      receiptType: 'SERVICE_C_0101',
      terminal: terminal(),
      network: getNetWorkType(),
    };
    if (!params.sceneGroupCode) return console.log('无展位码');
    const res = await QUERY_STAR_FIRE_CONF(params);
    console.log(res);
    if (res.code === '10000' && res.data) {
      state.xhBanner1 = res.data[sceneGroupCode1] || [];
      state.xhBanner2 = res.data[sceneGroupCode2] || [];
    }
  } catch (error) {
    console.log(error);
  }
};
const checkActTime = () => {
  // console.log(state.acStartTime, state.acEndTime);
  var text = '';
  const json = {
    spm_value: 'aST20220901165351414.p1.m1',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '3',
    events: {
      position_exposure: {
        item_text: text,
      },
    },
  };

  if (new Date().getTime() < state.acStartTime && state.acStartTime) {
    // 活动未开始
    state.modelTitle = '活动尚未开始';
    state.modelText = `活动开始时间：${formatDate(state.acStartTime)}`;
    state.isModalShow = true;
    state.modelType = 'tips';

    text = '活动未开始';
    proxy.$buryDate(json);
    return false;
  }
  if (new Date().getTime() > state.acEndTime && state.acEndTime) {
    // 活动已结束
    state.modelTitle = '活动已结束T_T';
    state.modelText = '敬请期待下期活动';
    state.isModalShow = true;
    state.modelType = 'tips';

    text = '活动已结束';
    proxy.$buryDate(json);
    return false;
  }
  return true;
};
const btnStatus = item => {
  const drawRuleVal = item.drawRuleVal;
  const startTime = +new Date(drawRuleVal.startChangeTime.dateTime.replace(/-/g, '/'));
  const endTime = +new Date(drawRuleVal.endChangeTime.dateTime.replace(/-/g, '/'));
  // console.log('=====>', startTime, endTime);

  if (endTime < +new Date() || item.prizeCount - item.usedCount == 0) {
    return '已结束';
  } else if (startTime > +new Date()) {
    return '即将开始';
  } else {
    return '立即抢';
  }
};
const cardClick = throttle(item => {
  const drawRuleVal = item.drawRuleVal;
  const startTime = +new Date(drawRuleVal.startChangeTime.dateTime.replace(/-/g, '/'));
  const endTime = +new Date(drawRuleVal.endChangeTime.dateTime.replace(/-/g, '/'));
  if (endTime < +new Date() || item.prizeCount - item.usedCount == 0) {
    console.log('已结束');
    proxy.$toast('话费已抢完，下次再来吧');
  } else if (+new Date(startTime) > +new Date()) {
    console.log('即将开始');
    proxy.$toast(store.hxConfig.noBeginToast);
  } else {
    console.log('立即抢');
    console.log(state.isJoin);

    if (state.isJoin) return proxy.$toast('您已抢到话费券了，把机会分享给其他人吧');
    // id-activityId-prizeId-prizeGroupId
    const params = {
      activityPrizeId: item.id,
      acCode: store.hxConfig.acCode2,
      uid: store.uid,
    };
    EXCH_DRAW(params).then((res: any) => {
      console.log(res);
      if (res.code == SUCESS_CODE) {
        state.curPrize = res.result;
        state.isModalShow = true;
        state.modelType = 'single';
        state.isCardExposure = true;
        // 更新-
        getPrize2();
      } else if (res.code == 110201) {
        /* 110201=>商品售罄 */
        proxy.$toast('红包已经抢光啦，下次再来领取好礼吧');
      } else {
        // console.log('抽奖失败');
        state.modelTitle = '活动太火爆了';
        state.modelText = '请稍后刷新重试';
        state.isModalShow = true;
        state.modelType = 'tips';
      }
      // 更新-
      getPrizeConfig();
    });
    // 按钮状态为立即抢时且用户点击埋点
    const json = {
      spm_value: 'aST20220901165351414.p1.m10.b1',
      channel: store.urlParams.channel || 'self',
      uid: store.uid,
      action: '1',
      events: {
        fuyao_check_prize: {
          activity_accode: store.hxConfig.acCode2,
          prize_id: item.prizeId,
          prize_type: item.prizeType,
          prize_name: item.prizeName,
        },
      },
    };
    proxy.$buryDate(json);
  }
}, 1000);

const goMyPrize = async () => {
  // 按钮点击
  const json = {
    spm_value: 'aST20220901165351414.p1.m2.b1',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      position_click: {
        source_url: '',
        item_text: '我的奖品',
      },
    },
  };
  proxy.$buryDate(json);
  // 主活动
  const params1 = {
    acCode: store.hxConfig.acCode1,
    uid: store.uid,
  };
  // 副活动
  const params2 = {
    acCode: store.hxConfig.acCode2,
    uid: store.uid,
  };
  let res1 = {} as any;
  let res2 = {} as any;

  if (params1.acCode) {
    res1 = await GET_PRIZE_LIST(params1);
  }
  if (params2.acCode) {
    res2 = await GET_PRIZE_LIST(params2);
  }
  // const res = await Promise.all([GET_PRIZE_LIST(params1), GET_PRIZE_LIST(params2)]);

  if (res1.code == SUCESS_CODE || res2.code == SUCESS_CODE) {
    const cancatArr = [...(res1.result || []), ...(res2.result || [])];

    const singlePrize = cancatArr.filter(item => !item.prizeBagContentList);
    const packagePrize = cancatArr.filter(item => item.prizeBagContentList);
    const allList = [];
    packagePrize.forEach(item => {
      allList.push(...(item.prizeBagContentList as []));
    });
    state.myPrizeList = [...singlePrize, ...allList] as [];

    if (state.myPrizeList.length > 0) {
      state.modelType = 'myPrize';
      // 曝光
      const json1 = {
        spm_value: 'aST20220901165351414.p1.m9.b1',
        channel: store.urlParams.channel || 'self',
        uid: store.uid,
        action: '3',
        events: {
          fuyao_prize_exposure: {
            activity_accode: '',
            prize_id: '',
            prize_type: '',
            prize_name: '',
          },
        },
      };
      proxy.$buryDate(json1);
    } else {
      state.modelType = 'tips';
      state.modelText = '这里空空的～T_T ，快去抽奖吧！';
    }
  } else {
    state.modelType = 'tips';
    state.modelText = '这里空空的～T_T ，快去抽奖吧！';
  }
  state.isModalShow = true;
  state.modelTitle = '我的奖品';
};
const getPrize2 = async () => {
  // 副活动
  const params2 = {
    acCode: store.hxConfig.acCode2,
    uid: store.uid,
  };
  const res = await GET_PRIZE_LIST(params2);
  if (res.code == SUCESS_CODE) {
    // 判断是否参加过副活动
    if (res.result.length > 0) {
      state.isJoin = true;
    }
  }
};
// 规则
const ruleClick = () => {
  router.push('/rule');
  // const src = `https://czyl.iyoudui.com/rich/text/ui/query?acCode=${state.acCode1}`; //正式
  const json = {
    spm_value: 'aST20220901165351414.p1.m2.b1',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      position_click: {
        source_url: '',
        item_text: '活动规则',
      },
    },
  };
  proxy.$buryDate(json);
};

const closeHandle = () => {
  state.isModalShow = false;
  state.modelType = '';
  state.modelTitle = '';
  state.modelText = '';
};
const formatDateHandle = drawRuleVal => {
  let startTime = drawRuleVal.startChangeTime.dateTime;
  // let endTime = drawRuleVal.endChangeTime.dateTime;
  // console.log(999, formatDate(startTime, 'MM月DD日 HH:mm'));
  return formatDate(startTime, 'MM月DD日 HH:mm');
};
const bannerVisitProps = (item, index) => {
  const { sceneGroupCode1, sceneGroupCode2 } = store.hxConfig;
  // console.log('bannerVisitProps', item, index);
  const spm_d2v = getD2vSpm(item);
  const json1 = {
    spm_value: spm_d2v,
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '3',
    events: {
      ad_exposure: {
        ad_unit_id: item.sceneCode,
        ad_idea_id: item.ideaId,
        ad_spm_value:
          item.sceneGroupCode == sceneGroupCode1
            ? 'aST20220902105620073.p1.m1.b1'
            : 'aST20220902105620073.p1.m2.b1', //item.spm,
        source_url: item.ideaUrl ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || '' : '',
      },
    },
  };
  proxy.$buryDate(json1);
};
const bannerClickProps = (item, index) => {
  // console.log('bannerClickProps', item, index);
  const { sceneGroupCode1, sceneGroupCode2 } = store.hxConfig;
  const spm_d2v = getD2vSpm(item);
  const json = {
    spm_value: spm_d2v,
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      ad_click: {
        ad_unit_id: item.sceneCode,
        ad_idea_id: item.ideaId,
        ad_spm_value:
          item.sceneGroupCode == sceneGroupCode1
            ? 'aST20220902105620073.p1.m1.b1'
            : 'aST20220902105620073.p1.m2.b1', //item.spm
        source_url: item.ideaUrl ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || '' : '',
      },
    },
  };
  // proxy.$buryDate(json);
  proxy.$buryDate(json);
  setTimeout(() => {
    proxy.$turnPage(item.ideaUrl.viewUrl || item.ideaUrl.originalLink);
  }, 50);
};
const getD2vSpm = (item = {} as any) => {
  const { sceneGroupCode1, sceneGroupCode2 } = store.hxConfig;
  let spm_d2v = '';
  switch (item.sceneGroupCode) {
    case sceneGroupCode1:
      spm_d2v = 'aST20220901165351414.p1.m11.b1' + '_' + item.nth;
      break;
    case sceneGroupCode2:
      spm_d2v = 'aST20220901165351414.p1.m12.b1' + '_' + item.nth;
      break;
    default:
      spm_d2v = '';
      break;
  }
  return spm_d2v;
};

watch(hxConfig, (newVal, oldVal) => {
  console.log(212, newVal, oldVal);
});
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
img {
  width: 100%;
  height: 100%;
}
.home {
  min-height: 100vh;
  height: 100%;
  background: #fec182ff url('../assets/bj.png') no-repeat center top;
  background-size: contain;
}
.rule {
  position: absolute;
  z-index: 2;
  top: 26px;
  right: 30px;
  width: 120px;
  height: 30px;
  // border: 1px solid red;
}
.my-prize {
  position: fixed;
  z-index: 2;
  top: 200px;
  right: 0;
  width: 43px;
  height: 142px;
  background: url('../assets/my-prize.png') no-repeat center / 100% 100%;
}

.main {
  width: 750px;
  height: 990px;
  overflow: hidden;
  .title {
    margin: 90px auto;
    width: 696px;
    height: 178px;
  }
  .card-wrap {
    display: flex;
    justify-content: space-evenly;
    margin: 90px auto;
    width: 100%;
    height: 282px;
    // border: 1px solid green;
    img {
      width: 210px; //190
      height: 302px; //282
    }
  }
  .btn {
    margin: 0 auto;
    margin-top: -20px;
    width: 474px;
    height: 128px;
    // background: url('../assets/btn1.png') no-repeat center / 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.banner {
  width: 702px;
  height: 169px;
  border: 1px solid red;
  margin: 0 auto;
}
.box-wrap {
  margin: 15px auto;
  padding: 80px 15px 30px;
  width: 710px;
  height: 440px;
  background: url('../assets/box-bg.png') no-repeat center / 100% 100%;
  .box {
    display: flex;
    flex-wrap: nowrap;
    justify-content: start;
    margin: 8px auto 0;
    height: 100%;
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      flex-shrink: 0;
      margin-right: 2px;
      width: 200px;
      height: 284px;
      // border: 1px solid green;
      .it-time {
        margin: 10px auto;
        width: 180px;
        text-align: center;
        font-size: 22px;
        font-weight: 500;
        color: rgba(255, 115, 0, 1);
        border-radius: 16px;
        background-color: #fff;
      }
      .content {
        position: relative;
        width: 200px;
        height: 250px;
        // border: 1px solid gray;
        overflow: hidden;
        // background: url('https://ctopmweb-cdn.iyoudui.com/images/dxBirth/quan1.png') no-repeat center;
        // background-size: 100% 100%;
        .c-count {
          margin: 0 auto;
          width: 120px;
          height: 36px;
          background-color: rgba(246, 203, 147, 0.7);
          border-radius: 0 0 30px 30px;
          font-size: 24px;
          color: rgba(223, 60, 59, 1);
          text-align: center;
          vertical-align: top;
        }
        .it-btn {
          // position: absolute;
          // bottom: 40px;
          // left: 50%;
          // transform: translateX(-50%);
          margin: 172px auto 0; //140
          width: 117px;
          height: 45px;
          font-size: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .item3 {
    padding: 0 42px;
  }
}
.tip {
  margin: 100px auto 20px;
  width: 342px;
  height: 60px;
  background: url('https://ctopmweb-cdn.iyoudui.com/images/dxBirth/zfb-bottom.png') no-repeat center /
    cover;
}
.act-time {
  margin: 0 auto;
  line-height: 100px;
  text-align: center;
  color: rgba(51, 51, 51, 1);
  font-size: 26px;
}
</style>
