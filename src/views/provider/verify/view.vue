<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="服务商名称" required>
        <el-input v-model="dataForm.provinceName" disabled="true"/>
      </el-form-item>
      <el-form-item label="服务商等级" required>
        <el-select v-if="dataForm.provinceRole!='6'" v-model="dataForm.provinceRole" disabled="true"
                   @change="switchLevel"
        >
          <el-option v-for="item in provinceRoleList" :key="item.id" :value-key="item.providerLevelLabel"
                     :label="item.providerLevelLabel"
                     :value="item.id"
          />
        </el-select>
        <el-select v-if="dataForm.provinceRole=='6'" v-model="dataForm.provinceRole" disabled="">
          <el-option value="6" label="EA类(个人类型)"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服务商编号" required>
        <el-input v-model="dataForm.provinceNo" disabled="true"/>
      </el-form-item>
      <el-form-item :label="mobileTitle" required>
        <el-input v-model="dataForm.mobileNo" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="false" label="店主电话" prop="mobileNo">
        <el-input v-model="dataForm.mobileNo" :disabled="!viewSubmit"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="店主姓名" required>
        <el-input v-model="dataForm.owerName" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="公司名称" required>
        <el-input v-model="dataForm.companyName" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="税务代码" required>
        <el-input v-model="dataForm.taxNo" disabled="true"/>
      </el-form-item>
      <el-form-item label="推荐人电话">
        <el-input v-model="dataForm.referenceNo" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="门店状态">
        <el-input v-show="false" v-model="dataForm.shopStatus" disabled="true"/>
        <el-radio-group v-model="dataForm.shopStatus">
          <el-radio-button v-for="item in shopStatusList" :key="item.label" :label="item.label"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="店铺优势">
        <el-input v-model="dataForm.forte" disabled="true"/>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="dataForm.idCard" disabled="true"/>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='5'&&dataForm.provinceRole!='6'" label="自然人/公司" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择">
          <el-option :value="1" label="个人"></el-option>
          <el-option :value="2" label="公司"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="dataForm.provinceRole=='6'" label="身份证正面照片" prop="personFrontImg">
        <img style="width: 150px;height: 150px;" :src="this.dataForm.personFrontImg" alt>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="身份证正面照片" required>
        <el-input v-show="false" v-model="dataForm.personFrontImg" disabled="true"/>
        <el-upload disabled="true" :action="uploadFrontUrl" list-type="picture-card" :on-preview="handleLicensePreview"
                   :before-upload="beforeFrontUpload" :on-success="handleFrontSuccess" :class="{hide:hideFrontUpload}"
                   :file-list="uploadFrontList" :on-remove="handleFrontRemove"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole=='6'" label="身份证反面照片" prop="personSideImg">
        <img style="width: 150px;height: 150px;" width="100%" :src="this.dataForm.personSideImg" alt>
      </el-form-item>
      <el-form-item v-if="dataForm.provinceRole!='6'" label="身份证反面照片" required>
        <el-input v-show="false" v-model="dataForm.personSideImg"/>
        <el-upload disabled="true" :action="uploadSideUrl" list-type="picture-card" :on-preview="handleLicensePreview"
                   :before-upload="beforeSideUpload" :on-success="handleSideSuccess" :class="{hide:hideSideUpload}"
                   :file-list="uploadSideList"
                   :on-remove="handleSideRemove"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="营业执照照片" required>
        <el-input v-show="false" v-model="dataForm.licenseImg"/>
        <el-upload disabled="true" :action="uploadLicenseUrl" list-type="picture-card"
                   :on-preview="handleLicensePreview"
                   :before-upload="beforeLicenseUpload" :on-success="handleLicenseSuccess"
                   :class="{hide:hideLicenseUpload}"
                   :file-list="uploadLicenseList" :on-remove="handleLicenseRemove"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="dataForm.type=='2'" label="银行开户许可照片">
        <el-input v-show="false" v-model="dataForm.bankLicenseImg"/>
        <el-upload disabled="true" :action="uploadBankLicenseUrl" list-type="picture-card"
                   :on-preview="handleLicensePreview"
                   :before-upload="beforeLicenseUpload" :on-success="handleBankLicenseSuccess"
                   :class="{hide:hideBankLicenseUpload}"
                   :file-list="uploadBankLicenseList" :on-remove="handleBankLicenseRemove"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item label="文件协议" v-if="dataForm.provinceRole!='6'" required>
        <el-input v-show="false" v-model="dataForm.protocalFile"/>
        <el-upload :disabled="true" :action="uploadProtocalUrl" list-type="text" :before-upload="beforeProtocalUpload"
                   :on-success="handleProtocalSuccess" :on-remove="handleProtocalRemove" :show-file-list="false"
                   :file-list="protocalFileList"
        >
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
          <el-button size="small" :disabled="!hideProtocalUpload" type="primary">点击上传</el-button>
        </el-upload>
        <ul class="el-upload-list el-upload-list--text">
          <li v-for="(item,index) in protocalFileList" :key="index" tabindex="0"
              class="el-upload-list__item is-success el-list-enter-to"
          >
            <!---->
            <a class="el-upload-list__item-name " @click="downlandFile(item)"><i class="el-icon-document"
            />{{ item.name }}</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"
                                                                @click="handleProtocalRemove(item)"
            /></label><i class="el-icon-close" v-if="false" @click="handleProtocalRemove(item)"/>
          </li>
        </ul>

      </el-form-item>
      <el-form-item label="银行名称">
        <el-input v-model="dataForm.bankName" disabled="true"/>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input v-model="dataForm.cardNo" disabled="true"/>
      </el-form-item>
      <el-form-item label="地区">
        <el-select v-model="dataForm.province" disabled="true" @change="loadcityList(true)">
          <el-option v-for="item in provinceList" :key="item.provinceid" :value-key="item.province"
                     :label="item.province"
                     :value="item.provinceid"
          />
        </el-select>
        <el-select v-model="dataForm.city" disabled="true">
          <el-option v-for="item in cityList" :key="item.cityid" :value-key="item.city" :label="item.city"
                     :value="item.cityid"
          />
        </el-select>
        <div style="line-height:10px">&nbsp;</div>
        <el-input v-model="dataForm.address" disabled="true" placeholder="请输入详细地址"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelUpdate">返回列表</el-button>
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
  isInteger
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
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      viewSubmit: true,
      mobileTitle: '手机号码',
      fileSortImage: 0,
      isPersonProvince: true,
      provinceRoleList: [],
      provinceList: [],
      cityList: [],
      shopStatusList: this.GLOBAL.shopStatusList,
      hideFrontUpload: false,
      uploadFrontUrl: '',
      hideSideUpload: false,
      uploadSideUrl: '',
      hideLicenseUpload: false,
      uploadLicenseUrl: '',
      hideProtocalUpload: true,
      uploadBankLicenseUrl: '',
      hideBankLicenseUpload: false,
      uploadProtocalUrl: '',
      protocalFileList: [],
      uploadFrontList: [],
      uploadSideList: [],
      uploadLicenseList: [],
      uploadBankLicenseList: [],
      imageUrl: '',
      fileList: [],
      dataForm: {
        type: '',
        provinceName: '',
        provinceNo: '',
        owerName: '',
        owerMobileNo: '',
        forte: '',
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
        provinceRole: '1',
        province: '',
        city: '',
        getFileJsonStr: {},
        files: [],
        id: ''
      }
    }
  },
  computed: {},
  watch: {
    provinceList: function () {
      this.$nextTick(function () {
        this.initDefaultImage()
        this.dataForm.province = this.dataForm.province
        this.loadcityList(false)
        if (this.dataForm.provinceRole != undefined) {
          this.switchLevel(this.dataForm.provinceRole)
        }
      })
    },
    cityList: function () {
      this.$nextTick(function () {
        this.dataForm.city = this.editData.city
      })
    }
  },
  mounted() {
    this.loadprovinceRoleList()
    this.$nextTick(function () {
      if (this.editData.id) {
        this.dataForm = this.editData
      }
      this.loadprovinceList()

      this.buildFrontGroupId()
      this.buildSideGroupId()
      this.buildLicenseGroupId()
      this.buildProtocalGroupId()
    })
    if (this.oper == 'view') {
      this.viewSubmit = false
    }
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
        parentId: '-1'
        //,enable: 1
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
    handleFrontPreview() {
    },
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
    },
    beforeFrontUpload(file) {
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
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
    handleSidePreview() {
    },
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
    },
    beforeSideUpload(file) {
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
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
      if (this.dataForm.licenseImg == '') {
        getMethod('/backend/oss/groupId', null).then(res => {
          this.uploadLicenseUrl = getUploadUrl() + '?groupId=' + res.data
          this.dataForm.licenseImg = res.data
        })
      } else {
        this.uploadLicenseUrl = getUploadUrl() + '?groupId=' + this.dataForm.licenseImg
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
    handleLicensePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleBankLicensePreview(file) {
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
    },
    beforeLicenseUpload(file) {
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
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
    handleProtocalPreview() {
    },
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
    beforeProtocalUpload(file) {
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
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
      const scope = this
      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy
        let fileList = []
        fileList = fileList.concat(this.uploadFrontList)
        fileList = fileList.concat(this.uploadSideList)
        fileList = fileList.concat(this.uploadLicenseList)
        fileList = fileList.concat(this.protocalFileList)
        fileList = fileList.concat(this.uploadBankLicenseList)
        this.dataForm.fileJsonStr = JSON.stringify(fileList)
        this.dataForm.files = []
        postMethod('/backend/lyProvider/update', this.dataForm).then(
          res => {
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
        )
      }
    },
    validate() {
      const notNvl = [
        'provinceName',
        'provinceNo',
        'bankName',
        'cardNo'
      ]
      for (let i = 0; i < notNvl.length; i++) {
        if (this.dataForm[notNvl[i]] == '') {
          this.$message({
            message: '字段不能为空',
            type: 'warning'
          })
          return false
        }
      }

      const needInt = []
      for (let i = 0; i < needInt.length; i++) {
        if (!isInteger(this.dataForm[needInt[i]])) {
          this.$message({
            message: '请输入正整数',
            type: 'warning'
          })
          return false
        }
      }

      return true
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      this.saveObject()
    }
  }
}
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
