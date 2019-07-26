<template>
<div class="wrapper">
    <headerCommon :username="userName" :proname="titleName" :userimg="userImg"></headerCommon>
      <!-- <div v-show="!noprojectShow" class="noproject">
            <div class="noprojectLeft"><img src='../assets/noproject.png'></div>
            <div class="noprojectRight">
                <div class="noprojectRight_header">您的帐号尚未开通任何工程授权。</div>
                <div class="noprojectRight_bottom">
                您有以下几种选择：<br/>
                第一种：退出您自己的账号，采用共同账号winter（密码:123654）体验和学习已经拥有数据的项目。<br/>第二种：如果您的同事已经开通了项目，请联系您的同事，将您的账号添加到工程协作名单中。<br/>第三种：如果您有自己负责的项目，可以点击<a style="display:inline" target="_blank" :href="applyIndexUrl">这里</a>，作为工程管理员申请开通一个新的项目。<br/>如有其它疑问或索取学习资料，请加入BDMS客服QQ群：855923282
                </div>
                <div></div>
            </div>
      </div> -->
    <div v-show="noprojectShow">
      <div class="header-bar">
        <span class="bar-title">工程导航</span>
        <span class="bar-button" v-show="barShow" @click="changeBarStyle" >条形风格</span>
        <span class="bar-button" v-show="brandShow" @click="changeBrandStyle">牌形风格</span>
        <!-- <span class="bar-button" v-show="mapShow" @click="changeMapStyle">地图风格</span> -->
      </div>
      <div class="clearfix item-proj-box0" v-if="show0">
        <div v-for="(item, index) in listData" :key="index"  :class="[{'ongoing_color_b':item.status==1,'end_color_b':item.expireTime<currentStampTime&&item.status==1},'item-proj']" v-show="item.status!=2" @click="selectProject(item.projectId,item.expireTime<currentStampTime,item.projName)">
            <div :class="[{'ongoing':item.status==1,'end':item.expireTime<currentStampTime&&item.status==1},'item-head','new']">
              <span class="item-title">工程名称</span>
              <div :class="[item.projectName.length>13?'item-name-box-s':'','item-name-box']">
                <span class="item-name" v-text="item.projectName.length>25?item.projectName.substr(0,25)+'...':item.projectName" :title="item.projectName"></span>
              </div>
              <img class="img"  src="../assets/003.png" alt="">
            </div>
            <div class="item_body">
              <div style="height:102px;overflow:hidden;">
                <p style="margin-bottom:18px" class="clearfix">
                  <span class="body-left">工程账号</span><span class="body-right" v-text="item.projectId"></span>
                </p>
                <p style="margin-bottom:18px" class="clearfix">
                  <span class="body-left">工程管理员</span><span class="body-right" v-text="item.creater"></span>
                </p>
                <!-- <p style="margin-bottom:24px" class="clearfix" v-for="(val,key) in item.overviewList" :key="key">
                  <span class="body-left" v-text="val.viewKey"></span><span class="body-right" v-html="val.viewVal"></span>
                </p> -->
              </div>
              <span v-text="item.status==1&&item.expireTime>currentStampTime?'进行中':(item.status==0?'新项目':'已到期')" :class="[{'ongoing_s':item.status==1,'end_s':item.expireTime<currentStampTime&&item.status==1},'new_s','text-s']"></span>
            </div>
        </div>
      </div>
      <div class="item-proj-box" v-if="show2" >
        <div  v-for="(item, index) in listData" :key="index+'line'" :class="[{'ongoing_color':item.status==1,'end_color':item.expireTime<currentStampTime&&item.status==1},'item-proj-line']" v-show="item.status!=2" @click="selectProject(item.projectId,item.expireTime<currentStampTime,item.projName)">
          <span class="proj-state-box">
            <span class="proj-state-bg" :class="[{'ongoing_bg':item.status==1,'end_bg':item.expireTime<currentStampTime&&item.status==1}]"></span>
            <span class="proj-state-title" v-text="item.status==1&&item.expireTime>currentStampTime?'进行中':(item.status==0?'新项目':'已到期')"></span>
          </span>
          <img :src="item.imgPath?item.imgPath:require('../assets/bg.png')" class="line-img" alt="">
          <div class="line-detial-box">
              <h1 v-text="item.projectName"></h1>
              <div class="line-content-box">
                <p  class="clearfix line-p">
                  <span class="body-left-line" style="width:87px;">工程账号:</span><span class="body-left-line" v-text="item.projectId"></span>
                </p>
                <!-- <p class="clearfix line-p">
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
                </p> -->
              </div>
              <div class="line-content-box">
                <table>
                  <tbody>
                    <!-- <tr class="line-table" >
                      <td class="body-left-table">到期日期:</td>
                      <td class="body-right-table" v-text="item.createDate"></td>
                    </tr> -->
                    <!-- <tr class="line-table" v-for="(val,key) in item.overviewList" :key="key">
                      <td class="body-left-table" v-text="val.viewKey+':'"></td>
                      <td  class="body-right-table" v-text="val.viewVal"></td>
                    </tr> -->
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      </div>
      <div v-show="show1" class="gisMap">
          <iframe allowfullscreen=true frameborder="no" border="0" marginwidth= "0" marginheight="0" src="http://42.159.153.210:8080/GISViewer/" style="width: 90%;height: 600px;padding: 30px" id ="gisWebgl"></iframe>
      </div>
      <!-- <el-amap-text style="color:white;background:#797979;font-size:16px;" v-for="text in markers" :key="text.projId" :text="text.projName" :offset="text.offset" :position="text.position" :events="text.events" ></el-amap-text>
            <el-amap-info-window  v-for="(item,index) in windows" :key="index" :position="item.position" :visible="item.visible1"  :template="item.template1"></el-amap-info-window> -->
      <!-- <div v-if="show1" class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="mapCenter" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
            <el-amap-marker v-for="(marker,index1) in markers" :vid="index1"  :key="index1" :position="marker.position" :events="marker.events" :template="marker.template" :offset="marker.offset" :draggable="true" :title="marker.projName"  ></el-amap-marker>
            <el-amap-marker v-for="(marker) in markers" :vid="marker.projId" :key="marker.projId" :position="marker.position" :events="marker.events" :draggable="true" :title="marker.projName"  ></el-amap-marker>
            <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :template="window.content"  ></el-amap-info-window>
        </el-amap>
      </div> -->
     
    </div>
</div>
</template>
<style lang="less" scoped>
*{
  margin: 0;
  padding: 0;
}
  .noproject{
          width: 1120px;
          height: 450px;
          // border:1px solid red;
          position:absolute;
          top:50%;
          left:50%;
          margin-left:-570px;
          margin-top:-220px;
      }
      .noprojectLeft{
          float: left;
        margin-top:50px;
      }
      .noprojectRight{
          float: right;
          width: 640px;
          height: 170px;
          margin-top:142px;
          .noprojectRight_header{
              font-size:24px;
              color:#fc3439;
              font-weight: bold;
              text-align: left;
              line-height: 50px;
          }
          .noprojectRight_bottom{
              line-height: 28px;
              font-size:14px;
              color:#666666;
              font-weight: bold;
              text-align: left;
          }
      }
.header-bar{
  /* margin-top: 92px; */
  margin-top:25px;
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
    box-shadow: 0px 0px 13px #d40000;
}
.ongoing_color:hover,.ongoing_color_b:hover{
  box-shadow: 0px 0px 9px #5295ef;
}
.end_color:hover,.end_color_b:hover{
  box-shadow: 0px 0px 9px #221815;
}
.item-proj-box0{
  padding-bottom:20px;
}
.gisMap{
  border: 1px solid #ccc;
}
.amap-page-container{
  // margin-top:40px;
   position:relative;  
  .amap-demo {
      margin:0 auto;
      height: 650px;
      width: 100%;         
               
      .prompt{
        background: white;
        width: 200px;
        height: 100px;
        text-align: center;
      }
    }
  
    .search-box {
      position: absolute;
      top: 25px;
      left: 100px;
    }
  
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
  background: #fc3439;
}
.ongoing{
  background: #5295ef;
}
.end{
  background: #b3b3b3;
}
.new_s{
  color: #fc3439;
  font-size: 14px; 
}
.ongoing_s{
  color: #5295ef;
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
import {AMapManager} from "vue-amap"
import moment from 'moment'
var gisApp;
let amapManager=new AMapManager();
export default {
  name: 'ProjectList',
 
   data(){
      
     let self=this;
      return {
        // projIds:[],
        getPositionList:'',
        getSiteStr:[],
        noprojectShow:true,
        show0:true,
        show1:false,
        show2:false,
        barShow:true,
        brandShow:false,
        mapShow:true,
        token:'',
        listData:[],
        listDataList:[],
        title:'我们的公司',
        userName:'',
        userId:'',
        styleTitle:'条形风格',
        BDMSUrl:'',
        titleName:'',
        applyIndexUrl:'',
        shareUrl:'',

        //高德地图变量
        // amapManager:'',
        amapManager,
        zoom: 12,
        mapCenter: [121.47519, 31.228833],
        searchMapCenter:[0, 0],
        events: {
          init: (o) => {
            // console.log(o.getCenter())
            // console.log(this.$refs.map.$$getInstance())
            o.getCity(result => {
              // console.log(result)
            })
          },
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
            // console.log(e,'出来');
          }
        },
        plugin: ['ToolBar', {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(o) {
              console.log(o);
            }
          }
        },
        ],
        markers: [],
        windows: [],
        window: '',
        window1: '',
        searchOption: {
            city: '上海',
            citylimit: true
        },
        pathInit:'',
        userImg:'',
        currentStampTime:'',
      }
  },
  components: {
      headerCommon
  },
  mounted(){
      var vm = this
      vm.token  = localStorage.getItem('token')
      vm.BDMSUrl = vm.$store.state.BDMSUrl
      vm.applyIndexUrl = vm.$store.state.applyIndexUrl
      vm.shareUrl = vm.$store.state.shareUrl
      vm.userImg=localStorage.getItem('userImg')
      var defaultSubProjId = localStorage.getItem('defaultSubProjId') 
      if(defaultSubProjId != 'undefined'){
          localStorage.removeItem('defaultSubProjId')
      }
      vm.currentStampTime=new Date().getTime();
      // vm.viewFlag()
      vm.getUserInfo()
      vm.initCompany()
      // console.log(this.$route.query.entId,'回来的entid');

  },
  created(){
    var vm = this
    vm.userName = localStorage.getItem('userName')
    vm.userId = localStorage.getItem('userId')
    this.titleName = localStorage.getItem('entName');
    localStorage.removeItem("navigationPath");
  },
  methods:{
    gisInit(){
        gisApp = document.getElementById("gisWebgl").contentWindow;
        console.log(gisApp,'gisApp');
        gisApp.postMessage({command:"Init",parameter:{menu:false,loadingFiles_display:true,background_url:""}},"*");
        // window.addEventListener("message", (e)=>{callback(e);})
    },
    getUserInfo(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'/user/getOnlineInfo',
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd === '-1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    vm.userName = response.data.rt.user.name;
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
      //获取工程列表
      initCompany(){
         var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'projectInfo/getUserProjectList',
                 headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
                params:{
                  entId:vm.$route.query.entId
                }
            }).then((response)=>{
                if(response.data.cd == "0"){//跳转项目首页
                    this.listData=response.data.rt;
                    // console.log(this.listData,'this.listData');
                }else if(response.data.cd === "1"){
                    alert(response.data.msg);
                    setTimeout(()=>{
                         vm.$router.push({
                            path:'/login'
                        })
                    },1000)
                   
                }
            }).catch(function(error){
                vm.$router.push({
                  path:'/login'
                })
            })

      },



      onSearchResult(pois) {
        // console.log(pois,'pois');
          let latSum = 0;
          let lngSum = 0;
          if (pois.length > 0) {
            pois.forEach(poi => {
              
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
              // this.markers.push([poi.lng, poi.lat]);
            });
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            this.mapCenter = [center.lng, center.lat];
          }
          // console.log(this.mapCenter,'this.mapCenter');
      },
      changeStyle(){
        var vm = this
        vm.show0 = vm.show0?false:true;
        vm.show1=false;
         vm.styleTitle = vm.show0?'条形风格':'牌型风格'
      },
      changeBarStyle(){
        var vm=this;
        this.barShow=false;
        this.brandShow=true;
        this.mapShow=true;
        
        this.show0=false;
        this.show1=false;
        this.show2=true;
      },

      changeMapStyle(){
        var vm=this;
        // vm.show0=false;
        // vm.show1=true;
        // console.log('成功')
        this.barShow=true;
        this.brandShow=true;
        this.mapShow=false;
        this.show2=false;
        this.show0=false;
        this.show1=true;
        var projIds=[];
        this.gisInit();
        // console.log(vm.listData,'vm.listData');
        // vm.listData.forEach((num)=>{
        //   projIds.push(num.projectId)
        // })
        // vm.getPosition(projIds)
        // console.log(document.getElementsByClassName('amap-overlay-text-container'),'样式试试');
      },
      changeBrandStyle(){
        var vm=this;
        this.barShow=true;
        this.brandShow=false;
        this.mapShow=true;
        this.show1=false;
        this.show0=true;
        this.show2=false;
      },
      // getUserInfo(){
      //     var vm = this
      //     vm.userName = localStorage.getItem('userName')
      //     vm.userId = localStorage.getItem('userId')
      // },
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
                //企业为Q3类型，判断用户是否具有企业的“默认岗位，flag为结果
                if(typeof(response.data.rt.flag) != 'undefined' && response.data.rt.flag == true){
                    // console.log('true')
                }else{
                    // console.log('false')
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
                if(response.data.rt != 0){
                  vm.listData = response.data.rt;
                  vm.listData.forEach((item)=>{
                    if(item.overviewList){
                      if(item.overviewList.length==1){
                        item.overviewList[0].viewKey=item.overviewList[0].viewKey+':';
                           Object.assign(item,{
                                site1:item.overviewList[0],
                                site2:{'viewKey':'','viewVal':''},
                                site3:{'viewKey':'','viewVal':''},
                            })
                      }else if(item.overviewList.length==2){
                        item.overviewList[0].viewKey=item.overviewList[0].viewKey+':';
                        item.overviewList[1].viewKey=item.overviewList[1].viewKey+':';
                         Object.assign(item,{
                                site1:item.overviewList[0],
                                site2:item.overviewList[1],
                                site3:{'viewKey':'','viewVal':''},
                            })
                      }else if(item.overviewList.length>=3){
                        item.overviewList[0].viewKey=item.overviewList[0].viewKey+':';
                        item.overviewList[1].viewKey=item.overviewList[1].viewKey+':';
                        item.overviewList[2].viewKey=item.overviewList[2].viewKey+':';
                         Object.assign(item,{
                                site1:item.overviewList[0],
                                site2:item.overviewList[1],
                                site3:item.overviewList[2]
                            })
                      }
                    }else{
                          Object.assign(item,{
                                    site1:{'viewKey':'','viewVal':''},
                                    site2:{'viewKey':'','viewVal':''},
                                    site3:{'viewKey':'','viewVal':''},
                                })
                    }
                    
                  });
                  // console.log(vm.listData,'vm.listData00000');
                  vm.getSiteStr = response.data.rt;
                  // var projIds=[];
                  // vm.listData.forEach((num)=>{
                  //   projIds.push(num.projId)
                  // })
                  // vm.getPosition(projIds)
                  // var vm=this;
                  // console.log(projIds,'projIds');
               
                }
                if(response.data.rt==null){
                   this.noprojectShow=false;
                }

            }).catch((err)=>{
                console.log(err)
            })
        },
        //回调函数
        pushMethod(siteList,siteLists){
            var vm=this;
            if(siteList.length==siteLists.length){
                  siteLists.forEach((items)=>{
                      // console.log(items.site,'items.site');
                      // console.log(items.siteData[0],'items.siteData0');
                      // console.log(items.siteData[1],'items.siteData1');
                      vm.addPosition(items.projId,items.siteData[0],items.siteData[1]);
                      // vm.addPosition();
                    })
            }
        },
        //两个数组相比找不不同的元素
        getArrDifference(arr1, arr2) {
                return arr1.concat(arr2).filter(function(v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v);
                });
          },
        // 添加工程地图位置
        addPosition(projectId,geoX,geoY){
          var vm=this;
          axios({
            method:'GET',
            url:vm.BDMSUrl+'/projectMap/addPosition',
            headers:{
              'token':vm.token
            },
            params:{
              projectId:projectId,
              geoX:geoX,
              geoY:geoY
            }
          }).then((response)=>{
            if(response.data.cd=='0'){
              vm.toProjectList();
              var projIds=[];
              console.log(vm.listData,'vm.listData');
              vm.listData.forEach((num)=>{
                projIds.push(num.projectId)
              })
              vm.getPosition(projIds)
              // vm.getPosition(projectId);
            }else{
              
            }
          })
        },
        // 根据id去除一个json数据的重复项
        filterObj(objcArray){
            for (var i = 0; i < objcArray.length; i++) {
                for (var j =i+1; j <objcArray.length; ) {
                    if (objcArray[i].projectId == objcArray[j].projectId ) { //通过id属性进行匹配；
                       objcArray.splice(j, 1); //去除重复的对象；
                    }else {
                       j++;
                    }
                }
           }
           return objcArray;
        },
        // 获取工程地图位置
        getPosition(projId){
          var vm=this;
          axios({
            method:'POST',
            url:vm.BDMSUrl+'/projectMap/getPosition',
            headers:{
              'token':vm.token
            },
            data:projId
          }).then((response)=>{
            if(response.data.cd=='0'){
              this.getPositionList=response.data.rt;

              this.getPositionList=this.filterObj(this.getPositionList);
              var getPositionProjId=[]
              this.getPositionList.forEach((item)=>{
                  getPositionProjId.push(item.projectId)
              })
              // console.log(getPositionProjId,'getPositionProjId');
              // console.log(this.getPositionList,'this.getPositionList');
              // Array.prototype.remove = function(val) { 
              //     var index = this.indexOf(val); 
              //     if (index > -1) { 
              //     this.splice(index, 1); 
              //     } 
              // };
              // vm.getSiteStr=vm.listData;
              var getSiteString=[]
              var differentData=[];
              // vm.getSiteStr.splice(0,vm.getPositionList.length);
              vm.listData.forEach((item)=>{
                vm.getPositionList.forEach((val)=>{
                  if(item.projectId==val.projectId){
                    // console.log(item,'item000');
                    getSiteString.push(item);
                      // vm.getSiteStr.remove(item)
                  }
                })
              })
              console.log(getSiteString,'getSiteString00');
              differentData=this.getArrDifference(vm.listData,getSiteString);
              console.log(differentData,'differentData');
              if(differentData.length!=0){
                var num=1/10000000;
                
                   {
                      var placeSearch = new AMap.PlaceSearch({
                        // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
                        city: '021'
                      })
                      var siteList=[];
                      differentData.forEach((item)=>{
                        if(item.overviewList){
                            siteList.push({
                              'projId':item.projectId,
                              'site':vm.getSite(item.overviewList)
                            })
                        }else{
                          siteList.push({
                              'projId':item.projectId,
                              'site':'上海市人民广场'
                            })
                        }
                      })
                      var siteLists=[];
                      siteList.forEach((item)=>{
                            placeSearch.search(item.site, function (status, result) {
                              // 查询成功时，result即对应匹配的POI信息
                              // console.log(result)
                              var siteData=[0, 0];
                              var pois = result.poiList.pois;
                              let latSum = 0;
                              let lngSum = 0;
                              if (pois.length > 0) {
                                pois.forEach(poi => {
                                  let {lng, lat} = poi.location;
                                  lngSum += lng;
                                  latSum += lat;
                                  // this.markers.push([poi.lng, poi.lat]);
                                });
                                let center = {
                                  lng: lngSum / pois.length,
                                  lat: latSum / pois.length
                                };
                                siteData = [center.lng+num, center.lat+num];
                                siteLists.push({
                                  'projId':item.projId,
                                  'site':item.site,
                                  'siteData':siteData
                                })
                                num=num+num;
                                vm.pushMethod(siteList,siteLists);
                                // console.log(siteLists.length,'获取到地址信息');
                              }
                          })
                      })
                    }

              }else if(vm.getPositionList.length==vm.listData.length){
                  vm.listDataList=[];
                  vm.listData.forEach((val)=>{
                    vm.getPositionList.forEach((val1)=>{
                      if(val.projId==val1.projectId){
                        vm.listDataList.push({
                          'baseInformation':val,
                          'siteData':val1
                        })
                      }
                    })
                  })
                  // LatLngBounds.Builder builder = new LatLngBounds.Builder();
                  //   LatLngBounds bounds = null;
                  //   for (int i = 0; i < size; i++){

                  //   builder.include(LatLng);//把你所有的坐标点放进去
                  //   }
                  //   bounds = builder.build();
                  //   new AMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds,40));
                  // console.log(vm.listDataList,'地点返回信息');
                  let markers = [];
                  let windows = [];

                  // let num = 10;
                  let self = this;
                  // console.log(this.listDataList,'这是什么值')

                  for (let i = 0 ; i < this.listDataList.length ; i ++) {
                    markers.push({
                      projId:this.listDataList[i].baseInformation.projId,
                      projName:this.listDataList[i].baseInformation.projName,
                      position: [this.listDataList[i].siteData.geoX,this.listDataList[i].siteData.geoY],
                      template:`<div style="width:140px;height:28px;border:1px solid #797979;font-size:14px;border-radius:2px;line-height:28px;color:white;background:#797979;padding:0px 6px;text-overflow:ellipsis;overflow:hidden;white-space:nowarp">${this.listDataList[i].baseInformation.projName}</div>`,
                      offset: [-70, -68],
                      events: {
                        click() {
                          self.windows.forEach(window => {
                            window.visible = false;
                            window.visible1 = true;
                            
                          });
                          self.window = self.windows[i];
                          // self.window = self.windows[i];
                          self.$nextTick(() => {
                            self.window.visible = true;
                            self.window.visible1 = false;
              
                          });
                        },
                        dragend: (e) => {
                          // console.log('---event---: dragend')
                          // console.log([e.lnglat.lng, e.lnglat.lat]);
                          // console.log(e,'拖动的标记1');
                          this.updatePosition(this.listDataList[i].baseInformation.projId,e.lnglat.lng,e.lnglat.lat);
                        }
                      }
                    });
                    // self.window = self.windows[i];
                    windows.push({
                      position: [this.listDataList[i].siteData.geoX,this.listDataList[i].siteData.geoY],
                      // content: `<div class="prompt">${ this.listDataList[i].baseInformation.projCode }</div><button @click="selectProjectMap(${this.listDataList[i].baseInformation.projId},${this.listDataList[i].baseInformation.expired},${this.listDataList[i].baseInformation.projName})">进入工程</button>`,
                      // content: `<div class="prompt">${ this.listDataList[i].baseInformation.projCode }</div><button @click="selectProjectMap(${this.listDataList[i].baseInformation.projId},${this.listDataList[i].baseInformation.expired},${this.listDataList[i].baseInformation.projName})">进入工程</button>`,
                      // <span style="width:100px;>${this.listDataList[i].baseInformation.overviewList[0].viewKey}：${this.listDataList[i].baseInformation.overviewList[0].viewVal}</span>
                      // <div v-for="(item,index) in ${this.listDataList[i].baseInformation.overviewList}" ><span v-text="item.viewKey"></span><span v-text="item.viewVal"></span></div>

                      // <span style="width:100px;">${ this.listDataList[i].baseInformation.site1.viewKey}：${ this.listDataList[i].baseInformation.site1.viewVal}</span><br>
                      content:`<div style="width:370px;height:195px;background:white;padding:8px;"><div style="font-size:18px;color:black;font-weight:bold;height:30px;line-height:30px;border-bottom:1px solid #ccc;">${ this.listDataList[i].baseInformation.projName }</div><p style="font-size:14px;color:#666666;padding-top:10px;"><span style="width:100px;">工程账号：${ this.listDataList[i].baseInformation.projCode }</span></br><span style="width:100px;">工程管理员：${ this.listDataList[i].baseInformation.projManager}</span><br><span style="width:100px;">${ this.listDataList[i].baseInformation.site1.viewKey} ${ this.listDataList[i].baseInformation.site1.viewVal}</span><br><span style="width:100px;">${ this.listDataList[i].baseInformation.site2.viewKey}${ this.listDataList[i].baseInformation.site2.viewVal}</span><br><span style="width:100px;">${ this.listDataList[i].baseInformation.site3.viewKey} ${ this.listDataList[i].baseInformation.site3.viewVal}</span><br><span style="width:100px;">使用情况：${ this.listDataList[i].baseInformation.expired==false?'使用中':'已到期'}</span></p><button style="display:block;border:1px solid #ccc;width:93px;height:26px;background:white;margin-top:10px;cursor:pointer;color:#999999;"   @click="selectProjectMap(${this.listDataList[i].baseInformation.projId},${this.listDataList[i].baseInformation.expired})">进入工程</button></div>`,
                      visible: false,
                      visible1: true,
                      template1:`<div style="width:370px;height:195px;background:white;padding:8px;"><div style="font-size:18px;color:black;font-weight:bold;height:30px;line-height:30px;border-bottom:1px solid #ccc;">${ this.listDataList[i].baseInformation.projName }</div><p style="font-size:14px;color:#666666;padding-top:10px;"><span style="width:100px;">工程账号：${ this.listDataList[i].baseInformation.projCode }</span></br><span style="width:100px;">工程管理员：${ this.listDataList[i].baseInformation.projManager}</span><br><span style="width:100px;">使用情况：${ this.listDataList[i].baseInformation.expired==false?'使用中':'已到期'}</span><span></span></p><button style="display:block;border:1px solid #ccc;width:93px;height:26px;background:white;margin-top:10px;cursor:pointer;color:#999999;"   @click="selectProjectMap(${this.listDataList[i].baseInformation.projId},${this.listDataList[i].baseInformation.expired})">进入工程</button></div>`
                    });
                  }

                  this.markers = markers;
                  this.windows = windows;
                  // console.log(this.markers,'this.markers');
                  // console.log(this.windows,'this.windows');
              }
              
            }else{
              
            }
          })

        },
    
        // 更新工程地图位置
        updatePosition(projId,geoX,geoY){
          var vm=this;
          axios({
            method:'get',
            url:vm.BDMSUrl+'/projectMap/updatePosition',
            headers:{
              'token':vm.token
            },
           params:{
             projectId:projId,
             geoX:geoX,
             geoY:geoY
           }
          }).then((response)=>{
            if(response.data.cd=='0'){
              // this.getPositionList=response.data.rt;
              vm.toProjectList();
              var projIds=[];
              vm.listData.forEach((num)=>{
                projIds.push(num.projectId)
              })
              vm.getPosition(projIds)

            }else{
              
            }
          })
        },
        getSiteDataList(placeSearch,site){ 
            placeSearch.search(site, function (status, result) {
                      // 查询成功时，result即对应匹配的POI信息
                      console.log(result)
                       var siteData=[0, 0];
                      var pois = result.poiList.pois;
                      let latSum = 0;
                      let lngSum = 0;
                      if (pois.length > 0) {
                        pois.forEach(poi => {
                          let {lng, lat} = poi.location;
                          lngSum += lng;
                          latSum += lat;
                          // this.markers.push([poi.lng, poi.lat]);
                        });
                        let center = {
                          lng: lngSum / pois.length,
                          lat: latSum / pois.length
                        };
                        // console.log(center.lng, center.lat,'center.lng, center.lat')
                        siteData = [center.lng, center.lat];
                        return siteData
                      }
                  })    
        },
        getSite(str){
          let num='上海市人民广场';
          str.forEach((val)=>{
              if(val.viewKey.indexOf("地址")>0){
                  num=val.viewVal;

                  // return false;
                  // break;
              }
              return false
          })
          return num;
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
            // console.log(vm.$router,'路由111')
            vm.$router.push({
              path:`/home/projHome/${id}`,
              query: { firstView: 'Y' }
            })
          }
        },
        selectProjectMap(id,expired){
          // console.log(id,expired);
          if(expired){
               this.$message({
                message: '项目已过期！',
                type: 'warning'
              });
          }
          else{
            var vm = this;
            // console.log('Jin')
            // console.log(id,'id000')
            // window.location.herf=this.shareUrl+`/home/projHome/${id}`
            localStorage.removeItem("projId");
            window.open(this.shareUrl+'#/home/projHome/'+id,"_self");
            localStorage.setItem('projId',id)
            // console.log(id,'有id吗？')
            // localStorage.setItem('projName',name)
            // console.log(vm.$router,'vm.$router');
            // vm.$router.push({
            //   path:`/home/projHome/${id}`,
            //   query: { firstView: 'Y' }
            // })
          }
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .prompt{
      background: red;
      width: 100px;
      height: 30px;
      text-align: center;
    }
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
        padding-bottom: 120px;
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
