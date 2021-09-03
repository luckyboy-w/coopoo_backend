<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="商品名称" prop="goodsName" style="width: 650px">
        <el-input v-model="dataForm.goodsName" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="靠谱豆" prop="needBeanQty" style="width: 650px">
        <el-input v-model="dataForm.needBeanQty" type="number" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="零售价" prop="retailPrice" style="width: 650px">
        <el-input v-model="dataForm.retailPrice" type="number" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="库存" prop="stockQty" style="width: 650px">
        <el-input v-model="dataForm.stockQty" type="number" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName" style="width: 650px">
        <el-input v-model="dataForm.supplierName" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="供货价" prop="supplyPrice" style="width: 650px">
        <el-input v-model="dataForm.supplyPrice" type="number" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="结算周期" prop="settlePeriod" style="width: 650px">
        <el-input v-model="dataForm.settlePeriod" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="封面图片">
        <div id="front-img">
          <el-input v-show="false"/>
          <el-upload
           :disabled="disabled"
            :action="uploadFrontImageUrl"
            list-type="picture-card"
            :on-preview="handleImagePreview"
            :before-upload="beforeFrontImageUpload"
            :on-success="handleFrontImageSuccess"
            :class="{hideTrue:hideFrontImageUpload}"
            :file-list="uploadFrontImageList"
            :on-remove="handleFrontImageRemove"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="imageUrl" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-input v-show="false" />
        <el-upload
         :disabled="disabled"
          :action="uploadGoodsImageUrl"
          list-type="picture-card"
          :on-preview="handleImagePreview"
          :before-upload="beforeGoodsImageUpload"
          :on-success="handleGoodsImageSuccess"
          :class="{hideTrue:hideGoodsImageUpload}"
          :file-list="uploadGoodsImageList"
          :on-remove="handleGoodsImageRemove"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品卖点" prop="sellingPoint" style="width: 650px">
        <el-input v-model="dataForm.sellingPoint" :disabled="disabled"/>
      </el-form-item>
      <el-form-item prop="postSaleId" label="售后说明">
        <el-radio-group v-model="dataForm.postSaleId" >
          <el-radio class="my-el-radio" :disabled="disabled" v-for="(item,index) in goodSaleDescList" :key="item.id" :label="item.id">
            <div class="my-container">
              <div class="img" @mouseover="changeImgMask(index,true)" @mouseout="changeImgMask(index,false)">
                <div ref="imgMask" class="img-mask">
                  <i class="el-icon-zoom-in my-icon" @click="showBigImg(item.imgUrl)"></i>
                </div>
                <el-image :src="item.imgUrl" fit="fill" style="width: 100%;height:100%"></el-image>
              </div>
              <div class="title">
                {{ item.name }}
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品详情" prop="goodsDetail">
        <qEditor
        :disabled="disabled"
          ref="refEditor"
          :content="dataForm.goodsDetail"
          module-name="detailContent"
          @changeContent="changeContent"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="cancelUpdate">返回列表</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  // import {postMethod as postMethodNew } from '@/api/request-new'
  import { getMethod,postMethod, getUploadUrl } from '@/api/request'
  import qEditor from '@/components/RichText/quill-editor'

  export default {
    name: "saveOrEdit",
    components: { qEditor },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    mounted() {
      const scope = this
      console.log(this.editData);
      this.buildFrontImageGroupId()
      this.buildGoodsImageGroupId()
      this.loadGoodSaleDescList()
      this.$nextTick(function () {
        if (this.editData.goodsId) {
          this.dataForm = this.editData;
          this.dataForm.postSaleId = String(this.editData.postSaleId);
          this.$refs['refEditor'].setContent(this.editData.goodsDetail)
          this.initDefaultImage();
          if (this.editData.disabled) {
            this.disabled=true
          }
        }
      });
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
          hideFrontImageUpload: false,
          hideGoodsImageUpload: false,
          dialogVisible: false,
          dialogImageUrl: '',
          uploadFrontImageList: [],
          uploadGoodsImageList: [],
          goodSaleDescList: [],
          imageUrl: '',
          disabled:false,
          dataForm: {
            frontImage:[],
            goodsImageList:[],
            goodsDetail:'',
            goodsName:'',
            needBeanQty:'',
            retailPrice:'',
            sellingPoint:'',
            stockQty:'',
            postSaleId:'',
            settlePeriod:'',
            supplierName:'',
            supplyPrice:'',
          },
          detail: {
            detailContent: '',
          },
          rules: {
            goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'} ],
            needBeanQty: [
              {required: true, message: '请输入靠谱豆', trigger: 'blur'},
              {validator: isPositiveInteger, trigger: "blur"}
            ],
            stockQty: [
              {required: true, message: '请输入库存', trigger: 'blur'}
            ],
            supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'} ],
            supplyPrice: [{required: true, message: '请输入供货价', trigger: 'blur'} ],
            settlePeriod: [{required: true, message: '请输入结算周期', trigger: 'blur'} ],
            retailPrice: [{required: true, message: '请输入零售价', trigger: 'blur'} ],
            sellingPoint: [{required: true, message: '请输入卖点', trigger: 'blur'} ],
            postSaleId: [{required: true, message: '请选择售后说明', trigger: 'blur'} ],
            goodsDetail: [{required: true, message: '请填写商品详情', trigger: 'blur'} ]
          }
        }
    },
    methods: {
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },

      buildFrontImageGroupId() {
          getMethod('/oss/get-group-id', null).then(res => {
            this.uploadFrontImageUrl = getUploadUrl() + '?groupId=' + res.data
            })
      },

      buildGoodsImageGroupId() {
          getMethod('/oss/get-group-id', null).then(res => {
            this.uploadGoodsImageUrl = getUploadUrl() + '?groupId=' + res.data
          })
      },
      loadGoodSaleDescList() {
        postMethod('/goods/post-sale/list',{pageNum:1,pageSize:10}).then(res => {
          this.goodSaleDescList = res.data.records
          this.goodSaleDescList.forEach(i => {
            i.id=String(i.id)
          })
        if (this.dataForm.postSaleId == '' && this.goodSaleDescList.length > 0) {
          this.dataForm.postSaleId = this.goodSaleDescList[0].id
        }
        })
      },
      initDefaultImage() {
        this.uploadFrontImageList.push(this.dataForm.frontImageInfo)
         this.uploadGoodsImageList= this.dataForm.goodsImageInfoList
         if (this.uploadFrontImageList.length >= 1) {
           this.hideFrontImageUpload = true;
         }
      },

      changeImgMask(index, flag) {
        this.$refs.imgMask[index].style = flag ? 'display:block' : 'display:none'
      },
      showBigImg(url) {
        this.goodSaleDescImgUrl = url
        this.goodSaleDescImgVisible = true
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

      submit() {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            let errorMsg = ''

            if (this.uploadGoodsImageList.length == 0) {
              errorMsg = '请上传商品图片'
            }

            if (this.uploadFrontImageList.length == 0) {
              errorMsg = '请上传商品封面图'
            }
            if (errorMsg != '') {
              this.$message.warning(errorMsg)
              return
            }

            let fileList = []
            fileList = fileList.concat(this.uploadGoodsImageList)
            fileList = fileList.concat(this.uploadFrontImageList)
            this.dataForm.goodsImageList=this.uploadGoodsImageList
            this.dataForm.frontImage=this.uploadFrontImageList[0]
            console.log(this.dataForm);

            if (this.editData.goodsId) {
              this.dataForm.goodsId=this.editData.goodsId
              postMethod('/bean_goods/update', this.dataForm).then(res => {
                if (res.errCode != 0) {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  })
                  return;
                }
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              })
            } else{
              postMethod('/bean_goods/save', this.dataForm).then(res => {
                if (res.errCode != 0) {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  })
                  return;
                }
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              })
            }

          }
        });
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
<style lang="scss">
.hideTrue .el-upload--picture-card {
  display: none!important;
}
</style>
<style scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 100%;
  }
  .my-el-radio {
    width: 240px;
    height: 200px;

    .my-container {
      display: inline-block;
      width: 190px;
      height: 180px;

      .img {
        position: relative;
        width: 190px;
        height: 140px;
        border-radius: 10px;
        overflow: hidden;

        .img-mask {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
          color: white;

          .my-icon {
            position: absolute;
            display: inline-block;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 30px;
          }
        }
      }

      .title {
        width: 190px;
        height: 40px;
        line-height: 40px;
        text-align: center
      }

    }
  }
</style>
