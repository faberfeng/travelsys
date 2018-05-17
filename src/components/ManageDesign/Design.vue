<template>
<div id="DesignManagement" v-loading.fullscreen.lock="fullscreenLoading">
        <div id="GroupSelect">
            <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in  ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                    <span class="item-property " @click="screenLeft.item = 1">图<br>纸</span>
                    <span class="item-version " @click="screenLeft.item = 2">联<br>系<br>人</span>
                    <span class="item-version-3 " @click="screenLeft.item = 3;">属<br>性</span>
                </div>
            </div>
            <div id="item-box-file">
                <span  class="label-item-active label-item">
                    <router-link :to="'/Design/management'">  
                    设计协调  
                   </router-link>
                </span>
                <span  class="label-item">
                    <router-link :to="'/Design/attributeManager'">  
                    属性管理  
                   </router-link>
                </span>
                <span  class="label-item">
                <router-link :to="'/Design/designversion'">  
                    设计版本  
                  </router-link>
                </span>
            </div>
            <div id="containerMessage">
                <p class="header clearfix">
                    <span class="title">设计协同</span>
                    <span class="item-upload" @click="SendMes">新建主题</span>
                </p>
                <div class="ForumSelector">
                    <span class="name">筛选条件</span>
                    <ul>
                            <!-- options_monomer:[],//单体选项
                            options_status:[],//状态选项
                            options_about:[],//相关选项 -->
                        <li class="selectItem">
                            <span class="title">单体</span>
                            <el-select v-model="value_monomer" placeholder="请选择">
                                <el-option
                                v-for="item in options_monomer"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                          <li class="selectItem">
                            <span class="title">状态</span>
                            <el-select v-model="value_status" placeholder="请选择">
                                <el-option
                                v-for="item in options_status"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                          <li class="selectItem">
                            <span class="title">相关</span>
                            <el-select v-model="value_about" placeholder="请选择">
                                <el-option
                                v-for="item in options_about"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                    </ul>
                </div>
                <sendMes :showBox="'true'" :dcid="''" :iscomment="true"  :selectugid="selectUgId" :holderid="value_monomer" v-if="goingToSend" v-on:hide="hideSendMes" v-on:refresh='getCommunicationList'></sendMes>
                 <div class="project">
                    <ul class="projectList">
                        <li v-for="(item,index) in CommunicationList" :key="index">
                            <div class="projectListInfo">
                                <div class="projectListImg">
                                    <img :src="item.createUserImg != ''?(QJFileManageSystemURL+item.createUserImg):require('../../assets/loginimg.png')">
                                </div> 
                                <div class="projectListText">
                                    <span class="action_rightBox">
                                        <span class="icon-finish" v-if="canEditMes && item.dcStatus == 1" @click="updateStatus(item.dcId,0,'完成',index)">完成</span>
                                        <span class="icon-reconsider" v-if="canEditMes && item.dcStatus == 2" @click="updateStatus(item.dcId,1,'再议',index)">再议</span>
                                        <span class="icon-start" v-if="canEditMes && item.dcStatus == 3" @click="updateStatus(item.dcId,1,'开启',index)">开启</span>
                                        <span class="icon-delete" v-if="canDeleteMes" @click="deleteMes(item.dcId,index)"></span>
                                    </span>
                                    <p class="projectListTextName">{{item.createUserStr}}</p>
                                    <p class="font-color1" v-html="item.dcContent"></p>
                                    <ul class="clearfix" style="padding: 0px 0px 2px 2px;">
                                        <li :class="['item-file']" v-for="(val,key) in item.fileList" :key="key+'file'">
                                            <div class="item-file-box clearfix">
                                                <span  class="item-file-image">
                                                    <img :src="checkIcon(val.fileExtension.toUpperCase())?require('../ManageCost/images/icon/'+val.fileExtension.toUpperCase()+'.png'):''" />
                                                </span>
                                                <span  class="item-file-detial">
                                                    <h3 v-text="val.fileName"></h3>
                                                    <p>由<span class="text-name" v-text="val.uploadUser"></span><span v-text="item.from"></span>上传</p>
                                                    <p v-text="initData(val.uploadTime)"></p>
                                                    <p class="operation">
                                                        <span v-text="'版本'+val.version"></span>
                                                        <i class="icon-goujian icon-search" @click="preview(val.filePath)"></i>
                                                        <i class="icon-goujian icon-download" @click="downLoad(val.filePath)"></i>
                                                    </p>
                                                </span>
                                            </div>
                                        </li>
                                        <li :class="['item-file']" v-for="(val,key) in item.attachList" :key="key+'attach'" style="padding:0;overflow: hidden;">
                                            <img :src="QJFileManageSystemURL+val.relativePath" :title="val.fileName" class="item-file-attach"/>
                                            <div class="actionbox clearfix">
                                                <i class="button-search"  @click="preview(val.relativePath)"></i>
                                                <i class="line"></i>
                                                <i class="button-download" @click="downLoad(val.relativePath)"></i>
                                            </div>
                                        </li>
                                    </ul>
                                    <p class="projectBottom">
                                        <i class="icon-time"></i>{{initData(item.createTime)}}<label>{{item.from}}</label>
                                        <span class="action">
                                            <span v-text="'#'+item.sortId" style="cursor: auto;"></span>
                                            <span v-text="item.statusText" @click="item.showResponse = false;item.showFlowChart = !item.showFlowChart" :class="item.showFlowChart?'arrow':''"></span>
                                            <span v-text="item.collect?'取消收藏':'收藏'" @click="collect(item.dcId,item.collect,index)"></span>
                                            <span v-text="(item.showResponse?'收起':'展开')+'回复 ('+(item.reviewCount?item.reviewCount:0)+')'"  @click="getComment(item.dcId,index,item.showResponse,item.reviewCount,false,null)" :class="item.showResponse?'arrow':''"></span>
                                            <span v-text="item.reviewName" v-if="item.reviewName != null" style="cursor: auto;"></span>
                                        </span>
                                    </p>
                                     <!--下面是评论的代码-->
                                    <div class="comments" v-if="item.showResponse">
                                        <sendMes :showBox="(item.dcStatus == 1)?true:false" :dcid='item.dcId' :keycomment="index" :iscomment="false" :selectugid="selectUgId" :holderid="siteHolderId"
                                        :valuemonomer="value_monomer"  :valuestatus="value_status"   :valueabout="value_about"  
                                          v-on:hide="hideSendMes" v-on:refreshcomment="getComment(item.dcId,index,item.showResponse,item.reviewCount,true,$event)"></sendMes>
                                        <ul >
                                            <li v-for="(val,key) in CommentList" :key="key+'CommentList'" class="comments-item clearfix">
                                                <img :src="val.rvUserImg != ''?(QJFileManageSystemURL+val.rvUserImg):require('../../assets/loginimg.png')" class="left">
                                                <div  class="center">
                                                    <span class="icon-delete" v-if="val.editable"  @click="deleteComment(val.dcId,val.id,key,index)"></span>
                                                    <p class="head">
                                                        <span v-text="val.rvUserStr"></span>
                                                        <span v-text="initData(val.rvTime)"></span>
                                                        <span v-text="val.fromIn"></span>
                                                    </p>
                                                    <div class="detial">
                                                        <div v-html="val.rvContent"></div>
                                                    <!--下面是文件图片的代码-->
                                                        <div>
                                                            <ul class="clearfix" style="padding: 0px 0px 0px 2px;">
                                                                <li :class="['item-file']" v-for="(left,right) in val.fileList" :key="right+'file'">
                                                                    <div class="item-file-box clearfix">
                                                                        <span  class="item-file-image">
                                                                            <img :src="checkIcon(left.fileExtension.toUpperCase())?require('../ManageCost/images/icon/'+left.fileExtension.toUpperCase()+'.png'):''" />
                                                                        </span>
                                                                        <span  class="item-file-detial">
                                                                            <h3 v-text="left.fileName"></h3>
                                                                            <p>由<span class="text-name" v-text="left.uploadUser"></span><span v-text="val.fromIn"></span>上传</p>
                                                                            <p v-text="initData(left.uploadTime)"></p>
                                                                            <p class="operation">
                                                                                <span v-text="'版本'+left.version"></span>
                                                                                <i class="icon-goujian icon-search" @click="preview(left.filePath)"></i>
                                                                                <i class="icon-goujian icon-download" @click="downLoad(left.filePath)"></i>
                                                                            </p>
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                                <li :class="['item-file']" v-for="(left,right) in val.attachList" :key="right+'attach'" style="padding:0;overflow: hidden;">
                                                                    <img :src="QJFileManageSystemURL+left.relativePath" :title="left.fileName" class="item-file-attach"/>
                                                                    <div class="actionbox clearfix">
                                                                        <i class="button-search"  @click="preview(left.relativePath)"></i>
                                                                        <i class="line"></i>
                                                                        <i class="button-download" @click="downLoad(left.relativePath)"></i>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div> 
                                    <!--下面是流程图的代码-->
                                    <div class="flowCharts" v-if="item.showFlowChart">
                                        <ul class="clearfix">
                                            <li v-for="(val,key) in item.flowCharts" :key="key" class="flowChart-item">
                                                <div class="top">
                                                    <span class="horizontalLineL"></span>
                                                    <span  :class="[val.nodeType == 1?'circle':'',val.nodeType == 2?'square':'',val.nodeType == 3?'diamond':'']"></span>
                                                    <span  class="horizontalLineR"></span>
                                                </div>
                                                <p v-text="val.userName+val.dcStatus" class="title_"></p>
                                                <p v-text="initData(val.operateTime)" class="date"></p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="pagenation" v-if="pageTotal>0">   
                        <el-pagination background layout="prev, pager, next" :total="pageTotal" :current-page.sync="pageNo" @current-change="changePage" @prev-click="changePage" @next-click="changePage"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div v-if="screenLeft.item == 1" class="screenRight_1">
                <div v-if="showAction">
                    <p class="clearfix" v-if="IsFolderAction">
                        <i class="icon-goujian icon-add" title="新建文件夹" @click="addFile"></i>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile"></i>
                        <i class="icon-goujian icon-edit"  title="重命名" @click="renameFile"></i>
                        <i class="icon-goujian icon-upload"  title="上传图纸" @click="uploadFile"></i>
                    </p>
                    <p class="clearfix" v-else>
                        <i class="icon-goujian icon-load" title="加载" @click="loading()"></i>
                        <i class="icon-goujian icon-view"  title="预览" @click="preview()"></i>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteDrawing"></i>
                        <i class="icon-goujian icon-edit"  title="编辑" @click="editMap()"></i>
                    </p>
                </div>
                <el-tree
                    :data="FileTree"
                    ref="fileTree_DesignManagement"
                    node-key="id"
                    :props="defaultProps"
                    :default-expanded-keys="expandedKeys"
                    highlight-current
                    @node-click="handleNodeClick"
                    id="cloudDirveFileTree"
                    :class="[showAction?'':'noTop']"
                >
                <span :class="['custom-tree-node','el-tree-node__label','hahahhaha',data.isLeaf?'fileIcon':'']" slot-scope="{ node, data }" v-text="node.label"></span>
                </el-tree>
            </div>
            <div id="box-right" v-else-if="screenLeft.item == 2">
                <p class="clearfix" style="padding-bottom:5px;border-bottom: 1px solid #e6e6e6;" v-if="hasAuthDelUser">
                    <i class="icon-goujian icon-add" title="添加" @click="addContact()"></i>
                </p>
                <ul class="container-contacts">
                    <li class="member clearfix" v-for="(item,index) in contacts" :key="index">
                        <img :src="item.imgUuid!=''?(QJFileManageSystemURL+item.imgUuid):''" alt="">
                        <span class="member-name">
                            <h3 v-text="item.userName"></h3>
                            <p v-text="item.account"></p>
                        </span>
                        <i class="icon-ditial" title="详情" @click="ckeckUserInfo(item.id)"></i>
                        <i class="icon-del" title="删除" @click="deleteContact(item.id,item.userId)" v-if="hasAuthDelUser"></i>
                    </li>
                </ul>
            </div>
            <div id="box-right-1" v-else>
                333
            </div>
        </div>
      <div id="edit">
        <el-dialog title="文件重命名" :visible="PointFigure.renameshow" @close="renameCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">原文件名 :</label>
                    <span v-text="PointFigure.oldname"></span>
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">新文件名 :</label>
                    <input type="text" class="inp" v-model="PointFigure.newname">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="renameIMG">更名</button>
                <button class="editBtnC" @click="renameCancle">取消</button>
            </div>
        </el-dialog>
         <el-dialog title="图纸编辑" :visible="editDrawing.renameshow" @close="editDrawingCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">图号 :</label>
                    <input type="text" class="inp" v-model="editDrawing.dcode">
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">图名 :</label>
                    <input type="text" class="inp" v-model="editDrawing.dname">
                </div>
                 <div class="editBodytwo imageBody" style="position: relative;">
                    <label class=" imageBodyText">比例 :</label>
                    <select class="inp-search" v-model="editDrawing.dscale">
                        <option value="1:20">1:20</option> 
                        <option value="1:25">1:25</option> 
                        <option value="1:30">1:30</option>
                    </select>
                    <i class="icon-sanjiao" style="top: 16px;left: 330px;"></i>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="confirmDrawing">确定</button>
                <button class="editBtnC" @click="editDrawingCancle">取消</button>
            </div>
        </el-dialog>
         <el-dialog :title="fileName.title" :visible.sync="fileName.show" @close="addfileCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">目录名称 :</label>
                     <input type="text" class="inp" v-model="fileName.newFileName">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addfileConfirm">确认</button>
                <button class="editBtnC" @click="addfileCancle">取消</button>
            </div>
        </el-dialog>
         <el-dialog title="图纸上传" :visible.sync="drawingsUploadShow" @close="drawingsUploadCancel" class="uploadBox">
            <div class="editBody">
                <div class="yingsheProject">
                    <label class="yingsheProjectText">图纸列表 : </label>
                    <label class="editBtnS yingsheProjectBtn" for="drawingsInfo">选择文件</label>
                    <input class="upInput"  type="file" accept="image/*" @change="fileChanged($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                </div>
                <table class="fileContainer" border="1">
                    <thead>
                        <tr  class="userList-thead">
                            <th style="width:20%">图号</th>
                            <th style="width:27%">图名</th>
                            <th style="width:12%">比例</th>
                            <th style="width:19%;max-width:200px;">文件名称</th>
                            <th style="width:12%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in fileList" :key="index">
                            <td>
                                <input  placeholder="请输入" v-model="item.drawingNo" class="calculateInp">
                            </td>
                            <td>
                                <input  placeholder="请输入" v-model="item.drawingName" class="calculateInp">
                            </td>
                            <td>
                                <select v-model="item.proportion" class="inp-search" ref="proportion">
                                    <option value=""></option>
                                    <option value="1:20">1:20</option>
                                    <option value="1:25">1:25</option>
                                    <option value="1:30">1:30</option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </td>
                            <td v-text="item.fileName"></td>
                            <td>
                                 <button class="deleteBtn actionBtn" style="margin-right:10px" @click="deleteFileList(index)"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="drawingsUploadConfirm">上传</button>
                <button class="editBtnC" @click="drawingsUploadCancel">关闭</button>
            </div>
        </el-dialog>
        <el-dialog  title="添加联系人" :visible.sync="addUser.show" :before-close="userClose">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <span class="imageBodyText">添加方式:</span>
                    <el-radio v-model="addUser.posType" label="1">邮箱</el-radio>
                    <el-radio v-model="addUser.posType" label="2">账号</el-radio>
                </div>
                <div  class="editBodytwo imageBody">
                    <span class="imageBodyText" v-text="'联系人'+(addUser.posType == '1'?'邮箱:':'账号:')"></span>
                    <input type="text" v-model="addUser.posName" class="inp" placeholder="请输入" @keyup.enter="searchUser">
                </div>
            </div>
            <span slot="footer" class="dialog-footer">   
                <button class="editBtnS" @click="searchUser">查找</button>
                <button class="editBtnC" @click="userClose">取消</button>
            </span>
        </el-dialog> 
        <el-dialog title="确认联系人" :visible="selectContact.show" @close="selectCancle">
            <div class="editBody">
                <h3 style="text-align:left;padding-left:90px;">查找到的用户信息如下：</h3>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">邮箱 :</label>
                    <span v-text="selectContact.obj.email"></span>
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">账号 :</label>
                    <span v-text="selectContact.obj.account"></span>
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">姓名 :</label>
                    <span v-text="selectContact.obj.realName"></span>
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">联系方式 :</label>
                    <span v-text="selectContact.obj.phone"></span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="SelectConfirm">添加为联系人</button>
                <button class="editBtnC" @click="selectCancle">取消</button>
            </div>
        </el-dialog>
        <el-dialog title="设计协调状态修改" :visible="dcStatus.show" @close="dcStatusCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody" style="padding-left:120px;">
                     <el-radio v-model="dcStatus.val" label="2">讨论主题已经解决完成</el-radio>
                </div>
                <div class="editBodytwo imageBody" style="padding-left:120px;">
                      <el-radio v-model="dcStatus.val" label="3">关闭本讨论主题</el-radio>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="dcStatusConfirm">确定</button>
                <button class="editBtnC" @click="dcStatusCancle">取消</button>
            </div>
        </el-dialog>
    </div>
    <el-dialog title="联系人详情" id="contactINFO" :visible="selectContact.infoShow" @close="selectInfoCancle">
        <div class="clearfix">
            <img :src="selectContact.infoObj.imgUuid !=''?(QJFileManageSystemURL+selectContact.infoObj.imgUuid):require('../../assets/loginimg.png')" alt="" class="img">
            <div class="info">
                <h1 v-text="selectContact.infoObj.realName"></h1>
                <div class="detial">
                    <label>邮箱 :</label>
                    <span v-text="selectContact.infoObj.email"></span>
                </div>
                <div class="detial">
                    <label>账号 :</label>
                    <span v-text="selectContact.infoObj.account"></span>
                </div>
            </div>
        </div>
    </el-dialog>
</div>
</template>
<style  lang='less'>
    #DesignManagement{
        /*
            修改eleUI树形组件
        */
        
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
            background-image: url('./images/zTreeStandard.png');
            background-position: -110px -32px;
        }
        .el-tree-node__content{
                height: 30px;
        }
        .is-current .el-tree-node__content{
            color: #333333;
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
        .show{
            display: block!important;
        }
        .upInput{
            display: none;
        }
        #edit{ 
             .inp-search{
                width: 200px;
                height: 38px;
                border: 1px solid #d1d1d1;
                border-radius: 2px;
                background: #fafafa;
                padding-left: 10px;
            }
            .el-dialog{
            margin: 0 auto;
            .upInput{
                display: none;
            }
            /* 上传文件按钮 */
            .imageBody{
            text-align: left;
            }
            .el-radio__label{
                padding-left: 10px;
                padding-right: 10px;
            }
            .imageBody .imageBodyText{
                color: #666;
                font-size: 14px;
                line-height: 14px;
                font-weight: normal;
                display: inline-block;
                width: 175px;
                padding-left: 94px;
                text-align: left;
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
            .selectionBox{
                margin: 10px 50px;
                border:1px solid #cccccc;
                padding: 20px;
                p{
                    text-align: left;
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                }
            }
            .checkbox-fileItem{
                float: left;
                width: 14px;
                height: 14px;
                border: 1px solid #cccccc;
                cursor: pointer;
                margin-right: 5px;
                position: relative;
                &::after{
                    font-size:12px;
                    color:#cccccc;
                    display: block;
                    position: absolute;
                    right: -30px;
                    top: 0;
                    line-height:12px;
                    content: '';
                }
            }
            .active{
                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
            }
            .yingsheProject{
                overflow: hidden;
                margin-bottom: 10px;
            }
            .yingsheProjectText{
                color: #999;
                display: block;
                float: left;
                margin-left: 30px;
                font-size: 14px;
                line-height: 36px;
            }
            .yingsheProjectBtn{
                float: right;
                margin-right: 30px;
                line-height: 36px;
            }
         }
         .uploadBox .el-dialog__body{
                margin-top: 21px;
                .fileContainer{
                    width: 600px;
                    margin: 0px 30px;
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                        background: #f8f8f9;
                        th{
                            padding-left: 10px;
                            height: 40px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    tbody{
                        tr{
                            td{
                                padding-left: 5px;
                                padding-right: 5px;
                                height: 40px;
                                text-align: left;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #333333;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                position: relative;
                                input,select{
                                    float: left;
                                    width: 100%;
                                    height: 32px;
                                    border: 1px solid #d1d1d1;
                                    border-radius: 2px;
                                    background: #fafafa;
                                    padding-left: 10px;
                                }
                                .icon-sanjiao{
                                    display: block;
                                    position: absolute;
                                    width: 12px;
                                    height: 7px;
                                    background-image:url('../Settings/images/sanjiao.png');
                                    background-size: 100% 100%;
                                    content: '';
                                    top: 16px;
                                    right: 11px;
                                }
                            }
                            &:hover{
                                background: #fafafa;
                            }
                        }
                    }
                }
                .actionBtn{
                    width: 16px;
                    height: 16px;
                    border: none;
                    cursor: pointer;
                    margin-right: 16px;
                    margin-top:9px;
                }
                .editBtn{
                    background: url('../../assets/edit.png') no-repeat;
                }
                .deleteBtn{
                    background: url('../../assets/delete.png') no-repeat;
                }
         }
        }
        #contactINFO{
            .el-dialog{
                margin: 0 auto;
                width: 412px;
                border-radius: 2px;
            }
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
            .el-dialog__body{
                padding: 30px 30px 50px;
                .img{
                    float: left;
                    width: 80px;
                    height: 80px;
                    border-radius: 2px;
                }
                .info{
                    float: left;
                    width: 250px;
                    height: 80px;
                    margin-left: 22px;
                    border-radius: 2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    >h1{
                        font-size: 18px;
                        text-align: left;
                        color: #333333;
                        line-height: 18px;
                        margin: 4px 0 16px;
                    }
                    .detial{
                        text-align: left;
                        color: #999999;
                        font-size: 14px;
                        line-height: 14px;
                        &:first-of-type{
                            margin-bottom: 14px;
                        }
                    }
                }
            }
        }
        #GroupSelect{
            display: block;
            width: 168px;
            height: 30px;
            position: fixed;
            top: 77px;
            z-index: 1000;
            right: 24px;
            .inp-search{
                width: 168px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #cccccc;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:20px;
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
                background-image:url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 12px;
                right: 11px;
            }
        }
        .box-left-container{
            display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 225px;
            z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;
            #center-selection{
                position: fixed;
                top: 115px;
                // bottom: 0;
                right: 225px;
                width: 25px;
                z-index: 100;
                transition: all ease .5s;
                background: #ffffff;
                .SH_right{
                    width: 25px;
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
                    height: 68px;
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
                        bottom: -9px;
                        width: 24px;
                        height: 15px;
                        background: #fafafa;
                        border-top: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }   
                .item-version{//属性
                    display: block;
                    width: 25px;
                    height: 68px;
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
                .active-version-3{//下边 版本 高显
                    .item-version{
                        z-index: 15;
                        &::after{
                            background: #fafafa;
                        }
                    }
                    .item-property::after{
                        background: #fff;
                    }
                    .item-version-3{
                        z-index: 10;
                        background: #fff;
                        color: #fc3439;
                        &::after{
                            background: #fff;
                        }
                    }
                }
                
            }
            #containerMessage{
                padding-left:30px; 
                min-width: 950px;
               overflow-y: auto;
                .header{
                    text-align: left;
                    margin: 15px 0;
                    .title{
                        font-size: 14px;
                        float: left;
                        color: #fc3439;
                        font-weight: bold;
                    }
                    .item-upload{
                        float: right;
                        margin-right: 30px;
                        background: #fc3439;
                        color: #ffffff;
                        font-size: 12px;
                        height: 26px;
                        border-radius: 2px;
                        text-align: left;
                        line-height: 26px;
                        padding-left: 42px;
                        padding-right: 16px;    
                        position: relative;
                        cursor: pointer;
                        &::before{
                            display: block;
                            position: absolute;
                            top: 8px;
                            left: 19px;
                            width: 12px;
                            height: 11px;
                            content: '';
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    height: 40px;
                    color: #999999;
                    font-size: 12px;
                    margin-right: 30px;
                    .name{
                        float: left;
                        width: 96px;
                        height: 38px;
                        line-height: 38px;
                        text-align: left;
                        padding-left: 10px;
                        background: #fafafa;
                    }
                    >ul{
                        float: left;
                        .selectItem{
                            float: left;
                            .title{
                                padding: 0 15px 0 30px;
                                height: 38px;
                                line-height: 38px;
                            }
                            .el-select{
                                .el-input__inner{
                                    border:none;
                                    width: 100px;
                                    color:#333333;
                                    height: 38px;
                                }
                            }
                           
                        }
                        .selectItem:first-of-type .el-select .el-input__inner{
                            width: 170px;
                        }
                    }
                }
                .project{
                    margin: 20px 0px 0 0px;
                      .pagenation{
                            width: 100%;
                            text-align: right;
                            height: 40px;
                            margin-top: 20px;
                            padding-right: 100px;
                            button{
                                margin-left: 15px;
                            }
                            .el-pager{
                                .number,.more{
                                       margin-left: 15px;
                                }
                            }
                        }
                }
                .projectList{
                        width: 100%;
                        list-style: none;
                        overflow: auto;
                        padding-left: 0;
                        margin-top: 0px;
                        
                }
                .projectList li{
                    display: inline-block;
                    width: 100%;
                    margin-top: 5px; 
                    border-bottom:1px solid #ebebeb;
                }
                .projectListInfo{
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                }
                .projectListImg{
                    width: 80px;
                    float: left;
                }
                .projectListText{
                    font-size: 12px;
                    flex: 1;
                    margin: 0 0px 0 2px;
                    float: left;
                    text-align: left;
                    position: relative;
                    .action_rightBox{
                        position: absolute;
                        display: block;
                        width: auto;
                        height: 16px;
                        right: 30px;
                        top: 28px;
                        color: #fc3439;
                        span{
                            line-height: 16px;
                            height: 16px;
                            float: left;
                            position: relative;
                            cursor: pointer;
                            margin-left: 20px
                        }
                        .icon-finish::before{
                            display: inline-block;
                            position: absolute;
                            left: -18px;
                            top: 2px;
                            width: 14px;
                            height: 14px;
                            line-height: 14px;
                            background: url('./images/finish.png')no-repeat 0 0;
                            content: '';
                        }
                        .icon-reconsider::before{
                            display: inline-block;
                            position: absolute;
                            left: -18px;
                            top: 2px;
                            width: 14px;
                            height: 14px;
                            line-height: 14px;
                            background: orange;
                            content: '';
                        }
                        .icon-start::before{
                            display: inline-block;
                            position: absolute;
                            left: -18px;
                            top: 2px;
                            width: 14px;
                            height: 14px;
                            line-height: 14px;
                            background: green;
                            content: '';
                        }
                         .icon-delete{
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                        }
                    }
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
                             .button-search{
                                 float: left;
                                 margin: 10px 64px;
                                 width: 16px;
                                 height: 16px;
                                 background: url('./images/search2.png')no-repeat 0 0;
                                 cursor: pointer;
                             }
                             .button-download{
                                float: left;
                                 margin: 10px 64px;
                                 width: 16px;
                                 height: 16px;
                                 background: url('./images/download2.png')no-repeat 0 0;
                                cursor: pointer;
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
                    .item-file:hover{
                        box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                        .actionbox{
                            transform: translateY(0px);
                            transition: all ease .5s;
                        }
                    }
                }
                .projectListText .title{
                    width: 100%;
                    height: 35px;
                    line-height: 35px;
                    text-align: left;
                    font-size: 16px;
                    font-weight: bold;
                }
                .title span{
                    font-size: 14px;
                    display: inline-block;
                    margin-left: 20px;
                    color: #666;
                    position: relative;
                    top: 10px;
                }
                .projectListText .title a{
                    float: right;
                    width: 100px;
                    font-size: 14px;
                    cursor: pointer;
                    text-align: center;
                    color: #999;
                    line-height: 45px;
                }
                .projectListText .title a:hover{
                    color: #fc3439;
                }
                .projectListText .title a .el-icon-arrow-right{
                    margin-left: 1px;
                }
                .projectListBtn{
                    width: 20%;
                    float: left;
                }
                .projectList img{
                    width: 48px;
                    height: 48px;
                    border-radius:48px; 
                    margin: 15px 12px 10px;
                }
                .projectListTextName{
                    font-size: 18px;
                    font-weight: bold;
                    text-align: left;
                    line-height: 18px;
                    margin: 25px 0 16px;
                }
                .projectBottom{
                    width: 100%;
                    font-size: 12px;
                    line-height: 12px;
                    font-family: '微软雅黑';
                    // overflow: hidden;
                    color: #ccc;
                    margin-top: 20px;
                    margin-bottom: 6px;
                    .icon-time{
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: url('./images/time.png');
                        margin-right: 10px;
                    }
                    .action{
                        float: right;
                        span{
                            margin-right:20px;
                            font-size: 12px;
                            color: #999999;
                            cursor: pointer;
                            
                        }
                        :last-child{
                                margin-right:30px;
                        }
                        .arrow{
                            position: relative;
                            &::after{
                                display: block;
                                position: absolute;
                                bottom: -21px;
                                left: 50%;
                                margin-left:-8px; 
                                width: 16px;
                                height: 16px;
                                transform: rotateZ(45deg);
                                border-left: 1px solid #f2f2f2;
                                border-top: 1px solid #f2f2f2;
                                background: #fafafa;
                                content: '';
                            }   
                        }
                    }
                }
                .projectBottom label{
                    display: inline-block;
                    width: 30%;
                    margin-left: 20px;
                    line-height: 12px;
                }
                .font-color1{
                    color: #333;
                    font-size: 14px;
                }
                .projectList-detial{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 500px;
                }
                /*评论*/
                .comments{
                    border: 1px solid #f2f2f2;
                    background: #fafafa;
                    margin-top: 12px;
                    margin-bottom: 20px;
                    margin-right: 30px;
                    .comments-item{
                        border-bottom: none;
                        .left{
                            float: left;
                            width: 40px;
                            height: 40px;
                            margin: 20px 10px 20px 16px;
                            border-radius: 50%;
                        }
                        .center{
                            display: block;
                            padding-left:65px; 
                            position: relative;
                            .icon-delete{
                                display: inline-block;     
                                width: 16px;
                                height: 16px;
                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                                position: absolute;
                                right: 16px;
                                top: -2px;
                                cursor: pointer;
                            }
                            .head{
                                height: 14px;
                                line-height: 14px;
                                font-size: 12px;
                                color: #999999;
                                margin: 30px 0 16px;
                                overflow: hidden;
                                :first-child{
                                    font-size: 14px;
                                    color: #fc3439;
                                    cursor: pointer;
                                    margin-right: 10px;
                                }
                                :last-child{
                                    margin-left: 20px;
                                }
                            }
                            .detial{
                                border-bottom: 1px dashed #e6e6e6;
                                font-size: 14px;
                                color: #666666;
                                padding-bottom:20px; 
                            }
                        }
                    }
                      /**********以下是消息输入框样式***********/
                        .sendmessage{
                            margin: 30px 30px 20px 0;
                            margin-top: 30px;
                            .left{
                                width: 80px;
                                float: left;
                                img{
                                    width: 48px;
                                    height: 48px;
                                    border-radius: 50%;
                                    margin: 15px 12px 10px;
                                }
                            }
                            .center{
                                padding-left: 80px;
                                .box{
                                    border: 1px solid #d9d9d9;
                                    .input{
                                        padding: 10px;
                                        background: #ffffff;
                                        .textArea{
                                            textarea{
                                                min-height: 116px;
                                                width: 100%;
                                                // height: auto;
                                                margin: 0px; 
                                                padding: 0px;
                                                border-style: none;
                                                border-width: 0px;
                                                font-size: 14px; 
                                                word-wrap: break-word; 
                                                line-height: 18px; 
                                                // overflow: hidden;
                                                outline: none;
                                                border: none;
                                                color: #333333;
                                                resize: none;
                                            }
                                        }
                                        ::-webkit-input-placeholder { /* WebKit browsers */
                                            color:    #cccccc;
                                        }
                                        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                                            color:     #cccccc;
                                        }
                                        ::-moz-placeholder { /* Mozilla Firefox 19+ */
                                            color:    #cccccc;
                                        }
                                        :-ms-input-placeholder { /* Internet Explorer 10+ */
                                            color:   #cccccc;
                                        }
                                    }
                                    .func_area{
                                        padding:15px  0px 0 10px;
                                        background: #f2f2f2;
                                        height: 45px;
                                        border-top: 1px solid #e6e6e6;
                                        position: relative;
                                        .limits{
                                            .cancle{
                                                float: right;
                                                font-size: 14px;
                                                color: #999999;
                                                margin-right: 130px;
                                                text-decoration: none;
                                            }
                                            span{
                                                line-height: 16px;
                                                height: 16px;
                                                float: left;
                                                position: relative;
                                                cursor: pointer;
                                                margin-left: 24px;
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
                                                background: url('./images/eye.png')no-repeat 0 0;
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
                                                background: url('./images/image.png')no-repeat 0 0;
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
                                                background: url('./images/file.png')no-repeat 0 0;
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
                                                background: url('./images/message.png')no-repeat 0 0;
                                                content: '';
                                            }
                                        }
                                        .send{
                                            display: block;
                                            position: absolute;
                                            top: -1px;
                                            bottom: -1px;
                                            right: -1px;
                                            width: 110px;
                                            background: #fc3439;
                                            color: #ffffff;
                                            text-align: center;
                                            line-height: 45px;
                                            font-size: 14px;
                                            text-decoration: none;
                                        }
                                    }
                            }
                            .fileitem{
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
                                                .button-search{
                                                    float: left;
                                                    margin: 10px 40px;
                                                    width: 16px;
                                                    height: 16px;
                                                    background: url('./images/search2.png')no-repeat 0 0;
                                                    cursor: pointer;
                                                }
                                                .button-download{
                                                float: left;
                                                    margin: 10px 40px;
                                                    width: 16px;
                                                    height: 16px;
                                                    background: url('./images/download2.png')no-repeat 0 0;
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
                            }
                                .item-file:hover{
                                    box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                                    .actionbox{
                                        transform: translateY(0px);
                                        transition: all ease .5s;
                                    }
                                }
                            }
                            #edit{
                                position: fixed;
                                z-index: 3001;
                                background: #ffffff;
                            }
                            .hahahha{
                                top: 15vh;
                                left: 50%;
                                width: 660px;
                                margin-left:-330px;
                                border-radius: 5px;
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
                }
                /*流程图*/
                .flowCharts{
                    border: 1px solid #f2f2f2;
                    background: #fafafa;
                    margin-top: 12px;
                    margin-bottom: 20px;
                    margin-right: 30px;
                    .flowChart-item{
                        border: none;
                        width: 132px;
                        height: 86px;
                        float: left;
                        margin: 0;
                        .title_{
                            font-size: 14px;
                            color: #333333;
                            font-weight: normal;
                            text-align: center;
                            line-height: 14px;
                            margin-bottom: 7px;
                        }
                        .date{
                            font-size: 12px;
                            color: #999999;
                              text-align: center;
                            line-height: 12px;
                        }
                         .top{
                            width: 100%;
                            margin: 20px 0 6px;
                            text-align: center;
                            position: relative;
                            line-height: 8px;
                            .horizontalLineL{
                                display: block;
                                position: absolute;
                                top: 10px;
                                left: 0;
                                width: 55px;
                                height: 2px;
                                background: #219b21;
                                z-index: 1;
                            }
                            .circle{
                                background-color: #fff;
                                display: block;
                                width: 24px;
                                height: 24px;
                                border-radius: 12px;
                                /* background-color: #efefef; */
                                border: 2px #219b21 solid;
                                -webkit-border-radius: 12px;
                                margin: 5px auto;
                                z-index: 2;
                            }
                            .diamond{
                                display: block;
                                width: 22px;
                                height: 22px;
                                border: 2px #219b21 solid;
                                background-color: #fff;
                                margin: 6px auto;
                                -webkit-transform: rotate(-45deg);
                                -moz-transform: rotate(-45deg);
                                -o-transform: rotate(-45deg);
                                -ms-transform: rotate(-45deg);
                                transform: rotate(-45deg);
                                z-index: 2;
                            }
                            .square{
                                background-color: #fff;
                                display: block;
                                width: 22px;
                                height: 22px;
                                border: 2px #219b21 solid;
                                margin: 6px auto;
                                z-index: 2;
                            }
                            .horizontalLineR{
                                display: block;
                                position: absolute;
                                top: 10px;
                                right: 0;
                                width: 55px;
                                height: 2px;
                                z-index: 1;
                                background: #219b21;
                            }
                        }
                        &:first-of-type {
                            .top{
                                .horizontalLineL{
                                    display: none;
                                }
                            }
                        }
                        &:last-of-type {
                            .top{
                                .horizontalLineR{
                                    display: none;
                                }
                            }
                        }
                    }
                }   
            }
        }
        .box-left-avtive{
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
            min-width: 950px;
            overflow-y: auto;
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
            a{
                color: #999999;
                text-decoration: none;
            }
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
            display: block;
            position: fixed;
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
                border-bottom: 1px solid #e6e6e6;
                #cloudDirveFileTree{
                    display: block;
                    position: absolute;
                    left: 10px;
                    right: 0;
                    bottom: 0;
                    top: 42px;
                    overflow-y: auto;
                }
                .noTop{
                    top: 12px!important;
                }
                >p{
                    padding-bottom:5px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom:10px;  
                }
                .icon-goujian{
                    float: left;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                .icon-add{
                    background: url('../ManageCost/images/add.png')no-repeat 0 0;
                    margin-right: 75px;
                    &:hover{
                        background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                    }
                }
                .icon-authrity{
                    float: right;
                    background: url('../ManageCost/images/authority.png')no-repeat 0 0;
                    &:hover{
                        background: url('../ManageCost/images/authority1.png')no-repeat 0 0;
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
                .icon-load{
                    background: url('./images/loading.png')no-repeat 0 0;
                    margin-right: 75px;
                }
                .icon-upload{
                    float: right;
                    background: url('./images/upload.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/upload1.png')no-repeat 0 0;
                    } 
                }
                 .icon-view{
                    float: right;
                    background: url('./images/view.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/view1.png')no-repeat 0 0;
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
        .box-right-avtive{
            right: 0;
            transition: all ease .5s;
            border-left: 1px solid #cccccc;
        }
        #box-right{
            padding: 10px 13px 0 10px;
            .icon-goujian{
                float: left;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .icon-add{
                background: url('../ManageCost/images/add.png')no-repeat 0 0;
                margin-right: 75px;
                &:hover{
                    background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                }
            }
            .container-contacts{
                margin-top:10px; 
                position: absolute;
                overflow: auto;
                top: 32px;
                bottom: 10px;
                right: 13px;
                width: 202px;
                .member{
                    display: block;
                    margin-bottom: 5px;
                    height: 60px;
                    cursor: pointer;
                    position: relative;
                    .member-name{
                        float: left;
                        width: 85px;
                        text-align: left;
                        >h3{
                            margin: 15px 0 5px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 14px;
                            line-height: 14px;
                        }
                        >p{
                            font-size: 12px;
                            line-height: 12px;
                            color: #999999;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                    .icon-ditial{
                        display: none;
                        position: absolute;
                        top: 10px;
                        right: 36px;
                        width: 15px;
                        height: 14px;
                        cursor: pointer;
                        background-image: url('./images/contact.png');
                        background-size: 100% 100%; 
                        &:hover{
                            background-image: url('./images/contact1.png');
                        } 
                    }
                    .icon-del{
                        display: none;
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        width: 16px;
                        height: 16px;
                        cursor: pointer;
                        background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                        &:hover{
                            background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                        } 
                    }
                    &:hover{
                        background: #f2f2f2;
                         .icon-ditial,.icon-del{
                             display: block;
                         }
                    }
                    >img{
                        float: left;
                        width: 40px;
                        height: 40px;
                        margin: 10px;
                        background-image: url('../../assets/loginimg.png');
                        background-size:100% 100%; 
                        border-radius: 50%;
                    }
                }
            }
            #basicAttributes{
                display: none;
                >li:last-of-type{
                    padding-bottom: 7px;
                }
            }
            #BindingArtifacts{
                display: none;
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
            .detial-item{
                font-size: 12px;
                line-height: 12px;
                margin-top: 16px;
                text-align: left;
                .detial-text-name{
                    color: #999999;
                    width: 65px;
                    float: left;
                }
                .detial-text-value{
                float: left;
                color: #333333;
                    max-width: 130px;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &:first-of-type{
                    margin-top: 18px;
                }
            }
            .goujian-item{
                font-size: 12px;
                line-height: 12px;
                margin-top: 10px;
                padding: 10px;
                text-align: left;
                box-shadow: 0px 0px 8px rgba(93,94,94,.16);
                border-radius: 6px;
                .icon-goujian{
                    float: left;
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                    cursor: pointer;
                }
                .icon-add{
                    background: url('../ManageCost/images/add.png')no-repeat 0 0;
                    margin-right: 75px;
                    &:hover{
                        background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                    }
                }
                .icon-detial{
                    background: url('../ManageCost/images/detial.png')no-repeat 0 0;
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
                .detial-text-name{
                    color: #999999;
                    width: 65px;
                    display: inline-block;
                }
                .detial-text-value{
                    color: #333333;
                    max-width: 130px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .item-detial{
                    margin-top: 16px;
                    &:first-of-type{
                        margin-top: 10px;
                    }
                }
                &:first-of-type{
                    padding-top: 14px;
                }
            }
        }
        #box-right-1{ 
            .head{
                padding: 11px 0 12px;
                height: 48px;
                border-bottom: 1px solid #cccccc;
                position: relative;
                .icon-goujian{
                    float: left;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    margin-top: 6px;
                    }
                    .icon-download{
                        background: url('../ManageCost/images/download.png')no-repeat 0 0;
                        margin-left: 14px;
                        &:hover{
                            background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                        }
                    }
                    .icon-search{
                        background: url('../ManageCost/images/search.png')no-repeat 0 0;
                        margin-left: 10px;
                        &:hover{
                            background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                        }
                    }
                .inp-search{
                        width: 96px;
                        border-radius: 2px;
                        height: 24px;
                        border: 1px solid #e6e6e6;
                        position: relative;
                        background: #fafafa;
                        padding-left:10px;
                        padding-right:20px;
                        box-sizing: border-box;  
                        margin-right: 15px;
                        float: right;
                    }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image:url('../Settings/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 20px;
                        right: 22px;
                    }
            }
            .item-version{
                margin:10px 15px 0 10px;
                border-bottom: 1px solid #e6e6e6;
                .img{
                    float: left;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #ededed;
                    margin-right:10px; 
                }
                .versin-detial{
                    float: left;
                    width: 150px;
                    height: auto;
                    position: relative;
                    .user-name{
                        display: block;
                        color: #333333;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: left;
                        line-height: 22px;
                    }
                    .version-number{
                        display: block;
                        position: absolute;
                        min-width: 45px;
                        color: #fc3439;
                        font-size: 12px;
                        top: 0;
                        right: 0;
                        text-align: right;
                    }
                    .version-des{
                        font-size: 12px;
                        line-height: 18px;
                        padding: 3px 10px;
                        color: #666666;
                        background: #fafafa;
                        margin-top: 6px;
                    }
                }
                .item-date{
                    display: block;
                    font-size: 12px;
                    color: #cccccc;
                    line-height: 12px;
                    margin: 12px 0 11px;
                    text-align: left;
                }
            }
            .active-item{
            box-shadow: 0px 1px 8px rgba(252, 52, 57, 0.2);
            }
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
        /**********以下是消息输入框样式***********/
         .sendmessage{
            margin: 30px 30px 20px 0;
            margin-top: 30px;
            .left{
                width: 80px;
                float: left;
                img{
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    margin: 15px 12px 10px;
                }
            }
            .center{
                padding-left: 80px;
                .box{
                    border: 1px solid #d9d9d9;
                    .input{
                        padding: 10px;
                        background: #ffffff;
                        position: relative;
                        .textArea{
                                min-height: 116px;
                                width: 100%;
                                // height: auto;
                                margin: 0px; 
                                padding: 0px;
                                border-style: none;
                                border-width: 0px;
                                font-size: 14px; 
                                word-wrap: break-word; 
                                line-height: 18px; 
                                // overflow: hidden;
                                outline: none;
                                 border: none;
                                color: #333333;
                                resize: none;
                        }
                        #at_userslist{
                            position: absolute;
                            display: none;
                            width: 226px;
                            height: 270px;
                            overflow-y:auto; 
                            border: 1px solid #cccccc;
                            z-index: 10;
                            background: #ffffff;
                            .tit{
                                display: block;
                                width: 100%;
                                height: 24px;
                                line-height: 24px;
                                background-color: #fff;
                                padding: 0 10px;
                                color: #666666;
                                font-size: 14px;
                                 background: #ffffff;
                                 cursor: pointer;
                                 border: none;
                                &:hover{
                                    background: #e8e8e8;
                                }
                            }
                        }
                        ::-webkit-input-placeholder { /* WebKit browsers */
                            color:    #cccccc;
                        }
                        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                            color:     #cccccc;
                        }
                        ::-moz-placeholder { /* Mozilla Firefox 19+ */
                            color:    #cccccc;
                        }
                        :-ms-input-placeholder { /* Internet Explorer 10+ */
                            color:   #cccccc;
                        }
                    }
                    .func_area{
                        padding:15px  0px 0 10px;
                        background: #f2f2f2;
                        height: 45px;
                        border-top: 1px solid #e6e6e6;
                        position: relative;
                        .limits{
                            .cancle{
                                float: right;
                                font-size: 14px;
                                color: #999999;
                                margin-right: 130px;
                                text-decoration: none;
                            }
                            span{
                                line-height: 16px;
                                height: 16px;
                                float: left;
                                position: relative;
                                cursor: pointer;
                                margin-left: 24px;
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
                                background: url('./images/eye.png')no-repeat 0 0;
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
                                background: url('./images/image.png')no-repeat 0 0;
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
                                background: url('./images/file.png')no-repeat 0 0;
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
                                background: url('./images/message.png')no-repeat 0 0;
                                content: '';
                            }
                        }
                        .send{
                            display: block;
                            position: absolute;
                            top: -1px;
                            bottom: -1px;
                            right: -1px;
                            width: 110px;
                            background: #fc3439;
                            color: #ffffff;
                            text-align: center;
                            line-height: 45px;
                            font-size: 14px;
                            text-decoration: none;
                        }
                    }
            }
            .fileitem{
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
                                .button-search{
                                    float: left;
                                    margin: 10px 40px;
                                    width: 16px;
                                    height: 16px;
                                    background: url('./images/search2.png')no-repeat 0 0;
                                    cursor: pointer;
                                }
                                .button-download{
                                float: left;
                                    margin: 10px 40px;
                                    width: 16px;
                                    height: 16px;
                                    background: url('./images/download2.png')no-repeat 0 0;
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
            }
                .item-file:hover{
                    box-shadow: 0px 1px 8px rgba(252,52,57,.2);
                    .actionbox{
                        transform: translateY(0px);
                        transition: all ease .5s;
                    }
                }
            }
            #edit{
                position: fixed;
                z-index: 3001;
                background: #ffffff;
            }
            .hahahha{
                top: 15vh;
                left: 50%;
                width: 660px;
                margin-left:-330px;
                border-radius: 5px;
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
    }
</style>
<script>
import sendMes from'./sendMessage.vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import data from '../Settings/js/date.js'

export default {
  name:'Costover',
  components:{
        sendMes
  },
  data(){
      return {
         screenLeft:{
             show:true,
             item:1,
         },
         token:'',
         entId:'',//公司ID
         projId:'',
         userId:'',
         defaultSubProjId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         checkedItem:{},//选中的file
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
         FileTree_original:[],//原始文件树形图
        FileTree:[],//文件夹树形图
        defaultProps: {
          children: 'children',
          label: 'ddName',
          isLeaf:'leaf'
        },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        checkFileDir:{},//选中的文件夹信息
        PointFigure:{
            renameshow:false,
            oldname:'',//这是点位图的旧名称
            newname:'',//点位图新名称
            fgID:''
        },
        editDrawing:{
            renameshow:false,
            dId:'',
            dcode:'',//这是点位图的旧名称
            dname:'',//点位图新名称
            dscale:''
        },
        expandedKeys:[],
        fileName:{
            show:false,
            newFileName:'',
            currentFileName:'',
            title:'',
            new:true
        },
        /*以下为后期添加数据*/
        options_monomer:[],//单体选项
        options_status:[
            {
                id:'-1',
                Name:'全部状态'
            },{
                id:'1',
                Name:'正在处理'
            },{
                id:'2',
                Name:'解决完成'
            },{
                id:'3',
                Name:'终结讨论'
            }
        ],//状态选项
        options_about:[
            {
                id:'-1',
                Name:'全部讨论'
            },{
                id:'1',
                Name:'由我发表'
            },{
                id:'2',
                Name:'有我评论'
            },{
                id:'3',
                Name:'有提到我'
            },
            {
                id:'4',
                Name:'我的收藏'
            }
        ],//相关选项
        showAction:false,
        IsFolderAction:null,
        value_monomer: '',//单体 筛选关键词
        value_status: '-1',//单体 筛选关键词
        value_about: '-1',//单体 筛选关键词
        CommunicationList:[],//消息流列表
        drawingsUploadShow:false,//添加图纸弹窗的显隐
        fileList:[],//即将上传的文件集合
        columnsProject:[
            {
                label:'图号',
                prop:'drawingNo',
                type: 'template',
                template: 'drawingNo',
                width:'100px'
            },
            {
                label:'图名',
                prop:'drawingName',
                 type: 'template',
                template: 'drawingName',
                width:'147px'
            },
            {
                label:'比列',
                prop:'proportion',
                type: 'template',
                template: 'proportion',
                width:'100px'
            },
            {
                label:'文件名称',
                prop:'fileName',
                width:'150px'
            },
            {
                label:'操作',
                prop:'operator',
                type: 'template',
                template: 'action',
                width:'100px'
            },
        ],
        addUser:{
            show:false,
            posType:'1',
            posName:'',
        },
        selectContact:{
            show:false,
            infoShow:false,
            infoObj:{},
            obj:{}
        },
        contacts:[],//联系人列表数组
        posId:'',//因项目而不同
        pageNo:1,//评论页数
        pageTotal:0,//评论总个数
        projAuth:[],//当前用户的权限列表
        canEditMes:false,//当前用户可以修改消息状态
        canDeleteMes:false,//当前用户可以删除消息
        dcStatus:{
            show:false,
            val:'2',
            obj:{}
        },
        CommentList:[],//评论列表
        goingToSend:false,//用户点击显示弹窗
        siteHolderId:'',//holderID
        fullscreenLoading:false,
        entType:'',
        hasAuthDelUser:false,
      }
  },
  created(){
        var vm = this
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.projAuth = localStorage.getItem('projAuth')
        vm.entType = localStorage.getItem('entType')
        if(vm.projAuth.indexOf("00400205") > 0 || vm.entType == 1){
            vm.hasAuthDelUser = true
        }
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        var timer = setInterval(function(){
            if(vm.defaultSubProjId != null){
                vm.getIntoDesignPage()//进入设计协调获取信息
                vm.getPosID()//获取posID，
                vm.checkAuth()//获取posID，
                vm.getFileTree()
                clearInterval(timer)
            }else{
                vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
            }
        },100)
    },
  watch:{
    //   <!-- options_monomer:[],//单体选项
    //     options_status:[],//状态选项
    //     options_about:[],//相关选项 -->
      value_monomer:function(val){
            var vm = this 
            vm.getContacts()
            vm.getCommunicationList()//获取评论
      },
       value_status:function(val){
            var vm = this 
            vm.getContacts()
            vm.getCommunicationList()//获取评论
      },
       value_about:function(val){
            var vm = this 
            vm.getContacts()
            vm.getCommunicationList()//获取评论
      },
      'show.basicAttributes':function(val){
          if(val){
            $("#basicAttributes").show(200);
          }else{
            $("#basicAttributes").hide(200);
          }
      },
     'show.BindingArtifacts':function(val){
          if(val){
            $("#BindingArtifacts").show(200);
          }else{
            $("#BindingArtifacts").hide(200);
          }
      },
      'addUser.posType':function(val){
          var vm = this
          vm.addUser.posName = ''
      },
      selectUgId:function(val){
            var vm = this 
            vm.getContacts()
            vm.getCommunicationList()//获取评论
            vm.updateLsug()
      },
  },
  methods:{
      checkIcon(val){
          var vm = this
          var iconArr = ['AVI','BMP','CAD','DOC','DOCX','FILE','GIF','GMD','JPG','MIDI','MP3','MPEG','PDF','PNG','PPT','PPTX','RAR','RVT','TIFF','TXT','WAV','WMA','XLS','XLSX']
          if(iconArr.indexOf(val) > -1){
              return true
          }else{
              return false
          }
      },
      SendMes(){
          var vm = this
          vm.goingToSend =true
      },
      hideSendMes(){
          var vm = this
          vm.goingToSend =false
      },
      updateLsug(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/updateLsug',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                ugId:vm.selectUgId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                
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
      getComment(val,index,showResponse,reviewCount,reload,event){
        var vm = this
        // console.log('liucheng')
        console.log(event)
        if(reviewCount == 0){
             vm.$message({
                type:'warning',
                message:'还没有评论!'
            })
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+val+'/review/list',
            headers:{
                'token':vm.token
            },
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
                vm.CommentList = response.data.rt.rows
                vm.CommunicationList.forEach((item,key)=>{
                    if(key == index){
                        item.showFlowChart = false
                        if(reload){
                            vm.$set(item,'showResponse',true)
                            var num = reviewCount++
                            vm.$set(item,'reviewCount',(reviewCount++))
                        }else{
                                vm.$set(item,'showResponse',!showResponse)
                        }
                    }else{
                         item.showResponse = false
                    }
                })
                if(event != null && event.isChecked)vm.CommunicationList.unshift(event)
                if(event != null){
                    vm.CommunicationList[index].flowCharts = event.data.flowCharts
                }
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
      changePage(val){
          var vm = this
        vm.getCommunicationList()
      },
      /****
       * @augments
       * index:评论的key值
       * key:主题的key值
      */
      deleteComment(dcId,dcReviewId,index,key){
           var vm = this
          vm.$confirm('您要删除当前评论?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                  axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/dc/'+dcId+'/'+dcReviewId+'/1/delete',
                        headers:{
                            'token':vm.token
                        },
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            vm.CommentList.splice(index,1)
                            vm.CommunicationList[key].reviewCount--
                            if(vm.CommunicationList[key].reviewCount < 0)vm.CommunicationList[key].reviewCount = 0
                            vm.$message({
                                type:'success',
                                message:'评论删除成功'
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
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      },
      deleteMes(dcId,index){
        var vm = this
          vm.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                  axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/dc/'+dcId+'/1/delete',
                        headers:{
                            'token':vm.token
                        },
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            vm.CommunicationList.splice(index,1)
                            vm.$message({
                                type:'success',
                                message:'主题删除成功'
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
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      },
      dcStatusConfirm(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+vm.dcStatus.obj.dcId+'/1/updateStatus',
            headers:{
                'token':vm.token
            },
        params:{
            dcStatus:vm.dcStatus.val,//
            operate:vm.dcStatus.obj.operate,//
        }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.CommunicationList[vm.dcStatus.obj.index].dcStatus = vm.dcStatus.val
                vm.$set(vm.CommunicationList[vm.dcStatus.obj.index],'statusText',vm.checkStatus(vm.dcStatus.val))
                vm.$message({
                    type:'success',
                    message:'状态修改成功'
                })
                vm.dcStatusCancle()
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
      dcStatusCancle(){
        var vm = this
        vm.dcStatus.val = '2'
        vm.dcStatus.show = false
        vm.dcStatus.obj = {}
      },
      updateStatus(dcId,dcStatus,operate,index){
          var vm = this
          if(!dcId)return false
          if(dcStatus == 0){
                vm.dcStatus.val = '2'
                vm.dcStatus.show = true
                vm.dcStatus.obj = {
                    dcId:dcId,
                    operate:operate,
                    index:index
                }
               return false
          }
          if(dcStatus != 0){
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/dc/'+dcId+'/1/updateStatus',
                    headers:{
                        'token':vm.token
                    },
                params:{
                    dcStatus:dcStatus,//
                    operate:operate,//
                }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$set(vm.CommunicationList[index],'dcStatus',dcStatus)
                        vm.$set(vm.CommunicationList[index],'statusText',vm.checkStatus(dcStatus))
                        vm.$message({
                            type:'success',
                            message:'状态修改成功'
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
          }
      },
      checkAuth(){
          var vm = this
          if(vm.projAuth.indexOf("00400202") > 0){
              vm.canEditMes = true
          }
          if(vm.projAuth.indexOf("00400203") > 0){
              vm.canDeleteMes = true
          }
      },
      collect(val,collect,index){
          var vm = this
          if(!val)return false
          var isCollect = collect?0:1
          axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/'+val+'/1/collect',
            headers:{
                'token':vm.token
            },
           params:{
               isCollect:isCollect //
           }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.CommunicationList[index].collect = collect?false:true
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
        checkStatus(val){
            var status = "正在处理"
            if(val){
                switch(Math.ceil(val)){
                    case 1:
                        status ="正在处理"
                        break;
                    case 2:
                        status ="解决完成"
                        break;
                    case 3:
                        status ="主题关闭"
                        break;
                }
            }
            return status
        },
       getCommunicationList(){
          var vm = this
          axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/list',
            headers:{
                'token':vm.token
            },
            data:{
                "builderId": vm.value_monomer,//单体 筛选
                "pageNo": vm.pageNo,
                "pageSize": 10,//默认是10
                "pageType": 1,//设计协调
                "projId": vm.projId,
                "status": vm.value_status,//状态 筛选
                "subProjId": vm.defaultSubProjId,
                "type": vm.value_about,//相关 筛选
                "ugId": vm.selectUgId,
                "userId": vm.userId
            }
        }).then((response)=>{
            vm.pageTotal = 0
            vm.CommunicationList = {}
            if(response.data.cd == 0){
               vm.CommunicationList = response.data.rt.rows
               vm.CommunicationList.forEach((item,index)=>{
                   vm.$set(item,'showFlowChart',false)
                   vm.$set(item,'showResponse',false)
                   vm.$set(item,'statusText',vm.checkStatus(item.dcStatus))
               })
               vm.pageTotal = response.data.rt.pager.totalSize
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
      deleteContact(projUserId,id){
            var vm = this
            vm.$confirm('您要删除该联系人吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/dc/delContactUser',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        userId:id,
                        projUserId:projUserId,
                        projId:vm.projId,
                        ugId:vm.selectUgId
                    }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.getContacts()
                    }else{
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
      ckeckUserInfo(id){
          var vm = this
          axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/viewContactDetails',
            headers:{
                'token':vm.token
            },
            params:{
                userId:id,
            }
        }).then((response)=>{
            if(response.data.cd == 0){
               vm.selectContact.infoShow = true
               vm.selectContact.infoObj = response.data.rt
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
      selectInfoCancle(){
        var vm = this
        vm.selectContact.infoShow = false
      },
      SelectConfirm(){
        var vm = this
        vm.fullscreenLoading = true
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/addDcProjectUser',
            headers:{
                'token':vm.token
            },
            data:{
                posId:vm.posId,
                ugId:vm.selectUgId,
                userId:vm.selectContact.obj.userId,
            },
            params:{
                projId:vm.projId,
                isActive:vm.selectContact.obj.isActive==0?false:true,
                email:vm.selectContact.obj.email,
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.addUser.show = false
                vm.addUser.posType = '1'
                vm.addUser.posName = ''
                vm.selectContact.show = false
                vm.selectContact.obj = {}
                vm.$message({
                    type:'success',
                    message:'联系人添加成功!'
                })
                vm.getContacts()
            }else{
                  vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
            vm.fullscreenLoading = false
        }).catch((err)=>{
            console.log(err)
        })
      },
      selectCancle(){
        var vm  = this
        vm.selectContact.show = false
        vm.selectContact.obj = {}
      },
      trim(str){ 
        /**去掉字符串前后所有空格*/
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
      },
      searchUser(){
          var vm = this
          vm.addUser.posName = vm.trim(vm.addUser.posName)
          if(vm.addUser.posName != ''){
              if(vm.addUser.posType == '1'){
                var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
                if(!myreg.test(vm.addUser.posName))
                {
                    vm.$message({
                        type:'warning',
                        message:'请输入有效的邮箱！'
                    })
                    return false
                }
              }
          }else{
               vm.$message({
                    type:'warning',
                    message:'请填写联系人'+vm.addUser.posType == '1'?'邮箱！':'账号！'
                })
              return false
          }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/dc/findUserByKeyWord',
                headers:{
                    'token':vm.token
                },
                params:{
                    params:vm.addUser.posName
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.selectContact.show = true
                        vm.selectContact.obj = response.data.rt
                    }else{
                        var warmMes = ''
                        if(vm.addUser.posType == '2'){//1是邮箱
                            warmMes = '没有找到账号为['+vm.addUser.posName+']的用户记录。请采用邮箱的方式添加联系人。'
                        }else{
                            warmMes = '没有找到邮箱为['+vm.addUser.posName+']的用户记录。是否向本邮箱用户发送加入当前工程协同工作的邀请?'
                        }
                        vm.$confirm(warmMes, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if(vm.addUser.posType == '1'){
                                axios({
                                    method:'POST',
                                    url:vm.BDMSUrl+'project2/dc/sendNoRegesterEmail',
                                    headers:{
                                        'token':vm.token
                                    },
                                    params:{
                                        email:vm.addUser.posName,
                                        projId:vm.projId,
                                    }
                                }).then((response)=>{
                                    if(response.data.cd == 0){
                                        vm.$message({
                                            type:'success',
                                            message:'邮箱为['+vm.addUser.posName+']的用户将收到您所发出的的协同工作邀请。此用户登录邮箱点击链接，补充完成信息后，即可登陆协同系统，成为当前工程的联系人成员'
                                        })
                                        vm.selectContact.show = false
                                        vm.selectContact.obj = {}
                                        vm.addUser.show = false
                                        vm.addUser.posType = '1'
                                        vm.addUser.posName = ''
                                    }else{
                                        vm.$message({
                                            type:'error',
                                            message:response.data.msg
                                        })
                                    }
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }else{
                                vm.addUser.posType = '1'
                            }
                        }).catch(() => {
                            if(vm.addUser.posType == '1'){//1是邮箱
                                vm.$message({
                                    type: 'info',
                                    message: '已取消发送邮件'
                                }); 
                            }
                                     
                        });
                    }
                
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'warning',
                        message:'未找到相关人员'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      userClose(){
        var vm = this
        vm.addUser.show = false
        vm.addUser.posType = '1'
        vm.addUser.posName = ''
      },
      addContact(){
          var vm = this
          vm.addUser.show = true
      },
      getPosID(){
          var vm = this
           axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/dc/addContact',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    userId:0
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.posId = response.data.rt.posId
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      deleteDrawing(){
          var vm = this
            vm.$confirm('此操作将永久删除该图纸, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/drawing/'+vm.checkFileDir.id+'/delete',
                    headers:{
                        'token':vm.token
                    },
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$message({
                            type:'success',
                            message:'图纸删除成功'
                        })
                        vm.getFileTree()
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
      confirmDrawing(){
        var vm = this
        if(vm.editDrawing.dcode == ''){
            vm.$message({
                type:'error',
                message:'图号不能为空！'
            })
            return false
        }
        if(vm.editDrawing.dname == ''){
            vm.$message({
                type:'error',
                message:'图名不能为空！'
            })
            return false
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/drawing/'+vm.editDrawing.dId+'/update',
            headers:{
                'token':vm.token
            },
            data:{
                dcode:vm.editDrawing.dcode,//这是图纸图号
                dname:vm.editDrawing.dname,//图纸名称
                dscale:vm.editDrawing.dscale//图纸比例
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.$message({
                    type:'success',
                    message:'图纸修改成功'
                })
                vm.getFileTree()
            }else if(response.data.cd == -1){
                vm.$message({
                    type:'error',
                    message:response.data.msg
                })
            }
            vm.editDrawing.renameshow = false
            vm.editDrawing.dId = ''
            vm.editDrawing.dcode =''
            vm.editDrawing.dname = ''
            vm.editDrawing.dscale = ''
        }).catch((err)=>{
            console.log(err)
        })
      },
      editMap(){
        var vm = this
        vm.editDrawing.renameshow = true
        vm.editDrawing.dId = vm.checkFileDir.id
        vm.editDrawing.dcode = vm.checkFileDir.dcode
        vm.editDrawing.dname = vm.checkFileDir.dname
        vm.editDrawing.dscale = vm.checkFileDir.dscale
      },
      loading(){
          var vm = this
           vm.$message({
                type:'info',
                message:'虚拟场景面板未打开，请打开左侧虚拟场景面板。'
            })
      },
      addFile(){
        var vm = this
        vm.fileName.show = true
        vm.fileName.new = true
        vm.fileName.title = '新建目录'
      },
      deleteFileList(index){
          var vm = this
          vm.fileList.splice(index,1)
      },
       fileChanged(file){
            var vm = this
            const list = vm.$refs.drawingsInfo.files
            vm.fileList.push({
                file:list[0],//文件
                drawingNo:'',//图号
                proportion:'',//比例
                fileName:list[0].name,//文件名
                drawingName:list[0].name.split('.')[0],//图纸名
            })
            console.log(vm.fileList)
        },
      addfileCancle(){
          var vm = this
           vm.fileName.newFileName = ''
        vm.fileName.show = false
      },
      uploadFile(){
        var vm = this
        vm.drawingsUploadShow = true
      },
      drawingsUploadCancel(){
        var vm = this
        vm.drawingsUploadShow = false
        vm.fileList = []
      },
      drawingsUploadConfirm(){
        var vm = this
        for(var i=0;i<vm.fileList.length;i++){
            // <input  placeholder="请输入" v-model="item.drawingNo" class="calculateInp">
            // <input  placeholder="请输入" v-model="item.drawingName" class="calculateInp">
            if(vm.fileList[i].drawingNo == ''){
                vm.$message({
                    type:'error',
                    message:'图号不能为空！'
                })
                return false
            }
            if(vm.fileList[i].drawingName == ''){
                vm.$message({
                    type:'error',
                    message:'图名不能为空！'
                })
                return false
            }
            if(vm.fileList[i].proportion == ''){
                vm.$message({
                    type:'error',
                    message:'比例不能为空！'
                })
                return false
            }
        }
        vm.fullscreenLoading = true
        vm.fileList.forEach((item,index)=>{
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
            var returnUrl = vm.BDMSUrl+'project2/drawing/'+vm.projId+'/'+vm.defaultSubProjId+'/add?dcode='+item.drawingNo+'&ddId='+vm.checkFileDir.id+'&dname='+item.fileName+'&dscale='+item.proportion+'&entId='+vm.entId
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
             formData.append('type',1);
            formData.append('file',item.file);
            formData.append('userId',vm.userId);
            formData.append('modelCode','002');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                console.log(response)
                if(response.data.rt){
                    vm.drawingsUploadShow = false
                    vm.fileList = []
                }
                if(response.data.cd == 10001){
                     vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.getFileTree()
            }).catch((err)=>{
                console.log(err)
                vm.drawingsUploadShow = false
                vm.fileList = []
            })
        })
        vm.fullscreenLoading = false
      },
      addfileConfirm(){
        var vm = this
        if(vm.fileName.new){
             axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/drawing/directory/add',
                headers:{
                    'token':vm.token
                },
                data:{
                    ddName: vm.fileName.newFileName,
                    ddParId: vm.checkFileDir.id,//当前文件夹ID
                    subProjId:vm.defaultSubProjId,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录添加成功'
                    })
                    vm.getFileTree()
                    vm.fileName.show = false
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fileName.newFileName = ''
            }).catch((err)=>{
                console.log(err)
            })
        }else{
             axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/drawing/directory/'+vm.checkFileDir.id+'/rename',
                headers:{
                    'token':vm.token
                },
                params:{
                    ddName: vm.fileName.newFileName,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录修改成功'
                    })
                    vm.getFileTree()
                    vm.fileName.show = false
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fileName.newFileName = ''
            }).catch((err)=>{
                console.log(err)
            })
        }
      },
       renameCancle(){
        var vm = this
         vm.PointFigure.renameshow = false
      },
      editDrawingCancle(){
        var vm = this
        vm.editDrawing.renameshow = false
        vm.editDrawing.dId = ''
        vm.editDrawing.dcode = ''
        vm.editDrawing.dname = ''
        vm.editDrawing.dscale = ''
      },
      renameFile(){
         var vm = this
        if(vm.checkFileDir.ddParId == 0){
            vm.$message({
            type: 'error',
            message: '该节点不能修改名称！'
          });  
          return false
        }
        vm.fileName.show = true
         vm.fileName.new = false
        vm.fileName.title = '重命名目录'
      },
      deleteFile(){
        var vm = this
         if(vm.checkFileDir.ddParId == 0){
            vm.$message({
            type: 'error',
            message: '该节点不能删除！'
          });  
          return false
        }
         vm.$confirm('此操作将永久删除当前节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/drawing/directory/'+vm.checkFileDir.id+'/delete',
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'节点删除成功'
                    })
                    vm.getFileTree()
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
    renameIMG(){
        var vm = this
        var fgID = vm.PointFigure.fgID?vm.PointFigure.fgID:vm.checkedRound.ID
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/updateFileGroupName',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:fgID,
                fgName: vm.PointFigure.newname
            },
        }).then((response)=>{
            if(response.data.cd == 0){
              
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      handleNodeClick(obj){
          var vm = this
          vm.showAction = true
          if(!obj.isLeaf){
            vm.IsFolderAction = true
            if(!obj.children){
                vm.$message({
                    type:'info',
                    message:'这个文件夹没有子文件或图纸!'
                })
            }
          }else{
              vm.IsFolderAction = false
          }
         vm.checkFileDir = obj//选中的文件夹
         if(vm.expandedKeys.indexOf(vm.checkFileDir.id) == -1){
            vm.expandedKeys.push(vm.checkFileDir.id)
          }
      },
      initData(val){
          if(!val)return ''
          var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
          return tt; 
      },
      /**
         * 预览文件集文件
         * @param fileUuid
         */
    preview(val){
        var vm = this
        if(val){
             window.open(vm.QJFileManageSystemURL+val+"/preview");
        }else{
              window.open(vm.QJFileManageSystemURL+vm.checkFileDir.dpath+"/preview");
        }
    },
    getIntoDesignPage(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/designCoordination',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.siteHolderId = response.data.rt.siteHolderId
                vm.ugList = response.data.rt.ugList
                vm.ugList.forEach((item)=>{
                    if(item.ugId == response.data.rt.selectUgId){
                        vm.$set(item,'checked',true)//设置checked属性，用于文件权限弹窗选择使用
                    }else{
                         vm.$set(item,'checked',false)//设置checked属性，用于文件权限弹窗选择使用
                    }
                })
                vm.options_monomer = response.data.rt.subProjects//单体列表
                vm.options_monomer.unshift({
                    id:response.data.rt.siteHolderId,
                    Name:'场地总体'
                },)
                vm.value_monomer = response.data.rt.siteHolderId
                vm.selectUgId = response.data.rt.selectUgId
                vm.getContacts()
                vm.getCommunicationList()//获取评论
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
    getContacts(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/searchDcProjectUserList',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                condition:'',
                ugId:vm.selectUgId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
               vm.contacts = response.data.rt
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getFileTree(){
        var vm = this
        var setting = {
            data: {
                key:{
                    name: "ddName",
                    children:'children',
                    title:"ddName",
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "ddParId",
                    rootPId: 0
                }
            }
        }
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/drawing/'+vm.projId+'/'+vm.defaultSubProjId+'/list',
            headers:{
                'token':vm.token
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                var drawingList = response.data.rt.drawingList
                if(drawingList != null){
                      drawingList.forEach((item,index) => {
                        vm.$set(item,'ddParId',item.ddId)
                        vm.$set(item,'isLeaf',true)
                        vm.$set(item,'ddName',item.dcode+'('+item.dname+')')
                    });
                }
                var drawingDirList = response.data.rt.drawingDirList
                if(drawingList != null){
                      var children = drawingDirList.concat(drawingList)
                }else{
                     var children = drawingDirList
                }
                vm.FileTree_original = children
                vm.FileTree = data.transformTozTreeFormat(setting, children)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
  }
}
</script>