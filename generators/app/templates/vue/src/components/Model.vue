<template>
  <div class="mask">
    <!-- 奖品包弹框 -->
    <div class="box1-wrap" v-if="modelType == 'prizeBag'">
      <div class="wrap-write">
        <div class="wrap-line">
          <div class="title">
            <img src="../assets/left.png" /><span>恭喜获得</span><img src="../assets/right.png" />
          </div>
          <div class="item" v-for="item in curPrize.prizeBagContentList" :key="item.id">
            <div class="item-card">
              <img class="left" :src="item.prizeImageUrl" />
              <div class="center">
                <p>{{ item.prizeName }}</p>
                <p>{{ item.prizeDesc }}</p>
              </div>
              <div class="right">
                <img src="../assets/btn4.png" @click="toUse(item)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-bottom">
        <img :src="store.hxConfig.moreBtn2" @click="goMore" />
      </div>
      <div class="close" @click="closeHandle"></div>
    </div>
    <!-- 我的奖品 -->
    <div class="box2-wrap" v-if="modelType == 'myPrize'">
      <div class="wrap-write">
        <div class="wrap-line">
          <div class="title">
            <img src="../assets/left.png" /><span>我的奖品</span><img src="../assets/right.png" />
          </div>
          <div class="item-box">
            <div class="item" v-for="item in myPrizeList" :key="item.prizeId">
              <img class="left" :src="item.prizeImageUrl" />
              <div class="center">
                <p>{{ item.prizeName }}</p>
                <p>{{ item.prizeDesc }}</p>
              </div>
              <div class="right">
                <img v-if="!item.remark" @click="toUse(item)" src="../assets/btn4.png" />
                <img v-if="item.remark" src="../assets/btn6.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-bottom-low"></div>
      <div class="close" @click="closeHandle"></div>
    </div>
    <!-- 提示弹框 -->
    <div class="box3-wrap" v-if="modelType == 'tips'">
      <div class="wrap-write">
        <div class="wrap-line">
          <div class="title">
            <img src="../assets/left.png" /><span>{{ modelTitle }}</span
            ><img src="../assets/right.png" />
          </div>
          <div class="text">{{ modelText }}</div>
        </div>
      </div>
      <div class="box-bottom-low"></div>
      <div class="close" @click="closeHandle"></div>
    </div>
    <!-- 单个奖品 -->
    <div class="single-prize-wrap" v-if="modelType == 'single'">
      <div class="prize">
        <img class="left" :src="curPrize.prizeImageUrl" />
        <div class="right">
          <p>{{ curPrize.prizeName }}</p>
          <p>{{ curPrize.prizeDesc }}</p>
          <!-- <p>{{ curPrize.prizeExt }}</p> -->
        </div>
      </div>
      <div class="btn-use" @click="toUse(curPrize)">
        <img src="../assets/btn7.png" alt="" />
      </div>
      <div class="close" @click="closeHandle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, getCurrentInstance, defineProps, defineEmits } from 'vue';
import { useStore } from '../store';
import { BURY_LOG } from '../apis';
const { proxy } = getCurrentInstance();
const store = useStore();
const props = defineProps(['myPrizeList', 'curPrize', 'modelType', 'modelTitle', 'modelText']);
const emit = defineEmits(['closeHandle']);
onMounted(() => {
  // console.log(123, props.modelType);
});
const closeHandle = () => {
  emit('closeHandle');
};
const goMore = () => {
  console.log('goMore', store.hxConfig.moreUrl2);
  proxy.$turnPage(store.hxConfig.moreUrl2);
  // 领取成功弹窗按钮点击埋点
  const json = {
    spm_value: 'aST20220901165351414.p1.m4.b1',
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      /* fuyao_check_prize: {
        activity_accode: '',
        prize_id: props.curPrize.id,
        prize_name: props.curPrize.prizeName,
        prize_type: props.curPrize.prizeType,
      }, */
      position_click: {
        source_url: store.hxConfig.moreUrl2,
        item_text: '查看更多',
      },
    },
  };
  proxy.$buryDate(json);
};
const toUse = item => {
  let spm_value = '';
  const url = item.prizeVerifyUrl;

  if (props.modelType == 'myPrize') {
    spm_value = 'aST20220901165351414.p1.m9.b1';
  } else {
    spm_value = 'aST20220901165351414.p1.m4.b1';
  }
  const json = {
    spm_value: spm_value,
    channel: store.urlParams.channel || 'self',
    uid: store.uid,
    action: '1',
    events: {
      fuyao_check_prize: {
        activity_accode: '',
        prize_id: item.id,
        prize_name: item.prizeName,
        prize_type: item.prizeType,
      },
    },
  };
  proxy.$buryDate(json);

  proxy.$turnPage(url);
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 750px;
  min-height: 100vh;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box1-wrap {
  position: relative;
  display: flex;
  // flex-direction: column;
  justify-content: center;
  padding: 12px;
  width: 600px;
  height: auto;
  background: linear-gradient(
    90deg,
    #e83b0c 0.46%,
    #f13f0f 6.61%,
    #fd8b42 50.03%,
    #f03c0d 93.92%,
    #e43a0b 99.91%
  );
  border-radius: 20px;
  .wrap-write {
    display: flex;
    justify-content: center;
    padding: 12px;
    width: 570px;
    min-height: 500px;
    // height: auto;
    background-color: #f8ebe6;
    border-radius: 20px;
  }
  .box-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 602px;
    height: 224px;
    text-align: center;
    background: url('../assets/bottom1.png') no-repeat center / 100% 100%;
    img {
      margin-top: 85px;
      width: 490px; //482
      height: 110px; //100
    }
  }

  .wrap-line {
    padding: 15px;
    padding-bottom: 200px;
    width: 540px;
    border: 0.5px solid #ccc;
    border-radius: 20px;
    .title {
      font-family: 'Source Han Serif CN';
      font-style: normal;
      font-weight: 900;
      font-size: 35px;
      line-height: 35px;
      text-align: center;
      color: #af7623;
      span {
        margin: 0 10px;
      }
      img {
        width: 47px;
        height: 20px;
      }
    }
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      width: 470px;
      height: 158px;
      background: #fe8b42;
      border-radius: 20px;
      .item-card {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        width: 442px;
        height: 128px;
        background: url('../assets/card-bg.png') no-repeat center / contain;
        .left {
          width: 90px;
          height: 90px;
        }
        .center {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          width: 190px;
          height: 90px;
          // border: 1px solid red;
          p {
            width: 180px;
            font-weight: 700;
            font-size: 22px;
            line-height: 28px;

            color: #c48238;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p:nth-child(2) {
            font-weight: 400;
            font-size: 20px;
            line-height: 20px;
          }
        }
        .right {
          width: 1.2rem;
          height: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 1.3rem;
            height: 0.5rem;
          }
        }
      }
    }
  }
}
.close {
  position: absolute;
  left: 50%;
  bottom: -80px;
  transform: translateX(-50%);
  width: 55px;
  height: 55px;
  background: url('https://xiaojinhe-cdn.iyoudui.com/niudan/close.png') no-repeat center/contain;
}

//  我的奖品弹框
.box2-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 12px;
  width: 600px;
  height: auto;
  background: linear-gradient(
    89.67deg,
    #e83b0c 0.46%,
    #f13f0f 6.61%,
    #fd8b42 50.03%,
    #f03c0d 93.92%,
    #e43a0b 99.91%
  );
  border-radius: 20px;
  .wrap-write {
    display: flex;
    justify-content: center;
    padding: 12px;
    width: 570px;
    min-height: 300px;
    // max-height: 800px;
    background-color: #f8ebe6;
    border-radius: 20px;
  }
  .box-bottom-low {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 602px;
    height: 116px;
    background: url('../assets/bottom2.png') no-repeat center / 100% 100%;
  }
  .wrap-line {
    padding: 15px;
    // overflow: hidden;
    padding-bottom: 100px;
    width: 540px;
    border: 0.5px solid #ccc;
    border-radius: 20px;
    .title {
      font-family: 'Source Han Serif CN';
      font-style: normal;
      font-weight: 900;
      font-size: 35px;
      line-height: 35px;
      text-align: center;
      color: #af7623;
      margin: 10px 0;
      span {
        margin: 0 10px;
      }
      img {
        width: 47px;
        height: 20px;
        // vertical-align: baseline;
      }
    }
    .item {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 20px auto;
      width: 444px;
      height: 102px;
      background: rgb(243, 228, 216);
      border-radius: 5px;
      .left {
        width: 90px;
        height: 90px;
      }
      .center {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 190px;
        height: 90px;
        // border: 1px solid red;
        p {
          width: 180px;
          font-weight: 700;
          font-size: 22px;
          line-height: 28px;

          color: #c48238;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p:nth-child(2) {
          font-weight: 400;
          font-size: 20px;
          line-height: 20px;
        }
      }
      .right {
        width: 1.2rem;
        height: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 1.3rem;
          height: 0.5rem;
        }
      }
    }
  }
  .item-box {
    max-height: 800px;
    overflow-y: scroll;
  }
}

// 提示弹框
.box3-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 12px;
  width: 600px;
  height: auto;
  background: linear-gradient(
    89.67deg,
    #e83b0c 0.46%,
    #f13f0f 6.61%,
    #fd8b42 50.03%,
    #f03c0d 93.92%,
    #e43a0b 99.91%
  );
  border-radius: 20px;
  .wrap-write {
    display: flex;
    justify-content: center;
    padding: 12px;
    width: 570px;
    min-height: 260px;
    background-color: #f8ebe6;
    border-radius: 20px;
  }
  .box-bottom-low {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 602px;
    height: 116px;
    background: url('../assets/bottom2.png') no-repeat center / 100% 100%;
  }
  .wrap-line {
    padding: 15px;
    padding-bottom: 50px;
    width: 540px;
    border: 0.5px solid #ccc;
    border-radius: 20px;
    .title {
      font-family: 'Source Han Serif CN';
      font-style: normal;
      font-weight: 900;
      font-size: 35px;
      line-height: 35px;
      text-align: center;
      color: #af7623;
      span {
        margin: 0 10px;
      }
      img {
        width: 47px;
        height: 20px;
      }
    }
    .text {
      margin-top: 50px;
      // border: 1px solid red;
      font-size: 20px;
      line-height: 29px;
      text-align: center;
      color: #353535;
      opacity: 0.8;
    }
  }
}
.single-prize-wrap {
  position: relative;
  width: 606px;
  height: 645px;

  background: url('../assets/single-bg.png') no-repeat center / contain;
  .prize {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 150px auto 0;
    padding: 20px 0;
    height: 215px;
    width: 480px;
    .left {
      width: 180px;
      height: 180px;
      // border: 1px solid green;
    }
    .right {
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      flex: 1;
      padding: 0.2rem;
      margin-left: 0.1rem;
      height: 100%;
      p {
        font-weight: 600;
        font-size: 0.5rem; //.62rem
        color: #f63636;
        max-width: 3.5rem;
      }
      p:nth-child(1) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p:nth-child(2) {
        margin: 0.2rem 0;
        font-weight: 500;
        font-size: 0.37rem;
        /* 超出的部分隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      // p:nth-child(3) {
      //   font-weight: 400;
      //   font-size: 0.35rem;
      // }
    }
  }
  .btn-use {
    margin: 110px auto 0;
    width: 482px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>