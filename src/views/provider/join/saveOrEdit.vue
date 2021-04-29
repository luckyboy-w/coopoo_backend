<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="150px">
      <el-form-item label="服务商名称" prop="provinceName">
        <el-input v-model="dataForm.provinceName" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item label="服务商等级" prop="provinceRole">
        <el-select v-if="dataForm.provinceRole!='6'" v-model="dataForm.provinceRole" :disabled="!viewSubmit" @change="switchLevel">
          <el-option v-for="item in provinceRoleList" :key="item.id" :value-key="item.providerLevelLabel" :label="item.providerLevelLabel"
            :value="item.id" />
        </el-select>
        <el-select v-if="dataForm.provinceRole=='6'" v-model="dataForm.provinceRole" disabled="">
          <el-option value="6" label="EA类(个人类型)"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="mobileTitle" prop="mobileNo">
        <el-input v-model="dataForm.mobileNo" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-show="false" label="店主电话" prop="mobileNo">
        <el-input v-model="dataForm.mobileNo" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-show="!isPersonProvince" label="店主姓名" prop="owerName">
        <el-input v-model="dataForm.owerName" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-show="!isPersonProvince|| dataForm.type==2" label="公司名称" prop="companyName">
        <el-input v-model="dataForm.companyName" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-show="!isPersonProvince|| dataForm.type==2" label="税务代码" prop="taxNo">
        <el-input v-model="dataForm.taxNo" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item label="推荐人电话" prop="referenceNo">
        <el-input v-model="dataForm.referenceNo" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-show="!isPersonProvince" label="门店状态">
        <el-input v-show="false" v-model="dataForm.shopStatus" :disabled="!viewSubmit" />
        <el-radio-group v-model="dataForm.shopStatus">
          <el-radio-button v-for="item in shopStatusList" :key="item.label" :label="item.label" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="!isPersonProvince" label="店铺优势">
        <el-input v-model="dataForm.forte" :disabled="!viewSubmit" />
      </el-form-item>

      <el-form-item v-if="dataForm.provinceRole!='5'&&dataForm.provinceRole!='6'" label="自然人/公司" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择">
          <el-option :value="1" label="个人"></el-option>
          <el-option :value="2" label="公司"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="dataForm.idCard" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item  v-if="dataForm.provinceRole=='6'" label="身份证正面照片">
      <img style="width: 150px;height: 150px;" :src="this.dataForm.personFrontImg" alt>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="身份证正面照片" prop="personFrontImg">
        <el-input v-show="false" v-model="dataForm.personFrontImg" />
        <el-upload :disabled="!viewSubmit" :action="uploadFrontUrl" list-type="picture-card" :on-preview="handleLicensePreview"
          :before-upload="beforeFrontUpload" :on-success="handleFrontSuccess" :class="{hide:hideFrontUpload}"
          :file-list="uploadFrontList" :on-remove="handleFrontRemove">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole=='6'" label="身份证反面照片">
        <img  style="width: 150px;height: 150px;" width="100%" :src="this.dataForm.personSideImg" alt>
        </el-form-item>
      <el-form-item  v-if="dataForm.provinceRole!='6'" label="身份证反面照片" prop="personSideImg">
        <el-input v-show="false" v-model="dataForm.personSideImg" />
        <el-upload :disabled="!viewSubmit" :action="uploadSideUrl" list-type="picture-card" :on-preview="handleLicensePreview"
          :before-upload="beforeSideUpload" :on-success="handleSideSuccess" :class="{hide:hideSideUpload}" :file-list="uploadSideList"
          :on-remove="handleSideRemove">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-show="!isPersonProvince || dataForm.type==2" label="营业执照照片" prop="licenseImg">
        <el-input v-show="false" v-model="dataForm.licenseImg" />
        <el-upload :disabled="!viewSubmit" :action="uploadLicenseUrl" list-type="picture-card" :on-preview="handleLicensePreview"
          :before-upload="beforeLicenseUpload" :on-success="handleLicenseSuccess" :class="{hide:hideLicenseUpload}"
          :file-list="uploadLicenseList" :on-remove="handleLicenseRemove">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-show="!isPersonProvince|| dataForm.type==2" label="银行开户许可照片" prop="bankLicenseImg">
        <el-input v-show="false" v-model="dataForm.bankLicenseImg" />
        <el-upload :disabled="!viewSubmit" :action="uploadBankLicenseUrl" list-type="picture-card" :on-preview="handleBankLicensePreview"
          :before-upload="beforeLicenseUpload" :on-success="handleBankLicenseSuccess" :class="{hide:hideBankLicenseUpload}"
          :file-list="uploadBankLicenseList" :on-remove="handleBankLicenseRemove">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="文件协议" prop="protocalFile">
        <el-input v-show="false" v-model="dataForm.protocalFile" />
        <el-upload :disabled="!viewSubmit" :action="uploadProtocalUrl" list-type="text" :before-upload="beforeProtocalUpload"
          :on-success="handleProtocalSuccess" :on-remove="handleProtocalRemove" :show-file-list="false" :file-list="protocalFileList">
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png/pdf文件，且不超过5mb
          </div>
          <el-button size="small" :disabled="!hideProtocalUpload" type="primary">
            点击上传
          </el-button>
        </el-upload>
        <ul class="el-upload-list el-upload-list--text">
          <li v-for="(item,index) in protocalFileList" :key="index" tabindex="0" class="el-upload-list__item is-success el-list-enter-to">
            <!---->
            <a class="el-upload-list__item-name " @click="downlandFile(item)"><i class="el-icon-document" />{{ item.name }}</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"
                :disabled="!viewSubmit" @click="handleProtocalRemove(item)" /></label><i v-show="viewSubmit" class="el-icon-close"
              @click="handleProtocalRemove(item)" />
          </li>
        </ul>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="开户银行" prop="bankName">
        <el-input v-model="dataForm.bankName" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="银行账号" prop="cardNo">
        <el-input v-model="dataForm.cardNo" :disabled="!viewSubmit" />
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="地区" prop="area">
        <el-select v-model="dataForm.province" @change="loadcityList(true)">
          <el-option v-for="item in provinceList" :key="item.provinceid" :value-key="item.province" :label="item.province"
            :value="item.provinceid" />
        </el-select>
        <el-select v-model="dataForm.city">
          <el-option v-for="item in cityList" :key="item.cityid" :value-key="item.city" :label="item.city" :value="item.cityid" />
        </el-select>
        <div style="line-height:10px">
          &nbsp;
        </div>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="公司详细地址" prop="address">
        <el-input v-model="dataForm.address" />
      </el-form-item>
      <el-form-item>
        <el-button v-show="viewSubmit" :loading="submitLoading" type="primary" @click="submitUpdate">
          添加
        </el-button>
        <el-button v-show="viewSubmit" @click="cancelUpdate">
          取消
        </el-button>
        <el-button v-show="!viewSubmit" @click="cancelUpdate">
          返回列表
        </el-button>
      </el-form-item>
    </el-form>

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
  } from '@/api/request'
  import {
    luhnCheck
  } from '@/utils/validate'

  export default {
    props: {
      editData: {
        type: Object,
        required: false
      },
      oper: {
        type: String,
        required: true
      }
    },
    data() {
      const isMobileNumber = (rule, value, callback) => {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) { //判断是否为数字
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

      const validateReferenceNo = (rule, value, callback) => {
        if (this.dataForm.referenceNo == '' || this.dataForm.referenceNo == undefined) {
          callback();
          return
        }
        isMobileNumber(rule, value, callback)
      }

      const isUploadLicenseImg = (rule, value, callback) => {
        if (!this.isPersonProvince && this.uploadLicenseList <= 0) {
          callback(new Error("请上传营业执照照片"));
        } else {
          callback();
        }
      }

      const isUploadPersonNoFrontImg = (rule, value, callback) => {
        if (this.uploadFrontList.length <= 0) {
          callback(new Error("请上传法人身份证正面照片"));
        } else {
          callback();
        }
      }

      const isUploadPersonNoSideImg = (rule, value, callback) => {
        if (this.uploadSideList.length <= 0) {
          callback(new Error("请上传法人身份证背面照片"));
        } else {
          callback();
        }
      }

      const isUploadBankLicenseImg = (rule, value, callback) => {
        if (this.uploadBankLicenseList.length <= 0) {
          callback(new Error("请上传银行开户许可照片"));
        } else {
          callback();
        }
      }

      const isUploadProtocalFile = (rule, value, callback) => {
        if (this.protocalFileList.length <= 0) {
          callback(new Error("请上传协议文件"));
        } else {
          callback();
        }
      }

      const validateBankNo = (rule, value, callback) => {
        if (!luhnCheck(this.dataForm.cardNo)) {
          callback(new Error("银行账号输入错误"));
        } else {
          callback();
        }
      }

      const validateOwnerName = (rule, value, callback) => {
        if (!this.isPersonProvince && (this.dataForm.owerName == '' || this.dataForm.owerName == undefined)) {
          callback(new Error("请输入店主姓名"));
        } else {
          callback();
        }
      }

      const validateTaxNo = (rule, value, callback) => {
        const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
        const isCorrect = reg.test(value);
        if (!isCorrect) {
          callback(new Error("税务代码输入错误！"));
        } else {
          callback();
        }
      }

      const validateArea = (rule, value, callback) => {
        if (this.dataForm.province == "" || this.dataForm.province == undefined) {
          callback(new Error("请选择省"));
          return
        }

        if (this.dataForm.city == "" || this.dataForm.city == undefined) {
          callback(new Error("请选择市"));
          return;
        }

        callback()
      }

      return {
        E_: '',
        len: '',
        radio: '',
        submitLoading: false,
        dialogVisible: false,
        dialogImageUrl: '',
        viewSubmit: true,
        mobileTitle: '手机号码',
        fileSortImage: 0,
        isPersonProvince: true,
        items: [{
            value: 1,
            label: '个人'
          },
          {
            value: 2,
            label: '公司'
          }
        ],
        provinceRoleList: [],
        provinceList: [],
        cityList: [],
        shopStatusList: this.GLOBAL.shopStatusList,
        hideFrontUpload: false,
        uploadFrontUrl: '',
        hideSideUpload: false,
        uploadSideUrl: '',
        hideLicenseUpload: false,
        hideBankLicenseUpload: false,
        uploadLicenseUrl: '',
        uploadBankLicenseUrl: '',
        hideProtocalUpload: true,
        uploadProtocalUrl: '',
        protocalFileList: [],
        uploadFrontList: [],
        uploadSideList: [],
        uploadLicenseList: [],
        uploadBankLicenseList: [],
        imageUrl: '',
        fileList: [],
        dataForm: {
          idCard:'',
          provinceName: '',
          provinceNo: '',
          owerName: '',
          owerMobileNo: '',
          forte: '',
          type: '',
          shopStatus: '',
          mobileNo: '',
          protocalFile: '',
          personFrontImg: '',
          personSideImg: '',
          licenseImg: '',
          bankLicenseImg: '',
          referenceNo: '',
          bankName: '',
          cardNo: '',
          provinceRole: '',
          province: '',
          city: '',
          getFileJsonStr: {},
          files: [],
          id: '',

        },
        rules: {
          provinceName: [{
            required: true,
            message: '请输入服务商名称',
            trigger: 'blur'
          }, ],
          provinceRole: [{
            required: true,
            message: '请选择服务商等级',
            trigger: 'change'
          }, ],
          mobileNo: [{
              required: true,
              message: "请输入手机号码",
              trigger: "blur"
            },
            {
              validator: isMobileNumber,
              trigger: "blur"
            }
          ],
          referenceNo: [{
            validator: validateReferenceNo,
            trigger: "blur"
          }],
          owerName: [{
            required: true,
            validator: validateOwnerName,
            message: '请输入店主姓名',
            trigger: 'blur'
          }, ],
          // companyName: [
          //   { required: true, message: '请输入公司名称', trigger: 'blur' },
          // ],
          // taxNo: [
          //   { required: true, message: "请输入税务代码", trigger: "blur"},
          //   { required: true, validator: validateTaxNo, trigger: 'blur' },
          // ],
          // licenseImg: [
          //   { required: true, validator: isUploadLicenseImg, trigger: "blur" }
          // ],
          personFrontImg: [{
            required: true,
            validator: isUploadPersonNoFrontImg,
            trigger: "blur"
          }],
          personSideImg: [{
            required: true,
            validator: isUploadPersonNoSideImg,
            trigger: "blur"
          }],
          protocalFile: [{
            required: true,
            validator: isUploadProtocalFile,
            trigger: "blur"
          }],
          // bankLicenseImg: [
          //   { required: true, validator: isUploadBankLicenseImg, trigger: "blur" }
          // ],
          bankName: [{
            required: true,
            message: '请输入开户银行',
            trigger: 'blur'
          }, ],
          cardNo: [{
              required: true,
              message: '请输入银行账号',
              trigger: 'blur'
            },
          ],
          area: [{
            required: true,
            validator: validateArea,
            trigger: "change"
          }],
          address: [{
            required: true,
            message: '请输入公司详细地址',
            trigger: 'blur'
          }, ],
        }
      }
    },
    computed: {},
    watch: {
      provinceList: function() {
        this.$nextTick(function() {
          this.initDefaultImage()
          this.dataForm.province = this.dataForm.province
          this.loadcityList(false)
          if (this.dataForm.provinceRole != undefined) {
            this.switchLevel(this.dataForm.provinceRole)
          }
        })
      },
      cityList: function() {
        this.$nextTick(function() {
          this.dataForm.city = this.editData.city
        })
      }
    },
    mounted() {
      this.loadprovinceRoleList()

      // setTimeout(() =>{
      this.$nextTick(function() {
        if (this.editData.id) {
          if (this.editData.E_) {
            this.E_ = this.editData.E_
          }
		  if(this.editData.provinceRole=="6"){
        this.dataForm.personFrontImg=this.editData.personFrontImg
        this.dataForm.personSideImg=this.editData.personSideImg
		  }

          this.dataForm = this.editData
          this.switchLevel(this.editData.provinceRole)
        }
        this.loadprovinceList()

        this.buildFrontGroupId()
        this.buildSideGroupId()
        this.buildLicenseGroupId()
        this.buildProtocalGroupId()
        this.buildBankLicenseImgGroupId()
      })
      if (this.oper == 'view') {
        this.viewSubmit = false
      }
      // },500);


    },
    created() {

    },
    methods: {
      downlandFile(item) {
        window.open(item.url)
      },
      initDefaultImage() {
        this.fileList = this.dataForm.files
        for (let i = 0; i < this.dataForm.files.length; i++) {
          const imageObj = this.dataForm.files[i]
          if (imageObj.groupId == this.dataForm.protocalFile) {
            this.protocalFileList.push(imageObj)
          }
          if (imageObj.groupId == this.dataForm.personFrontImg) {
            this.uploadFrontList.push(imageObj)
          }
          if (imageObj.groupId == this.dataForm.personSideImg) {
            this.uploadSideList.push(imageObj)
          }
          if (imageObj.groupId == this.dataForm.licenseImg) {
            this.uploadLicenseList.push(imageObj)
          }
          if (imageObj.groupId == this.dataForm.bankLicenseImg) {
            this.uploadBankLicenseList.push(imageObj)
          }
        }
        if (this.protocalFileList.length >= 1) {
          this.hideProtocalUpload = false
        }

        if (this.uploadFrontList.length >= 1) {
          this.hideFrontUpload = true
        }

        if (this.uploadSideList.length >= 1) {
          this.hideSideUpload = true
        }

        if (this.uploadLicenseList.length >= 1) {
          this.hideLicenseUpload = true
        }

        if (this.uploadBankLicenseList.length >= 1) {
          this.hideBankLicenseUpload = true
        }
      },
      switchLevel(val) {
        let obj = {}
        obj = this.provinceRoleList.find((item) => {
          return item.id === val
        })
        if (obj == undefined) {
          return
        }
        const getName = obj.providerLevel
        if (getName == 'E类') {
          this.isPersonProvince = false
          this.mobileTitle = '店主电话'
        } else {
          this.isPersonProvince = true
          this.mobileTitle = '手机号码'
        }
      },
      loadprovinceRoleList() {
        const scope = this
        const param = {
          parentId: '-1' //,
          //enable: 1
        }
        getMethod('/backend/providerRole/findList', param).then(res => {
          scope.provinceRoleList = res.data
        })
      },
      loadprovinceList() {
        const scope = this
        const param = {
          parentId: '-1'
        }
        getMethod('/backend/areas/findProvince', param).then(res => {
          scope.provinceList = res.data
        })
      },
      loadcityList(clearValue) {
        const scope = this
        const param = {
          provinceid: this.dataForm.province
        }
        if (this.dataForm.province == '') {
          return
        }
        getMethod('/backend/areas/findCity', param).then(res => {
          if (clearValue) {
            this.dataForm.city = ''
          }
          scope.cityList = res.data
        })
      },
      buildFrontGroupId() {
        if (this.dataForm.personFrontImg == '') {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadFrontUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.personFrontImg = res.data
          })
        } else {
          this.uploadFrontUrl = getUploadUrl() + '?groupId=' + this.dataForm.personFrontImg
        }
      },
      handleFrontPreview() {},
      handleFrontRemove(res) {
        for (let i = 0; i < this.uploadFrontList.length; i++) {
          if (this.uploadFrontList[i].url == (res.url || res.response.data.url)) {
            this.uploadFrontList.splice(i, 1)
            break
          }
        }
        this.hideFrontUpload = false
      },
      handleFrontSuccess(res, file) {
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.uploadFrontList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadFrontList.length; i++) {
          if (this.uploadFrontList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideFrontUpload = true
        }
        this.clearValidate('personFrontImg')
        this.dataForm.personFrontImg = res.data.groupId
      },
      beforeFrontUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      buildSideGroupId() {
        if (this.dataForm.personSideImg == '') {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadSideUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.personSideImg = res.data
          })
        } else {
          this.uploadSideUrl = getUploadUrl() + '?groupId=' + this.dataForm.personSideImg
        }
      },
      handleSidePreview() {},
      handleSideRemove(res) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.uploadSideList[i].url == (res.url || res.response.data.url)) {
            this.uploadSideList.splice(i, 1)
            break
          }
        }
        this.hideSideUpload = false
      },
      handleSideSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadSideList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadSideList.length; i++) {
          if (this.uploadSideList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideSideUpload = true
        }
        this.clearValidate('personSideImg')
        this.dataForm.personSideImg = res.data.groupId
      },
      beforeSideUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      buildLicenseGroupId() {
        if (this.dataForm.licenseImg == '' ||
          this.dataForm.licenseImg == undefined) {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadLicenseUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.licenseImg = res.data
          })
        } else {
          this.uploadLicenseUrl = getUploadUrl() + '?groupId=' + this.dataForm.licenseImg
        }
      },
      handleLicensePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleLicenseRemove(res) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].url == (res.url || res.response.data.url)) {
            this.fileList.splice(i, 1)
            break
          }
        }
        this.hideLicenseUpload = false
      },
      handleLicenseSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadLicenseList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadLicenseList.length; i++) {
          if (this.uploadLicenseList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideLicenseUpload = true
        }
        this.clearValidate('licenseImg')
        this.dataForm.licenseImg = res.data.groupId
      },
      beforeLicenseUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      handleBankLicensePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleBankLicenseRemove(res) {
        for (let i = 0; i < this.uploadBankLicenseList.length; i++) {
          if (this.uploadBankLicenseList[i].url == (res.url || res.response.data.url)) {
            this.uploadBankLicenseList.splice(i, 1)
            break
          }
        }
        this.hideBankLicenseUpload = false
      },
      handleBankLicenseSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadBankLicenseList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadBankLicenseList.length; i++) {
          if (this.uploadBankLicenseList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideBankLicenseUpload = true
        }
        this.clearValidate('bankLicenseImg')
        this.dataForm.bankLicenseImg = res.data.groupId
      },
      beforeLicenseUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      buildProtocalGroupId() {
        if (this.dataForm.protocalFile == '') {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadProtocalUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.protocalFile = res.data
          })
        } else {
          this.uploadProtocalUrl = getUploadUrl() + '?groupId=' + this.dataForm.protocalFile
        }
      },
      buildBankLicenseImgGroupId() {
        if (this.dataForm.bankLicenseImg == '' || this.dataForm.bankLicenseImg == undefined) {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadBankLicenseUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.bankLicenseImg = res.data
          })
        } else {
          this.uploadBankLicenseUrl = getUploadUrl() + '?groupId=' + this.dataForm.bankLicenseImg
        }
      },
      handleProtocalPreview() {},
      handleProtocalRemove(res) {

        for (let i = 0; i < this.protocalFileList.length; i++) {
          if (this.protocalFileList[i].url == (res.url || res.response.data.url)) {
            this.protocalFileList.splice(i, 1)
            break
          }
        }
        this.hideProtocalUpload = true
      },
      handleProtocalSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        res.data.name = file.name
        this.protocalFileList.push(res.data)

        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.protocalFileList.length; i++) {
          if (this.protocalFileList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideProtocalUpload = false
        }
        this.clearValidate('protocalFile')
        this.dataForm.protocalFile = res.data.groupId
      },
      beforeProtocalUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      saveObject() {
        this.submitLoading = true
        let scope = this;
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            delete this.dataForm.createTime
            delete this.dataForm.createBy
            let fileList = []
            fileList = fileList.concat(this.uploadFrontList)
            fileList = fileList.concat(this.uploadSideList)
            fileList = fileList.concat(this.uploadLicenseList)
            fileList = fileList.concat(this.protocalFileList)
            fileList = fileList.concat(this.uploadBankLicenseList)
            this.len = fileList.length
            this.dataForm.fileJsonStr = JSON.stringify(fileList)
            this.dataForm.files = []
            if (this.dataForm.provinceRole == '5') {
              this.dataForm.type = '2'
            }
            if (this.dataForm.provinceRole == '6') {
              this.dataForm.type = '1'
            }
            if (this.dataForm.type == '2' || this.dataForm.provinceRole == '5') {
              if (this.dataForm.companyName == '' || this.dataForm.companyName == undefined) {
                this.$message({
                  message: '公司名不能为空',
                  type: 'warning'
                })
                this.submitLoading = false
                return;
              }
              if (this.dataForm.taxNo == '' || this.dataForm.taxNo == undefined) {
                this.$message({
                  message: '税务代码不能为空',
                  type: 'warning'
                })
                this.submitLoading = false
                return;
              }
              if (this.len < '5') {
                this.$message({
                  message: '照片或文件未满足所需',
                  type: 'warning'
                })
                this.submitLoading = false
                return;
              }
            }
            postMethod('/backend/lyProvider/update', this.dataForm).then(
              res => {
                scope.submitLoading = false
                if (res.code != 200) {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  })
                  return;
                }
                scope.typeList = res.data
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              }
            ).catch(error => {
              this.submitLoading = false
            });
          } else {
            scope.submitLoading = false
            return false;
          }
        })
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      submitUpdate() {
        this.saveObject()
      },
      clearValidate(field) {
        let _field = this.$refs['dataForm'].fields /*当然，你可以打印一下fields*/
        _field.map(i => {
          if (i.prop === field) { //通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
            i.resetField()
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 650px;
  }
</style>
<style lang="scss">
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
