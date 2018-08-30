<template>
    <div class="wrapper" ref="allHeight">
      <!--2018/3/21 付伟超修改-->
        <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' :proimg='header.projectImg' :userimg='header.userImg'></headerCommon>
        
        <div class="contentBody">

            <!-- <div class="sideBar" ref="sideB">
                <a href="#" >
                    <img src="../assets/arrow-left.png"/>
                </a>
            </div> -->
            <div class="downWebGl" @click="btn12">虚拟场景<i><img style="margin-left=3px;" src="./Settings/images/sanjiao.png"/></i></div>
            <!-- <button class="backTop">回到顶部</button> -->
            <div v-show="webGlShow" class="webglBackground">
                <div id="webgl" v-show="webGlShow">
                    <iframe  ref="iframe1" :class="[{'webIframe':webGlShow},'webIframe1']" name="ifd"   frameborder="no" border="0" marginwidth="0" marginheight="0"  width="100%" src="http://10.252.26.240:8080/genDist/index.html"  ></iframe>
                </div>
            </div>
            <div  class="main">
                <div class="content">
                    <el-row class="navigation1">
                        <el-col :span="24" >
                            <!-- <button @click="btn12">下拉</button> -->
                            <el-tabs  v-model="navigationPath" @tab-click="handleClick">
                                <el-tab-pane label="工程首页" name="projectPage" v-if="auth.homePage">
                                </el-tab-pane>
                                <el-tab-pane label="进度计划" name="plan" v-if="auth.progress"></el-tab-pane>
                                <el-tab-pane label="设计管理" name="designManager" v-if="auth.design"></el-tab-pane>
                                <el-tab-pane label="成本管理" v-if="auth.costManagement" name="costManage"></el-tab-pane>
                                <el-tab-pane label="物资采购" v-if="auth.materialPurchasing" name="materialPurchase"></el-tab-pane>
                                <el-tab-pane label="施工现场" v-if="auth.constructionSite" name="construction"></el-tab-pane>
                                <el-tab-pane label="文档管理" v-if="auth.docManagement" name="documentManager"></el-tab-pane>
                                <el-tab-pane label="配置中心"  v-if="auth.configurationCenter" name="settings">
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <div :class="[{'settingsCenter':settingsCenter},{'settingsRight':!webGlShow},{'settingsRight1':webGlShow}]" >
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
            settingsCenter:true,//是否是两边铺满
            header:{
                 userName:'',
                 userId:'', 
                 projectName:'华建Q系列工程协同应用系统',
                 projectImg:'',
                 userImg:''
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
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            webGlShow:false,
            InitdataList:'',
            WebGlId:'',
            WebGlUrl:'',
            WebGlType:'',
            WebGlName:'',
        }
    },
    created(){
        var vm = this
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.subProjId=localStorage.getItem('defaultSubProjId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.WebGlUrl=vm.$store.state.WebGlUrl
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
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.getPJDetial(vm.projId);
        this.getInitdata();
        
        // this.getInitdata();
    },
    mounted(){
        var height = ''
        if(document.documentElement.clientHeight){
            this.cHeight = document.documentElement.clientHeight;
        }else{
           this.cHeight = document.body.clientHeight;
        }
    //    this.$refs.iframe1.style.height = this.cHeight+'px';
        
        // this.$refs.settingsL.style.height = this.cHeight+'px';
    },
    computed:{
        path(){
            return this.$store.state.path;
        },
    },
    methods:{
        btn12(){
             console.log('fjd')
            //  localStorage.setItem('webGlShow',this.webGlShow)
            this.webGlShow=!this.webGlShow
            localStorage.setItem('webGlShow',this.webGlShow)
            // this.$router.push({
            //     params: {
            //     id:'123'
            //     }
            // })
            app = this.$refs.iframe1.contentWindow
            app.postMessage({command:"Init",parameter:null},"*");
        },
        callback(e){
           // console.log(e)
            switch(e.data.command){
			case "EngineReady":
				{
					// let Horder = {"ID":"5b7a2f4006f2ff0918083f6f","Type":6,"Name":"临港海洋","ParentID":""};
					// let Horder = {"ID":"5b7cbea206f2ff0918831301","Type":6,"Name":"临港海洋","ParentID":""};
                    let Horder = {"ID":this.WebGlId,"Type":this.WebGlType,"Name":this.WebGlName,"ParentID":""};
                    // console.log(Horder);
					let para = {User:"",TokenID:"",Setting:{BIMServerIP:this.WebGlUrl,BIMServerPort:"8080",MidURL:"qjbim-mongo-instance",RootHolder:Horder}}
					app.postMessage({command:"EnterProject",parameter:para},"*");
				}

				break;
			case "CurrentSelectedEnt":
				break;
			case "ViewpointSubmited":

				// ScreenPara = e.data.parameter
                break;
		    }
        },
        AddViewpoint(){
		    app.postMessage({command:"AddViewpoint",parameter:123},"*");
        },
         MoveToViewpoint(){
		    app.postMessage({command:"MoveToViewpoint",parameter:ScreenPara},"*");
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
                // cosole.log(this.WebGlId);
                this.WebGlType=this.InitdataList.StartViewPoint.CurrentHolder.Type;
                this.WebGlName=this.InitdataList.StartViewPoint.CurrentHolder.Name;

                // this.WebGlName=this.InitdataList.StartViewPoint.CurrentHolder.Name;
                // console.log(JSON.stringify(this.WebGlId));
                // console.log(this.InitdataList);
            }else if(response.data.cd=='-1'){
            }
            })
        },
        getPJDetial(key){
            var vm = this
            //console.log("look the proj_id")
            /*******
             * 谨记：
             * 获取路由params的写法是this.$route 不是this.$router!!!
             * ********/
            // console.log(vm.$route.params.id);
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/index?projId='+key,
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                //console.log(response);
                if(response.data.msg == "您没有登录或登录超时，请重新登录"){
                        vm.$router.push({
                        path:'/login'
                    })
                }else{
                    vm.header.projectName = response.data.rt.project?response.data.rt.project.projName:''
                    vm.header.projectImg = response.data.rt.projectImage?response.data.rt.projectImage.filePath:''
                    localStorage.setItem('defaultSubProjId',response.data.rt.defaultSubProjId)
                    // console.log(response.data.rt.defaultSubProjId+'1111')
                    vm.getUserInfo()
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
               // console.log('getUserInfo获取用户的姓名和项目权限')
                vm.header.userName = response.data.rt.onlineInfo.userName
                vm.header.userId = response.data.rt.onlineInfo.userId
                vm.header.userImg = response.data.rt.onlineInfo.imgUuid !=null?vm.QJFileManageSystemURL+response.data.rt.onlineInfo.imgUuid:''
                localStorage.setItem('userImg',vm.header.userImg)
                 localStorage.setItem('entType',response.data.rt.onlineInfo.entType)
                //  console.log(response.data.rt.defaultSubProjId)
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
                // console.log("check this out!!!")
                // console.log(new Date());
                var id = localStorage.getItem('projId');
                localStorage.setItem('entId',response.data.rt.onlineInfo.entId)
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
                        // console.log('首页')
                    }else if(vm.auth.progress){
                        vm.$router.push({
                            path:'/SchedulePlan/personalCalendar'//进度计划；
                        })
                    }else if(vm.auth.design){
                        vm.$router.push({
                            path:'/Design/management'//设计管理
                        })
                    }else if(vm.auth.costManagement){
                        vm.$router.push({
                            path:'/Cost/management'//成本管理
                        })
                    }else if(vm.auth.materialPurchasing){
                        vm.$router.push({
                            path:'/metarialpurchase/productioncenter'//物资采购
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
                // console.log("check this out!!!")
                // console.log(new Date());
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
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.label === '进度计划'){
                this.$router.push({
                    path:'/SchedulePlan/personalCalendar'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '设计管理'){
                this.$router.push({
                    path:'/Design/management'
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
                    path:'/metarialpurchase/productioncenter'
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
   a{
        text-decoration: none;
        display: inline-block;
    }
    .el-tabs__content{
        display: none;
    }
    .wrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
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
        z-index: 100;
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
         z-index: 100;
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
        height:100%;
        position: relative;
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
    }
    .sideBar img{
        position: relative;
        top: 22px;

    }
    /* 导航栏 */
    /* .main{
        flex: 1;
        overflow:auto;
        margin-left: 18px;
    } */
    .content{
        width: 100%;
        position: relative;
    }
    .webIframe1{
        height:0px;
        transition: all 0.5s ease;
    }
    .webIframe{
        /* position: fixed; */
        /* z-index:100000000000000; */
        height:800px;
        transition: all 0.5s ease;
    }
    /* .navigation{
        height:48px;
        width:100%;
        position: fixed;
        top: 68px;
        left: 26px;
        right: 0;
        background: #fff;
        z-index: 1000;
    } */
    .backTop{
        position: fixed;
        bottom:30px;
        left: 30px;
        border:1px solid #888;
    }
    .downWebGl{
        /* position: fixed; */
        position:absolute;
        top:-40px;
        right:100px;
        z-index: 10000000;
        color: #7a818a;
        cursor: pointer;
    }
    #webgl{
       	height: 800px;
        width: 95%;
        /* margin-top: 60px; */
        display: inline-block;
        /* overflow-y: auto; */
        transition: all 0.7s ease;
    }
    .webglBackground{
         width: 100%;
         height: 810px;
        background-color:#333333;
    }
    /* .navigation{
        height:48px;
        width:100%;
        position: fixed;
        top: 68px; 
        left: 26px;
        right: 0;
        background: #fff;
        z-index: 1000!important;
        transition: all 0.7s ease;
    } */
    .navigation1{
        height: 48px;
        width: 100%;
        /* margin-top: 392px; */
        float: left;
        background: #fff;
        /* z-index: 1000!important; */
        
        transition: all 0.7s ease;
    }
    /* .settingsCenter[data-v-fed36922] {
     margin-left: 26px!important;
    } */
    .settingsRight{
        display: block;
        /* margin-left: 219px; */
        /* margin-top: 116px; */
        transition: all 0.7s ease;
    }
    .settingsRight1{
        /* float: left;
        display: block; */
        /* margin-top: 486px; */
        height: 100%;
        /* overflow:auto; */
        transition: all 0.7s ease;
    }
    /* .navigation{
        height:48px;
        width:100%;
        position: fixed;
        top: 68px; 
        left: 26px;
        right: 0;
        background: #fff;
        z-index: 1000!important;
        transition: all 0.7s ease;
    }
    .navigation1{
        height:48px;
        width:100%;
        position: fixed;
        top: 590px; 
        left: 26px;
        right: 0;
        background: #fff;
        z-index: 1000!important;
        transition: all 0.7s ease;
    }
    .settingsRight{
        display: block;
        margin-left: 219px;
        margin-top: 116px;
        transition: all 0.7s ease;
    }
    .settingsRight1{
        top:635px;
        position: fixed;
        display: block;
        margin-left: 219px;
        height: 100%;
        overflow:auto;
        transition: all 0.7s ease;
    } */
</style>
