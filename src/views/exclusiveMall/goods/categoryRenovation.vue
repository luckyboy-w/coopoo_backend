<template>
  <div v-loading="loading">

    <div style="display: flex;flex-wrap: nowrap;margin-top: 30px;    width: 100%;
    overflow-x: scroll;">
      <div class="templateContent">
        <div class="title">
          模块
        </div>
        <div class="templateList">
          <div class="templateItem" v-for="(item,index) in templateList" :key="index">
            <div class="templateImg">
              <img :src="item.img" style="width: 100%;height: 100%;object-fit: contain;" />
            </div>
            <div class="templateSize">
              {{item.text}}
            </div>
            <div class="templateAdd">
              <el-button size="mini" type="primary" @click="addTemplate(item)">添加</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content" style="margin-left: 50px;width: 900px;">
        <div style="width: 100%;margin-bottom: 20px;">
          <el-button style="margin:0 20px 0 0" @click="backToList()" type="primary" plain icon="el-icon-back">返回列表
          </el-button>
          <el-button type="danger" @click="deleteTemplate()">删除模块</el-button>
        </div>
        <el-table ref="dragTable" :data="list" @selection-change="selectioncChange" style=" margin-bottom: 20px;"
          row-key="onlyId" border>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="模块" width="180px">
            <template slot-scope="scope">
              {{scope.row.moduleName}}
            </template>
          </el-table-column>

          <el-table-column label="类目名称" width="200px">
            <template slot-scope="scope">
              <div class="tabItem" style="height: 80px;line-height: 80px;" :key="index_"
                v-for="(item_,index_) in scope.row.pageItemVOList">
                <el-select v-model="item_.categoryId" clearable placeholder="请选择">
                  <el-option label="无" :value="0"></el-option>
                  <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"
                    :disabled="item.enable===0"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="类目图片" width="150px">
            <template slot-scope="scope">
              <div class="tabItem" style="height: 80px;line-height: 80px;display: flex;" :key="index_"
                v-for="(item_,index_) in scope.row.pageItemVOList">
                <div v-if="item_.img" style="position: relative;display: flex;align-items: center;">
                  <img :src="item_.img" width="70px" height="70px" style="object-fit: cover;"
                    @click="handleImgPreview(item_.img)"
                    onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' ">
                  <i @click="deleteImg(scope.$index,index_)" class="el-icon-error"
                    style="position: absolute;right: -5px;top: -2px;font-size: 20px;"></i>
                </div>
                <el-input v-show="false" v-model="item_.img" />
                <el-upload v-if="!item_.img" class="avatar-uploader" :action="uploadImgUrl" :show-file-list="false"
                  :before-upload="beforeUploadImg" :on-success="handleSuccessImg">
                  <i class="el-icon-plus avatar-uploader-icon" @click="uploadClk(scope.$index,index_)" />
                </el-upload>
              </div>
            </template>
          </el-table-column>



          <el-table-column label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <div class="tabItem" style="height: 80px;line-height: 80px;" :key="index_"
                v-for="(item_,index_) in scope.row.pageItemVOList">
                <el-button @click="addRow(scope.row,item_,index_)" size="mini" type="text">添加
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button @click="deleteRow(scope.row,item_,scope.$index,index_)" size="mini" type="text">删除
                </el-button>
                <el-divider v-if="index_!==0" direction="vertical"></el-divider>
                <el-button v-if="index_!==0" @click="moveUp(scope.row,item_,scope.$index,index_)" size="mini"
                  type="text">上移
                </el-button>
                <el-divider v-if="index_ != scope.row.pageItemVOList.length - 1" direction="vertical"></el-divider>
                <el-button v-if="index_ != scope.row.pageItemVOList.length - 1"
                  @click="moveDown(scope.row,item_,scope.$index,index_)" size="mini" type="text">下移
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;width: 100%;">

          <el-button type="success" @click="categoryTemplateSubmit()">提交</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from '@/api/request'
  export default {
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    computed: {},
    filters: {},
    created() {
      //    this.$nextTick(() => {
      // 	this.merge()
      // })
    },
    data() {
      return {
        templateList: [],
        categoryList: [],
        selectionList: [],
        list: [
          // {id:1,text:'aa'},
          // {id:2,text:'bb'},
          // {id:3,text:'cc'},
        ],
        rowIndex: -1,
        rowItemIndex: -1,
        uploadImgUrl: '',
        loading: false,
        dialogVisible: false,
        dialogImageUrl: '',

      }
    },
    mounted() {
      console.log(this.editData)
      this.setSort();
      this.initTemplate()
      this.buildImgGroupId()
      this.initCategory(this.editData.id)
      this.initCategoryRenovation(this.editData.id)
    },
    methods: {
      backToList() {
        this.$emit('showListPanel')
      },
      addTemplate(obj) {
        console.log('模块信息', obj)
        let dates = new Date();
        let times = dates.getTime(); //时间戳
        let itemObject = {
          onlyId: times,
          pageItemVOList: [{
            categoryId: '',
            img: '',
          }],
          moduleName: obj.text,
          templateId: obj.id,
        }
        console.log(this.list)
        this.list.push(itemObject)
      },
      addRow(row, item, index) {
        console.log('行数据', row, item, index)
        let itemObject = {
          categoryId: '',
          img: '',
        }
        let newItemList = []
        let newList = []
        for (let i = 0; i < this.list.length; i++) {

          if (this.list[i].onlyId == row.onlyId) {
            let arr = this.list[i]
            for (let j = 0; j < arr.pageItemVOList.length; j++) {
              newItemList.push(arr.pageItemVOList[j])
              if (j === index) {
                newItemList.push(itemObject)
              }
            }
            this.list[i].pageItemVOList = newItemList
          }
          newList.push(this.list[i])

        }
        this.list = newList
        console.log('新数组', newList)
      },
      deleteRow(row, item, index, idx) {
        for (let i = 0; i < this.list.length; i++) {
          let arr = this.list[i]
          if (arr.onlyId == row.onlyId) {
            if (arr.pageItemVOList.length <= 1) {
              this.list.splice(index, 1)
            } else if (arr.pageItemVOList.length > 1) {
              arr.pageItemVOList.splice(idx, 1)
            }
          }
        }
      },

      moveUp(row, item, index, idx) {
        var temp = this.list[index].pageItemVOList[idx - 1]
        this.$set(this.list[index].pageItemVOList, idx - 1, this.list[index].pageItemVOList[idx]);
        this.$set(this.list[index].pageItemVOList, idx, temp);
      },
      moveDown(row, item, index, idx) {
        var temp = this.list[index].pageItemVOList[idx + 1]
        this.$set(this.list[index].pageItemVOList, idx + 1, this.list[index].pageItemVOList[idx]);
        this.$set(this.list[index].pageItemVOList, idx, temp);
      },
      //合并列表格
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        console.log(row,
          column,
          rowIndex,
          columnIndex)
        const fields = ['onlyId']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          const prevRow = this.list[rowIndex - 1]
          let nextRow = this.list[rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = this.list[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return {
                rowspan: countRowspan,
                colspan: 1
              }
            }
          }
        }
      },

      setSort() {
        console.log('111')
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onChoose: function(evt) {
            // console.log(evt)
          },
          onChange: evt_ => {
            // console.log(evt_)
            // console.log('evt', evt_, this.list[evt_.newIndex].onlyId, this.list[evt_.oldIndex].onlyId)
          },
          onStart: function(evt) {
            // console.log(evt)
          },
          // 元素被选中
          onEnd: evt => {
            // console.log('evt', evt, this.list[evt.newIndex].onlyId, this.list[evt.oldIndex].onlyId)
            // if (this.list[evt.newIndex].onlyId == this.list[evt.oldIndex].onlyId) {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0];
            this.list.splice(evt.newIndex, 0, targetRow);
            // console.log(this.list)
            // }else{
            //   console.log('不能拖')
            //   const targetRow = this.list.splice(evt.newIndex, 1)[0];
            //   this.list.splice(evt.oldIndex, 0, targetRow);
            // }
          }
        })
      },
      test() {
        console.log('数组', this.list)
      },
      deleteTemplate() {
        if (this.selectionList.length <= 0) {
          this.$message({
            message: "请选择要删除的模块",
            type: "warning"
          });
          return false;
        }
        this.selectionList.forEach(item => {
          this.list.forEach((i, idx) => {
            if (item.onlyId == i.onlyId) {
              this.list.splice(idx, 1)
            }
          })
        })
      },
      categoryTemplateSubmit() {
        console.log('表格数据', this.list)
        if (this.list.length <= 0) {
          this.$message({
            message: "请添加模块后再提交",
            type: "warning"
          });
          return
        }
        let categoryPageDTOList = this.list
        let status = false
        for (let i = 0; i < categoryPageDTOList.length; i++) {
          let arr = categoryPageDTOList[i]
          if (arr.id && arr.id != '') {
            status = true
          }
          let index = i + 1
          delete arr.onlyId
          arr.sort = i
          arr.categoryId = this.editData.id
          for (let j = 0; j < arr.pageItemVOList.length; j++) {
            let arrItem = arr.pageItemVOList[j]
            let idx = j + 1
            arrItem.sort = j
            console.log(arrItem.categoryId)
            if (arrItem.categoryId === '') {
              this.$message({
                message: "请选择第" + index + "个模块的第" + idx + "个的类目名称",
                type: "warning"
              });
              return
            }
            if (arrItem.img == '') {
              this.$message({
                message: "请上传第" + index + "个模块的第" + idx + "个的类目图片",
                type: "warning"
              });
              return
            }
          }
        }
        console.log('categoryPageDTOList', categoryPageDTOList)
        if (status) {
          postMethod('/exclusive/category-page/update', {
            categoryPageList: categoryPageDTOList
          }).then(
            res => {
              console.log(res)
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.backToList()
            }
          )
        } else {
          postMethod('/exclusive/category-page/add', {
            categoryPageDTOList: categoryPageDTOList
          }).then(
            res => {
              console.log(res)
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.backToList()
            }
          )
        }


      },
      selectioncChange(selection) {
        console.log('已选', selection)
        this.selectionList = selection
      },
      initTemplate() {
        let scope = this
        postMethod('/exclusive/category-template/list').then(
          res => {
            console.log('模板数据', res)
            this.templateList = res.data
          }
        )
      },
      buildImgGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadImgUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      beforeUploadImg(file, row) {
        this.loading = true
        // this.loading = true
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      uploadClk(index, idx) {
        console.log('下标', index, idx)
        // return false
        this.rowIndex = index
        this.rowItemIndex = idx
        this.buildImgGroupId()
      },
      deleteImg(index, idx) {
        console.log('下标', index, idx)
        this.list[index].pageItemVOList[idx].img = ''
      },
      handleSuccessImg(res, file) {
        console.log(this.list, this.rowIndex, this.rowItemIndex)
        this.list[this.rowIndex].pageItemVOList[this.rowItemIndex].img = res.data.url
        const groupId = res.data.groupId
        this.loading = false
      },
      handleImgPreview(file) {
        this.dialogImageUrl = file
        this.dialogVisible = true
      },
      initCategory(id) {
        console.log('9999999999999')
        let scope = this
        postMethod('/exclusive/category/query?id=' + id).then(
          res => {
            console.log('模板数据', res)
            this.categoryList = res.data
          }
        )
      },
      initCategoryRenovation(id) {
        let scope = this
        postMethod('/exclusive/category-page/list?id=' + id).then(
          res => {
            console.log('装修页详情', res)
            if (res.data && res.data.length >= 1) {
              for (let j = 0; j < res.data.length; j++) {
                let dates = new Date();
                let times = dates.getTime(); //时间戳
                res.data[j].onlyId = times + j
                console.log(888)
              }
            }
            scope.list = res.data
            this.$forceUpdate()
            console.log(scope.list)
          }
        )
      },
    }
  }
</script>
<style scoped>
  /deep/.el-table__header-wrapper .el-checkbox {
    display: none
  }

  .tabItem {
    /* display: flex;
    justify-content: flex-start;
    align-items: center; */
    border-bottom: 1px solid #ebeef5;
  }


  .tabItem:last-child {
    border-bottom: none;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    border: 2px solid #a6aeb9;
    border-radius: 5px;
  }
</style>
<style scoped>
  .templateContent {
    min-width: 450px;
    max-width: 450px;
    height: fit-content;
    border: 1px solid;
    margin-left: 10px;
  }

  .title {
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-top: 20px;
  }

  .templateList {
    display: flex;
    flex-wrap: wrap;
  }

  .templateItem {
    width: 50%;
    height: 200px;
    text-align: center;
    padding: 10px;
  }

  .templateImg {
    width: 100%;
    height: 70%;
  }

  .templateSize {
    font-size: 14px;
    line-height: 25px;
  }

  .templateAdd {}
</style>
