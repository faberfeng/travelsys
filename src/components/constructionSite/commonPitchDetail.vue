<template>
    <div id="commonPitchDetail">
        <div class="project">
            <p class="antsLine">
                安全管理<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{surveyName}}</span>
            </p>
            <div class="container">
                <div class="containerHead">
                    <div class="containerHeadLeft">
                        <span class="addOrder" @click="addIndexNum()">添加序列</span>
                        <span class="exportOrder" @click="getImportHistory">导出</span>
                    </div>
                    <div class="containerHeadMiddle"></div>
                    <div class="containerHeadRight">
                        <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" @change="importMethodChange()" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==1" @click="importExcelData()" class="import">导入</span>
                        <span v-show="importMethod==2" class="import" @click="autoAcquisitionBtn()">配置</span>
                    </div>
                </div>
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
                                <th rowspan="2">操作</th>
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
                            <tr v-for="(item,index) in getPitchBaseInfoList" :key="index">
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
                                <td>
                                    <button title="修改" class="editBtn actionBtn" @click="editPitchSeqBtn(item.id,item.itemId)"></button>
                                    <button title="删除" class="deleteBtn actionBtn" @click="deletePitchSeq(item.id,item.itemId)"></button>
                                    <button title="左侧显示" @click="leftDisplay(item.id,item.name)" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" @click="rightDisplay(item.id,item.name)" class="rightLayBtn actionBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="containerBottom" v-show="totalShow">
                    <div class="containerBottomOne" v-show="leftShow">
                        <div class="oneHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{leftDisplayName}}详情</label>
                        </div>
                        <div class="oneTable" >
                            <table class="tableList" id="tableListid" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th>{{time|timeChange}}</th>
                                        <th>{{time1|timeChange}}</th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in leftDisplayList.recentVariation" :key="index">
                                        <td>{{leftDisplayListValue1[index].depth}}</td>
                                        <td >{{leftDisplayListValue1[index].shift}}</td>
                                        <td >{{leftDisplayListValue2[index].shift}}</td>
                                        <td>{{(leftDisplayList.recentVariation)[index].recentVariation|addSprit}}</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>{{time|timeChange}}</td>
                                        <td>{{time1|timeChange}}</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <!-- {{(leftDisplayList.recentVariation)[index].recentVariation|totalVariation}} -->
                                        <td>mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomTwo" v-show="leftShow">
                        <div class="twoHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{leftDisplayName}}曲线</label>
                            <label class="editSpot" @click="editLeftMarkSpot()">编辑标记</label>
                        </div>
                        <div class="twoGraph">
                            <vue-highcharts id="leftHightchart" style="min-height:1900px"  :options="optionOnesLeft" ref="lineLeftChartOne"></vue-highcharts>
                        </div>
                    </div>
                    <div class="containerBottomThree" v-show="rightShow">
                        <div class="threeHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{rightDisplayName}}详情</label>
                        </div>
                        <div class="threeTable">
                            <table class="tableList" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th>{{time|timeChange}}</th>
                                        <th>{{time1|timeChange}}</th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                               <tbody>
                                    <tr v-for="(item,index) in rightDisplayList.recentVariation" :key="index">
                                        <td>{{rightDisplayListValue1[index].depth}}</td>
                                        <td >{{rightDisplayListValue1[index].shift}}</td>
                                        <td >{{rightDisplayListValue2[index].shift}}</td>
                                        <td>{{(rightDisplayList.recentVariation)[index].recentVariation|addSprit}}</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>{{time2|timeChange}}</td>
                                        <td>{{time3|timeChange}}</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <!-- {{(rightDisplayList.recentVariation)[index].totalVariation|addSprit}} -->
                                        <td>mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomFour" v-show="rightShow">
                        <div class="fourHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{rightDisplayName}}曲线</label>
                             <label class="editSpot" @click="editRightMarkSpot()">编辑标记</label>
                        </div>
                        <div class="fourGraph">
                            <vue-highcharts style="min-height:1900px" :options="optionOnesRight" ref="lineRightChartOne"></vue-highcharts>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog  width="590px" :visible="addIndexNumShow" title="添加测斜序列" @close="addIndexNumCancle()">
                <div class="editBody">
                    <!-- <div class="editBodyone">
                        <label class="editTxt">序列编号:</label>
                        
                    </div> -->
                    <div class="editBodyone">
                        <label class="editTxt">测点数量:</label>
                        <label>{{allnum}}</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">起始高度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束高度:</label>
                        <input placeholder="请输入数值" v-model="terminalDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点间距:</label>
                        <input @change="numChange()" placeholder="请输入数值" v-model="pointDistance" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">关键字:</label>
                        <input placeholder="请输入Excel对应表名" v-model="keyword" class="inp" style="width:140px !important;height:30px !important"/>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPitchSeq()">确定</button>
                    <button class="editBtnC" @click="addIndexNumCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog  width="590px" :visible="editIndexNumShow" title="修改测斜序列" @close="editIndexNumCancle()">
                <div class="editBody">
                    <!-- <div class="editBodyone">
                        <label class="editTxt">序列编号:</label>
                        <label>{{indexName}}</label>
                    </div> -->
                    <div class="editBodyone">
                        <label class="editTxt">测点数量:</label>
                        <label>{{spotNum}}</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">起始高度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" readonly='readonly' class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束高度:</label>
                        <input placeholder="请输入数值" v-model="terminalDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点间距:</label>
                        <input placeholder="请输入数值"  v-model="pointDistance" readonly='readonly' class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">关键字:</label>
                        <input placeholder="请输入Excel对应表名" v-model="keyword" class="inp" style="width:140px !important;height:30px !important"/>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editPitchSeq()">确定</button>
                    <button class="editBtnC" @click="editIndexNumCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog  width="590px" :visible="editMarkShow" title="位置标记管理" @close="editMarkCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <div class="markhead">
                            <label class="txt">测点序列{{markSqName}}曲线图位置标记</label>
                            <label class="btn" @click="addSq()">插入</label>
                        </div>
                        <div class="editBodytwo">
                            <div class="tablemark">
                                <table class="marktableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th width="20%">位置</th>
                                            <th width="50%">标记名称</th>
                                            <th width="30%">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in getPitchSeqMarkList" :key="index">
                                            <td width="20%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.depth}}</span><input placeholder="请输入" style="width:100%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markDepth"/></td>
                                            <td width="50%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.name}}</span><input placeholder="请输入" style="width:55%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markName"/>
                                                <button v-show="item.id==editPitchShow" @click="editPitchSeqMarkSure(item.id,item.depth,item.name)" class="actionMakeBtn">确定</button>
                                                <button v-show="item.id==editPitchShow" @click="canclePitchSeqMark()" class="actionCancleBtn">取消</button>
                                                </td>
                                            <td width="30%">
                                                <button title="修改"  @click="editPitchSeqMark(item.id,item.depth,item.name)" class="editBtn actionBtn"></button>
                                                <button title="删除" @click="deletePitchSeqMark(item.id)" class="actionBtn deleteBtn"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPitchSeqMark()" >确定</button>
                    <button class="editBtnC" @click="editMarkCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="自动采集配置" :visible="autoAcquisitionShow" @close="autoAcquisitionCancle()">
                <div class="editBody" >
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">采集设备厂家：</label><select class="gatherTimeName" @click="manufacturerChange" v-model="manufacturerValue" placeholder="请选择"><option v-for="(item,index) in manufacturerList" :value="item.value" :key="index" v-text="item.label"></option></select>
                    </div>
                    <div class="editBodytwo" v-show="manufacturerValue=='华桓'"><label class="editInpText" style="width:18% !important;">项目ID：</label><input v-model="nodeId" class="gatherTimeNameInp"/>
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集频率：</label>
                        <el-radio v-model="collectRateRadio" label="1">1小时</el-radio>
                        <el-radio v-model="collectRateRadio" label="2">1天</el-radio>
                    </div>
                    <div class="editBodytwo" v-show="collectRateRadio=='2'"><label class="editInpText" style="width:18% !important;">采集时间：</label>
                        <select class="gatherTimeName" v-model="collectHour" placeholder="请选择"><option v-for="(item,index) in timeList" :value="item.value" :key="index" v-text="item.label"></option></select>
                    </div>
                     <div class="editBodytwo" v-show="manufacturerValue=='基康'">
                         <label class="editInpText" style="width:13% !important;">仪器ID设置</label>
                         <div class="tool">
                             <span class="export" @click="autoExport()"><label class="export1"></label><label class="exportTxt" >导入</label></span>
                             <span class="export" @click="clearDeviceMonitorPointRelation()"><label class="export2"></label><label class="exportTxt">清空</label></span>
                        </div>
                        <div id="toolTbale">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px">点位名称</th>
                                        <th width="300px">仪器ID</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getDeviceMonitorPointRelationList" :key="index">
                                        <td width="30%">{{item.virtualPointName}}</td>
                                        <td width="70%">{{item.devicePointName}}</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="autoAcquisitionMakeSure()" >确定</button>
                        <button class="editBtnC" @click="autoAcquisitionCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="文件导入" :visible="uploadshow" @close="upImgCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectImg">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput"  type="file"  @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                     <div class="editBodytwo">
                         <label class="editInpText" style="width:18% !important;">设备ID点位下标:</label>
                         <select v-model="devicePointIndex" class="sheetName">
                             <option v-for="(item,index) in getSingleSheetTitleInfoList"  :value="item.index" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                         <label class="editInpText" style="width:18% !important;">虚拟点位名称下标:</label>
                         <select v-model="virtualPointIndex" class="sheetName">
                             <option v-for="(item,index) in getSingleSheetTitleInfoList"  :value="item.index" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                </div>
                <!-- <p class="err" v-show="showErr">请输入完整信息</p> -->
                <div slot="footer" class="dialog-footer">
                    <button v-show="testShow" class="editBtnS" @click="uploadIMG">确认</button>
                     <button v-show="!testShow" class="editBtnC" style="background:#ccc;margin-right:15px" @click="testProject">测试</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
            </el-dialog>
             <el-dialog title="导出历史数据记录 " :visible="exportHistoryRecoedShow" @close="exportHistoryRecoedCancle()">
                <div class="editBody" >
                     <div class="editBodytwo">
                        <div id="toolTbale1">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="5%"><el-checkbox @change="allCheckChange" v-model="allCheck"></el-checkbox></th>
                                        <th width="10%">序号</th>
                                        <th width="25%">导入时间</th>
                                        <th width="20%">导入方式</th>
                                        <th width="20%">导入用户</th>
                                        <th width="20%">测点数</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getImportHistoryList" :key="index">
                                        <td><el-checkbox v-model="item.check"></el-checkbox></td>
                                        <td>{{item.importNo}}</td>
                                        <td>{{item.importTime|timeChange1}}</td>
                                        <td>{{item.type|typeChange}}</td>
                                        <td>{{item.importUserName}}</td>
                                        <td>{{item.pointAmount}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="exportAllRecode()" >导出全部记录</button>
                        <button class="editBtnC" @click="exportSelectRecode()">导出选中记录</button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import VueHighcharts from 'vue2-highcharts'
export default Vue.component('commonPitch-detail',{
        props:['surveyName','itemMonitorId','itemMonitorType','itemMonitorKeyWord'],
        components:{
            VueHighcharts
        },
        data(){
            return{
                leftShow:false,
                rightShow:false,
                totalShow:false,
                defaultSubProjId:'',
                token:'',
                projId:'',
                userId:'',
                BDMSUrl:'',
                QJFileManageSystemURL:'',
                importMethod:1,
                importList:[
                    {
                        value:1,
                        label:'手动导入'
                    },
                    {
                        value:2,
                        label:'自动配置'
                    }
                ],
                getPitchBaseInfoList:'',//获取斜度基本信息
                pitchDetailDataList:'',//获取数据详情（下面的图）
                addIndexNumShow:false,//增加序列
                editIndexNumShow:false,//修改序列
                editMarkShow:false,//编辑mark
                initDepth:'',//起始标高
                terminalDepth:'',//结束标高
                allnum:'',
                pointDistance:'',//点位间隔
                keyword:'',//关键字
                indexName:'',//序列编号
                spotNum:'',//测点数量
                leftDisplayShow:'',
                rightDisplayShow:'',
                leftDisplayName:'',
                rightDisplayName:'',
                leftDisplayList:'',
                leftDisplayListValue:'',
                leftDisplayListValue1:[],
                leftDisplayListValueXdata:[],
                leftDisplayListValueYdata1:[],
                leftDisplayListValueYdata2:[],
                rightDisplayListValueXdata:[],
                rightDisplayListValueYdata1:[],
                rightDisplayListValueYdata2:[],
                lineHeight:'',
                leftDisplayListValue2:[],
                rightDisplayListValue1:[],
                rightDisplayListValue2:[],
                time:'',
                time1:'',
                time2:'',
                time3:'',
                rightDisplayList:'',
                rightDisplayListValue:[],
                rightSqId:'',//右边编辑ID，
                leftSqId:'',//左边标记ID,
                rightSqName:'',//右边的名字
                leftSqName:'',//左边的名字
                markSqId:'',//标记sqid
                markSqName:'',//名字
                itemseqId:'',
                seqId:'',
                show:false,
                 optionOnesLeft:{
                        chart: {
                            type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                        },
                        yAxis: {
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                               
                            
                                },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            
                            floating: true,
                            borderWidth: 0
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
                optionOnesRight:{
                        chart: {
                            type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            tickInterval: 1,
                            categories:[],
                            // tickLength:200,
                            

                            // tickPixelInterval:10,

                        },
                        yAxis: {
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                                },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            
                            floating: true,
                            borderWidth: 0
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
                //

                autoAcquisitionShow:false,
                manufacturerValue:'华桓',
                uploadshow:false,
                //获取导出的历史记录
                exportHistoryRecoedShow:false,
                getImportHistoryList:'',
                allCheck:false,
                filesList:'',
                imageName:"未选择任何文件",
                getSingleSheetTitleInfoList:'',
                devicePointIndex:'',
                virtualPointIndex:'',
                collectRateRadio:'1',
                collectHour:0,
                getDeviceMonitorPointRelationList:'',
                timeList:[
                    {
                        value:0,
                        label:'0时'
                    },
                    {
                        value:1,
                        label:'01时'
                    },
                    {
                        value:2,
                        label:'02时'
                    },
                    {
                        value:3,
                        label:'03时'
                    },
                    {
                        value:4,
                        label:'04时'
                    },
                    {
                        value:5,
                        label:'05时'
                    },
                    {
                        value:6,
                        label:'06时'
                    },
                    {
                        value:7,
                        label:'07时'
                    },
                    {
                        value:8,
                        label:'08时'
                    },
                    {
                        value:9,
                        label:'09时'
                    },
                    {
                        value:10,
                        label:'10时'
                    },
                    {
                        value:11,
                        label:'11时'
                    },
                    {
                        value:12,
                        label:'12时'
                    },
                    {
                        value:13,
                        label:'13时'
                    },
                    {
                        value:14,
                        label:'14时'
                    },
                    {
                        value:15,
                        label:'15时'
                    },
                    {
                        value:16,
                        label:'16时'
                    },
                    {
                        value:17,
                        label:'17时'
                    },
                    {
                        value:18,
                        label:'18时'
                    },
                    {
                        value:19,
                        label:'19时'
                    },
                    {
                        value:20,
                        label:'20时'
                    },
                    {
                        value:21,
                        label:'21时'
                    },
                    {
                        value:22,
                        label:'22时'
                    },
                    {
                        value:23,
                        label:'23时'
                    }
                ],
                nodeId:'',
                manufacturerList:[
                    {
                        value:'华桓',
                        label:'华桓'
                    },
                    {
                        value:'基康',
                        label:'基康'
                    }
                ],
                testShow:false,
                getPitchSeqMarkList:'',
                markDepth:'',
                markName:'',
                editPitchShow:'',


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
            vm.getPitchBaseInfo();
            vm.getDetectionItemCollectWay();
        },
        filters:{
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
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("MM-DD HH:mm");
            }
        },
        timeChange1(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("MM-DD HH:mm");
            }
        },
        typeChange(val){
            return val==1?'手动':'自动'
        },
        timeStamp(StatusMinute){	
            if(StatusMinute==null){
                return '/'
            }else {
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

        },
        watch:{

        },
        methods:{
            timeChangeMethod(val) {
                if (val == null) {
                return '/';
                } else {
                return moment(val).format("MM-DD HH:mm");
                }
            },
            //返回
            back(){
                var vm = this
                vm.$emit('back')
            },
            importExcelData(){
                this.$emit('importExcelData',true,this.itemMonitorId,this.surveyName,this.itemMonitorType,this.itemMonitorKeyWord)
                // this.$emit('importDataShow',true,this.itemMonitorId,this.projctName,this.itemMonitorType,this.itemMonitorKeyWord)
            },



            //改变方法
            importMethodChange(){
                this.setDetectionItemCollectWay();
            },
             //设置监测项目采集方式
            setDetectionItemCollectWay(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/setDetectionItemCollectWay',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId,
                        collectWay:this.importMethod
                    }
                }).then((response)=>{
                    if(response.data.rt){
                        
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //获取监测项目采集方式
            getDetectionItemCollectWay(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getDetectionItemCollectWay',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId
                    }
                }).then((response)=>{
                    if(response.data.rt){
                        this.importMethod=response.data.rt;
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })

            },
            //添加序列号
            addIndexNum(){
                this.addIndexNumShow=true;
            },
            addIndexNumCancle(){
                this.addIndexNumShow=false;
            },
            //
            editIndexNumCancle(){
                this.editIndexNumShow=false;
            },
            //获取斜度基本信息（上面的表）
            getPitchBaseInfo(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getPitchBaseInfo',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemMonitorId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        vm.getPitchBaseInfoList=response.data.rt;
                        this.getPitchDetailDataBySeqId(vm.getPitchBaseInfoList[0].id)
                        console.log(vm.getPitchBaseInfoList[0].id);
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //根据序列ID获取数据详情（下面的图）
            getPitchDetailDataBySeqId(num){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getPitchDetailDataBySeqId',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        seqId:num
                    }
                }).then((response)=>{
                    if(response.data.rt){
                        this.pitchDetailDataList=response.data.rt;
                        
                        console.log(this.pitchDetailDataList);
                    }else if(respose.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            // 添加斜度序列
            addPitchSeq(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/addPitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        initDepth:vm.initDepth,
                        terminalDepth:vm.terminalDepth,
                        pointDistance:vm.pointDistance,
                        keyword:vm.keyword
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.addIndexNumShow=false;
                        this.getPitchBaseInfo();
                        vm.initDepth='';
                        vm.terminalDepth='';
                        vm.pointDistance='';
                        vm.keyword='';
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            numChange(){
                this.allnum=Math.floor((this.terminalDepth-this.initDepth)/this.pointDistance)+1
            },
            //点击修改斜度序列
            editPitchSeqBtn(val,valItemId){
                var vm=this;
                vm.itemseqId=valItemId;
                vm.seqId=val;
                this.editIndexNumShow=true;
                this.getPitchBaseInfoList.forEach((item)=>{
                    if(item.id==val){
                        vm.indexName=item.name;
                        vm.spotNum=item.pointAmount;
                        vm.initDepth=item.initDepth;
                        vm.terminalDepth=item.terminalDepth;
                        vm.pointDistance=item.pointDistance;
                        vm.keyword=item.keyword;
                    }
                })
            },
            //修改斜度序列
            editPitchSeq(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/editPitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemseqId,
                        seqId:vm.seqId,
                        initDepth:vm.initDepth,
                        terminalDepth:vm.terminalDepth,
                        pointDistance:vm.pointDistance,
                        keyword:vm.keyword
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.addIndexNumShow=false;
                        this.getPitchBaseInfo();
                        vm.initDepth='';
                        vm.terminalDepth='';
                        vm.pointDistance='';
                        vm.keyword='';
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //删除斜度序列
            deletePitchSeq(id,itemId){
                 var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/deletePitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:itemId,
                        seqId:id
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getPitchBaseInfo();
                        vm.$message({
                            type:'info',
                            message:'序列删除成功'
                        })
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //左侧显示
            leftDisplay(id,name){
                this.leftSqId=id;
                this.leftSqName=name;
                this.leftDisplayListValue1=[];
                this.leftDisplayListValue2=[];
                this.leftDisplayListValueXdata=[];
                this.leftDisplayListValueYdata1=[];
                this.leftDisplayListValueYdata2=[];
                this.getPitchDetailDataBySeqId(id)
                this.totalShow=true;
                this.leftShow=true;
                if(this.pitchDetailDataList){
                    this.leftDisplayList=this.pitchDetailDataList;
                    this.leftDisplayListValue=this.leftDisplayList.recent2PitchData;
                    this.time=(this.leftDisplayList.recent2PitchData)[0].acquisitionTime;
                    this.time1=(this.leftDisplayList.recent2PitchData)[1].acquisitionTime;
                    this.leftDisplayListValue.forEach((item,index,array)=>{
                        // console.log(array[index].acquisitionTime,'array');
                        if(array[index].acquisitionTime==this.time){
                            this.leftDisplayListValue1.push(array[index])
                            this.leftDisplayListValueXdata.push(array[index].depth)
                            this.leftDisplayListValueYdata1.push(array[index].shift)

                        }else if(array[index].acquisitionTime==this.time1){
                            this.leftDisplayListValue2.push(array[index])
                            this.leftDisplayListValueYdata2.push(array[index].shift)
                        }
                    })
                    this.leftDisplayName=name;
                    //  document.getElementById('leftHightchart').style.minHeight=document.getElementById('tableListid').clientHeight+'px'
                    // console.log(document.getElementById('leftHightchart'),'tuxing')
                    
                    setTimeout(()=>{
                        console.log(document.getElementById('tableListid').clientHeight);
                    },20)
                    let lineLeftChart=this.$refs.lineLeftChartOne;
                    lineLeftChart.delegateMethod('showLoading', 'Loading...');
                    setTimeout(()=>{
                       
                        lineLeftChart.removeSeries();
                        lineLeftChart.addSeries({name:this.timeChangeMethod(this.time),data:this.leftDisplayListValueYdata1});
                        lineLeftChart.addSeries({name:this.timeChangeMethod(this.time1),data:this.leftDisplayListValueYdata2});
                        lineLeftChart.hideLoading();
                        lineLeftChart.getChart().xAxis[0].update({categories:this.leftDisplayListValueXdata});
                    },20)
                    console.log(this.leftDisplayListValue1,'数据1')
                    console.log(this.leftDisplayListValue2,'数据2')
                    console.log(this.leftDisplayList,'左边数据')
                    console.log(this.leftDisplayListValueXdata,'苏醒')
                    console.log(this.leftDisplayListValueYdata1,'DATA1')
                    console.log(this.leftDisplayListValueYdata2,'data2');
                }
            },
            //右侧显示
            rightDisplay(id,name){
                this.rightSqId=id;
                this.rightSqName=name;
                this.rightDisplayListValue1=[];
                this.rightDisplayListValue2=[];
                this.rightDisplayListValueXdata=[],
                this.rightDisplayListValueYdata1=[],
                this.rightDisplayListValueYdata2=[],
                this.getPitchDetailDataBySeqId(id)
                this.totalShow=true;
                this.rightShow=true;
                if(this.pitchDetailDataList){
                    this.rightDisplayList=this.pitchDetailDataList;
                    this.rightDisplayListValue=this.rightDisplayList.recent2PitchData;
                    this.time2=(this.rightDisplayList.recent2PitchData)[0].acquisitionTime;
                    this.time3=(this.rightDisplayList.recent2PitchData)[1].acquisitionTime;
                    this.rightDisplayListValue.forEach((item,index,array)=>{
                        // console.log(array[index].acquisitionTime,'array');
                        if(array[index].acquisitionTime==this.time2){
                            this.rightDisplayListValue1.push(array[index])
                            this.rightDisplayListValueXdata.push(array[index].depth)
                            this.rightDisplayListValueYdata1.push(array[index].shift)
                        }else if(array[index].acquisitionTime==this.time3){
                            this.rightDisplayListValue2.push(array[index])
                            this.rightDisplayListValueXdata.push(array[index].depth)
                            this.rightDisplayListValueYdata2.push(array[index].shift)
                        }
                    })
                    this.rightDisplayName=name;
                    let lineRightChart=this.$refs.lineRightChartOne;
                    // document.getElementById('leftHightchart').style.minHeight='1950px'
                    lineRightChart.delegateMethod('showLoading', 'Loading...');
                    setTimeout(()=>{
                        lineRightChart.removeSeries();
                        lineRightChart.addSeries({name:this.timeChangeMethod(this.time),data:this.rightDisplayListValueYdata1});
                        lineRightChart.addSeries({name:this.timeChangeMethod(this.time1),data:this.rightDisplayListValueYdata2});
                        lineRightChart.hideLoading();
                        lineRightChart.getChart().xAxis[0].update({categories:this.rightDisplayListValueXdata});
                    },20)
                    // console.log(this.leftDisplayListValue1,'数据1')
                    // console.log(this.leftDisplayListValue2,'数据2')
                    // console.log(this.leftDisplayList,'左边数据')
                }

                
                
                console.log(this.rightDisplayList,'右边数据')
            },
            editLeftMarkSpot(){
                this.markSqId=this.leftSqId;
                this.markSqName=this.leftSqName;
                this.editMarkShow=true;
                this.getPitchSeqMark();
            },
            editRightMarkSpot(){
                this.markSqId=this.rightSqId;
                this.markSqName=this.leftSqName;
                this.editMarkShow=true;
                this.getPitchSeqMark();
            },
            //插入
            addSq(){
                this.getPitchSeqMarkList.push({"depth":'',"id":null,"name":'',"seqId":''})
            },
            //获取斜度序列标记
            getPitchSeqMark(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getPitchSeqMark',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        seqId:this.markSqId,
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getPitchSeqMarkList=response.data.rt;
                        console.log(this.getPitchSeqMarkList,'this.getPitchSeqMarkList');
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //

            //添加斜度序列标记
            addPitchSeqMark(){
                var vm=this;
                if(this.editPitchShow){
                     this.$message({
                        type:"info",
                        message:'当前不可操作，请保存编辑修改'
                    })
                }else if(this.markDepth==''){
                    this.$message({
                        type:"info",
                        message:'请输入位置标记'
                    })
                }else if(this.markName==''){
                     this.$message({
                        type:"info",
                        message:'请输入位置标记名称'
                    })
                }else if(this.markName.length>8){
                    this.$message({
                        type:"info",
                        message:'位置标记名称不能多余8个字符'
                    })
                }else{
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'detectionInfo/addPitchSeqMark',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                            seqId:this.markSqId,
                            depth:this.markDepth,
                            name:this.markName,
                        }
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            this.markDepth='';
                            this.markName='';
                            this.getPitchSeqMark();
                        }else{
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
                }
            },
            canclePitchSeqMark(){
                // this.getPitchSeqMarkList.pop();
                // this.markDepth='';
                // this.markName='';
                this.editPitchShow='';
            },
            //编辑斜度序列标记
            editPitchSeqMark(id,depth,name){
                var vm=this;
                if(id==null){
                    this.$message({
                            type:'success',
                            message:'当前不可操作，请先保存'
                        })
                }else{
                    this.markDepth=depth;
                    this.markName=name;
                    this.editPitchShow=id;
                }
                
            },
            //
            editPitchSeqMarkSure(id,depth,name){
                var vm=this;
                  axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/editPitchSeqMark',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        id:id,
                        depth:this.markDepth,
                        name:this.markName,
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.editPitchShow='';
                        this.markDepth='';
                        this.markName='';
                        this.getPitchSeqMark();
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //删除斜度序列标记
            deletePitchSeqMark(val){
                var vm=this;
                if(val==null){
                    this.$message({
                            type:'success',
                            message:'当前不可操作，请先保存'
                        })
                    
                }else{
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'detectionInfo/deletePitchSeqMark',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                        id:val,
                        }
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            this.getPitchSeqMark();
                            this.$message({
                                type:'success',
                                message:'位置标记删除成功'
                            })
                        }else{
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
                }
            },
            editMarkCancle(){
                this.editMarkShow=false;
            },

            ////导出历史记录
             //获取导入历史
            getImportHistory(){
                var vm=this;
                this.exportHistoryRecoedShow=true;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getImportHistory',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        itemId:this.itemMonitorId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getImportHistoryList=response.data.rt;
                        this.getImportHistoryList.forEach((item)=>{
                            this.$set(item,'check',false)
                        })
                        console.log(this.getImportHistoryList,'this.getImportHistoryList');
                    }
                })
            },
            //点击导出所有记录按钮
            allCheckChange(){
                if(this.allCheck==true){
                    this.getImportHistoryList.forEach((item)=>{
                        item.check=true;
                    })
                }else if(this.allCheck==false){
                    this.getImportHistoryList.forEach((item)=>{
                        item.check=false;
                    })
                }
            },
            //导出所有记录
            exportAllRecode(){
                this.allCheck=true;
                this.allCheckChange();
                this.exportHistory();
            },
            //导出选中记录
            exportSelectRecode(){

                this.exportHistory()
            },
            //
            exportHistoryRecoedCancle(){
                this.exportHistoryRecoedShow=false;
            
                this.getImportHistoryList.forEach((item,index)=>{
                    item.check=true;
                })
            },
            // 导出选中的历史记录
            exportHistory(){
                var vm=this;
                var str='';
                this.getImportHistoryList.forEach((item,index)=>{
                    if(item.check==true){
                    str+="&ids="+item.id
                    }
                })
                if(str){
                    window.open(vm.BDMSUrl+'detectionInfo/exportHistory?token='+vm.token+str,'_blank')
                    this.exportHistoryRecoedShow=false;
                    this.allCheck=false;
                    this.getImportHistoryList.forEach((item,index)=>{
                        item.check=false;
                    })
                }else{
                    this.$message({
                        type:'info',
                        message:'请选择导出的条目'
                    })
                }
            },


            //////
              //自动采集按钮
            autoAcquisitionBtn(){
                this.autoAcquisitionShow=true;
                this.getCollectSetting();
            
            },
            //取消自动采集配置
            autoAcquisitionCancle(){
                this.autoAcquisitionShow=false;
            },
            manufacturerChange(){
                if(this.manufacturerValue=='基康'){
                    this.getDeviceMonitorPointRelation();
                }
            },
            //自动采集配置确认
            autoAcquisitionMakeSure(){
                if(this.manufacturerValue=='华桓'){
                    this.editHuahuanNode();
                    this.setCollectSetting();
                    this.nodeId='';
                }else if(this.manufacturerValue=='基康'){
                    this.setCollectSetting();
                    this.$message({
                            type:'success',
                            message:'自动采集成功'
                        })
                    this.autoAcquisitionShow=false;
                }


            },
            //导入
            autoExport(){
                this.uploadshow=true;
            },
            upImgCancle(){
                this.uploadshow=false;
            },
            fileChanged(file){
                var vm = this
                vm.filesList = vm.$refs.file.files[0]; //[]
                vm.imageName = vm.filesList.name;
                var formData =new FormData();
                formData.append('multipartFile',vm.filesList);
                    axios({
                        method:'post',
                        headers:{
                            'token':vm.token
                        },
                        url:vm.BDMSUrl+'detectionInfo/getSingleSheetTitleInfo',
                        data:formData
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            this.getSingleSheetTitleInfoList=response.data.rt;
                            // this.devicePointIndex=this.getSingleSheetTitleInfoList[2].index;
                            // this.virtualPointIndex=this.getSingleSheetTitleInfoList[2].index;
                            // vm.filesList='';
                            // vm.imageName='未选择任何文件';
                            // vm.uploadshow=false;
                        }
                })
                console.log(vm.filesList,'vm.filesList');
            },
            //上传
            uploadIMG(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/importDeviceMonitorPoint',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                        devicePointIndex:this.devicePointIndex,//设备点位下标
                        virtualPointIndex:this.virtualPointIndex,//虚拟点位下标
                    },
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        // alert('23');
                        vm.uploadshow=false;
                        this.$message({
                            type:'success',
                            message:'文件导入成功'
                        })
                        this.getDeviceMonitorPointRelation();
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
                document.getElementById('fileInfo').value="";
            },
            //测试
            testProject(){
                var vm=this;
                var formData =new FormData();
                formData.append('multipartFile',vm.filesList);
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/verifyImportDeviceMonitorPoint',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                        devicePointIndex:this.devicePointIndex,//设备点位下标
                        virtualPointIndex:this.virtualPointIndex,//虚拟点位下标
                    },
                    data:formData
                    // data:vm.multipartFile
                }).then((response)=>{
                    if(response.data.rt){
                        this.testShow=true;
                        this.$message({
                            type:'success',
                            message:'测试成功'
                        })
                        // alert('23');
                        // vm.uploadshow=false;
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //获取点位关系
            getDeviceMonitorPointRelation(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getDeviceMonitorPointRelation',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                    },
                }).then((response)=>{
                    if(response.data.rt.length!=0){
                        this.getDeviceMonitorPointRelationList=response.data.rt;
                        document.getElementById('toolTbale').style.height='300px';
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        // document.getElementById('toolTbale').style.height='0px';
                    }
                })
            },
            //设置采集配置
            setCollectSetting(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/setCollectSetting',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                        collectRate:parseInt(this.collectRateRadio),//采集频率
                        collectHour:this.collectHour,//采集时间
                    },
                }).then((response)=>{
                    if(response.data.rt){
                        this.manufacturerValue='';
                        this.collectRateRadio='1';
                        this.collectHour='';
                    
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //获取采集配置
            getCollectSetting(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getCollectSetting',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                        collectRate:parseInt(this.collectRateRadio),//采集频率
                        collectHour:this.collectHour,//采集时间
                    },
                }).then((response)=>{
                    if(response.data.rt){
                        this.manufacturerValue=response.data.rt.manufacturer;
                        if( this.manufacturerValue=="基康"){
                            this.getDeviceMonitorPointRelation();
                        }
                        this.collectRateRadio=response.data.rt.collectRate==1?'1':'2';
                        this.collectHour=response.data.rt.collectHour;
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //清空点位关系
            clearDeviceMonitorPointRelation(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/clearDeviceMonitorPointRelation',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        manufacturer:vm.manufacturerValue,
                    },
                }).then((response)=>{
                    if(response.data.cd=='0'){
                            document.getElementById('toolTbale').style.height='0px';
                            this.getDeviceMonitorPointRelation()
                        // this.manufacturerValue='';
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //添加/华环项目节点
            editHuahuanNode(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/editHuahuanNode',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId,
                        nodeId:this.nodeId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.autoAcquisitionShow=false;
                        this.nodeId='';
                        this.$message({
                            type:'success',
                            message:'自动采集成功'
                        })
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            // 获取华环项目节点
            getHuahuanNode(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getHuahuanNode',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId
                    }
                }).then((response)=>{
                    if(response.data.rt){
                        this.getHuahuanNodeList=response.data.rt;
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
             selectImg(){
                this.$refs.file.click()
            },
            
        }
    }
)

</script>
<style lang="less">
*{
    margin:0;
    padding: 0;
    box-sizing: border-box;
}
i{
    font-style:normal
}
li{list-style: none}
select.autoImport{
        /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  

    }
#commonPitchDetail{
    margin: 0 20px 20px!important;
    .project{
        width: 100%;
        max-height: 2000px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }
                .strong{
                    cursor: pointer;
                    color: #333333;
                    font-weight: bold;
                    &:last-of-type .icon-sanjiao-right{
                        display: none;
                    }
                }
                
        }
        .container{
            width: 98%;
            margin:0 auto;
            .containerHead{
                margin-top:28px;
                width: 98%;
                height: 34px;
                
                .containerHeadLeft{
                    float: left;
                    .addOrder{
                        display: inline-block;
                        width: 100px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;

                    }
                    .exportOrder{
                        display: inline-block;
                        width: 50px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
                .containerHeadMiddle{

                }
                .containerHeadRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
                        color:#999999;
                        font-size: 12px;
                        width: 60px;
                        height: 26px;
                        line-height: 26px;
                    }
                    .autoImport{
                        width: 121px;
                        height: 26px;
                        border: 1px solid #cccccc;
                        position: relative;
                        background: #fff;
                        padding-left: 10px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        margin-right: 0px;
                        color: #333333;
                        font-size: 14px;
                        border-radius: 2px;
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
                        top: 11px;
                        right: 65px;
                    }
                    .import{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                }
            }
            .containerTable{
                margin-top:10px;
                .containerList{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                    height: 30px;
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
                                    .deleteBtn{
                                        background: url('./images/delete1.png') no-repeat 0 0;
                                    }
                                    .leftLayBtn{
                                        background: url('./images/leftLay.png') no-repeat 0 0;
                                    }
                                    .rightLayBtn{
                                        background: url('./images/rightLay.png') no-repeat 0 0;
                                    }
                                }
                            }
                    }

                }
            }
            .containerBottom{
                margin-top:32px;
                width: 100%;
                height: 2000px;
                // border:1px solid #ccc;
                position: relative;
                .containerBottomOne{
                    position: absolute;
                    width: 25%;
                    height: 2000px;
                    left:0;
                //    border-right:1px solid #ccc;
                    .oneHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        
                    }
                    .oneTable{
                        width:96%;
                        margin-top:18px;
                        .tableList{
                             border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                    }
                                }
                            }

                        }

                    }

                }
                .containerBottomTwo{
                    position: absolute;
                    width: 25%;
                    height: 2000px;
                    left:25%;
                //    border-right:1px solid #ccc;
                    .twoHeader{
                         height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        .editSpot{
                            display: inline-block;
                            float: right;
                            font-size:12px;
                            color:#336699;
                            line-height: 30px;
                            cursor: pointer;
                        }
                    }
                    .twoGraph{
                        // height: 700px;
                        width: 96%;
                        margin:0 auto;
                        margin-top:20px;
                        // transform: rotate(90deg);
                        border:1px solid #ccc;
                        padding: 48px 15px 25px 15px;
                        // width: 100%;
                        

                    }
                }
                .containerBottomThree{
                    position: absolute;
                    width: 25%;
                    height: 2000px;
                    left:50%;
                //    border-right:1px solid #ccc;
                    .threeHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .threeTable{
                         width:96%;
                        margin-top:18px;
                        .tableList{
                             border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                    }
                                }
                            }

                        }
                    }
                }
                .containerBottomFour{
                     position: absolute;
                    width: 25%;
                    height: 2000px;
                    left:75%;
                //    border-right:1px solid #ccc;
                    .fourHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        .editSpot{
                            display: inline-block;
                            float: right;
                            font-size:12px;
                            color:#336699;
                            line-height: 30px;
                            cursor: pointer;
                        }
                    }
                    .fourGraph{
                            width: 96%;
                            margin: 0 auto;
                            margin-top: 20px;
                            border: 1px solid #ccc;
                            padding: 48px 15px 25px 15px;
                    }
                }



            }
            


        }
    }
    #edit{
        .editTxt{
            color: #666;
            font-size: 14px;
            line-height: 14px;
            font-weight: normal;
            display: inline-block;
            margin-right: 20px;
            width: 30%;
            text-align: right;
            display: inline-block;
            margin-left: 40px;
        }
        .editBodyone,.editBodytwo{
                text-align: left;
            }
        .editInput{

        }
        .markhead{
            width: 90%;
            height: 32px;
            margin:0 auto;
            position: relative;
            .txt{
                position: absolute;
                left:0px;
                top:0px;
                font-size: 14px;
                line-height: 32px;
            }
            .btn{
                position: absolute;
                right: 0px;
                top:0px;
                margin: 0px;
                display: inline-block;
                background: #fc3439;
                // margin-right: 20px;
                color: #fff;
                text-align: center;
                font-size: 14px;
                padding-left: 50px;
                font-weight: normal;
                line-height: 28px;
                width: 58px;
                height: 28px;
                border: none;
                padding: 0;
                cursor: pointer;
                border-radius: 2px;
            }
        }
        .tablemark{
            margin:0 auto;
            width: 90%;
                .marktableList{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                    height: 30px;
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
                                    .deleteBtn{
                                        background: url('./images/delete1.png') no-repeat 0 0;
                                    }
                                    .actionMakeBtn{
                                            background: #fc3439;
                                            margin-right: 2px;
                                            color: #fff;
                                            font-size: 14px;
                                            font-weight: normal;
                                            width:50px;
                                            height:24px;
                                            border: none;
                                            padding: 0;
                                            cursor: pointer;
                                            border-radius: 2px;
                                            display: inline-block;
                                    }
                                    .actionCancleBtn{
                                            color: #666;
                                            background: #fff;
                                            border: 1px solid #ccc;
                                            display: inline-block;
                                            width: 50px;
                                            height: 24px;
                                            // border: none;
                                            padding: 0;
                                            cursor: pointer;
                                            border-radius: 2px;

                                    }
                                }
                            }
                    }

                }
        }
        .gatherTimeName{
                width: 375px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
        .gatherTimeNameInp{
            width: 375px;
            border-radius: 2px;
            height: 32px;
            border: 1px solid #cccccc;
            position: relative;
            background: #ffffff;
            padding-left: 10px;
            padding-right: 20px;
            box-sizing: border-box;
            margin-right: 15px;
            color: #333333;
            font-size: 14px;
            outline: none;
        }
        .tool{
            float: right;
            margin-right:52px;
            .export{
                position: relative;
                width:60px;
                display: inline-block;
                .export1{
                        display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: none;
                    cursor: pointer;
                    margin-right:10px;
                    // margin-top:10px;
                    background: url('./images/export.png') no-repeat 0 0;
                }
                .export2{
                        display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: none;
                    cursor: pointer;
                    margin-right:10px;
                    // margin-top:10px;
                    background: url('./images/clear.png') no-repeat 0 0;
                }
                .export3{
                        display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: none;
                    cursor: pointer;
                    margin-right:10px;
                    // margin-top:10px;
                    background: url('./images/save1.png') no-repeat 0 0;
                }
                .exportTxt{
                    position: absolute;
                    width: 50px;
                    top:-3px;
                    cursor: pointer;
                    // left:2px;
                    
                    // display: inline-block;
                }
                

            }
            .clear{

            }
            .text{

            }
            


        }
        #toolTbale{
            width: 85%;
            margin:10px auto;
            // height: 300px;
            overflow: auto;
            position: relative;
            .toolTbaleList{
                // position: fixed;
                // table-layout: fixed
                    border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        overflow: auto;
                        thead{
                            background: #f2f2f2;
                            th{
                                padding-left: 6px;
                                padding-right: 15px;
                                height: 32px;
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
                                .red{
                                    color: red;
                                }
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    /*
                                    溢出隐藏
                                    */
                                    overflow: hidden;
                                    /*
                                    显示省略号
                                    */
                                    text-overflow: ellipsis;
                                    /*
                                    不换行
                                    */
                                    white-space: nowrap;
                                }
                            }
                        }
            }
            .toolTbaleList1{
                border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                overflow: auto;
                        tbody{
                            tr{
                                .red{
                                    color: red;
                                }
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    /*
                                    溢出隐藏
                                    */
                                    overflow: hidden;
                                    /*
                                    显示省略号
                                    */
                                    text-overflow: ellipsis;
                                    /*
                                    不换行
                                    */
                                    white-space: nowrap;
                                }
                            }
                        }
            }
        }
         #toolTbale1{
                    width: 85%;
                    margin:10px auto;
                    // height: 300px;
                    overflow: auto;
                    position: relative;
                    .toolTbaleList{
                        // position: fixed;
                        // table-layout: fixed
                        border-collapse: collapse;
                                border: 1px solid #e6e6e6;
                                overflow: auto;
                                thead{
                                    background: #f2f2f2;
                                    th{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
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
                                        .red{
                                            color: red;
                                        }
                                        td{
                                            padding-left: 6px;
                                            padding-right: 15px;
                                            height: 32px;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 1px solid #e6e6e6;
                                            font-size: 12px;
                                            color: #333333;
                                            /*
                                            溢出隐藏
                                            */
                                            overflow: hidden;
                                            /*
                                            显示省略号
                                            */
                                            text-overflow: ellipsis;
                                            /*
                                            不换行
                                            */
                                            white-space: nowrap;
                                        }
                                    }
                                }
                    }
                    .toolTbaleList1{
                        border-collapse: collapse;
                                border: 1px solid #e6e6e6;
                        overflow: auto;
                                tbody{
                                    tr{
                                        .red{
                                            color: red;
                                        }
                                        td{
                                            padding-left: 6px;
                                            padding-right: 15px;
                                            height: 32px;
                                            text-align: center;
                                            box-sizing: border-box;
                                            border-right: 1px solid #e6e6e6;
                                            font-size: 12px;
                                            color: #333333;
                                            /*
                                            溢出隐藏
                                            */
                                            overflow: hidden;
                                            /*
                                            显示省略号
                                            */
                                            text-overflow: ellipsis;
                                            /*
                                            不换行
                                            */
                                            white-space: nowrap;
                                        }
                                    }
                                }
                    }
        }
        .sheetName{
            width: 375px;
            border-radius: 2px;
            height: 32px;
            border: 1px solid #cccccc;
            position: relative;
            background: #ffffff;
            padding-left: 10px;
            padding-right: 20px;
            box-sizing: border-box;
            margin-right: 15px;
            color: #333333;
            font-size: 14px;
            outline: none;
        }
    }
}

</style>

