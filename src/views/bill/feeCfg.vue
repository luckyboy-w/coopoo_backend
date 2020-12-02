<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="月提现次数">
        <el-input-number v-model="dataForm.cashCount" :min="1" :max="50" disabled="" label="月提现次数" />
      </el-form-item>
      <el-form-item label="提现日期">
        <el-date-picker v-model="dataForm.cashDate" type="dates" :picker-options="pkOP" textarea style="width:600px"
          size="large" format="dd" placeholder="选择一个或多个日期" @change="pickCfgDate" />
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
    getUploadUrl
  } from "@/api/request";
  import {
    isInteger
  } from "@/utils/validate"
  import {
    formatDate
  } from "@/api/tools.js"
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
        pkOP: {
          onPick(minDate, maxDate) {}
        },
        day: '',
        dataForm: {
          cashDate: "",
          cashCount: ""
        }
      };
    },
    computed: {},
    mounted() {
      this.loadData()
    },
    created() {},
    methods: {
      pickCfgDate() {
        let obj = this.dataForm.cashDate
        let List = [] //定义空数组
        for (let i = 0; i < obj.length; i++) {
          List.push(this.format(obj[i])) //把天数添加到数组中
        }
        this.day = List.toString() //把数组转字符串 赋值给str
        console.log(this.day, '123456789')
        this.dataForm.cashCount = this.dataForm.cashDate.length;
      },
      // changeContent(val){

      //   console.log(val)
      //   this.dataForm.content = val
      // },
      format(date) {
        // const year = date.getFullYear();
        // const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        // const hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
        // const minute = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
        // const second = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
        return day;
      },

      loadData() {
        let param = {
          typeName: 'cashCfg'
        }
        let scope = this
        getMethod("/backend/lyConfig/findList", param).then(
          res => {
            let dataList = res.data
            for (let i = 0; i < dataList.length; i++) {
              let rowObj = dataList[i];
              if (rowObj.title == 'cashDate') {
                scope.dataForm[rowObj.title] = eval("(" + rowObj.value + ")");
              } else {
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
            dataType: 'cashCfg',
            title: 'cashDate',
            value: this.day
          });
          dataList.push({
            dataType: 'cashCfg',
            title: 'cashCount',
            value: this.dataForm.cashCount
          });
          let param = {
            paramJson: JSON.stringify(dataList)
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
