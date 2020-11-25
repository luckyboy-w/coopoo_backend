<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
			<el-form-item label="版本号" prop="versionNo">
				<el-input v-model="dataForm.versionNo"></el-input>
			</el-form-item>
      <el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title"></el-input>
			</el-form-item>
      <el-form-item label="下载地址" prop="downloadUrl">
				<el-input v-model="dataForm.downloadUrl"></el-input>
			</el-form-item>
      <el-form-item label="APP类型" prop="type">
        <el-select v-model="dataForm.type">
          <el-option label="Android" :value="1"></el-option>
          <el-option label="IOS" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否强制更新" prop="isForceUpdate">
        <el-select v-model="dataForm.isForceUpdate">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="更新内容">
        <el-input type="textarea" v-model="dataForm.content"></el-input>
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
import qEditor from "@/components/RichText/quill-editor"

export default {
	computed: {},
	components: { qEditor },
	mounted() {
		this.$nextTick(function() {
			if (this.editData.id) {
				this.dataForm = this.editData;
				this.$refs.refEditor.richText = this.dataForm.content
			}
		});
	},
	created() {},
	props: {
		editData: {
			type: Object,
			required: false
		}
	},
	data() {
		return {
			fileSortImage: 0,
			imageUrl: "",
			dataForm: {
				title: "",
        content: "",
				id: ""
			},
      rules: {
        versionNo: [
          {required: true, message: '请输入版本号', trigger: 'blur'},
        ],
      }
		};
	},
	methods: {
		changeContent(val){
			this.dataForm.content = val
		},
		saveObject() {
			let scope = this;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          delete this.dataForm.createTime;

          let fileList = [];

          this.dataForm.fileJsonStr = JSON.stringify(fileList);
          this.dataForm.files = [];

          postMethod("/backend/lyAppVersion/update", this.dataForm).then(res => {
            scope.typeList = res.data;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          });
        }

      });
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
.hide .el-upload--picture-card {
	display: none;
}
</style>
