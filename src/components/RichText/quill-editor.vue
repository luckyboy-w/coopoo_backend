<template>
   <div class="rich-text" v-loading="loading">
        <quill-editor v-model="richText"  ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
        <el-upload 
        v-show='false'
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from '@/utils/validate'
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module'; // 引用
Quill.register('modules/imageResize', ImageResize); // 注册

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


export default {
  name: 'FuncFormsEdit',
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  props: {
      content:{
        type: String,
        required: false
      }
  },
  mounted(){
    this.richText = this.content
  },
  created() {
  },
  watch: {
      'richText': function(newVal){
         this.$emit('changeContent',newVal)
      }
  },
  data() {
      return {
        loading:false,
        refsId:Math.random()*100000,
        richText:'',
        imageUrl:'',
        data:{},
        uploadUrl:getUploadUrl(),
        action:'',
        headers:'',
        editorOption: {
          height:'400px',
          placeholder: '请输入内容',
          modules:{
            toolbar: {
              container:[
                [{ 'size': ['small', false, 'large'] }],
                [{ 'color': [] }, { 'background': [] }], 
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['bold', 'italic'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                [{ 'direction': 'rtl' }],
              ],
              handlers: {
                  'image': function (value) {
                      if (value) {
                          // 调用eleUI图片上传
                          document.querySelector('.rich-text .avatar-uploader-icon').click()
                      } else {
                          this.quill.format('image', false);
                      }
                  }
              }
            },
            imageResize:{
              displayStyles:{
                backgroundColor:'black',
                border:'none',
                color:'white'
              },
              modules:['Resize','DisplaySize','Toolbar']
            }
          }
        },
        dataForm:{
          brandName:'',
          brandDesc:'',
          id:''
        }
      }
  },
  methods: {
    setContent(val){
      this.richText = val
    },
    onEditorReady(event){

    },
    beforeUpload(){
      this.loading = true
    },
    handleAvatarSuccess(res,file){
      this.loading = false
      let imageUrl = res.data.url
      let quill = this.$refs.myQuillEditor.quill
      let length = quill.getSelection().index;
      quill.insertEmbed(length, 'image', imageUrl)
      quill.setSelection(length + 1)
    }
  }
}
</script>
<style>
.ql-editor{
  max-height:400px!important;
}
</style>