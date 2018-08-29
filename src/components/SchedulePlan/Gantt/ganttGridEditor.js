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

export{
  GridEditor
}
function GridEditor(master) {
  this.master = master; // is the a GantEditor instance

  var editorTabel = $.JST.createFromTemplate({}, "TASKSEDITHEAD");
  if (!master.permissions.canSeeDep)
    editorTabel.find(".requireCanSeeDep").hide();

  this.gridified = $.gridify(editorTabel);
  this.element = this.gridified.find(".gdfTable").eq(1);

  this.minAllowedDate=new Date(new Date().getTime()-3600000*24*365*20).format();
  this.maxAllowedDate=new Date(new Date().getTime()+3600000*24*365*30).format();
}


GridEditor.prototype.fillEmptyLines = function () {
  //console.debug("fillEmptyLines")
  var factory = new TaskFactory();
  var master = this.master;

  //console.debug("GridEditor.fillEmptyLines");
  var rowsToAdd = master.minRowsInEditor - this.element.find(".taskEditRow").length;
  var empty=this.element.find(".emptyRow").length;
  rowsToAdd=Math.max(rowsToAdd,empty>5?0:5-empty);

  //fill with empty lines
  for (var i = 0; i < rowsToAdd; i++) {
    var emptyRow = $.JST.createFromTemplate({}, "TASKEMPTYROW");
    if (!master.permissions.canSeeDep)
      emptyRow.find(".requireCanSeeDep").hide();

    //click on empty row create a task and fill above
    emptyRow.click(function (ev) {
      //console.debug("emptyRow.click")
      var emptyRow = $(this);
      //add on the first empty row only
      if (!master.permissions.canAdd || emptyRow.prevAll(".emptyRow").length > 0)
        return;

      master.beginTransaction();
      var lastTask;
      var start = new Date().getTime();
      var level = 0;
      if (master.tasks[0]) {
        start = master.tasks[0].start;
        level = master.tasks[0].level + 1;
      }

      //fill all empty previouses
      var cnt=0;
      emptyRow.prevAll(".emptyRow").addBack().each(function () {
        cnt++;
        var ch = factory.build("tmp_fk" + new Date().getTime()+"_"+cnt, "", "", level, start, Date.workingPeriodResolution);
        var task = master.addTask(ch);
        lastTask = ch;
      });
      master.endTransaction();
      if (lastTask.rowElement) {
        lastTask.rowElement.find("[name=name]").focus();//focus to "name" input
      }
    });
    this.element.append(emptyRow);
  }
};


GridEditor.prototype.addTask = function (task, row, hideIfParentCollapsed) {
  //console.debug("GridEditor.addTask",task,row);
  //var prof = new Profiler("ganttGridEditor.addTask");

  //remove extisting row
  this.element.find("#tid_" + task.id).remove();

  var taskRow = $.JST.createFromTemplate(task, "TASKROW");

  if (!this.master.permissions.canSeeDep)
    taskRow.find(".requireCanSeeDep").hide();

  if (!this.master.permissions.canSeePopEdit)
    taskRow.find(".edit .teamworkIcon").hide();

  //save row element on task
  task.rowElement = taskRow;

  this.bindRowEvents(task, taskRow);

  if (typeof(row) != "number") {
    var emptyRow = this.element.find(".emptyRow:first"); //tries to fill an empty row
    if (emptyRow.length > 0)
      emptyRow.replaceWith(taskRow);
    else
      this.element.append(taskRow);
  } else {
    var tr = this.element.find("tr.taskEditRow").eq(row);
    if (tr.length > 0) {
      tr.before(taskRow);
    } else {
      this.element.append(taskRow);
    }

  }

  //[expand]
  if (hideIfParentCollapsed) {
    if (task.collapsed) taskRow.addClass('collapsed');
    var collapsedDescendant = this.master.getCollapsedDescendant();
    if (collapsedDescendant.indexOf(task) >= 0) taskRow.hide();
  }
  //prof.stop();
  return taskRow;
};

GridEditor.prototype.refreshExpandStatus = function (task) {
  //console.debug("refreshExpandStatus",task);
  if (!task) return;
  if (task.isParent()) {
    task.rowElement.addClass("isParent");
  } else {
    task.rowElement.removeClass("isParent");
  }


  var par = task.getParent();
  if (par && !par.rowElement.is("isParent")) {
    par.rowElement.addClass("isParent");
  }

};

GridEditor.prototype.refreshTaskRow = function (task) {
  //console.debug("refreshTaskRow")
  //var profiler = new Profiler("editorRefreshTaskRow");

  var canWrite=this.master.permissions.canWrite || task.canWrite;

  var row = task.rowElement;

  row.find(".taskRowIndex").html(task.getRow() + 1);
  row.find(".indentCell").css("padding-left", task.level * 10 + 18);
  row.find("[name=name]").val(task.name);
  row.find("[name=code]").val(task.code);
  row.find("[status]").attr("status", task.status);

  row.find("[name=duration]").val(durationToString(task.duration)).prop("readonly",!canWrite || task.isParent() && task.master.shrinkParent);
  row.find("[name=progress]").val(task.progress).prop("readonly",!canWrite || task.progressByWorklog==true);
  row.find("[name=startIsMilestone]").prop("checked", task.startIsMilestone);
  row.find("[name=start]").val(new Date(task.start).format()).updateOldValue().prop("readonly",!canWrite || task.depends || !(task.canWrite  || this.master.permissions.canWrite) ); // called on dates only because for other field is called on focus event
  row.find("[name=endIsMilestone]").prop("checked", task.endIsMilestone);
  row.find("[name=end]").val(new Date(task.end).format()).prop("readonly",!canWrite || task.isParent() && task.master.shrinkParent).updateOldValue();
  row.find("[name=depends]").val(task.depends);
  row.find(".taskAssigs").html(task.getAssigsString());

  //manage collapsed
  if (task.collapsed)
    row.addClass("collapsed");
  else
    row.removeClass("collapsed");


  //Enhancing the function to perform own operations
  this.master.element.trigger('gantt.task.afterupdate.event', task);
  //profiler.stop();
};

GridEditor.prototype.redraw = function () {
  //console.debug("GridEditor.prototype.redraw")
  //var prof = new Profiler("gantt.GridEditor.redraw");
  for (var i = 0; i < this.master.tasks.length; i++) {
    this.refreshTaskRow(this.master.tasks[i]);
  }
  // check if new empty rows are needed
  if (this.master.fillWithEmptyLines)
    this.fillEmptyLines();

  //prof.stop()

};

GridEditor.prototype.reset = function () {
  this.element.find("[taskid]").remove();
};


GridEditor.prototype.bindRowEvents = function (task, taskRow) {
  var self = this;
  //console.debug("bindRowEvents",this,this.master,this.master.permissions.canWrite, task.canWrite);

  //bind row selection
  taskRow.click(function (event) {
    var row = $(this);
    //console.debug("taskRow.click",row.attr("taskid"),event.target)
    //var isSel = row.hasClass("rowSelected");
    row.closest("table").find(".rowSelected").removeClass("rowSelected");
    row.addClass("rowSelected");

    //set current task
    self.master.currentTask = self.master.getTask(row.attr("taskId"));

    //move highlighter
    self.master.gantt.synchHighlight();

    //if offscreen scroll to element
    var top = row.position().top;
    if (top > self.element.parent().height()) {
      row.offsetParent().scrollTop(top - self.element.parent().height() + 100);
    } else if (top <= 40) {
      row.offsetParent().scrollTop(row.offsetParent().scrollTop() - 40 + top);
    }
  });


  if (this.master.permissions.canWrite || task.canWrite) {
    self.bindRowInputEvents(task, taskRow);

  } else { //cannot write: disable input
    taskRow.find("input").prop("readonly", true);
    taskRow.find("input:checkbox,select").prop("disabled", true);
  }

  if (!this.master.permissions.canSeeDep)
    taskRow.find("[name=depends]").attr("readonly", true);

  self.bindRowExpandEvents(task, taskRow);

  if (this.master.permissions.canSeePopEdit) {
    taskRow.find(".edit").click(function () {self.openFullEditor(task, false)});

    taskRow.dblclick(function (ev) { //open editor only if no text has been selected
      if (window.getSelection().toString().trim()=="")
        self.openFullEditor(task, $(ev.target).closest(".taskAssigs").size()>0)
      });
  }
  //prof.stop();
};


GridEditor.prototype.bindRowExpandEvents = function (task, taskRow) {
  var self = this;
  //expand collapse
  taskRow.find(".exp-controller").click(function () {
    var el = $(this);
    var taskId = el.closest("[taskid]").attr("taskid");
    var task = self.master.getTask(taskId);
    if (task.collapsed) {
      self.master.expand(task,false);
    } else {
      self.master.collapse(task,false);
    }
  });
};

GridEditor.prototype.bindRowInputEvents = function (task, taskRow) {
  var self = this;

  //bind dateField on dates
  taskRow.find(".date").each(function () {
    var el = $(this);
    el.click(function () {
      var inp = $(this);
      inp.dateField({
        inputField: el,
        minDate:self.minAllowedDate,
        maxDate:self.maxAllowedDate,
        callback:   function (d) {
          $(this).blur();
        }
      });
    });

    el.blur(function (date) {
      var inp = $(this);
      if (inp.isValueChanged()) {
        if (!Date.isValid(inp.val())) {
          alert(GanttMaster.messages["INVALID_DATE_FORMAT"]);
          inp.val(inp.getOldValue());

        } else {
          var row = inp.closest("tr");
          var taskId = row.attr("taskId");
          var task = self.master.getTask(taskId);

          var leavingField = inp.prop("name");
          var dates = resynchDates(inp, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
          //console.debug("resynchDates",new Date(dates.start), new Date(dates.end),dates.duration)
          //update task from editor
          self.master.beginTransaction();
          self.master.changeTaskDates(task, dates.start, dates.end);
          self.master.endTransaction();
          inp.updateOldValue(); //in order to avoid multiple call if nothing changed
        }
      }
    });
  });


  //milestones checkbox
  taskRow.find(":checkbox").click(function () {
    var el = $(this);
    var row = el.closest("tr");
    var taskId = row.attr("taskId");

    var task = self.master.getTask(taskId);

    //update task from editor
    var field = el.prop("name");

    if (field == "startIsMilestone" || field == "endIsMilestone") {
      self.master.beginTransaction();
      //milestones
      task[field] = el.prop("checked");
      resynchDates(el, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
      self.master.endTransaction();
    }

  });


  //binding on blur for task update (date exluded as click on calendar blur and then focus, so will always return false, its called refreshing the task row)
  taskRow.find("input:text:not(.date)").focus(function () {
    $(this).updateOldValue();

  }).blur(function (event) {
    var el = $(this);
    var row = el.closest("tr");
    var taskId = row.attr("taskId");
    var task = self.master.getTask(taskId);
    //update task from editor
    var field = el.prop("name");

    if (el.isValueChanged()) {
      self.master.beginTransaction();

      if (field == "depends") {
        var oldDeps = task.depends;
        task.depends = el.val();

        // update links
        var linkOK = self.master.updateLinks(task);
        if (linkOK) {
          //synchronize status from superiors states
          var sups = task.getSuperiors();

          var oneFailed=false;
          var oneUndefined=false;
          var oneActive=false;
          var oneSuspended=false;
          var oneWaiting=false;
          for (var i = 0; i < sups.length; i++) {
            oneFailed=oneFailed|| sups[i].from.status=="STATUS_FAILED";
            oneUndefined=oneUndefined|| sups[i].from.status=="STATUS_UNDEFINED";
            oneActive=oneActive|| sups[i].from.status=="STATUS_ACTIVE";
            oneSuspended=oneSuspended|| sups[i].from.status=="STATUS_SUSPENDED";
            oneWaiting=oneWaiting|| sups[i].from.status=="STATUS_WAITING";
          }

          if (oneFailed){
            task.changeStatus("STATUS_FAILED")
          } else if (oneUndefined){
            task.changeStatus("STATUS_UNDEFINED")
          } else if (oneActive){
            //task.changeStatus("STATUS_SUSPENDED")
            task.changeStatus("STATUS_WAITING")
          } else  if (oneSuspended){
            task.changeStatus("STATUS_SUSPENDED")
          } else  if (oneWaiting){
            task.changeStatus("STATUS_WAITING")
          } else {
            task.changeStatus("STATUS_ACTIVE")
          }

          self.master.changeTaskDeps(task); //dates recomputation from dependencies
        }

      } else if (field == "duration") {
        var dates = resynchDates(el, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
        self.master.changeTaskDates(task, dates.start, dates.end);

      } else if (field == "name" && el.val() == "") { // remove unfilled task
        self.master.deleteCurrentTask(taskId);


      } else if (field == "progress" ) {
        task[field]=parseFloat(el.val())||0;
        el.val(task[field]);

      } else {
        task[field] = el.val();
      }
      self.master.endTransaction();

    } else if (field == "name" && el.val() == "") { // remove unfilled task even if not changed
      if (task.getRow()!=0) {
        self.master.deleteCurrentTask(taskId);

      }else {
        el.oneTime(1,"foc",function(){$(this).focus()}); //
        event.preventDefault();
        //return false;
      }

    }
  });

  //cursor key movement
  taskRow.find("input").keydown(function (event) {
    var theCell = $(this);
    var theTd = theCell.parent();
    var theRow = theTd.parent();
    var col = theTd.prevAll("td").length;

    var ret = true;
    if (!event.ctrlKey) {
      switch (event.keyCode) {
      case 13:
        if (theCell.is(":text"))
          theCell.blur();
        break;

        case 37: //left arrow
          if (!theCell.is(":text") || (!this.selectionEnd || this.selectionEnd == 0))
            theTd.prev().find("input").focus();
          break;
        case 39: //right arrow
          if (!theCell.is(":text") || (!this.selectionEnd || this.selectionEnd == this.value.length))
            theTd.next().find("input").focus();
          break;

        case 38: //up arrow
          //var prevRow = theRow.prev();
          var prevRow = theRow.prevAll(":visible:first");
          var td = prevRow.find("td").eq(col);
          var inp = td.find("input");

          if (inp.length > 0)
            inp.focus();
          break;
        case 40: //down arrow
          //var nextRow = theRow.next();
          var nextRow = theRow.nextAll(":visible:first");
          var td = nextRow.find("td").eq(col);
          var inp = td.find("input");
          if (inp.length > 0)
            inp.focus();
          else
            nextRow.click(); //create a new row
          break;
        case 36: //home
          break;
        case 35: //end
          break;

        case 9: //tab
        case 13: //enter
          break;
      }
    }
    return ret;

  }).focus(function () {
    $(this).closest("tr").click();
  });


  //change status
  taskRow.find(".taskStatus").click(function () {
    var el = $(this);
    var tr = el.closest("[taskid]");
    var taskId = tr.attr("taskid");
    var task = self.master.getTask(taskId);

    var changer = $.JST.createFromTemplate({}, "CHANGE_STATUS");
    changer.find("[status=" + task.status + "]").addClass("selected");
    changer.find(".taskStatus").click(function (e) {
      e.stopPropagation();
      var newStatus = $(this).attr("status");
      changer.remove();
      self.master.beginTransaction();
      task.changeStatus(newStatus);
      self.master.endTransaction();
      el.attr("status", task.status);
    });
    el.oneTime(3000, "hideChanger", function () {
      changer.remove();
    });
    el.after(changer);
  });

};

GridEditor.prototype.openFullEditor = function (task, editOnlyAssig) {
  var self = this;

  if (!self.master.permissions.canSeePopEdit)
    return;

  var taskRow=task.rowElement;

  //task editor in popup
  var taskId = taskRow.attr("taskId");

  //make task editor
  var taskEditor = $.JST.createFromTemplate(task, "TASK_EDITOR");

  //hide task data if editing assig only
  if (editOnlyAssig) {
    taskEditor.find(".taskData").hide();
    taskEditor.find(".assigsTableWrapper").height(455);
    taskEditor.prepend("<h1>\""+task.name+"\"</h1>");
  }

  //got to extended editor
  if (task.isNew()|| !self.master.permissions.canSeeFullEdit){
    taskEditor.find("#taskFullEditor").remove();
  } else {
    taskEditor.bind("openFullEditor.gantt",function () {
      window.location.href=contextPath+"/applications/teamwork/task/taskEditor.jsp?CM=ED&OBJID="+task.id;
    });
  }


  taskEditor.find("#name").val(task.name);
  taskEditor.find("#description").val(task.description);
  taskEditor.find("#code").val(task.code);
  taskEditor.find("#progress").val(task.progress ? parseFloat(task.progress) : 0).prop("readonly",task.progressByWorklog==true);
  taskEditor.find("#progressByWorklog").prop("checked",task.progressByWorklog);
  taskEditor.find("#status").val(task.status);
  taskEditor.find("#type").val(task.typeId);
  taskEditor.find("#type_txt").val(task.type);
  taskEditor.find("#relevance").val(task.relevance);
  //cvc_redraw(taskEditor.find(".cvcComponent"));


  if (task.startIsMilestone)
    taskEditor.find("#startIsMilestone").prop("checked", true);
  if (task.endIsMilestone)
    taskEditor.find("#endIsMilestone").prop("checked", true);

  taskEditor.find("#duration").val(durationToString(task.duration));
  var startDate = taskEditor.find("#start");
  startDate.val(new Date(task.start).format());
  //start is readonly in case of deps
  if (task.depends || !(this.master.permissions.canWrite ||task.canWrite)) {
    startDate.attr("readonly", "true");
  } else {
    startDate.removeAttr("readonly");
  }

  taskEditor.find("#end").val(new Date(task.end).format());

  //make assignments table
  var assigsTable = taskEditor.find("#assigsTable");
  assigsTable.find("[assId]").remove();
  // loop on assignments
  for (var i = 0; i < task.assigs.length; i++) {
    var assig = task.assigs[i];
    var assigRow = $.JST.createFromTemplate({task: task, assig: assig}, "ASSIGNMENT_ROW");
    assigsTable.append(assigRow);
  }

  taskEditor.find(":input").updateOldValue();

  if (!(self.master.permissions.canWrite || task.canWrite)) {
    taskEditor.find("input,textarea").prop("readOnly", true);
    taskEditor.find("input:checkbox,select").prop("disabled", true);
    taskEditor.find("#saveButton").remove();
    taskEditor.find(".button").addClass("disabled");

  } else {

    //bind dateField on dates, duration
    taskEditor.find("#start,#end,#duration").click(function () {
      var input = $(this);
      if (input.is("[entrytype=DATE]")) {
        input.dateField({
          inputField: input,
          minDate:self.minAllowedDate,
          maxDate:self.maxAllowedDate,
          callback:   function (d) {$(this).blur();}
        });
      }
    }).blur(function () {
      var inp = $(this);
      if (inp.validateField()) {
        resynchDates(inp, taskEditor.find("[name=start]"), taskEditor.find("[name=startIsMilestone]"), taskEditor.find("[name=duration]"), taskEditor.find("[name=end]"), taskEditor.find("[name=endIsMilestone]"));
        //workload computation
        if (typeof(workloadDatesChanged)=="function")
          workloadDatesChanged();
      }
    });

    taskEditor.find("#startIsMilestone,#endIsMilestone").click(function () {
      var inp = $(this);
      resynchDates(inp, taskEditor.find("[name=start]"), taskEditor.find("[name=startIsMilestone]"), taskEditor.find("[name=duration]"), taskEditor.find("[name=end]"), taskEditor.find("[name=endIsMilestone]"));
    });

    //bind add assignment
    var cnt=0;
    taskEditor.find("#addAssig").click(function () {
      cnt++;
      var assigsTable = taskEditor.find("#assigsTable");
      var assigRow = $.JST.createFromTemplate({task: task, assig: {id: "tmp_" + new Date().getTime()+"_"+cnt}}, "ASSIGNMENT_ROW");
      assigsTable.append(assigRow);
      $("#bwinPopupd").scrollTop(10000);
    }).click();

    //save task
    taskEditor.bind("saveFullEditor.gantt",function () {
      //console.debug("saveFullEditor");
      var task = self.master.getTask(taskId); // get task again because in case of rollback old task is lost

      self.master.beginTransaction();
      task.name = taskEditor.find("#name").val();
      task.description = taskEditor.find("#description").val();
      task.code = taskEditor.find("#code").val();
      task.progress = parseFloat(taskEditor.find("#progress").val());
      //task.duration = parseInt(taskEditor.find("#duration").val()); //bicch rimosso perchè devono essere ricalcolata dalla start end, altrimenti sbaglia
      task.startIsMilestone = taskEditor.find("#startIsMilestone").is(":checked");
      task.endIsMilestone = taskEditor.find("#endIsMilestone").is(":checked");

      task.type = taskEditor.find("#type_txt").val();
      task.typeId = taskEditor.find("#type").val();
      task.relevance = taskEditor.find("#relevance").val();
      task.progressByWorklog= taskEditor.find("#progressByWorklog").is(":checked");

      //set assignments
      var cnt=0;
      taskEditor.find("tr[assId]").each(function () {
        var trAss = $(this);
        var assId = trAss.attr("assId");
        var resId = trAss.find("[name=resourceId]").val();
        var resName = trAss.find("[name=resourceId_txt]").val(); // from smartcombo text input part
        var roleId = trAss.find("[name=roleId]").val();
        var effort = millisFromString(trAss.find("[name=effort]").val(),true);

        //check if the selected resource exists in ganttMaster.resources
        var res= self.master.getOrCreateResource(resId,resName);

        //if resource is not found nor created
        if (!res)
          return;

        //check if an existing assig has been deleted and re-created with the same values
        var found = false;
        for (var i = 0; i < task.assigs.length; i++) {
          var ass = task.assigs[i];

          if (assId == ass.id) {
            ass.effort = effort;
            ass.roleId = roleId;
            ass.resourceId = res.id;
            ass.touched = true;
            found = true;
            break;

          } else if (roleId == ass.roleId && res.id == ass.resourceId) {
            ass.effort = effort;
            ass.touched = true;
            found = true;
            break;

          }
        }

        if (!found && resId && roleId) { //insert
          cnt++;
          var ass = task.createAssignment("tmp_" + new Date().getTime()+"_"+cnt, resId, roleId, effort);
          ass.touched = true;
        }

      });

      //remove untouched assigs
      task.assigs = task.assigs.filter(function (ass) {
        var ret = ass.touched;
        delete ass.touched;
        return ret;
      });

      //change dates
      task.setPeriod(Date.parseString(taskEditor.find("#start").val()).getTime(), Date.parseString(taskEditor.find("#end").val()).getTime() + (3600000 * 22));

      //change status
      task.changeStatus(taskEditor.find("#status").val());

      if (self.master.endTransaction()) {
        taskEditor.find(":input").updateOldValue();
        closeBlackPopup();
      }

    });
  }

  taskEditor.attr("alertonchange","true");
  var ndo = createModalPopup(800, 450).append(taskEditor);//.append("<div style='height:800px; background-color:red;'></div>")

  //workload computation
  if (typeof(workloadDatesChanged)=="function")
    workloadDatesChanged();



};

function durationToString(d) {
  return d;
}

function stringToDuration(durStr) {
  var duration = NaN;
  duration = daysFromString(durStr, true) || 1;
  return duration;
}

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
 * ganttask.js
 */
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
  ret = -1;
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

function computeStart(start) {
  return computeStartDate(start).getTime();
}
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
function incrementDateByUnits(date,duration){
  date.incrementDateByWorkingDays(duration); // working in days
  return date;
}
function getDurationInUnits(start,end){
  return start.distanceInWorkingDays(end)+1; // working in days
}


