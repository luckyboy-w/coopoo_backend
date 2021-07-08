<template>
  <div v-loading="loading" class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm"  label-width="120px">
      <el-form-item label="供应商结算次数">
        <el-input-number v-model="dataForm.cash_supplier_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="供应商结算日">
        <el-date-picker v-model="dataForm.cash_supplier_date" type="dates" style="width:600px"
          size="large" format="dd" placeholder="选择一个或多个日期" @change="pickSupplierDate" />
      </el-form-item>
      <el-form-item label="门店结算次数">
        <el-input-number v-model="dataForm.cash_store_count" disabled label="月结算次数" />
      </el-form-item>
      <el-form-item label="门店结算日">
        <el-date-picker v-model="dataForm.cash_store_date" type="dates" style="width:600px"
          size="large" format="dd" placeholder="选择一个或多个日期" @change="pickStoreDate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">
          保存
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
        supplierDay: '',
        storeDay: '',
        dataForm: {
          cash_store_count: "",
          cash_store_date: "",
          cash_supplier_count: "",
          cash_supplier_date: "",
        }
      };
    },
    computed: {},
    mounted() {
      this.loadData()
    },
    created() {},
    methods: {
      pickSupplierDate() {
        let supplierObj = this.dataForm.cash_supplier_date
        let List = [] //定义空数组
        if (supplierObj != null) {
        	for (let i = 0; i < supplierObj.length; i++) {
        		List.push(this.format(supplierObj[i])) //把天数添加到数组中
        	}
          console.log(List);
        	this.supplierDay = List.toString() //把数组转字符串 赋值给str
          this.dataForm.cash_supplier_count=this.dataForm.cash_supplier_date.length
        } else {
        	this.dataForm.cash_supplier_count = 0
        }
      },
      pickStoreDate() {
        let storeObj = this.dataForm.cash_store_date
        let List = [] //定义空数组
        if (storeObj != null) {
        	for (let i = 0; i < storeObj.length; i++) {
        		List.push(this.format(storeObj[i])) //把天数添加到数组中
        	}
        	this.storeDay = List.toString() //把数组转字符串 赋值给str
          this.dataForm.cash_store_count=this.dataForm.cash_store_date.length
        } else {
        	this.dataForm.cash_store_count = 0
        }
      },
      format(time) {
        console.log(time,'time')
        let date =new Date(time)
        let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return day;
      },
      loadData() {
        let scope = this
        getMethod("/operate/get-config-info").then(
          res => {
            console.log(res);
            this.dataForm.cash_store_count=res.data.cash_store_count
            this.dataForm.cash_supplier_count=res.data.cash_supplier_count
            		let myDate = new Date();
            		let tYear = myDate.getFullYear();
            		let tMonth = myDate.getMonth() + 1;
                if (res.data.cash_store_date=='') {
                  this.dataForm.cash_store_date =''
                } else{
                  this.dataForm.cash_store_date = res.data.cash_store_date.split(",")
            			for (let j = 0; j < this.dataForm.cash_store_date.length; j++) {
            				this.dataForm.cash_store_date[j] = tYear + "-" + tMonth + "-" + this.dataForm.cash_store_date[j]
            			}
                }
            		if (res.data.cash_supplier_date=='') {
            		  this.dataForm.cash_supplier_date = ''
            		} else{
            		  this.dataForm.cash_supplier_date = res.data.cash_supplier_date.split(",")
                  for (let j = 0; j < this.dataForm.cash_supplier_date.length; j++) {
                  	this.dataForm.cash_supplier_date[j] = tYear + "-" + tMonth + "-" + this.dataForm.cash_supplier_date[j]
                  }
            		}
          }
        );
      },
      saveObject() {
        console.log(this.dataForm,this.supplierDay,this.storeDay)
        if (this.supplierDay==''&&this.dataForm.cash_supplier_date!='') {
          console.log(this.dataForm.cash_supplier_date)
          this.pickSupplierDate()
        }
        if (this.storeDay==''&&this.dataForm.cash_store_date!='') {
          console.log(this.dataForm.cash_store_date)
          this.pickStoreDate()
        }
          let scope = this;
          this.dataForm.cash_store_date=this.storeDay
          this.dataForm.cash_supplier_date=this.supplierDay
          console.log(this.dataForm)
          this.loading=true
          postMethod("/operate/set-config", this.dataForm).then(
            res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.loading=false
              this.loadData()
            }
          );
      },
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 800px;
  }
  .el-date-picker__header{
    display: none;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
