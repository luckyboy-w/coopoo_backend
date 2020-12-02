<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>手机号:</td>
						<td>
							<el-input v-model="searchParam.phoneNo" width="180px"></el-input>
						</td>
						<td>会员类型:</td>
						<td>
                <el-select v-model="searchParam.memberType" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="普通会员" value="10"></el-option>
                  <el-option label="用户" value="30"></el-option>
                  <el-option label="A类服务商" value="1"></el-option>
                  <el-option label="B类服务商" value="2"></el-option>
                  <el-option label="C类服务商" value="3"></el-option>
                  <el-option label="D类服务商" value="4"></el-option>
                  <el-option label="E类服务商" value="5"></el-option>
                  <el-option label="EA类服务商" value="6"></el-option>
                </el-select>
						</td>
            <td>状态:</td>
						<td>
                <el-select v-model="searchParam.enable" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="2"></el-option>
                </el-select>
						</td>
            <td>赠品:</td>
						<td>
                <el-select v-model="searchParam.isSendGift" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未发放" value="0"></el-option>
                  <el-option label="已发放" value="1"></el-option>
                </el-select>
						</td>
						<td>邀请人手机号:</td>
						<td>
              <el-input v-model="searchParam.owerProvider" width="180px"></el-input>
						</td>

						<td>
							<el-button icon="el-icon-search" @click="search()">搜索</el-button>
							<el-button plain type="normal" @click="exportData()" icon="el-icon-download">导出</el-button>
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
						border>
						<el-table-column prop="nickName" label="会员名称" width="150px"></el-table-column>
						<el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
						<el-table-column prop="owerProviderName" label="邀请人" width="150px"></el-table-column>
						<el-table-column prop="regTime" label="注册时间" width="150px">
                <template slot-scope="scope">
                    {{scope.row.regTime | formatDate}}
                </template>
            </el-table-column>
						<el-table-column prop="costPrice" label="消费总额" width="150px"></el-table-column>
            <el-table-column prop="beans" label="靠谱豆数量" width="150px"></el-table-column>
            <el-table-column prop="address" label="家庭住址" width="150px"></el-table-column>
            <el-table-column prop="memberType" label="会员类型" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.memberType == '10' && scope.row.isProvider == undefined">会员</span>
                <span v-if="scope.row.memberType == '30' && scope.row.isProvider == undefined">用户</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '1' ">A类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '2' ">B类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '3' ">C类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '4' ">D类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '5' ">E类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.isProvider == '6' ">EF类服务商</span>
              </template>
            </el-table-column>
            <el-table-column prop="isSendGift" label="赠品" width="150px">
              <template slot-scope="scope">
                {{scope.row.isSendGift == "1" ? "已发放" : "未发放"}}
              </template>
            </el-table-column>
            <el-table-column prop="enable" label="状态" width="150px">
              <template slot-scope="scope">
                {{scope.row.enable == "1" ? "启用" : "禁用"}}
              </template>
            </el-table-column>
            <el-table-column prop="pkMemberId" label="操作" width="150px">
                <template slot-scope="scope">
                  <div style="font-size:12px;">
                    <el-link type="primary"  @click="opUserState(scope.row,2)" v-if="scope.row.enable == '1'" >禁用</el-link>
                    <el-link type="primary"  @click="opUserState(scope.row,1)"  v-if="scope.row.enable =='2'">启用</el-link>
                    <el-link type="primary"  @click="sendGift(scope.row)" v-if="scope.row.isSendGift =='0'">发放赠品</el-link>
                    <!--<el-link type="primary"  @click="viewMember(scope.row)" >查看</el-link>-->
                  </div>
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
			<el-dialog title="绑定操作" visible="sendOrder" v-if="bindProvince">
				<el-form ref="form" :model="sendOrderFrm" label-width="80px">
					<el-form-item label="订单编号">
					<el-input v-model="sendOrderFrm.orderNo" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="服务商号码">
					<el-input v-model="sendOrderFrm.expressNo"></el-input>
					</el-form-item>
					<el-form-item>
					<el-button type="primary" @click="submitSend()">确认绑定</el-button>
					<el-button @click="sendOrder=false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<div class="list-panel"></div>
		</div>

		<div v-if="!showList" style="width:600px;padding:20px;40px;40ppx;40px;">
			<el-form ref="form" :model="user" label-width="120px">
				<el-form-item label="会员昵称">
					<el-input v-model="userDtl.nickName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="userDtl.phoneNo"></el-input>
				</el-form-item>
				<el-form-item label="所属服务商">
					<el-input v-model="userDtl.owerProviderName"></el-input>
				</el-form-item>
				<el-form-item label="注册时间">
					<el-input v-model="userDtl.regTimeFmt"></el-input>
				</el-form-item>
				<el-form-item label="最近消费时间">
					<el-input v-model="userDtl.lastLoginTimeFmt"></el-input>
				</el-form-item>
				<el-form-item label="消费总额">
					<el-input v-model="userDtl.costPrice"></el-input>
				</el-form-item>
				<el-form-item label="靠谱豆">
					<el-input v-model="userDtl.beans"></el-input>
				</el-form-item>
				<el-form-item label="所处城市">
					<el-input v-model="userDtl.owerCity"></el-input>
				</el-form-item>
				<el-form-item label="家庭地址">
					<el-input v-model="userDtl.address"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-input v-model="userDtl.enable"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button @click="backToList()">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { getMethod, postMethod, formatDate} from "@/api/request";

export default {
	computed: {},
	mounted() {
		if(this.$route.query.dt != undefined){
			this.searchParam.dataType = this.$route.query.dt
		}
		this.initLoad()
	},
	components: {},
	created() {},
	data() {
		return {
			bindProvince:false,
			providerList:[],
			goodTypeList: [],
			goodBrandList: [],
			provinceList: [],
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			userDtl:{},
			searchParam: {
				typeName: "",
				dataType:'',
				pageSize: 10,
				pageNum: 0
			},
			tableData: {
				list: []
			},
			dataList: []
		};
    },
    filters:{
		formatDate(time){
			if(time == '' || time == undefined){
				return ''
			}
			let date = new Date(time)
			return formatDate(date,'yyyy-MM-dd hh:mm')
		},
		activateFlagStatus(data){
			if(data==1){
				return '未激活'
			}else{
				return '已激活'
			}
		},
		isProviderStatus(data){
			if(data==1){
				return '是'
			}else{
				return '已激活'
			}
		}
	},
	methods: {
		backToList(){
			this.showList = true
		},
		viewMember(row){
			this.showList = false
			this.userDtl = row
			this.userDtl.regTimeFmt = this.formatDate(this.userDtl.regTime)
			this.userDtl.lastLoginTimeFmt = this.formatDate(this.userDtl.lastLoginTime)
		},
		formatDate(time){
			if(time == '' || time == undefined){
				return ''
			}
			let date = new Date(time)
			return formatDate(date,'yyyy-MM-dd hh:mm')
		},
    sendGift(row){
      let scope = this;
      let param = {
        pkMemberId: row.pkMemberId,
        isSendGift: "1"
      }
      this.$confirm("确认是否发放赠品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        postMethod("/backend/member/gift", param).then(
          res => {
            scope.initLoad()
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        );
      });
    },
    opUserState(row,enableVal){
			let scope = this;
			let param = {
				pkMemberId:row.pkMemberId,
				enable:enableVal
			}
			postMethod("/backend/member/modity", param).then(
				res => {
					scope.initLoad()
					this.$message({
						message: "操作成功",
						type: "success"
					});
				}
			);
		},
		exportData(){
			let exportParam = [];
			for(let key in this.searchParam){
				exportParam.push(key+"="+this.searchParam[key]);
			}
			// window.open( process.env.VUE_APP_BASE_API+'/backend/member/export?'+exportParam.join("&"))
			window.open( process.env.VUE_APP_BASE_API+'/backend/member/export?'+exportParam.join("&"))
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
			this.searchParam.dataType = ''
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
			getMethod("/backend/member/findPage", this.searchParam).then(
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
