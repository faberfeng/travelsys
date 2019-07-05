<template>
    <div id="videoWrapper" style=''>
        <div class="videoTop" id="videoTop">
            <div class="videoHeader">
                <h1>{{projName}}监控大屏</h1>
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
                        <ul>
                            <li></li>
                        </ul>
                    </div>
                </div>
                <div class="video_content" id="video_content">
                    <div class="content_top">
                        <div class="left">
                            <videoPlayer  :playsinline="true" id="lineLive_left" class="vjs-custom-skin videoPlayer" :options="playerOptions1"></videoPlayer>
                        </div>
                        <div class="right">
                            <videoPlayer  :playsinline="true" id="lineLive_right" class="vjs-custom-skin videoPlayer" :options="playerOptions2"></videoPlayer>
                        </div>
                    </div>
                    <div class="content_top">
                        <div class="left">
                            <videoPlayer  :playsinline="true" id="lineLive1_right" class="vjs-custom-skin videoPlayer" :options="playerOptions3"></videoPlayer>
                        </div>
                        <div class="right">
                            <videoPlayer  :playsinline="true" id="lineLive1_right" class="vjs-custom-skin videoPlayer" :options="playerOptions4"></videoPlayer>
                        </div>
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
            <div class="videoWheelMain">
                <div class="left_arrow">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <ul>
                    <li v-for="(item,index) in getCameraList" :key="index" @click="changeCamera(item.url)">
                        
                    </li>
                </ul>
                <div class="right_arrow">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
        <div class="videoFooter" id="videoFooter" style="">
            <div class="foot_left">
                <h3>现场人员</h3>
                <vue-highcharts  id="peopleChart"   :options="peopleChartOption" ref="peopleChartRef"></vue-highcharts>
            </div>
            <div class="foot_center">
                <h3>现场车辆</h3>
                <vue-highcharts  id="peopleChart"   :options="peopleChartOption" ref="peopleChartRef"></vue-highcharts>
            </div>
            <div class="foot_right">
                <h3>公告</h3>
                <ul>
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
export default {
  name:'videoIndex',
  components: {
        videoPlayer,VueHighcharts
    },
  data(){
        return{
            projName:"",
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
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            weatherChartOption:{
                chart: {
                            type: 'spline',
                            plotBackgroundColor:'#121c3e',
                            backgroundColor:'#121c3e',
                            height: 250,
                            // inverted: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                            visible:false
                        },
                        yAxis: {
                                title: {
                                    text: ''
                                },
                                labels:{
                                    enabled: true
                                },
                                visible:false
                                },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            floating: true,
                            borderWidth: 0,
                            color:'white',
                            backgroundColor:'white'
                        },
                        plotOptions: {
                            spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    }
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
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
                            // align: 'right',
                            // verticalAlign: 'top',
                            // floating: true,
                            // borderWidth: 0,
                            // color:'white',
                            // backgroundColor:'white'
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
                                    showInLegend: false
                                }
                        },
                        series:[{
                            type: 'pie',
                            innerSize: '60%',
                            name: '货物金额',
                            data: [
                                ['香蕉', 8],
                                ['猕猴桃', 3],
                                ['桃子', 1],
                                ['橘子', 6]
                            ]
                        }],
            },
            getIndexList:[],
            weatherList:'',
            weatherListData:'',
            currentWeatherData:"",
            noticeList:[],
            getCameraList:[],
            clickNum:0
        }
  },
  created(){
        var vm=this;
        
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projectName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl; 
        vm.getWeather();
        vm.getList();
        vm.getNotice();
        vm.getCamera();
  },
  mounted(){
      this.initStyle();

      window.addEventListener('resize',()=>{
            this.initStyle();
            this.getWeather();
            this.getNotice();
      })

  },
  methods:{
      initStyle(){
            const allHtmlHeight = window.innerHeight;
            const videoTopHeight = allHtmlHeight-document.getElementById('videoTop').clientHeight-20;
            const videoWrapper = document.getElementById('videoWrapper');
            const videoContent=document.getElementById('video_content');
            const videoMarginLeft=document.getElementById('video_margin_left');
            const videoMarginRight=document.getElementById('video_margin_right');
            const videoFooter = document.getElementById('videoFooter');
            console.log(videoContent,videoContent.offsetHeight,'videoContent.offsetHeight');
            videoWrapper.style.height = allHtmlHeight+'px';
            videoMarginLeft.style.height=videoContent.offsetHeight+'px';
            videoMarginRight.style.height=videoContent.offsetHeight+'px';
            videoFooter.style.height = videoTopHeight+'px';
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
              url:'https://www.tianqiapi.com/api/?version=v1&city=上海',
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
            //   console.log(a,'000');

              console.log(this.weatherList,this.weatherListData,this.currentWeatherData,xAxisData,yAxisData,left_bottomChart);
               setTimeout(()=>{
                    let weatherChart=this.$refs.weatherChartRef; 
                    weatherChart.delegateMethod('showLoading', 'Loading...');
                    weatherChart.removeSeries();
                    weatherChart.addSeries({name:'温度',data:yAxisData});
                    weatherChart.hideLoading();
                    weatherChart.getChart().xAxis[0].update({categories:xAxisData});
                    weatherChart.options.chart.height=left_bottomChart;
                     console.log(weatherChart,'图表111');
                    // weatherChart.getChart().yAxis[0].min=(3*min-2*max);
                    // weatherChart.getChart().yAxis[0].max=(3*max-2*min);
                },0)
                // let xAxisPeopleData=[];
                // let yAxisPeopleData=[];
                // setTimeout(()=>{
                //     let peopleChart=this.$refs.peopleChartRef; 
                //     peopleChart.delegateMethod('showLoading', 'Loading...');
                //     peopleChart.removeSeries();
                //     peopleChart.addSeries({name:'温度',data:yAxisData});
                //     peopleChart.hideLoading();
                //     peopleChart.getChart().xAxis[0].update({categories:xAxisData});
                //     peopleChart.options.chart.height=left_bottomChart;
                //     //  console.log(weatherChart,'图表111');
                //     // weatherChart.getChart().yAxis[0].min=(3*min-2*max);
                //     // weatherChart.getChart().yAxis[0].max=(3*max-2*min);
                // },0)
               
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
                  this.playerOptions1.sources[0].src=this.getCameraList[0].url;
                  this.playerOptions2.sources[0].src=this.getCameraList[1].url;
                  this.playerOptions3.sources[0].src=this.getCameraList[2].url;
                  this.playerOptions4.sources[0].src=this.getCameraList[3].url;
              }
          })
      },
      changeCamera(url){
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
              this.clickNum=0
              this.playerOptions1.sources[0].src=url;
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
                border: 1px solid white;
                height: 50px;
                background-color: #121c3e;
                color:white;
                h1{
                    line-height: 50px;
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
                    border:1px solid white;
                    background-color: #121c3e;
                    // box-shadow: 2px 2px 2px rgba(226, 234, 235, 0.5);
                    // opacity: 0.6;
                    .left_top{
                        height:40%;
                        h3{
                            color: white;
                            font-size:16px;
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
                                    font-size: 14px;
                                    height: 20px;
                                    line-height: 20px;
                                    // width: 40%;
                                    color: #5aafb4;
                                    text-align: left;
                                }
                            }
                        }


                    }
                    .left_bottom{
                        height:60%;
                        h3{
                            color: white;
                            font-size:16px;
                            text-align: left;
                            margin:10px;
                        }
                    }
                }
                .video_content{
                    width: 58%;
                    height: 100%;
                    border:1px solid white;
                    background-color: #121c3e;
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
                            border:1px solid white;
                        }
                        .right{
                            position:relative;
                            width: 49%;
                            // height: 240px;
                            height: 100%;
                            margin:5px;
                            border:1px solid white;
                        }
                    }
                    .contnet_bottom{

                    }
                }
                .video_margin_right{
                    width: 20%;
                    // height: 500px;
                    height: 100%;
                    border:1px solid white;
                    background-color: #121c3e;
                    .left_top{
                        height:40%;
                        h3{
                            color: white;
                            font-size:16px;
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
                                    font-size: 14px;
                                    height: 20px;
                                    line-height: 20px;
                                    // width: 40%;
                                    color: #5aafb4;
                                    text-align: left;
                                }
                            }
                        }
                    }
                    .left_bottom{
                        margin-top:10%;
                        height:50%;
                        h3{
                            color: white;
                            font-size:16px;
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
                height: 170px;
                border:1px solid white;
                background-color: #121c3e;
                position: relative;
                .left_arrow{
                    position: absolute;
                    // position: relative;
                    left:0px;
                    top:0px;
                    width: 50px;
                    height: 100%;
                    z-index:10;
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
                    z-index:10;
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
                ul{
                    position: absolute;
                    left:0px;
                    display: inline-block;
                    li{
                        display: inline-block;
                        margin:2px 5px;
                        width: 210px;
                        height: 160px;
                        background:#5aafb4;
                        cursor: pointer;
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
                border:1px solid white;
                background-color: #121c3e;
                h3{
                    color: white;
                    font-size:16px;
                    text-align: left;
                    margin:10px 10px 0px 10px;
                }

            }
            .foot_center{
                width: 24%;
                height: 100%;
                border:1px solid white;
                background-color: #121c3e;
                h3{
                    color: white;
                    font-size:16px;
                    text-align: left;
                    margin:10px 10px 0px 10px;
                }

            }
            .foot_right{
                width: 50%;
                height: 100%;
                border:1px solid white;
                background-color: #121c3e;
                h3{
                    color: white;
                    font-size:16px;
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
                        color:white;
                    }
                }
            }

        }
    }
</style>
