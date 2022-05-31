<template>
  <div class="update-form-panel">
    <div class="title">
      <div class="item">
        靠谱豆规则
      </div>
      <div class="item">
        奖励
      </div>
    </div>
    <!-- <div class="listItem" >
      <div class="item" style="height: 100px;">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">浏览商品50秒</div>
          <div class="tip">每日仅能获得次数1次</div>
          <div>
        已关联主题：<el-select v-model="dataForm.browse_goods_redirect_theme" placeholder="请选择">
          <el-option v-for="item in relationList" :key="item.id"  :label="item.text" :value="item.id"></el-option>
        </el-select>
          </div>
        </div>
      </div>
      <div class="item" style="height: 100px;">
        <el-input v-model="dataForm.browse_goods_fifty_seconds"></el-input>
      </div>
    </div> -->
    <div class="listItem">
      <div class="item">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">分享文章</div>
          <div class="tip">每周仅能获得次数1次</div>
        </div>
      </div>
      <div class="item">
        <el-input v-model="dataForm.share_articles"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">点赞文章</div>
          <div class="tip">每周仅能获得次数1次</div>
        </div>
      </div>
      <div class="item">
        <el-input v-model="dataForm.favor_articles"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">订单评价</div>
          <div class="tip">每个商品获得次数1次</div>
        </div>
      </div>
      <div class="item">
        <el-input v-model="dataForm.order_evaluation"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">种草获赞</div>
          <div class="tip">每满50个赞获得1颗；每日仅能获得次数1次，可累计</div>
        </div>
      </div>
      <div class="item">
        <el-input v-model="dataForm.grass_favor"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        新用户注册
      </div>
      <div class="item">
        <el-input v-model="dataForm.member_register"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item" style="height: 150px;">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">邀请好友</div>
          <div class="tip">每邀请1个好友可获得靠谱豆</div>
        </div>
      </div>
      <div class="item" style="height: 150px;">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;margin-bottom: 10px;"><el-input placeholder="请输入奖励颗数..." v-model="dataForm.invite_member_reward_bean" clearable></el-input></div>
          <div style="width: 100%;margin-bottom: 10px;"><el-input placeholder="请输入每日限制次数..." v-model="dataForm.invite_member_count_per_day" clearable></el-input></div>
          <div style="width: 100%;"><el-input placeholder="请输入被邀请人浏览时间（分钟）..." v-model="dataForm.invite_member_app_browsing_time" clearable></el-input></div>
        </div>
        <!-- <el-input placeholder="请输入奖励颗数..." v-model="dataForm.invite_member_reward_bean" clearable></el-input>&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
        <el-input placeholder="请输入每日限制次数..." v-model="dataForm.invite_member_count_per_day" clearable></el-input>&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
        <el-input placeholder="请输入被邀请人浏览时间..." v-model="dataForm.invite_member_count_per_day" clearable></el-input> -->
      </div>
    </div>
   <!-- <div class="listItem">
      <div class="item">
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
          <div style="width: 100%;text-align: center;">邀请上限</div>
          <div class="tip">每天邀请好友个数上限</div>
        </div>
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_member_count_per_day"></el-input>
      </div>
    </div> -->
    <div class="listItem">
      <div class="item">
        签到-连续5天，第5天奖励
      </div>
      <div class="item">
        <el-input v-model="dataForm.continue_sign_in_five"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        签到-连续10天，第10天奖励
      </div>
      <div class="item">
        <el-input v-model="dataForm.continue_sign_in_ten"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        签到-连续15天，第15天奖励
      </div>
      <div class="item">
        <el-input v-model="dataForm.continue_sign_in_fifteen"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        签到-连续21天，第21天奖励
      </div>
      <div class="item">
        <el-input v-model="dataForm.continue_sign_in_twenty_one"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        签到-连续30天，第30天奖励
      </div>
      <div class="item">
        <el-input v-model="dataForm.continue_sign_in_thirty"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满300到500（含）
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_300_500"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满500到800（含）
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_500_800"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满800到1500（含）
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_800_1500"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满1500到2000（含）
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_1500_2000"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满2000到2500（含）
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_2000_2500"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div class="item">
        老带新-单件商品满2500以上
      </div>
      <div class="item">
        <el-input v-model="dataForm.invite_reward_bean_2500"></el-input>
      </div>
    </div>
    <div class="listItem">
      <div style="padding: 20px">
        <el-button type="primary" @click="submit()">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from "@/api/request";
  import {
    getMethod as getMethodNew,
    postMethod as postMethodNew,
  } from "@/api/request-new";
  import {
    isInteger
  } from "@/utils/validate"
  import qEditor from "@/components/RichText/quill-editor"

  export default {
    computed: {},
    components: {
      qEditor
    },
    mounted() {
      // this.changeType()
      this.loadData()
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
      relationList: [],
      dataForm:{
      browse_goods_fifty_seconds:'',
      continue_sign_in_five:'',
      continue_sign_in_ten:'',
      continue_sign_in_fifteen	:'',
      continue_sign_in_twenty_one:'',
      continue_sign_in_thirty:'',
      order_evaluation:'',
      favor_articles:'',
      invite_member_reward_bean:'',
      invite_member_count_per_day:'',
      grass_favor:'',
      share_articles:'',
      member_register:'',
      invite_reward_bean_300_500:'',
      invite_reward_bean_500_800:'',
      invite_reward_bean_800_1500:'',
      invite_reward_bean_1500_2000:'',
      invite_reward_bean_2000_2500:'',
      invite_reward_bean_2500:'',
      browse_goods_redirect_theme:'',
      invite_member_app_browsing_time:''
      }
      };
    },
    methods: {
      changeType() {
        getMethod("/operate/get-advert-redirect-value?type=3").then(res => {
          this.relationList = res.data
        });
      },
      loadData() {
        let scope = this
        getMethodNew("/operate/get-config-info").then(
          res => {
            scope.dataForm=res.data
          }
        );
      },
      submit(){
        postMethod("/operate/set-config",this.dataForm).then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .title {
    display: flex;
    border-top: 1px solid #dddddd;
    background-color: #dddddd;
    // border: 1px solid grey;
  }

  .listItem {
    display: flex;
    // border: 1px solid grey;
  }

  .item {
    width: 50%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
    padding: 0 10px;
    .tip{
      font-size: 14px;
      line-height: 20px!important;
      color: #909399;
      width: 100%;text-align: center;
    }
  }

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
