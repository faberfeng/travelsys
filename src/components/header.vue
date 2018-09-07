<template>
    <el-row class="container-header">
        <el-col :span="24" class="header">
            <div class="headerImg">
                <img v-if="!newLogo" :src="require('../assets/defaultlogo.png')"/>
                <img v-else :src="isUseDefaultLogo?newLogo:require('../assets/defaultlogo.png')"/>
            </div>
            <div class="headerText" v-text="proname"></div>
            <div class="headerInfo">
                <img class="headerInfoImg" :src="userImg?QJFileManageSystemURL+userImg:require('../assets/people.png')" />
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
            BDMSUrl:'',
            QJFileManageSystemURL:'',
        }
    },
    props: ['username','userid','proname','proimg','userimg'],
    created(){
        var vm = this
        vm.token  = localStorage.getItem('token')
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
    },
    computed:{
        userImg(){
            return this.$store.state.imgUuid;
        },
        newLogo(){
            return this.$store.state.projectLogo;
        },
        isUseDefaultLogo(){
            return this.$store.state.isUseDefaultLogo;
        }
    },
    methods:{
        app(){
            var app1 =this.$refs.iframe1.contentWindow;
        },
        logout(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/logout',
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
                    this.$store.commit('switchLogo',{//显示默认logo
                        isDefaultLogo:false
                    })
                    localStorage.clear('vuex');//清除所有localStorage
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

        /* position: fixed; */
        margin: 0px;
        padding:0px;
        /* left: 0;
        right: 0; */
        z-index: 1001;
        /* overflow-y: auto; */
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

