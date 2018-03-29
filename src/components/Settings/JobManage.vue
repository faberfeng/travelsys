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
                    <el-tree
                    :data="jobTree"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                    </el-tree>
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
import data from './js/date.js'

export default {
  name:'',
  data(){
      return {
          jobList:[],//岗位列表
          jobTotalNum:0,//最大岗位数
          posType:'',//岗位类型
          jobTree:[],
          defaultProps: {
            children: 'undefined',
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
      vm.getJobShuXingTu()
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
               vm.jobTree =  data.transformTozTreeFormat(setting, response.data.rt)
                 console.log(vm.jobTree)
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
 </style>
 