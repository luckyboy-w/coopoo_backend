<template>
  <div class="ly-container">
    <el-button style="margin-bottom: 10px" @click="backToMarketingGoodsList()" plain icon="el-icon-back">返回列表
    </el-button>
    <el-form
      class="update-form-panel"
      ref="activityGoodForm"
      :rules="activityFormRules"
      :model="activityGoodForm"
    >
      <el-divider/>
      <el-form-item label="活动名称:">
        {{ activity.activityName }}
      </el-form-item>
      <el-divider/>
      <el-form-item label="供应商名名称:" prop="supplierId">
        <el-select v-model="activityGoodForm.supplierId" @change="changeSupplierEvent" placeholder="请选择">
          <el-option value="" label="全部"/>
          <el-option
            v-for="item in supplyList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-divider/>
      <el-form-item label="商品名称:" prop="supplierId" width="180px">
        <el-input @input="goodInputEvent" style="width: 180px" v-model="goodName"/>
      </el-form-item>
      <el-scrollbar>
        <div style="height: 100px;width: 100%" @click.stop v-loading="loadingCheckMarketingGoods">
          <el-checkbox-group v-model="checkedGood" @change="handleCheckedGoodChange">
            <el-checkbox :class="{ 'active': good.selected != undefined }" v-for="good in goodList" :label="good.id"
                         :key="good.id"
            >
              <span @click.prevent="showGoodDetail(good.id)">{{ good.goodName }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <el-divider/>
      <div v-for="(table,index) in tableList" :key="table.goodId" style="margin-top: 20px">
        <p>{{ table.goodName }}</p>
        <span>用户限购&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-input v-model="table.userLimit" style="width: 200px"></el-input>
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
          <el-table-column align="center" prop="saleMemPrice" label="会员价"></el-table-column>
          <el-table-column align="center" prop="marketingPrice" label="活动价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.marketingPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="marketingStock" label="活动库存">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider/>
      <el-row align="middle">
        <el-col :span="3">
          <div style="height:130px;display: table-cell;vertical-align:middle" class="grid-content bg-purple-dark">
            <span>供应商比例:</span>
            <el-input placeholder="请输入..." style="width: 100px" v-model="activityGoodForm.supplierRebateRatio"/>
            %
          </div>
        </el-col>
        <el-col :span="2">
          <div style="height:130px;display: table-cell;vertical-align:middle;margin-right: 10px;"
               class="grid-content bg-purple-dark"
          >
            <span>服务商比例:</span>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content bg-purple-dark" style="height:150px">
            <el-table :data="rebateRatioData" :header-cell-style="{'text-align':'center'}"
                      :cell-style="{'text-align':'center'}" border
            >
              <el-table-column prop="id" label="A（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioA"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="B（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioB"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="C（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioC"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="D（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioD"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="E（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioE"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="EA（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioEA"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left"/>
      <el-form-item prop="preheatTimePeriod" label="预热时间:" >
        <el-date-picker
          v-model="activityGoodForm.preheatTimePeriod"
          type="datetimerange"
          range-separator="至"
          disabled
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-divider content-position="left"/>
      <el-form-item prop="activityTimePeriod" label="活动有效期:" >
        <el-date-picker
          v-model="activityGoodForm.activityTimePeriod"
          type="datetimerange"
          range-separator="至"
          disabled
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-divider content-position="left"/>
      <el-button @click="submit" :loading="loading" style="display:block;margin:0 auto" type="primary">提交</el-button>
    </el-form>

    <el-dialog :visible.sync="isShowGoodDetail" append-to-body>
      <showGoodDetail :is-gift="isGift" :edit-data="goodInfo" :is-edit-good="isEditGood"/>
    </el-dialog>
  </div>
</template>

<script>
import {getMethod, postMethod} from '@/api/request'
import showGoodDetail from "./goodDetial.vue";
import {deepCopy} from '@/utils/util'

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
  components: {showGoodDetail},
  data() {
    return {
      isShowGoodDetail: false,
      isEditGood: false,
      loading: false,
      loadingCheckMarketingGoods: false,
      goodInfo: null,
      isGift: '1',
      checkedGood: [],
      goodName: null,
      supplyList: [],
      goodList: [],
      activityGoodList: [],
      tableList: [],
      addStockColumnList: [],
      goodSkuList: [],
      rebateRatioData: [{
        providerRebateRatioA: 10,
        providerRebateRatioB: 10,
        providerRebateRatioC: 10,
        providerRebateRatioD: 10,
        providerRebateRatioE: 10,
        providerRebateRatioEA: 5
      }],
      activityGoodForm: {
        supplierId: '',
        supplierRebateRatio: 90
      },
      activityFormRules: {}
    };
  },
  computed: {},
  beforeMount() {
  },

  mounted() {
    this.activityGoodForm.activityTimePeriod = [new Date(this.activity.startTime), new Date(this.activity.endTime)]
    this.activityGoodForm.preheatTimePeriod = [new Date(this.activity.preheatStartTime), new Date(this.activity.preheatEndTime)]
    this.initSupplyList()
  },

  methods: {
    initSupplyList() {
      const goodActivityId = this.activity.id
      getMethod('/backend/supplier/activityGoodSupplierList', {goodActivityId}).then(res => {
        this.supplyList = res.data
      })
    },

    changeSupplierEvent(supplierId) {
      if (supplierId == '' || supplierId == undefined || supplierId == null) {
        return
      }
      const goodActivityId = this.activity.id
      getMethod('/backend/goodActivity/findAllGoodBySupplierId', {supplierId, goodActivityId}).then(res => {
        console.log(res)
        this.goodList = res.data
      })
    },

    handleCheckedGoodChange(checkedGood) {
      this.loadingCheckMarketingGoods = true

      let newGoodArray = this.tableList.filter(good => checkedGood.some(goodId => goodId === good.goodId));

      if (this.tableList.length > checkedGood.length) {
        if (checkedGood.length == 0) {
          this.tableList = []
        } else {
          this.tableList = []
          for (let i = 0; i < newGoodArray.length; i++) {
            this.tableList.push(newGoodArray[i])
          }
        }
        this.loadingCheckMarketingGoods = false
      } else if (this.tableList.length < checkedGood.length) {
        let checkedGoodId = checkedGood[checkedGood.length - 1]
        let good = this.goodList.filter(item => item.id == checkedGoodId)
        let param = {
          goodId: checkedGood[checkedGood.length - 1]
        }

        getMethod("/backend/good/findById", param).then(res => {
          this.$nextTick(() => {
            let table = this.loadTableList(res.data.skuPriceList, good[0].goodName, good[0].id)
            this.tableList.push(table)
          })
          this.loadingCheckMarketingGoods = false
        });
      }
    },

    goodInputEvent(inputValue) {
		console.log(inputValue,'inputValue')
      if (this.goodList.length > 0) {
        this.goodList.forEach(item => {
          if (inputValue != '' && item.goodName.includes(inputValue)) {
            item.selected = 'matched';
          } else {
            item.selected = undefined;
          }
        })
      }
    },

    showGoodDetail(goodId) {
      let scope = this

      let param = {
        goodId: goodId
      }
      getMethod("/backend/good/findById", param).then(res => {
        scope.isEditGood = true
        scope.goodInfo = res.data
        this.isShowGoodDetail = true
      });
    },

    submit() {
      if (this.tableList.length == 0) {
        this.$message({
          message: "请选择商品",
          type: 'warning'
        });
        return;
      }

      this.activityGoodForm.providerRebateRatioA = this.rebateRatioData[0].providerRebateRatioA;
      this.activityGoodForm.providerRebateRatioB = this.rebateRatioData[0].providerRebateRatioB
      this.activityGoodForm.providerRebateRatioC = this.rebateRatioData[0].providerRebateRatioC
      this.activityGoodForm.providerRebateRatioD = this.rebateRatioData[0].providerRebateRatioD
      this.activityGoodForm.providerRebateRatioE = this.rebateRatioData[0].providerRebateRatioE
      this.activityGoodForm.providerRebateRatioEA = this.rebateRatioData[0].providerRebateRatioEA
      const integerReg = /^\+?[1-9][0-9]*$/;

      let marketingGoodsList = []

      for (let i = 0; i < this.tableList.length; i++) {
        let table = this.tableList[i]

        table.supplierRebateRatio = this.activityGoodForm.supplierRebateRatio
        table.providerRebateRatioA = this.activityGoodForm.providerRebateRatioA
        table.providerRebateRatioB = this.activityGoodForm.providerRebateRatioB
        table.providerRebateRatioC = this.activityGoodForm.providerRebateRatioC
        table.providerRebateRatioD = this.activityGoodForm.providerRebateRatioD
        table.providerRebateRatioE = this.activityGoodForm.providerRebateRatioE
        table.providerRebateRatioEA = this.activityGoodForm.providerRebateRatioEA
        table.providerRebateRatioA = this.activityGoodForm.providerRebateRatioA
        table.goodActivityId = this.activity.id
        table.activityName = this.activity.activityName
        table.activityImageUrl = this.activity.frontImage
        table.activityStartTime = this.activity.startTime
        table.activityStartTime = this.activity.startTime
        table.activityEndTime = this.activity.endTime
        table.preheatStartTime = this.activity.preheatStartTime
        table.preheatEndTime = this.activity.preheatEndTime
        marketingGoodsList[i] = table
        table.goodSkuValList = table.table

        if (table.userLimit !== 0) {
          if (!integerReg.test(table.userLimit)) {
            this.$message({
              message: "商品名称为：" + table.goodName + "的用户限购数量不是正整数",
              type: 'warning'
            });
            return;
          }
        }

        for (let j = 0; j < this.tableList[i].table.length; j++) {
          let skuTable = table.table

          for (let k = 0; k < skuTable.length; k++) {
            let sku = skuTable[k];
            if (sku.marketingPrice == '' || sku.marketingPrice == undefined || sku.marketingPrice == null) {
              this.$message({
                message: "商品名称为：" + table.goodName + "的活动价格不能为空",
                type: 'warning'
              })
              return
            }

            if (isNaN(sku.marketingPrice) || Number(sku.marketingPrice) <= 0) {
              this.$message({
                message: "商品名称为：" + table.goodName + "的活动价格不正确",
                type: 'warning'
              });
              return;
            } else {
              let marketingPriceStr = sku.marketingPrice + "";
              const bitPos = marketingPriceStr.indexOf(".");
              const totalBits = marketingPriceStr.length - bitPos - 1;

              if (bitPos == -1 && totalBits > 2) {
                this.$message({
                  message: "商品名称为：" + table.goodName + "的活动价格小数点只能有后两位",
                  type: 'warning'
                });
                return
              }
            }

            if (sku.stock == 0) {
              this.$message({
                message: "商品名称为：" + table.goodName + "的活动库存不能为0",
                type: 'warning'
              });
              return;
            }

            if (!integerReg.test(sku.stock)) {
              this.$message({
                message: "商品名称为：" + table.goodName + "的活动库存不是正整数",
                type: 'warning'
              });
              return;
            }

            sku.marketingStock = sku.stock
          }
        }
      }

      if (this.checkRebateRatio(this.activityGoodForm.supplierRebateRatio, "供应商比例输入错误", "供应商比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.providerRebateRatioA, "服务商A比例输入错误", "服务商A比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.providerRebateRatioB, "服务商B比例输入错误", "服务商B比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.providerRebateRatioC, "服务商C比例输入错误", "服务商C比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.supplierRebateRatio, "服务商D比例输入错误", "服务商D比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.providerRebateRatioD, "服务商E比例输入错误", "服务商E比例小数点后只能一位")) {
        return
      }

      if (this.checkRebateRatio(this.activityGoodForm.providerRebateRatioEA, "服务商EA比例输入错误", "服务商EA比例小数点后只能一位")) {
        return
      }

      let supplierRebateRatioFloat = parseFloat(this.activityGoodForm.supplierRebateRatio);

      if (supplierRebateRatioFloat + parseFloat(this.activityGoodForm.providerRebateRatioA) > 100 ||
        supplierRebateRatioFloat + parseFloat(this.activityGoodForm.providerRebateRatioB) > 100 ||
        supplierRebateRatioFloat + parseFloat(this.activityGoodForm.providerRebateRatioC) > 100 ||
        supplierRebateRatioFloat + parseFloat(this.activityGoodForm.providerRebateRatioD) > 100 ||
        supplierRebateRatioFloat + parseFloat(this.activityGoodForm.providerRebateRatioE) > 100) {
        this.$message({
          message: "供应商比例+服务商比例只能小于等于100%",
          type: 'warning'
        })

        return
      }

      this.loading = true
      postMethod('/backend/goodActivity/marketingGoods', this.tableList).then(
        res => {
          this.loading = false
          if (res.code != 200) {
            this.$message({
              message: res.message,
              type: 'warning'
            })
            return;
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
    },

    // 控制合并表格的行和列
    objectSpanMethod({row, column, rowIndex, columnIndex}) {

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
    loadTableList(skuPriceList, goodName, goodId) {
      let tempTableList = []
      let columnList = []
      for (let i = 0; i < skuPriceList.length; i++) {
        skuPriceList[i].goodName = goodName
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
          // 因为线上已经有老结构数据 所以新结构无法存储数据库 更加无法回显 出此下策
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
        goodId: goodId,
        goodName: goodName,
        userLimit: 0,
        table: tempTableList,
        columnList: columnList
      }
    },

    checkRebateRatio(input, floatMessage, bitNumMessage) {
      if (this.checkIfPositiveFloat(input)) {
        this.$message({
          message: floatMessage,
          type: 'warning'
        });

        return true
      } else {
        if (this.checkFloatBitNum(input, 1)) {
          this.$message({
            message: bitNumMessage,
            type: 'warning'
          });
          return true
        } else {
          return false
        }
      }
    },

    backToMarketingGoodsList() {
      this.$emit('hiddenSave')
    },

    checkIfPositiveFloat(input) {
      return isNaN(input) || Number(input) <= 0;
    },

    checkFloatBitNum(input, bitNum) {
      let inputStr = input + "";
      const bitPos = inputStr.indexOf(".");
      if (bitPos == -1) {
        return false
      }
      const totalBits = inputStr.length - bitPos - 1;
      return totalBits > bitNum;
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
    div {
      display: inline;
    }

    width: 100%;
    padding: 10px 10px;

    .ly-tool-btn {
      padding-left: 20px;
      display: inline;
    }
  }
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
