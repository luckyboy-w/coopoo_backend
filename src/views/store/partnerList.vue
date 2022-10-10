<template>
  <div>
    <div class="ly-container" v-if="showPartnerList">
      <div class="ly-tool-panel"><el-button @click="backToStoreList()" type="primary" icon="el-icon-back">返回门店列表</el-button></div>
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>合伙人名称：</div>
          <div><el-input v-model="searchParam.goodsName" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <div>手机号：</div>
          <div><el-input v-model="searchParam.memberNickname" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <el-button @click="search()" icon="el-icon-search">查询</el-button>
          <el-button type="primary" plain @click="addOrEditPartner('add')" icon="el-icon-plus">新增</el-button>
          <el-button type="primary" @click="exportData()" icon="el-icon-download">导出</el-button>
        </div>
      </div>
      <div class="ly-tool-panel">
        <div style="font-size: 16px;margin:-10px 0 10px 10px;">门店名称：{{ storeData.storeName }}</div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="id" label="合伙人名称" />
            <el-table-column prop="id" label="手机号" />
            <el-table-column prop="id" label="创建时间" />
            <el-table-column fixed="right" prop="id" min-width="250px" label="操作">
              <template slot-scope="scope">
                  <el-button @click="addOrEditPartner('edit',scope.row)" size="mini" type="primary">编辑</el-button>
                  <el-button @click="openUserList(scope.row)" size="mini" type="primary">推广用户</el-button>
                  <el-button @click="disable(scope.row)" size="mini" type="primary">禁用</el-button>
                  <el-button @click="enable(scope.row)" size="mini" type="primary">启用</el-button>
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
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
    </div>
    <invitedUsersList v-if="showInvitedUsers" @showParnerListPanel="showParnerListPanel" :editParnerData="editParnerData"></invitedUsersList>
    <partnerDetail v-if="showAddOrEditParner" @showParnerListPanel="showParnerListPanel" :editParnerData="editParnerData"></partnerDetail>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request';
import partnerDetail from './partnerDetail.vue';
import invitedUsersList from './invitedUsersList.vue';

export default {
  components: { partnerDetail , invitedUsersList},
  props: {
    storeData: {
      type: Object,
      required: false
    }
  },
  created() {},
  data() {
    return {
      showPagination: false,
      showPartnerList: true,
      showAddOrEditParner: false,
      showInvitedUsers:false,
      searchParam: {
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
      editParnerData: {}
    };
  },
  mounted() {
    this.initLoad();
    console.log(this.storeData);
  },
  methods: {
    backToStoreList() {
      this.$emit('hidePartnerList', true);
    },
    addOrEditPartner(type,row) {
      console.log(type,row)
      this.editParnerData=row
      this.showPartnerList = false;
      this.showAddOrEditParner = true;
    },
    openUserList(row){
      console.log(row)
      this.editParnerData=row
      this.showPartnerList = false;
      this.showInvitedUsers = true;
    },
    showParnerListPanel(isCancel) {
      this.showPartnerList = true;
      this.showAddOrEditParner = false;
      this.showInvitedUsers=false
      this.loadList();
    },
    search() {
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    initLoad() {
      this.loadList();
    },
    loadList() {
      let scope = this;
      getMethod('/operate/get-goods-comment-list', this.searchParam).then(res => {
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
        scope.showPagination = scope.tableData.total == 0;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ly-container {
  padding: 10px 20px;
  font-size: 14px;

  .ly-tool-panel {
    line-height: '60px';
    height: '60px';
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

.el-pagination > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}
</style>
