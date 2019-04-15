<template>
    <div id="htlmToPdf"  >
        <!-- v-loading="pdfShow" -->
        <div  class="pdfStyle" id="pdfDom">
                <!-- 封面 -->
                <div class="pdfCover">
                    <div id="pdfImg">
                         <!-- <img id="img1" style="width:400px;height:100px;" src="../../assets/huajianlogo.png"/> -->
                        <img id="img1" style="width:160mm;height:40mm;"  >
                        <!-- <img id="img1" style="width:400px;height:100px;" :src="main(coverPath)"> -->
                    </div>
                    <h5 style="margin-top:20px;color:#000;font-size:4.94mm;">{{projectName}}--监测报表</h5>
                    <div class="time"><label class="timelabel1">报告编码：{{onlyNum}}</label></div>
                    <div class="time"><label class="timelabel1" >本次观测日期：{{beforeDate|timeChange()}}</label><label class="timelabel2">前次观测日期：{{referenceDate|timeChange()}}</label></div> 
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
                    <!-- <div class="qrcodeBody" v-show="generateQrcode==1">
                            <img style="margin-right:-150px;width:60px;height:60px;" :src="BDMSUrl+'/QRCode2/getQRimage/'+'{'+onlyNum+'}'" />
                            <label class="onlyNumStyle">报告编码：{{onlyNum}}</label>
                    </div> -->
                    <label class="pdfSummaryHead">概述</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <div class="txt"><label class="label1">观测时间：{{beforeDate|timeChange()}}</label></div>
                    <div class="inspectTableList1">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                                <!-- <tr class="contentTr"></tr> -->
                                <thead>
                                    <tr>
                                        <th style="height:25mm;">工况</th>
                                        <th style="height:25mm;padding:10px" colspan="11">{{getSiteConditionList}}</th>
                                    </tr>
                                    <tr>
                                        <th>序号</th>
                                        <th>监测内容</th>
                                        <th>点号</th>
                                        <th>本次最大变化量</th>
                                        <th>是否报警</th>
                                        <th>点号</th>
                                        <th>累计变化最大量</th>
                                        <th>是否报警</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in getMonitorMainTableListTable" :key="index">
                                        <td v-text="index+1"></td>
                                        <td v-text="item.name"></td>
                                        <td >{{item.recentPointName|addSpritNum()}}</td>
                                        <td>{{item.recentVariation|addSprit1()}}</td>
                                        <td :class="[{'red':item.recentAlert==true}]" >{{item.recentAlert|shifouChange()}}</td>
                                        <td>{{item.totalPointName|addSpritNum()}}</td>
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
                     <!-- <div class="qrcodeBody" v-show="generateQrcode==1">
                            <img style="margin-right:-150px;width:60px;height:60px;" :src="BDMSUrl+'/QRCode2/getQRimage/'+'{'+onlyNum+'}'" />
                            <label class="onlyNumStyle">报告编码：{{onlyNum}}</label>
                    </div> -->
                     <label class="pdfSummaryHead">现场巡检报表</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <div class="txt"><label class="label1">观测者：</label><span class="span1"><label>观测时间：</label></span></div>
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
                    <div class="baseWord"><div class="baseWord1">工程负责人：</div><div class="baseWord2">监测单位：{{projectName}}</div></div>
                </div>
                <!-- 公共面积 -->
                <ul class="inspectUl">
                    <li class="inspectLi" v-for="(item,index) in getAllMonitorItemList" :key="index">
                       
                        <div class="verticalLength" v-show="item.type!=5">
                             <!-- <div class="qrcodeBody" v-show="generateQrcode==1">
                                <img style="margin-right:-150px;width:60px;height:60px;" :src="BDMSUrl+'/QRCode2/getQRimage/'+'{'+onlyNum+'}'" />
                                <label class="onlyNumStyle">报告编码：{{onlyNum}}</label>
                            </div> -->
                            <label class="pdfSummaryHead1">{{company}}</label>
                            <label class="pdfSummaryHead">监测报表</label>
                            <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                            <!-- <div class="txt"><label class="label1">测量日期</label><span class="span1"><label style="font-size:3.70mm;display:inline-block;margin-right:5px;">观测：{{item.getItemDutyUserList.observerName}}</label><label style="font-size:3.70mm;display:inline-block;margin-right:5px;">计算：{{item.getItemDutyUserList.calculatorName}}</label><label style="font-size:3.70mm;display:inline-block;margin-right:5px;">检核：{{item.getItemDutyUserList.inspectorName}}</label></span></div> -->
                            <div class="txt1"><label>监测内容：{{item.name}}</label></div>
                            <!-- <div class="bottomTabel2" v-show="baseMapPosition==1">
                                <div class="bottomTabelDiv"  style="padding: 0px; overflow: hidden;">
                                        <div class="bottomTabelDiv1">
                                            <picView  @load_points="allLoad(item.monitorPointInfo,item.id,item.type)" :id="'pic'+item.id" :ref="'pic'+item.id" :para="item.paramsLists" ></picView>
                                        </div>
                                </div>
                             </div> -->
                            <div class="bottomTabel" >
                                <table :id="'bottomTableList'+item.id" class="bottomTableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th rowspan="2">测点编号</th>
                                            <th colspan="2" v-show="item.type==1">位移(mm)</th>
                                            <th colspan="2" v-show="item.type==2">高程(m)</th>
                                            <th colspan="2" v-show="item.type==3">水位(m)</th>
                                            <th v-show="item.type==3">管口(m)</th>
                                            <th colspan="2" v-show="item.type==4">受力(KN)</th>
                                            <th colspan="2" v-show="item.type==1">变化量(mm)</th>
                                            <th colspan="2" v-show="item.type==2">变化量(mm)</th>
                                            <th colspan="2" v-show="item.type==3">变化量(cm)</th>
                                            <th colspan="2" v-show="item.type==4">变化量(kN)</th>
                                            <th rowspan="2">备注</th>
                                        </tr>
                                        <tr>
                                            <th>初始</th>
                                            <th>本次</th>
                                            <th v-show="item.type==3">本次</th>
                                            <th>本次</th>
                                            <th>累计</th>
                                            <!-- <td></td> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(val,index) in item.dataList" :key="index"> 
                                            <td>{{val.pointName|addSpritNum()}}</td>
                                            <td >{{val.initValue|addSprit()}}</td>
                                            <td >{{val.currentValue|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.seqId|addSprit()}}</td>
                                            <td v-show="item.type==1">{{val.currentVariation|addSpritTo()}}</td>
                                            <td v-show="item.type==1">{{val.totalVariation|addSpritTo()}}</td>
                                            <td v-show="item.type==2">{{val.currentVariation*1000|addSprit()}}</td>
                                            <td v-show="item.type==2">{{val.totalVariation*1000|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.currentVariation*100|addSprit()}}</td>
                                            <td v-show="item.type==3">{{val.totalVariation*100|addSprit()}}</td>
                                            <td v-show="item.type==4">{{val.currentVariation|addSprit()}}</td>
                                            <td v-show="item.type==4">{{val.totalVariation|addSprit()}}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="bottomTabel1" v-show="baseMapPosition==2">
                                <!-- <div  class="bottomTabelDiv" style="padding: 0px; overflow: hidden;">
                                    <div class="bottomTabelDiv1">
                                        <picView  @load_points="allLoad(item.monitorPointInfo,item.id,item.type)" :id="'pic'+item.id" :ref="'pic'+item.id" :para="item.paramsLists" ></picView>
                                     </div>
                                </div> -->
                                 <table class="bottomTableList1" border="1" cellspacing="0" width="100%">
                                    <tbody>
                                        <!-- <tr>
                                            <td></td>
                                            <td colspan="6" style="height:200px"></td>
                                        </tr> -->
                                        <tr>
                                            <td rowspan="3">说明</td>
                                            <td colspan="6" style="text-align:left;margin-left:2px;">1、报警值：变化速率》3mm/d,累计值达到30mm</td>
                                        </tr>
                                        <tr>
                                            <td colspan="6"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="6"></td>
                                        </tr>
                                    </tbody>
                                 </table>
                            </div>
                            <div class="bottomTabel3" v-show="baseMapPosition==1">
                                 <table class="bottomTableList1" border="1" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td rowspan="3">说明</td>
                                            <td colspan="6" style="text-align:left;margin-left:2px;">1、报警值：变化速率>=3mm/d,累计值达到30mm</td>
                                        </tr>
                                        <tr>
                                            <td colspan="6"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="6"></td>
                                        </tr>
                                    </tbody>
                                 </table>
                            </div>
                            <!-- <div  class="showBasePic"></div> -->
                            <div class="pageNum"><label class="pageNum1">第{{item.order+2}}页</label></div>
                        </div>
                        <!-- <div class="commonSlope" v-show="item.type==5">
                            <label class="pdfSummaryHead1">{{company}}</label>
                            <label class="pdfSummaryHead">监测报表</label>
                            <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                            <div class="txt"><label class="label1">测量日期</label><span class="span1"><label>观测：</label><label>计算：</label><label>检核：</label></span></div>
                            <div class="txt1"><label>监测内容：{{item.name}}</label></div>
                            <div class="slopeTable">
                                <div class="slopeTableBody">
                                    <div class="left">
                                        <div class="leftTable">
                                            <table  border="1" cellspacing="0" width="100%">
                                                <thead>
                                                    <tr>
                                                        <th rowspan="2">深度(m)</th>
                                                        <th colspan="2">位移量(mm)</th>
                                                        <th rowspan="2">本次变化</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(val,index) in item.dataList" :key="index">
                                                        <td>{{val.otherParam}}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                   
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="leftLine"></div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                    </li>
                </ul>
                <!-- 下载到本地 -->
        </div>
        <div>
            <button class="downbtn" @click="getPdf()">下载到本地</button>
             <button class="downbtn" @click="getExcel()">导出excel表</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import pdf from 'vue-pdf'
import moment from 'moment'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import picView from './picView.vue'
import {method5} from './js/method.js'
// var dpiWidth;
// var dpiHeight;
export default {
     components: {
        pdf,jsPDF,html2canvas,picView
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
            getMonitorMainTableListTable:[],
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
            generateQrcode:'',//是否有二维码
            onlyNum:'',//报告编码
            beforeDate:this.$route.query.consultValue,
            referenceDate:this.$route.query.userValue,
            nowDate:'',
            imgUrl:'',
            dpiWidth:'',
            dpiHeight:'',
            pdfShow:false,
            getItemDutyUserList:'',
            getItemDutyUserList1:{
                calculator:null,
                calculatorName:null,
                id:null,
                inspector:null,
                inspectorName:null,
                itemId:null,
                observer:null,
                observerName:null
            },

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
        this.getAllMonitorPoint();
        this.getReportSetting();
        this.getMonitorMainTable();
        this.getPatrolRecord();
        this.getSiteCondition();
        this.getDetectionSummary();
        this.getAllMonitorItem();
        this.getBaseMapInfoByBaseMapId();
        this.generateReportNumber();
        this.curTime();
        this.getdpi();
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
                return val.toFixed(3)
            }
        },
         addSpritTo(val){
            if(val==null){
                return '/'
            }else {
                return val.toFixed(1)
            }
        },
        addSpritNum(val){
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
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
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
        getdpi(){
            // dpiWidth=window.screen.width;
            // dpiHeight=window.screen.height;
            // dpiWidth=window.screen.deviceXDPI
            // dpiHeight=window.screen.deviceYDPI
            // window.screen.deviceXDPI
            // console.log(window.screen.deviceXDPI,'window.screen.deviceXDPI');
            this.dpiHeight = 'width:'+(210*window.screen.deviceYDPI)/25.4+'px;';
            this.dpiWidth= 'width:'+(210*window.screen.deviceXDPI)/25.4+'px;';
            // console.log(this.dpiWidth,'this.dpiWidth');
            // console.log(this.dpiHeight,'this.dpiHeight');
        },
         timeChangeMethod(val) {
                return moment(val).format("YYYY-MM-DD hh:mm:ss");
        },
        getItemDutyUser(val){
            var vm=this;
            this.getItemDutyUserList='';
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:val
                }
            }).then((response)=>{
                if(response.data.rt){
                     this.getItemDutyUserList=response.data.rt;
                     this.getAllMonitorItemList.forEach((item)=>{
                         if(item.id==this.getItemDutyUserList.itemId){
                             this.$set(item,'getItemDutyUserList',this.getItemDutyUserList)
                         }else{
                             this.$set(item,'getItemDutyUserList',this.getItemDutyUserList1)
                         }
                     })
                     console.log(this.getAllMonitorItemList,'this.getAllMonitorItemList');
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
            // console.log(date,'date');
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
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;
        },

    // main(src){
    //     var image = new Image();
    //     image.src = src + '?v=' + Math.random(); // 处理缓存
    //     image.crossOrigin = "*";  // 支持跨域图片
        
    //     image.onload=function(){
    //         var base64 =this.getBase64Image(image);
    //         console.log(base64,'base64');
    //         // cb && cb(base64);
    //     }
    // },
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
                    // console.log(this.paramsLists,'this.paramsLists0000');
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        message:response.data.msg
                    })
                }
            })
    },
    allLoad(val,id,type){
        var str='pic'+id;

        for(let i = 0; i < val.length;i++){
            val[i].data = "";
        }

        
        this.$refs[str][0].loadPoints(val);
        this.$refs[str][0].enableLabel(true);
        this.$refs[str][0].setPointScale(0.5);
       
        for(let i = 0; i < this.getAllMonitorItemList.length;i++){
            this.$refs[str][0].enableType(this.getAllMonitorItemList[i].type,this.getAllMonitorItemList[i].id,this.getAllMonitorItemList[i].spotNum);
        }
        this.$refs[str][0].enableType(type,id,true);
            // 523.0,210.0
        switch(this.optimalizationSchema){
            case 1:this.$refs[str][0].print_priority_points(698.0,359.0);break;
            case 2:this.$refs[str][0].print_priority_pic(698.0,359.0);break;
        }
        
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
                    // console.log(this.monitorPointInfo,'this.monitorPointInfo');
                    // console.log(this.monitorPointInfo);
                    //         var a='';
                    // this.getAllMonitorItemList.forEach((item)=>{
                    //         console.log(item.id,'000');
                    //          a='pic'+item.id;
                    //         console.log(a,'111');
                    //         this.$refs.a.loadPoints(this.monitorPointInfo);
                    // })
                   
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
                    this.getUrl()
                    this.suggestion=this.getReportSettingList.suggestion
                    // console.log(this.getReportSettingList,'this.getReportSettingList');
                    this.optimalizationSchema=this.getReportSettingList.optimalizationSchema //优化方案：1-测点顺序优先；2-图面清晰优先
                    this.baseMapPosition=this.getReportSettingList.baseMapPosition //底图位置：1-上部；2-下部
                    this.generateQrcode=this.getReportSettingList.generateQrcode
                }
            })
        },
        getUrl(){
            axios({
                method:'get',
                responseType:'blob',
                url:this.coverPath
            }).then((response)=>{
                var a=response.data;
                // console.log(a,'url1111');
                let reader = new window.FileReader();
                reader.onloadend = function() {
                    const data = reader.result;
                     
                    // console.log(data);
                    // this.imgUrl = data;
                    document.getElementById('img1').src=data
                };
                reader.readAsDataURL(a);
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
                    var length=this.getMonitorMainTableList.length;
                    this.getMonitorMainTableListTable=[];
                    if(length<14){
                        for(var i=0;i<length;i++){
                            this.getMonitorMainTableListTable.push(this.getMonitorMainTableList[i]);
                        }
                        for(var i=length;i<14;i++){
                            this.getMonitorMainTableListTable.push({baseMapId:null,count:null,id:null,keyword:null,latestTime:null,logogram:null,name:null,recentAlert:null,recentPointId:null
                                ,recentPointName:null
                                ,recentVariation:null
                                ,totalAlert:null
                                ,totalPointId:null
                                ,totalPointName:null
                                ,totalVariation:null
                                ,type:null})
                        }

                    }else if(length>14){
                         for(var i=0;i<14;i++){
                            this.getMonitorMainTableListTable.push(this.getMonitorMainTableList[i]);
                        }
                    }else{
                        for(var i=0;i<14;i++){
                             this.getMonitorMainTableListTable.push({baseMapId:null,count:null,id:null,keyword:null,latestTime:null,logogram:null,name:null,recentAlert:null,recentPointId:null
                                ,recentPointName:null
                                ,recentVariation:null
                                ,totalAlert:null
                                ,totalPointId:null
                                ,totalPointName:null
                                ,totalVariation:null
                                ,type:null})
                        }
                    }
                    console.log(this.getMonitorMainTableListTable,'this.getMonitorMainTableListTable11');
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
                    beforeDate:this.timeChangeMethod(this.$route.query.consultValue),
                    referenceDate:this.timeChangeMethod(this.$route.query.userValue)
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getReportDatasList=response.data.rt;
                    // this.getReportDatasList.forEach((item)=>{
                        
                    // })
                    // console.log(this.getReportDatasList,'this.getReportDatasList');
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
                            // console.log(value,'value1');
                            console.log(key,'key1');
                            if(key==item.id){
                                
                                    // console.log(value,'value123');
                                    var aLength=0;
                                    aLength=value.length;
                                    if(aLength<=20){
                                        for(var i=aLength;i<20;i++){
                                            value.push({acquisitionTime:null,currentValue:null,currentVariation:null,initValue:null
                                                        ,itemId:null
                                                        ,itemType:null
                                                        ,otherParam:null
                                                        ,pointId:null
                                                        ,pointName:null
                                                        ,referenceValue:null
                                                        ,seqId:null
                                                        ,totalVariation:null})
                                        }
                                    }
                                    this.$set(item,'dataList',value);
                                    this.$set(item,'paramsLists',this.paramsLists);
                                    this.$set(item,'monitorPointInfo',this.monitorPointInfo);
                                    this.$set(item,'spotNum',false);
                                    this.getItemDutyUser(item.id)
                                    // this.$set(item,'getItemDutyUserList',this.getItemDutyUserList);
                                   
                                }
                            });
                    })
                     console.log(this.getAllMonitorItemList,'getAllMonitorItemList1112311');
                    //  ColorThemeJSON={'name':'','info':'','item':{'name':'','ColorID':'',}}
                    
                }
            })
        },
        ///detectionInfo/getItemDutyUser
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

                    // console.log(this.getAllMonitorItemList,'this.getAllMonitorItemList');
                }
            }) 
        },
        getExcel(){
            this.getAllMonitorItemList.forEach((item)=>{
                    method5('bottomTableList'+item.id);
            })
        },
         //html转PDF
        getPdf(){
            this.pdfShow=true;
                let pdfDom = document.querySelector('#pdfDom')
                // console.log(pdfDom,'pdfDom');
                html2canvas(pdfDom, {allowTaint: true}).then(function(canvas){
                            var contentWidth = canvas.width;
                            var contentHeight = canvas.height;
                            //一页pdf显示html页面生成的canvas高度;
                            var pageHeight = contentWidth / 592.28 * 841.89;
                            // var pageHeight = contentWidth / 794 * 1123;
                            //未生成pdf的html页面高度
                            var leftHeight = contentHeight;
                            // console.log(contentWidth,'contentWidth');
                            // console.log(contentHeight,'contentHeight');
                            //页面偏移
                            var position = 0;
                            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                            var imgWidth = 592.28;
                            var imgHeight = 592.28/contentWidth * contentHeight;
                            var pageData = canvas.toDataURL('image/jpeg', 1.0);
                            // console.log(imgWidth,'imgWidth');
                            // console.log(imgHeight,'imgHeight');
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
                            this.pdfShow=false;
                            // console.log(pdf,'pdf1234');
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
    // width:596px;
    // width: 210mm;
    // width:100%;
    margin: 0 auto;
    .pdfStyle{
        //  width:596px;
        width: 210mm;
        // width:100%;
        margin: 0 auto;
        .pdfCover{
            width:98%;
            //  width:100%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            // height: 830px;
            margin:0 auto;
            height:298mm;
            // margin:17px auto;
            #pdfImg{
                margin-top:15mm;
                height: 45mm;
                #img1{
                    background: #ccc;
                }
            }
            .time{
                // margin:10px auto;
                // width: 80%;
                // height: 14px;
                // font-size:12px;
                // position:relative;
                 margin:10px auto;
                width: 80%;
                height: 8mm;
                font-size:3.70mm;
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
                    // height: 400px;
                    // border:1px solid #000;
                    height: 130mm;
                    border:1px solid #000;
                    overflow: hidden;
                    .tableListUl{
                        .tableListLi{
                            margin:8px;
                            // height: 20px;
                            height: 5mm;
                            width: 98%;
                            position: relative;
                            .tableListLabel1{
                                display: inline-block;
                                position: absolute;
                                left:5px;
                                color:#000;
                                // font-size: 14px;
                                font-size: 3.70mm;
                            }
                            .tableListLabel2{
                                 display: inline-block;
                                position: absolute;
                                right:5px;
                                color:#000;
                                // font-size: 14px;
                                font-size: 3.70mm;
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
                        // font-size:16px;
                        font-size:4.23mm;
                    }
                    .bottom4{
                        position: absolute;
                        display: inline-block;
                        right:34px;
                        top:108px;
                        // font-size:16px;
                        font-size: 5.29mm;
                    }
                    .bottom5{
                        position: absolute;
                        display: inline-block;
                        right:34px;
                        top:128px;
                         font-size: 5.29mm;
                        // font-size:16px;
                    }
                }
            }
        }
       
        .pdfSummary{
            width:98%;
            //  width:100%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            height: 295mm;
            margin:10px auto;
            // margin:17px auto;
            position: relative;
             .qrcodeBody{
                 position: absolute;
                 right:37px;
                 top:42px;
                 .onlyNumStyle{
                     display: block;
                     margin-left:30px;
                 }
            }
            .pageNum{
                    position: absolute;
                    top:159px;
                    right:90px;
            }
            
            .pdfSummaryHead{
                // display:inline-block;
                // width: 90%;
                // font-size: 16px;
                // color:#000;
                // font-weight: bold;
                // height: 28px;
                // line-height: 28px;
                // margin-top:22px;
                // border-bottom:1px solid black;
                //*
                display:inline-block;
                width: 90%;
                font-size: 4.94mm;
                color:#000;
                font-weight: bold;
                height: 15mm;
                line-height: 15mm;
                margin-top:25mm;
                border-bottom:1px solid black;
            }
            .pdfSummarytext{
                // display:inline-block;
                // width: 90%;
                //  height: 24px;
                //  position: relative;
                //  border-top:1px solid black;
                // margin-top:2px;
                //*
                display:inline-block;
                width: 90%;
                 height: 7mm;
                 position: relative;
                 border-top:1px solid black;
                margin-top:1mm;
                
                 label{
                     position: absolute;
                     left:0px;
                     top:5px;
                     font-size:3.70mm;
                 }
            }
            .txt{
                    // width: 90%;
                    // margin: 0 auto;
                    // height: 24px;
                    // position: relative;
                    width: 90%;
                    margin: 0 auto;
                    height: 8mm;
                    position: relative;
                    .label1{
                        // position: absolute;
                        // left:0px;
                        // font-size:12px;
                        // color: #000;
                        // line-height: 24px;
                        position: absolute;
                        left:0px;
                        font-size:3.70mm;
                        color: #000;
                        line-height: 8mm;
                    }
                    .span1{
                        position: absolute;
                        left:42%;
                        font-size:3.70mm;
                        line-height: 8mm;
                        // font-size:12px;
                        color: #000;
                        // line-height: 24px;
                    }
            }
            .inspectTableList1{
                width: 90%;
                margin:0px auto;
                        .inspectTableList{
                            border-collapse: collapse;
                            border: 1px solid #000;
                            thead{
                                // background: #f2f2f2;
                                background: #fff;
                                th{
                                    // height: 32px;
                                    // text-align: center;
                                    // box-sizing: border-box;
                                    // border-right: 1px solid #000;
                                    // font-size: 12px;
                                    // color: #333333;
                                    // font-weight: normal;

                                    height: 10mm;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    font-size: 4.23mm;
                                    color: #333333;
                                    font-weight: normal;
                                    
                                }
                            }
                            tbody{
                                height: 169mm;
                                overflow: hidden;
                                tr{
                                    .red{
                                        color: red;
                                    }
                                    td{
                                        // height: 32px;
                                        // text-align: center;
                                        // box-sizing: border-box;
                                        // border-right: 1px solid #000;
                                        // font-size: 12px;
                                        // color: #333333;

                                        height: 10mm;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #000;
                                        font-size: 4.23mm;
                                        color: #333333;
                                        font-weight: normal;
                                    }
                                }
                            }
                        }
                    }
        }
        .pdfInspection{
            // margin-top:50px;
             width:98%;
            //  width:100%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            // height: 830px;
            height: 295mm;
            margin:10px auto;
            // margin:17px auto;
            position: relative;
            .qrcodeBody{
                 position: absolute;
                 right:37px;
                 top:42px;
                 .onlyNumStyle{
                     display: block;
                     margin-left:30px;
                 }
            }
            .pageNum{
                    position: absolute;
                    top:159px;
                    right:90px;
            }
             .pdfSummaryHead{
            //     display:inline-block;
            //     width: 90%;
            //     font-size: 16px;
            //     color:#000;
            //     font-weight: bold;
            //     height: 28px;
            //     line-height: 28px;
            //    border-bottom:1px solid black;
            //    margin-top:22px;
                display:inline-block;
                width: 90%;
                font-size: 4.94mm;
                color:#000;
                font-weight: bold;
                height: 15mm;
                line-height: 15mm;
                margin-top:25mm;
                border-bottom:1px solid black;
            }
            .pdfSummarytext{
                // display:inline-block;
                // width: 90%;
                //  height: 24px;
                //  position: relative;
                //  border-top:1px solid black;
                // margin-top:2px;
                 display:inline-block;
                width: 90%;
                 height: 7mm;
                 position: relative;
                 border-top:1px solid black;
                margin-top:1mm;
                
                 label{
                     position: absolute;
                     left:0px;
                     top:5px;
                    //  font-size:12px;
                    font-size:3.70mm;
                 }
            }
             .txt{
                    // width: 90%;
                    // margin: 0 auto;
                    // height: 24px;
                    // position: relative;
                    width: 90%;
                    margin: 0 auto;
                    height: 8mm;
                    position: relative;
                    .label1{
                        // position: absolute;
                        // left:0px;
                        // font-size:12px;
                        // color: #000;
                        // line-height: 24px;
                         position: absolute;
                        left:0px;
                        font-size:3.70mm;
                        color: #000;
                        line-height: 8mm;
                        
                    }
                    .span1{
                        position: absolute;
                        left:42%;
                        font-size:12px;
                        color: #000;
                        line-height: 24px;
                    }
            }

            .containerTable{
                width: 90%;
                margin:0px auto;
                // margin-top:10px;
                .containerList{
                    border-collapse: collapse;
                    border: 1px solid #000;
                    thead{
                                background: #fff;
                                th{
                                    // padding-left: 6px;
                                    // padding-right: 15px;
                                    // height: 30px;
                                    height: 10mm;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    // font-size: 12px;
                                    font-size: 4.23mm;
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
                                    // height: 30px;
                                    height: 10mm;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #000;
                                    // font-size: 12px;
                                    font-size: 4.23mm;
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
            .baseWord{
                position: absolute;
                bottom:20px;
                right:10px;
                height: 10mm;
                width:100%;
                .baseWord1{
                    position: absolute;
                    left: 41px;
                    width: 60mm;
                    text-align: left;
                    font-size: 4.23mm;
                }
                .baseWord2{
                    position: absolute;
                    right: 0px;
                    width: 60mm;
                    text-align: left;
                    font-size: 4.23mm;
                }
            }
        }
        .inspectUl{
           margin:0 auto;
            .inspectLi{
                margin:10px auto;
                position: relative;
                width:98%;
                .qrcodeBody{
                    position: absolute;
                    right:37px;
                    top:10px;
                    .onlyNumStyle{
                        display: block;
                        margin-left:30px;
                    }
                }
                .verticalLength{
                    //  height: 832px;
                     
                    //  width:100%;
                    border:1px solid #ccc;
                    height: 295mm;
                    .pdfSummaryHead1{
                        // display:inline-block;
                        // width: 90%;
                        // font-size: 16px;
                        // color:#000;
                        // font-weight: bold;
                        // height: 26px;
                        // line-height: 26px;
                        // margin-top:22px;

                        display:inline-block;
                        width: 90%;
                        font-size: 4.94mm;
                        color:#000;
                        font-weight: bold;
                        height: 7mm;
                        line-height: 7mm;
                        margin-top:12mm;
                    
                    }
                    .pdfSummaryHead{
                        // display:inline-block;
                        // width: 90%;
                        // font-size: 14px;
                        // color:#000;
                        // font-weight: bold;
                        // height: 26px;
                        // line-height: 26px;
                        // border-bottom:1px solid black;

                        display:inline-block;
                        width: 90%;
                        font-size: 4.23mm;
                        color:#000;
                        font-weight: bold;
                        height: 6mm;
                        line-height: 6mm;
                        border-bottom:1px solid black;
                    }
                    .pdfSummarytext{
                        // display:inline-block;
                        // width: 90%;
                        // height: 24px;
                        // position: relative;
                        // border-top:1px solid black;
                        // margin-top:2px;
                        display:inline-block;
                        width: 90%;
                        height: 6mm;
                        position: relative;
                        border-top:1px solid black;
                        margin-top:2px;
                        label{
                            // position: absolute;
                            // left:0px;
                            // top:5px;
                            // font-size:12px;
                             position: absolute;
                            left:0px;
                            top:5px;
                            font-size:3.70mm;
                        }
                    }
                    .txt{
                        // width: 90%;
                        // margin: 0 auto;
                        // height: 24px;
                        // position: relative;
                        width: 90%;
                        margin: 0 auto;
                        height: 8mm;
                        position: relative;
                        .label1{
                            // position: absolute;
                            // left:0px;
                            // font-size:12px;
                            // color: #000;
                            // line-height: 24px;
                             position: absolute;
                            left:0px;
                            font-size:3.70mm;
                            color: #000;
                            line-height: 8mm;
                        }
                        .span1{
                            // position: absolute;
                            // left:42%;
                            // font-size:12px;
                            // color: #000;
                            // line-height: 24px;
                            position: absolute;
                            left:42%;
                            font-size:3.70mm;
                            color: #000;
                            line-height: 8mm;
                        }
                    }
                    .txt1{
                        // width: 90%;
                        // font-size:12px;
                        // margin:0 auto;
                        // color: #000;
                        // line-height: 24px;
                        // height: 24px;
                        // position: relative;
                         width: 90%;
                        font-size:3.70mm;
                        margin:0 auto;
                        color: #000;
                        line-height: 6mm;
                        height: 6mm;
                        position: relative;
                        label{
                            position: absolute;
                            left: 0px;
                            // font-size: 
                        }
                    }
                    .bottomTabel{
                        width: 90%;
                        margin:0 auto;
                        // height: 395px;
                        height: 133.7mm;
                        overflow: hidden;
                            .bottomTableList{
                                border-collapse: collapse;
                                border: 0.5px solid #000;
                                    thead{
                                        background: #fff;
                                        th{
                                            // padding-left: 6px;
                                            // padding-right: 15px;
                                            // height: 18px;
                                            height: 5mm;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 0.5px solid #000;
                                            // font-size: 12px;
                                            font-size: 4.23mm;
                                            color: #333333;
                                            font-weight: normal;
                                        }
                                    }
                                    tbody{
                                        tr{
                                            td{
                                                // padding-left: 6px;
                                                // padding-right: 15px;
                                                // height: 18px;
                                                height: 6mm;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 0.5px solid #000;
                                                // font-size: 12px;
                                                font-size: 4.23mm;
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
                    .bottomTabel1{
                        width: 90%;
                        margin:0px auto;
                       
                        .bottomTabelDiv{
                            height: 359px;
                            border-left:1px solid #000;
                            border-right:1px solid #000;
                             position: relative;
                            .bottomTabelDiv1{
                                width: 100%;
                                position:absolute;
                                top:0px;
                                left: 0px;

                            }

                        }
                        .bottomTableList1{
                             border-collapse: collapse;
                            border-left: 0.5px solid #000;
                            border-right: 0.5px solid #000;
                            border-bottom: 0.5px solid #000;
                                tbody{
                                        tr{
                                            td{
                                                height: 5mm;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 0.5px solid #000;
                                                font-size: 4.23mm;
                                                color: #333333;
                                            }
                                        }
                                    }
                            }
                    }
                    .bottomTabel2{
                        width: 90%;
                        margin:0px auto;
                       
                        .bottomTabelDiv{
                            height: 359px;
                            border-top:1px solid #000;
                            border-left:1px solid #000;
                            border-right:1px solid #000;
                             position: relative;
                            .bottomTabelDiv1{
                                width: 100%;
                                position:absolute;
                                top:0px;
                                left: 0px;

                            }

                        }
                        .bottomTableList1{
                             border-collapse: collapse;
                            border-left: 0.5px solid #000;
                            border-right: 0.5px solid #000;
                            border-bottom: 0.5px solid #000;
                                tbody{
                                        tr{
                                            td{
                                                height: 5mm;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 0.5px solid #000;
                                                font-size: 4.23mm;
                                                color: #333333;
                                            }
                                        }
                                    }
                            }
                    }
                    .bottomTabel3{
                        width: 90%;
                        margin:-2px auto;
                        
                        .bottomTabelDiv{
                            height: 359px;
                            border-top:1px solid #000;
                            border-left:1px solid #000;
                            border-right:1px solid #000;
                                position: relative;
                            .bottomTabelDiv1{
                                width: 100%;
                                position:absolute;
                                top:0px;
                                left: 0px;
                            }
                        }
                        .bottomTableList1{
                                border-collapse: collapse;
                            border-left: 0.5px solid #000;
                            border-right: 0.5px solid #000;
                            border-bottom: 0.5px solid #000;
                                tbody{
                                        tr{
                                            td{
                                                height: 5mm;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 0.5px solid #000;
                                                font-size: 4.23mm;
                                                color: #333333;
                                            }
                                        }
                                    }
                            }
                    }

                   
                    .showBasePic{
                        width: 90%;
                        margin:0 auto;
                        height: 210px;
                        margin-top:10px;
                        margin-bottom: 10px;
                        border:1px solid #ccc;
                    }
                    .pageNum{
                        position: absolute;
                        top:101px;
                        right:90px;
                    }
                }
                .verticalLength1{
                    .pdfSummaryHead1{
                        display:inline-block;
                        width: 90%;
                        font-size: 16px;
                        color:#000;
                        font-weight: bold;
                        height: 26px;
                        line-height: 28px;
                        margin-top:22px;
                        // border-bottom:2px solid #ccc;
                    }
                    .pdfSummaryHead{
                        display:inline-block;
                        width: 90%;
                        font-size: 16px;
                        color:#000;
                        font-weight: bold;
                        height: 28px;
                        line-height: 28px;
                        border-bottom:1px solid black;
                    }
                    .pdfSummarytext{
                        display:inline-block;
                        width: 90%;
                        height: 24px;
                        position: relative;
                        border-top:1px solid black;
                        margin-top:2px;
                        //  margin-left:5px;
                        label{
                            position: absolute;
                            left:0px;
                            top:5px;
                            font-size:12px;
                        }
                    }
                    .txt{
                        width: 90%;
                        margin: 0 auto;
                        height: 24px;
                        position: relative;
                        .label1{
                            position: absolute;
                            left:0px;
                            font-size:12px;
                            color: #000;
                            line-height: 24px;
                        }
                        .span1{
                            position: absolute;
                            left:50%;
                            font-size:12px;
                            color: #000;
                            line-height: 24px;
                        }
                    }
                    .txt1{
                        width: 90%;
                        font-size:12px;
                        margin:0 auto;
                        color: #000;
                        line-height: 24px;
                        height: 24px;
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
                        top:71px;
                        right:90px;
                    }
                }
                .commonSlope{
                      height: 832px;
                    .pdfSummaryHead1{
                        display:inline-block;
                        width: 90%;
                        font-size: 16px;
                        color:#000;
                        font-weight: bold;
                        height: 26px;
                        line-height: 26px;
                        margin-top:22px;
                        // border-bottom:2px solid #ccc;
                    }
                    .pdfSummaryHead{
                        display:inline-block;
                        width: 90%;
                        font-size: 14px;
                        color:#000;
                        font-weight: bold;
                        height: 26px;
                        line-height: 26px;
                        border-bottom:1px solid black;
                    }
                    .pdfSummarytext{
                        display:inline-block;
                        width: 90%;
                        height: 24px;
                        position: relative;
                        //  margin-left:5px;
                        border-top:1px solid black;
                        margin-top:2px;
                        label{
                            position: absolute;
                            left:0px;
                            top:5px;
                            font-size:12px;
                        }
                    }
                    .txt{
                        width: 90%;
                        margin: 0 auto;
                        height: 24px;
                        position: relative;
                        .label1{
                            position: absolute;
                            left:0px;
                            font-size:12px;
                            color: #000;
                            line-height: 24px;
                        }
                        .span1{
                            position: absolute;
                            left:42%;
                            font-size:12px;
                            color: #000;
                            line-height: 24px;
                        }
                    }
                    .txt1{
                        width: 90%;
                        font-size:12px;
                        margin:0 auto;
                        color: #000;
                        line-height: 24px;
                        height: 24px;
                        position: relative;
                        label{
                            position: absolute;
                            left: 0px;
                        }
                    }
                    .slopeTable{

                        .slopeTableBody{
                            width: 90%;
                            margin:0 auto;
                            border: 1px solid #ccc;
                            position: relative;
                            height: 650px;
                            .left{
                                position: absolute;
                                height: inherit;
                                width: 100%;
                                border:1px solid #ccc;
                                left:0px;
                                .leftTable{
                                    position: absolute;
                                    height: inherit;
                                    width: 50%;
                                    border:1px solid #ccc;
                                    left:0px;
                                    table{
                                        border-collapse: collapse;
                                        border: 0.5px solid #000;
                                         thead{
                                            background: #fff;
                                            th{
                                                // padding-left: 6px;
                                                // padding-right: 15px;
                                                height: 18px;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 0.5px solid #000;
                                                font-size: 12px;
                                                color: #333333;
                                                font-weight: normal;
                                            }
                                        }
                                        tbody{
                                            tr{
                                                td{
                                                    height: 18px;
                                                    text-align: center;
                                                    box-sizing: border-box;
                                                    border-right: 0.5px solid #000;
                                                    font-size: 12px;
                                                    color: #333333;
                                                    // .actionBtn{
                                                    //     width: 18px;
                                                    //     height: 18px;
                                                    //     border: none;
                                                    //     cursor: pointer;
                                                    //     margin-left: 10px;
                                                    // }
                                                    // .location{
                                                    //     background: url('../planCost/images/location.png') no-repeat 0 0;
                                                    // }
                                                    // .curve{
                                                    //     background: url('./images/graph.png') no-repeat 0 0;
                                                    // }
                                                }
                                            }
                                        }
                                    }

                                }
                                .leftLine{
                                    position: absolute;
                                    height: inherit;
                                    width: 50%;
                                    border:1px solid #ccc;
                                    right:0px;
                                }
                            }
                            .right{
                                position: absolute;
                                 width: 50%;
                                right: 0px;
                                 height: inherit;
                                border:1px solid #ccc;
                                .rightTable{
                                     position: absolute;
                                    height: inherit;
                                    width: 50%;
                                    border:1px solid #ccc;
                                    left:0px;

                                }
                                .rightLine{
                                    position: absolute;
                                    height: inherit;
                                    width: 50%;
                                    border:1px solid #ccc;
                                    right:0px;

                                }

                            }

                        }

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


