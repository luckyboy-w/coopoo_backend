<template>
  <div class="ly-container">
    <el-form class="update-form-panel" ref="activityGoodForm" :rules="activityFormRules" :model="activityGoodForm"
             label-width="120px" style="width:80%">
      <span>活动商品信息</span>
      <el-divider content-position="left"/>
      <el-form-item label="活动名称:">
        {{ activityName }}
      </el-form-item>
      <el-divider content-position="left"/>
      <el-form-item label="供应商名名称:" prop="supplierId">
        <el-select v-model="activityGoodForm.supplierId" @change="changeSupplierEvent" placeholder="请选择">
          <el-option value="" label="全部"/>
          <el-option
            v-for="item in supplyList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-divider content-position="left"/>
      <el-form-item label="商品名称:" prop="supplierId" width="180px">
        <el-input @input="goodInputEvent" style="width: 180px" v-model="goodName"/>
      </el-form-item>
      <el-scrollbar>
        <div style="height: 100px;width: 100%">
          <el-checkbox-group v-model="checkedGood" @change="handleCheckedGoodChange">
            <el-checkbox :class="{ 'active': good.selected != undefined }" v-for="good in goodList" :label="good.id"
                         :key="good.id">
              <span @click.prevent="showGoodDetail(good.id)">{{good.goodName}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <el-divider content-position="left"/>
    </el-form>

    <el-dialog :visible.sync="isShowGoodDetail" width="80%" append-to-body>
      <showGoodDetail :is-gift="isGift" :edit-data="goodInfo" :is-edit-good="isEditGood"/>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod } from '@/api/request'
import showGoodDetail from "./goodDetial.vue";

export default {
  name:'',
  props: {
    activityGoodData: {
      type: Object,
      required: false
    },
    activityName: {
      type: String,
      required: false
    }
  },
  components: { showGoodDetail },
  data () {
    return {
      isShowGoodDetail: false,
      isEditGood: false,
      goodInfo: null,
      isGift: '1',
      checkedGood: [],
      goodName: null,
      supplyList: [],
      goodList: [],
      activityGoodForm: {
        supplierId: ''
      },
      activityFormRules: {

      }
    };
  },
  computed: {},
  beforeMount() {},

  mounted() {
    this.initSupplyList()
  },

  methods: {
    initSupplyList() {
      getMethod('/backend/supplier/findList', {}).then(res => {
        this.supplyList = res.data
      })
    },

    changeSupplierEvent(supplierId) {
      getMethod('/backend/goodActivity/findAllGoodBySupplierId', {supplierId}).then(res => {
        this.goodList = res.data
      })
    },

    handleCheckedGoodChange(goodId) {
      console.info("handleCheckedGoodChange")

    },

    goodInputEvent(inputValue) {
      if (this.goodList.length > 0) {
        this.goodList.forEach(item => {
          if (inputValue != '' && item.goodName.includes(inputValue)) {
            item.selected = 'matched';
          } else {
            item.selected = undefined;
          }
        })
      }
    },

    showGoodDetail(goodId) {
      let scope = this

      let param = {
        goodId: goodId
      }
      getMethod("/backend/good/findById", param).then(res => {
        scope.isEditGood = true
        scope.goodInfo = res.data
        this.isShowGoodDetail = true
      });
    }

  },

  watch: {}

}

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

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    height: 480px;
    width: 480px;
  }

  .active {
    color: red;
  }
</style>
