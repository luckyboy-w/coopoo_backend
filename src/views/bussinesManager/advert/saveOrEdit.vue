<template>
  <div class="update-form-panel">
    <el-form
      ref="dataForm"
      :model="dataForm"
      label-width="130px"
    >
      <el-form-item label="广告名称">
        <el-input v-model="dataForm.advertName"/>
      </el-form-item>
      <el-form-item label="广告位置">
        <el-select v-model="dataForm.advertLocation">
          <el-option
            v-for="item in advertLocationList"
            :key="item.id"
            :value-key="item.label"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="广告banner">
        <el-input
          v-show="false"
          v-model="dataForm.advertImage"
        />
        <el-upload
          :action="uploadAdvertUrl"
          list-type="picture-card"
          :on-preview="handleAdvertPreview"
          :before-upload="beforeAdvertUpload"
          :on-success="handleAdvertSuccess"
          :class="{hide:hideAdvertUpload}"
          :file-list="uploadAdvertList"
          :on-remove="handleAdvertRemove"
        >
          <i class="el-icon-plus"/>
          <div slot="tip" class="el-upload__tip">{{ notice }}</div>
        </el-upload>
        <el-dialog>
          <img
            width="100%"
            :src="imageUrl"
            alt
          >
        </el-dialog>
      </el-form-item>
      <el-form-item label="跳转类型">
        <el-select
          v-model="dataForm.dataType"
          placeholder="请选择"
        >
          <el-option
            label="商品"
            value="1"
          />
          <el-option
            label="链接"
            value="2"
          />
          <el-option
            label="商品分类"
            value="3"
          />
          <el-option
            label="编辑器"
            value="4"
          />
          <el-option
            label="活动商品"
            value="5"
          />
          <el-option
            label="无"
            value="6"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="choiceTitle[dataForm.dataType]">
        <el-select
          v-if="dataForm.dataType == 1"
          v-model="dataForm.advertUrl"
          filterable
          placeholder="请选择"
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in goodList"
            :key="item.id"
            :value-key="item.goodName"
            :label="item.goodName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-if="dataForm.dataType == 2"
          v-model="dataForm.advertUrl"
        />
        <el-select
          v-if="dataForm.dataType == 5"
          v-model="dataForm.advertUrl"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in goodActivityList"
            :key="item.id"
            :value-key="item.activityName"
            :label="item.activityName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="dataForm.dataType == 3"
        label="所属分类"
      >
        <el-select
          v-model="typeId"
          placeholder="请选择分类"
          @change="loadtypeId2List()"
        >
          <el-option
            v-for="item in typeIdList"
            :key="item.id"
            :value-key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="typeId2"
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeId2List"
            :key="item.id"
            :value-key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="dataForm.dataType == 4"
        label="编辑器"
      >
        <qEditor
          style="width: 650px;"
          :content="dataForm.advertUrl"
          :module-name="moduleName"
          @changeContent="changeContent"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="dataForm.sort"/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="dataForm.enable"
          inactive-value="0"
          active-value="1"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitUpdate"
        >
          添加
        </el-button>
        <el-button @click="cancelUpdate">
          取消
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
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
      choiceTitle: {
        "1": "选择商品",
        "2": "输入链接",
        "5": "选择商品活动"
      },
      // typeId2: '',
      goodActivityList: [],
      typeIdList: [],
      typeId2List: [],
      moduleName: 'activityContentName',
      dialogVisible: false,
      dialogImageUrl: '',
      advertLocationList: [],
      uploadAdvertList: [],
      hideAdvertUpload: false,
      uploadAdvertUrl: "",
      fileSortImage: 0,
      imageUrl: "",
      fileList: [],
      goodList: [],
      typeId2: '',
      typeId: '',
      key_: '-1',
      item1: '',
      item2: '',
      loading: false,
      dataForm: {
        // typeId2: '',
        // typeId: '',
        dataType: "1",
        advertName: "",
        advertUrl: "",
        sort: "",
        advertLocation: "",
        enable: 1,
        advertImage: "",
        id: ""
      }
    };
  },
  computed: {
    notice: function () {
      let data = this.advertLocationList.filter(item => item.id === this.dataForm.advertLocation)

      if (data.length === 0) return "暂无推荐尺寸"
      return data[0].payload.text
    }
  },
  mounted() {
    this.loodGoodList();
    this.loadGoodActivity();
    this.loadtypeIdList();
    this.buildAdvertGroupId();
    this.$nextTick(function () {
      this.advertLocationList = this.GLOBAL.advertLocationList
      if (this.editData.id) {
        let list = this.editData.advertUrl.split(",")
        this.item1 = list[0]
        this.item2 = list[1]
        this.dataForm = this.editData
        this.dataForm.enable = this.editData.enable + ''
        this.initDefaultImage();
      }

    });
  },
  created() {
  },
  methods: {
    async remoteMethod(query) {
      let param = {
        isSale: 1,
        verifyStatus: '20',
        pageNum: 0,
        pageSize: 10,
        goodName: query,
      }
      const {data} = await getMethod("/backend/good/findPage", param)
      this.goodList = data.list
      this.loading = false
    },
    loadtypeIdList() {
      const scope = this;
      const param = {
        parentId: this.key_
      };
      getMethod("backend/goodType/findType", param).then(res => {
        let obj = res.data
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].id == this.item1) {
            this.typeId = obj[i].typeName
            this.loadtypeId2List()
          }
        }
        scope.typeIdList = res.data;
      });
    },
    loadtypeId2List(typeId2) {
      if (this.item1) {
        this.typeId = this.item1
      }
      const scope = this
      this.typeId2 = typeId2 || ''
      const param = {
        parentId: this.typeId
      }
      getMethod('backend/goodType/findType', param).then(res => {
        let obj = res.data
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].id == this.item2) {
            this.typeId2 = obj[i].typeName
          }
        }
        scope.typeId2List = res.data

      })
    },
    loadSkuCompose() {
      const scope = this

    },
    changeContent(val) {
      this.dataForm.advertUrl = val
    },
    buildAdvertGroupId() {
      getMethod("/backend/oss/groupId", null).then(res => {
        this.uploadAdvertUrl = getUploadUrl() + "?groupId=" + (this.dataForm.advertImage || res.data);
        this.dataForm.advertImage = this.dataForm.advertImage || res.data;
      });
    },
    handleAdvertPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAdvertRemove(res) {
      for (let i = 0; i < this.uploadAdvertList.length; i++) {
        if (this.uploadAdvertList[i].filePath == (res.filePath || res.response.data.filePath)) {
          this.uploadAdvertList.splice(i, 1);
          break;
        }
      }
      this.hideAdvertUpload = false;
    },
    handleAdvertSuccess(res, file) {
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
      if (imageCnt >= 1) {
        this.hideAdvertUpload = true;
      }
    },
    loodGoodList() {
      let scope = this
      let param = {
        isSale: 1,
        verifyStatus: '20',
        pageNum: 0,
        pageSize: 10
      }

      if (this.editData.advertUrl){
        param.id = this.editData.advertUrl
      }

      getMethod("/backend/good/findPage", param).then(res => {
        scope.goodList = res.data.list
      });
    },
    loadGoodActivity() {
      let scope = this
      getMethod("/backend/goodActivity/findAll").then(res => {
        res.data.map(item => item.id + "");
        scope.goodActivityList = res.data.map(item => {
          item.id += ""
          return item
        })
      });
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
    initDefaultImage() {
      this.fileList = this.dataForm.files;
      for (let i = 0; i < this.dataForm.files.length; i++) {
        let imageObj = this.dataForm.files[i];
        if (imageObj.groupId == this.dataForm.advertImage) {
          this.uploadAdvertList.push(imageObj);
        }
      }
      if (this.uploadAdvertList.length >= 1) {
        this.hideAdvertUpload = true;
      }
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        delete this.dataForm.createTime;
        delete this.dataForm.createBy;
        let fileList = [];
        fileList = fileList.concat(this.uploadAdvertList);
        this.dataForm.fileJsonStr = JSON.stringify(fileList);
        this.dataForm.files = [];

        postMethod("/backend/advert/update", this.dataForm).then(
          res => {
            scope.typeList = res.data;
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
      let notNvl = ["advertName", "sort", "advertLocation"];
      if (this.dataForm.dataType != '6') {
        notNvl.push("advertUrl")
      }

      for (let i = 0; i < notNvl.length; i++) {
        if (this.dataForm[notNvl[i]] == "") {
          this.$message({
            message: "字段不能为空",
            type: "warning"
          });
          return false;
        }
      }

      if (this.dataForm.advertLocation.indexOf("http://") != -1 ||
        this.dataForm.advertLocation.indexOf("https://") != -1) {
        this.$message({
          message: "落地页链接不合法，请以http://或者https://开头",
          type: "warning"
        });
        return
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
      if (this.dataForm.dataType == 3 && this.typeId2 != '') {
        this.dataForm.advertUrl = this.typeId + ',' + this.typeId2
      }
      if (this.dataForm.dataType == 3 && this.typeId2 == '') {
        this.dataForm.advertUrl = this.typeId
      }
      this.saveObject();
    }
  }
};
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 600px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
