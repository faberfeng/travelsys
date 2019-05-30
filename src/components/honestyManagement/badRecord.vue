<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div class="contentBody" >
            <div class="ForumSelector">
                <span class="name">筛选条件</span>
                <ul>
                    <!-- <li class="selectItem">
                        <el-select v-model="onePerson" placeholder="请选择">
                                    <el-option
                                    v-for="item in personList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                        </el-select>
                    </li> -->
                    <li class="selectItem">
                        <!-- <span class="title">时间</span> -->
                        <span class="itemContent">
                            <!-- <v2-datepicker format="yyyy" v-model="selectTime"  @change="changeDatePicker()" ></v2-datepicker> -->
                            <el-date-picker v-model="selectTime" type="year" width="200px" placeholder="选择年" @change="changeDatePicker()"></el-date-picker>
                         </span>
                    </li>
                    <li class="selectItem">
                       <span class="title-right">
                            <input type="text" v-model="selectName" placeholder="请输入名字"  class="title-right-icon" @keyup.enter="selectNameInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="selectNameInfo"></span>
                        </span>
                    </li>
                     <li class="selectItem">
                            <span class="exportName"  @click="exportData">导出</span>
                    </li>
                     
                </ul>
                <div class="wrapperHead" @click="buildGoodRecord">
                    <span class="el-icon-plus"></span><span class="elName">新建不良记录</span>
                </div>
            </div>
             <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序号</th>
                           <th>事件</th>
                           <th>单位对象</th>
                           <th>方式</th>
                           <th>时间</th>
                           <th>相关人员</th>
                           <th>备注</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in goodRecordList" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.company}}</td>
                            <td>{{item.mode}}</td>
                            <td>{{item.time}}</td>
                            <td>
                                <el-tag style="width:80px;margin:2px;" v-for="tag in item.users" :key="tag.id">
                                        {{tag.userName}}
                                </el-tag>
                            </td>
                            <td>{{item.remark}}</td>
                            <td>
                                <button class="actionBtn editBtn" @click="editBadRecord(item.id)"></button>
                                 <button class="actionBtn deleteBtn" @click="deleteBadRecord(item.id)"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="goodRecordList==null"  style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                当前列表无数据
            </div>
            <div class="tableBodyPagination">
                <div class="tableBodyPaginationRight">
                    <el-pagination class="elPagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="1"
                        layout="sizes,prev, pager, next"
                        :total="TableListLength">
                    </el-pagination>
                </div>
            </div>
        </div>
         <div id="edit">
                <el-dialog title="添加不良记录" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">事件 :</label><input class="inp" placeholder="请输入" v-model="eventName"/></div>
                        <div class="editBodytwo"><label class="editInpText">授权部门:</label><input class="inp" placeholder="请输入" v-model="companyName"/></div>
                        <div class="editBodytwo">
                            <label class="editInpText">惩罚方式 :</label>
                            <input class="inp" placeholder="请输入" v-model="modeName"/>
                             <!-- <select class="editSelect" v-model="mode" >
                                <option v-for="(item,index) in goodList" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                            <i class="icon-sanjiao"></i> -->
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText">时间 :</label>
                            <el-date-picker
                                v-model="evenTime"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="editBodytwo"><label class="editInpText">备注 :</label><input class="inp" placeholder="请输入" v-model="remark"/></div>
                         <div class="editBodytwo"><label class="editInpText">相关人员 :</label>
                        <div @click="clickSelectUser" class="tagLable" style="text-align:left;display:inline-block;width:415px;height:38px;border:1px solid #d1d1d1;border-radius:4px;position:relative;vertical-align: middle;overflow:auto;">
                            <el-tag 
                            style="width:95px;margin:2px;text-align:center;"
                                v-for="tag in selectUserList"
                                :key="tag.name"
                               closable
                                @close="closeTag(tag)"
                                type="">
                                {{tag.name}}
                            </el-tag>
                        </div>
                         <!-- <el-input style="display:inline-block;width:415px" placeholder="请输入" v-model="remark"></el-input> -->
                         <span @click="clickSelectUser" class="el-icon-circle-plus"></span></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addGoodRecordMakeSure()">确定</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="用户列表" v-dialogDrag width="400px" :visible.sync="addUserDialog" @close="addUserCancle">
                    <div class="usersList">
                        <ul class="usersListUl">
                            <li class="usersListLi" v-for="(item,index) in userLists" :key="index">
                                <el-checkbox v-model="item.checkBoxShow"></el-checkbox><label style="margin-left:4px;">{{item.name+'-'+item.name2}}</label>
                            </li>
                        </ul>

                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addUserListMakeSure()">保存</button>
                        <button class="editBtnC" @click="addUserCancle">取消</button>
                    </div>

                </el-dialog>
         </div>
        
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name:'',
    data(){
        return{
            routerList:"",
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
             personList:[{
                value:1,
                label:'活动发起者'
            }],
            onePerson:'',
            addDialog:false,
            mode:'',
            eventName:'',
            evenTime:'',
            addDialog:false,
            remark:'',
            modeName:'',
            companyName:'',
            eventName:'',
            addUserDialog:false,
            userLists:[],
            selectUserList:[],
            goodRecordList:[],

        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.BDMSUrl=this.$store.state.BDMSUrl;
        vm.loadingTitle();
        this.getUserList();
        this.getGoodRecord();

    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'055','05503','/honestyManagement/badRecord','05501','/honestyManagement/allEvaluate','05502','/honestyManagement/goodRecord','05504','/honestyManagement/complaintHandling');
          console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
            //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        timeChange(val){
            if(val){
                moment(val).format('YYYY-MM-DD HH:ss:mm')
            }   
        },
        //改变时间
        changeDatePicker(){
            if(this.selectTime){
                this.getGoodRecord()
            }else{
                this.selectTime='';
                this.getGoodRecord()
            }
        },
        timeChangeByYears(val){
            if(val){
                return moment(val).format('YYYY')
            }
        },
        addUserListMakeSure(){
            this.userLists.forEach((item)=>{
                if(item.checkBoxShow==true){
                    this.selectUserList.push(item)
                }
                item.checkBoxShow=false;
            })
            this.addUserDialog=false;
        },
        selectNameInfo(){
            if(this.selectTime){
                this.getGoodRecord()
            }else{
                this.selectTime='';
                this.getGoodRecord()
            }
        },
        exportData(){
            axios({
                   url:this.BDMSUrl+'sincerity/exportSincerityInfo?projId='+this.projId+(this.selectName==''?'':('&userName='+this.selectName))+(this.selectTime==''?'':('&time='+this.selectTime))+'&type='+2,
                    headers:{
                        'token':this.token
                    },
                    responseType:'blob'
                }).then((response)=>{
                    let blob=new Blob([response.data],{
                        type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
                    });
                    let objectUrl = URL.createObjectURL(blob);  //生成一个url
                    window.location.href = objectUrl;   //浏览器打开这个url
            })
        },
         buildGoodRecord(){
            this.addDialog=true;
        },
        //点击选择用户
        clickSelectUser(){
            this.addUserDialog=true;
        },
        addUserCancle(){
            this.addUserDialog=false;
            this.userLists.forEach((item)=>{
                item.checkBoxShow=false;
            })
        },
        closeTag(tag){
            this.selectUserList.splice(this.selectUserList.indexOf(tag), 1)
        },
        addGoodRecordMakeSure(){
            var data={}
            var userData=[];
            this.selectUserList.forEach((item)=>{
                userData.push({
                    'userId':item.userId,
                    'userName':item.name
                })
            })
            data={
                'company':this.companyName,
                'mode':this.modeName,
                'name':this.eventName,
                'remark':this.remark,
                'time':moment(this.evenTime).format('YYYY-MM-DD HH:mm:ss'),
                'type':2,
                'projId':this.projId,
                'users':userData
            }
             if(this.companyName==''||this.modeName==''||this.eventName==''||this.remark==''||this.evenTime==''||userData==[]){
                this.$message({
                    type:'info',
                    message:'内容不能为空'
                })
            }else{
                 axios({
                    url:this.BDMSUrl+'sincerity/addSincerityInfo',
                    method:"post",
                    headers:{
                        'token':this.token
                    },
                    data:data
                }).then((response)=>{
                    this.getGoodRecord();
                    this.addDialog=false;
                    this.selectUserList=[];
                    this.companyName='';
                    this.modeName='';
                    this.eventName='';
                    this.remark='';
                    this.evenTime='';
                    
                })

            }
           
        },

        getUserList(){
            axios({
                url:this.BDMSUrl+'user/getUserList',
                method:'GET',
                params:{
                    projectId:this.projId
                },
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.userLists=response.data.rt;
                    this.userLists.forEach((item)=>{
                        this.$set(item,'checkBoxShow',false);
                    })
                }
            })
        },
        getGoodRecord(){
            axios({
                url:this.BDMSUrl+'sincerity/getSincerityInfo?projId='+this.projId+(this.selectTime==''?'':('&time='+this.timeChangeByYears(this.selectTime)))+(this.selectName==''?'':('&userName='+this.selectName))+(this.onePerson==''?'':('&company='+this.onePerson)),
                method:'get',
                params:{
                    type:2,
                },
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.goodRecordList=response.data.rt;
                }
            })
        },
        deleteBadRecord(id){
            this.$confirm('你是否要删除该不良记录','提示',{
                confirmButtonText:'确认',
                concleButtonText:'取消',
                type:'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'sincerity/deleteSincerityInfo',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getGoodRecord();
                    }
                })
            })
        },
        editBadRecord(){

        },
        addCancle(){
            this.addDialog=false;
            this.selectUserList=[];
            this.companyName='';
            this.modeName='';
            this.eventName='';
            this.remark='';
            this.evenTime='';
        }

    },

}
</script>

<style lang="less" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
li{
    list-style: none;
}
#content{
     width: 100%;
        .topHeader{
            box-sizing: border-box;
            // margin-top:107px;
            // float: left;
            width: 100%;
            max-height: 800px;
            overflow: auto;
        }
        // ::-webkit-scrollbar{width:0px}
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
           
              .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
                .label-item-active{
                    color: #fc3439;
                    font-weight: bold;
                    border-top: 3px solid #fc3439;
                    border-left: 1px solid #e6e6e6;
                    border-right: 1px solid #e6e6e6;
                    border-bottom: 1px solid #fff;
                    background: #ffffff;
                }
        }
        .contentBody{
            margin-top:20px;
            padding: 20px 20px;
            .ForumSelector{
                            border: 1px solid #d9d9d9;
                            height: 50px;
                            color: #999999;
                            font-size: 12px;
                            // margin-right: 30px;
                            margin-right: 5px;
                            .name{
                                float: left;
                                width: 96px;
                                height: 48px;
                                line-height: 48px;
                                text-align: left;
                                padding-left: 10px;
                                background: #fafafa;
                            }
                            // .selectItemRight{
                            //         float: right;
                            //          width: 96px;
                            //         height: 48px;
                            //         line-height: 48px;
                            //         text-align: left;
                            //         padding-left: 10px;
                            //         font-size: 16px;
                            //         color:rgb(141, 141, 190);
                            //         cursor: pointer;
                            // }
                            .wrapperHead{
                                float: right;
                                line-height: 48px;
                                height: 48px;
                                margin-right:15px;
                                cursor: pointer;
                                .el-icon-plus{
                                    font-size: 16px;
                                    font-weight: bold;
                                    color:rgb(46,140,185);
                                }
                                .elName{
                                    margin-left:4px;
                                    font-size:16px;
                                    font-weight: bold;
                                    color:rgb(46,140,185);
                                }
                            }
                            >ul{
                                float: left;
                                .selectItem{
                                    float: left;
                                    .itemContent{
                                        display: inline-block;
                                        padding: 8px 15px 0 30px;
                                        height: 48px;
                                        line-height: 48px;
                                         margin-top:-7px;
                                        .el-date-editor.el-input{
                                            width: 200px !important;
                                        }
                                    }
                                    .title{
                                        display: inline-block;
                                        padding: 0 15px 0 30px;
                                        height: 48px;
                                        line-height: 48px;
                                    }
                                    .exportName{
                                        font-size:16px;
                                        color: #2e8cb9;
                                        margin-left:12px;
                                        margin-top:12px;
                                        display: inline-block;
                                        cursor: pointer;
                                    }
                                    .el-select{
                                        margin-top:4px;
                                        margin-left:4px;
                                        .el-input__inner{
                                            border:none;
                                            width: 100px;
                                            color:#333333;
                                            height: 38px;
                                        }
                                    }
                                    .title-right{
                                        float: left;;
                                        width: 214px;
                                        height: 33px;
                                        margin-left: 20px;
                                        margin-top:8px;
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
                                            &:focus{
                                                background: #ffffff;  
                                            }
                                        }
                                        .el-icon-search{
                                            position: absolute;
                                            right: 16px;
                                            top: 10px;
                                            cursor: pointer;
                                        }
                                    }
                                
                                }
                                .selectItem:first-of-type .el-select .el-input__inner{
                                    width: 170px;
                                }
                            }
                    }
            .tableBody{
                    margin-top:30px;
                    .tableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        thead{
                            background: #f2f2f2;
                            th{
                                padding-left: 6px;
                                padding-right: 15px;
                                height: 36px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 14px;
                                color: #333333;
                                font-weight: normal;
                            }
                        }
                        tbody{
                            tr{
                                .red{
                                    color: red;
                                }
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    .actionBtn{
                                        width: 18px;
                                        height: 18px;
                                        border: none;
                                        cursor: pointer;
                                        margin-left: 10px;

                                    }
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat 0 0;
                                    }
                                    .editBtn{
                                        background: url('../../assets/edit.png') no-repeat 0 0;
                                    }
                                    // .upmoveBtn{
                                    //     background: url('./images/overviewup.png') no-repeat 0 0;
                                    // }
                                    // .downmoveBtn{
                                    //     background: url('./images/downmove.png') no-repeat 0 0;
                                    // }
                                    // .detailBtn{
                                    //     background: url('./images/overfile.png') no-repeat 0 0;
                                    // }
                                    // .exportBtn{
                                    //     background: url('./images/overviewdown.png') no-repeat 0 0;
                                    // }

                                }
                            }
                        }
                    }
                }
            .tableBodyPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .tableBodyPaginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 16px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                    }
            }
        }
         #edit{
            .editSelect{
                    width: 447px;
                    height: 38px;
                    color: #333333;
                    background: #fafafa;
                    border: 1px solid #d1d1d1;
                    padding:0px 0px 0px 10px;
                }
            .el-icon-circle-plus{
                font-size:22px;
                color: #2e8cb9;
                margin-left:5px;
                cursor: pointer;
            }
            .usersList{
                .usersListUl{
                    display: flex;
                    // flex-direction: row;
                    flex-direction: column;
                    text-align: left;
                    width: 80%;
                    margin: 0 auto;
                    height: 300px;
                    border:1px solid #58adfb;
                    overflow: auto;
                    padding: 5px;
                    background: white;
                    .usersListLi{
                        height: 30px;
                        line-height: 30px;
                        
                         color:#58adfb;
                        font-size:16px;
                        padding:2px;
                        cursor: pointer;
                        &:hover{
                           color:#3279e3;

                        }
                    }

                }

            }
        }

}

</style>
