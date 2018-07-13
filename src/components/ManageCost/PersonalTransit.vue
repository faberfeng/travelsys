<template>
<div>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/Drive/costover'" class=" label-item">  
                    最近文档  
                    </router-link>
                    <router-link :to="'/Drive/cloudDrive'" class=" label-item">  
                    工程云盘  
                    </router-link>
                    <router-link :to="'/Drive/Share'" class=" label-item">  
                        已经分享  
                    </router-link>
                    <router-link :to="'/Drive/PersonalTransit'" class="label-item label-item-active">  
                        个人中转  
                    </router-link>
                    <div class="item-search">
                        <span class="title-right">
                            <input type="text" v-model="fileSearchInfo" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="getInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                        </span>
                        <span class="icon-type" @click="listStyle = (listStyle == 'card'?'table':'card')"></span>
                    </div>
                </div>
                <p class="select-header clearfix">
                        <label :class="[checkAll?'active':'','checkbox-fileItem']" for="allfile" @click="initAll()"></label>
                        <input type="checkbox" id='allfile' class="el-checkbox__original" v-model="checkAll">
                        <ul class="operation">
                            <li class="item icon icon-paste"  @click="paste" v-if="hasFileToPaste.is" v-loading.fullscreen.lock="fullscreenLoading">粘贴</li>
                            <li class="item icon icon-copy" v-if="checkOne" @click="copyfile()">复制</li>
                            <li class="item icon icon-delete"  @click="deleteFile">删除</li>
                        </ul>
                        <span class="button-download" @click="downloadFile">下载</span>
                </p>
                <div id="file-container" v-if="listStyle == 'card'">
                    <ul class="clearfix" style="padding: 0px 10px 15px 20px;">
                        <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in fileList" :key="index"  @click="checkItem(index)">
                            <label :class="[item.checked?'active':'','checkbox-fileItem']" @click.stop="checkItem(index,true)"></label>
                            <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                            <div class="item-file-box clearfix">
                                <span  class="item-file-image">
                                <img :src="require('./images/icon/'+item.icon)" />
                                </span>
                                <span  class="item-file-detial">
                                    <h3 v-text="item.fgName"></h3>
                                    <p>来自工程【<span class="text-name" v-text="item.fileExtension"></span>】</p>
                                    <p v-text="initData(item.updateTime)"></p>
                                    <p class="operation">
                                        <span v-text="'版本'+item.version"></span>
                                        <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                        <i class="icon-goujian icon-download" @click="downLoad(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                    </p>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="file-container-table" v-else>
                    <table class="UserList" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th style="width:55px;"></th>
                                <th style="min-width:428px;">文件名</th>
                                <th style="width:70px;"></th>
                                <th style="width:50px;">类型</th>
                                <th style="width:40px;">版本</th>
                                <th style="min-width:60px;">来源</th>
                                <th style="min-width:150px;">更新时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in fileList" :key="index" :class="[{'active':item.checked}]" @click="checkItem(index)">
                                <td>
                                    <label :class="[item.checked?'active':'','checkbox-fileItem']" @click.stop="checkItem(index,true)"></label>
                                    <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                                </td>
                                <td>
                                    <img :src="require('./images/icon/'+item.icon)" />
                                    <span v-text="item.fgName"></span>
                                </td>
                                <td>
                                    <i class="icon-goujian icon-download" @click="downLoad(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                    <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                </td>
                                <td v-text="splitType(item.icon)"></td>
                                <td v-text="item.version"></td>
                                <td v-text="item.fileExtension"></td>
                                <td v-text="initData(item.updateTime)"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
</div>
</template>
<style scoped lang='less'>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .show{
        display: block!important;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .box-left-container{
        display: block;
        position: fixed;
        overflow-x: hidden;
        top: 115px;
        left: 26px;
        bottom: 0;
        right: 0;
        transition:  all ease .5s;
        overflow: auto;
         .title-right{
            float: left;;
            width: 214px;
            height: 30px;
            margin-right: 10px;
            position: relative;
            .title-right-icon{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:40px;
                margin-right: 5px;
                outline: none;
                &:focus{
                      background: #ffffff;  
                }
            }
            .el-icon-search{
                position: absolute;
                right: 10px;
                top: 8px;
            }
        }
        .item-search{
            position: absolute;
            display: block;
            right: 35px;
            top: 10px;
            width: auto;
            .icon-type{
                float: left;
                width: 30px;
                height: 30px;
                border: 1px solid #cccccc;
                background: #f2f2f2;
                position: relative;
                cursor: pointer;
                border-radius: 2px;
                &::after{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 5px;
                    width: 18px;
                    height: 13px;
                    background: url('./images/type.png')no-repeat 0 0;
                    content: '';
                }
                &:hover{
                      background: #fff6f7;
                }
            }
        }
        .select-header{
                padding: 15px 10px 0px 20px;
                  .checkbox-fileItem{
                    float: left;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                    margin-right: 5px;
                    position: relative;
                    &::after{
                        font-size:12px;
                        color:#cccccc;
                       display: block;
                       position: absolute;
                       right: -30px;
                       top: 0;
                        line-height:12px;
                        content: '全部';
                    }
                }
                 .operation{
                    float: right;
                    margin-right: 35px;
                    .item{
                        float: left;
                        border-top: 1px solid #cccccc;
                        border-bottom: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        &:first-of-type{
                            border-left: 1px solid #cccccc;
                            border-top-left-radius: 2px;
                            border-bottom-left-radius: 2px;
                        }
                        &:last-of-type{
                            border-top-right-radius: 2px;
                            border-bottom-right-radius: 2px;
                        }
                        &:hover{
                            background:  #fff6f7;
                        }
                    }
                    .icon{
                        cursor: pointer;
                        position: relative;
                        &::after{
                            display: block;
                            position: absolute;
                            top: 6px;
                            left: 22px;
                            width: 14px;
                            height: 14px;
                            content: '';
                        }
                    }
                    .icon-paste{
                         &::after{
                              background: url('./images/pasteBlack.png') no-repeat 0 0;
                         }
                    }
                    .icon-copy{
                        &::after{
                      background: url('./images/copyBlack.png') no-repeat 0 0;
                        }
                    }
                    .icon-delete{
                        &::after{
                      background: url('./images/deleteBlack.png') no-repeat 0 0;
                        }
                    }
                }
                .icon{
                    float: left;
                    width: 99px;
                    height: 26px;
                    line-height: 26px;
                    text-align: left;
                    font-size: 12px;
                    color: #333333;
                    position: relative;
                    padding-left:45px; 
                    cursor: pointer;
                    &:hover{
                        background: #fff6f7;
                    }
                    
                }
                .active{
                    background: url('./images/checked.png') no-repeat 1px 2px;
                     border: 1px solid #fc3439;
                }
            }
        .select-header{
            text-align: left;
            .el-checkbox{
                float: left;
            }
            .button-download{
                float: right;
                width: 52px;
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: #333333;
                text-align: center;
                border: 1px solid #cccccc;
                border-radius: 2px;
                cursor: pointer;
                margin-right:25px; 
                &:hover{
                    background: #fff6f7;
                }
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
                    .item-file-detial{
                        display: block;
                        margin-left:80px; 
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
                            margin-bottom:6px; 
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
        #file-container-table{
           
            .UserList{
                border-collapse: collapse;
                thead{
                    border-bottom: 1px solid #d9d9d9;
                    th{
                        height: 32px;
                        text-align: left;
                        font-size: 12px;
                        color: #999999;
                        font-weight: normal;
                    }
                }
                tbody{
                    tr{
                        td{
                            height: 54px;
                            text-align: left;
                            box-sizing: border-box;
                            font-size: 14px;
                            color: #333333;
                            border-bottom: 1px solid #f2f2f2;
                            .checkbox-fileItem{
                                display:block;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #cccccc;
                                cursor: pointer;
                                margin-left: 20px;
                            }
                            .active{
                                background: url('./images/checked.png') no-repeat 1px 2px;
                                border: 1px solid #fc3439;
                            }
                            img{
                                height: 18px;
                                float: left;
                                margin-right: 7px;
                            }
                            .icon-goujian{
                                float: left;
                                display: none;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                            }
                            .icon-download{
                                background: url('./images/download.png')no-repeat 0 0;
                                margin-right:20px; 
                                &:hover{
                                    background: url('./images/download1.png')no-repeat 0 0;
                                }
                            }
                            .icon-search{
                                background: url('./images/search.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/search1.png')no-repeat 0 0;
                                }
                            }
                        }
                        &:hover{
                            background: #fafafa;
                            .icon-goujian{
                                display: inline-block;
                            }
                        }
                    }
                    .active{
                        td{
                            background: #fafafa;
                             .icon-goujian{
                                display: inline-block;
                            }
                             .icon-download{
                                background: url('./images/download1.png')no-repeat 0 0;
                            }
                            .icon-search{
                                background: url('./images/search1.png')no-repeat 0 0;
                            }
                        }
                    }
                }
            }
        }
    }
    .box-left-avtive{
         right: 0px;
          transition:  all ease .5s;
          .icon-right{
              transform: rotateZ(180deg)!important;
              transition: all ease .5s;
          }
    }
    .el-main{
        padding: 0;
    }
    #item-box-file{
        display: block;
        border-bottom: 1px solid #e6e6e6;
        height: 49px;
        padding-top: 16px;
        padding-left:20px; 
        background: #fafbfc;
        position: relative;
    }
    .label-item{
        float: left;
        height: 34px;
        font-size: 14px;
        width:106px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        border-top: 3px solid #fafbfc;
        color: #999999;
        text-decoration: none;
    }
    .label-item-active{
        color: #fc3439;
        font-weight: bold;
        border-top: 3px solid #fc3439;
        border-left: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #fff;
        background: #ffffff;
    }
     /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
    width:7px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
    box-shadow:inset 006px rgba(0, 0, 0, .5);
    -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
    border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
    border-radius:10px;
    background:rgba(0,0,0,0.1);
    box-shadow:inset 006px rgba(0, 0, 0, .5);
    -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
    background:rgba(255,0,0,0.4);
    }
    /*********************/
</style>
<script>
import axios from 'axios'
import '../Settings/js/jquery-1.4.4.min.js'
import './js/date.js'
export default {
  name:'Costover',
  data(){
      return {
        activeIndex:'1',
         tabShow:1,
         listStyle:'table',//列表展示方式
         fileSearchInfo:'',//查询文件名称
         checkAll: false,
         isIndeterminate: false,
         fileList:[],//文件列表
         screenLeft:{
             show:true,
             item:1,
         },
         pageDetial:{
              pagePerNum:30,//一页几份数据
              currentPage:1,//初始查询页数 第一页
              total:0,//所有数据
          },
         token:'',
         projId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         checkedItem:{},//选中的file
         GouJianItem:{},//选中file的构件
         versionItem:{},//选中file的版本信息
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
         posType:'',//versionType
        hasFileToPaste:{
            is:false,
            obj:{}
        },//session存在可以粘贴的文件
        checkOne:false,
        fullscreenLoading:false,
      }
  },
  created(){
      var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
         vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.checkedPermission()
        vm.checkFilePaste()
  },
  watch:{
      'show.basicAttributes':function(val){
          if(val){
            $("#basicAttributes").show(200);
          }else{
            $("#basicAttributes").hide(200);
          }
      },
     'show.BindingArtifacts':function(val){
          if(val){
            $("#BindingArtifacts").show(200);
          }else{
            $("#BindingArtifacts").hide(200);
          }
      },
      posType:function(){
          var vm = this
          vm.getVersion()
      }
  },
  methods:{
      initAll(){
          var vm = this
        if(!vm.checkAll){
            vm.checkAll = true
            vm.fileList.forEach((item,key)=>{
                vm.$set(item,'checked',true)
            })
          }else{
            vm.checkAll = false
            vm.fileList.forEach((item,key)=>{
                vm.$set(item,'checked',false)
            })
          }
      },
      paste(){
        var vm = this
        vm.fullscreenLoading = true
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/addFileToTransfer',
            headers:{
                'token':vm.token
            },
            params:{
                fgIdListStr: vm.hasFileToPaste.obj.fgIds,
                ugId:vm.hasFileToPaste.obj.oldUgId,
                dirId:vm.hasFileToPaste.obj.dirId, //ugid是群组ID
                projId: vm.projId,
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                sessionStorage.removeItem('fileObject')
                vm.getInfo()
            }
            vm.checkFilePaste()
            vm.fullscreenLoading = false
        }).catch((err)=>{
            console.log(err)
        })
      },
      checkFilePaste(){
            var vm = this
            vm.hasFileToPaste.is = false
            vm.hasFileToPaste.obj = {}
            var filePaste = JSON.parse(sessionStorage.getItem('fileObject'))
            /***
             * @param    fileObject = {
                fgIds: fgIdList,
                dirId: vm.checkFileDir.nodeId,//当前文件夹ID
                oldUgId:vm.selectUgId, //ugid是群组ID
                projId: vm.projId,
                fcIds: fcIdList
             };
             * 
             * **/
            if(filePaste){//不能 粘贴 剪切的文件 ,不支持剪切
                if(filePaste.shear || filePaste.fcIds != '' || filePaste.from != ''){
                    vm.hasFileToPaste.is = false
                    vm.hasFileToPaste.obj ={}
                }else{
                    vm.hasFileToPaste.obj = filePaste
                    vm.hasFileToPaste.is = true
                }
            }
      },
      copyfile(){
        // 复制内容到剪贴板
        var vm = this
        var msg = '复制'
        var fileObject = {}
        var fgIdList = ''
        var dirId = ''
        vm.fileList.forEach((item,key)=>{
            if(item.checked){
                if(fgIdList == ''){
                        fgIdList = item.fgId
                }else{
                    fgIdList += ','+item.fgId
                }
                if(dirId == ''){
                        dirId = item.dirId
                }else{
                    dirId += ','+item.dirId
                }
            }
        })
        if(fileObject){
            var fileObject = {
                fgIds: fgIdList,
                dirId: dirId,//当前文件夹ID
                oldUgId:'', //ugid是群组ID
                projId: vm.projId,
                fcIds: '',
                shear:false,
                from:'PersonalTransit'//来自个人中转
            }
            sessionStorage.setItem("fileObject", JSON.stringify(fileObject)); 
            vm.$message({
                type:'success',
                message:msg+'成功'
            })
            vm.checkFilePaste()
        }else{
            vm.$message({
                type:'error',
                message:msg+'失败'
            })
        }
      },
      parseMStatus(mStatus){
            // 施工现场
            var constructionSite = mStatus.substring(0, 1);
            switch (constructionSite) {
                case '8':
                    return '终审驳回';
                case '7':
                    return '终审通过';
                case '6':
                    return '终审补充';
                case '5':
                    return '等待终审';
                case '4':
                    return '初审驳回';
                case '3':
                    return '初审通过';
                case '2':
                    return '初审补充';
                case '1':
                    return '等待初审';
                default:
                    break;
            }
            // 进度计划
            var scheduledPlan = mStatus.substring(1, 2);
            switch (scheduledPlan) {
                case '3':
                    return '已完工';
                case '2':
                    return '已开工';
                case '1':
                    return '已计划';
                default:
                    break;
            }
            // 物资采购
            var materialPurchasing = mStatus.substring(2, 3);
            switch (materialPurchasing) {
                case '9':
                    return '已签收';
                case '8':
                    return '已抽检';
                case '7':
                    return '已到场';
                case '6':
                    return '已发货';
                case '5':
                    return '已待发';
                case '4':
                    return '生产中';
                case '3':
                    return '已订货';
                case '2':
                    return '已选型';
                case '1':
                    return '待选型';
                default:
                    break;
            }
            // 成本管理
            var costControl = mStatus.substring(3, 4);
            switch (costControl) {
                case '6':
                    return '物料量核对完成';
                case '5':
                    return '物料量核对中';
                case '4':
                    return '工程量核对完成';
                case '3':
                    return '工程量核对中';
                case '2':
                    return '构件量核对完成';
                case '1':
                    return '构件量核对中';
                default:
                    break;
            }
            // 设计协调
            var designManage = mStatus.substring(4, 6);
            switch (designManage) {
                case 'A0':
                    return '施工图深化设计';
                case '70':
                    return '施工图设计';
                case '40':
                    return '初步设计';
                case '10':
                    return '方案设计';
                case '00':
                    return '未定义';
                default:
                    return '未定义';
            }
      },
    splitType(val){
          return val.split('.')[0]
      },
      initData(val){
          if(!val)return ''
          var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
          return tt; 
      },
      /**
         * 预览文件集文件
         * @param fileUuid
         */
    view(filePath,fileId,fileName,fgId){
        //latestFile(fileId,fgId,"预览了文件"+fileName);
          var vm = this
           if(!filePath){
             vm.$message({
                type:'info',
                message:'请勾选要预览的文件'
            })
            return false
        }
        window.open(vm.QJFileManageSystemURL+filePath+"/preview");
    },
    downLoad(filePath, fileId, fileName,fgId){
        //latestFile(fileId,fgId,"下载了文件"+fileName);
        var vm = this
          if(!filePath){
             vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
            return false
        }
        window.open(vm.QJFileManageSystemURL + filePath);
    },
    downloadFile(){
        var vm = this
        console.log(vm.fileList)
        var url = '/multiDownloadUrl?'
        var hasFilePath = false
        vm.fileList.forEach((item,key)=>{
            if(item.checked){
                hasFilePath = true
              url += 'urls='+item.filePath+'&'
            }
        })
        if(hasFilePath){
             vm.downLoad(url)
        }else{
            vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
        }
       
    },
     deleteFile(){//删除点位
        var vm = this
        var fgIdList = []
        vm.fileList.forEach((item)=>{
            if(item.checked){
                fgIdList.push(item.fgId)
            }
        })
        if(fgIdList.length == 0){
            vm.$message({
                type:'warning',
                message:'请勾选文件'
            })
            return false
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/delTransferStation',
            headers:{
                'token':vm.token
            },
            data:fgIdList
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.getInfo()
                vm.$message({
                    type:'success',
                    message:'文件删除成功'
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
    checkItem(val,isMultiSelect){
        var vm = this
        vm.show.basicAttributes =true
         vm.show.BindingArtifacts =true
        vm.checkedItem = {}
        var num = 0
        var checkList = []
        vm.checkAll = false
        if(isMultiSelect){
             vm.fileList[val].checked =  vm.fileList[val].checked?false:true
             vm.fileList.forEach((item)=>{
                if(item.checked){
                    num++
                    checkList.push(item)
                }
            })
            if(num == 0){
                vm.checkOne = false 
            }else{
                vm.checkOne = true
            }
            if(num == 1){
                vm.checkedItem = checkList[0]
            }else if(num == vm.fileList.length){
                vm.checkAll = true 
            }
        }else{
            for(var i=0;i<vm.fileList.length;i++){
                vm.fileList[i].checked = false
            }
            vm.fileList[val].checked = true
            vm.checkedItem = vm.fileList[val]
            vm.checkOne = true
        }
    },
    getVersion(){
         var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/getFileGroupVersionList',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:vm.checkedItem.fgId,
                versionType:vm.posType,
                docType:''//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.versionItem = response.data.rt == null?{}:response.data.rt
                console.log( vm.versionItem)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getGouJianInfo(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/'+vm.projId+'/entityRelation/list',
            headers:{
                'token':vm.token
            },
            params:{
                relaId:vm.checkedItem.fgId,
                relaType:1//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.GouJianItem = response.data.rt.relaList == null?{}:response.data.rt.relaList
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    changePage(val){//分页 0 -1 1 2
        var vm = this 
        console.log(val)
        if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
            vm.$message('这已经是第一页!')
            return false
        }else if(vm.pageDetial.currentPage == Math.ceil(vm.pageDetial.total%vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
            vm.$message('这已经是最后一页!')
            return false
        }else{
            switch(val){
                case 0:
                        vm.pageDetial.currentPage = 1
                    break;
                case -1:
                        vm.pageDetial.currentPage--
                    break;
                case 1:
                        vm.pageDetial.currentPage++
                    break;
                case 2:
                        vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total%vm.pageDetial.pagePerNum)
                    break;
            }
        }

    },
    checkedPermission(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/transferStation',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.getInfo()
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getInfo(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/searchTransferStationFileGroupInfo',
            headers:{
                'token':vm.token
            },
            params:{
                condition:vm.fileSearchInfo,//文件名称
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                if(response.data.rt.length>0){
                    vm.fileList = response.data.rt
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                    })
                }else{
                    vm.$message({
                        type:'info',
                        message:'未匹配到相应的数据'
                    })
                    vm.fileList = []
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    handleCheckAllChange(value){
        console.log(value)
    }
  }
}
</script>



