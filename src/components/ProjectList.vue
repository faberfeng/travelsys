<template>
<div class="wrapper">
    <headerCommon :username="userName"></headerCommon>
    <div class="header-bar">
      <span class="bar-title">工程导航</span>
      <span class="bar-button">条形风格</span>
    </div>
    <div v-for="(item, index) in listData" :key="index" class="item-proj" @click="selectProject(item.projId,item.expired)">
        <div :class="[{'ongoing':item.activated,'end':item.expired},'item-head','new']">
          <span class="item-title">工程名称</span>
          <span  class="item-name" v-text="item.projName"></span>
          <img class="img"  src="../assets/003.png" alt="">
        </div>
        <div class="item_body">
          <p style="margin-bottom:20px" class="clearfix">
            <span class="body-left">工程管理员</span><span class="body-right" v-text="item.projAdminName"></span>
          </p>
          <p style="margin-bottom:20px" class="clearfix">
            <span class="body-left">使用单位</span><span class="body-right" v-text="item.overviewList?item.overviewList[0].viewVal:''"></span>
          </p>
          <p style="margin-bottom:20px" class="clearfix">
            <span class="body-left">工程名称</span><span class="body-right" v-text="item.overviewList?item.overviewList[1].viewVal:''"></span>
          </p>
          <span v-text="item.expired?'已到期':(item.activated?'进行中':'新项目')" :class="[{'ongoing_s':item.activated,'end_s':item.expired},'item-head','new_s','text-s']"></span>
        </div>
    </div>
  </div>
</template>
<style scoped>
*{
  margin: 0;
  padding: 0;
}
.header-bar{
  margin-top: 25px;
  border-bottom: 1px solid #cccccc;
  height: 43px;
}
.bar-title{
  font-size: 18px;
  font-weight: bold;
  color: #fc3439;
  float: left;
  line-height: 18px;
  margin-top: 11px;
  margin-left: 20px;
  position: relative;
}
.bar-title::after{
  display: block;
  position: absolute;
  width: 72px;
  height: 2px;
  background: #fc3439;
  content: '';
  bottom: -15px;
}
.bar-button{
  float: right;
  width: 102px;
  height: 26px;
  border:1px solid #fc3439;
  border-radius: 2px;
  text-align: center;
  line-height: 26px;
  color: #fc3439;
  margin-right: 20px;
  font-size: 12px;
  cursor: pointer;
}
.bar-button:hover{
  background: #fc3439;
  color: #ffffff;
}
.item-proj{
  width:280px;
  height: 272px;
  float: left;
  box-shadow: 0px 0px 20px #f1f1f1;
  margin-top: 20px;
  margin-left: 20px;
  position: relative;
  cursor: pointer;
}
.item-head{
  width: 100%;
  height: 116px;
  position: relative;
}
.new{
  background: #ff9933;
}
.ongoing{
  background: #fc3439;
}
.end{
  background: #b3b3b3;
}
.new_s{
  color: #ff9933;
  font-size: 14px; 
}
.ongoing_s{
  color: #fc3439;
  font-size: 14px; 
}
.end_s{
  color: #b3b3b3;
  font-size: 14px; 
}
.text-s{
  display: block;
  line-height: 14px;
  text-align: left;
}
.img{
  display: block;
  position: absolute;
  bottom: 0px;
}
.item-title{
  display: block;
  font-size: 14px;
  color: #ffffff;
  padding: 23px 0 0 20px;
  text-align: left; 
  line-height: 14px;
}
.item-name{
  font-size: 18px;
  color: #ffffff;
  text-align: left;
  line-height: 18px;
  display: block;
  padding-left:20px;
  padding-top: 23px;
  font-weight: bold; 
}
.item_body{
  margin:25px 20px 0
}
.item_body span{
  line-height: 14px;
  font-size: 14px;
}
.body-left{
  float: left;
  color: #999999;
}
.body-right{
  float: right;
  color: #666666;
}
</style>

<script>
import axios from 'axios'
import headerCommon from './header.vue'
export default {
  name: 'ProjectList',
   data(){
      return {
        token:'',
        listData:[],
        title:'我们的公司',
        userName:'',
        userId:'',
      }
  },
  components: {
      headerCommon
  },
  mounted(){
      var vm = this
      vm.token  = localStorage.getItem('token')
      vm.viewFlag()
      vm.getUserInfo()
  },
  methods:{
      getUserInfo(){
          var vm = this
          vm.userName = localStorage.getItem('username')
          vm.userId = localStorage.getItem('userid')
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
                if(response.data.rt != 0){
                  vm.listData = response.data.rt;
                  for(var i=0;i<vm.listData.length;i++){
                    if(typeof(vm.listData[i].overviewList != 'undefined')){
                        // for(var j=0;j<vm.listData[i].overviewList.le){

                        // }
                    }
                  }
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        selectProject(id,expired){
          if(expired){
               this.$message({
                message: '项目已过期！',
                type: 'warning'
              });
          }else{
            var vm = this;
            localStorage.setItem('projId',id);
            vm.$router.push({
              path:`/home/projHome/${id}`,
            })
          }
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
        padding-bottom: 100px;
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
    width: 100%;
    display: block;
    background-size: 100% 100%;
    background-position: center center; 
  }

  .clearfix{
      clear: both;
      overflow: hidden;
      content:'';
  }
</style>
