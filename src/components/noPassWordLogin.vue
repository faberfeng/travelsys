<template>
    <div class="main" id="login">   
    </div>
</template>
<script>
import axios from 'axios';
import md5 from 'js-md5';

export default {
    name: 'Login',
    data(){
        return {
            login:{
                Id:'',
                Password:''
            },
            checked:false,
            BDMSUrl:'',
            projectData:{},
            token:'',
            isAuto:false
        }
    },
    created(){
        var vm = this;
        const token = localStorage.getItem('token') 
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        var defaultSubProjId = localStorage.getItem('defaultSubProjId') 
        if(defaultSubProjId != 'undefined'){
            localStorage.removeItem('defaultSubProjId')
        }
         this.Login()
    },
    methods:{
        func(event){
            var event = event || e;
            event.preventDefault();
        },
        //直接登陆
        Login(){
            this.login.Password = md5(this.login.Password);
            var formData = new FormData();
            formData.append('account',13564978306);
            formData.append('isRemember',this.isAuto);
            formData.append('password',this.login.Password);
            axios({
                method: 'Post',
                url: this.BDMSUrl + 'project2/login',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
                data:formData
            }).then((response) => {
                this.projectData = response.data;
                if (this.projectData.cd === '10004') {
                    localStorage.setItem('token', this.projectData.rt.session.onlineInfo.tokenId);
                    localStorage.setItem('username', this.projectData.rt.session.onlineInfo.realName);
                    localStorage.setItem('userid', this.projectData.rt.session.onlineInfo.userId);
                    this.$store.commit('changeImagePath',{
                        imagePath:this.projectData.rt.session.onlineInfo.imgUuid
                    })
                    this.$router.push({
                        path: '/showcompany'
                    })
                    sessionStorage.setItem('navigationPath','projectPage');
                } else if (this.projectData.cd === '10003') {
                    alert(this.projectData.msg) //密码不正确
                } else if (this.projectData.cd === '10000') {
                    alert(this.projectData.msg) //账号不存在
                }
            })
        },
    }
}
</script>
<style lang='less'>
</style>


