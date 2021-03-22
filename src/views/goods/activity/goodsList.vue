<template>
  <div>
    <div style="padding:20px 10px" v-if="showActivityGoodList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>商品名称:</td>
            <td>
              <el-input v-model="searchParam.goodName" width="180px"></el-input>
            </td>
            <td>供应商名称：</td>
            <td>
              <el-select v-model="searchParam.tenantId" placeholder="请选择">
                <el-option value="" label="全部"/>
                <el-option
                  v-for="item in supplyList"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id"
                />
              </el-select>
            </td>
            <td>活动有效期</td>
            <td>
              <el-date-picker v-model="searchParam.activityStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期"/>
            </td>
            <td style="text-align: center;">-</td>
            <td>
              <el-date-picker v-model="searchParam.activityEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期"/>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">查询</el-button>
              <el-button plain type="primary" @click="save('add')" icon="el-icon-document-add">新增</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel" v-loading="isLoading">
        <el-table ref="mainTable" :data="tableData.list" row-key="id"
                  border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.goodSkuValList" style="width: 100%; margin-bottom: 20px;" border>
                <el-table-column prop="skuText" label="sku属性"/>
                <el-table-column prop="marketingStock" label="库存"/>
                <el-table-column prop="saleMemPrice" label="会员价"/>
                <el-table-column prop="marketingPrice" label="活动价"/>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="goodName" label="商品名称"/>
          <el-table-column prop="activityName" label="活动名称"/>
          <el-table-column prop="supplierName" label="供应商名称" width="400px"/>
          <el-table-column prop="supplierRebateRatio" label="供应商比例" width="400px">
            <template slot-scope="scope">
              {{ scope.row.supplierRebateRatio}}%
            </template>
          </el-table-column>
          <el-table-column prop="providerRebateRatioE" label="E类服务商比例" width="400px">
            <template slot-scope="scope">
              {{ scope.row.providerRebateRatioE}}%
            </template>
          </el-table-column>
          <el-table-column label="活动有效期" width="400px">
            <template slot-scope="scope">
              {{ scope.row.activityStartTime | _formateDate}} 至 {{scope.row.activityEndTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="present(scope.row.supplierId, scope.row.supplierName)">查看</el-button>
              <el-button type="text" size="small" @click.native.prevent="update(scope.row.supplierId, scope.row.supplierName)">修改</el-button>
              <el-button type="text" size="small" @click.native.prevent="disable()">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
                         @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>

    <save v-if="showSave" :activity="activity" @hiddenSave="hiddenSave()"></save>
    <update v-if="showUpdate" :activity="activity" @hiddenUpdate="hiddenUpdate()"></update>
    <present v-if="showPresent" :activity="activity" @hiddenUpdate="hiddenPresent()"></present>
  </div>
</template>

<script>
import save from "./save";
import update from "./update";
import present from "./present";
import { getMethod } from '@/api/request'
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
      isLoading: false,
      showActivityGoodList: true,
      showSave: false,
      showUpdate: false,
      showPresent: false,
      showPagination: false,
      activity: null,
      tableData: {
        list: []
      },
      supplyList: [],
      searchParam:{
        goodActivityId: null,
        tenantId: null
      }
    };
  },
  components: {present, save, update },
  computed: {},
  beforeMount() {},

  mounted() {
    this.activity = this.activityData
    this.searchParam.goodActivityId = this.activityData.id;
    this.initSupplyList();
    this.loadList();
  },

  methods: {
    initSupplyList() {
      getMethod('/backend/supplier/findList', {}).then(res => {
        this.supplyList = res.data
      })
    },

    loadList() {
      const scope = this;
      if (!scope.isLoading) {
        scope.isLoading = true
      }
      getMethod("/backend/goodActivity/findMarketingGood", this.searchParam).then(res => {
        scope.tableData = res.data
        scope.isLoading = false
        scope.showPagination = scope.tableData.total == 0
      });
    },

    search() {
      this.loadList();
    },

    save() {
      this.showActivityGoodList = false
      this.showSave = true
    },

    present(supplierId, supplierName) {
      this.showActivityGoodList = false
      this.showPresent = true
      this.activity.supplierId = supplierId
      this.activity.supplierName = supplierName
    },

    update(supplierId, supplierName) {
      this.showActivityGoodList = false
      this.showUpdate = true
      this.activity.supplierId = supplierId
      this.activity.supplierName = supplierName
    },

    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },

    hiddenSave() {
      this.showActivityGoodList = true
      this.showSave = false
      this.loadList()
    },

    hiddenUpdate() {
      this.showActivityGoodList = true
      this.showUpdate = false
      this.activity.supplierId = null
      this.activity.supplierName = supplierName
      this.loadList()
    },

    hiddenPresent() {
      this.showActivityGoodList = true
      this.showPresent = false
      this.activity.supplierId = null
      this.activity.supplierName = supplierName
    },

    disable() {

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
      div {
        display: inline;
      }

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
</style>
