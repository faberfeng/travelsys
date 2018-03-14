<template>
  <div class="wrapper">
      <h4 class="title">岗位管理</h4>
      <div class="usermanage">
          <h5 class="subtitle">用户列表<span class="subSpan"><el-input suffix-icon="el-icon-search" class="inp" placeholder="输入姓名"></el-input><el-button @click="addUser" class="btn" type="primary">+添加</el-button></span></h5>
          <el-table style="width:98%;" border :data="userList">
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="账号" prop="account"></el-table-column>
              <el-table-column label="工程管理员" prop="administrator"></el-table-column>
              <el-table-column label="已被分配到的岗位" prop="department"></el-table-column>
              <el-table-column label="添加时间" prop="addtime"></el-table-column>
              <el-table-column label="添加人" prop="operator"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="editIcon" @click="editUser"  type="text" size="small"><i class="el-icon-edit-outline"></i></el-button>
                    <el-button class="deleteIcon" @click.native.prevent="deleteRow(scope.$index, userList)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                </template>
              </el-table-column>
          </el-table>
          <div class="pagination">
                <el-pagination
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                 layout="total, sizes, prev, pager, next, jumper"
                :total="199">
                </el-pagination>
            </div>
      </div>
      <!--dialog-->
        <el-dialog class="openDialog" title="添加用户" :visible.sync="adduser" :before-close="userClose">
            <div class="userTop">
                <div class="userTopLeft">   
                    查找用户
                </div>
                <div class="userTopRight">
                    <span class="radio">
                        <el-radio v-model="radio" label="email">邮箱</el-radio>
                        <el-radio v-model="radio" label="account">账号</el-radio>
                    </span> 
                    <el-input class="dialogInp" placeholder="请输入"></el-input><el-button class="dialogBtn" type="primary">查询</el-button>
                </div>
            </div>
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
<script>
export default {
  name:'UserManage',
  data(){
      return {
          userList:[{
              name:'月树桥',
              account:'weimenzhi',
              administrator:'是',
              department:'工程管理员',
              addtime:'2018/02/02 9:18',
              operator:'系统'

          },{
              name:'月树桥',
              account:'weimenzhi',
              administrator:'是',
              department:'工程管理员',
              addtime:'2018/02/02 9:18',
              operator:'系统'
          },{
              name:'月树桥',
              account:'weimenzhi',
              administrator:'是',
              department:'工程管理员',
              addtime:'2018/02/02 9:18',
              operator:'系统'
          }],
          adduser:false,
          edituser:false,
          radio: 'email',
          checked:false
      }
  },
  methods:{
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        addUser(){
            this.adduser = true;
            console.log('add user')
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
    .title{
        color: red;
        width: 100%;
        border-bottom:1px solid #ccc; 
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding:10px 0px;
        margin: 0;
    }
    .subtitle{
        color: red;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding:10px 0px;
        margin: 0;
    }
    .subSpan{
        float: right;
        width: 50%;
        height: 40px;
        line-height: 40px;
    }
    .inp{
        width: 60%;
    }
   .btn{
        float: right;
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