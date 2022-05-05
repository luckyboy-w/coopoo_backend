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
            <el-input v-model="searchParam.buyerName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>买家手机号：</div>
          <div>
            <el-input v-model="searchParam.buyerMobile" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>门店名称：</div>
          <div>
            <el-input v-model="searchParam.storeName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>订单状态：</div>
          <div>
            <!-- 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成 -->
            <el-select v-model="searchParam.orderStatus" placeholder="请选择">
              <el-option value="" label="全部" />
              <el-option value="0" label="已取消" />
              <el-option value="2" label="待支付" />
              <el-option value="3" label="退款中" />
              <el-option value="4" label="退款完成" />
              <el-option value="5" label="待自提" />
              <el-option value="6" label="待发货" />
              <el-option value="7" label="待收货" />
              <el-option value="8" label="交易完成" />
              <el-option value="9" label="拒收" />
              <el-option value="10" label="拒收完成" />
              <el-option value="11" label="退货中" />
              <el-option value="12" label="退货完成" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>支付方式：</div>
          <div>
            <el-select v-model="searchParam.payType" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="2" label="微信"></el-option>
              <el-option value="1" label="支付宝"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>注册手机号：</div>
          <div>
            <el-input v-model="searchParam.registerPhoneNo" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>下单时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderStartTime"
              type="date" placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderEndTime" type="date"
              placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <div>交易关闭时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderCloseStartTime"
              type="date" placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderCloseEndTime"
              type="date" placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <!-- <div class="tabTd">
          <div>是否需要开发票：</div>
          <div>
            <el-select v-model="searchParam.receiptStatus" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="无需开票"></el-option>
              <el-option value="2" label="未开票"></el-option>
              <el-option value="3" label="已开票"></el-option>
            </el-select>
          </div>
        </div> -->
        <div class="tabTd">
          <el-button icon="el-icon-search" type="primary" @click="search()">
            搜索
          </el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportData()">
            导出
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
                  <span style="margin-left:150px">订单总额：{{ scope.row.orderPayAmount}}</span>
                  <!-- <span style="margin-left:150px" v-if="scope.row.orderStatus==">下单时间：{{ scope.row.createTime }}</span>
                  <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span> -->
                  <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                  <span style="margin-left:150px">注册手机号：{{ scope.row.registerPhoneNo }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品" align="center" width="400">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty">
                  <div>
                    <img class="imgSty" :src="item.goodsImage" alt="">
                  </div>
                  <div class="mesFont">
                    <p>{{ item.goodsName }}</p>
                    <p style="font-size: 12px;color:#909399;margin-top: 10px;">{{ item.skuText }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="单价">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.goodsPrice}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="数量">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.goodsNum}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="70" label="商品状态">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.orderItemStatus| goodsText }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="70" label="实付金额">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                  <div>{{ item.orderItemPayAmount}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" label="买家">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{ scope.row.buyerName }}<br />{{ scope.row.buyerMobile }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="140" align="center" label="门店名称">
              <template slot-scope="scope">
                <div class="mesSty2">
                  {{ scope.row.storeName?scope.row.storeName:'暂无' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" fixed="right" min-width="230">
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
                          <!-- <el-button v-if="scope.row.status == 10" type="primary"
                            @click="sendOrd(scope.row)">发货
                          </el-button> -->
                          <el-button size="mini" v-if="scope.row.orderStatus == 2||scope.row.orderStatus == 7"
                            type="primary" @click="modifyState(scope.row)">
                            修改订单
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

        <div class="ly-data-pagination" style="margin: 10px 0;">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" :current-page="searchParam.pageNum" @prev-click="currentPage"
            @next-click="currentPage" />
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
          <div>订单编号：{{ ordDtl.orderNo }}</div>
        </el-col>
        <el-col :span="6">
          <div>订单状态：{{ ordDtl.orderStatus | statuts2Text }}</div>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>

      <!-- <el-row :gutter="20" style="line-height:40px;padding:25px 0px;">
        <el-col :span="24">
          <el-steps v-if="ptStep" :active="ordStep" align-center>
            <el-step title="待发货" />
            <el-step title="待收货" />
            <el-step title="待支付" />
            <el-step :title="isCancelTitle" />
          </el-steps>

          <el-steps v-if="lpStep" :active="ordStep" align-center>
            <el-step title="待支付" />
            <el-step title="待发货" />
            <el-step title="待收货" />
            <el-step title="已完成" />
          </el-steps>

          <el-steps v-if="dzStep" :active="ordStep" align-center>
            <el-step title="待沟通" />
            <el-step title="待发货" />
            <el-step title="待收货" />
            <el-step title="待支付" />
            <el-step title="已完成" />
          </el-steps>
        </el-col>
      </el-row> -->
      <!-- <div style="font-size: 20px;padding-top: 20px;font-weight: 600;">供应商：{{ ordDtl.tenantName }}</div> -->
      <div style="padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20">
          <el-table :data="ordDtl.orderItemList" :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="goodsImage" label="商品图片">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage" height="40px" width="40px">
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" />
            <el-table-column prop="skuText" label="规格">
              <template slot-scope="scope">
                {{ scope.row.skuText }}
                <div v-if="ordDtl.orderStatus==5||ordDtl.orderStatus==6" style="text-align: center!important;width: 100%;">
                  <el-button type="text" @click="modifySku(scope.row)">修改订单属性</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="商品单价" />
            <el-table-column prop="goodsNum" label="商品数量" width="100px" />
            <el-table-column label="商品总价">
              <template slot-scope="scope">
                {{ scope.row.goodsPrice * scope.row.goodsNum }}
              </template>
            </el-table-column>
            <el-table-column prop="goodsCode" label="物料编码" />
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
            付款方式：{{ ordDtl.payChannel | pay2Text }}
          </el-col>
          <el-col :span="6">
            订单金额：{{ ordDtl.orderAmount }}
          </el-col>
          <el-col :span="6">
            应付金额：{{ ordDtl.orderAmount }}
          </el-col>
          <el-col :span="6">
            实付金额：{{ ordDtl.orderPayAmount }}
          </el-col>
        </el-row>
      </div>

      <div v-if="ordDtl.deliveryMethod==1"
        style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="6">
            收货人信息
            <el-button v-if="ordDtl.orderStatus==6" type="text" @click="addressDialog = true">&nbsp;&nbsp;&nbsp; 修改收货地址</el-button>
          </el-col>
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
      <div v-if="ordDtl.deliveryMethod==2"
        style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
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
      <div v-if="ordDtl.receiptId"
        style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            发票信息
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-text">
          <el-col :span="6">
            发票抬头：{{ ordDtl.receiptTitle == '1' ? '公司' : '个人' }}
          </el-col>
          <el-col :span="6">
            手机号：{{ordDtl.receiptMobile}}
          </el-col>
          <el-col :span="6">
            邮箱：{{ ordDtl.receiptEmail }}
          </el-col>
          <el-col :span="6">
            发票内容：{{ ordDtl.receiptContent }}
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-text">
          <el-col v-if="ordDtl.receiptTitle=='1'" :span="6">
            公司名称：{{ ordDtl.receiptCompanyName }}
          </el-col>
          <el-col v-if="ordDtl.receiptTitle=='2'" :span="6">
            发票人名称：{{ ordDtl.receiptPersonName }}
          </el-col>
          <el-col v-if="ordDtl.receiptTitle=='1'" :span="6">
            税号：{{ ordDtl.receiptCompanyTaxNo }}
          </el-col>
          <el-col :span="6" />
          <el-col :span="6" />
        </el-row>
      </div>
      <div style="width: 100%;display: flex;">
        <div style="width: 60%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px;margin:10px 15px 10px 0;">

          <el-carousel v-if="ordDtl.expressRouteInfoList&&ordDtl.expressRouteInfoList.length>=1" trigger="click"
            style="padding-bottom: 30px;">
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
          <el-row :gutter="20" v-if="!ordDtl.expressRouteInfoList||ordDtl.expressRouteInfoList.length==0"
            style="line-height:40px" class="main-title">
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
    </div>

    <!-- 修改收货地址弹框 -->
    <el-dialog title="修改收货地址" :visible.sync="addressDialog" width="50%" destroy-on-close :before-close="adressClose">
      <div style="width: 100%;line-height: 50px;">
        <div style="display: flex;">
          <div style="border-right: 1px solid #9E9E9E;min-width: 100px;text-align: center;">原地址：</div>
          <div style="text-align: center;width: 100%;">
            {{ordDtl.receiverAddress}}&nbsp;,&nbsp;&nbsp;{{ordDtl.receiverName}}&nbsp;,&nbsp;&nbsp;{{ordDtl.receiverPhone}}
          </div>
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
                <el-input maxlength="11" v-model="addressForm.changePhone"></el-input>
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
    <!-- 修改属性规格弹框 -->
    <el-dialog title="修改商品规格" :visible.sync="skuDialog" width="50%" destroy-on-close :before-close="skuClose">
      <div style="width: 100%;">
        <div style="display: flex;line-height: 40px;">
          <div style="min-width: 200px;text-align: center;"><img style="height: 80px;" :src="goodDtlList.goodsImage" />
          </div>
          <div style="width: 100%;">
            <div>{{goodDtlList.goodsName}}</div>
            <div>{{goodDtlList.skuText}} &nbsp;&nbsp;&nbsp;&nbsp;单价：{{goodDtlList.goodsPrice}}
              &nbsp;&nbsp;&nbsp;&nbsp;数量：{{goodDtlList.goodsNum}}</div>
          </div>
        </div>
        <div style="display: flex;border-top: 1px solid #9E9E9E;">
          <div style="min-width: 200px"></div>
          <div style="padding-top: 20px;width: 100%;">
            <el-form ref="form" :model="addressForm" label-width="100px">
              <div>
                <div class="wrap wrap-sku">
                  <div class="product-box">
                    <div class="product-content">
                      <div class="product-delcom" v-for="(ProductItem,n) in simulatedDATA.specifications">
                        <p>{{ProductItem.name}}</p>
                        <ul class="product-footerlist clearfix">
                          <li style="list-style:none" v-for="(oItem,index) in ProductItem.item"
                            v-on:click="specificationBtn(oItem.name,n,$event,index,ProductItem.name)"
                            v-bind:class="[oItem.isShow?'':'noneActive',subIndex[n] == index?'productActive':'']">
                            {{oItem.name}}
                          </li>
                        </ul>
                      </div>
                      <p v-if="price" class="price">价格：<span style="color: red;"> {{price}}</span></p>
                    </div>
                  </div>
                </div>
              </div>
              <el-form-item>
                <div style="text-align: right;margin-top: 10px;">
                  <el-button @click="skuClose">取 消</el-button>
                  <el-button type="primary" @click="enterSku">确 定</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 修改订单状态弹框 -->
    <el-dialog title="修改订单状态" :visible.sync="stateShow" width="25%" destroy-on-close :before-close="stateClose">
      <div style="width: 100%;line-height: 50px;">
        <div>
          <el-select v-model="states" placeholder="请选择">
            <el-option v-if="currentOrderState==7" label="待发货" value="6"></el-option>
            <el-option v-if="currentOrderState==2" label="已付款" value="6"></el-option>
            <el-option v-if="currentOrderState==7" label="交易完成" value="8"></el-option>
          </el-select>
        </div>
        <div v-if="states==6&&currentOrderState==2">
          <el-select v-model="currentPayChannel" placeholder="请选择支付方式">
            <el-option label="支付宝" value="1"></el-option>
            <el-option label="微信" value="2"></el-option>
          </el-select>
          <el-input v-model="serialNumber" placeholder="请输入支付流水号"></el-input>
        </div>
        <div style="text-align: right;">
          <el-button @click="stateClose">取 消</el-button>
          <el-button type="primary" @click="enterState">确 定</el-button>
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

  import * as requestMethod from '@/api/request'
  import addressData from "@/utils/address.json"

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
        if (pay == 1) {
          return '支付宝'
        } else if (pay == 2) {
          return '微信'
        } else if (pay == 3) {
          return '微信'
        }
        return '未支付'
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
          statusText = '待自提'
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
      goodsText(status) {
        // 商品状态 0:已提交 1:可退款 2:发货中 3:退款中 4:退款失败 5:退款完成 6:待评价 7:已评价 8:退货待接单 9:退货已接单 10:退货中 11:退货完成 12:拒收 13:拒收完成 14:退货退款中 15:拒收退款中
        let statusText = ''
        if (status == '0') {
          statusText = '已提交'
        } else if (status == '1') {
          statusText = '可退款'
        } else if (status == '2') {
          statusText = '发货中'
        } else if (status == '3') {
          statusText = '退款中'
        } else if (status == '4') {
          statusText = '退款失败'
        } else if (status == '5') {
          statusText = '退款完成'
        } else if (status == '6') {
          statusText = '待评价'
        } else if (status == '7') {
          statusText = '已评价'
        } else if (status == '8') {
          statusText = '退货待接单'
        } else if (status == '9') {
          statusText = '退货已接单'
        } else if (status == '10') {
          statusText = '退货中'
        } else if (status == '11') {
          statusText = '退货完成'
        } else if (status == '12') {
          statusText = '拒收'
        } else if (status == '13') {
          statusText = '拒收完成'
        } else if (status == '14') {
          statusText = '退货退款中'
        } else if (status == '15') {
          statusText = '拒收退款中'
        }
        return statusText
      },
    },
    data() {
      return {
        simulatedDATA: {
          "difference": [],
          "specifications": []
        },
        selectArr: [], //存放被选中的值
        shopItemInfo: {}, //存放要和选中的值进行匹配的数据
        subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
        price: '',
        addressData: addressData,

        menuId: '',
        operationModuleName: '',
        goodDtlList: {},
        currentOrderState: '',
        currentPayChannel: '',
        currentOrderNo: '',
        // currentIsSendSevenDay: '',
        states: '',
        serialNumber: '',
        stateShow: false,
        skuDialog: false,
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
          isRisk:'0',
          isVipOrder: "1",
          registerPhoneNo: "",
          buyerMobile: '',
          buyerName: '',
          goodsName: '',
          orderEndTime: '',
          orderCloseStartTime: '',
          orderCloseEndTime: '',
          orderNo: '',
          orderStartTime: '',
          orderStatus: '',
          payType: '',
          receiptStatus: '',
          storeName: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        dataList: [],
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
      if (this.$route.query.orderStatus != undefined) {
        this.searchParam.orderStatus = this.$route.query.orderStatus
      }
      this.initLoad()
      console.log(addressData, 'addressData')
      this.loadProvinceList()
      //this.loadtypeIdList()
      // this.initSupplyList()
    },
    created() {
      // var that = this;
      // console.log(that.simulatedDATA.difference, 'that.simulatedDATA.difference')
      // for (var i in that.simulatedDATA.difference) {
      //   that.shopItemInfo[that.simulatedDATA.difference[i].difference] = that.simulatedDATA.difference[i]
      //   .difference; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
      //   console.log(that.shopItemInfo, 'that.shopItemInfo')
      // }
      // that.checkItem();
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
      //修改SKU彈框
      modifySku(row) {
        this.skuDialog = true
        let params = {
           goodsId: row.goodsId, //row.goodsId
           liveGoodsId:row.liveGoodsId?row.liveGoodsId:'',
           marketingGoodsId:row.goodsMarketingId?row.goodsMarketingId:'',
        }
        console.log(row, 'sku信息')
        this.goodDtlList = row
        getMethod('/goods/sku',params).then(res => {
          let skuSelList = res.data.specificationList
          let skuPriceList = res.data.skuList
          skuSelList.forEach((e, i) => {
            e.skuTextArr = e.specificationValueList
            let arr = []
            let txtarr = e.skuTextArr
            txtarr.forEach((m, n) => {
              let ndatas = {
                name: m.specificationValue,
                isShow: true
              }
              arr.push(ndatas)
            })
            e.name = e.specificationName
            e.item = arr
          })
          skuPriceList.forEach((e, i) => {
            e.price = e.salePrice
            e.difference = e.skuText
          })
          this.simulatedDATA = {
            'difference': skuPriceList,
            'specifications': skuSelList
          }

        })
      },
      enterSku() {
        let skuText = this.selectArr.join(";")
        let arr = this.simulatedDATA.difference
        let skuId = ''
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].skuText == skuText) {
            skuId = arr[j].skuId
          }
        }
        if (skuId != '') {
          let param = {
            skuId: skuId,
            orderItemId: this.goodDtlList.orderItemId,
            orderNo:this.ordDtl.orderNo
          }
          postMethod('/order/modify-order-sku', param).then(res => {
            if (res.errCode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              // let datas = {
              //   operationObject: this.ordDtl.orderNo,
              //   operationContent: '修改商品规格'
              // }
              // this.saveOperation(datas)
              this.skuClose()
              let obj = {
                orderNo: this.ordDtl.orderNo
              }
              this.getOrdDtl(obj)
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: "请选择商品规格",
            type: 'warning'
          })
        }
      },
      skuClose() {
        this.skuDialog = false
        this.selectArr = []
        this.shopItemInfo = {}
        this.subIndex = []
        this.price = ''
      },

      specificationBtn: function(item, n, event, index, name) {
        console.log(item, n, event, index, name, '88888')
        let that = this;
        if (that.selectArr[n] != item) {
          let arr = name + ":" + item
          console.log(arr, 'arr')
          that.selectArr[n] = arr;
          that.subIndex[n] = index;
        } else {
          that.selectArr[n] = "";
          that.subIndex[n] = -1; //去掉选中的颜色
        }
        // that.$forceUpdate(); //重绘
        that.checkItem();
      },
      checkItem: function() {
        let skuText = this.selectArr.join(";")
        let arr = this.simulatedDATA.difference
        let skuId = ''
        console.log(arr, skuText, 'arr');
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].skuText == skuText) {
            skuId = arr[j].skuId
            this.price = arr[j].price
          }
        }
        this.$forceUpdate(); //重绘
        // var that = this;
        // var option = that.simulatedDATA.specifications;
        // var result = []; //定义数组储存被选中的值
        // for (var i in option) {
        //   result[i] = that.selectArr[i] ? that.selectArr[i] : '';
        // }
        // for (var i in option) {
        //   var last = result[i]; //把选中的值存放到字符串last去
        //   for (var k in option[i].item) {
        //     result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
        //     option[i].item[k].isShow = that.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
        //   }
        //   result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
        // }
        // console.log(this.shopItemInfo[result], 'this.shopItemInfo[result]')
        // if (this.shopItemInfo[result]) {
        //   this.price = this.shopItemInfo[result].price || ''
        // }
        // that.$forceUpdate(); //重绘
      },
      // isMay: function(result) {
      //   for (var i in result) {
      //     if (result[i] == '') {
      //       return true; //如果数组里有为空的值，那直接返回true
      //     }
      //   }
      //   return true;
      // },

      //修改订单状态
      modifyState(row) {
        this.currentOrderState = row.orderStatus,
          // this.currentIsSendSevenDay = row.isSendSevenDay
        this.currentOrderNo = row.orderNo
        this.stateShow = true
      },
      enterState() {
        if (this.states == '') {
          this.$message({
            message: '请选择要修改的状态',
            type: 'warning'
          })
          return
        }
        if (this.states == 6 && this.currentOrderState == 2) {
          if (this.currentPayChannel == '') {
            this.$message({
              message: '请选择支付方式',
              type: 'warning'
            })
            return false
          }
          if (this.serialNumber == '') {
            this.$message({
              message: '请填写支付流水号',
              type: 'warning'
            })
            return false
          }
          let param = {
            orderNo: this.currentOrderNo,
            payChannel: this.currentPayChannel,
            tradeNo: this.serialNumber
          }
          getMethod('/order/modify-order-pay', param).then(res => {
            if (res.errCode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.stateClose()
              this.loadList()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
              return false;
            }
          })
        }
        if (this.states == 6 && this.currentOrderState != 2) {
          let param = {
            orderNo: this.currentOrderNo
          }
          getMethod('/order/modify-order-waiting-send', param)
            .then(res => {
              if (res.errCode == 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.stateClose()
                this.loadList()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
                return false;
              }
            })
        }
        if (this.states == 8) {
          let param = {
            orderNo: this.currentOrderNo
          }
          getMethod('/order/modify-order-finish', param).then(res => {
            if (res.errCode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.stateClose()
              this.loadList()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
              return false;
            }
          })
        }
      },
      stateClose() {
        this.currentOrderState = ''
        this.currentPayChannel = ''
        this.currentOrderNo = ''
        // this.currentIsSendSevenDay = ''
        this.states = ''
        this.serialNumber = ''
        this.stateShow = false
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
      //省市区
      loadProvinceList() {
        const scope = this
        // getMethod('/backend/areas/getAllData').then(res => {
        scope.city = addressData.data
        // })
      },
      selectProvinceFun(event) {
        this.selectCity = ''
        this.selectArea = ''
        this.addressForm.citytext = ''
        this.addressForm.areaText = ''
        if (event) {
          this.cityList = event.cityList
          this.areaList = []
        } else {
          this.cityList = []
          this.areaList = []
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
              orderNo: this.ordDtl.orderNo,
              receiverAddress: this.addressForm.changeAddress,
              receiverProvince: this.addressForm.provincetext,
              receiverCity: this.addressForm.citytext,
              receiverRegion: this.addressForm.areaText,
              receiverPhone: this.addressForm.changePhone,
              receiverName: this.addressForm.changeName,
            }
            postMethod('/order/modify-order-address', param).then(res => {
              if (res.errCode == 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                // let datas = {
                //   operationObject: this.ordDtl.orderNo,
                //   operationContent: '修改收货地址'
                // }
                // this.saveOperation(datas)
                this.adressClose()
                let obj = {
                  orderNo: this.ordDtl.orderNo
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
        window.open(process.env.VUE_APP_BASE_API_NEW + "/excel/order/export?" + exportParam.join("&"));
      },
      getOrdDtl(row) {
        let scope = this
        let param = {
          orderNo: row.orderNo
        }
        getMethod('/order/goods-order-detail', param).then(res => {
          scope.showOrdDtl = true
          if (res.data.expressRouteInfoList && res.data.expressRouteInfoList.length >= 1) {
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
          // that.logisticsList = result
          scope.ptStep = false
          scope.dzStep = false
          scope.lpStep = false
        })
      },
      search() {
        this.searchParam.pageNum = 1
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
        // requestMethod
        postMethod('/order/goods-order-list', this.searchParam).then(res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.sendOrder = false
          scope.showPagination = scope.tableData.total == 0
          this.loading = false
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .el-carousel__item {
    overflow-y: auto !important;
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

  .main-text {
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
</style>
<style lang="scss" rel="stylesheet">
  .wrap-sku {
    .product-box {
      // width: 1200px;
      display: block;
      margin: 0 auto;
    }

    .product-content {
      // margin-bottom: 100px;
    }

    .product-delcom {
      color: #323232;
      border-bottom: 1px solid #EEEEEE;
    }

    .product-footerlist {
      margin-top: 10px;
    }

    .product-footerlist li {
      border: 1px solid #606060;
      border-radius: 5px;
      color: #606060;
      text-align: center;
      padding: 5px 10px;
      float: left;
      margin-right: 20px;
      cursor: pointer;
    }

    .product-footerlist li.productActive {
      background-color: #1A1A29;
      color: #fff;
      border: 1px solid #1A1A29;
    }

    .product-footerlist li.noneActive {
      background-color: #ccc;
      opacity: 0.4;
      color: #000;
      pointer-events: none;
    }

    .price {
      height: 40px;
      line-height: 40px;
    }
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
