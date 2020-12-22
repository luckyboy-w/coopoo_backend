<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <table>
        <tr>
          <td style="padding-left: 20px;">结算单号</td>
          <td> <el-input
            v-model="searchParam.billNo"
            style="width:150px"
            placeholder="请输入..."
          /></td>
          <td style="padding-left: 20px;">完成时间</td>
          <td> <el-date-picker
            v-model="searchParam.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:140px"
            placeholder="开始日期"
          /></td>
          <td>至</td>
          <td><el-date-picker
            v-model="searchParam.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:140px"
            placeholder="结束日期"
          /></td>
          <td style="padding-left: 20px;"> <el-button @click="search()" type="primary">
            搜索
          </el-button></td>
          <td style="padding-left: 20px;"><el-button
            icon="el-icon-download"
            @click="exportData()"
          >
            导出
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
          prop="settleNo"
          label="结算单号"
          min-width="20%"
        />
        <el-table-column
          prop="tenantName"
          label="供应商名称"
          min-width="20%"
        />
        <el-table-column
          prop="settleDate"
          label="结算时间"
          min-width="20%"
        >
          <template slot-scope="scope">
            {{ scope.row.settleDate | _formateDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="订单金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.orderAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderPayAmount"
          label="支付金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.orderPayAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="settleAmount"
          label="结算金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.settleAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="platformFee"
          label="服务金额"
          min-width="24%"
        >
          <template slot-scope="scope">
            {{ scope.row.platformFee | fmtFee }}
          </template>
        </el-table-column>
       <!-- <el-table-column
          prop="test"
          label="操作人"
          min-width="20%"
        /> -->
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
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from "@/api/tools.js"
import billDetail from './billDtl'

  export default {
    components: { billDetail },
    filters:{
        _formateDate(time){
            if(time == undefined){
                return '';
            }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd')
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
    data() {
      return {
        showList:true,
        detailList:[],
        tabIndex:0,
        //10:未结算;20:结算中;30:已结算
        searchParam:{
          startTime:'',
          endTime:'',
            billType:'',
            billNo:"",
            orderNo:"",
            pageSize:10,
            pageNum:1
        },
        activeName: 'noBill',
        noBillData: {
            list:[],
            total:0
        },
        billCashData: {
            list:[]
        },
        settleFinshData: {
            list:[]
        },
        settleEndData: {
            list:[]
        }
      };
    },
    mounted() {
      this.searchParam.billType = "2"
        this.loadList();
    },
    methods: {
      exportData() {
        if(this.searchParam.startTime==null){
          this.searchParam.startTime=''
          }
          if(this.searchParam.endTime==null){
            this.searchParam.endTime=''
            }
        let param={
          billType:this.searchParam.billType,
          billNo:this.searchParam.billNo,
          startTime:this.searchParam.startTime,
          endTime:this.searchParam.endTime
             }
             console.log(param,'param')
        let exportParam = [];
        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        window.open(process.env.VUE_APP_BASE_API + "/backend/orderBill/export?" + exportParam.join("&"));
      },
      search() {
        let that = this
        this.searchParam.billType='2'
        let param = this.searchParam
        console.log(param,'参数')
        postMethod("/backend/orderBill/findPlatApplyBill", param).then(res => {
          that.noBillData = res.data // 返回的数据

        })
      },
        findBillDtl(row){
            let scope = this
            let param = {
                billNo:row.settleNo,
                pageSize:10,
                pageNum:1,
                billType:2
            }
            getMethod("/backend/orderBill/findBillSettledDtl", param).then(res => {
                scope.showList = false
                scope.detailList = res.data.list
                scope.detailList.No='1'
                scope.detailList.billNo=row.settleNo
                scope.detailList.billType=this.searchParam.billType
            });
        },
        backToList(){
            this.showList = true
        },
        batchBill(){
            let selData = this.$refs.noBillData.selection
            let id = [];
            selData.forEach(data=>{
                id.push(data.pkBillId)
            });
            this.billOrd(id.join(","))
        },
        billDtl(row){

        },
        billFee(row){
            let scope = this
            let param = {
                billIds:row.pkBillIds
            }
            postMethod("/backend/orderBill/billFee", param).then(res => {
                this.$message({
                    message: '已完成结算',
                    type: 'success'
                })
                scope.loadList()
            });
        },
        billOrd(billId){
            let scope = this
            let param = {
                pkBillId:billId
            }
            postMethod("/bu/orderBill/billOrd", param).then(res => {
                scope.loadList()
            });
        },
        currentPage(pageNum) {
            this.searchParam.pageNum = pageNum;
            this.loadList();
        },
        loadList(){
            let scope = this
            let param = this.searchParam
            param.billType = 2
            postMethod("/backend/orderBill/findPlatApplyBill", param).then(res => {
                scope.noBillData = res.data
            });
        }
    }
  };
</script>
