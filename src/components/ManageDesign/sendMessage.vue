<template>
      <div v-if="showBox" class="sendmessage">
          <div class="left">
              <img :src="userImg" alt="" >
          </div>
          <div class="center">
              <div class="box">
                    <div class="input ">
                        <!-- <textarea  title="发布新主题"  placeholder="发布新主题" @change="trimSpacesAndUppercase($event)" class="textArea"></textarea> -->
                        <el-input
                             class="textArea"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 14}"
                            placeholder="发布新主题"
                            v-model="msg">
                        </el-input>
                    </div>
                    <div class="func_area">
                        <div class="limits">
                            <span class="icon-eye" >视点</span>
                            <span class="icon-image" @click="showUploadBox()">图片</span>
                            <span class="icon-file" >文档</span>
                            <span class="icon-message" >短语</span>
                             <a href="javascript:void(0);" class="cancle " @click="hideSendBox()"  title="取消发布主题按钮">取消</a>
                        </div>
                        <a href="javascript:void(0);" class="send "  title="发布主题按钮">发布</a>
                    </div>
                 </div>
                 <div>   
                     <ul class="clearfix" style="padding: 0px 0px 2px 2px;">
                        <li :class="['item-file']" v-for="(val,key) in filesList" :key="key">
                            <div class="item-file-box clearfix">
                                <span  class="item-file-image">
                                    <img :src="require('../ManageCost/images/icon/'+val.fileExtension.toUpperCase()+'.png')" />
                                </span>
                                <span  class="item-file-detial">
                                    <h3 v-text="val.fileName"></h3>
                                    <p>由<span class="text-name" v-text="val.uploadUser"></span><span v-text="from"></span>上传</p>
                                    <p v-text="initData(val.uploadTime)"></p>
                                    <p class="operation">
                                        <span v-text="'版本'+val.version"></span>
                                        <i class="icon-goujian icon-search" @click="preview(val.filePath)"></i>
                                        <i class="icon-goujian icon-download" @click="downLoad(val.filePath)"></i>
                                    </p>
                                </span>
                            </div>
                        </li>
                        <li :class="['item-file']" v-for="(val,key) in attachList" :key="key" style="padding:0;overflow: hidden;">
                            <img :src="QJFileManageSystemURL+val.relativePath" :title="val.fileName" class="item-file-attach"/>
                            <div class="actionbox clearfix">
                                <i class="button-search"  @click="preview(val.relativePath)"></i>
                                <i class="line"></i>
                                <i class="button-download" @click="downLoad(val.relativePath)"></i>
                            </div>
                        </li>
                    </ul>
              </div>
          </div>
          <div :title="title" v-if="uploadshow"  id="edit" class="hahahha">
                 <div class="el-dialog__header">
                     <span class="el-dialog__title">添加联系人</span>
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="upImgCancle">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div class="el-dialog__body">
                    <div class="editBody">
                        <div class="editBodytwo imageBody">
                            <label class=" imageBodyText">上传文件 :</label>
                            <span class="updataImageSpan">
                                <span @click="selectImg">
                                    <button class="upImgBtn">选择文件</button>
                                </span>
                                <input class="upInput"  type="file" :accept="accept?accept:''" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
                            </span>
                            <span class="upImgText">{{imageName}}</span> 
                        </div>
                    </div>
                </div>
                <div class="el-dialog__footer">
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="uploadIMG">上传</button>
                        <button class="editBtnC" @click="upImgCancle">取消</button>
                    </div>
                </div>
            </div>
            <div id="mask" v-if="uploadshow" @click="upImgCancle"></div>
      </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default Vue.component('common-upload',{
    data(){
        return {
            QJFileManageSystemURL:'',
            userId:'',
            projId:'',
            token:'',
            userImg:'',
            msg:'',//用户发布的信息
            uploadshow:false,
            dirid:'',
            fgid:'',
            isqj:'',
            title:'',
            accept:'',
            ugid:'',
            imageName:'未选择任何文件',
            filesList:[],//文件列表
            attachList:[],//贴图列表
        }
    },
    props:['showBox'],
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.userId  = localStorage.getItem('userid')
        vm.projId = localStorage.getItem('projId');
        vm.userImg = localStorage.getItem('userImg')
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
    },
    methods:{
        hideSendBox(){
            var vm = this
            vm.$emit('hide')
        },
        showUploadBox(){
            var vm = this
            vm.uploadshow = true
        },
        trimSpacesAndUppercase(event){
            var vm = this
            console.log(event)
        },
        selectImg(){
             this.$refs.file.click()
        },
        fileChanged(file){
            var vm = this
            console.log(file)
            const list = vm.$refs.file.files
            vm.imageName = list[0].name
            vm.filesList = list[0]
        },
        upImgCancle(){
            var vm = this
            vm.uploadshow = false
        },
         latestFile(fileId,log){
            var vm = this
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/latestFile',
                headers:{
                    'token':vm.token
                },
                params:{
                    log:log,
                    userGroupId:vm.ugid,//目录id
                    projId:vm.projId
                },
                data:fileId,//文件id
            }).then((response)=>{
                if(response.data.cd == 0){
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        uploadIMG(){
            var vm = this
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
           if(vm.filesList == null){
               vm.$message({
                   type:'error',
                   message:'请选择文件！'
               })
               return false
           }
           console.log(vm.dirid+':::'+vm.fgid+':::'+vm.des+':::'+vm.isqj)
            var returnUrl = "http://10.252.26.240:8080/h2-bim-project/project2/doc/uploadFile?dirId="+vm.dirid+"&fgId="+vm.fgid+"&fileDesc="+vm.des+"&isUploadPoint="+vm.isqj;
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
             formData.append('type',1);
            formData.append('file',vm.filesList);
            formData.append('userId',vm.userId);
            formData.append('modelCode','002');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                var fileId = []
                if(response.data.rt){
                    vm.imageName ='未选择任何文件'
                    vm.filesList = null
                    fileId.push(response.data.rt[0].fileId)
                    vm.latestFile(fileId,"更新了点位文件"+response.data.rt[0].fileName);
                    vm.$refs.file.value = ''
                    vm.$emit('refreshqj')
                }
            }).catch((err)=>{
                vm.imageName ='未选择任何文件'
                vm.$emit('refreshqj')
                console.log(err)
            })
        }
    }
})
</script>
<style lang="less">

</style>


