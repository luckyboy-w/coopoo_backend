<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="160px">
      <el-form-item label="平台端IM服务号">
        <el-input v-model="dataForm.hx_no" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="平台端客服昵称">
        <el-input v-model="dataForm.hx_skill_group" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="平台端H5客服配置ID">
        <el-input v-model="dataForm.hx_config_id" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import {
  getMethod as getMethodNew,
  postMethod as postMethodNew,
} from "@/api/request-new";
import { isInteger } from "@/utils/validate"


export default {
  computed: {},

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
      dataForm: {
        hx_no:'',
        hx_skill_group:'',
        hx_config_id:''
      }
    };
  },
  methods: {
    changeContent(val){
      this.dataForm.content = val
    },
    loadData(){
      let scope = this
      getMethodNew("/operate/get-config-info").then(
        res => {
          scope.dataForm={
            hx_no:res.data.hx_no,
            hx_skill_group:res.data.hx_skill_group,
            hx_config_id:res.data.hx_config_id
          }
        }
      );
    },
    saveObject() {
      let scope = this;
        postMethod("/operate/set-config", this.dataForm).then(
          res => {
            this.loadData()
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        );
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
