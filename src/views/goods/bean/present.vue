<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="商品名称" prop="goodsName" style="width: 650px">
        {{dataForm.goodsName}}
      </el-form-item>
      <el-form-item label="靠谱豆" prop="needBeanQty" style="width: 650px">
        {{dataForm.needBeanQty}}
      </el-form-item>
      <el-form-item label="零售价" prop="retailPrice" style="width: 650px">
        {{dataForm.retailPrice}}
      </el-form-item>
      <el-form-item label="库存" prop="stockQty" style="width: 650px">
        {{dataForm.stockQty}}
      </el-form-item>
      <el-form-item label="商品产地" prop="goodsOrigin" style="width: 650px">
        {{dataForm.goodsOrigin}}
      </el-form-item>
      <el-form-item label="所属品牌" prop="brandId">
        <el-select v-model="dataForm.brandId">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :value-key="item.brandName"
            :label="item.brandName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div id="front-img">
          <el-input v-show="false" v-model="dataForm.frontImage"/>
          <el-upload
            :action="uploadFrontImageUrl"
            list-type="picture-card"
            :on-preview="handleImagePreview"
            :before-upload="beforeFrontImageUpload"
            :on-success="handleFrontImageSuccess"
            :class="{hide:hideFrontImageUpload}"
            :file-list="uploadFrontImageList"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="imageUrl" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-input v-show="false" v-model="dataForm.goodsImage"/>
        <el-upload
          :action="uploadGoodsImageUrl"
          list-type="picture-card"
          :on-preview="handleImagePreview"
          :before-upload="beforeGoodsImageUpload"
          :on-success="handleGoodsImageSuccess"
          :class="{hide:hideGoodsImageUpload}"
          :file-list="uploadGoodsImageList"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品卖点" prop="sellingPoint" style="width: 650px">
        {{dataForm.sellingPoint}}
      </el-form-item>
      <el-form-item label="商品详情">
        <qEditor
          ref="refEditor"
          :content="dataForm.goodsDetail"
          module-name="goodsDetail"
          @changeContent="changeContent"
        />
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
  import {putMethod as putMethodNew,  getMethod as getMethodNew} from '@/api/request-new'
  import { getMethod, getUploadUrl } from '@/api/request'
  import qEditor from '@/components/RichText/quill-editor'
  import qEditor1 from '@/components/RichText/quill-editor_1'
  import qEditor2 from '@/components/RichText/quill-editor_2'

  export default {
    name: "saveOrEdit",
    components: { qEditor, qEditor1, qEditor2 },
    props: {
      goodsId: {
        type: Number,
        required: true
      }
    },
    mounted() {
      getMethodNew('/exchange_goods/detail', {"id" : this.goodsId}).then(res1 => {
        if (res1.code != 200) {
          this.$message({
            message: res1.message,
            type: 'warning'
          })
          return;
        }

        this.dataForm = res1.data

        getMethod('/backend/oss/groupId', null).then(res2 => {
          this.uploadGoodsImageUrl = getUploadUrl() + '?groupId=' + res2.data
          this.uploadFrontImageList.push({"groupId": res2.data, "url" : res1.data.frontImageUrl})
        })




        if (res1.data.goodsImageUrlList.length > 0) {
          getMethod('/backend/oss/groupId', null).then(res3 => {
            this.uploadGoodsImageUrl = getUploadUrl() + '?groupId=' + res3.data
            for (let i = 0; i < res1.data.goodsImageUrlList.length; i++) {
              this.uploadGoodsImageList.push({"groupId": res3.data, "url" : res1.data.goodsImageUrlList[i]})
            }

            if (res1.data.goodsImageUrlList.length >= 10) {
              this.hideGoodsImageUpload = true
            }
          })

        }

        this.hideFrontImageUpload = true
        this.$refs['refEditor'].setContent(res1.data.goodsDetail)
      })


      this.buildFrontImageGroupId()
      this.buildGoodsImageGroupId()
      getMethod('/backend/goodBrand/findList', null).then(res => {
        this.brandList = res.data
      })
    },
    data() {
        const isPositiveInteger = (rule, value, callback) => {
            if (!isNaN(value)) {
              const integerReg = /^\+?[1-9][0-9]*$/;
              if (integerReg.test(value)) {
                callback()
              } else {
                callback(new Error("请输入正整数"));
              }
            } else {
              callback(new Error("请输入数字"));
            }
        }

        const isCorrectFloat = (rule, value, callback) => {
            if (isNaN(value) || Number(value) <= 0) {
              callback(new Error("零售价输入错误"));
            } else {
              value += ""
              const bitPos = value.indexOf(".");
              if (bitPos == -1) {
                callback()
                return
              }
              const totalBits = value.length - bitPos - 1;
              if (totalBits > 2) {
                callback(new Error("零售价只能两位小数点"));
              } else {
                callback()
              }

            }
        }
        return {
          fileSortImage: 0,
          uploadFrontImageUrl: '',
          uploadGoodsImageUrl: '',
          hideFrontImageUpload: true,
          hideGoodsImageUpload: true,
          dialogVisible: false,
          dialogImageUrl: '',
          uploadFrontImageList: [],
          uploadGoodsImageList: [],
          imageUrl: '',
          dataForm: {
            brandId: '',
            frontImage: '',
            goodsImage: ''
          },
          detail: {
            detailContent: '',
            postSale: '',
            listDetail: ''
          },
          brandList: [],
          rules: {
            goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'} ],
            needBeanQty: [
              {required: true, message: '请输入靠谱豆', trigger: 'blur'},
              {validator: isPositiveInteger, trigger: "blur"}
            ],
            stockQty: [
              {required: true, message: '请输入库存', trigger: 'blur'},
              {validator: isPositiveInteger, trigger: "blur"}
            ],
            retailPrice: [{required: true, validator: isCorrectFloat, trigger: 'blur'} ],
            goodsOrigin: [{required: true, message: '请输入商品产地', trigger: 'blur'} ],
            sellingPoint: [{required: true, message: '请输入卖点', trigger: 'blur'} ]
          }
        }
    },
    methods: {
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },

      buildFrontImageGroupId() {
        if (this.dataForm.frontImage == '') {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadFrontImageUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.frontImage = res.data
          })
        } else {
          this.uploadFrontImageUrl = getUploadUrl() + '?groupId=' + this.dataForm.frontImage
        }
      },

      buildGoodsImageGroupId() {
        if (this.dataForm.goodsImage == '') {
          getMethod('/backend/oss/groupId', null).then(res => {
            this.uploadGoodsImageUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.goodsImage = res.data
          })
        } else {
          this.uploadGoodsImageUrl = getUploadUrl() + '?groupId=' + this.dataForm.goodsImage
        }
      },

      handleImagePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      beforeFrontImageUpload(file) {
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

      beforeGoodsImageUpload(file) {
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

      handleFrontImageSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadFrontImageList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadFrontImageList.length; i++) {
          if (this.uploadFrontImageList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 1) {
          this.hideFrontImageUpload = true
        }

        this.clearValidate('frontImage')
        this.dataForm.frontImage = res.data.groupId
      },

      handleGoodsImageSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadGoodsImageList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadGoodsImageList.length; i++) {
          if (this.uploadGoodsImageList[i].groupId == groupId) {
            imageCnt++
          }
        }
        if (imageCnt >= 10) {
          this.hideGoodsImageUpload = true
        }

        this.clearValidate('goodsImage')
        this.dataForm.goodsImage = res.data.groupId
      },

      handleFrontImageRemove(res) {
        for (let i = 0; i < this.uploadFrontImageList.length; i++) {
          if (this.uploadFrontImageList[i].url == (res.url || res.response.data.url)) {
            this.uploadFrontImageList.splice(i, 1)
            break
          }
        }
        this.hideFrontImageUpload = false
      },

      handleGoodsImageRemove(res) {
        for (let i = 0; i < this.uploadGoodsImageList.length; i++) {
          if (this.uploadGoodsImageList[i].url == (res.url || res.response.data.url)) {
            this.uploadGoodsImageList.splice(i, 1)
            break
          }
        }
        this.hideGoodsImageUpload = false
      },

      changeContent(val) {
        this.dataForm.goodsDetail = val
      },

      clearValidate(field) {
        let _field = this.$refs['dataForm'].fields
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

<style scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 100%;
  }

  .hide .el-upload--picture-card {
    display: none;
  }
</style>
