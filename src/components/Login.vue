<template>
    <div class="main">
        <div>
            <el-input class="inp" v-model="login.Id" placeholder="id"/>
            <el-input class="inp" v-model="login.Password" placeholder="password" type="password"/>
        </div>
        <el-checkbox v-model="checked">记住我</el-checkbox>
        <el-button @click="Login">login</el-button>
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
          token:''
      }
  },
  created(){
      var vm = this
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
              console.log(response)
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
                  'isRemember':this.checked,
                  'password':this.login.Password
              }
          }).then((response)=>{
              this.projectData = response.data;
              localStorage.setItem('token',this.projectData.rt.session.onlineInfo.tokenId);
              if(this.projectData.cd === '10004'){
                  console.log(123)
                  this.$router.push({
                      path:'/showcompany'
                  })
              }
              console.log(this.projectData);
          })

      }
  }
}
</script>
<style lang='less'>

    .p{
        user-select: none;
        color: aqua;
    }
    .inp{
        width: 300px;
        display:block;
        margin:40px auto;
    }
</style>


