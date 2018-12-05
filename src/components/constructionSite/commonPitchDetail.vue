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
                    <div class="containerHeadMiddle">
                        <label>测试总数：{{itemSubmitCount}}</label>
                        <label>报警：{{itemAlertAmount}}</label>
                    </div>
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
                                <th rowspan="2">起始深度</th>
                                <th rowspan="2">结束深度</th>
                                <th rowspan="2">点位间隔</th>
                                <th rowspan="2">点位数量</th>
                                <th colspan="3">当前最大值</th>
                                <th colspan="4">累计最大变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>位置(m)</th>
                                <th>位移(mm)</th>
                                <th>报警</th>
                                <th>时间间隔</th>
                                <th>位置(m)</th>
                                <th>变化(mm)</th>
                                <th>报警</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getPitchBaseInfoList1" :key="index">
                                <td v-text="$options.filters.addSprit(item.name)"></td>
                                <td v-text="$options.filters.addSprit(item.keyword)"></td>
                                <td v-text="$options.filters.addSprit(item.initDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.terminalDepth)"></td>
                                <td v-text="item.pointDistance"></td>
                                <td v-text="item.pointAmount"></td>
                                <td v-text="$options.filters.addSprit(item.maxDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.maxShift)"></td>
                                <td :class="[{'red':item.maxAlert==true}]">{{item.maxAlert|shifouChange()}}</td>
                                <td v-text="$options.filters.timeStamp(item.maxVariationInterval)"></td>
                                <td v-text="$options.filters.addSprit(item.maxVariationDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.maxVariationShift)"></td>
                                <td :class="[{'red':item.maxVariationAlert==true}]">{{item.maxVariationAlert|shifouChange()}}</td>
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
                <div class="bottomTabelPagination">
                    <div class="paginationLeft">
                        <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">报警值：</label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertDay">单次{{changeAlertDay}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertHour">{{changeAlertHour}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm</label><label v-show="itemMonitorType==2&&itemMonitorType==3">m</label><label v-show="itemMonitorType==4">KN</label></label>
                        <label style="color:#333;font-size:14px;line-height:62px;display:inlin-block;margin-left:10px;" v-show="changeAlertTotal">累计{{changeAlertTotal}}<label v-show="itemMonitorType!=4&&itemMonitorType!=2&&itemMonitorType!=3">mm</label><label v-show="itemMonitorType==2&&itemMonitorType==3">m</label><label v-show="itemMonitorType==4">KN</label></label>
                        </span>
                        <span class="leftBtnOne" @click="editAlertValueBtn()">修改</span>
                        <span class="leftTxtTwo">
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">观测：</label><label style="color:#333;font-size:14px;line-height:62px">{{observerName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">计算：</label><label style="color:#333;font-size:14px;line-height:62px">{{calculatorName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">检核：</label><label style="color:#333;font-size:14px;line-height:62px">{{inspectorName}}</label>
                        </span>
                        <span class="leftBtnOne" @click="editPersonBtn()">修改</span>
                    </div>
                    <div class="paginationRight">
                        <el-pagination class="elPagination"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage2"
                            :page-sizes="[5,10,15]"
                            :page-size="1"
                            layout="sizes,prev, pager, next"
                            :total="getPitchBaseInfoListLength">
                        </el-pagination>
                    </div>
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
                                        <th colspan="2">最新位移(mm)</th>
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
                                        <!-- {{leftDisplayListValue1[index].depth}} -->
                                        <td>{{(leftDisplayList.recentVariation)[index].otherParam|addSprit}}</td>
                                        <td >{{leftDisplayListValue1[index].shift|addSprit}}</td>
                                        <td >{{leftDisplayListValue2[index].shift|addSprit}}</td>
                                        <td>{{(leftDisplayList.recentVariation)[index].recentVariation|addSprit}}</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>{{time|timeChange}}</td>
                                        <td>{{time1|timeChange}}</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>{{leftMaxShift1}}mm</td>
                                        <td>{{leftMaxShift2}}mm</td>
                                        <!-- {{(leftDisplayList.recentVariation)[index].recentVariation|totalVariation}} -->
                                        <td>{{leftMaxVariation}}mm/d</td>
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
                        <div class="twoGraph" ref="twoGraphRef">
                            <!-- style="min-height:1900px" -->
                            <vue-highcharts id="leftHightchart" style="min-height:1900px"   :options="optionOnesLeft" ref="lineLeftChartOne"></vue-highcharts>
                            <canvas style="position:absolute;top:48px;left:15px"  ref="canvasLeftRef" id="canvasLeft"></canvas>
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
                                        <th colspan="2">最新位移(mm)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th>{{time2|timeChange}}</th>
                                        <th>{{time3|timeChange}}</th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                               <tbody>
                                    <tr v-for="(item,index) in rightDisplayList.recentVariation" :key="index">
                                        <td>{{(rightDisplayList.recentVariation)[index].otherParam|addSprit}}</td>
                                        <td >{{rightDisplayListValue1[index].shift|addSprit}}</td>
                                        <td >{{rightDisplayListValue2[index].shift|addSprit}}</td>
                                        <td>{{(rightDisplayList.recentVariation)[index].recentVariation|addSprit}}</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>{{time2|timeChange}}</td>
                                        <td>{{time3|timeChange}}</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>{{rightMaxShift1}}mm</td>
                                        <td>{{rightMaxShift2}}mm</td>
                                        <!-- {{(rightDisplayList.recentVariation)[index].totalVariation|addSprit}} -->
                                        <td>{{rightMaxVariation}}mm/d</td>
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
                            <canvas style="position:absolute;top:48px;left:15px"  ref="canvasRightRef" id="canvasRight"></canvas>
                        </div>
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
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">计算员</label>
                        <select v-model="calculatorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">核查员</label>
                        <select v-model="inspectorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
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
                        <label class="editTxt">起始深度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束深度:</label>
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
                        <label class="editTxt">起始深度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" readonly='readonly' class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束深度:</label>
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
            <el-dialog  width="590px" :visible="editMarkShowLeft" title="位置标记管理" @close="editMarkCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <div class="markhead">
                            <label class="txt">测点序列{{markSqName}}曲线图位置标记</label>
                            <label class="btn" @click="addSqL()">插入</label>
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
                                        <tr v-for="(item,index) in getPitchSeqMarkLeftList" :key="index">
                                            <td width="20%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.depth}}</span><input placeholder="请输入" style="width:100%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markDepth"/></td>
                                            <td width="50%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.name}}</span><input placeholder="请输入" style="width:54%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markName"/>
                                                <button v-show="item.id==editPitchShow" @click="editPitchSeqMarkSure(item.id,item.depth,item.name,item.seqId)" class="actionMakeBtn">确定</button>
                                                <button v-show="item.id==editPitchShow" @click="canclePitchSeqMark()" class="actionCancleBtn">取消</button>
                                                </td>
                                            <td width="30%">
                                                <button title="修改"  @click="editPitchSeqMark(item.id,item.depth,item.name)" class="editBtn actionBtn"></button>
                                                <button title="删除" @click="deletePitchSeqMark(item.id,item.seqId)" class="actionBtn deleteBtn"></button>
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
            <el-dialog  width="590px" :visible="editMarkShowRight" title="位置标记管理" @close="editMarkCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <div class="markhead">
                            <label class="txt">测点序列{{markSqName}}曲线图位置标记</label>
                            <label class="btn" @click="addSqR()">插入</label>
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
                                        <tr v-for="(item,index) in getPitchSeqMarkRightList" :key="index">
                                            <td width="20%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.depth}}</span><input placeholder="请输入" style="width:100%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markDepth"/></td>
                                            <td width="50%"><span v-show="item.id!=null&&item.id!=editPitchShow">{{item.name}}</span><input placeholder="请输入" style="width:54%;height:28px" v-show="item.id==null||item.id==editPitchShow" v-model="markName"/>
                                                <button v-show="item.id==editPitchShow" @click="editPitchSeqMarkSure1(item.id,item.depth,item.name,item.seqId)" class="actionMakeBtn">确定</button>
                                                <button v-show="item.id==editPitchShow" @click="canclePitchSeqMark()" class="actionCancleBtn">取消</button>
                                                </td>
                                            <td width="30%">
                                                <button title="修改"  @click="editPitchSeqMark(item.id,item.depth,item.name)" class="editBtn actionBtn"></button>
                                                <button title="删除" @click="deletePitchSeqMark1(item.id,item.seqId)" class="actionBtn deleteBtn"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPitchSeqMark1()" >确定</button>
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
                    <div class="editBodytwo" v-show="manufacturerValue=='华桓'">
                        <label class="editInpText" style="width:10% !important;">点位映射</label>
                         <div class="tool">
                             <span class="export" @click="autoExport()"><label class="export1"></label><label class="exportTxt" >导入</label></span>
                             <span class="export" @click="clearDeviceMonitorPointRelation()"><label class="export2"></label><label class="exportTxt">清空</label></span>
                             <span class="export" @click="textDeviceMonitorPointRelation()"><label class="export3"></label><label class="exportTxt">测试</label></span>
                        </div>
                        <!-- style="height:300px" -->
                        <div id="toolTbale" >
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
                        <label class="editInpText" style="width:35% !important;" >成果获取到{{collectGroupAmount}}组数据,匹配到{{matchGroupAmount}}组数据</label>
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
        props:['surveyName','itemMonitorId','itemMonitorType','itemMonitorKeyWord','userGroupId'],
        components:{
            VueHighcharts
        },
        data(){
            return{
                editPersonShow:false,
                editAlertValueShow:false,
                variationAlertTotal:"",
                variationAlertDay:'',
                variationAlertHour:'',
                userGroupList:'',
                observerId:'',
                calculatorId:"",
                inspectorId:'',
                currentPage2:1,
                getPointDatasListLength:0,
                changeAlertDay:'',
                changeAlertHour:'',
                changeAlertTotal:'',
                observerName:'',
                calculatorName:'',
                inspectorName:'',
                getItemDutyUserList:'',
                getAlertArgumentsList:'',
                changeAlertDay:'',

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
                getPitchBaseInfoList1:[],
                getPitchBaseInfoListLength:0,
                pageSize:5,
                pageNum:1,
                pitchDetailDataList:'',//获取数据详情（下面的图）
                pitchDetailDataListLeft:'',
                pitchDetailDataListRight:'',
                addIndexNumShow:false,//增加序列
                editIndexNumShow:false,//修改序列
                editMarkShow:false,//编辑mark
                editMarkShowLeft:false,
                editMarkShowRight:false,
                initDepth:'',//起始标高
                terminalDepth:'',//结束标高
                allnum:'',
                pointDistance:'',//点位间隔
                keyword:'',//关键字
                indexName:'',//序列编号
                spotNum:'',//测点数量
                leftDisplayName:'',
                leftDisplayShow:true,
                rightDisplayShow:true,
                rightDisplayName:'',
                leftDisplayList:'',
                leftDisplayListValue:'',
                leftDisplayListValue1:[],
                leftMaxShift1:'',
                leftMaxShift2:'',
                leftMaxVariation:"",
                leftMaxHeight:'',
                leftMaxShift3:'',
                rightMaxShift1:'',
                rightMaxShift2:'',
                rightMaxVariation:"",
                rightMaxHeight:'',
                rightMaxShift3:'',
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
                                    text: '位移'
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
                                    text: '位移'
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
                //测试华桓数据
                textShow:false,
                collectGroupAmount:0,
                testHuahuanList:'',
                matchGroupAmount:0,

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
                getPitchSeqMarkLeftList:'',
                getPitchSeqMarkRightList:'',
                markDepth:'',
                markName:'',
                editPitchShow:'',
                itemSubmitCount:0,//测试总数
                itemAlertAmount:0,
                isAlertNum:0,//报警总数



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
            this.getItemDutyUser();
            this.getAlertArguments();
            this.getUserByUserGroup();
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
        hiddenShow(val){
            if(val==undefined){
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
            manufacturerValue:function(val){
                this.getDeviceMonitorPointRelation()
            }

        },
        methods:{
            editAlertValueBtn(){
                this.editAlertValueShow=true;
                this.getAlertArguments();
            },
            editPersonBtn(){
                this.editPersonShow=true;
                // this.getUserByUserGroup();
                this.getItemDutyUser();
            },
            //获取群组中的用户
            getUserByUserGroup(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getUserByUserGroup',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        userGroupId:this.userGroupId
                        
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
            editPersonCancle(){
                this.editPersonShow=false;
            },
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
            editAlertValueCancle(){
                this.editAlertValueShow=false;
            },
            editAlertArgumentsMakeSure(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/editAlertArguments',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId,
                        variationAlertTotal:this.variationAlertTotal,
                        variationAlertDay:this.variationAlertDay,
                        variationAlertHour:this.variationAlertHour
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.editAlertValueShow=false;
                        this.getAlertArguments();
                        this.getPitchBaseInfo();
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
            getAlertArguments(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getAlertArguments',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        itemId:this.itemMonitorId
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
            handleSizeChange(val){
                 this.pageSize=val;
                this.getPitchBaseInfoList1=[];
                var NumB=this.pageSize*(this.pageNum-1)
                var NumE=this.pageSize*this.pageNum-1
                if(this.getPitchBaseInfoListLength-1>=NumB&&this.getPitchBaseInfoListLength-1<=NumE){
                    NumE=this.getPitchBaseInfoListLength-1;
                }
                for(var i=NumB;i<NumE+1;i++){
                    this.getPitchBaseInfoList1.push(this.getPitchBaseInfoList[i])
                }

            },
            handleCurrentChange(val){
                this.getPitchBaseInfoList1=[];
                this.pageNum=val;
                var NumB=this.pageSize*(this.pageNum-1)
                var NumE=this.pageSize*this.pageNum-1
                if(this.getPitchBaseInfoListLength-1>=NumB&&this.getPitchBaseInfoListLength-1<=NumE){
                    NumE=this.getPitchBaseInfoListLength-1;
                }
                for(var i=NumB;i<NumE+1;i++){
                    this.getPitchBaseInfoList1.push(this.getPitchBaseInfoList[i])
                }
            },
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
                this.allnum="";
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
                this.getPitchBaseInfoList1=[];
                this.getPitchBaseInfoList=[];
                this.getPitchBaseInfoListLength=0;
                this.itemSubmitCount=0;
                this.itemAlertAmount=0;
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
                        this.getPitchBaseInfoListLength=response.data.rt.length;
                        vm.getPitchBaseInfoList.forEach((item)=>{
                            this.itemSubmitCount+=item.pointAmount
                            this.itemAlertAmount+=item.alertAmount
                        })
                        //  console.log(vm.getPitchBaseInfoList,'vm.getPitchBaseInfoList');
                        if(this.getPitchBaseInfoListLength<6){
                            for(var i=0;i<this.getPitchBaseInfoListLength;i++){
                                this.getPitchBaseInfoList1.push(this.getPitchBaseInfoList[i])
                            }
                        }else{
                            for(var i=0;i<5;i++){
                                this.getPitchBaseInfoList1.push(this.getPitchBaseInfoList[i])
                            }
                        }
                        // console.log(this.getPitchBaseInfoList1,'123');

                        // this.getPitchDetailDataBySeqId(vm.getPitchBaseInfoList1[0].id)
                        // console.log(vm.getPitchBaseInfoList1[0].id);
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //根据序列ID获取数据详情（下面的图）
            getPitchDetailDataBySeqIdLeft(num){
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
                        this.pitchDetailDataListLeft=response.data.rt;
                        if(this.pitchDetailDataListLeft.recent2PitchData.length==0){
                            this.$message({
                                type:'info',
                                message:"当前无数据，请导入数据"
                            })
                            return ;
                        }else if(this.leftDisplayShow==true){
                            this.totalShow=true;
                            this.leftShow=true;
                             this.leftDisplayListValue1=[];
                            this.leftDisplayListValue2=[];
                            this.leftDisplayListValueXdata=[];
                            this.leftDisplayListValueYdata1=[];
                            this.leftDisplayListValueYdata2=[];
                            if(this.pitchDetailDataListLeft){
                                this.leftDisplayList=this.pitchDetailDataListLeft;
                                var recentVariationLength=this.leftDisplayList.recentVariation.length;
                                this.leftDisplayListValue=this.leftDisplayList.recent2PitchData;
                                // var str='';
                                // console.log(document.getElementById('tableListid'),'style');
                                //  str=document.getElementById('tableListid').clientHeight-50;
                                //  setTimeout(()=>{
                                //         console.log(document.getElementById('tableListid').clientHeight);
                                       

                                // },20)
                                if(this.leftDisplayListValue.length==recentVariationLength){
                                    this.time=(this.leftDisplayList.recent2PitchData)[0].acquisitionTime;
                                    this.time1=null;
                                    this.leftDisplayListValue.forEach((item,index,array)=>{
                                    this.leftDisplayListValue1.push(item)
                                    this.leftDisplayListValue2.push({acquisitionTime:null,depth:null,shift:null})
                                    this.leftDisplayListValueXdata.push(item.depth)
                                    this.leftDisplayListValueYdata1.push(item.shift)
                                    })
                                    let lineLeftChart=this.$refs.lineLeftChartOne;
                                    lineLeftChart.delegateMethod('showLoading', 'Loading...');
                                    setTimeout(()=>{
                                        lineLeftChart.removeSeries();
                                        lineLeftChart.addSeries({name:this.timeChangeMethod(this.time),data:this.leftDisplayListValueYdata1});
                                        lineLeftChart.hideLoading();
                                        lineLeftChart.getChart().xAxis[0].update({categories:this.leftDisplayListValueXdata});
                                    },20)
                                }else if(this.leftDisplayListValue.length!=recentVariationLength){
                                    // document.getElementById('leftHightchart').style.minHeight=str+'px';
                                    this.time=(this.leftDisplayList.recent2PitchData)[0].acquisitionTime;
                                    this.time1=(this.leftDisplayList.recent2PitchData)[1].acquisitionTime;
                                    this.leftDisplayListValue.forEach((item,index,array)=>{
                                        if(array[index].acquisitionTime==this.time){
                                            this.leftDisplayListValue1.push(array[index])
                                            this.leftDisplayListValueXdata.push(array[index].depth)
                                            this.leftDisplayListValueYdata1.push(array[index].shift)
                                        }else if(array[index].acquisitionTime==this.time1){
                                            this.leftDisplayListValue2.push(array[index])
                                            this.leftDisplayListValueYdata2.push(array[index].shift)
                                        }
                                    })
                                    
                                    let lineLeftChart=this.$refs.lineLeftChartOne;
                                    lineLeftChart.delegateMethod('showLoading', 'Loading...');
                                    setTimeout(()=>{
                                        lineLeftChart.removeSeries();
                                        lineLeftChart.addSeries({name:this.timeChangeMethod(this.time),data:this.leftDisplayListValueYdata1});
                                        lineLeftChart.addSeries({name:this.timeChangeMethod(this.time1),data:this.leftDisplayListValueYdata2});
                                        lineLeftChart.hideLoading();
                                        lineLeftChart.getChart().xAxis[0].update({categories:this.leftDisplayListValueXdata});
                                    },20)
                                }
                                this.leftDisplayShow==false;
                                console.log(this.leftDisplayListValue1,'this.leftDisplayListValue1');
                                var maxShift1=[];
                                this.leftDisplayListValue1.forEach((item)=>{
                                    maxShift1.push(item.shift)
                                })
                                this.leftMaxShift1=this.getMaxValue(maxShift1);
                                var maxShift2=[];
                                this.leftDisplayListValue2.forEach((item)=>{
                                    maxShift2.push(item.shift)
                                })
                                this.leftMaxShift2=this.getMaxValue(maxShift2);
                                var maxVariation=[];
                                var maxHeight=[];
                                this.leftDisplayList.recentVariation.forEach((item)=>{
                                    maxVariation.push(item.recentVariation)
                                    maxHeight.push(parseInt(item.otherParam))
                                })
                                // console.log(maxHeight,'maxHeight')
                                // console.log(maxVariation,'maxVariation')
                                this.leftMaxVariation=this.getMaxValue(maxVariation)
                                this.leftMaxHeight=this.getMaxValue(maxHeight)
                                console.log(this.leftMaxHeight,'this.leftMaxHeight')
                            }
                           
                            
                        }
                    }else if(respose.data.cd=='-1'){
                        vm.$message({
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
            getPitchDetailDataBySeqIdRight(num){
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
                        this.pitchDetailDataListRight=response.data.rt;
                        if(this.pitchDetailDataListRight.recent2PitchData.length==0){
                            this.$message({
                                type:'info',
                                message:"当前无数据，请导入数据"
                            })
                            return ;
                        }else if(this.rightDisplayShow==true){
                            this.totalShow=true;
                            this.rightShow=true;
                            this.rightDisplayListValue1=[];
                            this.rightDisplayListValue2=[];
                            this.rightDisplayListValueXdata=[];
                            this.rightDisplayListValueYdata1=[];
                            this.rightDisplayListValueYdata2=[];
                            
                            if(this.pitchDetailDataListRight){
                                this.rightDisplayList=this.pitchDetailDataListRight;
                                this.rightDisplayListValue=this.rightDisplayList.recent2PitchData;
                                var recentVariationLength=this.rightDisplayList.recentVariation.length;
                                if(this.rightDisplayListValue.length==recentVariationLength){
                                    this.time2=(this.rightDisplayList.recent2PitchData)[0].acquisitionTime;
                                    this.time3=null;
                                    this.rightDisplayListValue.forEach((item,index,array)=>{
                                        this.rightDisplayListValue1.push(item)
                                        this.rightDisplayListValue2.push({acquisitionTime:null,depth:null,shift:null})
                                        this.rightDisplayListValueXdata.push(item.depth)
                                        this.rightDisplayListValueYdata1.push(item.shift)
                                    })
                                    // let lineLeftChart=this.$refs.lineLeftChartOne;
                                    let lineRightChart=this.$refs.lineRightChartOne;
                                    lineRightChart.delegateMethod('showLoading', 'Loading...');
                                    setTimeout(()=>{
                                        lineRightChart.removeSeries();
                                        lineRightChart.addSeries({name:this.timeChangeMethod(this.time2),data:this.rightDisplayListValueYdata1});
                                        lineRightChart.hideLoading();
                                        lineRightChart.getChart().xAxis[0].update({categories:this.rightDisplayListValueXdata});
                                    },20)
                                }else if(this.rightDisplayListValue.length!=recentVariationLength){
                                        this.time2=(this.rightDisplayList.recent2PitchData)[0].acquisitionTime;
                                        this.time3=(this.rightDisplayList.recent2PitchData)[1].acquisitionTime;
                                        this.rightDisplayListValue.forEach((item,index,array)=>{
                                            if(array[index].acquisitionTime==this.time2){
                                                this.rightDisplayListValue1.push(array[index])
                                                this.rightDisplayListValueXdata.push(array[index].depth)
                                                this.rightDisplayListValueYdata1.push(array[index].shift)
                                            }else if(array[index].acquisitionTime==this.time3){
                                                this.rightDisplayListValue2.push(array[index])
                                                // this.rightDisplayListValueXdata.push(array[index].depth)
                                                this.rightDisplayListValueYdata2.push(array[index].shift)
                                            }
                                        })
                                        let lineRightChart=this.$refs.lineRightChartOne;
                                        // document.getElementById('leftHightchart').style.minHeight='1950px'
                                        lineRightChart.delegateMethod('showLoading', 'Loading...');
                                        setTimeout(()=>{
                                            lineRightChart.removeSeries();
                                            lineRightChart.addSeries({name:this.timeChangeMethod(this.time2),data:this.rightDisplayListValueYdata1});
                                            lineRightChart.addSeries({name:this.timeChangeMethod(this.time3),data:this.rightDisplayListValueYdata2});
                                            lineRightChart.hideLoading();
                                            lineRightChart.getChart().xAxis[0].update({categories:this.rightDisplayListValueXdata});
                                        },20)

                                }
                                this.rightDisplayShow==false;
                                 var maxShift1=[];
                                this.rightDisplayListValue1.forEach((item)=>{
                                    maxShift1.push(item.shift)
                                })
                                this.rightMaxShift1=this.getMaxValue(maxShift1);
                                var maxShift2=[];
                                this.rightDisplayListValue2.forEach((item)=>{
                                    maxShift2.push(item.shift)
                                })
                                this.rightMaxShift2=this.getMaxValue(maxShift2);
                                var maxVariation=[];
                                var maxHeight=[];
                                this.rightDisplayList.recentVariation.forEach((item)=>{
                                    maxVariation.push(item.recentVariation)
                                    maxHeight.push(parseInt(item.otherParam))
                                })
                                this.rightMaxVariation=this.getMaxValue(maxVariation)
                                this.rightMaxHeight=this.getMaxValue(maxHeight)
                            }
                        }
                        // console.log(this.pitchDetailDataList);
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
                if(this.initDepth==''){
                    this.$message({
                        type:'info',
                        message:'请填写起始高度'
                    })
                }else if(!(/^[0-9]+.?[0-9]*$/.test(this.initDepth))){
                    this.$message({
                            type:'info',
                            message:'起始深度需为数字'
                        })
                }else if(this.terminalDepth==''){
                    this.$message({
                        type:'info',
                        message:'请填写结束高度'
                    })
                }else if(!(/^[0-9]+.?[0-9]*$/.test(this.terminalDepth))){
                    this.$message({
                            type:'info',
                            message:'结束深度需为数字'
                        })
                }else if(this.pointDistance==''){
                     this.$message({
                        type:'info',
                        message:'请填写测点间距'
                    })
                }else if(!(/^[0-9]+.?[0-9]*$/.test(this.pointDistance))){
                    this.$message({
                            type:'info',
                            message:'测点间距需为数字'
                        })
                }else if(this.keyword==''){
                    this.$message({
                        type:'info',
                        message:'请填写关键字'
                    })
                }else{
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
                                 this.$message({
                                    type:'success',
                                    message:'添加斜度序列成功'
                                })
                            }else if(response.data.cd=='-1'){
                                vm.$message({
                                    type:"error",
                                    message:response.data.msg
                                })
                            }
                        })
                }
               
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
                        this.totalShow=false;
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
                this.leftDisplayName=name;
                this.leftDisplayShow=true;
                this.getPitchDetailDataBySeqIdLeft(id)
                this.markSqId=id;
                // this.getPitchSeqMark();
                this.getPitchSeqMarkL(this.leftSqId);
                // setTimeout(()=>{
                //     this.drawSpotMark();
                // },1000)
                
               
            },
            //右侧显示
            rightDisplay(id,name){
                this.rightSqId=id;
                this.rightSqName=name;
                this.rightDisplayName=name;
                this.rightDisplayShow=true;
                this.getPitchDetailDataBySeqIdRight(id)
                this.markSqId=id;
                // this.getPitchSeqMark();          
                this.getPitchSeqMarkR(this.rightSqId);      
                // console.log(this.rightDisplayList,'右边数据')
            },
            editLeftMarkSpot(){
                this.markSqId=this.leftSqId;
                this.markSqName=this.leftSqName;
                this.editMarkShowLeft=true;
                this.getPitchSeqMarkL(this.leftSqId);
                // this.getPitchSeqMark();
            },
            editRightMarkSpot(){
                this.markSqId=this.rightSqId;
                this.markSqName=this.leftSqName;
                // this.editMarkShow=true;
                this.editMarkShowRight=true;
                this.getPitchSeqMarkR(this.rightSqId);
            },
            //插入
            addSqL(){
                this.getPitchSeqMarkLeftList.push({"depth":'',"id":null,"name":'',"seqId":''})
            },
             addSqR(){
                this.getPitchSeqMarkRightList.push({"depth":'',"id":null,"name":'',"seqId":''})
            },

            //获取斜度序列标记
            getPitchSeqMarkL(val){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getPitchSeqMark',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        seqId:val,
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getPitchSeqMarkList=response.data.rt;
                        this.getPitchSeqMarkLeftList=response.data.rt;
                        setTimeout(() => {
                            this.drawLeftSpotMark();
                        }, 1000);
                        // console.log(this.getPitchSeqMarkList,'this.getPitchSeqMarkList');
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },

            getPitchSeqMarkR(val){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'detectionInfo/getPitchSeqMark',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        seqId:val,
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getPitchSeqMarkList=response.data.rt;
                        this.getPitchSeqMarkRightList=response.data.rt;
                        setTimeout(() => {
                            this.drawRightSpotMark();
                        }, 1000);
                        // console.log(this.getPitchSeqMarkList,'this.getPitchSeqMarkList');
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            // getPitchSeqMark(){
            //     var vm=this;
            //     axios({
            //         method:'post',
            //         url:this.BDMSUrl+'detectionInfo/getPitchSeqMark',
            //         headers:{
            //             'token':vm.token
            //         },
            //         params:{
            //             seqId:this.markSqId,
            //         }
            //     }).then((response)=>{
            //         if(response.data.cd=='0'){
            //             this.getPitchSeqMarkList=response.data.rt;
            //             this.getPitchSeqMarkRightList=response.data.rt;
            //             setTimeout(() => {
            //                 this.drawRightSpotMark();
            //             }, 1000);
            //             // console.log(this.getPitchSeqMarkList,'this.getPitchSeqMarkList');
            //         }else{
            //             this.$message({
            //                 type:'error',
            //                 message:response.data.msg
            //             })
            //         }
            //     })
            // },
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
                            // this.getPitchSeqMarkR(this.markSqId);
                            this.getPitchSeqMarkL(this.markSqId);
                            this.editMarkShowLeft=false;
                            // this.drawSpotMark();
                        }else{
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
                }
            },
            addPitchSeqMark1(){
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
                            this.getPitchSeqMarkR(this.markSqId);
                            this.editMarkShowRight=false;
                            // this.getPitchSeqMarkL(this.markSqId);
                            // this.drawSpotMark();
                        }else{
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
                }
            },
            drawLeftSpotMark(){
                // console.log(this.$refs.lineLeftChartOne.clientWidth,'000');
                // console.log(document.getElementsByClassName('highcharts-background'))
                if(this.$refs.lineLeftChartOne&&this.leftDisplayShow){
                    console.log(this.$refs.lineLeftChartOne.$el.clientWidth,'offsetWidth');
                    console.log(this.$refs.lineLeftChartOne.$el.clientHeight,'offsetWidth');
                    var heightLeft=this.$refs.lineLeftChartOne.$el.clientHeight;
                    this.$refs.canvasLeftRef.style.width=this.$refs.lineLeftChartOne.$el.clientWidth+'px';
                    this.$refs.canvasLeftRef.style.height=this.$refs.lineLeftChartOne.$el.clientHeight+'px';
                    this.$refs.canvasLeftRef.width=this.$refs.lineLeftChartOne.$el.clientWidth;
                    this.$refs.canvasLeftRef.height=this.$refs.lineLeftChartOne.$el.clientHeight;
                    var canvasLeft=document.getElementById('canvasLeft');
                    var ctxLeft=canvasLeft.getContext('2d');
                    ctxLeft.font='normal 12px Arial';
                    ctxLeft.fillStyle='red';
                    var spotHeightLeft=(heightLeft-10)/(this.leftMaxHeight+1);
                    this.getPitchSeqMarkLeftList.forEach((item)=>{
                        console.log(spotHeightLeft*Number(item.depth),'0000');
                        ctxLeft.strokeRect(80,spotHeightLeft*Number(item.depth),15,15);
                        ctxLeft.strokeText(item.name,100,spotHeightLeft*Number(item.depth)+11,[100])
                    })
                }
                // if(this.$refs.lineRightChartOne&&this.rightDisplayShow){
                //     var heightRight=this.$refs.lineRightChartOne.$el.clientHeight;
                //     this.$refs.canvasRightRef.style.width=this.$refs.lineRightChartOne.$el.clientWidth+'px';
                //     this.$refs.canvasRightRef.style.height=this.$refs.lineRightChartOne.$el.clientHeight+'px';
                //     this.$refs.canvasRightRef.width=this.$refs.lineRightChartOne.$el.clientWidth;
                //     this.$refs.canvasRightRef.height=this.$refs.lineRightChartOne.$el.clientHeight;
                //     var canvasRight=document.getElementById('canvasRight');
                //     var ctxRight=canvasRight.getContext('2d');
                //     ctxRight.font='normal 12px Arial';
                //     ctxRight.fillStyle='red';
                //     var spotHeightRight=heightRight/this.rightMaxHeight;
                //     this.getPitchSeqMarkRightList.forEach((item)=>{
                //         // console.log(spotHeight*parseInt(item.depth),'0000');
                //         ctxRight.strokeRect(80,spotHeightRight*parseInt(item.depth)-18,15,15);
                //         ctxRight.strokeText(item.name,100,  spotHeightRight*parseInt(item.depth)-5, [100])
                //     })
                // }
                // ctx.stroke();
            },
            drawRightSpotMark(){
        
                if(this.$refs.lineRightChartOne&&this.rightDisplayShow){
                    var heightRight=this.$refs.lineRightChartOne.$el.clientHeight;
                    this.$refs.canvasRightRef.style.width=this.$refs.lineRightChartOne.$el.clientWidth+'px';
                    this.$refs.canvasRightRef.style.height=this.$refs.lineRightChartOne.$el.clientHeight+'px';
                    this.$refs.canvasRightRef.width=this.$refs.lineRightChartOne.$el.clientWidth;
                    this.$refs.canvasRightRef.height=this.$refs.lineRightChartOne.$el.clientHeight;
                    var canvasRight=document.getElementById('canvasRight');
                    var ctxRight=canvasRight.getContext('2d');
                    ctxRight.font='normal 12px Arial';
                    ctxRight.fillStyle='red';
                    var spotHeightRight=heightRight/this.rightMaxHeight;
                    this.getPitchSeqMarkRightList.forEach((item)=>{
                        // console.log(spotHeight*parseInt(item.depth),'0000');
                        ctxRight.strokeRect(80,spotHeightRight*parseInt(item.depth)-18,15,15);
                        ctxRight.strokeText(item.name,100,  spotHeightRight*parseInt(item.depth)-5, [100])
                    })
                }
                // ctx.stroke();
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
            editPitchSeqMarkSure(id,depth,name,seqId){
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
                        this.getPitchSeqMarkL(seqId);
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            editPitchSeqMarkSure1(id,depth,name,seqId){
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
                        this.getPitchSeqMarkR(seqId);
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            //删除斜度序列标记
            deletePitchSeqMark(val,seqId){
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
                            this.getPitchSeqMarkL(seqId);
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
            deletePitchSeqMark1(val,seqId){
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
                            this.getPitchSeqMarkR(seqId);
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
                this.editMarkShowLeft=false;
                this.editMarkShowRight=false;
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
                this.getHuahuanNode();
            
            },
            // //获得华桓的数据
            // getHuahuanNode(){

            // },
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
                 document.getElementById('fileInfo').value="";
                 this.imageName='未选择任何文件';
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
                        this.devicePointIndex='';
                        this.virtualPointIndex='';
                        this.imageName='未选择任何文件';
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
                        // if( this.manufacturerValue=="基康"){}
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
            //测试
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
                        font-size: 14px;
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
                        font-size: 14px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
                .containerHeadMiddle{
                    width: 400px;
                    display: inline-block;
                    label{
                        line-height: 32px;
                        font-size: 14px;
                        color: #333333;
                    }
                }
                .containerHeadRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
                        color:#999999;
                        font-size: 14px;
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
                        font-size: 14px;
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
                                    height: 30px;
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
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 14px;
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
                            font-size:14px;
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
                        position: relative;
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
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 14px;
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
                            font-size:14px;
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
                            position: relative;
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
                                    height: 30px;
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

