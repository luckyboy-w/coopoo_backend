<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
      <el-form-item label="供应商编号" prop="supplierNo">
        <el-input v-model="dataForm.supplierNo" :disabled="disabledSupplierNo"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="dataForm.supplierName"></el-input>
      </el-form-item>
      <el-form-item label="登陆账号" prop="loginAccount">
        <el-input v-model="dataForm.loginAccount" :disabled="disabledLoginNo"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="userName">
        <el-input v-model="dataForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNo">
        <el-input v-model="dataForm.phoneNo"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="dataForm.address"></el-input>
      </el-form-item>
      <el-form-item label="税务代码" prop="taxNo">
        <el-input v-model="dataForm.taxNo"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="dataForm.email"></el-input>
      </el-form-item>
      <el-form-item label="环信配置" style="width:1200px">
        <el-row :span="24" style="">
          <el-col :span="2" style="padding-left:5px">客服ID:</el-col>
          <el-col :span="4">
            <el-input v-model="dataForm.hxNo"></el-input>
          </el-col>
          <el-col :span="2" style="padding-left:5px">客服昵称:</el-col>
          <el-col :span="4">
            <el-input v-model="dataForm.hxSkillGroup"></el-input>
          </el-col>
          <el-col :span="3" style="padding-left:5px">H5客服配置ID:</el-col>
          <el-col :span="4">
            <el-input v-model="dataForm.hxConfigId"></el-input>
          </el-col>
        </el-row>
        <el-row :span="24" style="padding-top:15px">
          <el-col :span="2" style="padding-left:5px">登录账号:</el-col>
          <el-col :span="4">
            <el-input v-model="dataForm.hxLoginNo"></el-input>
          </el-col>
          <el-col :span="2" style="padding-left:5px">登录密码:</el-col>
          <el-col :span="4">
            <el-input v-model="dataForm.hxLoginPwd"></el-input>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item label="环信技能组">
        <el-input v-model="dataForm.hxSkillGroup"></el-input>
      </el-form-item>
      <el-form-item label="环信技能组">
        <el-input v-model="dataForm.hxConfigId"></el-input>
      </el-form-item>
      <el-form-item label="环信登录账号">
        <el-input v-model="dataForm.hxLoginNo"></el-input>
      </el-form-item>
      <el-form-item label="环信登录密码">
        <el-input v-model="dataForm.hxLoginPwd"></el-input>
      </el-form-item> -->
      <el-form-item label="省份" prop="provinceId">
        <el-select v-model="dataForm.provinceId">
          <el-option
            v-for="item in provinceList"
            :key="item.provinceid"
            :value-key="item.province"
            :label="item.province"
            :value="item.provinceid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行名称" prop="bankName">
        <el-input v-model="dataForm.bankName"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankCard">
        <el-input v-model="dataForm.bankCard"></el-input>
      </el-form-item>

      <el-form-item label="协议文件" prop="protocolFile">
        <el-input v-show="false" v-model="dataForm.protocolFile"></el-input>
        <el-upload
          :action="uploadProtocalFileUrl"
          list-type="text"
          :show-file-list="true"
          :before-upload="beforeProtocalFileUpload"
          :on-success="handleProtocalFileSuccess"
          :file-list="uploadProtocalFileList"
          :on-preview="handlePreview"
          :on-remove="handleProtocalFileRemove"
        >
          <el-button size="small" v-show="hideProtocalFileUpload" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="营业执照照片" prop="licenseImg">
        <el-input v-show="false" v-model="dataForm.licenseImg"></el-input>
        <el-upload
        :limit="1"
          :action="uploadLicenseImgUrl"
          list-type="picture-card"
          :on-preview="handleLicenseImgPreview"
          :before-upload="beforeLicenseImgUpload"
          :on-success="handleLicenseImgSuccess"
          :class="{'hideTrue':hideLicenseImgUpload}"
          :file-list="uploadLicenseImgList"
          :on-remove="handleLicenseImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="法人身份证正面" prop="personFrontImg">
        <el-input v-show="false" v-model="dataForm.personFrontImg"></el-input>
        <el-upload
          :action="uploadPersonNoFrontImgUrl"
          list-type="picture-card"
          :on-preview="handlePersonNoFrontImgPreview"
          :before-upload="beforePersonNoFrontImgUpload"
          :on-success="handlePersonNoFrontImgSuccess"
          :class="{hideTrue:hidePersonNoFrontImgUpload}"
          :file-list="uploadPersonNoFrontImgList"
          :on-remove="handlePersonNoFrontImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="法人身份证背面" prop="personSideImg">
        <el-input v-show="false" v-model="dataForm.personSideImg"></el-input>
        <el-upload
          :action="uploadpersonNoSideImgUrl"
          list-type="picture-card"
          :on-preview="handlepersonNoSideImgPreview"
          :before-upload="beforepersonNoSideImgUpload"
          :on-success="handlepersonNoSideImgSuccess"
          :class="{hideTrue:hidepersonNoSideImgUpload}"
          :file-list="uploadpersonNoSideImgList"
          :on-remove="handlepersonNoSideImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt/>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitLoading" type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getMethod, postMethod, getUploadUrl} from "@/api/request";
import {luhnCheck} from "@/utils/validate";
import axios from 'axios'
import addressData from "@/utils/address.json"

export default {
  computed: {},
  mounted() {
    console.log(addressData,'addressData');
    this.loadprovinceList();
    this.buildLicenseImgGroupId();
    this.buildPersonNoFrontImgGroupId();
    this.buildpersonNoSideImgGroupId();
    this.buildProtocalFileGroupId();
        console.log(this.editData);
    this.$nextTick(function () {
      if (this.editData.id) {
        this.dataForm = this.editData;
        this.initDefaultImage();
        this.disabledLoginNo = true
        this.disabledSupplierNo = true
      }
    });
  },
  created() {
  },
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    const isMobileNumber = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      const isPhone = reg.test(value);
      value = Number(value); //转换为数字
      if (typeof value === "number" && !isNaN(value)) {//判断是否为数字
        value = value.toString(); //转换成字符串
        if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
          callback(new Error("电话号码格式如:138xxxx8754"));
        } else {
          callback();
        }
      } else {
        callback(new Error("电话号码输入错误"));
      }
    }

    const isUploadLicenseImg = (rule, value, callback) => {
      if (this.uploadLicenseImgList <= 0) {
        callback(new Error("请上传营业执照照片"));
      } else {
        callback();
      }
    }

    const isUploadPersonNoFrontImg = (rule, value, callback) => {
      if (this.uploadPersonNoFrontImgList.length <= 0) {
        callback(new Error("请上传法人身份证正面照片"));
      } else {
        callback();
      }
    }

    const isUploadPersonNoSideImg = (rule, value, callback) => {
      if (this.uploadpersonNoSideImgList.length <= 0) {
        callback(new Error("请上传法人身份证背面照片"));
      } else {
        callback();
      }
    }

    const isUploadProtocalFile = (rule, value, callback) => {
      if (this.uploadProtocalFileList.length <= 0) {
        callback(new Error("请上传协议文件"));
      } else {
        callback();
      }
    }

    const validateBankNo = (rule, value, callback) => {
      if (!luhnCheck(this.dataForm.bankCard)) {
        callback(new Error("银行卡号输入错误"));
      } else {
        callback();
      }
    }
    return {
      addressData:addressData,
      submitLoading: false,
      disabledLoginNo: false,
      disabledSupplierNo: false,
      goodTypeList: [],
      goodBrandList: [],
      provinceList: [],
      uploadLicenseImgList: [],
      hideLicenseImgUpload: false,
      uploadLicenseImgUrl: "",
      uploadPersonNoFrontImgList: [],
      hidePersonNoFrontImgUpload: false,
      uploadPersonNoFrontImgUrl: "",
      uploadpersonNoSideImgList: [],
      hidepersonNoSideImgUpload: false,
      uploadpersonNoSideImgUrl: "",
      uploadProtocalFileList: [],
      hideProtocalFileUpload: true,
      uploadProtocalFileUrl: "",
      ProtocalFileFileList: [],
      fileSortImage: 0,
      imageUrl: "",
      fileList: [],
      dataForm: {
        supplierName: "",
        supplierNo: "",
        loginAccount: "",
        userName: "",
        phoneNo: "",
        phoneNo: "",
        taxNo: '',
        email: '',
        address: "",
        bankName: "",
        bankCard: "",
        hxNo: "",
        hxSkillGroup: '',
        hxLoginNo: '',
        hxLoginPwd: '',
        provinceId: "",
        licenseImg: "",
        personFrontImg: "",
        personSideImg: "",
        protocolFile: "",
        id: ""
      },
      rules: {
        supplierName: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'},
        ],
        supplierNo: [
          {required: true, message: '请输入供应商编号', trigger: 'blur'},
        ],
        loginAccount: [
          {required: true, message: '请输入登陆账号', trigger: 'blur'},
        ],
        userName: [
          {required: true, message: '请输入联系人', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        phoneNo: [
          {required: true, message: "请输入手机号码", trigger: "blur"},
          {validator: isMobileNumber, trigger: "blur"}
        ],
        taxNo: [
          {required: true, message: '请输入税务代码', trigger: 'blur'},
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
        ],
        provinceId: [
          {required: true, message: '请选择省份', trigger: 'change'},
        ],
        licenseImg: [
          {required: true, validator: isUploadLicenseImg, trigger: "blur"}
        ],
        personFrontImg: [
          {required: true, validator: isUploadPersonNoFrontImg, trigger: "blur"}
        ],
        personSideImg: [
          {required: true, validator: isUploadPersonNoSideImg, trigger: "blur"}
        ],
        protocolFile: [
          {required: true, validator: isUploadProtocalFile, trigger: "blur"}
        ],
        bankName: [
          {required: true, message: '请输入银行名称', trigger: 'blur'},
        ],
        bankCard: [
          {required: true, message: '请输入银行卡号', trigger: 'blur'},
        ],
      },

    };
  },
  methods: {
    handlePreview(file) {
      console.log(file);
      window.open(file.url)
    },
    loadprovinceList() {
        this.provinceList = this.addressData.data
    },
    buildLicenseImgGroupId() {
      getMethod("/oss/get-group-id", null).then(res => {
        this.uploadLicenseImgUrl =
          getUploadUrl() + "?groupId=" + res.data;
        this.dataForm.licenseImg = this.dataForm.licenseImg || res.data;
      });
    },
    handleLicenseImgPreview() {
    },
    handleLicenseImgRemove(res) {
      for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
        if (
          this.uploadLicenseImgList[i].url == (res.url || res.response.data.url)
        ) {
          this.uploadLicenseImgList.splice(i, 1);
          break;
        }
      }
      this.hideLicenseImgUpload = false;
    },
    handleLicenseImgSuccess(res, file) {

      res.data.fileType = file.raw.type;
      res.data.sort = this.fileSortImage++;
      this.uploadLicenseImgList.push(res.data);
      let groupId = res.data.groupId;
      let imageCnt = 0;
      for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
        if (this.uploadLicenseImgList[i].groupId == groupId) {
          imageCnt++;
        }
      }
      console.log(imageCnt)
      if (imageCnt >= 1) {
        this.hideLicenseImgUpload = true;
      }
      this.clearValidate('licenseImg')
      this.dataForm.licenseImg = res.data.url
    },
    beforeLicenseImgUpload(file) {
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
      if (file.name.length > 30) {
        this.$message.error("上传文件名称大小不能超过30个字符!");
        return false;
      }

      return fileTypeVerify && isLt2M;
    },
    buildPersonNoFrontImgGroupId() {
      getMethod("/oss/get-group-id", null).then(res => {
        this.uploadPersonNoFrontImgUrl = getUploadUrl() + "?groupId=" + res.data;
        this.dataForm.personFrontImg = this.dataForm.personFrontImg || res.data;
      });
    },
    handlePersonNoFrontImgPreview() {
    },
    handlePersonNoFrontImgRemove(res) {
      this.hidePersonNoFrontImgUpload = false;
      for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
        if (
          this.uploadPersonNoFrontImgList[i].url == (res.url || res.response.data.url)
        ) {
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
      this.clearValidate('personFrontImg')
      this.dataForm.personFrontImg = res.data.url
    },
    beforePersonNoFrontImgUpload(file) {
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
      if (file.name.length > 30) {
        this.$message.error("上传文件名称大小不能超过30个字符!");
        return false;
      }

      return fileTypeVerify && isLt2M;
    },
    buildpersonNoSideImgGroupId() {
      getMethod("/oss/get-group-id", null).then(res => {
        this.uploadpersonNoSideImgUrl =
          getUploadUrl() + "?groupId=" + res.data;
        this.dataForm.personSideImg =
          this.dataForm.personSideImg || res.data;
      });
    },
    handlepersonNoSideImgPreview() {
    },
    handlepersonNoSideImgRemove(res) {
      for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
        if (
          this.uploadpersonNoSideImgList[i].url == (res.url || res.response.data.url)
        ) {
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
      this.clearValidate('personSideImg')
      this.dataForm.personSideImg = res.data.url
    },
    beforepersonNoSideImgUpload(file) {
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
      if (file.name.length > 30) {
        this.$message.error("上传文件名称大小不能超过30个字符!");
        return false;
      }
      return fileTypeVerify && isLt2M;
    },
    buildProtocalFileGroupId() {
      if (this.dataForm.protocolFile == "") {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadProtocalFileUrl =
            getUploadUrl() + "?groupId=" + res.data;
          this.dataForm.protocolFile =
            this.dataForm.protocolFile || res.data;
        });
      } else {
        this.uploadProtocalFileUrl =
          getUploadUrl() + "?groupId=" + this.dataForm.protocolFile;
      }
    },
    handleProtocalFilePreview() {
    },
    handleProtocalFileRemove(res) {
      console.log(res,this.uploadProtocalFileList);
      for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
        if (
          this.uploadProtocalFileList[i].url == (res.url || res.response.data.url)
        ) {
          this.uploadProtocalFileList.splice(i, 1);
          break;
        }
      }
    },
    downloadFile(file) {
      /*console.info(file);
      window.open(file.url);*/
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = file.url;
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
      this.clearValidate('protocolFile')
      this.dataForm.protocolFile = res.data.url
    },
    beforeProtocalFileUpload(file) {
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
      if (file.name.length > 30) {
        this.$message.error("上传文件名称大小不能超过30个字符!");
        return false;
      }
      return fileTypeVerify && isLt2M;
    },
    initDefaultImage() {
      // this.fileList = this.dataForm.files;
      // for (let i = 0; i < this.dataForm.files.length; i++) {
      //   let imageObj = this.dataForm.files[i];
      //   if (imageObj.groupId == this.dataForm.licenseImg) {
      //     this.uploadLicenseImgList.push(imageObj);
      //   }
      //   if (imageObj.groupId == this.dataForm.personFrontImg) {
      //     this.uploadPersonNoFrontImgList.push(imageObj);
      //   }
      //   if (imageObj.groupId == this.dataForm.personSideImg) {
      //     this.uploadpersonNoSideImgList.push(imageObj);
      //   }
      //   if (imageObj.groupId == this.dataForm.protocolFile) {
      //     this.uploadProtocalFileList.push(imageObj);
      //   }
      // }
      // let obj = {
      //   url:this.dataForm.licenseImg
      // }
      if(this.dataForm.licenseImg&&this.dataForm.licenseImg!=''){
          this.uploadLicenseImgList.push({url:this.dataForm.licenseImg})
      }
      if(this.dataForm.personFrontImg&&this.dataForm.personFrontImg!=''){
          this.uploadPersonNoFrontImgList.push({url:this.dataForm.personFrontImg})
      }
      if(this.dataForm.personSideImg&&this.dataForm.personSideImg!=''){
          this.uploadpersonNoSideImgList.push({url:this.dataForm.personSideImg})
      }
      if(this.dataForm.protocolFile&&this.dataForm.protocolFile!=''){
          this.uploadProtocalFileList.push({url:this.dataForm.protocolFile})
      }
      if (this.uploadLicenseImgList.length >= 1) {
        this.hideLicenseImgUpload = true;
      }

      if (this.uploadPersonNoFrontImgList.length >= 1) {
        this.hidePersonNoFrontImgUpload = true;
      }

      if (this.uploadpersonNoSideImgList.length >= 1) {
        this.hidepersonNoSideImgUpload = true;
      }

      if (this.uploadProtocalFileList.length >= 1) {
        this.hideProtocalFileUpload = true;
      }
    },
    saveObject() {
      this.submitLoading = true
      let scope = this;
      console.log('dataform',this.dataForm);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          delete this.dataForm.createTime;
          delete this.dataForm.createBy;
          delete this.dataForm.enable;
          delete this.dataForm.updateTime;
          Object.keys(this.dataForm).forEach(item=>{
              if(!this.dataForm[item])  delete this.dataForm[item]
          })
          console.log('dataform',this.dataForm);
          let fileList = [];
          fileList = fileList.concat(this.uploadLicenseImgList);
          fileList = fileList.concat(this.uploadPersonNoFrontImgList);
          fileList = fileList.concat(this.uploadpersonNoSideImgList);
          fileList = fileList.concat(this.uploadProtocalFileList);
          // this.dataForm.fileJsonStr = JSON.stringify(fileList);
          // this.dataForm.files = [];
          console.log('11111',this.dataForm);
          if(this.dataForm.id&&this.dataForm.id!=''){
            postMethod("/supplier/update-supplier", this.dataForm).then(
              res => {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                scope.submitLoading = false
                this.$emit("showListPanel", true);
              }
            ).catch(error => {
              this.submitLoading = false
            });
          }else{
            postMethod("/supplier/add-supplier", this.dataForm).then(
            res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              scope.submitLoading = false
              this.$emit("showListPanel", true);
            }
          ).catch(error => {
            this.submitLoading = false
          });
          }

        } else {
          scope.submitLoading = false
          return false;
        }
      })
    },
    cancelUpdate() {
      this.$emit("showListPanel", true);
    },
    submitUpdate() {
      this.saveObject();
    },
    clearValidate(field) {
      let _field = this.$refs['dataForm'].fields /*当然，你可以打印一下fields*/
      _field.map(i => {
        if (i.prop === field) {  //通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
          i.resetField()
          return false
        }
      })
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
.hideTrue .el-upload--picture-card {
  display: none!important;
}
</style>
