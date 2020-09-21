<template>
  <div>
    <div class="ly-container" v-if="!showOrdDtl">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>订单编号:</td>
            <td>
              <el-input v-model="searchParam.orderNo" width="180px" />
            </td>
            <td>风险订单:</td>
            <td>
              <el-select v-model="searchParam.riskOrder" placeholder="请选择">
                <el-option value="all" label="全部"></el-option>
                <el-option value="moy" label="单个订单高金额"></el-option>
                <el-option value="num" label="单个订单商品高数量"></el-option>
              </el-select>
            </td>
            <td>买家姓名：</td>
            <td>
               <el-input v-model="searchParam.recUname" width="180px" />
            </td>
            <td>买家电话：</td>
            <td>
               <el-input v-model="searchParam.recMobile" width="180px" />
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">搜索</el-button>
            </td>
          </tr>
          <tr>
            <td>订单类型:</td>
            <td>
               <el-select v-model="searchParam.orderType" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="普通订单"></el-option>
                <el-option value="2" label="礼品订单"></el-option>
              </el-select>
            </td>
            <td>下单时间</td>
            <td  colspan="2">
               <el-date-picker
                  v-model="searchParam.startTime"
                  type="date"
                  placeholder="开始时间">
                </el-date-picker>
            </td>
            <td></td>
            <td colspan="2">
                <el-date-picker
                  v-model="searchParam.endTime"
                  type="date"
                  placeholder="结束时间">
                </el-date-picker>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="orderId"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.supplierList[0].dtlList"
                  style="width: 100%; margin-bottom: 20px;"
                  border>
                    <el-table-column prop="goodName" label="商品名称" width="400px" ></el-table-column>
                    <el-table-column prop="goodSinglePrice" label="商品单价" width="150px" ></el-table-column>
                    <el-table-column prop="goodNum" label="商品数量" width="150px" ></el-table-column>
                    <el-table-column prop="goodCode" label="商品货号" width="150px" ></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" width="220px" />
            <el-table-column prop="createTime" label="下单时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="150px">
              <template slot-scope="scope">
                {{ scope.row.status | statuts2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" width="150px">
              <template slot-scope="scope">
                {{ scope.row.orderType | type2Text}}
              </template>
            </el-table-column>

            <el-table-column prop="ordPayPrice" label="订单总价" width="150px"></el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
            <el-table-column prop="id" label="操作" width="250px">
                <template slot-scope="scope">
                    <el-link type="primary" v-if="scope.row.status == 10" @click="sendOrd(scope.row)" >发货</el-link> <el-link type="primary" @click="cancelOrd(scope.row)" v-if="scope.row.status == 10">取消订单</el-link>
                    <span  v-if="scope.row.status == 0" >
                      已取消
                    </span>
                    <el-link type="primary" @click="getOrdDtl(scope.row)">查看订单</el-link>
                </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog title="发货信息" visible="sendOrder" v-if="sendOrder">
          <el-form ref="form" :model="sendOrderFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="sendOrderFrm.orderNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物流公司">
              <el-select v-model="sendOrderFrm.expressName" placeholder="请选择">
                <el-option
                  v-for="item in expressList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货地址">
              <el-input v-model="sendOrderFrm.sendAddress"></el-input>
            </el-form-item>
            <el-form-item label="物流单号">
              <el-input v-model="sendOrderFrm.expressNo"></el-input>
            </el-form-item>
            <el-form-item label="操作说明">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="sendOrderFrm.opContent">
            </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSend()">立即发货</el-button>
              <el-button @click="sendOrder=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>


        <div class="ly-data-pagination">
          <el-pagination
            v-show="!showPagination"
            :total="tableData.total"
            background
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel" />
    </div>
    <el-dialog v-if="pushStockBatch" title="补货">
      <el-table
        :data="props.row.skuPriceList"
        style="width: 100%; margin-bottom: 20px;"
        row-key="id"
        border>
        <el-table-column prop="skuText" label="SKU属性" width="260px" />
        <el-table-column prop="stock" label="库存" width="150px" />
        <el-table-column prop="supplyPrice" label="供货价" width="150px" />
        <el-table-column prop="salePrice" label="零售价" width="150px" />
        <el-table-column prop="saleMemPrice" label="会员价" width="150px" />
      </el-table>
    </el-dialog>

    <el-dialog v-if="pushStock" title="补货">
      <el-form ref="dataForm" :model="stockForm" label-width="100px">
        <el-form-item label="库存数量" />
        <el-form-item>
          <el-button type="primary" @click="submitStock()">提交</el-button>
          <el-button @click="cancelStock()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div style="height:600px;padding:40px;width:100%" v-if="showOrdDtl">
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">
             <el-button type="success" @click="showOrdDtl=false">返回列表</el-button>
          </el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:60px">
        <el-col :span="8"><div>订单编号:{{ordDtl.orderNo}}</div></el-col>
        <el-col :span="8"><div>状态:{{ordDtl.status | statuts2Text }}</div></el-col>
      </el-row>
      <el-row :gutter="20" style="line-height:40px">
          <el-col :span="24">
            <el-slider v-model="ordDtl.status"  :marks="ordMarks" max=51 min=10 ></el-slider>
          </el-col>
      </el-row>
      <el-row :gutter="20" style="padding-top:70px;height:400px">
        <el-table
          :data="ordDtl.supplierList[0].dtlList"
          style="width: 100%; margin-bottom: 20px;"
          border>
            <el-table-column prop="goodImage" label="商品图片" width="400px" >
              <template slot-scope="scope">
                <img :src="scope.row.goodImage"  height="80px" width="80px" />
              </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="400px" ></el-table-column>
            <el-table-column prop="goodSinglePrice" label="商品单价" width="150px" ></el-table-column>
            <el-table-column prop="goodNum" label="商品数量" width="150px" ></el-table-column>
            <el-table-column prop="skuInfo" label="规格" width="150px" ></el-table-column>
            <el-table-column prop="goodCode" label="商品货号" width="150px" ></el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="20" style="line-height:40px">
          <el-col :span="24">付款信息</el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">付款方式：{{ordDtl.payType | pay2Text}}</el-col>    
          <el-col :span="8">订单金额：{{ordDtl.ordPrice}}</el-col>    
          <el-col :span="8">支付金额：{{ordDtl.ordPayPrice }}</el-col>     
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">运费：{{ordDtl.expressPrice }}</el-col>    
          <el-col :span="8">优惠金额：{{ordDtl.ord_sub_price }}</el-col>    
          <el-col :span="8"></el-col>     
      </el-row>
      <el-row :gutter="20" style="line-height:40px">
          <el-col :span="24">收货人信息</el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">收货人：{{ordDtl.recUname }}</el-col>    
          <el-col :span="8">收货地址：{{ordDtl.recArea}}</el-col>    
          <el-col :span="8">收货人电话：{{ordDtl.recPhone }}</el-col>     
      </el-row>
      <el-row :gutter="20" style="line-height:40px">
          <el-col :span="24">支付及配送信息</el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">付款方式：{{ordDtl.payType | pay2Text}}</el-col>    
          <el-col :span="8">支付时间：{{ordDtl.payTime | _formatDate}}</el-col>
          <el-col :span="8">运费：{{ordDtl.expressPrice }}</el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:40px">
          <el-col :span="24">发票信息</el-col>    
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="8">发票类型：普通发票 </el-col>    
          <el-col :span="8">发票抬头：{{ordDtl.tax.taxTitle}}</el-col>  
      </el-row>
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'

export default {
  components: { },
  filters: {
    taxType2Text(type){
     
    },
    _formatDate(time) {
      if(time == undefined){
        return '尚未支付，暂无时间'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    pay2Text(pay){
      if (pay == 1) {
        return '阿里支付'
      } else {
        return '微信支付'
      } 
      return '未支付'
    },
    statuts2Text(status) {
      // 订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价;
      // 52:交易完成/退货
      let statusText = ''
      if (status == '0') {
        statusText = '已取消'
      } else if (status == '10') {
        statusText = '待发货'
      } else if (status == '20') {
        statusText = '待收货'
      } else if (status == '30') {
        statusText = '待支付'
      } else if (status == '40') {
        statusText = '退货中'
      } else if (status == '50' || status == '51' || status == '52') {
        statusText = '交易完成'
      }
      return statusText
    },
    type2Text(verifyStatus) {
      // 审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 1) {
        return '普通订单'
      } else {
        return '礼品订单'
      } 
    }
  },
  data() {
    return {
      showOrdDtl:false,
      //订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价
      ordMarks: {
        10: '待发货',
        20: '待收货',
        30: '待付款',
        50: '完成'
      },
      sendOrderFrm:{
        orderNo:'',
        expressName:'',
        sendAddress:'',
        expressNo:'',
        opContent:''
      },
      ordDtl:{
        status:10,
        supplierList:[ {
          dtlList:[]
        }]
      },
      expressList:[{id:'sf',text:'顺丰'}],
      sendOrder:false,
      pushStockBatch: false,
      pushStock: false,
      typeIdList: [],
      typeId2List: [],
      typeIdList: [],
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        orderNo:'',
        recUname:'',
        recMobile:'',
        dataType:'',
        orderType:'',
        riskOrder: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  computed: {},
  mounted() {
    if(this.$route.query.dt != undefined){
      this.searchParam.dataType = this.$route.query.dt
    }
    this.initLoad()
    //this.loadtypeIdList()
  },
  created() {},
  methods: {
    getOrdDtl(row){
      let scope = this
      let param = {
        orderId:row.orderId
      }

      postMethod('/bc/order/getOrdDtl', param).then(res => {
        scope.showOrdDtl = true
        scope.ordDtl = res.data
      })
    },
    cancelOrd(row){
      const param = {
        orderId: row.orderId
      }
      this.$confirm('是否取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bc/order/cancelOrd', param).then(res => {
          this.loadList()
          this.$message('操作成功')
        })
      })
    },
    submitSend(){
        let scope = this
        if(this.sendOrderFrm.expressNo == ''){
             this.$message({
              message: '运单号不能为空',
              type: 'warring'
            })
            return
        }

        if(this.sendOrderFrm.expressName == ''){
             this.$message({
              message: '物流公司不能为空',
              type: 'warring'
            })
            return
        }

        postMethod('/bc/order/sendOrder', this.sendOrderFrm).then(res => {
          scope.loadList()
          this.$message({
            message: '发货成功',
            type: 'success'
          })
        })
    },
    sendOrd(rowObj){
      this.sendOrder = true
      this.sendOrderFrm.orderNo = rowObj.orderNo
    },
    cancelStock() {
      this.pushStockBatch = false
      this.pushStock = false
    },
    addStock(row, rowIndex) {
      this.pushStockBatch = false
      this.pushStock = false
      // 1:全局配置;2:局部配置
      if (row.stockType == 1) {
        this.pushStock = true
      } else {
        this.pushStockBatch = true
      }
    },
    loadtypeIdList() {
      		const scope = this
      const param = {
        parentId: '-1'
      }
      getMethod('/backend/good/findType', param).then(res => {
        scope.typeIdList = res.data.list
      })
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/backend/good/delete', param).then(res => {
          this.loadList()
          this.$message('删除成功')
        })
      })
    },
    batchDeleteRow(rowIndex, data) {
      const selectList = this.$refs.mainTable.selection
      const idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      const param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/bu/good/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.searchParam.dataType = ''
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/bu/good/findObject', param).then(res => {
          scope.editData = res.data[0]
          this.showList = false
          this.showAddOrEdit = true
        })
      } else {
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
      }
    },
    showListPanel(isCancel) {
      this.showList = true
      this.showAddOrEdit = false
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },

    initLoad() {
      this.loadList()
    },
    loadList() {

      const scope = this

      this.sendOrderFrm = {
        orderNo:'',
        expressName:'',
        sendAddress:'',
        expressNo:'',
        opContent:''
      },
      getMethod('/backend/order/findRejectPage', this.searchParam).then(res => {
        scope.tableData = res.data
        scope.sendOrder = false
        scope.showPagination = scope.tableData.total == 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
	padding: 10px 20px;
	font-size: 14px;
	.ly-tool-panel {
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
