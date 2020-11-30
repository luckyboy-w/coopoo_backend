<template>
  <div style="width:100%">
    <el-row style="line-height:40px;padding:10px 0px ">
      <el-col :span="2">
        入账时间
      </el-col>
      <el-col :span="12">
        <el-date-picker
          v-model="searchParam.startTime"
          type="date"
          placeholder="开始日期"
        />
        至
        <el-date-picker
          v-model="searchParam.endTime"
          type="date"
          placeholder="结束日期"
        />
      </el-col>
      <el-col
        :span="10"
        style="padding-left:10px"
      >
        <el-button type="primary">
          搜索
        </el-button>
        <el-button type="info">
          导出Excel
        </el-button>
        <el-button
          type="normal"
          @click="backToList()"
        >
          返回列表
        </el-button>
      </el-col>
    </el-row>
    <el-table
      ref="dtlTable"
      :data="detailList"
      style="width: 100%; margin-bottom: 20px;"
      row-key="id"
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column
        prop="billNo"
        label="账单流水号"
        min-width="12%"
      />
      <el-table-column
        prop="outBillNo"
        label="外部流水号"
        min-width="25%"
      />
      <el-table-column
        prop="orderNo"
        label="订单号"
        min-width="18%"
      />
      <el-table-column
        prop="createTime"
        label="入账时间"
        min-width="15%"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | _formateDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="销售金额"
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
        prop="billMemName"
        label="结算财务"
        min-width="10%"
      />
      <el-table-column
        prop="opAdminName"
        label="操作管理员"
        min-width="10%"
      />
    </el-table>
  </div>
</template>
<script>
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from "@/api/tools.js"

  export default {
    filters:{
        _formateDate(time){
            if(time == undefined){
                return '';
            }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm:ss')
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
    props:{
        detailList:{
            type: Array,
            required: true
        }
    },
    data() {
      return {
        tabIndex:0,
        //10:未结算;20:结算中;30:已结算
        searchParam:{
            billType:'10',
            billNo:"",
            orderNo:"",
            pageSize:15,
            pageNum:1
        },
        activeName: 'noBill',
        dataList:[]
      };
    },
    mounted() {
        this.dataList = this.detailList
    },
    methods: {
        backToList(){
            this.$emit("backToList");
        }
    }
  };
</script>
