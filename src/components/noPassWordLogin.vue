<template>
    <div class="main" id="login" style="margin:0px auto">
        <!-- <img src="../assets/huajianlogo.png"  style="background:#ccc;margin:"/>
        <p style="font-size:30px;color:red">没有进入工程业务的权限</p> -->
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
        // this.createCookie("BITRIX_SM_LOGIN",13564978306)
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
            var str='';
             
            str=this.readCookie("BITRIX_SM_LOGIN");
            console.log(str);
           if(str==null){
                 this.$router.push({
                        path: '/login'
                    })
            }
            console.log(str);
            formData.append('account',str);
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
                    // alert(this.projectData.msg) //密码不正确
                } else if (this.projectData.cd === '10000') {
                    // alert(this.projectData.msg) //账号不存在
                }
            })
        },
       
        createCookie(name,value,days) {
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime()+(days*24*60*60*1000));
                        var expires = "; expires="+date.toGMTString();
                    }
                    else var expires = "";
                    document.cookie = name+"="+value+expires+"; path=/";
                },
        
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
}
</script>
<style lang='less'>
</style>


