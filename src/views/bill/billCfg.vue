<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="月结算次数">
        <el-input-number v-model="dataForm.billCount" :min="1" :max="50" disabled="" label="月结算次数"></el-input-number>
      </el-form-item>
      <el-form-item label="结算日期">
         <el-date-picker
            type="dates"
            v-model="dataForm.billDate"
            @change="pickCfgDate"
            :picker-options="pkOP"
            textarea
            style="width:600px"
            size="large"
            placeholder="选择一个或多个日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate"

export default {
  computed: {},
  components: {},
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
      pkOP:{
        onPick(minDate,maxDate){
        }
      },
      dataForm: {
        billDate: "",
        billCount: ""
      }
    };
  },
  methods: {
    pickCfgDate(){
        this.dataForm.billCount = this.dataForm.billDate.length;
        // if(this.dataForm.billDate.length > this.dataForm.billCount){
        //     this.$message({
        //       message: "月结算天数超出了结算次数",
        //       type: "warring"
        //     });
        //     this.dataForm.billDate = this.dataForm.billDate.slice(0,4)
        //     return ;
        // }
        
    },
    changeContent(val){
      this.dataForm.content = val
    },
    loadData(){
      let param = {
        typeName:'bussCfg'
      }
      let scope = this
      getMethod("/backend/lyConfig/findList", param).then(
        res => {
          let dataList = res.data
          for(let i = 0 ; i < dataList.length ; i++){
              let rowObj = dataList[i];
              if(rowObj.title == 'billDate'){
                scope.dataForm[rowObj.title] = eval("("+rowObj.value+")");
              }else{
                  scope.dataForm[rowObj.title] = rowObj.value
              }
              
          }
        }
      );
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          dataType:'billCfg',
          title:'billDate',
          value: this.dataForm.billDate
        });
        dataList.push({
          dataType:'billCfg',
          title:'billCount',
          value: this.dataForm.billCount
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
