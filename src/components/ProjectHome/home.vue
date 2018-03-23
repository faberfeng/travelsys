<template>
    <div id="home_project">
        <div class="projectInfo">
            <div class="lunbo-container">
                <el-carousel :interval="3000" arrow="always" height="242px" width="340px">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <h3>{{item}}</h3>
                        </el-carousel-item>
                </el-carousel>
            </div>
            <div class="tal">
                <p class="talTitle">概况</p>
                <ul class="talUl">
                    <li><label>使用单位</label>上海市城市建设开发投资总公司</li>
                    <li><label>工程名称</label>企业自用办公楼企业自用办公楼</li>
                    <li><label>设计单位</label>同济大学建筑设计研究院</li>
                    <li><label>施工单位</label>上海建工</li>
                    <li><label>监理单位</label>上海建科监理咨询有限公司</li>
                </ul>
            </div>
        </div>
        <div class="projectTab">
            <div id="item-box">
                <span :class="[{'label-item-active':(tabShow == 1)},'label-item']" @click="switchTab(1)">动态</span>
                <span :class="[{'label-item-active':(tabShow == 2)},'label-item']" @click="switchTab(2)">通知</span>
            </div>
            <ul class="projectList" v-show="tabShow == 1">
                <li>
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img src="http://q.qjbim.com/qjbim-file//upload/static/user_default_05.png"/>
                        </div> 
                        <div class="projectListText">
                            <p class="title"><label class="projectListTextName">王自强</label><span>计划发生拖延</span><a>查看文档<i class="el-icon-arrow-right"></i></a></p>
                            <p class="font-color1">在【工程文档】中【默认群组】内上传了文件【 WKPT_MEP_11F(2017.9.25定).gmd】</p>
                            <p class="projectBottom">2018-01-31 15:42:07<label>来自网页浏览器</label></p>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="projectList" v-show="tabShow == 2">
                <li>
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img src="http://q.qjbim.com/qjbim-file//upload/static/user_default_05.png"/>
                        </div> 
                        <div class="projectListText">
                            <p class="title"><label class="projectListTextName">tyty</label><span>计划发生拖延11</span><a>查看文档<i class="el-icon-arrow-right"></i></a></p>
                            <p class="font-color1">在【工程文档】中【默认群组】内上传了文件【 WKPT_MEP_11F(2017.9.25定).gmd】</p>
                            <p class="projectBottom">2018-01-31 15:42:07<label>来自网页浏览器</label></p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            tabShow:1,
            token:'',
            notbeenUse:true
        }
    },
    created(){
        var vm = this
        const token = localStorage.getItem('token') 
        vm.token =token;
        // vm.getPJDetial(vm.$route.params.id);
    },
    methods:{
        switchTab(key){
            var vm = this
            if(vm.tabShow != key){
                vm.tabShow = key;
            }
        },
    }
}
</script>

<style lang="less">
    #home_project{
        margin-right: 20px;
        .font-color1{
            color: #333;
            font-size: 14px;
        }
        a{
            text-decoration: none;
            display: inline-block;
            width: 100%;
            height: 100%;
        }
        // .clearfix{
        //     overflow: hidden;
        //     clear: both;
        //     content: '';
        // }
        #item-box{
            display: block;
            border-bottom: 1px solid #ccc;
            height: 37px;
        }
        .label-item{
            float: left;
            height: 34px;
            width:106px;
            text-align: center;
            font-size: 16px;
            color: #666666;
            line-height: 34px;
            cursor: pointer;
            border-top: 3px solid #ffffff;
        }
        .label-item-active{
            color: #fc3439;
            font-weight: bold;
            line-height: 34px;
            border-top: 3px solid #fc3439;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #fff;
        }
        /* 导航栏 */
        .main{
            flex: 1;
            overflow:auto;
            margin-left: 18px;
        }
        .content{
            width: 100%;
        }
        .navigation{
            height:40px;
            width:100%;
        }
        /* 工程面板 */
        .projectTab{
            width: 100%;
            float: left;
            margin-top: 42px;
        }
        /* 工程信息 */
        .projectInfo{
            width: 100%;
            overflow: hidden;
            display: flex;
        }
        .projectInfo .lunbo-container,.projectInfo .tal{
            height: 242px;
        }
        .projectInfo .lunbo-container{
            width: 340px;
        }
        .projectInfo .img{
            width: 340px;
        }
        .projectInfo .tal{
            flex: 1;
            margin-left: 26px;
            float: right;
            background: #fafafa;
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
            margin: 21px 0 7px 0;
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
            height: 37px;
            line-height: 37px;
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
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 16px;
            font-weight: bold;
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
        .title span{
            font-size: 14px;
            display: inline-block;
            margin-left: 20px;
            color: #666;
        }
        .btn{
            float: right;
            margin-top: 10px;
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
        .el-tabs--border-card>.el-tabs__content{
            padding: 0;
        }
        .projectBottom{
            width: 100%;
            font-size: 12px;
            font-family: '微软雅黑';
            overflow: hidden;
            color: #ccc;
            margin-top: 20px;
            margin-bottom: 6px;
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
            line-height: 242px;
            margin: 0;
        }
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
        .el-carousel__arrow{
            width: 16px;
            height: 36px;
            position: absolute;
            display: block;
            overflow: hidden;
            background-image: url(./images/fanye_1.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
            opacity: 0.7;
            filter: "alpha(opacity=70)";
            -ms-filter: "alpha(opacity=70)";
            border-radius: 0;
            background-color:transparent;
            transform: translateY(-50%);
        }
        .el-carousel__arrow i{
            display: none;
        }
        .el-carousel__arrow--right{
            right: -80px;
            transition: right .3s;
            transform: rotateY(180deg) translateY(-50%);
        }
        .el-carousel__arrow--left{
            left: -80px;
            transition: left .3s;
        }
        .lunbo-container:hover .el-carousel__arrow--left{
            left: 0px;
        }
        .lunbo-container:hover .el-carousel__arrow--right{
            right: 0px;
        }
        .el-carousel__arrow--left:hover{
            background-image: url("./images/fanye_2.png");
            transform:rotateY(180deg) translateY(-50%);
        }
        .el-carousel__arrow--right:hover{
            background-image: url("./images/fanye_2.png");
            transform: translateY(-50%);
        }
        .el-carousel__indicator{
            padding-bottom: 10px;
            padding-left: 0;
            padding-right: 0;
        }
        .el-carousel__button{
            width: 6px;
            height: 6px;
            display: inline-block;
            background-color: #999;
            cursor: pointer;
            border-radius: 6px;
            transition: all .3s ease-in-out;
            -ms-transition: all .3s ease-in-out;
            -moz-transition: all .3s ease-in-out;
            -webkit-transition: all .3s ease-in-out;
            -o-transition: all .3s ease-in-out;
            margin: 0 4px;
            vertical-align: top;
        }
        .is-active button{
            background: #f33;
            width: 26px;
            height: 6px;
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
            width: 230px;
            /* background: #fafafa; */
        }
        .settingsRight{
            flex: 1;
        }
        .settings h5{
            width:100%;
            margin-top: 14px;
            font-size: 18px;
        }
        .el-menu{
            border: none;
        }
        .el-submenu__title{
            background: #ccc;
        }
        
        /* .el-menu-item.is-active{
            color: red;
        } */
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
        .el-tabs--border-card{
            border:none;
        }
        .el-tabs--border-card>.el-tabs__header{
            background: none;
        }
        .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
            border-top: 3px solid #fc3439; 
            z-index: 1;
            height: 48px;
            color: #df0010;
            font-family: 'MrcrosoftYaHei';
            font-weight: bold;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item{
            height: 51px;
        }
        .el-tabs--border-card > .el-tabs__header{
            border-left: 1px solid #ccc;
        }
        .el-tabs--border-card{
            box-shadow: none;
            -webkit-box-shadow:none;
        }
        .el-tabs__nav{
            width: 108px;
        }
    }
</style>