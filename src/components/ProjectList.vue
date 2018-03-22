<template>
<div class="wrapper">
    <headerCommon></headerCommon>
    <el-row>
      <el-col :span="8" style="width:300px;margin-left:30px;" v-for="(item, index) in listData" :key="index" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <div :style="item.imgPath?'background-image:url('+item.imgPath+')':'background-image:url('+require('../assets/logo.png')+')'" class="image"></div>
          <div style="padding: 14px;">
            <span v-text="item.projName"></span>
            <div class="bottom clearfix">
              <time class="time" v-text="item.projManager"></time>
              <el-button type="text" @click="selectProject(item.projId)" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <router-link :to="{path:'/home/projHome'}">主页</router-link> -->
  </div>
</template>

<script>
import axios from 'axios'
import headerCommon from './header.vue'
export default {
  name: 'ProjectList',
   data(){
      return {
        token:'',
        listData:{},
        title:'我们的公司'
      }
  },
  components: {
    headerCommon
  },
  mounted(){
    var vm = this
    vm.token  = localStorage.getItem('token')
    vm.viewFlag()
  },
  methods:{
      logout(){
         var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/logout',
                data:{
                  'token':vm.token
                },
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
      viewFlag(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/user2/index',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
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
            }).catch((err)=>{
                vm.$router.push({
                  path:'/login'
                })
            })
        },
         toProjectList(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/user2/project/list',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                console.log(response);
                if(typeof(response.data.rt) != 'undefined'){
                  vm.listData = response.data.rt;
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        selectProject(id){
            var vm = this
            vm.$router.push({
              path:`/home/projHome/${id}`,
            })
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

  .image {
    height: 320px;
    width: 100%;
    display: block;
    background-size: 100% 100%;
    background-position: center center; 
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
