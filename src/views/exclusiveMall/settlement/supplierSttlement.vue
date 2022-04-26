<template>
  <div class="bill-tab-list" >
    <div style="margin: 30px;" >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未结算" name="readyBill">
        <span slot="label" class="my-tab-label">未结算</span>
        <nvlBill v-if="nvlBill"   />
      </el-tab-pane>
      <el-tab-pane label="可结算" name="settleFinsh">
        <span slot="label" class="my-tab-label">可结算</span>
        <startBill v-if="startBill"   />
      </el-tab-pane>
      <el-tab-pane label="已结算" name="settleEnd">
        <span slot="label" class="my-tab-label">已结算</span>
        <finshBill v-if="finshBill"   />
      </el-tab-pane>

      <!-- <el-tab-pane label="明细" name="dataDtl" v-if="dataDtl" >
        <span slot="label" class="my-tab-label">明细</span>
      </el-tab-pane> -->

    </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  getMethod,
  postMethod
} from '@/api/request'
  import orderDtl from './orderDtl'
  import nvlBill from './nvlBill'
  import startBill from './startBill'
  import finshBill from './finshBill'

import {
  formatDate
} from '@/api/tools.js'
import {
  getToken
} from '@/utils/auth'

export default {
  components: {
    orderDtl,nvlBill,startBill,finshBill
  },
  data() {
    return {
      nvlBill:true,
      startBill:false,
      finshBill:false,
      activeName: 'readyBill',

    }
  },
  filters: {

  },
  mounted() {

  },
  methods: {

    handleClick(tab, event) {
      this.tabIndex = tab.index
      if (tab.index == 0) {
        this.nvlBill = true
        this.startBill = false
        this.finshBill = false

      } else if (tab.index == 1) {
       this.nvlBill = false
       this.startBill = true
       this.finshBill = false
      } else if (tab.index == 2) {
       this.nvlBill = false
       this.startBill = false
       this.finshBill = true
      }
    },

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$table-list-height: 6vh;

.my-tab-label {
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  //color: $fontColor;
  font-size: 16px;
  padding: 0px 10px;
}

.bill-tab-list > > > .el-tabs__nav-wrap {
  overflow: hidden;
  margin-bottom: -1px;
  position: relative;
  background: #F6F6F6;
}

.bill-tab-list > > > .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
  z-index: 1;
}

.bill-tab-list > > > .el-tabs__nav-scroll {
  overflow: hidden;
  height: $table-list-height;
  padding-left: 10px;
}

.bill-tab-list > > > .el-tabs__item {
  padding: 0 20px;
  height: $table-list-height;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: $table-list-height;
  display: inline-block;
  list-style: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  //color: #939393;
  position: relative;
}
.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;

}

</style>
