<template>
      <div id="sendme" v-if="showBox" class="sendmessage" :style="{margin: !iscomment?'0px':''}"  v-loading.fullscreen.lock="fullscreenLoading">
          <div class="left" v-if="iscomment">
              <img :src="userImg" alt="" >
          </div>
          <div class="center" :style="{paddingLeft: !iscomment?'0px':''}">
              <div class="box">
                    <div class="input ">
                        <textarea  class="textArea" :id="'dc-add-content'+dcid+selectugid" :placeholder="iscomment?'发布新主题':'发布新回复'" ref="message"></textarea>
                        <div id="at_userslist"></div>
                    </div>
                    <div class="func_area">
                        <div class="limits">
                            <span class="icon-eye" @click="AddViewpoint()">视点</span>
                            <span class="icon-image" @click="showUploadBox_img()">图片</span>
                            <span class="icon-file"  @click="showUploadBox_file()">文档</span>
                            <span class="icon-message" @click="getShortStateMent()">短语</span>
                            <label :class="[newStmt?'active':'','checkbox-fileItem']" :for="iscomment?'allfile':('conmment'+keycomment)" ></label>
                            <input type="checkbox" :id="iscomment?'allfile':('conmment'+keycomment)" class="el-checkbox__original" v-model="newStmt">
                             <label :class="[checked?'active':'','checkbox-fileItem_same']" v-if="!iscomment" :for="'sameTime'+keycomment" ></label>
                            <input type="checkbox" :id="'sameTime'+keycomment"  v-if="!iscomment"  class="el-checkbox__original" v-model="checked">
                             <a href="javascript:void(0);" class="cancle " @click="hideSendBox()"  title="取消发布主题按钮" v-if="iscomment">取消</a>
                        </div>
                        <a href="javascript:void(0);" class="send "  title="发布主题按钮" @click="sendInfo()">发布</a>
                    </div>
                 </div>
                 <div class="fileitem">   
                     <ul class="clearfix" style="padding: 0px 0px 2px 2px;">
                         <li class="item-file" v-for="(val,key) in uploadViewPointList" :key="key+'_attach'" style="padding:0;overflow: hidden;">
                            <img  style="object-fit: cover;" :src="QJFileManageSystemURL+val.filePath" :title="val.fileName" class="item-file-attach"/>
                            <div class="actionbox clearfix">
                                <i class="button-relocation" title="定位" @click="relocation()"></i>
                                <i class="line"></i>
                                <i class="button-search"  @click="preview(val.filePath)"></i>
                                 <i class="line"></i>
                                 <i class="icon-goujian icon-delete" @click="deleteFile1(key)"></i>
                            </div>
                        </li>
                        <li class="item-file" v-for="(val,key) in fileId" :key="key+'_file'">
                            <div class="item-file-box clearfix">
                                <span  class="item-file-image">
                                    <img :src="require('../ManageCost/images/icon/'+val.fileExtension.toUpperCase()+'.png')" />
                                </span>
                                <span  class="item-file-detial">
                                    <h3 v-text="val.fileName"></h3>
                                    <p>由<span class="text-name" v-text="val.uploadUser"></span><span v-text="'浏览器'"></span>上传</p>
                                    <p v-text="initData(val.uploadTime)"></p>
                                    <p class="operation">
                                        <span v-text="'版本'+val.version"></span>
                                        <i class="icon-goujian icon-delete" @click="deleteFile(key,2)"></i>
                                        <i class="icon-goujian icon-search" @click="preview(val.filePath)"></i>
                                        <i class="icon-goujian icon-download" @click="downLoad(val.filePath)"></i>
                                    </p>
                                </span>
                            </div>
                        </li>
                        <li class="item-file" v-for="(val,key) in attachId" :key="key+'_attach'" style="padding:0;overflow: hidden;">
                            <img :src="QJFileManageSystemURL+val.filePath" :title="val.fileName" class="item-file-attach"/>
                            <div class="actionbox clearfix">
                                <i class="button-search"  @click="preview(val.filePath)"></i>
                                <i class="line"></i>
                                <i class="button-download" @click="downLoad(val.filePath)"></i>
                                 <i class="line"></i>
                                 <i class="icon-goujian icon-delete" @click="deleteFile(key,1)"></i>
                            </div>
                        </li>
                    </ul>
              </div>
          </div>
          <div :title="title" v-if="uploadshow"  id="edit" class="hahahha">
                 <div class="el-dialog__header">
                     <span class="el-dialog__title" v-text="type==1?'图片上传':'文件上传'"></span>
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
                                <input class="upInput"  type="file" :accept="type == 1?'image/*':''" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
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
            <div id="edit"  class="hahahha" v-if="ShortStateMent.show">
                 <div class="el-dialog__header">
                     <span class="el-dialog__title" v-text="'常用短语'"></span>
                    <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="duanyuClose">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div class="el-dialog__body" style="margin-left:40px;margin-right:40px;">
                    <div class="editBody" style="max-height: 402px;overflow-y: auto;">
                        <table class="UserList" width='100%'>
                            <thead>
                                <tr  class="userList-thead">
                                    <th style="min-width:428px;">短语</th>
                                    <th style="width:50px;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in ShortStateMent.obj" :key="index" :class="[{'active':item.checked}]"  @click="checkItem(index)" @dblclick="copyMes(index)">
                                    <td>
                                        <span v-text="item.content"></span>
                                    </td>
                                    <td>
                                        <span class="deleteBtn" @click="deleteShortStateMent(item.id,index)"></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="el-dialog__footer">
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="copyMes()">确定</button>
                        <button class="editBtnC" @click="duanyuClose">取消</button>
                    </div>
                </div>
            </div>
            <div id="mask" v-if="uploadshow || ShortStateMent.show" @click="upImgCancle"></div>
      </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
var app;
var ScreenPara;
var CurrentSelectPara;
import '../ManageCost/js/jquery-1.8.3.js'
import './js/jquery.showAtUser.js'
export default Vue.component('common-upload',{
    data(){
         window.addEventListener("message", (evt)=>{this.callback(evt)});
        return {
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            userId:'',
            projId:'',
            token:'',
            userImg:'',
            message:'',//用户发布的信息
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
            type:1,//图片是1，文档是 2
            newStmt:false,//是否保存为短语
            checked:false,//同时作为新主题发表
            defaultSubProjId:'',
            fileId:[],
            attachId:[],
            ShortStateMent:{
                show:false,
                obj:[],//短语列表
            },
            fullscreenLoading:false,
            WebGlSaveId:'',
            WebGlSaveType:'',
            WebGlSaveName:'',
            base64Str:'',
            elementFilter:'',
            uploadViewPointList:[]
        }
    },
    props:['showBox','selectugid','holderid','iscomment','keycomment','dcid','valuemonomer','valuestatus','valueabout'],
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.userId  = localStorage.getItem('userid')
        vm.projId = localStorage.getItem('projId');
        vm.userImg = localStorage.getItem('userImg')
        // vm.WebGlSaveId = localStorage.getItem('WebGlSaveId')
        // vm.WebGlSaveType = localStorage.getItem('WebGlSaveType')
        // vm.WebGlSaveName = localStorage.getItem('WebGlSaveName')
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.WebGlUrl=vm.$store.state.WebGlUrl
        vm.BIMServerPort=vm.$store.state.BIMServerPort;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        var setting = {
            projId:vm.projId,
            ugid:vm.selectugid,
            basePath:vm.BDMSUrl,
            token:vm.token
        }
        $('#dc-add-content'+vm.dcid+vm.selectugid).showAtUsers(setting);
        
        // console.log(app)
        // const oIframe = document.getElementById('show-iframe');
    },
    watch:{
         selectugid:function(val,oldval){
            var vm = this 
            var setting = {
                projId:vm.projId,
                ugid:vm.selectugid,
                basePath:vm.BDMSUrl,
                token:vm.token
            }
            setTimeout(function(){
                $('#dc-add-content'+vm.dcid+vm.selectugid).showAtUsers(setting)
            },1000)
        },
    },
    methods:{
       
        callback(e){
           // console.log(e)
            switch(e.data.command){
			case "EngineReady":
				{
                    // let Horder = {"ID":this.WebGlSaveId,"Type":this.WebGlSaveType,"Name":this.WebGlSaveName,"ParentID":""};
					// let para = {User:"",TokenID:"",Setting:{BIMServerIP:this.WebGlUrl,BIMServerPort:this.BIMServerPort,MidURL:"qjbim-mongo-instance",RootHolder:Horder}}
					// app.postMessage({command:"EnterProject",parameter:para},"*");
				}
				break;
            case "CurrentSelectedEnt":
			case "ViewpointSubmited":
                ScreenPara = e.data.parameter;
                this.base64Str=ScreenPara.para2;
                this.elementFilter=ScreenPara.para1;
                 var vm = this
                    axios({
                        method:'POST',
                        url:this.BDMSUrl+'/project2/dc/uploadViewPoint/1/'+this.projId,
                        headers:{
                            'token':vm.token
                        },
                        data:{"base64":this.base64Str}
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            this.$message({
                                type:'success',
                                message:'视点截图成功'
                            })
                            this.uploadViewPointList.push(response.data.rt)
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
		    }
        },
        AddViewpoint(){
            if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })}else{
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                 const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"AddViewpoint",parameter:123},"*");
            }
        },
        checkItem(index){
            var vm = this
            vm.ShortStateMent.obj.forEach((item,key)=>{
                 if(index == key){
                      vm.ShortStateMent.obj[index].checked = !vm.ShortStateMent.obj[index].checked
                 }else{
                        item.checked = false
                 }
            })
        },
        deleteShortStateMent(id,index){
             var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'/project2/dc/deleteShortStmtById',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'token':vm.token
                },
                params:{
                    id:id
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                  vm.ShortStateMent.obj.splice(index,1)
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        copyMes(index=null){
            var vm = this
            var mes = ''
            if(index!=null){
                mes = vm.ShortStateMent.obj[index].content
            }else{
                 vm.ShortStateMent.obj.forEach((item,key)=>{
                    if(item.checked){
                        mes  = item.content
                    }
                })
            }
            vm.$refs.message.value+=mes
            vm.duanyuClose()
        },
        duanyuClose(){
            var vm = this
            vm.ShortStateMent.show = false
        },
         initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
        //重回定位
        relocation(){
            const app = document.getElementById('webIframe').contentWindow;
            app.postMessage({command:"MoveToViewpoint",parameter:ScreenPara},"*");
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        preview(val){
            var vm = this
            if(val){
                window.open(vm.QJFileManageSystemURL+val+"/preview");
            }else{
                 vm.$message({
                    type:'info',
                    message:'出错'
                })
            }
        },
        deleteFile(index,type){
            var vm = this
            if(type == 1){
                vm.attachId.splice(index,1)
            }else{
                vm.fileId.splice(index,1)
            }
            
        },
        deleteFile1(index){
            var vm=this;
        vm.uploadViewPointList.splice(index,1)
        },
        downLoad(filePath){
            //latestFile(fileId,fgId,"下载了文件"+fileName);
            var vm = this
            if(!filePath){
                vm.$message({
                    type:'info',
                    message:'出错'
                })
                return false
            }
            window.open(vm.QJFileManageSystemURL + filePath);
        },
        hideSendBox(){
            var vm = this
            vm.$emit('hide')
            vm.fileId = []
            vm.attachId = []
            vm.uploadViewPointList=[]
            vm.$refs.message.value = ''
        },
        showUploadBox_img(){
            var vm = this
            vm.type = 1
            vm.uploadshow = true
        },
        // viewPoin(){
        //     app.postMessage({command:"AddViewpoint",parameter:123},"*");
        // },
        showUploadBox_file(){
             var vm = this
            vm.type = 2
            vm.uploadshow = true
        },
        trimSpacesAndUppercase(event){
            var vm = this
        },
        selectImg(){
             this.$refs.file.click()
        },
        fileChanged(file){
            var vm = this
            const list = vm.$refs.file.files
            vm.imageName = list[0].name
            if(vm.type == 1){
                 vm.attachList = list[0]
            }else{
                 vm.filesList = list[0]
            }
        },
        upImgCancle(){
            var vm = this
            vm.uploadshow = false
            vm.imageName = '未选择任何文件'
            vm.filesList = null
            vm.attachList = null
        },
        getShortStateMent(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'/project2/dc/getShortStatementByUserIdAndProjId',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.ShortStateMent.show = true
                    vm.ShortStateMent.obj = response.data.rt
                    vm.ShortStateMent.obj.forEach((element,index) => {
                        vm.$set(element,'checked',false)
                    });
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
         trim(str){ 
            /**去掉字符串前后所有空格*/
            return str.replace(/(^\s*)|(\s*$)/g, ""); 
        },
        sendInfo(){
            var vm = this
            vm.$refs.message.value = vm.trim(vm.$refs.message.value)
            if(vm.$refs.message.value==''){
                vm.$message({
                    type:'error',
                    message:'请输入信息！'
                })
            }
            var fuuid = []
            var imguuid = []
            var vpListUid=[]
            vm.fileId.forEach((item,index) => {
                fuuid.push(item.fileId+'')
            });
             vm.attachId.forEach((item,index) => {
                imguuid.push({
                    fileUuid:item.fileUuid
                })
            });
            vm.uploadViewPointList.forEach((item,index)=>{
                    vpListUid.push({
                        elementFilter:this.elementFilter,
                        extension:item.fileExtension,
                        relativePath:item.filePath,
                        uuid:item.fileUuid,
                        name:item.fileName,
                        projId:this.projId,
                        subProjId:this.defaultSubProjId,
                    })
            })
            // console.log(vpListUid)
            if(vm.iscomment){
                 var data = {
                    dirId:-1,
                    pageType:1,	//设计协调
                    newStmt:vm.newStmt,
                    designCoordinate:{
                        dcContent: vm.$refs.message.value,
                        ugId: vm.selectugid,
                        projId: vm.projId,
                        subProjId: vm.defaultSubProjId,
                        builderId: vm.holderid   // 单体 holderId
                    },
                    vpList:vpListUid,//视点集合
                    attachList: imguuid,
                    fileIdList: fuuid

                };
                var params = {}
                var url = '/project2/dc/add'
            }else{
                var data = {
                    type:1,//设计协调
                    checked: vm.newStmt,
                    projId: vm.projId,
                    ugId: vm.selectugid,
                    themeStatus: '',//主题状态
                    dcReview: {
                        dcId: vm.dcid,
                        rvContent: vm.$refs.message.value
                    },
                    dcSearchCondition: {
                        builderId: vm.valuemonomer,//单体
                        pageNo: 0,//固定为0
                        pageSize: 0,//固定为0
                        pageType: 0,//固定为0
                        projId: vm.projId,
                        status: vm.valuestatus,//状态 筛选
                        subProjId: vm.defaultSubProjId,
                        type: vm.valueabout,//相关 筛选
                        ugId: vm.selectugid,
                        userId: vm.userId
                    },
                    vpList:vpListUid,
                    newDC: vm.checked,//新主题
                    attachList: imguuid,
                    fileIdList: fuuid
                }
                var params = {
                    builderId:vm.valuemonomer
                }
                var url = '/project2/dc/'+vm.dcid+'/review/add'
            }
            vm.fullscreenLoading = true;
            // console.log(data);
             axios({
                method:'POST',
                url:vm.BDMSUrl+url,//vm.BDMSUrl+url
                headers:{
                    'token':vm.token
                },
                data:data,
                params:params
            }).then((response)=>{
                if(parseInt(response.data.cd) == 0){
                    if(vm.iscomment){
                         vm.$emit('refresh')
                    }else{
                        
                        if(vm.checked){
                            var recall = {
                                isChecked:true,
                                data:response.data.rt
                            }
                            vm.$emit('refreshcomment',recall)
                        }else{
                            var recall = {
                                isChecked:false,
                                data:response.data.rt
                            }
                            vm.$emit('refreshcomment',recall)
                        }
                       vm.checked = false
                    }
                    vm.filesList = null
                    vm.fileId = []
                    vm.attachId = []
                    vm.uploadViewPointList=[]                     
                    vm.$refs.message.value = ''
                    vm.newStmt = false
                }else{
                    // vm.$message({
                    //     type:'error',
                    //     message:response.data.msg
                    // })
                }
                vm.fullscreenLoading = false
            }).catch((err)=>{
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        },
        uploadIMG(){
            var vm = this
            if(vm.type == 1){
                if(vm.attachList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择图片！'
                    })
                    return false
                }
            }else{
                if(vm.filesList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择文件！'
                    })
                    return false
                }
            }
            var returnUrl = vm.BDMSUrl+'project2/dc/dcUpload?ugId='+vm.selectugid+"&type="+vm.type+'&dirId=-1'
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
            formData.append('type',1);
            if(vm.type == 1){
                  formData.append('file',vm.attachList);
            }else{
                formData.append('file',vm.filesList);
            }
            formData.append('userId',vm.userId);
            formData.append('modelCode','004');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL+'/uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                if(response.data.rt){
                    if(vm.type == 1){
                         vm.attachId.push(response.data.rt)
                    }else{
                         vm.fileId.push(response.data.rt)
                    }
                    vm.$refs.file.value = ''
                    vm.upImgCancle()
                }
            }).catch((err)=>{
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        }
    }
})
</script>
<style lang="less">
    #sendme{
        .UserList{
            max-height: 402px;
            overflow-y: auto;
            border-collapse: collapse;
            border: 1px solid #e1e1e1;
            thead{
                border-bottom: 1px solid #e1e1e1;
                background: #f3f3f3;
                th{
                    height: 36px;
                    text-align: left;
                    font-size: 12px;
                    color: #999999;
                    font-weight: normal;
                    border-right: 1px solid #e1e1e1;
                    padding-left:10px!important; 
                }
            }
            tbody{
                tr{
                    td{
                        height: 36px;
                        text-align: left;
                        box-sizing: border-box;
                        font-size: 14px;
                        color: #333333;
                        border-bottom: 1px solid #e1e1e1;
                        border-right: 1px solid #e1e1e1;
                        padding-left:10px!important; 
                        .checkbox-fileItem{
                            display:block;
                            width: 14px;
                            height: 14px;
                            border: 1px solid #cccccc;
                            cursor: pointer;
                            margin-left: 20px;
                        }
                        .active{
                            background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                            border: 1px solid #fc3439;
                        }
                        img{
                            height: 18px;
                            float: left;
                            margin-right: 7px;
                        }
                    .deleteBtn{
                        display: block;
                        width: 16px;
                            height: 16px;
                            border: none;
                            cursor: pointer;
                            margin-right: 16px;
                            background: url('../../assets/delete.png') no-repeat;
                        }
                    }
                    &:hover{
                        background: #fafafa;
                        .icon-goujian{
                            display: inline-block;
                        }
                    }
                }
                tr:nth-child(2n){
                    td{
                        background: #f3f3f3;
                    }
                }
                .active{
                    border: none!important;
                    td{
                        background: #0081c2!important;
                    }
                }
            }
        }
        .checkbox-fileItem{
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            margin-right: 100px!important;
            position: relative;
            &::after{
                font-size:12px;
                color:#cccccc;
                display: block;
                position: absolute;
                right: -80px;
                top: 0;
                line-height:12px;
                content: '保存为新短语';
            }
        }
        .checkbox-fileItem_same{
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            position: relative;
            &::after{
                font-size:12px;
                color:#cccccc;
                display: block;
                position: absolute;
                right: -115px;
                top: 0;
                line-height:12px;
                content: '同时作为新主题发表';
            }
        }
        .active{
            background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                border: 1px solid #fc3439;
        }
        .el-checkbox{
            float: left;
        }
        .imageBody{
            text-align: center!important;
        }
    }
</style>



