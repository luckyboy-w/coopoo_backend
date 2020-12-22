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
          <td style="padding-left: 20px;">申请时间</td>
          <td>  <el-date-picker
            v-model="searchParam.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:140px"
            placeholder="开始日期"
          /></td>
          <td>至</td>
          <td>  <el-date-picker
            v-model="searchParam.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:140px"
            placeholder="结束日期"
          /></td>
          <td style="padding-left: 20px;">  <el-button @click="search()"  type="primary">
            搜索
          </el-button></td>
          <td style="padding-left: 20px;"> <el-button
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
          prop="applyDate"
          label="申请时间"
          min-width="20%"
        >
          <template slot-scope="scope">
            {{ scope.row.applyDate | _formateDate }}
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
            <el-link
              type="primary"
              @click="billFee(scope.row)"
            >
              结算
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
        showList: true,
        tabIndex:0,
        detailList:[],
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
        noBillData:{
            list:[],
            total:9
        }
      };
    },
    mounted() {
        this.searchParam.billType = "1"
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
		  let exportParam = [];
		  for (let key in param) {
		    exportParam.push(key + "=" + param[key]);
		  }
      console.log(exportParam,'传的参')
		  window.open(process.env.VUE_APP_BASE_API + "/backend/orderBill/export?" + exportParam.join("&"));
		},
      search() {
        let that = this
        this.searchParam.billType='1'
        let param = this.searchParam
        postMethod("/backend/orderBill/findPlatApplyBill", param).then(res => {
          that.noBillData = res.data // 返回的数据

        })
      },
        backToList(){
            this.showList = true
        },
        findBillDtl(row){
            let scope = this
            let param = {
                billNo:row.settleNo,
                pageSize:10,
                pageNum:1,
                billType:1
            }
            getMethod("/backend/orderBill/findBillSettledDtl", param).then(res => {
                scope.showList = false
                scope.detailList = res.data.list
                scope.detailList.billNo=row.settleNo
                scope.detailList.billType=this.searchParam.billType
            });
        },
        batchBill(){
            let selData = this.$refs.noBillData.selection
            let id = [];
            selData.forEach(data=>{
                id.push(data.pkBillId)
            });
            this.billOrd(id.join(","))
        },
        billFee(row){
          console.log(row,'这是单号')
            let scope = this
            let param = {
                settleNo:row.settleNo
            }
            this.$confirm('是否确认完成结算?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMethod("/backend/siteData/settlement", param).then(res => {
              this.$message({
                  message: '已完成结算',
                  type: 'success'
              })
              scope.loadList()
          });
        })


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
            param.billType = 1
            postMethod("/backend/orderBill/findPlatApplyBill", param).then(res => {
                scope.noBillData = res.data
            });
      }
    }
  };
</script>
