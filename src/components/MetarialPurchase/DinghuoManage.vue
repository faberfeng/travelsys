
<template>
    <div id="dinghuo">
        <div class="topHeader">
            <div class="purchaseNav">
                <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem navactive">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem">  
                    检查验收  
                </router-link>
            </div>
            <div class="elselect" v-if="!showCommonList">
                <el-select v-model="selectUser" placeholder="请选择" @change="groupChange">
                    <el-option
                    v-for="(item,index) in userGroup"
                    :key="index"
                    :label="item.ugName"
                    :value="item.ugId">
                    </el-option>
                </el-select>
                <label class="elselecttitle">群组:</label>
            </div>
            <div class="pbody" v-if="!showCommonList">
                <div class="pbodyleft">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="'已订货 '+planData.length" name="0">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[index == selectIndexone?'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,false)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未订货 '+noPlanData.length" name="1">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li  :class="[index == selectIndextwo?'selectActive':'','lefttitlecontent']" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item,index,true)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                        <span class="showIcon">
                                            <i  @click="editOrder(item)" class="noplanEdit"></i>
                                            <i @click="removeOrder(item)" class="noplanDelete"></i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择订货单
                        <button @click="newListBtn" class="newList">新建订单</button>
                    </div>
                    <div v-if="!showDetail" class="scrolldiv">
                        <p class="pbodyrighttitle">
                            【{{selectObject.orderTitle}}】详情
                            <button @click="newListBtn" v-if="activeName == 1" class="newList">新建订单</button>    
                        </p>
                        
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">基本信息</label>
                            <span class="sureDinghuo" @click="sureDingHuo" :class=" isHidden ? '':'content-hidden   ' ">确认订货</span>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>单号</th>
                                        <th>名称</th>
                                        <th>定货方</th>
                                        <th>供货方</th>
                                        <th>订货日期</th>
                                        <th>经手人</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-text="orderInfo.orderCode"></td>
                                        <td v-text="orderInfo.orderTitle"></td>
                                        <td v-text="orderInfo.orderUgName"></td>
                                        <td v-text="orderInfo.supply"></td>
                                        <td v-text="orderInfo.orderDate_"></td>
                                        <td v-text="orderInfo.orderUserName"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="titleimg fukuan"></i>
                            <label class="titletext">付款项目</label>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>序号</th>
                                        <th>款项类型</th>
                                        <th>计价单位</th>
                                        <th>数量</th>
                                        <th>单价</th>
                                        <th>总价</th>
                                        <th>经手人</th>
                                        <th v-if="activeName == 1">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderInfoData" :key="index">
                                        <td v-text="item.itemId"></td>
                                        <td v-text="item.itemName"></td>
                                        <td v-text="item.unit"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.unitPrice"></td>
                                        <td v-text="item.totalPrice"></td>
                                        <td v-text="item.userName"></td>
                                        <td v-if="activeName == 1">
                                            <span v-if="item.itemId !=1" class="editIcon" @click="viewDeatil(item)" :title="'编辑'"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="shebeiimg"></i>
                            <label class="titletext">设备主清单</label>
                            <button v-if="activeName == 1" @click="addNewQingDan" style="margin-left:10px;" class="alllist">添加清单</button>
                            <button @click="viewAllDetail" class="alllist">全部标签</button>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>清单</th>
                                        <th>来源</th>
                                        <th>清单名称</th>
                                        <th>构件数</th>
                                        <th>清单总价</th>
                                        <th>增加日期</th>
                                        <th>经手人</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.amount"></td>
                                        <td v-text="item.updateDateTime_"></td>
                                        <td v-text="item.updateUserName"></td>
                                        <td>
                                            <span class="biaoqianIcon" :title="'标签'" @click="tips(item)"></span>
                                            <span class="editdetail" :title="'明细'" @click="showDetialList(item,index)"></span>
                                            <span v-if="activeName == 1" class="deleteIcon" :title="'删除'" @click="deleteItem(item)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id" rType="5" :bId='checkItem.id' :orderListDetailId='checkItem.id' :dingHuoObj='DingDanObj' :isGongChengLiang="false" :title="'订货管理'" :isShowWuzi="showWuZi" :isDinghuo="isDingHuo" v-if="showCommonList"></common-list>
        </div>
        <div id="edit">
            <el-dialog title="编辑付款项目" :visible.sync="editfukuan.show" :before-close="editfukuanCancel">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">计价单位 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.computerunit"/></div>
                    <div class="editBodytwo"><label class="editInpText">数量 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.amount"/></div>
                    <div class="editBodytwo"><label class="editInpText">单价 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.price"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editfukuanSure">确定</button>
                    <button class="editBtnC" @click="editfukuanCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="标签信息预览" :visible.sync="isbiaoqianshow" @close="biaoqianCLose">
                <div class="editBody">
                    <p style="font-weight:bold">{{projectName}}项目物资清单标签</p>
                    <ul style="padding:0 20px">
                        <li class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(biaoqianInfo.pkId, 7)" alt="二维码">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">二维码URL：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mUrl"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">清单ID：</span>
                                    <span class="text-right" v-text="biaoqianInfo.pkId"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">订单名称：</span>
                                    <span class="text-right" v-text="selectObject.orderTitle"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">生成方式：</span>
                                    <span class="text-right" v-text="'【'+biaoqianInfo.mGSource_+'】'"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">源自业务：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mBSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建用户：</span>
                                    <span class="text-right" v-text="biaoqianInfo.creator"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建时间：</span>
                                    <span class="text-right" >{{new Date(biaoqianInfo.createTime).toLocaleString()}}</span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件数量：</span>
                                    <span class="text-right" v-text="biaoqianInfo.manifestDetailCount"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                    <button class="editBtnC" @click="printLabelList">打印当前页标签</button>
                </div>
            </el-dialog>
            <el-dialog title="全部清单标签预览" :visible.sync="isshowallbiaoqian" @close="isshowallbiaoqian = false">
                <div class="editBody">
                    <p style="font-weight:bold">{{projectName}}项目物资清单标签</p>
                    <ul style="padding:0 20px;height:300px;overflow-y:scroll">
                        <li class="item-label clearfix" v-for="(item,index) in allBiaoqianData" :key="index">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="二维码">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">二维码URL：</span>
                                    <span class="text-right" v-text="item.mUrl"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">清单ID：</span>
                                    <span class="text-right" v-text="item.pkId"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">订单名称：</span>
                                    <span class="text-right" v-text="selectObject.orderTitle"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">生成方式：</span>
                                    <span class="text-right" v-text="'【'+item.mGSource_+'】'"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">源自业务：</span>
                                    <span class="text-right" v-text="item.mBSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建用户：</span>
                                    <span class="text-right" v-text="item.creator"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建时间：</span>
                                    <span class="text-right" >{{new Date(item.createTime).toLocaleString()}}</span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件数量：</span>
                                    <span class="text-right" v-text="item.manifestDetailCount"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <el-pagination background  layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                     @current-change="findManifestDetailList(1)" 
                     @prev-click="findManifestDetailList(1)"
                     @next-click="findManifestDetailList(1)"
                    :total="pageLabelList.total">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                </div>
            </el-dialog>
            <el-dialog title="新建订货单" :visible.sync="addNewListShow" :before-close="listClose">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>订单名称 :</label>
                        <input class="inp" placeholder="请输入" v-model="newListName"/>
                    </div>
                    <div class="editBodytwo editBodyone edit-item clearfix"><label class="editInpText">供货方 :</label>
                        <select class="editSelect" v-model="suppyModel" >
                            <option v-for="(item,index) in supplyData" :key="index" :value="item.ugId">{{item.ugName}}</option>
                            <!-- <option value="596">质量验收</option>
                            <option value="597">质量检查</option>
                            <option value="598">安全验收</option>
                            <option value="599">安全检查</option>
                            <option value="560">供货商</option>
                            <option value="561">施工单位</option>
                            <option value="562">设计单位</option>
                            <option value="563">建设单位</option>
                            <option value="563">测试群组</option> -->
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addListSure">新建</button>
                    <button class="editBtnC" @click="listClose">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="更改订货单名称" :visible.sync="editListTitle" :before-close="editListTitleCancel">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>订单名称 :</label>
                        <input class="inp" placeholder="请输入" v-model="editTitle"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editListTitleSure">更改</button>
                    <button class="editBtnC" @click="editListTitleCancel">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg">
                    <img src="../../assets/warning.png"/>
                </div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
        <form style="visibility:hidden" action="http://10.252.26.240:8080/qjbim-project/project/order/QDQrCodeSingle" ref="manifestQrCodeSingleForm"  method="post" target="_blank">
            <input type="text" name="projectName" :value="projectName">
            <input type="text" name="manifestUrl" :value="biaoqianInfo.mUrl">
            <input type="text" name="manifestId" :value="biaoqianInfo.pkId">
            <input type="text" name="orderTitle" :value="selectObject.orderTitle">
            <input type="text" name="mGSource" :value="biaoqianInfo.mGSource_">
            <input type="text" name="mBSource" :value="biaoqianInfo.mBSource_">
            <input type="text" name="creator" :value="biaoqianInfo.creator">
            <input type="text" name="createTime" :value="new Date(biaoqianInfo.createTime).toLocaleString()">
            <input type="text" name="detailCount" :value="biaoqianInfo.manifestDetailCount">
        </form>
        
        <!-- 添加清单 -->
        <el-dialog title="新建可追溯物料量清单" :visible="editBySelfShow" @close="customCancle" class="addQingDan">
            <div class="project1 project">
                <div class="projectTitle">
                    <div class="projectTitleLeft">
                        <p style="text-align:left">清单名称关键字：</p>
                        <div class="titleDiv">
                            <input class="projectTitleLeftinp" v-model="newList.detailName"/>
                        </div>
                        <span class="yewulaiyuan">业务来源：</span>
                        <div class="titleDiv">
                            <select class="projectTitleLeftinp" v-model="newList.sourceFrom">
                                <option value="0">全部</option>
                                <option value="2">进度计划-任务核实</option>
                                <option value="1">文档管理-关联构件</option>
                                <option value="7">成本管理-报表快照</option>
                                <option value="3">成本管理-工程量</option>
                                <option value="4">成本管理-物料量</option>
                            </select>
                            
                            <i class="downAngle"></i>
                        </div>
                    </div>
                    <div class="projectTitleRight">
                        <p style="text-align:left">创建时间：</p>
                        <div class="titleDiv">
                            <el-date-picker
                                class="projectTitleLeftinp"
                                v-model="newList.dataRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                        <span class="yewulaiyuan">业务状态：</span>
                        <div class="titleDiv">
                            <select class="serviceState projectTitleLeftinp" v-model="serviceStateValue">
                                <option v-for="(item,index) in serviceStateList" :key="index" :value="item.value"
                                        v-text="item.label"></option>
                            </select>
                            <i class="downAngle"></i>
                        </div>
                    </div>
                </div>
                <div style="overflow:hidden;">
                    <button class="chaxun" @click="searchResult(true)">查询</button>
                </div>
                <div style="overflow:hidden;">
                    <span class="searchresult">查询结果</span>
                    <!-- <button class="selectsence" @click="selectScence">场景选择</button> -->
                    <table border="1" class="UserList" width="100%">
                        <thead>
                            <tr  class="userList-thead">
                                <th>操作</th>
                                <th>清单类型</th>
                                <th>清单ID</th>
                                <th>清单名称</th>
                                <th>明细数量</th>
                                <th>业务来源</th>
                                <th>业务状态</th>
                                <th>创建时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in customData" :key="index">
                                <td>
                                    <input type="checkbox" v-model="item.isChecked" @click="handleChecked(item,index)"/>
                                    <!-- <el-checkbox v-model="item.isChecked"></el-checkbox> -->
                                </td>
                                <td v-text="parseType(item.type)"></td>
                                <td>{{item.detailId}}</td>
                                <td>{{item.detailName}}</td>
                                <td>{{item.componentCount}}</td>
                                <td v-text="parseMBSource(item.relaType)"></td>
                                <td v-text="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"
                                    :title="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"></td>
                                <td>{{new Date(item.createTime).toLocaleString()}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div  class="datagrid-pager pagination">
                        <table cellspacing="0" cellpadding="0" border="0" >
                            <tbody>
                                <tr>
                                    <td>
                                        <select class="pagination-page-list" v-model="customPageDetial.pagePerNum">
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'3')"></a>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'3')"></a>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                    </td>
                                    <td>
                                        <input class="pagination-num" type="text" v-model="customPageDetial.currentPage">
                                    </td>
                                    <td>
                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(customPageDetial.total/customPageDetial.pagePerNum)}}页</span>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'3')"></a>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'3')"></a>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" @click="reSearchResult(true)" class="btn-refresh btn-TAB"></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="pagination-info pagination-title" v-text="'显示1到'+customPageDetial.pagePerNum+',共'+customPageDetial.total+'记录'"></div>
                        <div style="clear:both;"></div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="customConfirm">确认</button>
                <button class="editBtnC" @click="customCancle">取消</button>
            </div>
        </el-dialog>
        <!-- 选型方式 -->
        <el-dialog title="选型方式确认" :visible="selectionMethods"  @close="selectionCancel">
            <div class="editBody">
                <div class="select-temp ">
                    <el-select v-model="selectionModelValue" placeholder="请选择" @change="selectionModelChange">
                        <el-option
                        v-for="(item,index) in selectionModelList"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>    
            </div> 
            <div slot="footer" class="dialog-footer">
                <el-button class="editBtnC separation" @click="selectionCancel">取 消</el-button>
                <el-button class="editBtnS" @click="selectionConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 校验结果 -->
        <el-dialog title="校验结果" :visible="checkoutResult"  @close="leadCancel">
            <div class="editBody">
                <ul>
                    <li v-for="(item,index) of checkoutResultList" :key="index"></li>
                </ul>
            </div> 
            <div slot="footer" class="dialog-footer">
                <el-button class="editBtnC separation" @click="leadCancel">取消导入</el-button>
                <el-button class="editBtnS" @click="leadConfirm">确认导入</el-button>
            </div>
        </el-dialog>
        <!-- 自动选型提示 -->
        <el-dialog title="自动选型提示" :visible="selectionHint"  @close="hintCancel">
            <div class="editBody content-left">
                <h3><span>自动选型结果统计：</span></h3>
                <p><span>待导入的清单条目数：</span></p>
                <p><span>不可以实现自动选型的条目数：</span></p>
                <p><span>选型完成并可以使用的条目数：</span></p>
            </div> 
            <div slot="footer" class="dialog-footer">
                <el-button class="editBtnC separation" @click="hintCancel">取消导入</el-button>
                <el-button class="editBtnS" @click="hintConfirm">确认导入</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios';
import commonList from  './../planCost/qingDan.vue'
import { serviceStateList } from "./constants"

export default {
    name:'DinghuoManage',
    data(){
        return{
            activeName:'0',
            BDMSUrl:'',
            token:'',
            selectIndexone:'-1',
            selectIndextwo:'-1',
            projId:'',
            userGroup:[],
            selectUser:'',
            planData:[],
            noPlanData:[],
            showDetail:true,
            orderDeatilData:[],
            orderInfoData:[],
            orderInfo:{},
            selectObject:{},//左侧选中的数据
            editfukuan:{
                show:false,
                computerunit:'',
                amount:'',
                price:'',
                obj:'',//选中行的数据
            },
            deleteDialog:false,
            deleteObjItem:{},
            isbiaoqianshow:false,
            biaoqianInfo:{},
            shebeiObj:{},
            projectName:'',
            isshowallbiaoqian:false,
            allBiaoqianData:[],
            pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            addNewListShow:false,
            newListName:'',
            suppyModel:'',
            editListTitle:false,
            editTitle:'',
            editTitleObj:{},
            showCommonList:false,
            planId:'',
            isHidden:false,
            editBySelfShow: false,
            newList:{
                detailName:'',
                sourceFrom:'0',
                dataRange:[],
                sourceState:'0',
            },
            customData:[],
            selcetedItem:{},
            checkedResults:{},
            customPageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            checkedResults:{},
            jiapyanResult:'',
            jianyanFlag:false,
            supplyData:[],
            serviceStateList:serviceStateList,
            serviceStateValue:'0',
            showWuZi:true,
            isDingHuo:true,
            DingDanObj:{},
            selectionMethods:false,
            selectionModelList:[
                {
                    label:'通过产品ID自动匹配',
                    value:1,
                },
                {
                    label:'通过标记自动匹配',
                    value:4,
                },
                {
                    label:'手动选择产品名称，品牌，规格参数',
                    value:2 ,
                },
                {
                    label:'不采用产品库，直接录入价格',
                    value:3,
                },
            ],
            selectionModelValue:'',
            checkoutResult:false,
            checkoutResultList:[],
            selectionMode:'',
            selectionHint:false,
        }
    },
    watch:{
        'customPageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.addNewQingDan()
        },
        'customPageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.addNewQingDan()
        },
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.projectName = localStorage.getItem('projectName');
        this.getUserGroup();
    },
    methods:{
        //添加清单
        addNewQingDan(){            
            this.reSearchResult(false);
            this.editBySelfShow = true;
        },
        //转换relaType 1
        handleSource(sourceFrom){
            switch(sourceFrom){
                case "2":
                    return 1;
                case "1":
                    return 2;
                case "7":
                    return 3;
                case "4":
                    return 5;
                case "3":
                    return 4;
                case "0":
                    return 0;
            }
        },
        //获取清单
        reSearchResult(flag){
            let rangeData = [];
            this.newList.dataRange.forEach(item=>{
                rangeData.push(new Date(item).toLocaleString().split(' ')[0]);
            });
            if(flag){
                this.customPageDetial.currentPage =1;
            }
            let formData = new FormData();
            console.log("获取清单",this.newList.sourceFrom);
            formData.append('detailName',this.newList.detailName|| '');
            formData.append('startDate',rangeData[0] || '');
            formData.append('endDate',rangeData[1] || '');
            formData.append('serviceState',this.serviceStateValue);
            formData.append('relaType',this.handleSource(this.newList.sourceFrom));
            formData.append('page',this.customPageDetial.currentPage);
            formData.append('rows',this.customPageDetial.pagePerNum);
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/loadManifest',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    type:2
                },
                data:formData
            }).then(response=>{
                if(response.data.cd == 0){
                    this.customData = response.data.rt.rows;
                    console.log("业务任务",this.customData);
                    this.customPageDetial.total = response.data.rt.total;
                    var type_c = ''; 
                    var relaType_c ='';
                    let sourceState_c = '';
                    if(this.customData!=null && this.customData.length!=0){
                        this.customData.forEach((item,index)=>{
                            Object.assign(item,{
                                isChecked:false
                            })
                        });
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //查询
        searchResult(){
            this.reSearchResult(true);
        },
        //选择文件
        checkItem(val) {
            console.log("选择文件",this.customData[val]);
            //  vm = this;
            let fileCheckList = [];
            for (let i = 0; i < this.customData.length; i++) {
            this.$set(this.customData[i], 'isChecked', false)
            }
            this.$set(this.customData[val], 'isChecked', true)
            this.checkedItem = this.customData[val]
            console.log("选择文件",this.customData[val]);
            // console.log(JSON.stringify(vm.checkedItem))
        },
        //确认订货
        sureDingHuo(){
            console.log("确认订货");
            axios({
                method:'POST',
                url:this.BDMSUrl+'project2/order/confirmOrder/'+this.planId,
                headers:{
                    token:this.token
                },
            }).then(res=>{
                console.log("确认订货",this.res);
                if(res.data.cd == 0){
                    this.$message({
                        type: 'success',
                        message: "确认订货成功！",
                    });
                    this.getUserGroup();
                }else{
                    alert(res.data.msg);
                    console.log(res)
                }
            })
        },
        //判断业务状态码
        parseMStatus(mStatus) {
            // 施工现场
            var constructionSite = mStatus.substring(0, 1);
            switch (constructionSite) {
            case '8':
                return '终审驳回';
            case '7':
                return '终审通过';
            case '6':
                return '终审补充';
            case '5':
                return '等待终审';
            case '4':
                return '初审驳回';
            case '3':
                return '初审通过';
            case '2':
                return '初审补充';
            case '1':
                return '等待初审';
            default:
                break;
            }
            // 进度计划
            var scheduledPlan = mStatus.substring(1, 2);
            switch (scheduledPlan) {
            case '3':
                return '已完工';
            case '2':
                return '已开工';
            case '1':
                return '已计划';
            default:
                break;
            }
            // 物资采购
            var materialPurchasing = mStatus.substring(2, 3);
            switch (materialPurchasing) {
            case '9':
                return '已签收';
            case '8':
                return '已抽检';
            case '7':
                return '已到场';
            case '6':
                return '已发货';
            case '5':
                return '已待发';
            case '4':
                return '生产中';
            case '3':
                return '已订货';
            case '2':
                return '已选型';
            case '1':
                return '待选型';
            default:
                break;
            }
            // 成本管理
            var costControl = mStatus.substring(3, 4);
            switch (costControl) {
            case '6':
                return '物料量核对完成';
            case '5':
                return '物料量核对中';
            case '4':
                return '工程量核对完成';
            case '3':
                return '工程量核对中';
            case '2':
                return '构件量核对完成';
            case '1':
                return '构件量核对中';
            default:
                break;
            }
            // 设计协调
            var designManage = mStatus.substring(4, 6);
            switch (designManage) {
            case 'A0':
                return '施工图深化设计';
            case '70':
                return '施工图设计';
            case '40':
                return '初步设计';
            case '10':
                return '方案设计';
            case '00':
                return '未定义';
            default:
                return '未定义';
            }
        },
        //业务来源
        parseMBSource(mBSource) {
            switch (mBSource) {
            case 1:
                return "文档管理-关联构件";
            case 2:
                return "进度计划-任务核实";
            case 3:
                return "成本管理-工程量";
            case 4:
                return "成本管理-物料量";
            case 5:
                return "物资采购-订货管理";
            case 6:
                return "讨论主题";
            case 7:
                return "成本管理-报表快照";
            default:
                return "";
            }
        },
        //清单类型
        parseType(val) {
            switch (val) {
            case 1:
                return "构件量清单";
            case 2:
                return "工程量清单";
            case 3:
                return "物料量清单"
            default:
                return "";
            }
        },
        //选择
        handleChecked(items,i){
            console.log("选择",items.isChecked,items);
            this.customData.map( (item,index)=>{
                // item.isChecked = false;
                if( i == index ){
                    item.isChecked = true;
                }
            });
            
        },
        backToH(){
            this.showCommonList = false;
        },
        showDetialList(val,i){
            console.log(val);
            this.showCommonList = true;
            this.checkItem = val;
            this.DingDanObj = {};
            Object.assign(this.DingDanObj,{
                                orderCode:this.orderInfo.orderCode,
                                orderTitle:this.orderInfo.orderTitle,
                                checkItem:this.checkItem,
                                orderId:this.orderInfo.id,
                            })
            console.log("订货管理到清单",this.DingDanObj); 
        },
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
            this.showDetail = true;
        },
        groupChange(){
            this.getPlanList(this.selectUser);
            this.getNoPlanList(this.selectUser);
            this.showDetail = true;
        },
        //新建订单
        newListBtn(){
            this.addNewListShow = true;
            this.getSupplyUserGroupList();
        },
        //转换relaType
        mappingRelaType(relaType){
            switch(relaType){
                case 1:
                    return 2;
                case 2:
                    return 1;
                case 3:
                    return 5;
                case 4:
                    return 6;
                case 7:
                    return 3;    
            }
        },
        //确认添加订单
        customConfirm(){
            console.log("确认添加订单")
            let num = 0;
            this.selcetedItem ={};
            this.customData.forEach(item=>{
                if(item.isChecked == true){
                    num+=1;
                    this.selcetedItem = item;
                }
            })
            console.log("确认新建订单s",num,this.selcetedItem)
            if(num == 1){
                let formData = new FormData();
                let relaType = this.mappingRelaType(this.selcetedItem.relaType);
                formData.append('detailId',this.selcetedItem.detailId);
                formData.append('relaType',relaType);
                formData.append('projectId',this.projId);
                formData.append('orderId',this.planId);
                formData.append('selectionMode',1);
                if( relaType == 6 ){
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'project2/order/addOrderDetailByDetail',
                        headers:{
                            token:this.token
                        },
                        data:formData
                    }).then(response=>{
                        console.log("添加清单",response);
                        if(response.data.cd == 0){
                            this.editBySelfShow = false;
                            this.$message({
                                type:'success',
                                message:'添加清单成功！'
                            })
                            this.getOrderDetail(this.planId);
                            // this.checkedResults = response.data.rt.dataProfiling;
                            // if(JSON.stringify(response.data.rt.checkResults)=='{}'){
                            //     this.jiapyanResult = '所有数据校验通过!';
                            //     this.jianyanFlag = true;
                            // }else{
                            //     this.jiapyanResult = response.data.rt.checkResults.verifyClassifyCode || response.data.rt.checkResults.verifyProductId;
                            //     //verifyProductId
                            //     this.jianyanFlag = false;
                            // }
                            // this.shureToImportshow = true;
                        }else{
                            this.$message({
                                type:'success',
                                message:response.data.msg,
                            })
                        }
                    })
                }else {
                    this.selectionMethods = true;
                    this.selectionModelValue = this.selectionModelList[0].label;
                    this.selectionMode = this.selectionModelList[0].value;
                }    
            }else if(num == 0){
                this.$message({
                    type:'warring',
                    message:'请选择要导入的清单！'
                })
                this.reSearchResult(true)
            }else{
                this.$message({
                    type:'warring',
                    message:'只能选择一个导入的清单！'
                })
                this.reSearchResult(true)
            }
        },
        //取消新建订单
        customCancle(){
            this.editBySelfShow = false;
        },
        //确认选型
        selectionConfirm(){
            // this.selectionMethods = false;
            this.checkoutResult = true;
            let formData = new FormData();
            formData.append('detailId',this.selcetedItem.detailId);
            formData.append('selectionMode',this.selectionMode);
            formData.append('projectId',this.projId);
            formData.append('relaType',this.mappingRelaType(this.selcetedItem.relaType));
            formData.append('componentCount',this.selcetedItem.componentCount);
            formData.append('orderId',this.planId);

            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/verifyAddOrderDetailByDetail',
                headers:{
                    token:this.token
                },
                data:formData
            }).then(response=>{
                console.log("添加清单验证(从清单中选取)",response);
                if(response.data.cd == 0){
                    // this.editBySelfShow = false;
                    this.$message({
                        type:'success',
                        message:'添加清单验证成功'
                    })
                    // this.getOrderDetail(this.planId);
                    // this.checkedResults = response.data.rt.dataProfiling;
                    // if(JSON.stringify(response.data.rt.checkResults)=='{}'){
                    //     this.jiapyanResult = '所有数据校验通过!';
                    //     this.jianyanFlag = true;
                    // }else{
                    //     this.jiapyanResult = response.data.rt.checkResults.verifyClassifyCode || response.data.rt.checkResults.verifyProductId;
                    //     //verifyProductId
                    //     this.jianyanFlag = false;
                    // }
                    // this.shureToImportshow = true;
                }else{
                    this.$message({
                        type:'warring',
                        message:response.data.msg
                    })
                }
            })
        },
        //取消选型
        selectionCancel(){
            this.selectionMethods = false;
        },
        //选型切换
        selectionModelChange(val){
            // console.log("选型切换",val);
            this.selectionMode = val;
        },
        //确认导入
        leadConfirm(){
            // this.checkoutResult = false;
            this.selectionHint = true;
        },
        //取消导入
        leadCancel(){
            this.checkoutResult = false;
        },
        //提示后确认导入
        hintConfirm(){
            // this.selectionHint = false;
        },
        //提示后取消导入
        hintCancel(){
            this.selectionHint = false;
        },
        //改变页码
        changePage(val,isTop){//分页 0 -1 1 2
            var vm = this; 
            if(isTop == 1){
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
            }else if(isTop == 2){
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
            }else if(isTop == 3){
                if (vm.customPageDetial.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.customPageDetial.currentPage >= Math.ceil(vm.customPageDetial.total / vm.customPageDetial.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
                case 0:
                    vm.customPageDetial.currentPage = 1
                    break;
                case -1:
                    vm.customPageDetial.currentPage--
                    break;
                case 1:
                    vm.customPageDetial.currentPage++
                    break;
                case 2:
                    vm.customPageDetial.currentPage = Math.ceil(vm.customPageDetial.total / vm.customPageDetial.pagePerNum)
                    break;
                }
            }
        },
        addListSure(){
            this.addNewListShow = false;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/add',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderTitle:this.newListName,
                    orderUgId:this.selectUser,
                    supplyUgId:this.suppyModel

                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getNoPlanList(this.selectUser);
                    this.newListName = '';
                    this.suppyModel = '';
                }else{
                    alert(response.data.msg);
                }
            })
        },
        listClose(){
            this.addNewListShow = false;
        },  
        //删除订单
        removeOrder(item){
            this.$confirm('确定要删除此订单？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/removeOrder',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        orderId:item.id,
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getNoPlanList(this.selectUser);
                    }else{
                        alert(response.data.msg);
                    }
                })
            })
            
        },
        //编辑订单
        editOrder(item){
            this.editTitleObj = item;
            this.editListTitle = true;
            this.editTitle = item.orderTitle
            console.log("编辑订单",item);
        },
        editListTitleSure(){
            this.editListTitle = false;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/updateOrderTitle',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderId:this.editTitleObj.id,
                    orderTitle:this.editTitle
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getNoPlanList(this.selectUser);
                }else{
                    alert(response.data.msg);
                }
            })
        },
        editListTitleCancel(){
            this.editListTitle = false;
        },
        //获取群组  
        getUserGroup(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getUserGroup',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        
                        this.userGroup = response.data.rt.ugList;
                        this.selectUser = response.data.rt.selectUgId;
                        this.getPlanList(this.selectUser);
                        this.getNoPlanList(this.selectUser);
                        console.log("获取群组",this.userGroup,this.selectUser);
                    } 
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //已订货
        getPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'2' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows !=null){
                            this.planData = response.data.rt.rows;
                        }else{
                            this.planData = [];
                        }
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //
        getNoPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'1' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
                            this.noPlanData = response.data.rt.rows;
                        }else{
                            this.noPlanData = [];
                        }
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        selectItem(item,index,flag){
            if(flag){
                this.selectIndextwo = index;
                this.isHidden = true;
                this.isDingHuo =false;
            }else{
                this.selectIndexone = index;
                this.isHidden = false;
                this.isDingHuo = true;
            }
            this.selectObject = item;
            this.showDetail = false;
            this.getOrderDetail(item.id);
            this.getOrderPaymentItem(item.id);
            this.getOrderInfo(item.id)
            this.planId = item.id;
            console.log("订货订单id",this.planId,this.token);
        },
        //获取订单信息
        getOrderInfo(id){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderInfo/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.orderInfo = response.data.rt;
                    console.log("获取订单信息",this.orderInfo);
                    if(this.orderInfo.orderDate!=null){
                        Object.assign(this.orderInfo,{
                            orderDate_:new Date(this.orderInfo.orderDate).toLocaleString()
                        })
                    }
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取订单的清单列表
        getOrderDetail(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderDetail/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderDeatilData = response.data.rt.rows;
                        console.log("获取订单的清单列表",this.orderDeatilData);
                        if(this.orderDeatilData !=null){
                            this.orderDeatilData.forEach((item)=>{
                                Object.assign(item,{
                                    updateDateTime_:new Date(item.updateDateTime).toLocaleString()
                                })
                            })
                        } 
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        // 获取弹框订货方数组
        getSupplyUserGroupList(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getSupplyUserGroupList',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.supplyData = response.data.rt;
                        if(Array.isArray(this.supplyData) && this.supplyData.length>0){
                            this.suppyModel = this.supplyData[0].ugId;
                        }
                        console.log("获取弹框订货方数组",this.supplyData);
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //所属订单付款想列表
        getOrderPaymentItem(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderPaymentItem/'+id,
                headers:{
                    token:this.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderInfoData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //查看详情
        viewDeatil(item){
            this.editfukuan.obj = item;
            this.editfukuan.show = true;
            this.editfukuan.computerunit = item.unit;
            this.editfukuan.amount = item.count;
            this.editfukuan.price = item.unitPrice;
        },
        //确认编辑
        editfukuanSure(){
            if(this.editfukuan.amount != '' && this.editfukuan.price != '' && this.editfukuan.computerunit != ''){
                let totalPrice = this.editfukuan.amount*this.editfukuan.price;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/updatePaymentItem',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.editfukuan.obj.id,
                        count:this.editfukuan.amount,
                        unit:this.editfukuan.computerunit,
                        unitPrice:this.editfukuan.price,
                        totalPrice:totalPrice,
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getOrderPaymentItem(this.selectObject.id);
                        this.editfukuan.show = false;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }else{
                alert('计价单位，数量，单价都为必输项!');
            }
        },
        //取消编辑
        editfukuanCancel(){
            this.editfukuan.show = false;
        },
        //标签
        tips(item){
            this.isbiaoqianshow = true;
            this.shebeiObj = item;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getManifestInfoByBId',
                headers:{
                    token:this.token
                },
                params:{
                    bId:item.id,
                    rType:5,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.cd !=null){
                        this.biaoqianInfo = response.data.rt;
                        Object.assign(this.biaoqianInfo,{
                            mBSource_:this.parseMBSource(this.biaoqianInfo.mBSource),
                            mGSource_:this.parseMGSource(this.biaoqianInfo.mGSource)
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
        },
        //网页预览
        labelListConfirm(){
            this.$refs.manifestQrCodeSingleForm.submit();
        },
        //打印当前标签页
        printLabelList(){
            alert('已向打印机发送请求！');
        },
        biaoqianCLose(){
            this.isbiaoqianshow = false;
        },
        // parseMBSource(mBSource) {
        //     switch (mBSource) {
        //         case 1:
        //             return "文档管理-关联构件";
        //         case 2:
        //             return "进度计划-任务核实";
        //         case 3:
        //             return "成本管理-工程量";
        //         case 4:
        //             return "成本管理-物料量";
        //         case 5:
        //             return "物资采购-订货管理";
        //         case 6:
        //             return "讨论主题";
        //         case 7:
        //             return "成本管理-报表快照";
        //         default:
        //             return "";
        //     }
        // },
        parseMGSource(mGSource) {
            switch (mGSource) {
                case 1:
                    return "选择集";
                case 2:
                    return "报表快照";
                case 3:
                    return "构件量生成";
                case 4:
                    return "外部导入";
                case 5:
                    return "构件量生成";
                default:
                    return "";
            }
        },
        //删除设备清单
        deleteItem(item){
            this.deleteDialog = true;
            this.deleteObjItem = item;
        },
        //删除确定
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/removeOrderDetail',
                headers:{
                    token:this.token
                },
                params:{
                    orderId:this.deleteObjItem.orderId,
                    id:this.deleteObjItem.id
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getOrderDetail(this.selectObject.id);
                    this.deleteDialog = false;
                }else{
                    alert(response.data.msg);
                }
            })

        },
        //查看全部标签
        viewAllDetail(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/listOrderDetailByOrderId',
                headers:{
                    token:this.token
                },
                params:{
                    pageNo:this.pageLabelList.currentPage,
                    pageSize:this.pageLabelList.pagePerNum,
                    orderId:this.selectObject.id
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.isshowallbiaoqian = true;
                    if(response.data.rt != null){
                        this.allBiaoqianData = response.data.rt.rows;
                        this.allBiaoqianData.forEach(item=>{
                            Object.assign(item,{
                                mBSource_:this.parseMBSource(item.mBSource),
                                mGSource_:this.parseMGSource(item.mGSource)
                            })
                        })
                        this.pageLabelList.total = response.data.rt.pager.totalSize;
                    }
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },
        findManifestDetailList(){

        }

    }
}
</script>
<style lang="less">
#dinghuo{
    ::-webkit-scrollbar{width:0px}//隐藏滚动条
    .content-hidden {
        display: none;               
    }
    .topHeader{
        box-sizing: border-box;
        float: left;
        width: 100%;
        overflow: auto;
        max-height: 800px;
        .purchaseNav{
            height: 49px;
            padding-top: 16px;
            padding-left: 20px;
            background: #fafbfc;
            box-sizing: border-box;
            border-bottom: 1px solid #e6e6e6;
        }
        .elselect{
            overflow: hidden;
            margin-top:10px;
            margin-right: 50px;
            height: 40px;
            line-height: 40px;
            .el-select{
                float: right;
                margin-left: 10px;
            }
            .elselecttitle{
                float: right;
            }
        }
        .navItem{
            height: 34px;
            width: 106px;
            float: left;
            line-height: 30px;
            font-size: 14px;
            text-decoration: none;
            color: #999;
        }
        .navactive{
            background: #fff;
            color: #fc3439;
            font-weight: bold;
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            border-top: 3px solid #fc3439;
            box-sizing: border-box;
        }
        .pbody{
            border: 1px solid #e6e6e6;
            margin: 10px 10px 10px 20px;
            display: flex;
            min-height: calc(100vh - 165px);
            .el-tabs__nav{
                height: 40px;
                line-height: 40px;
            }
        }
        .pbodyleft{
            width: 405px;
            height: 100%;
            border-right: 1px solid #e6e6e6;
            .el-tabs__content{
                margin-top: 10px;
                border-top: 1px solid #e6e6e6;
            }
            .leftcontent{
                .leftcontentul{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                }
                .lefttitle{
                    background: #f2f2f2;
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                }
                .lefttitlecontent{
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                    border-bottom: 1px solid #e6e6e6;
                    cursor: pointer;
                }
                .showIcon{
                    float: right;
                    visibility: hidden;
                }
                .selectActive{
                    color: #333;
                    font-weight: bold;
                }
                .lefttitlecontent:hover .showIcon{
                    visibility: visible;
                }
                .lefttitlelab{
                    display: inline-block;
                    margin-left: 20px;
                }
                .lefttitlespan{
                    display: inline-block;
                    margin-left: 87px;
                }
                .noplanEdit{
                    display: inline-block;
                    width: 17px;
                    height: 16px;
                    background: url('./images/1-2.png')no-repeat 0 0;
                    cursor: pointer;
                    margin-right: 12px;
                }
                .noplanDelete{
                    display: inline-block;
                    width: 17px;
                    height: 16px;
                    margin-right: 10px;
                    background: url('./images/delete1.png')no-repeat 0 0;
                    cursor: pointer;
                }
                .lefttitlespanone{
                    margin-left: 40px;
                }
            }
        }
        .pbodyright{
            flex: 1;
            overflow: scroll;
            // .scrolldiv{
            //     overflow-y:scroll;
            //     height: calc(100vh - 226px); 
            //     // margin-bottom: 20px;
            // }
            .pbodyrighttitle{
                height: 39px;
                margin: 0;
                padding: 0;
                border-bottom: 1px solid #e6e6e6;
                text-align: left;
                line-height: 39px;
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
            .newList{
                height: 26px;
                width: 77px;
                border: none;
                float: right;
                margin-top: 9px;
                margin-right: 20px;
                background: #fc3439;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                font-family: 'Microsoft YaHei';
            }
            .jindu{
                border-bottom: 1px solid #e6e6e6;
                margin: 0 20px;
                text-align: left;
                height: 44px;
                line-height: 44px;
                overflow: hidden;
            }
            .titleimg{
            width: 15px;
            height:16px;
            display: inline-block;
            margin-right: 10px;
            background: url('./images/jindu.png') ;
            position: relative;
            top: 2px;
            }
            .fukuan{
                width: 17px;
                height:16px;
                background: url('./images/fukuan.png') ;
            }
            .shebeiimg{
                width: 14px;
                height:16px;
                display: inline-block;
                margin-right: 10px;
                background: url('./images/shebei.png') ;
                position: relative;
                top: 2px;
            }
            .titletext{
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
            .sureDinghuo {
                float: right;
                margin-right: 20px;
                color: #fc3439;
                // background: #fc3439;
                border:1px solid #fc3439;
                border-radius: 4px;
                width: 68px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                position: relative;
                top: 9px;
                cursor: pointer;
            }
            .alllist{
                width: 77px;
                height: 26px;
                border: none;
                background: #f5f5f5;
                color: #666;
                float: right;
                cursor: pointer;
                margin-top: 9px;
            }
        }
        .borderbottom{
            margin: 10px 20px 30px 20px;
        }
        .editIcon{
            float: left;
            width: 17px;
            height: 16px;
            background: url('./images/1-2.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .biaoqianIcon{
            float: left;
            width: 12px;
            height: 12px;
            background: url('./images/editdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .editdetail{
            float: left;
            width: 10px;
            height: 12px;
            background: url('./images/viewdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .deleteIcon{
            float: left;
            width: 12px;
            height: 12px;
            background: url('./images/deleteIcon.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .UserList{
            border-collapse: collapse;
            border: 1px solid #e6e6e6;
            thead {
                background: #f2f2f2;
                th {
                padding-left: 10px;
                height: 36px;
                text-align: left;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                font-size: 12px;
                color: #333333;
                }
            }
            tbody {
                tr {
                td {
                    padding-left: 10px;
                    height: 36px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                }
                &:hover {
                    background: #fafafa;
                }
                }
            }
        }
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .img_left {
        float: left;
        width: 90px;
        height: 90px;
        margin: 40px 30px 0 10px;
    }
    .right {
      float: left;
      width: 400px;
      margin-top: 20px;
      .item-list {
        margin-bottom: 14px;
        .text-left {
          float: left;
          font-size: 12px;
          line-height: 12px;
          width: 80px;
          color: #999;
          text-align: left;
        }

        .text-right {
          float: left;
          width: 300px;
          font-size: 12px;
          line-height: 12px;
          color: #333333;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &:last-of-type {
          margin-bottom: 20px;
        }
      }
    }
    .editSelect{
        width: 447px;
        height:38px;
        padding-left: 10px;
    }
    .editBodyone{
        position: relative;
        .icon-sanjiao{
            display: block;
            position: absolute;
            width: 12px;
            height: 7px;
            // background-image:url('./images/sanjiao.png');
            background-size: 100% 100%;
            content: '';
            top: 18px;
            left: 590px;
        }
    }
    //添加清单
    .el-select {
        width:280px;
    }
    .content-left {
        text-align: left;
        margin-left: 50px;
    }
    .el-dialog {
        width:660px;
        .el-dialog__header {
            height: 68px;
            padding: 0;
            border-bottom: 2px solid #e6e6e6;
            text-align: left;
            .el-dialog__title {
                color: #fc3439;
                font-size: 18px;
                line-height: 18px;
                font-weight: bold;
                font-family: 'MicrosoftYaHei';
                display: inline-block;
                margin: 34px 0 15px 30px;
            }
        }
        .el-dialog__body {
            margin-top: 20px;
            padding: 0;
            color: #606266;
            line-height: 24px;
            font-size: 14px;
        }
    }
    .project1{
        margin: 20px 30px 30px 30px;
        .projectTitle{
            display: flex;
            .projectTitleLeft,.projectTitleRight{
                width: 50%;
                overflow: hidden;
                .el-radio{
                    float: left;
                    margin-bottom: 5px;
                }
                .titleDiv,.yewulaiyuan{
                    float: left;
                }
                .titleDiv{
                    position: relative;
                    .projectTitleLeftinp {
                        width: 288px;
                        height: 36px;
                        padding-left: 10px;
                        border: 1px solid #d1d1d1;
                        box-sizing: border-box;
                    }
                }
                .downAngle{
                    background: url('./images/sanjiao.png');
                    width: 12px;
                    height: 7px;
                    display: block;
                    position: absolute;
                    top: 13px;
                    left: 262px;
                }
                .yewulaiyuan{
                    color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    display: block;
                    margin: 10px 0 5px 0;
                }
                .projectTitleLeftinp{
                    width: 288px;
                    height: 36px;
                    padding-left: 10px;
                    border:1px solid #d1d1d1;
                    -webkit-appearance: none;
                }
            }
            .projectTitleRight{
                width: 50%;
            }
        }
        .chaxun{
            width: 145px;
            height: 35px;
            background: #fc3439;
            color: #fff;
            border: none;
            outline: none;
            float: left;
            margin:13px 0 0 0;
            border-radius: 2px;
            cursor: pointer;
        }
    }
    .project{
        // margin: 0 20px;
        .searchresult{
            font-size: 12px;
            line-height: 12px;
            color: #999;
            display: block;
            float: left;
            margin: 27px 0 13px 0;
        }
        .selectsence{
            float: right;
            width: 68px;
            height: 24px;
            background: #fff;
            border:none;
            outline: none;
            margin: 20px 0 6px 0;
            border: 1px solid #ccc;
            border-radius: 1px;
            font-size: 12px;
            color: #666;
            cursor: pointer;
        }
        .editBtn{
            background: url('../../assets/edit.png') no-repeat;
        }
        .detailBtn{
            background: url('./images/details.png') no-repeat;
        }
        .backToProjectBtn{
            cursor: pointer;
        }
        .backToProjectBtn:hover{
            color:#fc3439;
        }
        .header{
            border-bottom: 2px solid #e6e6e6;
            margin: 20px 0;
            padding-bottom: 10px;
            .left{
                float: left;
                font-size: 16px;
                line-height: 16px;
                color: #fc3439;
                font-weight: bold;
                padding-left:30px;
                position: relative;
                
                .reportS{
                    background: url('./images/listS.png')no-repeat 0 0;
                } 
                .target{
                    background: url('./images/target.png')no-repeat 0 0;
                } 
                .icon{
                display: block;
                    width: 20px;
                    height: 17px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            .item-btn{
                float: right;
                label,.label-item{
                    float:left;
                    width:auto;
                    height:26px;
                    padding: 0 9px;
                    border-top: 1px solid #e6e6e6;
                    border-bottom: 1px solid #e6e6e6;
                    text-align:center;
                    line-height:24px;
                    font-size:12px;
                    color:#666666;
                    cursor: pointer;
                    border-left: 1px solid #e6e6e6;
                    &:first-of-type{
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                    }
                    &:last-of-type{
                    border-right: 1px solid #e6e6e6;
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                    }
                }
                .label-item{
                        border-right: none!important;
                }
            }
            .right{
                text-decoration: none;
                float: right;
                font-size: 14px;
                color: #336699;
                line-height: 14px;
                margin-top:4px; 
            }
        }
        .UserList{
            border-collapse: collapse;
            border: 1px solid #e6e6e6;
            .checkbox-att{
                display:none;
            }
            .checkbox-fileItem{
                float: left;
                width: 14px;
                height: 14px;
                border: 1px solid #cccccc;
                cursor: pointer;
                position: relative;
                margin-left:4px;
            }
            .active{
                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                border: 1px solid #fc3439;
            }
            thead{
                background: #f2f2f2;
                th{
                    padding-left: 6px;
                    padding-right: 15px;
                    height: 36px;
                    text-align: left;
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
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                        .location{
                            display: block;
                            width: 12px;
                            height: 16px;
                            background: url('../ManageCost/images/location.png')no-repeat 0 0;
                            cursor: pointer;
                        }
                    }
                    .Strong{
                        font-weight: bold;
                    }
                    .deleteBtn{
                        background: url('../../assets/delete.png') no-repeat;
                    }
                    .dataBtn{
                        background: url('./images/data.png') no-repeat;
                    }
                    .listBtn{
                        background: url('./images/list.png') no-repeat;
                    }
                    .refreshBtn{
                        background: url('./images/refresh.png') no-repeat;
                    }
                }
                .activeTr{
                    background: #0081c2;
                    td{
                        color: #fff!important;
                    }
                }
            }
        }
    }
    .dialog-footer{
        text-align: center;
    }
    .editBtnS, .editBtnC{
        width: 111px;
        height: 36px;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 2px;
    }
    .editBtnS{
        background: #fc3439;
        margin-right: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .editBtnS:hover{
        background: #ff5257;
    }
    .editBtnC{
        color: #666;
        background: #fff;
        border: 1px solid #ccc;
    }
    .editBtnC:hover{
        background: #e6e6e6;
        color: #666;
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
            border-top: none;
        }
        .pagination table {
            float: left;
            height: 30px;
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
    
    
}
</style>

