/*
 Copyright (c) 2012-2018 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var indexInfo = '';
import {GridEditor} from './ganttGridEditor.js'

export {
  GanttMaster
}
function GanttMaster(taskIndexInfo){
  indexInfo = taskIndexInfo;
    this.tasks = [];
    this.deletedTaskIds = [];
    this.links = [];

    this.editor; //element for editor
    this.gantt; //element for gantt
    this.splitter; //element for splitter

    this.isMultiRoot=false; // set to true in case of tasklist

    this.workSpace;  // the original element used for containing everything
    this.element; // editor and gantt box without buttons


    this.resources; //list of resources
    this.roles;  //list of roles

    this.minEditableDate = 0;
    this.maxEditableDate = Infinity;
    this.set100OnClose=false;
    this.shrinkParent=false;

    this.fillWithEmptyLines=true; //when is used by widget it could be usefull to do not fill with empty lines

    this.rowHeight = 30; // todo get it from css?
    this.minRowsInEditor=30; // number of rows always visible in editor
    this.numOfVisibleRows=0; //number of visible rows in the editor
    this.firstScreenLine=0; //first visible row ignoring collapsed tasks
    this.rowBufferSize=5;
    this.firstVisibleTaskIndex=-1; //index of first task visible
    this.lastVisibleTaskIndex=-1; //index of last task visible

    this.baselines={}; // contains {taskId:{taskId,start,end,status,progress}}
    this.showBaselines=false; //allows to draw baselines
    this.baselineMillis; //millis of the current baseline loaded


    this.permissions = {
      canWriteOnParent: true,
      canWrite: true,
      canAdd: true,
      canDelete: true,
      canInOutdent: true,
      canMoveUpDown: true,
      canSeePopEdit: true,
      canSeeFullEdit: true,
      canSeeDep: true,
      canSeeCriticalPath: true,
      canAddIssue: false,
      cannotCloseTaskIfIssueOpen: false
    };

    this.firstDayOfWeek = Date.firstDayOfWeek;
    this.serverClientTimeOffset = 0;

    this.currentTask; // task currently selected;

    this.resourceUrl = "res/"; // URL to resources (images etc.)
    this.__currentTransaction;  // a transaction object holds previous state during changes
    this.__undoStack = [];
    this.__redoStack = [];
    this.__inUndoRedo = false; // a control flag to avoid Undo/Redo stacks reset when needed

    Date.workingPeriodResolution=1; //by default 1 day

    var self = this;
  }


GanttMaster.prototype.init = function (workSpace) {
  var place=$("<div>").prop("id","TWGanttArea").css( {padding:0, "overflow-y":"auto", "overflow-x":"hidden","border":"1px solid #e5e5e5",position:"relative"});
  workSpace.append(place).addClass("TWGanttWorkSpace");

  this.workSpace=workSpace;
  this.element = place;
  this.numOfVisibleRows=Math.ceil(this.element.height()/this.rowHeight);

  //by default task are coloured by status
  this.element.addClass('colorByStatus' )

  var self = this;
  //load templates
  $("#gantEditorTemplates").loadTemplates().remove();

  //create editor
  this.editor = new GridEditor(this);
  place.append(this.editor.gridified);

  //create gantt
  this.gantt = new Ganttalendar(new Date().getTime() - 3600000 * 24 * 2, new Date().getTime() + 3600000 * 24 * 5, this, place.width() * .6);

  //setup splitter
  self.splitter = $.splittify.init(place, this.editor.gridified, this.gantt.element, 60);
  self.splitter.firstBoxMinWidth = 5;
  self.splitter.secondBoxMinWidth = 20;

  //prepend buttons
  var ganttButtons = $.JST.createFromTemplate({}, "GANTBUTTONS");
  place.before(ganttButtons);
  this.checkButtonPermissions();


  //bindings
  workSpace.bind("deleteFocused.gantt", function (e) {
    //delete task or link?
    var focusedSVGElement=self.gantt.element.find(".focused.focused.linkGroup");
    if (focusedSVGElement.size()>0)
      self.removeLink(focusedSVGElement.data("from"), focusedSVGElement.data("to"));
    else
    self.deleteCurrentTask();
  }).bind("addAboveCurrentTask.gantt", function () {
    self.addAboveCurrentTask();
  }).bind("addBelowCurrentTask.gantt", function () {
    self.addBelowCurrentTask();
  }).bind("indentCurrentTask.gantt", function () {
    self.indentCurrentTask();
  }).bind("outdentCurrentTask.gantt", function () {
    self.outdentCurrentTask();
  }).bind("moveUpCurrentTask.gantt", function () {
    self.moveUpCurrentTask();
  }).bind("moveDownCurrentTask.gantt", function () {
    self.moveDownCurrentTask();
  }).bind("collapseAll.gantt", function () {
    self.collapseAll();
  }).bind("expandAll.gantt", function () {
    self.expandAll();
  }).bind("fullScreen.gantt", function () {
    self.fullScreen();
  }).bind("print.gantt", function () {
    self.print();


  }).bind("zoomPlus.gantt", function () {
    self.gantt.zoomGantt(true);
  }).bind("zoomMinus.gantt", function () {
    self.gantt.zoomGantt(false);

  }).bind("openFullEditor.gantt", function () {
    self.editor.openFullEditor(self.currentTask,false);
  }).bind("openAssignmentEditor.gantt", function () {
    self.editor.openFullEditor(self.currentTask,true);
  }).bind("addIssue.gantt", function () {
    self.addIssue();
  }).bind("openExternalEditor.gantt", function () {
    self.openExternalEditor();

  }).bind("undo.gantt", function () {
    self.undo();
  }).bind("redo.gantt", function () {
    self.redo();
  }).bind("resize.gantt", function () {
    self.resize();
  });


  //bind editor scroll
  self.splitter.firstBox.scroll(function () {

    //notify scroll to editor and gantt
    self.gantt.element.stopTime("test").oneTime(10, "test", function () {
      var oldFirstRow = self.firstScreenLine;
      var newFirstRow = Math.floor(self.splitter.firstBox.scrollTop() / self.rowHeight);
      if (Math.abs(oldFirstRow - newFirstRow) >= self.rowBufferSize) {
        self.firstScreenLine = newFirstRow;
        self.scrolled(oldFirstRow);
      }
    });
  });


  //keyboard management bindings
  $("body").bind("keydown.body", function (e) {
    //console.debug(e.keyCode+ " "+e.target.nodeName, e.ctrlKey)

    var eventManaged = true;
    var isCtrl = e.ctrlKey || e.metaKey;
    var bodyOrSVG = e.target.nodeName.toLowerCase() == "body" || e.target.nodeName.toLowerCase() == "svg";
    var inWorkSpace=$(e.target).closest("#TWGanttArea").length>0;

    //store focused field
    var focusedField=$(":focus");
    var focusedSVGElement = self.gantt.element.find(".focused.focused");// orrible hack for chrome that seems to keep in memory a cached object

    var isFocusedSVGElement=focusedSVGElement.length >0;

    if ((inWorkSpace ||isFocusedSVGElement) && isCtrl && e.keyCode == 37) { // CTRL+LEFT on the grid
      self.outdentCurrentTask();
      focusedField.focus();

    } else if (inWorkSpace && isCtrl && e.keyCode == 38) { // CTRL+UP   on the grid
      self.moveUpCurrentTask();
      focusedField.focus();

    } else if (inWorkSpace && isCtrl && e.keyCode == 39) { //CTRL+RIGHT  on the grid
      self.indentCurrentTask();
      focusedField.focus();

    } else if (inWorkSpace && isCtrl && e.keyCode == 40) { //CTRL+DOWN   on the grid
      self.moveDownCurrentTask();
      focusedField.focus();

    } else if (isCtrl && e.keyCode == 89) { //CTRL+Y
      self.redo();

    } else if (isCtrl && e.keyCode == 90) { //CTRL+Y
      self.undo();


    } else if ( (isCtrl && inWorkSpace) &&   (e.keyCode == 8 || e.keyCode == 46)  ) { //CTRL+DEL CTRL+BACKSPACE  on grid
      self.deleteCurrentTask();

    } else if ( focusedSVGElement.is(".taskBox") &&   (e.keyCode == 8 || e.keyCode == 46)  ) { //DEL BACKSPACE  svg task
        self.deleteCurrentTask();

    } else if ( focusedSVGElement.is(".linkGroup") &&   (e.keyCode == 8 || e.keyCode == 46)  ) { //DEL BACKSPACE  svg link
        self.removeLink(focusedSVGElement.data("from"), focusedSVGElement.data("to"));

    } else {
      eventManaged=false;
    }


    if (eventManaged) {
      e.preventDefault();
      e.stopPropagation();
    }

  });

  //ask for comment input
  $("#saveGanttButton").after($('#LOG_CHANGES_CONTAINER'));

  //ask for comment management
  this.element.on("saveRequired.gantt",this.manageSaveRequired);


  //resize
  $(window).resize(function () {
    place.css({width: "100%", height: $(window).height() - place.position().top});
    place.trigger("resize.gantt");
  }).oneTime(2, "resize", function () {$(window).trigger("resize")});


};

GanttMaster.messages = {
  "CANNOT_WRITE":                          "CANNOT_WRITE",
  "CHANGE_OUT_OF_SCOPE":                   "NO_RIGHTS_FOR_UPDATE_PARENTS_OUT_OF_EDITOR_SCOPE",
  "START_IS_MILESTONE":                    "START_IS_MILESTONE",
  "END_IS_MILESTONE":                      "END_IS_MILESTONE",
  "TASK_HAS_CONSTRAINTS":                  "TASK_HAS_CONSTRAINTS",
  "GANTT_ERROR_DEPENDS_ON_OPEN_TASK":      "GANTT_ERROR_DEPENDS_ON_OPEN_TASK",
  "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK": "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK",
  "TASK_HAS_EXTERNAL_DEPS":                "TASK_HAS_EXTERNAL_DEPS",
  "GANTT_ERROR_LOADING_DATA_TASK_REMOVED": "GANTT_ERROR_LOADING_DATA_TASK_REMOVED",
  "CIRCULAR_REFERENCE":                    "CIRCULAR_REFERENCE",
  "CANNOT_MOVE_TASK":                      "CANNOT_MOVE_TASK",
  "CANNOT_DEPENDS_ON_ANCESTORS":           "CANNOT_DEPENDS_ON_ANCESTORS",
  "CANNOT_DEPENDS_ON_DESCENDANTS":         "CANNOT_DEPENDS_ON_DESCENDANTS",
  "INVALID_DATE_FORMAT":                   "INVALID_DATE_FORMAT",
  "GANTT_SEMESTER_SHORT":                  "GANTT_SEMESTER_SHORT",
  "GANTT_SEMESTER":                        "GANTT_SEMESTER",
  "GANTT_QUARTER_SHORT":                   "GANTT_QUARTER_SHORT",
  "GANTT_QUARTER":                         "GANTT_QUARTER",
  "GANTT_WEEK":                            "GANTT_WEEK",
  "GANTT_WEEK_SHORT":                      "GANTT_WEEK_SHORT",
  "CANNOT_CLOSE_TASK_IF_OPEN_ISSUE":       "CANNOT_CLOSE_TASK_IF_OPEN_ISSUE",
  "PLEASE_SAVE_PROJECT":                   "PLEASE_SAVE_PROJECT",
  "CANNOT_CREATE_SAME_LINK":               "CANNOT_CREATE_SAME_LINK"
};


GanttMaster.prototype.createTask = function (id, name, code, level, start, duration) {
  var factory = new TaskFactory();
  return factory.build(id, name, code, level, start, duration);
};


GanttMaster.prototype.getOrCreateResource = function (id, name) {
  var res= this.getResource(id);
  if (!res && id && name) {
    res = this.createResource(id, name);
  }
  return res
};

GanttMaster.prototype.createResource = function (id, name) {
  var res = new Resource(id, name);
  this.resources.push(res);
  return res;
};


//update depends strings
GanttMaster.prototype.updateDependsStrings = function () {
  //remove all deps
  for (var i = 0; i < this.tasks.length; i++) {
    this.tasks[i].depends = "";
  }

  for (var i = 0; i < this.links.length; i++) {
    var link = this.links[i];
    var dep = link.to.depends;
    link.to.depends = link.to.depends + (link.to.depends == "" ? "" : ",") + (link.from.getRow() + 1) + (link.lag ? ":" + link.lag : "");
  }

};

GanttMaster.prototype.removeLink = function (fromTask, toTask) {
  //console.debug("removeLink");
  if (!this.permissions.canWrite || (!fromTask.canWrite && !toTask.canWrite))
    return;

  this.beginTransaction();
  var found = false;
  for (var i = 0; i < this.links.length; i++) {
    if (this.links[i].from == fromTask && this.links[i].to == toTask) {
      this.links.splice(i, 1);
      found = true;
      break;
    }
  }

  if (found) {
    this.updateDependsStrings();
    if (this.updateLinks(toTask))
      this.changeTaskDates(toTask, toTask.start, toTask.end); // fake change to force date recomputation from dependencies
  }
  this.endTransaction();
};

GanttMaster.prototype.__removeAllLinks = function (task, openTrans) {

  if (openTrans)
    this.beginTransaction();
  var found = false;
  for (var i = 0; i < this.links.length; i++) {
    if (this.links[i].from == task || this.links[i].to == task) {
      this.links.splice(i, 1);
      found = true;
    }
  }

  if (found) {
    this.updateDependsStrings();
  }
  if (openTrans)
    this.endTransaction();
};

//------------------------------------  ADD TASK --------------------------------------------
GanttMaster.prototype.addTask = function (task, row) {
  //console.debug("master.addTask",task,row,this);

  task.master = this; // in order to access controller from task

  //replace if already exists
  var pos = -1;
  for (var i = 0; i < this.tasks.length; i++) {
    if (task.id == this.tasks[i].id) {
      pos = i;
      break;
    }
  }

  if (pos >= 0) {
    this.tasks.splice(pos, 1);
    row = parseInt(pos);
  }

  //add task in collection
  if (typeof(row) != "number") {
    this.tasks.push(task);
  } else {
    this.tasks.splice(row, 0, task);

    //recompute depends string
    this.updateDependsStrings();
  }

  //add Link collection in memory
  var linkLoops = !this.updateLinks(task);

  //set the status according to parent
  if (task.getParent())
    task.status = task.getParent().status;
  else
    task.status = "STATUS_ACTIVE";

  var ret = task;
  if (linkLoops || !task.setPeriod(task.start, task.end)) {
    //remove task from in-memory collection
    //console.debug("removing task from memory",task);
    this.tasks.splice(task.getRow(), 1);
    ret = undefined;
  } else {
    //append task to editor
    this.editor.addTask(task, row);
    //append task to gantt
    this.gantt.addTask(task);
  }

//trigger addedTask event
  $(this.element).trigger("addedTask.gantt", task);
  return ret;
};
/**
 * a project contais tasks, resources, roles, and info about permisions
 * @param project
 */
GanttMaster.prototype.loadProject = function (project) {
  //console.debug("loadProject", project)
  this.beginTransaction();
  this.serverClientTimeOffset = typeof project.serverTimeOffset !="undefined"? (parseInt(project.serverTimeOffset) + new Date().getTimezoneOffset() * 60000) : 0;
  this.resources = project.resources;
  this.roles = project.roles;

  //permissions from loaded project
  this.permissions.canWrite = project.canWrite;
  this.permissions.canAdd = project.canAdd;
  this.permissions.canWriteOnParent = project.canWriteOnParent;
  this.permissions.cannotCloseTaskIfIssueOpen = project.cannotCloseTaskIfIssueOpen;
  this.permissions.canAddIssue = project.canAddIssue;
  this.permissions.canDelete = project.canDelete;
  //repaint button bar basing on permissions
  this.checkButtonPermissions();



  if (project.minEditableDate)
    this.minEditableDate = computeStart(project.minEditableDate);
  else
    this.minEditableDate = -Infinity;

  if (project.maxEditableDate)
    this.maxEditableDate = computeEnd(project.maxEditableDate);
  else
    this.maxEditableDate = Infinity;


  //recover stored ccollapsed statuas
  var collTasks=this.loadCollapsedTasks();

  //shift dates in order to have client side the same hour (e.g.: 23:59) of the server side
  for (var i = 0; i < project.tasks.length; i++) {
    var task = project.tasks[i];
    task.start += this.serverClientTimeOffset;
    task.end += this.serverClientTimeOffset;
    //set initial collapsed status
    task.collapsed=collTasks.indexOf(task.id)>=0;
  }


  this.loadTasks(project.tasks, project.selectedRow);
  this.deletedTaskIds = [];


  //recover saved zoom level
  if (project.zoom){
    this.gantt.zoom = project.zoom;
  } else {
    this.gantt.shrinkBoundaries();
    this.gantt.setBestFittingZoom();
  }


  this.endTransaction();
  var self = this;
  this.gantt.element.oneTime(200, function () {self.gantt.centerOnToday()});
};
GanttMaster.prototype.loadTasks = function (tasks, selectedRow) {
  //console.debug("GanttMaster.prototype.loadTasks")
  //var prof=new Profiler("ganttMaster.loadTasks");
  var factory = new TaskFactory();

  //reset
  this.reset();

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    if (!(task instanceof Task)) {
      var t = factory.build(task.id, task.name, task.code, task.level, task.start, task.duration, task.collapsed);
      for (var key in task) {
        if (key != "end" && key != "start")
          t[key] = task[key]; //copy all properties
      }
      task = t;
    }
    task.master = this; // in order to access controller from task
    this.tasks.push(task);  //append task at the end
  }

  for (var i = 0; i < this.tasks.length; i++) {
    var task = this.tasks[i];


    var numOfError = this.__currentTransaction && this.__currentTransaction.errors ? this.__currentTransaction.errors.length : 0;
    //add Link collection in memory
    while (!this.updateLinks(task)) {  // error on update links while loading can be considered as "warning". Can be displayed and removed in order to let transaction commits.
      if (this.__currentTransaction && numOfError != this.__currentTransaction.errors.length) {
        var msg = "ERROR:\n";
        while (numOfError < this.__currentTransaction.errors.length) {
          var err = this.__currentTransaction.errors.pop();
          msg = msg + err.msg + "\n\n";
        }
        alert(msg);
      }
      this.__removeAllLinks(task, false);
    }

    if (!task.setPeriod(task.start, task.end)) {
      alert(GanttMaster.messages.GANNT_ERROR_LOADING_DATA_TASK_REMOVED + "\n" + task.name );
      //remove task from in-memory collection
      this.tasks.splice(task.getRow(), 1);
    } else {
      //append task to editor
      this.editor.addTask(task, null, true);
      //append task to gantt
      this.gantt.addTask(task);
    }
  }

  //this.editor.fillEmptyLines();
  //prof.stop();

  // re-select old row if tasks is not empty
  if (this.tasks && this.tasks.length > 0) {
    selectedRow = selectedRow ? selectedRow : 0;
    this.tasks[selectedRow].rowElement.click();
  }
};
GanttMaster.prototype.getTask = function (taskId) {
  var ret;
  for (var i = 0; i < this.tasks.length; i++) {
    var tsk = this.tasks[i];
    if (tsk.id == taskId) {
      ret = tsk;
      break;
    }
  }
  return ret;
};
GanttMaster.prototype.getResource = function (resId) {
  var ret;
  for (var i = 0; i < this.resources.length; i++) {
    var res = this.resources[i];
    if (res.id == resId) {
      ret = res;
      break;
    }
  }
  return ret;
};


GanttMaster.prototype.changeTaskDeps = function (task) {
  return task.moveTo(task.start,false,true);
};

GanttMaster.prototype.changeTaskDates = function (task, start, end) {
  //console.debug("changeTaskDates",task, start, end)
  return task.setPeriod(start, end);
};


GanttMaster.prototype.moveTask = function (task, newStart) {
  return task.moveTo(newStart, true,true);
};


GanttMaster.prototype.taskIsChanged = function () {
  //console.debug("taskIsChanged");
  var master = this;

  //refresh is executed only once every 50ms
  this.element.stopTime("gnnttaskIsChanged");
  //var profilerext = new Profiler("gm_taskIsChangedRequest");
  this.element.oneTime(50, "gnnttaskIsChanged", function () {
    //console.debug("task Is Changed real call to redraw");
    //var profiler = new Profiler("gm_taskIsChangedReal");
    master.redraw();
    master.element.trigger("gantt.redrawCompleted");
    //profiler.stop();
  });
  //profilerext.stop();
};


GanttMaster.prototype.checkButtonPermissions = function () {
  var ganttButtons=$(".ganttButtonBar");
  //hide buttons basing on permissions
  if (!this.permissions.canWrite)
    ganttButtons.find(".requireCanWrite").hide();

  if (!this.permissions.canAdd)
    ganttButtons.find(".requireCanAdd").hide();

  if (!this.permissions.canInOutdent)
    ganttButtons.find(".requireCanInOutdent").hide();

  if (!this.permissions.canMoveUpDown)
    ganttButtons.find(".requireCanMoveUpDown").hide();

  if (!this.permissions.canDelete)
    ganttButtons.find(".requireCanDelete").hide();

  if (!this.permissions.canSeeCriticalPath)
    ganttButtons.find(".requireCanSeeCriticalPath").hide();

  if (!this.permissions.canAddIssue)
    ganttButtons.find(".requireCanAddIssue").hide();

};


GanttMaster.prototype.redraw = function () {
  this.editor.redraw();
  this.gantt.redraw();
};

GanttMaster.prototype.reset = function () {
  //console.debug("GanttMaster.prototype.reset");
  this.tasks = [];
  this.links = [];
  this.deletedTaskIds = [];
  if (!this.__inUndoRedo) {
    this.__undoStack = [];
    this.__redoStack = [];
  } else { // don't reset the stacks if we're in an Undo/Redo, but restart the inUndoRedo control
    this.__inUndoRedo = false;
  }
  delete this.currentTask;

  this.editor.reset();
  this.gantt.reset();
};


GanttMaster.prototype.showTaskEditor = function (taskId) {
  var task = this.getTask(taskId);
  task.rowElement.find(".edit").click();
};

GanttMaster.prototype.saveProject = function () {
  return this.saveGantt(false);
};

GanttMaster.prototype.saveGantt = function (forTransaction) {
  //var prof = new Profiler("gm_saveGantt");
  var saved = [];
  for (var i = 0; i < this.tasks.length; i++) {
    var task = this.tasks[i];
    var cloned = task.clone();

    //shift back to server side timezone
    if (!forTransaction) {
      cloned.start -= this.serverClientTimeOffset;
      cloned.end -= this.serverClientTimeOffset;
    }

    saved.push(cloned);
  }

  var ret = {tasks: saved};
  if (this.currentTask) {
    ret.selectedRow = this.currentTask.getRow();
  }

  ret.deletedTaskIds = this.deletedTaskIds;  //this must be consistent with transactions and undo

  if (!forTransaction) {
    ret.resources = this.resources;
    ret.roles = this.roles;
    ret.canWrite = this.permissions.canWrite;
    ret.canWriteOnParent = this.permissions.canWriteOnParent;
    ret.zoom = this.gantt.zoom;

    //save collapsed tasks on localStorage
    this.storeCollapsedTasks();

    //mark un-changed task and assignments
    this.markUnChangedTasksAndAssignments(ret);

    //si aggiunge il commento al cambiamento di date/status
    ret.changesReasonWhy=$("#LOG_CHANGES").val();

  }

  //prof.stop();
  return ret;
};


GanttMaster.prototype.markUnChangedTasksAndAssignments=function(newProject){
  //console.debug("markUnChangedTasksAndAssignments");
  //si controlla che ci sia qualcosa di cambiato, ovvero che ci sia l'undo stack
  if (this.__undoStack.length>0){
    var oldProject=JSON.parse(ge.__undoStack[0]);
    //si looppano i "nuovi" task
    for (var i=0;i<newProject.tasks.length;i++){
      var newTask=newProject.tasks[i];
      //se è un task che c'erà già
      if (typeof (newTask.id)=="string" && !newTask.id.startsWith("tmp_")){
        //si recupera il vecchio task
        var oldTask;
        for (var j=0;j<oldProject.tasks.length;j++){
          if (oldProject.tasks[j].id==newTask.id){
            oldTask=oldProject.tasks[j];
            break;
          }
        }

        //si controlla se ci sono stati cambiamenti
        var taskChanged=
          oldTask.id != newTask.id ||
          oldTask.code != newTask.code ||
          oldTask.name != newTask.name ||
          oldTask.start != newTask.start ||
          oldTask.startIsMilestone != newTask.startIsMilestone ||
          oldTask.end != newTask.end ||
          oldTask.endIsMilestone != newTask.endIsMilestone ||
          oldTask.duration != newTask.duration ||
          oldTask.status != newTask.status ||
          oldTask.typeId != newTask.typeId ||
          oldTask.relevance != newTask.relevance ||
          oldTask.progress != newTask.progress ||
          oldTask.progressByWorklog != newTask.progressByWorklog ||
          oldTask.description != newTask.description ||
          oldTask.level != newTask.level||
          oldTask.depends != newTask.depends;

        newTask.unchanged=!taskChanged;


        //se ci sono assegnazioni
        if (newTask.assigs&&newTask.assigs.length>0){

          //se abbiamo trovato il vecchio task e questo aveva delle assegnazioni
          if (oldTask && oldTask.assigs && oldTask.assigs.length>0){
            for (var j=0;j<oldTask.assigs.length;j++){
              var oldAssig=oldTask.assigs[j];
              //si cerca la nuova assegnazione corrispondente
              var newAssig;
              for (var k=0;k<newTask.assigs.length;k++){
                if(oldAssig.id==newTask.assigs[k].id){
                  newAssig=newTask.assigs[k];
                  break;
                }
              }

              //se c'è una nuova assig corrispondente
              if(newAssig){
                //si confrontano i valori per vedere se è cambiata
                newAssig.unchanged=
                  newAssig.resourceId==oldAssig.resourceId &&
                  newAssig.roleId==oldAssig.roleId &&
                  newAssig.effort==oldAssig.effort;
              }
            }
          }
        }
      }
    }
  }
};

GanttMaster.prototype.loadCollapsedTasks = function () {
  var collTasks=[];
  if (localStorage ) {
    if (localStorage.getObject("TWPGanttCollTasks"))
      collTasks = localStorage.getObject("TWPGanttCollTasks");
    return collTasks;
  }
};

GanttMaster.prototype.storeCollapsedTasks = function () {
  //console.debug("storeCollapsedTasks");
  if (localStorage) {
    var collTasks;
    if (!localStorage.getObject("TWPGanttCollTasks"))
      collTasks = [];
    else
      collTasks = localStorage.getObject("TWPGanttCollTasks");


    for (var i = 0; i < this.tasks.length; i++) {
      var task = this.tasks[i];

      var pos=collTasks.indexOf(task.id);
      if (task.collapsed){
        if (pos<0)
          collTasks.push(task.id);
      } else {
        if (pos>=0)
          collTasks.splice(pos,1);
      }
    }
    localStorage.setObject("TWPGanttCollTasks", collTasks);
  }
};



GanttMaster.prototype.updateLinks = function (task) {
  //console.debug("updateLinks",task);
  //var prof= new Profiler("gm_updateLinks");

  // defines isLoop function
  function isLoop(task, target, visited) {
    //var prof= new Profiler("gm_isLoop");
    //console.debug("isLoop :"+task.name+" - "+target.name);
    if (target == task) {
      return true;
    }

    var sups = task.getSuperiors();

    //my parent' superiors are my superiors too
    var p = task.getParent();
    while (p) {
      sups = sups.concat(p.getSuperiors());
      p = p.getParent();
    }

    //my children superiors are my superiors too
    var chs = task.getChildren();
    for (var i = 0; i < chs.length; i++) {
      sups = sups.concat(chs[i].getSuperiors());
    }

    var loop = false;
    //check superiors
    for (var i = 0; i < sups.length; i++) {
      var supLink = sups[i];
      if (supLink.from == target) {
        loop = true;
        break;
      } else {
        if (visited.indexOf(supLink.from.id + "x" + target.id) <= 0) {
          visited.push(supLink.from.id + "x" + target.id);
          if (isLoop(supLink.from, target, visited)) {
            loop = true;
            break;
          }
        }
      }
    }

    //check target parent
    var tpar = target.getParent();
    if (tpar) {
      if (visited.indexOf(task.id + "x" + tpar.id) <= 0) {
        visited.push(task.id + "x" + tpar.id);
        if (isLoop(task, tpar, visited)) {
          loop = true;
        }
      }
    }

    //prof.stop();
    return loop;
  }

  //remove my depends
  this.links = this.links.filter(function (link) {
    return link.to != task;
  });

  var todoOk = true;
  if (task.depends) {

    //cannot depend from an ancestor
    var parents = task.getParents();
    //cannot depend from descendants
    var descendants = task.getDescendant();

    var deps = task.depends.split(",");
    var newDepsString = "";

    var visited = [];
    var depsEqualCheck = [];
    for (var j = 0; j < deps.length; j++) {
      var depString = deps[j]; // in the form of row(lag) e.g. 2:3,3:4,5
      var supStr =depString;
      var lag = 0;
      var pos = depString.indexOf(":");
      if (pos>0){
        supStr=depString.substr(0,pos);
        var lagStr=depString.substr(pos+1);
        lag=Math.ceil((stringToDuration(lagStr)) / Date.workingPeriodResolution) * Date.workingPeriodResolution;
      }

      var sup = this.tasks[parseInt(supStr)-1];

      if (sup) {
        if (parents && parents.indexOf(sup) >= 0) {
          this.setErrorOnTransaction("\""+task.name + "\"\n" + GanttMaster.messages.CANNOT_DEPENDS_ON_ANCESTORS + "\n\"" + sup.name+"\"");
          todoOk = false;

        } else if (descendants && descendants.indexOf(sup) >= 0) {
          this.setErrorOnTransaction("\""+task.name + "\"\n" + GanttMaster.messages.CANNOT_DEPENDS_ON_DESCENDANTS + "\n\"" + sup.name+"\"");
          todoOk = false;

        } else if (isLoop(sup, task, visited)) {
          todoOk = false;
          this.setErrorOnTransaction(GanttMaster.messages.CIRCULAR_REFERENCE + "\n\"" + task.id +" - "+ task.name + "\" -> \"" + sup.id +" - "+sup.name+"\"");

        } else if(depsEqualCheck.indexOf(sup)>=0) {
          this.setErrorOnTransaction(GanttMaster.messages.CANNOT_CREATE_SAME_LINK + "\n\"" + sup.name+"\" -> \""+task.name+"\"");
          todoOk = false;

        } else {
          this.links.push(new Link(sup, task, lag));
          newDepsString = newDepsString + (newDepsString.length > 0 ? "," : "") + supStr+(lag==0?"":":"+durationToString(lag));
        }

        if (todoOk)
          depsEqualCheck.push(sup);
      }
    }
    task.depends = newDepsString;
  }
  //prof.stop();

  return todoOk;
};


GanttMaster.prototype.moveUpCurrentTask = function () {
  var self = this;
  //console.debug("moveUpCurrentTask",self.currentTask)
  if (self.currentTask) {
    if (!(self.permissions.canWrite  || self.currentTask.canWrite) || !self.permissions.canMoveUpDown )
    return;

    self.beginTransaction();
    self.currentTask.moveUp();
    self.endTransaction();
  }
};

GanttMaster.prototype.moveDownCurrentTask = function () {
  var self = this;
  //console.debug("moveDownCurrentTask",self.currentTask)
  if (self.currentTask) {
    if (!(self.permissions.canWrite  || self.currentTask.canWrite) || !self.permissions.canMoveUpDown )
    return;

    self.beginTransaction();
    self.currentTask.moveDown();
    self.endTransaction();
  }
};

GanttMaster.prototype.outdentCurrentTask = function () {
  var self = this;
  if (self.currentTask) {
    var par = self.currentTask.getParent();
    //can outdent if you have canRight on current task and on its parent and canAdd on grandfather
    if (!self.currentTask.canWrite || !par.canWrite || !par.getParent() || !par.getParent().canAdd)
    return;

    self.beginTransaction();
    self.currentTask.outdent();
    self.endTransaction();

    //[expand]
    if (par) self.editor.refreshExpandStatus(par);
  }
};

GanttMaster.prototype.indentCurrentTask = function () {
  var self = this;
  if (self.currentTask) {

    //can indent if you have canRight on current and canAdd on the row above
    var row = self.currentTask.getRow();
    if (!self.currentTask.canWrite || row <= 0 || !self.tasks[row - 1].canAdd)
    return;

    self.beginTransaction();
    self.currentTask.indent();
    self.endTransaction();
  }
};

GanttMaster.prototype.addBelowCurrentTask = function () {
  var self = this;
  //console.debug("addBelowCurrentTask",self.currentTask)
  var factory = new TaskFactory();
  var ch;
  var row = 0;
  if (self.currentTask && self.currentTask.name) {
    //add below add a brother if current task is not already a parent
    var addNewBrother = !(self.currentTask.isParent() || self.currentTask.level==0);

    var canAddChild=self.currentTask.canAdd;
    var canAddBrother=self.currentTask.getParent() && self.currentTask.getParent().canAdd;

    //if you cannot add a brother you will try to add a child
    addNewBrother=addNewBrother&&canAddBrother;

    if (!canAddBrother && !canAddChild)
        return;


    ch = factory.build("tmp_" + new Date().getTime(), "", "", self.currentTask.level+ (addNewBrother ?0:1), self.currentTask.start, 1);
    row = self.currentTask.getRow() + 1;

    if (row>0) {
      self.beginTransaction();
      var task = self.addTask(ch, row);
      if (task) {
        task.rowElement.click();
        task.rowElement.find("[name=name]").focus();
      }
      self.endTransaction();
    }
  }
};

GanttMaster.prototype.addAboveCurrentTask = function () {
  var self = this;
  // console.debug("addAboveCurrentTask",self.currentTask)

  //check permissions
  if ((self.currentTask.getParent() && !self.currentTask.getParent().canAdd) )
    return;

  var factory = new TaskFactory();

  var ch;
  var row = 0;
  if (self.currentTask  && self.currentTask.name) {
    //cannot add brothers to root
    if (self.currentTask.level <= 0)
      return;

    ch = factory.build("tmp_" + new Date().getTime(), "", "", self.currentTask.level, self.currentTask.start, 1);
    row = self.currentTask.getRow();

    if (row > 0) {
      self.beginTransaction();
      var task = self.addTask(ch, row);
      if (task) {
        task.rowElement.click();
        task.rowElement.find("[name=name]").focus();
      }
      self.endTransaction();
    }
  }
};

GanttMaster.prototype.deleteCurrentTask = function (taskId) {
  //console.debug("deleteCurrentTask",this.currentTask , this.isMultiRoot)
  var self = this;

  var task;
  if (taskId)
    task=self.getTask(taskId);
  else
    task=self.currentTask;

  if (!task || !self.permissions.canDelete && !task.canDelete)
    return;

  var taskIsEmpty=task.name=="";

  var row = task.getRow();
  if (task && (row > 0 || self.isMultiRoot || task.isNew()) ) {
    var par = task.getParent();
    self.beginTransaction();
    task.deleteTask();
    task = undefined;

    //recompute depends string
    self.updateDependsStrings();

    //redraw
    self.taskIsChanged();

    //[expand]
    if (par)
      self.editor.refreshExpandStatus(par);


    //focus next row
    row = row > self.tasks.length - 1 ? self.tasks.length - 1 : row;
    if (!taskIsEmpty && row >= 0) {
      task = self.tasks[row];
      task.rowElement.click();
      task.rowElement.find("[name=name]").focus();
    }
    self.endTransaction();
  }
};




GanttMaster.prototype.collapseAll = function () {
  //console.debug("collapseAll");
  if (this.currentTask){
    this.currentTask.collapsed=true;
    var desc = this.currentTask.getDescendant();
    for (var i=0; i<desc.length; i++) {
      if (desc[i].isParent()) // set collapsed only if is a parent
        desc[i].collapsed = true;
      desc[i].rowElement.hide();
    }

    this.redraw();

    //store collapse statuses
    this.storeCollapsedTasks();
  }
};

GanttMaster.prototype.fullScreen = function () {
  //console.debug("fullScreen");
  this.workSpace.toggleClass("ganttFullScreen").resize();
  $("#fullscrbtn .teamworkIcon").html(this.workSpace.is(".ganttFullScreen")?"€":"@");
};


GanttMaster.prototype.expandAll = function () {
  //console.debug("expandAll");
  if (this.currentTask){
    this.currentTask.collapsed=false;
    var desc = this.currentTask.getDescendant();
    for (var i=0; i<desc.length; i++) {
      desc[i].collapsed = false;
      desc[i].rowElement.show();
    }

    this.redraw();

    //store collapse statuses
    this.storeCollapsedTasks();

  }
};



GanttMaster.prototype.collapse = function (task, all) {
  //console.debug("collapse",task)
  task.collapsed=true;
  task.rowElement.addClass("collapsed");

  var descs = task.getDescendant();
  for (var i = 0; i < descs.length; i++)
    descs[i].rowElement.hide();

  this.redraw();

  //store collapse statuses
  this.storeCollapsedTasks();
};


GanttMaster.prototype.expand = function (task,all) {
  //console.debug("expand",task)
  task.collapsed=false;
  task.rowElement.removeClass("collapsed");

  var collapsedDescendant = this.getCollapsedDescendant();
  var descs = task.getDescendant();
  for (var i = 0; i < descs.length; i++) {
    var childTask = descs[i];
    if (collapsedDescendant.indexOf(childTask) >= 0) continue;
    childTask.rowElement.show();
  }

  this.redraw();

  //store collapse statuses
  this.storeCollapsedTasks();

};


GanttMaster.prototype.getCollapsedDescendant = function () {
  var allTasks = this.tasks;
  var collapsedDescendant = [];
  for (var i = 0; i < allTasks.length; i++) {
    var task = allTasks[i];
    if (collapsedDescendant.indexOf(task) >= 0) continue;
    if (task.collapsed) collapsedDescendant = collapsedDescendant.concat(task.getDescendant());
  }
  return collapsedDescendant;
}




GanttMaster.prototype.addIssue = function () {
  var self = this;

  if (self.currentTask && self.currentTask.isNew()){
    alert(GanttMaster.messages.PLEASE_SAVE_PROJECT);
    return;
  }
  if (!self.currentTask || !self.currentTask.canAddIssue)
    return;

  openIssueEditorInBlack('0',"AD","ISSUE_TASK="+self.currentTask.id);
};

GanttMaster.prototype.openExternalEditor = function () {
  //console.debug("openExternalEditor ")
  var self = this;
  if (!self.currentTask)
    return;

  if (self.currentTask.isNew()){
    alert(GanttMaster.messages.PLEASE_SAVE_PROJECT);
    return;
  }

  //window.location.href=contextPath+"/applications/teamwork/task/taskEditor.jsp?CM=ED&OBJID="+self.currentTask.id;
};

//<%----------------------------- TRANSACTION MANAGEMENT ---------------------------------%>
GanttMaster.prototype.beginTransaction = function () {
  if (!this.__currentTransaction) {
    this.__currentTransaction = {
      snapshot: JSON.stringify(this.saveGantt(true)),
      errors:   []
    };
  } else {
    console.error("Cannot open twice a transaction");
  }
  return this.__currentTransaction;
};


//this function notify an error to a transaction -> transaction will rollback
GanttMaster.prototype.setErrorOnTransaction = function (errorMessage, task) {
  if (this.__currentTransaction) {
    this.__currentTransaction.errors.push({msg: errorMessage, task: task});
  } else {
    console.error(errorMessage);
  }
};

GanttMaster.prototype.isTransactionInError = function () {
  if (!this.__currentTransaction) {
    console.error("Transaction never started.");
    return true;
  } else {
    return this.__currentTransaction.errors.length > 0
  }

};

GanttMaster.prototype.endTransaction = function () {
  if (!this.__currentTransaction) {
    console.error("Transaction never started.");
    return true;
  }

  var ret = true;

  //no error -> commit
  if (this.__currentTransaction.errors.length <= 0) {
    //console.debug("committing transaction");

    //put snapshot in undo
    this.__undoStack.push(this.__currentTransaction.snapshot);
    //clear redo stack
    this.__redoStack = [];

    //shrink gantt bundaries
    this.gantt.shrinkBoundaries();
    this.taskIsChanged(); //enqueue for gantt refresh


    //error -> rollback
  } else {
    ret = false;
    //console.debug("rolling-back transaction");

    //compose error message
    var msg = "ERROR:\n";
    for (var i = 0; i < this.__currentTransaction.errors.length; i++) {
      var err = this.__currentTransaction.errors[i];
      msg = msg + err.msg + "\n\n";
    }
    alert(msg);


    //try to restore changed tasks
    var oldTasks = JSON.parse(this.__currentTransaction.snapshot);
    this.deletedTaskIds = oldTasks.deletedTaskIds;
    this.__inUndoRedo = true; // avoid Undo/Redo stacks reset
    this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
    this.redraw();

  }
  //reset transaction
  this.__currentTransaction = undefined;

  //show/hide save button
  this.saveRequired();

  //[expand]
  this.editor.refreshExpandStatus(this.currentTask);

  return ret;
};

// inhibit undo-redo
GanttMaster.prototype.checkpoint = function () {
  //console.debug("GanttMaster.prototype.checkpoint");
  this.__undoStack = [];
  this.__redoStack = [];
  this.saveRequired();
};

//----------------------------- UNDO/REDO MANAGEMENT ---------------------------------%>

GanttMaster.prototype.undo = function () {
  //console.debug("undo before:",this.__undoStack,this.__redoStack);
  if (this.__undoStack.length > 0) {
    var his = this.__undoStack.pop();
    this.__redoStack.push(JSON.stringify(this.saveGantt()));
    var oldTasks = JSON.parse(his);
    this.deletedTaskIds = oldTasks.deletedTaskIds;
    this.__inUndoRedo = true; // avoid Undo/Redo stacks reset
    this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
    this.redraw();
    //show/hide save button
    this.saveRequired();
  }
};

GanttMaster.prototype.redo = function () {
  //console.debug("redo before:",undoStack,redoStack);
  if (this.__redoStack.length > 0) {
    var his = this.__redoStack.pop();
    this.__undoStack.push(JSON.stringify(this.saveGantt()));
    var oldTasks = JSON.parse(his);
    this.deletedTaskIds = oldTasks.deletedTaskIds;
    this.__inUndoRedo = true; // avoid Undo/Redo stacks reset
    this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
    this.redraw();
    //console.debug("redo after:",undoStack,redoStack);

    this.saveRequired();
  }
};


GanttMaster.prototype.saveRequired = function () {
  //console.debug("saveRequired")
  //show/hide save button
  if(this.__undoStack.length>0 ) {
    $("#saveGanttButton").removeClass("disabled");
    $("form[alertOnChange] #Gantt").val(new Date().getTime()); // set a fake variable as dirty
    this.element.trigger("saveRequired.gantt",[true]);


  } else {
    $("#saveGanttButton").addClass("disabled");
    $("form[alertOnChange] #Gantt").updateOldValue(); // set a fake variable as clean
    this.element.trigger("saveRequired.gantt",[false]);

  }
};


GanttMaster.prototype.print = function () {
  this.gantt.redrawTasks(true);
  print();
};


GanttMaster.prototype.resize = function () {
  var self=this;
  //console.debug("GanttMaster.resize")
  this.element.stopTime("resizeRedraw").oneTime(50,"resizeRedraw",function(){
    self.splitter.resize();
    self.numOfVisibleRows=Math.ceil(self.element.height()/self.rowHeight);
    self.firstScreenLine=Math.floor(self.splitter.firstBox.scrollTop()/self.rowHeight) ;
    self.gantt.redrawTasks();
  });
};




GanttMaster.prototype.scrolled = function (oldFirstRow) {
  var self=this;
  var newFirstRow=self.firstScreenLine;

  //if scroll something
  if (newFirstRow!=oldFirstRow){
    //console.debug("Ganttalendar.scrolled oldFirstRow:"+oldFirstRow+" new firstScreenLine:"+newFirstRow);

    var collapsedDescendant = self.getCollapsedDescendant();

    var scrollDown=newFirstRow>oldFirstRow;
    var startRowDel;
    var endRowDel;
    var startRowAdd;
    var endRowAdd;

    if(scrollDown){
      startRowDel=oldFirstRow-self.rowBufferSize;
      endRowDel=newFirstRow-self.rowBufferSize;
      startRowAdd=Math.max(oldFirstRow+self.numOfVisibleRows+self.rowBufferSize,endRowDel);
      endRowAdd =newFirstRow+self.numOfVisibleRows+self.rowBufferSize;
    } else {
      startRowDel=newFirstRow+self.numOfVisibleRows+self.rowBufferSize;
      endRowDel=oldFirstRow+self.numOfVisibleRows+self.rowBufferSize;
      startRowAdd=newFirstRow-self.rowBufferSize;
      endRowAdd =Math.min(oldFirstRow-self.rowBufferSize,startRowDel);
    }

    var firstVisibleRow=newFirstRow-self.rowBufferSize; //ignoring collapsed tasks
    var lastVisibleRow =newFirstRow+self.numOfVisibleRows+self.rowBufferSize;


    //console.debug("remove startRowDel:"+startRowDel+" endRowDel:"+endRowDel )
    //console.debug("add startRowAdd:"+startRowAdd+" endRowAdd:"+endRowAdd)

    var row=0;
    self.firstVisibleTaskIndex=-1;
    for (var i=0;i<self.tasks.length;i++){
      var task=self.tasks[i];
      if (collapsedDescendant.indexOf(task) >=0){
        continue;
      }

      //remove rows on top
      if (row>=startRowDel && row<endRowDel) {
        if (task.ganttElement)
          task.ganttElement.remove();
        if (task.ganttBaselineElement)
          task.ganttBaselineElement.remove();

        //add missing ones
      } else if (row>=startRowAdd && row<endRowAdd) {
        self.gantt.drawTask(task);
      }

      if (row>=firstVisibleRow && row<lastVisibleRow) {
        self.firstVisibleTaskIndex=self.firstVisibleTaskIndex==-1?i:self.firstVisibleTaskIndex;
        self.lastVisibleTaskIndex = i;
      }

      row++
    }
  }
};









/**
 * Compute the critical path using Backflow algorithm.
 * Translated from Java code supplied by M. Jessup here http://stackoverflow.com/questions/2985317/critical-path-method-algorithm
 *
 * For each task computes:
 * earlyStart, earlyFinish, latestStart, latestFinish, criticalCost
 *
 * A task on the critical path has isCritical=true
 * A task not in critical path can float by latestStart-earlyStart days
 *
 * If you use critical path avoid usage of dependencies between different levels of tasks
 *
 * WARNNG: It ignore milestones!!!!
 * @return {*}
 */
GanttMaster.prototype.computeCriticalPath = function () {

  if (!this.tasks)
    return false;

  // do not consider grouping tasks
  var tasks = this.tasks.filter(function (t) {
    //return !t.isParent()
    return (t.getRow() > 0) && (!t.isParent() || (t.isParent() && !t.isDependent()));
  });

  // reset values
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    t.earlyStart = -1;
    t.earlyFinish = -1;
    t.latestStart = -1;
    t.latestFinish = -1;
    t.criticalCost = -1;
    t.isCritical = false;
  }

  // tasks whose critical cost has been calculated
  var completed = [];
  // tasks whose critical cost needs to be calculated
  var remaining = tasks.concat(); // put all tasks in remaining


  // Backflow algorithm
  // while there are tasks whose critical cost isn't calculated.
  while (remaining.length > 0) {
    var progress = false;

    // find a new task to calculate
    for (var i = 0; i < remaining.length; i++) {
      var task = remaining[i];
      var inferiorTasks = task.getInferiorTasks();

      if (containsAll(completed, inferiorTasks)) {
        // all dependencies calculated, critical cost is max dependency critical cost, plus our cost
        var critical = 0;
        for (var j = 0; j < inferiorTasks.length; j++) {
          var t = inferiorTasks[j];
          if (t.criticalCost > critical) {
            critical = t.criticalCost;
          }
        }
        task.criticalCost = critical + task.duration;
        // set task as calculated an remove
        completed.push(task);
        remaining.splice(i, 1);

        // note we are making progress
        progress = true;
      }
    }
    // If we haven't made any progress then a cycle must exist in
    // the graph and we wont be able to calculate the critical path
    if (!progress) {
      console.error("Cyclic dependency, algorithm stopped!");
      return false;
    }
  }

  // set earlyStart, earlyFinish, latestStart, latestFinish
  computeMaxCost(tasks);
  var initialNodes = initials(tasks);
  calculateEarly(initialNodes);
  calculateCritical(tasks);

  return tasks;


  function containsAll(set, targets) {
    for (var i = 0; i < targets.length; i++) {
      if (set.indexOf(targets[i]) < 0)
        return false;
    }
    return true;
  }

  function computeMaxCost(tasks) {
    var max = -1;
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];

      if (t.criticalCost > max)
        max = t.criticalCost;
    }
    //console.debug("Critical path length (cost): " + max);
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      t.setLatest(max);
    }
  }

  function initials(tasks) {
    var initials = [];
    for (var i = 0; i < tasks.length; i++) {
      if (!tasks[i].depends || tasks[i].depends == "")
        initials.push(tasks[i]);
    }
    return initials;
  }

  function calculateEarly(initials) {
    for (var i = 0; i < initials.length; i++) {
      var initial = initials[i];
      initial.earlyStart = 0;
      initial.earlyFinish = initial.duration;
      setEarly(initial);
    }
  }

  function setEarly(initial) {
    var completionTime = initial.earlyFinish;
    var inferiorTasks = initial.getInferiorTasks();
    for (var i = 0; i < inferiorTasks.length; i++) {
      var t = inferiorTasks[i];
      if (completionTime >= t.earlyStart) {
        t.earlyStart = completionTime;
        t.earlyFinish = completionTime + t.duration;
      }
      setEarly(t);
    }
  }

  function calculateCritical(tasks) {
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      t.isCritical = (t.earlyStart == t.latestStart)
    }
  }

};

//------------------------------------------- MANAGE CHANGE LOG INPUT ---------------------------------------------------
/*GanttMaster.prototype.manageSaveRequired=function(ev, showSave) {
  //console.debug("manageSaveRequired", showSave);

  function checkChanges() {
    var changes = false;
    //there is somethin in the redo stack?
    if (indexInfo.ge.__undoStack.length > 0) {
      var oldProject = JSON.parse(indexInfo.ge.__undoStack[0]);
      //si looppano i "nuovi" task
      for (var i = 0; !changes && i < ge.tasks.length; i++) {
        var newTask = this.tasks[i];
        //se è un task che c'erà già
        if (!(""+newTask.id).startsWith("tmp_")) {
          //si recupera il vecchio task
          var oldTask;
          for (var j = 0; j < oldProject.tasks.length; j++) {
            if (oldProject.tasks[j].id == newTask.id) {
              oldTask = oldProject.tasks[j];
              break;
            }
          }
          // chack only status or dateChanges
          if (oldTask && (oldTask.status != newTask.status || oldTask.start != newTask.start || oldTask.end != newTask.end)) {
            changes = true;
            break;
          }
        }
      }
    }
    $("#LOG_CHANGES_CONTAINER").css("display", changes ? "inline-block" : "none");
  }


  if (showSave) {
    $("body").stopTime("gantt.manageSaveRequired").oneTime(200, "gantt.manageSaveRequired", checkChanges);
  } else {
    $("#LOG_CHANGES_CONTAINER").hide();
  }

}*/


/**
 * workStartHour,endStartHour : millis from 00:00
 * dateFormat dd/MM/yyyy HH:mm
 * working period resolution in millis or days
 */
GanttMaster.prototype.setHoursOn = function(startWorkingHour,endWorkingHour,dateFormat,resolution){
  //console.debug("resolution",resolution)
  Date.defaultFormat= dateFormat;
  Date.startWorkingHour=startWorkingHour;
  Date.endWorkingHour=endWorkingHour;
  Date.useMillis=resolution>=1000;
  Date.workingPeriodResolution=resolution;
  millisInWorkingDay=endWorkingHour-startWorkingHour;
};

/*
 Copyright (c) 2012-2018 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

Ganttalendar.prototype.initZoomlevels = function () {
  //console.debug("Ganttalendar.prototype.initZoomlevels");

  var self = this;

  // define the zoom level arrays
  this.zoomLevels = [];
  this.zoomDrawers = {};


  function _addZoom(zoom,zoomDrawer){
    self.zoomLevels.push(zoom);
    self.zoomDrawers[zoom] = zoomDrawer;

    //compute the scale
    self.zoomDrawers[zoom].computedScaleX=600/millisFromString(zoom);
  }


  //-----------------------------  3 DAYS  600px-----------------------------
  _addZoom("3d", {
    adjustDates: function (start, end) {
      start.setFirstDayOfThisWeek();
      end.setFirstDayOfThisWeek();
      end.setDate(end.getDate() + 6);
    },
    row1:        function (date, ctxHead) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 6);
      self.createHeadCell(1,this,ctxHead,start.format("MMMM d") + " - " + date.format("MMMM d yyyy")+ " ("+start.format("w")+")",7,"", start,date);
      date.setDate(date.getDate() + 1);
    },
    row2:        function (date, ctxHead, ctxBody) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 1);
      var holyClass = isHoliday(start) ? "holy" : "";
      self.createHeadCell(2,this,ctxHead,start.format("EEE d"), 1, "headSmall "+holyClass, start,date);
      self.createBodyCell(this,ctxBody,1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);
    }
  });



  //-----------------------------  1 WEEK  600px -----------------------------
  _addZoom("1w", {
    adjustDates: function (start, end) {
      //reset day of week
      start.setFirstDayOfThisWeek();
      start.setDate(start.getDate() - 7);
      end.setFirstDayOfThisWeek();
      end.setDate(end.getDate() + 13);
    },
    row1:        function (date, ctxHead) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 6);
      self.createHeadCell(1,this,ctxHead,start.format("MMM d") + " - " + date.format("MMM d 'yy")+" (" + GanttMaster.messages["GANTT_WEEK_SHORT"]+date.format("w")+")", 7,"",start,date);
      date.setDate(date.getDate() + 1);
    },
    row2:        function (date, ctxHead, ctxBody) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 1);
      var holyClass = isHoliday(start) ? "holy" : "";
      self.createHeadCell(2,this,ctxHead,start.format("EEEE").substr(0, 1)+" ("+start.format("dd")+")", 1, "headSmall "+holyClass, start,date);
      self.createBodyCell(this,ctxBody,1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);
    }
  });


  //-----------------------------  2 WEEKS  600px -----------------------------
  _addZoom( "2w",{
    adjustDates: function (start, end) {
      start.setFirstDayOfThisWeek();
      start.setDate(start.getDate() - 7);
      end.setFirstDayOfThisWeek();
      end.setDate(end.getDate() + 20);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 6);
      self.createHeadCell(1,this,tr1,start.format("MMM d") + " - " + date.format("MMM d 'yy")+" (" + GanttMaster.messages["GANTT_WEEK_SHORT"]+date.format("w")+")", 7,"",start,date);
      date.setDate(date.getDate() + 1);
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 1);
      var holyClass = isHoliday(start) ? "holy" : "";
      self.createHeadCell(2,this,tr2,start.format("EEEE").substr(0, 1), 1, "headSmall "+holyClass, start,date);
      self.createBodyCell(this,trBody,1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);
    }
  });


  //-----------------------------  1 MONTH  600px  -----------------------------
  _addZoom( "1M",{
    adjustDates: function (start, end) {
      start.setMonth(start.getMonth()-1);
      start.setDate(15);
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(end.getDate() + 14);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      date.setDate(date.getDate() - 1);
      var inc=date.getDate()-start.getDate()+1;
      date.setDate(date.getDate() + 1);
      self.createHeadCell(1,this,tr1,start.format("MMMM yyyy"), inc,"",start,date); //spans mumber of dayn in the month
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setDate(date.getDate() + 1);
      var holyClass = isHoliday(start) ? "holy" : "";
      self.createHeadCell(2,this,tr2,start.format("d"), 1, "headSmall "+holyClass, start,date);
      var nd = new Date(start.getTime());
      nd.setDate(start.getDate() + 1);
      self.createBodyCell(this,trBody,1, nd.getDate() == 1, holyClass);
    }
  });



  //-----------------------------  1 QUARTERS   -----------------------------
  _addZoom( "1Q", {
    adjustDates: function (start, end) {
      start.setDate(1);
      start.setMonth(Math.floor(start.getMonth() / 3) * 3 -1 );
      end.setDate(1);
      end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 4);
      end.setDate(end.getDate() - 1);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      date.setMonth(Math.floor(date.getMonth() / 3) * 3 + 3);
      var inc=(date.getMonth()-start.getMonth());
      var q = (Math.floor(start.getMonth() / 3) + 1);
      self.createHeadCell(1,this,tr1,GanttMaster.messages["GANTT_QUARTER"]+" "+q+" "+start.format("yyyy"), inc,"",start,date);
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 1);
      self.createHeadCell(2,this,tr2,start.format("MMMM"), 1, "headSmall", start,date);
      self.createBodyCell(this,trBody,1, start.getMonth() % 3 == 2);
    }
  });


  //-----------------------------  2 QUARTERS   -----------------------------
  _addZoom( "2Q", {
    adjustDates: function (start, end) {
      start.setDate(1);
      start.setMonth(Math.floor(start.getMonth() / 3) * 3 -3);
      end.setDate(1);
      end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 6);
      end.setDate(end.getDate() - 1);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 3);
      var q = (Math.floor(start.getMonth() / 3) + 1);
      self.createHeadCell(1,this,tr1,GanttMaster.messages["GANTT_QUARTER"]+" "+q+" "+start.format("yyyy"), 3,"",start,date);
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 1);
      var lbl = start.format("MMMM");
      self.createHeadCell(2,this,tr2,lbl, 1, "headSmall", start,date);
      self.createBodyCell(this,trBody,1, start.getMonth() % 3 == 2);
    }
  });


  //-----------------------------  1 YEAR  -----------------------------
  _addZoom( "1y", {
    adjustDates: function (start, end) {
      start.setDate(1);
      start.setMonth(Math.floor(start.getMonth() / 6) * 6 -6);
      end.setDate(1);
      end.setMonth(Math.floor(end.getMonth() / 6) * 6 + 12);
      end.setDate(end.getDate() - 1);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 6);
      var sem = (Math.floor(start.getMonth() / 6) + 1);
      self.createHeadCell(1,this,tr1,GanttMaster.messages["GANTT_SEMESTER"]+" "+sem+"-"+start.format("yyyy") , 6,"",start,date);
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 1);
      self.createHeadCell(2,this,tr2,start.format("MMM"), 1, "headSmall", start,date);
      self.createBodyCell(this,trBody,1, (start.getMonth() + 1) % 6 == 0);
    }
  });


  //-----------------------------  2 YEAR -----------------------------
  _addZoom( "2y", {
    adjustDates: function (start, end) {
      start.setDate(1);
      start.setMonth(-6);
      end.setDate(30);
      end.setMonth(17);
    },
    row1:        function (date, tr1) {
      var start = new Date(date.getTime());
      var inc=12-start.getMonth();
      date.setMonth(date.getMonth() + inc);
      self.createHeadCell(1,this,tr1,start.format("yyyy"), inc/6,"",start,date);
    },
    row2:        function (date, tr2, trBody) {
      var start = new Date(date.getTime());
      date.setMonth(date.getMonth() + 6);
      var sem = (Math.floor(start.getMonth() / 6) + 1);
      self.createHeadCell(2,this,tr2,GanttMaster.messages["GANTT_SEMESTER"] +" "+ sem, 1, "headSmall", start,date);
      self.createBodyCell(this,trBody,1, sem == 2);
    }
  });



};



/*
Copyright (c) 2012-2018 Open Lab
Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


todo For compatibility with IE and SVGElements.getElementsByClassName not implemented changed every find starting from SVGElement (the other works fine)
.find(".classname"))  -> .find("[class*=classname])
*/
function Ganttalendar(startMillis, endMillis, master, minGanttSize) {
  this.master = master; // is the a GantEditor instance
  this.element; // is the jquery element containing gantt

  this.svg; // instance of svg object containing gantt
  this.tasksGroup; //instance of svg group containing tasks
  this.linksGroup; //instance of svg group containing links

  this.minGanttSize = minGanttSize;
  this.includeToday = false; //when true today is always visible. If false boundaries comes from tasks periods
  this.showCriticalPath = false; //when true critical path is highlighted

  this.initZoomlevels(); // initialite the zoom level definitions

  this.originalStartMillis=startMillis;
  this.originalEndMillis=endMillis;
  this.gridChanged=true; //witness for boundaries changed. Force to redraw gantt grid
  this.element = this.createGanttGrid(); // fake

  this.linkOnProgress = false; //set to true when creating a new link

  this.taskHeight=20;
  this.resizeZoneWidth=5;
  this.taskVertOffset = (this.master.rowHeight - this.taskHeight) / 2;
}


Ganttalendar.prototype.zoomGantt = function (isPlus) {
  var curLevel = this.zoom;
  var pos = this.zoomLevels.indexOf(curLevel + "");

  var centerMillis=this.getCenterMillis();
  var newPos = pos;
  if (isPlus) {
    newPos = pos <= 0 ? 0 : pos - 1;
  } else {
    newPos = pos >= this.zoomLevels.length - 1 ? this.zoomLevels.length - 1 : pos + 1;
  }
  if (newPos != pos) {
    curLevel = this.zoomLevels[newPos];
    this.gridChanged=true;
    this.zoom = curLevel;

    this.storeZoomLevel();
    this.redraw();
    this.goToMillis(centerMillis);
  }
};



Ganttalendar.prototype.getStoredZoomLevel = function () {
  if (localStorage  && localStorage.getObject("TWPGanttSavedZooms")) {
    var savedZooms = localStorage.getObject("TWPGanttSavedZooms");
    return savedZooms[this.master.tasks[0].id];
  }
  return false;
};

Ganttalendar.prototype.storeZoomLevel = function () {
  //console.debug("storeZoomLevel: "+this.zoom);
  if (localStorage) {
    var savedZooms;
    if (!localStorage.getObject("TWPGanttSavedZooms"))
      savedZooms = {};
    else
      savedZooms = localStorage.getObject("TWPGanttSavedZooms");

    savedZooms[this.master.tasks[0].id]=this.zoom;

    localStorage.setObject("TWPGanttSavedZooms", savedZooms);
  }
};

Ganttalendar.prototype.createHeadCell=function(level,zoomDrawer,rowCtx,lbl, span, additionalClass,start, end) {
  var x = (start.getTime() - self.startMillis)* zoomDrawer.computedScaleX;
  var th = $("<th>").html(lbl).attr("colSpan", span);
  if (level>1) { //set width on second level only
    var w = (end.getTime() - start.getTime()) * zoomDrawer.computedScaleX;
    th.width(w);
  }
  if (additionalClass)
    th.addClass(additionalClass);
  rowCtx.append(th);
};

Ganttalendar.prototype.createBodyCell=function(zoomDrawer,tr,span, isEnd, additionalClass) {
  var ret = $("<td>").html("").attr("colSpan", span).addClass("ganttBodyCell");
  if (isEnd)
    ret.addClass("end");
  if (additionalClass)
    ret.addClass(additionalClass);
  tr.append(ret);
};


Ganttalendar.prototype.createGanttGrid = function () {
  //console.debug("Gantt.createGanttGrid zoom: "+this.zoom +"  " + new Date(this.originalStartMillis).format() + " - " + new Date(this.originalEndMillis).format());
  //var prof = new Profiler("ganttDrawer.createGanttGrid");
  var self = this;

  // get the zoomDrawer
  // if the desired level is not there uses the largest one (last one)
  var zoomDrawer=self.zoomDrawers[self.zoom] || self.zoomDrawers[self.zoomLevels[self.zoomLevels.length-1]];

  //get best dimension for gantt
  var adjustedStartDate= new Date(this.originalStartMillis);
  var adjustedEndDate=new Date(this.originalEndMillis);
  zoomDrawer.adjustDates(adjustedStartDate,adjustedEndDate);

  self.startMillis = adjustedStartDate.getTime(); //real dimension of gantt
  self.endMillis = adjustedEndDate.getTime();

  //this is computed by hand in order to optimize cell size
  var computedTableWidth= (self.endMillis - self.startMillis) * zoomDrawer.computedScaleX;

  //set a minimal width
  computedTableWidth = Math.max(computedTableWidth, self.minGanttSize);

  var table = $("<table cellspacing=0 cellpadding=0>");

  //loop for header1
  var start = new Date(self.startMillis);
  var tr1 = $("<tr>").addClass("ganttHead1");
  while (start.getTime() <= self.endMillis) {
    zoomDrawer.row1(start,tr1);
  }

  //loop for header2  e tbody
  start = new Date(self.startMillis);
  var tr2 = $("<tr>").addClass("ganttHead2");
  var trBody = $("<tr>").addClass("ganttBody");
  while (start.getTime() <= self.endMillis) {
    zoomDrawer.row2(start,tr2,trBody);
  }

  table.append(tr1).append(tr2);   // removed as on FF there are rounding issues  //.css({width:computedTableWidth});

  var head = table.clone().addClass("ganttFixHead");

  table.append(trBody).addClass("ganttTable");


  var height = self.master.editor.element.height();
  table.height(height);

  var box = $("<div>");
  box.addClass("gantt unselectable").attr("unselectable", "true").css({position:"relative", width:computedTableWidth});
  box.append(table);
  box.append(head);

  //create the svg
  box.svg({settings:{class:"ganttSVGBox"},
    onLoad:         function (svg) {
      //console.debug("svg loaded", svg);

      //creates gradient and definitions
      var defs = svg.defs('myDefs');

      //create backgound
      var extDep = svg.pattern(defs, "extDep", 0, 0, 10, 10, 0, 0, 10, 10, {patternUnits:'userSpaceOnUse'});
      var img=svg.image(extDep, 0, 0, 10, 10, self.master.resourceUrl +"hasExternalDeps.png",{opacity:.3});

      self.svg = svg;
      $(svg).addClass("ganttSVGBox");

      //creates grid group
      var gridGroup = svg.group("gridGroup");

      //creates links group
      self.linksGroup = svg.group("linksGroup");

      //creates tasks group
      self.tasksGroup = svg.group("tasksGroup");

      //compute scalefactor fx
      //self.fx = computedTableWidth / (endPeriod - startPeriod);
      self.fx = zoomDrawer.computedScaleX;

    }
  });

  return box;
};


//<%-------------------------------------- GANT TASK GRAPHIC ELEMENT --------------------------------------%>
Ganttalendar.prototype.drawTask = function (task) {
  //console.debug("drawTask", task.name,this.master.showBaselines,this.taskHeight);
  var self = this;
  //var prof = new Profiler("ganttDrawTask");

  if (self.master.showBaselines) {
    var baseline = self.master.baselines[task.id];
    if (baseline) {
      //console.debug("baseLine",baseline)
      var baseTask = $(_createBaselineSVG(task, baseline));
      baseTask.css("opacity", .5);
      task.ganttBaselineElement = baseTask;
    }
  }

  var taskBox = $(_createTaskSVG(task));
  task.ganttElement = taskBox;


  if (self.showCriticalPath && task.isCritical)
    taskBox.addClass("critical");

  if (this.master.permissions.canWrite || task.canWrite) {

    //bind all events on taskBox
    taskBox
      .click(function (e) { // manages selection
        e.stopPropagation();// to avoid body remove focused
        self.element.find("[class*=focused]").removeClass("focused");
        $(".ganttSVGBox .focused").removeClass("focused");
        var el = $(this);
        if (!self.resDrop)
          el.addClass("focused");
        self.resDrop = false; //hack to avoid select

        $("body").off("click.focused").one("click.focused", function () {
          $(".ganttSVGBox .focused").removeClass("focused");
        })

      }).dblclick(function () {
      if (self.master.permissions.canSeePopEdit)
        self.master.editor.openFullEditor(task,false);
    }).mouseenter(function () {
      //bring to top
      var el = $(this);
      if (!self.linkOnProgress) {
        $("[class*=linkHandleSVG]").hide();
        el.find("[class*=linkHandleSVG]").stopTime("hideLink").show();
      } else {
        el.addClass("linkOver");
      }
    }).mouseleave(function () {
      var el = $(this);
      el.removeClass("linkOver").find("[class*=linkHandleSVG]").oneTime(500,"hideLink",function(){$(this).hide()});

    }).mouseup(function (e) {
      $(":focus").blur(); // in order to save grid field when moving task
    }).mousedown(function () {
      var task = self.master.getTask($(this).attr("taskid"));
      task.rowElement.click();
    }).dragExtedSVG($(self.svg.root()), {
      canResize:  this.master.permissions.canWrite || task.canWrite,
      canDrag:    !task.depends && (this.master.permissions.canWrite || task.canWrite),
      resizeZoneWidth:self.resizeZoneWidth,
      startDrag:  function (e) {
        $(".ganttSVGBox .focused").removeClass("focused");
      },
      drag:       function (e) {
        $("[from=" + task.id + "],[to=" + task.id + "]").trigger("update");
      },
      drop:       function (e) {
        self.resDrop = true; //hack to avoid select
        var taskbox = $(this);
        var task = self.master.getTask(taskbox.attr("taskid"));
        var s = Math.round((parseFloat(taskbox.attr("x")) / self.fx) + self.startMillis);
        self.master.beginTransaction();
        self.master.moveTask(task, new Date(s));
        self.master.endTransaction();
      },
      startResize:function (e) {
        $(".ganttSVGBox .focused").removeClass("focused");
        var taskbox = $(this);
        var text = $(self.svg.text(parseInt(taskbox.attr("x")) + parseInt(taskbox.attr("width") + 8), parseInt(taskbox.attr("y")), "", {"font-size":"10px", "fill":"red"}));
        taskBox.data("textDur", text);
      },
      resize:     function (e) {
        //find and update links from, to
        var taskbox = $(this);
        var st = Math.round((parseFloat(taskbox.attr("x")) / self.fx) + self.startMillis);
        var en = Math.round(((parseFloat(taskbox.attr("x")) + parseFloat(taskbox.attr("width"))) / self.fx) + self.startMillis);
        var d = getDurationInUnits(computeStartDate(st), computeEndDate(en));
        var text = taskBox.data("textDur");
        text.attr("x", parseInt(taskbox.attr("x")) + parseInt(taskbox.attr("width")) + 8).html(durationToString(d));

        $("[from=" + task.id + "],[to=" + task.id + "]").trigger("update");
      },
      stopResize: function (e) {
        self.resDrop = true; //hack to avoid select
        var textBox = taskBox.data("textDur");
        if (textBox)
          textBox.remove();
        var taskbox = $(this);
        var task = self.master.getTask(taskbox.attr("taskid"));
        var st = Math.round((parseFloat(taskbox.attr("x")) / self.fx) + self.startMillis);
        var en = Math.round(((parseFloat(taskbox.attr("x")) + parseFloat(taskbox.attr("width"))) / self.fx) + self.startMillis);

        //in order to avoid rounding issue if the movement is less than 1px we keep the same start and end dates
        if (Math.abs(st-task.start)<1/self.fx) {
          st = task.start;
        }
        if (Math.abs(en-task.end)<1/self.fx) {
          en = task.end;
        }

        self.master.beginTransaction();
        self.master.changeTaskDates(task, new Date(st), new Date(en));
        self.master.endTransaction();
      }
    });

    //binding for creating link
    taskBox.find("[class*=linkHandleSVG]").mousedown(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var taskBox = $(this).closest(".taskBoxSVG");
      var svg = $(self.svg.root());
      var offs = svg.offset();
      self.linkOnProgress = true;
      self.linkFromEnd = $(this).is(".taskLinkEndSVG");
      svg.addClass("linkOnProgress");

      // create the line
      var startX = parseFloat(taskBox.attr("x")) + (self.linkFromEnd ? parseFloat(taskBox.attr("width")) : 0);
      var startY = parseFloat(taskBox.attr("y")) + parseFloat(taskBox.attr("height")) / 2;
      var line = self.svg.line(startX, startY, e.pageX - offs.left - 5, e.pageY - offs.top - 5, {class:"linkLineSVG"});
      var circle = self.svg.circle(startX, startY, 5, {class:"linkLineSVG"});

      //bind mousemove to draw a line
      svg.bind("mousemove.linkSVG", function (e) {
        var offs = svg.offset();
        var nx = e.pageX - offs.left;
        var ny = e.pageY - offs.top;
        var c = Math.sqrt(Math.pow(nx - startX, 2) + Math.pow(ny - startY, 2));
        nx = nx - (nx - startX) * 10 / c;
        ny = ny - (ny - startY) * 10 / c;
        self.svg.change(line, { x2:nx, y2:ny});
        self.svg.change(circle, { cx:nx, cy:ny});
      });

      //bind mouseup un body to stop
      $("body").one("mouseup.linkSVG", function (e) {
        $(line).remove();
        $(circle).remove();
        self.linkOnProgress = false;
        svg.removeClass("linkOnProgress");

        $(self.svg.root()).unbind("mousemove.linkSVG");
        var targetBox = $(e.target).closest(".taskBoxSVG");
        //console.debug("create link from " + taskBox.attr("taskid") + " to " + targetBox.attr("taskid"));

        if (targetBox && targetBox.attr("taskid") != taskBox.attr("taskid")) {
          var taskTo;
          var taskFrom;
          if (self.linkFromEnd) {
            taskTo = self.master.getTask(targetBox.attr("taskid"));
            taskFrom = self.master.getTask(taskBox.attr("taskid"));
          } else {
            taskFrom = self.master.getTask(targetBox.attr("taskid"));
            taskTo = self.master.getTask(taskBox.attr("taskid"));
          }

          if (taskTo && taskFrom) {
            var gap = 0;
            var depInp = taskTo.rowElement.find("[name=depends]");
            depInp.val(depInp.val() + ((depInp.val() + "").length > 0 ? "," : "") + (taskFrom.getRow() + 1) + (gap != 0 ? ":" + gap : ""));
            depInp.blur();
          }
        }
      })
    });
  }
  //ask for redraw link
  self.redrawLinks();

  //prof.stop();


  function _createTaskSVG(task) {
    var svg = self.svg;
    var dimensions = {
      x     : Math.round((task.start - self.startMillis) * self.fx),
      y     : task.rowElement.position().top + task.rowElement.offsetParent().scrollTop() + self.taskVertOffset,
      width : Math.max(Math.round((task.end - task.start) * self.fx), 1),
      height: (self.master.showBaselines ? self.taskHeight / 1.3 : self.taskHeight)
    };
    var taskSvg = svg.svg(self.tasksGroup, dimensions.x, dimensions.y, dimensions.width, dimensions.height, {class:"taskBox taskBoxSVG taskStatusSVG", status:task.status, taskid:task.id,fill:task.color||"#eee" });

    //svg.title(taskSvg, task.name);
    //external box
    var layout = svg.rect(taskSvg, 0, 0, "100%", "100%", {class:"taskLayout", rx:"2", ry:"2"});
    //external dep
    if (task.hasExternalDep)
      svg.rect(taskSvg, 0, 0, "100%", "100%", {fill:"url(#extDep)"});

    //progress
    if (task.progress > 0) {
      var progress = svg.rect(taskSvg, 0, "20%", (task.progress > 100 ? 100 : task.progress) + "%", "60%", {rx:"2", ry:"2",fill:"rgba(0,0,0,.4)"});
      if (dimensions.width > 50) {
        var textStyle = {fill:"#888", "font-size":"10px",class:"textPerc teamworkIcons",transform:"translate(5)"};
        if (task.progress > 100)
          textStyle["font-weight"]="bold";
        if (task.progress > 90)
          textStyle.transform = "translate(-40)";
        svg.text(taskSvg, (task.progress > 90 ? 100 : task.progress) + "%", (self.master.rowHeight - 5) / 2, (task.progress > 100 ? "!!! " : "") + task.progress + "%", textStyle);
      }
    }

    if (task.isParent())
      svg.rect(taskSvg, 0, 0, "100%", 3, {fill:"#000"});

    if (task.startIsMilestone) {
      svg.image(taskSvg, -9, dimensions.height/2-9, 18, 18, self.master.resourceUrl +"milestone.png")
    }

    if (task.endIsMilestone) {
      svg.image(taskSvg, "100%",dimensions.height/2-9, 18, 18, self.master.resourceUrl +"milestone.png", {transform:"translate(-9)"})
    }

    //task label
    svg.text(taskSvg, "100%", 18, task.name, {class:"taskLabelSVG", transform:"translate(20,-5)"});

    //link tool
    if (task.level>0){
      svg.circle(taskSvg, -self.resizeZoneWidth,  dimensions.height/2,dimensions.height/3, {class:"taskLinkStartSVG linkHandleSVG", transform:"translate("+(-dimensions.height/3+1)+")"});
      svg.circle(taskSvg, dimensions.width+self.resizeZoneWidth,dimensions.height/2,dimensions.height/3, {class:"taskLinkEndSVG linkHandleSVG", transform:"translate("+(dimensions.height/3-1)+")"});
    }
    return taskSvg
  }


  function _createBaselineSVG(task, baseline) {
    var svg = self.svg;

    var dimensions = {
      x     : Math.round((baseline.startDate - self.startMillis) * self.fx),
      y     : task.rowElement.position().top + task.rowElement.offsetParent().scrollTop() + self.taskVertOffset + self.taskHeight / 2,
      width : Math.max(Math.round((baseline.endDate - baseline.startDate) * self.fx), 1),
      height: (self.master.showBaselines ? self.taskHeight / 1.5 : self.taskHeight)
    };
    var taskSvg = svg.svg(self.tasksGroup, dimensions.x, dimensions.y, dimensions.width, dimensions.height, {class: "taskBox taskBoxSVG taskStatusSVG baseline", status: baseline.status, taskid: task.id, fill: task.color || "#eee" });

    //tooltip
    var label = "<b>" + task.name + "</b>";
    label += "<br>";
    label += "@" + new Date(self.master.baselineMillis).format();
    label += "<br><br>";
    label += "<b>Status:</b> " + baseline.status;
    label += "<br><br>";
    label += "<b>Start:</b> " + new Date(baseline.startDate).format();
    label += "<br>";
    label += "<b>End:</b> " + new Date(baseline.endDate).format();
    label += "<br>";
    label += "<b>Duration:</b> " + baseline.duration;
    label += "<br>";
    label += "<b>Progress:</b> " + baseline.progress + "%";

    $(taskSvg).attr("data-label", label).on("click", function (event) {
      showBaselineInfo(event, this);
      //bind hide
    });

    //external box
    var layout = svg.rect(taskSvg, 0, 0, "100%", "100%", {class: "taskLayout", rx: "2", ry: "2"});


    //progress

    if (baseline.progress > 0) {
      var progress = svg.rect(taskSvg, 0, "20%", (baseline.progress > 100 ? 100 : baseline.progress) + "%", "60%", {rx: "2", ry: "2", fill: "rgba(0,0,0,.4)"});
      /*if (dimensions.width > 50) {
             var textStyle = {fill:"#888", "font-size":"10px",class:"textPerc teamworkIcons",transform:"translate(5)"};
             if (baseline.progress > 100)
             textStyle["font-weight"]="bold";
             if (baseline.progress > 90)
             textStyle.transform = "translate(-40)";
             svg.text(taskSvg, (baseline.progress > 90 ? 100 : baseline.progress) + "%", (self.master.rowHeight - 5) / 2, (baseline.progress > 100 ? "!!! " : "") + baseline.progress + "%", textStyle);
             }*/
    }

    //if (task.isParent())
    //  svg.rect(taskSvg, 0, 0, "100%", 3, {fill:"#000"});


    //task label
    //svg.text(taskSvg, "100%", 18, task.name, {class:"taskLabelSVG", transform:"translate(20,-5)"});


    return taskSvg
  }

};


Ganttalendar.prototype.addTask = function (task) {
  //currently do nothing
};


//<%-------------------------------------- GANT DRAW LINK SVG ELEMENT --------------------------------------%>
//'from' and 'to' are tasks already drawn
Ganttalendar.prototype.drawLink = function (from, to, type) {
  //console.debug("drawLink")
  var self = this;
  var peduncolusSize = 10;

  /**
   * Given an item, extract its rendered position
   * width and height into a structure.
   */
  function buildRectFromTask(task) {
    var self=task.master.gantt;
    var editorRow = task.rowElement;
    var top = editorRow.position().top + editorRow.offsetParent().scrollTop();
    var x = Math.round((task.start - self.startMillis) * self.fx);
    var rect = {left: x, top: top + self.taskVertOffset, width: Math.max(Math.round((task.end - task.start) * self.fx),1), height: self.taskHeight};
    return rect;
  }

  /**
   * The default rendering method, which paints a start to end dependency.
   */
  function drawStartToEnd(from, to, ps) {
    var svg = self.svg;

    //this function update an existing link
    function update() {
      var group = $(this);
      var from = group.data("from");
      var to = group.data("to");

      var rectFrom = buildRectFromTask(from);
      var rectTo = buildRectFromTask(to);

      var fx1 = rectFrom.left;
      var fx2 = rectFrom.left + rectFrom.width;
      var fy = rectFrom.height / 2 + rectFrom.top;

      var tx1 = rectTo.left;
      var tx2 = rectTo.left + rectTo.width;
      var ty = rectTo.height / 2 + rectTo.top;


      var tooClose = tx1 < fx2 + 2 * ps;
      var r = 5; //radius
      var arrowOffset = 5;
      var up = fy > ty;
      var fup = up ? -1 : 1;

      var prev = fx2 + 2 * ps > tx1;
      var fprev = prev ? -1 : 1;

      var image = group.find("image");
      var p = svg.createPath();

      if (tooClose) {
        var firstLine = fup * (rectFrom.height / 2 - 2 * r + 2);
        p.move(fx2, fy)
          .line(ps, 0, true)
          .arc(r, r, 90, false, !up, r, fup * r, true)
          .line(0, firstLine, true)
          .arc(r, r, 90, false, !up, -r, fup * r, true)
          .line(fprev * 2 * ps + (tx1 - fx2), 0, true)
          .arc(r, r, 90, false, up, -r, fup * r, true)
          .line(0, (Math.abs(ty - fy) - 4 * r - Math.abs(firstLine)) * fup - arrowOffset, true)
          .arc(r, r, 90, false, up, r, fup * r, true)
          .line(ps, 0, true);
        image.attr({x:tx1 - 5, y:ty - 5 - arrowOffset});

      } else {
        p.move(fx2, fy)
          .line((tx1 - fx2) / 2 - r, 0, true)
          .arc(r, r, 90, false, !up, r, fup * r, true)
          .line(0, ty - fy - fup * 2 * r + arrowOffset, true)
          .arc(r, r, 90, false, up, r, fup * r, true)
          .line((tx1 - fx2) / 2 - r, 0, true);
        image.attr({x:tx1 - 5, y:ty - 5 + arrowOffset});
      }

      group.find("path").attr({d:p.path()});
    }


    // create the group
    var group = svg.group(self.linksGroup, "" + from.id + "-" + to.id);
    svg.title(group, from.name + " -> " + to.name);

    var p = svg.createPath();

    //add the arrow
    svg.image(group, 0, 0, 5, 10, self.master.resourceUrl +"linkArrow.png");
    //create empty path
    svg.path(group, p, {class:"taskLinkPathSVG"});

    //set "from" and "to" to the group, bind "update" and trigger it
    var jqGroup = $(group).data({from:from, to:to }).attr({from:from.id, to:to.id}).on("update", update).trigger("update");

    if (self.showCriticalPath && from.isCritical && to.isCritical)
      jqGroup.addClass("critical");

    jqGroup.addClass("linkGroup");
    return jqGroup;
  }


  /**
   * A rendering method which paints a start to start dependency.
   */
  function drawStartToStart(from, to) {
    console.error("StartToStart not supported on SVG");
    var rectFrom = buildRectFromTask(from);
    var rectTo = buildRectFromTask(to);
  }

  var link;
  // Dispatch to the correct renderer
  if (type == 'start-to-start') {
    link = drawStartToStart(from, to, peduncolusSize);
  } else {
    link = drawStartToEnd(from, to, peduncolusSize);
  }

  // in order to create a dependency you will need permissions on both tasks
  if (this.master.permissions.canWrite || ( from.canWrite && to.canWrite)) {
    link.click(function (e) {
      var el = $(this);
      e.stopPropagation();// to avoid body remove focused
      self.element.find("[class*=focused]").removeClass("focused");
      $(".ganttSVGBox .focused").removeClass("focused");
      var el = $(this);
      if (!self.resDrop)
        el.addClass("focused");
      self.resDrop = false; //hack to avoid select

      $("body").off("click.focused").one("click.focused", function () {
        $(".ganttSVGBox .focused").removeClass("focused");
      })

    });
  }


};

Ganttalendar.prototype.redrawLinks = function () {
  //console.debug("redrawLinks ");
  var self = this;
  this.element.stopTime("ganttlnksredr");
  this.element.oneTime(10, "ganttlnksredr", function () {

    //var prof=new Profiler("gd_drawLink_real");

    //remove all links
    $("#linksGroup").empty();

    var collapsedDescendant = [];

    //[expand]
    var collapsedDescendant = self.master.getCollapsedDescendant();
    for (var i = 0; i < self.master.links.length; i++) {
      var link = self.master.links[i];

      if (collapsedDescendant.indexOf(link.from) >= 0 || collapsedDescendant.indexOf(link.to) >= 0) continue;

      var rowA=link.from.getRow();
      var rowB=link.to.getRow();

      //if link is out of visible screen continue
      if(Math.max(rowA,rowB)<self.master.firstVisibleTaskIndex || Math.min(rowA,rowB)>self.master.lastVisibleTaskIndex) continue;

      self.drawLink(link.from, link.to);
    }
    //prof.stop();
  });
};


Ganttalendar.prototype.reset = function () {
  //var prof= new Profiler("ganttDrawerSVG.reset");
  this.element.find("[class*=linkGroup]").remove();
  this.element.find("[taskid]").remove();
  //prof.stop()
};


Ganttalendar.prototype.redrawTasks = function (drawAll) {
  //console.debug("redrawTasks ");
  var self=this;
  //var prof = new Profiler("ganttRedrawTasks");

  self.element.find("table.ganttTable").height(self.master.editor.element.height());

  var collapsedDescendant = this.master.getCollapsedDescendant();

  var startRowAdd=self.master.firstScreenLine-self.master.rowBufferSize;
  var endRowAdd =self.master.firstScreenLine+self.master.numOfVisibleRows+self.master.rowBufferSize;

  $("#linksGroup,#tasksGroup").empty();
  var gridGroup=$("#gridGroup").empty().get(0);

  //add missing ones
  var row=0;
  self.master.firstVisibleTaskIndex=-1;
  for (var i=0;i<self.master.tasks.length;i++){
    var task=self.master.tasks[i];
    if (collapsedDescendant.indexOf(task)>=0){
      continue;
    }
    if (drawAll || (row>=startRowAdd && row<endRowAdd)) {
      this.drawTask(task);
      self.master.firstVisibleTaskIndex=self.master.firstVisibleTaskIndex==-1?i:self.master.firstVisibleTaskIndex;
      self.master.lastVisibleTaskIndex = i;
    }
    row++
  }

  //creates rows grid
  for (var i = 40; i <= self.master.editor.element.height(); i += self.master.rowHeight)
    self.svg.rect(gridGroup, 0, i, "100%", self.master.rowHeight, {class: "ganttLinesSVG"});

  // drawTodayLine
  if (new Date().getTime() > self.startMillis && new Date().getTime() < self.endMillis) {
    var x = Math.round(((new Date().getTime()) - self.startMillis) * self.fx);
    self.svg.line(gridGroup, x, 0, x, "100%", {class: "ganttTodaySVG"});
  }


  //prof.stop();
};


Ganttalendar.prototype.shrinkBoundaries = function () {
  //console.debug("shrinkBoundaries")
  var start = Infinity;
  var end =  -Infinity;
  for (var i = 0; i < this.master.tasks.length; i++) {
    var task = this.master.tasks[i];
    if (start > task.start)
      start = task.start;
    if (end < task.end)
      end = task.end;
  }

  //if include today synch extremes
  if (this.includeToday) {
    var today = new Date().getTime();
    start = start > today ? today : start;
    end = end< today ? today : end;
  }

  //mark boundaries as changed
  this.gridChanged=this.gridChanged || this.originalStartMillis!=start || this.originalEndMillis!=end;

  this.originalStartMillis=start;
  this.originalEndMillis=end;
};

Ganttalendar.prototype.setBestFittingZoom = function () {
  //console.debug("setBestFittingZoom");

  if (this.getStoredZoomLevel()) {
    this.zoom = this.getStoredZoomLevel();
    return;
  }


  //if zoom is not defined get the best fitting one
  var dur = this.originalEndMillis -this.originalStartMillis;
  var minDist = Number.MAX_VALUE;
  var i = 0;
  for (; i < this.zoomLevels.length; i++) {
    var dist = Math.abs(dur - millisFromString(this.zoomLevels[i]));
    if (dist <= minDist) {
      minDist = dist;
    } else {
      break;
    }
    this.zoom = this.zoomLevels[i];
  }

  this.zoom=this.zoom||this.zoomLevels[this.zoomLevels.length-1];

};

Ganttalendar.prototype.redraw = function () {
  //console.debug("redraw",this.zoom, this.originalStartMillis, this.originalEndMillis);
  //var prof= new Profiler("Ganttalendar.redraw");

  if (this.showCriticalPath) {
    this.master.computeCriticalPath();
  }

  if (this.gridChanged) {
    this.gridChanged=false;
    var par = this.element.parent();

    //try to maintain last scroll
    var scrollY = par.scrollTop();
    var scrollX = par.scrollLeft();

    this.element.remove();

    var domEl = this.createGanttGrid();
    this.element = domEl;
    par.append(domEl);
    this.redrawTasks();

    //set old scroll
    par.scrollTop(scrollY);
    par.scrollLeft(scrollX);

  } else {
    this.redrawTasks();
  }


  //set current task
  this.synchHighlight();

  //prof.stop();
  //Profiler.displayAll();
  //Profiler.reset()

};


Ganttalendar.prototype.fitGantt = function () {
  delete this.zoom;
  this.redraw();
};

Ganttalendar.prototype.synchHighlight = function () {
  //console.debug("synchHighlight",this.master.currentTask);
  if (this.master.currentTask ){
    // take care of collapsed rows
    var ganttHighLighterPosition=this.master.editor.element.find(".taskEditRow:visible").index(this.master.currentTask.rowElement);
    this.master.gantt.element.find(".ganttLinesSVG").removeClass("rowSelected").eq(ganttHighLighterPosition).addClass("rowSelected");
  } else {
    $(".rowSelected").removeClass("rowSelected"); // todo non c'era
  }
};


Ganttalendar.prototype.getCenterMillis= function () {
  return parseInt((this.element.parent().scrollLeft()+this.element.parent().width()/2)/this.fx+this.startMillis);
};

Ganttalendar.prototype.goToMillis= function (millis) {
  var x = Math.round(((millis) - this.startMillis) * this.fx) -this.element.parent().width()/2;
  this.element.parent().scrollLeft(x);
};

Ganttalendar.prototype.centerOnToday = function () {
  this.goToMillis(new Date().getTime());
};


/**
 * Allows drag and drop and extesion of task boxes. Only works on x axis
 * @param opt
 * @return {*}
 */
$.fn.dragExtedSVG = function (svg, opt) {

  //doing this can work with one svg at once only
  var target;
  var svgX;
  var offsetMouseRect;

  var options = {
    canDrag:        true,
    canResize:      true,
    resizeZoneWidth:5,
    minSize:        10,
    startDrag:      function (e) {},
    drag:           function (e) {},
    drop:           function (e) {},
    startResize:    function (e) {},
    resize:         function (e) {},
    stopResize:     function (e) {}
  };

  $.extend(options, opt);

  this.each(function () {
    var el = $(this);
    svgX = svg.parent().offset().left; //parent is used instead of svg for a Firefox oddity
    if (options.canDrag)
      el.addClass("deSVGdrag");

    if (options.canResize || options.canDrag) {
      el.bind("mousedown.deSVG",function (e) {
          //console.debug("mousedown.deSVG");
          if ($(e.target).is("image")) {
            e.preventDefault();
          }

          target = $(this);
          var x1 = parseFloat(el.find("[class*=taskLayout]").offset().left);
          var x2 = x1 + parseFloat(el.attr("width"));
          var posx = e.pageX;

          $("body").unselectable();

          //start resize end
          if (options.canResize && Math.abs(posx-x2)<=options.resizeZoneWidth) {
            //store offset mouse x2
            offsetMouseRect = x2 - e.pageX;
            target.attr("oldw", target.attr("width"));
            var one = true;

            //bind event for start resizing
            $(svg).bind("mousemove.deSVG", function (e) {
              //hide link circle
              $("[class*=linkHandleSVG]").hide();

              if (one) {
                //trigger startResize
                options.startResize.call(target.get(0), e);
                one = false;
              }

              //manage resizing
              var nW =  e.pageX - x1 + offsetMouseRect;

              target.attr("width", nW < options.minSize ? options.minSize : nW);
              //callback
              options.resize.call(target.get(0), e);
            });

            //bind mouse up on body to stop resizing
            $("body").one("mouseup.deSVG", stopResize);


            //start resize start
          } else  if (options.canResize && Math.abs(posx-x1)<=options.resizeZoneWidth) {
            //store offset mouse x1
            offsetMouseRect = parseFloat(target.attr("x"));
            target.attr("oldw", target.attr("width")); //todo controllare se è ancora usato oldw

            var one = true;

            //bind event for start resizing
            $(svg).bind("mousemove.deSVG", function (e) {
              //hide link circle
              $("[class*=linkHandleSVG]").hide();

              if (one) {
                //trigger startResize
                options.startResize.call(target.get(0), e);
                one = false;
              }

              //manage resizing
              var nx1= offsetMouseRect-(posx-e.pageX);
              var nW = (x2-x1) + (posx-e.pageX);
              nW=nW < options.minSize ? options.minSize : nW;
              target.attr("x",nx1);
              target.attr("width", nW);
              //callback
              options.resize.call(target.get(0), e);
            });

            //bind mouse up on body to stop resizing
            $("body").one("mouseup.deSVG", stopResize);


            // start drag
          } else if (options.canDrag) {
            //store offset mouse x1
            offsetMouseRect = parseFloat(target.attr("x")) - e.pageX;
            target.attr("oldx", target.attr("x"));

            var one = true;
            //bind event for start dragging
            $(svg).bind("mousemove.deSVG",function (e) {
              //hide link circle
              $("[class*=linkHandleSVG]").hide();
              if (one) {
                //trigger startDrag
                options.startDrag.call(target.get(0), e);
                one = false;
              }

              //manage resizing
              target.attr("x", offsetMouseRect + e.pageX);
              //callback
              options.drag.call(target.get(0), e);

            }).bind("mouseleave.deSVG", drop);

            //bind mouse up on body to stop resizing
            $("body").one("mouseup.deSVG", drop);

          }
        }
      ).bind("mousemove.deSVG",
        function (e) {
          var el = $(this);
          var x1 = el.find("[class*=taskLayout]").offset().left;
          var x2 = x1 + parseFloat(el.attr("width"));
          var posx = e.pageX;

          //set cursor handle
          //if (options.canResize && (x2-x1)>3*options.resizeZoneWidth &&((posx<=x2 &&  posx >= x2- options.resizeZoneWidth) || (posx>=x1 && posx<=x1+options.resizeZoneWidth))) {
          if (options.canResize && (Math.abs(posx-x1)<=options.resizeZoneWidth || Math.abs(posx-x2)<=options.resizeZoneWidth)) {
            el.addClass("deSVGhand");
          } else {
            el.removeClass("deSVGhand");
          }
        }
      ).addClass("deSVG");
    }
  });
  return this;


  function stopResize(e) {
    $(svg).unbind("mousemove.deSVG").unbind("mouseup.deSVG").unbind("mouseleave.deSVG");
    if (target && target.attr("oldw")!=target.attr("width"))
      options.stopResize.call(target.get(0), e); //callback
    target = undefined;
    $("body").clearUnselectable();
  }

  function drop(e) {
    $(svg).unbind("mousemove.deSVG").unbind("mouseup.deSVG").unbind("mouseleave.deSVG");
    if (target && target.attr("oldx") != target.attr("x"))
      options.drop.call(target.get(0), e); //callback
    target = undefined;
    $("body").clearUnselectable();
  }

};

function millisFromString(string, considerWorkingdays) {
  if (!string)
    return 0;

  //var regex = new RegExp("(\\d+[Yy])|(\\d+[M])|(\\d+[Ww])|(\\d+[Dd])|(\\d+[Hh])|(\\d+[m])|(\\d+[Ss])|(\\d+:\\d+)|(:\\d+)|(\\d*[\\.,]\\d+)|(\\d+)", "g"); // bicch 14/1/16 supporto per 1.5d
  var regex = new RegExp("([0-9\\.,]+[Yy])|([0-9\\.,]+[Qq])|([0-9\\.,]+[M])|([0-9\\.,]+[Ww])|([0-9\\.,]+[Dd])|([0-9\\.,]+[Hh])|([0-9\\.,]+[m])|([0-9\\.,]+[Ss])|(\\d+:\\d+:\\d+)|(\\d+:\\d+)|(:\\d+)|(\\d*[\\.,]\\d+)|(\\d+)", "g");

  var matcher = regex.exec(string);
  var totMillis = 0;

  if (!matcher)
    return NaN;

  while (matcher != null) {
    for (var i = 1; i < matcher.length; i++) {
      var match = matcher[i];
      if (match) {
        var number = 0;
        try {
          //number = parseInt(match); // bicch 14/1/16 supporto per 1.5d
          number = parseFloat(match.replace(',','.'));
        } catch (e) {
        }
        if (i == 1) { // years
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 52 : 3600000 * 24 * 365);
        } else if (i == 2) { // quarter
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 4 : 3600000 * 24 * 91);
        } else if (i == 3) { // months
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 4 : 3600000 * 24 * 30);
        } else if (i == 4) { // weeks
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek : 3600000 * 24 * 7);
        } else if (i == 5) { // days
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay : 3600000 * 24);
        } else if (i == 6) { // hours
          totMillis = totMillis + number * 3600000;
        } else if (i == 7) { // minutes
          totMillis = totMillis + number * 60000;
        } else if (i == 8) { // seconds
          totMillis = totMillis + number * 1000;
        } else if (i == 9) { // hour:minutes:seconds
          totMillis = totMillis + millisFromHourMinuteSecond(match);
        } else if (i == 10) { // hour:minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 11) { // :minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 12) { // hour.minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 13) { // hours
          totMillis = totMillis + number * 3600000;
        }
      }
    }
    matcher = regex.exec(string);
  }

  return totMillis;
}



/*
 Copyright (c) 2012-2018 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * A method to instantiate valid task models from
 * raw data.
 */
function TaskFactory() {

  /**
   * Build a new Task
   */
  this.build = function (id, name, code, level, start, duration, collapsed) {
    // Set at beginning of day
    var adjusted_start = computeStart(start);
    var calculated_end = computeEndByDuration(adjusted_start, duration);
    return new Task(id, name, code, level, adjusted_start, calculated_end, duration, collapsed);
  };

}

function Task(id, name, code, level, start, end, duration, collapsed) {
  this.id = id;
  this.name = name;
  this.progress = 0;
  this.progressByWorklog = false;
  this.relevance = 0;
  this.type = "";
  this.typeId = "";
  this.description = "";
  this.code = code;
  this.level = level;
  this.status = "STATUS_UNDEFINED";
  this.depends = "";

  this.start = start;
  this.duration = duration;
  this.end = end;

  this.startIsMilestone = false;
  this.endIsMilestone = false;

  this.collapsed = collapsed;

  //permissions
  // by default all true, but must be inherited from parent
  this.canWrite = true;
  this.canAdd = true;
  this.canDelete = true;
  this.canAddIssue = true;

  this.rowElement; //row editor html element
  this.ganttElement; //gantt html element
  this.master;


  this.assigs = [];
}

Task.prototype.clone = function () {
  var ret = {};
  for (var key in this) {
    if (typeof(this[key]) != "function")
      if (typeof(this[key]) != "object" || Array.isArray(this[key]))
        ret[key] = this[key];
  }
  return ret;
};

Task.prototype.getAssigsString = function () {
  var ret = "";
  for (var i = 0; i < this.assigs.length; i++) {
    var ass = this.assigs[i];
    var res = this.master.getResource(ass.resourceId);
    if (res) {
      ret = ret + (ret == "" ? "" : ", ") + res.name;
    }
  }
  return ret;
};

Task.prototype.createAssignment = function (id, resourceId, roleId, effort) {
  var assig = new Assignment(id, resourceId, roleId, effort);
  this.assigs.push(assig);
  return assig;
};


//<%---------- SET PERIOD ---------------------- --%>
Task.prototype.setPeriod = function (start, end) {
  //console.debug("setPeriod ",this.code,this.name,new Date(start), new Date(end));
  //var profilerSetPer = new Profiler("gt_setPeriodJS");

  if (start instanceof Date) {
    start = start.getTime();
  }

  if (end instanceof Date) {
    end = end.getTime();
  }

  var originalPeriod = {
    start:    this.start,
    end:      this.end,
    duration: this.duration
  };


  //compute legal start/end //todo mossa qui R&S 30/3/2016 perchè altrimenti il calcolo della durata, che è stato modificato sommando giorni, sbaglia
  start = computeStart(start);
  end=computeEnd(end);

  var newDuration = recomputeDuration(start, end);

  //if are equals do nothing and return true
  if ( start == originalPeriod.start && end == originalPeriod.end && newDuration == originalPeriod.duration) {
    return true;
  }

  if (newDuration == this.duration) { // is shift
    return this.moveTo(start, false,true);
  }

  var wantedStartMillis = start;

  var children = this.getChildren();

  if(this.master.shrinkParent && children.length>0) {
    var chPeriod= this.getChildrenBoudaries();
    start = chPeriod.start;
    end = chPeriod.end;
  }


  //cannot start after end
  if (start > end) {
    start = end;
  }

  //if there are dependencies compute the start date and eventually moveTo
  var startBySuperiors = this.computeStartBySuperiors(start);
  if (startBySuperiors != start) {
    return this.moveTo(startBySuperiors, false,true);
  }

  var somethingChanged = false;

  if (this.start != start || this.start != wantedStartMillis) {
    this.start = start;
    somethingChanged = true;
  }

  //set end
  var wantedEndMillis = end;

  if (this.end != end || this.end != wantedEndMillis) {
    this.end = end;
    somethingChanged = true;
  }

  this.duration = recomputeDuration(this.start, this.end);

  //profilerSetPer.stop();

  //nothing changed exit
  if (!somethingChanged)
    return true;

  //cannot write exit
  if (!this.canWrite) {
    this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["CANNOT_WRITE"], this);
    return false;
  }

  //external dependencies: exit with error
  if (this.hasExternalDep) {
    this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["TASK_HAS_EXTERNAL_DEPS"], this);
    return false;
  }

  var todoOk = true;

  //I'm restricting
  var deltaPeriod = originalPeriod.duration - this.duration;
  var restricting = deltaPeriod > 0;
  var enlarging = deltaPeriod < 0;
  var restrictingStart = restricting && (originalPeriod.start < this.start);
  var restrictingEnd = restricting && (originalPeriod.end > this.end);

  if (restricting) {
    //loops children to get boundaries
    var bs = Infinity;
    var be = 0;
    for (var i = 0; i < children.length; i++) {

      var ch = children[i];
      if (restrictingEnd) {
        be = Math.max(be, ch.end);
      } else {
        bs = Math.min(bs, ch.start);
      }
    }

    if (restrictingEnd) {
      this.end = Math.max(be, this.end);
    } else {
      this.start = Math.min(bs, this.start);
    }
    this.duration = recomputeDuration(this.start, this.end);
    if (this.master.shrinkParent ) {
      todoOk = updateTree(this);
    }

  } else {

    //check global boundaries
    if (this.start < this.master.minEditableDate || this.end > this.master.maxEditableDate) {
      this.master.setErrorOnTransaction("\"" + this.name + "\"\n" +GanttMaster.messages["CHANGE_OUT_OF_SCOPE"], this);
      todoOk = false;
    }

    //console.debug("set period: somethingChanged",this);
    if (todoOk ) {
      todoOk = updateTree(this);
    }
  }

  if (todoOk) {
    todoOk = this.propagateToInferiors(end);
  }
  return todoOk;
};


//<%---------- MOVE TO ---------------------- --%>
Task.prototype.moveTo = function (start, ignoreMilestones, propagateToInferiors) {
  //console.debug("moveTo ",this.name,new Date(start),this.duration,ignoreMilestones);
  //var profiler = new Profiler("gt_task_moveTo");

  if (start instanceof Date) {
    start = start.getTime();
  }

  var originalPeriod = {
    start: this.start,
    end:   this.end
  };

  var wantedStartMillis = start;

  //set a legal start
  start = computeStart(start);

  //if depends, start is set to max end + lag of superior
  start = this.computeStartBySuperiors(start);

  var end = computeEndByDuration(start, this.duration);


  //check milestones compatibility
  if (!this.checkMilestonesConstraints(start,end,ignoreMilestones))
    return false;

  if (this.start != start || this.start != wantedStartMillis) {
    //in case of end is milestone it never changes!
    //if (!ignoreMilestones && this.endIsMilestone && end != this.end) {
    //  this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["END_IS_MILESTONE"], this);
    //  return false;
    //}
    this.start = start;
    this.end = end;
    //profiler.stop();

    //check global boundaries
    if (this.start < this.master.minEditableDate || this.end > this.master.maxEditableDate) {
      this.master.setErrorOnTransaction("\"" + this.name + "\"\n" +GanttMaster.messages["CHANGE_OUT_OF_SCOPE"], this);
      return false;
    }


    // bicch 22/4/2016: quando si sposta un task con child a cavallo di holidays, i figli devono essere shiftati in workingDays, non in millisecondi, altrimenti si cambiano le durate
    // when moving children you MUST consider WORKING days,
    var panDeltaInWM = getDistanceInUnits(new Date(originalPeriod.start),new Date(this.start));

    //loops children to shift them
    var children = this.getChildren();
    for (var i = 0; i < children.length; i++) {
      var ch = children[i];
      var chStart=incrementDateByUnits(new Date(ch.start),panDeltaInWM);
      ch.moveTo(chStart,false,false);
    }

    if (!updateTree(this)) {
      return false;
    }

    if (propagateToInferiors) {
      this.propagateToInferiors(end);
      var todoOk = true;
      var descendants = this.getDescendant();
      for (var i = 0; i < descendants.length; i++) {
        ch = descendants[i];
        if (!ch.propagateToInferiors(ch.end))
          return false;
      }
    }
  }

  return true;
};


Task.prototype.checkMilestonesConstraints = function (newStart,newEnd,ignoreMilestones) {

//if start is milestone cannot be move
  if (!ignoreMilestones && (this.startIsMilestone && newStart != this.start  )) {
    //notify error
    this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["START_IS_MILESTONE"], this);
    return false;
  } else if (!ignoreMilestones && (this.endIsMilestone && newEnd != this.end)) {
    //notify error
    this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["END_IS_MILESTONE"], this);
    return false;
  } else if (this.hasExternalDep) {
    //notify error
    this.master.setErrorOnTransaction("\"" + this.name + "\"\n" + GanttMaster.messages["TASK_HAS_EXTERNAL_DEPS"], this);
    return false;
  }
  return true;
};

//<%---------- PROPAGATE TO INFERIORS ---------------------- --%>
Task.prototype.propagateToInferiors = function (end) {
  //console.debug("propagateToInferiors "+this.name)
  //and now propagate to inferiors
  var todoOk = true;
  var infs = this.getInferiors();
  if (infs && infs.length > 0) {
    for (var i = 0; i < infs.length; i++) {
      var link = infs[i];
      if (!link.to.canWrite) {
        this.master.setErrorOnTransaction(GanttMaster.messages["CANNOT_WRITE"] + "\n\"" + link.to.name + "\"", link.to);
        break;
      }
      todoOk = link.to.moveTo(end, false,true); //this is not the right date but moveTo checks start
      if (!todoOk)
        break;
    }
  }
  return todoOk;
};


//<%---------- COMPUTE START BY SUPERIORS ---------------------- --%>
Task.prototype.computeStartBySuperiors = function (proposedStart) {
  //if depends -> start is set to max end + lag of superior
  var supEnd=proposedStart;
  var sups = this.getSuperiors();
  if (sups && sups.length > 0) {
    supEnd=0;
    for (var i = 0; i < sups.length; i++) {
      var link = sups[i];
      supEnd = Math.max(supEnd, incrementDateByUnits(new Date(link.from.end), link.lag));
    }
    supEnd+=1;
  }
  return computeStart(supEnd);
};


function updateTree(task) {
  //console.debug("updateTree ",task.code,task.name, new Date(task.start), new Date(task.end));
  var error;

  //try to enlarge parent
  var p = task.getParent();

  //no parent:exit
  if (!p)
    return true;

  var newStart;
  var newEnd;

  //id shrink start and end are computed on children boundaries
  if (task.master.shrinkParent) {
    var chPeriod= p.getChildrenBoudaries();
    newStart = chPeriod.start;
    newEnd = chPeriod.end;
  } else {
    newStart = p.start;
    newEnd = p.end;

    if (p.start > task.start) {
      newStart = task.start;
    }
    if (p.end < task.end) {
      newEnd = task.end;
    }
  }

  if (p.start!=newStart) {
    if (p.startIsMilestone) {
      task.master.setErrorOnTransaction("\"" + p.name + "\"\n" + GanttMaster.messages["START_IS_MILESTONE"], task);
      return false;
    } else if (p.depends) {
      task.master.setErrorOnTransaction("\"" + p.name + "\"\n" + GanttMaster.messages["TASK_HAS_CONSTRAINTS"], task);
      return false;
    }
  }
  if (p.end!=newEnd) {
    if (p.endIsMilestone) {
      task.master.setErrorOnTransaction("\"" + p.name + "\"\n" + GanttMaster.messages["END_IS_MILESTONE"], task);
      return false;
    }
  }


  //propagate updates if needed
  if (newStart != p.start || newEnd != p.end) {

    //can write?
    if (!p.canWrite) {
      task.master.setErrorOnTransaction(GanttMaster.messages["CANNOT_WRITE"] + "\n" + p.name, task);
      return false;
    }

    //has external deps ?
    if (p.hasExternalDep) {
      task.master.setErrorOnTransaction(GanttMaster.messages["TASK_HAS_EXTERNAL_DEPS"] + "\n\"" + p.name + "\"", task);
      return false;
    }

    return p.setPeriod(newStart, newEnd);
  }

  return true;
}


Task.prototype.getChildrenBoudaries = function () {
  var newStart = Infinity;
  var newEnd = -Infinity;
  var children = this.getChildren();
  for (var i = 0; i < children.length; i++) {
    var ch = children[i];
    newStart = Math.min(newStart, ch.start);
    newEnd = Math.max(newEnd, ch.end);
  }
  return({start:newStart,end:newEnd})
}

//<%---------- CHANGE STATUS ---------------------- --%>
Task.prototype.changeStatus = function (newStatus,forceStatusCheck) {
  //console.debug("changeStatus: "+this.name+" from "+this.status+" -> "+newStatus);

  var cone = this.getDescendant();

  function propagateStatus(task, newStatus, manuallyChanged, propagateFromParent, propagateFromChildren) {
    //console.debug("propagateStatus",task.name, task.status,newStatus, manuallyChanged, propagateFromParent, propagateFromChildren);
    var oldStatus = task.status;

    //no changes exit
    if (newStatus == oldStatus && !forceStatusCheck) {
      return true;
    }

    var todoOk = true;
    task.status = newStatus;


    //xxxx -> STATUS_DONE            may activate dependent tasks, both suspended and undefined. Will set to done all children.
    //STATUS_FAILED -> STATUS_DONE   do nothing if not forced by hand
    if (newStatus == "STATUS_DONE") {

      // cannot close task if open issues
      if (task.master.permissions.cannotCloseTaskIfIssueOpen && task.openIssues > 0) {
        task.master.setErrorOnTransaction(GanttMaster.messages["CANNOT_CLOSE_TASK_IF_OPEN_ISSUE"] + " \"" + task.name + "\"");
        return false;
      }


      if ((manuallyChanged || oldStatus != "STATUS_FAILED")) { //cannot set failed task as closed for cascade - only if changed manually

        //can be closed only if superiors are already done
        var sups = task.getSuperiors();
        for (var i = 0; i < sups.length; i++) {
          if (sups[i].from.status != "STATUS_DONE" && cone.indexOf(sups[i].from)<0) { // è un errore se un predecessore è non chiuso ed è fuori dal cono
            if (manuallyChanged || propagateFromParent)  //genere un errore bloccante se è cambiato a mano o se il cambiamento arriva dal parent ed ho una dipendenza fuori dal cono (altrimenti avrei un attivo figlio di un chiuso
              task.master.setErrorOnTransaction(GanttMaster.messages["GANTT_ERROR_DEPENDS_ON_OPEN_TASK"] + "\n\"" + sups[i].from.name + "\" -> \"" + task.name + "\"");
            todoOk = false;
            break;
          }
        }

        if (todoOk) {
          // set progress to 100% if needed by settings
          if (task.master.set100OnClose && !task.progressByWorklog ){
            task.progress=100;
          }

          //set children as done
          propagateStatusToChildren(task,newStatus,false);

          //set inferiors as active
          propagateStatusToInferiors( task.getInferiors(), "STATUS_ACTIVE");
        }
      } else { // una propagazione tenta di chiudere un task fallito
        todoOk = false;
      }


      //  STATUS_UNDEFINED -> STATUS_ACTIVE       all children become active, if they have no dependencies.
      //  STATUS_SUSPENDED -> STATUS_ACTIVE       sets to active all children and their descendants that have no inhibiting dependencies.
      //  STATUS_WAITING -> STATUS_ACTIVE         sets to active all children and their descendants that have no inhibiting dependencies.
      //  STATUS_DONE -> STATUS_ACTIVE            all those that have dependencies must be set to suspended.
      //  STATUS_FAILED -> STATUS_ACTIVE          nothing happens: child statuses must be reset by hand.
    } else if (newStatus == "STATUS_ACTIVE") {

      if (manuallyChanged || (oldStatus != "STATUS_FAILED" && oldStatus != "STATUS_SUSPENDED")) { //cannot set failed or suspended task as active for cascade - only if changed manually

        //can be active only if superiors are already done, not only on this task, but also on ancestors superiors
        var sups = task.getSuperiors();

        for (var i = 0; i < sups.length; i++) {
          if (sups[i].from.status != "STATUS_DONE") {
            if (manuallyChanged || propagateFromChildren)
              task.master.setErrorOnTransaction(GanttMaster.messages["GANTT_ERROR_DEPENDS_ON_OPEN_TASK"] + "\n\"" + sups[i].from.name + "\" -> \"" + task.name + "\"");
            todoOk = false;
            break;
          }
        }

        // check if parent is already active
        if (todoOk) {
          var par = task.getParent();
          if (par && par.status != "STATUS_ACTIVE") {
            // todoOk = propagateStatus(par, "STATUS_ACTIVE", false, false, true); //todo abbiamo deciso di non far propagare lo status verso l'alto
            todoOk = false;
          }
        }


        if (todoOk) {
          if (oldStatus == "STATUS_UNDEFINED" || oldStatus == "STATUS_SUSPENDED" || oldStatus == "STATUS_WAITING" ) {
            //set children as active
            propagateStatusToChildren(task,newStatus,true);
          }

          //set inferiors as suspended
          //propagateStatusToInferiors( task.getInferiors(), "STATUS_SUSPENDED");
          propagateStatusToInferiors( task.getInferiors(), "STATUS_WAITING");
        }
      } else {
        todoOk = false;
      }

      // xxxx -> STATUS_WAITING       all active children and their active descendants become waiting. when not failed or forced
    } else if (newStatus == "STATUS_WAITING" ) {
      if (manuallyChanged || oldStatus != "STATUS_FAILED") { //cannot set failed task as waiting for cascade - only if changed manually

        //check if parent if not active
        var par = task.getParent();
        if (par && (par.status != "STATUS_ACTIVE" && par.status != "STATUS_SUSPENDED" && par.status != "STATUS_WAITING")) {
          todoOk = false;
        }


        if (todoOk) {
          //set children as STATUS_WAITING
          propagateStatusToChildren(task, "STATUS_WAITING", true);

          //set inferiors as STATUS_WAITING
          propagateStatusToInferiors( task.getInferiors(), "STATUS_WAITING");
        }
      } else {
        todoOk = false;
      }

      // xxxx -> STATUS_SUSPENDED       all active children and their active descendants become suspended. when not failed or forced
    } else if (newStatus == "STATUS_SUSPENDED" ) {
      if (manuallyChanged || oldStatus != "STATUS_FAILED") { //cannot set failed task as closed for cascade - only if changed manually

        //check if parent if not active
        var par = task.getParent();
        if (par && (par.status != "STATUS_ACTIVE" && par.status != "STATUS_SUSPENDED" && par.status != "STATUS_WAITING")) {
          todoOk = false;
        }


        if (todoOk) {
          //set children as STATUS_SUSPENDED
          propagateStatusToChildren(task, "STATUS_SUSPENDED", true);

          //set inferiors as STATUS_SUSPENDED
          propagateStatusToInferiors( task.getInferiors(), "STATUS_SUSPENDED");
        }
      } else {
        todoOk = false;
      }

      // xxxx -> STATUS_FAILED children and dependent failed
      // xxxx -> STATUS_UNDEFINED  children and dependant become undefined.
    } else if (newStatus == "STATUS_FAILED" || newStatus == "STATUS_UNDEFINED") {

      //set children as failed or undefined
      propagateStatusToChildren(task,newStatus,false);

      //set inferiors as failed
      propagateStatusToInferiors( task.getInferiors(), newStatus);
    }
    if (!todoOk) {
      task.status = oldStatus;
      //console.debug("status rolled back: "+task.name + " to " + oldStatus);
    }

    return todoOk;
  }

  /**
   * A helper method to traverse an array of 'inferior' tasks
   * and signal a status change.
   */
  function propagateStatusToInferiors( infs, status) {
    for (var i = 0; i < infs.length; i++) {
      propagateStatus(infs[i].to, status, false, false, false);
    }
  }

  /**
   * A helper method to loop children and propagate new status
   */
  function propagateStatusToChildren(task, newStatus, skipClosedTasks) {
    var chds = task.getChildren();
    for (var i = 0; i < chds.length; i++)
      if (!(skipClosedTasks && chds[i].status == "STATUS_DONE") )
        propagateStatus(chds[i], newStatus, false, true, false);
  }


  var manuallyChanged=true;

  var oldStatus = this.status;
  //first call
  if (propagateStatus(this, newStatus, manuallyChanged, false, false)) {
    return true;
  } else {
    this.status = oldStatus;
    return false;
  }
};

Task.prototype.synchronizeStatus = function () {
  //console.debug("synchronizeStatus",this.name);
  var oldS = this.status;
  this.status = this.getParent()?this.getParent().status:"STATUS_UNDEFINED"; // di default si invalida lo stato mettendo quello del padre, in modo che inde/outd siano consistenti
  return this.changeStatus(oldS,true);
};

Task.prototype.isLocallyBlockedByDependencies = function () {
  var sups = this.getSuperiors();
  var blocked = false;
  for (var i = 0; i < sups.length; i++) {
    if (sups[i].from.status != "STATUS_DONE") {
      blocked = true;
      break;
    }
  }
  return blocked;
};

//<%---------- TASK STRUCTURE ---------------------- --%>
Task.prototype.getRow = function () {
  var ret = -1;
  if (this.master)
    ret = this.master.tasks.indexOf(this);
  return ret;
};


Task.prototype.getParents = function () {
  var ret;
  if (this.master) {
    var topLevel = this.level;
    var pos = this.getRow();
    ret = [];
    for (var i = pos; i >= 0; i--) {
      var par = this.master.tasks[i];
      if (topLevel > par.level) {
        topLevel = par.level;
        ret.push(par);
      }
    }
  }
  return ret;
};


Task.prototype.getParent = function () {
  var ret;
  if (this.master) {
    for (var i = this.getRow(); i >= 0; i--) {
      var par = this.master.tasks[i];
      if (this.level > par.level) {
        ret = par;
        break;
      }
    }
  }
  return ret;
};


Task.prototype.isParent = function () {
  var ret = false;
  if (this.master) {
    var pos = this.getRow();
    if (pos < this.master.tasks.length - 1)
      ret = this.master.tasks[pos + 1].level > this.level;
  }
  return ret;
};


Task.prototype.getChildren = function () {
  var ret = [];
  if (this.master) {
    var pos = this.getRow();
    for (var i = pos + 1; i < this.master.tasks.length; i++) {
      var ch = this.master.tasks[i];
      if (ch.level == this.level + 1)
        ret.push(ch);
      else if (ch.level <= this.level) // exit loop if parent or brother
        break;
    }
  }
  return ret;
};


Task.prototype.getDescendant = function () {
  var ret = [];
  if (this.master) {
    var pos = this.getRow();
    for (var i = pos + 1; i < this.master.tasks.length; i++) {
      var ch = this.master.tasks[i];
      if (ch.level > this.level)
        ret.push(ch);
      else
        break;
    }
  }
  return ret;
};


Task.prototype.getSuperiors = function () {
  var ret = [];
  var task = this;
  if (this.master) {
    ret = this.master.links.filter(function (link) {
      return link.to == task;
    });
  }
  return ret;
};

Task.prototype.getSuperiorTasks = function () {
  var ret = [];
  var sups = this.getSuperiors();
  for (var i = 0; i < sups.length; i++)
    ret.push(sups[i].from);
  return ret;
};


Task.prototype.getInferiors = function () {
  var ret = [];
  var task = this;
  if (this.master) {
    ret = this.master.links.filter(function (link) {
      return link.from == task;
    });
  }
  return ret;
};

Task.prototype.getInferiorTasks = function () {
  var ret = [];
  var infs = this.getInferiors();
  for (var i = 0; i < infs.length; i++)
    ret.push(infs[i].to);
  return ret;
};

Task.prototype.deleteTask = function () {
  //console.debug("deleteTask",this.name,this.master.deletedTaskIds)
  //if is the current one remove it
  if (this.master.currentTask && this.master.currentTask.id==this.id)
    delete this.master.currentTask;

  //delete both dom elements if exists
  if (this.rowElement)
    this.rowElement.remove();
  if (this.ganttElement)
    this.ganttElement.remove();

  //remove children
  var chd = this.getChildren();
  for (var i = 0; i < chd.length; i++) {
    //add removed child in list
    chd[i].deleteTask();
  }

  if (!this.isNew())
    this.master.deletedTaskIds.push(this.id);


  //remove from in-memory collection
  this.master.tasks.splice(this.getRow(), 1);

  //remove from links
  var task = this;
  this.master.links = this.master.links.filter(function (link) {
    return link.from != task && link.to != task;
  });
};


Task.prototype.isNew = function () {
  return (this.id + "").indexOf("tmp_") == 0;
};

Task.prototype.isDependent = function (t) {
  //console.debug("isDependent",this.name, t.name)
  var task = this;
  var dep = this.master.links.filter(function (link) {
    return link.from == task;
  });

  // is t a direct dependency?
  for (var i = 0; i < dep.length; i++) {
    if (dep[i].to == t)
      return true;
  }
  // is t an indirect dependency
  for (var i = 0; i < dep.length; i++) {
    if (dep[i].to.isDependent(t)) {
      return true;
    }
  }
  return false;
};

Task.prototype.setLatest = function (maxCost) {
  this.latestStart = maxCost - this.criticalCost;
  this.latestFinish = this.latestStart + this.duration;
};


//<%------------------------------------------  INDENT/OUTDENT --------------------------------%>
Task.prototype.indent = function () {
  //console.debug("indent", this);
  //a row above must exist
  var row = this.getRow();

  //no row no party
  if (row <= 0)
    return false;

  var ret = false;
  var taskAbove = this.master.tasks[row - 1];
  var newLev = this.level + 1;
  if (newLev <= taskAbove.level + 1) {
    ret = true;

    //trick to get parents after indent
    this.level++;
    var futureParents = this.getParents();
    this.level--;

    var oldLevel = this.level;
    for (var i = row; i < this.master.tasks.length; i++) {
      var desc = this.master.tasks[i];
      if (desc.level > oldLevel || desc == this) {
        desc.level++;
        //remove links from this and descendant to my parents
        this.master.links = this.master.links.filter(function (link) {
          var linkToParent = false;
          if (link.to == desc)
            linkToParent = futureParents.indexOf(link.from) >= 0;
          else if (link.from == desc)
            linkToParent = futureParents.indexOf(link.to) >= 0;
          return !linkToParent;
        });
        //remove links from this and descendants to predecessors of parents in order to avoid loop
        var predecessorsOfFutureParents=[];
        for (var j=0;j<futureParents.length;j++)
          predecessorsOfFutureParents=predecessorsOfFutureParents.concat(futureParents[j].getSuperiorTasks());

        this.master.links = this.master.links.filter(function (link) {
          var linkToParent = false;
          if (link.from == desc)
            linkToParent = predecessorsOfFutureParents.indexOf(link.to) >= 0;
          return !linkToParent;
        });


      } else
        break;
    }

    var parent = this.getParent();
    // set start date to parent' start if no deps
    if (parent && !this.depends) {
      var new_end = computeEndByDuration(parent.start, this.duration);
      this.master.changeTaskDates(this, parent.start, new_end);
    }


    //recompute depends string
    this.master.updateDependsStrings();
    //enlarge parent using a fake set period
    updateTree(this);
    //force status check starting from parent
    this.getParent().synchronizeStatus();
  }
  return ret;
};


Task.prototype.outdent = function () {
  //console.debug("outdent", this);

  //a level must be >1 -> cannot escape from root
  if (this.level <= 1)
    return false;

  var ret = false;
  var oldLevel = this.level;

  ret = true;
  var row = this.getRow();
  for (var i = row; i < this.master.tasks.length; i++) {
    var desc = this.master.tasks[i];
    if (desc.level > oldLevel || desc == this) {
      desc.level--;
    } else
      break;
  }

  var task = this;
  var chds = this.getChildren();
  //remove links from me to my new children
  this.master.links = this.master.links.filter(function (link) {
    var linkExist = (link.to == task && chds.indexOf(link.from) >= 0 || link.from == task && chds.indexOf(link.to) >= 0);
    return !linkExist;
  });


  //enlarge me if inherited children are larger
  for (var i = 0; i < chds.length; i++) {
    //remove links from me to my new children
    chds[i].setPeriod(chds[i].start + 1, chds[i].end + 1);
  }

  //recompute depends string
  this.master.updateDependsStrings();

  //enlarge parent using a fake set period
  this.setPeriod(this.start + 1, this.end + 1);

  //force status check
  this.synchronizeStatus();
  return ret;
};


//<%------------------------------------------  MOVE UP / MOVE DOWN --------------------------------%>
Task.prototype.moveUp = function () {
  //console.debug("moveUp", this);
  var ret = false;

  //a row above must exist
  var row = this.getRow();

  //no row no party
  if (row <= 0)
    return false;

  //find new row
  var newRow;
  for (newRow = row - 1; newRow >= 0; newRow--) {
    if (this.master.tasks[newRow].level <= this.level)
      break;
  }

  //is a parent or a brother
  if (this.master.tasks[newRow].level == this.level) {
    ret = true;
    //compute descendant
    var descNumber = 0;
    for (var i = row + 1; i < this.master.tasks.length; i++) {
      var desc = this.master.tasks[i];
      if (desc.level > this.level) {
        descNumber++;
      } else {
        break;
      }
    }
    //move in memory
    var blockToMove = this.master.tasks.splice(row, descNumber + 1);
    var top = this.master.tasks.splice(0, newRow);
    this.master.tasks = [].concat(top, blockToMove, this.master.tasks);
    //move on dom
    var rows = this.master.editor.element.find("tr[taskid]");
    var domBlockToMove = rows.slice(row, row + descNumber + 1);
    rows.eq(newRow).before(domBlockToMove);

    //recompute depends string
    this.master.updateDependsStrings();
  } else {
    this.master.setErrorOnTransaction(GanttMaster.messages["TASK_MOVE_INCONSISTENT_LEVEL"], this);
    ret = false;
  }
  return ret;
};


Task.prototype.moveDown = function () {
  //console.debug("moveDown", this);

  //a row below must exist, and cannot move root task
  var row = this.getRow();
  if (row >= this.master.tasks.length - 1 || row == 0)
    return false;

  var ret = false;

  //find nearest brother
  var newRow;
  for (newRow = row + 1; newRow < this.master.tasks.length; newRow++) {
    if (this.master.tasks[newRow].level <= this.level)
      break;
  }

  //is brother
  if (this.master.tasks[newRow] && this.master.tasks[newRow].level == this.level) {
    ret = true;
    //find last desc
    for (newRow = newRow + 1; newRow < this.master.tasks.length; newRow++) {
      if (this.master.tasks[newRow].level <= this.level)
        break;
    }

    //compute descendant
    var descNumber = 0;
    for (var i = row + 1; i < this.master.tasks.length; i++) {
      var desc = this.master.tasks[i];
      if (desc.level > this.level) {
        descNumber++;
      } else {
        break;
      }
    }

    //move in memory
    var blockToMove = this.master.tasks.splice(row, descNumber + 1);
    var top = this.master.tasks.splice(0, newRow - descNumber - 1);
    this.master.tasks = [].concat(top, blockToMove, this.master.tasks);


    //move on dom
    var rows = this.master.editor.element.find("tr[taskid]");
    var aft = rows.eq(newRow - 1);
    var domBlockToMove = rows.slice(row, row + descNumber + 1);
    aft.after(domBlockToMove);

    //recompute depends string
    this.master.updateDependsStrings();
  }

  return ret;
};


Task.prototype.canStatusBeChangedTo=function(newStatus) {
  //lo stato corrente è sempre ok
  if (newStatus==this.status)
    return true;

  var parent=this.getParent();

  //---------------------------------------------------------------------- STATUS_DONE ----------------------------------------------------------------
  // un task può essere STATUS_DONE se di root
  // se il suo padre non è fallito o undefined
  // se non ha previouses aperti
  if ("STATUS_DONE"==newStatus) {
    if (!parent )
      return true;

    if ("STATUS_FAILED"==parent.status || "STATUS_UNDEFINED"==parent.status)
      return false;

    var sups=this.getSuperiorTasks();
    for (var i=0;i<sups.length;i++) {
      if ("STATUS_DONE"!=sups[i].status) { // è un errore se un predecessore non è chiuso
        return false;
      }
    }
    return true;


    //---------------------------------------------------------------------- STATUS_ACTIVE ----------------------------------------------------------------
    //un task può essere STATUS_ACTIVE se l'eventuale padre è active e se tutti i predecessori sono in STATUS_DONE
  } else if ("STATUS_ACTIVE"==newStatus) {
    if (!parent )
      return true;

    if (!"STATUS_ACTIVE"==parent.status)
      return false;

    var sups=this.getSuperiorTasks();
    for (var i=0;i<sups.length;i++) {
      if ("STATUS_DONE"!=sups[i].status) { // è un errore se un predecessore non è chiuso
        return false;
      }
    }
    return true;


    //---------------------------------------------------------------------- STATUS_WAITING ----------------------------------------------------------------
    //un task può essere STATUS_WAITING solo se ha il padre o un predecessore STATUS_WAITING || un predecessore active STATUS_ACTIVE
  } else if ("STATUS_WAITING"==newStatus) {
    //un task può essere STATUS_WAITING solo se ha il padre
    if (!parent )
      return false;

    if ("STATUS_FAILED"==parent.status || "STATUS_UNDEFINED"==parent.status)
      return false;


    if ("STATUS_WAITING"==parent.status)
      return true;

    var sups=this.getSuperiorTasks();
    for (var i=0;i<sups.length;i++) {
      if ("STATUS_WAITING"==sups[i].status || "STATUS_ACTIVE"==sups[i].status) {
        return true;
      }
    }
    return false;


    //---------------------------------------------------------------------- STATUS_SUSPENDED ----------------------------------------------------------------
    //un task può essere is STATUS_SUSPENDED (a mano) se di root
    // se il parent è STATUS_ACTIVE o STATUS_SUSPENDED e se non
  } else if ("STATUS_SUSPENDED"==newStatus) {
    if (!parent )
      return true;

    if ("STATUS_UNDEFINED"==parent.status || "STATUS_FAILED"==parent.status)
      return false;

    return true;

    //---------------------------------------------------------------------- STATUS_FAILED ----------------------------------------------------------------
  } else if ("STATUS_FAILED"==newStatus) {
    //può essere in STATUS_FAILED sempre
    return true;

    //---------------------------------------------------------------------- STATUS_UNDEFINED ----------------------------------------------------------------
  } else if ("STATUS_UNDEFINED"==newStatus) {
    //può essere in STATUS_UNDEFINED sempre
    return true;
  }

  return false;
};


//<%------------------------------------------------------------------------  LINKS OBJECT ---------------------------------------------------------------%>
function Link(taskFrom, taskTo, lagInWorkingDays) {
  this.from = taskFrom;
  this.to = taskTo;
  this.lag = lagInWorkingDays;
}


//<%------------------------------------------------------------------------  ASSIGNMENT ---------------------------------------------------------------%>
function Assignment(id, resourceId, roleId, effort) {
  this.id = id;
  this.resourceId = resourceId;
  this.roleId = roleId;
  this.effort = effort;
}


//<%------------------------------------------------------------------------  RESOURCE ---------------------------------------------------------------%>
function Resource(id, name) {
  this.id = id;
  this.name = name;
}


//<%------------------------------------------------------------------------  ROLE ---------------------------------------------------------------%>
function Role(id, name) {
  this.id = id;
  this.name = name;
}

/*
 Copyright (c) 2012-2018 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

$.gridify = function (table, opt) {
  var options = {
    resizeZoneWidth: 10
  };

  $.extend(options, opt);

  var box = $("<div>").addClass("gdfWrapper");
  box.append(table);

  var head = table.clone();
  head.addClass("table ganttFixHead");
  //remove non head
  head.find("tbody").remove();
  box.append(head);

  box.append(table);

  var hTh = head.find(".gdfColHeader");
  var cTh = table.find(".gdfColHeader");
  for (var i = 0; i < hTh.length; i++) {
    hTh.eq(i).data("fTh", cTh.eq(i));
  }

  //--------- set table to 0 to prevent a strange 100%
  table.width(0);
  head.width(0);


  //----------------------  header management start
  head.find("th.gdfColHeader:not(.gdfied)").mouseover(function () {
    $(this).addClass("gdfColHeaderOver");

  }).on("mouseout.gdf", function () {
    $(this).removeClass("gdfColHeaderOver");
    if (!$.gridify.columInResize) {
      $("body").removeClass("gdfHResizing");
    }

  }).on("mousemove.gdf", function (e) {
    if (!$.gridify.columInResize) {
      var colHeader = $(this);
      var nextCol = colHeader.next();
      if (nextCol.length > 0 && nextCol.width() < options.resizeZoneWidth)
        colHeader = nextCol;

      if (!colHeader.is(".gdfResizable"))
        return;

      var mousePos = e.pageX - colHeader.offset().left;

      if (colHeader.width() - mousePos < options.resizeZoneWidth) {
        $("body").addClass("gdfHResizing");
      } else {
        $("body").removeClass("gdfHResizing");
      }
    }

  }).on("mousedown.gdf", function (e) {
    //console.debug("mousedown.gdf")
    var colHeader = $(this);

    var nextCol = colHeader.next();
    if (nextCol.length > 0 && nextCol.width() < options.resizeZoneWidth)
      colHeader = nextCol;

    if (!colHeader.is(".gdfResizable"))
      return;

    var mousePos = e.pageX - colHeader.offset().left;
    if (colHeader.width() - mousePos < options.resizeZoneWidth) {
      $("body").unselectable();
      $.gridify.columInResize = colHeader;
      //on event for start resizing
      $(document).on("mousemove.gdf", function (e) {

        e.preventDefault();
        $("body").addClass("gdfHResizing");

        //manage resizing
        var w = e.pageX - $.gridify.columInResize.offset().left;
        w = w <= 1 ? 1 : w;
        $.gridify.columInResize.width(w);
        $.gridify.columInResize.data("fTh").width(w);


        //on mouse up on body to stop resizing
      }).on("mouseup.gdf", function () {
        //console.debug("mouseup.gdf")
        $(this).off("mousemove.gdf").off("mouseup.gdf").clearUnselectable();
        $("body").removeClass("gdfHResizing");
        delete $.gridify.columInResize;

        //save columns dimension
        storeGridState();

      });
    }

  }).on("dblclick.gdf", function () {
    //console.debug("dblclick.gdf")
    var col = $(this);

    if (!col.is(".gdfResizable"))
      return;

    var idx = $("th", col.parents("table")).index(col);
    var columnTd = $("td:nth-child(" + (idx + 1) + ")", table);
    var w = 0;
    columnTd.each(function () {
      var td = $(this);
      var content = td.children("input").length ? td.children("input").val() : td.html();
      var tmp = $("<div/>").addClass("columnWidthTest").html(content).css({position: "absolute"});
      $("body").append(tmp);
      w = Math.max(w, tmp.width() + parseFloat(td.css("padding-left")));
      tmp.remove();
    });

    w = w + 5;
    col.width(w);
    col.data("fTh").width(w);

    //save columns dimension
    storeGridState();
    return false;

  }).addClass("gdfied unselectable").attr("unselectable", "true");


  function storeGridState() {
    //console.debug("storeGridState");
    if (localStorage) {
      var gridState = {};

      var colSizes = [];
      $(".gdfTable .gdfColHeader").each(function () {
        colSizes.push($(this).outerWidth());
      });

      gridState.colSizes = colSizes;

      localStorage.setObject("TWPGanttGridState", gridState);
    }
  }

  function loadGridState() {
    //console.debug("loadGridState")
    if (localStorage) {
      if (localStorage.getObject("TWPGanttGridState")) {
        var gridState = localStorage.getObject("TWPGanttGridState");
        if (gridState.colSizes) {
          box.find(".gdfTable .gdfColHeader").each(function (i) {
            $(this).width(gridState.colSizes[i]);
          });
        }
      }
    }
  }

  loadGridState();
  return box;
};




$.splittify = {
  init: function (where, first, second, perc) {

    //perc = perc || 50;

    var element = $("<div>").addClass("splitterContainer");
    var firstBox = $("<div>").addClass("splitElement splitBox1");
    var splitterBar = $("<div>").addClass("splitElement vSplitBar").attr("unselectable", "on").css("padding-top", where.height() / 2 + "px");
    var secondBox = $("<div>").addClass("splitElement splitBox2");


    var splitter = new Splitter(element, firstBox, secondBox, splitterBar);
    splitter.perc =  perc;

    //override with saved one
    loadPosition();

    var toLeft = $("<div>").addClass("toLeft").html("{").click(function () {splitter.resize(0.001, 300);});
    splitterBar.append(toLeft);

    var toCenter = $("<div>").addClass("toCenter").html("&#xa9;").click(function () {splitter.resize(50, 300);});
    splitterBar.append(toCenter);

    var toRight = $("<div>").addClass("toRight").html("}").click(function () {splitter.resize(99.9999, 300);});
    splitterBar.append(toRight);


    firstBox.append(first);
    secondBox.append(second);

    element.append(firstBox).append(secondBox).append(splitterBar);

    where.append(element);

    var totalW = where.innerWidth();
    var splW = splitterBar.width();
    var fbw = totalW * perc / 100 - splW;
    fbw = fbw > totalW - splW - splitter.secondBoxMinWidth ? totalW - splW - splitter.secondBoxMinWidth : fbw;
    firstBox.width(fbw).css({left: 0});
    splitterBar.css({left: firstBox.width()});
    secondBox.width(totalW - fbw - splW).css({left: firstBox.width() + splW});

    splitterBar.on("mousedown.gdf", function (e) {

      e.preventDefault();
      $("body").addClass("gdfHResizing");

      $.splittify.splitterBar = $(this);
      //on event for start resizing
      //console.debug("start splitting");
      $("body").unselectable().on("mousemove.gdf", function (e) {
        //manage resizing
        e.preventDefault();

        var sb = $.splittify.splitterBar;
        var pos = e.pageX - sb.parent().offset().left;
        var w = sb.parent().width();
        var fbw = firstBox;

        pos = pos > splitter.firstBoxMinWidth ? pos : splitter.firstBoxMinWidth;
        //pos = pos < realW - 10 ? pos : realW - 10;
        pos = pos > totalW - splW - splitter.secondBoxMinWidth ? totalW - splW - splitter.secondBoxMinWidth : pos;
        sb.css({left: pos});
        firstBox.width(pos);
        secondBox.css({left: pos + sb.width(), width: w - pos - sb.width()});
        splitter.perc = (firstBox.width() / splitter.element.width()) * 100;

        //on mouse up on body to stop resizing
      }).on("mouseup.gdf", function () {
        //console.debug("stop splitting");
        $(this).off("mousemove.gdf").off("mouseup.gdf").clearUnselectable();
        delete $.splittify.splitterBar;

        $("body").removeClass("gdfHResizing");

        storePosition();
      });
    });


    // keep both side in synch when scroll
    var stopScroll = false;
    var fs = firstBox.add(secondBox);
    var lastScrollTop=0;
    fs.scroll(function (e) {
      var el = $(this);
      var top = el.scrollTop();

      var firstBoxHeader = firstBox.find(".ganttFixHead");
      var secondBoxHeader = secondBox.find(".ganttFixHead");

      if (el.is(".splitBox1") && stopScroll != "splitBox2") {
        stopScroll = "splitBox1";
        secondBox.scrollTop(top);
      } else if (el.is(".splitBox2") && stopScroll != "splitBox1") {
        stopScroll = "splitBox2";
        firstBox.scrollTop(top);
      }


      if (Math.abs(top-lastScrollTop)>10) {
        firstBoxHeader.css('top', top).hide();
        secondBoxHeader.css('top', top).hide();
      }
      lastScrollTop=top;

      where.stopTime("reset").oneTime(100, "reset", function () {

        stopScroll = "";
        top = el.scrollTop();

        firstBoxHeader.css('top', top).fadeIn();
        secondBoxHeader.css('top', top).fadeIn();

      });

    });


    firstBox.on('mousewheel MozMousePixelScroll', function (event) {

      event.preventDefault();

      var deltaY = event.originalEvent.wheelDeltaY;
      if (!deltaY)
        deltaY = event.originalEvent.wheelDelta;
      var deltaX = event.originalEvent.wheelDeltaX;

      if (event.originalEvent.axis) {
        deltaY = event.originalEvent.axis == 2 ? -event.originalEvent.detail : null;
        deltaX = event.originalEvent.axis == 1 ? -event.originalEvent.detail : null;
      }

      deltaY = Math.abs(deltaY) < 40 ? 40 * (Math.abs(deltaY) / deltaY) : deltaY;
      deltaX = Math.abs(deltaX) < 40 ? 40 * (Math.abs(deltaX) / deltaX) : deltaX;

      var scrollToY = secondBox.scrollTop() - deltaY;
      var scrollToX = firstBox.scrollLeft() - deltaX;

//			console.debug( firstBox.scrollLeft(), Math.abs(deltaX), Math.abs(deltaY));

      if (deltaY) secondBox.scrollTop(scrollToY);
      if (deltaX) firstBox.scrollLeft(scrollToX);

      return false;
    });


    function Splitter(element, firstBox, secondBox, splitterBar) {
      this.element = element;
      this.firstBox = firstBox;
      this.secondBox = secondBox;
      this.splitterBar = splitterBar;
      this.perc = 0;
      this.firstBoxMinWidth = 0;
      this.secondBoxMinWidth = 30;

      this.resize = function (newPerc, anim) {
        var animTime = anim ? anim : 0;
        this.perc = newPerc ? newPerc : this.perc;
        var totalW = this.element.width();
        var splW = this.splitterBar.width();
        var newW = totalW * this.perc / 100;
        newW = newW > this.firstBoxMinWidth ? newW : this.firstBoxMinWidth;
        newW = newW > totalW - splW - splitter.secondBoxMinWidth ? totalW - splW - splitter.secondBoxMinWidth : newW;
        this.firstBox.animate({width: newW}, animTime, function () {$(this).css("overflow-x", "auto")});
        this.splitterBar.animate({left: newW}, animTime);
        this.secondBox.animate({left: newW + this.splitterBar.width(), width: totalW - newW - splW}, animTime, function () {$(this).css("overflow", "auto")});

        storePosition();
      };

      var self = this;
      this.splitterBar.on("dblclick", function () {
        self.resize(50, true);
      })
    }


    function storePosition () {
      //console.debug("storePosition",splitter.perc);
      if (localStorage) {
        localStorage.setItem("TWPGanttSplitPos",splitter.perc);
      }
    }

    function loadPosition () {
      //console.debug("loadPosition");
      if (localStorage) {
        if (localStorage.getItem("TWPGanttSplitPos")) {
          splitter.perc=parseFloat(localStorage.getItem("TWPGanttSplitPos"));
        }
      }
    }



    return splitter;
  }

};


//<%------------------------------------------------------------------------  UTILITIES ---------------------------------------------------------------%>
// same dates returns 1
function getDurationInUnits(start,end){
  return start.distanceInWorkingDays(end)+1; // working in days
}

//con due date uguali ritorna 0: usata per cancolare la distanza effettiva tra due date
function getDistanceInUnits(date1,date2){
  return date1.distanceInWorkingDays(date2); // working in days
}

function incrementDateByUnits(date,duration){
  date.incrementDateByWorkingDays(duration); // working in days
  return date;
}


function computeStart(start) {
  return computeStartDate(start).getTime();
}

/**
 * @param start
 * @returns {Date} the closes start date
 */
function computeStartDate(start) {
  var d;
  d = new Date(start + 3600000 * 12);
  d.setHours(0, 0, 0, 0);
  //move to next working day
  while (isHoliday(d)) {
    d.setDate(d.getDate() + 1);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function computeEnd(end) {
  return computeEndDate(end).getTime()
}

/**
 * @param end
 * @returns {Date} the closest end date
 */
function computeEndDate(end) {
  var d = new Date(end - 3600000 * 12);
  d.setHours(23, 59, 59, 999);
  //move to next working day
  while (isHoliday(d)) {
    d.setDate(d.getDate() + 1);
  }
  d.setHours(23, 59, 59, 999);
  return d;
}

function computeEndByDuration(start, duration) {
//console.debug("computeEndByDuration start ",d,duration)
  var d = new Date(start);
  var q = duration - 1;
  while (q > 0) {
    d.setDate(d.getDate() + 1);
    if (!isHoliday(d))
      q--;
  }
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}


function incrementDateByWorkingDays(date, days) {
  var d = new Date(date);
  d.incrementDateByWorkingDays(days);
  return d.getTime();
}


function recomputeDuration(start, end) {
  //console.debug("recomputeDuration");
  return getDurationInUnits(new Date(start),new Date(end));
}

function resynchDates(leavingField, startField, startMilesField, durationField, endField, endMilesField) {
  //console.debug("resynchDates",leavingField.prop("name"), "start. "+startField.val(),"durationField: "+ durationField.val(), "endField: "+endField.val());

  function resynchDatesSetFields(command) {
    //console.debug("resynchDatesSetFields",command);
    var duration = stringToDuration(durationField.val());
    var start = computeStart(Date.parseString(startField.val()).getTime());

    var end = endField.val();
    if (end.length > 0) {
      end = Date.parseString(end);
      end.setHours(23, 59, 59, 999); //this is necessary because compute end get the closest end, and parseString returns 00:00
      end = computeEnd(end.getTime());
    }

    var date = new Date();
    if ("CHANGE_END" == command) {
      date.setTime(start);
      var workingUnits = duration-1; // if we do not decremet a task lasting two days starting on 10 will end on 12 (at 00:00) instead of on (at 23:59)
      incrementDateByUnits(date,workingUnits);
      date.setHours(23, 59, 59, 999); //this is necessary because compute end get the closest end, and parseString returns 00:00
      end = computeEnd(date.getTime()); // not strictly necessary
    } else if ("CHANGE_START" == command) {
      date.setTime(end);
      var workingUnits = duration - 1; // if we do not decremet a task lasting two days starting on 10 will end on 12 (at 00:00) instead of on (at 23:59)
      incrementDateByUnits(date,-workingUnits);
      date.setHours(0, 0, 0, 0); //this is necessary because decreasing end we are at 23:50
      start = computeStart(date.getTime()); //not strictly necessary
    } else if ("CHANGE_DURATION" == command) {
      duration = getDurationInUnits(new Date(start),new Date(end)) + 1;
    }

    startField.val(new Date(start).format());
    endField.val(new Date(end).format());
    durationField.val(durationToString(duration));

    return {start: start, end: end, duration: duration};
  }

  var leavingFieldName = leavingField.prop("name");
  var durIsFilled = durationField.val().length > 0;
  var startIsFilled = startField.val().length > 0;
  var endIsFilled = endField.val().length > 0;
  var startIsMilesAndFilled = startIsFilled && (startMilesField.prop("checked") || startField.is("[readOnly]"));
  var endIsMilesAndFilled = endIsFilled && (endMilesField.prop("checked") || endField.is("[readOnly]"));

  if (durIsFilled) {
    durationField.val(durationToString(stringToDuration(durationField.val())));
  }

  if (leavingFieldName.indexOf("Milestone") > 0) {
    if (startIsMilesAndFilled && endIsMilesAndFilled) {
      durationField.prop("readOnly", true);
    } else {
      durationField.prop("readOnly", false);
    }
    return;
  }

  //need at least two values to resynch the third
  if ((durIsFilled ? 1 : 0) + (startIsFilled ? 1 : 0) + (endIsFilled ? 1 : 0) < 2)
    return;

  var ret;
  if (leavingFieldName == 'start' && startIsFilled) {
    if (endIsMilesAndFilled && durIsFilled) {
      ret = resynchDatesSetFields("CHANGE_DURATION");
    } else if (durIsFilled) {
      ret = resynchDatesSetFields("CHANGE_END");
    }

  } else if (leavingFieldName == 'duration' && durIsFilled && !(endIsMilesAndFilled && startIsMilesAndFilled)) {
    if (endIsMilesAndFilled && !startIsMilesAndFilled) {
      ret = resynchDatesSetFields("CHANGE_START");
    } else if (!endIsMilesAndFilled) {
      //document.title=('go and change end!!');
      ret = resynchDatesSetFields("CHANGE_END");
    }

  } else if (leavingFieldName == 'end' && endIsFilled) {
    ret = resynchDatesSetFields("CHANGE_DURATION");
  }
  return ret;
}


//This prototype is provided by the Mozilla foundation and
//is distributed under the MIT license.
//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license

if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun) {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }
    return res;
  };
}

function durationToString(d) {
  return d;
}

function stringToDuration(durStr) {
  var duration = NaN;
  duration = daysFromString(durStr, true) || 1;
  return duration;
}

function goToPage(url) {
  if (!canILeave()) return;
  window.location.href = url;
}

/*
 Copyright (c) 2012-2017 Open Lab
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


function dateToRelative(localTime){
  var diff=new Date().getTime()-localTime;
  var ret="";

  var min=60000;
  var hour=3600000;
  var day=86400000;
  var wee=604800000;
  var mon=2629800000;
  var yea=31557600000;

  if (diff<-yea*2)
    ret ="in ## years".replace("##",(-diff/yea).toFixed(0));

  else if (diff<-mon*9)
    ret ="in ## months".replace("##",(-diff/mon).toFixed(0));

  else if (diff<-wee*5)
    ret ="in ## weeks".replace("##",(-diff/wee).toFixed(0));

  else if (diff<-day*2)
    ret ="in ## days".replace("##",(-diff/day).toFixed(0));

  else if (diff<-hour)
    ret ="in ## hours".replace("##",(-diff/hour).toFixed(0));

  else if (diff<-min*35)
    ret ="in about one hour";

  else if (diff<-min*25)
    ret ="in about half hour";

  else if (diff<-min*10)
    ret ="in some minutes";

  else if (diff<-min*2)
    ret ="in few minutes";

  else if (diff<=min)
    ret ="just now";

  else if (diff<=min*5)
    ret ="few minutes ago";

  else if (diff<=min*15)
    ret ="some minutes ago";

  else if (diff<=min*35)
    ret ="about half hour ago";

  else if (diff<=min*75)
    ret ="about an hour ago";

  else if (diff<=hour*5)
    ret ="few hours ago";

  else if (diff<=hour*24)
    ret ="## hours ago".replace("##",(diff/hour).toFixed(0));

  else if (diff<=day*7)
    ret ="## days ago".replace("##",(diff/day).toFixed(0));

  else if (diff<=wee*5)
    ret ="## weeks ago".replace("##",(diff/wee).toFixed(0));

  else if (diff<=mon*12)
    ret ="## months ago".replace("##",(diff/mon).toFixed(0));

  else
    ret ="## years ago".replace("##",(diff/yea).toFixed(0));

  return ret;
}

//override date format i18n

Date.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// Month abbreviations. Change this for local month names
Date.monthAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// Full day names. Change this for local month names
Date.dayNames =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// Day abbreviations. Change this for local month names
Date.dayAbbreviations = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// Used for parsing ambiguous dates like 1/2/2000 - default to preferring 'American' format meaning Jan 2.
// Set to false to prefer 'European' format meaning Feb 1
Date.preferAmericanFormat = false;

Date.firstDayOfWeek =0;
Date.defaultFormat = "M/d/yyyy";
Date.masks = {
  fullDate:       "EEEE, MMMM d, yyyy",
  shortTime:      "h:mm a"
};
Date.today="Today";

Number.decimalSeparator = ".";
Number.groupingSeparator = ",";
Number.minusSign = "-";
Number.currencyFormat = "###,##0.00";



var millisInWorkingDay =28800000;
var workingDaysPerWeek =5;

function isHoliday(date) {
  var friIsHoly =false;
  var satIsHoly =true;
  var sunIsHoly =true;

  var pad = function (val) {
    val = "0" + val;
    return val.substr(val.length - 2);
  };

  var holidays = "##";

  var ymd = "#" + date.getFullYear() + "_" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
  var md = "#" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
  var day = date.getDay();

  return  (day == 5 && friIsHoly) || (day == 6 && satIsHoly) || (day == 0 && sunIsHoly) || holidays.indexOf(ymd) > -1 || holidays.indexOf(md) > -1;
}



var i18n = {
  YES:                 "Yes",
  NO:                  "No",
  FLD_CONFIRM_DELETE:  "confirm the deletion?",
  INVALID_DATA:        "The data inserted are invalid for the field format.",
  ERROR_ON_FIELD:      "Error on field",
  OUT_OF_BOUDARIES:      "Out of field admitted values:",
  CLOSE_ALL_CONTAINERS:"close all?",
  DO_YOU_CONFIRM:      "Do you confirm?",
  ERR_FIELD_MAX_SIZE_EXCEEDED:      "Field max size exceeded",
  WEEK_SHORT:      "W.",

  FILE_TYPE_NOT_ALLOWED:"File type not allowed.",
  FILE_UPLOAD_COMPLETED:"File upload completed.",
  UPLOAD_MAX_SIZE_EXCEEDED:"Max file size exceeded",
  ERROR_UPLOADING:"Error uploading",
  UPLOAD_ABORTED:"Upload aborted",
  DROP_HERE:"Drop files here",

  FORM_IS_CHANGED:     "You have some unsaved data on the page!",

  PIN_THIS_MENU: "PIN_THIS_MENU",
  UNPIN_THIS_MENU: "UNPIN_THIS_MENU",
  OPEN_THIS_MENU: "OPEN_THIS_MENU",
  CLOSE_THIS_MENU: "CLOSE_THIS_MENU",
  PROCEED: "Proceed?",

  PREV: "Previous",
  NEXT: "Next",
  HINT_SKIP: "Got it, close this hint.",

  WANT_TO_SAVE_FILTER: "save this filter",
  NEW_FILTER_NAME: "name of the new filter",
  SAVE: "Save",
  DELETE: "Delete",
  HINT_SKIP: "Got it, close this hint.",

  COMBO_NO_VALUES: "no values available...?",

  FILTER_UPDATED:"Filter updated.",
  FILTER_SAVED:"Filter correctly saved."

};

//date.js
/**
 * Copyright (c)2005-2009 Matt Kruse (javascripttoolbox.com)
 * Dual licensed under the MIT and GPL licenses.
 * This basically means you can use this code however you want for
 */
/*
Date functions

These functions are used to parse, format, and manipulate Date objects.
See documentation and examples at http://www.JavascriptToolbox.com/lib/date/

*/
Date.$VERSION = 1.02;

// Utility function to append a 0 to single-digit numbers
Date.LZ = function(x) {return(x<0||x>9?"":"0")+x};
// Full month names. Change this for local month names
Date.monthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
// Month abbreviations. Change this for local month names
Date.monthAbbreviations = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
// Full day names. Change this for local month names
Date.dayNames = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
// Day abbreviations. Change this for local month names
Date.dayAbbreviations = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
// Used for parsing ambiguous dates like 1/2/2000 - default to preferring 'American' format meaning Jan 2.
// Set to false to prefer 'European' format meaning Feb 1
Date.preferAmericanFormat = true;

// Set to 0=SUn for American 1=Mon for european
Date.firstDayOfWeek = 0;

//default
Date.defaultFormat="dd/MM/yyyy";

// If the getFullYear() method is not defined, create it
if (!Date.prototype.getFullYear) {
  Date.prototype.getFullYear = function() { var yy=this.getYear(); return (yy<1900?yy+1900:yy); } ;
}

// Parse a string and convert it to a Date object.
// If no format is passed, try a list of common formats.
// If string cannot be parsed, return null.
// Avoids regular expressions to be more portable.
Date.parseString = function(val, format,lenient) {
  // If no format is specified, try a few common formats
  if (typeof(format)=="undefined" || format==null || format=="") {
    var generalFormats=new Array(Date.defaultFormat,'y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d','MMM-d','d-MMM');
    var monthFirst=new Array('M/d/y','M-d-y','M.d.y','M/d','M-d');
    var dateFirst =new Array('d/M/y','d-M-y','d.M.y','d/M','d-M');
    var checkList=new Array(generalFormats,Date.preferAmericanFormat?monthFirst:dateFirst,Date.preferAmericanFormat?dateFirst:monthFirst);
    for (var i=0; i<checkList.length; i++) {
      var l=checkList[i];
      for (var j=0; j<l.length; j++) {
        var d=Date.parseString(val,l[j]);
        if (d!=null) {
          return d;
        }
      }
    }
    return null;
  };

  this.isInteger = function(val) {
    for (var i=0; i < val.length; i++) {
      if ("1234567890".indexOf(val.charAt(i))==-1) {
        return false;
      }
    }
    return true;
  };
  this.getInt = function(str,i,minlength,maxlength) {
    for (var x=maxlength; x>=minlength; x--) {
      var token=str.substring(i,i+x);
      if (token.length < minlength) {
        return null;
      }
      if (this.isInteger(token)) {
        return token;
      }
    }
    return null;
  };




  this.decodeShortcut=function(str){
    str=str?str:""; // just in case
    var dateUpper = str.trim().toUpperCase();
    var ret=new Date();
    ret.clearTime();

    if (["NOW","N"].indexOf(dateUpper)>=0) {
      ret= new Date();

    } else if (["TODAY","T"].indexOf(dateUpper)>=0) {
      //do nothing

    } else if (["YESTERDAY","Y"].indexOf(dateUpper)>=0) {
      ret.setDate(ret.getDate()-1);

    } else if (["TOMORROW","TO"].indexOf(dateUpper)>=0) {
      ret.setDate(ret.getDate()+1);

    } else if (["W", "TW", "WEEK", "THISWEEK", "WEEKSTART", "THISWEEKSTART"].indexOf(dateUpper)>=0) {
      ret.setFirstDayOfThisWeek();

    } else if (["LW", "LASTWEEK", "LASTWEEKSTART"].indexOf(dateUpper)>=0) {
      ret.setFirstDayOfThisWeek();
      ret.setDate(ret.getDate()-7);

    } else if (["NW", "NEXTWEEK", "NEXTWEEKSTART"].indexOf(dateUpper)>=0) {
      ret.setFirstDayOfThisWeek();
      ret.setDate(ret.getDate()+7);

    } else if (["M", "TM", "MONTH", "THISMONTH", "MONTHSTART", "THISMONTHSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);

    } else if (["LM", "LASTMONTH", "LASTMONTHSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);
      ret.setMonth(ret.getMonth()-1);

    } else if (["NM", "NEXTMONTH", "NEXTMONTHSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);
      ret.setMonth(ret.getMonth()+1);

    } else if (["Q", "TQ", "QUARTER", "THISQUARTER", "QUARTERSTART", "THISQUARTERSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);
      ret.setMonth(Math.floor((ret.getMonth()) / 3) * 3);

    } else if (["LQ", "LASTQUARTER", "LASTQUARTERSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);
      ret.setMonth(Math.floor((ret.getMonth()) / 3) * 3-3);

    } else if (["NQ", "NEXTQUARTER", "NEXTQUARTERSTART"].indexOf(dateUpper)>=0) {
      ret.setDate(1);
      ret.setMonth(Math.floor((ret.getMonth()) / 3) * 3+3);


    } else if (/^-?[0-9]+[DWMY]$/.test(dateUpper)) {
      var lastOne = dateUpper.substr(dateUpper.length - 1);
      var val = parseInt(dateUpper.substr(0, dateUpper.length - 1));
      if (lastOne=="W")
        ret.setDate(ret.getDate()+val*7 );
      else if (lastOne=="M")
        ret.setMonth(ret.getMonth()+val );
      else if (lastOne=="Y")
        ret.setYear(ret.getYear()+val );
    } else {
      ret=undefined;
    }

    return ret;
  };

  var ret=this.decodeShortcut(val);
  if (ret)
    return ret;

  this._getDate = function(val, format) {
    val = val + "";
    format = format + "";
    var i_val = 0;
    var i_format = 0;
    var c = "";
    var token = "";
    var token2 = "";
    var x,y;
    var year = new Date().getFullYear();
    var month = 1;
    var date = 1;
    var hh = 0;
    var mm = 0;
    var ss = 0;
    var ampm = "";
    while (i_format < format.length) {
      // Get next token from format string
      c = format.charAt(i_format);
      token = "";
      while ((format.charAt(i_format) == c) && (i_format < format.length)) {
        token += format.charAt(i_format++);
      }
      // Extract contents of value based on format token
      if (token == "yyyy" || token == "yy" || token == "y") {
        if (token == "yyyy") {
          x = 4;
          y = 4;
        }
        if (token == "yy") {
          x = 2;
          y = 2;
        }
        if (token == "y") {
          x = 2;
          y = 4;
        }
        year = this.getInt(val, i_val, x, y);
        if (year == null) {
          return null;
        }
        i_val += year.length;
        if (year.length == 2) {
          if (year > 70) {
            year = 1900 + (year - 0);
          }
          else {
            year = 2000 + (year - 0);
          }
        }

        //		} else if (token=="MMM" || token=="NNN"){
      } else if (token == "MMM" || token == "MMMM") {
        month = 0;
        var names = (token == "MMMM" ? (Date.monthNames.concat(Date.monthAbbreviations)) : Date.monthAbbreviations);
        for (var i = 0; i < names.length; i++) {
          var month_name = names[i];
          if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
            month = (i % 12) + 1;
            i_val += month_name.length;
            break;
          }
        }
        if ((month < 1) || (month > 12)) {
          return null;
        }
      } else if (token == "E" || token == "EE" || token == "EEE" || token == "EEEE") {
        var names = (token == "EEEE" ? Date.dayNames : Date.dayAbbreviations);
        for (var i = 0; i < names.length; i++) {
          var day_name = names[i];
          if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
            i_val += day_name.length;
            break;
          }
        }
      } else if (token == "MM" || token == "M") {
        month = this.getInt(val, i_val, token.length, 2);
        if (month == null || (month < 1) || (month > 12)) {
          return null;
        }
        i_val += month.length;
      } else if (token == "dd" || token == "d") {
        date = this.getInt(val, i_val, token.length, 2);
        if (date == null || (date < 1) || (date > 31)) {
          return null;
        }
        i_val += date.length;
      } else if (token == "hh" || token == "h") {
        hh = this.getInt(val, i_val, token.length, 2);
        if (hh == null || (hh < 1) || (hh > 12)) {
          return null;
        }
        i_val += hh.length;
      } else if (token == "HH" || token == "H") {
        hh = this.getInt(val, i_val, token.length, 2);
        if (hh == null || (hh < 0) || (hh > 23)) {
          return null;
        }
        i_val += hh.length;
      } else if (token == "KK" || token == "K") {
        hh = this.getInt(val, i_val, token.length, 2);
        if (hh == null || (hh < 0) || (hh > 11)) {
          return null;
        }
        i_val += hh.length;
        hh++;
      } else if (token == "kk" || token == "k") {
        hh = this.getInt(val, i_val, token.length, 2);
        if (hh == null || (hh < 1) || (hh > 24)) {
          return null;
        }
        i_val += hh.length;
        hh--;
      } else if (token == "mm" || token == "m") {
        mm = this.getInt(val, i_val, token.length, 2);
        if (mm == null || (mm < 0) || (mm > 59)) {
          return null;
        }
        i_val += mm.length;
      } else if (token == "ss" || token == "s") {
        ss = this.getInt(val, i_val, token.length, 2);
        if (ss == null || (ss < 0) || (ss > 59)) {
          return null;
        }
        i_val += ss.length;
      } else if (token == "a") {
        if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
          ampm = "AM";
        } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
          ampm = "PM";
        } else {
          return null;
        }
        i_val += 2;
      } else {
        if (val.substring(i_val, i_val + token.length) != token) {
          return null;
        } else {
          i_val += token.length;
        }
      }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) {
      return null;
    }
    // Is date valid for month?
    if (month == 2) {
      // Check for leap year
      if (( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)) { // leap year
        if (date > 29) {
          return null;
        }
      } else {
        if (date > 28) {
          return null;
        }
      }
    }
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
      if (date > 30) {
        return null;
      }
    }
    // Correct hours value
    if (hh < 12 && ampm == "PM") {
      hh = hh - 0 + 12;
    }
    else if (hh > 11 && ampm == "AM") {
      hh -= 12;
    }
    return new Date(year, month - 1, date, hh, mm, ss);
  };

  var theDate=this._getDate(val, format);
  if (!theDate && lenient){
    //try with short format
    var f=format.replace("MMMM","M").replace("MMM","M").replace("MM","M")
      .replace("yyyy","y").replace("yyy","y").replace("yy","y")
      .replace("dd","d");
    //console.debug("second round with format "+f);
    return this._getDate(val, f);
  } else {
    return theDate;
  }

};

// Check if a date string is valid
Date.isValid = function(val,format,lenient) {
  return (Date.parseString(val,format,lenient) != null);
};

// Check if a date object is before another date object
Date.prototype.isBefore = function(date2) {
  if (date2==null) {
    return false;
  }
  return (this.getTime()<date2.getTime());
};

// Check if a date object is after another date object
Date.prototype.isAfter = function(date2) {
  if (date2==null) {
    return false;
  }
  return (this.getTime()>date2.getTime());
};

Date.prototype.isOutOfRange = function (minDate, maxDate) {

  minDate = minDate || this;
  maxDate = maxDate || this;

  if(typeof minDate == "string")
    minDate = Date.parseString(minDate);

  if(typeof maxDate == "string")
    maxDate = Date.parseString(maxDate);


  /*
   console.debug("date:: ", this);
   console.debug("minDate:: ", minDate);
   console.debug("maxDate:: ", maxDate);
   console.debug("isDisabled:: ", this.isBefore(minDate) , this.isAfter(maxDate));
   */

  return (this.isBefore(minDate) || this.isAfter(maxDate));
};

// Check if two date objects have equal dates and times
Date.prototype.equals = function(date2) {
  if (date2==null) {
    return false;
  }
  return (this.getTime()==date2.getTime());
};

// Check if two date objects have equal dates, disregarding times
Date.prototype.equalsIgnoreTime = function(date2) {
  if (date2==null) {
    return false;
  }
  var d1 = new Date(this.getTime()).clearTime();
  var d2 = new Date(date2.getTime()).clearTime();
  return (d1.getTime()==d2.getTime());
};

/**
 * Get week number in the year.
 */
Date.prototype.getWeekNumber = function() {
  var d = new Date(+this);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate()+4-(d.getDay()||7));
  return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

// Format a date into a string using a given format string
Date.prototype.format = function(format) {
  if (!format)
    format=Date.defaultFormat;
  format=format+"";
  var result="";
  var i_format=0;
  var c="";
  var token="";
  var y=this.getFullYear()+"";
  var M=this.getMonth()+1;
  var d=this.getDate();
  var E=this.getDay();
  var H=this.getHours();
  var m=this.getMinutes();
  var s=this.getSeconds();
  var w=this.getWeekNumber();
  // Convert real date parts into formatted versions
  var value=new Object();
  if (y.length < 4) {
    y=""+(+y+1900);
  }
  value["y"]=""+y;
  value["yyyy"]=y;
  value["yy"]=y.substring(2,4);
  value["M"]=M;
  value["MM"]=Date.LZ(M);
  value["MMM"]=Date.monthAbbreviations[M-1];
  value["MMMM"]=Date.monthNames[M-1];
  value["d"]=d;
  value["dd"]=Date.LZ(d);
  value["E"]=Date.dayAbbreviations[E];
  value["EE"]=Date.dayAbbreviations[E];
  value["EEE"]=Date.dayAbbreviations[E];
  value["EEEE"]=Date.dayNames[E];
  value["H"]=H;
  value["HH"]=Date.LZ(H);
  value["w"]=w;
  value["ww"]=Date.LZ(w);
  if (H==0){
    value["h"]=12;
  }
  else if (H>12){
    value["h"]=H-12;
  }
  else {
    value["h"]=H;
  }
  value["hh"]=Date.LZ(value["h"]);
  value["K"]=value["h"]-1;
  value["k"]=value["H"]+1;
  value["KK"]=Date.LZ(value["K"]);
  value["kk"]=Date.LZ(value["k"]);
  if (H > 11) {
    value["a"]="PM";
  }
  else {
    value["a"]="AM";
  }
  value["m"]=m;
  value["mm"]=Date.LZ(m);
  value["s"]=s;
  value["ss"]=Date.LZ(s);
  while (i_format < format.length) {
    c=format.charAt(i_format);
    token="";
    while ((format.charAt(i_format)==c) && (i_format < format.length)) {
      token += format.charAt(i_format++);
    }
    if (typeof(value[token])!="undefined") {
      result=result + value[token];
    }
    else {
      result=result + token;
    }
  }
  return result;
};

// Get the full name of the day for a date
Date.prototype.getDayName = function() {
  return Date.dayNames[this.getDay()];
};

// Get the abbreviation of the day for a date
Date.prototype.getDayAbbreviation = function() {
  return Date.dayAbbreviations[this.getDay()];
};

// Get the full name of the month for a date
Date.prototype.getMonthName = function() {
  return Date.monthNames[this.getMonth()];
};

// Get the abbreviation of the month for a date
Date.prototype.getMonthAbbreviation = function() {
  return Date.monthAbbreviations[this.getMonth()];
};

// Clear all time information in a date object
Date.prototype.clearTime = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  this.setMilliseconds(0);
  return this;
};

// Add an amount of time to a date. Negative numbers can be passed to subtract time.
Date.prototype.add = function(interval, number) {
  if (typeof(interval)=="undefined" || interval==null || typeof(number)=="undefined" || number==null) {
    return this;
  }
  number = +number;
  if (interval=='y') { // year
    this.setFullYear(this.getFullYear()+number);
  } else if (interval=='M') { // Month
    this.setMonth(this.getMonth()+number);
  }	else if (interval=='d') { // Day
    this.setDate(this.getDate()+number);
  }	else if (interval=='w') { // Week
    this.setDate(this.getDate()+number*7);
  }	else if (interval=='h') { // Hour
    this.setHours(this.getHours() + number);
  }	else if (interval=='m') { // Minute
    this.setMinutes(this.getMinutes() + number);
  }	else if (interval=='s') { // Second
    this.setSeconds(this.getSeconds() + number);
  }
  return this;

};

Date.prototype.toInt = function () {
  return this.getFullYear()*10000+(this.getMonth()+1)*100+this.getDate();
};

Date.fromInt=function (dateInt){
  var year = parseInt(dateInt/10000);
  var month = parseInt((dateInt-year*10000)/100);
  var day = parseInt(dateInt-year*10000-month*100);
  return new Date(year,month-1,day,12,0,0);
};


Date.prototype.isHoliday=function(){
  return isHoliday(this);
};

Date.prototype.isToday=function(){
  return this.toInt()==new Date().toInt();
};


Date.prototype.incrementDateByWorkingDays=function (days) {
  //console.debug("incrementDateByWorkingDays start ",d,days)
  var q = Math.abs(days);
  while (q > 0) {
    this.setDate(this.getDate() + (days > 0 ? 1 : -1));
    if (!this.isHoliday())
      q--;
  }
  return this;
};


Date.prototype.distanceInDays= function (toDate){
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
  var utc2 = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.floor((utc2 - utc1) / (3600000*24));
};

//low performances in case of long distance
/*Date.prototype.distanceInWorkingDays= function (toDate){
  var pos = new Date(this.getTime());
  pos.setHours(23, 59, 59, 999);
  var days = 0;
  var nd=new Date(toDate.getTime());
  nd.setHours(23, 59, 59, 999);
  var end=nd.getTime();
  while (pos.getTime() <= end) {
    days = days + (isHoliday(pos) ? 0 : 1);
    pos.setDate(pos.getDate() + 1);
  }
  return days;
};*/

//low performances in case of long distance
// bicch 22/4/2016: modificato per far ritornare anche valori negativi, così come la controparte Java in CompanyCalendar.
// attenzione che prima tornava 1 per due date uguali adesso torna 0
Date.prototype.distanceInWorkingDays= function (toDate){
  var pos = new Date(Math.min(this,toDate));
  pos.setHours(12, 0, 0, 0);
  var days = 0;
  var nd=new Date(Math.max(this,toDate));
  nd.setHours(12, 0,0, 0);
  while (pos < nd) {
    days = days + (isHoliday(pos) ? 0 : 1);
    pos.setDate(pos.getDate() + 1);
  }
  days=days*(this>toDate?-1:1);

  //console.debug("distanceInWorkingDays",this,toDate,days);
  return days;
};

Date.prototype.setFirstDayOfThisWeek= function (firstDayOfWeek){
  if (!firstDayOfWeek)
    firstDayOfWeek=Date.firstDayOfWeek;
  this.setDate(this.getDate() - this.getDay() +firstDayOfWeek - (this.getDay()==0 && firstDayOfWeek!=0 ?7:0));
  return this;
};


/* ----- millis format --------- */
/**
 * @param         str         - Striga da riempire
 * @param         len         - Numero totale di caratteri, comprensivo degli "zeri"
 * @param         ch          - Carattere usato per riempire
 */

function pad(str, len, ch) {
  if ((str + "").length < len) {
    return new Array(len - ('' + str).length + 1).join(ch) + str;
  } else {
    return str
  }
}

function getMillisInHours(millis) {
  if (!millis)
    return "";
  var hour = Math.floor(millis / 3600000);
  return  ( millis >= 0 ? "" : "-") + pad(hour, 1, "0");
}
function getMillisInHoursMinutes(millis) {
  if (typeof(millis) != "number")
    return "";

  var sgn = millis >= 0 ? 1 : -1;
  millis = Math.abs(millis);
  var hour = Math.floor(millis / 3600000);
  var min = Math.floor((millis % 3600000) / 60000);
  return  (sgn > 0 ? "" : "-") + pad(hour, 1, "0") + ":" + pad(min, 2, "0");
}

function getMillisInDaysHoursMinutes(millis) {
  if (!millis)
    return "";
  // millisInWorkingDay is set on partHeaderFooter
  var sgn = millis >= 0 ? 1 : -1;
  millis = Math.abs(millis);
  var days = Math.floor(millis / millisInWorkingDay);
  var hour = Math.floor((millis % millisInWorkingDay) / 3600000);
  var min = Math.floor((millis - days * millisInWorkingDay - hour * 3600000) / 60000);
  return (sgn >= 0 ? "" : "-") + (days > 0 ? days + "  " : "") + pad(hour, 1, "0") + ":" + pad(min, 2, "0");
}


function millisToString(millis,considerWorkingdays) {
  // console.debug("millisToString",millis)
  if (!millis)
    return "";
  // millisInWorkingDay is set on partHeaderFooter
  var sgn=millis>=0?1:-1;
  millis=Math.abs(millis);
  var wm = (considerWorkingdays?millisInWorkingDay:3600000*24);
  var days = Math.floor(millis / wm);
  var hour = Math.floor((millis % wm) / 3600000);
  var min = Math.floor((millis-days*wm-hour*3600000) / 60000);
  var sec = Math.floor((millis-days*wm-hour*3600000-min*60000) / 1000);
  //console.debug("millisToString",wm, millis,days,hour,min)
  return (sgn>=0?"":"-")+(days > 0 ? days + "d " : "") + (hour>0? (days>0?" ":"")+hour+"h":"") +(min>0?(days>0||hour>0?" ":"")+min+"m":"")+ (sec>0?+sec+"s":"");
}



function millisFromHourMinute(stringHourMinutes) { //All this format are valid: "12:58" "13.75"  "63635676000" (this is already in milliseconds)
  var semiColSeparator = stringHourMinutes.indexOf(":");
  if (semiColSeparator ==0) // :30 minutes
    return millisFromHourMinuteSecond("00"+stringHourMinutes+":00");
  else if (semiColSeparator >0) // 1:15 hours:minutes
    return millisFromHourMinuteSecond(stringHourMinutes+":00");
  else
    return millisFromHourMinuteSecond(stringHourMinutes);

}

function millisFromHourMinuteSecond(stringHourMinutesSeconds) { //All this format are valid: "00:12:58" "12:58:55" "13.75"  "63635676000" (this is already in milliseconds)
  var result = 0;
  stringHourMinutesSeconds.replace(",", ".");
  var semiColSeparator = stringHourMinutesSeconds.indexOf(":");
  var dotSeparator = stringHourMinutesSeconds.indexOf(".");

  if (semiColSeparator < 0 && dotSeparator < 0 && stringHourMinutesSeconds.length > 5) {
    return parseInt(stringHourMinutesSeconds, 10); //already in millis
  } else {

    if (dotSeparator > -1) {
      var d = parseFloat(stringHourMinutesSeconds);
      result = d * 3600000;
    } else {
      var hour = 0;
      var minute = 0;
      var second= 0;

      if (semiColSeparator == -1)
        hour = parseInt(stringHourMinutesSeconds, 10);
      else {

        var units=stringHourMinutesSeconds.split(":")

        hour = parseInt(units[0],10);
        minute = parseInt(units[1], 10);
        second = parseInt(units[2], 10);
      }
      result = hour * 3600000 + minute * 60000+second*1000;
    }
    if (typeof(result) != "number")
      result = NaN;
    return result;
  }
}


/**
 * @param string              "3y 4d", "4D:08:10", "12M/3d", "1.5D", "2H4D", "3M4d,2h", "12:30", "11", "3", "1.5", "2m/3D", "12/3d", "1234"
 *                            by default 2 means 2 hours 1.5 means 1:30
 * @param considerWorkingdays if true day length is from global.properties CompanyCalendar.MILLIS_IN_WORKING_DAY  otherwise in 24
 * @return milliseconds. 0 if invalid string
 */
function millisFromString(string, considerWorkingdays) {
  if (!string)
    return 0;

  //var regex = new RegExp("(\\d+[Yy])|(\\d+[M])|(\\d+[Ww])|(\\d+[Dd])|(\\d+[Hh])|(\\d+[m])|(\\d+[Ss])|(\\d+:\\d+)|(:\\d+)|(\\d*[\\.,]\\d+)|(\\d+)", "g"); // bicch 14/1/16 supporto per 1.5d
  var regex = new RegExp("([0-9\\.,]+[Yy])|([0-9\\.,]+[Qq])|([0-9\\.,]+[M])|([0-9\\.,]+[Ww])|([0-9\\.,]+[Dd])|([0-9\\.,]+[Hh])|([0-9\\.,]+[m])|([0-9\\.,]+[Ss])|(\\d+:\\d+:\\d+)|(\\d+:\\d+)|(:\\d+)|(\\d*[\\.,]\\d+)|(\\d+)", "g");

  var matcher = regex.exec(string);
  var totMillis = 0;

  if (!matcher)
    return NaN;

  while (matcher != null) {
    for (var i = 1; i < matcher.length; i++) {
      var match = matcher[i];
      if (match) {
        var number = 0;
        try {
          //number = parseInt(match); // bicch 14/1/16 supporto per 1.5d
          number = parseFloat(match.replace(',','.'));
        } catch (e) {
        }
        if (i == 1) { // years
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 52 : 3600000 * 24 * 365);
        } else if (i == 2) { // quarter
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 4 : 3600000 * 24 * 91);
        } else if (i == 3) { // months
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek * 4 : 3600000 * 24 * 30);
        } else if (i == 4) { // weeks
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay * workingDaysPerWeek : 3600000 * 24 * 7);
        } else if (i == 5) { // days
          totMillis = totMillis + number * (considerWorkingdays ? millisInWorkingDay : 3600000 * 24);
        } else if (i == 6) { // hours
          totMillis = totMillis + number * 3600000;
        } else if (i == 7) { // minutes
          totMillis = totMillis + number * 60000;
        } else if (i == 8) { // seconds
          totMillis = totMillis + number * 1000;
        } else if (i == 9) { // hour:minutes:seconds
          totMillis = totMillis + millisFromHourMinuteSecond(match);
        } else if (i == 10) { // hour:minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 11) { // :minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 12) { // hour.minutes
          totMillis = totMillis + millisFromHourMinute(match);
        } else if (i == 13) { // hours
          totMillis = totMillis + number * 3600000;
        }
      }
    }
    matcher = regex.exec(string);
  }

  return totMillis;
}

/**
 * @param string              "3y 4d", "4D:08:10", "12M/3d", "2H4D", "3M4d,2h", "12:30", "11", "3", "1.5", "2m/3D", "12/3d", "1234"
 *                            by default 2 means 2 hours 1.5 means 1:30
 * @param considerWorkingdays if true day length is from global.properties CompanyCalendar.MILLIS_IN_WORKING_DAY  otherwise in 24
 * @return milliseconds. 0 if invalid string
 */
function daysFromString(string, considerWorkingdays) {
  if (!string)
    return undefined;

  //var regex = new RegExp("(\\d+[Yy])|(\\d+[Mm])|(\\d+[Ww])|(\\d+[Dd])|(\\d*[\\.,]\\d+)|(\\d+)", "g"); // bicch 14/1/16 supporto per 1.5d
  //var regex = new RegExp("([0-9\\.,]+[Yy])|([0-9\\.,]+[Qq])|([0-9\\.,]+[Mm])|([0-9\\.,]+[Ww])|([0-9\\.,]+[Dd])|(\\d*[\\.,]\\d+)|(\\d+)", "g");
  var regex = new RegExp("([\\-]?[0-9\\.,]+[Yy])|([\\-]?[0-9\\.,]+[Qq])|([\\-]?[0-9\\.,]+[Mm])|([\\-]?[0-9\\.,]+[Ww])|([\\-]?[0-9\\.,]+[Dd])|([\\-]?\\d*[\\.,]\\d+)|([\\-]?\\d+)", "g");

  var matcher = regex.exec(string);
  var totDays = 0;

  if (!matcher)
    return NaN;

  while (matcher != null) {
    for (var i = 1; i < matcher.length; i++) {
      var match = matcher[i];
      if (match) {
        var number = 0;
        try {
          number = parseInt(match);// bicch 14/1/16 supporto per 1.5d
          number = parseFloat(match.replace(',','.'));
        } catch (e) {
        }
        if (i == 1) { // years
          totDays = totDays + number * (considerWorkingdays ? workingDaysPerWeek * 52 : 365);
        } else if (i == 2) { // quarter
          totDays = totDays + number * (considerWorkingdays ? workingDaysPerWeek * 12 : 91);
        } else if (i == 3) { // months
          totDays = totDays + number * (considerWorkingdays ? workingDaysPerWeek * 4 : 30);
        } else if (i == 4) { // weeks
          totDays = totDays + number * (considerWorkingdays ? workingDaysPerWeek : 7);
        } else if (i == 5) { // days
          totDays = totDays + number;
        } else if (i == 6) { // days.minutes
          totDays = totDays + number;
        } else if (i == 7) { // days
          totDays = totDays + number;
        }
      }
    }
    matcher = regex.exec(string);
  }

  return parseInt(totDays);
}

/**
 * jquery.JST.js
 */
$.fn.loadTemplates = function() {
  $.JST.loadTemplates($(this));
  return this;
};
$.JST = {
  _templates: new Object(),
  _decorators:new Object(),

  loadTemplates: function(elems) {
    elems.each(function() {
      $(this).find(".__template__").each(function() {
        var tmpl = $(this);
        var type = tmpl.attr("type");
        var templateBody = "";
        if(type == "TASKSEDITHEAD"){
          templateBody = "<table class=\"gdfTable\" cellspacing=\"0\" cellpadding=\"0\"><thead><tr style=\"height:40px\"><th class=\"gdfColHeader\" style=\"width:35px; border-right: none\"></th><th class=\"gdfColHeader\" style=\"width:25px;\"></th><th class=\"gdfColHeader gdfResizable\" style=\"width:100px;\">编码</th><th class=\"gdfColHeader gdfResizable\" style=\"width:300px;\">名称</th><th class=\"gdfColHeader\"  align=\"center\" style=\"width:17px;\" title=\"Start date is a milestone.\"><span class=\"teamworkIcon\" style=\"font-size: 8px;\">^</span></th><th class=\"gdfColHeader gdfResizable\" style=\"width:80px;\">计划开始时间</th><th class=\"gdfColHeader\"  align=\"center\" style=\"width:17px;\" title=\"End date is a milestone.\"><span class=\"teamworkIcon\" style=\"font-size: 8px;\">^</span></th><th class=\"gdfColHeader gdfResizable\" style=\"width:80px;\">计划结束时间</th><th class=\"gdfColHeader gdfResizable\" style=\"width:50px;\">工期</th><th class=\"gdfColHeader gdfResizable\" style=\"width:20px;\">%</th><th class=\"gdfColHeader gdfResizable requireCanSeeDep\" style=\"width:50px;\">depe.</th><th class=\"gdfColHeader gdfResizable\" style=\"width:1000px; text-align: left; padding-left: 10px;\">assignees</th></tr></thead></table>";
        }else if(type == "GANTBUTTONS"){
          templateBody = "<div class=\"ganttButtonBar noprint\"><div class=\"buttons\"><a href=\"https://gantt.twproject.com/\"><img src=\"res/twGanttLogo.png\" alt=\"Twproject\" align=\"absmiddle\" style=\"max-width: 136px; padding-right: 15px\"></a><button onclick=\"$('#workSpace').trigger('undo.gantt');return false;\" class=\"button textual icon requireCanWrite\" title=\"undo\"><span class=\"teamworkIcon\">&#39;</span></button><button onclick=\"$('#workSpace').trigger('redo.gantt');return false;\" class=\"button textual icon requireCanWrite\" title=\"redo\"><span class=\"teamworkIcon\">&middot;</span></button><span class=\"ganttButtonSeparator requireCanWrite requireCanAdd\"></span><button onclick=\"$('#workSpace').trigger('addAboveCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanAdd\" title=\"insert above\"><span class=\"teamworkIcon\">l</span></button><button onclick=\"$('#workSpace').trigger('addBelowCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanAdd\" title=\"insert below\"><span class=\"teamworkIcon\">X</span></button>" +
            "<span class=\"ganttButtonSeparator requireCanWrite requireCanInOutdent\"></span><button onclick=\"$('#workSpace').trigger('outdentCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanInOutdent\" title=\"un-indent task\"><span class=\"teamworkIcon\">.</span></button><button onclick=\"$('#workSpace').trigger('indentCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanInOutdent\" title=\"indent task\"><span class=\"teamworkIcon\">:</span></button><span class=\"ganttButtonSeparator requireCanWrite requireCanMoveUpDown\"></span><button onclick=\"$('#workSpace').trigger('moveUpCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanMoveUpDown\" title=\"move up\"><span class=\"teamworkIcon\">k</span></button><button onclick=\"$('#workSpace').trigger('moveDownCurrentTask.gantt');return false;\" class=\"button textual icon requireCanWrite requireCanMoveUpDown\" title=\"move down\"><span class=\"teamworkIcon\">j</span></button>" +
            "<span class=\"ganttButtonSeparator requireCanWrite requireCanDelete\"></span><button onclick=\"$('#workSpace').trigger('deleteFocused.gantt');return false;\" class=\"button textual icon delete requireCanWrite\" title=\"Elimina\"><span class=\"teamworkIcon\">&cent;</span></button><span class=\"ganttButtonSeparator\"></span><button onclick=\"$('#workSpace').trigger('expandAll.gantt');return false;\" class=\"button textual icon \" title=\"EXPAND_ALL\"><span class=\"teamworkIcon\">6</span></button> <button onclick=\"$('#workSpace').trigger('collapseAll.gantt'); return false;\" class=\"button textual icon \" title=\"COLLAPSE_ALL\"><span class=\"teamworkIcon\">5</span></button> <span class=\"ganttButtonSeparator\"></span> <button onclick=\"$('#workSpace').trigger('zoomMinus.gantt'); return false;\" class=\"button textual icon \" title=\"zoom out\"><span class=\"teamworkIcon\">)</span></button><button onclick=\"$('#workSpace').trigger('zoomPlus.gantt');return false;\" class=\"button textual icon \" title=\"zoom in\"><span class=\"teamworkIcon\">(</span></button><span class=\"ganttButtonSeparator\"></span><button onclick=\"$('#workSpace').trigger('print.gantt');return false;\" class=\"button textual icon \" title=\"Print\"><span class=\"teamworkIcon\">p</span></button>" +
            "<span class=\"ganttButtonSeparator\"></span><button onclick=\"ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();return false;\" class=\"button textual icon requireCanSeeCriticalPath\" title=\"CRITICAL_PATH\"><span class=\"teamworkIcon\">&pound;</span></button><span class=\"ganttButtonSeparator requireCanSeeCriticalPath\"></span><button onclick=\"ge.splitter.resize(.1);return false;\" class=\"button textual icon\" ><span class=\"teamworkIcon\">F</span></button><button onclick=\"ge.splitter.resize(50);return false;\" class=\"button textual icon\" ><span class=\"teamworkIcon\">O</span></button> <button onclick=\"ge.splitter.resize(100);return false;\" class=\"button textual icon\"><span class=\"teamworkIcon\">R</span></button><span class=\"ganttButtonSeparator\"></span><button onclick=\"$('#workSpace').trigger('fullScreen.gantt');return false;\" class=\"button textual icon\" title=\"FULLSCREEN\" id=\"fullscrbtn\"><span class=\"teamworkIcon\">@</span></button><button onclick=\"ge.element.toggleClass('colorByStatus' );return false;\" class=\"button textual icon\"><span class=\"teamworkIcon\">&sect;</span></button>" +
            "<button onclick=\"editResources();\" class=\"button textual requireWrite\" title=\"edit resources\"><span class=\"teamworkIcon\">M</span></button>&nbsp; &nbsp; &nbsp; &nbsp;<button onclick=\"saveGanttOnServer();\" class=\"button first big requireWrite\" title=\"Save\">Save</button><button onclick='newProject();' class='button requireWrite newproject'><em>clear project</em></button><button class=\"button login\" title=\"login/enroll\" onclick=\"loginEnroll($(this));\" style=\"display:none;\">login/enroll</button><button class=\"button opt collab\" title=\"Start with Twproject\" onclick=\"collaborate($(this));\" style=\"display:none;\"><em>collaborate</em></button></div></div>";
        }else if(type == "TASKROW"){
          templateBody = "<tr id=\"tid_(#=obj.id#)\" taskId=\"(#=obj.id#)\" class=\"taskEditRow (#=obj.isParent()?'isParent':''#) (#=obj.collapsed?'collapsed':''#)\" level=\"(#=level#)\"><th class=\"gdfCell edit\" align=\"right\" style=\"cursor:pointer;\"><span class=\"taskRowIndex\">(#=obj.getRow()+1#)</span> <span class=\"teamworkIcon\" style=\"font-size:12px;\" >e</span></th><td class=\"gdfCell noClip\" align=\"center\"><div class=\"taskStatus cvcColorSquare\" status=\"(#=obj.status#)\"></div></td><td class=\"gdfCell\"><input type=\"text\" name=\"code\" value=\"(#=obj.code?obj.code:''#)\" placeholder=\"code/short name\"></td><td class=\"gdfCell indentCell\" style=\"padding-left:(#=obj.level*10+18#)px;\"><div class=\"exp-controller\" align=\"center\"></div><input type=\"text\" name=\"name\" readonly=\"readonly\" value=\"(#=obj.name#)\" placeholder=\"name\"></td><td class=\"gdfCell\" align=\"center\"><input type=\"checkbox\" name=\"startIsMilestone\"></td><td class=\"gdfCell\"><input type=\"text\" name=\"start\"  value=\"\" class=\"date\"></td><td class=\"gdfCell\" align=\"center\"><input type=\"checkbox\" name=\"endIsMilestone\"></td>" +
            "<td class=\"gdfCell\"><input type=\"text\" name=\"end\" value=\"\" class=\"date\"></td><td class=\"gdfCell\"><input type=\"text\" name=\"duration\" autocomplete=\"off\" value=\"(#=obj.duration#)\"></td><td class=\"gdfCell\"><input type=\"text\" name=\"progress\" class=\"validated\" entrytype=\"PERCENTILE\" autocomplete=\"off\" value=\"(#=obj.progress?obj.progress:''#)\" (#=obj.progressByWorklog?\"readOnly\":\"\"#)></td><td class=\"gdfCell requireCanSeeDep\"><input type=\"text\" name=\"depends\" autocomplete=\"off\" value=\"(#=obj.depends#)\" (#=obj.hasExternalDep?\"readonly\":\"\"#)></td><td class=\"gdfCell taskAssigs\">(#=obj.getAssigsString()#)</td></tr>";
        }else if(type == "TASKEMPTYROW"){
          templateBody = "<tr class=\"taskEditRow emptyRow\" ><th class=\"gdfCell\" align=\"right\"></th><td class=\"gdfCell noClip\" align=\"center\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell\"></td><td class=\"gdfCell requireCanSeeDep\"></td><td class=\"gdfCell\"></td>";
        }else if(type == "TASKBAR"){
          templateBody = "<div class=\"taskBox taskBoxDiv\" taskId=\"(#=obj.id#)\" ><div class=\"layout (#=obj.hasExternalDep?'extDep':''#)\"><div class=\"taskStatus\" status=\"(#=obj.status#)\"></div><div class=\"taskProgress\" style=\"width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);\"></div>" +
            "<div class=\"milestone (#=obj.startIsMilestone?'active':''#)\" ></div><div class=\"taskLabel\"></div><div class=\"milestone end (#=obj.endIsMilestone?'active':''#)\" ></div></div></div>";
        }else if(type == "CHANGE_STATUS"){
          templateBody = "<div class=\"taskStatusBox\"><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_ACTIVE\" title=\"Active\"></div><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_DONE\" title=\"Completed\"></div><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_FAILED\" title=\"Failed\"></div><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_SUSPENDED\" title=\"Suspended\"></div><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_WAITING\" title=\"Waiting\" style=\"display: none;\"></div><div class=\"taskStatus cvcColorSquare\" status=\"STATUS_UNDEFINED\" title=\"Undefined\"></div></div>";
        }else if(type == "TASK_EDITOR"){
          templateBody = "<div class=\"ganttTaskEditor\"><h2 class=\"taskData\">Task editor</h2><table  cellspacing=\"1\" cellpadding=\"5\" width=\"100%\" class=\"taskData table\" border=\"0\">  <tr><td width=\"200\" style=\"height: 80px\"  valign=\"top\">  <label for=\"code\">code/short name</label><br>  <input type=\"text\" name=\"code\" id=\"code\" value=\"\" size=15 class=\"formElements\" autocomplete='off' maxlength=255 style='width:100%' oldvalue=\"1\"></td><td colspan=\"3\" valign=\"top\"><label for=\"name\" class=\"required\">name</label><br><input type=\"text\" name=\"name\" id=\"name\"class=\"formElements\" autocomplete='off' maxlength=255 style='width:100%' value=\"\" required=\"true\" oldvalue=\"1\"></td>  </tr><tr class=\"dateRow\"><td nowrap=\"\">  <div style=\"position:relative\">" +
            "<label for=\"start\">start</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" id=\"startIsMilestone\" name=\"startIsMilestone\" value=\"yes\"> &nbsp;<label for=\"startIsMilestone\">is milestone</label>&nbsp;<br><input type=\"text\" name=\"start\" id=\"start\" size=\"8\" class=\"formElements dateField validated date\" autocomplete=\"off\" maxlength=\"255\" value=\"\" oldvalue=\"1\" entrytype=\"DATE\"><span title=\"calendar\" id=\"starts_inputDate\" class=\"teamworkIcon openCalendar\" onclick=\"$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});\">m</span>  </div></td><td nowrap=\"\">  <label for=\"end\">End</label>&nbsp;&nbsp;&nbsp;&nbsp;  <input type=\"checkbox\" id=\"endIsMilestone\" name=\"endIsMilestone\" value=\"yes\"> &nbsp;<label for=\"endIsMilestone\">is milestone</label>&nbsp;  <br>" +
            "<input type=\"text\" name=\"end\" id=\"end\" size=\"8\" class=\"formElements dateField validated date\" autocomplete=\"off\" maxlength=\"255\" value=\"\" oldvalue=\"1\" entrytype=\"DATE\">  <span title=\"calendar\" id=\"ends_inputDate\" class=\"teamworkIcon openCalendar\" onclick=\"$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});\">m</span></td><td nowrap=\"\" >  <label for=\"duration\" class=\" \">Days</label><br>  <input type=\"text\" name=\"duration\" id=\"duration\" size=\"4\" class=\"formElements validated durationdays\" title=\"Duration is in working days.\" autocomplete=\"off\" maxlength=\"255\" value=\"\" oldvalue=\"1\" entrytype=\"DURATIONDAYS\">&nbsp;</td>  </tr><tr><td  colspan=\"2\">  <label for=\"status\" class=\" \">status</label><br> " +
            " <select id=\"status\" name=\"status\" class=\"taskStatus\" status=\"(#=obj.status#)\"  onchange=\"$(this).attr('STATUS',$(this).val());\"><option value=\"STATUS_ACTIVE\" class=\"taskStatus\" status=\"STATUS_ACTIVE\" >active</option><option value=\"STATUS_WAITING\" class=\"taskStatus\" status=\"STATUS_WAITING\" >suspended</option><option value=\"STATUS_SUSPENDED\" class=\"taskStatus\" status=\"STATUS_SUSPENDED\" >suspended</option><option value=\"STATUS_DONE\" class=\"taskStatus\" status=\"STATUS_DONE\" >completed</option><option value=\"STATUS_FAILED\" class=\"taskStatus\" status=\"STATUS_FAILED\" >failed</option><option value=\"STATUS_UNDEFINED\" class=\"taskStatus\" status=\"STATUS_UNDEFINED\" >undefined</option>  </select></td>  <td valign=\"top\" nowrap>  <label>progress</label><br> " +
            " <input type=\"text\" name=\"progress\" id=\"progress\" size=\"7\" class=\"formElements validated percentile\" autocomplete=\"off\" maxlength=\"255\" value=\"\" oldvalue=\"1\" entrytype=\"PERCENTILE\"></td>  </tr></tr>  <tr><td colspan=\"4\">  <label for=\"description\">Description</label><br>  <textarea rows=\"3\" cols=\"30\" id=\"description\" name=\"description\" class=\"formElements\" style=\"width:100%\"></textarea></td>  </tr></table><h2>Assignments</h2><table  cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" id=\"assigsTable\"><tr>  <th style=\"width:100px;\">name</th>  <th style=\"width:70px;\">Role</th>  <th style=\"width:30px;\">est.wklg.</th>  <th style=\"width:30px;\" id=\"addAssig\"><span class=\"teamworkIcon\" style=\"cursor: pointer\">+</span></th></tr></table><div style=\"text-align: right; padding-top: 20px\">" +
            "<span id=\"saveButton\" class=\"button first\" onClick=\"$(this).trigger('saveFullEditor.gantt');\">Save</span></div></div>";
        }else if(type == "ASSIGNMENT_ROW"){
          templateBody = "<tr taskId=\"(#=obj.task.id#)\" assId=\"(#=obj.assig.id#)\" class=\"assigEditRow\" ><td ><select name=\"resourceId\"  class=\"formElements\" (#=obj.assig.id.indexOf(\"tmp_\")==0?\"\":\"disabled\"#) ></select></td><td ><select type=\"select\" name=\"roleId\"  class=\"formElements\"></select></td><td ><input type=\"text\" name=\"effort\" value=\"(#=getMillisInHoursMinutes(obj.assig.effort)#)\" size=\"5\" class=\"formElements\"></td><td align=\"center\"><span class=\"teamworkIcon delAssig del\" style=\"cursor: pointer\">d</span></td></tr>";
        }else if(type == "RESOURCE_EDITOR"){
          templateBody = "<div class=\"resourceEditor\" style=\"padding: 5px;\"><h2>Project team</h2><table  cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" id=\"resourcesTable\"><tr><th style=\"width:100px;\">name</th><th style=\"width:30px;\" id=\"addResource\"><span class=\"teamworkIcon\" style=\"cursor: pointer\">+</span></th></tr></table><div style=\"text-align: right; padding-top: 20px\"><button id=\"resSaveButton\" class=\"button big\">Save</button></div></div>";
        }else if(type == "RESOURCE_ROW"){
          templateBody = "<tr resId=\"(#=obj.id#)\" class=\"resRow\" ><td ><input type=\"text\" name=\"name\" value=\"(#=obj.name#)\" style=\"width:100%;\" class=\"formElements\"></td><td align=\"center\"><span class=\"teamworkIcon delRes del\" style=\"cursor: pointer\">d</span></td></tr>";
        }

        if (!templateBody.match(/##\w+##/)) { // is Resig' style? e.g. (#=id#) or (# ...some javascript code 'obj' is the alias for the object #)
          var strFunc =
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "with(obj){p.push('" +
            templateBody.replace(/[\r\t\n]/g, " ")
              .replace(/'(?=[^#]*#\))/g, "\t")
              .split("'").join("\\'")
              .split("\t").join("'")
              .replace(/\(#=(.+?)#\)/g, "',$1,'")
              .split("(#").join("');")
              .split("#)").join("p.push('")
            + "');}return p.join('');";

          try {
            $.JST._templates[type] = new Function("obj", strFunc);
          } catch (e) {
            console.error("JST error: "+type, e,strFunc);
          }

        } else { //plain template   e.g. ##id##
          try {
            $.JST._templates[type] = templateBody;
          } catch (e) {
            console.error("JST error: "+type, e,templateBody);
          }
        }

        tmpl.remove();

      });
    });
  },

  createFromTemplate: function(jsonData, template, transformToPrintable) {
    var templates = $.JST._templates;

    var jsData=new Object();
    if (transformToPrintable){
      for (var prop in jsonData){
        var value = jsonData[prop];
        if (typeof(value) == "string")
          value = (value + "").replace(/\n/g, "<br>");
        jsData[prop]=value;
      }
    } else {
      jsData=jsonData;
    }

    function fillStripData(strip, data) {
      for (var prop in data) {
        var value = data[prop];

        strip = strip.replace(new RegExp("##" + prop + "##", "gi"), value);
      }
      // then clean the remaining ##xxx##
      strip = strip.replace(new RegExp("##\\w+##", "gi"), "");
      return strip;
    }

    var stripString = "";

    if (typeof(template) == "undefined") {
      alert("Template is required");
      stripString = "<div>Template is required</div>";

    } else if (typeof(templates[template]) == "function") { // resig template
      try {
        stripString = templates[template](jsData);// create a jquery object in memory
      } catch (e) {
        console.error("JST error: "+template,e.message);
        stripString = "<div> ERROR: "+template+"<br>" + e.message + "</div>";
      }

    } else {
      stripString = templates[template]; // recover strip template
      if (!stripString || stripString.trim() == "") {
        console.error("No template found for type '" + template + "'");
        return $("<div>");

      } else {
        stripString = fillStripData(stripString, jsData); //replace placeholders with data
      }
    }
    var ret = $(stripString);// create a jquery object in memory
    ret.attr("__template", template); // set __template attribute

    //decorate the strip
    var dec = $.JST._decorators[template];
    if (typeof (dec) == "function")
      dec(ret, jsData);

    return ret;
  },


  existsTemplate: function(template) {
    return $.JST._templates[template];
  },

  //decorate function is like function(domElement,jsonData){...}
  loadDecorator:function(template, decorator) {
    $.JST._decorators[template] = decorator;
  },

  getDecorator:function(template) {
    return $.JST._decorators[template];
  },

  decorateTemplate:function(element) {
    var dec = $.JST._decorators[element.attr("__template")];
    if (typeof (dec) == "function")
      dec(editor);
  },

  // asynchronous
  ajaxLoadAsynchTemplates: function(templateUrl, callback) {

    $.get(templateUrl, function(data) {

      var div = $("<div>");
      div.html(data);

      $.JST.loadTemplates(div);

      if (typeof(callback == "function"))
        callback();
    },"html");
  },

  ajaxLoadTemplates: function(templateUrl) {
    $.ajax({
      async:false,
      url: templateUrl,
      dataType: "html",
      success: function(data) {
        var div = $("<div>");
        div.html(data);
        $.JST.loadTemplates(div);
      }
    });

  }


};






