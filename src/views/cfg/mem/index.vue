<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="会员费用">
        <el-input v-model="dataForm.memCash" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">添加</el-button>
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
      dataForm: {
        memCash: ""
      }
    };
  },
  methods: {
    changeContent(val){
      this.dataForm.content = val
    },
    loadData(){
      let param = {
        typeName:'bussCfg'
      }
      let scope = this
      getMethodNew("/config/findList", param).then(
        res => {
          let dataList = res.data
          for(let i = 0 ; i < dataList.length ; i++){
              let rowObj = dataList[i];
              scope.dataForm[rowObj.title] = rowObj.value
          }
          this.$refs['refEditor'].setContent(scope.dataForm['content'])
        }
      );
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          dataType:'memCash',
          title:'memCash',
          value: this.dataForm.memCash
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
