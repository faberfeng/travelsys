<template>
<div id="attributeManager" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">图<br>纸</span>
                        <span class="item-version " @click="screenLeft.item = 2">联<br>系<br>人</span>
                        <span class="item-version-3 " @click="screenLeft.item = 3;">属<br>性</span>
                    </div>
                </div>
                <div id="item-box-file">
                    <router-link :to="'/Design/management'" class=" label-item">  
                     设计协调  
                    </router-link>
                    <router-link :to="'/Design/attributeManager'"  class="label-item label-item-active">  
                        属性管理  
                    </router-link>
                    <router-link :to="'/Design/designversion'"  class="label-item">  
                        设计版本  
                    </router-link>
                </div>
                <div id="containerMessage">
                    <p class="header clearfix">
                        <span class="title">设计协同</span>
                        <span class="item-upload" @click="editAttribute">新建主题</span>
                    </p>
                    <div class="ForumSelector">
                        <span class="name">筛选条件</span>
                        <ul>
                                <!-- options_monomer:[],//单体选项
                                options_status:[],//状态选项
                                options_about:[],//相关选项 -->
                            <li class="selectItem">
                                <span class="title">单体</span>
                                <el-select v-model="value_monomer" placeholder="请选择">
                                    <el-option
                                    v-for="item in options_monomer"
                                    :key="item.id"
                                    :label="item.Name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </li>
                            <li class="selectItem">
                                <span class="title">状态</span>
                                <el-select v-model="value_status" placeholder="请选择">
                                    <el-option
                                    v-for="item in options_status"
                                    :key="item.id"
                                    :label="item.Name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </li>
                            <li class="selectItem">
                                <span class="title">相关</span>
                                <el-select v-model="value_about" placeholder="请选择">
                                    <el-option
                                    v-for="item in options_about"
                                    :key="item.id"
                                    :label="item.Name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </li>
                        </ul>
                    </div>
                    <div class="project">
                        
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div v-if="screenLeft.item == 1" class="screenRight_1">
               111
            </div>
        </div>
</div>       
</template>
<style  lang='less'>
    #attributeManager{
        /*
            修改eleUI树形组件
        */
        .is-leaf:before{
            content: ""!important;
            color: #999999;
            font-weight: bold;
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        li{
            list-style: none;
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
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
        .upInput{
            display: none;
        }
        #edit{ 
             .inp-search{
                width: 200px;
                height: 38px;
                border: 1px solid #d1d1d1;
                border-radius: 2px;
                background: #fafafa;
                padding-left: 10px;
            }
            .el-dialog{
            margin: 0 auto;
            .upInput{
                display: none;
            }
            /* 上传文件按钮 */
            .imageBody{
            text-align: left;
            }
            .el-radio__label{
                padding-left: 10px;
                padding-right: 10px;
            }
            .imageBody .imageBodyText{
                color: #666;
                font-size: 14px;
                line-height: 14px;
                font-weight: normal;
                display: inline-block;
                width: 175px;
                padding-left: 94px;
                text-align: left;
            }
            .updataImageSpan{
                overflow: hidden;
                width: 98px;
            }
            .updataImageSpan input{
                position: absolute;
                left: 0px;
                top: 0px;
                opacity: 0;
                /* -ms-filter: 'alpha(opacity=0)'; */
            }
            .selectionBox{
                margin: 10px 50px;
                border:1px solid #cccccc;
                padding: 20px;
                p{
                    text-align: left;
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                }
            }
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
                    content: '';
                }
            }
            .active{
                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
            }
            .yingsheProject{
                overflow: hidden;
                margin-bottom: 10px;
            }
            .yingsheProjectText{
                color: #999;
                display: block;
                float: left;
                margin-left: 30px;
                font-size: 14px;
                line-height: 36px;
            }
            .yingsheProjectBtn{
                float: right;
                margin-right: 30px;
                line-height: 36px;
            }
         }
         .uploadBox .el-dialog__body{
                margin-top: 21px;
                .fileContainer{
                    width: 600px;
                    margin: 0px 30px;
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                        background: #f8f8f9;
                        th{
                            padding-left: 10px;
                            height: 40px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    tbody{
                        tr{
                            td{
                                padding-left: 5px;
                                padding-right: 5px;
                                height: 40px;
                                text-align: left;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #333333;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                position: relative;
                                input,select{
                                    float: left;
                                    width: 100%;
                                    height: 32px;
                                    border: 1px solid #d1d1d1;
                                    border-radius: 2px;
                                    background: #fafafa;
                                    padding-left: 10px;
                                }
                                .icon-sanjiao{
                                    display: block;
                                    position: absolute;
                                    width: 12px;
                                    height: 7px;
                                    background-image:url('../Settings/images/sanjiao.png');
                                    background-size: 100% 100%;
                                    content: '';
                                    top: 16px;
                                    right: 11px;
                                }
                            }
                            &:hover{
                                background: #fafafa;
                            }
                        }
                    }
                }
                .actionBtn{
                    width: 16px;
                    height: 16px;
                    border: none;
                    cursor: pointer;
                    margin-right: 16px;
                    margin-top:9px;
                }
                .editBtn{
                    background: url('../../assets/edit.png') no-repeat;
                }
                .deleteBtn{
                    background: url('../../assets/delete.png') no-repeat;
                }
         }
        }
        .box-left-container{
            display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 225px;
            z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;
            #center-selection{
                position: fixed;
                top: 115px;
                // bottom: 0;
                right: 225px;
                width: 25px;
                z-index: 100;
                transition: all ease .5s;
                background: #ffffff;
                .SH_right{
                    width: 25px;
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
                        background: url('../ManageCost/images/right.png')no-repeat 0 0;
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
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -9px;
                        width: 24px;
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
                    height: 68px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
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
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
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
            #containerMessage{
                padding-left:30px; 
                .header{
                    text-align: left;
                    margin: 15px 0;
                    .title{
                        font-size: 14px;
                        float: left;
                        color: #fc3439;
                        font-weight: bold;
                    }
                    .item-upload{
                        float: right;
                        margin-right: 30px;
                        background: #fc3439;
                        color: #ffffff;
                        font-size: 12px;
                        height: 26px;
                        border-radius: 2px;
                        text-align: left;
                        line-height: 26px;
                        padding-left: 42px;
                        padding-right: 16px;    
                        position: relative;
                        cursor: pointer;
                        &::before{
                            display: block;
                            position: absolute;
                            top: 8px;
                            left: 19px;
                            width: 12px;
                            height: 11px;
                            content: '';
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    height: 40px;
                    color: #999999;
                    font-size: 12px;
                    margin-right: 30px;
                    .name{
                        float: left;
                        width: 96px;
                        height: 38px;
                        line-height: 38px;
                        text-align: left;
                        padding-left: 10px;
                        background: #fafafa;
                    }
                    >ul{
                        float: left;
                        .selectItem{
                            float: left;
                            .title{
                                padding: 0 15px 0 30px;
                                height: 38px;
                                line-height: 38px;
                            }
                            .el-select{
                                .el-input__inner{
                                    border:none;
                                    width: 100px;
                                    color:#333333;
                                    height: 38px;
                                }
                            }
                           
                        }
                        .selectItem:first-of-type .el-select .el-input__inner{
                            width: 170px;
                        }
                    }
                }
            }
        }
        .box-left-avtive{
            right: 0px;
            transition:  all ease .5s;
            #center-selection{
                right: 0;
                transition: all ease .5s;
            }
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
        /*
        右侧
        */
        .box-right-container{
            display: block;
            position: fixed;
            right: -225px;
            bottom: 0;
            width: 225px;
            top: 116px;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            border-left:none;
            z-index: 1000;
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 10px;
                border-bottom: 1px solid #e6e6e6;
                .noTop{
                    top: 12px!important;
                }
                >p{
                    padding-bottom:5px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom:10px;  
                }
                .icon-goujian{
                    float: left;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
            }
        }
        .box-right-avtive{
            right: 0;
            transition: all ease .5s;
            border-left: 1px solid #cccccc;
        }
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
        width:10px;
        height: 10px;
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
    }
</style>
<script>
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'

export default {
  name:'Costover',
  components:{
        
  },
  data(){
      return {
         screenLeft:{
             show:true,
             item:1,
         },
         token:'',
         entId:'',//公司ID
         projId:'',
         userId:'',
         defaultSubProjId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         checkedItem:{},//选中的file
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        checkFileDir:{},//选中的文件夹信息
        PointFigure:{
            renameshow:false,
            oldname:'',//这是点位图的旧名称
            newname:'',//点位图新名称
            fgID:''
        },
        editDrawing:{
            renameshow:false,
            dId:'',
            dcode:'',//这是点位图的旧名称
            dname:'',//点位图新名称
            dscale:''
        },
        expandedKeys:[],
        fileName:{
            show:false,
            newFileName:'',
            currentFileName:'',
            title:'',
            new:true
        },
        /*以下为后期添加数据*/
        options_monomer:[],//单体选项
        options_status:[
            {
                id:'-1',
                Name:'全部状态'
            },{
                id:'1',
                Name:'正在处理'
            },{
                id:'2',
                Name:'解决完成'
            },{
                id:'3',
                Name:'终结讨论'
            }
        ],//状态选项
        options_about:[
            {
                id:'-1',
                Name:'全部讨论'
            },{
                id:'1',
                Name:'由我发表'
            },{
                id:'2',
                Name:'有我评论'
            },{
                id:'3',
                Name:'有提到我'
            },
            {
                id:'4',
                Name:'我的收藏'
            }
        ],//相关选项
        showAction:false,
        IsFolderAction:null,
        value_monomer: '',//单体 筛选关键词
        value_status: '-1',//单体 筛选关键词
        value_about: '-1',//单体 筛选关键词
        CommunicationList:[],//消息流列表
        drawingsUploadShow:false,//添加图纸弹窗的显隐
        fileList:[],//即将上传的文件集合
        selectContact:{
            show:false,
            infoShow:false,
            infoObj:{},
            obj:{}
        },
        contacts:[],//联系人列表数组
        posId:'',//因项目而不同
        pageNo:1,//评论页数
        pageTotal:0,//评论总个数
        projAuth:[],//当前用户的权限列表
        canEditMes:false,//当前用户可以修改消息状态
        canDeleteMes:false,//当前用户可以删除消息
        dcStatus:{
            show:false,
            val:'2',
            obj:{}
        },
        CommentList:[],//评论列表
        siteHolderId:'',//holderID
        fullscreenLoading:false,
        entType:'',
        hasAuthDelUser:false,
      }
  },
  created(){
        var vm = this
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.projAuth = localStorage.getItem('projAuth')
        vm.entType = localStorage.getItem('entType')
       
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
    },
  watch:{
    //   <!-- options_monomer:[],//单体选项
    //     options_status:[],//状态选项
    //     options_about:[],//相关选项 -->
      value_monomer:function(val){
            var vm = this 
      },
       value_status:function(val){
            var vm = this 
      },
       value_about:function(val){
            var vm = this 
      },
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
  },
  methods:{
      editAttribute(){
          var vm = this
      },
      trim(str){ 
        /**去掉字符串前后所有空格*/
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
      },
      getContacts(){
          var vm = this
          axios({
              method:'POST',
              url:vm.BDMSUrl+'project2/dc/searchDcProjectUserList',
              headers:{
                  'token':vm.token
              },
              params:{
                  projId:vm.projId,
                  condition:'',
                  ugId:vm.selectUgId
              }
          }).then((response)=>{
              if(response.data.cd == 0){
                vm.contacts = response.data.rt
              }
          }).catch((err)=>{
              console.log(err)
          })
      },
  }
}
</script>