<template>
    <div id="commonDetail">
        <div class="project">
            <p class="antsLine">
                安全管理<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{projctName}}</span>
            </p>
        </div>
        <div class="projectBody">
            <div class="projectBodyHead">
                <div class="block">
                        <span class="demonstration">图例缩放比例</span>
                        <el-slider v-model="scaleValue" :max="100" :min="1" :step="1" @change="updateBaseMapZoom()"></el-slider>
                </div>
                <!-- <div class="headLeft" v-show="manageEdit">
                    <span :class="[{'isClickStyle':isClick1},'headLeftBtn']" @click="spotClick()">单点</span>
                    <span :class="[{'isClickStyle':isClick2},'headLeftBtn']" @click="spotAllClick()">连续</span>
                    <span :class="[{'isClickStyle':isClick3},'headLeftBtn']" @click="drawingTxtClick()">文字</span>
                    <span :class="[{'isClickStyle':isClick4},'headLeftBtn']" @click="enableMoveCommon()">移动</span>
                    <span :class="[{'isClickStyle':isClick5},'headLeftBtn']" style="width:100px !important" @click="changeBroken(1)">故障/修复</span>
                    <span :class="[{'isClickStyle':isClick6},'headLeftBtn']" @click="deleteDrawCommon()">删除</span>
                    <span :class="[{'isClickStyle':isClick7},'headLeftBtn']" style="margin-left:20px;" @click="saveDraw()">保存</span>
                    <span :class="[{'isClickStyle':isClick8},'headLeftBtn']" style="background:#fff !important;" @click="cancleAll()">取消</span>
                </div> -->
                <div class="headMiddle">
                    <label>测试总数：{{itemSubmitCount}} </label>
                    <label>报警：{{isAlertNum}}</label>
                    <label>故障：{{isBrokenNum}}</label>
                </div>
                <!-- v-show="editInspectMethodEdit" -->
                <div class="headRight" >
                    <span class="autoImportTxt">采集方式:</span>
                    <div class="import2">
                        <select v-model="importMethod" @change="importMethodChange()" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                    </div>
                    <!-- &&importDataEdit -->
                        <span v-show="importMethod==1" class="import" @click="handExportExcel()">导入</span>
                        <!-- &&importDataEdit -->
                        <span v-show="importMethod==2" @click="autoAcquisitionBtn()" class="import">配置</span>
                        <!-- v-show="exportDataEdit" -->
                        <span class="import1"  @click="getImportHistory">导出</span>
                        <!-- v-show="exportDataEdit" -->
                         <span class="import2" @click="downExcel()"  >导出Excel</span>
                </div>
            </div>
            <div class="projectBodyCenter">
                <!-- <div class="operateTool">
                    <div class="operateToolLeft" v-show="toolShow">
                        <span class="move" @click="enableMoveCommon"><i class="moveIcon"><label class="moveTxt">移动</label></i></span>
                        <span v-show="broken==0" class="fault" @click="changeBroken(1)"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                        <span v-show="broken==1"  class="fault1"  @click="changeBroken(0)" ><i class="faultIcon"><label class="faultTxt">修复</label></i></span>
                        <span class="deleteDraw" @click="deleteDrawCommon"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                    </div>
                    <div class="operateToolRight" v-show="saveDrawShow" >
                        <label class="saveDrawTxt" @click="saveDraw()">保存</label>
                    </div>
                </div> -->
                <div class="planeFigureGround" style="padding: 0px; overflow: auto;">
                    <picView ref="pic" @load_points="getAllMonitorPoint" @finish="drawFinish" @status_changed="picView_status_changed" @Broken_changed="brokenChanged" :para="paramsInfo"></picView>
                </div>
                <div class="rightBottomCheck">
                        <!-- <el-checkbox v-model="picMark" style="display:block;width:120px;text-align:left">显示照片被标记</el-checkbox> -->
                        <el-checkbox v-model="displaySpotNum" @change="displaySubmitSpot()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">显示点位读数</el-checkbox>
                </div>
                
            </div>
            <div class="projectBodyBottom">
                <!-- <div><button id >导出excel表</button></div> -->
                <div class="bottomTabel">
                    <table id="bottomTableList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">测点编号</th>
                                <th v-show="itemMonitorType!=3" colspan="2">初始采集</th>
                                <th v-show="itemMonitorType==3" colspan="3">初始采集</th>
                                <th v-show="itemMonitorType!=3" colspan="2">上次采集</th>
                                 <th v-show="itemMonitorType==3" colspan="3">上次采集</th>
                                <th v-show="itemMonitorType!=3" colspan="2">本次采集</th>
                                <th v-show="itemMonitorType==3" colspan="3">本次采集</th>
                                <th colspan="3">变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>采集时间</th>
                                <th v-show="itemMonitorType==1">位移(mm)</th>
                                <th v-show="itemMonitorType==2">高程(m)</th>
                                <th v-show="itemMonitorType==3">测量值(m)</th>
                                <th v-show="itemMonitorType==3">管口高(m)</th>
                                <th v-show="itemMonitorType==4">受力(kN)</th>
                                <th>采集时间</th>
                                <th v-show="itemMonitorType==1">位移(mm)</th>
                                <th v-show="itemMonitorType==2">高程(m)</th>
                                <th v-show="itemMonitorType==3">测量值(m)</th>
                                <th v-show="itemMonitorType==3">管口高(m)</th>
                                <th v-show="itemMonitorType==4">受力(kN)</th>
                                <th>采集时间</th>
                                <th v-show="itemMonitorType==1">位移(mm)</th>
                                <th v-show="itemMonitorType==2">高程(m)</th>
                                <th v-show="itemMonitorType==3">测量值(m)</th>
                                <th v-show="itemMonitorType==3">管口高(m)</th>
                                <th v-show="itemMonitorType==4">受力(kN)</th>
                                <th>变化时间</th>
                                <th v-show="itemMonitorType!=4&&itemMonitorType!=3">本次(mm)</th>
                                <th v-show="itemMonitorType==4">本次(kN)</th>
                                <th v-show="itemMonitorType==3">本次(cm)</th>
                                <th v-show="itemMonitorType!=4&&itemMonitorType!=3">累计(mm)</th>
                                <th v-show="itemMonitorType==4">累计(kN)</th>
                                <th v-show="itemMonitorType==3">累计(cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getPointDatasList1" :key="index"> 
                                <td>{{item.pointName|addSprit()}}</td>
                                <td>{{item.initAcquisitionTime|timeChange()}}</td>
                                <td v-show="itemMonitorType==1" >{{item.initData|addSpritNum2()}}</td>
                                <td v-show="itemMonitorType!=1" >{{item.initData|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.initPipeHeight|addSpritNum1()}}</td>
                                <td >{{item.lastAcquisitionTime|timeChange()}}</td>
                                <td v-show="itemMonitorType==1" >{{item.lastData|addSpritNum2()}}</td>
                                <td v-show="itemMonitorType!=1" >{{item.lastData|addSpritNum1()}}</td>
                                 <td v-show="itemMonitorType==3">{{item.lastPipeHeight|addSpritNum1()}}</td>
                                <td>{{item.latestAcquisitionTime|timeChange()}}</td>
                                <td v-show="itemMonitorType==1">{{item.latestData|addSpritNum2()}}</td>
                                <td v-show="itemMonitorType!=1">{{item.latestData|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.latestPipeHeight|addSpritNum1()}}</td>
                                <td>{{item.variationTime|timeStamp()}}</td>
                                <td v-show="itemMonitorType==1">{{item.recentVariation|addSpritNum2()}}</td>
                                <!-- item.recentVariation*1000 -->
                                <td v-show="itemMonitorType!=4&&itemMonitorType!=3&&itemMonitorType!=1">{{item.recentVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==4">{{item.recentVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.recentVariation*100|addSpritNum1()}}</td>
                                 <td v-show="itemMonitorType==1">{{item.recentVariation|addSpritNum2()}}</td>
                                 <!-- item.totalVariation*1000 -->
                                <td v-show="itemMonitorType!=4&&itemMonitorType!=3&&itemMonitorType!=1">{{item.totalVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==4">{{item.totalVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.totalVariation*100|addSpritNum1()}}</td>
                                <td>
                                    <i class="el-icon-time" style="color:red;width:18px;height:18px;cursor:pointer;margin-right:3px;" @click="editTime(item.pointId)"></i>
                                    <i class="el-icon-warning" style="color:red;width:18px;height:18px;cursor:pointer" @click="editWarn(item.pointId)"></i>
                                    <!-- <button title="定位" class="location actionBtn"></button> -->
                                    <button title="变化曲线" @click="getCurve(item.pointId,item.pointName,null)" class="curve actionBtn"></button>
                                    <i class="el-icon-date" title="累计变化曲线" style="color:red;width:18px;height:18px;cursor:pointer;margin-left:12px;" @click="getAllCurve(item.pointId)"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bottomTabelPagination">
                    <div class="paginationLeft">
                        <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">报警值：</label>
                        <!-- <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertDay">单次{{changeAlertDay}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm/天</label><label v-show="itemMonitorType==2||itemMonitorType==3">m/天</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertHour">{{changeAlertHour}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm/时</label><label v-show="itemMonitorType==2||itemMonitorType==3">m/时</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertTotal">累计{{changeAlertTotal}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm</label><label v-show="itemMonitorType==2||itemMonitorType==3">m</label><label v-show="itemMonitorType==4">KN</label></label> -->
                        </span>
                        <span class="leftBtnOne" v-show="editAlertEdit" @click="editAlertValueBtn()">修改</span>
                        <span class="leftTxtTwo">
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">观测：</label><label style="color:#333;font-size:14px;line-height:62px">{{observerName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">计算：</label><label style="color:#333;font-size:14px;line-height:62px">{{calculatorName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">检核：</label><label style="color:#333;font-size:14px;line-height:62px">{{inspectorName}}</label>
                        </span>
                        <span class="leftBtnOne" v-show="editAlertEdit" @click="editPersonBtn()">修改</span>
                    </div>
                    <div class="paginationRight">
                        <el-pagination class="elPagination"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage2"
                            :page-sizes="[10,20,30]"
                            :page-size="1"
                            layout="sizes,prev, pager, next"
                            :total="getPointDatasListLength">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="修改监测内容相关人员" width="400px" :visible="editPersonShow" @close="editPersonCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText">观测员</label>
                        <select v-model="observerId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">计算员</label>
                        <select v-model="calculatorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">核查员</label>
                        <select v-model="inspectorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.name"></option>
                        </select>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editPersonMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editPersonCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改报警值" width="600px" :visible="editAlertValueShow" @close="editAlertValueCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText" style="width:27% !important">累计报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertTotal" class="inp" style="width:200px !important;height:32px !important"/>
                        <label v-show="itemMonitorType!=4">mm</label><label v-show="itemMonitorType==4">KN</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量(天)：</label>
                        <input placeholder="请输入" v-model="variationAlertDay" class="inp" style="width:200px !important;height:32px !important"/>
                        <label v-show="itemMonitorType!=4">mm</label><label v-show="itemMonitorType==4">kN/d</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量(时)：</label>
                        <input placeholder="请输入" v-model="variationAlertHour" class="inp" style="width:200px !important;height:32px !important"/>
                        <label v-show="itemMonitorType!=4">mm</label><label v-show="itemMonitorType==4">KN/h</label>
                    </div>
                    <!-- <div class="editBodytwo">
                        <label class="editInpText">单次报警变化量：</label>
                    </div> -->
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editAlertArgumentsMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editAlertValueCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="底图管理" :visible="baseMapShow" @close="baseMapCancle()" width="740px">
                <div class="baseMapBody">
                    <ul class="clearfix" style="margin:0px 20px 0px 20px;">
                        <li class="baseMapBodyLi" @mouseenter="enter(item.id)" @mouseleave="leave()" @click="selectCurBaseMap(item.id)" style="padding: 0px; overflow: hidden;" v-for="(item,index) in baseCommonMapList" :key="index">
                            <img v-show="item.relativeUri.substr(item.relativeUri.length-3)=='jpg'||item.relativeUri.substr(item.relativeUri.length-3)=='png'" style="object-fit: contain;" class="baseMapBodyImg" :src="QJFileManageSystemURL+item.relativeUri">
                            <pdf v-show="item.relativeUri.substr(item.relativeUri.length-3)=='pdf'||item.relativeUri.substr(item.relativeUri.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+item.relativeUri"></pdf>
                            <div class="baseMapBodyLiBottom" v-show="item.id==hoverId">
                                <label class="baseMapName" v-text="item.name"></label>
                                <label v-show="item.useCount!=0" class="baseMapCount" >在用{{item.useCount}}</label>
                                <label v-show="item.useCount==0" class="deleteBaseMap" @click.stop="deleteBaseMap(item.id)"></label>
                            </div>
                        </li>
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
            <el-dialog width="1000px" title="测点变化曲线" :visible="spotChangeLineShow" @close="spotChangeLineCancle()" >
                    <div style="margin-bottom:20px;">
                        <el-date-picker
                            v-model="selectValue"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">                         
                        </el-date-picker>
                        <span class="searchBtn" @click="makeSureData()">确认</span>

                        <!-- <el-date-picker
                            v-model="startValue"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>

                         <el-date-picker
                            v-model="endValue"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker> -->
                    </div>
                    <!-- <div v-if="searchSpotChangeLineShow">
                        <vue-highcharts  id="searchSpotChangeLine" style="max-height:900px"  :options="searchOptionSpotChangeLine" ref="searchSpotChangeLine"></vue-highcharts>
                    </div> -->
                    <div v-if="spotChangeLineShow">
                        <vue-highcharts  id="spotChangeLine" style="max-height:900px"  :options="optionSpotChangeLine" ref="spotChangeLine"></vue-highcharts>
                    </div>
            </el-dialog>

            <el-dialog width="1000px" title="测点累计变化曲线" :visible="spotChangeLineShow1" @close="spotChangeLineCancle1()" >
                    <div style="margin-bottom:20px;">
                        <el-date-picker
                            v-model="selectValue1"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                           >                         
                        </el-date-picker>
                        <span class="searchBtn" @click="makeSureData1()">确认</span>
                    </div>
                    <div v-if="spotChangeLineShow1">
                        <vue-highcharts  id="spotChangeLine1" style="max-height:900px"  :options="optionSpotChangeLine1" ref="spotChangeLine1"></vue-highcharts>
                    </div>
            </el-dialog>


            <el-dialog title="自动采集配置" :visible="autoAcquisitionShow" width="800px" @close="autoAcquisitionCancle()">
                <div class="editBody" >
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">采集设备厂家：</label><select class="gatherTimeName" @click="manufacturerChange" v-model="manufacturerValue" placeholder="请选择"><option v-for="(item,index) in manufacturerList" :value="item.value" :key="index" v-text="item.label"></option></select>
                    </div>
                    <div class="editBodytwo" v-show="manufacturerValue=='华桓'"><label class="editInpText" style="width:18% !important;">项目ID：</label><input v-model="nodeId" class="gatherTimeNameInp"/>
                    </div>
                    <div v-show="manufacturerValue!='轴力'&&manufacturerValue!='水位'&&manufacturerValue!='竖直位移'&&manufacturerValue!='水平位移'" class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集频率：</label>
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
                             <!-- <span class="export" @click="clearDeviceMonitorPointRelation()"><label class="export3"></label><label class="exportTxt">测试</label></span> -->
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
                    <div class="editBodytwo" v-show="manufacturerValue=='华桓'">
                        <label class="editInpText" style="width:10% !important;">点位映射</label>
                         <div class="tool">
                             <span class="export" @click="autoExport()"><label class="export1"></label><label class="exportTxt" >导入</label></span>
                             <span class="export" @click="clearDeviceMonitorPointRelation()"><label class="export2"></label><label class="exportTxt">清空</label></span>
                             <span class="export" @click="textDeviceMonitorPointRelation()"><label class="export3"></label><label class="exportTxt">测试</label></span>
                        </div>
                        <div id="toolTbale" style="height:300px">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px">点位名称</th>
                                        <th width="300px">华桓点位名称</th>
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
                    <div class="editBodytwo" v-show="manufacturerValue=='轴力'">
                        <label class="editInpText" style="width:13% !important;">轴力配置</label>
                         <div class="tool">
                             <!-- <span class="export" style="width:90px" @click="forceWaySetting()"><label class="el-icon-setting"></label><label class="exportTxt" style="width:80px">公式设定</label></span> -->
                             <span class="export"  @click="addForce()"><label class="el-icon-circle-plus"></label><label class="exportTxt"  >新增</label></span>
                        </div>
                        <div id="toolTbale" style="height:300px">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="50px" rowspan="2">点位名称</th>
                                        <th width="100px" rowspan="2">计算公式</th>
                                        <!-- <th width="20px" rowspan="2">率定系数</th> -->
                                        <th  colspan="3">设备1</th>
                                        <th colspan="3">设备2</th>
                                        <th colspan="3">设备3</th>
                                        <th colspan="3">设备4</th>
                                        <th width="80px" rowspan="2">操作</th>
                                    </tr>
                                    <tr>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">率定系数</th>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">率定系数</th>

                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">率定系数</th>

                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">率定系数</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getForceBindInfoList" :key="index">
                                       <!-- <td v-text="item.pointId"></td> -->
                                       <td >{{getPointName(item.pointId)}}</td>
                                       <td :title="getFormName(item.useFormula)">{{getFormName(item.useFormula)}}</td>
                                       <!-- <td v-text="item.k"></td> -->

                                       <td v-text="item.deviceId"></td>
                                       <td v-text="item.port"></td>
                                       <td v-text="item.k1"></td>

                                       <td v-text="item.deviceId2"></td>
                                       <td v-text="item.port2"></td>
                                       <td v-text="item.k2"></td>

                                       <td v-text="item.deviceId3"></td>
                                       <td v-text="item.port3"></td>
                                       <td v-text="item.k3"></td>

                                       <td v-text="item.deviceId4"></td>
                                       <td v-text="item.port4"></td>
                                       <td v-text="item.k4"></td>
                                       <td>
                                           <button title="删除" @click="DeleteAutoForce(item.id)"  class="deleteBtn actionBtn"></button>
                                            <!-- v-show="editInspectWordEdit" -->
                                            <button title="编辑" @click="editAutoForce(item.id)"   class="editBtn actionBtn"></button>
                                       </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="editBodytwo" v-show="manufacturerValue=='水位'">
                        <label class="editInpText" style="width:10% !important;">点位映射</label>
                         <div class="tool">
                             <span class="export" @click="addWaterLevel()"><label class="el-icon-circle-plus"></label><label class="exportTxt" >新增</label></span>
                        </div>
                        <div id="toolTbale" style="height:300px">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px" rowspan="2">点位名称</th>
                                        
                                        <!-- <th rowspan="2">初始频率</th> -->
                                        <th rowspan="2">率定系数</th>
                                        <th rowspan="2">水位深度</th>
                                        <th rowspan="2">管口标高</th>
                                        <th  colspan="2">设备</th>
                                        <th  width="100px" rowspan="2">操作</th>
                                    </tr>
                                    <tr>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in WaterLevelList" :key="index">
                                        <td>{{getPointName(item.pointId)}}</td>
                                        <!-- <td v-text="item.f0"></td> -->
                                        <td v-text="item.k"></td>
                                        <td v-text="item.h"></td>
                                        <td v-text="item.pipeHeight"></td>
                                        <td v-text="item.deviceId"></td>
                                        <td v-text="item.port"></td>
                                        <td>
                                             <button title="删除" @click="DeleteAutoWaterLevel(item.id)"  class="deleteBtn actionBtn"></button>
                                            <!-- v-show="editInspectWordEdit" -->
                                            <button title="编辑" @click="editAutoWaterLevel(item.id)"   class="editBtn actionBtn"></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="editBodytwo" v-show="manufacturerValue=='竖直位移'">
                        <label class="editInpText" style="width:10% !important;">竖直位移</label>
                         <div class="tool">
                             <span class="export" @click="addVerticalDisplace()"><label class="el-icon-circle-plus"></label><label class="exportTxt" >新增</label></span>
                        </div>
                        <div id="toolTbale" style="height:300px">

                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px" rowspan="2">点位名称</th>
                                        <th colspan="4">绑定点位设备</th>
                                        <th colspan="4">基准点位设备</th>
                                        <th  width="100px" rowspan="2">操作</th>
                                    </tr>
                                    <tr>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">传感器地址</th>
                                        <th width="50px">传感器编号(华桓)</th>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">传感器地址</th>
                                        <th width="50px">传感器编号(华桓)</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getVerticalBindInfoList" :key="index">
                                        <!-- <td v-text="item.pointId"></td> -->
                                        <td >{{getPointName(item.pointId)}}</td>
                                        <td v-text="item.systemId"></td>
                                        <td v-text="item.channelNo"></td>
                                        <td v-text="item.sensorAddress"></td>
                                        <td v-text="item.hhSensorNo"></td>

                                        <td v-text="item.baseSystemId"></td>
                                        <td v-text="item.baseChannelNo"></td>
                                        <td v-text="item.baseSensorAddress"></td>
                                        <td v-text="item.hhBaseSensorNo"></td>
                                        <td>
                                            <button title="删除" @click="DeleteAutoVerticalHeight(item.id)"  class="deleteBtn actionBtn"></button>
                                            <button title="编辑" @click="editAutoVerticalHeight(item.id)" class="editBtn actionBtn"></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div class="editBodytwo" v-show="manufacturerValue=='水平位移'">
                        <label class="editInpText" style="width:10% !important;">水平位移</label>
                         <div class="tool">
                             <span class="export" @click="addHorizontalDisplace()"><label class="el-icon-circle-plus"></label><label class="exportTxt" >新增</label></span>
                        </div>
                        <div id="toolTbale" style="height:300px">

                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px">点位名称</th>
                                        <td width="50px">初始位移</td>
                                        <th width="50px">ID</th>
                                        <th width="50px">端口</th>
                                        <th width="50px">传感器地址</th>
                                        <th  width="100px">操作</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getHorizontalDisplaceList" :key="index">
                                        <td >{{getPointName(item.pointId)}}</td>
                                        <td>{{item.initShift}}</td>
                                        <td>{{item.systemId}}</td>
                                        <td>{{item.channelNo}}</td>
                                        <td>{{item.sensorAddress}}</td>
                                        <!-- <td v-text="item.systemId"></td>
                                        <td v-text="item.channelNo"></td>
                                        <td v-text="item.sensorAddress"></td>
                                        <td v-text="item.baseSystemId"></td>
                                        <td v-text="item.baseChannelNo"></td>
                                        <td v-text="item.baseSensorAddress"></td> -->
                                        <td>
                                            <button title="删除" @click="DeleteAutoHorizontal(item.id)"  class="deleteBtn actionBtn"></button>
                                            <button title="编辑" @click="editAutoHorizontal(item.id)"  class="editBtn actionBtn"></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                </div>
                <div slot="footer" class="dialog-footer">
                        <button v-show="manufacturerValue!='轴力'&&manufacturerValue!='水位'&&manufacturerValue!='竖直位移'&&manufacturerValue!='水平位移'" class="editBtnS" @click="autoAcquisitionMakeSure()" >确定</button>
                        <button class="editBtnC" @click="autoAcquisitionCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="采集测试" :visible="textShow" @close="textShowCancle()" >
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText" style="width:37% !important;" >成果获取到{{collectGroupAmount}}组数据,匹配到{{matchGroupAmount}}组数据</label>
                    </div>
                    <div class="editBodytwo">
                        <div id="textBody">
                           <table class="textBodyTable" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                               <thead>
                                   <tr>
                                       <th></th>
                                       <th colspan="2">系统内最新记录</th>
                                       <th colspan="2">获取到的匹配记录</th>
                                   </tr>
                                   <tr>
                                       <th>点位编号</th>
                                       <th>采集时间</th>
                                       <th>取值</th>
                                        <th>采集时间</th>
                                       <th>取值</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   <tr v-for="(item,index) in testHuahuanList" :key="index">
                                       <td v-text="item.pointName"></td>
                                       <td >{{item.systemCollectTime|timeChange}}</td>
                                       <td>{{item.systemValue}}</td>
                                       <td>{{item.matchCollectTime|timeChange}}</td>
                                       <td>{{item.matchValue}}</td>
                                   </tr>

                               </tbody>
                           </table>

                        </div>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                        <!-- <button class="editBtnS" @click="autoAcquisitionMakeSure()" >确定</button> -->
                        <button style="margin-right:-440px" class="editBtnC" @click="textShowCancle()" >取消</button>
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

            <el-dialog title="轴力配置" :visible="addForceShow" @close="cancleForce">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                        <select v-model="forcePointId" @change="forceChange()" class="sheetName">
                             <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">计算公式:</label>
                        <select v-model="useFormulaValues" class="sheetName">
                             <option v-for="(item,index) in useFormulaLists"  :value="item.value" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div v-show="useFormulaValues=='1'">
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的截面积As:</label>
                            <input placeholder="请输入" v-model="AsValue" class="editInput"/>
                            <label>平方毫米</label>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的弹性模量Es:</label>
                            <input placeholder="请输入" v-model="EsValue" class="editInput"/>
                            <label>千帕</label>
                        </div>
                    </div>
                     <div v-show="useFormulaValues=='2'">
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">钢筋直径(mm)：</label>
                            <input placeholder="请输入" v-model="barDiameterValue" @change="asMethod()" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">根数：</label>
                            <input placeholder="请输入" v-model="barCountValue"  class="editInput"/>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">截面积As：</label>
                            <input placeholder="请输入" v-model="asValueArea"  class="editInput"/>
                        </div>
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">钢筋应力计的截面积As'：</label>
                            <input placeholder="请输入" class="editInput"/>
                            <label>平方毫米</label>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">钢筋的牌号：</label>
                            <select class="eidtSelect" @change="esChange(barGradeValue)" v-model="barGradeValue">
                                <option  v-for="(item,index) in esList"  :value="item.name" :key="index" v-text="item.name"></option>
                            </select>
                            <!-- <i class="sanjiaoicon"></i> -->
                            <!-- <input placeholder="请输入" v-model="barGradeValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Es：</label><label>{{esValue}}</label>
                        </div>
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑宽度(mm)：</label>
                            <input placeholder="请输入" v-model="concreteWidthValue" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑高度(mm)： ：</label>
                            <input placeholder="请输入" v-model="concreteHeightValue" @change="acMethod()" class="editInput"/>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土截面积Ac：</label>
                            <input placeholder="请输入" v-model="acValueArea" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土的等级：</label>
                            <select placeholder="请选择" class="eidtSelect" @change="ecChange(concreteLevelValue)" v-model="concreteLevelValue">
                                <option v-for="(item,index) in ecList" :value="item.name"  :key="index" v-text="item.name"></option>
                            </select>
                             <!-- <i class="sanjiaoicon1"></i> -->
                            <!-- <input placeholder="请输入" v-model="concreteLevelValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Ec:</label><label>{{ecValue}}</label>
                        </div>
                    </div>

                    <!-- <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">率定系数:</label>
                        <input placeholder="率定系数" v-model="k" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div> -->
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>

                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备1:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data1" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备2:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备3:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备4:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeForceSure">确认</button>
                    <button class="editBtnC" @click="cancleForce">取消</button>
                </div>
            </el-dialog>

             <el-dialog title="编辑轴力配置" :visible="editAutoForceShow" @close="editCancleForce">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                        <select v-model="forcePointId" :disabled="true" class="sheetName">
                             <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">计算公式:</label>
                        <select v-model="useFormulaValues" class="sheetName">
                             <option v-for="(item,index) in useFormulaLists"  :value="item.value" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div v-show="useFormulaValues=='1'">
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的截面积As:</label>
                            <input placeholder="请输入" v-model="AsValue" class="editInput"/>
                            <label>平方毫米</label>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的弹性模量Es:</label>
                            <input placeholder="请输入" v-model="EsValue" class="editInput"/>
                            <label>千帕</label>
                        </div>
                    </div>
                     <div v-show="useFormulaValues=='2'">
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">钢筋直径(mm)：</label>
                            <input placeholder="请输入" v-model="barDiameterValue" @change="asMethod()" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">根数：</label>
                            <input placeholder="请输入" v-model="barCountValue"  class="editInput"/>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">截面积As：</label>
                            <input placeholder="请输入" v-model="asValueArea"  class="editInput"/>
                        </div>
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">钢筋应力计的截面积As'：</label>
                            <input placeholder="请输入" class="editInput"/>
                            <label>平方毫米</label>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">钢筋的牌号：</label>
                            <select class="eidtSelect" @change="esChange(barGradeValue)" v-model="barGradeValue">
                                <option  v-for="(item,index) in esList"  :value="item.name" :key="index" v-text="item.name"></option>
                            </select>
                            <!-- <i class="sanjiaoicon"></i> -->
                            <!-- <input placeholder="请输入" v-model="barGradeValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Es：</label><label>{{esValue}}</label>
                        </div>
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑宽度(mm)：</label>
                            <input placeholder="请输入" v-model="concreteWidthValue" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑高度(mm)： ：</label>
                            <input placeholder="请输入" v-model="concreteHeightValue" @change="acMethod()" class="editInput"/>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土截面积Ac：</label>
                            <input placeholder="请输入" v-model="acValueArea" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土的等级：</label>
                            <select placeholder="请选择" class="eidtSelect" @change="ecChange(concreteLevelValue)" v-model="concreteLevelValue">
                                <option v-for="(item,index) in ecList" :value="item.name"  :key="index" v-text="item.name"></option>
                            </select>
                             <!-- <i class="sanjiaoicon1"></i> -->
                            <!-- <input placeholder="请输入" v-model="concreteLevelValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Ec:</label><label>{{ecValue}}</label>
                        </div>
                    </div>

                    <!-- <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">率定系数:</label>
                        <input placeholder="率定系数" v-model="k" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div> -->
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>

                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备1:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data1" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备2:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data2" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备3:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data3" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                     <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备4:</label>
                        <input placeholder="设备ID" class="inp" v-model="deviceId4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="port4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="率定系数" class="inp" v-model="data4" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditForceSure">确认</button>
                    <button class="editBtnC" @click="editCancleForce">取消</button>
                </div>
            </el-dialog>

            <el-dialog title="水位配置" :visible="addWaterLevelShow" @close="waterLevelCancle()">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                        <select v-model="forcePointId" class="sheetName">
                             <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeWaterTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">率定系数:</label>
                        <input placeholder="率定系数" v-model="wLevelK" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">水位深度:</label>
                        <input placeholder="水位深度" v-model="wLevelH" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">管口标高:</label>
                        <input placeholder="管口标高" v-model="wLevelPipeH" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备:</label>
                        <input placeholder="设备ID" class="inp" v-model="wLevelDeviceId" style="width:185px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="wLevelPort" style="width:185px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeWaterLevelSure">确认</button>
                    <button class="editBtnC" @click="waterLevelCancle">取消</button>
                </div>
            </el-dialog>

             <el-dialog title="修改水位配置" :visible="editWaterLevelShow" @close="editwaterLevelCancle()">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                        <select v-model="forcePointId" class="sheetName">
                             <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeWaterTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">率定系数:</label>
                        <input placeholder="率定系数" v-model="wLevelK" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">水位深度:</label>
                        <input placeholder="水位深度" v-model="wLevelH" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">管口标高:</label>
                        <input placeholder="管口标高" v-model="wLevelPipeH" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">设备:</label>
                        <input placeholder="设备ID" class="inp" v-model="wLevelDeviceId" style="width:185px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="wLevelPort" style="width:185px !important;height:30px !important;margin-right:10px;"/>
                     </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditWaterLevelSure">确认</button>
                    <button class="editBtnC" @click="editwaterLevelCancle">取消</button>
                </div>
            </el-dialog>

            <el-dialog title="垂直位移配置" :visible="addVerticalDisplaceShow" @close="VerticalDisplaceCancle" >
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">厂家设备:</label>
                            <select v-model="equipmentType" class="sheetName">
                                <option v-for="(item,index) in equipmentList"  :value="item.value" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                            <select v-model="forcePointId" @change="changeVerticalPoint()" class="sheetName">
                                <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                            </select>
                    </div>
                   
                    <div v-show="equipmentType==1">
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">初始高度:</label>
                            <input placeholder="初始高度" v-model="initalHeight" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位设备:</label>
                            <input placeholder="设备ID" class="inp" v-model="systemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="端口号" class="inp" v-model="channelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="传感器地址" class="inp" v-model="sensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">基准点位设备:</label>
                            <input placeholder="设备ID" class="inp" v-model="baseSystemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="端口号" class="inp" v-model="baseChannelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="传感器地址" class="inp" v-model="baseSensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                    </div>
                    <div v-show="equipmentType==2">
                         <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">筛选初始时间:</label>
                            <el-date-picker
                                v-model="selectInitTimeValue"
                                type="daterange"
                                :clearable='false'
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" @change="selectInitTime()" format="yyyy-MM-dd"  value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                        <div v-show="selectInitTimeValue">
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">绑定点位初始时间:</label>
                                    <select v-model="hhInitDataTime" @change="hhInitDataChange()"  class="sheetName">
                                        <option v-for="(item,index) in bindPointInitList"  :value="item.collectTime" :key="index">{{item.collectTime|timeChange}}</option>
                                    </select>
                            </div>
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">绑定点位初始高度:</label>
                                    <input placeholder="初始高度" :disabled="true" v-model="hhInitData" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                            </div>
                            <div class="editBodytwo">
                                <label class="editInpText" style="width:18% !important;">基准点位初始时间:</label>
                                <select v-model="hhBaseInitDataTime" @change="hhBaseInitDataChange()" class="sheetName">
                                    <option v-for="(item,index) in basePointInitList"  :value="item.collectTime" :key="index">{{item.collectTime|timeChange}}</option>
                                </select>
                            </div>
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">基准点位初始高度:</label>
                                    <input placeholder="初始高度" :disabled="true" v-model="hhBaseInitData" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                            </div>
                        </div>

                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定传感器编号:</label>
                            <input placeholder="绑定点位传感器编号" v-model="hhSensorNo" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">基准传感器编号:</label>
                            <input placeholder="基准点位传感器编号" v-model="hhBaseSensorNo" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>

                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="makeVerticalDisplaceSure">确认</button>
                        <button class="editBtnC" @click="VerticalDisplaceCancle">取消</button>
                </div>
            </el-dialog>

            <el-dialog title="修改垂直位移配置" :visible="editVerticalDisplaceShow" @close="editVerticalDisplaceCancle" >
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">厂家设备:</label>
                            <select v-model="equipmentType" class="sheetName">
                                <option v-for="(item,index) in equipmentList"  :value="item.value" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                            <select v-model="forcePointId" class="sheetName">
                                <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                            </select>
                    </div>
                   
                    <div v-show="equipmentType==1">
                         <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">初始时间:</label>
                            <select v-model="selectTimeValue" @change="changeVerticalTimeValue()" class="sheetName">
                                <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                            </select>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">初始高度:</label>
                            <input placeholder="初始高度" v-model="initalHeight" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位设备:</label>
                            <input placeholder="设备ID" class="inp" v-model="systemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="端口号" class="inp" v-model="channelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="传感器地址" class="inp" v-model="sensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">基准点位设备:</label>
                            <input placeholder="设备ID" class="inp" v-model="baseSystemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="端口号" class="inp" v-model="baseChannelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                            <input placeholder="传感器地址" class="inp" v-model="baseSensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                    </div>
                    <div v-show="equipmentType==2">
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">筛选初始时间:</label>
                            <el-date-picker
                                v-model="selectInitTimeValue"
                                :clearable='false'
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" @change="selectInitTime1()" format="yyyy-MM-dd"  value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                        <div >
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">绑定点位初始时间:</label>
                                    <input v-if="bindPointInitList.length==0" placeholder="请筛选时间" :disabled="true" v-model="hhInitDataTime1" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                                    <select v-if="bindPointInitList.length!=0" v-model="hhInitDataTime" @change="hhInitDataChange()"  class="sheetName">
                                        <option v-for="(item,index) in bindPointInitList"  :value="item.collectTime" :key="index">{{item.collectTime|timeChange}}</option>
                                    </select>
                            </div>
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">绑定点位初始高度:</label>
                                    <input placeholder="初始高度" :disabled="true" v-model="hhInitData" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                            </div>
                            <div class="editBodytwo">
                                <label class="editInpText" style="width:18% !important;">基准点位初始时间:</label>
                                <input v-if="basePointInitList.length==0" placeholder="请筛选时间" :disabled="true" v-model="hhBaseInitDataTime1" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                                <select v-if="basePointInitList.length!=0" v-model="hhBaseInitDataTime" @change="hhBaseInitDataChange()" class="sheetName">
                                    <option v-for="(item,index) in basePointInitList"  :value="item.collectTime" :key="index">{{item.collectTime|timeChange}}</option>
                                </select>
                            </div>
                            <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">基准点位初始高度:</label>
                                    <input placeholder="初始高度" :disabled="true" v-model="hhBaseInitData" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                            </div>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定传感器编号:</label>
                            <input placeholder="绑定点位传感器编号" v-model="hhSensorNo" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">基准传感器编号:</label>
                            <input placeholder="基准点位传感器编号" v-model="hhBaseSensorNo" class="inp" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                        </div>

                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="makeEditVerticalDisplaceSure">确认</button>
                        <button class="editBtnC" @click="editVerticalDisplaceCancle">取消</button>
                </div>
            </el-dialog>


            <el-dialog title="水平位移配置" :visible="addHorizontalDisplaceShow" @close="horizontalDisplaceCancle" >
                <div class="editBody">
                    <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                            <select v-model="forcePointId" class="sheetName">
                                <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                            </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始位移:</label>
                         <input placeholder="初始位移" class="inp" v-model="horInitalValue" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位设备:</label>
                        <input placeholder="设备ID" class="inp" v-model="horSystemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="horChannelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="传感器地址" class="inp" v-model="horSensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="makeHorizontalDisplaceSure">确认</button>
                        <button class="editBtnC" @click="horizontalDisplaceCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="编辑水平位移配置" :visible="editHorizontalDisplaceShow" @close="edithorizontalDisplaceCancle" >
                <div class="editBody">
                    <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                            <select v-model="forcePointId" class="sheetName">
                                <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                            </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始时间:</label>
                        <select v-model="selectTimeValue" @change="changeTimeValue()" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeList"  :value="item" :key="index">{{item|timeChange}}</option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">初始位移:</label>
                         <input placeholder="初始位移" class="inp" v-model="horInitalValue" style="width:375px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">绑定点位设备:</label>
                        <input placeholder="设备ID" class="inp" v-model="horSystemId" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="端口号" class="inp" v-model="horChannelNo" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                        <input placeholder="传感器地址" class="inp" v-model="horSensorAddress" style="width:120px !important;height:30px !important;margin-right:10px;"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editHorizontalDisplaceSure">确认</button>
                        <button class="editBtnC" @click="edithorizontalDisplaceCancle">取消</button>
                </div>
            </el-dialog>

            <!-- <el-dialog title="竖直位移配置" :visible="addVerticalDisplaceShow" @close="VerticalDisplaceCancle" >
                <div class="editBody">
                    <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">绑定点位:</label>
                            <select v-model="forcePointId" class="sheetName">
                                <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                            </select>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="makeVerticalDisplaceSure">确认</button>
                        <button class="editBtnC" @click="VerticalDisplaceCancle">取消</button>
                    </div>
                </div>
            </el-dialog> -->
            <el-dialog title="初始时间设置" :visible="editTimeShow" @close="setInitTimeCancle()">
                <div class="editBody" >
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">选择初始时间:</label>
                        <select v-model="selectTimeValues" class="sheetName">
                             <option v-for="(item,index) in setInitCollectTimeLists"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="makeInitSelectTimeSure">确认</button>
                        <button class="editBtnC" @click="initSelectTimeCancle">取消</button>
                </div>
            </el-dialog>

             <el-dialog title="导出历史数据记录 " :visible="exportHistoryRecoedShow" @close="exportHistoryRecoedCancle()">
                <div class="editBody" >
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">筛选点位:</label>
                        <select v-model="historyPointId" class="sheetName">
                             <option v-for="(item,index) in getDetailPointInfoList"  :value="item.id" :key="index" v-text="item.name"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:18% !important;">筛选时间:</label>
                        <el-date-picker
                                v-model="selectHistoryTimeValue"
                                type="daterange"
                                :clearable='false'
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" format="yyyy-MM-dd"  value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>

                     <!-- <div class="editBodytwo">
                        <div id="toolTbale1" >
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
                    </div> -->
                </div>
                <div slot="footer" class="dialog-footer">
                        <!-- <button class="editBtnS" @click="exportAllRecode()" >导出全部记录</button> -->
                        <button class="editBtnS" @click="exportSelectRecode()">导出历史记录</button>
                </div>
            </el-dialog>

            <el-dialog title="受力计算公式设定" :visible="formulaSettingShow" @close="formulaSettingCancle()">
                <div class="editBody" style="overflow:auto;height:600px">
                    <div class="editBodyone">
                        <el-radio v-model="useFormulaValue" label="1" style="margin-left:50px;">振弦式应变计计算公式：</el-radio>
                    </div>
                    <div v-show="useFormulaValue=='1'">
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的截面积As:</label>
                            <input placeholder="请输入" v-model="AsValue" class="editInput"/>
                            <label>平方毫米</label>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">钢支撑/钢立柱的弹性模量Es:</label>
                            <input placeholder="请输入" v-model="EsValue" class="editInput"/>
                            <label>千帕</label>
                        </div>
                    </div>
                    <div class="editBodytwo">
                       <el-radio v-model="useFormulaValue" label="2" style="margin-left:50px;">混凝土支撑内振弦式钢筋计计算公式：</el-radio>
                    </div>
                    <div v-show="useFormulaValue=='2'">
                        <div class="editBodytwo">
                            <label class="editTxt">钢筋直径(mm)：</label>
                            <input placeholder="请输入" v-model="barDiameterValue" @change="asMethod()" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">根数：</label>
                            <input placeholder="请输入" v-model="barCountValue"  class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">截面积As：{{asValueArea}}</label>
                        </div>
                        <!-- <div class="editBodytwo">
                            <label class="editTxt">钢筋应力计的截面积As'：</label>
                            <input placeholder="请输入" class="editInput"/>
                            <label>平方毫米</label>
                        </div> -->
                        <div class="editBodytwo">
                            <label class="editTxt">钢筋的牌号：</label>
                            <select class="eidtSelect" @change="esChange(barGradeValue)" v-model="barGradeValue">
                                <option  v-for="(item,index) in esList"  :value="item.name" :key="index" v-text="item.name"></option>
                            </select>
                            <i class="sanjiaoicon"></i>
                            <!-- <input placeholder="请输入" v-model="barGradeValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Es：</label><label>{{esValue}}</label>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑宽度(mm)：</label>
                            <input placeholder="请输入" v-model="concreteWidthValue" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑高度(mm)： ：</label>
                            <input placeholder="请输入" v-model="concreteHeightValue" @change="acMethod()" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">截面积Ac：{{acValueArea}}</label>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土的等级：</label>
                            <select placeholder="请选择" class="eidtSelect" @change="ecChange(concreteLevelValue)" v-model="concreteLevelValue">
                                <option v-for="(item,index) in ecList" :value="item.name"  :key="index" v-text="item.name"></option>
                            </select>
                             <i class="sanjiaoicon1"></i>
                            <!-- <input placeholder="请输入" v-model="concreteLevelValue" class="editInput"/> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">对应弹性模量Ec:</label><label>{{ecValue}}</label>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="setFormula()">确定</button>
                    <button class="editBtnC" @click="formulaSettingCancle()" >取消</button>
                </div>
            </el-dialog>
            
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import picView from './picView.vue'
import pdf from 'vue-pdf'
import {method5} from './js/method.js'
import data from '../Settings/js/date';
import VueHighcharts from 'vue2-highcharts'
export default Vue.component('commonDetail',{
    props:['projctName','itemMonitorId','itemSubmitSign','itemMonitorType','userGroupId','itemMonitorKeyWord','paramsListsSub','itemSubmitbaseMapId','itemSubmitCount'],
    components:{
            pdf,picView,VueHighcharts
    },
    name:'commonDetail',
    data(){
        // window.addEventListener("message", (evt)=>{
        //         this.callback(evt)},true
        // );
        return{
            //垂直位移
            initalHeight:'',
            systemId:'',
            channelNo:'',
            sensorAddress:'',
            baseSystemId:'',
            verticalHeightId:'',
            baseChannelNo:'',
            baseSensorAddress:'',
            getVerticalBindInfoList:'',
            hhBaseSensorNo:'',
            hhSensorNo:'',
            //公式设定参数
            setInitCollectTimeList:'',
            setInitCollectTimeLists:'',
            selectTimeValues:'',
            selectTimeValue:'',
            selectInitTimeValue:'',
            bindPointInitList:[],
            basePointInitList:[],
            hhInitData:'',
            hhInitDataTime:'',
            hhInitDataTime1:'',
            hhBaseInitData:'',
            hhBaseInitDataTime:'',
            hhBaseInitDataTime1:'',

            selectInitTimeList:[],
            formulaSettingShow:false,//公式设定
            getFormulaLists:'',

            useFormulaValue:"1",//使用的公式:1-振弦式应变计计算公式；2-混凝土支撑内振弦式钢筋计计算公式
            getFormulaList:'',//获取受力公式
            useFormulaNum:"1",
            useFormulaList:[
                {
                    value:"1",
                    name:"振弦式应变计计算公式"
                },
                {
                    value:"2",
                    name:"混凝土支撑内振弦式钢筋计计算公式"
                }
            ],
            AsValue:null,//钢支撑/钢立柱的截面积
            EsValue:null,//钢支撑/钢立柱的弹性模量
            barDiameterValue:null,//钢筋直径
            asValueArea:null,//as面积
            acValueArea:null,//ac面积
            ecList:[
                {
                    name:'C15',
                    value:22000
                },
                {
                    name:'C20',
                    value:25500
                },
                {
                    name:'C25',
                    value:28000
                },
                {
                    name:'C30',
                    value:30000
                },
                {
                    name:'C35',
                    value:31500
                },
                {
                    name:'C40',
                    value:32500
                },
                {
                    name:'C45',
                    value:33500
                },
                {
                    name:'C50',
                    value:34500
                },
                {
                    name:'C55',
                    value:35500
                },
                {
                    name:'C60',
                    value:36000
                },
                {
                    name:'C65',
                    value:36500
                },
                {
                    name:'C70',
                    value:37000
                },
                {
                    name:'C75',
                    value:37500
                },
                {
                    name:'C80',
                    value:38000
                },
            ],
            //钢筋的牌号
            esList:[
                {
                    name:'HPB235',
                    value:210000
                },
                {
                    name:'HRB335',
                    value:200000
                },
                 {
                    name:'HRB400',
                    value:200000
                },
                 {
                    name:'RRB400',
                    value:200000
                },
            ],
            ecValue:'',
            esValue:'',
            barCountValue:null,//钢筋根数
            concreteWidthValue:null,//混凝土宽度
            concreteHeightValue:null,//混凝土高度
            concreteLevelValue:null,//混凝土等级
            barGradeValue:null,//钢筋牌号
            useFormulaLists:[
                {
                    value:"1",
                    name:"振弦式应变计计算公式"
                },
                {
                    value:"2",
                    name:"混凝土支撑内振弦式钢筋计计算公式"
                }
            ],
            useFormulaValues:"1",
            k:'',
            deviceId:'',
            port:'',
            data1:'',

            forceId:'',

            deviceId2:'',
            port2:'',
            data2:'',

            deviceId3:'',
            port3:'',
            data3:'',

            deviceId4:'',
            port4:'',
            data4:'',

            getForceBindInfoList:'',

            startValue:'',
            endValue:'',
            startValue1:'',
            endValue1:'',
            selectValue1:'',
            selectValue:'',
            broken:0,
            alert:'',
            nodeId:'',//华环的项目id
            testHuahuanList:'',//测试华桓数据
            collectGroupAmount:0,
            matchGroupAmount:0,
            getHuahuanNodeList:"",//获取华环的数据
            picMark:false,
            displaySpotNum:false,
            importMethod:1,
            importList:[
                {
                    value:1,
                    label:'手动导入'
                },
                {
                    value:2,
                    label:'自动采集'
                }
            ],
            collectRateRadio:'1',
            manufacturerValue:'华桓',
            devicePointIndex:'',
            virtualPointIndex:'',
            currentPage2:1,
            getAlertArgumentsList:'',//获取报警参数
            changeAlertDay:'',
            changeAlertHour:'',
            changeAlertTotal:'',
            getPointDatasList:'',//数据表格
            getPointDatasList1:[],
            getPointDatasListLength:0,//数据表格长度
            pointId:'',//监测id
            currentPointId:'',//当前点位id
            pointName:'',//监测名称
            editPersonShow:false,
            editAlertValueShow:false,//编辑报警值
            spotChangeLineShow:false,//取消点位改变曲线
            spotChangeLineShow1:false,//取消点位改变曲线
            getAllCurveList:[],
            getAllCurveName:'',
            autoAcquisitionShow:false,//自动采集配置
            textShow:false,
            uploadshow:false,
            addForceShow:false,

            editAutoForceShow:false,

            addWaterLevelShow:false,
            editWaterLevelShow:false,
            addVerticalDisplaceShow:false,
            editVerticalDisplaceShow:false,
            equipmentType:1,
            equipmentList:[
                {
                    value:1,
                    name:'岩联'
                },
                {
                    value:2,
                    name:'华桓'
                }
            ],
            addHorizontalDisplaceShow:false,//水平位移
            editHorizontalDisplaceShow:false,//编辑水平位移
            horSystemId:'',
            horChannelNo:'',
            horSensorAddress:'',
            horInitalValue:'',
            getHorizontalDisplaceList:'',

            exportHistoryRecoedShow:false,
            idsList:[],
            allCheck:false,
            testShow:false,
            filesList:"",
            getDeviceMonitorPointRelationList:'',//获取点位关系数据
            getSingleSheetTitleInfoList:'',
            imageName:"未选择任何文件",
            acquisitionTimeXlist:[],
            acquisitionTimeXlist1:[],
            getAllCurveId:'',
            acquisitionTimeYlist:'',
            elevationYlist:[],
            elevationYlist1:[],
            userGroupList:'',//监测人员列表
            observerId:"",
            calculatorId:'',
            inspectorId:'',
            observerName:'',
            calculatorName:'',
            inspectorName:'',
            getItemDutyUserList:'',
            variationAlertTotal:'',//报警变化量（累计）
            variationAlertDay:'',//报警变化量（天）
            variationAlertHour:'',//报警变化量（小时）
            commonMonitorMainItemList:'',//监测内容
            curCommonBaseMapUrl:'',//监测地址
            baseCommonMapList:'',
            monitorBaseMapId:'',
            baseMapShow:false,//底图显示
            hoverId:'',
            isClick:false,
            isClick1:false,
            isClick2:false,
            isClick3:false,
            isClick4:false,
            isClick5:false,
            isClick6:false,
            isClick7:false,
            isClick8:false,
            toolShow:false,
            saveDrawShow:false,
            pageSize:10,
            monitorPointInfo:'',
            dataLists:'',
            getDetailPointInfoList:'',
            historyPointId:'',//导出日期
            selectHistoryTimeValue:'',//筛选历史时期
            forcePointId:'',
            fZero:'',
            wLevelK:'',
            wLevelH:'',
            wLevelPipeH:'',
            wLevelDeviceId:'',
            wLevelPort:'',
            WaterLevelList:'',
            waterLevelId:'',

            getImportHistoryList:'',//获取导入历史
            isAlertNum:0,
            isBrokenNum:0,
            getBaseMapInfoByBaseMapIdInfo:'',
            paramsInfo:'',
            angle:0,
            isAlert:'',
            isBroken:'',
            pageNum:1,
            measureName:'',
            measureId:'',
            optionSpotChangeLine:{
                        chart: {
                            // type: 'spline',
                            inverted: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                            tickmarkPlacement: 'on'
                        },
                        yAxis: {
                            // min:4268.5,
                            // max:43403.3542,
                             min:0,
                            max:0,
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                                // tickPixelInterval:1000
                               
                            
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
            optionSpotChangeLine1:{
                        chart: {
                            // type: 'spline',
                            inverted: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
                            tickmarkPlacement: 'on'
                        },
                        yAxis: {
                            min:4268.5,
                            max:43403.3542,
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                                // tickPixelInterval:1000
                               
                            
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
            collectHour:0,//采集时间
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
            projAuth1:[],
            manageEdit:false,
            editInspectMethodEdit:false,
            importDataEdit:false,
            exportDataEdit:false,
            editAlertEdit:false,
            projAuth:'',
            pointNameValue:'',
            pointNumValue:'',
            scaleValue:1,
            editTimeShow:false
        }
    },
    created(){
        var vm = this;
        vm.userName  = localStorage.getItem('userName');
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId');
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.projAuth = localStorage.getItem('projAuth');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        //  vm.projAuth = localStorage.getItem('projAuth')
        this.getPointDatas();
        this.getUserByUserGroup();
        this.getItemDutyUser();
        this.getMonitorItem();
        // this.getAlertArguments();
        this.getBaseMapInfoByBaseMapId();
        this.getDetailPointInfo();
        this.getDetectionItemCollectWay();
        this.checkAuth();
        this.autoFacturerList();
        // this.getUserInfo();
        // console.log(vm.paramsListsSub)
        // this.getBaseMapList();
    },
    filters:{
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        addSpritNum1(val){
            if(val==null){
                return '/'
            }else {
                return val.toFixed(3)
            }
        },
        addSpritNum2(val){
            if(val==null){
                return '/'
            }else {
                return val.toFixed(1)
            }
        },
        
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
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
        userGroupId:function(val){
            this.getBaseMapInfoByBaseMapId();
            this.getAllMonitorPoint();
            // this.getBaseMapList()
        },
        manufacturerValue:function(val){
            this.getDeviceMonitorPointRelation()
        },
        forcePointId:function(val){
            this.getInsertHistoryDate()
        }
    },
    mounted(){
        var vm=this;
        vm.getAllMonitorPoint();
        // setTimeout(() => {
        //     this.displayInspectSpot();
        // }, 1000);
        // console.log(12);
    },
    methods:{
        //得到点位
        getPointName(val){
            // console.log(this.getDetailPointInfoList,'this.getDetailPointInfoList');
            var a;
            this.getDetailPointInfoList.forEach((item)=>{
                if(item.id==val){
                    a=item.name;
                }
            })
            return a;
        },
        getFormName(val){
            var a;
            this.useFormulaLists.forEach((item)=>{
                if(item.value==val){
                    a=item.name;
                }
            })
            return a;
        },
        //触发改变时间
        changeTimeValue(){
            this.getHorizontalDataHistory();
            // this.setInitCollectTime();
        },
        changeVerticalPoint(){
            this.selectInitTimeValue='';
          
            this.selectInitTime();


        },
        //筛选初始时间
        selectInitTime(){
            var startDate=this.selectInitTimeValue[0];
            var endDate=this.selectInitTimeValue[1];
            this.bindPointInitList=[];
            this.basePointInitList=[];
            // this.hhInitData='';
            // this.hhBaseInitData='';
            axios({
                url:this.BDMSUrl+'detectionInfo/getOriginalHHData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.forcePointId,
                    startDate:startDate,
                    endDate:endDate
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.selectInitTimeList=response.data.rt;
                    this.bindPointInitList=this.selectInitTimeList.originalData;
                    if(this.bindPointInitList.length!=0){
                        this.hhInitDataTime=this.bindPointInitList[0].collectTime;
                        this.hhInitData=this.bindPointInitList[0].shift;
                    }
                    this.basePointInitList=this.selectInitTimeList.baseOriginalData;
                    if(this.basePointInitList.length!=0){
                        this.hhBaseInitDataTime=this.basePointInitList[0].collectTime;
                        this.hhBaseInitData=this.basePointInitList[0].shift;
                    }else{
                        this.$message({
                            type:'info',
                            message:'筛选时间无监测数据'
                        })
                    }
                }
            })
        },
        selectInitTime1(){
            var startDate=this.selectInitTimeValue[0];
            var endDate=this.selectInitTimeValue[1];
            this.bindPointInitList=[];
            this.basePointInitList=[];
            // this.hhInitData='';
            // this.hhBaseInitData='';
            axios({
                url:this.BDMSUrl+'detectionInfo/getOriginalHHData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.forcePointId,
                    startDate:startDate,
                    endDate:endDate
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.selectInitTimeList=response.data.rt;
                    this.bindPointInitList=this.selectInitTimeList.originalData;
                    if(this.bindPointInitList.length!=0){
                        // this.hhInitDataTime=this.bindPointInitList[0].collectTime;
                        // this.hhInitData=this.bindPointInitList[0].shift;
                    }
                    this.basePointInitList=this.selectInitTimeList.baseOriginalData;
                    if(this.basePointInitList.length!=0){
                        // this.hhBaseInitDataTime=this.basePointInitList[0].collectTime;
                        // this.hhBaseInitData=this.basePointInitList[0].shift;
                    }else{
                        this.$message({
                            type:'info',
                            message:'筛选时间无监测数据'
                        })
                    }
                }
            })
        },
        hhInitDataChange(){
            this.bindPointInitList.forEach((item)=>{
                if(item.collectTime==this.hhInitDataTime){
                    this.hhInitData=item.shift;
                }
            })
        },
        hhBaseInitDataChange(){
            this.basePointInitList.forEach((item)=>{
                if(item.collectTime==this.hhBaseInitDataTime){
                    this.hhBaseInitData=item.shift;
                }
            })
        },
        changeVerticalTimeValue(){

        },
        changeWaterTimeValue(){

        },
        //获取水平位移历史数据
        getHorizontalDataHistory(){
            this.selectTimeValue=new Date(new Date(this.selectTimeValue).toString().split('GMT')[0]+' UTC').toISOString();
            axios({
                url:this.BDMSUrl+'detectionInfo/getHorizontalDataHistory',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.forcePointId,
                    collectTime:this.selectTimeValue
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.horInitalValue=response.data.rt[0].data;
                    this.selectTimeValue=response.data.rt[0].acquisitionTime;
                }
            })


        },
        //获取点位历史日期
        getHistoryDate(id){
            var pointIds=[];
            pointIds.push(id);
         
            axios({
                url:this.BDMSUrl+'detectionInfo/getInsertHistoryDate',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    startDate:null,
                    endDate:null
                },
                data:pointIds,
                method:'post'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.setInitCollectTimeLists=response.data.rt[0].historyDate;
                    this.selectTimeValues=this.setInitCollectTimeLists[0];
                    console.log(this.setInitCollectTimeLists,'this.setInitCollectTimeList');
                    // this.selectTimeValue=this.setInitCollectTimeList[0];
                }
            })
        },
        //獲取歷史日期
        getInsertHistoryDate(){
            var pointIds=[];
            pointIds.push(this.forcePointId);
         
            axios({
                url:this.BDMSUrl+'detectionInfo/getInsertHistoryDate',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    startDate:null,
                    endDate:null
                },
                data:pointIds,
                method:'post'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.setInitCollectTimeList=response.data.rt[0].historyDate;
                    console.log(this.setInitCollectTimeList,'this.setInitCollectTimeList');
                    // this.selectTimeValue=this.setInitCollectTimeList[0];
                }
            })
        },
        //设置初始时间
        setInitCollectTime(){
            if(this.selectTimeValue){
                this.selectTimeValue=new Date(new Date(this.selectTimeValue).toString().split('GMT')[0]+' UTC').toISOString();
                axios({
                    url:this.BDMSUrl+'detectionInfo/setInitCollectTime',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId,
                        pointId:this.forcePointId,
                        initDataDate:this.selectTimeValue
                    },
                    method:'get'
                }).then((response)=>{
                    if(response.data.cd==0){
                            
                    }else{

                    }
                })
            }
        },
        autoFacturerList(){
            if(this.itemMonitorType==4){
                this.manufacturerList=[
                        {
                            value:'华桓',
                            label:'华桓'
                        },
                        {
                            value:'基康',
                            label:'基康'
                        },
                        {
                            value:'轴力',
                            label:'轴力'
                        }
                ]
            }else if(this.itemMonitorType==3){
                this.manufacturerList=[
                        {
                            value:'华桓',
                            label:'华桓'
                        },
                        {
                            value:'基康',
                            label:'基康'
                        },
                        {
                            value:'水位',
                            label:'水位'
                        }
                ]
            }else if(this.itemMonitorType==2){
                this.manufacturerList=[
                        {
                            value:'华桓',
                            label:'华桓'
                        },
                        {
                            value:'基康',
                            label:'基康'
                        },
                        {
                            value:'竖直位移',
                            label:'竖直位移'
                        }
                ]
            }else if(this.itemMonitorType==1){
                this.manufacturerList=[
                        {
                            value:'华桓',
                            label:'华桓'
                        },
                        {
                            value:'基康',
                            label:'基康'
                        },
                        {
                            value:'水平位移',
                            label:'水平位移'
                        }
                ]

            }
        },
        
        downExcel(){
            method5('bottomTableList')   
        },
        // callback(e){
        //     console.log(e.data,'e.data.command');
        //     switch(e.data.command){
        //         // console.log()
        //         case "CurrentSelectedLabel":
        //             {
        //                 if(e.data.parameter.type=="Measure"){
        //                     // console.log(e.data.parameter.value.Tag.split(";")[0].split("=")[1],'Tag');
        //                     // console.log(e.data.parameter.value.Tag.split(";").length,'加油000');
        //                     if(e.data.parameter.value.Tag.split(";").length==1){
        //                         this.measureName=e.data.parameter.value.Tag.split(";")[0].split("=")[1]; //测点曲线名称
        //                         this.getPointDatasList1.forEach((item)=>{
        //                             if(this.measureName==item.pointName){
        //                                this.$message({
        //                                     type:'info',
        //                                     message:'当前不支持测点曲线'
        //                                 })
        //                             }
        //                         })
                                
        //                     }else{
        //                         console.log(this.getPointDatasList1,'getPointDatasList1');
        //                         this.measureName=e.data.parameter.value.Tag.split(";")[0].split("=")[1]; //判断测点曲线
        //                         this.getPointDatasList1.forEach((item)=>{
        //                             if(this.measureName==item.pointName){
        //                                 this.measureId=item.pointId;
        //                                 this.getCurve(this.measureId,this.measureName);
        //                             }
        //                         })
                                
        //                     }
        //                 }
        //             }
        //         break;
        //     }
        // },
        makeSureData(){
            var vm=this;
            // console.log(this.selectValue,'this.startValue');
            // this.startValue=this.selectValue[0];
            // this.endValue=this.selectValue[1];
            // axios({
            //     url:this.BDMSUrl+'detectionInfo/getPointChartData',
            //     headers:{
            //         'token':vm.token
            //     },
            //     params:{
            //         startDate:this.startValue,
            //         endDate:this.endValue,
            //         pointId:this.pointId
            //     }
            // }).then((response)=>{
            //     if(response.data.cd==0){
            //         console.log(response.data.rt);
            //     }
            // })
            // let spotChangeLineChart=this.$refs.spotChangeLine;
            // spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
            // spotChangeLineChart.removeSeries();
            //  this.optionSpotChangeLine.yAxis.min='';
            //  this.optionSpotChangeLine.yAxis.max='';
            this.$refs.spotChangeLine.removeSeries();
            if(this.itemMonitorType==1){
                this.getPointHorizontalShiftChartData()
            }else if(this.itemMonitorType==2){
                this.getPointVerticalShiftChartData()
            }else if(this.itemMonitorType==3){
                this.getPointGaugeChartData()
            }else if(this.itemMonitorType==4){
                this.getPointForceChartData()
            }
        },
        makeSureData1(){
            this.getAllCurve(this.getAllCurveId)
        },
        getUserInfo(){
                var vm = this
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/getOnlineInfo',
                    params:{
                        refresh:Math.random()/*IE11浏览器会默认从缓存里取数据*/
                    },
                    headers:{
                        'accept':'application/json;charset=UTF-8',
                        'token':vm.token,
                    },
                }).then((response)=>{
                    var id = localStorage.getItem('projId');
                    vm.projAuth1=response.data.rt.onlineInfo.projAuth[id];
                   
                })
            
            },
        checkAuth(){
            var vm=this;
            if(vm.projAuth.indexOf("00601202") > 0){
              vm.manageEdit = true
            }
            if(vm.projAuth.indexOf("00601203") > 0){
                vm.editInspectMethodEdit = true
            }
            if(vm.projAuth.indexOf("00601204") > 0){
                vm.importDataEdit = true
            }
            if(vm.projAuth.indexOf("00601205") > 0){
                vm.exportDataEdit = true
            }
            if(vm.projAuth.indexOf("00601206") > 0){
                vm.editAlertEdit = true
            }
        },
         selectImg(){
             this.$refs.file.click()
        },
        displaySubmitSpot(){
            this.$refs.pic.enableLabel(this.displaySpotNum);

        },
        //显示当前监测内容监测点
        displayInspectSpot(){
            // console.log(this.commonMonitorMainItemList);
             for(let i = 0; i < this.commonMonitorMainItemList.length;i++){
                this.$refs.pic.enableType(this.commonMonitorMainItemList[i].type,this.commonMonitorMainItemList[i].sign,this.commonMonitorMainItemList[i].spotNum,this.commonMonitorMainItemList[i].id);
            }
            this.$refs.pic.enableType(this.itemMonitorType,this.itemSubmitSign,true,this.itemMonitorId);
            // console.log('触发')
        },
        baseMapCancle(){
            this.baseMapShow=false;
        },
        //返回
        back(){
            var vm = this
            vm.$emit('back')
        },
        //底图选择
        baseMapEmit(){
            // this.baseMapShow=true;
            this.isClick=true;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            // this.getBaseMapList();
            var vm=this;
            vm.$emit('baseMapEmit')
        },
        //获取监测项目最后一个点位名称
        getMaxPointNameByItemId(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getMaxPointNameByItemId',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    baseMapId:vm.itemSubmitbaseMapId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.pointNameValue=response.data.rt.split('-')[0];
                    this.pointNumValue=response.data.rt.split('-')[1];
                }
            })
        },
        updateBaseMapZoom(){
            var vm=this;
            this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue)
            axios({
                url:this.BDMSUrl+'detectionInfo/updateBaseMapZoom',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    id:this.monitorBaseMapId,
                    zoom:this.scaleValue
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    // this.getBaseMapList();
                    // this.getBaseMapInfoByBaseMapId();
                }
            })
        },
        //单点
        spotClick(){
            this.$refs.pic.setDrawCancel();
            this.isClick=false;
            this.isClick1=true;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.saveDrawShow=true;
             this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue)
            this.$refs.pic.setDrawStatus("onePoint",this.itemMonitorType,this.itemSubmitSign,this.itemMonitorId,1); 
        },
        //连续
        spotAllClick(){
            this.$refs.pic.setDrawCancel();
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=true;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.saveDrawShow=true;
            this.$refs.pic.setDrawStatus("onePoint",this.itemMonitorType,this.itemSubmitSign,this.itemMonitorId,2);
            
        },
        //文字
        drawingTxtClick(){
            this.$refs.pic.setDrawCancel();
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=true;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.$refs.pic.setDrawStatus("text",10000,10000,2);
            
        },
         //开启移动
        enableMoveCommon(){
            this.$refs.pic.setDrawCancel();
            this.$refs.pic.setMoveStatus();
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=true;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            
        },
        //删除点
        deleteDrawCommon(){
            this.$refs.pic.setDrawCancel();
            this.$refs.pic.deleteDraw();
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=true;
            this.isClick7=false;
            this.isClick8=false;

            
        },
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
                    itemId:this.itemMonitorId,
                    startDate:null,
                    endDate:null
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getImportHistoryList=response.data.rt;
                    this.getImportHistoryList.forEach((item)=>{
                        this.$set(item,'check',false)
                    })
                    // console.log(this.getImportHistoryList,'this.getImportHistoryList');
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
           
            if(this.selectHistoryTimeValue==''){
                this.$message({
                    type:"info",
                    message:'请选择筛选时间'
                })
            }else{
                let startDate=this.selectHistoryTimeValue[0];
                let endDate=this.selectHistoryTimeValue[1];
                //  window.open('blob:'+this.BDMSUrl+'detectionInfo/exportHistory?token='+this.token+'&endDate='+endDate+'&startDate='+startDate+'&pointId='+this.historyPointId+'&seqId='+null)
                axios({
                    url:this.BDMSUrl+'detectionInfo/exportHistory',
                    headers:{
                        'token':this.token
                    },
                    responseType:'blob',

                    params:{
                        startDate:startDate,
                        endDate:endDate,
                        seqId:null,
                        pointId:this.historyPointId
                    }
                }).then((response)=>{
                    let blob=new Blob([response.data],{
                        // application/vnd.ms-excel
                        // 
                        // type:'application/vnd.ms-excel'
                        type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                              //将会被放入到blob中的数组内容的MIME类型 
                    });
                    let objectUrl = URL.createObjectURL(blob);  //生成一个url
                    // console.log(objectUrl,'objectUrl');
                    window.open(objectUrl);
                    this.selectHistoryTimeValue='';
                    this.exportHistoryRecoedShow=false;
                })

            }
           

            // this.exportHistory()
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
                // this.exportHistoryRecoedShow=false;
                this.allCheck=false;
                this.getImportHistoryList.forEach((item,index)=>{
                    item.check=false;
                })
                window.open(vm.BDMSUrl+'detectionInfo/exportHistory?token='+vm.token+str,'_blank')
            }else{
                this.$message({
                    type:'info',
                    message:'请选择导出的条目'
                })
            }
        },
        //修复故障
        changeBrokenCommon(){
            
        },
        brokenChanged(val){
            var pointId=val.ID_out;
            var status="";
            if(val.isBroken==0){
                status=1
            }else if(val.isBroken==1){
                status=0
            }
            var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/editMonitorPointStatus',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        pointId:pointId,
                        status:status //监测点状态(故障为1和正常为0)
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getAllMonitorPoint();
                        this.picMark=false;
                    }
            })
        },
        changeBroken(val){
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=true;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.$refs.pic.setDrawCancel();
             if(this.picMarkName!="Select_img_Mark"){
                this.$refs.pic.changeBroken();
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/editMonitorPointStatus',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        pointId:vm.pointId,
                        status:val //监测点状态(故障为1和正常为0)
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getAllMonitorPoint();
                        this.getDetailPointInfo();
                        // this.picMark=false;
                    }
                })
            }
            if(this.picMarkName=="Select_img_Mark"){
                this.$message({
                    type:'info',
                    message:'图片标记不支持该操作'
                })
            }
        },
        handleSizeChange(val){
            this.pageSize=val;
            this.getPointDatasList1=[];
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getPointDatasListLength-1>=NumB&&this.getPointDatasListLength-1<=NumE){
                NumE=this.getPointDatasListLength-1;
            }
            // console.log(NumB,'NumBp')
            // console.log(NumE,'NumEp')
            for(var i=NumB;i<NumE+1;i++){
                this.getPointDatasList1.push(this.getPointDatasList[i])
            }

        },
        handleCurrentChange(val){
            this.getPointDatasList1=[];
            this.pageNum=val;
             var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getPointDatasListLength-1>=NumB&&this.getPointDatasListLength-1<=NumE){
                NumE=this.getPointDatasListLength-1;
            }
            // console.log(NumB,'NumBp')
            // console.log(NumE,'NumEp')
            for(var i=NumB;i<NumE+1;i++){
                this.getPointDatasList1.push(this.getPointDatasList[i])
            }
        },
         //根据底图ID获取底图信息
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
                   baseMapId:vm.itemSubmitbaseMapId,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getBaseMapInfoByBaseMapIdInfo=response.data.rt;
                    this.angle=this.getBaseMapInfoByBaseMapIdInfo.rotate;
                    this.scaleValue=this.getBaseMapInfoByBaseMapIdInfo.zoom;
                    if(this.angle==null){
                        this.angle=0;
                    }
                    var type=(this.getBaseMapInfoByBaseMapIdInfo.name.substr(this.getBaseMapInfoByBaseMapIdInfo.name.length-3)).toString();
                    // console.log(type);
                    this.paramsInfo={type:type,source:vm.BDMSUrl+this.getBaseMapInfoByBaseMapIdInfo.relativeUri,angle:this.angle}
                    // console.log(this.paramsLists,'this.paramsLists');
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        message:response.data.msg
                    })
                }
            })
        },
        //获取监测点基本信息
        getDetailPointInfo(){
            var vm=this;
            this.isAlertNum=0;
            this.isBrokenNum=0;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getDetailPointInfo',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getDetailPointInfoList=response.data.rt;
                    this.forcePointId=this.getDetailPointInfoList[0].id;
                    this.historyPointId=this.getDetailPointInfoList[0].id;
                    this.getDetailPointInfoList.forEach((item)=>{
                        if(item.isAlert==1){
                            this.isAlertNum++;
                        }

                        if(item.isBroken==1){
                            this.isBrokenNum++;
                        }
                    })
                    // this.isAlertNum='';
                    // this.isBrokenNum='';
                    // console.log(this.getDetailPointInfoList,'this.getDetailPointInfoList');
                    // this.monitorPointInfo=response.data.rt;
                    // this.isAlert=this.monitorPointInfo[0].isAlert;
                    // this.isBroken=this.monitorPointInfo[0].isBroken;
                    
                }
            })

        },
         //获取底图中所有的监测点
        getAllMonitorPoint(){
            var vm=this;
            axios({
                method:'post',
                // url:vm.BDMSUrl+'detectionInfo/getAllMonitorPoint',
                url:vm.BDMSUrl+'detectionInfo/getPointGroups',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.userGroupId
                    // baseMapId:vm.itemSubmitbaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorPointInfo=response.data.rt;
                    var data=[];
                    this.monitorPointInfo.forEach((item)=>{
                        data.push(item.id);
                    })
                    if(data.length>0){
                        this.getPointByPointGroupId(data);
                    }
                    

                    // this.isAlert=this.monitorPointInfo[0].isAlert;
                    // this.isBroken=this.monitorPointInfo[0].isBroken;
                    // this.$refs.pic.loadPoints(this.monitorPointInfo);
                    // this.displayInspectSpot();
                }
            })
        },
         getPointByPointGroupId(data){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getPointByPointGroupId',
                method:'post',
                headers:{
                    'token':vm.token
                },
                data:data,
            }).then((response)=>{
                 vm.dataLists=response.data.rt;
                //  console.log(vm.dataLists,'vm.dataList');
                 this.monitorPointInfo.forEach((item)=>{
                      var a=[]
                     vm.dataLists.forEach((item1)=>{
                        
                         if(item.id==item1.pointGroupId){
                             a.push(item1);
                            vm.$set(item,'pointGroupData',a);
                         }
                     })
                 })
                  this.$refs.pic.loadPoints(this.monitorPointInfo);
                   this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
                  this.displayInspectSpot()
                
            })
        },
        drawFinish(){
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick=false;
            this.saveDrawShow=true;
        },
        picView_status_changed(val,list){
            // console.log(val);
            this.toolShow=val;
            this.saveDrawShow=val;
            if(val==true){
                this.pointId=list[0].ID_out;
                // this.toolShow=status;
                this.broken=list[0].isBroken;
                this.alert=list[0].isAlert;
            }
        },
        enter(val){
            this.hoverId=val;
        },
        leave(){
            this.hoverId='';

        },
        //删除当前底图
        deleteBaseMap(){

        },
        //选择当前底图
        selectCurBaseMap(){

        },
        //获取底图列表
        // getBaseMapList(){
        //     var vm=this;
        //     axios({
        //         method:'post',
        //         url:vm.BDMSUrl+'detectionInfo/getBaseMapList',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             userGroupId:vm.userGroupId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd=='0'){
        //             this.baseCommonMapList=response.data.rt;
        //             // console.log(this.baseMapList);
        //             //判断是否使用当前图纸
        //             if(!this.curCommonBaseMapUrl){
        //                 this.baseCommonMapList.forEach((item)=>{
        //                     if(item.isUsed==1){
        //                         this.curCommonBaseMapUrl=item.relativeUri;
        //                         this.monitorBaseMapId=item.id;
        //                         this.getAllMonitorPoint();
        //                     }
        //                 })
        //             }
        //             if(this.monitorBaseMapId){
        //                 this.baseCommonMapList.forEach((item)=>{
        //                     if(item.id==this.monitorBaseMapId){
        //                         this.curCommonBaseMapUrl=item.relativeUri;
        //                     }
        //                 })
        //             }
        //         }else{
        //             vm.$message({
        //                 type:"error",
        //                 msg:response.data.msg
        //             })
        //         }
        //     })
        // },
         //获取监测内容
        getMonitorItem(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getMonitorItem',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.userGroupId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.commonMonitorMainItemList=response.data.rt;
                    this.commonMonitorMainItemList.forEach((item,index)=>{
                        this.$set(item,'spotNum',false)
                    })
                    // console.log(this.commonMonitorMainItemList,'2222')
                    // for(let i = 0; i < this.commonMonitorMainItemList.length;i++){
                    //     this.$refs.pic.enableType(this.commonMonitorMainItemList[i].type,this.commonMonitorMainItemList[i].id,this.commonMonitorMainItemList[i].spotNum);
                    // }
                    // this.drawItemId=this.commonMonitorMainItemList[0].id;
                    // this.drawItemType=this.commonMonitorMainItemList[0].type;
                    // console.log(this.commonMonitorMainItemList,'monitorMainItemList')
                }
            })
        },
        //获取群组中的用户
        getUserByUserGroup(){
            var vm=this;
            axios({
                method:'post',
                // url:this.BDMSUrl+'detectionInfo/getUserByUserGroup',
                url:this.BDMSUrl+'userGroup/getGroupUser',
                headers:{
                    'token':this.token
                },
                params:{
                    groupId:this.userGroupId
                     
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.userGroupList=response.data.rt;
                    this.observerId=this.userGroupList[0].userId;
                    this.calculatorId=this.userGroupList[0].userId;
                    this.inspectorId=this.userGroupList[0].userId;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //手动导入数据
        handExportExcel(){
            this.$emit('importDataShow',true,this.itemMonitorId,this.projctName,this.itemMonitorType,this.itemMonitorKeyWord)
        },
        //获取用户名
        getUserName(){
            
        },
        saveDraw(){
            var vm=this;
            var list = this.$refs.pic.saveList();
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            // console.log(list);
            axios({
                    method:'POST',
                    url:vm.BDMSUrl+'detectionInfo/editAllMonitorPoint',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        userGroupId:vm.userGroupId
                    },
                    data:list
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.$message({
                            type:'success',
                            message:'保存监测点成功'
                        })
                        this.$refs.pic.setDrawCancel();
                        this.saveDrawShow=false;
                        this.toolShow=false;
                        this.getAllMonitorPoint();
                        this.getPointDatas();
                        this.getDetailPointInfo();
                    }else if(response.data.cd=='-1'){
                        
                         this.$message({
                            type:'success',
                            message:response.data.msg
                        })
                    }
                })
        },
        cancleAll(){
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.$refs.pic.setDrawCancel();
            this.getBaseMapInfoByBaseMapId();
            this.getAllMonitorPoint();

            
        },
        //获取警报参数
        getAlertArguments(id){
            var vm=this;
            this.variationAlertTotal='';
            this.variationAlertDay='';
            this.variationAlertHour='';
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getAlertArguments',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    pointId:id
                }
            }).then((response)=>{
                if(response.data.rt){
                    this.getAlertArgumentsList=response.data.rt;
                    this.changeAlertDay=this.getAlertArgumentsList.changeAlertDay;
                    this.changeAlertHour=this.getAlertArgumentsList.changeAlertHour;
                    this.changeAlertTotal=this.getAlertArgumentsList.changeAlertTotal;
                    this.variationAlertTotal=this.getAlertArgumentsList.changeAlertTotal*1000;
                    this.variationAlertDay=this.getAlertArgumentsList.changeAlertDay*1000;
                    this.variationAlertHour=this.getAlertArgumentsList.changeAlertHour*1000;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //编辑警报参数
        editAlertArgumentsMakeSure(){
            
            var vm=this;
            var data={};
            if(this.currentPointId){
                data={
                    itemId:this.itemMonitorId,
                    variationAlertTotal:this.variationAlertTotal/1000,
                    variationAlertDay:this.variationAlertDay/1000,
                    variationAlertHour:this.variationAlertHour/1000,
                    pointId:this.currentPointId
                }
            }else{
                data={
                    itemId:this.itemMonitorId,
                    variationAlertTotal:this.variationAlertTotal/1000,
                    variationAlertDay:this.variationAlertDay/1000,
                    variationAlertHour:this.variationAlertHour/1000
                }
            }
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editAlertArguments',
                headers:{
                    'token':this.token
                },
                params:data
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editAlertValueShow=false;
                    if(this.currentPointId){
                         this.getAlertArguments(this.currentPointId);
                    }
                    this.getAllMonitorPoint();
                    this.getDetailPointInfo();
                    this.$message({
                        type:'success',
                        message:'修改报警值成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        editWarn(id){
            this.currentPointId=id;
            this.editAlertValueShow=true;
            this.getAlertArguments(id);
        },
        editTime(id){
            this.getHistoryDate(id);
            this.editTimeShow=true;
        },
        setInitTimeCancle(){

        },
        makeInitSelectTimeSure(){

        },
        editAlertValueBtn(){
            this.editAlertValueShow=true;
            this.variationAlertTotal='';
            this.variationAlertDay='';
            this.variationAlertHour='';
            this.currentPointId='';
            // this.getAlertArguments();
        },

        //编辑相关人员
        editPersonBtn(){
            this.editPersonShow=true;
            // this.getUserByUserGroup();
            this.getItemDutyUser();
        },
        //取消监测项目人员
        editPersonCancle(){
            this.editPersonShow=false;
        },
        //编辑项目人员
        editPersonMakeSure(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    observer:this.observerId,
                    calculator:this.calculatorId,
                    inspector:this.inspectorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editPersonShow=false;
                    this.getItemDutyUser();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取监测项目相关人员
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
                    this.observerId=this.getItemDutyUserList.observer;
                    this.calculatorId=this.getItemDutyUserList.calculator;
                    this.inspectorId=this.getItemDutyUserList.inspector;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //取消编辑报警值
        editAlertValueCancle(){
            this.editAlertValueShow=false;
        },
        //取消曲线点位改变
        spotChangeLineCancle(){
            this.spotChangeLineShow=false;
             this.optionSpotChangeLine.yAxis.min='';
             this.optionSpotChangeLine.yAxis.max='';
             this.selectValue='';
        },
         spotChangeLineCancle1(){
            this.spotChangeLineShow1=false;
             this.optionSpotChangeLine1.yAxis.min='';
             this.optionSpotChangeLine1.yAxis.max='';
             this.selectValue1='';
        },
        // 获取监测点采集数据（表格）
        getPointDatas(){
            var vm=this;
            this.getPointDatasList1=[];
            this.getPointDatasList=[];
            this.getPointDatasListLength=0;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointDatas',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointDatasList=response.data.rt;

                    this.getPointDatasList.forEach((item)=>{
                        if(this.forcePointId==item.pointId)
                            this.selectTimeValue=item.initAcquisitionTime
                    })
                   
                    // console.log(this.getPointDatasList,'this.getPointDatasList');
                    this.getPointDatasListLength=response.data.rt.length;
                    // this.itemSubmitCount=this.getPointDatasListLength;
                    if(this.getPointDatasListLength<11){
                        for(var i=0;i<this.getPointDatasListLength;i++){
                            this.getPointDatasList1.push(this.getPointDatasList[i])
                        }
                    }else{
                        for(var i=0;i<10;i++){
                            this.getPointDatasList1.push(this.getPointDatasList[i])
                        }
                    }
                    // console.log(this.getPointDatasList1,'123');
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //点击获得曲线
        getCurve(pointId,name,type){
            this.selectValue='';
            this.startValue='';
            this.endValue='';
            if(type){
                this.itemMonitorType=type
            }
            this.pointId=pointId;
            this.pointName=name;
            if(this.itemMonitorType==1){
                this.getPointHorizontalShiftChartData()
            }else if(this.itemMonitorType==2){
                this.getPointVerticalShiftChartData()
            }else if(this.itemMonitorType==3){
                this.getPointGaugeChartData()
            }else if(this.itemMonitorType==4){
                this.getPointForceChartData()
            }
    
        },
        timeChangeMethod(val) {
                if (val == null) {
                return '/';
                } else {
                return moment(val).format("MM-DD HH:mm");
                }
        },
        //获取30天曲线图（受力）
        getPointForceChartData(){
            var vm=this;
            this.acquisitionTimeXlist=[];
            this.elevationYlist=[];
             this.optionSpotChangeLine.yAxis.min=undefined;
             this.optionSpotChangeLine.yAxis.max=undefined;
            // this.startValue=this.selectValue[0];
            // this.endValue=this.selectValue[1];
            if(this.selectValue){
                this.startValue=this.selectValue[0];
                this.endValue=this.selectValue[1];
             }
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointForceChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId,
                    startDate:this.startValue,
                    endDate:this.endValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.force)
                    })
                     this.spotChangeLineShow=true;
                    // console.log(this.elevationYlist,'受力')
                    if(this.elevationYlist.length>0){
                    }
                        // var min=this.getMinValue(this.elevationYlist);
                        // var max=this.getMaxValue(this.elevationYlist)
                        var min=this.getMinValue(this.elevationYlist)?this.getMinValue(this.elevationYlist):0;
                        var max=this.getMaxValue(this.elevationYlist)?this.getMaxValue(this.elevationYlist):0;
                        var middle=(min+max)/2;
                        // console.log(min,max,middle,'min,max,middle');
                        // this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                        // this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                       

                        setTimeout(()=>{
                            let spotChangeLineChart=this.$refs.spotChangeLine;
                            spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                            spotChangeLineChart.removeSeries();
                            spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                            spotChangeLineChart.hideLoading();
                            spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                            spotChangeLineChart.getChart().yAxis[0].min=(3*min-2*max);
                            spotChangeLineChart.getChart().yAxis[0].max=(3*max-2*min);

                        },200)
                    
                    this.startValue='';
                    this.endValue='';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水位）
        getPointGaugeChartData(){
            var vm=this;
            this.acquisitionTimeXlist=[];
             this.elevationYlist=[];
              this.optionSpotChangeLine.yAxis.min=undefined;
             this.optionSpotChangeLine.yAxis.max=undefined;
             if(this.selectValue){
                this.startValue=this.selectValue[0];
                this.endValue=this.selectValue[1];
             }
            //  this.startValue=this.selectValue[0];
            // this.endValue=this.selectValue[1];
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointGaugeChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId,
                    startDate:this.startValue,
                    endDate:this.endValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.gaugeHeight)
                    })
                     this.spotChangeLineShow=true;
                    // if(this.elevationYlist.length>0){}
                        // var min=this.getMinValue(this.elevationYlist);
                        // var max=this.getMaxValue(this.elevationYlist)
                        var min=this.getMinValue(this.elevationYlist)?this.getMinValue(this.elevationYlist):0;
                        var max=this.getMaxValue(this.elevationYlist)?this.getMaxValue(this.elevationYlist):0;
                        var middle=(min+max)/2;
                        // this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                        // this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                       
                        setTimeout(()=>{
                            let spotChangeLineChart=this.$refs.spotChangeLine;
                            spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                            spotChangeLineChart.removeSeries();
                            spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                            spotChangeLineChart.hideLoading();
                            spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                            spotChangeLineChart.getChart().yAxis[0].min=(3*min-2*max);
                            spotChangeLineChart.getChart().yAxis[0].max=(3*max-2*min);
                        },200)
                    
                    this.startValue='';
                    this.endValue='';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //
        getAllCurve(id){
            var vm=this;
            this.acquisitionTimeXlist1=[];
            this.elevationYlist1=[];
            this.startValue1='';
            this.endValue1='';
            this.optionSpotChangeLine1.yAxis.min=undefined;
             this.optionSpotChangeLine1.yAxis.max=undefined;
           
            this.getAllCurveId=id;
            this.getAllCurveList=[];
            if(this.selectValue1){
                 this.startValue1=this.selectValue1[0];
                this.endValue1=this.selectValue1[1];
            }
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointChartTotalVariation',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:id,
                    startDate:this.startValue1,
                    endDate:this.endValue1
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getAllCurveList=response.data.rt;
                    // console.log(this.getAllCurveList,'this.getAllCurveList');
                    if(this.getAllCurveList.length>0){
                            this.getAllCurveName=this.getAllCurveList[0].pointName;
                    }
                        this.getAllCurveList.forEach((item)=>{
                            this.acquisitionTimeXlist1.push(this.timeChangeMethod(item.collectTime))
                            this.elevationYlist1.push(item.data)
                        })
                        var min=this.getMinValue(this.elevationYlist1)?this.getMinValue(this.elevationYlist1):0;
                        var max=this.getMaxValue(this.elevationYlist1)?this.getMaxValue(this.elevationYlist1):0;
                        var middle=(min+max)/2;
                        this.spotChangeLineShow1=true;
                        setTimeout(()=>{
                            let spotChangeLineChart=this.$refs.spotChangeLine1;
                            spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                            spotChangeLineChart.removeSeries();
                            spotChangeLineChart.addSeries({name:this.getAllCurveName,data:this.elevationYlist1});
                            spotChangeLineChart.hideLoading();
                            spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist1});
                            spotChangeLineChart.getChart().yAxis[0].min=(3*min-2*max);
                            spotChangeLineChart.getChart().yAxis[0].max=(3*max-2*min);
                        },200)
                    
                    this.startValue='';
                    this.endValue='';
                }
            })
        },
        //获取30天曲线图（水平位移）
        getPointHorizontalShiftChartData(){
             var vm=this;
             this.acquisitionTimeXlist=[];
             this.elevationYlist=[];
            this.optionSpotChangeLine.yAxis.min=undefined;
             this.optionSpotChangeLine.yAxis.max=undefined;
             if(this.selectValue){
                    this.startValue=this.selectValue[0];
                    this.endValue=this.selectValue[1];
             }
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointHorizontalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId,
                    startDate:this.startValue,
                    endDate:this.endValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.shiftDistance)
                    })
                     this.spotChangeLineShow=true;
                    // if(this.elevationYlist.length>0){
                    // }
                        // console.log(this.acquisitionTimeXlist,'this.acquisitionTimeXlist');
                        // console.log(this.elevationYlist,'this.elevationYlist');
                        // var min=this.getMinValue(this.elevationYlist);
                        // var max=this.getMaxValue(this.elevationYlist);
                        var min=this.getMinValue(this.elevationYlist)?this.getMinValue(this.elevationYlist):0;
                        var max=this.getMaxValue(this.elevationYlist)?this.getMaxValue(this.elevationYlist):0;
                        //  console.log(min,'min');
                        //  console.log(max,'max');
                        var middle=(min+max)/2;
                        // this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                        // this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                       
                        setTimeout(()=>{
                            let spotChangeLineChart=this.$refs.spotChangeLine;
                            spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                            spotChangeLineChart.removeSeries();
                            spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                            spotChangeLineChart.hideLoading();
                            spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});

                            spotChangeLineChart.getChart().yAxis[0].min=(3*min-2*max);
                            spotChangeLineChart.getChart().yAxis[0].max=(3*max-2*min);
                        },200)
                    
                    this.startValue='';
                    this.endValue='';
                    this.selectValue='';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（垂直位移）
        getPointVerticalShiftChartData(){
             var vm=this;
             this.acquisitionTimeXlist=[];
             this.elevationYlist=[];
             this.optionSpotChangeLine.yAxis.min=undefined;
             this.optionSpotChangeLine.yAxis.max=undefined;
             if(this.selectValue){
                    this.startValue=this.selectValue[0];
                    this.endValue=this.selectValue[1];
             }
            //  this.startValue=this.selectValue[0];
            // this.endValue=this.selectValue[1];
            //  console.log(this.optionSpotChangeLine.yAxis.min);
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointVerticalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId,
                    endDate:this.endValue,
                    startDate:this.startValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.elevation)
                    })
                  
                    this.spotChangeLineShow=true;
                    // if(this.elevationYlist.length>0){}
                        // this.optionSpotChangeLine.yAxis.min=undefined;
                        // this.optionSpotChangeLine.yAxis.max=undefined;
                        var min=this.getMinValue(this.elevationYlist)?this.getMinValue(this.elevationYlist):0;
                        var max=this.getMaxValue(this.elevationYlist)?this.getMaxValue(this.elevationYlist):0;
                        var middle=(min+max)/2;
                        //  this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                        // this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                        // console.log(3*min-2*max,'min');
                        // console.log(3*max-2*min,'max');
                        
                        
                        setTimeout(()=>{
                            let spotChangeLineChart=this.$refs.spotChangeLine;
                            spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                            spotChangeLineChart.removeSeries();
                            spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                            spotChangeLineChart.hideLoading();
                            spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                            spotChangeLineChart.getChart().yAxis[0].min=(3*min-2*max);
                            spotChangeLineChart.getChart().yAxis[0].max=(3*max-2*min);
                        },200)
                    
                    this.startValue='';
                    this.endValue='';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        getMaxValue(val){
            var m = val[0];
            for(var i=1;i<val.length;i++){ //循环数组
            if(m<val[i]){
                    m=val[i]
                }
            }
            return m
        },
        getMinValue(val){
            var m = val[0];
            for(var i=1;i<val.length;i++){ //循环数组
            if(m>val[i]){
                    m=val[i]
                }
            }
            return m
        },



        //自动采集按钮
        autoAcquisitionBtn(){
            this.autoAcquisitionShow=true;
            this.getCollectSetting();
            this.getHuahuanNode();
            if(this.itemMonitorType==4){
                this.getForceBindInfo();
            }else if(this.itemMonitorType==3){
                this.getGaugeBindInfo();
            }else if(this.itemMonitorType==2){
                this.getVerticalBindInfo()
            }else if(this.itemMonitorType==1){
                this.getHorizontalDisplace();
            }
        },
        //取消自动采集配置
        autoAcquisitionCancle(){
            this.autoAcquisitionShow=false;
            this.nodeId='';
            this.manufacturerValue='华桓';
            this.getDeviceMonitorPointRelationList='';
            this.collectRateRadio='1';

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
        //自动导入轴力
        addForce(){
            this.addForceShow=true;
            this.getInsertHistoryDate();
        },
        DeleteAutoForce(id){
            this.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'detectionInfo/deleteForceBindInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getForceBindInfo();
                    }
                })

            })
        },
        editAutoForce(id){
            this.editAutoForceShow=true;
            this.getInsertHistoryDate();
            this.getFormula();
            console.log(this.getForceBindInfoList,'this.getForceBindInfoList');
            this.getForceBindInfoList.forEach((item)=>{
                if(item.id==id){
                    this.forceId=item.id;
                    this.forcePointId=item.pointId;
                    this.data1=item.k1;
                    this.deviceId=item.deviceId;
                    this.port=item.port;
                    this.data2=item.k2;
                    this.deviceId2=item.deviceId2;
                    this.port2=item.port2;
                    this.data3=item.k3;
                    this.deviceId3=item.deviceId3;
                    this.port3=item.port3;

                    this.port4=item.port4;
                    this.data4=item.k4;
                    this.deviceId4=item.deviceId4;
                    this.useFormulaValues=item.useFormula;
                }
            })
            
        },
        editCancleForce(){
            this.editAutoForceShow=false;
            
            this.k='';
            this.deviceId='';
            this.port='';
            this.data1='';
            this.useFormulaValues="1";

            this.deviceId2='';
            this.port2='';
            this.data2='';

            this.deviceId3='';
            this.port3='';
            this.data3='';

            this.deviceId4='';
            this.port4='';
            this.data4='';

            this.AsValue=null;
            this.EsValue=null;
            this.barDiameterValue=null;
            this.barCountValue=null;
            this.concreteWidthValue=null;
            this.concreteHeightValue=null;
            this.concreteLevel=null;
            this.barGradeValue=null;
            this.acValueArea=null;
            this.asValueArea=null;
            
        },
        makeEditForceSure(){
            var vm=this;
            if(vm.useFormulaValues=='1'){
                if(vm.AsValue==null||vm.EsValue==null){
                    this.$message({
                        type:'info',
                        message:'钢支撑/钢立柱的截面积或弹性模量不能为空'
                    })
                }else{
                    this.EditForceMake()
                }
            }else{
                if(this.asValueArea==null||this.acValueArea==null||this.barGradeValue==null||this.concreteLevelValue==null){
                    this.$message({
                        type:'info',
                        message:'配置公式选项不能为空'
                    })
                }else{
                    this.EditForceMake()
                }
            }

        },
        EditForceMake(){
            axios({
                url:this.BDMSUrl+' detectionInfo/updateForceBindInfo',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                    // itemId:this.itemMonitorId,
                    id:this.forceId,

                    pointId:this.forcePointId,

                    k:this.k,
                    deviceId:this.deviceId,
                    port:this.port,
                    k1:this.data1,
                    useFormula:this.useFormulaValues,
                    deviceId2:this.deviceId2,
                    port2:this.port2,
                    k2:this.data2,

                    deviceId3:this.deviceId3,
                    port3:this.port3,
                    k3:this.data3,

                    deviceId4:this.deviceId4,
                    port4:this.port4,
                    k4:this.data4
                }
            }).then((response)=>{
                if(response.data.cd==0){
                  
                    this.ForceBindInfoList=response.data.rt;
                    this.editAutoForceShow=false;
                    this.setFormula();
                    // this.setInitCollectTime();
                    this.getForceBindInfo();
                    this.k='';
                    this.deviceId='';
                    this.port='';
                    this.data1='';
                    this.useFormulaValues="1";

                    this.deviceId2='';
                    this.port2='';
                    this.data2='';

                    this.deviceId3='';
                    this.port3='';
                    this.data3='';

                    this.deviceId4='';
                    this.port4='';
                    this.data4='';

                    this.AsValue=null;
                    this.EsValue=null;
                    this.barDiameterValue=null;
                    this.barCountValue=null;
                    this.concreteWidthValue=null;
                    this.concreteHeightValue=null;
                    this.concreteLevel=null;
                    this.barGradeValue=null;
                    this.acValueArea=null;
                    this.asValueArea=null;
                }
            })

        },

        forceMake(){
             axios({
                url:this.BDMSUrl+'detectionInfo/addForceBindInfo',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    pointId:this.forcePointId,
                    k:this.k,
                    deviceId:this.deviceId,
                    port:this.port,
                    k1:this.data1,
                    useFormula:this.useFormulaValues,
                    deviceId2:this.deviceId2,
                    port2:this.port2,
                    k2:this.data2,

                    deviceId3:this.deviceId3,
                    port3:this.port3,
                    k3:this.data3,

                    deviceId4:this.deviceId4,
                    port4:this.port4,
                    k4:this.data4
                }
            }).then((response)=>{
                if(response.data.cd==0){
                  
                    this.ForceBindInfoList=response.data.rt;
                    this.addForceShow=false;
                    this.setFormula();
                    // this.setInitCollectTime();
                    this.getForceBindInfo();
                    this.k='';
                    this.deviceId='';
                    this.port='';
                    this.data1='';
                    this.useFormulaValues="1";

                    this.deviceId2='';
                    this.port2='';
                    this.data2='';

                    this.deviceId3='';
                    this.port3='';
                    this.data3='';

                    this.deviceId4='';
                    this.port4='';
                    this.data4='';

                    this.AsValue=null;
                    this.EsValue=null;
                    this.barDiameterValue=null;
                    this.barCountValue=null;
                    this.concreteWidthValue=null;
                    this.concreteHeightValue=null;
                    this.concreteLevel=null;
                    this.barGradeValue=null;
                    this.acValueArea=null;
                    this.asValueArea=null;
                }
            })

        },
        makeForceSure(){
            var vm=this;
            if(vm.useFormulaValues=='1'){
                if(vm.AsValue==null||vm.EsValue==null){
                    this.$message({
                        type:'info',
                        message:'钢支撑/钢立柱的截面积或弹性模量不能为空'
                    })
                }else{
                    this.forceMake()
                }
            }else{
                if(this.asValueArea==null||this.acValueArea==null||this.barGradeValue==null||this.concreteLevelValue==null){
                    this.$message({
                        type:'info',
                        message:'配置公式选项不能为空'
                    })
                }else{
                    this.forceMake()
                }
            }
        },
        getForceBindInfo(){
            axios({
                url:this.BDMSUrl+'detectionInfo/getForceBindInfo',
                headers:{
                    'token':this.token
                },
                method:'get',
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getForceBindInfoList=response.data.rt;
                }
            })
        },
        cancleForce(){
            this.addForceShow=false;
            this.k='';
            this.deviceId='';
            this.port='';
            this.data1='';

            this.deviceId2='';
            this.port2='';
            this.data2='';

            this.deviceId3='';
            this.port3='';
            this.data3='';

            this.deviceId4='';
            this.port4='';
            this.data4='';

            this.AsValue=null;
            this.EsValue=null;
            this.barDiameterValue=null;
            this.barCountValue=null;
            this.concreteWidthValue=null;
            this.concreteHeightValue=null;
            this.concreteLevel=null;
            this.barGradeValue=null;
            this.acValueArea=null;
            this.asValueArea=null;
        },
        forceChange(){
            this.k='';
            this.deviceId='';
            this.port='';
            this.data1='';

            this.deviceId2='';
            this.port2='';
            this.data2='';

            this.deviceId3='';
            this.port3='';
            this.data3='';

            this.deviceId4='';
            this.port4='';
            this.data4='';

            this.AsValue=null;
            this.EsValue=null;
            this.barDiameterValue=null;
            this.barCountValue=null;
            this.concreteWidthValue=null;
            this.concreteHeightValue=null;
            this.concreteLevel=null;
            this.barGradeValue=null;
            this.acValueArea=null;
            this.asValueArea=null;

        },
        //自动导入水位
        addWaterLevel(){
            this.addWaterLevelShow=true;
            this.getInsertHistoryDate();
        },
        //自动导入竖直位移
        // addVerticalDisplace(){
        //     this.addVerticalDisplaceShow=true;
           
        // },
        makeWaterLevelSure(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'detectionInfo/addGaugeBindInfo',
                headers:{
                    'token':this.token
                },
                method:'get',
                params:{
                    deviceId:this.wLevelDeviceId,
                    port:this.wLevelPort,
                    itemId:this.itemMonitorId,
                    pointId:this.forcePointId,
                    // f0:this.fZero,
                    k:this.wLevelK,
                    h:this.wLevelH,
                    pipeHeight:this.wLevelPipeH
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    // this.setInitCollectTime();
                    this.getGaugeBindInfo();
                    this.addWaterLevelShow=false;
                    this.wLevelDeviceId='';
                    this.wLevelPort='';
                    this.fZero='';
                    this.wLevelK='';
                    this.wLevelH='';
                    this.wLevelPipeH='';
                }
            })
        },
        getGaugeBindInfo(){
            axios({
                url:this.BDMSUrl+'detectionInfo/getGaugeBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.WaterLevelList=response.data.rt;
                }
            })
        },
         DeleteAutoWaterLevel(id){
            this.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'detectionInfo/deleteGaugeBindInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getGaugeBindInfo();
                    }
                })

            })
        },
        waterLevelCancle(){
            this.addWaterLevelShow=false;
            this.wLevelDeviceId='';
            this.wLevelPort='';
            this.fZero='';
            this.wLevelK='';
            this.wLevelH='';
            this.wLevelPipeH='';
        },
        editAutoWaterLevel(id){
             this.editWaterLevelShow=true;
             this.getInsertHistoryDate();
            this.WaterLevelList.forEach((item)=>{
                if(item.id==id){
                    this.waterLevelId=item.id;
                    this.wLevelDeviceId=item.deviceId;
                    this.wLevelPort=item.port;
                    this.forcePointId=item.pointId;
                    // itemId:this.itemMonitorId,
                    // pointId:this.forcePointId,
                    // f0:this.fZero,
                    this.wLevelK=item.k;
                    this.wLevelH=item.h;
                    this.wLevelPipeH=item.pipeHeight;
                }
            })
        },
        editwaterLevelCancle(){
            this.editWaterLevelShow=false;
            this.wLevelDeviceId='';
            this.wLevelPort='';
            this.fZero='';
            this.wLevelK='';
            this.wLevelH='';
            this.wLevelPipeH='';
        },
        makeEditWaterLevelSure(){
            axios({
                url:this.BDMSUrl+'detectionInfo/updateGaugeBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.waterLevelId,
                    deviceId:this.wLevelDeviceId,
                    port:this.wLevelPort,
                    itemId:this.itemMonitorId,
                    pointId:this.forcePointId,
                    // f0:this.fZero,
                    k:this.wLevelK,
                    h:this.wLevelH,
                    pipeHeight:this.wLevelPipeH
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getGaugeBindInfo();
                    this.editWaterLevelShow=false;
                    this.wLevelDeviceId='';
                    this.wLevelPort='';
                    this.fZero='';
                    this.wLevelK='';
                    this.wLevelH='';
                    this.wLevelPipeH='';
                }

            })


        },
        //自动导入竖直位移
        addVerticalDisplace(){
            this.addVerticalDisplaceShow=true;
             this.getInsertHistoryDate();
        },
        makeVerticalDisplaceSure(){
            var vm=this;
            // if(this.hhBaseInitDataTime||this.hhInitDataTime){
            //     this.hhBaseInitDataTime=new Date(new Date(this.hhBaseInitDataTime).toString().split('GMT')[0]+' UTC').toISOString();
            //     this.hhInitDataTime==new Date(new Date(this.hhInitDataTime).toString().split('GMT')[0]+' UTC').toISOString();
            // }
            
            axios({
                url:this.BDMSUrl+'detectionInfo/addVerticalBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    pointId:this.forcePointId,
                    baseSystemId:this.baseSystemId,
                    baseChannelNo:this.baseChannelNo,
                    baseSensorAddress:this.baseSensorAddress,
                    systemId:this.systemId,
                    channelNo:this.channelNo,
                    sensorAddress:this.sensorAddress,
                    h:this.initalHeight,
                    type:this.equipmentType,
                    hhBaseSensorNo:this.hhBaseSensorNo,
                    hhSensorNo:this.hhSensorNo,
                    hhBaseInitData:this.hhBaseInitData,
                    hhInitData:this.hhInitData,
                    hhBaseInitDataTime:this.hhBaseInitDataTime==''?'':new Date(new Date(this.hhBaseInitDataTime).toString().split('GMT')[0]+' UTC').toISOString(),
                    hhInitDataTime:this.hhInitDataTime==''?'':new Date(new Date(this.hhInitDataTime).toString().split('GMT')[0]+' UTC').toISOString()
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    //  this.setInitCollectTime();
                    this.getVerticalBindInfo();
                    this.addVerticalDisplaceShow=false;
                    this.baseSystemId='';
                    this.baseChannelNo='';
                    this.baseSensorAddress='';
                    this.systemId='';
                    this.channelNo='';
                    this.sensorAddress='';      
                    this.hhSensorNo='';
                    this.hhBaseSensorNo='';     
                    this.hhBaseInitDataTime='';
                    this.hhInitDataTime='';             
                }
            })

        },

        makeEditVerticalDisplaceSure(){
             var vm=this;
            // if(this.hhBaseInitDataTime||this.hhInitDataTime){
            //     this.hhBaseInitDataTime=new Date(new Date(this.hhBaseInitDataTime).toString().split('GMT')[0]+' UTC').toISOString();
            //     this.hhInitDataTime==new Date(new Date(this.hhInitDataTime).toString().split('GMT')[0]+' UTC').toISOString();
            //     console.log(this.hhBaseInitDataTime,this.hhInitDataTime,'this.hhInitDataTime');
            // }
            axios({
                url:this.BDMSUrl+'detectionInfo/updateVerticalBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.verticalHeightId,
                    itemId:this.itemMonitorId,
                    pointId:this.forcePointId,
                    baseSystemId:this.baseSystemId,
                    baseChannelNo:this.baseChannelNo,
                    baseSensorAddress:this.baseSensorAddress,
                    systemId:this.systemId,
                    channelNo:this.channelNo,
                    sensorAddress:this.sensorAddress,
                    h:this.initalHeight,
                    type:this.equipmentType,
                    hhBaseSensorNo:this.hhBaseSensorNo,
                    hhSensorNo:this.hhSensorNo,
                    hhBaseInitData:this.hhBaseInitData,
                    hhInitData:this.hhInitData,
                    hhBaseInitDataTime:this.hhBaseInitDataTime==''?'':new Date(new Date(this.hhBaseInitDataTime).toString().split('GMT')[0]+' UTC').toISOString(),
                    hhInitDataTime:this.hhInitDataTime==''?'':new Date(new Date(this.hhInitDataTime).toString().split('GMT')[0]+' UTC').toISOString()
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    //  this.setInitCollectTime();
                    this.getVerticalBindInfo();
                    // this.addVerticalDisplaceShow=false;
                    this.editVerticalDisplaceShow=false;
                    this.baseSystemId='';
                    this.baseChannelNo='';
                    this.baseSensorAddress='';
                    this.systemId='';
                    this.channelNo='';
                    this.sensorAddress='';      
                    this.hhSensorNo='';
                    this.hhBaseSensorNo='';
                    this.initalHeight='';          
                    this.hhBaseInitData='';   
                    this.hhInitData='';     
                    this.selectInitTimeValue='';
                    this.hhInitDataTime='';
                    this.hhBaseInitDataTime='';
                    this.basePointInitList=[];
                    this.bindPointInitList=[];
                }
            })

        },
        getVerticalBindInfo(){
            var vm=this;
            axios({
                url:this.BDMSUrl+"detectionInfo/getVerticalBindInfo",
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getVerticalBindInfoList=response.data.rt;
                }
            })
        },
        DeleteAutoVerticalHeight(id){
            this.$confirm('您要删除当前所选主题?','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((response)=>{
                axios({
                    url:this.BDMSUrl+'detectionInfo/deleteVerticalBindInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getVerticalBindInfo()
                    }
                })
            })
        },

        editAutoVerticalHeight(id){
            this.getVerticalBindInfoList.forEach((item)=>{
                if(item.id==id){
                        this.verticalHeightId=id;
                        // itemId:this.itemMonitorId=item.itemId,
                        this.forcePointId=item.pointId,
                        this.baseSystemId=item. baseSystemId;
                        this.baseChannelNo=item.baseChannelNo;
                        this.baseSensorAddress=item.baseSensorAddress;
                        this.systemId=item.systemId;
                        this.channelNo=item.channelNo;
                        this.sensorAddress=item.sensorAddress;
                        this.initalHeight=item.h;
                        this.hhBaseSensorNo=item.hhBaseSensorNo;
                        this.hhSensorNo=item.hhSensorNo;
                        this.hhBaseInitData=item.hhBaseInitData;
                        this.hhInitData=item.hhInitData;
                        this.hhInitDataTime1=item.hhInitDataTime?moment(item.hhInitDataTime).format("YYYY-MM-DD HH:mm"):'';
                        this.hhBaseInitDataTime1=item.hhBaseInitDataTime?moment(item.hhBaseInitDataTime).format("YYYY-MM-DD HH:mm"):'';
                        this.hhInitDataTime=item.hhInitDataTime;
                        this.hhBaseInitDataTime=item.hhBaseInitDataTime
                }
            })
            if(this.hhBaseSensorNo==null&&this.hhSensorNo==null){
                this.equipmentType=1
            }else{
                 this.equipmentType=2
            }
            this.editVerticalDisplaceShow=true;
        },
        VerticalDisplaceCancle(){
                this.addVerticalDisplaceShow=false;
                this.baseSystemId='';
                this.baseChannelNo='';
                this.baseSensorAddress='';
                this.systemId='';
                this.channelNo='';
                this.sensorAddress='';      
                this.hhSensorNo='';
                this.hhBaseSensorNo='';
                this.initalHeight='';
                 this.hhBaseInitData='';   
                    this.hhInitData='';
                    this.selectInitTimeValue='';
                    this.hhBaseInitDataTime='';
                    this.hhInitDataTime='';
        },
        editVerticalDisplaceCancle(){
            this.editVerticalDisplaceShow=false;
            this.baseSystemId='';
            this.baseChannelNo='';
            this.baseSensorAddress='';
            this.systemId='';
            this.channelNo='';
            this.sensorAddress='';      
            this.hhSensorNo='';
            this.hhBaseSensorNo='';
            this.initalHeight='';
            this.hhBaseInitData='';   
            this.hhInitData='';
            this.selectInitTimeValue='';
            this.hhBaseInitDataTime='';
            this.hhInitDataTime='';
            this.hhBaseInitDataTime1='';
            this.hhInitDataTime1='';
            this.basePointInitList=[];
            this.bindPointInitList=[];
        },
        //自动导入水平位移
        addHorizontalDisplace(){
            this.addHorizontalDisplaceShow=true;
            this.getInsertHistoryDate();
        },
        horizontalDisplaceCancle(){
            this.addHorizontalDisplaceShow=false;
            this.horChannelNo='';
            this.horSensorAddress='';
            this.horSystemId='';
            this.horInitalValue='';

        },
        edithorizontalDisplaceCancle(){
            this.editHorizontalDisplaceShow=false;
            this.horChannelNo='';
            this.horSensorAddress='';
            this.horSystemId='';
            this.horInitalValue='';
        },
        makeHorizontalDisplaceSure(){
            axios({
                url:this.BDMSUrl+'detectionInfo/addHorizontalBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.forcePointId,
                    systemId:this.horSystemId,
                    channelNo:this.horChannelNo,
                    sensorAddress:this.horSensorAddress,
                    initShift:this.horInitalValue
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.addHorizontalDisplaceShow=false;
                    // this.setInitCollectTime();
                    this.getHorizontalDisplace();
                    this.horChannelNo='';
                    this.horSensorAddress='';
                    this.horSystemId='';
                    this.horInitalValue='';
                }
            })
        },
        editAutoHorizontal(id){
            this.editHorizontalDisplaceShow=true;
            this.getPointDatas();
            this.getInsertHistoryDate();
            this.getHorizontalDisplaceList.forEach((item)=>{
                if(item.id==id){
                    this.editId=item.id;
                    this.forcePointId=item.pointId;
                    this.horChannelNo=item.channelNo;
                    this.horSensorAddress=item.sensorAddress;
                    this.horSystemId=item.systemId;
                    this.horInitalValue=item.initShift;
                }
            })
             
            // console.log(this.selectTimeValue,'this.selectTimeValue');
        },
        editHorizontalDisplaceSure(){
             axios({
                url:this.BDMSUrl+'detectionInfo/updateHorizontalBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.editId,
                    pointId:this.forcePointId,
                    systemId:this.horSystemId,
                    channelNo:this.horChannelNo,
                    sensorAddress:this.horSensorAddress,
                    initShift:this.horInitalValue
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.editHorizontalDisplaceShow=false;
                    // this.setInitCollectTime();
                    this.getHorizontalDisplace();
                    this.getPointDatas();
                    this.horChannelNo='';
                    this.horSensorAddress='';
                    this.horSystemId='';
                    this.horInitalValue='';
                }
            })
        },
        getHorizontalDisplace(){
            axios({
                url:this.BDMSUrl+'detectionInfo/getHorizontalBindInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getHorizontalDisplaceList=response.data.rt;
                }
            })
        },
        DeleteAutoHorizontal(id){
            this.$confirm('您要删除当前所选主题?','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((response)=>{
                axios({
                    url:this.BDMSUrl+'detectionInfo/deleteHorizontalBindInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                      this.getHorizontalDisplace();
                    }
                })
            })
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
            // console.log(vm.filesList,'vm.filesList');
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
             this.getDeviceMonitorPointRelationList=[];
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
                    if( this.manufacturerValue=="基康"){}
                        this.getDeviceMonitorPointRelation();
                    
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
        textDeviceMonitorPointRelation(){
            var vm=this;
            if(this.nodeId==''){
                this.$message({
                    type:'info',
                    message:'请输入项目ID'
                })
            }else{
                this.textShow=true;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/testHuahuan',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        nodeId:vm.nodeId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.testHuahuanList=response.data.rt.matchResult;
                        this.collectGroupAmount=response.data.rt.collectGroupAmount;
                        this.matchGroupAmount=response.data.rt.matchGroupAmount;
                    }else if(response.data.cd=='-1'){
                        this.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            }
            
        },
        textShowCancle(){
            this.textShow=false;
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
                if(response.data.rt.length!=0){
                    this.getHuahuanNodeList=response.data.rt;
                    this.nodeId=this.getHuahuanNodeList[0].nodeId;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },

        //监测项目采集改变
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
        //受力公式设定
        forceWaySetting(){
            this.formulaSettingShow=true;
            this.getFormula();
        },
        formulaSettingCancle(){
            this.formulaSettingShow=false;
            this.AsValue=null;
            this.EsValue=null;
            this.barDiameterValue=null;
            this.barCountValue=null;
            this.concreteWidthValue=null;
            this.concreteHeightValue=null;
            this.concreteLevel=null;
            this.barGradeValue=null;
            this.acValueArea=null;
            this.asValueArea=null;
        },
        //获取受力公式
        getFormula(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getFormula',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:vm.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    if(response.data.rt.length!=0){
                        this.getFormulaList=response.data.rt
                        this.getFormulaList.forEach((item)=>{
                            if(item.pointId==this.forcePointId){
                                this.AsValue=item.as;
                                this.barCountValue=item.barCount;
                                this.barDiameterValue=item.barDiameter
                                this.barGradeValue=item.barGrade
                                this.concreteHeightValue=item.concreteHeight
                                this.concreteLevelValue=item.concreteLevel
                                this.concreteWidthValue=item.concreteWidth
                                this.EsValue=item.es
                                this.useFormulaValue=item.formula==1?'1':'2'
                                this.asValueArea=item.as2;
                                this.acValueArea=item.es2;
                                this.esChange(this.barGradeValue);
                                this.ecChange(this.concreteLevelValue);
                            }
                        })
                       
                    }
                    // console.
                }else if(response.data.cd=='-1'){

                }
            })

        },
        asMethod(){
            this.asValueArea=3.14*(this.barDiameterValue)*(this.barDiameterValue)/4
        },
        //
        acMethod(){
            this.acValueArea=(this.concreteWidthValue)*(this.concreteHeightValue)-(this.asValueArea)*(this.barCountValue);
        },
        ecChange(name){
            this.ecList.forEach((item)=>{
                if(item.name==name){
                     this.ecValue=item.value;
                }
            })
        },
        esChange(val){
             this.esList.forEach((item)=>{
                 if(item.name==val){
                     this.esValue=item.value;
                 }
             })
        },
        //获取受力公式
        // getFormula(){
        //     axios({
        //         url:this.BDMSUrl+'detectionInfo/getFormula',
        //         method:"get",
        //         params:{
        //             itemId:this.itemMonitorId,
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd==0){
        //             this.getFormulaLists=response.data.rt;

        //         }
        //     })
        // },
        
        //设置受力公式
        setFormula(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/setFormula',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    useFormula:vm.useFormulaValues,
                    As:vm.AsValue,
                    Es:vm.EsValue,
                    barDiameter:vm.barDiameterValue,
                    barCount:vm.barCountValue,
                    concreteWidth:vm.concreteWidthValue,
                    concreteHeight:vm.concreteHeightValue,
                    concreteLevel:vm.concreteLevelValue,
                    barGrade:vm.barGradeValue,
                    pointId:this.forcePointId,
                    As2:this.asValueArea,
                    Es2:this.acValueArea
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.$message({
                    //     type:'success',
                    //     message:'公式设定成功'
                    // })
                    this.formulaSettingShow=false;
                    this.AsValue=null;
                    this.EsValue=null;
                    this.barDiameterValue=null;
                    this.barCountValue=null;
                    this.concreteWidthValue=null;
                    this.concreteHeightValue=null;
                    this.concreteLevel=null;
                    this.barGradeValue=null;
                    this.acValueArea=null;
                    this.asValueArea=null;

                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })

        },




        



    }
})
</script>
<style lang="less" scoped>
    *{
        margin:0;
        padding: 0;
        box-sizing: border-box;
    }
    .isClickStyle{
         color: #ffffff !important;
        background: #fc3439 !important;
    }
    i{
        font-style:normal
    }
    li{list-style: none}
    // #edit 
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
    #commonDetail{
        margin: 0 20px 20px!important;
        .project{
            width: 100%;
            max-height: 800px;
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
            }
        .projectBody{
            width: 98%;
            margin:0 auto;
            .projectBodyHead{
                height: 32px;
                margin-top:26px;
                position: relative;
                .block{
                    width: 200px;
                    height: 20px;
                    display: inline-block;
                    position: absolute;
                    right: 1%;
                    top:55px;
                    z-index:100;
                    .demonstration{
                            display: inline-block;
                            color:red;
                    }
                }
                .headLeft{
                    // float: right;
                    position: absolute;
                    right: 0px;
                    top:0px;
                    .headLeftBtn{
                        display: inline-block;
                        width: 54px;
                        height: 25px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 14px;
                        line-height: 25px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 2px;
                        cursor: pointer;
                        // margin-right: 3px;
                    }
                }
                .headMiddle{
                    width: 400px;
                    display: inline-block;
                    label{
                        line-height: 32px;
                        font-size: 14px;
                        color: #333333;
                    }
                }
                .headRight{
                    // float: left;
                    position: absolute;
                    left:0px;
                    top:0px;
                    
                    .autoImportTxt{
                        color:#999999;
                        font-size: 14px;
                        width: 60px;
                        height: 26px;
                        line-height: 26px;
                    }
                    .import2{
                        position: relative;
                        display: inline-block;
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
                            top: 9px;
                            right: 11px;
                        }
                    }
                    
                    .import{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 14px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                    .import1{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 14px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                     .import2{
                        display: inline-block;
                        width:124px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 14px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
            }
            .projectBodyCenter{
                        margin-top:10px !important;
                        margin:0 auto;
                        border:1px solid #e6e6e6;
                        height: 540px;
                        width: 100%;
                        position: relative;
                        .operateTool{
                            width: 288px;
                            height: 34px;
                            // border:1px solid #ccc;
                            float: right;
                            margin-top:15px;
                            margin-right:10px;
                            position: relative;
                            z-index: 10;
                            .operateToolLeft{
                                width:216px;
                                height: 34px;
                                float: left;
                                position: relative;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                background: #fff;
                                .move{
                                    display: inline-block;
                                    width: 36%;
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
                                            font-size: 14px;
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
                                    // border-right:1px dashed #ccc;
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
                                            font-size: 14px;
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
                                    // left:72%;
                                    left:68%;
                                    width: 30%;
                                    border-left:1px dashed #ccc;
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
                                        font-size: 14px;
                                        display: block;
                                        margin-left: 12px;
                                        margin-top: 1px;
                                    }
                                }
                                .fault1{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    // border-right:1px dashed #ccc;
                                    left:33%;
                                    cursor: pointer;
                                    .faultIcon{
                                        background: url('./images/fix.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 4px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/fix1.png') no-repeat 0 0;
                                        }
                                            .faultTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 14px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 0px;
                                        }
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
                                background: #fff;
                                .saveDrawTxt{
                                    font-size:14px;
                                    color:#666666;
                                    line-height: 32px;
                                }
                            }

                        }
                        .planeFigureGround{
                            z-index: 8;
                            height: 530px;
                            width: 100%;
                            position:absolute;
                            top:0px;
                            left: 0px;

                            img{
                                width: 100%;
                                height: 100%;
                                padding:5px;
                            }
                            #drawingPdf{
                                 width: 100%;
                                height: 530px;
                                padding:5px;
                            }
                        }
                        .rightBottomCheck{
                            position: absolute;
                            bottom:30px;
                            left:30px;
                            z-index:11;
                        }

            }
            .projectBodyBottom{
                margin-top:30px;
                .bottomTabel{
                    #bottomTableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                             tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 14px;
                                        color: #333333;
                                        .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;
                                        }
                                        .el-icon-warning{
                                            font-size: 17px;
                                        }
                                        .el-icon-time{
                                            font-size: 18px;
                                        }
                                        .el-icon-date{
                                            font-size: 17px;
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
                .bottomTabelPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .paginationLeft{
                        position: absolute;
                        left: 50px;
                        bottom: 0px;
                        .leftBtnOne{
                            display: inline-block;
                            width: 54px;
                            height: 25px;
                            border: 1px solid #e6e6e6;
                            background: #e6e6e6;
                            font-size: 14px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            margin-left: 30px;
                            margin-right: 100px;
                        }


                    }
                    .paginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 10px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                        .elPagination{
                            

                        }
                    }
                }
            }


        }
        #edit{
            .el-dialog__wrapper{
                .el-dialog{
                    width: 900px;
                }

            }
            
            .searchBtn{
                display: inline-block;
                width: 54px;
                height: 26px;
                border: 1px solid #f2f2f2;
                background: #fc3439;
                font-size: 14px;
                line-height: 26px;
                color: #f2f2f2;
                border-radius: 3px;
                cursor: pointer;
            }
            .editPersonInput{
                width: 200px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
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
                    position: relative;
                    width: 164px;
                    height: 122px;
                    // background: #f0f1f4;
                    margin-right: 10px;
                    margin-top:20px;
                    border-radius: 4px;
                    &:hover{
                        border:1px solid #ccc;
                    }
                    .baseMapBodyImg{
                        width: 100%;
                        height: 122px;
                        margin: 0;
                        padding: 0;
                        border-radius: 2px;
                        cursor: pointer;
                        object-fit: contain;
                        background: #f0f1f4;

                    }
                    .baseMapBodyLiBottom{
                        position: absolute;
                        width: 100%;
                        height: 26px;
                        background-color: #000;
                        opacity: 0.3;;
                        bottom: 0px;
                        left:0px;
                        .baseMapName{
                            color:#fff;
                            font-weight: bold;
                            float: left;
                            margin-left:10px;
                            width: 100px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .baseMapCount{
                            color:#fff;
                            font-weight: bold;
                            float: right;
                            margin-right: 10px

                        }
                        .deleteBaseMap{
                            background: url('./images/delete.png') no-repeat 0 0;
                            width: 20px;
                            height: 20px;
                            display: inline-block;   
                            float:right;
                            cursor: pointer;
                            margin-right:5px;
                        }
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
                    .el-icon-circle-plus{
                        font-size:18px;
                        display: inline-block;
                        margin-right:4px;
                        cursor: pointer;
                    }
                    .el-icon-setting{
                        font-size:18px;
                        display: inline-block;
                        margin-right:4px;
                        cursor: pointer;
                    }
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
                height: 300px;
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
                                    font-size: 14px;
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
                                        font-size: 14px;
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
                                        .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;

                                        }
                                        .deleteBtn{
                                            background: url('../../assets/delete.png') no-repeat 0 0;
                                        }
                                        .editBtn{
                                            background: url('./images/overviewedit.png') no-repeat 0 0;
                                        }
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
                                        font-size: 14px;
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
                height:300px;
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
                                    font-size: 14px;
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
                                        font-size: 14px;
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
                                        font-size: 14px;
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
            .editBtnT{

            }
            #textBody{
                width: 85%;
                margin:10px auto;
                // height: 300px;
                overflow: auto;
                position: relative;
                .textBodyTable{
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
                                    font-size: 14px;
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
                                        font-size: 14px;
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
            .editBody{
                .editBodytwo{
                    .editTxt{
                        display: inline-block;
                        // margin-left: 74px;
                        margin-left:180px;
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        margin-right: 20px;
                        width: 27%;
                        text-align: left;
                    }
                    .editInput{
                        width: 130px;
                        height: 32px;
                        border: 1px solid #d1d1d1;
                        border-radius: 2px;
                        background: #fafafa;
                        padding-left: 10px;
                    }
                    .eidtSelect{
                        // width: 130px;
                        // height: 32px;
                        // border: 1px solid #d1d1d1;
                        // border-radius: 2px;
                        // background: #fafafa;
                        // padding-left: 10px;
                        width: 130px;
                        border-radius: 2px;
                        height: 32px;
                        border: 1px solid #cccccc;
                        position: relative;
                        background: #fafafa;
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

        }
    }

</style>


