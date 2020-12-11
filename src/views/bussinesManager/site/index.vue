<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="数据类型">
        <el-select

            @change="switchData()"
            v-model="dataForm.infoType">
            <el-option
                key="helpInfo"
                value-key="helpInfo"
                label="帮助信息"
                value="helpInfo"
            ></el-option>
            <el-option
                key="aboutUs"
                value-key="aboutUs"
                label="关于我们"
                value="aboutUs"
            ></el-option>
            <el-option
                key="userProctal"
                value-key="userProctal"
                label="靠谱家用户协议"
                value="userProctal"
            ></el-option>
            <el-option
                key="memberRegister"
                value-key="memberRegister"
                label="会员注册协议"
                value="memberRegister"
            ></el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="内容">
        <qEditor
          :content="dataForm.infoContent"
          ref="refEditor"
          moduleName="detailContent"
          @changeContent="changeContent">
        </qEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">添加</el-button>
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
      dataForm: {
        infoType: "",
        infoContent: ""
      },
      dataInfo:{

      }
    };
  },
  methods: {
    switchData(){
      this.$refs.refEditor.richText = this.dataInfo[this.dataForm.infoType]
      this.dataForm.infoContent = this.dataInfo[this.dataForm.infoType]
    },
    changeContent(val){
      this.dataForm.infoContent = val
    },
    loadData(){
      let param = {
        typeName:'bussCfg'
      }
      let scope = this
      getMethod("/backend/siteInfo/findList", param).then(
        res => {
          let dataList = res.data
          for(let i = 0 ; i < dataList.length ; i++){
              let rowObj = dataList[i];
              scope.dataInfo[rowObj.infoType] = rowObj.infoContent
          }
        }
      );
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        postMethod("/backend/siteInfo/update", this.dataForm).then(
          res => {
            scope.typeList = res.data;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            scope.loadData()
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
