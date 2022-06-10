<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="140px" width="500px">
      <el-form-item prop="storeNo" label="门店编号">
        <el-input v-model="dataForm.storeNo" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item prop="storeLevel" label="门店类型">
      <el-select
        v-model="dataForm.storeLevel"
        placeholder="请选择门店类型" 
      >
        <el-option label="蓝丝羽普通门店" :value="0" />
        <el-option label="靠谱家专属门店" :value="1" />
      </el-select>
      </el-form-item>
      <el-form-item prop="storeName" label="门店名称">
        <el-input v-model="dataForm.storeName" />
      </el-form-item>
	  <el-form-item prop="contact" label="联系方式">
	    <el-input maxlength="15" oninput="if(value.length>15) value=value.slice(0,15)" type="number" v-model="dataForm.contact" />
	  </el-form-item>
      <el-form-item prop="userName" label="店主姓名">
        <el-input v-model="dataForm.userName" />
      </el-form-item>
      <el-form-item prop="phoneNo" label="店主手机号">
        <el-input maxlength="11" v-model="dataForm.phoneNo" type="number" oninput="if(value.length>11) value=value.slice(0,11)" :disabled="isDisabled" />
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
      <el-form-item prop="loginAccount" label="门店后台账号">
        <el-input v-model="dataForm.loginAccount" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item prop="bankAccountName" label="账户名称">
        <el-input v-model="dataForm.bankAccountName"/>
      </el-form-item>
      <el-form-item prop="bankName" label="开户行">
        <el-input v-model="dataForm.bankName" />
      </el-form-item>
      <el-form-item prop="bankCard" label="银行账号">
        <el-input v-model="dataForm.bankCard" />
      </el-form-item>
      <el-form-item label="门店列表图片" prop="frontImg">
        <el-input v-show="false" v-model="dataForm.frontImg" />
        <el-upload :action="uploadStoreImgUrl" list-type="picture-card"
          :on-preview="handlePreview" :before-upload="beforeStoreImgUpload" :on-success="handleStoreImgSuccess"
          :class="{hideTrue:hideStoreImgUpload}" :file-list="uploadStoreImgList" :on-remove="handleStoreImgRemove">
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">推荐图片尺寸: 1000 * 528</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="协议文件" prop="protocolFile">
        <el-input v-show="false" v-model="dataForm.protocolFile"></el-input>
        <el-upload
          :action="uploadProtocalFileUrl"
          list-type="text"
          :show-file-list="true"
          :before-upload="beforeProtocalFileUpload"
          :on-success="handleProtocalFileSuccess"
          :file-list="uploadProtocalFileList"
          :on-preview="handleProtocalFilePreview"
          :on-remove="handleProtocalFileRemove"
        >
          <el-button size="small" v-show="hideProtocalFileUpload" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="营业执照照片" prop="licenseImg">
        <el-input v-show="false" v-model="dataForm.licenseImg"></el-input>
        <el-upload
        :limit="1"
          :action="uploadLicenseImgUrl"
          list-type="picture-card"
          :on-preview="handlePreview"
          :before-upload="beforeLicenseImgUpload"
          :on-success="handleLicenseImgSuccess"
          :class="{'hideTrue':hideLicenseImgUpload}"
          :file-list="uploadLicenseImgList"
          :on-remove="handleLicenseImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="法人身份证正面" prop="personFrontImg">
        <el-input v-show="false" v-model="dataForm.personFrontImg"></el-input>
        <el-upload
          :action="uploadPersonNoFrontImgUrl"
          list-type="picture-card"
          :on-preview="handlePreview"
          :before-upload="beforePersonNoFrontImgUpload"
          :on-success="handlePersonNoFrontImgSuccess"
          :class="{hideTrue:hidePersonNoFrontImgUpload}"
          :file-list="uploadPersonNoFrontImgList"
          :on-remove="handlePersonNoFrontImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="法人身份证背面" prop="personSideImg">
        <el-input v-show="false" v-model="dataForm.personSideImg"></el-input>
        <el-upload
          :action="uploadpersonNoSideImgUrl"
          list-type="picture-card"
          :on-preview="handlePreview"
          :before-upload="beforepersonNoSideImgUpload"
          :on-success="handlepersonNoSideImgSuccess"
          :class="{hideTrue:hidepersonNoSideImgUpload}"
          :file-list="uploadpersonNoSideImgList"
          :on-remove="handlepersonNoSideImgRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
            <img width="100%" :src="imageUrl" alt/>
          </el-dialog>
        </el-form-item>
      <el-form-item prop="address" label="详细地址">
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

        uploadLicenseImgList: [],
        hideLicenseImgUpload: false,
        uploadLicenseImgUrl: "",
        uploadPersonNoFrontImgList: [],
        hidePersonNoFrontImgUpload: false,
        uploadPersonNoFrontImgUrl: "",
        uploadpersonNoSideImgList: [],
        hidepersonNoSideImgUpload: false,
        uploadpersonNoSideImgUrl: "",
        uploadProtocalFileList: [],
        hideProtocalFileUpload: true,
        uploadProtocalFileUrl: "",

        fileSortImage: 0,
        imageUrl: '',
        fileList: [],
        dataForm: {
          storeNo:'',
          storeLevel:0,
          storeName: '',
          frontImg: '',
          licenseImg: "",
          personFrontImg: "",
          personSideImg: "",
          protocolFile: "",
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
          bankAccountName:'',
          bankName:'',
          bankCard:''
        },
        rules: {
          // 'storeNo',
          // 'storeLevel',
          // 'storeName',
          // 'userName',
          // 'phoneNo',
          // 'contact',
          // 'address',
          // 'startWorkTime',
          // 'endWorkTime',
          // 'loginAccount',
          // 'bankAccountName',
          // 'bankName',
          // 'bankCard',
          storeNo: [
            {required: true, message: '请输入门店编号', trigger: 'blur'},
          ],
          storeLevel: [
            {required: true, message: '请选择门店类型', trigger: 'change'},
          ],
          storeName: [
            {required: true, message: '请输入门店名称', trigger: 'blur'},
          ],
          contact: [
            {required: true, message: '请输入联系方式', trigger: 'change'},
          ],
          userName: [
            {required: true, message: '请输入店主姓名', trigger: 'change'},
          ],
          phoneNo: [
            {required: true, message: '请输入店主手机号码', trigger: 'change'},
          ],
          loginAccount: [
            {required: true, message: '请输入门店后台账号', trigger: 'change'},
          ],
          bankAccountName: [
            {required: true, message: '请输入账户名称', trigger: 'change'},
          ],
          bankName: [
            {required: true, message: '请输入开户行', trigger: 'change'},
          ],
          bankCard: [
            {required: true, message: '请输入银行账号', trigger: 'change'},
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'change'},
          ],

        },
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
          // this.imageUrl = this.dataForm.frontImg
          this.initDefaultImage()
        }
        this.buildStoreImgGroupId()
        this.buildLicenseImgGroupId();
        this.buildPersonNoFrontImgGroupId();
        this.buildpersonNoSideImgGroupId();
        this.buildProtocalFileGroupId();
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
          that.mk.setPosition(point)
          that.map.panTo(point)
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var ll =[res.point.lng,res.point.lat]
      var x = ll[0] - 0.0065, y = ll[1] - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
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
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var ll =[item.point.lng,item.point.lat]
        var x = ll[0] - 0.0065, y = ll[1] - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        this.dataForm.lng=z * Math.cos(theta)
        this.dataForm.lat=z * Math.sin(theta)
        this.form.address = item.address + item.title
        this.form.addrPoint = item.point
        this.map.clearOverlays()
        this.mk = new BMap.Marker(item.point)
        this.map.addOverlay(this.mk)
        this.map.panTo(item.point)
      },
      initDefaultImage() {
        if(this.dataForm.frontImg&&this.dataForm.frontImg!=''){
            this.uploadStoreImgList.push({url:this.dataForm.frontImg})
        }
        if (this.uploadStoreImgList.length >= 1) {
          this.hideStoreImgUpload = true
        }
        if(this.dataForm.licenseImg&&this.dataForm.licenseImg!=''){
            this.uploadLicenseImgList.push({url:this.dataForm.licenseImg})
        }
        if(this.dataForm.personFrontImg&&this.dataForm.personFrontImg!=''){
            this.uploadPersonNoFrontImgList.push({url:this.dataForm.personFrontImg})
        }
        if(this.dataForm.personSideImg&&this.dataForm.personSideImg!=''){
            this.uploadpersonNoSideImgList.push({url:this.dataForm.personSideImg})
        }
        if(this.dataForm.protocolFile&&this.dataForm.protocolFile!=''){
            this.uploadProtocalFileList.push({url:this.dataForm.protocolFile})
        }
        if (this.uploadLicenseImgList.length >= 1) {
          this.hideLicenseImgUpload = true;
        }

        if (this.uploadPersonNoFrontImgList.length >= 1) {
          this.hidePersonNoFrontImgUpload = true;
        }

        if (this.uploadpersonNoSideImgList.length >= 1) {
          this.hidepersonNoSideImgUpload = true;
        }

        if (this.uploadProtocalFileList.length >= 1) {
          this.hideProtocalFileUpload = true;
        }

      },
      saveObject() {
        const scope = this
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {


          console.log('。。。',this.dataForm);
        if (this.validate()) {
          delete this.dataForm.createTime
          delete this.dataForm.createBy
          if (this.dataForm.phoneNo.length<11) {
            this.$message({
              message: '请输入正确的手机号',
              type: 'warning'
            })
            return false
          }
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
          }})
      },
      validate() {
        if (this.dataForm.frontImg == ''||!this.dataForm.frontImg) {
          this.$message({
            message: '门店图片不能为空',
            type: 'warning'
          })
          return false;
        }
        if (this.dataForm.protocolFile == ''||!this.dataForm.protocolFile) {
          this.$message({
            message: '协议文件不能为空',
            type: 'warning'
          })
          return false;
        }
        if (this.dataForm.licenseImg == ''||!this.dataForm.licenseImg) {
          this.$message({
            message: '营业执照不能为空',
            type: 'warning'
          })
          return false;
        }
        if (this.dataForm.personFrontImg == ''||!this.dataForm.personFrontImg) {
          this.$message({
            message: '身份证正面不能为空',
            type: 'warning'
          })
          return false;
        }
        if (this.dataForm.personSideImg == ''||!this.dataForm.personSideImg) {
          this.$message({
            message: '身份证背面不能为空',
            type: 'warning'
          })
          return false;
        }
        if (this.dataForm.startWorkTime == ''||this.dataForm.startWorkTime==null) {
          this.$message({
            message: '营业开始时间不能为空',
            type: 'warning'
          })
          return false
        }
        if (this.dataForm.endWorkTime == ''||this.dataForm.endWorkTime==null) {
          this.$message({
            message: '营业结束时间不能为空',
            type: 'warning'
          })
          return false
        }
        if (this.dataForm.lat== ''||this.dataForm.lng=='') {
          this.$message({
            message: '请选择门店在地图所在经纬度',
            type: 'warning'
          })
          return false
        }
        return true
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      buildStoreImgGroupId() {
          getMethod('/oss/get-group-id', null).then(res => {
            this.uploadStoreImgUrl = getUploadUrl() + '?groupId=' + res.data
            // this.dataForm.frontImg = res.data
          })
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleStoreImgRemove(res) {
        for (let i = 0; i < this.uploadStoreImgList.length; i++) {
          if (this.uploadStoreImgList[i].url == (res.url || res.response.data.url)) {
            this.dataForm.frontImg=''
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
      buildLicenseImgGroupId() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadLicenseImgUrl =
            getUploadUrl() + "?groupId=" + res.data;
          // this.dataForm.licenseImg = this.dataForm.licenseImg || res.data;
        });
      },
      handleLicenseImgPreview() {
      },
      handleLicenseImgRemove(res) {
        for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
          if (
            this.uploadLicenseImgList[i].url == (res.url || res.response.data.url)
          ) {
            this.dataForm.licenseImg=''
            this.uploadLicenseImgList.splice(i, 1);
            break;
          }
        }
        this.hideLicenseImgUpload = false;
      },
      handleLicenseImgSuccess(res, file) {

        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadLicenseImgList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
          if (this.uploadLicenseImgList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (imageCnt >= 1) {
          this.hideLicenseImgUpload = true;
        }
        // this.clearValidate('licenseImg')
        this.dataForm.licenseImg = res.data.url
      },
      beforeLicenseImgUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        if (file.name.length > 30) {
          this.$message.error("上传文件名称大小不能超过30个字符!");
          return false;
        }

        return fileTypeVerify && isLt2M;
      },
      buildPersonNoFrontImgGroupId() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadPersonNoFrontImgUrl = getUploadUrl() + "?groupId=" + res.data;
          // this.dataForm.personFrontImg = this.dataForm.personFrontImg || res.data;
        });
      },
      handlePersonNoFrontImgPreview() {
      },
      handlePersonNoFrontImgRemove(res) {
        this.hidePersonNoFrontImgUpload = false;
        for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
          if (
            this.uploadPersonNoFrontImgList[i].url == (res.url || res.response.data.url)
          ) {
            this.dataForm.personFrontImg=''
            this.uploadPersonNoFrontImgList.splice(i, 1);
            break;
          }
        }
      },
      handlePersonNoFrontImgSuccess(res, file) {
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadPersonNoFrontImgList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
          if (this.uploadPersonNoFrontImgList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (imageCnt >= 1) {
          this.hidePersonNoFrontImgUpload = true;
        }
        // this.clearValidate('personFrontImg')
        this.dataForm.personFrontImg = res.data.url
      },
      beforePersonNoFrontImgUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        if (file.name.length > 30) {
          this.$message.error("上传文件名称大小不能超过30个字符!");
          return false;
        }

        return fileTypeVerify && isLt2M;
      },
      buildpersonNoSideImgGroupId() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadpersonNoSideImgUrl =
            getUploadUrl() + "?groupId=" + res.data;
          // this.dataForm.personSideImg =
          //   this.dataForm.personSideImg || res.data;
        });
      },
      handlepersonNoSideImgPreview() {
      },
      handlepersonNoSideImgRemove(res) {
        for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
          if (
            this.uploadpersonNoSideImgList[i].url == (res.url || res.response.data.url)
          ) {
            this.dataForm.personSideImg=''
            this.uploadpersonNoSideImgList.splice(i, 1);
            break;
          }
        }
        this.hidepersonNoSideImgUpload = false;
      },
      handlepersonNoSideImgSuccess(res, file) {
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadpersonNoSideImgList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
          if (this.uploadpersonNoSideImgList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (imageCnt >= 1) {
          this.hidepersonNoSideImgUpload = true;
        }
        // this.clearValidate('personSideImg')
        this.dataForm.personSideImg = res.data.url
      },
      beforepersonNoSideImgUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        if (file.name.length > 30) {
          this.$message.error("上传文件名称大小不能超过30个字符!");
          return false;
        }
        return fileTypeVerify && isLt2M;
      },
      buildProtocalFileGroupId() {
        // if (this.dataForm.protocolFile == "") {
          getMethod("/oss/get-group-id", null).then(res => {
            this.uploadProtocalFileUrl =
              getUploadUrl() + "?groupId=" + res.data;
            // this.dataForm.protocolFile =
            //   this.dataForm.protocolFile || res.data;
          });
        // } else {
        //   this.uploadProtocalFileUrl =
        //     getUploadUrl() + "?groupId=" + this.dataForm.protocolFile;
        // }
      },
      handleProtocalFilePreview(file) {
          window.open(file.url)
      },
      handleProtocalFileRemove(res) {
        for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
          if (
            this.uploadProtocalFileList[i].url == (res.url || res.response.data.url)
          ) {
            this.dataForm.protocolFile=''
            this.uploadProtocalFileList.splice(i, 1);
            break;
          }
        }
      },
      downloadFile(file) {
        /*console.info(file);
        window.open(file.url);*/
        //下载图片地址和图片名
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

          var a = document.createElement("a"); // 生成一个a元素
          var event = new MouseEvent("click"); // 创建一个单击事件
          a.download = name || "photo"; // 设置图片名称
          a.href = url; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = file.url;
      },
      handleProtocalFileSuccess(res, file) {
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        res.data.name = file.name;
        this.uploadProtocalFileList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
          if (this.uploadProtocalFileList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (imageCnt >= 2) {
          this.hideProtocalFileUpload = true;
        }
        // this.clearValidate('protocolFile')
        this.dataForm.protocolFile = res.data.url
      },
      beforeProtocalFileUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        if (file.name.length > 30) {
          this.$message.error("上传文件名称大小不能超过30个字符!");
          return false;
        }
        return fileTypeVerify && isLt2M;
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
