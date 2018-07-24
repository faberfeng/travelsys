<template>
    <div id="taskIndex">
        <div id="GroupSelect">
            <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in  ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>

        <div :class="[{'box-left-active':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item">  
                    个人日历  
                    </router-link>
                    <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item">  
                    资源计划  
                    </router-link>
                    <router-link :to="'/SchedulePlan/taskIndex'" class="label-item label-item-active">  
                    工程任务  
                    </router-link>
                    <router-link :to="'/SchedulePlan/calendarConfig'" class="label-item">  
                    更多配置  
                    </router-link>
                    <div class="item-search">
                        <span class="title-right">
                                <input type="text"  placeholder="请输入文件名称" v-model="searchTaskName"  class="title-right-icon" @keyup.enter="getTaskList">
                                <span  class="title-right-edit-icon el-icon-search" @click="getTaskList"></span>
                        </span>
                        <span class="icon-type"></span>
                    </div>
                </div>
                <div class="taskWarp">
                    <div class="taskHead">
                        <div class="taskHeadLeft" @click="addTask">
                            <i class="el-icon-plus" style="width:20px;"></i>新增任务
                        </div>
                        <div class="taskHeadRight">
                            <span class="btn-operate" @click="progressSearch()">进度查询</span>
                            <span class="btn-operate" @click="valueSearch()">产值查询</span>
                            <span class="btn-operate" @click="userGroupTask()">群组权限</span>
                            <span class="btn-operate" @click="exportProject()">导入MPP文件</span>
                            <span class="btn-operate" @click="showColumnConfig()">显示列</span>
                        </div>
                    </div>
                    <div class="taskBody">
                        <zk-table 
                            index-text="序号"
                            :data="taskIndexData" :columns="columns"  :tree-type="props.treeType"
                            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                            :border="props.border" empty-text="正在加载..." @row-click="rowClick" @tree-icon-click="treeIconClick" >
                            <template slot="action" slot-scope="scope">
                                <!-- {{scope.row.taskName}} -->
                                <button class="editBtn actionBtn" title="编辑" @click="edit(scope)"></button>
                                <button class="deleteBtn actionBtn" title="删除" @click="deleteTab(scope)"></button>
                                <button class="sortBtn actionBtn" title="排序" @click="sort(scope)"></button>
                            </template>
                            <template slot="taskStart" slot-scope="scope">
                                {{scope.row.taskStart | timeChange()}}
                            </template>
                            <template slot="taskEnd" slot-scope="scope">
                                {{scope.row.taskEnd | timeChange()}}
                            </template>
                            <template slot="realTaskStart" slot-scope="scope">
                                {{scope.row.realTaskStart | timeChange()}}
                            </template>
                            <template slot="realTaskEnd" slot-scope="scope">
                                {{scope.row.realTaskEnd |timeChange()}}
                            </template>
                            <template slot="taskDuration" slot-scope="scope">
                                {{scope.row.taskDuration+'天'}}
                            </template>
                        </zk-table>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-active':screenLeft.show},'box-right-container']">
            <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">任<br>务</span>
                        <span class="item-version " @click="screenLeft.item = 2">核<br>实</span>
                        <span class="item-version-3 " @click="screenLeft.item = 3;">资<br>源</span>
                    </div>
            </div>
            <div id="box-right" v-if="screenLeft.item == 1" >
                <h3 class="header-attribute" style="margin-top: 0px;">
                    <i class="trrangle"></i>
                    基本信息
                    <i :class="[{'active':show.taskInformation},'icon-dropDown']" @click="show.taskInformation = show.taskInformation?false:true;"></i>
                </h3>
                <ul id="taskInformation" :class="[{'show':show.taskInformation}]" v-if="this.taskId">
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">序号</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskIndex"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">编号</span>
                        <span class="detial-text-value" v-text="taskInformationList.completeTaskCode"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">组别</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskGroupName"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">名称</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskName"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">优先级</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskPriority"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">里程碑</span>
                        <span class="detial-text-value">{{taskInformationList.taskType==1?'是':'否'}}</span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">计划开始</span>
                        <span class="detial-text-value">{{taskInformationList.taskStart|timeChange()}}</span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">计划结束</span>
                        <span class="detial-text-value">{{taskInformationList.taskEnd|timeChange()}}</span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">工作日数</span>
                        <span class="detial-text-value">{{taskInformationList.taskDuration+'天'}}</span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">计划状态</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskStatusStr"></span>
                    </li>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">负责群组</span>
                        <span class="detial-text-value" v-text="taskInformationList.taskUserGroupName"></span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">负责人</span>
                        <span class="detial-text-value">{{taskInformationList.dutyUserName}}</span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">计划人</span>
                        <span class="detial-text-value" v-text="taskInformationList.createUserName"></span>
                    </li>

                </ul>
                <h3 class="header-attribute" style="margin-top: 10px;">
                    <i class="trrangle"></i>
                    前置任务
                    <i class="el-icon-plus actionIcon" @click="addLink"></i>
                </h3>
                <ul id="preTask" v-for="(item,index) in linkList" :key="index">
                    <li class="detial-item clearfix">
                        <span class="detail-text" v-text="item.linkTaskName"></span>
                        <span class="detail-text">{{item.linkType|linkType()}}</span>
                        <button class="deleteBtn actionBtn1" @click="deleteLinkType(item.linkTaskId)"></button>
                    </li>
                </ul>
            </div>
            <div id="box-right" v-show="taskId"  v-if="screenLeft.item == 2" >
                <div class="verify">
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        核实记录
                        <i :class="['el-icon-plus','actionIcon']" @click="addVerifyRecord()" ></i>
                    </h3>
                    <ul class="verifyList" v-for="(item,index) in verifyList" :key="index">
                        <li class="detial-item clearfix">
                            <label class="detial-text-value1" >{{item.tvRate+'%'}}</label>
                            <label class="detial-text-value2">{{item.tvDate|timeChange}}</label>
                        </li>
                    </ul>
                </div>
                <div class="association">
                    <h3 class="header-attribute">
                            <i class="trrangle"></i>
                            关联清单
                            <i :class="[{'active':show.associationList},'icon-dropDown']" @click="show.associationList = show.associationList?false:true;"></i>
                    </h3>
                    <ul id="associationList" :class="[{'show':show.associationList}]">
                        <li class="goujian-item" v-for="(item,index) in relaList" :key="index">
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
                                <span class="detial-text-name" >名称 :</span>
                                <span class="detial-text-value" v-text="item.main.mName" ></span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="uploadFile">
                    <h3 class="header-attribute">
                            <i class="trrangle"></i>
                            上传文件
                            <i :class="[{'active':show.uploadFile},'icon-dropDown']" @click="show.uploadFile = show.uploadFile?false:true;"></i>
                            <i class="el-icon-plus icon-dropDown1" @click="uploadFile()"></i>
                    </h3>
                    <ul class="uploadFileUl" :class="[{'show':show.uploadFile}]">
                        <li class="uploadFileLi" v-for="(item,index) in fileList" :key="index">
                            <span class="uploadFileText">{{item.fileName}}</span>
                            <span class="icon">
                                <i class="icon-goujian icon-search" @click="searchsPic(item.filePath)"></i>
                                <i class="icon-goujian icon-download" @click="downLoadPic(item.filePath)"></i>
                                <i class="icon-goujian icon-delete" @click="deleteFile(item.fileId)"></i>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="bindPic">
                    <h3 class="header-attribute" style="margin-top:25px;">
                            <i class="trrangle"></i>
                            附加图片
                            <i :class="[{'active':show.bindPic},'icon-dropDown']" @click="show.bindPic = show.bindPic?false:true;"></i>
                            <i class="el-icon-plus icon-dropDown1" @click="bindPic()"></i>
                    </h3>
                    <ul class="bindPicUl" :class="[{'show':show.bindPic}]">
                        <li class="bindPicLi" v-for="(item,index) in attachList" :key="index">
                            <span class="bindPicText">{{item.fileName}}</span>
                            <span class="icon">
                                <i class="icon-goujian icon-search" @click="searchs(item.relativePath)"></i>
                                <i class="icon-goujian icon-download" @click="downLoad(item.relativePath)"></i>
                                <i class="icon-goujian icon-delete" @click="deleteFile(item.fileId)"></i>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="编辑工程任务" :visible.sync="addTaskDialog" @close="addTaskCancle">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="text">上级节点:</label><label class="text">{{lastNodeName}}</label>
                    </div>
                    <div class="editBodytwo1">
                        <label class="text1">名称:</label>
                        <div><input class="input1" v-model="taskName" placeholder="请输入任务名称"></div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">任务类型:</label >
                            <select v-model="taskType" class="selectGroup">
                                <option v-for="(item,index) in taskTypeList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                        </div>
                        <div class="editBodytwoRight">
                             <label class="text1">任务组别:</label>
                            <select v-model="taskGroup" class="selectGroup">
                                <option value='0'>请选择</option>
                                <option v-for="(item,index) in tgList" :key="index" :value="item.id" v-text="item.tgName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">负责群组:</label >
                            <select v-model="taskUserGroup" @change="taskUserGroupChange" class="selectGroup">
                                <option value='0'>请选择负责群组</option>
                                <option v-for="(item,index) in ugList" :key="index" :value="item.ugId" v-text="item.ugName"></option>
                            </select>
                        </div>
                        <div class="editBodytwoRight">
                             <label class="text1">负责人:</label>
                            <select v-model="dutyUserId" class="selectGroup">
                                <option value="0">请选择</option>
                                <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId" v-text="item.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">优先级:</label >
                            <select v-model="taskPriority" class="selectGroup">
                                <option v-for="(item,index) in taskPriorityList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                        </div>
                        <div class="startTime">
                            <label>计划开始:</label>
                            <el-date-picker v-model="taskStart" type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="endTime">
                            <label>计划结束:</label>
                            <el-date-picker v-model="taskEnd" type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addTaskMakeSure" >确定</button>
                    <button class="editBtnC" @click="addTaskCancle" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="编辑工程任务" :visible.sync="editTaskDialog" @close="editTaskCancle">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="text">上级节点:</label><label class="text">{{lastNodeName}}</label>
                    </div>
                    <div class="editBodytwo1">
                        <label class="text1">名称:</label>
                        <div><input class="input1" v-model="taskName" placeholder="请输入任务名称"></div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">任务类型:</label >
                            <select v-model="taskType" class="selectGroup">
                                <option v-for="(item,index) in taskTypeList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                        </div>
                        <div class="editBodytwoRight">
                             <label class="text1">任务组别:</label>
                            <select v-model="taskGroup" class="selectGroup">
                                <option value='0'>请选择</option>
                                <option v-for="(item,index) in tgList" :key="index" :value="item.id" v-text="item.tgName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">负责群组:</label >
                            <select v-model="taskUserGroup" @change="taskUserGroupChange" class="selectGroup">
                                <option value='0'>请选择负责群组</option>
                                <option v-for="(item,index) in ugList" :key="index" :value="item.ugId" v-text="item.ugName"></option>
                            </select>
                        </div>
                        <div class="editBodytwoRight">
                             <label class="text1">负责人:</label>
                            <select v-model="dutyUserId" class="selectGroup">
                                <option value="0">请选择</option>
                                <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId" v-text="item.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="editBodytwo1">
                        <div class="editBodytwoLeft" >
                            <label class="text1">优先级:</label >
                            <select v-model="taskPriority" class="selectGroup">
                                <option v-for="(item,index) in taskPriorityList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                        </div>
                        <div class="startTime">
                            <label>计划开始:</label>
                            <el-date-picker :disabled="disable" v-model="taskStart" type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="endTime">
                            <label>计划结束:</label>
                            <el-date-picker :disabled="disable" v-model="taskEnd" type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editTaskMakeSure" >确定</button>
                    <button class="editBtnC" @click="editTaskCancle" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="添加前置任务" :visible.sync="addLinkDialog" @close="addLinkCancle">
                <div class="editBody">
                    <div class="editBodytwo2">
                        <zk-table :data="taskIndexData" :columns="columns1"  :tree-type="props.treeType"
                            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                            :border="props.border" empty-text="正在加载..." @row-click="linkTypeRowClick">
                        </zk-table>
                    </div>
                    <div class="editBodytwo2">
                        <label class="labelText">前置任务名称</label>
                        <select v-model="linkTypeValue" class="linkSelect">
                            <option v-for="(item,index) in linkTypeList" :key="index" :value="item.value" v-text="item.label">
                            </option>
                        </select>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addLinkMakeSure" >确定</button>
                        <button class="editBtnC" @click="addLinkCancle" >取消</button>
                </div>
            </el-dialog>
             <el-dialog title="进度查询" :visible.sync="progressSearchDialog" @close="progressSearchCancle">
                <div class="editBody">
                    <div class="progressSearchBody">
                        <label class="searchWayText">查询方式:</label>
                        <span id="searchWay1"><el-radio v-model="radio" label="1">截止到某一天</el-radio></span>
                        <span id="searchWay2"><el-radio v-model="radio" label="2">某个时间段</el-radio></span>
                    </div>
                    <div class="progressSearchTime">
                        <div class="left" v-show="radio==2">
                            <label class="startText">开始时间:</label>
                            <el-date-picker v-model="taskProgressStart" type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="right">
                            <label class="endText">截止时间:</label>
                            <el-date-picker v-model="taskProgressEnd"  type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="progressSearchBodyType">
                            <label class="Text">类型:</label>
                            <select v-model="selectType" @change="selectChange" class="selectGroup">
                                <option v-for="(item,index) in TypeList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                    </div>
                    <div class="progressSearchBtn">
                        <button class="searchBtn" @click="taskProgressSearch()">查询</button>
                    </div>
                    <div class="progressSearchList">
                        <label class="textSearch">查询结果</label>
                        <div class="tableList">
                            <table v-show="selectType==1">
                                <thead>
                                    <tr>
                                        <td>查询结果</td>
                                        <td>任务数量</td>
                                        <td>构件数量</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>未开始</td>
                                        <td>{{taskCount1}}</td>
                                        <td>{{compCount1}}</td>
                                    </tr>
                                    <tr>
                                        <td>进行中</td>
                                        <td>{{taskCount2}}</td>
                                        <td>{{compCount2}}</td>
                                    </tr>
                                    <tr>
                                        <td>已完成</td>
                                        <td>{{taskCount3}}</td>
                                        <td>{{compCount3}}</td>
                                    </tr>                     
                                </tbody>
                            </table>
                            <table v-show="selectType==2">
                                <thead>
                                    <tr>
                                        <td>查询结果</td>
                                        <td>任务数量</td>
                                        <td>构件数量</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>未开始</td>
                                        <td>{{taskCount1}}</td>
                                        <td>{{compCount1}}</td>
                                    </tr>
                                    <tr>
                                        <td>进行中</td>
                                        <td>{{taskCount2}}</td>
                                        <td>{{compCount2}}</td>
                                    </tr>
                                    <tr>
                                        <td>已完成</td>
                                        <td>{{taskCount3}}</td>
                                        <td>{{compCount3}}</td>
                                    </tr>                     
                                </tbody>
                            </table>
                            <table v-show="selectType==3">
                                <thead>
                                    <tr>
                                        <td>查询结果</td>
                                        <td>任务数量</td>
                                        <td>构件数量</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>正常进行</td>
                                        <td>{{taskCount1}}</td>
                                        <td>{{compCount1}}</td>
                                    </tr>
                                    <tr>
                                        <td>进度拖延</td>
                                        <td>{{taskCount2}}</td>
                                        <td>{{compCount2}}</td>
                                    </tr>
                                    <tr>
                                        <td>进度提前</td>
                                        <td>{{taskCount3}}</td>
                                        <td>{{compCount3}}</td>
                                    </tr>
                                     <tr>
                                        <td>正常完成</td>
                                        <td>{{taskCount4}}</td>
                                        <td>{{compCount4}}</td>
                                    </tr>
                                     <tr>
                                        <td>拖延完成</td>
                                        <td>{{taskCount5}}</td>
                                        <td>{{compCount5}}</td>
                                    </tr>
                                     <tr>
                                        <td>提前完成</td>
                                        <td>{{taskCount6}}</td>
                                        <td>{{compCount6}}</td>
                                    </tr>                     
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addLinkMakeSure" >着色状态</button>
                        <button class="editBtnC" @click="progressSearchCancle" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="产值查询" :visible.sync="valueSearchDialog" @close="valueSearchCancle">
                <div class="editBody">
                    <div class="progressSearchBody">
                        <label class="searchWayText">查询方式:</label>
                        <span id="searchWay1"><el-radio v-model="radio" label="1">截止到某一天</el-radio></span>
                        <span id="searchWay2"><el-radio v-model="radio" label="2">某个时间段</el-radio></span>
                    </div>
                    <div class="progressSearchTime">
                        <div class="left" v-show="radio==2">
                            <label class="startText">开始时间:</label>
                            <el-date-picker v-model="valueSearchStart" type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="right">
                            <label class="endText">截止时间:</label>
                            <el-date-picker v-model="valueSearchEnd"  type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="progressSearchBodyType">
                            <label class="Text">类型:</label>
                            <select v-model="selectValueType" @change="selectValueChange" class="selectGroup">
                                <option v-for="(item,index) in valueTypeList" :key="index" :value="item.value" v-text="item.label"></option>
                            </select>
                    </div>
                    <div class="progressSearchBtn">
                        <button class="searchBtn" @click="taskValueSearch()">查询</button>
                    </div>
                    <div class="progressSearchList">
                        <label class="textSearch">查询结果</label>
                        <div class="tableList">
                            <table>
                                <thead>
                                    <tr>
                                        <td>负责群组</td>
                                        <td>任务数量</td>
                                        <td>产值数量</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in valueSearchList" :key="index">
                                        <td v-text="item.groupName"></td>
                                        <td v-text="item.taskCount"></td>
                                        <td v-text="item.value"></td>
                                    </tr>                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnC" @click="valueSearchCancle" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="上传文件" :visible="uploadFileDialog" @close="uploadFileCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class="imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectFile">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput" type="file" ref="file"  @change="fileChanged($event)" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="uploadFileMakeSure">上传</button>
                    <button class="editBtnC" @click="uploadFileCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="添加核实任务" :visible="addVerifyTaskDialog" @close="addVerifyTaskCancle">
                <div class="editBody">
                    <div class="verifySilder">
                        <label class="verifySilderText">核实比例:</label>
                        <el-slider class="slider" v-model="value1"></el-slider>
                    </div>
                    <div class="verifyTime">
                        <label class="verifySilderText">核实日期:</label>
                        <el-date-picker v-model="verifyStartTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addVerifyTaskMakeSure" >确定</button>
                        <button class="editBtnC" @click="addVerifyTaskCancle" >取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="edit1">
            <el-dialog title="群组权限" :visible.sync="userGroupTaskDialog" @close="userGroupTaskCancle">
                <div class="editBody">
                    <div class="userGroupHead">
                        <label class="userGroupText">下列勾选的群组可以访问任务：</label>
                        <div class="userGroupText1">{{this.editTaskUserGroupList.taskName}}</div>
                        <div class="userGroupTab">
                            <ul class="userGroupUl">
                                <li class="userGroupLi" v-for="(item,index) in ugList1" :key="index"  >
                                    <el-checkbox v-model="item.checkFlg" @change="checkFlgChange(index)" :value="item.ugId"></el-checkbox><label class="userGroupLiText" v-text="item.ugName"></label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="userGroupCheck">
                        <el-checkbox v-model="groupFlag"></el-checkbox>
                        <label>将权限设置应用到所有子任务</label>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="userGroupTaskMakeSure">确定</button>
                        <button class="editBtnC" @click="userGroupTaskCancle">取消</button>
                </div>
            </el-dialog>
            
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteTaskDialog" width="398px" @close="deleteTaskClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning" v-show="showText1">你要删除当前所选的任务及所有子任务？</p>
                <p class="deleteDialogWarning" v-show="showText">你要删除当前所选的任务？</p>
                <p class="deleteDialogText">确定删除吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteTaskMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteTaskClose">取消</button>
                </div>
            </el-dialog>

            <el-dialog  :visible.sync="deleteLinkTaskDialog" width="398px" @close="deleteLinkTaskClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">你要删除当前所选的前置任务？</p>
                <p class="deleteDialogText">确定删除吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteLinkTaskMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteLinkTaskClose">取消</button>
                </div>
            </el-dialog>

            <el-dialog  :visible.sync="deleteFileDialog" width="398px" @close="deleteFileClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <!-- <p class="deleteDialogWarning"></p> -->
                <p class="deleteDialogText">你要删除该任务关联文件？</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteFileMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteFileClose">取消</button>
                </div>
            </el-dialog>
        </div>
    </div> 
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import './js/jquery-1.4.4.min.js';
import data from './js/date.js';
export default {
  name:'taskIndex',
  data(){
      return {
        value1:0,//silder初始值
        radio:1, 
        token:'',
        projId:'',
        BDMSUrl:'',
        selectUgId:'',//所选择群组id
        ugList:'',//群组列表
        ugList1:[],//群组列表1
        entityRelationList:[],//获取绑定实体关系分组
        relaList:[],
        groupFlag:false,
        checkFlg:false,
        tgList:'',
        taskIndexData:[],
        TaskList:[],
        lastNodeName:'',//上级节点名称
        userGroupUserList:[],//群组成员数据
        TaskUserGroupList:[],//任务页面的负责群组
        editTaskUserGroupList:[],//任务群组权限界面
        taskInformationList:[],//获取工程任务详细信息
        verifyLists:[],//核实信息列表
        attachList:[],//绑定清单信息
        verifyList:[],//核实记录
        fileList:[],//文件关联
        linkList:[],
        selectRowList:[],//获取选择列表信息
        taskId:'',
        Type:null,
        linkId:'',//前置任务ID
        taskParId:'',
        groupIds:[],
        searchTaskName:'',//查询任务名称列表
        tableCollapse:'',//是否折叠
         screenLeft:{
             show:true,
             item:1,
         },
         show:{
             taskInformation:true,
            preTask:true,
            verifyRecords:true,
            associationList:true,
            uploadFile:true,
            bindPic:true
         },
         //新增任务数据
        addTaskDialog:false,
        addLinkDialog:false,
        editTaskDialog:false,
        progressSearchDialog:false,//进度查询
        valueSearchDialog:false,//产值查询
        userGroupTaskDialog:false,//群组权限
        //文件上传
        uploadFileDialog:false,//上传文件
        addVerifyTaskDialog:false,//增加核实任务
        verifyStartTime:'',//核实任务开始时间
        uploadfilesList:[],//文件上传列表
        imageName:'',//上传文件名字
        taskProgressStart:'',
        taskProgressEnd:'',
        valueSearchStart:'',
        valueSearchEnd:'',
        valueSearchList:'',
        selectType:0,
        ProgressList:'',
        compCount1:0,
        compCount2:0,
        compCount3:0,
        compCount4:0,
        compCount5:0,
        compCount6:0,
        taskCount1:0,
        taskCount2:0,
        taskCount3:0,
        taskCount4:0,
        taskCount5:0,
        taskCount6:0,
        TypeList:[
            {
                value:1,
                label:'计划状态'
            },
            {
                value:2,
                label:'实际状态'
            },
            {
                value:3,
                label:'比对状态'
            }
        ],
        valueTypeList:[
            {
                value:1,
                label:'计划产值'
            },
            {
                value:2,
                label:'实际产值'
            }
        ],
        selectValueType:'',
        taskName:'',//任务名称
        dutyUserId:'',//群组成员数据id
        taskPriority:'',//任务优先级
        taskUserGroup:'',//任务负责群组
        taskGroup:'',//任务组别
        taskType:'',//任务类型
        taskStart:'',//任务开始时间
        taskEnd:'',//任务结束时间
        taskParId:'',
        linkTaskId:'',//前置任务Id
        disable:false,//是否禁止日期选择
        deleteLinkTaskDialog:false,//删除前置任务弹出框
        deleteTaskDialog:false,//删除任务
        deleteFileDialog:false,//删除文件
        showText:false,//删除任务显示文字
        showText1:false,
        relaType:'',
        relaId:'',
         taskPriorityList:[
             {
                 value:0,
                 label:'请选择'
             },
             {
                 value:1,
                 label:'1'
             },
             {
                 value:2,
                 label:'2'
             },
             {
                 value:3,
                 label:'3'
             }
         ],
        taskTypeList:[
            {
                value:0,
                label:'一般任务'
            },
            {
                value:1,
                label:'里程碑任务'
            }
        ],
        editObject:{},//编辑时获取行数据
        deleteTabObject:{},//删除时获取行数据
        sortObject:{},//排序时获取行数据
        linkTypeValue:"",
        linkTypeList:[
            {
                value:"SS",
                label:"开始-开始(SS)"
            },
            {
                value:"SF",
                label:"开始-结束(SF)"
            },
            {
                value:"FS",
                label:"结束-开始(FS)"
            },
            {
                value:"FF",
                label:"结束-结束(FF)"
            }
        ],
         props: {
                stripe: false,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: false,
                treeType: true,
                isFold: false,
                expandType: false,
                selectionType: false,
                 rowStyle:[Function],
            },
        // rowStyle:[Function],
        columns1:[
                {
                    label:'名称',
                    prop:'taskName',
                    hidden:true,
                },
                {
                    label: '序号',
                    prop: 'taskId',
                    hidden:true, 
                },
                {
                    label: '编号',
                    prop: 'completeTaskCode',
                    hidden:true,
                }
        ],
        columns: [
                {
                    label:'名称',
                    prop:'taskName',
                    hidden:true,
                    type: 'template',
                    template:'action',
                    width:'300px',
                     
                },
                {
                    label: '组别',
                    prop: 'taskGroupName',
                    hidden:false,
                     
                },
                {
                    label: '序号',
                    prop: 'taskId',
                    hidden:true,
                     
                },
                {
                    label: '编号',
                    prop: 'completeTaskCode',
                    hidden:true,
                     
                },
                {
                    label:'优先级',
                    prop:'taskPriority',
                    hidden:true,
                     
                },
                {
                    label:'里程碑',
                    prop:'taskType',
                    hidden:true,
                },
                {
                    label:'计划开始',
                    prop:'taskStart',
                    hidden:true,
                    type: 'template',
                    template: 'taskStart',
                     
                },
                {
                    label:'计划结束',
                    prop:'taskEnd',
                    hidden:true,
                     type: 'template',
                    template: 'taskEnd',
                },
                {
                    label:'实际开始',
                    prop:'realTaskStart',
                    hidden:true,
                     type: 'template',
                    template: 'realTaskStart',
                },
                {
                    label:'实际结束',
                    prop:'realTaskEnd',
                    hidden:true,
                    type: 'template',
                    template: 'realTaskEnd',
                     
                },
                 {
                    label:'工作日',
                    prop:'taskDuration',
                    hidden:true,
                    type: 'template',
                    template: 'taskDuration',   
                },
                 {
                    label:'计划状态',
                    prop:'taskStatusStr',
                    hidden:true,
                     
                },
                 {
                    label:'实际状态',
                    prop:'actualStatusStr',
                    hidden:true,    
                },
                 {
                    label:'比对状态',
                    prop:'verifyStatusStr',
                    hidden:true,
                },
                {
                    label:'负责群组',
                    prop:'taskUserGroupName',
                    hidden:true,
                },
                {
                    label:'负责人',
                    prop:'dutyUserName',
                    hidden:true,
                },
                {
                    label:'计划人',
                    prop:'createUserName',
                    hidden:true,
                },
                    {
                        label:'操作',
                        prop:'operator',
                        type: 'template',
                        template: 'action',
                        width:'150px'
                }
                ],
         }
  },
  created(){
        var vm = this
        this.projId = localStorage.getItem('projId');
        this.token  = localStorage.getItem('token');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getTaskIndex();
        // this.getTaskList();
  },
  mounted(){
     
  },
  watch:{
      selectUgId:function(val){
            var vm = this 
           this.getTaskList();
      },

  },
  computed:{
       
  },
  filters:{
       timeChange(val){
           if(val==null){
               return;
           }else{
                return moment(val).format("YYYY-MM-DD");
            }
       },
       linkType(val){
           if(val=="SS"){
               return "开始-开始"
           }else if(val=="SF"){
               return "开始-结束"
           }else if(val=="FS"){
               return "结束-开始"
           }else if(val=="FF"){
               return "结束-结束"
           }
       }

  },
  methods:{
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
      
      //获取工程任务页面
      getTaskIndex(){
          axios({
              method:'get',
              url:this.BDMSUrl+'/project2/schedule/taskIndex',
              headers:{
                  'token':this.token
              },
              params:{
                  projId:this.projId
              }
          }).then(response=>{
              if(response.data.cd=='0'){
                  this.selectUgId=response.data.rt.selectUgId;
                  this.ugList=response.data.rt.ugList;
                  this.tgList=response.data.rt.tgList;
              }else if(response.data.cd=='-1'){
                  alert(response.data.msg)
              }
          })
      },

      //获取工程列表
      getTaskList(){
          console.log(this.selectUgId);
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/list',
              headers:{
                  'token':this.token
              },
              params:{
                  ugId:this.selectUgId,
                  taskName:this.searchTaskName
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  if(response.data.rt.length>0){
                      if(this.searchTaskName!=''){
                          this.taskIndexData=response.data.rt
                      }else{
                           this.taskIndexData=response.data.rt;
                      }
                  }
                  console.log(JSON.stringify(this.taskIndexData));
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      taskUserGroupChange(){
          this.ugList.forEach((item)=>{
              if(item.ugId==this.taskUserGroup){
                  this.taskUserGroup=item.ugId
              }
          })
          this.getUserGroupUsers()
      },
      //获取群组成员数据
      getUserGroupUsers(){
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/getUserGroupUsers',
              headers:{
                  'token':this.token
              },
              params:{
                  ugId:this.taskUserGroup
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.userGroupUserList=response.data.rt
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      //获取工程任务核实信息列表
      getVerifyList(){
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/verifyList',
              headers:{
                  'token':this.token
              },
              params:{
                 taskId:this.taskId
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                 this.verifyLists=response.data.rt;
                 this.attachList=this.verifyLists.attachList;
                 this.fileList=this.verifyLists.fileList;
                 this.verifyList=this.verifyLists.verifyList
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      //点击zk-tree获取id
      rowClick(row,rowIndex){
        //   console.log(row);
            this.selectRowList=rowIndex;
            this.selectRowList.forEach((item)=>{
                if(item._isHover==true){
                    this.taskId=item.taskId
                    this.taskParId=item.taskParId
                }
            })
            console.log(this.taskId);
            console.log(this.taskParId);
            this.getTask();
            this.getVerifyList();
            this.getEntityRelation();
      },
      //鼠标单击树形icon
      treeIconClick(row,rowIndex){
            console.log(JSON.stringify(rowIndex));
          this.selectRowList=rowIndex;
            this.selectRowList.forEach((item)=>{
                if(item._isHover==true){
                    this.taskId=item.taskId
                    this.taskParId=item.taskParId
                    this.tableCollapse=item._isFold==true?1:0;
                }
            })
            //  console.log(this.tableCollapse)
      },

      //获得新增/修改任务页面的负责群组
      getTaskUserGroupList(){
          if(this.taskId==''){
              this.taskId=-1;
          }
           if(this.taskParId==''){
              this.taskParId=0;
          }
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/taskUserGroupList',
              headers:{
                  'token':this.token
              },
              params:{
                  projId:this.projId,
                  taskId:this.taskId,
                  taskParId:this.taskParId
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.TaskUserGroupList=response.data.rt
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },

      //进入任务群组权限界面
      editTaskUserGroup(){
           axios({
              method:'get',
              url:this.BDMSUrl+'/project2/schedule/editTaskUserGroup',
              headers:{
                  'token':this.token
              },
              params:{
                  projId:this.projId,
                  taskId:this.taskInformationList.taskId,
                  taskName:encodeURI(encodeURI(this.taskInformationList.taskName))
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.editTaskUserGroupList=response.data.rt;
                  this.ugList1=this.editTaskUserGroupList.ugList;
                  console.log(JSON.stringify(this.ugList1));
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      checkFlgChange(index){
           var groupIdList=[];
          this.groupIds=groupIdList.push(this.ugList1[index].ugId);
      },
      userGroupTaskMakeSure(){
          this.taskId=this.editTaskUserGroupList.taskId;
          this.taskName=this.editTaskUserGroupList.taskName;
          this.taskParId=this.editTaskUserGroupList.taskParId;
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/saveTaskUserGroup',
              headers:{
                  'token':this.token
              },
              params:{
                  projId:this.projId
              },
              data:{
                  groupFlag:this.groupFlag,
                    groupIds:this.groupIds,
                    taskId:this.taskId,
                    taskName:this.taskName,
                    taskParId: this.taskParId
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.userGroupTaskDialog=false;
                  this.getTaskList();
                  this.groupFlag=false;
                  this.groupIds=[];
                  this.taskId="";
                  this.taskParId="";
                  this.taskName="";
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })

      },
      //获取绑定实体关系分组、绑定bim关系
      getEntityRelation(){
          axios({
              method:'get',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/entityRelation/list',
              headers:{
                  'token':this.token
              },
              params:{
                  relaId:this.taskId,
                 relaType:2 //获取时为2
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.entityRelationList=response.data.rt;
                  this.relaList=this.entityRelationList.relaList;
                  console.log(JSON.stringify(this.relaList));
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      //获取工程任务详细信息
      getTask(){
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/'+this.taskId,
              headers:{
                  'token':this.token
              },
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.taskInformationList=response.data.rt
                  this.linkList=this.taskInformationList.linkList
                  console.log(JSON.stringify( this.taskInformationList))
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      //点击新增任务
      addTask(){
          this.addTaskDialog=true;
          this.taskType=this.taskTypeList[0].value;
          this.taskPriority=this.taskPriorityList[0].value;
          this.taskGroup='0';
          this.taskUserGroup='0';
          this.dutyUserId='0';
         if(this.taskInformationList){
             this.taskParId=this.taskInformationList.taskId;
             this.lastNodeName=this.taskInformationList.taskName;
         }else{
             this.taskParId=0;
             this.lastNodeName='无';
         }
        //   this.getTaskUserGroupList();
      },
      addTaskMakeSure(){
           axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/add',
              headers:{
                  'token':this.token
              },
              params:{
                  currentGroupId:this.taskGroup
              },
              data:{
                    taskName:this.taskName,//任务名称
                    dutyUserId:this.dutyUserId,//群组成员数据id
                    taskPriority:this.taskPriority,//任务优先级
                    taskUserGroup:this.taskUserGroup,//任务负责群组
                    taskGroup:this.taskGroup,//任务组别
                    taskType:this.taskType,//任务类型
                    taskStart:moment(this.taskStart).format("YYYY-MM-DD"),//任务开始时间
                    taskEnd:moment(this.taskEnd).format("YYYY-MM-DD"),//任务结束时间
                    taskParId:this.taskParId,
                    id:'',
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.addTaskDialog=false;
                  this.getTaskList();
                  this.taskName='';
                  this.taskStart='';
                  this.taskEnd='';
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })

      },
      timeChange(val){
           if(val){
               return;
           }else{
                return moment(val).format("YYYY-MM-DD");
            }
       },
      addTaskCancle(){
          this.addTaskDialog=false;
      },
      //点击添加前置任务
      addLink(){
           if(!this.taskId){
              alert('请选择一个任务')
          }else{
                this.addLinkDialog=true;
                this.linkTypeValue=this.linkTypeList[0].value;
          }
      },
      linkTypeRowClick(row,rowIndex){
          this.selectRowList=rowIndex;
            this.selectRowList.forEach((item)=>{
                if(item._isHover==true){
                    this.linkTaskId=item.taskId
                    console.log(this.linkTaskId)
                }
            })
      },
      addLinkMakeSure(){
          if(this.taskId==this.linkTaskId){
              alert('前置任务不能是当前任务本身')
              return;
          }
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/addLink',
              headers:{
                  'token':this.token
              },
              data:{
                  linkTaskId:this.linkTaskId,
                  linkType:this.linkTypeValue,
                  taskId:this.taskId
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.addLinkDialog=false;
                  this.getTask();
                  this.linkTaskId='';
                  this.linkType='';
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })

      },
      deleteLinkType(val){
          this.linkList.forEach((item)=>{
              if(val==item.linkTaskId){
                  this.taskId=item.taskId;
                  this.linkId=item.linkId;
              }
          })
          this.deleteLinkTaskDialog=true; 
      },
      deleteLinkTaskClose(){
          this.deleteLinkTaskDialog=false;
      },
      deleteLinkTaskMakeSure(){
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/deleteLink',
              headers:{
                  'token':this.token
              },
              params:{
                  taskId:this.taskId,
                  linkId:this.linkId
              }
          }).then(response=>{
              if(response.data.cd=='0'){
                  this.getTask();
                  this.taskId='';
                  this.linkId='';
                  this.deleteLinkTaskDialog=false;
              }else if(response.data.cd=='-1'){
                  alert(response.data.msg)
              }
          })
      },
      addLinkCancle(){
          this.addLinkDialog=false;
      },
      edit(scope){
          this.editObject=scope;
          console.log(this.editObject);
          this.editTaskDialog=true;
          this.taskName=this.editObject.row.taskName;
          this.dutyUserId=this.editObject.row.dutyUserId;
          this.taskPriority=this.editObject.row.taskPriority;
          this.taskUserGroup=this.editObject.row.taskUserGroup;
          this.taskId=this.editObject.row.taskId;
          this.getUserGroupUsers();
          this.taskGroup=this.editObject.row.taskGroup;//任务组别
          this.taskType=this.editObject.row.taskType;
          this.taskParId=this.editObject.row.taskParId;
          this.taskStart=this.StrToGMT(this.editObject.row.taskStart);
          this.taskEnd=this.StrToGMT(this.editObject.row.taskEnd);
          if(scope.row.children){
              this.disable=false;
          }else{
              this.disable=true;
          };
          if(scope.row.taskParId=='0'){
              this.lastNodeName='无'
          }else{
               this.lastNodeName=this.editObject.row.taskName;
          }
      },
       StrToGMT(time){
                let GMT = new Date(time)
                return GMT
            },
      editTaskMakeSure(){
          axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/update',
              headers:{
                  'token':this.token
              },
              params:{
                   taskStart:moment(this.taskStart).format("YYYY-MM-DD"),//任务开始时间
                    taskEnd:moment(this.taskEnd).format("YYYY-MM-DD"),//任务结束时间
                    id:this.taskId,
                    taskName:this.taskName,//任务名称
                    taskType:this.taskType,//任务类型
                    taskUserGroup:this.taskUserGroup,//任务负责群组
                    taskParId:this.taskParId,
                    taskPriority:this.taskPriority,//任务优先级
                    dutyUserId:this.dutyUserId,//群组成员数据id
                    taskGroup:this.taskGroup,//任务组别
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.editTaskDialog=false;
                  this.getTaskList();
                    this.taskName='';
                  this.taskStart='';
                  this.taskEnd='';
                  this.id='';
                  this.taskType='';
                  this.taskUserGroup='';
                  this.taskParId='';
                  this.taskPriority='';
                  this.dutyUserId='';
                  this.taskGroup='';
              }else{
                  alert(response.data.msg)
              }
          })

      },
      editTaskCancle(){
           this.editTaskDialog=false;
           this.taskName='';
            this.taskStart='';
            this.taskEnd='';
            this.id='';
            this.taskType='';
            this.taskUserGroup='';
            this.taskParId='';
            this.taskPriority='';
            this.dutyUserId='';
            this.taskGroup='';
      },
      deleteTab(scope){
          this.deleteTaskDialog=true;
        this.deleteTabObject=scope;
        console.log(this.deleteTabObject);
        this.taskId=this.deleteTabObject.row.taskId;
        if(this.deleteTabObject.row.children){
            this.showText=true;
        }else{
            this.showText1=true;
        }
      },
      deleteTaskMakeSure(){
           axios({
              method:'post',
              url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/delete',
              headers:{
                  'token':this.token
              },
              params:{
                  taskId:this.taskId,
                  type:this.type
              }
          }).then(response=>{
              if(response.data.cd=='0'){
                    this.getTaskList();
                    this.taskId='';
                    this.Type=null;
                    this.showText=false;
                    this.showText1=false;
                    this.deleteLinkTaskDialog=false;
              }else if(response.data.cd=='-1'){
                  alert(response.data.msg)
              }
          })
      },
      deleteTaskClose(){
          this.deleteTaskDialog=false;
          this.taskId='';
          this.showText=false;
          this.showText1=false;
      },
      sort(scope){

      },
        //进度查询
        progressSearch(){
            this.progressSearchDialog=true;
            this.selectType=this.TypeList[0].value;
            this.radio=2;
        },
        selectChange(){
             this.compCount1=0;
             this.compCount2=0;
             this.compCount3=0;
             this.compCount4=0;
             this.compCount5=0;
             this.compCount6=0;
            this.taskCount1=0;
            this.taskCount2=0;
            this.taskCount3=0;
            this.taskCount4=0;
            this.taskCount5=0;
            this.taskCount6=0; 
        },
        selectValueChange(){
            // this.valueTypeList=[];

        },
        //查询功能
        taskProgressSearch(){
            console.log(this.selectUgId)
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/taskProgressSearch',
                headers:{
                    'token':this.token
                },
                params:{
                    taskStart:this.taskProgressStart,
                    taskEnd:this.taskProgressEnd,
                    ugId:this.selectUgId,
                    type:this.selectType
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.ProgressList=response.data.rt;
                    // for(var i=1;i<=6;i++){
                    //     var comp='compCount'+i;
                    //     var task='taskCount'+i;
                    //     console.log(comp);
                    //     console.log(task);
                    //     if(this.ProgressList.comp){
                    //         this.comp=0;
                    //     }else{
                    //         this.comp=this.ProgressList.comp;
                    //     }
                    //     if(this.ProgressList.task){
                    //         this.task=0;
                    //     }else{
                    //         this.task=this.ProgressList.task;
                    //     }
                    // }
                    if(this.ProgressList.compCount1){
                        this.compCount1=this.ProgressList.compCount1;
                    }else{
                        this.compCount1=0;
                    }
                    if(this.ProgressList.compCount2){
                        this.compCount2=this.ProgressList.compCount2;
                    }else{
                        this.compCount2=0;
                    }
                    if(this.ProgressList.compCount3){
                        this.compCount3=this.ProgressList.compCount3;
                    }else{
                        this.compCount3=0;
                    }
                    if(this.ProgressList.compCount4){
                        this.compCount4=this.ProgressList.compCount4;
                    }else{
                        this.compCount4=0;
                    }
                    if(this.ProgressList.compCount5){
                        this.compCount5=this.ProgressList.compCount5;
                    }else{
                        this.compCount5=0;
                    }
                    if(this.ProgressList.compCount6){
                        this.compCount6=this.ProgressList.compCount6;
                    }else{
                        this.compCount6=0;
                    }

                     if(this.ProgressList.taskCount1){
                        this.taskCount1=this.ProgressList.compCount1;
                    }else{
                        this.taskCount1=0;
                    }
                    if(this.ProgressList.taskCount2){
                        this.taskCount2=this.ProgressList.compCount2;
                    }else{
                        this.taskCount2=0;
                    }
                    if(this.ProgressList.taskCount3){
                        this.taskCount3=this.ProgressList.compCount3;
                    }else{
                        this.taskCount3=0;
                    }
                    if(this.ProgressList.taskCount4){
                        this.taskCount4=this.ProgressList.compCount4;
                    }else{
                        this.taskCount4=0;
                    }
                    if(this.ProgressList.taskCount5){
                        this.taskCount5=this.ProgressList.compCount5;
                    }else{
                        this.taskCount5=0;
                    }
                    if(this.ProgressList.taskCount6){
                        this.taskCount6=this.ProgressList.compCount6;
                    }else{
                        this.taskCount6=0;
                    }
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }
            })
        },
        progressSearchCancle(){
            this.progressSearchDialog=false;
        },
        //产值查询
        valueSearch(){
            this.valueSearchDialog=true;
            this.selectValueType=this.valueTypeList[0].value;
            this.radio=2;
        },
        
        taskValueSearch(){
             axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/taskValueSearch',
                headers:{
                    'token':this.token
                },
                params:{
                    taskStart:this.valueSearchStart,
                    taskEnd:this.valueSearchEnd,
                    type:this.selectValueType
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.valueSearchList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }
            })

            
        },
        valueSearchCancle(){
            this.valueSearchDialog=false;
            this.valueSearchList=[];
        },
        //群组权限
        userGroupTask(){
            if(this.taskInformationList.taskId){
                 this.userGroupTaskDialog=true;
                this.editTaskUserGroup()
                // this.ugList1.forEach((item)=>{

                // })
            }else{
                alert("请选择你要修改的任务")
            }
        },
        userGroupTaskCancle(){
            this.userGroupTaskDialog=false;
        },
        //导入文件
        exportProject(){

        },
        //显示列
        showColumnConfig(){

        },
        //点击添加核实任务
        addVerifyRecord(){
            this.addVerifyTaskDialog=true;
        },
        //确认添加核实任务
        addVerifyTaskMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/addVerify',
                data:{
                    

                }
            })

        },
        addVerifyTaskCancle(){
            this.addVerifyTaskDialog=false;
        },
        //上传文件
        uploadFile(){
            this.uploadFileDialog=true;
        },
        uploadFileCancle(){
            this.uploadFileDialog=false;
            this.uploadfilesList=[];
        },
         uploadFileMakeSure(){
            var returnUrl=this.BDMSUrl+'/project2/schedule/task/fileUpload';
            returnUrl = encodeURIComponent(returnUrl);
            var formData= new FormData();
            formData.append('token',this.token);
            formData.append('projId',this.projId);
            formData.append('id',this.taskId);
            formData.append('type',1);
            formData.append('file',this.uploadfilesList);
            formData.append('ugId',this.selectUgId);
            formData.append('modelCode','005');
            formData.append('returnUrl',returnUrl);
            axios({
                    method:'post',
                    url:this.QJFileManageSystemURL+'uploading/uploadFileInfo',
        
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    },
                    data:formData,
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                                this.getVerifyList();
                                this.uploadFileDialog=false;
                        }
                    })  
        },
        //点击选择文件
         selectFile(){
            this.$refs.file.click()
        },
        fileChanged(e){
           this.uploadfilesList=e.target.files[0];
           this.imageName=this.uploadfilesList.name;
        },
        //绑定图片
        bindPic(){

        },
        //查看
        searchs(filePath){
            window.open(this.QJFileManageSystemURL+filePath+"/preview");
        },
        //下载
        downLoad(filePath){
             var vm=this
            window.open(vm.QJFileManageSystemURL + filePath +'');
        },
        //查看图片
        searchsPic(filePath){
            window.open(this.QJFileManageSystemURL+filePath+"/preview");
        },
        //下载图片
        downLoadPic(filePath){
             var vm=this
            window.open(vm.QJFileManageSystemURL + filePath +'');
        },

        //点击删除文件、图片
        deleteFile(fileId){
            this.deleteFileDialog=true;
            this.fileId=fileId;
        },
        deleteFileClose(){
            this.deleteFileDialog=false;
            this.fileId='';
        },
        //删除任务关联文件(文件/图片)
        deleteFileMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/deleteAttach',
                headers:{
                    'token':this.token
                },
                params:{
                    taskId:this.taskId,
                    fileId:this.fileId
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.deleteFileDialog=false;
                    this.getVerifyList();
                    this.fileId='';
                }else if(response.data.cd=='-1'){
                    alert(resposne.data.msg)
                }
            })

        }

  },
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    .show{
        display: block !important;
    }
    #taskIndex{

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
        .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
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
        }
        .taskWarp{
            width: 96%;
            margin-top:20px;
            padding: 12px;
            margin: 0 auto;
             box-sizing: border-box;
            .taskHead{
                margin-top:20px;
                .taskHeadLeft{
                    float:left;
                    width: 105px;
                    height: 28px;
                    border:1px solid #fc3439;
                    background: #fc3439;
                    font-size: 12px;
                    line-height: 28px;
                    vertical-align: middle;
                    color:#ffffff;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .taskHeadRight{
                    float: right;
                    .btn-operate{
                        display: inline-block;
                        padding:3px 12px; 
                        line-height:22px; 
                        font-size:12px; 
                        font-weight:100;
                         background:#f2f2f2;
                         border-radius: 2px;
                         height:28px;
                         cursor: pointer;
                    }
                }

            }
            .taskBody{
                margin-top:70px;
                width: 100%;
                overflow-y: auto;
            }
        }
        // 左侧
        .box-left-container{
             display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 225px;
            // z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;

        }
        .box-left-active{
            right: 0px;
            transition:  all ease .5s;
            .icon-right{
                transform: rotateZ(180deg)!important;
                transition: all ease .5s;
            }
        }
        // 右侧
        .box-right-container{
            display: block;
            position: fixed;
            right: -225px;
            bottom: 0;
            width: 250px;
            padding-left: 25px;
            top: 116px;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            overflow-y: auto;
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
                .item-property{//任务
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
                .item-version{//核实
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
                .item-version-3{//资源
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

                .active-version{//中间 核实 高显
                    .item-version{//核实
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after{
                            background: #fff;
                        }
                    }
                    .item-property::after{//任务
                        background: #fff;
                    }
                    .item-version-3{//资源
                        z-index: 10;
                    }
                } 
                .active{//上边 任务 高显
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
                .active-version-3{//下边 资源 高显
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
             #box-right{
                    padding: 19px 13px 0 10px;
                    #taskInformation{
                        display: none;
                        >li:last-of-type{
                            padding-bottom: 7px;
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
                            .actionIcon{
                                display: block;
                                float: right;
                                width: 12px;
                                height: 12px;
                                cursor:pointer;
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
                            .icon-dropDown1{
                                display: block;
                                width: 12px;
                                height: 12px; 
                                margin-right: 5px;
                                float: right;
                                cursor: pointer;
                                transition:  all ease .2s;
                            }
                            .active{
                                transform: rotate(0deg);
                            }
                    }
                    .header-attribute:nth-last-of-type(2){
                        margin-top: 25px;
                    }
                    .header-attribute:nth-last-of-type(3){
                        margin-top: 25px;
                    }
                     .header-attribute:nth-last-of-type(1){
                        margin-top: 25px;
                    }
                    .uploadFileUl{
                        display: none;
                        >li:last-of-type{
                            padding-bottom: 7px;
                        }
                        width: 100%;
                        overflow-y: auto;
                        padding: 5px;
                        .uploadFileLi{
                            height: 32px;
                            font-size:12px;
                            line-height: 30px;
                            color:#999999;
                            text-align: left;
                            position: relative;
                             &:hover{
                                background: #fafafa;
                                .icon-goujian{
                                    display: inline-block;
                                }
                                }
                            .uploadFileText{
                                max-width: 160px;
                                float: left;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow-x: hidden;
                            }
                            .icon{
                                display: inline-block;
                                height:16px;
                                position:absolute;
                                right:0px;
                                top:10px;
                                .icon-goujian{
                                    float:left;
                                    width: 16px;
                                    height: 16px;
                                    cursor: pointer;
                                }
                                .icon-download{
                                        background: url('./images/download.png')no-repeat 0 0;
                                    
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
                                    .icon-delete{
                                        float: right;
                                        background: url('./images/delete.png')no-repeat 0 0;
                                    
                                        &:hover{
                                            background: url('./images/delete1.png')no-repeat 0 0;
                                        } 
                                    }
                                    i{
                                        margin-left:3px;
                                    }     
                            }
                        }

                    }
                    .bindPicUl{
                        display: none;
                        >li:last-of-type{
                            padding-bottom: 7px;
                        }
                        width: 100%;
                        overflow-y: auto;
                        padding: 5px;
                        .bindPicLi{
                            height: 32px;
                            font-size:12px;
                            line-height: 30px;
                            color:#999999;
                            text-align: left;
                            position: relative;
                             &:hover{
                                background: #fafafa;
                                .icon-goujian{
                                    display: inline-block;
                                }
                                }
                            .bindPicText{
                                max-width: 160px;
                                float: left;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow-x: hidden;
                            }
                            .icon{
                                display: inline-block;
                                height:16px;
                                position:absolute;
                                right:0px;
                                top:10px;
                                .icon-goujian{
                                    float:left;
                                    width: 16px;
                                    height: 16px;
                                    cursor: pointer;
                                }
                                .icon-download{
                                        background: url('./images/download.png')no-repeat 0 0;
                                    
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
                                    .icon-delete{
                                        float: right;
                                        background: url('./images/delete.png')no-repeat 0 0;
                                    
                                        &:hover{
                                            background: url('./images/delete1.png')no-repeat 0 0;
                                        } 
                                    }
                                    i{
                                        margin-left:3px;
                                    }     
                                }
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
                        // float: left;
                            color: #333333;
                            max-width: 130px;
                            overflow-x: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        &:first-of-type{
                            margin-top: 18px;
                        }
                        .detail-text{
                            font-size: 12px;
                            line-height: 16px;
                             overflow: hidden;
                            width: 70px;
                            text-overflow: ellipsis;
                             white-space: nowrap;
                            display: inline-block;
                            margin-left: 10px;
                            color:#333333;
                        }
                        // .detail-text1{
                        //     font-size: 12px;
                        //     line-height: 16px;
                        //     overflow: hidden;
                        //     width: 65px;
                        //     display: inline-block;
                        //     margin-right: 10px;
                        //     color:#333333;
                        // }
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
                        #associationList{
                            display: none;
                        }
                        .verifyList{
                            .detial-item{
                            font-size: 12px;
                            line-height: 12px;
                            margin-top: 16px;
                            text-align: left;
                            .detial-text-value1{
                            // float: left;
                            display: inline-block;
                                color: #333333;
                                width: 50px;
                                // overflow-x: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin-left:20px;
                                }
                                .detial-text-value2{
                                    display: inline-block;
                            // float: left;
                                color: #333333;
                                // overflow-x: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin-left:40px;
                                width: 85px;
                                }
                            }

                        }
                    }
        }
        .box-right-active{
            right: 0;
            transition: all ease .5s;
        }
        #edit{
            .el-dialog__body{
                .editBody{
                    width: 100%;
                    .editBodyone{
                        height:18px;
                        .text{
                            margin-left:34px;
                            display: inline-block;
                            float: left;
                            font-size: 14px;
                            line-height: 14px;
                            color: #666666
                        }
                    }
                    .imageBody{
                            text-align: left;
                            }
                    .editBodytwo{
                          .upInput{
                        display: none;
                        }
                        /* 上传文件按钮 */
                         .imageBodyText{
                                color: #666;
                                font-size: 14px;
                                line-height: 14px;
                                font-weight: normal;
                                display: inline-block;
                                margin-right: 20px;
                                margin-left: 124px;
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
                    }
                    .editBodytwo1{
                        // margin-top:20px;
                         height: 80px;
                         padding:10px;
                        .text1{
                            margin-left:25px;
                            display: block;
                            float: left;
                            font-size: 14px;
                            line-height: 30px;
                            color: #666666
                        }
                        .input1{
                            width: 92%;
                            height: 38px;
                            border: 1px solid #d1d1d1;
                            border-radius: 4px;
                            background: #fafafa;
                            padding-left: 10px;
                            margin-top:5px;
                        }
                        .editBodytwoLeft{
                            height: 40px;
                             width: 46%;
                             float: left;
                            .text1{
                            margin-left:25px;
                            display: block;
                            font-size: 14px;
                            line-height: 30px;
                            color: #666666
                            }
                            .selectGroup{
                            margin-left:25px;
                             width: 243px;
                            height: 36px;
                            position: relative;
                            color: #333333;
                            background-color: #fff;
                            background-image: none;
                            border: 1px solid #d1d1d1;
                            border-radius: 4px;
                            padding-left:10px;
                            padding-right:20px;
                            box-sizing: border-box;  
                            margin-right: 15px;
                            float: left;
                            font-size: 14px;
                            outline: none;
                            }
                        }
                         .editBodytwoRight{
                            height: 40px;
                            float: right;
                             width: 46%;
                            .text1{
                            margin-left:25px;
                            display: block;
                            font-size: 14px;
                            line-height: 30px;
                            color: #666666
                            }
                            .selectGroup{
                            margin-left:25px;
                             width: 243px;
                            height: 36px;
                            position: relative;
                            color: #333333;
                            background-color: #fff;
                            background-image: none;
                            border: 1px solid #d1d1d1;
                            border-radius: 4px;
                            padding-left:10px;
                            padding-right:20px;
                            box-sizing: border-box;  
                            margin-right: 15px;
                            float: left;
                            font-size: 14px;
                            outline: none;
                            }

                        }
                        .startTime{
                            margin-left:26px;
                            margin-top:42px;
                            height: 30px;
                            float: left;

                        }
                        .endTime{
                             margin-left:26px;
                            margin-top:30px;
                            height: 30px;
                            float: left;

                        }
                        #edit .el-input__inner{
                            width: 196px;
                        }
                    }
                    .editBodytwo2{
                        margin-top:20px;
                        padding:0px 20px 20px 20px;
                        width: 100%;
                        margin-bottom:20px;
                        .labelText{
                            float: left;
                            font-size: 14px;
                            line-height: 36px;
                        }
                        .linkSelect{
                             margin-left:25px;
                             width: 80%;
                            height: 36px;
                            position: relative;
                            color: #333333;
                            background-color: #fff;
                            background-image: none;
                            border: 1px solid #d1d1d1;
                            border-radius: 4px;
                            padding-left:10px;
                            padding-right:20px;
                            box-sizing: border-box;  
                            margin-right: 10px;
                            float: left;
                            font-size: 14px;
                            outline: none;
                        }
                    }
                    .progressSearchBody{
                        margin-top:20px;
                        .searchWayText{
                            float: left;
                            margin-left:30px;
                            font-size: 14px;
                            line-height: 21px;
                            color: #666666;
                        }
                        #searchWay1{
                            float: left;
                            display: inline-block;
                            margin-left: 15px;
                            vertical-align:middle;
                            margin-left:30px;
                            font-size: 14px;
                            line-height: 24px;
                            color: #666666;
                        }
                        #searchWay2{
                            float: left;
                            display: inline-block;
                            margin-left: 25px;
                            vertical-align:middle;
                            margin-left:30px;
                            font-size: 14px;
                            line-height: 24px;
                            color: #666666;
                        }
                    }
                    .progressSearchTime{
                        margin-top:20px;
                        height:138px;
                         .left{
                            float: left;
                            margin-top:20px;
                            margin-left:30px;
                            }
                        .right{
                            float: left;
                            margin-top:20px;
                            margin-left:30px;
                        }
                    }
                    .progressSearchBodyType{
                        margin-top:25px;
                        height: 20px;
                        float: left;
                        .Text{
                           margin-left: 30px;
                            font-size: 14px;
                        }
                        .selectGroup{
                            margin-left:25px;
                                width: 243px;
                                height: 36px;
                                position: relative;
                                color: #333333;
                                background-color: #fff;
                                background-image: none;
                                border: 1px solid #d1d1d1;
                                border-radius: 4px;
                                padding-left:10px;
                                padding-right:20px;
                                box-sizing: border-box;  
                                font-size: 14px;
                                outline: none;
                            }
                    }
                    .progressSearchBtn{
                        margin-top:80px;
                        height: 30px;
                         .searchBtn{
                            float: left;
                            margin-left: 30px;
                                background: #fc3439;
                                margin-right: 20px;
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
                    .progressSearchList{
                        margin-top:20px;
                        .textSearch{
                            display: inline-block;
                            float: left;
                            margin-left:30px;
                            margin-bottom: 15px;
                        }
                        .tableList{ 
                            margin-top:20px;
                            // border-left:1px solid #e6e6e6;
                            //  border-right:1px solid #e6e6e6;
                            table{
                                margin: 0 auto;
                                width: 92%;
                                border-collapse:collapse;
                                border-bottom: 1px solid #e6e6e6;
                                thead{
                                        background:#f2f2f2;
                                        tr{
                                            td{
                                                padding-left:10px;
                                                height: 32px;
                                                text-align: center;
                                                box-sizing: border-box;
                                                border-right: 1px solid #e6e6e6;
                                                border-left: 1px solid #e6e6e6;
                                                font-size: 12px;
                                                color: #666666;
                                            }
                                        }
                                    }
                                    tbody{
                                            
                                            background:#fff;
                                            tr{
                                                
                                                td{
                                                    padding-left:10px;
                                                    height: 32px;
                                                    text-align: left;
                                                    font-size: 12px;
                                                    box-sizing: border-box;
                                                    border-right: 1px solid #e6e6e6;
                                                    border-left: 1px solid #e6e6e6;
                                                    color: #666666;
                                                    border-bottom: 1px solid #e6e6e6;
                                                }
                                            }
                                    }

                                    }
                        }
                    }
                    .verifySilder{
                        width: 80%;
                        margin-top:20px;
                        margin:0 auto;
                        .verifySilderText{
                            display: inline-block;
                            float: left;
                            font-size:14px;
                            line-height:36px;
                        }
                        .slider{
                            margin-left:80px;
                        }
                    }
                    .verifyTime{
                            margin:0 auto;
                            margin-top:20px;
                            width: 80%;
                           .verifySilderText{
                                display: inline-block;
                                float: left;
                                font-size:14px;
                                line-height:36px;
                            }
                        }
                         
                }
            }
        }
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
        }
    }
</style>

<style lang="less">
*{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size:12px;
}
    li{
        list-style: none;
    }
//群组权限弹窗框
#edit1 .el-dialog__header {
    height: 68px;
    padding: 0;
    border-bottom: 2px solid #e6e6e6;
    text-align: left;
}
#edit1 .el-dialog__body {
    padding: 0;
    margin-top: 40px;
}
.el-dialog__footer {
    text-align: center!important;
}
#edit1 .el-dialog__footer {
    padding: 0;
    margin: 30px 0 40px 0;
}
#edit1 .el-dialog__title {
    color: #fc3439;
    font-size: 18px;
    line-height: 18px;
    font-weight: bold;
    font-family: 'MicrosoftYaHei';
    display: inline-block;
    margin: 34px 0 15px 30px;
}
#edit1 .el-dialog__headerbtn {
    top: 10px;
    right: 10px;
}
#edit1 .editBtnS {
    background: #fc3439;
    margin-right: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: normal;
}
#edit1 .editBtnC {
    color: #666;
    background: #fff;
    border: 1px solid #ccc !important;
}
#edit1 .editBtnS, #edit1 .editBtnC {
    width: 111px;
    height: 36px;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 2px;
}
#edit1 .el-dialog{
    width: 397px;
    .el-dialog__body{
        .editBody{
            width:100%;
            .userGroupHead{
                margin-top:-10px;
                .userGroupText{
                   display: inline-block;
                   margin-left:-165px;
                //    font-size:14px;
                //    line-height:14px;
                //    color: #333333;
                //     font-family: 'MicrosoftYahei';
                //     font-weight: normal;

                }
                .userGroupText1{
                    margin-left:-196px;
                //     font-size:14px;
                //    line-height:14px;
                //    color: #333333;
                //     font-family: 'MicrosoftYahei';
                //     font-weight: normal;
                }
                .userGroupTab{
                    margin:3px auto;
                    height: 247px;
                    width: 335px;
                    border:1px solid #ccc;
                    background:#fafafa;
                    .userGroupUl{
                        margin-top:20px;
                        margin-left:-220px;
                        .userGroupLi{
                            .userGroupLiText{
                                display: inline-block;
                                margin-left:10px;
                                font-size:14px;
                                line-height:14px;
                            }
                        }
                    }
                }
            }
            .userGroupCheck{
                 display: inline-block;
                margin-left:-158px;
            }   
        }
    }
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
    .zk-table__body-row .zk-table--row-hover .zk-table--tree-icon{
        background: #ccc !important;
    }
    .zk-table--tree-icon::after {
    display: block;
    position: absolute;
    top: 6px;
    left: 20px;
    width: 15px;
    height: 15px;
    background:url('./images/fload.png')no-repeat 0 0; 
    content: '';
    }
    .zk-icon-minus-square-o::after{
        background:url('./images/fload.png')no-repeat 0 0; 
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
    width: 16px;
    height: 15px;
    background:url('./images/file.jpg')no-repeat 0 0; 
    content: '';
    z-index: 1;
    }
    .actionBtn{
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
        margin-right: 16px;
    }
    .actionBtn1{
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
        float:right;
        margin-right: 15px;
    }
    .editBtn{
        background: url('../../assets/edit.png') no-repeat;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
    }
    .sortBtn{
        background:url('./images/sort.png')no-repeat 0 0; 
    }
</style>
