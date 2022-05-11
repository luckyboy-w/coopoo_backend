<template>
  <div v-loading="loading" class="update-form-panel">
    <el-form label-width="180px">
      <el-form-item label="风险订单金额：">
        <el-input v-model="risk_order_amount" type="number" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject('1')">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form>
      <div style="display: flex;flex-wrap: nowrap;line-height: 36px;">
      <div style="font-size: 14px;font-weight: 600;width: 180px;text-align: right;color: #606266;">专属商城购买数
        <el-tooltip content="单个用户可先享后付订单数" placement="top" effect="light">
          <i class="el-icon-warning-outline">：</i>
        </el-tooltip>
      </div>
      <el-form-item label="" >
        <el-input style="width:280px" type="number" oninput="this.value=this.value.replace(/\D/g,'')" v-model="purchase_quantity" placeholder="请输入" clearable />
      </el-form-item>
      </div>
      <el-form-item label-width="180px">
        <el-button type="primary" @click="saveObject('2')">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-form label-width="180px">
      <el-form-item label="专属商城会员有效年限：">
        <el-input v-model="exclusive_validity_period" type="number" oninput="this.value=this.value.replace(/\D/g,'')" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject('3')">
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
        risk_order_amount:'',
        purchase_quantity:'',
        exclusive_validity_period:'',
      };
    },
    computed: {},
    mounted() {
      this.loadData()
    },
    created() {},
    methods: {
      loadData() {
        let scope = this
        getMethod("/operate/get-config-info").then(
          res => {
            this.risk_order_amount = res.data.risk_order_amount
            this.purchase_quantity = res.data.purchase_quantity
            this.exclusive_validity_period = res.data.exclusive_validity_period
          }
        );
      },

      saveObject(num) {
        let param={}
        if(num==1){
          param ={risk_order_amount:this.risk_order_amount}
        }
        if(num==2){
          param ={purchase_quantity:this.purchase_quantity}
        }
        if(num==3){
          param ={exclusive_validity_period:this.exclusive_validity_period}
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
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 500px;
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
