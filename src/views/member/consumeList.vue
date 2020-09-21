<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel" v-if="showDtl">
				<table>
					<tr>
						<td>会员名:</td>
						<td>
							<el-input v-model="searchParam.nickName" width="180px"></el-input>
						</td>
						<td>手机号:</td>
						<td>
							<el-input v-model="searchParam.phoneNo" width="180px"></el-input>
						</td>
						<td>
							<el-button icon="el-icon-search" @click="search()">搜索</el-button>
							<el-button plain type="normal" @click="exportData()" icon="el-icon-download">导出</el-button>
                            <el-button @click="showDtl = true" primary v-if="!showDtl">返回</el-button>
						</td>
					</tr>
				</table>
			</div>
			<div class="ly-table-panel" v-if="showDtl">
				<div class="ly-data-list">
					<el-table
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%; margin-bottom: 20px;"
						row-key="id"
						border>
						<el-table-column prop="nickName" label="会员昵称" width="150px"></el-table-column>
						<el-table-column prop="realName" label="会员姓名" width="150px"></el-table-column>
						<el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
						<el-table-column prop="owerProvider" label="所属服务商" width="150px"></el-table-column>
						<el-table-column prop="consumePrice" label="消费总额" width="150px"></el-table-column>
                        <el-table-column prop="pkMemberId" label="操作" width="150px">
                            <template slot-scope="scope">
                                <el-link @click="consumeDtl(scope.row)" type="primary">消费明细</el-link>
                            </template>
                        </el-table-column>
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
			
			<div class="ly-tool-panel" v-if="!showDtl">
				<table>
					<tr>
						<td>商品名称:</td>
						<td>
							<el-input v-model="searchDtlParam.goodName" width="180px"></el-input>
						</td>
						<td>
							<el-button icon="el-icon-search" @click="searchConsume()">搜索</el-button>
							<el-button @click="showDtl = true" primary v-if="!showDtl">返回</el-button>
						</td>
					</tr>
				</table>
			</div>
            <div class="ly-table-panel" v-if="!showDtl">
				<div class="ly-data-list">
					<el-table
                        width="100%"
						ref="dtlTable"
						:data="dtlTableData"
						style="width: 100%; margin-bottom: 20px;"
						row-key="id"
						border>
						<el-table-column prop="orderNo" label="订单编号" width="240px"></el-table-column>
						<el-table-column prop="goodName" label="商品名称" width="280px"></el-table-column>
						<el-table-column prop="goodNum" label="购买数量" width="150px"></el-table-column>
						<el-table-column prop="payPrice" label="消费总额" width="150px"></el-table-column>
                        <el-table-column prop="tradeTime" label="下单时间" width="180px"></el-table-column>
					</el-table>
				</div>
			</div>

			<div class="list-panel"></div>
		</div>
		<saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
	</div>
</template>

<script>
import saveOrEdit from "./detail";
import { getMethod, postMethod, formatDate} from "@/api/request";

export default {
	computed: {},
	mounted() {
		this.initLoad();
	},
	components: { saveOrEdit },
	created() {},
	data() {
		return {
			row:null,
            showDtl:true,
			goodTypeList: [],
			goodBrandList: [],
			provinceList: [],
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			searchParam: {
				nickName: "",
				phoneNo: "",
				pageSize: 10,
				pageNum: 0
			},
			searchDtlParam:{
				goodName: "",
				pageSize: 10,
				pageNum: 0
			},
            dtlTableData:[],
			tableData: {
				list: []
			},
			dataList: []
		};
    },
    filters:{
		formatDate(time){
			let date = new Date(time)
			return formatDate(date,'yyyy-MM-dd hh:mm')
		}
	},
	methods: {
		exportData(){
			let exportParam = [];
			for(let key in this.searchParam){
				if(this.searchParam[key] != undefined){
					exportParam.push(key+"="+this.searchParam[key]);
				}
			}
			window.open( process.env.VUE_APP_BASE_API+'/backend/analysis/consume/export?'+exportParam.join("&"))
		},
        consumeDtl(row){
            this.loadDtlList(row)
        },
        opUserState(row){

        },
		loadgoodTypeList() {
			let scope = this;
			getMethod("/backend/goodType/findList", null).then(res => {
				scope.goodTypeList = res.data.list;
			});
		},
		loadgoodBrandList() {
			let scope = this;
			getMethod("/backend/goodBrand/findList", null).then(res => {
				scope.goodBrandList = res.data.list;
			});
		},
		loadprovinceList() {
			let scope = this;
			getMethod("/backend/areas/findProvince", null).then(res => {
				scope.provinceList = res.data.list;
			});
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
				postMethod("/backend/supplier/delete", param).then(res => {
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
			postMethod("/backend/supplier/delete", param).then(res => {
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
				getMethod("/backend/supplier/findObject", param).then(res => {
					scope.editData = res.data[0];
					this.showList = false;
					this.showAddOrEdit = true;
				});
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
			getMethod("backend/analysis/consume/list", this.searchParam).then(
				res => {
					scope.tableData = res.data;
					scope.showPagination = scope.tableData.total == 0;
				}
			);
		},
		searchConsume(){
			this.loadDtlList(this.row)
		},
		loadDtlList(row) {
			let scope = this;
			this.row = row
            let param = {
				pkMemberId: row.pkMemberId,
				goodName: this.searchDtlParam.goodName
            }
			getMethod("backend/analysis/consume/dtlList", param).then(
				res => {
					scope.dtlTableData = res.data;
					scope.showDtl = false;
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