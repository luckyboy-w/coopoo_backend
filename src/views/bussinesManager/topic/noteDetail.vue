<template>
  <div class="update-form-panel">
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <div class="tabTd">
        <el-button type="primary" @click="cancelUpdate()" icon="el-icon-arrow-left">返回</el-button>
      </div>
     </div>
    <el-tabs type="border-card">
      <el-tab-pane label="笔记">
        <el-form ref="dataForm" :model="dataForm" label-width="80px">
          <el-form-item label="标题">
            <el-input  style="width: 300px;" v-model="dataForm.postTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input  style="width: 500px;" rows="8 " v-model="dataForm.postContent" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="视频" v-if="dataForm.video">
            <div style="width: 300px;height: 200px;">
                <video class="video-avatar" :src="dataForm.video.url"
                style="height: inherit;min-width: -webkit-fill-available;" controls="controls">
                您的浏览器不支持视频播放
              </video>
            </div>
          </el-form-item>
          <el-form-item label="图片">
            <div id="front-img">
              <el-upload disabled  :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
                :class="{hideTrue:hideAdvertUpload}" :file-list="dataForm.resourceList">
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button v-if="postStatus===1" @click="noteEnable('1')" type="primary">禁用</el-button>
            <el-button v-if="postStatus===0" @click="noteEnable('0')" type="primary">启用</el-button>
            <el-button @click="cancelUpdate">返回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="评论">
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table
              ref="mainTable"
              :data="tableData.list"
              style="width: 100%; margin-bottom: 20px;"
              row-key="id" border
            >
              <el-table-column prop="comment" label="评论内容" ></el-table-column>
              <el-table-column prop="commentatorMemberNickname" label="用户名称"></el-table-column>
              <el-table-column prop="likesCount" label="点赞数" ></el-table-column>
              <el-table-column fixed="right" prop="id" label="操作" >
                <template slot-scope="scope">
                    <el-button
                      @click="enable('0',scope.row)"
                      v-if="scope.row.commentStatus == 0"
                      size="mini" type="primary"
                    >启用
                    </el-button>
                    <el-button
                      @click="enable('1',scope.row)"
                      v-if="scope.row.commentStatus == 1"
                      size="mini" type="primary"
                    >禁用
                    </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination
              background
              v-show="!showPagination"
              layout="prev, pager, next"
              @current-change="currentPage"
              @prev-click="currentPage"
              @next-click="currentPage"
              :total="tableData.total"
              :page-size="searchParam.pageSize"
              :current-page="searchParam.pageNum"
            ></el-pagination>
          </div>
        </div>
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
      console.log(this.editData)
      this.$nextTick(function() {
          this.dataForm = this.editData;
          this.postStatus=this.editData.postStatus
          console.log(this.postStatus)
          this.hideAdvertUpload=true
      });
      this.loadList()
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
        postStatus:'',
        dialogVisible: false,
        dialogImageUrl: '',
        sendEval: false,
        showPagination: false,
        replyFrm: {},
        searchParam: {
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        fileSortImage: 0,
        imageUrl: "",
        dataForm: {},
        uploadAdvertList: [],
        hideAdvertUpload: false,
        uploadAdvertUrl: getUploadUrl(),
        fileSortImage: 0,
        image: "",
      }
    },
    methods: {
      handleAdvertPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      noteEnable(val){

        if (val=="1") {
          getMethod('/posts/disable', {postsId:this.editData.postsId}).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.postStatus=0
          });
        } else if(val=="0"){
        getMethod('/posts/enable', {postsId:this.editData.postsId}).then(res => {
          this.$message({
            message: "启用成功",
            type: "success"
          });
          this.postStatus=1
        });
        }
      },
      enable(val,row){
        console.log(val,row)
        if (val=="1") {
          postMethod('/posts-comment/disable?id='+row.id).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.loadList();
          });
        } else if(val=="0"){
        postMethod('/posts-comment/enable?id='+row.id).then(res => {
          this.$message({
            message: "启用成功",
            type: "success"
          });
          this.loadList();
        });
        }
      },
      cancelUpdate() {
        this.$emit("showListPanel", true);
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadList()
      },
      loadList() {
        let scope = this
        this.searchParam.postsId=this.editData.postsId
        postMethod('/posts-comment/page', this.searchParam).then(
          res => {
            scope.tableData.list = res.data.records
            scope.tableData.total = res.data.total
            scope.showPagination = scope.tableData.total == 0
          }
        )
      }
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

  .el-pagination > > > .btn-prev {
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
