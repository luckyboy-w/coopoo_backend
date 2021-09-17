<template>
  <div class="update-form-panel">
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <div class="tabTd">
        <el-button type="primary" @click="cancelUpdate()" icon="el-icon-arrow-left">返回</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="举报内容" name="first">
        <el-form ref="dataForm" :model="dataForm" label-width="80px">
          <el-form-item label="评论内容" v-if="dataForm.reportObjectType==2">
            <el-input style="width: 500px;" rows="3" v-model="dataForm.commentContent" type="textarea" disabled></el-input>
          </el-form-item>
          <el-form-item label="举报描述">
            <el-input style="width: 500px;" rows="8" v-model="dataForm.reportContent" type="textarea" disabled></el-input>
          </el-form-item>
          <el-form-item label="出处链接" v-if="dataForm.reportObjectType==1">
            <el-input style="width: 300px;" v-model="dataForm.link" disabled></el-input>
          </el-form-item>
          <el-form-item label="图片证据">
            <div id="front-img">
              <el-upload disabled :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
                :class="{hideTrue:hideAdvertUpload}" :file-list="dataForm.reportImgList">
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="enable('0')" v-if="commentStatus == 0&&dataForm.reportObjectType==2"  type="primary">启用
            </el-button>
            <el-button @click="enable('1')" v-if="commentStatus == 1&&dataForm.reportObjectType==2"  type="primary">禁用
            </el-button>
            <el-button v-if="dataForm.reportObjectType==1" @click="nextTab">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="笔记" name="second" v-if="dataForm.reportObjectType==1">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input style="width: 300px;" v-model="noteData.postTitle" disabled></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input style="width: 500px;" rows="8" v-model="noteData.postContent" type="textarea" disabled></el-input>
          </el-form-item>
          <el-form-item label="视频" v-if="noteData.video">
            <div style="width: 300px;height: 200px;">
              <video  class="video-avatar" :src="noteData.video.url"
                style="height: inherit;min-width: -webkit-fill-available;" controls="controls">
                您的浏览器不支持视频播放
              </video>
            </div>
          </el-form-item>
          <el-form-item label="图片">
            <div id="front-img">
              <el-upload disabled :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
                :class="{hideTrue:hideAdvertUpload}" :file-list="noteData.resourceList">
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="upTab">返回</el-button>
            <el-button v-if="postStatus==1" @click="noteEnable('1')" type="primary">禁用</el-button>
            <el-button v-if="postStatus==0" @click="noteEnable('0')" type="primary">启用</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
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
  } from "@/utils/validate";
  import qEditor from "@/components/RichText/quill-editor"

  export default {
    computed: {},
    components: {
      qEditor
    },
    mounted() {
      this.$nextTick(function() {
        this.dataForm = this.editData;
        this.isDisabled = true
        this.hideAdvertUpload = true
        if (this.editData.reportObjectType == 1) {
          this.noteDetail()
        } else if (this.editData.reportObjectType == 2) {
          this.commentStatus=this.editData.commentStatus
        }
      });
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
        commentStatus:'',
        postStatus:'',
        activeName: 'first',
        dialogVisible: false,
        dialogImageUrl: '',
        sendEval: false,
        showPagination: false,
        replyFrm: {

        },
        noteData: {},
        searchParam: {
          replyStatus: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        isDisabled: false,
        fileSortImage: 0,
        imageUrl: "",
        dataForm: {
          img: "",
          title: "",
          content: "",
          msgType: 2
        },
        uploadAdvertList: [],
        hideAdvertUpload: false,
        uploadAdvertUrl: getUploadUrl(),
        fileSortImage: 0,
        image: "",
      }
    },
    methods: {
      changeContent(val) {
        this.dataForm.content = val
      },
      noteDetail() {
        getMethod("/posts/detail", {
          postsId: this.editData.reportObjectId
        }).then(res => {
          this.noteData = res.data
          this.postStatus=res.data.postStatus
        });
      },
      noteEnable(val) {
        if (val == "1") {
          getMethod('/posts/disable', {
            postsId: this.editData.reportObjectId
          }).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.postStatus=0
          });
        } else if (val == "0") {
          getMethod('/posts/enable', {
            postsId: this.editData.reportObjectId
          }).then(res => {
            this.$message({
              message: "启用成功",
              type: "success"
            });
            this.postStatus=1
          });
        }
      },
      enable(val){
        if (val=="1") {
          postMethod('/posts-comment/disable?id='+this.dataForm.reportObjectId).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.commentStatus=0
          });
        } else if(val=="0"){
        postMethod('/posts-comment/enable?id='+this.dataForm.reportObjectId).then(res => {
          this.$message({
            message: "启用成功",
            type: "success"
          });
          this.commentStatus=1
        });
        }
      },
      nextTab() {
        this.activeName = "second"
      },
      upTab() {
        this.activeName = "first"
      },
      handleAdvertPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      cancelUpdate() {
        this.$emit("showListPanel", true);
      },
      submitUpdate() {
        this.saveObject();
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadList()
      },
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    // width: 600px;
  }

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

  .el-pagination {
    white-space: nowrap;
    padding: 2px 0px;
    color: #303133;
    font-weight: bold;
  }

  .el-pagination>>>.btn-prev {
    margin: 0 5px 0 0;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
  }
</style>
<style lang="scss">
  .hideTrue .el-upload--picture-card {
    display: none;
  }
</style>
