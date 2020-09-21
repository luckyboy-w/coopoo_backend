<template>
    <div style="padding:20px 10px">
        <div v-if="showList">
           <el-row style="line-height:40px;padding:10px 0px ">
                <el-col :span="2" style="padding-left:10px">入账时间</el-col>
                <el-col :span="8">
                    <el-date-picker
                        v-model="searchParam.startTime"
                        type="date"
                        style="width:140px"
                        placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                        v-model="searchParam.endTime"
                        type="date"
                        style="width:140px"
                        placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="2" style="padding-left:10px">结算金额</el-col>
                <el-col :span="8">
                    <el-input  v-model="searchParam.minBillFee" style="width:80px" placeholder=""></el-input>
                    -
                    <el-input v-model="searchParam.maxBillFee" style="width:80px"  placeholder=""></el-input>
                </el-col>
                <el-col :span="4" style="padding-left:10px">
                      <el-button type="primary">搜索</el-button>
                </el-col>
            </el-row>
            <el-table
                ref="noBillData"
                :data="noBillData.list"
                style="width: 100%; margin-bottom: 20px;"
                row-key="id">
                <el-table-column prop="tenantName" label="供应商名称" min-width="20%"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间" min-width="20%">
                    <template slot-scope="scope">
                        {{scope.row.applyTime | _formateDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderPrice" label="销售金额"   min-width="20%"></el-table-column>
                <el-table-column prop="billMoney" label="结算金额"   min-width="20%"></el-table-column>
                <el-table-column prop="pkBillId" label="操作" min-width="24%">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="findBillDtl(scope.row)">查看明细</el-link>
                        <el-link type="primary" @click="billFee(scope.row)">结算</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :total="noBillData.total"
                background
                layout="prev, pager, next"
                @current-change="currentPage"
                @prev-click="currentPage"
                @next-click="currentPage" />
        </div>
        <billDetail v-if="!showList" ref="billDetail"  :detailList="detailList" @backToList="backToList" ></billDetail>
    </div>
</template>
<script>
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from "@/api/tools.js"
import billDetail from './billDtl'

  export default {
    components: { billDetail },
    data() {
      return {
        showList: true,
        tabIndex:0,
        detailList:[],
        //10:未结算;20:结算中;30:已结算
        searchParam:{
            billType:'10',
            billNo:"",
            orderNo:"",
            pageSize:15,
            pageNum:1
        },
        noBillData:{
            list:[],
            total:9
        }
      };
    },
    filters:{
        _formateDate(time){
            if(time == undefined){
                return '';
            }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm:ss')
        }
    },
    mounted() {
        this.searchParam.billType = "10"
        this.loadList();
    },
    methods: {
        backToList(){
            this.showList = true
        },
        findBillDtl(row){
            let scope = this
            let param = {
                billIds:row.pkBillIds
            }
            getMethod("/backend/orderBill/findBillDtl", param).then(res => {
                scope.showList = false
                scope.detailList = res.data
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
        handleClick(tab, event) {
            this.tabIndex = tab.index
            if(tab.index == 0 ){
                this.searchParam.billType = "10"
            }else if(tab.index == 1 ){
                this.searchParam.billType = "20"
            }else {
                this.searchParam.billType = "30"
            }
            this.loadList();
        },
        currentPage(pageNum) {
            this.searchParam.pageNum = pageNum;
            this.loadList();
        },
        loadList(){
            let scope = this
            let param = this.searchParam
            param.billType = 20
            postMethod("/backend/orderBill/findPlatApplyBill", param).then(res => {
                scope.noBillData = res.data
            });
      }
    }
  };
</script>