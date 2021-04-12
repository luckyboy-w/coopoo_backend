<template>
  <div>
    <div
      v-if="!showOrdDtl"
      v-loading="loading"
      class="ly-container"
    >
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>订单编号:</td>
            <td>
              <el-input
                v-model="searchParam.orderNo"
                width="180px"
              />
            </td>
            <td>买家姓名：</td>
            <td>
              <el-input
                v-model="searchParam.recUname"
                width="180px"
              />
            </td>
            <td>商家：</td>
            <td>
              <el-select
                v-model="searchParam.tenantId"
                placeholder="请选择"
              >
                <el-option
                  value=""
                  label="全部"
                />
                <el-option
                  v-for="item in supplyList"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id"
                />
              </el-select>
            </td>

            <td>订单状态:</td>
            <td>
              <el-select
                v-model="searchParam.status"
                placeholder="请选择"
              >
                <el-option
                  value=""
                  label="全部"
                />
                <el-option
                  value="10"
                  label="待发货"
                />
                <el-option
                  value="20"
                  label="待收货"
                />
                <el-option
                  value="30"
                  label="待支付"
                />
                <el-option
                  value="50"
                  label="已完成"
                />
                <el-option
                  value="60"
                  label="定制信息确认中"
                />
              </el-select>
            </td>
          </tr>
          <tr>
            <td>是否超期未付款:</td>
            <td>
              <el-select v-model="searchParam.isOverDuePayment" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="是"></el-option>
                <el-option value="0" label="否"></el-option>
              </el-select>
            </td>
            <td>订单类型:</td>
            <td>
              <!--              1:普通订单;2:礼品订单;3:礼券;4:定制订单;5:会员订单-->
              <el-select
                v-model="searchParam.orderType"
                placeholder="请选择"
              >
                <el-option
                  value=""
                  label="全部"
                />
                <el-option
                  value="1"
                  label="普通订单"
                />
                <el-option
                  value="4"
                  label="定制订单"
                />
                <el-option
                  value="5"
                  label="会员订单"
                />
                <el-option
                  value="6"
                  label="靠谱豆订单"
                />
              </el-select>
            </td>
            <td colspan="2">
              <el-button
                icon="el-icon-search"
                @click="search()"
              >
                搜索
              </el-button>
              <el-button
                icon="el-icon-download"
                @click="exportData()"
              >
                导出
              </el-button>
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.supplierList[0].dtlList"
                  style="width: 100%; margin-bottom: 20px;"
                  border
                >
                  <el-table-column
                    prop="goodName"
                    label="商品名称"
                    width="400px"
                  />
                  <el-table-column
                    prop="goodSinglePrice"
                    label="商品单价"
                    width="150px"
                  />
                  <el-table-column
                    prop="goodNum"
                    label="商品数量"
                    width="150px"
                  />
                  <el-table-column prop="dtlStatus" label="商品状态" width="150px">
                    <template slot-scope="scope">
                      <span v-if="scope.row.dtlStatus != '60'&&'70'">正常</span>
                      <!--      <span v-if="scope.row.dtlStatus == '10'">正常</span>
                            <span v-if="scope.row.dtlStatus == '20'">正常</span>
                            <span v-if="scope.row.dtlStatus == '30'">正常</span>
                            <span v-if="scope.row.dtlStatus == '40'">正常</span>
                            <span v-if="scope.row.dtlStatus == '50'">正常</span> -->
                      <span v-if="scope.row.dtlStatus == '60'">退货中</span>
                      <span v-if="scope.row.dtlStatus == '70'">退货已完成</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="skuInfo" label="规格" width="150px"></el-table-column>
                  <el-table-column
                    prop="goodCode"
                    label="物料编码"
                    width="150px"
                  />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNo"
              label="订单编号"
              width="220px"
            />
            <el-table-column
              prop="ordPayPrice"
              label="订单总价"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row | fmtPrice }}
              </template>
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="实付金额"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row | fmtPayPrice }}
              </template>
            </el-table-column>
            <el-table-column
              prop="recUname"
              label="买家姓名"
              width="120px"
            />
            <el-table-column
              prop="recPhone"
              label="买家手机号码"
              width="150px"
            />
            <el-table-column
              prop="orderNo"
              label="供应商名称"
              width="220px"
            >
              <template slot-scope="scope">
                {{ scope.row.tenantName }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="下单时间"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.status | statuts2Text }}
              </template>
            </el-table-column>
            <el-table-column
              prop="orderType"
              label="订单类型"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.orderType | type2Text }}
              </template>
            </el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
            <el-table-column
              prop="id"
              label="操作"
              width="250px"
            >
              <template slot-scope="scope">
                <el-link
                  v-if="scope.row.orderType == 6 && scope.row.status == 10"
                  type="primary"
                  @click="sendOrd(scope.row)"
                >发货
                </el-link>
                <el-link
                  v-if="false && scope.row.status == 60"
                  type="primary"
                  @click="collectCus(scope.row)"
                >
                  发起定价收款
                </el-link>
                <el-link
                  v-if="scope.row.orderType != 3"
                  type="primary"
                  @click="getOrdDtl(scope.row)"
                >
                  查看订单
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog
          v-if="dealPrice"
          title="商品定价"
          visible="dealPrice"
        >
          <el-form
            ref="form"
            :model="dealPriceFrm"
            label-width="80px"
          >
            <el-form-item label="订单编号">
              <el-input
                v-model="dealPriceFrm.orderNo"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="dealPriceFrm.ordPrice"/>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitDealPrice()"
              >
                提价定价
              </el-button>
              <el-button @click="dealPrice=false">
                取消
              </el-button>
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
      <div class="list-panel"/>
    </div>

    <div
      v-if="showOrdDtl"
      style="height:650px;padding:40px;margin:0px 0px 40px 0px ;width:100%"
    >
      <el-row
        :gutter="20"
        style="line-height:40px;font-size:12px"
      >
        <el-col :span="24">
          <el-button
            type="success"
            @click="showOrdDtlClos()"
          >
            返回列表
          </el-button>
        </el-col>
      </el-row>

      <el-row
        :gutter="20"
        style="line-height:60px;font-size:14px;background-color:#FFFFF0"
      >
        <el-col :span="6">
          <div>订单编号:{{ ordDtl.orderNo }}</div>
        </el-col>
        <el-col :span="6">
          <div>状态:{{ ordDtl.status | statuts2Text }}</div>
        </el-col>
        <el-col :span="6"/>
        <el-col :span="6"/>
      </el-row>

      <el-row
        :gutter="20"
        style="line-height:40px;padding:25px 0px;"
      >
        <el-col :span="24">
          <el-steps
            v-if="ptStep"
            :active="ordStep"
            align-center
          >
            <el-step title="待发货"/>
            <el-step title="待收货"/>
            <el-step title="待支付"/>
            <el-step :title="isCancelTitle"/>
          </el-steps>

          <el-steps
            v-if="lpStep"
            :active="ordStep"
            align-center
          >
            <el-step title="待支付"/>
            <el-step title="待发货"/>
            <el-step title="待收货"/>
            <el-step title="已完成"/>
          </el-steps>

          <el-steps
            v-if="dzStep"
            :active="ordStep"
            align-center
          >
            <el-step title="待沟通"/>
            <el-step title="待发货"/>
            <el-step title="待收货"/>
            <el-step title="待支付"/>
            <el-step title="已完成"/>
          </el-steps>
        </el-col>
      </el-row>

      <div style="padding:10px;margin:10px 0px 10px 0;">
        <el-row
          :gutter="20"
          style="padding-top:20px;"
        >
          <el-table
            :data="ordDtl.supplierList[0].dtlList"
            style="width: 1180px; margin-bottom: 20px;font-size:12px;height:100%"
            border
          >
            <el-table-column
              prop="goodImage"
              label="商品图片"
              width="140px"
            >
              <template slot-scope="scope">
                <img
                  :src="scope.row.goodImage"
                  height="40px"
                  width="40px"
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="goodName"
              label="商品名称"
              width="288px"
            />
            <el-table-column prop="isMarketing" label="商品类型">
              <template slot-scope="scope">
                <span v-if="scope.row.isMarketing == 0">普通商品</span>
                <span v-if="scope.row.isMarketing == 1">活动商品</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodSinglePrice"
              label="商品单价"
              width="150px"
            />
            <el-table-column
              prop="goodNum"
              label="商品数量"
              width="150px"
            />
            <el-table-column
              prop="goodSinglePrice"
              label="商品总价"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.goodSinglePrice * scope.row.goodNum }}
              </template>
            </el-table-column>
            <el-table-column
              prop="skuInfo"
              label="规格"
              width="150px"
            />
            <el-table-column
              prop="goodCode"
              label="商品货号"
              width="150px"
            />
          </el-table>
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row
          :gutter="20"
          style="line-height:40px;"
          class="main-title"
        >
          <el-col :span="24">
            付款信息
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            付款方式：{{ ordDtl.payType | pay2Text }}
          </el-col>
          <el-col :span="6">
            订单金额：{{ ordDtl.ordPrice }}
          </el-col>
          <el-col :span="6">
            应付金额：{{ ordDtl.ordPayPrice }}
          </el-col>
          <el-col :span="6">
            实付金额：{{ ordDtl.totalAmount }}
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            运费：{{ ordDtl.expressPrice == '0' ? '0.00' : ordDtl.expressPrice }}
          </el-col>
          <el-col :span="6">
            优惠金额：{{ ordDtl.ordSubPrice == '0' ? '0.00' : ordDtl.ordSubPrice }}
          </el-col>
          <el-col :span="6"/>
          <el-col :span="6"/>
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row
          :gutter="20"
          style="line-height:40px"
          class="main-title"
        >
          <el-col :span="24">
            收货人信息
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            收货人：{{ ordDtl.recUname }}
          </el-col>
          <el-col :span="6">
            收货地址：{{ ordDtl.recArea }}
          </el-col>
          <el-col :span="6">
            收货人电话：{{ ordDtl.recPhone }}
          </el-col>
          <el-col :span="6"/>
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row
          :gutter="20"
          style="line-height:40px"
          class="main-title"
        >
          <el-col :span="24">
            支付及配送信息
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            付款方式：{{ ordDtl.payType | pay2Text }}
          </el-col>
          <el-col :span="6">
            支付时间：{{ ordDtl.payTime | _formatDate }}
          </el-col>
          <el-col :span="6">
            运费：{{ ordDtl.expressPrice }}
          </el-col>
          <el-col :span="6"/>
        </el-row>
      </div>
      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row
          :gutter="20"
          style="line-height:40px"
          class="main-title"
        >
          <el-col :span="24">
            物流信息
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            物流公司：{{ ordDtl.expressName }}
          </el-col>
          <el-col :span="6">
            快递单号：{{ ordDtl.expressNo }}
          </el-col>
          <el-col :span="6"/>
        </el-row>
      </div>

      <div
        v-if="ordDtl.orderType != 6"
        style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px 10px 0;"
      >
        <el-row
          :gutter="20"
          style="line-height:40px"
          class="main-title"
        >
          <el-col :span="24">
            发票信息
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            发票类型：普通发票
          </el-col>
          <el-col
            v-if="ordDtl.tax && ordDtl.tax.taxTitle"
            :span="6"
          >
            发票抬头：{{ ordDtl.tax.taxTitle == '1' ? '公司' : '个人' }}
          </el-col>
          <el-col
            v-if="ordDtl.tax && ordDtl.tax.compTaxNo"
            :span="6"
          >
            税号：{{ ordDtl.tax.compTaxNo }}
          </el-col>
          <el-col
            v-if="ordDtl.tax && ordDtl.tax.companyName"
            :span="6"
          >
            公司名称：{{ ordDtl.tax.companyName }}
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="line-height:40px;font-size:12px"
        >
          <el-col
            v-if="ordDtl.tax && ordDtl.tax.email"
            :span="6"
          >
            邮箱：{{ ordDtl.tax.email }}
          </el-col>
          <el-col
            v-if="ordDtl.tax && ordDtl.tax.phoneNo"
            :span="6"
          >
            手机号码：{{ ordDtl.tax.phoneNo }}
          </el-col>
          <el-col :span="6"/>
          <el-col :span="6"/>
        </el-row>
      </div>

      <div
        v-if="ordDtl.ordDtlList[0].goodCustom"
        style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px;margin:10px 0px 10px 0;"
      >
        <el-row
          :gutter="20"
          style="line-height:40px"
          class="main-title"
        >
          <el-col :span="24">
            定制信息
          </el-col>
        </el-row>
        <el-row
          :gutter="24"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="6">
            联系人：{{ ordDtl.ordDtlList[0].goodCustom.userName }}
          </el-col>
          <el-col :span="6">
            联系电话：{{ ordDtl.ordDtlList[0].goodCustom.userPhone }}
          </el-col>
          <el-col :span="12">
            定制内容：{{ ordDtl.ordDtlList[0].goodCustom.customInfo }}
          </el-col>
        </el-row>
      </div>

      <div style="line-height:400px;height:20px">
        <el-row
          :gutter="24"
          style="line-height:40px;font-size:12px"
        >
          <el-col :span="24">
            &nbsp;&nbsp;&nbsp;
          </el-col>
        </el-row>
      </div>
    </div>


    <el-dialog title="线下发货" :visible.sync="sendOrder" v-if="sendOrder" @close="closeSendOrderDialog">
      <el-form ref="form" :rules="rules" :model="sendOrderFrm" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="sendOrderFrm.orderNo" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="物流公司" prop="expressId">
          <el-select v-model="sendOrderFrm.expressId" placeholder="请选择">
            <el-option
              v-for="item in expressList"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货地址" prop="sendAddress">
          <el-input v-model="sendOrderFrm.sendAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="expressNo">
          <el-input v-model="sendOrderFrm.expressNo"></el-input>
        </el-form-item>
        <el-form-item label="操作说明">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="sendOrderFrm.opContent"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSend()">立即发货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <br>
  </div>
</template>

<script>
import {
  getMethod,
  postMethod
} from '@/api/request'
import {
  formatDate
} from '@/api/tools.js'
import {getToken} from '@/utils/auth'

export default {
  components: {},
  filters: {
    taxType2Text(type) {

    },
    _formatDate(time) {
      if (time == undefined) {
        return '尚未支付，暂无时间'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    pay2Text(pay) {
      let string = ''
      switch (pay) {
        case '1':
          string = '阿里支付';
          break;
        case '2':
          string = '微信支付';
          break;
        case '3':
          string = '小程序支付';
          break;
        case '4':
          string = '靠谱豆支付';
          break;
        default:
          string = '未支付';
          break
      }
      return string
    },
    fmtPrice(row) {
      if (row.orderType != 4) {
        return row.ordPrice
      }
      if (row.ordPrice == 0) {
        return '待定价'
      }
      return row.ordPrice
    },
    fmtPayPrice(row) {
      if (row.orderType != 4) {
        return row.totalAmount
      }
      if (row.ordPayPrice == 0) {
        return '待定价'
      }
      return row.totalAmount
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
        statusText = '已退货'
      } else if (status == '60') {
        statusText = '定制信息确认中'
      } else if (status == '50' || status == '51' || status == '52') {
        statusText = '交易完成'
      }
      return statusText
    },
    type2Text(verifyStatus) {
      // 审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 1) {
        return '普通订单'
      } else if (verifyStatus == 2) {
        return '礼品订单'
      } else if (verifyStatus == 4) {
        return '定制订单'
      } else if (verifyStatus == 3) {
        return '礼券订单'
      } else if (verifyStatus == 5) {
        return '会员订单'
      } else if (verifyStatus == 6) {
        return '靠谱豆订单'
      }
    }
  },
  data() {

    let quantityCheck = (rule, value, callback) => {
      if (value <= 0 || value > 300) {
        callback(new Error('包裹数量输入错误，只能1~300'))
      } else {
        callback()
      }
    }
    let expressCompanyCheck = (rule, value, callback) => {
      if (this.logisticsCompany == null) {
        callback(new Error('请选择物流公司'))
      } else if (this.logisticsCompanyTypeId == null) {
        callback(new Error('请选择物流公司业务类型'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      supplyList: [],
      showOrdDtl: false,
      dealPrice: false,
      addrList: [],
      ordStep: 1,
      ptStep: false,
      lpStep: false,
      dzStep: false,
      isCancelTitle: '已完成',
      dealPriceFrm: {
        orderNo: '',
        orderId: '',
        ordPrice: ''
      },
      //订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价
      ordMarks: {
        10: '待发货',
        20: '待收货',
        30: '待付款',
        60: '待沟通',
        50: '完成'
      },
      sendOrderFrm: {
        orderNo: '',
        expressId: '',
        expressName: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
      ordDtl: {
        status: 10,
        tax: {
          taxTitle: ''
        },
        supplierList: [{
          dtlList: []
        }]
      },
      sendOrder: false,
      pushStockBatch: false,
      pushStock: false,
      typeId2List: [],
      typeIdList: [],
      orderId_: '',
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        status: '',
        tenantId: '',
        isRisk: 0,
        orderNo: '',
        recUname: '',
        recMobile: '',
        orderType: '',
        dataType: '',
        riskOrder: '',
        isOverDuePayment: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: [],

      // 线下发货所需数据
      expressList: [
        {id: 'SF', text: '顺丰速运'},
        {id: 'YZBK', text: '邮政国内标快'},
        {id: 'YZPY', text: '邮政快递包裹'},
        {id: 'STO', text: '申通快递'},
        {id: 'DBL', text: '德邦快递'},
        {id: 'JD', text: '京东快递'},
        {id: 'HHTT', text: '天天快递'},
        {id: 'JTSD', text: '极兔速递'},
        {id: 'SNWL', text: '苏宁物流'},
        {id: 'ZTO', text: '中通快递'},
        {id: 'YD', text: '韵达速递'},
        {id: 'HTKY', text: '百世快递'},
        {id: 'YTO', text: '圆通速递'}
      ],
      rules: {
        expressId: [{required: true, message: '请选择物流公司', trigger: 'change'}],
        sendAddress: [{required: true, message: '请选择发货地址', trigger: 'blur'}],
        expressNo: [{required: true, message: '请输入物流单号', trigger: 'blur'}]
      },
    }
  },
  computed: {},
  mounted() {
    if (this.$route.query.dt != undefined) {
      this.searchParam.dataType = this.$route.query.dt
      this.searchParam.isOverDuePayment = "1"
    }
    if (this.$route.query.orderId) {
      this.orderId_ = this.$route.query.orderId
      this.getOrdDtl_()
    }
    this.initLoad()
    //this.loadtypeIdList()
    this.initSupplyList()
  },
  created() {

  },
  methods: {
    closeSendOrderDialog() {
      this.logisticsCompanyTypeId = null
      this.addrId = null
      this.offlineExpressId = null
      this.offlineSendAddrId = null
      this.sendOrderFrm.expressNo = ''
      this.sendOrderFrm.opContent = ''
      this.sendOrderFrm.addrId = null
      this.sendOrderFrm.expressId = null
    },
    showOrdDtlClos() {
      this.showOrdDtl = false
      this.ptStep = false
      this.lpStep = false
      this.dzStep = false
    },
    exportData() {
      let exportParam = [];

      let param = JSON.parse(JSON.stringify(this.searchParam));
      delete param.pageSize
      delete param.pageNum

      for (let key in param) {
        exportParam.push(key + "=" + param[key]);
      }
      exportParam.push("token=" + getToken())
      window.open(process.env.VUE_APP_BASE_API + "/backend/order/export?" + exportParam.join("&"));
    },
    initSupplyList() {

      getMethod('/backend/supplier/findList', {}).then(res => {
        this.supplyList = res.data
      })
    },
    collect(row) {
      let scope = this
      let param = {
        orderNo: row.orderNo,
        orderId: row.orderId
      }
      postMethod('/bc/order/collectOrder', param).then(res => {
        this.$message('已经发起收款，请等待用户支付')
        scope.loadList()
      })
    },
    collectCus(rowObj) {
      this.dealPriceFrm.orderNo = rowObj.orderNo
      this.dealPriceFrm.orderId = rowObj.orderId
      this.dealPrice = true
    },
    submitDealPrice() {
      let scope = this
      if (this.dealPriceFrm.ordPrice == '') {
        this.$message({
          message: '价格不能为空',
          type: 'warring'
        })
        return
      }

      postMethod('/bc/order/dealOrdPrice', this.dealPriceFrm).then(res => {
        scope.dealPrice = false
        scope.loadList()
        this.$message({
          message: '定价成功，请等待用户支付',
          type: 'success'
        })
      })
    },
    getOrdDtl_() {
      let scope = this
      postMethod('/backend/order/getOrdDtl', {
        orderId: this.orderId_
      }).then(res => {
        scope.showOrdDtl = true
        scope.ordDtl = res.data
        scope.ptStep = false
        scope.dzStep = false
        scope.lpStep = false

        if (scope.ordDtl.orderType == 1) {
          scope.ptStep = true
          if (scope.ordDtl.status == "10") {
            scope.ordStep = 1
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 3
          } else {
            scope.ordStep = 4
          }

          if (scope.ordDtl.status >= 40 && scope.ordDtl.status < 50) {
            scope.isCancelTitle = '已取消'
          }

        } else if (scope.ordDtl.orderType == 2) {
          scope.lpStep = true

          if (scope.ordDtl.status == "10") {
            scope.ordStep = 1
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 3
          } else {
            scope.ordStep = 4
          }

        } else if (scope.ordDtl.orderType == 4) {
          scope.dzStep = true

          if (scope.ordDtl.status == "10") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 3
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 4
          } else if (scope.ordDtl.status == "60") {
            scope.ordStep = 1
          } else {
            scope.ordStep = 5
          }
        }

      })
    },
    getOrdDtl(row) {
      let scope = this
      let param = {
        orderId: row.orderId
      }

      postMethod('/backend/order/getOrdDtl', param).then(res => {
        scope.showOrdDtl = true
        scope.ordDtl = res.data
        scope.ptStep = false
        scope.dzStep = false
        scope.lpStep = false

        if (scope.ordDtl.orderType == 1) {
          scope.ptStep = true
          if (scope.ordDtl.status == "10") {
            scope.ordStep = 1
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 3
          } else {
            scope.ordStep = 4
          }

          if (scope.ordDtl.status >= 40 && scope.ordDtl.status < 50) {
            scope.isCancelTitle = '已取消'
          }

        } else if (scope.ordDtl.orderType == 2) {
          scope.lpStep = true

          if (scope.ordDtl.status == "10") {
            scope.ordStep = 1
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 3
          } else {
            scope.ordStep = 4
          }

        } else if (scope.ordDtl.orderType == 4) {
          scope.dzStep = true

          if (scope.ordDtl.status == "10") {
            scope.ordStep = 2
          } else if (scope.ordDtl.status == "20") {
            scope.ordStep = 3
          } else if (scope.ordDtl.status == "30") {
            scope.ordStep = 4
          } else if (scope.ordDtl.status == "60") {
            scope.ordStep = 1
          } else {
            scope.ordStep = 5
          }
        }

      })
    },
    cancelOrd(row) {
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
    submitSend() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let scope = this
          let express = this.expressList.find(item => item.id == this.sendOrderFrm.expressId)
          this.sendOrderFrm.expressName = express.text
          let loading = this.$loading({
            lock: true,
            text: '正在发货中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          postMethod('/backend/order/offlineSendOrder', this.sendOrderFrm).then(res => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.sendOrder = false
            scope.loadList()
            this.closeSendOrderDialog()
            loading.close()
          }).catch(err => {
            loading.close()
          })
        }
      })
    },
    async sendOrd(rowObj) {
      await this.loadAddress();

      this.sendOrder = true
      this.sendOrderFrm.orderNo = rowObj.orderNo
      let param = {
        orderId: rowObj.orderId
      }
      postMethod('/backend/order/getOrdDtl', param).then(res => {
        if (res.code != 200) {
          this.$message.error(res.message)
          return
        }
        this.onlineOrderDtl = res.data
      })
    },
    async loadAddress() {
      const {data} = await getMethod("/backend/lyConfig/findList?dataType=send_address_config")
      this.sendOrderFrm.sendAddress = data[0] && data[0].value
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
      getMethod('/bu/good/findType', param).then(res => {
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
        postMethod('/bu/good/delete', param).then(res => {
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
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
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
        orderNo: '',
        expressName: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
        getMethod('/backend/order/findPage', this.searchParam).then(res => {
          scope.tableData = res.data
          scope.sendOrder = false
          scope.showPagination = scope.tableData.total == 0
          this.loading = false
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
<style lang="scss">
.el-step__title {
  font-size: 12px;
}

.main-title {
  font-size: 14px;
}

.sub-title {
  font-size: 12px;
}
</style>
