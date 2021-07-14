<template>
  <div style="padding: 30px">
    <div class="panel-group">
      <div class="card-panel-col">
        <router-link to="/bc-goods/reject">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">
                举报
              </div>
              <div class="card-text">
                当前未处理的举报
              </div>
            </div>
            <div class="card-right">
              <count-to :start-val="0" :end-val="indexData.tipOffNumber" :duration="2000" />
            </div>
          </div>
        </router-link>
      </div>
      <div class="card-panel-col">
        <router-link to="/bc-goods/saleList">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">
                笔记数
              </div>
              <div class="card-text">
                昨日发布笔记数
              </div>
            </div>
            <div class="card-right">
              <count-to :start-val="0" :end-val="indexData.noteNumber" :duration="2000" />
            </div>
          </div>
        </router-link>
      </div>
      <div class="card-panel-col">
        <router-link to="/bc-order/ready">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">
                退货/拒收
              </div>
              <div class="card-text">
                当前退货/拒收订单
              </div>
            </div>
            <div class="card-right">
              <count-to :start-val="0" :end-val="indexData.returnGoodsNumber" :duration="2000" />
            </div>
          </div>
        </router-link>
      </div>
      <div class="card-panel-col">
        <router-link to="bc-order/readyPay">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">
                商品订单
              </div>
              <div class="card-text">
                待发货商品订单
              </div>
            </div>
            <div class="card-right">
              <count-to :start-val="0" :end-val="indexData.waitSendGoodsOrder" :duration="2000" />
            </div>
          </div>
        </router-link>
      </div>
      <div class="card-panel-col">
        <router-link to="bc-order/readyPay">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">
                靠谱豆订单
              </div>
              <div class="card-text">
                待发货靠谱豆订单
              </div>
            </div>
            <div class="card-right">
              <count-to :start-val="0" :end-val="indexData.waitSendBeanOrder" :duration="2000" />
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div style="margin: 15px;display: flex;justify-content: space-between;align-items: center;">
      <div style="width: 300px;">统计时间：2021-10-01 ~ 2021-11-01</div>
      <div style="display: flex;align-items: center;">
        <div @click="changeDate(1)" class="blockT">
          <div> 7天 </div>
        </div>
        <div @click="changeDate(2)" class="blockT">
          <div> 30天 </div>
        </div>
        <div @click="changeDate(3)" class="blockT">
          <div> 日 </div>
        </div>
        <div class="blockT">
          <el-date-picker v-model="weekValue" @change="testDate2" :picker-options="weekOption" type="week"
            format="yyyy 第 WW 周" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="blockT">
          <el-date-picker v-model="monthValue" @change="testDate3" :picker-options="pickerOptions" type="month"
            format="yyyy-MM" value-format="yyyy-MM" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
    </div>

    <div class="panel-group" style="margin-left: 15px;">
      <div class="card-panel-col2">
        <div class="card-panel">
          <div class="card-left">
            <div class="card-title">
              订单金额
            </div>
            <div class="card-text">
              <count-to :start-val="0" :end-val="orderPayMoney" :duration="2000" />
            </div>
          </div>
          <el-radio class="card-right" @change="dataType" v-model="radio1" label="1">
            <div>
            </div>
          </el-radio>
        </div>
      </div>
      <div class="card-panel-col2">
        <div class="card-panel">
          <div class="card-left">
            <div class="card-title">
              订单数量
            </div>
            <div class="card-text">
              <count-to :start-val="0" :end-val="orderPayNum" :duration="2000" />
            </div>
          </div>
          <el-radio class="card-right" @change="dataType" v-model="radio1" label="2">
            <div>
            </div>
          </el-radio>
        </div>
      </div>
      <div class="card-panel-col2">
        <div class="card-panel">
          <div class="card-left">
            <div class="card-title">
              结算收入
            </div>
            <div class="card-text">
              <count-to :start-val="0" :end-val="settleMoney" :duration="2000" />
            </div>
          </div>
          <el-radio class="card-right" @change="dataType" v-model="radio1" label="3">
            <div>
            </div>
          </el-radio>
        </div>
      </div>
      <div class="card-panel-col2">
        <div class="card-panel">
          <div class="card-left">
            <div class="card-title">
              会员数量
            </div>
            <div class="card-text">
              <count-to :start-val="0" :end-val="registerMemberNum" :duration="2000" />
            </div>
          </div>
          <el-radio class="card-right" @change="dataType" v-model="radio1" label="4">
            <div>
            </div>
          </el-radio>
        </div>
      </div>
      <div class="card-panel-col2">
        <div class="card-panel">
          <div class="card-left">
            <div class="card-title">
              笔记数量
            </div>
            <div class="card-text">
              <count-to :start-val="0" :end-val="noteNum" :duration="2000" />
            </div>
          </div>
          <el-radio class="card-right" @change="dataType" v-model="radio1" label="5">
            <div>
            </div>
          </el-radio>
        </div>
      </div>
    </div>


    <div>
      <div id="main" style="width: 100%;height:600px;"></div>
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
  import variables from '@/styles/variables.scss'
  import CountTo from 'vue-count-to'
  import {getMon} from "@/utils/index"
  import * as echarts from 'echarts';

  export default {
    name: '',
    props: [''],
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            let t = new Date().getDate();
              return time.getTime() > Date.now() - 8.64e7 * t;
          }
        },
        weekOption:this.banWeek(),
        indexData: {
          noteNumber: 0,
          returnGoodsNumber: 0,
          tipOffNumber: 0,
          waitSendBeanOrder: 0,
          waitSendGoodsOrder: 0,
        },
        noteNum: 0,
        orderPayMoney: 0,
        orderPayNum: 0,
        settleMoney: 0,
        registerMemberNum: 0,
        showText: [],
        orderPayNumList: [],
        orderPayMoneyList: [],
        registerMemberNumList: [],
        settleMoneyList: [],
        noteNumList: [],
        dayValue: '',
        weekValue: '',
        monthValue: '',
        radio1: '1'
      }
    },
    components: {
      CountTo
    },
    computed: {},
    beforeMount() {},
    mounted() {
      // this.initData()
      this.indexLoad()
    },
    methods: {
      banWeek(){
            return{
            	//将自然周的起始日改为周一开始
              firstDayOfWeek: 1,
              //禁止选择当前周
              disabledDate(time) {
                let day = Date.now();
                let limit = getMon(day);
                let limitTime = new Date(limit);
                return time.getTime() > limitTime.getTime()-8.64e7;
              }
            }
          },
      testDate1(val) {
        console.log(val)
      },
      testDate2(val) {
        console.log(val)
        this.weekValue=val
        let tempDate = new Date(val) 
        let beforeDate = tempDate.setDate(tempDate.getDate() - 1)
        console.log(beforeDate,'beforeDate',formatDate(new Date(beforeDate), 'yyyy-MM-dd'))
      },
      testDate3(val) {
        console.log(val)
        this.monthValue=val
      },
      changeDate(val){
        console.log(val)
        let tempDate = new Date() // 获取今天的日期
        let beforeDate = tempDate.setDate(tempDate.getDate() - 1)
        console.log(beforeDate,'beforeDate',formatDate(new Date(beforeDate), 'yyyy-MM-dd'))
      },
      dataType(val) {
        console.log(val)
        this.radio1 = val
        if (val == '1') {
          let chartsData = {
            name: "订单金额",
            dataList: this.orderPayMoneyList
          }
          this.chartData(chartsData)
        }
        if (val == '2') {
          let chartsData = {
            name: "订单数量",
            dataList: this.orderPayNumList
          }
          this.chartData(chartsData)
        }
        if (val == '3') {
          let chartsData = {
            name: "结算收入",
            dataList: this.settleMoneyList
          }
          this.chartData(chartsData)
        }
        if (val == '4') {
          let chartsData = {
            name: "会员数量",
            dataList: this.registerMemberNumList
          }
          this.chartData(chartsData)
        }
        if (val == '5') {
          let chartsData = {
            name: "笔记数量",
            dataList: this.noteNumList
          }
          this.chartData(chartsData)
        }
      },
      indexLoad() {
        getMethod('/home/home-count-data', {}).then(res => {
          this.indexData = res.data
        })
        let param = {
          endTime: "2021-10-1",
          startTime: "2021-6-1",
          showType: 1
        }
        getMethod('/home/home-count-chart', param).then(res => {
          console.log(res)
          this.noteNum = res.data.noteNum
          this.orderPayMoney = res.data.orderPayMoney
          this.orderPayNum = res.data.orderPayNum
          this.registerMemberNum = res.data.registerMemberNum
          this.settleMoney = res.data.settleMoney
          res.data.staticDataList.forEach(item => {
            this.showText.push(item.showText)
            this.orderPayNumList.push(item.orderPayNum)
            this.orderPayMoneyList.push(item.orderPayMoney)
            this.registerMemberNumList.push(item.registerMemberNum)
            this.settleMoneyList.push(item.settleMoney)
            this.noteNumList.push(item.noteNum)
          })
          this.dataType(this.radio1)
          console.log(this.showText, this.orderPayNumList, this.orderPayMoneyList, this.registerMemberNumList, this
            .settleMoneyList, this.noteNumList)
        })
      },
      chartData(data) {
        console.log(data, 'data')
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        // 绘制图表
        myChart.setOption({
          title: {
            text: data.name
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [data.name]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.showText
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: data.name,
            type: 'line',
            data: data.dataList
          }]
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .analysis-title {
    font-family: 'Arial Negreta', 'Arial';
    font-size: 16px;
    color: #333333;
    text-align: center;
    line-height: 45px;
    font-weight: 700;
    background: #F0F0F0;
  }

  .blockT {
    margin: 5px;
    border: 1px solid #b5b5b5;
    display: block;
    line-height: 40px;
    padding: 0 10px;
  }

  .panel-group {
    //margin-top: 18px;
    margin-bottom: 50px;
    display: flex;
    flex-wrap: wrap;

    .card-panel-col {
      margin: 15px;
      width: 250px;

      .card-right {
        width: 30%;
        font-size: 40px;
        font-weight: 600;
      }

      .card-text {
        font-size: 15px;
      }
    }

    .card-panel-col2 {
      width: 200px;

      .card-right {
        height: 100%;
        width: 30%;
        padding: 25px;
        font-weight: 600;
      }

      .card-text {
        font-size: 20px;
      }
    }

    .card-left {
      width: 70%;
      padding-left: 25px;
      line-height: 35px;
    }



    .card-title {
      font-size: 18px;
      font-weight: bold;
    }



    .card-panel {
      display: flex;
      width: 100%;
      align-items: center;
      //height: 108px;
      height: 150px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      border-color: rgba(0, 0, 0, .05);
      transition: .2s;
      border-radius: 10px;
      box-shadow: 0px 2px 3px #ccc;

      &:hover {
        box-shadow: 0px 4px 15px #ccc;
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: right;
        //margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: right;
        font-size: 48px;
      }

      .card-panel-description {
        font-weight: bold;
        margin-top: 16px;
        padding-left: 20px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 15px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 30px;
        }
      }

      .card-panel-footer-text {
        color: rgba(0, 0, 0, 0.45);
        text-align: center;
        font-weight: bold;
        font-size: 16px;
      }
    }

  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }

  .counter-area {
    // background: $heavyBGColor;
    width: 100%;
    min-height: 50vh;
    margin-top: 4vh;
    padding: 5vh 2vw 5vh 2vw;
    transition: .2s;


    &:hover {
      box-shadow: 0px 4px 10px #ccc;
    }

  }

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 30px 0px 10px 0px;
  }

  .el-table>>>th.is-leaf,
  .el-table>>>td {
    border: none;
  }

  .el-table::before {
    height: 0px;
  }

  .dashbord-tab-list>>>.el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
    z-index: 1;
  }

  .dashbord-tab-list {}

  .dashbord-tab-list>>>.el-tabs__item {
    padding: 0 20px;
    height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 30px;
    display: inline-block;
    list-style: none;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    color: #939393;
    position: relative;
  }
</style>
