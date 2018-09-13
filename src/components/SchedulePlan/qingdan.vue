<template>
<div id="CommenList1" v-loading.fullscreen.lock="fullscreenLoading">
        <form id="print-qrcode" action="http://127.0.0.1:54321/qblabel/general" method="post" enctype="multipart/form-data" target="printLabel">
            <input type="hidden" name="p" ref="labelContent">
        </form>
        <div :class="[{'box-left-avtive':!screenLeft.show,},'box-left-container']">
            <div style="min-width: 950px;height:785px;overflow-y: auto;">
                
                <div id="containerMessage">
                    <div class="project" v-loading="loading">
                        <p class="antsLine">
                            工程任务<i class="icon-sanjiao-right"></i><span style="cursor:pointer"  @click="back()" v-text="title"></span><i class="icon-sanjiao-right"></i>
                            <span class="strong">清单详情</span>
                        </p>
                        <!--以下是列表-->
                        <p class="header clearfix">
                             <span class="left_header">
                                <i class="list_ icon"></i>清单基本信息
                            </span>
                            <a :class="['right_header','right-expend',topExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)"  @click="changeTopExpend()" v-text="topExpend.title"></a>
                        </p>
                        <div v-show="topExpend.isExpend" style="background:#fafafa;position: relative;">
                               <ul class="left-item-box">
                                   <li class="item clearfix">
                                       <span class="left">清单编号</span>
                                       <span class="right" v-text="ManifestInfo.pkId"></span>
                                   </li>
                                     <li class="item clearfix">
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
                                   </li>

                                     <li class="item clearfix">
                                       <span class="left">清单名称</span>
                                       <span class="right" v-text="ManifestInfo.mName"></span>
                                   </li>
                                     <li class="item clearfix">
                                       <span class="left">业务状态</span>
                                       <span class="right"  v-text="parseMStatus(ManifestInfo.mStatus)+'('+ ManifestInfo.mStatus +')'"></span>
                                   </li>
                                     <li class="item clearfix">
                                       <span class="left">修改时间</span>
                                       <span class="right" v-text="initData(ManifestInfo.updateTime)"></span>
                                   </li>

                                     <li class="item clearfix" style="margin-bottom:0;">
                                       <span class="left">生成方式</span>
                                       <span class="right" v-text="parseMGSource(ManifestInfo.mGSource)"></span>
                                   </li>
                                     <li class="item clearfix" style="margin-bottom:0;">
                                       <span class="left">创建时间</span>
                                       <span class="right"  v-text="initData(ManifestInfo.createTime)"></span>
                                   </li>
                                     <li class="item clearfix" style="margin-bottom:0;">
                                       <span class="left">清单类型</span>
                                       <span class="right" v-text="ManifestInfo.mType"></span>
                                   </li>
                               </ul>
                               <div class="right-QRcode">
                                   <img :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(ManifestInfo.pkId, 7) " alt="">
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
                                    <span  class="title-list" v-text="'明细总数：'+pageDetial.total"></span>
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
                                <div v-if="S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                    <!-- 无符合当前筛选条件的记录 -->
                                </div>
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

                         <!-- 以下是明细施工进度 -->
                         <p class="header clearfix"  style="margin-top:30px;">
                            <span class="left_header">
                                <i class="detial icon"></i>明细施工进度
                            </span>
                            <a :class="['right_header','right-expend',bottomExpend1.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeBottomExpend1()" v-text="bottomExpend1.title"></a>
                        </p>
                         <div v-show="bottomExpend1.isExpend">
                            <div style="overflow: auto;">
                                <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                    <span  class="title-list" v-text="'已完工：'+pageDetial.total"></span>
                                    <span  class="title-list" v-text="'未完工：'+pageDetial.total"></span>
                                    <span  class="title-list" v-text="'完工比例：'+pageDetial.total"></span>
                                    <span class="item-btn clearfix">
                                        <label class="item-btn-icon icon-0" @click="changeShowType(true)">逐个显示</label>
                                        <label class="item-btn-icon icon-1" @click="changeShowType(false)">合并显示</label>
                                        <label class="item-btn-icon icon-3" @click="showLabelHeader1()">显示列</label>
                                    </span>
                                </p>
                            <el-table  :data="S_quantitiesList"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">
                                    <el-table-column
                                    v-for="(item,index) in detailsHead1" :key="index"
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
                                <div v-if="S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                    <!-- 无符合当前筛选条件的记录 -->
                                </div>
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

                         <!-- 以下是明细产值 -->
                         <p class="header clearfix"  style="margin-top:30px;">
                            <span class="left_header">
                                <i class="detial icon"></i>明细产值
                            </span>
                            <a :class="['right_header','right-expend',bottomExpend2.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeBottomExpend2()" v-text="bottomExpend2.title"></a>
                        </p>
                        <div v-show="bottomExpend2.isExpend">
                            <div style="overflow: auto;">
                                <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
                                    <span  class="title-list" v-text="'总产值：'+pageDetial.total"></span>
                                    <span  class="title-list" v-text="'已完成：'+pageDetial.total"></span>
                                    <span class="item-btn clearfix">
                                        <label class="item-btn-icon icon-1" >全选</label>
                                        <label class="item-btn-icon icon-1" >全不选</label>
                                        <label class="item-btn-icon icon-1" >批量编辑</label>
                                        <label class="item-btn-icon icon-1" >完成编辑</label>
                                        <label class="item-btn-icon icon-2" @click="showLabel()">全部标签</label>
                                        <label class="item-btn-icon icon-3" @click="showLabelHeader2()">显示列</label>
                                    </span>
                                </p>
                            <el-table  :data="S_quantitiesList"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">
                                    <el-table-column
                                    v-for="(item,index) in detailsHead2" :key="index"
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
                                <div v-if="S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                    <!-- 无符合当前筛选条件的记录 -->
                                </div>
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
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">清单及序号</span>
                                <span class="detial-text-value" v-text="checkedItem.manifestId+'-'+checkedItem.detailId" :title="checkedItem.manifestId+'-'+checkedItem.detailId"></span>
                            </li>
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
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">业务状态</span>
                                <span class="detial-text-value" v-text="parseMStatus(checkedItem.status) + '(' + checkedItem.status + ')'" :title="parseMStatus(checkedItem.status) + '(' + checkedItem.status + ')'"></span>
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
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">可追踪ID：</span>
                                    <span class="text-right" v-text="testIfIsNull(null,null,item.dTraceId)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件名称：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.name)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在单体：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.build)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在分区：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.disctrict)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在楼层：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.storey)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件分类：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.classifyName)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件注释：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.comment)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件标记：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.tag)"></span>
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
        <!-- 明细基本信息 -->
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
        <!-- 明细施工进度 -->
        <div v-if="ListHeaderShow1"  id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">显示列</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="headerListCancle1">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in detailsHead_model1" :key="index" v-if="index >=2">
                          <label  :class="[item.showModel?'active':'','checkbox-fileItem']" :for="item.prop+'_header'" v-text="item.name"></label>
                          <input  type="checkbox" :id="item.prop+'_header'" class="checkbox-arr" v-model="item.showModel">
                    </span>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="headerListConfirm1">确定</button>
                    <button class="editBtnC" @click="headerListCancle1">取消</button>
                </div>
            </div>
        </div>
        <!-- 明细产值 -->
        <div v-if="ListHeaderShow2"  id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">显示列</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="headerListCancle2">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in detailsHead_model2" :key="index" v-if="index >=2">
                          <label  :class="[item.showModel?'active':'','checkbox-fileItem']" :for="item.prop+'_header'" v-text="item.name"></label>
                          <input  type="checkbox" :id="item.prop+'_header'" class="checkbox-arr" v-model="item.showModel">
                    </span>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="headerListConfirm2">确定</button>
                    <button class="editBtnC" @click="headerListCancle2">取消</button>
                </div>
            </div>
        </div>


        <div id="mask" v-if="labelListShow || ListHeaderShow || ListHeaderShow1||ListHeaderShow2" ></div>
</div>       
</template>
<style  lang='less'>
    .navigation{
        z-index: 0!important;
    }
    #CommenList1{
        #print-qrcode{
            display: none;
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
                    background: url('../planCost/images/location.png') no-repeat;
                }
                .detialBtn{
                    background: url('../planCost/images/detial_.png') no-repeat;
                }
                .labelBtn{
                    background: url('../planCost/images/label.png') no-repeat;
                }
                .project{
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
                                background: url('../planCost/images/list_.png')no-repeat 0 0;
                            } 
                            .detial{
                                background: url('../planCost/images/detial.png')no-repeat 0 0;
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
                                background: url('../planCost/images/expand.png') no-repeat 0 0;
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
                        line-height: 14px;
                        color: #999999;
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
                                background-image: url('../planCost/images/1-0.png');
                             }
                        }
                         .icon-1{
                             &::after{
                                background-image: url('../planCost/images/1-1.png');
                             }
                        }
                         .icon-2{
                             &::after{
                                background-image: url('../planCost/images/1-2.png');
                             }
                        }
                         .icon-3{
                             &::after{
                                background-image: url('../planCost/images/1-3.png');
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
            display: inline-block;
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
                    }
                    .detial-text-value{
                        color: #333333;
                        max-width: 120px;
                        overflow: hidden;
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
</style>
<script>
import Vue from 'vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
export default Vue.component('common-list',{
  props:['mId','title','rType','bId','isGongChengLiang','manifestIdOne'],
  data(){
       window.addEventListener("message", (evt)=>{this.callback(evt)});
      return {
          fullscreenLoading:false,//全屏loading
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
        checkedItem:{},
        fullscreenloading:false,
        ManifestInfo:{},//清单基本信息
        //明细基本信息
        detailsHead:[
             {
                name:'',
                show:true,
                prop:'SerialNumber',
            },
            {
                name:'序号',
                show:true,
                prop:'pkId',
            },
             {
                name:'所在单体',
                show:true,
                prop:'build',
            },
             {
                name:'所在分区',
                show:true,
                prop:'disctrict',
            },
             {
                name:'所在楼层',
                show:true,
                prop:'storey',
            },
             {
                name:'类型名称',
                show:true,
                prop:'classifyName',
            },
             {
                name:'名称',
                show:true,
                prop:'name',
            },
             {
                name:'业务状态',
                show:true,
                prop:'dState_format',
            }, {
                name:'单位',
                show:true,
                prop:'unit',
            },
             {
                name:'数量',
                show:true,
                prop:'count',
            },
        ],
        //明细施工进度
        detailsHead1:[
            {
                name:'',
                show:true,
                prop:'SerialNumber',
            },
            {
                name:'序号',
                show:true,
                prop:'pkId',
            },
             {
                name:'所在单体',
                show:true,
                prop:'build',
            },
             {
                name:'所在分区',
                show:true,
                prop:'disctrict',
            },
             {
                name:'所在楼层',
                show:true,
                prop:'storey',
            },
             {
                name:'类型名称',
                show:true,
                prop:'classifyName',
            },
             {
                name:'名称',
                show:true,
                prop:'name',
            },
            {
                name:'开工时间',
                show:true,
                prop:'openWorkTime',
            },
            {
                name:'开工确认',
                show:true,
                prop:'openWorkUser',
            },
            {
                name:'完工时间',
                show:true,
                prop:'finishWorkTime',
            },
             {
                name:'完工确认',
                show:true,
                prop:'finishWorkUser',
            }
        ],
        //明细产值
        detailsHead2:[
            {
                name:'',
                show:true,
                prop:'SerialNumber',
            },
             {
                name:'所在单体',
                show:true,
                prop:'build',
            },
             {
                name:'所在分区',
                show:true,
                prop:'disctrict',
            },
             {
                name:'所在楼层',
                show:true,
                prop:'storey',
            },
             {
                name:'类型名称',
                show:true,
                prop:'classifyName',
            },
             {
                name:'名称',
                show:true,
                prop:'name',
            },
            {
                name:'修改人',
                show:true,
                prop:'valueUpdator',
            },
            {
                name:'修改时间',
                show:true,
                prop:'valueUpdateTime',
            },
            {
                name:'产值',
                show:true,
                prop:'value',
            }
        ],
        detailsHead_model:[],
        detailsHead_model1:[],
        detailsHead_model2:[],
        showOperate:true,
        S_quantitiesList:[],//明细基本信息
       
        S_Label_quantitiesList:[],
        showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
        labelListShow:false,//
        ListHeaderShow:false,//
         ListHeaderShow1:false,
        ListHeaderShow2:false,
        topExpend:{
            title:'收起',
            isExpend:true
        },
        bottomExpend:{
            title:'收起',
            isExpend:true
        },
        topExpend1:{
            title:'收起',
            isExpend:true
        },
        bottomExpend1:{
            title:'收起',
            isExpend:true
        },
        topExpend2:{
            title:'收起',
            isExpend:true
        },
        bottomExpend2:{
            title:'收起',
            isExpend:true
        },
        singleLable:false,//单个标签展示 不需要分页器
        manifestId:Number,//mid
        TraceID:'',
        HolderPath:'',
        GCCode:'',
      }
  },
  created(){
        var vm = this
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.userImg = localStorage.getItem('userImg')
        // vm.WebGlSaveId = localStorage.getItem('WebGlSaveId')
        // vm.WebGlSaveType = localStorage.getItem('WebGlSaveType')
        // vm.WebGlSaveName = localStorage.getItem('WebGlSaveName')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.projName = localStorage.getItem('projName')
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.UPID = vm.$store.state.UPID
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.BIMServerPort=vm.$store.state.BIMServerPort;
        vm.manifestId = vm.mId
        vm.getIntoList();
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
  },
  methods:{
      callback(e){
           // console.log(e)
            switch(e.data.command){
			case "EngineReady":
				{
                    // let Horder = {"ID":this.WebGlSaveId,"Type":this.WebGlSaveType,"Name":this.WebGlSaveName,"ParentID":""};
					// let para = {User:"",TokenID:"",Setting:{BIMServerIP:this.WebGlUrl,BIMServerPort:this.BIMServerPort,MidURL:"qjbim-mongo-instance",RootHolder:Horder}}
					// app.postMessage({command:"EnterProject",parameter:para},"*");
				}
				break;
            case "CurrentSelectedEnt":
                // CurrentSelectPara = e.data.parameter;
			case "ViewpointSubmited":
                break;
        }
      },
      checkLabel(scope){
          var vm = this
          vm.screenLeft.show = true
          if(scope.row){
               var pkId = scope.row.pkId
               var tag = 1
          }else if(scope.pkId){
               var pkId = scope.pkId
                var tag = 2
          }
        axios({
            method:'GET',
            url:vm.BDMSUrl+'show2/getEntityDetailInfo',
            headers:{
                token:vm.token
            },
            params:{
                detailId:pkId,//类型 1 企业物料产品库显示列 2 清单明细基本信息显示列 3 订货清单明细显示列
                projectId:vm.projId
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
          var vm = this
        vm.labelListShow = true
        vm.singleLable = true
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
                console.log(scope);
                this.TraceID=String(scope.row.dTraceId);
                this.HolderPath=JSON.parse(scope.row.dHolderPath);
                this.GCCode=scope.row.dGCCode;
                console.log(this.TraceID);
                const para={"TraceID":this.TraceID,"HolderPath":this.HolderPath,"GCCode":this.GCCode} 
                const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"LookAtEntities",parameter:para},"*");
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
        }
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
                'qr.qjbim.com/appcenter/qr/' + vm.UPID + '/QR-MX-' + vm.addZero(item.pkId, 7) +
                '","KeyList":' + keyList + ',"ValueList":' + valueList + '}'
            datas += data
            if (i < vm.S_Label_quantitiesList.length - 1) datas += ','
        })
        datas += ']'
        vm.$refs.labelContent.value = datas
        $('#print-qrcode').on('submit', function(event){
            event.preventDefault() //阻止form表单默认提交
        })
        $('#print-qrcode').submit()
        vm.$message({
            type:'success',
            message:'已向打印机发送请求'
        })
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
       changeBottomExpend1(){
          var vm = this
          vm.bottomExpend1.isExpend = !vm.bottomExpend1.isExpend
          vm.bottomExpend1.title = vm.bottomExpend1.isExpend?'收起':'展开'
      },
      changeTopExpend1(){
          var vm = this
          vm.topExpend1.isExpend = !vm.topExpend1.isExpend
          vm.topExpend1.title = vm.topExpend1.isExpend?'收起':'展开'
      },
       changeBottomExpend2(){
          var vm = this
          vm.bottomExpend2.isExpend = !vm.bottomExpend2.isExpend
          vm.bottomExpend2.title = vm.bottomExpend2.isExpend?'收起':'展开'
      },
      changeTopExpend2(){
          var vm = this
          vm.topExpend2.isExpend = !vm.topExpend2.isExpend
          vm.topExpend2.title = vm.topExpend2.isExpend?'收起':'展开'
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
      //明细基本信息显示列
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
       headerListCancle1(){
        var vm = this
        vm.ListHeaderShow1 = false
        vm.detailsHead_model1.forEach((item,index)=>{
             vm.$set(item,'showModel',item.show)
         })
      },
      headerListConfirm1(){
        var vm = this
        vm.ListHeaderShow1 = false
        vm.detailsHead_model1.forEach((item,index)=>{
             vm.$set(item,'show',item.showModel)
             vm.$set(vm.detailsHead1[index],'show',item.showModel)
         })
      },
        headerListCancle2(){
        var vm = this
        vm.ListHeaderShow2 = false
        vm.detailsHead_model2.forEach((item,index)=>{
             vm.$set(item,'showModel',item.show)
         })
      },
      headerListConfirm2(){
        var vm = this
        vm.ListHeaderShow2 = false
        vm.detailsHead_model2.forEach((item,index)=>{
             vm.$set(item,'show',item.showModel)
             vm.$set(vm.detailsHead2[index],'show',item.showModel)
         })
      },
      showLabel(){
          var vm = this
          vm.labelListShow = true
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
      showLabelHeader1(){
         var vm = this
         vm.ListHeaderShow1 = true
         var b = []
         $.extend(b,vm.detailsHead1)
         vm.detailsHead_model1 = b
         vm.detailsHead_model1.forEach((item,index)=>{
             vm.$set(item,'showModel',item.show)
         })
      },
      showLabelHeader2(){
         var vm = this
         vm.ListHeaderShow2 = true
         var b = []
         $.extend(b,vm.detailsHead2)
         vm.detailsHead_model2 = b
         vm.detailsHead_model2.forEach((item,index)=>{
             vm.$set(item,'showModel',item.show)
         })
      },
      testIfIsNull(row, column, cellValue, index){
          if(cellValue == null)return '/'
          return cellValue
      },
      back(){
          var vm = this
          vm.$emit('back')
      },
      getIntoList(){
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
                mId:vm.manifestId,
            }
            url = 'manifest2/getManifestInfoByMId';
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
                    if(vm.bId){
                        vm.manifestId = response.data.rt.pkId;
                    }
                    if(vm.isGongChengLiang){
                        vm.ManifestInfo = response.data.rt.main;
                    }else{
                        vm.ManifestInfo = response.data.rt ; 
                    }
                }
                vm.findManifestDetailList(2)
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
    // findManifestDetailList(isDialog=0){
    //     var vm = this
    //     //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
    //     /**
    //     * @augments isDialog 判断是否是弹框
    //     *   pageLabelList:{
    //          pagePerNum:10,//一页几份数据
    //         currentPage:1,//初始查询页数 第一页
    //         total:0,//所有数据
    //     },
    //     * **/
    //     var showType = 1;
    //     /*@李从文
    //             这个接口对应 show/getManifestDetailInfo
    //     */
    //     if(vm.showType == 'combine'){
    //         showType = 2;
    //     }
    //     if(isDialog == 1){
    //         var page = vm.pageLabelList.currentPage;
    //         var rows = vm.pageLabelList.pagePerNum;
    //     }else{
    //         var page = vm.pageDetial.currentPage;
    //         var rows = vm.pageDetial.pagePerNum;
    //     }
    //     var manifestId = '';
    //     if(this.isGongChengLiang){
    //         manifestId = this.manifestIdOne;
    //     }else{
    //         manifestId = this.manifestId;
    //     }
    //     axios({
    //         method:'POST',
    //         url:vm.BDMSUrl+'manifest2/findManifestDetailList',
    //         headers:{
    //             token:vm.token
    //         },
    //         params:{
    //             projectId:vm.projId,
    //             manifestId:manifestId,
    //             page:page,
    //             rows:rows,
    //             showType:showType,//显示类型 1 逐个显示 2 合并显示
    //             currentColumns:'',
    //         }
    //     }).then(response=>{
    //         if(response.data.cd == 0){
    //             if(response.data.rt != null){
    //                 vm.pageLabelList.total = response.data.rt.total
    //                 vm.pageDetial.total = response.data.rt.total
    //                 if(isDialog == 1){
    //                     if(response.data.rt.rows != null){
    //                         vm.S_Label_quantitiesList = response.data.rt.rows
    //                     }else{
    //                         vm.S_Label_quantitiesList = []
    //                     }
    //                 }else if(isDialog == 0){
    //                     if(response.data.rt.rows != null){
    //                         vm.S_quantitiesList = response.data.rt.rows;
    //                         vm.S_quantitiesList.forEach((element,index) => {
    //                             vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
    //                             vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
    //                         });
    //                     }else{
    //                         vm.S_quantitiesList = [];
    //                     }
    //                 }else if(isDialog == 2){
    //                         if(response.data.rt.rows != null){
    //                         vm.S_Label_quantitiesList = response.data.rt.rows
    //                         vm.S_quantitiesList = response.data.rt.rows
    //                         vm.S_quantitiesList.forEach((element,index) => {
    //                             vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
    //                             vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
    //                         });
    //                     }else{
    //                         vm.S_Label_quantitiesList = []
    //                         vm.S_quantitiesList = []
    //                     }
    //                 }
    //             }
    //         }else if(response.data.cd == '-1'){
    //             alert(response.data.msg);
    //         }else{
    //             vm.$router.push({
    //                 path:'/login'
    //             })
    //         }
    //        }).catch((err)=>{
    //         console.log(err)
    //     })
    // },
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
            method:'get',
            url:vm.BDMSUrl+'/show2/getManifestDetailInfo',
            headers:{
                token:vm.token
            },
            params:{
                projId:vm.projId,
                manifestId:manifestId,
                page:page,
                rows:rows,
                showType:showType,//显示类型 1 逐个显示 2 合并显示
                columnType:8,
                bType:2
            }
        }).then(response=>{
            if(response.data.cd == 0){
                if(response.data.rt != null){
                    vm.pageLabelList.total = response.data.rt.total
                    vm.pageDetial.total = response.data.rt.total
                    if(isDialog == 1){
                        if(response.data.rt.rows != null){
                            vm.S_Label_quantitiesList = response.data.rt.rows
                        }else{
                            vm.S_Label_quantitiesList = []
                        }
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
                    }else if(isDialog == 2){
                            if(response.data.rt.rows != null){
                            vm.S_Label_quantitiesList = response.data.rt.rows
                            vm.S_quantitiesList = response.data.rt.rows
                            vm.S_quantitiesList.forEach((element,index) => {
                                vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                            });
                        }else{
                            vm.S_Label_quantitiesList = []
                            vm.S_quantitiesList = []
                        }
                    }
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
