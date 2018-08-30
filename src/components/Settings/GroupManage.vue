<template>
  <div class="wrapper" id="groupPage">
      <h4 class="title">群组管理</h4>
      <div class="container-left">
          <h1 class="icon-title icon-detial">
              群组详情
          </h1>
          <div>
              <p class="title-box">
                  <span class="title-left">群组名称:</span>
                  <span class="title-right">
                     <input type="text" v-model="ugEdit.name"  class="title-right-icon" :disabled="canEditname">
                     <span  class="title-right-edit-icon" @click="allowChangeName"></span>
                  </span>
              </p>
                <p class="title-box">
                  <span class="title-left">创建用户:</span>
                  <span class="info-title" v-text="ugInfo.createUser"></span>
              </p>
                <p class="title-box">
                  <span class="title-left">创立时间:</span>
                  <span class="info-title">{{ugInfo.createTime | toLocalD}}</span>
              </p>
               <p class="title-box">
                  <span class="title-left">群组标签:</span>
                   <span class="title-right">
                     <input type="text"  v-model="ugEdit.tag"  placeholder="请输入" class="title-right-icon" :disabled="canEditlabel">
                     <span  class="title-right-edit-icon" @click="allowChangeLabel"></span>
                  </span>
              </p>
                <p class="title-box">
                  <span class="title-left">群组状态:</span>
                  <span class="info-title">
                    <el-radio v-model="ugEdit.status" label="1" >启用</el-radio>
                    <el-radio v-model="ugEdit.status" label="0" >禁用</el-radio>
                  </span>
              </p>
                <p class="title-box">
                  <span class="title-left">群组成员:</span>
                 <span class="info-title" v-text="userQunzuNum"></span>
                 </p>
          </div>
            <h1 class="icon-title icon-group">
              群组成员
              <span class="icon icon-addMenber" @click="centerDialogVisible = true"></span>
              <span class="icon icon-deleteMenber" @click="deleteUser"></span>
            </h1>
          <ul>
              <li class="check-item" v-for="(item,index) in userQunzuList" :key="index">
                <el-checkbox class="hahaha"   @change="pushUserID(item.userId)" v-model="item.checked">
                    <span class="check-name" v-text="item.userName"></span>
                    <span class="check-title" v-text="item.account"></span>
                </el-checkbox>
              </li>
          </ul>
      </div>
      <div class="container-right">
        <h1 class="icon-title icon-qunzu">
            工程群组
            <span class="icon icon-Top" @click="changeQR_(-1)"></span>
            <span class="icon icon-Bottom" @click="changeQR_(1)"></span>
            <span class="icon icon-addqun" @click="addQR"></span>
        </h1>
        <ul style="max-height:300px;overflow-y:auto;">
            <li :class="[activeugID==item.ugId?'qun-item-active':'','qun-item']" v-for="(item,key) in ugList" :key="key" @click="changeQR(item.ugId,key,item,false)">
                <span class='title-qun' v-text="item.ugName"></span>
                <span class="icon icon-delect-qun" @click="deleteQR(item.ugId,item.ugName)"></span>
            </li>
        </ul>
        <!--一下功能暂未用到，所以隐藏了，不可删-->
        <!-- <h1 class="icon-title icon-subcomany" v-text="'项目公司【'+subCompanyName+'】的部门及合作单位'"></h1>
        <ul style="max-height:200px;overflow-y:auto;">
            <li :class="[activeugID==item.ugId?'qun-item-active':'','qun-item']" v-for="(item,key) in subCompanyList" :key="key" @click="changeQR(item.ugId,key,item,true)">
                <span class='title-qun' v-text="item.ugName"></span>
            </li>
        </ul> -->
      </div>
      <!--添加用户弹窗-->
      <el-dialog
        title="添加群组成员"
        :visible.sync="centerDialogVisible"
        :before-close="userClose"
        width="550px"
        center>
        <div class="clearfix">
            <div class="diolog-main">
                 <span class="title-right">
                     <input type="text" value="" v-model="userInfo"  placeholder="输入姓名" @keyup.enter="getUserInfo" class="title-right-icon" >
                     <span  class="el-icon-search" @click="getUserInfo"></span>
                  </span>
                  <ul style="max-height:320px;overflow-y: auto;">
                      <li class="userList-item" v-for="(item,key) in outsideUserList" :key="key" @click="addUser(item.userId,item.userName,item.account,item.userPositions,key)">
                          <p>
                            <span class="check-name" v-text="item.userName+'-'"></span>
                            <span class="check-title" v-text="item.account"></span>
                          </p>
                          <p>
                            <span class="check-title" v-text="val.posName" v-for="(val,index) in item.userPositions" :key="index+'position'" ></span>
                          </p>
                          <span :class="['icon','icon-selectUser',item.checked?'active':'']"></span>
                      </li>
                  </ul>
            </div>
            <div class="diolog-main">
                <div style="margin:20px 15px 20px 20px;">
                    <span>已选择群组成员</span>
                    <ul style="max-height:270px;overflow-y: auto;">
                      <li class="userList-item" v-for='(item,index) in userDetialAdd' :key="index">
                          <p>
                            <span class="check-name" v-text="item.name+'-'+item.count"></span>
                            <span class="check-title" v-text="item.name"></span>
                          </p>
                          <p>
                            <span class="check-title" v-for="(val,key) in item.userPositions" :key="key+'pos'" v-text="val.posName+' '"></span>
                          </p>
                          <span class="icon icon-cancleUser" @click="removeUserAdd(item.id)"></span>
                      </li>
                  </ul>
                </div>
                <span class="saveBTN" @click="saveUserQR">保存</span>
            </div>
        </div>
        </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
export default {
  name:'',
    data(){
        return {
            ugEdit:{
                name:'',
                tag:'',
                status:''
            },
            BDMSUrl:'',
            canEditname:true,
            canEditlabel:true,
            token:'',
            projId:'',//项目id
            userQunzuNum:'',
            userQunzuList:[],
            userInfo:'',
            centerDialogVisible: false,
            outsideUserList:[],//可添加的外部用户
            ugList:[],//工程群组
            activeugID:'',//正在查看的群组
            activeugIDkey:0,//正在查看的群组的index
            ugInfo:'',//群组详情
            userListDEL:[],//打算删除的用户id数组
            userListAdd:[],//打算添加的用户id数组
            userDetialAdd:[],//打算添加的用户id详情的数组
            checkedUgList:{},//被选中的工程群组
            subCompanyName:'',
            subCompanyList:[],
            isCompany:false,
        }
    },
    watch:{
        'ugEdit.status':function(newval,old){
            var vm = this
            if(old != '' && newval != ''){
                 if(vm.isCompany){
                    vm.$message({
                        type:'warning',
                        message: '部门和合作单位不能禁用！'
                    })
                    vm.ugEdit.status = "1"
                    return false
                }
                if(vm.ugEdit.name == "默认群组"|| vm.ugEdit.name == '质量验收' || vm.ugEdit.name == '质量检查' || vm.ugEdit.name == '安全验收' || vm.ugEdit.name == '安全检查'){
                    if(newval == "0"){
                        vm.$message({
                            type:'warning',
                            message: vm.ugEdit.name+'不能禁用!'
                        })
                        vm.ugEdit.status = "1"
                        return false
                    }
                }else{
                    this.EditStatus()
                }
            }
        }
    },
    created(){
        var vm = this
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.projId = localStorage.getItem('projId')//项目id
        vm.token  = localStorage.getItem('token')
        vm.intoQunzu()
    },
    filters:{
        toLocalD(val){
            return new Date(val).toLocaleString();
        }
    },
    methods:{
        userClose(){
            var vm = this
             vm.centerDialogVisible = false
            vm.userListAdd = []
            vm.userDetialAdd = []
            vm.outsideUserList.forEach((ele,index)=>{
                vm.$set(ele,'checked',false)
            })
        },
        saveUserQR(){
            var vm = this
            //userDetialAdd
            if(vm.userListAdd.length>0){
                for(let i=0;i<vm.userListAdd.length;i++){
                    let userName = vm.outsideUserList[i].userName
                    vm.addQzUsers(vm.userListAdd[i],userName)
                }
                setTimeout(function(){
                    vm.getQRuser(vm.activeugID)
                    vm.userClose()
                },1000)
            }else{
                vm.$message({
                    type: 'warning',
                    message: '请选择用户'
                });
            }
        },
        addQzUsers(userId,userName){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/Config/addUserGroupUser',
                headers:{
                    'token':vm.token
                },
                params:{
                    userId:userId,
                    ugId:vm.activeugID,//正在查看的群组ID
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$notify({
                        type: 'success',
                        message: '添加'+userName+'为群组用户成功',
                        duration:4000
                    })
                }else{
                    vm.$notify({
                        type: 'warning',
                        message: '添加'+userName+'为群组用户失败!'+response.data.msg,
                        duration:0
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        removeUserAdd(val){
            var vm = this
            if(vm.userListAdd.indexOf(val) != -1){
                var index = vm.userListAdd.indexOf(val)
                vm.userListAdd.splice(index,1)
                vm.userDetialAdd.splice(index,1)
                vm.outsideUserList.forEach((ele,index)=>{
                    if(ele.userId == val){
                        vm.$set(ele,'checked',false)
                    }
                })
            }
        },
        addUser(val,name,count,tag,key){
            var vm = this
            for(var k= 0;k<vm.userQunzuList.length;k++){
                if(vm.userQunzuList[k].userId == val){
                    vm.$message({
                        type:'warning',
                        message: '用户 "'+vm.userQunzuList[k].userName+'" 已在群组中!'
                    })
                    return false
                }
            }
            if(vm.userListAdd.indexOf(val) == -1){
                vm.userListAdd.push(val)
                vm.userDetialAdd.push({
                    id:val,
                    name:name,
                    count:count,
                    userPositions:tag
                })
                vm.outsideUserList.forEach((ele,index)=>{
                    if(key == index){
                          vm.$set(ele,'checked',true)
                    }
                })
            }
        },
        deleteUser(){//删除用户 modified by licongwen
            var vm = this;
            if(vm.userListDEL.length == 0){
                vm.$message({
                    type:'warning',
                    message: '请选择用户!'
                })
            }else{
                    vm.$confirm('此操作将删除选中用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.delEntUser()
                       
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
            },
            //删除企业用户信息
            delEntUser(){
               var vm = this
               /**判断群组名称是否为 默认群组**/
               var isDefaultCompany =  vm.ugList.some((item)=>{ 
                    if(vm.activeugID == item.ugId && item.ugName.indexOf('默认群组') >-1){
                        return true
                    }else{
                        return false
                    }
                })
               if(isDefaultCompany){
                    vm.$message({
                        type: 'warning',
                        message: '不能删除默认群组下的人员'
                    }); 
                   return
               }
               if(vm.isCompany){//子部门
                    for(var i=0;i<vm.subCompanyList.length;i++){
                         if(vm.subCompanyList[i].ugName == '默认部门' && vm.activeugID == vm.subCompanyList[i].ugId) {
                            vm.$message({
                                type: 'warning',
                                message: '不能删除默认部门下的人员'
                            });  
                            return;
                        }
                    }
                }
               for(var i=0;i<vm.userListDEL.length;i++){
                    axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/Config/delUserGroupUser',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                            userId:vm.userListDEL[i],
                            ugId:vm.activeugID,//正在查看的群组ID
                        }
                    }).then((response)=>{
                        if(response.data.cd == '0'){
                            vm.getQRuser(vm.activeugID)
                        }else if (response.data.cd == '-1'){
                            alert(response.data.msg)
                        }else{
                            vm.$router.push({
                                path:'/login'
                            })
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
                vm.userListDEL = []
            },
            pushUserID(id){
                var vm = this
                var index = vm.userListDEL.indexOf(id)
                if(index == -1){
                    vm.userListDEL.push(id)
                }else{
                    vm.userListDEL.splice(index,1)
                }
            },
            EditName(){
                var vm = this
                vm.$prompt('修改群组名称', '修改群组', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        axios({
                                method:'POST',
                                url:vm.BDMSUrl+'config/userGroup/renameGroupNameNode',
                                headers:{
                                    'token':vm.token
                                },
                                data:{
                                    projId:vm.projId,
                                    ugId:vm.activeugID,//正在查看的群组ID
                                    ugName:value,
                                }
                            }).then((response)=>{
                                if(response.data.cd == 0){
                                    vm.$message({
                                        type: 'success',
                                        message: '修改群组名称成功'
                                    });
                                    vm.changeQR(vm.activeugID,vm.activeugIDkey)
                                    vm.getQunListOnce()
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '取消修改'
                        });       
                    });
            },
            EditLabel(){
                var vm = this
                vm.$prompt('修改群组标签', '修改群组', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        axios({
                                method:'POST',
                                url:vm.BDMSUrl+'config/userGroup/updateUgTag',
                                headers:{
                                    'token':vm.token
                                },
                                data:{
                                    projId:vm.projId,
                                    ugId:vm.activeugID,//正在查看的群组ID
                                    ugTag:value,
                                }
                            }).then((response)=>{
                                if(response.data.cd == 0){
                                    vm.$message({
                                        type: 'success',
                                        message: '修改群组标签成功'
                                    });
                                    vm.changeQR(vm.activeugID,vm.activeugIDkey)
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '取消修改'
                        });       
                    });
            },
            EditStatus(){
                var vm = this
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'config/userGroup/updateUserGroupStatus',
                    headers:{
                        'token':vm.token
                    },
                    data:{
                        projId:vm.projId,
                        ugId:vm.activeugID,//正在查看的群组ID
                        ugStatus:vm.ugEdit.status,
                    }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$message({
                            type: 'success',
                            message: '修改群组状态成功'
                        });
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            addQR(){//添加群组
                var vm = this
                vm.$prompt('群组名称', '新建群组', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                }).then(({ value }) => {
                    var qunzuName = ''
                    qunzuName = $.trim(value)
                    if(qunzuName == ''){
                        vm.$message({
                            type: 'warning',
                            message: '群组名称不能为空！'
                        }); 
                        return false
                    }
                    vm.addQunzu(qunzuName)
                }).catch(() => {
                    vm.$message({
                        type: 'info',
                        message: '取消添加'
                    });       
                });
            },
            addQunzu(value){
                var vm = this
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'config/userGroup/add',
                    headers:{
                        'token':vm.token
                    },
                    data:{
                        projId:vm.projId,
                        ugName:value,
                        ugOrder:11,
                        ugParId:0,
                        ugStatus:1,
                        ugType:0
                    }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$message({
                            ype: 'success',
                            message: '创建成功'
                        });
                        vm.getQunList()
                    }else{
                        vm.$message({
                            type: 'warning',
                            message: response.data.msg
                        });
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            deleteQR(ugId,name){//删除群组
                var vm = this   
                if(name == "默认群组"|| name == '质量验收' || name == '质量检查' || name == '安全验收' || name == '安全检查'){
                    vm.$message({
                        type:'warning',
                        message: name+'不能删除！'
                    })
                    return false
                }
                vm.$confirm('您要删除所选群组['+ name +']吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method:'POST',
                        url:vm.BDMSUrl+'config/userGroup/delGroupNode',
                        headers:{
                            'token':vm.token
                        },
                        params:{
                            ugId:ugId
                        }
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            vm.$message({
                                type:'success',
                                message: name+'删除成功'
                            })
                             vm.userListDEL = []
                        }else if(response.data.cd == -1){
                            vm.$message({
                                type:'error',
                                message: response.data.msg
                            })
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch(() => {
                    vm.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            allowChangeName(){
                var vm = this
                console.log(vm.ugEdit.name.indexOf('默认群组'))
                if(vm.ugEdit.name.indexOf('默认群组')>=0){
                     vm.$message({
                        type: 'warning',
                        message: '【默认群组】不能重命名！'
                    })
	            	return;
                }
                if(vm.isCompany){
                     vm.$message({
                        type: 'warning',
                        message: '【默认群组】不能重命名！'
                    })
	            	return;
                }
                vm.EditName()
            },
            allowChangeLabel(){
                var vm = this
                vm.EditLabel()
            },
        intoQunzu(){
            var vm = this
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/groupIndex',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId:vm.projId
                    }
                }).then((response)=>{
                    if(response.data.rt.projId == vm.projId){
                        vm.getUserInfo()
                        vm.getQunList()
                    }
                }).catch((err)=>{
                    console.log(err)
                })
        },
        getUserInfo(){//获得工程用户列表
                var vm = this
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/projectUserList',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId:vm.projId,
                        queryParam:vm.userInfo
                    }
                }).then((response)=>{
                    if(response.data.rt != null){
                        vm.outsideUserList = response.data.rt
                        vm.outsideUserList.forEach((ele)=>{
                            vm.$set(ele,'checked',false)
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
        },
        getQunList(){//获得工程群组列表
                var vm = this;
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'config/userGroup/list',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId:vm.projId,
                        data :''
                    }
                }).then((response)=>{
                    if(response.data.cd == '0'){
                        vm.subCompanyName = response.data.rt.projCompany
                        if(response.data.rt.ugList){
                            vm.ugList = []
                            vm.subCompanyList = []
                            var entDept = [],entCoop=[]
                            for(var i=0;i<response.data.rt.ugList.length;i++){
                                if(response.data.rt.ugList[i].ugName == '默认群组'){
                                    vm.activeugID = response.data.rt.ugList[i].ugId;
                                    vm.activeugIDkey = i;
                                    vm.changeQR(response.data.rt.ugList[i].ugId,i);
                                    vm.getQRuser(response.data.rt.ugList[i].ugId);
                                    vm.checkedUgList = response.data.rt.ugList[i];
                                }
                                if(response.data.rt.ugList[i].ugType == 2){
                                    vm.ugList.push(response.data.rt.ugList[i])
                                }else if(response.data.rt.ugList[i].ugName == '质量验收' || response.data.rt.ugList[i].ugName == '质量检查' || response.data.rt.ugList[i].ugName == '安全验收' || response.data.rt.ugList[i].ugName == '安全检查'){
                                    vm.ugList.push(response.data.rt.ugList[i])
                                }else if(response.data.rt.ugList[i].ugType == 4){
                                    entDept.push(response.data.rt.ugList[i])
                                }else if(response.data.rt.ugList[i].ugType == 5){
                                    entCoop.push(response.data.rt.ugList[i])
                                }else{
                                    vm.ugList.push(response.data.rt.ugList[i])
                                }
                            }
                            vm.subCompanyList = entDept.concat(entCoop)
                        }else if(response.data.cd == '-1'){
                            alert(response.data.msg);
                        }else{
                            vm.$router.push({
                                path:'/login'
                            })
                        }
                    }  
                    
                }).catch((err)=>{
                    console.log(err)
                })
            },
            //上下移动群组的功能modified by licongwen
            changeQR_(index){
                var vm = this;
                if(index == -1){
                    if(vm.activeugIDkey == 0){
                        alert('已经是最上面一个群组!');
                    }else{
                        var preUgid = '';
                        vm.ugList.forEach((item,index,arr)=>{
                            if(item.ugName == vm.checkedUgList.ugName){
                                preUgid = arr[index-1].ugId;
                                vm.activeugIDkey= index;
                            }
                        });
                        axios({
                            method:'post',
                            url:vm.BDMSUrl+'config/userGroup/moveUpGroupNode',
                            headers:{
                                token:vm.token
                            },
                            params:{
                                prevUgId:preUgid,
                                ugId:vm.checkedUgList.ugId
                            } 
                        }).then(response=>{
                            if(response.data.cd == '0'){
                                vm.getQunListOnce();
                            }else if(response.data.cd == '-1'){
                                    alert(response.data.msg);
                            }else{
                                vm.$router.push({
                                    path:'/login'
                                })
                            }
                        })
                    }
                }else if(index == 1){
                    if(vm.activeugIDkey == vm.ugList.length-1){
                        alert('已经是最下面一个群组!');
                    }else{
                        var nextUgidC = '';
                        vm.ugList.forEach((item,index,arr)=>{
                            if(item.ugName == vm.checkedUgList.ugName){
                                nextUgidC = arr[index+1].ugId;
                                vm.activeugIDkey = index;
                            }
                        });
                        axios({ 
                            method:'post',
                            url:vm.BDMSUrl+'config/userGroup/moveDownGroupNode',
                            headers:{
                                token:vm.token
                            },
                            params:{
                                nextUgId:nextUgidC,
                                ugId:vm.checkedUgList.ugId
                            },
                            data:{} 
                        }).then(response=>{
                            if(response.data.cd == '0'){
                                vm.getQunListOnce();
                            }else if(response.data.cd == '-1'){
                                    alert(response.data.msg);
                            }else{
                                vm.$router.push({
                                    path:'/login'
                                })
                            }
                        })
                    }
                }
            },
        //工程群组，设置默认数组为当前数组
        getQunListOnce(){
            var vm = this;
            axios({
                method:'POST',
                url:vm.BDMSUrl+'config/userGroup/list',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    data:''
                },
                
            }).then((response)=>{
                if(response.data.cd == '0'){
                     if(response.data.rt.ugList){
                        vm.ugList = response.data.rt.ugList;//工程群组
                        for(var i=0;i<vm.ugList.length;i++){
                            if(vm.ugList[i].ugName == vm.checkedUgList.ugName){
                                vm.activeugID = vm.ugList[i].ugId;
                                vm.activeugIDkey = i;
                                vm.changeQR(vm.ugList[i].ugId,i);
                                vm.getQRuser(vm.ugList[i].ugId);
                                vm.checkedUgList = vm.ugList[i];
                            }
                        }
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg);
                    }else{
                        vm.$router.push({
                            path:'/login'
                        })
                    }
                }  
                    
            }).catch((err)=>{
                console.log(err)
            })
        },
        changeQR(val,index,item,isCompany){//切换群组，根据群组ID获取群组信息
            var vm = this;
            vm.checkedUgList = item;
            if(isCompany)vm.isCompany = isCompany
            if(val){
                vm.ugEdit.status = ''
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'config/userGroup/findCompanyUserGroupByNodeId',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        ugId:val,
                    }
                 }).then((response)=>{
                    vm.activeugID = val
                    vm.activeugIDkey = index
                    vm.ugInfo = response.data.rt//工程群组
                    //增添群组信息
                    vm.ugEdit.name = vm.ugInfo.ugName 
                    vm.ugEdit.tag = vm.ugInfo.ugTag
                    vm.ugEdit.status = vm.ugInfo.ugStatus
                    vm.ugEdit.status =  response.data.rt.ugStatus+''
                    vm.userListDEL = []
                    vm.getQRuser(val)
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        getQRuser(val){//根据群组ID获取群组用户列表
            var vm = this;
            if(val){
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/userGroupUserList',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        ugId:val,
                        projId:vm.projId
                    }
                }).then((response)=>{
                    if(response.data.cd == '0'){
                        vm.userQunzuNum = response.data.rt.length//工程用户总数
                        vm.userQunzuList = response.data.rt//工程群组用户列表
                        vm.userQunzuList.forEach(item=>{
                            vm.$set(item,'checked',false)
                        })
                    }else if(response.data.cd == '-1'){
                        // alert(response.data.msg);
                    }else{
                        vm.$router.push({
                            path:'/login'
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }   
        },
    }
}
</script>
<style  lang='less'>
#groupPage{
    width: 100%;
    display: block;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    /***********设置滚动条************/
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width:7px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        box-shadow: inset006pxrgba(0,0,0,0.5);
        -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
        border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        box-shadow: inset006pxrgba(0,0,0,0.5);
        -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
    }
    /*********************/
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
        position: relative;
        li{
            list-style: none;
        }
    *{
          box-sizing: border-box;
          padding: 0;
          margin: 0;
    }
    .title{
        position: absolute;
        top: -53px;
        bottom: 0;
        left: 0px;
        right: 0px;
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        border-bottom:2px solid #ccc; 
        height: 52px;
      line-height: 35px;
        padding:10px 15px 0;
        text-align: left;
        background: #fff;
        z-index: 10;
    }
    .container-left{
        display: block;
        margin-right: 288px;
        padding: 20px;
        margin-top: 50px;
        box-sizing: border-box;
    }
    .container-right{
        display: block;
        position: absolute;
        top: 0px;
        bottom: 0;
        right: 0;
        width: 288px;
        min-height: 600px;
        padding-right: 15px;
        background: #fff;
        border-left: 1px solid #e6e6e6;
    }   
    .icon-title{
        display: block;
        font-size: 16px;
        font-weight: bold;
        color: #fc3439;
        text-align: left;
        margin:0 0 20px 24px;
        position: relative;
        line-height: 16px;
        &::after{
            display: block;
            position: absolute;
            top: 0px;
            left: -24px;
            width: 16px;
            height: 16px;
            content: '';
        }
    }
    .icon-detial::after{
        background: url('./images/xiangqing.png')no-repeat 0 0;
    }
    .icon-group{
        border-bottom: 1px solid #e6e6e6;
       margin: 0 0 0px 0px;
       padding-left: 24px; 
       padding-bottom: 10px;
        &::after{
             left: 0px;
        background: url('./images/chengyuan.png')no-repeat 0 0;
        }
    }
    .icon{
       display: block;
        position: absolute;
        top: 3px;
        right: 30px;
        width: 17px;
        height: 17px;
        background-size: 100% 100%; 
        cursor: pointer;    
    }
     .icon-addMenber{
            background-image: url('./images/3-1.png');
            &:hover{
                background-image: url('./images/3-2.png');
            }
    }
    .icon-deleteMenber{
        right: 0;
        background-image: url('./images/4-1.png');
        &:hover{
            background-image: url('./images/4-2.png');
        }
    }
    .icon-addqun{
         top: 18px;
        right: 0px;
        background-image: url('./images/3-1.png');
        &:hover{
            background-image: url('./images/3-2.png');
        }
    }
    .icon-Top{
         top: 18px;
        right: 50px;
        background-image: url('./images/6-1.png');
        &:hover{
            background-image: url('./images/6-2.png');
        }
    }
    .icon-Bottom{
        top: 18px;
        right: 25px;
        background-image: url('./images/5-1.png');
        &:hover{
            background-image: url('./images/5-2.png');
        }
    }
    .icon-qunzu{
         margin: 0;
         padding: 20px 0 10px 50px;
         border-bottom: 1px solid #e6e6e6;
         &::after{
         background: url('./images/liebiao.png')no-repeat 0 0;
         left: 20px;
         top: 20px;
         width: 18px;
         }
    }
    .icon-subcomany{
        margin: 0;
         padding: 20px 0 10px 50px;
         border-bottom: 1px solid #e6e6e6;
         &::after{
         background: url('./images/subcompany.png')no-repeat 0 0;
         left: 20px;
         top: 20px;
         width: 18px;
         }
    }
    .qun-item{
        text-align: left;
        height: 36px;
        line-height: 36px;
        color: #666666;
        font-size: 12px;
        padding-left:38px;
        cursor: pointer; 
        position: relative;
        &:hover{
           background: #f3f3f3;
        }
    }
    .qun-item-active{
        color: #333333;
        font-size: 12px;
        background: #f3f3f3;
        font-weight: bold;
        .icon-delect-qun{
           display: block;
        }
    }
    .icon-delect-qun{
        display: none;
        top: 11px;
        right: 17px;
         background: url('./images/4-2.png')no-repeat 0 0;
    }
    .title-box{
        margin:0 0 17px;
        height: 36px;
        line-height: 36px;
        .title-left{
            float: left;
            width: 75px;
            text-align: left;
            font-size: 14px;
            color: #999999;
        }
        .info-title{
            float: left;
            color: #333333;
            font-size: 14px;
            text-align: left;
        }
        .title-right{
            display: block;
            padding-left: 75px;
            width: 100%;
            height: 100%;
            position: relative;
            .title-right-icon{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 2px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:40px;
                margin-right: 5px;
            }
            .el-icon-search{
                position: absolute;
                right: 10px;
                top: 8px;
            }
        }
        .el-radio__label{
            font-size: 14px;
            color: #333333;
            margin: 0 30px 0 5px;
        }
    }
    .check-item{
        padding: 0px 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #e6e6e6;
        text-align: left;
        &:hover{
            background: #f6f6f6;
        }
        .el-checkbox{
            width: 100%;
            height: 100%;
            display: block;
            .check-name{
                margin-left: 10px;
                color: #333333;
                font-size: 14px;
            }
            .check-title{
                color:#999999;
                font-size: 12px;
            }
        }
    }


    //对话窗
    .el-dialog {
        position: relative;
        margin: 0 auto 50px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        box-sizing: border-box;
        .el-dialog__header{
            display: block;
            padding: 26px 0 16px;
            border-bottom: 1px solid #cccccc;
            .el-dialog__title{
                font-size: 18px;
                color: #fc3439;
                font-weight: bold;
                line-height: 18px;
            }
            .el-dialog__headerbtn{
                top: 8px;
                right: 8px;
            }
        }
        .diolog-main{
            float: left;
            width: 50%;
            height: 395px;
            &:first-of-type{
                border-right: 1px solid #e6e6e6;
                padding-left: 20px;
            }
            .title-right{
                display: block;
                margin: 10px 10px 0 0;
                height: 28px;
                position: relative;
                .title-right-icon{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                    border: 1px solid #e6e6e6;
                    position: relative;
                    background: #fafafa;
                    padding-left:10px;
                    padding-right:40px;
                    margin-right: 5px;
                }
                 .el-icon-search{
                        position: absolute;
                        right: 10px;
                        top: 8px;
                        cursor: pointer;
                }
            }
             .userList-item{
                margin-top: 14px;
                position: relative;
                p{
                    height: 20px;
                }
                .check-name{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    color: #333333;
                }
                .check-title{
                    display: inline-block;
                    font-size: 12px;
                     line-height: 14px;
                    color: #999999;
                }
                .icon-selectUser{
                    width: 14px;
                    height: 14px;
                    top: 14px;
                    right: 14px;
                    background-image:url('./images/a-1.png'); 
                    &:hover{
                         background-image:url('./images/a-2.png'); 
                    }
                }
                .icon-cancleUser{
                    width: 14px;
                    height: 14px;
                    top: 14px;
                    right: 14px;
                    background-image:url('./images/b-1.png'); 
                }
                &:hover .icon-cancleUser{
                    background-image:url('./images/b-2.png'); 
                }
                .icon-selectUser.active{
                     background-image:url('./images/a-2.png'); 
                }
            }
            .saveBTN{
                position: absolute;
                bottom: 20px;
                right: 15px;
                width: 96px;
                height: 28px;
                line-height: 28px;
                border-radius: 2px;
                background: #fc3439;
                font-size: 14px;
                color: #ffffff;
                text-align: center;
                cursor: pointer;
            }
        }
    }
       .title-right-edit-icon{
            display: block;
            position: absolute;
            top: 10px;
            right: 8px;
            width: 16px;
            height: 16px;
            content: '';
            background: url('./images/1-1.png')no-repeat 0 0;
            cursor: pointer;
            &:hover{
               background: url('./images/1-2.png')no-repeat 0 0; 
            }
        }
}
</style>