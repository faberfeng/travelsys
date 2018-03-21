<template>
    <div id="projectNavigation">
        <div>i am ok</div>
        <el-button @click="back" type="primary">登陆</el-button>
    </div>
</template>
<script>
import axios from 'axios';
var token  = localStorage.getItem('token')
export default {
    name:'ProjectNavigation',
    data(){
        return{
            url:'http://10.252.26.240:8080/h2-bim-project/project2/showCompany',
            pathInit:'',
        }
    },
    created(){
        this.getProjectList();
    },
    methods:{
        getProjectList(){
             var vm = this
            axios({
                method:'GET',
                url:this.url,
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':token
                },
            }).then((response)=>{
                console.log(response);
                if(response.data.rt.companyId){
                    vm.pathInit = 'http://10.252.26.240:8080/h2-bim-project/project2/companyInstall/'+response.data.rt.companyId
                    vm.initCompany()
                }
            })
        },
        //企业唯一
        initCompany(){
            var vm = this
            axios({
                method:'GET',
                url:vm.pathInit,
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':token
                },
            }).then((response)=>{
                console.log(response);
                if(response.data.cd == "10009"){//跳转项目首页
                    localStorage.setItem('token',response.data.rt.session.onlineInfo.tokenId)
                    token = response.data.rt.session.onlineInfo.tokenId
                    vm.viewFlag()
                }
            })
        },
        viewFlag(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/user2/index',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':token
                },
            }).then((response)=>{
                console.log(response);
                //企业为Q3类型，判断用户是否具有企业的“默认岗位，flag为结果
                if(typeof(response.data.rt.flag) != 'undefined' && response.data.rt.flag == true){
                    console.log('true')
                }else{
                    console.log('false')
                }
                vm.toProjectList()
            })
        },
         toProjectList(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/user2/project/list',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':token
                },
            }).then((response)=>{
                console.log(response);
                // //企业为Q3类型，判断用户是否具有企业的“默认岗位，flag为结果
                // if(typeof(response.data.rt.flag) != 'undefined' && response.data.rt.flag == true){
                //     console.log('true')
                // }else{
                //     console.log('false')
                // }
            })
        },
        back(){
            this.$router.push({
                path:'/login'
            })
        }
    }
}
</script>
<style lang="less">

</style>

