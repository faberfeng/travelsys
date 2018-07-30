<template>
    <div  id="quantitiesList" v-loading.fullscreen="fullscreenloading">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item ">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item label-item-active">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item">  
                    物料量清单  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本审批  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本分析  
                </router-link>
            </div>
            <div class="project" v-loading="loading" v-if='showMainProject'>
                <!--以下是实时列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left" style="top:24px;">
                            <i class="target icon"></i>实时可追溯工程量清单
                        </span>
                        <span class="item-btn clearfix">
                            <label @click="configMapping">配置映射</label>
                            <label @click="generateBuildWorkAmount()">新建单体清单</label>
                            <label @click="showExtension()">新建自定义清单</label>
                        </span>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单名称</th>
                                <th>构件数量</th>
                                <th>已出工程量的构件数量</th>
                                <th>工程量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  S_quantitiesList" :key="index">
                                <td v-text="val.manifestId"></td>
                                <td v-text="initName(val.name)"></td>
                                <td v-text="val.componentNum"></td>
                                <td v-text="val.gifWorkAmount"></td>
                                <td v-text="val.workAmountNum"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createTime)"></td>
                                <td v-if="val.HasbId">
                                    <button class="detailBtn actionBtn" title="明细"  @click="viewDetail(val)" ></button>
                                    <button class="listBtn actionBtn" title="清单"  @click="viewList(val)" ></button>
                                    <button class="refreshBtn actionBtn" title="刷新"  @click="reCalculate(val.manifestId,index)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.manifestId,val.bId,true)" ></button>
                                </td>
                                 <td v-else>
                                     <a href="javascript:void(0);" style="text-decoration: none;">正在生成工程量，请耐心等待...</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无实时报表
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
                            <i class="reportS icon"></i>独立工程量清单
                        </span>
                        <a class="right" href="javascript:void(0)" @click="importExcel">导入Excel</a>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单名称</th>
                                <th>工程量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  D_quantitiesList" :key="index">
                                <td v-text="val.manifestId"></td>
                                <td v-text="val.name"></td>
                                <td v-text="val.workAmountNum"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createTime)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="showSnapWorkAmouontDetail(val,2)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.manifestId,2)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" D_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无快照报表
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" D_quantitiesList.length>0" style="margin-bottom:30px">
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
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'2')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'2')"></a>
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
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'2')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'2')"></a>
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

            <div class="worktable project" v-if='showDetail'>
                <div class="antsLine">
                     成本管理
                    <i class="icon-sanjiao-right"></i>
                    <a class="backToProjectBtn" @click="backToProject">工程量清单</a>
                    <i class="icon-sanjiao-right"></i>
                    <span class="strong" @click="back()" v-text="viewProjectDetail.viewDetailName"></span>
                </div>
                <div class="worktableTitle">
                    <div class="worktableTitleLeft">
                        <i class="icon-detail"></i>
                        工程量明细
                    </div>
                    <div class="worktableTitleRight">
                        <span @click="threePrice">
                            <img src="./images/sanjia.png"/><label>三价</label>
                        </span>
                        <span @click="importDanjia"><img src="./images/exportprice.png"/><label>导入单价</label></span>
                        <span @click="exportExcel"><img src="./images/exportexcel.png"/><label>导出Excel</label></span>
                        <span @click="exportXml"><img src="./images/exportxml.png"/><label>导出xml</label></span>
                        <span @click="printObject"><img src="./images/print.png"/><label>打印</label></span>
                    </div>
                </div>
                <div v-if="codingList != null">
                    <zk-table 
                        index-text="序号"
                        :data="codingList" :columns="columns" :tree-type="props.treeType"
                        :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                        :border="props.border" empty-text="正在加载...">
                        <template slot="action" slot-scope="scope">
                            <button class="detailBtn actionBtn" title="明细" v-if="scope.row.level == 4" @click="viewDetailThing(scope)"></button>
                            <button class="editBtn actionBtn" title="编辑" v-if="scope.row.level == 5" @click="editDetailPrice(scope)"></button>
                        </template> 
                    </zk-table>
                </div>
                
            </div>
            <!-- 独立工程量清单 -->
            <div class="project worktable" v-if="duliProject.showProject">
                <p class="antsLine">
                    成本管理
                    <i class="icon-sanjiao-right"></i>
                    <a class="backToProjectBtn" @click="backToProject">工程量清单</a>
                    <i class="icon-sanjiao-right"></i>
                    <span class="strong" @click="back()">{{duliProject.name}}</span>
                </p>
                <zk-table index-text="序号" :data="duliProject.data" :columns="columnsDuli" :tree-type="props.treeType"
                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                    :border="props.border" empty-text="正在加载...">
                    <template slot="action" slot-scope="scope">
                        <button class="editBtn actionBtn" title="修改" @click="editListBtn(scope)" v-if="scope.row.level == 4"></button>
                    </template> 
                </zk-table>
            </div>
            <!-- 查看清单列表 -->
            <div class="project" v-if="listItem.showProject">
                <common-list @back="backToProject"  :title="'工程量清单'" :isGongChengLiang='true' :manifestIdOne="listItem.viewDetailObj.manifestId"></common-list>
            </div>
            <!--工程量明细-->
            <div class="project" v-if="projList.showProject">
                <project-list @back="backToProject" :baseObj="projList.baseObj" :mId="viewDetailObject.manifestId"></project-list>
            </div>
        </div>

        <!-- dialog弹出框 -->
        <div id="edit">
            <el-dialog title="请选择需要出量的单体或场地" :visible="createMonomer.show" @close="createCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">单体或场地 :</label>
                        <span>
                             <el-select v-model="createMonomer.holderId" placeholder="请选择">
                                <el-option :label="SitesList.name+'(场地)'" :id="SitesList.id+'_id'" data-type="1" :data-name="SitesList.name"
                                :value="SitesList.id">
                                </el-option>
                                <el-option v-for="item in MonomerList" :key="item.value" :id="item.ID+'_id'" data-type="2" :data-name="item.Name"
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
            <el-dialog title="新建可追溯工程量清单" :visible="editBySelfShow" @close="customCancle">
                <div class="project1 project">
                    <div class="projectTitle">
                        <div class="projectTitleLeft">
                            <el-radio>清单名称关键字：</el-radio>
                            <div class="titleDiv">
                                <input class="projectTitleLeftinp" v-model="newList.detailName"/>
                            </div>
                            <span class="yewulaiyuan">业务来源：</span>
                            <div class="titleDiv">
                                <select class="projectTitleLeftinp" v-model="newList.soureFrom">
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
                                <select class="projectTitleLeftinp" v-model="newList.sourceSate">
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
                                            <a href="javascript:void(0)" @click="showExtension" class="btn-refresh btn-TAB"></a>
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
            <el-dialog title="三价配置" :visible="viewProjectDetail.showThreePrice" @close="showThreePriceCancel">
                <div>
                    <span>显示列</span>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[0]">内部价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[1]">导入价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[2]">参考价</el-checkbox>
                </div>
                <div class="threeP">
                    <button @click="copyInnerPriceToReferencePrice">将内部价复制到参考价</button>
                </div>
                <div class="threeP">
                    <button @click="copyImportPriceToReferencePrice">将导入价复制到参考价</button>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="showThreePriceCenter">确定</button>
                    <button class="editBtnC" @click="showThreePriceCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="请选择导出价" :visible="viewProjectDetail.exportExcelShow" @close="sexportExcelShowCancel">
                <div>
                    <span>导出价</span>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[0]">内部价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[1]">导入价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[2]">参考价</el-checkbox>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="exportExcelShowCenter">确定</button>
                    <button class="editBtnC" @click="sexportExcelShowCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改综合单价" :visible.sync="duliProject.editPrice" :before-close="duLiEditCancel">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">综合单价 :</label><input class="inp" placeholder="请输入" v-model="duliProject.totalPrice"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="duLiEditSure">确定</button>
                    <button class="editBtnC" @click="duLiEditCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改参考单价" :visible.sync="viewProjectDetail.editPrice" :before-close="detailEditCancel">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">参考单价 :</label><input class="inp danjia" placeholder="请输入" v-model="viewProjectDetail.rePrice"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="detailEditSure">确定</button>
                    <button class="editBtnC" @click="detailEditCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导入工程量清单" :visible.sync="duliProject.importExcelShow" :before-close="importExcelCancel">
                <div class="importprojectList">
                    <div class="importFile">
                        <label class=" imageBodyText">上传文件:</label>
                        <span class="upImgText">{{duliProject.fileName}}</span> 
                        <span class="updataImageSpan">
                            <button @click="selectfile" class="upImgBtn">浏览</button>
                            <input class="upInput"  type="file"  @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                    </div>
                    <div class="worklist">
                        <label class="worklisttite">工作表:</label>
                        <select class="editSelect">
                            <option value="" disabled selected hidden>请选择</option>
                            <option>{{duliProject.sheetName}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                    <div class="worklist">
                        <label class="worklisttite">编码列:</label>
                        <select class="editSelect" v-model="duliProject.codeline">
                            <option value="" disabled selected hidden>请选择</option>
                            <option v-for="(item,index) in duliProject.sheetTitle" :key="index">{{item}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                    <div class="projlist">
                        <label class="worklisttite">工程量列:</label>
                        <select class="editSelect" v-model="duliProject.projectline">
                            <option value="" disabled selected hidden>请选择</option>
                            <option v-for="(item,index) in duliProject.sheetTitle" :key="index">{{item}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                    <div class="projlistname">
                        <label class="worklisttite">清单名称:</label>
                        <input placeholder="请输入文本框" class="editSelect" v-model="duliProject.listProName"/>
                    </div>
                    <div class="worklist">
                        <label  class="worklisttite1">可识别的工程量条目数量 :</label>
                        <span>{{duliProject.verifiedObject.distinguished || 0}}条</span>
                    </div>
                    <div class="worklist">
                        <label class="worklisttite2">不可识别的工程量行数 :</label>
                        <span>{{duliProject.verifiedObject.enDistinguished || 0}}条</span>
                    </div>
                    <div class="worklist">
                        <label class="worklisttite3">工程量不为零的条目数量 :</label>
                        <span>{{duliProject.verifiedObject.workAmountNotZero || 0}}条</span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="verifiedData">识别数据</button>
                    <button class="editBtnC" @click="importExcelSure">导入</button>
                </div>
            </el-dialog>
            <el-dialog title="导入单价" :visible.sync="viewProjectDetail.importPriceShow" :before-close="importPriceCancel">
                <div class="importprojectList">
                    <div class="importFile">
                        <label class=" imageBodyText">上传文件:</label>
                        <span class="upImgText">{{viewProjectDetail.fileName}}</span>
                        <span class="updataImageSpan">
                            <button @click="selectimportfile" class="upImgBtn">选择文件</button>
                            <input class="upInput"  type="file"  @change="selectfileChanged" ref="fileimport" multiple="multiple">
                        </span> 
                    </div>
                    <div class="worklist">
                        <label class="worklisttite">工作表:</label>
                        <select class="editSelect">
                            <option value="" disabled selected hidden>请选择</option>
                            <option>{{viewProjectDetail.sheetName}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                    <div class="projlist1">
                        <label class="worklisttite">项目编码列:</label>
                        <select class="editSelect" v-model="viewProjectDetail.codeline">
                            <option value="" disabled selected hidden>请选择</option>
                            <option v-for="(item,index) in viewProjectDetail.sheetTitle" :key="index">{{item}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                    <div class="worklist">
                        <label class="worklisttite">单价列:</label>
                        <select class="editSelect" v-model="viewProjectDetail.projectline">
                            <option value="" disabled selected hidden>请选择</option>
                            <option v-for="(item,index) in viewProjectDetail.sheetTitle" :key="index">{{item}}</option>
                        </select>
                        <i class="downsaniao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importPriceSure">确定</button>
                    <button class="editBtnC" @click="importPriceCancel">结束</button>
                </div>
            </el-dialog>
            <el-dialog title="数据校验结果" :visible="viewProjectDetail.datadistinguishShow" @close="datadistinguishCancel">
                <div class="editBodytwo">
                    <ul class="distinguishUl"> 
                        <li v-for="(item,index) in viewProjectDetail.datadistinguishData" :key="index">{{item}}</li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="datadistinguishSure">确定导入</button>
                    <button class="editBtnC" @click="datadistinguishCancel">取消导入</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import commonList from './qingDan.vue'
import projectList from './projectList.vue'
export default {
    name:'DesignVersion',
    components:{
        commonList,projectList
    },
    data(){
        return{
            token:'',
            projId:'',
            BDMSUrl:'',
            loading:false,
            fullscreenloading:false,
            showMainProject:true,
            S_quantitiesList:[],//构件的实时报表
            D_quantitiesList:[],//快照报表
            pageDetial:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            customPageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageDetial_1:{
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
            editBySelfShow:false,
            customData:[],
            codingList:[],
            columns: [
                {
                    label: '序号',
                    prop: 'no',
                    minWidth: '260px',
                },
                {
                    label: '项目编码',
                    prop: 'number',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '项目名称',
                    prop: 'title',
                     
                    align:"center",
                    headerAlign:"center"  
                },
                {
                    label: '项目特征描述',
                    prop: 'description',
                    align:"center",
                    headerAlign:"center" ,
                    width: '205px', 
                },
                {
                    label: '工程量',
                    prop: 'amount',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '计量单位',
                    prop: 'unit',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '内部单价',
                    prop: 'price',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '导入单价',
                    prop: 'importPrice',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '内部合价',
                    prop: 'totalPrice',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '参考单价',
                    prop: 'referencePrice',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '参考合价',
                    prop: 'referenceTotalPrice',
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
            columnsDuli:[
                {
                    label: '序号',
                    prop: 'no',
                    minWidth: '260px',
                    headerAlign:"center"
                },
                {
                    label: '编码',
                    prop: 'number',
                    width: '185px',
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label: '项目名称',
                    prop: 'title',
                    width: '205px',  
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '工程量',
                    prop: 'amount',
                    width: '115px',
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label: '单位',
                    prop: 'unit',
                    width: '115px',
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label: '综合价格',
                    prop: 'price',
                    width: '115px',
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label: '价格',
                    prop: 'totalPrice',
                    width: '115px',
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    Width:'50px',
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
            showDetail:false,
            viewProjectDetail:{
                viewDetailName:'',
                showThreePrice:false,
                threePriceArr:[true,false,false],
                exportExcelShow:false,
                importPriceShow:false,
                editPrice:false,
                rePrice:'',
                editPriceData:{},
                fileList:[],
                fileName:'请选择文件',
                sheetName:'',
                excelInfo:{},
                sheetTitle:[],
                filePath:'',
                codeline:'',//编码列
                projectline:'',//工程列
                datadistinguishShow:false,//数据校验结果
                datadistinguishData:[]
            },//工程量明细
            viewDetailObject:{},
            duliProject:{
                showProject:false,
                name:'',
                data:[],
                editPrice:false,
                totalPrice:'',
                editPriceObject:{},
                AmouontDetail:{},
                fileName:'请选择文件',
                fileList:[],
                listProName:'',
                importExcelShow:false,
                excelInfo:{},
                sheetName:'',
                sheetTitle:[],
                filePath:'',
                codeline:'',//编码列
                projectline:'',//工程列
                verifiedObject:{}
            },
            listItem:{
                showProject:false,
                viewDetailObj:{}
            },
            projList:{
                showProject:false,
                baseObj:{}
            },
            newList:{
                dataRange:[],//日期区间
                detailName:'',//关键字
                soureFrom:'0',//业务来源
                sourceSate:'0',//业务状态
            },
            selectedItem:{}
            
        }
    },
    created(){
        var vm = this;
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.getInentityDetail();
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
            vm.showExtension()
        },
        'customPageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.showExtension()
        },
      
    },
    methods:{
        //配置映射
        configMapping(){
            this.$router.push({
                path:'/Cost/configmapping'
            })
        },
        //确认添加单体清单
        createConfirm(){
            var vm = this;
            if(vm.createMonomer.holderId == ''){
                vm.$message({
                    type:'warning',
                    message:'请选择一个场地或单体!'
                })
                return false;
            }else{
                var buildName = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.name;
                var cType = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.type;
            }
            vm.fullscreenloading =true;
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
                    var resData = response.data.rt;
                    axios({
                        method:'get',
                        url:vm.BDMSUrl+'project2/report/fromComponentListToEngineeringList',
                        headers:{
                            token:vm.token
                        },
                        params:{
                            mId:resData.pkId,
                            gsource:resData.mGSource,
                            bsource:resData.mBSource,
                            projId:vm.projId
                        }
                    }).then(response=>{
                        if(response.data.cd == 0){
                            vm.getSnapWorkAmountList();
                            vm.createCancle();
                            vm.fullscreenloading =false;
                        }else{
                            alert(response.data.msg);
                        }
                    })
                    
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                
            }).catch((err)=>{
                console.log(err)
            })
        },
        //取消添加单体清单
        createCancle(){
            var vm = this;
            vm.createMonomer.show = false;
            vm.createMonomer.holderId = '';
        },
        //新建单体清单
        generateBuildWorkAmount(){
            var vm = this
            vm.createMonomer.show = true;
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
                    vm.SitesList = response.data.rt;
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
                         if(response.data.rt.rows!= null){
                            vm.MonomerList = response.data.rt.rows;
                        }
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        },
        //新建自定义清单
        showExtension(){
            this.editBySelfShow = true;
            this.searchResult(false);
        },
        //确认
        customConfirm(){
            let num =0 ;
            this.selectedItem ={};
            this.customData.forEach((item,index)=>{
                if(item.isChecked == true){
                    num+= 1; 
                    this.selectedItem = item;
                }
            })
            if(num == 1){
                this.fromComponentListToEngineeringList(this.selectedItem.detailId, 3, this.selectedItem.relaType);
            }else if(num == 0){
                alert('请选择要导入的清单！');
            }else{
                alert('只能选择一个导入的清单！');
            }
        },
        //取消
        customCancle(){
            this.editBySelfShow = false;
        },
        /**
         * 将构件量转换成工程量
         * @param mId
        */
        fromComponentListToEngineeringList(mId, gsource, bsource){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/fromComponentListToEngineeringList',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId,
                    mId:mId,
                    gsource:gsource,
                    bsource:bsource
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.lodeSnapWorkAmountList();
                    this.reCalculate(response.data.rt,0);
                    this.editBySelfShow = false;
                }else if(response.data.cd == -1){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
                
            })
        },
        lodeSnapWorkAmountList(pageNo){
            pageNo = pageNo || 1;
            if (!pageNo || isNaN(pageNo) || pageNo < 1) return;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/getSnapWorkAmountList',
                headers:{
                    token:this.token
                },
                params:{
                    pageNo: pageNo,
                    pageSize: 5,
                    projectId: this.projId
                }

            }).then(response=>{
                if(response.data.cd == 0){
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },

        //场景选择
        selectScence(){
            alert('功能未完善！')
            return false;
        },
        reCalculate(mid,index){
            var vm = this
            vm.fullscreenloading = true
            vm.$set(vm.S_quantitiesList[index],'HasbId',false)
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
                     vm.fullscreenloading = false
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
                    }
                })
            })
        },

        deleteItem(mid,bid,istop){
            var vm = this
            vm.$confirm('确定要将清单与当前业务解除关联关系吗？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'/manifest2/deleteMBRelation',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        mId:mid,
                        bId:bid,
                        bType:3
                    }
                }).then(response=>{
                    if(response.data.cd != '0'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        vm.$message({
                            type:'success',
                            message:'清单删除成功!'
                        })
                        if(istop){
                            vm.getSnapWorkAmountList()
                        }else{
                            vm.getSingleWorkAmountList()
                        }
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
        getInentityDetail(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/workAmountList',
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
        //实时可追溯工程量清单
        getSnapWorkAmountList(){
            var vm = this;
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSnapWorkAmountList',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial.currentPage,
                    pageSize:vm.pageDetial.pagePerNum,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.total;
                        if(response.data.rt.rows != null){
                            vm.S_quantitiesList = response.data.rt.rows;
                            vm.S_quantitiesList.forEach((Element,index)=>{
                                if(Element.bId != null){
                                    vm.$set(Element,'HasbId',true)
                                }else{
                                     vm.reCalculate(Element.manifestId,index)
                                }
                            });
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
        //加载独立工程量清单
        getSingleWorkAmountList(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSingleWorkAmountList',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial_1.currentPage,
                    pageSize:vm.pageDetial_1.pagePerNum,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial_1.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm. D_quantitiesList = response.data.rt.rows
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
        //导入堵路工程量清单
        importExcel(){
            this.duliProject.importExcelShow = true;
        },
        selectfile(){
            this.$refs.file.click();
        },
        fileChanged(){
            let list = this.$refs.file.files;
            this.duliProject.fileList = list;
            if(list.length !== 0){
                this.duliProject.fileName = list[0].name;
            }
            if(this.duliProject.fileName.split('.')[1] != 'xls' && this.duliProject.fileName.split('.')[1] != 'xlsx'){
                alert("必须上传Excel文件!")
            }else{
                var formData =  new FormData();
                formData.append('filedata',list[0]);
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/uploadExcelFile',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.duliProject.excelInfo = response.data.rt;
                        this.duliProject.sheetName = response.data.rt.title[0].sheetName;
                        this.duliProject.sheetTitle = response.data.rt.title[0].sheetTile;
                        this.duliProject.codeline = this.duliProject.sheetTitle[0];
                        this.duliProject.projectline = this.duliProject.sheetTitle[0];
                        this.duliProject.filePath = response.data.msg;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        //独立工程量清单 识别数据
        verifiedData(){
            if(this.duliProject.codeline == this.duliProject.projectline && this.duliProject.fileList.length !== 0){
                alert('[编码列] 和 [工程量列] 不能重复！');
            }else if(this.duliProject.fileList.length == 0){
                alert('请上传有效的Excel文件！');
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/distinguish',
                    headers:{
                        token:this.token
                    },
                    params:{
                        tempFilePath:this.duliProject.filePath,
                        sheetName:this.duliProject.sheetName,
                        codeColumn:this.duliProject.codeline,
                        workAmountColumn:this.duliProject.projectline,
                        projId:this.projId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.duliProject.verifiedObject = response.data.rt;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        //导入
        importExcelSure(){
            if(JSON.stringify(this.duliProject.verifiedObject) == '{}' ){
                alert("请先对Excel中的数据进行识别校验!")
            }else if(this.duliProject.listProName == ''){
                alert('请填写清单名称!');
            }else{
                var formData = new FormData();
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/importWorkAmountExcel',
                    headers:{
                        token:this.token
                    },
                    params:{
                        title:this.duliProject.listProName,
                        projId:this.projId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getSingleWorkAmountList();
                        this.importExcelCancel();
                    }else if(response.data.cd == 10001){
                        alert(response.data.msg);
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //取消导入
        importExcelCancel(){
            this.duliProject.fileList = [];
            this.duliProject.fileName = '请选择文件';
            this.duliProject.fileList = [];
            this.duliProject.verifiedObject = {};
            this.duliProject.codeline = '';
            this.duliProject.projectline = '';
            this.duliProject.sheetName = '';
            this.duliProject.listProName = '';
            this.duliProject.importExcelShow = false;
        },
        //查看独立工程量清单明细
        showSnapWorkAmouontDetail(val,type){
            this.duliProject.AmouontDetail = val;
            if(val.workAmountNum == 0){
                alert("没有可查看的工程量信息");
            }else{
                this.duliProject.name = val.name;
                this.duliProject.showProject = true;
                this.showDetail = false;
                this.projList.showProject = false;
                this.showMainProject = false;
                this.listItem.showProject = false;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/getSnapWorkAmouontDetail',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:val.manifestId,
                        projId:this.projId,
                        type:type
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.duliProject.data = response.data.rt;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        //编辑独立工程量
        editListBtn(scope){
            this.duliProject.editPriceObject = scope.row;
            this.duliProject.totalPrice = scope.row.price;
            this.duliProject.editPrice = true;
        },
        duLiEditSure(){
            this.duliProject.editPrice = false;
            var formData = new FormData();
            var totalPrice = Number(this.duliProject.totalPrice).toFixed(2);
            formData.append('mId',this.duliProject.AmouontDetail.manifestId);
            formData.append('ids',this.duliProject.editPriceObject.detailIds);
            formData.append('price',totalPrice);
            formData.append('type',2);
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/editEngineerDetailPrice',
                headers:{
                    token:this.token
                },
                data:formData
            }).then(response=>{
                if(response.data.cd == 0){
                    this.showSnapWorkAmouontDetail(this.duliProject.AmouontDetail,2)
                }else{
                    alert(response.data.msg);
                }
            })
        },
        duLiEditCancel(){
            this.duliProject.editPrice = false;
        },
        //表格页码改变时重新获取数据
        changePage(val, isTop) { //分页 0 -1 1 2
            var vm = this;
            if (isTop == '1') {
                if (vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total / vm.pageDetial.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
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
                    vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total / vm.pageDetial.pagePerNum)
                    break;
                }
            } else if(isTop == '2') {
                if (vm.pageDetial_1.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.pageDetial_1.currentPage >= Math.ceil(vm.pageDetial_1.total / vm.pageDetial_1.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
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
                    vm.pageDetial_1.currentPage = Math.ceil(vm.pageDetial_1.total / vm.pageDetial_1.pagePerNum)
                    break;
                }
            }else if(isTop == '3'){
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
        edit(){

        },
        back(){

        },
        //返回工程量清单
        backToProject(){
            this.showDetail = false;
            this.duliProject.showProject = false;
            this.showMainProject = true;
            this.listItem.showProject = false;
            this.projList.showProject = false;
        },
        //查看明细
        viewDetail(val){
            this.viewDetailObject = val;
            if(this.viewDetailObject.gifWorkAmount == 0){
                alert('没有可查看的工程量信息!');
            }else{
                this.viewProjectDetail.viewDetailName = val.name.split('-')[0]+'-'+'工程量明细';
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/getSnapWorkAmouontDetail',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:val.manifestId,
                        projId:this.projId,
                        type:1
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.codingList = response.data.rt;
                        this.dealWithCondingList(this.codingList);
                        this.showDetail = true;
                        this.projList.showProject = false;
                        this.showMainProject = false;
                        this.duliProject.showProject = false;
                        this.listItem.showProject = false;
                    }else{
                        alert(response.data.msg)
                    }
                })
            }
        }, 
        //递归处理工程量明细信息的数据
        dealWithCondingList(obj){
            obj.forEach(item=>{
                if(item.children.length!=0){
                    this.dealWithCondingList(item.children);
                }else{
                    if(item.characterValues!=null && item.characterValues.length!=0){
                        Object.assign(item,{
                            'description':item.characterValues[0].characterName+':'+item.characterValues[0].currCharacterValue
                        })
                    }
                }
            })
        },
        //三价配置
        threePrice(){
            this.viewProjectDetail.showThreePrice = true;
        },
        //将内部价拷贝到参考价
        copyInnerPriceToReferencePrice(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/copyInnerPriceToReferencePrice',
                headers:{
                    token:this.token
                },
                params:{
                    mainId:this.viewDetailObject.manifestId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    alert("参考价设置成功!");
                    this.viewProjectDetail.showThreePrice = false;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //将导入价复制到参考价
        copyImportPriceToReferencePrice(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/copyImportPriceToReferencePrice',
                headers:{
                    token:this.token
                },
                params:{
                    mainId:this.viewDetailObject.manifestId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    alert("导入价设置成功!");
                    this.viewProjectDetail.showThreePrice = false;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //导入单价
        importDanjia(){
            this.viewProjectDetail.importPriceShow = true;
        },
        //导入单价
        selectimportfile(){
            this.$refs.fileimport.click();
        },
        //导入单价改变
        selectfileChanged(){
            let list = this.$refs.fileimport.files;
            this.viewProjectDetail.fileList = list;
            if(list.length !== 0){
                this.viewProjectDetail.fileName = list[0].name;
            }
             if(this.viewProjectDetail.fileName.split('.')[1] != 'xls' && this.viewProjectDetail.fileName.split('.')[1] != 'xlsx'){
                alert("必须上传Excel文件!")
            }else{
                var formData =  new FormData();
                formData.append('filedata',list[0]);
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/uploadExcelFile',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.viewProjectDetail.excelInfo = response.data.rt;
                        this.viewProjectDetail.sheetName = response.data.rt.title[0].sheetName;
                        this.viewProjectDetail.sheetTitle = response.data.rt.title[0].sheetTile;
                        this.viewProjectDetail.codeline = this.viewProjectDetail.sheetTitle[0];
                        this.viewProjectDetail.projectline = this.viewProjectDetail.sheetTitle[0];
                        this.viewProjectDetail.filePath = response.data.msg;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        //校验导入单价
        importPriceSure(){
            if(this.viewProjectDetail.codeline == this.viewProjectDetail.projectline){
                alert("[项目编码列] 和 [单价列] 不能重复！");
            }else{
                axios({
                    method:'get',
                    url:this.BDMSUrl+'project2/report/importPriceDataCheck',
                    headers:{
                        token:this.token
                    },
                    params:{
                        tempFilePath:this.viewProjectDetail.filePath,
                        sheetName:this.viewProjectDetail.sheetName,
                        eCodeColumn:this.viewProjectDetail.codeline,
                        unitPriceColumn:this.viewProjectDetail.projectline,
                        projId:this.projId,
                        mainId:this.viewDetailObject.manifestId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.viewProjectDetail.datadistinguishShow = true;
                        this.viewProjectDetail.datadistinguishData = response.data.rt;
                        this.importPriceCancel();
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
            this.viewProjectDetail.importPriceShow = false;
        },
        //正式导入单价
        datadistinguishSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/confirmImportPrice',
                headers:{
                    token:this.token
                },
                params:{
                    mainId:this.viewDetailObject.manifestId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    alert(response.data.msg);
                    this.viewProjectDetail.datadistinguishShow = false;
                    this.viewDetail(this.viewDetailObject);
                }else{
                    alert(response.data.msg);
                }
            })
        },
        datadistinguishCancel(){
            this.viewProjectDetail.datadistinguishShow = false;
        },
        importPriceCancel(){
            this.viewProjectDetail.sheetName ='';
            this.viewProjectDetail.sheetTitle = [];
            this.viewProjectDetail.codeline = '';
            this.viewProjectDetail.projectline = '';
            this.viewProjectDetail.fileName = '请选择文件';
            this.viewProjectDetail.fileList = [];
            this.viewProjectDetail.importPriceShow = false;
        },
        showThreePriceCenter(){
            this.viewProjectDetail.showThreePrice = false;
        },
        showThreePriceCancel(){
            this.viewProjectDetail.showThreePrice = false;
        },
        //导出excel
        exportExcel(){
            this.viewProjectDetail.exportExcelShow = true;
        },
        exportExcelShowCenter(){
            var mainId = this.viewDetailObject.manifestId;
            var projId = this.projId;
            var excelName = this.viewDetailObject.name+'明细';
            var threeArr =[];
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('内部价');
            }
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('导入价');
            }
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('参考价');
            }
            var priceType = threeArr.join('-');
            window.open(this.BDMSUrl+'project2/report/exportEngineeringDetailToExcel?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&excelName='+excelName+'&priceType='+priceType);
            this.viewProjectDetail.exportExcelShow = false;
        },
        sexportExcelShowCancel(){
            this.viewProjectDetail.exportExcelShow = false;
        },
        //导出xml
        exportXml(){
            var mainId = this.viewDetailObject.manifestId;
            var xmlName = this.viewDetailObject.name+'明细';
            var projId = this.projId;
            window.open(this.BDMSUrl+'project2/report/exportEngineeringDetailToXML?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&xmlName='+xmlName);
        },
        //打印
        printObject(){
            var mainId = this.viewDetailObject.manifestId;
            var title = this.viewDetailObject.name+'明细';
            var projId = this.projId;
            window.open(this.BDMSUrl+'project2/report/printPreview?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&title='+title);
        },
        //编辑工程量明细 的参考价格
        editDetailPrice(val){
            this.viewProjectDetail.editPrice = true;
            this.viewProjectDetail.editPriceData = val.row;
            this.viewProjectDetail.rePrice = val.row.referencePrice;

        },
        detailEditSure(){
            if(this.viewProjectDetail.rePrice == ''){
                alert('请输入修改的金额！')
            }else{
                var formData = new FormData();
                formData.append('type',1);
                formData.append('price',Number(this.viewProjectDetail.rePrice).toFixed(2));
                formData.append('mId',this.viewDetailObject.manifestId);
                formData.append('ids',this.viewProjectDetail.editPriceData.detailIds);
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/report/editEngineerDetailPrice',
                    headers:{
                        token:this.token
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.viewDetail(this.viewDetailObject);
                        this.viewProjectDetail.editPrice = false;
                    }else{
                        alert(response.data.msg);
                    }
                })
                
            }
        },
        detailEditCancel(){
            this.viewProjectDetail.editPrice = false;
        },
        //查看工程量明细
        viewDetailThing(val){
            this.projList.baseObj = val.row;
            this.projList.showProject = true;
            this.duliProject.showProject = false;
            this.showDetail = false;
            this.showMainProject = false;
            this.listItem.showProject = false;
        },
        //查看清单
        viewList(val){
            this.duliProject.showProject = false;
            this.showDetail = false;
            this.showMainProject = false;
            this.projList.showProject = false;
            this.listItem.showProject = true;
            
            this.listItem.viewDetailObj = val;
        },
        //新建自定义清单查询
        searchResult(flag){
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
            formData.append('serviceState',this.newList.sourceSate);
            formData.append('relaType',this.newList.soureFrom);
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
                console.log(response.data);
                if(response.data.cd == 0){
                    this.customData = response.data.rt.rows;
                    this.customPageDetial.total = response.data.rt.total;
                    var type_c = '';
                    var relaType_c ='';
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
                }else{
                    alert(response.data.msg);
                }
            })
        }
    }
}
</script>
<style lang="less" >
    #quantitiesList{
        .threeP{
            button{
                width: 200px;
                height: 40px;
                border: none;
                border-radius: 2px;
                margin-top: 10px;
                cursor: pointer;
                color: #606266;
            }
        }
        .worktable{
            .antsLine{
                padding: 10px 10px 30px 0px;
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
            .worktableTitle{
                padding-bottom: 10px;
                border-bottom: 1px solid #e6e6e6;
                margin-bottom: 10px;
                overflow: hidden;
                position: relative;
                .icon-detail{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 15px;
                    height: 17px;
                    display: block;
                    background: url('./images/projDetail.png') no-repeat 0 0;
                }
                .worktableTitleLeft{
                    padding-left: 25px;
                    float: left;
                    font-size: 16px;
                    color: #fc3439;
                    font-weight: bold;
                    height:16px;
                    line-height: 16px;
                    font-family: 'Microsoft YaHei';
                    img{
                        width: 15px;
                        height: 16px;
                        margin-right: 10px;
                        position: relative;
                        top: 1px;
                    }
                }
                .worktableTitleRight{
                    float: right;
                    color: #666;
                    font-size: 14px;
                    height: 16px;
                    line-height: 16px;
                    span{
                        display: inline-block;
                        margin-left: 20px;
                        cursor: pointer;
                    }
                    label{
                        cursor: pointer;
                    }
                    img{
                        width: 16px;
                        height: 16px;
                        margin-right: 10px;
                        position: relative;
                        top: 3px;
                    }
                }
            }
        }
        //导入工程量清单弹窗样式
        .el-dialog__body{
            margin: 20px 30px 30px;
        }
        .el-dialog__footer{
            margin-top: 0;
        }
        .importprojectList{
            overflow: hidden;
            text-align: left;
            .updataImageSpan{
                margin-left: 20px;
            }
            .upImgBtn{
                font-size: 14px;
                color: #666;
                font-family: 'Microsoft YaHei';
                font-weight: normal;

            }
            .importFile{
                margin-bottom: 20px;
                .upImgText{
                    margin: 0;
                }
            }
            .editSelect{
                padding-left: 10px;
            }
            .downsaniao{
                position: absolute;
                background: url('./images/downsanjiao.png');
                width: 12px;
                height: 7px;
                left: 309px;
                top: 13px;

            }
            .worklist{
                position: relative;
                margin-bottom: 20px;
                
                .worklisttite{
                    margin-right: 33px;
                }
                .worklisttite1{
                    margin-right: 19px;
                }
                .worklisttite2{
                    margin-right: 34px;
                }
                .worklisttite3{
                    margin-right: 20px;
                }
                .editSelect{
                    height: 34px;
                    width: 246px;
                }
                
            }
            .projlist{
                margin-bottom: 20px;
                position: relative;
                .worklisttite{
                    display: inline-block;
                    margin-right: 19px;
                }
                .editSelect{
                    height: 34px;
                    width: 246px;
                }
            }
            .projlist1{
                margin-bottom: 20px;
                position: relative;
                .worklisttite{
                    display: inline-block;
                    margin-right: 5px;
                }
                .editSelect{
                    height: 34px;
                    width: 246px;
                }
            }
            .projlistname{
                margin-bottom: 20px;
                .worklisttite{
                    display: inline-block;
                    margin-right: 19px;
                }
                .editSelect{
                    height: 34px;
                    width: 440px;
                    padding-left: 10px;
                    font-size: 14px;
                    font-family: "Microsoft YaHei";
                    color: #ccc;
                }
            }
        }
        .el-dialog{
            margin: 0 auto;
        }
        .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
        }
        .edit-item{
            position: relative;
            .editSelect{
                float: left;
                width: 248px;
                height: 40px;
                padding: 10px;
            }
            .editInpText{
                text-align: right;
                float: left;
                height: 40px;
                line-height: 40px;
                width: 100px;
            }
        }
        .editBodyone,.editBodytwo{
            text-align: left;
            margin:20px 0;
        }
        .distinguishUl{
            list-style: none;
            height: 350px;
            padding-left: 100px;
            overflow-y: scroll;
            overflow-x:hidden; 
        }
        .editBodyone{
            .editInpText{
                text-align: right;
                width: 100px;
                height:40px;
                position: relative;
                top: 5px;
            }
            // .inp{
            //     width: 506px;
            // }
        }
        .imageBody{
            margin: 0 30px;

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
        .worktable{
            margin-bottom: 30px;
        }
        .project1{
            margin: 0 !important;
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
            margin: 0 20px;
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
           
            .actionBtn{
                width: 16px;
                height: 17px;
                border: none;
                cursor: pointer;
                margin-right: 10px;
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
                            height: 55px;
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
        .danjia{
            width: 406px!important;
        }
        /**********一下是分页器的样式***************/
        .datagrid-pager {
            display: block;
            height: 31px;
            width: auto;
            border:1px solid #d4d4d4;
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
        .imageBodyText{
            margin-right: 19px;
        }
        .updataImageSpan{
            overflow: hidden;
            width: 98px;
            .upImgBtn{
                width: 105px;
                height: 32px;
                border-radius: 2px;
            }
        }
        .updataImageSpan input{
            position: absolute;
            left: 0px;
            top: 0px;
            opacity: 0;
        }
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




