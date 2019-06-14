<template>
    <div id="personalCalendar">
        <!-- <div style="width:900px;height:500px"></div> -->
        <div class="topHeader">
            <div id="item-box-file">
                <!-- <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item">  
                个人日历  
                </router-link>
                <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item">  
                资源计划  
                </router-link>
                <router-link :to="'/SchedulePlan/taskIndex'" class="label-item">  
                工程任务  
                </router-link>
                <router-link :to="'/SchedulePlan/calendarConfig'" class="label-item label-item-active">  
                更多配置  
                </router-link> -->
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
            <div class="content">
                <div class="work-content">
                    <div class="work-list-left">
                        <h5 class="workList"><img class=imgIcon src="./images/worklist.png">工程日历</h5>
                        <div class="calendarView">
                            <h2 class="calendarText">日历视图</h2>
                            <div class="calendarBox">
                                <div class="calendarLeft">
                                    <ul class="calendarSelect">
                                        <li :class="[{'calendarBody_active':currentStyle},'calendarHead']"><span>当前日历模板</span><i class=" poniter el-icon-plus" @click="addCalendarTemplate()"></i></li>
                                        <li :class="[{'calendarBody_active':item.id==isActive},'calendarBody']"   @click="checkedItem(item.id,index)"  v-for="(item,index) in calendarIndex"   :key="index" ><span v-text="item.tempName"></span><div class="editBtn" @click="edit(index)" title="修改"></div></li>
                                    </ul>
                                </div>
                                <div class="calendarRight">
                                    <div class="flex">
                                        <div>
                                        <calendar
                                            ref="calendar1"
                                            :multi="calendar1.multi"
                                            :zero="calendar1.zero"
                                            :events="calendar1.events" 
                                            :lunar="calendar1.lunar" 
                                            :value="calendar1.value" 
                                            :begin="calendar1.begin" 
                                            :end="calendar1.end" 
                                            :weeks="calendar1.weeks" 
                                            :months="calendar1.months" 
                                            ></calendar>
                                            <!-- <button @click="$refs.calendar1.setToday()">返回今天</button> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dataColor_legend">
                                <div class="dataColor1_content"><span class="dataColor1"></span>工作日</div>
                                <div class="dataColor2_content"><span class="dataColor2"></span>非工作日</div>
                                <div class="dataColor3_content"><span class="dataColor3"></span>例外日期</div>
                            </div>
                        </div>
                        <div class="work">
                            <h2 class="workdaySet"><span>工作周休息日设定</span><span id="add" @click="addweektime" ><i class=" poniter el-icon-plus" ></i>增加</span></h2>
                            <div class="tableBox">
                                <table class="workTable" border="1" width="100%">
                                    <thead class="head">
                                        <tr>
                                            <td width="12%"></td>
                                            <td width="22%">名称</td>
                                            <td width="22%">开始日期</td>
                                            <td width="22%">结束日期</td>
                                            <td width="22%">操作</td>
                                        </tr>
                                    </thead>
                                    <tbody class="body">
                                        <tr v-for="(item,index) in cwtList" :key="index">
                                            <td>
                                                <button v-show="item.cwtType==0" class="defaultdetailBtn actionBtn" title="修改" ></button>
                                                <button  v-show="item.cwtType==1" class="detailBtn actionBtn" title="修改"  @click="detailweektime(index)"></button>
                                            </td>
                                            <td v-text="item.cwtName"></td>
                                            <td><span v-show="item.cwtType==1" v-text="$options.filters.dataFrm(item.cwtStart)"></span></td>
                                            <td><span v-show="item.cwtType==1" v-text="$options.filters.dataFrm(item.cwtEnd)"></span></td>
                                            <td>
                                                <button class="editBtn actionBtn" title="修改" v-show="item.cwtType==1" @click="updateweektime(index)"></button>
                                                <button class="deleteBtn actionBtn" title="删除" v-show="item.cwtType==1"  @click="deleteWeekTime(index)"></button>
                                            </td>
                                        </tr>    
                                    </tbody>    
                                </table>
                                <div class="workList">
                                        <span>工作周内的休息日:</span>
                                        <div class="weekList">
                                            <table class="weekTable" border="1" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td v-for="(item,index) in weektimeList" :key="index" :class="{'datacolor':item.num==1}">{{item.text}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                </div>
                            </div>                                
                        </div> 
                            <div class="work">
                            <h2 class="workdaySet"><span>例外休息日设定</span><span id="add" @click="addExceptionDate"><i class=" poniter el-icon-plus"></i>增加</span></h2>
                            <div class="tableBox">
                                <table class="workTable" border="1" width="100%">
                                    <thead class="head">
                                        <tr>
                                            <td >名称</td>
                                            <td >重复方式</td>
                                            <td>参考日期</td>
                                            <td>例外类型</td>
                                            <td >开始日期</td>
                                            <td >结束日期</td>
                                            <td >操作</td>
                                        </tr>
                                    </thead>
                                    <tbody class="body">
                                        <tr v-for="(item,index) in cedList" :key="index">
                                            <td v-text="item.cedName"></td>
                                            <td>{{item.cedType | Type}}</td>
                                            <td v-text="$options.filters.dataFrm(item.cedStart)"></td>
                                            <td v-text="item.workDay==1?'工作日':'非工作日'"></td>
                                            <td v-text="$options.filters.dataFrm(item.cedStart)"></td>
                                            <td v-text="$options.filters.dataFrm(item.cedEnd)"></td>
                                            <td><button class="editBtn actionBtn" title="修改" @click="undateExceptionDate(index)"></button>
                                                <button class="deleteBtn actionBtn" @click="deleteExceptionDate(index)" title="删除"></button>
                                            </td>
                                        </tr>    
                                    </tbody>    
                                </table>
                            </div>                                
                        </div> 
                    </div>
                    <div class="work-task-right">
                        <h5 class="workList"><img class=imgIcon src="./images/worktask.png">工程任务</h5>
                        <div class="taskPriority">
                            <h2>任务优先级设置</h2>
                            <div class="priorityTab">
                                <table  border="1" width="100%">
                                    <tbody>
                                        <tr>
                                            <td v-for="(item,index) in priorityIndex" :class="{'Active':item.tptype<=tpType}"  @click="changePriority(item.tptype)" :value="item.tptype" :key="index" v-text="item.Index"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                        <div class="taskGroup">
                            <h2><span>任务组别设置</span><span id="add" @click="addTaskGroup"><i class=" poniter el-icon-plus"></i>增加</span></h2>
                            <div class="groupTab">
                                <table  border="1" width="100%">
                                    <thead class="head">
                                        <tr>
                                            <td width="60%">组别名称</td>
                                            <td width="20%">标记色</td>
                                            <td width="20%">操作</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in taskGroupList" :key="index"  >
                                            <td v-text="item.tgName"></td>
                                            <td v-html="$options.filters.colorView(item.tgColor)"></td>
                                            <td >
                                                <button class="editBtn actionBtn" title="修改" @click="editGroup(item.id)" v-show="item.tgName!='默认组别'&item.tgName!='订单跟踪'" ></button>
                                                <button class="deleteBtn actionBtn" title="删除" @click="deleteGroup(index)" v-show="item.tgName!='默认组别'&item.tgName!='订单跟踪'" ></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <!-- <div class="taskGroup">
                            <h2><span>资源类别设置</span><span id="add" @click="addResourceType"><i class=" poniter el-icon-plus" ></i>增加</span></h2>
                            <div class="groupTab">
                                <table  border="1" width="100%">
                                    <thead class="head">
                                        <tr>
                                            <td width="61%">资源类别</td>
                                            <td width="13%">GC表号</td>
                                            <td width="13%">父编码</td>
                                            <td width="13%">操作</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in resourceType" :key="index">
                                            <td v-text="item.name"></td>
                                             <td v-text="item.tableNo"></td>
                                            <td v-text="item.parentCode"></td>
                                            <td><button class="deleteBtn actionBtn" title="删除" @click="deleteResoureType(index)"></button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> -->
                        <div class="taskCheck">
                            <h2>任务核实</h2>
                            <div class="taskCheckSelect">
                                <label>任务核实方式：</label>
                                <el-select v-model="taskCheckValue" placeholder="请选择">
                                    <el-option v-for="item in taskCheckName"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="componentCheck">
                                <label>构建完工核实：</label>
                                <el-select v-model="componentCheckValue" placeholder="请选择">
                                    <el-option v-for="item in componentCheckName"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button type="danger" @click="updateComponentCheck">修改</el-button>
                        </div>
                        <div class="taskStatus1">
                            <h2><span>任务状态图例</span></h2>
                            <div class="statusTab">
                                <table  border="1" width="100%">
                                    <thead class="head">
                                        <tr>
                                            <td width="20%">任务状态</td>
                                            <td width="50%">当前图例</td>
                                            <td width="20%">应用到表格</td>
                                            <td width="10%">操作</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in taskStatusList" :key="index">
                                            <td v-text="$options.filters.statusName(item.taskStatus)"></td>
                                            <td v-html="$options.filters.selectColor(parseInt(item.colorValue))"></td>
                                            <td><el-checkbox v-model="item.view"  @change="checkChange(index)"></el-checkbox></td>
                                            <td>
                                                <button class="changeBtn actionBtn" title="更改" @click="updateTSColor(item.id)"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹出对话框 -->
        <div id="edit">
            <!-- 新增日历 -->
            <el-dialog title="编辑日历模板" :visible.sync="addDialog" :before-close="addCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">模板名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="templateName" /></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMakeSure">确定</button>
                    <button class="editBtnC" @click="addCancle">取消</button>
                </div>
            </el-dialog>
            <!-- 编辑日历 -->
            <el-dialog title="编辑日历模板" :visible.sync="editDialog" @close="editCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">模板名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="templateName" /></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editMakeSure">确定</button>
                    <button class="editBtnC" @click="editCancle">取消</button>
                </div>
            </el-dialog>
            <!-- 新增工作周 -->
            <el-dialog title="编辑工作周" :visible.sync="addweektimeDialog" @close="addWTCancle">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="cwtimeName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            v-model="startweektimeValue"
                            @change="getSTime" format="yyyy-MM-dd" 
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            v-model="endweektimeValue"
                             
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div>
                        <div class="editBodytwo"><label class="editworkday">点击选择工作日/非工作日:</label></div>
                        <table style="border-collapse:collapse" border="1" width="92%">
                            <tbody>
                                <tr >
                                    <td  v-for="(item,index) in weektimeList" :key="index" :class="{'datacolor':item.num===1}" @click="selecttime(item,index)" >{{item.text}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addweektimeMakeSure">确定</button>
                    <button class="editBtnC" @click="addWTCancle">取消</button>
                </div>
            </el-dialog>
            <!-- 编辑工作周 -->
            <el-dialog title="编辑工作周" :visible.sync="updateweektimeDialog" @close="updateWTCancle">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="cwtimeName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            v-model="startweektimeValue"
                            @change="getSTime" format="yyyy-MM-dd" 
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            v-model="endweektimeValue"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div>
                        <div class="editBodytwo"><label class="editworkday">点击选择工作日/非工作日:</label></div>
                        <table style="border-collapse:collapse" border="1" width="92%">
                            <tbody>
                                <tr  >
                                    <td v-for="(item,index) in weektimeList" :key="index" :class="{'datacolor':item.num==1}" @click="selecttime(item,index)" >{{item.text}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="updateweektimeMakeSure">确定</button>
                    <button class="editBtnC" @click="updateWTCancle">取消</button>
                </div>
            </el-dialog>
            <!-- 新增例外日期 -->
            <el-dialog title="编辑例外日期"  :visible.sync="addExceptionDateDialog" @close="listClose">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="cedateName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">是否工作日 :</label>
                        <select class="editSelect" @change="workDayChange" v-model="shifouday" >
                            <option v-for="(item,index) in workDayList" :key="index" :value="item.value" >{{item.label}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">重复方式 :</label>
                        <select class="editSelect" @change="cedTypeChange" v-model="repeatway">
                            <option v-for="(item,index) in cedTypeList" :key="index" :value="item.value">{{item.label}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    <div class="weekday" v-show="weekdayshow">
                        <template>
                            <el-checkbox-group v-model="checkList" @change="changeweekday">
                                <!-- @change="changeweekday" -->
                                <el-checkbox label="周一"></el-checkbox>
                                <el-checkbox label="周二"></el-checkbox>
                                <el-checkbox label="周三"></el-checkbox>
                                <el-checkbox label="周四"></el-checkbox>
                                <el-checkbox label="周五"></el-checkbox>
                                <el-checkbox label="周六"></el-checkbox>
                                <el-checkbox label="周日"></el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </div>
                    <div class="month" v-show="monthshow">
                        <label class="editInpText">日期：</label>
                        <select @change="changemonth" v-model="value">
                            <option v-for="(item,index) in 31" :key="index">{{item}}</option>
                        </select>
                        <span>日</span>
                    </div>
                    <div class="year" v-show="yearshow">
                        <label class="editInpText">日期：</label>
                        <select v-model="item1" @change="changeyearshow1">
                             <!-- @change="changeyearshow" -->
                            <option v-for="(item1,index) in 12" :key="index" >{{item1}}</option>
                        </select>
                        <span>日</span>
                        <span>-</span>
                        <select v-model="item2" @change="changeyearshow2">
                            <option v-for="(item2,index) in 31" :key="index">{{item2}}</option>
                        </select>
                        <span>月</span>
                    </div>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            v-model="startValue"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            v-model="endValue"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addCedList">确定</button>
                    <button class="editBtnC" @click="listClose">取消</button>
                </div>
            </el-dialog>
            <!-- 编辑例外日期 -->
            <el-dialog title="编辑例外日期"  :visible.sync="updateExceptionDateDialog" @close="upadteEDlistClose">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="cedateName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">是否工作日 :</label>
                        <select class="editSelect" @change="workDayChange" v-model="shifouday" >
                            <option v-for="(item,index) in workDayList" :key="index" :value="item.value" >{{item.label}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">重复方式 :</label>
                        <select class="editSelect" @change="cedTypeChange" v-model="repeatway">
                            <option v-for="(item,index) in cedTypeList" :key="index" :value="item.value">{{item.label}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    <div class="weekday" v-show="weekdayshow">
                        <template>
                            <el-checkbox-group v-model="checkList" @change="changeweekday">
                                <!-- @change="changeweekday" -->
                                <el-checkbox label="周一"></el-checkbox>
                                <el-checkbox label="周二"></el-checkbox>
                                <el-checkbox label="周三"></el-checkbox>
                                <el-checkbox label="周四"></el-checkbox>
                                <el-checkbox label="周五"></el-checkbox>
                                <el-checkbox label="周六"></el-checkbox>
                                <el-checkbox label="周日"></el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </div>
                    <div class="month" v-show="monthshow">
                        <label class="editInpText">日期：</label>
                        <select @change="changemonth" v-model="value">
                            <option v-for="(item,index) in 31" :key="index">{{item}}</option>
                        </select>
                        <span>日</span>
                    </div>
                    <div class="year" v-show="yearshow">
                        <label class="editInpText">日期：</label>
                        <select v-model="item1" @change="changeyearshow1">
                             <!-- @change="changeyearshow" -->
                            <option v-for="(item1,index) in 12" :key="index" >{{item1}}</option>
                        </select>
                        <span>月</span>
                        <span>-</span>
                        <select v-model="item2" @change="changeyearshow2">
                            <option v-for="(item2,index) in 31" :key="index">{{item2}}</option>
                        </select>
                         <span>日</span>
                    </div>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            v-model="startValue"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            v-model="endValue"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="updateEDMakeSure">确定</button>
                    <button class="editBtnC" @click="upadteEDlistClose">取消</button>
                </div>
            </el-dialog>
            <!-- 修改任务优先级 -->
            <el-dialog title="请确认" :visible.sync="updateTaskPriorityDialog" @close="updateTPCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="changeTaskText">您要修改工程任务优先级?</label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="updateTPListSure">确定</button>
                    <button class="editBtnC" @click="updateTPCancelBtn">取消</button>
                </div>
            </el-dialog>
            <!-- 更改任务状态图例 -->
            <el-dialog title="更改图例" :visible.sync="updateTaskStatusColorDialog" @close="updateTPCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix tasktext"><label class="editInpText1">任务状态 :</label><label >{{taskStatusName | statusName}}</label></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">当前图例 :</label>
                        <select class="editSelect" v-model="value" @change="taskStatusColorChange">
                            <option v-for="(item, index) in taskStatusColor" :value="item.val" :key="index">{{item.text}}</option>
                        </select>
                        <span v-if="showTaskStatusColor" class="displayColor" :style="{'background':taskStatusColorOne}"></span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="updateTSColorSure">确定</button>
                    <button class="editBtnC" @click="updateTSColorCancelBtn">取消</button>
                </div>
            </el-dialog>
            <!-- 新增任务组别 -->
            <el-dialog title="新增任务组别" :visible.sync="addTaskGroupDialog" @close="editGroupCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">组别名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="tGroupName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">标记色 :</label>
                    <!-- 目前先用简单的方法-下拉框的方法，后面第二轮升级再调整 -->
                    <select class="editSelect" v-model="selectTGColor" @change="taskGroupColorChange">
                        <option v-for="(item,index) in taskGroupColor" :value="item.value" :key="index">{{item.label}}</option>
                    </select>
                    <span v-if="showtaskGroupColor" class="displayColor" :style="{'background-color':taskGroupColorOne}"></span>
                        <i class="icon-sanjiao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addTaskGroupSure" >保存</button>
                    <button class="editBtnC" @click="addGroupCancelBtn">取消</button>
                </div>
            </el-dialog>
            <!-- 编辑任务组别 -->
            <el-dialog title="修改任务组别" :visible.sync="editTaskGroupDialog" @close="addGroupCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">组别名称 :</label><input class="inp" placeholder="请输入模板名称" v-model="tGroupName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">标记色 :</label>
                    <select class="editSelect" v-model="selectTGColor"  @change="taskGroupColorChange">
                        <option v-for="(item,index) in taskGroupColor" :value="item.value" :key="index">{{item.label}}</option>
                    </select>
                    <span v-if="showtaskGroupColor" class="displayColor" :style="{'background-color':taskGroupColorOne}"></span>
                        <i class="icon-sanjiao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editTaskGroupSure" >保存</button>
                    <button class="editBtnC" @click="editGroupCancelBtn">取消</button>
                </div>
            </el-dialog>
            <!-- 增加资源任务 -->
            <el-dialog title="添加资源类别" :visible.sync="addResourceTypeDialog" @close="addRTCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">名称 :</label><input class="inp" placeholder="请输入" v-model="rTypeName"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">GC总表 :</label>
                    <select class="editSelect" v-model="tnvalue"  @change="tnvalueChange">
                        <option v-for="(item,index) in tableNoList" :value="item.val"  :key="index">{{item.text}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">父编码 :</label>
                    <select class="editSelect" v-model="pcvalue" >
                        <option v-for="(item,index) in loadparentCodeList" :value="item.classifyCode" :key="index" @change="pcvalueChange">[{{item.classifyCode}}]{{item.classifyName}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addResourceTypeSure" >保存</button>
                    <button class="editBtnC" @click="addRTCancelBtn">取消</button>
                </div>
            </el-dialog>
        </div>
        <!-- 删除确认按钮 -->
        <div id="inital">
            <!-- 工作日休息日删除 -->
            <el-dialog  :visible.sync="deleteWeekTimeDialog" width="398px" @close="deleteWTlistClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前工作周设置?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteWTMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteWTlistClose">取消</button>
                </div>
            </el-dialog>
            <!-- 例外休息日期删除 -->
             <el-dialog  :visible.sync="deleteExceptionDateDialog" width="398px" @close="deleteETlistClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前例外日期设置?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteETMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteETlistClose">取消</button>
                </div>
            </el-dialog>
            <!-- 任务组别设置删除 -->
            <el-dialog  :visible.sync="deleteTaskGroupDialog" width="398px" @close="deleteTGlistClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除当前任务组别?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteTGMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteTGlistClose">取消</button>
                </div>
            </el-dialog>
            <!-- 资源类别设置删除 -->
            <el-dialog  :visible.sync="deleteResourceTypeDialog" width="398px" @close="deleteRTlistClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你选择需要删除的资源类别可能已经在当前工程的计划中使用，如果删除类别，所有相关数据将被清空，请谨慎操作！</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteRTMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteRTlistClose">取消</button>
                </div>
            </el-dialog>
        </div>
    </div> 
</template>

<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    ::-webkit-scrollbar{width:0px}
    #personalCalendar{
        width: 100%;
        .topHeader{
            box-sizing: border-box;
            // margin-top:107px;
            float: left;
            width: 100%;
            max-height: 800px;
            overflow: auto;
            
        }
        ::-webkit-scrollbar{width:0px}
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
        .content{   
            position:relative;
            width:100%;
            .work-content{ 
                // position: absolute;
                padding:15px;
                
                .work-list-left{
                    width:46%;
                    margin-left:2%;
                    margin-right:2%;
                    float:left; 
                .workList{
                    width: 100%;
                    color: #fc3439;
                    text-align: left;
                    font-size: 16px;
                    line-height: 16px;
                    font-family: '微软雅黑';
                    font-weight: bold;
                    border-bottom: 1px solid #e6e6e6;
                    padding-bottom: 11px;
                    margin: 20px 0 0 0;
                    .imgIcon{
                        margin-right:11px;
                    }
                    }
                .calendarView{
                    margin-top:20px;
                    .calendarText{
                        text-align: left;
                        color:#666666;
                        font-size:14px;
                        line-height: 14px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                    }
                    .calendarBox{
                        height: 335px;
                        margin-top:10px;
                        border:1px solid #ccc;
                        position: relative;
                        .calendarLeft{
                            width: 40%;
                            text-align: left;
                            // overflow-x:hidden;
                            // overflow-y:auto;
                            
                            .calendarSelect{
                                height: 333px;
                                overflow: auto;
                                .calendarHead{
                                    height: 52px;
                                    background: #fff;
                                    line-height: 52px;
                                    box-sizing: border-box;
                                    i{
                                        margin-right: 10px;
                                    }
                                    span{
                                        padding-left:5px;
                                        display: inline-block;
                                        font-size:14px;
                                        color:#333333;
                                        margin-right: 56px;
                                    }  
                                }
                                .calendarBody_active{
                                        border-left:2px solid red;
                                        background: #fafafa;
                                        font-weight: bold;
                                    }
                                .calendarBody{
                                    height: 40px;
                                    line-height: 40px;
                                    position: relative;
                                    span{
                                        padding-left:5px;
                                        display: inline-block;
                                        font-size:14px;
                                        color:#333333;
                                        
                                    }
                                    
                                }
                                li:hover .editBtn{
                                        position: absolute;
                                        width: 16px;
                                        height: 16px;
                                        border: none;
                                        cursor: pointer;
                                        top:25%;
                                        right: 15px;
                                        vertical-align:middle;
                                        background: url('../../assets/edit.png') no-repeat;
                                    }
                            }
                        
                        }
                        .calendarRight{
                            width: 58%;
                            position: absolute;
                            left: 41%;
                            top:0px;
                            .flex{
                                    box-sizing: border-box;

                                    display: -webkit-box;
                                    -webkit-box-pack: start;
                                    -webkit-box-align: start;

                                    display: -webkit-flex;
                                    -webkit-justify-content: space-between;
                                    -webkit-align-items: top;

                                    display: flex;
                                    justify-content: space-between;
                                    align-items: top;
                                    flex-flow:row wrap
                                }
                                .flex>div{
                                    margin:10px;
                                    padding:14px;
                                    position: absolute;
                                    left: -1%;
                                    top:-9px;
                                    // width:25%;
                                    // min-width:300px;
                                    border: 1px solid #eee;
                                    border-radius: 2px;
                                    // position: relative;
                                }
                                
                                // .flex>div>input{
                                //     box-sizing: border-box;
                                //     width:100%;
                                //     margin-top:20px;
                                //     border-radius: 2px;
                                //     border:1px solid #dedede;
                                //     padding:10px;
                                //     font-size: 16px;
                                //     background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 10px;
                                //         padding-left: 36px;
                                //         color:#666;
                                // }

                                /*transition*/
                                // .fade-enter-active,
                                // .fade-leave-active {
                                //     transition: all .5s ease-in-out;
                                // }
                                // .fade-enter,.fade-leave-active{
                                //     opacity: 0;
                                //     transform: translateY(-10px);

                                // }

                                /*下拉框*/
                                // .calendar-dropdown{
                                //     background: #fff;
                                //     position: absolute;
                                //     left:0;
                                //     top:0;
                                //     padding:20px;
                                //     border: 1px solid #eee;
                                //     border-radius: 2px;
                                // }
                                // .calendar-dropdown:before {
                                //     position: absolute;
                                //     left:30px;
                                //     top: -10px;
                                //     content: "";
                                //     border:5px solid rgba(0, 0, 0, 0);
                                //     border-bottom-color: #DEDEDE;
                                // }
                                // .calendar-dropdown:after {
                                //     position: absolute;
                                //     left:30px;
                                //     top: -9px;
                                //     content: "";
                                //     border:5px solid rgba(0, 0, 0, 0);
                                //     border-bottom-color: #fff;
                                // }

                                /*弹出框*/
                                // .calendar-dialog{
                                //     position: absolute;
                                //     left:0;
                                //     top:0;
                                //     right:0;
                                //     bottom:0;
                                // }

                                // .calendar-dialog-mask{
                                //     background:rgba(255,255,255,.5);
                                //     width:100%;
                                //     height:100%;
                                // }

                                // .calendar-dialog-body{
                                //     background: #fff;
                                //     position: absolute;
                                //     left:50%;
                                //     top:50%;
                                //     transform: translate(-50%,-50%);
                                //     padding:20px;
                                //     border: 1px solid #eee;
                                //     border-radius: 2px;
                                // }
                        }
                    }
                    .dataColor_legend{
                        margin-top:10px;
                        font-size:12px;
                        text-align: left;
                        .dataColor1_content{
                            float:left;
                            width:85px;
                        .dataColor1{
                            display: inline-block;
                            width: 16px;
                            height: 12px;
                            border:1px solid #f2f2f2;
                            margin-right:7px;
                        }
                        }
                        .dataColor2_content{
                            float:left;
                            width:85px;
                        .dataColor2{
                            display: inline-block;
                            width: 16px;
                            height: 12px;
                            border:1px solid #f2f2f2;
                            margin-right:7px;
                            background-color: #f2f2f2;
                        }
                        }  
                        .dataColor3_content{
                            float:left;
                            width:85px;
                        .dataColor3{
                            display: inline-block;
                            width: 16px;
                            height: 12px;
                            border:1px solid #f2f2f2;
                            margin-right:7px;
                            background-color: #fff6f6;
                        }
                        }      
                    }

                }
                .work{
                    margin-top:50px;
                    .workdaySet{
                        text-align: left;
                        color:#666666;
                        font-size:14px;
                        line-height: 14px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        #add{
                            float:right;
                            cursor: pointer;
                            
                        }
                        #add i{margin-right:10px;}
                    }
                    .tableBox{
                        margin-top: 20px;
                        width: 100%;
                        height: 100%;
                        // border: 1px solid #e0e0e0;
                        background:#fafbfc;
                        .workTable{
                            border-collapse:collapse;
                            border: 1px solid #e6e6e6;
                            .head{
                                background:#f2f2f2;
                                td{
                                    padding-left:10px;
                                    height: 36px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #666666;

                                }
                            }
                            .body{
                                background:#fff;
                                tr{
                                    td{
                                        padding-left:10px;
                                        height: 40px;
                                        text-align: left;
                                        font-size: 12px;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        color: #666666;
                                    }
                                    .actionBtn{
                                        width: 16px;
                                        height: 16px;
                                        border: none;
                                        cursor: pointer;
                                        margin-right: 16px;
                                    }
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat;
                                    }
                                    .editBtn{
                                            background: url('../../assets/edit.png') no-repeat;
                                        }
                                    .detailBtn{
                                        background: url('./images/detail.png') no-repeat;
                                    }
                                    .defaultdetailBtn{
                                        background: url('./images/defaultdetail.png') no-repeat;
                                    }
                                    
                                    
                                }

                            }
                        }
                        .workList{
                            padding:0px 10px 15px 10px;
                            
                            span{
                                display: inline-block;
                                font-size:12px;
                                color:rgb(192, 191, 191);
                                line-height: 12px;
                                margin-bottom: 10px;
                            }
                            .weekTable{
                                border-collapse:collapse;
                                border: 1px solid #e6e6e6;
                                tbody{
                                    tr{
                                        background:#fff;
                                       td{
                                           padding-left:10px;
                                            height: 36px;
                                            text-align: left;
                                            font-size: 12px;
                                            box-sizing: border-box;
                                            border-right: 1px solid #e6e6e6;
                                            color: #666666;
                                       }
                                       .datacolor{color:red;} 
                                    }
                                }
                            }
                        }
                    }

                }
                }
                .work-task-right{
                    width:46%;
                    margin-left:2%;
                    margin-right:2%;
                    float:left; 
                    .workList{
                        width: 100%;
                        color: #fc3439;
                        text-align: left;
                        font-size: 16px;
                        line-height: 16px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 11px;
                        margin: 20px 0 0 0;
                        .imgIcon{
                            margin-right:11px;
                        }
                        }
                    .taskPriority{
                        margin-top:20px;
                        h2{
                            text-align: left;
                            color:#666666;
                            font-size:14px;
                            line-height: 14px;
                            font-family: '微软雅黑';
                            font-weight: bold;
                        }
                        .priorityTab{
                            height: 44px;
                            margin-top:10px;
                            table{
                            border-collapse:collapse;
                            border: 1px solid #e6e6e6;
                            tbody{
                                tr{
                                    td{
                                        height: 36px;
                                        text-align: center;
                                        font-size: 12px;
                                        color: #d3d3d3;
                                        cursor: pointer;
                                    }
                                     .Active{
                                            color:red;
                                        }
                                }
                            }
                            }

                        }
                    }
                    .taskGroup{
                            margin-top:34px;
                            
                            h2{
                                text-align: left;
                                color:#666666;
                                font-size:14px;
                                line-height: 14px;
                                font-family: '微软雅黑';
                                font-weight: bold;
                                #add{
                                    float:right;
                                    cursor: pointer;
                                }
                                #add i{margin-right:10px;}
                            }
                            .groupTab{
                                margin-top:6px;
                                width: 100%;
                                height: 100%;
                                table{
                                    border-collapse:collapse;
                                    border: 1px solid #e6e6e6;
                                    thead{
                                        background:#f2f2f2;
                                    td{
                                        padding-left:10px;
                                        height: 36px;
                                        text-align: left;
                                        font-size: 14px;
                                        color: #666666;
                                        }
                                    }
                                    tbody{
                                        background:#fff;
                                        td{
                                            padding-left:10px;
                                            height: 36px;
                                            text-align: left;
                                            font-size: 12px;
                                            box-sizing: border-box;
                                            border-right: 1px solid #e6e6e6;
                                            color: #666666;
                                            .actionBtn{
                                                width: 16px;
                                                height: 16px;
                                                border: none;
                                                cursor: pointer;
                                                margin-left: 18px;
                                            }
                                            .deleteBtn{
                                                background: url('../../assets/delete.png') no-repeat;
                                            }
                                            .editBtn{
                                                    background: url('../../assets/edit.png') no-repeat;
                                                }
                                        }
                                    }
                                }
                            }
                    }
                    .taskCheck{
                        margin-top:34px;
                        h2{
                            text-align: left;
                            color:#666666;
                            font-size:14px;
                            line-height: 14px;
                            font-family: 'MicrosoftYaHei';
                            font-weight: bold;
                        }
                        .taskCheckSelect{
                           width: 100%;
                            margin-top:20px;
                            flex: 1;
                            text-align: left;
                            label{
                                color: #999;
                                font-weight: normal;
                                font-size: 14px;
                                line-height: 38px;
                                font-family: 'MicrosoftYaHei';
                                margin-right: 15px;
                            }
                            .el-select{
                                height: 38px;
                                width: 50%;
                            }
                        }
                        .componentCheck{
                           width: 100%;
                            margin-top:20px;
                            flex: 1;
                            text-align: left;
                            // float: left;
                            label{
                                color: #999;
                                font-weight: normal;
                                font-size: 14px;
                                line-height: 38px;
                                font-family: 'MicrosoftYaHei';
                                margin-right: 15px;
                            }
                            .el-select{
                                height: 38px;
                                width: 50%;
                            }
                        }
                        .el-button{
                            float:left; 
                            margin-top:20px;
                            margin-left: 120px;
                        height: 36px;
                        width: 20%;}
                    }
                    .taskStatus1{
                            margin-top:90px;
                            margin-bottom: 20px;
                            // border-bottom: 15px solid #fff;
                            h2{
                                text-align: left;
                                color:#666666;
                                font-size:14px;
                                line-height: 14px;
                                font-family: '微软雅黑';
                                font-weight: bold;
                            }
                            .statusTab{
                                margin-top:6px;
                                width: 100%;
                                height: 100%;
                                table{
                                    border-collapse:collapse;
                                    border: 1px solid #e6e6e6;
                                    thead{
                                        background:#f2f2f2;
                                    td{
                                        padding-left:10px;
                                        height: 36px;
                                        text-align: left;
                                        font-size: 14px;
                                        color: #666666;
                                        }
                                    }
                                    tbody{
                                        background:#fff;
                                        td{
                                            padding-left:10px;
                                            height: 36px;
                                            text-align: left;
                                            font-size: 12px;
                                            box-sizing: border-box;
                                            border-right: 1px solid #e6e6e6;
                                            color: #666666;
                                            .actionBtn{
                                        width: 16px;
                                        height: 16px;
                                        border: none;
                                        cursor: pointer;
                                        margin-right: 16px;
                                        }
                                        .changeBtn{
                                            background: url('../../assets/change.png') no-repeat;
                                        }
                                        }
                                    }
                                }
                            }
                    }

                }
                }
        }
        //删除弹框
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
        #edit{
                .editBody{
                .editBodyone{
                    .editInpText{
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        margin-right: 20px;
                        width: 15%;
                        text-align: right;
                    }
                    .editInpText1{
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        margin-right: 20px;
                    
                    }
                    .editworkday{
                        color: #666;
                        font-size: 14px;
                        line-height: 38px;
                        font-weight: normal;
                        display: inline-block;
                        float: left;
                        width:100px;
                        margin-left: 30px;
                        }
                    .changeTaskText{
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        margin-right: 20px;
                        width: 28%;
                        text-align: right;
                    }

                }
                .tasktext{
                        color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    text-align:left;
                    margin-left: 88px;

                    }
                .editBodytwo{
                    .editSelect{
                        width: 435px;
                        height: 38px;
                        color: #333333;
                        background: #fafafa;
                        border: 1px solid #d1d1d1;
                        padding:0px 0px 0px 10px;
                    }
                    .el-date-editor.el-input
                    .el-input__inner{
                        width: 322px;
                    }
                    .el-date-editor .el-input{
                            width: 435px;
                        }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image:url('./images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 18px;
                        right: 62px;
                    }
                    .editworkday{
                            color: #666;
                        font-size: 14px;
                        line-height: 38px;
                        font-weight: normal;
                        display: inline-block;
                        float: left;
                        margin-left: 30px;
                    }

                }
                .edit-item{position:relative;
                .displayColor {
                    display: block;
                    width: 30px;
                    height: 30px;
                    border: 1px solid #ccc;
                    overflow: hidden;
                    float: left;
                    margin-left: 120px;
                    margin-top: 5px;
                }
            }
            .clearfix{  clear: both;
                    overflow: hidden;
                    content: "";}
            table{
                border: 1px solid #e6e6e6;
                 margin-top:20px;
                 margin-left:4%;
                tbody{
                    tr{
                        td{
                            height: 36px;
                            text-align: center;
                            font-weight: bold;
                            font-size: 12px;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            color: #666666;
                        }
                        .datacolor{
                                color:red;
                            }
                    }
                }
            }
            .weekday{
                margin-left:18px;
                margin-top:15px;
            }
            .month{
                width: 47%;
                float:left;
                margin-top:15px;
            }
            .year{
                width: 54%;
                float:left;
                margin-top:15px;
            }
            }
        }
        
    }
</style>
<style lang="less">
 .poniter{cursor: pointer;}
</style>
<script>

import axios from 'axios';
import moment from 'moment';
import calendar from './calendar.vue'
export default{
    name: 'calendarConfig',
    components: {
        calendar
    },
    data() { 
        return{
            //日历
             calendar1:{
                 multi:true,
                 zero:true,
                value:[[2018,7,2],[2018,7,3],[2018,7,7],[2018,7,4],[2018,7,9],[2018,7,10],[2018,7,11]], //默认日期
                // lunar:true, //显示农历
                weeks:['日', '一', '二', '三', '四', '五', '六'],
                display:"2018/02/16",
                months:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                events:{
                    // '2017-7-7':'$408',
                    // '2017-7-20':'$408',
                    // '2017-7-21':'$460',
                    // '2017-7-22':'$500',
                },
                // begin:[2018,7,11], //可选开始日期
                // end:[2018,7,29], //可选结束日期
                select(value){
                   
                },
                selectMonth(month,year){
                    
                },
                selectYear(year){
                   
                },
                timestamp:Date.now()
            },
            routerList:'',
            moduleList:'',
            token:'',
            projId:'',
            BDMSUrl:'',
            tempName:'',
            index:'',
            id:'',
            key:'',
            startValue:'',
            endValue:'',
            cwtList:[],
            cedList:[],
            //新增工作周
            addweektimeDialog:false,
            updateweektimeDialog:false,
            startweektimeValue:'',
            endweektimeValue:'',
            weekNumList:'',
            cwtimeName:'',
            cwtId:'',
            colorindex:0,
            deleteWeekTimeDialog:false,
            deleteWeekTimeNum:'',
            numId:'',
            weektimeNum:'',
            weektimeList:[
                {   num:0,
                    text:'周一'
                },
                {
                     num:0,
                    text:'周二'
                },
                {
                     num:0,
                    text:'周三'
                },
                {
                     num:0,
                    text:'周四'
                },
                {
                     num:0,
                    text:'周五'
                },
                {
                     num:1,
                    text:'周六'
                },
                {
                     num:1,
                    text:'周日'
                }
            ],
            workDayList:[
                {
                    value:1,
                    label:'工作日'
                },
                {
                    value:0,
                    label:'非工作日'
                }
            ],//例外休息日(判断是否为工作日)
           checkList:[],
           item1:1,
           item2:1,
           yearList:'',
           checkWeekListNum:'',
           checkWeekNumList:[
               {
                text:'周一',
               num:1
               },
               {
                   text:'周二',
                   num:1
               },
               {
                   text:'周三',
                   num:1
               },
               {
                   text:'周四',
                   num:1
               },
               {
                   text:'周五',
                   num:1
               },
               {
                   text:'周六',
                   num:1
               },
               {
                   text:'周日',
                   num:1
               }
           ],
           checkWeekList:[
               {
                text:'周一',
               num:0
               },
               {
                   text:'周二',
                   num:0
               },
               {
                   text:'周三',
                   num:0
               },
               {
                   text:'周四',
                   num:0
               },
               {
                   text:'周五',
                   num:0
               },
               {
                   text:'周六',
                   num:0
               },
               {
                   text:'周日',
                   num:0
               }
           ],
           weekdayshow:false,//重复方式周末选择
           monthshow:false,//重复方式月份选择
           yearshow:false,//重复方式年份选择
           deleteExceptionDateDialog:false,
           deleteExceptionDateNum:'',
            cedTypeList:[
                    {
                        value:4,
                        label:'每日'
                    },
                    {
                        value:3,
                        label:'每周'
                    },
                    {
                        value:2,
                        label:'每月'
                    },
                     {
                        value:1,
                        label:'每年'
                    },
                ],
            //例外休息日类型  
            calendarIndex:[],
            TaskPriorityList:[],
            taskGroupList:[],
            resourceType:[],
            taskStatusList:[],
            shifouday:'',
            shifoudayValue:'',
            repeatway:'',
            repeatwayValue:'',
            tpType:'',
            tpType1:'',
            tempId:'',
            currentStyle:true,//目前样式
            isActive:-1,
            taskCheckValue:'',
            cedContent:'',//日期安排内容
            //任务核实名称
            taskCheckName:[{
                value:'1',
                label:'自动'
                },
                {
                    value:'2',
                    label:'手动独立进行核实'
                },
                {
                    value:'3',
                    label:'根据绑定构件完工比例进行自动核实'
                }],
            componentCheckValue:'',
            componentCheckName:[{
                value:'1',
                label:'独立进行构件完工确认'
                },
                {
                    value:'2',
                    label:'构件质量验收完成后自动完工确认'
                }
                ],
            //优先级值
            priorityIndex:
                [
                    {
                        tptype:'1',
                        Index:'1级'},
                    {
                        tptype:'2',
                        Index:'2级'},
                    {
                        tptype:'3',
                        Index:'3级'
                    },
                    {
                        tptype:'4',
                        Index:'4级'
                    },
                    {
                        tptype:'5',
                        Index:'5级'
                    },
                    {
                        tptype:'6',
                        Index:'6级'
                    },
                    {
                        tptype:'7',
                        Index:'7级'
                    },
                ],
            updateTaskPriorityDialog:false,
            //弹出框
            addDialog:false,
            editDialog:false,
            templateName:'',
            addExceptionDateDialog:false,
            updateExceptionDateDialog:false,
            //资源类别
            addResourceTypeDialog:false,
            deleteResourceTypeDialog:false,
            deleteRTNum:'',
            tableNoList:[
                {
                    val:'t13',
                    text:"专业工种人员(T13)"
                },
                {
                    val:'t16',
                    text:"物资产品分类(T16)"
                },
                {
                    val:'t17',
                    text:"施工作业工具(T17)"
                }
            ],
            loadparentCodeList:'',
            rTypeName:'',
            tnvalue:'',
            pcvalue:'',
            cedateName:'',//例外休息日名称
            //任务组别选择
            tGroupName:'',//任务组别名称
            addTaskGroupDialog:false,
            editTaskGroupDialog:false,
            taskGroupColor:[
                {value:'lightskyblue',
            label:'天蓝色'},
            {value:'cadetblue',
            label:'军色蓝'},
            {value:'cornflowerblue',
            label:'亮蓝色'},
            {value:'darkseagreen',
            label:'深绿色'},
            {value:'lightblue',
            label:'浅蓝色'},
            {value:'lightseagreen',
            label:'浅海绿色'},
            {value:'yellow',
            label:'黄色'},
            {value:'green',
            label:'绿色'},
            {
                value:'blue',
                label:'蓝色'
            },{
                value:'violet',
                label:'蓝紫色'
            }],
            selectTGColor:'',
            showtaskGroupColor:false,
            taskGroupColorOne:'',
            groupListIndexNumber:'',
            deleteTaskGroupDialog:false,
            deteleGroupNum:'',
            //任务状态图例
            view:'',
            updateTaskStatusColorDialog:false,
            selectTSColor:'',
            value:'',
            taskStatusColorOne:'', 
            taskStatusName:'',
            showTaskStatusColor:true,
            taskStatusColor:[		
                {
                    val:'',
                    color:'',
                    text:'无'
                },
                { val: 12001,
                    color: "RGBA(127,127,127,255)",
                    text: "A2涂料-灰白127",
                    },
                { val: 12002,
                    color: "RGBA(159,159,159,255)",
                    text: "A2涂料-灰白159",
                    },
                { val: 12003,
                    color: "RGBA(191,191,191,255)",
                    text: "A2涂料-灰白191",
                    },
                { val: 12004,
                    color: "RGBA(223,223,223,255)",
                    text: "A2涂料-灰白223",
                    },
                { val: 12005,
                    color: "RGBA(255,255,255,255)",
                    text: "A2涂料-纯白",
                    },
                { val: 12006,
                    color: "RGBA(255,255,191,255)",
                    text: "A2涂料-浅黄",
                    },
                { val: 12007,
                    color: "RGBA(255,240,191,255)",
                    text: "A2涂料-米黄",
                    },
                { val: 12008,
                    color: "RGBA(255,232,139,255)",
                    text: "A2涂料-蛋黄",
                    },
                { val: 12009,
                    color: "RGBA(255,214,238,255)",
                    text: "A2涂料-淡粉",
                    },
                { val: 12010,
                    color: "RGBA(255,152,201,255)",
                    text: "A2涂料-中粉",
                    },
                { val: 12011,
                    color: "RGBA(255,62,160,255)",
                    text: "A2涂料-深粉",
                    },
                { val: 12012,
                    color: "RGBA(255,105,105,255)",
                    text: "A2涂料-淡红",
                    },
                { val: 12013,
                    color: "RGBA(255,62,62,255)",
                    text: "A2涂料-中红",
                    },
                { val: 12014,
                    color: "RGBA(255,0,0,255)",
                    text: "A2涂料-深红",
                    },
                { val: 12015,
                    color: "RGBA(255,186,116,255)",
                    text: "A2涂料-淡桔",
                    },
                { val: 12016,
                    color: "RGBA(255,127,0,255)",
                    text: "A2涂料-桔黄查询结果",
                    },
                { val: 12017,
                    color: "RGBA(99,255,99,255)",
                    text: "A2涂料-淡绿查询结果",
                    },
                { val: 12018,
                    color: "RGBA(0,171,0,255)",
                    text: "A2涂料-深绿查询结果",
                    },
                { val: 12019,
                    color: "RGBA(173,173,255,255)",
                    text: "A2涂料-蓝紫查询结果",
                    },
                { val: 12020,
                    color: "RGBA(68,199,255,255)",
                    text: "A2涂料-天蓝查询结果",
                    },

                { val: 13001,
                    color: "RGBA(255,0,0,255)",
                    text: "A3油漆-红色查询结果",
                    },
                { val: 13002,
                    color: "RGBA(255,255,0,255)",
                    text: "A3油漆-黄色查询结果",
                    },
                { val: 13003,
                    color: "RGBA(0,255,0,255)",
                    text: "A3油漆-绿色查询结果",
                    },
                { val: 13004,
                    color: "RGBA(0,255,255,255)",
                    text: "A3油漆-青色查询结果",
                    },
                { val: 13005,
                    color: "RGBA(0,0,255,255)",
                    text: "A3油漆-蓝色查询结果",
                    },
                { val: 13006,
                    color: "RGBA(255,0,255,255)",
                    text: "A3油漆-洋红查询结果",
                    },
                { val: 13007,
                    color: "RGBA(255,255,255,255)",
                    text: "A3油漆-白色查询结果",
                    },
                { val: 13008,
                    color: "RGBA(167,167,167,255)",
                    text: "A3油漆-浅灰查询结果",
                    },
                { val: 13009,
                    color: "RGBA(214,214,214,255)",
                    text: "A3油漆-银色查询结果",
                    },
                { val: 13010,
                    color: "RGBA(255,128,0,255)",
                    text: "A3油漆-桔黄查询结果",
                    },
                { val: 13011,
                    color: "RGBA(128,255,0,255)",
                    text: "A3油漆-黄绿查询结果",
                    },
                { val: 13012,
                    color: "RGBA(0,255,128,255)",
                    text: "A3油漆-蓝绿查询结果",
                    },
                { val: 13013,
                    color: "RGBA(0,128,255,255)",
                    text: "A3油漆-天蓝查询结果",
                    },
                { val: 13014,
                    color: "RGBA(128,0,255,155)",
                    text: "A3油漆-靛蓝查询结果",
                    },
                { val: 13015,
                    color: "RGBA(255,0,128,255)",
                    text: "A3油漆-玫红查询结果",
                    },
                { val: 13016,
                    color: "RGBA(128,64,0,255)",
                    text: "A3油漆-卡其查询结果",
                    },
                { val: 13017,
                    color: "RGBA(75,38,0,255)",
                    text: "A3油漆-咖啡查询结果",
                    },
                { val: 13018,
                    color: "RGBA(91,91,91,255)",
                    text: "A3油漆-灰白查询结果",
                    },
                { val: 13019,
                    color: "RGBA(63,63,63,255)",
                    text: "A3油漆-深灰查询结果",
                    },
                { val: 13020,
                    color: "RGBA(0,0,0,255)",
                    text: "A3油漆-黑色查询结果",
                    },

                { val: 23001,
                    color: "RGBA(127,191,255,40)",
                    text: "B3室外玻璃-浅蓝查询结果",
                    },
                { val: 23002,
                    color: "RGBA(0,63,127,63)",
                    text: "B3室外玻璃-深蓝查询结果",
                    },
                { val: 23003,
                    color: "RGBA(127,255,192,63)",
                    text: "B3室外玻璃-浅绿查询结果",
                    },
                { val: 23004,
                    color: "RGBA(0,192,0,63)",
                    text: "B3室外玻璃-深绿查询结果",
                    },
                { val: 23005,
                    color: "RGBA(75,75,75,128)",
                    text: "B3室外玻璃-浅灰查询结果",
                    },
                { val: 23006,
                    color: "RGBA(54,54,54,128)",
                    text: "B3室外玻璃-深灰查询结果",
                    },
                { val: 23007,
                    color: "RGBA(0,63,127,40)",
                    text: "B3室外玻璃-蓝色反射天空查询结果",
                    },
                { val: 23008,
                    color: "RGBA(0,189,0,40)",
                    text: "B3室外玻璃-绿色反射天空查询结果",
                    },
                { val: 23009,
                    color: "RGBA(56,56,56,40)",
                    text: "B3室外玻璃-灰色反射天空查询结果",
                    },
                { val: 23010,
                    color: "RGBA(0,128,255,255)",
                    text: "B3室外玻璃-不透明反射天空查询结果",
                    }]
        }
    },
    //过滤器：
    filters:{
        //日期格式化
        dataFrm(val){
            return moment(val).format("YYYY-MM-DD");
        },
        Type(val){
            let type='';
            if(val==1){
                type='每年'
            }
            else if(val==2){
                type='每月'
            }
            else if(val==3){
                type='每周'
            }
            else if(val==4){
                type='每日'
            }
        return type;
        },
        //任务状态文字化
        statusName(val){
            var text='';
            switch (val) {
                case 1:
                    text='计划未开始';
                    break;
                case 2:
                    text='计划进行中';
                    break;
                case 3:
                    text='计划已完成';
                    break;
                case 4:
                    text='实际未开始';
                    break;
                case 5:
                    text='实际进行中';
                    break;
                case 6:
                    text='实际已完成';
                    break;
                case 7:
                    text='正常进行';
                    break;
                case 8:
                    text='进度拖延';
                    break;
                case 9:
                    text='进度提前';
                    break;
                case 10:
                    text='正常完成';
                    break;
                case 11:
                    text='拖延完成';
                    break;
                case 12:
                    text='提前完成';
                    break;
            }
            if(val=='1000')
            {
                return "";
                }
            else{
                return text;
                }
        },
        //颜色样式化1
        colorView(val){
            return "<span  style='background-color:" + val + ";display:inline-block;width:30px;height:20px;position:relative;top:5px;border-radius:2px;'></span>";
        },
        //颜色样式化
        selectColor(val) {
            var color = "";
            var text = "";
            switch (val) {
                case 12001:
                    color = "RGBA(127,127,127,255)";
                    text = "A2涂料-灰白127";
                    break;
                case 12002:
                    color = "RGBA(159,159,159,255)";
                    text = "A2涂料-灰白159";
                    break;
                case 12003:
                    color = "RGBA(191,191,191,255)";
                    text = "A2涂料-灰白191";
                    break;
                case 12004:
                    color = "RGBA(223,223,223,255)";
                    text = "A2涂料-灰白223";
                    break;
                case 12005:
                    color = "RGBA(255,255,255,255)";
                    text = "A2涂料-纯白";
                    break;
                case 12006:
                    color = "RGBA(255,255,191,255)";
                    text = "A2涂料-浅黄";
                    break;
                case 12007:
                    color = "RGBA(255,240,191,255)";
                    text = "A2涂料-米黄";
                    break;
                case 12008:
                    color = "RGBA(255,232,139,255)";
                    text = "A2涂料-蛋黄";
                    break;
                case 12009:
                    color = "RGBA(255,214,238,255)";
                    text = "A2涂料-淡粉";
                    break;
                case 12010:
                    color = "RGBA(255,152,201,255)";
                    text = "A2涂料-中粉";
                    break;
                case 12011:
                    color = "RGBA(255,62,160,255)";
                    text = "A2涂料-深粉";
                    break;
                case 12012:
                    color = "RGBA(255,105,105,255)";
                    text = "A2涂料-淡红";
                    break;
                case 12013:
                    color = "RGBA(255,62,62,255)";
                    text = "A2涂料-中红";
                    break;
                case 12014:
                    color = "RGBA(255,0,0,255)";
                    text = "A2涂料-深红";
                    break;
                case 12015:
                    color = "RGBA(255,186,116,255)";
                    text = "A2涂料-淡桔";
                    break;
                case 12016:
                    color = "RGBA(255,127,0,255)";
                    text = "A2涂料-桔黄";
                    break;
                case 12017:
                    color = "RGBA(99,255,99,255)";
                    text = "A2涂料-淡绿";
                    break;
                case 12018:
                    color = "RGBA(0,171,0,255)";
                    text = "A2涂料-深绿";
                    break;
                case 12019:
                    color = "RGBA(173,173,255,255)";
                    text = "A2涂料-蓝紫";
                    break;
                case 12020:
                    color = "RGBA(68,199,255,255)";
                    text = "A2涂料-天蓝";
                    break;

                case 13001:
                    color = "RGBA(255,0,0,255)";
                    text = "A3油漆-红色";
                    break;
                case 13002:
                    color = "RGBA(255,255,0,255)";
                    text = "A3油漆-黄色";
                    break;
                case 13003:
                    color = "RGBA(0,255,0,255)";
                    text = "A3油漆-绿色";
                    break;
                case 13004:
                    color = "RGBA(0,255,255,255)";
                    text = "A3油漆-青色";
                    break;
                case 13005:
                    color = "RGBA(0,0,255,255)";
                    text = "A3油漆-蓝色";
                    break;
                case 13006:
                    color = "RGBA(255,0,255,255)";
                    text = "A3油漆-洋红";
                    break;
                case 13007:
                    color = "RGBA(255,255,255,255)";
                    text = "A3油漆-白色";
                    break;
                case 13008:
                    color = "RGBA(167,167,167,255)";
                    text = "A3油漆-浅灰";
                    break;
                case 13009:
                    color = "RGBA(214,214,214,255)";
                    text = "A3油漆-银色";
                    break;
                case 13010:
                    color = "RGBA(255,128,0,255)";
                    text = "A3油漆-桔黄";
                    break;
                case 13011:
                    color = "RGBA(128,255,0,255)";
                    text = "A3油漆-黄绿";
                    break;
                case 13012:
                    color = "RGBA(0,255,128,255)";
                    text = "A3油漆-蓝绿";
                    break;
                case 13013:
                    color = "RGBA(0,128,255,255)";
                    text = "A3油漆-天蓝";
                    break;
                case 13014:
                    color = "RGBA(128,0,255,155)";
                    text = "A3油漆-靛蓝";
                    break;
                case 13015:
                    color = "RGBA(255,0,128,255)";
                    text = "A3油漆-玫红";
                    break;
                case 13016:
                    color = "RGBA(128,64,0,255)";
                    text = "A3油漆-卡其";
                    break;
                case 13017:
                    color = "RGBA(75,38,0,255)";
                    text = "A3油漆-咖啡";
                    break;
                case 13018:
                    color = "RGBA(91,91,91,255)";
                    text = "A3油漆-灰白";
                    break;
                case 13019:
                    color = "RGBA(63,63,63,255)";
                    text = "A3油漆-深灰";
                    break;
                case 13020:
                    color = "RGBA(0,0,0,255)";
                    text = "A3油漆-黑色";
                    break;

                case 23001:
                    color = "RGBA(127,191,255,40)";
                    text = "B3室外玻璃-浅蓝";
                    break;
                case 23002:
                    color = "RGBA(0,63,127,63)";
                    text = "B3室外玻璃-深蓝";
                    break;
                case 23003:
                    color = "RGBA(127,255,192,63)";
                    text = "B3室外玻璃-浅绿";
                    break;
                case 23004:
                    color = "RGBA(0,192,0,63)";
                    text = "B3室外玻璃-深绿";
                    break;
                case 23005:
                    color = "RGBA(75,75,75,128)";
                    text = "B3室外玻璃-浅灰";
                    break;
                case 23006:
                    color = "RGBA(54,54,54,128)";
                    text = "B3室外玻璃-深灰";
                    break;
                case 23007:
                    color = "RGBA(0,63,127,40)";
                    text = "B3室外玻璃-蓝色反射天空";
                    break;
                case 23008:
                    color = "RGBA(0,189,0,40)";
                    text = "B3室外玻璃-绿色反射天空";
                    break;
                case 23009:
                    color = "RGBA(56,56,56,40)";
                    text = "B3室外玻璃-灰色反射天空";
                    break;
                case 23010:
                    color = "RGBA(0,128,255,255)";
                    text = "B3室外玻璃-不透明反射天空";
                    break;//暂定天蓝色
                case 91001:
                    color = "RGBA(255,255,255,255)";
                    text = "U1001自定义";
                    break;
                case 91002:
                    color = "RGBA(255,255,255,255)";
                    text = "U1002自定义";
                    break;
                case 91003:
                    color = "RGBA(255,255,255,255)";
                    text = "U1003自定义";
                    break;
                case 91004:
                    color = "RGBA(255,255,255,255)";
                    text = "U1004自定义";
                    break;
                case 91005:
                    color = "RGBA(255,255,255,255)";
                    text = "U1005自定义";
                    break;
                case 91006:
                    color = "RGBA(255,255,255,255)";
                    text = "U1006自定义";
                    break;
                case 91007:
                    color = "RGBA(255,255,255,255)";
                    text = "U1007自定义";
                    break;
                case 91008:
                    color = "RGBA(255,255,255,255)";
                    text = "U1008自定义";
                    break;
                default:
                    color = "RGBA(255,240,191,255)";
            }
            if(val == "10000"){
                return "";
            }else{
                 return "<span>" + text + ": </span><span  style='background-color:" + color + ";display:inline-block;width:30px;height:20px;position:relative;top:5px;'></span>";
            }
        },

    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.loadingTitle();
        this.getCalendarIndex();//进入季度计划更多设置页面
        // this.getCalendarTemplateInfo();
        // this.checkedItem();
        this.getTaskPriorityList();//获取工程任务优先级
        this.getTaskGroupList();//获取工程任务组别列表
        // this.getResourceType();//获取资源类别
        this.getLodeTaskCheckConfig();//获取任务核实配置信息
        this.getlodeComponentCheckConfig();//获取构件完工核实配置信息
        this.getTaskStatusList();//获取工程任务状态列表
        
    },
    watch:{

    },
    methods:{
        //时间选择器
            StrToGMT(time){
                let GMT = new Date(time)
                return GMT
            },
        getSTime(val){
           console.log(val);
        },
        loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'005','00504','/SchedulePlan/calendarConfig','00503','/SchedulePlan/taskIndex','00501','/SchedulePlan/personalCalendar','00502','/SchedulePlan/resourcePlan','00505','/SchedulePlan/simulation');
          console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4,Code5,routerLink5){
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
                    if(item.moduleCode==Code5){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink5);
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
        //日历
        
        selecttime(item,index){
            if(item.num===0){
                this.weektimeList[index].num=1
            } else if(item.num===1) {
                this.weektimeList[index].num=0
            }
           
           
        },
        checkedItem(num,index){
                this.isActive=num;
                this.index=index;
                this.currentStyle=false;
                this.getCalendarTemplateInfo(this.calendarIndex[this.index].id);
                },
                
        //获取日历模板工作周列表、例外日期列表
        getCalendarTemplateInfo(id){
           
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/calendarTemplate/info',
                headers:{
                    'token':this.token
                },
                params:{
                    tempId:id
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.cwtList = response.data.rt.cwtList;
                    this.cedList =response.data.rt.cedList;
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //进入季度计划更多设置页面
        getCalendarIndex(){
            axios({
                method:'get',
                url:this.BDMSUrl+'schedule/calendarIndex',
                headers:{
                    'token':this.token
                },
                params:{
                projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){

                    this.calendarIndex=response.data.rt;
                    this.calendarIndex.forEach((item)=>{
                        if(item.tempStatus==1){
                           
                            this.getCalendarTemplateInfo(item.id);
                            this.numId=item.id;
                           
                            // this.addweektimeMakeSure(item.id)
                        }

                    })
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取工程任务优先级
        getTaskPriorityList(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskPriority/list',
                 headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.tpType=response.data.rt.tpType;
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //修改工程任务优先级
        changePriority(index){
            this.updateTaskPriorityDialog=true;
            this.tpType1=index;
        },
        updateTPListSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskPriority/update',
                 headers:{
                    'token':this.token
                },
                params:{
                    type:this.tpType1
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.getTaskPriorityList();
                    this.tpType='';
                    this.updateTaskPriorityDialog=false;
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //取消修改任务优先级
        updateTPCancelBtn(){
             this.updateTaskPriorityDialog=false;
        },
        //获取工程任务组别列表
        getTaskGroupList(){
            axios({
                method:'get',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskGroup/list',
                headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.taskGroupList=response.data.rt;
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //
        tnvalueChange(){
            this.value=this.tnvalue;
            this.loadParentCode();
        },
        pcvalueChange(){
            this.value=this.pcvalue;
        },
        //加载分类编码
        loadParentCode(){
             axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/resourceType/loadParentCode',
                headers:{
                    'token':this.token
                },
                params:{
                    tableNo:this.value
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.loadparentCodeList=response.data.rt;
                    this.loadparentCodeList.forEach((item)=>{
                        if(item.tableNo==this.value){
                            this.pcvalue=item.classifyCode;
                        }
                    })
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取资源类别
        getResourceType(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/resourceType/getResouceType',
                headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.resourceType=response.data.rt;
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //资料类别删除
        deleteResoureType(num){
            this.deleteRTNum=num;
            this.deleteResourceTypeDialog=true;   
        },
        // 增加资源类别
        addResourceType(){
            this.addResourceTypeDialog=true;
            this.tnvalue=this.tableNoList[0].val;
            this.value=this.tableNoList[0].val;
            this.loadParentCode();
        },
        //确认增加资源类别
        addResourceTypeSure(){
            if(this.rTypeName==''){
                alert('资源类别名称不能为空');
                return;
            }
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/resourceType/addResouceType',
                 headers:{
                    'token':this.token
                },
               data:{
                   name:this.rTypeName,
                   parentCode:this.pcvalue,
                   tableNo:this.tnvalue,
               }
            }).then(response=>{
                if(response.data.cd == '0'){
                   this.getResourceType();
                   this.addResourceTypeDialog=false;
                   this.rTypeName='';
                   this.pcvalue='';
                   this.tnvalue='';
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })

        },
        addRTCancelBtn(){
            this.addResourceTypeDialog=false;
        },
        //资源类别删除确认
        deleteRTMakeSure(){
             axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/resourceType/deleteResouceType',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.resourceType[this.deleteRTNum].id
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getResourceType();
                    this.id="";
                    this.deleteResourceTypeDialog=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //取消资源类别删除
        deleteRTlistClose(){
           this.deleteResourceTypeDialog=false;    
        },
        //获取任务核实配置信息
        getLodeTaskCheckConfig(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/lodeTaskCheckConfig',
                headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.taskCheckValue=response.data.rt;
                    //    if(this.taskCheckValue.confVal==this.taskCheckName.value)
                    this.taskCheckValue=this.taskCheckValue.confVal
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取构件完工核实配置信息
        getlodeComponentCheckConfig(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/lodeComponentCheckConfig',
                headers:{
                    'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.componentCheckValue=response.data.rt;
                    //    if(this.componentCheckValue.confVal==this.componentCheckName.value)
                    this.componentCheckValue=this.componentCheckValue.confVal
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取工程任务状态列表
        getTaskStatusList(){
            axios({
                method:'get',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskStatus/list',
                headers:{
                     'token':this.token
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    var rt = response.data.rt;
                    rt.forEach((item,index,arr)=>{
                        if(item.useInView==1){
                            item.view=true;
                        }else{
                            item.view=false;
                        }
                        this.taskStatusList.push(item);
                    })
                    
                   
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //应用表格改变事件(这个还有错误)
        checkChange(index){

            this.setUseInView(index);
        },
        //应用到表格
        setUseInView(index){
            axios({
                method:'get',
                url:this.BDMSUrl+'schedule/setUseInView',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.taskStatusList[index].id,
                    useInView:this.taskStatusList[index].view?1:0
                },
            }).then(response=>{
                if(response.data.cd=='0'){
                    // this.getTaskStatusList();
                    this.id='';
                    this.view='';
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }
            })
        },
        //更改任务状态图例
        updateTSColor(index){
            this.updateTaskStatusColorDialog=true;
            this.taskStatusList.forEach((item)=>{
                if(item.id==index){
                    this.id=item.id;
                    this.taskStatusName=item.taskStatus
                    this.value=item.colorValue;
                   this.taskStatusColorOne=this.TSColor(this.value);
                }
            })
        },
        //更改任务状态图例改变监听
        taskStatusColorChange(){
            if(this.value==''){
                this.showTaskStatusColor=false;
            }else{
            this.showTaskStatusColor=true;
            this.taskStatusColorOne=this.TSColor(this.value);
            }
        },
        //任务状态图例颜色格式化
        TSColor(index){
            var vm=this;
            let color='';
            this.taskStatusColor.forEach((item)=>{
                if(item.val==index){
                    color=item.color;
                }
            });
            return color;
        },
        //任务状态图例确认
        updateTSColorSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskStatus/updateColor',
                headers:{
                    'token':this.token
                },
                data:{
                    colorValue:this.value,
                    id:this.id
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getTaskStatusList();
                    this.updateTaskStatusColorDialog=false;
                    this.taskStatusList=[];
                    this.value='';
                    // alert('更改图例成功');
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        updateTSColorCancelBtn(){
            this.updateTaskStatusColorDialog=false;
        },
        //点击新增工作周
        addweektime(){
            this.addweektimeDialog=true;
            // this.getCalendarTemplateInfo(id);
           
            this.calendarIndex.forEach((item)=>{
                // var vm=this;
                if(item.id==this.isActive)
                {
                    this.numId=item.id;
                    
                }
            })
            
        },
        //取消新增工作周
        addWTCancle(){
                this.cwtimeName='';
                this.startweektimeValue='';
                this.endweektimeValue='';
                this.numId='';
               this.weektimeList.forEach((item,index)=>{
                   if(index>4){
                       item.num=1;
                   }else{
                       item.num=0;
                   }
               });
               this.getCalendarIndex();
                this.addweektimeDialog=false;
        },
        //确认新增工作周
        addweektimeMakeSure(){
            let weekNum = [];
            this.weektimeList.forEach((item)=>{
                weekNum.push(item.num);
            })
            weekNum = weekNum.join("")
               
            axios({
            method:'post',
            url:this.BDMSUrl+'schedule/'+this.projId+'/weekTime/add',
            headers:{
                'token':this.token
            },
            data:{
                cwtContent:weekNum,
               id:'',
               cwtType:1,
               cwtName:this.cwtimeName,
               cwtStart:this.dateChange(this.startweektimeValue),
               cwtEnd:this.dateChange(this.endweektimeValue),
               tempId:this.numId

            }
        }).then(response=>{
            if(response.data.cd=='0'){
                this.addweektimeDialog=false;
                this.getCalendarTemplateInfo(this.numId);
                this.getCalendarIndex();
                this.cwtimeName='';
                this.startweektimeValue='';
                this.endweektimeValue='';
                this.weekNum='';
            }else if(response.data.cd=='-1'){
                alert(response.data.msg)   
            }else{
                this.$router.push({
                    path:'/login'
                })
            }
        })
        },
        // 详细工作周
        detailweektime(index){
            this.deatailWeekNum=index;
            this.weekNumList=this.cwtList[ this.deatailWeekNum].cwtContent.split('');
            
            this.weektimeList.forEach((item,index)=>{
                item.num=0;
                if(this.weekNumList[index]==1){
                    item.num=1
                }
            })
            
        },
        //编辑工作周
        updateweektime(index){
            this.weektimeNum=index;
            this.cwtId=this.cwtList[this.weektimeNum].id;
            this.cwtimeName=this.cwtList[this.weektimeNum].cwtName;
            this.startweektimeValue=this.StrToGMT(this.cwtList[this.weektimeNum].cwtStart);
            this.endweektimeValue=this.StrToGMT(this.cwtList[this.weektimeNum].cwtEnd);

             this.calendarIndex.forEach((item)=>{
                var vm=this;
                if(item.id==this.isActive)
                {
                    this.numId=item.id;
                   
                }
            })
            this.weekNumList=this.cwtList[this.weektimeNum].cwtContent.split('');
           
            this.weektimeList.forEach((item,index)=>{
                item.num=0;
                if(this.weekNumList[index]==1){
                    item.num=1
                }
            })
            this.updateweektimeDialog=true;
        },
        // 时间检查器
        dateChange(val){
            return moment(val).format("YYYY-MM-DD");
        },
        updateWTCancle(){
                this.cwtimeName='';
                this.startweektimeValue='';
                this.endweektimeValue='';
                this.numId='';
               this.weektimeList.forEach((item,index)=>{
                   if(index>4){
                       item.num=1;
                   }else{
                       item.num=0;
                   }
               });
            this.updateweektimeDialog=false;
        },
        updateweektimeMakeSure(){
             let weekNum = [];
            this.weektimeList.forEach((item)=>{
                weekNum.push(item.num);
            })
            weekNum = weekNum.join("")
            axios({
            method:'post',
            url:this.BDMSUrl+'schedule/'+this.projId+'/weekTime/update',
            headers:{
                'token':this.token
            },
            data:{
                cwtContent:weekNum,
               id:this.cwtId,
               cwtType:1,
               cwtName:this.cwtimeName,
               cwtStart:this.dateChange(this.startweektimeValue),
               cwtEnd:this.dateChange(this.endweektimeValue),
               tempId:this.numId

            }
        }).then(response=>{
            if(response.data.cd=='0'){
                this.updateweektimeDialog=false;
                this.getCalendarTemplateInfo(this.numId);
                this.getCalendarIndex();
                this.cwtimeName='';
                this.startweektimeValue='';
                this.endweektimeValue='';
                this.weektimeList.forEach((item,index)=>{
                    if(item.index>4){
                        item.num=1
                    }
                })
            }else if(response.data.cd=='-1'){
                alert(response.data.msg)   
            }else{
                this.$router.push({
                    path:'/login'
                })
            }
        })

        },
        //删除工作周
        
    //删除工作周
        deleteWeekTime(num){
            this.deleteWeekTimeNum=num;
            this.deleteWeekTimeDialog=true;
            this.calendarIndex.forEach((item)=>{
                if(item.id==this.isActive)
                {
                    this.numId=item.id;
                    
                }
            })
        },
        deleteWTMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/weekTime/delete',
                headers:{
                    token:this.token
                },
                params:{
                   cwtId:this.cwtList[this.deleteWeekTimeNum].id
                },
            }).then(response=>{
                if(response.data.cd == '0'){
                   this.getCalendarTemplateInfo(this.numId);
                   this.getCalendarIndex();
                    this.deleteWeekTimeDialog=false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        // 取消删除工作周
        deleteWTlistClose(){
            this.deleteWeekTimeDialog=false;
        },
        //点击新增日历模板
        addCalendarTemplate(){
            this.addDialog=true;
        },
        //点击新增例外休息日
        addExceptionDate(){
            this.addExceptionDateDialog=true;
            this.shifouday=this.workDayList[1].value;
            this.repeatway=this.cedTypeList[0].value;
            this.calendarIndex.forEach((item)=>{
                if(item.id==this.isActive)
                {
                    this.numId=item.id;
                   
                }
            })
        },
        //点击编辑例外休息日
        undateExceptionDate(index){
             this.updateExceptionDateDialog=true;
            this.cedListNum=index;
            this.id=this.cedList[this.cedListNum].id;
            this.cedContent=this.cedList[this.cedListNum].cedContent;
            this.cedateName=this.cedList[this.cedListNum].cedName;
            this.shifouday=this.cedList[this.cedListNum].workDay;

            this.repeatway=this.cedList[this.cedListNum].cedType;
             if(this.repeatway=="4"){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=false;
            }
            else if(this.repeatway=="3")
            {
                this.weekdayshow=true;
                this.monthshow=false;
                this.yearshow=false;
               this.checkWeekListNum=this.cedList[this.cedListNum].cedContent.split('');
             this.checkWeekNumList.forEach((item,index)=>{
                  if(item.num==this.checkWeekListNum[index])
                     {
                          this.checkList.push(item.text)
                      }  
              });
              this.checkList=Array.from(new Set(this.checkList));
              
            }
            else if(this.repeatway=="2")
            {
                this.weekdayshow=false;
                this.monthshow=true;
                this.yearshow=false;
                this.value=this.cedList[this.cedListNum].cedContent;
               
            }
            else if(this.repeatway=="1"){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=true;
                this.yearList=this.cedList[this.cedListNum].cedContent.split('-');
                this.item1= this.yearList[0];
                this.item2= this.yearList[1];
            }
             this.startValue=this.StrToGMT(this.cedList[this.cedListNum].cedStart);
            this.endValue=this.StrToGMT(this.cedList[this.cedListNum].cedEnd);
        },
        //删除例外休息日
        deleteExceptionDate(num)
        {
            this.deleteExceptionDateNum=num;
            this.deleteExceptionDateDialog=true;
            this.calendarIndex.forEach((item)=>{
                if(item.id==this.isActive)
                {
                    this.numId=item.id;
                   
                }
            })
        },
        deleteETMakeSure(){
             axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/exceptionDate/delete',
                headers:{
                    token:this.token
                },
                params:{
                   cedId:this.cedList[this.deleteExceptionDateNum].id
                },
            }).then(response=>{
                if(response.data.cd == '0'){
                   this.getCalendarTemplateInfo(this.numId);
                   this.getCalendarIndex();
                    this.deleteExceptionDateDialog=false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        deleteETlistClose(){
            this.deleteExceptionDateDialog=false;
            

        },
        //确认
        addMakeSure(){  
            if(this.templateName=="")
            {alert('请输入模板名称');}
            else{
                axios({
                    method:'post',
                   url:this.BDMSUrl+'schedule/'+this.projId+'/calendarTemplate/add',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    data:{
                        tempName:this.templateName,
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){

                        this.getCalendarIndex();
                        this.templateName='';
                        this.addDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        edit(index){
            this.editDialog = true;
            this.index = index;
            this.templateName=this.calendarIndex[index].tempName;
           
            // this.editMakeSure()
        },
        editMakeSure(){
           
           
            if(this.templateName=="")
            {alert('请输入模板名称');}
            else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/calendarTemplate/update',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    data:{
                        id:this.calendarIndex[this.index].id,
                        // projId:this.calendarIndex[this.index].projId,
                        tempName:this.templateName,
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.getCalendarIndex();
                        this.templateName='';
                        this.editDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        workDayChange(){
            this.workDayList.forEach((item,index)=>{
                if(this.shifouday==item.value){
                    this.shifouday=item.value
                }
            })
           
        },
        //重复工作日期改变触发
        cedTypeChange(){
            this.cedTypeList.forEach((item,index)=>{
                if(this.repeatway==item.value)
                {
                    this.repeatway=item.value;
                }
            })
           
            if(this.repeatway=="4"){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=false;
            }
            else if(this.repeatway=="3")
            {
                this.weekdayshow=true;
                this.monthshow=false;
                this.yearshow=false;
                this.changeweekday()
                //  this.checkList='';
               
            }
            else if(this.repeatway=="2")
            {
                this.weekdayshow=false;
                this.monthshow=true;
                this.yearshow=false;
                this.value=1;
                this.changemonth();
               
            }
            else if(this.repeatway=="1"){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=true;
            }
        },
        //
        changeweekday(){
            // this.checkList=this.checkList;
            this.checkWeekList.forEach((item,index)=>{
                this.checkList.forEach((item1)=>{
                    if(item.text==item1){
                    item.num=1
                    }
                })
            });
             let weekNum1 = [];
            this.checkWeekList.forEach((item)=>{
                weekNum1.push(item.num);
            });
            weekNum1 = weekNum1.join("");
            //  this.cedContent=weekNum1;
             
              this.cedContent=weekNum1; 
        },
        changemonth(){
            this.cedContent=this.value  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        },
        changeyearshow1(){
            for(let i=1;i<=12;i++){
                if(i==this.item1){
                    this.item1=i
                }
            }
            this.cedContent=this.item1+'-'+this.item2;
           
        },
        changeyearshow2(){
            for(let i=1;i<=31;i++){
                if(i==this.item2){
                    this.item2=i
                }
            }
           this.cedContent=this.item1+'-'+this.item2;
            // this.cedContent=this
        },
        //添加例外休息日确定
        addCedList(){
           
            if(this.cedateName==''){
                alert('请输入名称')
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/exceptionDate/add',
                    headers:{
                        'token':this.token
                    },
                    data:{
                        tempId:this.numId,
                        id:'',
                        cedName:this.cedateName,
                        cedType:this.repeatway,
                        workDay:this.shifouday,
                        cedContent:this.cedContent,
                        cedStart:this.startValue,
                        cedEnd:this.endValue,
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.getCalendarTemplateInfo(this.numId);
                        this.getCalendarIndex();
                        this.shifouday=this.workDayList[0].value;
                        this.repeatway=this.cedTypeList[0].value;
                        if(this.repeatway='4'){
                            this.weekdayshow=false;
                            this.monthshow=false;
                            this.yearshow=false;
                        };
                        this.cedateName='';
                        this.cedContent='';
                        this.checkList=[];
                        this.startValue='';
                        this.endValue='';
                        this.addExceptionDateDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //编辑例外休息日确定
        updateEDMakeSure(){
            if(this.cedateName==''){
                alert('请输入名称')
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/exceptionDate/update',
                    headers:{
                        'token':this.token
                    },
                    data:{
                        tempId:this.numId,
                        id:this.id,
                        cedName:this.cedateName,
                        cedType:this.repeatway,
                        workDay:this.shifouday,
                        cedContent:this.cedContent,
                        cedStart:this.dateChange(this.startValue),
                        cedEnd:this.dateChange(this.endValue),
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.getCalendarTemplateInfo(this.numId);
                        this.getCalendarIndex();
                        this.shifouday=this.workDayList[0].value;
                        this.repeatway=this.cedTypeList[0].value;
                        if(this.repeatway='4'){
                            this.weekdayshow=false;
                            this.monthshow=false;
                            this.yearshow=false;
                        };
                        this.cedateName='';
                        this.cedContent='';
                        this.checkList=[];
                        this.startValue='';
                        this.endValue='';
                       this.updateExceptionDateDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
            
        },
        upadteEDlistClose(){
            this.cedListNum='';
            this.cedateName='';
            this.shifouday=this.workDayList[0].value;
            this.startValue='';
            this.endValue='';
            this.repeatway=this.cedTypeList[0].value;
            if(this.repeatway='4'){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=false;
            };
            this.updateExceptionDateDialog=false
        },
        //弹窗关闭
        addCancle(){
            this.addDialog=false;
            this.templateName=''
        },
        editCancle(){
            this.editDialog=false;
            this.templateName=''
        },
        listClose(){
            this.addExceptionDateDialog=false;
            this.cedateName='';
            this.repeatway=this.cedTypeList[0].value;
            if(this.repeatway='4'){
                this.weekdayshow=false;
                this.monthshow=false;
                this.yearshow=false;
            };
        },
        //新增任务组别
        addTaskGroup(){
            this.addTaskGroupDialog=true;
            this.selectTGColor=this.taskGroupColor[0].value;
            this.showtaskGroupColor=true;
            this.taskGroupColorOne=this.toBeColor(this.selectTGColor);
        },
        //新增任务组别确定
        addTaskGroupSure(){
            if(this.tGroupName==''){
                alert('请输入任务组别名称')
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/taskGroup/add',
                    headers:{
                        'token':this.token
                    },
                    data:{
                        tgColor:this.selectTGColor,
                        tgName:this.tGroupName
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.getTaskGroupList();
                        this.selectTGColor='';
                        this.tGroupName='';
                        this.addTaskGroupDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //取消任务组别
        addGroupCancelBtn(){
            this.addTaskGroupDialog=false;
            this.tGroupName='';
            this.selectTGColor='';
        },
        //编辑任务组别确定
        editTaskGroupSure(){
            if(this.tGroupName==''){
                alert('请输入任务组别名称')
            }else{
                 axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/taskGroup/update',
                    headers:{
                        'token':this.token
                    },
                    data:{
                        id:this.id,
                        tgColor:this.selectTGColor,
                        tgName:this.tGroupName
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.getTaskGroupList();
                        this.id='';
                        this.selectTGColor='';
                        this.tGroupName='';
                        this.editTaskGroupDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //删除任务组别确定
        deleteTGMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'schedule/'+this.projId+'/taskGroup/delete',
                headers:{
                    token:this.token
                },
                params:{
                   tgId:this.taskGroupList[this.deteleGroupNum].id
                },
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.getTaskGroupList();
                    this.deleteTaskGroupDialog = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //取消删除任务组别
        deleteTGlistClose(){
          this.deleteTaskGroupDialog = false;  
        },
        //取消编辑任务组别
        editGroupCancelBtn(){
            this.editTaskGroupDialog=false;
            this.tGroupName='';
            this.selectTGColor='';
        },
        taskGroupColorChange(){
            this.taskGroupColor.forEach((item)=>{
                if(this.selectTGColor==item.value){
                    this.selectTGColor=item.value
                }
            })
                this.showtaskGroupColor=true;
                this.taskGroupColorOne=this.toBeColor(this.selectTGColor);
        },
        //颜色变化器
        toBeColor(val){
            return val;
        },
        editGroup(index){
          
            this.taskGroupList.forEach((item)=>{
                if(item.id==index){
                   this.tGroupName=item.tgName;
                    this.selectTGColor=item.tgColor;
                    this.id=item.id;
                    this.showtaskGroupColor=true;
                    this.taskGroupColorOne=this.toBeColor(this.selectTGColor);
                };
               
                
            });
       
            this.editTaskGroupDialog=true;
        },
        deleteGroup(num){
            this.deteleGroupNum=num;
            this.deleteTaskGroupDialog=true;
        },
        //修改任务核实
        updateComponentCheck(){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'schedule/'+this.projId+'/alterCheckConfig',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        taskCheckValue:this.taskCheckValue,
                        componentCheckValue:this.componentCheckValue
                    }
            }).then(response=>{
                    if(response.data.cd=='0'){
                        // this.getLodeTaskCheckConfig();
                        // this.getlodeComponentCheckConfig();
                        alert('任务核实修改成功')
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
        }
    },
}
</script>
