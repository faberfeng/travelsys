<template>
  <div class="wrapper" id="jobPage">
      <h4 class="title">岗位管理</h4>
      <div class="usermanage">
          <h5 class="subtitle">岗位列表
              <span class="subSpan">
                  <select v-model="posType" class="inp-search">
                        <option value="">全部岗位</option>
                        <option value="0">企业岗位</option>
                        <option value="1">工程内岗位</option>
                        <option value="2">合作方岗位</option>
                  </select>
                  <i class="icon-sanjiao"></i>
                  <span @click="addUser()" class="btn">添加</span>
             </span>
          </h5>
          <div style="padding:0 20px;box-sizing: border-box;">
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
                                <span v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位'))"
                                 class="editIcon" @click="addUser(val.posType,val.posName,val.id)"></span>
                                <span v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位')) && !(val.posName == '默认岗位' && val.posTypeName == '合作方岗位')" 
                                class="deleteIcon" @click="deleteJob(val.id)"></span>
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
                                 <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial.total/pageDetial.pagePerNum)}}页</span>
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
                                <a href="javascript:void(0)" @click="this.getInfo" class="btn-refresh btn-TAB"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                <div style="clear:both;"></div>
            </div>
      </div>
        <el-dialog class="openDialog" :title="title" :visible.sync="adduser" :before-close="userClose">
            <div class="log-head clearfix" v-if="idDefault">
                <span class="log-head-title">岗位名称:</span>
                <el-radio :disabled='idDefault'  v-model="defaultCode" label="1">工程内岗位</el-radio>
                <el-radio :disabled='idDefault'  v-model="defaultCode" label="2">合作方岗位</el-radio>
            </div>
            <div class="log-head clearfix" v-else>
                <span class="log-head-title">岗位名称:</span>
                <el-radio  v-model="jobDetial.posType" label="1">工程内岗位</el-radio>
                <el-radio  v-model="jobDetial.posType" label="2">合作方岗位</el-radio>
            </div>
            <div  class="JobName">
                <input type="text" v-model="jobDetial.posName" placeholder="请输入" :disabled='checkName(jobDetial.posName)'>
            </div>
            <div  class="log-body clearfix">
                <span class="log-head-title">岗位权限:</span>
                <!--树形图-->
                <el-tree
                :data="jobTree"
                show-checkbox
                node-key="authCode"
                :default-expanded-keys="jobTree_opend"
                :default-checked-keys="jobTree_checked"
                ref="tree_job"
                highlight-current
                :props="defaultProps">
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">   
                <el-button type="primary" @click="PostaddUser">保存</el-button>
                <el-button @click="userClose">取 消</el-button>
            </span>
        </el-dialog> 
  </div>
</template>

<script>
import axios from 'axios'
import './js/jquery-1.4.4.min.js'
import data from './js/date.js'
export default {
    name:'',
    data(){
        return {
            title:'增加岗位',
            jobList:[],//岗位列表
            jobList:[],//总体的岗位列表
            posType:'',//岗位类型
            jobTree:[],
            jobTree_checked:[],
            jobTree_opend:[],
            defaultProps: {
                children: 'undefined',
                label: 'authName'
            },
            adduser:false,
            edituser:false,
            radio: 'email',
            checked:false,
            projId:'',
            jobID:0,
            jobDetial:{
                authCodes: [],
                posId: '',
                posName: "",
                posType: '1'
            },
            pageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            token:'',
            BDMSUrl:'',
            checkCode:[],
            idDefault:false,
            defaultCode:'1',
        }
    },
    watch:{
        posType:function(newVal,old){
            this.getInfo()
        },
        'pageDetial.pagePerNum':function(newVal,old){//多重属性用''阔起
            this.pageDetial.currentPage = 1;
            this.getInfo();
        },
        'pageDetial.currentPage':function(newVal,old){//多重属性用''阔起
            this.getInfo()
        }
    },
    created(){
        var vm = this
        vm.projId = localStorage.getItem('projId')//项目id
        vm.token  = localStorage.getItem('token')
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.intoJobManager();
        vm.getJobShuXingTu();
    },
    methods:{
        checkName(name){
            var vm = this
            if(name != '' && name.indexOf('默认岗位') == -1){
                return false
            }
            return 'disabled'
        },
        changePage(val){//分页 0 -1 1 2
            var vm = this; 
            if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                vm.$message('这已经是第一页!')
                return false
            }else if(vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
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
                        vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum)
                        break;
                }
            }
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
        intoJobManager(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/Config/positionIndex',
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
                url:vm.BDMSUrl+'project2/Config/searchPositionList/'+vm.projId,
                headers:{
                    'token':vm.token
                },
                params:{
                    page: vm.pageDetial.currentPage,
                    rows: vm.pageDetial.pagePerNum,
                    posType: vm.posType,
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    vm.jobList = response.data.rt.gridDataJson.rows;
                    vm.pageDetial.total = response.data.rt.gridDataJson.total;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
                
            }).catch((err)=>{
                console.log(err);
            })
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        addUser(type,name,val){
            var vm = this;
            vm.adduser = true;
            if(val){
                vm.jobDetial.posName = name;
                vm.jobDetial.posType = ''+type;
                vm.jobID = parseInt(val)
                vm.title = '修改岗位'
                vm.getJobShuXingTu()//获取某val的权限
            }else{
                vm.jobDetial.posName = '';
                vm.jobDetial.posType = '1';
                vm.jobID = 0
                vm.title = '增加岗位'
                vm.getJobShuXingTu()//获取某val的权限
            }
            if(type == 1 || type == 2){
                vm.idDefault = false
            }else if(type == 3 || type == 4){
                vm.idDefault = true
            }
        },
        userClose(){
            var vm = this
                //清空数据
            vm.jobDetial.posName = '';
            vm.jobDetial.posType = '1';
            vm.adduser = false;
            //vm.$refs.tree_job.setCheckedKeys([]);
            vm.getJobShuXingTu();
        },
        PostaddUser(){
            var vm = this;
            //var checkCode = [];
            console.log(vm.jobDetial)
            this.checkCode = vm.$refs.tree_job.getCheckedKeys();
            if(vm.jobID == 0){
                var flag = this.jobList.some(item=>{
                    if(item.posName == this.jobDetial.posName){
                        return true;
                    }else{
                        return false;
                    }
                })
            }else{
                flag = false
            }
            
            if(flag){
                alert('岗位不能重复添加!');
            }else{
                if(this.jobDetial.posName == ''){
                    alert("请输入岗位名称！");
                }else if(this.checkCode.length == 0 ){
                    alert("该用户至少选择一个岗位权限！");
                }else{
                    axios({
                        method:'POST',
                        url:vm.BDMSUrl+'project2/Config/savePosition?projId='+vm.projId,
                        headers:{
                            'token':vm.token
                        },
                        data:{
                            authCodes:this.checkCode,
                            posId: vm.jobID,
                            posName: vm.jobDetial.posName,
                            posType: parseInt(vm.jobDetial.posType),
                        }
                    }).then((response)=>{
                        if(response.data.cd == 0){
                            vm.adduser = false;
                            this.jobDetial.posName = '';
                            vm.jobDetial.posType ='1';
                            vm.$refs.tree_job.setCheckedKeys([]);
                            vm.getInfo();
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
                }
            }
        },
        deleteJob(key){
            var vm = this;
            vm.$confirm('您要删除当前所选记录吗？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/Config/delProjectPosition',
                    headers:{
                        'token':vm.token
                    },
                    data:[key]
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        vm.getInfo();
                        // if(this.pageDetial.currentPage > Math.ceil(this.pageDetial.total/this.pageDetial.pagePerNum)){
                        //     this.pageDetial.currentPage = Math.ceil(this.pageDetial.total/this.pageDetial.pagePerNum);
                        // }
                    }else{
                        vm.$message({
                            type: 'error',
                            message: response.data.msg
                        });
                    }
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
 <style  lang='less'>
#jobPage{
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
                    display: block;
                    width: 100%;
                    height: 32px;
                    padding: 0 10px;
                    box-sizing: border-box;
                     border-radius: 2px;
                    border:1px solid #e0e0e0;
                    background: #fafafa; 
                }
            }
            .log-body{
                margin-top: 20px;
                .log-head-title{
                     width: 80px;
                    font-size: 14px;
                    color: #333333;
                    line-height: 14px;
                    font-weight: bold;
                    float: left;
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