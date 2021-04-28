<template>
  <div>

    <el-row :span="24" style="padding-top:25px" v-if="showSiteData">
              <el-col :span="8">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">平台数据</div>
                  <div>
                    <el-table
                            ref="settleEndData"
                            :data="platData"
                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="dataType" label="统计类型" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="siteData" label="统计数据" min-width="30%">
                              <template slot-scope="scope" >
                                <el-link type="primary" @click="showPlatDataList(scope.row)">{{scope.row.siteData}}</el-link>
                              </template>
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>

            <el-col :span="8">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">其他数据</div>
                  <div>
                    <el-table
                            ref="otherTbl"
                            :data="otherData"
                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="dataType" label="统计类型" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="siteData" label="统计数据" min-width="30%">
                                <template slot-scope="scope" >
                                  <el-link type="primary" @click="showOtherDataList(scope.row)">{{scope.row.siteData}}</el-link>
                                </template>
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>

            <el-col :span="8">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">月度数据</div>
                  <div>
                    <el-table
                            ref="monthTbl"
                            :data="monthData"
                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="dataType" label="统计类型" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="siteData" label="统计数据" min-width="30%">
                              <template slot-scope="scope" >
                                  <el-link type="primary" @click="showMonthDataList(scope.row)">{{scope.row | fmtSiteData}}</el-link>
                                </template>
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>
    </el-row>
      <div class="ly-container" v-if="showPlatList">
        <div class="ly-tool-panel">
              <table>
                <tr>
                  <td>统计时间</td>
                  <td  >
                    <el-date-picker
                        v-model="searchPlatList.startDate"
                        type="date"
                        placeholder="开始时间">
                      </el-date-picker>
                  </td>
                  <td colspan="2">
                      <el-date-picker
                        v-model="searchPlatList.endDate"
                        type="date"
                        placeholder="结束时间">
                      </el-date-picker>
                  </td>
                  <td>
                    <el-button icon="el-icon-search" type="primary" plain @click="searchPlat()">搜索</el-button>
                    <el-button icon="el-icon-download" @click="exportPlat()">导出</el-button>
                    <el-button icon="el-icon-back" type="info" @click="backToPlat()" v-if="showPage" plain>返回首页</el-button>
                  </td>
                </tr>
              </table>
        </div>

        <div style="width:100%" >
          <div style="width:100%">
            <el-table
              ref="platDataListTable"
              :data="platDataList"
              style="width: 100%; margin-bottom: 20px;"
              row-key="id"
              border>
              <el-table-column prop="ordPrice" label="订单额" width="200px"></el-table-column>
              <el-table-column prop="ordPayPrice" label="总收入" width="200px%"></el-table-column>
              <el-table-column prop="inviteUser" label="总访客数" width="200px%"></el-table-column>
              <el-table-column prop="rejectOrdCnt" label="退货订单数" width="200px%"></el-table-column>
              <el-table-column prop="exceedOrd" label="超期未付款数" width="200px%"></el-table-column>
              <el-table-column prop="dateStr" label="日期" width="200px"></el-table-column>
            </el-table>
          </div>
        </div>
    </div>

  <div class="ly-container" v-if="showOtherList">
        <div class="ly-tool-panel">
              <table>
                <tr>
                  <td>统计时间</td>
                  <td  >
                    <el-date-picker
                        v-model="searchOtherList.startDate"
                        type="date"
                        placeholder="开始时间">
                      </el-date-picker>
                  </td>
                  <td colspan="2">
                      <el-date-picker
                        v-model="searchOtherList.endDate"
                        type="date"
                        placeholder="结束时间">
                      </el-date-picker>
                  </td>
                  <td>
                    <el-button icon="el-icon-search" @click="searchOther()">搜索</el-button>
                    <el-button icon="el-icon-download" @click="exportOther()">导出</el-button>
                    <el-button icon="el-icon-back" type="info" @click="backToPlat()" v-if="showPage"  plain>返回首页</el-button>
                  </td>
                </tr>
              </table>
        </div>

        <div style="width:100%" >
          <div style="width:100%">
            <el-table
              ref="otherDataTable"
              :data="otherDataList"
              style="width: 100%; margin-bottom: 20px;"
              row-key="id"
              border>
              <el-table-column prop="userData" label="新增会员" width="200px"></el-table-column>
              <el-table-column prop="providerData" label="新增服务商" width="200px%"></el-table-column>
              <el-table-column prop="supplierData" label="新增供应商" width="200px%"></el-table-column>
              <el-table-column prop="beasData" label="新增靠谱豆" width="200px%"></el-table-column>
              <el-table-column prop="dateStr" label="日期" width="200px"></el-table-column>
            </el-table>
          </div>
        </div>
    </div>

  <div class="ly-container" v-if="showMonthList">
        <div class="ly-tool-panel">
              <table>
                <tr>
                  <td>统计时间</td>
                  <td  >
                    <el-date-picker
                        v-model="searchMonthList.startDate"
                        type="month"
                        placeholder="开始时间">
                      </el-date-picker>
                  </td>
                  <td colspan="2">
                      <el-date-picker
                        v-model="searchMonthList.endDate"
                        type="month"
                        placeholder="结束时间">
                      </el-date-picker>
                  </td>
                  <td>
                    <el-button icon="el-icon-search" @click="searchMonth()">搜索</el-button>
                    <el-button icon="el-icon-download" @click="exportMonth()">导出</el-button>
                    <el-button icon="el-icon-back" type="info" @click="backToPlat()" v-if="showPage" plain>返回首页</el-button>
                  </td>
                </tr>
              </table>
        </div>

        <div style="width:100%" >
          <div style="width:100%">
            <el-table
              ref="monthDataTbl"
              :data="monthDataList"
              style="width: 100%; margin-bottom: 20px;"
              row-key="id"
              border>
              <el-table-column prop="monthOrdPrice" label="订单额" width="115px"></el-table-column>
              <el-table-column prop="monthPayPrice" label="总收入" width="115px"></el-table-column>
              <el-table-column prop="monthOrdNum" label="订单总数" width="115px"></el-table-column>
              <el-table-column prop="monthNewMen" label="新增会员数" width="115px"></el-table-column>
              <el-table-column prop="monthProNum" label="新增服务商" width="115px"></el-table-column>
              <el-table-column prop="monthSupNum" label="新增供应商" width="115px"></el-table-column>
              <el-table-column prop="monthBean" label="新增靠谱豆" width="115px"></el-table-column>
              <el-table-column prop="monthRejectOrd" label="退货数" width="115px"></el-table-column>
              <el-table-column prop="monthNoCash" label="超期未付款总数" width="125px"></el-table-column>
              <el-table-column prop="dateStr" label="日期" width="200px"></el-table-column>
            </el-table>
          </div>
        </div>
    </div>
  </div>

</template>

<script>
  import CountTo from 'vue-count-to'
  import { getMethod, postMethod } from "@/api/request";
  import { getMethod as getMethodNew, postMethod as postMethodNew } from "@/api/request-new";

  export default {
    name:'',
    props:[''],
    data () {
      return {
          showSiteData:true,
          showPlatList:false,
          showOtherList:false,
          showMonthList:false,
          platData:[],
          showPage:true,
          platDataList:[],
          otherData:[],
          otherDataList:[],
          monthData:[],
          monthDataList:[],
          worseSale:[],
          bestFav:[],
          worseFav:[],
          searchPlatList:{
            startDate:null,
            endDate:null
          },
          searchOtherList:{
            startDate:null,
            endDate:null
          },
          searchMonthList:{
            startDate:null,
            endDate:null
          },
          orgOptions: {},
          lineDate:{
            dateList: [],
            ordListL: [],
            payList: []
          }
      };
    },
    props:{
      dataSource:{
        type:String,
        required:false,
        default:''
      }
    },
    components: {
        CountTo
    },
    filters: {
      fmtSiteData(row){

        if(row.dataType.indexOf('元') != -1){
          return row.siteData
        }
        return  row.siteData.replace(".00","")
      }
    },
    computed: {},
    beforeMount() {},
    mounted() {
        if(this.dataSource == 'plat'){
          this.showPlatDataList()
          this.showSiteData = false
          this.showPlatList = true
          this.showOtherList = false
          this.showMonthList = false
          this.showPage = false
        }else if(this.dataSource == 'newAdd'){
          this.showOtherDataList()
          this.showSiteData = false
          this.showPlatList = false
          this.showOtherList = true
          this.showMonthList = false
          this.showPage = false
        }else if(this.dataSource == 'month'){
          this.showMonthDataList()
          this.showSiteData = false
          this.showPlatList = false
          this.showOtherList = false
          this.showMonthList = true
          this.showPage = false
        }else{
          this.initData()
        }

    },
    methods: {
      exportPlat(){
        let exportParam = [];
        for(let key in this.searchPlatList){
          if(this.searchPlatList[key] != undefined){
            exportParam.push(key+"="+this.searchPlatList[key]);
          }
        }
        window.open( process.env.VUE_APP_BASE_API+'/backend/siteData/exportPlatDataList?'+exportParam.join("&"))
      },
      exportOther(){
        let exportParam = [];
        for(let key in this.searchOtherList){
          if(this.searchOtherList[key] != undefined){
            exportParam.push(key+"="+this.searchOtherList[key]);
          }
        }
        window.open( process.env.VUE_APP_BASE_API+'/backend/siteData/exportOtherDataList?'+exportParam.join("&"))
      },
      exportMonth(){
        let exportParam = [];
        for(let key in this.searchMonthList){
          if(this.searchMonthList[key] != undefined){
            exportParam.push(key+"="+this.searchMonthList[key]);
          }
        }
        window.open( process.env.VUE_APP_BASE_API+'/backend/siteData/exportMonDataList?'+exportParam.join("&"))
      },
      backToPlat(){
        this.showSiteData = true
        this.showPlatList = false
        this.showOtherList = false
        this.showMonthList = false
      },
      initData(){
        let scope = this;
        scope.initPlatData()
        scope.initOtherData()
        scope.initMonthData()
      },
      showPlatDataList(row){
        this.showSiteData = false
        this.showPlatList = true
        this.initPlatList()
      },
      showOtherDataList(row){

        this.showSiteData = false
        this.showOtherList = true
        this.initOtherList()
      },
      showMonthDataList(row){

        this.showSiteData = false
        this.showMonthList = true
        this.initMonthList()
      },
      searchPlat(){
        this.initPlatList()
      },
      searchOther(){
        this.initOtherList()
      },
       searchMonth(){
        this.initMonthList()
      },
      initPlatList(){
        let scope = this;
        postMethod("/backend/siteData/findPlatDataList", this.searchPlatList).then(res => {
            let resData = res.data
            scope.platDataList = resData
        });
      },
      initPlatData(){
        let scope = this;

        getMethodNew("/statistic/findSiteData", {}).then(res => {
            let resData = res.data
            scope.platData = resData
        });
      },
      initOtherData(){
        let scope = this;

        getMethod("/backend/siteData/findOtherData", {}).then(res => {
            let resData = res.data
            scope.otherData = resData
        });
      },

      initOtherList(){
        let scope = this;

        postMethod("/backend/siteData/findOtherDataList", this.searchOtherList).then(res => {
            let resData = res.data
            scope.otherDataList = resData
        });
      },
      initMonthData(){
        let scope = this;
        getMethod("/backend/siteData/findMonData", {}).then(res => {
            let resData = res.data
            scope.monthData = resData
        });
      },
      initMonthList(){
        let scope = this;
        postMethod("/backend/siteData/findMonDataList", this.searchMonthList).then(res => {
            let resData = res.data
            scope.monthDataList = resData
        });
      }
    },
    watch: {}
  }

</script>
<style lang="scss" scoped>
.analysis-title{
  font-family: 'Arial Negreta', 'Arial';
  font-size: 16px;
  color:#333333;
  text-align: center;
  line-height:45px;
  font-weight: 700;
  background: #F0F0F0;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      padding-left: 10px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.ly-container {
	padding: 10px 20px;
	font-size: 14px;
	.ly-tool-panel {
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
