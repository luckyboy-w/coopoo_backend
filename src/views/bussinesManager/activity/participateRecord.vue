<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel">
        <el-button style="margin-bottom: 10px" @click="backToList()" type="primary" icon="el-icon-back">返回</el-button>
      </div>
      <div>
        <div v-if="rowData.activityType == 5">
          <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="index"
                    border>
            <el-table-column prop="userName" label="团长昵称" width="170px"></el-table-column>
            <el-table-column prop="phoneNo" label="团长手机号" width="200px"></el-table-column>
            <el-table-column prop="storeName" label="门店名称" width="200px"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品金额" width="170px"></el-table-column>
            <el-table-column prop="isSuccess" label="状态" width="170px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSuccess===0">发起中</span>
                <span v-if="scope.row.isSuccess===1">发起成功</span>
                <span v-if="scope.row.isSuccess===2">拼团成功</span>
                <span v-if="scope.row.isSuccess===3">拼团失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="collageNum" label="所需开团人数" width="170px"></el-table-column>
            <el-table-column prop="partCollageNum" label="已参与人数" width="170px"></el-table-column>
            <el-table-column prop="open" label="操作" width="170px" >
              <template slot-scope="scope">
                <el-button @click="closeShadow(scope.row)" size="mini" type="text">查看团员
                </el-button>
              </template>

            </el-table-column>
          </el-table>
        </div>
        <div v-if="rowData.activityType == 6">
          <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="index"
                    border>
            <el-table-column prop="userName" label="团长昵称" width="170px"></el-table-column>
            <el-table-column prop="storeName" label="门店名称" width="200px"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品金额" width="170px"></el-table-column>
            <el-table-column prop="isSuccess" label="订单状态" width="170px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSuccess===0">进行中</span>
                <span v-if="scope.row.isSuccess===1">已完成</span>
                <span v-if="scope.row.isSuccess===2">已取消</span>
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

    <el-dialog
      title=""
      :visible.sync="secondTypePopup"
      width="380px"
      　　　　:append-to-body="true"
      :close-on-click-modal="false">
      <span>团员详情</span>
      <el-table :data="groupMembersData" style="width: 100%; margin-bottom: 20px;margin-top: 30px;" row-key="index" border>
        <el-table-column prop="userName" label="团员昵称" width="170px"></el-table-column>
        <el-table-column prop="phoneNo" label="手机号" width="200px"></el-table-column>
      </el-table>
    </el-dialog>
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
          list: [],
          total: 0
        },

        activityData: {},
        searchParam: {
          activityId: '',
          pageSize: 10,
          pageNum: 1,
        },
        secondTypePopup: false,
        groupMembersData:[]
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
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;

            this.$forceUpdate()
          });
        }
        //砍价
        if (this.rowData.activityType == 6) {
          postMethod("/activity/marketing-goods/cut-price/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }

      },

      getOneCollageRecord(collageId){
        postMethod("/activity/marketing-goods/collage/get-one-collage-record",{collageId:collageId}).then(res => {
          this.groupMembersData = res.data;
          console.log(res)
          this.$forceUpdate()
        });
      },
      backToList() {
        this.$emit('hiddenRecord')
      },
      closeShadow(row){
        console.log(row)
        this.secondTypePopup = true;
        this.getOneCollageRecord(row.collageId);
      },

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
