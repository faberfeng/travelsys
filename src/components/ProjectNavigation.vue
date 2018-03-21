<template>
    <div id="projectNavigation">
         <el-row>
            <el-col :span="24" class="header">
                <div class="headerImg">
                    <img src='http://q.qjbim.com/qjbim-file/upload/101/public/001/2017/12/15/9d789ae6-84c4-422c-8391-e9f38db883e5.png'/>
                </div>
                <div class="headerText">
                    {{title}}
                </div>
                <div class="headerInfo" @click="logout">
                    <img class="headerInfoImg" src='../assets/loginimg.png'/>
                </div>
            </el-col>
        </el-row>
        <h1>企业类型 工程类型</h1>
        <ul class="companyBox clearfix">
            <li class="company-item" v-for="(item,index) in companyList" :key="index" >
                <input type="hidden" name="companyId" :value="item.companyId">
                <input type="hidden" name="type" :value="item.type">
                <span v-text="item.companyName"></span>
                <button @click="redirect(item.companyId)">进入</button>
            </li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name:'ProjectNavigation',
    data(){
        return{
            url:'http://10.252.26.240:8080/h2-bim-project/project2/showCompany',
            pathInit:'',
            companyList:{},
            title:'我们的公司',
            token:''
        }
    },
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.getProjectList();
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
                }else if(typeof(response.data.rt.companyList) != 'undefined'){//多个企业
                    console.log(response.data.rt.companyList)
                    vm.companyList = response.data.rt.companyList
                }
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
                    localStorage.setItem('token',response.data.rt.session.onlineInfo.tokenId)
                    vm.token = response.data.rt.session.onlineInfo.tokenId
                    this.$router.push({
                        path:'/projectlist'
                    })
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
        width: 240px;
        height: 360px;
        background: cadetblue;
        margin-left: 30px;
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

</style>

