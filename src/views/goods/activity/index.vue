<template>
  <div>
    <div class="ly-container" v-if="showActivityList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>活动名称:</td>
            <td>
              <el-input v-model="searchParam.activityName" width="180px"></el-input>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">查询</el-button>
              <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新增</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel" v-loading="isLoading">
        <el-table ref="mainTable" :data="tableData.list" row-key="id"
                  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"
                  border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="frontImage" label="活动图片" width="200px">
            <template slot-scope="scope">
              <img style="width:100%;height: 70px" :src="scope.row.frontImage"/>
            </template>
          </el-table-column>
          <el-table-column prop="activityName" label="活动名称" width="200px"/>
          <el-table-column prop="activityType" label="活动类型" width="200px">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType == '1'">普通活动</span>
              <span v-if="scope.row.activityType == '2'">雷锋爆品</span>
            </template>
          </el-table-column>
          <el-table-column prop="frontImage" label="预热有效期" width="400px">
            <template slot-scope="scope">
              {{ scope.row.preheatStartTime | _formateDate}} 至 {{scope.row.preheatEndTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column prop="frontImage" label="活动有效期" width="400px">
            <template slot-scope="scope">
              {{ scope.row.startTime | _formateDate}} 至 {{scope.row.endTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="addOrEdit('edit', scope.row)">修改</el-button>
              <el-button type="text" size="small" @click.native.prevent="addGood(scope.row)">新增商品</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
                         @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowActivityDialog" v-if="isShowActivityDialog" @close="closeActivityDialog" width="30%">
      <el-form class="update-form-panel" ref="activityForm" :rules="activityFormRules" :model="activityForm" label-width="100px" style="width:80%">
        <el-form-item label="活动类型" prop="activityType">
          <el-select ref="select" v-model="activityForm.activityType" placeholder="请选择活动类型" :disabled="activityTypeDisable">
            <el-option label="请选择..." value="" />
            <el-option label="普通活动" value="1" />
            <el-option label="雷锋爆品" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="activityForm.activityName"/>
        </el-form-item>
        <el-form-item label="活动封面" prop="frontImage">
          <el-upload
            :action="uploadActivityFrontImageUrl"
            list-type="picture-card"
            :before-upload="beforeActivityFrontImageUpload"
            :on-success="handleActivityFrontImageSuccess"
            :class="{hide:hideActivityFrontImageUpload}"
            :file-list="uploadActivityFrontImageList"
            :on-remove="handleActivityFrontImageRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="预热有效期" prop="activityPreheatDateTimePeriod">
          <el-date-picker
            v-model="activityPreheatDateTimePeriod"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="activityPreheatDateTimeChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="preheatDateTimePickerOptions"
            :default-time="['00:00:00', '00:00:00']">
            style="width:80%"
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动有效期" prop="activityDateTimePeriod">
          <el-date-picker
            v-model="activityDateTimePeriod"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="activityDateTimeChange"
            :picker-options="startDateTimePickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '00:00:00']">
            style="width:80%"
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="closeActivityDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <goodsList v-if="showGoodList" :activityData="activityData" @hiddenGoodsList="hiddenGoodsList"></goodsList>
  </div>
</template>

<script>
import goodsList from "./goodsList";
import { getUploadUrl, postMethod, getMethod  } from "@/api/request";
import { formatDate } from "@/api/tools.js"

export default {
  filters: {
    _formateDate(time) {
      if (time == undefined) {
        return '';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  name:'',
  props:[''],
  data () {
    const validateFrontImage = (rule, value, callback) => {
      if (this.activityForm.frontImage === undefined || this.activityForm.frontImage === null || this.activityForm.frontImage === '') {
        callback(new Error('请上传活动封面'))
      } else {
        callback()
      }
    }
    const validateActivityDateTimePeriod = (rule, value, callback) => {
      if (this.activityDateTimePeriod === undefined || this.activityDateTimePeriod === null || this.activityDateTimePeriod === '') {
        callback(new Error('请选择活动有效期'))
      } else {
        callback()
      }
    }
    const validateActivityPreheatDateTimePeriod = (rule, value, callback) => {
      if (this.activityPreheatDateTimePeriod === undefined || this.activityPreheatDateTimePeriod === null || this.activityPreheatDateTimePeriod === '') {
        callback(new Error('请选择预热有效期'))
      } else {
        callback()
      }
    }

    const validateActivityType = (rule, value, callback) => {
      if (this.activityForm.activityType === undefined || this.activityForm.activityType === null || this.activityForm.activityType === '') {
        callback(new Error('选择活动类型'))
      } else {
        callback()
      }
    }
    return {
      isLoading: true,
      showActivityList: true,
      showGoodList: false,
      showPagination: false,
      isShowActivityDialog: false,
      hideActivityFrontImageUpload: false,
      uploadActivityFrontImageList: [],
      activityDateTimePeriod: null,
      activityPreheatDateTimePeriod: null,
      preheatDateTimePickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now()
        }
      },
      startDateTimePickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now()
        }
      },
      tableData: {
        list: []
      },
      activityFormRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur'}],
        activityType: [{ required: true, validator: validateActivityType, trigger: 'change'}],
        frontImage: [{ required: true, validator: validateFrontImage, trigger: "blur"}],
        activityDateTimePeriod: [{ required: true, validator: validateActivityDateTimePeriod}],
        activityPreheatDateTimePeriod: [{ required: true, validator: validateActivityPreheatDateTimePeriod}],
      },
      activityData: null,
      activityTypeDisable: false,
      uploadActivityFrontImageUrl: getUploadUrl(),
      activityForm: {
        activityType: ""
      },
      searchParam: {
        pageSize: 10,
        pageNum: 0
      }
    };
  },
  components: {goodsList},
  beforeMount() {},

  mounted() {
    this.loadList()
  },

  methods: {
    closeActivityDialog() {
      this.activityForm = {};
      this.hideActivityFrontImageUpload = false
      this.uploadActivityFrontImageList = []
      this.activityDateTimePeriod = null
      this.activityPreheatDateTimePeriod = null
      this.isShowActivityDialog = false
    },

    beforeActivityFrontImageUpload(file) {
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!fileTypeVerify) {
        this.$message.error("上传文件格式错误!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return fileTypeVerify && isLt2M;
    },

    handleActivityFrontImageSuccess(res, file) {
      this.hideActivityFrontImageUpload = true
      this.activityForm.frontImage = res.data.url
      this.clearValidate('activityDateTimePeriod')
      this.clearValidate('activityPreheatDateTimePeriod')
    },

    handleActivityFrontImageRemove() {
      this.activityForm.frontImage = ""
      this.hideActivityFrontImageUpload = false
    },

    activityDateTimeChange() {
      this.activityForm.startTime = this.activityDateTimePeriod[0]
      this.activityForm.endTime = this.activityDateTimePeriod[1]
    },

    activityPreheatDateTimeChange() {
      this.activityForm.preheatStartTime = this.activityPreheatDateTimePeriod[0]
      this.activityForm.preheatEndTime = this.activityPreheatDateTimePeriod[1]
    },

    search() {
      this.loadList();
    },

    addOrEdit (oper, activity) {
      this.activityTypeDisable = oper == "edit"
      if (oper == "edit") {
        this.activityForm = JSON.parse(JSON.stringify(activity))
        this.activityDateTimePeriod = [new Date(activity.startTime), new Date(activity.endTime)]
        this.activityPreheatDateTimePeriod = [new Date(activity.preheatStartTime), new Date(activity.preheatEndTime)]
        let imgObj = {url: activity.frontImage}
        this.uploadActivityFrontImageList.push(imgObj)
        this.hideActivityFrontImageUpload = true
        this.activityForm.activityType = activity.activityType + ""
        this.activityForm.startTime = formatDate(new Date(activity.startTime), 'yyyy-MM-dd hh:mm:ss')
        this.activityForm.endTime = formatDate(new Date(activity.endTime), 'yyyy-MM-dd hh:mm:ss')
        this.activityForm.preheatStartTime = formatDate(new Date(activity.preheatStartTime), 'yyyy-MM-dd hh:mm:ss')
        this.activityForm.preheatEndTime = formatDate(new Date(activity.preheatEndTime), 'yyyy-MM-dd hh:mm:ss')
        this.activityForm.createTime = formatDate(new Date(activity.createTime), 'yyyy-MM-dd hh:mm:ss')
      } else {
        this.activity = {};
      }
      this.isShowActivityDialog = true
    },

    addGood(row) {
      this.activityData = row
      this.showGoodList = true
      this.showActivityList = false
    },

    submit() {
      this.$refs.activityForm.validate(valid => {
        if (valid) {
          postMethod('/backend/goodActivity/save', this.activityForm).then(
            res => {
              if (res.code != 200) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
                return;
              }
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.closeActivityDialog()
              this.loadList()
            }
          )
        }
      })
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },

    loadList() {
      const scope = this;
      if (!scope.isLoading) {
        scope.isLoading = true
      }
      getMethod("/backend/goodActivity/findPage", this.searchParam).then(res => {
        scope.tableData = res.data;
        scope.isLoading = false
        scope.showPagination = scope.tableData.total == 0;
      });
    },

    hiddenGoodsList() {
      this.showGoodList = false
      this.showActivityList = true
    },

    clearValidate(field) {
      let _field = this.$refs['activityForm'].fields
      _field.map(i => {
        if (i.prop === field) {
          i.resetField()
          return false
        }
      })
    }

  },
}

</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      div {
        display: inline;
      }

      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }
  }
</style>

