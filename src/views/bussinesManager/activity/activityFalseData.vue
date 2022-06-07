<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel">
        <el-button style="margin-bottom: 10px" @click="backToList()" type="primary" icon="el-icon-back">返回</el-button>
      </div>
      <div>
          <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="index"
            border>
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column label="头像" width="170px">
              <template slot-scope="scope">
              </template>
            </el-table-column>
            <el-table-column label="商品名称" width="200px">
              <template slot-scope="scope">
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
              </template>
            </el-table-column>
            <el-table-column label="下单时间" width="170px">
              <template slot-scope="scope">
              </template>
            </el-table-column>
          </el-table>
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
      activityType:[String, Number]
    },
    data() {
      return {
        showPagination: true,
        tableData: {
          list: [],
          total: 0
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
      console.log('活动类型', this.activityType)
      // this.activityData = this.rowData
      // this.searchParam.activityId = this.rowData.id
      // this.initRecordData();

    },
    methods: {
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.initRecordData();
      },
      initRecordData() {
        let scope = this;
        //拼團
        if (this.activityType == 5) {
          getMethod("/activity/marketing-goods/collage/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }
        //砍价
        if (this.activityType == 6) {
          getMethod("/activity/marketing-goods/cut-price/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }

      },
      backToList() {
        this.$emit('hiddenFalseData')
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
