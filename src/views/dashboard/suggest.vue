<template>
  <div>
    <div class="ly-container" >
          <div class="ly-tool-panel" style="line-heigth:40px">
              &nbsp;&nbsp;
          </div>
          <div style="width:800px" >
            <div style="width:800px">
              <el-table
                ref="suggestTbl"
                :data="tableData.list"
                style="width: 100%; margin-bottom: 20px;"
                row-key="id"
                border>
                <el-table-column prop="content" label="意见内容" width="450px"></el-table-column>
                <el-table-column prop="userName" label="提交人" ></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170px">
                  <template slot-scope="scope">
                    {{scope.row.createTime}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ly-data-pagination">
              <el-pagination
                background
                v-show="!showPagination"
                layout="prev, pager, next"
                @current-change="currentPage"
                @prev-click="currentPage"
                @next-click="currentPage"
                :total="tableData.total"
              ></el-pagination>
            </div>
          </div>
      </div>
    </div>

</template>

<script>
  import { getMethod, postMethod, formatDate } from "@/api/request";

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
          showPagination:true,
          tableData:{
            dataList:null,
            total:null
          },
          searchParam:{
            pageSize:10,
            pageNum:1
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
    components: {},
    filters: {
      _formatDate(time){
        if(time == '' || time == undefined){
          return ''
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
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
        this.initSuggestData()
    },
    methods: {
      exportPlat(){

      },
      exportOther(){
      },
      exportMonth(){
      },
      backToPlat(){
      },
      initData(){
        let scope = this;
        scope.initSuggestData()
      },
      showPlatDataList(row){
      },
      showOtherDataList(row){
      },
      showMonthDataList(row){

      },
      searchPlat(){
        this.initSuggestData()
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.initSuggestData();
      },
      initSuggestData(){
        let scope = this;

        getMethod("/operate/get-feedback-list", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
					  scope.showPagination = scope.tableData.total == 0;
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
