<template>
    <div id="projectNavigation">
        <headerCommon :username="userName"></headerCommon>
        <!-- <h1 v-show="companyType.length>0">产品导航</h1> -->
        <!-- v-show="noprojectShow" -->
        <!-- <div  class="noproject" v-show="noprojectShow">
            <div class="noprojectLeft"><img src='../assets/noproject.png'></div>
            <div class="noprojectRight">
                <div class="noprojectRight_header">您的帐号尚未开通任何工程授权。</div>
                <div class="noprojectRight_bottom">
                您有以下几种选择：<br/>
                第一种：退出您自己的账号，采用共同账号winter（密码:123654）体验和学习已经拥有数据的项目。<br/>第二种：如果您的同事已经开通了项目，请联系您的同事，将您的账号添加到工程协作名单中。<br/>第三种：如果您有自己负责的项目，可以点击<a style="display:inline" target="_blank" :href="applyIndexUrl">这里</a>，作为工程管理员申请开通一个新的项目。<br/>如有其它疑问或索取学习资料，请加入BDMS客服QQ群：855923282
                </div>
                <div></div>
            </div>
        </div> -->
        <!-- v-show="!noprojectShow" -->
        <div >
            <!-- <ul id="CTypeList">
                <li  v-for="(item,index) in companyType" :key="index" :class="[item.name == active?'active-'+item.name:'','company-item-left','company-item-left'+item.name]"  @click="selectType(item.id)">
                    <span  class="Q_title_left"></span>
                    <span v-text="item.name" :class="[item.name == active?'active-title':'','Q_title_name']"></span>
                </li>
            </ul> -->
            <div class="conpanyContainer">
                <h1  class="h1-companybox">企业导航</h1>
                <ul class="companyBox">
                    <li class="company-item" v-for="(item,index) in companyList" :key="index" @click="redirect(item.entId,index)" >
                        <input type="hidden" name="companyId" :value="item.entId">
                        <input type="hidden" name="type" :value="item.entType">
                        <span class="companyImage">
                            <span class="companyImage-img" :style="item.imgPath?'background-image:url('+item.imgPath+');':'background-image:url('+require('../assets/bg_logo.png')+');'"></span>
                        </span>
                        <div style="padding:15px 20px;">
                        <span v-text="item.entName" class="Q_title"></span>
                            <span class="star"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
         
    </div>
</template>
<script>
import axios from 'axios'
import headerCommon from './header.vue'
export default {
    name:'ProjectNavigation',
    components: {
      headerCommon
    },
    data(){
       
        return{ 
            noprojectShow:false,
            url:'',
            pathInit:'',
            companyList:[],
            companyLists:[],
            userName:'',
            userId:'',
            token:'',
            BDMSUrl:'',
            active:'',
            companyType:{},
            applyIndexUrl:''
        }
    },
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.applyIndexUrl = vm.$store.state.applyIndexUrl
        vm.getProjectList();
        
    },
    methods:{
        getUserInfo(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'/user/getOnlineInfo',
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd === '-1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    // vm.userName = response.data.rt.onlineInfo.realName;
                    // vm.userId = response.data.rt.onlineInfo.userId;
                    vm.userName = response.data.rt.user.name;
                    vm.userId = response.data.rt.user.userId;
                    localStorage.setItem('userName',vm.userName)
                    localStorage.setItem('userId',vm.userId)
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        //获取企业列表
        getProjectList(){
             var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'/projectInfo/getUserCompanyList',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                    if(response.data.cd=="0"){
                        this.companyList=response.data.rt;
                        localStorage.setItem('entId',response.data.rt[0].entId)
                        localStorage.setItem('entName',response.data.rt[0].entName)
                        vm.getUserInfo();
                        this.$router.push({
                            path:'/projectlist',
                            query:{entId:this.companyList[0].entId}
                        })
                    }
            }).catch(function(error){

            })
        },
        selectType(index){
             var vm = this
             vm.active =index
             vm.companyList=vm.companyLists[index];

        },
        //企业唯一或不唯一
        initCompany(){
            var vm = this
            axios({
                method:'GET',
                url:vm.pathInit,
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == "0"){//跳转项目首页
                    // localStorage.setItem('token',response.data.rt.session.onlineInfo.tokenId);
                    // vm.token = response.data.rt.session.onlineInfo.tokenId;
                    this.$router.push({
                        path:'/projectlist'
                    })
                }else if(response.data.cd === "1"){
                    alert(response.data.msg);
                    setTimeout(()=>{
                         vm.$router.push({
                            path:'/login'
                        })
                    },1000)
                   
                }
            }).catch(function(error){
                vm.$router.push({
                  path:'/login'
                })
            })
        },
        redirect(key,index){
            var vm = this;
            localStorage.setItem('projectName',this.companyList[index].companyName);
            vm.pathInit = vm.BDMSUrl+'project2/companyInstall/'+key
            vm.initCompany();
        }
    }
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .noproject{
        width: 1120px;
        height: 450px;
        // border:1px solid red;
        position:absolute;
        top:50%;
        left:50%;
        margin-left:-570px;
        margin-top:-220px;
    }
    .noprojectLeft{
        float: left;
       margin-top:50px;
    }
    .noprojectRight{
        float: right;
        width: 640px;
        height: 170px;
        margin-top:142px;
        .noprojectRight_header{
            font-size:24px;
            color:#fc3439;
            font-weight: bold;
            text-align: left;
            line-height: 50px;
        }
        .noprojectRight_bottom{
            line-height: 28px;
            font-size:14px;
            color:#666666;
            font-weight: bold;
            text-align: left;
        }
    }
    #CTypeList{
        position: fixed;
        top: 68px;
        left: 0;
        bottom: 0;
        width: 109px;
        border-right: 1px solid #e6e6e6;
        padding-top: 24px;
    }
    .company-item-left{
        margin-top:55px; 
    }
    .active-title{
        color: #fc3439!important;
    }
    .Q_title_left{
        display: block;
        margin: 0 auto;
        width: 60px;
        height: 60px;
        border: 1px solid #cccccc;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
    }
    .active-华北 .Q_title_left,.active-东北 .Q_title_left,.active-华东 .Q_title_left,.active-华北 .Q_title_left,.active-华南 .Q_title_left,.active-西北 .Q_title_left,.active-西南 .Q_title_left{
        background: #fc3439;
        border: none;
        width: 72px;
        height: 72px;
    }
    .Q_title_left::after{
        display: block;
        position: absolute;
        width: 24px;
        height: 24px;
        top: 18px;
        left: 18px;
        background-size:100%; 
        background-position:0 0;
        content: '';
    }
    .company-item-left华北 .Q_title_left::after{
        background-image:url('../assets/2.png');
    }
    .company-item-left东北 .Q_title_left::after{
        background-image:url('../assets/1.png');
    }
    .company-item-left华东 .Q_title_left::after{
        background-image:url('../assets/3.png');
    }
    .company-item-left华南 .Q_title_left::after{
        background-image:url('../assets/4.png');
    }
    .company-item-left西北 .Q_title_left::after{
        background-image:url('../assets/5.png');
    }
    .company-item-left西南 .Q_title_left::after{
        background-image:url('../assets/6.png');
    }

    .active-华北 .Q_title_left::after{
       background-image:url('../assets/2-1.png');
           top: 24px;
        left: 24px;
    }
    .active-东北 .Q_title_left::after{
       background-image:url('../assets/1-1.png');
           top: 24px;
        left: 24px;
    }
    .active-华东 .Q_title_left::after{
       background-image:url('../assets/3-1.png');
           top: 24px;
        left: 24px;
    }
    .active-华南 .Q_title_left::after{
       background-image:url('../assets/4-1.png');
           top: 24px;
        left: 24px;
    }
    .active-西北 .Q_title_left::after{
       background-image:url('../assets/5-1.png');
           top: 24px;
        left: 24px;
    }
    .active-西南 .Q_title_left::after{
       background-image:url('../assets/6-1.png');
           top: 24px;
        left: 24px;
    }

    .active-华北,.active-东北,.active-华东,.active-华南,.active-西北,.active-西南{
        position: relative;
    }
    .active-华北::after,.active-东北::after,.active-华东::after,.active-华南::after,.active-西北::after,.active-西南::after{
        display: block;
        position: absolute;
        width: 12px;
        height: 32px;
        top: 20px;
        right: -1px;
        background-image: url('../assets/sanjian84.png');
        background-size:100%; 
        background-position:0 0;
        content: '';
    }
    .Q_title_name{
        display: block;
        text-align: center;
        font-size: 18px;
        line-height: 18px;
        color: #999999;
        font-weight: bold;
        margin-top: 10px;
    }
    .conpanyContainer{
        display: block;
        margin-left: 110px;
        padding: 0 30px 0 0px;
    }
    .h1-companybox{
        font-size: 18px;
        color: #333333;
        line-height: 18px;
        margin: 40px 0 30px;
        text-align: left;
    }
    .company-item{
        float: left;
        width: 232px;
        height: 208px;
        margin-right: 30px;
        margin-bottom: 30px;
        position: relative;
        box-shadow: 0px 0px 24px rgba(34,24,21,.09);
        cursor: pointer;
        .button-company{
            display: none;
            position: absolute;
            bottom: 0;
            left: 50%;
          margin-left: -21px;
          cursor: pointer;
        }
        .star{
            background: url('../assets/star.png') no-repeat 0 0;
            display: block;
            width: 74px;
            height: 10px;
            margin-top: 15px;
        }
        &:hover{
            box-shadow: 0px 0px 40px rgba(34, 24, 21, 0.69);
        }
    }

    .company-item:first-of-type{
        margin-left: 0;
    }

    //
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
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }
  .Q_title{
      display: block;
      width: 100%;
      text-align: left;
    font-size: 14px;
    color: #333333;
    height: 48px;
    overflow: hidden;
    line-height: 16px;
    cursor: pointer;
  }
    .Q1{
        background: #c45d5d;
    }
    .Q2{
        background: #e87352;
    }
    .Q3{
        background: #31b0bb;
    }
    .companyImage{
        display: block;
        width: 100%;
        height: 100px;
        border: none;
        position: relative;
    }
    .companyBox .company-item:nth-of-type(4n+1){
        .companyImage{
             background: #f77c75;
        }
         &:hover .companyImage{
            background: #e55149;
         }
    }
    .companyBox .company-item:nth-of-type(4n+2){
         .companyImage{
             background: #85cbc2;
         }
         &:hover .companyImage{
            background: #54b5a8;
         }
    }
    .companyBox .company-item:nth-of-type(4n+3){
        .companyImage{
         background: #d9c5b0;
        }
         &:hover .companyImage{
            background: #c9a176;
         }
    }
    .companyBox .company-item:nth-of-type(4n+4){
         .companyImage{
         background: #b2c7d0;
         }
          &:hover .companyImage{
            background: #6fa8c1;
         }
    }
    .companyImage-img{
        display: block;
        width: 200px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin:-25px 0 0 -100px; 
        background-size: 100% 100%; 
    }
</style>

