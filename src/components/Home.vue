<template>
    <div class="wrapper" ref="allHeight">
      <!--2018/3/21 付伟超修改-->
        <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' ></headerCommon>
        <div class="contentBody">
            <div class="downWebGl" @click="webGlbtn">虚拟场景<i :class="[{'active':webGlShow},'webGlDownBtn']"></i></div>
            <div v-show="webGlShow" class="webglBackground">
                <div id="webgl" v-show="webGlShow">
                    <!-- <iframe v-show="webGlShow" ref="iframe1" id="webIframe" name="ifd" height="800px" frameborder="no" border="0" marginwidth="0" marginheight="0"  width="100%" src="http://10.252.26.240:8080/genDist/index.html"  ></iframe> -->
                    <iframe v-show="webGlShow" ref="iframe1" id="webIframe" name="ifd" height="800px" frameborder="no" border="0" marginwidth="0" marginheight="0"  width="100%" :src="iframeUrl"  ></iframe>
                </div>
            </div>
            <div  class="main">
                <div class="content">
                    <el-row class="navigation1">
                        <el-col :span="24">
                            <el-tabs  v-model="navigationPath" @tab-click="handleClick">
                                <el-tab-pane label="工程首页" name="projectPage" v-if="auth.homePage">
                                </el-tab-pane>
                                <el-tab-pane label="进度计划" name="plan" v-if="auth.progress"></el-tab-pane>
                                <el-tab-pane label="设计管理" name="designManager" v-if="auth.design"></el-tab-pane>
                                <el-tab-pane label="成本管理" v-if="auth.costManagement" name="costManage"></el-tab-pane>
                                <el-tab-pane label="物资采购" v-if="auth.materialPurchasing" name="materialPurchase"></el-tab-pane>
                                <el-tab-pane label="施工现场" v-if="auth.constructionSite" name="construction"></el-tab-pane>
                                <el-tab-pane label="文档管理" v-if="auth.docManagement" name="documentManager"></el-tab-pane>
                                <el-tab-pane label="配置中心"  v-if="auth.configurationCenter" name="settings"></el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <div  class="settingsLeft" v-if="!settingsCenter" ref="settingsL">
                        <h5>工程配置中心</h5>
                        <el-menu :default-active="settingActive"  router :unique-opened="true"  @select="selectIndex">
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
                        </el-menu>
                    </div>
                    <div :class="[{'settingsCenter':settingsCenter},{'settingsRight':!settingsCenter}]">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import headerCommon from './header.vue'
import axios from 'axios'
var app
export default {
    name:'Home',
    components: {
      headerCommon
    },
    data(){
        window.addEventListener("message", (evt)=>{this.callback(evt)});
        return{
            url:'http://10.252.26.240:8080/genDist/',
            BDMSUrl:'',
            settingsCenter:true,//是否是两边铺满
            header:{
                userName:'',
                userId:'', 
                //projectName:'华建Q系列工程协同应用系统',
                projectName:'',
                projectImg:'',
            },          
            navigationPath:'projectPage',
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
                safetyManagement:false,
                constructionSite:false,
                docManagement:false,
                spaceManagement:false,
                assetManagement:false,
                configurationCenter:false
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
        }
    },
    created(){
        var vm = this
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.subProjId=localStorage.getItem('defaultSubProjId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.WebGlUrl=vm.$store.state.WebGlUrl;
        vm.QJFileManageSystemURL=vm.$store.state.QJFileManageSystemURL;
        vm.BIMServerPort=vm.$store.state.BIMServerPort;
         vm.iframeUrl=vm.$store.state.iframeWebGlUrl;
        vm.navigationPath = sessionStorage.getItem('navigationPath');
        vm.settingActive = sessionStorage.getItem('settingActive');
        if(!vm.navigationPath){
            vm.navigationPath='projectPage';
        }
        if(!vm.settingActive){
            vm.settingActive='/setting/initalsettings';
        };
        vm.settingsCenter = vm.$route.meta.settingsCenter?false:true
        vm.token  = localStorage.getItem('token')
        vm.getPJDetial(vm.projId);
        // this.getInitdata();
    },
    mounted(){
        var height = ''
        if(document.documentElement.clientHeight){
            this.cHeight = document.documentElement.clientHeight;
        }else{
           this.cHeight = document.body.clientHeight;
        }
    },
    computed:{
        path(){
            return this.$store.state.path;
        },
    },
    methods:{
        webGlbtn(){
            this.webGlShow=!this.webGlShow;
             setTimeout(()=>{
                    app = this.$refs.iframe1.contentWindow;
                    app.postMessage({command:"Init",parameter:null},"*");
            },0)
        },
        callback(e){
            switch(e.data.command){
			case "EngineReady":
				{
					let Horder = {"ID":this.WebGlId,"Type":this.WebGlType,"Name":this.WebGlName,"ParentID":""};
					let para = {User:"",TokenID:"",Setting:{BIMServerIP:this.WebGlUrl,BIMServerPort:this.BIMServerPort,MidURL:"qjbim-mongo-instance",RootHolder:Horder}}
					app.postMessage({command:"EnterProject",parameter:para},"*");
				}
				break;
			case "CurrentSelectedEnt":
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

        changeFrameHeight(){
            var ifm= document.getElementById("webIframe"); 
            ifm.height=document.documentElement.clientHeight;
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
                    this.getWebGlDrawingList.forEach((item)=>{
                        if(this.GetDrawingBackList.holderID==item.holderId){
                            if(this.GetDrawingBackList.GCodeList.length!=0){
                                
                                for(var i=0;i<this.GetDrawingBackList.GCodeList.length;i++){
                                    if((this.GetDrawingBackList.GCodeList)[i]==item.directory){
                                        this.drawingWebGlId=item.id;
                                        this.drawingWebGlIdList.push(this.drawingWebGlId);
                                    }
                                }
                            }else{
                                this.drawingWebGlId=item.id;
                                this.drawingWebGlIdList.push(this.drawingWebGlId);
                            }
                            // console.log(this.drawingWebGlIdList,'drawingWebGlIdList');
                        }
                    })
                   
                    if(this.drawingWebGlIdList.length!=0){
                        this.getMaxVersionPath();
                     }
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
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
                                console.log(item.drawingId,'234');
                                this.getDrawingRotateInfo(item.drawingId);
                                  this.drawList.push({
                                        name:item1.drawingNumber+'('+item1.drawingName+')',
                                        type:(item.fileUri.substr(item.fileUri.length-3)).toLocaleUpperCase(),
                                        source:this.QJFileManageSystemURL+item.fileUri,
                                        page:1,
                                        angle:0
                                })
                            }
                        })
                    })
                    // console.log(this.drawList,'最后的东西');
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
             axios({
                url:vm.BDMSUrl+'dc/drawingReview/getDrawingRotateInfo',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                   drawingId:val,
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    if(response.data.rt){
                        this.rotate=response.data.rt.rotateInfo;
                    }
                }else{
                    
                } 
            })

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
                url:vm.BDMSUrl+'project2/index?projId='+key,
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
                    vm.header.projectName = response.data.rt.project?response.data.rt.project.projName:'';
                    localStorage.setItem('projectName',vm.header.projectName);
                    
                    vm.header.projectImg = response.data.rt.projectImage?response.data.rt.projectImage.filePath:'';
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
                    vm.getUserInfo();
                    vm.getInitdata();
                }
            }).catch((err)=>{
                console.log(err)
            }) 
        },
        getUserInfo(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/getOnlineInfo',
                params:{
                    refresh:Math.random()/*IE11浏览器会默认从缓存里取数据*/
                },
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token,
                },
            }).then((response)=>{
                vm.header.userName = response.data.rt.onlineInfo.userName
                vm.header.userId = response.data.rt.onlineInfo.userId
                localStorage.setItem('userName',vm.header.userName)
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
                var id = localStorage.getItem('projId');
                localStorage.setItem('projAuth',response.data.rt.onlineInfo.projAuth[id])
                for(var i=0;i<response.data.rt.onlineInfo.projAuth[id].length;i++){
                    var arr = response.data.rt.onlineInfo.projAuth[id][i].substr(0,3)
                    switch(arr){
                        case "007":
                            vm.auth.homePage = true
                        break;
                        case "005":
                            vm.auth.progress = true
                        break;
                        case "004":
                            vm.auth.design = true
                        break;
                        case "012":
                            vm.auth.costManagement = true
                        break;
                        case "011":
                            vm.auth.materialPurchasing = true
                        break;
                        case "013":
                            vm.auth.safetyManagement = true
                        break;
                        case "006":
                            vm.auth.constructionSite = true
                        break;
                        case "002":
                            vm.auth.docManagement = true
                        break;
                        case "009":
                            vm.auth.spaceManagement = true
                        break;
                        case "010":
                            vm.auth.assetManagement = true
                        break;
                        case "001":
                            vm.auth.configurationCenter = true
                        break;
                    }
                }
                //遍历判断
                if(vm.$route.query.firstView == 'Y'){
                    if(vm.auth.homePage){
                        // vm.$router.push({
                        //     path:'/SchedulePlan/personalCalendar'//进度计划；
                        // })
                        // this.$router.push({
                        //     path:'/home/projHome/'+this.projId
                        // });
                    }else if(vm.auth.progress){
                        vm.$router.push({
                            path:'/SchedulePlan/personalCalendar'//进度计划；
                        })
                    }else if(vm.auth.design){
                        vm.$router.push({
                            // path:'/Design/management'//设计管理
                            path:'/Design/drawingReview'
                        })
                    }else if(vm.auth.costManagement){
                        vm.$router.push({
                            path:'/Cost/management'//成本管理
                        })
                    }else if(vm.auth.materialPurchasing){
                        vm.$router.push({
                            path:'/Drive/costover'//物资采购
                        })
                    }else if(vm.auth.safetyManagement){
                        vm.$router.push({
                            path:'/Drive/costover'//安全管理
                        })
                    }else if(vm.auth.constructionSite){
                        vm.$router.push({
                            path:'/constructionSite/fieldConnection'//施工现场
                        })
                    }else if(vm.auth.docManagement){
                        vm.$router.push({
                            path:'/Drive/costover'//文档管理
                        })
                    }else if(vm.auth.spaceManagement){
                        vm.$router.push({
                            path:'/Drive/costover'//空间管理
                        })
                    }else if(vm.auth.assetManagement){
                        vm.$router.push({
                            path:'/Drive/costover'//资产管理
                        })
                    }else if(vm.auth.configurationCenter){
                        vm.$router.push({
                            path:'/setting/initalsettings'//配置中心
                        })
                    }
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        handleClick(tab,event){
            this.settingsCenter = true;
            if(tab.label === '工程首页'){
                this.$router.push({
                    path:'/home/projHome/'+this.projId
                });
                this.navigationPath = tab.name;
                // this.webGlShow=true;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.label === '进度计划'){
                this.$router.push({
                    path:'/SchedulePlan/personalCalendar'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.label === '设计管理'){
                this.$router.push({
                    // path:'/Design/management'
                    path:'/Design/drawingReview'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '成本管理'){
                this.$router.push({
                    path:'/Cost/management'
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '物资采购'){
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
                this.$router.push({
                    path:'/metarialpurchase/productioncenter'//物资采购
                })
            }else if(tab.label === '施工现场'){
                this.$router.push({
                    path:'/constructionSite/fieldConnection'
                })
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)

            }else if(tab.label === '文档管理'){
                this.$router.push({
                    path:'/Drive/costover'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '设施维保'){
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '配置中心'){
                this.$router.push({
                    path:this.settingActive
                })
                this.navigationPath = tab.name;
                this.settingsCenter = false;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }
        },
        selectIndex(index,indexPath){
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
    #webgl{
       	height: 800px;
        width: 95%;
        margin:0 auto;
        /* margin-top: 60px; */
        display: inline-block;
        z-index: 10;
        background-color:#333333;
        /* border:1px solid #666; */
        /* overflow-y: auto; */
        transition: all 10s ease;
    }
    .webglBackground{
         width: 100%;
         height: 810px;
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
      margin-left: 26px!important;
      width:98% !important;
       display: block;
        margin-left: 219px;
        float: left;
        height: 800px;
        overflow-y: auto;
        overflow-x: hidden;
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


