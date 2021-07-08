<template>
  <div class="ly-container">
    <el-button style="margin-bottom: 10px" @click="backToMarketingGoodsList()" plain icon="el-icon-back">返回列表
    </el-button>
    <el-form
      class="update-form-panel"
      ref="activityGoodForm"
      :rules="activityFormRules"
      :model="activityGoodForm"
      label-width="100px"
    >
      <el-divider/>
      <el-form-item label="活动名称:">
        {{ activity.activityName }}
      </el-form-item>
      <el-divider/>
     <el-form-item label="关联商品">
       <el-button type="success" @click="relatedGoods">关联商品</el-button>
     </el-form-item>
      <el-divider v-if="tableList!=''" />
      <div v-for="(table,index) in tableList" style="margin-top: 20px">
        <p style="font-size: 15px;font-weight: 600;">{{ table.goodsName }}&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="warning" plain  size="small" @click="deleteGoods(table,index)">
          删除
        </el-button>
        </p>
        <span>用户限购：</span>
        <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" v-model="table.purchaseLimit" />
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
              <el-input-number :max="scope.row.maxStock" :min="0" size="medium" placeholder="请输入" v-model="scope.row.stock" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider content-position="left"/>
      <el-form-item prop="preheatStartTime" label="预热时间:" >
        <el-date-picker
          v-model="activityGoodForm.preheatStartTime"
          type="datetime"
          disabled
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择预热开始时间"
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
            <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
              border @selection-change="handleSelectionChange" @select="selectThis">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称"  />
              <el-table-column label="商品价格" >
                <template slot-scope="scope">
                  <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="saleVolume" label="销量" />
              <el-table-column prop="isSale" label="商品状态" >
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
              @prev-click="currentPage" @next-click="currentPage" />
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getMethod, postMethod} from '@/api/request'
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
  data() {
    return {
      flag:'add',
      searchParam: {
        pageSize: 10,
        pageNum: 1,
      },
      // 商品列表
      tableData: {
        list: []
      },
      multipleSelection:[],
      bindingList:[],
      showGoodsList: false,

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
        preheatStartTime:'',
        activityTimePeriod:[]
      },
      activityFormRules: {}
    };
  },
  computed: {},
  beforeMount() {
  },

  mounted() {
    console.log(this.activity)
    if (this.activity.preheatStartTime&&this.activity.preheatStartTime!='') {
      this.activityGoodForm.preheatStartTime = new Date(this.activity.preheatStartTime)
    } else{
      this.activityGoodForm.preheatStartTime =""
    }
    this.activityGoodForm.activityTimePeriod = [new Date(this.activity.startTime), new Date(this.activity.endTime)]
    this.initBindingList()
  },

  methods: {
    // 加载商品
    initBindingList(){
      getMethod("/activity/marketing-goods/detail?activityId="+this.activity.id).then(res => {
        console.log(res)
        if (res.data.length>=1) {
          this.flag='edit'
        } else{
          this.flag='add'
        }
        res.data.forEach(item=>{
        let obj={purchaseLimit:item.purchaseLimit,storeSettleRatio:item.storeSettleRatio,supplierSettleRatio:item.supplierSettleRatio,id:item.id}
        let table = this.loadTableList(item.activityGoodsSkuList,item.goodsName,item.goodsId,obj)
        console.log(table,'table')
        table.table.map(i=>{
          i.maxStock=i.stock
        })
        this.tableList.push(table)
        })
        console.log(this.tableList,'this.tableList')
      });
    },
    // 关联商品
    relatedGoods() {
      console.log("关联商品")
      this.loadGoodsList()
      this.showGoodsList = true
    },
    showGoodsListClose() {
      if (this.multipleSelection.length>0) {
        this.multipleSelection.forEach(item=>{
        let table = this.loadTableList(item.skuList,item.goodsName,item.goodsId,{})
        console.log(table,'table')
        table.table.map(i=>{
          i.maxStock=i.stock
        })
        this.tableList.push(table)
        })
        this.bindingList=this.bindingList.concat(this.multipleSelection)
      }
      this.showGoodsList = false
    },
    deleteGoods(table,num){
      let that = this
      console.log(table,that.tableList,num,'row')
        that.tableList.map((item,index)=>{
        if (item.goodsId==table.goodsId) {
          that.tableList.splice(index,1)
        }
      })
      if (table.id) {
        getMethod("/activity/marketing-goods/remove?id="+table.id).then(res => {
          this.$message({
            message: "操作成功",
            type: 'success'
          });
        });
      }

    },
    search() {
      if (this.multipleSelection.length>0) {
        this.multipleSelection.forEach(item=>{
        let table = this.loadTableList(item.skuList,item.goodsName,item.goodsId,{})
        console.log(table,'table')
        table.table.map(i=>{
          i.maxStock=i.stock
        })
        this.tableList.push(table)
        })
        this.bindingList=this.bindingList.concat(this.multipleSelection)

      }
      this.searchParam.pageNum='1'
      this.loadGoodsList();
    },
    // 获取商品列表
    loadGoodsList() {
      this.searchParam.activityId=this.activity.id
     postMethod("/goods/list", this.searchParam).then(res => {
       this.tableData.list = res.data.records;
       this.tableData.total = res.data.total;
       this.showPagination = this.tableData.total == 0;
     });
    },
    // 选择商品
    handleSelectionChange(val) {
      console.log(val,'val')
      let n = val.filter(item => !this.multipleSelection.includes(item));
      console.log(n); //本次新增的项
      this.multipleSelection = val;
    },
    selectThis(val){
      console.log(val,'单个')
    },
    currentPage(pageNum) {
      if (this.multipleSelection.length>0) {
        this.multipleSelection.forEach(item=>{
        let table = this.loadTableList(item.skuList,item.goodsName,item.goodsId,{})
        console.log(table,'table')
        table.table.map(i=>{
          i.maxStock=i.stock
        })
        this.tableList.push(table)
        })
        this.bindingList=this.bindingList.concat(this.multipleSelection)
      }
      this.searchParam.pageNum = pageNum;
      this.loadGoodsList();
    },

    // 新建标签跳详情
    getGoodsDtl(row) {
      console.log(row, 'row')
      let newpage = this.$router.resolve({
        path: "/goods/list", //路径
        query: {
          goodsId: row.goodsId, //商品id
        }
      })
      console.log(newpage, 'newpage')
      window.open(newpage.href, '_blank');
    },

   submit() {
     console.log('tableList',this.tableList);
     // return false
      if (this.tableList.length == 0) {
        this.$message({
          message: "请选择商品",
          type: 'warning'
        });
        return;
      }
      for (let i = 0; i < this.tableList.length - 1; i++) {
                  for (let j = i + 1; j < this.tableList.length; j++) {
                    if (this.tableList[i].goodsId === this.tableList[j].goodsId) {
                      this.$message({
                        message: "所选商品有重复 ",
                        type: 'warning'
                      });
                      return false
                    }
                  }
                }
      const integerReg = /^\+?[1-9][0-9]*$/;
      console.log('tableList',this.tableList);
      let marketingGoodList=[]
      // let marketingGoodsList = []
      let goodsObj
      let skuObj
      for (let i = 0; i < this.tableList.length; i++) {
        let marketingGoodsSkuList=[]
        let arr=this.tableList[i]
        for (let j = 0; j < arr.table.length; j++) {
          if (!arr.table[j].promotionPrice||arr.table[j].promotionPrice=='') {
              this.$message({
                message: "活动价不能为空 ",
                type: 'warning'
              });
              return false;
            }
              skuObj={
                id:arr.table[j].id?arr.table[j].id:null,
                goodsSkuId:arr.table[j].goodsSkuId?arr.table[j].goodsSkuId:arr.table[j].skuId,
                marketingStock:arr.table[j].stock,
                promotionPrice:arr.table[j].promotionPrice,
                salePrice:arr.table[j].salePrice
              }
              marketingGoodsSkuList.push(skuObj)
        }
           goodsObj={
             id:arr.id?arr.id:null,
            goodsId:arr.goodsId,
            purchaseLimit:arr.purchaseLimit,
            storeSettleRatio:arr.storeSettleRatio,
            supplierSettleRatio:arr.supplierSettleRatio,
            marketingGoodsSkuList:marketingGoodsSkuList
          }
          marketingGoodList.push(goodsObj)
      }
      console.log(marketingGoodList,this.activity.id)
      // return false
      let param={
        goodsActivityId:this.activity.id,
        marketingGoodList:marketingGoodList
      }
      this.loading = true
      if (this.flag=='add') {
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

          this.$emit('hiddenSave')
        }
      ).catch(error => {
        this.loading = false
      })
      } else{
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

            this.$emit('hiddenSave')
          }
        ).catch(error => {
          this.loading = false
        })
      }

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
    loadTableList(skuPriceList, goodsName, goodsId,objData) {
      console.log(objData,'objData');
      let tempTableList = []
      let columnList = []
      for (let i = 0; i < skuPriceList.length; i++) {
        skuPriceList[i].goodsName = goodsName
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
        id:objData.id?objData.id:null,
        goodsId: goodsId,
        goodsName: goodsName,
        purchaseLimit: objData.purchaseLimit?objData.purchaseLimit:0,
        supplierSettleRatio:objData.supplierSettleRatio?objData.supplierSettleRatio:0,
        storeSettleRatio:objData.storeSettleRatio?objData.storeSettleRatio:0,
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
