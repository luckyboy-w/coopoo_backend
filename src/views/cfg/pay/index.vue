<template>
  <div style="padding:20px 10px">
    <div v-if="showCfgList">
      <el-table
          ref="mainTable"
          :data="list"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id">
          <el-table-column prop="title" label="支付方式名称" width="250px" />
          <el-table-column prop="value" label="支付方式描述" width="550px" />
          <el-table-column prop="enable" label="是否启用" width="150px" >
              <template  slot-scope="scope" >
                  {{scope.row.enable == '1'?'启用':'禁用'}}
              </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" width="200px" v-if="false">
              <template slot-scope="scope">
                  <div v-if="false">{{scope.row.id}}</div>
                  <el-button v-if="scope.enable != 1" type="text" size="small" @click.native.prevent="disablePay(scope.row)">启用</el-button>
                  <el-button v-if="scope.enable == 1" type="text" size="small" @click.native.prevent="enablePay(scope.row)">禁用</el-button>
                  <!-- <el-button type="text" size="small" @click.native.prevent="modityCfg(scope.row)">编辑</el-button> -->
              </template>
          </el-table-column>
      </el-table>
    </div>

    <el-form ref="dataForm" v-if="showAliCfg" :model="dataForm" label-width="120px">
      <el-form-item label="商戶号">
        <el-input v-model="dataForm.aliPid" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="商户ID">
        <el-input v-model="dataForm.aliAppId" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="APP私钥">
        <el-input v-model="dataForm.appPrivateKey" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="阿里公钥">
        <el-input v-model="dataForm.aliPublicKey" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAliCfg()">保存</el-button>
        <el-button type="normal" @click="backToList()">取消</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="dataForm" v-if="showWxCfg" :model="dataForm" label-width="120px">
      <el-form-item label="商戶号">
        <el-input v-model="dataForm.wxMhId" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="商户私钥">
        <el-input v-model="dataForm.wxAppSec" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="API私钥">
        <el-input v-model="dataForm.appkey" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAliCfg()">保存</el-button>
        <el-button type="normal" @click="backToList()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate"
import qEditor from "@/components/RichText/quill-editor"

export default {
  computed: {},
  components: { qEditor },
  mounted() {
    this.loadData()
  },
  created() {},
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      showCfgList:true,
      showAliCfg:false,
      showWxCfg:false,
      list:[],
      dataForm: {
        aliPid: "",
        aliAppId: "",
        appPrivateKey: "",
        aliPublicKey: "",
        wxMhId: "",
        wxAppSec: '',
        appkey: ""
      }
    };
  },
  methods: {
    backToList(){
        this.showCfgList = true
        this.showAliCfg = false
        this.showWxCfg = false
    },
    disablePay(row){

      let scope = this
      let param = {
        id:row.id,
        enable: '1'
      }
      postMethod("/backend/lyConfig/modity", param).then(res => {
          scope.loadData()
          this.$message({
              message: "操作成功",
              type: "success"
            });
      });
    },
    enablePay(row){

      let scope = this

      let param = {
        id:row.id,
        enable:'2'
      }
      postMethod("/backend/lyConfig/modity", param).then(res => {
          scope.loadData()
          this.$message({
            message: "操作成功",
            type: "success"
          });
      });
    },
    modityCfg(row){
      if(row.title == '支付宝(手机APP支付)'){
        this.showCfgList = false
        this.showAliCfg = true
        this.showWxCfg = false
      }else{
      this.showCfgList = false
        this.showAliCfg = false
        this.showWxCfg = true
      }
    },
    changeContent(val){
      this.dataForm.content = val
    },
    loadData(){
        let scope = this
        let param = {
          dataType:'pay_cfg'
        }
        getMethod("/backend/lyConfig/findList", param).then(res => {
          scope.list = res.data
        });

        param = {
          dataType:'payCfg'
        }
        getMethod("/backend/lyConfig/findList", param).then(res => {
          let cfgList = res.data
          for(let i = 0 ; i < cfgList.length ; i++){
            scope.dataForm[cfgList[i].title] = cfgList[i].value
          }
        });
    },
    saveAliCfg() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          dataType:'payCfg',
          title:'aliPid',
          value: this.dataForm.aliPid
        });
        dataList.push({
          dataType:'payCfg',
          title:'aliAppId',
          value: this.dataForm.aliAppId
        });
        dataList.push({
          dataType:'payCfg',
          title:'appPrivateKey',
          value: this.dataForm.appPrivateKey
        });
        dataList.push({
          dataType:'payCfg',
          title:'aliPublicKey',
          value: this.dataForm.aliPublicKey
        });
        let param = {
          paramJson:JSON.stringify(dataList)
        }
        postMethod("/backend/lyConfig/update", param).then(
          res => {
            scope.typeList = res.data;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          }
        );
      }
    },
    saveWxCfg() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          dataType:'payCfg',
          title:'wxMhId',
          value: this.dataForm.wxMhId
        });
        dataList.push({
          dataType:'payCfg',
          title:'wxAppSec',
          value: this.dataForm.wxAppSec
        });
        dataList.push({
          dataType:'payCfg',
          title:'appkey',
          value: this.dataForm.appkey
        });
        let param = {
          paramJson:JSON.stringify(dataList)
        }
        postMethod("/backend/lyConfig/update", param).then(
          res => {
            scope.typeList = res.data;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          }
        );
      }
    },
    validate() {
      return true;
    },
    cancelUpdate() {
      this.$emit("showListPanel", true);
    },
    submitUpdate() {
      this.saveObject();
    }
  }
};
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 800px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
