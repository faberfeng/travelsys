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
            <div id="inspectionBody" v-if="!pitchDetailShow&&!walkThroughShow&&!commonDetailShow">
                <div class="textBtnLeft">
                    <label class="recordTxt">导出报告</label>
                    <label class="exportTxt" @click="walkThroughBtn()">巡视记录</label>
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
                                <!-- <p>{{workingCondition}}</p> -->
                                <p class="alertContentTxt">{{workingCondition}}</p>
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
                                <select v-model="drawItemId" @change="changeType()"  class="inspectSel">
                                    <option v-for="(item,index) in monitorMainItemList" :key="index" :value="item.id" v-text="item.name"></option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </span>
                            <span :class="[{'clickStyle':isClick},'bottomMap']" @click="getBaseMapListBtn()">底图</span>
                            <span :class="[{'clickStyle':isClick1},'singleSpot']" @click="drawingOneSpot">单点</span>
                            <span :class="[{'clickStyle':isClick2},'singleSpot']" @click="drawingSpots">连续</span>
                            <span :class="[{'clickStyle':isClick3},'inputText']" @click="drawingText">文字</span>
                        </div>
                    </div>
                    <div class="planeFigureBody">
                        <div class="operateTool" v-show="editSpotShow">
                            <div class="operateToolLeft">
                                <span class="move" @click="enableMove"><i class="moveIcon"><label class="moveTxt" >移动</label></i></span>
                                <span class="fault"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                                <span class="deleteDraw" @click="deleteDraw"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                            </div>
                            <div class="operateToolRight">
                                <label class="saveDrawTxt" @click="saveDraw()">保存</label>
                            </div>
                        </div>
                        <div class="planeFigureGround" style="padding: 0px; overflow: auto;">
                            <!-- <img v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='jpg'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='png'" style="object-fit: contain;" :src="QJFileManageSystemURL+curBaseMapUrl">
                            <pdf v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='pdf'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+curBaseMapUrl"></pdf> -->
                            <picView ref="pic" @load_points="getAllMonitorPoint" @finish="drawFinish" @status_changed="picView_status_changed" :para="{type:curBaseMapUrl.substr(curBaseMapUrl.length-3),source:QJFileManageSystemURL+curBaseMapUrl}"></picView>
                        </div>
                        <div class="leftTopMonitorContent">
                            <!-- <el-checkbox v-model="spotNum0" style="display:block;width:120px;text-align:left">周边管线水平位移</el-checkbox> -->
                            <ul>
                                <li v-for="(item,index) in monitorMainItemList" :key="index">
                                    <el-checkbox v-model="item.spotNum" @change="checkboxChange()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">
                                        {{item.name}}
                                    </el-checkbox>
                                </li>
                            </ul>
                            
                        </div>
                        <div class="rightBottomCheck">
                            <el-checkbox v-model="picMark" style="display:block;width:120px;text-align:left">显示照片被标记</el-checkbox>
                            <el-checkbox v-model="displaySpotNum" @change="displaySpot()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">显示点位读数</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="inspectTable">
                    <div class="inspectTableHead">
                        <div class="inspectTableHeadLeft">
                            <label class="inspectTableHeadLeftTxt">监测单位：{{monitorCompany}}
                            </label>
                            <label class="inspectTableHeadLeftTxt"></label>
                        </div>
                        <div class="inspectTableHeadRight">
                            <div class="addData" @click="batchExport()">数据导入</div>
                            <div class="addInspectContent" @click="addMonitorItemBtn()">新增监测内容</div>
                        </div>
                    </div>
                    <div class="inspectTableBody">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                            <thead>
                            <tr>
                                <th rowspan="2">序号</th>
                                <th rowspan="2">监测类型</th>
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
                                <tr v-for="(item,index) in monitorMainTableList" :key="index">
                                    <td v-text="index+1"></td>
                                    <td>{{item.type|monitorTypeChange()}}</td>
                                    <td v-text="item.name"></td>
                                    <td v-text="item.logogram"></td>
                                    <td v-text="item.count"></td>
                                    <td >{{item.latestTime|timeChange()}}</td>
                                    <td >{{item.recentPointName|addSprit()}}</td>
                                    <td>{{item.recentVariation|addSprit1()}}</td>
                                    <td>{{item.recentAlert|shifouChange()}}</td>
                                    <td>{{item.totalPointName|addSprit()}}</td>
                                    <td>{{item.totalVariation|addSprit2()}}</td>
                                    <td>{{item.totalAlert|shifouChange()}}</td>
                                    <td>
                                        <button title="编辑" @click="editMonitorNameBtn(item.id)" class="editBtn actionBtn"></button>
                                        <button title="上移" class="upmoveBtn actionBtn" @click="moveUp(item.id)"></button>
                                        <button title="下移" class="downmoveBtn actionBtn" @click="moveDown(item.id)"></button>
                                        <button title="详情" class="detailBtn actionBtn" @click="detail(item.keyword,item.id,item.type,item.name)"></button>
                                        <button title="导入" class="exportBtn actionBtn" @click="importData(item.keyword,item.name,item.type,item.id)"></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div class="tableBodyPagination">
                        <div class="tableBodyPaginationLeft">
                            <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">最新数据：</label><label style="color:#333;font-size:14px;line-height:62px">{{nowDate}}</label></span>
                            <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:50px;">报警岗位：</label>
                                <el-select v-model="positionValue"><el-option v-for="(item,index) in positionList" :label="item.posName" :key="index" :value="item.id"></el-option></el-select>
                            </span>
                            <span class="leftTxtOne"><label style="color:#fc3439;font-size:14px;line-height:62px;cursor:pointer;" @click="previewAlert()">发短信报警</label></span>
                        </div>
                        <div class="tableBodyPaginationRight">
                            <el-pagination class="elPagination"
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage1"
                                :page-sizes="[10, 20, 30, 40,50]"
                                :page-size="10"
                                layout="sizes,prev, pager, next"
                                :total="50">
                            </el-pagination>
                        </div>
                    </div>

                </div>
            </div>
            <!-- 以下是斜度详情页 -->
            <commonPitch-detail v-if="pitchDetailShow" v-on:back="backToH" :surveyName="surveyName" :itemMonitorId="detailMonitorId"></commonPitch-detail>
            <!-- 以下是巡视报告 -->
            <walkThrough v-if="walkThroughShow" v-on:back="backToH" :userSelectId="selectUgId"></walkThrough>
            <!-- 以下是除斜度的其他详情页 -->
            <commonDetail v-if="commonDetailShow" v-on:back="backToH" v-on:importDataShow="importDataShow" :projctName="surveyName" :itemMonitorKeyWord="itemSubmitKeyWord" :userGroupId="selectUgId" :itemMonitorId="detailMonitorId" :itemMonitorType="itemType"></commonDetail>
        </div>
        <div id="edit">
            <el-dialog title="底图管理" :visible="baseMapShow" @close="baseMapCancle()" width="740px">
                <div class="baseMapBody">
                    <ul class="clearfix" style="margin:0px 20px 0px 20px;">
                        <li class="baseMapBodyLi" @mouseenter="enter(item.id)" @mouseleave="leave()" @click="selectCurBaseMap(item.id)" style="padding: 0px; overflow: hidden;" v-for="(item,index) in baseMapList" :key="index">
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
            <el-dialog title="新增监测内容" :visible="addInspectContentShow" @close="addInspectContentCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">名称:</label><input class="inp" style="height:32px !important" v-model="monitorName" placeholder="请输入" /></div>
                    <div class="editBodytwo"><label class="editInpText">类型:</label><select class="editSelect" v-model="monitorType" ><option v-for="(item,index) in monitorTypeList" :value="item.value" :key="index" v-text="item.label"></option></select><i class="icon-sanjiao"></i></div>
                    <div class="editBodytwo"><label class="editInpText">简写:</label><input class="inpSmall" style="height:32px !important" v-model="monitorLogogram" placeholder="两个字母" /></div>
                    <div class="editBodytwo" v-show="monitorType==5?false:true"><label class="editInpText">关键词:</label><input class="inp" style="height:32px !important" v-model="monitorKeyword" placeholder="与导入Excel表名匹配" /></div>
                    <div  class="editBodytwo editBodytwo1"  v-show="monitorType==5?false:true&&false"><label class="editInpText editInpText1">底图:</label><div class="addbaseMap" @mouseenter="changeActive()" @mouseleave="removeActive()">
                        <!-- <img v-show="monitorBaseMapId" style="object-fit: contain;" class="addbaseMapImg" :src="QJFileManageSystemURL+monitorBaseMapUrl" > -->
                        <img v-show="monitorBaseMapId&monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='jpg'||monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='png'" class="addbaseMapImg" style="object-fit: contain;" :src="QJFileManageSystemURL+monitorBaseMapUrl">
                        <pdf v-show="monitorBaseMapId&monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='pdf'||monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='PDF'" class="addbaseMapImg" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+monitorBaseMapUrl"></pdf>
                        <div class="addbaseMapHover" v-show="hoverShow"><label class="hoverTxt" @click="clickChange()">点击更换</label></div></div></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMonitorItem()" >确定</button>
                    <button class="editBtnC" @click="addInspectContentCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="监测内容更名" :visible="editInspectContentShow" @close="editInspectContentCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">名称:</label><input class="inp" style="height:32px !important" v-model="monitorName1" placeholder="请输入" /></div>
                    <div class="editBodytwo"><label class="editInpText">简写:</label><input class="inpSmall" style="height:32px !important" v-model="monitorLogogram1" placeholder="两个字母" /></div>
                    <div class="editBodytwo"><label class="editInpText">关键词:</label><input class="inp" style="height:32px !important" v-model="monitorKeyword1" placeholder="与导入Excel表名匹配" /></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="renameMonitor()">确定</button>
                    <button class="editBtnC" @click="editInspectContentCancle()">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导入采集数据" :visible="importGatherDataShow" @close="importGatherDataCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">本地Excel文档:</label>
                        <span class="updataImageSpan">
                            <label for="fileInfo">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importExcel" id="fileInfo" @change="addExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelFileListName}}<label v-show="!excelFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">使用Excel表名:</label><select v-model="sheetIndex" class="sheetName"><option v-for="(item,index) in excelSheetInfo"  :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao1"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{monitorImportName}}</label></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">点位编号列名:</label><select v-model="spotNumCol" placeholder="请选择"  class="spotNumName"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao2"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label><select class="gatherTimeName" v-model="timeCol" placeholder="请选择"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;"><el-checkbox>使用统一时间:</el-checkbox><el-date-picker style="width:374px !important;margin-left:141px;margin-top:-40px;" v-model="unifiedTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker></label></div>
                    <div class="editBodytwo" v-show="monitorImportType==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label><select class="gatherTimeName" v-model="distanceCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label><select class="gatherTimeName" v-model="altitudeCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label><select class="gatherTimeName" v-model="pipeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao4"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label><select class="gatherTimeName" v-model="gaugeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao5"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="saveImportColumnValue" @change="saveImportColumnSetting()">保存以上列名匹配为默认</el-checkbox></label></div>
                    <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1" style="width:18% !important;">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea" v-model="inputWorkingCondition"></textarea></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="overwrite">覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" v-show="monitorImportType==4" @click="formulaSetting()" >公式设定</button>
                        <button class="editBtnC" style="margin-right:88px;" @click="verifyExcelDataBtn()">测试</button>
                        <button class="editBtnS" @click="importExcelDataMakeSure()" >确定</button>
                        <button class="editBtnC" @click="importGatherDataCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="监测结果批量导入" :visible="batchImportDataShow" @close="batchImportCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">本地Excel文档:</label>
                        <span class="updataImageSpan">
                            <label for="fileInfo">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importExcel" id="fileInfo" @change="addExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelFileListName}}<label v-show="!excelFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo"><label class="editInpText">匹配结果:</label><label>文档内表总数</label><label></label><label>匹配到的表数量</label><label></label></div>
                    <div class="editBodytwo"><label class="editInpText">需要配置的表名:</label><select class="sheetName"><option></option></select><i class="icon-sanjiao1"></i></div>
                    <div class="editBodytwo"><label class="editInpText">对应监测内容:</label></div>
                    <div class="editBodytwo"><label class="editInpText">点位编号列名:</label><select class="spotNumName"><option></option></select><i class="icon-sanjiao2"></i></div>
                    <div class="editBodytwo"><label class="editInpText">采集时间列名:</label><select class="gatherTimeName"><option></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo"><label class="editInpText"><el-checkbox>使用统一时间:</el-checkbox></label></div>
                    <div class="editBodytwo"><label class="editInpText">位移取值列名:</label><select class="gatherTimeName"><option></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo"><label class="editInpText">高层取值列名:</label><select class="gatherTimeName"><option></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo"><label class="editInpText"><el-checkbox>保存以上列名匹配为默认</el-checkbox></label></div>
                    <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea"></textarea></div>
                    <div class="editBodytwo"><label class="editInpText"><el-checkbox>覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" >确定</button>
                        <button class="editBtnC" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="受力计算公式设定" :visible="formulaSettingShow" @close="formulaSettingCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <el-radio v-model="vibrateRadio" label="1" style="margin-left:50px;">振弦式应变计计算公式：</el-radio>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">钢支撑/钢立柱的截面积As:</label>
                        <input placeholder="请输入" class="editInput"/>
                        <label>平方毫米</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">钢支撑/钢立柱的弹性模量Es:</label>
                        <input placeholder="请输入" class="editInput"/>
                        <label>千帕</label>
                    </div>
                    <div class="editBodytwo">
                       <el-radio v-model="vibrateRadio" label="1" style="margin-left:50px;">混凝土支撑内振弦式钢筋计计算公式：</el-radio>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">钢筋直径(mm)：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                     <div class="editBodytwo">
                        <label class="editTxt">根数：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">截面积As：</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">钢筋应力计的截面积As'：</label>
                        <input placeholder="请输入" class="editInput"/>
                        <label>平方毫米</label>
                    </div>
                     <div class="editBodytwo">
                        <label class="editTxt">钢筋的牌号：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">对应弹性模量Es：</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">混凝土支撑宽度：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">混凝土支撑高度： ：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">截面积Ac：</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">混凝土的等级：</label>
                        <input placeholder="请输入" class="editInput"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">对应弹性模量Ec:</label>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" >确定</button>
                    <button class="editBtnC" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="发送报警短信" :visible="sendAlertMessageShow" @close="sendAlertMessageCancle()">
                <div class="editBody">
                    <p>{{alertMessage}}</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="sendAlertMessage()">发送</button>
                    <button class="editBtnC" @click="sendAlertMessageCancle()" >取消</button>
                </div>
            </el-dialog>
        </div>
        
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import pdf from 'vue-pdf'
import commonPitchDetail from './commonPitchDetail.vue' //斜度详情页组件
import walkThrough from './walkThrough.vue' //巡视报告
import commonDetail from './commonDetail.vue'//除斜度的详情页
import picView from './picView.vue'

var echarts = require('echarts');
export default {
    components: {
        pdf,commonPitchDetail,commonDetail,walkThrough,picView
    },
    name:'safetyInspection',
    data(){
        return{
            selectUgId:'',
            monitorCompany:'',//监测单位
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
            inputWorkingCondition:'',
            weatherJson:'',
            weatherIcon:'',
            weatherAir:'',
            weatherTime:'',
            editSpotShow:false,
            baseMapShow:false,
            baseMapMonitor:false,
            addInspectContentShow:false,//增加监测内容弹框
            editInspectContentShow:false,//编辑监测内容弹框
            importGatherDataShow:false,//导入采集数据
            matchKeyWord:'',//匹配关键字
            monitorImportName:'',//导入监测名称
            monitorImportType:'',//导入监测类型
            monitorImportId:'',//监测Id
            getImportColumnList:'',//获得导入列设定数据
            spotNumCol:'',//点位列名
            timeCol:'',//采集时间列名
            unifiedTime:null,//使用统一时间
            distanceCol:'',//位移取值列名
            altitudeCol:'',//高程取值列名
            pipeHeightCol:'',//管口标高列名
            gaugeHeightCol:'',//水位深度列名
            saveImportColumnValue:false,//保存导入列数据
            overwrite:false,//是否覆盖
            batchImportDataShow:false,//批量数据导入
            formulaSettingShow:false,//公式设定
            sendAlertMessageShow:false,//是否发送报警信息弹窗
            vibrateRadio:'1',//振弦式应变计计算公式
            fileList:'',
            fileListName:'',
            excelSheetInfo:'',//获取导入EXCEL文件的sheet信息
            excelFileList:'',
            excelFileListName:'',
            sheetIndex:'',//当前表头
            sheetIndexList:'',//列表
            pageNo:1,
            baseMapList:'',//底图列表数据
            isClick:false,//是否点击
            isClick1:false,
            isClick2:false,
            isClick3:false,
            hoverShow:false,
            monitorName:'',//监测名称
            monitorType:1,//监测类型
            monitorLogogram:'',
            monitorKeyword:'',
            monitorId:'',
            monitorName1:'',//监测名称
            monitorLogogram1:'',
            monitorKeyword1:'',
            monitorBaseMapId:'',//选择底图ID
            monitorTypeList:[
                {
                    value:1,
                    label:'水平位移'
                },
                {
                    value:2,
                    label:'竖向位移'
                },
                {
                    value:3,
                    label:'水位'
                },
                {
                    value:4,
                    label:'受力'
                },
                {
                    value:5,
                    label:'斜度'
                }
            ],
            monitorMainTableList:'',//监测内容总表
            monitorMainItemList:'',//绘制底图内容
            hoverId:'',//移动底图上的ID
            curBaseMapUrl:'',//目前底图首页
            monitorBaseMapUrl:'',//监测底图设置
            picMark:false,
            displaySpotNum:false,
            spotNum:false,
            spotNum0:false,
            spotNum1:false,
            spotNum2:false,
            spotNum3:false,
            spotNum4:false,
            spotNum5:false,
            pitchDetailShow:false,//斜度详情页
            commonDetailShow:false,//公共详情页
            walkThroughShow:false,//巡视报告
            surveyName:'',//传递给子组件的name
            detailMonitorId:'',//传递给子组件的id
            itemType:'',//传递给子组件的监测类型
            itemSubmitKeyWord:'',//传递给子组件的监测关键字
            plotInfo:'123',//增加测点绘图信息（需要绘图传递，传什么回什么）
            pointId:'',//监测点ID
            pointIds:'',//选中监测点集合
            drawItemId:'',//图纸项目ID
            drawItemType:'',//图纸类型改变
            monitorPointInfo:'',//所有图纸监测点信息
            monitorWord:'',//监测文字 
            currentPage1:1,//改变页面数 
            positionList:'',//岗位列表    
            alertMessage:'',//预览报警短信数据
            positionValue:'',//岗位值
            nowDate:'',//当前时间

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
        this.getPositionList();
        this.curTime()
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
    },
    watch:{
        selectUgId:function(val){
            var vm=this;
            vm.getDetectionSummary();
            vm.getMonitorMainTable();
            vm.ugCompany();
            vm.getBaseMapList();
            vm.getMonitorItem();
        },
        positionValue:function(val){
            var vm=this;
            vm.getPositionList();
        }
    },
    methods:{
        //判断是否为图片或者pdf
        // judgeImg(val){
        //     val.substr(val.length-3)=='jpg'||val.substr(val.length-3)=='png'
        // },
        // judgePdf(){
        //     val.substr(val.length-3)=='pdf'||val.substr(val.length-3)=='PDF'
        // },
        importDataShow(val){
            console.log(val);
            this.importGatherDataShow=val;
        },
        //当前时间
        curTime(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
             this.nowDate = year + "-" + month + "-" + day;
        },
        handleSizeChange(val){
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val){
            console.log(`当前页: ${val}`);
        },
        //
        sendAlertMessage(){
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/sendAlertMessage',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    userGroupId:this.selectUgId,
                    position:this.positionValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.alertMessage=response.data.rt;
                    this.sendAlertMessageShow=false;
                    this.$message({
                        type:"success",
                        message:response.data.msg
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //预览报警短信
        previewAlert(){
             var vm=this;
             this.sendAlertMessageShow=true;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/previewAlertMessage',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    userGroupId:this.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.alertMessage=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取岗位列表
        getPositionList(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPositionList',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.positionList=response.data.rt;
                    this.positionValue=this.positionList[0].id;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //类型改变
        changeType(){
            this.monitorMainItemList.forEach((item)=>{
                if(item.id==this.drawItemId){
                    this.drawItemType=item.type;
                }
               
            })
             console.log(this.drawItemType,'type');
        },
        picView_status_changed(status){
            console.log(status);
        },
        drawFinish(){
            // console.log("finish");
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick=false;
        },
        walkThroughBtn(){
            var vm=this;
            vm.walkThroughShow=true;


        },
        backToH(){
            var vm=this;
            vm.pitchDetailShow=false;
            vm.walkThroughShow=false;
            vm.commonDetailShow=false;
            vm.getDetectionSummary();
            vm.getMonitorMainTable();
            vm.ugCompany();
            vm.getMonitorItem();
        },
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
        //选中当前名称
        ugCompany(){
            this.ugList.forEach((item)=>{
                if(this.selectUgId==item.ugId){
                    this.monitorCompany=item.ugName
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
                        var recentData=[{name:'报警',value:23},{name:'总数',value:100}];
                        var totalData=[{name:'报警',value:23},{name:'总数',value:100}];
                        var legendData='';
                        var legendAllData='';
                        var conditionData=[55,50];//监测工况综述
                        // recentData.push(
                        //     {
                        //     name:'报警',
                        //     value:this.alertPointAmount.recentAlertAmount
                        //     },{
                        //         name:'总数',
                        //         value:this.alertPointAmount.allAmount
                        //     }
                        // );
                        // legendData='报警'+this.alertPointAmount.recentAlertAmount;
                        // legendAllData='总数'+this.alertPointAmount.allAmount;
                        // totalData.push(
                        //     {
                        //     name:'报警',
                        //     value:this.alertPointAmount.totalAlertAmount
                        //     },
                        //     {
                        //         name:'总数',
                        //         value:this.alertPointAmount.allAmount
                                
                        //     }
                        // );
                        // conditionData.push(
                        //     this.condition.acAmount,this.condition.days
                        // )
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
            }else if(val=="晴"||val=="晴转多云"||val=="多云转晴"){
                return  require('./images/sunny.png')
            }else if(val=="小雨"||val=="小雨转阴"){
                return  require('./images/lightrain.png')
            }else if(val=="大雨"){
                return  require('./images/heavyrain.png')
            }else if(val=="多云转小雨"||val=="小雨转多云"){
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
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;

            var list = this.$refs.pic.saveList();
            // console.log(list);

            axios({
                    method:'POST',
                    url:vm.BDMSUrl+'detectionInfo/editAllMonitorPoint',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        baseMapId:vm.monitorBaseMapId
                    },
                    data:list
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getAllMonitorPoint();
                    }else{
                        console.log(response);
                    }
                })


        },
        checkboxChange(){
            // console.log(this.monitorMainItemList,'checkList');

            for(let i = 0; i < this.monitorMainItemList.length;i++){
                this.$refs.pic.enableType(this.monitorMainItemList[i].type,this.monitorMainItemList[i].id,this.monitorMainItemList[i].spotNum);
            }
        },
        displaySpot(){
            // console.log(this.displaySpotNum);
            this.$refs.pic.enableLabel(this.displaySpotNum);
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
            var returnUrl = vm.BDMSUrl+'detectionInfo/addBaseMap?userGroupId='+vm.selectUgId+'&name='+vm.fileListName+'&pageNo='+vm.pageNo;
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
                            this.getBaseMapList();
                            // alert('上传成功');
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
        //删除底图
        deleteBaseMap(val){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/deleteBaseMap',
                headers:{
                    'token':vm.token
                },
                params:{
                    id:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    vm.getBaseMapList()
                }
            })
        },
        //点击获取底图列表
        getBaseMapListBtn(){
            this.baseMapShow=true;
            this.isClick=true;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.getBaseMapList();
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
                    this.baseMapList=response.data.rt;
                    // console.log(this.baseMapList);
                    //判断是否使用当前图纸
                    if(!this.curBaseMapUrl){
                        this.baseMapList.forEach((item)=>{
                            if(item.isUsed==1){
                                this.curBaseMapUrl=item.relativeUri;
                                this.monitorBaseMapId=item.id;
                                this.getAllMonitorPoint();
                            }
                        })
                    }
                    if(this.monitorBaseMapId){
                        this.baseMapList.forEach((item)=>{
                            if(item.id==this.monitorBaseMapId){
                                this.curBaseMapUrl=item.relativeUri;
                            }
                        })
                    }
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
        //设置底图使用
        setBaseMapUsed(val){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/setBaseMapUsed',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                    id:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getBaseMapList()
                }else{
                    vm.$message({
                        type:"error",
                        msg:response.data.msg
                    })
                }
            })
        },
        //点击新增监测内容
        addMonitorItemBtn(){
             var vm=this;
            vm.addInspectContentShow=true;
        },
        //数据导入
        batchExport(){
            this.batchImportDataShow=true;
        },
        addInspectContentCancle(){
            var vm=this;
            vm.addInspectContentShow=false;
            this.monitorName='';
            this.monitorType=1;
            this.monitorLogogram='';
            this.monitorKeyword='';
            this.monitorBaseMapId='';
        },
        //新增监测内容
        addMonitorItem(){
            var vm=this;
            // if(this.monitorName==''){
            //     vm.$message({
            //         type:'info',
            //         message:'请输入监测名称'
            //     })
            // }else if(this.monitorLogogram==''){
            //     vm.$message({
            //         type:'info',
            //         message:'请输入不重名的简写'
            //     })
            // }else if(this.monitorType!=5){
            //     if(this.monitorKeyword==''){
            //      vm.$message({
            //         type:'info',
            //         message:'请输入不重名的关键字'
            //     })
            //     }else if(vm.monitorBaseMapId==''){
            //         vm.$message({
            //             type:'info',
            //             message:'请选择底图'
            //         })
            //     }
            // } else{
                axios({
                    method:'get',
                    url:vm.BDMSUrl+'detectionInfo/addMonitorItem',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        name:vm.monitorName,
                        type:vm.monitorType,
                        logogram:vm.monitorLogogram,
                        userGroupId:vm.selectUgId,
                        keyword:vm.monitorKeyword,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getMonitorMainTable();
                        this.addInspectContentShow=false;
                        this.monitorName='';
                        this.monitorType=1;
                        this.monitorLogogram='';
                        this.monitorKeyword='';
                        this.monitorBaseMapId='';
                    }else{
                        vm.$message({
                            type:"error",
                            msg:response.data.msg
                        })
                    }
                })
            // }
        },
        //取消编辑监测内容
        editInspectContentCancle(){
            var vm=this;
            this.editInspectContentShow=false;
            vm.monitorName='';
            vm.monitorLogogram='';
            vm.monitorKeyword='';
            vm.monitorId='';
        },
        //保存导入列设定
        saveImportColumnSetting(){
            var vm=this;
            var colData=[];
            colData.push({'spotNumCol':vm.spotNumCol,'timeCol':vm.timeCol,'distanceCol':vm.distanceCol,'altitudeCol':vm.altitudeCol,'pipeHeightCol':vm.pipeHeightCol,'gaugeHeightCol':vm.gaugeHeightCol,'saveImportColumnValue':vm.saveImportColumnValue})
            console.log(colData);
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/saveImportColumnSetting',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:vm.monitorImportId,
                    sheetIndex:vm.sheetIndex,
                    data:JSON.stringify(colData)
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获得导入列设定
        getImportColumnSetting(val){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getImportColumnSetting',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:vm.monitorImportId,
                    sheetIndex:val
                }
            }).then((response)=>{
                if(response.data.rt){
                    vm.getImportColumnList=response.data.rt;
                    console.log(vm.getImportColumnList);
                    var importColumnData=null;
                    importColumnData=JSON.parse(vm.getImportColumnList.data)
                    console.log(importColumnData);
                    importColumnData.forEach((item)=>{
                        vm.spotNumCol=item.spotNumCol;
                        vm.timeCol=item.timeCol;
                        vm.distanceCol=item.distanceCol;
                        vm.altitudeCol=item.altitudeCol;
                        vm.pipeHeightCol=item.pipeHeightCol;
                        vm.gaugeHeightCol=item.gaugeHeightCol;
                        vm.saveImportColumnValue=item.saveImportColumnValue;
                    })
                }else if(respose.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //确认导入excel数据(需要根据监测类型来判断)
        importExcelDataMakeSure(){
            if(this.monitorImportType==1){
                this.importExcel_1()
            }else if(this.monitorImportType==2){
                this.importExcel_2()
            }else if(this.monitorImportType==3){
                this.importExcel_3()
            }
        },
        //导入水平位移excel
        importExcel_1(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_1',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    shiftDistanceIndex:vm.distanceCol,//位移下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.distanceCol='';//位移下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false;//是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //导入EXCEL（竖向位移）
        importExcel_2(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_2',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    elevationIndex:vm.altitudeCol,//高程下班
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.altitudeCol='';//高程下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //导入EXCEL(水位)
        importExcel_3(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_3',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    // elevationIndex:vm.altitudeCol,//高程下班
                    pipeHeightIndex:vm.pipeHeightCol,//管口高度
                    gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.pipeHeightCol='';//管口高度
                    vm.gaugeHeightCol='';//水位下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //测试导入excel数据(需要根据监测类型来判断)
        verifyExcelDataBtn(){
             if(this.monitorImportType==1){
                this.verifyExcel_1()
            }else if(this.monitorImportType==2){
                this.verifyExcel_2()
            }else if(this.monitorImportType==3){
                 this.verifyExcel_3()
            }
        },
        //测试导入EXCEL（水平位移）
        verifyExcel_1(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/verifyExcel_1',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    shiftDistanceIndex:vm.distanceCol,//位移下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.distanceCol='';//位移下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })

        },
        //验证导入EXCEL（竖向位移）
        verifyExcel_2(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/verifyExcel_2',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    elevationIndex:vm.altitudeCol,//高程下班
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.altitudeCol='';//高程下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //验证导入EXCEL（水位）
        verifyExcel_3(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/verifyExcel_3',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    // elevationIndex:vm.altitudeCol,//高程下班
                    pipeHeightIndex:vm.pipeHeightCol,//管口高度
                    gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId //
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.pipeHeightCol='';//管口高度
                    vm.gaugeHeightCol='';//水位下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //点击公式设定
        formulaSetting(){
            this.formulaSettingShow=true;
        },
        //取消公式设定
        formulaSettingCancle(){
            this.formulaSettingShow=false;
        },
        sendAlertMessageCancle(){
            this.sendAlertMessageShow=false;
        },
        //取消导入采集数据
        importGatherDataCancle(){
            var vm=this;
            this.importGatherDataShow=false;
            this.excelFileListName='';
            this.monitorImportName='';
            this.excelFileList='';
            vm.sheetIndex='';
            vm.timeCol=''; //采集时间下标
            vm.distanceCol='';//位移下标
            vm.monitorImportId='';//监测ID
            vm.spotNumCol='';//监测点位下标
            vm.unifiedTime='';//标准时间，不选择可不传
            vm.overwrite=false; //是否覆盖
            vm.inputWorkingCondition='';//现场工况
            vm.pipeHeightCol='';//管口高度
            vm.gaugeHeightCol='';//水位下标
        },
        //取消批量数据导入
        batchImportCancle(){
            this.batchImportDataShow=false;
        },
        //导入excel表格-获取导入EXCEL文件的sheet信息
        addExcel(){
            var vm=this;
            const list = vm.$refs.importExcel.files;
            vm.excelFileList=list[0];
            vm.excelFileListName=list[0].name;
            // console.log(vm.excelFileList);
            // console.log(excelFileListName);
            // var returnUrl = vm.BDMSUrl+'detectionInfo/getExcelSheetInfo';
            // returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            // formData.append('token',vm.token);
            // formData.append('projId',vm.projId);
            // formData.append('type',1);
            formData.append('data',vm.excelFileList);
            // formData.append('userId',vm.userId);
            // formData.append('modelCode','006');
            // formData.append('returnUrl',returnUrl);
            axios({
                    method:'POST',
                    url:vm.BDMSUrl+ 'detectionInfo/getExcelSheetInfo',
                    headers:{
                        'token':vm.token
                    },
                    data:formData
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            this.excelSheetInfo=response.data.rt;
                            console.log(this.excelSheetInfo);
                            this.excelSheetInfo.forEach((item)=>{
                                if(item.name==this.matchKeyWord){
                                    // console.log(item.index)
                                    this.getExcelColumnBySheet(item.index);
                                    this.getImportColumnSetting(item.index);
                                    this.sheetIndex=item.index;
                                    console.log(this.sheetIndex);
                                }
                            })
                            
                            vm.excelFileList='';
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                            vm.excelFileList='';
                        }
                    })
        },
        //根据sheet获取表头
        getExcelColumnBySheet(val){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getExcelColumnBySheet',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.sheetIndexList=response.data.rt;
                    console.log(this.sheetIndexList);
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.message
                    })
                }
            })
        },
        //重命名监测内容
        renameMonitor(){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/rename',
                headers:{
                    'token':vm.token
                },
                params:{
                    id:this.monitorId,
                    name:this.monitorName1,
                    logogram:this.monitorLogogram1,
                    keyword:this.monitorKeyword1
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editInspectContentShow=false;
                    this.getMonitorMainTable()
                }
            })
        },
        editMonitorNameBtn(val){
            var vm=this;
            console.log(val);
            this.editInspectContentShow=true;
            console.log(this.monitorMainTableList);
            this.monitorMainTableList.forEach((item)=>{
                if(item.id==val){
                    this.monitorName1=item.name;
                    this.monitorLogogram1=item.logogram;
                    this.monitorKeyword1=item.keyword;
                    this.monitorId=item.id;
                    console.log(this.monitorName1);
                }
            })
        },
        //监测内容下移
        moveDown(val){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/moveDown',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                    id:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.editInspectContentShow=false;
                    this.getMonitorMainTable();
                    vm.$message({
                        type:'info',
                        message:'下移成功'
                    })
                }
            })
        },
        //监测内容上移
        moveUp(val){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/moveUp',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                    id:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.editInspectContentShow=false;
                    this.getMonitorMainTable();
                    vm.$message({
                        type:'info',
                        message:'上移成功'
                    })
                }
            })
        },
        //监测内容详情页
        detail(keyword,id,type,name){
            this.surveyName=name;
            this.detailMonitorId=id;
            this.itemType=type;
            this.itemSubmitKeyWord=keyword;
            if(type==5){
                this.pitchDetailShow=true;
            }else{
                this.commonDetailShow=true;
            }
        },
        //单项监测内容导入
        importData(val,name,type,id){
            var vm=this;
            vm.importGatherDataShow=true;
            vm.matchKeyWord=val;
            vm.monitorImportName=name;
            vm.monitorImportType=type;
            vm.monitorImportId=id;
        },
        //获取监测内容主表
        getMonitorMainTable(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'/detectionInfo/getMonitorMainTable',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorMainTableList=response.data.rt;
                    this.monitorMainTableList.forEach((item)=>{
                        
                    })
                    // this.drawItemId=this.monitorMainTableList[0].id;
                }
            })

        },
        enter(val){
            this.hoverId=val;
        },
        leave(){
            this.hoverId='';
        },
        changeActive(){
            this.hoverShow=true;
        },
        removeActive(){
            this.hoverShow=false;
        },
        //点击更换
        clickChange(){
            this.baseMapShow=true;
            this.baseMapMonitor=true;
            this.getBaseMapList();
        },
        //选择当前底图
        selectCurBaseMap(val){
            this.baseMapList.forEach((item)=>{
                if(item.id==val&&!this.baseMapMonitor){
                    this.curBaseMapUrl=item.relativeUri;
                    this.monitorBaseMapId=item.id;
                    this.setBaseMapUsed(item.id);
                    this.getAllMonitorPoint();

                }else if(item.id==val&&this.baseMapMonitor){
                    this.monitorBaseMapUrl=item.relativeUri;
                    this.monitorBaseMapId=item.id;
                    this.setBaseMapUsed(item.id);
                    this.getAllMonitorPoint();
                }
            })
            
            this.baseMapShow=false;
        },

        //添加监测点
        addMonitorPoint(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/addMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:vm.drawItemId,
                    baseMapId:vm.monitorBaseMapId
                },
                data:{
                    plotInfo:vm.plotInfo
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //删除监测点
        deleteMonitorPoint(){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/deleteMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    pointId:vm.pointId,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //单点触发绘图(废)
        drawingSpot(){
            if(this.drawItemId){
                this.addMonitorPoint()
            }
        },
        //单点触发绘图
        drawingOneSpot(){
            this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemId,1);
            this.monitorMainItemList.forEach((item)=>{
                if(item.id==this.drawItemId){
                    item.spotNum=true;
                }
            })
            this.isClick1=true;
            this.isClick2=false;
            this.isClick3=false;
        },
        //多点触发绘图
        drawingSpots(){
            this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemId,2);
            this.isClick2=true;
            this.isClick1=false;
            this.isClick3=false;
        },
        //添加文本
        drawingText(){
            this.$refs.pic.setDrawStatus("text",10000,10000,2);
            this.isClick2=false;
            this.isClick1=false;
            this.isClick3=true;
        },
        //开启移动
        enableMove(){
            this.$refs.pic.setMoveStatus();
        },
        //删除点
        deleteDraw(){
            this.$refs.pic.deleteDraw();
        },
        //获取底图中所有的监测点
        getAllMonitorPoint(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getAllMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorPointInfo=response.data.rt;
                    this.$refs.pic.loadPoints(this.monitorPointInfo);
                }
            })
        },
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
                    userGroupId:vm.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorMainItemList=response.data.rt;
                    this.monitorMainItemList.forEach((item,index)=>{
                        this.$set(item,'spotNum',true)
                    })
                    this.drawItemId=this.monitorMainItemList[0].id;
                    this.drawItemType=this.monitorMainItemList[0].type;
                    console.log(this.monitorMainItemList,'monitorMainItemList')
                }
            })
        },
        //设置监测点状态(故障/修复)
        editMonitorPointStatus(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/editMonitorPointStatus',
                headers:{
                    'token':vm.token
                },
                params:{
                   pointId:vm.pointId,
                   status:vm.monitorStatus //监测点状态(故障为1和正常为0)
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }
            })
        },
        //编辑监测点位置
        editMonitorPointPosition(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/editMonitorPointPosition',
                headers:{
                    'token':vm.token
                },
                params:{
                   pointId:vm.pointId,
                   plotInfo:vm.plotInfo //编辑坐标信息
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }
            })
        },
        // 获取测点曲线图数据
        getMonitorPointChartData(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/editMonitorPointPosition',
                headers:{
                    'token':vm.token
                },
                data:{
                    pointIds:vm.pointIds
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }
            })
        },
        //设置监测点文字
        setMonitorPointWord(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/editMonitorPointPosition',
                headers:{
                    'token':vm.token
                },
                data:{
                    pointIds:vm.pointId,
                    word:vm.monitorWord
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }
            })
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
                                        color: #333333;
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
                                        color: #333333;
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
                                        color: #333333;
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
                                    color: #333333;
                                    display: inline-block;
                                    float: left;
                                    margin-top:10px;
                                    margin-left:24px;
                                }
                                 .alertContentTxt{
                                    display: block;
                                    height: 100px;
                                    margin:60px auto;
                                    width: 90%;
                                    color:#666666;
                                    font-size: 14px;
                                    text-align: left;
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
                                    right: 370px;
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
                                background: #fff;
                                .saveDrawTxt{
                                    font-size:12px;
                                    color:#666666;
                                    line-height: 32px;
                                }
                            }

                        }
                        .planeFigureGround{
                            z-index: 8;
                            height: 540px;
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
                        .leftTopMonitorContent{
                            position: absolute;
                            top:30px;
                            left:30px;
                            z-index:11;

                        }
                        .rightBottomCheck{
                            position: absolute;
                            bottom:30px;
                            left:30px;
                            z-index:11;
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
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
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
                    .tableBodyPagination{
                        display: block;
                        height: 62px;
                        width: auto;
                        border-left: 1px solid #d4d4d4;
                        border-right: 1px solid #d4d4d4;
                        border-bottom: 1px solid #d4d4d4;
                        box-sizing: border-box;
                        background: #fafafa;
                        position: relative;
                        .tableBodyPaginationLeft{
                            position: absolute;
                            left: 50px;
                            bottom: 0px;
                            .leftTxtOne{
                                .el-select{
                                    .el-input__inner{
                                        border:none;
                                        width: 100px;
                                        color:#333333;
                                        height: 38px;
                                    }
                                }
                            }
                        }
                        .tableBodyPaginationRight{
                            position: absolute;
                            right: 2px;
                            bottom: 10px;
                            .el-pagination .el-select .el-input .el-input__inner{
                                    height: 28px !important;
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
            .editBodyone,.editBodytwo{
                text-align: left;
            }
            .editInpText{
                display: inline-block;
                margin-left: 40px;
            }
            .editBodytwo1{
                position: relative;
                height: 80px;
            }

            .editInpText1{
                position: absolute;
                top:0px;
            }
            .editSelect{
                width: 220px;
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
            .icon-sanjiao {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 174px;
                right: 293px;
            }
            .inpSmall{
                width: 120px;
                height: 38px;
                border: 1px solid #d1d1d1;
                border-radius: 2px;
                background: #fafafa;
                padding-left: 10px;
            }
            .addbaseMap{
                display: inline-block;
                width: 125px;
                margin-right: 10px;
                // position: relative;
                position: absolute;
                left:24%;
                border-radius: 2px;
                 height: 90px;
                background: #f0f1f4;
                border:1px solid #ccc;
                .addbaseMapImg{
                    width: 100%;
                    height: 90px;
                    margin: 0;
                    padding: 0;
                    border-radius: 2px;
                    cursor: pointer;
                    object-fit: contain;
                    background: #f0f1f4;
                }
                .addbaseMapHover{
                    display: inline-block;
                    position: absolute;
                    height: 90px;
                    width: 100%;
                    background-color: #8c8c8c;
                    border-radius: 4px;
                    opacity: 0.5;
                    top:0;
                    left:0;
                    cursor: pointer;
                    .hoverTxt{
                        display: inline-block;
                        margin-left:25%;
                        margin-top:25%;
                        font-size: 14px;
                        color: #fff;
                    }
                   
                }
            
            }
            .updataImageSpan input{
                    position: absolute;
                    left: 173px;
                    top: 107px;
                    opacity: 0;
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
            .icon-sanjiao1 {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 165px;
                right: 121px;
            }
            .spotNumName{
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
            .icon-sanjiao2 {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 263px;
                right: 121px;
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
            .icon-sanjiao3 {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 315px;
                right: 121px;
            }
            .icon-sanjiao4 {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 430px;
                right: 121px;
            }
            .icon-sanjiao5 {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 481px;
                right: 121px;
            }
            .spotTextArea{
                position: absolute;
                width: 375px;
                height: 60px;
                left:27%;
            }
            .editTxt{
                    display: inline-block;
                    margin-left: 74px;
                    color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    display: inline-block;
                    margin-right: 20px;
                    width: 30%;
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
        }
       

    }



</style>

