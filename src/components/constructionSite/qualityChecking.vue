<template>
    <div id="qualityChecking">
            <div class="topHeader">
                <div id="item-box-file">
                    <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/constructionSite/qualityChecking'" class="label-item label-item-active">  
                    质量检查
                    </router-link>
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                    安全检查  
                    </router-link>
                </div>
                <div id="containerMessage"  v-show="isShowQualityCheckAuth">
                   <div class="ForumSelector">
                        <span class="name">筛选条件</span>
                        <ul>
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
                        <p class="header">
                            <span class="item-upload" @click="sendChange">发起整改</span>
                        </p>
                    </div>
                <div class="checkName" v-show="showName">{{'[检查类型]'+'-'+checkTypeValue}}</div>
                <sendMes :showBox="goingToSend" :dcid="''" :iscomment="true"  :selectugid="ugId" :holderid="value_monomer" v-on:showNameHide="showHide" :checkTypeName='checkTypeValue' :dirId='checkTypeId'   v-on:hide="hideSendMes" v-on:refresh='getCommunicationList' ></sendMes>
                 <!-- <div style="margin:200px auto" v-show="dataShow">
                        <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                        <p style="font-size:16px;color:#ccc">暂无数据</p>
                </div> -->
                <div class="project" v-loading="loading">
                        <ul class="projectList">
                            <li v-for="(item,index) in CommunicationList" :key="index">
                                <div class="projectListInfo">
                                    <div class="projectListImg">
                                        <img :src="item.createUserImg != ''?(QJFileManageSystemURL+item.createUserImg):require('../../assets/people.png')">
                                    </div> 
                                    <div class="projectListText">
                                        <span class="action_rightBox">
                                            <span class="icon-finish" v-if="canEditMes && item.dcStatus == 8" @click="updateStatus(item.dcId,9,'提交',index)">提交</span>
                                            <span class="icon-reconsider" v-if="canEditMes && item.dcStatus == 9" @click="updateStatus(item.dcId,0,'检查',index)">检查</span>
                                            <span class="icon-finish" v-if="canEditMes && item.dcStatus == 10" @click="updateStatus(item.dcId,9,'提交',index)">提交</span>
                                            <span class="icon-delete" v-if="canDeleteMes" @click="deleteMes(item.dcId,index)"></span>
                                        </span>
                                        <p class="projectListTextName">{{item.createUserStr}}</p>
                                        <p class="font-color1" v-html="item.dcContent"></p>
                                        <ul class="clearfix" style="padding: 0px 0px 2px 2px;">
                                            <li :class="['item-file']" v-for="(val,key) in item.fileList" :key="key+'file'">
                                                <div class="item-file-box clearfix">
                                                    <span  class="item-file-image">
                                                        <img :src="checkIcon(val.fileExtension.toUpperCase())?require('../ManageCost/images/icon/'+val.fileExtension.toUpperCase()+'.png'):''" />
                                                    </span>
                                                    <span  class="item-file-detial">
                                                        <h3 v-text="val.fileName"></h3>
                                                        <p>由<span class="text-name" v-text="val.uploadUser"></span><span v-text="item.from"></span>上传</p>
                                                        <p v-text="initData(val.uploadTime)"></p>
                                                        <p class="operation">
                                                            <span v-text="'版本'+val.version"></span>
                                                            <i class="icon-goujian icon-search" @click="preview(val.filePath)"></i>
                                                            <i class="icon-goujian icon-download" @click="downLoad(val.filePath)"></i>
                                                        </p>
                                                    </span>
                                                </div>
                                            </li>
                                            <li :class="['item-file']" v-for="(val,key) in item.attachList" :key="key+'attach'" style="padding:0;overflow: hidden;">
                                                <img :src="QJFileManageSystemURL+val.relativePath" :title="val.fileName" class="item-file-attach"/>
                                                <div class="actionbox clearfix">
                                                    <i class="button-relocation" v-show="val.locationInfo"  @click="relocation(val.locationInfo)"></i>
                                                     <i class="line"></i>
                                                    <i class="button-search"  @click="preview(val.relativePath)"></i>
                                                    <i class="line"></i>
                                                    <i class="button-download" @click="downLoad(val.relativePath)"></i>
                                                </div>
                                            </li>
                                        </ul>
                                        <p class="projectBottom">
                                            <i class="icon-time"></i>{{initData(item.createTime)}}<label>{{item.from}}</label>
                                            <span class="action">
                                                <span v-text="'#'+item.sortId" style="cursor: auto;"></span>
                                                <span v-text="item.statusText" @click="item.showResponse = false;item.showFlowChart = !item.showFlowChart" :class="item.showFlowChart?'arrow':''"></span>
                                                <span v-text="item.collect?'取消收藏':'收藏'" @click="collect(item.dcId,item.collect,index)"></span>
                                                <span v-text="(item.showResponse?'收起':'展开')+'回复 ('+(item.reviewCount?item.reviewCount:0)+')'"  @click="getComment(item.dcId,index,item.showResponse,item.reviewCount,item.dcStatus,false,null)" :class="item.showResponse?'arrow':''"></span>
                                                <span v-text="item.reviewName" v-if="item.reviewName != null" style="cursor: auto;"></span>
                                            </span>
                                        </p>

                                        <!--下面是评论的代码-->

                                        <div class="comments" v-if="item.showResponse">
                                            <sendMes :showBox="(item.dcStatus==8||item.dcStatus==9)?true:false" :dcid='item.dcId' :keycomment="index" :iscomment="false" :selectugid="ugId" 
                                            :valuemonomer="value_monomer"  :valuestatus="value_status"   :valueabout="value_about"  
                                            v-on:hide="hideSendMes" v-on:refreshcomment="getComment(item.dcId,index,item.showResponse,item.reviewCount,true,$event)"></sendMes>
                                            <ul>
                                                <li v-for="(val,key) in CommentList" :key="key+'CommentList'" class="comments-item clearfix">
                                                    <img :src="val.rvUserImg != ''?(QJFileManageSystemURL+val.rvUserImg):require('../../assets/loginimg.png')" class="left">
                                                    <div  class="center">
                                                        <span class="icon-delete" v-if="val.editable"  @click="deleteComment(val.dcId,val.id,key,index)"></span>
                                                        <p class="head">
                                                            <span v-text="val.rvUserStr"></span>
                                                            <span v-text="initData(val.rvTime)"></span>
                                                            <span v-text="val.fromIn"></span>
                                                        </p>
                                                        <div class="detial">
                                                            <div v-html="val.rvContent"></div>
                                                        
                                                            <div>
                                                                <ul class="clearfix" style="padding: 0px 0px 0px 2px;">
                                                                    <li :class="['item-file']" v-for="(left,right) in val.fileList" :key="right+'file'">
                                                                        <div class="item-file-box clearfix">
                                                                            <span  class="item-file-image">
                                                                                <img :src="checkIcon(left.fileExtension.toUpperCase())?require('../ManageCost/images/icon/'+left.fileExtension.toUpperCase()+'.png'):''" />
                                                                            </span>
                                                                            <span  class="item-file-detial">
                                                                                <h3 v-text="left.fileName"></h3>
                                                                                <p>由<span class="text-name" v-text="left.uploadUser"></span><span v-text="val.fromIn"></span>上传</p>
                                                                                <p v-text="initData(left.uploadTime)"></p>
                                                                                <p class="operation">
                                                                                    <span v-text="'版本'+left.version"></span>
                                                                                    <i class="icon-goujian icon-search" @click="preview(left.filePath)"></i>
                                                                                    <i class="icon-goujian icon-download" @click="downLoad(left.filePath)"></i>
                                                                                </p>
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                    <li :class="['item-file']" v-for="(left,right) in val.attachList" :key="right+'attach'" style="padding:0;overflow: hidden;">
                                                                        <img :src="QJFileManageSystemURL+left.relativePath" :title="left.fileName" class="item-file-attach"/>
                                                                        <div class="actionbox clearfix">
                                                                            <i class="button-relocation" v-show="left.locationInfo"  @click="relocation(left.locationInfo)"></i>
                                                                            <i class="line"></i>
                                                                            <i class="button-search"  @click="preview(left.relativePath)"></i>
                                                                            <i class="line"></i>
                                                                            <i class="button-download" @click="downLoad(left.relativePath)"></i>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div> 

                                        <!--下面是流程图的代码-->
                                        <div class="flowCharts" v-if="item.showFlowChart">
                                            <ul class="clearfix">
                                                <li v-for="(val,key) in item.flowCharts" :key="key" class="flowChart-item">
                                                    <div class="top">
                                                        <span class="horizontalLineL"></span>
                                                        <span  :class="[val.nodeType == 1?'circle':'',val.nodeType == 2?'square':'',val.nodeType == 3?'diamond':'']"></span>
                                                        <span  class="horizontalLineR"></span>
                                                    </div>
                                                    <p v-text="val.userName+val.dcStatus" class="title_"></p>
                                                    <p v-text="initData(val.operateTime)" class="date"></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="pagenation" v-if="pageTotal>0">   
                            <el-pagination background layout="prev, pager, next" :total="pageTotal" :current-page.sync="pageNo" @current-change="changePage" @prev-click="changePage" @next-click="changePage"></el-pagination>
                        </div>
                    </div>

                </div>
            </div>
            <div id="edit">
                <el-dialog width="450px" title="检查类型选择" :visible.sync="checkTypeSelectDialog" @close="checkTypeSelectCancle">
                        <div class="tree">
                            <el-tree id="ugGroupTree" ref="ugGroupTree" highlight-current  node-key="id" :empty-text="'没有可选择的类型，请至文档管理建立所需的项目类型'" :data="CheckTypeSubDirList"  :props="defaultProps" @node-click="nodeClick" >
                            </el-tree>
                        </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="checkTypeSelectCancle">确定</button>
                        <button class="editBtnC" @click="checkTypeSelectMakeSure">取消</button>
                    </div>
                </el-dialog>
                <el-dialog width="400px" title="质量检查状态修改" :visible="dcStatus.show" @close="dcStatusCancle">
                    <div class="editBody">
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="dcStatus.val" label="10">继续整改</el-radio>
                        </div>
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="dcStatus.val" label="11">整改撤销</el-radio>
                        </div>
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="dcStatus.val" label="12">整改完成</el-radio>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="dcStatusConfirm">确定</button>
                        <button class="editBtnC" @click="dcStatusCancle">取消</button>
                    </div>
                </el-dialog>
            </div>
            
    </div>
</template>
<script>
import axios from 'axios'
import sendMes from'./sendChange.vue'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
export default {
    name:'qualityChecking',
    components:{
        sendMes
  },
    data(){
        return{
            dataShow:true,
            loading:true,
            token:'',
            projId:'',
            userId:'',
            defaultSubProjId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            /*以下为后期添加数据*/
            value_monomer:'',
            value_status: '-1',//单体 筛选关键词
            value_about: '-1',//单体 筛选关键词
            options_status:[
            {
                id:'-1',
                Name:'全部状态'
            },{
                id:'8',
                Name:'等待整改'
            },{
                id:'9',
                Name:'等待检查'
            },{
                id:'10',
                Name:'继续整改'
            },{
                id:'11',
                Name:'整改撤销'
            },{
                id:'12',
                Name:'整改完成'
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
        //质量检查进入信息
        qualityCheckList:'',
        checkTypeSelectDialog:false,
        entType:'',//权限类型
        isShowQualityCheckAuth:false,//是否有进入质量检查的权限
        showName:false,//显示名称
        CheckTypeSubDirList:'',//获取指定项目指定群组下的所有子文件夹
        CheckTypeSubDirList_original:'',//原始项目指定群组子文件
        ugId:'',
        defaultProps:{
            children:'children',
            label: 'text'
        },
        checkTypeId:'',
        checkTypeValue:'',
        str:'',
        goingToSend:false,//用户点击显示弹窗
        CommunicationList:[],//消息流
        pageNo:1,//评论页数
        pageTotal:0,//评论总个数
        canEditMes:true,//当前用户可以修改消息状态
        canDeleteMes:true,//当前用户可以删除消息
        dcStatus:{
            show:false,
            val:'10',
            obj:{}
        },
        }
    },
    created(){
        var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid')
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.qualityCheck();
        // vm.checkAuth();
        var timer = setInterval(function(){
            if(vm.defaultSubProjId != null){
                //进入质量检查获取信息
                clearInterval(timer);
            }else{
                vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
            }
        },100)

        // var timer = setInterval(function(){
        //     if(vm.defaultSubProjId != null){
        //         vm.getIntoDesignPage()//进入设计协调获取信息
        //         vm.getPosID()//获取posID，
        //         vm.checkAuth()//获取posID，
        //         vm.getFileTree()
        //         clearInterval(timer)
        //     }else{
        //         vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        //     }
        // },100)
        
    },
    mount(){

    },
    watch:{
        value_status:function(val){
            var vm = this 
            vm.getCommunicationList()//获取评论
        },
       value_about:function(val){
            var vm = this 
            vm.getCommunicationList()//获取评论
        },
    },
    filters:{

    },
    methods:{
        //检查图标
           checkIcon(val){
          var vm = this
          var iconArr = ['AVI','BMP','CAD','DOC','DOCX','FILE','GIF','GMD','JPG','MIDI','MP3','MPEG','PDF','PNG','PPT','PPTX','RAR','RVT','TIFF','TXT','WAV','WMA','XLS','XLSX']
          if(iconArr.indexOf(val) > -1){
              return true
          }else{
              return false
          }
      },
      showHide(data){
          this.showName=data;
          this.goingToSend=data;
      },
       initData(val){
          if(!val)return ''
          var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
          return tt; 
      },
      //视点定位
      relocation(val){
          if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })
        }else{
                const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"Init",parameter:null},"*");
                app.postMessage({command:"MoveToViewpoint",parameter:{para1:val}},"*");
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
      },
      /**
         * 预览文件集文件
         * @param fileUuid
         */
    preview(val){
        var vm = this
        if(val){
             window.open(vm.QJFileManageSystemURL+val+"/preview");
        }else{
              window.open(vm.QJFileManageSystemURL+vm.checkFileDir.dpath+"/preview");
        }
    },
    //下载
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

    collect(val,collect,index){
            var vm = this
            if(!val)return false
            var isCollect = collect?0:1
            axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+val+'/3/collect',
            headers:{
                'token':vm.token
            },
            params:{
                isCollect:isCollect //
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.CommunicationList[index].collect = collect?false:true
                 
            }else{
                    vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
           
        }).catch((err)=>{
            console.log(err)
        })
      },
      getComment(val,index,showResponse,reviewCount,dcStatus,reload,event){
        var vm = this
        // if(dcStatus==8||9){
        //     return ;
        // }
        if(reviewCount == 0){
             vm.$message({
                type:'warning',
                message:'还没有评论!'
            })
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+val+'/review/list',
            headers:{
                'token':vm.token
            },
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
                this.dataShow=false;
                vm.CommentList = response.data.rt.rows
                vm.CommunicationList.forEach((item,key)=>{
                    
                    if(key == index){
                        item.showFlowChart = false
                        if(reload){
                            vm.$set(item,'showResponse',true)
                            var num = reviewCount++
                            vm.$set(item,'reviewCount',(reviewCount++))
                        }else{
                                vm.$set(item,'showResponse',!showResponse)
                        }
                    }else{
                         item.showResponse = false
                    }
                })
                if(event != null){
                    vm.CommunicationList[index].flowCharts = event.data[index].flowCharts
                }
                if(event != null && event.isChecked)vm.CommunicationList.unshift(event.data[0])
            }else{
                vm.$message({
                    type:'error',
                    message:response.data.msg
                })
                
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
        //进入质量检查页面
        qualityCheck(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/project2/buildSite/qualityCheck',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd=="0"){
                    this.qualityCheckList=response.data.rt;
                    this.entType=this.qualityCheckList.entType;
                    this.ugId=this.qualityCheckList.ugId;
                    this.validateAuth();
                    this.getCheckTypeSubDir();
                    this.getCommunicationList();
                    console.log(this.qualityCheckList);
                }else if(response.data.cd=="-1"){
                    alert(response.data.msg)
                }
            })
        },
        //分页改变
        changePage(val){
          var vm = this
        vm.getCommunicationList()
      },
        //验证用户权限
        validateAuth(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/project2/buildSite/validateAuth',
                headers:{
                    'token':this.token
                },
                params:{
                    type:3,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd=="0"){
                    this.isShowQualityCheckAuth=true;
                }else if(response.data.cd=="-1"){
                    alert(response.data.msg)
                }
            })
        },
        //获取指定项目指定群组下的所有子文件夹
        getCheckTypeSubDir(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/project2/buildSite/'+this.projId+'/'+this.ugId+'/getCheckTypeSubDir',
                headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=="0"){
                    this.CheckTypeSubDirList=response.data.rt;
                    // this.CheckTypeSubDirList=data.transformTozTreeFormat(setting, response.data.rt);
                    console.log(this.CheckTypeSubDirList);
                }else if(response.data.cd=="-1"){
                    alert(response.data.msg)
                }
            })
        },
        checkTypeSelectMakeSure(){
            
            this.checkTypeSelectDialog=false;

             this.checkTypeId='';
            this.checkTypeValue='';
            this.showName=false;
            this.goingToSend =false;
            // if(this.checkTypeValue==''){
            //     this.$message({
            //             type:'error',
            //             message:'请选择检查类型文件夹'
            //         })
            // }else{
                
                
                
            // }
        },
        checkTypeSelectCancle(){
            var vm=this;
            this.checkTypeSelectDialog=false;
            this.showName=true;
            // this.checkTypeId='';
            // this.checkTypeValue='';
            // vm.goingToSend =false;
        },
        dcStatusCancle(){
        var vm = this
        vm.dcStatus.val = '10'
        vm.dcStatus.show = false
        vm.dcStatus.obj = {}
      },
      dcStatusConfirm(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+vm.dcStatus.obj.dcId+'/3/updateStatus',
            headers:{
                'token':vm.token
            },
        params:{
            dcStatus:vm.dcStatus.val,//
            operate:vm.dcStatus.obj.operate,//
        }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.CommunicationList[vm.dcStatus.obj.index].dcStatus = vm.dcStatus.val
                vm.$set(vm.CommunicationList[vm.dcStatus.obj.index],'statusText',vm.checkStatus(vm.dcStatus.val))
                vm.$message({
                    type:'success',
                    message:'状态修改成功'
                })
                vm.dcStatusCancle()
            }else{
                vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
        sendChange(){
            if(this.goingToSend==false){
                 this.checkTypeSelectDialog=true;
                // this.showName=true;
                var vm = this;
                vm.goingToSend =true;
            }
        },
        nodeClick(obj){
            if(obj.children.length==0){
            this.$message({
                type:'info',
                message:'这个文件夹没有子文件!'
            })
          }
            console.log(obj);
            this.checkTypeId=obj.id;
            this.checkTypeValue=obj.text;
            var str;
            console.log(obj.attributes.dirParId)
            this.CheckTypeSubDirList.forEach((item)=>{
                if(item.id==obj.attributes.dirParId){
                    str=item.text;
                    this.checkTypeValue=str+'-'+this.checkTypeValue;
                    console.log(this.checkTypeValue)
                }
            })
            // if(obj.attributes.dirParId)
            // this.str=obj.Parent.text;
            // console.log(this.str);
            // console.log(this.checkTypeId);
            // console.log(this.checkTypeValue);
        },
        hideSendMes(){
          var vm = this
          vm.goingToSend =false
      },
      //获得评论列表
       getCommunicationList(){
          var vm = this
          axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/list',
            headers:{
                'token':vm.token
            },
            data:{
                "builderId": vm.value_monomer,//单体 筛选
                "pageNo": vm.pageNo,
                "pageSize": 10,//默认是10
                "pageType": 3,//质量检查
                "projId": vm.projId,
                "status": vm.value_status,//状态 筛选
                "subProjId": vm.defaultSubProjId,
                "type": vm.value_about,//相关 筛选
                "ugId": vm.ugId,
                "userId": vm.userId
            }
        }).then((response)=>{
            vm.pageTotal = 0
            vm.CommunicationList = {}
            if(response.data.cd == 0){
               vm.CommunicationList = response.data.rt.rows
               if(vm.CommunicationList != null){
                vm.CommunicationList.forEach((item,index)=>{
                    vm.$set(item,'showFlowChart',false)
                    vm.$set(item,'showResponse',false)
                    vm.$set(item,'statusText',vm.checkStatus(item.dcStatus))
                })
               }
               console.log(vm.CommunicationList);
               vm.pageTotal = response.data.rt.pager.totalSize
            }else{
                  vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
            this.loading=false;
        }).catch((err)=>{
            console.log(err)
        })
      },
      checkAuth(){
          var vm = this
          if(vm.projAuth.indexOf("00600402") > 0){
              vm.canEditMes = true
          }
          if(vm.projAuth.indexOf("00600204") > 0){
              vm.canDeleteMes = true
          }
      },

      checkStatus(val){
            var status = "等待整改"
            if(val){
                switch(Math.ceil(val)){
                    case 8:
                        status ="等待整改"
                        break;
                    case 9:
                        status ="等待检查"
                        break;
                    case 10:
                        status ="继续整改"
                        break;
                    case 11:
                        status ="整改撤销"
                        break;
                    case 12:
                        status ="整改完成"
                        break;
                }
            }
            return status
        },
        //删除
        deleteMes(dcId,index){
        var vm = this
          vm.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                  axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/dc/'+dcId+'/3/delete',
                        headers:{
                            'token':vm.token
                        },
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            vm.CommunicationList.splice(index,1)
                            vm.$message({
                                type:'success',
                                message:'主题删除成功'
                            })
                        }else{
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      },
        //整改
        updateStatus(dcId,dcStatus,operate,index){
          var vm = this
          if(!dcId)return false
          if(dcStatus == 0){
                vm.dcStatus.val = '10'
                vm.dcStatus.show = true
                vm.dcStatus.obj = {
                    dcId:dcId,
                    operate:operate,
                    index:index
                }
               return false
          }
          if(dcStatus != 0){
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/dc/'+dcId+'/3/updateStatus',
                    headers:{
                        'token':vm.token
                    },
                params:{
                    dcStatus:dcStatus,//
                    operate:operate,//
                }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$set(vm.CommunicationList[index],'dcStatus',dcStatus)
                        vm.$set(vm.CommunicationList[index],'statusText',vm.checkStatus(dcStatus))
                        vm.$message({
                            type:'success',
                            message:'状态修改成功'
                        })
                    }else{
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
          }
      },

    },
    
}
</script>
<style lang="less">
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    /*
        修改eleUI树形组件
    */
    .el-tree-node:focus .el-tree-node__content{
        background-color: transparent;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
            background-color: #dfdfdf;
    }
    .el-tree-node__label{
        font-size: 12px;
        min-height: 16px;
        color: #666666;
        padding-left: 22px; 
        position: relative;
    }
    .qjLeaf{
        font-weight: bold;
    }
    .el-icon-caret-right:before{
           content: "\E604";
           color: #999999;
           font-weight: bold;
    }
    .el-tree-node__label::before{
        display: block;
        position: absolute;
        top: 2px;
        left: 4px;
        width: 14px;
        height: 13px;
        background: url('../ManageCost/images/file.png')no-repeat 0 0;
        content: '';
    }
    .el-tree-node__content{
            height: 30px;
    }
    .is-current .el-tree-node__content{
        color: #333333;
        // font-weight: bold;
    }
    .is-current_fistload > .el-tree-node__content {
        background-color: #dfdfdf;
    }
    
    #qualityChecking{
        #edit .el-dialog .el-dialog__body{
            .tree{
                    height:200px;
                    margin:0px 0px;
                    overflow-y:auto;
                }
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
        
        .topHeader{
            // box-sizing: border-box;
            // position: fixed;
            // top: 116px;
            // left: 26px;
            // bottom:0;
            // right: 0;
            // overflow: auto;
            box-sizing: border-box;
            float: left;
            width: 100%;
            height:800px;
            overflow: auto;
        }
        ::-webkit-scrollbar{width:0px}
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
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
        }
        #containerMessage{
            margin-top:20px;
            padding-left:30px;
            .ForumSelector{
                // border: 1px solid #d9d9d9;
                min-width: 900px;
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
                    // background: #fafafa;
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
                .header{
                // text-align: left;
                // height: 40px;
                // padding:6px;
                // margin: 15px 0;
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
                        background: url('../ManageDesign/images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
            }
            .checkName{
                float: left;
                margin-top:10px;
                margin-left:80px;
                font-size:14px;
                line-height: 14px;
                // margin-bottom: 10px;
            }
            .project{
                margin: 20px 0px 0 0px;
                    .pagenation{
                        width: 100%;
                        text-align: right;
                        height: 40px;
                        margin-top: 20px;
                        padding-right: 100px;
                        button{
                            margin-left: 15px;
                        }
                        .el-pager{
                            .number,.more{
                                    margin-left: 15px;
                            }
                        }
                    }
                }
            .projectList{
                    width: 100%;
                    list-style: none;
                    overflow: auto;
                    padding-left: 0;
                    margin-top: 0px;
                    
            }
            .projectList li{
                display: inline-block;
                width: 100%;
                margin-top: 5px; 
                border-bottom:1px solid #ebebeb;
            }
            .projectListInfo{
                width: 100%;
                overflow: hidden;
                display: flex;
            }
            .projectListImg{
                width: 80px;
                float: left;
            }
            .projectListText{
                font-size: 12px;
                flex: 1;
                margin: 0 0px 0 2px;
                float: left;
                text-align: left;
                position: relative;
                .action_rightBox{
                    position: absolute;
                    display: block;
                    width: auto;
                    height: 16px;
                    right: 30px;
                    top: 28px;
                    color: #fc3439;
                    span{
                        line-height: 16px;
                        height: 16px;
                        float: left;
                        position: relative;
                        cursor: pointer;
                        margin-left: 20px
                    }
                    .icon-finish::before{
                        display: inline-block;
                        position: absolute;
                        left: -18px;
                        top: 2px;
                        width: 14px;
                        height: 14px;
                        line-height: 14px;
                        background: url('../ManageDesign/images/finish.png')no-repeat 0 0;
                        content: '';
                    }
                    .icon-reconsider::before{
                        display: inline-block;
                        position: absolute;
                        left: -18px;
                        top: 2px;
                        width: 14px;
                        height: 14px;
                        line-height: 14px;
                        background: orange;
                        content: '';
                    }
                    .icon-start::before{
                        display: inline-block;
                        position: absolute;
                        left: -18px;
                        top: 2px;
                        width: 14px;
                        height: 14px;
                        line-height: 14px;
                        background: green;
                        content: '';
                    }
                        .icon-delete{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                    }
                }
                    .item-file{
                        float: left;
                        width: 290px;
                        height: 160px;
                        margin: 20px 15px 0 0;
                        border-radius: 6px;
                        box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                        position: relative;
                        padding: 8px;
                        .item-file-attach{
                            width: 100%;
                            height: 160px;
                            margin: 0;
                            padding: 0;
                            border-radius:2px;
                            cursor: pointer;
                            object-fit: contain;
                            background:#f2f2f2;
                        }
                    .actionbox{
                        display: block;
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: 36px;
                        background: rgba(40, 40, 40, .4);
                        transform: translateY(36px);
                            transition: all ease .5s;
                             .button-relocation{
                                float: left;
                                margin: 10px 64px;
                                width: 16px;
                                height: 16px;
                                background: url('../planCost/images/location.png') no-repeat 0 0;
                                // background: url('./images/search2.png')no-repeat 0 0;
                                cursor: pointer;
                             }
                            .button-search{
                                float: left;
                                margin: 10px 64px;
                                width: 16px;
                                height: 16px;
                                background: url('../ManageDesign/images/search2.png')no-repeat 0 0;
                                cursor: pointer;
                            }
                            .button-download{
                            float: left;
                                margin: 10px 64px;
                                width: 16px;
                                height: 16px;
                                background: url('../ManageDesign/images/download2.png')no-repeat 0 0;
                            cursor: pointer;
                            }
                            .line{
                            float: left;
                                margin: 6px 0px;
                                width: 1px;
                                height: 24px;
                                background: #cccccc;
                            }
                    }
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
                        background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
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
                            margin-top:20px;
                            .icon-goujian{
                                float: right;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                            }
                            .icon-download{
                                background: url('../ManageCost/images/download.png')no-repeat 0 0;
                                margin-right: 20px;
                                &:hover{
                                    background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                                }
                            }
                            .icon-search{
                                background: url('../ManageCost/images/search.png')no-repeat 0 0;
                                margin-right: 20px;
                                &:hover{
                                    background: url('../ManageCost/images/search1.png')no-repeat 0 0;
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
                                margin-bottom:6px; 
                            }
                            .text-name{
                                color: #336699;
                            }
                            .operation{
                                display: block;
                                position: absolute;
                                bottom: 15px;
                                left: 88px;
                                right: 0;
                                span{
                                    color: #fc3439;
                                }
                            }
                        }
                    }
                }
                .item-file:hover{
                    box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                    .actionbox{
                        transform: translateY(0px);
                        transition: all ease .5s;
                    }
                }
            }
            .projectListText .title{
                width: 100%;
                height: 35px;
                line-height: 35px;
                text-align: left;
                font-size: 16px;
                font-weight: bold;
            }
            .title span{
                font-size: 14px;
                display: inline-block;
                margin-left: 20px;
                color: #666;
                position: relative;
                top: 10px;
            }
            .projectListText .title a{
                float: right;
                width: 100px;
                font-size: 14px;
                cursor: pointer;
                text-align: center;
                color: #999;
                line-height: 45px;
            }
            .projectListText .title a:hover{
                color: #fc3439;
            }
            .projectListText .title a .el-icon-arrow-right{
                margin-left: 1px;
            }
            .projectListBtn{
                width: 20%;
                float: left;
            }
            .projectList img{
                width: 48px;
                height: 48px;
                border-radius:48px; 
                margin: 15px 12px 10px;
            }
            .projectListTextName{
                font-size: 18px;
                font-weight: bold;
                text-align: left;
                line-height: 18px;
                margin: 25px 0 16px;
            }
            .projectBottom{
                width: 100%;
                font-size: 12px;
                line-height: 12px;
                font-family: '微软雅黑';
                // overflow: hidden;
                color: #ccc;
                margin-top: 20px;
                margin-bottom: 6px;
                .icon-time{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: url('../ManageDesign/images/time.png');
                    margin-right: 10px;
                }
                .action{
                    float: right;
                    span{
                        margin-right:20px;
                        font-size: 12px;
                        color: #999999;
                        cursor: pointer;
                        
                    }
                    :last-child{
                            margin-right:30px;
                    }
                    .arrow{
                        position: relative;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom: -21px;
                            left: 50%;
                            margin-left:-8px; 
                            width: 16px;
                            height: 16px;
                            transform: rotateZ(45deg);
                            border-left: 1px solid #f2f2f2;
                            border-top: 1px solid #f2f2f2;
                            background: #fafafa;
                            content: '';
                        }   
                    }
                }
            }
            .projectBottom label{
                display: inline-block;
                width: 30%;
                margin-left: 20px;
                line-height: 12px;
            }
            .font-color1{
                color: #333;
                font-size: 14px;
            }
            .projectList-detial{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 500px;
            }
                
            /*评论*/
            .comments{
                border: 1px solid #f2f2f2;
                background: #fafafa;
                margin-top: 12px;
                margin-bottom: 20px;
                margin-right: 30px;
                .comments-item{
                    border-bottom: none;
                    .left{
                        float: left;
                        width: 40px;
                        height: 40px;
                        margin: 20px 10px 20px 16px;
                        border-radius: 50%;
                    }
                    .center{
                        display: block;
                        padding-left:65px; 
                        position: relative;
                        .icon-delete{
                            display: inline-block;     
                            width: 16px;
                            height: 16px;
                            background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                            position: absolute;
                            right: 16px;
                            top: -2px;
                            cursor: pointer;
                        }
                        .head{
                            height: 14px;
                            line-height: 14px;
                            font-size: 12px;
                            color: #999999;
                            margin: 30px 0 16px;
                            overflow: hidden;
                            :first-child{
                                font-size: 14px;
                                color: #fc3439;
                                cursor: pointer;
                                margin-right: 10px;
                            }
                            :last-child{
                                margin-left: 20px;
                            }
                        }
                        .detial{
                            border-bottom: 1px dashed #e6e6e6;
                            font-size: 14px;
                            color: #666666;
                            padding-bottom:20px; 
                        }
                    }
                }
                    /**********以下是消息输入框样式***********/
                .sendmessage{
                    margin: 30px 30px 20px 0;
                    margin-top: 30px;
                    .left{
                        width: 80px;
                        float: left;
                        img{
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            margin: 15px 12px 10px;
                        }
                    }
                    .center{
                        padding-left: 80px;
                        .box{
                            border: 1px solid #d9d9d9;
                            .input{
                                padding: 10px;
                                background: #ffffff;
                                .textArea{
                                    textarea{
                                        min-height: 116px;
                                        width: 100%;
                                        // height: auto;
                                        margin: 0px; 
                                        padding: 0px;
                                        border-style: none;
                                        border-width: 0px;
                                        font-size: 14px; 
                                        word-wrap: break-word; 
                                        line-height: 18px; 
                                        // overflow: hidden;
                                        outline: none;
                                        border: none;
                                        color: #333333;
                                        resize: none;
                                    }
                                }
                                ::-webkit-input-placeholder { /* WebKit browsers */
                                    color:    #cccccc;
                                }
                                :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                                    color:     #cccccc;
                                }
                                ::-moz-placeholder { /* Mozilla Firefox 19+ */
                                    color:    #cccccc;
                                }
                                :-ms-input-placeholder { /* Internet Explorer 10+ */
                                    color:   #cccccc;
                                }
                            }
                            .func_area{
                                padding:15px  0px 0 10px;
                                background: #f2f2f2;
                                height: 45px;
                                border-top: 1px solid #e6e6e6;
                                position: relative;
                                .limits{
                                    .cancle{
                                        float: right;
                                        font-size: 14px;
                                        color: #999999;
                                        margin-right: 130px;
                                        text-decoration: none;
                                    }
                                    span{
                                        line-height: 16px;
                                        height: 16px;
                                        float: left;
                                        position: relative;
                                        cursor: pointer;
                                        margin-left: 24px;
                                        margin-right: 20px;
                                        font-size: 12px;
                                        color: #666666;
                                    }
                                    .icon-eye::before{
                                        display: inline-block;
                                        position: absolute;
                                        left: -24px;
                                        top: 2px;
                                        width: 18px;
                                        height: 12px;
                                        line-height: 14px;
                                        background: url('../ManageDesign/images/eye.png')no-repeat 0 0;
                                        content: '';
                                    }
                                    .icon-image::before{
                                        display: inline-block;
                                        position: absolute;
                                        left: -24px;
                                        top: 2px;
                                        width: 18px;
                                        height: 14px;
                                        line-height: 14px;
                                        background: url('../ManageDesign/images/image.png')no-repeat 0 0;
                                        content: '';
                                    }
                                    .icon-file::before{
                                        display: inline-block;
                                        position: absolute;
                                        left: -24px;
                                        top: 2px;
                                        width: 16px;
                                        height: 18px;
                                        line-height: 14px;
                                        background: url('../ManageDesign/images/file.png')no-repeat 0 0;
                                        content: '';
                                    }
                                    .icon-message::before{
                                        display: inline-block;
                                        position: absolute;
                                        left: -24px;
                                        top: 2px;
                                        width: 18px;
                                        height: 15px;
                                        line-height: 14px;
                                        background: url('../ManageDesign/images/message.png')no-repeat 0 0;
                                        content: '';
                                    }
                                }
                                .send{
                                    display: block;
                                    position: absolute;
                                    top: -1px;
                                    bottom: -1px;
                                    right: -1px;
                                    width: 110px;
                                    background: #fc3439;
                                    color: #ffffff;
                                    text-align: center;
                                    line-height: 45px;
                                    font-size: 14px;
                                    text-decoration: none;
                                }
                            }
                    }
                    .fileitem{
                        .item-file{
                                float: left;
                                width: 290px;
                                height: 160px;
                                margin: 20px 15px 0 0;
                                border-radius: 6px;
                                box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                                position: relative;
                                padding: 8px;
                                .item-file-attach{
                                    width: 100%;
                                    height: 160px;
                                    margin: 0;
                                    padding: 0;
                                    border-radius:2px;
                                    cursor: pointer;
                                    object-fit: contain;
                                    background:#f2f2f2;
                                }
                                .actionbox{
                                    display: block;
                                    position: absolute;
                                    bottom: 0;
                                    width: 100%;
                                    height: 36px;
                                    background: rgba(40, 40, 40, .4);
                                    transform: translateY(36px);
                                        transition: all ease .5s;
                                        .button-relocation{
                                            float: left;
                                            margin: 10px 64px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../planCost/images/location.png') no-repeat 0 0;
                                            // background: url('./images/search2.png')no-repeat 0 0;
                                            cursor: pointer;
                                        }
                                        .button-search{
                                            float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../ManageDesign/images/search2.png')no-repeat 0 0;
                                            cursor: pointer;
                                        }
                                        .button-download{
                                        float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../ManageDesign/images/download2.png')no-repeat 0 0;
                                        cursor: pointer;
                                        }
                                        .icon-delete{
                                            float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            cursor: pointer;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                        } 
                                        .line{
                                        float: left;
                                            margin: 6px 0px;
                                            width: 1px;
                                            height: 24px;
                                            background: #cccccc;
                                        }
                                }
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
                                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
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
                                            margin-top: 15px;
                                            margin-left: 11px;
                                        } 
                                    }
                                    .item-file-detial{
                                        display: block;
                                        margin-left:80px;
                                        margin-top:20px;
                                        .icon-goujian{
                                            float: right;
                                            width: 16px;
                                            height: 16px;
                                            cursor: pointer;
                                        }
                                        .icon-download{
                                            background: url('../ManageCost/images/download.png')no-repeat 0 0;
                                            margin-right: 20px;
                                            &:hover{
                                                background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                                            }
                                        }
                                        .icon-search{
                                            background: url('../ManageCost/images/search.png')no-repeat 0 0;
                                            margin-right: 20px;
                                            &:hover{
                                                background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                                            }
                                        } 
                                        .icon-delete{
                                            margin-right: 20px;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                            &:hover{
                                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
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
                                            margin-bottom:6px; 
                                        }
                                        .text-name{
                                            color: #336699;
                                        }
                                        .operation{
                                            display: block;
                                            position: absolute;
                                            bottom: 15px;
                                            left: 88px;
                                            right: 0;
                                            span{
                                                color: #fc3439;
                                            }
                                        }
                                    }
                                }
                        }
                    }
                        .item-file:hover{
                            box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                            .actionbox{
                                transform: translateY(0px);
                                transition: all ease .5s;
                            }
                        }
                    }
                    #edit{
                        position: fixed;
                        z-index: 3001;
                        background: #ffffff;
                    }
                    .hahahha{
                        top: 15vh;
                        left: 50%;
                        width: 660px;
                        margin-left:-330px;
                        border-radius: 5px;
                    }
                    #mask{
                        z-index: 3000;
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        opacity: .5;
                        background: #000;
                    }
                }
            }

            /*流程图*/
                .flowCharts{
                    border: 1px solid #f2f2f2;
                    background: #fafafa;
                    margin-top: 12px;
                    margin-bottom: 20px;
                    margin-right: 30px;
                    .flowChart-item{
                        border: none;
                        width: 132px;
                        height: 86px;
                        float: left;
                        margin: 0;
                        .title_{
                            font-size: 14px;
                            color: #333333;
                            font-weight: normal;
                            text-align: center;
                            line-height: 14px;
                            margin-bottom: 7px;
                        }
                        .date{
                            font-size: 12px;
                            color: #999999;
                              text-align: center;
                            line-height: 12px;
                        }
                         .top{
                            width: 100%;
                            margin: 20px 0 6px;
                            text-align: center;
                            position: relative;
                            line-height: 8px;
                            .horizontalLineL{
                                display: block;
                                position: absolute;
                                top: 10px;
                                left: 0;
                                width: 55px;
                                height: 2px;
                                background: #219b21;
                                z-index: 1;
                            }
                            .circle{
                                background-color: #fff;
                                display: block;
                                width: 24px;
                                height: 24px;
                                border-radius: 12px;
                                /* background-color: #efefef; */
                                border: 2px #219b21 solid;
                                -webkit-border-radius: 12px;
                                margin: 5px auto;
                                z-index: 2;
                            }
                            .diamond{
                                display: block;
                                width: 22px;
                                height: 22px;
                                border: 2px #219b21 solid;
                                background-color: #fff;
                                margin: 6px auto;
                                -webkit-transform: rotate(-45deg);
                                -moz-transform: rotate(-45deg);
                                -o-transform: rotate(-45deg);
                                -ms-transform: rotate(-45deg);
                                transform: rotate(-45deg);
                                z-index: 2;
                            }
                            .square{
                                background-color: #fff;
                                display: block;
                                width: 22px;
                                height: 22px;
                                border: 2px #219b21 solid;
                                margin: 6px auto;
                                z-index: 2;
                            }
                            .horizontalLineR{
                                display: block;
                                position: absolute;
                                top: 10px;
                                right: 0;
                                width: 55px;
                                height: 2px;
                                z-index: 1;
                                background: #219b21;
                            }
                        }
                        &:first-of-type {
                            .top{
                                .horizontalLineL{
                                    display: none;
                                }
                            }
                        }
                        &:last-of-type {
                            .top{
                                .horizontalLineR{
                                    display: none;
                                }
                            }
                        }
                    }
                }

             /**********以下是消息输入框样式***********/
            .sendmessage{
                margin: 30px 30px 20px 0;
                margin-top: 30px;
                .left{
                    width: 80px;
                    float: left;
                    img{
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        margin: 15px 12px 10px;
                    }
                }
                .center{
                    padding-left: 80px;
                    .box{
                        border: 1px solid #d9d9d9;
                        .input{
                            padding: 10px;
                            background: #ffffff;
                            position: relative;
                            .textArea{
                                    min-height: 116px;
                                    width: 100%;
                                    // height: auto;
                                    margin: 0px; 
                                    padding: 0px;
                                    border-style: none;
                                    border-width: 0px;
                                    font-size: 14px; 
                                    word-wrap: break-word; 
                                    line-height: 18px; 
                                    // overflow: hidden;
                                    outline: none;
                                    border: none;
                                    color: #333333;
                                    resize: none;
                            }
                            #at_userslist{
                                position: absolute;
                                display: none;
                                width: 226px;
                                max-height: 270px;
                                overflow-y:auto; 
                                border: 1px solid #cccccc;
                                z-index: 10;
                                background: #ffffff;
                                .tit{
                                    display: block;
                                    width: 100%;
                                    height: 24px;
                                    line-height: 24px;
                                    background-color: #fff;
                                    padding: 0 10px;
                                    color: #666666;
                                    font-size: 14px;
                                    background: #ffffff;
                                    cursor: pointer;
                                    border: none;
                                    &:hover{
                                        background: #e8e8e8;
                                    }
                                }
                            }
                            ::-webkit-input-placeholder { /* WebKit browsers */
                                color:    #cccccc;
                            }
                            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                                color:     #cccccc;
                            }
                            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                                color:    #cccccc;
                            }
                            :-ms-input-placeholder { /* Internet Explorer 10+ */
                                color:   #cccccc;
                            }
                        }
                        .func_area{
                            padding:15px  0px 0 10px;
                            background: #f2f2f2;
                            height: 45px;
                            border-top: 1px solid #e6e6e6;
                            position: relative;
                            .limits{
                                .cancle{
                                    float: right;
                                    font-size: 14px;
                                    color: #999999;
                                    margin-right: 130px;
                                    text-decoration: none;
                                }
                                span{
                                    line-height: 16px;
                                    height: 16px;
                                    float: left;
                                    position: relative;
                                    cursor: pointer;
                                    margin-left: 24px;
                                    margin-right: 20px;
                                    font-size: 12px;
                                    color: #666666;
                                }
                                .icon-eye::before{
                                    display: inline-block;
                                    position: absolute;
                                    left: -24px;
                                    top: 2px;
                                    width: 18px;
                                    height: 12px;
                                    line-height: 14px;
                                    background: url('../ManageDesign/images/eye.png')no-repeat 0 0;
                                    content: '';
                                }
                                .icon-image::before{
                                    display: inline-block;
                                    position: absolute;
                                    left: -24px;
                                    top: 2px;
                                    width: 18px;
                                    height: 14px;
                                    line-height: 14px;
                                    background: url('../ManageDesign/images/image.png')no-repeat 0 0;
                                    content: '';
                                }
                                .icon-file::before{
                                    display: inline-block;
                                    position: absolute;
                                    left: -24px;
                                    top: 2px;
                                    width: 16px;
                                    height: 18px;
                                    line-height: 14px;
                                    background: url('../ManageDesign/images/file.png')no-repeat 0 0;
                                    content: '';
                                }
                                .icon-message::before{
                                    display: inline-block;
                                    position: absolute;
                                    left: -24px;
                                    top: 2px;
                                    width: 18px;
                                    height: 15px;
                                    line-height: 14px;
                                    background: url('../ManageDesign/images/message.png')no-repeat 0 0;
                                    content: '';
                                }
                            }
                            .send{
                                display: block;
                                position: absolute;
                                top: -1px;
                                bottom: -1px;
                                right: -1px;
                                width: 110px;
                                background: #fc3439;
                                color: #ffffff;
                                text-align: center;
                                line-height: 45px;
                                font-size: 14px;
                                text-decoration: none;
                            }
                        }
                }
                .fileitem{
                    .item-file{
                            float: left;
                            width: 290px;
                            height: 160px;
                            margin: 20px 15px 0 0;
                            border-radius: 6px;
                            box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                            position: relative;
                            padding: 8px;
                            .item-file-attach{
                                width: 100%;
                                height: 160px;
                                margin: 0;
                                padding: 0;
                                border-radius:2px;
                                cursor: pointer;
                                object-fit: contain;
                                background:#f2f2f2;
                            }
                            .actionbox{
                                display: block;
                                position: absolute;
                                bottom: 0;
                                width: 100%;
                                height: 36px;
                                background: rgba(40, 40, 40, .4);
                                transform: translateY(36px);
                                    transition: all ease .5s;
                                    .button-relocation{
                                        float: left;
                                        margin: 10px 40px;
                                        width: 16px;
                                        height: 16px;
                                        background: url('../planCost/images/location.png') no-repeat 0 0;
                                        // background: url('./images/search2.png')no-repeat 0 0;
                                        cursor: pointer;
                                     }
                                    .button-search{
                                        float: left;
                                        margin: 10px 40px;
                                        width: 16px;
                                        height: 16px;
                                        background: url('../ManageDesign/images/search2.png')no-repeat 0 0;
                                        cursor: pointer;
                                    }
                                    .button-download{
                                    float: left;
                                        margin: 10px 40px;
                                        width: 16px;
                                        height: 16px;
                                        background: url('../ManageDesign/images/download2.png')no-repeat 0 0;
                                    cursor: pointer;
                                    }
                                    .icon-delete{
                                        float: left;
                                        margin: 10px 40px;
                                        width: 16px;
                                        height: 16px;
                                        cursor: pointer;
                                        background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                    } 
                                    .line{
                                    float: left;
                                        margin: 6px 0px;
                                        width: 1px;
                                        height: 24px;
                                        background: #cccccc;
                                    }
                            }
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
                                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
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
                                    margin-top:20px;
                                    .icon-goujian{
                                        float: right;
                                        width: 16px;
                                        height: 16px;
                                        cursor: pointer;
                                    }
                                    .icon-download{
                                        background: url('../ManageCost/images/download.png')no-repeat 0 0;
                                        margin-right: 20px;
                                        &:hover{
                                            background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                                        }
                                    }
                                    .icon-search{
                                        background: url('../ManageCost/images/search.png')no-repeat 0 0;
                                        margin-right: 20px;
                                        &:hover{
                                            background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                                        }
                                    } 
                                    .icon-delete{
                                        margin-right: 20px;
                                        background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                        &:hover{
                                            background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
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
                                        margin-bottom:6px; 
                                    }
                                    .text-name{
                                        color: #336699;
                                    }
                                    .operation{
                                        display: block;
                                        position: absolute;
                                        bottom: 15px;
                                        left: 88px;
                                        right: 0;
                                        span{
                                            color: #fc3439;
                                        }
                                    }
                                }
                            }
                    }
                }
                    .item-file:hover{
                        box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                        .actionbox{
                            transform: translateY(0px);
                            transition: all ease .5s;
                        }
                    }
                }
                #edit{
                    position: fixed;
                    z-index: 3001;
                    background: #ffffff;
                }
                .hahahha{
                    top: 15vh;
                    left: 50%;
                    width: 660px;
                    margin-left:-330px;
                    border-radius: 5px;
                }
                #mask{
                    z-index: 3000;
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: .5;
                    background: #000;
                }
            }

        }
        
    }

</style>


