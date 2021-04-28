<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="140px">
      <el-form-item label="平台端环信账号">
        <el-input v-model="dataForm.platHxNo" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="平台端技能组名称">
        <el-input v-model="dataForm.platHxSkillGrp" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="平台端H5客服配置ID">
        <el-input v-model="dataForm.platHxConfigId" style="width:260px"></el-input>
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
        platHxNo:'',
        platHxSkillGrp:'',
        platHxConfigId:''
      }
    };
  },
  methods: {
    changeContent(val){
      this.dataForm.content = val
    },
    loadData(){
      let param = {
        typeName:'platHxNo'
      }
      let scope = this
      getMethodNew("/config/findList", param).then(
        res => {
          let dataList = res.data
          for(let i = 0 ; i < dataList.length ; i++){
              let rowObj = dataList[i];
              scope.dataForm[rowObj.title] = rowObj.value
          }
        }
      );
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          dataType:'platHxNo',
          title:'platHxNo',
          value: this.dataForm.platHxNo
        });

        dataList.push({
          dataType:'platHxNo',
          title:'platHxConfigId',
          value: this.dataForm.platHxConfigId
        });

        dataList.push({
          dataType:'platHxNo',
          title:'platHxSkillGrp',
          value: this.dataForm.platHxSkillGrp
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
