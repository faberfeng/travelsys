<template>
<div id="cloudDrive">
        <div id="GroupSelect">
            <select v-model="selectUgId" class="inp-search" @change="InitselectUgId">
                <option :value="item.ugId" v-for="(item,index) in  ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/Drive/costover'" class=" label-item">  
                    最近文档  
                    </router-link>
                    <router-link :to="'/Drive/cloudDrive'"  class="label-item label-item-active">  
                    工程云盘  
                    </router-link>
                    <router-link :to="'/Drive/Share'" class=" label-item">  
                        已经分享  
                    </router-link>
                    <router-link :to="'/Drive/PersonalTransit'" class=" label-item">  
                        个人中转  
                    </router-link>
                    <div class="item-search" v-if="!showQuanJing">
                        <span class="title-right">
                            <input type="text" v-model="fileSearchInfo" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="getInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                        </span>
                        <select v-model="docType" class="inp-search">
                            <option value="">全部文档</option>
                            <option value="1">我的上传</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                        <span class="icon-type" @click="listStyle = (listStyle == 'card'?'table':'card')"></span>
                    </div>
                </div>
                <p class="antsLine" v-if="!showQuanJing">
                    文档管理<i class="icon-sanjiao-right"></i>工程云盘<i class="icon-sanjiao-right"></i>
                    <span class="strong" v-for="item in mayiList" :key="item.nodeId+'antLine'" @click="IntoDir(item)" v-html="item.nodeName+'<i class=\'icon-sanjiao-right\'></i>'"></span>
                </p>
                <p class="select-header clearfix">
                    <label  v-if="!showQuanJing" :class="[checkAll?'active':'','checkbox-fileItem']" for="allfile" @click="initAll()"></label>
                    <input  v-if="!showQuanJing" type="checkbox" id='allfile' class="el-checkbox__original" v-model="checkAll">
                    <span class="icon icon-upload" v-if="!hasImg && showQuanJing" @click="updateImg('上传平面图',false,0,'image/*')">上传平面图</span>
                    <span class="icon icon-refresh" v-if="hasImg && showQuanJing" @click="updateImg('更新平面图',false,QJ.imageBackground.fgId,'image/*')">更新平面图</span>
                    <!--
                        文件夹的操作：剪切、粘贴、复制、分享、（批量下载） 

                        具体文件（包括点位文件）的操作：剪切、粘贴、删除、更新、更名、复制、分享,（下载：：：：点位文件不包括下载）

                    -->
                    <span class="icon icon-new" v-if="showQuanJing" @click="updateImg('新建点位',true,0,'image/*')">新建点位</span>
                    <ul class="operation" style="margin-right: 10px;">
                        <li class="item-upload" v-if="!showQuanJing"  @click="uploadfile">上传文件</li>
                    </ul>
                    <ul class="operation">
                        <li class="item"  v-if="checkedRound.checked || checkedFile_Folder.file || checkedFile_Folder.folder" @click="copyfile(true)">剪切</li>
                        <li class="item"  v-if="checkedFile_Folder.file && !checkedFile_Folder.folder" @click="downloadFile" >下载</li>
                        <li class="item"  v-if="((showQuanJing && checkedRound.checked) || checkedFile_Folder.file) &&  !checkedFile_Folder.folder" @click="deletePoint">删除</li>
                        <li class="item"  v-if="((showQuanJing && checkedRound.checked) || (checkedFile_Folder.file && checkedFile_Folder.fileCheckedNum == 1)) &&  !checkedFile_Folder.folder" @click="updatePoint">更新</li>
                        <li class="item"  v-if="((showQuanJing && checkedRound.checked) || (checkedFile_Folder.file && checkedFile_Folder.fileCheckedNum == 1)) &&  !checkedFile_Folder.folder" @click="rename">更名</li>
                        <li class="item" @click="paste" v-if="hasFileToPaste.is">粘贴</li>
                        <li class="item"  v-if="checkedRound.checked || checkedFile_Folder.file || checkedFile_Folder.folder" @click="copyfile(false)" v-loading.fullscreen.lock="fullscreenLoading">复制</li>
                        <li class="item"  v-if="checkedRound.checked || checkedFile_Folder.file || checkedFile_Folder.folder" @click="shareURL">分享</li>
                        <li class="item" v-if="!checkedFile_Folder.file && checkedFile_Folder.folder" @click="downloadBatchFile">批量下载</li>
                    </ul>
                </p>
                <!--全景图代码-->
                <div id="planeFigureDiv" v-if="showQuanJing">
                    <div  id="planeDIV">
                        <img :src="QJFileManageSystemURL+QJ.imageBackground.filePath" id="planeFigure">
                        <span :class="['round',{'active':item.checked}]" v-for="(item,index) in QJ.point" :data-fgId="item.fgId" 
                        @click="checkRound(index)" @dblclick="dbcheckRound(item.fgId,item.xAxial,item.yAxial,item.fileId,item.fileName)"
                        :data-left="item.xAxial" :data-top="item.yAxial"  :id="index+'round'"
                        :key="index" :style="{'top':item.yAxial+'px','left':item.xAxial+'px'}">
                        </span>
                    </div>
                </div>
                <div v-else>
                <!--文件夹代码-->
                <div id="file-container" v-if="listStyle == 'card'">
                    <ul class="clearfix" style="padding: 0px 10px 15px 20px;">
                        <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in fileList" :key="index+'file'" @click="checkItem(index,true)" >
                            <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click.stop="checkItem(index,true,true)"></label>
                            <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                            <div class="item-file-box clearfix">
                                <span  class="item-file-image">
                                <img :src="require('./images/icon/'+item.icon)" />
                                </span>
                                <span  class="item-file-detial">
                                    <h3 v-text="item.fgName"></h3>
                                    <p>由<span class="text-name" v-text="item.updateUser"></span>通过<span v-text="item.uploadFromExplorer == 1?'浏览器':'手机端'"></span>上传</p>
                                    <p v-text="initData(item.updateTime)"></p>
                                    <p class="operation">
                                        <span v-text="'版本'+item.version"></span>
                                        <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName)"></i>
                                        <i class="icon-goujian icon-download" @click="downLoad(index)"></i>
                                    </p>
                                </span>
                            </div>
                        </li>
                        <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in folderList" :key="index+'folder'" @click="checkItem(index)"  @dblclick="IntoDir(item)">
                            <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click.stop="checkItem(index,false,true)" ></label>
                            <input type="checkbox" :id='item.nodeId+"file"' class="el-checkbox__original" v-model="item.checked">
                            <div class="item-file-box clearfix">
                                <span  class="item-file-image item-folder-image">
                                <img :src="require('./images/folderBig.png')" />
                                </span>
                                <span  class="item-file-detial">
                                    <h3 v-text="item.nodeName"></h3>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="file-container-table" v-else>
                    <table class="UserList" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th style="width:55px;"></th>
                                <th style="min-width:428px;">文件名</th>
                                <th style="width:70px;"></th>
                                <th style="width:70px;">更新渠道</th>
                                <th style="width:50px;">类型</th>
                                <th style="width:40px;">版本</th>
                                <th style="min-width:60px;">上传人</th>
                                <th style="min-width:150px;">更新时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in fileList" :key="index" :class="[{'active':item.checked}]"  @click="checkItem(index,true)">
                                <td @click.stop="checkItem(index,true,true)"><!--多选框-->
                                    <label :class="[item.checked?'active':'','checkbox-fileItem']" ></label>
                                    <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                                </td>
                                <td>
                                    <img :src="require('./images/icon/'+item.icon)" />
                                    <span v-text="item.fgName"></span>
                                </td>
                                <td>
                                    <i class="icon-goujian icon-download" @click="downLoad(index)"></i>
                                    <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName)"></i>
                                </td>
                                <td  v-text="item.uploadFromExplorer == 1?'浏览器':'手机端'"></td>
                                <td v-text="splitType(item.icon)"></td>
                                <td v-text="item.version"></td>
                                <td v-text="item.uploadUser"></td>
                                <td v-text="initData(item.updateTime)"></td>
                            </tr>
                            <tr v-for="(item,index) in folderList" :key="index+'table'" :class="[{'active':item.checked}]" @click="checkItem(index)"  @dblclick="IntoDir(item)">
                                <td @click.stop="checkItem(index,false,true)"><!--多选框-->
                                    <label :class="[item.checked?'active':'','checkbox-fileItem']" ></label>
                                    <input type="checkbox" :id='item.nodeId+"file"' class="el-checkbox__original" v-model="item.checked">
                                </td>
                                <td>
                                    <img :src="require('./images/folderBig.png')" />
                                    <span v-text="item.nodeName"></span>
                                </td>
                                <td></td>
                                <td  v-text="'-'"></td>
                                <td v-text="'-'"></td>
                                <td v-text="'-'"></td>
                                <td v-text="'-'"></td>
                                <td v-text="item.createTime?initData(item.createTime):'-'"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                    <span class="item-property " @click="screenLeft.item = 1">目<br>录</span>
                    <span class="item-version " @click="screenLeft.item = 2">属<br>性</span>
                    <span class="item-version-3  " @click="screenLeft.item = 3;getVersion()">版<br>本</span>
                </div>
            </div>
            <!-- <div id="verticalBar"></div> -->
            <div v-show="screenLeft.show" v-if="screenLeft.item == 1" class="screenRight_1">
                 <p class="clearfix">
                    <i class="icon-goujian icon-add" title="添加" @click="addFile"></i>
                    <i class="icon-goujian icon-authrity"  title="权限" @click="authrityFile"></i>
                    <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile"></i>
                    <i class="icon-goujian icon-edit"  title="重命名" @click="renameFile"></i>
                </p>
                <div   @click.stop="initTreeFolder()">
                    <el-tree
                    :data="FileTree"
                    ref="fileTree_cloudDrive"
                    node-key="nodeId"
                    :props="defaultProps"
                    :default-expanded-keys="expandedKeys"
                    highlight-current
                    @node-expand="nodeClick"
                    @node-collapse="nodeClickClose"
                    @node-click="handleNodeClick"
                    id="cloudDirveFileTree"
                    >
                     <span :class="['custom-tree-node','el-tree-node__label',(data.isAutoCreated == 1 && data.holderId != null)?'qjLeaf':'']" slot-scope="{ node, data }" v-text="node.label?node.label:'(名称空)'"></span>
                    </el-tree>
                </div>
            </div>
            <div id="box-right" v-show="screenLeft.show" v-if="screenLeft.item == 2">
                <div v-if="((showQuanJing && checkedRound.checked) || (checkedFile_Folder.file && checkedFile_Folder.fileCheckedNum == 1)) &&  !checkedFile_Folder.folder">
                    <h3 class="header-attribute" style="margin-top:0px;">
                        <i class="trrangle"></i>
                        基本属性
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                    <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]" v-if="!showQuanJing">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">文件名</span>
                            <span class="detial-text-value" v-text="checkedItem.fgName"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">版本</span>
                            <span class="detial-text-value" v-text="checkedItem.version"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">上传人</span>
                            <span class="detial-text-value" v-text="checkedItem.uploadUser"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">上传时间</span>
                            <span class="detial-text-value" v-text="initData(checkedItem.uploadTime)"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新人</span>
                            <span class="detial-text-value" v-text="checkedItem.updateUser"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新时间</span>
                            <span class="detial-text-value" v-text="initData(checkedItem.updateTime)"></span>
                        </li>
                    </ul>
                    <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]" v-if="showQuanJing">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">文件名</span>
                            <span class="detial-text-value" v-text="checkedRound.fgName"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">版本</span>
                            <span class="detial-text-value" v-text="checkedRound.version"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">上传人</span>
                            <span class="detial-text-value" v-text="checkedRound.uploadUser"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">上传时间</span>
                            <span class="detial-text-value" v-text="initData(checkedRound.uploadTime)"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新人</span>
                            <span class="detial-text-value" v-text="checkedRound.updateUser"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">更新时间</span>
                            <span class="detial-text-value" v-text="initData(checkedRound.updateTime)"></span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 30px;">
                        <i class="trrangle"></i>
                        绑定构件
                        <i :class="[{'active':show.BindingArtifacts},'icon-dropDown']" @click="show.BindingArtifacts = show.BindingArtifacts?false:true;"></i>
                    </h3>
                    <ul id="BindingArtifacts" :class="[{'show':show.BindingArtifacts}]">
                        <li class="goujian-item" v-for="(item,index) in GouJianItem" :key="index">
                            <p class="clearfix">
                                <i class="icon-goujian icon-add"></i>
                                <i class="icon-goujian icon-detial"></i>
                                <i class="icon-goujian icon-QRcode"></i>
                                <i class="icon-goujian icon-location"></i>
                                <i class="icon-goujian icon-delete"></i>
                            </p>
                            <p class="item-detial">
                                <span class="detial-text-name">ID :</span>
                            <span class="detial-text-value" v-text="item.main.pkId"></span>
                            </p>
                            <p class="item-detial">
                                <span class="detial-text-name">状态 :</span>
                            <span class="detial-text-value" v-text="parseMStatus(item.main.mStatus)+'('+item.main.mStatus+')'"></span>
                            </p>
                            <p class="item-detial">
                                <span class="detial-text-name">明细 :</span>
                            <span class="detial-text-value" v-text="item.details.length"></span>
                            </p>
                            <p class="item-detial">
                                <span class="detial-text-name">名称 :</span>
                            <span class="detial-text-value" v-text="item.main.mName"></span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div v-else>
                     <h3 class="header-attribute" style="margin-top:0px;">
                        <i class="trrangle"></i>
                        基本属性
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                    <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]" v-if="!showQuanJing">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name" style="width: 80px;">文档选择数量</span>
                            <span class="detial-text-value" v-text="checkedFile_Folder.fileCheckedNum"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name" style="width: 90px;">文件夹选择数量</span>
                            <span class="detial-text-value" v-text="checkedFile_Folder.folderCheckedNum"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="box-right-1" v-show="screenLeft.show" v-if="screenLeft.item == 3">
                <div v-if="((showQuanJing && checkedRound.checked) || (checkedFile_Folder.file && checkedFile_Folder.fileCheckedNum == 1)) &&  !checkedFile_Folder.folder">
                    <p class="head" v-if="checkedItem.dirId || checkedRound">
                        <i class="icon-goujian icon-search" @click="view()"></i>
                        <i class="icon-goujian icon-download" @click="downLoad()"></i>
                        <select v-model="posType" class="inp-search">
                            <option value="">所有版本</option>
                            <option value="1">本周更新</option>
                            <option value="2">本月更新</option>
                            <option value="3">本年更新</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </p>
                    <ul>
                        <li :class="[item.checked?'active-item':'','item-version']" v-for="(item,index) in  versionItem" :key="index" @click="selectVersion(index)">
                            <div class="clearfix">
                                <img :src="QJFileManageSystemURL+'/'+item.imgUuid" class="img" alt="">
                                <div class="versin-detial">
                                    <span class="user-name" v-text="item.uploadUserName"></span>
                                    <span class="version-number" v-text="'版本-'+item.version"></span>
                                    <p class="version-des">上传了新文档</p>
                                </div>
                            </div>
                            <p class="item-date">{{initData(item.uploadTime)+'来自'+(item.uploadFromExplorer == 1?'浏览器':'手机端')+'更新'}}</p>
                        </li>
                    </ul>
                 </div>
            </div>
        </div>
      <div id="edit">
        <upload :uploadshow='uploadImg.checked' v-on:hiddenupload="hiddenupload" v-on:refreshqj="refreshqj" :dirid="checkFileDir.nodeId" :title="uploadtitle" :accept="acceptType"
        :fgid="QJfgid" :isqj="isqj" :ugid='selectUgId'
        ></upload>
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
          <el-dialog :title="sharePath.path ==''?'分享文件':'分享链接'" :visible.sync="sharePath.show" @close="sharePathHide">
            <div class="editBody">
                <p style="font-size: 14px; line-height: 1.5em" v-if="sharePath.path ==''">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文档一但被分享，获得该地址的任何人都可以浏览、下载和使用。将不再受到用户账号和工程授权的制约。如果相关文档涉工程内保密信息不建议进行公开分享。
                </p>
                <div class="editBodytwo imageBody" v-if="sharePath.path !=''">
                    <label class=" imageBodyText">链接 :</label>
                    <textarea class="inp"  v-text="sharePath.path"></textarea>
                </div>
                <div class="editBodytwo imageBody" v-if="sharePath.password !=''">
                    <label class=" imageBodyText">密码 :</label>
                     <input type="text" class="inp" :value="sharePath.password">
                </div>
                <input type="text" id="copyInput" :value="sharePath.password !=''?'链接：'+sharePath.path+' 密码：'+sharePath.password:sharePath.path" style=" opacity: 0;">
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="shareBtn(3)" v-if="sharePath.path ==''">公开分享</button>
                <button class="editBtnS" @click="shareBtn(2)" v-if="sharePath.path ==''">密钥分享</button>
                <button class="editBtnS" id="copyhref"  data-clipboard-action="cut" data-clipboard-target="#copyInput" @click="copyURL" v-if="sharePath.path !=''">复制</button>
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
         <el-dialog title="文件夹权限修改" :visible.sync="auth.show" @close="authCancle">
            <div class="editBody">
                 <p style="font-size: 14px; line-height: 1.5em;text-align:left;padding-left:50px;" v-text="'下列勾选的群组可以访问文件夹：'"></p>
                <p style="font-size: 14px; line-height: 1.5em;text-align:left;padding-left:50px;" v-text="checkFileDir.nodeName"></p>
                <div class="selectionBox">
                    <p  v-for="(item,index) in  fileAuthList" :key="index" style="margin-bottom:5px;">
                        <label :class="[item.isCheck?'active':'','checkbox-fileItem']" :for="'ug-'+item.ugId"></label>
                        <input type="checkbox" class="el-checkbox__original" v-model="item.isCheck" :id="'ug-'+item.ugId">
                        <label v-text="item.ugName" :for="'ug-'+item.ugId"></label>
                    </p>
                </div>
            </div>
            <div  style="font-size: 14px; line-height: 14px;text-align:left;padding-left:50px;">
                <label :class="[auth.isSubUse?'active':'','checkbox-fileItem']" for="auth_isSubUse"></label>
                <input type="checkbox" class="el-checkbox__original" v-model="auth.isSubUse" id="auth_isSubUse">
                <label for="auth_isSubUse">将权限应用到所有子目录</label>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="authConfirm">确认</button>
                <button class="editBtnC" @click="authCancle">取消</button>
            </div>
        </el-dialog>
    </div>
</div>
</template>
<style  lang='less'>
#cloudDrive{
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
        min-height: 16px;
        color: #666666;
        padding-left: 22px; 
        position: relative;
    }
    .qjLeaf{
        font-weight: bold;
    }
    .el-icon-caret-right:before{
           content: "\E604";
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
        background: url('./images/file.png')no-repeat 0 0;
        content: '';
    }
    .el-tree-node__content{
            height: 30px;
    }
    .is-current .el-tree-node__content{
        color: #333333;
        // font-weight: bold;
    }
    .is-current_fistload > .el-tree-node__content {
        background-color: #dfdfdf;
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
    #edit .el-dialog{
        margin: 0 auto;
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
            background: url('./images/checked.png') no-repeat 1px 2px;
                border: 1px solid #fc3439;
        }
    }
    #GroupSelect{
        // display: block;
        // width: 168px;
        // height: 30px;
        // position: fixed;
        // top: 77px;
        // z-index: 1000;
        // right: 24px;
        display: inline-block;
        float: right;
        margin-top:-40px;
        margin-right:10px;
        width: 168px;
        height: 30px;
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
            top: 19px;
            right: 18px;
        }
    }
    .box-left-container{
        // display: block;
        // position: fixed;
        // top: 115px;
        // left: 26px;
        // bottom: 0;
        // right: 225px;
        // transition:  all ease .5s;
        // overflow: auto;
        display: inline-block;
        width: 85%;
        position: relative;
        // margin-top:109px;
        // margin-left:24px;
        // z-index: 1001;
        transition:  all ease .5s;
        #planeFigureDiv{
            overflow: auto;
            position: absolute;
            top: 106px;
            left: 0;
            bottom: 0;
            right: 25px;
            #planeDIV{
                display:block;
                position:absolute;
                margin: 0 15px 15px;
                #planeFigure{
                    min-width: 700px;
                    min-height: 500px;
                }
            }
            .round{
                display: block;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 24px;
                height: 32px;
                background: url('./images/site.png')no-repeat 0 0;
            }
            .active{
                background: url('./images/site1.png')no-repeat 0 0;
            }
        }
         .title-right{
            float: left;;
            width: 214px;
            height: 30px;
            margin-right: 10px;
            position: relative;
            .title-right-icon{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:40px;
                margin-right: 5px;
                outline: none;
                &:focus{
                      background: #ffffff;  
                }
            }
            .el-icon-search{
                position: absolute;
                right: 10px;
                top: 8px;
            }
        }
        .item-search{
            position: absolute;
            display: block;
            right: 35px;
            top: 10px;
            width: auto;
            .inp-search{
                width: 82px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:20px;
                box-sizing: border-box;  
                margin-right: 15px;
                float: left;
                color: #999999;
                font-size: 12px;
                outline: none;
            }
            .icon-sanjiao{
                display: block;
                position: absolute;
                width: 8px;
                height: 4px;
                background-image:url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 14px;
                right: 55px;
            }
            .icon-type{
                float: left;
                width: 30px;
                height: 30px;
                border: 1px solid #cccccc;
                background: #f2f2f2;
                position: relative;
                cursor: pointer;
                border-radius: 2px;
                &::after{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 5px;
                    width: 18px;
                    height: 13px;
                    background: url('./images/type.png')no-repeat 0 0;
                    content: '';
                }
                &:hover{
                      background: #fff6f7;
                }
            }
        }
        .antsLine{
            padding: 10px 10px 0px 20px;
            font-size: 12px;
            line-height: 12px;
            color: #999999;
            text-align: left;
            .icon-sanjiao-right{
                 display: inline-block;
                width: 7px;
                height: 10px;
                margin: 2px 7px 0;
                background-image:url('./images/sanjiaoright.png');
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
        .select-header{
            padding: 15px 10px 0px 20px;
            min-height: 41px;
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
                    content: '全部';
                }
            }
            .active{
                background: url('./images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
            }
            .operation{
                float: right;
                margin-right: 35px;
                .item{
                    float: left;
                    padding: 0 12px;
                    height: 26px;
                    line-height: 24px;
                    border-top: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    border-right: 1px solid #cccccc;
                    text-align: center;
                    color: #333333;
                    font-size: 12px;
                    cursor: pointer;
                    &:first-of-type{
                        border-left: 1px solid #cccccc;
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                    }
                     &:last-of-type{
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                    }
                    &:hover{
                        background:  #fff6f7;
                    }
                }
                .item-upload{
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
                        background: url('./images/uploadfile.png') no-repeat 0 0;
                    }
                }
            }
            .icon{
                border:1px solid #cccccc;
                float: left;
                width: 99px;
                height: 26px;
                line-height: 26px;
                text-align: left;
                font-size: 12px;
                color: #333333;
                position: relative;
                padding-left:28px; 
                cursor: pointer;
                &::before{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 11px;
                    width: 12px;
                    height: 12px;
                    content: '';
                }
                &:hover{
                    background: #fff6f7;
                }
                
            }
            .icon:first-of-type{
                border-right: 0;
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }
            .icon-upload{
                 &::before{
                   background: url('./images/upload.png')no-repeat 0 0;
                }
            }
            .icon-refresh{
                &::before{
                   background: url('./images/refresh.png')no-repeat 0 0;
                }
            }
            .icon-new{
                // border-left: 0;
                 border-top-right-radius: 2px;
                 border-bottom-right-radius: 2px;
                &::before{
                      top: 7px;
                   background: url('./images/spot.png')no-repeat 0 0;
                }
            }
        }
        .select-header{
            text-align: left;
            .el-checkbox{
                float: left;
            }
            .button-download{
                float: right;
                width: 52px;
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: #333333;
                text-align: center;
                border: 1px solid #cccccc;
                border-radius: 2px;
                cursor: pointer;
                margin-right:25px; 
                &:hover{
                    background: #fff6f7;
                }
            }
        }
        #file-container{
            
             .icon-goujian{
                float: right;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .icon-download{
                background: url('./images/download.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/download1.png')no-repeat 0 0;
                }
            }
             .icon-search{
                background: url('./images/search.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/search1.png')no-repeat 0 0;
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
                    background: url('./images/checked.png') no-repeat 1px 2px;
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
                    .item-folder-image{
                        img{
                            width: 36px;
                            height: 33px;
                            display: block;
                            margin-top: 19PX;
                            margin-left: 17px;
                        }
                    }
                    .item-file-detial{
                        display: block;
                        margin-left:80px; 
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
            .item-file-active{
                box-shadow: 0px 1px 8px rgba(252,52,57,.2);
            }
        }
        #file-container-table{
           margin-top: 10px;
            .UserList{
                border-collapse: collapse;
                thead{
                    border-bottom: 1px solid #d9d9d9;
                    th{
                        height: 32px;
                        text-align: left;
                        font-size: 12px;
                        color: #999999;
                        font-weight: normal;
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
                            border-bottom: 1px solid #f2f2f2;
                            .checkbox-fileItem{
                                display:block;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #cccccc;
                                cursor: pointer;
                                margin-left: 20px;
                            }
                            .active{
                                background: url('./images/checked.png') no-repeat 1px 2px;
                                border: 1px solid #fc3439;
                            }
                            img{
                                height: 18px;
                                float: left;
                                margin-right: 7px;
                            }
                            .icon-goujian{
                                float: left;
                                display: none;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                            }
                            .icon-download{
                                background: url('./images/download.png')no-repeat 0 0;
                                margin-right:20px; 
                                &:hover{
                                    background: url('./images/download1.png')no-repeat 0 0;
                                }
                            }
                            .icon-search{
                                background: url('./images/search.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/search1.png')no-repeat 0 0;
                                }
                            }
                        }
                        &:hover{
                            background: #fafafa;
                            .icon-goujian{
                                display: inline-block;
                            }
                        }
                    }
                    .active{
                        td{
                            background: #fafafa;
                             .icon-goujian{
                                display: inline-block;
                            }
                             .icon-download{
                                background: url('./images/download1.png')no-repeat 0 0;
                            }
                            .icon-search{
                                background: url('./images/search1.png')no-repeat 0 0;
                            }
                        }
                    }
                }
            }
        }
    }
    .box-left-avtive{
        width: 98%;
        transition:  all ease .5s;
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
        // right: -225px;
        // bottom: 0;
        // width: 250px;
        // padding-left: 25px;
        // top: 116px;
        // transition: all ease .5s;
        // background: #ffffff;
        // z-index: 10;
        // overflow-y: auto;
        display: inline-block;
        position: relative;
        float: right;
        width: 15%;
        // margin-top: -763px;
        transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
        height: 785px;
        overflow-y: auto;
        overflow-x: hidden;
            #verticalBar{
                display: block;
                position: fixed;
                right: 225px;
                bottom: 0;
                width: 1px;
                top: 116px;
                background: #cccccc;
                z-index: 10;
            }
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
                    background: url('./images/right.png')no-repeat 0 0;
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
                border-right: 1px solid #cccccc;
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
            .item-version{//属性
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
                    // background: #fff;
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
        .screenRight_1{
            // padding: 10px 14px 10px 10px;
            padding: 10px 0px 5px 0px;
            margin: 0 14px 0 30px;
            #cloudDirveFileTree{
                display: block;
                position: absolute;
                left: 32px;
                right: 0;
                bottom: 0;
                top: 42px;
                overflow-y: auto;
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
                background: url('./images/add.png')no-repeat 0 0;
                margin-right: 60px;
                &:hover{
                    background: url('./images/add1.png')no-repeat 0 0;
                }
            }
            .icon-authrity{
                float: right;
                background: url('./images/authority.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/authority1.png')no-repeat 0 0;
                } 
            }
            .icon-edit{
                 float: right;
                background: url('./images/edit.png')no-repeat 0 0;
                margin-right: 10px;
                &:hover{
                    background: url('./images/edit1.png')no-repeat 0 0;
                } 
            }
            .icon-delete{
                 float: right;
                background: url('./images/delete.png')no-repeat 0 0;
                margin-right: 10px;
                &:hover{
                    background: url('./images/delete1.png')no-repeat 0 0;
                } 
            }
        }
    }
    .box-right-avtive{
        width: 2%;
        transition: all ease .5s;
    }
    #box-right{
        padding: 19px 13px 0 10px;
        margin-left:24px;
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
                background:url('./images/arror.png')no-repeat 0 0; 
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
                max-width: 120px;
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
                background: url('./images/add.png')no-repeat 0 0;
                margin-right: 60px;
                &:hover{
                    background: url('./images/add1.png')no-repeat 0 0;
                }
            }
            .icon-detial{
                background: url('./images/detial.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/detial1.png')no-repeat 0 0;
                } 
            }
            .icon-QRcode{
                background: url('./images/qrcode.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/qrcode1.png')no-repeat 0 0;
                } 
            }
            .icon-location{
                background: url('./images/location.png')no-repeat 0 0;
                width: 12px;
                &:hover{
                    background: url('./images/location1.png')no-repeat 0 0;
                } 
            }
            .icon-delete{
                background: url('./images/delete.png')no-repeat 0 0;
                margin-right: 0;
                &:hover{
                    background: url('./images/delete1.png')no-repeat 0 0;
                } 
            }
            .detial-text-name{
                color: #999999;
                width: 65px;
                display: inline-block;
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
            margin-left:20px;
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
                    background: url('./images/download.png')no-repeat 0 0;
                    margin-left: 14px;
                    &:hover{
                        background: url('./images/download1.png')no-repeat 0 0;
                    }
                }
                .icon-search{
                    background: url('./images/search.png')no-repeat 0 0;
                    margin-left: 10px;
                    &:hover{
                        background: url('./images/search1.png')no-repeat 0 0;
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
            margin:10px 15px 0 30px;
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
    width:15px;
     height: 15px;
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
    /*********************/
}
</style>
<script>
import ClipboardJS from'clipboard'
import axios from 'axios'
import './js/jquery-1.8.3.js'
import './js/jquery-ui-1.9.2.custom.js'
import './js/date.js'
import data from '../Settings/js/date.js'
import upload from '../uploadFile.vue'

export default {
  name:'Costover',
  components:{
      upload
  },
  data(){
      return {
        activeIndex:'1',
         tabShow:1,
         listStyle:'table',//列表展示方式
         fileSearchInfo:'',//查询文件名称
         checkAll: false,
         isIndeterminate: false,
         fileList:[],//文件列表
         folderList:[],//文件夹列表
         screenLeft:{
             show:true,
             item:1,
         },
         token:'',
         projId:'',
         userId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         checkedItem:{},//选中的file
         GouJianItem:{},//选中file的构件
         versionItem:{},//选中file的版本信息
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
        docType:'',//个人上传是 1
         posType:'',//versionType
         FileTree_original:[],//原始文件树形图
        FileTree:[],//文件夹树形图
        defaultProps: {
          children: 'children',
          label: 'nodeName'
        },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        showQuanJing:true,//控制全景和非全景的显隐
        checkFileDir:{},//选中的文件夹信息
        QJ:{
            imageBackground:{},
            point:[]
        },
        checkedRound:{
            ID:'',//选中的roundID
            checked:false,
            filepath:'',//文件路径
            fgName:'',
            version:'',
            uploadUser:'',
            uploadTime:'',
            updateUser:'',
            updateTime:'',
            fileId:''
        },
        sharePath:{
            show:false,
            path:'',
            password:''
        },
        PointFigure:{
            renameshow:false,
            oldname:'',//这是点位图的旧名称
            newname:'',//点位图新名称
            fgID:''
        },
        hasImg:false,//没有全景图
        uploadImg:{
            checked:false
        },
        uploadtitle:'',
        isqj:0,
        QJfgid:0,//要上传或更新的fgid
        checkedFile_Folder:{
            file:false,
            folder:false,
            fileCheckedNum:0,//选中的文件数量，多个文件不可同时更新，更名
            folderCheckedNum:0//选中 的文件夹数量
        },
        hasFileToPaste:{
            is:false,
            obj:{}
        },//session存在可以粘贴的文件
        expandedKeys:[],
        mayiList:[],//蚂蚁线列表
        fileName:{
            show:false,
            newFileName:'',
            currentFileName:'',
            title:'',
            new:true
        },
        auth:{
            show:false,
            isSubUse:false
        },
        firstTime:0,
        acceptType:'',//可接受的文件类型
        fileAuthList:[],//文件群组权限列表
        fullscreenLoading: false,
      }
  },
  created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.checkFilePaste()
        vm.getIntoCloudD()
    },
    mounted(){
        var vm = this 
        setTimeout(function(){
            vm.pointLocationBindClick()
        },1000)
    },
  watch:{
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
      posType:function(){
          var vm = this
          vm.getVersion()
      },
      docType:function(){
           var vm = this
           vm.getInfo()
      },
      checkFileDir:function(val){
          var vm = this
          vm.mayiList = []
          /**
           * 从头添加目录
           * **/
          vm.mayiList.unshift({
              nodeId:val.nodeId,//目录id
              nodeName:val.nodeName,//目录名称
              nodeParId:val.nodeParId
          })
        vm.findParent(val.nodeParId)
      }
  },
  methods:{
       initAll(){
          var vm = this
          if(!vm.checkAll){
                vm.checkAll = true
                if(vm.fileList.length>0){
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',true)
                    }) 
                }
                if(vm.folderList.length>0){
                    vm.folderList.forEach((item,key)=>{
                        vm.$set(item,'checked',true)
                    })
                }
                vm.show.basicAttributes =true
                vm.show.BindingArtifacts =true
                vm.checkedFile_Folder.fileCheckedNum = vm.fileList.length
                vm.checkedFile_Folder.folderCheckedNum = vm.folderList.length
          }else{
               vm.checkAll = true
                if(vm.fileList.length>0){
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)
                    }) 
                }
                if(vm.folderList.length>0){
                    vm.folderList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)
                    })
                }
                vm.show.basicAttributes =false
                vm.show.BindingArtifacts =false
                vm.checkedFile_Folder.fileCheckedNum = 0
                vm.checkedFile_Folder.folderCheckedNum = 0
          }
      },
       InitselectUgId(val){
            var vm = this 
            for(var i =0;i<vm.ugList.length;i++){
                if(vm.ugList[i].ugId == vm.selectUgId){ //ugName
                     vm.expandedKeys = []
                     vm.getFileTree(vm.ugList[i].ugName)
                     break
                }
            }
      },
      initTreeFolder(){
        var vm = this
        vm.firstTime = 0
        vm.getFileTree()
      },
      addFile(){
        var vm = this
        vm.fileName.show = true
        vm.fileName.new = true
        vm.fileName.title = '新建目录'
      },
      addfileCancle(){
          var vm = this
           vm.fileName.newFileName = ''
        vm.fileName.show = false
      },
      addfileConfirm(){
        var vm = this
        if(vm.fileName.new){
            console.log(vm.checkFileDir)
             axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/directory/add',
                headers:{
                    'token':vm.token
                },
                data:{
                    dirName: vm.fileName.newFileName,
                    dirParId: vm.firstTime > 0?vm.checkFileDir.nodeId:null,//当前文件夹ID
                    ugId:vm.selectUgId,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
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
                url:vm.BDMSUrl+'project2/doc/directory/'+vm.checkFileDir.nodeId+'/rename',
                headers:{
                    'token':vm.token
                },
                data:{
                    dirName: vm.fileName.newFileName,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
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
      renameFile(){
         var vm = this
        if(vm.checkFileDir.isAutoCreated == 1){
            vm.$message({
            type: 'error',
            message: '系统文件，不能操作！'
          });  
          return false
        }
        vm.fileName.show = true
         vm.fileName.new = false
        vm.fileName.title = '重命名目录'
      },
      deleteFile(){
        var vm = this
         if(vm.checkFileDir.isAutoCreated == 1){
            vm.$message({
            type: 'error',
            message: '系统文件，不能操作！'
          });  
          return false
        }
         vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/doc/directory/'+vm.checkFileDir.nodeId+'/'+vm.projId+'/delete',
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    vm.$message({
                        type:'success',
                        message:'文件夹删除成功'
                    })
                    vm.getFileTree()
                    vm.firstTime = 0
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
      authrityFile(){
        var vm = this
        if(vm.checkFileDir.isAutoCreated == 1){
            vm.$message({
            type: 'error',
            message: '系统文件，不能操作！'
          });  
          return false
        }
        vm.auth.show = true
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/getAllUserGroup',
            headers:{
                'token':vm.token
            },
            params:{
                projId: vm.projId,
                dirId:vm.checkFileDir.nodeId, 
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                    vm.fileAuthList = response.data.rt
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      authCancle(){
          var vm = this
        vm.auth.show = false
      },
      authConfirm(){
          var vm = this
          var selectUgId = ''
          vm.fileAuthList.forEach((item)=>{
              if(item.isCheck){
                  if(selectUgId == ''){
                    selectUgId = item.ugId
                  }else{
                    selectUgId += ','+item.ugId
                  }
              }
          })
          if(selectUgId == ''){
              vm.$message({
                  type:'warning',
                  message:'请先选择一个群组节点'
              })
              return false
          }
          axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/doc/setFileDirectoryUg',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId: vm.projId,
                    ugIds:selectUgId,//群组列表
                    dirId:vm.checkFileDir.nodeId, 
                    isSubUse:vm.auth.isSubUse?1:0,//将权限应用到所有子目录
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                      vm.auth.show = false
                      vm.auth.isSubUse = false
                      vm.getFileTree()
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      findParent(val){
          var vm = this
          if(val == 0)return false
          for(var i=0;i<vm.FileTree_original.length;i++){
              if(vm.FileTree_original[i].nodeId == val){
                   vm.mayiList.unshift({
                        nodeId:vm.FileTree_original[i].nodeId,//目录id
                        nodeName:vm.FileTree_original[i].nodeName,//目录名称
                        nodeParId:vm.FileTree_original[i].nodeParId
                    })
                    if(vm.FileTree_original[i].nodeParId != 0){
                          vm.findParent(vm.FileTree_original[i].nodeParId)
                    }
                    break
              }
          }
      },
      uploadfile(){
        var vm = this
        if(!vm.showQuanJing){
            vm.updateImg('文件上传',false,0,'')//非点位类型是0
        }
      },
      paste(){
        var vm = this
        vm.fullscreenLoading = true
        if(vm.hasFileToPaste.obj.shear){//剪切
             axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/'+vm.hasFileToPaste.obj.dirId+'/pasteFileGroup/'+vm.checkFileDir.nodeId+'/'+vm.hasFileToPaste.obj.projId,
                headers:{
                    'token':vm.token
                },
                params:{
                    selectFiles: vm.hasFileToPaste.obj.fgIds,
                    ugId:vm.selectUgId,
                    oldUgId:vm.hasFileToPaste.obj.oldUgId, //ugid是群组ID
                    selectFolders: vm.hasFileToPaste.obj.fcIds,
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    sessionStorage.removeItem('fileObject')
                    if(vm.showQuanJing){
                        vm.searchFileGroupInfo()
                    }else{
                        vm.getInfo()
                    }
                    vm.getFileTree()
                    vm.checkFilePaste()
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
        }else{//复制
            var oldDirId = vm.hasFileToPaste.obj.dirId
            if(vm.hasFileToPaste.obj.from != ''){
                oldDirId = ''
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/pasteTransferStation',
                headers:{
                    'token':vm.token
                },
                params:{
                    fgIds: vm.hasFileToPaste.obj.fgIds,
                    dirId: vm.checkFileDir.nodeId,//当前文件夹ID
                    ugId:vm.selectUgId,
                    oldUgId:vm.hasFileToPaste.obj.oldUgId, //ugid是群组ID
                    projId: vm.hasFileToPaste.obj.projId,
                    fcIds: vm.hasFileToPaste.obj.fcIds,
                    oldDirId: oldDirId,
                    newDirId:vm.checkFileDir.nodeId,
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    sessionStorage.removeItem('fileObject')
                    if(vm.showQuanJing){
                        vm.searchFileGroupInfo()
                    }else{
                        vm.getInfo()
                    }
                    vm.getFileTree()
                    vm.checkFilePaste()
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
        }
      },
      checkFilePaste(){
            var vm = this
            var filePaste = JSON.parse(sessionStorage.getItem('fileObject'))
            if(filePaste){
                vm.hasFileToPaste.is = true
                vm.hasFileToPaste.obj = filePaste
            }else{
                vm.hasFileToPaste.is = false
                vm.hasFileToPaste.obj = {}
            }
      },
      copyfile(val){
        // 复制内容到剪贴板
        var vm = this
        var fgIdList = ''
        var fcIdList = ''
        var msg = ''
        if(val){
            msg = '剪切'
        }else{
             msg = '复制'    
        }
        if (vm.showQuanJing) {//如果是全景图文件
            fgIdList = vm.checkedRound.ID
        } else {
            for(var i=0;i<vm.fileList.length;i++){
                if(vm.fileList[i].checked){
                    if(vm.fileList[i].isAutoCreated == 1 && val){
                        vm.$message({
                            type: 'error',
                            message: '"'+vm.fileList[i].fgName+'"'+'为系统文件，不能操作！'
                        });  
                        return false
                    }
                    if(fgIdList == ''){
                         fgIdList = vm.fileList[i].fgId
                    }else{
                        fgIdList += ','+vm.fileList[i].fgId
                    }
                }
            }
            for(var j=0;j<vm.folderList.length;j++){
                if(vm.folderList[j].checked){
                     if(vm.folderList[j].isAutoCreated == 1 && val){
                        vm.$message({
                            type: 'error',
                            message:  '"'+vm.folderList[j].nodeName+'"'+'  为系统文件，不能操作！'
                        });  
                        return false
                    }
                    // 文件夹
                    if(fcIdList == ''){
                         fcIdList = vm.folderList[j].nodeId
                    }else{
                        fcIdList += ','+vm.folderList[j].nodeId
                    }
                }
            }
        }

        if(fgIdList != '' || fcIdList != ''){
            var fileObject = {
                fgIds: fgIdList,
                dirId: vm.checkFileDir.nodeId,//当前文件夹ID
                oldUgId:vm.selectUgId, //ugid是群组ID
                projId: vm.projId,
                fcIds: fcIdList
            };
            if(val){
                 fileObject.shear = true
            }else{
              fileObject.shear = false   
            }
            sessionStorage.setItem("fileObject", JSON.stringify(fileObject)); 
            vm.$message({
                type:'success',
                message:msg+'成功'
            })
            vm.checkFilePaste()
        }else{
            vm.$message({
                type:'error',
                message:msg+'失败'
            })
        }
      },
      /**
       * 私密分享：链接:http://10.252.26.240:8080/qjbim-project/cloud/share/2dfa27dc-3674-470a-86ed-363784268f7b  密码:b3yq
       * 公开分享：http://10.252.26.240:8080/qjbim-project/cloud/share/bba7acb1-301a-4ac0-81ac-c6c05f439076
       * **/
      copyURL(){
          var vm = this
          var clipboard = new ClipboardJS('#copyhref');

        clipboard.on('success', function(e) {
             vm.$message({
                    type:'success',
                    message:'复制成功'
                })
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
             vm.$message({
                type:'error',
                message:'复制失败'
            })
        });
      },
      shareURL(){
          var vm = this
          vm.sharePath.show = true
      },
      sharePathHide(){
          var vm = this
        vm.sharePath.show = false
        vm.sharePath.path = ''
        vm.sharePath.password = ''
      },
      shareBtn(val){
        var vm = this
        var fcIdList = []
        var fgIdList = []
        if(vm.showQuanJing){
            // vm.fileList.forEach((item)=>{
            //     if(item.checked){
            //         fgIdList.push(item.dirId)
            //     }
            // })
        }else{
            if(vm.fileList){
                 vm.fileList.forEach((item)=>{
                    if(item.checked){
                        fgIdList.push(item.fgId)
                    }
                })
            }
           if(vm.folderList){
                vm.folderList.forEach((item)=>{
                    if(item.checked){
                        fcIdList.push(item.nodeId)
                    }
                })
           }
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/getShareFilePath',
            headers:{
                'token':vm.token
            },
            data:{
                fcIdList:fcIdList,
                fgIdList:fgIdList,
                projId:vm.projId,
                type:val
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.sharePath.path = response.data.rt.url
                vm.sharePath.password = response.data.rt.password?response.data.rt.password:''
                console.log(response.data.rt.password)
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      renameCancle(){
        var vm = this
        vm.PointFigure.renameshow = false
      },
      renameIMG(){
        var vm = this
        if(vm.PointFigure.newname.trim() == ''){
            vm.$message({
                type:'error',
                message:'请输入新文件名！'
            })
            return false
        }
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
            if(Math.ceil(response.data.cd) == 0){
                var fileId = []
                if(vm.showQuanJing){
                    vm.searchFileGroupInfo()
                    vm.$message({
                        type:'success',
                        message:'点位重命名成功'
                    })
                    fileId.push(vm.checkedRound.fileId)
                     vm.latestFile(fileId,"重命名了点位"+vm.checkedRound.fgName)
                }else{
                    vm.getInfo()
                    vm.$message({
                        type:'success',
                        message:'文件重命名成功'
                    })
                      fileId.push(vm.checkedItem.fileId)
                     vm.latestFile(fileId,"重命名了文件"+vm.checkedItem.fileName)
                }
                vm.PointFigure.fgID = ''
                vm.PointFigure.renameshow = false
                vm.PointFigure.newname = ''
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      rename(){
        var vm = this
        for(var i=0;i<vm.fileList.length;i++){
            if(vm.fileList[i].checked && vm.fileList[i].isAutoCreated == 1){
                vm.$message({
                    type:'error',
                    message:'系统文件，不能操作！'
                })
                return false
            }
        }
        vm.PointFigure.renameshow = true
      },
      updatePoint(){//更新点位
        var vm = this
        if(vm.checkedRound.checked){
          vm.updateImg('文件更新',true,vm.checkedRound.ID,'image/*')//点位是1
        }else if(vm.checkedFile_Folder.file){
           for(var i=0;i<vm.fileList.length;i++){
                if(vm.fileList[i].checked){
                    if(vm.fileList[i].isAutoCreated == 1){
                        vm.$message({
                            type:'error',
                            message:'系统文件，不能操作！'
                        })
                        return false
                    }
                    vm.updateImg('文件更新',false,vm.fileList[i].fgId,'')//非点位类型是0
                   break;
               }
           }
        }
      },
      deletePoint(){//删除点位
        var vm = this
        var fgIdList = []
        var msg = ''
        if(vm.showQuanJing){
            if(vm.checkedRound.ID !=''){
                fgIdList.push(vm.checkedRound.ID)
            }
            msg = '点位'
        }else{
            for(var i=0;i<vm.fileList.length;i++){
                if(vm.fileList[i].checked){
                     if (vm.fileList[i].isAutoCreated == 1) {
                        vm.$message({
                            type:'error',
                            message:'系统文件，不能操作！'
                        })
                        return false
                    }
                    fgIdList.push(vm.fileList[i].fgId)
                }
            }
            msg = '文件'
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/delFileGroup',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
            },
            data:fgIdList
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                if(vm.showQuanJing){
                    vm.searchFileGroupInfo()
                }else{
                    vm.getInfo()
                }
                vm.$message({
                    type:'success',
                    message:msg+'删除成功'
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      updateImg(val,is,index,type){
          var vm = this
          vm.acceptType = type // 'image/*'
          vm.uploadtitle = val
          if(is){
                vm.isqj = 1
          }else{
              vm.isqj = 0
          }
        vm.QJfgid = index
        vm.uploadImg.checked = true
      },
      refreshqj(){
          var vm = this
          if(vm.showQuanJing){
                vm.searchFileGroupInfo(vm.checkFileDir.nodeId)
          }else{
                vm.getInfo()
          }
          vm.uploadImg.checked = false
      },
      hiddenupload(){
        var vm = this
        vm.uploadImg.checked = false
      },
      checkRound(index){
          var vm = this
          vm.checkedRound.checked = false
           vm.checkedRound.ID = ''
           vm.checkedRound.filepath = ''
          vm.QJ.point.forEach((item,key)=>{
              if(key == index && item.checked == false){ //只有当index相同，而且之前没带点击过
                    item.checked = true
                    vm.checkedRound.checked = true
                    vm.checkedRound.ID = item.fgId
                    vm.checkedRound.filepath = item.filePath

                     vm.checkedRound.fgName = item.fgName
                    vm.checkedRound.version = item.version
                    vm.checkedRound.uploadUser = item.uploadUser
                     vm.checkedRound.uploadTime = item.uploadTime
                    vm.checkedRound.updateUser = item.updateUser
                    vm.checkedRound.updateTime = item.updateTime
                    vm.checkedRound.fileId = item.fileId

                    vm.PointFigure.oldname = item.fgName

                    //设置右侧基本属性的显示
                    vm.show.basicAttributes =true
                    vm.show.BindingArtifacts =true
                    vm.getVersion()
                    vm.getGouJianInfo()
              }else{
                    item.checked = false
              }
          })
          console.log(vm.checkedRound)
      },
      dbcheckRound(val,x,y,id,name){
          if(!val)return false
          var vm = this
            var qjInfo = {
                image: vm.QJFileManageSystemURL+vm.QJ.imageBackground.filePath+'',
                x:x,//当前文件夹ID
                y:y, //ugid是群组ID
            };
            sessionStorage.setItem("qjInfo", JSON.stringify(qjInfo)); 
          vm.latestFile(id,"查看了文件"+name);
          window.open('./#/Drive/panoramicView/'+val)
      },
      handleNodeClick(obj){
          var vm = this
          vm.firstTime++
          if(!obj.children){
            vm.$message({
                type:'info',
                message:'这个文件夹没有子文件!'
            })
          }
          vm.fileSearchInfo = ''
          vm.checkFileDir = obj//选中的文件夹
        $('#cloudDirveFileTree .el-tree-node').removeClass('is-current_fistload')
          if(obj.holderId){
               vm.showQuanJing = true
               vm.searchFileGroupInfo(obj.nodeId)
          }else{
             vm.showQuanJing = false
             vm.getInfo()
          }
      },
      nodeClick(data,node,self){
          var vm = this
          if(vm.expandedKeys.indexOf(data.nodeId) == -1){
            vm.expandedKeys.push(data.nodeId)
          }
      },
      nodeClickClose(data,node,self){
          var vm = this
          if(vm.expandedKeys.indexOf(data.nodeId) != -1){
            vm.expandedKeys.splice(vm.expandedKeys.indexOf(data.nodeId),1)
          }
      },
      parseMStatus(mStatus){
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
      splitType(val){
          return val.split('.')[0]
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
    view(filePath,fileId,fileName){
        var vm = this
        if(!filePath){
            if(vm.checkedItem || vm.checkedRound){
                vm.versionItem.forEach((item)=>{
                    if(item.checked){
                        filePath =  item.filePath
                        fileId = item.fileId
                        fileName = item.fileName
                    }
                })
            }
        }
        if(!filePath){
            vm.$message({
            type:'info',
            message:'请勾选要预览的文件的版本'
        })
        return false
        }
        vm.latestFile(fileId,"下载了文件"+fileName);
        window.open(vm.QJFileManageSystemURL+filePath+"/preview");
    },
    /**
     * 下载文件 参数:index
     * 有参，单个文件下载
     * 无参，单个文件多版本下载
     * **/
    downLoad(index){
        var vm = this
        var filePath = ''
        var fileId = []
        var fileName = ''
        if(typeof(index) === 'number'){
            filePath = vm.fileList[index].filePath
            fileId.push(vm.fileList[index].fileId)
            fileName = vm.fileList[index].fileName
        }else{//多版本文件下载
            if(vm.checkedItem || vm.checkedRound){
                vm.versionItem.forEach((item)=>{
                    if(item.checked){
                        filePath =  item.filePath
                        fileId = item.fileId
                        fileName = item.fileName
                    }
                })
            }
        }
        if(filePath == ''){
             vm.$message({
                type:'info',
                message:'请勾选要下载的文件的版本'
            })
            return false
        }
        vm.latestFile(fileId,"下载了文件"+fileName);
        window.open(vm.QJFileManageSystemURL + filePath +'');
    },
    downLoadWithURL(url,fileId,fileName){
         var vm = this
        if(fileId)vm.latestFile(fileId,"下载了文件"+fileName)
        window.open(vm.QJFileManageSystemURL + url +'')
    },
    latestFile(fileId,log){
        var vm = this
        console.log(fileId)
        if(typeof(fileId) == 'number'){
            var arr = []
            arr.push(fileId)
            fileId = arr
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/latestFile',
            headers:{
                'token':vm.token
            },
            params:{
                log:log,
                userGroupId:vm.selectUgId,//目录id
                projId:vm.projId
            },
            data:fileId,//文件id
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    downloadFile(){
        var vm = this
        var url = '/multiDownloadUrl?'
        var hasFilePath = false
        var fileId = []
        var fileName = ''
        vm.fileList.forEach((item,key)=>{
            if(item.checked){
                hasFilePath = true
                url += 'urls='+item.filePath+'&'
                fileId.push(item.fileId)
                fileName += item.fileName+','
            }
        })
        if(hasFilePath){
             vm.downLoadWithURL(url,fileId,fileName)
        }else{
            vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
        }
    },
    downloadBatchFile(){
        var vm = this
        var url = '/multiDownloadUrl?'
        var hasFilePath = false
        var fileId = []
        var empty = false
        var url_API  = vm.BDMSUrl+'project2/doc/getFileListByDirOrFile?'
        for(var i=0;i<vm.folderList.length;i++){
            if(vm.folderList[i].checked){
                url_API += 'dirId='+vm.folderList[i].nodeId+'&'
            }
        }
        url_API = url_API +'projId='+vm.projId
        axios({
            method:'GET',
            url:url_API,
            headers:{
                'token':vm.token
            },
            // params:{
            //     fileId:'',//文件id
            //     projId:vm.projId
            // },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
               if(response.data.rt.length>0){
                   for(var i= 0;i<response.data.rt.length;i++){
                        url += 'urls='+response.data.rt[i]+'&'
                   }
               }else{
                   empty = true
                   vm.$message({
                       type:'info',
                       message:"您所选择的文件夹为空，里面一无所有"
                   })
               }
            }
        }).catch((err)=>{
            console.log(err)
        })
        var timer = setInterval(function(){
            if(url != '/multiDownloadUrl?'){//如果url变化，结束定时器
                vm.downLoadWithURL(url)
                clearInterval(timer)
            }
            if(empty){//若ajax 执行完 empty为true，结束定时器
                 clearInterval(timer)
            }
        },100)
    },
    checkItem(val,file,isMultiSelect){
        var vm = this
        vm.show.basicAttributes =true
        vm.show.BindingArtifacts =true
        vm.checkedFile_Folder.fileCheckedNum = 0
        vm.checkedFile_Folder.folderCheckedNum = 0
        vm.checkedFile_Folder.file = false
        vm.checkedFile_Folder.folder = false
        var fileCheckList = []
        vm.checkAll = false
        console.log(isMultiSelect)
        if(isMultiSelect){//多选
            if(file){
                vm.fileList[val].checked =  vm.fileList[val].checked?false:true
            }else{
                vm.folderList[val].checked =  vm.folderList[val].checked?false:true
            }
            for(var i=0;i<vm.fileList.length;i++){
                if(vm.fileList[i].checked){
                    vm.checkedFile_Folder.file = true
                    vm.checkedFile_Folder.fileCheckedNum++
                    fileCheckList.push(vm.fileList[i])
                }
            }
            for(var j=0;j<vm.folderList.length;j++){
                if(vm.folderList[j].checked){
                    vm.checkedFile_Folder.folder = true
                    vm.checkedFile_Folder.folderCheckedNum++
                }
            }
            if(file){
                vm.PointFigure.oldname = vm.fileList[val].fgName
                vm.PointFigure.fgID = vm.fileList[val].fgId
                vm.checkedItem = {}
                if(vm.checkedFile_Folder.fileCheckedNum == 1){
                    vm.checkedItem = fileCheckList[0]
                    vm.getGouJianInfo()
                    vm.getVersion()
                }
            }else{
                vm.checkedItem = {}
            }
            /*判断是否达到全选*/
            if(vm.checkedFile_Folder.fileCheckedNum == vm.fileList.length &&  vm.checkedFile_Folder.folderCheckedNum == vm.folderList.length){
                vm.checkAll = true
            }
        }else{//单选
            if(file){
                vm.checkedFile_Folder.file = true
                vm.checkedFile_Folder.fileCheckedNum = 1
                for(var i=0;i<vm.fileList.length;i++){
                    vm.fileList[i].checked = false
                }
                vm.fileList[val].checked = true

                vm.PointFigure.oldname = vm.fileList[val].fgName
                vm.PointFigure.fgID = vm.fileList[val].fgId
                vm.checkedItem = vm.fileList[val]
                vm.getGouJianInfo()
                vm.getVersion()
            }else{
                 vm.checkedFile_Folder.folder = true
                vm.checkedFile_Folder.folderCheckedNum = 1
                for(var j=0;j<vm.folderList.length;j++){
                    vm.folderList[j].checked = false
                }
                vm.folderList[val].checked = true
                vm.checkedItem = {}
            }
        }
    },
    IntoDir(val){
        var vm = this
        vm.$refs.fileTree_cloudDrive.setCurrentKey(val.nodeId)
        vm.checkFileDir = val
        if(vm.expandedKeys.indexOf(val.nodeId) == -1){
            vm.expandedKeys.push(val.nodeId)
        }else{
            vm.expandedKeys.splice(vm.expandedKeys.indexOf(val.nodeId),1)
        }
        vm.getInfo()
    },
    getVersion(){
         var vm = this
         var fgId = ''
         if(vm.showQuanJing && vm.checkedRound){
            fgId =vm.checkedRound.ID
         }
         if(!vm.showQuanJing && vm.checkedItem){
             if(!vm.checkedItem.fgId){
                 vm.versionItem = {}
                 return false
             }
             fgId = vm.checkedItem.fgId
         }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/getFileGroupVersionList',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:fgId,
                versionType:vm.posType,
                docType:vm.docType//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.versionItem = response.data.rt == null?{}:response.data.rt
                vm.versionItem.forEach((item)=>{
                    vm.$set(item,'checked',false)
                })
                console.log('文件版本')
                console.log(vm.versionItem)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    selectVersion(val){
        var vm = this
         vm.versionItem.forEach((item)=>{
            vm.$set(item,'checked',false)
        })
         vm.$set(vm.versionItem[val],'checked',true)
    },
    getGouJianInfo(){
        var vm = this
        var relaId = ''
         if(vm.showQuanJing && vm.checkedRound){
             relaId = vm.checkedRound.ID
         }
         if(!vm.showQuanJing && vm.checkedItem){
             if(!vm.checkedItem.fgId){
                 vm.GouJianItem = []
                 return false
             }
             relaId = vm.checkedItem.fgId
         }
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/'+vm.projId+'/entityRelation/list',
            headers:{
                'token':vm.token
            },
            params:{
                relaId:relaId,
                relaType:1//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.GouJianItem = response.data.rt.relaList == null?{}:response.data.rt.relaList
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getIntoCloudD(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/documentCloudDisk',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.ugList = response.data.rt.ugList
                vm.ugList.forEach((item)=>{
                    if(item.ugId == response.data.rt.selectUgId){
                        vm.$set(item,'checked',true)//设置checked属性，用于文件权限弹窗选择使用
                    }else{
                         vm.$set(item,'checked',false)//设置checked属性，用于文件权限弹窗选择使用
                    }
                })
                vm.selectUgId = response.data.rt.ugList[0].ugId
                vm.getFileTree(vm.ugList[0].ugName)
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
    getFileTree(name){
        var vm = this
        var setting = {
            data: {
                key:{
                    name: "nodeName",
                    children:'children'
                },
                simpleData: {
                    enable: true,
                    idKey: "nodeId",
                    pIdKey: "nodeParId",
                    rootPId: 0
                }
            }
        };
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/'+vm.projId+'/'+vm.selectUgId+'/directory',
            headers:{
                'token':vm.token
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.FileTree_original = response.data.rt
                console.log(vm.FileTree_original);
                vm.FileTree = data.transformTozTreeFormat(setting, response.data.rt)
                console.log(JSON.stringify(this.FileTree))
                if(name){
                    for(var k=0;k<vm.FileTree.length;k++){
                        if(vm.FileTree[k].nodeName.replace('_','') == name){
                            vm.handleNodeClick(vm.FileTree[k])
                            setTimeout(()=>{
                                var n = k+1
                                $('#cloudDirveFileTree .el-tree-node:nth-child('+n+')').addClass('is-current_fistload')
                            },0)
                            break
                        }
                    }
                }else{
                    vm.checkFileDir = vm.FileTree[0]
                    vm.searchFileGroupInfo()
                }
                
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
    searchFileGroupInfo(val){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/searchFileGroupInfo',
            headers:{
                'token':vm.token
            },
            data:{
                "dirId": vm.checkFileDir.nodeId,
                "projId": vm.projId
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                 vm.hasImg = false
                 vm.QJ.imageBackground = {}
                 vm.QJ.point = []
                 vm.showQuanJing = true
                 response.data.rt.rows.forEach((item)=>{
                     if(item.xAxial == -1 && item.yAxial == -1){
                         vm.QJ.imageBackground = item
                         vm.hasImg = true
                     }else{
                        vm.$set(item,'checked',false)
                         vm.QJ.point.push(item)
                     }
                 })
                 console.log(vm.QJ.point)
                 if(vm.hasImg){
                    setTimeout(function(){
                        vm.pointLocationBindClick()
                    },1000)
                 }
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getInfo(){
        var vm = this
        /**
         *             dirId: vm.checkFileDir.nodeId,//当前文件夹ID
            ugId: vm.selectUgId, //ugid是群组ID
         * **/
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/searchFileGroupInfo',//查询单个文件 ，下面要查询单个文件夹
            headers:{
                'token':vm.token
            },
            data:{
                condition:vm.fileSearchInfo,//文件名称
                dirId:vm.checkFileDir.nodeId,//
                pageNo:1,
                docType: vm.docType,//我的上传是 1 全部 空
                pageSize:20,
                projId:vm.projId
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.fileList = []
                if(response.data.rt.rows.length>0){
                    if(vm.fileSearchInfo != ''){
                        vm.fileList = response.data.rt.rows
                    }else{
                        // vm.fileList = vm.fileList.concat(response.data.rt.rows)
                         vm.fileList = response.data.rt.rows
                    }
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                    })
                }else{
                    vm.fileList = ''
                }
                vm.getInfoFolder()
            }
        })
    },
    getInfoFolder(){
            /**
             * 
             * 获取单个文件夹
             * **/
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/searchFolderInfo',//查询单个文件 ，下面要查询单个文件夹
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    ugId: vm.selectUgId,
                    parDirId:vm.checkFileDir.nodeId,
                    condition:vm.fileSearchInfo,//文件名称
                }
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    vm.folderList = []
                    if(response.data.rt.length>0){
                        vm.folderList = response.data.rt
                        vm.folderList.forEach((item,key)=>{
                            vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                        })
                    }else{
                        vm.folderList = []
                    }
                }else{
                    vm.folderList = []
                }
        }).catch((err)=>{
            console.log(err)
        })
    },
    //打包
    pointLocationBindClick(){
        var vm = this
        var $rounds = $('#planeDIV').find('.round');
        if ($rounds && $('#planeFigure')[0]) {
            var imgHeight = $('#planeFigure')[0].offsetHeight
            var imgWidth = $('#planeFigure')[0].offsetWidth
            $rounds.draggable({
                drag: function(e,ui) {// 在拖动过程中触发，当不能再拖动时返回false
                    if(ui.position.top<=-10){
                        vm.$message({
                            type:'warning',
                            message:'已到最顶部'
                        })
                        return false
                    }
                    if(ui.position.left<= -10){
                         vm.$message({
                            type:'warning',
                            message:'已到最左边'
                        })
                        return false
                    }
                     if(ui.position.left >= imgWidth){
                         vm.$message({
                            type:'warning',
                            message:'已到最右边'
                        })
                        ui.position.left = imgWidth
                        // return false
                    }
                     if(ui.position.top >= imgHeight){
                         vm.$message({
                            type:'warning',
                            message:'已到最底边'
                        })
                        ui.position.top = imgHeight
                    }
                },
                stop: function (e,ui) {
                    //更新点位定位信息
                    var _this = $(this)[0]
                    if(_this.dataset.left !=ui.position.left || _this.dataset.top != ui.position.top ){
                        axios({
                            method:'GET',
                            url:vm.BDMSUrl+'project2/doc/updatePointLocation',
                            headers:{
                                'token':vm.token
                            },
                            params:{
                                "fgId": _this.dataset.fgid,
                                "xAxial": ui.position.left,
                                "yAxial": ui.position.top,
                            }
                        }).then((response)=>{
                            if(Math.ceil(response.data.cd) == 0){
                                _this.dataset.left =  ui.position.left
                                _this.dataset.top = ui.position.top
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }
            });
        }
    }
  }
}
</script>



