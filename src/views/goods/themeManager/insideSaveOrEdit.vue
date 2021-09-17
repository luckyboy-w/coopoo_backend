<template>
  <div class="update-form-panel" v-loading="loading">
        <template>
          <div class="attr-content">
            <el-button @click="addAttrNameInput" type="primary" :disabled="disabled" >添加行</el-button>
          </div>
          <div v-for="(attrItem,index) in addAttrParam">
            <div class="attr-content" style="display: ;">
              <div style="width: 50px;">第{{index+1}}行</div>
              <el-select v-model="attrItem.type" style="margin: 0 20px;" :disabled="disabled" placeholder="请选择展示类型">
                <el-option v-for="item in fileTypeList" :key="item.value" :value-key="item.type" :label="item.type"
                  :value="item.value" />
              </el-select>
              <el-button
              :disabled="disabled"
                type="danger"
                @click="deleteAttrNameInput(attrItem,index)"
                icon="el-icon-delete"
              >删除
              </el-button>
            </div>
            <div class="attr-content" style="align-items: flex-start;">
              <div style="width: 70px;">内容</div>
              <div class="upLoadContainer" @click="buildGroupId()" v-if="attrItem.type==2">
                <el-upload :disabled="disabled" :class="{hide:hideVideoUpload}" :action="uploadUrl" list-type="picture-card"
                  v-bind:on-progress="uploadVideoProcess" v-bind:on-success="(response, file)=>handleVideoSuccess(response, file,attrItem,index)"
                  v-bind:before-upload="beforeUploadVideo" v-bind:show-file-list="false">
                  <video v-if="attrItem.videoFile !=''" v-bind:src="attrItem.videoFile" class="video-avatar"
                    style="height: inherit;min-width: inherit;" controls="controls">
                    您的浏览器不支持视频播放
                  </video>
                  <i v-else-if="attrItem.videoFile ==''" class="el-icon-plus" ></i>
                  <i v-if="attrItem.videoFile !='' && disabled==false" @click="handleVideoRemove(index)" class="el-icon-error"
                    style="position: absolute;top: 0;display: flex;"></i>
                  <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent"
                    style="margin-top:7px;"></el-progress>
                    <div slot="tip" v-if="attrItem.videoFile ==''" class="tag">视频</div>
                    <el-dialog>
                      <img width="100%" :src="imageUrl" alt>
                    </el-dialog>
                </el-upload>
                <div v-if="attrItem.videoFile !=''">
                  <el-select :disabled="disabled" v-model="attrItem.goodsId" style="margin: 10px 0;width: 148px;margin-right: 15px;" placeholder="请选择商品">
                    <el-option v-for="item in goodsIdList" :key="item.goodsId" :value-key="item.goodsName" :label="item.goodsName"
                      :value="item.goodsId" />
                  </el-select>
                </div>
              </div>
              <div class="upLoadContainer" v-if="attrItem.type==2">
                <div id="videoCover" @click="buildGroupId">
                  <el-upload :disabled="disabled" :action="uploadUrl" list-type="picture-card" :on-preview="handleImagePreview"
                    :before-upload="beforeImageUpload"
                    :on-success="(response, file,fileList)=>handleVideoCoverSuccess(response, file,fileList,index)"
                    :file-list="attrItem.videoCoverList" :on-remove="(file,fileList)=>handleVideoCoverRemove(file,fileList,index)">
                    <i class="el-icon-plus" />
                    <div slot="tip" class="tag">视频封面</div>
                  </el-upload>
                  <el-dialog>
                    <img width="100%" :src="imageUrl" alt>
                  </el-dialog>
                </div>
              </div>
              <div class="upLoadContainer"  v-if="attrItem.type==1">
                <div @click="buildGroupId" style="display: flex;">
                  <div  v-for="(i,itemIndex) in attrItem.imageList" >
                    <div class="img" >
                      <div class="img-mask">
                        <i class="el-icon-zoom-in my-icon"  @click="showBigImg(i.url)"></i>
                        <i class="el-icon-delete my-icon_" @click="handleImageRemove(i,index)"></i>
                      </div>
                      <el-image style="width: 148px;height: 148px;margin-right: 15px;" :src="i.url"></el-image>
                    </div>
                    <div>
                      <el-select :disabled="disabled" v-model="i.goodsId" style="margin: 10px 0;width: 148px;margin-right: 15px;" placeholder="请选择商品">
                        <el-option v-for="item in goodsIdList" :key="item.goodsId" :value-key="item.goodsName" :label="item.goodsName"
                          :value="item.goodsId" />
                      </el-select>
                    </div>
                  </div>
                 <el-upload :disabled="disabled" :action="uploadUrl" list-type="picture-card" :on-preview="handleImagePreview"
                    :before-upload="beforeImageUpload"
                    :on-success="(response, file,fileList)=>handleImageSuccess(response, file,fileList,index)"
                    :show-file-list="false" :on-remove="(file,fileList)=>handleImageRemove(file,fileList,index)">
                    <i class="el-icon-plus" />
                  </el-upload>
                  <el-dialog>
                    <img width="100%" :src="imageUrl" alt>
                  </el-dialog>
                </div>
              </div>
            </div>
          </div>
        </template>
        <el-button type="success" v-if="!disabled" @click="submitUpdate">提交</el-button>
        <el-button type="primary" @click="cancelUpdate">返回列表</el-button>
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
  export default {
    data() {
      return {
        loading: false,
        disabled:false,
        fileTypeList: [
          {
            value:"1",
            type:"图片"
          },
          {
            value:"2",
            type:"视频"
          }
        ],
        videoList:[],
        videoCoverList:[],
        imageList:[],
        goodsIdList:[],
        addAttrParam:[],
        allFileList:[],
        uploadUrl:'',
        // 视频
        hideVideoUpload: false,
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: '',
        //进度条的进度，
        isShowUploadVideo: false,
        dialogVisible: false,
        dialogImageUrl: '',
        imageUrl: '',
        fileSortImage: 0,
        goodsThemeId:''
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
      if (this.editData.goodsThemeId) {
        this.goodsThemeId=this.editData.goodsThemeId
        this.loadRelationGoods()
      }
      if (this.editData.operation=="edit") {
        this.dataEcho()
      } else if(this.editData.operation=="detail"){
        this.dataEcho()
        this.disabled=true
      }

    },
    created() {},
    methods: {
      loadRelationGoods() {
        let that = this
        getMethod('/goods/theme/related-goods-list?goodsThemeId='+this.goodsThemeId).then(res => {
          that.goodsIdList=res.data
        })
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      dataEcho(){
        let arr=[]
        this.editData.allData.forEach((item,index)=>{
          let echo = {}
          let imgList =[]
          item.goodsThemeProductVOList.forEach((i,iIndex)=>{
             if(i.type==1){
              imgList=imgList.concat(i.image)
              i.image[0].goodsId=i.goodsId
               echo={
                 goodsId:'',
                 imageList:imgList,
                 videoFile:[],
                 videoList:[],
                 videoCoverList:[],
                 type:"1",
               }
             }else if(i.type==2){
               echo={
                 goodsId:i.goodsId,
                 imageList:[],
                 videoFile:i.video[0].url,
                 videoList:i.video,
                 videoCoverList:i.videoCover,
                 type:"2",
               }
             }else{
             }
             return
          })
          arr.push(echo)
        })
        this.addAttrParam=arr
      },
      buildGroupId(event) {
        getMethod('/oss/get-group-id').then(res => {
          this.uploadUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      //上传前回调
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50
        // , 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'
        if (['video/mp4'].indexOf(file.type) == -1) {
          this.$message({
            message: '请上传正确的视频格式',
            type: 'warning'
          })
          return false
        }
        if (!fileSize) {
          this.$message({
            message: '视频大小不能超过50MB',
            type: 'warning'
          })
          return false
        }
        this.isShowUploadVideo = false
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      //上传成功回调
      handleVideoSuccess(res, file,attrItem,index) {
        this.isShowUploadVideo = true
        this.videoFlag = false
        this.videoUploadPercent = 0
        this.getVideoMsg(file.raw).then((videoinfo) => {
          const { duration, height, width } = videoinfo;
          //获取到视频的时长,高度,宽度
          res.data.imgWidth=width
          res.data.imgHeight=height
        });
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.addAttrParam[index].videoFile=res.data.url
        this.addAttrParam[index].videoList=this.addAttrParam[index].videoList.concat(res.data)
        // this.addAttrParam[index].videoList.push(res.data)
        this.allFileList.push(res.data)
      },
      handleVideoRemove(index) {
        this.addAttrParam[index].videoFile=''
        this.addAttrParam[index].videoList=[]
      },

      handleVideoCoverSuccess(res, file,fileList,index) {
        this.addAttrParam[index].videoCoverList=[]
        this.asyncImgChecked(file.raw).then(data => {
          res.data.imgWidth = data.width
          res.data.imgHeight = data.height
        });
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        // this.addAttrParam[index].videoCoverList.push(res.data)
        this.addAttrParam[index].videoCoverList=this.addAttrParam[index].videoCoverList.concat(res.data)
        this.allFileList.push(res.data)
      },
      handleVideoCoverRemove(file,fileList,index) {
        this.addAttrParam[index].videoCoverList=[]
      },
      handleImageSuccess(res, file,fileList,index) {
        this.asyncImgChecked(file.raw).then(data => {
          res.data.imgWidth = data.width
          res.data.imgHeight = data.height
        });
        res.data.goodsId=''
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.addAttrParam[index].imageList=this.addAttrParam[index].imageList.concat(res.data)
        this.allFileList.push(res.data)
      },
      handleImageRemove(i,sub) {
        this.addAttrParam[sub].imageList.map((item,index)=>{
          if (item.groupId==i.groupId) {
            this.addAttrParam[sub].imageList.splice(index,1)
          }
        })
      },
      beforeImageUpload(file) {
        // this.loading = true
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
      handleImagePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      showBigImg(url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      },
      submitUpdate() {
        let that = this
        let goodsThemeRowList=[]
        let fileArr=[]
        let sort = 0
        that.addAttrParam.forEach((item,index)=>{
          let obj = {
            goodsId:'',
            goodsThemeId:'',
            img:'',
            rowNo:'',
            type:'',
            sort:0,
            video:'',
            videoCover:'',
          }
          if (item.imageList.length<=0&&item.videoCoverList.length<=0&&item.videoList.length<=0) {
            let num=index+1
            this.$message({
              message: '请将第'+num+'行内容填写完整',
              type: 'warning'
            })
            return false
          }
          if (item.type==1) {
            item.imageList.map((i,iIndex)=>{
              obj = {
                goodsId:i.goodsId,
                goodsThemeId:that.goodsThemeId,
                img:i.groupId,
                rowNo:index,
                type:1,
                sort:sort++,
              }
              goodsThemeRowList=goodsThemeRowList.concat(obj)
              fileArr=fileArr.concat(i)

            })
          } else if (item.type==2){
               obj.goodsId=item.goodsId
               obj.goodsThemeId=that.goodsThemeId
               obj.video=item.videoList[0].groupId
               obj.videoCover=item.videoCoverList[0].groupId
               obj.rowNo=index
               obj.sort="0"
               obj.type=2
               goodsThemeRowList=goodsThemeRowList.concat(obj)
               fileArr=fileArr.concat(item.videoList[0])
               fileArr=fileArr.concat(item.videoCoverList[0])
          }
          return false
        })
        let param = {
          fileList:fileArr,
          goodsThemeRowList:goodsThemeRowList
        }
        postMethod('/goods/theme/inner-update',param).then(res => {
          this.$emit('showListPanel', true)
         this.$message({
              message: '保存成功',
              type: 'success'
            })
        })



      },
      deleteAttrNameInput(attrItem,index){
        this.addAttrParam.splice(index,1)

      },
      addAttrNameInput(){
        let itemObj = {
          // 各个属性 id为空表示新增
        // id: '',
        sort: this.addAttrParam.length,
        goodsId:'',
        type:"1",
        videoFile:'',
        videoList:this.videoList,
        videoCoverList:this.videoCoverList,
        imageList:this.imageList,
        }
      this.addAttrParam.push(itemObj)
      },
       getVideoMsg(file) {
                return new Promise((resolve) => {
                  let videoElement = document.createElement("video");
                  videoElement.src = URL.createObjectURL(file);
                  videoElement.addEventListener("loadedmetadata", function () {
                    resolve({
                      duration: videoElement.duration,
                      height: videoElement.videoHeight,
                      width: videoElement.videoWidth,
                    });
                  });
                });
              },
      asyncImgChecked(file) {
            return new Promise((resolve) => {
              let _URL = window.URL || window.webkitURL;
              let img = new Image();
              img.src = _URL.createObjectURL(file);
              img.onload=function () {
                resolve({
                  height: img.height,
                  width: img.width,
                });
              };
            });
          },
    }
  }
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 600px;
  }
  $attrTitleWidth: 5vw;
  $attrContentWidth: 60vw;

  .attr-title {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    font-weight: 500;
    //text-align: center;


    width: $attrTitleWidth;
    //background: #2ac06d;
  }

  .attr-save {
    display: inline-block;
    overflow: hidden;
    width: $attrContentWidth;
  }

  .attr-content {
    display: flex;
    flex-wrap: wrap;
    width: $attrContentWidth;
    align-items: center;
    // margin-left: calc(#{$attrTitleWidth} + 4px);
    margin-bottom: 1vh;

    .warning-text {
      font-size: 16px;
      color: red;
      margin-left: 1vw;
    }
  }
  .upLoadContainer {
    position: relative;
    margin-right: 20px;
  }

  .img {
    position: relative;
    width: 148px;
    height: 148px;
    border-radius: 10px;
    overflow: hidden;

    .img-mask {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
      color: white;

      .my-icon {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 35%;
        transform: translate(-50%, -50%);
        font-size: 25px;
      }
      .my-icon_ {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 65%;
        transform: translate(-60%, -50%);
        font-size: 25px;
      }
    }
  }
</style>
<style scoped>
  .tag {
    position: absolute;
    top: 0;
    /* border: 1px solid red; */
    width: 148px;
    line-height: 25px;
    text-align: center;
    background-color: rgb(144 147 153 / 35%);
  }
</style>
