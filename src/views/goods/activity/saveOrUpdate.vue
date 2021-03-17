<template>
  <div class="ly-container">
    <el-form class="update-form-panel" ref="activityGoodForm" :rules="activityFormRules" :model="activityGoodForm"
             label-width="120px" style="width:80%">
      <span>活动商品信息</span>
      <el-divider content-position="left"/>
      <el-form-item label="活动名称:">
        {{ activity.activityName }}
      </el-form-item>
      <el-divider content-position="left"/>
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
      <el-divider content-position="left"/>
      <el-form-item label="商品名称:" prop="supplierId" width="180px">
        <el-input @input="goodInputEvent" style="width: 180px" v-model="goodName"/>
      </el-form-item>
      <el-scrollbar>
        <div style="height: 100px;width: 100%" @click.stop>
          <el-checkbox-group v-model="checkedGood" @change="handleCheckedGoodChange">
            <el-checkbox v-for="good in goodList" :label="good.id" :key="good.id">
              <span @click.prevent="showGoodDetail(good.id)">{{good.goodName}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <el-divider content-position="left"/>
      <!--用户限购 <el-input v-model=""></el-input>-->
      <el-table style="margin-top: 10px" :key="table.goodId" v-for="(table,index) in tableList" :data="table.table" :span-method="objectSpanMethod" border>
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
        <el-table-column align="center" prop="stock" label="价格">
          <template slot-scope="scope">
            <el-input v-model="scope.row.marketingPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存">
          <template slot-scope="scope">
            <el-input v-model="scope.row.marketingStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="left"/>
      <el-row align="middle">
        <el-col :span="4">
          <div style="height:130px;display: table-cell;vertical-align:middle" class="grid-content bg-purple-dark">
            <span>服务商比例:</span><el-input placeholder="请输入..." style="width: 180px" v-model="activityGoodForm.providerRebateRatioA"/>%
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
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioA"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="B（%）">
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioB"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="C（%）">
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioC"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="D（%）">
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioD"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="E（%）">
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioE"/>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="EA（%）">
                <template>
                  <el-input placeholder="请输入..." v-model="activityGoodForm.providerRebateRatioEA"/>
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
      <el-button @click="submit" style="display:block;margin:0 auto" type="primary">提交</el-button>
    </el-form>

    <el-dialog :visible.sync="isShowGoodDetail" width="80%" append-to-body>
      <showGoodDetail :is-gift="isGift" :edit-data="goodInfo" :is-edit-good="isEditGood"/>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod } from '@/api/request'
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
      rebateRatioData: [{id: 11}],
      activityGoodForm: {
        supplierId: ''
      },
      activityFormRules: {

      }
    };
  },
  computed: {},
  beforeMount() {},

  mounted() {
    console.info(this.activity)
    this.activityGoodForm.activityTimePeriod = [new Date(this.activity.startTime), new Date(this.activity.endTime)]
    this.initSupplyList()
  },

  methods: {
    initSupplyList() {
      getMethod('/backend/supplier/findList', {}).then(res => {
        this.supplyList = res.data
      })
    },

    changeSupplierEvent(supplierId) {
      getMethod('/backend/goodActivity/findAllGoodBySupplierId', {supplierId}).then(res => {
        this.goodList = res.data
      })
    },

    handleCheckedGoodChange(checkedGood) {
      let checkedGoodId = checkedGood[checkedGood.length - 1]

      if (this.tableList.length > checkedGood.length) {
        let tableList = this.tableList.filter(item => item.goodId == checkedGoodId);
        this.tableList = tableList;
        console.info("减")
        console.info(this.tableList)
        console.info(checkedGood)
      } else if (this.tableList.length < checkedGood.length) {
        let good = this.goodList.filter(item => item.id == checkedGoodId)
        console.info("加")
        console.info(this.tableList)
        console.info(checkedGood)
        let param = {
          goodId: checkedGood[checkedGood.length - 1]
        }

        getMethod("/backend/good/findById", param).then(res => {
          this.$nextTick(() => {
            this.loadTableList(res.data.skuPriceList, good[0].goodName, good[0].id)
          })
        });
      }

    },

    goodInputEvent(inputValue) {
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
      console.info(this.tableList)
/*      this.$refs.activityGoodForm.validate(valid => {
        if (valid) {
          postMethod('/backend/goodActivity/save', this.activityForm).then(
            res => {
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
              this.closeActivityDialog()
              this.loadList()
            }
          )
        }
      })*/
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

      this.tableList.push({
        goodId: goodId,
        table: tempTableList,
        columnList: columnList
      })
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
