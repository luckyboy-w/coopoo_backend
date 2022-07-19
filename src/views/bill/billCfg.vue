<template>
  <div v-loading="loading" class="update-form-panel">
    <el-form label-width="130px" style="display: flex;flex-wrap: nowrap;">
      <div style="font-size: 18px;font-weight: 600;width: 130px;text-align: right;margin-top: 7px;">结算方式
        <el-tooltip content="次月生效" placement="top" effect="light">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        ：
      </div>
      <el-form-item label-width="15px">
        <el-radio v-model="currentSettleMethod" label="2">成本结算</el-radio>
        <el-radio v-model="currentSettleMethod" label="1">比例结算</el-radio>
      </el-form-item>
      <el-form-item label="下月生效:">
        {{nextSettleMethod==2?'成本结算':"比例结算"}}
      </el-form-item>
    </el-form>
    <el-form v-if="currentSettleMethod==2" label-width="130px" style="display: flex;flex-wrap: nowrap;">
      <div style="font-size: 18px;font-weight: 600;width: 130px;text-align: right;margin-top: 7px;">平台服务比例：</div>
      <el-form-item label="供应商服务比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="supplierServiceRatio" />
      </el-form-item>
      <el-form-item label="门店服务比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="storeServiceRatio" />
      </el-form-item>
    </el-form>
    <el-button style="margin-left: 130px;" type="primary" @click="enterSettleMethod()">
      保存
    </el-button>

    <el-divider></el-divider>
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="供应商结算次数">
        <el-input-number v-model="dataForm.cash_supplier_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="供应商结算日">
        <!-- <el-date-picker v-model="dataForm.cash_supplier_date" type="dates" style="width:600px" size="large" format="dd"
          placeholder="选择一个或多个日期" @change="pickSupplierDate" /> -->
        <el-date-picker v-model="dataForm.cash_supplier_date" type="date" style="width:600px" size="large" format="dd"
          placeholder="请选择日期" @change="pickSupplierDate" />
      </el-form-item>
      <el-form-item label="门店结算次数">
        <el-input-number v-model="dataForm.cash_store_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="门店结算日">
        <!-- <el-date-picker v-model="dataForm.cash_store_date" type="dates" style="width:600px" size="large" format="dd"
          placeholder="选择一个或多个日期" @change="pickStoreDate" /> -->
        <el-date-picker v-model="dataForm.cash_store_date" type="date" style="width:600px" size="large" format="dd"
          placeholder="请选择日期" @change="pickStoreDate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form label-width="130px">
      <el-form-item label="手动结算日期">
        <el-date-picker v-model="monthDate" type="month" value-format="yyyy-MM" @change="pickMonthDate"
          :picker-options="pickerOptions" placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="monthSubmit">
          提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form label-width="130px" style="display: flex;flex-wrap: nowrap;">
      <div style="font-size: 18px;font-weight: 600;width: 130px;text-align: right;margin-top: 7px;">分销比例：</div>
      <el-form-item label="普通商品分销比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="commonGoodsCommissionRatio" />
      </el-form-item>
      <el-form-item label="专属商品分销比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="vipGoodsCommissionRatio" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="普通商品" name="1">
        <div style="display: flex;flex-wrap: nowrap;align-items: center;">
          <div>指定商品：</div>
          <div>
            <el-button type="success" @click="relatedGoods('1')">指定商品</el-button>
          </div>
        </div>
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;min-height: 100px;">
          <div v-for="(item,index) in bindingList" class="tabTd"
            style="border: 1px solid #cbcbcb;border-radius: 15px;padding: 10px;width: 200px;position: relative;">
            <div style="min-width: 80px;max-width: 80px;height: 80px;">
              <img style="width: 100%;height: 100%;" :src="item.goodsCoverImgUrl" />
            </div>
            <div
              style="margin-left: 10px; line-height: 25px;display: -webkit-box;word-break: break-all;text-overflow: ellipsis;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">
              {{item.goodsName}}
            </div>
            <div @click="deleteGoods(item,index)"
              style="width: 25px;height: 25px;position: absolute;top: -5px;right: -5px;">
              <i style="font-size: 25px;" class="el-icon-circle-close"></i>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专属商品" name="2">
        <div style="display: flex;flex-wrap: nowrap;align-items: center;">
          <div>指定商品：</div>
          <div>
            <el-button type="success" @click="relatedGoods('2')">指定商品</el-button>
          </div>
        </div>
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;min-height: 100px;">
          <div v-for="(item,index) in bindingList_" class="tabTd"
            style="border: 1px solid #cbcbcb;border-radius: 15px;padding: 10px;width: 200px;position: relative;">
            <div style="min-width: 80px;max-width: 80px;height: 80px;">
              <img style="width: 100%;height: 100%;" :src="item.goodsCoverImgUrl" />
            </div>
            <div
              style="margin-left: 10px; line-height: 25px;display: -webkit-box;word-break: break-all;text-overflow: ellipsis;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">
              {{item.goodsName}}
            </div>
            <div @click="deleteGoods(item,index)"
              style="width: 25px;height: 25px;position: absolute;top: -5px;right: -5px;">
              <i style="font-size: 25px;" class="el-icon-circle-close"></i>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button style="margin-left: 130px;margin-top: 30px;" type="primary" @click="enterDistribution()">
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
    getUploadUrl,
    formatDate
  } from "@/api/request";
  import {
    isInteger
  } from "@/utils/validate"

  export default {
    components: {},
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        loading: false,
        activeName: "1",
        searchParam: {
          pageSize: 10,
          pageNum: 1,
          goodsType: '',
        },
        // 商品列表
        tableData: {
          list: []
        },
        multipleSelection: [],
        bindingList: [],
        multipleSelection_: [],
        bindingList_: [],
        showGoodsList: false,

        commonGoodsCommissionRatio:'',
        vipGoodsCommissionRatio:'',

        supplierServiceRatio: '',
        storeServiceRatio: '',
        currentSettleMethod: '',
        nextSettleMethod: '',

        supplierDay: '',
        storeDay: '',
        monthDate: "",
        dataForm: {
          cash_store_count: "",
          cash_store_date: "",
          cash_supplier_count: "",
          cash_supplier_date: "",
        },
        pickerOptions: {
          disabledDate(time) {
            let t = new Date().getDate();
            return time.getTime() > Date.now();
          }
        },
      };
    },
    computed: {},
    mounted() {
      this.loadData()
      this.initSettlementMethod()
      this.initDistribution()
    },
    created() {},
    methods: {
      enterDistribution(){
        console.log(this.commonGoodsCommissionRatio,this.vipGoodsCommissionRatio,this.bindingList,this.bindingList_)
        let params = {
          commonGoodsCommissionRatio:this.commonGoodsCommissionRatio,
          vipGoodsCommissionRatio:this.vipGoodsCommissionRatio,
          commonGoodsIdList:[],
          vipGoodsIdList:[]
        }
        if(this.bindingList.length>=1){
          this.bindingList.forEach(item=>{
            params.commonGoodsIdList.push(item.goodsId)
          })
        }
        if(this.bindingList_.length>=1){
          this.bindingList_.forEach(item=>{
            params.vipGoodsIdList.push(item.goodsId)
          })
        }
        console.log('参数',params)
        // return false
        postMethod("/settlement/set-goods-commission-config",params).then(
          res => {
            console.log(res)
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$forceUpdate()
          }
        );
      },
      initDistribution(){
        getMethod("/settlement/get-goods-commission-config").then(
          res => {
            this.commonGoodsCommissionRatio = res.data.commonGoodsCommissionRatio
            this.vipGoodsCommissionRatio = res.data.vipGoodsCommissionRatio
            this.bindingList = res.data.commonGoodsIdList?res.data.commonGoodsIdList:[]
            this.bindingList_ = res.data.vipGoodsIdList?res.data.vipGoodsIdList:[]

          }
        );
      },
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.currentSettleMethod = String(res.data.currentSettleMethod)
            this.nextSettleMethod = res.data.nextSettleMethod
            this.storeServiceRatio = res.data.storeServiceRatio
            this.supplierServiceRatio = res.data.supplierServiceRatio

          }
        );
      },
      enterSettleMethod() {
        getMethod("settlement/set-settle-method", {
          settleMethod: this.currentSettleMethod,
          storeServiceRatio: this.storeServiceRatio,
          supplierServiceRatio: this.supplierServiceRatio
        }).then(
          res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.initSettlementMethod()
            this.$forceUpdate()
          }
        );
      },
      pickMonthDate(val) {},
      monthSubmit() {
        if (this.monthDate == '' || !this.monthDate) {
          this.$message({
            message: "结算月份不能为空",
            type: "warning"
          });
          return false
        }
        getMethod("/settlement/manual-settlement?date=" + this.monthDate).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.monthDate = ''
          }
        );
      },
      pickSupplierDate(val) {
        if (val) {
          // this.dataForm.cash_supplier_count = val.length
          this.dataForm.cash_supplier_count = 1
        } else {
          this.dataForm.cash_supplier_count = 0
        }
      },
      pickStoreDate(val) {
        if (val) {
          // this.dataForm.cash_store_count = val.length
          this.dataForm.cash_store_count = 1
        } else {
          this.dataForm.cash_store_count = 0
        }


      },
      format(time) {
        let date = new Date(time)
        let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return day;
      },
      loadData() {
        let scope = this
        getMethod("/operate/get-config-info").then(
          res => {
            this.dataForm.cash_store_count = res.data.cash_store_count
            this.dataForm.cash_supplier_count = res.data.cash_supplier_count
            let myDate = new Date();
            let tYear = myDate.getFullYear();
            let tMonth = myDate.getMonth() + 1;
            if (res.data.cash_store_date == '') {
              this.dataForm.cash_store_date = ''
            } else {
              this.dataForm.cash_store_date = new Date(tYear + "-" + tMonth + "-" + res.data.cash_store_date)
              // this.dataForm.cash_store_date = res.data.cash_store_date.split(",")
              // for (let j = 0; j < this.dataForm.cash_store_date.length; j++) {
              //   this.dataForm.cash_store_date[j] = new Date(tYear + "-" + tMonth + "-" + this.dataForm
              //     .cash_store_date[j])
              // }
            }
            if (res.data.cash_supplier_date == '') {
              this.dataForm.cash_supplier_date = ''
            } else {
              this.dataForm.cash_supplier_date = new Date(tYear + "-" + tMonth + "-" + res.data.cash_supplier_date)
              // this.dataForm.cash_supplier_date = res.data.cash_supplier_date.split(",")
              // for (let j = 0; j < this.dataForm.cash_supplier_date.length; j++) {
              //   this.dataForm.cash_supplier_date[j] = new Date(tYear + "-" + tMonth + "-" + this.dataForm
              //     .cash_supplier_date[j])
              // }
            }
          }
        );
      },
      saveObject() {
        let param = {
          cash_store_count: this.dataForm.cash_store_count,
          cash_store_date: this.format(this.dataForm.cash_store_date),
          cash_supplier_count: this.dataForm.cash_supplier_count,
          cash_supplier_date: this.format(this.dataForm.cash_supplier_date),
        }
        this.loading = true
        postMethod("/operate/set-config", param).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.loading = false
            this.loadData()
          }
        );
      },
      handleClick(tab, event) {
        console.log(tab, event);
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
      // 关联商品
      relatedGoods(goodsType) {
      console.log(goodsType)
          this.searchParam.goodsType = goodsType

        this.searchParam.pageNum = 1
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {

        if (this.searchParam.goodsType == 1) {
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
        } else if (this.searchParam.goodsType == 2) {
          if (this.multipleSelection_.length > 0) {
            this.bindingList_.forEach((i, dex) => {
              this.multipleSelection_.forEach((item, index) => {
                if (i.goodsId == item.goodsId) {
                  this.multipleSelection_.splice(index, 1)
                }
              })
            })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
          }
        }
        console.log(this.bindingList,this.bindingList_)
        this.searchParam = {
          pageSize: 10,
          pageNum: 1,
          goodsType: '',
        }
        this.showGoodsList = false
      },
      // deleteGoods(row, val) {
      //   let that = this
      //   that.bindingList.map((item, index) => {
      //     if (val == index) {
      //       that.bindingList.splice(index, 1)
      //     }
      //   })

      // },
      search() {
        if (this.searchParam.goodsType == 1) {
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
        } else if (this.searchParam.goodsType == 2) {
          if (this.multipleSelection_.length > 0) {
            this.bindingList_.forEach((i, dex) => {
              this.multipleSelection_.forEach((item, index) => {
                if (i.goodsId == item.goodsId) {
                  this.multipleSelection_.splice(index, 1)
                }
              })
            })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
          }
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

          if (this.searchParam.goodsType == 1) {
            if (this.bindingList && this.bindingList.length > 0) {
              this.testF()
            }
          } else if (this.searchParam.goodsType == 2) {
            if (this.bindingList_ && this.bindingList_.length > 0) {
              this.testF_()
            }
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
      testF_() {
        this.$nextTick(() => {
          this.tableData.list.forEach((item, index) => {
            this.bindingList_.forEach((i, dex) => {
              if (i.goodsId == item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
        })
      },
      // checkSelectable(row) {
      //   let mark = 0
      //   this.bindingList.forEach((item) => {
      //     if (item.goodsId === row.goodsId && (item.id)) {
      //       mark = mark + 1
      //       return false
      //     }
      //   })
      //   return mark <= 0
      // },
      // 选择商品
      selectThis(selection, row) {
        console.log(this.searchParam.goodsType)
        if (this.searchParam.goodsType == 1) {
          this.multipleSelection = selection
          this.bindingList.forEach((item, index) => {
            if (row.goodsId == item.goodsId) {
              this.bindingList.splice(index, 1)
            }
          })
        } else if (this.searchParam.goodsType == 2) {
          this.multipleSelection_ = selection
          this.bindingList_.forEach((item, index) => {
            if (row.goodsId == item.goodsId) {
              this.bindingList_.splice(index, 1)
            }
          })
        }

      },
      currentPage(pageNum) {
        if (this.searchParam.goodsType == 1) {
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
        } else if (this.searchParam.goodsType == 2) {
          if (this.multipleSelection_.length > 0) {
            this.bindingList_.forEach((i, dex) => {
              this.multipleSelection_.forEach((item, index) => {
                if (i.goodsId == item.goodsId) {
                  this.multipleSelection_.splice(index, 1)
                }
              })
            })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection_)
          }
        }

        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },

      deleteGoods(row, num) {
        console.log('8888')
        let that = this
        if (this.activeName == 1) {
          that.bindingList.map((item, index) => {
            if (item.goodsId == row.goodsId) {
              that.bindingList.splice(index, 1)
            }
          })
        } else if (this.activeName == 2) {
          that.bindingList_.map((item, index) => {
            if (item.goodsId == row.goodsId) {
              that.bindingList_.splice(index, 1)
            }
          })
        }

      },
      // saveObject() {
      //   let supplierList = [] //定义空数组
      //   let storeList = [] //定义空数组
      //   if (this.dataForm.cash_supplier_date && this.dataForm.cash_supplier_date.length >= 1) {
      //     for (let i = 0; i < this.dataForm.cash_supplier_date.length; i++) {
      //       supplierList.push(this.format(this.dataForm.cash_supplier_date[i])) //把天数添加到数组中
      //     }
      //     this.supplierDay = supplierList.toString() //把数组转字符串 赋值给str
      //   }

      //   if (this.dataForm.cash_store_date && this.dataForm.cash_store_date.length >= 1) {
      //     for (let i = 0; i < this.dataForm.cash_store_date.length; i++) {
      //       storeList.push(this.format(this.dataForm.cash_store_date[i])) //把天数添加到数组中
      //     }
      //     this.storeDay = storeList.toString() //把数组转字符串 赋值给str
      //   }

      //   let param = {
      //     cash_store_count: this.dataForm.cash_store_count,
      //     cash_store_date: this.storeDay,
      //     cash_supplier_count: this.dataForm.cash_supplier_count,
      //     cash_supplier_date: this.supplierDay,
      //   }
      //   this.loading = true
      //   postMethod("/operate/set-config", param).then(
      //     res => {
      //       this.$message({
      //         message: "操作成功",
      //         type: "success"
      //       });
      //       this.loading = false
      //       this.loadData()
      //     }
      //   );
      // },
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 800px;
  }

  .el-date-picker__header {
    display: none;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }
</style>
