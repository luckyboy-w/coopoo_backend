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
            <el-input  style="width: 300px;" v-model="dataForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input  style="width: 500px;" rows="8 " v-model="dataForm.content" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="视频">
            <div style="width: 300px;height: 200px;">
                <video src="http://testimg.coopoo.com/2021-08-11/2021081111553435832402430241497101008074848166.mp4" class="video-avatar"
                style="height: inherit;min-width: -webkit-fill-available;" controls="controls">
                您的浏览器不支持视频播放
              </video>
            </div>
          </el-form-item>
          <el-form-item label="图片">
            <div id="front-img">
              <el-input v-show="false" v-model="dataForm.img" />
              <el-upload disabled  :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
                :class="{hideTrue:hideAdvertUpload}" :file-list="uploadAdvertList">
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="isDisabled" @click="submitUpdate">禁用</el-button>
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
              <el-table-column prop="orderNo" label="评论内容" ></el-table-column>
              <el-table-column prop="goodsName" label="用户名称"></el-table-column>
              <el-table-column prop="supplierName" label="点赞数" ></el-table-column>
              <el-table-column prop="supplierName" label="评论数" ></el-table-column>
              <el-table-column fixed="right" prop="id" label="操作" >
                <template slot-scope="scope">
                    <el-button
                      @click="replyMsg(scope.row)"
                      v-if="scope.row.replyStatus == 0"
                      size="mini" type="primary"
                    >启用
                    </el-button>
                    <el-button
                      @click="replyMsg(scope.row)"
                      v-if="scope.row.replyStatus == 0"
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
      console.log(123456)
      this.$nextTick(function() {
        if (this.editData.id) {
          this.isDisabled=true
          this.dataForm = this.editData;
          if (this.editData.img) {
            this.dataForm.msgType = 1;
            this.dataForm.img = this.editData.img;
            this.uploadAdvertList.push({
              url: this.editData.img
            })
            this.hideAdvertUpload=true
          }else{
            this.dataForm.msgType = 2;
          }
          // this.$refs.refEditor.richText = this.dataForm.content
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
        dialogVisible: false,
        dialogImageUrl: '',
        sendEval: false,
        showPagination: false,
        replyFrm: {

        },
        searchParam: {
          replyStatus: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        isDisabled:false,
        fileSortImage: 0,
        imageUrl: "",
        dataForm: {
          img: "",
          title: "",
          content: "",
          msgType:2
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
      handleAdvertPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleAdvertRemove(res) {
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertList.splice(i, 1);
            break;
          }
        }
        this.hideAdvertUpload=false
      },
      handleAdvertSuccess(res, file) {
        console.log(res, file)
        this.dataForm.img = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertList.length >= 1) {
          this.hideAdvertUpload=true
        }
        console.log(this.uploadAdvertList)
      },
      beforeAdvertUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        return fileTypeVerify && isLt2M;
      },
      saveObject() {
        let scope = this;
        if (this.validate()) {
          if (this.dataForm.msgType==1&&this.dataForm.img=='') {
            this.$message({
              message: "请上传封面图",
              type: "warning"
            });
            return false
          }
          delete this.dataForm.createTime;
          delete this.dataForm.createBy;
          console.log(this.dataForm)
          // return false
          postMethod("/operate/send-active-info", this.dataForm).then(res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          });
        }
      },
      validate() {
        let notNvl = ["title", "content"];
        for (let i = 0; i < notNvl.length; i++) {
          if (this.dataForm[notNvl[i]] == "") {
            this.$message({
              message: "字段不能为空",
              type: "warning"
            });
            return false;
          }
        }

        let needInt = [];
        for (let i = 0; i < needInt.length; i++) {
          if (!isInteger(this.dataForm[needInt[i]])) {
            this.$message({
              message: "请输入正整数",
              type: "warning"
            });
            return false;
          }
        }

        return true;
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
      loadList() {
        let scope = this
        getMethod('/operate/get-goods-comment-list', this.searchParam).then(
          res => {
            scope.tableData.list = res.data.records
            scope.tableData.list.forEach(i=>{
              i.isShow=String(i.isShow)
            })
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
