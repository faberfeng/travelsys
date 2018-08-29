<template>
    <div  id="inventory" v-loading.fullscreen="fullscreenloading">
        <div class="topHeader" >
            <div id="item-box-file">
                <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item ">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item label-item-active">  
                    物料量清单  
                </router-link>
            </div>
            <div class="project" v-if="!showCommonList && !showCommonDetial &&!duliWuliaoObj.show" v-loading="loading">
                <!--以下是实时列表-->
                <div ref="hhhh"></div>
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="target icon"></i>可追溯物料量清单
                        </span>
                        <a class="right" @click="addNewWuliao">+新增</a>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单ID</th>
                                <th>清单名称</th>
                                <th>类型编码条目</th>
                                <th>构件总数</th>
                                <th>已出物料量</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  S_quantitiesList" :key="index">
                                <td v-text="(pageDetial.pagePerNum*(pageDetial.currentPage-1))+index+1"></td>
                                <td v-text="val.id"></td>
                                <td v-text="val.detailName"></td>
                                <td v-text="val.itemsCount"></td>
                                <td v-text="val.componentCount"></td>
                                <td v-text="val.hasOut"></td>
                                <td v-text="val.totalPrice"></td>  
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createDate)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="showDetial(val)" ></button>
                                    <button class="listBtn actionBtn" title="清单"  @click="showlist(val)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.id,val.relaId,true)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                        无可追溯物料量清单
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" S_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                        <option value="5">5</option>
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
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'1')"></a>
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
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'1')"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
                <!--以下是快照列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="reportS icon"></i>独立物料量清单
                        </span>
                        <a class="right" href="javascript:void(0)" @click="importExcel()">导入</a>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单ID</th>
                                <th>清单名称</th>
                                <th>物料量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  D_quantitiesList" :key="index">
                                <td v-text="(pageDetial_1.pagePerNum*(pageDetial_1.currentPage-1))+index+1"></td>
                                <td v-text="val.id"></td>
                                <td v-text="val.detailName"></td>
                                <td v-text="val.hasOut"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createDate)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="viewDetail(val)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.id,0)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" D_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无独立物料量清单
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" D_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial_1.pagePerNum">
                                        <option value="5">5</option>
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
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'1')"></a>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-left:5px;">第</span>
                                </td>
                                <td>
                                        <input class="pagination-num" type="text" v-model="pageDetial_1.currentPage">
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial_1.total/pageDetial_1.pagePerNum)}}页</span>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'1')"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial_1.pagePerNum+',共'+pageDetial_1.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id"  :title="'物料量清单'"  v-if="showCommonList"></common-list>
            <common-detial v-if="showCommonDetial" :detailId="checkItem.id" :title="'物料量清单'" v-on:back="backToH"></common-detial>
            <!--由李从文增加-->
            <div class="duliWuliao" v-if="duliWuliaoObj.show"> 
                <p class="antsLine">
                    成本管理<i class="icon-sanjiao-right">
                    </i><span style="cursor:pointer"  @click="backToOrign()">物料量清单</span>
                    <i class="icon-sanjiao-right"></i>
                    <span class="strong">【{{wuliaoDetailName}}】物料量清单明细</span>
                </p>
                <div>
                    <zk-table 
                        index-text="序号"
                        :data="mappingData" :columns="tableColumns" :tree-type="props.treeType"
                        :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                        :border="props.border" empty-text="正在加载...">
                        <template slot="action" slot-scope="scope">
                            <div v-if="scope.row.relaId != 0 && scope.row.relaId != null && scope.row.mStatus.substring(2, 1) < 3">
                                <button class="changeProducticon"  @click="selcetNewModel(scope)"></button>
                            </div>
                        </template> 
                    </zk-table>
                    <div class="datagrid-pager pagination" v-if=" S_quantitiesList.length>0">
                        <table cellspacing="0" cellpadding="0" border="0" >
                            <tbody>
                                <tr>
                                    <td>
                                        <select class="pagination-page-list" v-model="wuliaoData.pagePerNum">
                                            <option value="5">5</option>
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
                                        <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'1')"></a>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'1')"></a>
                                    </td>
                                    <td>
                                            <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <span  class="pagination-title" style="padding-left:5px;">第</span>
                                    </td>
                                    <td>
                                            <input class="pagination-num" type="text" v-model="wuliaoData.currentPage">
                                    </td>
                                    <td>
                                        <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(wuliaoData.total/wuliaoData.pagePerNum)}}页</span>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'1')"></a>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'1')"></a>
                                    </td>
                                    <td>
                                        <div class="pagination-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" @click="viewDetail(this.selectedmanifestId)" class="btn-refresh btn-TAB"></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="pagination-info pagination-title" v-text="'显示1到'+wuliaoData.pagePerNum+',共'+wuliaoData.total+'记录'"></div>
                        <div style="clear:both;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="请选择需要出量的单体或场地" :visible="createMonomer.show" @close="createCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">单体或场地 :</label>
                        <span>
                             <el-select v-model="createMonomer.holderId" placeholder="请选择">
                                <el-option
                                :label="SitesList.name+'(场地)'"
                                :id="SitesList.id+'_id'"
                                 data-type="1"
                                 :data-name="SitesList.name"
                                :value="SitesList.id">
                                </el-option>
                                <el-option
                                    v-for="item in MonomerList"
                                    :key="item.value"
                                    :id="item.ID+'_id'"
                                    data-type="2"
                                     :data-name="item.Name"
                                    :label="item.Name+'(单体)'"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="createConfirm">确定</button>
                    <button class="editBtnC" @click="createCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog :title="uploadExcelTitle" :visible="uploadshow" @close="upImgCancle">
                <div class="editBody" v-if="uploadStep == 1">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectImg">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput"  type="file"  @change="fileChanged($event)" ref="file"  id="fileInfo">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                </div>
                <div slot="footer" class="dialog-footer"  v-if="uploadStep == 1">
                    <button class="editBtnS" @click="uploadIMG">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
                 <div class="editBody"  v-if="uploadStep == 2">
                    <div class="editBodyone edit-item clearfix">
                        <label class="editInpText">选择工作表 :</label>
                        <select  class="editSelect" v-model="codeType" >
                            <option v-for="(item,index) in codeTypeData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">产品明细数量 :</label>
                        <input class="inp" maxlength='2' placeholder="请输入" v-model="productNum" disabled/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer"  v-if="uploadStep == 2">
                    <button class="editBtnS" @click="setColumn = true">设置列</button>
                    <button class="editBtnC" @click="upImgCancle">结束</button>
                </div>
            </el-dialog>
              <el-dialog title="常用短语" :visible="setColumn" @close="setColumnCancle">
                <div class="editBody" style="max-height: 402px;overflow-y: auto;margin: 40px; margin-bottom: 0px;">
                    <div>
                    <table class="UserList" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th style="width:150px;">原列明</th>
                                <th style="min-width:328px;">导入后列名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in columns" :key="index" >
                                <td>
                                    <span v-text="item.name"></span>
                                </td>
                                <td style="    position: relative;">
                                    <select  class="editSelect" v-model="item.selectVal" style="width: 395px;">
                                        <option value="不导入">不导入</option>
                                        <option  v-for="(val,key) in  DefaultColumns" :key="key" :value="val.name" v-text="val.name"></option>
                                    </select>
                                     <i class="icon-sanjiao" style="top: 20px;right: 15px;"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="examineData">校验数据</button>
                    <button class="editBtnC" @click="setColumnCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="数据概况" :visible="showColumn" @close="importCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">可识别的物料量条目数 :</label>
                        <span v-text="identifiableItemsCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">不可识别的物料量行数 :</label>
                        <span v-text="underidentifiedItemsCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">单价为零的条目数 :</label>
                        <span v-text="priceZero"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">数量为零的条目数 :</label>
                        <span v-text="countZero"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">产品总数量 :</label>
                        <span v-text="totalCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">产品总价格 :</label>
                        <span v-text="totalPrice"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText" style="    margin-left: 94px;width:auto;margin-right:20px;">清单名称 :</label>
                        <input class="inp"  style="width: 335px;" placeholder="请输入" v-model="listName"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importProductData">确认导入</button>
                    <button class="editBtnC" @click="importCancle">取消</button>
                </div>
            </el-dialog>
            <!--由李从文增加-->
            <el-dialog title="新建可追溯物料量清单" :visible="editBySelfShow" @close="customCancle">
                <div class="project1 project">
                    <div class="projectTitle">
                        <div class="projectTitleLeft">
                            <el-radio>清单名称关键字：</el-radio>
                            <div class="titleDiv">
                                <input class="projectTitleLeftinp" v-model="newList.detailName"/>
                            </div>
                            <span class="yewulaiyuan">业务来源：</span>
                            <div class="titleDiv">
                                <select class="projectTitleLeftinp" v-model="newList.sourceFrom">
                                    <option value="0">全部</option>
                                    <option value="1">进度计划-任务核实</option>
                                    <option value="2">文档管理-关联构件</option>
                                    <option value="3">成本管理-报表快照</option>
                                </select>
                                <i class="downAngle"></i>
                            </div>
                        </div>
                        <div class="projectTitleRight">
                            <el-radio>创建时间：</el-radio>
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
                                <select class="projectTitleLeftinp" v-model="newList.sourceState">
                                    <option value="0">全部</option>
                                    <option value="1">构件量核对完成</option>
                                    <option value="2">已计划</option>
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
                        <button class="selectsence" @click="selectScence">场景选择</button>
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
                                <tr v-for="(item,index) in  customData" :key="index">
                                    <td>
                                        <input type="checkbox" v-model="item.isChecked"/>
                                    </td>
                                    <td>{{item.type_c}}</td>
                                    <td>{{item.detailId}}</td>
                                    <td>{{item.detailName}}</td>
                                    <td>{{item.componentCount}}</td>
                                    <td>{{item.relaType_c}}</td>
                                    <td></td>
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
                                            <a href="javascript:void(0)" @click="reSearchResult" class="btn-refresh btn-TAB"></a>
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
            <el-dialog title="校验结果" :visible="shureToImportshow" @close="createCancle">
                <div class="editBody">
                    <p v-for="(item,index) in jiapyanResult" :key="index">{{item}}</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="sureToImport">确定导入</button>
                    <button class="editBtnC" @click="notSureToImport">取消导入</button>
                </div>
            </el-dialog>
            <el-dialog title="数据概况" :visible="shujugaikuangshow" @close="shujuNotSure" class="shuju">
                <div class="editBody shujugaikuang">
                    <p><label>新建创建可追溯的物料量清单结果统计:</label><span></span></p>
                    <p><label>待导入的构件的总数:</label><span>{{checkedResults.totalCount}}</span></p>
                    <p><label>可出物料量的构件数:</label><span>{{checkedResults.hasOut}}</span></p>
                    <p><label>可出物料量条目数:</label><span>{{checkedResults.itemsCount}}</span></p>
                    <p><label>可出物料量总价:</label><span>{{checkedResults.totalPrice}}</span></p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="shujuSure">确定导入</button>
                    <button class="editBtnC" @click="shujuNotSure">取消导入</button>
                </div>
            </el-dialog>
            <el-dialog title="产品类型和实例选型" :visible="productShow" @close="productShowCancel">
                <div class="editBody productList">
                    <table class="UserList" border="1" width="100%">
                        <thead>
                            <tr class="userList-thead">
                                <th>品牌</th>
                                <th>名称</th>
                                <th>规格</th>
                                <th>价格</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td v-text="selcetNewModelObj.brand"></td>
                                <td v-text="selcetNewModelObj.productName"></td>
                                <td v-text="selcetNewModelObj.specificationParameter"></td>
                                <td v-text="selcetNewModelObj.referencePrice"></td>
                                <td >
                                    <button class="changeProducticon" title="更换产品"  @click="changeProduct()" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="productShowSure">确定</button>
                    <button class="editBtnC" @click="productShowCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="更换产品实例" :visible="changeproductShow" @close="changeproductShowCancel">
                <div class="editBody productList">
                    <table class="UserList" border="1" width="100%">
                        <thead>
                            <tr class="userList-thead">
                                <th>默认</th>
                                <th>品牌</th>
                                <th>名称</th>
                                <th>规格</th>
                                <th>价格</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in changeProductData" :key="index">
                                <td>
                                    <input type="radio" name="selectProductRadio" :value="item.productId" :checked="item._isDefault"/>
                                </td>
                                <td v-text="item.brand"></td>
                                <td v-text="item.productName"></td>
                                <td v-text="item.specificationParameter"></td>
                                <td v-text="item.referencePrice"></td>
                                
                            </tr>
                        </tbody>
                    </table>
                    <p class="changedatabottom">
                        <el-checkbox v-model="changeAll">更新相同产品类型的全部实例</el-checkbox>
                    </p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="changeproductShowSure">确定</button>
                    <button class="editBtnC" @click="changeproductShowCancel">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import commonList from  './qingDan.vue'
import commonDetial from  './detial.vue'
export default {
  name:'DesignVersion',
  components:{commonList,commonDetial},
  data(){
        return{
            token:'',
            projId:'',
            BDMSUrl:'',
            loading:false,
            fullscreenloading:false,
            S_quantitiesList:[],//构件的实时报表
             D_quantitiesList:[],//快照报表
            pageDetial:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageDetial_1:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            wuliaoData:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            createMonomer:{
                show:false,
                holderId:'',
            },
            SitesList:{},//场地选项
            MonomerList:[],//单体选选项
            showCommonList:false,
            checkItem:{},
            uploadshow:false,
            setColumn:false,
            showColumn:false,
            imageName:'未选择任何文件',
            filesList:[],
            uploadExcelTitle:'导入独立物料量清单',
            codeType:'',
            codeTypeData:[],
            productNum:0,
            uploadStep:1,
            columns:[],
            DefaultColumns:[
                {
                    name:'类型编码',
                    value:1
                },
                 {
                    name:'名称',
                    value:3
                },
                  {
                    name:'参考价格',
                    value:5
                },
                 {
                    name:'数量',
                    value:7
                },
                  {
                    name:'标记',
                    value:8
                },
                 {
                    name:'品牌',
                    value:2
                },
                  {
                    name:'规格参数',
                    value:4
                },
                 {
                    name:'计量单位',
                    value:6
                },
                 {
                    name:'供货单位',
                    value:8
                },
            ],
            tempFilePath:'',
            identifiableItemsCount:'',
            underidentifiedItemsCount:'',
            priceZero:'',
            countZero:'',
            totalCount:'',
            totalPrice:'',
            listName:'',
            showCommonDetial:false,//显示隐藏 公共明细 页面
            editBySelfShow:false,
            newList:{
                detailName:'',
                sourceFrom:'0',
                dataRange:[],
                sourceState:'0',
            },
            customData:[],
            customPageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            jiapyanResult:'',
            shureToImportshow:false,
            checkedResults:{},
            shujugaikuangshow:false,
            selcetedItem:{},
            duliWuliaoObj:{
                show:false,
            },
            tableColumns: [
                {
                    label: '产品类型',
                    prop: 'productType',
                    minWidth: '260px',
                },
                {
                    label: '产品ID',
                    prop: 'id',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '产品名称',
                    prop: 'productName',
                    align:"center",
                    headerAlign:"center"  
                },
                {
                    label: '品牌',
                    prop: 'brand',
                    align:"center",
                    headerAlign:"center" ,
                    width: '205px', 
                },
                {
                    label: '规格参数',
                    prop: 'specificationParameter',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '数量',
                    prop: 'totalCount',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '单位',
                    prop: 'unit',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '单价',
                    prop: 'referencePrice',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '总价',
                    prop: '_totalProce',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    minWidth:'125px',
                    align:"center",
                    headerAlign:"center" 
                }
            ],
            props: {
                stripe: true,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: false,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
            }, 
            mappingData:[],
            wuliaoDetailName:'',
            productShow:false,
            selcetNewModelObj:{},
            changeproductShow:false,
            changeProductData:[],
            changeAll:false,
            selectedmanifestId:{},
        }
    },
    created(){
        var vm = this;
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.getinventoryDetail();
    },
    mounted(){
        var vm = this;
    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.getSnapWorkAmountList()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.getSnapWorkAmountList()
        },
        'pageDetial_1.currentPage':function(val,oldval){
            var vm = this
            vm.getSingleWorkAmountList()
        },
        'pageDetial_1.pagePerNum':function(val,oldval){
            var vm = this
            vm.getSingleWorkAmountList()
        },
        'customPageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.addNewWuliao()
        },
        'customPageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.addNewWuliao()
        },
        'wuliaoData.currentPage':function(val,oldval){
            this.viewDetail(this.selectedmanifestId);
        },
        'wuliaoData.pagePerNum':function(val,oldval){
           this.viewDetail(this.selectedmanifestId);
        }
    },
    methods:{
        selectImg(){
             this.$refs.file.click()
        },
        setColumnCancle(){
            var vm = this
            vm.setColumn = false
        },
        importCancle(){
            var vm = this
            vm.uploadshow = false
            vm.showColumn = false
            vm.setColumn = false
            vm.columns = []
            vm.identifiableItemsCount = ''
            vm.underidentifiedItemsCount = ''
            vm.priceZero = ''
            vm.countZero = ''
            vm.totalCount = ''
            vm.totalPrice = ''
            vm.listName = ''
        },
        importProductData(){
            var vm = this
            vm.setColumn = false
            if(vm.listName == ''){
                 vm.$message({
                    type:'warning',
                    message:'请填写清单名称！'
                })
                 return 
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl + 'project2/report/importProductData',
                headers:{
                   token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    materialDetailName:vm.listName,//
                    totalProduct:vm.totalCount,
                    totalPrice:vm.totalPrice,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.upImgCancle();
                    vm.importCancle();
                    this.getSingleWorkAmountList();
                }else{
                    vm.$message({
                        type:'warning',
                        message:response.data.msg
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        examineData(){
            var vm = this
            var form = new Array()
            var arr = []
            vm.columns.forEach(element => {
                if(element.selectVal != '不导入'){
                    form.push({
                        mappedName:element.selectVal,
                        origName:element.name
                    })
                    arr.push(element.selectVal)
                }
            })  
            if (vm.isRepeat(form)) {
                 vm.$message({
                    type:'warning',
                    message:vm.isRepeat(form)+'列名重复！'
                })
                return;
            }
            if ($.inArray("类型编码", arr) == -1 || $.inArray("名称", arr) == -1 ||
                $.inArray("参考价格", arr) == -1 || $.inArray("数量", arr) == -1) {
                 vm.$message({
                   type:'warning',
                   message:'类型编码，名称，参考价格，数量四项为必选项！'
               })
                return;
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl + 'project2/report/verifyProductLibData',
                headers:{
                   token:vm.token
                },
                params:{
                    projId:vm.projId,
                    tempFilePath:vm.tempFilePath,//
                    sheetName:vm.codeType
                },
                data:form
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.setColumn = false
                    vm.$confirm('所有数据校验通过！！！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '返回',
                        type: 'warning'
                    }).then(() => {
                        vm.showColumn = true
                        vm.identifiableItemsCount = response.data.rt.dataProfiling.identifiedMaterial
                        vm.underidentifiedItemsCount = response.data.rt.dataProfiling.underidentifiedMaterial
                        vm.priceZero = response.data.rt.dataProfiling.priceZero
                        vm.countZero = response.data.rt.dataProfiling.countZero
                        vm.totalCount = response.data.rt.dataProfiling.productTotalCount
                        vm.totalPrice = response.data.rt.dataProfiling.totalPrice
                    }).catch(() => {
                        vm.setColumn = true   
                    });
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        uploadIMG(){
            var vm = this
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
           if(vm.filesList == null){
               vm.$message({
                   type:'error',
                   message:'请指定需要上传的Excel文件！'
               })
               return false
           }
           var form  = new FormData
           form.append(
               'filedata',vm.filesList
           )
           vm.tempFilePath = ''
            axios({
                method:'POST',
                url:vm.BDMSUrl + 'project2/report/uploadFile',
                headers:{
                   token:vm.token
                },
                params:{
                    projId:vm.projId,
                    type:20,//
                },
                data:form
            }).then((response)=>{
                vm.codeTypeData = []
                vm.columns = []
                if(response.data.rt){
                   vm.uploadStep = 2
                    vm.uploadExcelTitle = 'EXCEL方式导入'
                    vm.codeType = response.data.rt.title[0].sheetName
                    vm.codeTypeData.push(response.data.rt.title[0].sheetName)
                     vm.tempFilePath = response.data.msg
                    vm.productNum = (response.data.rt.title[0].maxRow - 1) < 0 ? 0 : response.data.rt.title[0].maxRow - 1
                    response.data.rt.title[0].sheetTile.forEach(element => {
                        vm.columns.push({
                            name:element,
                            selectVal:'不导入'
                        })
                    })  
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        upImgCancle(){
            var vm = this
             vm.uploadshow  = false
             vm.imageName = '未选择任何文件'
             vm.filesList = null

            vm.uploadStep = 1
            vm.uploadExcelTitle = '导入独立物料量清单'
            vm.codeType = ''
            vm.codeTypeData = []
            vm.productNum = 0
        },
        fileChanged(file){
            var vm = this
            vm.filesList = vm.$refs.file.files[0] //[]
            vm.imageName = vm.filesList.name
        },
        importExcel(){
            var vm  = this
            vm.uploadshow  =true
        },
        backToH(){
            var vm = this
            vm.showCommonList = false
            vm.showCommonDetial = false
        },
        showlist(val){
            var vm = this
            vm.showCommonList = true
            vm.checkItem = val
        },
        showDetial(val){
            var vm = this
            vm.showCommonDetial = true
            vm.checkItem = val
        },
        createConfirm(){
            var vm = this
            if(vm.createMonomer.holderId == ''){
                vm.$message({
                    type:'warning',
                    message:'请选择一个场地或单体!'
                })
                return false
            }else{
                var buildName = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.name
                var cType = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.type
            }
            vm.fullscreenloading =true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/generateBuildWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    holderId:vm.createMonomer.holderId,
                    buildName:buildName,
                    cType:cType,//1：场地； 2：单体
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.getSnapWorkAmountList()
                    vm.createCancle()
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenloading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        generateBuildWorkAmount(){
            var vm = this
            vm.createMonomer.show = true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSiteInfo',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.SitesList = response.data.rt
                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/findSubProject/'+vm.projId,
                    headers:{
                        token:vm.token
                    },
                }).then(response=>{
                    if(response.data.cd == 0){
                         if(response.data.rt.rows    != null)vm.MonomerList = response.data.rt.rows
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        },
        createCancle(){
            var vm = this
            vm.createMonomer.show = false
            vm.createMonomer.holderId = ''
        },
        reCalculate(mid){
            var vm = this
            vm.fullscreenloading = true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/reCalculateWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    mId:mid,
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){

                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/report/handleWorkAmountCore',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        mId:mid,
                        projId:vm.projId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        vm.getSnapWorkAmountList()
                        vm.fullscreenloading = false
                    }
                })
            })
        },
        deleteItem(mid,bid,istop){
            var vm = this
            vm.$confirm('您要删除当前所选物料量清单？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/report/deleteMaterialDetail',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        manifestId:mid,
                        bId:bid,
                    }
                }).then(response=>{
                    if(response.data.cd != '0'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        var msg = ''
                        if(istop){
                            msg = '删除可追溯的物料量清单成功！'
                            vm.getSnapWorkAmountList()
                        }else{
                             msg = '删除可独立的物料量清单成功!'
                            vm.getSingleWorkAmountList()
                        }
                        vm.$message({
                            type:'success',
                            message:msg
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
        //进入设计版本页面
        getinventoryDetail(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/materialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd != '0'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).then(()=>{
                vm.getSnapWorkAmountList()
                vm.getSingleWorkAmountList()
            })
        },
        //加载实时报表数据
        getSnapWorkAmountList(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/loadMaterialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial.currentPage,
                    pageSize:vm.pageDetial.pagePerNum,
                    type:1//1 加载可追溯物料量清单 2 加载独立的物料量清单
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm.S_quantitiesList = response.data.rt.rows
                        }else{
                            vm.S_quantitiesList = []
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
        //加载快照报表数据
        getSingleWorkAmountList(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/loadMaterialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial_1.currentPage,
                    pageSize:vm.pageDetial_1.pagePerNum,
                    type:2//1 加载可追溯物料量清单 2 加载独立的物料量清单
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial_1.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm.D_quantitiesList = response.data.rt.rows
                        }else{
                            vm.D_quantitiesList = []
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
        initName(name){
            if(!name)return ''
            var tt = name.substring(name.indexOf("[") + 1, name.lastIndexOf("]"))
            return tt;
        },
         initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
        /*
        * 判断数组中是否有重复的值
        * @return:
        * 		TRUE：表示有重复的值；
        * 		FALSE：表示没有重复的值。
        */
        isRepeat(arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i].mappedName]) return hash[arr[i].mappedName];
                hash[arr[i].mappedName] = arr[i].mappedName;
            }
            return false;
        },
        /*
        *下面的代码由李从文增加，上面的代码本来又付伟超写的。
        */
        //新增可追溯物料量清单
        addNewWuliao(){            
            this.reSearchResult(false);
            this.editBySelfShow = true;
        },
        //确认新增
        customConfirm(){
            let num = 0;
            this.selcetedItem ={};
            this.customData.forEach(item=>{
                if(item.isChecked == true){
                    num+=1;
                    this.selcetedItem = item;
                }
            })
            if(num == 1){
                let formData = new FormData();
                formData.append('detailId',this.selcetedItem.detailId);
                formData.append('relaType',this.selcetedItem.relaType);
                formData.append('projectId',this.projId);
                formData.append('componentCount',this.selcetedItem.componentCount);
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/verifyAddMaterialDetail',
                    headers:{
                        token:this.token
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.editBySelfShow = false;
                        this.checkedResults = response.data.rt.dataProfiling;
                        if(JSON.stringify(response.data.rt.checkResults)=='{}'){
                            this.jiapyanResult = '所有数据校验通过!';
                        }else{
                            this.jiapyanResult = response.data.rt.checkResults.verifyClassifyCode;
                        }
                        this.shureToImportshow = true;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }else if(num == 0){
                alert('请选择要导入的清单！');
            }else{
                alert('只能选择一个导入的清单！');
            }
        },
        //确认导入
        sureToImport(){
            this.shureToImportshow = false;
            this.shujugaikuangshow = true;
        },
        //取消导入
        notSureToImport(){
            this.shureToImportshow = false;
            this.addNewWuliao();
        },
        shujuSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/addMaterialDetail',
                headers:{
                    token:this.token
                },
                params:{
                    detailId:this.selcetedItem.detailId,
                    relaType:this.selcetedItem.relaType,
                    projectId:this.projId,
                    componentCount:this.selcetedItem.componentCount
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getSnapWorkAmountList();
                    this.shujugaikuangshow = false;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        shujuNotSure(){
            this.shujugaikuangshow = false;
        },
        //取消新增
        customCancle(){
            this.editBySelfShow = false;
        },
        reSearchResult(flag){
            let rangeData = [];
            this.newList.dataRange.forEach(item=>{
                rangeData.push(new Date(item).toLocaleString().split(' ')[0]);
            });
            if(flag){
                this.customPageDetial.currentPage =1;
            }
            let formData = new FormData();
            formData.append('detailName',this.newList.detailName|| '');
            formData.append('startDate',rangeData[0] || '');
            formData.append('endDate',rangeData[1] || '');
            formData.append('serviceState',this.newList.sourceState);
            formData.append('relaType',this.newList.sourceFrom);
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
                    type:1
                },
                data:formData
            }).then(response=>{
                if(response.data.cd == 0){
                    this.customData = response.data.rt.rows;
                    this.customPageDetial.total = response.data.rt.total;
                    var type_c = '';
                    var relaType_c ='';
                    if(this.customData!=null && this.customData.length!=0){
                        this.customData.forEach((item,index)=>{
                            if(item.type == 1){
                                type_c = '构件量清单';
                            }else if(item.type == 2){
                                type_c = '工程量清单';
                            }else if(item.type == 3){
                                type_c = '物料量清单';
                            }
                            if(item.relaType == 2){
                                relaType_c = '进度计划-任务核实';
                            }else if(item.relaType == 1){
                                relaType_c = "文档管理-关联构件" ;
                            }else if(item.relaType == 7){
                                relaType_c = "成本管理-报表快照" ;
                            }
                            Object.assign(item,{
                                type_c:type_c,
                                relaType_c:relaType_c,
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
        //场景选择
        selectScence(){
            alert("请打开右侧面板!");
        },
        //查看独立物料量清单详情
        viewDetail(val){
            this.duliWuliaoObj.show = true;
            this.showCommonDetial = false;
            this.showCommonList = false;
            this.wuliaoDetailName = val.detailName;
            this.selectedmanifestId = val;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/listMaterialComponent',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    detailId:val.id,
                    page:this.wuliaoData.currentPage,
                    rows:this.wuliaoData.pagePerNum
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.mappingData = response.data.rt.rows;
                    console.log(this.mappingData);
                    this.wuliaoData.total = response.data.rt.total;
                    let parentArr = [];
                    let childrenArr = [];
                    if(this.mappingData !=null && this.mappingData.length!=0){
                        this.mappingData.forEach(item=>{
                            Object.assign(item,{
                                _totalProce:item.totalCount*item.referencePrice,
                            })
                            if(item._parentId == 0){
                                parentArr.push(item);
                            }else{
                                childrenArr.push(item);
                            }
                        })
                    }
                    parentArr.forEach(item=>{
                        Object.assign(item,{
                            children:[],
                        })
                    })
                    for(let i = 0;i<parentArr.length;i++){
                        for(let j = 0 ;j<childrenArr.length;j++){
                            if(childrenArr[j]._parentId === parentArr[i]._id){
                                parentArr[i].children.push(childrenArr[j]);
                            }   
                        }
                    }
                    this.mappingData = parentArr;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        backToOrign(){
            this.duliWuliaoObj.show = false;
        },
        //重新选型
        selcetNewModel(scope){
            this.selcetNewModelObj = scope.row;
            this.productShow = true;
        },
        productShowSure(){
            this.productShow = false;
        },
        productShowCancel(){
            this.productShow = false;
        },
        //更换产品
        changeProduct(){
            this.changeproductShow = true;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/getProductsByProductType',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    productType:this.selcetNewModelObj.materialClassifyCode
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.changeProductData = response.data.rt;
                    this.changeProductData.forEach(item=>{
                        if(item.productId == this.selcetNewModelObj.relaId){
                            Object.assign(item,{
                                _isDefault:true,
                            })
                        }else{
                            Object.assign(item,{
                                _isDefault:false,
                            })
                        }
                    })
                }else{
                    alert('response.data.msg');
                }
            })
        },
        changeproductShowSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/changeProduct',
                headers:{
                    token:this.token
                },
                params:{
                    whetherSelectAll:this.changeAll,
                    detailId:this.selcetNewModelObj.id,
                    productId:this.selcetNewModelObj.relaId,
                    manifestId:this.selectedmanifestId.id,
                    projectId:this.projId,
                    productTypeCode:this.selcetNewModelObj.productTypeCode,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.viewDetail(this.selectedmanifestId);
                    this.changeproductShow = false;
                    this.productShow = false;
                }else{
                    alert(response.data.msg);
                }
            })
            
        },
        changeproductShowCancel(){
            this.changeproductShow = false;
        },
    }
}
</script>
<style lang="less">
    #inventory{
        .el-dialog{
            margin: 0 auto;
        }
        .actionBtn{
            width: 16px;
            height: 17px;
            border: none;
            cursor: pointer;
            margin-right: 10px;
        }
        .changeProducticon{
            background: url('./images/changeproduct.png') no-repeat;
            width: 15px;
            height: 12px;
            border: none;
            cursor: pointer;
            margin-right: 10px;
        }
        .duliWuliao{
            margin: 0 20px;
            .antsLine {
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                .icon-sanjiao-right {
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image: url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }
                .strong {
                    cursor: pointer;
                    color: #333333;
                    font-weight: bold;
                    &:last-of-type .icon-sanjiao-right {
                    display: none;
                    }
                }
            }
        }
        .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            overflow: auto;
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
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
                    overflow: hidden;
                    .singelOne{
                        float: left;
                        color: #999;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                    }
                }
        }
        .selectOption{
            position: relative;
            width: 212px;
            float: left;
            select{
                height: 28px;
                width: 212px;
                border-radius: 28px;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 10px;
                border: 1px solid #ccc;
            }
            .icon-sanjiaoone{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image:url('../ManageDesign/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 13px;
                left: 180px;
            }
        }
         .project{
            margin: 25px 20px 0 20px;
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
                    cursor: pointer;
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
                        .editBtn{
                            background: url('../../assets/edit.png') no-repeat;
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
                        .detailBtn{
                              background: url('./images/details.png') no-repeat;
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
        #edit{
            #fileInfo{
                display: none;
            }
            .imageBody {
                text-align: left;
            }
            .changedatabottom{
                text-align: left;
                color: #999;
                font-size: 14px;
                line-height: 14px;
                margin-top: 10px;
                .el-checkbox__label{
                    margin-left: 8px;
                }
            }
            .imageBodyText {
                color: #666;
                font-size: 14px;
                line-height: 14px;
                font-weight: normal;
                display: inline-block;
                margin-right: 20px;
                margin-left: 94px;
                text-align: right;
            }
             .edit-item{
                position: relative;
                .inp{
                    float: left;
                    width: 505px;
                }
                .imageBodyText{
                    float: left;
                    width: 140px;
                    text-align: right;
                    padding-right: 20px;
                    height: 38px;
                    line-height: 38px;
                }
                .editSelect{
                    float: left;
                    width: 506px;
                    height: 40px;
                    padding: 10px;
                }
                .editInpText{
                    width: 100px;
                    text-align: right;
                    float: left;
                    height: 40px;
                    line-height: 40px;
                }
                .edit-item-biaoti{
                    display: block;
                    font-size: 12px;
                    color: #999999;
                    float: left;
                    line-height: 12px;
                    margin-left: 120px;
                    margin-top: 5px;
                    max-width: 300px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
             .UserList{
                max-height: 402px;
                overflow-y: auto;
                border-collapse: collapse;
                border: 1px solid #e1e1e1;
                thead{
                    border-bottom: 1px solid #e1e1e1;
                    background: #f3f3f3;
                    th{
                        height: 36px;
                        text-align: left;
                        font-size: 12px;
                        color: #999999;
                        font-weight: normal;
                        border-right: 1px solid #e1e1e1;
                        padding-left:10px!important; 
                    }
                }
                tbody{
                    tr{
                        td{
                            height: 36px;
                            text-align: left;
                            box-sizing: border-box;
                            font-size: 14px;
                            color: #333333;
                            border-bottom: 1px solid #e1e1e1;
                            border-right: 1px solid #e1e1e1;
                            padding-left:10px!important; 
                            .checkbox-fileItem{
                                display:block;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #cccccc;
                                cursor: pointer;
                                margin-left: 20px;
                            }
                            .active{
                                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                                border: 1px solid #fc3439;
                            }
                            img{
                                height: 18px;
                                float: left;
                                margin-right: 7px;
                            }
                        .deleteBtn{
                            display: block;
                            width: 16px;
                                height: 16px;
                                border: none;
                                cursor: pointer;
                                margin-right: 16px;
                                background: url('../../assets/delete.png') no-repeat;
                            }
                        }
                        &:hover{
                            background: #fafafa;
                            .icon-goujian{
                                display: inline-block;
                            }
                        }
                    }
                    tr:nth-child(2n){
                        td{
                            background: #f3f3f3;
                        }
                    }
                    .active{
                        border: none!important;
                        td{
                            background: #0081c2!important;
                        }
                    }
                }
            }
            .shuju{
                .el-dialog{
                    width: 398px;
                }
            }
            .shujugaikuang{
                margin: 0 32px;
                p{
                    margin-bottom: 24px;
                    
                }
                label{
                    color: #999;
                    display: inline-block;
                    width: 50%;
                    text-align: right;
                }
                span{
                    color: #333;
                    display: inline-block;
                    width: 47%;
                    text-align: left;
                    margin-left: 7px;
                }
            }
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        #edit{
            .productList{
                padding: 0 30px;
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
        }
        //zk-table组件样式
        .zk-table{
            color: #333333;
        }
        .zk-table--tree-icon{
            position: relative;
            width: 40px;
            display: inline-block;
            z-index: 10;
            background: #ffffff;
        }
        .zk-table--row-hover .zk-table--tree-icon{
            background: #ebf7ff;
        }
        .zk-table--tree-icon::after {
            display: block;
            position: absolute;
            top: 6px;
            left: 20px;
            width: 15px;
            height: 12px;
            background:url('./images/folder_1.png')no-repeat 0 0; 
            content: '';
        }
        .zk-icon-minus-square-o::after{
            background:url('./images/folder.png')no-repeat 0 0; 
        }
        .zk-table__body-row>td:first-of-type{
            width: 45px;
        }
        .zk-table--level-4-cell,.zk-table--level-3-cell,.zk-table--level-2-cell,.zk-table--level-1-cell,.zk-table--level-5-cell{
            position: relative;
        }
        .zk-table--level-4-cell::before,.zk-table--level-3-cell::before,.zk-table--level-2-cell::before,.zk-table--level-1-cell::before,.zk-table--level-5-cell::before{
            display: block;
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 14px;
            background:url('./images/file.png')no-repeat 0 0; 
            content: '';
            z-index: 1;
        }
    }
</style>




