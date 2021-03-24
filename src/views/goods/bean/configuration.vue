<template>
    <div>
      <el-button @click="backToList">返回列表</el-button>
<!--      <el-table :data="configuration" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
        <el-table-column prop="configName" label="配置名称"></el-table-column>
        <el-table-column prop="id" label="规则类型">
          <template slot-scope="scope">
            <el-select placeholder="请输入选择" v-model="scope.row.ruleType">
              <el-option label="每周购买" value="1"></el-option>
              <el-option label="每月购买" value="2"></el-option>
              <el-option label="特殊规则" value="3"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="id">
          <el-date-picker  type="dates" :picker-options="pkOP" textarea style="width:600px"
                          size="large" format="dd" />

        </el-table-column>
        <el-table-column prop="description" label="配置描述">
          <template slot-scope="scope">
            <el-input type="textarea" placeholder="请输入..." v-model="scope.row.description"/>
          </template>
        </el-table-column>
      </el-table>-->

      <table style="width: 100%">
        <tr>
            <th>配置名称</th>
            <th>规则类型</th>
            <th>规则</th>
            <th>配置描述</th>
        </tr>
        <tr>
            <td>
                <div class="grid-content bg-purple">
                  靠谱豆商城购买时间
                </div>
            </td>
            <td>
                <div class="grid-content bg-purple-light">
                  <el-select placeholder="请输入选择" v-model="configuration.ruleType">
                    <el-option label="每周购买" value="1"></el-option>
                    <el-option label="每月购买" value="2"></el-option>
                    <el-option label="特殊规则" value="3"></el-option>
                  </el-select>
                </div>
            </td>
            <td>
                <div class="grid-content bg-purple">
                  <el-date-picker v-model="configuration.billDate"  type="dates" :picker-options="pkOP" textarea size="large" format="dd" />
                </div>
            </td>
          <td>
              <div class="grid-content bg-purple-light">
                <el-input type="textarea" placeholder="请输入..." v-model="configuration.description"/>
              </div>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
  export default {
    name: "configuration",
    data() {
      return {
        day: "",
        pkOP: {
          onPick(minDate, maxDate) {}
        },
        configuration: {
          configName: '靠谱豆商城购买时间',
          ruleType: '1',
          ruleDetail: [],
          billCount: [],
          description: ''
        }
      }
    },
    methods: {
      pickCfgDate() {
        let obj = this.configuration.ruleDetail
        let List = [] //定义空数组
        if (obj != null) {
          for (let i = 0; i < obj.length; i++) {
            List.push(this.format(obj[i])) //把天数添加到数组中
          }
          this.day = List.toString() //把数组转字符串 赋值给str
          this.configuration.billCount = this.configuration.ruleDetail.length;
        } else {
          this.configuration.billCount = 0
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

      backToList() {
        this.$emit('showListPanel', true)
      },

    }
  }
</script>

<style scoped>
 table {
   border: 1px solid #dfe6ec;
   border-collapse: collapse;
   color: #606266;
   vertical-align: middle;
   text-align:center;
 }

 table th, td{
   height: 50px;
   border-right: 1px   solid #dfe6ec;
   border-bottom: 1px   solid #dfe6ec;
 }

/* th, td {
   border: 1px solid gray;
 }*/

</style>
