// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  
// 在拖动过程中触发，当不能再拖动时返回false
function onDrag(e) {
  var d = e.data;
  if (d.left < 0) d.left = 0;
  if (d.top < 0) d.top = 0;
  if (d.left + $(d.target).outerWidth() > $(d.parent).width()) {
      d.left = $(d.parent).width() - $(d.target).outerWidth();
  }
  if (d.top + $(d.target).outerHeight() > $(d.parent).height()) {
      d.top = $(d.parent).height() - $(d.target).outerHeight();
  }
}
function pointLocationBindClick(e) {
  var $rounds = e || $('#planeFigureDiv').find('.round');
  if ($rounds) {
      $rounds.draggable({
          onDrag: onDrag,
          onStopDrag: function (e) {
              // 更新点位定位信息
              var _this = $(this);
              var d = e.data,
                  left = d.left,
                  top = d.top;
              if (_this.attr('xAxial') == left && _this.attr('yAxial') == top) return;
              $.ajax({
                  url: basePath + 'project/doc/updatePointLocation',
                  data: {fgId: _this.attr('fgid'), projectId: BIM.Tool.getCurrentProjId(), xAxial: left, yAxial: top},
                  type: 'GET',
                  dataType: 'JSON',
                  success: function (r) {
                      if (r && r.result) {
                          _this.attr({'xAxial': left, 'yAxial': top});
                      } else {
                          if (r && !r.result) $.messager.alert('警告', data.msg, 'warning');
                      }
                  }

              });
          }
      });

      // 绑定双击事件, 双击进入
      $rounds.unbind('dblclick').bind('dblclick', function (e) {
          var _this = $(this),
              $docPropertyMenuList = $("#docProperty-menuList");
          if (!_this.hasClass("round-selected")) {
              $rounds.removeClass("round-selected");
              _this.addClass("round-selected");
          }
          var $planeFigureDiv = $("#planeFigureDiv");
          var fgId = $planeFigureDiv.find("span.round-selected").attr("fgId") || $planeFigureDiv.find("img#planeFigure").attr("fgId");
          fileGroupDetail();
          $docPropertyMenuList.find("li.dialog div.version-select").show();
          $docPropertyMenuList.find("li.dialog div.version:eq(1)").show();
          var filePath = $('#container').find('#planeFigureDiv img#planeFigure').attr('filePath');
          var $formPanoramicViewInfo = $('#formPanoramicViewInfo');
          showOrHideBtn();
          $formPanoramicViewInfo.empty();
          var html = '<form action="' + basePath + 'project/doc/panoramicView" id="panoramicViewInfo" method="post" target="_blank">' +
              '<input type="text" name="fgId" value="' + fgId + '">' +
              '<input type="text" name="filePath" value="' + filePath + '">' +
              '<input type="text" name="xAxial" value="' + _this.attr("xAxial") + '">' +
              '<input type="text" name="yAxial" value="' + _this.attr("yAxial") + '">' +
              '<input type="text" name="fgName" value="' + _this.attr("fgName") + '">' +
              '</form>';
          $formPanoramicViewInfo.append(html);
          $formPanoramicViewInfo.find('#panoramicViewInfo').submit();
      });

      // 绑定单击事件
      $rounds.unbind('click').bind('click', function (e) {
          var _this = $(this),
              $docPropertyMenuList = $("#docProperty-menuList");
          if (!e.metaKey && !e.ctrlKey) { //单选文件
              if (_this.hasClass("round-selected")) {
                  _this.removeClass("round-selected");
              } else {
                  $rounds.removeClass("round-selected");
                  _this.addClass("round-selected");
              }
              var $planeFigureDiv = $("#planeFigureDiv");
              var fgId = $planeFigureDiv.find("span.round-selected").attr("fgId") || $planeFigureDiv.find("img#planeFigure").attr("fgId");
              fileGroupDetail();
              $docPropertyMenuList.find("li.dialog div.version-select").show();
              $docPropertyMenuList.find("li.dialog div.version:eq(1)").show();
          } else {   //多选文件
              if (_this.hasClass("round-selected")) {
                  _this.removeClass("round-selected");
              } else {
                  _this.addClass("round-selected");
              }
              $("#fileVersionDlv").empty(); // 清空版本
              $('#fileGroup-property-list').html("<tr> <th style='min-width:50px;width:39%'>" + jQuery.i18n.prop("DOCUMENT_SELECT_AMOUNT") +
                  "</th><td>" + $('#planeFigureDiv').find('.round-selected').length + "</td></tr>");
              $docPropertyMenuList.find("li.dialog div.version-select").hide();
              //$docPropertyMenuList.find("li.dialog div.version:eq(0)").hide();
              //$('#file-property-operate').show();
              $('#docProperty').find('li.now').prop('fgId', 0);
              $("#cur_fgId").val('');
          }
          showOrHideBtn();
      });
  }
}
