<template>
  <div>
    <div v-if="!showOrdDtl" v-loading="loading" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>订单编号:</td>
            <td>
              <el-input v-model="searchParam.orderNo" width="180px" />
            </td>
            <td>买家姓名：</td>
            <td>
              <el-input v-model="searchParam.recUname" width="180px" />
            </td>
            <!-- <td>买家手机号:</td>
            <td>
              <el-input
                v-model="searchParam.orderNo"
                width="180px"
              />
            </td> -->
            <td>商家：</td>
            <td>
              <el-select v-model="searchParam.tenantId" placeholder="请选择">
                <el-option value="" label="全部" />
                <el-option v-for="item in supplyList" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </td>

            <td>订单状态:</td>
            <td>
              <el-select v-model="searchParam.status" placeholder="请选择">
                <el-option value="" label="全部" />
                <el-option value="10" label="待发货" />
                <el-option value="20" label="待收货" />
                <el-option value="30" label="待支付" />
                <el-option value="50" label="已完成" />
                <el-option value="60" label="定制信息确认中" />
              </el-select>
            </td>
          </tr>
          <tr>
            <!-- <td>是否超期未付款:</td>
             <td>
               <el-select v-model="searchParam.isOverDuePayment" placeholder="请选择">
                 <el-option value="" label="全部"></el-option>
                 <el-option value="1" label="是"></el-option>
                 <el-option value="0" label="否"></el-option>
               </el-select>
             </td> -->
            <td>订单类型:</td>
            <td>
              <!--              1:普通订单;2:礼品订单;3:礼券;4:定制订单;5:会员订单-->
              <el-select v-model="searchParam.orderType" placeholder="请选择">
                <el-option value="" label="全部" />
                <el-option value="1" label="普通订单" />
                <el-option value="4" label="定制订单" />
              </el-select>
            </td>
            <td>支付方式：</td>
            <td>
              <el-select v-model="searchParam.payType" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="2" label="微信"></el-option>
                <el-option value="1" label="支付宝"></el-option>
              </el-select>
            </td>
            <td colspan="2">
              <el-button icon="el-icon-search" @click="search()">
                搜索
              </el-button>
              <el-button icon="el-icon-download" @click="exportData()">
                导出
              </el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="orderId"
            border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.supplierList[0].dtlList" style="width: 100%; margin-bottom: 20px;" border>
                  <el-table-column prop="goodName" label="商品名称" width="400px" />
                  <el-table-column prop="goodSinglePrice" label="商品单价" width="150px" />
                  <el-table-column prop="goodNum" label="商品数量" width="150px" />
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
                  <el-table-column prop="goodCode" label="物料编码" width="150px" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" width="220px" />
            <el-table-column prop="ordPayPrice" label="订单总价" width="150px">
              <template slot-scope="scope">
                {{ scope.row | fmtPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="实付金额" width="150px">
              <template slot-scope="scope">
                {{ scope.row | fmtPayPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="payType" label="支付方式" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.payType == 1">支付宝</span>
                <span v-if="scope.row.payType == 2 || scope.row.payType == 3">微信</span>
              </template>
            </el-table-column>
            <el-table-column prop="recUname" label="买家姓名" width="120px" />
            <!-- <el-table-column
              prop="recPhone"
              label="买家手机号码"
              width="150px"
            /> -->
            <el-table-column prop="orderNo" label="供应商名称" width="220px">
              <template slot-scope="scope">
                {{ scope.row.tenantName }}
              </template>
            </el-table-column>
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
                {{ scope.row.orderType | type2Text }}
              </template>
            </el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
            <el-table-column prop="id" label="操作" width="250px">
              <template slot-scope="scope">
                <el-link v-if="scope.row.orderType == 6 && scope.row.status == 10" type="primary" @click="sendOrd(scope.row)">发货
                </el-link>
                <el-link v-if="false && scope.row.status == 60" type="primary" @click="collectCus(scope.row)">
                  发起定价收款
                </el-link>
                <el-link v-if="scope.row.status == 10||scope.row.status == 20||scope.row.status == 30||scope.row.status == 60"
                  type="primary" @click="test(scope.row)">
                  修改状态
                </el-link>
                <el-link v-if="scope.row.orderType != 3" type="primary" @click="getOrdDtl(scope.row)">
                  查看订单
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog v-if="dealPrice" title="商品定价" visible="dealPrice">
          <el-form ref="form" :model="dealPriceFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="dealPriceFrm.orderNo" :disabled="true" />
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="dealPriceFrm.ordPrice" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitDealPrice()">
                提价定价
              </el-button>
              <el-button @click="dealPrice=false">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
      <div class="list-panel" />
    </div>

    <div v-if="showOrdDtl" style="height:650px;padding:40px;margin:0px 0px 40px 0px ;width:100%">
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
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
          <div>状态:{{ ordDtl.status | statuts2Text }}</div>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>

      <el-row :gutter="20" style="line-height:40px;padding:25px 0px;">
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
      </el-row>
      <div style="font-size: 20px;padding-top: 20px;font-weight: 600;">供应商：{{ ordDtl.tenantName }}</div>
      <div style="padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20">
          <el-table :data="ordDtl.supplierList[0].dtlList" style="width: 1180px; margin-bottom: 20px;font-size:12px;height:100%"
            border>
            <el-table-column prop="goodImage" label="商品图片" width="140px">
              <template slot-scope="scope">
                <img :src="scope.row.goodImage" height="40px" width="40px">
              </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="288px" />
            <el-table-column prop="isMarketing" label="商品类型">
              <template slot-scope="scope">
                <span v-if="scope.row.isMarketing == 0">普通商品</span>
                <span v-if="scope.row.isMarketing == 1">活动商品</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodSinglePrice" label="商品单价" width="120px" />
            <el-table-column prop="goodNum" label="商品数量" width="100px" />
            <el-table-column prop="goodSinglePrice" label="商品总价" width="120px">
              <template slot-scope="scope">
                {{ scope.row.goodSinglePrice * scope.row.goodNum }}
              </template>
            </el-table-column>
            <el-table-column prop="skuInfo" label="规格" width="200px">
              <template slot-scope="scope">
                {{ scope.row.skuInfo }}
                <div v-if="ordDtl.status==10&&ordDtl.orderType==1" style="text-align: center!important;width: 100%;">
                  <el-button type="text" @click="modifySku(scope.row)">修改订单属性</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="goodCode" label="商品货号" width="150px" />
          </el-table>
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px;" class="main-title">
          <el-col :span="24">
            付款信息
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
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
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="6">
            运费：{{ ordDtl.expressPrice == '0' ? '0.00' : ordDtl.expressPrice }}
          </el-col>
          <el-col :span="6">
            优惠金额：{{ ordDtl.ordSubPrice == '0' ? '0.00' : ordDtl.ordSubPrice }}
          </el-col>
          <el-col :span="6" />
          <el-col :span="6" />
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="2">
            收货人信息
          </el-col>
          <el-col v-if="ordDtl.status==10" :span="6">
            <el-button type="text" @click="addressDialog = true">修改收货地址</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="6">
            收货人：{{ ordDtl.recUname }}
          </el-col>
          <el-col :span="6">
            收货地址：{{ ordDtl.recArea }}
          </el-col>
          <el-col :span="6">
            收货人电话：{{ ordDtl.recPhone }}
          </el-col>
          <el-col :span="6" />
        </el-row>
      </div>

      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            支付及配送信息
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="6">
            付款方式：{{ ordDtl.payType | pay2Text }}
          </el-col>
          <el-col :span="6">
            支付时间：{{ ordDtl.payTime | _formatDate }}
          </el-col>
          <el-col :span="6">
            运费：{{ ordDtl.expressPrice }}
          </el-col>
          <el-col :span="6" />
        </el-row>
      </div>
      <!-- <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
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
      </div> -->

      <div v-if="ordDtl.orderType != 6" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            发票信息
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="6">
            发票类型：普通发票
          </el-col>
          <el-col v-if="ordDtl.tax && ordDtl.tax.taxTitle" :span="6">
            发票抬头：{{ ordDtl.tax.taxTitle == '1' ? '公司' : '个人' }}
          </el-col>
          <el-col v-if="ordDtl.tax && ordDtl.tax.compTaxNo" :span="6">
            税号：{{ ordDtl.tax.compTaxNo }}
          </el-col>
          <el-col v-if="ordDtl.tax && ordDtl.tax.companyName" :span="6">
            公司名称：{{ ordDtl.tax.companyName }}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col v-if="ordDtl.tax && ordDtl.tax.email" :span="6">
            邮箱：{{ ordDtl.tax.email }}
          </el-col>
          <el-col v-if="ordDtl.tax && ordDtl.tax.phoneNo" :span="6">
            手机号码：{{ ordDtl.tax.phoneNo }}
          </el-col>
          <el-col :span="6" />
          <el-col :span="6" />
        </el-row>
      </div>

      <div v-if="ordDtl.ordDtlList[0].goodCustom" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            定制信息
          </el-col>
        </el-row>
        <el-row :gutter="24" style="line-height:40px;font-size:12px">
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
      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px;margin:10px 0px 10px 0;">
        <el-row :gutter="20" style="line-height:40px" class="main-title">
          <el-col :span="24">
            物流信息
          </el-col>
        </el-row>
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="6">
            物流公司：{{ ordDtl.expressName }}
          </el-col>
          <el-col :span="6">
            快递单号：{{ ordDtl.expressNo }}
          </el-col>
          <el-col :span="6" />
        </el-row>
        <div>
          <div class="steps-view">
            <div class="steps" v-for="item in logisticsList" :key="item.key">
              <div style="min-width: 100px;text-align: right;">
                <div>{{ item.time1 }}</div>
                <div>{{ item.time2 }}</div>
              </div>
              <div class="steps-node"></div>
              <div>
                <div>{{ item.text }}</div>
                <div>{{ item.acceptStation }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="line-height:400px;height:20px">
        <el-row :gutter="24" style="line-height:40px;font-size:12px">
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
        <el-form-item label="操作说明">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="sendOrderFrm.opContent">
          </el-input>
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
          <div style="text-align: center;width: 100%;">{{ordDtl.recArea}}&nbsp;,&nbsp;&nbsp;{{ordDtl.recUname}}&nbsp;,&nbsp;&nbsp;{{ordDtl.recPhone}}</div>
        </div>
        <div style="display: flex;border-top: 1px solid #9E9E9E;">
          <div style="border-right: 1px solid #9E9E9E;min-width: 100px;text-align: center;padding-top: 10px;">新地址：</div>
          <div style="padding-top: 20px;width: 100%;">
            <el-form ref="form" :rules="addressRules" :model="addressForm" label-width="100px">
              <el-form-item label="选择所在地" prop="areaText">
                <el-select v-model="selectProvince"  size="small" value-key="provinceid" placeholder="请选择省份" @change="selectProvinceFun">
                  <el-option v-for="(item) in city" :key="item.provinceid" :value="item" :label="item.province" />
                </el-select>
                <el-select v-model="selectCity" size="small" value-key="cityid" placeholder="请选择城市" @change="selectCityFun">
                  <el-option v-for="(item) in cityList" :key="item.cityid" :value="item" :label="item.city" />
                </el-select>
                <el-select v-model="selectArea" size="small" value-key="areaid" placeholder="请选择区县" @change="selectAreaFun">
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
    <!-- 修改属性规格弹框 -->
    <el-dialog title="修改商品规格" :visible.sync="skuDialog" width="50%" destroy-on-close :before-close="skuClose">
      <div style="width: 100%;">
        <div style="display: flex;line-height: 40px;">
          <div style="min-width: 200px;text-align: center;"><img style="height: 80px;" :src="goodDtlList.goodImage" />
          </div>
          <div style="width: 100%;">
            <div>{{goodDtlList.goodName}}</div>
            <div>{{goodDtlList.skuInfo}} &nbsp;&nbsp;&nbsp;&nbsp;单价：{{goodDtlList.goodSinglePrice}}
              &nbsp;&nbsp;&nbsp;&nbsp;数量：{{goodDtlList.goodNum}}</div>
          </div>
        </div>
        <div style="display: flex;border-top: 1px solid #9E9E9E;">
          <div style="min-width: 200px"></div>
          <div style="padding-top: 20px;width: 100%;">
            <el-form ref="form" :rules="addressRules" :model="addressForm" label-width="100px">
              <div>
                <div class="wrap wrap-sku">
                  <div class="product-box">
                    <div class="product-content">
                      <div class="product-delcom" v-for="(ProductItem,n) in simulatedDATA.specifications">
                        <p>{{ProductItem.name}}</p>
                        <ul class="product-footerlist clearfix">
                          <li style="list-style:none" v-for="(oItem,index) in ProductItem.item" v-on:click="specificationBtn(oItem.name,n,$event,index)"
                            v-bind:class="[oItem.isShow?'':'noneActive',subIndex[n] == index?'productActive':'']">
                            {{oItem.name}}
                          </li>
                        </ul>
                      </div>
                      <p v-if="price" class="price">¥{{price}}</p>
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
            <el-option v-if="(currentOrderType==1&&currentOrderState==10)||(currentOrderType==4&&currentOrderState==30)||(currentOrderType==4&&currentOrderState==60)"
              label="取消订单" value="0"></el-option>
            <el-option v-if="(currentOrderType==1&&currentOrderState==20)||(currentOrderType==4&&currentOrderState==20)||(currentOrderType==4&&currentOrderState==30)"
              label="待发货" value="10"></el-option>
            <el-option v-if="(currentOrderType==1&&currentOrderState==20)" label="待支付" value="30"></el-option>
            <el-option v-if="(currentOrderType==1&&currentOrderState==30)||(currentOrderType==4&&currentOrderState==20)"
              label="交易完成" value="50"></el-option>
          </el-select>
        </div>
        <div style="text-align: right;">
          <el-button @click="stateClose">取 消</el-button>
          <el-button type="primary" @click="enterAddress">确 定</el-button>
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
    getMethod as getMethodNew,
    postMethod as postMethodNew
  } from '@/api/request-new'

  import * as requestMethod from '@/api/request'


  import {
    formatDate
  } from '@/api/tools.js'
  import {
    getToken
  } from '@/utils/auth'

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
        simulatedDATA: {
          "difference": [],
          "specifications": []
        },
        selectArr: [], //存放被选中的值
        shopItemInfo: {}, //存放要和选中的值进行匹配的数据
        subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
        price: '',
        menuId:'',
        operationModuleName:'',
        goodDtlList: {},
        currentOrderType: '',
        currentOrderState: '',
        states: '',
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
          payType: '',
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
          pageNum: 1
        },
        tableData: {
          list: []
        },
        dataList: [],
        //物流轨迹信息数组
        logisticsList: [],
        // 线下发货所需数据
        expressList: [{
            id: 'SF',
            text: '顺丰速运'
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
            id: 'STO',
            text: '申通快递'
          },
          {
            id: 'DBL',
            text: '德邦快递'
          },
          {
            id: 'JD',
            text: '京东快递'
          },
          {
            id: 'HHTT',
            text: '天天快递'
          },
          {
            id: 'JTSD',
            text: '极兔速递'
          },
          {
            id: 'SNWL',
            text: '苏宁物流'
          },
          {
            id: 'ZTO',
            text: '中通快递'
          },
          {
            id: 'YD',
            text: '韵达速递'
          },
          {
            id: 'HTKY',
            text: '百世快递'
          },
          {
            id: 'YTO',
            text: '圆通速递'
          }
        ],
        rules: {
          expressId: [{
            required: true,
            message: '请选择物流公司',
            trigger: 'change'
          }],
          sendAddress: [{
            required: true,
            message: '请选择发货地址',
            trigger: 'blur'
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
      this.getRoute()
      if (this.$route.query.dt != undefined) {
        this.searchParam.dataType = this.$route.query.dt
        this.searchParam.isOverDuePayment = "1"
      }
      if (this.$route.query.orderId) {
        this.orderId_ = this.$route.query.orderId
        this.getOrdDtl_()
      }
      this.initLoad()
      this.loadProvinceList()
      //this.loadtypeIdList()
      this.initSupplyList()
    },
    created() {
      var that = this;
      for (var i in that.simulatedDATA.difference) {
        that.shopItemInfo[that.simulatedDATA.difference[i].difference] = that.simulatedDATA.difference[i]; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
      }
      that.checkItem();
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
      //获取当前页面路由
      getRoute(){
        let menuList = this.$store.getters.permission_routes
        let menuId=''
        let operationModuleName=''
        for (let j = 0; j < menuList.length; j++) {
          if(menuList[j].children){
          for (let i = 0; i < menuList[j].children.length; i++) {
            if (menuList[j].children[i].path==this.$route.path) {
              menuId=menuList[j].children[i].id
              operationModuleName=menuList[j].name+'-'+menuList[j].children[i].name
            }
          }
          }
        }
        this.menuId = menuId
        this.operationModuleName = operationModuleName
      },
      //保存操作记录
      saveOperation(datas){
        let params = {
          menuId : this.menuId,
          operationModuleName : this.operationModuleName,
          operationObject : datas.operationObject,
          operationContent : datas.operationContent
        }
        postMethod('/backend/operation/saveOperationRecord',params).then(res => {
        })
      },
      //修改SKU彈框
      modifySku(row) {
        this.skuDialog = true
        this.goodDtlList = row
        getMethod('/backend/good/findById', {
          goodId: row.goodId
        }).then(res => {
          let skuSelList = res.data.skuSelList.reverse()
          let skuPriceList = res.data.skuPriceList
          skuSelList.forEach((e, i) => {
            e.skuTextArr = e.skuText.split(",")
            let arr = []
            let txtarr = e.skuTextArr
            txtarr.forEach((m, n) => {
              let ndatas = {
                name: m,
                isShow: true
              }
              arr.push(ndatas)
            })
            e.name = e.attrTitle
            e.item = arr
          })
          skuPriceList.forEach((e, i) => {
            e.price = e.saleMemPrice
            e.difference = e.skuText
          })
          this.simulatedDATA = {
            'difference': skuPriceList,
            'specifications': skuSelList
          }
        })
      },
      enterSku(){
        let skuText = this.selectArr.join(":")
        let arr = this.simulatedDATA.difference
        let skuId=''
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].skuCompareText==skuText) {
            skuId = arr[j].id
          }
        }
        if(skuId!=''){
         let param = {
           skuId:skuId,
           ordDtlId:this.goodDtlList.ordDtlId
         }
          postMethodNew('/order/changeSkuAttr', param).then(res => {
            if(res.code==200){
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              let datas={
                operationObject : this.ordDtl.orderId,
                operationContent : '修改商品规格'
              }
              this.saveOperation(datas)
              this.skuClose()
              let obj={
                orderId:this.ordDtl.orderId
              }
              this.getOrdDtl(obj)
            }else{
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }else{
         this.$message({
           message: "请选择商品规格",
           type: 'warning'
         })
        }
      },
      skuClose() {
       this.skuDialog = false
       this.selectArr= []
       this.shopItemInfo= {}
       this.subIndex= []
       this.price= ''
      },

      specificationBtn: function(item, n, event, index) {
        var that = this;
        if (that.selectArr[n] != item) {
          that.selectArr[n] = item;
          that.subIndex[n] = index;
        } else {
          that.selectArr[n] = "";
          that.subIndex[n] = -1; //去掉选中的颜色
        }
        that.checkItem();
      },
      checkItem: function() {
        var that = this;
        var option = that.simulatedDATA.specifications;
        var result = []; //定义数组储存被选中的值
        for (var i in option) {
          result[i] = that.selectArr[i] ? that.selectArr[i] : '';
        }
        for (var i in option) {
          var last = result[i]; //把选中的值存放到字符串last去
          for (var k in option[i].item) {
            result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
            option[i].item[k].isShow = that.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
          }
          result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
        }
        if (this.shopItemInfo[result]) {
          this.price = this.shopItemInfo[result].price || ''
        }
        that.$forceUpdate(); //重绘
      },
      isMay: function(result) {
        for (var i in result) {
          if (result[i] == '') {
            return true; //如果数组里有为空的值，那直接返回true
          }
        }
        return true; //匹配选中的数据的库存，若不为空返回true反之返回false
      },

      //修改订单状态
      test(row) {
        console.log(row, '修改订单状态')
        this.currentOrderType = row.orderType,
          this.currentOrderState = row.status,
          this.stateShow = true
      },
      stateClose() {
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
            let recArea=this.addressForm.provincetext+' '+this.addressForm.citytext+' '+this.addressForm.areaText
            let param = {
              orderId:this.ordDtl.orderId,
              recAddress:this.addressForm.changeAddress,
              recArea:recArea,
              recPhone:this.addressForm.changePhone,
              recUname:this.addressForm.changeName,
            }
            postMethodNew('/order/changeAddress', param).then(res => {
              if(res.code==200){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                let datas={
                  operationObject : this.ordDtl.orderId,
                  operationContent : '修改收货地址'
                }
                this.saveOperation(datas)
                this.adressClose()
                let obj={
                  orderId:this.ordDtl.orderId
                }
                this.getOrdDtl(obj)
              }else{
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
        window.open(process.env.VUE_APP_BASE_API_NEW + "/order/export?" + exportParam.join("&"));
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
        postMethodNew('/order/getOrdDtl', {
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

        postMethodNew('/order/getOrdDtl', param).then(res => {
          scope.showOrdDtl = true
          scope.ordDtl = res.data
          console.log(scope.ordDtl, 'scope.ordDtl')
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
          scope.getLogistics()
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
            postMethodNew('/order/offlineSendOrder', this.sendOrderFrm).then(res => {
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
        postMethodNew('/order/getOrdDtl', param).then(res => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          this.onlineOrderDtl = res.data
        })
      },
      async loadAddress() {
        const {
          data
        } = await getMethodNew("/config/findList?dataType=send_address_config")
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
        this.searchParam.pageNum = 1
        this.loadList()
      },
      search() {
        this.searchParam.pageSize = 10
        this.searchParam.pageNum = 1
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
          // requestMethod
          getMethodNew('/order/findPage', this.searchParam).then(res => {
            scope.tableData = res.data
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
        getMethodNew('/order/getLogisticsInfo', params)
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
