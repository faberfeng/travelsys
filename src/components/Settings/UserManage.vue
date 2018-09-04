<template>
  <div class="wrapper" id="userPage">
      <h4 class="title">用户管理</h4>
      <div class="usermanage">
          <h5 class="subtitle">用户列表
              <span class="subSpan clearfix">
                  <span class="title-right">
                     <input type="text" v-model="userSearchInfo" placeholder="输入姓名"  class="title-right-icon" @keyup.enter="getInfo">
                     <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                  </span>
                  <span  class="btn" @click="addUser()">添加</span>
             </span>
          </h5>
          <div style="padding:0 20px;box-sizing: border-box;">
            <table class="UserList" border="1" width='100%'>
                <thead>
                    <tr  class="userList-thead">
                        <th width="15%">名称</th>
                        <th width="20%">账号</th>
                        <th width="10%">工程管理员</th>
                        <th width="15%;">已被分配到的岗位</th>
                         <th width="16%">添加时间</th>
                        <th width="12%;">添加人</th>
                         <th width="12%">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(val,index) in userList" :key="index">
                        <td v-text="val.userName"></td>
                        <td v-text="val.account"></td>
                        <td v-text="val.isAdmin ==2?'是':'不是'"></td>
                        <td>
                            <span v-for="(item,key) in val.userPositions" :key="key" v-text="item.posName+(key<val.userPositions.length-1?'、':'')"></span>
                        </td>
                         <td v-text="val.addTimeStr"></td>
                        <td v-text="val.addUser"></td>
                        <td>
                            <span class="editIcon" @click="addUser(val.id)"></span>
                            <span v-if="!(val.userType == 2  || val.deleted == false) && projAuth.deleteUser" class="deleteIcon" @click="deleteUser(val.id)"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
           </div>
           <div class="datagrid-pager pagination">
               <table cellspacing="0" cellpadding="0" border="0">
                   <tbody>
                       <tr>
                           <td>
                               <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
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
                                 <span  class="pagination-title" style="padding-left:5px;">第</span>
                            </td>
                            <td>
                                  <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                            </td>
                            <td>
                                 <span  class="pagination-title" style="padding-right:5px;">共{{pageDetial.pageNum}}页</span>
                            </td>
                            <td>
                                 <div class="pagination-btn-separator"></div>
                            </td>
                             <td>
                                <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                            </td>
                            <td>
                                <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2)"></a>
                            </td>
                            <td>
                                  <div class="pagination-btn-separator"></div>
                            </td>
                            <td>
                                 <a href="javascript:void(0)" @click="getInfo" class="btn-refresh btn-TAB"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                <div style="clear:both;"></div>
            </div>
      </div>
        <el-dialog :title="title" :visible.sync="adduser" :before-close="userClose">
            <div  v-if="userDetial.show">
                <div class="log-head clearfix">
                    <span class="log-head-title">查找用户:</span>
                    <el-radio v-model="userDetial.posType" label="1">邮箱</el-radio>
                    <el-radio v-model="userDetial.posType" label="2">账号</el-radio>
                </div>
                <div  class="JobName clearfix">
                    <input type="text" v-model="userDetial.posName" placeholder="请输入" @keyup.enter="searchUser">
                    <span class="btn" @click="searchUser">查询</span>
                </div>
            </div>
            <div  class="log-body clearfix">
                <span class="log-head-title">用户信息:</span>
                <div class="clearfix userInfo">
                    <span class="image-user" :style="userDetial.info.imgUuid?'background-image:url('+this.QJFileManageSystemURL+userDetial.info.imgUuid+');':'background-image: url('+require('./images/people.png')+');'"></span>
                    <span class="info-user">
                        <p>
                            <span class="name">姓名:</span>
                            <span class="detial" v-text="userDetial.info.realName"></span>
                        </p>
                        <p>
                            <span class="name">账号:</span>
                            <span class="detial" v-text="userDetial.info.account" style="color:#666;font-weight: normal;"></span>
                        </p>
                        <p>
                            <span class="name">邮箱:</span>
                            <span class="detial" v-text="userDetial.info.email"  style="color:#666;font-weight: normal;"></span>
                        </p>
                    </span>
                </div>
            </div>
            <div  class="log-body clearfix">
                <span class="log-head-title">指定岗位:</span>
                <div style="width:100%;padding-left:80px;float:left;text-align: left;margin-top: -5px;" class="clearfix">
                    <el-checkbox class="log-head-position" v-model="position_default.checkFlg">工程管理员</el-checkbox>
                    <div class="position-all">
                        <el-checkbox  v-model="item.checkFlg"   v-for="(item,index) in position_list" :key="index" >{{item.posName}}</el-checkbox>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">   
                <el-button type="primary" @click="PostaddUser">保存</el-button>
                <el-button @click="userClose">取 消</el-button>
            </span>
        </el-dialog> 
  </div>
</template>

<style  lang='less'>
#userPage{
    width: 100%;
    display: block;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    *{
        box-sizing: border-box;
        
    }
    .el-button{
        width: 112px;
        height: 36px;
        line-height: 36px;
        padding: 0;
    }
        /***********设置滚动条************/
            /* 设置滚动条的样式 */
            ::-webkit-scrollbar {
            width:7px;
            }
            /* 滚动槽 */
            ::-webkit-scrollbar-track {
            box-shadow:inset006pxrgba(0,0,0,0.3);
            -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
            border-radius:10px;
            }
            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
            border-radius:10px;
            background:rgba(0,0,0,0.1);
            box-shadow:inset006pxrgba(0,0,0,0.3);
            -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
            }
            ::-webkit-scrollbar-thumb:window-inactive {
            background:rgba(255,0,0,0.4);
            }
            /*********************/
            .editIcon{
                float: left;
                width: 17px;
                height: 16px;
                background: url('../../assets/edit.png')no-repeat 0 0;
                cursor: pointer;
                margin-right: 20px;
            }
            .deleteIcon{
                float: left;
                width: 16px;
                height: 16px;
                background: url('../../assets/delete.png')no-repeat 0 0;
                cursor: pointer;
            }
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 10px;
                        height: 36px;
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
                            height: 36px;
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
            .title-right{
                float: left;;
                width: 214px;
                height: 30px;
                margin-right: 10px;
                position: relative;
                 .title-right-icon{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                    border: 1px solid #e6e6e6;
                    position: relative;
                    background: #fafafa;
                    padding-left:10px;
                    padding-right:40px;
                    margin-right: 5px;
                    outline: none;
                }
                .el-icon-search{
                    position: absolute;
                    right: 10px;
                    top: 8px;
                }
            }
            .title-right-edit-icon{
                display: block;
                position: absolute;
                top: 7px;
                right: 8px;
                width: 16px;
                height: 16px;
                content: '';
                // background: url('./images/1-1.png')no-repeat 0 0;
                cursor: pointer;
                &::before{
                    color: #a5adb3;
                }
            }
            .el-dialog{
                width: 586px;
                .el-dialog__header{
                    padding: 34px 0 17px 30px;
                    text-align: left;
                    border-bottom: 1px solid #cccccc;
                    .el-dialog__title{
                        font-size: 20px;
                    color: #fc3439;
                    line-height: 20px;
                    font-weight: bold;
                    }
                    .el-dialog__headerbtn{
                        top: 10px;
                        right: 10px;
                    }
                }
                .el-dialog__body{
                    padding: 22px 45px 20px;
                    .log-head{
                        margin-bottom: 7px;
                        .log-head-title{
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                            float: left;
                        }
                       
                        .el-radio{
                            float: left;
                            span{
                                color: #666666;
                            }
                        }
                    }
                    .JobName{
                        display: block;
                        padding-left: 80px;
                        box-sizing: border-box;
                        input{
                           float: left;
                            width: 312px;
                            height: 32px;
                            padding: 0 10px;
                            box-sizing: border-box;
                            border-radius: 2px;
                            border:1px solid #e0e0e0;
                            background: #fafafa; 
                        }
                        .btn{
                            float: left;
                            width: 95px;
                            text-align: center;
                            &::after{
                                display: none;
                            }
                        }
                    }
                    .log-body{
                        margin-top: 20px;
                        position: relative;
                        .log-head-position{
                            color: #333333;
                            font-weight: bold;
                        }
                        .position-all{
                            width: 408px;
                            height: 165px;
                            overflow-y: auto;
                            border: 1px solid #e0e0e0;
                            background: #fafafa;
                            margin-top: 4px;
                            .el-checkbox{
                                display: block;
                                margin:8px 10px; 
                                .el-checkbox__label{
                                    color: #666666;
                                }
                            }
                        }
                        .log-head-title{
                            display: block;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                        }
                         .userInfo{
                            float: right;
                            width: 415px;
                            .image-user{
                                float: left;
                                width: 80px;
                                height: 80px;
                                background-size:100% 100%;
                            }
                            .info-user{
                                float: left;
                                margin-left: 20px;
                                p{
                                    margin: 0;
                                    height: 30px;
                                    line-height: 30px;
                                    font-size: 14px;
                                    text-align: left;
                                    .name{
                                        color: #999999;
                                    }
                                    .detial{
                                        color: #333333;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                        .el-tree{
                            float: left;
                            width: 414px;
                            height: 278px;
                            overflow: auto;
                            padding: 5px;
                            box-sizing: border-box;
                            border:1px solid #e0e0e0;
                        }
                    }
                    .el-dialog__footer{
                        padding: 0 0 20px;
                    }
                }
            }
            .active{
                .el-dialog__body{
                    padding-top:0; 
                }
            }
            .clearfix{
                clear: both;
                overflow: hidden;
                content: '';
            }
            /**********一下是分页器的样式***************/
            .datagrid-pager {
                display: block;
                margin: 0 20px;
                height: 31px;
                width: auto;
                border:1px solid #d4d4d4;
                // padding: 3px 4px;
                box-sizing: border-box;
                background: #f5f5f5;
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
            .btn-TAB{
                display: block;
                width:26px;
                height: 26px;
                cursor: pointer;
                position: relative;
                &:hover{
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                    border-radius: 5px;
                }
                &::after{
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
            .btn-left0::after{
                background-image: url('../../assets/fenye2.png');
            }
            .btn-left1::after{
                background-image: url('../../assets/fenye1.png');
            }
            .btn-right0::after{
                background-image: url('../../assets/fenye4.png');
            }
            .btn-right1::after{
                background-image: url('../../assets/fenye3.png');
            }
            .btn-refresh::after{
                background-image: url('../../assets/fenye5.png');
            }
            .pagination-title{
                font-size: 14px;
                color: #333333;
            }
            .pagination-info{
                margin-top: 5px;
            }
}
</style>

<script>
import axios from 'axios'

export default {
  name:'',
  data(){
      return {
          projAuth:{
              deleteUser:false
          },
          title:'添加用户',
          userList:[],//用户列表
          userSearchInfo:'',//岗位类型
          jobTree:[],
          jobTree_checked:[],
          jobTree_opend:[],
          defaultProps: {
            children: 'undefined',
            label: 'authName'
          },
          adduser:false,//false
          edituser:false,
          radio: 'email',
          checked:false,
          projId:'',
          jobID:0,
          userDetial:{
            posName: "",
            posType: '1',
            show:true,
            info:{},//具体信息
          },
          position_default:{},//工程管理员岗位
          position_list:[],//可选其他岗位
          pageDetial:{
              pagePerNum:20,//一页几份数据
              currentPage:1,//初始查询页数 第一页
              total:'',//所有数据
              pageNum:0//页面数
          },
          projUserId:0,//编辑的用户ID
          token:'',
          BDMSUrl:'',
          QJFileManageSystemURL:''
      }
  },
  watch:{
      posType:function(newVal,old){
          this.getInfo()
      },
       'pageDetial.pagePerNum':function(newVal,old){//多重属性用''阔起
         this.pageDetial.currentPage = 1
          this.getInfo()
      },
       'pageDetial.currentPage':function(newVal,old){//多重属性用''阔起
          this.getInfo()
      }
  },
  created(){
      var vm = this
      var projAuth = localStorage.getItem('projAuth')
      vm.BDMSUrl = vm.$store.state.BDMSUrl
      vm.QJFileManageSystemURL=vm.$store.state.QJFileManageSystemURL
      vm.projAuth.deleteUser = projAuth.indexOf('00100305')>=0?true:false
      vm.projId = localStorage.getItem('projId')//项目id
      vm.token  = localStorage.getItem('token')
      vm.intoUserManager()
    //   vm.getJobShuXingTu()
  },
  methods:{
        changePage(val){//分页 0 -1 1 2
            var vm = this 
            var pageNum = Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum)
            if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                vm.$message('这已经是第一页!')
                return false
            }else if(vm.pageDetial.currentPage == pageNum && (val == 1 || val == 2)){
                vm.$message('这已经是最后一页!')
                return false
            }else{
                switch(val){
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
                         vm.pageDetial.currentPage = pageNum
                        break;
                }
            }

        },
        searchUser(){
            var vm = this
            if(vm.userDetial.posType == 1){
                var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!myreg.test(vm.userDetial.posName))
                {
                    vm.$message({
                        type:'warning',
                        message:'请输入有效的邮箱！'
                    });
                    return false;
                }
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/Config/findUserByKeyWord',
                headers:{
                    'token':vm.token
                },
                params:{
                    params:vm.userDetial.posName
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.userDetial.info = response.data.rt
                    }else{
                        vm.userDetial.info = {}
                        if(vm.userDetial.posType == 1){
                           vm.$confirm('没有找到邮箱为['+vm.userDetial.posName+']的用户记录。是否向本邮箱用户发送加入当前工程协同工作的邀请?', '无用户邮箱', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                axios({
                                    method:'GET',
                                    url:vm.BDMSUrl+'project2/Config/sendNoRegesterEmail',
                                    headers:{
                                        'token':vm.token
                                    },
                                    params:{
                                        email:vm.userDetial.posName,
                                        projId:vm.projId
                                    }
                                }).then((response)=>{
                                    if(Math.ceil(response.data.cd) == 0){
                                         vm.$notify({
                                            title: '邀请已发送',
                                            message: '邮箱为[' + vm.userDetial.posName + ']的用户将收到您所发出的的协同工作邀请。此用户登录邮箱点击链接，补充完成信息后，即可登陆协同系统，成为当前工程的用户',
                                            type: 'success'
                                        });
                                    }else if(response.data.cd == -1){
                                        vm.$message({
                                            type:'error',
                                            message:response.data.msg
                                        })
                                    }
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }).catch(() => {
                                vm.$message({
                                    type: 'info',
                                    message: '已取消发送邀请。'
                                })
                            })
                        }else{
                             vm.$message({
                                type: 'warning',
                                message: '未找到[ '+vm.userDetial.posName+' ]用户!'
                            })
                        }
                    }
                    
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        getJobShuXingTu(){
            var vm = this
            var setting = {
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
                url:vm.BDMSUrl+'project2/Config/positionTree',
                headers:{
                    'token':vm.token
                },
                params:{
                    pId:vm.jobID
                }
            }).then((response)=>{
                console.log(response)
                if(response.data.rt){
                    var jobTree_checked = [],jobTree_opend = []

                    for(var i =0;i<response.data.rt.length;i++){
                        if(response.data.rt[i].flag){
                            jobTree_checked.push(response.data.rt[i].authCode)
                        }
                        if(response.data.rt[i].open){
                             jobTree_opend.push(response.data.rt[i].authCode)
                        }
                    }
                    vm.jobTree_checked = jobTree_checked,
                    vm.jobTree_opend = jobTree_opend,
                    vm.jobTree =  data.transformTozTreeFormat(setting, response.data.rt)
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        intoUserManager(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/Config/userIndex',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.rt.projId == vm.projId){
                    vm.getInfo()//获取用户列表
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        getInfo(){//获取用户列表
            var vm = this;
            console.log(this.pageDetial);
            console.log(this.userSearchInfo)
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/Config/searchProjectUserList/'+vm.projId,
                headers:{
                    'token':vm.token
                },
                params:{
                    page: vm.pageDetial.currentPage,
                    rows: vm.pageDetial.pagePerNum,
                    userName: vm.userSearchInfo,
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    vm.userSearchInfo ='';//搜索完清空
                    vm.userList = response.data.rt.rows;
                    vm.pageDetial.total = response.data.rt.total;
                    vm.pageDetial.pageNum =  Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
                
            }).catch((err)=>{
                console.log(err)
            })
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        addUser(id){
            var vm = this
            vm.adduser = true;
            if(id){//编辑用户
                vm.title = '编辑用户'
                 vm.userDetial.show = false
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/editProjectUser',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId: vm.projId,
                        userId: id,
                    }
                }).then((response)=>{
                    vm.userDetial.info = response.data.rt.projectUser
                    vm.userDetial.positions = response.data.rt.positions
                    vm.position_default = response.data.rt.positions[0]//工程管理员岗位
                    vm.position_list = response.data.rt.positions.slice(1)//可选其他岗位
                    vm.projUserId = response.data.rt.projUserId
                }).catch((err)=>{
                    console.log(err)
                })
            }else{
                  vm.title = '添加用户'
                vm.userDetial.show = true
                 axios({//添加用户
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/addProjectUser',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId: vm.projId,
                    }
                }).then((response)=>{
                vm.position_default = response.data.rt.positions[0]
                vm.position_list = response.data.rt.positions.slice(1)
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        userClose(){
            var vm = this
            //清空数据
            vm.userDetial.posName = ''
            vm.userDetial.posType = '1'
            vm.userDetial.show = true
            vm.userDetial.info = {}
            vm.adduser = false
        //     userDetial:{
        //     posName: "",
        //     posType: '1',
        //     show:true,
        //     info:{},//具体信息
        //   },
        },
        PostaddUser(){
             var vm = this
             var posIds = []
             var isAdmin = 1
             var hasPosition = false
            if(vm.position_default.checkFlg){
                posIds.push(vm.position_default.id+'')
                isAdmin = 2
                hasPosition = true
            }
            for(var i=0;i<vm.position_list.length;i++){
                if(vm.position_list[i].checkFlg){
                    posIds.push(vm.position_list[i].id+'')
                    hasPosition = true
                }
            }
            if(!vm.userDetial.info.userId){
                vm.$message({
                    type:'warning',
                    message:'请选择一个用户！'
                })
                return false
            }
            if(!hasPosition){
                vm.$message({
                    type:'warning',
                    message:'该用户至少选择一个岗位！'
                })
                return false
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/Config/saveProjectUser',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                },
                data:{
                    isAdmin: isAdmin,
                    posIds: posIds,
                    projUserId: vm.projUserId,
                    userId: vm.userDetial.info.userId+''
                }
            }).then((response)=>{
                 if(response.data.cd == 0){
                    vm.userClose()
                    vm.$message({
                        type:'success',
                        message:'添加用户成功！'
                    })
                    vm.getInfo()
                 }else{
                     vm.$message({
                         type:'error',
                         message:response.data.msg
                     })
                 }
            }).catch((err)=>{
                console.log(err)
            })
        },
        deleteUser(key){
            var vm = this
            vm.$confirm('您要删除当前所选用户吗？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr = [key]
                    console.log(arr)
                    axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/Config/delProjectUser',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                          projId:vm.projId  
                        },
                        data:arr
                    }).then((response)=>{
                        vm.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        vm.getInfo()
                    }).catch((err)=>{
                        console.log(err)
                    })
            }).catch(() => {
            vm.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
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
    select.inp-search {  
    /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
    /*很关键：将默认的select选择框样式清除*/  
    /* appearance:none;   */
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
        border-bottom:2px solid #ccc; 
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
        margin: 20px 20px 15px 15px;
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
       float: left;;
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
 </style>
 