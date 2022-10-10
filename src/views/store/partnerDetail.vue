<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="合伙人名称"><el-input v-model="dataForm.name" placeholder="请输入" style="width: 250px;" /></el-form-item>
      <el-form-item label="合伙人手机号"><el-input v-model="dataForm.phone" maxlength="11" clearable type="text" @blur="dataForm.phone = $event.target.value" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请输入" style="width: 250px;" /></el-form-item>
      <el-form-item label="身份证正反面">
        <div style="display: flex;">
          <div>
            <el-input v-show="false" v-model="dataForm.personFrontImg"></el-input>
            <el-upload
              :action="uploadPersonNoFrontImgUrl"
              list-type="picture-card"
              :on-preview="handlePreview"
              :before-upload="beforeImgUpload"
              :on-success="handlePersonNoFrontImgSuccess"
              :class="{ hideTrue: hidePersonNoFrontImgUpload }"
              :file-list="uploadPersonNoFrontImgList"
              :on-remove="handlePersonNoFrontImgRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div style="margin-left: 30px;">
            <el-input v-show="false" v-model="dataForm.personSideImg"></el-input>
            <el-upload
              :action="uploadpersonNoSideImgUrl"
              list-type="picture-card"
              :on-preview="handlePreview"
              :before-upload="beforeImgUpload"
              :on-success="handlepersonNoSideImgSuccess"
              :class="{ hideTrue: hidepersonNoSideImgUpload }"
              :file-list="uploadpersonNoSideImgList"
              :on-remove="handlepersonNoSideImgRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="协议文件">
        <el-input v-show="false" v-model="dataForm.protocolFile"></el-input>
        <el-upload
          :action="uploadProtocalFileUrl"
          list-type="text"
          :show-file-list="true"
          :before-upload="beforeProtocalFileUpload"
          :on-success="handleProtocalFileSuccess"
          :file-list="uploadProtocalFileList"
          :on-preview="handleProtocalFilePreview"
          :on-remove="handleProtocalFileRemove"
        >
          <el-button size="small" v-show="hideProtocalFileUpload" type="primary" plain>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
  </div>
</template>
<script>
import { getMethod, postMethod, getUploadUrl } from '@/api/request';

export default {
  props: {
    editParnerData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      uploadPersonNoFrontImgList: [],
      hidePersonNoFrontImgUpload: false,
      uploadPersonNoFrontImgUrl: '',
      uploadpersonNoSideImgList: [],
      hidepersonNoSideImgUpload: false,
      uploadpersonNoSideImgUrl: '',
      uploadProtocalFileList: [],
      hideProtocalFileUpload: true,
      uploadProtocalFileUrl: '',
      fileSortImage: 0,
      dataForm: {
        name:'',
        phone:'',
        personFrontImg:'',
        personSideImg:'',
        protocolFile:'',
      }
    };
  },
  computed: {},
  mounted() {
    console.log(this.editParnerData);
    this.buildPersonNoFrontImgGroupId();
    this.buildpersonNoSideImgGroupId();
    this.buildProtocalFileGroupId();
  },
  created() {},
  methods: {
    saveObject() {
      console.log(this.dataForm)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    buildPersonNoFrontImgGroupId() {
      getMethod('/oss/get-group-id', null).then(res => {
        this.uploadPersonNoFrontImgUrl = getUploadUrl() + '?groupId=' + res.data;
      });
    },
    handlePersonNoFrontImgRemove(res) {
      this.hidePersonNoFrontImgUpload = false;
      for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
        if (this.uploadPersonNoFrontImgList[i].url == (res.url || res.response.data.url)) {
          this.dataForm.personFrontImg = '';
          this.uploadPersonNoFrontImgList.splice(i, 1);
          break;
        }
      }
    },
    handlePersonNoFrontImgSuccess(res, file) {
      res.data.fileType = file.raw.type;
      res.data.sort = this.fileSortImage++;
      this.uploadPersonNoFrontImgList.push(res.data);
      let groupId = res.data.groupId;
      let imageCnt = 0;
      for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
        if (this.uploadPersonNoFrontImgList[i].groupId == groupId) {
          imageCnt++;
        }
      }
      if (imageCnt >= 1) {
        this.hidePersonNoFrontImgUpload = true;
      }
      // this.clearValidate('personFrontImg')
      this.dataForm.personFrontImg = res.data.url;
    },
    buildpersonNoSideImgGroupId() {
      getMethod('/oss/get-group-id', null).then(res => {
        this.uploadpersonNoSideImgUrl = getUploadUrl() + '?groupId=' + res.data;
      });
    },
    handlepersonNoSideImgRemove(res) {
      for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
        if (this.uploadpersonNoSideImgList[i].url == (res.url || res.response.data.url)) {
          this.dataForm.personSideImg = '';
          this.uploadpersonNoSideImgList.splice(i, 1);
          break;
        }
      }
      this.hidepersonNoSideImgUpload = false;
    },
    handlepersonNoSideImgSuccess(res, file) {
      res.data.fileType = file.raw.type;
      res.data.sort = this.fileSortImage++;
      this.uploadpersonNoSideImgList.push(res.data);
      let groupId = res.data.groupId;
      let imageCnt = 0;
      for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
        if (this.uploadpersonNoSideImgList[i].groupId == groupId) {
          imageCnt++;
        }
      }
      if (imageCnt >= 1) {
        this.hidepersonNoSideImgUpload = true;
      }
      // this.clearValidate('personSideImg')
      this.dataForm.personSideImg = res.data.url;
    },
    beforeImgUpload(file) {
      const fileTypeVerify = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!');
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      if (file.name.length > 30) {
        this.$message.error('上传文件名称大小不能超过30个字符!');
        return false;
      }
      return fileTypeVerify && isLt2M;
    },
    buildProtocalFileGroupId() {
      getMethod('/oss/get-group-id', null).then(res => {
        this.uploadProtocalFileUrl = getUploadUrl() + '?groupId=' + res.data;
      });
    },
    handleProtocalFilePreview(file) {
      window.open(file.url);
    },
    handleProtocalFileRemove(res) {
      for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
        if (this.uploadProtocalFileList[i].url == (res.url || res.response.data.url)) {
          this.dataForm.protocolFile = '';
          this.uploadProtocalFileList.splice(i, 1);
          break;
        }
      }
    },
    handleProtocalFileSuccess(res, file) {
      res.data.fileType = file.raw.type;
      res.data.sort = this.fileSortImage++;
      res.data.name = file.name;
      this.uploadProtocalFileList.push(res.data);
      let groupId = res.data.groupId;
      let imageCnt = 0;
      for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
        if (this.uploadProtocalFileList[i].groupId == groupId) {
          imageCnt++;
        }
      }
      if (imageCnt >= 2) {
        this.hideProtocalFileUpload = true;
      }
      // this.clearValidate('protocolFile')
      this.dataForm.protocolFile = res.data.url;
    },
    beforeProtocalFileUpload(file) {
      const fileTypeVerify = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!');
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      if (file.name.length > 30) {
        this.$message.error('上传文件名称大小不能超过30个字符!');
        return false;
      }
      return fileTypeVerify && isLt2M;
    },
    cancelUpdate() {
      this.$emit('showParnerListPanel', true);
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
  display: none;
}
.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;
}
</style>
<style lang="scss">
.hideTrue .el-upload--picture-card {
  display: none;
}
</style>
