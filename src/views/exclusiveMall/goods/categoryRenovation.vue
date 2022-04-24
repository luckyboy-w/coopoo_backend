<template>
  <div>
    <el-button style="margin:10px 0 10px 20px" @click="backToList()" type="primary" plain icon="el-icon-back">返回列表
    </el-button>
    <div style="display: flex;flex-wrap: nowrap;">
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
      <el-table ref="dragTable" :data="list" :span-method="objectSpanMethod" style="width: 100%; margin-bottom: 20px;"
        row-key="index" border>
        <el-table-column type="selection" prop="onlyId" width="55">
        </el-table-column>
        <el-table-column label="模块" prop="onlyId">
          <template slot-scope="scope">
            {{scope.row.moduleName}}
          </template>
        </el-table-column>
        <el-table-column label="类目名称">
          <template slot-scope="scope">
            <div v-for="(item_,index_) in scope.row.templateItem">
            选择
              
            </div>
            <!-- <el-select v-model="scope.row." placeholder="请选择">
        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
      </el-select> -->
          </template>
        </el-table-column>
        <el-table-column label="类目图片">
          <template slot-scope="scope">
            <div v-for="(item_,index_) in scope.row.templateItem">
            图片上传
              
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-for="(item_,index_) in scope.row.templateItem">
            <el-button @click="addRow(scope.row,item_,index_)" size="mini" type="text">添加
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteRow(scope.row)" size="mini" type="text">删除
            </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button @click="test()">8888</el-button>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import {
    getMethod,
    postMethod
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
        list: [
          // {id:1,text:'aa'},
          // {id:2,text:'bb'},
          // {id:3,text:'cc'},
        ],

      }
    },
    mounted() {
      this.setSort();
      this.initTemplate()
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
          templateItem:[
            {
               categoryId: '',
          img: '',
            }
          ],

          moduleName: obj.text,
          templateId: obj.id,
        }
        this.list.push(itemObject)
      },
      addRow(row, item,index) {
        console.log('行数据', row,item, index)
        let itemObject = {
          categoryId: '',
          img: '',
        }
        let newItemList = []
        let newList=[]
        for (let i = 0; i < this.list.length; i++) {
          
          if (this.list[i].onlyId==row.onlyId) {
            let arr=this.list[i]
            for (let j = 0; j < arr.templateItem.length; j++) {
              newItemList.push(arr.templateItem[j])
              if (j === index) {
                newItemList.push(itemObject)
              }
            }
            this.list[i].templateItem=newItemList
          }
          newList.push(this.list[i])
          
        }
        this.list = newList
        console.log('新数组', newList)
      },
      //合并列表格
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        console.log( row,
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
          onChoose: function( evt) {
            console.log(evt)
          },
          onChange: evt_ => {
            console.log(evt_)
            console.log('evt', evt_, this.list[evt_.newIndex].onlyId, this.list[evt_.oldIndex].onlyId)
          },
          onStart: function( evt) {
            console.log(evt)
          },
          // 元素被选中
          onEnd: evt => {
            // console.log('evt', evt, this.list[evt.newIndex].onlyId, this.list[evt.oldIndex].onlyId)
            if (this.list[evt.newIndex].onlyId == this.list[evt.oldIndex].onlyId) {
              const targetRow = this.list.splice(evt.oldIndex, 1)[0];
              this.list.splice(evt.newIndex, 0, targetRow);
              console.log(this.list)
            }else{
              console.log('不能拖')
              const targetRow = this.list.splice(evt.newIndex, 1)[0];
              this.list.splice(evt.oldIndex, 0, targetRow);
            }
          }
        })
      },
      test() {
        console.log('数组', this.list)
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
    }
  }
</script>
<style>
  .templateContent {
    width: 450px;
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
