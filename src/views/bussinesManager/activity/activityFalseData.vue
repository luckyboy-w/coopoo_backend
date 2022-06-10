<template>
  <div v-loading="loading">
    <div class="ly-container">
      <div class="ly-tool-panel">
        <el-button style="margin-bottom: 10px" @click="backToList()" type="primary" icon="el-icon-back">返回</el-button>
      </div>
      <el-form label-width="150px">
        <el-form-item :label="activityType==5?'拼团浏览记录数据：':'砍价浏览记录数据：'">
          <el-input v-model.number="teste" style="width: 200px;"
            oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')};" />
        </el-form-item>
        <el-form-item :label="activityType==5?'拼团下单记录数据：':'砍价下单记录数据：'">
          <el-input v-model.number="test_" style="width: 200px;"
            oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')};" />
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="index" border>
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column label="头像" width="170px">
            <template slot-scope="scope">
              <div style="height: 80px;line-height: 80px;display: flex;">
                <div v-if="scope.row.img" style="position: relative;display: flex;align-items: center;">
                  <img :src="scope.row.img" width="70px" height="70px" style="object-fit: cover;"
                    @click="handleImgPreview(scope.row.img)"
                    onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' ">
                  <i @click="deleteImg(scope.$index)" class="el-icon-error"
                    style="position: absolute;right: -5px;top: -2px;font-size: 20px;"></i>
                </div>
                <el-input v-show="false" v-model="scope.row.img" />
                <el-upload v-if="!scope.row.img" class="avatar-uploader" :action="uploadImgUrl" :show-file-list="false"
                  :before-upload="beforeUploadImg" :on-success="handleSuccessImg">
                  <i class="el-icon-plus avatar-uploader-icon" @click="uploadClk(scope.$index)" />
                </el-upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsName" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="价格">
            <template slot-scope="scope">
              <el-input oninput="value=value.replace(/[^0-9.]/g,'')" v-model="scope.row.price" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="下单时间" width="170px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.time" placeholder="请输入" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button style="margin-left: 120px;" type="primary" @click="submitFalseData()">
        提交
      </el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>

</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate,
    getUploadUrl
  } from "@/api/request";

  export default {
    name: '',
    props: {
      activityType: [String, Number]
    },
    data() {
      return {
        showPagination: true,
        tableData: {
          list: [],
          total: 0
        },
        uploadImgUrl: '',
        loading: false,
        dialogVisible: false,
        dialogImageUrl: '',
        teste: '',
        test_: '',
        rowIndex: '',
        activityData: {},
        searchParam: {
          activityId: '',
          pageSize: 10,
          pageNum: 1
        }
      };
    },
    components: {},
    filters: {},
    computed: {},
    mounted() {
      console.log('活动类型', this.activityType)
      this.buildImgGroupId()
      // this.activityData = this.rowData
      // this.searchParam.activityId = this.rowData.id
      // this.initRecordData();
      this.initData()

    },
    methods: {
      initData() {
        if (this.tableData.list.length <= 0) {

          for (var i = 0; i < 50; i++) {
            let obj = {
              img: '',
              goodsName: '',
              price: '',
              time: '',
            }
            this.tableData.list.push(obj)
          }
        } else {
          console.log(50 - (this.tableData.list.length))
          let num = 50 - (this.tableData.list.length)
          for (var i = 0; i < num; i++) {
            let obj = {
              img: '',
              goodsName: '',
              price: '',
              time: '',
            }
            this.tableData.list.push(obj)
          }
        }
      },
      submitFalseData() {
        console.log(this.test_, this.teste, this.tableData.list)
      },
      initRecordData() {
        let scope = this;
        //拼團
        if (this.activityType == 5) {
          getMethod("/activity/marketing-goods/collage/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }
        //砍价
        if (this.activityType == 6) {
          getMethod("/activity/marketing-goods/cut-price/part-record", this.searchParam).then(res => {
            scope.tableData.list = res.data.records;
            scope.tableData.total = res.data.total;
            scope.showPagination = scope.tableData.total == 0;
            this.$forceUpdate()
          });
        }

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
      uploadClk(index) {
        console.log('下标', index)
        // return false
        this.rowIndex = index
        this.buildImgGroupId()
      },
      deleteImg(index) {
        console.log('下标', index)
        this.tableData.list[index].img = ''
      },
      handleSuccessImg(res, file) {
        console.log(this.tableData.list)
        this.tableData.list[this.rowIndex].img = res.data.url
        // const groupId = res.data.groupId
        this.loading = false
      },
      handleImgPreview(file) {
        this.dialogImageUrl = file
        this.dialogVisible = true
      },
      backToList() {
        this.$emit('hiddenFalseData')
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }
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
