<template>
  <div>
    <div v-if="!showOrdDtl" class="ly-container">
     <div class="ly-tool-panel">
       <table>
         <tr>
           <td>订单编号:</td>
           <td>
             <el-input v-model="searchParam.orderNo" width="180px" />
           </td>
           <td>买家姓名：</td>
           <td>
             <el-input v-model="searchParam.name" width="180px" />
           </td>
           <!-- <td>买家电话：</td>
           <td>
             <el-input v-model="searchParam.mobile" width="180px" />
           </td> -->
           <td>商品名称：</td>
           <td>
             <el-input v-model="searchParam.goodName" width="180px" />
           </td>
           <td>
             <el-button icon="el-icon-search" @click="search()">搜索</el-button>
           </td>
         </tr>
       </table>
     </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="orderId"
            border >
            <!-- <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.supplierList[0].dtlList" style="width: 100%; margin-bottom: 20px;" border>
                  <el-table-column prop="goodName" label="商品名称" width="400px" />
                  <el-table-column prop="goodSinglePrice" label="商品单价" width="150px" />
                  <el-table-column prop="goodNum" label="商品数量" width="150px" />
                  <el-table-column prop="goodCode" label="商品货号" width="150px" />
                </el-table>
              </template>
            </el-table-column> -->
           <el-table-column prop="orderNo" label="订单编号" width="220px" />
           <el-table-column prop="expressNo" label="快递单号" width="220px" />
           <el-table-column prop="goodName" label="商品名称" width="220px" />
           <el-table-column prop="skuInfo" label="SKU属性" width="220px" />
           <el-table-column prop="name" label="买家姓名" width="220px" />
           <el-table-column prop="mobile" label="买家手机号" width="220px" />

           <el-table-column prop="dtlStatus" label="订单状态" width="150px">
             <template slot-scope="scope">
               {{ scope.row.dtlStatus | statuts2Text }}
             </template>
           </el-table-column>
           <el-table-column prop="goodSinglePrice" label="商品单价" width="150px">
             <template slot-scope="scope">
               {{ scope.row.goodSinglePrice | fmtFee }}
             </template>
           </el-table-column>
           <el-table-column prop="goodNum" label="商品数量" width="220px" />
           <el-table-column prop="create_time" label="退货时间" width="150px">
             <template slot-scope="scope">
               {{ scope.row.create_time | _formatDate }}
             </template>
           </el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
            <el-table-column prop="id" label="操作" width="250px">
              <template slot-scope="scope">
                <el-link type="primary" @click="getOrdDtl(scope.row)">
                  查看订单
                </el-link>
                <!-- <el-link type="primary" v-if="scope.row.dtlStatus == 60" @click="cancelOrd(scope.row)">确认退货</el-link> -->

              </template>
            </el-table-column>
          </el-table>
        </div>

       <!-- <el-dialog v-if="sendOrder" title="发货信息" visible="sendOrder">
          <el-form ref="form" :model="sendOrderFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="sendOrderFrm.orderNo" :disabled="true" />
            </el-form-item>
            <el-form-item label="物流公司">
              <el-select v-model="sendOrderFrm.expressName" placeholder="请选择">
                <el-option v-for="item in expressList" :key="item.id" :label="item.text" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="发货地址">
              <el-input v-model="sendOrderFrm.sendAddress" />
            </el-form-item>
            <el-form-item label="物流单号">
              <el-input v-model="sendOrderFrm.expressNo" />
            </el-form-item>
            <el-form-item label="操作说明">
              <el-input v-model="sendOrderFrm.opContent" type="textarea" :rows="4" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSend()">
                立即发货
              </el-button>
              <el-button @click="sendOrder=false">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog> -->


        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" :current-page="searchParam.pageNum" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
      <div class="list-panel" />
    </div>

    <div v-if="showOrdDtl" style="height:600px;padding:40px;width:50%">

      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="20">
          <el-button type="success" @click="showOrdDtl=false">返回列表</el-button>
        </el-col>
      </el-row>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">

        <el-row :gutter="20" style="line-height:60px;font-size:20px" class="main-title">
          <el-col :span="20">退货信息</el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:30px;font-size:16px">
          <el-col :span="20">商品名称：{{ this.detailData.goodName }} <el-divider></el-divider></el-col>
          <el-col :span="20">
            商品类型：<span v-if="this.detailData.isMarketing == 0">普通商品</span> <span v-if="this.detailData.isMarketing == 1">活动商品</span>
            <el-divider></el-divider>
          </el-col>
          <el-col :span="20">SKU属性：{{ this.detailData.skuInfo }} <el-divider></el-divider></el-col>
          <el-col :span="20">退货数量：{{ this.detailData.goodNum }} <el-divider></el-divider></el-col>
          <el-col :span="20">商品单价：{{ this.detailData.goodSinglePrice }} <el-divider></el-divider></el-col>
          <el-col :span="20">总价：{{ this.detailData.goodSinglePrice * this.detailData.goodSinglePrice | fmtFee}} <el-divider></el-divider></el-col>
          <el-col :span="20">买家姓名：{{ this.detailData.name }} <el-divider></el-divider></el-col>
          <el-col :span="20">买家手机号：{{ this.detailData.mobile }} <el-divider></el-divider></el-col>
          <el-col :span="20">退货理由：{{ this.detailData.reason }} <el-divider></el-divider></el-col>
          <el-col :span="20">退货说明：{{ this.detailData.remark }} <el-divider></el-divider></el-col>
          <el-col :span="20">快递单号：{{ this.detailData.expressNo }} <el-divider></el-divider></el-col>
        </el-row>
      </div>


    </div>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'


  import {getMethod as getMethodNew, postMethod as postMethodNew} from '@/api/request-new'
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    components: {},
    filters: {
      fmtFee(fee) {
        if (fee == undefined) {
          return '';
        }
        fee = fee + ''
        if (fee.indexOf(".") == -1) {
          return fee + ".00";
        }
        return fee;
      },
      _formatDate(time) {
        if (time == undefined) {
          return '暂无时间'
        }
        const date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      statuts2Text(status) {
        // 订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价;
        // 52:交易完成/退货
        let statusText = ''
       if (status == '60') {
         statusText = '退货中'
       } else if (status == '70') {
         statusText = '已退货'
       }
        return statusText
      },
    },
    data() {
      return {
        showOrdDtl: false,
        //订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价
        ordMarks: {
          10: '待发货',
          20: '待收货',
          30: '待付款',
          50: '完成'
        },
        sendOrderFrm: {
          orderNo: '',
          expressName: '',
          sendAddress: '',
          expressNo: '',
          opContent: ''
        },
        ordDtl: {
          status: 10,
          supplierList: [{
            dtlList: []
          }]
        },
        expressList: [{
          id: 'sf',
          text: '顺丰'
        }],
        sendOrder: false,
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
          status: '',
          orderNo: '',
          recUname: '',
          recMobile: '',
          dataType: '',
          orderType: '',
          riskOrder: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
		detailData:{
		  dtlStatus: '',
		  ordDtlId: '',
		  goodName: '',
		  goodNum: '',
		  goodSinglePrice: '',
		  mobile: '',
		  name: '',
		  orderNo: '',
		  expressNo: '',
		  reason: '',
		  skuInfo: '',
		  remark: '',
		   create_time: '',
		},
        dataList: []
      }
    },
    computed: {},
    mounted() {
      if (this.$route.query.dt != undefined) {
        this.searchParam.dataType = this.$route.query.dt
      }
      this.initLoad()
      //this.loadtypeIdList()
    },
    created() {},
    methods: {
      getOrdDtl(row) {
        const scope = this
        const param = {
          orderNo: row.orderNo
        }

        getMethodNew('/order/findRejectPage', param).then(res => {
          scope.showOrdDtl = true
          this.detailData = res.data.list[0]
        })
      },
      // cancelOrd(row) {
      //   const param = {
      //     orderNo: row.orderNo,
      //     ordDtlId: row.ordDtlId
      //   }
      //   this.$confirm('是否确认已退货?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     postMethod('/backend/order/confirmReturnOrder', param).then(res => {
      //       console.log(res,'4564896797')
      //       this.loadList()
      //       this.$message({
      //       message:'退货成功',
      //       type: 'success'
      //       })

      //     })
      //   })
      // },
      sendOrd(rowObj) {
        this.sendOrder = true
        this.sendOrderFrm.orderNo = rowObj.orderNo
      },
      search() {
        this.searchParam.dataType = ''
        this.loadList()
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
            orderNo: '',
            expressName: '',
            sendAddress: '',
            expressNo: '',
            opContent: ''
          },
          getMethodNew('/order/findRejectPage', this.searchParam).then(res => {
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
