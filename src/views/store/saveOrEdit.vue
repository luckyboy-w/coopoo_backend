<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="140px" width="500px">
      <el-form-item label="门店名称">
        <el-input v-model="dataForm.storeName" />
      </el-form-item>
      <el-form-item label="店主姓名">
        <el-input v-model="dataForm.owerUserName" />
      </el-form-item>
      <el-form-item label="店主手机号">
        <el-input v-model="dataForm.mobilePhone" disabled="" />
      </el-form-item>

      <el-form-item label="E类服务商">
        <el-select v-model="dataForm.serviceLevel" style="width:300px" @change="setMobilePhone">
          <el-option v-for="item in serviceList" :key="item.id" :value-key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="店铺图片-列表页面" prop="storeImg">
        <el-input v-show="false" v-model="dataForm.storeImg" />
        <el-upload :disabled="!viewSubmit" :action="uploadStoreImgUrl" list-type="picture-card" :on-preview="handleStoreImgPreview"
          :before-upload="beforeStoreImgUpload" :on-success="handleStoreImgSuccess" :class="{hide:hideStoreImgUpload}"
          :file-list="uploadStoreImgList" :on-remove="handleStoreImgRemove">
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1200 * 636</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="店铺图片-详情页面" prop="storeImgDtl" style="width:1060px">
        <el-input v-show="false" v-model="dataForm.storeImgDtl" />
        <el-upload :disabled="!viewSubmit" :action="uploadStoreImgDtlUrl" list-type="picture-card" :on-preview="handleStoreImgDtlPreview"
          :before-upload="beforeStoreImgDtlUpload" :on-success="handleStoreImgDtlSuccess" :class="{hide:hideStoreImgDtlUpload}"
          :file-list="uploadStoreImgDtlList" :on-remove="handleStoreImgDtlRemove">
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1200 * 636</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="详细地址">
        <el-input v-model="dataForm.address" disabled />
      </el-form-item>
      <el-form-item label="">
        <gdMap @callBackMap="callBackMap" />
      </el-form-item>
      <el-form-item label="门店状态">
        <el-select v-model="dataForm.status">
          <el-option v-for="item in shopStatusList" :key="item.id" :value-key="item.label" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="dataForm.enable" inactive-value="0" active-value="1" />
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
  import gdMap from './map'

  export default {
    components: {
      gdMap
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        uploadStoreImgUrl: "",
        uploadStoreImgDtlUrl: "",
        dialogVisible: false,
        dialogImageUrl: '',
        viewSubmit: true,
        hideStoreImgUpload: false,
        hideStoreImgDtlUpload: false,
        serviceList: [],
        uploadStoreImgList: [],
        uploadStoreImgDtlList: [],
        shopStatusList: [],
        provinceList: [],
        cityList: [],
        fileSortImage: 0,
        imageUrl: '',
        fileList: [],
        dataForm: {
          storeName: '',
          storeImg: '',
          owerUserName: '',
          mobilePhone: '',
          lat: '',
          lng: '',
          address: '',
          serviceLevel: '',
          status: '',
          province: '',
          city: '',
          enable: true,
          id: ''
        }
      }
    },
    computed: {},
    mounted() {
      this.shopStatusList = this.GLOBAL.shopStatusList
      this.loadprovinceList()
      this.loadServiceList()
      this.init()
      this.$nextTick(function() {
        if (this.editData.id) {
          this.dataForm = this.editData
          this.imageUrl = this.dataForm.storeImg
          this.loadCityList()
          this.initDefaultImage()
        }
        this.buildStoreImgGroupId()
        this.buildStoreImgDtlGroupId()
      })
      if (this.oper == 'view') {
        this.viewSubmit = false
      }
    },
    created() {},
    methods: {
      setMobilePhone(sel) {
        this.dataForm.mobilePhone = sel
      },
      loadServiceList() {
        let scope = this
        let searchProvider = {
          provinceRole: '5',
          verifyStatus: '30',
          pageSize: 1000,
          pageNum: 0
        };
        getMethod('/backend/lyProvider/findPage', searchProvider).then(
          res => {
            let dataList = res.data.list
            scope.serviceList = []
            for (let i = 0; i < dataList.length; i++) {
              let pobj = dataList[i]
              let providerObject = {
                id: pobj.id,
                value: pobj.mobileNo,
                label: '服务商名称:' + pobj.provinceName + ";手机号码:" + pobj.mobileNo
              }
              scope.serviceList.push(providerObject);
            }
          }
        )
      },
      callBackUploadSuc(res, file) {
        this.imageUrl = res.data.url
        this.dataForm.storeImg = res.data.url
      },
      init() {},
      changeProvince(val) {
        this.loadCityList()
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
      loadCityList() {
        const scope = this
        const param = {
          provinceid: this.dataForm.province
        }

        if (this.dataForm.province == '') {
          return
        }
        getMethod('/backend/areas/findCity', param).then(res => {
          scope.cityList = res.data
        })
      },
      callBackMap(mapData) {
        this.dataForm.lng = mapData.lng
        this.dataForm.lat = mapData.lat
        this.dataForm.address = mapData.adress
      },
      initDefaultImage() {
        this.fileList = this.dataForm.files
        for (let i = 0; i < this.dataForm.files.length; i++) {
          const imageObj = this.dataForm.files[i]
          if (imageObj.groupId == this.dataForm.storeImg) {
            this.uploadStoreImgList.push(imageObj)
          }

          if (imageObj.groupId == this.dataForm.storeImgDtl) {
            this.uploadStoreImgDtlList.push(imageObj)
          }
        }

        if (this.uploadStoreImgList.length >= 1) {
          this.hideStoreImgUpload = true
        }

      },
      saveObject() {
        const scope = this
        if (this.validate()) {
          delete this.dataForm.createTime
          delete this.dataForm.createBy

          let fileList = []
          fileList = fileList.concat(this.uploadStoreImgList)
          fileList = fileList.concat(this.uploadStoreImgDtlList)
          this.dataForm.fileJsonStr = JSON.stringify(fileList)
          this.dataForm.files = []

          postMethod('/backend/storeManage/update', this.dataForm).then(
            res => {
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
        if (this.dataForm.storeImg == '') {
          this.$message({
            message: '门店图片不能为空',
            type: 'warning'
          })
          return false;
        }
        const notNvl = [
          'storeName',
          'owerUserName',
          'mobilePhone',
          'address'
        ]

        for (let i = 0; i < notNvl.length; i++) {
          if (this.dataForm[notNvl[i]] == '') {
            this.$message({
              message: '必填字段不能为空',
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
      buildStoreImgGroupId() {
        if (this.dataForm.storeImg == '' ||
          this.dataForm.storeImg == undefined) {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadStoreImgUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.storeImg = res.data
          })
        } else {
          this.uploadStoreImgUrl = getUploadUrl() + '?groupId=' + this.dataForm.storeImg
        }
      },
      handleStoreImgPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleStoreImgRemove(res) {
        for (let i = 0; i < this.uploadStoreImgList.length; i++) {
          if (this.uploadStoreImgList[i].url == (res.url || res.response.data.url)) {
            this.uploadStoreImgList.splice(i, 1)
            break
          }
        }
        this.hideStoreImgUpload = false
      },
      handleStoreImgSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadStoreImgList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadStoreImgList.length; i++) {
          if (this.uploadStoreImgList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideStoreImgUpload = true
        }
        /*this.clearValidate('storeImg')*/
        this.dataForm.storeImg = res.data.groupId
      },
      beforeStoreImgUpload(file) {
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
      buildStoreImgDtlGroupId() {
        if (this.dataForm.storeImgDtl == '' ||
          this.dataForm.storeImgDtl == undefined) {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadStoreImgDtlUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.storeImgDtl = res.data
          })
        } else {
          this.uploadStoreImgDtlUrl = getUploadUrl() + '?groupId=' + this.dataForm.storeImgDtl
        }
      },
      handleStoreImgDtlPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleStoreImgDtlRemove(res) {
        for (let i = 0; i < this.uploadStoreImgDtlList.length; i++) {
          if (this.uploadStoreImgDtlList[i].url == (res.url || res.response.data.url)) {
            this.uploadStoreImgDtlList.splice(i, 1)
            break
          }
        }
        this.hideStoreImgDtlUpload = false
      },
      handleStoreImgDtlSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadStoreImgDtlList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadStoreImgDtlList.length; i++) {
          if (this.uploadStoreImgDtlList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideStoreImgDtlUpload = false
        }
        /*this.clearValidate('storeImg')*/
        this.dataForm.storeImgDtl = res.data.groupId
      },
      beforeStoreImgDtlUpload(file) {
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
