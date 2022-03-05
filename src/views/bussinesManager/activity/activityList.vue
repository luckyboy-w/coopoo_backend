<template>
  <div>
    <div class="ly-container" v-if="showActivityList">
      <div class="ly-tool-panel">
        <el-button style="margin-bottom: 10px" @click="backToTypeList()" type="primary" icon="el-icon-back">返回</el-button>
      </div>
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>活动名称：</div>
          <div>
            <el-input v-model="searchParam.name" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">查询</el-button>
          <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新增</el-button>
          <el-button plain type="primary" v-if="activityForm.activityType==2" @click="firstActive()" icon="el-icon-document-add">活动配置</el-button>
        </div>
      </div>
      <div class="ly-table-panel" v-loading="isLoading">
        <el-table ref="mainTable" :data="tableData.list" row-key="id" :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <!-- <el-table-column prop="frontImage" label="活动图片" width="200px">
            <template slot-scope="scope">
              <img style="width:100%;height: 70px" :src="scope.row.frontImage"/>
            </template>
          </el-table-column> -->
          <el-table-column prop="activityName" label="活动名称" width="200px" />
          <el-table-column prop="activityType" label="活动类型" width="200px">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType == '1'">限时抢购</span>
              <span v-if="scope.row.activityType == '2'">新人礼</span>
              <span v-if="scope.row.activityType == '3'">注册送优惠券</span>
              <span v-if="scope.row.activityType == '4'">买vip送优惠券</span>
              <span v-if="scope.row.activityType == '6'">砍价</span>
              <span v-if="scope.row.activityType == '5'">拼团</span>
            </template>
          </el-table-column>
          <el-table-column label="预热开始时间" width="230px">
            <template slot-scope="scope">
              {{ scope.row.preheatStartTime?scope.row.preheatStartTime:'暂无预热时间' }}
            </template>
          </el-table-column>
          <el-table-column label="活动有效期" width="350px">
            <template slot-scope="scope">
              <span v-if="scope.row.isPermanent == '0'">{{ scope.row.startTime | _formateDate }} 至
                {{ scope.row.endTime | _formateDate }}</span>
              <span v-if="scope.row.isPermanent == '1'">永久有效</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="250px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrEdit('edit', scope.row)">修改</el-button>
              <el-button type="text" size="small" @click.native.prevent="addGood(scope.row)">管理商品</el-button>
              <el-button v-if="scope.row.enable==1" @click="enable('1',scope.row)" type="text" size="small">禁用
              </el-button>
              <el-button v-if="scope.row.enable==0" @click="enable('0',scope.row)" type="text" size="small">启用
              </el-button>
              <el-button v-if="scope.row.activityType==5||scope.row.activityType==6" @click="participate(scope.row)" type="text" size="small">参与记录
              </el-button>
              <el-button v-if="scope.row.activityType==2" @click="htmlShow(scope.row)" type="text" size="small">H5链接
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage"
            :current-page="searchParam.pageNum" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowActivityDialog" v-if="isShowActivityDialog" @close="closeActivityDialog"
      width="80%">
      <el-form class="update-form-panel" ref="activityForm" :rules="activityFormRules" :model="activityForm"
        label-width="100px" style="width:80%">
        <el-form-item label="活动类型">
          <el-select ref="select" @change="change($event)" v-model="activityForm.activityType" placeholder="请选择活动类型"
            :disabled="true">
            <el-option label="限时抢购" :value="1" />
            <el-option label="新人礼" :value="2" />
            <el-option label="注册送优惠券" :value="3" />
            <el-option label="买vip送优惠券" :value="4" />
            <el-option label="砍价" :value="6" />
            <el-option label="拼团" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="activityForm.activityName" />
        </el-form-item>
        <el-form-item label="预热时间" v-if="activityForm.activityType==1" prop="preheatStartTime">
          <el-radio-group @change="selectPreheat" style="display: flex;align-items: center;" v-model="radio"
            size="small">
            <el-radio label="1" style="display: flex;align-items: center;">
              <el-date-picker v-model="activityForm.preheatStartTime" type="datetime" :disabled="selectPreheatDisabled"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择预热开始时间">
              </el-date-picker>&nbsp;&nbsp;开始预热
            </el-radio>
            <el-radio label="2">不进行预热</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="activityForm.activityType==1||activityForm.activityType==5||activityForm.activityType==6" label="活动有效期" prop="activityDateTimePeriod">
          <el-date-picker v-model="activityDateTimePeriod" type="datetimerange" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="activityDateTimeChange" :picker-options="startDateTimePickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '00:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="activityForm.activityType==2||activityForm.activityType==3||activityForm.activityType==4"
          label="活动有效期" prop="activityDateTimePeriod">
          <el-radio-group @change="selectRange" style="display: flex;align-items: center;" v-model="radio_"
            size="small">
            <el-radio label="1" style="display: flex;align-items: center;">
              <el-date-picker v-model="activityDateTimePeriod" type="datetimerange" start-placeholder="开始日期"
                :disabled="selectRangeDisabled" end-placeholder="结束日期" @change="activityDateTimeChange"
                :picker-options="startDateTimePickerOptions" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '00:00:00']">
              </el-date-picker>
            </el-radio>
            <el-radio v-if="activityForm.activityType==2||activityForm.activityType==3||activityForm.activityType==4"
              label="2">永久有效期</el-radio>
          </el-radio-group>


        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="subDisabled" @click="submit()">提交</el-button>
          <el-button @click="closeActivityDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="新人礼限购" width="400px" :visible="isShowQuotaDialog" v-if="isShowQuotaDialog"
      :before-close="handleClose">
      <el-form>
        <el-form-item label="新人礼限购:" label-width="90px">
          <el-input placeholder="请输入限购数" type="number" v-model="activity_new_user_purchase_limit">
          </el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button type="primary" @click="enterQuota()">确认</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="H5链接" width="600px" :visible="isShowHtmlDialog" v-if="isShowHtmlDialog"
      :before-close="handleCloseHtml">
      <el-form>
        <el-form-item label="H5链接:" label-width="80px">
          <el-input placeholder="请输入链接" v-model="htmlUrl">
          </el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button type="primary" @click="enterHtml()">确认</el-button>
          <el-button plain type="primary" @click="handleCloseHtml">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <goodsList v-if="showGoodList" :activityData="activityData" @hiddenGoodsList="hiddenGoodsList"></goodsList>
    <editGood v-if="showSaveGood" :activity="activity" @hiddenSaveGood="hiddenSaveGood()"></editGood>

    <couponsList v-if="showCouponList" :activityData="activityData" @hiddenCouponsList="hiddenCouponsList">
    </couponsList>
    <editCoupon v-if="showSaveCoupon" :activity="activity" @hiddenSaveCoupon="hiddenSaveCoupon()"></editCoupon>

    <recordList v-if="showRecord" :rowData="rowData" @hiddenRecord="hiddenRecord()"></recordList>


  </div>
</template>

<script>
  import editGood from "./editGood";
  import goodsList from "./goodsList";
  import editCoupon from "./editCoupon";
  import couponsList from "./couponsList";
  import recordList from "./participateRecord";
  import {
    getUploadUrl,
    postMethod,
    getMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"

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
    props:{
      type:[String, Number]
    },
    data() {
      const validateActivityDateTimePeriod = (rule, value, callback) => {
        if (this.activityDateTimePeriod === undefined || this.activityDateTimePeriod === null || this
          .activityDateTimePeriod === '') {
          callback(new Error('请选择活动有效期'))
        } else {
          callback()
        }
      }
      const validateActivityType = (rule, value, callback) => {
        if (this.activityForm.activityType === undefined || this.activityForm.activityType === null || this
          .activityForm.activityType === '') {
          callback(new Error('选择活动类型'))
        } else {
          callback()
        }
      }
      return {
        isLoading: true,
        subDisabled: false,
        showSaveGood: false,
        showActivityList: true,
        showGoodList: false,

        showCouponList: false,
        showSaveCoupon: false,
        showRecord:false,
        showPagination: false,
        isShowActivityDialog: false,
        isShowQuotaDialog: false,
        isShowHtmlDialog: false,
        hideActivityFrontImageUpload: false,
        // uploadActivityFrontImageList: [],
        activityDateTimePeriod: null,
        startDateTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        tableData: {
          list: []
        },
        activityFormRules: {
          activityName: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }],
          activityType: [{
            required: true,
            validator: validateActivityType,
            trigger: 'change'
          }],
        },
        radio: '2',
        radio_: '1',
        selectPreheatDisabled: true,
        selectRangeDisabled: false,
        activityData: null,
        activityTypeDisable: false,
        // uploadActivityFrontImageUrl: getUploadUrl(),
        activityForm: {
          activityType: 1,
          preheatStartTime: '',
          activityName: '',
          endTime: '',
          startTime: ''
        },
        searchParam: {
          type:'',
          name: '',
          pageSize: 10,
          pageNum: 1
        },
        activity: null,
        activityType:'',
        rowData:null,
        oper: '',
        activity_new_user_purchase_limit: '',
        htmlUrl: '',
        htmlId: '',
      };
    },
    components: {
      goodsList,
      editGood,
      editCoupon,
      couponsList,
      recordList,
    },
    beforeMount() {},

    mounted() {
      console.log(this.type)
      this.activityForm.activityType=Number(this.type)
      this.searchParam.type=Number(this.type)
      this.loadList()
    },

    methods: {
      closeActivityDialog() {
        this.activityForm = {};
        this.activityForm.activityType=Number(this.type)
        this.activityDateTimePeriod = null
        this.activityPreheatDateTimePeriod = null
        this.isShowActivityDialog = false
      },
      selectPreheat(val) {
        if (val == 2) {
          this.selectPreheatDisabled = true
        } else if (val == 1) {
          this.selectPreheatDisabled = false
        }
        this.$set(this.activityForm, "preheatStartTime", '')
        // this.activityForm.preheatStartTime = ''
        this.$forceUpdate()
      },
      selectRange(val) {
        if (val == 2) {
          this.selectRangeDisabled = true
        } else {
          this.selectRangeDisabled = false
        }
        this.activityDateTimePeriod = null
        this.activityForm.endTime = ''
        this.activityForm.startTime = ''
      },
      firstActive() {
        getMethod('/operate/get-config-info').then(res => {
          this.isShowQuotaDialog = true
          this.activity_new_user_purchase_limit = res.data.activity_new_user_purchase_limit
        });
      },
      handleClose() {
        this.subDisabled = false
        this.isShowQuotaDialog = false
        this.activity_new_user_purchase_limit = ''
      },
      enterQuota() {
        postMethod('/operate/set-config', {
          activity_new_user_purchase_limit: this.activity_new_user_purchase_limit
        }).then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.handleClose();
        });
      },
      htmlShow(row) {
        this.htmlId = row.id
        getMethod('/activity/get-h5-url', {
          activityId: row.id
        }).then(res => {
          this.isShowHtmlDialog = true
          this.htmlUrl = res.data.url
        });
      },
      handleCloseHtml() {
        this.isShowHtmlDialog = false
        this.htmlUrl = ''
        this.htmlId = ''
      },
      enterHtml() {
        getMethod('/activity/update-h5-url', {
          id: this.htmlId,
          url: this.htmlUrl
        }).then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.handleCloseHtml();

        });
      },
      enable(val, row) {
        if (val == "1") {
          getMethod('/activity/disable', {
            id: row.id
          }).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.loadList();
          });
        } else if (val == "0") {
          getMethod('/activity/enable', {
            id: row.id,
            activityType: row.activityType,
          }).then(res => {
            this.$message({
              message: "启用成功",
              type: "success"
            });
            this.loadList();
          });
        }
      },
      change(val) {
        this.activityDateTimePeriod = null
        this.activityForm = {
            activityType: val,
            preheatStartTime: '',
            activityName: '',
            endTime: '',
            startTime: ''
          },
          this.$forceUpdate();
      },
      activityDateTimeChange() {
        this.activityForm.startTime = this.activityDateTimePeriod[0]
        this.activityForm.endTime = this.activityDateTimePeriod[1]
      },

      search() {
        this.searchParam.pageNum = 1;
        this.loadList();
      },

      addOrEdit(oper, activity) {
        this.oper = oper
        this.activityTypeDisable = oper == "edit"
        if (activity && activity.enable == 1) {
          this.subDisabled = true
        } else {
          this.subDisabled = false
        }
        if (oper == "edit") {
          this.activityForm = JSON.parse(JSON.stringify(activity))
          this.activityForm.activityType = activity.activityType
          if ((activity.activityType == 2||activity.activityType == 3||activity.activityType == 4) && activity.isPermanent == 1) {
            this.activityDateTimePeriod = null
            this.activityForm.startTime = ''
            this.activityForm.endTime = ''
            this.radio_ = "2"
            this.selectRangeDisabled = true
          } else if ((activity.activityType == 2||activity.activityType == 3||activity.activityType == 4) && activity.isPermanent == 0) {
            this.activityDateTimePeriod = [new Date(activity.startTime), new Date(activity.endTime)]
            this.activityForm.startTime = formatDate(new Date(activity.startTime), 'yyyy-MM-dd hh:mm:ss')
            this.activityForm.endTime = formatDate(new Date(activity.endTime), 'yyyy-MM-dd hh:mm:ss')
            this.radio_ = "1"
            this.selectRangeDisabled = false
          } else if (activity.activityType == 1) {
            this.activityDateTimePeriod = [new Date(activity.startTime), new Date(activity.endTime)]
            this.activityForm.startTime = formatDate(new Date(activity.startTime), 'yyyy-MM-dd hh:mm:ss')
            this.activityForm.endTime = formatDate(new Date(activity.endTime), 'yyyy-MM-dd hh:mm:ss')
          }else if (activity.activityType == 5||activity.activityType == 6) {
            // this.activityDateTimePeriod = [new Date(activity.startTime), new Date(activity.endTime)]
            this.activityForm.startTime = formatDate(new Date(activity.startTime), 'yyyy-MM-dd hh:mm:ss')
            this.activityForm.endTime = formatDate(new Date(activity.endTime), 'yyyy-MM-dd hh:mm:ss')
          }
          if (!this.activityForm.preheatStartTime || this.activityForm.preheatStartTime == '') {
            this.selectPreheatDisabled = true
            this.activityForm.preheatStartTime = ''
            this.radio = "2"
          } else {
            this.selectPreheatDisabled = false
            this.radio = "1"
            this.activityForm.preheatStartTime = formatDate(new Date(activity.preheatStartTime), 'yyyy-MM-dd hh:mm:ss')
          }
          this.activityForm.createTime = formatDate(new Date(activity.createTime), 'yyyy-MM-dd hh:mm:ss')
        } else {
          this.activity = {};
          this.activityForm.activityType=Number(this.type)
        }
        this.isShowActivityDialog = true
      },

      addGood(row) {
        console.log(row);
        if (row.activityType == 1 || row.activityType == 2||row.activityType == 5 || row.activityType == 6) {
          this.activityData = row
          this.showGoodList = true
          this.showActivityList = false
        }
        if (row.activityType == 3 || row.activityType == 4) {
          this.activityData = row
          this.showCouponList = true
          this.showActivityList = false
        }
      },
      // 参与记录
      participate(row){
        console.log(row);
        this.rowData=row
        this.showRecord = true
        this.showActivityList = false
      },
      hiddenRecord() {
        this.showRecord = false
        this.showActivityList = true
        this.loadList();
      },

      submit() {
        this.$refs.activityForm.validate(valid => {
          if (valid) {
            delete this.activityForm.createTime

            if (this.activityForm.activityType == 1) {
              if (this.radio == 1 && !this.activityForm.preheatStartTime) {
                this.$message({
                  message: '请选择活动预热时间',
                  type: 'warning'
                })
                return false
              }
              if (this.activityForm.startTime == '') {
                this.$message({
                  message: '请选择活动有效期',
                  type: 'warning'
                })
                return false
              }
              // return false
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
                  if (this.oper == 'add') {
                    this.activity = res.data
                    this.closeActivityDialog()
                    this.showActivityList = false
                    this.showSaveGood = true
                  } else {
                    this.closeActivityDialog()
                    this.loadList()
                  }
                })
            } else if (this.activityForm.activityType == 2) {
              this.activityForm.isPermanent = '0'
              if (this.radio_ == 1 && this.activityForm.startTime == '') {
                this.$message({
                  message: '请选择活动有效期',
                  type: 'warning'
                })
                return false
              } else if (this.radio_ == 2) {
                this.activityForm.isPermanent = '1'
              }
              // return false
              postMethod('/activity/add-or-update-new-user', this.activityForm).then(
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
                  if (this.oper == 'add') {
                    this.activity = res.data
                    this.closeActivityDialog()
                    this.showActivityList = false
                    this.showSaveGood = true
                  } else {
                    this.closeActivityDialog()
                    this.loadList()
                  }
                })
            } else if (this.activityForm.activityType == 3) {
              this.activityForm.isPermanent = '0'
              if (this.radio_ == 1 && this.activityForm.startTime == '') {
                this.$message({
                  message: '请选择活动有效期',
                  type: 'warning'
                })
                return false
              } else if (this.radio_ == 2) {
                this.activityForm.isPermanent = '1'
              }
              delete this.activityForm.preheatStartTime;
              // return false
              postMethod('/activity/add-or-update-coupon', this.activityForm).then(
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
                  if (this.oper == 'add') {
                    this.activity = res.data
                    this.closeActivityDialog()
                    this.showActivityList = false
                    this.showSaveCoupon = true
                  } else {
                    this.closeActivityDialog()
                    this.loadList()
                  }
                })
            } else if (this.activityForm.activityType == 4) {
              this.activityForm.isPermanent = '0'
              if (this.radio_ == 1 && this.activityForm.startTime == '') {
                this.$message({
                  message: '请选择活动有效期',
                  type: 'warning'
                })
                return false
              } else if (this.radio_ == 2) {
                this.activityForm.isPermanent = '1'
              }
              delete this.activityForm.preheatStartTime;
              // return false
              postMethod('/activity/add-or-update-coupon', this.activityForm).then(
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
                  if (this.oper == 'add') {
                    this.activity = res.data
                    this.closeActivityDialog()
                    this.showActivityList = false
                    this.showSaveCoupon = true
                  } else {
                    this.closeActivityDialog()
                    this.loadList()
                  }
                })
            }else if (this.activityForm.activityType == 6) {
             if (this.activityForm.startTime == '') {
               this.$message({
                 message: '请选择活动有效期',
                 type: 'warning'
               })
               return false
             }
             delete this.activityForm.preheatStartTime;
             // return false
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
                 if (this.oper == 'add') {
                   this.activity = res.data
                   this.closeActivityDialog()
                   this.showActivityList = false
                   this.showSaveGood = true
                 } else {
                   this.closeActivityDialog()
                   this.loadList()
                 }
               })
            }else if (this.activityForm.activityType == 5) {
              if (this.activityForm.startTime == '') {
                this.$message({
                  message: '请选择活动有效期',
                  type: 'warning'
                })
                return false
              }
              delete this.activityForm.preheatStartTime;
              // return false
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
                  if (this.oper == 'add') {
                    this.activity = res.data
                    this.closeActivityDialog()
                    this.showActivityList = false
                    this.showSaveGood = true
                  } else {
                    this.closeActivityDialog()
                    this.loadList()
                  }
                })
            }



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
      hiddenSaveGood() {
        this.showSaveGood = false
        this.showActivityList = true
        this.loadList();
      },

      hiddenCouponsList() {
        this.showCouponList = false
        this.showActivityList = true
        this.loadList();
      },
      hiddenSaveCoupon() {
        this.showSaveCoupon = false
        this.showActivityList = true
        this.loadList();
      },
      backToTypeList(){
          this.$emit('hiddenActivityList')
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
