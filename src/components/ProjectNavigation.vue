<template>
    <div id="projectNavigation">
        <headerCommon :username="userName"></headerCommon>
        <!-- <h1 v-show="companyType.length>0">产品导航</h1> -->
        <ul id="CTypeList">
            <li  v-for="(item,index) in companyType" :key="index" :class="[item.name == active?'active-'+item.name:'','company-item-left','company-item-left'+item.name]"  @click="selectType(item.id)">
                <span  class="Q_title_left"></span>
                <span v-text="item.name" :class="[item.name == active?'active-title':'','Q_title_name']"></span>
            </li>
        </ul>
        <div class="conpanyContainer">
            <h1  class="h1-companybox">企业导航</h1>
            <ul class="companyBox">
                <li class="company-item" v-for="(item,index) in companyList" :key="index" @click="redirect(item.companyId)" >
                    <input type="hidden" name="companyId" :value="item.companyId">
                    <input type="hidden" name="type" :value="item.type">
                    <span class="companyImage">
                        <span class="companyImage-img" :style="'background-image:url('+item.imgPath+');'"></span>
                    </span>
                    <div style="padding:15px 20px;">
                       <span v-text="item.companyName" class="Q_title"></span>
                        <span class="star"></span>
                    </div>
                </li>
            </ul>
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
            url:'http://10.252.26.240:8080/h2-bim-project/project2/showCompany',
            pathInit:'',
            companyList:[],
            userName:'',
            userId:'',
            token:'',
            active:'',
            companyType:{},
        }
    },
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.getProjectList();
        vm.getUserInfo()
    },
    methods:{
        logout(){
                var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/logout',
                    headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == "0"){
                    localStorage.removeItem('token')
                    vm.$router.push({
                        path:'/login'
                    }) 
                }
            }).catch((err)=>{
                console.log('退出失败!')
                console.log(err)
            })
        },
        getUserInfo(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/getOnlineInfo',
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
               // console.log('getUserInfo获取用户的姓名和项目权限')
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    vm.userName = response.data.rt.onlineInfo.userName;
                    vm.userId = response.data.rt.onlineInfo.userId;
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
                url:this.url,
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                console.log(response);
                if(typeof(response.data.rt.companyId) != 'undefined'){ //唯一企业
                    vm.pathInit = 'http://10.252.26.240:8080/h2-bim-project/project2/companyInstall/'+response.data.rt.companyId
                    vm.initCompany()
                }else if(typeof(response.data.rt.companyList) != 'undefined' && response.data.rt.companyList.length != 0){//多个企业
                    console.log(response.data.rt.companyList);
                    vm.companyList = response.data.rt.companyList
                }else if(typeof(response.data.rt.countQ1) != 'undefined'){
                    var obj = []
                    var index = 0
                    if(response.data.rt.countQ3 !=0){
                        obj.push({
                            'name':'Q3',
                            'id':3,
                        })
                        vm.active='Q3'
                        index = 3
                    }
                    if(response.data.rt.countQ2 !=0){
                        obj.push({
                            'name':'Q2',
                            'id':2,
                        })
                        vm.active='Q2'
                        index = 2
                    }
                    if(response.data.rt.countQ1 !=0){
                        obj.push({
                            'name':'Q1',
                            'id':1,
                        })
                        vm.active='Q1'
                        index = 1
                    }
                    vm.companyType = obj.reverse()
                    vm.selectType(index)
                }
            }).catch(function(error){
                // vm.$router.push({
                //   path:'/login'
                // })
            })
        },
        selectType(index){
             var vm = this
             vm.active = 'Q'+index
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/listCompany',
                params:{
                    type:index
                },
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                console.log(response);
                if(response.data.msg == "您没有登录或登录超时，请重新登录"){
                     vm.$router.push({
                        path:'/login'
                    })
                }
                vm.companyList = response.data.rt
            }).catch(function(error){
                vm.$router.push({
                  path:'/login'
                })
            })
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
                console.log(response);
                if(response.data.cd == "10009"){//跳转项目首页
                    localStorage.setItem('token',response.data.rt.session.onlineInfo.tokenId);
                    vm.token = response.data.rt.session.onlineInfo.tokenId;
                    this.$router.push({
                        path:'/projectlist'
                    })
                }else if(response.data.cd === "1"){
                    console.log(response.data.cd );
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
        redirect(key){
           var vm = this
            vm.pathInit = 'http://10.252.26.240:8080/h2-bim-project/project2/companyInstall/'+key
            vm.initCompany()
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
    .active-Q1 .Q_title_left,.active-Q2 .Q_title_left,.active-Q3 .Q_title_left{
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
    .company-item-leftQ1 .Q_title_left::after{
        background-image:url('../assets/2.png');
    }
    .company-item-leftQ2 .Q_title_left::after{
        background-image:url('../assets/1.png');
    }
    .company-item-leftQ3 .Q_title_left::after{
        background-image:url('../assets/3.png');
    }
    .active-Q1 .Q_title_left::after{
       background-image:url('../assets/2-1.png');
           top: 24px;
        left: 24px;
    }
    .active-Q2 .Q_title_left::after{
       background-image:url('../assets/1-1.png');
           top: 24px;
        left: 24px;
    }
    .active-Q3 .Q_title_left::after{
       background-image:url('../assets/3-1.png');
           top: 24px;
        left: 24px;
    }
    .active-Q1,.active-Q2,.active-Q3{
        position: relative;
    }
    .active-Q1::after,.active-Q2::after,.active-Q3::after{
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
        padding: 0 30px 0 42px;
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
        margin-left: 30px;
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

