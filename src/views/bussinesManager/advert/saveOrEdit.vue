<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="130px">
      <el-form-item label="广告名称">
        <el-input v-model="dataForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="广告位置">
        <el-select v-model="dataForm.location">
          <el-option v-for="item in advertLocationList" :key="item.value" :value-key="item.label" :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="广告banner">
        <div id="front-img">
          <el-input v-show="false" v-model="dataForm.image" />
          <el-upload :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
            :before-upload="beforeAdvertUpload" :on-success="handleAdvertSuccess" :class="{hideTrue:hideAdvertUpload}"
            :file-list="uploadAdvertList" :on-remove="handleAdvertRemove">
            <i class="el-icon-plus" />
            <div slot="tip" v-if="dataForm.location==1" class="el-upload__tip">推荐尺寸：1000*1133
            </div>
            <div slot="tip" v-if="dataForm.location==2||dataForm.location==5" class="el-upload__tip">推荐尺寸：1000*600
            </div>
            <div slot="tip" v-if="dataForm.location==4" class="el-upload__tip">推荐尺寸：1000*516
            </div>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="image" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="跳转类型">
        <el-select @change="changeType" v-model="dataForm.dataType" placeholder="请选择">
          <el-option label="商品主题" :value="3" />
          <!-- <el-option
            label="平台直播"
            value="7"
          /> -->
          <el-option label="链接" :value="2" />
          <el-option label="大佬说" :value="6" />
          <el-option label="编辑器" :value="4" />
          <el-option label="限时秒杀" :value="5" />
          <el-option label="平台直播" :value="7" />
          <el-option label="优惠券" :value="8" />
          <el-option label="新人礼" :value="9" />
          <el-option label="邀请好友" :value="10" />
          <el-option label="门店列表" :value="11" />
          <el-option label="拼团" :value="12" />
          <el-option label="砍价" :value="13" />
          <el-option label="无" :value='0' />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.dataType == 3" label="商品主题">
          <el-select v-model="dataForm.url" placeholder="请选择">
            <el-option v-for="item in relationList" :key="item.id"  :label="item.text" :value="item.id"></el-option>
          </el-select>
      </el-form-item>
	  <el-form-item v-if="dataForm.dataType == 2" label="链接地址">
	    <el-input v-model="dataForm.url" placeholder="请输入"></el-input>
	  </el-form-item>
      <el-form-item v-if="dataForm.dataType == 7" label="平台直播">
        <el-select v-model="dataForm.url" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id"  :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.dataType == 6" label="大佬说">
        <el-select v-model="dataForm.url" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-show="false" label="限时抢购">
        <el-input v-model="dataForm.url" value=""></el-input>
      </el-form-item> -->
      <el-form-item v-if="dataForm.dataType == 8" label="优惠券">
        <el-select v-model="dataForm.url" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="dataForm.dataType == 13" label="砍价活动">
        <el-select v-model="dataForm.url" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.dataType == 12" label="拼团活动">
        <el-select v-model="dataForm.url" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.dataType == 12||dataForm.dataType == 13" label="活动分享图">
        <div id="front-img_">
          <el-input v-show="false" v-model="dataForm.activityImg" />
          <el-upload :action="uploadAdvertUrl_" list-type="picture-card" :on-preview="handleAdvertPreview"
            :before-upload="beforeAdvertUpload_" :on-success="handleAdvertSuccess_" :class="{hideTrue:hideAdvertUpload}"
            :file-list="uploadAdvertList_" :on-remove="handleAdvertRemove_">
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog>
            <img width="100%" :src="image" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item v-if="dataForm.dataType == 12||dataForm.dataType == 13" label="富文本显示">
        <qEditor style="width: 650px;" :content="dataForm.extra" ref="refEditor_" :module-name="moduleName"
          @changeContent="changeContent_" />
      </el-form-item>

      <el-form-item v-if="dataForm.dataType == 4" label="编辑器">
        <qEditor style="width: 650px;" :content="dataForm.url" ref="refEditor" :module-name="moduleName"
          @changeContent="changeContent" />
      </el-form-item>
      <!--  <el-form-item label="排序">
        <el-input v-model="dataForm.sort"/>
      </el-form-item> -->
      <!-- <el-form-item v-show="false" label="是否启用">
        <el-switch
          v-model="dataForm.enable"
        /> -->
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
  } from "@/api/request";
  import {
    isInteger
  } from "@/utils/validate";
  import qEditor from "@/components/RichText/quill-editor";

  export default {
    components: {
      qEditor
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        moduleName: 'activityContentName',
        dialogVisible: false,
        dialogImageUrl: '',
        advertLocationList: [{
            value: 1,
            label: "首页bannner"
          },
          {
            value: 2,
            label: "首页-限时抢购"
          },
          {
            value: 5,
            label: "靠谱豆商城"
          },
          {
            value: 4,
            label: "我的-线下门店"
          },
        ],
        uploadAdvertList: [],
        uploadAdvertList_: [],
        hideAdvertUpload: false,
        uploadAdvertUrl: "",
        uploadAdvertUrl_: "",
        fileSortImage: 0,
        image: "",
        fileList: [],
        goodList: [],
        relationList: [],
        loading: false,
        dataForm: {
          dataType: 0,
          name: "",
          url: "",
          sort: "1",
          location: "",
          enable: 1,
          image: "",
          activityImg:'',
          id: "",
          extra:'',
        }
      };
    },
    computed: {},
    mounted() {
      // this.loodGoodList();
      // this.loadGoodActivity();
      // this.loadtypeIdList();
      this.buildAdvertGroupId();
      this.buildAdvertGroupId_();
      this.$nextTick(function () {
        if (this.editData.id) {
          this.dataForm = this.editData
          this.dataForm.sort = '1'
          this.dataForm.enable = this.editData.enable + ''
          this.changeType_(this.editData.dataType)
          if (this.editData.image) {
          this.dataForm.image = this.editData.image;
          this.uploadAdvertList.push({url:this.editData.image})
          this.$nextTick(function() {
            document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style
              .display = 'none'
          })
          }
          if (this.editData.activityImg) {
          this.dataForm.activityImg = this.editData.activityImg;
          this.uploadAdvertList_.push({url:this.editData.activityImg})
          this.$nextTick(function() {
            document.getElementById('front-img_').getElementsByClassName('el-upload--picture-card')[0].style
              .display = 'none'
          })
          }
        }
      });
    },
    created() {},
    methods: {
      changeType(val) {
        getMethod("/operate/get-advert-redirect-value?type=" + val).then(res => {
          this.dataForm.url = ''
          if (val == 4) {
            this.$refs.refEditor.richText = ''
          }
          if (val == 12||val == 13) {
            this.dataForm.extra = ''
            this.$refs.refEditor_.richText = ''
          }
          this.relationList = res.data
        });
      },
      changeType_(val) {
        getMethod("/operate/get-advert-redirect-value?type=" + val).then(res => {
          this.relationList = res.data
          if(this.relationList&&this.relationList.length<=0){
            this.dataForm.url=''
          }else if(this.relationList&&this.relationList.length>0){
            let display=''
            this.relationList.forEach(i=>{
               if (i.id==this.dataForm.url) {
                 display='block'
               }
            })
            if (display=='') {
              this.dataForm.url=''
            }
          }

        });
      },
      changeContent(val) {
        this.dataForm.url = val
      },
      changeContent_(val) {
        this.dataForm.extra = val
      },
      handleAdvertPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      buildAdvertGroupId() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAdvertUrl = getUploadUrl() + "?groupId=" + res.data
        });
      },
      handleAdvertRemove(res) {
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertList.splice(i, 1);
            break;
          }
        }
        document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display =
          'block'
      },
      handleAdvertSuccess(res, file) {
        this.dataForm.image = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertList.length >= 1) {
          this.$nextTick(function() {
            document.getElementById('front-img_').getElementsByClassName('el-upload--picture-card')[0].style
              .display = 'none'
          })
        }
      },
      buildAdvertGroupId_() {
        getMethod("/oss/get-group-id", null).then(res => {
          this.uploadAdvertUrl_ = getUploadUrl() + "?groupId=" + res.data
        });
      },
      handleAdvertRemove_(res) {
        for (let i = 0; i < this.uploadAdvertList_.length; i++) {
          if (this.uploadAdvertList_[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertList_.splice(i, 1);
            break;
          }
        }
        document.getElementById('front-img_').getElementsByClassName('el-upload--picture-card')[0].style.display =
          'block'
      },
      handleAdvertSuccess_(res, file) {
        this.dataForm.activityImg = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertList_.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertList_.length; i++) {
          if (this.uploadAdvertList_[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertList_.length >= 1) {
          this.$nextTick(function() {
            document.getElementById('front-img_').getElementsByClassName('el-upload--picture-card')[0].style
              .display = 'none'
          })
        }
      },
      beforeAdvertUpload(file) {
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
        return fileTypeVerify && isLt2M;
      },
      beforeAdvertUpload_(file) {
        console.log(file)
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024  < 128;
console.log(isLt2M)
        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 128KB!");
        }
        return fileTypeVerify && isLt2M;
      },
      saveObject() {
        let scope = this;
        if (this.validate()) {
        //   delete this.dataForm.createTime;
        //   delete this.dataForm.createBy;
        //   let fileList = [];
        //   fileList = fileList.concat(this.uploadAdvertList);
        //   this.dataForm.fileJsonStr = JSON.stringify(fileList);
        //   this.dataForm.files = [];
        // return false
        if (this.editData.id&&this.editData.id!='') {
          postMethod("/operate/update-advert", this.dataForm).then(
            res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$emit("showListPanel", true);
            }
          );
        } else{
          postMethod("/operate/add-advert", this.dataForm).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          }
        );
        }

        }
      },
      validate() {
        let notNvl = ["name", "location",'image',];
        for (let i = 0; i < notNvl.length; i++) {
          if (this.dataForm[notNvl[i]] == "") {
            this.$message({
              message: "字段不能为空",
              type: "warning"
            });
            return false;
          }
        }
        if (this.dataForm.dataType==3||this.dataForm.dataType==4||this.dataForm.dataType==6||this.dataForm.dataType==7||this.dataForm.dataType==8||this.dataForm.dataType==2) {
          if (this.dataForm.url=='') {
            this.$message({
              message: "字段不能为空",
              type: "warning"
            });
            return false
          }
        }
        if (this.dataForm.dataType==12||this.dataForm.dataType==13) {
          if (this.dataForm.activityImg=='') {
            this.$message({
              message: "字段不能为空",
              type: "warning"
            });
            return false
          }
        }
        // if (this.dataForm.location.indexOf("http://") != -1 ||
        //   this.dataForm.location.indexOf("https://") != -1) {
        //   this.$message({
        //     message: "落地页链接不合法，请以http://或者https://开头",
        //     type: "warning"
        //   });
        //   return
        // }

        // let needInt = [];
        // for (let i = 0; i < needInt.length; i++) {
        //   if (!isInteger(this.dataForm[needInt[i]])) {
        //     this.$message({
        //       message: "请输入正整数",
        //       type: "warning"
        //     });
        //     return false;
        //   }
        // }

        return true;
      },
      cancelUpdate() {
        this.$emit("showListPanel", true);
      },
      submitUpdate() {
        this.saveObject();
      }
    }
  };
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
