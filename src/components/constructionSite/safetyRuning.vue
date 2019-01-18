<template>
    <div id="safetyChecking">
        <!-- 打印标签提交表单 -->
        <form id="taskIndedxPrint-qrcode" action="http://127.0.0.1:54321/qblabel/general" method="post" enctype="multipart/form-data" target="printLabel">
                <input type="hidden" name="p" ref="taskIndedxLabelContent">
        </form>
        <iframe id="printLabel" name="printLabel" src="about:blank" style="display:none;"></iframe>

            <div class="topHeader">
                <div id="item-box-file">
                    <!-- <router-link :to="'/constructionSite/safetyInspection'" class="label-item">  
                    安全监测
                    </router-link>
                    <router-link :to="'/constructionSite/safetyCheckings'" class="label-item">  
                    安全检查  
                    </router-link>
                    <router-link :to="'/constructionSite/safetyRuning'" class="label-item label-item-active">  
                    安全巡检  
                    </router-link>
                    <router-link :to="'/constructionSite/remoteVideo'" class="label-item">  
                    远程视频  
                    </router-link> -->
                    <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                    </router-link>
                </div>
                <div id="project" v-show="showSafetyCheck">
                    <div class="project_left">
                        <div class="information">
                            <h5 class="basic_information"><img class=imgIcon src="./images/information.png">基本信息</h5>
                            <div class="information_table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>项目名称</th>
                                            <th>检查频率</th>
                                            <th>负责单位</th>
                                            <th>负责人</th>
                                            <th>检查单位</th>
                                            <th>检查负责人</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="checkItemDataList">
                                            <td v-text="checkItemDataList.item.itemName"></td>
                                            <td v-text="$options.filters.checkFrequencyChange(checkItemDataList.item.checkFrequency)"></td>
                                            <td v-text="checkItemDataList.respDeptName"></td>
                                            <td v-text="checkItemDataList.respUserName"></td>
                                            <td v-text="checkItemDataList.checkDeptName"></td>
                                            <td v-text="checkItemDataList.checkUserName"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="checkSite">
                            <h5 class="checkSite_header"><img class=imgIcon src="./images/checksite.png">检查点位列表</h5>
                            <div class="checkLabelBtn">
                                <div class="btn" @click="printAllLabel" >打印全部标签</div>
                                <div class="btn1" @click="editSite">编辑点位</div>
                            </div>
                            <div class="checkSite_table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>位置</th>
                                            <th>安全状态</th>
                                            <th>检查时间</th>
                                            <th>检查人</th>
                                            <th>待查状态</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr :class="{'check':index==isshow}" v-for="(item,index) in checkPointsByItemIdList" :key="index" @click="checkItem(index)">
                                            <td>{{index+1}}</td>
                                            <td>{{item.checkPoint.name}}</td>
                                            <td>{{item.checkRecord.currCheckStatus|securityStatusChange()}}</td>
                                            <td>{{item.checkRecord.checkTime | changeTime()}}</td>
                                            <td>{{item.checkUserName | nameChange()}}</td>
                                            <td>{{item.checkRecord.expectCheckStatus|expectCheckStatusChange()}}</td>
                                            <td>
                                                <button class="printLabelBtn actionBtn" @click.stop="printLabel(item.checkRecord.id)" title="打印标签"></button>
                                                <!-- @click.stop="printLabel(item.checkRecord.id)" -->
                                                <button class="checkBtn actionBtn" @click.stop="srCheck(item.checkPoint.id)" title="检查"></button>
                                                <button class="deleteBtn actionBtn" @click.stop="deleteCheckPoint(item.checkPoint.id)" title="删除"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span v-show="dataShow">
                                    <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                                    <p style="font-size:16px;color:#ccc">暂无数据</p>
                                </span>
                            </div>
                             <!--以下是page-navigitation-->
                            <div class="datagrid-pager pagination">
                                <table cellspacing="0" cellpadding="0" border="0" >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                                    <option value="4">4</option>
                                                    <option value="8">8</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </td>
                                            <td>
                                                    <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,true)"></a>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,true)"></a>
                                            </td>
                                            <td>
                                                    <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <span  class="pagination-title" style="padding-left:5px;">第</span>
                                            </td>
                                            <td>
                                                    <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                                            </td>
                                            <td>
                                                <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial.total/pageDetial.pagePerNum)}}页</span>
                                            </td>
                                            <td>
                                                <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,true)"></a>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,true)"></a>
                                            </td>
                                            <td>
                                                <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" @click="getCheckPointsByItemId" class="btn-refresh btn-TAB"></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="bottom_table">
                                <div class="header_text">
                                    <span class="text">点位【{{checkPointName}}】检查记录</span>
                                    <div class="selectBtn">
                                        <span class="pre_btn" @click="getPreviousCheckRecord()">上一条</span>
                                        <span class="next_btn" @click="getNextCheckRecord()">下一条</span>
                                    </div>
                                </div>
                                <div class="header_body">
                                    
                                        <span class="text">检查序号：</span><span class="value">{{checkId}}</span>
                                        <span class="text">状态：</span><span class="value">{{currCheckStatus|securityStatusChange()}}</span>
                                        <span class="text">检查人：</span><span class="value">{{checkUserName|nameChange()}}</span>
                                        <span class="text">检查时间：</span><span class="value">{{checkTime | changeTime()}}</span>
                                
                                    <ul id="checkPics" style="overflow: auto;"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="project_right">
                        <div class="checkProjectList_header">
                            <span class="text">检查项目目录</span>
                            <span class="clearfix_icon">
                                <i class="icon-goujian icon-add" @click="addCheckItemNode" title="添加"></i>
                                <i class="icon-goujian icon-edit" @click="renameFile"  title="更名"></i>
                                <i class="icon-goujian icon-delete" @click="deleteItemNode"  title="删除"></i>
                            </span>
                        </div>
                        <div class="tree">
                            <el-tree id="treeData" ref="treeData" :highlight-current="true" :expand-on-click-node="false"  node-key="id" :empty-text="'内容为空'" :data="loadzTreeDataList"  :props="defaultProps" @node-click="nodeClick">
                            </el-tree>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="labelListShow"  id="edit" class="dialog">
                    <div class="el-dialog__header">
                        <span class="el-dialog__title">标签信息预览</span>
                        <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListCancle">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                        </button>
                    </div>
                    <div class="el-dialog__body">
                        <div class="editBody">
                            <ul>
                                <li v-for="(item,index) in checkPointsForPageList" :key="index" class="item-label clearfix">
                                    <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-CP-' + addZero(item.id, 7)" alt="">
                                    <div class="right">
                                        <p class="item-list clearfix">
                                            <span class="text-left">点位名称：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,item.name)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">安全类别：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查项目：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查频率：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respUserName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkUserName)"></span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <!-- <el-pagination background v-if="!singleLable" layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                            @current-change="getCheckPointsForPage()" 
                            @prev-click="getCheckPointsForPage()"
                            @next-click="getCheckPointsForPage()"
                            :total="pageLabelList.total">
                            </el-pagination> -->
                        </div>
                    </div>
                    <div class="el-dialog__footer">
                        <div slot="footer" class="dialog-footer">
                            <button class="editBtnS" @click="pageAllView">网页预览</button> 
                            <button class="editBtnC" @click="printAllCurrentLabel">打印当前页标签</button>
                        </div>
                    </div>
            </div>
            <div v-if="labelListSingleShow"  id="edit" class="dialog">
                    <div class="el-dialog__header">
                        <span class="el-dialog__title">标签信息预览</span>
                        <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListSingleCancle">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                        </button>
                    </div>
                    <div class="el-dialog__body"  style="height:280px">
                        <div class="editBody">
                            <ul>
                                <li v-for="(item,index) in checkPointsForPageSingleList" :key="index" class="item-label clearfix">
                                    <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-CP-' + addZero(item.checkPoint.id, 7)" alt="">
                                    <div class="right">
                                        <p class="item-list clearfix">
                                            <span class="text-left">点位名称：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,item.checkPoint.name)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">安全类别：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查项目：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查频率：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respUserName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkUserName)"></span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <!-- <el-pagination background v-if="!singleLable" layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                            @current-change="getCheckPointsForPage()" 
                            @prev-click="getCheckPointsForPage()"
                            @next-click="getCheckPointsForPage()"
                            :total="pageLabelList.total">
                            </el-pagination> -->
                        </div>
                    </div>
                    <div class="el-dialog__footer">
                        <div slot="footer" class="dialog-footer">
                            <button class="editBtnS" @click="pageView">网页预览</button> 
                            <button class="editBtnC" @click="printCurrentLabel">打印当前页标签</button>
                        </div>
                    </div>
            </div>
            <div id="mask" v-if="labelListShow||labelListSingleShow" ></div>
            <div id="edit">
                <el-dialog width="400px" title="安全状态修改" :visible="securityStatusShow" @close="srStatusCancle">
                    <div class="editBody">
                        <div class="editBodytwo" style="margin-left:1px;">
                            <el-radio v-model="securityStatus" label="1">确认安全</el-radio>
                        </div>
                        <div class="editBodytwo" style="margin-left: 1px;">
                            <el-radio v-model="securityStatus"  label="2">需要整改</el-radio>
                        </div>
                        <div class="editBodytwo" style="margin-left: 1px;">
                            <el-radio v-model="securityStatus"  label="3">急需整改</el-radio>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="srStatusConfirm">确定</button>
                        <button class="editBtnC" @click="srStatusCancle">取消</button>
                    </div>
                </el-dialog>

                <el-dialog title="重命名目录" :visible.sync="fileNameShow" @close="addfileCancle">
                    <div class="editBody">
                        <div class="editBodytwo imageBody">
                            <label class="imageBodyText">目录名称 :</label>
                            <input type="text" class="inp" v-model="newFileName">
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addfileConfirm">确认</button>
                        <button class="editBtnC" @click="addfileCancle">取消</button>
                    </div>
                </el-dialog>

                <el-dialog width="500px" title="添加安全检查项目" :visible="addCheckItemNodeShow" @close="addCheckItemNodeCancle">
                    <div class="editBody">
                        <div class="editBodytwo">
                            <label class="parentItem">父级项目:</label>
                            <label class="parentValue">{{this.parentItemName}}</label>
                        </div>
                        <div class="editBodytwo">
                                <label class="itemName">项目名称:</label>
                                <input class="itemInp" v-model="projectName"/>
                        </div>
                        <div class="editBodytwo">
                            <label>检查频率:</label>
                            <el-select v-model="checkFrequency">
                                <el-option v-for="item in checkFrequencyList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </div>
                        <div class="editBodytwo">
                            <label>负责单位:</label>
                            <el-select v-model="respDept" @change="respDeptChange">
                                <el-option v-for="item in manageUserList" :key="item.ugId" :value="item.ugId" :label="item.ugName"></el-option>
                            </el-select>
                        </div>
                        <div class="editBodytwo">
                            <label>负责人:</label>
                            <el-select v-model="respUser">
                                <el-option v-for="item in personInChargeByDeptList" :key="item.userId" :value="item.userId" :label="item.userName" ></el-option>
                            </el-select>
                        </div>
                        <div class="editBodytwo">
                            <label>检查单位:</label>
                            <el-select v-model="checkDept" @change="checkDeptChange" >
                                <el-option v-for="item in manageUserList" :key="item.ugId" :value="item.ugId" :label="item.ugName"></el-option>
                            </el-select>
                        </div>
                        <div class="editBodytwo">
                            <label>检查人:</label>
                            <el-select v-model="checkUser">
                                <el-option v-for="item in personInChargeByDeptList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
                            </el-select>
                        </div> 
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addCheckItemNodeConfirm">确定</button>
                        <button class="editBtnC" @click="addCheckItemNodeCancle">取消</button>
                    </div>
                </el-dialog>

                <el-dialog width="400px" title="点位编辑" :visible="spotEditDialog" @close="spotEditCancle">
                    <div class="editBody">
                        <div class="editBody_left">
                            <table>
                                <thead>
                                    <tr>
                                        <th>点位</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr :class="{'tdBackground':item.id==tdValue}" id="checkPointId" v-for="(item,index) in checkPointsList" :key="index" @click="checkTable(item.id)" >
                                        <!-- 此处逻辑复杂，得慢慢捋清楚 -->
                                        <!-- v-show="!(tdValue==item.id)" -->
                                        <td ><span v-show="!(item.id==rwriteShowId)">{{item.name}}</span><input v-show="showTd&&!item.id||rwriteShow&&tdValue==item.id" v-model="checkPointTdName" id="tdInput" type="text"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="editBody_right">
                            <div class="editBody_right1">
                                <span class="newFile actionBtn" @click="newTabFile">新建</span>
                                <span class="deleteFile actionBtn" @click="deleteTabCheckPoint">删除</span>
                                <span class="editFile actionBtn" @click="rwrite()">重命名</span>
                            </div>
                            <div class="editBody_right2">
                                <span class="makeSureFile actionBtn" @click="addCheckPoint()">确认</span>
                                <span class="resetFile actionBtn" @click="checkPointCancel()">撤销</span>
                            </div>
                            <div class="editBody_right3">
                                <span class="closeFile actionBtn" @click="newFileClose()">关闭</span>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <!-- <button class="editBtnS" @click="spotEditConfirm">确定</button>
                        <button class="editBtnC" @click="spotEditCancle">取消</button> -->
                    </div>
                </el-dialog>
            </div>
            <div id="inital">
                <!-- 检查点位删除 -->
                <el-dialog  :visible.sync="deleteCheckPointDialog" width="398px" @close="deleteCheckPointClose">
                    <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                    <p class="deleteDialogWarning">删除提醒</p>
                    <p class="deleteDialogText">确定要删除选定的检查点位吗？该操作会删除该点位下所有的检查记录！</p>
                    <div slot="footer" class="dialog-footer">
                        <button class="deleteBtn" @click="deleteCheckPointMakeSure">确认</button>
                        <button class="cancelBtn" @click="deleteCheckPointClose">取消</button>
                    </div>
                </el-dialog>
                <!-- 删除检查项目节点 -->
                <el-dialog  :visible.sync="deleteItemNodeDialog" width="398px" @close="deleteItemNodeClose">
                    <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                    <p class="deleteDialogWarning">删除提醒</p>
                    <p class="deleteDialogText">确定要删除当前检查项目节点吗？</p>
                    <p class="deleteDialogCare">注意：所有与当前项目节点关联的检查点位、点位的检查记录都将被删除，并且不可恢复！</p>
                    <div slot="footer" class="dialog-footer">
                        <button class="deleteBtn" @click="deleteItemNodeMakeSure">确认</button>
                        <button class="cancelBtn" @click="deleteItemNodeClose">取消</button>
                    </div>
                </el-dialog>
            </div>
    </div>
</template>
<script>
import axios from 'axios'
import data from '../Settings/js/date.js'
import moment from 'moment'
export default {
    name:'safetyChecking',
    data(){
        return{
            routerList:'',
            moduleList:'',
            dataShow:true,
            entType:'',
            ugId:'',
            checkItemDataList:'',
            checkPointsByItemIdList:'',
            pointTotal:'',
            checkPointsForPageList:'',
            checkPointsForPageSingleList:[],//单个二维码
            checkPointsList:'',
            checkPointsListLength:'',
            checkPointTdName:'',
            pointsForPagePager:'',
            loadzTreeDataList_original:'',//原始树形图
            loadzTreeDataList:[],
            itemId:-1,
            page:1,//默认
            rows:8, //默认
            showSafetyCheck:true,
            defaultProps:{
                children: 'children',
                label: 'itemName'
            },
             pageDetial:{
                pagePerNum:8,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            isshow:0,
            labelListShow:false,
            labelListSingleShow:false,
            deleteCheckPointDialog:false,
            deleteItemNodeDialog:false,
            pageLabelList:{
                pagePerNum:20,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            singleLable:false,
            securityStatus:'',
            securityStatusShow:false,
            fileNameShow:false,//重命名显示
            newFileName:'',//重命名数据
            addCheckItemNodeShow:false,
            spotEditDialog:false,
            itemName:'',
            checkFrequency:0,//检查频率
            respDept:'',//负责部门/单位
            respUser:'',//负责人
            checkDept:'',//检查部门/单位
            checkUser:'',//检查人
            manageUserList:'',//项目管理用户列表
            personInChargeByDeptList:'',//项目管理的用户
            checkFrequencyList:[
                {
                    value:0,
                    label:'每天'
                },
                {
                    value:1,
                    label:'每隔一天'
                },
                {
                    value:2,
                    label:'每周两次'
                },
                {
                    value:3,
                    label:'每周一次'
                },
                {
                    value:4,
                    label:'两周一次'
                },
                {
                    value:5,
                    label:'每月一次'
                },
                {
                    value:6,
                    label:'两月一次'
                },
                {
                    value:7,
                    label:'三月一次'
                }
            ],
            byDeptId:'',
            parentItemId:0,
            addNodeparentItemId:'',
            itemLength:'',
            parentItemName:'',
            projectName:'',
            checkId:'',
            currCheckStatus:'',
            checkPointName:'',
            checkPointId:'',
            checkUserName:'',
            checkTime:'',
            list:'',
            list1:'',
            tdValue:'',
            showTd:false,
            rwriteShow:false,
            rwriteShowId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            UPID:'',
        }
    },
    created(){
        var vm = this;
        // vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        vm.projName = localStorage.getItem('projName');
        vm.UPID = vm.$store.state.UPID
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'))
        this.loadingTitle()
        vm.getSecurityCheck();
        vm.loadzTreeData();
        vm.getCheckPointsByItemId();
        // vm.getCheckItemData();
    },
    mount(){

    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.getCheckPointsByItemId()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.getCheckPointsByItemId()
        },
    //     'pageDetial.currentPage':function(val,oldval){
    //       var vm = this
    //       vm.getCheckPointsForPage()
    //   },
    //   'pageDetial.pagePerNum':function(val,oldval){
    //       var vm = this
    //       vm.getCheckPointsForPage()
    //   },
    //   'respDept':function(val){
    //       var vm=this
    //       vm.getPersonInChargeByDept()
    //   },
    //   'checkDept':function(val){
    //       var vm=this
    //       vm.getPersonInChargeByDept()
    //   }

    },
    filters:{
        changeTime(val){
            if(val==''){
                return ''
            }else {
                return moment(val).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        nameChange(val){
            if(val==null){
                val='系统'
            }
            return val;
        },
        checkFrequencyChange(val){
            switch(val)
            {
                case 0:
                return val='每天';
                break;
                case 1:
                return val='每隔一天';
                break;
                case 2:
                return val='每周两次';
                break;
                case 3:
                return val='每周一次';
                break;
                case 4:
                return val='两周一次';
                break;
                case 5:
                return val='每月一次';
                break;
                case 6:
                return val='两月一次';
                break;
                case 7:
                return val='三月一次';
                break;
            }
        },
        securityStatusChange(val){
            if(val == 1) {
                return "安全";
                } else if(val == 2) {
                    return "不安全";
                } else if(val == 3) {
                    return "未知";
                }
        },
        expectCheckStatusChange(status){
            if(status == 1) {
                        return "安全";
                    } else if(status == 2) {
                        return "待检查";
                    } else if(status == 3) {
                        return "整改中";
                    }
    
        }

    },
    methods:{
        //打印当前标签
        printCurrentLabel(){
            var vm = this
            console.log(this.checkPointsForPageSingleList,'checkPointsForPageSingleList');
            var datas = '['
            var tabelTitle = vm.projName + '安全标签'
            var keyList = '["点位名称","安全类别","检查项目","检查频率","负责群组","负责人员","检查群组","检查人员"]'
            // console.log(vm.relaList1,'清单9d')
            this.checkPointsForPageSingleList.forEach((item,i)=>{
                var valueList = '["' + (item.checkPoint.name ? item.checkPoint.name : "") + '","'
                    + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","' + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","'
                    + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","' + (vm.checkItemDataList.respDeptName ? vm.checkItemDataList.respDeptName : "") + '","' +
                    (vm.checkItemDataList.respUserName ? vm.checkItemDataList.respUserName : "") + '","' + (vm.checkItemDataList.checkDeptName ? vm.checkItemDataList.checkDeptName : "") + '","'
                    + (vm.checkItemDataList.checkUserName ? vm.checkItemDataList.checkUserName : "") + '"]'
                var data = '{"Title":"' + tabelTitle + '","LabelType":"general","Code":"' +
                    'qr.qjbim.com/appcenter/qr/' + vm.UPID + '/QR-MX-' + vm.addZero(item.checkPoint.id, 7) +
                    '","KeyList":' + keyList + ',"ValueList":' + valueList + '}'
                datas += data
                if (i < vm.checkPointsForPageSingleList.length - 1) datas += ','
            })
            datas += ']'
            console.log(datas,'data1111');
            vm.$refs.taskIndedxLabelContent.value = datas
            $('#taskIndedxPrint-qrcode').submit()
            vm.$message({
                    type:'success',
                    message:'已向打印机发送请求'
                })
        },
        //打印所有标签
        printAllCurrentLabel(){
            var vm = this
            console.log(this.checkPointsForPageList,'checkPointsForPageList');
            var datas = '['
            var tabelTitle = vm.projName + '安全标签'
            var keyList = '["点位名称","安全类别","检查项目","检查频率","负责群组","负责人员","检查群组","检查人员"]'
            // console.log(vm.relaList1,'清单9d')
            this.checkPointsForPageList.forEach((item,i)=>{
                var valueList = '["' + (item.name ? item.name : "") + '","'
                    + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","' + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","'
                    + (vm.checkItemDataList.item.itemName ? vm.checkItemDataList.item.itemName : "") + '","' + (vm.checkItemDataList.respDeptName ? vm.checkItemDataList.respDeptName : "") + '","' +
                    (vm.checkItemDataList.respUserName ? vm.checkItemDataList.respUserName : "") + '","' + (vm.checkItemDataList.checkDeptName ? vm.checkItemDataList.checkDeptName : "") + '","'
                    + (vm.checkItemDataList.checkUserName ? vm.checkItemDataList.checkUserName : "") + '"]'
                var data = '{"Title":"' + tabelTitle + '","LabelType":"general","Code":"' +
                    'qr.qjbim.com/appcenter/qr/' + vm.UPID + '/QR-MX-' + vm.addZero(item.id, 7) +
                    '","KeyList":' + keyList + ',"ValueList":' + valueList + '}'
                datas += data
                if (i < vm.checkPointsForPageList.length - 1) datas += ','
            })
            datas += ']'
            console.log(datas,'data1111');
            vm.$refs.taskIndedxLabelContent.value = datas
            $('#taskIndedxPrint-qrcode').submit()
            vm.$message({
                    type:'success',
                    message:'已向打印机发送请求'
                })
        },
        pageView(){

        },
        pageAllView(){

        },
        loadingTitle(){
            var vn=this;
            vn.routerList=vn.getSecondGradeList(vn.moduleList,'006','00602','/constructionSite/safetyRuning','00601','/constructionSite/safetyCheckings','00604','/constructionSite/safetyInspection','00603','/constructionSite/remoteVideo');
            console.log(vn.routerList,'vn.routerList')
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
    //进入安全检查页面
    getSecurityCheck(){
        axios({
            method:'get',
            url:this.BDMSUrl+'/project2/security/securityCheck',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
            },
            
        }).then(response=>{
            if(response.data.cd=='0'){
                this.entType=response.data.rt.entType;
                this.ugId=response.data.rt.ugId;
                // this.validateAuth();
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //验证用户权限
    validateAuth(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
                type:5,
            },
            url:this.BDMSUrl+'/project2/buildSite/validateAuth'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.showSafetyCheck=true;
                // this.checkItemDataList=response.data.rt;
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查项目目录
    loadzTreeData(){
        var vm = this
            var setting={
                data:{
                    key:{
                        name: "itemName",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "itemId",
                        pIdKey: "parentItemId",
                        rootPId: 0
                    }
                }
            };
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId
            },
            url:this.BDMSUrl+'/project2/security/loadzTreeData'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.loadzTreeDataList_original=response.data.rt;
                this.loadzTreeDataList=data.transformTozTreeFormat(setting, response.data.rt);
                // console.log(this.loadzTreeDataList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查项目基本信息
    getCheckItemData(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/getCheckItemData'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkItemDataList=response.data.rt;
                console.log(this.checkItemDataList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查点位列表及对应点位最新的检查记录
    getCheckPointsByItemId(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId,
                projId:this.projId,
                page:this.pageDetial.currentPage,
                rows:this.pageDetial.pagePerNum
            },
            url:this.BDMSUrl+'/project2/security/getCheckPointsByItemId'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkPointsByItemIdList=response.data.rt.rows;
                this.pointTotal=response.data.rt.total;
                this.pageDetial.total=response.data.rt.total;
                console.log(this.checkPointsByItemIdList);
                if(this.checkPointsByItemIdList){
                    this.dataShow=false;
                }
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    nodeClick(obj){
        // console.log(obj);
        // this.itemLength=obj.children.length;
        this.itemId=obj.itemId;
        console.log(this.itemId);
        this.itemName=obj.itemName;
        console.log(this.itemName);
        this.addNodeparentItemId=obj.parentItemId;
        console.log(this.addNodeparentItemId);
        this.getCheckItemData();
        this.getCheckPointsByItemId();
        
    },
    checkItem(num){
        this.isshow=num;
        console.log('dhsjdhj');
        this.checkPointId=this.checkPointsByItemIdList[this.isshow].checkPoint.id;
        this.checkPointName=this.checkPointsByItemIdList[this.isshow].checkPoint.name;
        this.checkId=this.checkPointsByItemIdList[this.isshow].checkRecord.id;
        this.currCheckStatus=this.checkPointsByItemIdList[this.isshow].checkRecord.currCheckStatus;
        this.checkUserName=this.checkPointsByItemIdList[this.isshow].checkUserName;
        this.checkTime=this.checkPointsByItemIdList[this.isshow].checkRecord.checkTime;
    },
    //打印全部标签
    printAllLabel(){
        if(this.checkPointsByItemIdList){
            this.labelListShow=true;
            this.getCheckPointsForPage();
        }
    },
    labelListSingleCancle(){
        this.labelListSingleShow=false;
    },
    labelListCancle(){
        this.labelListShow=false;
    },
    testIfIsNull(row, column, cellValue, index){
          if(cellValue == null)return '/'
          return cellValue
      },
      addZero(num,size){
        var len = ('' + num).length;
        return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
    },
    //获取指定检查项目下的指定页面的检查点位
    getCheckPointsForPage(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId,
                projId:this.projId,
                page:this.pageLabelList.currentPage,
                rows:this.pageLabelList.pagePerNum
            },
            url:this.BDMSUrl+'/project2/security/getCheckPointsForPage'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkPointsForPageList=response.data.rt.rows;
                this.pointsForPagePager=response.data.rt.pager;
                console.log(this.checkPointsForPageList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取指定检查项目下的所有检查点位
    getCheckPoints(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId,
            },
            url:this.BDMSUrl+'/project2/security/getCheckPoints'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkPointsList=response.data.rt;
                this.checkPointsListLength=response.data.rt.length;
                console.log(this.checkPointsListLength);
                console.log(this.checkPointsList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //编辑点位
    editSite(){
        var vm=this;
        if(this.addNodeparentItemId){
            this.spotEditDialog=true;
            this.getCheckPoints();
        }else{
            vm.$message({
                type:'error',
                message:'请先选择检查项目'
            })
        }
    },
    //打印标签
    printLabel(num){
        this.labelListSingleShow=true;
        this.checkPointsForPageSingleList=[];
        // this.checkPointsForPageSingleList.push(scope.row)
        console.log(this.checkPointsByItemIdList)
        this.checkPointsByItemIdList.forEach((item)=>{
            if(item.checkRecord.id==num){
                this.checkPointsForPageSingleList.push(item)
            }
        })
         console.log(this.checkPointsForPageSingleList);
        // this.getRelaFilesByCrId(num);
    },
    //获取检查记录关联的图片信息
    getRelaFilesByCrId(num){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               id:num
            },
            url:this.BDMSUrl+'/project2/security/getRelaFilesByCrId'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.getRelaFilesByCrIdList=response.data.rt;
                console.log(this.getRelaFilesByCrIdList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    srCheck(num){
        this.checkPointId=num;
         this.securityStatusShow=true;
    },
    srStatusCancle(){
        this.securityStatusShow=false;
    },
    srStatusConfirm(){
        var vm=this;
         axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               currCheckStatus:this.securityStatus,
               projId:this.projId,
               checkPointId:this.checkPointId
            },
            url:this.BDMSUrl+'/project2/security/updateCheckPointSecurityStatus'
        }).then(response=>{
            if(response.data.cd=='0'){
                vm.securityStatusShow=false;
                vm.securityStatus='',
                vm.$message(
                    {type:'success',
                    message:'安全状态修改成功'})
                    vm.getCheckPointsByItemId();

            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //重命名
    rwrite(){
        var vm=this;
        if(this.tdValue){
            this.checkPointsList.forEach((item)=>{
                if(this.tdValue==item.id){
                    this.checkPointTdName=item.name;
                    this.rwriteShowId=item.id
                }
            })
            this.rwriteShow=true
        }else{
            vm.$message({
                type:'error',
                message:'请选择要重命名的检查点位'
            })
        }
    },

    //撤销检查点位
    checkPointCancel(){
        this.showTd=false;
        this.checkPointTdName='';
            if( this.checkPointsList[0].name1!=undefined){
                this.checkPointsList.shift();
            }
        // if(this.checkPointsList.==this.checkPointsListLength){
        //     return;
        // }
        
    },
    //添加检查点位
    addCheckPoint(){
        if(this.tdValue){
                axios({
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                name:this.checkPointTdName,
                itemId:this.itemId,
                id:this.rwriteShowId,
                },
                url:this.BDMSUrl+'/project2/security/renameCheckPoint'
            }).then(response=>{
                if(response.data.cd=='0'){
                    // this.checkPointTdName='';
                    this.getCheckPointsByItemId();
                    this.getCheckPoints();
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        }else{
            if(this.checkPointTdName==''){
             return ''
         }else{
            var vm=this;
            axios({
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                name:this.checkPointTdName,
                itemId:this.itemId,
                projId:this.projId
                },
                url:this.BDMSUrl+'/project2/security/addCheckPoint'
            }).then(response=>{
                if(response.data.cd=='0'){
                        this.checkPointTdName='';
                        this.getCheckPointsByItemId();
                        this.getCheckPoints();

                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
            }
        }
    },
    //关闭
    newFileClose(){
        this.spotEditDialog=false;
        this.checkPointTdName='';
        
    },
    //删除检查点位
    deleteCheckPoint(num){
        this.checkPointId=num;
        this.deleteCheckPointDialog=true;
    },
    //删除检查点位确认
    deleteCheckPointMakeSure(){
        var vm=this;
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               id:this.checkPointId
            },
            url:this.BDMSUrl+'/project2/security/deleteCheckPoint'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.deleteCheckPointDialog=false;
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                vm.getCheckPointsByItemId();
                vm.getCheckPoints();
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    deleteCheckPointClose(){
        this.deleteCheckPointDialog=false;
    },
    //获取当前项目的用户群组
    getManageDept(){
        var vm=this;
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               projId:this.projId
            },
            url:this.BDMSUrl+'/project2/security/getManageDept'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.manageUserList=response.data.rt;
                console.log(this.manageUserList)
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //
    respDeptChange(){
        this.manageUserList.forEach((item)=>{
            if(item.ugId==this.respDept){
                this.byDeptId=item.ugId;
            }
        })
        this.getPersonInChargeByDept();
    },
    checkDeptChange(){
        this.manageUserList.forEach((item)=>{
            if(item.ugId==this.checkDept){
                this.byDeptId=item.ugId;
            }
        })
        this.getPersonInChargeByDept();
    },
    //校验当前项目节点是否可以添加子检查项目节点
    validateAddNode(){
        var vm=this;
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/validateAddNode'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.addCheckItemNodeShow=true;
                // this.addCheckItemNodeShow=true;
                
            }else if(response.data.cd=='-1'){
                vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
        })
    },
    //获取当前用户群组下的用户
    getPersonInChargeByDept(){
         var vm=this;
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                ugId:this.byDeptId
            },
            url:this.BDMSUrl+'/project2/security/getPersonInChargeByDept'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.personInChargeByDeptList=response.data.rt;
                console.log(this.personInChargeByDeptList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //重命名
    renameFile(){
        this.fileNameShow=true;
    },
    //重命名确认
    addfileConfirm(){
        axios({
            method:'post',
            url:this.BDMSUrl+'project2/security/reNameNodeName',
            headers:{
                'token':this.token,
            },
            params:{
                itemId:this.itemId,
                itemName:this.newFileName
            }
        }).then((response)=>{
            if(response.data.cd=='0'){
                this.loadzTreeData()
                this.fileNameShow=false;
                this.newFileName='';

                this.$message({
                    type:'success',
                    message:'重命名成功'
                })
            }
        })
    },
    addfileCancle(){
        this.fileNameShow=false;
        this.newFileName='';
    },
    //添加检查条目节点
    addCheckItemNode(){
        this.parentItemId=this.itemId;
        this.parentItemName=this.itemName;
        this.getManageDept();
        this.addCheckItemNodeShow=true;
        if(this.parentItemName){
            this.validateAddNode();
        }
    },
    addCheckItemNodeConfirm(){
        var vm=this;
        axios({
            method:'post',
            headers:{
                'token':this.token
            },
            params:{
                parentItemId:this.parentItemId,
                projId:this.projId,
                itemName:this.projectName,
                checkFrequency:this.checkFrequency,//检查频率
                respDept:this.respDept,//负责部门/单位
                respUser:this.respUser,//负责人
                checkDept:this.checkDept,//检查部门/单位
                checkUser:this.checkUser,//检查人
                ugId:this.ugId //安全检查的ugid
            },
            url:this.BDMSUrl+'/project2/security/addCheckItemNode'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.addCheckItemNodeShow=false;
                vm.$message(
                    {type:'success',
                    message:'添加成功'})
                vm.loadzTreeData();
                this.parentItemId='';
                this.projectName='';
                this.parentItemName='';
                this.itemName='';
                this.checkFrequency=0;
                this.respUser='';
                this.respDept='';
                this.checkDept='';
                this.checkUser='';
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    addCheckItemNodeCancle(){
        this.addCheckItemNodeShow=false;
        // this.itemId=-1;
        // this.parentItemId='';
        this.projectName='';
        // this.parentItemName='';
        // this.itemName='';
        this.checkFrequency=0;
        this.respUser='';
        this.respDept='';
        this.checkDept='';
        this.checkUser='';
    },
    //点位编辑
    spotEditConfirm(){

    },
    spotEditCancle(){
        this.spotEditDialog=false;
    },
    //删除检查项目节点
    deleteItemNode(){
        this.deleteItemNodeDialog=true;
    },
    deleteItemNodeMakeSure(){
        var vm=this;
         axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/deleteItemNode'
        }).then(response=>{
            if(response.data.cd=='0'){
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                    vm.loadzTreeData();
                    this.itemId=-1;
                    this.parentItemId='';
                    this.projectName='';
                    this.parentItemName='';
                    this.itemName='';
                    this.checkFrequency=0;
                    this.respUser='';
                    this.respDept='';
                    this.checkDept='';
                    this.checkUser='';
                    this.deleteItemNodeDialog=false;

            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    deleteItemNodeClose(){
        this.deleteItemNodeDialog=false;
        this.itemId=-1;
        this.parentItemId='';
        this.projectName='';
        this.parentItemName='';
        this.itemName='';
        this.checkFrequency=0;
        this.respUser='';
        this.respDept='';
        this.checkDept='';
        this.checkUser='';
    },
    checkTable(num){
        console.log('ffsd')
        this.tdValue=num;
        this.checkPointId=num;
    },
    newTabFile(){
        var name='';
        // this.checkPointsList=[];
        // this.getCheckPoints();
        this.checkPointsList.unshift({'name':name,'name1':1});
        console.log(this.checkPointsList);
        this.checkPointsList.forEach((item)=>{
            if(item.name==""){
                this.showTd=true;
            }
        })
        // let str =document.getElementById("checkPointId");
        // var td = document.createElement('td');
        // tr.appendChild(td);
        // console.log(str);
    },
    deleteTabCheckPoint(){
        var vm=this;
        if(this.checkPointId){
            this.deleteCheckPointDialog=true;
        }else{
            vm.$message({
                type:'error',
                message:'请选择要删除的检查点位'
            })
        } 
    },
    //获取下一条检查记录
    getNextCheckRecord(){
        var vm=this;
         axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               id:this.checkId,
               checkPointId:this.checkPointId
            },
            url:this.BDMSUrl+'/project2/security/getNextCheckRecord'
        }).then(response=>{
            if(response.data.cd=='0'){
                    this.list=response.data.rt;
                    console.log(this.list);
                    // this.checkPointId=this.list.checkPoint.id;
                    // this.checkPointName=this.list.checkPoint.name;
                    this.checkId=this.list.checkRecord.id;
                    this.currCheckStatus=this.list.checkRecord.currCheckStatus;
                    this.checkUserName=this.list.checkUserName;
                    this.checkTime=this.list.checkRecord.checkTime;

            }else if(response.data.cd=='-1'){
                vm.$message(
                    {type:'error',
                    message:response.data.msg})
            }
        })
    },
    //获取上一条检查记录
    getPreviousCheckRecord(){
        
            var vm=this;
            axios({
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                id:this.checkId,
                checkPointId:this.checkPointId
                },
                url:this.BDMSUrl+'/project2/security/getPreviousCheckRecord'
            }).then(response=>{
                if(response.data.cd=='0'){
                        this.list1=response.data.rt;
                        console.log(this.list1);
                        // this.checkPointId=this.list1.checkPoint.id;
                        // this.checkPointName=this.list1.checkPoint.name;
                        this.checkId=this.list1.checkRecord.id;
                        this.currCheckStatus=this.list1.checkRecord.currCheckStatus;
                        this.checkUserName=this.list1.checkUserName;
                        this.checkTime=this.list1.checkRecord.checkTime;
                }else if(response.data.cd=='-1'){
                    vm.$message(
                        {type:'error',
                        message:response.data.msg})
                }
            })
        
        
    },
    changePage(val,isTop){//分页 0 -1 1 2
                var vm = this; 
                if(isTop){
                    if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                        vm.$message('这已经是第一页!')
                        return false
                    }
                    if(vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
                        vm.$message('这已经是最后一页!')
                        return false
                    }
                    switch(val){
                        case 0:
                            vm.pageDetial.currentPage = 1
                            break;
                        case -1:
                            vm.pageDetial.currentPage--
                            break;
                        case 1:
                            vm.pageDetial.currentPage++
                            break;
                        case 2:
                            vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum)
                            break;
                    }
                }else{
                      if(vm.pageDetial_1.currentPage == 1 && (val == 0 || val == -1)){
                        vm.$message('这已经是第一页!')
                        return false
                        }
                        if(vm.pageDetial_1.currentPage >= Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum) && (val == 1 || val == 2)){
                            vm.$message('这已经是最后一页!')
                            return false
                        }
                        switch(val){
                            case 0:
                                vm.pageDetial_1.currentPage = 1
                                break;
                            case -1:
                                vm.pageDetial_1.currentPage--
                                break;
                            case 1:
                                vm.pageDetial_1.currentPage++
                                break;
                            case 2:
                                vm.pageDetial_1.currentPage = Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum)
                                break;
                        }
                }
        }

    },
    // labelListConfirm(){
    //         var vm = this;
    //         var manifestId = '';
    //         if(this.isGongChengLiang){
    //             manifestId = this.manifestIdOne;
    //         }else{
    //             manifestId =vm.manifestId;
    //         }
    //         if(vm.singleLable == true){
    //             window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/'+vm.S_Label_quantitiesList[0].pkId)
    //         }else{
    //             window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/0')
    //         }
    //   },


    
}
</script>
<style lang="less">
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    //修改element-tree样式
     .el-tree-node:focus .el-tree-node__content{
            background-color: transparent;
            }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background-color: #dfdfdf;
        }
        .el-tree-node__label{
            font-size: 12px;
            color: #666666;
            padding-left: 22px; 
            position: relative;
        }
        .el-icon-caret-right:before{
            content: "\E604";
            color: #999999;
            font-weight: bold;
        }
    
        .is-leaf:before{
            content: ""!important;
            color: #999999;
            font-weight: bold;
        }
        .el-tree-node__label::before{
            display: block;
            position: absolute;
            top: 2px;
            left: 4px;
            width: 14px;
            height: 13px;
            background: url('../ManageCost/images/file.png')no-repeat 0 0;
            content: '';
        }
        .fileIcon::before{
            width: 16px;
            height: 16px;
            top: 0px;
            background-image: url('../ManageDesign/images/zTreeStandard.png');
            background-position: -110px -32px;
        }
        .el-tree-node__content{
                height: 30px;
        }
        .is-current .el-tree-node__content{
            color: #333333;
            font-weight: bold;
        }
     .tree{
            height:600px;
            margin:10px 10px;
            overflow-y:auto;
            width: 100%;                  
        }
    #safetyChecking{
         .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            // height:800px;
            overflow: auto;
        }
        ::-webkit-scrollbar{width:0px}
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
        #project{
            width: 100%;
            height: 90%;
            padding:0px 20px 20px 20px;
            ::-webkit-scrollbar{width:0px}
            .project_left{
                // width: 80%;
                // height: 800px;
                // float: left;
                display: inline-block;
                width: 84%;
                position: relative;
                transition: all ease 0.5s;
                ::-webkit-scrollbar{width:0px}
                .information{
                    margin-top:10px;
                    height:60px;
                    margin-bottom:25px;
                    .basic_information{
                        float: left;
                        margin-left:22px;
                        width: 100%;
                        color: #fc3439;
                        text-align: left;
                        font-size: 16px;
                        line-height: 16px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 11px;
                        margin: 0 0 0 0;
                        .imgIcon{
                            margin-right:11px;
                        }
                    }
                    .information_table{
                        width: 100%;
                        table {
                            margin: 0 auto;
                            width: 100%;
                            border-collapse: collapse;
                            // border-top: 1px solid #e6e6e6;
                            border-bottom: 1px solid #e6e6e6;
                            thead {
                            background: #f2f2f2;
                            tr {
                                th {
                                padding-left: 10px;
                                height: 36px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                border-left: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #666666;

                                }
                            }
                            }
                            tbody {
                            background: #fff;
                            tr {
                                td {
                                    padding-left: 10px;
                                    height: 36px;
                                    text-align: left;
                                    font-size: 12px;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    border-left: 1px solid #e6e6e6;
                                    color: #666666;
                                    border-bottom: 1px solid #e6e6e6;
                                    max-width: 80px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                            }
                            }
                        }   
                    }
                }
                .checkSite{
                    margin-top:75px;
                    // height:300px;
                    // border:1px solid red;
                    // overflow-x: auto;
                    margin-bottom:25px;
                    position: relative;
                    .checkSite_header{
                        float: left;
                        margin-left:22px;
                        width: 100%;
                        color: #fc3439;
                        text-align: left;
                        font-size: 16px;
                        line-height: 16px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 11px;
                        margin: 0 0 0 0;
                        .imgIcon{
                            margin-right:11px;
                        }
                    }
                    .checkLabelBtn{
                            width: 200px;
                            float:right;
                            position: absolute;
                            top:-1px;
                            right: 13px;
                        .btn{
                            margin-right:10px;
                            line-height: 23px;
                            padding:2px 12px;
                            font-size:14px;
                            display:inline-block;
                            height: 26px;
                            border: none;
                            cursor: pointer;
                            background-color:#f2f2f2;
                            border:1px solid #f3f3f3;
                            }
                        .btn1{
                        margin-right:-4px;
                        line-height: 23px;
                        padding:2px 12px;
                        font-size:14px;
                        float: right;
                        display:inline-block;
                        height: 26px;
                        border: none;
                        cursor: pointer;
                        background-color:#f2f2f2;
                        border:1px solid #f3f3f3;
                        }
                    }
                    .checkSite_table{
                            width: 100%;
                            height: 328px;
                            overflow-x: auto;
                            table {
                                margin: 0 auto;
                                width: 100%;
                                
                                border-collapse: collapse;
                                // border-top: 1px solid #e6e6e6;
                                border-bottom: 1px solid #e6e6e6;
                                thead {
                                    background: #f2f2f2;
                                    tr {
                                        th {
                                        padding-left: 10px;
                                        height: 36px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        border-left: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #666666;

                                        }
                                    }
                                }
                                tbody {
                                    background: #fff;
                                    .check{
                                        background:#0081c2;
                                        td{color:#fff !important;}
                                    }
                                    tr {
                                        td {
                                        padding-left: 10px;
                                        height: 36px;
                                        text-align: left;
                                        font-size: 12px;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        border-left: 1px solid #e6e6e6;
                                        color: #666666;
                                        border-bottom: 1px solid #e6e6e6;
                                        max-width: 80px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        .actionBtn{
                                                width: 16px;
                                                height: 17px;
                                                border: none;
                                                cursor: pointer;
                                                margin-right: 16px;
                                        }
                                        .printLabelBtn{
                                            background: url('./images/Printing.png') no-repeat;
                                        }
                                        .checkBtn{
                                            background: url('./images/check.png') no-repeat;
                                        }
                                            .deleteBtn{
                                            background: url('../../assets/delete.png') no-repeat;
                                        }
                                        }
                                    }
                                }
                            }   
                    }
                     /**********一下是分页器的样式***************/
                    .datagrid-pager {
                        display: block;
                        height: 31px;
                        width: auto;
                        border:1px solid #d4d4d4;
                        // padding: 3px 4px;
                        box-sizing: border-box;
                        background: #f5f5f5;
                    }
                    .pagination{
                        margin-top:20px;
                        // bottom: 0px;
                        // position: absolute;;
                        // left:0px;
                        border-top: none;
                    }
                    .pagination table {
                        float: left;
                        height: 36px;
                        th, td {
                            min-width: 5px;
                            padding: 0px;
                            margin: 0px;
                        }
                    }
                    .pagination-page-list {
                        margin: 0px 6px;
                        padding: 1px 2px;
                        width: 43px;
                        height: auto;
                        border-width: 1px;
                        border-style: solid;
                    }
                    .pagination .pagination-num {
                        border-color: #D4D4D4;
                        margin: 0 2px;
                        width: 30px;
                    }
                    .pagination-btn-separator {
                        float: left;
                        height: 24px;
                        border-left: 1px solid #ccc;
                        border-right: 1px solid #fff;
                        margin: 3px 1px;
                    }
                    .btn-TAB{
                        display: block;
                        width:26px;
                        height: 26px;
                        cursor: pointer;
                        position: relative;
                        &:hover{
                            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                            border-radius: 5px;
                        }
                        &::after{
                            display: block;
                            position: absolute;
                            content: '';
                            width: 10px;
                            height: 10px;
                            background-size: 100% 100%; 
                            top: 8px;
                            left: 8px;
                        }
                    }
                    .btn-left0::after{
                        background-image: url('../../assets/fenye2.png');
                    }
                    .btn-left1::after{
                        background-image: url('../../assets/fenye1.png');
                    }
                    .btn-right0::after{
                        background-image: url('../../assets/fenye4.png');
                    }
                    .btn-right1::after{
                        background-image: url('../../assets/fenye3.png');
                    }
                    .btn-refresh::after{
                        background-image: url('../../assets/fenye5.png');
                    }
                    .pagination-title{
                        font-size: 14px;
                        color: #333333;
                    }
                    .pagination-info{
                        float: right;
                        margin-top: 5px;
                        margin-right: 25px;
                    }
                    .clearfix{
                        clear: both;
                        overflow: hidden;
                        content: '';
                    }
                }
                .bottom{
                    .bottom_table{
                        .header_text{
                            width: 100%;
                            height: 40px;
                            border:1px solid #999;
                            background-color:#f5f5f5;
                            position: relative;
                            .text{
                                float: left;
                                font-size:14px;
                                line-height: 40px;
                                margin-left:10px;
                                color:#666;
                            }
                            .selectBtn{
                                width: 150px;
                                float:right;
                                position: absolute;
                                top:4px;
                                right: 13px;
                                .pre_btn{
                                    margin-right:5px;
                                    line-height: 21px;
                                    padding:2px 12px;
                                    font-size:14px;
                                    display:inline-block;
                                    height: 26px;
                                    border: none;
                                    cursor: pointer;
                                    background-color:#ffffff;
                                    border:1px solid #f3f3f3;
                                }
                                .next_btn{
                                    margin-right:-4px;
                                    line-height: 21px;
                                    padding:2px 12px;
                                    font-size:14px;
                                    float: right;
                                    display:inline-block;
                                    height: 26px;
                                    border: none;
                                    cursor: pointer;
                                    background-color:#ffffff;
                                    border:1px solid #f3f3f3;
                                }
                            }
                        }
                        .header_body{
                            width: 100%;
                                text-align: left;
                                margin-top:10px;
                                float: left;
                                .text{
                                    // margin-right: 0px;
                                    width: 80px;
                                    display: inline-block;
                                    font-size:14px;
                                    line-height: 14px;
                                    color:#333333;
                                }
                                .value{
                                    margin-right: 5px;
                                    width: 150px;
                                    display: inline-block;
                                    font-size:14px;
                                    line-height: 14px;
                                    color:#333333;

                                }

                        }
                    }

                }
            }
            .project_right{
                border-left:1px solid #ccc;
                // width: 18%;
                // float: right;
                // position: absolute;
                // top: 98px;
                // right: 0px;
                // height: 800px;
                display:inline-block;
                position:relative;
                float: right;
                width: 15%;
                transition: all ease 0.5s;
                background: #ffffff;
                z-index: 10;
                height: 750px;
                overflow-y: auto;
                overflow-x: hidden;
                .checkProjectList_header{
                    height: 40px;
                    border-bottom:1px solid #999; 
                    position: relative;
                    // min-width: 200px;
                    .text{
                        font-size: 16px;
                        line-height: 40px;
                        // float: left;
                        display: inline-block;
                        left:10px;
                        color: #333333;
                        position: absolute;
                        font-weight: bold;
                    }
                    .clearfix_icon{
                        // float: right;
                        display: inline-block;
                        margin-top:12px;
                        // width: 60%;
                        position: absolute;
                        right: 10px;
                        max-width: 200px;
                        .icon-goujian{
                            float: left;
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                        }
                        .icon-add{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .icon-edit{
                            float: right;
                            background: url('../ManageCost/images/edit.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/edit1.png')no-repeat 0 0;
                            } 
                        }
                        .icon-delete{
                            float: right;
                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                            } 
                        }
                    }

                }
               
            }
        }
        .dialog{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            
            .el-dialog__body{
                margin-top: 20px;
                overflow-y: auto;
                height: 580px;
            }
            .editBody{
                margin: 0 20px;
                .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
                    margin: 0 5px;
                }
            }
            .item-label{
                border-bottom: 1px solid #ebebeb;
                .img_left{
                    float: left;
                    width: 90px;
                    height: 90px;
                    margin:40px 30px 0 10px;
                }
                .right{
                    float: left;
                    width: 450px;
                    .item-list{
                        margin-bottom: 14px;
                        .text-left{
                            float: left;
                            font-size: 12px;
                            line-height: 12px;
                            width: 80px;
                            color: #999;
                            text-align: left;
                        }
                        .text-right{
                            float: left;
                            width: 300px;
                             font-size: 12px;
                            line-height: 15px;
                            color: #333333;
                            text-align: left;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        &:last-of-type{
                             margin-bottom: 20px; 
                        }
                    }
                }
                &:last-of-type{
                    border-bottom: none;
                }
            }
             .item-attibuteAuth{
                 float: left;
                 width: 33.3%;
                 padding-left: 78px;
                 height: 14px;
                 line-height: 14px;
                 margin-bottom: 26px;
                 text-align: left;
                 .text{
                    font-size: 14px;
                    color: #666666;
                    margin-left: 10px;
                 }
                .checkbox-fileItem{
                    float: left;
                    position: relative;
                    padding-left:20px; 
                    cursor: pointer;
                    &::before{
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 12px;
                        height: 12px;
                        border: 1px solid #cccccc;
                        cursor: pointer;
                        background: #fff;
                        content: '';
                    }
                }
                .active{
                     &::before{
                        background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                        border: 1px solid #fc3439;
                     }
                }
                .checkbox-arr{
                    display: none;
                }
             }
        }
        #mask{
            z-index: 3000;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
        }
        #edit{
            .el-dialog__body {
            .editBody {
                .editBodytwo{
                        .itemName{
                            // float: left;
                            // position: relative;
                            // margin-left:-85px;
                            // top:40px;
                            // display:inline-block;
                            // font-size: 14px;
                        }
                        .itemInp{
                            -webkit-appearance: none;
                            background-color: #fff;
                            background-image: none;
                            border-radius: 4px;
                            border: 1px solid #dcdfe6;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            color: #606266;
                            display: inline-block;
                            font-size: inherit;
                            height: 36px;
                            line-height: 1;
                            outline: 0;
                            padding: 0 15px;
                            -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                            width: 217px;
                            margin-top:10px;
                        }
                    
                    label{
                        display: inline-block;
                        width:100px;
                    }
                    .parentItem{
                        // float: left;
                        width: 70px;
                        display: inline-block;
                        height: 20px;
                        margin-left:-145px;
                    }
                    .parentValue{
                        left:40px;
                        width: 70px;
                        height: 20px;
                        display: inline-block;
                    }

                }
                .editBody_left{
                    float: left;
                    margin-left:20px;
                    width: 60%;
                    height: 300px;
                    overflow-x: auto;
                    border:1px solid #999;
                    table {
                            margin: 0 auto;
                            width: 100%;
                            border-collapse: collapse;
                            // border-top: 1px solid #e6e6e6;
                            border-bottom: 1px solid #e6e6e6;
                            thead {
                                background: #f2f2f2;
                                tr {
                                    th {
                                    padding-left: 10px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    border-left: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #666666;

                                    }
                                }
                            }
                            tbody {
                                background: #fff;
                                overflow:auto;
                                .tdBackground{
                                    background:#0081c2;
                                    td{color:#fff !important;}
                                }
                                tr {
                                    td {
                                        padding-left: 10px;
                                        height: 36px;
                                        text-align: left;
                                        font-size: 12px;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        border-left: 1px solid #e6e6e6;
                                        color: #666666;
                                        border-bottom: 1px solid #e6e6e6;
                                        max-width: 80px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        #tdInput{
                                            background: #fff;
                                            width: 100%;
                                            height:30px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                .editBody_right{
                    border:1px solid #999;
                    float: right;
                    width: 24%;
                    height: 300px;
                    margin-right:20px;
                    .editBody_right1{
                        height:140px;
                        
                        .actionBtn{
                                float: left;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                                display: inline-block;
                                width: 100px;
                                font-size:14px;
                                line-height: 16px;
                                margin-top:25px;
                                margin-left:10px;
                        }
                        .newFile{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        
                        .newFile1{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .newFile2{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .newFile3{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .make{
                             background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .deleteFile{
                            
                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                            } 
                        }
                        .editFile{
                            
                            background: url('../ManageCost/images/edit.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/edit1.png')no-repeat 0 0;
                            }
                        }
                    }
                    .editBody_right2{
                        .actionBtn{
                                float: left;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                                display: inline-block;
                                width: 100px;
                                font-size:14px;
                                line-height: 16px;
                                margin-top:25px;
                                margin-left:10px;
                        }
                        .makeSureFile{
                            background: url('./images/baoc.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('./images/baocred.png')no-repeat 0 0;
                            }
                        }
                        .resetFile{
                            background: url('./images/cx.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('./images/cxred.png')no-repeat 0 0;
                            }
                        }
                        .newFile{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                    }
                    .editBody_right3{
                        border-bottom: 1px solid #999;
                        .closeFile{
                            background: url('./images/guanb.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('./images/guanb-1.png')no-repeat 0 0;
                            }
                        }
                        .actionBtn{
                                float: left;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                                width: 100px;
                                font-size:14px;
                                line-height: 16px;
                                margin-top:25px;
                                margin-left:10px;
                        }
                        .makeSureFile{
                            background: url('./images/baoc.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('./images/baocred.png')no-repeat 0 0;
                            }
                        }
                        .newFile{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                    }
                }

                }
            }

        }
        //删除弹出框
        #inital{
            .deleteDialogImg{
                height: 50px;
                }
            .deleteDialogWarning{
            font-size: 18px;
            line-height: 18px;
            font-family: 'MicrosoftYahei';
            color: #fc3439;
            font-weight: bold;
            margin:20px 0 0 0;
            }
            .deleteDialogText{
                color: #333333;
                font-size: 14px;
                line-height: 14px;
                font-family: 'MicrosoftYahei';
                font-weight: normal;
                margin: 16px 5px 0px 5px;
            }
            .deleteDialogCare{
                color: #333333;
                font-size: 14px;
                line-height: 14px;
                font-family: 'MicrosoftYahei';
                font-weight: normal;
                margin: 16px 5px 0px 5px;
                 color: #fc3439;
            }
        }
    }

</style>

