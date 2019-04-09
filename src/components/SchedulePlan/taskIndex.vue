<template>
  <div id="taskIndex">
    <!-- 打印标签提交表单 -->
    <form id="taskIndedxPrint-qrcode" action="http://127.0.0.1:54321/qblabel/general" method="post" enctype="multipart/form-data" target="printLabel">
            <input type="hidden" name="p" ref="taskIndedxLabelContent">
    </form>
    <iframe id="printLabel" name="printLabel" src="about:blank" style="display:none;"></iframe> 
    <div id="GroupSelect">
      <select v-model="selectUgId"  class="inp-search">
        <option :value="item.groupId" v-for="(item,index) in  ugList" :key="index" v-text="item.groupName"></option>
      </select>
      <i class="icon-sanjiao"></i>
    </div>
    <div :class="[{'box-left-active':!screenLeft.show},'box-left-container',{'goujian':showCommonList},{'gantt_left':!hiddenGanttList}]">
      <div style="min-width: 950px;overflow-y: auto;">
        <div id="item-box-file">
          <!-- <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item">
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
          </router-link> -->
          <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
          </router-link>
          <div v-if="!showCommonList" class="item-search">
                <span class="title-right">
                    <input type="text" placeholder="请输入文件名称" v-model="searchTaskName"
                            class="title-right-icon" @keyup.enter="getTaskList">
                    <span class="title-right-edit-icon el-icon-search" @click="getTaskList"></span>
                </span>
            <!-- <span class="icon-type"  @click="getGanttList"></span> -->
            <!-- 以上是甘特图按钮 -->
            <!-- @click="getGanttList" -->
          </div>
        </div>
        <div v-if="!showCommonList">
          <div v-show="hiddenGanttList" class="taskWarp">
            <div class="taskHead">
              <div class="taskHeadLeft" @click="addTask">
                <i class="el-icon-plus" style="width:20px;"></i>新增任务
              </div>
              <div class="taskHeadRight">
                <span class="btn-operate" v-show="projectWorkShow" @click="batchVerification()">批量核实</span>
                <span class="btn-operate" v-show="batchVerificationShow" @click="projectWork()">工程任务</span>
                <span class="btn-operate" v-show="batchVerificationShow">开始核实</span>
                <span class="btn-operate" v-show="projectWorkShow" @click="progressSearch()">进度查询</span>
                
                <span class="btn-operate" v-show="projectWorkShow" @click="userGroupTask()">群组权限</span>
                <span class="btn-operate" v-show="projectWorkShow" @click="exportProject()">导入MPP文件</span>
                <span class="btn-operate" v-show="projectWorkShow"  @click="cancleSelect()">取消选择</span>
                <!-- <span class="btn-operate" @click="showColumnConfig()">显示列</span> -->
              </div>
            </div>
            <div>
              <div v-show="projectWorkShow" style="overflow: auto;" class="taskBody">
                <zk-table
                  index-text="序号"
                  :data="taskIndexData" :columns="columns" :max-height="props.height" :tree-type="props.treeType"
                  :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType"
                  :border="props.border" :is-fold="props.isFold" empty-text="暂无数据..." @row-click="rowClick"
                  @row-key="rowKey" :row-style="rowStyle" :row-class-name="rowClassName" @tree-icon-click="treeIconClick" v-loading="loading">
                  <template slot="action" slot-scope="scope">
                    <button class="editBtn actionBtn" title="编辑" @click="edit(scope)"></button>
                    <button class="deleteBtnIcon actionBtn" title="删除" @click="deleteTab(scope)"></button>
                    <button class="sortBtn actionBtn" title="移动" @click="sort(scope)"></button>
                  </template>
                  <template slot="milepost" slot-scope="scope">
                      {{scope.row.taskType==1?'是':'否'}}
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
                    {{scope.row.realTaskEnd | timeChange()}}
                  </template>
                  <template slot="taskDuration" slot-scope="scope">
                    {{scope.row.taskDuration + '天'}}
                  </template>
                </zk-table>
              </div>
              <div v-show="batchVerificationShow" style="overflow: auto;" class="taskBody">
                     <zk-table
                      index-text="序号"
                      :data="taskIndexDataList" :columns="columnsBatich" :max-height="props.height" :tree-type="props.treeType"
                      :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType"
                      :border="props.border" :is-fold="props.isFold" empty-text="暂无数据..." @row-click="rowClick"
                      @row-key="rowKey" :row-style="rowStyle" :row-class-name="rowClassName" @tree-icon-click="treeIconClick" v-loading="loading">
                      <template slot="action" slot-scope="scope">
                        <button class="el-icon-circle-plus actionBtn" style="width:0px;height:18px;" title="关联清单" @click="associationList()"></button>
                        <button class="el-icon-upload actionBtn" style="width:0px;height:18px;" title="上传文件" @click="uploadFile()"></button>
                        <button class="el-icon-picture-outline actionBtn" style="width:0px;height:18px;" title="附加图片" @click="bindPic()"></button>
                        <!-- <el-slider v-model="value9" ></el-slider> -->
                      </template>
                      <template slot="milepost" slot-scope="scope">
                          {{scope.row.taskType==1?'是':'否'}}
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
                        {{scope.row.realTaskEnd | timeChange()}}
                      </template>
                      <template slot="taskDuration" slot-scope="scope">
                        {{scope.row.taskDuration + '天'}}
                      </template>
                    </zk-table>
              </div>
            </div>
          </div>
          <!-- 以下是以前的gantt图 -->
          <div v-show="!hiddenGanttList" class="taskWarp1">
            <!-- <div class="taskHead">
              <div class="taskHeadLeft" @click="addGanttTask">
                <i class="el-icon-plus" style="width:20px;"></i>新增任务
              </div>
              <div class="taskHeadRight">
                <span class="btn-operate" @click="upgrade()">升级</span>
                <span class="btn-operate" @click="degrade()">降级</span>
                <span class="btn-operate" @click="swap()">上移</span>
                <span class="btn-operate" @click="swap()">下移</span>
                <span class="btn-operate">移动</span>
                <span class="btn-operate" @click="deleteGanttTab">删除</span>
                <span class="btn-operate" @click="userGroupTask()">群组权限</span>
                <span class="btn-operate" @click="exportProject()">导入MPP文件</span>
              </div>
            </div> -->
            <div class="taskBody1">
              <div id="workSpace"
                   style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="gantEditorTemplates" style="display:none" >
      <div class="__template__" type="GANTBUTTONS"></div>
      <div class="__template__" type="TASKSEDITHEAD"></div>
      <div class="__template__" type="TASKROW"></div>
      <div class="__template__" type="TASKEMPTYROW"></div>
      <div class="__template__" type="TASKBAR"></div>
      <div class="__template__" type="CHANGE_STATUS"></div>
      <div class="__template__" type="TASK_EDITOR"></div>
      <div class="__template__" type="ASSIGNMENT_ROW"></div>
      <div class="__template__" type="RESOURCE_EDITOR"></div>
      <div class="__template__" type="RESOURCE_ROW"></div>
    </div>

    <div :class="[{'box-right-active1':!screenLeft.show},'box-right-container']" v-show="hiddenGanttList" v-if="!showCommonList">
      <div id="center-selection">
        <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
          <i class="icon-right"></i>
        </div>
        <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
          <span class="item-property " @click="screenLeft.item = 1">任<br>务</span>
          <span class="item-version " @click="screenLeft.item = 2">核<br>实</span>
          <!-- <span class="item-version-3 " @click="screenLeft.item = 3;">资<br>源</span> -->
        </div>
      </div>
      <div id="box-right" v-show="screenLeft.show" v-if="screenLeft.item == 1">
        <h3 class="header-attribute" style="margin-top: 0px;">
          <i class="trrangle"></i>
          基本信息
          <i :class="[{'active':show.taskInformation},'icon-dropDown']"
             @click="show.taskInformation = show.taskInformation?false:true;"></i>
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
            <span class="detial-text-value">{{taskInformationList.taskType == 1 ? '是' : '否'}}</span>
          </li>
          <li class="detial-item clearfix">
            <span class="detial-text-name">计划开始</span>
            <span class="detial-text-value">{{taskInformationList.taskStart | timeChange()}}</span>
          </li>
          <li class="detial-item clearfix">
            <span class="detial-text-name">计划结束</span>
            <span class="detial-text-value">{{taskInformationList.taskEnd | timeChange()}}</span>
          </li>
          <li class="detial-item clearfix">
            <span class="detial-text-name">工作日数</span>
            <span class="detial-text-value">{{taskInformationList.taskDuration + '天'}}</span>
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
            <span class="detail-text">{{item.linkType | linkType()}}</span>
            <button class="deleteBtnIcon actionBtn1" @click="deleteLinkType(item.linkTaskId)"></button>
          </li>
        </ul>
      </div>
      <div id="box-right" v-show="selectChildren==null&&screenLeft.show" v-if="screenLeft.item == 2">
        <div class="verify">
          <h3 class="header-attribute" style="margin-top: 0px;">
            <i class="trrangle"></i>
            核实记录
            <i :class="['el-icon-plus','actionIcon']" @click="addVerifyRecord()"></i>
          </h3>
          <ul class="verifyList" v-for="(item,index) in verifyList" :key="index">
            <li class="detial-item clearfix">
              <label class="detial-text-value1">{{item.tvRate + '%'}}</label>
              <label class="detial-text-value2">{{item.tvDate | timeChange}}</label>
              <i class="icon-delete" v-show="item.tvRate!=0" title="删除" @click="deleteVerfiy(item.id,item.taskId)"></i>
            </li>
          </ul>
        </div>
        <div class="association">
          <h3 class="header-attribute">
            <i class="trrangle"></i>
            关联清单
            <i :class="[{'active':show.associationList},'icon-dropDown']"
               @click="show.associationList = show.associationList?false:true;"></i>
            <i class="el-icon-plus icon-dropDown1" @click="associationList()"></i>
          </h3>
          <ul id="associationList" :class="[{'show':show.associationList}]">
            <li class="goujian-item" v-for="(item,index) in relaList" :key="index">
              <p class="clearfix">
                <i class="icon-goujian icon-add"></i>
                <i class="icon-goujian icon-detial" title="清单详细" @click="showDetialList(item)"></i>
                <i class="icon-goujian icon-QRcode" title="清单二维码" @click="qrcode(item)"></i>
                <i class="icon-goujian icon-location" title="定位" @click="location(item)"></i>
                <i class="icon-goujian icon-delete" title="删除" @click="deleteAssociationList(item.id)"></i>
              </p>
              <p class="item-detial">
                <span class="detial-text-name">ID :</span>
                <span class="detial-text-value" v-text="item.id"></span>
              </p>
              <!-- <p class="item-detial">
                <span class="detial-text-name">状态 :</span>
                <span class="detial-text-value"
                      v-text="parseMStatus(item.main.mStatus)+'('+item.main.mStatus+')'"></span>
              </p> -->
              <p class="item-detial">
                <span class="detial-text-name">明细 :</span>
                <span class="detial-text-value" v-text="item.componentNumber"></span>
              </p>
              <p class="item-detial">
                <span class="detial-text-name">名称 :</span>
                <span class="detial-text-value" :tilte="item.name" v-text="item.name"></span>
              </p>
            </li>
          </ul>
        </div>
        <div class="uploadFile">
          <h3 class="header-attribute">
            <i class="trrangle"></i>
            上传文件
            <i :class="[{'active':show.uploadFile},'icon-dropDown']"
               @click="show.uploadFile = show.uploadFile?false:true;"></i>
            <i class="el-icon-plus icon-dropDown1" @click="uploadFile()"></i>
          </h3>
          <ul class="uploadFileUl" :class="[{'show':show.uploadFile}]">
            <li class="uploadFileLi" v-for="(item,index) in fileList" :key="index">
              <span class="uploadFileText">{{item.name}}</span>
              <span class="icon">
                  <i class="icon-goujian icon-search" @click="searchsPic(item.path)"></i>
                  <i class="icon-goujian icon-download" @click="downLoadPic(item.path)"></i>
                  <i class="icon-goujian icon-delete" @click="deleteFile(item.id)"></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="bindPic">
          <h3 class="header-attribute" style="margin-top:15px;">
            <i class="trrangle"></i>
            附加图片
            <i :class="[{'active':show.bindPic},'icon-dropDown']" @click="show.bindPic = show.bindPic?false:true;"></i>
            <i class="el-icon-plus icon-dropDown1" @click="bindPic()"></i>
          </h3>
          <ul class="bindPicUl" :class="[{'show':show.bindPic}]">
            <li class="bindPicLi" v-for="(item,index) in attachList" :key="index">
              <span class="bindPicText">{{item.name}}</span>
              <span class="icon">
                  <i class="icon-goujian icon-search" @click="searchs(item.path)"></i>
                  <i class="icon-goujian icon-download" @click="downLoad(item.path)"></i>
                  <i class="icon-goujian icon-delete" @click="deleteFile(item.id)"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div id="box-right1" v-show="screenLeft.show" v-if="screenLeft.item == 3">
        <div class="addResourceType"><i class="el-icon-plus action" @click="addResourceTask">增加</i></div>
        <div class="resourceList" v-show="taskId">
          <table border="0" width='100%'>
            <thead>
            <tr>
              <th width="25%">类型</th>
              <th width="25%">单位</th>
              <th width="35%">总数量</th>
              <th width="15%">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in taskResourceTaskList" :key="index">
              <td v-text="item.resourceTypeName"></td>
              <td v-text="item.unit"></td>
              <td v-text="item.amount"></td>
              <td>
                <button class="deleteBtnIcon actionBtn1" @click="deleteTaskResource(item.id)"></button>
              </td>
            </tr>
            </tbody>
          </table>
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
            <li v-for="(item,index) in relaList1" :key="index" class="item-label clearfix">
              <img class="img_left" :src="BDMSUrl+'manifest/qr/QR-QD-' + addZero(item.id, 7)" alt="">
              <div class="right">
                <p class="item-list clearfix">
                  <span class="text-left">清单ID：</span>
                  <span class="text-right" v-text="item.id"></span>
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">清单名称：</span>
                  <span class="text-right" v-text="item.name"></span>
                </p>
                <!-- <p class="item-list clearfix">
                  <span class="text-left">生成方式：</span>
                  <span class="text-right" v-text="parseMGSource(item.main.mGSource)"></span>
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">业务来源：</span>
                  <span class="text-right" v-text="parseMBSource(item.main.mBSource)"></span>
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">创建用户：</span>
                  <span class="text-right" v-text="item.main.creator"></span>
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">创建时间：</span>
                  <span class="text-right">{{item.main.createTime | timeChange}}</span>
                </p> -->
                <!-- <p class="item-list clearfix">
                  <span class="text-left">清单版本：</span>
                  <span class="text-right" v-text="item.main.mVersion"></span>
                </p> -->
                <p class="item-list clearfix">
                  <span class="text-left">明细数量：</span>
                  <span class="text-right" v-text="item.componentNumber"></span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="el-dialog__footer">
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="labelListConfirm(labelPkId)">网页预览</button>
          <button class="editBtnC" @click="printCurrentLabel">打印当前页标签</button>
        </div>
      </div>
    </div>
    <div v-if="ListHeaderShow" id="edit" class="dialog">
      <div class="el-dialog__header">
        <span class="el-dialog__title">显示列</span>
        <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="headerListCancle">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </button>
      </div>
      <div class="el-dialog__body">
        <div class="clearfix">
                    <span class="item-attibuteAuth" v-for="(item,index) in detailsHead_model" :key="index"
                          v-if="index >=2">
                          <label :class="[item.showModel?'active':'','checkbox-fileItem']" :for="item.prop+'_header'"
                                 v-text="item.label"></label>
                          <input type="checkbox" :id="item.prop+'_header'" class="checkbox-arr"
                                 v-model="item.showModel">
                    </span>
        </div>
      </div>
      <div class="el-dialog__footer">
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS">确定</button>
          <button class="editBtnC">取消</button>
        </div>
      </div>
    </div>
    <div id="mask" v-if="labelListShow||ListHeaderShow"></div>
    <div id="edit">
      <el-dialog title="编辑工程任务"  :visible.sync="addTaskDialog" @close="addTaskCancle">
          <div class="editBody" v-loading="loading" >
            <div class="editBodyone">
              <label class="text">上级节点:</label><label class="text">{{lastNodeName}}</label>
            </div>
            <div class="editBodytwo1">
              <label class="text1">名称:</label>
              <div><input class="input1" v-model="taskName" placeholder="请输入任务名称"></div>
            </div>
            <div class="editBodytwo1">
              <div class="editBodytwoLeft">
                <label class="text1">任务类型:</label>
                <select v-model="taskType" class="selectGroup">
                  <option v-for="(item,index) in taskTypeList" :key="index" :value="item.value"
                          v-text="item.label"></option>
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
              <div class="editBodytwoLeft">
                <label class="text1">负责群组:</label>
                <select v-model="taskUserGroup" @change="taskUserGroupChange" class="selectGroup">
                  <option value='0'>请选择负责群组</option>
                  <option v-for="(item,index) in ugList" :key="index" :value="item.groupId" v-text="item.groupName"></option>
                </select>
              </div>
              <div class="editBodytwoRight">
                <label class="text1">负责人:</label>
                <select v-model="dutyUserId" class="selectGroup">
                  <option value="0">请选择</option>
                  <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId"
                          v-text="item.name"></option>
                </select>
              </div>
            </div>
            <div class="editBodytwo1">
              <div class="editBodytwoLeft">
                <label class="text1">优先级:</label>
                <select v-model="taskPriority" class="selectGroup">
                  <option v-for="(item,index) in taskPriorityList" :key="index" :value="item.value"
                          v-text="item.label"></option>
                </select>
              </div>
            </div>
            <div class="editBodytwo1">
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
            <button class="editBtnS" @click="addTaskMakeSure">确定</button>
            <button class="editBtnC" @click="addTaskCancle">取消</button>
          </div>
      </el-dialog>
      <el-dialog title="编辑工程任务" :visible.sync="editTaskDialog" @close="editTaskCancle">
        <div class="editBody" v-loading="loading">
          <div class="editBodyone">
            <label class="text">上级节点:</label><label class="text">{{lastNodeName}}</label>
          </div>
          <div class="editBodytwo1">
            <label class="text1">名称:</label>
            <div><input class="input1" v-model="taskName" placeholder="请输入任务名称"></div>
          </div>
          <div class="editBodytwo1">
            <div class="editBodytwoLeft">
              <label class="text1">任务类型:</label>
              <select v-model="taskType" class="selectGroup">
                <option v-for="(item,index) in taskTypeList" :key="index" :value="item.value"
                        v-text="item.label"></option>
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
            <div class="editBodytwoLeft">
              <label class="text1">负责群组:</label>
              <select v-model="taskUserGroup" @change="taskUserGroupChange" class="selectGroup">
                <option value='0'>请选择负责群组</option>
                <option v-for="(item,index) in ugList" :key="index" :value="item.groupId" v-text="item.groupName"></option>
              </select>
            </div>
            <div class="editBodytwoRight">
              <label class="text1">负责人:</label>
              <select v-model="dutyUserId" class="selectGroup">
                <option value="0">请选择</option>
                <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId"
                        v-text="item.name"></option>
              </select>
            </div>
          </div>
          <div class="editBodytwo1">
            <div class="editBodytwoLeft">
              <label class="text1">优先级:</label>
              <select v-model="taskPriority" class="selectGroup">
                <option v-for="(item,index) in taskPriorityList" :key="index" :value="item.value"
                        v-text="item.label"></option>
              </select>
            </div>
          </div>
          <div class="editBodytwo1">
            <div class="startTime">
              <label>计划开始:</label>
              <el-date-picker  v-model="taskStart" type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="endTime">
              <label>计划结束:</label>
              <el-date-picker   v-model="taskEnd" type="date"
                        placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="editTaskMakeSure">确定</button>
          <button class="editBtnC" @click="editTaskCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="添加前置任务" :visible.sync="addLinkDialog" @close="addLinkCancle">
        <div class="editBody" v-loading="loading">
          <div class="editBodytwo3">
            <zk-table :data="taskIndexData" :columns="columns1" :tree-type="props.treeType"
                      :expand-type="props.expandType" :is-fold="props.isFold" :show-index="props.showIndex"
                      :selection-type="props.selectionType"
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
          <button class="editBtnS" @click="addLinkMakeSure">确定</button>
          <button class="editBtnC" @click="addLinkCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="进度查询" width="560px" :visible.sync="progressSearchDialog" @close="progressSearchCancle">
        <div class="editBody">
          <div class="progressSearchBody">
            <label class="searchWayText">查询方式:</label>
            <span id="searchWay1"><el-radio v-model="radio" label="1">截止到某一天</el-radio></span>
            <span id="searchWay2"><el-radio v-model="radio" label="2">某个时间段</el-radio></span>
          </div>
          <div class="progressSearchTime">
            <div class="left" v-show="radio=='2'">
              <label class="startText">开始时间:</label>
              <el-date-picker v-model="taskProgressStart" type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="right">
              <label class="endText">截止时间:</label>
              <el-date-picker v-model="taskProgressEnd" type="date"
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
          <button class="editBtnS" @click="siteColorSearch()" >着色状态</button>
          <button class="editBtnC" @click="progressSearchCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="产值查询" width="560px" :visible.sync="valueSearchDialog" @close="valueSearchCancle">
        <div class="editBody">
          <div class="progressSearchBody">
            <label class="searchWayText">查询方式:</label>
            <span id="searchWay1"><el-radio v-model="radio" label="1">截止到某一天</el-radio></span>
            <span id="searchWay2"><el-radio v-model="radio" label="2">某个时间段</el-radio></span>
          </div>
          <div class="progressSearchTime">
            <div class="left" v-show="radio=='2'">
              <label class="startText">开始时间:</label>
              <el-date-picker v-model="valueSearchStart" type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="right">
              <label class="endText">截止时间:</label>
              <el-date-picker v-model="valueSearchEnd" type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="progressSearchBodyType">
            <label class="Text">类型:</label>
            <select v-model="selectValueType" @change="selectValueChange" class="selectGroup">
              <option v-for="(item,index) in valueTypeList" :key="index" :value="item.value"
                      v-text="item.label"></option>
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
          <button class="editBtnC" @click="valueSearchCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="上传文件" width="586px" :visible.sync="uploadFileDialog" @close="uploadFileCancle">
        <div class="editBody">
          <div class="editBodytwo imageBody">
            <label class="imageBodyText">上传文件 :</label>
            <span class="updataImageSpan">
                            <span @click="selectFile">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput" type="file" ref="file" @change="fileChanged($event)"
                                   multiple="multiple">
                        </span>
            <span class="upImgText" style="width:200px !important">{{imageName}}</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="uploadFileMakeSure">上传</button>
          <button class="editBtnC" @click="uploadFileCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="上传图片" width="580px" :visible.sync="uploadPicDialog" @close="uploadPicCancle">
        <div class="editBody">
          <div class="editBodytwo imageBody">
            <label class="imageBodyText">上传文件 :</label>
            <span class="updataImageSpan">
                            <span @click="selectFile">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput" type="file" ref="file" @change="imgChanged($event)"
                                   multiple="multiple">
                        </span>
            <span class="upImgText" style="width:200px !important">{{imageName}}</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="uploadPicMakeSure">上传</button>
          <button class="editBtnC" @click="uploadPicCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="导入project文件" width="580px" :visible.sync="exportProjectDialog" @close="exportProjectCancle">
        <div class="editBody">
          <div class="editBodytwo imageBody">
            <label class="imageBodyText">上传文件 :</label>
            <span class="updataImageSpan">
                            <span @click="selectFile">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput" type="file" ref="file" @change="exportProjectFileChanged($event)"
                                   multiple="multiple">
                        </span>
            <span class="upImgText" style="width:200px !important">{{MppName}}</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="exportProjectMakeSure">上传</button>
          <button class="editBtnC" @click="exportProjectCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="添加核实任务" :visible.sync="addVerifyTaskDialog" @close="addVerifyTaskCancle">
        <div class="editBody">
          <div class="verifySilder">
            <label class="verifySilderText">核实比例:</label>
            <el-slider class="slider" v-model="tvValue"></el-slider>
          </div>
          <div class="verifyTime">
            <label class="verifySilderText">核实日期:</label>
            <el-date-picker v-model="verifyStartTime" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="addVerifyTaskMakeSure">确定</button>
          <button class="editBtnC" @click="addVerifyTaskCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="选择关联清单"  :visible.sync="addAssociationListDialog" @close="addAssociationListCancle">
        <div class="editBody" v-loading="loading">
          <div class="bindListHead">
            <div class="bindListHeadLeft">
              <div>
                <label class="listText">清单名称关键字：</label>
              </div>
              <div>
                <input type="text" v-model="detailName" class="listInp"/>
              </div>

            </div>
            <!-- <div class="bindListHeadRight">
              <div>
                <label class="listText">创建时间：</label>
              </div>
              <div class="searchTime">
                <el-date-picker v-model="startDate" class="time1" type="date">
                </el-date-picker>
                <el-date-picker v-model="endDate" class="time" type="date">
                </el-date-picker>
              </div>
            </div> -->
          </div>
          <!-- <div class="bindListHead">
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
          </div> -->
          <div class="bindListsearchBtn">
            <button class="searchBtn" @click="loadManifestSearch">查询</button>
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
                  <!-- <th>业务来源</th>
                  <th>业务状态</th> -->
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in loadManifestList" :key="index" :class="[{'active':item.checked}]"
                    @click="checkItem(index)">
                  <td>
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </td>
                  <td v-text="parseType(item.type)"></td>
                  <td v-text="item.id"></td>
                  <td v-text="item.name"></td>
                  <td v-text="item.componentNumber"></td>
                  <!-- <td v-text="parseMBSource(item.relaType)"></td>
                  <td v-text="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"
                      :title="parseMStatus(item.serviceState) + '(' + item.serviceState + ')'"></td> -->
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
      <el-dialog title="添加资源类别" width="580px" :visible.sync="addResourceTaskDialog" @close="addResourceTaskCancle">
        <div class="editBody">
          <div class="resourceText1">
            <label>资源类别名称：</label>
            <select class="resourceSelect1" v-model="resourceTypeValue" @change="resourceTypeChange">
              <option value="0">全部</option>
              <option v-for="(item,index) in resourceTypeList" :key="index" :value="item.id"
                      v-text="item.name"></option>
            </select>
          </div>
          <div class="resourceText2">
            <label>资源类型名称：</label>
            <select class="resourceSelect2" v-model="taskResourceTaskValue" @change="taskResourceChange">
              <option v-for="(item,index) in taskResourceTypeList" :key="index" :value="item.id"
                      v-text="item.name"></option>
            </select>
          </div>
          <div class="resourceText3">
            <label class="text1">模式：</label>
            <select class="resourceSelect3" v-model="patternValue">
              <option value="0">每日</option>
              <option value="1">总数平均分配</option>
            </select>
            <label class="text2">数量：</label>
            <input type="text" v-model="amount" class="resourceInp"/>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="addResourceTaskMakeSure">确定</button>
          <button class="editBtnC" @click="addResourceTaskCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="移动任务" :visible.sync="removeTaskDialog" @close="removeTaskCancle">
        <div class="editBody">
          <div class="editBodytwo3">
            <zk-table :data="taskIndexData" :columns="columns1" :tree-type="props.treeType"
                      :expand-type="props.expandType" max-height="36px" :is-fold="props.isFold" :show-index="props.showIndex"
                      :selection-type="props.selectionType"
                      :border="props.border" empty-text="正在加载..." @row-click="removeTaskRowClick">
            </zk-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS" @click="removeTaskMakeSure">确定</button>
          <button class="editBtnC" @click="removeTaskCancle">取消</button>
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
                <li class="userGroupLi" v-for="(item,index) in ugList1" :key="index">
                  <el-checkbox v-model="item.checkFlg"  @change="checkFlgChange(index)" :value="item.ugId"></el-checkbox>
                  <label class="userGroupLiText" v-text="item.ugName"></label>
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
      <el-dialog :visible.sync="deleteTaskDialog" width="398px" @close="deleteTaskClose">
        <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
        <p class="deleteDialogWarning" v-show="showText1">你要删除当前所选的任务及所有子任务？</p>
        <p class="deleteDialogWarning" v-show="showText">你要删除当前所选的任务？</p>
        <p class="deleteDialogText">确定删除吗?</p>
        <div slot="footer" class="dialog-footer">
          <button class="deleteBtn" @click="deleteTaskMakeSure">删除</button>
          <button class="cancelBtn" @click="deleteTaskClose">取消</button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="deleteLinkTaskDialog" width="398px" @close="deleteLinkTaskClose">
        <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
        <p class="deleteDialogWarning">你要删除当前所选的前置任务？</p>
        <p class="deleteDialogText">确定删除吗?</p>
        <div slot="footer" class="dialog-footer">
          <button class="deleteBtn" @click="deleteLinkTaskMakeSure">删除</button>
          <button class="cancelBtn" @click="deleteLinkTaskClose">取消</button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="deleteFileDialog" width="398px" @close="deleteFileClose">
        <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
        <!-- <p class="deleteDialogWarning"></p> -->
        <p class="deleteDialogText">你要删除该任务关联文件？</p>
        <div slot="footer" class="dialog-footer">
          <button class="deleteBtn" @click="deleteFileMakeSure">删除</button>
          <button class="cancelBtn" @click="deleteFileClose">取消</button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="deleteTaskResourceDialog" width="398px" @close="deleteTaskResourceClose">
        <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
        <!-- <p class="deleteDialogWarning"></p> -->
        <p class="deleteDialogText">确定要删除该任务下的资源分配？</p>
        <div slot="footer" class="dialog-footer">
          <button class="deleteBtn" @click="deleteTaskResourceMakeSure">删除</button>
          <button class="cancelBtn" @click="deleteTaskResourceClose">取消</button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="deleteAssociationListDialog" width="398px" @close="deleteAssociationListClose">
        <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
        <!-- <p class="deleteDialogWarning"></p> -->
        <p class="deleteDialogText">确定要将清单与当前任务解除关联关系吗？</p>
        <div slot="footer" class="dialog-footer">
          <button class="deleteBtn" @click="deleteAssociationListMakeSure">确定</button>
          <button class="cancelBtn" @click="deleteAssociationListClose">取消</button>
        </div>
      </el-dialog>
    </div>
    <!--下面是报表清单的编码-->
    <!-- <common-list v-on:back="backToH" :mId="checkList.pkId" rType="7"  :bId='checkItem.pkId' :title="'构件量清单'"
                 v-if="showCommonList"></common-list> -->

    <!--下面是报表清单的编码-->
    <common-list v-on:back="backToH" :mId="checkList.id" :type=2  :title="'构件量清单'" v-if="showCommonList"></common-list>
  </div>
</template>

<script>
  import moment from 'moment';
  import axios from 'axios';
  //import $ from 'jquery';
  //引入gantt图
  // import './Gantt/platform.css'
  import './Gantt/gantt.css'
  import './Gantt/ganttPrint.css'
  import './Gantt/libs/jquery/dateField/jquery.dateField.css'
  import './Gantt/libs/jquery/jquery.livequery.1.1.1.min.js'
  import './Gantt/libs/jquery/jquery.timers.js'
  import './Gantt/libs/utilities.js'
  import './Gantt/libs/forms.js'
  import './Gantt/libs/date.js'
  import './Gantt/libs/dialogs.js'
 import './Gantt/libs/layout.js'
  import './Gantt/libs/i18nJs.js'
  import './Gantt/libs/jquery/dateField/jquery.dateField.js'
 import './Gantt/libs/jquery/JST/jquery.JST.js'
  import './Gantt/libs/jquery/svg/jquery.svg.min.js'
  import './Gantt/libs/jquery/svg/jquery.svgdom.1.8.js'
  import {GanttMaster} from './Gantt/ganttMaster.js'
  // import commonList from './qingdan.vue'
  import commonList from '../planCost/qingDan.vue'
  import '../ManageCost/js/jquery-1.8.3.js'
  import '../ManageCost/js/date.js'
  var app
  var CurrentSelectPara='';
  var CurrentSelectedEntList='';
  export default {
    name: 'taskIndex',
    data() {
      window.addEventListener("message", (evt)=>{this.callback(evt)});
      return {
        value9:[],
        elementTraceIds:[],
        returnLabelUrl:'',
        routerList:'',
        moduleList:'',
        loading:false,
        showCommonList: false,//显示清单
        checkList: '',
        labelListShow: false,//二维码显示
        labelPkId:'',
        ListHeaderShow: false,//列表头
        tvValue: 0,//silder初始值
        radio:'1',
        token: '',
        projId: '',
        BDMSUrl: '',
        qrShareUrl:'',
        selectUgId: '',//所选择群组id
        taskNameStr: '',
        ugList: '',//群组列表
        ugList1: [],//群组列表1
        entityRelationList: [],//获取绑定实体关系分组
        relaList: [],
        relaList1:[],
        mId: '',
        bId: '',
        bType: '',
        groupFlag: false,
        checkFlg: false,
        tgList: '',
        taskIndexData:[],
        taskIndexDataList:[],
        TaskList: [],
        lastNodeName: '',//上级节点名称
        userGroupUserList: [],//群组成员数据
        TaskUserGroupList: [],//任务页面的负责群组
        editTaskUserGroupList: [],//任务群组权限界面
        taskInformationList: [],//获取工程任务详细信息
        verifyLists: [],//核实信息列表
        attachList: [],//绑定清单信息
        verifyList: [],//核实记录
        fileList: [],//文件关联
        loadManifestList: [],//加载列表清单
        checkedItem: {},//选中的file
        taskResourceTaskList: [],//获取任务资源列表
        taskResourceTypeList: [],//任务资源列表
        resourceTypeName: '',//任务资源名称
        taskResourceTaskValue: '',//任务资源值
        patternList: [
          {
            value: 0,
            label: '每日'
          },
          {
            value: 1,
            label: '总数平均分配'
          }
        ],
        patternValue: '',
        amount: '',
        resourceTypeList: [],//获取资源类别
        resourceTypeValue: '',//资源类别值
        pageDetial_1: {
          pagePerNum: 10,//一页几份数据
          currentPage: 1,//初始查询页数 第一页
          total: '',//所有数据
        },
        linkList: [],
        selectRowList: [],//获取选择列表信息
        taskId: '',
        curUgId: '',//移动任务所选id
        Type: null,
        linkId: '',//前置任务ID
        groupIds: [],
        searchTaskName: '',//查询任务名称列表
        tableCollapse: '',//是否折叠
        screenLeft: {
          show: true,
          item: 1,
        },
        show: {
          taskInformation: true,
          preTask: true,
          verifyRecords: true,
          associationList: true,
          uploadFile: true,
          bindPic: true
        },
        //新增任务数据
        addTaskDialog: false,
        addLinkDialog: false,
        editTaskDialog: false,
        progressSearchDialog: false,//进度查询
        batchVerificationShow:false,//批量核实
        projectWorkShow:true,//工程任务
        valueSearchDialog: false,//产值查询
        userGroupTaskDialog: false,//群组权限
        //文件上传
        uploadFileDialog: false,//上传文件
        uploadPicDialog: false,//上传图片
        exportProjectDialog: false,//导入Project文件
        addVerifyTaskDialog: false,//增加核实任务
        addAssociationListDialog: false,//选择关联清单
        addResourceTaskDialog: false,//添加资源类别
        removeTaskDialog: false,//移动任务
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
          {
            value: 0,
            label: "全部"
          },
          {
            value: 1,
            label: "构件量核对完成"
          },
          {
            value: 3,
            label: "工程量核对完成"
          },
          {
            value: 5,
            label: "物料量核对完成"
          },
          {
            value: 4,
            label: "已选型"
          },
          {
            value: 6,
            label: "已订货"
          },
          {
            value: 7,
            label: "已发货"
          },
          {
            value: 8,
            label: "已签收"
          }
        ],//业务状态

        verifyStartTime: '',//核实任务开始时间
        uploadfilesList: [],//文件上传列表
        imageName: '未选择任何文件',//上传文件名字
        MppName: '未选择任何文件',//上传MPP文件名字
        taskProgressStart: '',
        taskProgressEnd: '',
        valueSearchStart: '',
        valueSearchEnd: '',
        valueSearchList: '',
        selectType: 0,
        ProgressList: '',
        compCount1: 0,
        compCount2: 0,
        compCount3: 0,
        compCount4: 0,
        compCount5: 0,
        compCount6: 0,
        taskCount1: 0,
        taskCount2: 0,
        taskCount3: 0,
        taskCount4: 0,
        taskCount5: 0,
        taskCount6: 0,
        TypeList: [
          {
            value: 1,
            label: '计划状态'
          },
          {
            value: 2,
            label: '实际状态'
          },
          {
            value: 3,
            label: '比对状态'
          }
        ],
        valueTypeList: [
          {
            value: 1,
            label: '计划产值'
          },
          {
            value: 2,
            label: '实际产值'
          }
        ],
        selectValueType: '',
        taskName: '',//任务名称
        dutyUserId: '',//群组成员数据id
        taskPriority: '',//任务优先级
        taskUserGroup: '',//任务负责群组
        taskGroup: '',//任务组别
        taskType: '',//任务类型
        taskStart: '',//任务开始时间
        taskEnd: '',//任务结束时间
        taskParId:'0',
        selectChildren:'',//选中表格是否又子菜单
        linkTaskId: '',//前置任务Id
        removeTaskId: '',//移动任务Id
        disable: false,//是否禁止日期选择
        deleteLinkTaskDialog: false,//删除前置任务弹出框
        deleteTaskDialog: false,//删除任务
        deleteFileDialog: false,//删除文件
        deleteTaskResourceDialog: false,//删除任务资源
        deleteAssociationListDialog: false,//删除关联清单
        selectId: '',//删除ID
        showText: false,//删除任务显示文字
        showText1: false,
        relaType: '',
        relaId: '',
        taskPriorityList: [
          {
            value: 0,
            label: '请选择'
          },
          {
            value: 1,
            label: '1'
          },
          {
            value: 2,
            label: '2'
          },
          {
            value: 3,
            label: '3'
          }
        ],
        taskTypeList: [
          {
            value: 0,
            label: '一般任务'
          },
          {
            value: 1,
            label: '里程碑任务'
          }
        ],
        editObject: {},//编辑时获取行数据
        deleteTabObject: {},//删除时获取行数据
        sortObject: {},//排序时获取行数据
        linkTypeValue: "",
        linkTypeList: [
          {
            value: "SS",
            label: "开始-开始(SS)"
          },
          {
            value: "SF",
            label: "开始-结束(SF)"
          },
          {
            value: "FS",
            label: "结束-开始(FS)"
          },
          {
            value: "FF",
            label: "结束-结束(FF)"
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
          height: '10px'
          //  rowStyle:[Function],
        },
        // rowStyle:[Function],
        columns1: [
          {
            label: '名称',
            prop: 'taskName',
            hidden: true,
          },
          {
            label: '序号',
            prop: 'taskId',
            hidden: true,
          },
          {
            label: '编号',
            prop: 'completeTaskCode',
            hidden: true,
          }
        ],
        columns: [
          {
            label: '名称',
            prop: 'taskName',
            type: 'template',
            template: 'action',
            minWidth: '240px'

          },
          // {
          //   label: '序号',
          //   prop: 'taskId',
          //   show: true,
          //   minWidth: '60px'
          // },
          {
            label: '编号',
            prop: 'completeTaskCode',
            width: '80px'

          },
          {
            label: '优先级',
            prop: 'taskPriority',
            width: '65px'

          },
          {
            label: '里程碑',
            prop: 'taskType',
            width: '65px',
             type: 'template',
            template: 'milepost',
          },
          {
            label: '计划开始',
            prop: 'taskStart',
            type: 'template',
            template: 'taskStart',
            width: '90px'

          },
          {
            label: '计划结束',
            prop: 'taskEnd',
            type: 'template',
            template: 'taskEnd',
            width: '90px'
          },
          {
            label: '实际开始',
            prop: 'realTaskStart',
            type: 'template',
            template: 'realTaskStart',
           width: '90px'
          },
          {
            label: '实际结束',
            prop: 'realTaskEnd',
            type: 'template',
            template: 'realTaskEnd',
           width: '90px'
          },
          {
            label: '工作日',
            prop: 'taskDuration',
            type: 'template',
            template: 'taskDuration',
            width: '65px'
          },
          {
            label: '计划状态',
            prop: 'taskStatusStr',
             width: '80px'

          },
          {
            label: '实际状态',
            prop: 'actualStatusStr',
             width: '80px'
          },
          {
            label: '比对状态',
            prop: 'verifyStatusStr',
             width: '80px'
          },
          {
            label: '负责群组',
            prop: 'taskUserGroupName',
             width: '80px'
          },
          {
            label: '负责人',
            prop: 'dutyUserName',
            width: '80px'
          },
          // {
          //   label: '计划人',
          //   prop: 'createUserName',
          //   show: true,
          // },
          {
            label: '操作',
            prop: 'operator',
            type: 'template',
            template: 'action',
            width: '130px'
          }
        ],
        columnsBatich:[
            {
              label: '名称',
              prop: 'taskName',
              type: 'template',
              template: 'action',
              width: '240px'

            },
            // {
            //   label: '序号',
            //   prop: 'taskId',
            //   show: true,
            //   minWidth: '60px'
            // },
            {
              label: '编号',
              prop: 'completeTaskCode',
              width: '80px'

            },
            {
              label: '计划开始',
              prop: 'taskStart',
              type: 'template',
              template: 'taskStart',
              width: '90px'

            },
            {
              label: '计划结束',
              prop: 'taskEnd',
              type: 'template',
              template: 'taskEnd',
              width: '90px'
            },
            {
              label: '实际开始',
              prop: 'realTaskStart',
              type: 'template',
              template: 'realTaskStart',
            width: '90px'
            },
            {
              label: '实际结束',
              prop: 'realTaskEnd',
              type: 'template',
              template: 'realTaskEnd',
            width: '90px'
            },
            // {
            //   label: '计划状态',
            //   prop: 'taskStatusStr',
            //   width: '80px'

            // },
            {
              label: '实际状态',
              prop: 'actualStatusStr',
              width: '80px'
            },
            {
              label: '比对状态',
              prop: 'verifyStatusStr',
              width: '80px'
            },
            // {
            //   label: '负责群组',
            //   prop: 'taskUserGroupName',
            //   width: '80px'
            // },
            // {
            //   label: '负责人',
            //   prop: 'dutyUserName',
            //   width: '80px'
            // },
            // {
            //   label: '计划人',
            //   prop: 'createUserName',
            //   show: true,
            // },
            {
              label: '操作',
              prop: 'operator',
              type: 'template',
              template: 'action',
              width: '140px'
            }

        ],
        //以下为甘特图数据
        hiddenGanttList: true,
        xmlDoc: '',
        a: [],
        colorValueList: [],
        colorValueList1: [],
        ge:"",
        rowJson:'',
        screenLeftShow:false,
        UPID:'',
        showBimDataList:'',//着色数量
        loadGanttList:{
            tasks: [
              
            ],
            selectedRow: 0, 
            deletedTaskIds: [],
            resources: [],
            roles:[],
            canWrite:false,
            canDelete:true, 
            canWriteOnParent: true,
            canAdd:true
            },
            ret:{"tasks":    [
            {"id": -1, "name": "Gantt editor", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 0, "status": "STATUS_ACTIVE", "depends": "", "canWrite": true, "start": 1396994400000, "duration": 20, "end": 1399586399999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": true},
            {"id": -2, "name": "coding", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 1, "status": "STATUS_ACTIVE", "depends": "", "canWrite": true, "start": 1396994400000, "duration": 10, "end": 1398203999999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": true},
            {"id": -3, "name": "gantt part", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 2, "status": "STATUS_ACTIVE", "depends": "", "canWrite": true, "start": 1396994400000, "duration": 2, "end": 1397167199999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": false},
            {"id": -4, "name": "editor part", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 2, "status": "STATUS_SUSPENDED", "depends": "3", "canWrite": true, "start": 1397167200000, "duration": 4, "end": 1397685599999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": false},
            {"id": -5, "name": "testing", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 1, "status": "STATUS_SUSPENDED", "depends": "2:5", "canWrite": true, "start": 1398981600000, "duration": 5, "end": 1399586399999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": true},
            {"id": -6, "name": "test on safari", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 2, "status": "STATUS_SUSPENDED", "depends": "", "canWrite": true, "start": 1398981600000, "duration": 2, "end": 1399327199999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": false},
            {"id": -7, "name": "test on ie", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 2, "status": "STATUS_SUSPENDED", "depends": "6", "canWrite": true, "start": 1399327200000, "duration": 3, "end": 1399586399999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": false},
            {"id": -8, "name": "test on chrome", "progress": 0, "progressByWorklog": false, "relevance": 0, "type": "", "typeId": "", "description": "", "code": "", "level": 2, "status": "STATUS_SUSPENDED", "depends": "6", "canWrite": true, "start": 1399327200000, "duration": 2, "end": 1399499999999, "startIsMilestone": false, "endIsMilestone": false, "collapsed": false, "assigs": [], "hasChild": false}
          ], "selectedRow": 2, "deletedTaskIds": [],
            "resources": [
            {"id": "tmp_1", "name": "Resource 1"},
            {"id": "tmp_2", "name": "Resource 2"},
            {"id": "tmp_3", "name": "Resource 3"},
            {"id": "tmp_4", "name": "Resource 4"}
          ],
            "roles":       [
            {"id": "tmp_1", "name": "Project Manager"},
            {"id": "tmp_2", "name": "Worker"},
            {"id": "tmp_3", "name": "Stakeholder"},
            {"id": "tmp_4", "name": "Customer"}
          ], "canWrite":    true, "canDelete":true, "canWriteOnParent": true, canAdd:true}

      }
    },
    created() {
      var vm = this
      vm.projId = localStorage.getItem('projId');
      vm.defaultSubProjId = localStorage.getItem('defaultSubProjId');
      vm.token = localStorage.getItem('token');
      vm.projName=localStorage.getItem('projName');
      vm.userId = localStorage.getItem('userid');
      vm.BDMSUrl = vm.$store.state.BDMSUrl;
      vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
      vm.qrShareUrl=vm.$store.state.qrShareUrl;
      vm.UPID = vm.$store.state.UPID
      vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
      vm.loadingTitle();
      vm.getTaskIndex();
      vm.getProjectGroup();
      // vm.changeUrl();
     
      // this.getTaskList();
    },
    mounted() {

    },
    watch: {
      selectUgId: function (val) {
        var vm = this
        this.taskIndexData=[];
        this.taskIndexDataList=[];
        document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';
        this.getTaskList();
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
    computed: {},
    filters: {
      timeChange(val) {
        if (val == null) {
          return;
        } else {
          return moment(val).format("YYYY-MM-DD");
        }
      },
      linkType(val) {
        if (val == "SS") {
          return "开始-开始"
        } else if (val == "SF") {
          return "开始-结束"
        } else if (val == "FS") {
          return "结束-开始"
        } else if (val == "FF") {
          return "结束-结束"
        }
      }

    },
    methods: {
       callback(e){
            switch(e.data.command){
              case "EngineReady":
                break;
              case "CurrentSelectedEnt":
                  CurrentSelectPara=e.data.parameter[0];
                  CurrentSelectedEntList=e.data.parameter;
                  console.log(CurrentSelectPara,'CurrentSelectPara');
                  console.log(CurrentSelectedEntList,'CurrentSelectedEntList');
                break;
              case "ViewpointSubmited":
                        break;
              case "GetDrawingList":
              break;
              case "UsingColorStatus":{
              }
            }
        },
      //着色状态
      siteColorSearch() {
        var vm=this;
         if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })}else{
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                 const app = document.getElementById('webIframe').contentWindow;
                 axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/task/showBimData',
                    headers:{
                      'token':vm.token
                    },
                    params:{
                      taskStart:this.taskProgressStart,
                      taskEnd:this.taskProgressEnd,
                      ugId: this.selectUgId,
                      type: this.selectType
                    }
                  }).then((response)=>{
                    if(response.data.cd=='0'){
                      this.showBimDataList=response.data.rt;
                      var DataList=[];
                      this.showBimDataList.Items.forEach((item)=>{
                         var ElementSummaryDataList=[];
                        item.ElementSummaryList.forEach((val)=>{
                            ElementSummaryDataList.push(JSON.parse(val))
                        })
                        //  console.log(ElementSummaryDataList,'ElementSummaryDataList222');
                         item.ElementSummaryList = ElementSummaryDataList;
                      })
                      
                      console.log(this.showBimDataList,'this.showBimDataList');
                      this.progressSearchDialog=false;
                      app.postMessage({command:"UsingColorStatus",parameter:this.showBimDataList},"*");
                      this.taskProgressStart="";
                      this.taskProgressEnd="";


                    }
                  })

                
            }
      },
      loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'005','00503','/SchedulePlan/taskIndex','00501','/SchedulePlan/personalCalendar','00502','/SchedulePlan/resourcePlan','00504','/SchedulePlan/calendarConfig');
          console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
      getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
          var vm=this;
          //   console.log(vm.moduleList,'获取的东西');
          var secondList=[];
          itemList.forEach((item)=>{
              if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                  secondList.push(item)
                  if(item.moduleCode==Code1){
                      vm.$set(item,'isShow',true);
                      vm.$set(item,'routerLink',routerLink1);
                  }
                  if(item.moduleCode==Code2){
                      vm.$set(item,'isShow',false);
                      vm.$set(item,'routerLink',routerLink2);
                  }
                  if(item.moduleCode==Code3){
                      vm.$set(item,'isShow',false);
                      vm.$set(item,'routerLink',routerLink3);
                  }
                  if(item.moduleCode==Code4){
                      vm.$set(item,'isShow',false);
                          vm.$set(item,'routerLink',routerLink4);
                  }
              }
          })
          secondList=secondList.sort(vm.compare('sequenceNo'))
          return secondList
      },
        //排序函数
      compare(property) {
          return function(a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
          }
      },
      // 补零
      addZero(num, size) {
        var len = ('' + num).length;
        return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
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
      //获取着色状态
      showBimData(){

         var list=[
          {
            name:'',info:'',
            Items:[{name:'',ColorID:''}],
            ElementSummaryList:[
                {
                  TraceID:'',
                  HolderPath:[{ID:"",Type:''}]
                }
              ]
          }
        ]

      },
      
      //获取工程群组
      getProjectGroup(){
        var vm=this;
        axios({
          method:'get',
          // url:vm.BDMSUrl+'userGroup/getAllGroup',
          url:vm.BDMSUrl+'userGroup/getUserGroup',
          headers:{
            'token':this.token
          },
          params:{
            projectId:vm.projId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.selectUgId = response.data.rt[0].groupId;
            this.ugList = response.data.rt;
            // this.tgList = response.data.rt.tgList;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },
      //获取任务组别
      getTaskGroupList(){
        var vm=this;
        axios({
          url:vm.BDMSUrl+'schedule/'+vm.projId+'/taskGroup/list',
          method:'get',
          headers:{
            'token':vm.token
          }
        }).then((response)=>{
          if(response.data.cd==0){
            this.tgList=response.data.rt
          }else{
            this.$message({
              type:'error',
              message:response.data.msg
            })
          }
        })
      },

      //获取工程任务页面
      getTaskIndex() {
       
        axios({
          method: 'get',
          url: this.BDMSUrl + 'schedule/taskIndex',
          headers: {
            'token': this.token
          },
          params: {
            projId: this.projId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            // this.selectUgId = response.data.rt.selectUgId;
            // this.ugList = response.data.rt.ugList;
            // this.tgList = response.data.rt.tgList;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },

      //获取工程列表
      getTaskList() {
        this.loading=true;
        var list=[];
        //  document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';
        // this.taskIndexData=[];
        // this.taskIndexDataList=[];
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/list',
          headers: {
            'token': this.token
          },
          params: {
            ugId: this.selectUgId,
            taskName: this.searchTaskName
          }
        }).then(response => {
          if (response.data.rt) {
            var vm=this
            // vm.$emit('refresh')
            this.taskIndexData = response.data.rt;
            // this.taskIndexData.forEach((item)=>{
             
            // })
            this.dataDigui(response.data.rt);
            // console.log(this.taskIndexDataList,'this.taskIndexDataList');
            if (response.data.rt == null) {
              this.taskIndexData = [];
            }

            this.loading=false;
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }else if(response.data.cd=='0'){
            this.loading=false;
          }
        })
      },
      dataDigui(root){
        for(let i = 0;i < root.length;i++){
            if(root[i].children){
              this.dataDigui(root[i].children);
            }else{
              this.taskIndexDataList.push(root[i]);
              // return;
            }
        }
      },
      search(item){
        item.forEach((val)=>{
          item=val;
        })
          
        },
      taskUserGroupChange() {
        this.ugList.forEach((item) => {
          if (item.groupId == this.taskUserGroup) {
            this.taskUserGroup = item.groupId
          }
        })
        this.getUserGroupUsers()
      },
      //获取群组成员数据
      getUserGroupUsers() {
        axios({
          method: 'post',
          // url: this.BDMSUrl + 'schedule/getUserGroupUsers',
          url:this.BDMSUrl + 'userGroup/getGroupUser',
          headers: {
            'token': this.token
          },
          params: {
            groupId: this.taskUserGroup
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.userGroupUserList = response.data.rt
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //获取工程任务核实信息列表
      getVerifyList() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/verifyList',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.verifyLists = response.data.rt;
            this.attachList = this.verifyLists.attachList;
            this.fileList = this.verifyLists.fileList;
            this.verifyList = this.verifyLists.verifyList;
            // console.log(this.verifyList)
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //点击zk-tree获取id
      rowClick(row, rowIndex,$event) {
        // var userAgent = navigator.userAgent;//取得浏览器的userAgent字符串
        // //判断是什么浏览器
        // if (userAgent.indexOf("Firefox") > -1) {
        //   if(row.target._prevClass=="zk-table__cell-inner"){
        //     row.target.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
        //       item.style.backgroundColor='white'
        //     })
        //     row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
        //   }
        //   if(row.target._prevClass=="zk-table__body-cell zk-table--border-cell"){
        //     row.target.parentElement.parentElement.childNodes.forEach((item)=>{
        //       item.style.backgroundColor='white'
        //     })
        //     row.target.parentElement.style.backgroundColor='#0081c2'
        //   }
        //   if(row.target._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
        //     row.target.parentElement.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
        //       item.style.backgroundColor='white'
        //     })
        //     row.target.parentElement.parentElement.parentElement.style.backgroundColor='#0081c2'
        //   }
        //   console.log('是火狐浏览器')
        // } 
        // //判断是否chorme浏览器
        // if (userAgent.indexOf("Chrome") > -1){
        //     if(row.path[0]._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
        //       row.path[4].childNodes.forEach((item)=>{
        //           item.style.backgroundColor='white'
        //         })
        //       row.path[3].style.backgroundColor='#0081c2'
        //     }
        //     if(row.path[0]._prevClass=="zk-table__cell-inner"){
        //         row.path[3].childNodes.forEach((item)=>{
        //           item.style.backgroundColor='white'
        //           })
        //         row.path[2].style.backgroundColor='#0081c2'
        //     }
        //     if(row.path[0]._prevClass=="zk-table__body-cell zk-table--border-cell"){
        //         row.path[2].childNodes.forEach((item)=>{
        //               item.style.backgroundColor='white'
        //             })
        //           row.path[1].style.backgroundColor='#0081c2'
        //     }
        //    console.log('是谷歌浏览器')
        // }
        console.log(row);
        {
          if(row.target._prevClass=="zk-table__cell-inner"){
            row.target.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
              item.style.backgroundColor='white'
            })
            row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
          }
          if(row.target._prevClass=="zk-table__body-cell zk-table--border-cell"){
            row.target.parentElement.parentElement.childNodes.forEach((item)=>{
              item.style.backgroundColor='white'
            })
            row.target.parentElement.style.backgroundColor='#0081c2'
          }
          if(row.target._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
            row.target.parentElement.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
              item.style.backgroundColor='white'
            })
            row.target.parentElement.parentElement.parentElement.style.backgroundColor='#0081c2'
          }
        }
       
        

        //如何是火狐浏览器，兼容图表选中问题
        
        // if(row.target.parentElement._prevClass=="zk-table__body-row"){
        //   row.target.parentElement.offsetParent.children[1].childNodes.forEach((item)=>{
        //     item.style.backgroundColor='white'
        //   })
        //   row.target.parentElement.style.backgroundColor='#0081c2'
        // }
        // if(row.target.parentElement._prevClass="zk-table__cell-inner"){
        //   console.log('fhd')

        //   row.target.parentElement.offsetParent.parentElement.style.backgroundColor='#0081c2'
        // }
        // if(row.target.parentElement.getElementsByTagName=="tr"){
        //   console.log("ppppp")
        // }
        // if(row.target.parentElement._prevClass=="zk-table__body-cell zk-table--border-cell"){
        //   console.log('1223')
        //    row.target.parentElement.offsetParent.children[1].childNodes.forEach((item)=>{
        //     item.style.backgroundColor='white'
        //   })
        //   row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
        // }
          
          //  row.target.parentElement.offsetParent.children[1].childNodes.forEach((item)=>{
          //   item.style.backgroundColor='white'
          //   })
          //   row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
        
            // row.target.parentElement.offsetParent.children[1].childNodes.forEach((item)=>{
            // item.style.backgroundColor='white'
            // })
            // row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
            //  row.target.parentElement.style.backgroundColor='#0081c2'
       
        console.log(row.target.parentElement)
          this.selectRowList = rowIndex;
          this.selectRowList.forEach((item, index) => {
            if (item._isHover == true) {
              this.selectChildren=item.children
              this.taskId = item.taskId
              this.taskParId = item.taskParId
            }
          })
        setTimeout(()=>{
            
        },200)
        this.getTask();
        this.getVerifyList();
        this.getEntityRelation();
        // this.getTaskResourceTaskList();
      },
      rowKey(row, rowIndex) {
      
      },
      rowStyle(row, rowIndex) {
        var vm = this;
        if (row.children == null) {
          var color = vm.selectColor(parseInt(row.colorValue));
          return 'color:' + color;
        }
      },
      //根据工程获取状态颜色
      getProjectStatusColor() {

        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/getProjectStatusColor',
          headers: {
            'token': this.token
          },
          params: {
            projectId: this.projId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.ProjectStatusColorList = response.data.rt;
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      selectColor(val) {
        var color = "";
        var text = "";
        switch (val) {
          case 12001:
            color = "RGBA(127,127,127,255)";
            return color;
            break;

          case 12002:
            color = "RGBA(159,159,159,255)";
            return color;
            break;
          case 12003:
            color = "RGBA(191,191,191,255)";
            return color;
            break;
          case 12004:
            color = "RGBA(223,223,223,255)";
            return color;
            break;
          case 12005:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 12006:
            color = "RGBA(255,255,191,255)";
            return color;
            break;
          case 12007:
            color = "RGBA(255,240,191,255)";
            return color;
            break;
          case 12008:
            color = "RGBA(255,232,139,255)";
            return color;
            break;
          case 12009:
            color = "RGBA(255,214,238,255)";
            return color;
            break;
          case 12010:
            color = "RGBA(255,152,201,255)";
            return color;
            break;
          case 12011:
            color = "RGBA(255,62,160,255)";
            return color;
            break;
          case 12012:
            color = "RGBA(255,105,105,255)";
            return color;
            break;
          case 12013:
            color = "RGBA(255,62,62,255)";
            return color;
            break;
          case 12014:
            color = "RGBA(255,0,0,255)";
            return color;
            break;
          case 12015:
            color = "RGBA(255,186,116,255)";
            return color;
            break;
          case 12016:
            color = "RGBA(255,127,0,255)";
            return color;
            break;
          case 12017:
            color = "RGBA(99,255,99,255)";
            return color;
            break;
          case 12018:
            color = "RGBA(0,171,0,255)";
            return color;
            break;
          case 12019:
            color = "RGBA(173,173,255,255)";
            return color;
            break;
          case 12020:
            color = "RGBA(68,199,255,255)";
            return color;
            break;

          case 13001:
            color = "RGBA(255,0,0,255)";
            return color;
            break;
          case 13002:
            color = "RGBA(255,255,0,255)";
            return color;
            break;
          case 13003:
            color = "RGBA(0,255,0,255)";
            return color;
            break;
          case 13004:
            color = "RGBA(0,255,255,255)";
            return color;
            break;
          case 13005:
            color = "RGBA(0,0,255,255)";
            return color;
            break;
          case 13006:
            color = "RGBA(255,0,255,255)";
            return color;
            break;
          case 13007:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 13008:
            color = "RGBA(167,167,167,255)";
            return color;
            break;
          case 13009:
            color = "RGBA(214,214,214,255)";
            return color;
            break;
          case 13010:
            color = "RGBA(255,128,0,255)";
            return color;
            break;
          case 13011:
            color = "RGBA(128,255,0,255)";
            return color;
            break;
          case 13012:
            color = "RGBA(0,255,128,255)";
            return color;
            break;
          case 13013:
            color = "RGBA(0,128,255,255)";
            return color;
            break;
          case 13014:
            color = "RGBA(128,0,255,155)";
            return color;
            break;
          case 13015:
            color = "RGBA(255,0,128,255)";
            return color;
            break;
          case 13016:
            color = "RGBA(128,64,0,255)";
            return color;
            break;
          case 13017:
            color = "RGBA(75,38,0,255)";
            return color;
            break;
          case 13018:
            color = "RGBA(91,91,91,255)";
            return color;
            break;
          case 13019:
            color = "RGBA(63,63,63,255)";
            return color;
            break;
          case 13020:
            color = "RGBA(0,0,0,255)";
            return color;
            break;

          case 23001:
            color = "RGBA(127,191,255,40)";
            return color;
            break;
          case 23002:
            color = "RGBA(0,63,127,63)";
            return color;
            break;
          case 23003:
            color = "RGBA(127,255,192,63)";
            return color;
            break;
          case 23004:
            color = "RGBA(0,192,0,63)";
            return color;
            break;
          case 23005:
            color = "RGBA(75,75,75,128)";
            return color;
            break;
          case 23006:
            color = "RGBA(54,54,54,128)";
            return color;
            break;
          case 23007:
            color = "RGBA(0,63,127,40)";
            return color;
            break;
          case 23008:
            color = "RGBA(0,189,0,40)";
            return color;
            break;
          case 23009:
            color = "RGBA(56,56,56,40)";
            return color;
            break;
          case 23010:
            color = "RGBA(0,128,255,255)";
            return color;
            break;
          case 91001:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91002:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91003:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91004:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91005:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91006:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91007:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
          case 91008:
            color = "RGBA(255,255,255,255)";
            return color;
            break;
        }
        if (val == "10000") {
          return "";
        }
      },
      rowClassName(row, rowIndex) {
        //   console.log(row);
      },
      //鼠标单击树形icon
      treeIconClick(row, rowIndex) {
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.taskId = item.taskId
            this.taskParId = item.taskParId
            this.tableCollapse = item._isFold == true ? 1 : 0;
          }
        })
      },

      //获取资源类别
      getResourceTypeList() {
        axios({
          method: "post",
          url: this.BDMSUrl + 'schedule/' + this.projId + '/resourceType/getResouceType',
          headers: {
            'token': this.token
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.resourceTypeList = response.data.rt;
          } else if (response.data.cd == "-1") {
            alert(resposne.data.msg)
          }
        })
      },
      //改变资源类别触发
      resourceTypeChange() {
        this.reId = this.resourceTypeValue;
        this.getTaskResouceType();
      },
      taskResourceChange() {
        this.taskResourceTypeList.forEach((item) => {
          if (this.taskResourceTaskValue == item, id) {
            this.resourceTypeName = item.name;
          }
        })
      },
      //获取资源类型名称
      getTaskResouceType() {
        axios({
          method: "post",
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/getResouceType',
          headers: {
            'token': this.token
          },
          params: {
            reId: this.reId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.taskResourceTypeList = response.data.rt;
            if (this.taskResourceTypeList) {
              this.taskResourceTaskValue = this.taskResourceTypeList[0].id;
              this.resourceTypeName = this.taskResourceTypeList[0].name;
            } else {
              return;
            }
          } else if (response.data.cd == "-1") {
            alert(resposne.data.msg)
          }
        })
      },
      //获取任务资源列表
      getTaskResourceTaskList() {
        axios({
          method: "post",
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/getTaskResourceTask',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.taskResourceTaskList = response.data.rt;
            //   console.log(this.taskResourceTaskList);
          } else if (response.data.cd == "-1") {
            alert(resposne.data.msg)
          }
        })
      },
      //获得新增/修改任务页面的负责群组
      getTaskUserGroupList() {
        if (this.taskId == '') {
          this.taskId = -1;
        }
        if (this.taskParId =='0') {
          this.taskParId = '0';
        }
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/taskUserGroupList',
          headers: {
            'token': this.token
          },
          params: {
            projId: this.projId,
            taskId: this.taskId,
            taskParId: this.taskParId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.TaskUserGroupList = response.data.rt
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },

      //进入任务群组权限界面
      editTaskUserGroup(){
           axios({
              method:'get',
              url:this.BDMSUrl+'schedule/editTaskUserGroup',
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
                 
                  // var num=this.ugList1[0].ugId;
                  // this.groupIds.push(num.toString());
                  // console.log(this.groupIds)
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      checkFlgChange(index){
        //  var str=this.ugList1[index].ugId;
        // this.groupIds.push(str.toString());

        // this.ugList1.forEach((item)=>{
        //   if(item.checkFlg==true){
        //       this.groupIds.push(item.ugId.toString());
        //   }else if(item.checkFlg==false){
        //     this.groupIds.pop(item.ugId.toString());
        //   }
        // })
        this.groupIds=[];
         this.ugList1.forEach((item)=>{
                if(item.checkFlg==true){
                  this.groupIds.push(item.ugId.toString())
                }
            })
      },
      userGroupTaskMakeSure(){
          this.taskId=this.editTaskUserGroupList.taskId;
          this.taskName=this.editTaskUserGroupList.taskName;
          this.taskParId=this.taskInformationList.taskParId;
         
          axios({
              method:'post',
              url:this.BDMSUrl+'schedule/saveTaskUserGroup',
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
                    taskParId:this.taskParId
              }
          }).then(response=>{
              if(response.data.cd=="0"){
                  this.userGroupTaskDialog=false;
                   this.taskIndexData=[];
                    document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
                  this.getTaskList();
                  this.groupFlag=false;
                  this.groupIds=[];
                  this.taskId="";
                  this.taskParId='0';
                  this.taskName="";
                  this.$message({
                        type:'success',
                        message:'群组权限保存成功'
                    })
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })

      },

      //查询清单列表
      loadManifestSearch() {
        // if (this.startDate) {
        //   this.startDate = moment(this.startDate).format("YYYY-MM-DD")
        // } else {
        //   this.startDate = '';
        // }
        // if (this.endDate) {
        //   this.endDate = moment(this.endDate).format("YYYY-MM-DD")
        // } else {
        //   this.endDate = ''
        // }
        // var formData = new FormData();
        // formData.append('relaType', this.relaTypeValue);
        // formData.append('serviceState', this.serviceStateValue);
        // formData.append('detailName', this.detailName);
        // formData.append('startDate', this.startDate);
        // formData.append('endDate', this.endDate);
        axios({
          method: 'post',
          url: this.BDMSUrl + 'manifest/getManifest',
          headers: {
            //   'content-type': 'application/json;charset=UTF-8',
            'token': this.token
          },
          params: {
            // projectId: this.projId,
            // page: this.pageDetial_1.currentPage,
            // rows: this.pageDetial_1.pagePerNum,
            // type: 4,
            name:this.detailName
          }
        }).then(response => {
          if (response.data.cd == '0') {
            // this.pageDetial_1.total = response.data.rt.total;
            response.data.rt.rows.forEach((item)=>{
              this.loadManifestList.push(item)
            });
            //   console.log(JSON.stringify(this.loadManifestList))
          } else if (response.data.cd == '-1') {
            alert(response.dara.msg);
          }
        })
      },
      //选择文件
      checkItem(val) {
        var vm = this;
        var fileCheckList = [];
        this.elementTraceIds=[];
        for (var i = 0; i < vm.loadManifestList.length; i++) {
            vm.$set(vm.loadManifestList[i], 'checked', false)
        }
        vm.$set(vm.loadManifestList[val], 'checked', true)
        vm.checkedItem = vm.loadManifestList[val]
        // if(vm.loadManifestList[val].checked==true){
        //   console.log('00');
        // }
        // this.elementTraceIds=this.getElementByMid(vm.checkedItem.id);
        // console.log(vm.checkedItem)
        // console.log(this.elementTraceIds,'this.elementTraceIds');
        
      },
      //加载清单列表
      getLoadManifest() {
        axios({
          method: 'post',
          // url: this.BDMSUrl + 'schedule/loadManifest',
          url:this.BDMSUrl +'manifest/getManifest',
          headers: {
            'token': this.token
          },
          params: {
            // projectId: this.projId,
            // page: this.pageDetial_1.currentPage,
            // rows: this.pageDetial_1.pagePerNum,
            // type: 4
            name:''
          }
        }).then(response => {
          if (response.data.cd == '0') {
            // this.pageDetial_1.total = response.data.rt.total;
            // this.loadManifestList = response.data.rt;
            response.data.rt.forEach((item)=>{
                this.loadManifestList.unshift(item)
            })
            //   console.log(JSON.stringify(this.loadManifestList))
          } else if (response.data.cd == '-1') {
            alert(response.dara.msg);
          }
        })
      },
      //获取绑定实体关系分组、绑定bim关系
      getEntityRelation() {
        axios({
          method: 'get',
          // url: this.BDMSUrl + 'schedule/' + this.projId + '/entityRelation/list',
          url:this.BDMSUrl+'manifest/getBindManifest',
          headers: {
            'token': this.token
          },
          params: {
            businessId: this.taskId,
            type: 2 //获取时为2
          }
        }).then(response => {
          if (response.data.cd == "0") {
            // this.entityRelationList = response.data.rt;
            this.relaList = response.data.rt;
            
            //   console.log(JSON.stringify(this.relaList)+'bim');
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //增加绑定实体关系分组、绑定bim关系
      addEntityRelation(){
       
      },
      //获取工程任务详细信息
      getTask() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/' + this.taskId,
          headers: {
            'token': this.token
          },
        }).then(response => {
          if (response.data.cd == "0") {
            this.taskInformationList = response.data.rt
            this.linkList = this.taskInformationList.linkList
            //   console.log(JSON.stringify( this.taskInformationList))
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //点击新增甘特图
      addGanttTask(){
        var tableInfo = $(".gdfTable");
        console.log(tableInfo[1].getElementsByClassName("rowSelected")[0].attributes.taskid.value);
        // $('#workSpace').trigger('moveUpCurrentTask.gantt');return false;//上移
        // $('#workSpace').trigger('moveDownCurrentTask.gantt');return false;//下移
        // $('#workSpace').trigger('deleteFocused.gantt');return false;
      },
      //点击新增任务
      addTask() {
        this.addTaskDialog = true;
        this.taskType = this.taskTypeList[0].value;
        this.taskPriority = this.taskPriorityList[0].value;
        this.taskGroup = '0';
        this.taskUserGroup = '0';
        this.dutyUserId = '0';
        this.taskParId ='0';
        if (this.taskInformationList) {
          this.taskParId = this.taskInformationList.taskId;
          this.lastNodeName = this.taskInformationList.taskName;
        } else {
          this.taskParId = '0';
          this.lastNodeName = '无';
        }
        this.getTaskGroupList();
        //   this.getTaskUserGroupList();
      },
      //网页预览
      labelListConfirm(val){
        var vm = this;
            window.open('/#/Cost/getMainLabelInformation/'+val)
        // window.open('/#/Cost/getManifestDetailInfoForPage/'+1944+'/'+0)
      },
      printCurrentLabel(){
         var vm = this
        var datas = '['
        var tabelTitle = vm.projName + '清单标签'
        var keyList = '["清单ID","清单名称","生成方式","业务来源","创建用户","创建时间","清单版本","明细数量"]'
        // console.log(vm.relaList1,'清单9d')
        vm.relaList1.forEach((item,i)=>{
            var valueList = '["' + (item.main.pkId ? item.main.pkId : "") + '","'
                + (item.main.mName ? item.main.mName : "") + '","' + (item.main.mGSource ? vm.parseMGSource(item.main.mGSource) : "") + '","'
                + (item.main.mBSource ? vm.parseMBSource(item.main.mBSource) : "") + '","' + (item.main.creator ? item.main.creator : "") + '","' +
                (item.main.createTime ? vm.timeChanges(item.main.createTime) : "") + '","' + (item.main.mVersion ? item.main.mVersion : "") + '","'
                + (item.details.length ? item.details.length : "") + '"]'
            var data = '{"Title":"' + tabelTitle + '","LabelType":"general","Code":"' +
                 vm.changeUrl(vm.qrShareUrl+'/QR-QD-' + vm.addZero(item.main.pkId, 7))+
                '","KeyList":' + keyList + ',"ValueList":' + valueList + '}'
            datas += data
            if (i < vm.relaList1.length - 1) datas += ','
        })
        datas += ']'
        console.log(datas,'data11110000');
        vm.$refs.taskIndedxLabelContent.value = datas

        $('#taskIndedxPrint-qrcode').submit()
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
      addTaskMakeSure() {
        
        if(this.taskName==''){
           this.$message({
            type:"error",
            message:"任务名称内容不能为空"
          })
        }else if(this.taskUserGroup =='0'){
          this.$message({
            type:"error",
            message:"负责群组不能为空"
          })
        }
        else if(this.taskGroup=='0')
        {
          this.$message({
            type:"error",
            message:"必须为任务指定一个任务组别"
          })
        }else if(this.taskStart==''){
          this.$message({
            type:"error",
            message:"开始时间不能为空"
          })
        }else if(this.taskEnd==''){
          this.$message({
            type:"error",
            message:"结束时间不能空"
          })
        }
        else if(this.taskStart>=this.taskEnd){
          this.$message({
            type:"error",
            message:"结束时间不能早于开始时间"
          })
        }else{
          this.loading=true;
          axios({
            method: 'post',
            url: this.BDMSUrl + 'schedule/' + this.projId + '/task/add',
            headers: {
              'token': this.token
            },
            params: {
              currentGroupId: this.selectUgId
            },
            data: {
              taskName: this.taskName,//任务名称
              dutyUserId: this.dutyUserId,//群组成员数据id
              taskPriority: this.taskPriority,//任务优先级
              taskUserGroup: this.taskUserGroup,//任务负责群组
              taskGroup: this.taskGroup,//任务组别
              taskType: this.taskType,//任务类型
              taskStart: moment(this.taskStart).format("YYYY-MM-DD"),//任务开始时间
              taskEnd: moment(this.taskEnd).format("YYYY-MM-DD"),//任务结束时间
              taskParId:this.taskParId,
              id: '',
            }
          }).then(response => {
            if (response.data.cd == "0") {
              this.addTaskDialog = false;
               this.taskIndexData=[];
               document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
              this.getTaskList();
              this.dutyUserId='';
              this.taskPriority='';
              this.taskUserGroup='';
              this.taskType='';
              this.taskName = '';
              this.taskStart = '';
              this.taskEnd = '';
              this.$message({
                type:'success',
                message:'新增任务成功'
              })
            } else if (response.data.cd == "-1") {
              this.$message({
                type:'error',
                message:response.data.msg
              })
            }
            this.loading=false;
          })
        }
      },
      timeChanges(val) {
        if (val==null) {
          return;
        } else {
          return moment(val).format("YYYY-MM-DD");
        }
      },
      addTaskCancle() {
        this.addTaskDialog = false;
      },
      //点击添加前置任务
      addLink() {
        if (!this.taskId) {
          alert('请选择一个任务')
        } else {
          this.addLinkDialog = true;
          this.linkTypeValue = this.linkTypeList[0].value;
        }
      },
      linkTypeRowClick(row, rowIndex) {
        if(row.path[0]._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
          row.path[4].childNodes.forEach((item)=>{
              item.style.backgroundColor='white'
            })
          row.path[3].style.backgroundColor='#0081c2'
        }
         if(row.path[0]._prevClass=="zk-table__cell-inner"){
            row.path[3].childNodes.forEach((item)=>{
               item.style.backgroundColor='white'
              })
            row.path[2].style.backgroundColor='#0081c2'
        }
        if(row.path[0]._prevClass=="zk-table__body-cell zk-table--border-cell"){
            row.path[2].childNodes.forEach((item)=>{
                  item.style.backgroundColor='white'
                })
            row.path[1].style.backgroundColor='#0081c2'
        }
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.linkTaskId = item.taskId
            // console.log(this.linkTaskId)
          }
        })
      },
      removeTaskRowClick(row, rowIndex) {
         if(row.path[0]._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
          row.path[4].childNodes.forEach((item)=>{
              item.style.backgroundColor='white'
            })
          row.path[3].style.backgroundColor='#0081c2'
        }
         if(row.path[0]._prevClass=="zk-table__cell-inner"){
            row.path[3].childNodes.forEach((item)=>{
               item.style.backgroundColor='white'
              })
            row.path[2].style.backgroundColor='#0081c2'
        }
        if(row.path[0]._prevClass=="zk-table__body-cell zk-table--border-cell"){
            row.path[2].childNodes.forEach((item)=>{
                  item.style.backgroundColor='white'
                })
              row.path[1].style.backgroundColor='#0081c2'
        }
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.curUgId = item.taskUserGroup
            this.removeTaskId = item.taskId
          }
        })
      },
      addColorStatus(){
          alert('虚拟场景面板未打开，请打开左侧虚拟场景面板。')
      },
      addLinkMakeSure(){
        this.loading=true;
          if(this.taskId==this.linkTaskId){
              alert('前置任务不能是当前任务本身')
              return;
          }
          axios({
              method:'post',
              url:this.BDMSUrl+'schedule/'+this.projId+'/task/addLink',
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
                  document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
                  document.getElementsByClassName("editBodytwo3")[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';
                  this.linkTaskId='';
                  this.linkType='';
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
              this.loading=false;
          })

      },
      deleteLinkType(val) {
        this.linkList.forEach((item) => {
          if (val == item.linkTaskId) {
            this.taskId = item.taskId;
            this.linkId = item.linkId;
          }
        })
        this.deleteLinkTaskDialog = true;
      },
      deleteLinkTaskClose() {
        this.deleteLinkTaskDialog = false;
      },
      deleteLinkTaskMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/deleteLink',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId,
            linkId: this.linkId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.getTask();
            this.taskId = '';
            this.linkId = '';
            this.deleteLinkTaskDialog = false;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },
      addLinkCancle() {
        this.addLinkDialog = false;
      },
      edit(scope) {
        this.editObject = scope;
        //   console.log(this.editObject);
        this.editTaskDialog = true;
        this.taskName = this.editObject.row.taskName;
        this.dutyUserId = this.editObject.row.dutyUserId;
        this.taskPriority = this.editObject.row.taskPriority;
        this.taskUserGroup = this.editObject.row.taskUserGroup;
        this.taskId = this.editObject.row.taskId;
        this.getUserGroupUsers();
        this.taskGroup = this.editObject.row.taskGroup;//任务组别
        this.taskType = this.editObject.row.taskType;
        this.taskParId = this.editObject.row.taskParId;
        this.taskStart = this.StrToGMT(this.editObject.row.taskStart);
        this.taskEnd = this.StrToGMT(this.editObject.row.taskEnd);
        if (scope.row.children) {
          this.disable = false;
        } else {
          this.disable = true;
        }
        ;
        if (scope.row.taskParId == '0') {
          this.lastNodeName = '无'
        } else {
          this.lastNodeName = this.editObject.row.taskName;
        }
      },
      StrToGMT(time) {
        let GMT = new Date(time)
        return GMT
      },
      editTaskMakeSure() {
        if(this.taskName==''){
           this.$message({
            type:"error",
            message:"任务名称内容不能为空"
          })
        }else if(this.taskUserGroup =='0'){
          this.$message({
            type:"error",
            message:"负责群组不能为空"
          })
        }
        else if(this.taskGroup=='0')
        {
          this.$message({
            type:"error",
            message:"必须为任务指定一个任务组别"
          })
        }else if(this.taskStart>=this.taskEnd){
          this.$message({
            type:"error",
            message:"结束时间不能早于开始时间"
          })
        }else{
          this.loading=true;
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/update',
          headers: {
            'token': this.token
          },
          params: {
            taskStart: moment(this.taskStart).format("YYYY-MM-DD"),//任务开始时间
            taskEnd: moment(this.taskEnd).format("YYYY-MM-DD"),//任务结束时间
            id: this.taskId,
            taskName: this.taskName,//任务名称
            taskType: this.taskType,//任务类型
            taskUserGroup: this.taskUserGroup,//任务负责群组
            taskParId: this.taskParId,
            taskPriority: this.taskPriority,//任务优先级
            dutyUserId: this.dutyUserId,//群组成员数据id
            taskGroup: this.taskGroup,//任务组别
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.editTaskDialog = false;
            this.taskIndexData=[];
            document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
            this.getTaskList();
            this.taskName = '';
            this.taskStart = '';
            this.taskEnd = '';
            this.id = '';
            this.taskType = '';
            this.taskUserGroup = '';
            this.taskParId ='0';
            this.taskPriority = '';
            this.dutyUserId = '';
            this.taskGroup = '';
            this.$message({
              type:'success',
              message:'修改工程任务成功'
            })
            this.loading=false;
          } else {
            alert(response.data.msg)
          }
        })
        }

      },
      editTaskCancle() {
        this.editTaskDialog = false;
        this.taskName = '';
        this.taskStart = '';
        this.taskEnd = '';
        this.id = '';
        this.taskType = '';
        this.taskUserGroup = '';
        this.taskParId = '0';
        this.taskPriority = '';
        this.dutyUserId = '';
        this.taskGroup = '';
      },
      deleteTab(scope) {
        this.deleteTaskDialog = true;
        this.deleteTabObject = scope;
        // console.log(this.deleteTabObject);
        this.taskId = this.deleteTabObject.row.taskId;
        if (this.deleteTabObject.row.children) {
          this.showText = true;
        } else {
          this.showText1 = true;
        }
      },
      deleteGanttTab(){
        this.deleteTaskDialog = true;
        var tableInfo = $(".gdfTable");
        console.log(tableInfo[1].getElementsByClassName("rowSelected")[0].attributes.taskid.value);
        // console.log(this.deleteTabObject);
        this.taskId = tableInfo[1].getElementsByClassName("rowSelected")[0].attributes.taskid.value;
        // if (this.deleteTabObject.row.children) {
        //   this.showText = true;
        // } else {
        //   this.showText1 = true;
        // }

      },
      deleteTaskMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/delete',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId,
            type: this.type
          }
        }).then(response => {
          if (response.data.cd == '0') {
             this.taskIndexData=[];
            this.getTaskList();
            this.taskId = '';
            this.Type = null;
            this.showText = false;
            this.showText1 = false;
            this.deleteTaskDialog = false;
            this.taskInformationList=[];
             document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
            // this.lastNodeName='';
            // this.taskIndexData=[];
            this.dutyUserId='';
            this.taskPriority='';
            this.taskUserGroup='';
            this.taskType='';
            this.taskName = '';
            this.taskStart = '';
            this.taskEnd = '';
            this.$message({
              type:'success',
              message:'删除任务成功'
            })
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },
      deleteTaskClose() {
        this.deleteTaskDialog = false;
        this.taskId = '';
        this.showText = false;
        this.showText1 = false;
      },
      sort(scope) {
        this.removeTaskDialog = true;
        this.sortObject = scope;
        this.taskId = this.sortObject.row.taskId;
        
        // document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
        // if(this.deleteTabObject.row.children){
        //     this.showText=true;
        // }else{
        //     this.showText1=true;
        // }
      },
      removeTaskCancle() {
        this.removeTaskDialog = false;
      },
      removeTaskMakeSure() {
        if (this.taskId == this.removeTaskId) {
          this.$message({
              type:'success',
              message:'移动任务不能是当前任务本身'
            })
          return;
        }
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/degrade',
          headers: {
            'token': this.token
          },
          params: {
            prevTaskId:this.removeTaskId,
            taskId: this.taskId,
            curUgId: this.curUgId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.removeTaskDialog = false;
             this.taskIndexData=[];
              document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';//清除列表之前背景
              document.getElementsByClassName("editBodytwo3")[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';
            this.getTaskList();
            this.removeTaskId = '';
            this.$message({
              type:'success',
              message:'移动任务成功'
            })
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //进度查询
      progressSearch() {
        this.progressSearchDialog = true;
        this.selectType = this.TypeList[0].value;
        this.radio = '1';
      },
      //批量核实
      batchVerification(){
        this.batchVerificationShow=true;
        this.projectWorkShow=false;
      },
      projectWork(){
        this.projectWorkShow=true;
        this.batchVerificationShow=false;
      },
      selectChange() {
        this.compCount1 = 0;
        this.compCount2 = 0;
        this.compCount3 = 0;
        this.compCount4 = 0;
        this.compCount5 = 0;
        this.compCount6 = 0;
        this.taskCount1 = 0;
        this.taskCount2 = 0;
        this.taskCount3 = 0;
        this.taskCount4 = 0;
        this.taskCount5 = 0;
        this.taskCount6 = 0;
      },
      selectValueChange() {
        // this.valueTypeList=[];

      },
      //查询功能
      taskProgressSearch() {
        // console.log(this.selectUgId)
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/taskProgressSearch',
          headers: {
            'token': this.token
          },
          params: {
            taskStart: this.taskProgressStart,
            taskEnd: this.taskProgressEnd,
            ugId: this.selectUgId,
            type: this.selectType
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.ProgressList = response.data.rt;
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
            if (this.ProgressList.compCount1) {
              this.compCount1 = this.ProgressList.compCount1;
            } else {
              this.compCount1 = 0;
            }
            if (this.ProgressList.compCount2) {
              this.compCount2 = this.ProgressList.compCount2;
            } else {
              this.compCount2 = 0;
            }
            if (this.ProgressList.compCount3) {
              this.compCount3 = this.ProgressList.compCount3;
            } else {
              this.compCount3 = 0;
            }
            if (this.ProgressList.compCount4) {
              this.compCount4 = this.ProgressList.compCount4;
            } else {
              this.compCount4 = 0;
            }
            if (this.ProgressList.compCount5) {
              this.compCount5 = this.ProgressList.compCount5;
            } else {
              this.compCount5 = 0;
            }
            if (this.ProgressList.compCount6) {
              this.compCount6 = this.ProgressList.compCount6;
            } else {
              this.compCount6 = 0;
            }

                     if(this.ProgressList.taskCount1){
                        this.taskCount1=this.ProgressList.taskCount1;
                    }else{
                        this.taskCount1=0;
                    }
                    if(this.ProgressList.taskCount2){
                        this.taskCount2=this.ProgressList.taskCount2;
                    }else{
                        this.taskCount2=0;
                    }
                    if(this.ProgressList.taskCount3){
                        this.taskCount3=this.ProgressList.taskCount3;
                    }else{
                        this.taskCount3=0;
                    }
                    if(this.ProgressList.taskCount4){
                        this.taskCount4=this.ProgressList.taskCount4;
                    }else{
                        this.taskCount4=0;
                    }
                    if(this.ProgressList.taskCount5){
                        this.taskCount5=this.ProgressList.taskCount5;
                    }else{
                        this.taskCount5=0;
                    }
                    if(this.ProgressList.taskCount6){
                        this.taskCount6=this.ProgressList.taskCount6;
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
            this.radio='1';
        },

        taskValueSearch(){
             axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/task/taskValueSearch',
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
                 this.groupIds=[];
                this.editTaskUserGroup();
                // this.rowClick(row,rowIndex);
                // this.ugList1.forEach((item)=>{

                // })
            }else{
                this.$message({
                  type:'info',
                  message:'请选择你要修改的任务'
                })
            }
        },
        userGroupTaskCancle(){
            this.userGroupTaskDialog=false;
            this.groupIds=[];
        },
        //导入文件
        exportProject(){
            this.exportProjectDialog=true;
      },
      cancleSelect(){
        document.getElementsByClassName('zk-table__body')[0].getElementsByTagName("tbody")[0].style.backgroundColor='white';
        this.taskId='';
        
        this.taskInformationList=[];
        this.lastNodeName='';
        this.taskIndexData=[];
        this.dutyUserId='';
        this.taskPriority='';
        this.taskUserGroup='';
        this.taskType='';
        this.taskName = '';
        this.taskStart = '';
        this.taskEnd = '';
        // this.getTaskIndex();
       this.getTaskList();
      },
      exportProjectMakeSure() {
        if (this.taskId == '') {
          this.taskId = 0
        }
        var formData = new FormData();
        formData.append('exportProject', this.uploadfilesList);
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/addTaskByMpp',
          headers: {
            'token': this.token
          },
          params: {
            projId: this.projId,
            currtUgId: this.selectUgId,
            taskId: this.taskId
          },
          data: formData
        }).then(response => {
          if (response.data.cd == '0') {
             this.taskIndexData=[];
            this.getTaskList();
            this.exportProjectDialog = false;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg);
          }
        })
      },
      exportProjectCancle() {
        this.exportProjectDialog = false;

      },
      deleteColumns() {
        this.columns.splice(0, 5);
        this.getTaskList();
      },
      //显示列
      showColumnConfig() {
        var vm = this;
        this.ListHeaderShow = true;
        var str = [];
        $.extend(str, vm.columns);
        this.detailsHead_model = str;
        this.detailsHead_model.forEach((item, index) => {
          this.$set(item, 'showModel', item.show)
        })
        // this.deleteColumns();
        },
        headerListCancle(){
            var vm = this
            vm.ListHeaderShow = false
            vm.detailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        //删除核实任务
        deleteVerfiy(tvId,num){
           axios({
                method:'get',
                url:this.BDMSUrl+'schedule/'+this.projId+'/task/deleteVerify',
                headers:{
                    'token':this.token
                },
                params:{
                  tvId:tvId,
                  taskId:num
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                  this.getTaskList();
                  this.getVerifyList();
                    this.$message({
                      type:'success',
                      message:'删除核实记录成功'
                    })
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        //点击添加核实任务
        addVerifyRecord(){
            this.addVerifyTaskDialog=true;
        },
        //确认添加核实任务
        addVerifyTaskMakeSure(){
            var myDate = new Date();
            if(this.verifyStartTime==''){
              this.$message({
                type:'info',
                message:'请输入核实日期'
              })
            }else if(this.verifyStartTime>myDate){
                alert('核实日期不能超过当前日期!')
                return;
            }else{
              axios({
                  method:'post',
                  url:this.BDMSUrl+'schedule/'+this.projId+'/task/addVerify',
                  headers:{
                      'token':this.token
                  },
                  data:{
                      taskVerify:{
                          taskId:this.taskId,
                          tvDate:moment(this.verifyStartTime).format("YYYY-MM-DD"),
                          tvRate:this.tvValue
                      }
                  }
              }).then(response=>{
                  if(response.data.cd=='0'){
                  this.getTaskList();
                  this.getVerifyList();
                  // this.TaskList();
                  this.tvValue=0;
                  this.verifyStartTime='';
                  this.addVerifyTaskDialog=false;
                  }else if(response.data.cd=='-1'){
                      this.$message({
                        type:'info',
                        message:response.data.msg
                      })
                  }
              })
            }
        },
        addVerifyTaskCancle(){
           this.verifyStartTime='';
            this.addVerifyTaskDialog=false;
        },
        //点击关联清单
        associationList(){
            this.addAssociationListDialog=true;
            // if(scope){

            // }else{
            // }
              this.relaTypeValue=this.relaTypeList[0].value;
              this.serviceStateValue=this.serviceStateList[0].value;
              this.getLoadManifest();
            
            
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
         //根据清单id获取traceId
        getElementByMid(mid){
            var vm=this;
            var traceId=[]
            var para=[]
            axios({
                url:this.BDMSUrl+'manifest/getElementByMid',
                method:'post',
                headers:{
                    'token':vm.token    
                },
                params:{
                    mid:mid,
                    businessType:2
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    response.data.rt.forEach((item)=>{
                        para.push({
                          "TraceID":String(item.traceId)
                        });
                    })
                     console.log(para,'多点定位数据');
                     const app = document.getElementById('webIframe').contentWindow;
                    app.postMessage({command:"LookAtEntities",parameter:para},"*");
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                }
            })
            //  traceId.forEach((item)=>{
            //     para.push({
            //       "TraceID":String(item),
            //       // "HolderPath":JSON.parse(item.dHolderPath),
            //       // "GCCode":item.dGCCode
            //     })
            //   })
            // console.log(traceId,'traceId')
             
            // return traceId
        },

        //添加关联清单确认
        addAssociationListMakeSure(){
          var vm=this;
          this.loading=true;
            axios({
                method:'post',
                // url:this.BDMSUrl+'manifest2/businessBindManifestAndUpdateStatus',
                // url:this.BDMSUrl+'manifest/bindElement',
                url:this.BDMSUrl+'manifest/bindElementWithExsistManifest',
                headers:{
                    'token':this.token
                },
                params:{
                    // bId:this.taskId,
                    // bType:2,
                    // mId:this.checkedItem.detailId,
                    // currState:this.checkedItem.serviceState,
                    // currOperate:41,
                    // projId:this.projId
                    businessId:this.taskId,
                    // businessName:this.taskName,
                    type:2,
                    mid:vm.checkedItem.id
                },
                // data:this.elementTraceIds
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.addAssociationListDialog=false;
                    this.getLoadManifest();
                    this.getEntityRelation();
                    this.checkedItem={};
                    this.loadManifestList=[];
                    // if(response.data.msg!=null){
                    //   alert(response.data.msg);
                    // }
                    this.$message({
                      type:'success',
                      message:'添加清单成功'
                    })
                    
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
                this.loading=false;
            })

      },

      //场景选择
      siteSearch(){
         if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })}else if(CurrentSelectedEntList==''){
              this.$message({
                  type:'info',
                  message:'先在图形上面选择构件'
              })
            }else{
                // var JsonData=[];
                // JsonData.push({relaId:this.taskId,relaType: 2,subProjId:this.defaultSubProjId,entityList:CurrentSelectedEntList})
                // console.log(JsonData,'JsonData');
                axios({
                  method: 'post',
                  url: this.BDMSUrl +'/model2/'+this.projId+'/entityRelation/add',
                  headers: {
                    'token': this.token
                  },
                  data:{
                    "entityList":CurrentSelectedEntList,
                    "relaId":this.taskId,
                    "relaType":2,
                    "subProjId":this.defaultSubProjId,
                  },
                }).then(response => {
                  if (response.data.cd == "0") {
                      this.getEntityRelation();
                      this.addAssociationListDialog=false;
                    } else if (response.data.cd == "-1") {
                      alert(response.data.msg)
                    }
                  })
            }
      },
      showDetialList(item) {
        this.showCommonList = true;
        this.checkList = item;
      },
      backToH() {
        var vm = this
        vm.showCommonList = false
      },
      //显示二维码
      qrcode(val) {
        this.labelListShow = true;
        this.labelPkId=val;
        console.log(this.relaList,'this.relaList');
        this.relaList.forEach((item) => {
          if (item.id == val.id) {
            this.relaList1 = [];
            this.relaList1.push(item);
            console.log(this.relaList1,'relaList1');
          }
        })
      },
      labelListCancle() {
        var vm = this
        vm.labelListShow = false
      },
      //关联清单列单的定位
      location(value) {
        if(document.getElementById('webgl').style.display=='none'){
                this.$message({
                    type:'info',
                    message:'请打开顶部的虚拟场景'
                })
            }else{
              // console.log(value,'多点定位数据');
             this.getElementByMid(value.id);

              // var para=[];
              // this.elementTraceIds.forEach((item)=>{
              //   para.push({
              //     "TraceID":String(item),
              //     // "HolderPath":JSON.parse(item.dHolderPath),
              //     // "GCCode":item.dGCCode
              //   })
              // })
              // console.log(para,'多点定位数据');
            }
      },
      //将清单与任务解除关联关系
      deleteAssociationList(num) {
        this.deleteAssociationListDialog = true;
        this.relaList.forEach((item) => {
          if (item.id == num) {
            this.mId = item.id
          }
        })
      },
      deleteAssociationListMakeSure() {
        axios({
          method: 'get',
          // url: this.BDMSUrl + 'schedule/deleteMBRelation',
          url:this.BDMSUrl+'manifest/deleteBind',
          headers: {
            'token': this.token
          },
          params: {
            // projId:this.projId,
            mid: this.mId,
            businessId: this.taskId,
            type: 2 //业务类型
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.getEntityRelation()
            this.deleteAssociationListDialog = false;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },
      deleteAssociationListClose() {
        this.deleteAssociationListDialog = false;
      },
      //添加资源类别
      addResourceTask() {
        this.resourceTypeValue = 0;
        this.reId = this.resourceTypeValue;
        this.patternValue = 0;
        this.getTaskResouceType();
        this.getResourceTypeList();
        this.addResourceTaskDialog = true;
      },
      deleteTaskResource(num) {
        this.deleteTaskResourceDialog = true;
        this.selectId = num;
      },
      deleteTaskResourceMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/deleteResouceTask',
          headers: {
            'token': this.token
          },
          params: {
            id: this.selectId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            // this.getTaskResourceTaskList();
            this.deleteTaskResourceDialog = false;
            this.selectId = '';
          }
        })

      },
      deleteTaskResourceClose() {
        this.deleteTaskResourceDialog = false;
        this.selectId = '';
      },
      addResourceTaskMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/addResouceTask',
          headers: {
            'token': this.token
          },
          data: {
            amount: this.amount,
            pattern: this.patternValue,
            reId: this.resourceTypeValue,
            resourceName: this.resourceName,
            rtId: this.taskResourceTaskValue,
            taskId: this.taskId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            // this.getTaskResourceTaskList();
            this.addResourceTaskDialog = false;
            this.amount = '',
              this.patternValue = '',
              this.resourceTypeValue = '',
              this.resourceTypeName = '',
              this.taskResourceTaskValue = ''
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })

      },
      addResourceTaskCancle() {
        this.addResourceTaskDialog = false;
        this.amount = '',
          this.patternValue = '',
          this.resourceTypeValue = '',
          this.resourceTypeName = '',
          this.taskResourceTaskValue = ''
      },
      //上传文件
      uploadFile() {
        this.uploadFileDialog = true;
      },
      uploadFileCancle() {
        this.uploadFileDialog = false;
        this.uploadfilesList = [];
        this.imageName='';
      },
      uploadFileMakeSure() {
        var vm=this;
        // var returnUrl = this.BDMSUrl + 'schedule/task/fileUpload?ugId=' + this.selectUgId + '&id=' + this.taskId;
        // returnUrl = encodeURIComponent(returnUrl);
        var formData = new FormData();
        // formData.append('token', this.token);
        // formData.append('projId', this.projId);
        // formData.append('userId', this.userId);
        // formData.append('id',this.taskId);
        // formData.append('type', 1);
        formData.append('file', this.uploadfilesList);
        // formData.append('ugId',);
        // formData.append('modelCode', '005');
        // formData.append('returnUrl', returnUrl);
        axios({
          method: 'post',
          // url: this.QJFileManageSystemURL + 'uploading/uploadFileInfo',
          url:this.BDMSUrl+'schedule/fileUpload',
          headers: {
            'Content-Type': 'multipart/form-data',
            'token':vm.token
          },
          params:{
            taskId:vm.taskId,
            type:6,
            projectId:vm.projId
          },
          data: formData,
        }).then((response) => {
          if (response.data.cd == '0') {
            this.getVerifyList();
            this.uploadFileDialog = false;
          }
        })
      },
      //点击选择文件
      selectFile() {
        this.$refs.file.click()
      },
      fileChanged(e) {
        this.uploadfilesList = e.target.files[0];
        this.imageName = this.uploadfilesList.name;
      },
      imgChanged(e) {
        this.uploadfilesList = e.target.files[0];
        this.imageName = this.uploadfilesList.name;
        this.imageName = this.imageName.substring(this.imageName.lastIndexOf("\\") + 1);
        var extStart = this.imageName.lastIndexOf(".");
        var ext = this.imageName.substring(extStart, this.imageName.length).toUpperCase();
        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
          alert("提示:图片限于png,gif,jpeg,jpg格式");
          this.uploadfilesList = [];
          this.imageName = '';
        }
      },
      exportProjectFileChanged(e) {
        this.uploadfilesList = e.target.files[0];
        this.MppName = this.uploadfilesList.name;
        var extName = this.MppName.substring(this.MppName.lastIndexOf(".") + 1).trim().toLowerCase();
        if (extName != "mpp") {
          alert("提示:文件只限于mmp格式");
          this.uploadfilesList = [];
          this.MppName = '未选择任何文件';
        }

      },
      //绑定图片
      bindPic() {
        this.uploadPicDialog = true;
      },
      //上传图片取消
      uploadPicCancle() {
        this.uploadPicDialog = false;
        this.imageName='';

      },
      uploadPicMakeSure() {
        var vm=this;
        // var returnUrl = this.BDMSUrl + 'schedule/task/attachmentUpload?id=' + this.taskId;
        // returnUrl = encodeURIComponent(returnUrl);
        var formData = new FormData();
        // formData.append('token', this.token);
        // formData.append('projId', this.projId);
        // formData.append('id',this.taskId);
        // formData.append('type', 1);
        // formData.append('userId', this.userId);
        formData.append('file', this.uploadfilesList);
        // formData.append('ugId',this.selectUgId);
        // formData.append('modelCode', '005');
        // formData.append('returnUrl', returnUrl);
        axios({
          method: 'post',
          // url: this.QJFileManageSystemURL + 'uploading/uploadFileInfo',
          url:vm.BDMSUrl + 'schedule/fileUpload',

          headers: {
            'Content-Type': 'multipart/form-data',
            'token':vm.token

          },
          params:{
            taskId:vm.taskId,
            type:5,
            projectId:vm.projId
          },
          data: formData,
        }).then((response) => {
          if (response.data.cd == '0') {
            this.getVerifyList();
            this.uploadPicDialog = false;
          }
        })
      },
      //查看
      searchs(filePath) {
        window.open(this.BDMSUrl + filePath + "/preview");
      },
      //下载
      downLoad(filePath) {
        var vm = this
        window.open(vm.BDMSUrl + filePath + '');
      },
      //查看图片
      searchsPic(filePath) {
        window.open(this.BDMSUrl + filePath + "/preview");
      },
      //下载图片
      downLoadPic(filePath) {
        var vm = this
        window.open(vm.BDMSUrl + filePath + '');
      },

      //点击删除文件、图片
      deleteFile(fileId) {
        this.deleteFileDialog = true;
        this.fileId = fileId;
      },
      deleteFileClose() {
        this.deleteFileDialog = false;
        this.fileId = '';
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
      //删除任务关联文件(文件/图片)
      deleteFileMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + 'schedule/' + this.projId + '/task/deleteAttach',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId,
            fileId: this.fileId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.deleteFileDialog = false;
            this.getVerifyList();
            this.fileId = '';
          } else if (response.data.cd == '-1') {
            alert(resposne.data.msg)
          }
        })

      },
      //以下为甘特图代码

      //获得甘特图列表
      getGanttList() {
        this.hiddenGanttList = !this.hiddenGanttList;
        //  this.ge = new GanttMaster(this);
        // this.ge.reset();
        this.updateGanttCollapse();
        this.initGantt();
      },
      initGantt() {
        // this.loadGanttList={}
        // var canWrite=true;
        this.ge = new GanttMaster(this);
        // this.ge.reset();
        this.ge.set100OnClose = true;
        this.ge.shrinkParent = true;

        this.ge.init($("#workSpace"));
        this.loadI18n(); //overwrite with localized ones

        //in order to force compute the best-fitting zoom level
        delete this.ge.gantt.zoom;

        var project = this.loadFromLocalStorage();

        if (!project.canWrite)
          $(".ganttButtonBar button.requireWrite").attr("disabled", "true");

        this.ge.loadProject(project);
        this.ge.checkpoint();
        // this.loadGanttList={}
      },

      upgrade() {

      },
      degrade() {

      },
      swap() {

      },
      updateGanttCollapse() {
        axios({
          method: 'get',
          url: this.BDMSUrl +'schedule/updateGanttCollapse/' + this.projId,
          headers: {
            'token': this.token
          },
          params: {
            taskId: 7067,
            ganttCollapse: 0
          }
        }).then(response => {

        })

      },
      loadI18n(){
        GanttMaster.messages = {
          "CANNOT_WRITE":"No permission to change the following task:",
          "CHANGE_OUT_OF_SCOPE":"Project update not possible as you lack rights for updating a parent project.",
          "START_IS_MILESTONE":"Start date is a milestone.",
          "END_IS_MILESTONE":"End date is a milestone.",
          "TASK_HAS_CONSTRAINTS":"Task has constraints.",
          "GANTT_ERROR_DEPENDS_ON_OPEN_TASK":"Error: there is a dependency on an open task.",
          "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK":"Error: due to a descendant of a closed task.",
          "TASK_HAS_EXTERNAL_DEPS":"This task has external dependencies.",
          "GANNT_ERROR_LOADING_DATA_TASK_REMOVED":"GANNT_ERROR_LOADING_DATA_TASK_REMOVED",
          "CIRCULAR_REFERENCE":"Circular reference.",
          "CANNOT_DEPENDS_ON_ANCESTORS":"Cannot depend on ancestors.",
          "INVALID_DATE_FORMAT":"The data inserted are invalid for the field format.",
          "GANTT_ERROR_LOADING_DATA_TASK_REMOVED":"An error has occurred while loading the data. A task has been trashed.",
          "CANNOT_CLOSE_TASK_IF_OPEN_ISSUE":"Cannot close a task with open issues",
          "TASK_MOVE_INCONSISTENT_LEVEL":"You cannot exchange tasks of different depth.",
          "CANNOT_MOVE_TASK":"CANNOT_MOVE_TASK",
          "PLEASE_SAVE_PROJECT":"PLEASE_SAVE_PROJECT",
          "GANTT_SEMESTER":"Semester",
          "GANTT_SEMESTER_SHORT":"s.",
          "GANTT_QUARTER":"Quarter",
          "GANTT_QUARTER_SHORT":"q.",
          "GANTT_WEEK":"Week",
          "GANTT_WEEK_SHORT":"w."
        };
      },
      loadFromLocalStorage(){
        var ret;
        if (localStorage) {
          if (localStorage.getObject("teamworkGantDemo")) {
            ret = localStorage.getObject("teamworkGantDemo");
          }
        }

        //if not found create a new example task
        if (!ret || !ret.tasks || ret.tasks.length == 0){
          ret=this.getDemoProject();
        }
        return ret;
      },
      getDemoProject(){
        var ret=this.ret;
        //actualize data
        var offset=new Date().getTime()-ret.tasks[0].start;
        for (var i=0;i<ret.tasks.length;i++) {
          ret.tasks[i].start = ret.tasks[i].start + offset;
        }
        return ret;
      }

    },
  }
</script>

<style lang="less">
   *{
        // margin: 0;
        // padding: 0;
        box-sizing: border-box;
        // font-size: 12px;
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

  li {
    list-style: none;
  }

  .show {
    display: block !important;
  }

  #taskIndex {
    height: 100%;
    #print-qrcode{
          display: none;
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
    #mask {
      z-index: 3000;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .5;
      background: #000;
    }
    #GroupSelect {
      // display: block;
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
    .topHeader {
      box-sizing: border-box;
      position: fixed;
      top: 116px;
      left: 26px;
      bottom: 0;
      right: 0;
      overflow: auto;
    }
    #item-box-file {
      display: block;
      border-bottom: 1px solid #e6e6e6;
      height: 49px;
      padding-top: 16px;
      padding-left: 20px;
      background: #fafbfc;
      position: relative;
      .label-item {
        float: left;
        height: 34px;
        font-size: 14px;
        width: 106px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        border-top: 3px solid #fafbfc;
        color: #999999;
        text-decoration: none;
      }
      .label-item-active {
        color: #fc3439;
        font-weight: bold;
        border-top: 3px solid #fc3439;
        border-left: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #fff;
        background: #ffffff;
      }
      .title-right {
        float: left;;
        width: 214px;
        height: 30px;
        margin-right: 10px;
        position: relative;
        .title-right-icon {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          border: 1px solid #e6e6e6;
          position: relative;
          background: #fafafa;
          padding-left: 10px;
          padding-right: 40px;
          margin-right: 5px;
          outline: none;
          font-size:14px;
          &:focus {
            background: #ffffff;
          }
        }
        .el-icon-search {
          position: absolute;
          right: 10px;
          top: 8px;
        }
      }
      .item-search {
        position: absolute;
        display: block;
        right: 35px;
        top: 10px;
        width: auto;
        .icon-type {
          float: left;
          width: 30px;
          height: 30px;
          border: 1px solid #cccccc;
          background: #f2f2f2;
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          &::after {
            display: block;
            position: absolute;
            top: 8px;
            left: 5px;
            width: 18px;
            height: 13px;
            background: url('./images/type.png') no-repeat 0 0;
            content: '';
          }
          &:hover {
            background: #fff6f7;
          }
        }
      }
    }
    ::-webkit-scrollbar{width:0px}
    .taskWarp {
      width: 96%;
      margin-top: 20px;
      padding: 12px;
      margin: 0 auto;
      box-sizing: border-box;
      height: 750px; 
      .taskHead {
        margin-top: 20px;
        .taskHeadLeft {
          float: left;
          width: 105px;
          height: 28px;
          border: 1px solid #fc3439;
          background: #fc3439;
          font-size: 12px;
          line-height: 28px;
          vertical-align: middle;
          color: #ffffff;
          border-radius: 4px;
          cursor: pointer;
        }
        .taskHeadRight {
          float: right;
          .btn-operate {
            display: inline-block;
            padding: 3px 12px;
            line-height: 22px;
            font-size: 12px;
            font-weight: 100;
            background: #f2f2f2;
            border-radius: 2px;
            height: 28px;
            cursor: pointer;
          }
        }

      }
      .taskBody {
        margin-top: 60px;
        width: 100%;
        overflow-y: auto;
      }
    }
    .taskWarp1{
      width: 100%;
      margin-top: 10px;
      padding: 12px;
      margin: 0 auto;
      box-sizing: border-box;
      height: 750px; 
      .taskBody1 {
        margin-top: 60px;
        width: 100%;
        overflow-y: auto;
      }
    }
    // 左侧
    .box-left-container {
      // display: block;
      // position: fixed;
      // top: 115px;
      // left: 26px;
      // bottom: 0;
      // right: 225px;
      // // z-index: 1001;
      // transition: all ease .5s;
      // overflow: auto;
        display: inline-block;
        width: 85%;
        position: relative;
        // transition:  all ease .5s;

    }
    .goujian{
      width: 100% !important;
    }
    .gantt_left{
      width: 100% !important;
    }
    .box-left-active {
      width: 98%;
      // transition:  all ease .5s;
      .icon-right{
          transform: rotateZ(180deg)!important;
          transition: all ease .5s;
      }
    }
    // 右侧
    .box-right-container {
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
        // transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
        height: 785px;
        overflow-y: auto;
        overflow-x: hidden;
        #center-selection {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 25px;
          border-right: 1px solid #cccccc;
          .SH_right {
            width: 100%;
            height: 48px;
            border-left: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
            position: relative;
            cursor: pointer;
            .icon-right {
              display: block;
              position: absolute;
              top: 19px;
              left: 6px;
              width: 14px;
              height: 14px;
              background: url('./images/right.png') no-repeat 0 0;
              transition: all ease .5s;
              transform: rotateZ(0deg);
            }
          }
          .item-property { //任务
            display: block;
            width: 25px;
            height: 68px;
            background: #fafafa;
            padding-top: 15px;
            font-size: 12px;
            color: #666666;
            text-align: center;
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            position: relative;
            cursor: pointer;
            &::after {
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
          .item-version { //核实
            display: block;
            width: 25px;
            height: 68px;
            background: #fafafa;
            padding-top: 12px;
            font-size: 12px;
            color: #666666;
            text-align: center;
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            position: relative;
            cursor: pointer;
            &::after {
              display: block;
              position: absolute;
              bottom: -7px;
              width: 23px;
              height: 13px;
              background: #fafafa;
              border-bottom: 1px solid #cccccc;
              border-right:1px solid #cccccc;
              transform: skewY(30deg);
              content: '';
            }
          }
          .item-version-3 { //资源
            display: block;
            width: 25px;
            height: 68px;
            background: #fafafa;
            padding-top: 24px;
            font-size: 12px;
            color: #666666;
            text-align: center;
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            position: relative;
            cursor: pointer;
            &::after {
              display: block;
              position: absolute;
              bottom: -7px;
              width: 23px;
              height: 13px;
              background: #fafafa;
              border-bottom: 1px solid #cccccc;
              border-right:1px solid #cccccc;
              transform: skewY(30deg);
              content: '';
            }
          }

          .active-version { //中间 核实 高显
            .item-version { //核实
              background: #fff;
              color: #fc3439;
              z-index: 15;
              &::after {
                background: #fff;
              }
            }
            .item-property::after { //任务
              background: #fff;
            }
            .item-version-3 { //资源
              z-index: 10;
            }
          }
          .active { //上边 任务 高显
            .item-property {
              background: #fff;
              color: #fc3439;
            }
            .item-version {
              z-index: 15;
            }
            .item-version-3 {
              z-index: 10;
            }
          }
          .active-version-3 { //下边 资源 高显
            .item-version {
              z-index: 15;
              &::after {
                background: #fafafa;
              }
            }
            .item-property::after {
              background: #fff;
            }
            .item-version-3 {
              z-index: 10;
              background: #fff;
              color: #fc3439;
              &::after {
                background: #fff;
              }
            }
          }
        }
    }
    .box-right-active1{
        width: 2%;
        // transition: all ease .5s;
      }
    #box-right{
            padding: 19px 13px 0 10px;
            margin-left:24px;
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
                margin-top: 20px;
            }
            .header-attribute:nth-last-of-type(3){
                margin-top: 20px;
            }
            .header-attribute:nth-last-of-type(1){
                margin-top: 20px;
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
                        max-width: 130px;
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
                        max-width: 130px;
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
                // width: 200px;
                // height: 15px;
                .detial-text-name{
                    color: #999999;
                    width: 65px;
                    float: left;
                }
                .detial-text-value{
                    float: left;
                    color: #333333;
                    max-width: 130px;
                    cursor: pointer;
                    overflow: hidden;
                    // overflow-x: hidden;
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
                        // background: url('../ManageCost/images/add.png')no-repeat 0 0;
                        margin-right: 56px;
                        // &:hover{
                        //     background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                        // }
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
                        margin-top: 16px;
                        font-size: 12px;
                        line-height: 12px;
                        text-align: left;
                        width: 195px;
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
                    width: 35px;
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
                  .icon-delete{
                              width: 16px;
                              height: 16px;
                              cursor: pointer;
                              float: right;
                              background: url('./images/delete.png')no-repeat 0 0;
                              &:hover{
                                  background: url('./images/delete1.png')no-repeat 0 0;
                              }
                        }
                }
            }
    }
    #box-right1 {
      
      .addResourceType {
        height: 30px;
        border-bottom: 1px solid #e6e6e6;
        position: relative;
        .action {
          position: absolute;
          color: #78a0f8;
          left: 30px;
          top:10px;
          cursor: pointer;
          font-size: 12px;
          line-height: 12px;
          width:calc(100%-24px)
          // margin-top: 10px;
          // margin-bottom: 10px;
          //  margin-left: -153px;
        }
        
       
        // margin-left:10px;
      }
      .resourceList {
        // width: 100%;
         width: 91%;
        float: right;
        table {
          margin: 0 auto;
          width: 100%;
          border-collapse: collapse;
          // border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          thead {
            background: #f2f2f2;
            tr {
              th {
                padding-left: 10px;
                height: 36px;
                text-align: center;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
                font-size: 12px;
                color: #666666;

              }
            }
          }
          tbody {
            background: #fff;
            tr {
              td {
                padding-left: 10px;
                height: 36px;
                text-align: left;
                font-size: 12px;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
                color: #666666;
                border-bottom: 1px solid #e6e6e6;
                max-width: 80px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
            }
          }
        }

      }
    }
  #edit {
    .el-dialog__wrapper{
          .el-dialog__body {
            .editBody {
              width: 100%;
              .editBodyone {
                height: 18px;
                .text {
                  margin-left: 34px;
                  display: inline-block;
                  float: left;
                  font-size: 14px;
                  line-height: 14px;
                  color: #666666
                }
              }
              .imageBody {
                text-align: left;
              }
              .editBodytwo {
                .upInput {
                  display: none;
                }
                /* 上传文件按钮 */
                .imageBodyText {
                  color: #666;
                  font-size: 14px;
                  line-height: 14px;
                  font-weight: normal;
                  display: inline-block;
                  margin-right: 20px;
                  margin-left: 124px;
                  text-align: right;
                }
                .updataImageSpan {
                  overflow: hidden;
                  width: 98px;
                }
                .updataImageSpan input {
                  position: absolute;
                  left: 0px;
                  top: 0px;
                  opacity: 0;
                  /* -ms-filter: 'alpha(opacity=0)'; */
                }
              }
              .editBodytwo1 {
                // margin-top:20px;
                height: 80px;
                padding: 10px;
                .text1 {
                  margin-left: 25px;
                  display: block;
                  float: left;
                  font-size: 14px;
                  line-height: 30px;
                  color: #666666
                }
                .input1 {
                  width: 92%;
                  height: 38px;
                  border: 1px solid #d1d1d1;
                  border-radius: 4px;
                  background: #ffffff;
                  padding-left: 10px;
                  margin-top: 5px;
                  font-size: 14px;
                }
                .editBodytwoLeft {
                  height: 40px;
                  width: 46%;
                  float: left;
                  .text1 {
                    margin-left: 25px;
                    display: block;
                    font-size: 14px;
                    line-height: 30px;
                    color: #666666
                  }
                  .selectGroup {
                    margin-left: 25px;
                    width: 243px;
                    height: 36px;
                    position: relative;
                    color: #333333;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid #d1d1d1;
                    border-radius: 4px;
                    padding-left: 10px;
                    padding-right: 20px;
                    box-sizing: border-box;
                    margin-right: 15px;
                    float: left;
                    font-size: 14px;
                    outline: none;
                  }
                }
                .editBodytwoRight {
                  height: 40px;
                  float: right;
                  width: 46%;
                  .text1 {
                    margin-left: 25px;
                    display: block;
                    font-size: 14px;
                    line-height: 30px;
                    color: #666666
                  }
                  .selectGroup {
                    margin-left: 25px;
                    width: 243px;
                    height: 36px;
                    position: relative;
                    color: #333333;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid #d1d1d1;
                    border-radius: 4px;
                    padding-left: 10px;
                    padding-right: 20px;
                    box-sizing: border-box;
                    margin-right: 15px;
                    float: left;
                    font-size: 14px;
                    outline: none;
                  }
                }
                .startTime {
                  margin-left: 26px;
                  margin-top: 15px;
                  height: 30px;
                  float: left;
                  // display: inline-block;

                }
                .endTime {
                  margin-left: 26px;
                  margin-top: 30px;
                  height: 30px;
                  float: left;
                  // display: inline-block;

                }
                #edit .el-input__inner {
                  width: 196px;
                }
              }
              .editBodytwo2 {
                margin-top: 20px;
                padding: 0px 20px 20px 20px;
                width: 100%;
                margin-bottom: 20px;
                .labelText {
                  float: left;
                  font-size: 14px;
                  line-height: 36px;
                }
                .linkSelect {
                  margin-left: 25px;
                  width: 80%;
                  height: 36px;
                  position: relative;
                  color: #333333;
                  background-color: #fff;
                  background-image: none;
                  border: 1px solid #d1d1d1;
                  border-radius: 4px;
                  padding-left: 10px;
                  padding-right: 20px;
                  box-sizing: border-box;
                  margin-right: 10px;
                  float: left;
                  font-size: 14px;
                  outline: none;
                }
              }
              .editBodytwo3 {
                margin-top: 20px;
                // padding:0px 20px 20px 20px;
                margin: 0 auto;
                width: 640px;
                margin-bottom: 20px;
                box-sizing: border-box;
                height: 260px;
                overflow-y: auto;
              }
              .progressSearchBody {
                margin-top: 20px;
                .searchWayText {
                  float: left;
                  margin-left: 30px;
                  font-size: 14px;
                  line-height: 21px;
                  color: #666666;
                }
                #searchWay1 {
                  float: left;
                  display: inline-block;
                  margin-left: 15px;
                  vertical-align: middle;
                  margin-left: 30px;
                  font-size: 14px;
                  line-height: 24px;
                  color: #666666;
                }
                #searchWay2 {
                  float: left;
                  display: inline-block;
                  margin-left: 25px;
                  vertical-align: middle;
                  margin-left: 30px;
                  font-size: 14px;
                  line-height: 24px;
                  color: #666666;
                }
              }
              .progressSearchTime {
                margin-top: 20px;
                height: 138px;
                .left {
                  float: left;
                  margin-top: 20px;
                  margin-left: 30px;
                }
                .right {
                  float: left;
                  margin-top: 20px;
                  margin-left: 30px;
                }
              }
              .progressSearchBodyType {
                margin-top: 25px;
                height: 20px;
                float: left;
                .Text {
                  margin-left: 46px;
                  font-size: 14px;
                }
                .selectGroup {
                  margin-left: 2px;
                  width: 322px;
                  height: 36px;
                  position: relative;
                  color: #333333;
                  background-color: #fff;
                  background-image: none;
                  border: 1px solid #d1d1d1;
                  border-radius: 4px;
                  padding-left: 10px;
                  padding-right: 20px;
                  box-sizing: border-box;
                  font-size: 14px;
                  outline: none;
                }
              }
              .progressSearchBtn {
                margin-top: 80px;
                height: 30px;
                .searchBtn {
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
              .progressSearchList {
                margin-top: 20px;
                .textSearch {
                  display: inline-block;
                  float: left;
                  margin-left: 30px;
                  margin-bottom: 15px;
                }

                .tableList {
                  margin-top: 20px;
                  // border-left:1px solid #e6e6e6;
                  //  border-right:1px solid #e6e6e6;
                  table {
                    margin: 0 auto;
                    width: 92%;
                    border-collapse: collapse;
                    border-bottom: 1px solid #e6e6e6;
                    thead {
                      background: #f2f2f2;
                      tr {
                        td {
                          padding-left: 10px;
                          height: 36px;
                          text-align: center;
                          box-sizing: border-box;
                          border-right: 1px solid #e6e6e6;
                          border-left: 1px solid #e6e6e6;
                          font-size: 12px;
                          color: #666666;
                        }
                      }
                    }
                    tbody {

                      background: #fff;
                      tr {

                        td {
                          padding-left: 10px;
                          height: 36px;
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
              .verifySilder {
                width: 80%;
                margin-top: 20px;
                margin: 0 auto;
                .verifySilderText {
                  display: inline-block;
                  float: left;
                  font-size: 14px;
                  line-height: 36px;
                }
                .slider {
                  margin-left: 80px;
                }
              }
              .verifyTime {
                margin: 0 auto;
                margin-top: 20px;
                width: 80%;
                .verifySilderText {
                  display: inline-block;
                  float: left;
                  font-size: 14px;
                  line-height: 36px;
                }
              }
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
                  margin-left: -441px;
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
                        height: 31px;
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
                          height: 36px;
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
              .resourceText1 {
                margin-left: -70px;
                .resourceSelect1 {
                  width: 360px;
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
              }
              .resourceText2 {
                margin-top: 10px;
                margin-left: -70px;
                .resourceSelect2 {
                  width: 360px;
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

              }
              .resourceText3 {
                margin-left: -26px;
                margin-top: 10px;
                .resourceSelect3 {
                  width: 150px;
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
                .resourceInp {
                  width: 150px;
                  height: 36px;
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  border: 1px solid #d1d1d1;
                  border-radius: 4px;
                  background: #fff;
                  padding-left: 10px;
                  margin-top: 5px;
                }
                .text2 {
                  display: inline-block;
                  margin-left: 15px;
                }
              }
            }
          }
      }
    }

  #inital {
    .deleteDialogImg {
      height: 50px;
    }
    .deleteDialogWarning {
      font-size: 18px;
      line-height: 18px;
      font-family: 'MicrosoftYahei';
      color: #fc3439;
      font-weight: bold;
      margin: 20px 0 0 0;
    }
    .deleteDialogText {
      color: #333333;
      font-size: 14px;
      line-height: 14px;
      font-family: 'MicrosoftYahei';
      font-weight: normal;
      margin: 16px 5px 0px 5px;
    }
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
        text-align: center !important;
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

      #edit1 .el-dialog {
        width: 397px;
        .el-dialog__body {
          .editBody {
            width: 100%;
            .userGroupHead {
              margin-top: -10px;
              .userGroupText {
                display: inline-block;
                margin-left: -165px;
                //    font-size:14px;
                //    line-height:14px;
                //    color: #333333;
                //     font-family: 'MicrosoftYahei';
                //     font-weight: normal;

                    }
                    .userGroupText1{
                        margin-left:34px;
                        text-align:left;
                        width:397px;
                        font-size:14px;
                      line-height:14px;
                      color: #333333;
                        font-family: 'MicrosoftYahei';
                        font-weight: normal;
                    }
                    .userGroupTab{
                        margin:3px auto;
                        height: 247px;
                        width: 335px;
                        border:1px solid #ccc;
                        background:#fafafa;
                        .userGroupUl{
                            margin-top:20px;
                            margin-left:10px;
                            .userGroupLi{
                              text-align: left;
                                .userGroupLiText{
                                    display: inline-block;
                                    margin-left:5px;
                                    font-size:14px;
                                    line-height:14px;
                                    min-width:70px;
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

      .zk-table {
        color: #333333;
      }
      .zk-table__body-row{
        height: 36px;
        box-sizing:border-box
      }
      .zk-table__cell-inner{
        padding:5px 12px;
      }
      .zk-table--tree-icon {
        position: relative;
        width: 40px;
        display: inline-block;
        z-index: 10;
        background: #ffffff;
      }

      .zk-table__body-row .zk-table--row-hover .zk-table--tree-icon {
        background: #ccc !important;
      }

      .zk-table--tree-icon::after {
        display: block;
        position: absolute;
        top: 6px;
        left: 20px;
        width: 15px;
        height: 15px;
        background: url('./images/fload.png') no-repeat 0 0;
        content: '';
      }

      .zk-icon-minus-square-o::after {
        background: url('./images/fload.png') no-repeat 0 0;
      }

      .zk-table__body-row > td:first-of-type {
        width: 45px;
      }


      .zk-table--level-4-cell, .zk-table--level-3-cell, .zk-table--level-2-cell, .zk-table--level-1-cell, .zk-table--level-5-cell {
        position: relative;
      }

      .zk-table--level-4-cell::before, .zk-table--level-3-cell::before, .zk-table--level-2-cell::before, .zk-table--level-1-cell::before, .zk-table--level-5-cell::before {
        display: block;
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 15px;
        background: url('./images/file1.png') no-repeat 0 0;
        content: '';
        z-index: 1;
      }

      .actionBtn {
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
        margin-right: 16px;
      }
      .el-icon-circle-plus{
          // width: 18px;
          // height: 18px;
          font-size: 18px;
          margin-left:4px;
      }
      .el-icon-upload{
          // width: 18px;
          // height: 18px;
           font-size: 18px;
      }
      .el-icon-picture-outline{
          //  width: 18px;
          //   height: 18px;
           font-size: 18px;
      }
      .actionBtn1 {
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
        float: right;
        margin-right: 15px;
      }

      .editBtn {
        background: url('../../assets/edit.png') no-repeat;
      }

      .deleteBtnIcon {
        background: url('../../assets/delete.png') no-repeat;
      }

      .sortBtn {
        background: url('./images/sort.png') no-repeat 0 0;
      }
  }
</style>
