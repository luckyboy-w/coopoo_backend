<template>
    <div>
      <el-button @click="backToList">返回列表</el-button>
      <table style="width: 100%">
        <tr>
            <th>配置名称</th>
            <th>规则类型</th>
            <th>规则</th>
            <th>配置描述</th>
        </tr>
        <tr style="height: 150px">
            <td>
                <div class="grid-content bg-purple">
                  靠谱豆商城购买时间
                </div>
            </td>
            <td>
                <div class="grid-content bg-purple-light">
                  <el-select placeholder="请输入选择" v-model="ruleType">
                    <el-option label="每周购买" value="1"></el-option>
                    <el-option label="每月购买" value="2"></el-option>
                    <el-option label="特殊规则" value="3"></el-option>
                  </el-select>
                </div>
            </td>
            <td style="width: 30%">
                <div class="grid-content bg-purple">
                  <template v-if="ruleType =='1'">
                    <el-checkbox-group  style="margin-top: 10px"v-if="ruleType =='1'" v-model="weekList">
                      <el-checkbox label="1">周一</el-checkbox>
                      <el-checkbox label="2">周二</el-checkbox>
                      <el-checkbox label="3">周三</el-checkbox>
                      <el-checkbox label="4">周四</el-checkbox>
                      <el-checkbox label="5">周五</el-checkbox>
                      <el-checkbox label="6">周六</el-checkbox>
                      <el-checkbox label="7">周日</el-checkbox>
                    </el-checkbox-group>
                    时间： <el-time-picker style="margin-top: 10px" v-model="startTime" placeholder="请选择开始时间" value-format="HH:mm:ss"></el-time-picker>
                    <el-time-picker style="margin-top: 10px" v-model="endTime" placeholder="请选择开始时间" value-format="HH:mm:ss"></el-time-picker>
                  </template>

                  <template v-if="ruleType =='2'">
                    <el-date-picker v-model="dayList"  type="dates" :picker-options="pkOP" textarea size="large" format="d" value-format="d"/>
                    时间：<el-time-picker style="margin-top: 10px" v-model="startTime" placeholder="请选择开始时间" value-format="HH:mm:ss"></el-time-picker>
                    <el-time-picker style="margin-top: 10px" v-model="endTime" placeholder="请选择结束" value-format="HH:mm:ss"></el-time-picker>
                  </template>

                  <template v-if="ruleType =='3'">
                    <el-radio v-model="lastMonday" label="1">每个月最后一周的周日</el-radio>
                  </template>
                </div>
            </td>
          <td>
              <div class="grid-content bg-purple-light">
                <el-input type="textarea" placeholder="请输入..." v-model="description"/>
              </div>
          </td>
        </tr>
      </table>
      <el-button @click="submit" :loading="loading" style="display:block;margin:10px auto 0" type="primary">提交</el-button>
    </div>
</template>

<script>
  import { postMethod } from '@/api/request'

  export default {
    name: "configuration",
    data() {
      return {
        pkOP: {
          onPick(minDate, maxDate) {}
        },
        loading: false,
        configName: '靠谱豆商城购买时间',
        ruleType: '1',
        startTime: null,
        endTime: null,
        weekList: [],
        lastMonday: '1',
        dayList: [],
        description: ''
      }
    },
    methods: {
      submit() {
        let configuration;

        if (this.ruleType == 1) {
          if (this.weekList.length == 0) {
            this.$message({
              message: "请勾选至少一个",
              type: "warning"
            });
            return;
          }

          if (!this.startTime) {
            this.$message({
              message: "请选择开始时间",
              type: "warning"
            });
            return;
          }

          if (!this.endTime) {
            this.$message({
              message: "请选择结束时间",
              type: "warning"
            });
            return;
          }

          const startDate = Date.parse('December 25, 2017 ' + this.startTime);
          const endDate = Date.parse('December 25, 2017 ' + this.endTime);

          if (endDate < startDate) {
            this.$message({
              message: "结束时间不能大于开始时间",
              type: "warning"
            });
            return;
          }

          configuration = {
            "ruleType": this.ruleType,
            "weekList": this.weekList,
            "startTime": this.startTime,
            "endTime": this.endTime,
            "description": this.description
          }
        }

        if (this.ruleType =='2') {
          if (this.dayList.length == 0) {
            this.$message({
              message: "请勾选至少一个",
              type: "warning"
            });
            return;
          }

          if (!this.startTime) {
            this.$message({
              message: "请选择开始时间",
              type: "warning"
            });
            return;
          }

          if (!this.endTime) {
            this.$message({
              message: "请选择结束时间",
              type: "warning"
            });
            return;
          }

          const startDate = Date.parse('December 25, 2017 ' + this.startTime);
          const endDate = Date.parse('December 25, 2017 ' + this.endTime);

          if (endDate < startDate) {
            this.$message({
              message: "结束时间不能大于开始时间",
              type: "warning"
            });
            return;
          }

          configuration = {
            "ruleType": this.ruleType,
            "dayList": this.dayList,
            "startTime": this.startTime,
            "endTime" : this.endTime,
            "description": this.description
          }
        }

        if (this.ruleType =='3') {
          configuration = {
            "ruleType": this.ruleType,
            "type": this.lastMonday,
            "description": this.description
          }
        }

        const configurationJson = JSON.stringify([{
          "id": "bean_mall_rule_config",
          "dataType": "bean_mall_rule_config",
          "title": "靠谱豆商城购买时间",
          "value": configuration
        }])

        let param = {
          paramJson: configurationJson
        }

        this.loading = true
        postMethod("/backend/lyConfig/update", param).then(res => {
          this.loading = false
          if (res.code != 200) {
            this.$message({
              message: res.message,
              type: 'warning'
            })
            return;
          }
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.backToList()
          }
        );
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
