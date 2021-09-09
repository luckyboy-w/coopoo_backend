<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="140px" width="500px">
      <el-form-item label="门店编号">
        <el-input v-model="dataForm.storeNo" />
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input v-model="dataForm.storeName" />
      </el-form-item>
	  <el-form-item label="联系方式">
	    <el-input maxlength="15" v-model="dataForm.contact" />
	  </el-form-item>
      <el-form-item label="店主姓名">
        <el-input v-model="dataForm.userName" />
      </el-form-item>
      <el-form-item label="店主手机号">
        <el-input maxlength="11" v-model="dataForm.phoneNo" :disabled="isDisabled" />
      </el-form-item>
      <el-form-item label="营业时间">
        <div style="display: flex;flex-wrap: nowrap;">
          <el-time-picker v-model="dataForm.startWorkTime" value-format="HH:mm" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="请选择开始时间">
          </el-time-picker>
          &nbsp;&nbsp;至&nbsp;&nbsp;
          <el-time-picker value-format="HH:mm" v-model="dataForm.endWorkTime" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="请选择结束时间">
          </el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="门店后台账号">
        <el-input v-model="dataForm.loginAccount" />
      </el-form-item>
      <el-form-item label="开户行">
        <el-input v-model="dataForm.bankName" />
      </el-form-item>
      <el-form-item label="银行账号">
        <el-input v-model="dataForm.bankCard" />
      </el-form-item>
      <el-form-item label="门店列表图片" prop="frontImg">
        <el-input v-show="false" v-model="dataForm.frontImg" />
        <el-upload :action="uploadStoreImgUrl" list-type="picture-card"
          :on-preview="handleStoreImgPreview" :before-upload="beforeStoreImgUpload" :on-success="handleStoreImgSuccess"
          :class="{hideTrue:hideStoreImgUpload}" :file-list="uploadStoreImgList" :on-remove="handleStoreImgRemove">
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1000 * 528</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="dataForm.address" />
      </el-form-item>
     <!-- <el-form-item label="">
        <gdMap @callBackMap="callBackMap" />
      </el-form-item> -->
      <el-form-item label="地址经纬度">
        <div style="display: flex;flex-wrap: nowrap;">
          <div>经度：</div><el-input style="width: 100px;" v-model="dataForm.lng" disabled />&nbsp;&nbsp;&nbsp;&nbsp;
          <div>纬度：</div><el-input style="width: 100px;" v-model="dataForm.lat" disabled />
        </div>
      </el-form-item>
      <el-form-item label="地图定位：">
        <div style="position: absolute;width: 250px;left: 5px;top: 5px;z-index: 999;">
         <el-autocomplete v-model="form.address" style="width:100%;" popper-class="autoAddressClass"
          :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" placeholder="地址搜索" clearable
          @select="handleSelect">
          <template slot-scope="{ item }">
            <i class="el-icon-search fl mgr10" />
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <span class="address ellipsis">{{ item.address }}</span>
            </div>
          </template>
        </el-autocomplete>
        </div>
        <div id="map-container" style="width:100%;height:500px;" />
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
  // import gdMap from './map'
  import loadBMap from '@/utils/loadBMap.js'

  export default {
    // components: {
    //   gdMap
    // },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {

        form: {
          address: '', // 详细地址
          addrPoint: { // 详细地址经纬度
            lng: 0,
            lat: 0
          }
        },
        isDisabled:false,
        map: '', // 地图实例
        mk: '', // Marker实例
        locationPoint: null,
        uploadStoreImgUrl: "",
        dialogVisible: false,
        dialogImageUrl: '',
        hideStoreImgUpload: false,
        uploadStoreImgList: [],
        fileSortImage: 0,
        imageUrl: '',
        fileList: [],
        dataForm: {
          storeNo:'',
          storeName: '',
          frontImg: '',
          userName: '',
          phoneNo: '',
          contact:'',
          lat: '',
          lng: '',
          address: '',
          id: '',
          startWorkTime: '',
          endWorkTime: '',
          loginAccount:'',
          bankName:'',
          bankCard:''
        }
      }
    },
    computed: {},
    async mounted() {
      await loadBMap('w1aGFYvjyBEi0hElRglVFFnWsW5j3OYe') // 加载引入BMap
      this.initMap()
      this.$nextTick(function() {
        if (this.editData.id) {
          this.dataForm = this.editData
          this.isDisabled = this.editData.isDisabled
          this.imageUrl = this.dataForm.frontImg
          this.initDefaultImage()
        }
        this.buildStoreImgGroupId()
      })
    },
    created() {},
    methods: {

      // 初始化地图
      initMap() {
        var that = this
        // 1、挂载地图
        this.map = new BMap.Map('map-container', {
          enableMapClick: false
        })
        var point = new BMap.Point(121.40574100273545,31.167573870839085)
        this.map.centerAndZoom(point, 19)
        this.map.enableScrollWheelZoom(true);
        // 3、设置图像标注并绑定拖拽标注结束后事件
        this.mk = new BMap.Marker(point, {
          enableDragging: true
        })
        this.map.addOverlay(this.mk)
        this.mk.addEventListener('dragend', function(e) {
          that.getAddrByPoint(e.point)
        })
        // 4、添加（右上角）平移缩放控件
        this.map.addControl(new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_SMALL
        }))
        // // 5、添加（左下角）定位控件
        // var geolocationControl = new BMap.GeolocationControl({
        //   anchor: BMAP_ANCHOR_BOTTOM_LEFT
        // })
        // geolocationControl.addEventListener('locationSuccess', function(e) {
        //   that.getAddrByPoint(e.point)
        // })
        // geolocationControl.addEventListener('locationError', function(e) {
        //   alert(e.message)
        // })
        // this.map.addControl(geolocationControl)
        // 7、绑定点击地图任意点事件
        this.map.addEventListener('click', function(e) {
          that.getAddrByPoint(e.point)
        })
      },
      // 获取两点间的距离
      getDistancs(pointA, pointB) {
        return this.map.getDistance(pointA, pointB).toFixed(2)
      },
      // 2、逆地址解析函数
      getAddrByPoint(point) {
        var that = this
        var geco = new BMap.Geocoder()
        geco.getLocation(point, function(res) {
          console.log(res)
          that.mk.setPosition(point)
          that.map.panTo(point)
          console.log(point,res)
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var ll =[res.point.lng,res.point.lat]
      var x = ll[0] - 0.0065, y = ll[1] - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      // console.log('777777',(z * Math.cos(theta)) + ',' + (z * Math.sin(theta)));
          that.dataForm.lng=z * Math.cos(theta)
          that.dataForm.lat=z * Math.sin(theta)
          that.form.address = res.address
          that.form.addrPoint = point
        })
      },
      // 8-1、地址搜索
      querySearchAsync(str, cb) {
        var options = {
          onSearchComplete: function(res) {
            var s = []
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
              for (var i = 0; i < res.getCurrentNumPois(); i++) {
                s.push(res.getPoi(i))
              }
              cb(s)
            } else {
              cb(s)
            }
          }
        }
        var local = new BMap.LocalSearch(this.map, options)
        local.search(str)
      },
      // 8-2、选择地址
      handleSelect(item) {
        console.log('item',item.point);
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var ll =[item.point.lng,item.point.lat]
        var x = ll[0] - 0.0065, y = ll[1] - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        // console.log('55555',(z * Math.cos(theta)) + ',' + (z * Math.sin(theta)));
        this.dataForm.lng=z * Math.cos(theta)
        this.dataForm.lat=z * Math.sin(theta)
        this.form.address = item.address + item.title
        this.form.addrPoint = item.point
        this.map.clearOverlays()
        this.mk = new BMap.Marker(item.point)
        this.map.addOverlay(this.mk)
        this.map.panTo(item.point)
      },
      // setMobilePhone(sel) {
      //   this.dataForm.phoneNo = sel
      // },
      // callBackUploadSuc(res, file) {
      //   this.imageUrl = res.data.url
      //   this.dataForm.frontImg = res.data.url
      // },
      // callBackMap(mapData) {
      //   console.log(mapData, 'mapData')
      //   this.dataForm.lng = mapData.lng
      //   this.dataForm.lat = mapData.lat
      //   this.dataForm.address = mapData.adress
      // },
      initDefaultImage() {
        // this.fileList = this.dataForm.files
        // for (let i = 0; i < this.dataForm.files.length; i++) {
        //   const imageObj = this.dataForm.files[i]
        //   if (imageObj.groupId == this.dataForm.frontImg) {
        //     this.uploadStoreImgList.push(imageObj)
        //   }
        // }
        if(this.dataForm.frontImg&&this.dataForm.frontImg!=''){
            this.uploadStoreImgList.push({url:this.dataForm.frontImg})
        }
        if (this.uploadStoreImgList.length >= 1) {
          this.hideStoreImgUpload = true
        }

      },
      saveObject() {
        console.log(this.dataForm);
        // return false
        const scope = this
        if (this.validate()) {
          delete this.dataForm.createTime
          delete this.dataForm.createBy

          let fileList = []
          fileList = fileList.concat(this.uploadStoreImgList)
          fileList = fileList.concat(this.uploadStoreImgDtlList)
          // this.dataForm.fileJsonStr = JSON.stringify(fileList)
          // this.dataForm.files = []
          if (this.editData.id) {
            this.dataForm.id=this.editData.id
            postMethod('/store/update-store', this.dataForm).then(
              res => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              }
            )
          } else{
          postMethod('/store/add-store', this.dataForm).then(
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
      },
      validate() {
        if (this.dataForm.frontImg == '') {
          this.$message({
            message: '门店图片不能为空',
            type: 'warning'
          })
          return false;
        }
        const notNvl = [
          'storeNo',
          'storeName',
          'userName',
          'phoneNo',
          'contact',
          'address',
          'startWorkTime',
          'endWorkTime',
          'loginAccount',
          'bankName',
          'bankCard',
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
        if (this.dataForm.frontImg == '' ||
          this.dataForm.frontImg == undefined) {
          getMethod('/oss/get-group-id', null).then(res => {
            this.uploadStoreImgUrl = getUploadUrl() + '?groupId=' + res.data
            this.dataForm.frontImg = res.data
          })
        } else {
          this.uploadStoreImgUrl = getUploadUrl() + '?groupId=' + this.dataForm.frontImg
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
        this.dataForm.frontImg = res.data.url
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
