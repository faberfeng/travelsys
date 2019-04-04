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
                <div class="headLeft" v-show="manageEdit">
                    <!-- <span :class="[{'isClickStyle':isClick},'headLeftBtn']" @click="baseMapEmit()">底图</span> -->
                    <span :class="[{'isClickStyle':isClick1},'headLeftBtn']" @click="spotClick()">单点</span>
                    <span :class="[{'isClickStyle':isClick2},'headLeftBtn']" @click="spotAllClick()">连续</span>
                    <span :class="[{'isClickStyle':isClick3},'headLeftBtn']" @click="drawingTxtClick()">文字</span>
                    <span :class="[{'isClickStyle':isClick4},'headLeftBtn']" @click="enableMoveCommon()">移动</span>
                    <span :class="[{'isClickStyle':isClick5},'headLeftBtn']" style="width:100px !important" @click="changeBroken(1)">故障/修复</span>
                    <span :class="[{'isClickStyle':isClick6},'headLeftBtn']" @click="deleteDrawCommon()">删除</span>
                    <span :class="[{'isClickStyle':isClick7},'headLeftBtn']" style="margin-left:20px;" @click="saveDraw()">保存</span>
                    <span :class="[{'isClickStyle':isClick8},'headLeftBtn']" style="background:#fff !important;" @click="cancleAll()">取消</span>
                </div>
                <div class="headMiddle">
                    <label>测试总数：{{itemSubmitCount}} </label>
                    <label>报警：{{isAlertNum}}</label>
                    <label>故障：{{isBrokenNum}}</label>
                </div>
                <div class="headRight" v-show="editInspectMethodEdit">
                    <span class="autoImportTxt">采集方式:</span>
                    <div class="import2">
                        <select v-model="importMethod" @change="importMethodChange()" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                    </div>
                        <span v-show="importMethod==1&&importDataEdit" class="import" @click="handExportExcel()">导入</span>
                        <span v-show="importMethod==2&&importDataEdit" @click="autoAcquisitionBtn()" class="import">配置</span>
                        <span class="import1" v-show="exportDataEdit" @click="getImportHistory">导出</span>
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
                <div class="bottomTabel">
                    <table class="bottomTableList" border="1" cellspacing="0" width="100%">
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
                                <td v-show="itemMonitorType!=4&&itemMonitorType!=3&&itemMonitorType!=1">{{item.recentVariation*1000|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==4">{{item.recentVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.recentVariation*100|addSpritNum1()}}</td>
                                 <td v-show="itemMonitorType==1">{{item.recentVariation|addSpritNum2()}}</td>
                                <td v-show="itemMonitorType!=4&&itemMonitorType!=3&&itemMonitorType!=1">{{item.totalVariation*1000|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==4">{{item.totalVariation|addSpritNum1()}}</td>
                                <td v-show="itemMonitorType==3">{{item.totalVariation*100|addSpritNum1()}}</td>
                                <td>
                                    <i class="el-icon-warning" style="color:red;width:18px;height:18px;cursor:pointer" @click="editWarn(item.pointId)"></i>
                                    <button title="定位" class="location actionBtn"></button>
                                    <button title="曲线" @click="getCurve(item.pointId,item.pointName,null)" class="curve actionBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bottomTabelPagination">
                    <div class="paginationLeft">
                        <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">报警值：</label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertDay">单次{{changeAlertDay}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm/天</label><label v-show="itemMonitorType==2||itemMonitorType==3">m/天</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertHour">{{changeAlertHour}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm/时</label><label v-show="itemMonitorType==2||itemMonitorType==3">m/时</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertTotal">累计{{changeAlertTotal}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm</label><label v-show="itemMonitorType==2||itemMonitorType==3">m</label><label v-show="itemMonitorType==4">KN</label></label>
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
                            end-placeholder="结束日期">                         
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
                    
                    <div v-if="spotChangeLineShow">
                        <vue-highcharts  id="spotChangeLine" style="max-height:900px"  :options="optionSpotChangeLine" ref="spotChangeLine"></vue-highcharts>
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
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="autoAcquisitionMakeSure()" >确定</button>
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
                                <!-- <img style="height:230px" src="../../assets/nodata.png" v-show="!getImportHistoryList"> -->
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
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import picView from './picView.vue'
import pdf from 'vue-pdf'
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
            startValue:'',
            endValue:'',
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
            autoAcquisitionShow:false,//自动采集配置
            textShow:false,
            uploadshow:false,
            exportHistoryRecoedShow:false,
            idsList:[],
            allCheck:false,
            testShow:false,
            filesList:"",
            getDeviceMonitorPointRelationList:'',//获取点位关系数据
            getSingleSheetTitleInfoList:'',
            imageName:"未选择任何文件",
            acquisitionTimeXlist:[],
            acquisitionTimeYlist:'',
            elevationYlist:[],
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
                            type: 'spline',
                            inverted: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories:[],
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
            console.log(this.selectValue,'this.startValue');
            this.startValue=this.selectValue[0];
            this.endValue=this.selectValue[1];
            axios({
                url:this.BDMSUrl+'detectionInfo/getPointChartData',
                headers:{
                    'token':vm.token
                },
                params:{
                    startDate:this.startValue,
                    endDate:this.endValue,
                    pointId:this.pointId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    console.log(response.data.rt);
                }
            })
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
                this.$refs.pic.enableType(this.commonMonitorMainItemList[i].type,this.commonMonitorMainItemList[i].sign,this.commonMonitorMainItemList[i].spotNum);
            }
            this.$refs.pic.enableType(this.itemMonitorType,this.itemSubmitSign,true);
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
                    itemId:this.itemMonitorId
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
                    // userGroupId:vm.userGroupId,
                    baseMapId:vm.itemSubmitbaseMapId
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
                 console.log(this.monitorPointInfo,'this.monitorPointInfo');  
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
                    this.variationAlertTotal=this.getAlertArgumentsList.changeAlertTotal;
                    this.variationAlertDay=this.getAlertArgumentsList.changeAlertDay;
                    this.variationAlertHour=this.getAlertArgumentsList.changeAlertHour;
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
                    variationAlertTotal:this.variationAlertTotal,
                    variationAlertDay:this.variationAlertDay,
                    variationAlertHour:this.variationAlertHour,
                    pointId:this.currentPointId
                }
            }else{
                data={
                    itemId:this.itemMonitorId,
                    variationAlertTotal:this.variationAlertTotal,
                    variationAlertDay:this.variationAlertDay,
                    variationAlertHour:this.variationAlertHour
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
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointForceChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.force)
                    })
                    var min=this.getMinValue(this.elevationYlist);
                     var max=this.getMaxValue(this.elevationYlist)
                    var middle=(min+max)/2;
                    this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                     this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                     this.spotChangeLineShow=true;
                    setTimeout(()=>{
                        let spotChangeLineChart=this.$refs.spotChangeLine;
                        spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                        spotChangeLineChart.removeSeries();
                        spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                        spotChangeLineChart.hideLoading();
                        spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                    },200)
                    
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
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointGaugeChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.gaugeHeight)
                    })
                     var min=this.getMinValue(this.elevationYlist);
                     var max=this.getMaxValue(this.elevationYlist)
                    var middle=(min+max)/2;
                    this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                     this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                     this.spotChangeLineShow=true;
                    setTimeout(()=>{
                        let spotChangeLineChart=this.$refs.spotChangeLine;
                        spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                        spotChangeLineChart.removeSeries();
                        spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                        spotChangeLineChart.hideLoading();
                        spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                    },200)
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水平位移）
        getPointHorizontalShiftChartData(){
             var vm=this;
             this.acquisitionTimeXlist=[];
             this.elevationYlist=[];
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointHorizontalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.shiftDistance)
                    })
                    // console.log(this.acquisitionTimeXlist,'this.acquisitionTimeXlist');
                    // console.log(this.elevationYlist,'this.elevationYlist');
                     var min=this.getMinValue(this.elevationYlist);
                     var max=this.getMaxValue(this.elevationYlist);
                    //  console.log(min,'min');
                    //  console.log(max,'max');
                    var middle=(min+max)/2;
                    this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                     this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                     this.spotChangeLineShow=true;
                    setTimeout(()=>{
                        let spotChangeLineChart=this.$refs.spotChangeLine;
                        spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                        spotChangeLineChart.removeSeries();
                        spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                        spotChangeLineChart.hideLoading();
                        spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                    },200)
                    
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
             this.optionSpotChangeLine.yAxis.min='';
             this.optionSpotChangeLine.yAxis.max='';
            //  console.log(this.optionSpotChangeLine.yAxis.min);
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointVerticalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                    this.getPointList=response.data.rt;
                    this.getPointList.forEach((item)=>{
                        this.acquisitionTimeXlist.push(this.timeChangeMethod(item.acquisitionTime))
                        this.elevationYlist.push(item.elevation)
                    })
                    var min=this.getMinValue(this.elevationYlist);
                     var max=this.getMaxValue(this.elevationYlist)
                    var middle=(min+max)/2;
                    this.optionSpotChangeLine.yAxis.min=(3*min-2*max);
                     this.optionSpotChangeLine.yAxis.max=(3*max-2*min);
                     this.spotChangeLineShow=true;
                    setTimeout(()=>{
                        let spotChangeLineChart=this.$refs.spotChangeLine;
                        spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                        spotChangeLineChart.removeSeries();
                        spotChangeLineChart.addSeries({name:this.pointName,data:this.elevationYlist});
                        spotChangeLineChart.hideLoading();
                        spotChangeLineChart.getChart().xAxis[0].update({categories:this.acquisitionTimeXlist});
                    },200)
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
    #edit 
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
                    .bottomTableList{
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
            #toolTbale1{
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

        }
    }

</style>


