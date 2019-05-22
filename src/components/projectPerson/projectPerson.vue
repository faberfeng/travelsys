<template>
    <div id="personContent">
        <div class="contentHead">
            <div class="contentHeadLeft">
                <img class="imgCenter" :src="userImg?userImg:require('../../assets/people.png')">
            </div>
            <div class="contentHeadRight">
                <ul style="width:50%;height:inherit;float:left;">
                    <li class="rightLi">
                        <label class="nameLabel">姓名：</label><label class="itemLabel">{{getStaffProfileList.name}}</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">账号：</label><label class="itemLabel"></label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">工种：</label><label class="itemLabel">{{returnPosition(queryAttendancyRecordByUserList.positions)}}</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">单位：</label><label class="itemLabel">{{queryAttendancyRecordByUserList.groupName}}</label>
                    </li>
                </ul>
                <ul style="width:50%;height:inherit;float:right;">
                    <li class="rightLi">
                        <label class="nameLabel">诚信评价：</label><label class="itemLabel">
                            <el-rate
                                v-model="honestyValue"
                                disabled
                                show-score
                                text-color="#ff9900">
                                </el-rate>
                        </label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">本月考勤：</label><label class="itemLabel">{{queryAttendancyRecordByUserList.absentDay}}天</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">出勤班次：</label><label class="itemLabel">{{queryAttendancyRecordByUserList.presentDay}}天</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">休息天数：</label><label class="itemLabel">{{queryAttendancyRecordByUserList.restDay}}天</label>
                    </li>

                </ul>
            </div>
        </div>
        <div class="contentBottom">
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                    <div class="basicInfWrapper">
                        <div class="leftWrapper">
                            <div class="boxInp">
                                <label class="wrapperLabel">姓名:</label>
                                <input v-model="name" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">民族:</label>
                                <input v-model="nation" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">性别:</label>
                                <select v-model="sex" class="wrapperInp" :disabled="!editShow" placeholder="请选择">
                                    <option class="optionClass" v-for="item in sexOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    {{item.label}}
                                    </option>
                                </select>
                                <!-- <el-select v-model="sex" width="65%" placeholder="请选择">
                                    <el-option
                                    v-for="item in sexOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> -->
                                <!-- <input v-model="sex" class="wrapperInp"/> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">出生年月:</label>
                                <!-- <input v-model="birthday" class="wrapperInp"/> -->
                                <span class="wrapperInp" style="position:relative;">
                                    <v2-datepicker format="yyyy-MM-DD" :disabled="!editShow" style="border:none;left:0px;top:3px;position:absolute;" v-model="birthday" width="100%" ></v2-datepicker>
                                </span>
                                <!-- <el-date-picker
                                    v-model="birthday"
                                    type="date"
                                    width="65% !important"
                                    placeholder="选择日期">
                                </el-date-picker> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">文化程度:</label>
                                <select v-model="education" :disabled="!editShow" class="wrapperInp" placeholder="请选择">
                                    <option class="optionClass" v-for="item in eduOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    {{item.label}}
                                    </option>
                                </select>
                                <!-- <input v-model="education" class="wrapperInp"/> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">专业:</label>
                                <input v-model="profession" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">联系方式:</label>
                                <input v-model="phone" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">住址:</label>
                                <input v-model="address" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">现住址:</label>
                                <input v-model="registeredAddress" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">身份证号:</label>
                                <input v-model="certificationNo" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">职称:</label>
                                <input v-model="technicalTitle" :readonly="!editShow" class="wrapperInp"/>
                            </div>
                        </div>
                        <div class="rightWrapper">
                            <div class="rightBox">
                                <label class="wrapperLabel"></label>
                                <span style="width:65%;display:inline-block;position:relative;height:132px;">
                                    <span class="imgCircle" >
                                        <img v-if="avaterUri" :src="avaterUriFile"/>
                                        <i v-if="!avaterUri||editShow" class="el-icon-circle-plus" @click="clickUserImg()">
                                        </i>
                                        <label v-if="!avaterUri" style="display:block">上传头像</label>
                                        <input type="file" ref="uploadUserImg"  accept="images/*" @change="changeUserImg($event)" style="opacity:0">
                                    </span>
                                </span>
                            </div>
                            <!-- <div class="rightBox">
                                <label class="wrapperLabel">身份证号:</label>
                                <input v-model="certificationNo" class="wrapperInp"/>
                            </div> -->
                            <div class="rightBox">
                                 <label class="wrapperLabel"></label>
                                  <span style="width:65%;display:inline-block;position:relative;height:140px;">
                                    <span class="personCircle"  @click="clickCertificate()">
                                        <i v-if="!certificationPhoto||editShow" class="el-icon-upload"></i>
                                        <img v-if="certificationPhoto" :src="certificationPhoto">
                                        
                                        <label v-if="!certificationPhoto" style="display:block">上传身份证照片</label>
                                    </span>
                                    <input type="file" ref="uploadCertificateImg"  accept="images/*" @change="changeCertificateImg($event)" style="opacity:0">
                                  </span>
                            </div>
                            <div class="rightBox">
                                <!-- 岗位证书: -->
                                <label class="wrapperLabel"></label>
                                <span style="width:65%;display:inline-block;position:relative;height:140px;">
                                    <span class="personCircle" @click="clickstationCertificate()">
                                        <img v-if="stationCertiyPhoto" :src="stationCertiyPhoto">
                                        <i v-if="!stationCertiyPhoto||editShow" class="el-icon-upload"></i>
                                        <label v-if="!stationCertiyPhoto" style="display:block">上传岗位证书照</label>
                                    </span>
                                    <input type="file" ref="uploadStationCertificateImg"  accept="images/*" @change="changestationCertiImg($event)" style="opacity:0">
                                  </span>
                            </div>
                            <!-- <div class="rightBox">
                                <label class="wrapperLabel">职称:</label>
                                <input v-model="technicalTitle" class="wrapperInp"/>
                            </div> -->
                            <div class="makeBtn">
                                <span v-if="editShow" class="btnSure" @click="personInfoMakeSure">确认</span>
                                <span v-if="!editShow" class="btnSure" @click="editPersonInfoMakeSure">编辑</span>
                            </div>
                        </div>
                    </div>
                    
                </el-tab-pane>
                <el-tab-pane label="考勤信息">
                    <!-- <div class="enterInfWrapper">
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
                        </div>
                    </div> -->
                    <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>姓名</th>
                                            <th>部门</th>
                                            <th>进场时间</th>
                                            <th>打卡方式</th>
                                            <th>考勤情况</th>
                                            <th>出场时间</th>
                                            <th>打卡方式</th>
                                            <th>考勤情况</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in getAttendancyByUserIdList" :key="index">
                                            <td>{{index+1}}</td>
                                            <td>{{item.department}}</td>
                                            <td>{{timeChange(item.enterTime)}}</td>
                                            <td>{{entOutCheckType(item.checkInType)}}</td>
                                            <td>{{doorType(item.enterStatus)}}</td>
                                            <td>{{timeChange(item.leaveTime)}}</td>
                                            <td>{{entOutCheckType(item.checkOutType)}}</td>
                                            <td>{{doorType(item.leaveStatus)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <el-tab-pane label="从业信息">
                    <div class="workInfoWrapper">
                        <div class="header">
                            <div class="titleBtn" @click="editWork">
                                <i class="el-icon-edit"></i>
                                当前工作信息
                            </div>
                            <div class="titleInfo">
                                <div class="Wrapper" style="float:left;">
                                    <div class="boxInp">
                                        <label class="wrapperLabel">岗位:</label>
                                        <input class="wrapperInp" :readonly="getStaffWorkingInfoList==''?false:true" v-model="duty"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="vertical-align:top;">入职时间:</label>
                                        <!-- <el-date-picker
                                        v-model="entryDate"
                                            type="date"
                                            placeholder="选择日期"  class="wrapperInp">
                                        </el-date-picker> -->
                                        <!-- <input class="wrapperInp"/> -->
                                        <span class="wrapperInp" style="position:relative">
                                            <v2-datepicker format="yyyy-MM-DD" :disabled="getStaffWorkingInfoList==''?false:true" style="border:none;left:0px;top:3px;position:absolute;" v-model="entryDate" width="100%" ></v2-datepicker>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">所属单位:</label>
                                        <input class="wrapperInp" :readonly="getStaffWorkingInfoList==''?false:true" v-model="department"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">成员类型:</label>
                                        <select :disabled="getStaffWorkingInfoList==''?false:true" v-model="type"  class="wrapperInp">
                                            <option v-for="(item,index) in personTypeList" :key="index" :value="item.value">{{item.label}}</option>
                                        </select>
                                        <!-- <input class="wrapperInp"/> -->
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="vertical-align:top;">合同到期:</label>
                                        <!-- <input class="wrapperInp"/> -->
                                        
                                        
                                        <span class="wrapperInp" style="position:relative">
                                            <!-- <el-date-picker
                                                type="date" v-model="contractExpireDate"
                                                placeholder="选择日期" style="border:none !important"  >
                                            </el-date-picker> -->
                                            <v2-datepicker format="yyyy-MM-DD" style="border:none;left:0px;top:3px;position:absolute;" :disabled="getStaffWorkingInfoList==''?false:true" v-model="contractExpireDate" width="100%" ></v2-datepicker>
                                        </span>
                                    </div>
                                </div>
                                <div class="Wrapper" style="float:right;">
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">三级安全教育卡:</label>
                                        <span v-if="!getStaffWorkingInfoList" class="wrapperSpan">
                                            <span class="buttonSpan" @click="educateClick">
                                                <i class="el-icon-upload2"></i>
                                                点击上传
                                                <input type="file" style="display:none;" @change="changeEducate($event)" ref="educateFile"/>
                                            </span>
                                            <label class="buttonLabel">{{educateName}}</label>
                                        </span>
                                        <span v-if="getStaffWorkingInfoList" @click="downloadFiles(thirdLevelSecurityEducationCard)" class="wrapperSpan">
                                            <span class="buttonSpan">
                                            <i class="el-icon-download" ></i>
                                            点击查看
                                            </span>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">安全交底记录:</label>
                                        <span v-if="!getStaffWorkingInfoList" class="wrapperSpan">
                                            <span class="buttonSpan" @click="safeSubmitClick()">
                                                <i class="el-icon-upload2"></i>
                                                点击上传
                                                <input type="file" style="display:none;" id="safeSubmitFile" @change="changesafeSubmit($event)" ref="safeSubmitFile"/>
                                            </span>
                                            <label class="buttonLabel">{{safeSubmitName}}</label>
                                        </span>
                                        <span v-if="getStaffWorkingInfoList" @click="downloadFiles(safeRecord)" class="wrapperSpan">
                                            <span class="buttonSpan">
                                            <i class="el-icon-download" ></i>
                                            点击查看
                                            </span>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">技术交底记录:</label>
                                        <!-- <input class="wrapperInp"/> -->
                                        <span v-if="!getStaffWorkingInfoList" class="wrapperSpan">
                                            <span class="buttonSpan" @click="technologyClick">
                                                <i class="el-icon-upload2"></i>
                                                点击上传
                                                <input type="file" style="display:none;" id="technologyFile" @change="changeTechnology($event)" ref="technologyFile"/>
                                            </span>
                                            <label class="buttonLabel">{{technologyName}}</label>
                                        </span>
                                        <span v-if="getStaffWorkingInfoList" @click="downloadFiles(technicalRecord)" class="wrapperSpan">
                                            <span class="buttonSpan">
                                            <i class="el-icon-download" ></i>
                                            点击查看
                                            </span>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">特种操作证书:</label>
                                        <!-- <input class="wrapperInp"/> -->
                                        <span v-if="!getStaffWorkingInfoList" class="wrapperSpan">
                                            <span class="buttonSpan" @click="specialClick">
                                                <i class="el-icon-upload2"></i>
                                                点击上传
                                                <input type="file" style="display:none;" id="specialFile" @change="changeSpecial($event)" ref="specialFile"/>
                                            </span>
                                            <label class="buttonLabel">{{specialName}}</label>
                                        </span>
                                        <span v-if="getStaffWorkingInfoList" @click="downloadFiles(specialOperationCertificate)" class="wrapperSpan">
                                            <span class="buttonSpan">
                                            <i class="el-icon-download" ></i>
                                            点击查看
                                            </span>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">合同附件:</label>
                                        <!-- <input class="wrapperInp"/> -->
                                        <span v-if="!getStaffWorkingInfoList" class="wrapperSpan">
                                            <span class="buttonSpan" @click="contractClick()">
                                                <i class="el-icon-upload2"></i>
                                                点击上传
                                                <input type="file" style="display:none;" id="contractFile" @change="changeContract($event)" ref="contractFile"/>
                                            </span>
                                            <label class="buttonLabel">{{contractName}}</label>
                                        </span>
                                        <span v-if="getStaffWorkingInfoList" @click="downloadFiles(appendicesContract)" class="wrapperSpan">
                                            <span class="buttonSpan">
                                            <i class="el-icon-download" ></i>
                                            点击查看
                                            </span>
                                        </span>
                                    </div>
                                    <div class="boxInp">
                                            <span v-if="!getStaffWorkingInfoList" class="makeSureBtn" @click="makeSureWork">确认</span>
                                            <!-- <span v-if="getStaffWorkingInfoList" class="makeSureBtn" @click="editWork">编辑</span> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="titleBtnLeft">
                                <i class="el-icon-document"></i>
                                过往履历信息
                            </div>
                            <div class="titleBtnRight" @click="addWorkExperience()">
                                <i class="el-icon-circle-plus"></i>
                                添加工作经验
                            </div>
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>合同时间</th>
                                            <th>从事单位</th>
                                            <th>从事岗位</th>
                                            <th>编辑</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in experienceList" :key="index">
                                            <td>{{item.dateFrom}}--{{item.dateTo}}</td>
                                            <td>{{item.company}}</td>
                                            <td>{{item.duty}}</td>
                                            <td>
                                                <button class="actionBtn editBtn" @click="editWorkExperience(item)"></button>
                                                <button class="actionBtn deleteBtn" @click="deleteWorkExperience(item.id)"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="诚信信息">
                    <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>时间</th>
                                            <th>事件类型</th>
                                            <th>事件</th>
                                            <th>处理结果</th>
                                            <th>更多</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in getSincerityInfoByUserIdList" :key="index">
                                            <td>{{timeChange(item.time)}}</td>
                                            <td>{{recordType(item.type)}}</td>
                                            <td>{{item.name}}</td>
                                            <td>{{item.remark}}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <el-tab-pane label="安全教育信息">
                     <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>安全教育名称</th>
                                            <th>教育类别</th>
                                            <th>活动发起单位</th>
                                            <th>更多</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in getSafetyEducationByUserIdList" :key="index">
                                            <td>{{index+1}}</td>
                                            <td>{{timeChange(item.startTime)}}--{{timeChange(item.endTime)}}</td>
                                            <td>{{item.title}}</td>
                                            <td>{{item.text}}</td>
                                            <td>{{item.originator}}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="账号安全">定时任务补偿</el-tab-pane> -->
            </el-tabs>
        </div>
        <div id="edit">
            <el-dialog :visible.sync="workExperienceShow" width="600px" title="添加加工作经验" @close="workExperienceCancle">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText">从事职位：</label>
                        <el-input style="width:75%;" v-model="workDuty" ></el-input>
                    </div>
                     <div class="editBodytwo">
                        <label class="editInpText">聘任公司：</label>
                        <el-input style="width:75%;" v-model="workCompany"></el-input>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">合同时间：</label>
                        <el-date-picker
                        v-model="workTimes"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width:75%;">
                        </el-date-picker>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="workExperienceMakeSure()">确定</button>
                    <button class="editBtnC" @click="workExperienceCancle()">取消</button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import calendar from '../Settings/calendar.vue'
export default {
    name:'projectPerson',
    components: {
        calendar
    },
    data(){
        return{
            editShow:false,
            projId:'',
            token:'',
            BDMSUrl:'',
            getStaffProfileList:'',
            userImg:'',
            sexOptions:[{
                value:1,
                label:'男'
            },
            {
                value:2,
                label:'女'
            }],
            eduOptions:[
                {
                    value:0,
                    label:'初中'
                },
                {
                    value:1,
                    label:'高中'
                },
                {
                    value:2,
                    label:'专科'
                },
                {
                    value:3,
                    label:'本科及以上'
                }
            ],
            type:1,
            personTypeList:[
                {
                    value:1,
                    label:'一般成员'
                },
                {
                    value:2,
                    label:'项目经理'
                },
                {
                    value:3,
                    label:'管理员'
                },
                {
                    value:4,
                    label:'门卫'
                }
            ],
            calendar1:{
                 multi:true,
                 zero:true,
                value:[[2019,5,12],[2019,5,13],[2019,5,14],[2019,5,15],[2019,5,16],], //默认日期
                lunar:true, //显示农历
                weeks:['日', '一', '二', '三', '四', '五', '六'],
                display:"2018/02/16",
                months:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                events:{
                    // '2018-7-2':'工作日',
                    // '2017-7-20':'$408',
                    // '2017-7-21':'$460',
                    // '2017-7-22':'$500',
                },
                // begin:[2019,5,11], //可选开始日期
                // end:[2019,6,11], //可选结束日期
                select(value){
                    console.log(value,'value');
                },
                selectMonth(month,year){
                    
                },
                selectYear(year){
                   
                },
                timestamp:Date.now()
            },
            address:'',
            avaterUri:'',
            birthday:'',
            certificationNo:'',	
            certificationPhoto:'',
            stationCertiyPhoto:'',
            education:1,
            name:'',
            nation:'',
            phone:'',
            profession:'',
            registeredAddress:'',
            sex:1,
            stationCertificate:'',
            technicalTitle:'',
            userImgList:null,
            cerfiticateImgList:null,
            stationCerfiticateImgList:null,
            getAttendancyByUserIdList:[],
            timestamps:'',
            getSincerityInfoByUserIdList:[],
            getSafetyEducationByUserIdList:[],
            honestyValue:1,
            duty:"",
            department:'',
            entryDate:'',
            contractExpireDate:'',
            educateName:"未选择任何文件",
            educateNameList:null,
            safeSubmitName:"未选择任何文件",
            safeSubmitNameList:null,
            technologyName:'未选择任何文件',
            technologyNameList:null,
            specialName:'未选择任何文件',
            specialNameList:null,
            contractName:'未选择任何文件',
            contractNameList:null,
            getStaffWorkingInfoList:'',
            workExperienceShow:false,
            workTimes:'',
            workCompany:'',
            workDuty:'',
            dateFrom:"",
            dateTo:"",
            experienceList:[],
            appendicesContract:'',
            safeRecord:'',
            specialOperationCertificate:'',
            technicalRecord:'',
            thirdLevelSecurityEducationCard:'',
            attendInfo:'',
            queryAttendancyRecordByUserList:'',
        }
    },
    created(){
        var vm=this;
        vm.projId = localStorage.getItem('projId');
        vm.token = localStorage.getItem('token');
        vm.projName=localStorage.getItem('projName');
        vm.userId = localStorage.getItem('userId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.userImg=localStorage.getItem('userImg');
        vm.userName=localStorage.getItem('userName');
        // console.log(vm.userName,'vm.userName');
        vm.timestamps=moment(new Date().getTime()).format('YYYY-MM');
        vm.name=vm.userName;
        vm.getAttendancyByUserId(vm.timestamps);
       
        console.log(vm.attendInfo,'vm.attendInfo');
        vm.getStaffProfile();
        vm.getSincerityInfoByUserId();
        vm.getSafetyEducationByUserId();
        vm.getStaffWorkingInfo();
        vm.getStaffWorkingExperience();
        vm.avaterUriFile=vm.userImg;
        // vm.attendInfo=vm.getAttendancyByMonth(vm.timestamps);
        this.getPersonEnterInfo();
        console.log(vm.userId,'vm.userId000');
        console.log('jdkfdkj')
    },
    methods:{
        timeChange(val){
            if(val){
                return moment(val).format('YYYY-MM-DD')
            }
        },
        recordType(val){
            if(val==1){
                return '良好记录'
            }else if(val==2){
                return '不良记录'
            }else{
                return '投诉记录'
            }

        },
        returnPosition(val){
            if(val.length==0){
                return ''
            }else{
                return val
            }
        },
        getPersonEnterInfo(){
            axios({
                url:this.BDMSUrl+'attendancy/queryAttendancyRecordByUser',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    date:this.timestamps+'-01'
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.queryAttendancyRecordByUserList=response.data.rt;
                    console.log(this.queryAttendancyRecordByUserList,'this.queryAttendancyRecordByUserList');
                }
            })
        },
        getStaffProfile(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'user/getStaffProfile',
                headers:{
                    'token':this.token
                },
                method:'get',
                params:{
                    userId:this.userId
                }
            }).then((response)=>{
                    if(response.data.cd==0){
                        vm.getStaffProfileList=response.data.rt;
                        this.address=this.getStaffProfileList.address;
                        this.avaterUri=this.getStaffProfileList.avaterUri;
                        this.birthday=moment(this.getStaffProfileList.birthday).format('YYYY-MM-DD');
                        this.certificationNo= this.getStaffProfileList.certificationNo;
                        // this.avaterUriFile=this.BDMSUrl+this.avaterUri;
                        this.education=this.getStaffProfileList.education;
                        this.name=this.getStaffProfileList.name;
                        this.nation=this.getStaffProfileList.nation;
                        this.phone=this.getStaffProfileList.phone;
                        this.profession=this.getStaffProfileList.profession;
                        this.registeredAddress=this.getStaffProfileList.registeredAddress;
                        this.sex=this.getStaffProfileList.sex;
                        this.technicalTitle=this.getStaffProfileList.technicalTitle;
                        this.certificationPhoto=this.BDMSUrl+this.getStaffProfileList.certificationPhoto;
                        this.stationCertiyPhoto=this.BDMSUrl+this.getStaffProfileList.stationCertificate;
                        console.log(vm.getStaffProfileList,'vm.getStaffProfileList');
                    }
                })
            },
        // getStaffProfile(){
        //     var vm=this;
        //     axios({
        //         url:this.BDMSUrl+'user/getStaffProfile',
        //         headers:{
        //             'token':vm.token
        //         },
        //         method:"get",
        //         params:{
        //             userId:vm.userId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd==0){
        //             console.log(response.data.rt,'response.data.rt');
        //             vm.getStaffProfileList=response.data.rt;
        //             console.log(vm.getStaffProfileList,'this.getStaffProfileList');
        //             // this.address=this.getStaffProfileList.address;
        //             // this.avaterUri=this.getStaffProfileList.avaterUri;
        //             // this.birthday=moment(this.getStaffProfileList.birthday).format('YYYY-MM-DD');
        //             // this.certificationNo= this.getStaffProfileList.certificationNo;
        //             // this.education=this.getStaffProfileList.education;
        //             // this.name=this.getStaffProfileList.name;
        //             // this.nation=this.getStaffProfileList.nation;
        //             // this.phone=this.getStaffProfileList.phone;
        //             // this.profession=this.getStaffProfileList.profession;
        //             // this.registeredAddress=this.getStaffProfileList.registeredAddress;
        //             // this.sex=this.getStaffProfileList.sex;
        //             // this.technicalTitle=this.getStaffProfileList.technicalTitle;
        //             // console.log(this.getStaffProfileList,this.name,'this.name');
        //         }
        //     })
        //     //     $.ajax({
        //     //         url:this.BDMSUrl+'user/getStaffProfile',
        //     //         headers:{
        //     //             'token':this.token
        //     //         },
        //     //         data:{
        //     //             userId:this.userId
        //     //         },
        //     //         type:'get',
        //     //         async:false,
        //     //         success:(response)=>{
        //     //             alert('0000')
        //     //             this.getStaffProfileList=response.rt;
        //     //             console.log(this.getStaffProfileList,'this.getStaffProfileList');
        //     //         }
        //     //     }
               
        //     // )
        // },
        //获取个人诚信管理
        getSincerityInfoByUserId(){
            axios({
                url:this.BDMSUrl+'sincerity/getSincerityInfoByUserId',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    userId:this.userId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getSincerityInfoByUserIdList=response.data.rt;
                    // this.honestyValue=this.getSincerityInfoByUserIdList;
                }
            })
        },

        getSafetyEducationByUserId(){
            axios({
                url:this.BDMSUrl+'safety/getSafetyEducationByUserId',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    userId:this.userId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getSafetyEducationByUserIdList=response.data.rt;
                    // this.honestyValue=this.getSincerityInfoByUserIdList;
                }
            })

        },
        editPersonInfoMakeSure(){
            this.editShow=true;
        },
        personInfoMakeSure(){
            var vm=this;
            var formData=new FormData();
            formData.append('certificationPhoto',this.cerfiticateImgList);
            formData.append('stationCertificate',this.stationCerfiticateImgList);
            // var data={
            //             "address": this.address,
            //             "avaterUri": this.avaterUri,
            //             "birthday": this.birthday,
            //             "certificationNo": this.certificationNo,
            //             "certificationPhoto": this.certificationPhoto,
            //             "education": this.education,
            //             "name": this.name,
            //             "nation": this.nation,
            //             "phone": this.phone,
            //             "profession": this.profession,
            //             "registeredAddress": this.registeredAddress,
            //             "sex": this.sex,
            //             "stationCertificate": this.stationCertificate,
            //             "technicalTitle": this.technicalTitle,
            //             "userId":this.userId
            //     }
            axios({
                url:this.BDMSUrl+'user/setStaffProfile',
                headers:{
                    'token':this.token,
                    'Content-Type':'multipart/form-data'
                },
                method:'post',
                params:{
                    projectId:this.projId,
                    address: this.address,
                    avaterUri: this.avaterUri,
                    birthday: moment(this.birthday).format('YYYY-MM-DD'),
                    certificationNo: this.certificationNo,
                    // certificationPhoto: this.certificationPhoto,
                    education: this.education,
                    name: this.name,
                    nation: this.nation,
                    phone: this.phone,
                    profession: this.profession,
                    registeredAddress: this.registeredAddress,
                    sex: this.sex,
                    // stationCertificate: this.stationCertificate,
                    technicalTitle: this.technicalTitle,
                    userId:this.userId
                },
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    this.editShow=false;
                    this.getStaffProfile();
                    this.$message({
                        type:'success',
                        message:"个人信息修改成功"
                    })
                }
                
            })
        },
        // getStaffProfile(){
        //     axios({
        //         url:this.BDMSUrl+'user/getStaffProfile',
        //         headers:{
        //             'token':this.token
        //         },
        //         params:{
        //             userId:this.userId
        //         },
        //         method:'get'
        //     }).then((response)=>{
        //         if(response.data.cd==0){
        //             this.getStaffProfileList=response.data.rt;
        //         }
        //     })
        // },
        getAttendancyByUserId(date){
            axios({
                url:this.BDMSUrl+'attendancy/getAttendancyByUserId',
                headers:{
                    'token':this.token
                },
                params:{
                    userId:this.userId,
                    projectId:this.projId,
                    date:date+'-01'
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getAttendancyByUserIdList=response.data.rt;
                }
            })
        },
        getAttendancyByMonth(date){
            var datas='';
            $.ajax({
                url:this.BDMSUrl+'attendancy/getAttendancyByMonth',
                headers:{
                    'token':this.token
                },
                data:{
                    projectId:this.projId,
                    date:date+'-01',
                    name:''
                },
                async:false,
                success:(response)=>{
                    if(response.cd==0){
                        response.rt.forEach((item)=>{
                            if(item.userId==this.userId){
                                    datas=item;
                            }
                        })
                        return datas;
                    }
                }
            })
        },
        

        clickUserImg(){
            this.$refs.uploadUserImg.click();
        },
        changeUserImg(){
                this.userImgList=this.$refs.uploadUserImg.files[0];
                this.avaterUriFile=URL.createObjectURL(this.userImgList);
                if(this.userImgList){
                    var formData=new FormData();
                    formData.append('file',this.userImgList)
                    axios({
                        url:this.BDMSUrl+'register/uploadAvater',
                        headers:{
                            'token':this.token
                        },
                        method:'post',
                        data:formData
                    }).then((response)=>{
                        if(response.data.cd==0){
                                this.avaterUri=response.data.rt;
                        }
                    })
                }
        },
        clickCertificate(){
            this.$refs.uploadCertificateImg.click();
        },
        changeCertificateImg(){
            this.cerfiticateImgList=this.$refs.uploadCertificateImg.files[0]
            this.certificationPhoto=URL.createObjectURL(this.cerfiticateImgList);
                // if(this.cerfiticateImgList){
                //     var formData=new FormData();
                //     formData.append('file',this.cerfiticateImgList)
                //     axios({
                //         url:this.BDMSUrl+'design/dcUpload',
                //         method:'post',
                //         headers:{
                //             'token':this.token
                //         },
                //         params:{
                //             projectId:this.projId
                //         },
                //         data:formData
                //     }).then((response)=>{
                //         if(response.data.cd==0){
                //                 this.certificationPhoto=response.data.rt.uri;
                //         }
                //     })
                // }
        },
        clickstationCertificate(){
            this.$refs.uploadStationCertificateImg.click();
        },
        changestationCertiImg(){
            this.stationCerfiticateImgList=this.$refs.uploadStationCertificateImg.files[0]
            this.stationCertiyPhoto=URL.createObjectURL(this.stationCerfiticateImgList);
            //  if(this.stationCerfiticateImgList){
            //         var formData=new FormData();
            //         formData.append('file',this.stationCerfiticateImgList)
            //         axios({
            //             url:this.BDMSUrl+'design/dcUpload',
            //             method:'post',
            //             headers:{
            //                 'token':this.token
            //             },
            //             params:{
            //                 projectId:this.projId
            //             },
            //             data:formData
            //         }).then((response)=>{
            //             if(response.data.cd==0){
            //                     this.stationCertiyPhoto=response.data.rt.uri;
            //             }
            //         })
            // }
        },
        educateClick(){
            this.$refs.educateFile.click();
        },
        changeEducate(){
            this.educateNameList=this.$refs.educateFile.files[0];
            this.educateName=this.educateNameList.name;
        },
        downloadFiles(val){
            if(val){
                window.open(this.BDMSUrl+'dl/'+val)
            }else{
                this.$message({
                    type:'info',
                    message:'当前无上传文件'
                })
            }
        },
        safeSubmitClick(){
            this.$refs.safeSubmitFile.click();

        },
        changesafeSubmit(){
            this.safeSubmitNameList=this.$refs.safeSubmitFile.files[0];
            this.safeSubmitName=this.safeSubmitNameList.name;

        },
        technologyClick(){
            this.$refs.technologyFile.click();

        },
        changeTechnology(){
            this.technologyNameList=this.$refs.technologyFile.files[0];
            this.technologyName=this.technologyNameList.name;

        },
        specialClick(){
            this.$refs.specialFile.click();

        },
        changeSpecial(){
            this.specialNameList=this.$refs.specialFile.files[0];
            this.specialName=this.specialNameList.name;

        },
        contractClick(){
            this.$refs.contractFile.click();
        },
        changeContract(){
            this.contractNameList=this.$refs.contractFile.files[0];
            this.contractName=this.contractNameList.name;
        },
        makeSureWork(){
            var formData=new FormData();
            formData.append('thirdLevelSecurityEducationCardFile',this.educateNameList);
            formData.append('safeRecordFile',this.safeSubmitNameList);
            formData.append('technicalRecordFile',this.technologyNameList);

            formData.append('specialOperationCertificateFile',this.specialNameList);
            formData.append('appendicesContractFile',this.contractNameList);
            axios({
                url:this.BDMSUrl+'user/setStaffWorkingInfo',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    department:this.department,
                    duty:this.duty,
                    entryDate:moment(this.entryDate).format('YYYY-MM-DD'),
                    type:this.type,
                    contractExpireDate:moment(this.contractExpireDate).format('YYYY-MM-DD')
                },
                method:'post',
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getStaffWorkingInfo();
                    this.$message({
                        type:'success',
                        message:'从业信息编辑成功'
                    })
                }
            })
        },
        editWork(){
            this.getStaffWorkingInfoList='';
            this.appendicesContract='';
            this.safeRecord='';
            this.specialOperationCertificate='';
            this.technicalRecord='';
            this.thirdLevelSecurityEducationCard='';
        },
        getStaffWorkingInfo(){
            axios({
                url:this.BDMSUrl+'user/getStaffWorkingInfo',
                headers:{
                    'token':this.token
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getStaffWorkingInfoList=response.data.rt;
                    this.department=this.getStaffWorkingInfoList.department;
                    this.duty=this.getStaffWorkingInfoList.duty;
                    this.type=this.getStaffWorkingInfoList.type;
                    this.entryDate=this.getStaffWorkingInfoList.entryDate;
                    this.contractExpireDate=this.getStaffWorkingInfoList.contractExpireDate;

                    this.appendicesContract=this.getStaffWorkingInfoList.appendicesContract;
                    this.safeRecord=this.getStaffWorkingInfoList.safeRecord;
                    this.specialOperationCertificate=this.getStaffWorkingInfoList.specialOperationCertificate;
                    this.technicalRecord=this.getStaffWorkingInfoList.technicalRecord;
                    this.thirdLevelSecurityEducationCard=this.getStaffWorkingInfoList.thirdLevelSecurityEducationCard;
                    console.log(this.getStaffWorkingInfoList,'this.getStaffWorkingInfoList');
                }
            })
        },
        workExperienceMakeSure(){
            this.dateFrom=this.workTimes[0],
            this.dateTo=this.workTimes[1]
            axios({
                url:this.BDMSUrl+'user/addExperience',
                headers:{
                    'token':this.token
                },
                params:{
                    company:this.workCompany,
                    duty:this.workDuty,
                    dateFrom:moment(this.dateFrom).format('YYYY-MM-DD'),
                    dateTo:moment(this.dateTo).format('YYYY-MM-DD')
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getStaffWorkingExperience();
                    this.workExperienceShow=false;
                    this.workCompany='';
                    this.dateFrom='';
                    this.dateTo='';
                    this.workDuty='';
                }
            })
        },
        getStaffWorkingExperience(){
            axios({
                url:this.BDMSUrl+'user/getStaffWorkingExperience',
                headers:{
                    'token':this.token
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.experienceList=response.data.rt;
                }
            })
        },
        workExperienceCancle(){
            this.workExperienceShow=false;

        },
        addWorkExperience(){
            this.workExperienceShow=true;

        },
        editWorkExperience(){
            
        },
        deleteWorkExperience(id){
            this.$confirm('你是否删除该工作经验','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'user/deleteStaffWorkingInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getStaffWorkingExperience()
                    }
                })
            })
        },


    },



}
</script>

<style lang="less" scoped>
*{
    margin:0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
#personContent{
    // margin-top:20px;
    width: 96%;
    margin:30px auto;
    .contentHead{
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        // border:1px solid #ccc;
        height: 250px;
        border-radius: 4px;
        .contentHeadLeft{
            width: 25%;
            height: 250px;
            // display: flex;
            background: #f8f8f8;
            position: relative;
            // text-align: left;
            .imgCenter{
                position: absolute;
                top:-21px;
                left:10%;
                width: 80%;
                margin:0 auto;

                height: 250px;
                // width: 100%;
                // height: 100%;
                margin:20px auto;
                // justify-content: center;
                // align-items: center;
            }
        }
        .contentHeadRight{
            width: 70%;
            margin-left:5%;
            height: 250px;
            background: #f8f8f8;
            .rightLi{
                // height: 56px;
                // padding: 15px;
                font-size:16px;
                font-weight: 500;
                .nameLabel{
                    width: 50%;
                    height: 46px;
                    line-height: 46px;
                    text-align: center;
                    display: inline-block;

                }
                .itemLabel{
                    width: 50%;
                    height:46px;
                    line-height: 46px;
                    text-align: center;
                    display: inline-block;
                    vertical-align: middle;

                }

            }
        }
    }
    .contentBottom{
        margin-top:20px;
        // .el-tabs__header{
        //     height: 41px !important;
        // }
        // .el-tabs--border-card > .el-tabs__header .el-tabs__item {
        //     font-size: 16px;
        //     width: 122px;
        //     font-weight: bold;
        //     color: #666666;
        // }
        .basicInfWrapper{
            width: 100%;
            margin:15px;
            .leftWrapper{
                width: 50%;
                float: left;
                .boxInp{
                    margin-top:5px;
                    .wrapperLabel{
                        width: 15%;
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        font-size:16px;
                        text-align: left;
                    }
                    .wrapperInp{
                        width: 65%;
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        border: 1px solid #dcdfe6;
                        box-sizing: border-box;
                        color: #606266;
                        display: inline-block;
                        font-size: inherit;
                        height: 40px;
                        line-height: 1;
                        outline: 0;
                        padding: 0 15px;
                        .optionClass{
                            height: 28px;
                        }
                    }
                   
                }
                

            }
            .rightWrapper{
                width: 50%;
                float: right;
                .rightBox{
                    margin-top:5px;
                     .wrapperLabel{
                        width: 15%;
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        font-size:16px;
                        text-align: left;
                    }
                    .imgCircle{
                        display: inline-block;
                        width: 125px;
                        height: 125px;
                        border:1px solid #ccc;
                        border-radius: 4px;
                        // margin-left:-184px;
                        position: absolute;
                        top: 9px;
                        left: 0px;
                        // margin-bottom: 10px;
                        &:hover{
                            border:1px dashed #06c;
                        }
                        img{
                            position: absolute;
                            top:0px;
                            left:0px;
                            width: 123px;
                            height: 123px;
                        }
                        .el-icon-circle-plus{
                            font-size: 26px;
                            margin-top:34px;
                            margin-bottom:4px;
                            cursor: pointer;
                        }
                    }
                    .personCircle{
                        display: inline-block;
                        width: 250px;
                        height: 140px;
                        border:1px solid #ccc;
                        border-radius: 4px;
                        position: absolute;
                        top:0px;
                        left:0px;
                        img{
                            position: absolute;
                            top:0px;
                            left:0px;
                            width: 248px;
                            height: 138px;
                        }
                        // margin-left:-58px;
                        // margin-bottom: 10px;
                        &:hover{
                            border:1px dashed #06c;
                        }
                        .el-icon-upload{
                            font-size: 26px;
                            margin-top:34px;
                            margin-bottom:4px;
                            cursor: pointer;
                        }

                    }
                    .wrapperInp{
                        width: 65%;
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        border: 1px solid #dcdfe6;
                        box-sizing: border-box;
                        color: #606266;
                        display: inline-block;
                        font-size: inherit;
                        height: 40px;
                        line-height: 1;
                        outline: 0;
                        padding: 0 15px;
                    }
                    
                    


                }
                .makeBtn{
                    width: 100%;
                    height: 50px;
                    margin:20px auto;
                    .btnSure{
                        width: 140px;
                        height: 44px;
                        color: #58adfb;
                        text-align: center;
                        line-height: 44px;
                        text-decoration: none;
                        border: 1px solid #58adfb;
                        border-radius: 5px;
                        font-size: 14px;
                        display: inline-block;
                        cursor: pointer;
                        &:hover{
                            background: #58adfb;
                            color: #fff;
                        }
                    }
                }
               

            }
        }
        .enterInfWrapper{
            padding: 20px;
            margin:20px;
        }
        .workInfoWrapper{
            margin:20px auto;
            .header{
                height: 310px;
                .titleBtn{
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    background: #58adfb;
                    color:white;
                    border: 1px solid white;
                    border-radius: 4px;
                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    cursor: pointer;
                    .el-icon-s-custom{
                        font-size:20px;
                    }
                    .el-icon-edit{
                        cursor: pointer;
                        font-size: 18px;
                    }
                    .el-icon-document{
                        font-size:18px;
                    }
                }
                .titleInfo{
                    margin:30px auto;
                    .Wrapper{
                        width: 50%;
                        
                        .boxInp{
                            margin-top:5px;
                            .makeSureBtn{
                                width: 120px;
                                height: 36px;
                                color: #58adfb;
                                text-align: center;
                                line-height: 36px;
                                text-decoration: none;
                                border: 1px solid #58adfb;
                                border-radius: 5px;
                                font-size: 14px;
                                display: inline-block;
                                cursor: pointer;
                                &:hover{
                                        background: #58adfb;
                                        color: #fff;
                                }
                            }
                            .wrapperLabel{
                                width: 15%;
                                display: inline-block;
                                height: 30px;
                                line-height: 30px;
                                font-size:16px;
                                text-align: left;
                            }
                            .wrapperInp{
                                width: 65% !important;
                                background-color: #fff;
                                background-image: none;
                                border-radius: 4px;
                                border: 1px solid #dcdfe6;
                                box-sizing: border-box;
                                color: #606266;
                                display: inline-block;
                                font-size: inherit;
                                height: 40px;
                                line-height: 1;
                                outline: 0;
                                padding: 0 15px;
                                .el-input__inner {
                                    border:none;
                                }
                            }
                            
                             .wrapperSpan{
                                    width: 65%;
                                    display: inline-block;
                                    font-size: inherit;
                                    height: 40px;
                                    padding: 0 15px;
                                    text-align: left;
                                    .buttonSpan{
                                        color: #fff;
                                        background-color: #409eff;
                                        border-color: #409eff;
                                        width: 100px;
                                        height: 32px;
                                        line-height: 32px;
                                        font-size: 16px;
                                        display: inline-block;
                                        border-radius: 4px;
                                        text-align: center;
                                        cursor: pointer;
                                    }
                                    .buttonLabel{
                                        // width: 70%;
                                        height: 32px;
                                        display: inline-block;
                                        text-align: left;
                                        margin-left:10px;
                                        color:#999;
                                    }
                                    .el-icon-download{
                                        font-size:18px;
                                        // font-weight:bold;
                                        cursor: pointer;
                                        // &:hover{
                                        //     color:#58adfb;
                                        // }
                                    }
                                }

                        }
                    }
                }
            }
            .bottom{
                margin-top:30px;
                .titleBtnLeft{
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    background: #58adfb;
                    color:white;
                    border: 1px solid white;
                    border-radius: 4px;
                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    float: left;
                    margin-bottom: 10px;
                    .el-icon-s-custom{
                        font-size:20px;
                    }
                    .el-icon-document{
                        font-size: 18px;
                    }
                }
                .titleBtnRight{
                    width: 150px;
                    height: 36px;
                    line-height: 36px;
                    background: white;
                    color:#58adfb;
                    border: 1px solid #58adfb;
                    border-radius: 4px;
                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    float:right;
                    cursor: pointer;
                    margin-bottom: 10px;
                    .el-icon-circle-plus{
                        font-size:18px;
                        color:#58adfb;
                        
                    }
                }
                .bottomTable{
                    margin-top:65px;
                    .tableList{
                            border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                            tbody{
                                tr{
                                    .red{
                                        color: red;
                                    }
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 36px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 14px;
                                        color: #333333;
                                        .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;

                                        }
                                        .deleteBtn{
                                            background: url('../../assets/delete.png') no-repeat 0 0;
                                        }
                                        .editBtn{
                                            background: url('../../assets/edit.png') no-repeat 0 0;
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
</style>
