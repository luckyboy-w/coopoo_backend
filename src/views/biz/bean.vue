<template>
    <div style="padding:20px 10px">
        <div v-if="showList">
            <el-row style="line-height:40px;padding:10px 0px ">
                <el-col :span="1" style="padding-left:10px;font-size:14px;">使用者</el-col>
                <el-col :span="3">
                    <el-input  v-model="searchParam.nickName" style="width:80px" placeholder=""></el-input>
                </el-col>
                <el-col :span="1" style="padding-left:10px;font-size:14px;">渠道</el-col>
                <el-col :span="3">
                    <el-select v-model="searchParam.recTitle" placeholder="请选择渠道">
                        <el-option value="" label="全部"></el-option>
                        <el-option
                            v-for="item in titleList"
                            :key="item.recTitle"
                            :label="item.recTitle"
                            :value="item.recTitle" />
                    </el-select>
                </el-col>
                <el-col :span="1" style="padding-left:10px;font-size:14px;">门店</el-col>
                <el-col :span="3">
                    <el-select v-model="searchParam.storeName" placeholder="请选择门店">
                        <el-option
                            v-for="item in storeList"
                            :key="item.storeName"
                            :label="item.storeName"
                            :value="item.storeName" />
                    </el-select>
                </el-col>
                <el-col :span="2" style="padding-left:10px;font-size:14px;">入账时间</el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="searchParam.minBillTime"
                        type="date"
                        style="width:140px"
                        placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                        v-model="searchParam.maxBillTime"
                        type="date"
                        style="width:140px"
                        placeholder="结束日期">
                    </el-date-picker>
                </el-col>                
                <el-col :span="2" style="padding-left:10px">
                      <el-button @click="search()" type="primary">搜索</el-button>
                </el-col>
            </el-row>
            <el-table
                ref="noBillData"
                stripe
                :data="noBillData.list"
                style="width: 100%; margin-bottom: 20px;"
                row-key="id">
                <el-table-column prop="nickName" label="使用者" min-width="15%"></el-table-column>
                <el-table-column prop="recTitle" label="渠道" min-width="20%"></el-table-column>
                <el-table-column prop="opText" label="收入/支出" min-width="10%"></el-table-column>
                <el-table-column prop="beanDesc" label="具体事项" min-width="20%"></el-table-column>
                <el-table-column prop="storeName" label="兑换门店" min-width="15%"></el-table-column>
                <el-table-column prop="beanNum" label="靠谱豆数量" min-width="15%"></el-table-column>
                <el-table-column prop="createTime" label="使用时间"   min-width="20%">
                    <template slot-scope="scope">
                        {{scope.row.createTime | _formateDate}}
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
    </div>
</template>
<script>
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from "@/api/tools.js"

  export default {
    components: {},
    data() {
      return {
        tabIndex:0,
        showList: true,
        detailList:[],
        titleList:[],
        storeList:[],
        //10:未结算;20:结算中;30:已结算
        searchParam:{
            billType:'10',
            billNo:"",
            dataType:'',
            orderNo:"",
            pageSize:10,
            pageNum:1
        },
        noBillData:{
          list:[],
          total:0  
        },
        activeName: 'noBill'
      };
    },
    props:{

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
        console.log('---------------------------------');
        if(this.$route.query.dt != undefined){
            console.log(this.$route.query.dt);
            this.searchParam.dataType = this.$route.query.dt
        }
        this.loadList();
        this.loadRecTitle()
    },
    methods: {
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
      singleBill(row){
        this.billOrd(row.pkBillId)
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
      search(){
          this.loadList()
      },
      loadList(){
        let scope = this
        let param = this.searchParam
        param.billType = 10
        postMethod("/backend/siteData/findPlatBeanRec", param).then(res => {
            scope.noBillData = res.data
        });
      },
      loadRecTitle(){
        let scope = this
        let param = this.searchParam
        getMethod("/backend/siteData/findRecTypeList", param).then(res => {
            scope.titleList = res.data
        });
        
        getMethod("/backend/storeManage/findList", param).then(res => {
            scope.storeList = res.data
        });
      }
    }
  };
</script>