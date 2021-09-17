<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="140px" width="1000px">
      <el-form-item prop="couponName" label="优惠券名称">
        <el-input style="width:260px" :disabled="disabled" v-model="dataForm.couponName" />
      </el-form-item>
      <el-form-item prop="applyClause" label="使用说明">
        <el-input style="width:260px" :disabled="disabled" v-model="dataForm.applyClause" />
      </el-form-item>
      <el-form-item prop="buyPrice" label="购买价格">
        <el-input style="width:260px" type="number" :disabled="disabled" v-model="dataForm.buyPrice" />
      </el-form-item>
      <el-form-item prop="faceValue" label="抵用额">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.faceValue" />
      </el-form-item>
      <el-form-item prop="stock" label="库存">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.stock" />
      </el-form-item>
      <el-form-item prop="buyLimit" label="限购">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.buyLimit" />
      </el-form-item>
      <el-form-item prop="validityPeriod" label="有效期">
        <el-date-picker  style="width:260px" :disabled="disabled"
              v-model="dataForm.validityPeriod"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择到期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload :action="uploadImgUrl" list-type="picture-card" :disabled="disabled"
          :on-preview="handleImgPreview" :before-upload="beforeImgUpload" :on-success="handleImgSuccess"
          :class="{hideTrue:hideImgUpload}" :file-list="uploadImgList" :on-remove="handleImgRemove">
          <i class="el-icon-plus" />
          <!-- <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1000 * 528</div> -->
        </el-upload>
      </el-form-item>
     <el-form-item prop="context" label="商品详情">
       <qEditor ref="refEditor" :disabled="disabled"  :content="dataForm.context" module-name="detailContent"
         @changeContent="changeContent" />
     </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="disabled" @click="submitUpdate">
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
  import qEditor from '@/components/RichText/quill-editor'
  export default {
    components: {
      qEditor,
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        uploadImgUrl: "",
        dialogVisible: false,
        dialogImageUrl: '',
        hideImgUpload: false,
        uploadImgList: [],
        fileSortImage: 0,
        disabled:false,
        dataForm: {
          applyClause:'',
          buyLimit: '0',
          buyPrice: '',
          context: '',
          couponName: '',
          faceValue: '',
          imageList:[],
          stock: '',
          validityPeriod: '',
          id:''
        },
        rules: {
          couponName: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
          ],
          applyClause: [
            {required: true, message: '请输入卖点', trigger: 'blur'},
          ],
          buyPrice: [
            {required: true, message: '请输入购买价格', trigger: 'blur'},
          ],
          faceValue: [
            {required: true, message: '请输入抵用额', trigger: 'blur'},
          ],
          stock: [
            {required: true, message: '请输入库存', trigger: 'blur'},
          ],
          buyLimit: [
            {required: true, message: '请输入限购数', trigger: 'blur'},
          ],
          context: [
            {required: true, message: "请输入商品详情", trigger: "blur"},
          ],
        },
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(function() {
        if (this.editData.id) {
          this.dataForm = this.editData
          this.initDefaultImage()
          if (this.editData.disabled) {
            this.disabled=true
          }
          // this.$refs.refEditor.richText = this.dataForm.context
          this.$refs['refEditor'].setContent(this.editData.context)
        }
        this.buildImgGroupId()
      })
    },
    created() {},
    methods: {
        changeContent(val) {
          this.dataForm.context = val
        },
      initDefaultImage() {
        if(this.dataForm.imageList&&this.dataForm.imageList!=''){
            this.uploadImgList=this.dataForm.imageList
        }
      },
      saveObject() {
        const scope = this
       this.$refs["dataForm"].validate((valid) => {
         if (valid) {
           if (this.uploadImgList.length<=0) {
             this.$message({
               message: '优惠券图片不能为空',
               type: 'warning'
             })
             return false;
           }
           if (Number(this.dataForm.buyLimit)>Number(this.dataForm.stock)) {
             this.$message({
               message: '限购数不能大于库存',
               type: 'warning'
             })
             return false;
           }
          this.dataForm.imageList = this.uploadImgList
          if (this.editData.id) {
            this.dataForm.id=this.editData.id
            postMethod('/coupon/update-coupon-info', this.dataForm).then(
              res => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              }
            )
          } else{
          postMethod('/coupon/add-coupon-info', this.dataForm).then(
            res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('showListPanel', true)
            }
          )
          }
          }
        })
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      buildImgGroupId() {
          getMethod('/oss/get-group-id', null).then(res => {
            this.uploadImgUrl = getUploadUrl() + '?groupId=' + res.data
          })
      },
      handleImgPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleImgRemove(res) {
        for (let i = 0; i < this.uploadImgList.length; i++) {
          if (this.uploadImgList[i].url == (res.url || res.response.data.url)) {
            this.uploadImgList.splice(i, 1)
            break
          }
        }
        this.hideImgUpload = false
      },
      handleImgSuccess(res, file) {
        res.data.sort = this.fileSortImage++
        res.data.fileType = file.raw.type
        this.uploadImgList.push(res.data)
      },
      beforeImgUpload(file) {
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
    width: 1000px;
  }
</style>
<style lang="scss">
  .hideTrue .el-upload--picture-card {
    display: none;
  }
</style>

<style lang="scss" scoped>
  .autoAddressClass {
    li {
      i.el-icon-search {
        margin-top: 11px;
      }

      .mgr10 {
        margin-right: 10px;
      }

      .title {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .address {
        line-height: 1;
        font-size: 12px;
        color: #b4b4b4;
        margin-bottom: 5px;
      }
    }
  }
</style>
