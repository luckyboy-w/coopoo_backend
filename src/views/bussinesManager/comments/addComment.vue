<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="商品名称">
        <div>

          <el-button type="success" @click="relatedGoods()">选择商品</el-button>
          <span>&nbsp;&nbsp;&nbsp; {{dataForm.goodsName}}</span>
          <!-- <el-input v-show="false" v-model="dataForm.goodsId" type="text" /> -->
        </div>
      </el-form-item>
      <el-form-item label="SKU选择">
        <el-select style="width:450px;" v-model="dataForm.skuInfo">
          <el-option v-for="item in goodsSkuList" :key="item.skuId" :value-key="item.skuText" :label="item.skuText"
            :value="item.skuText" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input style="width:450px;" v-model="dataForm.memberNickname" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户头像">
        <div id="front-img">
          <el-upload :action="uploadAvatarUrl" list-type="picture-card" :on-preview="handlePreview"
            :before-upload="beforeUpload" :on-success="handleAvatarSuccess" :class="{hideTrue:hideAvatarUpload}"
            :file-list="uploadAvatarList" :on-remove="handleAvatarRemove">
            <i class="el-icon-plus" />
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="评价">
        <el-input  type="textarea" :rows="6" placeholder="请输入评论内容" v-model="dataForm.commentContent"> </el-input>
      </el-form-item>
      <el-form-item label="图片(最多6张)">
        <el-input v-show="false" />
        <el-upload :action="uploadCommentImageUrl" list-type="picture-card" :on-preview="handlePreview"
          :before-upload="beforeUpload" :on-success="handleCommentImageSuccess"
          :class="{hideTrue:hideCommentImageUpload}" :file-list="uploadCommentImageList"
          :on-remove="handleCommentImageRemove">
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">
          添加
        </el-button>
        <el-button @click="cancelUpdate">
          取消
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog :visible="showGoodsList" :before-close="showGoodsListClose" title="关联商品" width="90%">
      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>商品名称：</div>
            <div>
              <el-input v-model="searchParam.goodsName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table ref="multipleTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
              border @select="selectThis">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" />
              <el-table-column label="商品价格">
                <template slot-scope="scope">
                  <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="saleVolume" label="销量" />
              <el-table-column prop="isSale" label="商品状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSale==1">已上架</span>
                  <span v-if="scope.row.isSale===0">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData.total" background layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" :current-page="searchParam.pageNum" @next-click="currentPage" />
          </div>
        </div>
      </div>
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
  import qEditor from "@/components/RichText/quill-editor";

  export default {
    components: {
      qEditor
    },
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

        showGoodsList: false,
        // 商品列表
        tableData: {
          list: []
        },
        localTableData: [],
        multipleSelection: [],
        bindingList: [],
        searchParam: {
          pageSize: 10,
          pageNum: 1,
        },
        goodsName: '',
        goodsSkuList: [],
        uploadCommentImageUrl: '',
        hideCommentImageUpload: false,
        uploadCommentImageList: [],
        uploadAvatarList: [],
        hideAvatarUpload: false,
        uploadAvatarUrl: "",
        fileSortImage: 0,
        imageList: [],
        relationList: [],
        loading: false,
        dataForm: {
          goodsName: '',
          goodsId: '',
          skuInfo: '',
          memberNickname: '',
          commentContent: '',
          memberAvatar: "",
          imagesUrl: '',
        }
      };
    },
    computed: {},
    mounted() {
      this.buildAvatarGroupId();
      this.buildCommentImageGroupId()
    },
    created() {},
    methods: {

      // 关联商品
      relatedGoods() {
        this.searchParam.pageNum = 1
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {
        this.searchParam = {
          pageSize: 10,
          pageNum: 1,
        }
        if (this.bindingList.length > 0) {
          this.dataForm.goodsName = this.bindingList[0].goodsName
          this.dataForm.goodsId = this.bindingList[0].goodsId
          this.goodsSkuList = this.bindingList[0].skuList
          this.dataForm.skuInfo = ''
        }
        console.log('this.bindingList', this.bindingList)
        this.showGoodsList = false
      },
      // 新建标签跳详情
      getGoodsDtl(row) {
        let newpage = this.$router.resolve({
          path: "/goods/list", //路径
          query: {
            goodsId: row.goodsId, //商品id
          }
        })
        window.open(newpage.href, '_blank');
      },
      search() {
        this.searchParam.pageNum = 1
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
        postMethod("/goods/list", this.searchParam).then(res => {
          this.tableData.list = res.data.records;
          this.tableData.total = res.data.total;
          this.showPagination = this.tableData.total == 0;
          if (this.bindingList && this.bindingList.length > 0) {
            this.testF()
          }
        });

      },
      testF() {
        this.$nextTick(() => {
          this.tableData.list.forEach((item, index) => {
            this.bindingList.forEach((i, dex) => {
              if (i.goodsId == item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
          this.$forceUpdate()
        })
      },
      selectThis(selection, row) {
        console.log(selection, row);
        if (this.bindingList.length >= 1) {
          this.bindingList.forEach((item, index) => {
            if (row.goodsId == item.goodsId) {
              this.bindingList.splice(index, 1)
            } else {
              this.bindingList = []
              this.bindingList.push(row)
              this.showGoodsListClose()
            }
          })

        } else {
          this.bindingList = []
          this.bindingList.push(row)
          this.showGoodsListClose()
        }

      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },



      buildAvatarGroupId() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAvatarUrl = getUploadUrl() + "?groupId=" + res.data
        });
      },
      buildCommentImageGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadCommentImageUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleAvatarRemove(res) {
        for (let i = 0; i < this.uploadAvatarList.length; i++) {
          if (this.uploadAvatarList[i].url == (res.url || res.response.data.url)) {
            this.uploadAvatarList.splice(i, 1);
            break;
          }
        }
        document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display =
          'block'
      },
      handleCommentImageRemove(res) {
        for (let i = 0; i < this.uploadCommentImageList.length; i++) {
          if (this.uploadCommentImageList[i].url == (res.url || res.response.data.url)) {
            this.uploadCommentImageList.splice(i, 1)
            break
          }
        }
        this.hideCommentImageUpload = false
      },
      handleAvatarSuccess(res, file) {
        this.dataForm.memberAvatar = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAvatarList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAvatarList.length; i++) {
          if (this.uploadAvatarList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (imageCnt >= 1) {
          this.hideAvatarUpload = true
        }
      },
      handleCommentImageSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadCommentImageList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadCommentImageList.length; i++) {
          if (this.uploadCommentImageList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 6) {
          this.hideCommentImageUpload = true
        }
      },
      beforeUpload(file) {
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

        this.uploadCommentImageList.forEach((item, index) => {
          this.imageList.push(item.url)
        })
        this.dataForm.imagesUrl = this.imageList.join(',')
        console.log('表单数据', this.dataForm);
        // console.log(this.uploadAvatarList, this.uploadCommentImageList);
        // return false;
        if (this.validate()) {
          postMethod("/goods-comment/add-comment", this.dataForm).then(
            res => {
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
        let notNvl = ["memberNickname", "commentContent", "memberAvatar", 'skuInfo', 'imagesUrl', 'goodsName'];
        for (let i = 0; i < notNvl.length; i++) {
          if (this.dataForm[notNvl[i]] == "") {
            this.$message({
              message: "必填项不能为空",
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
      }
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 800px;
  }

  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }
</style>
<style lang="scss">
  .hideTrue .el-upload--picture-card {
    display: none;
  }
</style>
