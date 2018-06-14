<template>
<div class="wrapper">
    <headerCommon :username="userName"></headerCommon>
    <div class="header-bar">
      <span class="bar-title">工程导航</span>
      <span class="bar-button" @click="changeStyle" v-text="styleTitle"></span>
    </div>
    <div class="clearfix item-proj-box0" v-if="show0">
      <div v-for="(item, index) in listData" :key="index" :class="[{'ongoing_color_b':item.activated,'end_color_b':item.expired},'item-proj']" @click="selectProject(item.projId,item.expired,item.projName)">
          <div :class="[{'ongoing':item.activated,'end':item.expired},'item-head','new']">
            <span class="item-title">工程名称</span>
            <div :class="[item.projName.length>13?'item-name-box-s':'','item-name-box']">
              <span class="item-name" v-text="item.projName.length>25?item.projName.substr(0,25)+'...':item.projName" :title="item.projName"></span>
            </div>
            <img class="img"  src="../assets/003.png" alt="">
          </div>
          <div class="item_body">
            <div style="height:102px;overflow:hidden;">
              <p style="margin-bottom:18px" class="clearfix">
                <span class="body-left">工程账号</span><span class="body-right" v-text="item.projCode"></span>
              </p>
              <p style="margin-bottom:18px" class="clearfix">
                <span class="body-left">工程管理员</span><span class="body-right" v-text="item.projAdminName"></span>
              </p>
              <p style="margin-bottom:24px" class="clearfix" v-for="(val,key) in item.overviewList" :key="key">
                <span class="body-left" v-text="val.viewKey"></span><span class="body-right" v-text="val.viewVal"></span>
              </p>
            </div>
            <span v-text="item.expired?'已到期':(item.activated?'进行中':'新项目')" :class="[{'ongoing_s':item.activated,'end_s':item.expired},'new_s','text-s']"></span>
          </div>
      </div>
    </div>
    <div class="item-proj-box" v-else>
       <div  v-for="(item, index) in listData" :key="index+'line'" :class="[{'ongoing_color':item.activated,'end_color':item.expired},'item-proj-line']" @click="selectProject(item.projId,item.expired,item.projName)">
         <span class="proj-state-box">
           <span class="proj-state-bg" :class="[{'ongoing_bg':item.activated,'end_bg':item.expired}]"></span>
           <span class="proj-state-title" v-text="item.expired?'已到期':(item.activated?'进行中':'新项目')"></span>
         </span>
         <img :src="item.imgPath" class="line-img" alt="">
         <div class="line-detial-box">
            <h1 v-text="item.projName"></h1>
            <div class="line-content-box">
              <p  class="clearfix line-p">
                <span class="body-left-line" style="width:87px;">工程账号:</span><span class="body-left-line" v-text="item.projCode"></span>
              </p>
              <p class="clearfix line-p">
                <span class="body-left-line" style="width:87px;">工程管理员账号:</span><span class="body-left-line" v-text="item.projAdminAccount"></span>
              </p>
              <p class="clearfix line-p">
                <span class="body-left-line" style="width:87px;">工程管理员姓名:</span><span class="body-left-line" v-text="item.projAdminName"></span>
              </p>
              <p class="clearfix line-p">
                <span class="body-left-line" style="width:87px;">工程管理员电话:</span><span class="body-left-line" v-text="item.projAdminTelphone"></span>
              </p>
              <p class="clearfix line-p">
                <span class="body-left-line" style="width:87px;">授权用户数量:</span><span class="body-left-line" v-text="item.projUserNum+' '+item.projUserNum"></span>
              </p>
            </div>
            <div class="line-content-box">
              <table>
                <tbody>
                  <tr class="line-table" >
                    <td class="body-left-table">到期日期:</td>
                    <td class="body-right-table" v-text="item.projExpireTime"></td>
                  </tr>
                  <tr class="line-table" v-for="(val,key) in item.overviewList" :key="key">
                    <td class="body-left-table" v-text="val.viewKey+':'"></td>
                    <td  class="body-right-table" v-text="val.viewVal"></td>
                  </tr>
                </tbody>
              </table>
            </div>
         </div>
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
  margin-top: 92px;
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
  box-shadow: 0px 0px 13px #f1f1f1;
  margin-top: 20px;
  margin-left: 20px;
  position: relative;
  cursor: pointer;
}
.item-proj:hover,.item-proj-line:hover{
    box-shadow: 0px 0px 13px #c06000;
}
.ongoing_color:hover,.ongoing_color_b:hover{
  box-shadow: 0px 0px 9px #d40000;
}
.end_color:hover,.end_color_b:hover{
  box-shadow: 0px 0px 9px #221815;
}
.item-proj-box0{
  padding-bottom:20px;
}
.item-proj-box{
  width:100%;
  padding: 0px 20px;
  box-sizing: border-box;
}
.item-proj-line{
  width:100%;
  height: 272px;
  box-shadow: 0px 0px 9px rgba(34, 24, 21, .17);
  position: relative;
  cursor: pointer;
  margin-top: 30px;
  padding: 44px 55px 38px 55px;
  box-sizing: border-box;
}
.proj-state-box{
  display: block;
  position: absolute;
  width: 75px;
  height: 75px;
  top: 40px;
  left: 51px;
}
.proj-state-bg{
  display: block;
  width: 100%;
  height: 100%;
  background-image: url('../assets/88989.png');
}
.ongoing_bg{
  background-image: url('../assets/88990.png');
}
.end_bg{
  background-image: url('../assets/88991.png');
}
.proj-state-title{
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  line-height: 14px;
  position: absolute;
  top: 21px;
  left: 6px;
  transform: rotate(-45deg);
  letter-spacing: 2px;
}
.line-img{
  float: left;
  width: 250px;
  height: 190px;
}
.line-detial-box{
  float: left;
  width: 780px;
  overflow: hidden;
  margin-left: 20px;
}
.line-detial-box>h1{
  font-size: 22px;
  color: #333333;
  line-height: 22px;
  text-align: left;
  margin: 11px 0;
}
.line-p{
  margin-top: 17px;
}
.line-content-box{
  width:50%;height:145px;float:left;overflow:hidden;
}
.body-left-line{
  font-size: 12px;
  line-height: 12px;
  text-align: left;
  float: left;
  margin-left: 10px;
  color: #666666;
}
p>.body-left-line:first-of-type{
  margin-left: 0;
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
  color: rgba(255, 255, 255, .3);
  padding: 23px 0 0 20px;
  text-align: left; 
  line-height: 14px;
}
.item-name-box{
  display: block;
  height: 78px;
  line-height: 54px;
  text-align: left;
  margin: 0 20px;
  overflow: hidden;
}
.item-name-box-s{
  line-height: 66px;
}
.item-name{
  font-size: 18px;
  color: #ffffff;
  line-height: 26px;
  display: inline-block;
  font-weight: bold; 
  vertical-align: middle;
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
  width: 50%;
  float: right;
  max-height: 28px;
  text-align: right;
  color: #666666;
}
.line-content-box table{
  width: 100%;
  height: 100%;
  margin-top:8px; 
}
.line-table{
  margin-top: 17px;
  height: 12px;
}
.body-left-table{
  font-size: 12px;
  color: #666666;
  line-height: 27px;
  text-align: left;
  width: 55px;
}
.body-right-table{
  font-size: 12px;
  color: #666666;
  line-height: 27px;
  text-align: left;
  padding-left: 4px; 
}
</style>

<script>
import axios from 'axios'
import headerCommon from './header.vue'
export default {
  name: 'ProjectList',
   data(){
      return {
        show0:true,
        token:'',
        listData:[],
        title:'我们的公司',
        userName:'',
        userId:'',
        styleTitle:'条形风格',
        BDMSUrl:''
      }
  },
  components: {
      headerCommon
  },
  mounted(){
      var vm = this
      vm.token  = localStorage.getItem('token')
      vm.BDMSUrl = vm.$store.state.BDMSUrl
      var defaultSubProjId = localStorage.getItem('defaultSubProjId') 
      if(defaultSubProjId != 'undefined'){
          localStorage.removeItem('defaultSubProjId')
      }
      vm.viewFlag()
      vm.getUserInfo()
  },
  methods:{
      changeStyle(){
        var vm = this
        vm.show0 = vm.show0?false:true
         vm.styleTitle = vm.show0?'条形风格':'牌型风格'
      },
      getUserInfo(){
          var vm = this
          vm.userName = localStorage.getItem('username')
          vm.userId = localStorage.getItem('userid')
      },
      viewFlag(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'user2/index',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                console.log(response);
                console.log(11111111111111111111111111111);
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
                url:vm.BDMSUrl+'user2/project/list',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
              console.log(response);
              console.log('++++++++++++++')
                if(response.data.rt != 0){
                  vm.listData = response.data.rt;
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        selectProject(id,expired,name){
          if(expired){
               this.$message({
                message: '项目已过期！',
                type: 'warning'
              });
          }else{
            var vm = this;
            localStorage.setItem('projId',id)
            localStorage.setItem('projName',name)
            vm.$router.push({
              path:`/home/projHome/${id}`,
              query: { firstView: 'Y' }
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
        min-width: 1200px;
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
