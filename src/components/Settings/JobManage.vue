<template>
  <div class="wrapper">
      <h4 class="title">岗位11管理</h4>
      <div class="usermanage">
          <h5 class="subtitle">用户列表
              <span class="subSpan">
                  <select v-model="posType" class="inp-search">
                        <option value="">全部岗位</option>
                         <option value="0">企业岗位</option>
                        <option value="1">工程内岗位</option>
                        <option value="2">合作方岗位</option>
                  </select>
                  <i class="icon-sanjiao"></i>
                  <span @click="addUser" class="btn">添加</span>
             </span>
          </h5>
          <table class="UserList" border="1" width='100%'>
              <thead>
                  <tr  class="userList-thead">
                    <th width="18%">岗位名称</th>
                    <th width="18%">岗位类型</th>
                    <th width="50%">授权的功能模块</th>
                    <th width="14%;">操作 </th>
                  </tr>
              </thead>
              <tbody>
                   <tr v-for="(val,index) in jobList" :key="index">
                        <td v-text="val.posName"></td>
                         <td v-text="val.posTypeName"></td>
                         <td v-text="val.posAuthNameList"></td>
                         <td>
                             <!--
                                 if(rowData.posType == 0 || (rowData.posName == '工程管理员' && rowData.posTypeName == '工程内岗位'))
				return '-';
			if(rowData.posName == '默认岗位' && rowData.posTypeName == '合作方岗位')
				return '<a href="javascript:void(0)" onclick="editPosition('+ rowData.id +')">编辑</a>';

			return '<a href="javascript:void(0)" onclick="editPosition('+ rowData.id +')">编辑</a>&nbsp; &nbsp;'
			     +'<a href="javascript:void(0)" onclick="deleteRow('+ rowIndex +')">删除</a> ';
                             -->
                              <el-button v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位'))" class="editIcon" @click="editUser"  type="text" size="small"><i class="el-icon-edit-outline"></i></el-button>
                              <el-button v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位')) && !(val.posName == '默认岗位' && val.posTypeName == '合作方岗位')" class="deleteIcon" @click.native.prevent="deleteRow(scope.$index, userList)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                         </td>
                    </tr>
              </tbody>
          </table>
          <div class="pagination">
                <el-pagination
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                 layout="total, sizes, prev, pager, next, jumper"
                :total="199">
                </el-pagination>
            </div>
      </div>
        <el-dialog class="openDialog" title="添加用户" :visible.sync="adduser" :before-close="userClose">
            <div>
                <div>
                    <span>岗位名称</span>
                    <input type="text" v-model="jobDetial.posName" placeholder="请输入">
                </div>
                 <div>
                    <span @click="this.jobDetial.posType = 1">工程内岗位 </span>
                    <span @click="this.jobDetial.posType = 2">合作方岗位 </span>
                </div>
                <div>
                    <span>岗位权限</span>
                    <!--树形图-->
                     <ul id="treeDemo" class="ztree"></ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">   
                <el-button type="primary" @click="addUserSure">保存</el-button>
                <el-button @click="userClose">取 消</el-button>
            </span>
        </el-dialog> 
        <el-dialog class="openDialog" title="添加用户" :visible.sync="edituser" :before-close="editClose">
            <div class="userMiddle">
                <div class="userMiddleLeft">   
                    用户信息
                </div>
                <div class="userMiddleRight">
                    <img class="img" />
                     <ul>
                        <li><label>姓名:</label>王自强</li>
                        <li><label>账号:</label>wzq01</li>
                        <li><label>邮箱:</label>xxxxxx@qq.com</li>
                    </ul>
                </div>
            </div>
            <div class="userBottom">
                <div class="userBottomLeft">   
                    指定岗位
                </div>
                <div class="userBottomRight">
                    <p><el-checkbox v-model="checked" style="color:black">工程管理员</el-checkbox></p>
                    <ul>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>
                        <li><el-checkbox v-model="checked">工程管理员</el-checkbox></li>

                    </ul>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">   
                <el-button type="primary" @click="editUserSure">保存</el-button>
                <el-button @click="editClose">取 消</el-button>
            </span>
        </el-dialog> 
  </div>
</template>

<style scoped lang='less'>
.UserList{
    margin:0 20px;
    border-collapse: collapse;
    border: 1px solid #e6e6e6;
    thead{
        background: #f2f2f2;
        th{
            padding-left: 10px;
            height: 52px;
            text-align: left;
            box-sizing: border-box;
            border-right: 1px solid #e6e6e6;
            font-size: 12px;
            color: #333333;
        }
    }
    tbody{
        tr{
            td{
                padding-left: 10px;
                height: 52px;
                text-align: left;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                font-size: 12px;
                color: #333333;
            }
             &:hover{
                background: #fafafa;
            }
        }
    }
}
 .pagination{
    width: 100%;
    text-align: right;
    margin-top: 10px;
    margin-right: 20px;
}
.el-pagination{
    padding:0;
    // margin-right: 20px;
}
</style>

<script>
import axios from 'axios'
import './js/jquery-1.4.4.min.js'
import './js/jquery.ztree.core.js'

export default {
  name:'',
  data(){
      return {
          jobList:[],//岗位列表
          jobTotalNum:0,//最大岗位数
          posType:'',//岗位类型
          jobTree:[],
          defaultProps: {
            children: 'children',
            label: 'authName'
          },
          adduser:false,
          edituser:false,
          radio: 'email',
          checked:false,
          projId:'',
          jobDetial:{
            authCodes: [],
            posId: '',
            posName: "",
            posType: 1
          },
          pageDetial:{
              pagePerNum:10,
              currentPage:1,
          },
          token:''
      }
  },
  watch:{
      posType:function(newVal,old){
          this.getInfo()
      }
  },
  created(){
      var vm = this
      vm.projId = localStorage.getItem('projId')
      vm.token  = localStorage.getItem('token')
      vm.intoJobManager()
  },
  methods:{
        getJobShuXingTu(){
            var vm = this
            var setting = {
                view: {
                    dblClickExpand: false,
                    showLine: true,
                    selectedMulti: false
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "s" }
                },
                data: {
                    key:{
                        name: "authName"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "authId",
                        pIdKey: "parAuthId",
                        rootPId: 0
                    }
                }
            };
             axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/Config/positionTree',
                headers:{
                    'token':vm.token
                },
                params:{
                    pId:vm.projId
                }
            }).then((response)=>{
                // console.log(response)
                vm.jobTree = response.data.rt
                var ttt = $.fn.zTree.init($("#treeDemo"), setting, vm.jobTree);
                console.log(ttt)
            }).catch((err)=>{
                console.log(err)
            })
        },
        intoJobManager(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/Config/positionIndex',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.rt.projId == vm.projId){
                    vm.getInfo()
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        getInfo(){
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/Config/searchPositionList/'+vm.projId,
                headers:{
                    'token':vm.token
                },
                params:{
                    page: vm.pageDetial.currentPage,
                    rows: vm.pageDetial.pagePerNum,
                    posType: vm.posType,
                }
            }).then((response)=>{
                vm.jobList = response.data.rt.gridDataJson.rows
                vm.jobTotalNum = response.data.rt.gridDataJson.total
            }).catch((err)=>{
                console.log(err)
            })
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        addUser(){
            var vm = this
            vm.adduser = true;
            vm.getJobShuXingTu()//获取岗位树形图
        },
        userClose(){
            this.adduser = false;
        },
        addUserSure(){
            this.adduser = false;
        },
        editUser(){
            this.edituser = true;
        },
        editUserSure(){
            this.edituser = false;
        },
        editClose(){
            this.edituser = false;
        }
  }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
    color:    #999999;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:    #999999;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:    #999999;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
        color:    #999999;
    }
    select {  
    /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
    border: solid 1px #000;  
    /*很关键：将默认的select选择框样式清除*/  
    appearance:none;  
    -moz-appearance:none;  
    -webkit-appearance:none;  
    /*在选择框的最右侧中间显示小箭头图片*/  
    /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
    padding-right: 14px;  
    }  
    /*清除ie的默认选择框样式清除，隐藏下拉箭头*/  
    select::-ms-expand { display: none; }  
    select:focus{
       outline: none;
    }
    .title{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        width: 95%;
        border-bottom:1px solid #ccc; 
        height: 50px;
        line-height: 50px;
        padding:0px 15px;
        margin: 10px 0 0 0 ;
        text-align: left;
    }
    .subtitle{
        color: #fc3439;
        height: 40px;
        line-height: 40px;
        text-align: left;
        margin: 20px 20px 15px;
        font-size: 16px;
        font-weight: bold;
    }
    .subSpan{
        float: right;
        height: 40px;
        line-height: 40px;
        position: relative;
    }
    .inp-search{
        width: 214px;
        border-radius: 2px;
        height: 30px;
        border: 1px solid #e6e6e6;
        position: relative;
        background: #fafafa;
        padding-left:10px;
        padding-right:40px;
        box-sizing: border-box;  
        margin-right: 5px;
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
        left: 190px;
     }
   .btn{
       display: inline-block;
       width: 96px;
       height: 32px;
       border-radius: 2px;
       background: #fc3439;
       color: #ffffff;
       font-size: 14px;
       text-align: right;
       line-height: 32px;
       cursor: pointer;
       position: relative;
       padding: 0 20px;
       box-sizing: border-box;
       letter-spacing: 2px;
       font-weight: normal;
    } 
     .btn::after{
         display: block;
         position: absolute;
         width: 12px;
         height: 12px;
         background-image:url('./images/jiahao.png');
         background-size: 100% 100%;
         content: '';
         top: 10px;
         left: 23px;
     }
    .pagination{
        width: 100%;
        text-align: right;
        margin-top: 10px;
    }
    .userTop,.userMiddle,.userBottom {
        width: 100%;
        display: flex;
        color: black
    }
    .userTopLeft{
        display: inline-block;
        width: 100px;
    }
    .userTopRight,.userMiddleRight,.userBottomRight{
        flex: 1;
    }
    .radio{
        float: left;
        width: 100%;
        text-align: left;
        height: 40px;
    }
    .dialogInp{
        float: left;
        width: 60%;
    }
    .userMiddleLeft,.userBottomLeft{
        width: 100px;
    }
    .userMiddleRight .img{
        width: 100px;
        height: 100px;
        float: left;
    }
    .userMiddleRight ul{
        list-style: none;
        padding: 0;
        margin-top: 0;
        margin-left: 120px;
    }
    .userMiddleRight li{
        width: 70%;
        height: 30px;
        margin-bottom: 10px;
        text-align: left;
    }
    .userBottomRight p{
        text-align: left;
        margin: 0;
        width: 90%;
        margin-left: 20px;
        position: relative;
        top: 2px;
    }
    .userBottomRight ul{
        list-style: none;
        width: 70%;
        border:1px solid #ccc;
        height: 200px;
        overflow: auto;
    }
    .userBottomRight li{
        width: 80%;
        text-align: left;
        height: 30px;
    }
        /*-------------------------------------
        zTree Style

        version:	3.5.19
        author:		Hunter.z
        email:		hunter.z@263.net
        website:	http://code.google.com/p/jquerytree/

        -------------------------------------*/

        .ztree * {padding:0; margin:0; font-size:12px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
        .ztree {margin:0; padding:5px; color:#333}
        .ztree li{padding:0; margin:0; list-style:none; line-height:14px; text-align:left; white-space:nowrap; outline:0}
        .ztree li ul{ margin:0; padding:0 0 0 18px}
        .ztree li ul.line{ background:url(./images/line_conn.gif) 0 0 repeat-y;}

        .ztree li a {padding:1px 3px 0 0; margin:0; cursor:pointer; height:17px; color:#333; background-color: transparent;
            text-decoration:none; vertical-align:top; display: inline-block}
        .ztree li a:hover {text-decoration:underline}
        .ztree li a.curSelectedNode {padding-top:0px; background-color:#FFE6B0; color:black; height:16px; border:1px #FFB951 solid; opacity:0.8;}
        .ztree li a.curSelectedNode_Edit {padding-top:0px; background-color:#FFE6B0; color:black; height:16px; border:1px #FFB951 solid; opacity:0.8;}
        .ztree li a.tmpTargetNode_inner {padding-top:0px; background-color:#316AC5; color:white; height:16px; border:1px #316AC5 solid;
            opacity:0.8; filter:alpha(opacity=80)}
        .ztree li a.tmpTargetNode_prev {}
        .ztree li a.tmpTargetNode_next {}
        .ztree li a input.rename {height:14px; width:80px; padding:0; margin:0;
            font-size:12px; border:1px #7EC4CC solid; *border:0px}
        .ztree li span {line-height:16px; margin-right:2px}
        .ztree li span.button {line-height:0; margin:0; width:16px; height:16px; display: inline-block; vertical-align:middle;
            border:0 none; cursor: pointer;outline:none;
            background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
            background-image:url("./images/zTreeStandard.png"); *background-image:url("./images/zTreeStandard.gif")}

        .ztree li span.button.chk {width:13px; height:13px; margin:0 3px 0 0; cursor: auto}
        .ztree li span.button.chk.checkbox_false_full {background-position:0 0}
        .ztree li span.button.chk.checkbox_false_full_focus {background-position:0 -14px}
        .ztree li span.button.chk.checkbox_false_part {background-position:0 -28px}
        .ztree li span.button.chk.checkbox_false_part_focus {background-position:0 -42px}
        .ztree li span.button.chk.checkbox_false_disable {background-position:0 -56px}
        .ztree li span.button.chk.checkbox_true_full {background-position:-14px 0}
        .ztree li span.button.chk.checkbox_true_full_focus {background-position:-14px -14px}
        .ztree li span.button.chk.checkbox_true_part {background-position:-14px -28px}
        .ztree li span.button.chk.checkbox_true_part_focus {background-position:-14px -42px}
        .ztree li span.button.chk.checkbox_true_disable {background-position:-14px -56px}
        .ztree li span.button.chk.radio_false_full {background-position:-28px 0}
        .ztree li span.button.chk.radio_false_full_focus {background-position:-28px -14px}
        .ztree li span.button.chk.radio_false_part {background-position:-28px -28px}
        .ztree li span.button.chk.radio_false_part_focus {background-position:-28px -42px}
        .ztree li span.button.chk.radio_false_disable {background-position:-28px -56px}
        .ztree li span.button.chk.radio_true_full {background-position:-42px 0}
        .ztree li span.button.chk.radio_true_full_focus {background-position:-42px -14px}
        .ztree li span.button.chk.radio_true_part {background-position:-42px -28px}
        .ztree li span.button.chk.radio_true_part_focus {background-position:-42px -42px}
        .ztree li span.button.chk.radio_true_disable {background-position:-42px -56px}

        .ztree li span.button.switch {width:18px; height:18px}
        .ztree li span.button.root_open{background-position:-92px -54px}
        .ztree li span.button.root_close{background-position:-74px -54px}
        .ztree li span.button.roots_open{background-position:-92px 0}
        .ztree li span.button.roots_close{background-position:-74px 0}
        .ztree li span.button.center_open{background-position:-92px -18px}
        .ztree li span.button.center_close{background-position:-74px -18px}
        .ztree li span.button.bottom_open{background-position:-92px -36px}
        .ztree li span.button.bottom_close{background-position:-74px -36px}
        .ztree li span.button.noline_open{background-position:-92px -72px}
        .ztree li span.button.noline_close{background-position:-74px -72px}
        .ztree li span.button.root_docu{ background:none;}
        .ztree li span.button.roots_docu{background-position:-56px 0}
        .ztree li span.button.center_docu{background-position:-56px -18px}
        .ztree li span.button.bottom_docu{background-position:-56px -36px}
        .ztree li span.button.noline_docu{ background:none;}

        .ztree li span.button.ico_open{margin-right:2px; background-position:-110px -16px; vertical-align:top; *vertical-align:middle}
        .ztree li span.button.ico_close{margin-right:2px; background-position:-110px 0; vertical-align:top; *vertical-align:middle}
        .ztree li span.button.ico_docu{margin-right:2px; background-position:-110px -32px; vertical-align:top; *vertical-align:middle}
        .ztree li span.button.edit {margin-right:2px; background-position:-110px -48px; vertical-align:top; *vertical-align:middle}
        .ztree li span.button.remove {margin-right:2px; background-position:-110px -64px; vertical-align:top; *vertical-align:middle}

        .ztree li span.button.ico_loading{margin-right:2px; background:url(./images/loading.gif) no-repeat scroll 0 0 transparent; vertical-align:top; *vertical-align:middle}

        ul.tmpTargetzTree {background-color:#FFE6B0; opacity:0.8; filter:alpha(opacity=80)}

        span.tmpzTreeMove_arrow {width:16px; height:16px; display: inline-block; padding:0; margin:2px 0 0 1px; border:0 none; position:absolute;
            background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
            background-position:-110px -80px; background-image:url("./images/zTreeStandard.png"); *background-image:url("./images/zTreeStandard.gif")}

        ul.ztree.zTreeDragUL {margin:0; padding:0; position:absolute; width:auto; height:auto;overflow:hidden; background-color:#cfcfcf; border:1px #00B83F dotted; opacity:0.8; filter:alpha(opacity=80)}
        .zTreeMask {z-index:10000; background-color:#cfcfcf; opacity:0.0; filter:alpha(opacity=0); position:abfsolute}

        /* level style*/
        /*.ztree li span.button.level0 {
            display:none;
        }
        .ztree li ul.level0 {
            padding:0;
            background:none;
        }*/
        html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
            margin: 0;padding: 0;border: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;vertical-align: baseline;}
        body {color: #2f332a;font: 15px/21px Arial, Helvetica, simsun, sans-serif;background: #f0f6e4 \9;}
        h1, h2, h3, h4, h5, h6 {color: #2f332a;font-weight: bold;font-family: Helvetica, Arial, sans-serif;padding-bottom: 5px;}
        h1 {font-size: 24px;line-height: 34px;text-align: center;}
        h2 {font-size: 14px;line-height: 24px;padding-top: 5px;}
        h6 {font-weight: normal;font-size: 12px;letter-spacing: 1px;line-height: 24px;text-align: center;}
        a {color:#3C6E31;text-decoration: underline;}
        a:hover {background-color:#3C6E31;color:white;}
        input.radio {margin: 0 2px 0 8px;}
        input.radio.first {margin-left:0;}
        input.empty {color: lightgray;}
        code {color: #2f332a;}
        .highlight_red {color:#A60000;}
        .highlight_green {color:#A7F43D;}
        li {list-style: circle;font-size: 12px;}
        li.title {list-style: none;}
        ul.list {margin-left: 17px;}

        div.content_wrap {width: 600px;height:380px;}
        div.content_wrap div.left{float: left;width: 250px;}
        div.content_wrap div.right{float: right;width: 340px;}
        div.zTreeDemoBackground {width:250px;height:362px;text-align:left;}

        ul.ztree {margin-top: 10px;border: 1px solid #617775;background: #f0f6e4;width:220px;height:360px;overflow-y:scroll;overflow-x:auto;}
        ul.log {border: 1px solid #617775;background: #f0f6e4;width:300px;height:170px;overflow: hidden;}
        ul.log.small {height:45px;}
        ul.log li {color: #666666;list-style: none;padding-left: 10px;}
        ul.log li.dark {background-color: #E3E3E3;}

        /* ruler */
        div.ruler {height:20px; width:220px; background-color:#f0f6e4;border: 1px solid #333; margin-bottom: 5px; cursor: pointer}
        div.ruler div.cursor {height:20px; width:30px; background-color:#3C6E31; color:white; text-align: right; padding-right: 5px; cursor: pointer}
 </style>
 