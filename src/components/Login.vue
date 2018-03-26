<template>
    <div class="main" id="login">
        <div class="loginHeader">
            <div class="firstTitle">
               <span class="firstTitleText">华建H系列 </span> 
                <span class="sendTitle">工程协调应用系统</span></div>
            <button class="registerBtn">注册</button>
        </div>
        <div class="loginBody">
            <div class="loginDialog">
                <p class="loginBodyText">系统账号登陆</p>
                <div class="loginInput">
                    <div id="firstInp"><input placeholder="账号" class="input" v-model="login.Id"/></div>
                    <div id="secondInp" class="af"><input placeholder="密码" type="password" class="input lastInput" v-model="login.Password"/></div>
                </div>
                <div class="autoLogin"> <el-checkbox v-model="isAuto" class="autoLoginText">下次自动登陆</el-checkbox></div>
                
                <button class="login" @click="Login">登陆</button>
                <div class="loginInfo">
                    <a class="loginInfoLeft">立即注册</a>
                    <a class="loginInfoRight">忘记密码</a>
                </div>
                <button class="loginWidthYun">云华建账号登陆</button>
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
          loginUrl:'http://10.252.26.240:8080/h2-bim-project/project2/login',
          projectData:{},
          token:'',
          isAuto:false
      }
  },
  created(){
      var vm = this;
      const token = localStorage.getItem('token') 
      if(token != 'undefined'){
          vm.token = token
          //判断是否登陆
           this.BeforeLogin()
      }
  },
  methods:{
        BeforeLogin(){
          var vm = this
          axios({
              method:'Get',
              url:this.loginUrl,
              headers:{
                  'content-type':'application/json;charset=UTF-8',
                   'token':vm.token
              },
          }).then((response)=>{
             // console.log(response)
              if(typeof(response.data.cd) != 'undefined' && response.data.cd == '10004'){
                 vm.$router.push({
                     path:'/showcompany'
                 })
              }
          })
        },
      Login(){
            
          this.login.Password = md5(this.login.Password);
          axios({
              method:'Post',
              url:this.loginUrl,
              headers:{
                  'content-type':'application/json;charset=UTF-8',
              },
              params:{
                  'account':this.login.Id,
                  'isRemember':this.isAuto,
                  'password':this.login.Password
              }
          }).then((response)=>{
              this.projectData = response.data;
              if(this.projectData.cd === '10004'){
                  localStorage.setItem('token',this.projectData.rt.session.onlineInfo.tokenId);
                  localStorage.setItem('username',this.projectData.rt.session.onlineInfo.userName);
                  localStorage.setItem('userid',this.projectData.rt.session.onlineInfo.userId);
                  this.$router.push({
                      path:'/showcompany'
                  })
              }else if(this.projectData.cd === '10003'){
                  alert(this.projectData.msg)//密码不正确
              }else if(this.projectData.cd === '10000'){
                  alert(this.projectData.msg)//账号不存在
              }
              console.log(this.projectData);
          })

      }
  }
}
</script>
<style lang='less'>
    #login{
        width: 100%;
        height: 100vh;
        .loginHeader{
            width: 100%;
            height: 72px;
            background: #ffffff;
            text-align: left;
            position: relative;
        }
        .firstTitle,.sendTitlem.Btn{
            display: inline-block;
        }
        .firstTitle{
            display: inline-block;
            color: #fc3439;
            font-family: '微软雅黑';
            font-weight: bold;
            font-size: 32px;
            line-height: 32px;
            margin:27px 0 14px 0px; 
            position: absolute;
            left: 7.833%;
        }
        // .firstTitleText{
        //     font-size: 32px;
        //     line-height: 32px;
        // }
        .sendTitle{
            color: #333;
            font-size: 20px;
            line-height: 20px;
            display: inline-block;
            width: 162px;
            font-weight: normal;
            margin-left: 5px;
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
        }
        .loginBody{
            width: 100%;
            height: 100vh;
            background: url('../assets/loginImg.jpg');
            background-position: center;
            position: relative;
        }
        .loginDialog{
            width: 360px;
            height: 406px;
            border-radius: 2px;
            position: absolute;
            top: 136px;
            right: 13.5%;
            // margin: 49px 161px 0 680px;
            background: #fff;
            border:1px solid #ccc;
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
            margin: 44px 40px 0 40px;
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
        }
        #firstInp,#secondInp{
            height: 40px;
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

        #lastInput:after{

            content: url('../assets/login-person.png');
        }
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
            top: -2px;
        }
        .el-checkbox__inner{
            width: 10px;
            height: 10px;
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
        }
        .loginInfo{
            width: 280px;
            margin: 16px auto 0;
            overflow: auto;
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
        }
    }
</style>


