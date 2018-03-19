<template>
    <div class="main">
        <div>
            <input v-model="login.Id" placeholder="id"/>
            <input v-model="login.Password" placeholder="password" type="password"/>
        </div>
        <el-checkbox v-model="checked">记住我</el-checkbox>
        <button @click="Login">login</button>
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
          projectData:{}
      }
  },
  methods:{
      Login(){
          this.login.Password = md5(this.login.Password);
          axios({
              method:'Post',
              url:this.loginUrl,
              headers:{
                  'accept':'application/json;charset=UTF-8',
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
</style>


