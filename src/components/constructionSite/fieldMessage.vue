<template>
    <div id="fieldMessage">
        <div id="GroupSelect">
            <select v-model="allSelectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in  allUgList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div class="topHeader" v-if="!showCommonList">
            <div id="item-box-file">
                 <router-link :to="'/constructionSite/safetyInspection'" class="label-item">  
                安全监测  
                </router-link>
                <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                现场连线  
                </router-link>
                <router-link :to="'/constructionSite/fieldMessage'" class="label-item label-item-active">  
                现场发文  
                </router-link>
                <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                质量检查
                </router-link>
                <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                安全检查  
                </router-link>
               
            </div>
            <div class="box-left" v-show="endFileMessage">
                <div :class="['box_left_text',{'box_left_text_show':!showLeftContent}]">
                    <div class="left_slider">
                        <div :class="[screenLeft.item == 2?'active':(screenLeft.item == 1?'active-version':'active-version-3')]">
                            <span class="item-sendMsg" @click="sendMsg">收<br>件</span>
                            <span class="item-reviceMsg" @click="receiveMsg">发<br>件</span>
                            <span class="item-draft" @click="draftMsg">草<br>稿</span>
                        </div>
                    </div>
                    <div :class="[{'left_content_box1':showLeftContent},'left_content']">
                        <div class="left_content_box">
                            <div class="left_content_receive">
                                <div class="left_content_header">
                                        <span class="item_word" v-if="screenLeft.item==2">收件({{rowsListLength}})</span>
                                        <span class="item_word" v-if="screenLeft.item==1">发件({{rowsListLength}})</span>
                                        <span class="item_word" v-if="screenLeft.item==0">草稿({{rowsListLength}})</span>
                                        <span class="item-upload" @click="newFile">新建</span>
                                </div>
                                <div class="left_content_body">
                                    <div style="margin:200px auto" v-show="dataShow">
                                        <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                                        <p style="font-size:16px;color:#ccc">暂无数据</p>
                                    </div>
                                    <ul>
                                        <li v-for="(item,index) in rowsList" :key="index" :class="{'checkpoint':item.id==ischeck}" @click="checkItem(item.id)">
                                            <span :class="{'circle':item.id==ischeck}"></span>
                                            <span  :class="['time',{'value_hidden':!showLeftContent}]">{{item.createDate|timeChange}}</span>
                                            <span :class="['value',{'value_hidden':!showLeftContent}]">{{item.subject}}</span>
                                            <span :class="{'left_deleteBtn':item.id==ischeck}" @click.stop="delContact(item.id)"></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="[{'box-left':showLeftContent},'box-left-content']">
                    <div class="cancle">
                        <i class="cancle1" @click="cancleLeft"></i>
                    </div>
                    <div class="box_header">
                        <span v-show="ischeck" class="hidden">[{{projectValue}}]</span>
                        <span>详细</span>
                    </div>
                    <div v-show="!ischeck&&newFileshow">请在左侧内选择联系单</div>
                    <!-- <div style="margin:180px auto" v-show="dataShow">
                        <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                        <p style="font-size:16px;color:#ccc">暂无数据</p>
                    </div> -->
                    <div v-show="ischeck||!newFileshow" class="box_content">
                        <table>
                            <tbody>
                                <tr>
                                    <th>主题：</th>
                                    <td><el-input style="width:217px" :disabled="screenLeft.item>0" v-model="projectValue">{{projectValue}}</el-input></td>
                                </tr>
                                <tr v-show="screenLeft.item==2">
                                    <th>发件群组：</th>
                                    <td>
                                        <el-select :disabled="screenLeft.item>0" v-model="sendMsgUserValue">
                                            <el-option  :value="item.ugId" v-for="(item) in  ugList" :key="item.ugId" :label="item.ugName">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr v-show="screenLeft.item==2">
                                    <th>发件人:</th>
                                    <td><el-input style="width:217px" :disabled="screenLeft.item>0" v-model="sendmessageUser">{{sendmessageUser}}</el-input></td>
                                </tr>
                                <tr>
                                    <th>主送：</th>
                                    <td>
                                        <el-select :disabled="screenLeft.item>0" v-model="mainSendMsgValue">
                                            <el-option  :value="item.ugId" v-for="(item) in  ugList" :key="item.ugId" :label="item.ugName">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>抄送：</th>
                                    <td>
                                        <el-select :disabled="screenLeft.item>0" v-model="copySendMsgValue">
                                            <el-option :value="item.ugId" v-for="(item) in  ugList" :key="item.ugId" :label="item.ugName">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>内容：</th>
                                    <td>
                                        <el-input
                                            type="textarea"
                                            :rows="5"
                                            :cols="142"
                                            placeholder="请输入内容"
                                            v-model="textarea" :disabled="screenLeft.item>0">
                                        </el-input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="files" >
                            <span class="text">附件:</span>
                            <span v-show="!(screenLeft.item>0)">
                                <span class="icon-eye"  @click="viewSpot">视点</span>
                                <span class="icon-file" @click="showUploadBox_file">文档</span>
                                <span class="icon-message" @click="getAssociationList" >清单</span>
                                <span class="icon-image" @click="showUploadBox_img" >图片</span>
                            </span>
                        </div>
                        <div :class="['btn',{'btn1':showLeftContent}]" v-show="!(screenLeft.item>0)">
                            <span class="item-cancle" @click="addAndSend(1)">发送</span>
                            <span class="item-save" @click="addAndSend(0)">保存</span>
                        </div>
                        <div class="fileitem">   
                            <ul class="clearfix" style="padding: 0px 0px 2px 2px;">
                                 <li class="item-file" v-for="(val,key) in uploadViewPointList" :key="key+'_attach'" style="padding:0;overflow: hidden;">
                                    <img  style="object-fit: cover;" :src="QJFileManageSystemURL+val.filePath" :title="val.fileName" class="item-file-attach"/>
                                    <div class="actionbox clearfix">
                                        <i class="button-relocation" title="定位" @click="relocation()"></i>
                                        <i class="line"></i>
                                        <i class="button-search"  @click="preview(val.filePath)"></i>
                                        <i class="line"></i>
                                        <i class="icon-goujian icon-delete" @click="deleteFile1(key)"></i>
                                    </div>
                                </li>
                                <li class="item-file" v-for="(val,key) in fileId" :key="key+'_file'">
                                    <div class="item-file-box clearfix">
                                        <span  class="item-file-image">
                                            <img :src="require('../ManageCost/images/icon/'+val.fileExtension.toUpperCase()+'.png')" />
                                        </span>
                                        <span  class="item-file-detial">
                                            <h3 v-text="val.fileName"></h3>
                                            <p>由<span class="text-name" v-text="val.uploadUser"></span><span v-text="'浏览器'"></span>上传</p>
                                            <p v-text="initData(val.uploadTime)"></p>
                                            <p class="operation">
                                                <span v-text="'版本'+val.version"></span>
                                                <i class="icon-goujian icon-delete" v-show="!(screenLeft.item==1)" @click="deleteFile(key,2)"></i>
                                                <i class="icon-goujian icon-search" @click="preview(val.filePath)"></i>
                                                <i class="icon-goujian icon-download" @click="downLoad(val.filePath)"></i>
                                            </p>
                                        </span>
                                    </div>
                                </li>
                                <li class="item-file" v-for="(val,key) in attachId" :key="key" style="padding:0;overflow: hidden;">
                                    <img :src="QJFileManageSystemURL+val.relativePath" :title="val.fileName" class="item-file-attach"/>
                                    <div class="actionbox clearfix">
                                        <i class="button-relocation" v-show="val.locationInfo!=null" title="定位" @click="relocation1(val.locationInfo)"></i>
                                        <i class="line"></i>
                                        <i class="button-search"  @click="preview(val.relativePath)"></i>
                                        <i class="line"></i>
                                        <i class="button-download" @click="downLoad(val.relativePath)"></i>
                                        <i class="line"></i>
                                        <i class="icon-goujian icon-delete" v-show="!(screenLeft.item==1)" @click="deleteFile(key,1)"></i>
                                    </div>
                                </li>
                                <li class="goujian-item"  v-for="(item,index) in relaList" :key="index">
                                    <p class="clearfix">
                                        <i class="icon-goujian icon-detial" title="清单详细" @click="showDetialList(item.pkId)"></i>
                                        <i class="icon-goujian icon-QRcode" title="清单二维码" @click="qrcode(item.pkId)"></i>
                                        <i class="icon-goujian icon-location" title="定位" @click="location()"></i>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">ID :</span>
                                        <span class="detial-text-value" v-text="item.pkId"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">状态 :</span>
                                        <span class="detial-text-value"
                                            v-text="parseMStatus(item.mStatus)+'('+item.mStatus+')'"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">明细 :</span>
                                        <span class="detial-text-value" v-text="item.details.length"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">名称 :</span>
                                        <span class="detial-text-value" :tilte="item.mName" v-text="item.mName"></span>
                                    </p>
                                </li>
                                 <!-- <li class="goujian-item" v-for="(item,index) in relaList" :key="index">
                                    <p class="clearfix">
                                        <i class="icon-goujian icon-detial" title="清单详细" @click="showDetialList(relaList.pkId)"></i>
                                        <i class="icon-goujian icon-QRcode" title="清单二维码" @click="qrcode(relaList.pkId)"></i>
                                        <i class="icon-goujian icon-location" title="定位" @click="location()"></i>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">ID :</span>
                                        <span class="detial-text-value" v-text="relaList.pkId"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">状态 :</span>
                                        <span class="detial-text-value"
                                            v-text="parseMStatus(relaList.mStatus)+'('+relaList.mStatus+')'"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">明细 :</span>
                                        <span class="detial-text-value" v-text="relaList.details.length"></span>
                                    </p>
                                    <p class="item-detial">
                                        <span class="detial-text-name">名称 :</span>
                                        <span class="detial-text-value" :tilte="relaList.mName" v-text="relaList.mName"></span>
                                    </p>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <div class="project" v-if="showCommonList">
            <common-list @back="backToH"  :title="'工程量清单'" :isGongChengLiang='true' :manifestIdOne="checkList"></common-list>
        </div>
        <div :title="title" v-if="uploadshow"  id="edit" class="hahahha">
            <div class="el-dialog__header">
                <span class="el-dialog__title" v-text="type==1?'图片上传':'文件上传'"></span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="upImgCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectImg">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput"  type="file" :accept="type == 1?'image/*':''" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="uploadIMG">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
            </div>
        </div>
        <div v-if="labelListShow" id="edit" class="dialog">
            <div class="el-dialog__header">
                <span class="el-dialog__title">标签信息预览</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="labelListCancle">
                <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="editBody">
                <ul>
                    <li v-for="(item,index) in relaList" :key="index" class="item-label clearfix">
                    <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="">
                    <div class="right">
                        <p class="item-list clearfix">
                        <span class="text-left">清单ID：</span>
                        <span class="text-right" v-text="item.pkId"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">清单名称：</span>
                        <span class="text-right" v-text="item.mName"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">生成方式：</span>
                        <span class="text-right" v-text="parseMGSource(item.mGSource)"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">业务来源：</span>
                        <span class="text-right" v-text="parseMBSource(item.mBSource)"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">创建用户：</span>
                        <span class="text-right" v-text="item.creator"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">创建时间：</span>
                        <span class="text-right">{{item.createTime | timeChange}}</span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">清单版本：</span>
                        <span class="text-right" v-text="item.mVersion"></span>
                        </p>
                        <p class="item-list clearfix">
                        <span class="text-left">明细数量：</span>
                        <span class="text-right" v-text="item.details.length"></span>
                        </p>
                    </div>
                    </li>
                </ul>
                </div>
            </div>
            <!-- <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                <button class="editBtnS">网页预览</button>
                <button class="editBtnC">打印当前页标签</button>
                </div>
            </div> -->
        </div>
        <div id="edit">
            <el-dialog title="选择关联清单" :visible.sync="addAssociationListDialog" @close="addAssociationListCancle">
                <div class="editBody">
                <div class="bindListHead">
                    <div class="bindListHeadLeft">
                    <div>
                        <label class="listText">清单名称关键字：</label>
                    </div>
                    <div>
                        <input type="text" v-model="detailName" class="listInp"/>
                    </div>

                    </div>
                    <div class="bindListHeadRight">
                    <div>
                        <label class="listText">创建时间：</label>
                    </div>
                    <div class="searchTime">
                        <el-date-picker v-model="startDate" class="time1" type="date">
                        </el-date-picker>
                        <el-date-picker v-model="endDate" class="time" type="date">
                        </el-date-picker>
                    </div>
                    </div>
                </div>
                <div class="bindListHead">
                    <div class="bindListHeadLeft">
                    <label class="listText1">业务来源：</label>
                    <select class="relaType" v-model="relaTypeValue">
                        <option v-for="(item,index) in relaTypeList" :key="index" :value="item.value"
                                v-text="item.label"></option>
                    </select>
                    </div>
                    <div class="bindListHeadRight">
                    <label class="listText1">业务状态：</label>
                    <select class="serviceState" v-model="serviceStateValue">
                        <option v-for="(item,index) in serviceStateList" :key="index" :value="item.value"
                                v-text="item.label"></option>
                    </select>
                    </div>
                </div>
                <div class="bindListsearchBtn">
                    <button class="searchBtn" @click="getLoadManifest">查询</button>
                </div>
                <div class="bindListTab">
                    <label class="searchResultText">查询结果</label>
                    <div class="siteSearch" @click="siteSearch()">场景选择</div>
                    <div class="searchTab">
                        <table border="1" width='100%'>
                            <thead>
                            <tr>
                            <th></th>
                            <th>清单类型</th>
                            <th>清单ID</th>
                            <th>清单名称</th>
                            <th>明细数量</th>
                            <th>业务来源</th>
                            <th>业务状态</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in loadManifestList" :key="index" :class="[{'active':item.checked}]"
                                @click="checkItem1(index)">
                            <td>
                                <el-checkbox v-model="item.checked"></el-checkbox>
                            </td>
                            <td v-text="parseType(item.type)"></td>
                            <td v-text="item.detailId"></td>
                            <td v-text="item.detailName"></td>
                            <td v-text="item.componentCount"></td>
                            <td v-text="parseMBSource(item.relaType)"></td>
                            <td v-text="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"
                                :title="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="datagrid-pager pagination" v-if="loadManifestList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                        <tr>
                        <td>
                            <select class="pagination-page-list" v-model="pageDetial_1.pagePerNum">
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
                            <span class="pagination-title" style="padding-left:5px;">第</span>
                        </td>
                        <td>
                            <input class="pagination-num" type="text" v-model="pageDetial_1.currentPage">
                        </td>
                        <td>
                            <span class="pagination-title"
                                style="padding-right:5px;">共{{Math.ceil(pageDetial_1.total / pageDetial_1.pagePerNum)}}页</span>
                        </td>
                        <td>
                            <div class="pagination-btn-separator"></div>
                        </td>
                        <td>
                            <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                        </td>
                        <td>
                            <a href="javascript:void(0)" class="btn-right0 btn-TAB" @click="changePage(2)"></a>
                        </td>
                        <td>
                            <div class="pagination-btn-separator"></div>
                        </td>
                        <td>
                            <a href="javascript:void(0)" @click="getLoadManifest()" class="btn-refresh btn-TAB"></a>
                        </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title"
                        v-text="'显示1到'+pageDetial_1.pagePerNum+',共'+pageDetial_1.total+'记录'"></div>
                    <div style="clear:both;"></div>
                    </div>
                </div>
                </div>
                <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addAssociationListMakeSure">确定</button>
                <button class="editBtnC" @click="addAssociationListCancle">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="mask" v-if="uploadshow||labelListShow"></div>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
var ScreenPara
import commonList from '../planCost/qingDan.vue'
export default {
    name:'fieldMessage',
    data(){
        window.addEventListener("message", (evt)=>{this.callback(evt)});
        return{
            dataShow:true,//空数据
            contactIndexList:'',
            sendmessageUser:'',//发件人
            sendMsgUserValue:'',//发件群组
            endFileMessage:false,
            allSelectUgId:'',
            selectUgId:'',
            mainSendMsgValue:'',
            copySendMsgValue:'',
            createSendUgId:'',
            textarea:'',
            ugList:'',
            allUgList:'',
            contactList:'',
            rowsList:'',
            rowsListLength:0,
            screenLeft:{
                show:true,
                item:2
            },
            ischeck:'',
            newFileshow:true,
            showLeftContent:true,
            projectValue:'',
            uploadshow:false,
            type:'',
            imageName:'',
            fileId:[],
            attachId:[],
            relaList:'',
            mId:'',
            filesList:'',
            attachList:'',
            title:'',
            rightContactList:'',
            labelListShow:false,
            showCommonList:false,
            checkList:'',
            addAssociationListDialog:false,
            detailName: '',//清单名关键字
            startDate: '',//查询开始时间
            endDate: '',//查询结束时间
            relaTypeValue: "",
            relaTypeList: [
                {
                    value: 0,
                    label: "全部"
                },
                {
                    value: 2,
                    label: "文档管理-关联构件"
                },
                {
                    value: 3,
                    label: "成本管理-报表快照"
                },
                {
                    value: 4,
                    label: "成本管理-工程量"
                },
                {
                    value: 5,
                    label: "成本管理-物料量"
                },
                {
                    value: 6,
                    label: "物资采购-订货管理"
                }
            ],//业务来源
            serviceStateValue: "",
            serviceStateList: [
                { value:'0-0',label:"全部"},
                { value:'3-00',label:"未定义(设计管理"},
                { value:'3-10',label:"方案设计(设计管理"},
                { value:'3-40',label:"初步设计(设计管理"},
                { value:'3-70',label:"施工图设计(设计管理"},
                { value:'3-A0',label:"施工图深化设计(设计管理"},
                { value:'4-0',label:"未定义(成本管理"},
                { value:'4-1',label:"构件量核对中(成本管理"},
                { value:'4-2',label:"构件量核对完成(成本管理"},
                { value:'4-3',label:"工程量核对中(成本管理"},
                { value:'4-4',label:"工程量核对完成(成本管理"},
                { value:'4-5',label:"物料量核对中(成本管理"},
                { value:'4-6',label:"物料量核对完成(成本管理"},
                { value:'8-0',label:"未定义(物资采购"},
                { value:'8-1',label:"待选型(物资采购"},
                { value:'8-2',label:"已选型(物资采购"},
                { value:'8-3',label:"已订货(物资采购"},
                { value:'8-4',label:"生产中(物资采购"},
                { value:'8-5',label:"已待发(物资采购"},
                { value:'8-6',label:"已发货(物资采购"},
                { value:'8-7',label:"已到场(物资采购"},
                { value:'8-8',label:"已抽检(物资采购"},
                { value:'8-9',label:"已验收(物资采购"},
                { value:'16-0',label:"未定义(进度计划"},
                { value:'16-1',label:"已计划(进度计划"},
                { value:'16-2',label:"已开工(进度计划"},
                { value:'16-3',label:"已完工(进度计划"},
                { value:'32-0',label:"未定义(施工现场"},
                { value:'32-1',label:"等待初审(施工现场"},
                { value:'32-2',label:"初审补充(施工现场"},
                { value:'32-3',label:"初审通过(施工现场"},
                { value:'32-4',label:"初审驳回(施工现场"},
                { value:'32-5',label:"等待终审(施工现场"},
                { value:'32-6',label:"终审补充(施工现场"},
                { value:'32-7',label:"终审通过(施工现场"},
                { value:'32-8',label:"终审驳回(施工现场"},
            ],//业务状态
            pageDetial_1: {
                pagePerNum: 10,//一页几份数据
                currentPage: 1,//初始查询页数 第一页
                total: '',//所有数据
            },
            loadManifestList:'',
            manifestIdList:[],
            qjContactList:{},
            addAndSendList:'',
            vpList:[],
            qjContactId:0,
            QJFileManageSystemURL:'',
            base64Str:'',
            elementFilter:'',
            uploadViewPointList:[]
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
        this.getContactIndex();
        this.validateAuth();
    },
    filters:{
        timeChange(val){
            if (val == null) {
                return;
                } else {
                return moment(val).format("YYYY-MM-DD HH:mm");
                }
            }

    },
    watch:{
        allSelectUgId: function (val,oldval) {
        var vm = this;
        this.screenLeft.item=2;
        this.rowsList='',
        this.rowsListLength=0,
        vm.getContactList();
        // this.delContact();
      },
       'pageDetial_1.currentPage': function (val, oldval) {
        var vm = this
        vm.getLoadManifest()
      },
      'pageDetial_1.pagePerNum': function (val, oldval) {
        var vm = this
        vm.getLoadManifest()
      },
    },
    methods:{
        //进入现场发文页面
        getContactIndex(){
            axios({
            method:'get',
            url:this.BDMSUrl+'/project2/buildSite/contactIndex',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
            },
            
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.contactIndexList=response.data.rt;
                    this.allUgList=response.data.rt.pug.ugList;
                    this.ugList=response.data.rt.pug.allUgList
                    this.selectUgId=response.data.rt.pug.selectUgId;
                    this.allSelectUgId=response.data.rt.pug.selectUgId;
                    // this.mainSendMsgValue=response.data.rt.pug.selectUgId;
                    // this.copySendMsgValue=response.data.rt.pug.selectUgId;
                    //  this.createSendUgId=response.data.rt.pug.selectUgId;
                   
                    console.log(this.contactIndexList);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        //
        validateAuth(){
             axios({
            method:'get',
            url:this.BDMSUrl+'/project2/buildSite/validateAuth',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
                type:1,
            },
            }).then(response=>{
                if(response.data.cd=='0'){
                   this.endFileMessage=true;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        //获取左侧列表信息
        getContactList(){
            axios({
            method:'get',
            url:this.BDMSUrl+'/project/contactList2/getContactList',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
                status:this.screenLeft.item,
                ugId:this.allSelectUgId
            },
            }).then(response=>{
                if(response.data.rt.rows!=null){
                    this.contactList=response.data.rt;
                    this.rowsList=response.data.rt.rows;
                    this.dataShow=false;
                    this.rowsListLength=response.data.rt.rows.length;
                    console.log(this.contactList);
                }else if(response.data.rt.rows==null){
                    this.rowsList=[];
                    this.rowsListLength=0;
                }
                else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        //添加或者删除
        addAndSend(num){
            var vm=this;
            if(this.projectValue==''){
                this.$message({
                    type:'info',
                    message:'请填写发文的主题!'
                })
            }else if(this.mainSendMsgValue==''){
                this.$message({
                    type:'info',
                    message:'请选择发文的主送!'
                })
            }else if(this.textarea==''){
                this.$message({
                    type:'info',
                    message:'请填写发文的内容!'
                })
            }else{
            vm.$set(vm.qjContactList,'content',this.textarea)
            vm.$set(vm.qjContactList,'copySendUgIds',this.copySendMsgValue)
            vm.$set(vm.qjContactList,'createSendUgId',this.allSelectUgId)
            vm.$set(vm.qjContactList,'id',this.qjContactId)
            vm.$set(vm.qjContactList,'isSend',num)
            vm.$set(vm.qjContactList,'mainSendUgId',this.mainSendMsgValue)
            vm.$set(vm.qjContactList,'projId',this.projId)
            vm.$set(vm.qjContactList,'subject',this.projectValue)
            var vpListUid=[];
            console.log(vm.uploadViewPointList)
             vm.uploadViewPointList.forEach((item,index)=>{
                    vpListUid.push({
                        elementFilter:this.elementFilter,
                        extension:item.fileExtension,
                        relativePath:item.filePath,
                        uuid:item.fileUuid,
                        name:item.fileName,
                        projId:this.projId,
                        subProjId:this.defaultSubProjId,
                    })
            })
            // console.log(vm.qjContactList);
            axios({
            method:'post',
            url:this.BDMSUrl+'/project/contactList2/add',
            headers:{
                'token':this.token
            },
            data:{
                attachList:this.uploadAttachIdList,
                fileIdList:this.uploadfileId,
                manifestIdList:this.manifestIdList,
                qjContactList:this.qjContactList,
                vpList:vpListUid
            }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.addAndSendList=response.data.rt;
                    // console.log(this.addAndSendList);
                    // this.ischeck=0;
                    this.ischeck=this.addAndSendList.id;
                    this.getList();
                    this.screenLeft.item=0;
                    this.getContactList();
                    this.screenLeft.item=1;
                    this.getContactList();
                    this.screenLeft.item=2;
                     this.getContactList();
                     if(this.addAndSendList.isSend==0){
                        this.screenLeft.item=0;
                        this.rowsListLength=0;
                        this.rowsList='';
                        this.getContactList();
                     }else if(this.addAndSendList.isSend==1){
                        this.screenLeft.item=1;
                        this.rowsListLength=0;
                        this.rowsList='';
                        this.getContactList();
                     }
                   
                   
                    // this.getList();
                    // this.getList()
                    // console.log(this.contactList);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        }
        },
        
        backToH() {
        var vm = this
        vm.showCommonList = false
        },
         // 补零
        addZero(num, size) {
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
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
        changePage(val, isTop) {//分页 0 -1 1 2
            var vm = this;
            if (isTop) {
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
            } else {
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
            }
        },
        labelListCancle() {
            var vm = this
            vm.labelListShow = false
        },
        sendMsg(){
            this.rowsListLength=0;
            this.screenLeft.item = 2;
            this.rowsList='';
            this.getContactList();
            this.showLeftContent=true;
            this.ischeck='';
            this.projectValue='';
        },
        receiveMsg(){
            this.screenLeft.item = 1;
            this.rowsListLength=0;
            this.rowsList='';
            this.getContactList();
            this.showLeftContent=true;
            this.ischeck='';
            this.projectValue='';

        },
        draftMsg(){
            this.screenLeft.item = 0;
            this.rowsListLength=0;
            this.rowsList='';
            this.getContactList();
            this.showLeftContent=true;
            this.ischeck='';
            this.projectValue='';
        },
        checkItem(num){
            this.ischeck=num;
            // this.rowsListLength=0;
            this.getList();
            this.showLeftContent=false;

        },
        //关联清单选中
        checkItem1(val) {
            var vm = this;
            var fileCheckList = [];
            for (var i = 0; i < vm.loadManifestList.length; i++) {
            vm.$set(vm.loadManifestList[i], 'checked', false)
            }
            vm.$set(vm.loadManifestList[val], 'checked', true)
            vm.checkedItem = vm.loadManifestList[val]
            this.manifestIdList.push(String(vm.loadManifestList[val].detailId))
            this.manifestIdList=Array.from(new Set(this.manifestIdList))
            console.log(this.manifestIdList)
            // console.log(JSON.stringify(vm.checkedItem))
        },
        siteSearch(){
           var vm=this;
           vm.$message({
               type:'success',
               message:'虚拟场景面板未打开，请打开左侧虚拟场景面板。'
           })


        },
        cancleLeft(){
            this.showLeftContent=!this.showLeftContent;
        },
        newFile(){
            this.showLeftContent=false;
            this.newFileshow=false;
             this.screenLeft.item=0;
             this.rowsListLength=0;
            this.rowsList='';
            // this.getContactList();
            this.ischeck='';
            this.projectValue='';
            this.mainSendMsgValue='';
            this.copySendMsgValue='';
            this.textarea='';
            this.fileId=[];
            this.attachId=[];
            this.uploadAttachId={};
            this.uploadAttachIdList=[];
            this.uploadfileId=[];
            this.uploadViewPointList=[];
            this.relaList=[];
        },
        showUploadBox_img(){
            var vm = this
            vm.type = 1
            vm.uploadshow = true
        },
        showUploadBox_file(){
             var vm = this
            vm.type = 2
            vm.uploadshow = true
        },
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
			case "ViewpointSubmited":
                ScreenPara = e.data.parameter;
                this.base64Str=ScreenPara.para2;
                this.elementFilter=ScreenPara.para1;
                 var vm = this
                    axios({
                        method:'POST',
                        // /project/contactList2/uploadViewPoint
                        url:this.BDMSUrl+'project2/dc/uploadViewPoint/1/'+this.projId,
                        headers:{
                            'token':vm.token
                        },
                        data:{"base64":this.base64Str}
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            this.$message({
                                type:'success',
                                message:'视点截图成功'
                            })
                            this.uploadViewPointList.push(response.data.rt)
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
		    }
        },
        viewSpot(){
            if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })}else{
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                 const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"AddViewpoint",parameter:123},"*");
            }
        },
        fileChanged(file){
            var vm = this
            const list = vm.$refs.file.files
            vm.imageName = list[0].name
            if(vm.type == 1){
                 vm.attachList = list[0]
                 console.log(vm.attachList);
            }else{
                 vm.filesList = list[0];
                 console.log(vm.attachList);
            }
        },
        upImgCancle(){
            var vm = this
            vm.uploadshow = false
            vm.imageName = '未选择任何文件'
            vm.filesList = null
            vm.attachList = null
        },
        uploadIMG(){
            var vm = this
            if(vm.type == 1){
                if(vm.attachList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择图片！'
                    })
                    return false
                }
            }else{
                if(vm.filesList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择文件！'
                    })
                    return false
                }
            }
            var returnUrl = vm.BDMSUrl+'project/contactList2/dcUpload?ugId='+vm.selectUgId+"&type="+vm.type+'&dirId=-1'
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
            formData.append('type',1);
            if(vm.type == 1){
                  formData.append('file',vm.attachList);
            }else{
                formData.append('file',vm.filesList);
            }
            formData.append('userId',vm.userId);
            formData.append('modelCode','006');//施工现场的文件代码
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL+'/uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                if(response.data.cd==0){
                    if(vm.type == 1){
                         vm.attachId.push(response.data.rt)
                         for (var i = 0; i < vm.attachId.length; i++) {
                               vm.$set(vm.attachId[i],'relativePath', vm.attachId[i].filePath)
                               vm.$set(vm.uploadAttachId, 'relativePath', vm.attachId[i].filePath)
                               vm.$set(vm.uploadAttachId, 'fileExtension', vm.attachId[i].fileExtension)
                               vm.$set(vm.uploadAttachId, 'fileName', vm.attachId[i].fileName)
                               vm.$set(vm.uploadAttachId, 'fileUuid', vm.attachId[i].fileUuid)
                               vm.$set(vm.uploadAttachId, 'fileMd5', vm.attachId[i].fileMd5)
                               vm.$set(vm.uploadAttachId, 'fileSize', vm.attachId[i].fileSize)
                                vm.uploadAttachIdList.push(vm.uploadAttachId)
                                vm.uploadAttachIdList=Array.from(new Set(vm.uploadAttachIdList));
                            }  
                            console.log(vm.uploadAttachId);
                            console.log(vm.uploadAttachIdList);
                        }else{
                            vm.fileId.push(response.data.rt);
                            for (var i = 0; i < vm.fileId.length; i++){
                                vm.uploadfileId.push(String(vm.fileId[i].fileId));
                                vm.uploadfileId=Array.from(new Set(vm.uploadfileId));//去重
                            }
                            // vm.$set(vm.uploadfileId, 'fileId', vm.fileId[i].fileId)
                            console.log(vm.uploadfileId); 
                        }
                    vm.$refs.file.value = ''
                    vm.upImgCancle()
                }
            }).catch((err)=>{
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        },
        selectImg(){
             this.$refs.file.click()
        },
        //获取联系单附件详情
        getList(){
            axios({
            method:'get',
            url:this.BDMSUrl+'/project/contactList2/list',
            headers:{
                'token':this.token
            },
            params:{
                projectId:this.projId,
                id:this.ischeck
            },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.rightContactList=response.data.rt.rows[0];
                    this.projectValue=this.rightContactList.subject;
                    this.mainSendMsgValue=this.rightContactList.mainSendUgId;
                    this.copySendMsgValue=parseInt(this.rightContactList.copySendUgIds);
                    this.textarea=this.rightContactList.content;
                    this.fileId=this.rightContactList.fileList;
                    this.attachId=this.rightContactList.attachList;
                    console.log(this.attachId);
                    this.relaList=this.rightContactList.manifestMains;
                    //  this.qjContactId=this.rightContactList.id;
                     this.sendMsgUserValue=this.rightContactList.createSendUgId;
                     this.sendmessageUser=this.rightContactList.createUserStr;
                     console.log(this.sendmessageUser)
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        initData(val){
            if(!val)return ''
            var tt=moment(val).format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
        preview(val){
            var vm = this
            if(val){
                window.open(vm.QJFileManageSystemURL+val+"/preview");
            }else{
                 vm.$message({
                    type:'info',
                    message:'出错'
                })
            }
        },
        //定位
        relocation(){
            const app = document.getElementById('webIframe').contentWindow;
            app.postMessage({command:"MoveToViewpoint",parameter:ScreenPara},"*");
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        relocation1(val){
            if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })
        }else{
                const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"Init",parameter:null},"*");
                app.postMessage({command:"MoveToViewpoint",parameter:{para1:val}},"*");
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        },
        deleteFile(index,type){
            var vm = this
            if(type == 1){
                vm.attachId.splice(index,1)
            }else{
                vm.fileId.splice(index,1)
            }
        },
        deleteFile1(index){
            var vm=this
            vm.uploadViewPointList.splice(index,1)
        },
        downLoad(filePath){
            //latestFile(fileId,fgId,"下载了文件"+fileName);
            var vm = this
            if(!filePath){
                vm.$message({
                    type:'info',
                    message:'出错'
                })
                return false
            }
            window.open(vm.QJFileManageSystemURL + filePath);
        },
        showDetialList(item) {
            this.showCommonList = true;
            this.checkList = item;
        },
        qrcode(val) {
        this.labelListShow = true;
        this.relaList.forEach((item) => {
          if (item.pkId == val) {
            this.relaList = [];
            this.relaList.push(item);
          }
        })
        },
        //关联清单列单的定位
      location() {
          var vm=this;
        vm.$message({
            type:'success',
            message:'虚拟场景面板未打开，请打开左侧虚拟场景面板。'
        })
      },
      //将清单与任务解除关联关系
    //   deleteAssociationList(num) {
    //     this.deleteAssociationListDialog = true;
    //     this.relaList.forEach((item) => {
    //       if (item.pkId == num) {
    //         this.mId = item.pkId
    //       }
    //     })
    //   },
        //删除联系单
        delContact(num){
            axios({
            method:'post',
            url:this.BDMSUrl+'project/contactList2/delContact',
            headers:{
                'token':this.token
            },
            params:{
                // projId:this.projId,
                status:this.screenLeft.item,
                ugId:this.allSelectUgId,
                contactId:num
            },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getContactList();
                    this.showLeftContent=true;
                    this.ischeck='';
                    this.projectValue='';
                    // this.screenLeft.item=-3;
                    this.mainSendMsgValue='';
                    this.copySendMsgValue='';
                    this.textarea='';
                    this.fileId='';
                    this.attachId='';
                    this.uploadViewPointList=[];
                    // console.log(this.contactList);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        //点击获取清单
        getAssociationList(){
            this.addAssociationListDialog=true;
            this.relaTypeValue=this.relaTypeList[0].value;
            this.serviceStateValue=this.serviceStateList[0].value;
            this.getLoadManifest();
        },
        getLoadManifest(){
            axios({
                method:'get',
                url: this.BDMSUrl +'project/contactList2/findManifestInfo',
                headers: {
                    'token': this.token
                },
                params: {
                    projectId: parseInt(this.projId),
                    page: this.pageDetial_1.currentPage,
                    rows: this.pageDetial_1.pagePerNum,
                    manifestName:this.detailName,
                    startDate:this.startDate,
                    endDate:this.endDate,
                    relaType:this.relaTypeValue,
                    serviceState:this.serviceStateValue
                }
                }).then(response => {
                if (response.data.cd == '0') {
                    this.pageDetial_1.total = response.data.rt.total;
                    this.loadManifestList = response.data.rt.rows;
                    //   console.log(JSON.stringify(this.loadManifestList))
                } else if (response.data.cd == '-1') {
                    alert(response.dara.msg);
                }
                })
            },
         //取消关联清单
        addAssociationListCancle(){
            this.serviceStateValue='';
            this.detailName='';
            this.startDate='';
            this.endDate='';
            this.relaTypeValue='';
             this.checkedItem={};
             this.loadManifestList=[];
            this.addAssociationListDialog=false;
        },
        //添加关联清单确认
        addAssociationListMakeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/project2/buildSite/getManifestInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    mId:this.checkedItem.detailId,
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.relaList.push(response.data.rt);
                    console.log(this.relaList);
                    this.addAssociationListDialog=false;
                    // console.log(this.relaList);
                    // this.addAssociationListDialog=false;
                    // this.getLoadManifest();
                    // this.checkedItem={};
                    // this.loadManifestList=[];
                    // alert(response.data.msg);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },

    }  
}
</script>
<style lang="less">
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
    #edit .bindListHead .bindListHeadRight .el-input__inner {
            width: 130px;
            height: 36px;
        }

    /**********一下是分页器的样式***************/
      .datagrid-pager {
        display: block;
        height: 31px;
        margin: 0 auto;
        width: 600px;
        border: 1px solid #d4d4d4;
        // padding: 3px 4px;
        box-sizing: border-box;
        background: #f5f5f5;
      }

      .pagination {
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

      .btn-TAB {
        display: block;
        width: 26px;
        height: 26px;
        cursor: pointer;
        position: relative;
        &:hover {
          box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
          border-radius: 5px;
        }
        &::after {
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

      .btn-left0::after {
        background-image: url('../../assets/fenye2.png');
      }

      .btn-left1::after {
        background-image: url('../../assets/fenye1.png');
      }

      .btn-right0::after {
        background-image: url('../../assets/fenye4.png');
      }

      .btn-right1::after {
        background-image: url('../../assets/fenye3.png');
      }

      .btn-refresh::after {
        background-image: url('../../assets/fenye5.png');
      }

      .pagination-title {
        font-size: 14px;
        color: #333333;
      }

      .pagination-info {
        float: right;
        margin-top: 5px;
        margin-right: 25px;
      }

      .clearfix {
        clear: both;
        overflow: hidden;
        content: '';
      }
</style>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
     .el-input__inner {
            width: 400px !important;
        }
    .upInput{
        display: none;
    }
    li{
        list-style: none;
    }
    #fieldMessage{
        .project{
            margin: 0 20px !important;
        }
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
        .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            height:800px;
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
        .box-left{
            width: 100%;
            height: 100%;
            position: relative;
            .box_left_text_show{
                width: 40% !important;
            }
            .box_left_text{
                // width: 90%;
                // margin-left:20px;
                height: 100%;
                // margin-top:75px;
                display: block;
                position: absolute;
                left: 40px;
                bottom: 0;
                width: 100%;
                padding-left: 25px;
                top: 40px;
                transition: all .5s ease;
                background: #fff;
                z-index: 10;
                overflow: auto;
                .left_slider{
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 25px;
                    border-right: 1px solid #ccc;
                    .item-sendMsg{
                        display: block;
                        width: 25px;
                        height: 68px;
                        background: #fafafa;
                        padding-top:15px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        border-top:1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom: -9px;
                            width: 23px;
                            height: 15px;
                            background: #fafafa;
                            border-top: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                        }
                    } 
                    .item-reviceMsg{
                        display: block;
                        width: 25px;
                        height: 56px;
                        background: #fafafa;
                        padding-top:12px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom:-7px;
                            width: 23px;
                            height: 13px;
                            background: #fafafa;
                            border-bottom: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                            }
                    }
                    .item-draft{
                        display: block;
                        width: 25px;
                        height: 56px;
                        background: #fafafa;
                        padding-top:12px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom:-7px;
                            width: 23px;
                            height: 13px;
                            background: #fafafa;
                            border-bottom: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                            }
                    }
                    .active { //上边 收件 高显
                        .item-sendMsg {
                        background: #fff;
                        color: #fc3439;
                        }
                        .item-reviceMsg {
                        z-index: 15;
                        }
                        .item-draft {
                        z-index: 10;
                        }
                    }
                    .active-version { //中间 收件 高显
                        .item-reviceMsg { //收件
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after {
                            background: #fff;
                        }
                        }
                        .item-sendMsg::after { //发件
                        background: #fff;
                        }
                        .item-draft { //草稿
                        z-index: 10;
                        }
                    }
                    .active-version-3 { //下边 草稿 高显
                        .item-reviceMsg {
                        z-index: 15;
                        &::after {
                            background: #fafafa;
                        }
                        }
                        .item-sendMsg::after {
                            background: #fff;
                        }
                        .item-draft {
                            z-index: 10;
                            background: #fff;
                            color: #fc3439;
                            &::after {
                                background: #fff;
                            }
                        }
                    }
                }
                // .left_content_box1{
                //     width: 40%;
                // }
                .left_content{
                    border-top:1px solid #ccc;
                    padding: 19px 13px 0 10px;
                    .left_content_box{
                        //发送样式
                        .left_content_receive{
                            .left_content_header{
                                height: 33px;
                                border-bottom: 1px solid #ccc;
                                    .item_word{
                                        font-size: 16px;
                                        color:#fc3439;
                                        line-height: 16px;
                                        float: left;
                                        margin-left:10px;
                                        font-weight: bold;
                                    }
                                    .item-upload{
                                        float: right;
                                        margin-right: 140px;
                                        background: #fc3439;
                                        color: #ffffff;
                                        font-size: 12px;
                                        height: 26px;
                                        width: 78px;
                                        border-radius: 2px;
                                        text-align: center;
                                        line-height: 26px;
                                        cursor: pointer;
                                    }
                            }
                            .left_content_body{
                                ul{
                                    li{
                                        float: left;
                                        margin-left:30px;
                                        margin-top:10px;
                                        width: 99%;
                                        height: 28px;
                                        font-size: 14px;
                                        line-height: 28px;
                                        text-align: left;
                                        color:#666666;
                                        cursor: pointer;
                                        .time{
                                            display: inline-block;
                                        }
                                        .value_hidden{
                                            max-width: 150px;
                                            overflow:hidden; 
                                            text-overflow:ellipsis;
                                            white-space:nowrap;

                                        }
                                        .value{
                                            display: inline-block;
                                            margin-left:20px;
                                        }
                                        .left_deleteBtn{
                                            display: inline-block;
                                            // float: right;
                                            margin-left:50px;
                                            margin-bottom:6px;
                                            width: 16px;
                                            height: 16px;
                                            cursor: pointer;
                                            background: url('../../assets/delete.png')no-repeat 0 0;
                                        }
                                        .circle{
                                            width: 8px;
                                            height: 8px;
                                            vertical-align: middle;
                                            margin-right: 5px;
                                            margin-bottom: 21px;
                                            border-radius: 50%;
                                            background: #fc3439;
                                            display: inline-block;
                                        }
                                    }
                                    .checkpoint{
                                        color:black;
                                        font-weight: bold;
                                        background: #fafafa;
                                    }
                                }
                            }
                        }

                    }
                }
            }
            ::-webkit-scrollbar{width:0px}
            .box-left-content{
                // margin-top:76px;
                display: block;
                position: absolute;
                right: 0px;
                bottom: 31px;
                width: 65%;
                padding-left: 25px;
                top: 41px;
                transition: all .7s ease;
                background: #fff;
                z-index: 10;
                // height: inherit;
                overflow: auto;
                // overflow-y: auto;
                //  border-top: 1px solid #ccc;
                //  padding: 19px 13px 0 10px;
                border-left:1px solid #ccc;
                 box-shadow:-2px 0px 1px #aaa;
                
                // -webkit-box-shadow: 3px 3px 3px #aaaaaa;
                
                .cancle{
                    position: absolute;
                    // bottom:0;
                    top: 0;
                    left: 0px;
                    width: 30px;
                    // height: inherit;
                   
                    // border:1px solid #ccc;
                    // border-left: 1px solid #ccc;
                    // z-index: 12;
                    
                    .cancle1{
                        position: absolute;
                        height: 30px;
                        top: 2px;
                        left: 2px;
                        width: 30px;
                        // border-left:1px solid #ccc;
                        // border-bottom:1px solid #ccc;
                        // box-shadow:1px 1px 3px #aaa;
                        background-image: url('./images/cancle.png');
                    }
                }
                .box_header{
                    height: 50px;
                    margin-left:20px;
                    // width: 90%;
                    border-bottom: 1px solid #ccc;
                    .hidden{
                        max-width: 900px;
                        overflow:hidden; 
                        text-overflow:ellipsis;
                         white-space:nowrap;
                    }
                    span{
                        font-size: 16px;
                        color:#fc3439;
                        line-height: 16px;
                        float: left;
                        margin-left:25px;
                        margin-top:20px;
                        font-weight: bold;
                        display: inline-block;
                    }

                }
                .box_content{
                    table{
                        tbody{
                            th{
                                width:80px;
                                font-size: 14px;
                                line-height: 14px;
                                text-align:right;
                                color:#666;
                            }
                            tr{
                                width: 100%;
                                margin-left:25px;
                                margin-top:30px;
                                display: inline-block;
                                
                            }
                        }
                        
                    }
                    .files{
                        width:400px;
                        height: 30px;
                        margin-left:10px;
                        margin-top:10px;
                            .text{
                                font-size: 14px;
                                line-height: 14px;
                                color:#666;
                                font-weight: bold;
                                width:70px;
                                text-align:right;
                            }
                            span{
                                line-height: 16px;
                                height: 16px;
                                float: left;
                                position: relative;
                                cursor: pointer;
                                margin-left: 18px;
                                margin-right: 20px;
                                font-size: 12px;
                                color: #666666;
                            }
                            .icon-eye::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 12px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/eye.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-image::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 14px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/image.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-file::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 16px;
                                height: 18px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/file.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-message::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 15px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/message.png')no-repeat 0 0;
                                content: '';
                            }
                        }
                    .btn{
                        float: right;
                        margin-right:100px;
                        .item-save{
                            float: right;
                            margin-right: 14px;
                            background: #fc3439;
                            color: #ffffff;
                            font-size: 12px;
                            height: 26px;
                            width: 78px;
                            border-radius: 2px;
                            text-align: center;
                            line-height: 26px;
                            cursor: pointer;

                        }
                        .item-cancle{
                            float: right;
                            margin-right: 14px;
                            background: #666;
                            color: #ffffff;
                            font-size: 12px;
                            height: 26px;
                            width: 78px;
                            border-radius: 2px;
                            text-align: center;
                            line-height: 26px;
                            cursor: pointer;
                        }

                    }
                    .btn1{
                        display: none !important;
                    }
                    .fileitem{
                        margin:30px 0px 30px 65px;
                        .item-file{
                                float: left;
                                width: 290px;
                                height: 120px;
                                margin: 20px 15px 0 0;
                                border-radius: 6px;
                                box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                                position: relative;
                                padding: 8px;
                                .item-file-attach{
                                    width: 100%;
                                    height: 120px;
                                    margin: 0;
                                    padding: 0;
                                    border-radius:2px;
                                    cursor: pointer;
                                }
                                .actionbox{
                                    display: block;
                                    position: absolute;
                                    bottom: 0;
                                    width: 100%;
                                    height: 36px;
                                    background: rgba(40, 40, 40, .4);
                                    transform: translateY(36px);
                                        transition: all ease .5s;
                                        .button-relocation{
                                             float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../planCost/images/location.png') no-repeat 0 0;
                                            cursor: pointer;
                                        }
                                        .button-search{
                                            float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../ManageDesign/images/search2.png')no-repeat 0 0;
                                            cursor: pointer;
                                        }
                                        .button-download{
                                        float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            background: url('../ManageDesign/images/download2.png')no-repeat 0 0;
                                        cursor: pointer;
                                        }
                                        .icon-delete{
                                            float: left;
                                            margin: 10px 40px;
                                            width: 16px;
                                            height: 16px;
                                            cursor: pointer;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                        } 
                                        .line{
                                        float: left;
                                            margin: 6px 0px;
                                            width: 1px;
                                            height: 24px;
                                            background: #cccccc;
                                        }
                                }
                                .checkbox-fileItem{
                                    display:block;
                                    position: absolute;
                                    top: 8px;
                                    left: 8px;
                                    width: 14px;
                                    height: 14px;
                                    border: 1px solid #cccccc;
                                    cursor: pointer;
                                }
                                .active{
                                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                                    border: 1px solid #fc3439;
                                }
                                .item-file-box{
                                    .item-file-image{
                                        float: left;
                                        margin-top:16px;
                                        width: 70px;
                                        height: 70PX;
                                        border-radius: 50%;
                                        background: #f2f2f2;
                                        img{
                                            width: 48px;
                                            height: 48px;
                                            display: block;
                                            margin-top: 13PX;
                                            margin-left: 11px;
                                        } 
                                    }
                                    .item-file-detial{
                                        display: block;
                                        margin-left:80px;
                                        .icon-goujian{
                                            float: right;
                                            width: 16px;
                                            height: 16px;
                                            cursor: pointer;
                                        }
                                        .icon-download{
                                            background: url('../ManageCost/images/download.png')no-repeat 0 0;
                                            margin-right: 20px;
                                            &:hover{
                                                background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                                            }
                                        }
                                        .icon-search{
                                            background: url('../ManageCost/images/search.png')no-repeat 0 0;
                                            margin-right: 20px;
                                            &:hover{
                                                background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                                            }
                                        } 
                                        .icon-delete{
                                            margin-right: 20px;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                            &:hover{
                                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                                            } 
                                        } 
                                        >h3{
                                            text-align: left;
                                            font-size: 14px;
                                            color: #333333;
                                            line-height: 20px;
                                            margin: 9px 0 8px;
                                            max-height: 40px;
                                            overflow: hidden;
                                        }   
                                        >p{
                                            font-size: 12px;
                                            line-height: 12px;
                                            color: #b3b3b3;
                                            text-align: left;
                                            margin-bottom:6px; 
                                        }
                                        .text-name{
                                            color: #336699;
                                        }
                                        .operation{
                                            display: block;
                                            position: absolute;
                                            bottom: 0;
                                            left: 88px;
                                            right: 0;
                                            span{
                                                color: #fc3439;
                                            }
                                        }
                                    }
                                }
                        }
                        .goujian-item{
                                // font-size: 12px;
                                // line-height: 12px;
                                // margin-top: 10px;
                                // padding: 10px;
                                // text-align: left;
                                // box-shadow: 0px 0px 8px rgba(93,94,94,.16);
                                // border-radius: 6px;
                                float: left;
                                width: 220px;
                                height: 120px;
                                margin: 20px 15px 0 0;
                                border-radius: 6px;
                                box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                                position: relative;
                                padding: 8px;
                                .icon-goujian{
                                    float: left;
                                    width: 16px;
                                    height: 16px;
                                    margin-right: 10px;
                                    cursor: pointer;
                                }
                                // .icon-add{
                                //     background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                //     margin-right: 56px;
                                //     &:hover{
                                //         background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                                //     }
                                // }
                                .icon-detial{
                                    background: url('../ManageCost/images/detial.png')no-repeat 0 0;
                                    margin-right: 56px;
                                    &:hover{
                                        background: url('../ManageCost/images/detial1.png')no-repeat 0 0;
                                    }
                                }
                                .icon-QRcode{
                                    background: url('../ManageCost/images/qrcode.png')no-repeat 0 0;
                                    &:hover{
                                        background: url('../ManageCost/images/qrcode1.png')no-repeat 0 0;
                                    }
                                }
                                .icon-location{
                                    background: url('../ManageCost/images/location.png')no-repeat 0 0;
                                    width: 12px;
                                    &:hover{
                                        background: url('../ManageCost/images/location1.png')no-repeat 0 0;
                                    }
                                }
                                .icon-delete{
                                    background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                    margin-right: 0;
                                    &:hover{
                                        background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                                    }
                                }
                                .clearfix{
                                    clear: both;
                                    overflow: hidden;
                                    content: "";
                                    // margin-top:5px;
                                }
                                .detial-text-name{
                                    color: #999999;
                                    width: 65px;
                                    display: inline-block;
                                    //  float: left;
                                }
                                .detial-text-value{
                                    display: inline-block;
                                    color: #333333;
                                    max-width: 90px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .item-detial{
                                    margin-top: 10px;
                                    font-size: 12px;
                                    line-height: 12px;
                                    text-align: left;
                                    width: 195px;
                                    &:first-of-type{
                                        margin-top: 6px;
                                    }
                                }
                                &:first-of-type{
                                    padding-top: 8px;
                                }
                        }
                    }
                    .item-file:hover{
                            box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                            .actionbox{
                                transform: translateY(0px);
                                transition: all ease .5s;
                            }
                    }
                }
            }
            .box-left{
                right: -30px;
                bottom: 0px;
                width: 0px;
                transition: all .7s ease;
                overflow:hidden;
            }
        }
        #edit{
            position: fixed;
            z-index: 3003;
            background: #ffffff;
            }
        #edit{
            .el-dialog__wrapper{
                .el-dialog__body {
                    .editBody {
                    width: 100%;
                        .bindListHead {
                            margin-top: -5px;
                            position: relative;
                            .bindListHeadLeft {
                            height: 80px;
                            // border:1px solid red;
                            width: 50%;
                            background: #fff;
                            .listText {
                                font-size: 14px;
                                line-height: 14px;
                                color: #666;
                                display: inline-block;
                                margin-left: -151px;
                            }
                            .listInp {
                                width: 270px;
                                height: 34px;
                                border: 1px solid #d1d1d1;
                                border-radius: 4px;
                                background: #fff;
                                padding-left: 10px;
                                margin-top: 5px;
                            }
                            .relaType {
                                width: 270px;
                                height: 36px;
                                position: relative;
                                color: #333333;
                                background-color: #fff;
                                background-image: none;
                                border: 1px solid #d1d1d1;
                                border-radius: 4px;
                                padding-left: 10px;
                                padding-right: 20px;
                                -webkit-box-sizing: border-box;
                                box-sizing: border-box;
                                font-size: 14px;
                                outline: none;
                                margin-top: 10px;
                                margin-left: 5px;
                            }
                            .listText1 {
                                font-size: 14px;
                                line-height: 14px;
                                color: #666;
                                display: block;
                                margin-left: -189px;
                            }
                            }
                            .bindListHeadRight {
                            height: 80px;
                            // border:1px solid red;
                            width: 50%;
                            background: #fff;
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            .listText {
                                font-size: 14px;
                                line-height: 14px;
                                color: #666;
                                display: inline-block;
                                margin-left: -214px;
                            }
                            .searchTime {
                                // float: left;
                                .time1 {
                                position: absolute;
                                top: 28px;
                                right: -129px;
                                }
                                .time {
                                position: absolute;
                                top: 27px;
                                right: -267px;
                                }

                            }
                            .listText1 {
                                font-size: 14px;
                                line-height: 14px;
                                color: #666;
                                display: block;
                                margin-left: -208px;
                            }
                            .serviceState {
                                width: 270px;
                                height: 36px;
                                position: relative;
                                color: #333333;
                                background-color: #fff;
                                background-image: none;
                                border: 1px solid #d1d1d1;
                                border-radius: 4px;
                                padding-left: 10px;
                                padding-right: 20px;
                                -webkit-box-sizing: border-box;
                                box-sizing: border-box;
                                font-size: 14px;
                                outline: none;
                                margin-top: 10px;
                                margin-left: -15px;
                            }
                            }
                        }
                        .bindListsearchBtn {
                            height: 40px;
                            margin-top: 10px;
                            .searchBtn {
                            // float: left;
                            margin-left: -480px;
                            background: #fc3439;
                            color: #fff;
                            font-size: 14px;
                            font-weight: normal;
                            width: 111px;
                            height: 36px;
                            border: none;
                            padding: 0;
                            cursor: pointer;
                            border-radius: 2px;
                            }
                        }
                        .bindListTab {
                            margin-top: 20px;
                            .searchResultText {
                            // display: block;
                            font-size: 14px;
                            line-height: 14px;
                            color: #666666;
                            margin-left: -432px;
                            }
                            .siteSearch {
                            width: 70px;
                            height: 25px;
                            border: 1px solid #ccc;
                            border-radius: 2px;
                            background: #fff;
                            font-size: 12px;
                            line-height: 25px;
                            box-sizing: border-box;
                            float: right;
                            margin-right: 30px;
                            cursor: pointer;
                            }
                            .searchTab {
                            width: 600px;
                            height: 300px;
                            overflow-y: auto;
                            margin: 10px auto 0px;
                            table {
                                border-collapse: collapse;
                                border: 1px solid #e6e6e6;
                                thead {
                                //  width: 600px;
                                //  position: fixed;
                                background: #f2f2f2;
                                th {
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                    //  position: fixed;
                                    td {

                                    }
                                }
                                }
                                tbody {
                                tr {
                                    td {
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 31px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    }
                                }
                                .active {
                                    td {
                                    background: #fafafa;
                                    }
                                }
                                }

                            }

                            }
                        }
                    }
                }
            }
        }
        .hahahha{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
        }
        .dialog {
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left: -330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            .el-dialog__body {
                margin-top: 20px;
            }
            .editBody {
                margin: 0 20px;
                .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
                margin: 0 5px;
                }
            }
            .item-label {
                border-bottom: 1px solid #ebebeb;
                .img_left {
                float: left;
                width: 90px;
                height: 90px;
                margin: 40px 30px 0 10px;
                }
                .right {
                float: left;
                width: 450px;
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
                &:last-of-type {
                border-bottom: none;
                }
            }
            .item-attibuteAuth {
                float: left;
                width: 33.3%;
                padding-left: 78px;
                height: 14px;
                line-height: 14px;
                margin-bottom: 26px;
                text-align: left;
                .text {
                font-size: 14px;
                color: #666666;
                margin-left: 10px;
                }
                .checkbox-fileItem {
                float: left;
                position: relative;
                padding-left: 20px;
                cursor: pointer;
                &::before {
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
                .active {
                &::before {
                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
                }
                }
                .checkbox-arr {
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
        
       
    }

</style>

