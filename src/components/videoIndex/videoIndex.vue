<template>
    <div id="videoWrapper" style=''>
        <div class="videoTop" id="videoTop">
            <div class="videoHeader">
                <span v-show="!srceenShow" class="exitVideoRight" @click="returnProject()" >返回工程页</span>
                <h1>{{projName}}监控大屏</h1>
                <span class="exitSrceen" v-show="!srceenShow" @click="enterSrceen()">全屏</span>
                <span class="exitVideo" v-show="srceenShow" @click="exitSrceen()">退出</span>
                <span class="exitVideo" v-show="!srceenShow" @click="exitVideo()">返回</span>
            </div>
            <div class="videoMain">
                <div class="video_margin_left" id="video_margin_left" style="">
                    <div class="left_top">
                        <h3>项目信息</h3>
                        <ul v-for="(item,index) in getIndexList" :key="index">
                            <li>
                                <span style="width:20%">{{item.viewKey}}:</span>
                                <span style="width:70%">{{item.viewVal}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="left_bottom">
                        <h3>人员信息</h3>
                        <ul id="peopleUl">
                            <!-- v-for="(item,index) in getAllPositionList" :key="index" -->
                            <!-- <li > -->
                                <!-- <span class="peopleTxt">{{item.positionName}}</span><div class="peopleDiv" >{{item.totalNum}}人</div> -->
                            <!-- </li> -->
                        </ul>
                    </div>
                </div>
                <div class="video_content" id="video_content" @mouseenter="enterMouse" @mouseleave="leaveMouse">
                    <div class="switch" @click="switchClick" v-show="switchShow">
                        <i class="el-icon-minus"></i>
                    </div>
                    <div v-if="isVideoShow" class="content_top">
                        <div class="left">
                            <videoPlayer  :playsinline="true" id="lineLive_left" class="vjs-custom-skin videoPlayer" :options="playerOptions1"></videoPlayer>
                        </div>
                        <div class="right">
                            <videoPlayer  :playsinline="true" id="lineLive_right" class="vjs-custom-skin videoPlayer" :options="playerOptions2"></videoPlayer>
                        </div>
                    </div>
                    <div v-if="isVideoShow" class="content_top">
                        <div class="left">
                            <videoPlayer  :playsinline="true" id="lineLive1_right" class="vjs-custom-skin videoPlayer" :options="playerOptions3"></videoPlayer>
                        </div>
                        <div class="right">
                            <videoPlayer  :playsinline="true" id="lineLive1_right" class="vjs-custom-skin videoPlayer" :options="playerOptions4"></videoPlayer>
                        </div>
                    </div>
                    <div v-show="!isVideoShow" class="webGlIframe" id="webGlIframe" style="border:1px solid #ccc;">
                        <iframe allowfullscreen=true  ref="iframeVideo" id="webIframe" name="ifd"  frameborder="no" border="0" marginwidth="0" marginheight="0"   :src="iframeUrl" style="width: 100%;height: 100%;" ></iframe>
                    </div>
                </div>
                <div class="video_margin_right" id="video_margin_right" style="">
                    <div class="left_top">
                        <h3>环境信息</h3>
                        <ul>
                            <li>
                                <span style="width:20%">日期:</span>
                                <span style="width:70%">{{currentWeatherData.date}}</span>
                            </li>
                             <li>
                                <span style="width:20%">城市:</span>
                                <span style="width:70%">{{weatherList.city}}</span>
                            </li>
                            <li>
                                <span style="width:20%">更新时间:</span>
                                <span style="width:70%">{{weatherList.update_time}}</span>
                            </li>
                            <li>
                                <span style="width:20%">天气:</span>
                                <span style="width:70%">{{currentWeatherData.wea}}</span>
                            </li>
                            <li>
                                <span style="width:20%">风向:</span>
                                <span style="width:70%">{{currentWeatherData.win_speed}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="left_bottom" id="left_bottomChart">
                        <vue-highcharts  id="weatherChart"   :options="weatherChartOption" ref="weatherChartRef"></vue-highcharts>
                    </div>

                </div>
            </div>
            <div class="videoWheelMain" id="videoWheelMain" style="">
                <div @click.stop="leftScroll()" class="left_arrow">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div id="mainDiv">
                    <ul id="mainScrollUl">
                        <li id="mainScrollLi" style="position:relative" v-for="(item,index) in getCameraList" :key="index" @click="changeCamera(item.url)" @mouseenter.stop.prevent="enterLi(item.url)" @mouseleave.stop.prevent="leaveLi()">
                                <span v-if="item.isShowVideoPlay" style="font-size:18px;color:#dfdfdf;cursor:pointer;position:absolute;top:78px;left:138px;font-weight:bold;">{{item.name}}</span>
                                <!-- <img v-show="item.screenshotBase64"  :src="item.screenshotBase64" style="width:100%;height:100%" /> -->
                                <!-- <img v-if="!item.isShowVideoPlay"  src="./images/backimages.png" style="width:100%;height:100%" /> -->
                                <!-- style="position:absolute;left:0px;top:0px;" -->

                                <div style="position:absolute;top:0px;left:0px;width:100%;height:200px;z-index:100"></div>
                                <videoPlayer v-if="!item.isShowVideoPlay"  :playsinline="true"  class="vjs-custom-skin videoPlayer vjs-fluid"   :options="item.options"></videoPlayer>
                                <!-- </div> -->
                                <!-- <span v-show="!item.screenshotBase64" style="display:block;font-size:16px;color:#dfdfdf;margin-top:50px;width:100%;height:190px">当前无缩略图</span> -->
                        </li>
                    </ul>
                </div>
                <div @click.stop="rightScroll()" class="right_arrow">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
        <div class="videoFooter" id="videoFooter" style="">
            <div class="foot_left" id="foot_left">
                <h3>现场人员</h3>
                <vue-highcharts  id="peopleChart"   :options="peopleChartOption" ref="peopleChartRef"></vue-highcharts>
                <!-- <div ref="peoplePie" id="peoplePie"></div> -->
            </div>
            <div class="foot_center">
                <h3>现场车辆</h3>
                <!-- <div ref="carPie" id="carPie"></div> -->
                <vue-highcharts  id="peopleChart"   :options="carChartOption" ref="peopleChartRef"></vue-highcharts>
            </div>
            <div class="foot_right" >
                <h3>公告</h3>
                <ul id="foot_right">
                    <li v-for="(item,index) in noticeList" :key="index">{{item.message}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
import VueHighcharts from 'vue2-highcharts'
var echarts = require('echarts');
var app
export default {
  name:'videoIndex',
  components: {
        videoPlayer,VueHighcharts
    },
  data(){
        return{
            location:'',
            srceenShow:false,
            isShowVideoPlayer:false,
            isVideoShow:true,
            switchShow:false,
            projName:"",
            iframeUrl:'',
            playerOptions: {  
                // width:'inherit',
                margin:'0 auto',
                // height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src:"" 
                    // rtmp://devlivepull.migucloud.com/live/JRKILE8T_C0
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            playerOptions1: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src:"" 
                    // rtmp://devlivepull.migucloud.com/live/JRKILE8T_C0
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            playerOptions2: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src:"" 
                    // rtmp://devlivepull.migucloud.com/live/0L92HN5W_C0
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            playerOptions3: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src:"" 
                    // rtmp://devlivepull.migucloud.com/live/4TOFMANI_C0
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            playerOptions4: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src:"" 
                    // rtmp://devlivepull.migucloud.com/live/N3VIPNDE_C0
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            weatherChartOption:{
                chart: {
                            type: 'spline',
                            plotBackgroundColor:'#121c3e',
                            backgroundColor:'#121c3e',
                            height: 250,
                            color:'#dfdfdf'
                            // inverted: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                            visible:true,
                            labels:{
                                enabled: true,
                                style: {
                                    color: '#dfdfdf',//颜色
                                    // fontSize:'14px'  //字体
                                }
                            },
                            lineColor:'#535e84',
                            color:'#dfdfdf'
                        },
                        yAxis: {
                                title: {
                                    text: ''
                                },
                                labels:{
                                    enabled: true,
                                    format: '{value} 度',
                                    style: {
                                        color: '#dfdfdf',//颜色
                                        // fontSize:'14px'  //字体
                                    }
                                },
                                visible:true,
                                gridLineColor:'#535e84',
                                minorTickColor:'#535e84',
                                color:'#dfdfdf'
                                
                            },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            floating: true,
                            borderWidth: 0,
                            backgroundColor:'#121c3e',
                            itemStyle:{
                                color:'rgba(255,255,255,0.8)'
                            },
                            itemHoverStyle:{
                                color:'rgba(255,255,255,0.6)'
                            }
                        },
                        plotOptions: {
                            spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    },
                                    dataLabels: {
                                        // 开启数据标签
                                        enabled: true          
                                    },
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                color:'#dfdfdf',
                                lineWidth:1,
                                point: {
                                    events: {
                                        click(e) {
                                        
                                        }
                                    }
                                }
                            },
                        },
                        series:[],
            },
            peopleChartOption:{
                chart: {
                            plotBackgroundColor:'#121c3e',
                            backgroundColor:'#121c3e',
                            height: 142,
                            // spacing : [40, 0 , 40, 0]
                            // options3d: {
                            //     enabled: true,
                            //     alpha: 45
                            // }
                            // inverted: false
                        },
                        title: {
                            text: ''
                        },
                        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
				 '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                        // xAxis: {
                        //     categories:[],
                        //     visible:false
                        // },
                        // yAxis: {
                        //         title: {
                        //             text: ''
                        //         },
                        //         labels:{
                        //             enabled: true
                        //         },
                        //         visible:false
                        //     },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'left', //水平方向位置
                            verticalAlign: 'middle', //垂直方向位置
                            // x: 0, //距离x轴的距离
                            // y: 100 //距离Y轴的距离
                            itemStyle: { 
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.8)' 
                            },
                            itemHoverStyle: { 
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.5)'
                            },
                        },
                        plotOptions: {
                           pie: {
                                    // innerSize: 100,
                                    // depth: 45
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true
                                }
                        },
                        series:[{
                            type: 'pie',
                            innerSize: '60%',
                            name: '人数',
                            data: [
                                ['总人数33', 33],
                                ['工人23', 23],
                                ['访客10', 10]
                            ]
                        }],
            },
            carChartOption:{
                chart: {
                            plotBackgroundColor:'#121c3e',
                            backgroundColor:'#121c3e',
                            height: 142,
                            // spacing : [40, 0 , 40, 0]
                            // options3d: {
                            //     enabled: true,
                            //     alpha: 45
                            // }
                            // inverted: false
                        },
                        title: {
                            text: ''
                        },
                        colors: [ '#FF9655', '#FFF263', '#6AF9C4','#058DC7', '#50B432', '#ED561B', '#DDDF00',
				 '#24CBE5', '#64E572'],
                        // xAxis: {
                        //     categories:[],
                        //     visible:false
                        // },
                        // yAxis: {
                        //         title: {
                        //             text: ''
                        //         },
                        //         labels:{
                        //             enabled: true
                        //         },
                        //         visible:false
                        //     },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'left', //水平方向位置
                            verticalAlign: 'middle', //垂直方向位置
                            // x: 0, //距离x轴的距离
                            // y: 100 //距离Y轴的距离
                            itemStyle: { 
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.8)' 
                            },
                            itemHoverStyle: { 
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.5)'
                            },
                        },
                        plotOptions: {
                           pie: {
                                    // innerSize: 100,
                                    // depth: 45
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true
                                }
                        },
                        series:[{
                            type: 'pie',
                            innerSize: '60%',
                            name: '车辆',
                            data: [
                                ['总车辆10', 10],
                                ['项目车8', 8],
                                ['外来车2', 2]
                            ]
                        }],
            },
            getIndexList:[],
            weatherList:'',
            weatherListData:'',
            currentWeatherData:"",
            noticeList:[],
            getCameraList:[],
            clickNum:0,
            getAllPositionList:[],
            getWorkingStaffNum:0,
            getVisitorNums:0,
            groupId:'',
            entId:'',
            isOpen:0,
            maxProgressValue:'',
            rtmpUrl:'http://10.245.11.10:8080/byte-deco/api/generateScreentshot?uri='
        }
  },
  created(){
        var vm=this;
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projectName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl; 
        vm.iframeUrl=vm.$store.state.iframeWebGlUrl+'?new='+Math.random();
        vm.entId=localStorage.getItem('entId');
        
        vm.getWeather();
        vm.getList();
        vm.getNotice();
        vm.getCamera();
        vm.getAllPosition();
        vm.getUserGroup();
        vm.getWorkingStaff();
        vm.getVisitorNum();
        // vm.initModel();
  },
  mounted(){
      this.initStyle();
     
      window.addEventListener('resize',()=>{
            this.initStyle();
            this.getWeather();
            this.getNotice();
            this.resizeHeight()
      })
  },
  methods:{
      getProjectLocation(){
         var vm=this,a;
         
          $.ajax({
              url:this.BDMSUrl+'api/v1/main/index?projId='+this.projId,
              headers:{
                  'token':this.token
              },
              type:'get',
              async:false,
              success:function(response){
                  if(response.cd==0){
                        this.location=response.rt.project.location;
                        a=this.location;
                        console.log(this.location,'this.location');
                        if(a==null){
                            a='上海'
                        }
                  }
              }
            }
          )
          return a;
          
        //   axios({
        //       url:this.BDMSUrl+'api/v1/main/index',
        //       headers:{
        //           'token':this.token
        //       },
        //       params:{
        //           projId:this.projId
        //       }
        //   }).then((response)=>{
        //       if(response.data.cd==0){
                  
        //           if(this.location==null){
        //               this.location='上海'
        //           }
        //           a=this.location;
        //       }
        //   })
        //   return a
      },
      getRtmpUrl(data){
          axios({
              url:this.rtmpUrl+encodeURIComponent(data),
              method:'get',
            //   headers:{
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //             'Access-Control-Allow-Origin':'*'
			// } 
          }).then((response)=>{
              if(response.data.cd==0){
                  return 'data:image/jpeg;base64,'+response.data.rt;
              }else{
                  return false
              }
          })
      },
      enterMouse(){
          this.switchShow=true;
      },
      leaveMouse(){
          this.switchShow=false;
      },
      getUserGroup(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'userGroup/getAllGroup',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    response.data.rt.forEach((item)=>{
                        if(item.groupName=='默认群组'){
                            this.groupId=item.groupId
                        }
                    })
                }
            })
        },
      switchClick(){
          this.isVideoShow=!this.isVideoShow;
          this.isOpen++;
          if(this.isOpen==1){
               this.initModel();
          }
         
      },
      initModel(){
            // var canvas = document.createElement("canvas")
            // var ctx=canvas.getContext("2d");
            // ctx.rect(0,0,1,1);
            // ctx.fillStyle="black";
            // ctx.fill();
            // var dataURL=ctx.toDataURL('image/jpeg')
            app = this.$refs.iframeVideo.contentWindow;
            app.postMessage({command:"Init",parameter:{menu:true,loadingFiles_display:true,model:'ExScreen',background_url:'http://42.159.153.210:8080/bdms-rebuild//doc/dl/b8e1bea99ee43a542a539ec4010c4455',color:{r:250,g:250,b:250,a:1}}},"*");
             window.addEventListener("message", (evt)=>{
                       this.callback(evt)},false
            );
      },
       callback(e){
            switch(e.data.command){
                case "EngineReady":
                    {
                        let Horder='';
                        let para='';
                        para = {token:this.token,entId:this.entId,projectId:this.projId,groupId:this.groupId,url:this.BDMSUrl}
                        this.strJson=para;
                        app.postMessage({command:"SetMenuUrl",parameter:this.strJson},"*");
                    }
                    break;
                case "CurrentSelectedEnt":
                    {
                    }
                    break;
                case "ViewpointSubmited":
                    break;
                case "GetDrawingList":
                    break;
		    }
        },
      initStyle(){
            const allHtmlHeight = window.innerHeight;
            // if(allHtmlHeight)
            // const videoTopHeight = allHtmlHeight-document.getElementById('videoTop').clientHeight-20;
            const videoWrapper = document.getElementById('videoWrapper');
            const videoTop = document.getElementById('videoTop');
            const videoContent=document.getElementById('video_content');
            const videoMarginLeft=document.getElementById('video_margin_left');
            const videoMarginRight=document.getElementById('video_margin_right');
            const videoFooter = document.getElementById('videoFooter');
            const webGlIframes = document.getElementById('webGlIframe');
            const foot_left = document.getElementById('foot_left');
            const peopleChart = document.getElementById('peopleChart')
            const foot_right = document.getElementById('foot_right');
            // const videoWheelMain = document.getElementById('videoWheelMain');
            // const mainScrollLi = document.getElementById('mainScrollLi');
            // const webIframes = document.getElementById('webIframe');
            // videoWrapper.style.height = allHtmlHeight+document.body.scrollTop+'px';
            // videoWrapper.style.height=videoContent.offsetHeight+200+foot_left.offsetHeight+'px';

            videoMarginLeft.style.height=videoContent.offsetHeight+'px';
            videoMarginRight.style.height=videoContent.offsetHeight+'px';
            webGlIframes.style.height = videoContent.offsetHeight+'px';
            foot_right.style.height = peopleChart.offsetHeight+'px';
           
            videoFooter.style.height=foot_left.offsetHeight+'px';
            if(videoWrapper.offsetHeight<allHtmlHeight){
                videoWrapper.style.height=allHtmlHeight+'px';

            }else{
                videoWrapper.style.height='100%';
            }
            // videoWrapper.style.height=videoTop.offsetHeight+videoFooter.offsetHeight+'px';
      },
      getList(){
          var vm=this;
          axios({
              url:this.BDMSUrl+'api/v1/main/main/'+vm.projId+'/overview/list',
              method:'get',
              headers:{
                  'token':this.token
              }
          }).then((response)=>{
              if(response.data.cd==0){
                  this.getIndexList=response.data.rt;
              }
          })
      },
      getWeather(){
          axios({
              url:'https://www.tianqiapi.com/api/?version=v1&city='+this.getProjectLocation(),
              method:'get'
          }).then((response)=>{
              this.weatherList=response.data;
              this.weatherListData=this.weatherList.data;
              this.currentWeatherData=this.weatherListData[0];
              let hours = this.currentWeatherData.hours;
              let xAxisData = [];
            //   10,20,30,40,50,60,70,80
              let yAxisData = [];
              hours.forEach((item)=>{
                  xAxisData.push(item.day)
                  yAxisData.push(parseInt(item.tem))
              })
              let left_bottomChart=document.getElementById('left_bottomChart').offsetHeight;
                document.getElementsByClassName('highcharts-background')[0].attributes[0].nodeValue='#121c3e'
           

             
               setTimeout(()=>{
                    let weatherChart=this.$refs.weatherChartRef; 
                    weatherChart.delegateMethod('showLoading', 'Loading...');
                    weatherChart.removeSeries();
                    weatherChart.addSeries({name:'温度',data:yAxisData});
                    weatherChart.hideLoading();
                    weatherChart.getChart().xAxis[0].update({categories:xAxisData});
                    weatherChart.options.chart.height=left_bottomChart;
                    // weatherChart.getChart().yAxis[0].min=(3*min-2*max);
                    // weatherChart.getChart().yAxis[0].max=(3*max-2*min);
                },0)
          })
      },
      getNotice(){
          var vm=this;
          axios({
              url:this.BDMSUrl+'/api/v1/main/noticeList',
              headers:{
                  'token':this.token
              },
              params:{
                  projId:this.projId,
                  pageNo:0,
                  pageSize:5
              },
              method:"get"
          }).then((response)=>{
              if(response.data.cd==0){
                  this.noticeList=response.data.rt.rows;
              }
          })
      },
      getCamera(){
          axios({
              url:this.BDMSUrl+'camera/getCameraList',
              headers:{
                  'token':this.token
              },
              params:{
                  projectId:this.projId
              }
          }).then((response)=>{
              if(response.data.cd==0){
                  this.getCameraList=response.data.rt;
                  this.getCameraList.forEach((item)=>{
                      let Options=
                        {  
                            margin:'0 auto',
                            sources: [{  
                                type: "rtmp/mp4",  
                                src:item.url 
                            }],  
                            techOrder: ['flash'],  
                            autoplay: true,  
                            controls: true,
                            muted: false,
                            language: 'en',
                            playbackRates: [0.7, 1.0, 1.5, 2.0],
                            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                             controlBar: {
                                timeDivider: false,
                                durationDisplay: false,
                                remainingTimeDisplay: false,
                                fullscreenToggle: false  //全屏按钮
                            }
                        }
                      this.$set(item,'options',Options);
                      this.$set(item,'isShowVideoPlay',false)
                  })
                  this.playerOptions1.sources[0].src=this.getCameraList[0].url;
                  this.playerOptions2.sources[0].src=this.getCameraList[1].url;
                  this.playerOptions3.sources[0].src=this.getCameraList[2].url;
                  this.playerOptions4.sources[0].src=this.getCameraList[3].url;
                //   this.getCameraList.forEach((item)=>{
                //     //   console.log(this.$refs.`${item.id}`);
                //   })
              }
          })
      },
      changeCamera(url){
          this.isVideoShow=true;
          this.clickNum++;
          if(this.clickNum==1){
              this.playerOptions1.sources[0].src=url;
          }else if(this.clickNum==2){
              this.playerOptions2.sources[0].src=url;
          }else if(this.clickNum==3){
              this.playerOptions3.sources[0].src=url;
          }else if(this.clickNum==4){
              this.playerOptions4.sources[0].src=url;
          }else{
              this.clickNum=1
              this.playerOptions1.sources[0].src=url;
          }
      },
      enterLi(url){
        //   this.getCameraList.forEach((item)=>{
        //       if(item.url==url){
        //           item.isShowVideoPlay=true;
        //       }
        //   })

      },
      leaveLi(){
           this.getCameraList.forEach((item)=>{
                  item.isShowVideoPlay=false;
          })
      },
      leftScroll(){

          var mainScrollUl=document.getElementById('mainScrollUl')
          if(mainScrollUl.offsetLeft<0){
            mainScrollUl.style.left=mainScrollUl.offsetLeft+340+'px';
            mainScrollUl.style.transition='.5s';
          }
      },
      rightScroll(){
          var mainScrollUl=document.getElementById('mainScrollUl')
        //   if(mainScrollUl.offsetLeft<0){}
            mainScrollUl.style.left=mainScrollUl.offsetLeft-340+'px';
            mainScrollUl.style.transition='.5s';
      },
      resizeHeight(){           
            var body=document.getElementById('videoWrapper');
            if(body){
                 if(window.outerHeight>window.innerHeight){ //  正处于全屏
                    this.srceenShow=false;
                    // body.style.height=(window.innerHeight-450)+'px';
                }else{  
                    this.srceenShow=true;
                    
                    // body.style.height=(window.innerHeight - 100)+'px';
                }
            }
        },
      //人员信息
      getAllPosition(){
          axios({
              url:this.BDMSUrl+'position/getPositionCountInWork',
              headers:{
                  'token':this.token
              },
              params:{
                  projectId:this.projId
              },
              method:'get'
          }).then((response)=>{
              if(response.data.cd==0){
                  this.getAllPositionList=response.data.rt;
                  let maxValue=0,minValue=100000;
                  for(let i=0;i<this.getAllPositionList.length;i++){
                      if(maxValue<this.getAllPositionList[i].totalNum){
                          maxValue=this.getAllPositionList[i].totalNum;
                      }
                  }
                  this.maxProgressValue=maxValue;
                  this.loadingProgress(this.maxProgressValue,this.getAllPositionList);
              }
          })
      },
      loadingProgress(maxValue,data){
            var peopleUl=document.getElementById('peopleUl');
            data.forEach((item)=>{
                var peopleLi = document.createElement('li')
                peopleLi.style.textAlign='left';
                peopleLi.style.color = '#dfdfdf';
                peopleLi.style.fontSize = '16px';
                peopleLi.style.height = '20px';
                peopleLi.style.lineHeight = '20px';
                peopleLi.style.width = '100%';
                peopleLi.style.margin = '5px 10px';

                var peopleText = document.createElement('span');
                peopleText.style.width ='30%';
                peopleText.style.display = 'inline-block';

                var peopleDiv = document.createElement('div');
                peopleDiv.style.width = '60%';
                peopleDiv.style.display = 'inline-block';
                peopleDiv.style.height = '20px';
                peopleDiv.style.paddingLeft = '4px';
                // peopleDiv.style.border='1px solid white';
                peopleDiv.style.background='rgba(255,255,255,0.1)';
                peopleDiv.style.position='relative';
                peopleDiv.innerHTML=item.totalNum+'人';
                
                var peopleProgress = document.createElement('div');
                peopleProgress.style.position = 'absolute';
                peopleProgress.style.top='0px';
                peopleProgress.style.left='0px';
                peopleProgress.style.height='100%';
              
                peopleProgress.style.width=100*(item.totalNum/maxValue)+'%';
                peopleProgress.style.background='rgba(255,255,255,0.4)';
                peopleText.innerHTML = item.positionName;
                peopleDiv.appendChild(peopleProgress);
                peopleLi.appendChild(peopleText);
                peopleLi.appendChild(peopleDiv);
                peopleUl.appendChild(peopleLi);

            })
            
      },
      //当前人数
      getWorkingStaff(){
          axios({
              url:this.BDMSUrl+'attendancy/getWorkingStaff',
              params:{
                  projectId:this.projId
              },
              headers:{
                  'token':this.token
              },
              method:'get'
          }).then((response)=>{
              if(response.data.cd==0){
                  this.getWorkingStaffNum=response.data.rt.length;
                  
                //   var dataName=[];
                //   var data=[];
                //   this.getWorkingStaffNum.forEach((item)=>{
                //       data.push({
                //           name:item.name,
                //           value:item.value
                //       })
                //       dataName.push(info.holderName);
                //   })
                  var myChart = echarts.init(document.getElementById('peoplePie'))
                //    myChart.setOption({
                //              title: {
                //                 text: '现场人员',
                //                 left: 'center'
                //             },
                //             tooltip : {
                //                 trigger: 'item',
                //                 formatter: "{a} <br/>{b} : {c}个 ({d}%)"
                //             },
                //             legend: {
                //                 // orient: 'horizontal',
                //                 // top: 'middle',
                //                 bottom: 10,
                //                 left: 'center',
                //                 data: dataName
                //             },
                //             series : [
                //                 {
                //                     name: '人员总数',
                //                     type: 'pie',
                //                     radius: '60%',
                //                     center: ['50%', '50%'],
                //                     selectedMode: 'single',
                //                     data:data,
                //                     itemStyle: {
                //                         emphasis: {
                //                             shadowBlur: 10,
                //                             shadowOffsetX: 0,
                //                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                //                         }
                //                     },
                //                     label: {
                //                         normal: {
                //                             show: false
                //                         },
                //                         emphasis: {
                //                             show: true
                //                         }
                //                     },
                //                     lableLine: {
                //                         normal: {
                //                             show: false
                //                         },
                //                         emphasis: {
                //                             show: true
                //                         }
                //                     },
                //                 }
                //             ]
                //     })
              }
          })
      },
      getVisitorNum(){
          axios({
              url:this.BDMSUrl+'/visitor/getVisitorNum',
              params:{
                  projId:this.projId,
                  time:this.timeStamp
              },
              headers:{
                  'token':this.token
              },
              method:'get'
          }).then((response)=>{
              if(response.data.cd==0){
                  this.getVisitorNums=response.data.rt;

              }
          })
      },
      exitVideo(){
          var vm=this;
          vm.$router.push({
              path:`/home/projHome/${this.projId}`
            //   query: { firstView: 'Y' }
            })
      },
      returnProject(){
          this.$router.push({
                path:'/projectlist',
                query:{entId:this.entId}
        })
      },
      enterSrceen(){
            this.srceenShow=true;
            this.initStyle();
            // var el = document.documentElement;  
            // var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            // wscript;
 
            // if(typeof rfs != "undefined" && rfs) {
            //     rfs.call(el);
            //     return;
            // }
        
            // if(typeof window.ActiveXObject != "undefined") {
            //     wscript = new ActiveXObject("WScript.Shell");
            //     if(wscript) {
            //         wscript.SendKeys("{F11}");
            //     } 
            // }
            var el=document.getElementById('videoWrapper');
            if(el.requestFullscreen){
                 el.requestFullscreen();
            }
            else if(el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            }
            else if(el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
            else if(el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
            // document.documentElement
      },
      exitSrceen(){
          this.srceenShow=false;
          if (document.exitFullscreen) {  
            document.exitFullscreen();  
            }  
            else if (document.mozCancelFullScreen) {  
                document.mozCancelFullScreen();  
            }  
            else if (document.webkitCancelFullScreen) {  
                document.webkitCancelFullScreen();  
            }  
            else if (document.msExitFullscreen) {  
                document.msExitFullscreen();  
            }  
      }
  }
}
</script>

<style lang="less" scoped>
    *{
        padding: 0px;
        margin: 0px;
        box-sizing:border-box;
    }
    ul,li{
        list-style: none;
    }
    #videoWrapper{
        height: 100%;
        width: 100%;
        background: #0e0e26  url('./images/backImg.png') repeat fixed;
        background-size: 100% 100%;
        box-sizing:border-box;
        .videoTop{
            .videoHeader{
                width: 96%;
                margin:0px auto;
                // padding: 5px;
                border: 1px solid rgba(250,250,250,0.3);
                height: 50px;
                background-color: #121c3e;
                color:#dfdfdf;
                position: relative;
                h1{
                    line-height: 50px;
                }
                .exitVideoRight{
                    position: absolute;
                    width: 100px;
                    height: 30px;
                    left:10px;
                    top:10px;
                    border:1px solid rgba(250,250,250,0.3);
                    border-radius: 2px;
                    color: #dfdfdf;
                    line-height: 28px;
                    cursor: pointer;
                    
                }
                .exitVideo{
                    position: absolute;
                    width: 100px;
                    height: 30px;
                    right:10px;
                    top:10px;
                    border:1px solid rgba(250,250,250,0.3);
                    border-radius: 2px;
                    color: #dfdfdf;
                    line-height: 28px;
                    cursor: pointer;
                }
                .exitSrceen{
                    position: absolute;
                    width: 100px;
                    height: 30px;
                    right:120px;
                    top:10px;
                    border:1px solid rgba(250,250,250,0.3);
                    border-radius: 2px;
                    color: #dfdfdf;
                    line-height: 28px;
                    cursor: pointer;

                }
            }
            .videoMain{
                display: flex;
                flex-flow: row nowrap;
                justify-content:space-between;
                width: 96%;
                margin:15px auto;
                .video_margin_left{
                    width: 20%;
                    height: 100%;
                    border:1px solid rgba(250,250,250,0.3);
                    background-color: #121c3e;
                    // box-shadow: 2px 2px 2px rgba(226, 234, 235, 0.5);
                    // opacity: 0.6;
                    .left_top{
                        height:40%;
                        h3{
                            color: #dfdfdf;
                            font-size:18px;
                            text-align: left;
                            margin:10px;
                        }
                        ul{
                            li{
                                // float: left;
                                width: 100%;
                                margin:5px;
                                span{
                                    display: inline-block;
                                    font-size: 16px;
                                    height: 20px;
                                    line-height: 20px;
                                    // width: 40%;
                                    // color: #5aafb4;
                                    color:#b9c0c7;
                                    text-align: left;
                                }
                            }
                        }


                    }
                    .left_bottom{
                        height:60%;
                        overflow: hidden;
                        h3{
                            color: #dfdfdf;
                            font-size:18px;
                            text-align: left;
                            margin:10px;
                        }
                        ul{
                            li{
                                text-align: left;
                                color:#dfdfdf;
                                font-size:16px;
                                line-height: 20px;
                                height: 20px;
                                width: 100%;
                                margin:5px 10px;
                                .peopleTxt{
                                    width: 30%;
                                    display: inline-block;
                                }
                                .peopleDiv{
                                    width: 60%;
                                    display: inline-block;
                                    height: 20px;
                                    border:1px solid rgba(250,250,250,0.3);
                                    position: relative;
                                }

                            }
                        }
                    }
                }
                .video_content{
                    width: 58%;
                    height: 100%;
                    border:1px solid rgba(250,250,250,0.3);
                    background-color: #121c3e;
                    position: relative;
                    .switch{
                        position: absolute;
                        top:0px;
                        right:0px;
                        border:1px solid rgba(250,250,250,0.3);
                        z-index:12;
                        background:rgba(250,250,250,0.8);
                        .el-icon-minus{
                            font-size:14px;
                            cursor: pointer;
                        }
                    }
                    .content_top{
                        width: 100%;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content:space-between;
                        .left{
                            position:relative;
                            // width: 100%;
                            height: 100%;
                            width: 49%;
                            // height: 240px;
                            margin:5px;
                            border:1px solid rgba(250,250,250,0.3);
                        }
                        .right{
                            position:relative;
                            width: 49%;
                            // height: 240px;
                            height: 100%;
                            margin:5px;
                            border:1px solid rgba(250,250,250,0.3);
                        }
                    }
                    .contnet_bottom{

                    }
                    .webGlIframe{
                        height: 100%;
                        width: 100%;
                    }
                }
                .video_margin_right{
                    width: 20%;
                    // height: 500px;
                    height: 100%;
                    border:1px solid rgba(250,250,250,0.3);
                    background-color: #121c3e;
                    .left_top{
                        height:40%;
                        h3{
                            color: #dfdfdf;
                            font-size:18px;
                            text-align: left;
                            margin:10px;
                        }
                        ul{
                            li{
                                // float: left;
                                width: 100%;
                                margin:5px;
                                span{
                                    display: inline-block;
                                    font-size: 16px;
                                    height: 20px;
                                    line-height: 20px;
                                    // width: 40%;
                                    // color: #5aafb4;
                                    color:#b9c0c7;
                                    text-align: left;
                                }
                            }
                        }
                    }
                    .left_bottom{
                        margin:10px;
                        height:50%;
                        h3{
                            color: #dfdfdf;
                            font-size:18px;
                            text-align: left;
                            margin:10px;
                        }
                    }
                    
                }
            }
            .videoWheelMain{
                display: flex;
                flex-flow: row nowrap;
                justify-content:space-between;
                width: 96%;
                margin:10px auto;
                height: 190px;
                border:1px solid rgba(250,250,250,0.3);
                background-color: #121c3e;
                position: relative;
                 overflow: hidden;
                .left_arrow{
                    position: absolute;
                    // position: relative;
                    left:0px;
                    top:0px;
                    width: 50px;
                    height: 100%;
                    z-index:102;
                    // background: rgba(34,48,95,0.5);
                    .el-icon-arrow-left{
                        position: absolute;
                        top:40%;
                        right:10px;
                        font-size:28px;
                        font-weight: bold;
                        cursor: pointer;
                    }
                    &:hover{
                        background: rgba(34,48,95,0.5);
                    }
                }
                .right_arrow{
                    position: absolute;
                    right:0px;
                    top:0px;
                    width: 50px;
                    height: 100%;
                    z-index:102;
                    // background: rgba(34,48,95,0.5);
                    .el-icon-arrow-right{
                        position: absolute;
                        top:40%;
                        left:10px;
                        font-size:28px;
                        font-weight: bold;
                        cursor: pointer;
                    }
                    &:hover{
                        background: rgba(34,48,95,0.5);
                    }
                }
                #mainDiv{
                    display:block;
                    white-space:nowrap;
                    // width:'100%';
                    overflow:hidden;
                  
                    ul{
                        position: absolute;
                        left:0px;
                        // float: left;
                        // display: inline-block;
                        //  width: 100%;
                        //  height: 170px;
                        li{
                            position: relative;
                            display: inline-block;
                            // float: left;
                            margin:2px 10px;
                            width: 320px;
                            // 210px;
                            // height: 160px;
                            // height:190px;
                            height:100%;
                            // background:#5aafb4;
                            background: rgba(34,48,95,0.5);
                            // background:red;
                            cursor: pointer;
                            // z-index: 1000;
                            transition: all 0.6s;
                            &:hover{
                                // z-index: 1000;
                                transform: scale(1.1);
                            }
                        }
                    }
                }
            }
        }
        // display: flex; 
        .videoFooter{
            display: flex;
            flex-flow: row nowrap;
            justify-content:space-between;
            width: 96%;
            margin:10px auto;
            .foot_left{
                width: 24%;
                height: 100%;
                border:1px solid rgba(250,250,250,0.3);
                background-color: #121c3e;
                h3{
                    color: #dfdfdf;
                    font-size:18px;
                    text-align: left;
                    margin:10px 10px 0px 10px;
                }

            }
            .foot_center{
                width: 24%;
                height: 100%;
                border:1px solid rgba(250,250,250,0.3);
                background-color: #121c3e;
                h3{
                    color: #dfdfdf;
                    font-size:18px;
                    text-align: left;
                    margin:10px 10px 0px 10px;
                }

            }
            .foot_right{
                width: 50%;
                height: 100%;
                border:1px solid rgba(250,250,250,0.3);
                background-color: #121c3e;
                h3{
                    color: #dfdfdf;
                    font-size:18px;
                    text-align: left;
                    margin:10px 10px 0px 10px;
                    
                }
                ul{
                    text-align: left;
                    margin-left:50px;
                    margin-top:10px;

                    li{
                        margin:3px;
                        font-size:15px;
                        height: 20px;
                        line-height: 20px;
                        color:#dfdfdf;
                    }
                }
            }

        }
    }
</style>
