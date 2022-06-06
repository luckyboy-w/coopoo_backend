<template>
  <div>
    <div class="ly-container">
      <el-table ref="mainTable" :data="priceTableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
        <el-table-column label="充值金额">
          <template slot-scope="scope">
            <div style="display: flex;flex-wrap: nowrap;align-items: center;justify-content: center;">
              <div>
                <i v-if="scope.$index===0" @click="addRow()" class="el-icon-circle-plus-outline"
                  style="font-size: 30px;"></i>
                <i v-if="scope.$index!==0" @click="deleteRow(scope.$index)" class="el-icon-remove-outline"
                  style="font-size: 30px;"></i>
              </div>
              <div>
                <el-input-number :max="100" :min="0" style="width:150px;margin-left: 20px;" placeholder="请输入"
                  v-model="scope.row.testPrice" />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品" width="250px">
          <template slot-scope="scope">
            <div style="text-align: left;">
              <div>
                <el-button type="success" size="mini" @click="relatedGoods(scope.row.goodsId,scope.$index)">指定商品
                </el-button>
              </div>
              <div>
                <span
                  style="display: -webkit-box;word-break: break-all;text-overflow: ellipsis;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 5;">{{scope.row.goodsName}}</span>
                <span v-show="false">{{scope.row.goodsId}}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks" clearable placeholder="请输入" width="180px" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button style="margin-left: 30px;" type="primary" @click="enterRechargeConfiguration()">
      保存
    </el-button>
    <el-dialog :visible="showGoodsList" :before-close="showGoodsListClose" title="关联商品" width="90%">

      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>商品名称：</div>
            <div>
              <el-input v-model="searchParam.goodsName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table ref="multipleTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
              border @select="selectThis">
              <!-- // :selectable="checkSelectable" -->
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" />
              <el-table-column label="商品价格">
                <template slot-scope="scope">
                  <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="saleVolume" label="销量" />
              <el-table-column prop="isSale" label="商品状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSale==1">已上架</span>
                  <span v-if="scope.row.isSale==0">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData.total" background layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" :current-page="searchParam.pageNum" @next-click="currentPage" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate
  } from "@/api/request";
  import {
    getToken
  } from '@/utils/auth'
  export default {
    computed: {},
    mounted() {
      // this.initLoad();
    },
    created() {},
    data() {
      return {
        priceTableData: [{
          testPrice: null,
          goodsName: '',
          remarks: ''
        }],
        searchParam: {
          status: 1,
          goodsType: 1,
          pageSize: 10,
          pageNum: 1
        },
        showGoodsList: false,
        // 商品列表
        tableData: {
          list: []
        },
        selectGoodsId: '',
        selectIndex: ''
      };
    },
    methods: {
      addRow() {
        console.log('添加行')
        let itemObj = {
          testPrice: null,
          goodsName: '',
          goodsId: '',
          remarks: ''
        }
        this.priceTableData.push(itemObj)
      },
      deleteRow(idx) {
        console.log('删除行')
        let that = this
        that.priceTableData.map((item, index) => {
          if (index == idx) {
            that.priceTableData.splice(index, 1)
          }
        })
      },
      enterRechargeConfiguration() {
      console.log('priceTableData',this.priceTableData)
      },
      // 关联商品
      relatedGoods(goodsId, index) {
        console.log(goodsId, index)
        this.selectGoodsId = goodsId
        this.selectIndex = index
        this.searchParam.pageNum = 1
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {
        this.searchParam = {
          pageSize: 10,
          pageNum: 1,
          goodsType: 1,
          status: 1,
        }
        this.showGoodsList = false
      },
      search() {
        this.searchParam.pageNum = 1
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
        postMethod("/goods/list", this.searchParam).then(res => {
          this.tableData.list = res.data.records;
          this.tableData.total = res.data.total;
          this.showPagination = this.tableData.total == 0;
          if (this.selectGoodsId != '' && this.selectGoodsId) {
            this.testF()
          }
        });

      },
      testF() {
        this.$nextTick(() => {
          this.tableData.list.forEach((item, index) => {
            if (this.selectGoodsId == item.goodsId) {
              this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
            }
          })
        })
      },
      // 选择商品
      selectThis(selection, row) {
        let that = this
        console.log(selection, row, that.selectGoodsId)
        that.priceTableData.map((item, index) => {
          if (index == that.selectIndex) {
            if (that.selectGoodsId == row.goodsId) {
              item.goodsName = ''
              item.goodsId = ''
              that.selectGoodsId == ''
            } else {
              item.goodsName = row.goodsName
              item.goodsId = row.goodsId
              this.showGoodsListClose()
            }
          }
        })
        console.log('priceTableData', that.priceTableData)
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },


      initLoad() {
        this.loadList();
      },
      // loadList() {
      //   let scope = this;
      //   getMethod("/member/search-member-list", this.searchParam).then(
      //     res => {
      //       scope.tableData = res.data.records;
      //       scope.tableData.total = res.data.total
      //     }
      //   )
      // },
    }
  }
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      display: flex;
      flex-wrap: wrap;
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
</style>
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }
</style>
