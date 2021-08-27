<template>
  <div>
    <div class="update-form-panel" v-loading="loading">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item prop="liveName" label="直播名称">
          <el-input v-model="form.liveName" placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item label="直播时间">
               <el-date-picker
                 v-model="testDate" clearable :disabled="disabled"
                 type="datetimerange"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期"
                 @change="activityDateTimeChange"
                 :picker-options="startDateTimePickerOptions"
                 value-format="yyyy-MM-dd HH:mm:ss"
                 :default-time="['00:00:00', '00:00:00']"
               >
               </el-date-picker>
        </el-form-item>
        <el-form-item label="直播商品">
          <el-button type="success" @click="relatedGoods" :disabled="disabled">关联商品</el-button>
        </el-form-item>
        <el-form-item label="已关联商品">
          <div class="ly-table-panel" style="min-width:1000px!important;">
            <div class="ly-data-list">
              <el-table ref="mainTable" :data="bindingList" style="width: 100%!important; margin-bottom: 20px;"
                row-key="id" border>
                <el-table-column prop="goodsName" label="商品名称" />
                <el-table-column label="商品价格">
                  <template slot-scope="scope">
                    <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="saleVolume" label="销量" width="80" />
                <el-table-column prop="createTime" label="创建时间" width="170">
                  <template slot-scope="scope">
                    {{ scope.row.createTime}}
                  </template>
                </el-table-column>
                <el-table-column prop="id" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" :disabled="disabled" size="small"
                      @click="deleteGoods(scope.row,scope.$index)">
                      删除
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==1" @click="submitUpdate(1)">提交</el-button>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==2" @click="submitUpdate(2)">保存编辑
          </el-button>
          <el-button @click="cancelUpdate">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
              border  @select="selectThis" @selection-change="selectioncChange" >
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
                  <span v-if="scope.row.isSale===0">未上架</span>
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
              @prev-click="currentPage" @next-click="currentPage" />
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
  export default {
    data() {
      return {
        loading: false,
        disabled: false,
        submitStatus: 1,
        showGoodsList: false,
        // 表单数据
        testDate:'',
        form: {
          relatedGoodsList: [],
          liveName:'',
        },
        startDateTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() <= Date.now()
          }
        },
        // 商品列表
        tableData: {
          list: []
        },
        multipleSelection: [],
        bindingList: [],
        searchParam: {
          pageSize: 10,
          pageNum: 1,
        },
      }
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    computed: {},
    mounted() {
      console.log(this.editData, 'this.editData.')
      if (this.editData.operation == "add") {
        this.submitStatus = 1
      } else if (this.editData.operation == "edit") {
        this.submitStatus = 2
      } else if (this.editData.operation == "detail") {
        this.disabled = true
      }
    },
    created() {},
    methods: {
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      dataEcho() {
        let that = this
        that.form = that.editData
        that.bindingList = that.editData.relatedGoodsList
      },
      activityDateTimeChange() {
        this.form.liveBegin = this.testDate[0]
        this.form.liveEnd = this.testDate[1]
      },
      // 关联商品
      relatedGoods() {
        console.log("关联商品")
        this.searchParam.pageNum = '1'
        this.loadGoodsList()
        this.showGoodsList = true
      },
      showGoodsListClose() {
        this.searchParam={
          pageSize: 10,
          pageNum: 1,
        }
          if (this.multipleSelection.length > 0) {
            this.bindingList.forEach((i,dex)=>{
              this.multipleSelection.forEach((item,index)=>{
                  if (i.goodsId==item.goodsId) {
                     this.multipleSelection.splice(index,1)
                  }
                })
              })
            this.bindingList = this.bindingList.concat(this.multipleSelection)
          }
          this.showGoodsList = false
      },
      deleteGoods(row, val) {
        let that = this
          that.bindingList.map((item, index) => {
            if (val == index) {
              that.bindingList.splice(index, 1)
            }
          })
      },
      // 新建标签跳详情
      getGoodsDtl(row) {
          let newpage = this.$router.resolve({
            path: "/goods/list", //路径
            query: {
              goodsId: row.goodsId, //商品id
            }
          })
          window.open(newpage.href, '_blank');
      },
      submitUpdate(val) {
        console.log(val)
        // return false
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let scope = this
            let goodsData = []
              this.bindingList.forEach(item => {
                let obj = {
                  goodsId: item.goodsId,
                  storeSettleRatio: item.storeSettleRatio ? item.storeSettleRatio : "0",
                  supplierSettleRatio: item.supplierSettleRatio ? item.supplierSettleRatio : "0"
                }
                goodsData.push(obj)
              })
              this.form.relatedGoodsList = goodsData
            let goodsIdData = this.form.relatedGoodsList.map(value => value.goodsId);
            const goodsIdDataSet = new Set(goodsIdData);
            if (goodsIdDataSet.size != goodsIdData.length) {
              this.$message({
                message: '绑定的商品有重复',
                type: 'warning'
              });
              return false;
            }
            if (this.form.goodsType == 1&&this.form.relatedGoodsList.length <= 0) {
              this.$message({
                message: "请选择主题需要关联的商品",
                type: "warning"
              });
              return false
            }
            console.log(this.form,this.testDate);
            return false
            this.loading = true
            if (val == 1) {
              postMethod('/live/add-live', this.form).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              })
            } else if (val == 2) {
              this.form.goodsThemeId = this.editData.goodsThemeId
              postMethod('/live/update-live', this.form).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              })
            }

          } else {
            this.loading = false
            return false;
          }
        })
      },
      search() {
          if (this.multipleSelection.length > 0) {
            this.bindingList.forEach((i,dex)=>{
              this.multipleSelection.forEach((item,index)=>{
                  if (i.goodsId==item.goodsId) {
                     this.multipleSelection.splice(index,1)
                  }
                })
              })
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = '1'
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
          postMethod("/goods/list", this.searchParam).then(res => {
            console.log(this.bindingList,'已绑定的商品')
            this.tableData.list = res.data.records;
            this.tableData.total = res.data.total;
            this.showPagination = this.tableData.total == 0;
            this.testF()
          });

      },
      testF(){
        this.$nextTick(() => {
          this.tableData.list.forEach((item,index)=>{
            this.bindingList.forEach((i,dex)=>{
              if (i.goodsId==item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
          })
      },
      // 选择商品
      handleSelectionChange(val) {
        console.log(val, 'val')
        let n = val.filter(item => !this.multipleSelection.includes(item));
        console.log(n); //本次新增的项
        this.multipleSelection = val;
      },
      selectThis(selection, row) {
        console.log(selection,row);
        this.multipleSelection = selection
        this.bindingList.forEach((item,index)=>{
            if (row.goodsId==item.goodsId) {
               this.bindingList.splice(index,1)
            }
          })
      },
      selectioncChange(selection){
        console.log(selection,'改变');
      },
      currentPage(pageNum) {
          if (this.multipleSelection.length > 0) {
         this.bindingList.forEach((i,dex)=>{
           this.multipleSelection.forEach((item,index)=>{
               if (i.goodsId==item.goodsId) {
                  this.multipleSelection.splice(index,1)
               }
             })
           })
           console.log(this.multipleSelection,'this.multipleSelection')
          this.bindingList = this.bindingList.concat(this.multipleSelection)
        }
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },
    }
  }
</script>
<style scoped>

  /deep/.el-table__header-wrapper  .el-checkbox{
  	display:none
  }
  .update-form-panel {
    padding: 30px 20px;
    width: 700px;
  }

  .tag {
    position: absolute;
    top: 0;
    /* border: 1px solid red; */
    width: 148px;
    line-height: 25px;
    text-align: center;
    background-color: rgb(144 147 153 / 35%);
  }

  .upLoadContainer {
    position: relative;
    margin-right: 20px;
  }

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
