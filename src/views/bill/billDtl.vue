<template>
  <div style="width:100%">
    <table>
      <tr>
        <td  style="padding-left: 20px;" v-if="this.billType!=2">入账时间</td>
        <td  style="padding-left: 20px;" v-if="this.billType==2">结算时间</td>
        <td>
          <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" />
        </td>
        <td>至</td>
        <td>
          <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" />
        </td>
        <td style="padding-left: 20px;">
          <el-button v-if="tenantId==''" @click="search()" type="primary">
            搜索
          </el-button>
        </td>
        <td style="padding-left: 20px;">
          <el-button v-if="tenantId!=''" @click="search_()" type="primary">
            搜索
          </el-button>
        </td>
        <td style="padding-left: 20px;">
          <el-button v-if="tenantId==''" @click="exportData()" type="primary">
            导出Excel
          </el-button>
        </td>
        <td style="padding-left: 20px;">
          <el-button v-if="tenantId!=''" @click="exportData_()" type="primary">
            导出Excel
          </el-button>
        </td>
        <td style="padding-left: 20px;">
          <el-button type="normal" @click="backToList()">
            返回列表
          </el-button>
        </td>
      </tr>
    </table>

    <el-table ref="dtlTable" :data="detailList" style="width: 100%; margin-bottom: 20px;" row-key="id">
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column v-if="this.No=='1'" prop="orderNo" label="订单号" min-width="20%" />
      <el-table-column v-if="this.No!='1'" prop="orderNo" label="订单号" min-width="18%" />
      <el-table-column v-if="this.No=='1'" prop="billTime" label="结算时间" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.billTime | _formateDate }}
        </template>
      </el-table-column>
      <el-table-column v-if="this.No!='1'" prop="createTime" label="入账时间" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.createTime | _formateDate }}
        </template>
      </el-table-column>
      <el-table-column prop="orderPrice" label="订单金额" min-width="24%">
        <template slot-scope="scope">
          {{ scope.row.orderPrice | fmtFee }}
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="支付金额" min-width="24%">
        <template slot-scope="scope">
          {{ scope.row.totalAmount | fmtFee }}
        </template>
      </el-table-column>
      <el-table-column prop="billMoney" label="结算金额" min-width="24%">
        <template slot-scope="scope">
          {{ scope.row.billMoney | fmtFee }}
        </template>
      </el-table-column>
      <el-table-column prop="platformFee" label="服务金额" min-width="24%">
        <template slot-scope="scope">
          {{ scope.row.platformFee | fmtFee }}
        </template>
      </el-table-column>
      <!-- <el-table-column
      v-if="this.No=='1'"
        prop="test"
        label="操作管理员"
        min-width="18%"
      /> -->
    </el-table>
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

  export default {
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
      detailList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        billType: '',
        billMem: '',
        tenantId: '',
        tabIndex: 0,
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          startTime: '',
          endTime: '',
          billNo: "",
          orderNo: "",
          pageSize: 10,
          pageNum: 1
        },
        No: '',
        activeName: 'noBill',
        dataList: []
      };
    },
    mounted() {
      if (this.detailList.No) {
        this.No = this.detailList.No
      }
      if (this.detailList.billNo) {
        this.searchParam.billNo = this.detailList.billNo
      }
      if (this.detailList.tenantId) {
        this.tenantId = this.detailList.tenantId
      }
      console.log(this.tenantId, 'tenan')
      if (this.detailList.billType == "1") {
        this.billMem = "可结算"
        this.billType = "1"
      } else if (this.detailList.billType == "2") {
        this.billMem = "已结算"
        this.billType = "2"
      } else {
        this.billMem = "未结算"
      }
      this.dataList = this.detailList

    },
    methods: {
      search() {
        let scope = this
        getMethod("/backend/orderBill/findBillSettledDtl", this.searchParam).then(res => {
          console.log(res, '返回成功的数据')
          // showList = false
          this.detailList = res.data.list
        });
      },
      search_() {
        let scope = this
        this.searchParam.tenantId = this.tenantId
        getMethod("/backend/orderBill/findBillDtl", this.searchParam).then(res => {
          console.log(res, '返回成功的数据')
          // showList = false
          this.detailList = res.data.list
        });
      },
      exportData() {
        if (this.searchParam.startTime == null) {
          this.searchParam.startTime = ''
        }
        if (this.searchParam.endTime == null) {
          this.searchParam.endTime = ''
        }
        let param = {
          billNo: this.searchParam.billNo,
          startTime: this.searchParam.startTime,
          endTime: this.searchParam.endTime,
          billMem: this.billMem,
          billType: this.billType
        }
        console.log(param, 'param')
        let exportParam = [];
        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        window.open(process.env.VUE_APP_BASE_API + "/backend/orderBill/exportDtl?" + exportParam.join("&"));
      },
      exportData_() {
        if (this.searchParam.startTime == null) {
          this.searchParam.startTime = ''
        }
        if (this.searchParam.endTime == null) {
          this.searchParam.endTime = ''
        }
        let param = {
          startTime: this.searchParam.startTime,
          endTime: this.searchParam.endTime,
          billMem: this.billMem,
          tenantId: this.tenantId
        }
        console.log(param, 'param')
        let exportParam = [];
        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        window.open(process.env.VUE_APP_BASE_API + "/backend/orderBill/exportWaitingDtl?" + exportParam.join("&"));
      },
      backToList() {
        this.$emit("backToList");
      }
    }
  };
</script>
