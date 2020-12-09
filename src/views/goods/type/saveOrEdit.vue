<template>
  <div class="update-form-panel"  v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="dataForm.typeName" />
      </el-form-item>

      <el-form-item label="分类标签">
        <el-input v-model="dataForm.typeLabel" />
      </el-form-item>

      <el-form-item label="上级分类">
        <el-select v-model="dataForm.parentId" placeholder="请选择分类">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :value-key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类图片">
        <el-input v-show="false" v-model="dataForm.typeImage"></el-input>
        <el-upload
          :action="uploadGoodImageUrl"
          list-type="picture-card"
          :on-preview="handleGoodImagePreview"
          :before-upload="beforeGoodImageUpload"
          :on-success="handleGoodImageSuccess"
          :file-list="uploadGoodImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="显示">
        <el-switch v-model="dataForm.isShow" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="dataForm.sort" placeholder="请输入排序" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate";

export default {
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      typeList: [
        {
          id: "-1",
          typeName: "一级分类"
        }
      ],
      loading:false,
      uploadGoodImageList: [],
      hideGoodImageUpload: false,
      uploadGoodImageUrl: "",
      fileSortImage: 0,
      imageUrl: "",
      fileList: [],
      dataForm: {
        id: "",
        typeName: "",
        typeLabel: "",
        isShow: '',
        sort: "",
        fileJsonStr: "",
        typeImage: "",
        iconFiles: [],
        parentId: "-1"
      }
    };
  },
  computed: {},
  mounted() {
    this.dataForm = this.editData;
    this.$nextTick(()=>{

      if(this.dataForm.typeImage != undefined &&  this.dataForm.typeImage != ''){
        let data = {
          url:this.dataForm.typeImage
        }
        this.uploadGoodImageList.push(data)
      }
      if(this.dataForm.isShow=='1'){
        this.dataForm.isShow=true
      }else{
        this.dataForm.isShow=false
      }
    })
    this.findGoodType();
    this.buildGoodImageGroupId();
  },
  created() {},
  methods: {
    findGoodType() {
      const scope = this;
      const param = {
        parentId: "-1"
      };
      getMethod("/backend/goodType/findList", param).then(res => {
        scope.typeList = res.data;
        scope.typeList.unshift({
          id: "-1",
          typeName: "一级分类"
        });
      });
    },
    buildGoodImageGroupId() {
      getMethod("/backend/oss/groupId", null).then(res => {
        this.uploadGoodImageUrl = getUploadUrl() + "?groupId=" + res.data;
      });
    },
    handleGoodImagePreview() {},
    handleGoodImageRemove(res) {
      this.hideGoodImageUpload = false;
    },
    handleGoodImageSuccess(res, file) {
      this.uploadGoodImageList = []
      this.uploadGoodImageList.push(res.data)
      this.loading = false
      this.dataForm.typeImage = res.data.url
      this.hideGoodImageUpload = true
    },
    beforeGoodImageUpload(file) {
      const fileTypeVerify =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      this.loading = true
      return isLt2M;
    },
    initDefaultImage() {
      this.fileList = this.dataForm.files;
      for (let i = 0; i < this.dataForm.files.length; i++) {
        let imageObj = this.dataForm.files[i];
        if (imageObj.groupId == this.dataForm.goodImage) {
          this.uploadGoodImageList.push(imageObj);
        }
      }
      if (this.uploadGoodImageList.length >= 1) {
        this.hideGoodImageUpload = true;
      }
    },
    saveGoodType() {
      const scope = this;
      if (this.validate()) {
        delete this.dataForm.createTime;
        delete this.dataForm.createBy;
        delete this.dataForm.children;

        let fileList = [];
        fileList = fileList.concat(this.uploadGoodImageList);
        this.dataForm.iconFiles = [];
        this.dataForm.fileJsonStr = JSON.stringify(fileList);
        this.dataForm.files = [];
        if(this.dataForm.typeName==''||this.dataForm.typeName==undefined){
          this.$message({
            message: "请输入分类名称",
            type: "warning"
          });
          return
          }
          if(this.dataForm.typeLabel==''||this.dataForm.typeLabel==undefined){
            this.$message({
              message: "请输入分类标签",
              type: "warning"
            });
            return
            }
            if(this.dataForm.parentId==''||this.dataForm.parentId==undefined){
              this.$message({
                message: "请选择上级分类",
                type: "warning"
              });
              return
              }
			  if(this.dataForm.isShow==true){
				  this.dataForm.isShow='1'
			  }else if(this.dataForm.isShow==false){
				  this.dataForm.isShow='0'
			  }
        postMethod("/backend/goodType/update", this.dataForm).then(res => {
          scope.typeList = res.data;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.$emit("showListPanel", true);
        });
      }
    },
    validate() {
      const notNvl = ["typeName", "typeLabel", "sort"];
      for (let i = 0; i < notNvl; i++) {
        if (this.dataForm[notNvl[i]] == "") {
          this.$message({
            message: "字段不能为空",
            type: "warning"
          });
          return false;
        }
      }

      const needInt = ["sort"];
      for (let i = 0; i < needInt; i++) {
        if (isInteger(this.dataForm[needInt[i]])) {
          this.$message({
            message: "请输入正整数",
            type: "warning"
          });
          return false;
        }
      }
      return true;
    },
    cancelUpdate() {
      this.$emit("showListPanel", true);
    },
    submitUpdate() {
      this.saveGoodType();
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
