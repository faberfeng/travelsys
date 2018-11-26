<template>
    <div id="shareFile">
        <el-row class="container-header">
            <el-col :span="24" class="header">
                <div class="headerImg">
                    <img src='./images/shareFileLogo.png'/>
                    <!-- <img :src="proimg?proimg:require('../assets/defaultlogo.png')"/> -->
                </div>
                <div class="headerText">工程云盘</div>
                <div class="headerInfo">
                    <a class="userCenter" href="http://bdms.arctron.cn/arctron-usercenter">用户中心</a>
                    <span class="appDownLoad" href="">客户端下载</span>
                </div>
            </el-col>
        </el-row>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div class="header_shareFile" >
                    <div v-show="backshow==true" @click="showShareFilesOrFolder()" class="header_btn">返回上层</div>
                    {{fileListName}}
                </div>
                <!-- <div class="header_btn">

                </div> -->
                <ul id="file-container" class="clearfix" style="padding: 0px 10px 15px 20px;">
                    <li :class="[{'item-file-active':item.checked},'item-file','file']" v-for="(item,index) in fileList" :key="index+'file'" @click="checkItem(index,true)" >
                        <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click.stop="checkItem(index,true,true)" ></label>
                        <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                        <div class="item-file-box clearfix">
                            <span  class="item-file-image">
                            <img :src="require('./images/icon/'+item.icon)" />
                            </span>
                            <span  class="item-file-detial">
                                <h3 v-text="item.fgName"></h3>
                                <p>由<span class="text-name" v-text="item.uploadUser"></span>通过<span v-text="item.uploadFromExplorer == 1?'浏览器':'手机端'"></span>上传</p>
                                <p v-text="initData(item.uploadTime)"></p>
                                <p class="operation">
                                    <span v-text="'版本'+item.version"></span>
                                    <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileName)"></i>
                                    <i class="icon-goujian icon-download" @click="downLoad(item.filePath)"></i>
                                </p>
                            </span>
                        </div>
                    </li>
                    <!-- @click="checkItem(index)" -->
                    <!-- @click="IntoDir(item.nodeId)" -->
                    <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in folderList" :key="index+'folder'"    @click="intoDir(item.nodeId)">
                        <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click.stop="checkItem(index,false,true)" ></label>
                        <input type="checkbox" :id='item.nodeId+"file"' class="el-checkbox__original" v-model="item.checked">
                        <div class="item-file-box clearfix">
                            <span  class="item-file-image item-folder-image">
                            <img :src="require('./images/folderBig.png')" />
                            </span>
                            <span  class="item-file-detial">
                                <h3 v-text="item.nodeName"></h3>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active-version':'active-version-3']">
                    <span class="item-version " @click="screenLeft.item = 1">属<br>性</span>
                    <span class="item-version-3  " @click="screenLeft.item = 2">版<br>本</span>
                </div>
            </div>
            <div id="box-right" v-show="screenLeft.show" v-if="screenLeft.item == 1">
                <h3 class="header-attribute" style="margin-top:0;">
                    <i class="trrangle"></i>
                    基本属性
                    <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                </h3>
                <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]">
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">文件名</span>
                        <span class="detial-text-value" v-text="checkedItem.fgName"></span>
                    </li>
                        <li class="detial-item clearfix">
                        <span class="detial-text-name">版本</span>
                        <span class="detial-text-value" v-text="checkedItem.version"></span>
                    </li>
                        <li class="detial-item clearfix">
                        <span class="detial-text-name">上传人</span>
                        <span class="detial-text-value" v-text="checkedItem.uploadUser"></span>
                    </li>
                        <li class="detial-item clearfix">
                        <span class="detial-text-name">上传时间</span>
                        <span class="detial-text-value" v-text="initData(checkedItem.uploadTime)"></span>
                    </li>
                        <li class="detial-item clearfix">
                        <span class="detial-text-name">更新人</span>
                        <span class="detial-text-value" v-text="checkedItem.updateUser"></span>
                    </li>
                        <li class="detial-item clearfix">
                        <span class="detial-text-name">更新时间</span>
                        <span class="detial-text-value" v-text="initData(checkedItem.updateTime)"></span>
                    </li>
                </ul>  
            </div> 
            <div id="box-right-1" v-show="screenLeft.show" v-else-if="fileCheckedNum == 1">
                <p class="head" ><!-- v-if="checkedItem.dirId"-->
                    <i class="icon-goujian icon-search" @click="view()"></i>
                    <i class="icon-goujian icon-download" @click="downLoad()"></i>
                     <select v-model="posType" class="inp-search">
                        <option value="">所有版本</option>
                        <option value="1">本周更新</option>
                        <option value="2">本月更新</option>
                        <option value="3">本年更新</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </p>
                <ul>
                    <li class="item-version" v-for="(item,index) in  versionItem" :key="index">
                        <div class="clearfix">
                            <img :src="item.imgUuid?QJFileManageSystemURL+'/'+item.imgUuid:require('../../assets/people.png')" class="img" alt="">
                            <div class="versin-detial">
                                <span class="user-name" v-text="item.uploadUserName"></span>
                                <span class="version-number" v-text="'版本-'+item.version"></span>
                                <p class="version-des">上传了新文档</p>
                            </div>
                        </div>
                        <p class="item-date">{{initData(item.uploadTime)+'来自'+(item.uploadFromExplorer == 1?'浏览器':'手机端')+'更新'}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>
<script>
import axios from 'axios'
import './js/jquery-1.8.3.js'
import './js/jquery-ui-1.9.2.custom.js'
import './js/date.js'
export default {
    data(){
        return{
            screenLeft:{
                show:true,
                item:1,
            },
            show:{
                basicAttributes:false,
                BindingArtifacts:false
            },
            shareNo:"",
            fileList:[],
            folderList:[],
            qjShareGroup:'',
            user:'',
            fileGroupBeanList:'',
            nodeList:'',
            checkedItem:[],
            fileCheckedNum:'',
            posType:'',
            versionItem:'',
            docType:'',
            fileListName:'',
            backshow:false,
        }
    },
    created(){
        var vm=this;
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        // this.intoDir();
        this.showShareFilesOrFolder();
    },
    watch:{
        posType:function(){
          var vm = this
          vm.getVersion()
      },
    },
    methods:{
        showShareFilesOrFolder(){
            this.backshow=false;
            this.fileList=[];
            this.folderList=[];
            this.shareNo=this.$route.path
            var str="/cloud/share/"
            this.shareNo=this.shareNo.replace(new RegExp(str), "")
            // var a=this.shareNo
            // this.shareNo=String(a)
            console.log(this.shareNo)
            //  var formData = new FormData()
            //  formData.append('shareNo',this.shareNo);
            // this.shareNo=JSON.parse(this.shareNo)
             axios({
                method:'post',
                url:this.BDMSUrl+'project2/doc/showShareFilesOrFolder',
                // params:{shareNo:'59351cb8-03d5-48f7-beb6-0e3019056a6f'}
                params:{shareNo:"'"+this.shareNo+"'"}
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.fileGroupBeanList=response.data.rt.fileGroupBeanList;
                    this.nodeList=response.data.rt.nodeList;
                    console.log(this.fileGroupBeanList,'7777');
                    if(this.fileGroupBeanList){
                        this.fileGroupBeanList.forEach((item)=>{
                            this.$set(item,'checked',false)
                            this.fileList.push(item)
                        })
                        this.fileListName=(this.fileList[0].fgName.split('.'))[0];
                        console.log(this.fileListName[0])
                    }
                     if(this.nodeList){
                            this.nodeList.forEach((item)=>{
                                this.$set(item,'checked',false)
                                this.folderList.push(item)
                            })
                            this.fileListName=this.folderList[0].nodeName;
                    }
                }
            })
        },
        getVersion(){
            var vm = this
            var fgId = ''
            if(vm.checkedItem){
                if(!vm.checkedItem.fgId){
                    vm.versionItem = {}
                    return false
                }
                fgId = vm.checkedItem.fgId
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/getFileGroupVersionList2',
                params:{
                    fgId:fgId,
                    versionType:vm.posType,
                    docType:vm.docType//获取是1
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    vm.versionItem = response.data.rt == null?{}:response.data.rt
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
        view(filePath,fileName){
            //latestFile(fileId,fgId,"预览了文件"+fileName);
            var vm = this
            if(!filePath){
                if(vm.checkedItem){
                    filePath =  vm.checkedItem.filePath
                }
            }
            if(!filePath){
                vm.$message({
                type:'info',
                message:'请勾选要预览的文件'
            })
            return false
            }
            if(fileName.split('.')[1] == 'gmd' || fileName.split('.')[1] == 'GMD'){
                window.open(this.WebGlUrl+"/gmdModel/index.html?url="+encodeURIComponent(this.QJFileManageSystemURL+filePath)+'#/showcompany');
            }else{
                window.open(vm.QJFileManageSystemURL+filePath+"/preview");
            }
        },
        downLoad(filePath){
            //latestFile(fileId,fgId,"下载了文件"+fileName);
            var vm = this
            if(!filePath){
                if(vm.checkedItem){
                    filePath =  vm.checkedItem.filePath
                }
            }
            if(!filePath){
                vm.$message({
                    type:'info',
                    message:'请勾选要下载的文件'
                })
                return false
            }
            window.open(vm.QJFileManageSystemURL + filePath+'');
        },
        intoDir(val){
            var vm = this
            // this.shareNo=this.$route.path
            // var str="/cloud/share/"
            // this.shareNo=this.shareNo.replace(new RegExp(str), "")
            this.backshow=true;
            axios({
                method:'POST',
                url:this.BDMSUrl+'project2/doc/showShareFilesAndFolder',
                params:{
                    dirId:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // console.log(response.data.rt,'0000');
                    this.fileList=response.data.rt.fileGroupBeanList;
                    this.folderList=[];
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:"error",
                        message:message.data.msg
                    })
                }
            })
            // vm.getInfo()
        },
        checkItem(val,file,isMultiSelect){
            var vm = this
            vm.show.basicAttributes =true
            vm.show.BindingArtifacts =true
            var fileCheckList = []
            vm.fileCheckedNum = 0
            vm.checkAll = false
            if(isMultiSelect){//多选
                if(file){
                    vm.fileList[val].checked =  vm.fileList[val].checked?false:true
                }else{
                    vm.folderList[val].checked =  vm.folderList[val].checked?false:true
                }
                for(var i=0;i<vm.fileList.length;i++){
                    if(vm.fileList[i].checked){
                        vm.fileCheckedNum++
                        fileCheckList.push(vm.fileList[i])
                        if(!vm.fileList[i].fgId){
                            vm.auth.canCancelShare = false
                        }
                    }
                }
                 for(var j=0;j<vm.folderList.length;j++){
                    if(vm.folderList[j].checked){
                        vm.checkedFile_Folder.folder = true
                        vm.checkedFile_Folder.folderCheckedNum++
                    }
                }
                if(file){
                    vm.checkedItem = {}
                    if(vm.fileCheckedNum == 1){
                        vm.checkedItem = fileCheckList[0]
                        vm.getVersion()
                    }else if(vm.fileCheckedNum == vm.fileList.length){
                        vm.checkAll = true
                    }
                }else{
                    vm.checkedItem = {}
                }
            }else{//单选
                if(file){
                    vm.fileCheckedNum = 1
                    for(var i=0;i<vm.fileList.length;i++){
                        vm.fileList[i].checked = false
                        if(vm.fileList[i].checked && !vm.fileList[i].fgId){
                            vm.auth.canCancelShare = false
                        }
                    }
                    vm.fileList[val].checked = true

                    vm.checkedItem = vm.fileList[val]
                    vm.getVersion()
                }else{
                    for(var j=0;j<vm.folderList.length;j++){
                        vm.folderList[j].checked = false
                    }
                    vm.folderList[val].checked = true
                    vm.checkedItem = {}
                }
            }
    }
}
}
</script>
<style lang='less' >
li{
    list-style-type:none;
}
.clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
#shareFile{
    a:active{
    decoration:none;
    }
    .container-header{
        width: 100%;
        height: 68px;
        /* position: fixed; */
        margin: 0px;
        padding:0px;
        /* left: 0;
        right: 0; */
        z-index: 1001;
        /* overflow-y: auto; */
        .header{
            height: 68px;
            background: #25282d;
            overflow: hidden;
            display: flex;
            .headerImg{
                width: 200px;
                height: 50px;
                margin:10px 5px;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;

                }
            }
            .headerText{
                font-size: 18px;
                height: 67px;
                text-align: left;
                line-height: 67px;
                color: white;
                font-family: "微软雅黑";
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                flex: 1;
            }
            .headerInfo{
                width: 200px;
                height: 68px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .userCenter{
                    color:#d9d9d9;
                    font-size: 14px;
                    text-decoration:none;
                    display: inline-block;
                    margin-right:15px;
                }
                .appDownLoad{
                    color:#d9d9d9;
                    font-size: 14px;
                    text-decoration:none
                }
            }


        }
    }
    
    select.inp-search {  
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  
    }
     .show{
        display: block!important;
    }
    //左侧
    .box-left-container{
        display: inline-block;
        width: 85%;
        position: relative;
        transition:  all ease .5s;
        .header_shareFile{
            display: block;
            height: 50px;
            font-size: 16px;
            font-weight: bold;
            margin-top:25px;
            // position: absolute;    
            color:#fc3439;
            border-bottom: 1px solid #ccc;
            position: relative;
            .header_btn{
                    background: #ff5257;
                position: absolute;
                margin-right: 20px;
                color: #fff;
                font-size: 14px;
                font-weight: normal;
                width: 86px;
                height: 30px;
                border: none;
                padding: 0;
                cursor: pointer;
                border-radius: 2px;
                line-height: 30px;
                left:20px;
            }
        }
        #file-container{
             .icon-goujian{
                float: right;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .icon-download{
                background: url('./images/download.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/download1.png')no-repeat 0 0;
                }
            }
             .icon-search{
                background: url('./images/search.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/search1.png')no-repeat 0 0;
                }
            }
            .item-file{
                float: left;
                width: 290px;
                height: 120px;
                margin: 20px 15px 0 0;
                border-radius: 6px;
                box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                position: relative;
                padding: 8px;
                .checkbox-fileItem{
                    display:block;
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                }
                .active{
                    background: url('./images/checked.png') no-repeat 1px 2px;
                     border: 1px solid #fc3439;
                }
                .item-file-box{
                    .item-file-image{
                        float: left;
                        margin-top:16px;
                        width: 70px;
                        height: 70PX;
                        border-radius: 50%;
                        background: #f2f2f2;
                        img{
                            width: 48px;
                            height: 48px;
                            display: block;
                            margin-top: 13PX;
                            margin-left: 11px;
                        } 
                    }
                    .item-folder-image{
                        img{
                            width: 36px;
                            height: 33px;
                            display: block;
                            margin-top: 19PX;
                            margin-left: 17px;
                        }
                    }
                    .item-file-detial{
                        display: block;
                        margin-left:80px; 
                        .detial{
                            span{
                            color: rgb(51, 102, 153);
                            max-width: 50px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            }
                        }
                        >h3{
                            text-align: left;
                            font-size: 14px;
                            color: #333333;
                            line-height: 20px;
                            margin: 9px 0 8px;
                            max-height: 40px;
                            overflow: hidden;
                        }   
                        >p{
                            font-size: 12px;
                            line-height: 12px;
                            color: #b3b3b3;
                            text-align: left;
                            margin-bottom:4px; 
                        }
                        .text-name{
                            color: #336699;
                        }
                        .operation{
                            display: block;
                            position: absolute;
                            bottom: 0;
                            left: 88px;
                            right: 0;
                            margin-bottom:15px; 
                            span{
                                color: #fc3439;
                            }
                        }
                    }
                }
            }
            .item-file-active{
                box-shadow: 0px 1px 8px rgba(252,52,57,.2);
            }

        }

    }
    .box-left-avtive{
        width: 98%;
        transition:  all ease .5s;
        .icon-right{
            transform: rotateZ(180deg)!important;
            transition: all ease .5s;
        }
    }
    //右侧
    .box-right-container{
        display: inline-block;
        position: relative;
        float: right;
        width: 15%;
        // margin-top: -763px;
        transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
        height: 785px;
        overflow-y: auto;
        overflow-x: hidden;
        #center-selection{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 25px;
            border-right: 1px solid #cccccc;
            .SH_right{
                width: 100%;
                height: 48px;
                border-left: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                .icon-right{
                    display: block;
                    position: absolute;
                    top: 19px;
                    left: 6px;
                    width: 14px;
                    height: 14px;
                    background: url('./images/right.png')no-repeat 0 0;
                    transition: all ease .5s;
                    transform: rotateZ(0deg);
                }
            }
            .item-property{//目录
                display: block;
                width: 25px;
                height: 68px;
                background: #fafafa;
                padding-top:15px;
                font-size: 12px;
                color: #666666; 
                text-align: center;
                border-left: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom: -9px;
                    width: 23px;
                    height: 15px;
                     background: #fafafa;
                    border-top: 1px solid #cccccc;
                    transform: skewY(30deg);
                    content: '';
                }
            }   
            .item-version{//属性
                display: block;
                width: 25px;
                height: 56px;
                background: #fafafa;
                padding-top:12px;
                font-size: 12px;
                color: #666666; 
                text-align: center;
                border-left: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom:-7px;
                    width: 23px;
                    height: 13px;
                    background: #fafafa;
                    border-bottom: 1px solid #cccccc;
                    transform: skewY(30deg);
                    content: '';
                }
            }
            .item-version-3{//版本
                 display: block;
                width: 25px;
                height: 68px;
                background: #fafafa;
                padding-top:24px;
                font-size: 12px;
                color: #666666; 
                text-align: center;
                border-left: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom:-7px;
                    width: 23px;
                    height: 13px;
                    background: #fafafa;
                    border-bottom: 1px solid #cccccc;
                    transform: skewY(30deg);
                    content: '';
                }
            }
            .active-version{//中间 属性 高显
                .item-version{//属性
                      background: #fff;
                    color: #fc3439;
                     z-index: 15;
                    &::after{
                        background: #fff;
                    }
                }
                .item-property::after{//目录
                    background: #fff;
                }
                .item-version-3{//版本
                    z-index: 10;
                }
            }
            .active{//上边 目录 高显
                .item-property{
                      background: #fff;
                      color: #fc3439;
                }
                 .item-version{
                    z-index: 15;
                }
                  .item-version-3{
                      z-index: 10;
                }
            }
            .active-version-3{//下边 版本 高显
                .item-version{
                     z-index: 15;
                    &::after{
                        background: #fafafa;
                    }
                }
                .item-property::after{
                    background: #fff;
                }
                .item-version-3{
                    z-index: 10;
                      background: #fff;
                    color: #fc3439;
                    &::after{
                        background: #fff;
                    }
                }
            }
            
        }
        
    }
    #box-right{
        padding: 19px 13px 0 10px;
        margin-left:24px;
        #basicAttributes{
            display: none;
            >li:last-of-type{
                padding-bottom: 7px;
            }
        }
        #BindingArtifacts{
            display: none;
        }
        .header-attribute{
            font-size: 14px;
            color: #333333;
            line-height: 14px;
            padding-bottom:4px;
            border-bottom: 1px solid #e6e6e6;
            text-align: left; 
            .trrangle{
                display: inline-block;
                width: 0px;
                height: 0px;
                border-left: 10px solid #fc3439;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
            }
            .icon-dropDown{
                display: block;
                width: 12px;
                height: 12px;
                background:url('./images/arror.png')no-repeat 0 0; 
                float: right;
                cursor: pointer;
                transition:  all ease .2s;
                transform: rotate(180deg);
            }
            .active{
                transform: rotate(0deg);
            }
        }
        .header-attribute:last-of-type{
            margin-top: 30px;
        }
        .detial-item{
            font-size: 12px;
            line-height: 12px;
            margin-top: 16px;
            text-align: left;
            .detial-text-name{
                color: #999999;
                width: 65px;
                float: left;
            }
            .detial-text-value{
            float: left;
            color: #333333;
            max-width: 130px;
            // overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            }
            &:first-of-type{
                margin-top: 18px;
            }
        }
    }
    #box-right-1{ 
        .head{
            padding: 11px 0 12px;
            height: 48px;
            margin-left:20px;
            border-bottom: 1px solid #cccccc;
            position: relative;
                .icon-goujian{
                float: left;
                width: 16px;
                height: 16px;
                cursor: pointer;
                margin-top: 6px;
                }
                .icon-download{
                    background: url('./images/download.png')no-repeat 0 0;
                    margin-left: 14px;
                    &:hover{
                        background: url('./images/download1.png')no-repeat 0 0;
                    }
                }
                .icon-search{
                    background: url('./images/search.png')no-repeat 0 0;
                    margin-left: 10px;
                    &:hover{
                        background: url('./images/search1.png')no-repeat 0 0;
                    }
                    }
                .inp-search{
                    width: 96px;
                    border-radius: 2px;
                    height: 24px;
                    border: 1px solid #e6e6e6;
                    position: relative;
                    background: #fafafa;
                    padding-left:10px;
                    padding-right:20px;
                    box-sizing: border-box;  
                    margin-right: 15px;
                    float: right;
                }
                .icon-sanjiao{
                    display: block;
                    position: absolute;
                    width: 12px;
                    height: 7px;
                    background-image:url('../Settings/images/sanjiao.png');
                    background-size: 100% 100%;
                    content: '';
                    top: 20px;
                    right: 22px;
                }
        }
        .item-version{
            margin:10px 15px 0 30px;
            border-bottom: 1px solid #e6e6e6;
            .img{
                float: left;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #ededed;
                margin-right:10px; 
            }
            .versin-detial{
                float: left;
                width: 150px;
                height: auto;
                position: relative;
                .user-name{
                    display: block;
                    color: #333333;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                    line-height: 22px;
                }
                .version-number{
                    display: block;
                    position: absolute;
                    min-width: 45px;
                    color: #fc3439;
                    font-size: 12px;
                    top: 0;
                    right: 0;
                    text-align: right;
                }
                .version-des{
                    font-size: 12px;
                    line-height: 18px;
                    padding: 3px 10px;
                    color: #666666;
                    background: #fafafa;
                    margin-top: 6px;
                }
            }
            .item-date{
                display: block;
                font-size: 12px;
                color: #cccccc;
                line-height: 12px;
                margin: 12px 0 11px;
                text-align: left;
            }
        }
    }
    .box-right-avtive{
        width: 2%;
        transition: all ease .5s;
    } 
}





</style>

