<template>
  <div>
    <div class="ly-container" v-if="showActivityList">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>活动名称：</div>
          <div>
            <el-input v-model="searchParam.name" placeholder="请输入" width="180px" />
          </div>
        </div>
      <!--  <div class="tabTd">
          <div>活动有效期：</div>
          <div>
            <el-date-picker v-model="searchParam.activityStartTime" value-format="yyyy-MM-dd HH:mm:ss" type="date"
                              placeholder="选择开始日期"
              /> &nbsp;&nbsp;至&nbsp;&nbsp;
              <el-date-picker v-model="searchParam.activityEndTime" value-format="yyyy-MM-dd HH:mm:ss" type="date"
                              placeholder="选择结束日期"
              />
          </div>
        </div> -->
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">查询</el-button>
          <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新增</el-button>
        </div>
      </div>
      <div class="ly-table-panel" v-loading="isLoading">
        <el-table ref="mainTable" :data="tableData.list" row-key="id"
                  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"
                  border :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <!-- <el-table-column prop="frontImage" label="活动图片" width="200px">
            <template slot-scope="scope">
              <img style="width:100%;height: 70px" :src="scope.row.frontImage"/>
            </template>
          </el-table-column> -->
          <el-table-column prop="activityName" label="活动名称" width="200px"/>
          <el-table-column prop="activityType" label="活动类型" width="200px">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType == '1'">限时抢购</span>
            </template>
          </el-table-column>
          <el-table-column prop="frontImage" label="预热开始时间" width="350px">
            <template slot-scope="scope">
              {{ scope.row.preheatStartTime?scope.row.preheatStartTime:'暂无预热时间' }}
            </template>
          </el-table-column>
          <el-table-column prop="frontImage" label="活动有效期" width="350px">
            <template slot-scope="scope">
              {{ scope.row.startTime | _formateDate }} 至 {{ scope.row.endTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="addOrEdit('edit', scope.row)">修改</el-button>
              <el-button type="text" size="small" @click.native.prevent="addGood(scope.row)">管理商品</el-button>

            </template>
          </el-table-column>
        </el-table>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
                         @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" :current-page="searchParam.pageNum"
          />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowActivityDialog" v-if="isShowActivityDialog" @close="closeActivityDialog"
               width="40%"
    >
      <el-form class="update-form-panel" ref="activityForm" :rules="activityFormRules" :model="activityForm"
               label-width="100px" style="width:80%"
      >
        <el-form-item label="活动类型">
          <el-select ref="select" v-model="activityForm.activityType" placeholder="请选择活动类型"
                     :disabled="activityTypeDisable"
          >
            <el-option label="限时抢购" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="activityForm.activityName"/>
        </el-form-item>
       <!-- <el-form-item label="活动标签" prop="frontImage">
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
            <div slot="tip" class="el-upload__tip">推荐图片尺寸: 120 * 40</div>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="预热时间" prop="preheatStartTime">
          <el-radio-group @change="selectPreheat" style="display: flex;align-items: center;" v-model="radio" size="small">
            <el-radio label="1" style="display: flex;align-items: center;">
            <el-date-picker
            v-model="activityForm.preheatStartTime"
            type="datetime"
            :disabled="selectPreheatDisabled"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择预热开始时间"
          >
          </el-date-picker>&nbsp;&nbsp;开始预热
           </el-radio>
            <el-radio label="2">不进行预热</el-radio>
         </el-radio-group>



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
            :default-time="['00:00:00', '00:00:00']"
          >
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
    <save v-if="showSave" :activity="activity" @hiddenSave="hiddenSave()"></save>
  </div>
</template>

<script>
  import save from "./save";
import goodsList from "./goodsList";
import {getUploadUrl, postMethod, getMethod} from "@/api/request";
import {formatDate} from "@/api/tools.js"

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
  name: '',
  props: [''],
  data() {
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
    const validateActivityType = (rule, value, callback) => {
      if (this.activityForm.activityType === undefined || this.activityForm.activityType === null || this.activityForm.activityType === '') {
        callback(new Error('选择活动类型'))
      } else {
        callback()
      }
    }
    return {
      isLoading: true,
      showSave: false,
      showActivityList: true,
      showGoodList: false,
      showPagination: false,
      isShowActivityDialog: false,
      hideActivityFrontImageUpload: false,
      // uploadActivityFrontImageList: [],
      activityDateTimePeriod: null,
      startDateTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      tableData: {
        list: []
      },
      activityFormRules: {
        activityName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        activityType: [{required: true, validator: validateActivityType, trigger: 'change'}],
        // frontImage: [{required: true, validator: validateFrontImage, trigger: "blur"}],
        activityDateTimePeriod: [{required: true, validator: validateActivityDateTimePeriod}],
      },
      radio:'2',
      selectPreheatDisabled:true,
      activityData: null,
      activityTypeDisable: false,
      // uploadActivityFrontImageUrl: getUploadUrl(),
      activityForm: {
        activityType:1,
        preheatStartTime:'',
        activityName:'',
        endTime:'',
        startTime:''
      },
      searchParam: {
        name:'',
        pageSize: 10,
        pageNum: 1
      },
      activity:null,
      oper:''
    };
  },
  components: {goodsList,save},
  beforeMount() {
  },

  mounted() {
    this.loadList()
  },

  methods: {
    closeActivityDialog() {
      this.activityForm = {};
      this.activityForm.activityType=1
      // this.hideActivityFrontImageUpload = false
      // this.uploadActivityFrontImageList = []
      this.activityDateTimePeriod = null
      this.activityPreheatDateTimePeriod = null
      this.isShowActivityDialog = false
    },
    selectPreheat(val){
      console.log(val)
      if (val==2) {
        this.selectPreheatDisabled=true
        this.activityForm.preheatStartTime=''
      }else{
        this.selectPreheatDisabled=false
        this.activityForm.preheatStartTime=''
      }
    },
    // beforeActivityFrontImageUpload(file) {
    //   const fileTypeVerify =
    //     file.type === 'image/jpeg' ||
    //     file.type === 'image/png' ||
    //     file.type === 'image/jpg'
    //   const isLt2M = file.size / 1024 / 1024 < 5;

    //   if (!fileTypeVerify) {
    //     this.$message.error("上传文件格式错误!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传文件大小不能超过 5MB!");
    //   }
    //   return fileTypeVerify && isLt2M;
    // },

    // handleActivityFrontImageSuccess(res, file) {
    //   this.hideActivityFrontImageUpload = true
    //   this.activityForm.frontImage = res.data.url
    //   this.clearValidate('activityDateTimePeriod')
    //   this.clearValidate('activityPreheatDateTimePeriod')
    // },

    // handleActivityFrontImageRemove() {
    //   this.activityForm.frontImage = ""
    //   this.hideActivityFrontImageUpload = false
    // },

    activityDateTimeChange() {
      this.activityForm.startTime = this.activityDateTimePeriod[0]
      this.activityForm.endTime = this.activityDateTimePeriod[1]
    },

    search() {
      this.loadList();
    },

    addOrEdit(oper, activity) {
      this.oper=oper
      this.activityTypeDisable = oper == "edit"
      if (oper == "edit") {
        this.activityForm = JSON.parse(JSON.stringify(activity))
        this.activityDateTimePeriod = [new Date(activity.startTime), new Date(activity.endTime)]
        // let imgObj = {url: activity.frontImage}
        // this.uploadActivityFrontImageList.push(imgObj)
        // this.hideActivityFrontImageUpload = true
        this.activityForm.activityType = activity.activityType
        this.activityForm.startTime = formatDate(new Date(activity.startTime), 'yyyy-MM-dd hh:mm:ss')
        this.activityForm.endTime = formatDate(new Date(activity.endTime), 'yyyy-MM-dd hh:mm:ss')
        if (!this.activityForm.preheatStartTime||this.activityForm.preheatStartTime=='') {
          this.selectPreheatDisabled=true
          this.activityForm.preheatStartTime =''
          this.radio="2"
        } else{
          this.selectPreheatDisabled=false
          this.radio="1"
          this.activityForm.preheatStartTime = formatDate(new Date(activity.preheatStartTime), 'yyyy-MM-dd hh:mm:ss')
        }
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
          delete this.activityForm.createTime
          postMethod('/activity/addOrUpdate', this.activityForm).then(
            res => {
              if (res.errCode != 0) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
                return;
              }
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              if (this.oper=='add') {
              this.activity=res.data
              this.closeActivityDialog()
              this.showActivityList = false
              this.showSave=true
              } else{
                this.closeActivityDialog()
                this.loadList()
              }
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
      postMethod("/activity/list", this.searchParam).then(res => {
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
        scope.isLoading = false
        scope.showPagination = scope.tableData.total == 0;
      });
    },

    hiddenGoodsList() {
      this.showGoodList = false
      this.showActivityList = true
      this.loadList();
    },
    hiddenSave(){
      this.showSave = false
      this.showActivityList = true
      this.loadList();
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
 .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
