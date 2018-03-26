<template>
    <div id="projectNavigation">
        <headerCommon :username="userName"></headerCommon>
        <h1 v-show="companyType.length>0">产品导航</h1>
        <ul class="companyBox clearfix">
            <li class="company-item" v-for="(item,index) in companyType" :key="index" :class="item.name" >
                <span v-text="item.name" class="Q_title" @click="selectType(item.id)"></span>
            </li>
        </ul>
         <h1  v-show="companyList.length>0">企业导航</h1>
        <ul class="companyBox clearfix">
            <li class="company-item" v-for="(item,index) in companyList" :key="index" >
                <input type="hidden" name="companyId" :value="item.companyId">
                <input type="hidden" name="type" :value="item.type">
                <img :src="item.imgPath" alt="" class="companyImage">
                <span v-text="item.companyName" class="Q_title"></span>
                <button @click="redirect(item.companyId)" class="button-company">进入</button>
            </li>
        </ul>
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
            companyList:{},
            userName:'',
            userId:'',
            token:'',
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
                console.log(response);
                console.log('获取用户信息');
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
                console.log('获取企业列表');
                if(typeof(response.data.rt.companyId) != 'undefined'){ //唯一企业
                    vm.pathInit = 'http://10.252.26.240:8080/h2-bim-project/project2/companyInstall/'+response.data.rt.companyId
                    vm.initCompany();
                    console.log(123);
                }else if(typeof(response.data.rt.companyList) != 'undefined' && response.data.rt.companyList.length != 0){//多个企业
                    console.log(response.data.rt.companyList);
                    vm.companyList = response.data.rt.companyList;
                }else if(typeof(response.data.rt.countQ1) != 'undefined'){
                    var obj = []
                    if(response.data.rt.countQ1 !=0){
                        obj.push({
                            'name':'Q1',
                            'id':1,
                        })
                    }
                    if(response.data.rt.countQ2 !=0){
                        obj.push({
                            'name':'Q2',
                            'id':2,
                        })
                    }
                    if(response.data.rt.countQ3 !=0){
                        obj.push({
                            'name':'Q3',
                            'id':3,
                        })
                    }
                    vm.companyType = obj
                }
            }).catch(function(error){
                // vm.$router.push({
                //   path:'/login'
                // })
            })
        },
        selectType(index){
             var vm = this
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
                console.log('获取企业个数')
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
                console.log('导航到企业');
                if(response.data.cd == "10009"){//跳转项目首页
                    localStorage.setItem('token',response.data.rt.session.onlineInfo.tokenId)
                    vm.token = response.data.rt.session.onlineInfo.tokenId
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
        redirect(key){
           var vm = this;
            vm.pathInit = 'http://10.252.26.240:8080/h2-bim-project/project2/companyInstall/'+key
            vm.initCompany()
        }
    }
}
</script>
<style lang="less">
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .company-item{
        float: left;
        width: 186px;
        height: 226px;
        background: cadetblue;
        margin-left: 30px;
        position: relative;
        .button-company{
            display: none;
            position: absolute;
            bottom: 0;
            left: 50%;
          margin-left: -21px;
          cursor: pointer;
        }
        &:hover .button-company{
            display: block;
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
      text-align: center;
    font-size: 36px;
    color: #fff;
    height: 170px;
    line-height: 170px;
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
        width: 100%;
        height: 110px;
    }
</style>

