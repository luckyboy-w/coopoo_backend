<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>
						<el-button icon="el-icon-download" @click="exportData()">导出</el-button>
						<el-button icon="el-icon-back" v-if="showBack" @click="backToList()">返回列表</el-button>
						</td>
					</tr>
				</table>
			</div>
			<div class="ly-table-panel">
				<div class="ly-data-list">
					<el-table
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%; margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column prop="realName" label="真实姓名" width="150px"></el-table-column>
						<el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
						<el-table-column prop="sex" label="性别" width="150px"></el-table-column>
						<el-table-column prop="userCity" label="所在城市" width="150px"></el-table-column>
						<el-table-column prop="personNo" label="身份证号" width="150px"></el-table-column>
						<el-table-column prop="subBeans" label="报名靠谱豆" width="150px"></el-table-column>
                        <el-table-column prop="createTime" label="报名时间" width="150px">
							<template slot-scope="scope">
								{{ scope.row.createTime | _formatDate }}
							</template>
						</el-table-column>
                        <el-table-column prop="actTitle" label="活动标题" width="300px"></el-table-column>
                        
					</el-table>
				</div>
				<div class="ly-data-pagination">
					<el-pagination
						background
						v-show="!showPagination"
						layout="prev, pager, next"
						@current-change="currentPage"
						@prev-click="currentPage"
						@next-click="currentPage"
						:total="tableData.total"
					></el-pagination>
				</div>
			</div>
			<div class="list-panel"></div>
		</div>
	</div>
</template>

<script>
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from '@/api/tools.js'

export default {
	computed: {},
	props:{
		actData:{
			type: Object,
			required: false,
			default: null
		}
	},
	components: {},
	created() {},
	filters:{
		_formatDate(time) {
		if(time == undefined){
			return '尚未支付，暂无时间'
		}
		const date = new Date(time)
		return formatDate(date, 'yyyy-MM-dd hh:mm')
		}
	},
	data() {
		return {
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			showBack:false,
			searchParam: {
                userName: "",
				mobilePhone: "",
				activitId: "",
				activityTitle: "",
				pageSize: 10,
				pageNum: 0
			},
			tableData: {
				list: []
			},
			dataList: []
		};
	},
	mounted() {
		if(this.actData != null){
			this.showBack = true
			this.searchParam.activitId = this.actData.activitId
		}
		this.initLoad();
	},
	methods: {
		backToList(){
			 this.$emit('showListPanel',true)
		},
		exportData(){
			let exportParam = [];
			for(let key in this.searchParam){
				if(this.searchParam[key] != undefined){
					exportParam.push(key+"="+this.searchParam[key]);
				}
			}
			window.open( process.env.VUE_APP_BASE_API+'/backend/activityList/export?'+exportParam.join("&"))
		},
		deleteRow(rowIndex, data) {
			let param = {
				id: data.list[rowIndex].id
			};
			this.$confirm("是否继续删除操作?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				postMethod("/backend/activityList/delete", param).then(res => {
					this.loadList();
					this.$message("删除成功");
				});
			});
		},
		batchDeleteRow(rowIndex, data) {
			let selectList = this.$refs.mainTable.selection;
			let idArr = [];
			for (let i = 0; i < selectList.length; i++) {
				idArr.push(selectList[i].id);
			}
			let param = {
				delType: "2",
				ids: idArr.join(",")
			};
			postMethod("/backend/activityList/delete", param).then(res => {
				scope.editData = res.data[0];
				this.showList = false;
				this.showAddOrEdit = true;
				this.$message({
					message: "删除成功",
					type: "success"
				});
			});
			this.searchParam.pageSize = 10;
			this.searchParam.pageNum = 0;
			this.loadList();
		},
		search() {
			this.loadList();
		},
		addOrEdit(oper, rowIndex, data) {
			let scope = this;

			if (oper == "edit") {
				let param = {
					id: data.list[rowIndex].id
				};
				getMethod("/backend/activityList/findObject", param).then(
					res => {
						scope.editData = res.data[0];
						this.showList = false;
						this.showAddOrEdit = true;
					}
				);
			} else {
				scope.editData = {};
				this.showList = false;
				this.showAddOrEdit = true;
			}
		},
		showListPanel(isCancel) {
			this.showList = true;
			this.showAddOrEdit = false;
			this.loadList();
		},
		currentPage(pageNum) {
			this.searchParam.pageNum = pageNum;
			this.loadList();
		},
		initLoad() {
			this.loadList();
		},
		loadList() {
			let scope = this;
			getMethod("/backend/activityList/findActPage", this.searchParam).then(
				res => {
					scope.tableData = res.data;
					scope.showPagination = scope.tableData.total == 0;
				}
			);
		}
	}
};
</script>
<style lang="scss" scoped>
.ly-container {
	padding: 10px 20px;
	font-size: 14px;
	.ly-tool-panel {
		div {
			display: inline;
		}
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
</style>
