<template>
    <div id="personalCalendar">
        <div :class="[{'box-left-active':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item label-item-active">  
                    个人日历  
                    </router-link>
                    <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item">  
                    资源计划  
                    </router-link>
                    <router-link :to="'/SchedulePlan/taskIndex'" class="label-item">  
                    工程任务  
                    </router-link>
                    <router-link :to="'/SchedulePlan/calendarConfig'" class="label-item">  
                    更多配置  
                    </router-link>
                    <div class="calendarChange" @click="viewChange">
                    </div>
                </div>
            </div>
            <div class="calendarContext" v-show="viewshow" >
                <div class="calendarHead">
                    <h5 class="calendarHeadLeft"><img class=imgIcon src="./images/worklist.png">个人日历</h5>
                    <div class="calendarHeadRight"><span class="el-icon-close btn" @click="deleteEvent">删除</span><span class="el-icon-plus btn" @click="addEvent">增加事件</span><span class="el-icon-edit-outline btn" @click="updateEvent">修改事件</span></div>
                </div>
                <div class="calendarBody" >
                    <!-- <button @click="refreshEvents">Refresh</button>
                    <button  @click="removeEvent">Remove</button>
                    <pre>{{ selected }}</pre> -->
                    <full-calendar ref="calendar" id="calendar" :events="events" :event-sources="eventSources"  :config="config"   @event-selected="eventSelected"   @event-created="eventCreated"  @event-render="eventRender" ></full-calendar>
                </div>
            </div>
            <div class="calendarContext1" v-show="!viewshow">
                    <div class="calendarHead">
                        <h5 class="calendarHeadLeft"><img class=imgIcon src="./images/worklist.png">个人日历</h5>
                        <div class="calendarHeadRight"><span class="el-icon-plus btn" @click="addEvent">增加事件</span></div>
                    </div>
                    <div class="eventView" >
                            <div class="eventViewHead">
                                <span class="currentDate">
                                    <span class="calendaricon"></span>
                                    <span class="curDate">{{curDateList}}</span>
                                    <span class="curWeek">{{curWeekList}}</span>
                                </span>
                                <div class="searchOperate">
                                    <span class="before">
                                        <span>之前</span>
                                        <select class="beforeday" @change="beforeToStartChange" v-model="beforeToStartValue">
                                            <option v-for="(item,index) in beforeToStartList" :key="index" :value="item.value">{{item.label}}</option>
                                        </select>
                                    </span>
                                    <span class="after">
                                        <span>之后</span>
                                        <select class="afterday" @change="afterToEndChange" v-model="afterValue">
                                            <option v-for="(item1,index) in after" :key="index" :value="item1.value">{{item1.label}}</option>
                                        </select>
                                    </span>
                                </div>
                                
                            </div>
                            <div class="eventViewBody">
                                <ul class="eventViewBodyUl ">
                                    <li :class="[{'active':item.id==isActive},'eventViewBodyLi']" v-for="(item,index) in eventViewrows" :key="index" @click="chectItem(item.id)">
                                        <div class="title">{{item.eventName}}</div>
                                        <div class="body"><span class="time">时间：{{item.eventStart}}~{{item.eventEnd}}</span><span class="position">地点：{{item.eventPosition}}</span><span class="repeat">重复方式：{{item.repeatType | repeatTypeChanges}}</span></div>
                                        <div class="foot">内容：{{item.content}}<span></span></div>
                                        <div class="updateEventView" @click="updateEvent"></div>
                                        <div class="deleteEventView" @click="deleteEvent"></div>
                                    </li>
                                </ul>
                            </div>
                            <div class="eventViewFooter">
                                <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage3"
                                :page-size="4"
                                layout="prev, pager, next, jumper"
                                :total=totalSize>
                                </el-pagination>
                            </div>
                    </div>
                </div>
            <!-- <el-row>
                <el-col :span="24">
                    <el-container>
                        <el-header>header</el-header>
                        <el-main>
                        
                        </el-main>
                    </el-container>
                </el-col>
            </el-row> -->
        </div>
        <div :class="[{'box-right-active':screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':'active-version']">
                    <span class="item-event " @click="screenLeft.item = 1;">事<br>件</span>
                    <span class="item-file " @click="screenLeft.item = 2">附<br>件</span>
                </div>
            </div>
            <div id="box-right" v-if="screenLeft.item == 1">
                <h3 class="header-information" style="margin-top:0;">
                    <i class="trrangle"></i>
                    基本信息
                    <i :class="[{'active':show.basicInformation},'icon-dropDown']" @click="show.basicInformation = show.basicInformation?false:true;"></i>
                </h3>
                    <ul id="basicInformation" :class="[{'show':show.basicInformation}]">
                        <li class="detial-item ">
                            <span class="detial-text-name">名称</span>
                            <span class="detial-text-value" v-text="eventInformationList.eventName"></span>
                        </li>
                        <li class="detial-item ">
                            <span class="detial-text-name">地点</span>
                            <span class="detial-text-value" v-text="eventInformationList.eventPosition"></span>
                        </li>
                        <li class="detial-item">
                            <span class="detial-text-name">开始</span>
                            <span class="detial-text-value" v-text="$options.filters.timeChange(eventInformationList.eventStart)"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">结束</span>
                            <span class="detial-text-value" v-text="$options.filters.timeChange(eventInformationList.eventEnd)"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">全天</span>
                            <span class="detial-text-value" v-text="eventInformationList.allDay==1?'是':'否'"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">重复</span>
                            <span class="detial-text-value" v-text="$options.filters.repeatTypeChanges(eventInformationList.repeatType)"></span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">内容</span>
                            <span class="detial-text-value" v-text="eventInformationList.content"></span>
                        </li>
                    </ul>
            </div>
            <div id="box-right1" v-if="screenLeft.item == 2">
                <div id="bindword">
                    <h3 class="header-information" style="margin-top:0;">
                        <i class="trrangle"></i>
                        关联文档
                        <i :class="[{'active':show.basicInformation},'icon-dropDown']" @click="show.basicInformation = show.basicInformation?false:true;"></i>
                        <i class="el-icon-plus icon-dropDown1" @click="addword"></i>
                    </h3>
                    <ul class="bindwordUl" :class="[{'show':show.basicInformation}]">
                        <li class="bindwordLi" v-for="(item,index) in fileLists" :key="index"><span class="bindwordText">{{item.fileName}}</span><span class="icon"><i class="icon-goujian icon-search" @click="searchs(item.filePath)"></i><i class="icon-goujian icon-download" @click="downLoad(item.filePath)"></i><i class="icon-goujian icon-delete" @click="deleteword(item.fileId)"></i></span></li>
                    </ul>
                </div>

                <div id="bindpic">
                    <h3 class="header-information" style="margin-top:0;">
                        <i class="trrangle"></i>
                        附加图片
                        <i :class="[{'active':show.basicInformation},'icon-dropDown']" @click="show.basicInformation = show.basicInformation?false:true;"></i>
                        <i class="el-icon-plus icon-dropDown1" @click="addpic"></i>
                    </h3>
                    <ul  class="bindpicUl" :class="[{'show':show.basicInformation}]">
                        <li class="bindpicLi" v-for="(item,index) in attachLists" :key="index"><span class="bindwordText">{{item.fileName}}</span><span class="icon"><i class="icon-goujian icon-search" @click="searchs(item.relativePath)"></i><i class="icon-goujian icon-download" @click="downLoad(item.relativePath)"></i><i class="icon-goujian icon-delete" @click="deletepic(item.fileId)"></i></span></li>
                    </ul>
                </div>
                
            </div>
        </div>
        <div id="edit">
            <el-dialog title="新增事件内容" :visible.sync="addEventTextDialog" @close="addETCancle">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">事件 :</label><input class="inp" placeholder="请输入事件" v-model="eventNames"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">地点 :</label><input class="inp" placeholder="请输入地点" v-model="eventPositions"></div>
                    <div class="editBodytwo editCheckBox"><el-checkbox v-model="checkValue" label="全天"></el-checkbox></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            :type="(this.checkValue==true)?'date':'datetime'"
                            v-model="startTimeValue"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            :type="(this.checkValue==true)?'date':'datetime'"
                            v-model="endTimeValue"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">重复方式 :</label>
                        <select class="editSelect" @change="repeatTypeChange" v-model="repeatTypeValue">
                            <option v-for="(item,index) in repeatTypeList" :key="index" :value="item.value">{{item.label}}</option>
                        </select>
                        <label class="editInpText">颜色：</label>
                        <select class="editSelect" @change="eventColorChange" v-model="eventColorValue">
                            <option v-for="(item,index) in eventColorList" :key="index" >{{item}}</option>
                        </select>
                        <span v-if="eventColor" class="displayColor" :style="{'background-color':eventColorOne}"></span>
                    </div>
                    <div v-show="repeatTypeValue>0" class="editBodytwo edit-item clearfix">
                        <label class="editInpText">事件终止日期：</label>
                        <el-date-picker
                            type="date"
                            v-model="terminate"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>

                    <div class=" editBodytwo editArea">内容：</div>
                    <div class="edit-item clearfix editTextArea" >
                        <textarea rows="6" cols="80" v-model="eventContext"></textarea>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addEventTextMakeSure">确定</button>
                    <button class="editBtnC" @click="addETCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改事件内容" :visible.sync="updateEventTextDialog" @close="updateETCancle">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">事件 :</label><input class="inp" placeholder="请输入事件" v-model="eventNames"></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">地点 :</label><input class="inp" placeholder="请输入地点" v-model="eventPositions"></div>
                    <div class="editBodytwo editCheckBox"><el-checkbox v-model="checkValue" label="全天"></el-checkbox></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">开始时间 :</label>
                         <el-date-picker
                            :type="(this.checkValue==true)?'date':'datetime'"
                            v-model="startTimeValue"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">结束时间 :</label>
                            <el-date-picker
                            :type="(this.checkValue==true)?'date':'datetime'"
                            v-model="endTimeValue"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText1">重复方式 :<span class="editRepeat">{{this.repeatTypeLabel | repeatTypeChanges}}</span></label>
                    </div>

                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">颜色：</label>
                        <select class="editSelect" @change="eventColorChange" v-model="eventColorValue">
                            <option v-for="(item,index) in eventColorList" :key="index" >{{item}}</option>
                        </select>
                        <span v-if="eventColor" class="displayColor" :style="{'background-color':eventColorOne}"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editUpdateText">修改 :</label>
                        <select class="editSelect1" @change="updateTypeChange" v-model="updateTypeValue">
                            <option v-for="(item,index) in updateTypeList" :key="index" :value="item.value">{{item.label}}</option>
                        </select>
                    </div>

                    <div class=" editBodytwo editArea">内容：</div>
                    <div class="edit-item clearfix editTextArea" >
                        <textarea rows="6" cols="80" v-model="eventContext"></textarea>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="updateEventTextMakeSure">确定</button>
                    <button class="editBtnC" @click="updateETCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="删除事件内容" :visible.sync="deleteEventTextDialog" @close="deleteETCancle">
                <div class="editBody">
                    <ul class="editBodyone editUl">
                        <li class="editLi" v-for="(item,index) in deleteTypeList" :key="index" ><input type="radio" v-model="deleteTypes" :value="item.value"><label>{{item.label}}</label></li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="deleteEventTextMakeSure">确定删除</button>
                        <button class="editBtnC" @click="deleteETCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="文档选择" :visible.sync="addWordDialog" @close="addWordCancle">
                <div class="GroupSelect"> 
                    <select v-model="selectUgId" class="inp-search" @change="InitselectUgId">
                        <option :value="item.ugId" v-for="(item,index) in ugList" :key="index" v-text="item.ugName"></option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="tree">
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
                    id="cloudDirveFileTree">
                    <span :class="['custom-tree-node','el-tree-node__label',(data.isAutoCreated == 1 && data.holderId != null)?'qjLeaf':'']" slot-scope="{ node, data }" v-text="node.label?node.label:'(123)'"></span>
                    </el-tree> 
                </div>
                <div class="tableList">
                    <table>
                        <tbody>
                            <tr v-for="(item,index) in searchFileList" :key="index">
                                <td width="15%"><el-checkbox v-model="item.select"></el-checkbox></td>
                                <td width="85%" v-text="item.fgName"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addwordMakeSure">确定</button>
                    <button class="editBtnC" @click="addWordCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="文件上传" :visible="uploadshow" @close="upImgCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class="imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <span @click="selectImg">
                                <button class="upImgBtn">选择文件</button>
                            </span>
                            <input class="upInput" type="file" ref="file"  @change="fileChanged($event)" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="uploadIMG">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
        </el-dialog>
        </div>
    </div> 
</template>
<style>

</style>
<style lang="less"  scoped>
// #calendar{
//     max-width: 1000px;
//     margin-left:10px;
// }
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size:12px;
    }
    li{
        list-style: none;
    }
    #personalCalendar{
        
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
            width: 100%;
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
                .calendarChange{
                    background: url('./images/icon-calchange.png')no-repeat 0 0;
                    position:absolute;
                    top:18px;
                    right:4%;
                    z-index:10000;
                    width: 17px;
                    height: 17px;
                    
                }

        }
        .box-left-container{
            display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 290px;
            // z-index: 1001;
            transition:  all ease .5s;
            
        }
        .box-left-active{
            right: 27px;
            transition:  all ease .5s;
            .icon-right{
                transform: rotateZ(180deg)!important;
                transition: all ease .5s;
            }
            }
        .el-container{margin-right: 10px;}
        .calendarContext{
            padding:20px;
            width: 100%;
            height: 714px;
             position: relative;
            .calendarHead{
                margin-top:10px;
                height:30px;
                margin-bottom:25px;
               
                .calendarHeadLeft{
                    float: left;
                    margin-left:22px;
                     width: 100%;
                    color: #fc3439;
                    text-align: left;
                    font-size: 16px;
                    line-height: 16px;
                    font-family: '微软雅黑';
                    font-weight: bold;
                    border-bottom: 1px solid #e6e6e6;
                    padding-bottom: 11px;
                    margin: 0 0 0 0;
                    .imgIcon{
                        margin-right:11px;
                    }
                }
                .calendarHeadRight{
                    float:right;
                     position: absolute;
                    top:26px;
                    right: 20px;
                    .btn{
                        margin-right:10px;
                        line-height: 23px;
                        padding:2px 12px;
                        font-size:14px;
                        display:inline-block;
                        height: 26px;
                         border: none;
                        cursor: pointer;
                        background-color:#f2f2f2;
                        border:1px solid #f3f3f3
                        }
                }

            }
            .calendarBody{
                min-width: 700px;
                #calendar{
                    height:900px;
                    .event-selected1{
                        
                          border:2px solid #000; box-shadow: 0 0 5px #000; border-radius: 5px; 
                    
                    //修改日历样式
                    }
                }
            }  
        }
        .calendarContext1{
            padding:20px;
            width: 100%;
            height: 714px;
             position: relative;
             .calendarHead{
                margin-top:10px;
                height:30px;
                margin-bottom:25px;
               
                .calendarHeadLeft{
                    float: left;
                    margin-left:22px;
                     width: 100%;
                    color: #fc3439;
                    text-align: left;
                    font-size: 16px;
                    line-height: 16px;
                    font-family: '微软雅黑';
                    font-weight: bold;
                    border-bottom: 1px solid #e6e6e6;
                    padding-bottom: 11px;
                    margin: 0 0 0 0;
                    .imgIcon{
                        margin-right:11px;
                    }
                }
                .calendarHeadRight{
                    float:right;
                     position: absolute;
                    top:26px;
                    right: 20px;
                    .btn{
                        margin-right:10px;
                        line-height: 23px;
                        padding:2px 12px;
                        font-size:14px;
                        display:inline-block;
                        height: 26px;
                         border: none;
                        cursor: pointer;
                        background-color:#f2f2f2;
                        border:1px solid #f3f3f3
                        }
                }

            }
            .eventView{
                width: 100%;
                margin-top:20px;
                min-width: 700px;
                height: 680px;
                position: relative;
                .eventViewHead{
                    height: 20px;
                    .currentDate{
                        display: inline-block;
                        float: left;
                        margin-left:20px;
                        position: relative;
                        .calendaricon{
                            position: absolute;
                            background: url(./images/calendar-icon.png) no-repeat 0 0;
                            top:-1px;
                            left:-22px;
                            height: 16px;
                            width:16px;
                            z-index:10000;
                        }
                        .curDate{
                            font-size:14px;
                        line-height: 14px;
                        color:#666666;
                        }
                        .curWeek{
                            font-size:14px;
                        line-height: 14px;
                        color:#666666;
                        }
                    }
                    .searchOperate{
                        float:right;
                        .before{
                            display: inline-block;
                            margin-right: 15px;
                            span{
                                 font-size:14px;
                                line-height: 14px;
                                color:#666666;
                            }
                            select{
                                height: 25px;
                                width: 100px;
                                border-radius: 2px;
                            }
                        }
                        .after{
                            display: inline-block;
                            margin-right: 5px;
                            span{
                                 font-size:14px;
                                line-height: 14px;
                                color:#666666;
                            }
                            select{
                                height: 25px;
                                width: 100px;
                                border-radius: 2px;
                            }

                        }

                    }


                }
                .eventViewBody{
                    margin-top:40px;
                    width: 100%;
                   
                    .eventViewBodyUl{
                        overflow: hidden;
                         :hover{
                                // background-color: #f2f2f2;
                                 .updateEventView{
                                background: url(./images/edit1.png) no-repeat 0 0;
                                width: 16px;
                                height: 16px;
                                position: absolute;
                                top:15px;
                                right: 60px;
                                cursor: pointer;
                                }
                                .deleteEventView{
                                    background: url(./images/delete1.png) no-repeat 0 0;
                                    width: 16px;
                                    height: 16px;
                                    position: absolute;
                                    top:15px;
                                    right: 30px;
                                    cursor: pointer;
                                }
                            }
                             .active{
                        background-color: #f2f2f2;
                    }
                        .eventViewBodyLi{
                            height: 140px;
                            padding: 10px;
                            position: relative;
                            overflow: hidden;
                           
                            .title{
                                float: left;
                                height: 20px;
                                font-size: 18px;
                                font-weight: bold;
                                color: #333333;
                                line-height: 18px;
                            }
                            .body{
                                position: absolute;
                                margin-top:30px;
                                left:10px;
                                height: 30px;
                                float: left;
                               
                                span{
                                    text-align: left;
                                     font-size: 12px;
                                     display: inline-block;
                                     margin-right: 70px;
                                color:#666666;
                                line-height: 14px;

                                }
                            }
                            .foot{
                                position: absolute;
                                margin-top:52px;
                                left:10px;
                                height: 30px;
                                float: left;
                                span{
                                    text-align: left;
                                     font-size: 12px;
                                     display: inline-block;
                                    color:#999999;
                                    line-height: 12px;
                                }
                            }
                           
                        }
                    }
                }
                .eventViewFooter{
                    position: absolute;
                    bottom: 0px;
                    margin-top:20px;
                    right: 0px;
                }

            }
        }
        // 右侧
        .box-right-container{
            display: block;
            position: fixed;
            right: -264px;
            bottom: 0;
            width: 290px;
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
                .item-event{
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
                    .item-file{
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
                    .active-version{
                    .item-file{
                        background: #fff;
                        color: #fc3439;
                        width: 25px;
                        &::after{
                            background: #fff;
                            // border-right: 1px solid #ffffff;
                        }
                    }
                    .item-event::after{
                        background: #fff;
                    }
                }
                .active{
                .item-event{
                      background: #fff;
                      color: #fc3439;
                }
                .item-event{
                   width: 25px;
                }
            } 
            }
        }
        .box-right-active{
            right: 0;
            transition: all ease .5s;
        }
        #box-right{
            padding: 19px 13px 0 10px;
            .header-information{
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
                .header-information:last-of-type{
                margin-top: 30px;
            }
            }
            
            .show{
                display: block !important;
            }
            #basicInformation{
                    display: none;
                    >li:last-of-type{
                        padding-bottom: 7px;
                    }
                    .detial-item{
                    font-size: 12px;
                    line-height: 12px;
                    height:16px;
                    margin-top: 16px;
                    margin-left:8px;
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
                        // overflow-x: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &:first-of-type{
                        margin-top: 18px;
                    }
                }
            }
 
        }
        #box-right1{
            padding: 19px 13px 0 10px;
            #bindword{

                 .show{
                    display: block !important;
                } 
                .bindwordUl{
                    display: none;
                    >li:last-of-type{
                        padding-bottom: 7px;
                    }
                    width: 100%;
                    overflow-y: auto;
                    padding: 5px;
                    .bindwordLi{
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
                        .bindwordText{
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
                .header-information{
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
                    .icon-dropDown1{
                        display: block;
                        width: 12px;
                        height: 12px; 
                        margin-right: 5px;
                        float: right;
                        cursor: pointer;
                        transition:  all ease .2s;
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
                    .header-information:last-of-type{
                    margin-top: 30px;
                }
                }
            }

            #bindpic{
                    margin-top:10px;
                    .show{
                    display: block !important;
                }
                .bindpicUl{
                     display: none;
                    >li:last-of-type{
                        padding-bottom: 7px;
                    }
                    margin-top:20px;
                    width: 100%;
                    overflow-y: auto;
                    padding: 5px;
                    .bindpicLi{
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
                        .bindwordText{
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
                .header-information{
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
                    .icon-dropDown1{
                        display: block;
                        width: 12px;
                        height: 12px; 
                        float: right;
                        margin-right: 5px;
                        cursor: pointer;
                        transition:  all ease .2s;
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
                    .header-information:last-of-type{
                    margin-top: 30px;
                }
                }
            }
            
            .show{
                display: block !important;
            }

        }

        #edit{
            .el-dialog{
                .el-dialog__body{
                    height: 500px;
                    background: #f2f2f2;
                    position: relative;
                    
                    .tree{
                        width:200px;
                        height: 460px;
                        border: 1px solid #f3f3f3;
                        // position:absolute;
                        #cloudDirveFileTree{
                            width: 178px;
                            display: block;
                            position: absolute;
                            left: 22px;
                            right: 0;
                            bottom: 0;
                            top: 111px;
                            overflow-y: auto;
                        }
                        >p{
                            padding-bottom:5px;
                            border-bottom: 1px solid #e6e6e6;
                            margin-bottom:10px;  
                        }
                        /*
                            修改eleUI树形组件
                        */
                        .el-tree-node:focus .el-tree-node__content{
                            background-color: transparent;
                            height: 200px;
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
                        }

                    .tableList{
                        position:absolute;
                        float: right;
                        width: 460px;
                        height: 500px;
                        border-left:1px solid #e6e6e6;
                        top:70px;
                        right: 0px;
                         table{
                             width: 100%;
                                border-collapse:collapse;
                                border-bottom: 1px solid #e6e6e6;
                                tbody{
                                       
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
                                                border-bottom: 1px solid #e6e6e6;
                                            }
                                        }
                                }

                                }
                    }
                    .GroupSelect{
                        display: block;
                        width: 168px;
                        height: 30px;
                        position: absolute;
                        top: 77px;
                        z-index: 1000;
                        left: 18px;
                        .inp-search{
                            width: 168px;
                           
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
                }
            }
                .editBody{
                    .editUl{
                        margin-bottom: 20px;
                    }
                    .editBodyone{

                        .editLi{
                            
                            height: 10px;
                            margin-bottom:20px;
                            margin-right: 10px;
                            input{
                                font-size: 12px;
                                height: 24px;
                                margin: 0 6px 0 0;
                                position: relative;
                                top: 8px;
                            }
                            label{
                                color: #666;
                                font-size: 14px;
                                line-height: 14px;
                                font-weight: normal;
                            }
                        }
                    .inp{
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        height: 36px;
                        width:444px;
                    }
                   
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
                .editCheckBox{
                        float:left;
                        margin-left:116px;
                        margin-bottom:20px;
                    }
                .editTextArea{
                    float:left;
                    margin-left:106px;
                    margin-bottom:20px;
                }
                .editArea{
                    float:left;
                    margin-left:106px;
                    margin-bottom:20px;
                    color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    display: inline-block;

                }
                .editBodytwo{
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
                    

                    .editInpText1{
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        float: left;
                        margin-left: 85px;
                        text-align: left;
                        .editRepeat{
                            color: #666;
                            font-size: 14px;
                            line-height: 14px;
                            font-weight: normal;
                            display: inline-block;
                            margin-left: 25px;

                        }
                    }
                    .editUpdateText{
                        color: #666;
                        font-size: 14px;
                        line-height: 30px;
                        font-weight: normal;
                        display: inline-block;
                        float:left;
                        margin-left: 110px;
                        text-align: left;

                    }
                    .editSelect1{
                        float: left;
                        width: 155px;
                        height: 34px;
                        margin-left:31px;
                        color: #333333;
                        background-color: #fff;
                        background-image: none;
                        border: 1px solid #d1d1d1;
                        border-radius: 4px;
                        padding:0px 0px 0px 10px;
                    }
                     .editText{
                         width: 155px;
                    }
                    
                    .editSelect{
                        width: 155px;
                        height: 34px;
                        color: #333333;
                        background-color: #fff;
                        background-image: none;
                        border: 1px solid #d1d1d1;
                        border-radius: 4px;
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
                    float: right;
                    margin-right: 242px;
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
                            height: 40px;
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
<script>
import moment from 'moment';
import '../ManageCost/js/jquery-1.8.3.js'
// import './js/jquery-ui-1.9.2.custom.js'
// import './js/date.js'
import data from '../Settings/js/date.js'
import axios from 'axios'
import 'fullcalendar/dist/locale/zh-cn'
export default {
  name:'personalCalendar',
    data(){
        return {
            //事件视图
            isActive:'',
            viewshow:true,
            curDateList:'',
            curWeekList:'',
            beforeToStartValue:'',
            afterValue:'',
            beforeToStartList:[
                {
                    value:0,
                    label:'无'
                },
                {
                    value:1,
                    label:'前一天'
                },
                {
                    value:2,
                    label:'上周'
                },
                {
                    value:3,
                    label:'上个月'
                },
                {
                    value:4,
                    label:'一年以内'
                }
            ],
            after:[{
                    value:0,
                    label:'无'
                },
                {
                    value:1,
                    label:'两天内'
                },
                {
                    value:2,
                    label:'三天内'
                },
                {
                    value:3,
                    label:'一周内'
                },
                {
                    value:4,
                    label:'两周内'
                },
                {
                    value:5,
                    label:'一个月内'
                },
                {
                    value:6,
                    label:'两个月内'
                },
                {
                    value:7,
                    label:'三个月内'
                },
                {
                    value:8,
                    label:'一年之内'
                }],
                startDate:'',
                endDate:'',
                eventViewList:[],
                eventViewrows:[],
                eventViewpager:'',
                pageSize:'',
                totalSize:0,
                currentPage3:1,
            //
            fileIdLists:[],
            checkedList:[],
            timeDefaultShow:new Date().toLocaleTimeString(),
            start1:'',
            end1:'',
            calendarEventList:'',
            addEventList:'',
            CalendarTaskList:'',
            eventInformationList:'',
            eventId:'',
            ugList:'',
            eventSources:[],
            data1: [],
            //删除事件
            deleteTypes:'',
            deleteTypeList:[{
                value:0,
                label:'只删除当前的事件'
            },
            {
                value:1,
                label:'删除所有此重复事件'
            },
            {
                value:2,
                label:'删除当前事件和之后的此重复事件'

            }],

            updateTypeList:[{
                value:0,
                label:'只修改当前的事件'
            },
            {
                value:1,
                label:'修改所有此重复事件'
            },
            {
                value:2,
                label:'修改当前事件和之后的此重复事件'

            }],
            updateTypeValue:'',
            //文件上传
            uploadfilesList:[],
            imageName:'',
            uploadshow:false,
            fileLists:'',
            attachLists:'',
            filePath:'',
            FileTree_original:[],//原始文件树形图
            FileTree:[],//文件夹树形图
             checkFileDir:{},//选中的文件夹信息
            defaultProps: {
                children: 'children',
                label: 'nodeName'
            },//指定节点标签和子树为节点对象的某个属性值
            expandedKeys:[],//默认展开的节点的 key 的数组
            selectUgId:'',//选中的群组id
            firstTime:0,
            dirId:'',
            searchFileList:[],
            addWordDialog:false,
            eventColorList:['lightskyblue','cadetblue','cornflowerblue','darkseagreen','lightblue','lightseagreen','yellow','green','blue','violet'],
            repeatTypeLabel:'',
            repeatTypeList:[
                {
                        value:0,
                        label:'不重复'
                    },
                    {
                        value:1,
                        label:'每周'
                    },
                    {
                        value:2,
                        label:'每月'
                    },
                        {
                        value:3,
                        label:'每年'
                    },
            ],
            eventNames:'',
            eventPositions:'',
            repeatTypeValue:'',
            startTimeValue:'',
            endTimeValue:'',
            terminate:'',
            terminates:'',
            eventContext:'',
            eventColor:true,
            eventColorOne:'',
            eventColorValue:'',
            addEventTextDialog:false,
            updateEventTextDialog:false,
            deleteEventTextDialog:false,
            checkValue:true,
            personalCalendarList:[],
            screenLeft:{
                show:true,
                item:1,
            },
            show:{
                basicInformation:true,
                appendix:false
            },
            events: [{
            start  : new Date().getTime(),

            },
            ],
            // eventBorderColor:'black',
            selected: {},
            config:{
                height:850,
                contentHeight: 600,
                locale: 'zh-cn',
                weekNumbers: false,
                editable: false, // 是否可拖动
                eventLimit: false, // allow "more" link when too many events
                selectable: true,
                firstDay: 0,
                firstHour: 5,
                
                defaultView: 'month',
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'prevYear, prev, title, next, nextYear',
                    right:'today listMonth' 
                },
                timeFormat: 'HH:mm',
                views: {
                    month: {
                        titleFormat: 'YYYY' + '年' + 'MM' + '月'
                    }
                },
        //  eventClick: (calEvent, jsEvent, view) => {
        //      this.selected=calEvent;
        //   alert("event:"+calEvent.start);
        //   alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        //    alert('View: ' + view.name);
        //    alert("start:"+moment(view.start).format("YYYY-MM-DD HH:mm"));
        //    alert("end:"+moment(view.end).format("YYYY-MM-DD HH:mm"));
        // }, 
            },
    };
    },
    filters:{
        repeatTypeChanges(val){
            var str=''
            if(val==0){
                str='不重复'
            }else if(val==1){
                str="每周"
            }else if(val==2){
                str="每月"
            }else if(val==3){
                str="每年"
            }
            return str;
        },
        timeChange(val){
                return moment(val).format("YYYY-MM-DD HH:mm");
            },
    },
    watch:{
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
    created(){
            var vm = this
            this.token = localStorage.getItem('token');
            this.projId = localStorage.getItem('projId');
            vm.userId  = localStorage.getItem('userid')
            vm.BDMSUrl = vm.$store.state.BDMSUrl;
            vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
            this.getPersonalCalendar();//进入个人日历页面(获取当前用户所在工程下群组)
            },
    mounted(){
        this.initEvent();
        this.initTask();
    },
    methods: {
        chectItem(num){
            this.isActive=num;
            this.eventViewrows.forEach((item,index)=>{
                if(item.id==num){
                    this.eventId=item.id
                }
            })
            this.informationShow()
        },
         handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.eventView(val)
            console.log(`当前页: ${val}`);
        },
        viewChange(){
            this.viewshow=!this.viewshow;
            var myDate = new Date(), str = '';
            str += myDate.getFullYear() +'年';
            str += myDate.getMonth() + 1 + '月';
            str += myDate.getDate() + '日';
            this.curDateList=str;
            var today=['星期一','星期二','星期三','星期四','星期五','星期六','星期天'];
            var week=today[myDate.getDay()];
           this.curWeekList=week;
           this.startDate=myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate();
           this.endDate=myDate.getFullYear()+'-'+(myDate.getMonth() + 1)+'-'+myDate.getDate()+ " 23:59:59";
           this.beforeToStartValue=this.beforeToStartList[0].value;
           this.afterValue=this.after[0].value;
           this.eventView();
        },
        eventChange(){

        },
        beforeToStartChange(){
            this.beforeToStartList.forEach((item)=>{
                if(this.beforeToStartValue==item.value){
                    this.beforeToStartValue=item.value
                }
            })
            this.startDate=this.beforeToStart(this.beforeToStartValue);
            this.eventView();
        },
        //之前事件改变器
        beforeToStart(value){
                var date = new Date();
                var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
                var strYear = date.getFullYear();
                var strMonth = date.getMonth() + 1;
                var strDay = date.getDate();
                var day = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                var week = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (value == 1) {
                    return day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
                } else if (value == 2) {
                    return week.getFullYear() + '-' + (week.getMonth() + 1) + '-' + week.getDate();
                } else if (value == 3) {
                    if (strYear % 4 == 0 && strYear % 100 != 0) {
                        daysInMonth[2] = 29;
                    }
                    if (strMonth - 1 == 0) {
                        strYear -= 1;
                        strMonth = 12;
                    } else {
                        strMonth -= 1;
                    }
                    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
                } else if (value == 4) {
                    strYear = date.getFullYear() - 1;
                }
                if (strMonth < 10) {
                    strMonth = "0" + strMonth;
                }
                if (strDay < 10) {
                    strDay = "0" + strDay;
                }
                var datastr = strYear + "-" + strMonth + "-" + strDay;
                return datastr;
                },
        afterToEndChange(){
            this.after.forEach((item)=>{
                if(this.afterValue==item.value){
                    this.afterValue=item.value
                }
            })
            this.endDate=this.afterToEnd(this.afterValue);
            this.eventView()
        },
        //之后事件改变器
         afterToEnd(value){
            var date = new Date();
            var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
            var strYear = date.getFullYear();
            var strMonth = date.getMonth() + 1;
            var strDay = date.getDate();
            var twoDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            var threeDay = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
            var week = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            var twoWeek = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000);
            if (value == 1) {
                return twoDay.getFullYear() + '-' + (twoDay.getMonth() + 1) + '-' + twoDay.getDate()+ " 23:59:59";
            } else if (value == 2) {
                return threeDay.getFullYear() + '-' + (threeDay.getMonth() + 1) + '-' + threeDay.getDate() + " 23:59:59";
            } else if (value == 3) {
                return week.getFullYear() + '-' + (week.getMonth() + 1) + '-' + week.getDate() + " 23:59:59";
            } else if (value == 4) {
                return twoWeek.getFullYear() + '-' + (twoWeek.getMonth() + 1) + '-' + twoWeek.getDate() + " 23:59:59";
            } else if (value == 5) {
                if (strYear % 4 == 0 && strYear % 100 != 0) {
                    daysInMonth[2] = 29;
                }
                if (strMonth + 1 == 13) {
                    strYear += 1;
                    strMonth = 1;
                } else {
                    strMonth += 1;
                }
                strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
            } else if (value == 6) {
                if (strYear % 4 == 0 && strYear % 100 != 0) {
                    daysInMonth[2] = 29;
                }
                if (strMonth + 2 == 13) {
                    strYear += 1;
                    strMonth = 1;
                } else if (strMonth + 2 == 14) {
                    strYear += 1;
                    strMonth = 2;
                } else {
                    strMonth += 2;
                }
                strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
            } else if (value == 7) {
                if (strYear % 4 == 0 && strYear % 100 != 0) {
                    daysInMonth[2] = 29;
                }
                if (strMonth + 3 == 13) {
                    strYear += 1;
                    strMonth = 1;
                } else if (strMonth + 3 == 14) {
                    strYear += 1;
                    strMonth = 2;
                } else if (strMonth + 3 == 15) {
                    strYear += 1;
                    strMonth = 3;
                } else {
                    strMonth += 3;
                }
                strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
            } else if (value == 8) {
                strYear = date.getFullYear() + 1;
            }
            if (strMonth < 10) {
                strMonth = "0" + strMonth;
            }
            if (strDay < 10) {
                strDay = "0" + strDay;
            }
            var datastr = strYear + "-" + strMonth + "-" + strDay + " 23:59:59";
                return datastr
            },
        
        eventView(pageNo){
            pageNo = pageNo || 1;
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/events',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        start:this.startDate,
                        end:this.endDate,
                        pageNo:pageNo,
                        pageSize:4
                    }
                    }).then(response=>{
                        if(response.data.result){
                            this.eventViewList=response.data.obj;
                            this.eventViewrows=this.eventViewList.rows;
                            this.eventViewpager=this.eventViewList.pager;
                            this.totalSize=this.eventViewpager.totalSize;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }
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
        initCalendar(){
            var event=[];
            this.calendarEventList.forEach((item,index)=>{
                    event.push({
                        id:item.id,
                        title:item.eventName,
                        start:moment(item.eventStart).format("YYYY-MM-DD HH:mm"),
                        end:moment(item.eventEnd).format("YYYY-MM-DD HH:mm"),
                        color:item.eventColor,
                        allDay:item.allDay==1?true:false,
                        borderColor:'white'
                        
                })
                    })
                    this.eventSources.push({events:event,textColor:'black',color:'red',});
            
        },

    eventSelected(calEvent, jsEvent, view) {
           this.eventId=calEvent.id;
        var str=this.eventSources[0].events;
        str.forEach((item)=>{
            if(item.id==calEvent.id){
                item.borderColor="black";
            }
            else{
                item.borderColor="white";
            }
            
        })
           this.informationShow();
           this.attachList();
    },
    informationShow(){
        
        axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/'+this.eventId,
                    headers:{
                        'token':this.token
                    },
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.eventInformationList=response.data.rt;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })

    },
    eventRender(event, element, view){
        this.start1=moment(view.start).format("YYYY-MM-DD HH:mm");
        this.end1=moment(view.end).format("YYYY-MM-DD HH:mm");
        // alert(JSON.stringify("start:"+moment(view.start).format("YYYY-MM-DD HH:mm")));
        //    alert(JSON.stringify("end:"+moment(view.end).format("YYYY-MM-DD HH:mm")));
            
    },
    dayClick(date, jsEvent, view)
    {
        
    },
        eventCreated(...test) {
            console.log(test);
        },
        initEvent(){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/calendar/events',
                    headers:{
                        'token':this.token
                    },
                    params:{
                    start:this.start1,
                    end:this.end1
                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.calendarEventList=response.data.rt;
                            this.initCalendar();
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
                },

        initTask(){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/calendar/tasks',
                    headers:{
                        'token':this.token
                    },
                    params:{
                    start:this.start1,
                    end:this.end1
                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.CalendarTaskList=response.data.rt;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
            },

        // //初始树形图
        initTreeFolder(){
            var vm = this
            vm.firstTime = 0
            vm.getFileTree()
      },
      //获得文件树形图
        getFileTree(){
                      
            var vm = this;
            this.addWordDialog=true;
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
                method:'get',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/'+this.selectUgId+'/directory',
                headers:{
                    'token':this.token
                },
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    vm.FileTree_original = response.data.rt
                    vm.FileTree = data.transformTozTreeFormat(setting, response.data.rt)
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
                }
                }
                
            }).catch((err)=>{
            console.log(err)
        })
        },
        addword(){
             if(!this.eventId){
                alert('提示：请选择你要添加附件的事件')
            }else{
                this.getFileTree()
                this.addWordDialog=true;
            }
        },
        addWordCancle(){
            this.addWordDialog=false;
            this.searchFileList=[];
        },
        getPersonalCalendar(){
            axios({
                    method:'get',
                    url:this.BDMSUrl+'/project2/schedule/personalCalendar',
                    headers:{
                        'token':this.token
                    },
                    params:{
                    projId:this.projId
                    }
                }).then(response=>{
                    if(response.data.cd == '0'){
                        this.ugList=response.data.rt;
                        this.selectUgId=this.ugList[0].ugId;
                    }else if(response.data.cd = '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
        },
        InitselectUgId(){
            var vm=this
            for(var i=0;i<this.ugList.length;i++){
                if(this.ugList[i].ugId==this.selectUgId){
                    this.expandedKeys=[]
                    this.getFileTree()
                    break
                }
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
        handleNodeClick(obj){
            this.dirId=obj.nodeId;
            this.searchFile()
        },
            //点击新增事件内容
        addEvent(){
            this.repeatTypeValue=this.repeatTypeList[0].value;
            this.checkValue=true;
            this.eventColorValue="yellow";
            this.eventColorOne="yellow";
            this.addEventTextDialog=true;
        },
        //新增事件确认
        addEventTextMakeSure(){
            if(this.eventNames==''){
                alert('事件不能为空')
                return;
            }else if(this.eventPositions==''){
                alert('地点不能为空')
                    return;        
            }else if(this.startTimeValue>this.endTimeValue){
                alert('提示：结束时间必须大于开始时间')
                return;
            }
            

            if(this.repeatTypeValue!=0){
                if(this.repeatTypeValue==1){
                    if((this.endTimeValue.getTime()-this.startTimeValue.getTime())/1000 / 60 / 60 / 24 / 7 >= 1){
                        alert("提示：开始时间与结束时间之差必须小于7天")
                        return;
                    }
                }else if(this.repeatTypeValue==2){
                    if((this.endTimeValue.getTime()-this.startTimeValue.getTime())/ 1000 / 60 / 60 / 24 / 31 >= 1){
                        alert("提示：开始时间与结束时间之差必须小于31天")
                        return;
                    }
                }else if(this.repeatTypeValue==3){
                    if((this.endTimeValue.getTime()-this.startTimeValue.getTime())/ 1000 / 60 / 60 / 24 / 366 >= 1){
                        alert("提示：开始时间与结束时间之差必须小于366天")
                        return;
                    }
                }

                 if(!this.terminate)
                {
                    alert("提示：事件终止日期不能为空")
                    return;
                }
                else if(this.terminate<this.endTimeValue){
                    alert("提示：事件终止日期不能小于结束时间")
                    return;
                }
                this.terminates=this.dateChange1(this.terminate)  
            }

            
             axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/calendar/add',
                    headers:{
                        'token':this.token
                    },
                   data:{
                       allDay:this.valueChange(this.checkValue),
                       eventName:this.eventNames,
                       eventStart:this.dateChange(this.startTimeValue),
                       eventEnd:this.dateChange(this.endTimeValue),
                       eventPosition:this.eventPositions,
                       repeatType:this.repeatTypeValue.toString(),
                       eventTerminate:this.terminates,
                       eventColor:this.eventColorValue,
                       content:this.eventContext,
                       callType:'0',
                   }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                    this.addEventList=response.data.rt;
                                    this.eventSources=[];
                                    this.initEvent();
                                    this.eventView();
                                     this.addEventTextDialog=false;    
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
        },
        refreshEvents() {
            this.$refs.calendar.$emit('rerender-events')
            },
        valueChange(val){
            return val==true?1:0;
        },
        //时间检验器
         dateChange1(val){
            return moment(val).format("YYYY-MM-DD");
        },
         dateChange(val){
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
        },
        //取消新增事件
        addETCancle(){
            this.checkValue='';
            this.eventNames='';
            this.startTimeValue='';
            this.endTimeValue='';
            this.eventPositions='';
            this.repeatTypeValue='';
            this.terminate='';
            this.eventColorValue='';
            this.eventContext='';
            this.addEventTextDialog=false;
        },
        //点击修改事件
        updateEvent(){
            if(this.eventInformationList){
                this.updateEventTextDialog=true;
            }else{
                alert("请指定需要修改的事件")
            }
            this.updateTypeValue=this.updateTypeList[0].value;
            this.checkValue=this.shifouChange(this.eventInformationList.allDay);
            this.eventNames=this.eventInformationList.eventName;
            this.startTimeValue=this.StrToGMT(this.eventInformationList.eventStart);
            this.endTimeValue=this.StrToGMT(this.eventInformationList.eventEnd);
            this.eventPositions=this.eventInformationList.eventPosition;
            this.repeatTypeValue=this.eventInformationList.repeatType;
            this.repeatTypeList.forEach((item)=>{
                if(item.value==this.repeatTypeValue){
                    this.repeatTypeLabel=item.label;
                }
            })
            this.eventColorValue=this.eventInformationList.eventColor;
            this.eventColorOne=this.toBeColor(this.eventColorValue)
            this.eventContext=this.eventInformationList.content;
        },
        //
        //时间选择器
            StrToGMT(time){
                let GMT = new Date(time)
                return GMT
            },
        // 是否判断器
        shifouChange(val){
            return val==1?true:false;
        },
        //确认修改事件
        updateEventTextMakeSure(){
            if(this.eventNames==''){
                alert('事件不能为空')
                return;
            }else if(this.eventPositions==''){
                alert('地点不能为空')
                return;
            }else if(this.startTimeValue>this.endTimeValue){
                alert('提示：结束时间必须大于开始时间')
                return;
            }
            
             axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/update',
                    headers:{
                        'token':this.token
                    },
                   data:{
                       event:{
                            id:this.eventId,
                            allDay:this.valueChange(this.checkValue),
                            eventName:this.eventNames,
                            eventStart:this.dateChange(this.startTimeValue),
                            eventEnd:this.dateChange(this.endTimeValue),
                            eventPosition:this.eventPositions,
                            eventColor:this.eventColorValue,
                            content:this.eventContext,
                            callType:'0',
                       },
                       updateType:this.deleteTypeValue
                   }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.eventSources=[],
                            this.initEvent();
                            this.eventView();
                            this.updateEventTextDialog=false;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
        },
        // 取消修改事件
        updateETCancle(){
            this.checkValue='';
            this.eventNames='';
            this.startTimeValue='';
            this.endTimeValue='';
            this.eventPositions='';
            this.repeatTypeValue='';
            this.terminate='';
            this.eventColorValue='';
            this.eventContext='';
            this.updateEventTextDialog=false;
        },
        //点击删除事件
        deleteEvent(){
            if(!this.eventId){
                alert('提示：请指定需要删除的事件')
            }else{
            this.deleteTypes=this.deleteTypeList[0].value;
            this.deleteEventTextDialog=true;
         }
        },
        //确认删除事件
        deleteEventTextMakeSure(){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/'+this.eventId+'/delete',
                    headers:{
                        'token':this.token
                    },
                   params:{
                       deleteType:this.deleteTypes
                   }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                this.$refs.calendar.$emit('remove-event',this.eventId);
                                this.eventSources=[];
                                this.initEvent();
                                this.eventView();
                                this.deleteEventTextDialog=false;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })  
        },
        //取消删除事件
        deleteETCancle(){
            this.deleteEventTextDialog=false;
        },
        repeatTypeChange(){
            //  this.initEvent();
            // this.initTask();
            this.repeatTypeList.forEach((item,index)=>{
                if(this.repeatTypeValue==item.value){
                    this.repeatTypeValue=item.value
                }
            })
        },
        updateTypeChange(){
            this.updateTypeList.forEach((item,index)=>{
                if(this.updateTypeValue==item.value){
                    this.updateTypeValue=item.value
                }
            })
        },
        eventColorChange(){
            this.eventColorOne=this.toBeColor(this.eventColorValue)
        },
        toBeColor(val){
            return val;
        },
        //获取获取个人日历事件附加信息
        attachList(){
             axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/'+this.eventId+'/attachList',
                    headers:{
                        'token':this.token
                    },
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                this.fileLists=response.data.rt.fileList;
                                this.attachLists=response.data.rt.attachList;
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
        },
        searchs(filePath){
            window.open(this.QJFileManageSystemURL+filePath+"/preview");
        },
        downLoad(filePath){
            var vm=this
            window.open(vm.QJFileManageSystemURL + filePath +'');
        },
        deleteword(fileId){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/deletAttach',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        eventId:this.eventId,
                        fileId:fileId
                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                this.attachList()
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
        },
        deletepic(fileId){
            axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/deletAttach',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        eventId:this.eventId,
                        fileId:fileId
                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                this.attachList()
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })

        },
        addpic(){
            if(!this.eventId){
                alert('提示：请选择你要添加附件的事件')
            }else{
            this.uploadshow=true;
            }
        },
        upImgCancle(){
            this.uploadshow=false;
        },

        addwordMakeSure(){
             this.searchFileList.forEach((item1)=>{
                                if(item1.select==true){
                                    this.fileIdLists.push(item1.fileId)
           
                                }
             }),
             axios({
                    method:'post',
                    url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/event/addRelaFile',
                    headers:{
                            'token':this.token
                        },
                    data:{
                        eventId:this.eventId,
                        fileIdList:this.fileIdLists

                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                                this.attachList();
                                this.addWordDialog=false;
                                this.searchFileList=[];
                                this.fileIdLists=[];
                        }else if(response.data.cd = '-1'){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
        },
        uploadIMG(){
            var returnUrl=this.BDMSUrl+'/project2/schedule/event/attachmentUpload?id='+this.eventId;
            returnUrl = encodeURIComponent(returnUrl);
            var formData= new FormData();
            formData.append('token',this.token);
            formData.append('projId',this.projId);
            // formData.append('id',this.eventId);
            formData.append('type',1);
            formData.append('file',this.uploadfilesList);
            formData.append('userId',this.userId);
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
                                this.attachList();
                                this.uploadshow=false;
                        }
                    })  
        },
        selectImg(){
            this.$refs.file.click()
        },
        fileChanged(e){
           this.uploadfilesList=e.target.files[0];
           this.imageName=this.uploadfilesList.name;
        },
        searchFile(){
           
            axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/schedule/searchFile',
                    headers:{
                        'token':this.token
                    },
                    params:{       
                    dirId:this.dirId,
                    projId:this.projId,
                    }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.searchFileList=[]
                            if(response.data.rt.rows.length>0){
                            this.searchFileList = response.data.rt.rows;
                                this.searchFileList.forEach((item)=>{
                                    this.$set(item,'select',false)
                                })
                                }else{
                                    this.searchFileList=[]
                                }
                        }else if(response.data.cd = '-1'){
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

