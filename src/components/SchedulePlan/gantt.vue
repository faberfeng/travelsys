<template>

    <div id="workSpace" style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px">
        <button @click="getGanttList">按钮</button>
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
    </div>
</template>
<script>
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
export default {
    data(){
        return{
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
          ], "canWrite":    true, "canDelete":true, "canWriteOnParent": true, canAdd:true},
          ge:''
        }
    },
    created(){
        
    },
    methods:{
        getGanttList() {
        //  this.ge = new GanttMaster(this);
        // this.ge.reset();
        // this.updateGanttCollapse();
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
    } 
}
</script>
<style></style>
