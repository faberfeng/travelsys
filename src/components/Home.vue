<template>
    <div class="wrapper" ref="allHeight">
      <!--2018/3/21 付伟超修改-->
        <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' :proimg='header.projectImg'></headerCommon>
        <div class="contentBody">
            <div class="sideBar" ref="sideB">
                <a href="#" >
                    <img src="../assets/arrow-left.png"/>
                </a>
            </div>
            <div  class="main">
                <div class="content">
                    <el-row class="navigation">
                        <el-col :span="24" >
                            <el-tabs  v-model="navigationPath" @tab-click="handleClick">
                                <el-tab-pane label="工程首页" name="projectPage" v-if="auth.homePage">
                                </el-tab-pane>
                                <el-tab-pane label="进度计划" name="plan" v-if="auth.progress"></el-tab-pane>
                                <el-tab-pane label="设计管理" name="designManager"></el-tab-pane>
                                <el-tab-pane label="成本管理" v-if="auth.costManagement" name="costManage"></el-tab-pane>
                                <el-tab-pane label="物资采购" v-if="auth.materialPurchasing" name="materialPurchase">物资采购</el-tab-pane>
                                <el-tab-pane label="施工现场" v-if="auth.constructionSite" name="construction">施工现场</el-tab-pane>
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
                    <div :class="[{'settingsCenter':settingsCenter},'settingsRight']">
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
export default {
    name:'Home',
    components: {
      headerCommon
    },
    data(){
        return{
            BDMSUrl:'',
            settingsCenter:true,//是否是两边铺满
            header:{
                 userName:'',
                 userId:'', 
                 projectName:'华建Q系列工程协同应用系统',
                 projectImg:'',
            },          
            navigationPath:'projectPage',
            activeIndex:'1',
            settingActive:'/setting/initalsettings',
            winHeight:'',
            screenWidth: document.documentElement.clientHeight,
            token:'',
            projId:'',
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
            }
        }
    },
    created(){
        var vm = this
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.BDMSUrl = vm.$store.state.BDMSUrl
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
    },
    mounted(){
        var height = ''
        if(document.documentElement.clientHeight){
            this.cHeight = document.documentElement.clientHeight;
        }else{
           this.cHeight = document.body.clientHeight;
        }
       // this.$refs.sideB.style.height = this.cHeight+'px';
        
        // this.$refs.settingsL.style.height = this.cHeight+'px';
    },
    computed:{
        path(){
            return this.$store.state.path;
        },
    },
    methods:{
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
                        console.log('首页')
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
                            path:'/Drive/costover'//物资采购
                        })
                    }else if(vm.auth.safetyManagement){
                        vm.$router.push({
                            path:'/Drive/costover'//安全管理
                        })
                    }else if(vm.auth.constructionSite){
                        vm.$router.push({
                            path:'/Drive/costover'//施工现场
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

            }else if(tab.label === '施工现场'){
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
        display: flex;
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
        z-index: 100;
    }
    .sideBar img{
        position: relative;
        top: 22px;

    }
    /* 导航栏 */
    .main{
        flex: 1;
        overflow:auto;
        /* margin-left: 18px; */
    }
    .content{
        width: 100%;
        position: relative;
    }
    .navigation{
        height:48px;
        width:100%;
        position: fixed;
        top: 68px;
        left: 26px;
        right: 0;
        background: #fff;
        z-index: 1000;
    }
    
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
        width: 192px;
        background: #fafafa;
        border-right:1px solid #ccc; 
        position: fixed;
        top: 116px;
        left: 26px;
        bottom: 0;
        z-index: 100;
    }
    .settingsRight{
        display: block;
        margin-left: 219px;
        margin-top: 116px;
    }
    .settingsCenter{
      margin-left: 26px!important;
    
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


