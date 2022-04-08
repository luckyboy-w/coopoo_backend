<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel">
        <el-button style="margin-bottom: 10px" @click="backToList()" type="primary" icon="el-icon-back">返回</el-button>
      </div>
      <div>
        <div v-if="rowData.activityType == 5">
          <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
            border>
            <el-table-column prop="userName" label="团长昵称" width="170px"></el-table-column>
            <el-table-column prop="storeName" label="门店名称" width="200px"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品金额" width="170px"></el-table-column>
            <el-table-column prop="isSuccess" label="状态" width="170px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSuccess==1">拼团成功</span>
                <span v-if="scope.row.isSuccess===0">拼团失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="collageNum" label="所需开团人数" width="170px"></el-table-column>
            <el-table-column prop="partCollageNum" label="已参与人数" width="170px"></el-table-column>
          </el-table>
        </div>
        <div v-if="rowData.activityType == 6">
          <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
            border>
            <el-table-column prop="userName" label="团长昵称" width="170px"></el-table-column>
            <el-table-column prop="storeName" label="门店名称" width="200px"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品金额" width="170px"></el-table-column>
            <el-table-column prop="isSuccess" label="订单状态" width="170px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSuccess==1">已下单</span>
                <span v-if="scope.row.isSuccess===0">未下单</span>
              </template>
            </el-table-column>
            <el-table-column prop="cutPersonNum" label="所需砍价人数" width="170px"></el-table-column>
            <el-table-column prop="partPersonNum" label="已砍人数" width="170px"></el-table-column>
            <el-table-column prop="donePrice" label="成交金额" width="170px"></el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" @next-click="currentPage" :current-page="searchParam.pageNum"
            :total="tableData.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate
  } from "@/api/request";

  export default {
    name: '',
    props: {
      rowData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        showPagination: true,
        tableData: {
          list: null,
          total: null
        },
        activityData: {},
        searchParam: {
          activityId: '',
          pageSize: 10,
          pageNum: 1
        }
      };
    },
    components: {},
    filters: {},
    computed: {},
    mounted() {
      console.log(this.rowData)
      this.activityData = this.rowData
      this.searchParam.activityId = this.rowData.id
      this.initRecordData();

    },
    methods: {
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.initRecordData();
      },
      initRecordData() {
        let scope = this;
        //拼團
        if (this.rowData.activityType == 5) {
          getMethod("/activity/marketing-goods/collage/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }
        //砍价
        if (this.rowData.activityType == 6) {
          getMethod("/activity/marketing-goods/cut-price/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }

      },
      backToList() {
        this.$emit('hiddenRecord')
      }
    },
    watch: {}
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
</style>
