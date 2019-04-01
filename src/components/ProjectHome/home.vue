<template>
    <div id="home_project" v-loading="loading">
        <div class="projectInfo">
            <div class="lunbo-container">
                <el-carousel :interval="3000" arrow="always" height="242px" width="340px">
                    <img style="width:340px;height:237px" src="../../assets/nopic.jpg"/>
                    <el-carousel-item v-for="(item,index) in projectImageList" :key="index">
                        <img style="width:340px;height:242px" :src="BDMSUrl+item.path"/>
                        </el-carousel-item>
                </el-carousel>
            </div>
            <div class="tal">
                <p class="talTitle">概况</p>
                <ul class="talUl">
                    <span v-show="dataShow">
                        <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                        <p style="font-size:16px;color:#ccc">暂无数据</p>
                    </span>
                    <li v-for="(item,index) in overviewList" :key='index' ><label>{{item.viewKey}}</label><label v-html="item.viewVal"></label></li>
                </ul>
            </div>
        </div>
        <div class="projectTab">
            <div id="item-box">
                <span :class="[{'label-item-active':(tabShow == 1)},'label-item']" @click="switchTab(1)">动态</span>
                <span :class="[{'label-item-active':(tabShow == 2)},'label-item']" @click="switchTab(2)">通知</span>
            </div>
            <ul class="projectList" v-show="tabShow == 1">
                <span v-show="tabdataShow1">
                    <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                    <p style="font-size:16px;color:#ccc">暂无数据</p>
                </span>
                <li v-for="(item,index) in projectStationInfoList" :key="index">
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img :src="item.userImg?(commomHeadPictureFile+item.userImg):require('../../assets/people.png')">
                        </div> 
                        <div class="projectListText">
                            <p class="title">
                                <label class="projectListTextName">{{item.userName}}</label>
                                <span :title="item.subTitle"  class="projectList-detial" v-html="item.content"></span>
                                <a style="display:none" @click="gotoPath(index)">查看详情<i class="el-icon-arrow-right"></i></a>
                            </p>
                            <p class="font-color1">{{item.title}}</p>
                            <p class="projectBottom">{{item.date | toLocalD}}<label>{{item.fromIn}}</label></p>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="projectList" v-show="tabShow == 2">
                <span v-show="tabdataShow2">
                    <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                    <p style="font-size:16px;color:#ccc">暂无数据</p>
                </span>
                <li v-for="(item,index) in projectNoticeListInfo" :key="index">
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img :src="QJFileManageSystemURL+'upload/notice/'+item.imagePath+'.png'"/>
                        </div> 
                        <div class="projectListText">
                            <p class="title">
                                <label class="projectListTextName">{{item.noticeName}}</label>
                                <span :title="item.subTitle" class="projectList-detial" v-html="item.subTitle"></span>
                                <a style="display:none" @click="gotoPath(index)">查看详情<i class="el-icon-arrow-right"></i></a>
                            </p>
                            <p class="font-color1">{{item.message}}</p>
                            <p class="projectBottom">{{item.createDate | toLocalD}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data(){
        return{
            loading:false,
            tabShow:1,
            token:'',
            QJFileManageSystemURL:'',
            commomHeadPictureFile:'',
            BDMSUrl:'',
            notbeenUse:true,
            projId:'',
            allData:{},//工程首页信息
            overviewList:[],//工程概况信息
            projectImageList:[],//工程图片列表
            projectStationInfoList:[],//工程动态信息列表
            projectNoticeListInfo:[],//工程通知列表
            dataShow:true,
            tabdataShow1:true,
            tabdataShow2:true,
        }
    },
    filters:{
        toLocalD(val){
            return new Date(val).toLocaleString();
        }
    },
    created(){
        var vm = this
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        vm.commomHeadPictureFile=vm.$store.state.commomHeadPictureFile;
        vm.token = localStorage.getItem('token'); //获取token
        vm.projId = localStorage.getItem('projId');//获取工程id
        // vm.getProjectInfo();//工程首页信息
        vm.getBasicSituation();//获取工程概况信息;
        vm.getProjectImageList()//获取工程图片列表
        vm.getProjectStationInfo()//获取用户动态信息列表
        // vm.getProjectNoticeList();//获取通知列表

    },
    methods:{
        switchTab(key){
            var vm = this
            if(vm.tabShow != key){
                vm.tabShow = key;
            }
        },
        getProjectInfo(){
            this.loading=true;
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/index?projId='+this.projId,
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    this.allData = response.data.rt;
                }
                this.loading=false;
            })
        },
        //获取工程概况信息列表
        getBasicSituation(){
            var vm = this
            axios({
                method:'get',
                // url:vm.BDMSUrl+'project2/main/'+vm.projId+'/overview/list',
                url:vm.BDMSUrl+'api/v1/main/main/'+vm.projId+'/overview/list',
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd === '1'){
                    vm.$router.push({
                        path:'/login'
                    })
                }else{
                    vm.overviewList = response.data.rt;
                    if(vm.overviewList.length!=0){
                        vm.dataShow=false;
                    }    
                }
            })
        },
        getProjectImageList(){
            var vm = this
            axios({
                method:'get',
                // url:vm.BDMSUrl+'project2/main/findProjectImage?projectId='+this.projId,
                url:vm.BDMSUrl+'api/v1/main/main/findProjectImage?projectId='+this.projId,
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    this.projectImageList = response.data.rt;
                    // this.projectImageList.push(this.srcPath);
                    // console.log(this.projectImageList);
                }
            })
        },
        getProjectStationInfo(){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'api/v1/main/main/list',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    pageNo:0,
                    pageSize:100
                }
            }).then((response)=>{
                if(response.data.cs === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    if(response.data.rt.rows){
                        this.projectStationInfoList = response.data.rt.rows;
                         this.tabdataShow1=false;
                    }else if(response.data.rt.rows.length!=0){
                       
                    }
                }

            })
        },
        getProjectNoticeList(){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/main/noticeList',
                headers:{
                    'token':this.token,
                },
                params:{
                    projId:this.projId,
                    pageNo:0,
                    pageSize:100
                }
            }).then((response)=>{
                if(response.data.cd === '0'){
                    if(response.data.rt.rows){
                        this.projectNoticeListInfo = response.data.rt.rows;
                        this.tabdataShow2=false;
                         this.projectNoticeListInfo.forEach((item,index,arr)=>{
                            if(item.type=='1'||item.type=='2'||item.type=='3'||item.type=='4'){
                                arr[index].noticeName = '进度计划';
                            }else if(item.type=='5'||item.type=='6'||item.type=='7'){
                                arr[index].noticeName = '设计协调';
                            }else if(item.type=='8'||item.type=='9'||item.type=='10'||item.type=='11'){
                                arr[index].noticeName = '施工现场';
                            }else if(item.type=='12'){
                                arr[index].noticeName = '空间管理';
                            }else if(item.type=='13'||item.type=='14'||item.type=='15'||item.type=='23'||item.type=='24'||item.type=='25'){
                                arr[index].noticeName = '质量验收';
                            }else if(item.type=='16'||item.type=='17'||item.type=='18'){
                                arr[index].noticeName = '质量检查';
                            }else if(item.type=='19'||item.type=='20'||item.type=='21'){
                                arr[index].noticeName = '安全验收';
                            }else if(item.type=='26'||item.type=='27'){
                                arr[index].noticeName = '安全检查';
                            };
                            
                            var ImagePath = this.updateNoticeImage(item.type);//判断图片地址
                            var subTitle = this.updateNoticeTitle(item.type);//判断副标题
                            arr[index].subTitle = subTitle;
                            arr[index].imagePath = ImagePath;
                        })
                    }
                }else{
                   this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        gotoPath(index){
            if(this.projectNoticeListInfo[index].type=='1'||this.projectNoticeListInfo[index].type=='2'||this.projectNoticeListInfo[index].type=='3'||this.projectNoticeListInfo[index].type=='4'){
                this.$router.push({
                    path:'/home/design'
                });
            }else if(this.projectNoticeListInfo[index].type=='5'||this.projectNoticeListInfo[index].type=='6'||this.projectNoticeListInfo[index].type=='7'){
                this.$router.push({
                    path:'/home/design'
                });
            }else if(this.projectNoticeListInfo[index].type=='8'||this.projectNoticeListInfo[index].type=='9'||this.projectNoticeListInfo[index].type=='10'||this.projectNoticeListInfo[index].type=='11'){
                this.$router.push({
                    path:'/home/design'
                })
            }else if(this.projectNoticeListInfo[index].type=='12'){
                this.$router.push({
                    path:'/home/design'
                })
            }else if(this.projectNoticeListInfo[index].type=='13'||this.projectNoticeListInfo[index].type=='14'||this.projectNoticeListInfo[index].type=='15'||this.projectNoticeListInfo[index].type=='23'||this.projectNoticeListInfo[index].type=='24'||this.projectNoticeListInfo[index].type=='25'){
                this.$router.push({
                    path:'/home/design'
                })
            }else if(this.projectNoticeListInfo[index].type=='16'||this.projectNoticeListInfo[index].type=='17'||this.projectNoticeListInfo[index].type=='18'){
                this.$router.push({
                    path:'/home/design'
                })
            }else if(this.projectNoticeListInfo[index].type=='19'||this.projectNoticeListInfo[index].type=='20'||this.projectNoticeListInfo[index].type=='21'){
                this.$router.push({
                    path:'/home/design'
                })
            }else if(this.projectNoticeListInfo[index].type=='26'||this.projectNoticeListInfo[index].type=='27'){
                this.$router.push({
                    path:'/home/design'
                })
            };
        },
        updateNoticeImage(type){
            var text = "";
            switch (type) {
                case 1: text="plan_new"; break;
                case 2: text="plan_start"; break;
                case 3: text="plan_end"; break;
                case 4: text="plan_delay"; break;
                case 5: text="design_new"; break;
                case 6: text="design_reply"; break;
                case 7: text="design_@"; break;
                case 8: text="construction_new"; break;
                case 9: text="construction_delay"; break;
                case 10: text="construction_due"; break;
                case 11: text="construction_pay"; break;
                case 12: text="store_remindcontract"; break;
                case 13: text="qualityaccept_new"; break;
                case 14: text="qualityaccept_reply"; break;
                case 15: text="qualityaccept_@"; break;
                case 16: text="qualitycheck_new"; break;
                case 17: text="qualitycheck_reply"; break;
                case 18: text="qualitycheck_@"; break;
                case 19: text="securityaccept_new"; break;
                case 20: text="securityaccept_reply"; break;
                case 21: text="securityaccept_@"; break;
                case 22: text="plan_value"; break;
                case 23: text="qualityaccept_reject"; break;
                case 24: text="qualityaccept_supply"; break;
                case 25: text="qualityaccept_adopt"; break;
                case 26: text="safetystatus_timeout"; break;
                case 27: text="safetycheck_remind"; break;
                default:
                    text = "";
            }
            return text;
        },
        updateNoticeTitle(type) {
            var text = "";
            switch (type) {
                case 1: text="收到新的任务"; break;
                case 2: text="您的任务即将开始"; break;
                case 3: text="您的任务邻近结束"; break;
                case 4: text="您的任务已经拖延"; break;
                case 5: text="有新的讨论主题"; break;
                case 6: text="收到新的回复"; break;
                case 7: text="有用户提到您"; break;
                case 8: text="收到新的联系单"; break;
                case 9: text="计划发生拖延"; break;
                case 10: text="临近整改期限"; break;
                case 11: text="定货单付款提醒"; break;
                case 12: text="商铺续约提醒"; break;
                case 13: text="有新的验收申请"; break;
                case 14: text="收到新的回复"; break;
                case 15: text="有用户提到您"; break;
                case 16: text="有新的整改发起"; break;
                case 17: text="收到新的回复"; break;
                case 18: text="有用户提到您"; break;
                case 19: text="有新的验收申请"; break;
                case 20: text="收到新的回复"; break;
                case 21: text="有用户提到您"; break;
                case 22: text="上月产值提醒"; break;
                case 23: text="验收被驳回"; break;
                case 24: text="验收需补充"; break;
                case 25: text="验收已通过"; break;
                case 26: text="安全状态超时"; break;
                case 27: text="安全检查提醒"; break;
                default:
                    text = "";
            }
            return text;
        }
    }
}
</script>

<style lang="less">
    #home_project{
        margin-right: 20px;
        margin-left: 20px;
        padding-top: 33px;
        overflow-x: hidden;
        height: 800px;
        
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
            margin-left: 26px;
        }
        /* 工程信息 */
        .projectInfo{
            width: 100%;
            overflow: hidden;
            display: flex;
            margin-left:26px;
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
            font-size: 14px;
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
            margin-bottom: 10px;
        }
        .projectListText .title a{
            float: right;
            width: 100px;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            color: #999;
            line-height: 35px;
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
            position: relative;
            top: 10px;
            line-height: 35px;
            height: 35px;
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
            display: inline-block;
            // float: left;
        }
        .projectList-detial{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 500px;
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