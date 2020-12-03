<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="月结算次数">
        <el-input-number v-model="dataForm.billCount" :min="1" :max="50" disabled="" label="月结算次数" />
      </el-form-item>
      <el-form-item label="结算日">
        <el-date-picker v-model="dataForm.billDate" type="dates" :picker-options="pkOP" textarea style="width:600px"
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
          billDate: "",
          billCount: ""
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
        let obj = this.dataForm.billDate
        let List = [] //定义空数组
        if (obj != null) {
        	for (let i = 0; i < obj.length; i++) {
        		List.push(this.format(obj[i])) //把天数添加到数组中
        	}
        	this.day = List.toString() //把数组转字符串 赋值给str
        	console.log(this.day, '123456789')
        	this.dataForm.billCount = this.dataForm.billDate.length;
        } else {
        	this.dataForm.billCount = 0
        }
        // if(this.dataForm.billDate.length > this.dataForm.billCount){
        //     this.$message({
        //       message: "月结算天数超出了结算次数",
        //       type: "warring"
        //     });
        //     this.dataForm.billDate = this.dataForm.billDate.slice(0,4)
        //     return ;
        // }

      },
      format(date) {
        const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        return day;
      },
      changeContent(val) {
        this.dataForm.content = val
      },
      loadData() {
        let param = {
          dataType: 'billCfg'
        }
        let scope = this
        getMethod("/backend/lyConfig/findList", param).then(
          res => {
            console.log(res.data)
            let dataList = res.data
            for (let i = 0; i < dataList.length; i++) {
            	let rowObj = dataList[i];
            	if (rowObj.title == 'billDate') {
            		console.log(rowObj)
            		let myDate = new Date();
            		let tYear = myDate.getFullYear();
            		let tMonth = myDate.getMonth() + 1;
            		console.log(tMonth)
            		console.log()
            		if (rowObj.value != "") {
            			this.dataForm.billDate = rowObj.value.split(",")
            			for (let j = 0; j < this.dataForm.billDate.length; j++) {
            				this.dataForm.billDate[j] = tYear + "-" + tMonth + "-" + this.dataForm.billDate[j]
            			}
            			this.dataForm.billCount = this.dataForm.billDate.length
            		}

            		// scope.dataForm[rowObj.title] = eval("("+rowObj.value+")");
            		// this.dataForm.billDate=
            		console.log(scope.dataForm[rowObj.title])
            	} else {
            		// this.dataForm.billCount=0
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
            dataType: 'billCfg',
            title: 'billDate',
            value: this.day
          });
          dataList.push({
            dataType: 'billCfg',
            title: 'billCount',
            value: this.dataForm.billCount
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
  .el-date-picker__header{
    display: none;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
