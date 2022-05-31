<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
			</div>
			<div class="ly-table-panel">
				<div class="ly-data-list">
					<el-table
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%;margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						 <el-table-column prop="type" label="APP类型">
               <template slot-scope="scope">
                 {{scope.row.type == '1' ? "Android" : "IOS"}}
               </template>
             </el-table-column>
						<el-table-column prop="versionNo" label="版本号" ></el-table-column>
						 <el-table-column prop="content" label="更新内容"></el-table-column>
            <el-table-column prop="downloadUrl" label="下载地址"></el-table-column>
            <el-table-column prop="isForceUpdate" label="是否强制更新">
               <template slot-scope="scope">
                 {{scope.row.isForceUpdate == '1' ? "是" : "否"}}
               </template>
             </el-table-column>
						<el-table-column prop="createTime" label="更新时间" width="170px">
							<template slot-scope="scope">
									{{scope.row.createTime}}
							</template>
						</el-table-column>
						<el-table-column prop="id" label="操作">
							<template slot-scope="scope">
									<el-button
										@click="addOrEdit('edit',scope.$index, tableData)"
										type="text"
										size="small"
									>编辑</el-button>
                  <el-button
                  v-if="scope.row.enable==1"
                  	@click="enable('0',scope.row.id)"
                  	type="text"
                  	size="small"
                  >禁用</el-button>
                  <el-button
                  v-if="scope.row.enable==0"
                  	@click="enable('1',scope.row.id)"
                  	type="text"
                  	size="small"
                  >启用</el-button>
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
						:current-page="searchParam.pageNum" 
						@prev-click="currentPage"
						@next-click="currentPage"
						:total="tableData.total"
					></el-pagination>
				</div>
			</div>
			<div class="list-panel"></div>
		</div>
		<saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from '@/api/tools.js'

export default {
	computed: {},
	mounted() {
    this.initLoad();
	},
	components: { saveOrEdit },
	created() {},
	filters: {
		fmtDateStr(val){
			let dt = new Date(val);
			return formatDate(dt, 'yyyy-MM-dd');
		}
	},
	data() {
		return {
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			searchParam: {
				pageSize: 10,
				pageNum: 1
			},
			tableData: {
				list: []
			},
			dataList: []
		};
	},
	methods: {

    enable(val,id){
      let scope = this
      if (val=="1") {
        postMethod('/operate/enable-version-info?id='+id).then(res => {
          this.loadList();
          this.$message({
            message: "启用成功",
            type: "success"
          });
        });
      } else if(val=="0"){
      postMethod('/operate/disable-version-info?id='+id).then(res => {
        this.loadList();
        this.$message({
          message: "禁用成功",
          type: "success"
        });
      });
      }
    },
		search() {
			this.searchParam.pageNum = 1;
			this.loadList();
		},
		addOrEdit(oper, rowIndex, data) {
			let scope = this;
			if (oper == "edit") {
				let param = {
					id: data.list[rowIndex].id
				};
				getMethod("/operate/get-version-info", param).then(res => {
					scope.editData = res.data;
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
			getMethod("/operate/get-version-list", this.searchParam).then(res => {
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
				scope.showPagination = scope.tableData.total == 0;
			});
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
