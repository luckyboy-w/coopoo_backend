<template>
  <div>
    <div v-loading="loading" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>模块：</td>
            <td>
              <el-select v-model="searchParam.operationType" filterable placeholder="请选择">
                <el-option value="" label="全部模块" />
                <el-option value="order_goods" label="商品订单" />
                <el-option value="order_bean" label="靠谱豆订单" />
                <el-option value="goods" label="普通商品" />
                <el-option value="exclusive_goods" label="专属商品" />
                <el-option value="goods_theme" label="主题" />
                <el-option value="activity" label="限时抢购" />
                <el-option value="new_user_activity" label="新人礼" />
                <el-option value="register_give_coupon_activity" label="注册送优惠券" />
                <el-option value="buy_vip_give_coupon_activity" label="买VIP送优惠券" />
                <el-option value="cut_price_activity" label="砍价" />
                <el-option value="collage_part_activity" label="拼团" />
                <el-option value="activity_message" label="消息" />
                <el-option value="town_talk" label="话题" />
                <el-option value="bean_config" label="靠谱豆配置" />
                <el-option value="coupon" label="优惠券" />
                <el-option value="store" label="门店" />
                <el-option value="supplier" label="供应商" />
                <el-option value="exclusive_mall_category" label="专属商城类目" />
                <el-option value="goods_fake_sale_volume" label="普通商品假销量" />
                <el-option value="exclusive_goods_fake_sale_volume" label="专属商品假销量" />
                <el-option value="collage_fake_data" label="拼团假数据" />
                <el-option value="cut_price_fake_data" label="砍价假数据" />
              </el-select>
            </td>
            <td colspan="2">
              <el-button icon="el-icon-search" @click="search()">
                搜索
              </el-button>
              <!-- <el-button
                icon="el-icon-download"
                @click="exportData()"
              >
                导出
              </el-button> -->
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="orderId"
            border>
            <el-table-column prop="userName" label="姓名" width="220px" />
            <el-table-column prop="loginName" label="账号" width="150px" />
            <el-table-column prop="operationModuleName" label="模块" width="200px" />
            <el-table-column prop="operationObject" label="对象" width="250px" />
            <el-table-column prop="operationContent" label="操作内容" width="150px" />
            <el-table-column prop="createTime" label="修改时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :current-page="searchParam.pageNum"  :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'

  import {
    formatDate
  } from '@/api/tools.js'
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {},
    filters: {
      _formatDate(time) {
        const date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
     },
    data() {
      return {
        showPagination: false,
        loading: true,
        searchParam: {
          operationType:'',
          pageSize: 10,
          pageNum: 1
        },
        menuList:[],
        tableData: {
          list: []
        },
      }
    },
    computed: {},
    mounted() {
      this.getRoute()
      this.initLoad()
    },
    created() {

    },
    methods: {
      getRoute(){
        let menuList = this.$store.getters.permission_routes
        for (let j = 0; j < menuList.length; j++) {
          if(menuList[j].name=="订单管理"){
            for (let i = 0; i < menuList[j].children.length; i++) {
              let menuObj = {
                menuId:menuList[j].children[i].id,
                operationModuleName:menuList[j].children[i].name
              }
              this.menuList.push(menuObj)
            }
          }
        }
      },
      search() {
        this.searchParam.pageSize = 10
        this.searchParam.pageNum = 1
        this.loadList()
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum
        this.loadList()
      },
      initLoad() {
        this.loadList()
      },
      loadList() {
        const scope = this
          getMethod('/permission/search-operation-list', this.searchParam).then(res => {
            scope.tableData.list = res.data.records
            scope.tableData.total = res.data.total
            scope.sendOrder = false
            scope.showPagination =  res.data.total == 0
            this.loading = false
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
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
<style lang="scss">
  .el-step__title {
    font-size: 12px;
  }

  .main-title {
    font-size: 14px;
  }

  .sub-title {
    font-size: 12px;
  }

  .steps-view {
    padding: 0 20px;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }

  .steps-view::before {
    content: "";
    position: absolute;
    width: 2px;
    background-color: #d8d8d8;
    height: calc(100% - 0px);
    left: 138px;
    z-index: 2;
  }

  .dataTitle {
    padding: 0 20px;
    line-height: 50px;
    height: 50px;
    width: 100%;
    border: 1px solid #e6e6e6;
    display: flex;

    .item {
      padding-right: 80px;
      font-size: 15px;
    }
  }
</style>
