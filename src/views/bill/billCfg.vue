<template>
  <div v-loading="loading" class="update-form-panel">
    <el-form label-width="130px" style="display: flex;flex-wrap: nowrap;">
      <div style="font-size: 18px;font-weight: 600;width: 130px;text-align: right;">结算方式
        <el-tooltip content="次月生效" placement="top" effect="light">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        ：
      </div>
      <el-form-item label-width="15px">
        <el-radio v-model="currentSettleMethod" label="2">成本结算</el-radio>
        <el-radio v-model="currentSettleMethod" label="1">比例结算</el-radio>
      </el-form-item>
      <el-form-item label="下月生效:">
        {{nextSettleMethod==2?'成本结算':"比例结算"}}
      </el-form-item>
    </el-form>
    <el-form v-if="currentSettleMethod==2" label-width="130px" style="display: flex;flex-wrap: nowrap;">
      <div style="font-size: 18px;font-weight: 600;width: 130px;text-align: right;">平台服务比例：</div>
      <el-form-item label="供应商服务比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="supplierServiceRatio" />
      </el-form-item>
      <el-form-item label="门店服务比例">
        <el-input-number :max="100" :min="0" style="width:150px" placeholder="请输入" v-model="storeServiceRatio" />
      </el-form-item>
    </el-form>
    <el-button style="margin-left: 130px;" type="primary" @click="enterSettleMethod()">
      保存
    </el-button>

    <el-divider></el-divider>
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="供应商结算次数">
        <el-input-number v-model="dataForm.cash_supplier_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="供应商结算日">
        <!-- <el-date-picker v-model="dataForm.cash_supplier_date" type="dates" style="width:600px" size="large" format="dd"
          placeholder="选择一个或多个日期" @change="pickSupplierDate" /> -->
        <el-date-picker v-model="dataForm.cash_supplier_date" type="date" style="width:600px" size="large" format="dd"
          placeholder="请选择日期" @change="pickSupplierDate" />
      </el-form-item>
      <el-form-item label="门店结算次数">
        <el-input-number v-model="dataForm.cash_store_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="门店结算日">
        <!-- <el-date-picker v-model="dataForm.cash_store_date" type="dates" style="width:600px" size="large" format="dd"
          placeholder="选择一个或多个日期" @change="pickStoreDate" /> -->
        <el-date-picker v-model="dataForm.cash_store_date" type="date" style="width:600px" size="large" format="dd"
          placeholder="请选择日期" @change="pickStoreDate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form label-width="130px">
      <el-form-item label="手动结算日期">
        <el-date-picker v-model="monthDate" type="month" value-format="yyyy-MM" @change="pickMonthDate"
          :picker-options="pickerOptions" placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="monthSubmit">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    getUploadUrl,
    formatDate
  } from "@/api/request";
  import {
    isInteger
  } from "@/utils/validate"

  export default {
    components: {},
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        loading: false,

        supplierServiceRatio: '',
        storeServiceRatio: '',
        currentSettleMethod: '',
        nextSettleMethod: '',

        supplierDay: '',
        storeDay: '',
        monthDate: "",
        dataForm: {
          cash_store_count: "",
          cash_store_date: "",
          cash_supplier_count: "",
          cash_supplier_date: "",
        },
        pickerOptions: {
          disabledDate(time) {
            let t = new Date().getDate();
            return time.getTime() > Date.now();
          }
        },
      };
    },
    computed: {},
    mounted() {
      this.loadData()
      this.initSettlementMethod()
    },
    created() {},
    methods: {
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.currentSettleMethod = String(res.data.currentSettleMethod)
            this.nextSettleMethod = res.data.nextSettleMethod
            this.storeServiceRatio = res.data.storeServiceRatio
            this.supplierServiceRatio = res.data.supplierServiceRatio

          }
        );
      },
      enterSettleMethod() {
        getMethod("settlement/set-settle-method", {
          settleMethod: this.currentSettleMethod,
          storeServiceRatio: this.storeServiceRatio,
          supplierServiceRatio: this.supplierServiceRatio
        }).then(
          res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          this.initSettlementMethod()
          this.$forceUpdate()
          }
        );
      },
      pickMonthDate(val) {},
      monthSubmit() {
        if (this.monthDate == '' || !this.monthDate) {
          this.$message({
            message: "结算月份不能为空",
            type: "warning"
          });
          return false
        }
        getMethod("/settlement/manual-settlement?date=" + this.monthDate).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.monthDate = ''
          }
        );
      },
      pickSupplierDate(val) {
        if (val) {
          // this.dataForm.cash_supplier_count = val.length
          this.dataForm.cash_supplier_count = 1
        } else {
          this.dataForm.cash_supplier_count = 0
        }
      },
      pickStoreDate(val) {
        if (val) {
          // this.dataForm.cash_store_count = val.length
          this.dataForm.cash_store_count = 1
        } else {
          this.dataForm.cash_store_count = 0
        }


      },
      format(time) {
        let date = new Date(time)
        let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return day;
      },
      loadData() {
        let scope = this
        getMethod("/operate/get-config-info").then(
          res => {
            this.dataForm.cash_store_count = res.data.cash_store_count
            this.dataForm.cash_supplier_count = res.data.cash_supplier_count
            let myDate = new Date();
            let tYear = myDate.getFullYear();
            let tMonth = myDate.getMonth() + 1;
            if (res.data.cash_store_date == '') {
              this.dataForm.cash_store_date = ''
            } else {
              this.dataForm.cash_store_date = new Date(tYear + "-" + tMonth + "-" + res.data.cash_store_date)
              // this.dataForm.cash_store_date = res.data.cash_store_date.split(",")
              // for (let j = 0; j < this.dataForm.cash_store_date.length; j++) {
              //   this.dataForm.cash_store_date[j] = new Date(tYear + "-" + tMonth + "-" + this.dataForm
              //     .cash_store_date[j])
              // }
            }
            if (res.data.cash_supplier_date == '') {
              this.dataForm.cash_supplier_date = ''
            } else {
              this.dataForm.cash_supplier_date = new Date(tYear + "-" + tMonth + "-" + res.data.cash_supplier_date)
              // this.dataForm.cash_supplier_date = res.data.cash_supplier_date.split(",")
              // for (let j = 0; j < this.dataForm.cash_supplier_date.length; j++) {
              //   this.dataForm.cash_supplier_date[j] = new Date(tYear + "-" + tMonth + "-" + this.dataForm
              //     .cash_supplier_date[j])
              // }
            }
          }
        );
      },
      saveObject() {
        let param = {
          cash_store_count: this.dataForm.cash_store_count,
          cash_store_date: this.format(this.dataForm.cash_store_date),
          cash_supplier_count: this.dataForm.cash_supplier_count,
          cash_supplier_date: this.format(this.dataForm.cash_supplier_date),
        }
        this.loading = true
        postMethod("/operate/set-config", param).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.loading = false
            this.loadData()
          }
        );
      },
      // saveObject() {
      //   let supplierList = [] //定义空数组
      //   let storeList = [] //定义空数组
      //   if (this.dataForm.cash_supplier_date && this.dataForm.cash_supplier_date.length >= 1) {
      //     for (let i = 0; i < this.dataForm.cash_supplier_date.length; i++) {
      //       supplierList.push(this.format(this.dataForm.cash_supplier_date[i])) //把天数添加到数组中
      //     }
      //     this.supplierDay = supplierList.toString() //把数组转字符串 赋值给str
      //   }

      //   if (this.dataForm.cash_store_date && this.dataForm.cash_store_date.length >= 1) {
      //     for (let i = 0; i < this.dataForm.cash_store_date.length; i++) {
      //       storeList.push(this.format(this.dataForm.cash_store_date[i])) //把天数添加到数组中
      //     }
      //     this.storeDay = storeList.toString() //把数组转字符串 赋值给str
      //   }

      //   let param = {
      //     cash_store_count: this.dataForm.cash_store_count,
      //     cash_store_date: this.storeDay,
      //     cash_supplier_count: this.dataForm.cash_supplier_count,
      //     cash_supplier_date: this.supplierDay,
      //   }
      //   this.loading = true
      //   postMethod("/operate/set-config", param).then(
      //     res => {
      //       this.$message({
      //         message: "操作成功",
      //         type: "success"
      //       });
      //       this.loading = false
      //       this.loadData()
      //     }
      //   );
      // },
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 800px;
  }

  .el-date-picker__header {
    display: none;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
