<template>
  <div>
    <div class="ly-container">
     <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
       <div class="tabTd">
         <div>门店名称：</div>
         <div>
           <el-input v-model="searchParam.storeName" placeholder="请输入" width="180px" />
         </div>
       </div>
       <div class="tabTd">
         <div>统计时间：</div>
         <div>
          <el-date-picker v-model="searchParam.startDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择开始日期"
            /> &nbsp;&nbsp;至&nbsp;&nbsp;
            <el-date-picker v-model="searchParam.endDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择结束日期"
            />
         </div>
       </div>
       <div class="tabTd">
         <el-button type="primary" @click="search()" icon="el-icon-search">查询</el-button>
         <!-- <el-button type="primary" @click="search()" icon="el-icon-search">导出</el-button> -->
       </div>
      </div>
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;统计时间：{{beforeDate | fmtDateStr}}
       </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id" border
          >
            <el-table-column prop="storeName" label="门店名称" ></el-table-column>
            <el-table-column prop="paySuccessOrderMoneyNum" label="下单金额"></el-table-column>
            <el-table-column prop="refuseOrderMoneyNum" label="退款金额" ></el-table-column>
            <el-table-column prop="bindMemberNum" label="邀请人数"></el-table-column>
            <el-table-column prop="unbindMemberNum" label="更换门店人数" ></el-table-column>
            <el-table-column label="订单数" >
              <template slot-scope="scope">
                {{scope.row.paySuccessOrderNum}}
              </template>
            </el-table-column>
            <el-table-column prop="paySuccessBeanOrderBeanNum" label="消耗靠谱豆" ></el-table-column>
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
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
export default {
  computed: {},
  props: {
    replyMsgStatusParent: {
      type: String,
      required: false,
      default: ''
    }
  },
  filters: {
    fmtDateStr(val){
    	let dt = new Date(val);
    	return formatDate(dt, 'yyyy-MM-dd');
    }
  },
  created() {
  },
  data() {
    return {
      beforeDate:'',
      showPagination: false,
      searchParam: {
        startDate:'',
        endDate:'',
        storeName:'',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
    }
  },
  mounted() {
    var tempDate = new Date() // 获取今天的日期
    this.beforeDate = tempDate.setDate(tempDate.getDate() - 1)
    this.initLoad()
  },
  methods: {
    search() {
		this.searchParam.pageNum = 1
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    initLoad() {
      this.loadList()
    },
    loadList() {
      let scope = this
      getMethod('/operate/get-store-static', this.searchParam).then(
        res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.showPagination = scope.tableData.total == 0
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
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
 .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination > > > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}

</style>
