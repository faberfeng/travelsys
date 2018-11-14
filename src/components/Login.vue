<template>
    <div class="main" id="login">
        <div class="loginHeader">
            <div style="width:1200px;position:relative;margin:0 auto;height:72px;">
                <div class="firstTitle">
                    <span class="firstTitleText">BDMS建筑数据管理系统 </span> 
                    <span class="sendTitle">工程建设全过程项目管理系统</span></div>
                <!-- <button class="registerBtn">注册</button> -->
            </div>
        </div>
        <div class="loginBody">
            <div style="width:1200px;margin:0 auto;height:100%;position:relative;">
                <div class="loginDialogSide"></div>
                <div class="loginDialog">
                    <p class="loginBodyText">系统账号登陆</p>
                    <form onsubmit="return false;" method="post">
                        <div class="loginInput">
                            <div id="firstInp"><input placeholder="账号" name="id" class="input" v-model="login.Id"/></div>
                            <div id="secondInp" class="af"><input @keyup.enter="Login" name="password" placeholder="密码" type="password" class="input lastInput" v-model="login.Password"/></div>
                        </div>
                        <div class="autoLogin"> <el-checkbox v-model="isAuto" class="autoLoginText">下次自动登陆</el-checkbox></div>
                        <input type="submit" style="display:none;"/>
                    </form>
                    <button class="login" @click="Login">登录</button>
                    <div class="loginInfo">
                        <a class="loginInfoLeft" href="http://bdms.arctron.cn/arctron-usercenter/register/registerIndex" target="blank">立即注册</a>
                        <a class="loginInfoRight" href="http://bdms.arctron.cn/arctron-usercenter/register/forgetPwd" target="blank">忘记密码</a>
                    </div>
                    <button class="loginWidthYun" style="display:none">云华建账号登陆</button>
                </div>
            </div>
        </div>   
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
         this.validateInstance()
        if(token != 'undefined'){
            vm.token = token
            //判断是否登陆
            this.BeforeLogin()
        }
    },
    methods:{
        func(event){
            var event = event || e;
            event.preventDefault();
        },
        //实例验证
        validateInstance(){
            axios({
                method:'get',
                url: this.BDMSUrl +'user2/validateInstance',
                headers:{
                    'token':this.token
                },
            }).then((response) => {
               
            })
        },
        BeforeLogin(){
            var vm = this
            axios({
                method:'Get',
                url:vm.BDMSUrl+'project2/login',
                headers:{
                    'content-type':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(typeof(response.data.cd) != 'undefined' && response.data.cd === '10004'){
                    vm.$router.push({
                        path:'/showcompany'
                    })
                }
            })
        },
        //需要密码登陆
        Login(){
            this.login.Password = md5(this.login.Password);
            var formData = new FormData();
            formData.append('account',this.login.Id.trim());
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
        }
    }
}
</script>
<style lang='less'>
    
    #login{
        width: 100%;
        height: 100vh;
        *{
            margin: 0;
            padding: 0;
        }
        .loginHeader{
            width: 100%;
            height: 72px;
            background: #ffffff;
            text-align: left;
            border: none;
        }
        .firstTitle{
            display: inline-block;
            color: #fc3439;
            font-family: '微软雅黑';
            font-weight: bold;
            margin:27px 0 0px 0px; 
            position: absolute;
            left: 94px;
            border: none;
        }
        .firstTitleText{
            font-size: 32px;
            display: inline-block;
            line-height: 32px;
         }
        .sendTitle{
            color: #333;
            font-size: 20px;
            line-height: 20px;
            display: inline-block;
            font-weight: normal;
            margin-left: 22px;
        }
        .registerBtn{
            width: 56px;
            height: 28px;
            background: #fff;
            border: 1px solid #ccc;
            cursor: pointer;
            border-radius: 2px;
            color: #999999;
            font-size: 12px;
            margin-right: 0px;
            float: right;
            margin-right: 0px;
            margin-top: 28px;
            padding: 0;
            box-sizing: content-box;
            -webkit-box-sizing: content-box;
            -moz-box-sizing: content-box;
            -ms-box-sizing:content-box;
        }
        .loginBody{
            width: 100%;
            height: calc(100vh - 72px);
            border:none;
            background: url('../assets/loginImg.jpg');
            background-position: center;
            position: relative;
        }
        .loginDialogSide{
            width: 316px;
            height: 193px;
            background: url(../assets/loginImage.png);
            position: absolute;
            left: 195px;
            top: 183px;
        }
        .loginDialog{
            width: 360px;
            height: 406px;
            border-radius: 2px;
            position: absolute;
            top: 135px;
            left: 679px;
            background: #fff;
        }
        .loginBodyText{
            color:#fc3439;
            font-size: 24px;
            line-height: 24px;
            margin: 0 auto;
            font-weight: bold;
            margin-top: 49px;
            width: 200px;
        }
        .loginInput{
            margin: 43px 40px 0 40px;
            position: relative;
            height: 104px;
        }
        .input{
            width: 208px;
            height: 40px;
            border-radius: 2px;
            outline: none;
            border: 1px solid #ccc;
            padding: 0 35px;
            color: #333;
            box-sizing: content-box;
        }
        // 修改chorme 记住密码时，自动填充的背景色的问题
        .input:-webkit-autofill { 
            box-shadow: 0 0 0px 1000px white inset;
            -webkit-box-shadow: 0 0 0px 1000px white inset;//修改背景
            -webkit-text-fill-color: #333; //修改字体颜色
        }
        .input-placeholder{
            color:#ccc;
        }
        ::-webkit-input-placeholder {/*Chrome/Safari*/
            color:#ccc;
        }
        ::-moz-placeholder {/*Firefox*/
            color:#ccc;
        }
        ::-ms-input-placeholder {/*IE*/
            color:#ccc;
        }
    
        #firstInp,#secondInp{
            height: 42px;
            width: 280px;
        }
        #firstInp:after{
            content: url('../assets/login-person.png');
            position: relative;
            top: -33px;
            left: -120px;
            
        }
        #secondInp{
            margin-top: 22px;
        }
        #secondInp:after{
            content: url('../assets/login-password.png');
            position: relative;
            top: -33px;
            left: -120px;
            
        }

        // #lastInput:after{
        //     content: url('../assets/login-person.png');
        // }
        .autoLogin{
            text-align: left;
            line-height: 12px;
            margin: 10px 40px 0 40px;
            color: #ccc;
            font-size: 12px;
            font-weight: normal;
        }
        .el-checkbox__label{
            font-size: 12px;
            line-height: 12px;
            padding-left:5px; 
        }
        .el-checkbox__input{
            position: relative;
            // top: -2px;
        }
        .el-checkbox__inner{
            width: 12px;
            height: 12px;
        }
        .autoLoginText {
            color: #ccc;
            font-size: 12px;
            line-height: 12px;
        }
        .autoLoginDiv{
            width:10px;
            height: 10px;
            border: 1px solid #ccc;
            display: inline-block;
            margin-right: 5px;
            position: relative;
            top: 2px;
        }
        .login{
            width: 280px;
            margin: 20px 40px 0px 40px;
            height: 42px;
            background-color: #fc3439;
            border: none;
            color: #fff;
            cursor: pointer;
            padding: 0;
            font-size: 18px;
            border-radius: 2px;
        }
        .login:hover{
            background: #ff5257;
        }
        .loginInfo{
            width: 280px;
            margin: 15px auto 0;
            overflow: auto;
            height: 20px;
        }
        .loginInfo .loginInfoLeft,.loginInfo .loginInfoRight{
            color: #42ace5;
            font-size: 14px;
            line-height: 18px;
            font-weight: normal;
            cursor: pointer;
            text-decoration:underline;
            width: 60px;
        }
        .loginInfoLeft{
            float: left;
        }
        .loginInfoRight{
            float: right;
        }
        .loginInfoLeft:hover,.loginInfoRight:hover{
            font-weight: bold;
        }
        .loginWidthYun{
            width: 131px;
            height: 29px;
            background: none;
            border: 1px solid #ccc;
            border-radius: 2px;
            margin: 12px auto 0;
            cursor: pointer;
            color:#ccc;
            font-size: 12px;
            padding: 0;
            box-sizing: content-box;
            -webkit-box-sizing: content-box;
            -moz-box-sizing: content-box;
            -ms-box-sizing:content-box;
            position: relative;
            top: -2px;
        }
        .loginWidthYun:hover,.registerBtn:hover{
            color: #fc3439;
        }
    }
</style>


