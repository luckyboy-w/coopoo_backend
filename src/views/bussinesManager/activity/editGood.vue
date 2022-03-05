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
      <el-form-item label="关联商品">
        <el-button type="success" :disabled="disabled" @click="relatedGoods">关联商品</el-button>
      </el-form-item>

      <el-form-item label="已关联商品">
        <div class="ly-table-panel" style="min-width:1200px!important;">
          <div class="ly-data-list">
            <el-table ref="mainTable" :data="bindingList" style="width: 100%!important; margin-bottom: 20px;"
              row-key="id" border>
              <el-table-column prop="goodsName" label="商品名称" />

              <el-table-column label="规格价格">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="modifySku(scope.row)">
                    设置价格
                  </el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="saleVolume" label="销量" width="80" /> -->

              <el-table-column prop="purchaseLimit"
                v-if="activity.activityType==1||activity.activityType==5||activity.activityType==6" label="限购"
                width="160">
                <template slot-scope="scope">
                  <el-input-number :disabled="disabled" :min="0" size="mini" placeholder="1"
                    v-model="scope.row.purchaseLimit" />
                </template>
              </el-table-column>
              <el-table-column prop="personNum" v-if="activity.activityType==6" label="砍价人数" width="160">
                <template slot-scope="scope">
                  <el-input-number :disabled="disabled" :min="0" size="mini" placeholder="1"
                    v-model="scope.row.personNum" />
                </template>
              </el-table-column>
              <el-table-column prop="personNum" v-if="activity.activityType==5" label="拼团人数" width="160">
                <template slot-scope="scope">
                  <el-input-number :disabled="disabled" :min="0" size="mini" placeholder="1"
                    v-model="scope.row.personNum" />
                </template>
              </el-table-column>
              <el-table-column v-if="settleMethod==1" prop="supplierSettleRatio" label="供应商结算比例" width="160">
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
              </el-table-column>

              <!-- <el-table-column v-if="settleMethod==1" prop="storeProfitRatio" label="门店利润比例" width="160">
                <template slot-scope="scope">
                <el-input-number :max="100" :min="100" size="mini" placeholder="100" :disabled="true"
                  v-model="scope.row.storeProfitRatio" />
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

      <!--      <el-divider v-if="tableList!=''" />
      <div v-for="(table,index) in tableList" style="margin-top: 20px">
        <p style="font-size: 15px;font-weight: 600;">{{ table.goodsName }}&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="warning" plain  size="small" @click="deleteGoods(table,index)">
          删除
        </el-button>
        </p>
        <span v-if="activity.activityType==1">用户限购：</span>
        <el-input-number v-if="activity.activityType==1" :max="100" :min="0" size="mini" placeholder="请输入" v-model="table.purchaseLimit" />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;供应商比例：</span>
        <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" v-model="table.supplierSettleRatio" />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;门店比例：</span>
        <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" v-model="table.storeSettleRatio" />
        <el-table style="margin-top: 10px" :data="table.table" :span-method="objectSpanMethod" border>
          <el-table-column
            align="center"
            v-for="(item,index) in table.columnList"
            :key="index"
            :label="item"
            width=""
          >
            <template slot-scope="scope">
              {{ scope.row.tdList[index].value }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="salePrice" label="会员价"></el-table-column>
          <el-table-column align="center" prop="promotionPrice" label="活动价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.promotionPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="限售">
            <template slot-scope="scope">
              <el-input-number v-if="!scope.row.marketingStock" :max="scope.row.maxStock" :min="0" size="medium" placeholder="请输入" v-model="scope.row.stock" />
			  <el-input-number v-if="scope.row.marketingStock" :max="scope.row.maxStock" :min="0" size="medium" placeholder="请输入" v-model="scope.row.marketingStock" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      -->


      <el-divider content-position="left" />
      <el-form-item prop="preheatStartTime" label="预热时间:">
        <el-date-picker v-model="activityGoodForm.preheatStartTime" type="datetime" disabled
          value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择预热开始时间">
        </el-date-picker>
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
    <!-- 修改属性规格弹框 -->
    <el-dialog title="修改活动商品价格" :visible.sync="skuDialog" width="50%" destroy-on-close :close-on-click-modal="false"
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
          <el-table-column v-if="activity.activityType!=6" align="center" label="活动价格">
            <template slot-scope="scope">
              <el-input :disabled="disabled" type="number" v-model="scope.row.promotionPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="activity.activityType==6" align="center" label="最低价格">
            <template slot-scope="scope">
              <el-input :disabled="disabled" type="number" v-model="scope.row.floorPrice"></el-input>
            </template>
          </el-table-column>


          <el-table-column align="center" label="限售">
            <template slot-scope="scope">
              <el-input-number :disabled="disabled" :min="0" :max="scope.row.maxStock" size="mini" placeholder="请输入"
                v-model="scope.row.marketingStock" />
              <!-- <el-input v-model="scope.row.testStock"></el-input> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: center;margin: 30px;">
        <el-button type="primary" @click="enterSku()">保存</el-button>
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
        getMethod("/activity/marketing-goods/detail?activityId=" + this.activity.id).then(res => {
          if (res.data.length >= 1) {
            this.flag = 'edit'
          } else {
            this.flag = 'add'
          }
          this.bindingList = res.data
          // res.data.forEach(item=>{
          // let obj={purchaseLimit:item.purchaseLimit,storeSettleRatio:item.storeSettleRatio,supplierSettleRatio:item.supplierSettleRatio,id:item.id}
          // let table = this.loadTableList(item.activityGoodsSkuList,item.goodsName,item.goodsId,obj)
          // table.table.map(i=>{
          //   i.maxStock=i.stock
          // })
          // this.tableList.push(table)
          // })
        });
      },
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.settleMethod = res.data.currentSettleMethod
          }
        );
      },
      //修改SKU价格彈框
      modifySku(row) {
        this.skuDialog = true
        if (row.localSkuList) {
          this.skuTableData = row.localSkuList
          this.localSkuTableData = JSON.parse(JSON.stringify(row.localSkuList))
        } else {
          if (row.activityGoodsSkuList) {
            let table = this.loadTableList(row.activityGoodsSkuList, row.goodsName, row.goodsId, row)
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
        // console.log(skuPriceList, goodsName, goodsId, objData, 'sku信息');
        let tempTableList = []
        let columnList = []
        console.log(skuPriceList, 'skuPriceList')
        for (let i = 0; i < skuPriceList.length; i++) {
          skuPriceList[i].goodsName = goodsName
          skuPriceList[i].maxStock = skuPriceList[i].stock
          skuPriceList[i].marketingStock = (skuPriceList[i].marketingStock != null) ? skuPriceList[i].marketingStock :
            skuPriceList[i].stock
          skuPriceList[i].promotionPrice = (skuPriceList[i].promotionPrice != null) ? skuPriceList[i].promotionPrice :
            skuPriceList[i].salePrice
          skuPriceList[i].floorPrice = (skuPriceList[i].floorPrice != null) ? skuPriceList[i].floorPrice :
            skuPriceList[i].salePrice

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
          // console.log(this.bindingList)
          this.bindingList.forEach(item => {
            if (item.purchaseLimit || item.purchaseLimit == "0") {
              item.purchaseLimit = item.purchaseLimit
            }
            if ((this.activity.activityType == 5 || this.activity.activityType == 6) && (item.personNum || item
                .personNum == "0")) {
              item.personNum = item.personNum
            }
            // item.purchaseLimit=item.purchaseLimit?item.purchaseLimit:'1'
          })
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
      checkSelectable(row) {
        let mark = 0
        this.bindingList.forEach((item) => {
          if (item.goodsId === row.goodsId && (item.id)) {
            mark = mark + 1
            return false
          }
        })
        return mark <= 0
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

      deleteGoods(row, num) {
        let that = this
        that.bindingList.map((item, index) => {
          if (item.goodsId == row.goodsId) {
            that.bindingList.splice(index, 1)
          }
        })
        if (row.id) {
          getMethod("/activity/marketing-goods/remove?id=" + row.id).then(res => {
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
          path: "/goods/list", //路径
          query: {
            goodsId: row.goodsId, //商品id
          }
        })
        window.open(newpage.href, '_blank');
      },
      submit() {
        // console.log(this.bindingList)
        if (this.bindingList.length === 0) {
          this.$message({
            message: "请选择要关联的商品",
            type: 'warning'
          });
          return;
        }
        const integerReg = /^\+?[1-9][0-9]*$/;
        let marketingGoodList = []
        // let marketingGoodsList = []
        let goodsObj
        let skuObj
        for (let i = 0; i < this.bindingList.length; i++) {
          let marketingGoodsSkuList = []
          let arr = this.bindingList[i]
          console.log('arr', arr);
          if (arr.localSkuList) {
            for (let j = 0; j < arr.localSkuList.table.length; j++) {
              let localArr = arr.localSkuList.table[j]
              if (this.activity.activityType != 6 && localArr.promotionPrice === '') {
                this.$message({
                  message: arr.goodsName + "的活动价不能为空",
                  type: 'warning'
                });
                return false;
              }
              if (this.activity.activityType == 6 && localArr.floorPrice === '') {
                this.$message({
                  message: arr.goodsName + "的最低价不能为空",
                  type: 'warning'
                });
                return false;
              }
              if (localArr.marketingStock === '' || localArr.marketingStock == null) {
                this.$message({
                  message: arr.goodsName + "的限售不能为空",
                  type: 'warning'
                });
                return false;
              }
              skuObj = {
                id: localArr.id ? localArr.id : null,
                goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                marketingStock: (localArr.marketingStock != null) ? localArr.marketingStock : localArr.stock,
                promotionPrice: (localArr.promotionPrice != null) ? localArr.promotionPrice : localArr.salePrice,
                floorPrice: '',
                salePrice: localArr.salePrice
              }
              if (this.activity.activityType == 6) {
                skuObj.floorPrice = (localArr.floorPrice != null) ? localArr.floorPrice : localArr.salePrice
              } else {
                delete skuObj.floorPrice
              }
              marketingGoodsSkuList.push(skuObj)
            }
          }
          if (!arr.localSkuList && arr.skuList) {
            for (let j = 0; j < arr.skuList.length; j++) {
              let localArr = arr.skuList[j]
              if (this.activity.activityType != 6 && localArr.promotionPrice === '') {
                this.$message({
                  message: arr.goodsName + "的活动价不能为空",
                  type: 'warning'
                });
                return false;
              }
              if (this.activity.activityType == 6 && localArr.floorPrice === '') {
                this.$message({
                  message: arr.goodsName + "的最低价不能为空",
                  type: 'warning'
                });
                return false;
              }
              skuObj = {
                id: localArr.id ? localArr.id : null,
                goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                marketingStock: (localArr.marketingStock != null) ? localArr.marketingStock : localArr.stock,
                promotionPrice: (localArr.promotionPrice != null) ? localArr.promotionPrice : localArr.salePrice,
                floorPrice: '',
                salePrice: localArr.salePrice
              }
              if (this.activity.activityType == 6) {
                skuObj.floorPrice = (localArr.floorPrice != null) ? localArr.floorPrice : localArr.salePrice
              } else {
                delete skuObj.floorPrice
              }
              marketingGoodsSkuList.push(skuObj)
            }
          }
          if (!arr.localSkuList && arr.activityGoodsSkuList) {
            for (let j = 0; j < arr.activityGoodsSkuList.length; j++) {
              let localArr = arr.activityGoodsSkuList[j]
              if (this.activity.activityType != 6 && localArr.promotionPrice === '') {
                this.$message({
                  message: arr.goodsName + "的活动价不能为空",
                  type: 'warning'
                });
                return false;
              }
              if (this.activity.activityType == 6 && localArr.floorPrice === '') {
                this.$message({
                  message: arr.goodsName + "的最低价不能为空",
                  type: 'warning'
                });
                return false;
              }
              if (localArr.marketingStock === '' || localArr.marketingStock == null) {
                this.$message({
                  message: arr.goodsName + "的限售不能为空",
                  type: 'warning'
                });
                return false;
              }
              skuObj = {
                id: localArr.id ? localArr.id : null,
                goodsSkuId: localArr.goodsSkuId ? localArr.goodsSkuId : localArr.skuId,
                marketingStock: (localArr.marketingStock != null) ? localArr.marketingStock : localArr.stock,
                promotionPrice: (localArr.promotionPrice != null) ? localArr.promotionPrice : localArr.salePrice,
                floorPrice: '',
                salePrice: localArr.salePrice
              }
              if (this.activity.activityType == 6) {
                skuObj.floorPrice = (localArr.floorPrice != null) ? localArr.floorPrice : localArr.salePrice
              } else {
                delete skuObj.floorPrice
              }
              marketingGoodsSkuList.push(skuObj)
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
              id: arr.id ? arr.id : null,
              goodsId: arr.goodsId,
              purchaseLimit: (arr.purchaseLimit != null) ? arr.purchaseLimit : 1,
              storeSettleRatio: arr.storeSettleRatio,
              supplierSettleRatio: arr.supplierSettleRatio,
              personNum: '',
              marketingGoodsSkuList: marketingGoodsSkuList
            }
            if (this.activity.activityType == 5 || this.activity.activityType == 6) {
              goodsObj.personNum = (arr.personNum != null) ? arr.personNum : 1
            } else {
              delete goodsObj.personNum
            }
            marketingGoodList.push(goodsObj)
          } else if (this.settleMethod == 2) {
            goodsObj = {
              id: arr.id ? arr.id : null,
              goodsId: arr.goodsId,
              purchaseLimit: (arr.purchaseLimit != null) ? arr.purchaseLimit : 1,
              storeProfitRatio: "100",
              personNum: '',
              marketingGoodsSkuList: marketingGoodsSkuList
            }
            if (this.activity.activityType == 5 || this.activity.activityType == 6) {
              goodsObj.personNum = (arr.personNum != null) ? arr.personNum : 1
            } else {
              delete goodsObj.personNum
            }
            marketingGoodList.push(goodsObj)
          }


        }
        console.log(marketingGoodList)
        // return false
        let param = {
          goodsActivityId: this.activity.id,
          marketingGoodList: marketingGoodList
        }
        this.loading = true
        if (this.flag == 'add') {
          postMethod('/activity/marketing-goods/save', param).then(
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

              this.$emit('hiddenSaveGood')
            }
          ).catch(error => {
            this.loading = false
          })
        } else {
          postMethod('/activity/marketing-goods/update', param).then(
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

              this.$emit('hiddenSaveGood')
            }
          ).catch(error => {
            this.loading = false
          })
        }

      },

      backToMarketingGoodsList() {
        this.$emit('hiddenSaveGood')
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
