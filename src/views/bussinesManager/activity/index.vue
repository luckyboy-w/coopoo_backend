<template>
  <div>
    <div class="ly-container" v-if="showIndex">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;margin-top: 30px;">
        <div class="tabTd" @click="getActivityList('1')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              限时抢购
            </div>
            <div style="line-height: 40px;">
              限时限量，火爆抢购
            </div>
          </div>
        </div>
        <div class="tabTd" @click="getActivityList('2')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              新人礼
            </div>
            <div style="line-height: 40px;">
              新人有礼，促注册
            </div>
          </div>
        </div>
        <!-- <div class="tabTd" @click="getActivityList('3')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              注册送优惠券
            </div>
            <div style="line-height: 40px;">
              注册就送优惠券，提高注册率
            </div>
          </div>
        </div>
        <div class="tabTd" @click="getActivityList('4')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              买VIP送优惠券
            </div>
            <div style="line-height: 22px;">
              买VIP就送优惠券，提高购买率
            </div>
          </div>
        </div> -->
        <div class="tabTd" @click="getActivityList('6')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              砍价
            </div>
            <div style="line-height: 22px;">
              邀请朋友帮砍，裂变传播提销量
            </div>
          </div>
        </div>
        <div class="tabTd" @click="getActivityList('5')">
          <div style="width: 100px;height: 100px;">
            <img style="width: 100%;height: 100%;"
              src="https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png" />
          </div>
          <div style="padding-left: 25px;">
            <div style="line-height: 40px;font-size: 20px;font-weight: 600;">
              拼团
            </div>
            <div style="line-height: 40px;">
              拼单成团，裂变获客，促转化
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
    filters: {},
    name: '',
    props: [''],
    data() {
      return {
        showIndex: true,
        showActivityList: false,
        type: '',
      };
    },
    components: {
      activityList,
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

  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
