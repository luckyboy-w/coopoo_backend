<template>
	<div>
		<saveOrEdit v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";

export default {
	components: { saveOrEdit },
	data() {
		return {
			showAddOrEdit: true,
			editData: {},
		};
	},
	props:{
	},
	computed: {},
	mounted() {
	},
	created() {},
	methods: {
		showListPanel(isCancel) {
			this.showAddOrEdit = false;
			this.$nextTick(()=>{
				this.showAddOrEdit = true;
			})
		},
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
