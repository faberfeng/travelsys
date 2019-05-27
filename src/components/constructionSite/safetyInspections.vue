<template>
    <div id="safetyInspection" >
        <div id="GroupSelect">
             <select v-model="selectUgId" class="inp-search">
                <option :value="item.groupId" v-for="(item,index) in ugList" :key="index" v-text="item.groupName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div class="topHeader">
            <!-- <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div> -->
            <!-- v-if="!pitchDetailShow&&!walkThroughShow&&!commonDetailShow" -->
            <div id="inspectionBody" v-show="!pitchDetailShow&&!walkThroughShow&&!commonDetailShow" >
                <!-- v-show="exportReportEdit" -->
                <!-- v-show="searchCheckEdit" -->
                <!-- <div class="textBtnLeft">
                    <label class="recordTxt"  @click="exportrEportsBtn()">导出报告</label>
                    <label class="exportTxt"    @click="walkThroughBtn()">巡视记录</label>
                </div> -->
                <!-- <div class="overviewBody">
                    <div class="overviewHead">
                        <label class="overviewHeadBtn"></label>
                        <label class="overviewHeadTxt">监测概况</label>
                    </div>
                    <div class="overviewFrame">
                        <ul class="overviewFrameUl">
                            <li class="overviewFrameLi">
                                <label class="weatherTxt">天气、温度</label>
                                <div class="weathBody">
                                    <img id="weathPic" width="100px" height="100px" :src="weathIcon(weatherIcon)">
                                    <p  style="font-size:14px;margin-top:10px">{{weatherIcon}}{{weatherAir}}</p>
                                    <p  style="font-size:14px;margin-top:10px">{{weatherTime}}</p>
                                </div>
                            </li>
                            <li class="overviewFrameLi1">
                                <label class="alertTxt">本次变化量报警点位分布</label>
                                <div id="overviewPie">
                                </div>
                                <div class="overviewPieLabel">
                                    <label style="font-size:24px;color:#333333">{{recentAlertAmount}}</label>
                                    <label style="display:block;font-size:14px;color:#cccccc;">报警</label>
                                </div>
                            </li>
                            <li class="overviewFrameLi2">
                                <label class="alertTxt">累计变化量报警点位分布</label>
                                <div id="overviewPie2"></div>
                                <div class="overviewPieLabel1">
                                    <label style="font-size:24px;color:#333333">{{totalAlertAmount}}</label>
                                    <label style="display:block;font-size:14px;color:#cccccc;">报警</label>
                                </div>
                            </li>
                            <li class="overviewFrameLi3">
                                <label class="alertTxt">监测数据统计</label>
                                <div id="conditionLine"></div>
                                <div id="conditionLine1"></div>

                            </li>
                            <li class="overviewFrameLi4">
                                <label class="alertTxt">现场工况</label>
                              
                                <p class="alertContentTxt">{{workingCondition}}</p>
                            </li>
                           
                        </ul>
                    </div>
                </div> -->
                <div class="planeFigure" id="planeFigure">
                    <div class="planeFigureHead">
                        <div class="planeFigureHeadLeft">
                            <label class="planeFigureHeadLeftBtn"></label>
                            <label class="planeFigureHeadLeftTxt">平面图</label>
                        </div>
                        <div  class="rotate">
                            <i class="drawingIcon bigRotate" @click="bigRotate()"></i>
                            <i class="drawingIcon smallRotate" @click="smallRotate()"></i>
                            <i class="drawingIcon zuoRotate" @click="zuoRotate()"></i>
                            <i class="drawingIcon youRotate" @click="youRotate()"></i>
                            <i class="drawingIcon el-icon-rank" @click="fullSrceen()"></i>
                        </div>
                        <div class="block">
                            <span class="demonstration">图例缩放比例</span>
                            <el-slider v-model="scaleValue" :max="100" :min="1" :step="1" @change="updateBaseMapZoom()"></el-slider>
                        </div>
                        <div class="planeFigureHeadRight" v-show="!editSpotShow">
                            <!-- v-show="basePicEdit" -->
                            <!-- <span v-if="isBindPoint"  class="bottomMap" @click="editPointNum()">编辑编号</span>
                            <span v-if="bindMorePoint"  class="bottomMap" @click="bindPoint()">绑定</span> -->
                            <span  :class="[{'clickStyle':isClick0},'bottomMap']" @click="getBaseMapListBtn()">底图管理</span>
                            <!-- v-show="manageEdit" -->
                            <span :class="[{'clickStyle':isClick},'editSpotBtn']"   @click="editSpot()">编辑点位</span>
                            <!-- <span class="drawLineBtn" @click="moreSpotLine()">多点对比</span> -->
                            <span class="uploadPicBtn" @click="setSpotPic()">照片标记</span>
                            <span :class="[{'clickStyle':isClick},'exportSaveBtn']" @click="getPdf()">导出图纸</span>
                            <img id="fz_img_for_site" src="./images/site.png" style="display:none"/>
                            <img id="fz_img_for_site1" src="./images/site1.png" style="display:none"/>
                        </div>
                        <div class="planeFigureHeadRightHide" v-show="editSpotShow" >
                            <span v-show="startpointShow">
                                <label style="font-size:14px;">起始测点编号:</label>
                                <input type="text" @mouseout="pointNameChange" @change="pointNameChange" class="pointName" v-model="pointNameValue" placeholder="测点-sp" />
                                <input type="text" @mouseout="pointNumChange"  @change="pointNumChange" class="pointNum" v-model="pointNumValue" placeholder="编号-01" />
                            </span>
                            <span id="inspectContentSel">
                                <select v-model="drawItemId" @change="changeType()"  class="inspectSel">
                                    <option v-for="(item,index) in monitorMainItemList" :key="index" :value="item.id" v-text="item.name"></option>
                                    
                                </select>
                                <i class="icon-sanjiao"></i>
                            </span>
                            <!-- v-show="startpointShow" -->
                            <!-- <span :class="[{'clickStyle':isClick},'bottomMap']" @click="getBaseMapListBtn()">底图</span> -->
                            <span v-if="isBindPoint" class="editNumSpot" @click="editPointNum()">编辑编号</span>
                            <span v-if="bindMorePoint" class="singleSpot" @click="bindPoint()">绑定</span>
                            <span :class="[{'clickStyle':isClick1},'singleSpot']" @click="drawingOneSpot">单点</span>
                            <span :class="[{'clickStyle':isClick2},'singleSpot']" @click="drawingSpots">连续</span>
                            <span :class="[{'clickStyle':isClick3},'inputText2']" @click="drawingText">文字</span>
                            <!-- <span :class="[{'clickStyle':isClick4},'inputText2']" @click="enableMove" >移动</span> -->
                            <span :class="[{'clickStyle':isClick5},'inputText3']" @click="changeBroken()" >故障/修复</span>
                            <span :class="[{'clickStyle':isClick6},'inputText2']" @click="deleteDraw">删除</span>
                            <span :class="[{'clickStyle':isClick7},'inputText2']" style="margin-left:20px;" @click="saveDraw()">保存</span>
                            <span :class="[{'clickStyle':isClick8},'inputText1']"  @click="cancleAll()" >取消</span>
                        </div>
                    </div>
                    <div class="planeFigureBody" id="planeFigureBody" ref="planeFigureRef">
                        <!-- <div class="operateTool" v-show="editSpotShow">
                            <div class="operateToolLeft" v-show="toolShow">
                                <span class="move" @click="enableMove"><i class="moveIcon"><label class="moveTxt" >移动</label></i></span>
                                <span v-show="broken==0"  class="fault" @click="changeBroken(1)" ><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                                 <span v-show="broken==1"  class="fault1"  @click="changeBroken(0)" ><i class="faultIcon"><label class="faultTxt">修复</label></i></span>
                                <span class="deleteDraw" @click="deleteDraw"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                            </div>
                            <div class="operateToolRight">
                                <label class="saveDrawTxt" @click="saveDraw()">保存</label>
                            </div>
                        </div> -->
                        <div class="noDataFigure" v-show="!paramsLists" >
                            <img style="width:140px;height:115px;margin-top:150px;" src="../../assets/nodata.png"/>
                            <p style="font-size:16px;color:#ccc">暂时没有底图显示，请点击底图管理按钮上传底图</p>
                        </div>
                        <div class="planeFigureGround" style="padding: 0px; overflow: auto;">
                            <!-- <img v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='jpg'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='png'" style="object-fit: contain;" :src="QJFileManageSystemURL+curBaseMapUrl">
                            <pdf v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='pdf'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+curBaseMapUrl"></pdf> -->
                            <picView ref="pic" @load_points="getAllMonitorPoint" @finish="drawFinish" @status_changed="picView_status_changed" :para="paramsLists" @Broken_changed="brokenChanged"   @Image_Mark="add"></picView>
                        </div>
                        <div class="leftTopMonitorContent">
                            <fileTree ref="fileTree" id="fileTree" @clickIcon="clickIcon"  @clickCheck="checkboxChange" :treeData="getDetectionDirectoryListLeft"></fileTree>

                            <!-- <el-checkbox v-model="spotNum0" style="display:block;width:120px;text-align:left">周边管线水平位移</el-checkbox> -->
                            <!-- <el-tree 
                            :highlight-current="true"
                            :show-checkbox="true"
                            @check="checkChange()"
                            :default-checked-keys="defaultCheckedKeys"
                            id="contentTree" ref="contentTree" :data="getDetectionDirectoryListLeft" node-key="id" :props="defaultProps">

                            </el-tree> -->
                            <!-- <ul>
                                <li v-for="(item,index) in monitorMainItemList" :key="index">
                                    <el-checkbox v-model="item.spotNum" @change="checkboxChange()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">
                                        {{item.name}}
                                    </el-checkbox>
                                </li>
                            </ul> -->
                            
                        </div>
                        <div class="rightBottomCheck">
                            <el-checkbox v-model="picMark" @change="picShowMark()"  style="display:block;width:120px;text-align:left">显示照片标记</el-checkbox>
                            <el-checkbox v-model="displaySpotNum" @change="displaySpot()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">显示点位读数</el-checkbox>
                        </div>
                    </div>
                    
                </div>
                <div class="inspectTable" > 
                    <div class="inspectTableHead">
                        <div class="inspectTableHeadLeft">
                            <label class="inspectTableHeadLeftTxt">监测单位：{{monitorCompany}}
                            </label>
                            <label class="inspectTableHeadLeftTxt"></label>
                        </div>
                        <div class="inspectTableHeadRight">
                            <!-- v-show="importDataEdit" -->
                            <div class="addData"  @click="batchExport()">数据导入</div>
                            <div class="addInspectContent"  @click="configureMonitorItemBtn()">配置监测目录</div>
                            <div class="addInspectContent"  @click="addMonitorItemBtn()">新增监测内容</div>
                            <!-- v-show="editInspectWordEdit" -->
                        </div>
                    </div>
                    <div class="inspectTableBody1">
                        <table border="1" cellspacing="0" width="100%" class="inspectTableList1">
                             <thead>
                                <tr>
                                    <th width="80px" rowspan="2">序号</th>
                                    <!-- <th rowspan="2">监测类型</th>
                                    <th rowspan="2">类型标记</th> -->
                                    <th width="220px" rowspan="2">监测内容</th>
                                    <th width="100px" rowspan="2">简写</th>
                                    <th width="100px" rowspan="2">测点数</th>
                                    <th width="180px" rowspan="2">最新数据</th>
                                    <th  colspan="3">本次最大变化量</th>
                                    <th  colspan="3">累计最大变化量</th>
                                    <th width="250px" rowspan="2">更多操作</th>
                                </tr>
                                <tr>
                                    <th width="200px">点号</th>
                                    <th width="150px">取值</th>
                                    <th width="100px" >报警</th>
                                    <th width="200px">点号</th>
                                    <th  width="150px">取值</th>
                                    <th>报警</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="inspectTableBody" id="inspect_TableBody">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                            <tbody>
                                <tr v-for="(item,index) in monitorMainTableList1" :key="index">
                                    <td width="80px" v-text="index+1"></td>
                                    <!-- <td>{{item.type|monitorTypeChange()}}</td>
                                    <td>{{item.sign}}</td> -->
                                    <td width="220px" v-text="item.name"></td>
                                    <td width="100px" v-text="item.logogram"></td>
                                    <td width="100px" v-text="item.count"></td>
                                    <td width="180px" >{{item.latestTime|timeChange()}}</td>
                                    <td width="200px">{{item.recentPointName|addSprit()}}</td>
                                    <td width="150px">{{item.recentVariation|addSprit1()}}</td>
                                    <td width="100px" :class="[{'red':item.recentAlert==true}]" >{{item.recentAlert|shifouChange()}}</td>
                                    <td width="200px">{{item.totalPointName|addSprit()}}</td>
                                    <td width="150px">{{item.totalVariation|addSprit2()}}</td>
                                    <td :class="[{'red':item.totalAlert==true}]">{{item.totalAlert|shifouChange()}}</td>
                                    <td width="250px">
                                        <button title="删除" @click="deleteMonitorNameBtn(item.id)" class="deleteBtn actionBtn"></button>
                                        <!-- v-show="editInspectWordEdit" -->
                                        <button title="编辑"  @click="editMonitorNameBtn(item.id)" class="editBtn actionBtn"></button>
                                        <!-- v-show="editInspectWordEdit" -->
                                        <button title="上移"  class="upmoveBtn actionBtn" @click="moveUp(item.id)"></button>
                                        <!-- v-show="editInspectWordEdit" -->
                                        <button title="下移"  class="downmoveBtn actionBtn" @click="moveDown(item.id)"></button>
                                        <!-- v-show="searchInspectDetailEdit" -->
                                        
                                        <button title="详情"  class="detailBtn actionBtn" @click="detail(item.keyword,item.id,item.type,item.name,item.baseMapId,item.count,item.sign)"></button>
                                        <!-- v-show="importDataEdit" -->
                                        <button title="导入"  class="exportBtn actionBtn" @click="importData(item.keyword,item.name,item.type,item.id)"></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <!-- <div class="tableBodyPagination">
                        <div class="tableBodyPaginationLeft">
                            <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">最新数据：</label><label style="color:#333;font-size:14px;line-height:62px">{{nowDate}}</label></span>
                            <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:50px;">报警岗位：</label>
                                <el-select v-model="positionValue" @change="positionChange()"><el-option v-for="(item,index) in positionList" :label="item.posName" :key="index" :value="item.id"></el-option></el-select>
                            </span>
                            <span class="leftTxtOne"><label class="leftTxtOneBtn"  @click="previewAlert()">发送报警短信</label></span>
                            
                        </div>
                        <div class="tableBodyPaginationRight">
                            <el-pagination class="elPagination"
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage1"
                                :page-sizes="[10,20,30]"
                                :page-size="1"
                                layout="sizes,prev, pager, next"
                                :total="monitorMainTableListLength">
                            </el-pagination>
                        </div>
                    </div> -->

                </div>
            </div>
            <!-- 以下是斜度详情页 -->
            <commonPitch-detail v-if="pitchDetailShow" ref="commonPitchDetailRef" v-on:back="backToH" :surveyName="surveyName" v-on:importExcelData="importDataShow" :userGroupId="selectUgId" :itemMonitorId="detailMonitorId" :itemMonitorType="itemType" :itemMonitorKeyWord="itemSubmitKeyWord"></commonPitch-detail>
            <!-- 以下是巡视报告 -->
            <walkThrough v-if="walkThroughShow" v-on:back="backToH" :userSelectId="selectUgId"></walkThrough>
            <!-- 以下是除斜度的其他详情页 -->
            <commonDetail v-if="commonDetailShow" ref="commonDetailRef" v-on:back="backToH" v-on:baseMapEmit="getBaseMapListBtn()"  v-on:importDataShow="importDataShow" :projctName="surveyName" :paramsListsSub="paramsLists" :itemMonitorKeyWord="itemSubmitKeyWord" :itemSubmitbaseMapId="itemSubmitbaseMapId" :itemSubmitCount="itemSubmitCount" :userGroupId="selectUgId" :itemMonitorId="detailMonitorId" :itemMonitorType="itemType" :itemSubmitSign="itemSign"></commonDetail>
        </div>
        <div id="edit">
            <el-dialog title="底图管理" :visible="baseMapShow" @close="baseMapCancle()" width="740px">
                <div class="baseMapBody">
                    <ul class="clearfix" style="margin:0px 20px 0px 20px;">
                        <li class="baseMapBodyLi" @mouseenter="enter(item.id)" @mouseleave="leave()" @click="selectCurBaseMap(item.id)" style="padding: 0px; overflow: hidden;" v-for="(item,index) in baseMapList" :key="index">
                            <img v-show="item.name.substr(item.name.length-3)=='jpg'||item.name.substr(item.name.length-3)=='png'" style="object-fit: contain;" class="baseMapBodyImg" :src="BDMSUrl+item.relativeUri">
                            <pdf v-show="item.name.substr(item.name.length-3)=='pdf'||item.name.substr(item.name.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="BDMSUrl+item.relativeUri"></pdf>
                            <div class="baseMapBodyLiBottom" v-show="item.id==hoverId">
                                <label class="baseMapName" v-text="item.name"></label>
                                <label v-show="item.useCount!=0" class="baseMapCount" >在用{{item.useCount}}</label>
                                <label v-show="item.useCount==0&&manageEdit" class="deleteBaseMap"  @click.stop="deleteBaseMap(item.id)"></label>
                            </div>
                        </li>
                        <!-- v-show="manageEdit" -->
                        <li class="uploadBaseBody" >
                            <div class="uploadBaseIcon">
                                <label for="drawingsInfo">
                                    <img style=" cursor: pointer"  src="./images/upload.png">
                                    <p>上传新底图</p>
                                </label>
                                <input class="upInput"  type="file" accept="image/*,.pdf"  @change="addBaseMap($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                            </div>
                        </li>
                    </ul>
                </div>
            </el-dialog>
            <el-dialog title="配置监测目录" :visible="configureContentShow" @close="configContentCancle()">
                <div @click="addContent()" class="addContent">
                        新增目录
                </div>
                <div class="configTable">
                    <table  border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>目录名称</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getDetectionDirectoryList" :key="index">
                                <td>{{item.name}}</td>
                                <td>
                                    <button @click="editContent(item.id,item.name)" class="actionBtn editBtn"></button>
                                    <button @click="deleteContent(item.id)" class="actionBtn deleteBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <!-- <button class="editBtnS" @click="configContentMakeSure()" >确定</button> -->
                    <button class="editBtnC" @click="configContentCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="新增监测目录" :visible="addContentShow"  @close="addContentCancle()">
                 <div class="editBodyone">
                     <label class="editInpText">目录名称:</label>
                     <input class="inp" style="height:32px !important" v-model="contentName" placeholder="请输入" /></div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addContentMakeSure()" >确定</button>
                    <button class="editBtnC" @click="addContentCancle()" >取消</button>
                </div>
            </el-dialog>

             <el-dialog title="编辑监测目录" :visible="editContentShow"  @close="editContentCancle()">
                 <div class="editBodyone">
                     <label class="editInpText">目录名称:</label>
                     <input class="inp" style="height:32px !important" v-model="editcontentName" placeholder="请输入" /></div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editContentMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editContentCancle()" >取消</button>
                </div>
            </el-dialog>

            <el-dialog title="新增监测内容" :visible="addInspectContentShow" @close="addInspectContentCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">监测目录:</label><select class="editSelect" v-model="directoryType" ><option v-for="(item,index) in getDetectionDirectoryLists" :value="item.id" :key="index" v-text="item.name"></option></select><i class="icon-sanjiaoA"></i></div>
                    <div class="editBodytwo"><label class="editInpText">名称:</label><input class="inp" style="height:32px !important" v-model="monitorName" placeholder="请输入" /></div>
                    <div class="editBodytwo"><label class="editInpText">类型:</label><select class="editSelect" v-model="monitorType" @change="typeChange(monitorType)" ><option v-for="(item,index) in monitorTypeList" :value="item.value" :key="index" v-text="item.label"></option></select><i class="icon-sanjiao"></i></div>
                    <div class="editBodytwo"><label class="editInpText">类型标记:</label><select class="editSelect" v-model="typeTagValue" ><option v-for="(item,index) in selectTypeTagList" :value="item.value" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao"></i></div>
                    <div class="editBodytwo"><label class="editInpText">简写:</label><input class="inpSmall" style="height:32px !important" v-model="monitorLogogram" placeholder="两个字母" /></div>
                    <div class="editBodytwo" v-show="monitorType==5?false:true"><label class="editInpText">关键词:</label><input class="inp" style="height:32px !important" v-model="monitorKeyword" placeholder="与导入Excel表名匹配" /></div>
                    <!-- <div  class="editBodytwo editBodytwo1"  v-show="monitorType==5?false:true&&false"><label class="editInpText editInpText1">底图:</label><div class="addbaseMap" @mouseenter="changeActive()" @mouseleave="removeActive()">
                        
                        <img v-show="monitorBaseMapId&monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='jpg'||monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='png'" class="addbaseMapImg" style="object-fit: contain;" :src="QJFileManageSystemURL+monitorBaseMapUrl">
                        <pdf v-show="monitorBaseMapId&monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='pdf'||monitorBaseMapUrl.substr(monitorBaseMapUrl.length-3)=='PDF'" class="addbaseMapImg" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+monitorBaseMapUrl"></pdf>
                        <div class="addbaseMapHover" v-show="hoverShow"><label class="hoverTxt" @click="clickChange()">点击更换</label></div></div>
                    </div> -->
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMonitorItem()" >确定</button>
                    <button class="editBtnC" @click="addInspectContentCancle()" >取消</button>
                </div>
            </el-dialog>

             <el-dialog title="绑定监测内容" :visible="bindInspectContentShow" @close="bindInspectContentCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText" style="margin-left:80px;">监测目录:</label><select class="editSelect" style="width:270px;" v-model="drawItemId" @change="changeType()" ><option v-for="(item,index) in monitorMainItemList" :value="item.id" :key="index" v-text="item.name"></option></select><i class="icon-sanjiaoT"></i></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="bindMonitorItem()" >确定</button>
                    <button class="editBtnC" @click="bindInspectContentCancle()" >取消</button>
                </div>
            </el-dialog>

             <el-dialog title="编辑编号" :visible="bindSpotNumShow" @close="bindSpotNumCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">修改的测点:</label><select class="editSelect" v-model="editSpotNum" @change="changeSpot()" ><option v-for="(item,index) in editSpotNumList" :value="item.id" :key="index" v-text="item.name"></option></select><i class="icon-sanjiaoB"></i></div>
                </div>
                <div class="editBodytwo"><label class="editInpText">新测点编号:</label><input class="inpSmall" style="height:32px !important" v-model="newSpotNum" /></div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="bindSpotNumMakeSure()" >确定</button>
                    <button class="editBtnC" @click="bindSpotNumCancle()" >取消</button>
                </div>
            </el-dialog>

            <el-dialog title="监测内容更名" :visible="editInspectContentShow" @close="editInspectContentCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">名称:</label><input class="inp" style="height:32px !important" v-model="monitorName1" placeholder="请输入" /></div>
                    <div class="editBodytwo"><label class="editInpText">简写:</label><input class="inpSmall" style="height:32px !important" v-model="monitorLogogram1" placeholder="两个字母" /></div>
                    <div class="editBodytwo" v-show="monitorType==5?false:true"><label class="editInpText">关键词:</label><input class="inp" style="height:32px !important" v-model="monitorKeyword1" placeholder="与导入Excel表名匹配" /></div>
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
                            <label for="fileInfoExport">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importExcel" id="fileInfoExport" @change="addExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelFileListName}}<label v-show="!excelFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==5"><label class="editInpText" style="width:18% !important;">匹配结果</label><label>文档内表总数：{{excelSheetInfoLength}}</label><label style="display:inline-block;margin-left:30px;">匹配到的表数量：</label></div>
                    <!-- <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">使用Excel表名:</label><select v-model="sheetIndex" class="sheetName"><option v-for="(item,index) in excelSheetInfo"  :value="item.index" :key="index" v-text="item.name"></option></select>
                    </div> -->
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{monitorImportName}}</label></div>
                    <div class="editBodytwo" v-show="monitorImportType!=5"><label class="editInpText" style="width:18% !important;">点位编号列名:</label><select v-model="spotNumCol" placeholder="请选择"  class="spotNumName"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='点位编号'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao2"></i> -->
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label><select class="gatherTimeName" v-model="timeCol" placeholder="请选择"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='采集时间'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao3"></i> -->
                    </div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;"><el-checkbox>使用统一时间:</el-checkbox><el-date-picker style="width:374px !important;margin-left:141px;margin-top:-40px;" v-model="unifiedTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker></label></div>
                    <div class="editBodytwo" v-show="monitorImportType==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label><select class="gatherTimeName" v-model="distanceCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='位移取值'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao3"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label><select class="gatherTimeName" v-model="altitudeCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='高程时间'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao3"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label><select class="gatherTimeName" v-model="pipeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='管口标高'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao4"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label><select class="gatherTimeName" v-model="gaugeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='水位深度'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==5"><label class="editInpText" style="width:18% !important;">斜度位移取值列名:</label><select class="gatherTimeName" v-model="shiftIndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='斜度位移'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==5"><label class="editInpText" style="width:18% !important;">斜度深度取值列名:</label><select class="gatherTimeName" v-model="depthIndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='斜度深度'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==4"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="frequencyShow">按频率取值受力</el-checkbox></label></div>
                    <div class="editBodytwo" v-show="monitorImportType==4&&!frequencyShow"><label class="editInpText" style="width:18% !important;">受力取值列名:</label><select class="gatherTimeName" v-model="forceIndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name=='受力取值'?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==4&&frequencyShow"><label class="editInpText" style="width:18% !important;">率定系数列名:</label><select class="gatherTimeName" v-model="kIndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name.indexOf('率定系数')>-1?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==4&&frequencyShow"><label class="editInpText" style="width:18% !important;">初始频率列名:</label><select class="gatherTimeName" v-model="f0IndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name.indexOf('初始频率')>-1?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==4&&frequencyShow"><label class="editInpText" style="width:18% !important;">本次频率列名:</label><select class="gatherTimeName" v-model="fnIndexCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name" :selected="item.name.indexOf('本次频率')>-1?'selected':null"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo" v-show="monitorImportType==4&&frequencyShow"><label class="editInpText" style="width:18% !important;">受力计算公式:</label><select class="gatherTimeName" v-model="useFormulaNum"><option v-for="(item,index) in useFormulaList" :value="item.value" :key="index" v-text="item.name"></option></select>
                    <!-- <i class="icon-sanjiao5"></i> -->
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="saveImportColumnValue" @change="saveImportColumnSetting()">保存以上列名匹配为默认</el-checkbox></label></div>
                    <!-- <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1" style="width:18% !important;">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea" v-model="inputWorkingCondition"></textarea></div> -->

                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="overwrite">覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" v-show="monitorImportType==4&&frequencyShow" @click="formulaSetting()" >公式设定</button>
                        <button  class="editBtnC" style="margin-right:15px;" @click="verifyExcelDataBtn()">测试</button>
                        <button  class="editBtnS" @click="importExcelDataMakeSure()" >确定</button>
                        <button class="editBtnC" @click="importGatherDataCancle()" >取消</button>
                </div>
            </el-dialog>
            <!-- <el-dialog title="监测结果批量导入" :visible="batchImportDataShow1" @close="batchImportCancle()">
                <div class="editBody" id="editBodyStyle" style="overflow:auto;">
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">本地Excel文档:</label>
                        <span class="updataImageSpan">
                            <label for="morefileInfo">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importMoreExcel" id="morefileInfo" @change="addMoreExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelMoreFileListName}}<label v-show="!excelMoreFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;">匹配结果:</label><label>文档内表总数：{{allAmount}}</label><label style="display:inline-block;margin-left:30px;">匹配到的表数量：{{matchedAmount}}</label></div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;"><el-checkbox>使用统一时间:</el-checkbox><el-date-picker style="width:374px !important;margin-left:141px;margin-top:-40px;" v-model="unifiedTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker></label></div>
                    <ul>
                        <li v-for="(val,index) in sheetList" :key="index" >
                            <div class="editBodytwo">
                                <label class="editInpText" style="width:18% !important;font-weight:bold;">使用Excel表名:</label>
                                
                                <select  class="sheetName" :id="'sheetName'+val.itemId" @change="sheetIndexChange(val.sheetIndex)">
                                    <option value=""></option>
                                    <option v-for="(item,index) in sheetList"  :value="item.sheetIndex+'-'+val.itemId" :key="index" v-text="item.sheetName"></option>
                                </select>
                            </div>
                           
                            <div v-show="val.sheetIndex==sheetValue">
                                <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{val.itemName}}</label>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type!=5" ><label class="editInpText" style="width:18% !important;">点位编号列名:</label>
                                    <select  placeholder="请选择" :id="'spotNumCol'+val.itemId"  class="spotNumName">
                                        <option value=""></option>
                                        <option v-for="item in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option>
                                    </select>
                                </div>
                                
                                <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label>

                                    <select class="gatherTimeName"  :id="'timeCol'+val.itemId" placeholder="请选择">
                                         <option value=""></option>
                                        <option v-for="item in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option>
                                    </select>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label>
                                    <select class="gatherTimeName"  :id="'distanceCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label>
                                    <select class="gatherTimeName"  :id="'altitudeCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label>
                                    <select class="gatherTimeName"  :id="'pipeHeightCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label>
                                    <select class="gatherTimeName"  :id="'gaugeHeightCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==5"><label class="editInpText" style="width:18% !important;">斜度位移取值列名:</label>
                                    <select class="gatherTimeName"  :id="'shiftIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==5"><label class="editInpText" style="width:18% !important;">斜度深度取值列名:</label>
                                    <select class="gatherTimeName"  :id="'depthIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                 <div class="editBodytwo" v-show="!frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">受力取值列名:</label>
                                    <select class="gatherTimeName"  :id="'forceIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type==4"><label class="editInpText" style="width:18% !important;">
                                        <el-checkbox v-model="frequencyShow">按频率取值受力</el-checkbox>
                                    </label>
                                </div>
                               
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">率定系数列名:</label>
                                    <select class="gatherTimeName"  :id="'kIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">初始频率列名:</label>
                                    <select class="gatherTimeName"  :id="'f0IndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                            
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">本次频率列名:</label>
                                    <select class="gatherTimeName"  :id="'fnIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">受力计算公式:</label>
                                    <select class="gatherTimeName"  :id="'useFormulaNum'+val.itemId"><option value=""></option><option v-for="(item) in useFormulaList" :value="item.value+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                <button class="editBtnS editBtnSstyle" v-show="frequencyShow&&val.type==4" @click="formulaSetting(val.itemId)" >公式设定</button>
                            </div>
                        </li>
                    </ul>
                    
                    <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1" style="width:18% !important;">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea" v-model="workingConditionList"></textarea></div>

                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="overwrite">覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                       
                        <button  class="editBtnC" style="margin-right:15px;" @click="batchImportVerify()">测试</button>
                        <button  class="editBtnS" @click="batchImportVerifyMake()" >确定</button>
                        <button class="editBtnC" @click="batchImportCancle()" >取消</button>
                </div>
            </el-dialog> -->

            <el-dialog title="监测结果批量导入" :visible="batchImportDataShow" @close="batchImportCancle()">
                <div class="editBody" id="editBodyStyle" style="overflow:auto;">
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">本地Excel文档:</label>
                        <span class="updataImageSpan">
                            <label for="morefileInfo">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importMoreExcel" id="morefileInfo" @change="addMoreExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelMoreFileListName}}<label v-show="!excelMoreFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;">匹配结果:</label><label>文档内表总数：{{allAmount}}</label><label style="display:inline-block;margin-left:30px;">匹配到的表数量：{{matchedAmount}}</label></div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;"><el-checkbox>使用统一时间:</el-checkbox><el-date-picker style="width:374px !important;margin-left:141px;margin-top:-40px;" v-model="unifiedTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker></label></div>
                    <ul>
                        <li v-for="(val,index) in sheetList" :key="index" >
                            <div class="editBodytwo">
                                <label class="editInpText" style="width:18% !important;font-weight:bold;">使用Excel表名:</label>
                                <label class="editInpText">{{val.sheetName}}</label>
                                <i class="exportIcon" @click="exportData(val)" ></i>
                                <label v-show="!val.exportShow" style="color:#ccc">{{val.exportTip}}</label>
                               
                                <!-- <select  class="sheetName" :id="'sheetName'+val.itemId" @change="sheetIndexChange(val.sheetIndex)">
                                    <option value=""></option>
                                    <option v-for="(item,index) in sheetList"  :value="item.sheetIndex+'-'+val.itemId" :key="index" v-text="item.sheetName"></option>
                                </select> -->
                            </div>
                          
                            <!-- <div v-show="val.sheetIndex==sheetValue">
                                <div class="editBodytwo">
                                    <label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{val.itemName}}</label>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type!=5" ><label class="editInpText" style="width:18% !important;">点位编号列名:</label>
                                    <select  placeholder="请选择" :id="'spotNumCol'+val.itemId"  class="spotNumName">
                                        <option value=""></option>
                                        <option v-for="item in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option>
                                    </select>
                                </div>
                               
                                <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label>

                                    <select class="gatherTimeName"  :id="'timeCol'+val.itemId" placeholder="请选择">
                                         <option value=""></option>
                                        <option v-for="item in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option>
                                    </select>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label>
                                    <select class="gatherTimeName"  :id="'distanceCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label>
                                    <select class="gatherTimeName"  :id="'altitudeCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label>
                                    <select class="gatherTimeName"  :id="'pipeHeightCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label>
                                    <select class="gatherTimeName"  :id="'gaugeHeightCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==5"><label class="editInpText" style="width:18% !important;">斜度位移取值列名:</label>
                                    <select class="gatherTimeName"  :id="'shiftIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                <div class="editBodytwo" v-show="val.type==5"><label class="editInpText" style="width:18% !important;">斜度深度取值列名:</label>
                                    <select class="gatherTimeName"  :id="'depthIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>

                                 <div class="editBodytwo" v-show="!frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">受力取值列名:</label>
                                    <select class="gatherTimeName"  :id="'forceIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                
                                <div class="editBodytwo" v-show="val.type==4"><label class="editInpText" style="width:18% !important;">
                                        <el-checkbox v-model="frequencyShow">按频率取值受力</el-checkbox>
                                    </label>
                                </div>
                               
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">率定系数列名:</label>
                                    <select class="gatherTimeName"  :id="'kIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">初始频率列名:</label>
                                    <select class="gatherTimeName"  :id="'f0IndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                            
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">本次频率列名:</label>
                                    <select class="gatherTimeName"  :id="'fnIndexCol'+val.itemId"><option value=""></option><option v-for="(item) in val.sheetlist" :value="item.index+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                <div class="editBodytwo" v-show="frequencyShow&&val.type==4"><label class="editInpText" style="width:18% !important;">受力计算公式:</label>
                                    <select class="gatherTimeName"  :id="'useFormulaNum'+val.itemId"><option value=""></option><option v-for="(item) in useFormulaList" :value="item.value+'-'+val.itemId" :key="item.index" v-text="item.name"></option></select>
                                </div>
                                <button class="editBtnS editBtnSstyle" v-show="frequencyShow&&val.type==4" @click="formulaSetting(val.itemId)" >公式设定</button>
                            </div> -->
                        </li>
                    </ul>
                    <!-- <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="saveImportColumnValue" @change="saveImportColumnSetting()">保存以上列名匹配为默认</el-checkbox></label></div>
                    <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1" style="width:18% !important;">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea" v-model="workingConditionList"></textarea></div> -->

                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="overwrite">覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button  class="editBtnC" style="margin-right:15px;" @click="batchImportVerify()">测试</button>
                        <button  class="editBtnS" @click="batchImportVerifyMake()" >确定</button>
                        <button class="editBtnC" @click="batchImportCancle()" >取消</button>
                </div>
            </el-dialog>

            <el-dialog :visible="singleBatchImportDataShow" :title="valitemName+'数据导入'" @close="singleBatchImportCancle()">
                <div class="editBody"  style="overflow:auto;">
                    <div>
                        <div class="editBodytwo">
                            <label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{valitemName}}</label>
                        </div>
                        
                        <div class="editBodytwo" v-show="valitemtype!=5" ><label class="editInpText" style="width:18% !important;">点位编号列名:</label>
                            <select  placeholder="请选择" :id="'spotNumCol'+valitemId"  class="spotNumName">
                                <option value=""></option>
                                <option v-for="item in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='点位编号'?'selected':null"></option>
                            </select>
                        </div>
                        
                        <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label>

                            <select class="gatherTimeName"  :id="'timeCol'+valitemId" placeholder="请选择">
                                    <option value=""></option>
                                <option v-for="item in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='采集时间'?'selected':null"></option>
                            </select>
                        </div>
                        
                        <div class="editBodytwo" v-show="valitemtype==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label>
                            <select class="gatherTimeName"  :id="'distanceCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='位移取值'?'selected':null" ></option></select>
                        </div>

                        <div class="editBodytwo" v-show="valitemtype==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label>
                            <select class="gatherTimeName"  :id="'altitudeCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='高程取值'?'selected':null"></option></select>
                        </div>

                        <div class="editBodytwo" v-show="valitemtype==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label>
                            <select class="gatherTimeName"  :id="'pipeHeightCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='管口标高'?'selected':null"></option></select>
                        </div>

                        <div class="editBodytwo" v-show="valitemtype==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label>
                            <select class="gatherTimeName"  :id="'gaugeHeightCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='水位深度'?'selected':null"></option></select>
                        </div>

                        <div class="editBodytwo" v-show="valitemtype==5"><label class="editInpText" style="width:18% !important;">斜度位移取值列名:</label>
                            <select class="gatherTimeName"  :id="'shiftIndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='斜度位移'?'selected':null"></option></select>
                        </div>

                        <div class="editBodytwo" v-show="valitemtype==5"><label class="editInpText" style="width:18% !important;">斜度深度取值列名:</label>
                            <select class="gatherTimeName"  :id="'depthIndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='斜度深度'?'selected':null"></option></select>
                        </div>

                            <div class="editBodytwo" v-show="!frequencyShow&&valitemtype==4"><label class="editInpText" style="width:18% !important;">受力取值列名:</label>
                            <select class="gatherTimeName"  :id="'forceIndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name=='受力取值'?'selected':null"></option></select>
                        </div>
                        
                        <div class="editBodytwo" v-show="valitemtype==4"><label class="editInpText" style="width:18% !important;">
                                <el-checkbox v-model="frequencyShow">按频率取值受力</el-checkbox>
                            </label>
                        </div>
                        
                        <div class="editBodytwo" v-show="frequencyShow&&valitemtype==4"><label class="editInpText" style="width:18% !important;">率定系数列名:</label>
                            <select class="gatherTimeName"  :id="'kIndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name.indexOf('率定系数')>-1?'selected':null"></option></select>
                        
                        </div>
                        <div class="editBodytwo" v-show="frequencyShow&&valitemtype==4"><label class="editInpText" style="width:18% !important;">初始频率列名:</label>
                            <select class="gatherTimeName"  :id="'f0IndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name.indexOf('初始频率')>-1?'selected':null"></option></select>
                    
                        </div>
                        <div class="editBodytwo" v-show="frequencyShow&&valitemtype==4"><label class="editInpText" style="width:18% !important;">本次频率列名:</label>
                            <select class="gatherTimeName"  :id="'fnIndexCol'+valitemId"><option value=""></option><option v-for="(item) in valsheetlist" :value="item.index+'-'+valitemId" :key="item.index" v-text="item.name" :selected="item.name.indexOf('本次频率')>-1?'selected':null"></option></select>
                        </div>
                        <div class="editBodytwo" v-show="frequencyShow&&valitemtype==4"><label class="editInpText" style="width:18% !important;">受力计算公式:</label>
                            <select class="gatherTimeName"  :id="'useFormulaNum'+valitemId"><option value=""></option><option v-for="(item) in useFormulaList" :value="item.value+'-'+valitemId" :key="item.index" v-text="item.name"></option></select>
                        </div>
                        <button class="editBtnS editBtnSstyle" v-show="frequencyShow&&valitemtype==4" @click="formulaSetting(valitemId)" >公式设定</button>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                        <button  class="editBtnS" @click="singleBatchImportVerifyMake(valitemId,valitemtype,valitem,valsheetIndex)" >下一步</button>
                        <button class="editBtnC" @click="singleBatchImportCancle()" >取消</button>
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
                            <label class="editTxt">混凝土支撑宽度：</label>
                            <input placeholder="请输入" v-model="concreteWidthValue" class="editInput"/>
                        </div>
                        <div class="editBodytwo">
                            <label class="editTxt">混凝土支撑高度： ：</label>
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
            <el-dialog title="发送报警短信" :visible="sendAlertMessageShow" @close="sendAlertMessageCancle()" v-loading="sendAlertMessageLoad">
                <div class="editBody">
                    <p style="margin-left:50px;text-align:left;width:80%;">以下内容将通过手机短信发送给具有【{{positionListName}}】岗位的{{positionListLength}}名用户：</p>
                    <p style="margin-left:50px;text-align:left;width:80%" v-show="alertMessage" v-html="alertMessage"></p>
                    <p v-show="!alertMessage" style="margin-left:50px;text-align:left;color:red;width:80%">当前群组管理的安全监测点位中无报警测点</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="sendAlertMessage()">发送</button>
                    <button class="editBtnC" @click="sendAlertMessageCancle()" >取消</button>
                </div>
            </el-dialog>
             <el-dialog title="上传标记图片" :visible="uploadshow" >
                <div class="editBody">
                    <!-- <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">文件说明 :</label>
                        <input type="text" class="inp" v-model="des">
                    </div> -->
                    <div class="editBodytwo imageBody" style="margin-left:31px">
                        <label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectImg">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput"  type="file" accept="image/*"  @change="fileChanged($event)" ref="file"  id="fileInfo1" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                </div>
                <!-- <p class="err" v-show="showErr">请输入完整信息</p> -->
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPhotoTag">上传</button>
                    <button class="editBtnC" @click.stop="upImgCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导出监测报告" :visible="exportrEportsShow" @close="exportrEportsCancle()">
                <div class="editEportBody">
                    <div class="editEportBodyone">
                        <div class="oneTxt">
                            时间段设置：
                        </div>
                        <div class="timeInp">
                            <div class="timeTxt"><label class="label1">使用以下时间之前最近的数据：</label></div>
                            <div class="timeSel">
                                 <el-date-picker
                                    v-model="consultValue"
                                    type="datetime" style="width:550px !important"
                                    :default-value="todayTime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </div>
                             <div class="timeTxt" style="margin-top:10px;"><label class="label1">参考以下时间之前最近的数据：</label></div>
                             <div class="timeSel">
                                 <el-date-picker
                                    v-model="userValue"
                                    type="datetime" style="width:550px !important"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <!-- style="height:100px;" -->
                    <div class="editEportBodytwo" >
                        <div class="head">
                            <el-checkbox class="elCheck" v-model="coverChecked" @change="coverCheckedChange()"><label style="font-size:16px;font-weight:blod;">封面</label></el-checkbox>
                            <span class="groundSpan" @click="retract"><img class="groundEdit"   :src="retractImg"/>{{retractText}}</span>
                        </div>
                        <div v-show="isShow" class="imgBody">
                            <div class="imgBodyLeft"  @click="uploadCoverPic">
                                <label class="imgMask" for="drawingsInfo1">
                                    <img class="hoverAdd" src="../../assets/hover-add.png"  /><img  src="../../assets/updata-logo.png"  />
                                    <input class="upInput1"  type="file" accept="image/*"  @change="addCover($event)" ref="drawingsInfo1"  id="drawingsInfo1" multiple="multiple">
                                </label>
                                <img v-show="coverPathUrl" class="logo" :src="QJFileManageSystemURL+coverPathUrl" style="width:240px;height:60px;"/> 
                            </div>
                            <!-- <div class="imgBodyRight">
                                <img v-show="coverPathUrl" class="logo" :src="QJFileManageSystemURL+coverPathUrl" style="width:240px;height:60px;"/>
                            </div> -->
                        </div>
                    </div>
                     <div class="editEportBodytwo" >
                        <div class="head">
                            <el-checkbox class="elCheck" v-model="summaryChecked" @change="summaryCheckedChange()"><label style="font-size:16px;font-weight:blod;">概述</label></el-checkbox>
                            <span class="groundSpan" @click="retract1"><img class="groundEdit"   :src="retractImg1"/>{{retractText1}}</span>
                        </div>
                        <div class="textBody" v-show="isShow1">
                            <label>综述及建议：</label>
                            <div class="areaBody">
                                <textarea v-model="suggestList" style="padding:5px;" placeholder="请输入"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="editEportBodytwo">
                        <div class="head">
                            <el-checkbox class="elCheck" v-model="spotChecked" @change="spotCheckedChange()"><label style="font-size:16px;font-weight:blod;">测点详情：</label></el-checkbox>
                            <span class="groundSpan" @click="retract2"><img class="groundEdit"   :src="retractImg2"/>{{retractText2}}</span>
                        </div>
                        <div class="selectMap" v-show="isShow2">
                            <div class="map_txt">
                                <el-checkbox class="map_check" v-model="showBaseImg" @change="showBaseImgCheck()"><label>每一页都展示底图</label></el-checkbox>
                               <div class="map_check1" v-show="basePicShow"><label style="margin-right:20px;">底图位置:</label> <el-radio v-model="pageSelect" label="1">页面上部</el-radio><el-radio v-model="pageSelect" label="2">页面底部</el-radio></div>
                            </div>
                            <div class="map_txt" style="margin-top:10px;">
                                 <el-checkbox class="map_check" v-model="optimalLayout" @change="optimalLayoutCheck()"><label>优化布局测点标记</label></el-checkbox>
                                <div class="map_check1" v-show="firstMethodShow"><label style="margin-right:20px;">优先方式:</label> <el-radio v-model="priorityLayout" label="1">测点顺序优先</el-radio><el-radio v-model="priorityLayout" label="2">图面清晰优先</el-radio></div>
                            </div>
                        </div>
                    </div>
                    <div class="editEportBodytwo" >
                        <div class="head">
                            <el-checkbox class="elCheck" v-model="qcodeChecked" @change="qcodeCheckedChange()"><label style="font-size:16px;font-weight:blod;">生成二维码：</label></el-checkbox>
                            <span class="groundSpan" @click="retract3"><img class="groundEdit"   :src="retractImg3"/>{{retractText3}}</span>
                        </div>
                        <div v-show="isShow3" class="qrcodeBody">
                            <!-- <img :src="BDMSUrl+'/QRCode2/getQRimage/'+'{'+onlyNum+'}'" /> -->
                            <label class="onlyNumStyle">报告编码：{{onlyNum}}</label>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="saveReportSetting()" >保存设置</button>
                    <!-- v-show="reportShow" -->
                    <button class="editBtnC"  @click="exportReport(selectUgId,consultValue,userValue,monitorCompany,monitorBaseMapId)" >生成</button>
                </div>
            </el-dialog>
             <el-dialog title="测点变化曲线" width="900px"  :visible="moreSpotShow" @close="moreSpotCancle()">
                    <!-- <div style="margin-bottom:20px;">
                        <el-date-picker
                            v-model="selectValue"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">                         
                        </el-date-picker>
                        <span class="searchBtn" @click="makeSureData()">确认</span>
                    </div> -->
                    <div v-if="moreSpotShow">
                        <vue-highcharts v-show="typeSpotShow"  id="spotChangeLine" style="max-height:800px"  :options="optionMoreSpotChangeLine" ref="spotChangeLine"></vue-highcharts>
                        <vue-highcharts v-show="!typeSpotShow"  id="spotTypeChange" style="max-height:800px"  :options="optionMoreSpotChangeLineType" ref="spotTypeChange"></vue-highcharts>
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
                            value-format="yyyy-MM-dd">                         
                        </el-date-picker>
                        <span class="searchBtn" @click="makeSureData1()">确认</span>
                    </div>
                    <div v-if="spotChangeLineShow1">
                        <vue-highcharts  id="spotChangeLine1" style="max-height:900px"  :options="optionSpotChangeLine1" ref="spotChangeLine1"></vue-highcharts>
                    </div>
            </el-dialog>
            <el-dialog width="1000px" title="测斜序列变化曲线" :visible="pitchLineShow" @close="pitchLineCancle()" >
                <div>
                    <vue-highcharts id="leftHightchart"   :options="optionOnesLeft" ref="lineLeftChartOne"></vue-highcharts>
                </div>
            </el-dialog>
        </div>
        <!-- <button @click="getPdf()">按钮</button> -->
    </div>
</template>
<script>
import shouqiImg from '../../assets/arrow-top.png';
import zhankaiImg  from '../../assets/arrow-down.png';
import moment from 'moment'
import axios from 'axios'
import pdf from 'vue-pdf'
import VueHighcharts from 'vue2-highcharts'
import commonPitchDetail from './commonPitchDetail.vue' //斜度详情页组件
import walkThrough from './walkThrough.vue' //巡视报告
import commonDetail from './commonDetail.vue'//除斜度的详情页

import picView from './picView.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import fileTree from './fileTree.vue' //树形组件
var echarts = require('echarts');
export default {
    components: {
        pdf,commonPitchDetail,commonDetail,walkThrough,picView,VueHighcharts,jsPDF,html2canvas,fileTree
    },
    name:'safetyInspection',
    data(){
        window.addEventListener("message", (evt)=>{
                this.callback(evt)},true
        );
        return{
            fullShow:false,
            spotChangeLineShow1:false,
            pitchLineShow:false,
            singleData:{},
            defaultProps:{
                children:'children',
                label: 'name'
            },
            isBindPoint:false,
            bindMorePoint:false,
            loadings:false,
            typeSpotShow:false,
            sheetValue:'aaa',
            sheetList:'',
            selectSheetList:[],
            valitemName:'',
            valitemId:'',
            valitemtype:'',
            valitem:'',
            valsheetIndex:'',
            singleSheet:[],
            imgUrl:'',//上传封面图logo
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
            recentAlertAmount:0,
            totalAlertAmount:0,
            editSpotShow:false,
            startpointShow:false,
            toolShow:false,
            broken:0,
            alert:'',
            listLength:'',//判断选择了几条点位
            plotGroup:"",//选中当前数组
            plotGroupOne:'',//第一次集合绑定的监测点
            plotGroupName:'',//选中点位名称
            picMarkName:'',
            baseMapShow:false,
            baseMapMonitor:false,
            addInspectContentShow:false,//增加监测内容弹框
            bindInspectContentShow:false,//绑定监测内容
            bindSpotNumShow:false,//编辑点位编号
            newSpotNum:'',//新点位编号
            editSpotNum:"",
            editSpotNumList:[],
            configureContentShow:false,//配置目录内容弹框
            addContentShow:false,//新增目录
            editContentShow:false,//编辑目录
            contentName:'',
            editcontentName:'',
            contentId:'',
            editInspectContentShow:false,//编辑监测内容弹框
            importGatherDataShow:false,//导入采集数据
            matchKeyWord:'',//匹配关键字
            monitorImportName:'',//导入监测名称
            monitorImportType:'',//导入监测类型
            monitorImportId:'',//监测Id
            getPitchBaseInfoList:'',//获取斜度序列信息
            getPitchBaseInfoListLength:'',//长度
            getImportColumnList:'',//获得导入列设定数据
            spotNumCol:'',//点位列名
            timeCol:'',//采集时间列名
            unifiedTime:null,//使用统一时间
            distanceCol:'',//位移取值列名
            altitudeCol:'',//高程取值列名
            pipeHeightCol:'',//管口标高列名
            gaugeHeightCol:'',//水位深度列名
            forceIndexCol:'',//受力下标
            kIndexCol:'',//率定系数下标
            f0IndexCol:'',//
            fnIndexCol:'',//
            depthIndexCol:'',//深度下标
            shiftIndexCol:'',//位移下标
            saveImportColumnValue:false,//保存导入列数据
            frequencyShow:false,//是否按频率取值受力
            overwrite:false,//是否覆盖
            workingConditionList:'',
            batchImportDataShow:false,//批量数据导入
            batchImportDataShow1:false,
            singleBatchImportDataShow:false,//单项导入
            formulaSettingShow:false,//公式设定
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
            asValueArea:'',//as面积
            acValueArea:'',//ac面积
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
            sendAlertMessageShow:false,//是否发送报警信息弹窗
            sendAlertMessageLoad:false,//loading
            uploadshow:false,//是否上传图片
            filesList:[],
            imageName:'未选择任何文件',
            vibrateRadio:'1',//振弦式应变计计算公式
            fileList:'',
            fileListName:'',
            fileListCover:'',
            coverPathUrl:'',
            excelSheetInfo:'',//获取导入EXCEL文件的sheet信息
            excelSheetInfoLength:0,//获取表格的个数
            excelFileList:'',
            excelFileListName:'',
            excelMoreFileList:'',
            excelMoreFileListName:'',
            getBatchImportMatchingResultList:'',
            excelMoreSheetInfo:'',
            allAmount:'',//总数
            matchedAmount:'',//匹配数量
            sheetIndex:'',//当前表头
            sheetIndexList:[],//列表
            valsheetlist:[],
            pageNo:1,
            baseMapList:'',//底图列表数据
            isClick0:false,
            isClick:false,//是否点击
            isClick1:false,
            isClick2:false,
            isClick3:false,
            isClick4:false,
            moveClick:false,
            isClick5:false,
            isClick6:false,
            isClick7:false,
            isClick8:false,
            hoverShow:false,
            drawPointType:'',//绘画点位类型 'onePoint'表示单点，'morePoint'表示多点
            setSpotPicShow:false,//是否为上传图片标记
            monitorName:'',//监测名称
            monitorType:1,//监测类型
            directoryType:null,
            
            monitorLogogram:'',
            monitorKeyword:'',
            monitorId:'',
            monitorName1:'',//监测名称
            monitorLogogram1:'',
            monitorKeyword1:'',
            monitorBaseMapId:'',//选择底图ID

            getBaseMapInfoByBaseMapIdList:'',//根据底图id获取底图信息 
            rotate:0,//旋转角度
            angle:0,//角度
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
            monitorMainTableList1:[],//
            table_count:'',
            pageSize:10,
            pageNum:1,
            pageNum1:1,
            monitorMainTableListLength:0,//监测内容总表长度
            monitorMainItemList:'',//绘制底图内容
            monitorMainItemLists:[],//左边树形图
            defaultCheckedKeys:[],//默认选中数组
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
            exportrEportsShow:false,//导出报告
            reportShow:false,//是否生成
            moreSpotShow:false,//多点对比显示
            moreSpotChangeLineShow:false,
            consultValue:new Date(),
            userValue:'',
            getReportDatasList:'',//获取报告所需的数据
            getReportSettingList:'',
            coverChecked:false,//封面
            summaryChecked:false,//概述
            spotChecked:false,//测点
            qcodeChecked:false,//二维码
            generateQrcode:0,//是否生成二维码
            showBaseImg:false,//底图选择
            basePicShow:false,//
            firstMethodShow:false,//
            optimalLayout:false,//优先布局
            pointPriority:'1',//测点优先
            pageTop:'',//页面头部
            pageBottom:'',//页面顶部
            pageSelect:'',//页面选择
            priorityLayout:'',//优先布局
            picPriority:'',//图形清晰优先
            suggestList:'',//综述和建议
            retractImg:zhankaiImg,
            retractText:'展开',//展开与伸缩
            isShow:false,
            retractImg1:zhankaiImg,
            retractText1:'展开',//展开与伸缩
            isShow1:false,
            retractImg2:zhankaiImg,
            retractText2:'展开',//展开与伸缩
            isShow2:false,
            retractImg3:zhankaiImg,
            retractText3:'展开',//展开与伸缩
            isShow3:false,
            surveyName:'',//传递给子组件的name
            detailMonitorId:'',//传递给子组件的id
            itemType:'',//传递给子组件的监测类型
            itemSubmitKeyWord:'',//传递给子组件的监测关键字
            itemSubmitbaseMapId:'',
            itemSubmitCount:'',
            plotInfo:'123',//增加测点绘图信息（需要绘图传递，传什么回什么）
            pointId:'',//监测点ID
            pointIds:[],//选中监测点集合
            selectpointGroupIds:[],//选中监测点集合第一个点位
            pointIdName:[],//选中监测点名称
            drawItemId:'',//图纸项目ID
            drawItemType:'',//图纸类型改变
            drawItemTagType:'',//类型标记
            monitorPointInfo:[],//所有图纸监测点信息
            measureType:'',//虚拟场景测点type
            measureId:'',//虚拟场景测点id
            measureName:'',//虚拟场景测点名称
            monitorWord:'',//监测文字 
            currentPage1:1,//改变页面数 
            positionList:'',//岗位列表    
            positionListLength:'',//岗位人数
            alertMessage:null,//预览报警短信数据
            positionValue:'',//岗位值
            positionListName:'',//名称
            nowDate:'',//当前时间
            testShow:true,//是否测试
            spotPicInfo:[],//图片编辑绘图信息
            paramsLists:{},
            photoId:null,//图片ID
            photoIdList:null,
            spotPicInfoList:'',
            selectValue:'',
            startValue:'',
            endValue:'',
            selectValue1:'',
            optionOnesLeft:{
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
            optionSpotChangeLine1:{
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
            optionMoreSpotChangeLine:{
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
                            min:'',
                            max:'',
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                                // tickPixelInterval:1000
                               
                            
                                },
                        // yAxis: [{
                        //             // min:4268.5,
                        //             // max:43403.3542,
                        //             title: {
                        //                 text: '位移'
                        //             },
                        //         },
                        //         // labels:{
                        //         //     enabled: true
                        //         // },
                        //         // {
                        //         //     min:4268.5,
                        //         //     max:43403.3542,
                        //         //     title: {
                        //         //         text:'利润 (millions)'
                        //         //     },
                        //         //     opposite: true
                        //         // }
                        //     ],
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
            optionMoreSpotChangeLineType:{
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
                        yAxis: [{
                                    // min:4268.5,
                                    // max:43403.3542,
                                    title: {
                                        text: '位移'
                                    },
                                },
                                {
                                    // min:4268.5,
                                    // max:43403.3542,
                                    title: {
                                        text:'位移2'
                                    },
                                    opposite: true
                                }
                            ],
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
            acquisitionTimeXlist:[],
            elevationYlist:[],
            moreSpotLineList:'',
            moreSpotLineListLength:'',
            moreTypeSpotList1:'',
            moreTypeSpotList2:'',
            moreTypeSpotList1Length:'',
            moreTypeSpotList2Length:'',
            X1List:[],
            Y1List:[],
            X2List:[],
            Y2List:[],
            todayTime:new Date(),
            onlyNum:'',
            monitorStatus:1,
            projAuth1:[],//当前用户权限
            basePicEdit:false,
            searchCheckEdit:false,
            exportReportEdit:false,
            editInspectWordEdit:false,
            searchInspectDetailEdit:false,
            importDataEdit:false,//导入数据
            manageEdit:false,//管理底图和点位
            routerList:'',
            moduleList:'',
            projAuth:'',
            getDetectionDirectoryListLeft:[],
            flodShow:true,
            clickId:'',
            getDetectionDirectoryList:'',
            getDetectionDirectoryLists:[],
            pointNameValue:'',//测点名称
            pointNumValue:'',//编号
            scaleValue:40,//比例尺
            typeTagValue:'',
            typeTagList:[
                {
                    value:'CX',
                    name:'围护体测斜',
                    type:5
                },
                {
                    value:'TX',
                    name:'土体测斜',
                    type:5
                },
               
                {
                    value:'ZL',
                    name:'支撑轴力',
                    type:4
                },
                {
                    value:'YL',
                    name:'墙(桩)内力',
                    type:4
                },
                {
                    value:'TY',
                    name:'土压力',
                    type:4
                 },
                 {
                     value:'SY',
                     name:'孔隙水压力',
                     type:4
                 },
                 {
                     value:'LZ',
                     name:'立柱竖向位移',
                     type:2
                 },
                  {
                     value:'F',
                     name:'房屋竖向位移',
                     type:2
                 },
                 {
                     value:'DB',
                     name:'地表竖向位移',
                     type:2
                 },
                 {
                     value:'CYS',
                     name:'坑外承压水位',
                     type:3
                 },
                 {
                     value:'SW',
                     name:'坑外潜水水位',
                     type:3
                 },
                {
                    value:'W',
                    name:'围护顶竖向及水平位移',
                    type:2
                },
                 {
                     value:'DL',
                     name:'电力管线竖向及水平位移',
                      type:2
                 },
                 {
                     value:'MQ',
                     name:'煤气管线竖向及水平位移',
                      type:2
                 },
                 {
                     value:'SS',
                     name:'上水管线竖向及水平位移',
                      type:2
                 },
                 {
                     value:'DX',
                     name:'电信管线竖向及水平位移',
                      type:2
                 },
                 {
                     value:'XX',
                     name:'信息管线竖向及水平位移',
                      type:2
                 },
                 {
                     value:'YS',
                     name:'其他管线竖向及水平',
                      type:2
                 },


                 {
                    value:'W',
                    name:'围护顶竖向及水平位移',
                    type:1
                },
                 {
                     value:'DL',
                     name:'电力管线竖向及水平位移',
                      type:1
                 },
                 {
                     value:'MQ',
                     name:'煤气管线竖向及水平位移',
                      type:1
                 },
                 {
                     value:'SS',
                     name:'上水管线竖向及水平位移',
                      type:1
                 },
                 {
                     value:'DX',
                     name:'电信管线竖向及水平位移',
                      type:1
                 },
                 {
                     value:'XX',
                     name:'信息管线竖向及水平位移',
                      type:1
                 },
                 {
                     value:'YS',
                     name:'其他管线竖向及水平',
                      type:1
                 },
                 {
                     value:'QX',
                     name:'建筑物倾斜',
                     type:5
                 },
                 {
                     value:'FC',
                     name:'分程沉降',
                     type:2
                 }
            ],
            selectTypeTagList:[],
            dataList:[],
            dataLists:[],
            acquisitionTimeXlist1:[],
            elevationYlist1:[],
            startValue1:'',
            endValue1:'',
            getAllCurveList:[],
            getAllCurveId:'',
            startValue1:'',
            endValue1:'',
            // getAllCurveList:'',
            getAllCurveName:'',
            //斜度数据
            leftDisplayListValue1:[],
            leftDisplayListValue2:[],
            leftDisplayListValueXdata:[],
            leftDisplayListValueYdata1:[],
            leftDisplayListValueYdata2:[],
            pitchDetailDataListLeft:[],
            leftDisplayList:'',
            leftDisplayListValue:''
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
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'))
        vm.projAuth = localStorage.getItem('projAuth');
        this.loadingTitle()
        this.getAccessUserGroup();
        // this.getPositionList();
        this.curTime();
        this.curTime1();
        this.getUserInfo();
        //  console.log(document.getElementById('planeFigureBody'),'文件10');
         window.addEventListener('resize',(e)=>{this.resizeHeight();})
        //  this.fullShow=this.isFullscreen();
        //  console.log(this.fullShow,'this.fullShow');
        // setTimeout(()=>{
            
        // },200)
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
                return val.recentVariation.toFixed(2)
            }
        },
        addSprit2(val){
             if(val==null){
                return '/'
            }else {
                return val.totalVariation.toFixed(2)
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
    mounted(){
         var vm=this;
        // window.onkeydown = function(e) {
        //     let key = window.event.keyCode;
        //     console.log(key,vm.fullShow,'按键code')
        //     console.log()
        //     if (key == 27) {
        //          if(vm.fullShow){
        //               vm.fullSrceen();
        //          }
        //     }
        // };
        // console.log(document.getElementById('planeFigureBody'),'文件00');
        var body=document.getElementById('planeFigureBody');
        // console.log(window.innerHeight,'高度');
        body.style.height=(window.innerHeight-450)+'px';
        this.$refs.pic.Max_Select = 8;
        this.$refs.pic.Max_type = 2;
        
    },
    watch:{
        // fullShow:function(oldvalue,newvalue){
        //     this.fullSrceen();
        // },
        selectUgId:function(val){
            var vm=this;
             this.paramsLists='';
             this.picMark==false;
             this.drawItemId='';
            // vm.getDetectionSummary();
            vm.getMonitorMainTable();
            vm.ugCompany();
            vm.getBaseMapList();
            vm.getMonitorItem();
            vm.getTagList();
            vm.getAllMonitorPoint();
            vm.getDetectionDirectory();
            vm.getDetectionDirectorys();
            // vm.getBaseMapList();
           
            // vm.getBaseMapInfoByBaseMapId();
            // vm.getMonitorItem();
        },
        positionValue:function(val){
            var vm=this;
            // vm.getPositionList();
            // vm.getPositionUserCount();
        }
    },
    methods:{
        resizeHeight(){           
            var body=document.getElementById('planeFigureBody');
            if(body){
                 if(window.outerHeight>window.innerHeight){ //  正处于全屏
                    body.style.height=(window.innerHeight-450)+'px';
                }else{  
                    body.style.height=(window.innerHeight - 100)+'px';
                }
            }
        },
        //  resizeHeight1(){
        //     var body=document.getElementById('planeFigureBody');
        //     var body1=document.getElementById('planeFigure')
        //     body.style.height=(window.innerHeight-100)+'px';
        //     body1.style.marginTop='20px';
        // },

         callback(e){
            // console.log(e.data,'e.data.command');
            switch(e.data.command){
                // console.log()
                case "CurrentSelectedLabel":
                    {
                        var vm=this;
                        if(e.data.parameter.type=="Measure"){
                            // console.log(e.data.parameter.value.Tag.split(";")[0].split("=")[1],'Tag');
                            // console.log(e.data.parameter.value.Tag.split(";").length,'加油000');
                            if(e.data.parameter.value.Tag.split(";").length==1){
                                this.measureName=e.data.parameter.value.Tag.split(";")[0].split("=")[1]; //测点曲线名称
                                this.monitorPointInfo.forEach((item)=>{
                                    if(this.measureName==item.pointName){
                                       this.$message({
                                            type:'info',
                                            message:'当前不支持测点曲线'
                                        })
                                    }
                                })
                                
                            }else{
                             

                                this.measureName=e.data.parameter.value.Tag.split(";")[0].split("=")[1]; //判断测点曲线
                             

                                this.monitorPointInfo.forEach((item)=>{
                                    if(this.measureName==item.pointName){
                                        this.queryPointInfoByPointName(this.measureName);
                                        // this.measureId=item.id;
                                        // this.measureType=item.type;
                                        // console.log(this.measureId,this.measureType);
                                        // this.commonDetailShow=true;
                                    }
                                })
                            }
                        }
                    }
                break;
            }
        },
        queryPointInfoByPointName(val){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'/detectionInfo/queryPointInfoByPointName',
                params:{
                    pointName:val
                },
                headers:{
                    'token':vm.token
                }
            }).then((response)=>{
                if(response.data.cd=="0"){
                    var item=response.data.rt.monitorItem;
                    var val=response.data.rt.monitorPoint;
                    this.detail(item.keyword,item.id,item.type,item.name,item.baseMapId,0);
                    setTimeout(()=>{
                        if(this.$refs.commonDetailRef){
                            // console.log(vm.$refs.commonDetailRef,'this.$refs.commonDetailRef');
                            this.$refs.commonDetailRef.getCurve(val.id,val.name,item.type);
                     }

                    },200); 
                }
            })

        },
        loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'006','00604','/constructionSite/safetyInspection','00601','/constructionSite/safetyCheckings','00602','/constructionSite/safetyRuning','00603','/constructionSite/remoteVideo');
          
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
        //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        typeChange(val){
            this.selectTypeTagList=[];
            this.typeTagList.forEach((item)=>{
                if(item.type==val){
                    this.selectTypeTagList.push(item);
                }
            })
            this.typeTagValue=this.selectTypeTagList[0].value
           
        },

        getUserInfo(){
                var vm = this;
                vm.basePicEdit = false;
                vm.searchCheckEdit = false;
                vm.exportReportEdit = false;
                vm.editInspectWordEdit = false;
                vm.searchInspectDetailEdit = false;
                if(vm.projAuth.indexOf("00600801") > 0){
                    vm.basePicEdit = true
                }
                if(vm.projAuth.indexOf("00600901") > 0){
                    // alert('00600901')
                    vm.searchCheckEdit = true
                }
                if(vm.projAuth.indexOf("00601001") > 0){
                    vm.exportReportEdit = true
                }
                if(vm.projAuth.indexOf("00601101") > 0){
                    vm.editInspectWordEdit = true
                }
                if(vm.projAuth.indexOf("00601201") > 0){
                    vm.searchInspectDetailEdit = true
                }
                if(vm.projAuth.indexOf("00601204") > 0){
                    vm.importDataEdit = true
                }
                if(vm.projAuth.indexOf("00601202") > 0){
                    vm.manageEdit = true
                }
                // axios({
                //     method:'GET',
                //     url:vm.BDMSUrl+'project2/getOnlineInfo',
                //     params:{
                //         refresh:Math.random()/*IE11浏览器会默认从缓存里取数据*/
                //     },
                //     headers:{
                //         'accept':'application/json;charset=UTF-8',
                //         'token':vm.token,
                //     },
                // }).then((response)=>{
                //     var id = localStorage.getItem('projId');
                //     vm.projAuth1=response.data.rt.onlineInfo.projAuth[id];
                // })
        },
        // checkAuth(){
        //     var vm = this
        // },
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
        spotChangeLineCancle1(){
            this.spotChangeLineShow1=false;
        },
        pitchLineCancle(){
            this.pitchLineShow=false;
        },
        makeSureData1(){
            this.getAllCurve(this.getAllCurveId)
        },
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
            this.getAllCurveName=this.plotGroupName;
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
                    
                    this.startValue1='';
                    this.endValue1='';
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
        importDataShow(valShow,valid,valname,valtype,valKeyword){
            var vm=this;
          
            this.importGatherDataShow=valShow;
            vm.matchKeyWord=valKeyword;
            vm.monitorImportName=valname;
            vm.monitorImportType=valtype;
            vm.monitorImportId=valid;
            if(vm.monitorImportType==5){
                this.getPitchBaseInfo();
            }
          

        },
        timeMethod(val) {
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
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
                    this.getBaseMapInfoByBaseMapId();
                }
            })
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
        //当前时间
        curTime1(){
            var date = new Date();
           
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate()-1;
            var hours=date.getHours();
            var minutes=date.getMinutes();
            var second=date.getSeconds();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            if (hours < 10) {
                hours = "0" + day;
            }
            if (minutes < 10) {
                minutes = "0" + day;
            }
            if (second < 10) {
                second = "0" + day;
            }
             this.userValue = year + "-" + month + "-" + day+" "+"23:59:59" ;
           
        },

        handleSizeChange(val){
            
            this.monitorMainTableList1=[];
            this.pageSize=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.monitorMainTableListLength-1>=NumB&&this.monitorMainTableListLength-1<=NumE){
                NumE=this.monitorMainTableListLength-1;
            }
          
            for(var i=NumB;i<NumE+1;i++){
                this.monitorMainTableList1.push(this.monitorMainTableList[i])
            }
        },
        handleCurrentChange(val){
            this.monitorMainTableList1=[];
            this.pageNum=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.monitorMainTableListLength-1>=NumB&&this.monitorMainTableListLength-1<=NumE){
                NumE=this.monitorMainTableListLength-1;
            }
            for(var i=NumB;i<NumE+1;i++){
                this.monitorMainTableList1.push(this.monitorMainTableList[i])
            }
           
        },

        //起始测点编号触发

        //测点
        pointNameChange(){
            this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
        },
        //编号
        pointNumChange(){
            var reg = /[^0-9.]/g
            if(reg.test(this.pointNumValue)){
                // console.log('000');
                this.$message({
                    type:'info',
                    message:'请输入数字'
                })
            }
            // console.log(this.pointNameValue,this.pointNumValue,'测点编号');
            this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
        },
        add(val){
            var vm=this;
       
            if(this.picMarkName=="Select_img_Mark"){
                vm.spotPicInfoList.forEach((item)=>{
                        if(item.id+'img'==val.ID_out){
                            if(item.fileGroupId==null){
                                this.$message({
                                    type:'info',
                                    message:'该点位不存在图片,请删除重新上传'
                                })
                            }else{
                                window.open(vm.BDMSUrl+'/doc/download/'+item.fileGroupId,"_blank")
                                // window.open(vm.BDMSUrl+item.filePath,"_blank")
                            }
                        }
                    })
            }
        },
        //
        sendAlertMessage(){
            this.sendAlertMessageLoad=true;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/sendAlertMessage',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    userGroupId:this.selectUgId,
                    positionId:this.positionValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // sendAlertMessageShow
                    // this.alertMessage=response.data.rt;
                    this.sendAlertMessageShow=false;
                    this.$message({
                        type:"success",
                        message:'发送报警短信成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                this.sendAlertMessageLoad=false;
            })
        },
        positionChange(){
            this.positionList.forEach((item)=>{
                if(item.id==this.positionValue){
                    this.positionListName=item.posName;
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
                if(response.data.rt.length!=0){
                    this.alertMessage=response.data.rt[0];
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
                    this.positionListName=this.positionList[0].posName;
                    // this.positionListLength=response.data.rt.length;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取岗位用户数
        getPositionUserCount(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPositionUserCount',
                headers:{
                    'token':this.token
                },
                params:{
                    positionId:this.positionValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.positionListLength=response.data.rt;
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
                    this.drawItemTagType=item.sign; //这个是类型标记，一共有20种，分别有编号。
                    // this.pointNameValue=item.logogram;
                    // this.pointNumValue='01';
                    this.getMaxPointNameByItemId(this.drawItemId,item.logogram,'01');
                    this.drawItemName=item
                }
            })
            this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
            if(this.isClick1==true){
                this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemTagType,this.drawItemId,1);
            }else if(this.isClick2==true){
                this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemTagType,this.drawItemId,2);
            }
        },
        picView_status_changed(status,list,move,deleteValue){
        //    console.log(status,list,move,deleteValue,'list点中')
            this.listLength=list.length;
            // this.bindMorePoint=status;
            // if(this.listLength==1){
            //     this.isBindPoint=true;
            // }else{
            //     this.isBindPoint=false;
            // }
            if(status==true){

               
            

                this.pointId=list[0].ID_out;
                this.toolShow=status;
                this.broken=list[0].isBroken;
                this.alert=list[0].isAlert;
                this.pointIds=[];
                this.selectpointGroupIds=[];
                this.pointIdName=[];
                this.picMarkName=list[0].type;
               
                if(this.picMarkName!="Select_img_Mark"){
                        this.plotGroup=list[0].pointGroupData;
                        this.plotGroupOne=list[0].pointGroupData[0].id;
                        this.plotGroupName=list[0].pointGroupData[0].name;
                        this.plotGroupType=list[0].pointGroupData[0].itemType;
                        list.forEach((item)=>{
                            this.pointIds.push(item.ID_out);
                            this.pointIdName.push(item.pointName);
                            this.selectpointGroupIds.push(item.pointGroupData[0].id);
                        
                        })
                        this.bindMorePoint=status;
                        if(this.listLength==1){
                            this.isBindPoint=true;
                        }else{
                            this.isBindPoint=false;
                        }

                         if(this.editSpotShow==false){
                            if(this.plotGroupType==5){
                                this.getPitchDetailDataBySeqId(this.plotGroupOne);
                            }else{
                                this.getAllCurve(this.plotGroupOne)
                            } 
                        }
                }
               
                if(this.picMarkName=="Select_img_Mark"){
                    // this.editSpotShow=status;
                    this.photoIdList=list[0].ID_out.replace("img","");
                }
                // if(this.editSpotShow==false){
                //     if(this.plotGroupType==5){
                //         this.getPitchDetailDataBySeqId(this.plotGroupOne);
                //     }else{
                //         this.getAllCurve(this.plotGroupOne)
                //     } 
                // }
                if(move=='move'){
                    this.moveClick=true;
                }else{
                    this.moveClick=false;
                }
                if(deleteValue=='delete'){
                    this.deleteDraw()
                }

            }
        },
        timeChangeMethod1(val) {
            return moment(val).format("YYYY/MM/DD");
        },

        //多点对比
        moreSpotLine(){
             var vm=this;
             if(this.listLength<2){
                 this.$message({
                     type:'info',
                     message:'请选择多于一个点位'
                 })
             }else{
                   
                    this.acquisitionTimeXlist=[];
                    this.elevationYlist=[];
                    this.startValue='';
                    this.endValue='';
                    if(this.selectValue){
                        this.startValue=this.selectValue[0];
                        this.endValue=this.selectValue[1];
                    }
                    axios({
                        method:'post',
                        url:vm.BDMSUrl+'detectionInfo/getMonitorPointChartData',
                        headers:{
                            'token':vm.token
                        },
                        data:vm.selectpointGroupIds,
                        params:{
                            d1:this.startValue,
                            d2:this.endValue
                        }
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            var chartDataLength=response.data.rt;
                            var f=chartDataLength.forceData.length;
                            var g=chartDataLength.gaugeData.length;
                            var h=chartDataLength.horizontalShiftData.length;
                            var v=chartDataLength.verticalShiftData.length;
                            var fList=chartDataLength.forceData;
                            var gList=chartDataLength.gaugeData;
                            var hList=chartDataLength.horizontalShiftData;
                            var vList=chartDataLength.verticalShiftData;
                            var lastMonth = [];
                            for(var i = 0;i<30;i++){
                                    lastMonth.unshift(new Date(new Date().setDate(new Date().getDate()-i)).toLocaleString().substring(0,10))
                                    // lastMonth[i]=Number(lastMonth[i])
                            }
                            // for(i=0;i<lastMonth.length;i++){
                            //     lastMonth[i]=Number(lastMonth[i])
                            // }
                            // console.log(lastMonth,'lastMonth')
                           
                            for(let j=0; j<vList.length;j++){
                                if(vList[j].list.length < 30){
                                    let index = 30-vList[j].list.length;
                                    
                                    for(let i = 0 ; i < index; i++){
                                        
                                        vList[j].list.push({acquisitionTime:null,elevation:null})
                                    }
                                }else{
                                    vList[j].list=vList[j].list.slice(0,30)
                                }
                                for(let a=0;a<30;a++){
                                     vList[j].list[a].acquisitionTime=lastMonth[a]
                                }
                            }
                            for(let j=0; j<hList.length;j++){
                                if(hList[j].list.length < 30){
                                    let index = 30-hList[j].list.length;
                                    
                                    for(let i = 0 ; i < index; i++){
                                        
                                        hList[j].list.push({acquisitionTime:null,shiftDistance:null})
                                    }
                                }else{
                                    hList[j].list=hList[j].list.slice(0,30)
                                }
                                for(let a=0;a<30;a++){
                                     hList[j].list[a].acquisitionTime=lastMonth[a]
                                }
                            }
                            for(let j=0; j<gList.length;j++){
                                if(gList[j].list.length < 30){
                                    let index = 30-gList[j].list.length;
                                   
                                    for(let i = 0 ; i < index; i++){
                                       
                                        gList[j].list.push({acquisitionTime:null,gaugeHeight:null})
                                    }
                                }else{
                                     gList[j].list=gList[j].list.slice(0,30)
                                }
                                for(let a=0;a<30;a++){
                                     gList[j].list[a].acquisitionTime=lastMonth[a]
                                }
                            }
                            for(let j=0; j<fList.length;j++){
                                if(fList[j].list.length < 30){
                                    let index = 30-fList[j].list.length;
                                  
                                    for(let i = 0 ; i < index; i++){
                                        
                                        fList[j].list.push({acquisitionTime:null,force:null})
                                    }
                                }else{
                                        fList[j].list=fList[j].list.slice(0,30)
                                }
                            
                                for(let a=0;a<30;a++){
                                     fList[j].list[a].acquisitionTime=lastMonth[a]
                                }
                            }
                          
                           
                            //两种监测类型对比，有6种情况
                            if((f!=0&&g!=0)||(f!=0&&h!=0)||(f!=0&&v!=0)||(g!=0&&v!=0)||(g!=0&&h!=0)||(v!=0&&h!=0)){
                                this.typeSpotShow=false;
                               
                                {
                                    if((f!=0&&g!=0)){
                                       
                                        this.moreTypeSpotList1=fList;
                                        this.moreTypeSpotList2=gList;
                                
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.force)
                                            })
                                        })
                                     
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.gaugeHeight)
                                            })
                                       
                                        })
                                    }else if(f!=0&&h!=0){
                                        this.moreTypeSpotList1=fList;
                                        this.moreTypeSpotList2=hList;
                                      
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.force)
                                            })
                                        })
                                   
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.shiftDistance)
                                            })
                                 
                                        })
                                    }else if(f!=0&&v!=0){
                                        this.moreTypeSpotList1=fList;
                                        this.moreTypeSpotList2=vList;
                                      
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.force)
                                            })
                                        })
                                     
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.elevation)
                                            })
                                    
                                        })
                                    }else if(g!=0&&v!=0){
                                        this.moreTypeSpotList1=gList;
                                        this.moreTypeSpotList2=vList;
                                    
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.gaugeHeight)
                                            })
                                        })
                                    
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.elevation)
                                            })
                                     
                                        })
                                    }else if(g!=0&&h!=0){
                                        this.moreTypeSpotList1=gList;
                                        this.moreTypeSpotList2=hList;
                                  
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.gaugeHeight)
                                            })
                                        })
                               
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.shiftDistance)
                                            })
                                     
                                        })
                                    }else if(v!=0&&h!=0){
                                        this.moreTypeSpotList1=vList;
                                        this.moreTypeSpotList2=hList;
                      
                                        this.moreTypeSpotList1.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X1List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y1List.push(item1.elevation)
                                            })
                                        })
                                
                                        this.moreTypeSpotList2.forEach((item)=>{
                                            item.list.forEach((item1)=>{
                                                this.X2List.push(this.timeChangeMethod(item1.acquisitionTime))
                                                this.Y2List.push(item1.shiftDistance)
                                            })
                                   
                                        })
                                    }
                                }
                                {
                                    var x1Length=this.X1List.length;
                                
                                 
                                    var x1=x1Length/this.moreTypeSpotList1.length;
                                    var x2Length=this.X2List.length;
                                    
                                    var x2=x2Length/this.moreTypeSpotList2.length;
                                    this.moreTypeSpotList1Length=this.moreTypeSpotList1.length;
                                    this.moreTypeSpotList2Length=this.moreTypeSpotList2.length;
                               
                                    this.moreSpotShow=true;
                                    var yLeft1=[];
                                    var yLeft2=[];
                                    var yLeft3=[];
                                    var yLeft4=[];
                                    var yLeft5=[];
                                    var yLeft6=[];
                                    var yLeft7=[];
                                    var yLeft8=[];
                                    var yRight1=[];
                                    var yRight2=[];
                                    var yRight3=[];
                                    var yRight4=[];
                                    var yRight5=[];
                                    var yRight6=[];
                                    var yRight7=[];
                                    var yRight8=[];
                                    //左边的数据
                                    for(let a1=0;a1<x1;a1++){
                                        yLeft1.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1;a1<x1*2;a1++){
                                        yLeft2.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*2;a1<x1*3;a1++){
                                        yLeft3.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*3;a1<x1*4;a1++){
                                        yLeft4.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*4;a1<x1*5;a1++){
                                        yLeft5.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*5;a1<x1*6;a1++){
                                        yLeft6.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*6;a1<x1*7;a1++){
                                        yLeft7.push(this.Y1List[a1])
                                    }
                                    for(let a1=x1*7;a1<x1*8;a1++){
                                        yLeft8.push(this.Y1List[a1])
                                    }
                                    //右边的数据
                                    for(let a2=0;a2<x2;a2++){
                                        yRight1.push(this.Y2List[a2])
                                    }
                                    for(let a2=x2;a2<x2*2;a2++){
                                        yRight2.push(this.Y2List[a2])
                                    }
                                    for(let a2=x2*2;a2<x2*3;a2++){
                                        yRight3.push(this.Y2List[a2])
                                    }
                                    for(let a2=x2*3;a2<x2*4;a2++){
                                        yRight4.push(this.Y2List[a2])
                                    }
                                    for(let a2=x2*4;a2<x2*5;a2++){
                                        yRight5.push(this.Y2List[a2])
                                    }
                                     for(let a2=x2*5;a2<x2*6;a2++){
                                        yRight6.push(this.Y2List[a2])
                                    }
                                     for(let a2=x2*6;a2<x2*7;a2++){
                                        yRight7.push(this.Y2List[a2])
                                    }
                                     for(let a2=x2*7;a2<x2*8;a2++){
                                        yRight8.push(this.Y2List[a2])
                                    }
                      
                                }
                                {
                                    setTimeout(()=>{
                                        if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==3){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                             spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==4){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==5){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==6){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight6,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==1&&this.moreTypeSpotList2Length==7){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight6,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight7,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==3){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==4){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==5){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==2&&this.moreTypeSpotList2Length==6){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight6,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==3&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==3&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==3&&this.moreTypeSpotList2Length==3){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==3&&this.moreTypeSpotList2Length==4){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==3&&this.moreTypeSpotList2Length==5){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight5,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==4&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==4&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==4&&this.moreTypeSpotList2Length==3){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==4&&this.moreTypeSpotList2Length==4){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight3,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==5&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==5&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==5&&this.moreTypeSpotList2Length==3){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight2,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==6&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yLeft6});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==6&&this.moreTypeSpotList2Length==2){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yLeft6});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yRight1,yAxis:1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }else if(this.moreTypeSpotList1Length==7&&this.moreTypeSpotList2Length==1){
                                            let spotTypeChangeChart=this.$refs.spotTypeChange;
                                            spotTypeChangeChart.delegateMethod('showLoading', 'Loading...');
                                            spotTypeChangeChart.removeSeries();
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[0],data:yLeft1});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yLeft2});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[2],data:yLeft3});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[3],data:yLeft4});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[4],data:yLeft5});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[5],data:yLeft6});
                                             spotTypeChangeChart.addSeries({name:this.pointIdName[6],data:yLeft7});
                                            spotTypeChangeChart.addSeries({name:this.pointIdName[7],data:yRight1,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight2,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight3,yAxis:1});
                                            // spotTypeChangeChart.addSeries({name:this.pointIdName[1],data:yRight4,yAxis:1});
                                            spotTypeChangeChart.hideLoading();
                                            // spotTypeChangeChart.getChart().yAxis[0].setTitle({text:'位移'})
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:this.X2List});
                                            // spotTypeChangeChart.getChart().xAxis[0].update({categories:xShow});
                                            spotTypeChangeChart.getChart().xAxis[0].update({categories:lastMonth});
                                        }
                                    },200)
                                }
                            }
                            else{
                                    this.typeSpotShow=true;
                                    {
                                        if(response.data.rt.forceData.length!=0){
                                            this.moreSpotLineList=response.data.rt.forceData;
                                            this.moreSpotLineListLength=response.data.rt.forceData.length;
                                            this.moreSpotLineList.forEach((item)=>{
                                                item.list.forEach((item1)=>{
                                                    this.acquisitionTimeXlist.push(this.timeChangeMethod(item1.acquisitionTime))
                                                        this.elevationYlist.push(item1.force)
                                                })
                                            })
                                        }else if(response.data.rt.verticalShiftData.length!=0){
                                            this.moreSpotLineList=response.data.rt.verticalShiftData;
                                            this.moreSpotLineListLength=response.data.rt.verticalShiftData.length;
                                            this.moreSpotLineList.forEach((item)=>{
                                                item.list.forEach((item1)=>{
                                                    this.acquisitionTimeXlist.push(this.timeChangeMethod(item1.acquisitionTime))
                                                        this.elevationYlist.push(item1.elevation)
                                                })
                                            })
                                        }else if(response.data.rt.gaugeData.length!=0){
                                            this.moreSpotLineList=response.data.rt.gaugeData;
                                            this.moreSpotLineListLength=response.data.rt.gaugeData.length;
                                            this.moreSpotLineList.forEach((item)=>{
                                                item.list.forEach((item1)=>{
                                                    this.acquisitionTimeXlist.push(this.timeChangeMethod(item1.acquisitionTime))
                                                        this.elevationYlist.push(item1.gaugeHeight)
                                                })
                                            })
                                        }else if(response.data.rt.horizontalShiftData.length!=0){
                                            this.moreSpotLineList=response.data.rt.horizontalShiftData;
                                            this.moreSpotLineListLength=response.data.rt.horizontalShiftData.length;
                                            this.moreSpotLineList.forEach((item)=>{
                                                item.list.forEach((item1)=>{
                                                    this.acquisitionTimeXlist.push(this.timeChangeMethod(item1.acquisitionTime))
                                                        this.elevationYlist.push(item1.shiftDistance)
                                                })
                                            })
                                        }
                                    }
                                    {
                                        var xLength=this.acquisitionTimeXlist.length;
                                        var x=xLength/this.moreSpotLineListLength;
                                  
                                        var xShow=[];
                                        for(var i=0;i<x;i++){
                                            xShow.push(this.acquisitionTimeXlist[i])
                                        }
                                      
                                        var min=this.getMinValue(this.elevationYlist);
                                        var max=this.getMaxValue(this.elevationYlist)
                                        var middle=(min+max)/2;
                                      
                                        this.optionMoreSpotChangeLine.yAxis.min=(3*min-2*max);
                                        this.optionMoreSpotChangeLine.yAxis.max=(3*max-2*min);
                                        this.moreSpotShow=true;
                                        this.spotChangeLineShow=true;

                                        //改地方就做了两个点位对比，存在唯一性，还没找到规律性方法
                                        var yShow1=[];
                                        var yShow2=[];
                                        var yShow3=[];
                                        var yShow4=[];
                                        var yShow5=[];
                                        var yShow6=[];
                                        var yShow7=[];
                                        var yShow8=[];
                                        for(let a1=0;a1<x;a1++){
                                            yShow1.push(this.elevationYlist[a1])
                                        }
                                        for(let a2=x;a2<x*2;a2++){
                                            yShow2.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*2;a2<x*3;a2++){
                                            yShow3.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*3;a2<x*4;a2++){
                                            yShow4.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*4;a2<x*5;a2++){
                                            yShow5.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*5;a2<x*6;a2++){
                                            yShow6.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*6;a2<x*7;a2++){
                                            yShow7.push(this.elevationYlist[a2])
                                        }
                                        for(let a2=x*7;a2<x*8;a2++){
                                            yShow8.push(this.elevationYlist[a2])
                                        }
                                    }
                                        setTimeout(()=>{
                                            if(this.moreSpotLineListLength==2){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().yAxis[0].setTitle({text:'位移'})
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==3){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==4){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[3],data:yShow4});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==5){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[3],data:yShow4});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[4],data:yShow5});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==6){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[3],data:yShow4});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[4],data:yShow5});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[5],data:yShow6});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==7){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[3],data:yShow4});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[4],data:yShow5});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[5],data:yShow6});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[6],data:yShow7});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }else if(this.moreSpotLineListLength==8){
                                                let spotChangeLineChart=this.$refs.spotChangeLine;
                                                spotChangeLineChart.delegateMethod('showLoading', 'Loading...');
                                                spotChangeLineChart.removeSeries();
                                                spotChangeLineChart.addSeries({name:this.pointIdName[0],data:yShow1});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[1],data:yShow2});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[2],data:yShow3});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[3],data:yShow4});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[4],data:yShow5});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[5],data:yShow6});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[6],data:yShow7});
                                                spotChangeLineChart.addSeries({name:this.pointIdName[7],data:yShow8});
                                                spotChangeLineChart.hideLoading();
                                                spotChangeLineChart.getChart().xAxis[0].update({categories:xShow});
                                            }
                                        },200)
                            }
                        }
                    })
            }


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
         timeChangeMethod(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("MM-DD");
            }
        },
        timeChangeMethodPitch(val){
             if (val == null) {
                return '/';
            } else {
                return moment(val).format("MM-DD HH:mm");
            }

        },
        moreSpotCancle(){
            this.moreSpotShow=false;
        },
        makeSureData(){
            this.moreSpotLine();
        },
        drawFinish(){
            var vm=this;
       
        
            if(this.setSpotPicShow==true){
                // this.uploadshow=true;
                this.spotPicInfo=[];
                var list1 = this.$refs.pic.saveList();
             
                this.spotPicInfo.push({
                    "coordinateInfo":JSON.stringify(list1.pop()),
                    "operationType":1,
                    "photoId":this.photoId,
                });
               
                    axios({
                        method:'post',
                        url:vm.BDMSUrl+'detectionInfo/editPhotoTag',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                           userGroupId:vm.selectUgId
                        },
                        data:this.spotPicInfo
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.uploadshow=true;
                        this.getTagList();
                    }
                })
            }
        },

        //获取图片列表
         getTagList(){
             var vm=this;
              var olist=[];
            //   this.monitorPointInfo=[];
            //   this.getAllMonitorPoint();
             axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/getTagList',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId
                },
            }).then((response)=>{
                if(response.data.rt.length!=0){
                    this.spotPicInfoList=response.data.rt;
                     this.photoId=this.spotPicInfoList[this.spotPicInfoList.length-1].id;
                     
                    this.spotPicInfoList.forEach((item)=>{
                        olist.push(
                            {
                                'id':item.id+'img',
                                'plotInfo':JSON.parse(item.coordinateInfo).plotInfo,
                                'filePath':item.filePath,
                                'baseMapId':item.baseMapId,
                                'photoId':item.id,
                            }
                        )
                    })
                    olist.forEach((item)=>{
                        //  this.$set(item,'')
                        this.monitorPointInfo.push(item)
                    })
                   console.log(this.monitorPointInfo,'this.monitorPointInfo000');
                   this.isClick6=false;
                    vm.$refs.pic.loadPoints(this.monitorPointInfo);
                    this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
                }
            })
        },
        walkThroughBtn(){
            var vm=this;
            vm.walkThroughShow=true;

        },
        exportrEportsBtn(){
            this.exportrEportsShow=true;
            this.getReportSetting();
            this.generateReportNumber();
        },
        exportrEportsCancle(){
            this.pageSelect='';
            this.priorityLayout='';
            this.suggestList='';
            this.showBaseImg=false;
            this.coverChecked=false;
            this.optimalLayout=false;
            this.spotChecked=false;
            this.summaryChecked=false;
            this.coverPathUrl='';
            this.exportrEportsShow=false;
        },
        backToH(){
            var vm=this;
            
            vm.pitchDetailShow=false;
            vm.walkThroughShow=false;
            vm.commonDetailShow=false;
            vm.displaySpotNum=false;
            this.picMark=false;
            // vm.pageSize=10;
            // vm.pageNum1=2;
            vm.currentPage1=1;
            // vm.getDetectionSummary();
            vm.resizeHeight();
            vm.getMonitorMainTable();
            vm.ugCompany();
            vm.getMonitorItem();
            vm.getBaseMapList();
            // vm.getAllMonitorPoint();

            //  vm.getDetectionSummary();
            // vm.getMonitorMainTable();
            // vm.ugCompany();
           
            // vm.getMonitorItem();
        },
        //获取可用的群组
        getAccessUserGroup(){
            axios({
                method:'post',
                // url:this.BDMSUrl+'detectionInfo/getAccessUserGroup',
                url:this.BDMSUrl+'userGroup/getUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                },
                
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.ugList=response.data.rt;
                        this.selectUgId=this.ugList[0].groupId;
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
                  
                        this.weatherJson=JSON.parse(this.detectionSummaryList.weatherJson);
                        this.weatherIcon=this.weatherJson.data[0].wea;
                        this.weatherAir=this.weatherJson.data[0].tem1;
                        this.weatherTime=this.weatherJson.data[0].date+this.weatherJson.data[0].week;
                        this.recentAlertAmount=this.alertPointAmount.recentAlertAmount;
                        this.totalAlertAmount=this.alertPointAmount.totalAlertAmount;
                       
                        var recentData=[];
                        var totalData=[];
                        var legendData='';
                        var legendAllData='';
                        var conditionData=[];//监测工况综述
                        recentData.push(
                            {
                            name:'报警'+this.alertPointAmount.recentAlertAmount,
                            value:this.alertPointAmount.recentAlertAmount
                            },{
                                name:'总数'+this.alertPointAmount.allAmount,
                                value:this.alertPointAmount.allAmount
                            }
                        );
                        legendData='报警'+this.alertPointAmount.recentAlertAmount;
                        legendAllData='总数'+this.alertPointAmount.allAmount;
                        totalData.push(
                            {
                            name:'报警'+this.alertPointAmount.totalAlertAmount,
                            value:this.alertPointAmount.totalAlertAmount
                            },
                            {
                                name:'总数'+this.alertPointAmount.allAmount,
                                value:this.alertPointAmount.allAmount
                                
                            }
                        );
                        conditionData.push(
                            this.condition.days,this.condition.acAmount
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
                                data:['报警'+this.recentAlertAmount,'总数'+this.alertPointAmount.allAmount]
                            },
                            color:['#ff634d','#dcdcdc'],
                            series : [
                                {
                                    name: '本次变化量报警点位分布',
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
                                data:['报警'+this.alertPointAmount.totalAlertAmount,'总数'+this.alertPointAmount.allAmount]
                            },
                            color:['#ffaa25','#dcdcdc'],
                            series : [
                                {
                                    name: '本次变化量报警点位分布',
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
                                            barMinHeight:10,  //最小柱高
                                            barMaxHeight:100,//最大柱高
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
            // var str='';

            if(val=="阴转小雨"||val=="阴"||val.indexOf("阴")==0){
                return  require('./images/sunnyandcloudy.png')
            }else if(val=="多云"){
                return  require('./images/cloudy.png')
            }else if(val=="多云转阴"||val=="阴转多云"){
                return  require('./images/sunnyandcloudy.png')
            }else if(val=="晴"||val=="晴转多云"||val=="多云转晴"||val.indexOf("晴")==0){
                return  require('./images/sunny.png')
            }else if(val=="小雨"||val=="小雨转阴"||val=="小雨转晴"||val.indexOf("小雨")==0){
                return  require('./images/lightrain.png')
            }else if(val=="大雨"||val=="小雨转中雨"||val=="中雨"||val=="中雨转多云"||val.indexOf("中雨")==0){
                return  require('./images/heavyrain.png')
            }else if(val=="多云转小雨"||val=="小雨转多云"){
                return  require('./images/sunnyandcloudy.png')
            }
        },
        //编辑点位
        editSpot(){
            var vm=this;
            this.editSpotShow=true;
            this.isBindPoint=false;
            this.bindMorePoint=false;
            this.$refs.pic.Max_Select = 1000000;
            this.$refs.pic.Max_type = 1000000;
            this.$refs.pic.setMoveStatus(true);
            // this.isClick=true;
        },
        returnData(array){
            let plotInfo=[];
            let pointGroupIds=[];
            array.forEach((item)=>{
                plotInfo.push(item.plotInfo);
                pointGroupIds.push(item.pointGroupIds);
            })
             let currentList={
                'itemId':array[0].itemId,
                'plotInfos':plotInfo,
                'pointGroupIds':pointGroupIds,
                'prefix':array[0].prefix,
                'startNo':array[0].startNo
            };
            return currentList;
        },
        //绑定点位
        bindPoint(){
             this.bindInspectContentShow=true;
            // this.$confirm('该点位是否需要绑定？', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'info'
            // }).then(()=>{


            // })
           

        },
        //编辑点位编号
        editPointNum(){
            this.getPointByPointGroupIds(this.pointId);
        },
        saveDraw(){
            var vm=this;
            this.editSpotShow=false;
           this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            var alist=[];
            var blist=[];
            var clist=[];
            var dlist=[];
            var elist=[];
            var map=new Map();
            var list = this.$refs.pic.saveList();
            
            // var list1=this.
            if(this.moveClick==false){
                     list.forEach((item)=>{
                        vm.$set(item,'pointGroupIds',null);
                    })
                    list.forEach((item,index,array)=>{
                        if(item.id.length==undefined){
                            alist.push(item)
                            if(item.drawMaxCount==1){
                                blist.push({
                                    'itemId':item.itemId,
                                    'plotInfos':[item.plotInfo],
                                    'pointGroupIds':[item.pointGroupIds],
                                    'prefix':item.prefix,
                                    'startNo':item.startNo,
                                    'seqId':'',
                                });
                            }else if(item.drawMaxCount==2){
                                clist.push(item)
                            }

                        }
                    })
                    for(var i=0;i < clist.length;i++){
                        var itemId=clist[i].itemId;
                        if(!map.has(itemId)){
                            var array=new Array();
                            array.push(clist[i]);
                            map.set(itemId,array)
                        }else{
                            var array= map.get(itemId);
                            array.push(clist[i]);
                            map.set(itemId,array);
                        }
                    }
                   
                    var a='';
                    var b=[];
                    map.forEach((value, key, mapObject)=>{
                        a=this.returnData(value);
                        b.push(a);
                    })
                
                    dlist=blist.concat(b);
                  
                    if(this.alist==[]){
                        this.editSpotShow=false;
                    }else if(this.alist!=[]){
                        axios({
                            url:this.BDMSUrl+'detectionInfo/addOrBindMonitorPoint',
                            method:'POST',
                            headers:{
                                'token':vm.token
                            },
                            params:{
                                baseMapId:vm.monitorBaseMapId,
                            },
                            data:dlist
                            // infos:blist,
                        }).then((response)=>{
                        if(response.data.cd=='0'){
                                    this.$message({
                                        type:'success',
                                        message:'保存监测点成功'
                                    })
                                    this.$refs.pic.setDrawCancel();
                                    this.getMonitorMainTable();
                                    this.getAllMonitorPoint();
                                    if(this.picMark==true){
                                        setTimeout(()=>{
                                                this.getTagList();
                                            },400)
                                        }
                                        this.startpointShow=false;
                                        this.isBindPoint=false;
                                        this.bindMorePoint=false;
                                }else if(response.data.cd=='-1'){
                                
                                    this.$message({
                                        type:'error',
                                        message:response.data.msg
                                    })
                                }
                        })
                    }
            }else if(this.moveClick==true){
                this.pointIds.forEach((item)=>{
                    list.forEach((item1)=>{
                         if(item==item1.id){
                             elist.push({
                                 'id':item1.id,
                                 'plotInfo':item1.plotInfo
                             })
                         }
                    })
                })
               
                axios({
                    url:this.BDMSUrl+'detectionInfo/updatePointGroupPosition',
                    method:'post',
                    headers:{
                        'token':vm.token
                    },
                    data:elist
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.$refs.pic.setDrawCancel();
                        this.getMonitorMainTable();
                        this.getAllMonitorPoint();
                        if(this.picMark==true){
                            setTimeout(()=>{
                                    this.getTagList();
                                },400)
                            }
                    }
                })
            }
           
            this.$refs.pic.setMoveStatus(false);

        },
        cancleAll(){
            this.editSpotShow=false;
            this.$refs.pic.setDrawCancel();
            this.getAllMonitorPoint();
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=false;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            this.moveClick=false;
            this.pointNameValue='';
            this.pointNumValue='';
              this.$refs.pic.Max_Select = 8;
            this.$refs.pic.Max_type = 2;
            this.startpointShow=false;
            this.isBindPoint=false;
            this.bindMorePoint=false;
            this.$refs.pic.setMoveStatus(false);

        },
        checkboxChange(data){

            for(let i = 0; i < this.monitorMainItemList.length;i++){
                this.$refs.pic.enableType(this.monitorMainItemList[i].type,this.monitorMainItemList[i].sign,this.monitorMainItemList[i].spotNum,this.monitorMainItemList[i].id);
            }
        },
        checkChange(){
        
        },
        displaySpot(){
            this.$refs.pic.enableLabel(this.displaySpotNum);
        },
        //显示图片标记
        picShowMark(){
            // this.monitorPointInfo='';
            if(this.picMark==true){
                this.getTagList();
            }else if(this.picMark==false){
                this.getAllMonitorPoint();
            }
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
            vm.fileListName=list[0].name.replace(/\s*/g,"");
            // var returnUrl = vm.BDMSUrl+'detectionInfo/addBaseMap?userGroupId='+vm.selectUgId+'&name='+vm.fileListName+'&pageNo='+vm.pageNo;
            // returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            // formData.append('token',vm.token);
            // formData.append('projId',vm.projId);
            // formData.append('type',1);
            formData.append('file',vm.fileList);
            // formData.append('userId',vm.userId);
            // formData.append('modelCode','006');
            // formData.append('returnUrl',returnUrl);
            axios({
                    method:'POST',
                    // url:vm.QJFileManageSystemURL+ 'uploading/uploadFileInfo',
                    url:vm.BDMSUrl+'detectionInfo/addBaseMap',
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'token':vm.token
                    },
                    params:{
                        userGroupId:vm.selectUgId,
                        name:vm.fileListName,
                        pageNo:vm.pageNo
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
                    document.getElementById('drawingsInfo').value='';
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
                    this.monitorBaseMapId='';
                    this.paramsLists='';

                }
            })
        },
        //点击获取底图列表
        getBaseMapListBtn(){
            this.baseMapShow=true;
            this.isClick0=true;
            // this.isClick=true;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.moveClick=false;
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
                    //判断是否使用当前图纸
                    // if(!this.curBaseMapUrl){
                    this.baseMapList.forEach((item)=>{
                            if(item.isUsed==1){
                                // this.BDMSUrl+
                                this.curBaseMapUrl=item.relativeUri;
                                this.monitorBaseMapId=item.id;
                                // this.scaleValue=item.zoom;
                                this.getBaseMapInfoByBaseMapId();
                                this.getAllMonitorPoint();

                            }
                        })

                    // console.log(this.baseMapList,'this.baseMapList000');
                    // }
                    // if(this.monitorBaseMapId){
                    //     this.baseMapList.forEach((item)=>{
                    //         if(item.id==this.monitorBaseMapId){
                    //             this.curBaseMapUrl=item.relativeUri;
                    //         }
                    //     })
                    // }
                    // var a=vm.curBaseMapUrl.substr(vm.curBaseMapUrl.length-3);
                // this.paramsLists={type:vm.curBaseMapUrl.substr(vm.curBaseMapUrl.length-3),source:vm.QJFileManageSystemURL+vm.curBaseMapUrl,angle:0}
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        msg:response.data.msg
                    })
                }
            })
        },
        //放大
        bigRotate(){
            this.$refs.pic.size_big()

        },
        smallRotate(){
             this.$refs.pic.size_small()
        },
        //图纸工具栏操作
        zuoRotate(){
                this.$refs.pic.rotation(this.$refs.pic.angle - 90);
                this.rotate = this.$refs.pic.angle;
                this.updateBaseMapRotate();
        },
        youRotate(){
                this.$refs.pic.rotation(this.$refs.pic.angle + 90);
                this.rotate = this.$refs.pic.angle;
                this.updateBaseMapRotate();
        },
        //更新底图旋转信息
        updateBaseMapRotate(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/updateBaseMapRotate',
                headers:{
                    'token':vm.token
                },
                params:{
                   baseMapId:vm.monitorBaseMapId,
                   rotate:vm.rotate
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getBaseMapInfoByBaseMapId();
                    // this.getBaseMapList()
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        message:response.data.msg
                    })
                }
            })
        },
        //根据底图ID获取底图信息
        getBaseMapInfoByBaseMapId(){
            var vm=this;
            this.angle=0;
            this.paramsLists='';
            // 
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
                    this.scaleValue=this.getBaseMapInfoByBaseMapIdList.zoom;
                    if(this.angle==null){
                        this.angle=0;
                    }
                    
                    var type=(this.getBaseMapInfoByBaseMapIdList.name.substr(this.getBaseMapInfoByBaseMapIdList.name.length-3)).toString();
                    // console.log(vm.BDMSUrl+this.getBaseMapInfoByBaseMapIdList.relativeUri,'pic');
        
                    this.paramsLists={type:type,source:vm.BDMSUrl+this.getBaseMapInfoByBaseMapIdList.relativeUri,angle:this.angle}
                    // this.paramsLists={type:type,source:'file:///D:/files/A1.pdf',angle:this.angle}
                   
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:"error",
                        message:response.data.msg
                    })
                }
            })
        },
        //取消底图列表
        baseMapCancle(){
            this.baseMapShow=false;
            this.isClick=false;
            this.isClick0=false;

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
                }else if(response.data.cd=='-1'){
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
            vm.typeChange(vm.monitorType);
            this.getDetectionDirectorys();
        },
        //配置监测目录
        configureMonitorItemBtn(){
            var vm=this;
            vm.configureContentShow=true;
            this.getDetectionDirectory();
            this.getDetectionDirectorys();
        },
        clickIcon(data){
            if(data.children.length>0&&data.children){
                data.disabled=!data.disabled
            }
            // this.flodShow=!this.flodShow;
            // this.clickId=data;
        },
        //获取监测
        getDetectionDirectoryListL(val){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getDetectionDirectory',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getDetectionDirectoryListLeft=response.data.rt;
                    if(this.getDetectionDirectoryListLeft.length==0){
                        this.getDetectionDirectoryListLeft.push({
                            'disabled': false,
                            'id':'',
                            'name': "",
                            'userGroupId':'',
                            'children':[]
                        })
                    }

                    this.getDetectionDirectoryListLeft.forEach((item)=>{
                        vm.$set(item,'disabled',false);
                        var a=[]
                         val.forEach((item1)=>{
                             if(item.id==item1.directoryId){
                                    a.push(item1);
                                }else if(item1.directoryId==null){
                                    this.$set(item1,'children',[]);
                                    vm.$set(item1,'disabled1',true);
                                    this.getDetectionDirectoryListLeft.push(item1);
                                }
                                vm.$set(item,'children',a)
                             })
                    })
                    this.getDetectionDirectoryListLeft=Array.from(new Set(this.getDetectionDirectoryListLeft))
                   
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })

        },

        //获取监测目录
        getDetectionDirectory(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getDetectionDirectory',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getDetectionDirectoryList=response.data.rt;
                   
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },

        getDetectionDirectorys(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getDetectionDirectory',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getDetectionDirectoryLists=response.data.rt;
                    this.getDetectionDirectoryLists.unshift({
                        id:null,
                        name:'无',
                        userGroupId:vm.selectUgId
                    })
                    
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },

        //取消监测目录
        configContentCancle(){
            var vm=this;
             vm.configureContentShow=false;
        },
        //新增目录
        addContent(){
            this.addContentShow=true;

        },
        addContentMakeSure(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/createDetectionDirectory',
                headers:{
                    'token':vm.token
                },
                params:{
                    name:vm.contentName,
                    userGroupId:vm.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                        this.getDetectionDirectory()
                        this.getDetectionDirectorys();
                        this.getMonitorItem()
                        this.addContentShow=false;
                }
            })
            

        },
        addContentCancle(){
            this.addContentShow=false;
            this.contentName='';
        },
        editContentCancle(){
            this.editContentShow=false;
            this.editcontentName='';
        },
        editContentMakeSure(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'detectionInfo/updateDetectionDirectory',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    id:this.contentId,
                    name:this.editcontentName
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getDetectionDirectory();
                    this.getDetectionDirectorys();
                    this.getMonitorItem();
                    this.editContentShow=false;
                }
            })

        },
        configContentMakeSure(){
            var vm=this;
        },
        //删除目录
        deleteContent(id){
            var vm=this;
            vm.$confirm('您要删除当前所选目录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:vm.BDMSUrl+'detectionInfo/deleteDetectionDirectory',
                    method:'GET',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getDetectionDirectory();
                        this.getDetectionDirectorys();
                        this.getMonitorItem();
                    }
                })
            })
        },
        //编辑目录
        editContent(id,name){
            this.contentId=id;
            this.editcontentName=name;
            this.editContentShow=true;
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
            // this.monitorBaseMapId='';
        },
        bindInspectContentCancle(){
            var vm=this;
            vm.bindInspectContentShow=false;
        },
        changeSpot(){
            this.editSpotNumList.forEach((item)=>{
                if(this.editSpotNum==item.id){
                    this.editSpotType=item.type;
                    this.newSpotNum=item.name;
                }
            })

        },

        //绑定点位编号取消
        bindSpotNumCancle(){
            this.bindSpotNumShow=false;
            this.newSpotNum='';
        },
        //确认点位
        bindSpotNumMakeSure(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'detectionInfo/renamePointAndSeqName',
                headers:{
                    'token':vm.token
                },
                params:{
                    id:this.editSpotNum,
                    type:this.editSpotType,
                    name:this.newSpotNum,
                }
            }).then((response)=>{
                this.bindSpotNumShow=false;
                this.getAllMonitorPoint();
                this.isBindPoint=false;
                this.bindMorePoint=false;
            })
        },
        returnPlots(val){
                var data=[];
                this.monitorPointInfo.forEach((item)=>{
                    val.forEach((val)=>{
                            if(item.id==val){
                                data.push(item.plotInfo)
                            }
                    })
                    
                })
                return data;
        },
        //一个点位绑定其他监测内容
        bindMonitorItem(){
            var vm=this;
            // this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemTagType,this.drawItemId,1);
            var alist=[];
            var blist=[];

            // var list = this.$refs.pic.saveList();
            // console.log(list,'list1111');
            // list.forEach((item,index,array)=>{
            //      if(item.id.length==undefined){
            //         alist.push(item)
            //         if(item.drawMaxCount==1){
            //             blist.push({
            //                 'itemId':item.itemId,
            //                 'plotInfos':[item.plotInfo],
            //                 'pointGroupIds':[this.pointId],
            //                 'prefix':item.prefix,
            //                 'startNo':item.startNo
            //             });
            //         }
            //     }
            // })
            // var plotData=[];
            // var groupIds=[];
            // this.plotGroup.forEach((item)=>{
            //     plotData.push();
            //     groupIds.push();
            // })
            blist.push({
                    'itemId':this.drawItemId,
                    'plotInfos':this.returnPlots(this.pointIds),
                    'pointGroupIds':this.pointIds,
                    'prefix':this.pointNameValue,
                    'startNo':this.pointNumValue
            });
            // console.log(blist,'blist00');
           axios({
                    url:this.BDMSUrl+'detectionInfo/addOrBindMonitorPoint',
                    method:'POST',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        baseMapId:vm.monitorBaseMapId,
                    },
                    data:blist
                    // infos:blist,
                }).then((response)=>{
                   if(response.data.cd=='0'){
                            this.$message({
                                type:'success',
                                message:'绑定监测点成功'
                            })
                            this.$refs.pic.setDrawCancel();
                            this.getMonitorMainTable();
                            this.getAllMonitorPoint();
                            if(this.picMark==true){
                                setTimeout(()=>{
                                        this.getTagList();
                                    },400)
                                }
                                this.bindInspectContentShow=false;
                                this.isBindPoint=false;
                                this.bindMorePoint=false;
                        }else if(response.data.cd=='-1'){
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                })
        },
        //
        getPointByPointGroupIds(id){
            var vm=this;
            var data=[];
            data.push(id);
            axios({
                url:vm.BDMSUrl+'detectionInfo/getPointByPointGroupId',
                method:'post',
                headers:{
                    'token':vm.token
                },
                data:data,
            }).then((response)=>{
                 this.editSpotNumList=response.data.rt;
                    this.editSpotNum=this.editSpotNumList[0].id;
                    this.newSpotNum=this.editSpotNumList[0].name;
                    this.editSpotType=this.editSpotNumList[0].type;
                    this.bindSpotNumShow=true;
            })
        },
        //获取测点集合内的测点信息
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
                //  vm.dataLists.forEach((item)=>{
                //      item.name=item.name.replace('-0','')
                //  })
                //  console.log(vm.dataLists,'vm.dataList');
                 this.monitorPointInfo.forEach((item)=>{
                      var a=[]
                     vm.dataLists.forEach((item1)=>{
                        
                         if(item.id==item1.pointGroupId){
                             a.push(item1);
                            vm.$set(item,'pointGroupData',a);
                         }
                        //  else{
                        //      vm.$set(item,'pointGroupData',[]);
                        //  }
                     })
                 })
                //  console.log(this.monitorPointInfo,'this.monitorPointInfo');  
                  this.$refs.pic.loadPoints(this.monitorPointInfo);
                  this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
                
            })
        },
        //获取监测项目最后一个点位名称
        // getMaxPointNameByItemId(){
        //     var vm=this;
        //     axios({
        //         url:vm.BDMSUrl+'detectionInfo/getMaxPointNameByItemId',
        //         method:'get',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             itemId:vm.drawItemId,
        //             baseMapId:vm.monitorBaseMapId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd==0){

        //         }else{

        //         }
        //     })
        // },
        //新增监测内容
        addMonitorItem(){
            var vm=this;
            if(this.monitorName==''){
                vm.$message({
                    type:'info',
                    message:'请输入监测名称'
                })
            }else if(this.monitorLogogram==''){
                vm.$message({
                    type:'info',
                    message:'请输入与其他内容不重名的简写'
                })
            }else if(this.monitorType!=5&&this.monitorKeyword==''){
                    vm.$message({
                        type:'info',
                        message:'请输入与其他内容不重名的关键字'
                    })
            }else
            {
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
                        baseMapId:vm.monitorBaseMapId,
                        directoryId:vm.directoryType,
                        sign:vm.typeTagValue
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getMonitorMainTable();
                        this.getMonitorItem();
                        this.addInspectContentShow=false;
                        this.monitorName='';
                        this.monitorType=1;
                        this.monitorLogogram='';
                        this.monitorKeyword='';
                        this.currentPage1=1;
                        vm.typeTagValue=''
                        // this.monitorBaseMapId='';
                        this.$message({
                            type:'success',
                            message:'新增监测内容成功'
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
            colData.push({'spotNumCol':vm.spotNumCol,'timeCol':vm.timeCol,'distanceCol':vm.distanceCol,'altitudeCol':vm.altitudeCol,'pipeHeightCol':vm.pipeHeightCol,'gaugeHeightCol':vm.gaugeHeightCol,'saveImportColumnValue':vm.saveImportColumnValue,'depthIndexCol':vm.depthIndexCol,'shiftIndexCol':vm.shiftIndexCol,'forceIndexCol':vm.forceIndexCol,'kIndexCol':vm.kIndexCol,'f0IndexCol':vm.f0IndexCol,'fnIndex':vm.fnIndex,'useFormulaNum':vm.useFormulaNum})
           
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
                    
                    var importColumnData=null;
                    importColumnData=JSON.parse(vm.getImportColumnList.data)
                    
                    importColumnData.forEach((item)=>{
                        vm.spotNumCol=item.spotNumCol;
                        vm.timeCol=item.timeCol;
                        vm.distanceCol=item.distanceCol;
                        vm.altitudeCol=item.altitudeCol;
                        vm.pipeHeightCol=item.pipeHeightCol;
                        vm.gaugeHeightCol=item.gaugeHeightCol;
                        vm.shiftIndexCol=item.shiftIndexCol;
                        vm.depthIndexCol=item.depthIndexCol;
                        vm.forceIndexCol=item.forceIndexCol;
                        vm.kIndexCol=item.kIndexCol;
                        vm.useFormulaNum=item.useFormulaNum;
                        vm.f0IndexCol=item.f0IndexCol;
                        vm.fnIndexCol=item.fnIndexCol;
                        vm.saveImportColumnValue=item.saveImportColumnValue;
                    })
                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        documentMethod(name,item){
            var a=0;
          
            if(document.getElementById(name+item.itemId).selectedIndex==-1){
                return ''
            }else{
              
                return document.getElementById(name+item.itemId).options[document.getElementById(name+item.itemId).selectedIndex].value
                
            }
        },
        deleteDocumentMethod(){

        },
        spilitMethod(val){
            if(val==''){
                return ''
            }else{
                return parseInt(val.split('-')[0])
            }
        },
        //导入数据
        exportData(val){
            this.valitem=val;
            this.valitemName=val.itemName;
            this.valitemId=val.itemId;
            this.valitemtype=val.type;
            this.valsheetIndex=val.sheetIndex;
            this.singleBatchImportDataShow=true;
            this.getExcelColumnBySheet(val.sheetIndex);
        },
        //批量导入验证
        batchImportVerify(){
            var listData=[];
          
            if(this.singleData){
                
                for(var id in this.singleData){
                    listData.push(this.singleData[id])
                }
            }
            // this.sheetList.forEach((item)=>{
               
            //   if(this.documentMethod('sheetName',item)==''){
            //         return false;
            //     }
            //     else{
            //         listData.push(
            //             {
            //                 sheetIndex:this.spilitMethod(this.documentMethod('sheetName',item)),//sheet下标*
            //                 acquisitionTimeIndex:this.spilitMethod(this.documentMethod('timeCol',item)), //采集时间下标*
            //                 shiftDistanceIndex:this.spilitMethod(this.documentMethod('distanceCol',item)),//位移下标*
            //                 depthIndex:this.spilitMethod(this.documentMethod('depthIndexCol',item)),//深度下标*
            //                 elevationIndex:this.spilitMethod(this.documentMethod('altitudeCol',item)),//高程下标*
            //                 f0Index:this.spilitMethod(this.documentMethod('f0IndexCol',item)),//初始频率下标*
            //                 fnIndex:this.spilitMethod(this.documentMethod('fnIndexCol',item)),//本次频率下标*
            //                 kIndex:this.spilitMethod(this.documentMethod('kIndexCol',item)),//率定系数下标*
            //                 pipeHeightIndex:this.spilitMethod(this.documentMethod('pipeHeightCol',item)),//管口高度*
            //                 gaugeHeightIndex:this.spilitMethod(this.documentMethod('gaugeHeightCol',item)),//水位高度下标（水位）*
            //                 forceIndex:this.spilitMethod(this.documentMethod('forceIndexCol',item)),//受力下标*
            //                 shiftIndex:this.spilitMethod(this.documentMethod('shiftIndexCol',item)),//位移下标*
            //                 useFormula:this.spilitMethod(this.documentMethod('useFormulaNum',item)),//计算公式*
            //                 pointIndex:this.spilitMethod(this.documentMethod('spotNumCol',item)),//监测点位下标(除斜度外)*
            //             }
            //         )
            //     }

            // })
           

            // console.log(listData,'listData');
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/batchImportVerify',
                headers:{
                    'token':vm.token
                },
                params:{
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//统一时间
                    overwrite:vm.overwrite,//是否覆盖
                    userGroupId:vm.selectUgId
                },
                data:listData
            }).then((response)=>{
                if(response.data.cd=='0'){
                  if(response.data.rt==''){
                        this.testShow=false;
                        this.$message({
                            type:'success',
                            message:'测试批量导入数据成功'
                        })

                    }else{
                        this.$message({
                            type:'info',
                            message:response.data.rt
                        })
                    }
                }else {
                    vm.$message({
                        type:'error',
                        message:'测试批量导入数据失败'
                    })
                }
            })
        },
        singleBatchImportVerifyMake(id,type,item,sheetIndex){
           
            console.log(id,type,item,sheetIndex,'id,type,item','sheetIndex');
            this.singleData[sheetIndex]={
                // sheetIndex:this.spilitMethod(this.documentMethod('sheetName',item)),//sheet下标*
                sheetIndex:sheetIndex,
                acquisitionTimeIndex:this.spilitMethod(this.documentMethod('timeCol',item)), //采集时间下标*
                shiftDistanceIndex:this.spilitMethod(this.documentMethod('distanceCol',item)),//位移下标*
                depthIndex:this.spilitMethod(this.documentMethod('depthIndexCol',item)),//深度下标*
                elevationIndex:this.spilitMethod(this.documentMethod('altitudeCol',item)),//高程下标*
                f0Index:this.spilitMethod(this.documentMethod('f0IndexCol',item)),//初始频率下标*
                fnIndex:this.spilitMethod(this.documentMethod('fnIndexCol',item)),//本次频率下标*
                kIndex:this.spilitMethod(this.documentMethod('kIndexCol',item)),//率定系数下标*
                pipeHeightIndex:this.spilitMethod(this.documentMethod('pipeHeightCol',item)),//管口高度*
                gaugeHeightIndex:this.spilitMethod(this.documentMethod('gaugeHeightCol',item)),//水位高度下标（水位）*
                forceIndex:this.spilitMethod(this.documentMethod('forceIndexCol',item)),//受力下标*
                shiftIndex:this.spilitMethod(this.documentMethod('shiftIndexCol',item)),//位移下标*
                useFormula:this.spilitMethod(this.documentMethod('useFormulaNum',item)),//计算公式*
                pointIndex:this.spilitMethod(this.documentMethod('spotNumCol',item)),//监测点位下标(除斜度外)*
            }
            this.singleBatchImportDataShow=false;
            console.log(this.sheetList,'this.sheetList0000');
            this.sheetList.forEach((val)=>{
                if(val.itemId==id){
                    // this.$set(val,'exportTip',val.itemName+'已成功配置')
                    if(type==5){
                        if(sheetIndex==val.sheetIndex){
                            val.exportTip=val.itemName+val.sheetName+'已成功配置'
                            val.exportShow=false;
                        }
                    }else{
                        val.exportTip=val.itemName+'已成功配置'
                        // this.$set(val,'exportShow',false)
                        val.exportShow=false;
                    }
                }
            })
            // console.log(this.singleData,'this.singleData11');
        },
        singleBatchImportCancle(){
            var vm=this;
            this.singleBatchImportDataShow=false;
            this.sheetIndexList='';
            this.valsheetlist='';


            // this.singleData
            vm.sheetIndex='';//sheet下标*
            vm.timeCol='';//采集时间下标*
            vm.depthIndexCol='';//深度下标*
            vm.distanceCol='';//位移下标*
            vm.altitudeCol='';//高程下标*
            vm.f0IndexCol='';//初始频率下标*
            vm.fnIndexCol='';//本次频率下标*
            vm.kIndexCol='';//率定系数下标*
            vm.pipeHeightCol='';//管口高度*
            vm.gaugeHeightCol='';//水位高度下标（水位）*
            vm.forceIndexCol='';//受力下标*
            vm.shiftIndexCol='';//位移下标*
            vm.useFormulaNum='';//计算公式*
            vm.spotNumCol='';//监测点位下标(除斜度外)*
            vm.workingConditionList="";
            vm.excelMoreFileListName='';
            vm.matchedAmount='';
            vm.allAmount='';
            vm.workingCondition='';
        },
        //批量导入数据
        batchImportVerifyMake(){
             var vm=this;
             var listData=[];
             if(this.singleData){
                    for(var id in this.singleData){
                        listData.push(this.singleData[id])
                    }
            }
            // this.sheetList.forEach((item)=>{
            //    if(this.documentMethod('sheetName',item)==''){
            //         return false;
            //     }
            //     else{
            //         listData.push(
            //             {
            //                 sheetIndex:this.spilitMethod(this.documentMethod('sheetName',item)),//sheet下标*
            //                 acquisitionTimeIndex:this.spilitMethod(this.documentMethod('timeCol',item)), //采集时间下标*
            //                 shiftDistanceIndex:this.spilitMethod(this.documentMethod('distanceCol',item)),//位移下标*
            //                 depthIndex:this.spilitMethod(this.documentMethod('depthIndexCol',item)),//深度下标*
            //                 elevationIndex:this.spilitMethod(this.documentMethod('altitudeCol',item)),//高程下标*
            //                 f0Index:this.spilitMethod(this.documentMethod('f0IndexCol',item)),//初始频率下标*
            //                 fnIndex:this.spilitMethod(this.documentMethod('fnIndexCol',item)),//本次频率下标*
            //                 kIndex:this.spilitMethod(this.documentMethod('kIndexCol',item)),//率定系数下标*
            //                 pipeHeightIndex:this.spilitMethod(this.documentMethod('pipeHeightCol',item)),//管口高度*
            //                 gaugeHeightIndex:this.spilitMethod(this.documentMethod('gaugeHeightCol',item)),//水位高度下标（水位）*
            //                 forceIndex:this.spilitMethod(this.documentMethod('forceIndexCol',item)),//受力下标*
            //                 shiftIndex:this.spilitMethod(this.documentMethod('shiftIndexCol',item)),//位移下标*
            //                 useFormula:this.spilitMethod(this.documentMethod('useFormulaNum',item)),//计算公式*
            //                 pointIndex:this.spilitMethod(this.documentMethod('spotNumCol',item)),//监测点位下标(除斜度外)*
            //             }
            //         )
            //     }
            // })
          
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/batchImport',
                headers:{
                    'token':vm.token
                },
                params:{
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//统一时间
                    overwrite:vm.overwrite,//是否覆盖
                    userGroupId:vm.selectUgId,
                    workingCondition:vm.workingConditionList
                },
                data:listData
            }).then((response)=>{
                if(response.data.cd=='0'){
                  if(response.data.rt==null){
                        this.testShow=false;
                        this.batchImportDataShow=false;
                        this.$message({
                            type:'success',
                            message:'批量导入数据成功'
                        })
                this.getMonitorMainTable();
                 document.getElementById('editBodyStyle').style.height="200px"
                this.sheetList='';
                vm.sheetIndex='';//sheet下标*
                   vm.timeCol='';//采集时间下标*
                   vm.depthIndexCol='';//深度下标*
                    vm.distanceCol='';//位移下标*
                    vm.altitudeCol='';//高程下标*
                    vm.f0IndexCol='';//初始频率下标*
                    vm.fnIndexCol='';//本次频率下标*
                    vm.kIndexCol='';//率定系数下标*
                    vm.pipeHeightCol='';//管口高度*
                    vm.gaugeHeightCol='';//水位高度下标（水位）*
                    vm.forceIndexCol='';//受力下标*
                   vm.shiftIndexCol='';//位移下标*
                    vm.useFormulaNum='';//计算公式*
                    vm.spotNumCol='';//监测点位下标(除斜度外)*
                    vm.workingConditionList="";
                    vm.excelMoreFileListName='';
                    vm.matchedAmount='';
                    vm.allAmount='';
                    vm.workingCondition='';
                    }else{
                        this.$message({
                            type:'info',
                            message:response.data.rt
                        })
                    }
                }else {
                    vm.$message({
                        type:'error',
                        message:'数据导入失败,请按要求选择'
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
            }else if(this.monitorImportType==5){
                 this.importExcel_5()
            }else if(this.monitorImportType==4){
                if(this.frequencyShow==false){
                    this.importExcel_4_2();
                }else if(this.frequencyShow==true){
                    this.importExcel_4();
                }
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
                    userGroupId:vm.selectUgId, //
                    baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                     this.testShow=true;
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.distanceCol='';//位移下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false;//是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    if(this.$refs.commonDetailRef){
                        this.$refs.commonDetailRef.getAllMonitorPoint();
                        this.$refs.commonDetailRef.getPointDatas();
                        this.$refs.commonDetailRef.getDetailPointInfo();
                    }
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
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
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传,
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId, //
                     baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                     this.testShow=true;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.altitudeCol='';//高程下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    if(this.$refs.commonDetailRef){
                        this.$refs.commonDetailRef.getAllMonitorPoint();
                        this.$refs.commonDetailRef.getPointDatas();
                        this.$refs.commonDetailRef.getDetailPointInfo();
                    }
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
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
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId, //
                     baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                     this.testShow=true;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.pipeHeightCol='';//管口高度
                    vm.gaugeHeightCol='';//水位下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    if(this.$refs.commonDetailRef){
                        this.$refs.commonDetailRef.getAllMonitorPoint();
                        this.$refs.commonDetailRef.getPointDatas();
                        this.$refs.commonDetailRef.getDetailPointInfo();
                    }
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //
        //导入斜度
        importExcel_5(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_5',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    // elevationIndex:vm.altitudeCol,//高程下班
                    // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                    // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                    depthIndex:vm.depthIndexCol,//深度下标
                    shiftIndex:vm.shiftIndexCol,//位移下标
                    itemId:vm.monitorImportId,//监测ID
                    // pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId, //
                     baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                     this.testShow=true;
                    vm.sheetIndexCol='';
                    vm.depthIndexCol='';
                    vm.shiftIndex='';
                    vm.timeCol=''; //采集时间下标
                    vm.pipeHeightCol='';//管口高度
                    vm.gaugeHeightCol='';//水位下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   vm.shiftIndexCol='';//斜度位移取值
                   vm.excelSheetInfoLength=0;
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    this.$refs.commonPitchDetailRef.getPitchBaseInfo();
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //导入EXCEL（受力）（已计算）
        importExcel_4_2(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_4_2',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    // elevationIndex:vm.altitudeCol,//高程下班
                    // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                    // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                    forceIndex:vm.forceIndexCol,//受力下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId, //
                     baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.importGatherDataShow=false;
                     this.testShow=true;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    // vm.pipeHeightCol='';//管口高度
                    // vm.gaugeHeightCol='';//水位下标
                    vm.forceIndexCol='';//受力下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                   vm.unifiedTime='';//标准时间，不选择可不传
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    if(this.$refs.commonDetailRef){
                        this.$refs.commonDetailRef.getAllMonitorPoint();
                        this.$refs.commonDetailRef.getPointDatas();
                        this.$refs.commonDetailRef.getDetailPointInfo();
                    }
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //导入EXCEL（受力）（已计算）
        importExcel_4(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/importExcel_4',
                headers:{
                    'token':vm.token
                },
                params:{
                    sheetIndex:vm.sheetIndex,
                    acquisitionTimeIndex:vm.timeCol, //采集时间下标
                    // shiftDistanceIndex:vm.distanceCol,//位移下标
                    // elevationIndex:vm.altitudeCol,//高程下班
                    // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                    // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                    // forceIndex:vm.forceIndexCol,//受力下标
                    useFormula:vm.useFormulaNum,//计算公式
                    kIndex:vm.kIndexCol,//率定系数下标
                    f0Index:vm.f0IndexCol,//初始频率下标
                    fnIndex:vm.fnIndexCol,//本次频率下标
                    itemId:vm.monitorImportId,//监测ID
                    pointIndex:vm.spotNumCol,//监测点位下标
                    commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传,//标准时间，不选择可不传
                    overwrite:vm.overwrite, //是否覆盖
                    workingCondition:vm.inputWorkingCondition,//现场工况
                    userGroupId:vm.selectUgId,
                     baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.testShow=true;
                    this.importGatherDataShow=false;
                    vm.sheetIndex='';
                    vm.timeCol=''; //采集时间下标
                    // vm.pipeHeightCol='';//管口高度
                    // vm.gaugeHeightCol='';//水位下标
                    vm.forceIndexCol='';//受力下标
                    vm.monitorImportId='';//监测ID
                    vm.spotNumCol='';//监测点位下标
                    vm.unifiedTime='';//标准时间，不选择可不传
                    vm.kIndexCol='';
                    vm.f0IndexCol='';
                    vm.fnIndexCol='';
                    vm.useFormulaNum='';
                    vm.overwrite=false; //是否覆盖
                   vm.inputWorkingCondition='';//现场工况
                   this.getMonitorMainTable();
                    this.getMonitorItem();
                    // this.getDetectionSummary();
                    if(this.$refs.commonDetailRef){
                        this.$refs.commonDetailRef.getAllMonitorPoint();
                        this.$refs.commonDetailRef.getPointDatas();
                        this.$refs.commonDetailRef.getDetailPointInfo();
                    }
                    this.$message({
                        type:'success',
                        message:'采集数据导入成功'
                    })
                }else {
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //
        //测试导入excel数据(需要根据监测类型来判断)
        verifyExcelDataBtn(){
            // this.loadings=true;
             if(this.monitorImportType==1){
                this.verifyExcel_1()
            }else if(this.monitorImportType==2){
                this.verifyExcel_2()
            }else if(this.monitorImportType==3){
                 this.verifyExcel_3()
            }else if(this.monitorImportType==5){
                 this.verifyExcel_5()
            }else if(this.monitorImportType==4){
                if(this.frequencyShow==false){
                    this.verifyExcel_4_2()
                }else if(this.frequencyShow==true){
                    this.verifyExcel_4()
                }
            }
            document.getElementById('fileInfoExport').value="";
            // this.loadings=false;
        },
        //测试导入EXCEL（水平位移）
        verifyExcel_1(){
            var vm=this;
            // this.loadings=true;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
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
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else if(response.data.rt){
                                this.$message({
                                    type:'info',
                                    message:response.data.rt
                                })
                            }
                        }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                        // alert(response.data.rt);
                    }
                    this.loadings=false
                })
            }

        },
        //验证导入EXCEL（竖向位移）
        verifyExcel_2(){
            var vm=this;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
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
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else{
                            this.$message({
                                type:'info',
                                message:response.data.rt
                            })
                            // alert(response.data.rt);
                        }
                        // this.importGatherDataShow=false;
                    //     vm.sheetIndex='';
                    //     vm.timeCol=''; //采集时间下标
                    //     vm.altitudeCol='';//高程下标
                    //     vm.monitorImportId='';//监测ID
                    //     vm.spotNumCol='';//监测点位下标
                    //    vm.unifiedTime='';//标准时间，不选择可不传
                    //     vm.overwrite=false; //是否覆盖
                    //    vm.inputWorkingCondition='';//现场工况
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                    this.loadings=false
                })
            }
        },
        //验证导入EXCEL（水位）
        verifyExcel_3(){
            var vm=this;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
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
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                    if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else{
                            this.$message({
                                type:'info',
                                message:response.data.rt
                            })
                        }
                        // this.importGatherDataShow=false;
                    //     vm.sheetIndex='';
                    //     vm.timeCol=''; //采集时间下标
                    //     vm.pipeHeightCol='';//管口高度
                    //     vm.gaugeHeightCol='';//水位下标
                    //     vm.monitorImportId='';//监测ID
                    //     vm.spotNumCol='';//监测点位下标
                    //    vm.unifiedTime='';//标准时间，不选择可不传
                    //     vm.overwrite=false; //是否覆盖
                    //    vm.inputWorkingCondition='';//现场工况
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                    this.loadings=false
                })
            }
        },
        //验证导入EXCEL（斜度）
        verifyExcel_5(){
            var vm=this;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/verifyExcel_5',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        sheetIndex:vm.sheetIndex,
                        acquisitionTimeIndex:vm.timeCol, //采集时间下标
                        // shiftDistanceIndex:vm.distanceCol,//位移下标
                        // elevationIndex:vm.altitudeCol,//高程下班
                        // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                        // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                        depthIndex:vm.depthIndexCol,//深度下标
                        shiftIndex:vm.shiftIndexCol,//位移下标
                        itemId:vm.monitorImportId,//监测ID
                        // itemId:vm.monitorImportId,//监测ID
                        // pointIndex:vm.spotNumCol,//监测点位下标
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                    if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else{
                            this.$message({
                                type:'info',
                                message:response.data.rt
                            })
                        }
                        // this.importGatherDataShow=false;
                    //     vm.sheetIndex='';
                    //     vm.timeCol=''; //采集时间下标
                    //     vm.pipeHeightCol='';//管口高度
                    //     vm.gaugeHeightCol='';//水位下标
                    //     vm.monitorImportId='';//监测ID
                    //     vm.spotNumCol='';//监测点位下标
                    //    vm.unifiedTime='';//标准时间，不选择可不传
                    //     vm.overwrite=false; //是否覆盖
                    //    vm.inputWorkingCondition='';//现场工况
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                    this.loadings=false
                })
            }
        },
      
        //验证受力（已计算）
        verifyExcel_4_2(){
            var vm=this;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/verifyExcel_4_2',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        sheetIndex:vm.sheetIndex,
                        acquisitionTimeIndex:vm.timeCol, //采集时间下标
                        // shiftDistanceIndex:vm.distanceCol,//位移下标
                        // elevationIndex:vm.altitudeCol,//高程下班
                        // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                        // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                        forceIndex:vm.forceIndexCol,//受力下标
                        itemId:vm.monitorImportId,//监测ID
                        pointIndex:vm.spotNumCol,//监测点位下标
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                    if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else{
                            this.$message({
                                type:'info',
                                message:response.data.rt
                            })
                        }
                    }else {
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                    this.loadings=false
                })
            }
        },
        //
        verifyExcel_4(){
            var vm=this;
            // if(vm.inputWorkingCondition==''){
            //     this.$message({
            //         type:'info',
            //         message:"请输入现场监测工况"
            //     })

            // }else
             if(vm.inputWorkingCondition.length>150){
                this.$message({
                    type:'info',
                    message:"文本字符超过150个"
                })
            }
            else{
                this.loadings=true
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/verifyExcel_4',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        sheetIndex:vm.sheetIndex,
                        acquisitionTimeIndex:vm.timeCol, //采集时间下标
                        // shiftDistanceIndex:vm.distanceCol,//位移下标
                        // elevationIndex:vm.altitudeCol,//高程下班
                        // pipeHeightIndex:vm.pipeHeightCol,//管口高度
                        // gaugeHeightIndex:vm.gaugeHeightCol,//水位下标
                        // forceIndex:vm.forceIndexCol,//受力下标
                        useFormula:vm.useFormulaNum,//计算公式
                        kIndex:vm.kIndexCol,//率定系数下标
                        f0Index:vm.f0IndexCol,//初始频率下标
                        fnIndex:vm.fnIndexCol,//本次频率下标
                        itemId:vm.monitorImportId,//监测ID
                        pointIndex:vm.spotNumCol,//监测点位下标
                        commonTime:vm.unifiedTime==''?null:vm.unifiedTime,//标准时间，不选择可不传
                        overwrite:vm.overwrite, //是否覆盖
                        workingCondition:vm.inputWorkingCondition,//现场工况
                        userGroupId:vm.selectUgId,
                        baseMapId:vm.monitorBaseMapId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                    if(response.data.rt==''){
                            this.testShow=false;
                            this.$message({
                                type:'success',
                                message:'测试导入数据成功'
                            })

                        }else{
                            this.$message({
                                type:'info',
                                message:response.data.rt
                            })
                        }
                    }else {
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                    this.loadings=false
                })
            }
        },
        //点击公式设定
        formulaSetting(val){
            this.formulaSettingShow=true;
            
            this.useFormulaValue=this.useFormulaNum.split('-')[0];
            if(val){
                this.monitorImportId=val;
            }
            this.getFormula();
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
                    itemId:vm.monitorImportId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getFormulaList=(response.data.rt)[0];
                    this.AsValue=this.getFormulaList.as;
                    this.barCountValue=this.getFormulaList.barCount;
                    this.barDiameterValue=this.getFormulaList.barDiameter
                    this.barGradeValue=this.getFormulaList.barGrade
                    this.concreteHeightValue=this.getFormulaList.concreteHeight
                    this.concreteLevelValue=this.getFormulaList.concreteLevel
                    this.concreteWidthValue=this.getFormulaList.concreteWidth
                    this.EsValue=this.getFormulaList.es
                    this.useFormulaValue=this.getFormulaList.formula==1?'1':'2'
                    // console.
                }else if(response.data.cd=='-1'){

                }
            })

        },
        //取消公式设定
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
            this.acValueArea='';
            this.asValueArea='';

        },
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
                    itemId:vm.monitorImportId,
                    useFormula:vm.useFormulaValue,
                    As:vm.AsValue,
                    Es:vm.EsValue,
                    barDiameter:vm.barDiameterValue,
                    barCount:vm.barCountValue,
                    concreteWidth:vm.concreteWidthValue,
                    concreteHeight:vm.concreteHeightValue,
                    concreteLevel:vm.concreteLevelValue,
                    barGrade:vm.barGradeValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.$message({
                        type:'success',
                        message:'公式设定成功'
                    })
                    this.formulaSettingShow=false;
                    this.AsValue=null;
                    this.EsValue=null;
                    this.barDiameterValue=null;
                    this.barCountValue=null;
                    this.concreteWidthValue=null;
                    this.concreteHeightValue=null;
                    this.concreteLevel=null;
                    this.barGradeValue=null;
                    this.acValueArea='';
                    this.asValueArea='';

                }else if(response.data.cd=='-1'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })

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
            document.getElementById('fileInfoExport').value="";
        },
        //取消批量数据导入
        batchImportCancle(){
            var vm=this;

            this.workingConditionList='';
             vm.excelMoreFileListName='';
            vm.matchedAmount='';
            vm.allAmount='';
            this.sheetList='';
            this.sheetIndexList='';
            this.valsheetlist='';

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
            this.batchImportDataShow=false;
            
             document.getElementById('morefileInfo').value="";
             document.getElementById('editBodyStyle').style.height="200px"
        },
        
        //导入excel表格-获取导入EXCEL文件的sheet信息
        addExcel(){
            var vm=this;
            const list = vm.$refs.importExcel.files;
            vm.excelFileList=list[0];
            vm.excelFileListName=list[0].name.replace(/\s*/g,"");
            var formData = new FormData()
            formData.append('data',vm.excelFileList);
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
                            this.excelSheetInfoLength=response.data.rt.length;
                           
                            if(vm.monitorImportType==5){
                                this.excelSheetInfo.forEach((item)=>{
                                    this.getPitchBaseInfoList.forEach((item1)=>{
                                         if(item.name==item1.keyword){
                                            this.getExcelColumnBySheet(item.index);
                                            this.getImportColumnSetting(item.index);
                                            this.sheetIndex=item.index;
                                          
                                        }else if(item.name!=item1.keyword){
                                            // this.$message({
                                            //     type:'info',
                                            //     message:'无匹配数据'
                                            // })
                                        }
                                    })
                                   
                                })
                            }else{
                                this.excelSheetInfo.forEach((item)=>{
                                    if(item.name==this.matchKeyWord){
                                        this.getExcelColumnBySheet(item.index);
                                        this.getImportColumnSetting(item.index);
                                        this.sheetIndex=item.index;
                                       
                                    }else if(item.name!=this.matchKeyWord){
                                            // this.$message({
                                            //     type:'info',
                                            //     message:'无匹配数据'
                                            // })
                                        }
                                })
                            } 
                            document.getElementById('fileInfoExport').value="";
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
        //批量导入
        addMoreExcel(){
            var vm=this;
            const moreList=this.$refs.importMoreExcel.files;
            vm.excelMoreFileList=moreList[0];
            vm.excelMoreFileListName=moreList[0].name;
            var formData = new FormData();
            formData.append('data',vm.excelMoreFileList);
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getBatchImportMatchingResult',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.selectUgId
                },
                data:formData
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getBatchImportMatchingResultList=response.data.rt;
                    this.allAmount=this.getBatchImportMatchingResultList.allAmount;
                    this.matchedAmount=this.getBatchImportMatchingResultList.matchedAmount;
                    this.sheetList=this.getBatchImportMatchingResultList.sheets;
                    this.sheetList.forEach((item)=>{
                        this.$set(item,'exportShow',true);
                        this.$set(item,'exportTip',null);
                    })
                    // this.sheetList.forEach((item)=>{
                    //     this.getExcelColumnBySheet(item.sheetIndex)
                    // })
                    // this.selectSheetList.push(this.sheetList[0]);
                    // console.log(this.sheetList,'this.sheetList0000');
                   
                    document.getElementById('editBodyStyle').style.height="400px"
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                document.getElementById('morefileInfo').value="";
            })
        },
        sheetIndexChange(val){
            // this.getExcelColumnBySheet(val);
            this.sheetValue=val;
            // this.selectSheetList=[];
            // this.sheetList.forEach((item)=>{
            //     if(item.sheetIndex==val){
            //         this.selectSheetList.push(item);
            //     }
            // })
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
                    // var sheetIndexLists=response.data.rt;
                    vm.sheetIndexList=response.data.rt;
                    vm.valsheetlist=response.data.rt;
                    // vm.sheetList.forEach((item)=>{
                    //     if(item.sheetIndex==val){
                    //         this.$set(item,'sheetlist',vm.sheetIndexList)
                    //     }
                    // })
                    
                  
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
            if(this.monitorName1==''){
                vm.$message({
                    type:'info',
                    message:'请输入监测名称'
                })
            }else if(this.monitorLogogram1==''){
                vm.$message({
                    type:'info',
                    message:'请输入与其他内容不重名的简写'
                })
            }else if(this.monitorType!=5&&this.monitorKeyword1==''){
                    vm.$message({
                        type:'info',
                        message:'请输入与其他内容不重名的关键字'
                    })
            }else{
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
                            this.getMonitorMainTable();
                            this.getAllMonitorPoint();
                            vm.getMonitorItem();
                        }else{
                            this.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
                }
        },
        //删除
        deleteMonitorNameBtn(val){
            var vm=this;
            vm.$confirm('此操作将相关历史录入数据将会被永久删除，用户请谨慎操作 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/deleteMonitorItem',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:val
                }
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                   this.getMonitorMainTable();
                   this.getAllMonitorPoint();
                    this.getMonitorItem();
                    this.currentPage1=1;
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        }).catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

        },
        editMonitorNameBtn(val){
            var vm=this;
           
            this.editInspectContentShow=true;
           
            this.monitorMainTableList.forEach((item)=>{
                if(item.id==val){
                    this.monitorName1=item.name;
                    this.monitorLogogram1=item.logogram;
                    this.monitorKeyword1=item.keyword;
                    this.monitorId=item.id;
                    this.monitorType=item.type;

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
        detail(keyword,id,type,name,baseMapId,count,sign){
            this.surveyName=name;
            this.detailMonitorId=id;
            this.itemType=type;
            this.itemSubmitKeyWord=keyword;
            this.itemSubmitbaseMapId=this.monitorBaseMapId;
            this.itemSubmitCount=count;
            this.itemSign=sign;

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
            if(vm.monitorImportType==5){
                this.getPitchBaseInfo();
            }

        },
        //斜度匹配
        getPitchBaseInfo(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getPitchBaseInfo',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.monitorImportId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        vm.getPitchBaseInfoList=response.data.rt;
                        vm.getPitchBaseInfoListLength=response.data.rt.length;
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
        },
        //获取监测内容主表
        getMonitorMainTable(){
            this.monitorMainTableList1=[];
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
                    // this.monitorMainTableList.forEach((item)=>{
                    //     item.recentPointName=item.recentPointName.replace('-0','');
                    //     item.recentPointName=item.recentPointName.replace('-0','');
                    // })
                    this.monitorMainTableListLength=response.data.rt.length;
                    this.monitorMainTableList1=this.monitorMainTableList;
                    //  if(this.monitorMainTableListLength<11){
                    //     for(var i=0;i<this.monitorMainTableListLength;i++){
                    //         this.monitorMainTableList1.push(this.monitorMainTableList[i])
                    //     }
                    // }else{
                    //     for(var i=0;i<10;i++){
                    //         this.monitorMainTableList1.push(this.monitorMainTableList[i])
                    //     }
                    // }
                  
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
            // this.baseMapMonitor=true;
            this.getBaseMapList();
        },
        //选择当前底图
        selectCurBaseMap(val){
            this.isClick0=false;
            this.baseMapList.forEach((item)=>{
                if(item.id==val){
                    this.curBaseMapUrl=item.relativeUri;
                    this.monitorBaseMapId=item.id;
                    this.setBaseMapUsed(item.id);
                     this.getBaseMapList();
                    this.getBaseMapInfoByBaseMapId();
                    this.getAllMonitorPoint();
                   
                }
                // else if(item.id==val&&this.baseMapMonitor){
                //     this.monitorBaseMapUrl=item.relativeUri;
                //     this.monitorBaseMapId=item.id;
                //     this.setBaseMapUsed(item.id);
                //     this.getAllMonitorPoint();
                // }
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
        //获取监测项目最后一个点位名称
        getMaxPointNameByItemId(id,name,num){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'detectionInfo/getMaxPointNameByItemId',
                headers:{
                    'token':vm.token
                },
                params:{
                    itemId:id,
                    baseMapId:vm.monitorBaseMapId,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    if(response.data.rt){
                        this.pointNameValue=response.data.rt.split('-')[0];
                        this.pointNumValue=response.data.rt.split('-')[1];
                    }else{
                        this.pointNameValue=name;
                        this.pointNumValue=num;
                    }
                    
                }
            })
        },

        //单点触发绘图
        drawingOneSpot(){
            this.$refs.pic.setDrawCancel();
            this.startpointShow=true;
            this.drawPointType="onePoint" //这是表示单点,drawPointType="onePoint"表示单点
            this.changeType();
            // this.pointNameValue=this.monitorMainItemList[0].logogram;//初始化测点编号
            // this.pointNumValue='01';//初始化测点编号
            if(this.drawItemId==''){
               this.$message({
                    type:'info',
                    message:'请先添加监测内容'
                })
            }else{
                this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue)
                this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemTagType,this.drawItemId,1);
                this.monitorMainItemList.forEach((item)=>{
                    if(item.id==this.drawItemId){
                        item.spotNum=true;
                    }
                })
                this.isClick1=true;
                this.isClick2=false;
                this.isClick3=false;
                this.isClick4=false;
                this.isClick5=false;
                this.isClick6=false;
                this.isClick7=false;
                this.isClick8=false;
                this.moveClick=false;
            }
        },
        //多点触发绘图
        drawingSpots(){
            this.$refs.pic.setDrawCancel();
            this.startpointShow=true;
            this.drawPointType="morePoint" //这是表示多点,drawPointType="morePoint"表示多点
            this.changeType();
            // this.pointNameValue=this.monitorMainItemList[0].logogram;//初始化测点编号
            // this.pointNumValue='01';//初始化测点编号
             if(this.drawItemId==''){
               this.$message({
                    type:'info',
                    message:'请先添加监测内容'
                })
            }else{
                this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue)
                this.$refs.pic.setDrawStatus("onePoint",this.drawItemType,this.drawItemTagType,this.drawItemId,2);
                this.isClick1=false;
                this.isClick2=true;
                this.isClick3=false;
                this.isClick4=false;
                this.isClick5=false;
                this.isClick6=false;
                this.isClick7=false;
                this.isClick8=false;
                this.moveClick=false;
            }
        },
        //添加文本
        drawingText(){
            this.$refs.pic.setDrawCancel();
             if(this.drawItemId==''){
               this.$message({
                    type:'info',
                    message:'请先添加监测内容'
                })
            }else{
                this.$refs.pic.setDrawStatus("text",10000,10000,10000,2);
                this.isClick1=false;
                this.isClick2=false;
                this.isClick3=true;
                this.isClick4=false;
                this.isClick5=false;
                this.isClick6=false;
                this.isClick7=false;
                this.isClick8=false;
                this.moveClick=false;
            }
        },
        //上传图片编辑
        setSpotPic(){
            if(this.drawItemId==''){
               this.$message({
                    type:'info',
                    message:'请先添加监测内容'
                })
            }else{
                this.setSpotPicShow=true;
                this.picMark=true;
                 this.getAllMonitorPoint();
                this.getTagList();
                this.$refs.pic.setDrawStatus("none",10001,10001,10001,1,{r:0,g:170,b:0},{SelectImg:"fz_img_for_site",DrawImg:"fz_img_for_site1"});
            }
        },
        //获取图片列表
        // getTagList(){
        //      axios({
        //         method:'post',
        //         url:vm.BDMSUrl+'detectionInfo/editPhotoTag',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             baseMapId:vm.monitorBaseMapId
        //         },
        //     }).then((response)=>{
        //         if(response.data.cd=='0'){
        //             this.spotPicInfo=response.data.rt;
        //             // this.monitorPointInfo=response.data.rt;
        //             // this.$refs.pic.loadPoints(this.monitorPointInfo);
        //         }
        //     })
        // },
         selectImg(){
             this.$refs.file.click()
        },
        fileChanged(file){
            var vm = this
            vm.filesList = vm.$refs.file.files[0] //[]
            vm.imageName = vm.filesList.name 
        },
        //取消上传图片
        upImgCancle(){
            var vm=this;
            this.uploadshow=false;
             this.spotPicInfo=[];
                this.spotPicInfo.push({
                    "coordinateInfo":null,
                    "operationType":2,
                    "photoId":this.photoId,
                });
                    axios({
                        method:'post',
                        url:vm.BDMSUrl+'detectionInfo/editPhotoTag',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                            userGroupId:vm.selectUgId
                        },
                        data:this.spotPicInfo
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.spotPicInfo=[];
                        this.setSpotPicShow=false;
                            this.getAllMonitorPoint();
                        setTimeout(()=>{
                                this.getTagList();
                        },400)
                        // alert('000000000000000');
                    }else if(response.data.cd=='-1'){
                       
                    }
                })
            },

        //上传照片
        addPhotoTag(){
            var vm=this;
            if(vm.filesList == null){
               vm.$message({
                   type:'error',
                   message:'请选择文件！'
               })
               return false
           }
            // var returnUrl = vm.BDMSUrl+"detectionInfo/addPhotoTag?photoId="+vm.photoId+"&userGroupId="+vm.selectUgId+"&projectId="+vm.projId;
            // returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            // formData.append('token',vm.token);
            // formData.append('projId',vm.projId);
            //  formData.append('type',1);
            formData.append('file',vm.filesList);
            // formData.append('userId',vm.userId);
            // formData.append('modelCode','006');
            // formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                // url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',
                url:vm.BDMSUrl + 'detectionInfo/addPhotoTag',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId,
                    userGroupId:vm.selectUgId,
                    photoId:vm.photoId
                },
                data:formData,
            }).then((response)=>{
                if(response.data.cd=='0'){
                    vm.imageName ='未选择任何文件'
                    vm.filesList = null;
                    vm.uploadshow=false;
                    vm.setSpotPicShow=false;
                    this.getTagList();
                    // this.getAllMonitorPoint();
                    this.$message({
                        type:'success',
                        message:'点位图片上传成功'
                    })
                    document.getElementById("fileInfo1").value="";
                    // this.addPhotoTag();
                    // this.monitorPointInfo=response.data.rt;
                    // this.$refs.pic.loadPoints(this.monitorPointInfo);
                }
            }).catch((err)=>{
                vm.des = ''
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        },
        //更换图片标记
        updateTagFile(){
             var vm=this;
            if(vm.filesList == null){
               vm.$message({
                   type:'error',
                   message:'请选择文件！'
               })
               return false
           }
            // var returnUrl = vm.BDMSUrl+"detectionInfo/addPhotoTag?photoId="+vm.photoId+"&userGroupId="+vm.selectUgId+"&projectId="+vm.projId;
            // returnUrl = encodeURIComponent(returnUrl);
            // var formData = new FormData()
            // formData.append('token',vm.token);
            // formData.append('projId',vm.projId);
            //  formData.append('type',1);
            formData.append('file',vm.filesList);
            // formData.append('userId',vm.userId);
            // formData.append('modelCode','002');
            // formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                // url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',
                url:vm.BDMSUrl + 'detectionInfo/updateTagFile',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId,
                    photoId:vm.photoId
                },
                data:formData,
            }).then((response)=>{
                if(response.data.cd=='0'){
                    vm.imageName ='未选择任何文件'
                    vm.filesList = null
                    // this.monitorPointInfo=response.data.rt;
                    // this.$refs.pic.loadPoints(this.monitorPointInfo);
                }
            }).catch((err)=>{
                vm.des = ''
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        },
        //开启移动
        enableMove(){
            this.$refs.pic.setDrawCancel();
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick4=true;
            this.moveClick=true;
            this.isClick5=false;
            this.isClick6=false;
            this.isClick7=false;
            this.isClick8=false;
            if(this.picMarkName!="Select_img_Mark"){
                this.$refs.pic.setMoveStatus();
            }
            if(this.picMarkName=="Select_img_Mark"){
                this.$message({
                    type:'info',
                    message:'图片标记不支持该操作'
                })
            }
        },
        //删除点
        deleteDraw(){
            var vm=this;
            if(this.toolShow==false){
                this.$message({
                    type:'info',
                    message:'请先选择一个或多个点位再删除'
                })
            }else{
                this.$refs.pic.setDrawCancel();
                this.isClick1=false;
                this.isClick2=false;
                this.isClick3=false;
                this.isClick4=false;
                this.isClick5=false;
                this.isClick6=true;
                this.isClick7=false;
                this.isClick8=false;
                this.moveClick=false;
                if(this.picMarkName!="Select_img_Mark"){
                    // this.$refs.pic.deleteDraw();
                    axios({
                        url:vm.BDMSUrl+'detectionInfo/deletePointGroup',
                        method:'post',
                        headers:{
                            'token':vm.token
                        },
                        data:this.pointIds,
                    }).then((response)=>{
                        if(response.data.cd==0){
                            this.getAllMonitorPoint();
                            this.getMonitorMainTable();
                            if(this.picMark==true){
                                this.getTagList();
                            }

                            this.isClick6=false;
                            this.isBindPoint=false;
                            this.bindMorePoint=false;
                            this.$message({
                                type:'sucess',
                                message:'删除点位集合成功'
                            })
                        }
                    })
                }
                if(this.picMarkName=="Select_img_Mark"){
                 
                        this.spotPicInfo=[];
                        this.spotPicInfo.push({
                            "coordinateInfo":null,
                            "operationType":2,
                            "photoId":this.photoIdList,
                        });
                            axios({
                                method:'post',
                                url:vm.BDMSUrl+'detectionInfo/editPhotoTag',
                                headers:{
                                    'token':vm.token
                                },
                                params:{
                                    userGroupId:vm.selectUgId
                                },
                                data:this.spotPicInfo
                        }).then((response)=>{
                            if(response.data.cd=='0'){
                                // this.uploadshow=true;
                                this.$message({
                                    type:'success',
                                    message:'删除点位图片成功'
                                })
                                this.spotPicInfo=[];
                                this.getAllMonitorPoint();
                                
                                setTimeout(()=>{
                                    this.getTagList();
                                },400)
                            //    this.picShowMark();
                            }else if(response.data.cd=='-1'){
                                this.$message({
                                    type:'error',
                                    message:response.data.msg
                                })
                            }
                        })
                    }
                
            }
                

        },
        brokenChanged(val){
            // console.log(val,'val000');
         
            var pointId=val.pointGroupData[0].id;
            var status="";
            if(val.pointGroupData[0].isBroken==0){
                status=1
            }else if(val.pointGroupData[0].isBroken==1){
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
        //修复故障
        changeBroken(){
                this.isClick1=false;
                this.isClick2=false;
                this.isClick3=false;
                this.isClick4=false;
                this.isClick5=true;
                this.isClick6=false;
                this.isClick7=false;
                this.isClick8=false;
                this.moveClick=false;
                this.$refs.pic.setDrawCancel();
                 this.getAllMonitorPoint();
                
            if(this.picMarkName!="Select_img_Mark"){
                this.$refs.pic.changeBroken();
            }
            if(this.picMarkName=="Select_img_Mark"){
                this.$message({
                    type:'info',
                    message:'图片标记不支持该操作'
                })
            }
        },
        //获取底图中所有的监测点
        getAllMonitorPoint(){
            var vm=this;
            this.monitorPointInfo=[];
             var data=[];
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/getPointGroups',
                // url:vm.BDMSUrl+'detectionInfo/getAllMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.selectUgId
                    // baseMapId:vm.monitorBaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorPointInfo=response.data.rt;
                    
                   
                    this.monitorPointInfo.forEach((item)=>{
                        data.push(item.id);
                    })
                    if(data.length>0){
                        this.getPointByPointGroupId(data);
                    }
                    else{
                        this.$refs.pic.loadPoints(this.monitorPointInfo);
                        this.$refs.pic.setHeader(this.pointNameValue,this.pointNumValue,this.scaleValue);
                    }
                    
                   
                    
                    // this.getTagList();
                }
            })
        },
        //获取监测内容
        getMonitorItem(){
            var vm=this;
            this.monitorMainItemList=[];
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
                if(response.data.rt.length!=0){
                    this.monitorMainItemList=response.data.rt;
                    this.monitorMainItemList.forEach((item,index)=>{
                        this.$set(item,'spotNum',true)
                        this.defaultCheckedKeys.push(item.id);
                    })

                    // defaultCheckedKeys
                    this.drawItemId=this.monitorMainItemList[0].id;
                    this.drawItemType=this.monitorMainItemList[0].type;
                    this.pointNameValue=this.monitorMainItemList[0].logogram;
                    this.pointNumValue='01';
                    this.getDetectionDirectoryListL(this.monitorMainItemList);
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
        },
        //触发是否展开与伸缩
        retract(){
             if(this.retractImg === shouqiImg){
                this.retractImg = zhankaiImg;
                this.retractText = '展开';
                this.isShow = false;
            }else{
                this.retractImg = shouqiImg;
                this.retractText = '收起';
                this.isShow = true;
            }
        },
         retract1(){
             if(this.retractImg1 === shouqiImg){
                this.retractImg1 = zhankaiImg;
                this.retractText1 = '展开';
                this.isShow1 = false;
            }else{
                this.retractImg1 = shouqiImg;
                this.retractText1 = '收起';
                this.isShow1 = true;
            }
        },
         retract2(){
             if(this.retractImg2 === shouqiImg){
                this.retractImg2 = zhankaiImg;
                this.retractText2 = '展开';
                this.isShow2 = false;
            }else{
                this.retractImg2 = shouqiImg;
                this.retractText2 = '收起';
                this.isShow2 = true;
            }
        },
        retract3(){
             if(this.retractImg3 === shouqiImg){
                this.retractImg3 = zhankaiImg;
                this.retractText3 = '展开';
                this.isShow3 = false;
            }else{
                this.retractImg3 = shouqiImg;
                this.retractText3 = '收起';
                this.isShow3 = true;
            }
        },
        //保存报告选项
        saveReportSetting(){
             var vm=this;
             if(this.coverChecked==true||this.summaryChecked==true||this.spotChecked==true)
             {
                  axios({
                        method:'post',
                        url:vm.BDMSUrl+'detectionInfo/saveReportSetting',
                        headers:{
                            'token':vm.token
                        },
                        data:{
                            baseMapPosition:parseInt(this.pageSelect),//底图位置：1-上部；2-下部
                            coverPath:this.coverPathUrl,
                            optimalizationSchema:parseInt(this.priorityLayout),//优化方案：1-测点顺序优先；2-图面清晰优先
                            suggestion:this.suggestList,//建议概述
                            useBaseMap:this.showBaseImg==false?0:1,//是否展示底图：0-否；1-是
                            useCover:this.coverChecked==false?0:1,//是否使用封面：0-否；1-是
                            useOptimalization:this.optimalLayout==false?0:1,//是否优化布局测点：0-否；1-是
                            usePointDetail:this.spotChecked==false?0:1,//是否使用测点详情：0-否；1-是
                            useSuggestion:this.summaryChecked==false?0:1,//是否使用概述：0-否；1-是	
                            userGroupId:this.selectUgId,//群组ID
                            generateQrcode:this.qcodeChecked==false?0:1,//是否使用二维码
                        }
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            this.$message({
                                type:'success',
                                message:'保存设置成功'
                            })
                            this.reportShow=true;
                            // this.pageSelect='';
                            // this.priorityLayout='';
                            // this.suggestList='';
                            // this.showBaseImg=false;
                            // this.coverChecked=false;
                            // this.optimalLayout=false;
                            // this.spotChecked=false;
                            // this.summaryChecked=false;
                            // this.coverPathUrl='';
                        }
                    })
             }else{
                this.$message({
                     type:'info',
                     message:'以下三项勾选内容中，用户最少应该勾选其中一项'
                 })
             }
        },
        //
        exportReport(id,value1,value2,companyValue,BaseMapId){
            this.getReportDatas();
            this.getReportSetting();
            this.getMonitorMainTable();//获取监测内容主表
            var vm=this;
            var routerDataUrl='';
            if(value1<value2)
            {
                this.$message({
                    type:'info',
                    message:'参考时刻都必须早以当前时间，并且晚于当前群组首次采集数据的时间'
                })

            }else{
                routerDataUrl=vm.$router.resolve({
                            path:'/pdfPreview',query:{ugselectId:id,consultValue:this.timeMethod(value1),userValue:value2,monitorCompany:companyValue,monitorBaseMapId:BaseMapId}
                        })
                window.open(routerDataUrl.href,'_blank',);
                this.exportrEportsShow=false;
             }
            // this.getPdf();
           

        },
        //获取报告所需的数据
        getReportDatas(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getReportDatas',
                headers:{
                    'token':vm.token
                },
               params:{
                   userGroupId:this.selectUgId,
                   beforeDate:this.timeMethod(this.consultValue),
                   referenceDate:this.userValue
               }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getReportDatasList=response.data.rt;
                  
                }
            })
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
                    userGroupId:this.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
              
                    this.getReportSettingList=response.data.rt;
                    
                    this.pageSelect=this.getReportSettingList.baseMapPosition==1?"1":"2";//底图位置：1-上部；2-下部
                    this.coverPathUrl=this.getReportSettingList.coverPath;
                  
                    this.priorityLayout=this.getReportSettingList.optimalizationSchema==1?"1":"2";//优化方案：1-测点顺序优先；2-图面清晰优先
                    
                    this.suggestList=this.getReportSettingList.suggestion;//建议概述
                    this.showBaseImg=this.getReportSettingList.useBaseMap==0?false:true;//是否展示底图：0-否；1-是
                    this.coverChecked=this.getReportSettingList.useCover==0?false:true;//是否使用封面：0-否；1-是
                    this.optimalLayout=this.getReportSettingList.useOptimalization==0?false:true;//是否优化布局测点：0-否；1-是
                    this.spotChecked=this.getReportSettingList.usePointDetail==0?false:true;//是否使用测点详情：0-否；1-是
                    this.summaryChecked=this.getReportSettingList.useSuggestion==0?false:true;//是否使用概述：0-否；1-是	
                    this.qcodeChecked=this.getReportSettingList.generateQrcode==0?false:true;
                    this.isShow1=true;
                    this.isShow2=true;
                    this.isShow=true;
                    this.isShow3=true;
                    this.basePicShow=true;
                    this.firstMethodShow=true;
                    // userGroupId=this.selectUgId,//群组ID

                   
                }
            })
        },
        //保存封面底图
        saveBasePic(){
            var vm=this;
            var formData = new FormData();
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
            formData.append('type',1);
            formData.append('file',vm.fileListCover);
            formData.append('userId',vm.userId);
            formData.append('modelCode','100');
            axios({
                    method:'POST',
                    url:vm.QJFileManageSystemURL+ 'uploading/file',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    },
                    data:formData,
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            // this.getBaseMapList();
                            alert('上传成功');
                            // vm.fileList = '';
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                             vm.fileListCover ='';
                        }
                    })
        },
        uploadCoverPic(){

        },
        addCover(file){
            var vm=this;
            const list = vm.$refs.drawingsInfo1.files;
            this.fileListCover=list[0];
           
             this.imgUrl =window.URL.createObjectURL(list[0]);
         
              var formData = new FormData();
            formData.append('token',vm.token);
            formData.append('projectId',vm.projId);
            formData.append('type',1);
            formData.append('file',vm.fileListCover);
            formData.append('userId',vm.userId);
            formData.append('modelCode','100');
            axios({
                    method:'POST',
                    url:vm.QJFileManageSystemURL+'uploading/file',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                    // url:'http://10.252.29.13:8060'+'/uploading/file',
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    },
                    data:formData,
                    }).then((response)=>{
                        if(response.data.result==true){
                            
                            // this.getBaseMapList();
                            this.coverPathUrl=response.data.obj.filePath;
                            // vm.fileList = '';
                        }else{
                             vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                             vm.fileListCover ='';

                        }
                    })
        },
        //
        showBaseImgCheck(){
            if(this.showBaseImg==true){
                this.pageSelect='1';
                this.basePicShow=true;
            }else{
                this.pageSelect='';
                this.basePicShow=false;
            }
        },
        //
        optimalLayoutCheck(){
            if(this.optimalLayout==true){
                this.priorityLayout='1';
                this.firstMethodShow=true;
            }else{
                 this.priorityLayout='';
                 this.firstMethodShow=false;
            }

        },
        //封面按钮
        coverCheckedChange(){
            if(this.coverChecked==true){
                this.isShow=true;
                this.retractImg = shouqiImg;
                this.retractText = '收起';
            }else {
                this.isShow=false;
                 this.retractImg = zhankaiImg;
                this.retractText = '展开';
            }
        },
        //概述按钮
        summaryCheckedChange(){
             if(this.summaryChecked==true){
                this.isShow1=true;
                this.retractImg1 = shouqiImg;
                this.retractText1 = '收起';
            }else {
                this.isShow1=false;
                 this.retractImg1 = zhankaiImg;
                this.retractText1 = '展开';
            }
        },
        spotCheckedChange(){
            if(this.spotChecked==true){
                this.isShow2=true;
                this.retractImg2 = shouqiImg;
                this.retractText2 = '收起';
            }else {
                this.isShow2=false;
                this.retractImg2 = zhankaiImg;
                this.retractText2 = '展开';
            }
        },
        qcodeCheckedChange(){
            if(this.qcodeChecked==true){
                this.isShow3=true;
                this.retractImg3 = shouqiImg;
                this.retractText3 = '收起';
                this.generateQrcode=1;
            }else {
                this.isShow3=false;
                this.retractImg3 = zhankaiImg;
                this.retractText3 = '展开';
                this.generateQrcode=0;
            }
            this.generateReportNumber();
        },
        //获取批量导入匹配结果和表名、类型对应关系
        getBatchImportMatchingResult(){

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
                    userGroupId:vm.selectUgId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.onlyNum=response.data.rt;
                }
            })
        },
        //获取斜度曲线
        getPitchDetailDataBySeqId(num){
            axios({
                url:this.BDMSUrl+'detectionInfo/getPitchDetailDataBySeqId',
                headers:{
                    'token':this.token
                },
                params:{
                    seqId:num
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    if(response.data.rt){
                        this.pitchDetailDataListLeft=response.data.rt;
                        if(this.pitchDetailDataListLeft.recent2PitchData.length==0){
                            this.$message({
                                type:'info',
                                message:"当前无数据，请导入数据"
                            })
                            return ;
                        }else{
                            this.pitchLineShow=true;
                            // this.totalShow=true;
                            // this.leftShow=true;
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
                                    
                                    setTimeout(()=>{
                                        let lineLeftChart=this.$refs.lineLeftChartOne;
                                        lineLeftChart.delegateMethod('showLoading', 'Loading...');
                                        lineLeftChart.removeSeries();
                                        lineLeftChart.addSeries({name:this.plotGroupName+'-'+this.timeChangeMethodPitch(this.time),data:this.leftDisplayListValueYdata1});
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
                                    
                                    
                                    setTimeout(()=>{
                                        let lineLeftChart=this.$refs.lineLeftChartOne;
                                        lineLeftChart.delegateMethod('showLoading', 'Loading...');
                                        lineLeftChart.removeSeries();
                                        lineLeftChart.addSeries({name:this.plotGroupName+'-'+this.timeChangeMethodPitch(this.time),data:this.leftDisplayListValueYdata1});
                                        lineLeftChart.addSeries({name:this.plotGroupName+'-'+this.timeChangeMethodPitch(this.time1),data:this.leftDisplayListValueYdata2});
                                        lineLeftChart.hideLoading();
                                        lineLeftChart.getChart().xAxis[0].update({categories:this.leftDisplayListValueXdata});
                                    },20)
                                }
                                this.leftDisplayShow==false;
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
                                this.leftMaxVariation=this.getMaxValue(maxVariation)
                                this.leftMaxHeight=this.getMaxValue(maxHeight)
                            } 
                        }
                    }else if(respose.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }

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
    isFullscreen(){
        return document.fullscreenElement ||document.msFullscreenElement  || document.mozFullScreenElement || document.webkitFullscreenElement || false;
    },
    fullSrceen(){
        // console.log(this.isFullscreen(),'是否全屏');
        
        if(this.fullShow==false){
            var full=document.getElementById("planeFigure");
            // window.removeEventListener('resize',(e)=>{
            //     this.resizeHeight();
            // })
            // window.addEventListener('resize',(e)=>{
            //     this.resizeHeight1();
            // })
            this.requestFullscreen(full);
        }else{
            var full=document.getElementById("planeFigure");
            // window.removeEventListener('resize',(e)=>{
            //     this.resizeHeight1();
            // })
            // window.addEventListener('resize',(e)=>{
            //     this.resizeHeight();
            // })
            this.exitFullscreen(full);
        }
        this.fullShow=!this.fullShow
    },
        //全屏封装
      launchIntoFullscreen(element) {
                if(element.requestFullscreen){
                    element.requestFullscreen();
                }
                else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                }
                else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                }
                else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
        },
        requestFullscreen( elem ) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.webkitRequestFullScreen) {
                // 对 Chrome 特殊处理，
                // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
                if ( window.navigator.userAgent.toUpperCase().indexOf( 'CHROME' ) >= 0 ) {
                    elem.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
                }
                // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
                else {
                    elem.webkitRequestFullScreen();
                }
            }
            else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
        },
        //退出全屏
        exitFullscreen() {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
        },
        //html转PDF
        getPdf(){
                let pdfDom = document.querySelector('#pdfImport')
               
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
                            pdf.save('安全监测图纸.pdf');
                          
                        })
                // html2canvas();
            }
    }
    
}
</script>
<style lang="less" scope>
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

               /*
            修改eleUI树形组件
        */
        // .el-tree-node:focus .el-tree-node__content{
        //     background-color: transparent;
        // }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background: none;
        }
        .el-tree{
                color: red;
                background:none;
        }
        // .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{

        // }
        .el-checkbox__input.is-disabled .el-checkbox__inner{
            display: none;
        }
        .el-tree-node__content>.el-checkbox{
                margin-right: 2px;
        }
        .el-tree-node__content>.el-tree-node__expand-icon{
            padding:4px;
        }
        // .el-tree--highlight-current .el-tree-node.is-current .elselect{
        //         background-color: #000;
        // }
        // .el-tree-node__label{
        //     font-size: 12px;
        //     color: #666666;
        //     // padding-left: 22px; 
        //     position: relative;
        // }
        // .el-icon-caret-right:before{
        //     content: "\E604";
        //     color: #999999;
        //     font-weight: bold;
        // }
      
        // .is-leaf:before{
        //     content: ""!important;
        //     // width: 12px;
        //     color: #999999;
        //     display:inline-block;
        //     font-weight: bold;
        // }


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
            // min-height:800px;
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
                                    margin-top:46px;
                                
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
                                .overviewPieLabel{
                                    position: absolute;
                                    top:100px;
                                    left:46%;
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
                                .overviewPieLabel1{
                                    position: absolute;
                                    top:100px;
                                    left:46%;
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
                    margin-top:15px;
                    background: white;
                    .planeFigureHead{
                        height: 32px;
                        position: relative;
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
                         .rotate{
                            // float: right;
                            // position: relative;
                            position: absolute;
                            left:160px;
                            top: -2px;
                            width: 100px;
                            height: 30px;
                            .drawingIcon{
                                        width: 80px;
                                        height: 26px;
                                        cursor: pointer;
                                        position: absolute;
                                    }
                                    .zuoRotate{
                                        left:30px;
                                        top:9px;
                                        background: url('./images/zuox.png')no-repeat 0 0;
                                        &:hover{
                                            background: url('./images/xuanzl.png')no-repeat 0 0;
                                        }
                                    }
                                    .youRotate{
                                        left:70px;
                                        top:9px;
                                        background: url('./images/youx.png')no-repeat 0 0;
                                        &:hover{
                                            background: url('./images/xuanzr.png')no-repeat 0 0;
                                        }
                                    }
                                    .bigRotate{
                                        left:-50px;
                                        top:9px;
                                        background: url('./images/big.png')no-repeat 0 0;
                                        &:hover{
                                            background: url('./images/big1.png')no-repeat 0 0;
                                        }
                                    }
                                    .smallRotate{
                                        left:-10px;
                                        top:9px;
                                        background: url('./images/small.png')no-repeat 0 0;
                                        &:hover{
                                            background: url('./images/small1.png')no-repeat 0 0;
                                        }
                                    }
                                    .el-icon-rank{
                                        font-size:25px;
                                        margin-left:20px;
                                        margin-top:5px;
                                        transform: rotate(45deg); 
                                        color:#ccc;
                                        &:hover{
                                            color:red;
                                        }

                                    }

                        }
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
                        .planeFigureHeadRight{
                            float: right;
                            .exportSaveBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                                margin-left:10px;
                            }
                            .uploadPicBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
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
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                                margin-right: 10px;
                            }
                            .bottomMap{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                                margin-right: 10px;
                            }
                            .drawLineBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                                margin-right: 10px;
                            }

                        }
                        .planeFigureHeadRightHide{
                            float:right;
                            // position: relative;
                            .pointName{
                                width: 70px;
                                height:26px;
                                // background: #fafafa;
                                padding-left: 6px;
                                // box-sizing: border-box;

                            }
                            .pointNum{
                                width: 70px;
                                height:26px;

                                // background: #fafafa;
                                padding-left: 6px;
                                margin-right:5px;
                                // box-sizing: border-box;
                            }
                            #inspectContentSel{
                                // display: inline-block;
                                // float: right;
                                // margin-top:-40px;
                                // margin-right:10px;
                                // width: 168px;
                                // height: 30px;
                                position: relative;
                                
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
                                    // float: left;
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
                                        top: 5px;
                                        right: 30px;
                                }
                                

                            }
                            .bottomMap{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .editNumSpot{
                                display: inline-block;
                                width: 75px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;

                            }
                            .singleSpot{
                                display: inline-block;
                                width: 52px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .inputText2{
                                display: inline-block;
                                width: 52px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .inputText3{
                                display: inline-block;
                                width: 100px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 14px;
                                line-height: 24px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .inputText1{
                                display: inline-block;
                                width: 52px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #fff;
                                font-size: 14px;
                                line-height: 24px;
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
                        // height: 600px;
                        width: 100%;
                        position: relative;
                        .noDataFigure{
                            height: 640px;
                            width: 100%;
                            // margin:0 auto;
                            // border: 1px solid #ccc;
                            position: absolute;
                            top:0px;
                            left:0px;
                            z-index:1000;
                            background:#fff;
                            padding:3px;

                        }
                        .operateTool{
                            width: 300px;
                            height: 34px;
                            // border:1px solid #ccc;
                            float: right;
                            margin-top:15px;
                            margin-right:10px;
                            position: relative;
                            z-index: 10;
                            .operateToolLeft{
                                width:200px;
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
                                     cursor: pointer;
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
                                    cursor: pointer;
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
                                    left:68%;
                                    width: 30%;
                                    border-left:1px dashed #ccc;
                                    cursor: pointer;
                                    .deleteDrawIcon{
                                        background: url('./images/delete.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('../../assets/delete.png') no-repeat 0 0;
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
                                    border-right:1px dashed #ccc;
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
                                    font-size:12px;
                                    color:#666666;
                                    line-height: 32px;
                                    cursor: pointer;
                                }
                            }

                        }
                        .planeFigureGround{
                            z-index: 8;
                            // height: 590px;
                            // height:580px;
                            height: 100%;
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
                            left:35px;
                            z-index:11;
                            #fileTree{
                                // height: 500px;
                                overflow: auto;
                                width: 200px;
                                // z-index:-1000;
                            }
                            // ul{
                            //     height: 500px;
                            //     overflow: auto;
                            //     width: 200px;
                                
                            // }

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
                    margin-top:20px;
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
                                    font-size: 14px;
                                    line-height: 24px;
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
                                    font-size: 14px;
                                    line-height: 24px;
                                    vertical-align: middle;
                                    color:#666666;
                                    border-radius: 2px;
                                    cursor: pointer;
                                }
                        }

                    }
                    .inspectTableBody1{
                        .inspectTableList1{
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
                                    border-bottom: 1px solid #e6e6e6;
                                }
                            }
                        }
                    }
                    .inspectTableBody{
                            width: 100%;
                            height: 100px;
                            overflow: auto;
                        .inspectTableList{
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
                                    border-bottom: 1px solid #e6e6e6;
                                }
                            }
                            tbody{
                                height: 50px;
                                overflow: auto;
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
                                        border-bottom: 1px solid #e6e6e6;
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
                                .leftTxtOneBtn{
                                    background: #fc3439;
                                    margin-right: 20px;
                                    color: #fff;
                                    font-size: 14px;
                                    font-weight: normal;
                                    line-height: 28px;
                                    display: inline-block;
                                    width: 100px;
                                    height: 28px;
                                    border: none;
                                    padding: 0;
                                    cursor: pointer;
                                    border-radius: 2px;
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
            .addContent{
                width: 80px;
                height:30px;
                padding:4px;
                background:#ff5257;
                // border:1px solid #fcfcfc;
                border-radius: 2px;
                float: right;
                margin-right:15px;
                margin-bottom: 10px;
                color:#fff;
                cursor: pointer;
            }
            .configTable{
                width:96%;
                margin:0 auto;
                table{
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
                            // td{

                            // }
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
            }

            .editBtnSstyle{
                position:absolute;
                bottom:40px;
                left:44px;

            }

            .upInput{
                    display: none;
                }
            /* 上传文件按钮 */
            .imageBody{
                text-align: left;
            }
            .imageBody .imageBodyText{
                    color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    display: inline-block;
                    margin-right: 20px;
                    margin-left: 94px;
                    text-align: right;
            }
            .updataImageSpan{
                overflow: hidden;
                width: 98px;
            }
            .updataImageSpan input{
                position: absolute;
                left: 0px;
                top: 0px;
                opacity: 0;
                /* -ms-filter: 'alpha(opacity=0)'; */
            }
            .baseMapBody{
                height: 460px;
                overflow: auto;
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
                        opacity: 0.8;
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
            .exportIcon{
                width: 18px;
                height: 16px;
                border: none;
                cursor: pointer;
                margin-left: 10px;
                background: url('./images/overviewdown.png') no-repeat 0 0;
                display: inline-block;
                margin-right: 5px;
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
                top: 224px;
                right: 293px;
            }
            .icon-sanjiaoT {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 118px;
                right: 204px;
            }
            .icon-sanjiaoB {
                 display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 120px;
                right: 290px;

            }
            .icon-sanjiaoA{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 118px;
                right: 295px;
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
                top: 167px;
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
                top: 476px;
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
            .sanjiaoicon{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 356px;
                right: 244px;
            }
            .sanjiaoicon1{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 600px;
                right: 244px;
            }
            .editEportBody{
                margin:0 auto;
                width: 92%;
                height: 420px;
                overflow: auto;
                .editEportBodyone{
                   
                    .oneTxt{
                        height: 30px;
                        text-align: left;
                        line-height: 30px;
                        font-size: 14px;
                        color: #666666;
                        font-weight: bold;
                        border-bottom: 1px solid #ccc;
                    }
                    .timeInp{
                        width: 100%;
                        margin-top:10px;
                        .timeTxt{
                            height: 30px;
                            line-height: 30px;
                            font-size: 14px;
                            text-align: left;
                            color:#666666;
                            .label1{
                                margin-left:30px;
                            }  
                        }
                    }
                }
                .editEportBodytwo{
                    margin-top:20px;
                    .head{
                         height: 30px;
                          border-bottom: 1px solid #ccc;
                          position: relative;
                         .elCheck{
                             float: left;
                             left:20px;
                            //  position: absolute;
                            //  text-align: left;
                            line-height: 30px;
                             font-size: 16px;
                         }
                         .groundSpan{     
                            color: #336699;
                            font-size: 14px;
                            font-weight: normal;
                            cursor: pointer;
                            float: right;
                            .groundEdit{
                                 display: inline-block;
                                margin-right: 10px;
                            }
                         }
                    }
                    .imgBody{
                        width: 90%;
                        margin:15px auto;
                        height: 70px;
                        // position: relative;
                        .imgBodyLeft{
                            position: relative;
                            float: left;
                            width: 49%;
                            width: 240px;
                            // left:20px;
                            height: 60px;
                            border:1px solid #ccc;
                            border-radius: 3px;
                            margin-left:12px;
                            .upInput1{
                                display: none;
                            }
                            .imgMask{
                                 display: block;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: #999999;
                                opacity:0.5;
                                position: absolute;
                                visibility: hidden;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                .hoverAdd{
                                    width: 20px;
                                    margin-right: 10px;
                                }
                            }
                            .logo{
                                width: 139px;
                                height: 42px;
                            }
                        }
                        .imgBodyLeft:hover >.imgMask{
                            visibility:visible;
                        }
                        .imgBodyRight{
                            float: right;
                            // position: absolute;
                            right:20px;
                            height: 65px;
                            width: 49%;
                            width: 260px;
                            border:1px solid #ccc;
                            border-radius: 3px;
                        }
                    }
                    .textBody{
                        width: 90%;
                         margin:15px auto;
                         height:110px;
                        label{
                            color:#333333;
                            font-size: 14px;
                            height: 30px;
                            line-height: 30px;
                            text-align: left;
                            float:left;
                        }
                        .areaBody{
                            textarea{
                                height: 70px;
                                width: 100%;
                                border-radius: 2px;
                            }
                        }
                    }
                    .selectMap{
                         width: 90%;
                         margin:15px auto; 
                        //  height: 120px;
                        .map_txt{
                            .map_check{
                                display: block;
                                text-align: left;
                                 height: 30px;
                                // float: left;
                            }
                            .map_check1{
                                 display: block;
                                text-align: left;
                                margin-left:20px;
                                height: 30px;

                            }
                        }
                    }
                    .qrcodeBody{
                        width: 90%;
                        height: 110px;
                        margin:10px auto; 
                        position: relative;
                        img{
                            // line-height: 110px;
                            top:20px;
                            left:40px;
                            position: absolute;
                        }
                        .onlyNumStyle{
                            position: absolute;
                            line-height: 110px;
                            font-size: 14px;
                            left:150px;
                            top:10px;
                            color:#666666;
                        }
                    }
                }
            }
        }
        .pdfStyle{

        }
       

    }



</style>

