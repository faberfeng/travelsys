<template>
    <div id="mappingproject">
        <!--左侧-->
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y:auto;">
                <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div @click="showProperty = !showProperty" :class="{active:showProperty}">
                        <span class="item-property1">构<br>件</span>
                    </div>
                    <div @click="showProperty = !showProperty" :class="{active:!showProperty}">
                        <span class="item-property">规<br>则</span>
                    </div>
                </div>
                <div id="containerMessage">
                    <div class="project">
                        <p class="antsLine">
                            成本管理<i class="icon-sanjiao-right"></i>
                            <span style="cursor:pointer"  @click="back()">工程量清单</span>
                            <i class="icon-sanjiao-right"></i>
                            <span class="strong">{{projObj.engineerName}}【{{projObj.classifyCode.split('-')[1]}}】构件名称</span>
                        </p>
                        <p class="header clearfix">
                            <span class="left_header">
                                <i class="list_ icon"></i>构件明细
                            </span>
                            <span class="left_headerRight" @click="expandPropertyFun">
                                <i class="list_icon_right"></i>扩展属性
                            </span>
                        </p>
                        <div class="project">
                            <el-table  :data="projObjArr" style="width:100%" border @expand-change="showRowInfo" v-if="isMapped">
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <div class="doubleTable">
                                            <table  :class="[expandPrperty.length!=0?'UserListtwoLeft':'UserListtwoLeftone']">
                                                <thead>
                                                    <th>所在空间</th>
                                                    <th>原始文档</th>
                                                    <th>原始ID</th>
                                                    <th>构件名称</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item,index) in detailInfoObj" :key="index" @click="clickDetailInfo(item,index,1)">
                                                        <td>{{item.inSpace}}</td>
                                                        <td>{{item.originalFile}}</td>
                                                        <td>{{item.originalId}}</td>
                                                        <td>{{item.originalName}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="UserListtwoRight" v-if="expandPrperty.length!=0">
                                                <thead>
                                                    <th v-for="(item,index) in tableHeadData" v-if="item.showModel" :key="index">{{item.name}}</th>
                                                    <th>操作</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item,index) in expandPrperty" :key="index" @click="clickDetailInfo(item,index,2)">
                                                        <td v-for="(iteml,indexl) in item" :key="indexl" v-if="iteml[3]">  
                                                            <span >{{iteml[1]}}</span>
                                                        </td>
                                                        <td>
                                                            <button class="locationtwo actionBtn" title="定位" @click="goToLocation()"></button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="datagrid-pager pagination" >
                                            <table cellspacing="0" cellpadding="0" border="0" >
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
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
                                                            <a href="javascript:void(0)" @click="loadMappingEntityInfo(getComponentDetailsObj.uuid)" class="btn-refresh btn-TAB"></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                                            <div style="clear:both;"></div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                label="项目编码" 
                                prop="number" 
                                align="center">
                                </el-table-column>
                                <el-table-column
                                    label="项目名称"
                                    prop="title"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="特征描述"
                                    prop="description"
                                    align="center"
                                    width="300"
                                   >
                                </el-table-column>
                                <el-table-column
                                    label="计量单位"
                                    prop="unit"
                                    align="center">
                                </el-table-column>
                            </el-table>
                            <div v-if="!isMapped">
                                <div class="doubleTable">
                                    <table  :class="[expandPrperty.length!=0?'UserListtwoLeft':'UserListtwoLeftone']">
                                        <thead>
                                            <th>所在空间</th>
                                            <th>原始文档</th>
                                            <th>原始ID</th>
                                            <th>构件名称</th>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,index) in detailInfoObj" :key="index" @click="clickDetailInfo(item,index,1)">
                                                <td>{{item.inSpace}}</td>
                                                <td>{{item.originalFile}}</td>
                                                <td>{{item.originalId}}</td>
                                                <td>{{item.originalName}}</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                        <table class="UserListtwoRight" v-if="expandPrperty.length!=0">
                                            <thead>
                                                <th v-for="(item,index) in tableHeadData" v-if="item.showModel" :key="index">{{item.name}}</th>
                                                <th>操作</th>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item,index) in expandPrperty" :key="index" @click="clickDetailInfo(item,index,1)">
                                                    <td v-for="(iteml,indexl) in item" :key="indexl" v-if="iteml[3]">  
                                                        <span >{{iteml[1]}}</span>
                                                    </td>
                                                    <td>
                                                        <button class="locationtwo actionBtn" title="定位" @click="goToLocation()"></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="datagrid-pager pagination" >
                                        <table cellspacing="0" cellpadding="0" border="0" >
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
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
                                                        <a href="javascript:void(0)" @click="loadMappingEntityInfo(getComponentDetailsObj.uuid)" class="btn-refresh btn-TAB"></a>
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
        </div>
        <!--右侧-->
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div  class="screenRight_1">
                <div v-if="showProperty">
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        基本属性
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                    <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">所在空间</span>
                            <span class="detial-text-value" :title="detailTableInfo.floor">{{detailTableInfo.floor}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">原始文档</span>
                            <span class="detial-text-value" :title="detailTableInfo.originalFile">{{detailTableInfo.originalFile}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">原始ID</span>
                            <span class="detial-text-value" :title="detailTableInfo.originalId">{{detailTableInfo.originalId}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">构件名称</span>
                            <span class="detial-text-value" :title="detailTableInfo.originalName">{{detailTableInfo.originalName}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">脚本名称</span>
                            <span class="detial-text-value" :title="detailTableInfo.name">{{detailTableInfo.name}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">分类编码</span>
                            <span class="detial-text-value" :title="detailTableInfo.gccode">{{detailTableInfo.gccode}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">构件分类</span>
                            <span class="detial-text-value" :title="detailTableInfo.classifyName">{{detailTableInfo.classifyName}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">创建程序</span>
                            <span class="detial-text-value" :title="detailTableInfo.creator">{{detailTableInfo.creator}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新用户</span>
                            <span class="detial-text-value" :title="detailTableInfo.editor">{{detailTableInfo.editor}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新时间</span>
                            <span class="detial-text-value" :title="detailTableInfo.updateTime">{{detailTableInfo.updateTime}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">标记</span>
                            <span class="detial-text-value" :title="detailTableInfo.tag">{{detailTableInfo.tag}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">注释</span>
                            <span class="detial-text-value" :title="detailTableInfo.comments">{{detailTableInfo.comments}}</span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        设计属性
                        <i :class="[{'active':show.generalDesignInfo},'icon-dropDown']" @click="show.generalDesignInfo = show.generalDesignInfo?false:true;"></i>
                    </h3>
                    <ul id="genealAtt" :class="[{'show':show.generalDesignInfo},'Att']">
                        <li class="detial-item clearfix" v-for="(item,index) in Object.entries(mapInfo)" :key="index">
                            <span class="detial-text-name">{{item[0]}}</span>
                            <span class="detial-text-value" :title="item[1]">{{item[1]}}</span>
                        </li>
                    </ul>
                     <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        关联文档
                        <i :class="[{'active':show.reactDocument},'icon-dropDown']" @click="show.reactDocument = show.reactDocument?false:true;"></i>
                    </h3>
                    <ul id="reactDoc" :class="[{'show':show.reactDocument},'Att']">
                        <li class="detial-item clearfix fileSection" v-for="(item,index) in fgList" :key="index">
                            <i class="reactDocFileIcon"></i>
                            <span class="detial-text-value fileIcon" :title="item.fgName">{{item.fgName}}</span>
                            <i class="reactDocFileIconAfter" @click="preViewFile(item,index)"></i>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        构件分类
                        <i :class="[{'active':show.reactDocument},'icon-dropDown']" @click="show.reactDocument = show.reactDocument?false:true;"></i>
                    </h3>
                    <ul id="reactDoc" :class="[{'show':show.reactDocument},'Att']" v-if="entityClassify.length>0">
                         <li class="detial-item clearfix">
                            <span class="detial-text-name">构件专业</span>
                            <span class="detial-text-value" :title="entityClassify[0][1]">{{entityClassify[0][1]}}</span>
                        </li>
                       <li class="detial-item clearfix">
                            <span class="detial-text-name">构件系统</span>
                            <span class="detial-text-value" :title="entityClassify[1][1]">{{entityClassify[1][1]}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">构件类型</span>
                            <span class="detial-text-value" :title="entityClassify[2][1]">{{entityClassify[2][1]}}</span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        构件属性
                        <i :class="[{'active':show.goujianProperty},'icon-dropDown']" @click="show.goujianProperty = show.goujianProperty?false:true;"></i>
                    </h3>
                    <ul id="goujianTable" :class="[{'show':show.goujianProperty},'Att']">
                        <table class="UserList">
                            <thead>
                                <tr>
                                    <td>简写</td>
                                    <td>名称</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in extAttrs" :key="index">
                                    <td>{{item[0]}}</td>
                                    <td>{{item[1]}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        计量条件
                        <i :class="[{'active':show.jiliangCondition},'icon-dropDown']" @click="show.jiliangCondition = show.jiliangCondition?false:true;"></i>
                    </h3>
                    <ul id="jiliangC" :class="[{'show':show.jiliangCondition},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-value">{{ruleObject.condition}}</span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        计量公式
                        <i :class="[{'active':show.caculateForma},'icon-dropDown']" @click="show.caculateForma = show.caculateForma?false:true;"></i>
                    </h3>
                    <ul id="caculate" :class="[{'show':show.caculateForma},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-value">{{ruleObject.formula}}</span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        特征映射
                        <i :class="[{'active':show.tezhengYingshe},'icon-dropDown']" @click="show.tezhengYingshe = show.tezhengYingshe?false:true;"></i>
                    </h3>
                    <ul id="tzYingshe"  :class="[{'show':show.tezhengYingshe},'Att']">
                        <table  v-if="rowInfo.characterValues.length>0" class="UserList">
                            <thead>
                                <tr>
                                    <td>特性</td>
                                    <td>取值</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{rowInfo.characterValues[0].characterName}}</td>
                                    <td>{{rowInfo.characterValues[0].currCharacterValue}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 33px;">
                        <i class="trrangle"></i>
                        特征描述
                        <i :class="[{'active':show.tezhengMiaosu},'icon-dropDown']" @click="show.tezhengMiaosu = show.tezhengMiaosu?false:true;"></i>
                    </h3>
                    <ul id="tzMiaos" :class="[{'show':show.tezhengMiaosu},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">是否修改</span>
                            <span class="detial-text-value">{{rowInfo.characterModifyTag?'是':'否'}}</span>
                        </li>
                    </ul> 
                </div>
            </div>
        </div>
        <!--弹窗-->
        <div v-if="ListHeaderShow"  id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">显示列</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="headerListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in showExpandTable" :key="index">
                        <el-checkbox v-model="item.showModel">{{item.name}}</el-checkbox>
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
        <div id="mask" v-if="ListHeaderShow" ></div>
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';

export default Vue.component('mapping-project',{
    props:{
        projData:Object,
        entityNumber:String | Number,
        isMapped:Boolean,
    },
    data(){
        return{
            screenLeft:{
                show:false
            },
            showProperty:true,
            projObj:{},
            BDMSUrl:'',
            token:'',
            projId:'',
            projObjArr:[],
            pageDetial:{
                pagePerNum:20,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            show:{
                basicAttributes:true,
                generalDesignInfo:true,
                reactDocument:true,
                goujianProperty:true,
                jiliangCondition:true,
                caculateForma:true,
                tezhengYingshe:true,
                tezhengMiaosu:true,
            },
            detailInfoObj:[],//详细构件信息
            expandPrperty:[],//扩展属性
            tableHeadData:[],//扩展属性表头
            detailTableInfo:{},
            mapInfo:{},
            ruleObject:{},//右侧规则信息
            entityClassify:[],
            extAttrs:[],
            rowInfo:{},
            ListHeaderShow:false,
            showExpandTable:[],
            fgList:[],//文件数组
        }
    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            this.loadMappingEntityInfo(this.getComponentDetailsObj.uuid);
        },
        'pageDetial.pagePerNum':function(val,oldval){
            this.loadMappingEntityInfo(this.getComponentDetailsObj.uuid);
        },
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
        'show.reactDocument':function(val){
            if(val){
                $("#reactDoc").show(200);
            }else{
                $("#reactDoc").hide(200);
            }
        },
        'show.goujianProperty':function(val){
            if(val){
                $("#goujianTable").show(200);
            }else{
                $("#goujianTable").hide(200);
            }
        },
        'show.jiliangCondition':function(val){
            if(val){
                $("#jiliangC").show(200);
            }else{
                $("#jiliangC").hide(200);
            }
        },
        'show.caculateForma':function(val){
            if(val){
                $("#caculate").show(200);
            }else{
                $("#caculate").hide(200);
            }
        },
        'show.tezhengYingshe':function(val){
            if(val){
                $("#tzYingshe").show(200);
            }else{
                $("#tzYingshe").hide(200);
            }
        },
        'show.tezhengMiaosu':function(val){
            if(val){
                $("#tzMiaos").show(200);
            }else{
                $("#tzMiaos").hide(200);
            }
        },
    },
    created(){
        this.projObj = this.projData;
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl; 
        if(this.isMapped){
            this.showEntityList();//构件列表时触发
        }else{
            this.loadUnMappingEntityInfo(this.projObj.unmappingUuid);//未被映射构件
        }
    },
    methods:{
        back(){
            this.$emit('back');
        },
        showRowInfo(row, expandedRows){
            if(expandedRows.length>1){
                expandedRows.shift();
            }
            this.getComponentDetailsObj = row;
            this.loadMappingEntityInfo(row.uuid);
        },
        //获取未被映射的构件信息
        loadUnMappingEntityInfo(currCacheId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/loadMappingEntityInfo',
                headers:{
                    token:this.token
                },
                params:{
                    page:this.pageDetial.currentPage,
                    rows:this.pageDetial.pagePerNum,
                    cacheId:currCacheId,
                }
            }).then(response=>{
                console.log(response.data)
                if(response.data.cd == 0){
                    this.detailInfoObj = response.data.rt.rows;
                    this.pageDetial.total = response.data.rt.total;
                    this.tableHeadData = [];
                    this.showExpandTable = [];
                    this.expandPrperty = [];
                    if(this.detailInfoObj[0].extendAttributes != null && this.detailInfoObj[0].extendAttributes.length!=0){
                        this.detailInfoObj[0].extendAttributes.forEach(item=>{
                            this.tableHeadData.push({
                                name:item[2],
                                showModel:true,
                            })
                        })
                        this.detailInfoObj[0].extendAttributes.forEach(item=>{
                            this.showExpandTable.push({
                                name:item[2],
                                showModel:true,
                            })
                        })
                        this.detailInfoObj.forEach((item,index)=>{
                            this.expandPrperty.push(item.extendAttributes);
                        });
                    }
                    this.expandPrperty.forEach(item=>{
                        item.forEach(itemone=>{
                            itemone[3] = true;
                        })
                    });
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取映射的构件信息
        loadMappingEntityInfo(currCacheId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/loadMappingEntityInfo',
                headers:{
                    token:this.token
                },
                params:{
                    page:this.pageDetial.currentPage,
                    rows:this.pageDetial.pagePerNum,
                    cacheId:currCacheId,
                    genieclass:this.entityNumber,
                    projId:this.projId
                }
            }).then(response=>{
                console.log(response.data)
                if(response.data.cd == 0){
                    this.detailInfoObj = response.data.rt.rows;
                    this.pageDetial.total = response.data.rt.total;
                    this.tableHeadData = [];
                    this.showExpandTable = [];
                    this.expandPrperty = [];
                    this.detailInfoObj[0].extendAttributes.forEach(item=>{
                       this.tableHeadData.push({
                           name:item[2],
                           showModel:true,
                       })
                    })

                    this.detailInfoObj[0].extendAttributes.forEach(item=>{
                       this.showExpandTable.push({
                           name:item[2],
                           showModel:true,
                       })
                    })

                    this.detailInfoObj.forEach((item,index)=>{
                        this.expandPrperty.push(item.extendAttributes);
                    });
                    this.expandPrperty.forEach(item=>{
                        item.forEach(itemone=>{
                            itemone[3] = true;
                        })
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //显示指定工程量映射的构件列表
        showEntityList(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/showEntityList',
                headers:{
                    token:this.token
                },
                data:{
                    eCode:this.projObj.classifyCode.split('-')[1],
                    cacheId:this.projObj.uuid,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.projObjArr = response.data.rt;
                    if(this.projObjArr!=null && this.projObjArr.length!=0){
                        var str = '';
                        this.projObjArr.forEach(item=>{
                            if(item.characterValues.length!=0){
                                item.characterValues.forEach(num=>{
                                    str+=num.characterName+':'+num.currCharacterValue+';  ';
                                })
                            };
                            Object.assign(item,{
                                description:str,
                            })
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //右侧属性面板
        clickDetailInfo(item,index,num){
            this.screenLeft.show = true;
            let tranceid = '';
            let dGCCode = '';
            let engineeringCodeParam = '';
            if(num == 1){
                tranceid = item.dTraceId;
                dGCCode = item.dGCCode;
                engineeringCodeParam = item.engineeringCode;
                this.rowInfo = item;
            }else if(num ==2){
                tranceid = this.detailInfoObj[index].dTraceId;
                dGCCode = this.detailInfoObj[index].dGCCode;
                engineeringCodeParam = this.detailInfoObj[index].engineeringCode;
                this.rowInfo = this.detailInfoObj[index];
            }
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/getComponentInfoList',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    traceId:tranceid
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.detailTableInfo = response.data.rt;
                    this.mapInfo = response.data.rt.mapInfo;
                    //获取文件
                    if(response.data.rt.fgList){
                        this.fgList = response.data.rt.fgList;
                    }
                }else{
                    alert(response.data.msg);
                }
            })
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/getWorkComponentInfoList',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId,
                    engineeringCode:engineeringCodeParam,
                    gcCode:dGCCode,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.ruleObject = response.data.rt;
                    this.entityClassify = response.data.rt.entityClassify;
                    this.extAttrs = response.data.rt.extAttrs;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //定位
        goToLocation(){
            alert("请打开左侧面板!");
        },
        //扩展属性
        expandPropertyFun(){
            this.ListHeaderShow = true;
        },
        //确认显示扩展属性
        headerListConfirm(){
            this.showExpandTable.forEach((item,index)=>{
                this.tableHeadData[index].showModel = item.showModel;
                this.expandPrperty.forEach(item1=>{
                    item1.forEach((item2,index)=>{
                        if(item2[2] == item.name){
                            item2[3] = item.showModel;
                        }
                    })
                })
            })
            this.ListHeaderShow = false;
        },
        headerListCancle(){
            this.ListHeaderShow = false;
        },
        //预览文件
        preViewFile(item,index){
            window.open('http://10.252.26.240:8080/qjbim-file'+item.filePath+'/preview?token='+this.token);
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
    }
})
</script>
<style lang="less">
.navigation{
        z-index: 0!important;
    }
#mappingproject{
    /**********model弹窗样式***************/
    .project{
        margin:0;
    }
    .dialog{
        top: 15vh;
        left: 50%;
        z-index: 3001;
        width: 660px;
        margin-left:-330px;
         border-radius: 5px;
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
    /**********一下是分页器的样式***************/
    .datagrid-pager{
        display: block;
        height: 31px;
        width: auto;
        box-sizing: border-box;
        background: #f5f5f5;
        margin: 0 10px 10px 10px;
        overflow: hidden;
        tbody,tr{
            background: #f5f5f5!important;
        }
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


    .actionBtn{
        width: 16px;
         height: 17px;
        border: none;
        cursor: pointer;
        margin-right: 10px;
    }
    .locationtwo{
        background: url('./images/location.png') no-repeat;
    }
    .listBtn {
        background: url('./images/list.png') no-repeat;
    }
    .location{
        background: url('./images/location.png') no-repeat;
    }        

    .box-left-container{
        display: block;
        position: fixed;
        top: 165px;
        left: 26px;
        bottom: 0;
        right: 225px;
        z-index:1000;
        transition: all .5s;
       overflow-y: scroll;
        #center-selection{
            position: fixed;
            top: 115px;
            right: 225px;
            width: 25px;
            z-index: 100;
            transition: all ease .5s;
            background: #ffffff;
            .SH_right{
                width: 25px;
                height: 50px;
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
            .item-property1{
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
                    height: 1px;
                    z-index: 1000;
                    background: #fafafa;
                    border-bottom: 1px solid #cccccc;
                    -webkit-transform: skewY(30deg);
                    transform: skewY(30deg);
                    content: '';
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
                    background: #fafafa;
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
                .item-version-3{//版本
                    z-index: 10;
                }
            }
            .active{//上边 目录 高显
                .item-property,.item-property1{
                    // background: #fff;
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
        .header {
            text-align: left;
            margin: 15px 0;
            border-bottom: 1px solid #e6e6e6;
            padding-bottom: 10px;
            height: 27px;
            .left_header {
                float: left;
                font-size: 16px;
                line-height: 16px;
                color: #fc3439;
                font-weight: bold;
                padding-left: 30px;
                position: relative;
                .list_ {
                    background: url('./images/goujiandetail.png')no-repeat 0 0;
                }
                .icon {
                    display: block;
                    width: 20px;
                    height: 17px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            .left_headerRight{
                float: right;
                font-size: 14px;
                line-height: 14px;
                color: #666;
                cursor: pointer;
                .list_icon_right{
                    background: url('./images/expandProperty.png') no-repeat;
                    display: inline-block;
                    width: 20px;
                    height: 17px;
                    position: relative;
                    top: 4px;
                    right: 10px;
                }
            }
            .right_header {
                text-decoration: none;
                float: right;
                font-size: 14px;
                color: #336699;
                line-height: 14px;
                margin-top: 4px;
            }
            .right-expend {
                position: relative;
                transition: all ease .5s;
                &::after {
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
            .right-pack-up {
                transition: all ease .5s;
                &::after {
                transform: rotateZ(180deg);
                }
            }
        }

    }
    //右侧
    .box-right-container{
        display: block;
        position: fixed;
        overflow-y: auto;
        right: -225px;
        bottom: 0;
        width: 225px;
        top: 116px;
        transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
        border-left:none;
        z-index: 1000;
        .screenRight_1{
            padding: 10px 0px 5px 0px;
            margin: 0 14px 0 10px;
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
                    list-style:none;
                }
                //文件图标
                .reactDocFileIcon{
                    display: inline-block;
                    width: 17px;
                    height: 18px;
                    background: url('./images/fileIcon.png') no-repeat;
                    position: relative;
                    top: 4px;
                }
                .fileIcon{
                    margin: 0 5px;
                }
                .fileSection{
                  padding-bottom: 0!important;
                  margin-bottom: 7px;  
                  cursor: pointer;
                }
                .fileSection:hover{
                    background: rgba(243, 243, 243, 1);
                }
                .fileSection:hover .reactDocFileIconAfter{
                    background: url('./images/fileIconHover.png') no-repeat;
                }
                .reactDocFileIconAfter{
                    display: inline-block;
                    width: 17px;
                    height: 18px;
                    background: url('./images/flieIconfter.png') no-repeat;
                    position: relative;
                    top: 4px;
                    left: 10px;
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
        .show{
            display: block!important;
        }
    }
    .box-left-avtive,.box-left-avtive_pre{
        right: 0px;
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
    .box-right-avtive{
        right: 0;
        transition: all ease .5s;
        border-left: 1px solid #cccccc;
    }
    .doubleTable{
        margin:10px 10px 0 10px;
       display: flex;
    }
    .UserListtwoLeft{
        width: 30%;
        max-width: 40%;
    }
    .UserListtwoLeftone{
        width: 100%;
    }
    .UserListtwoRight{
        flex: 1;
    }
    .UserListtwoLeft,.UserListtwoRight,.UserListtwoLeftone{
        border-collapse: collapse;
        float: left;
        .checkbox-att {
            display: none;
        }
        th{
            background: rgba(242, 242, 242, 1); 
        }
        .checkbox-fileItem {
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            position: relative;
            margin-left: 4px;
        }
        .active {
            background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
            border: 1px solid #fc3439;
        }
        thead {
            background: #f2f2f2;
            th {
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
        tbody {
            tr {
                td {
                    padding-left: 6px;
                    padding-right: 15px;
                    height: 55px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                    .location {
                        display: block;
                        width: 12px;
                        height: 16px;
                        background: url('../ManageCost/images/location.png')no-repeat 0 0;
                        cursor: pointer;
                    }
                }
                .Strong {
                    font-weight: bold;
                }
                .deleteBtn {
                    background: url('../../assets/delete.png') no-repeat;
                }
                .dataBtn {
                    background: url('./images/data.png') no-repeat;
                }
                .listBtn {
                    background: url('./images/list.png') no-repeat;
                }
                .refreshBtn {
                    background: url('./images/refresh.png') no-repeat;
                }
                .location {
                    display: block;
                    width: 12px;
                    height: 16px;
                    background: url('../ManageCost/images/location.png')no-repeat 0 0;
                    cursor: pointer;
                }
            }
            .activeTr {
                background: #0081c2;
                td {
                    color: #fff !important;
                }
            }
        }
    }   
    .UserList{
        border-collapse: collapse;
        margin:10px 10px 0 10px;
        width: 98%;
        .checkbox-att {
            display: none;
        }
        th{
            background: rgba(242, 242, 242, 1); 
        }
        .checkbox-fileItem {
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            position: relative;
            margin-left: 4px;
        }
        .active {
            background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
            border: 1px solid #fc3439;
        }
        thead {
            background: #f2f2f2;
            th {
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
        tbody {
            tr {
                td {
                    padding-left: 6px;
                    padding-right: 15px;
                    height: 55px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                    .location {
                        display: block;
                        width: 12px;
                        height: 16px;
                        background: url('../ManageCost/images/location.png')no-repeat 0 0;
                        cursor: pointer;
                    }
                }
                .Strong {
                    font-weight: bold;
                }
                .deleteBtn {
                    background: url('../../assets/delete.png') no-repeat;
                }
                .dataBtn {
                    background: url('./images/data.png') no-repeat;
                }
                .listBtn {
                    background: url('./images/list.png') no-repeat;
                }
                .refreshBtn {
                    background: url('./images/refresh.png') no-repeat;
                }
                .location {
                    display: block;
                    width: 12px;
                    height: 16px;
                    background: url('../ManageCost/images/location.png')no-repeat 0 0;
                    cursor: pointer;
                }
            }
            .activeTr {
            background: #0081c2;
            td {
                color: #fff !important;
            }
            }
        }
    }    
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      box-shadow: inset 006px rgba(0, 0, 0, .5);
      -webkit-box-shadow: inset 006px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.1);
      box-shadow: inset 006px rgba(0, 0, 0, .5);
      -webkit-box-shadow: inset 006px rgba(0, 0, 0, 0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(255, 0, 0, 0.4);
    }
    .has-gutter{
        tr{
            height: 51px;
        }
        th{
            background: rgba(242,242,242,1);
            
        }
    }
    .el-table__row{
        height: 40px;
    }
}
</style>

