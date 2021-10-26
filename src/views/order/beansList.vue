<template>
  <div>
    <div v-if="!showOrdDtl" v-loading="loading" class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchParam.orderNo" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>商品名称：</div>
          <div>
            <el-input v-model="searchParam.goodsName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>买家姓名：</div>
          <div>
            <el-input v-model="searchParam.userName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>买家手机号：</div>
          <div>
            <el-input v-model="searchParam.phoneNo" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>供应商名称：</div>
          <div>
            <el-input v-model="searchParam.supplierName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>结款周期：</div>
          <div>
            <el-input v-model="searchParam.settlePeriod" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>订单状态：</div>
          <div>
            <!-- 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成 -->
            <el-select v-model="searchParam.orderStatus" placeholder="请选择">
              <el-option value="" label="全部" />
              <el-option value="15" label="待审核" />
              <el-option value="6" label="待发货" />
              <el-option value="7" label="待收货" />
              <el-option value="8" label="交易完成" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>下单时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.startCreateTime" type="date"
              placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.endCreateTime" type="date"
              placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">
            搜索
          </el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportData()">
            导出
          </el-button>
          <el-button icon="el-icon-warning" @click="quota()">
            风险额度
          </el-button>
        </div>
      </div>
      <div class="ly-table-panel">

        <div class="content1">
          <el-table ref="mainTable" :data="tableData.list" border row-key="orderId" style="width: 100%">
            <el-table-column width="1">
              <template slot-scope="scope">
                <div class="item">
                  <span style="margin-left:150px">订单编号：{{ scope.row.orderNo }}</span>
                  <el-tag effect="light" size="mini" v-if="scope.row.settleStatus==1">
                    已结算
                  </el-tag>
                  <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center" width="400">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty">
                  <div>
                    <img class="imgSty" :src="item.goodsImage" alt="">
                  </div>
                  <div class="mesFont">
                    <p>{{ item.goodsName }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="商品价格">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.goodsPrice}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="70" label="支付金额">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.goodsPrice*item.goodsNum}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" label="买家">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{ scope.row.userName }}<br />{{ scope.row.phoneNo }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" label="供货价">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.supplyPrice}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" fixed="right" min-width="170">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <template>
                    <div>
                      <div>
                        {{ scope.row.orderStatus | statuts2Text }}
                      </div>
                      <div>
                        <el-button type="text" size="mini" @click="getOrdDtl(scope.row)">订单详情
                        </el-button>
                      </div>
                      <div>
                        <el-button-group>
                          <el-button size="mini" type="primary" v-if="scope.row.orderStatus==6" @click="sendOrd(scope.row)">发货
                          </el-button>
                          <el-button size="mini" type="primary" v-if="scope.row.orderStatus==15" @click="confirmed(scope.row)">确认无误
                          </el-button>
                          <el-button size="mini" type="primary" v-if="scope.row.orderStatus==8&&scope.row.settleStatus!=1"  @click="settlement(scope.row)">结算
                          </el-button>
                        </el-button-group>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination"  style="margin: 10px 0;">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" :current-page="searchParam.pageNum" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>

    <div v-if="showOrdDtl" style="padding:40px;margin:0px 0px 40px 0px ;width:100%">
      <el-row :gutter="20" class="main-text">
        <el-col :span="24">
          <el-button type="success" @click="showOrdDtlClos()">
            返回列表
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="line-height:60px;font-size:14px;background-color:#FFFFF0">
        <el-col :span="6">
          <div>订单编号:{{ ordDtl.orderNo }}</div>
        </el-col>
        <el-col :span="6">
          <div>状态:{{ ordDtl.orderStatus | statuts2Text }}</div>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>
      <!-- <div style="font-size: 20px;padding-top: 20px;font-weight: 600;">供应商：{{ ordDtl.tenantName }}</div> -->
      <div style="padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20">
          <el-table :data="ordDtl.orderItemList"
            style="margin-bottom: 20px;font-size:12px;height:100%"
             :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"border>
            <el-table-column prop="goodsImage" label="商品图片" >
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage" height="40px" >
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" />
            <el-table-column prop="goodsPrice" label="商品单价" />
            <el-table-column prop="goodsNum" label="商品数量" />
            <el-table-column label="商品总价">
              <template slot-scope="scope">
                {{ scope.row.goodsPrice * scope.row.goodsNum }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px;" class="main-title">
          <el-col :span="24">
            付款信息
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-text">
          <el-col :span="6">
            付款方式：靠谱豆
          </el-col>
          <el-col :span="6">
            订单金额：{{ ordDtl.orderAmount }}
          </el-col>
          <el-col :span="6">
            应付金额：{{ ordDtl.orderPayAmount }}
          </el-col>
          <el-col :span="6">
            实付金额：{{ ordDtl.orderPayAmount	 }}
          </el-col>
        </el-row>
      </div>

      <div v-if="ordDtl.deliveryMethod==1" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
             <el-row :gutter="20" style="line-height:40px" class="main-title">
               <el-col :span="6">
                 收货人信息
               </el-col>
               <!-- <el-col :span="6">
                 <el-button type="text" @click="addressDialog = true">修改收货地址</el-button>
               </el-col> -->
             </el-row>
             <el-row :gutter="20" class="main-text">
               <el-col :span="6">
                 收货人：{{ ordDtl.receiverName }}
               </el-col>
               <el-col :span="6">
                 收货人电话：{{ ordDtl.receiverPhone }}
               </el-col>
               <el-col :span="6">
                 收货地址：{{ ordDtl.receiverAddress }}
               </el-col>
             </el-row>
           </div>
           <div v-if="ordDtl.deliveryMethod==2" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
             <el-row :gutter="20" style="line-height:40px" class="main-title">
               <el-col :span="6">
                 提货信息
               </el-col>
             </el-row>
             <el-row :gutter="20" class="main-text">
               <el-col :span="6">
                 预约时间：{{ ordDtl.appointmentDate }}
               </el-col>
               <el-col :span="6">
                 预留手机号：{{ ordDtl.appointmentMobile }}
               </el-col>
               <el-col :span="6">
                 取件门店：{{ ordDtl.memberStoreName }}
               </el-col>
             </el-row>
			 <el-row :gutter="20" class="main-text">
			   <el-col :span="6">核销时间：{{ ordDtl.exchangeDate }}</el-col>
			 </el-row>
           </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            支付及配送信息
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-text">
          <el-col :span="6">
            付款方式：靠谱豆
          </el-col>
          <el-col :span="6">
            支付时间：{{ ordDtl.createTime | _formatDate }}
          </el-col>
          <el-col :span="6">
            运费：0
          </el-col>
          <el-col :span="6" />
        </el-row>
      </div>
      <div style="width: 100%;display: flex;">
        <div style="width: 60%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px;margin:10px 15px 10px 0;">
          <el-carousel v-if="ordDtl.expressRouteInfoList&&ordDtl.expressRouteInfoList.length>=1" trigger="click" style="padding-bottom: 30px;">
            <el-carousel-item v-for="expressItem in ordDtl.expressRouteInfoList">
              <el-row :gutter="20" style="line-height:40px" class="main-title">
                <el-col v-if="expressItem.type==1" :span="18">
                  发货物流
                </el-col>
                <el-col v-if="expressItem.type==2" :span="18">
                  退货物流
                </el-col>
                <el-col :span="6">
                  共{{ordDtl.expressRouteInfoList.length}}条
                </el-col>
              </el-row>
              <el-row :gutter="20" class="main-text">
                <el-col :span="8">
                  物流公司：{{ expressItem.expressCompanyName }}
                </el-col>
                <el-col :span="10">
                  快递单号：{{ expressItem.logisticCode }}
                </el-col>
              </el-row>
              <div>
                <div class="steps-view">
                  <div class="steps" v-for="tracesItem in expressItem.traces">
                    <div style="min-width: 100px;text-align: right;">
                      <div>{{ tracesItem.time1 }}</div>
                      <div>{{ tracesItem.time2 }}</div>
                    </div>
                    <div class="steps-node"></div>
                    <div>
                      <div>{{ tracesItem.text }}</div>
                      <div>{{ tracesItem.acceptStation }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
          <el-row :gutter="20" v-if="!ordDtl.expressRouteInfoList||ordDtl.expressRouteInfoList.length==0" style="line-height:40px" class="main-title">
            <el-col :span="24">
              物流信息
            </el-col>
          </el-row>
          <div v-if="!ordDtl.expressRouteInfoList||ordDtl.expressRouteInfoList.length==0">
            暂无物流信息
          </div>
        </div>
        <div style="width: 40%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
              padding:10px;margin:10px 0px 10px 0;">
          <el-row :gutter="20" style="line-height:40px" class="main-title">
            <el-col :span="24">
              备注
            </el-col>
          </el-row>
          <div>
            {{ordDtl.remark?ordDtl.remark:'暂无备注'}}
          </div>
        </div>
      </div>
      <div style="line-height:400px;height:20px">
        <el-row :gutter="24" class="main-text">
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
        <el-form-item label="物流公司" prop="expressCompanyCode">
          <el-select v-model="sendOrderFrm.expressCompanyCode" placeholder="请选择">
            <el-option v-for="item in expressList" :key="item.id" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货地址" prop="sendAddress">
          <el-input v-model="sendOrderFrm.sendAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="expressNo">
          <el-input v-model="sendOrderFrm.expressNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSend()">立即发货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改收货地址弹框 -->
    <el-dialog title="修改收货地址" :visible.sync="addressDialog" width="50%" destroy-on-close :before-close="adressClose">
      <div style="width: 100%;line-height: 50px;">
        <div style="display: flex;">
          <div style="border-right: 1px solid #9E9E9E;min-width: 100px;text-align: center;">原地址：</div>
          <div style="text-align: center;width: 100%;">
            {{ordDtl.recArea}}&nbsp;,&nbsp;&nbsp;{{ordDtl.recUname}}&nbsp;,&nbsp;&nbsp;{{ordDtl.recPhone}}</div>
        </div>
        <div style="display: flex;border-top: 1px solid #9E9E9E;">
          <div style="border-right: 1px solid #9E9E9E;min-width: 100px;text-align: center;padding-top: 10px;">新地址：</div>
          <div style="padding-top: 20px;width: 100%;">
            <el-form ref="form" :rules="addressRules" :model="addressForm" label-width="100px">
              <el-form-item label="选择所在地" prop="areaText">
                <el-select v-model="selectProvince" size="small" value-key="provinceid" placeholder="请选择省份"
                  @change="selectProvinceFun">
                  <el-option v-for="(item) in city" :key="item.provinceid" :value="item" :label="item.province" />
                </el-select>
                <el-select v-model="selectCity" size="small" value-key="cityid" placeholder="请选择城市"
                  @change="selectCityFun">
                  <el-option v-for="(item) in cityList" :key="item.cityid" :value="item" :label="item.city" />
                </el-select>
                <el-select v-model="selectArea" size="small" value-key="areaid" placeholder="请选择区县"
                  @change="selectAreaFun">
                  <el-option v-for="(item) in areaList" :key="item.areaid" :value="item" :label="item.area" />
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="changeAddress">
                <el-input v-model="addressForm.changeAddress"></el-input>
              </el-form-item>
              <el-form-item label="收货人姓名" prop="changeName">
                <el-input v-model="addressForm.changeName"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="changePhone">
                <el-input v-model="addressForm.changePhone"></el-input>
              </el-form-item>
              <el-form-item>
                <div style="text-align: right;">
                  <el-button @click="adressClose">取 消</el-button>
                  <el-button type="primary" @click="enterAddress">确 定</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>

      <el-dialog title="风险额度" :visible.sync="stateShow" width="25%" destroy-on-close :before-close="quotaClose">
        <div style="width: 100%;line-height: 50px;">
          <div>
            靠谱豆风险额度：<el-input style="width:200px;" type="number" v-model="bean_order_risk_limit" placeholder="请输入额度"></el-input>
          </div>
          <div style="text-align: right;">
            <el-button @click="quotaClose">取 消</el-button>
            <el-button type="primary" @click="quotaEnter">确 定</el-button>
          </div>
        </div>
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
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {},
    filters: {
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
      statuts2Text(status) {
        // 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成
        let statusText = ''
        if (status == '0') {
          statusText = '已取消'
        } else if (status == '1') {
          statusText = '已提交'
        } else if (status == '2') {
          statusText = '待支付'
        } else if (status == '3') {
          statusText = '退款中'
        } else if (status == '4') {
          statusText = '退款完成'
        } else if (status == '5') {
          statusText = '待取件'
        } else if (status == '6') {
          statusText = '待发货'
        } else if (status == '7') {
          statusText = '待收货'
        } else if (status == '8') {
          statusText = '交易完成'
        } else if (status == '9') {
          statusText = '拒收'
        } else if (status == '10') {
          statusText = '拒收完成'
        } else if (status == '11') {
          statusText = '退货中'
        } else if (status == '12') {
          statusText = '退货完成'
        } else if (status == '13') {
          statusText = '退货退款中'
        } else if (status == '14') {
          statusText = '拒收退款中'
        } else if (status == '15') {
          statusText = '待确认'
        }
        return statusText
      },
    },
    data() {
      return {
        stateShow: false,
        bean_order_risk_limit:'',
        menuId: '',
        operationModuleName: '',
        addressDialog: false,
        city: [],
        cityList: [],
        areaList: [],
        selectProvince: '',
        selectCity: '',
        selectArea: '',
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
        //物流轨迹信息数组
        logisticsList: [],
        //修改收货地址
        addressForm: {
          provinceid: '',
          provincetext: '',
          cityid: '',
          citytext: '',
          areaId: '',
          areaText: '',
          changeAddress: '',
          changeName: '',
          changePhone: ''
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
          expressCompanyCode: '',
          expressCompanyName: '',
          expressNo: '',
        },
        ordDtl: {
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
          endCreateTime: '',
          goodsName: '',
          orderNo: '',
          orderStatus: '',
          phoneNo: '',
          settlePeriod:'',
          supplierName:'',
          startCreateTime: '',
          userName: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        dataList: [],

        // 线下发货所需数据
        expressList: [{
          id: 'ZYE',
            text: '众邮快递'
          },
          {
            id: 'SF',
            text: '顺丰速运'
          },
          {
            id: 'HTKY',
            text: '百世快递'
          },
          {
            id: 'DBL',
            text: '德邦快递'
          },
          {
            id: 'STO',
            text: '申通快递'
          },
          {
            id: 'YTO',
            text: '圆通速递'
          },
          {
            id: 'YD',
            text: '韵达速递'
          },
          {
            id: 'EMS',
            text: 'EMS'
          },
          {
            id: 'HHTT',
            text: '天天快递'
          },
          {
            id: 'ZTO',
            text: '中通快递'
          },
          {
            id: 'UC',
            text: '优速快递'
          },
          {
            id: 'UAPEX',
            text: '全一快递'
          },
          {
            id: 'SURE',
            text: '速尔快递'
          },
          {
            id: 'KYSY',
            text: '跨越速运'
          },
          {
            id: 'TLWL',
            text: '腾林物流'
          },
          {
            id: 'YZBK',
            text: '邮政国内标快'
          },
          {
            id: 'YZPY',
            text: '邮政快递包裹'
          },
          {
            id: 'ZJS',
            text: '宅急送'
          },
          {
            id: 'XFEX',
            text: '信丰物流'
          },
          {
            id: 'LHT',
            text: '联昊通速递'
          },
          {
            id: 'YCWL',
            text: '远成快运'
          },
          {
            id: 'PJ',
            text: '品骏快递'
          },
          {
            id: 'JDKY',
            text: '京东快运'
          },
          {
            id: 'ANEKY',
            text: '安能快运'
          },
          {
            id: 'LB',
            text: '龙邦快运'
          },
          {
            id: 'DBLKY',
            text: '德邦快运'
          },
          {
            id: 'HTKYKY',
            text: '百世快运'
          },
          {
            id: 'CND',
            text: '承诺达'
          },
          {
            id: 'ZTOKY',
            text: '中通快运'
          },
          {
            id: 'HOAU',
            text: '天地华宇'
          },
          {
            id: 'CNEX',
            text: '佳吉快运'
          },
          {
            id: 'YDKY',
            text: '韵达快运'
          },
          {
            id: 'SX',
            text: '顺心捷达'
          },
          {
            id: 'JTSD',
            text: '极兔速递'
          },
          {
            id: 'DNWL',
            text: '丹鸟物流'
          },
          {
            id: 'SNWL',
            text: '苏宁物流'
          },
          {
            id: 'EST365',
            text: '东方汇'
          },
          {
            id: 'YMDD',
            text: '壹米滴答'
          },
          {
            id: 'JD',
            text: '京东快递'
          }
        ],
        rules: {
          expressCompanyCode: [{
            required: true,
            message: '请选择物流公司',
            trigger: 'change'
          }],
          expressNo: [{
            required: true,
            message: '请输入物流单号',
            trigger: 'blur'
          }]
        },
        addressRules: {
          areaText: [{
            required: true,
            message: '请选择所在地',
            trigger: 'change'
          }],
          changeAddress: [{
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }],
          changeName: [{
            required: true,
            message: '请输入收货人姓名',
            trigger: 'blur'
          }],
          changePhone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }]
        },
      }
    },
    computed: {},
    mounted() {
      // this.getRoute()
      if (this.$route.query.orderStatus != undefined) {
            this.searchParam.orderStatus = this.$route.query.orderStatus
          }
      this.initLoad()
      // this.loadProvinceList()
      //this.loadtypeIdList()
      // this.initSupplyList()
    },
    created() {

    },
    methods: {
      closeSendOrderDialog() {
        this.sendOrder = false
        this.sendOrderFrm = {}
      },
      showOrdDtlClos() {
        this.showOrdDtl = false
        this.ptStep = false
        this.lpStep = false
        this.dzStep = false
      },
      //修改地址彈框
      adressClose() {
        this.addressDialog = false
        this.addressForm = {
          provinceid: null,
          provincetext: null,
          cityid: null,
          citytext: null,
          areaId: null,
          areaText: null,
          changeAddress: null,
          changeName: null,
          changePhone: null
        }
        this.selectProvince = ''
        this.selectCity = ''
        this.selectArea = ''
      },
      //风险额度
      quota(){
        getMethod('/operate/get-config-info').then(res => {
          this.bean_order_risk_limit=res.data.bean_order_risk_limit
        })
        this.stateShow = true
      },
      quotaClose() {
        this.bean_order_risk_limit=''
        this.stateShow = false
      },
      quotaEnter(){
        postMethod('/operate/set-config',{bean_order_risk_limit:this.bean_order_risk_limit}).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.quotaClose()
        })
      },
      settlement(row){
        this.$confirm('是否确认结算?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMethod('/order/settle-bean-order', {orderNo:row.orderNo}).then(res => {
            this.loadList()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        })
      },
      confirmed(row){
        postMethod('/order/confirm-bean-order?id='+row.id).then(res => {
          this.$message({
            message: '确认成功',
            type: 'success'
          })
          this.loadList()
        })
      },
      //省市区
      loadProvinceList() {
        const scope = this
        getMethod('/backend/areas/getAllData').then(res => {
          scope.city = res.data
        })
      },
      selectProvinceFun(event) {
        this.selectCity = ''
        this.selectArea = ''
        this.addressForm.citytext = ''
        this.addressForm.areaText = ''
        if (event) {
          this.cityList = event.cityList
        } else {
          this.cityList = []
        }
        this.addressForm.provinceid = event.provinceid
        this.addressForm.provincetext = event.province
      },
      selectCityFun(event) {
        this.selectArea = ''
        this.addressForm.areaText = ''
        if (event) {
          this.areaList = event.areasList
        } else {
          this.areaList = []
        }
        this.addressForm.cityid = event.cityid
        this.addressForm.citytext = event.city
      },
      selectAreaFun(event) {
        this.addressForm.areaId = event.areaid
        this.addressForm.areaText = event.area
      },
      // 提交新的收货地址
      enterAddress() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let param = {
              orderId: this.ordDtl.orderId,
              recAddress: this.addressForm.changeAddress,
              recProvinceName: this.addressForm.provincetext,
              recCityName: this.addressForm.citytext,
              recAreaName: this.addressForm.areaText,
              recPhone: this.addressForm.changePhone,
              recUname: this.addressForm.changeName,
            }
            postMethodNew('/order/changeAddress', param).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                let datas = {
                  operationObject: this.ordDtl.orderNo,
                  operationContent: '发货'
                }
                this.saveOperation(datas)
                this.adressClose()
                let obj = {
                  orderId: this.ordDtl.orderId
                }
                this.getOrdDtl(obj)
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          }
        })
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
        window.open(process.env.VUE_APP_BASE_API_NEW + "/excel/bean-order/export?" + exportParam.join("&"));
      },
      //获取当前页面路由
      getRoute() {
        let menuList = this.$store.getters.permission_routes
        let menuId = ''
        let operationModuleName = ''
        for (let j = 0; j < menuList.length; j++) {
          if (menuList[j].children) {
            for (let i = 0; i < menuList[j].children.length; i++) {
              if (menuList[j].children[i].path == this.$route.path) {
                menuId = menuList[j].children[i].id
                operationModuleName = menuList[j].name + '-' + menuList[j].children[i].name
              }
            }
          }
        }
        this.menuId = menuId
        this.operationModuleName = operationModuleName
      },
      //保存操作记录
      saveOperation(datas) {
        let params = {
          menuId: this.menuId,
          operationModuleName: this.operationModuleName,
          operationObject: datas.operationObject,
          operationContent: datas.operationContent
        }
        postMethod('/backend/operation/saveOperationRecord', params).then(res => {})
      },
      getOrdDtl_() {
        let scope = this
        postMethod('/order/getOrdDtl', {
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
          orderNo: row.orderNo
        }
        getMethod('/order/bean-order-detail', param).then(res => {
          scope.showOrdDtl = true
          if(res.data.expressRouteInfoList&&res.data.expressRouteInfoList.length>=1){
            res.data.expressRouteInfoList.forEach(item => {
            let arr = []
            let text = ''
            let title = ''
            let status
            item.traces.map(tracesItem => {
              if (tracesItem.acceptTime) {
                arr = tracesItem.acceptTime.split(" ")
              }
              tracesItem.time1 = arr[0].substring(0, 10)
              tracesItem.time2 = arr[1].substring(0, 8)
              status = tracesItem.action
              if (status == 0) {
                tracesItem.text = '暂无轨迹信息';
              } else if (status == '1') {
                tracesItem.text = '已揽收';
              } else if (status == '2') {
                tracesItem.text = '运输中';
              } else if (status == 201) {
                tracesItem.text = '到达派件城市';
              } else if (status == 202) {
                tracesItem.text = '派件中';
              } else if (status == 211) {
                tracesItem.text = '已放入快递柜或驿站';
              } else if (status == 3) {
                tracesItem.text = '已签收';
              } else if (status == 301) {
                tracesItem.text = '已签收';
              } else if (status == 302) {
                tracesItem.text = '派件异常后最终签收';
              } else if (status == 304) {
                tracesItem.text = '代收签收';
              } else if (status == 311) {
                tracesItem.text = '快递柜或驿站签收';
              } else if (status == 4) {
                tracesItem.text = '问题件';
              } else if (status == 401) {
                tracesItem.text = '发货无信息';
              } else if (status == 402) {
                tracesItem.text = '超时未签收';
              } else if (status == 403) {
                tracesItem.text = '超时未更新';
              } else if (status == 404) {
                tracesItem.text = '拒收（退件）';
              } else if (status == 405) {
                tracesItem.text = '派件异常';
              } else if (status == 406) {
                tracesItem.text = '退货签收';
              } else if (status == 407) {
                tracesItem.text = '退货未签收';
              } else if (status == 412) {
                tracesItem.text = '快递柜或驿站超时未取';
              } else if (status == '001') {
                tracesItem.text = '已下单';
              } else if (status == '002') {
                tracesItem.text = '已发货';
              }
            })
          })
          }
          scope.ordDtl = res.data
          // scope.getLogistics()
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
            let express = this.expressList.find(item => item.id == this.sendOrderFrm.expressCompanyCode)
            this.sendOrderFrm.expressCompanyName = express.text
            let loading = this.$loading({
              lock: true,
              text: '正在发货中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            delete this.sendOrderFrm.sendAddress
            postMethod('/order/offline-send-order', this.sendOrderFrm).then(res => {
              if (res.errCode != 0) {
                this.$message.error(res.message)
                return
              }
              this.$message({
                message: '发货成功',
                type: 'success'
              })
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
      },
      async loadAddress() {
        const {
          data
        } = await getMethod("/operate/get-config-info-by-type?type=send_address")
        this.sendOrderFrm.sendAddress = data.value
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
        this.searchParam.pageNum = 1
        this.loadList()
      },
      search() {
        this.searchParam.pageNum = 1
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
          getMethod('/order/bean-order-list', this.searchParam).then(res => {
            scope.tableData.list = res.data.records
            scope.tableData.total = res.data.total
            scope.sendOrder = false
            scope.showPagination = scope.tableData.total == 0
            this.loading = false
          })
      },
      // 获取物流轨迹
      getLogistics() {
        let that = this
        let params = {
          recPhone: that.ordDtl.recPhone,
          orderNo: that.ordDtl.orderNo
        }
        if (that.ordDtl.expressNo && that.ordDtl.expressNo != '') {
          params.logisticCode = that.ordDtl.expressNo
        }
        if (that.ordDtl.expressId && that.ordDtl.expressId != '') {
          params.shipperCode = that.ordDtl.expressId
        }
        getMethod('/order/getLogisticsInfo', params)
          .then(res => {
            if (res.code == 200) {
              let result = res.data
              let arr = []
              let text = ''
              let title = ''
              result.map(item => {
                if (item.acceptTime) {
                  arr = item.acceptTime.split(" ")
                }
                item.time1 = arr[0].substring(0, 10)
                item.time2 = arr[1].substring(0, 8)
              })
              let status
              for (let i = 0; i < result.length; i++) {
                status = result[i].action
                if (status == 0) {
                  result[i].text = '暂无轨迹信息';
                } else if (status == '1') {
                  result[i].text = '已揽收';
                } else if (status == '2') {
                  result[i].text = '运输中';
                } else if (status == 201) {
                  result[i].text = '到达派件城市';
                } else if (status == 202) {
                  result[i].text = '派件中';
                } else if (status == 211) {
                  result[i].text = '已放入快递柜或驿站';
                } else if (status == 3) {
                  result[i].text = '已签收';
                } else if (status == 301) {
                  result[i].text = '已签收';
                } else if (status == 302) {
                  result[i].text = '派件异常后最终签收';
                } else if (status == 304) {
                  result[i].text = '代收签收';
                } else if (status == 311) {
                  result[i].text = '快递柜或驿站签收';
                } else if (status == 4) {
                  result[i].text = '问题件';
                } else if (status == 401) {
                  result[i].text = '发货无信息';
                } else if (status == 402) {
                  result[i].text = '超时未签收';
                } else if (status == 403) {
                  result[i].text = '超时未更新';
                } else if (status == 404) {
                  result[i].text = '拒收（退件）';
                } else if (status == 405) {
                  result[i].text = '派件异常';
                } else if (status == 406) {
                  result[i].text = '退货签收';
                } else if (status == 407) {
                  result[i].text = '退货未签收';
                } else if (status == 412) {
                  result[i].text = '快递柜或驿站超时未取';
                } else if (status == '001') {
                  result[i].text = '已下单';
                } else if (status == '002') {
                  result[i].text = '已发货';
                }
              }
              that.logisticsList = result
            }
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
	.el-carousel__item {
	    overflow-y: auto!important;
	}
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
  .main-title {
    font-size: 16px;
    font-weight: 600;
  }
  .main-text{
    line-height: 40px;
    font-size: 14px;
  }
</style>
<style lang="scss">
  .el-step__title {
    font-size: 12px;
  }

  .sub-title {
    font-size: 12px;
  }

  .steps-view {
    padding: 0 20px;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }

  .steps-view::before {
    content: "";
    position: absolute;
    width: 2px;
    background-color: #d8d8d8;
    height: calc(100% - 0px);
    left: 138px;
    z-index: 2;
  }

  .steps {
    display: flex;
    min-height: 60px;
    font-size: 15px;
    line-height: 20px;
    margin-bottom: 20px;
    height: auto;
  }

  .steps-node {
    background-color: #d8d8d8;
    min-width: 18px;
    border-radius: 25px;
    height: 18px;
    margin: 0 30px 0 10px;
  }

  .trItem {
    display: flex;
    line-height: 50px;
  }

  .tdTitle {
    width: 100px;
  }
</style>
<style scoped>
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }

  .el-table--enable-row-transition /deep/ .cell {
    padding: 0;
  }

  .item {
    width: 100vw;
    background: #f1f1f1;
    position: absolute;
    top: 0;
    left: -55px;
    z-index: 1;
    height: 50px;
    line-height: 50px;
  }

  .imgSty {
    width: 100px;
    height: 100px;
    display: block;
    margin-left: 10px;
  }

  .mesSty {
    height: 150px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty:first-child {
    margin-top: 50px;
  }

  .mesSty:last-child {
    border-bottom: none;
  }

  .mesSty2 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1px;
    height: 150px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty2:last-child {
    border-bottom: none;
  }

  .content1>>>.el-table--border td:nth-child(2) {
    padding: 0;
  }

  .content1 /deep/ .el-table__row td:nth-child(n+3) .cell {
    position: absolute !important;
    top: 50px !important;
    width: 100%;
    text-align: center;
  }

  .content1 /deep/ .el-table__row td:nth-child(1) .cell {
    position: absolute !important;
    top: 0px !important;
    z-index: 999;
    width: 100vw;
    height: 50px;
    line-height: 50px;
  }

  .pb_sty span {
    background: #1dc8de;
    padding: 2px 8px;
    border-radius: 4px;
    color: #fff;
  }

  .mesFont p {
    text-align: left !important;
    margin-block-start: 0;
    margin-block-end: 0;
    padding: 0 10px;
  }

  .mesFont p:nth-child(2) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
