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
          <div v-if="!showCommonList" class="item-search">
                        <span class="title-right">
                                <input type="text" placeholder="请输入文件名称" v-model="searchTaskName"
                                       class="title-right-icon" @keyup.enter="getTaskList">
                                <span class="title-right-edit-icon el-icon-search" @click="getTaskList"></span>
                        </span>
            <span class="icon-type" @click="getGanttList"></span>
          </div>
        </div>
        <div v-if="!showCommonList">
          <div v-show="hiddenGanttList" class="taskWarp">
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
                :data="taskIndexData" :columns="columns" :max-height="props.height" :tree-type="props.treeType"
                :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType"
                :border="props.border" :is-fold="props.isFold" empty-text="正在加载..." @row-click="rowClick"
                @row-key="rowKey" :row-style="rowStyle" :row-class-name="rowClassName" @tree-icon-click="treeIconClick">
                <template slot="action" slot-scope="scope">
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
                  {{scope.row.realTaskEnd | timeChange()}}
                </template>
                <template slot="taskDuration" slot-scope="scope">
                  {{scope.row.taskDuration + '天'}}
                </template>
              </zk-table>
            </div>
          </div>
          <div v-show="!hiddenGanttList" class="taskWarp">
            <div class="taskHead">
              <div class="taskHeadLeft" @click="addTask">
                <i class="el-icon-plus" style="width:20px;"></i>新增任务
              </div>
              <div class="taskHeadRight">
                <span class="btn-operate">修改</span>
                <span class="btn-operate" @click="upgrade()">升级</span>
                <span class="btn-operate" @click="degrade()">降级</span>
                <span class="btn-operate" @click="swap()">上移</span>
                <span class="btn-operate" @click="swap()">下移</span>
                <span class="btn-operate">移动</span>
                <span class="btn-operate">删除</span>
                <span class="btn-operate" @click="userGroupTask()">群组权限</span>
                <span class="btn-operate" @click="exportProject()">导入MPP文件</span>
              </div>
            </div>
            <div class="taskBody">
              <div id="workSpace"
                   style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="gantEditorTemplates" style="display:none;">
      <div class="__template__" type="GANTBUTTONS"><!--
  <div class="ganttButtonBar noprint">
    <div class="buttons">
      <a href="https://gantt.twproject.com/"><img src="res/twGanttLogo.png" alt="Twproject" align="absmiddle" style="max-width: 136px; padding-right: 15px"></a>

      <button onclick="$('#workSpace').trigger('undo.gantt');return false;" class="button textual icon requireCanWrite" title="undo"><span class="teamworkIcon">&#39;</span></button>
      <button onclick="$('#workSpace').trigger('redo.gantt');return false;" class="button textual icon requireCanWrite" title="redo"><span class="teamworkIcon">&middot;</span></button>
      <span class="ganttButtonSeparator requireCanWrite requireCanAdd"></span>
      <button onclick="$('#workSpace').trigger('addAboveCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert above"><span class="teamworkIcon">l</span></button>
      <button onclick="$('#workSpace').trigger('addBelowCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert below"><span class="teamworkIcon">X</span></button>
      <span class="ganttButtonSeparator requireCanWrite requireCanInOutdent"></span>
      <button onclick="$('#workSpace').trigger('outdentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="un-indent task"><span class="teamworkIcon">.</span></button>
      <button onclick="$('#workSpace').trigger('indentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="indent task"><span class="teamworkIcon">:</span></button>
      <span class="ganttButtonSeparator requireCanWrite requireCanMoveUpDown"></span>
      <button onclick="$('#workSpace').trigger('moveUpCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move up"><span class="teamworkIcon">k</span></button>
      <button onclick="$('#workSpace').trigger('moveDownCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move down"><span class="teamworkIcon">j</span></button>
      <span class="ganttButtonSeparator requireCanWrite requireCanDelete"></span>
      <button onclick="$('#workSpace').trigger('deleteFocused.gantt');return false;" class="button textual icon delete requireCanWrite" title="Elimina"><span class="teamworkIcon">&cent;</span></button>
      <span class="ganttButtonSeparator"></span>
      <button onclick="$('#workSpace').trigger('expandAll.gantt');return false;" class="button textual icon " title="EXPAND_ALL"><span class="teamworkIcon">6</span></button>
      <button onclick="$('#workSpace').trigger('collapseAll.gantt'); return false;" class="button textual icon " title="COLLAPSE_ALL"><span class="teamworkIcon">5</span></button>

    <span class="ganttButtonSeparator"></span>
      <button onclick="$('#workSpace').trigger('zoomMinus.gantt'); return false;" class="button textual icon " title="zoom out"><span class="teamworkIcon">)</span></button>
      <button onclick="$('#workSpace').trigger('zoomPlus.gantt');return false;" class="button textual icon " title="zoom in"><span class="teamworkIcon">(</span></button>
    <span class="ganttButtonSeparator"></span>
      <button onclick="$('#workSpace').trigger('print.gantt');return false;" class="button textual icon " title="Print"><span class="teamworkIcon">p</span></button>
    <span class="ganttButtonSeparator"></span>
      <button onclick="ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();return false;" class="button textual icon requireCanSeeCriticalPath" title="CRITICAL_PATH"><span class="teamworkIcon">&pound;</span></button>
    <span class="ganttButtonSeparator requireCanSeeCriticalPath"></span>
      <button onclick="ge.splitter.resize(.1);return false;" class="button textual icon" ><span class="teamworkIcon">F</span></button>
      <button onclick="ge.splitter.resize(50);return false;" class="button textual icon" ><span class="teamworkIcon">O</span></button>
      <button onclick="ge.splitter.resize(100);return false;" class="button textual icon"><span class="teamworkIcon">R</span></button>
      <span class="ganttButtonSeparator"></span>
      <button onclick="$('#workSpace').trigger('fullScreen.gantt');return false;" class="button textual icon" title="FULLSCREEN" id="fullscrbtn"><span class="teamworkIcon">@</span></button>
      <button onclick="ge.element.toggleClass('colorByStatus' );return false;" class="button textual icon"><span class="teamworkIcon">&sect;</span></button>

    <button onclick="editResources();" class="button textual requireWrite" title="edit resources"><span class="teamworkIcon">M</span></button>
      &nbsp; &nbsp; &nbsp; &nbsp;
    <button onclick="saveGanttOnServer();" class="button first big requireWrite" title="Save">Save</button>
    <button onclick='newProject();' class='button requireWrite newproject'><em>clear project</em></button>
    <button class="button login" title="login/enroll" onclick="loginEnroll($(this));" style="display:none;">login/enroll</button>
    <button class="button opt collab" title="Start with Twproject" onclick="collaborate($(this));" style="display:none;"><em>collaborate</em></button>
    </div></div>
  --></div>

      <div class="__template__" type="TASKSEDITHEAD"><!--
  <table class="gdfTable" cellspacing="0" cellpadding="0">
    <thead>
    <tr style="height:40px">
      <th class="gdfColHeader" style="width:35px; border-right: none"></th>
      <th class="gdfColHeader" style="width:25px;"></th>
      <th class="gdfColHeader gdfResizable" style="width:100px;">code/short name</th>
      <th class="gdfColHeader gdfResizable" style="width:300px;">name</th>
      <th class="gdfColHeader"  align="center" style="width:17px;" title="Start date is a milestone."><span class="teamworkIcon" style="font-size: 8px;">^</span></th>
      <th class="gdfColHeader gdfResizable" style="width:80px;">start</th>
      <th class="gdfColHeader"  align="center" style="width:17px;" title="End date is a milestone."><span class="teamworkIcon" style="font-size: 8px;">^</span></th>
      <th class="gdfColHeader gdfResizable" style="width:80px;">End</th>
      <th class="gdfColHeader gdfResizable" style="width:50px;">dur.</th>
      <th class="gdfColHeader gdfResizable" style="width:20px;">%</th>
      <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:50px;">depe.</th>
      <th class="gdfColHeader gdfResizable" style="width:1000px; text-align: left; padding-left: 10px;">assignees</th>
    </tr>
    </thead>
  </table>
  --></div>

      <div class="__template__" type="TASKROW"><!--
  <tr id="tid_(#=obj.id#)" taskId="(#=obj.id#)" class="taskEditRow (#=obj.isParent()?'isParent':''#) (#=obj.collapsed?'collapsed':''#)" level="(#=level#)">
    <th class="gdfCell edit" align="right" style="cursor:pointer;"><span class="taskRowIndex">(#=obj.getRow()+1#)</span> <span class="teamworkIcon" style="font-size:12px;" >e</span></th>
    <td class="gdfCell noClip" align="center"><div class="taskStatus cvcColorSquare" status="(#=obj.status#)"></div></td>
    <td class="gdfCell"><input type="text" name="code" value="(#=obj.code?obj.code:''#)" placeholder="code/short name"></td>
    <td class="gdfCell indentCell" style="padding-left:(#=obj.level*10+18#)px;">
      <div class="exp-controller" align="center"></div>
      <input type="text" name="name" value="(#=obj.name#)" placeholder="name">
    </td>
    <td class="gdfCell" align="center"><input type="checkbox" name="startIsMilestone"></td>
    <td class="gdfCell"><input type="text" name="start"  value="" class="date"></td>
    <td class="gdfCell" align="center"><input type="checkbox" name="endIsMilestone"></td>
    <td class="gdfCell"><input type="text" name="end" value="" class="date"></td>
    <td class="gdfCell"><input type="text" name="duration" autocomplete="off" value="(#=obj.duration#)"></td>
    <td class="gdfCell"><input type="text" name="progress" class="validated" entrytype="PERCENTILE" autocomplete="off" value="(#=obj.progress?obj.progress:''#)" (#=obj.progressByWorklog?"readOnly":""#)></td>
    <td class="gdfCell requireCanSeeDep"><input type="text" name="depends" autocomplete="off" value="(#=obj.depends#)" (#=obj.hasExternalDep?"readonly":""#)></td>
    <td class="gdfCell taskAssigs">(#=obj.getAssigsString()#)</td>
  </tr>
  --></div>

      <div class="__template__" type="TASKEMPTYROW"><!--
  <tr class="taskEditRow emptyRow" >
    <th class="gdfCell" align="right"></th>
    <td class="gdfCell noClip" align="center"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell requireCanSeeDep"></td>
    <td class="gdfCell"></td>
  </tr>
  --></div>

      <div class="__template__" type="TASKBAR"><!--
  <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)" >
    <div class="layout (#=obj.hasExternalDep?'extDep':''#)">
      <div class="taskStatus" status="(#=obj.status#)"></div>
      <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);"></div>
      <div class="milestone (#=obj.startIsMilestone?'active':''#)" ></div>

      <div class="taskLabel"></div>
      <div class="milestone end (#=obj.endIsMilestone?'active':''#)" ></div>
    </div>
  </div>
  --></div>


      <div class="__template__" type="CHANGE_STATUS"><!--
    <div class="taskStatusBox">
    <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="Active"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="Completed"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="Failed"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="Suspended"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_WAITING" title="Waiting" style="display: none;"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="Undefined"></div>
    </div>
  --></div>




      <div class="__template__" type="TASK_EDITOR"><!--
  <div class="ganttTaskEditor">
    <h2 class="taskData">Task editor</h2>
    <table  cellspacing="1" cellpadding="5" width="100%" class="taskData table" border="0">
          <tr>
        <td width="200" style="height: 80px"  valign="top">
          <label for="code">code/short name</label><br>
          <input type="text" name="code" id="code" value="" size=15 class="formElements" autocomplete='off' maxlength=255 style='width:100%' oldvalue="1">
        </td>
        <td colspan="3" valign="top"><label for="name" class="required">name</label><br><input type="text" name="name" id="name"class="formElements" autocomplete='off' maxlength=255 style='width:100%' value="" required="true" oldvalue="1"></td>
          </tr>


      <tr class="dateRow">
        <td nowrap="">
          <div style="position:relative">
            <label for="start">start</label>&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="startIsMilestone" name="startIsMilestone" value="yes"> &nbsp;<label for="startIsMilestone">is milestone</label>&nbsp;
            <br><input type="text" name="start" id="start" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
            <span title="calendar" id="starts_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>          </div>
        </td>
        <td nowrap="">
          <label for="end">End</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="checkbox" id="endIsMilestone" name="endIsMilestone" value="yes"> &nbsp;<label for="endIsMilestone">is milestone</label>&nbsp;
          <br><input type="text" name="end" id="end" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
          <span title="calendar" id="ends_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>
        </td>
        <td nowrap="" >
          <label for="duration" class=" ">Days</label><br>
          <input type="text" name="duration" id="duration" size="4" class="formElements validated durationdays" title="Duration is in working days." autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DURATIONDAYS">&nbsp;
        </td>
      </tr>

      <tr>
        <td  colspan="2">
          <label for="status" class=" ">status</label><br>
          <select id="status" name="status" class="taskStatus" status="(#=obj.status#)"  onchange="$(this).attr('STATUS',$(this).val());">
            <option value="STATUS_ACTIVE" class="taskStatus" status="STATUS_ACTIVE" >active</option>
            <option value="STATUS_WAITING" class="taskStatus" status="STATUS_WAITING" >suspended</option>
            <option value="STATUS_SUSPENDED" class="taskStatus" status="STATUS_SUSPENDED" >suspended</option>
            <option value="STATUS_DONE" class="taskStatus" status="STATUS_DONE" >completed</option>
            <option value="STATUS_FAILED" class="taskStatus" status="STATUS_FAILED" >failed</option>
            <option value="STATUS_UNDEFINED" class="taskStatus" status="STATUS_UNDEFINED" >undefined</option>
          </select>
        </td>

        <td valign="top" nowrap>
          <label>progress</label><br>
          <input type="text" name="progress" id="progress" size="7" class="formElements validated percentile" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="PERCENTILE">
        </td>
      </tr>

          </tr>
          <tr>
            <td colspan="4">
              <label for="description">Description</label><br>
              <textarea rows="3" cols="30" id="description" name="description" class="formElements" style="width:100%"></textarea>
            </td>
          </tr>
        </table>

    <h2>Assignments</h2>
  <table  cellspacing="1" cellpadding="0" width="100%" id="assigsTable">
    <tr>
      <th style="width:100px;">name</th>
      <th style="width:70px;">Role</th>
      <th style="width:30px;">est.wklg.</th>
      <th style="width:30px;" id="addAssig"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
    </tr>
  </table>

  <div style="text-align: right; padding-top: 20px">
    <span id="saveButton" class="button first" onClick="$(this).trigger('saveFullEditor.gantt');">Save</span>
  </div>

  </div>
  --></div>



      <div class="__template__" type="ASSIGNMENT_ROW"><!--
  <tr taskId="(#=obj.task.id#)" assId="(#=obj.assig.id#)" class="assigEditRow" >
    <td ><select name="resourceId"  class="formElements" (#=obj.assig.id.indexOf("tmp_")==0?"":"disabled"#) ></select></td>
    <td ><select type="select" name="roleId"  class="formElements"></select></td>
    <td ><input type="text" name="effort" value="(#=getMillisInHoursMinutes(obj.assig.effort)#)" size="5" class="formElements"></td>
    <td align="center"><span class="teamworkIcon delAssig del" style="cursor: pointer">d</span></td>
  </tr>
  --></div>



      <div class="__template__" type="RESOURCE_EDITOR"><!--
  <div class="resourceEditor" style="padding: 5px;">

    <h2>Project team</h2>
    <table  cellspacing="1" cellpadding="0" width="100%" id="resourcesTable">
      <tr>
        <th style="width:100px;">name</th>
        <th style="width:30px;" id="addResource"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
      </tr>
    </table>

    <div style="text-align: right; padding-top: 20px"><button id="resSaveButton" class="button big">Save</button></div>
  </div>
  --></div>



      <div class="__template__" type="RESOURCE_ROW"><!--
  <tr resId="(#=obj.id#)" class="resRow" >
    <td ><input type="text" name="name" value="(#=obj.name#)" style="width:100%;" class="formElements"></td>
    <td align="center"><span class="teamworkIcon delRes del" style="cursor: pointer">d</span></td>
  </tr>
  --></div>


    </div>

    <div :class="[{'box-right-active':screenLeft.show},'box-right-container']" v-if="!showCommonList">
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
      <div id="box-right" v-if="screenLeft.item == 1">
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
            <button class="deleteBtn actionBtn1" @click="deleteLinkType(item.linkTaskId)"></button>
          </li>
        </ul>
      </div>
      <div id="box-right" v-show="taskId" v-if="screenLeft.item == 2">
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
                <i class="icon-goujian icon-detial" @click="showDetialList(item.main)"></i>
                <i class="icon-goujian icon-QRcode" @click="qrcode(item.main.pkId)"></i>
                <i class="icon-goujian icon-location" @click="location()"></i>
                <i class="icon-goujian icon-delete" @click="deleteAssociationList(item.main.pkId)"></i>
              </p>
              <p class="item-detial">
                <span class="detial-text-name">ID :</span>
                <span class="detial-text-value" v-text="item.main.pkId"></span>
              </p>
              <p class="item-detial">
                <span class="detial-text-name">状态 :</span>
                <span class="detial-text-value"
                      v-text="parseMStatus(item.main.mStatus)+'('+item.main.mStatus+')'"></span>
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
          <h3 class="header-attribute" style="margin-top:15px;">
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
      <div id="box-right1" v-if="screenLeft.item == 3">
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
                <button class="deleteBtn actionBtn1" @click="deleteTaskResource(item.id)"></button>
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
            <li v-for="(item,index) in relaList" :key="index" class="item-label clearfix">
              <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.main.pkId, 7)" alt="">
              <div class="right">
                <p class="item-list clearfix">
                  <span class="text-left">清单ID：</span>
                  <span class="text-right" v-text="item.main.pkId"></span>
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">清单名称：</span>
                  <span class="text-right" v-text="item.main.mName"></span>
                </p>
                <p class="item-list clearfix">
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
                </p>
                <p class="item-list clearfix">
                  <span class="text-left">清单版本：</span>
                  <span class="text-right" v-text="item.main.mVersion"></span>
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
      <div class="el-dialog__footer">
        <div slot="footer" class="dialog-footer">
          <button class="editBtnS">网页预览</button>
          <button class="editBtnC">打印当前页标签</button>
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
                <option v-for="(item,index) in ugList" :key="index" :value="item.ugId" v-text="item.ugName"></option>
              </select>
            </div>
            <div class="editBodytwoRight">
              <label class="text1">负责人:</label>
              <select v-model="dutyUserId" class="selectGroup">
                <option value="0">请选择</option>
                <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId"
                        v-text="item.userName"></option>
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
        <div class="editBody">
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
                <option v-for="(item,index) in ugList" :key="index" :value="item.ugId" v-text="item.ugName"></option>
              </select>
            </div>
            <div class="editBodytwoRight">
              <label class="text1">负责人:</label>
              <select v-model="dutyUserId" class="selectGroup">
                <option value="0">请选择</option>
                <option v-for="(item,index) in userGroupUserList" :key="index" :value="item.userId"
                        v-text="item.userName"></option>
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
          <button class="editBtnS" @click="editTaskMakeSure">确定</button>
          <button class="editBtnC" @click="editTaskCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="添加前置任务" :visible.sync="addLinkDialog" @close="addLinkCancle">
        <div class="editBody">
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
      <el-dialog title="进度查询" width="530px" :visible.sync="progressSearchDialog" @close="progressSearchCancle">
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
          <button class="editBtnS" @click="addLinkMakeSure">着色状态</button>
          <button class="editBtnC" @click="progressSearchCancle">取消</button>
        </div>
      </el-dialog>
      <el-dialog title="产值查询" width="530px" :visible.sync="valueSearchDialog" @close="valueSearchCancle">
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
            <span class="upImgText">{{imageName}}</span>
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
            <span class="upImgText">{{imageName}}</span>
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
            <span class="upImgText">{{MppName}}</span>
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
                  <th>业务来源</th>
                  <th>业务状态</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in loadManifestList" :key="index" :class="[{'active':item.checked}]"
                    @click="checkItem(index)">
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
                      :expand-type="props.expandType" :is-fold="props.isFold" :show-index="props.showIndex"
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
                  <el-checkbox v-model="item.checkFlg" @change="checkFlgChange(index)" :value="item.ugId"></el-checkbox>
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
    <common-list v-on:back="backToH" :mId="checkList.pkId" rType="7" :bId='checkItem.pkId' :title="'构件量清单'"
                 v-if="showCommonList"></common-list>
  </div>
</template>

<script>
  import moment from 'moment';
  import axios from 'axios';
  //import $ from 'jquery';
  //引入gantt图
  // import './jQueryGantt/platform.css'
  // import './jQueryGantt/gantt.css'
  // import './jQueryGantt/ganttPrint.css'
  // import './jQueryGantt/libs/jquery/dateField/jquery.dateField.css'
  // import './jQueryGantt/libs/jquery/jquery.livequery.1.1.1.min.js'
  // import './jQueryGantt/libs/jquery/jquery.timers.js'
  // import './jQueryGantt/libs/utilities.js'
  // import './jQueryGantt/libs/forms.js'
  //  import './jQueryGantt/libs/date.js'
  // import './jQueryGantt/libs/dialogs.js'
//  import './jQueryGantt/libs/layout.js'
  // import './components/SchedulePlan/jQueryGantt/libs/i18nJs.js'
  // import './jQueryGantt/libs/jquery/dateField/jquery.dateField.js'
//  import './jQueryGantt/libs/jquery/JST/jquery.JST.js'
  // import './jQueryGantt/libs/jquery/svg/jquery.svg.min.js'
  // import './jQueryGantt/libs/jquery/svg/jquery.svgdom.1.8.js'
  // import {GanttMaster} from './jQueryGantt/ganttMaster.js'

  //import { SVGGantt, CanvasGantt, StrGantt } from 'gantt';
  import commonList from './qingdan.vue'
  import '../ManageCost/js/jquery-1.8.3.js'
  import '../ManageCost/js/date.js'

  export default {
    name: 'taskIndex',
    data() {
      return {
        showCommonList: false,//显示清单
        checkList: '',
        labelListShow: false,//二维码显示
        ListHeaderShow: false,//列表头
        tvValue: 0,//silder初始值
        radio: 1,
        token: '',
        projId: '',
        BDMSUrl: '',
        selectUgId: '',//所选择群组id
        taskNameStr: '',
        ugList: '',//群组列表
        ugList1: [],//群组列表1
        entityRelationList: [],//获取绑定实体关系分组
        relaList: [],
        mId: '',
        bId: '',
        bType: '',
        groupFlag: false,
        checkFlg: false,
        tgList: '',
        taskIndexData: [],
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
        taskParId: '',
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
        taskParId: '',
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
            show: true,
            type: 'template',
            template: 'action',
            minWidth: '280px'

          },
          {
            label: '组别',
            prop: 'taskGroupName',
            show: true,
            minWidth: '60px'
          },
          {
            label: '序号',
            prop: 'taskId',
            show: true,
            minWidth: '60px'

          },
          {
            label: '编号',
            prop: 'completeTaskCode',
            show: true,

          },
          {
            label: '优先级',
            prop: 'taskPriority',
            show: true,

          },
          {
            label: '里程碑',
            prop: 'taskType',
            show: true,
          },
          {
            label: '计划开始',
            prop: 'taskStart',
            show: true,
            type: 'template',
            template: 'taskStart',
            minWidth: '100px'

          },
          {
            label: '计划结束',
            prop: 'taskEnd',
            show: true,
            type: 'template',
            template: 'taskEnd',
            minWidth: '100px'
          },
          {
            label: '实际开始',
            prop: 'realTaskStart',
            show: true,
            type: 'template',
            template: 'realTaskStart',
            minWidth: '90px'
          },
          {
            label: '实际结束',
            prop: 'realTaskEnd',
            show: true,
            type: 'template',
            template: 'realTaskEnd',
            minWidth: '90px'
          },
          {
            label: '工作日',
            prop: 'taskDuration',
            show: true,
            type: 'template',
            template: 'taskDuration',
          },
          {
            label: '计划状态',
            prop: 'taskStatusStr',
            show: true,

          },
          {
            label: '实际状态',
            prop: 'actualStatusStr',
            show: true,
          },
          {
            label: '比对状态',
            prop: 'verifyStatusStr',
            show: true,
          },
          {
            label: '负责群组',
            prop: 'taskUserGroupName',
            show: true,
          },
          {
            label: '负责人',
            prop: 'dutyUserName',
            show: true,
          },
          {
            label: '计划人',
            prop: 'createUserName',
            show: true,
          },
          {
            label: '操作',
            prop: 'operator',
            type: 'template',
            show: true,
            template: 'action',
            width: '150px'
          }
        ],
        //以下为甘特图数据
        hiddenGanttList: true,
        xmlDoc: '',
        a: [],
        colorValueList: [],
        colorValueList1: [],
        ge:"",
      }
    },
    created() {
      var vm = this
      this.projId = localStorage.getItem('projId');
      this.token = localStorage.getItem('token');
      vm.userId = localStorage.getItem('userid');
      vm.BDMSUrl = vm.$store.state.BDMSUrl;
      vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
      this.getTaskIndex();

      // this.getTaskList();
    },
    mounted() {

    },
    watch: {
      selectUgId: function (val) {
        var vm = this
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
      //场景选择
      siteSearch() {
        alert("虚拟场景面板未打开，请打开左侧虚拟场景面板。")
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

      //获取工程任务页面
      getTaskIndex() {
        axios({
          method: 'get',
          url: this.BDMSUrl + '/project2/schedule/taskIndex',
          headers: {
            'token': this.token
          },
          params: {
            projId: this.projId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.selectUgId = response.data.rt.selectUgId;
            this.ugList = response.data.rt.ugList;
            this.tgList = response.data.rt.tgList;
          } else if (response.data.cd == '-1') {
            alert(response.data.msg)
          }
        })
      },

      //获取工程列表
      getTaskList() {
        //   console.log(this.selectUgId);
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/list',
          headers: {
            'token': this.token
          },
          params: {
            ugId: this.selectUgId,
            taskName: this.searchTaskName
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.taskIndexData = response.data.rt;
            if (this.taskIndexData == null) {
              this.taskIndexData = [];
            }
            console.log(JSON.stringify(this.taskIndexData));
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      taskUserGroupChange() {
        this.ugList.forEach((item) => {
          if (item.ugId == this.taskUserGroup) {
            this.taskUserGroup = item.ugId
          }
        })
        this.getUserGroupUsers()
      },
      //获取群组成员数据
      getUserGroupUsers() {
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/getUserGroupUsers',
          headers: {
            'token': this.token
          },
          params: {
            ugId: this.taskUserGroup
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/verifyList',
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
            this.verifyList = this.verifyLists.verifyList
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //点击zk-tree获取id
      rowClick(row, rowIndex) {
        console.log(row);
        console.log(rowIndex);
        //   if(row.isTrusted==true){
        //       console.log("选中")
        //   }
        // if(row.path)
        // if(row.isTrusted==true){
        //     row.path[2].bgColor='red';
        // }
        // console.log(row.path[2]);
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item, index) => {
          // console.log(index);
          if (item._isHover == true) {
            this.taskId = item.taskId
            this.taskParId = item.taskParId
          }
        })
        this.getTask();
        this.getVerifyList();
        this.getEntityRelation();
        this.getTaskResourceTaskList();

      },
      rowKey(row, rowIndex) {
        console.log(row);
        console.log(rowIndex);
      },
      rowStyle(row, rowIndex) {
        var vm = this;
        if (row.children == null) {
          //  console.log(row.colorValue);
          //  console.log("****:"+(row.colorValue));
          var color = vm.selectColor(parseInt(row.colorValue));
          return 'background:' + color;
        }
      },
      //根据工程获取状态颜色
      getProjectStatusColor() {

        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/getProjectStatusColor',
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
        // console.log(JSON.stringify(rowIndex));
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.taskId = item.taskId
            this.taskParId = item.taskParId
            this.tableCollapse = item._isFold == true ? 1 : 0;
          }
        })
        //  console.log(this.tableCollapse)
      },

      //获取资源类别
      getResourceTypeList() {
        axios({
          method: "post",
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/resourceType/getResouceType',
          headers: {
            'token': this.token
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.resourceTypeList = response.data.rt;
            //   console.log(JSON.stringify(this.resourceTypeList));
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/getResouceType',
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
            //   console.log(this.taskresourceTypeList);
          } else if (response.data.cd == "-1") {
            alert(resposne.data.msg)
          }
        })
      },
      //获取任务资源列表
      getTaskResourceTaskList() {
        axios({
          method: "post",
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/getTaskResourceTask',
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
        if (this.taskParId == '') {
          this.taskParId = 0;
        }
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/taskUserGroupList',
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
                  var num=this.ugList1[0].ugId;
                  this.groupIds.push(num.toString());
                  console.log(JSON.stringify(this.editTaskUserGroupList));
              }else if(response.data.cd=="-1"){
                  alert(response.data.msg)
              }
          })
      },
      checkFlgChange(index){
        //    var groupIdList=[];
        var str=this.ugList1[index].ugId
          this.groupIds.push(str.toString());
          console.log(this.groupIds);
      },
      userGroupTaskMakeSure(){
          this.taskId=this.editTaskUserGroupList.taskId;
          this.taskName=this.editTaskUserGroupList.taskName;
          this.taskParId=this.taskInformationList.taskParId;
          console.log(this.editTaskUserGroupList);
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
                    taskParId:this.taskParId
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

      //查询清单列表
      loadManifestSearch() {
        if (this.startDate) {
          this.startDate = moment(this.startDate).format("YYYY-MM-DD")
        } else {
          this.startDate = '';
        }
        if (this.endDate) {
          this.endDate = moment(this.endDate).format("YYYY-MM-DD")
        } else {
          this.endDate = ''
        }
        var formData = new FormData();
        formData.append('relaType', this.relaTypeValue);
        formData.append('serviceState', this.serviceStateValue);
        formData.append('detailName', this.detailName);
        formData.append('startDate', this.startDate);
        formData.append('endDate', this.endDate);
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/report/loadManifest',
          headers: {
            //   'content-type': 'application/json;charset=UTF-8',
            'token': this.token
          },
          params: {
            projectId: this.projId,
            page: this.pageDetial_1.currentPage,
            rows: this.pageDetial_1.pagePerNum,
            type: 4,
          },
          data: formData
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
      //选择文件
      checkItem(val) {
        var vm = this;
        var fileCheckList = [];
        for (var i = 0; i < vm.loadManifestList.length; i++) {
          vm.$set(vm.loadManifestList[i], 'checked', false)
        }
        vm.$set(vm.loadManifestList[val], 'checked', true)
        vm.checkedItem = vm.loadManifestList[val]
        // console.log(JSON.stringify(vm.checkedItem))
      },
      //加载清单列表
      getLoadManifest() {
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/loadManifest',
          headers: {
            'token': this.token
          },
          params: {
            projectId: this.projId,
            page: this.pageDetial_1.currentPage,
            rows: this.pageDetial_1.pagePerNum,
            type: 4
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
      //获取绑定实体关系分组、绑定bim关系
      getEntityRelation() {
        axios({
          method: 'get',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/entityRelation/list',
          headers: {
            'token': this.token
          },
          params: {
            relaId: this.taskId,
            relaType: 2 //获取时为2
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.entityRelationList = response.data.rt;
            this.relaList = this.entityRelationList.relaList;
            //   console.log(JSON.stringify(this.relaList)+'bim');
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //获取工程任务详细信息
      getTask() {
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/' + this.taskId,
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
      //点击新增任务
      addTask() {
        this.addTaskDialog = true;
        this.taskType = this.taskTypeList[0].value;
        this.taskPriority = this.taskPriorityList[0].value;
        this.taskGroup = '0';
        this.taskUserGroup = '0';
        this.dutyUserId = '0';
        if (this.taskInformationList) {
          this.taskParId = this.taskInformationList.taskId;
          this.lastNodeName = this.taskInformationList.taskName;
        } else {
          this.taskParId = 0;
          this.lastNodeName = '无';
        }
        //   this.getTaskUserGroupList();
      },
      addTaskMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/add',
          headers: {
            'token': this.token
          },
          params: {
            currentGroupId: this.taskGroup
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
            taskParId: this.taskParId,
            id: '',
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.addTaskDialog = false;
            this.getTaskList();
            this.taskName = '';
            this.taskStart = '';
            this.taskEnd = '';
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })

      },
      timeChange(val) {
        if (val) {
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
        this.selectRowList = rowIndex;
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.linkTaskId = item.taskId
            // console.log(this.linkTaskId)
          }
        })
      },
      removeTaskRowClick(row, rowIndex) {
        this.selectRowList = rowIndex;
        //   console.log(JSON.stringify(this.selectRowList))
        this.selectRowList.forEach((item) => {
          if (item._isHover == true) {
            this.curUgId = item.taskUserGroup
            this.removeTaskId = item.taskId
            // console.log(this.removeTaskId)
          }
        })
      },
      addColorStatus(){
          alert('虚拟场景面板未打开，请打开左侧虚拟场景面板。')
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/deleteLink',
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
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/update',
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
            this.getTaskList();
            this.taskName = '';
            this.taskStart = '';
            this.taskEnd = '';
            this.id = '';
            this.taskType = '';
            this.taskUserGroup = '';
            this.taskParId = '';
            this.taskPriority = '';
            this.dutyUserId = '';
            this.taskGroup = '';
          } else {
            alert(response.data.msg)
          }
        })

      },
      editTaskCancle() {
        this.editTaskDialog = false;
        this.taskName = '';
        this.taskStart = '';
        this.taskEnd = '';
        this.id = '';
        this.taskType = '';
        this.taskUserGroup = '';
        this.taskParId = '';
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
      deleteTaskMakeSure() {
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/delete',
          headers: {
            'token': this.token
          },
          params: {
            taskId: this.taskId,
            type: this.type
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.getTaskList();
            this.taskId = '';
            this.Type = null;
            this.showText = false;
            this.showText1 = false;
            this.deleteTaskDialog = false;
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
          alert('移动任务不能是当前任务本身')
          return;
        }
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/degrade',
          headers: {
            'token': this.token
          },
          params: {
            prevTaskId: this.taskId,
            taskId: this.removeTaskId,
            curUgId: this.curUgId
          }
        }).then(response => {
          if (response.data.cd == "0") {
            this.removeTaskDialog = false;
            this.getTaskList();
            this.removeTaskId = '';
          } else if (response.data.cd == "-1") {
            alert(response.data.msg)
          }
        })
      },
      //进度查询
      progressSearch() {
        this.progressSearchDialog = true;
        this.selectType = this.TypeList[0].value;
        this.radio = 2;
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/taskProgressSearch',
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
                this.editTaskUserGroup();
                // this.rowClick(row,rowIndex);
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
            this.exportProjectDialog=true;

      },
      exportProjectMakeSure() {
        if (this.taskId == '') {
          this.taskId = 0
        }
        var formData = new FormData();
        formData.append('exportProject', this.uploadfilesList);
        axios({
          method: 'post',
          url: this.BDMSUrl + '/project2/schedule/addTaskByMpp',
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
        //点击添加核实任务
        addVerifyRecord(){
            this.addVerifyTaskDialog=true;
        },
        //确认添加核实任务
        addVerifyTaskMakeSure(){
            console.log(this.verifyStartTime);
            var myDate = new Date();
            if(this.verifyStartTime>myDate){
                alert('核实日期不能超过当前日期!')
                return;
            }

            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/task/addVerify',
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
                this.getVerifyList();
                this.tvValue=0;
                this.verifyStartTime='';
                this.addVerifyTaskDialog=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        addVerifyTaskCancle(){
           this.verifyStartTime='';
            this.addVerifyTaskDialog=false;
        },
        //点击关联清单
        associationList(){
            this.addAssociationListDialog=true;
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
        //添加关联清单确认
        addAssociationListMakeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'manifest2/businessBindManifestAndUpdateStatus',
                headers:{
                    'token':this.token
                },
                params:{
                    bId:this.taskId,
                    bType:this.checkedItem.type,
                    mId:this.checkedItem.detailId,
                    currState:this.checkedItem.serviceState,
                    currOperate:41,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd=='0'){

                    this.addAssociationListDialog=false;
                    this.getLoadManifest();
                    this.getEntityRelation();
                    this.checkedItem={};
                    this.loadManifestList=[];
                    alert(response.data.msg);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

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
        this.relaList.forEach((item) => {
          if (item.main.pkId == val) {
            this.relaList = [];
            this.relaList.push(item);
          }
        })
      },
      labelListCancle() {
        var vm = this
        vm.labelListShow = false
      },
      //关联清单列单的定位
      location() {
        alert("虚拟场景面板未打开，请打开左侧虚拟场景面板。")
      },
      //将清单与任务解除关联关系
      deleteAssociationList(num) {
        this.deleteAssociationListDialog = true;
        this.relaList.forEach((item) => {
          if (item.main.pkId == num) {
            this.mId = item.main.pkId
          }
        })
      },
      deleteAssociationListMakeSure() {
        axios({
          method: 'get',
          url: this.BDMSUrl + '/project2/schedule/deleteMBRelation',
          headers: {
            'token': this.token
          },
          params: {
            // projId:this.projId,
            mId: this.mId,
            bId: this.taskId,
            bType: 2 //业务类型
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/deleteResouceTask',
          headers: {
            'token': this.token
          },
          params: {
            id: this.selectId
          }
        }).then(response => {
          if (response.data.cd == '0') {
            this.getTaskResourceTaskList();
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/addResouceTask',
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
            this.getTaskResourceTaskList();
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
      },
      uploadFileMakeSure() {
        var returnUrl = this.BDMSUrl + '/project2/schedule/task/fileUpload?ugId=' + this.selectUgId + '&id=' + this.taskId;
        returnUrl = encodeURIComponent(returnUrl);
        var formData = new FormData();
        formData.append('token', this.token);
        formData.append('projId', this.projId);
        formData.append('userId', this.userId);
        // formData.append('id',this.taskId);
        formData.append('type', 1);
        formData.append('file', this.uploadfilesList);
        // formData.append('ugId',);
        formData.append('modelCode', '005');
        formData.append('returnUrl', returnUrl);
        axios({
          method: 'post',
          url: this.QJFileManageSystemURL + 'uploading/uploadFileInfo',

          headers: {
            'Content-Type': 'multipart/form-data'
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
        console.log(extName);
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
      },
      uploadPicMakeSure() {
        var returnUrl = this.BDMSUrl + '/project2/schedule/task/attachmentUpload?id=' + this.taskId;
        returnUrl = encodeURIComponent(returnUrl);
        var formData = new FormData();
        formData.append('token', this.token);
        formData.append('projId', this.projId);
        // formData.append('id',this.taskId);
        formData.append('type', 1);
        formData.append('userId', this.userId);
        formData.append('file', this.uploadfilesList);
        // formData.append('ugId',this.selectUgId);
        formData.append('modelCode', '005');
        formData.append('returnUrl', returnUrl);
        axios({
          method: 'post',
          url: this.QJFileManageSystemURL + 'uploading/uploadFileInfo',

          headers: {
            'Content-Type': 'multipart/form-data'

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
        window.open(this.QJFileManageSystemURL + filePath + "/preview");
      },
      //下载
      downLoad(filePath) {
        var vm = this
        window.open(vm.QJFileManageSystemURL + filePath + '');
      },
      //查看图片
      searchsPic(filePath) {
        window.open(this.QJFileManageSystemURL + filePath + "/preview");
      },
      //下载图片
      downLoadPic(filePath) {
        var vm = this
        window.open(vm.QJFileManageSystemURL + filePath + '');
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
          url: this.BDMSUrl + '/project2/schedule/' + this.projId + '/task/deleteAttach',
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
        this.updateGanttCollapse();
        this.initGantt();
      },
      initGantt() {
        this.ge = new GanttMaster(this);
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
          url: this.BDMSUrl + '/project2/schedule/updateGanttCollapse/' + this.projId,
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
        var ret= {"tasks":    [
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
<style lang="less" scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  li {
    list-style: none;
  }

  .show {
    display: block !important;
  }

  #taskIndex {

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
      display: block;
      width: 168px;
      height: 30px;
      position: fixed;
      top: 77px;
      z-index: 1000;
      right: 24px;
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
        top: 12px;
        right: 11px;
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
    .taskWarp {
      width: 96%;
      margin-top: 20px;
      padding: 12px;
      margin: 0 auto;
      box-sizing: border-box;
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
        margin-top: 70px;
        width: 100%;
        overflow-y: auto;
      }
    }
    // 左侧
    .box-left-container {
      display: block;
      position: fixed;
      top: 115px;
      left: 26px;
      bottom: 0;
      right: 225px;
      // z-index: 1001;
      transition: all ease .5s;
      overflow: auto;

    }
    .box-left-active {
      right: 0px;
      transition: all ease .5s;
      .icon-right {
        transform: rotateZ(180deg) !important;
        transition: all ease .5s;
      }
    }
    // 右侧
    .box-right-container {
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
          position: relative;
          cursor: pointer;
          &::after {
            display: block;
            position: absolute;
            bottom: -7px;
            width: 24px;
            height: 13px;
            background: #fafafa;
            border-bottom: 1px solid #cccccc;
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
          position: relative;
          cursor: pointer;
          &::after {
            display: block;
            position: absolute;
            bottom: -7px;
            width: 24px;
            height: 13px;
            background: #fafafa;
            border-bottom: 1px solid #cccccc;
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
      #box-right {
        padding: 19px 13px 0 10px;
        #taskInformation {
          display: none;
          > li:last-of-type {
            padding-bottom: 7px;
          }
        }
        .header-attribute {
          font-size: 14px;
          color: #333333;
          line-height: 14px;
          padding-bottom: 4px;
          border-bottom: 1px solid #e6e6e6;
          text-align: left;
          .trrangle {
            display: inline-block;
            width: 0px;
            height: 0px;
            border-left: 10px solid #fc3439;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
          }
          .actionIcon {
            display: block;
            float: right;
            width: 12px;
            height: 12px;
            cursor: pointer;
          }
          .icon-dropDown {
            display: block;
            width: 12px;
            height: 12px;
            background: url('./images/arror.png') no-repeat 0 0;
            float: right;
            cursor: pointer;
            transition: all ease .2s;
            transform: rotate(180deg);
          }
          .icon-dropDown1 {
            display: block;
            width: 12px;
            height: 12px;
            margin-right: 5px;
            float: right;
            cursor: pointer;
            transition: all ease .2s;
          }
          .active {
            transform: rotate(0deg);
          }
        }
        .header-attribute:nth-last-of-type(2) {
          margin-top: 20px;
        }
        .header-attribute:nth-last-of-type(3) {
          margin-top: 20px;
        }
        .header-attribute:nth-last-of-type(1) {
          margin-top: 20px;
        }
        .uploadFileUl {
          display: none;
          > li:last-of-type {
            padding-bottom: 7px;
          }
          width: 100%;
          overflow-y: auto;
          padding: 5px;
          .uploadFileLi {
            height: 32px;
            font-size: 12px;
            line-height: 30px;
            color: #999999;
            text-align: left;
            position: relative;
            &:hover {
              background: #fafafa;
              .icon-goujian {
                display: inline-block;
              }
            }
            .uploadFileText {
              max-width: 160px;
              float: left;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow-x: hidden;
            }
            .icon {
              display: inline-block;
              height: 16px;
              position: absolute;
              right: 0px;
              top: 10px;
              .icon-goujian {
                float: left;
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
              .icon-download {
                background: url('./images/download.png') no-repeat 0 0;

                &:hover {
                  background: url('./images/download1.png') no-repeat 0 0;
                }
              }
              .icon-search {
                background: url('./images/search.png') no-repeat 0 0;
                &:hover {
                  background: url('./images/search1.png') no-repeat 0 0;
                }
              }
              .icon-delete {
                float: right;
                background: url('./images/delete.png') no-repeat 0 0;

                &:hover {
                  background: url('./images/delete1.png') no-repeat 0 0;
                }
              }
              i {
                margin-left: 3px;
              }
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
                                background: url('../ManageCost/images/add.png')no-repeat 0 0;
                                margin-right: 56px;
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
                                // display: inline-block;
                                //  float: left;
                            }
                            .detial-text-value{
                                // float: left;
                                // margin-left:-100px;
                                color: #333333;
                                width: 130px;
                                cursor: pointer;
                                overflow: hidden;
                                // overflow-x: hidden;
                                text-overflow: ellipsis;
                                // white-space: nowrap;
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
                        }

        }
      }
      #box-right1 {
        .addResourceType {
          .action {
            color: #78a0f8;
            margin-left: -153px;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          height: 30px;
          border-bottom: 1px solid #e6e6e6;
        }
        .resourceList {
          width: 100%;
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
                  height: 30px;
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
                  height: 30px;
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
    }
    .box-right-active {
      right: 0;
      transition: all ease .5s;
    }
    #edit {
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
              background: #fafafa;
              padding-left: 10px;
              margin-top: 5px;
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
              margin-top: 42px;
              height: 30px;
              float: left;

            }
            .endTime {
              margin-left: 26px;
              margin-top: 30px;
              height: 30px;
              float: left;

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
                tbody {

                  background: #fff;
                  tr {

                    td {
                      padding-left: 10px;
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
  }
  }
</style>

<style lang="less">
  // @import './jQueryGantt/platform.css';
  // @import './jQueryGantt/libs/jquery/dateField/jquery.dateField.css';
  // @import './jQueryGantt/gantt.css';
  // @import './jQueryGantt/ganttPrint.css';
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 12px;
  }

  // .resEdit {
  //     padding: 15px;
  //   }
  //   .resLine {
  //     width: 95%;
  //     padding: 3px;
  //     margin: 5px;
  //     border: 1px solid #d0d0d0;
  //   }
  // //   body {
  // //     overflow: hidden;
  // //   }
  //   .ganttButtonBar h1{
  //     color: #000000;
  //     font-weight: bold;
  //     font-size: 28px;
  //     margin-left: 10px;
  //   }

  #edit .bindListHead .bindListHeadRight .el-input__inner {
    width: 130px;
    height: 36px;
  }

  li {
    list-style: none;
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

  .zk-table {
    color: #333333;
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

  .deleteBtn {
    background: url('../../assets/delete.png') no-repeat;
  }

  .sortBtn {
    background: url('./images/sort.png') no-repeat 0 0;
  }

</style>
