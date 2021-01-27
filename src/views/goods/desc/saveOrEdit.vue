<template>
  <div class="update-form-panel" v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" label-width="150px">
      <el-form-item label="售后说明名称">
        <el-input v-model="dataForm.name"/>
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
    this.dataForm = this.editData;
    this.$nextTick(() => {
      if (this.dataForm.imgUrl != undefined && this.dataForm.imgUrl != '') {
        this.uploadGoodImageList.push({url: this.dataForm.imgUrl})
      }
    })
    this.buildGoodImageGroupId();
  },
  methods: {
    async buildGoodImageGroupId() {
      const res = await getMethod("/backend/oss/groupId", null)
      this.uploadGoodImageUrl = getUploadUrl() + "?groupId=" + res.data;
    },
    handleGoodImageRemove(res) {
      this.hideGoodImageUpload = false;
    },
    handleGoodImageSuccess(res, file) {
      this.uploadGoodImageList = []
      this.uploadGoodImageList.push(res.data)
      this.loading = false
      this.dataForm.imgUrl = res.data.url
      this.hideGoodImageUpload = true
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
        const res = await postMethod("/backend/goodSalesDesc", this.dataForm)
        this.$message.success("操作成功")
        this.$emit("showListPanel", true);
      }
    },
    async editGoodDesc() {
      if (this.validate()) {
        const res = await putMethod("/backend/goodSalesDesc", this.dataForm)
        this.$message.success("操作成功")
        this.$emit("showListPanel", true);
      }
    },
    validate() {
      const notNvl = ["name", "imgUrl"];
      for (let i = 0; i < notNvl; i++) {
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
      if (this.dataForm.id == null) {
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
