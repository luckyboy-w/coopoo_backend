<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <table>
        <tr>
          <td>供应商名称</td>
          <td> <el-input
            v-model="searchParam.tenantName"
            style="width:150px"
            placeholder="请输入..."
          /></td>
          <td style="padding-left: 20px;"><el-button @click="search()" type="primary">
            搜索
          </el-button></td>
        </tr>
      </table>
      <el-table
        ref="noBillData"
        :data="noBillData.list"
        style="width: 100%; margin-bottom: 20px;"
        row-key="id"
      >
        <el-table-column
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column
          prop="tenantName"
          label="供应商名称"
          min-width="20%"
        />
        <el-table-column
          prop="totalAmount"
          label="支付金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.totalAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="billMoney"
          label="结算金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.billMoney | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pkBillId"
          label="操作"
          min-width="24%"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="findBillDtl(scope.row)"
            >
              查看明细
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="noBillData.total"
        background
        layout="prev, pager, next"
        @current-change="currentPage"
        @prev-click="currentPage"
        @next-click="currentPage"
      />
    </div>
    <billDetail
      v-if="!showList"
      ref="billDetail"
      :detail-list="detailList"
      @backToList="backToList"
    />
  </div>
</template>
<script>
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"
  import billDetail from './billDtl'

  export default {
    components: {
      billDetail
    },
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      fmtFee(fee) {
        if (fee == undefined) {
          return '';
        }
        fee = fee + ''
        if (fee.indexOf(".") == -1) {
          return fee + ".00";
        }
        return fee;
      }
    },
    props: {

    },
    data() {
      return {
        tabIndex: 0,
        showList: true,
        detailList: [],
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          tenantName:'',
          billNo: "",
          orderNo: "",
          pageSize: 15,
          pageNum: 1
        },
        noBillData: {
          list: [],
          total: 0
        },
        activeName: 'noBill'
      };
    },
    mounted() {
      this.loadList();
    },
    methods: {
      search() {
        let that = this
        let param = this.searchParam
        postMethod("/backend/orderBill/findPlatBillList", param).then(res => {
          that.noBillData = res.data // 返回的数据

        })
      },
      backToList() {
        this.showList = true
      },
      batchBill() {
        let selData = this.$refs.noBillData.selection
        let id = [];
        selData.forEach(data => {
          id.push(data.pkBillId)
        });
        this.billOrd(id.join(","))
      },
      singleBill(row) {
        this.billOrd(row.pkBillId)
      },
      findBillDtl(row) {
        let scope = this
        let param = {
          tenantId: row.tenantId,
          pageSize:10,
          pageNum:1
        }
        getMethod("/backend/orderBill/findBillDtl", param).then(res => {
          scope.showList = false
          scope.detailList = res.data.list
          scope.detailList.tenantId = row.tenantId
          console.log(scope.detailList.tenantId,'')
        });
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        postMethod("/backend/orderBill/findPlatBillList", param).then(res => {
          scope.noBillData = res.data
        });
      }
    }
  };
</script>
