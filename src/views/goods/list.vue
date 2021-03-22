<template>
  <div>
    <div v-if="!showAddOrEdit" v-loading="isLoading" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>商品名称:</td>
            <td>
              <el-input v-model="searchParam.goodName" width="180px"/>
            </td>
            <td>货号:</td>
            <td>
              <el-input v-model="searchParam.goodCode" width="180px"/>
            </td>
            <td>发布人:</td>
            <td>
              <el-select v-model="searchParam.tenantId" placeholder="请选择">
                <el-option value="" label="全部"/>
                <el-option v-for="item in supplyList" :key="item.id" :value-key="item.supplierName"
                           :label="item.supplierName"
                           :value="item.id"/>
              </el-select>
            </td>
            <!-- <td>风格状态:</td>
						<td>
							<el-select v-model="searchParam.goodStyle">
								<el-option value="" label="全部" />
								<el-option value="" label="所有商品" />
								<el-option value="" label="所有商品" />
								<el-option value="" label="所有商品" />
								<el-option value="" label="所有商品" />
							</el-select>
						</td> -->
            <!-- <td>查询类型:</td>
             <td>
               <el-select v-model="searchParam.verifyStatus" placeholder="请选择">
                 <el-option value="" label="所有商品" />
                 <el-option value="10" label="未审核商品" />
                 <el-option value="20" label="销售中商品" />
                 <el-option value="30" label="审核未通过商品" />
                 <el-option value="40" label="已下架商品" />
               </el-select>
             </td> -->
            <td>是否推荐:</td>
            <td>
              <el-select v-model="searchParam.recommend" placeholder="请选择">
                <el-option value="" label="所有商品"/>
                <el-option value="1" label="推荐"/>
                <el-option value="0" label="不推荐"/>
              </el-select>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">
                搜索
              </el-button>
              <el-button plain type="normal" icon="el-icon-download" @click="exportData()">
                导出
              </el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
                    border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.skuPriceList" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
                  <el-table-column prop="skuText" label="SKU属性" width="260px"/>
                  <el-table-column prop="stock" label="库存" width="150px"/>
                  <el-table-column prop="salePrice" label="零售价" width="150px"/>
                  <el-table-column prop="saleMemPrice" label="会员价" width="150px"/>
                  <!-- <el-table-column prop="saleCount" label="销量" width="150px" ></el-table-column> -->
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="150px"/>
            <el-table-column prop="isMarketing" label="商品类型" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.isMarketing == 0">普通商品</span>
                <span v-if="scope.row.isMarketing == 1">活动商品</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodMerit" label="商品分类" width="150px">
              <template slot-scope="scope">
                {{ scope.row.typeName }} -> {{ scope.row.typeName2 }}
              </template>
            </el-table-column>
            <el-table-column prop="goodCode" label="商品货号" width="150px"/>
            <el-table-column prop="goodStyle" label="风格专场" width="200px"/>
            <!-- <el-table-column prop="isGift" label="是否礼品" width="80px">
               <template slot-scope="scope">
                 {{ scope.row.isGift == '1' ? '否':'是' }}
               </template>
             </el-table-column> -->
            <el-table-column prop="supplierName" label="发布上架" width="150px"/>
            <el-table-column prop="saleNum" label="销量" width="150px"/>
            <el-table-column prop="recommend" label="是否推荐" width="150px">
              <template slot-scope="scope">
                {{ scope.row.recommend == '0' ? '未推荐' : '已推荐' }}
              </template>
            </el-table-column>
            <el-table-column prop="verifyStatus" label="状态" width="150px">
              <template slot-scope="scope">
                {{ scope.row.verifyStatus | parseStatus }}
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime | formatDate }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <div v-if="scope.row.verifyStatus != 30">
                  <el-button type="text" size="small" @click.native.prevent="editGood(scope.row,true)">
                    查看详情
                  </el-button>

                  <el-button v-if="scope.row.verifyStatus == 10 " type="text" size="small"
                             @click.native.prevent="verifyGood(scope.row)">
                    审核
                  </el-button>
                  <!--审核通过才能操作上架下架-->
                  <!--审核状态;10:待审核;20:已通过;30:被驳回-->
                  <!--5:在仓库;1:上架;2:下架;3:违规下架-->
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 2" type="text" size="small"
                             @click.native.prevent="onLine(scope.row)">
                    上架
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 2" type="text" size="small"
                             @click.native.prevent="editGood(scope.row)">
                    编辑
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 1" type="text" size="small"
                             @click.native.prevent="offLine(scope.row,'3')">
                    违规下架
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 1" type="text" size="small"
                             @click.native.prevent="offLine(scope.row,'2')">
                    下架
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
                         @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage"/>
        </div>
      </div>
    </div>

    <saveOrEdit v-if="showAddOrEdit"
                :is-gift="isGift"
                :edit-data="editData"
                :is-edit-good="isEditGood"
                :is-disabled="isDisabled"
                @showListPanel="showListPanel"/>
  </div>
</template>

<script>
import {
  getMethod,
  postMethod,
  formatDate
} from "@/api/request";
import saveOrEdit from "./editGood";

export default {
  components: {
    saveOrEdit
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    parseStatus(verifyStatus) {
      //审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 10) {
        return '待审核'
      } else if (verifyStatus == 30) {
        return '被驳回'
      } else if (verifyStatus == 40) {
        return '违规下架'
      } else {
        return '已通过'
      }
    }
  },
  props: {
    verifyStatus: {
      type: String,
      required: false
    },
    isSale: {
      type: Number,
      required: false
    },
  },
  data() {
    return {
      isDisabled: false,
      supplyList: [],
      isLoading: true,
      showAddOrEdit: false,
      showResult: false,
      dialogVerify: false,
      typeId2List: [],
      typeIdList: [],
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      isEditGood: true,
      verifyForm: {
        verifyResult: "0",
        recContent: "",
        verifyType: "GOOD",
        modityStatus: "20",
        dataId: ""
      },
      searchParam: {
        goodStyle: '',
        queryType: '',
        typeName: "",
        verifyStatus: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    };
  },
  computed: {},
  mounted() {
    if (this.verifyStatus != '') {
      this.searchParam.verifyStatus = this.verifyStatus
    }
    if (this.isSale != '') {
      this.searchParam.isSale = this.isSale
    }
    this.initLoad()
  },
  created() {
  },
  methods: {
    exportData() {
      let exportParam = [];
      for (let key in this.searchParam) {
        if (this.searchParam[key] != undefined) {
          exportParam.push(key + "=" + this.searchParam[key]);
        }
      }
      window.open(process.env.VUE_APP_BASE_API + '/backend/good/export?' + exportParam.join("&"))
    },
    editGood(row, disabled) {
      let scope = this
      this.isDisabled = disabled == true ? true : false

      let param = {
        goodId: row.id
      }
      getMethod("/backend/good/findById", param).then(res => {
        scope.isEditGood = true
        scope.editData = res.data
        this.showAddOrEdit = true
      });
    },
    verifyGood(row) {
      let scope = this

      let param = {
        goodId: row.id
      }
      getMethod("/backend/good/findById", param).then(res => {
        scope.isEditGood = false
        scope.editData = res.data
        this.showAddOrEdit = true
      });
    },
    offLine(row, isSale) {
      let verifyStatus = '20'
      if (isSale == '3') {
        verifyStatus = '40'
      }
      let param = {
        id: row.id,
        verifyStatus: verifyStatus, //下架退回到待审核
        isSale: isSale
      }
      postMethod("/backend/good/modity", param).then(res => {
        this.loadList()
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
      this.loadList()
    },
    onLine(row) {
      let param = {
        id: row.id,
        verifyStatus: '20',
        isSale: '1'
      }
      postMethod("/backend/good/modity", param).then(res => {
        this.loadList()
        this.$message({
          message: "上架成功",
          type: "success"
        });
      });
      this.loadList()
    },
    search() {
      this.loadList();
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this;

      if (oper == "edit") {
        const param = {
          id: data.list[rowIndex].id
        };
        getMethod("/bu/good/findObject", param).then(res => {
          scope.editData = res.data[0];
          this.showList = false;
          this.showAddOrEdit = true;
        });
      } else {
        scope.editData = {};
        this.showList = false;
        this.showAddOrEdit = true;
      }
    },
    showListPanel(isCancel) {
      this.showList = true;
      this.showAddOrEdit = false;
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
      const scope = this;
      if (!scope.isLoading) {
        scope.isLoading = true
      }
      getMethod("/backend/good/findPage", this.searchParam).then(res => {
        scope.tableData = res.data;
        scope.isLoading = false
        scope.showPagination = scope.tableData.total == 0;
      });
      getMethod("/backend/supplier/findList", this.searchParam).then(res => {
        scope.supplyList = res.data
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
    div {
      display: inline;
    }

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
