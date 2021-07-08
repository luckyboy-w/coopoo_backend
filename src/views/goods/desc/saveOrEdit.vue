<template>
  <div class="update-form-panel" v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" label-width="150px">
      <el-form-item label="售后说明名称">
        <el-input v-model="dataForm.name" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :action="uploadGoodImageUrl"
          list-type="picture-card"
          :before-upload="beforeGoodImageUpload"
          :on-success="handleGoodImageSuccess"
          :file-list="uploadGoodImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">提交</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getMethod, postMethod, putMethod, getUploadUrl} from "@/api/request";

export default {
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      loading: false,
      uploadGoodImageList: [],
      hideGoodImageUpload: false,
      uploadGoodImageUrl: "",
      fileSortImage: 0,
      imageUrl: "",
      fileList: [],
      dataForm: {
        id: "",
        name: "",
        imgUrl: "",
      }
    };
  },
  computed: {},
  created() {
  },
  mounted() {
    if(this.editData.id){
      this.dataForm= {
      id: this.editData.id,
      name: this.editData.name,
      imgUrl: this.editData.imgUrl,
      }
      this.$nextTick(() => {
      if (this.editData.imgUrlSysFile != undefined && this.editData.imgUrlSysFile != []) {
        this.uploadGoodImageList=this.editData.imgUrlSysFile
      }
    })
    }
    console.log('this.dataForm',this.dataForm);
    this.buildGoodImageGroupId();
  },
  methods: {
    async buildGoodImageGroupId() {
      const res = await getMethod("/oss/get-group-id", null)
      this.uploadGoodImageUrl = getUploadUrl() + "?groupId=" + res.data;
    },
    handleGoodImageRemove(res) {
      this.hideGoodImageUpload = false;
    },
    handleGoodImageSuccess(res, file) {
      this.uploadGoodImageList = []
      this.dataForm.imgUrl = res.data.groupId
      this.hideGoodImageUpload = true
      res.data.fileType = file.raw.type
      res.data.sort = this.fileSortImage++
      this.uploadGoodImageList.push(res.data)
      const groupId = res.data.groupId
      let imageCnt = 0
      for (let i = 0; i < this.uploadGoodImageList.length; i++) {
        if (this.uploadGoodImageList[i].groupId == groupId) {
          imageCnt++
        }
      }
      this.loading = false
    },
    beforeGoodImageUpload(file) {
      const fileTypeVerify =
        file.type === "image/jpeg" ||
        file.type === "image/png"
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      this.loading = true
      return isLt2M;
    },
    initDefaultImage() {
      this.uploadGoodImageList.push({url: this.dataForm.imgUrl})
      if (this.uploadGoodImageList.length >= 1) {
        this.hideGoodImageUpload = true;
      }
    },
    async addGoodDesc() {
      if (this.validate()) {
        console.log(this.uploadGoodImageList)
        this.dataForm.fileList=this.uploadGoodImageList
        const res = await postMethod("/goods/post-sale/add", this.dataForm)
        this.$message.success("操作成功")
        this.$emit("showListPanel", true);
      }
    },
    async editGoodDesc() {
      if (this.validate()) {
        this.dataForm.fileList=this.uploadGoodImageList
        const res = await postMethod("/goods/post-sale/update", this.dataForm)
        this.$message.success("操作成功")
        this.$emit("showListPanel", true);
      }
    },
    validate() {
      const notNvl = ["name", "imgUrl"];
      for (let i = 0; i < notNvl.length; i++) {
        if (this.dataForm[notNvl[i]] == "") {
          this.$message.warning("字段不能为空")
          return false;
        }
      }
      return true;
    },
    cancelUpdate() {
      this.$emit("showListPanel", true);
    },
    submitUpdate() {
      if (this.dataForm.id == null||this.dataForm.id=='') {
        this.addGoodDesc();
      } else {
        this.editGoodDesc();
      }
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
