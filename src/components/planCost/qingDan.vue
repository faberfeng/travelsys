<template>
<div id="CommenList" v-loading.fullscreen.lock="fullscreenLoading">
        <form id="print-qrcode" action="http://127.0.0.1:54321/qblabel/general" method="post" enctype="multipart/form-data" name="print-qrcode"  target="printLabel">
         <!-- target="printLabel" -->
            <input type="hidden" name="p" ref="labelContent" id="labelContent" value="">
        </form>
        <iframe id="printLabel" name="printLabel" src="about:blank" style="display:none;"></iframe> 
        <div :class="[{'box-left-avtive':!screenLeft.show,},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                
                <div id="containerMessage">
                    <div class="qindanProject" v-loading="loading">
                        <p class="antsLine">
                            成本管理<i class="icon-sanjiao-right"></i><span style="cursor:pointer"  @click="back()" v-text="title"></span><i class="icon-sanjiao-right"></i>
                            <span class="strong">清单详情</span>
                        </p>
                        <div v-if="!showUploadPhoto">
                            <!--以下是列表-->
                            <p class="header clearfix">
                                <span class="left_header">
                                    <i class="list_ icon"></i>清单基本信息
                                </span>
                                <a :class="['right_header','right-expend',topExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)"  @click="changeTopExpend()" v-text="topExpend.title"></a>
                            </p>
                            <div v-show="topExpend.isExpend" style="background:#fafafa;position: relative;">
                                <ul class="left-item-box">
                                    <li class="item clearfix" style="margin-bottom:40px;margin-top:50px">
                                        <span class="left">清单编号</span>
                                        <span class="right" v-text="ManifestInfo.id"></span>
                                    </li>
                                        <!-- <li class="item clearfix">
                                        <span class="left">创建用户</span>
                                        <span class="right"  v-text="ManifestInfo.creator"></span>
                                    </li>
                                        <li class="item clearfix">
                                        <span class="left">业务来源</span>
                                        <span class="right" v-text="parseMBSource(ManifestInfo.mBSource)"></span>
                                    </li>

                                        <li class="item clearfix">
                                        <span class="left">原始编号</span>
                                        <span class="right" v-text="(ManifestInfo.mOriginalId == 0)?'-':ManifestInfo.mOriginalId"></span>
                                    </li>
                                        <li class="item clearfix">
                                        <span class="left">修改用户</span>
                                        <span class="right"  v-text="ManifestInfo.updater"></span>
                                    </li>
                                        <li class="item clearfix">
                                        <span class="left">版本号</span>
                                        <span class="right" v-text="ManifestInfo.mVersion"></span>
                                    </li> -->

                                        <li class="item clearfix" style="margin-bottom:40px;margin-top:50px">
                                        <span class="left">清单名称</span>
                                        <span class="right" v-text="ManifestInfo.name"></span>
                                    </li>
                                        <!-- <li class="item clearfix">
                                        <span class="left">业务状态</span>
                                        <span class="right"  v-text="parseMStatus(ManifestInfo.mStatus)+'('+ ManifestInfo.mStatus +')'"></span>
                                    </li>
                                        <li class="item clearfix">
                                        <span class="left">修改时间</span>
                                        <span class="right" v-text="initData(ManifestInfo.updateTime)"></span>
                                    </li> -->

                                        <!-- <li class="item clearfix" style="margin-bottom:0;">
                                        <span class="left">生成方式</span>
                                        <span class="right" v-text="parseMGSource(ManifestInfo.mGSource)"></span>
                                    </li>
                                        <li class="item clearfix" style="margin-bottom:0;">
                                        <span class="left">创建时间</span>
                                        <span class="right"  v-text="initData(ManifestInfo.createTime)"></span>
                                    </li> -->
                                    <li class="item clearfix" style="margin-bottom:40px;margin-top:50px">
                                        <span class="left">清单类型</span>
                                        <span class="right" v-text="ManifestInfo._mType"></span>
                                    </li>
                                </ul>
                                <div class="right-QRcode">
                                    <!-- QRCode2/getQRimage/QR-QD-' -->
                                    <img :src="BDMSUrl+'manifest/qr/QR-QD-' + addZero(ManifestInfo.id, 7) " alt="">
                                </div>
                            </div>
                            <p class="header clearfix"  style="margin-top:30px;">
                                <span class="left_header">
                                    <i class="detial icon"></i>明细基本信息
                                </span>
                                <a :class="['right_header','right-expend',bottomExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeBottomExpend()" v-text="bottomExpend.title"></a>
                            </p>
                            <div v-show="bottomExpend.isExpend">
                                <div style="overflow: auto;">
                                    <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                        <span  class="title-list" v-text="'明细总数：'+detailNum"></span>
                                        <span class="item-btn clearfix">
                                            <label class="item-btn-icon icon-0" @click="changeShowType(true)">逐个显示</label>
                                            <label class="item-btn-icon icon-1" @click="changeShowType(false)">合并显示</label>
                                            <label class="item-btn-icon icon-2" @click="showLabel()">全部标签</label>
                                            <label class="item-btn-icon icon-3" @click="showLabelHeader()">显示列</label>
                                        </span>
                                    </p>
                                    <el-table  :data="S_quantitiesList"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">  
                                        <el-table-column
                                            v-for="(item,index) in detailsHead" :key="index"
                                            :prop="item.prop"
                                            :label="item.name"
                                            v-if="item.show"
                                            align="center"
                                            :fixed="index == 0?'left':false"
                                            :width="index == 0?'50':''"
                                            :formatter="testIfIsNull"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="operate"
                                            label="操作"
                                            v-if="showOperate"
                                            fixed="right"
                                            align="center"
                                            :formatter="testIfIsNull"
                                            >
                                            <template slot-scope="scope">
                                            <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                            <button class="detialBtn actionBtn" title="详情"  @click.stop="checkLabel(scope)" v-if="showType == 'separate'"></button>
                                            <button class="labelBtn actionBtn" title="标签"  @click.stop="openLabel(scope)" ></button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <!--以下是page-navigitation-->
                                <div class="datagrid-pager pagination" v-if="S_quantitiesList.length>0">
                                    <table cellspacing="0" cellpadding="0" border="0" >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
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
                                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0)"></a>
                                                </td>
                                                <td>
                                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1)"></a>
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
                                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                                                </td>
                                                <td>
                                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2)"></a>
                                                </td>
                                                <td>
                                                    <div class="pagination-btn-separator"></div>
                                                </td>
                                                <td>
                                                    <a href="javascript:void(0)" @click="findManifestDetailList()" class="btn-refresh btn-TAB"></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                                    <div style="clear:both;"></div>
                                </div>
                            </div>
                            <!-- 物资采购 物料跟踪 -->
                            <div v-if="isShowWuLiao">
                                <p class="header clearfix"  style="margin-top:30px;">
                                    <span class="left_header">
                                        <i class="detial icon"></i>跟踪计划清单【{{wuLiaoObj.orderTitle}}】({{wuLiaoObj.orderCode}})明细
                                    </span>
                                    <a :class="['right_header','right-expend',OrderListExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeOrderListExpend()" v-text="OrderListExpend.title"></a>
                                </p>
                                <div v-show="OrderListExpend.isExpend">
                                    <div style="overflow: auto;">
                                        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                            <!-- <span class="title-list" @click="allEditCount">
                                                <label class="item-btn-icon title-border">批量编辑</label>
                                            </span> -->
                                            <span  class="title-list" v-text="'总价：'+dingHuoAmount">   
                                            </span>
                                            <span class="item-btn clearfix"> 
                                                <label class="item-btn-icon icon-2" @click="showDingHuoLabel()">全部标签</label>
                                                <label class="item-btn-icon icon-3" @click="showOrderLabelHeader()">显示列</label>
                                            </span>
                                        </p>
                                        <el-table  :data="ComponentList"  border style="width: 100%" class="detialInfoTable" @selection-change="handleSelectionChange">
                                            <el-table-column :prop="indexList.prop" :label="indexList.name"
                                                v-if="indexList.show"
                                                align="center"
                                                fixed="left"
                                                width="50"
                                                :formatter="testIfIsNull">  
                                            </el-table-column>
                                            <el-table-column
                                                type="selection"
                                                width="50"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(item,index) in planHead" :key="index"
                                                :prop="item.prop"
                                                :label="item.name"
                                                v-if="item.show"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                prop="operate"
                                                label="操作"
                                                v-if="showOperate"
                                                fixed="right"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                                <template slot-scope="scope">
                                                
                                                <button class="editBtn actionBtn" title="编辑"  @click.stop="editCount(scope)" v-if="showType == 'separate' && isDingHuo == false"></button>
                                                <button class="labelBtn actionBtn" title="标签"  @click.stop="openDingHuoLabel(scope)" ></button>
                                                <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!--以下是page-navigitation-->
                                    <div class="datagrid-pager pagination" v-if="ComponentList.length>0">
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select class="pagination-page-list" v-model="pageOrder.pagePerNum">
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
                                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePageOrder(0)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePageOrder(-1)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                                    </td>
                                                    <td>
                                                        <input class="pagination-num" type="text" v-model="pageOrder.currentPage">
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageOrder.total/pageOrder.pagePerNum)}}页</span>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePageOrder(1)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePageOrder(2)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="findComponentList()" class="btn-refresh btn-TAB"></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="pagination-info pagination-title" v-text="'显示1到'+pageOrder.pagePerNum+',共'+pageOrder.total+'记录'"></div>
                                        <div style="clear:both;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 物资采购 订货管理 -->
                            <div v-if="isShowWuZi">
                                <p class="header clearfix"  style="margin-top:30px;">
                                    <span class="left_header">
                                        <i class="detial icon"></i>订货清单【{{dinghuoObj.orderTitle}}】({{dinghuoObj.orderCode}})明细
                                    </span>
                                    <a :class="['right_header','right-expend',OrderListExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeOrderListExpend()" v-text="OrderListExpend.title"></a>
                                </p>
                                <div v-show="OrderListExpend.isExpend">
                                    <div style="overflow: auto;">
                                        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                            <span class="title-list" @click="allEditCount">
                                                <label class="item-btn-icon title-border">批量编辑</label>
                                            </span>
                                            <span  class="title-list" v-text="'总价：'+dingHuoAmount">   
                                            </span>
                                            <span class="item-btn clearfix"> 
                                                <label class="item-btn-icon icon-2" @click="showDingHuoLabel()">全部标签</label>
                                                <label class="item-btn-icon icon-3" @click="showOrderLabelHeader()">显示列</label>
                                            </span>
                                        </p>
                                        <el-table  :data="ComponentList"  border style="width: 100%" class="detialInfoTable" @selection-change="handleSelectionChange">
                                            <el-table-column :prop="indexList.prop" :label="indexList.name"
                                                v-if="indexList.show"
                                                align="center"
                                                fixed="left"
                                                width="50"
                                                :formatter="testIfIsNull">  
                                            </el-table-column>
                                            <el-table-column
                                                type="selection"
                                                width="50"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(item,index) in orderHead" :key="index"
                                                :prop="item.prop"
                                                :label="item.name"
                                                v-if="item.show"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                prop="operate"
                                                label="操作"
                                                v-if="showOperate"
                                                fixed="right"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                                <template slot-scope="scope">
                                                
                                                <button class="editBtn actionBtn" title="编辑"  @click.stop="editCount(scope)" v-if="showType == 'separate' && isDingHuo == false"></button>
                                                <button class="labelBtn actionBtn" title="标签"  @click.stop="openDingHuoLabel(scope)" ></button>
                                                <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!--以下是page-navigitation-->
                                    <div class="datagrid-pager pagination" v-if="ComponentList.length>0">
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select class="pagination-page-list" v-model="pageOrder.pagePerNum">
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
                                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePageOrder(0)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePageOrder(-1)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                                    </td>
                                                    <td>
                                                        <input class="pagination-num" type="text" v-model="pageOrder.currentPage">
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageOrder.total/pageOrder.pagePerNum)}}页</span>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePageOrder(1)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePageOrder(2)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="findComponentList()" class="btn-refresh btn-TAB"></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="pagination-info pagination-title" v-text="'显示1到'+pageOrder.pagePerNum+',共'+pageOrder.total+'记录'"></div>
                                        <div style="clear:both;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 物资采购 发货管理 -->
                            <div v-if="isShowFaHuo">
                                <p class="header clearfix"  style="margin-top:30px;">
                                    <span class="left_header">
                                        <i class="detial icon"></i>发货清单【{{fahuoObj.orderTitle}}】({{fahuoObj.orderCode}})明细
                                    </span>
                                    <a :class="['right_header','right-expend',OrderListExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeOrderListExpend()" v-text="OrderListExpend.title"></a>
                                </p>
                                <div v-show="OrderListExpend.isExpend">
                                    <div style="overflow: auto;">
                                        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                            <span class="title-list" @click="allEditSend" v-if="!isFaHuo">
                                                <label class="item-btn-icon title-border">批量发货</label>
                                            </span>
                                            <span class="title-list" v-text="'总价：'+dingHuoAmount">   
                                            </span>
                                            <span class="item-btn clearfix">
                                                <label class="item-btn-icon icon-2" @click="allSend()">全部发货</label>
                                                <label class="item-btn-icon icon-2" @click="showDingHuoLabel()">全部标签</label>
                                                <label class="item-btn-icon icon-3" @click="showFaHuoLabelHeader()">显示列</label>
                                            </span>
                                        </p>
                                        <el-table  :data="ComponentList"  border style="width: 100%" class="detialInfoTable" @selection-change="handleSelectionChange">
                                            <el-table-column :prop="indexList.prop" :label="indexList.name"
                                                v-if="indexList.show"
                                                align="center"
                                                fixed="left"
                                                width="50"
                                                :formatter="testIfIsNull">  
                                            </el-table-column>
                                            <el-table-column
                                                type="selection"
                                                width="50"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(item,index) in sendHead" :key="index"
                                                :prop="item.prop"
                                                :label="item.name"
                                                v-if="item.show"
                                                align="center"
                                                :formatter="handleData"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                prop="operate"
                                                label="操作"
                                                v-if="showOperate"
                                                fixed="right"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                                <template slot-scope="scope">
                                                
                                                <button class="editBtn actionBtn" title="发货"  @click.stop="editSend(scope)" v-if="showType == 'separate' && scope.row.sendStatus == 0"></button>
                                                <button class="labelBtn actionBtn" title="标签"  @click.stop="openFaHuoLabel(scope)" ></button>
                                                <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!--以下是page-navigitation-->
                                    <div class="datagrid-pager pagination" v-if="ComponentList.length>0">
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select class="pagination-page-list" v-model="pageOrder.pagePerNum">
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
                                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePageOrder(0)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePageOrder(-1)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                                    </td>
                                                    <td>
                                                        <input class="pagination-num" type="text" v-model="pageOrder.currentPage">
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageOrder.total/pageOrder.pagePerNum)}}页</span>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePageOrder(1)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePageOrder(2)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="findComponentList()" class="btn-refresh btn-TAB"></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="pagination-info pagination-title" v-text="'显示1到'+pageOrder.pagePerNum+',共'+pageOrder.total+'记录'"></div>
                                        <div style="clear:both;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 物资采购 检查验收 检查 -->
                            <div v-if="isShowCheck">
                                <p class="header clearfix"  style="margin-top:30px;">
                                    <span class="left_header">
                                        <i class="detial icon"></i>检查管理清单【{{CheckReceiptObj.orderTitle}}】({{CheckReceiptObj.orderCode}})明细
                                    </span>
                                    <a :class="['right_header','right-expend',OrderListExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeOrderListExpend()" v-text="OrderListExpend.title"></a>
                                </p>
                                <div v-show="OrderListExpend.isExpend">
                                    <div style="overflow: auto;">
                                        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                            <span class="title-list" v-if="showEditAllCheck" @click="editAllCheck"> 
                                                <label class="item-btn-icon title-border">批量检查</label>
                                            </span>
                                            <span  class="title-list" v-text="'总价：'+dingHuoAmount">   
                                            </span>
                                            <span class="item-btn clearfix">
                                                <label class="item-btn-icon icon-2" @click="showDingHuoLabel()">全部标签</label>
                                                <label class="item-btn-icon icon-3" @click="showCheckLabelHeader()">显示列</label>
                                            </span>
                                        </p>
                                        <el-table  :data="ComponentList"  border style="width: 100%" class="detialInfoTable" @selection-change="handleSelectionChange">
                                            <el-table-column :prop="indexList.prop" :label="indexList.name"
                                                v-if="indexList.show"
                                                align="center"
                                                fixed="left"
                                                width="50"
                                                :formatter="testIfIsNull">  
                                            </el-table-column>
                                            <el-table-column
                                                type="selection"
                                                width="50"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(item,index) in checkHead" :key="index"
                                                :prop="item.prop"
                                                :label="item.name"
                                                v-if="item.show"
                                                align="center"
                                                :formatter="handleData"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                prop="operate"
                                                label="操作"
                                                v-if="showOperate"
                                                fixed="right"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                                <template slot-scope="scope">
                                                
                                                <button class="editBtn actionBtn" title="检查"  @click.stop="editCheck(scope)" v-if="showType == 'separate' && scope.row.checkStatus == 0"></button>
                                                <button class="backBtn actionBtn" title="撤销"  @click.stop="editCancel(scope)" v-if="showType == 'separate' && scope.row.checkStatus == 2"></button>
                                                <button class="labelBtn actionBtn" title="照片"  @click.stop="editUpLoadPicture(scope)" ></button>
                                                <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!--以下是page-navigitation-->
                                    <div class="datagrid-pager pagination" v-if="ComponentList.length>0">
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select class="pagination-page-list" v-model="pageOrder.pagePerNum">
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
                                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePageOrder(0)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePageOrder(-1)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                                    </td>
                                                    <td>
                                                        <input class="pagination-num" type="text" v-model="pageOrder.currentPage">
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageOrder.total/pageOrder.pagePerNum)}}页</span>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePageOrder(1)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePageOrder(2)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="findComponentList()" class="btn-refresh btn-TAB"></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="pagination-info pagination-title" v-text="'显示1到'+pageOrder.pagePerNum+',共'+pageOrder.total+'记录'"></div>
                                        <div style="clear:both;"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 物资采购 检查验收 验收 -->
                            <div v-if="isShowReceipt">
                                <p class="header clearfix"  style="margin-top:30px;">
                                    <span class="left_header">
                                        <i class="detial icon"></i>签收清单【{{CheckReceiptObj.orderTitle}}】({{CheckReceiptObj.orderCode}})明细
                                    </span>
                                    <a :class="['right_header','right-expend',OrderListExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeOrderListExpend()" v-text="OrderListExpend.title"></a>
                                </p>
                                <div v-show="OrderListExpend.isExpend">
                                    <div style="overflow: auto;">
                                        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                            <span class="title-list" v-if="showEditAllReceipt" @click="editAllReceipt">
                                                <label class="item-btn-icon title-border">批量签收</label>
                                            </span>
                                            <span  class="title-list" v-text="'总价：'+dingHuoAmount">   
                                            </span>
                                            <span class="item-btn clearfix"> 
                                                <label class="item-btn-icon icon-0" @click="editAllReceiptCancel">全部撤销</label>
                                                <label class="item-btn-icon icon-1" @click="EditAllReceipt">全部签收</label>
                                                <label class="item-btn-icon icon-2" @click="showDingHuoLabel()">全部标签</label>
                                                <label class="item-btn-icon icon-3" @click="showReceiptLabelHeader()">显示列</label>
                                            </span>
                                        </p>
                                        <el-table  :data="ComponentList"  border style="width: 100%" class="detialInfoTable" @selection-change="handleSelectionChange">
                                            <el-table-column :prop="indexList.prop" :label="indexList.name"
                                                v-if="indexList.show"
                                                align="center"
                                                fixed="left"
                                                width="50"
                                                :formatter="testIfIsNull">  
                                            </el-table-column>
                                            <el-table-column
                                                type="selection"
                                                width="50"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(item,index) in receiptHead" :key="index"
                                                :prop="item.prop"
                                                :label="item.name"
                                                v-if="item.show"
                                                align="center"
                                                :formatter="handleData"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                prop="operate"
                                                label="操作"
                                                v-if="showOperate"
                                                fixed="right"
                                                align="center"
                                                :formatter="testIfIsNull"
                                                >
                                                <template slot-scope="scope">
                                                
                                                <button class="editBtn actionBtn" title="签收"  @click.stop="editReceipt(scope)" v-if="showType == 'separate' && scope.row.receiptStatus == 0"></button>
                                                <button class="backBtn actionBtn" title="撤销"  @click.stop="editReceiptCancel(scope)" v-if="showType == 'separate' && scope.row.receiptStatus == 1"></button>
                                                <button class="labelBtn actionBtn" title="标签"  @click.stop="openDingHuoLabel(scope)" ></button>
                                                <button class="locationBtn actionBtn" title="定位"  @click.stop="openLocation(scope)" ></button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <!--以下是page-navigitation-->
                                    <div class="datagrid-pager pagination" v-if="ComponentList.length>0">
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select class="pagination-page-list" v-model="pageOrder.pagePerNum">
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
                                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePageOrder(0)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePageOrder(-1)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                                    </td>
                                                    <td>
                                                        <input class="pagination-num" type="text" v-model="pageOrder.currentPage">
                                                    </td>
                                                    <td>
                                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageOrder.total/pageOrder.pagePerNum)}}页</span>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePageOrder(1)"></a>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePageOrder(2)"></a>
                                                    </td>
                                                    <td>
                                                        <div class="pagination-btn-separator"></div>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="findComponentList()" class="btn-refresh btn-TAB"></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="pagination-info pagination-title" v-text="'显示1到'+pageOrder.pagePerNum+',共'+pageOrder.total+'记录'"></div>
                                        <div style="clear:both;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="showUploadPhoto">
                            <p class="CheckPhoto_header">
                                <span class="title">构件现场检查照片</span>
                                <span class="back" @click="backDetail">返回</span>
                            </p>
                            <div class="CheckPhoto_body">
                                <p>
                                    <span @click="addPhoto()">添加照片</span>
                                </p>
                                <ul>
                                    <li v-for="(item,index) of checkImgList" :key="index">
                                        <a>
                                            <img class="picimg" :src="'http://10.252.26.240:8080/qjbim-file'+item[2]" alt="">
                                        </a>
                                        <div class="png_bk" style="left: 1px; bottom: 0px;">
                                            <a target="_blank" :href="'http://10.252.26.240:8080/qjbim-project/project/asset/preViewPhoto?path='+item[2]"><img style="width:16px;height:18px" src="http://10.252.26.240:8080/qjbim-project/common/css/default/images/png_bk02.png" alt=""></a>
                                            <a :href="'http://10.252.26.240:8080/qjbim-project/project/asset/downloadFile?fileId=16162&filePath='+item[2]"><img style="width:16px;height:18px" src="http://10.252.26.240:8080/qjbim-project/common/css/default/images/png_bk04.png" alt=""></a>
                                            <a @click.stop="deleteCheckPhoto(item[0])"><img style="width:16px;height:18px" src="http://10.252.26.240:8080/qjbim-project/common/css/default/images/png_bk03.png" alt=""></a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']" >
            <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">属<br>性</span>
                    </div>
                </div>
            <div v-show="screenLeft.show" v-if="screenLeft.item == 1" class="screenRight_1">
                <div>
                        <h3 class="header-attribute" style="margin-top: 0px;">
                            <i class="trrangle"></i>
                            基本属性
                            <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                        </h3>
                        <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                            <!-- <li class="detial-item clearfix">
                                <span class="detial-text-name">清单及序号</span>
                                <span class="detial-text-value" v-text="checkedItem.manifestId+'-'+checkedItem.detailId" :title="checkedItem.manifestId+'-'+checkedItem.detailId"></span>
                            </li> -->
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">可追溯ID</span>
                                <span class="detial-text-value" v-text="checkedItem.traceId" :title="checkedItem.traceId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName" :title="checkedItem.originalName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">所在空间</span>
                                <span class="detial-text-value" v-text="checkedItem.space" :title="checkedItem.space"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">单位</span>
                                <span class="detial-text-value" v-text="checkedItem.unit" :title="checkedItem.unit"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">数量</span>
                                <span class="detial-text-value" v-text="checkedItem.count" :title="checkedItem.count"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">修改用户</span>
                                <span class="detial-text-value" v-text="checkedItem.detailUpdateUser" :title="checkedItem.detailUpdateUser"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">修改时间</span>
                                <span class="detial-text-value" v-text="initData(checkedItem.detailUpdateTime)" :title="initData(checkedItem.detailUpdateTime)"></span>
                            </li>
                            <!-- <li class="detial-item clearfix">
                                <span class="detial-text-name">业务状态</span>
                                <span class="detial-text-value" v-text="parseMStatus(checkedItem.status) + '(' + checkedItem.status + ')'" :title="parseMStatus(checkedItem.status) + '(' + checkedItem.status + ')'"></span>
                            </li> -->
                        </ul>
                        <h3 class="header-attribute" style="margin-top: 33px;">
                            <i class="trrangle"></i>
                            通用设计信息
                            <i :class="[{'active':show.generalDesignInfo},'icon-dropDown']" @click="show.generalDesignInfo = show.generalDesignInfo?false:true;"></i>
                        </h3>
                        <ul id="genealAtt" :class="[{'show':show.generalDesignInfo},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">GUID</span>
                                <span class="detial-text-value" v-text="checkedItem.guid" :title="checkedItem.guid"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始文件</span>
                                <span class="detial-text-value" v-text="checkedItem.originalFile" :title="checkedItem.originalFile"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始分类</span>
                                <span class="detial-text-value" v-text="checkedItem.originalCategory" :title="checkedItem.originalCategory"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始ID</span>
                                <span class="detial-text-value" v-text="checkedItem.originalId" :title="checkedItem.originalId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName" :title="checkedItem.originalName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">创建工具</span>
                                <span class="detial-text-value" v-text="checkedItem.creator" :title="checkedItem.creator"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">设计分类</span>
                                <span class="detial-text-value" v-text="checkedItem.classifyName" :title="checkedItem.classifyName"></span>
                            </li>


                            <li class="detial-item clearfix">
                                <span class="detial-text-name">注释</span>
                                <span class="detial-text-value" v-text="checkedItem.comment" :title="checkedItem.comment"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">标记</span>
                                <span class="detial-text-value" v-text="checkedItem.tag" :title="checkedItem.tag"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新用户</span>
                                <span class="detial-text-value" v-text="checkedItem.editor" :title="checkedItem.editor"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新时间</span>
                                <span class="detial-text-value" v-text="initData(checkedItem.entityUpdateTime)" :title="initData(checkedItem.entityUpdateTime)"></span>
                            </li>
                        </ul>
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
                        <li v-for="(item,index) in S_Label_quantitiesList" :key="index" class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'manifest/qr/QR-MX-' + addZero(item.id, 7)" alt="">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">可追踪ID：</span>
                                    <span class="text-right" v-text="testIfIsNull(null,null,item.traceId)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件名称：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.name)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在单体：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.dBuild)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在分区：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.dDistrict)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在楼层：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.dStorey)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件分类：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.classifyName)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件注释：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentComments)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件标记：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentTag)"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <el-pagination background v-if="!singleLable" layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                     @current-change="findManifestDetailList(1)" 
                     @prev-click="findManifestDetailList(1)"
                     @next-click="findManifestDetailList(1)"
                    :total="pageLabelList.total">
                    </el-pagination>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                    <button class="editBtnC" @click="printLabelList">打印当前页标签</button>
                </div>
            </div>
        </div>
        <div v-if="ListHeaderShow"  id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">显示列</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="headerListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in detailsHead_model" :key="index" v-if="index >=2">
                          <label  :class="[item.showModel?'active':'','checkbox-fileItem']" :for="item.prop+'_header'" v-text="item.name"></label>
                          <input  type="checkbox" :id="item.prop+'_header'" class="checkbox-arr" v-model="item.showModel">
                    </span>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="headerListConfirm">确定</button>
                    <button class="editBtnC" @click="headerListCancle">取消</button>
                </div>
            </div>
        </div>
        <div v-if="labelDingHuoListShow"  id="edit" class="dialog">
            <div class="el-dialog__header">
                    <span class="el-dialog__title">标签信息预览</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelDingHuoListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                 <div class="editBody">
                    <ul>
                        <li v-for="(item,index) in label_ComponentList" :key="index" class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-MX-' + addZero(item.pkId, 7)" alt="">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">可追踪ID：</span>
                                    <span class="text-right" v-text="testIfIsNull(null,null,item.traceId)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件名称：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.dName)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在单体：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.fieldDataJson[1].f1)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在分区：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.fieldDataJson[2].f2)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在楼层：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.fieldDataJson[3].f3)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件分类：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.fieldDataJson[4].f4)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件注释：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentComments)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件标记：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentTag)"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <el-pagination background v-if="!singleDingHuoLable" layout="prev, pager, next" :current-page.sync="pageLabelDingHuoList.currentPage"
                     @current-change="findComponentList(1)" 
                     @prev-click="findComponentList(1)"
                     @next-click="findComponentList(1)" 
                    :total="pageLabelDingHuoList.total">
                    </el-pagination>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                    <button class="editBtnC" @click="printLabelList">打印当前页标签</button>
                </div>
            </div>
        </div>
        <div v-if="orderListHeaderShow"  id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">显示列</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="headerOrderListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in orderDetailsHead_model" :key="index" v-if="index >=2">
                          <label  :class="[item.showModel?'active':'','checkbox-fileItem']" :for="item.prop+'_header'" v-text="item.name"></label>
                          <input  type="checkbox" :id="item.prop+'_header'" class="checkbox-arr" v-model="item.showModel">
                    </span>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="headerOrderListConfirm">确定</button>
                    <button class="editBtnC" @click="headerOrderListCancle">取消</button>
                </div>
            </div>
        </div>

        
        <div id="cpm">
            <el-dialog title="检查结果" :visible.sync="dialogFormVisible">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <el-form :model="form">
                            <el-radio v-model="checkResult" class="separation" label="2">检查合格</el-radio>
                            <el-radio v-model="checkResult" label="1">检查不合格</el-radio>
                        </el-form>
                    </div>
                </div> 
                <div slot="footer" class="dialog-footer">
                    <el-button class="editBtnC separation" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button class="editBtnS" @click="checkConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="检查结果" :visible.sync="allEditCheck">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <el-form :model="form1">
                            <el-radio v-model="allCheckResult" label="2" class="separation">检查合格</el-radio>
                            <el-radio v-model="allCheckResult" label="1">检查不合格</el-radio>
                        </el-form>
                    </div>
                </div> 
                <div slot="footer" class="dialog-footer">
                    <el-button class="editBtnC separation" @click="allEditCheck = false" >取 消</el-button>
                    <el-button class="editBtnS" @click="allCheckConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="图片上传" :visible.sync="upImg" @close="upImgCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody"><label class=" imageBodyText">上传图片 :</label>
                        <span class="updataImageSpan">
                            <button @click="selectImg" class="upImgBtn">选择图片</button>
                            <input class="upInput"  type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                </div>
                <!-- <p class="err" v-show="showErr">请输入完整信息</p> -->
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="upImgSure">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
            </el-dialog>
        </div>
        

        <div id="mask" v-if="labelListShow || ListHeaderShow || labelDingHuoListShow || orderListHeaderShow " ></div>
</div>       
</template>
<style  lang='less'>
    .navigation{
        z-index: 0!important;
    }
    .el-table .cell{
        line-height: 14px;
    }
    #CommenList{
        #print-qrcode{
            display: none;
        }
        .dialog{
            top: 10vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            .el-dialog__body{
                margin-top: 20px;
                overflow: scroll;
                height: 50vh;
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
                    width: 400px;
                    margin-top: 20px;
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
                            line-height: 12px;
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
        .table-resizable {
        position: relative;
        }

        .table-resizing {
        cursor: col-resize !important;
        user-select: none;
        }
        table {
        margin: 0 !important;
        table-layout: fixed;
        }

        table td {
        word-break: break-all;
        }

        table th {
        position: relative;
        user-select: none;
        }

        .resizable-hold {
        position: absolute;
        left: 200px;
        top: 0;
        bottom: 0;
        width: 0;
        border-left: 1px solid rgb(223, 230, 236);
        z-index: 10;
        display: none;
        }

        /*
            修改eleUI树形组件
        */
        .is-leaf:before{
            content: ""!important;
            color: #999999;
            font-weight: bold;
        }
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
        .show{
            display: block!important;
        }
        .upInput{
            display: none;
        }
        #edit{ 
            .el-dialog{
                margin: 0 auto;
            }
        }
        .box-left-container{
            // display: block;
            // position: fixed;
            // top: 165px;
            // left: 26px;
            // bottom: 0;
            // right: 225px;
            // z-index: 1001;
            // transition:  all ease .5s;
            // overflow: auto;
            display: inline-block;
            width: 85%;
            position: relative;
            transition:  all ease .5s;
            
            #containerMessage{
                padding-left:30px; 
                padding-bottom: 65px;
                margin-right: 25px;
                .table-list{
                    float: left;
                    width: 87%;
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    background: red;
                    thead{
                        background: #f2f2f2;
                        .userList-thead{
                            height: 55px;
                            text-align: center;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            font-weight: normal;
                        }
                    }
                }
                .left-item-box{
                    // min-width: 770px;
                    padding: 18px;
                    padding-right:0; 
                    margin-right:200px; 
                    text-align: left;
                    .item{
                        display: inline-block;
                        width: 32%;
                        margin-bottom: 20px;
                        .left{
                            float: left;
                            text-align: left;
                            font-size: 14px;
                            line-height: 14px;
                            color: #999999;
                            font-weight: normal;
                            margin-right: 11px;
                        }
                        .right{
                            float: left;
                            text-align: left;
                            font-size: 14px;
                            line-height: 14px;
                            color: #333333;
                            font-weight: normal;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .right-QRcode{
                    display: block;
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    width: 120px;
                    height: 120px;
                    padding: 5px;
                    border: 1px solid #e0e0e0;
                    background: #ffffff;
                    img{
                        width: 109px;
                        height: 109px;;
                    }
                }
                 .actionBtn{
                    width: 16px;
                    height: 17px;
                    border: none;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .locationBtn{
                    background: url('./images/location.png') no-repeat;
                }
                .detialBtn{
                    background: url('./images/detial_.png') no-repeat;
                }
                .labelBtn{
                    background: url('./images/label.png') no-repeat;
                }
                .editBtn{
                    background: url('./../../assets/edit.png') no-repeat;
                }
                .backBtn{
                     background: url('./images/back.png') no-repeat 0 0;
                }
                .qindanProject{
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
                    .UserList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
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
                                height: 55px;
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
                                .actionBtn{
                                    width: 16px;
                                    height: 16px;
                                    border: none;
                                    cursor: pointer;
                                    margin-right: 16px;
                                }
                                .editBtn{
                                    background: url('../../assets/edit.png') no-repeat;
                                }
                                .deleteBtn{
                                    background: url('../../assets/delete.png') no-repeat;
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
                    .header{
                        text-align: left;
                        margin: 15px 0;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 10px;
                        .left_header{
                            float: left;
                            font-size: 16px;
                            line-height: 16px;
                            color: #fc3439;
                            font-weight: bold;
                            padding-left:30px;
                            position: relative;
                            .list_{
                                background: url('./images/list_.png')no-repeat 0 0;
                            } 
                            .detial{
                                background: url('./images/detial.png')no-repeat 0 0;
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
                        .right_header{
                            text-decoration: none;
                            float: right;
                            font-size: 14px;
                            color: #336699;
                            line-height: 14px;
                            margin-top:4px; 
                        }
                        .right-expend{
                            position: relative;
                            transition: all ease .5s;
                            &::after{
                                display: block;
                                position: absolute;
                                top: 1px;
                                left: -20px;
                                width: 12px;
                                height: 12px;
                                background: url('./images/expand.png') no-repeat 0 0;
                                content: '';
                            }
                        }
                        .right-pack-up{
                            transition: all ease .5s;
                            &::after{
                              transform: rotateZ(180deg);
                            }
                        }
                    }
                    .title-list{
                        font-size: 14px;
                        line-height: 24px;
                        color: #999999;
                    }
                    .title-border {
                        float:left;
                        width:auto;
                        height:26px;
                        padding:0 9px;
                        margin-right:30px;
                        border: 1px solid #fc3439;
                        text-align:center;
                        line-height:24px;
                        font-size:14px;
                        color:#fc3439;
                        cursor: pointer;
                        box-sizing: border-box;
                    }
                    .item-btn{
                        float: right;
                        label,.label-item{
                            float:left;
                            width:auto;
                            height:26px;
                            padding: 0 9px;
                            padding-left:27px; 
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
                        .item-btn-icon{
                            position: relative;
                            &::after{
                                display: block;
                                position: absolute;
                                top: 7px;
                                left: 11px;
                                width: 12px;
                                height: 12px;
                                background-size:100%; 
                                content: '';
                            }
                        } 
                        .icon-0{
                             &::after{
                                background-image: url('./images/1-0.png');
                             }
                        }
                         .icon-1{
                             &::after{
                                background-image: url('./images/1-1.png');
                             }
                        }
                         .icon-2{
                             &::after{
                                background-image: url('./images/1-2.png');
                             }
                        }
                         .icon-3{
                             &::after{
                                background-image: url('./images/1-3.png');
                             }
                        }
                    }
                    .detialInfoTable{
                        border-color: #e0e0e0;  
                        thead{
                            tr{
                                th{
                                    height: 36px;
                                    padding-left: 10px;
                                    background: #f2f2f2;
                                    font-size: 14px;
                                    color: #666666;
                                    text-align: left;
                                    font-weight: normal;
                                    border-color: #e0e0e0; 
                                }
                            }
                        }
                         tbody{
                            tr{
                                td{
                                    height: 36px;
                                    padding-left: 10px;
                                    background: #ffffff;
                                    font-size: 14px;
                                    color: #333333;
                                    text-align: left;
                                    font-weight: normal;
                                    border-color: #e0e0e0; 
                                    
                                }
                                &:nth-of-type(2n){
                                     td{
                                        background: #fafafa;
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
                    .CheckPhoto_header {
                        display: block;
                        line-height: 50px;
                        height: 50px;
                        font-size: 18px;
                        font-weight: bold;
                        border: 1px solid #cacaca;
                        text-align: center;
                        background: #f5f3f4;
                        color:#fc3439;
                        .back {
                            width: 60px;
                            margin-top: 7px;
                            float: right;
                            margin-right: 20px;
                            line-height: 30px;
                            border: 1px solid #fc3439;
                            border-radius: 3px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        }
                    }
                    .CheckPhoto_body {
                        p {
                            display: block;
                            line-height: 50px;
                            height: 50px;
                            span {
                                width: 83px;
                                line-height: 30px;
                                height: 32px;
                                float: left;
                                margin-left: 20px;
                                background: #fc3439;
                                text-align: center;
                                cursor: pointer;
                                color: #fff;
                                font-weight: bold;
                                margin: 10px;
                                border-radius: 3px;
                            }
                        }  
                        ul li {
                                float: left;
                                position: relative;
                                height: 132px;
                                // overflow: hidden;
                                margin: 16px 10px 0 0;
                                display: list-item;
                                a {
                                    cursor: pointer;
                                    text-decoration: none;
                                    img {
                                        height: 130px;
                                        border: 1px solid #cacaca;
                                    }
                                }
                                .png_bk {
                                    position: absolute;
                                    width: 100%;
                                    display: block;
                                    height: 30px;
                                    // background: url(images/workPic-bg.png);
                                    line-height: 30px;
                                    left: 1px;
                                    bottom: 0;
                                    // text-align: center;
                                    background:rgba(36, 31, 31, 0.5);
                                    a {
                                        color: #fff;
                                        height: 30px;
                                        display: inline-block;
                                        line-height: 30px;
                                        width: 32%;
                                        
                                    }
                                }
                                // .png_bk:hover{
                                //     bottom: 0px;
                                //     transition: 0.5s all ease;
                                // }
                        }
                    }
                }
            }
        }
        .box-left-avtive,.box-left-avtive_pre{
            width: 98%;
            transition:  all ease .5s;
            #center-selection{
                right: 0;
                transition: all ease .5s;
            }
            .icon-right{
                transform: rotateZ(180deg)!important;
                transition: all ease .5s;
            }
        }
        .el-main{
            padding: 0;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
        }
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
        /*
        右侧
        */
        .box-right-container{
            // display: block;
            // position: fixed;
            // overflow-y: auto;
            // right: -225px;
            // bottom: 0;
            // width: 225px;
            // top: 116px;
            // transition: all ease .5s;
            // background: #ffffff;
            // z-index: 10;
            // border-left:none;
            // z-index: 1000;
            // display: inline-block;
            position: relative;
            float: right;
            width: 15%;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            height: 785px;
            overflow-y: auto;
            overflow-x: hidden;
            #center-selection{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25px;
                border-right: 1px solid #cccccc;
                .SH_right{
                    width: 100%;
                    height: 48px;
                    border-left: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    .icon-right{
                        display: block;
                        position: absolute;
                        top: 19px;
                        left: 6px;
                        width: 14px;
                        height: 14px;
                        background: url('../ManageCost/images/right.png')no-repeat 0 0;
                        transition: all ease .5s;
                        transform: rotateZ(0deg);
                    }
                }
                .item-property{//目录
                    display: block;
                    width: 25px;
                    height: 60px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -7px;
                        width: 24px;
                        height: 16px;
                        background: #fff;
                        border-bottom: 1px solid #cccccc;
                        -webkit-transform: skewY(30deg);
                        transform: skewY(30deg);
                        content: '';
                    }
                }   
                .item-version{//属性
                    display: block;
                    width: 25px;
                    height: 55px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .item-version-3{//版本
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:24px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .active-version{//中间 属性 高显
                    .item-version{//属性
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after{
                            background: #fff;
                        }
                    }
                    .item-property::after{//目录
                        background: #fff;
                    }
                    .item-version-3{//版本
                        z-index: 10;
                    }
                }
                .active{//上边 目录 高显
                    .item-property{
                        background: #fff;
                        color: #fc3439;
                    }
                    .item-version{
                        z-index: 15;
                    }
                    .item-version-3{
                        z-index: 10;
                    }
                }
            }
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 35px;
                .noTop{
                    top: 12px!important;
                }
                >p{
                    padding-bottom:5px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom:10px;  
                }
                .icon-goujian{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                .icon-search{
                    background: url('../ManageCost/images/search.png')no-repeat 0 0;
                    margin-left: 10px;
                    &:hover{
                        background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                    }
                }
                 .header-attribute{
                    font-size: 14px;
                    color: #333333;
                    line-height: 14px;
                    padding-bottom:4px;
                    border-bottom: 1px solid #e6e6e6;
                    text-align: left; 
                    .trrangle{
                        display: inline-block;
                        width: 0px;
                        height: 0px;
                        border-left: 10px solid #fc3439;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                    }
                    .icon-dropDown{
                        display: block;
                        width: 12px;
                        height: 12px;
                        background:url('../ManageCost/images/arror.png')no-repeat 0 0; 
                        float: right;
                        cursor: pointer;
                        transition:  all ease .2s;
                        transform: rotate(180deg);
                    }
                    .active{
                        transform: rotate(0deg);
                    }
                }
                .header-attribute:last-of-type{
                    margin-top: 30px;
                }
                 .Att{
                    >li:last-of-type{
                        padding-bottom: 7px;
                    }
                    .detial-item{
                        font-size: 12px;
                        line-height: 12px;
                        margin-top: 16px;
                        text-align: left;
                    }
                     .detial-text-name{
                        color: #999999;
                        width: 65px;
                        display: inline-block;
                        font-size: 12px;
                    }
                    .detial-text-value{
                        color: #333333;
                        max-width: 100px;
                        overflow: hidden;
                        font-size: 12px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                    }
                }
            }
        }
        .box-right-avtive{
            width: 2%;
            transition: all ease .5s;
        }
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
        width:10px;
        height: 10px;
        }
        /* 滚动槽 */
        ::-webkit-scrollbar-track {
        box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
        border-radius:10px;
        }
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
        }
        ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
        }
    }
    #cpm {
        .el-dialog {
            position: relative;
            margin: 0 auto 50px;
            background: #fff;
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
            box-sizing: border-box;
            width: 50%;
        }
        .el-dialog__header {
            padding: 20px 20px 10px;
        }
        .el-dialog__body {
            padding: 30px 20px;
            color: #606266;
            line-height: 24px;
            font-size: 14px;
        }
        .el-dialog__footer {
            width: 100%;
            display: inline-block;
            text-align: center!important;
            box-sizing: border-box;
            padding: 10px 20px 20px;
        }
        .editBody{
            margin: 0 auto;
        }
        .editBodytwo{
            margin-top: 20px;
        }
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
        .upImgBtn{
            width: 98px;
            height: 26px;
            border: 1px solid #ccc;
            cursor: pointer;
            background: #f9f9f9;
            font-size: 14px;
            font-weight: normal;
            color: #666;;
        }
        .upImgText{
            font-size:14px;
            line-height: 14px;
            display: inline-block;
            margin-left: 10px;
            font-weight: normal;
            color: #999;
        }
        .dialog-footer{
            text-align: center;
        }
        .editBtnS,.editBtnC{
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
        .separation {
            margin-right:30px;
        }
    }
    
    // .el-dialog__footer {
        
    // }
    // .el-dialog__footer {
        
    //     text-align: right;
    //     -webkit-box-sizing: border-box;
        
    // }
    
    // .el-dialog {
    //     width:660px;
    //     margin:0 auto;
    //     .el-dialog__header {
    //         height: 68px;
    //         padding: 0;
    //         border-bottom: 2px solid #e6e6e6;
    //         text-align: center;
    //         margin-top:50px;
    //         .el-dialog__title {
    //             color: #fc3439;
    //             font-size: 18px;
    //             line-height: 18px;
    //             font-weight: bold;
    //             font-family: 'MicrosoftYaHei';
    //             display: inline-block;
    //             margin: 34px 0 15px 30px;
    //         }
    //     }
    //     .el-dialog__body {
    //         margin-top: 20px;
    //         padding: 0;
    //         color: #606266;
    //         line-height: 24px;
    //         font-size: 14px;
    //     }
    // }
    // .editBodytwo{
    //     margin-top: 20px;
    // }
</style>
<script>
import Vue from 'vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
var app
var CurrentSelectPara
var CurrentSelectedEntList
export default Vue.component('common-list',{
    props:['mId','type','title','rType','bId','isGongChengLiang','manifestIdOne','orderListDetailId','isShowWuzi','isDinghuo','dingHuoObj','isShowFahuo','isFahuo','faHuoObj','isShowcheck','isShowreceipt','checkReceiptObj','showEditallcheck','showEditallreceipt','isShowWuliao','wuliaoObj'],
    data(){
        window.addEventListener("message", (evt)=>{this.callback(evt)});
        return {
            TraceID:'',//追溯Id 
            HolderPath:'',//容器路径
            GCCode:'',//分类编码
            screenLeft:{
                show:false,
                item:1,
            },
            token:'',
            entId:'',//公司ID
            projId:'',
            projName:'',
            userId:'',
            UPID:'',
            defaultSubProjId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            qrShareUrl:'',
            show:{
                basicAttributes:true,
                generalDesignInfo:true,
            },
            selectUgId:'',//选中的群组id
            ugList:[],//群组列表
            /*以下为后期添加数据*/
            fullscreenLoading:false,
            loading:false,
            pageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            pageOrder:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageLabelDingHuoList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            checkedItem:{},
            fullscreenloading:false,
            ManifestInfo:{},//清单基本信息
            planHead:[
                {
                    name:'序号',
                    show:true,
                    prop:'fieldDataJson[0].f0',
                },
                {
                    name:'所在单体',
                    show:true,
                    prop:'fieldDataJson[1].f1',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'fieldDataJson[2].f2',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'fieldDataJson[3].f3',
                },
                {
                    name:'产品名称',
                    show:true,
                    prop:'fieldDataJson[4].f4',
                },
                {
                    name:'类型',
                    show:true,
                    prop:'fieldDataJson[5].f5',
                },
                {
                    name:'品牌',
                    show:true,
                    prop:'fieldDataJson[6].f6',
                },
                {
                    name:'规格',
                    show:true,
                    prop:'fieldDataJson[7].f7',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'count',
                },
                {
                    name:'发货时间',
                    show:true,
                    prop:'sendDate_show',
                },
                {
                    name:'检查时间',
                    show:true,
                    prop:'checkDate_show',
                },
                {
                    name:'签收时间',
                    show:true,
                    prop:'receiptDate_show',
                },
                {
                    name:'构件状态',
                    show:true,
                    prop:'state',
                },
                {
                    name:'最后操作人',
                    show:true,
                    prop:'updateUserName',
                },
            ],
            detailsHead:[
                {
                    name:'',
                    show:true,
                    prop:'SerialNumber',
                },
                {
                    name:'序号',
                    show:true,
                    prop:'id',
                },
                {
                    name:'单体Id',
                    show:true,
                    prop:'traceId',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'dDistrict',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'dStorey',
                },
                {
                    name:'类型名称',
                    show:true,
                    prop:'classifyName',
                },
                {
                    name:'名称',
                    show:true,
                    prop:'dName',
                },
                {
                    name:'业务状态',
                    show:true,
                    prop:'dState_format',
                },
                 {
                    name:'单位',
                    show:true,
                    prop:'dUnit',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'dCount',
                },
            ],
            orderHead:[
                {
                    name:'序号',
                    show:true,
                    prop:'fieldDataJson[0].f0',
                },
                {
                    name:'所在单体',
                    show:true,
                    prop:'fieldDataJson[1].f1',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'fieldDataJson[2].f2',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'fieldDataJson[3].f3',
                },
                {
                    name:'产品名称',
                    show:true,
                    prop:'fieldDataJson[4].f4',
                },
                {
                    name:'类型',
                    show:true,
                    prop:'fieldDataJson[5].f5',
                },
                {
                    name:'品牌',
                    show:true,
                    prop:'fieldDataJson[6].f6',
                },
                {
                    name:'规格',
                    show:true,
                    prop:'fieldDataJson[7].f7',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'count',
                },
                {
                    name:'构件单价',
                    show:true,
                    prop:'price',
                },
                {
                    name:'构件总价',
                    show:true,
                    prop:'amount',
                },
                {
                    name:'经手人',
                    show:true,
                    prop:'updateUserName',
                },
            ],
            sendHead:[
                {
                    name:'序号',
                    show:true,
                    prop:'fieldDataJson[0].f0',
                },
                {
                    name:'所在单体',
                    show:true,
                    prop:'fieldDataJson[1].f1',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'fieldDataJson[2].f2',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'fieldDataJson[3].f3',
                },
                {
                    name:'产品名称',
                    show:true,
                    prop:'fieldDataJson[4].f4',
                },
                {
                    name:'类型',
                    show:true,
                    prop:'fieldDataJson[5].f5',
                },
                {
                    name:'品牌',
                    show:true,
                    prop:'fieldDataJson[6].f6',
                },
                {
                    name:'规格',
                    show:true,
                    prop:'fieldDataJson[7].f7',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'count',
                },
                {
                    name:'发货状态',
                    show:true,
                    prop:'sendStatus_show',
                },
                {
                    name:'发货记录人',
                    show:true,
                    prop:'sendRecordUserName',
                },
                {
                    name:'发货时间',
                    show:true,
                    prop:'sendDate_show',
                }
            ],
            checkHead:[
                {
                    name:'序号',
                    show:true,
                    prop:'fieldDataJson[0].f0',
                },
                {
                    name:'所在单体',
                    show:true,
                    prop:'fieldDataJson[1].f1',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'fieldDataJson[2].f2',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'fieldDataJson[3].f3',
                },
                {
                    name:'产品名称',
                    show:true,
                    prop:'fieldDataJson[4].f4',
                },
                {
                    name:'类型',
                    show:true,
                    prop:'fieldDataJson[5].f5',
                },
                {
                    name:'品牌',
                    show:true,
                    prop:'fieldDataJson[6].f6',
                },
                {
                    name:'规格',
                    show:true,
                    prop:'fieldDataJson[7].f7',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'count',
                },
                {
                    name:'检查状态',
                    show:true,
                    prop:'checkResult_show',
                },
                {
                    name:'检查人',
                    show:true,
                    prop:'checkUserName',
                },
                {
                    name:'检查时间',
                    show:true,
                    prop:'checkDate_show',
                }
            ],
            receiptHead:[
                {
                    name:'序号',
                    show:true,
                    prop:'fieldDataJson[0].f0',
                },
                {
                    name:'所在单体',
                    show:true,
                    prop:'fieldDataJson[1].f1',
                },
                {
                    name:'所在分区',
                    show:true,
                    prop:'fieldDataJson[2].f2',
                },
                {
                    name:'所在楼层',
                    show:true,
                    prop:'fieldDataJson[3].f3',
                },
                {
                    name:'产品名称',
                    show:true,
                    prop:'fieldDataJson[4].f4',
                },
                {
                    name:'类型',
                    show:true,
                    prop:'fieldDataJson[5].f5',
                },
                {
                    name:'品牌',
                    show:true,
                    prop:'fieldDataJson[6].f6',
                },
                {
                    name:'规格',
                    show:true,
                    prop:'fieldDataJson[7].f7',
                },
                {
                    name:'数量',
                    show:true,
                    prop:'count',
                },
                {
                    name:'签收人',
                    show:true,
                    prop:'receiptUserName',
                },
                {
                    name:'签收时间',
                    show:true,
                    prop:'receiptDate_show',
                },
                {
                    name:'货位',
                    show:true,
                    prop:'warehouseName',
                }
            ],
            indexList:{
                    name:'',
                    show:true,
                    prop:'SerialNumber',
                },
            detailsHead_model:[],
            orderDetailsHead_model:[],
            showOperate:true,
            S_quantitiesList:[],//明细基本信息
            S_Label_quantitiesList:[],
            copyS_Label_quantitiesList:[],
            showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            labelListShow:false,//
            labelDingHuoListShow:false,//
            ListHeaderShow:false,//
            orderListHeaderShow:false,//
            topExpend:{
                title:'收起',
                isExpend:true
            },
            bottomExpend:{
                title:'收起',
                isExpend:true
            },
            OrderListExpend:{
                title:'收起',
                isExpend:true
            },
            singleLable:false,//单个标签展示 不需要分页器
            singleDingHuoLable:false,//单个标签展示 不需要分页器
            manifestId:Number,//mid
            detailNum:'',
            orderDetailNum:'',
            jishuCount:0,
            oId:Number,
            ComponentList:[],
            label_ComponentList:[],
            copy_label_ComponentList:[],
            isShowWuZi:false,
            isShowWuLiao:false,
            isShowFaHuo:false,
            isDingHuo:true,
            isFaHuo:true,
            isShowCheck:false,
            isShowReceipt:false,
            dinghuoObj:{},
            wuLiaoObj:{},
            fahuoObj:{},
            CheckReceiptObj:{},
            editCountObj:{},
            editAllCountObj:{},
            dingHuoAmount:'',
            multipleSelection: [],
            selectionMode: Number,
            editAllSendObj:{},
            gouJianId:'',
            dialogFormVisible:false,
            allEditCheck:false,
            form:{},
            form1:{},
            checkResult:'2',
            allCheckResult:'2',
            checkAllIds:'',
            receiptAllIds:'',
            showEditAllCheck:false,
            showEditAllReceipt:false,
            showUploadPhoto:false,
            checkImgList:[],
            qocId:'',
            upImg:false,
            imageName:'未选择任何图片',
            filesList:[],
            returnLabelUrl:"",
        }
    },
    created(){
            var vm = this
            vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
            vm.token = localStorage.getItem('token')
            vm.projId = localStorage.getItem('projId')
            vm.userId = localStorage.getItem('userid')
            vm.entId = localStorage.getItem('entId')
            vm.userImg = localStorage.getItem('userImg')
            // vm.WebGlSaveId = localStorage.getItem('WebGlSaveId')
            // vm.WebGlSaveType = localStorage.getItem('WebGlSaveType')
            // vm.WebGlSaveName = localStorage.getItem('WebGlSaveName')
            vm.BDMSUrl = vm.$store.state.BDMSUrl
            vm.WebGlUrl=vm.$store.state.WebGlUrl
            vm.BIMServerPort=vm.$store.state.BIMServerPort;
            vm.qrShareUrl=vm.$store.state.qrShareUrl;
            vm.projName = localStorage.getItem('projName')
            vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
            vm.UPID = vm.$store.state.UPID
            vm.manifestId = vm.mId
            vm.oId = vm.mId
            vm.isShowWuZi = vm.isShowWuzi;
            vm.isShowWuLiao = vm.isShowWuliao;
            vm.isDingHuo = vm.isDinghuo;
            vm.dinghuoObj = vm.dingHuoObj;
            vm.wuLiaoObj = vm.wuliaoObj;
            vm.isShowFaHuo = vm.isShowFahuo;
            vm.isFaHuo = vm.isFahuo;
            vm.fahuoObj = vm.faHuoObj;
            vm.isShowCheck = vm.isShowcheck;
            vm.isShowReceipt = vm.isShowreceipt;
            vm.CheckReceiptObj = vm.checkReceiptObj;
            vm.showEditAllCheck = vm.showEditallcheck;
            vm.showEditAllReceipt = vm.showEditallreceipt;
            console.log(vm.CheckReceiptObj);
            // vm.getIntoLists();
            vm.getManifestInfoByMId();
    }, 
    mounted(){
        var vm = this
        //   const table1 = new tableResizable('test');
    },
    watch:{
        'show.basicAttributes':function(val){
            if(val){
                $("#basicAtt").show(200);
            }else{
                $("#basicAtt").hide(200);
            }
        },
        'show.generalDesignInfo':function(val){
            if(val){
                $("#genealAtt").show(200);
            }else{
                $("#genealAtt").hide(200);
            }
        },
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.findManifestDetailList()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.findManifestDetailList()
        },
        // 'pageOrder.currentPage':function(val,oldval){
        //     var vm = this
        //     vm.findComponentList()
        // },
        // 'pageOrder.pagePerNum':function(val,oldval){
        //     var vm = this
        //     vm.findComponentList()
        // },
    },
    methods:{
        callback(e){
            switch(e.data.command){
                case "EngineReady":
                    {
                        // let Horder = {"ID":this.WebGlSaveId,"Type":this.WebGlSaveType,"Name":this.WebGlSaveName,"ParentID":""};
                        // let para = {User:"",TokenID:"",Setting:{BIMServerIP:this.WebGlUrl,BIMServerPort:this.BIMServerPort,MidURL:"qjbim-mongo-instance",RootHolder:Horder}}
                        // app.postMessage({command:"EnterProject",parameter:para},"*");
                    }
                    break;
                case "CurrentSelectedEnt":
                    CurrentSelectPara = e.data.parameter[0];
                    CurrentSelectedEntList=e.data.parameter;
                case "ViewpointSubmited":

                    break;
            }
        },
        
        //需要编辑的构件
        handleSelectionChange(val){
            this.multipleSelection = val;
            console.log("编辑n个",this.multipleSelection);
        },
        //编辑n个
        selectionChange(selection, row){
            console.log("编辑n个",selection, row)
        },
        //获取清单总价
        getDingHuoAmount(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderDetailTotalPrice',
                headers:{
                    token:this.token
                },
                params:{
                    orderDetailId:this.oId,
                }
            }).then( res =>{
                if( res.data.cd== 0 ){
                    this.dingHuoAmount = res.data.rt;
                }else{
                    this.$message({
                        type: 'warring',
                        message: res.data.msg,
                    });
                }
            });
        },
        //批量编辑数量
        allEditCount(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type:'warring',
                    message:'请至少选择一条明细！',
                })
                return;
            }else{
                let arr = [];
                this.editAllCountObj = {};
                this.multipleSelection.map( (item,index)=>{
                    arr.push(item.id);
                });
                Object.assign(this.editAllCountObj,{
                    ids:arr.join(','),
                    componentCount:1,
                    componentPrice:'',
                    selectionMode:this.selectionMode,
                });
                this.allEditCount1();   
            }
        },
        allEditCount1(){
            this.$prompt('请输入修改数量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[0-9]*$/,
            inputErrorMessage: '数量格式不正确'
            }).then(({ value }) => {
                this.editAllCountObj.componentCount = value;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/batchEditorComponents',
                    headers:{
                        token:this.token
                    },
                    params:{
                        ids:this.editAllCountObj.ids,
                        componentCount:this.editAllCountObj.componentCount,
                        componentPrice:this.editAllCountObj.componentPrice,
                        selectionMode:this.editAllCountObj.selectionMode,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        console.log("编辑数量结果",res);
                        this.$message({
                            type: 'success',
                            message: '编辑成功！ ',
                        });
                        this.getManifestInfoByMId();
                        this.getDingHuoAmount();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });  
        },
        //编辑数量
        editCount(scope){
            this.editCountObj = {};
            Object.assign(this.editCountObj,{
                id:scope.row.id,
                amount:scope.row.amount,
                count:scope.row.count,
                price:scope.row.price,
                orderId:this.dinghuoObj.orderId,
            });
            this.editCount1();
        },
        editCount1(){
            this.$prompt('请输入修改数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '数量格式不正确'
            }).then(({ value }) => {
                this.editCountObj.count = value;
                this.editCountObj.amount = (this.editCountObj.price) * value;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/updateComponentItem',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.editCountObj.id,
                        amount:this.editCountObj.amount,
                        count:this.editCountObj.count,
                        price:this.editCountObj.price,
                        orderId:this.editCountObj.orderId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        console.log("编辑数量结果",res);
                        this.$message({
                            type: 'success',
                            message: '编辑成功！ ',
                        });
                        this.getManifestInfoByMId();
                        this.getDingHuoAmount();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });   
        },
        //全部发货
        allSend(){
            const h = this.$createElement;
            this.$msgbox({
            title: "清单下所有构件单发货确认",
            message: 
            h('div',null,[
                h('p',{style:'color: #fc3439'},"确认发货以下清单内所有构件："),
                h('p',null,'清单名称：'+this.ManifestInfo.mName),
            ]
            ),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                setTimeout(() => {
                    done();
                    setTimeout(() => {
                    instance.confirmButtonLoading = false;
                    }, 300);
                }, 1000);
                } else {
                    done();
                }
            }
            }).then( action => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/delivery/deliveryAllComponentByOrderDetail',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.fahuoObj.checkItem.id,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: '全部发货成功！ ',
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();  
            });   
        },
        //批量发货
        allEditSend(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type:'warring',
                    message:'请至少选择一条明细！',
                })
                return;
            }else{
                this.$confirm('您确认要将选中的全部发货吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = [];
                    this.multipleSelection.map( (item,index)=>{
                        arr.push(item.id);
                    });
                    let ids = arr.join(',');
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'project2/delivery/batchDeliveryOrderComponent',
                        headers:{
                            token:this.token
                        },
                        params:{
                            ids:ids,
                            projId:this.projId,
                        }
                    }).then( res =>{
                        if( res.data.cd== 0 ){
                            console.log("批量发货",res);
                            this.$message({
                                type: 'success',
                                message: '发货成功！ ',
                            });
                            this.getManifestInfoByMId();
                        }else{
                            this.$message({
                                type: 'warring',
                                message: res.data.msg,
                            });
                        }
                    }).catch();   
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发货'
                    });          
                });  
            }
        },
        //构件单发货
        editSend(scope){
             this.gouJianId = scope.row.id;
             this.editSend1();
        },
        editSend1(){
            this.$confirm('您确认该清单构件发货吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                method:'post',
                    url:this.BDMSUrl+'project2/delivery/deliveryOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        console.log("构件发货结果",res);
                        this.$message({
                            type: 'success',
                            message: '构件发货成功！ ',
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消发货'
                });          
            });  
        },
        //批量编辑检查
        editAllCheck(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type:'warring',
                    message:'请至少选择一条明细！',
                })
                return;
            }else{
                this.allEditCheck = true;
                let arr = [];
                this.multipleSelection.map( (item,index)=>{
                    arr.push(item.id);
                });
                let ids = arr.join(',');
                this.checkAllIds = ids;
            }
        },
        allCheckConfirm(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/checkResult/batchCheckOrderComponent',
                headers:{
                    token:this.token
                },
                params:{
                    ids:this.checkAllIds,
                    projId:this.projId,
                    checkResult:this.allCheckResult,
                }
            }).then( res =>{
                if( res.data.cd== 0 ){
                    this.$message({
                        type: 'success',
                        message: "批量检查成功!",
                    });
                    this.allEditCheck = false;
                    this.getManifestInfoByMId();
                    this.refreshData(this.CheckReceiptObj.orderId);
                }else{
                    this.$message({
                        type: 'warring',
                        message: res.data.msg,
                    });
                }
            }).catch();   
           
        },
        //编辑检查
        editCheck(score){
            this.gouJianId = score.row.id;
            this.dialogFormVisible = true;
        },
        //检查确认
        checkConfirm(){
            axios({
                method:'post',
                    url:this.BDMSUrl+'project2/checkResult/checkOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                        checkResult:this.checkResult,
                    }
            }).then( res =>{
                if( res.data.cd== 0 ){
                    this.$message({
                        type: 'success',
                        message: "检查确认成功！",
                    });
                    this.dialogFormVisible = false;
                    this.getManifestInfoByMId();
                    this.refreshData(this.CheckReceiptObj.orderId);
                }else{
                    this.$message({
                        type: 'warring',
                        message: res.data.msg,
                    });
                }
            }).catch();
            
        },
        //编辑检查撤销
        editCancel(score){
            this.gouJianId = score.row.id;
            this.editCancel1();
        },
        editCancel1(){
            this.$confirm('你确定要撤销清单构件检查?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/checkResult/cancelCheckOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                        });
                        this.getManifestInfoByMId();
                        this.refreshData(this.CheckReceiptObj.orderId);
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });  
        },
        //批量编辑签收
        editAllReceipt(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    type:'warring',
                    message:'请至少选择一条明细！',
                })
                return;
            }else{
                let arr = [];
                this.multipleSelection.map( (item,index)=>{
                    arr.push(item.id);
                });
                let ids = arr.join(',');
                this.receiptAllIds = ids;
                this.editAllReceiptConfirm();
            }
        },
        editAllReceiptConfirm(){
            const h = this.$createElement;
            this.$msgbox({
                title: "签收构件",
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},"货位号："+this.CheckReceiptObj.stockName),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then( action =>{
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'project2/receipt/batchReceiptOrderComponent',
                        headers:{
                            token:this.token
                        },
                        params:{
                            ids:this.receiptAllIds,
                            projId:this.projId,
                            warehouseId:this.CheckReceiptObj.warehouseId,
                        }
                    }).then( res =>{
                        if( res.data.cd== 0 ){
                            this.$message({
                                type: 'success',
                                message: "批量签收成功！",
                            });
                            this.getManifestInfoByMId();
                            this.refreshData(this.CheckReceiptObj.orderId);
                        }else{
                            this.$message({
                                type: 'warring',
                                message: res.data.msg,
                            });
                        }
                    }).catch();
                });
        },
        //编辑签收
        editReceipt(score){
            this.gouJianId = score.row.id;
            const h = this.$createElement;
            this.$msgbox({
                title: "签收构件",
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},"货位号："+this.CheckReceiptObj.stockName),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then(action => {
                    axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/receiptOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                        warehouseId:this.CheckReceiptObj.warehouseId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: "构件签收成功！",
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            });
        },
        //签收确认
        receiptConfirm(){
            this.$confirm('你确定要撤销清单构件检查?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/checkResult/cancelCheckOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });  
        },
        //编辑签收撤销
        editReceiptCancel(score){
            this.gouJianId = score.row.id;
            this.editReceiptCancel1();
        },
        editReceiptCancel1(){
            this.$confirm('你确定要撤销清单构件签收?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/cancelOrderComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.gouJianId,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: "撤销清单构件签收已完成！",
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });  
        },
        //编辑全部签收撤销
        editAllReceiptCancel(){
            this.$confirm('你确定要撤销清单下的全部构件签收?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/cancelAllComponent',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.CheckReceiptObj.checkItem.id,
                        projId:this.projId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: "撤销清单构件签收已完成！",
                        });
                        this.getManifestInfoByMId();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });  
        },
        //编辑全部签收
        EditAllReceipt(){
            const h = this.$createElement;
            this.$msgbox({
                title: "签收清单确认",
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},"确认签收以下清单内所有构件："),
                    h('p',null,"清单名称："+this.ManifestInfo.mName),
                    h('p',null,"货位号："+this.CheckReceiptObj.stockName),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then(action => {
                    axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/receiptAllComponentByOrderDetail',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.CheckReceiptObj.checkItem.id,
                        projId:this.projId,
                        warehouseId:this.CheckReceiptObj.warehouseId,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: "清单签收成功！",
                        });
                        this.getManifestInfoByMId();
                        this.refreshData(this.CheckReceiptObj.orderId);
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
            });
        },
        checkLabel(scope){
            var vm = this
            vm.screenLeft.show = true
            if(scope.row){
                var pkId = scope.row.id
                var tag = 1
            }else if(scope.pkId){
                var pkId = scope.id
                var tag = 2
            }
            axios({
                method:'GET',
                // url:vm.BDMSUrl+'show2/getEntityDetailInfo',
                url:vm.BDMSUrl+'manifest/getElementById',
                headers:{
                    token:vm.token
                },
                params:{
                    id:pkId,//类型 1 企业物料产品库显示列 2 清单明细基本信息显示列 3 订货清单明细显示列
                    // projectId:vm.projId
                }
            }).then(response=>{
                vm.checkedItem = {}
                if(response.data.cd == 0){
                    if(response.data.rt !=null)vm.checkedItem = response.data.rt
                    if(tag == 1){
                        vm.$set(vm.checkedItem,'space',scope.row.dStorey ? scope.row.dStorey : (scope.row.dDistrict ? scope.row.dDistrict : (scope.row.dBuild ? scope.row.dBuild : "")))
                        vm.$set(vm.checkedItem,'unit',scope.row.unit)
                    }else if( tag == 2){
                        vm.$set(vm.checkedItem,'space',scope.dStorey ? scope.dStorey : (scope.dDistrict ? scope.dDistrict : (scope.dBuild ? scope.dBuild : "")))
                        vm.$set(vm.checkedItem,'unit',scope.unit)
                    }
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenLoading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        openLabel(scope){
            var vm = this;
            vm.labelListShow = true;
            vm.singleLable = true;
            vm.pageLabelList.total = 1
            vm.S_Label_quantitiesList = []
            vm.S_Label_quantitiesList.push(scope.row)
        },
        openLocation(scope){
            if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })
            }else{
            this.TraceID=String(scope.row.traceId);
            this.HolderPath=JSON.parse(scope.row.holderPath);
            this.GCCode=scope.row.code;
            const para={"TraceID":this.TraceID,"HolderPath":this.HolderPath,"GCCode":this.GCCode}
            console.log(para)
            const app = document.getElementById('webIframe').contentWindow;
            app.postMessage({command:"LookAtEntities",parameter:para},"*");
                document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            }
        },
        openDingHuoLabel(scope){
            var vm = this;
            vm.labelDingHuoListShow = true;
            vm.singleDingHuoLable = true;
            // vm.pageLabelDingHuoList.total = 1
            vm.label_ComponentList = []
            vm.label_ComponentList.push(scope.row)
        },
        openFaHuoLabel(scope){
            var vm = this;
            vm.labelDingHuoListShow = true;
            vm.singleDingHuoLable = true;
            // vm.pageLabelDingHuoList.total = 1
            vm.label_ComponentList = []
            vm.label_ComponentList.push(scope.row)
        },
        openCheckLabel(scope){
            var vm = this;
            vm.labelDingHuoListShow = true;
            vm.singleDingHuoLable = true;
            // vm.pageLabelDingHuoList.total = 1
            vm.label_ComponentList = []
            vm.label_ComponentList.push(scope.row)
        },
        //编辑检查图片
        editUpLoadPicture(scope){
            this.showUploadPhoto = true;
            this.qocId = scope.row.id;
            this.loadCheckPhoto(this.qocId);
        },
        //加载检查图片
        loadCheckPhoto(id){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/checks/loadCheckPictureIndex',
                headers:{
                    token:this.token
                },
                params:{
                    qocId:id,
                    projId:this.projId,
                }
            }).then( res =>{
                console.log("图片上传",res);
                if( res.data.cd== 0 ){
                    this.checkImgList = [];
                    this.checkImgList = res.data.rt;
                }else{
                    this.$message({
                        type: 'warring',
                        message: res.data.msg,
                    });
                }
            }).catch();
        },
        //删除检查照片
        deleteCheckPhoto(id){
            this.$confirm('你确定要删除该附件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/deleteFile',
                    headers:{
                        token:this.token
                    },
                    params:{
                        fileId:id,
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                        });
                        this.loadCheckPhoto(this.qocId);
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        //添加照片
        addPhoto(){
            this.upImg = true;
        },
        //取消编辑图片
        upImgCancle(){
            this.upImg = false;
        },
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            const list = this.$refs.file.files;
            this.imageName = list[0].name;
            this.filesList = list;
            console.log("上传文件列表",this.filesList);
        },
        //上传图片确认
        upImgSure(){
            // let returnUrl = this.BDMSUrl+'project2/receipt/uploadFile?projId='+this.projId+'&id='+this.warehouseId;
            let returnUrl = this.BDMSUrl+'project2/order/uploadFile?projId='+this.projId+'&id='+this.qocId+'&type=27';
            returnUrl = encodeURIComponent(returnUrl);              
            let formData = new FormData();
            formData.append('projId',this.projId);
            formData.append('type','27');
            formData.append('userId',this.userId);
            formData.append('modelCode','011');
            formData.append('returnUrl',returnUrl)
            formData.append('token',this.token);
            formData.append('file',this.filesList[0]);
            console.log("上传图片文件",formData,formData.get("file"));
            axios({
                method:'post',
                url:this.QJFileManageSystemURL + 'uploading/uploadFileInfo',
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
                data:formData
            }).then(response=>{
                if(response.data.cd== '0'){
                    this.upImg = false;
                    this.imageName = '未选择任何图片';
                    this.loadCheckPhoto(this.qocId);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    // this.$router.push({
                    //    path:'/login'
                    // })
                    console.log("上传图片确认失败");
                }
            })
        },
        backDetail(){
            this.showUploadPhoto = false;
        },
        printLabelList(){
            var vm = this
            var datas = '['
            var tabelTitle = vm.projName + '构件标签'
            var keyList = '["可追踪ID","构件名称","所在单体","所在区域","所在楼层","构件分类","构件注释","构件标记"]'
            vm.S_Label_quantitiesList.forEach((item,i)=>{
                var valueList = '["' + (item.dTraceId ? item.dTraceId : "") + '","'
                    + (item.dName ? item.dName : "") + '","' + (item.dBuild ? item.dBuild : "") + '","'
                    + (item.dDistrict ? item.dDistrict : "") + '","' + (item.dStorey ? item.dStorey : "") + '","' +
                    (item.classifyName ? item.classifyName : "") + '","' + (item.componentComments ? item.componentComments : "") + '","'
                    + (item.componentTag ? item.componentTag : "") + '"]'
                var data = '{"Title":"' + tabelTitle + '","LabelType":"general","Code":"' +
                    vm.changeUrl(vm.qrShareUrl+'/QR-MX-' + vm.addZero(item.pkId, 7)) +
                    '","KeyList":' + keyList + ',"ValueList":' + valueList + '}'
                datas += data
                if (i < vm.S_Label_quantitiesList.length - 1) datas += ','
            })
            datas += ']'
            console.log(datas,'data000');
            vm.$refs.labelContent.value = datas
            $('#print-qrcode').submit()
            // $('#print-qrcode').submit(function () {
            //     if(data=== "" || data == null || data == undefined){
            //         return false
            //     }else{
            //         return true
            //     }
            // })
            // $('#print-qrcode').on('submit', function(event){
            //     console.log('阻止表达')
            //     console.log(event,'event')
            //      if(/*验证通过*/1){
            //          $('#print-qrcode').submit()

            //     }else{
            //         event.preventDefault();
            //     }
            // })
            
            
            vm.$message({
                type:'success',
                message:'已向打印机发送请求'
            })
        },
        changeUrl(val){
            var vm=this;
            $.ajax({
            url:'http://bimqr.cn/Public/GetShortUrl',
            type:'GET',
            data:{
                sourceUrl:encodeURIComponent(val)
            },
            async:false, //同步
            success:function(response){
                vm.returnLabelUrl=response.obj.short_url;
            }
            })
            return vm.returnLabelUrl;
      },
        changeBottomExpend(){
            var vm = this
            vm.bottomExpend.isExpend = !vm.bottomExpend.isExpend
            vm.bottomExpend.title = vm.bottomExpend.isExpend?'收起':'展开'
        },
        changeTopExpend(){
            var vm = this
            vm.topExpend.isExpend = !vm.topExpend.isExpend
            vm.topExpend.title = vm.topExpend.isExpend?'收起':'展开'
        },
        changeOrderListExpend(){
            var vm = this
            vm.OrderListExpend.isExpend = !vm.OrderListExpend.isExpend
            vm.OrderListExpend.title = vm.OrderListExpend.isExpend?'收起':'展开'
        },
        labelListConfirm(){
            var vm = this;
            var manifestId = '';
            if(this.isGongChengLiang){
                manifestId = this.manifestIdOne;
            }else{
                manifestId =vm.manifestId;
            }
            if(vm.singleLable == true){
                window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/'+vm.S_Label_quantitiesList[0].pkId)
            }else{
                window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/0')
            }
        },
        labelListCancle(){
            var vm = this
            vm.labelListShow = false
            vm.singleLable = false
        },
        labelDingHuoListConfirm(){
            var vm = this;
            var manifestId = '';
            if(this.isGongChengLiang){
                manifestId = this.manifestIdOne;
            }else{
                manifestId =vm.manifestId;
            }
            if(vm.singleDingHuoLable == true){
                window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/'+vm.label_ComponentList[0].pkId)
            }else{
                window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/0')
            }
        },
        labelDingHuoListCancle(){
            var vm = this
            vm.labelDingHuoListShow = false
            vm.singleDingHuoLable = false
        },
        headerListCancle(){
            var vm = this
            vm.ListHeaderShow = false
            vm.detailsHead_model.forEach((item,index)=>{
                    vm.$set(item,'showModel',item.show)
                })
        },
        headerListConfirm(){
            var vm = this
            vm.ListHeaderShow = false
            vm.detailsHead_model.forEach((item,index)=>{
                    vm.$set(item,'show',item.showModel)
                    vm.$set(vm.detailsHead[index],'show',item.showModel)
                })
        },
        headerOrderListCancle(){
            var vm = this
            vm.orderListHeaderShow = false
            vm.orderDetailsHead_model.forEach((item,index)=>{
                    vm.$set(item,'showModel',item.show)
                })
        },
        headerOrderListConfirm(){
            var vm = this
            vm.orderListHeaderShow = false
            vm.orderDetailsHead_model.forEach((item,index)=>{
                    vm.$set(item,'show',item.showModel)
                    vm.$set(vm.orderHead[index],'show',item.showModel)
                })
        },
        showLabel(){
            var vm = this;
            vm.labelListShow = true;
            this.S_Label_quantitiesList = this.copyS_Label_quantitiesList;
        },
        showLabelHeader(){
            var vm = this
            vm.ListHeaderShow = true
            var b = []
            $.extend(b,vm.detailsHead)
            vm.detailsHead_model = b
            vm.detailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        showDingHuoLabel(){
            var vm = this;
            vm.labelDingHuoListShow = true;
            this.label_ComponentList = this.copy_label_ComponentList;
        },
        showOrderLabelHeader(){
            var vm = this
            vm.orderListHeaderShow = true
            var b = []
            $.extend(b,vm.orderHead)
            vm.orderDetailsHead_model = b
            vm.orderDetailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        showFaHuoLabelHeader(){
            var vm = this
            vm.orderListHeaderShow = true
            var b = []
            $.extend(b,vm.sendHead)
            vm.orderDetailsHead_model = b
            vm.orderDetailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        showCheckLabelHeader(){
            var vm = this
            vm.orderListHeaderShow = true
            var b = []
            $.extend(b,vm.checkHead)
            vm.orderDetailsHead_model = b
            vm.orderDetailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        showReceiptLabelHeader(){
            var vm = this
            vm.orderListHeaderShow = true
            var b = []
            $.extend(b,vm.receiptHead)
            vm.orderDetailsHead_model = b
            vm.orderDetailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        testIfIsNull(row, column, cellValue, index){
            if(cellValue == null)return '/'
            return cellValue
        },
        //列表数据转换
        handleData(row, column, cellValue, index){
            if(row.sendStatus != null){
                this.$set(row,'sendStatus_show',this.handleStatus(row.sendStatus))
            }
            if(row.sendDate != null){
                this.$set(row,'sendDate_show',this.initData(row.sendDate))
            }
            if(row.checkStatus != null){
                this.$set(row,'checkResult_show',this.handleCheckStatus(row.checkResult))
            }
            if(row.checkDate != null){
                this.$set(row,'checkDate_show',this.initData(row.checkDate))
            }
            if(row.receiptDate != null){
                this.$set(row,'receiptDate_show',this.initData(row.receiptDate))
            }
            if(cellValue == null)return '/'
            return cellValue
        },
        //发货状态转换
        handleStatus(status){
            if( status == 0 ){
                return "未发货";
            }else if( status == 1 ){
                return "已发货";
            }
        },
        //检查状态转换
        handleCheckStatus(res){
            if( res == 2 ){
                return "合格";
            }else if( res == 1 ){
                return "不合格";
            }else if( res == 0 ){
                return "未查";
            }
        },
        back(){
            var vm = this
            vm.$emit('back')
        },
        refreshData(id){
            this.$emit('refreshData',id)
        },
        getIntoLists(){
            var vm = this
            vm.fullscreenLoading =true
            axios({
                method:'POST',
                url:vm.BDMSUrl+'manifest2/showColumns',
                headers:{
                    token:vm.token
                },
                params:{
                    type:2,//类型 1 企业物料产品库显示列 2 清单明细基本信息显示列 3 订货清单明细显示列
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.getManifestInfoByMId();
                    
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenLoading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        getManifestInfoByMId(){
            var vm = this
            var url = '';
            var params = new Object;
            let ways = '';
            /**
            * @李从文 
            * 此处加 工程量清单的代码
            * 接口为：show2/taskManifestDetail
            * 所用的参数只有 response.data.rt.main
            * ***/
        
            if(vm.isGongChengLiang){//工程量清单详情
                params = {
                    manifestId:vm.manifestIdOne,
                    projId:vm.projId,
                }
                url = 'show2/taskManifestDetail';//关联类型:1:关联文档;2:进度核实;3:工程算量;4:产品选型;5:物资采购;6:讨论主题;7:报表快照
                ways = 'GET';
            }else if(vm.bId){
                params = {
                    rType:vm.rType,
                    bId:vm.bId,
                }
                url = 'manifest2/getManifestInfo'//关联类型:1:关联文档;2:进度核实;3:工程算量;4:产品选型;5:物资采购;6:讨论主题;7:报表快照
                ways = 'POST';
            }else{
            /**
            * 默认 -- 指向物料量清单页面
            * 
            * **/
                params = {
                    manifestId:vm.manifestId
                }
                // url = 'manifest2/getManifestInfoByMId';
                // url = 'manifest/getElementByMid';
                url = 'manifest/getManifestById';
                ways = 'POST';
            }
            axios({
                method:ways,
                url:vm.BDMSUrl+url,
                headers:{
                    token:vm.token
                },
                params:params
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        console.log("getManifestInfoByMId",response);
                        if(vm.bId){
                            vm.manifestId = response.data.rt.pkId;
                        }
                        if(vm.isGongChengLiang){
                            vm.ManifestInfo = response.data.rt.main;
                        }else{
                            vm.ManifestInfo = response.data.rt ; 
                        }
                        if(vm.ManifestInfo.type == 2){
                            Object.assign(vm.ManifestInfo,{
                                _mType:'工程量清单'
                            })
                        }else if(vm.ManifestInfo.type == 1){
                            Object.assign(vm.ManifestInfo,{
                                _mType:'构件量清单'
                            })
                        }else if(vm.ManifestInfo.type == 3){
                            Object.assign(vm.ManifestInfo,{
                                _mType:'物料量清单'
                            })
                        }
                        vm.findManifestDetailList(2);
                        // vm.findComponentList(2);
                    }
                    
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg);
                    }else{
                        vm.$router.push({
                            path:'/login'
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
            })
        },
        //加载明细列表
        changeShowType(val){
            var vm = this
            //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            if(val && vm.showType == 'combine'){
                vm.showType = 'separate'
                vm.detailsHead[1].show = true //序号列不显示
                vm.findManifestDetailList()
            }
            if(!val && vm.showType == 'separate'){
                vm.showType = 'combine'
                vm.detailsHead[1].show = false //序号列不显示
                vm.findManifestDetailList()
            }
        },
        findManifestDetailList(isDialog=0){
            var vm = this
            //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            /**
            * @augments isDialog 判断是否是弹框
            *   pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            * **/
            var showType = 1;
            /*@李从文
                    这个接口对应 show/getManifestDetailInfo
            */
            if(vm.showType == 'combine'){
                showType = 2;
            }
            if(isDialog == 1){
                var page = vm.pageLabelList.currentPage;
                var rows = vm.pageLabelList.pagePerNum;
            }else{
                var page = vm.pageDetial.currentPage;
                var rows = vm.pageDetial.pagePerNum;
            }
            var manifestId = '';
            if(this.isGongChengLiang){
                manifestId = this.manifestIdOne;
            }else{
                manifestId = this.manifestId;
            }
            axios({
                method:'POST',
                // url:vm.BDMSUrl+'manifest2/findManifestDetailList',
                url:vm.BDMSUrl+'manifest/getElementByMid',
                headers:{
                    token:vm.token
                },
                params:{
                    // projectId:vm.projId,
                    // manifestId:manifestId,
                    // page:page,
                    // rows:rows,
                    // showType:showType,//显示类型 1 逐个显示 2 合并显示
                    // currentColumns:'',
                    businessType:vm.type,
                    mid:vm.manifestId 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        // console.log("findManifestDetailList",response);
                        if(this.jishuCount==0){
                            this.detailNum = response.data.rt.total;
                            this.jishuCount++;
                        }
                        vm.pageLabelList.total = response.data.rt.total
                        vm.pageDetial.total = response.data.rt.total;

                        if(isDialog == 1){
                            if(response.data.rt.rows != null){
                                vm.S_Label_quantitiesList = response.data.rt.rows;
                                this.copyS_Label_quantitiesList = response.data.rt.rows;
                               
                            }else{
                                vm.S_Label_quantitiesList = [];
                            }
                             console.log('1')
                        }else if(isDialog == 0){
                            if(response.data.rt.rows != null){
                                vm.S_quantitiesList = response.data.rt.rows;
                                
                                vm.S_quantitiesList.forEach((element,index) => {
                                    vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                    vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                                });
                                
                            }else{
                                vm.S_quantitiesList = [];
                            }
                            console.log('2')
                        }else if(isDialog == 2){
                            if(response.data.rt != null){
                                vm.S_Label_quantitiesList = response.data.rt
                                this.copyS_Label_quantitiesList = response.data.rt;
                                vm.S_quantitiesList = response.data.rt;
                                this.detailNum=response.data.rt.length;
                                // vm.S_quantitiesList.forEach((element,index) => {
                                //     vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                //     vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                                // });
                                
                            }else{
                                vm.S_Label_quantitiesList = []
                                vm.S_quantitiesList = []
                            }
                            console.log('3')
                        }
                    }
                }else {
                    alert(response.data.msg);
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        //获取订货清单明细
        findComponentList(isDialog=0){
            var vm = this
            //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            /**
            * @augments isDialog 判断是否是弹框
            *   pageLabelDingHuoList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            * **/
            // var showType = 1;
            /*@刘志强
                    这个接口对应 show/getManifestDetailInfo
            */
            // if(vm.showType == 'combine'){
            //     showType = 2;
            // }
            if(isDialog == 1){
                var page = vm.pageLabelDingHuoList.currentPage;
                var rows = vm.pageLabelDingHuoList.pagePerNum;
            }else{
                var page = vm.pageOrder.currentPage;
                var rows = vm.pageOrder.pagePerNum;
            }
            var manifestId = '';
            if(this.isGongChengLiang){
                manifestId = this.manifestIdOne;
            }else{
                manifestId = this.manifestId;
            }
            if( this.isShowWuZi ){
                //获取订货清单明细 
            }else if( this.isShowFaHuo ){
                //获取发货清单明细
            }else if( this.isShowCheck ){
                //获取检查清单明细
            }else if( this.isShowReceipt ){
                //获取签收清单明细
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/order/findComponentList', //通过清单获取清单明细信息 分页
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    orderDetailId:this.oId,
                    page:page,
                    rows:rows,
                }
            }).then(response=>{
                if(response.data != null){
                    this.orderDetailNum = response.data.total;
                    this.pageLabelDingHuoList.total = response.data.total;
                    this.pageOrder.total = response.data.total;
                    let arr = {};
                    arr = response.data.rows;
                    arr.map( (item,index)=>{
                        item.fieldDataJson = eval(item.fieldDataJson);
                    });
                    console.log(arr);
                    if(isDialog == 1){
                        if(arr != null){ 
                            this.label_ComponentList = arr;
                            this.copy_label_ComponentList = arr;
                        }else{
                            this.label_ComponentList = [];
                        }
                    }else if(isDialog == 0){
                        if(arr != null){
                            this.ComponentList = arr;     
                            this.ComponentList.forEach((element,index) => {
                                vm.$set(element,'SerialNumber',vm.pageOrder.pagePerNum*(vm.pageOrder.currentPage-1)+index+1)//列表序号
                                // vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                            });
                        }else{
                            this.ComponentList = [];
                        }
                    }else if(isDialog == 2){
                    if(arr != null){
                        this.label_ComponentList = arr;
                        this.copy_label_ComponentList = arr;
                        this.ComponentList = arr;
                        this.ComponentList.forEach((element,index) => {
                            vm.$set(element,'SerialNumber',vm.pageOrder.pagePerNum*(vm.pageOrder.currentPage-1)+index+1)//列表序号
                            // vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                        });
                    }else{
                        this.label_ComponentList = []
                        this.ComponentList = []
                    }
                    console.log( this.label_ComponentList,this.copy_label_ComponentList,this.ComponentList);
                    this.getDingHuoAmount();
                    this.getSelectionMode();
                } 
                }else {
                    alert(response.data.msg);
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        
        //获取SelectionMode
        getSelectionMode(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/orderComponent', //定单明细构件单页面信息获取
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    // manifestId:manifestId,
                    detailId:this.oId,
                    // page:page,
                    // rows:rows,
                    //showType:showType,//显示类型 1 逐个显示 2 合并显示
                    //currentColumns:'',
                }
            }).then(res =>{
                if(res.data.cd == 0){
                    this.selectionMode = res.data.rt.selectionMode;
                }
                
            }).catch();
            
        },
        changePage(val){//分页 0 -1 1 2
            var vm = this; 
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
        },
        changePageOrder(val){
            var vm = this; 
            if(vm.pageOrder.currentPage == 1 && (val == 0 || val == -1)){
                vm.$message('这已经是第一页!')
                return false
            }
            if(vm.pageOrder.currentPage >= Math.ceil(vm.pageOrder.total/vm.pageOrder.pagePerNum) && (val == 1 || val == 2)){
                vm.$message('这已经是最后一页!')
                return false
            }
            switch(val){
                case 0:
                    vm.pageOrder.currentPage = 1
                    break;
                case -1:
                    vm.pageOrder.currentPage--
                    break;
                case 1:
                    vm.pageOrder.currentPage++
                    break;
                case 2:
                    vm.pageOrder.currentPage = Math.ceil(vm.pageOrder.total/vm.pageOrder.pagePerNum)
                    break;
            }
        },
        // 补零
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
        },
        /**
             * 解析清单生成来源
        */
        parseMGSource(mGSource){
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
        parseMStatus(mStatus) {
            // 施工现场
            if(!mStatus)return false
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
        trim(str){ 
            /**去掉字符串前后所有空格*/
            return str.replace(/(^\s*)|(\s*$)/g, ""); 
        },
        initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
    }
})
</script>
