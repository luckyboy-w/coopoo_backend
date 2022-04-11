<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="140px" width="1000px">
      <el-form-item prop="couponName" label="优惠券名称：">
        <el-input style="width:260px" :disabled="disabled" v-model="dataForm.couponName" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="useWay" label="优惠券类型：">
      <el-select v-model="dataForm.useWay" placeholder="请选择">
        <el-option label="线上优惠券" :value="2" />
        <el-option label="线下优惠券" :value="1" />
      </el-select>
      </el-form-item>
      <el-form-item prop="applyClause" label="使用说明：">
        <el-input style="width:260px" :disabled="disabled" v-model="dataForm.applyClause"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="buyPrice" label="购买价格：">
        <el-input style="width:260px" type="number" :disabled="disabled" v-model="dataForm.buyPrice"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="faceValue" label="抵用额：">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.faceValue"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item v-if="dataForm.useWay=='2'" prop="fullMinusAmount" label="使用门槛：">
        满 <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.fullMinusAmount"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="stock" label="库存：">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.stock"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="buyLimit" label="限购：">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.buyLimit"  placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="validType" label="有效期类型：">
      <el-select v-model="dataForm.validType" placeholder="请选择">
        <el-option label="有效期" :value="2" />
        <el-option label="截止时间" :value="1" />
      </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.validType=='2'" prop="validTime" label="有效期：">
        <el-input style="width:260px" type="number" :disabled="disabled"  v-model="dataForm.validTime" />
      </el-form-item>
      <el-form-item v-if="dataForm.validType=='1'" prop="validityPeriod" label="截止时间：">
        <el-date-picker  style="width:260px" :disabled="disabled"
              v-model="dataForm.validityPeriod"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择到期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="useGoodsType" label="适用场景：">
      <el-select v-model="dataForm.useGoodsType" @change="changeUseGoodsType" placeholder="请选择">
        <el-option label="普通商城" :value="1" />
        <el-option label="专属商城" :value="2" />
      </el-select>
      </el-form-item>
      <el-form-item label="指定商品">
        <el-button type="success" :disabled="disabled" @click="relatedGoods">指定商品</el-button>
      </el-form-item>
      <el-form-item>

        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div v-for="(item,index) in bindingList" class="tabTd" style="border: 1px solid;border-radius: 15px;padding: 10px;width: 200px;position: relative;">
              <div style="min-width: 80px;max-width: 80px;height: 80px;">
                <img style="width: 100%;height: 100%;" :src="item.goodsCoverImgUrl" />
              </div>
              <div style="margin-left: 10px; line-height: 25px;display: -webkit-box;word-break: break-all;text-overflow: ellipsis;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">
                {{item.goodsName}}
              </div>
              <div @click="deleteGoods(item,index)" style="width: 25px;height: 25px;position: absolute;top: -5px;right: -5px;">
                <i style="font-size: 20px;" class="el-icon-circle-close"></i>
              </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="图片：">
        <el-upload :action="uploadImgUrl" list-type="picture-card" :disabled="disabled"
          :on-preview="handleImgPreview" :before-upload="beforeImgUpload" :on-success="handleImgSuccess"
          :class="{hideTrue:hideImgUpload}" :file-list="uploadImgList" :on-remove="handleImgRemove">
          <i class="el-icon-plus" />
          <!-- <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1000 * 528</div> -->
        </el-upload>
      </el-form-item>
     <el-form-item prop="context" label="商品详情：">
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
    <el-dialog :visible="showGoodsList" :before-close="showGoodsListClose" title="关联商品" width="90%">

      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>商品名称：</div>
            <div>
              <el-input v-model="searchParam.goodsName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table ref="multipleTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
              border @select="selectThis" @selection-change="selectioncChange">
                <!-- // :selectable="checkSelectable" -->
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" />
              <el-table-column label="商品价格">
                <template slot-scope="scope">
                  <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="saleVolume" label="销量" />
              <el-table-column prop="isSale" label="商品状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSale==1">已上架</span>
                  <span v-if="scope.row.isSale==0">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData.total" background layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" :current-page="searchParam.pageNum" @next-click="currentPage" />
          </div>
        </div>
      </div>
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
        searchParam: {
          pageSize: 10,
          pageNum: 1,
          goodsType:'',
        },
        // 商品列表
        tableData: {
          list: []
        },
        multipleSelection: [],
        bindingList: [],
        showGoodsList: false,

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
          couponGoodsList:[],
          stock: '',
          validityPeriod: '',
          id:'',
          useWay:'',
          fullMinusAmount:'',
          validType:'',
          useGoodsType:'',
          validTime:'',
        },
        rules: {
          couponName: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
          ],
          useWay: [
            {required: true, message: '请选择优惠券类型', trigger: 'change'},
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
          fullMinusAmount: [
            {required: true, message: '请输入使用门槛', trigger: 'blur'},
          ],
          stock: [
            {required: true, message: '请输入库存', trigger: 'blur'},
          ],
          buyLimit: [
            {required: true, message: '请输入限购数', trigger: 'blur'},
          ],
          validType: [
            {required: true, message: '请选择有效期类型', trigger: 'change'},
          ],
          useGoodsType: [
            {required: true, message: '请选择适用场景', trigger: 'change'},
          ],
          validTime: [
            {required: true, message: '请输入有效期', trigger: 'blur'},
          ],
          validityPeriod: [
            {required: true, message: '请选择截止时间', trigger: 'change'},
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
          if (this.dataForm.couponGoodsList.length>=1) {
            this.bindingList=this.dataForm.couponGoodsList
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
          if(this.dataForm.useWay==1){
            this.dataForm.type=1
            this.dataForm.fullMinusAmount='0'
          }
          if(this.dataForm.useWay==2){
            this.dataForm.type=2
          }
          if(this.dataForm.validType==1){
            this.dataForm.validTime=''
          }
          if(this.dataForm.validType==2){
            this.dataForm.validityPeriod=''
          }
          // delete this.dataForm.createTime;
          // delete this.dataForm.isSale;
          // delete this.dataForm.totalSales;
          // delete this.dataForm.uptTime;
          // delete this.dataForm.virtualCode;
          let couponListArr = []
          if(this.bindingList.length>=1){
            for (let i = 0; i < this.bindingList.length; i++) {
            let couponObj = {
              goodsId: this.bindingList[i].goodsId,
              id: this.bindingList[i].id ? this.bindingList[i].id : "",
            }
            couponListArr.push(couponObj)
          }
          }

          this.dataForm.couponGoodsList=couponListArr
        console.log('表单数据',this.dataForm);
        // return false;
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

      changeUseGoodsType(event){
        console.log(event)
        this.bindingList=[]
        this.multipleSelection=[]
      },

      // 关联商品
      relatedGoods() {

        if(this.dataForm.useGoodsType==''){
          this.$message({
            message: '请先选择适用场景',
            type: 'warning'
          })
          return false
        }else if(this.dataForm.useGoodsType==1){
          this.searchParam.goodsType = 1
        }else if(this.dataForm.useGoodsType==2){
          this.searchParam.goodsType = 2
        }

        this.searchParam.pageNum = 1
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {
        this.searchParam = {
          pageSize: 10,
          pageNum: 1,
          goodsType:'',
        }
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.goodsId == item.goodsId) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.showGoodsList = false
      },
      // deleteGoods(row, val) {
      //   let that = this
      //   that.bindingList.map((item, index) => {
      //     if (val == index) {
      //       that.bindingList.splice(index, 1)
      //     }
      //   })

      // },
      search() {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.goodsId == item.goodsId) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = 1
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
        postMethod("/goods/list", this.searchParam).then(res => {
          this.tableData.list = res.data.records;
          this.tableData.total = res.data.total;
          this.showPagination = this.tableData.total == 0;
          if (this.bindingList && this.bindingList.length > 0) {
            this.testF()
          }
        });

      },
      testF() {
        this.$nextTick(() => {
          this.tableData.list.forEach((item, index) => {
            this.bindingList.forEach((i, dex) => {
              if (i.goodsId == item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
        })
      },
      // checkSelectable(row) {
      //   let mark = 0
      //   this.bindingList.forEach((item) => {
      //     if (item.goodsId === row.goodsId && (item.id)) {
      //       mark = mark + 1
      //       return false
      //     }
      //   })
      //   return mark <= 0
      // },
      // 选择商品
      handleSelectionChange(val) {
        let n = val.filter(item => !this.multipleSelection.includes(item));
        console.log(n); //本次新增的项
        this.multipleSelection = val;
      },
      selectThis(selection, row) {
        this.multipleSelection = selection
        this.bindingList.forEach((item, index) => {
          if (row.goodsId == item.goodsId) {
            this.bindingList.splice(index, 1)
          }
        })
      },
      selectioncChange(selection) {},
      currentPage(pageNum) {
        if (this.multipleSelection.length > 0) {
          this.bindingList.forEach((i, dex) => {
            this.multipleSelection.forEach((item, index) => {
              if (i.goodsId == item.goodsId) {
                this.multipleSelection.splice(index, 1)
              }
            })
          })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },

      deleteGoods(row, num) {
        let that = this
        that.bindingList.map((item, index) => {
          if (item.goodsId == row.goodsId) {
            that.bindingList.splice(index, 1)
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
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
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
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }
</style>
