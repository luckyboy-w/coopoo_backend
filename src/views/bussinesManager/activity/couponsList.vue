<template>
  <div>
    <div style="padding:20px 10px" v-if="showActivityCouponList">
      <div class="ly-tool-panel">
        <div class="tabTd">
        <el-button style="margin-bottom: 10px" @click="backToActivityList()" type="primary" icon="el-icon-back">返回活动列表</el-button>
        </div>
      </div>
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>优惠券名称：</div>
          <div>
            <el-input v-model="searchParam.couponName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">查询</el-button>
          <el-button plain type="primary" @click="save('add')" icon="el-icon-document-add">编辑</el-button>
        </div>
      </div>
      <div class="ly-table-panel" :loading="isLoading">
        <el-table ref="mainTable" :data="tableData.list" row-key="id"
                  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"
                  border >
          <el-table-column prop="couponName" label="优惠券名称"/>
          <el-table-column prop="couponPrice" label="优惠券价格"/>
          <el-table-column v-if="settleMethod==1" prop="supplierSettleRatio" label="供应商比例" >
            <template slot-scope="scope">
              {{ scope.row.supplierSettleRatio}}%
            </template>
          </el-table-column>
          <el-table-column v-if="settleMethod==1" prop="storeSettleRatio" label="门店比例" >
            <template slot-scope="scope">
              {{ scope.row.storeSettleRatio}}%
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="settleMethod==1" prop="storeProfitRatio" label="门店利润比例" >
            <template slot-scope="scope">
              {{ scope.row.storeProfitRatio}}%
            </template>
          </el-table-column> -->
          <el-table-column label="活动有效期" width="350px">
            <template slot-scope="scope">
              {{ scope.row.startTime }} 至 {{scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="disabled" @click.native.prevent="deleteGoods(scope.row)">删除</el-button>
              <!-- <el-button type="text" size="small" @click.native.prevent="present(scope.row.supplierId, scope.row.supplierName)">查看</el-button>
              <el-button type="text" size="small" @click.native.prevent="update(scope.row.supplierId, scope.row.supplierName)">修改</el-button>
              <el-button type="text" size="small" v-if="scope.row.enable == 1" @click.native.prevent="disable(scope.row.id)">禁用</el-button>
              <el-button type="text" size="small" v-if="scope.row.enable == 0" @click.native.prevent="enable(scope.row.id)">启用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
                     :current-page="searchParam.pageNum"     @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>

    <editCoupon v-if="showSave" :activity="activity" @hiddenSave="hiddenSave()"></editCoupon>


  </div>
</template>

<script>
import editCoupon from "./editCoupon";
import { getMethod , postMethod } from '@/api/request'
import { formatDate } from "@/api/tools.js"

export default {
  filters: {
    _formateDate(time) {
      if (time == undefined) {
        return '';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  name:'',
  props: {
    activityData: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      settleMethod:'2',
      disabled:false,
      isLoading: false,
      showActivityCouponList: true,
      showSave: false,
      showUpdate: false,
      showPresent: false,
      showPagination: false,
      activity: null,
      tableData: {
        list: []
      },
      searchParam:{
        pageSize:10,
        pageNum:1
      }
    };
  },
  components: {editCoupon},
  computed: {},
  beforeMount() {},

  mounted() {
    this.initSettlementMethod()
    if(this.activityData.enable==1){
      this.disabled=true
    }
    this.activity = this.activityData
    this.searchParam.activityId = this.activityData.id;
    this.loadList();
  },

  methods: {
    loadList() {
      const scope = this;
      if (!scope.isLoading) {
        scope.isLoading = true
      }
      postMethod("/activity/coupon-list", this.searchParam).then(res => {
        this.loading = false
        if (res.errCode != 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        scope.tableData.list = res.data.records
        scope.tableData.total = res.data.total
        scope.showPagination = scope.tableData.total == 0
      });
    },
    initSettlementMethod() {
      getMethod("settlement/current-settle-method").then(
        res => {
          this.settleMethod = res.data.currentSettleMethod
        }
      );
    },
    search() {
		this.searchParam.pageNum = 1;
      this.loadList();
    },

    save() {
      this.showActivityCouponList = false
      this.showSave = true
    },
    deleteGoods(row){
      getMethod("/activity/coupon-remove?id="+row.id).then(res => {
        this.$message({
          message: "操作成功",
          type: 'success'
        });
        this.loadList()
      });
    },

    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },

    hiddenSave() {
      this.showActivityCouponList = true
      this.showSave = false
      this.loadList()
    },
    backToActivityList() {
      this.$emit('hiddenCouponsList')
    }

  },

  watch: {}

}

</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {

      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }
  }
  .tabTd {
     display: flex;
     flex-wrap: nowrap;
     margin: 7px 10px;
     align-items: center;

   }
</style>
