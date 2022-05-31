<template>
  <div>
    <el-row :span="24" style="padding-top:25px">
        <el-col :span="8">
            <div style="padding: 0px 10px;">
                <div class="analysis-title">供应商TOP10</div>
                <div>
                <el-table
                        ref="supplySaleTbl"
                        :data="supplySaleList"
                        style="width: 100%; margin-bottom: 20px;"
                        row-key="id">
                        <el-table-column prop="supplierName" label="供应商名称" min-width="70%">
                        </el-table-column>
                        <el-table-column prop="totalAmount" label="销售额" min-width="30%">
                        </el-table-column>
                </el-table>
                </div>
            </div>
        </el-col>
         <el-col :span="8"></el-col>
         <el-col :span="8"></el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import { getMethod, postMethod } from "@/api/request";

  export default {
    name:'',
    props:[''],
    data () {
      return {
          supplySaleList:[]
      };
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
        this.loadTopData()
    },
    methods: {
      loadTopData(){
        let scope = this;
        getMethod("/backend/supplier/findTopData", {}).then(res => {
            scope.supplySaleList = res.data
        });
      }
    },
    watch: {

    }
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