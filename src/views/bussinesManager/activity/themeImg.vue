<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel">
        <el-button @click="backToList()" type="primary" icon="el-icon-back">返回列表</el-button>
      </div>
      <div>
        <el-form ref="dataForm" label-width="120px">
          <el-form-item :label="activityType==5?'拼团主题主图：':'砍价主题主图：'">
            <div id="front-imgFirst">
              <el-input v-show="false" v-model="imgObj.firstImg" />
              <el-upload :action="uploadAdvertUrlFirst" list-type="picture-card" :on-preview="handleAdvertPreview"
                :before-upload="beforeAdvertUpload" :on-success="handleAdvertSuccessFirst" :class="{hideTrue:hideAdvertUploadFirst}"
                :file-list="uploadAdvertListFirst" :on-remove="handleAdvertRemoveFirst">
                <i class="el-icon-plus" />
                <div slot="tip" class="el-upload__tip">建议尺寸：375*736
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item :label="activityType==5?'拼团底色主图：':'砍价底色主图：'">
            <div id="front-imgSecond" >
              <el-input v-show="false" v-model="imgObj.secondImg" />
              <el-upload :action="uploadAdvertUrlSecond" list-type="picture-card" :on-preview="handleAdvertPreview"
                :before-upload="beforeAdvertUpload" :on-success="handleAdvertSuccessSecond" :class="{hideTrue:hideAdvertUploadSecond}"
                :file-list="uploadAdvertListSecond" :on-remove="handleAdvertRemoveSecond">
                <i class="el-icon-plus" />
                <div slot="tip" class="el-upload__tip">建议尺寸：375*3526
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item :label="activityType==5?'拼团价格主图：':'砍价价格主图：'">
            <div id="front-imgThird" >
              <el-input v-show="false" v-model="imgObj.thirdImg" />
              <el-upload :action="uploadAdvertUrlThird" list-type="picture-card" :on-preview="handleAdvertPreview"
                :before-upload="beforeAdvertUpload" :on-success="handleAdvertSuccessThird" :class="{hideTrue:hideAdvertUploadThird}"
                :file-list="uploadAdvertListThird" :on-remove="handleAdvertRemoveThird">
                <i class="el-icon-plus" />
                <div slot="tip" class="el-upload__tip">建议尺寸：325*327
                </div>
              </el-upload>
            </div>
          </el-form-item>
          </el-form>
          <el-button style="margin-left: 120px;" type="primary" @click="submitThemeImg()">
            提交
          </el-button>
      </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    </div>
  </div>

</template>

<script>
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from "@/api/request";

  export default {
    name: '',
    props: {
      activityType:[String, Number]
    },
    data() {
      return {
        testlable:888,

      uploadAdvertListFirst: [],
      uploadAdvertListSecond: [],
      uploadAdvertListThird: [],
      uploadAdvertUrlFirst: "",
      uploadAdvertUrlSecond: "",
      uploadAdvertUrlThird: "",
      hideAdvertUploadFirst:false,
      hideAdvertUploadSecond:false,
      hideAdvertUploadThird:false,
      imgObj:{
        firstImg:'',
        secondImg:'',
        thirdImg:'',
      },
      fileSortImage: 0,
      dialogVisible: false,
      dialogImageUrl: '',
      };
    },
    components: {},
    filters: {},
    computed: {},
    mounted() {
      console.log('活动类型', this.activityType)
      this.buildAdvertGroupIdFirst();
      this.buildAdvertGroupIdSecond();
      this.buildAdvertGroupIdThird();
      // this.activityData = this.rowData
      // this.searchParam.activityId = this.rowData.id
      // this.initRecordData();

    },
    methods: {
      
      submitThemeImg(){
        console.log(this.imgObj)
      },
      
      
      handleAdvertPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeAdvertUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png"
          // file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        return fileTypeVerify && isLt2M;
      },
      buildAdvertGroupIdFirst() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAdvertUrlFirst = getUploadUrl() + "?groupId=" + res.data
        });
      },
      buildAdvertGroupIdSecond() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAdvertUrlSecond = getUploadUrl() + "?groupId=" + res.data
        });
      },
      buildAdvertGroupIdThird() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAdvertUrlThird = getUploadUrl() + "?groupId=" + res.data
        });
      },
      handleAdvertRemoveFirst(res) {
        for (let i = 0; i < this.uploadAdvertListFirst.length; i++) {
          if (this.uploadAdvertListFirst[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertListFirst.splice(i, 1);
            this.imgObj.firstImg=''
            break;
          }
        }
       this.hideAdvertUploadFirst=false
      },
      handleAdvertRemoveSecond(res) {
        for (let i = 0; i < this.uploadAdvertListSecond.length; i++) {
          if (this.uploadAdvertListSecond[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertListSecond.splice(i, 1);
            this.imgObj.secondImg=''
            break;
          }
        }
       this.hideAdvertUploadSecond=false
      },
      handleAdvertRemoveThird(res) {
        for (let i = 0; i < this.uploadAdvertListThird.length; i++) {
          if (this.uploadAdvertListThird[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertListThird.splice(i, 1);
            this.imgObj.thirdImg=''
            break;
          }
        }
        this.hideAdvertUploadThird=false
      },
      handleAdvertSuccessFirst(res, file) {
        this.imgObj.firstImg = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertListFirst.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertListFirst.length; i++) {
          if (this.uploadAdvertListFirst[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertListFirst.length >= 1) {
          this.hideAdvertUploadFirst=true
        }
      },
      handleAdvertSuccessSecond(res, file) {
        this.imgObj.secondImg = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertListSecond.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertListSecond.length; i++) {
          if (this.uploadAdvertListSecond[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertListSecond.length >= 1) {
         this.hideAdvertUploadSecond=true
        }
      },
      handleAdvertSuccessThird(res, file) {
        this.imgObj.thirdImg = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertListThird.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertListThird.length; i++) {
          if (this.uploadAdvertListThird[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertListThird.length >= 1) {
          this.hideAdvertUploadThird=true
        }
      },
      initRecordData() {
        let scope = this;
        //拼團
        if (this.activityType == 5) {
          getMethod("/activity/marketing-goods/collage/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }
        //砍价
        if (this.activityType == 6) {
          getMethod("/activity/marketing-goods/cut-price/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }

      },
      backToList() {
        this.$emit('hiddenThemeImg')
      }
    },
    watch: {}
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

</style>
<style lang="scss">
.hideTrue .el-upload--picture-card {
  display: none!important;
}
</style>
