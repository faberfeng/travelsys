<template>
    <div id="htlmToPdf">
        <div  class="pdfStyle" id="pdfDom">
                <!-- 封面 -->
                <div class="pdfCover">
                    <div class="pdfImg">
                         <!-- <img id="img1" style="width:400px;height:100px;" src="../../assets/huajianlogo.png"/> -->
                        <img id="img1" style="width:400px;height:100px;" :src="coverPath?coverPath:require('../../assets/defaultlogo.png')">
                        <!-- <img id="img1" style="width:400px;height:100px;" :src="main(coverPath)"> -->
                    </div>
                    <h5 style="margin-top:20px;color:#000;font-size:18px;">{{projectName}}--监测报表</h5>
                    <div class="time"><label class="timelabel1">报告编码：{{onlyNum}}</label></div>
                    <div class="time"><label class="timelabel1" >本次观测日期：{{beforeDate}}</label><label class="timelabel2">前次观测日期：{{referenceDate}}</label></div> 
                    <div class="tableList">
                        <div class="tableListDiv">
                            <ul class="tableListUl">
                                <li class="tableListLi"><label class="tableListLabel1">报告内容</label></li>
                                <li class="tableListLi"><label class="tableListLabel1">概述</label><label class="tableListLabel2">第1页</label></li>
                                <li class="tableListLi"><label class="tableListLabel1">巡视</label><label class="tableListLabel2">第2页</label></li>
                                <li class="tableListLi" v-for="(item,index) in getPageNumList" :key="index"><label class="tableListLabel1">{{item.name}}</label><label class="tableListLabel2">第{{item.order+2}}页</label></li>
                            </ul>
                        </div>
                        <div class="bottom">
                            <label class="bottom1">声明：1.本报表不得涂改、换页，否则无效。</label>
                            <label class="bottom2">2.如对本报表有异议，可在发出日后10日内提出复议。</label>
                            <label class="bottom3">监测方盖章:</label>
                            <label class="bottom4">{{company}}</label>
                            <label class="bottom5">{{nowDate}}</label>
                        </div>
                    </div>     

                </div>
                <!-- 概述 -->
                <div class="pdfSummary">
                    <label class="pdfSummaryHead">概述</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <div class="inspectTableList1">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                                <!-- <tr class="contentTr"></tr> -->
                                <thead>
                                    <tr>
                                        <th style="height:100px;">工况</th>
                                        <th style="height:100px;padding:10px" colspan="11">{{getSiteConditionList}}</th>
                                    </tr>
                                    <tr>
                                        <th rowspan="2">序号</th>
                                        <th rowspan="2">监测类型</th>
                                        <th rowspan="2">监测内容</th>
                                        <th rowspan="2">简写</th>
                                        <th rowspan="2">测点数</th>
                                        <th rowspan="2">最新数据</th>
                                        <th colspan="3">本次最大变化量</th>
                                        <th colspan="3">累计最大变化量</th>
                                    </tr>
                                    <tr>
                                        <th>点号</th>
                                        <th>取值</th>
                                        <th >报警</th>
                                        <th>点号</th>
                                        <th>取值</th>
                                        <th>报警</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in getMonitorMainTableList" :key="index">
                                        <td v-text="index+1"></td>
                                        <td>{{item.type|monitorTypeChange()}}</td>
                                        <td v-text="item.name"></td>
                                        <td v-text="item.logogram"></td>
                                        <td v-text="item.count"></td>
                                        <td >{{item.latestTime|timeChange()}}</td>
                                        <td >{{item.recentPointName|addSprit()}}</td>
                                        <td>{{item.recentVariation|addSprit1()}}</td>
                                        <td :class="[{'red':item.recentAlert==true}]" >{{item.recentAlert|shifouChange()}}</td>
                                        <td>{{item.totalPointName|addSprit()}}</td>
                                        <td>{{item.totalVariation|addSprit2()}}</td>
                                        <td :class="[{'red':item.totalAlert==true}]">{{item.totalAlert|shifouChange()}}</td>
                                    </tr>
                                    <tr>
                                        <td style="height:100px;">巡视情况</td>
                                        <td style="height:100px;" colspan="11"></td>
                                    </tr>
                                    <tr>
                                        <td style="height:100px;padding:10px">监测综述及建议</td>
                                        <td style="height:100px;padding:10px" colspan="11">{{suggestion}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                     <div class="pageNum"><label class="pageNum1">第{{1}}页</label></div>

                </div>
                <!-- 现场巡检 -->
                <div class="pdfInspection">
                     <label class="pdfSummaryHead">现场巡检</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <div class="containerTable">
                        <table class="containerList" border="1" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>分类</th>
                                    <th>巡视监测内容</th>
                                    <th>巡视检测结果</th>
                                    <th>备注</th>
                                </tr>
                                <tr>
                                    <th rowspan="2">自然条件</th>
                                    <th>天气</th>
                                    <th>{{weatherIcon}}</th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th>温度</th>
                                    <th>{{weatherAir}}</th>
                                    <th></th>
                                </tr> 
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in getPatrolRecordLists" :key="index">
                                    <td :rowspan="item.patrolTypeNamespan" :class="{'hidden': item.patrolTypeNamedis}">{{item.patrolTypeName}}</td>
                                    <td :rowspan="item.patrolNamespan" :class="{'hidden': item.patrolNamedis}" v-text="item.patrolName"></td>
                                    <td  v-text="item.historyResult"></td>
                                    <td  v-text="item.historyRemark"></td>
                                    <!-- <td v-show="saveShow"  v-text="item.recentResult"></td>
                                    <td v-show="saveShow" v-text="item.recentRemark"></td>
                                    <td width="180px" ><label v-show="!isEditShow&&hasTodayRecordBoolen">{{item.todayResult}}</label></td>
                                    <td width="180px"><label v-show="!isEditShow&&hasTodayRecordBoolen">{{item.todayRemark}}</label></td> -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pageNum"><label class="pageNum1">第{{2}}页</label></div>
                </div>
                <!-- 公共面积 -->
                <ul class="inspectUl">
                    <li class="inspectLi" v-for="(item,index) in getAllMonitorItemList" :key="index">
                        <div class="verticalLength" v-show="item.type!=5">
                            <label class="pdfSummaryHead1">{{company}}</label>
                            <label class="pdfSummaryHead">监测报表</label>
                            <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                            <div class="txt"><label class="label1">测量日期</label><span class="span1"><label>观测：</label><label>计算：</label><label>检核：</label></span></div>
                            <div class="txt1"><label>监测内容：{{item.name}}</label></div>
                            <!-- <div v-show="baseMapPosition==1" class="showBasePic"></div> -->
                            <div class="bottomTabel" >
                                <table class="bottomTableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <!-- <tr>
                                            <th rowspan="2">测点编号</th>
                                            <th v-show="item.type!=3" colspan="2">初始采集</th>
                                            <th v-show="item.type==3" colspan="3">初始采集</th>
                                            <th v-show="item.type!=3" colspan="2">上次采集</th>
                                            <th v-show="item.type==3" colspan="3">上次采集</th>
                                            <th v-show="item.type!=3" colspan="2">本次采集</th>
                                            <th v-show="item.type==3" colspan="3">本次采集</th>
                                            <th colspan="3">变化量</th>
                                        </tr>
                                        <tr>
                                            <th>采集时间</th>
                                            <th v-show="item.type==1">位移(mm)</th>
                                            <th v-show="item.type==2">高程(m)</th>
                                            <th v-show="item.type==3">水位(m)</th>
                                            <th v-show="item.type==3">管口(m)</th>
                                            <th v-show="item.type==4">受力(kN)</th>
                                            <th>采集时间</th>
                                            <th v-show="item.type==1">位移(mm)</th>
                                            <th v-show="item.type==2">高程(m)</th>
                                            <th v-show="item.type==3">水位(m)</th>
                                            <th v-show="item.type==3">管口(m)</th>
                                            <th v-show="item.type==4">受力(kN)</th>
                                            <th>采集时间</th>
                                            <th v-show="item.type==1">位移(mm)</th>
                                            <th v-show="item.type==2">高程(m)</th>
                                            <th v-show="item.type==3">水位(m)</th>
                                            <th v-show="item.type==3">管口(m)</th>
                                            <th v-show="item.type==4">受力(kN)</th>
                                            <th>变化时间</th>
                                            <th v-show="item.type!=4">本次(mm)</th>
                                            <th v-show="item.type==4">本次(kN)</th>
                                            <th v-show="item.type!=4">累计(mm)</th>
                                            <th v-show="item.type==4">累计(kN)</th>
                                        </tr> -->
                                        <tr>
                                            <td rowspan="2">测点编号</td>
                                            <td colspan="2" v-show="item.type==1">位移(mm)</td>
                                            <td colspan="2" v-show="item.type==2">高程(m)</td>
                                            <td colspan="2" v-show="item.type==3">水位(m)</td>
                                            <td v-show="item.type==3">管口(m)</td>
                                            <td colspan="2" v-show="item.type==4">受力(KN)</td>
                                            <td colspan="2">变化量</td>
                                            <td rowspan="2">备注</td>
                                        </tr>
                                        <tr>
                                            <td>初始</td>
                                            <td>本次</td>
                                            <td v-show="item.type==3">本次</td>
                                            <td>本次</td>
                                            <td>累计</td>
                                            <!-- <td></td> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(val,index) in item.dataList" :key="index"> 
                                            <td>{{val.pointName|addSprit()}}</td>
                                            <td >{{val.initValue|addSprit()}}</td>
                                            <td >{{val.currentValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td>{{val.currentVariation|addSprit()}}</td>
                                            <td>{{val.totalVariation|addSprit()}}</td>
                                            <td></td>



                                            <!-- <td>{{val.pointName|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td >{{val.initValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td >{{val.referenceValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.lastPipeHeight|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td>{{val.currentValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeStamp()}}</td>
                                            <td>{{val.recentVariation|addSprit()}}</td>
                                            <td>{{val.totalVariation|addSprit()}}</td> -->

                                              <!-- <td>{{val.pointName|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td >{{val.initValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td >{{val.referenceValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.lastPipeHeight|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeChange()}}</td>
                                            <td>{{val.currentValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td>{{val.acquisitionTime|timeStamp()}}</td>
                                            <td>{{val.recentVariation|addSprit()}}</td>
                                            <td>{{val.totalVariation|addSprit()}}</td> -->
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- <div v-show="baseMapPosition==2" class="showBasePic"></div> -->
                            <div class="pageNum"><label class="pageNum1">第{{item.order+2}}页</label></div>
                        </div>
                        <!-- <div class="verticalLength1" v-show="item.type==5">
                            <label class="pdfSummaryHead1">{{company}}</label>
                            <label class="pdfSummaryHead">监测报表</label>
                            <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                            <div class="txt"><label class="label1">测量日期</label><span class="span1"><label>观测：</label><label>计算：</label><label>检核：</label></span></div>
                            <div class="txt1"><label>监测内容：{{item.name}}</label></div>
                            <div class="containerTable">
                                <table class="containerList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th rowspan="2">序列编号</th>
                                            <th rowspan="2">关键字</th>
                                            <th rowspan="2">起始标高</th>
                                            <th rowspan="2">结束标高</th>
                                            <th rowspan="2">点位间隔</th>
                                            <th rowspan="2">点位数量</th>
                                            <th colspan="3">当前最大值</th>
                                            <th colspan="4">累计最大变化量</th>
                                        </tr>
                                        <tr>
                                            <th>位置</th>
                                            <th>位移</th>
                                            <th>报警</th>
                                            <th>时间间隔</th>
                                            <th>位置</th>
                                            <th>变化</th>
                                            <th>报警</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in item.dataList" :key="index">
                                            <td v-text="$options.filters.addSprit(item.name)"></td>
                                            <td v-text="$options.filters.addSprit(item.keyword)"></td>
                                            <td v-text="$options.filters.addSprit(item.initDepth)"></td>
                                            <td v-text="$options.filters.addSprit(item.terminalDepth)"></td>
                                            <td v-text="item.pointDistance"></td>
                                            <td v-text="item.pointAmount"></td>
                                            <td v-text="$options.filters.addSprit(item.maxDepth)"></td>
                                            <td v-text="$options.filters.addSprit(item.maxShift)"></td>
                                            <td>{{item.maxAlert|shifouChange()}}</td>
                                            <td v-text="$options.filters.timeStamp(item.maxVariationInterval)"></td>
                                            <td v-text="$options.filters.addSprit(item.maxVariationDepth)"></td>
                                            <td v-text="$options.filters.addSprit(item.maxVariationShift)"></td>
                                            <td>{{item.maxVariationAlert|shifouChange()}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                             <div class="pageNum"><label class="pageNum1">第{{item.order+2}}页</label></div>
                        </div> -->
                    </li>
                </ul>
                <!-- 下载到本地 -->
        </div>
        <div>
            <button class="downbtn" @click="getPdf()">下载到本地</button>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default {
     components: {
        pdf,jsPDF,html2canvas
    },
    name:'htmlToPdf',
    data(){
        return{
            ugSelectId:this.$route.query.ugselectId,//获取到项目群组ID
            // window.location.href.substr(window.location.href.length-4)
            getReportSettingList:'',//获取报告保存的选项
            getSiteConditionList:'',//获取最新现场工况
            getPatrolRecordList:'',//获取巡视记录
            getPatrolRecordLists:'',//获取巡视记录
            historyTime:'',
            userGroupIdList:[],
            hasTodayRecordBoolen:'',
            historyTime:'',
            getMonitorMainTableList:'',//获取监测内容主表
            getAllMonitorItemList:'',//获取所有监测项目
            getPageNumList:'',//所有页面
            getReportDatasList:'',//获取所有监测数据
            mapList:'',
            coverPath:'',//封面地址
            suggestion:'',
            weatherIcon:'',
            weatherAir:'',
            company:this.$route.query.monitorCompany,
            getBaseMapInfoByBaseMapIdList:'',
            angle:'',
            paramsLists:'',
            monitorPointInfo:'',
            monitorBaseMapId:this.$route.query.monitorBaseMapId,
            optimalizationSchema:'', ////优化方案：1-测点顺序优先；2-图面清晰优先
            baseMapPosition:'', //底图位置：1-上部；2-下部
            onlyNum:'',//报告编码
            beforeDate:this.$route.query.consultValue,
            referenceDate:this.$route.query.userValue,
            nowDate:'',
        }
    },
    created(){
         var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.projectName =localStorage.getItem('projectName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        // this.getUrl();
        this.getReportSetting();
        this.getMonitorMainTable();
        this.getPatrolRecord();
        this.getSiteCondition();
        this.getDetectionSummary();
        this.getAllMonitorItem();
        this.getBaseMapInfoByBaseMapId();
        this.getAllMonitorPoint();
        this.generateReportNumber();
        this.curTime();
        // this.getItemDutyUser();
        // this.getReportDatas();
    },
    filters:{
        monitorTypeChange(val){
            if(val==1){
                return '水平位移'
            }else if(val==2){
                return '竖向位移'
            }else if(val==3){
                return '水位'
            }else if(val==4){
                return '受力'
            }else if(val==5){
                return '斜度'
            }
        },
        shifouChange(val){
            if(val==false){
                return '否'
            }else if(val==true){
                return '是'
            }
        },
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        addSprit1(val){
            if(val==null){
                return '/'
            }else {
                return val.recentVariation
            }
        },
        addSprit2(val){
             if(val==null){
                return '/'
            }else {
                return val.totalVariation
            }
        },
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
            }
        },
        timeStamp(StatusMinute){	
            var day=parseInt(StatusMinute/1000/60/60/24);
            var hour=parseInt(StatusMinute/1000/60/60%24);
            var min= parseInt(StatusMinute/1000/60%60);
            StatusMinute="";
            if (day > 0)
            {
                StatusMinute= day + "d";
            } 
            if (hour>0)
            {
                StatusMinute += hour + "h";
            } 
            if (min>0)
            {
                StatusMinute += parseFloat(min) + "m";
            }
                return StatusMinute;
        }

    },
    watch:{

    },
    methods:{
        getItemDutyUser(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.rt){
                     this.getItemDutyUserList=response.data.rt;
                     this.inspectorName=this.getItemDutyUserList.inspectorName;
                     this.calculatorName=this.getItemDutyUserList.calculatorName;
                     this.observerName=this.getItemDutyUserList.observerName;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        curTime(){
            var date = new Date();
            console.log(date,'date');
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
             this.nowDate = year + "年" + month + "月" + day+"日";
        },
     getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL("image/jpeg");  // 可选其他值 image/jpeg
            return dataURL;
        },

    main(src){
        var image = new Image();
        image.src = src + '?v=' + Math.random(); // 处理缓存
        image.crossOrigin = "*";  // 支持跨域图片
        
        image.onload=function(){
            var base64 =this.getBase64Image(image);
            console.log(base64,'base64');
            // cb && cb(base64);
        }
    },
    getBaseMapInfoByBaseMapId(){
            var vm=this;
            this.angle=0;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getBaseMapInfoByBaseMapId',
                headers:{
                    'token':vm.token
                },
                params:{
                   baseMapId:vm.monitorBaseMapId,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getBaseMapInfoByBaseMapIdList=response.data.rt;
                    this.angle=this.getBaseMapInfoByBaseMapIdList.rotate;
                    if(this.angle==null){
                        this.angle=0;
                    }
                    var type=(this.getBaseMapInfoByBaseMapIdList.relativeUri.substr(this.getBaseMapInfoByBaseMapIdList.relativeUri.length-3)).toString();
                    this.paramsLists={type:type,source:vm.QJFileManageSystemURL+this.getBaseMapInfoByBaseMapIdList.relativeUri,angle:this.angle} //所需要的pdf的所有信息
                    console.log(this.paramsLists,'this.paramsLists');
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        message:response.data.msg
                    })
                }
            })
    },
    //获得所有监测点位
    getAllMonitorPoint(){
            var vm=this;
            // this.$refs.pic.Max_Select = 8;
            // this.$refs.pic.Max_type = 1;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/getAllMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorPointInfo=response.data.rt; //所有监测点位
                    // this.$refs.pic.loadPoints(this.monitorPointInfo);
                    // this.getTagList();
                }
            })
        },
    generateReportNumber(){
        var vm=this;
        axios({
            method:'post',
            headers:{
                'token':vm.token
            },
            url:vm.BDMSUrl+'detectionInfo/generateReportNumber',
            params:{
                userGroupId:vm.ugSelectId
            }
        }).then((response)=>{
            if(response.data.cd=='0'){
                this.onlyNum=response.data.rt;
            }
        })
    },
        getUrl(){
            console.log();
        },
        //获取报告保存的选项
        getReportSetting(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getReportSetting',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                  
                    this.getReportSettingList=response.data.rt;
                    this.coverPath=this.QJFileManageSystemURL+this.getReportSettingList.coverPath;
                    this.suggestion=this.getReportSettingList.suggestion
                    console.log(this.getReportSettingList,'this.getReportSettingList');
                    this.optimalizationSchema=this.getReportSettingList.optimalizationSchema //优化方案：1-测点顺序优先；2-图面清晰优先
                    this.baseMapPosition=this.getReportSettingList.baseMapPosition //底图位置：1-上部；2-下部
                }
            })
        },
        // 获取最新现场工况
        getSiteCondition(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getSiteCondition',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                 
                    this.getSiteConditionList=response.data.rt;
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
                    userGroupId:this.ugSelectId
                },
                }).then(response=>{
                    if(response.data.cd=='0'){
                        var weatherJson=JSON.parse(response.data.rt.weatherJson);
                        this.weatherIcon=weatherJson.data[0].wea;
                        this.weatherAir=weatherJson.data[0].tem1;
                       
                        //环形图（当前报警）
                       
                        //环形图（累计报警）
                       
                        //条形图（现场概况）
                        

                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })

        },

        //获取巡视记录
        // getPatrolRecord(){
        //       var vm=this;
        //     axios({
        //         method:'get',
        //         url:vm.BDMSUrl+'detectionInfo/getPatrolRecord',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             userGroupId:this.ugSelectId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd=='0'){
        //             // this.getReportDatasList=response.data.rt;
        //             this.getPatrolRecordList=response.data.rt;
        //         }
        //     })
        // },
        //获取监测内容主表
        getMonitorMainTable(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getMonitorMainTable',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getMonitorMainTableList=response.data.rt;
                }
            })
        },
         getPatrolRecord(){
             var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getPatrolRecord',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPatrolRecordList=response.data.rt.patrolInfos;
                    this.hasTodayRecordBoolen=response.data.rt.hasTodayRecord;
                    var map = new Map();
                    for (var i = 0; i < this.getPatrolRecordList.length;i++){
                        var patrolTypeId = this.getPatrolRecordList[i].patrolTypeId;
                        if (!map.has(patrolTypeId)) {
                            var array = new Array();
                            array.push(this.getPatrolRecordList[i]);
                            map.set(patrolTypeId, array);
                        }
                        else {
                            var array = map.get(patrolTypeId);
                            array.push(this.getPatrolRecordList[i]);
                            map.set(patrolTypeId, array);
                        }
                    }
                    var list=[];
                    map.forEach(function (value, key, mapObject) {
                        // console.log(key);
                        for(var i=0;i<value.length;i++){
                            list.push(value[i])
                        } 
                    });          
                    this.getPatrolRecordList=this.combineCell(list);

                    this.getPatrolRecordLists=this.getPatrolRecordList;
                    this.getPatrolRecordLists.forEach((item)=>{
                        this.userGroupIdList.push(item.id);
                    })
                    this.historyTime=this.getPatrolRecordLists[0].historyDate;
                    // console.log(this.userGroupIdList,'this.userGroupIdList');
                    // console.log(this.getPatrolRecordLists);
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
          //动态数据相同类型表格合并
         combineCell(list) {
            for (var field in list[0]) {
                var k = 0;
                while (k < list.length) {
                    list[k][field + 'span'] = 1;
                    list[k][field + 'dis'] = false;
                    for (var i = k + 1; i <= list.length - 1; i++) {
                        if (list[k][field] == list[i][field] && list[k][field] != '') {
                            list[k][field + 'span']++;
                            list[k][field + 'dis'] = false;
                            list[i][field + 'span'] = 1;
                            list[i][field + 'dis'] = true;
                        } else {
                            break;
                        }
                    }
                    k = i;
                }
            }
            return list;
        },
        // 获取报告所需的数据
        getReportDatas(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getReportDatas',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId,
                    beforeDate:this.$route.query.consultValue,
                    referenceDate:this.$route.query.userValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getReportDatasList=response.data.rt;
                    var mapList = new Map();
                    for (var i = 0; i < this.getReportDatasList.length;i++){
                        var itemId = this.getReportDatasList[i].itemId;
                        if (!mapList.has(itemId)) {
                            var array = new Array();
                            array.push(this.getReportDatasList[i]);
                            mapList.set(itemId, array);
                        }
                        else {
                            var array = mapList.get(itemId);
                            array.push(this.getReportDatasList[i]);
                            mapList.set(itemId, array);
                        }
                    }
                    this.getAllMonitorItemList.forEach((item)=>{
                        mapList.forEach((value, key, mapObject)=>{
                            if(key==item.id){
                                this.$set(item,'dataList',value)
                                }
                            });
                    })
                     console.log(this.getAllMonitorItemList,'getAllMonitorItemList11123')
                    
                }
            })
        },
        //通过改方法可以识别不同监测点位
        inspectSpotMethod(val){
            // console.log(this.mapList,'getReportDatasList23')
                 
        },
        //获取所有监测项目
        getAllMonitorItem(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getAllMonitorItem',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getAllMonitorItemList=response.data.rt;
                    this.getPageNumList=response.data.rt;
                    // this.getPageNumList.unshift({'name':'概述','order':-1},{'name':'巡视','order':0})
                    // this.getPageNumList.forEach((item)=>{
                    //     this.$set(item,'pageNum',item.order+2)
                    // })
                    // console.log(this.getPageNumList,'this.getPageNumList112233')

                    this.getReportDatas();

                    console.log(this.getAllMonitorItemList,'this.getAllMonitorItemList');
                }
            }) 
        },
         //html转PDF
        getPdf(){
                let pdfDom = document.querySelector('#pdfDom')
                console.log(pdfDom,'pdfDom');
                html2canvas(pdfDom, {allowTaint: true}).then(function(canvas){
                            var contentWidth = canvas.width;
                            var contentHeight = canvas.height;
                            //一页pdf显示html页面生成的canvas高度;
                            var pageHeight = contentWidth / 592.28 * 841.89;
                            //未生成pdf的html页面高度
                            var leftHeight = contentHeight;
                            //页面偏移
                            var position = 0;
                            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                            var imgWidth = 595.28;
                            var imgHeight = 592.28/contentWidth * contentHeight;
                            var pageData = canvas.toDataURL('image/jpeg', 1.0);

                            var pdf = new jsPDF('', 'pt', 'a4');

                            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                            //当内容未超过pdf一页显示的范围，无需分页
                            if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                            } else {
                                while(leftHeight > 0) {
                                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                                    leftHeight -= pageHeight;
                                    position -= 841.89;
                                    //避免添加空白页
                                    if(leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
                            pdf.save('导出检测报告.pdf');
                            console.log(pdf,'pdf1234');
                        })
                // html2canvas();
            }
    }
}
</script>
<style lang="less">
*{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{list-style: none;}
#htlmToPdf{
    width:596px;
    // width:100%;
    margin: 0 auto;
    .pdfStyle{
        .pdfCover{
            width:98%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            height: 832px;
            margin:17px auto;
            .pdfImg{
                margin-top:50px;
                #img1{
                    background: #ccc;
                }
            }
            .time{
                margin:10px auto;
                width: 80%;
                height: 14px;
                font-size:12px;
                position:relative;
                .timelabel1{
                    position: absolute;
                    left:0px;

                }
                .timelabel2{
                    position: absolute;
                    right:0px;

                }
            }
            .tableList{
                margin:10px auto;
                width: 80%;
                .tableListDiv{
                    height: 400px;
                    border:1px solid #000;
                    .tableListUl{
                        .tableListLi{
                            margin:8px;
                            height: 20px;
                            width: 98%;
                            position: relative;
                            .tableListLabel1{
                                display: inline-block;
                                position: absolute;
                                left:5px;
                                color:#000;
                                font-size: 14px;
                            }
                            .tableListLabel2{
                                 display: inline-block;
                                position: absolute;
                                right:5px;
                                color:#000;
                                font-size: 14px;
                            }
                        }
                    }
                }
                .bottom{
                    position: relative;
                    .bottom1{
                        position: absolute;
                        display: inline-block;
                        left:0px;
                    }
                    .bottom2{
                        position: absolute;
                        display: inline-block;
                        left:34px;
                        top:18px;
                    }
                    .bottom3{
                        position: absolute;
                        display: inline-block;
                        left:34px;
                        top:58px;
                        font-size:16px;
                    }
                    .bottom4{
                        position: absolute;
                        display: inline-block;
                        right:34px;
                        top:108px;
                        font-size:16px;
                    }
                    .bottom5{
                        position: absolute;
                        display: inline-block;
                        right:34px;
                        top:128px;
                        font-size:16px;
                    }
                }
            }
        }
        .pdfSummary{
            width:98%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            height: 832px;
            margin:17px auto;
            position: relative;
            .pageNum{
                    position: absolute;
                    bottom:10px;
                    left:45%;
            }
            
            .pdfSummaryHead{
                display:inline-block;
                width: 90%;
                font-size: 18px;
                color:#000;
                font-weight: bold;
                height: 40px;
                line-height: 40px;
                border-bottom:2px solid #ccc;
            }
            .pdfSummarytext{
                display:inline-block;
                width: 90%;
                 height: 40px;
                 position: relative;
                //  margin-left:5px;
                 label{
                     position: absolute;
                     left:5px;
                     top:5px;
                     font-size:16px;
                 }


            }
            .inspectTableList1{
                width: 90%;
                margin:10px auto;
                        .inspectTableList{
                            
                            border-collapse: collapse;
                            border: 1px solid #000;
                            thead{
                                // background: #f2f2f2;
                                background: #fff;
                                th{
                                    // padding-left: 6px;
                                    // padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                            tbody{
                                tr{
                                    .red{
                                        color: red;
                                    }
                                    td{
                                        // padding-left: 6px;
                                        // padding-right: 15px;
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #000;
                                        font-size: 12px;
                                        color: #333333;
                                        // .actionBtn{
                                        //     width: 18px;
                                        //     height: 18px;
                                        //     border: none;
                                        //     cursor: pointer;
                                        //     margin-left: 10px;

                                        // }
                                        // .deleteBtn{
                                        //     background: url('../../assets/delete.png') no-repeat 0 0;
                                        // }
                                        // .editBtn{
                                        //     background: url('./images/overviewedit.png') no-repeat 0 0;
                                        // }
                                        // .upmoveBtn{
                                        //     background: url('./images/overviewup.png') no-repeat 0 0;
                                        // }
                                        // .downmoveBtn{
                                        //     background: url('./images/downmove.png') no-repeat 0 0;
                                        // }
                                        // .detailBtn{
                                        //     background: url('./images/overfile.png') no-repeat 0 0;
                                        // }
                                        // .exportBtn{
                                        //     background: url('./images/overviewdown.png') no-repeat 0 0;
                                        // }
                                    }
                                }
                            }
                        }
                    }
        }
        .pdfInspection{
            margin-top:50px;
             width:98%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            height: 832px;
            margin:17px auto;
            position: relative;
            .pageNum{
                    position: absolute;
                    bottom:10px;
                    left:45%;
                }
             .pdfSummaryHead{
                display:inline-block;
                width: 90%;
                font-size: 18px;
                color:#000;
                font-weight: bold;
                height: 40px;
                line-height: 40px;
                border-bottom:2px solid #ccc;
            }
            .pdfSummarytext{
                display:inline-block;
                width: 90%;
                 height: 40px;
                 position: relative;
                //  margin-left:5px;
                 label{
                     position: absolute;
                     left:5px;
                     top:5px;
                     font-size:16px;
                 }
            }

            .containerTable{
                width: 90%;
                margin:10px auto;
                // margin-top:10px;
                .containerList{
                    border-collapse: collapse;
                    border: 1px solid #000;
                    thead{
                                background: #fff;
                                th{
                                    // padding-left: 6px;
                                    // padding-right: 15px;
                                    height: 30px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                    .left{
                                        cursor: pointer;
                                        display: inline-block;
                                        float: left;
                                        &:hover{
                                            color:#336699;
                                        }
                                    }
                                    .right{
                                        cursor: pointer;
                                        display: inline-block;
                                        float:right;
                                            &:hover{
                                            color:#336699;
                                        }
                                    }
                                }
                    }
                    tbody{
                            tr{
                                td{
                                    // padding-left: 6px;
                                    // padding-right: 15px;
                                    height: 30px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    font-size: 12px;
                                    color: #333333;
                                    .tdInp{
                                        width: 178px;
                                        height: 28px;
                                    }
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
                                    .deleteBtn{
                                        background: url('./images/delete1.png') no-repeat 0 0;
                                    }
                                }
                                .hidden{
                                    display: none;
                                }
                            }
                    }
                }
            }
        }
        .inspectUl{
           
            .inspectLi{
                 width:98%;
                border:1px solid #ccc;
                // margin-bottom: 10px;
               
                margin:17px auto;
                position: relative;
                //  margin-top:50px;
                .verticalLength{
                     height: 832px;
                    .pdfSummaryHead1{
                        display:inline-block;
                        width: 90%;
                        font-size: 18px;
                        color:#000;
                        font-weight: bold;
                        height: 40px;
                        line-height: 40px;
                        // border-bottom:2px solid #ccc;
                    }
                    .pdfSummaryHead{
                        display:inline-block;
                        width: 90%;
                        font-size: 18px;
                        color:#000;
                        font-weight: bold;
                        height: 40px;
                        line-height: 40px;
                        border-bottom:2px solid #ccc;
                    }
                    .pdfSummarytext{
                        display:inline-block;
                        width: 90%;
                        height: 40px;
                        position: relative;
                        //  margin-left:5px;
                        label{
                            position: absolute;
                            left:5px;
                            top:5px;
                            font-size:16px;
                        }
                    }
                    .txt{
                        width: 90%;
                        margin: 0 auto;
                        height: 30px;
                        position: relative;
                        .label1{
                            position: absolute;
                            left:0px;
                            font-size:14px;
                            color: #000;
                            line-height: 30px;
                        }
                        .span1{
                            position: absolute;
                            left:50%;
                            font-size:14px;
                            color: #000;
                            line-height: 30px;
                        }
                    }
                    .txt1{
                        width: 90%;
                        font-size:14px;
                        margin:0 auto;
                        color: #000;
                        line-height: 30px;
                        height: 30px;
                        position: relative;
                        label{
                            position: absolute;
                            left: 0px;
                        }
                    }
                    .bottomTabel{
                        width: 90%;
                        margin:0 auto;
                            .bottomTableList{
                                border-collapse: collapse;
                                border: 1px solid #000;
                                    thead{
                                        background: #fff;
                                        th{
                                            // padding-left: 6px;
                                            // padding-right: 15px;
                                            height: 32px;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 1px solid #000;
                                            font-size: 12px;
                                            color: #333333;
                                            font-weight: normal;
                                        }
                                    }
                                    tbody{
                                        tr{
                                            td{
                                                // padding-left: 6px;
                                                // padding-right: 15px;
                                                height: 32px;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 1px solid #000;
                                                font-size: 12px;
                                                color: #333333;
                                                .actionBtn{
                                                    width: 18px;
                                                    height: 18px;
                                                    border: none;
                                                    cursor: pointer;
                                                    margin-left: 10px;
                                                }
                                                .location{
                                                    background: url('../planCost/images/location.png') no-repeat 0 0;
                                                }
                                                .curve{
                                                    background: url('./images/graph.png') no-repeat 0 0;
                                                }

                                            }
                                        }
                                    }
                            }
                    }
                   
                    .showBasePic{
                        width: 90%;
                        margin:0 auto;
                        height: 220px;
                        margin-top:10px;
                        margin-bottom: 10px;
                        border:1px solid #ccc;
                    }
                    .pageNum{
                        position: absolute;
                        bottom:10px;
                        left:45%;
                    }
                }
                .verticalLength1{
                    .pdfSummaryHead1{
                        display:inline-block;
                        width: 90%;
                        font-size: 18px;
                        color:#000;
                        font-weight: bold;
                        height: 40px;
                        line-height: 40px;
                        // border-bottom:2px solid #ccc;
                    }
                    .pdfSummaryHead{
                        display:inline-block;
                        width: 90%;
                        font-size: 18px;
                        color:#000;
                        font-weight: bold;
                        height: 40px;
                        line-height: 40px;
                        border-bottom:2px solid #ccc;
                    }
                    .pdfSummarytext{
                        display:inline-block;
                        width: 90%;
                        height: 40px;
                        position: relative;
                        //  margin-left:5px;
                        label{
                            position: absolute;
                            left:5px;
                            top:5px;
                            font-size:16px;
                        }
                    }
                    .txt{
                        width: 90%;
                        margin: 0 auto;
                        height: 30px;
                        position: relative;
                        .label1{
                            position: absolute;
                            left:0px;
                            font-size:14px;
                            color: #000;
                            line-height: 30px;
                        }
                        .span1{
                            position: absolute;
                            left:50%;
                            font-size:14px;
                            color: #000;
                            line-height: 30px;
                        }
                    }
                    .txt1{
                        width: 90%;
                        font-size:14px;
                        margin:0 auto;
                        color: #000;
                        line-height: 30px;
                        height: 30px;
                        position: relative;
                        label{
                            position: absolute;
                            left: 0px;
                        }
                    }
                     .containerTable{
                        margin-top:10px;
                        width: 90%;
                        margin:0 auto;
                        .containerList{
                            border-collapse: collapse;
                            border: 1px solid #000;
                            thead{
                                        background: #fff;
                                        th{
                                            // padding-left: 6px;
                                            // padding-right: 15px;
                                            height: 30px;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 1px solid #000;
                                            font-size: 12px;
                                            color: #333333;
                                            font-weight: normal;
                                        }
                            }
                            tbody{
                                    tr{
                                        td{
                                            // padding-left: 6px;
                                            // padding-right: 15px;
                                            height: 30px;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 1px solid #000;
                                            font-size: 12px;
                                            color: #333333;
                                            // .actionBtn{
                                            //         width: 18px;
                                            //         height: 18px;
                                            //         border: none;
                                            //         cursor: pointer;
                                            //         margin-left: 10px;

                                            // }
                                            // .editBtn{
                                            //     background: url('./images/overviewedit.png') no-repeat 0 0;
                                            // }
                                            // .deleteBtn{
                                            //     background: url('./images/delete1.png') no-repeat 0 0;
                                            // }
                                            // .leftLayBtn{
                                            //     background: url('./images/leftLay.png') no-repeat 0 0;
                                            // }
                                            // .rightLayBtn{
                                            //     background: url('./images/rightLay.png') no-repeat 0 0;
                                            // }
                                        }
                                    }
                            }

                        }
                    }
                    .pageNum{
                        position: absolute;
                        bottom:10px;
                        left:45%;
                    }
                }
            }
        }

       

    }
    .downbtn{
        margin-top:20px;
        margin-bottom:20px;
        background: #fc3439;
        // margin-right: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
        width: 111px;
        height: 36px;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 2px;
    }

}


</style>


