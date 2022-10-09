<template>
  <div>
    <div class="ly-container" v-if="showIndex">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;margin-top: 30px;">
        <div class="tabTd" v-for="(valItem, index) in dataList" :key="index"  @click="getActivityList(valItem.value)">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              :src="valItem.image" />
          </div>
          <div style="padding-left: 25px;height: 100px;">
            <div style="line-height: 45px;font-size: 20px;font-weight: 600;">
              {{valItem.title}}
            </div>
            <div style="line-height: 25px;">
              {{valItem.describe}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <activityList v-if="showActivityList" :type="type" @hiddenActivityList="hiddenActivityList()">
    </activityList>
  </div>
</template>

<script>
  import activityList from "./activityList";
  import {
    getUploadUrl,
    postMethod,
    getMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"

  export default {
    components: {
      activityList,
    },
    filters: {},
    name: '',
    props: [''],
    data() {
      return {
        showIndex: true,
        showActivityList: false,
        type: '',
        dataList:[{
          image:require('../../../assets/image/flashSale.png'),
          title:'限时抢购',
          describe:'限时限量，火爆抢购',
          value:'1',
        },{
          image:require('../../../assets/image/newPeople.png'),
          title:'新人礼',
          describe:'新人有礼，促注册',
          value:'2',
        },{
          image:require('../../../assets/image/coupon.png'),
          title:'注册送优惠券',
          describe:'注册就送优惠券，提高注册率',
          value:'3',
        },{
          image:require('../../../assets/image/member.png'),
          title:'买VIP送优惠券',
          describe:'买VIP就送优惠券，提高购买率',
          value:'4',
        },{
          image:require('../../../assets/image/bargain.png'),
          title:'砍价',
          describe:'邀请朋友帮砍，裂变传播提销量',
          value:'5',
        },{
          image:require('../../../assets/image/groupBuying.png'),
          title:'拼团',
          describe:'拼单成团，裂变获客，促转化',
          value:'6',
        },]
      };
    },
    beforeMount() {},

    mounted() {},

    methods: {
      getActivityList(row) {
        console.log(row)
        this.type = row
        this.showActivityList = true
        this.showIndex = false
      },
      hiddenActivityList() {
        this.showActivityList = false
        this.showIndex = true
      },
    },
  }
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {

      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }
  }

  .tabTd {
    width: 332px;
    display: flex;
    flex-wrap: nowrap;
    margin: 20px 30px;
    align-items: center;
    border: 1px solid #c7c7c7;
    padding: 10px;
    border-radius: 15px;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
