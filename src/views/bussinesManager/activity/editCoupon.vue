<template>
  <div class="ly-container">
    <el-button style="margin-bottom: 10px" @click="backToMarketingGoodsList()" plain icon="el-icon-back">返回列表
    </el-button>
    <el-form class="update-form-panel" ref="activityGoodForm" :rules="activityFormRules" :model="activityGoodForm"
      label-width="100px">
      <el-divider />
      <el-form-item label="活动名称:">
        {{ activity.activityName }}
      </el-form-item>
      <el-divider />
      <el-form-item label="关联优惠券">
        <el-button type="success" :disabled="disabled" @click="relatedGoods">关联优惠券</el-button>
      </el-form-item>

      <el-form-item label="已关联优惠券">
        <div class="ly-table-panel" style="min-width:1200px!important;">
          <div class="ly-data-list">
            <el-table ref="mainTable" :data="bindingList" style="width: 100%!important; margin-bottom: 20px;"
               border>
              <el-table-column prop="couponName" label="优惠券名称" />
              <el-table-column label="优惠券价格" width="150px">
                <template slot-scope="scope">
                  {{ scope.row.couponPrice?scope.row.couponPrice:scope.row.buyPrice}}
                </template>
              </el-table-column>
              <el-table-column label="限售" width="130px">
                <template slot-scope="scope">
                  {{ scope.row.couponStock?scope.row.couponStock:scope.row.stock}}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180px" />
              <!-- <el-table-column v-if="settleMethod==1" prop="supplierSettleRatio" label="供应商结算比例" width="160">
                <template slot-scope="scope">
                  <el-input-number :disabled="disabled" :max="100" :min="0" size="mini" placeholder="请输入"
                    v-model="scope.row.supplierSettleRatio" />
                </template>
              </el-table-column>
              <el-table-column v-if="settleMethod==1" prop="storeSettleRatio" label="门店结算比例" width="160">
                <template slot-scope="scope">
                  <el-input-number :disabled="disabled" :max="100" :min="0" size="mini" placeholder="请输入"
                    v-model="scope.row.storeSettleRatio" />
                </template>
              </el-table-column> -->

              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                    详情
                  </el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="small" :disabled="disabled" @click="deleteGoods(scope.row,scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>

      <el-divider content-position="left" />
      <el-form-item prop="activityTimePeriod" label="活动有效期:">
        <el-date-picker v-if="activity.isPermanent==0" v-model="activityGoodForm.activityTimePeriod"
          type="datetimerange" range-separator="至" disabled start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-radio v-if="activity.isPermanent==1" disabled>永久有效</el-radio>
      </el-form-item>
      <el-divider content-position="left" />
      <el-button @click="submit()" :loading="loading" :disabled="disabled" style="display:block;margin:0 auto"
        type="primary">提交</el-button>
    </el-form>

    <el-dialog :visible="showGoodsList" :before-close="showGoodsListClose" title="关联优惠券" width="90%">
      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>优惠券名称：</div>
            <div>
              <el-input v-model="searchParam.couponName" width="180px" clearable />
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
              border @select="selectThis" @selection-change="selectioncChange">
              <el-table-column type="selection" :selectable="checkSelectable" width="55">
              </el-table-column>
              <el-table-column prop="couponName" label="优惠券名称" />
              <el-table-column prop="buyPrice" label="优惠券价格" />
              <el-table-column prop="totalSales" label="销量" />
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
    postMethod
  } from '@/api/request'
  import {
    deepCopy
  } from '@/utils/util'

  export default {
    name: '',
    props: {
      activityGoodData: {
        type: Object,
        required: false
      },
      activity: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        flag: 'add',
        settleMethod: '2',
        searchParam: {
          pageSize: 10,
          pageNum: 1,
        },
        // 商品列表
        tableData: {
          list: []
        },
        disabled: false,
        multipleSelection: [],
        bindingList: [],
        showGoodsList: false,
        localSkuTableData: {},

        isShowGoodDetail: false,
        isEditGood: false,
        loading: false,
        loadingCheckMarketingGoods: false,
        goodInfo: null,
        isGift: '1',
        checkedGood: [],
        goodsName: null,
        goodList: [],
        activityGoodList: [],
        tableList: [],
        addStockColumnList: [],
        goodSkuList: [],
        activityGoodForm: {
          preheatStartTime: '',
          activityTimePeriod: []
        },
        activityFormRules: {},

        skuDialog: false,
        skuTableData: {},
      };
    },
    computed: {},
    beforeMount() {},

    mounted() {
      this.initSettlementMethod()
      if (this.activity.enable == 1) {
        this.disabled = true
      }
      if (this.activity.preheatStartTime && this.activity.preheatStartTime != '') {
        this.activityGoodForm.preheatStartTime = new Date(this.activity.preheatStartTime)
      } else {
        this.activityGoodForm.preheatStartTime = ""
      }
      this.activityGoodForm.activityTimePeriod = [new Date(this.activity.startTime), new Date(this.activity.endTime)]
      this.initBindingList()
    },

    methods: {
      // 加载商品
      initBindingList() {
        getMethod("/activity/coupon/detail?activityId=" + this.activity.id).then(res => {
          if (res.data.length >= 1) {
            this.flag = 'edit'
          } else {
            this.flag = 'add'
          }
          this.bindingList = res.data
        });
      },
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.settleMethod = res.data.currentSettleMethod
          }
        );
      },

      // 关联商品
      relatedGoods() {
        this.searchParam.pageNum = 1
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {
        this.searchParam = {
          pageSize: 10,
          pageNum: 1,
        }
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.id == item.id&&!(i.couponId)) {
                this.multipleSelection.splice(index, 1)
              }
              if(i.couponId == item.id&&(i.couponId)){
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          console.log('this.multipleSelection',this.multipleSelection);
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.showGoodsList = false
      },
      search() {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if ((i.id == item.id&&!(i.couponId))||(i.couponId == item.id&&(i.couponId))) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = 1
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
        getMethod("/coupon/search-coupon-list", this.searchParam).then(res => {
          this.tableData.list = res.data.records;
          this.tableData.total = res.data.total;
          this.showPagination = this.tableData.total == 0;
          if (this.bindingList && this.bindingList.length > 0) {
            this.testF()
          }
        });

      },
      testF() {
        this.$nextTick(() => {
          this.tableData.list.forEach((item, index) => {
            this.bindingList.forEach((i, dex) => {
              if (i.id == item.id && !(i.couponId)) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              } else if ((i.couponId) && i.couponId == item.id) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
        })
      },
      checkSelectable(row) {
        let mark = 0
        // console.log('绑定的数据', this.bindingList, row);
        this.bindingList.forEach((item) => {
          if (item.couponId === row.id && (item.id)) {
            mark = mark + 1
            return false
          }
        })
        return mark <= 0
      },
      // // 选择商品
      // handleSelectionChange(val) {
      //   let n = val.filter(item => !this.multipleSelection.includes(item));
      //   console.log(n); //本次新增的项
      //   this.multipleSelection = val;
      // },
      selectThis(selection, row) {
        console.log(selection, row,this.bindingList);
        this.multipleSelection = selection
        this.bindingList.forEach((item, index) => {
          if (row.id == item.id&&!(item.couponId)) {
            this.bindingList.splice(index, 1)
          }
        })
      },
      selectioncChange(selection) {},
      currentPage(pageNum) {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if ((i.id == item.id&&!(i.couponId))||(i.couponId == item.id&&(i.couponId))) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },

      deleteGoods(row, num) {
        let that = this
        that.bindingList.map((item, index) => {
          if (item.id == row.id&&!(row.couponId)) {
            that.bindingList.splice(index, 1)
          }
          if (item.couponId == row.couponId&&(row.couponId)) {
            that.bindingList.splice(index, 1)
          }
        })
        if (row.couponId) {
          getMethod("/activity/coupon-remove?id=" + row.id).then(res => {
            this.$message({
              message: "操作成功",
              type: 'success'
            });
          });
        }

      },

      // 新建标签跳详情
      getGoodsDtl(row) {
        let newpage = this.$router.resolve({
          path: "/bussinesManager/coupon/coupon", //路径
          query: {
            id: row.id, //商品id
          }
        })
        window.open(newpage.href, '_blank');
      },
      submit() {
        if (this.bindingList.length === 0) {
          this.$message({
            message: "请选择要关联的优惠券",
            type: 'warning'
          });
          return;
        }
        let couponActiveList = []
        for (let i = 0; i < this.bindingList.length; i++) {
          let couponObj = {
            couponId: this.bindingList[i].couponId ? this.bindingList[i].couponId : this.bindingList[i].id,
            id: this.bindingList[i].couponId ? this.bindingList[i].id : "",
            sort: i,
            virtualCode: this.bindingList[i].virtualCode
          }
          couponActiveList.push(couponObj)
        }
        console.log(couponActiveList, this.activity.id)
        // return false
        let param = {
          goodsActivityId: this.activity.id,
          couponActiveList: couponActiveList
        }
        this.loading = true
        if (this.flag == 'add') {
          postMethod('/activity/coupon-save', param).then(
            res => {
              this.loading = false
              if (res.errCode != 0) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
                return true;
              }
              this.$message({
                message: '添加成功',
                type: 'success'
              })

              this.$emit('hiddenSave')
            }
          ).catch(error => {
            this.loading = false
          })
        } else {
          postMethod('/activity/coupon-update', param).then(
            res => {
              this.loading = false
              if (res.errCode != 0) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
                return true;
              }
              this.$message({
                message: '保存成功',
                type: 'success'
              })

              this.$emit('hiddenSave')
            }
          ).catch(error => {
            this.loading = false
          })
        }

      },

      backToMarketingGoodsList() {
        this.$emit('hiddenSave')
      },

    },

    watch: {}

  }
</script>
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }
</style>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {

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

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    height: 480px;
    width: 480px;
  }

  .active {
    color: red;
  }
</style>
