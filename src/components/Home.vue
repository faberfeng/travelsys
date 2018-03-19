<template>
    <div class="wrapper">
        <el-row>
            <el-col :span="24" class="header">
                <div class="headerImg">
                    <img src='http://q.qjbim.com/qjbim-file/upload/101/public/001/2017/12/15/9d789ae6-84c4-422c-8391-e9f38db883e5.png'/>
                </div>
                <div class="headerText">
                    {{title}}
                </div>
                <div class="headerInfo">
                    <img class="headerInfoImg" src='../assets/loginimg.png'/>
                </div>
            </el-col>
        </el-row>
        <div class="contentBody">
            <div class="sideBar">
                <a href="#">
                    <img src="../assets/arrow-left.png"/>
                </a>
            </div>
            <div  class="main">
                <div class="content">
                    <el-row class="navigation">
                        <el-col :span="24" >
                            <el-tabs  v-model="navigationPath" @tab-click="handleClick">
                                <el-tab-pane label="工程首页" name="projectPage" >
                                       <router-view class="sss"/>
                                </el-tab-pane>
                                <el-tab-pane label="进度计划" name="plan">进度计划</el-tab-pane>
                                <el-tab-pane label="设计管理" name="designManager">
                                    <el-menu :default-active="activeIndex"  mode="horizontal">
                                        <el-menu-item index="1"><router-link :to="{path:'/home/design'}">设计协调</router-link></el-menu-item>
                                        <el-menu-item index="2"><router-link :to="{path:'/home/goujian'}">属性管理</router-link></el-menu-item>
                                        <el-menu-item index="3"><router-link :to="{path:'/home/designversion'}">设计版本</router-link></el-menu-item>
                                    </el-menu>
                                    <router-view/>
                                </el-tab-pane>
                                <el-tab-pane label="成本管理" name="costManage">
                                    <el-menu :default-active="activeIndex"  mode="horizontal">
                                        <el-menu-item index="1"><router-link :to="{path:'/home/costover'}">成本预览</router-link></el-menu-item>
                                        <el-menu-item index="2"><router-link :to="{path:'/home/goujian'}">构建量清单</router-link></el-menu-item>
                                        <el-menu-item index="3"><router-link :to="{path:'/home/gongcheng'}">工程量清单</router-link></el-menu-item>
                                        <el-menu-item index="4"><router-link :to="{path:'/home/wuliao'}">物料量清单</router-link></el-menu-item>
                                    </el-menu>
                                    <router-view/>
                                </el-tab-pane>
                                <el-tab-pane label="物资采购" name="materialPurchase">物资采购</el-tab-pane>
                                <el-tab-pane label="施工现场" name="construction">施工现场</el-tab-pane>
                                <el-tab-pane label="文档管理" name="documentManager">
                                    <el-menu :default-active="activeIndex"  mode="horizontal">
                                        <el-menu-item index="1"><router-link :to="{path:'/home/costover'}">最近文档</router-link></el-menu-item>
                                        <el-menu-item index="2"><router-link :to="{path:'/home/goujian'}">工程云盘</router-link></el-menu-item>
                                        <el-menu-item index="3"><router-link :to="{path:'/home/gongcheng'}">已经分享</router-link></el-menu-item>
                                        <el-menu-item index="4"><router-link :to="{path:'/home/wuliao'}">个人中转</router-link></el-menu-item>
                                    </el-menu>
                                    <router-view/>
                                </el-tab-pane>
                                <el-tab-pane label="设施维保" name="facilities">设施维保</el-tab-pane>
                                <el-tab-pane label="配置中心" name="settings">
                                    <div class="settings">
                                        <div  class="settingsLeft">
                                            <h5>工程配置中心</h5>
                                            <el-menu :default-active="settingActive"  router :unique-opened="true"  @select="selectIndex">
                                                <el-submenu index="/home/initalsettings">
                                                    <template slot="title">
                                                        <span>工程场地与项目初始化</span>
                                                    </template>
                                                    <el-menu-item-group>
                                                        <el-menu-item index="/home/initalsettings">工程初始化配置信息</el-menu-item>
                                                        <el-menu-item index="/home/groundsettings">场地与单体初始化</el-menu-item>
                                                        <el-menu-item index="/home/pageinital">分页与楼层初始化</el-menu-item>
                                                    </el-menu-item-group>
                                                </el-submenu>
                                                <el-submenu index="/home/datatransform">
                                                    <template slot="title">
                                                        <span>建筑信息模型标准管理</span>
                                                    </template>
                                                    <el-menu-item-group>
                                                        <el-menu-item index="/home/datatransform">数据传递标准预览</el-menu-item>
                                                        <el-menu-item index="/home/professional">专业种类分类编码</el-menu-item>
                                                        <el-menu-item index="/home/worktool">作业工具分类编码</el-menu-item>
                                                        <el-menu-item index="/home/constructordesignmapped">结构设计分类映射</el-menu-item>
                                                        <el-menu-item index="/home/constructordesigncode">结构设计分类编码</el-menu-item>
                                                        <el-menu-item index="/home/projectsubmit">工程招标分类编码</el-menu-item>
                                                        <el-menu-item index="/home/materialpurchase">物资采购分类编码</el-menu-item>
                                                        <el-menu-item index="/home/buildingproperty">构建属性语意编码</el-menu-item>
                                                    </el-menu-item-group>
                                                </el-submenu>
                                                <el-submenu index="/home/jobmanage">
                                                    <template slot="title">
                                                        <span>用户岗位群组管理</span>
                                                    </template>
                                                    <el-menu-item-group>
                                                        <el-menu-item index="/home/jobmanage">岗位管理</el-menu-item>
                                                        <el-menu-item index="/home/groupmanage">群组管理</el-menu-item>
                                                        <el-menu-item index="/home/usermanage">用户管理</el-menu-item>
                                                    </el-menu-item-group>
                                                </el-submenu>
                                                <el-submenu index="/home/projectstationmanage">
                                                    <template slot="title">
                                                        <span>工程动态日志</span>
                                                    </template>
                                                    <el-menu-item-group>
                                                        <el-menu-item index="/home/projectstationmanage">工程动态管理</el-menu-item>
                                                        <el-menu-item index="/home/projectloggermanage">工程日志管理</el-menu-item>
                                                    </el-menu-item-group>
                                                </el-submenu>
                                            </el-menu>
                                        </div>
                                        <div class="settingsRight">
                                            <router-view ></router-view>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>


export default {
    name:'Home',
    data(){
        return{
            title:'企业自用办公楼',
            userName:'李从文',
            navigationPath:'projectPage',
            activeIndex:'1',
            settingActive:'/home/initalsettings',
        }
    },
    created(){
        this.navigationPath = sessionStorage.getItem('navigationPath');
        this.settingActive = sessionStorage.getItem('settingActive');
        if(!this.navigationPath){
            this.navigationPath='projectPage';
        }
        if(!this.settingActive){
            this.settingActive='/home/initalsettings';
        }
    },
    computed:{
        path(){
            return this.$store.state.path;
        }
    },
    methods:{
        handleClick(tab,event){
            // console.log(tab);
            // console.log(tab.index)
            if(tab.label === '工程首页'){
                this.$router.push({
                    path:'/home/projHome'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath);
            }else if(tab.label === '进度计划'){
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '设计管理'){
                this.$router.push({
                    path:'/home/design'
                });
                this.navigationPath = tab.name;
                sessionStorage.setItem('navigationPath',this.navigationPath)
            }else if(tab.label === '成本管理'){
                this.$router.push({
                    path:'/home/costover'
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
                    path:'/home/costover'
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
        width: 100%;
        height: 100%;
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
        background: #433a43;
        cursor: pointer;
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
    }
    .sideBar{
        width: 25px;
        min-width: 25px;
        background: #f5f7fa;
        border-right: 1px solid #cccccc;
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
    }
    .navigation{
        height:48px;
        width:100%;
    }
    /* 工程面板 */
    .projectTab{
        width: 100%;
        float: left;
        margin-right: 1%;
        margin-top: 43px;

        
    }
    /* 工程信息 */
    .projectInfo{
        width: 100%;
        overflow: hidden;
        display: flex;
    }
    .projectInfo .img,.projectInfo .tal{
        height: 240px;
    }
    .projectInfo .img{
        width: 500px;
    }
    .projectInfo .tal{
        flex: 1;
        margin-left: 12px;
        float: right;
        background: #f5f7fa;
    }
    .tal .talTitle{
        color: #fc3439;
        font-family: '微软雅黑';
        font-weight: bold;
        font-size: 18px;
        text-align: left;
        height: 20px;
        line-height: 20px;
        padding-left: 30px;
        margin: 21px 0 10px 0;
    }
    .tal .talUl{
        list-style:none;
        margin-top:5px;
        padding-left: 30px;
        font-size: 14px;
    }
    .talUl li{
        text-align: left;
        display: inline-block;
        width: 100%;
        height: 35px;
        line-height: 35px;
    }
    .talUl label{
        color:#999999;
        font-size: 14px;
        font-family: '微软雅黑';
        display: inline-block;
        margin-right: 40px;
    }
    .projectInfoTitle{
        text-align: left;
        height: 40px;
        line-height: 40px;
        background: #f1f1f1;
    }
    /* 工程列表 */
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
        margin: 0 2px;
        float: left;
        text-align: left;
    }
    .projectListText .title{
        width: 100%;
    }
    .projectListText .title a{
        float: right;
        width: 100px;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        color: #ccc;
    }
    .projectListText .title a:hover{
        color: red;
    }
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
       
    }
    .settingsLeft{
        width: 192px;
        background: #fafafa;
        border-right:1px solid #ccc; 
        
    }
    .settingsRight{
         flex: 1;
    }
    .settings h5{
        width:100%;
        height:50px; 
        line-height: 50px;
        font-family: 'MicrosoftYaHei';
        font-weight: bold;
        color: #333;
        margin: 10px 0;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
    }
    .el-menu{
        border: none;
    }
    .el-submenu__title{
        background: #ccc;
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
</style>


