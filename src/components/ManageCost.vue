<template>
    <div class="wrapper" ref="allHeight">
      <!--2018/3/21 付伟超修改-->
        <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' :userimg="header.userImg" ></headerCommon>
        <div class="contentBody">
            <div class="downWebGl" @click="webGlbtn">虚拟场景<i :class="[{'active':webGlShow},'webGlDownBtn']"></i></div>
            <div v-show="webGlShow" id="webgladd" class="webglBackground">
                <!-- <div class="webglLeft"></div> -->
                <div id="webgl" v-show="webGlShow" style="background:#fff">
                    <!-- <iframe v-show="webGlShow" ref="iframe1" id="webIframe" name="ifd" height="800px" frameborder="no" border="0" marginwidth="0" marginheight="0"  width="100%" src="http://10.252.26.240:8080/genDist/index.html"  ></iframe> -->
                    <iframe allowfullscreen=true v-show="webGlShow" ref="iframe1" id="webIframe" name="ifd" height="800px" frameborder="no" border="0" marginwidth="0" marginheight="0"  width="100%" :src="iframeUrl"  ></iframe>
                </div>
                <!-- <div class="webglRight"></div> -->
            </div>
            <div  class="main">
                <div class="content">
                    <el-row class="navigation1">
                        <el-col :span="24">
                            <el-tabs   v-model="navigationPath" @tab-click="handleClick" >
                                <!-- <el-tab-pane label="工程首页" name="projectPage" v-if="auth.homePage"></el-tab-pane>
                                <el-tab-pane label="进度计划" name="plan" v-if="auth.progress"></el-tab-pane>
                                <el-tab-pane label="设计管理" name="designManager" v-if="auth.design"></el-tab-pane>
                                <el-tab-pane label="成本管理" v-if="auth.costManagement" name="costManage"></el-tab-pane>
                                <el-tab-pane label="物资采购" v-if="auth.materialPurchasing" name="materialPurchase"></el-tab-pane>
                                <el-tab-pane label="现场连线" v-if="auth.liveConnection" name="liveConnection"></el-tab-pane>
                                <el-tab-pane label="安全管理" v-if="auth.constructionSite" name="construction"></el-tab-pane>
                                <el-tab-pane label="文档管理" v-if="auth.docManagement" name="documentManager"></el-tab-pane>
                                <el-tab-pane label="配置中心"  v-if="auth.configurationCenter" name="settings"></el-tab-pane> -->

                            <el-tab-pane v-for="(item,index) in getMenusLists" :key="index" :label="item.webName?item.webName:item.moduleName" :name="item.moduleCode" v-if="item.enableWeb==1"   ></el-tab-pane>
                                <!-- <el-tab-pane label="配置中心00"  v-if="auth.configurationCenter" name="settings"></el-tab-pane> -->
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <div v-show="webGlShow" @click="createdMid()" class="creatMid">
                        生成清单
                    </div>
                    <div  class="settingsLeft" v-if="!settingsCenter" ref="settingsL">
                        <h5>工程配置中心</h5>
                        <!-- <el-menu :default-active="settingActive"  router :unique-opened="true"  @select="selectIndex">
                            <el-submenu index="/setting/initalsettings">
                                <template slot="title">
                                    <span>工程场地与项目初始化</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/setting/initalsettings">工程初始配置信息</el-menu-item>
                                    <el-menu-item index="/setting/groundsettings">场地与单体初始化</el-menu-item>
                                    <el-menu-item index="/setting/pageinital">分区与楼层初始化</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-submenu index="/setting/datatransform">
                                <template slot="title">
                                    <span>建筑信息模型标准管理</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/setting/datatransform">数据传递标准概览</el-menu-item>
                                    <el-menu-item index="/setting/professional">专业工种分类编码</el-menu-item>
                                    <el-menu-item index="/setting/worktool">作业工具分类编码</el-menu-item>
                                    <el-menu-item index="/setting/constructordesignmapped">设计构件分类映射</el-menu-item>
                                    <el-menu-item index="/setting/constructordesigncode">设计构件分类编码</el-menu-item>
                                    <el-menu-item index="/setting/projectsubmit">工程招标分类编码</el-menu-item>
                                    <el-menu-item index="/setting/materialpurchase">物资采购分类编码</el-menu-item>
                                    <el-menu-item index="/setting/buildingproperty">构件属性语意编码</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-submenu index="/setting/jobmanage">
                                <template slot="title">
                                    <span>用户岗位群组管理</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/setting/jobmanage">岗位管理</el-menu-item>
                                    <el-menu-item index="/setting/groupmanage">群组管理</el-menu-item>
                                    <el-menu-item index="/setting/usermanage">用户管理</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-submenu index="/setting/projectstationmanage">
                                <template slot="title">
                                    <span>工程动态日志</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/setting/projectstationmanage">工程动态管理</el-menu-item>
                                    <el-menu-item index="/setting/projectloggermanage">工程日志管理</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu> -->
                        <el-menu :default-active="settingActive"  router :unique-opened="true"  >
                            <el-submenu v-for="(item,index1) in ellist" :key="index1"  @select="selectIndex" :index="item.isShowUrl">
                                <template slot="title">
                                    <span v-text="item.webName?item.webName:item.moduleName"></span>
                                </template>
                                <el-menu-item-group v-for="(val,index2) in item.routerLink" :key="index2">
                                    <el-menu-item :index="val.title" v-text="val.linkUrl">工程初始配置信息</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu>
                    </div>
                    <div :class="[{'settingsCenter':settingsCenter},{'settingsRight':!settingsCenter}]">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="生成清单" :visible.sync="midShow" @close="midShow=false">
                <div class="editBody">
                    <div class="editBodytwo imageBodyMid">
                        <label class=" imageBodyTextMid">清单名称 :</label>
                        <input type="text" class="inp" v-model="manifestName">
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMidConfirm">确认</button>
                    <button class="editBtnC" @click="midShow=false">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headerCommon from './header.vue'
import axios from 'axios'
var app
// var responseStr=require('./json/response');
// var responseStr=require('./json/response1');

// var isOpen=0;
var CurrentSelectedEntLists='';
export default {
    name:'Home',
    components: {
      headerCommon
    },
    data(){
        // window.location.reload();
        //  window.addEventListener("message", (evt)=>{
        //                this.callback(evt)},false
        // );
        return{
            url:'http://10.252.26.240:8080/genDist/',
            isOpen:0,
            BDMSUrl:'',
            strokeShow:'',
            settingsCenter:true,//是否是两边铺满
            header:{
                userName:'',
                userId:'', 
                //projectName:'华建Q系列工程协同应用系统',
                projectName:'',
                projectImg:'',
            },          
            navigationPath:'007',
            activeIndex:'1',
            settingActive:'/setting/initalsettings',
            winHeight:'',
            screenWidth: document.documentElement.clientHeight,
            token:'',
            projId:'',
            subProjId:'',
            cHeight:'',
            /*********
                 *要判断导航栏功能； 
                 * 工程首页 （007）、进度计划（005）、设计管理（004）、
                 * 成本管理（012）、物资采购（011）、安全管理（013）、
                 * 施工现场（006）、文档管理（002）、空间管理（009）、
                 * 资产管理（010）、配置中心（001）
                 * *********/
            auth:{
                    homePage:false,
                    progress:false,
                    design:false,
                    costManagement:false,
                    materialPurchasing:false,
                    liveConnection:false,
                    safetyManagement:false,
                    constructionSite:false,
                    docManagement:false,
                    spaceManagement:false,
                    assetManagement:false,
                    configurationCenter:false,
            },
            webGlShow:false,
            InitdataList:'',
            WebGlId:'',
            WebGlUrl:'',
            WebGlType:'',
            WebGlName:'',
            iframeUrl:'',
            GetDrawingBackList:'',//有图形传递过来的数据
            getWebGlDrawingList:'',//图纸列表
            GetDrawingBackList:'',//webgl图纸返回数据
            drawingWebGlUrl:'',//图纸路径
            drawingWebGlId:'',//图纸ID
            drawingWebGlIdList:[],//图纸数组ID
            fileType:'',
            drawingWebGlType:'',//图纸类型
            drawingWebGlList:'',
            ListJSON:'',
            //图纸列表数量
            drawsingList:{
                name:'',
                type:'',
                source:'',
                page:1,
                angle:0,
            },
            drawList:[],
            rotate:'',
            QJFileManageSystemURL:'',
            commomHeadPictureFile:'',
            menusInfoData:[],//自定义菜单
            getMenusLists:[],//自定义菜单
            strJson:[],
            authId:'',
            moduleLists:'',
            ellist:'',
            entId:'',
            groupId:'',
            elementTracId:[],
            midShow:false,
            manifestName:'',
            responseStr:'',


        }
    },
    created(){
        var vm = this
        // window.removeEventListener("message", (evt)=>{
        //         this.callback(evt)}
        // );
        // window.addEventListener("message", (evt)=>{
        //                this.callback(evt)},false
        // );
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.subProjId=localStorage.getItem('defaultSubProjId');
        vm.entId=localStorage.getItem('entId');

        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.WebGlUrl=vm.$store.state.WebGlUrl;
        vm.QJFileManageSystemURL=vm.$store.state.QJFileManageSystemURL;
        vm.commomHeadPictureFile=vm.$store.state.commomHeadPictureFile;
        // vm.commomHeadPictureFile=vm.QJFileManageSystemURL;
        vm.BIMServerPort=vm.$store.state.BIMServerPort;
        vm.iframeUrl=vm.$store.state.iframeWebGlUrl+'?new='+Math.random();

        vm.navigationPath = sessionStorage.getItem('navigationPath');
        // console.log(vm.navigationPath,'vm.navigationPath');
        vm.settingActive = sessionStorage.getItem('settingActive');
        
        if(!vm.navigationPath){
            vm.navigationPath='007';
        }
        if(!vm.settingActive){
            vm.settingActive='/setting/initalsettings';
            // vm.settingsCenter=false;
        };
        vm.settingsCenter = vm.$route.meta.settingsCenter?false:true
        vm.token  = localStorage.getItem('token');
        vm.header.userImg=localStorage.getItem('userImg');
         vm.header.userName = localStorage.getItem('userName');
         vm.userNames = localStorage.getItem('userName')
         vm.header.userId = localStorage.getItem('userId');
         vm.responseStr=localStorage.getItem('responseAuthInfo');
        //  response.data.rt.user.name
        // vm.header.userId = response.data.rt.user.userId
        // vm.getUserInfo()
        vm.getPJDetial(vm.projId);
        vm.getOnlineInfo();
        vm.getUserGroup();
        // console.log(new Date().getTime(),'time');
        // this.getInitdata();
    },
    mounted(){
        var height = ''
        if(document.documentElement.clientHeight){
            this.cHeight = document.documentElement.clientHeight;
        }else{
           this.cHeight = document.body.clientHeight;
        }
        // this.CreateIframe(this.iframeUrl);
    },
    updated(){
        var vm=this;
        // window.removeEventListener("message", (evt)=>{
        //         this.callback(evt)}
        // );
        // console.log('updated')
        // vm.getUserInfo();
        // console.log('是否更新')
        // if(document.getElementById('webgl').style.display=='none'){
        //     window.removeEventListener("message", (evt)=>{
        //             this.callback(evt),false}
        //          );
        //          console.log('图形销毁')

        // }else{
        //      window.addEventListener("message", (evt)=>{
        //                this.callback(evt)},false
        //             );

        // }
                  
    },
    destoryed(){
        var vm=this;
        // window.removeEventListener("message", (evt)=>{
        //         this.callback(evt),false}
        // );
        console.log('是否销毁');
        // this.IframeClose();
    },
    computed:{
        path(){
            return this.$store.state.path;
        },
    },
    
    methods:{
        webGlbtn(){
            var vm=this;
            this.webGlShow=!this.webGlShow;
            this.isOpen++;
            // console.log(this.isOpen,'isOpen00');
            if(this.isOpen==1){
                setTimeout(()=>{
                    app = this.$refs.iframe1.contentWindow;
                    // app = document.getElementById("webIframe").contentWindow;
                    app.postMessage({command:"Init",parameter:{menu:true,loadingFiles_display:true}},"*");
                        // window.removeEventListener("message", (evt)=>{
                        //     this.callback(evt)},true);
                },1000)
            }
            if(this.webGlShow){
                 window.addEventListener("message", (evt)=>{
                       this.callback(evt)},false
                    );
                    console.log('图形生成')
            }else{
                window.removeEventListener("message", (evt)=>{
                    this.callback(evt),false}
                 );
                 console.log('图形销毁')
            }
        },

        callback(e){
            switch(e.data.command){
			case "EngineReady":
				{
                    let Horder='';
                    let para='';
                    para = {token:this.token,entId:this.entId,projectId:this.projId,groupId:this.groupId,url:this.BDMSUrl,stroke:JSON.parse(this.strokeShow)}
                    this.strJson=para;
                    // console.log(this.strJson,'初始加载模型-stroke参数是判断禁止描边,true为禁止')
                    app.postMessage({command:"SetMenuUrl",parameter:this.strJson},"*");
				}
				break;
            case "CurrentSelectedEnt":
                {
                    CurrentSelectedEntLists=e.data.parameter;
                    // console.log(CurrentSelectedEntLists,'选择的构件');
                }
				break;
			case "ViewpointSubmited":
                break;
            case "GetDrawingList":
                this.GetDrawingBackList='',
                this.drawList=[];
                this.GetDrawingBackList=e.data.parameter;
                // console.log(this.GetDrawingBackList,'图纸')
                this.getDrawingList();
                break;
		    }
        },
        //获得元素
        getElement(level,id){
            var vm=this;
            axios({
                url:this.BDMSUrl+'api/v1/getElement',
                method:'POST',
                data:{
                    fileIds:level,
                    selectIds:id
                }
            }).then((response)=>{
                if(response.data.cd==0){
                     response.data.rt.forEach((item)=>{
                        if(item.para2=='structure'){
                            this.elementTracId.push(item.traceId)
                        }
                    })
                    // this.elementTracId=response.data.rt.
                }
            })
            // $.ajax({
            //     url:vm.BDMSUrl+'api/v1/getElement?fileId='+level+'&selectId='+id,
            //     type:'post',
            //     async:false,
            //     success:(response)=>{
            //         if(response.cd==0){
            //             this.elementTracId.push(response.rt[response.rt.length-1].traceId)
            //         }
            //     }
            // })
            // axios({
            //     url:vm.BDMSUrl+'api/v1/getElement',
            //     params:{
            //         fileId:level,
            //         selectId:id,
            //     }
            // }).then((response)=>{
            //     if(response.data.cd==0){
            //         if(response.data.rt[response.data.rt.length-1].para2=='structure'){
            //             this.elementTracId.push(response.data.rt[response.data.rt.length-1].traceId)
            //         }
            //     }
            // })
        },
        //生成清单
        createdMid(){
            var vm=this;
            this.elementTracId=[];
            var fileIds=[];
            var selectIds=[];
            CurrentSelectedEntLists.ID.forEach((item)=>{
                fileIds.push(item.level);
                selectIds.push(item.id);
            })
             vm.getElement(fileIds,selectIds)
            vm.midShow=true;
           
            // vm.$confirm('此操作将你选择构件生成清单, 是否继续?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then((response)=>{
            //     axios({
            //         url:this.BDMSUrl+''
            //     })
            // })
        },
        //确认生成清单
        addMidConfirm(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'manifest/createManifest',
                method:'post',
                headers:{
                    'token':vm.token
                },
                data:this.elementTracId,
                params:{
                    manifestName:this.manifestName,
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.midShow=false;
                    this.$message({
                        type:'success',
                        message:'清单生成成功'
                    })
                    this.elementTracId=[];
                    this.manifestName='';

                }
            })
        },
        getUserGroup(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'userGroup/getAllGroup',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    response.data.rt.forEach((item)=>{
                        if(item.groupName=='默认群组'){
                            this.groupId=item.groupId
                        }
                    })
                }
            })
        },
        //动态加载iframe
        CreateIframe(url){
            var parent=document.getElementById("webgl");
            var iframe=document.createElement("iframe");
            iframe.setAttribute("allowfullscreen",true);
            iframe.setAttribute("ref","iframe1");
            iframe.setAttribute("id","webIframe");
            iframe.setAttribute("name","ifd");
            iframe.setAttribute("height",800);
            iframe.setAttribute("frameborder",0);
            iframe.setAttribute("border",0);
            iframe.setAttribute("marginwidth",0);
            iframe.setAttribute("marginheight",0);
            iframe.setAttribute("width","100%");
            iframe.setAttribute("src",url);
            parent.appendChild(iframe);
        },
        //删除iframe
        IframeClose(){
            let parent=document.getElementById("webgl");
            let child=document.getElementById("webIframe");
            parent.removeChild(child);
        },
        //获取自定义菜单信息
        getMenusInfoPage(){
            var vm=this;
            this.menusInfoData=[];
            axios({
                method:'GET',
                // url:this.BDMSUrl+'config2/component/getCustomMenu',
                url:this.BDMSUrl+'api/v1/main/getCustomMenu',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    var menusInfoDatas = response.data.rt;
                    menusInfoDatas.forEach((item)=>{
                        this.menusInfoData.push({
                            webName: item.title,
                            moduleName: item.title,
                            grade: 1,
                            due: 0,
                            enableApp: 0,
                            enableWeb: 1,
                            parentModuleId: 0,
                            moduleId: null,
                            id: item.id,
                            projectId: item.projectId,
                            status: 1,
                            title: item.title,
                            url: item.url,
                            moduleCode:"000"
                        })
                    })
                    // console.log(this.menusInfoData,'this.menusInfoData');
                    this.getMenusLists=this.getMenusLists.concat(this.menusInfoData);
                   
                   
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        changeFrameHeight(){
            var ifm= document.getElementById("webIframe"); 
            ifm.height=document.documentElement.clientHeight;
        },
        getFileInfoById(fgId){
            var vm=this;
            var fgids=[];
            fgids.push(fgId);
            // console.log(fgids,'fgids00');
            $.ajax({
                url:this.BDMSUrl+'doc/getFileInfoById',
                type:"post",
                dataType:"json",
                data:JSON.stringify(fgids),
                async:false,
                contentType:'application/json;charset=utf-8',
                headers:{
                    token:vm.token
                },
                success:function(response){
                    if(response.cd){
                        vm.fileType=response.rt[0].fgName;
                    }
                }
            })
            return vm.fileType;
            // axios({
            //     url:this.BDMSUrl+'doc/getFileInfoById',
            //     method:'post',
            //     headers:{
            //         'token':this.token
            //     }
            // }).then((response)=>{
            //     if(response.data.cd==0){

            //     }
                
            // })

        },
        
        //获取图纸列表
        getDrawingList(){
            // console.log(this.GetDrawingBackList,'图纸')
            var vm=this;
            this.drawingWebGlIdList=[];
            axios({
            method:'get',
            headers:{
                'token':this.token
            },
            url:this.BDMSUrl+'dc/drawingReview/getDrawingList',
            params:{
                projectId:vm.projId
            }
            }).then(response=>{
                if(response.data.rt){
                    this.getWebGlDrawingList=response.data.rt;
                    // console.log(this.getWebGlDrawingList,'this.getWebGlDrawingList');
                    this.getWebGlDrawingList.forEach((item)=>{
                        if(this.GetDrawingBackList.holderID==item.holderId){

                            this.drawingWebGlId=item.id;
                            this.drawingWebGlIdList.push(this.drawingWebGlId);
                            if(this.GetDrawingBackList.GCodeList.length!=0){
                                
                                // for(var i=0;i<this.GetDrawingBackList.GCodeList.length;i++){
                                //     if((this.GetDrawingBackList.GCodeList)[i]==item.directory){
                                //         this.drawingWebGlId=item.id;
                                //         this.drawingWebGlIdList.push(this.drawingWebGlId);
                                //     }
                                // }
                            }else{
                                // this.drawingWebGlId=item.id;
                                // this.drawingWebGlIdList.push(this.drawingWebGlId);
                            }
                            // console.log(this.drawingWebGlIdList,'drawingWebGlIdList');
                        }
                    })
                   
                    if(this.drawingWebGlIdList.length!=0){
                        this.getMaxVersionPath();
                     }
                }else if(response.data.cd=='-1'){
                    // this.$message({
                    //     type:'error',
                    //     message:response.data.msg
                    // })
                }
            })
        },
        //获取图纸最新版本路径
        getMaxVersionPath(){
            var vm=this;
            this.drawList=[];
            axios({
            method:'post',
            headers:{
                'token':this.token
            },
            url:this.BDMSUrl+'dc/drawingReview/getMaxVersionPath',
            data:this.drawingWebGlIdList
            }).then(response=>{
                if(response.data.rt){
                    this.drawingWebGlList=response.data.rt;
                    // console.log(this.drawingWebGlList,'图纸地址');
                    this.drawingWebGlList.forEach((item)=>{
                        this.getWebGlDrawingList.forEach((item1)=>{
                            if(item.drawingId==item1.id){
                                // this.getDrawingRotateInfo(item.drawingId);
                                  this.drawList.push({
                                        name:item1.drawingNumber+'('+item1.drawingName+')',
                                        // type:(item.fileUri.substr(item.fileUri.length-3)).toLocaleUpperCase(),
                                        // type:'pdf',
                                        type:this.getFileInfoById(item.fgId).substr(this.getFileInfoById(item.fgId).length-3).toLocaleUpperCase(),
                                        source:this.BDMSUrl+'doc/download/'+item.fgId,
                                        page:1,
                                        angle:this.getDrawingRotateInfo(item.drawingId)
                                })
                            }
                        })
                    })
                    console.log(this.drawList,'最后的东西');
                    app.postMessage({command:"DrawingList", parameter:this.drawList},"*")
                    // this.drawingWebGlType=(response.data.rt.substr(response.data.rt.length-3)).toLocaleUpperCase();
                    // this.drawingWebGlUrl=this.QJFileManageSystemURL+response.data.rt;
                    //  this.drawList.push({
                    //             name:this.drawingWebGlName,
                    //             type:this.drawingWebGlType,
                    //             source:this.drawingWebGlUrl,
                    //             page:1,
                    //             angle:0
                    //     })
                    // console.log(this.drawingWebGlUrl,'图纸URl')
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        getDrawingRotateInfo(val){
            var vm=this;
            //  axios({
            //     url:vm.BDMSUrl+'dc/drawingReview/getDrawingRotateInfo',
            //     method:'post',
            //     headers:{
            //         'token':vm.token
            //     },
            //     params:{
            //        drawingId:val,
            //     },
            // }).then((response)=>{
            //     if(response.data.cd=='0'){
            //         if(response.data.rt){
            //             this.rotate=response.data.rt.rotateInfo;
            //         }
            //     }else{
                    
            //     } 
            // })
            var vm=this;
            $.ajax({
                url:this.BDMSUrl+'dc/drawingReview/getDrawingRotateInfo',
                type:"post",
                data:{
                    drawingId:val
                },
                headers:{
                    token:vm.token
                },
                async:false, //同步
                success:(response)=>{
                    if(response.cd==0){
                        this.rotate=(response.rt==null?0:response.rt.rotateInfo);
                    }
                }
            })
            return parseInt(this.rotate);

        },
        //获取项目模型展示初始化数据
        getInitdata(){
            axios({
            method:'get',
            headers:{
                'token':this.token
            },
            url:this.BDMSUrl+'/model2/'+this.projId+'/'+this.subProjId+'/model/initdata'
        }).then(response=>{
            if(response.data.rt){
                this.InitdataList=JSON.parse(response.data.rt);
                this.WebGlId=this.InitdataList.StartViewPoint.CurrentHolder.ID;
                this.WebGlId=String(this.WebGlId);
                this.WebGlType=this.InitdataList.StartViewPoint.CurrentHolder.Type;
                this.WebGlName=this.InitdataList.StartViewPoint.CurrentHolder.Name;
                // this.WebGlName=this.InitdataList.StartViewPoint.CurrentHolder.Name;
            }else if(response.data.cd=='-1'){
            }
            })
        },
             
        getPJDetial(key){
            var vm = this
            /*******
             * 谨记：
             * 获取路由params的写法是this.$route 不是this.$router!!!
             * ********/
            axios({
                method:'GET',
                // url:vm.BDMSUrl+'project2/index?projId='+key,
                url:vm.BDMSUrl+'api/v1/main/index?projId='+key,
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.msg == "您没有登录或登录超时，请重新登录"){
                        vm.$router.push({
                        path:'/login'
                    })
                }else{
                    // vm.header.projectName = response.data.rt.project?response.data.rt.project.projName:''
                    // vm.header.projectImg = response.data.rt.projectImage?response.data.rt.projectImage.filePath:''
                    // localStorage.setItem('defaultSubProjId',response.data.rt.defaultSubProjId)
                    // localStorage.setItem('projectName',vm.header.projectName)
                    vm.getUserInfo();
                    vm.header.projectName = response.data.rt.project?response.data.rt.project.projectName:'';
                    localStorage.setItem('projectName',vm.header.projectName);
                    vm.strokeShow=response.data.rt.project.stroke;
                    
                    vm.header.projectImg = response.data.rt.image.length!=0?vm.BDMSUrl+response.data.rt.image[0].path:null;
                    console.log(vm.header.projectImg,'vm.header.projectImg');
                    this.$store.commit('changeProjectLogo',{
                        projectImg:vm.header.projectImg
                    })
                    if(vm.header.projectImg){
                        this.$store.commit('switchLogo',{
                            isDefaultLogo:true
                        })
                    }else{
                        this.$store.commit('switchLogo',{
                            isDefaultLogo:false
                        })
                    }
                    localStorage.setItem('defaultSubProjId',response.data.rt.defaultSubProjId);
                    this.subProjId=response.data.rt.defaultSubProjId;
                    
                    // vm.getInitdata();
                }
            })
            // .catch((err)=>{
            //     console.log(err)
            // }) 
        },
        
        //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        firstEnter(){

        },
        
        getOnlineInfo(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'user/getOnlineInfo',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                vm.header.userName = response.data.rt.user.name
                vm.header.userId = response.data.rt.user.userId
                
                // vm.header.userImg = response.data.rt.onlineInfo.imgUuid !=null?vm.commomHeadPictureFile+response.data.rt.onlineInfo.imgUuid:''
                // localStorage.setItem('userImg',vm.header.userImg)
                // localStorage.setItem('entType',response.data.rt.onlineInfo.entType)
                // localStorage.setItem('userName',vm.header.userName)
                localStorage.setItem('projAuth',response.data.rt.authIds);
                // console.log()
                // console.log(response.data.rt.authIds,'权限文件');
            })
        },

        getUserInfo(){
            var vm = this
            this.getMenusLists=[];
            // console.log(this.responseStr,'this.responseStr');
            // axios({
            //     method:'GET',
            //     url:vm.BDMSUrl+'project2/getOnlineInfo',
            //     params:{
            //         refresh:Math.random()/*IE11浏览器会默认从缓存里取数据*/
            //     },
            //     headers:{
            //         'accept':'application/json;charset=UTF-8',
            //         'token':vm.token,
            //     },
            // })
            // .then((response)=>{
                
            {
                var response={
                    data:JSON.parse(vm.responseStr)
                }
                // var id = localStorage.getItem('projId');
                // vm.header.userName = response.data.rt.onlineInfo.userName
                // vm.header.userId = response.data.rt.onlineInfo.userId
                // vm.header.userImg = response.data.rt.onlineInfo.imgUuid !=null?vm.commomHeadPictureFile+response.data.rt.onlineInfo.imgUuid:''
                // localStorage.setItem('userImg',vm.header.userImg)
                // localStorage.setItem('entType',response.data.rt.onlineInfo.entType)
                // localStorage.setItem('userName',vm.header.userName)
                // localStorage.setItem('projAuth',response.data.rt.onlineInfo.projAuth[id])
                /*********
                 *要判断导航栏功能； 
                 * 工程首页 （007）、进度计划（005）、设计管理（004）、
                 * 成本管理（012）、物资采购（011）、安全管理（013）、
                 * 施工现场（006）、文档管理（002）、空间管理（009）、
                 * 资产管理（010）、配置中心（001）
                 *  auth:{
                        homePage:false,
                        progress:false,
                        design:false,
                        costManagement:false,
                        materialPurchasing:false,
                        safetyManagement:false,
                        constructionSite:false,
                        docManagement:false,
                        spaceManagement:false,
                        assetManagement:false,
                        configurationCenter:false
                    }
                 * *********/
                // var id = localStorage.getItem('projId');
                //  localStorage.setItem('entId',response.data.rt.onlineInfo.entId)
                // localStorage.setItem('projAuth',response.data.rt.onlineInfo.projAuth[id])

                
                localStorage.setItem('moduleList',JSON.stringify(response.data.rt.onlineInfo.moduleList))
                this.moduleLists=response.data.rt.onlineInfo.moduleList;
                // console.log(JSON.parse(response.data).rt,'this.moduleLists');
                
                var str=[]
                this.moduleLists.forEach((item)=>{
                    if(item.grade==1&&item.parentModuleId==0&&(item.due==0||item.due>new Date().getTime())){
                        str.push(item);
                    }
                })
                str=str.sort(this.compare('sequenceNo'));
                this.getMenusLists=str;
                // console.log(this.getMenusLists,'this.getMenusLists');
                vm.getMenusInfoPage();
                // vm.testIndex();
                
                //遍历判断
                // if(vm.$route.query.firstView == 'Y'){
                // }
                    if(vm.navigationPath==="007"){
                        // vm.$router.push({
                        //     path:'/SchedulePlan/personalCalendar'//进度计划；
                        // })
                        this.$router.push({
                            path:'/home/projHome/'+this.projId
                        });
                    }else if(vm.navigationPath==='005'){
                        // vm.$router.push({
                        //     path:'/SchedulePlan/personalCalendar'//进度计划；
                        // })
                         this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'005','00501','/SchedulePlan/personalCalendar','00502','/SchedulePlan/resourcePlan','00503','/SchedulePlan/taskIndex','00504','/SchedulePlan/calendarConfig','00505','/SchedulePlan/simulation')
                        })
                    }else if(vm.navigationPath==='004'){
                        // vm.$router.push({
                        //     // path:'/Design/management'//设计管理
                        //     path:'/Design/management'
                            
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'004','00401','/Design/management','00402','/Design/drawingReview','00403','/Design/attributeManager','00404','/Design/designversion')
                        })
                    }else if(vm.navigationPath==='012'){
                        // vm.$router.push({
                        //     path:'/Cost/management'//成本管理
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'012','01205','/Cost/wuliaoList','01201','/Cost/management','01202','/Cost/goujianList','01203','/Cost/quantities' )
                            // ,'01204','/Cost/inventory'
                        })
                    }
                    // else if(vm.navigationPath==='021'){
                    //     // vm.$router.push({
                    //     //     path:'/Cost/management'//成本管理//无锡市政院
                    //     // })
                    //     this.$router.push({
                    //         path:this.firstGetSecondGradeList(this.moduleLists,'021','02105','/Cost/wuliaoList')
                    //     })
                    // }
                    else if(vm.navigationPath==='016'){
                        // vm.$router.push({
                        //     path:'/liveConnect/fieldConnection'//现场连线
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'016','01602','/liveConnect/fieldMessage','01601','/liveConnect/fieldConnection','01603','/liveConnect/qualityChecking','01604','/liveConnect/qualityAcceptance')
                        })
                    }else if(vm.navigationPath==='011'){
                        // vm.$router.push({
                        //     path:'/metarialpurchase/productioncenter'//物资采购
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'011','01101','/metarialpurchase/productioncenter','01104','/metarialpurchase/fahuoManage','01103','/metarialpurchase/dinghuoManage','01105','/metarialpurchase/checked','01102','/metarialpurchase/wuliaopurchase')
                        })
                    }else if(vm.navigationPath==='006'){
                        // vm.$router.push({
                        //     path:'/constructionSite/safetyInspection'//安全管理
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'006','00604','/constructionSite/safetyInspection','00601','/constructionSite/safetyCheckings','00602','/constructionSite/safetyRuning','00603','/constructionSite/remoteVideo')
                        })
                    }else if(vm.navigationPath==='066'){
                        this.$router.push({
                            path:'/safetyInspection/safetyInspection'//基坑监测
                        })
                    }else if(vm.navigationPath==='002'){
                        // vm.$router.push({
                        //     path:'/Drive/costover'//文档管理
                        // })
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'002','00201','/Drive/costover','00202','/Drive/cloudDrive','00203','/Drive/Share','00204','/Drive/PersonalTransit')
                        })
                    }else if(vm.navigationPath==='009'){
                        // vm.$router.push({
                        //     path:'/Drive/costover'//空间管理
                        // })
                    }else if(vm.navigationPath==='010'){
                        // vm.$router.push({
                        //     path:'/Drive/costover'//资产管理
                        // })
                    }else if(vm.navigationPath==='052'){
                         this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'052','05201','/entranceCheck/todayAttendRecord','05202','/entranceCheck/monthAttendRecord','05203','/entranceCheck/entranceRecord')
                        })
                    }else if(vm.navigationPath==='053'){
                    }else if(vm.navigationPath==='054'){
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'054','05401','/safetyEducation/visitorSafety','05402','/safetyEducation/safeEducation','05403','/safetyEducation/safeTechnology')
                            
                        })
                    }
                    else if(vm.navigationPath==='055'){
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'055','05501','/honestyManagement/allEvaluate','05502','/honestyManagement/goodRecord','05503','/honestyManagement/badRecord','05504','/honestyManagement/complaintHandling')
                        })
                    }else if(vm.navigationPath==='056'){
                        this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'056','05601','/visitorRegister/visitorRegister','05602','/visitorRegister/carRegister')
                        })
                    }else if(vm.navigationPath==='057'){

                    }else if(vm.navigationPath==='001'){

                        vm.$router.push({
                            // path:this.firstGetSecondGradeList(this.moduleLists,'001','00101','/setting/initalsettings','00102','/setting/datatransform','00103','/setting/jobmanage','00104','/setting/projectstationmanage'),
                            path:'/setting/initalsettings'//配置中心
                        })
                    }
                    this.ellist=this.getSecondGradeList(this.moduleLists,'001','00101','00102','00103','00105','00104','00106')
            }
        },
        getSecondGradeList(itemList,oneGradeCode,Code1,Code2,Code3,Code4,Code5,Code6){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShowUrl','/setting/initalsettings');
                        let routerLink1=[];
                        routerLink1.push(
                            {
                                title:'/setting/initalsettings',
                                linkUrl:'工程初始配置信息'
                            },
                            // {
                            //     title:'/setting/groundsettings',
                            //     linkUrl:'场地与单体初始化'
                            // },
                            // {
                            //     title:'/setting/pageinital',
                            //     linkUrl:'层级管理初始化'
                            // },
                            // {
                            //     title:'/setting/hierarchicalManagement',
                            //     linkUrl:'层级管理初始化'
                            // }
                        )
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShowUrl','/setting/datatransform');
                        let routerLink2=[];
                        routerLink2.push(
                            // {
                            //     title:'/setting/datatransform',
                            //     linkUrl:'数据传递标准概览'
                            // },
                            // {
                            //     title:'/setting/professional',
                            //     linkUrl:'专业工种分类编码'
                            // },
                            // {
                            //     title:'/setting/worktool',
                            //     linkUrl:'作业工具分类编码'
                            // },
                            // {
                            //     title:'/setting/constructordesignmapped',
                            //     linkUrl:'设计构件分类映射'
                            // },
                            {
                                title:'/setting/constructordesigncode',
                                linkUrl:'设计构件分类编码'
                            },
                            {
                                title:'/setting/projectsubmit',
                                linkUrl:'工程招标分类编码'
                            }
                            // {
                            //     title:'/setting/wuliaoList',
                            //     linkUrl:'楼层物料量清单'
                            // }
                            // {
                            //     title:'/setting/materialpurchase',
                            //     linkUrl:'物资采购分类编码'
                            // },
                            // {
                            //     title:'/setting/buildingproperty',
                            //     linkUrl:'构件属性语意编码'
                            // }
                        )
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShowUrl','/setting/jobmanage');
                        let routerLink3=[];
                        routerLink3.push(
                            {
                                title:'/setting/jobmanage',
                                linkUrl:'岗位管理'
                            },
                            {
                                title:'/setting/groupmanage',
                                linkUrl:'群组管理'
                            },
                            {
                                title:'/setting/usermanage',
                                linkUrl:'用户管理'
                            },
                        )
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShowUrl','/setting/safeManageClassify');
                        let routerLink4=[];
                        routerLink4.push(
                            // {
                            //     title:'/setting/projectstationmanage',
                            //     linkUrl:'工程动态管理'
                            // },
                            // {
                            //     title:'/setting/projectloggermanage',
                            //     linkUrl:'工程日志管理'
                            // }
                            {
                                title:'/setting/safeManageClassify',
                                linkUrl:'安全检查分类'
                            },
                            {
                                title:'/setting/qualityManageClassify',
                                linkUrl:'质量检查分类'
                            }
                        )
                        vm.$set(item,'routerLink',routerLink4);
                    }
                     if(item.moduleCode==Code5){
                        vm.$set(item,'isShowUrl','/setting/projectstationmanage');
                        let routerLink4=[];
                        routerLink4.push(
                            {
                                title:'/setting/projectstationmanage',
                                linkUrl:'工程动态管理'
                            },
                            {
                                title:'/setting/projectLableManage',
                                linkUrl:'工程任务标签管理'
                            }
                            // {
                            //     title:'/setting/projectloggermanage',
                            //     linkUrl:'工程日志管理'
                            // }
                            // {
                            //     title:'/setting/safeManageClassify',
                            //     linkUrl:'安全检查分类'
                            // },
                            // {
                            //     title:'/setting/qualityManageClassify',
                            //     linkUrl:'质量检查分类'
                            // }
                        )
                        vm.$set(item,'routerLink',routerLink4);
                    }

                    if(item.moduleCode==Code6){
                         vm.$set(item,'isShowUrl','settings/accessControl');
                        let routerLink3=[];
                        routerLink3.push(
                            // {
                            //     title:'/setting/accessControl',
                            //     linkUrl:'门禁管理'
                            // },
                            {
                                title:'/setting/icCordControl',
                                linkUrl:'IC卡管理'
                            },
                            {
                                title:'/setting/faceAndfingerInput',
                                linkUrl:'人脸及指纹管理'
                            },
                            {
                                title:'/setting/controlVideo',
                                linkUrl:'监控视频管理'
                            },
                            {
                                title:'/setting/carManage',
                                linkUrl:'车辆管理'
                            },
                            {
                                title:'/setting/attendManage',
                                linkUrl:'考勤管理'
                            }
                        )
                        vm.$set(item,'routerLink',routerLink3);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
         //第一次加载二级标题生成函数
        firstGetSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4,Code5,routerLink5){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                    if(item.moduleCode==Code5){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink5);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList[0].routerLink;
        },
        // testIndex(){  
        //     var vm=this;
        //     var a=vm.firstGetSecondGradeList(vm.moduleLists,'016','01602','/liveConnect/fieldMessage','01601','/liveConnect/fieldConnection','01603','/liveConnect/qualityChecking','01604','/liveConnect/qualityAcceptance')
        // },
        //排序函数
        // compare(property) {
        //     return function(a, b) {
        //         var value1 = a[property];
        //         var value2 = b[property];
        //         return value1 - value2;
        //     }
        // },
        handMenus(val){
            // console.log('触发000')
            window.open(val,'_blank')

        },
        handleClick(tab,event){
            this.settingsCenter = true;
            //  * 工程首页 （007）、进度计划（005）、设计管理（004）、
            //      * 成本管理（012）、物资采购（011）、安全管理（013）、
            //      * 施工现场（006）、文档管理（002）、空间管理（009）、
            //      * 资产管理（010）、配置中心（001）
            // console.log(tab,event);
            if(tab.name === '007'){
                this.$router.push({
                    path:'/home/projHome/'+this.projId
                });
                this.navigationPath = tab.name;
                // this.webGlShow=true;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.name === '005'){
                // this.$router.push({
                //     path:'/SchedulePlan/personalCalendar'
                // });
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'005','00501','/SchedulePlan/personalCalendar','00502','/SchedulePlan/resourcePlan','00503','/SchedulePlan/taskIndex','00504','/SchedulePlan/calendarConfig','00505','/SchedulePlan/simulation')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.name === '004'){
                // this.$router.push({
                //     path:'/Design/management'
                // });
                 this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'004','00401','/Design/management','00402','/Design/drawingReview','00403','/Design/attributeManager','00404','/Design/designversion')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '012'){
                // this.$router.push({
                //     path:'/Cost/management'
                // })
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'012','01205','/Cost/wuliaoList','01201','/Cost/management','01202','/Cost/goujianList','01203','/Cost/quantities','01204','/Cost/inventory')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '011'){
                // this.$router.push({
                //     path:'/metarialpurchase/productioncenter'//物资采购
                // })
                // console.log('pppp');
                // console.log(this.moduleLists,'pppp1')
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'011','01101','/metarialpurchase/productioncenter','01102','/metarialpurchase/wuliaopurchase','01103','/metarialpurchase/dinghuoManage','01104','/metarialpurchase/fahuoManage','01105','/metarialpurchase/checked')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name ==='016'){
                // this.$router.push({
                //     path:'/liveConnect/fieldConnection'
                // })
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'016','01602','/liveConnect/fieldMessage','01601','/liveConnect/fieldConnection','01603','/liveConnect/qualityChecking','01604','/liveConnect/qualityAcceptance')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)

            }
            else if(tab.name === '006'){
                // this.$router.push({
                //     path:'/constructionSite/safetyInspection'
                // })
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'006','00604','/constructionSite/safetyInspection','00601','/constructionSite/safetyCheckings','00602','/constructionSite/safetyRuning','00603','/constructionSite/remoteVideo')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '066'){
                this.$router.push({
                    path:'/safetyInspection/safetyInspection'//基坑监测
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '002'){
                // this.$router.push({
                //     path:'/Drive/costover'
                // });
                this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'002','00201','/Drive/costover','00202','/Drive/cloudDrive','00203','/Drive/Share','00204','/Drive/PersonalTransit')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '017'){
                 this.$router.push({
                    path:this.firstGetSecondGradeList(this.moduleLists,'017','01701','/qualityManage/qualityManage')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)

            }else if(tab.name === '015'){
                this.navigationPath = tab.name;
                // sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '052'){
                 this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'052','05201','/entranceCheck/todayAttendRecord','05202','/entranceCheck/monthAttendRecord','05203','/entranceCheck/entranceRecord')
                    })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.name === '053'){
                this.$router.push({
                    path:'/videoControl/videoControl'
                });
                this.navigationPath = tab.name;
                // sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '054'){
                this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'054','05401','/safetyEducation/visitorSafety','05402','/safetyEducation/safeEducation','05403','/safetyEducation/safeTechnology')
                            // ,'01204','/Cost/inventory'
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '055'){
                this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'055','05501','/honestyManagement/allEvaluate','05502','/honestyManagement/goodRecord','05503','/honestyManagement/badRecord','05504','/honestyManagement/complaintHandling')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name ==='056'){
                // this.$router.push({
                //     path:'/liveConnect/fieldConnection'
                // })
                // this.$router.push({
                //     path:this.firstGetSecondGradeList(this.moduleLists,'016','01602','/liveConnect/fieldMessage','01601','/liveConnect/fieldConnection','01603','/liveConnect/qualityChecking','01604','/liveConnect/qualityAcceptance')
                // })
                 this.$router.push({
                            path:this.firstGetSecondGradeList(this.moduleLists,'056','05601','/visitorRegister/visitorRegister','05602','/visitorRegister/carRegister')
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)

            }
            else if(tab.name === '057'){
                this.$router.push({
                    path:'/projectPerson/projectPerson'
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.name === '001'){
                this.$router.push({
                    // path:this.firstGetSecondGradeList(this.moduleLists,'001','00101','/setting/initalsettings','00102','/setting/datatransform','00103','/setting/jobmanage','00104','/setting/projectstationmanage'),
                    path:this.settingActive
                })
                this.navigationPath = tab.name;
                this.settingsCenter = false;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }
            else {
                // this.navigationPath=sessionStorage.getItem('navigationPath');
                // this.settingsCenter = false;
                this.menusInfoData.forEach((item)=>{
                    if(tab.name==='000'){
                        this.navigationPath=tab.name;
                        let menusUrl=item.url;
                        if(menusUrl.indexOf('?')>-1){
                            menusUrl=menusUrl+'&userName='+localStorage.getItem('userName2')+'&userName2='+this.userNames
                        }else{
                            menusUrl=menusUrl+'?userName='+localStorage.getItem('userName2')+'&userName2='+this.userNames
                        }
                        window.open(menusUrl,'_blank');
                        window.location.reload(true);
                    }
                })
            }
        },
        selectIndex(index,indexPath){
            // console.log(index,'index');
            // console.log(indexPath,'indexPath');
            this.settingActive = index;
            sessionStorage.setItem('settingActive',this.settingActive);
        }
    }
}
</script>
<style scoped>
    
    /* img{
        transform:rotateX(90deg);
        } */
    a{
        text-decoration: none;
        display: inline-block;
    }
     .imageBodyMid{
        text-align: left;
        }
    .imageBodyMid .imageBodyTextMid{
            color: #666;
            font-size: 14px;
            line-height: 14px;
            font-weight: normal;
            display: inline-block;
            margin-right: 20px;
            margin-left: 94px;
            text-align: right;
    }
    .wrapper{
        width: 100%;
        height: 100%;

        /* overflow: hidden; */
    }
    .header{
        height: 68px;
        background: #25282d;
        overflow: hidden;
        display: flex;
    }
    .headerImg{
        width: 200px;
        height: 50px;
        margin:10px 5px;
    }
    #pane-projectPage{
        margin-top: 35px;
        margin-left:20px;
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
        width: 86px;
        height: 68px;
        display: flex;
        justify-content: center;
        align-items: center;
        
        cursor: pointer;
    }
    .headerInfo:hover .infoHover{
        visibility: visible;
    }
    .infoHover{
        width: 180px;
        height: 112px;
        position: absolute;
        top: 68px;
        right: 5px;
        background: #fff;
        visibility: hidden;
        box-shadow:-2px 2px 2px 2px #d9d9d9 ;
        border-radius: 5px;
        z-index: 10;
    }
    .infoHover .p1{
        border-bottom: 1px solid #e6e6e6;
        height: 60px;
        line-height: 60px;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        padding-left: 28px;
        margin: 0;
    }
    .infoHover .p2{
        height: 50px;
        line-height: 50px;
        margin: 0;
        color: #666666;
        font-size:14px;
        font-weight: normal;
        text-align: left;
        margin-left: 28px;
    }
    .infoHover .btn{
        width: 100%;
    }
    .headerInfo:hover{
        background: #343a43;
    }
    .headerInfoImg{
        width: 48px;
        height: 48px;
        border-radius: 48px;
    }

    .headerInfoText{
        color: white;
        height: 100%;
        width: 25%;
        float: left;
        line-height:70px;;
    }
    .logout{
        width: 20%;
        float: left;
        line-height: 50px;
        margin:10px;
    }
    .logout img{
        position: relative;
        top: 7px;
    }
    /* 侧边栏 */
    .contentBody{
        /* display: flex; */
        /* background-color: #333; */
        height:100%;
        position: relative;
        /* overflow-y: auto; */
    }
    .sideBar{
        width: 25px;
        min-width: 25px;
        background: #f5f7fa;
        border-right: 1px solid #cccccc;
        position: fixed;
        top: 68px;
        left: 0;
        bottom: 0;
        z-index: 100;
    }
    .sideBar img{
        position: relative;
        top: 22px;
    }
    /* 导航栏 */
    .content{
        width: 100%;
        position: relative;
    }
    .creatMid{
        position: absolute;
        top:9px;
        color:black;
        font-size: 14px;
        right: 188px;
        cursor: pointer;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 4px;
        
    }
    .creatMid :hover{
        border:1px soild black;
        color:#ccc;
    }

    .downWebGl{
        /* position: fixed; */
        position:absolute;
        top:-40px;
        right:100px;
        z-index: 10000000;
        color: #7a818a;
        cursor: pointer;
        font-size: 14px;
    }
    .webGlDownBtn{
        width: 12px;
        height: 12px;
         background:url('./ManageCost/images/arror.png')no-repeat 0 0; 
        float: right;
        cursor: pointer;
        transition:  all ease .2s;
        transform: rotate(180deg);
        margin-top:5px;
        margin-left:7px;
        }
    .active{
            transform: rotate(0deg);
    }
    .webglLeft{
        width: 2.5%;
        height: 800px;
        position: absolute;
        left: 0px;
       background-color: rgba(34, 34, 34, 0.72);
       box-sizing: border-box;

    }
    .webglRight{
         width: 2.5%;
         box-sizing: border-box;
        height: 800px;
        position: absolute;
        right: 0px;
        top:0px;
        background-color: rgba(34, 34, 34, 0.72)

    }
    #webgl{
       	height: 800px;
        width: 94%;
        margin:0 auto;
        /* margin-top: 60px; */
        display: inline-block;
        z-index: 10;
        /* background-color:#333333; */
        /* border:1px solid #666; */
        /* overflow-y: auto; */
        /* transition: all 10s ease; */
    }
    .webglBackground{
         width: 100%;
         height: 810px;
         position: relative;
        background-color:#333333;
    }
    .navigation1{
        height: 48px;
        width: 100%;
        /* margin-top: 392px; */
        float: left;
        background: #fff;
        transition: all 0.7s ease;
    }
    .settingsRight{
        position: absolute;
        top: 48px;
        left: 212px;
        bottom: 0px;
        right: 0px;
    }
    ::-webkit-scrollbar{width:0px}
    /* 工程列表 */

    .title span{
        font-size: 14px;
        display: inline-block;
        margin-left: 20px;
    }
    .btn{
        float: right;
        margin-top: 10px;
    }
    .projectListBtn{
        width: 20%;
        float: left;
    }
    .title{
        width: 100%;
        text-align: left;
        font-size: 16px;
    }
    .projectList img{
        width: 50px;
        height: 50px;
        border-radius:50px; 
        margin-top: 10px;
    }
    .projectBottom{
        width: 100%;
        font-size: 12px;
        font-family: '微软雅黑';
        overflow: hidden;
        color: #ccc;
        margin-top: 20px;
    }
    .projectBottom label{
        display: inline-block;
        width: 30%;
        margin-left: 20px;
    }
    /* 轮播图 */
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    /*设计管理*/
    .el-menu-item{
        padding: 0;
        margin: 0 20px;
    }
    /*配置中心*/
    .settings{
        width: 100%;
        overflow: auto;
        display: flex;
        min-height: 100vh;
       
    }
    .settingsLeft{
        z-index: 100;
         background: #fafafa;
        border-right:1px solid #ccc; 
        position: absolute;
        top:48px;
        left:2px;
        bottom: 0px;
        right: 0px;
        width: 192px;
        height: 800px;
    }
    
    .settingsCenter{
      margin-left: 0px!important;
      width:100% !important;
       display: block;
        margin-left: 219px;
        float: left;
        /* height: 800px;
        overflow-y: auto;
        overflow-x: hidden; */
    }
    .settingsLeft h5{
        width:100%;
        font-family: 'MicrosoftYaHei';
        font-weight: bold;
        color: #333;
        margin: 0px 0 0 0;
        padding: 20px 0 14px 0;
        font-size: 16px;
        line-height: 16px;
        border-bottom: 1px solid #e0e0e0;
    }

    .el-menu{
        border: none;
    }
    .el-submenu__title{
        background: #ccc;
        height: 50px;
    }
    .el-menu--horizontal>.el-menu-item{
        height: 40px;
        line-height: 40px;
    }
    .el-menu--horizontal>.el-menu-item.is-active{
        border-bottom: 2px solid red;
    }
    .projectListTextName{
        font-size: 18px;
        font-family: '微软雅黑';
        font-weight: bold;
    }
    .settingsLeft .el-menu-item-group{
        background: #ececec;
    }
    .settingsLeft .el-submenu span{
        width: 124px;
        display: inline-block;
        margin-left: -10px;
        text-align: left;
    }
    .el-tabs__item{
        font-size: 14px;
        font-family: 'MicrosoftYaHei';
        color: #333333;
    }
    .el-tabs__item.is-active{
        font-weight: bold;
    }
    .is-opened .el-submenu__title{
        border-left: 4px solid #df0010;
        background: #7a818a;
    }
    .settingsLeft .el-menu-item-group{
        background: #ececec;
    }
    .settingsLeft .el-submenu span{
        width: 140px;
        height: 50px;
        line-height: 50px;
        display: inline-block;
        margin-left: -10px;
        text-align: left;
    }
</style>


