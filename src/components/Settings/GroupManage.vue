<template>
  <div class="wrapper">
      <h4 class="title">群组管理</h4>
      <div class="groupManage">
          <div class="groupInfo">
              <h5><i class="el-icon-document"></i>群组详情</h5>
              <ul>
                  <li><label>群组名称:</label><el-input class="inp"></el-input></li>
                  <li><label>创立用户:</label><span class="text">系统</span></li>
                  <li><label>创立时间:</label><span class="text">2017-06-14 17：54</span></li>
                  <li><label>群组标签:</label><el-input class="inp" placeholder="请输入"></el-input></li>
                  <li><label>群组状态:</label><span ><el-radio v-model="radio" label="1">启用</el-radio>
  <el-radio v-model="radio" label="2">禁用</el-radio></span></li>
                  <li><label>群组成员:</label><span class="text">15</span></li>
              </ul>
              <div >
                  <h5 class="teamTitle"><i class="el-icon-document"></i>群组成员 <span class="groupIcon" ><i @click="addMember" class="el-icon-circle-plus-outline"></i><i @click="deleteMember" class="el-icon-delete"></i></span></h5>
                  <div class="groupTeam">
                      <el-table :data="tableData3" style="width:95%;" border>
                        <el-table-column type="selection">
                            
                        </el-table-column>
                        <el-table-column label="姓名" prop="name" align="left">
                            
                        </el-table-column>
                    </el-table>
                  </div>
                  
              </div>
          </div>
          
          <div class="groupList">
              <h5><i class="el-icon-edit-outline"></i>群组列表<span class="groupIcon"><i @click="removeTop()" class="el-icon-caret-top"></i><i @click="removeDown()" class="el-icon-caret-bottom"></i><i @click="addGroupMenber" class="el-icon-circle-plus-outline"></i></span></h5>
              <ul class="grouplist">
                  <li :class="{active:activeClass===index}"  @click="addBackground(index)" v-for="(item,index) in groupList" :key="index">{{item}}<span class="groupListIcon" @click="deleteGroupMember(index)"><i class="el-icon-delete"></i></span></li>
              </ul>
              <div>
                  <h5><i class="el-icon-document"></i>项目公司的部门及合作单位</h5>
                  <ul>
                    <li>默认部门</li>
                    <li>运输部门</li>
                    <li>上海设计院</li>
                </ul>
              </div>
          </div>
      </div>
      <!--dialog-->
      <el-dialog title="添加群组成员" :visible.sync="addMemberShow">
        <div class="dialog">
            <div class="dialogLeft">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="请输入姓名" suffix-icon="el-icon-search" style="width:80%"></el-input>
                    </el-form-item>
                </el-form>
                <ul class="dialogLeftUl">
                    <li>
                        WZQWZQ<span><i class="el-icon-success"></i></span>
                        <p>工程管理员，项目经理</p>
                    </li>
                    <li>
                        WZQWZQ<span><i class="el-icon-success"></i></span>
                        <p>工程管理员，项目经理</p>
                    </li>
                </ul>
            </div>
            <div class="dialogRight">
                <p>已选择的群组成员</p>
                <ul class="dialogRightUl">
                    <li>
                        WZQWZQ<span><i class="el-icon-error"></i></span>
                        <p>工程管理员，项目经理</p>
                    </li>
                    <li>
                        王自强-WZQ<span><i class="el-icon-error"></i></span>
                        <p>工程管理员</p>
                    </li>
                </ul>
                <div class="btn">
                    <el-button  type="primary" @click="addMemberShow = false">保存</el-button>
                </div>
                
            </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer" >
            <el-button type="primary" @click="addMemberShow = false">确 定</el-button>
        </span> -->
        </el-dialog>

        <el-dialog title="新建群组" :visible.sync="addgroupList">
        <el-form label-width="150px" label-position="right">
            <el-form-item label="群组名称">
                <el-input v-model="groupName"  placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <p class="groupErr" v-show="groupErr">请输入群组名称</p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addGroupConfirm">确 定</el-button>
            <el-button @click="cancelGroup">取 消</el-button>
        </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name:'GroupManage',
  data(){
      return {
          radio:'1',
          tableData3:[{
              name:'王自强',
              label:'姓名'
          },
          {
              name:'王自强',
              label:'姓名'
          }],
          groupList:['【安全检查】','建设单位','施工单位','监督单位','估价单位'],
          addMemberShow:false,
          addgroupList:false,
          groupName:'',
          groupErr:false,
          activeClass:'-1'
      }
  },
  created(){
    
  },
  methods:{
      addMember(){
          this.addMemberShow = true;
          console.log(123);
      },
      deleteMember(){
          console.log('you click delete button');
      },
      deleteGroupMember(index){
          console.log(index);
          if(index === 0){
              alert('默认群组不能删除')
          }else{
              this.groupList.splice(index,1)
          }
      },
      addGroupMenber(){
          this.addgroupList = true;
          console.log(123);
      },
      addGroupConfirm(){
          if(this.groupName!==''){
              this.groupList.push(this.groupName);
              this.groupErr = false;
              this.addgroupList = false;
          }else{
              this.groupErr = true;
          }
          
      },
      cancelGroup(){
          this.addgroupList = false;
      },
      addBackground(index){
          this.activeClass = index;
      },
      //上移
      //vue无法实现对数组 用索引变化引起的双向绑定，无法检测改变数组长度引起的变化
      //利用splice实现所有的操作，利用Vm.set实现索引的操作
      //vue不能检测对象属性的添加或删除
      removeTop(){

          if(this.activeClass === 0){
              alert('不能上移');
          }else{
              var first = this.groupList[this.activeClass];
              var second = this.groupList[this.activeClass-1];
              this.groupList.splice(this.activeClass-1,1,first);
              this.groupList.splice(this.activeClass,1,second);
          }
      },
      //下移
      removeDown(){
          if(this.activeClass === this.groupList.length-1){
              alert('不能下移');
          }else{
              var first = this.groupList[this.activeClass];
              var second = this.groupList[this.activeClass+1];
              this.groupList.splice(this.activeClass+1,1,first);
              this.groupList.splice(this.activeClass,1,second);
            
          }
      }
  }
}
</script>
<style scoped>
    .active{
        background: #f3f3f3;
    }
    .wrapper{
        width: 100%;
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
    .groupManage{
        display: flex;
    }
    .groupInfo{
        flex: 1;
        border-right: 1px solid #e6e6e6;
    }
    .groupList h5,.groupInfo h5{
        color: red;
        text-align: left;
        height: 30px;
        line-height: 30px;
    }
    .groupInfo ul{
        list-style: none;
        padding: 0;

    }
    .groupInfo li{
        width: 100%;
        display: flex;
    }
    .groupInfo label{
        width: 100px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
    .groupInfo .text{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        display: inline-block;
        width: 60%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: left;
    }
    .teamTitle{
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e6e6e6;

    }
    /* .groupTeam{
        display: flex;
    } */
    .groupList{
       width: 280px;
       margin-left: 20px;
    }
    .groupIcon{
        width: 100px;
        float: right;
        height: 30px;
        line-height: 30px;
    }
    .groupIcon i{
        width: 20px;
        margin-left:10px;
        display: inline-block;
        cursor: pointer; 
    }
    .inp{
        width: 70%;
    }

    .groupList ul{
        width: 100%;
        padding: 0;
        list-style: none;
    }
    .groupList li{
        width: 100%;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        margin: 6px auto;
        cursor: pointer;
        text-align: center;
    }
    .groupList li:hover{
        background: #f3f3f3;
    }   
    
    .groupListIcon{
        float: right;
        color: #7697b8;
        visibility: hidden;
    }
    .groupList li:hover .groupListIcon{
        background: #f3f3f3;
        visibility: visible;
    }  
    .groupErr{
        color: red;
        text-align: left;
    }
    /*dialog*/
    .dialog{
        display: flex;
    }
    .dialogLeft{
        flex: 1;
        border-right: 1px solid #ccc;
    }
    .dialogRight{
        flex: 1;
    }
    .dialogLeft ul,.dialogRight ul{
        list-style: none;
        font-size: 12px;
        text-align: left;
        padding: 0;
    }
    .dialogRight  p{
        text-align: left;
        width: 70%;
        margin-left: 10%;
        color: #d3d3d3;
    }
    .dialogLeftUl,.dialogRightUl{
        margin-left: 10%;
    }
    .dialogLeftUl li, .dialogRightUl li{
        width: 80%;
    }
    .dialogLeftUl p,.dialogRightUl p{
        margin: 3px 0;
        color: #d3d3d3;
    }
    .dialogLeftUl span,.dialogRightUl span{
        float: right;
        cursor: pointer;
    }
    .btn{
        text-align: right;
        width: 80%;
    }
    .addActive{
        color: #33cc66;
    }
    .deleteActive{
        color:red;
    }
</style>