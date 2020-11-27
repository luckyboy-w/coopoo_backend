<template>
  <div style="padding-top:20px;width:100%">
    <el-row style="line-height:40px;padding:0px 25px 5px 25px">
      <el-col
        :span="3"
        style="font-size:14px;"
      >
        平台运营至今
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;backgroud-color:#F0F0F0;"
      >
        已提现总额(元)：{{ billFeeText | fmtFee }}
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;"
      >
        已申请提现总额(元)：{{ allApplyFee | fmtFee }}
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;"
      >
        返佣总金额(元)：{{ allPerFee | fmtFee }}
      </el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="待返佣数据"
        name="allFee"
        style="height:600px"
      >
        <div class="ly-tool-panel">
          <table>
            <tr>
              <td>服务商:</td>
              <td>
                <el-input
                  v-model="searchParam.provinceName"
                  width="180px"
                />
              </td>
              <td>手机号码:</td>
              <td>
                <el-input
                  v-model="searchParam.provPhone"
                  width="180px"
                />
              </td>
              <td>
                <el-button
                  icon="el-icon-search"
                  @click="search()"
                >
                  查询
                </el-button>
              </td>
            </tr>
          </table>
        </div>

        <el-table
          ref="allFeeData"
          :data="allFeeData.list"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
        >
          <el-table-column
            prop="provinceName"
            label="服务商"
            min-width="20%"
          />
          <el-table-column
            prop="provLevel"
            label="服务类型"
            min-width="20%"
          />
          <el-table-column
            prop="mobileNo"
            label="联系电话"
            min-width="20%"
          />
          <el-table-column
            prop="cashNum"
            label="待返佣金额"
            min-width="20%"
          >
            <template slot-scope="scope">
              {{ scope.row.cashNum | fmtFee }}
            </template>
          </el-table-column>
          <el-table-column
            prop="provId"
            label="操作"
            min-width="20%"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="chkFeeDtl(scope.row)"
              >
                查看明细
              </el-link>
              <el-link
                type="primary"
                @click="chkFriDtl(scope.row)"
              >
                会员明细
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="allFeeDataShow"
          :total="allFeeData.total"
          background
          layout="prev, pager, next"
          @current-change="currentAllFeePage"
          @prev-click="currentAllFeePage"
          @next-click="currentAllFeePage"
        />
      </el-tab-pane>
      <el-tab-pane
        label="提现中"
        name="feeProcess"
        style="height:600px"
      >
        <el-row style="line-height:40px;padding:10px 0px ">
          <el-col
            :span="1"
            style="font-size:14px;"
          >
            申请单号
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="exportApplyFrm.cashNo"
              style="width:80px"
              placeholder=""
            />
          </el-col>
          <el-col
            :span="1"
            style="font-size:14px;"
          >
            服务商
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="exportApplyFrm.provId"
              placeholder="请选择服务商"
            >
              <el-option
                v-for="item in providerList"
                :key="item.id"
                value-key="id"
                :label="item.provinceName"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col
            :span="1"
            style="font-size:14px;"
          >
            服务商
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="exportApplyFrm.applyStartTime"
              type="date"
              width="120px"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="exportApplyFrm.applyEndTime"
              type="date"
              width="120px"
              placeholder="选择结束日期"
            />
          </el-col>
          <el-col
            :span="9"
            style="padding-left:10px"
          >
            <el-button
              type="primary"
              @click="batchBill()"
            >
              搜索
            </el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-download"
              @click="exportApplyCash()"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
        <el-table
          ref="feeProcessData"
          :data="feeProcessData.list"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
        >
          <el-table-column
            prop="cashNo"
            label="申请单号"
            min-width="24%"
          />
          <el-table-column
            prop="provinceName"
            label="申请服务商"
            min-width="24%"
          />
          <el-table-column
            prop="createTime"
            label="申请时间"
            min-width="24%"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cashNum"
            label="结算金额（元）"
            min-width="24%"
          >
            <template slot-scope="scope">
              {{ scope.row.cashNum | fmtFee }}
            </template>
          </el-table-column>
          <el-table-column
            prop="pkBillId"
            label="操作"
            min-width="24%"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="dealCash(scope.row)"
              >
                完成提现
              </el-link>
              <!-- <el-link type="primary" @click="chkFeeProcessDtl(scope.row)" >查看明细</el-link> -->
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="feeProcessData.total"
          background
          layout="prev, pager, next"
          @current-change="currentProcessPage"
          @prev-click="currentProcessPage"
          @next-click="currentProcessPage"
        />
      </el-tab-pane>
      <el-tab-pane
        label="已提现"
        name="feeEnd"
        style="height:600px"
      >
        <el-table
          ref="feeEnd"
          :data="feeEndData.list"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
        >
          <el-table-column
            prop="cashNo"
            label="申请单号"
            min-width="24%"
          />
          <el-table-column
            prop="provinceName"
            label="申请服务商"
            min-width="24%"
          />
          <el-table-column
            prop="createTime"
            label="申请时间"
            min-width="24%"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cashNum"
            label="结算金额（元）"
            min-width="24%"
          >
            <template slot-scope="scope">
              {{ scope.row.cashNum | fmtFee }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="feeEndData.total"
          background
          layout="prev, pager, next"
          @current-change="currentEndPage"
          @prev-click="currentEndPage"
          @next-click="currentEndPage"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="feeDtl_"
        label="待返佣明细"
        name="feeDtl"
        style="height:600px"
      >
        <el-row style="line-height:40px;padding:10px 0px ">
          <el-col
            :span="24"
            style="padding-left:10px"
          >
            <el-button
              v-if="!allFeeDataShow"
              type="primary"
              icon="el-icon-back"
              @click="backToAllFee()"
            >
              返回列表
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-show="allFeeDtlFee"
          ref="dtlFeeRef"
          :data="dtlFeeList"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column
            prop="nickName"
            label="会员姓名"
            min-width="24%"
          />
          <el-table-column
            prop="phoneNo"
            label="手机号码"
            min-width="24%"
          />
          <el-table-column
            prop="ordPayPrice"
            label="订单金额"
            min-width="20%"
          />
          <el-table-column
            prop="perPrice"
            label="返佣金额"
            min-width="20%"
          />
          <el-table-column
            prop="tradeTime"
            label="付费时间"
            min-width="24%"
          >
            <template slot-scope="scope">
              {{ scope.row.tradeTime | _formateDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="friDtlData.total"
          background
          layout="prev, pager, next"
          @current-change="currentFriPage"
          @prev-click="currentFriPage"
          @next-click="currentFriPage"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="friDtl_"
        label="会员明细"
        name="friDtl"
        style="height:600px"
      >
        <el-row style="line-height:40px;padding:10px 0px ">
          <el-col
            :span="24"
            style="padding-left:10px"
          >
            <el-button
              v-if="!allFeeDataShow"
              type="primary"
              icon="el-icon-back"
              @click="backToAllFee()"
            >
              返回列表
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-show="allFriDtlFee"
          ref="dtlFriRef"
          :data="dtlFriList"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column
            prop="friName"
            label="会员昵称"
            min-width="24%"
          />
          <el-table-column
            prop="friPhone"
            label="手机号码"
            min-width="24%"
          />
        </el-table>
        <el-pagination
          :total="friDtlData.total"
          background
          layout="prev, pager, next"
          @current-change="currentFriPage"
          @prev-click="currentFriPage"
          @next-click="currentFriPage"
        />
      </el-tab-pane>

      <!-- <el-tab-pane  label="返佣明细" name="feeDtl" style="height:600px">
                            <el-table
                                ref="feeDtlData"
                                :data="feeDtlData.list"
                                style="width: 100%; margin-bottom: 20px;"
                                row-key="id">
                                 <el-table-column type="index" width="50" label="序号"></el-table-column>
                                <el-table-column prop="friName" label="好友昵称" min-width="20%">
                                </el-table-column>
                                <el-table-column prop="ordPayPrice" label="订单金额" min-width="20%">
                                </el-table-column>
                                <el-table-column prop="perPrice" label="分成金额" min-width="20%">
                                </el-table-column>
                                <el-table-column prop="tradeTime" label="下单时间" min-width="20%">
                                    <template slot-scope="scope">
                                        {{scope.row.tradeTime | _formateDate}}
                                    </template>
                                </el-table-column>
                            </el-table>
                             <el-pagination
                                :total="feeDtlData.total"
                                background
                                layout="prev, pager, next"
                                @current-change="currentFeePage"
                                @prev-click="currentFeePage"
                                @next-click="currentFeePage"
                            />
                        </el-tab-pane>
                        <el-tab-pane label="会员明细" name="friDtl" style="height:600px">
                            <el-table
                                ref="friDtlData"
                                :data="friDtlData.list"
                                style="width: 100%; margin-bottom: 20px;"
                                row-key="id">
                                <el-table-column type="index" width="50" label="序号"></el-table-column>
                               <el-table-column prop="friName" label="会员昵称" min-width="24%">
                                </el-table-column>
                                <el-table-column prop="friPhone" label="手机号码" min-width="24%">
                                </el-table-column>
                            </el-table>
                             <el-pagination
                                :total="friDtlData.total"
                                background
                                layout="prev, pager, next"
                                @current-change="currentFriPage"
                                @prev-click="currentFriPage"
                                @next-click="currentFriPage"
                            />
                        </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"

  export default {
    filters: {
      _formateDate(time) {
        if (time == '' ||
          time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      fmtFee(fee) {
        if (fee == undefined) {
          return '';
        }
        fee = fee + ''
        if (fee.indexOf(".") == -1) {
          return fee + ".00";
        }
        return fee;
      }
    },
    data() {
      return {
        feeDtl_: false,
        friDtl_: false,
        allFeeDataShow: true,
        allFeeDtlFee: false,
        allFriDtlFee: false,
        types: [{
            title: 1,
            value: 'A'
          },
          {
            title: 2,
            value: 'B'
          },
          {
            title: 3,
            value: 'C'
          },
          {
            title: 4,
            value: 'D'
          },
          {
            title: 5,
            value: 'E'
          },
          {
            title: 6,
            value: 'EA'
          },
        ],
        dtlFeeList: [],
        dtlFriList: [],
        billFeeText: '',
        allApplyFee: '',
        allPerFee: '',
        tabIndex: 0,
        providerList: [],
        exportApplyFrm: {
          applyStartTime: null,
          applyEndTime: null,
          cashNo: '',
          provId: '',
          cashStatus: '1'
        },
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          billType: '10',
          billNo: "",
          orderNo: "",
          pageSize: 10,
          pageNum: 1,
          billFee: '',
          allApplyFee: '',
          allPerFee: '',
        },
        activeName: 'allFee',
        allFeeData: {
          list: [],
          total: 0
        },
        feeProcessData: {
          list: [],
          total: 0
        },
        feeEndData: {
          list: [],
          total: 0
        },
        feeDtlData: {
          list: [],
          total: 0
        },
        friDtlData: {
          list: [],
          total: 0
        }
      };
    },
    mounted() {
      this.loadList();
      this.loadFeeProcess();
      this.loadProviderList();
      this.loadPlatFee()
    },
    methods: {
      loadPlatFee() {
        let scope = this
        getMethod('/backend/siteData/selectPlatFee', {}).then(res => {
          let platData = res.data
          scope.billFeeText = platData.platRebatedAmount
          scope.allApplyFee = platData.platUnRebated
          scope.allPerFee = platData.platAllRebate
        })
      },
      exportApplyCash() {
        let param = [];
        for (let key in this.exportApplyFrm) {
          if (null != this.exportApplyFrm[key]) {
            param.push(key + '=' + this.exportApplyFrm[key])
          }
        }
        //window.open(process.env.VUE_APP_BASE_API+'/backend/siteData/selectCashProcessExport?'+param.join('&'))

        var form = $('<form></form>').attr('action', process.env.VUE_APP_BASE_API +
          '/backend/siteData/selectCashProcessExport').attr('method', 'post');
        for (let key in this.exportApplyFrm) {
          if (null != this.exportApplyFrm[key]) {
            param.push(key + '=' + this.exportApplyFrm[key])
            form.append($('<input/>').attr('type', 'hidden').attr('name', key).attr('value', this.exportApplyFrm[key]));
          }
        }
        form.appendTo('body').submit().remove();
      },
      loadProviderList() {
        let scope = this
        let param = {
          pageSize: 1000,
          pageNum: 0,
          providerName: ''
        }
        getMethod('/backend/lyProvider/findList', param).then(res => {
          scope.providerList = res.data
        })
      },
      backToAllFee() {
        this.allFeeDataShow = true
        this.allFeeDtlFee = false
        this.allFriDtlFee = false
        this.loadList();
        this.activeName = 'allFee'
        this.feeDtl_ = false
        this.friDtl_ = false
      },
      chkFeeDtl(row) {
        this.allFeeDataShow = false
        this.allFriDtlFee = false
        this.allFeeDtlFee = true
        this.loadFeeDtlList(row)
        this.activeName = 'feeDtl'
        this.feeDtl_ = true
      },
      chkFriDtl(row) {
        console.log(111111111111111111111)
        this.allFeeDataShow = false
        this.allFeeDtlFee = false
        this.allFriDtlFee = true
        this.loadFriDtlList(row)
        this.activeName = 'friDtl'
        this.friDtl_ = true
      },
      loadFriDtl() {
        let scope = this
        let param = this.searchParam
        postMethod("/backend/siteData/selectCashDtl", param).then(res => {
          scope.feeDtlData = res.data
        });
      },
      batchBill() {
        let selData = this.$refs.noBillData.selection
        let id = [];
        selData.forEach(data => {
          id.push(data.pkBillId)
        });
        this.billOrd(id.join(","))
      },
      singleBill(row) {
        this.billOrd(row.pkBillId)
      },
      billFeeCash(row) {
        let scope = this
        let param = {
          cashNo: row.cashNo
        }
        postMethod("/backend/siteData/billFee", param).then(res => {
          scope.loadFeeProcess()
          this.$message.alert("提现成功");
        });
      },
      dealCash(row) {
        let scope = this
        let param = {
          cashNo: row.cashNo,
          cashStatus: '2'
        }

        this.$confirm("是否通过提现请求?", "提示", {
          confirmButtonText: "通过",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          postMethod("/backend/siteData/billFee", param).then(res => {
            scope.loadFeeProcess()
            scope.loadPlatFee()
            this.$message.alert("提现成功");
          });
        });

      },
      handleClick(tab, event) {
        console.log(tab.index)
        this.tabIndex = tab.index
        if (tab.index == 0) {
          this.loadList();
          this.feeDtl_ = false
          this.friDtl_ = false
        } else if (tab.index == 1) {
          this.loadFeeProcess();
          this.feeDtl_ = false
          this.friDtl_ = false
        } else if (tab.index == 2) {
          this.loadFeeEnd();
          this.feeDtl_ = false
          this.friDtl_ = false
        } else if (tab.index == 3) {
          this.searchParam.provId = ''
          this.loadFeeDtl();
        } else {
          this.loadFriDtl();
        }

      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        getMethod("/backend/siteData/selectAllCash", param).then(res => {
          console.log(res)
          // let re = "";
          // this.types.forEach(e => {
          //   if (e.title ==res.data.provLevel) {
          //     re = e.value;
          //   }
          // });
          scope.allFeeData = res.data
        });
      },
      currentAllFeePage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadList()
      },
      loadFeeProcess() {
        let scope = this
        let param = this.searchParam
        param.cashStatus = 1
        postMethod("/backend/siteData/selectCashProcess", param).then(res => {
          scope.feeProcessData = res.data
        });
      },
      currentProcessPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadFeeProcess()
      },
      loadFeeEnd() {
        let scope = this
        let param = this.searchParam
        param.cashStatus = 2
        postMethod("/backend/siteData/selectCashProcess", param).then(res => {
          scope.feeEndData = res.data
        });
      },
      currentEndPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadFeeEnd()
      },
      loadFeeDtlList(row) {
        let scope = this
        let param = {
          provId: row.provId
        }
        postMethod("/backend/siteData/selectCashDtl", param).then(res => {
          scope.dtlFeeList = res.data.list
        });
      },
      loadFriDtlList(row) {
        let scope = this
        let param = {
          provId: row.provId
        }
        postMethod("/backend/siteData/selectFriDtl", param).then(res => {
          scope.dtlFriList = res.data.list
        });
      },
      loadFeeDtl() {
        let scope = this
        let param = this.searchParam
        postMethod("/backend/siteData/selectCashDtl", param).then(res => {
          scope.feeDtlData = res.data
        });
      },
      currentFeePage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadFeeDtl()
      },
      loadFriDtl() {
        let scope = this
        let param = this.searchParam
        postMethod("/backend/siteData/selectFriDtl", param).then(res => {
          scope.friDtlData = res.data
        });
      },
      currentFriPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadFriDtl()
      }
    }
  };
</script>
