<template>
    <el-row class="container-header">
        <el-col :span="24" class="header">
            <div class="headerImg">
                <img :src="proimg?proimg:'http://q.qjbim.com/qjbim-file/upload/101/public/001/2017/12/15/9d789ae6-84c4-422c-8391-e9f38db883e5.png'"/>
            </div>
            <div class="headerText" v-text="proname"></div>
            <div class="headerInfo">
                <img class="headerInfoImg" src='../assets/loginimg.png'/>
                <div class="infoHover">
                    <p class="p1 p-hover" v-text="username"></p>
                    <p class="p2 p-hover" @click="logout">退出</p>
                </div>
            </div>
            
        </el-col>
    </el-row>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default Vue.component('common-header', {
   data(){
        return{
      }
     },
    props: ['username','userid','proname','proimg'],
    mounted(){
        var vm = this
        vm.token  = localStorage.getItem('token')
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
                    localStorage.removeItem('token');
                    localStorage.removeItem('projId');
                    sessionStorage.removeItem('navigationPath');
                    sessionStorage.removeItem('settingActive');
                    vm.$router.push({
                        path:'/login'
                    }) 
                }
            }).catch((err)=>{
                console.log('退出失败!')
                    console.log(err)
            })
        },

        },
    })
</script>

<style scoped>
    .container-header{
        width: 100%;
        height: 68px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1001;
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
    .headerImg img{
        display: block;
        width: 100%;
        height: 100%;
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
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        overflow: hidden;
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
        height: 51px;
        line-height: 50px;
        margin: 0;
        color: #666666;
        font-size:14px;
        font-weight: normal;
        text-align: left;
        padding-left: 28px;
    }
    .p-hover:hover{
        background: #f12332;
        color: white!important;
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
</style>

