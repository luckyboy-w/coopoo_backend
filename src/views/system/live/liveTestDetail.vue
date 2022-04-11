<template>
  <div>
    <div class="update-form-panel" v-loading="loading">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item prop="liveName" label="直播名称">
          <el-input v-model="form.liveName" placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item label="直播时间">
          <el-date-picker v-model="liveDate" :clearable="false" :disabled="disabledTime" type="datetimerange"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="activityDateTimeChange"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '00:00:00']">
            <!-- :picker-options="startDateTimePickerOptions" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item label="直播商品">
          <el-button type="success" @click="relatedGoods" :disabled="disabled">关联商品</el-button>
        </el-form-item>
        <el-form-item label="已关联商品">
          <div class="ly-table-panel" style="min-width:1300px!important;">
            <div class="ly-data-list">
              <el-table ref="mainTable" :data="bindingList" style="width: 100%!important; margin-bottom: 20px;"
                row-key="id" border>
                <el-table-column prop="goodsName" label="商品名称" width="200" />
                <el-table-column label="商品价格" width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="直播价格" width="110">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="modifySku(scope.row)">
                      设置价格
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="saleVolume" label="销量" width="110" />

                <el-table-column prop="purchaseLimit" label="限购" width="160">
                  <template slot-scope="scope">
                    <el-input-number :min="0" @change="changeVal($event)" size="mini" placeholder="0"
                      :disabled="disabled" v-model="scope.row.purchaseLimit" />
                  </template>
                </el-table-column>
                <el-table-column v-if="settleMethod==1" prop="supplierSettleRatio" label="供应商结算比例" width="160">
                  <template slot-scope="scope">
                    <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" :disabled="disabled"
                      v-model="scope.row.supplierSettleRatio" />
                  </template>
                </el-table-column>
                <el-table-column v-if="settleMethod==1" prop="storeSettleRatio" label="门店结算比例" width="160">
                  <template slot-scope="scope">
                    <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" :disabled="disabled"
                      v-model="scope.row.storeSettleRatio" />
                  </template>
                </el-table-column>

                <!-- <el-table-column v-if="settleMethod==1" prop="storeProfitRatio" label="门店利润比例" width="160">
                  <template slot-scope="scope">
                  <el-input-number :max="100" :min="100" size="mini" placeholder="100" :disabled="true"
                    v-model="scope.row.storeProfitRatio" />
                  </template>
                </el-table-column> -->

                <!-- <el-table-column prop="createTime" label="创建时间" width="170">
                  <template slot-scope="scope">
                    {{ scope.row.createTime}}
                  </template>
                </el-table-column> -->
                <el-table-column prop="id" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                    <el-divider direction="vertical" v-if="form.status!=2"></el-divider>
                    <el-button type="text" v-if="form.status===0||(!scope.row.status&&scope.row.status!==0)"
                      :disabled="disabled" size="small" @click="deleteGoods(scope.row,scope.$index)">
                      删除
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.top==0" :disabled="disabled" size="small"
                      @click="testTop(scope.row,scope.$index)">
                      置顶
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.top==1" :disabled="disabled" size="small"
                      @click="testTop(scope.row,scope.$index)">
                      取消置顶
                    </el-button>
                    <el-divider direction="vertical" v-if="form.status==1"></el-divider>
                    <el-button type="text" v-if="form.status==1&&scope.row.status==1" :disabled="disabled" size="small"
                      @click="enable(scope.row,scope.$index)">
                      禁止销售
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.status==0" :disabled="disabled" size="small"
                      @click="enable(scope.row,scope.$index)">
                      可以销售
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="关联优惠券">
          <el-button type="success" :disabled="disabled" @click="relatedCoupon">关联优惠券</el-button>
        </el-form-item>

        <el-form-item label="已关联优惠券">
          <div class="ly-table-panel" style="min-width:1200px!important;">
            <div class="ly-data-list">
              <el-table ref="mainTable" :data="bindingList_" style="width: 100%!important; margin-bottom: 20px;" border>
                <el-table-column prop="couponName" label="优惠券名称" width="200" />
                <el-table-column label="优惠券类型" width="150">
                  <template slot-scope="scope">
                    <span v-if="scope.row.useWay==2">线上优惠券</span>
                    <span v-if="scope.row.useWay==1">线下优惠券</span>
                  </template>
                </el-table-column>
                <el-table-column label="优惠券价格" width="110">
                  <template slot-scope="scope">
                    {{scope.row.buyPrice}}
                  </template>
                </el-table-column>
                <el-table-column label="直播价格" width="110">
                  <template slot-scope="scope">
                    <el-input type="number" :placeholder="scope.row.buyPrice" v-model="scope.row.buyLivePrice">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseLimit" label="限购" width="160">
                  <template slot-scope="scope">
                    <el-input-number :min="0" @change="changeVal($event)" size="mini" placeholder="0"
                      :disabled="disabled" v-model="scope.row.purchaseLimit" />
                  </template>
                </el-table-column>
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
                    <el-button type="text" size="small" @click="getGoodsDtl_(scope.row)">
                      详情
                    </el-button>
                    <el-divider direction="vertical" v-if="form.status!=2"></el-divider>
                    <el-button type="text" v-if="form.status===0||(!scope.row.status&&scope.row.status!==0)"
                      :disabled="disabled" size="small" @click="deleteGoods_(scope.row,scope.$index)">
                      删除
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.top==0" :disabled="disabled" size="small"
                      @click="testTop_(scope.row,scope.$index)">
                      置顶
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.top==1" :disabled="disabled" size="small"
                      @click="testTop_(scope.row,scope.$index)">
                      取消置顶
                    </el-button>
                    <el-divider direction="vertical" v-if="form.status==1"></el-divider>
                    <el-button type="text" v-if="form.status==1&&scope.row.status==1" :disabled="disabled" size="small"
                      @click="enable_(scope.row,scope.$index)">
                      禁止销售
                    </el-button>
                    <el-button type="text" v-if="form.status==1&&scope.row.status==0" :disabled="disabled" size="small"
                      @click="enable_(scope.row,scope.$index)">
                      可以销售
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==1" @click="submitUpdate(1)">提交</el-button>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==2" @click="submitUpdate(2)">保存编辑
          </el-button>
          <el-button @click="cancelUpdate">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
              border @select="selectThis" @selection-change="selectioncChange">
              <el-table-column type="selection" :selectable="checkSelectable" width="55">
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
                  <span v-if="scope.row.isSale===0">未上架</span>
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
    <!-- 修改属性规格弹框 -->
    <el-dialog title="修改商品直播价格" :visible.sync="skuDialog" width="50%" :close-on-click-modal="false" destroy-on-close
      @close="skuClose()">
      <div style="width: 100%;">
        <el-table style="margin-top: 10px" :data="skuTableData.table" :span-method="objectSpanMethod" border>
          <el-table-column align="center" v-for="(item,index) in skuTableData.columnList" :key="index" :label="item"
            width="">
            <template slot-scope="scope">
              {{ scope.row.tdList[index].value }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="salePrice" label="会员价"></el-table-column>
          <el-table-column align="center" label="直播价格">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.livePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="限售">
            <template slot-scope="scope">
              <el-input-number :min="0" :max="scope.row.maxStock" size="mini" placeholder="请输入" :disabled="disabled"
                v-model="scope.row.limitSaleNum" />
              <!-- <el-input v-model="scope.row.testStock"></el-input> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: center;margin: 30px;">
        <el-button type="primary" @click="enterSku()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible="showGoodsList_" :before-close="showGoodsListClose_" title="关联优惠券" width="90%">
      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>优惠券名称：</div>
            <div>
              <el-input v-model="searchParam_.couponName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search_()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose_()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table ref="multipleTable_" :data="tableData_.list" style="width: 100%; margin-bottom: 20px;"
              row-key="id" border @select="selectThis_">
              <el-table-column type="selection" :selectable="checkSelectable_" width="55">
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
                    <el-button type="text" size="small" @click="getGoodsDtl_(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData_.total" background layout="prev, pager, next"
              @current-change="currentPage_" @prev-click="currentPage_" :current-page="searchParam_.pageNum"
              @next-click="currentPage_" />
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
    getUploadUrl
  } from '@/api/request'
  import {
    deepCopy
  } from '@/utils/util'
  export default {
    data() {
      return {
        settleMethod: '2',
        loading: false,
        disabled: false,
        disabledTime: false,
        submitStatus: '',
        showGoodsList: false,
        // 表单数据
        liveDate: '',
        form: {
          couponModelList: [],
          relatedGoodsList: [],
          liveName: '',
        },
        startDateTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() <= Date.now()
          }
        },
        // 商品列表
        tableData: {
          list: []
        },
        localTableData: [],
        multipleSelection: [],
        bindingList: [],
        searchParam: {
          pageSize: 10,
          pageNum: 1,
        },
        searchParam_: {
          pageSize: 10,
          pageNum: 1,
        },
        // 商品列表
        tableData_: {
          list: []
        },
        multipleSelection_: [],
        bindingList_: [],
        showGoodsList_: false,
        skuDialog: false,
        skuTableData: {},
        localSkuTableData: {},
      }
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    computed: {},
    mounted() {
      this.initSettlementMethod()
      if (this.editData.operation == "add") {
        this.submitStatus = 1
      } else if (this.editData.operation == "edit") {
        this.disabledTime = true
        this.submitStatus = 2
        this.dataEcho()
      } else if (this.editData.operation == "detail") {
        this.disabledTime = true
        this.disabled = true
        this.dataEcho()
      }
    },
    created() {},
    methods: {
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.settleMethod = res.data.currentSettleMethod
          }
        );
      },
      dataEcho() {
        let that = this
        that.form = that.editData
        if (that.editData.liveGoodsList.length >= 1) {
          that.bindingList = that.editData.liveGoodsList
        }
        if (that.editData.liveCouponList.length >= 1) {
          that.bindingList_ = that.editData.liveCouponList
        }
        this.liveDate = [new Date(that.editData.liveBegin), new Date(that.editData.liveEnd)]
      },

      checkSelectable(row) {
        let mark = 0
        this.bindingList.forEach((item) => {
          if (item.goodsId === row.goodsId && (item.status || item.status === 0)) {
            mark = mark + 1
            return false
          }
        })
        return mark <= 0
      },
      activityDateTimeChange() {
        this.form.liveBegin = this.liveDate[0]
        this.form.liveEnd = this.liveDate[1]
      },

      // 关联商品
      relatedCoupon() {
        this.searchParam_.pageNum = 1
        this.loadGoodsList_()
        this.showGoodsList_ = true
      },
      showGoodsListClose_() {
        this.searchParam_ = {
          pageSize: 10,
          pageNum: 1,
        }
        if (this.multipleSelection_.length > 0) {
          this.bindingList_.forEach((i, dex) => {
            this.multipleSelection_.forEach((item, index) => {
              if (i.id == item.id) {
                this.multipleSelection_.splice(index, 1)
              }
            })
          })
          this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
          this.bindingList_.forEach(item => {
            if (item.purchaseLimit) {
              item.purchaseLimit = item.purchaseLimit
            }
            // item.purchaseLimit=item.purchaseLimit?item.purchaseLimit:0
          })
        }
        console.log('this.bindingList_', this.bindingList_)
        this.showGoodsList_ = false
      },
      checkSelectable_(row) {
        let mark = 0
        this.bindingList_.forEach((item) => {
          if (item.id === row.id && (item.status || item.status === 0)) {
            mark = mark + 1
            return false
          }
        })
        return mark <= 0
      },
      search_() {
        if (this.multipleSelection_.length > 0) {
          this.bindingList_.forEach((i, dex) => {
            this.multipleSelection_.forEach((item, index) => {
              if (i.id == item.id) {
                this.multipleSelection_.splice(index, 1)
              }
            })
          })
          this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
        }
        this.searchParam_.pageNum = 1
        this.loadGoodsList_();
      },
      // 获取商品列表
      loadGoodsList_() {
        getMethod("/coupon/search-coupon-list", this.searchParam_).then(res => {
          this.tableData_.list = res.data.records;
          this.tableData_.total = res.data.total;
          this.showPagination = this.tableData_.total == 0;
          if (this.bindingList_ && this.bindingList_.length > 0) {
            this.testF_()
          }
        });

      },
      testF_() {
        this.$nextTick(() => {
          this.tableData_.list.forEach((item, index) => {
            this.bindingList_.forEach((i, dex) => {
              if (i.id == item.id) {
                this.$refs.multipleTable_.toggleRowSelection(this.tableData_.list[index], true)
              }
            })
          })
        })
      },
      selectThis_(selection, row) {
        this.multipleSelection_ = selection
        this.bindingList_.forEach((item, index) => {
          if (row.id == item.id) {
            this.bindingList_.splice(index, 1)
          }
        })
      },
      currentPage_(pageNum) {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.id == item.id) {
                this.multipleSelection_.splice(index, 1)
              }
            })
          })
          this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
        }
        this.searchParam_.pageNum = pageNum;
        this.loadGoodsList_();
      },
      deleteGoods_(row, val) {
        let that = this
        that.bindingList_.map((item, index) => {
          if (val == index) {
            that.bindingList_.splice(index, 1)
          }
        })
      },
      // 新建标签跳详情
      getGoodsDtl_(row) {
        let newpage = this.$router.resolve({
          path: "/bussinesManager/coupon/coupon", //路径
          query: {
            id: row.id, //商品id
          }
        })
        window.open(newpage.href, '_blank');
      },


      testTop(row, index) {
        let scope = this
        if (row.top == "0") {
          postMethod('/live/top-live-goods?liveGoodsId=' + row.id).then(res => {
            this.$set(this.bindingList[index], 'top', '1')
            this.$forceUpdate()
            this.$message({
              message: "置顶成功",
              type: "success"
            });
          });
        } else if (row.top == "1") {
          postMethod('/live/top-cancel-live-goods?liveGoodsId=' + row.id).then(res => {
            this.$set(this.bindingList[index], 'top', '0')
            this.$forceUpdate()
            this.$message({
              message: "取消成功",
              type: "success"
            });
          });
        }
      },
      enable(row, index) {
        let scope = this
        if (row.status == "0") {
          postMethod('/live/enable-live-goods?liveGoodsId=' + row.id).then(res => {
            this.$set(this.bindingList[index], 'status', '1')
            this.$forceUpdate()
            this.$message({
              message: "启售成功",
              type: "success"
            });
          });
        } else if (row.status == "1") {
          postMethod('/live/disable-live-goods?liveGoodsId=' + row.id).then(res => {
            this.$set(this.bindingList[index], 'status', '0')
            this.$forceUpdate()
            this.$message({
              message: "禁售成功",
              type: "success"
            });
          });
        }
      },
      testTop_(row, index) {
        let scope = this
        if (row.top == "0") {
          postMethod('/live/top-live-coupon?liveCouponId=' + row.id).then(res => {
            this.$set(this.bindingList_[index], 'top', '1')
            this.$forceUpdate()
            this.$message({
              message: "置顶成功",
              type: "success"
            });
          });
        } else if (row.top == "1") {
          postMethod('/live/top-cancel-live-coupon?liveCouponId=' + row.id).then(res => {
            this.$set(this.bindingList_[index], 'top', '0')
            this.$forceUpdate()
            this.$message({
              message: "取消成功",
              type: "success"
            });
          });
        }
      },
      enable_(row, index) {
        let scope = this
        if (row.status == "0") {
          postMethod('/live/enable-live-coupon?liveCouponId=' + row.id).then(res => {
            this.$set(this.bindingList_[index], 'status', '1')
            this.$forceUpdate()
            this.$message({
              message: "启售成功",
              type: "success"
            });
          });
        } else if (row.status == "1") {
          postMethod('/live/disable-live-coupon?liveCouponId=' + row.id).then(res => {
            this.$set(this.bindingList_[index], 'status', '0')
            this.$forceUpdate()
            this.$message({
              message: "禁售成功",
              type: "success"
            });
          });
        }
      },
      //修改SKU价格彈框
      modifySku(row) {
        this.skuDialog = true
        console.log(row, 'sku信息')

        if (row.localSkuList) {
          this.skuTableData = row.localSkuList
          this.localSkuTableData = JSON.parse(JSON.stringify(row.localSkuList))
        } else {
          if (row.relatedSkuList) {

            let table = this.loadTableList(row.relatedSkuList, row.goodsName, row.goodsId, row)
            this.skuTableData = table
            this.localSkuTableData = JSON.parse(JSON.stringify(table))
          } else {
            let table = this.loadTableList(row.skuList, row.goodsName, row.goodsId, row)
            this.skuTableData = table
            this.localSkuTableData = JSON.parse(JSON.stringify(table))
          }
        }

      },
      skuClose() {
        console.log(this.skuTableData, this.bindingList, this.localSkuTableData, 'this.skuTableData')
        this.skuTableData = this.localSkuTableData
        for (let i = 0; i < this.bindingList.length; i++) {
          if (this.skuTableData.goodsId == this.bindingList[i].goodsId) {
            this.bindingList[i].localSkuList = this.skuTableData
          }
        }
        this.skuDialog = false
      },
      enterSku() {
        for (let i = 0; i < this.bindingList.length; i++) {
          if (this.skuTableData.goodsId == this.bindingList[i].goodsId) {
            this.bindingList[i].localSkuList = this.skuTableData
          }
        }
        this.localSkuTableData = {}
        this.skuDialog = false
      },
      // 控制合并表格的行和列
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {

        if (row.tdList[columnIndex] === undefined) {
          // 超出了 tdList 的长度 不属于动态列的范围 正常显示
          return {
            rowspan: 1,
            colspan: 1
          }
        }

        // 如果不展示 则把此单元格合并到0 即消掉 不显示
        if (!row.tdList[columnIndex].rowSpanShow) {
          return {
            rowspan: 0,
            colspan: 1
          }
        }

        // 否则 按照计算好的行数来合并
        return {
          rowspan: row.tdList[columnIndex].rowSpan,
          colspan: 1
        }
      },

      // 加载SKU表格的数据
      loadTableList(skuPriceList, goodsName, goodsId, objData) {
        console.log(skuPriceList, goodsName, goodsId, objData, 'sku信息');
        let tempTableList = []
        let columnList = []
        for (let i = 0; i < skuPriceList.length; i++) {
          skuPriceList[i].goodsName = goodsName
          skuPriceList[i].maxStock = skuPriceList[i].stock
          skuPriceList[i].limitSaleNum = (skuPriceList[i].limitSaleNum != null) ? skuPriceList[i].limitSaleNum :
            skuPriceList[i].stock
          skuPriceList[i].livePrice = (skuPriceList[i].livePrice != null) ? skuPriceList[i].livePrice : skuPriceList[i]
            .salePrice
          tempTableList[i] = deepCopy(skuPriceList[i])
          tempTableList[i].tdList = []

          const attrName2ValueList = tempTableList[i].skuText.split(';')

          for (let j = 0; j < attrName2ValueList.length; j++) {
            const [specName, specValue] = attrName2ValueList[j].split(':')
            // 填充一次动态列
            if (i === 0) {
              columnList.push(specName)
            }
            // 原理 本列上一行的值一样 合并行
            let thisRowSpan = 1
            let thisRowSpanShow = true

            if (i > 0) {
              let tempIndex = i - 1
              let preData = tempTableList[tempIndex].tdList[j]

              // 本行和同列上一行的值相等
              if (preData.value === specValue) {
                // 找到最近的上级节点
                while (tempIndex >= 0) {
                  preData = tempTableList[tempIndex].tdList[j]
                  if (preData.rowSpanShow) {
                    // 更改他的行数
                    preData.rowSpan++
                    break
                  }

                  tempIndex--
                }

                thisRowSpan = 1
                thisRowSpanShow = false
              }
            }

            tempTableList[i].tdList.push({
              name: specName,
              value: specValue,
              rowSpan: thisRowSpan,
              rowSpanShow: thisRowSpanShow
            })
          }
        }

        return {
          id: objData.id ? objData.id : null,
          goodsId: goodsId,
          goodsName: goodsName,
          table: tempTableList,
          columnList: columnList
        }
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
              if (i.goodsId == item.goodsId) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
          this.bindingList.forEach(item => {
            if (item.purchaseLimit) {
              item.purchaseLimit = item.purchaseLimit
            }
            // item.purchaseLimit=item.purchaseLimit?item.purchaseLimit:0
          })
        }
        console.log('this.bindingList', this.bindingList)
        this.showGoodsList = false
      },
      changeVal() {
        this.$forceUpdate();
      },
      deleteGoods(row, val) {
        let that = this
        that.bindingList.map((item, index) => {
          if (val == index) {
            that.bindingList.splice(index, 1)
          }
        })
      },
      // 新建标签跳详情
      getGoodsDtl(row) {
        let newpage = this.$router.resolve({
          path: "/goods/list", //路径
          query: {
            goodsId: row.goodsId, //商品id
          }
        })
        window.open(newpage.href, '_blank');
      },
      submitUpdate(val) {
        console.log(this.bindingList, 'this.bindingList')
        // return false
        if (this.form.liveName == '') {
          this.$message({
            message: "直播名称不能为空",
            type: "warning"
          });
          return false
        }
        if (this.liveDate == '') {
          this.$message({
            message: "直播时间不能为空",
            type: "warning"
          });
          return false
        }
        if (this.bindingList.length <= 0) {
          this.$message({
            message: "请选择直播需要关联的商品",
            type: "warning"
          });
          return false
        }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let relatedGoodsList = []
            let goodsObj
            let skuObj
            for (let i = 0; i < this.bindingList.length; i++) {
              let relatedSkuList = []
              let arr = this.bindingList[i]
              console.log('arr', arr);
              if (arr.localSkuList) {
                for (let j = 0; j < arr.localSkuList.table.length; j++) {
                  let localArr = arr.localSkuList.table[j]
                  if (localArr.livePrice === '') {
                    this.$message({
                      message: arr.goodsName + "的直播价不能为空",
                      type: 'warning'
                    });
                    return false;
                  }
                  if (localArr.limitSaleNum === '' || localArr.limitSaleNum == null) {
                    this.$message({
                      message: arr.goodsName + "的限售不能为空",
                      type: 'warning'
                    });
                    return false;
                  }
                  skuObj = {
                    id: localArr.id ? localArr.id : null,
                    liveGoodsId: localArr.liveGoodsId ? localArr.liveGoodsId : null,
                    goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                    limitSaleNum: (localArr.limitSaleNum != null) ? localArr.limitSaleNum : localArr.stock,
                    livePrice: (localArr.livePrice != null) ? localArr.livePrice : localArr.salePrice,
                    salePrice: localArr.salePrice,
                    skuText: localArr.skuText
                  }
                  relatedSkuList.push(skuObj)
                }
              }
              if (!arr.localSkuList && arr.skuList) {
                for (let j = 0; j < arr.skuList.length; j++) {
                  let localArr = arr.skuList[j]
                  if (localArr.livePrice === '') {
                    this.$message({
                      message: arr.goodsName + "的直播价不能为空",
                      type: 'warning'
                    });
                    return false;
                  }
                  skuObj = {
                    id: localArr.id ? localArr.id : null,
                    liveGoodsId: localArr.liveGoodsId ? localArr.liveGoodsId : null,
                    goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                    limitSaleNum: (localArr.limitSaleNum != null) ? localArr.limitSaleNum : localArr.stock,
                    livePrice: (localArr.livePrice != null) ? localArr.livePrice : localArr.salePrice,
                    salePrice: localArr.salePrice,
                    skuText: localArr.skuText
                  }
                  relatedSkuList.push(skuObj)
                }
              }
              if (!arr.localSkuList && arr.relatedSkuList) {
                for (let j = 0; j < arr.relatedSkuList.length; j++) {
                  let localArr = arr.relatedSkuList[j]
                  if (localArr.livePrice === '') {
                    this.$message({
                      message: arr.goodsName + "的直播价不能为空",
                      type: 'warning'
                    });
                    return false;
                  }
                  if (localArr.limitSaleNum === '' || localArr.limitSaleNum == null) {
                    this.$message({
                      message: arr.goodsName + "的限售不能为空",
                      type: 'warning'
                    });
                    return false;
                  }
                  skuObj = {
                    id: localArr.id ? localArr.id : null,
                    liveGoodsId: localArr.liveGoodsId ? localArr.liveGoodsId : null,
                    goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                    limitSaleNum: (localArr.limitSaleNum != null) ? localArr.limitSaleNum : localArr.stock,
                    livePrice: (localArr.livePrice != null) ? localArr.livePrice : localArr.salePrice,
                    salePrice: localArr.salePrice,
                    skuText: localArr.skuText
                  }
                  relatedSkuList.push(skuObj)
                }
              }
              if (arr.supplierSettleRatio == null && this.settleMethod == 1) {
                this.$message({
                  message: arr.goodsName + "的供应商结算比例不能为空 ",
                  type: 'warning'
                });
                return false;
              }
              if (arr.storeSettleRatio == null && this.settleMethod == 1) {
                this.$message({
                  message: arr.goodsName + "的门店结算比例不能为空 ",
                  type: 'warning'
                });
                return false;
              }
              if (parseInt(arr.storeSettleRatio + arr.supplierSettleRatio) > parseInt(100)) {
                this.$message({
                  message: arr.goodsName + "的结算比例和不能大于100%",
                  type: 'warning'
                });
                return false;
              }
              if (this.settleMethod == 1) {
                goodsObj = {
                  goodsId: arr.goodsId,
                  purchaseLimit: arr.purchaseLimit ? arr.purchaseLimit : 0,
                  storeSettleRatio: arr.storeSettleRatio,
                  supplierSettleRatio: arr.supplierSettleRatio,
                  goodsId: arr.goodsId,
                  sort: i + 1,
                  status: (arr.status || arr.status === 0) ? arr.status : '1',
                  top: (arr.top != null) ? arr.top : '0',
                  relatedSkuList: relatedSkuList,
                }
                relatedGoodsList.push(goodsObj)
              } else if (this.settleMethod == 2) {
                goodsObj = {
                  goodsId: arr.goodsId,
                  purchaseLimit: arr.purchaseLimit ? arr.purchaseLimit : 0,
                  storeProfitRatio: "100",
                  goodsId: arr.goodsId,
                  sort: i + 1,
                  status: (arr.status || arr.status === 0) ? arr.status : '1',
                  top: (arr.top != null) ? arr.top : '0',
                  relatedSkuList: relatedSkuList,
                }
                relatedGoodsList.push(goodsObj)
              }
            }
            console.log(relatedGoodsList)
            // return false
            let couponModelList = []
            let couponObj
            if (this.bindingList_.length >= 1) {
              for (let i = 0; i < this.bindingList_.length; i++) {
                console.log(i)
                let arr = this.bindingList_[i]
                couponObj = {
                  couponId: arr.id,
                  liveId: arr.liveId ? arr.liveId : '',
                  purchaseLimit: arr.purchaseLimit ? arr.purchaseLimit : '0',
                  sort: i + 1,
                  status: (arr.status || arr.status === 0) ? arr.status : '1',
                  top: (arr.top != null) ? arr.top : '0',
                  storeProfitRatio: "100",
                  buyLivePrice: arr.buyLivePrice ? arr.buyLivePrice : arr.buyPrice
                }
                couponModelList.push(couponObj)
              }
            }

            // let goodsData = []
            // this.bindingList.forEach((item, index) => {
            //   let obj = {
            //     goodsId: item.goodsId,
            //     sort: index + 1,
            //     status: (item.status || item.status === 0) ? item.status : '1'
            //   }
            //   goodsData.push(obj)
            // })
            // this.form.relatedGoodsList = goodsData
            let param = {
              liveBegin: this.form.liveBegin,
              liveEnd: this.form.liveEnd,
              liveName: this.form.liveName,
              liveType: '3',
              // relatedGoodsList: this.form.relatedGoodsList
              relatedGoodsList: relatedGoodsList,
              couponModelList: couponModelList
            }
            console.log(param, couponModelList)
            // return false
            this.loading = true
            if (val == 1) {
              postMethod('/live/add-live', param).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              }).catch(err => {
                this.loading = false
              })
            } else if (val == 2) {
              param.liveId = this.editData.liveId
              // return false
              postMethod('/live/update-live', param).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              }).catch(err => {
                this.loading = false
              })
            }

          } else {
            this.loading = false
            return false;
          }
        })
      },
      search() {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.goodsId == item.goodsId) {
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
        postMethod("/goods/list", this.searchParam).then(res => {
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
              if (i.goodsId == item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
        })
      },
      // 选择商品
      handleSelectionChange(val) {
        let n = val.filter(item => !this.multipleSelection.includes(item));
        console.log(n); //本次新增的项
        this.multipleSelection = val;
      },
      selectThis(selection, row) {
        this.multipleSelection = selection
        this.bindingList.forEach((item, index) => {
          if (row.goodsId == item.goodsId) {
            this.bindingList.splice(index, 1)
          }
        })
      },
      selectioncChange(selection) {},
      currentPage(pageNum) {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.goodsId == item.goodsId) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },
    }
  }
</script>
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }

  .update-form-panel {
    padding: 30px 20px;
    width: 700px;
  }

  .tag {
    position: absolute;
    top: 0;
    /* border: 1px solid red; */
    width: 148px;
    line-height: 25px;
    text-align: center;
    background-color: rgb(144 147 153 / 35%);
  }

  .upLoadContainer {
    position: relative;
    margin-right: 20px;
  }

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
