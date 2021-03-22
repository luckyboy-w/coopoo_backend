<template>
  <div class="ly-container">
    <el-button style="margin-bottom: 10px" @click="backToMarketingGoodsList()" plain icon="el-icon-back">返回列表</el-button>
    <el-form class="update-form-panel" ref="activityGoodForm" :rules="activityFormRules" :model="activityGoodForm"
             label-width="120px" style="width:80%">
      <el-divider content-position="left"/>
      <el-form-item label="活动名称:">
        {{ activity.activityName }}
      </el-form-item>
      <el-divider content-position="left"/>
      <el-form-item label="供应商名名称:" prop="supplierId">
        <el-select v-model="activityGoodForm.supplierId" @change="changeSupplierEvent" placeholder="请选择">
          <el-option
            v-for="item in supplyList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-divider content-position="left"/>
      <div v-for="(table,index) in tableList" :key="table.goodId" style="margin-top: 20px">
        <p>{{ table.goodName }}</p>
        <span>用户限购&nbsp;&nbsp;&nbsp;&nbsp;</span> <el-input v-model="table.userLimit" style="width: 200px"></el-input>
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
      <el-divider content-position="left"/>
      <el-row align="middle">
        <el-col :span="4">
          <div style="height:130px;display: table-cell;vertical-align:middle" class="grid-content bg-purple-dark">
            <span>供应商比例:</span><el-input placeholder="请输入..." style="width: 180px" v-model="activityGoodForm.supplierRebateRatio"/>%
          </div>
        </el-col>
        <el-col :span="1">
          <div style="height:130px;display: table-cell;vertical-align:middle;margin-right: 10px;" class="grid-content bg-purple-dark">
            <span>服务商比例:</span>
          </div>
        </el-col>
        <el-col :span="19" >
          <div class="grid-content bg-purple-dark" style="height:150px">
            <el-table :data="rebateRatioData" border>
              <el-table-column prop="id" label="A（%）">
                <template slot-scope="scope">
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioA"  />
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
                  <el-input placeholder="请输入..." v-model="scope.row.providerRebateRatioEa"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left"/>
      <el-form-item prop="preheatTimePeriod" label="预热时间:">
        <el-date-picker
          v-model="activityGoodForm.preheatTimePeriod"
          type="datetimerange"
          range-separator="至"
          disabled
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-divider content-position="left"/>
      <el-form-item prop="activityTimePeriod" label="活动有效期:">
        <el-date-picker
          v-model="activityGoodForm.activityTimePeriod"
          type="datetimerange"
          range-separator="至"
          disabled
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-divider content-position="left"/>
    </el-form>

    <el-dialog :visible.sync="isShowGoodDetail" width="80%" append-to-body>
      <showGoodDetail :is-gift="isGift" :edit-data="goodInfo" :is-edit-good="isEditGood"/>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import showGoodDetail from "./goodDetial.vue";
import { deepCopy } from '@/utils/util'

export default {
  name:'',
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
  components: { showGoodDetail },
  data () {
    return {
      isShowGoodDetail: false,
      isEditGood: false,
      loading: false,
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
        providerRebateRatioEa: 5
      }],
      activityGoodForm: {
        supplierId: '',
        supplierRebateRatio: 90
      },
      activityFormRules: {

      }
    };
  },
  computed: {},
  beforeMount() {},

  mounted() {
    this.activityGoodForm.activityTimePeriod = [new Date(this.activity.startTime), new Date(this.activity.endTime)]
    this.activityGoodForm.preheatTimePeriod = [new Date(this.activity.preheatStartTime), new Date(this.activity.preheatEndTime)]
    this.initSupplyList()
    getMethod('/backend/goodActivity/findActivityMarketingGoodList', {"goodActivityId" : this.activity.id, "supplierId": this.activity.supplierId}).then(res => {
      this.activityGoodForm.supplierRebateRatio = res.data[0].supplierRebateRatio
      this.rebateRatioData[0].providerRebateRatioA = res.data[0].providerRebateRatioA
      this.rebateRatioData[0].providerRebateRatioB = res.data[0].providerRebateRatioB
      this.rebateRatioData[0].providerRebateRatioC = res.data[0].providerRebateRatioC
      this.rebateRatioData[0].providerRebateRatioD = res.data[0].providerRebateRatioD
      this.rebateRatioData[0].providerRebateRatioE = res.data[0].providerRebateRatioE
      this.rebateRatioData[0].providerRebateRatioEa = res.data[0].providerRebateRatioEa

      for (let i = 0; i < res.data.length; i++) {
        let marketingGoods = res.data[i]
        let goodSkuValList = marketingGoods.goodSkuValList
        for(let j = 0; j < goodSkuValList.length; j++) {
          goodSkuValList[j].stock = goodSkuValList[j].marketingStock
        }
        let table = this.loadTableList(marketingGoods.goodSkuValList, marketingGoods.goodName, marketingGoods.goodId, marketingGoods.id, marketingGoods.userLimit)
        this.checkedGood.push(marketingGoods.goodId)
        this.tableList.push(table)
      }

    })
  },

  methods: {
    initSupplyList() {
      this.supplyList.push({"id": this.activity.supplierId, "supplierName": this.activity.supplierName})
      this.activityGoodForm.supplierId = this.activity.supplierId
      this.changeSupplierEvent(this.activity.supplierId)
    },

    changeSupplierEvent(supplierId) {
      if (supplierId == '' || supplierId == undefined || supplierId == null) {
        return
      }
      const goodActivityId = this.activity.id
      getMethod('/backend/goodActivity/findAllGoodBySupplierId', {supplierId, goodActivityId}).then(res => {
        this.goodList = res.data
      });
    },

    // 控制合并表格的行和列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
          if (rowIndex === 0){
            return {
              rowspan: 999999,
              colspan: 1
            };
          }else{
            return {
              rowspan: 0,
              colspan: 1
            };
          }
      }

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
    loadTableList(skuPriceList, goodName, goodId, id, userLimit) {
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
        id: id,
        goodName: goodName,
        userLimit: userLimit || 0,
        table: tempTableList,
        columnList: columnList
      }
    },

    backToMarketingGoodsList() {
      this.$emit('hiddenUpdate')
    },

    checkIfPositiveFloat(input) {
      return isNaN(input) || Number(input) <= 0;
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
