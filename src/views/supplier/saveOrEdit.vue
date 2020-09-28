<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" :rules="rules"  label-width="120px">
			<el-form-item label="供应商名称" prop="supplierName">
				<el-input v-model="dataForm.supplierName"></el-input>
			</el-form-item>
			<el-form-item label="登陆账号" prop="loginNo">
				<el-input v-model="dataForm.loginNo" :disabled="disabledLoginNo"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="linkPerson">
				<el-input v-model="dataForm.linkPerson"></el-input>
			</el-form-item>
			<el-form-item label="详细地址" prop="address">
				<el-input v-model="dataForm.address"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobileNo">
				<el-input v-model="dataForm.mobileNo"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="phoneNo">
				<el-input v-model="dataForm.phoneNo"></el-input>
			</el-form-item>
			<el-form-item label="环信配置" style="width:1200px">
				<el-row :span="24" style="" >
					<el-col :span="2" style="padding-left:5px">客服ID:</el-col>
					<el-col :span="4"><el-input v-model="dataForm.huanxNo"></el-input></el-col>
					<el-col :span="2" style="padding-left:5px">技能组:</el-col>
					<el-col :span="4"><el-input v-model="dataForm.skillGroup"></el-input></el-col>
					<el-col :span="2" style="padding-left:5px"></el-col>
					<el-col :span="8"><el-input v-show="false" style="120px" v-model="dataForm.hxConfigId"></el-input></el-col>
				</el-row>
				<el-row :span="24" style="padding-top:15px" >
					<el-col :span="2" style="padding-left:5px">登录账号:</el-col>
					<el-col :span="4"><el-input v-model="dataForm.huanxLoginNo"></el-input></el-col>
					<el-col :span="2" style="padding-left:5px">登录密码:</el-col>
					<el-col :span="4"><el-input v-model="dataForm.huanxLoginPwd"></el-input></el-col>
					<el-col :span="12"></el-col>
				</el-row>
			</el-form-item>
			<!-- <el-form-item label="环信技能组">
				<el-input v-model="dataForm.skillGroup"></el-input>
			</el-form-item>
			<el-form-item label="环信技能组">
				<el-input v-model="dataForm.hxConfigId"></el-input>
			</el-form-item>
			<el-form-item label="环信登录账号">
				<el-input v-model="dataForm.huanxLoginNo"></el-input>
			</el-form-item>
			<el-form-item label="环信登录密码">
				<el-input v-model="dataForm.huanxLoginPwd"></el-input>
			</el-form-item> -->
			<el-form-item label="主营分类" prop="goodType">
				<el-select v-model="dataForm.goodType">
					<el-option
						v-for="item in goodTypeList"
						:key="item.id"
						:value-key="item.typeName"
						:label="item.typeName"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="主营品牌" prop="goodBrand">
				<el-select v-model="dataForm.goodBrand">
					<el-option
						v-for="item in goodBrandList"
						:key="item.id"
						:value-key="item.brandName"
						:label="item.brandName"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="省份" prop="province">
				<el-select v-model="dataForm.province">
					<el-option
						v-for="item in provinceList"
						:key="item.provinceid"
						:value-key="item.province"
						:label="item.province"
						:value="item.provinceid"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="营业执照照片" prop="licenseImg">
				<el-input v-show="false" v-model="dataForm.licenseImg"></el-input>
				<el-upload
					:action="uploadLicenseImgUrl"
					list-type="picture-card"
					:on-preview="handleLicenseImgPreview"
					:before-upload="beforeLicenseImgUpload"
					:on-success="handleLicenseImgSuccess"
					:class="{hide:hideLicenseImgUpload}"
					:file-list="uploadLicenseImgList"
					:on-remove="handleLicenseImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="法人身份证正面" prop="personNoFrontImg">
				<el-input v-show="false" v-model="dataForm.personNoFrontImg"></el-input>
				<el-upload
					:action="uploadPersonNoFrontImgUrl"
					list-type="picture-card"
					:on-preview="handlePersonNoFrontImgPreview"
					:before-upload="beforePersonNoFrontImgUpload"
					:on-success="handlePersonNoFrontImgSuccess"
					:class="{hide:hidePersonNoFrontImgUpload}"
					:file-list="uploadPersonNoFrontImgList"
					:on-remove="handlePersonNoFrontImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="法人身份证背面" prop="personNoSideImg">
				<el-input v-show="false" v-model="dataForm.personNoSideImg"></el-input>
				<el-upload
					:action="uploadpersonNoSideImgUrl"
					list-type="picture-card"
					:on-preview="handlepersonNoSideImgPreview"
					:before-upload="beforepersonNoSideImgUpload"
					:on-success="handlepersonNoSideImgSuccess"
					:class="{hide:hidepersonNoSideImgUpload}"
					:file-list="uploadpersonNoSideImgList"
					:on-remove="handlepersonNoSideImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="协议文件" prop="protocalFile">
				<el-input v-show="false"  v-model="dataForm.protocalFile"></el-input>
				<el-upload
					:action="uploadProtocalFileUrl"
					list-type="text"
					:show-file-list="false"
					:before-upload="beforeProtocalFileUpload"
					:on-success="handleProtocalFileSuccess"
					:file-list="uploadProtocalFileList"
					:on-remove="handleProtocalFileRemove">
					<el-button size="small" v-show="hideProtocalFileUpload" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
				</el-upload>
				<ul class="el-upload-list el-upload-list--text">
					<li
						v-for="(item,index) in uploadProtocalFileList"
						:key="index"
						tabindex="0"
						class="el-upload-list__item is-success el-list-enter-to"
					>
						<!---->
						<a class="el-upload-list__item-name" @click="downlandFile(item)">
							<i class="el-icon-document"></i>{{item.name}}</a>
						<label class="el-upload-list__item-status-label">
							<i
								class="el-icon-upload-success el-icon-circle-check"
								@click="handleProtocalFileRemove(item)"
							></i>
						</label>
						<i class="el-icon-close" @click="handleProtocalFileRemove(item)"></i>
					</li>
				</ul>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
			<el-form-item label="发布礼品">
				<el-switch v-model="dataForm.publishGift" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
      <el-form-item label="平台服务比率" prop="serviceRatio">
        <el-select v-model="dataForm.serviceRatio">
          <el-option
            v-for="item in serviceRatioList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="银行名称" prop="bankName">
				<el-input v-model="dataForm.bankName"></el-input>
			</el-form-item>
			<el-form-item label="银行卡号" prop="bankCardNo">
        <el-input v-model="dataForm.bankCardNo"></el-input>
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
import { luhnCheck } from "@/utils/validate";

export default {
	computed: {},
	mounted() {
		this.loadgoodTypeList();
		this.loadgoodBrandList();
		this.loadprovinceList();
		this.buildLicenseImgGroupId();
		this.buildPersonNoFrontImgGroupId();
		this.buildpersonNoSideImgGroupId();
		this.buildProtocalFileGroupId();
		this.$nextTick(function() {
			if (this.editData.id) {
				this.dataForm = this.editData;
				this.initDefaultImage();
				this.disabledLoginNo = true
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
    const isMobileNumber = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      const isPhone = reg.test(value);
      value = Number(value); //转换为数字
      if (typeof value === "number" && !isNaN(value)) {//判断是否为数字
        value = value.toString(); //转换成字符串
        if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
          callback(new Error("电话号码格式如:138xxxx8754"));
        } else {
          callback();
        }
      } else {
        callback(new Error("电话号码输入错误"));
      }
    }

    const isUploadLicenseImg = (rule, value, callback) => {
      if (this.uploadLicenseImgList <= 0) {
        callback(new Error("请上传营业执照照片"));
      } else {
        callback();
      }
    }

    const isUploadPersonNoFrontImg = (rule, value, callback) => {
      if (this.uploadPersonNoFrontImgList.length <= 0) {
        callback(new Error("请上传法人身份证正面照片"));
      } else {
        callback();
      }
    }

    const isUploadPersonNoSideImg = (rule, value, callback) => {
      if (this.uploadpersonNoSideImgList.length <= 0) {
        callback(new Error("请上传法人身份证背面照片"));
      } else {
        callback();
      }
    }

    const isUploadProtocalFile = (rule, value, callback) => {
      if (this.uploadProtocalFileList.length <= 0) {
        callback(new Error("请上传协议文件"));
      } else {
        callback();
      }
    }

    const validateBankNo = (rule, value, callback) => {
      if (!luhnCheck(this.dataForm.bankCardNo)) {
        callback(new Error("银行卡号输入错误"));
      } else {
        callback();
      }
    }
		return {
      serviceRatioList: [{
        value: '0.05',
        label: '5%'
      }, {
        value: '0.1',
        label: '10%'
      }, {
        value: '0.2',
        label: '20%'
      }, {
        value: '0.3',
        label: '30%'
      }, {
        value: '0.4',
        label: '40%'
      }],
			disabledLoginNo:false,
			goodTypeList: [],
			goodBrandList: [],
			provinceList: [],
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
			ProtocalFileFileList: [],
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				supplierName: "",
				loginNo: "",
				linkPerson: "",
				mobileNo: "",
				phoneNo: "",
				address: "",
				bankName: "",
				bankCardNo: "",
				goodType: "",
				huanxNo:"",
				skillGroup:'',
				huanxLoginNo:'',
				huanxLoginPwd:'',
				goodBrand: "",
				province: "",
				enable: true,
				licenseImg: "",
				personNoFrontImg: "",
				personNoSideImg: "",
				protocalFile: "",
				id: ""
			},
      rules: {
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
        ],
        loginNo: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
        ],
        linkPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        mobileNo: [
          { required: true, message: "请输入手机号码", trigger: "blur"},
          { validator: isMobileNumber, trigger: "blur" }
        ],
        phoneNo: [
          { required: true, message: "请输入联系电话", trigger: "blur"},
          { validator: isMobileNumber, trigger: "blur" }
        ],
        goodType: [
          { required: true, message: '请选择主营分类', trigger: 'change' },
        ],
        goodBrand: [
          { required: true, message: '请选择主营品牌', trigger: 'change' },
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' },
        ],
        serviceRatio: [
          { required: true, message: '请选择平台服务比率', trigger: 'change' },
        ],
        licenseImg: [
          { required: true, validator: isUploadLicenseImg, trigger: "blur" }
        ],
        personNoFrontImg: [
          { required: true, validator: isUploadPersonNoFrontImg, trigger: "blur" }
        ],
        personNoSideImg: [
          { required: true, validator: isUploadPersonNoSideImg, trigger: "blur" }
        ],
        protocalFile: [
          { required: true, validator: isUploadProtocalFile, trigger: "blur" }
        ],
        bankName: [
          { required: true, message: '请输入银行名称', trigger: 'blur' },
        ],
        bankCardNo: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          { validator: validateBankNo, trigger: "blur" }
        ],
      },

		};
	},
	methods: {
		loadgoodTypeList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend/goodType/findList", param).then(res => {
				scope.goodTypeList = res.data;
			});
		},
		loadgoodBrandList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend/goodBrand/findList", param).then(res => {
				scope.goodBrandList = res.data;
			});
		},
		loadprovinceList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend//areas/findProvince", param).then(res => {
				scope.provinceList = res.data;
			});
		},
		buildLicenseImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadLicenseImgUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.licenseImg = this.dataForm.licenseImg || res.data;
			});
		},
		handleLicenseImgPreview() {},
		handleLicenseImgRemove(res) {
			for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
				if (
					this.uploadLicenseImgList[i].filePath == (res.filePath || res.response.data.filePath)
				) {
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
      this.clearValidate('licenseImg')
      this.dataForm.licenseImg = res.data.groupId
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
			return fileTypeVerify && isLt2M;
		},
		buildPersonNoFrontImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadPersonNoFrontImgUrl = getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.personNoFrontImg = this.dataForm.personNoFrontImg || res.data;
			});
		},
		handlePersonNoFrontImgPreview() {},
		handlePersonNoFrontImgRemove(res) {
			this.hidePersonNoFrontImgUpload = false;
			for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
				if (
					this.uploadPersonNoFrontImgList[i].filePath == (res.filePath || res.response.data.filePath)
				) {
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
      this.clearValidate('personNoFrontImg')
      this.dataForm.personNoFrontImg = res.data.groupId
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
			return fileTypeVerify && isLt2M;
		},
		buildpersonNoSideImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadpersonNoSideImgUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.personNoSideImg =
					this.dataForm.personNoSideImg || res.data;
			});
		},
		handlepersonNoSideImgPreview() {},
		handlepersonNoSideImgRemove(res) {
			for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
				if (
					this.uploadpersonNoSideImgList[i].filePath == (res.filePath || res.response.data.filePath)
				) {
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
      this.clearValidate('personNoSideImg')
      this.dataForm.personNoSideImg = res.data.groupId
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
			return fileTypeVerify && isLt2M;
		},
		buildProtocalFileGroupId() {
			if (this.dataForm.protocalFile == "") {
				getMethod("/backend/oss/groupId", null).then(res => {
					this.uploadProtocalFileUrl =
						getUploadUrl() + "?groupId=" + res.data;
					this.dataForm.protocalFile =
						this.dataForm.protocalFile || res.data;
				});
			} else {
				this.uploadProtocalFileUrl =
					getUploadUrl() + "?groupId=" + this.dataForm.protocalFile;
			}
		},
		handleProtocalFilePreview() {},
		handleProtocalFileRemove(res) {
			for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
				if (
					this.uploadProtocalFileList[i].filePath == (res.filePath || res.response.data.filePath)
				) {
					this.uploadProtocalFileList.splice(i, 1);
					break;
				}
			}
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
      this.clearValidate('protocalFile')
      this.dataForm.protocalFile = res.data.groupId
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
			return fileTypeVerify && isLt2M;
		},
		initDefaultImage() {
			this.fileList = this.dataForm.files;
			for (let i = 0; i < this.dataForm.files.length; i++) {
				let imageObj = this.dataForm.files[i];
				if (imageObj.groupId == this.dataForm.licenseImg) {
					this.uploadLicenseImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.personNoFrontImg) {
					this.uploadPersonNoFrontImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.personNoSideImg) {
					this.uploadpersonNoSideImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.protocalFile) {
					this.uploadProtocalFileList.push(imageObj);
				}
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
			let scope = this;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          delete this.dataForm.createTime;
          delete this.dataForm.createBy;

          let fileList = [];
          fileList = fileList.concat(this.uploadLicenseImgList);
          fileList = fileList.concat(this.uploadPersonNoFrontImgList);
          fileList = fileList.concat(this.uploadpersonNoSideImgList);
          fileList = fileList.concat(this.uploadProtocalFileList);
          this.dataForm.fileJsonStr = JSON.stringify(fileList);
          this.dataForm.files = [];

          postMethod("/backend/supplier/update", this.dataForm).then(
            res => {
              scope.typeList = res.data;
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$emit("showListPanel", true);
            }
          );
        } else {
          return false;
        }
      });
		},
		cancelUpdate() {
			this.$emit("showListPanel", true);
		},
		submitUpdate() {
			this.saveObject();
		},
    clearValidate(field) {
      let _field = this.$refs['dataForm'].fields /*当然，你可以打印一下fields*/
      _field.map(i => {
        if(i.prop === field){  //通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
          i.resetField()
          return false
        }
      })
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
