<template>
  <div>
    <div class="update-form-panel" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="type" label="主题类型">
          <el-select v-model="form.type" @change="changeImg" :disabled="disabled" placeholder="请选择主题类型">
            <el-option v-for="item in themeData" :key="item.value" :label="item.name" :value-key="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="themeName" label="主题名称">
          <el-input v-model="form.themeName" placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item prop="subtitle" label="副标题名称" v-if="showSubtitle">
          <el-input v-model="form.subtitle " placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item prop="description" label="主题描述" v-if="showDescribe">
          <el-input v-model="form.description" type="textarea" rows placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item prop="backgroundColor" label="背景色值" v-if="showColor">
          <el-input v-model="form.backgroundColor" type="color" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="图片/视频">
          <el-select v-model="form.fileType" :disabled="showVideo||disabled" @change="changeFileType"
            placeholder="请选择主图类型">
            <el-option label="图片" :value="1" />
            <el-option label="视频" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;flex-wrap: wrap;">
            <div class="upLoadContainer" @click="buildImgGroupId()" v-show="form.fileType==2">
              <el-upload :disabled="disabled" :class="{hide:hideGoodVideoUpload}" :action="uploadImageUrl"
                list-type="picture-card" v-bind:on-progress="uploadVideoProcess" v-bind:on-success="handleVideoSuccess"
                v-bind:before-upload="beforeUploadVideo" v-bind:show-file-list="false">
                <video v-if="modularVideo !='' && !videoFlag" v-bind:src="modularVideo" class="video-avatar"
                  style="height: inherit;width: inherit;" controls="controls">
                  您的浏览器不支持视频播放
                </video>
                <i v-else-if="modularVideo =='' && !videoFlag" class="el-icon-plus"></i>
                <i v-if="modularVideo !='' && !videoFlag" @click="handleGoodVideoRemove" :disabled="disabled"
                  class="el-icon-error" style="position: absolute;top: 0;display: flex;"></i>
                <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent"
                  style="margin-top:7px;"></el-progress>
              </el-upload>
              <div slot="tip" class="el-upload__tip">
                推荐视频尺寸:{{firstFileSize}}
              </div>
              <div slot="tip" v-if="modularVideo ==''" class="tag">主图（视频）</div>
              <el-dialog>
                <img width="100%" :src="imageUrl" alt>
              </el-dialog>
            </div>
            <div class="upLoadContainer" v-show="form.fileType==2">
              <div id="videoCover" @click="buildImgGroupId">
                <el-upload :disabled="disabled" :action="uploadImageUrl" list-type="picture-card"
                  :on-preview="handleGoodImagePreview" :before-upload="beforeImageUpload"
                  :on-success="(response, file, fileList)=>handleImageSuccess(response, file, fileList,'videoCover')"
                  :file-list="uploadVideoCoverList" :on-remove="handleVideoCoverRemove">
                  <i class="el-icon-plus" />
                  <div slot="tip" class="el-upload__tip">
                    推荐封面尺寸:{{firstFileSize}}
                  </div>
                  <div slot="tip" class="tag">视频封面</div>
                </el-upload>
                <el-dialog>
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </div>
            </div>
            <div class="upLoadContainer" v-show="form.fileType==1">
              <div id="mainImage" @click="buildImgGroupId">
                <el-upload :disabled="disabled" :action="uploadImageUrl" list-type="picture-card"
                  :on-preview="handleGoodImagePreview" :before-upload="beforeImageUpload"
                  :on-success="(response, file, fileList)=>handleImageSuccess(response, file, fileList,'mainImage')"
                  :file-list="uploadMainImageList" :on-remove="handleMainImageRemove">
                  <i class="el-icon-plus" />
                  <div slot="tip" class="el-upload__tip">
                    推荐图片尺寸:{{firstFileSize}}
                  </div>
                  <div slot="tip" class="tag">主图</div>
                </el-upload>
                <el-dialog>
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </div>
            </div>
            <div class="upLoadContainer" v-show="showNum==1||showNum==2||showNum==3">
              <div id="firstImage" @click="buildImgGroupId">
                <el-upload :disabled="disabled" :action="uploadImageUrl" list-type="picture-card"
                  :on-preview="handleGoodImagePreview" :before-upload="beforeImageUpload"
                  :on-success="(response, file, fileList)=>handleImageSuccess(response, file, fileList,1)"
                  :file-list="uploadFirstImageList" :on-remove="handleFirstImageRemove">
                  <i class="el-icon-plus" />
                  <div slot="tip" class="el-upload__tip">
                    推荐图片尺寸:{{secondFileSize}}
                  </div>
                  <div slot="tip" class="tag">副图</div>
                </el-upload>
                <el-dialog>
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </div>
            </div>
            <div class="upLoadContainer" v-show="showNum==2||showNum==3">
              <div id="secondImage" @click="buildImgGroupId">
                <el-upload :disabled="disabled" :action="uploadImageUrl" list-type="picture-card"
                  :on-preview="handleGoodImagePreview" :before-upload="beforeImageUpload"
                  :on-success="(response, file, fileList)=>handleImageSuccess(response, file, fileList,2)"
                  :file-list="uploadSecondImageList" :on-remove="handleSecondImageRemove">
                  <i class="el-icon-plus" />
                  <div slot="tip" class="el-upload__tip">
                    推荐图片尺寸:{{thirdFileSize}}
                  </div>
                  <div slot="tip" class="tag">副图</div>
                </el-upload>
                <el-dialog>
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </div>
            </div>
            <div class="upLoadContainer" v-show="showNum==3">
              <div id="thirdImage" @click="buildImgGroupId">
                <el-upload :disabled="disabled" :action="uploadImageUrl" list-type="picture-card"
                  :on-preview="handleGoodImagePreview" :before-upload="beforeImageUpload"
                  :on-success="(response, file, fileList)=>handleImageSuccess(response, file, fileList,3)"
                  :file-list="uploadThirdImageList" :on-remove="handleThirdImageRemove">
                  <i class="el-icon-plus" />
                  <div slot="tip" class="el-upload__tip">
                    推荐图片尺寸:{{fourthFileSize}}
                  </div>
                  <div slot="tip" class="tag">副图</div>
                </el-upload>
                <el-dialog>
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input v-model="form.sort" placeholder="请输入" clearable :disabled="disabled" />
        </el-form-item>
        <el-form-item label="关联类型">
          <el-select v-model="form.goodsType" :disabled="disabled">
            <el-option label="商品" :value="1" />
            <el-option label="优惠券" :value="2" />
            <el-option label="门店列表" :value="3" />

          </el-select>
        </el-form-item>
        <el-form-item v-if="form.goodsType==1" label="关联商品">
          <el-button type="success" @click="relatedGoods" :disabled="disabled">关联商品</el-button>
        </el-form-item>
        <el-form-item v-if="form.goodsType==2" label="关联优惠券">
          <el-button type="success" @click="relatedGoods" :disabled="disabled">关联优惠券</el-button>
        </el-form-item>
        <el-form-item v-if="form.goodsType==1" label="已关联商品">
          <div class="ly-table-panel" style="min-width:1000px!important;">
            <div class="ly-data-list">
              <el-table ref="mainTable" :data="bindingList" style="width: 100%!important; margin-bottom: 20px;"
                row-key="id" border>
                <el-table-column prop="goodsName" label="商品名称" />
                <el-table-column label="商品价格">
                  <template slot-scope="scope">
                    <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="saleVolume" label="销量" width="80">
                  <template slot-scope="scope">
                    {{ scope.row.saleVolume}}
                  </template>
                </el-table-column>
                <el-table-column v-if="settleMethod==1" prop="supplierSettleRatio" label="供应商结算比例" width="160">
                  <template slot-scope="scope">
                    <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" :disabled="disabled"
                      v-model="scope.row.supplierSettleRatio" />
                  </template>
                </el-table-column>
                <el-table-column v-if="settleMethod==1" prop="storeSettleRatio" label="门店结算比例" width="160">
                  <template slot-scope="scope">
                    <el-input-number :max="100" :min="0" size="mini" placeholder="请输入" :disabled="disabled"
                      v-model="scope.row.storeSettleRatio" />
                  </template>
                </el-table-column>

               <!-- <el-table-column v-if="settleMethod==1" prop="storeProfitRatio" label="门店利润比例" width="160">
                  <template slot-scope="scope">
                  <el-input-number :max="100" :min="100" size="mini" placeholder="100" :disabled="true"
                    v-model="scope.row.storeProfitRatio" />
                  </template>
                </el-table-column> -->

                <el-table-column prop="createTime" label="创建时间" width="170">
                  <template slot-scope="scope">
                    {{ scope.row.createTime}}
                  </template>
                </el-table-column>
                <el-table-column prop="id" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" :disabled="disabled" size="small"
                      @click="deleteGoods(scope.row,scope.$index)">
                      删除
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="form.goodsType==2" label="已关联优惠券">
          <div class="ly-table-panel" style="min-width:1000px!important;">
            <div class="ly-data-list">
              <el-table ref="mainTable" :data="bindingList_" style="width: 100%!important; margin-bottom: 20px;"
                row-key="id" border>
                <el-table-column prop="couponName" label="优惠券名称" />
                <el-table-column label="价格">
                  <template slot-scope="scope">
                    <span>{{scope.row.buyPrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170">
                  <template slot-scope="scope">
                    {{ scope.row.createTime}}
                  </template>
                </el-table-column>
                <el-table-column prop="id" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" :disabled="disabled" size="small"
                      @click="deleteGoods(scope.row,scope.$index)">
                      删除
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==1" @click="submitUpdate(1)">提交</el-button>
          <el-button type="primary" :disabled="disabled" v-if="submitStatus==2" @click="submitUpdate(2)">保存编辑
          </el-button>
          <el-button @click="cancelUpdate">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="position: absolute;top: 0;right: 0;width: 300px;height: 300px;">
      <el-image style="width: 300px;height: 300px;" fit="contain" :src="templateImg"></el-image>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible="showGoodsList" :before-close="showGoodsListClose" title="关联商品" width="90%">
      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>商品名称：</div>
            <div>
              <el-input v-model="searchParam.goodsName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
                <el-table ref="multipleTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
                  border  @select="selectThis" @selection-change="selectioncChange" >
                  <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" />
              <el-table-column label="商品价格">
                <template slot-scope="scope">
                  <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="saleVolume" label="销量" />
              <el-table-column prop="isSale" label="商品状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSale==1">已上架</span>
                  <span v-if="scope.row.isSale===0">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData.total" background layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" :current-page="searchParam.pageNum" @next-click="currentPage" />
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible="showGoodsList_" :before-close="showGoodsListClose" title="关联商品" width="90%">
      <div class="ly-container">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>优惠券名称：</div>
            <div>
              <el-input v-model="searchParam.couponName" width="180px" clearable />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">
              搜索
            </el-button>
            <el-button type="success" @click="showGoodsListClose()">
              完成
            </el-button>
          </div>
        </div>
        <div class="ly-table-panel">
          <div class="ly-data-list">
            <el-table ref="multipleTable_" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
              border @selection-change="selectioncChange" @select="selectThis">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="couponName" label="优惠券名称" />
              <el-table-column label="价格">
                <template slot-scope="scope">
                  <span>{{scope.row.faceValue}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalSales" label="销量" />
              <el-table-column prop="isSale" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSale==1">已上架</span>
                  <span v-if="scope.row.isSale===0">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="getGoodsDtl(scope.row)">
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ly-data-pagination">
            <el-pagination :total="tableData.total" background layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" :current-page="searchParam.pageNum" @next-click="currentPage" />
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from '@/api/request'
  export default {
    data() {
      return {
        loading: false,
        disabled: false,
        submitStatus: 1,
        settleMethod:'2',
        themeData: [{
            name: '单图半屏展示',
            value: '0',
            url: 'http://bucket.coopoo.com/coopoo-images/img0.png',
            showNum: '',
            firstFileSize: '1000*820',
            showDescribe: true
          },
          {
            name: '三图展示',
            value: '1',
            url: 'http://bucket.coopoo.com/coopoo-images/img1.png',
            showNum: '2',
            firstFileSize: '500*500',
            secondFileSize: '500*500',
            thirdFileSize: '500*500',
            showDescribe: true
          },
          {
            name: '特别推送',
            value: '2',
            url: 'http://bucket.coopoo.com/coopoo-images/img2.png',
            showNum: '1',
            firstFileSize: '1000*1449',
            secondFileSize: '500*500',
            showVideo: true,
            showSubtitle: true,
            showDescribe: true
          },
          {
            name: '双图展示',
            value: '3',
            url: 'http://bucket.coopoo.com/coopoo-images/img3.png',
            showNum: '1',
            firstFileSize: '1000*699',
            secondFileSize: '600*600',
            showSubtitle: true,
            showDescribe: true
          },
          {
            name: '高斯模糊',
            value: '4',
            url: 'http://bucket.coopoo.com/coopoo-images/img4.png',
            showNum: '',
            firstFileSize: '1000*1451',
          },
          {
            name: '左右构图',
            value: '5',
            url: 'http://bucket.coopoo.com/coopoo-images/img5.png',
            showNum: '1',
            firstFileSize: '600*867',
            secondFileSize: '500*607',
            showColor: true,
            showDescribe: true
          },
          {
            name: '大图展示',
            value: '6',
            url: 'http://bucket.coopoo.com/coopoo-images/img6.png',
            showNum: '',
            firstFileSize: '1000*1451',
            showDescribe: true
          },
          {
            name: '对角构图',
            value: '7',
            url: 'http://bucket.coopoo.com/coopoo-images/img7.png',
            showNum: '1',
            firstFileSize: '1000*1381',
            secondFileSize: '500*800',
            showSubtitle: true,
            showDescribe: true
          },
          {
            name: '四图展示',
            value: '8',
            url: 'http://bucket.coopoo.com/coopoo-images/img8.png',
            showNum: '3',
            firstFileSize: '1000*1451',
            secondFileSize: '500*500',
            thirdFileSize: '500*500',
            fourthFileSize: '500*500',
            showVideo: true,
            showSubtitle: true,
            showDescribe: true
          },
          {
            name: '单图展示',
            value: '9',
            url: 'http://bucket.coopoo.com/coopoo-images/img9.png',
            showNum: '',
            firstFileSize: '600*883',
            showSubtitle: true,
            showDescribe: true
          },
          {
            name: '不规则展示',
            value: '10',
            url: 'http://bucket.coopoo.com/coopoo-images/img10.png',
            showNum: '1',
            firstFileSize: '1000*812',
            secondFileSize: '600*868',
            showColor: true,
            showDescribe: true
          },
          {
            name: '全屏大图',
            value: '11',
            url: 'http://bucket.coopoo.com/coopoo-images/img11.png',
            showNum: '',
            firstFileSize: '1000*1707',
            showVideo: true
          }
        ],
        templateImg: 'http://bucket.coopoo.com/coopoo-images/img0.png',
        showPwd: true,
        showNum: '',
        showVideo: false,
        showColor: false,
        showSubtitle: false,
        showDescribe: true,
        firstFileSize: '1000*820',
        secondFileSize: '',
        thirdFileSize: '',
        fourthFileSize: '',
        // 视频
        hideGoodVideoUpload: false,
        uploadVideoUrl: "",
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: '',
        //进度条的进度，
        isShowUploadVideo: false,
        imageUrl: '',
        // 封面图
        uploadImageUrl: '',
        hideGoodFrontImageUpload: false,
        uploadGoodFrontImageList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        showGoodsList: false,
        showGoodsList_: false,
        modularVideo: '',
        uploadModularVideoList: [],
        uploadVideoCoverList: [],
        uploadMainImageList: [],
        uploadFirstImageList: [],
        uploadSecondImageList: [],
        uploadThirdImageList: [],
        goodsThemeItemList: [],
        // 表单数据
        form: {
          goodsType: 1,
          themeName: '',
          subtitle: '',
          description: '',
          backgroundColor: '',
          sort: '',
          type: '0',
          fileType: 1,
          goodsThemeItemList: [],
          goodsList: [],
          fileList: []
        },
        // 商品列表
        tableData: {
          list: []
        },
        multipleSelection: [],
        bindingList: [],
        bindingList_:[],
        searchParam: {
          pageSize: 10,
          pageNum: 1,
          status: '0'
        },
        rules: {
          type: [{
            required: true,
            message: '请选择主题类型',
            trigger: 'blur'
          }],
          themeName: [{
            required: true,
            message: '请输入主题名称',
            trigger: 'blur'
          }],
          subtitle: [{
            required: true,
            message: '请输入副标题',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }],
          backgroundColor: [{
            required: true,
            message: '请选择背景色值',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入主题描述',
            trigger: 'blur'
          }]
        }
      }
    },
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    computed: {},
    mounted() {
      this.initSettlementMethod()
      if (this.editData.operation == "add") {
        this.submitStatus = 1
      } else if (this.editData.operation == "edit") {
        this.submitStatus = 2
      } else if (this.editData.operation == "detail") {
        this.disabled = true
      }
      if (this.editData.goodsThemeId) {
        this.dataEcho()
        this.changeImg()
      }
    },
    created() {},
    methods: {
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      initSettlementMethod() {
        getMethod("settlement/current-settle-method").then(
          res => {
            this.settleMethod = res.data.currentSettleMethod
          }
        );
      },
      // 根据主题切换模板
      changeImg() {
        this.themeData.map(i => {
          if (this.form.type == i.value) {
            this.templateImg = i.url
            this.showNum = i.showNum
            this.showVideo = i.showVideo ? i.showVideo : false
            this.form.fileType = i.showVideo ? 1 : this.form.fileType
            this.showColor = i.showColor ? i.showColor : false
            this.showSubtitle = i.showSubtitle ? i.showSubtitle : false
            this.showDescribe = i.showDescribe ? i.showDescribe : false
            this.firstFileSize = i.firstFileSize
            this.secondFileSize = i.secondFileSize ? i.secondFileSize : ''
            this.thirdFileSize = i.thirdFileSize ? i.thirdFileSize : ''
            this.fourthFileSize = i.fourthFileSize ? i.fourthFileSize : ''
          }
        })
      },
      changeFileType(val) {
        let scope = this
        if (this.form.fileType == 1) {
          scope.modularVideo=''
          scope.uploadModularVideoList = []
          scope.uploadVideoCoverList = []
          scope.uploadFirstImageList = []
          scope.uploadSecondImageList = []
          scope.uploadThirdImageList = []
        } else if (this.form.fileType == 2) {
          scope.uploadMainImageList = []
          scope.uploadFirstImageList = []
          scope.uploadSecondImageList = []
          scope.uploadThirdImageList = []
        }
        scope.block()
      },
      buildImgGroupId(event) {
        getMethod('/oss/get-group-id').then(res => {
          this.uploadImageUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      dataEcho() {
        let that = this
        that.form = that.editData
        that.form.type = String(that.editData.type)
        that.form.goodsType = that.editData.goodsType
          that.bindingList = that.editData.goodsList
          that.bindingList_ = that.editData.couponList
        that.editData.goodsThemeItemVOList.forEach(i => {
          if (i.sort == 0 && that.editData.fileType == 1) {
            that.uploadMainImageList = i.imageUrlFileList
          }
          if (i.sort == 0 && that.editData.fileType == 2) {
            that.modularVideo = i.videoUrlFileList[0].url
            that.uploadModularVideoList = i.videoUrlFileList
            that.uploadVideoCoverList = i.videoCoverImgUrlFileList
          }
          if (i.sort == 1) {
            that.uploadFirstImageList = i.imageUrlFileList
          }
          if (i.sort == 2) {
            that.uploadSecondImageList = i.imageUrlFileList
          }
          if (i.sort == 3) {
            that.uploadThirdImageList = i.imageUrlFileList
          }
        })
        this.none()
      },
      // 关联商品
      relatedGoods() {
        this.loadGoodsList()
        if (this.form.goodsType == 1) {
          this.showGoodsList = true
        } else if (this.form.goodsType == 2) {
          this.showGoodsList_ = true
        }
      },
      showGoodsListClose() {
        this.searchParam={
          pageSize: 10,
          pageNum: 1,
          status: '0'
        }
        if (this.form.goodsType == 1) {
          if (this.multipleSelection.length > 0) {
           this.bindingList.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.goodsId==item.goodsId) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList = this.bindingList.concat(this.multipleSelection)
          }
          this.showGoodsList = false
        } else if (this.form.goodsType == 2) {
          if (this.multipleSelection.length > 0) {
           this.bindingList_.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.id==item.id) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection)
          }
          this.showGoodsList_ = false
        }
      },
      deleteGoods(row, val) {
        let that = this

        if (this.form.goodsType == 1) {
          that.bindingList.map((item, index) => {
            if (val == index) {
              that.bindingList.splice(index, 1)
            }
          })
        } else if (this.form.goodsType == 2) {
          that.bindingList_.map((item, index) => {
            if (val == index) {
              that.bindingList_.splice(index, 1)
            }
          })
        }


      },
      // 新建标签跳详情
      getGoodsDtl(row) {
        if (this.form.goodsType == 1) {
          let newpage = this.$router.resolve({
            path: "/goods/list", //路径
            query: {
              goodsId: row.goodsId, //商品id
            }
          })
          window.open(newpage.href, '_blank');
        } else if (this.form.goodsType == 2) {
          let newpage = this.$router.resolve({
            path: "/bussinesManager/coupon/coupon", //路径
            query: {
              id: row.id, //商品id
            }
          })
          window.open(newpage.href, '_blank');
        }
      },
      submitUpdate(val) {
        // return false
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let scope = this
            let fileList = []
            let videoFileImg = []
            let themeItemList = []
            let goodsData = []
            // this.$refs["form"].validate((valid) => {


            fileList = fileList.concat(scope.uploadModularVideoList)
            fileList = fileList.concat(scope.uploadVideoCoverList)
            fileList = fileList.concat(scope.uploadMainImageList)
            fileList = fileList.concat(scope.uploadFirstImageList)
            fileList = fileList.concat(scope.uploadSecondImageList)
            fileList = fileList.concat(scope.uploadThirdImageList)
            videoFileImg = videoFileImg.concat(scope.uploadFirstImageList)
            videoFileImg = videoFileImg.concat(scope.uploadSecondImageList)
            videoFileImg = videoFileImg.concat(scope.uploadThirdImageList)

            if (this.form.fileType == 1) {
              fileList.forEach(i => {
                let obj = {
                  sort: i.sort,
                  img: i.groupId ? i.groupId : '',
                  type: 1,
                }
                themeItemList = themeItemList.concat(obj)
              })
            } else if (this.form.fileType == 2) {
              let obj = {
                sort: 0,
                type: 2,
                video: scope.uploadModularVideoList.length >= 1 ? scope.uploadModularVideoList[0].groupId : '',
                videoCoverImg: scope.uploadVideoCoverList.length >= 1 ? scope.uploadVideoCoverList[0].groupId : ''
              }
              themeItemList = themeItemList.concat(obj)
              videoFileImg.forEach(i => {
                let obj_ = {
                  sort: i.sort,
                  img: i.groupId ? i.groupId : '',
                  type: 1,
                }
                themeItemList = themeItemList.concat(obj_)
              })
            }

            if (this.form.goodsType == 1) {
              this.bindingList.forEach(item => {
                if (this.settleMethod==1) {
                  let obj = {
                    goodsId: item.goodsId,
                    storeSettleRatio: item.storeSettleRatio ? item.storeSettleRatio : "0",
                    supplierSettleRatio: item.supplierSettleRatio ? item.supplierSettleRatio : "0",
                  }
                  goodsData.push(obj)
                } else if (this.settleMethod==2){
                  let obj = {
                    goodsId: item.goodsId,
                    storeProfitRatio:"100"
                  }
                  goodsData.push(obj)
                }
              })
              this.form.goodsList = goodsData
              this.form.couponList = []
            } else if (this.form.goodsType == 2) {
              this.bindingList_.forEach(item => {
                let obj = {
                  id: item.id,
                }
                goodsData.push(obj)
              })
              this.form.couponList = goodsData
              this.form.goodsList = []
            }
            this.form.goodsType=this.form.goodsType
            this.form.fileList = fileList
            this.form.goodsThemeItemList = themeItemList

            let goodsIdData = this.form.goodsList.map(value => value.goodsId);
            const goodsIdDataSet = new Set(goodsIdData);
            if (goodsIdDataSet.size != goodsIdData.length) {
              this.$message({
                message: '绑定的商品有重复',
                type: 'warning'
              });
              return false;
            }
            if (this.form.fileList.length <= 0) {
              this.$message({
                message: "请上传主题相关视频/图片",
                type: "warning"
              });
              return false
            }
            // if (this.form.goodsType == 1&&this.form.goodsList.length <= 0) {
            //   this.$message({
            //     message: "请选择主题需要关联的商品",
            //     type: "warning"
            //   });
            //   return false
            // }
            // if (this.form.goodsType == 2&&this.form.couponList.length <= 0) {
            //   this.$message({
            //     message: "请选择主题需要关联的优惠券",
            //     type: "warning"
            //   });
            //   return false
            // }
            this.loading = true
            if (val == 1) {
              postMethod('/goods/theme/publish', this.form).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              }).catch(err=>{
                this.loading = false
              })
            } else if (val == 2) {
              this.form.goodsThemeId = this.editData.goodsThemeId
              postMethod('/goods/theme/outer-update', this.form).then(res => {
                this.loading = false
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              }).catch(err=>{
                this.loading = false
              })
            }

          } else {
            this.loading = false
            return false;
          }
        })
      },
      //上传前回调
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50
        // , 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'
        if (['video/mp4'].indexOf(file.type) == -1) {
          this.$message({
            message: '请上传正确的视频格式',
            type: 'warning'
          })
          return false
        }
        if (!fileSize) {
          this.$message({
            message: '视频大小不能超过50MB',
            type: 'warning'
          })
          return false
        }
        this.isShowUploadVideo = false
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      //上传成功回调
      handleVideoSuccess(res, file) {
        this.isShowUploadVideo = true
        this.videoFlag = false
        this.videoUploadPercent = 0
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.modularVideo = res.data.url
        this.uploadModularVideoList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadModularVideoList.length; i++) {
          if (this.uploadModularVideoList[i].groupId == groupId) {
            imageCnt++
          }
        }
      },
      handleGoodVideoRemove(res) {
        this.modularVideo = ''
        this.uploadModularVideoList = []
      },
      // 封面
      // 查看大图
      handleGoodImagePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 上传前校验
      beforeImageUpload(file) {
        const fileTypeVerify =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'application/pdf'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!fileTypeVerify) {
          this.$message.error('上传文件格式错误!')
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!')
        }
        return fileTypeVerify && isLt2M
      },
      // 上传成功
      handleImageSuccess(res, file, fileList, d) {
        this.loading = false
        res.data.fileType = file.raw.type
        if (d == 'mainImage') {
          this.uploadMainImageList = []
          res.data.sort = 0
          this.uploadMainImageList.push(res.data)
          this.none()
        } else if (d == 'videoCover') {
          this.uploadVideoCoverList = []
          res.data.sort = 0
          this.uploadVideoCoverList.push(res.data)
          this.none()
        } else if (d == '1') {
          this.uploadFirstImageList = []
          res.data.sort = 1
          this.uploadFirstImageList.push(res.data)
          this.none()
        } else if (d == '2') {
          this.uploadSecondImageList = []
          res.data.sort = 2
          this.uploadSecondImageList.push(res.data)
          this.none()
        } else if (d == '3') {
          this.uploadThirdImageList = []
          res.data.sort = 3
          this.uploadThirdImageList.push(res.data)
          this.none()
        }
      },
      block() {
        if (this.uploadMainImageList = []) {
          document.getElementById('mainImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'block'
        }
        if (this.uploadVideoCoverList = []) {
          document.getElementById('videoCover').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'block'
        }
        if (this.uploadFirstImageList = []) {
          document.getElementById('firstImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'block'
        }
        if (this.uploadSecondImageList = []) {
          document.getElementById('secondImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'block'
        }
        if (this.uploadThirdImageList = []) {
          document.getElementById('thirdImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'block'
        }
      },
      none() {
        if (this.uploadMainImageList.length >= 1) {
          document.getElementById('mainImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
        }
        if (this.uploadVideoCoverList.length >= 1) {
          document.getElementById('videoCover').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
        }
        if (this.uploadFirstImageList.length >= 1) {
          document.getElementById('firstImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
        }
        if (this.uploadSecondImageList.length >= 1) {
          document.getElementById('secondImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
        }
        if (this.uploadThirdImageList.length >= 1) {
          document.getElementById('thirdImage').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
        }
      },
      // 删除图片
      handleMainImageRemove(res) {
        this.uploadMainImageList = []
        this.block()
      },
      handleVideoCoverRemove(file, fileList) {
        this.uploadVideoCoverList = []
        this.block()
      },
      handleFirstImageRemove(res) {
        this.uploadFirstImageList = []
        this.block()
      },
      handleSecondImageRemove(res) {
        this.uploadSecondImageList = []
        this.block()
      },
      handleThirdImageRemove(res) {
        this.uploadThirdImageList = []
        this.block()
      },
      search() {

        if (this.form.goodsType == 1) {
          if (this.multipleSelection.length > 0) {
           this.bindingList.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.goodsId==item.goodsId) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList = this.bindingList.concat(this.multipleSelection)
          }
          this.searchParam.status= '0'
        } else if (this.form.goodsType == 2) {
          if (this.multipleSelection.length > 0) {
           this.bindingList_.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.id==item.id) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection)
          }
          this.searchParam.status= ''
        }
        this.searchParam.pageNum = 1
        this.loadGoodsList();
      },
      // 获取商品列表
      loadGoodsList() {
        if (this.form.goodsType == 1) {
          let param =this.searchParam
          param.goodsType=1
          postMethod("/goods/list", param).then(res => {
            this.tableData.list = res.data.records;
            this.tableData.total = res.data.total;
            this.showPagination = this.tableData.total == 0;
            if (this.bindingList&&this.bindingList.length>0) {
            this.testF()
            }
          });
        } else if (this.form.goodsType == 2) {
          getMethod('/coupon/search-coupon-list', this.searchParam).then(res => {
            this.tableData.list = res.data.records;
            this.tableData.total = res.data.total;
            this.showPagination = this.tableData.total == 0;
            if (this.bindingList_&&this.bindingList_.length>0) {
            this.testQ()
            }
          });
        }

      },
      testF(){
        this.$nextTick(() => {
          this.tableData.list.forEach((item,index)=>{
            this.bindingList.forEach((i,dex)=>{
              if (i.goodsId==item.goodsId) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.list[index], true)
              }
            })
          })
         })
      },
      testQ(){
        this.$nextTick(() => {
            this.tableData.list.forEach((item,index)=>{
              this.bindingList_.forEach((i,dex)=>{
                if (i.id==item.id) {
                  this.$refs.multipleTable_.toggleRowSelection(this.tableData.list[index], true)
                }
              })
            })
          })
      },
      selectThis(selection, row) {
        this.multipleSelection = selection
        if (this.form.goodsType == 1) {
          this.bindingList.forEach((item,index)=>{
            if (row.goodsId==item.goodsId) {
               this.bindingList.splice(index,1)
            }
          })
        }else if (this.form.goodsType == 2) {
          this.bindingList_.forEach((item,index)=>{
            if (row.id==item.id) {
               this.bindingList_.splice(index,1)
            }
          })
        }

      },
      selectioncChange(selection){
      },
      currentPage(pageNum) {
        if (this.form.goodsType == 1) {
          if (this.multipleSelection.length > 0) {
           this.bindingList.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.goodsId==item.goodsId) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList = this.bindingList.concat(this.multipleSelection)
          }
        } else if (this.form.goodsType == 2) {
          if (this.multipleSelection.length > 0) {
           this.bindingList_.forEach((i,dex)=>{
             this.multipleSelection.forEach((item,index)=>{
                 if (i.id==item.id) {
                    this.multipleSelection.splice(index,1)
                 }
               })
             })
            this.bindingList_ = this.bindingList_.concat(this.multipleSelection)
          }
        }
        this.searchParam.pageNum = pageNum;
        this.loadGoodsList();
      },
    }
  }
</script>

<style scoped>
  /deep/.el-table__header-wrapper  .el-checkbox{
  	display:none
  }
  .update-form-panel {
    padding: 30px 20px;
    width: 700px;
  }

  .tag {
    position: absolute;
    top: 0;
    /* border: 1px solid red; */
    width: 148px;
    line-height: 25px;
    text-align: center;
    background-color: rgb(144 147 153 / 35%);
  }

  .upLoadContainer {
    position: relative;
    margin-right: 20px;
  }

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
