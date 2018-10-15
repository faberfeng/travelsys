<template>
    <div id="safetyInspection">
        <div id="GroupSelect">
             <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                现场连线  
                </router-link>
                <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                现场发文  
                </router-link>
                <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                质量检查
                </router-link>
                <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                安全检查  
                </router-link>
                <router-link :to="'/constructionSite/safetyInspection'" class="label-item label-item-active">  
                安全监测  
                </router-link>
            </div>
            <div id="inspectionBody">
                <div class="textBtnLeft">
                    <label class="recordTxt">导出报告</label>
                    <label class="exportTxt">巡视记录</label>
                </div>
                <div class="overviewBody">
                    <div class="overviewHead">
                        <label class="overviewHeadBtn"></label>
                        <label class="overviewHeadTxt">监测概况</label>
                    </div>
                    <div class="overviewFrame">
                        <ul class="overviewFrameUl">
                            <li class="overviewFrameLi">
                                <label class="weatherTxt">天气、温度<br/>{{weatherTime}}</label>
                                <div class="weathBody">
                                    <img id="weathPic" width="100px" height="100px" :src="weathIcon(weatherIcon)">
                                    <p  style="margin-top:10px">{{weatherIcon}}{{weatherAir}}</p>
                                </div>
                            </li>
                            <li class="overviewFrameLi1">
                                <label class="alertTxt">本次报警点位分布</label>
                                <div id="overviewPie"></div>
                            </li>
                            <li class="overviewFrameLi2">
                                <label class="alertTxt">累计报警点位分布</label>
                                <div id="overviewPie2"></div>
                            </li>
                            <li class="overviewFrameLi3">
                                <label class="alertTxt">监测工况综述</label>
                                <div id="conditionLine"></div>
                                <div id="conditionLine1"></div>

                            </li>
                            <li class="overviewFrameLi4">
                                <label class="alertTxt">现场工况</label>
                                <p>{{workingCondition}}</p>
                            </li>
                            <!-- <li class="overviewFrameLi"></li> -->
                        </ul>
                    </div>
                </div>
                <div class="planeFigure">
                    <div class="planeFigureHead">
                        <div class="planeFigureHeadLeft">
                            <label class="planeFigureHeadLeftBtn"></label>
                            <label class="planeFigureHeadLeftTxt">平面图</label>
                        </div>
                        <div class="planeFigureHeadRight" v-show="!editSpotShow">
                            <span :class="[{'clickStyle':isClick},'exportSaveBtn']">导出保存</span>
                            <span class="uploadPicBtn">上传图片</span>
                            <span :class="[{'clickStyle':isClick},'editSpotBtn']"  @click="editSpot()">编辑点位</span>
                            <span class="drawLineBtn">多点对比</span>
                        </div>
                        <div class="planeFigureHeadRightHide" v-show="editSpotShow" >
                            <span id="inspectContentSel">
                                <select class="inspectSel">
                                    <option>
                                    </option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </span>
                            <span :class="[{'clickStyle':isClick},'bottomMap']" @click="getBaseMapListBtn()">底图</span>
                            <span class="singleSpot">单点</span>
                            <span class="inputText">文字</span>
                        </div>
                    </div>
                    <div class="planeFigureBody">
                        <div class="operateTool" v-show="editSpotShow">
                            <div class="operateToolLeft">
                                <span class="move"><i class="moveIcon"><label class="moveTxt">移动</label></i></span>
                                <span class="fault"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                                <span class="deleteDraw"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                            </div>
                            <div class="operateToolRight">
                                <label class="saveDrawTxt" @click="saveDraw()">保存</label>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="inspectTable">
                    <div class="inspectTableHead">
                        <div class="inspectTableHeadLeft">
                            <label class="inspectTableHeadLeftTxt">监测单位：</label>
                            <label class="inspectTableHeadLeftTxt"></label>
                        </div>
                        <div class="inspectTableHeadRight">
                            <div class="addData">数据录入</div>
                            <div class="addInspectContent" @click="addMonitorItemBtn()">新增监测内容</div>
                        </div>
                    </div>
                    <div class="inspectTableBody">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                            <thead>
                            <tr>
                                <th rowspan="2">序号</th>
                                <th rowspan="2">监测内容</th>
                                <th rowspan="2">简写</th>
                                <th rowspan="2">测点数</th>
                                <th rowspan="2">最新数据</th>
                                <th colspan="3">本次最大变化量</th>
                                <th colspan="3">累计最大变化量</th>
                                <th rowspan="2">更多操作</th>
                            </tr>
                            <tr>
                                <th>点号</th>
                                <th>取值</th>
                                <th>报警</th>
                                <th>点号</th>
                                <th>取值</th>
                                <th>报警</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>水平位移</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <button title="编辑" class="editBtn actionBtn"></button>
                                        <button title="上移" class="upmoveBtn actionBtn"></button>
                                        <button title="下移" class="downmoveBtn actionBtn"></button>
                                        <button title="详情" class="detailBtn actionBtn"></button>
                                        <button title="导入" class="exportBtn actionBtn"></button>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <td>2</td>
                                    <td>竖向位移</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>水位</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>受力</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                 <tr>
                                    <td>5</td>
                                    <td>斜度</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr> -->
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="底图管理" :visible="baseMapShow" @close="baseMapCancle()" width="740px">
                <div class="baseMapBody">
                    <ul class="clearfix" style="margin:0px 20px 0px 20px;">
                        <li class="baseMapBodyLi" style="padding: 0px; overflow: hidden;"><img style="object-fit: contain;" class="baseMapBodyImg"  src="./images/12.jpg"></li>
                        <li class="uploadBaseBody">
                            <div class="uploadBaseIcon">
                                <label for="drawingsInfo">
                                    <img style=" cursor: pointer"  src="./images/upload.png">
                                    <p>上传新底图</p>
                                </label>
                                <input class="upInput"  type="file"  @change="addBaseMap($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                            </div>
                        </li>
                    </ul>
                </div>
            </el-dialog>
            <el-dialog title="新增监测内容" :visible="addInspectContentShow" @close="addInspectContentCancle()">

            </el-dialog>
        </div>
        
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
var echarts = require('echarts');
export default {
    name:'safetyInspection',
    data(){
        return{
            selectUgId:'',
            ugList:'',
            token:'',
            projId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            userId:'',
            defaultSubProjId:'',
            detectionSummaryList:'',
            alertPointAmount:'',
            condition:'',
            workingCondition:'',//现场工况
            weatherJson:'',
            weatherIcon:'',
            weatherAir:'',
            weatherTime:'',
            editSpotShow:false,
            baseMapShow:false,
            addInspectContentShow:false,//增加监测内容弹框
            fileList:'',
            fileListName:'',
            pageNo:'',
            isClick:false,//是否点击

            
        }
    },
    created(){
        var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getAccessUserGroup();
    },
    filters:{

    },
    watch:{
        selectUgId:function(val){
            var vm=this;
            vm.getDetectionSummary();
        }
    },
    methods:{
        //获取可用的群组
        getAccessUserGroup(){
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getAccessUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                },
                
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.ugList=response.data.rt;
                        this.selectUgId=this.ugList[0].ugId;
                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })
        },
        //获取监测概况
        getDetectionSummary(){
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getDetectionSummary',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    userGroupId:this.selectUgId
                },
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.detectionSummaryList=response.data.rt;
                        this.alertPointAmount=this.detectionSummaryList.alertPointAmount;
                        this.condition=this.detectionSummaryList.condition;
                        this.workingCondition=this.condition.workingCondition;
                        console.log(this.workingCondition)
                        this.weatherJson=JSON.parse(this.detectionSummaryList.weatherJson);
                        this.weatherIcon=this.weatherJson.data[0].wea;
                        this.weatherAir=this.weatherJson.data[0].tem1;
                        this.weatherTime=this.weatherJson.data[0].date+this.weatherJson.data[0].week
                        console.log(this.weatherJson)
                        var recentData=[];
                        var totalData=[];
                        var legendData='';
                        var legendAllData='';
                        var conditionData=[];//监测工况综述
                        recentData.push(
                            {
                            name:'报警',
                            value:this.alertPointAmount.recentAlertAmount
                            },{
                                name:'总数',
                                value:this.alertPointAmount.allAmount
                            }
                        );
                        // legendData='报警'+this.alertPointAmount.recentAlertAmount;
                        // legendAllData='总数'+this.alertPointAmount.allAmount;
                        totalData.push(
                            {
                            name:'报警',
                            value:this.alertPointAmount.totalAlertAmount
                            },
                            {
                                name:'总数',
                                value:this.alertPointAmount.allAmount
                                
                            }
                        );
                        conditionData.push(
                            this.condition.acAmount,this.condition.days
                        )
                        var myChart = echarts.init(document.getElementById('overviewPie'))
                        var myChart1 = echarts.init(document.getElementById('overviewPie2'))
                        var myChart2=echarts.init(document.getElementById('conditionLine'))
                        //环形图（当前报警）
                        myChart.setOption({
                             title: {
                                // text: '本次报警点位分布',
                                // left: 'left'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                // orient: 'horizontal',
                                // top: 'middle',
                                bottom: 0,
                                // left: 'center',
                                data:['报警','总数']
                            },
                            color:['#ff634d','#dcdcdc'],
                            series : [
                                {
                                    name: '本次报警点位分布',
                                    type: 'pie',
                                    radius: ['50%', '65%'],
                                    center: ['50%', '50%'],
                                    selectedMode: 'single',
                                    data:recentData,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    lableLine: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                }
                            ]
                        })
                        //环形图（累计报警）
                        myChart1.setOption({
                             title: {
                                // text: '本次报警点位分布',
                                // left: 'left',
                                // fontSize:'14px',
                                // color:'#333333'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                // orient: 'horizontal',
                                // top: 'middle',
                                bottom: 0,
                                left: 'center',
                                data:['报警','总数']
                            },
                            color:['#ffaa25','#dcdcdc'],
                            series : [
                                {
                                    name: '本次报警点位分布',
                                    type: 'pie',
                                    radius: ['50%', '65%'],
                                    center: ['50%', '50%'],
                                    selectedMode: 'single',
                                    data:totalData,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    lableLine: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                }
                            ]
                        })
                        //条形图（现场概况）
                         myChart2.setOption({
                                    title : {
                                        text: '',
                                        subtext: ''
                                    },
                                    tooltip : {
                                        trigger: 'item'  //悬浮提示框不显示
                                    },
                                    grid:{   //绘图区调整
                                        x:100,  //左留白
                                        y:0,   //上留白
                                        x2:10,  //右留白
                                        y2:0   //下留白
                                    },
                                    xAxis : [
                                        {
                                            show:false,
                                            type : 'value',
                                            boundaryGap : [0, 0],
                                            position: 'top'
                                        }
                                    ],
                                    yAxis : [
                                        {
                                            type : 'category',
                                            data : ['监测时长','采集次数'],
                                            axisLine:{show:false},     //坐标轴
                                            axisTick:[{    //坐标轴小标记
                                                show:false
                                            }],
                                            axisLabel:{
                                                textStyle:{
                                                    fontSize:'14',
                                                    color:'#999999;'
                                                }
                                            }
                                        }
                                    ],
                                    series : [
                                        {
                                            name:'',
                                            type:'bar',
                                            tooltip:{show:false},
                                            barMinHeight:100,  //最小柱高
                                            barMinHeight:200,//最大柱高
                                            barWidth: 16,  //柱宽度
                                            barMaxWidth:50,   //最大柱宽度
                                            data:conditionData,
                                            itemStyle:{
                                                normal:{    //柱状图颜色
                                                    color:'#82d587',
                                                    label:{
                                                        show: true,   //显示文本
                                                        position: 'outside',  //数据值位置
                                                        textStyle:{
                                                            color:'#000',
                                                            fontSize:'14'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                         })

                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })

        },
        //
        weathIcon(val){
            if(val=="阴转小雨"){
                return  require('./images/sunnyandcloudy.png')
            }else if(val=="多云"){
                return  require('./images/cloudy.png')
            }else if(val=="多云转阴"){
                return  require('./images/sunnyandcloudy.png')
            }else if(val=="晴"){
                return  require('./images/sunny.png')
            }else if(val=="小雨"){
                return  require('./images/lightrain.png')
            }else if(val=="大雨"){
                return  require('./images/heavyrain.png')
            }else if(val=="多云转小雨"){
                return  require('./images/sunnyandcloudy.png')

            }
        },
        //编辑点位
        editSpot(){
            var vm=this;
            this.editSpotShow=true;
            // this.isClick=true;
        },
        saveDraw(){
            var vm=this;
            this.editSpotShow=false;
        },
        //添加底图
        addBaseMap(file){
            var vm=this;
             const list = vm.$refs.drawingsInfo.files;
            var reader = new FileReader();  
            var dwidth = 0
            var dheight = 0
            reader.onload = function (e) {  
                var data = e.target.result;  
                //加载图片获取图片真实宽度和高度  
                var image = new Image();  
                image.onload=function(){  
                    dwidth = image.width;  
                    dheight = image.height;  
                }; 
                image.src= data;   
            };  
            reader.readAsDataURL(list[0]);
            vm.fileList=list[0];
            vm.fileListName=list[0].name;
            console.log(vm.fileListName);
            var returnUrl = vm.BDMSUrl+'detectionInfo/addBaseMap?userGroupId='+vm.selectUgId+'&name='+vm.fileListName;
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
            formData.append('type',1);
            formData.append('file',vm.fileList);
            formData.append('userId',vm.userId);
            formData.append('modelCode','006');
            formData.append('returnUrl',returnUrl);
            axios({
                    method:'POST',
                    url:vm.QJFileManageSystemURL+ 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    },
                    data:formData,
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            alert('上传成功');
                            vm.fileList = '';
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                             vm.fileList ='';
                        }
                    })
        },
        //点击获取底图列表
        getBaseMapListBtn(){
            this.baseMapShow=true;
            this.isClick=true;
        },
        //获取底图列表
        getBaseMapList(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getBaseMapList',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){


                }else{
                    vm.$message({
                        type:"error",
                        msg:response.data.msg
                    })
                }
            })
        },
        //取消底图列表
        baseMapCancle(){
            this.baseMapShow=false;
            this.isClick=false;
        },
        //点击新增监测内容
        addMonitorItemBtn(){
             var vm=this;
            vm.addInspectContentShow=true;
        },
        addInspectContentCancle(){
            var vm=this;
            vm.addInspectContentShow=false;
        },
        //新增监测内容
        addMonitorItem(){
            // var vm=this;
            // axios({
            //     method:'get',
            //     url:vm.BDMSUrl+'detectionInfo/addMonitorItem',
            //     headers:{
            //         'token':vm.token
            //     },
            //     params:{
            //         userGroupId:vm.selectUgId
            //     }
            // }).then((response)=>{
            //     if(response.data.cd=='0'){


            //     }else{
            //         vm.$message({
            //             type:"error",
            //             msg:response.data.msg
            //         })
            //     }
            // })
        },

        

       


    }
    
}
</script>
<style lang="less">
  *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
     .clickStyle{
            color: #ffffff !important;
            background: #fc3439 !important;
        }
     i{ font-style:normal}
     select.inp-search {  
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  
        }
    select.inspectSel{
        /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  

    }
    li{
        list-style: none;
    }
    #safetyInspection{
        //  .clickStyle{
        //     color: #ffffff !important;
        //     background: #fc3439 !important;
        // }
       
        .clearfix {
            clear: both;
            overflow: hidden;
            content: '';
        }
        #GroupSelect {
            display: inline-block;
            float: right;
            margin-top:-40px;
            margin-right:10px;
            width: 168px;
            height: 30px;
            .inp-search {
                width: 168px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #cccccc;
                position: relative;
                background: #fafafa;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                float: left;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .icon-sanjiao {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 19px;
                right: 18px;
            }
        }
         ::-webkit-scrollbar{width:0px}
        .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            max-height:800px;
            overflow: auto;
             #inspectionBody{
                margin:0 auto;
                position: relative;
               width: 96%;
                .textBtnLeft{
                    margin-top:10px;
                    height: 28px;
                    .recordTxt{
                        color:#999999;
                        font-size:14px;
                        display: block;
                        float: right;
                        margin-right: 15px;
                        cursor: pointer;
                    }
                    .exportTxt{
                        color:#336699;
                         margin-right: 15px;
                        display: block;
                        float: right;
                        font-size:14px;
                        cursor: pointer;
                    }
                }
                .overviewBody{
                    .overviewHead{
                        height:32px;
                         border-bottom: 1px solid #e6e6e6;
                        .overviewHeadBtn{
                            background:url('./images/overview.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top:9px;
                            margin-left:4px;
                            margin-right:7px;

                        }
                        .overviewHeadTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 32px;
                        }
                    }
                    .overviewFrame{
                        margin-top:20px;
                        .overviewFrameUl{
                            width: 100%;
                            height: 236px;
                            border:1px solid #e6e6e6;
                            position: relative;
                            .overviewFrameLi{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:0px;
                                .weatherTxt{
                                    font-size: 16px;
                                    color: 333333;
                                    display: inline-block;
                                    float: left;
                                    margin-top:10px;
                                    margin-left:24px;
                                }
                                .weathBody{
                                    display: block;
                                    margin-top:70px;
                                
                                }
                            }
                            .overviewFrameLi1{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:20%;
                                .alertTxt{
                                        font-size: 16px;
                                        color: 333333;
                                        display: inline-block;
                                        float: left;
                                        margin-top:10px;
                                        margin-left:24px;

                                    }
                                #overviewPie{
                                    //  position: absolute;
                                    // position: relative;
                                    display: block;
                                    // width:200px;
                                    height:180px;
                                    left:0%;
                                    top:2%;
                                }
                            }
                            .overviewFrameLi2{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:40%;
                                 .alertTxt{
                                        font-size: 16px;
                                        color: 333333;
                                        display: inline-block;
                                        float: left;
                                        margin-top:10px;
                                        margin-left:24px;

                                    }
                                 #overviewPie2{
                                    display: block;
                                    //  width:200px;
                                    height:180px;
                                    left:0%;
                                    top:2%;
                                   
                                }
                            }
                            .overviewFrameLi3{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:60%;
                                 .alertTxt{
                                        font-size: 16px;
                                        color: 333333;
                                        display: inline-block;
                                        float: left;
                                        margin-top:10px;
                                        margin-left:24px;

                                    }
                                #conditionLine{
                                    margin-top:60px;
                                    height: 120px;
                                }
                            }
                            .overviewFrameLi4{
                                width: 20%;
                                height: 236px;
                                // border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:80%;
                                .alertTxt{
                                    font-size: 16px;
                                    color: 333333;
                                    display: inline-block;
                                    float: left;
                                    margin-top:10px;
                                    margin-left:24px;

                                }
                            }
                        }


                    }


                }
                .planeFigure{
                    margin-top:26px;
                    .planeFigureHead{
                        height: 32px;
                        border-bottom: 1px solid #e6e6e6;
                        .planeFigureHeadLeft{
                            // float: left;
                            .planeFigureHeadLeftBtn{
                                background:url('./images/planpic.png') no-repeat;
                                width: 18px;
                                height: 18px;
                                display: block;
                                float: left;
                                margin-top:9px;
                                margin-left:4px;
                                margin-right:7px;
                            }
                            .planeFigureHeadLeftTxt{
                                color: #fc3439;
                                font-size: 16px;
                                float: left;
                                font-weight: bold;
                                line-height: 32px;
                            }
                        }
                        .planeFigureHeadRight{
                            float: right;
                            .exportSaveBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .uploadPicBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .editSpotBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;

                            }
                            .drawLineBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }

                        }
                        .planeFigureHeadRightHide{
                            float:right;
                            #inspectContentSel{
                                // display: inline-block;
                                // float: right;
                                // margin-top:-40px;
                                // margin-right:10px;
                                // width: 168px;
                                // height: 30px;
                                .inspectSel{
                                    width: 175px;
                                    height: 26px;
                                    border: 1px solid #cccccc;
                                    position: relative;
                                    background: #fafafa;
                                    padding-left: 10px;
                                    padding-right: 20px;
                                    box-sizing: border-box;
                                    margin-right: 15px;
                                    float: left;
                                    color: #333333;
                                    font-size: 14px;
                                    outline: none;
                                }
                                .icon-sanjiao{
                                    display: block;
                                    position: absolute;
                                    width: 12px;
                                    height: 7px;
                                    background-image: url('../Settings/images/sanjiao.png');
                                    background-size: 100% 100%;
                                    content: '';
                                    top: 352px;
                                    right: 283px;
                                }

                            }
                            .bottomMap{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;

                            }
                            .singleSpot{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .inputText{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }

                        }
                    }
                    .planeFigureBody{
                        margin-top:15px !important;
                        margin:0 auto;
                        border:1px solid #e6e6e6;
                        height: 540px;
                        width: 100%;
                        .operateTool{
                            width: 288px;
                            height: 34px;
                            // border:1px solid #ccc;
                            float: right;
                            margin-top:15px;
                            margin-right:10px;
                            position: relative;
                            .operateToolLeft{
                                width:216px;
                                height: 34px;
                                float: left;
                                position: relative;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                .move{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                   margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                     
                                    left:0%;
                                    .moveIcon{
                                        background: url('./images/move.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/move1.png') no-repeat 0 0;
                                        }
                                         .moveTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                      
                                        }
                                    }
                                   
                                }
                                .fault{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                    left:33%;
                                    .faultIcon{
                                        background: url('./images/falut.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/fault1.png') no-repeat 0 0;
                                        }
                                         .faultTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                        }
                                    }
                                   
                                }
                                .deleteDraw{
                                    display: inline-block;
                                     height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    left:72%;
                                    .deleteDrawIcon{
                                        background: url('./images/delete.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/delete.png') no-repeat 0 0;
                                        }
                                    }
                                    .deleteDrawTxt{
                                        line-height: 20px;
                                        color:#666666;
                                        font-size: 12px;
                                        display: block;
                                        margin-left: 12px;
                                        margin-top: 1px;
                                    }
                                }

                            }
                            .operateToolRight{
                                float: right;
                                width: 62px;
                                height: 34px;
                                margin-left:10px;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                .saveDrawTxt{
                                    font-size:12px;
                                    color:#666666;
                                    line-height: 32px;
                                }
                            }

                        }
                    }
                }
                .inspectTable{
                    margin-top:30px;
                    .inspectTableHead{
                        height: 32px;
                        .inspectTableHeadLeft{
                            float: left;
                            .inspectTableHeadLeftTxt{
                                // width: 78px;
                                font-size: 16px;
                                color:#666666;
                                line-height: 32px;
                                // font-weight: bold;
                            }
                        }
                        .inspectTableHeadRight{
                                float: right;
                                .addData{
                                    display: inline-block;
                                    width: 84px;
                                    height: 25px;
                                    border:1px solid #f2f2f2;
                                    background: #f2f2f2;
                                    font-size: 12px;
                                    line-height: 25px;
                                    vertical-align: middle;
                                    color:#666666;
                                    border-radius: 2px;
                                    cursor: pointer;
                                }
                                .addInspectContent{
                                    display: inline-block;
                                    width: 105px;
                                    height: 25px;
                                    border:1px solid #f2f2f2;
                                    background: #f2f2f2;
                                    font-size: 12px;
                                    line-height: 25px;
                                    vertical-align: middle;
                                    color:#666666;
                                    border-radius: 2px;
                                    cursor: pointer;
                                }
                        }

                    }
                    .inspectTableBody{
                        .inspectTableList{
                            border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                            tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 36px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                        .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;

                                        }
                                        .editBtn{
                                            background: url('./images/overviewedit.png') no-repeat 0 0;
                                        }
                                        .upmoveBtn{
                                            background: url('./images/overviewup.png') no-repeat 0 0;
                                        }
                                        .downmoveBtn{
                                            background: url('./images/downmove.png') no-repeat 0 0;
                                        }
                                        .detailBtn{
                                            background: url('./images/overfile.png') no-repeat 0 0;
                                        }
                                        .exportBtn{
                                            background: url('./images/overviewdown.png') no-repeat 0 0;
                                        }





                                    }
                                }
                            }

                        }
                    }


                }


            }
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
            .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
            .label-item-active{
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
        }
        #edit{
            .baseMapBody{
                height: 460px;
                .clearfix{
                    clear: both;
                    overflow: hidden;
                    content: '';
                }
                .baseMapBodyLi{
                     float: left;
                    display: inline-block;
                    width: 164px;
                    height: 122px;
                    // background: #f0f1f4;
                    margin-right: 10px;
                    margin-top:20px;
                    border-radius: 4px;
                    .baseMapBodyImg{
                        width: 100%;
                        height: 122px;
                        margin: 0;
                        padding: 0;
                        border-radius: 2px;
                        cursor: pointer;
                        // -o-object-fit: contain;
                        object-fit: contain;
                        // background: #f2f2f2;
                        background: #f0f1f4;

                    }
                }
                .uploadBaseBody{
                    float: left;
                    display: inline-block;
                    width: 164px;
                    height: 122px;
                    margin-top:20px;
                    background: #f0f1f4;
                    border-radius: 4px;
                    cursor: pointer;
                    &:hover{
                        border:1px dashed #0d6cb2;
                    }
                    .uploadBaseIcon{
                        // cursor: pointer;
                        margin:25px auto;
                        .upInput{
                            display: none;
                        }

                    }
                } 
            }

        }
       

    }



</style>

