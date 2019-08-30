<template>
    <div id="smartPipe_wrapper">
        <div class="content">
            <div class="content_left opacityBackGround">
                <div class="mainInf">
                    <div class="icon1left"></div>
                    <div class="icon1top"></div>
                    <div class="icon2top"></div>
                    <div class="icon2right"></div>
                    <div class="icon3bottom"></div>
                    <div class="icon3left"></div>
                    <div class="icon4bottom"></div>
                    <div class="icon4right"></div>
                    <div style="color:white;font-size:14px;height:24px;line-height:24px;text-align:left;margin:10px 20px">智慧管网系统平台</div>
                     <div style="color:white;font-size:25px;height:40px;line-height:24px;text-align:left;margin:10px 20px">
                        {{currentTime2}}
                    </div>
                    <div style="color:white;font-size:20px;height:40px;line-height:24px;text-align:left;margin:10px 20px">
                        {{currentTime1}}
                    </div>
                   
                    <div style="color:white;font-size:16px;height:24px;line-height:24px;text-align:left;margin:10px 20px">
                        {{currentWeatherData.wea}}-{{currentWeatherData.tem1}}-{{weatherList.city}}
                    </div>

                </div>
                <ul class="content_ul">
                    <li class="content_li" v-for="(item,index) in listData" :key="index" v-show="item.status!=2">
                        <div class="icon1left"></div>
                        <div class="icon1top"></div>
                        <div class="icon2top"></div>
                        <div class="icon2right"></div>
                        <div class="icon3bottom"></div>
                        <div class="icon3left"></div>
                        <div class="icon4bottom"></div>
                        <div class="icon4right"></div>
                        <div class="text">
                            <span>{{item.projectName}}</span>
                        </div>
                        <div class="text">
                            <label style="width:80px;margin-right:10px;display:inline-block;font-size:16px;color:rgb(79,192,220)">项目地址:</label>
                            <label style="width:100px;display:inline-block;font-size:16px;color:rgb(79,192,220)">{{item.location}}</label>
                            <i title="定位"  @click="locationGis(item,item.projectName,item.entId,item.projectId,item.latitude,item.longitude)" class="el-icon-location"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content_right">
                <div class="content_right_top">
                    <!-- <div class="left_title">
                        <h1>XXXXXX智慧管网系统平台</h1>
                    </div> -->
                    <div class="left_wrapp opacityBackGround">
                        <div class="left_wrapp_top">
                                <h1>XXXXXX智慧管网系统平台</h1>
                        </div>
                        <div class="left_wrapp_bottom">
                            <div class="icon1left"></div>
                            <div class="icon1top"></div>
                            <div class="icon2top"></div>
                            <div class="icon2right"></div>
                            <div class="icon3bottom"></div>
                            <div class="icon3left"></div>
                            <div class="icon4bottom"></div>
                            <div class="icon4right"></div>
                            <div class="gisMap" v-show="loadGisShow">
                                <iframe allowfullscreen=true frameborder="no" border="0" marginwidth= "0" marginheight="0" src="http://42.159.153.210:8080/GISViewer/" style="width: 94%;height: 500px;padding:10px" id="gisWebgl"></iframe>
                            </div>
                        </div> 
                    </div>
                    <div class="right_wrapp opacityBackGround">
                            <div class="icon1left"></div>
                            <div class="icon1top"></div>
                            <div class="icon2top"></div>
                            <div class="icon2right"></div>
                            <div class="icon3bottom"></div>
                            <div class="icon3left"></div>
                            <div class="icon4bottom"></div>
                            <div class="icon4right"></div>
                            <div style="height:36px;line-height:36px;text-align:left;font-size:16px;color:white;margin:5px;">预警报告</div>
                            <ul class="right_wrappUl">
                                <li class="right_wrappLi color1">
                                    <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                                <li class="right_wrappLi color1">
                                    <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                                <li class="right_wrappLi color2">
                                   <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                                <li class="right_wrappLi color2">
                                   <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                                <li class="right_wrappLi color3">
                                   <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                                <li class="right_wrappLi color3">
                                    <div>
                                        <i class="el-icon-warning"></i>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">窨井液位  1级预警</label>
                                    </div>
                                    <div>
                                        <label style="height:24px;line-height:24px;font-size:14px;display:inline-block">1号园区--24#监测点</label>
                                    </div>
                                </li>
                            </ul>
                    </div>
                </div>
                <div class="content_right_bottom opacityBackGround">
                    <ul class="content_right_bottom_ul">
                        <li class="content_right_bottom_li">
                            <div class="icon1left"></div>
                            <div class="icon1top"></div>
                            <div class="icon2top"></div>
                            <div class="icon2right"></div>
                            <div class="icon3bottom"></div>
                            <div class="icon3left"></div>
                            <div class="icon4bottom"></div>
                            <div class="icon4right"></div>
                            <!-- <div>
                                <vue-highcharts id="HightchartOne" style="min-height:440px"   :options="optionOnes" ref="lineChartOne"></vue-highcharts>
                            </div> -->
                        </li>
                        <li class="content_right_bottom_li">
                            <div class="icon1left"></div>
                            <div class="icon1top"></div>
                            <div class="icon2top"></div>
                            <div class="icon2right"></div>
                            <div class="icon3bottom"></div>
                            <div class="icon3left"></div>
                            <div class="icon4bottom"></div>
                            <div class="icon4right"></div>
                            <!-- <div>
                                <vue-highcharts id="HightchartTwo" style="min-height:440px"   :options="optionTwos" ref="lineChartTwo"></vue-highcharts>
                            </div> -->

                        </li>
                        <li class="content_right_bottom_li">
                            <div class="icon1left"></div>
                            <div class="icon1top"></div>
                            <div class="icon2top"></div>
                            <div class="icon2right"></div>
                            <div class="icon3bottom"></div>
                            <div class="icon3left"></div>
                            <div class="icon4bottom"></div>
                            <div class="icon4right"></div>
                             <!-- <div>
                                <vue-highcharts id="HightchartThree" style="min-height:440px"   :options="optionThrees" ref="lineChartThree"></vue-highcharts>
                            </div> -->

                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
var gisApp;
export default {
    name:'smartPipeWrapper',
    data(){
        return{
            token:'',
            BDMSUrl:'',
            listData:[],
            loadGisShow:false,
            weatherList:'',
            currentTime1:'',
            currentTime2:'',
            currentWeatherData:'',
            optionOnes:{
                 chart: {
                            // type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                            labels:{
                                    enabled: true,
                                    // format: '{value} m',
                            },
                            gridLineWidth: 1,
                            tickmarkPlacement: 'on',
                        },
                        yAxis: {
                                title: {
                                    text: '位移(mm)'
                                },
                                labels:{
                                    enabled: true,
                                    // format: '{value} mm',
                                },
                                opposite: true,
                                lineWidth: 1,
                                gridLineWidth: 1,
                                // max:'',
                                // min:''
                           
                        },  
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            floating: true,
                            borderWidth: 0,
                            y:-10
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
            }
        }
    },
    created(){
        var vm = this
        vm.token  = localStorage.getItem('token');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.userName = localStorage.getItem('userName')
        vm.userId = localStorage.getItem('userId');
        vm.entId=localStorage.getItem('entId');  
        this.initCompany();
        // YYYY-MM-DD hh:mm:ss
        setInterval(()=>{
            this.currentTime1=moment(new Date().getTime()).format('YYYY年MM月DD日 dddd');
            this.currentTime2=moment(new Date().getTime()).format('HH:mm:ss');

        },1000)
        window.addEventListener('resize',(e)=>{
            console.log('1111');
            this.gisInit();
        })
        
    },
    mounted(){
        this.gisInit();
        this.getWeather();
       
    },
    methods:{
        gisInit(){
            gisApp = document.getElementById("gisWebgl").contentWindow;
            // console.log(gisApp,'gisApp');
            this.loadGisShow=true;
            setTimeout(()=>{
                gisApp.postMessage({command:"Init",parameter:{menu:false,loadingFiles_display:true,background_url:""}},"*");
            
                // gisApp.document.body.style.backgroundColor= "rgba(17, 24, 56, 0.5)";
            
            },1000)
        //    setTimeout(()=>{
        //                     gisApp.postMessage({command:"EarthMove",parameter:{latitude:32,longitude:114.98}},"*");
        //     },5000)
            //  var a=32,b=114.98;
            // setInterval(()=>{
            
            //     gisApp.postMessage({command:"EarthMove",parameter:{latitude:a,longitude:b}},"*")
            //     // a++;
            //     if(b<180&&b>-180){
            //         b=b+10;
            //     }else{
            //         b=b-10;
            //     }
            //     // console.log()
            // },1000)

            // setTimeout(()=>{
            //         gisApp.postMessage({command:"EarthMove",parameter:{latitude:32,longitude:114.98}},"*");
            // },000)
            window.addEventListener("message", (e)=>{this.callback(e);})
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
                    entId:vm.entId
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
      //获得天气
        getWeather(){
            axios({
                url:'https://www.tianqiapi.com/api/?version=v1&city=上海',
                method:'get'
            }).then((response)=>{
                this.weatherList=response.data;
                console.log(this.weatherList,'this.weatherList');
                this.weatherListData=this.weatherList.data;
                this.currentWeatherData=this.weatherListData[0];
                //   let hours = this.currentWeatherData.hours;
                //   let xAxisData = [];
                //   let yAxisData = [];
                //   hours.forEach((item)=>{
                //       xAxisData.push(item.day)
                //       yAxisData.push(parseInt(item.tem))
                //   })
                //   let left_bottomChart=document.getElementById('left_bottomChart').offsetHeight;
                //     document.getElementsByClassName('highcharts-background')[0].attributes[0].nodeValue='#121c3e'

                //    setTimeout(()=>{
                //         let weatherChart=this.$refs.weatherChartRef; 
                //         weatherChart.delegateMethod('showLoading', 'Loading...');
                //         weatherChart.removeSeries();
                //         weatherChart.addSeries({name:'温度',data:yAxisData});
                //         weatherChart.hideLoading();
                //         weatherChart.getChart().xAxis[0].update({categories:xAxisData});
                //         weatherChart.options.chart.height=left_bottomChart;
                //     },0)
            })
        },
        updateProject(coordinate){

            axios({
                url:this.BDMSUrl+'backstageManagement/updateProject',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projectConfig.projectId,
                    userId:this.projectConfig.userId,
                    projectName:this.projectConfig.projectName,
                    location:this.projectConfig.location,
                    stroke:this.projectConfig.stroke,
                    expireTime:moment(this.projectConfig.expireTime).format('YYYY-MM-DD'),
                    userCount:this.projectConfig.userCount==null?-1:this.projectConfig.userCount,
                    diskSize:this.projectConfig.diskSize,
                    // latitude:latitude,
                    // longitude:longitude,
                    coordinate:coordinate
                    // stroke:this.isStroke
                }
            }).then((response)=>{
                this.projectConfig='';
                this.initCompany()

            })
        },
        getAvg(arr){
            var sum=0;
            for (var i = 0; i < arr.length; i++) {
                sum+=parseInt(arr[i]);
            };
            var avg=Math.ceil(sum/arr.length);
            return avg
        },
        
        callback(e){
            switch(e.data.command){
			case "EngineReady":
				{
                    gisApp = document.getElementById("gisWebgl").contentWindow;
                    var url = "http://42.159.153.210:8080/BDView/image/logo.png";
                    var latitudeMid=[],longitudeMid=[];
                    this.listData.forEach((item)=>{
                        if(item.coordinate){
                            // console.log(JSON.parse(item.coordinate),'item.coordinate');
                            latitudeMid.push(JSON.parse(item.coordinate).latitude);
                            longitudeMid.push(JSON.parse(item.coordinate).longitude);
                            var label = {type:"[Tag]Building",name:item.projectName,image:url,value:null,Id:item.projectId,File_ID:item.entId,position:JSON.parse(item.coordinate).position,url:"www.baidu.com"}
                            // console.log(label,'label111');
                            gisApp.postMessage({command:"AddLabel",parameter:label},"*");
                           
                        }
                        //  console.log(this.getAvg(latitudeMid),this.getAvg(longitudeMid),'经纬度平均值');
                        
                    })
                    var a=0;
                    a++;
                     setTimeout(()=>{
                            gisApp.postMessage({command:"EarthMove",parameter:{latitude:this.getAvg(latitudeMid),longitude:this.getAvg(longitudeMid)}},"*");
                            console.log(a,'aa')
                    },1000)
				}
                break;
            case "Set_Earth_Position_finish":
                var position = e.data.parameter.position;
                this.Set(position);
                this.updateProject(e.data.parameter);
                console.log(e.data.parameter,'返回值')
                break;
            case "CurrentSelectedLabel":
				alert(e.data.parameter.url + "&name=" + e.data.parameter.name);
            break;
		    }
        },
        locationGis(item,projectName,entId,projectId,latitude,longitude){
            gisApp = document.getElementById("gisWebgl").contentWindow;
            gisApp.postMessage({command:"Set_Earth_Position_begin",parameter:null},"*");
          
            this.projectConfig=item;
            this.projectName=projectName;
            this.entId=entId
            this.projectId=projectId;
            gisApp.postMessage({command:"DeleteLabel",parameter:{Id:this.projectId}},"*");
            // this.latitude=latitude;
            // this.longitude=longitude;
            // var url = "image/tooltip2.png";
            
            // var url = "http://42.159.153.210:8080/BDView/image/logo.png";
            // var label = {type:"[Tag]Building",name:"abc",image:url,value:null,Id:4324,File_ID:21,testOffset:{x:200,y:200,size:40,maxLength:200},imgOffset:{x:200,y:200,width:64,height:64}}
            // gisApp.postMessage({command:"AddLabel",parameter:label},"*");
        },
        Set(position){
            gisApp = document.getElementById("gisWebgl").contentWindow;
            var url = "http://42.159.153.210:8080/BDView/image/logo.png";
            var label = {type:"[Tag]Building",name:this.projectName,image:url,value:null,Id:this.projectId,File_ID:this.entId,position:position,url:"www.baidu.com"}
            gisApp.postMessage({command:"AddLabel",parameter:label},"*");
        },
        initHightChartOne(){
            
        }
    }
}
</script>

<style lang="less" scope>
*{
    margin: 0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
#smartPipe_wrapper{
    margin: 0px auto;
    width: 100%;
    height: 100%;
    // background: rgb(11, 27, 63);
    background: url('images/background.jpg') repeat;
     /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width:10px;
        height: 15px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
        border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        // background:rgba(0,0,0,0.1);
        background:rgba(255,255,255,0.5);
        box-shadow:inset 006px rgba(0, 0, 0, .5);
    -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
        // background:rgba(17,24,56,1);
    }
    .opacityBackGround{
        background:rgba(17,24,56,0.5);
    }
    .content{
        background: rgba(11, 27, 63,0.1);
        width: 96%;
        display: flex;
        flex-direction:row;
        justify-content: space-around;
        margin:0px auto;
        padding:15px;
        .content_left{
            width: 20%;
            height: 1000px;
            border: 1px solid rgb(42,93,142);
            
            .mainInf{
                width: 90%;
                height: 20%;
                margin:10px auto;
                border: 1px solid #ccc;
                position: relative;
                .icon1left{
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    left:-1px;
                    top:0px;
                    background: rgb(77,178,243);
                    box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
                .icon1top{
                    position: absolute;
                    width: 30px;
                    height: 2px;
                    left:-1px;
                    top:-1px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
                .icon2top{
                    position: absolute;
                    width: 30px;
                    height: 2px;
                    right:-1px;
                    top:-1px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    
                }
                .icon2right{
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    right:-1px;
                    top:0px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    
                }
                .icon3bottom{
                    position: absolute;
                    width: 30px;
                    height: 2px;
                    left:-1px;
                    bottom:-1px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
                .icon3left{
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    left:-1px;
                    bottom:0px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
                .icon4bottom{
                    position: absolute;
                    width: 30px;
                    height: 2px;
                    right:-1px;
                    bottom:-1px;
                    background: rgb(77,178,243);
                    box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
                .icon4right{
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    right:-1px;
                    bottom:0px;
                     background: rgb(77,178,243);
                     box-shadow: 1px 1px 2px rgb(84, 181, 241);
                }
            }
            .content_ul{
                width: 90%;
                height: 75%;
                margin:0px auto;
                overflow-x: hidden;
                overflow-y:auto; 
                .content_li{
                    margin:2% auto;
                    width: 100%;
                    height: 23%;
                    // border:1px solid #666;
                    border: 1px solid rgb(42,93,142);
                    box-sizing: border-box;
                    position: relative;
                    .text{
                        text-align: left;
                        height: 30px;
                        padding: 2px;
                        margin:5px;
                         color:white;
                        span{
                           
                            font-size: 18px;
                            line-height: 30px;
                        }
                        .el-icon-location{
                            font-size: 20px;
                            cursor: pointer;
                            &:hover{
                                color:brown;
                            }

                        }

                    }
                        .icon1left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon1top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon2top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon2right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon3bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon3left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                }
            }
        }
        .content_right{
            width: 78%;
            height: 1000px;
            // border: 1px solid #666;
            .content_right_top{
                width: 98%;
                height: 60%;
                margin:1% auto;
                // border: 1px solid #666;
                display: flex;
                flex-direction:row;
                justify-content: space-around;
                // .left_title{
                //     height: 4%;
                //     margin:1% auto;
                //     width: 80%;
                //     border: 1px solid #666;
                // }
                .left_wrapp{
                    width: 80%;
                    height: 98%;
                    padding: 2px;
                    box-sizing: border-box;
                    // margin: 4% auto;
                    .left_wrapp_top{
                        height: 10%;
                        width: 100%;
                        // border: 1px solid #666;
                        border: 1px solid rgb(42,93,142);
                        // position: relative;
                        margin-bottom:1%;
                        text-align: left;
                        color: white;
                        h1{
                            padding: 1%;
                        }
                        // line-height: 10%;
                    }
                    .left_wrapp_bottom{
                        height: 89%;
                        width: 100%;
                        // border: 1px solid #666;
                        border: 1px solid rgb(42,93,142);
                        position: relative;
                        .icon1left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon1top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon2top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon2right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon3bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon3left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                    }
                }
                .right_wrapp{
                    width:18%;
                    height: 98%;
                     padding: 2px;
                    //  border: 1px solid #666;
                    border: 1px solid rgb(42,93,142);
                     position: relative;
                    .icon1left{
                        position: absolute;
                        width: 2px;
                        height: 30px;
                        left:-1px;
                        top:0px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .icon1top{
                        position: absolute;
                        width: 30px;
                        height: 2px;
                        left:-1px;
                        top:-1px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .icon2top{
                        position: absolute;
                        width: 30px;
                        height: 2px;
                        right:-1px;
                        top:-1px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        
                    }
                    .icon2right{
                        position: absolute;
                        width: 2px;
                        height: 30px;
                        right:-1px;
                        top:0px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        
                    }
                    .icon3bottom{
                        position: absolute;
                        width: 30px;
                        height: 2px;
                        left:-1px;
                        bottom:-1px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .icon3left{
                        position: absolute;
                        width: 2px;
                        height: 30px;
                        left:-1px;
                        bottom:0px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .icon4bottom{
                        position: absolute;
                        width: 30px;
                        height: 2px;
                        right:-1px;
                        bottom:-1px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .icon4right{
                        position: absolute;
                        width: 2px;
                        height: 30px;
                        right:-1px;
                        bottom:0px;
                        background: rgb(77,178,243);
                        box-shadow: 1px 1px 2px rgb(84, 181, 241);
                    }
                    .right_wrappUl{
                        width: 100%;
                        height: 96%;
                        overflow: auto;

                        // margin:0 auto;
                        .right_wrappLi{
                            margin:10px auto;
                            width: 96%;
                            height: 75px;
                            .el-icon-warning{
                                font-size: 16px;
                                float: left;
                                margin:5px;
                            }
                           
                        }
                        .color1{
                            border:2px solid #FB464D;
                            color:#FB464D;
                        }
                        .color2{
                            border:2px solid #F7C377;
                            color:#F7C377;
                        }
                        .color3{
                            border:2px solid #48BCF4;
                            color:#48BCF4;
                        }
                    }
                }
            }
            .content_right_bottom{
                width: 98%;
                height: 37%;
                margin:1% auto;
                // border: 1px solid #666;
                .content_right_bottom_ul{
                    display: flex;
                     flex-direction:row;
                     justify-content: space-around;
                     height: 100%;
                    .content_right_bottom_li{
                        width: 32%;
                        height: 95%;
                        // border:1px solid #666;
                        border: 1px solid rgb(42,93,142);
                        margin:1% auto;
                        position: relative;
                         position: relative;
                        .icon1left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon1top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon2top{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            top:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon2right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            top:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                            
                        }
                        .icon3bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            left:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon3left{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            left:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4bottom{
                            position: absolute;
                            width: 30px;
                            height: 2px;
                            right:-1px;
                            bottom:-1px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                        .icon4right{
                            position: absolute;
                            width: 2px;
                            height: 30px;
                            right:-1px;
                            bottom:0px;
                            background: rgb(77,178,243);
                            box-shadow: 1px 1px 2px rgb(84, 181, 241);
                        }
                    }
                }
            }
        }
    }
}
</style>
