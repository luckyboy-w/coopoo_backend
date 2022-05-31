<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="数据类型">
        <el-select

            @change="switchData()"
            v-model="dataForm.infoType">
            <el-option
                key="bean_rules"
                value-key="bean_rules"
                label="靠谱豆规则"
                value="bean_rules"
            ></el-option>
            <el-option
                key="announcement"
                value-key="announcement"
                label="发布告示"
                value="announcement"
            ></el-option>
           <el-option
                key="luck_draw_rules"
                value-key="luck_draw_rules"
                label="抽奖规则"
                value="luck_draw_rules"
            ></el-option>
            <el-option
                key="about_us"
                value-key="about_us"
                label="关于我们"
                value="about_us"
            ></el-option>
            <el-option
                key="user_agreement"
                value-key="user_agreement"
                label="靠谱家用户协议"
                value="user_agreement"
            ></el-option>
            <el-option
                key="vip_agreement"
                value-key="vip_agreement"
                label="靠谱家专属会员协议"
                value="vip_agreement"
            ></el-option>
			<el-option
			    key="posts_notice"
			    value-key="posts_notice"
			    label="帖子告示"
			    value="posts_notice"
			></el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="内容">
        <qEditor
          :content="dataForm.infoContent"
          ref="refEditor"
          moduleName="detailContent"
          @changeContent="changeContent">
        </qEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import qEditor from "@/components/RichText/quill-editor"
export default {
  computed: {},
  components: { qEditor },
  mounted() {
    this.loadData()
  },
  created() {},
  data() {
    return {
      dataForm: {
        infoType: "bean_rules",
        infoContent: ""
      },
    };
  },
  methods: {
    switchData(){
      this.loadData()
    },
    changeContent(val){
      this.dataForm.infoContent = val
    },
    loadData(){
      let scope = this
      getMethod("/site/get-site-info?infoType="+this.dataForm.infoType).then(
        res => {
          this.$refs.refEditor.richText=res.data.infoContent
        }
      );
    },
    saveObject() {
      let scope = this;
        postMethod("/site/set-site-info", this.dataForm).then(
          res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        );
    },
  }
};
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 800px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
