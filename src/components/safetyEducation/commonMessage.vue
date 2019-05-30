<template>
    <div id="commonMessage">
        <div class="projectInfo">
            <p class="antsLine">
                安全教育<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">{{projectName}}</span><i class="icon-sanjiao-right"></i>
            </p>
        </div>
        <div class="projectBody">
            <div style="width:50%;float:left;height:250px;">
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动名称:</label><input class="inp" v-model="workName"/>
                </div>
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动发起单位:</label>
                    <input class="inp" v-model="workOriginator"/>
                    <!-- <el-select v-model="buildPerson" placeholder="请选择">
                            <el-option
                            v-for="item in list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                    </el-select> -->
                </div>
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动负责人:</label><input class="inp" v-model="workLeader"/>
                </div>
            </div>
            <div style="width:50%;float:right;height:250px;">
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">时间范围:</label>
                     <!-- <el-date-picker
                        v-model="timeValue"
                        type="date"
                        placeholder="选择日期">         
                    </el-date-picker> -->
                    <el-date-picker
                        v-model="timeValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                 <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">附件:</label>
                    <span style="width:380px !important;display:inline-block">
                        <span class="el-icon-upload" @click="uploadFile()"></span>
                        <span style="width:200px;color:#999;text-align:left;">{{imageName}}</span>
                         <input type="file" style="opacity:0" ref="fileRef" @change="changeFile($event)" />
                        
                    </span>
                   
                </div>
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">抄送人员:</label>
                    <div @click="clickSelectUser" class="tagLable" style="text-align:left;display:inline-block;width:360px;height:70px;border:1px solid #d1d1d1;border-radius:4px;position:relative;vertical-align: middle;overflow:auto;">
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
                     <span @click="clickSelectUser" class="el-icon-circle-plus"></span>
                </div>
            </div>
        </div>
        <div class="projectMiddle">
            <textarea placeholder="活动内容说明" v-model="workText"></textarea>
        </div>
        <div class="projectBottom">
            <span  class="makesureBtn" @click="makeSureEducateSubmit">确认发布</span>
        </div>
        <div id="edit">
            <el-dialog title="用户列表" v-dialogDrag  width="400px" :visible.sync="addUserDialog" @close="addUserCancle">
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
import axios from 'axios'
import moment from 'moment'
export default {
    name:'commonMessage',
    props:['wordType','projectName'],
    data(){
        return{
            workName:'',
            buildPerson:'',
            list:[{
                value:1,
                label:'名称'
            }],
            timeValue:'',
            startTimeValue:'',
            endTimeValue:'',
            selectUserList:[],
            addUserDialog:false,
            userLists:[],
            workOriginator:'',//组织者
            workName:'',
            workLeader:'',
            workText:'',
            fileList:null,
            imageName:"未选择任何文件"
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
        this.getUserList();

    },
    methods:{
        back(){
            var vm=this;
            vm.$emit('back')
        },
        clickSelectUser(){
            this.addUserDialog=true;
        },
        addUserCancle(){
            this.addUserDialog=false;
            this.userLists.forEach((item)=>{
                item.checkBoxShow=false;
            })
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
        makeSureEducateSubmit(){
            var userIds=''
            var URl='';
            this.selectUserList.forEach((item)=>{
                userIds=userIds+'&userIds='+item.userId
            })
            this.startTimeValue=this.timeValue[0],
            this.endTimeValue=this.timeValue[1]
            if(this.fileList){

            }
            if(this.wordType==1){
                URl=this.BDMSUrl+'safety/addSafetyEducation?projId='+this.projId+userIds
            }else if(this.wordType==2){
                URl=this.BDMSUrl+'safety/addSafetyTechnology?projId='+this.projId+userIds
            }
            var formData=new FormData();
            formData.append('file',this.fileList)
            if(this.workName==''||this.workText==''||this.workOriginator==''||this.workLeader==''||this.startTimeValue==''||this.endTimeValue==''){
                this.$message({
                    type:'info',
                    message:'内容不能为空'
                })
            }else if(this.fileList==null){
                this.$message({
                    type:'info',
                    message:'请上传文件'
                })
            }
            else{
                axios({
                    url:URl,
                    headers:{
                        'token':this.token
                    },
                    method:'post',
                    params:{
                        title:this.workName,
                        text:this.workText,
                        originator:this.workOriginator,
                        leader:this.workLeader,
                        startTime:moment(this.startTimeValue).format('YYYY-MM-DD HH:mm:ss'),
                        entTime:moment(this.endTimeValue).format('YYYY-MM-DD HH:mm:ss')
                    },
                    data:formData
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.imageName="未选择任何文件"
                        this.$emit('refreshPage')
                    }
                })
            }
        },

        changeFile(){
            this.fileList=this.$refs.fileRef.files[0];
            this.imageName=this.fileList.name;
            console.log(this.fileList,'this.fileList');
        },
        uploadFile(){
            this.$refs.fileRef.click();
        }
    }
}
</script>
<style lang="less">
#commonMessage{
   
    .projectInfo{
         margin: 10px 20px 20px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                border-bottom: 1px dashed #ccc;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }    
        }
    }
    .projectBody{
        height: 250px;
        border-bottom: 1px solid #ccc;
        .inp{
                background-color: #fff;
                background-image: none;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                color: #606266;
                display: inline-block;
                font-size: inherit;
                height: 40px;
                line-height: 1;
                outline: 0;
                padding: 0 15px;
                height: 36px;
                width: 400px;
        }
        .bodyContent{
            margin:30px 20px;
            input{
                
            }
            .el-select .el-input__inner{
                width: 320px;
            }
            .el-date-editor.el-input {
                    width: 320px !important;
            }
            .el-input--prefix .el-input__inner {
                // padding-left: 30px;
                width: 320px !important;
            }
            .el-icon-upload{
                font-size: 24px;
                color:#2e8cb0;
                margin-left:10px;
                // line-height: 34px;
                vertical-align: center;
                cursor: pointer;
            }
            .el-icon-circle-plus{
                font-size:22px;
                color: #2e8cb9;
                margin-left:5px;
                cursor: pointer;
            }
            
                
        }
    }
    .projectMiddle{
        padding:20px;

        textarea{
            width: 96%;
            height: 200px;
            background: #fafafa;
            padding:15px;
            font-size:14px;
            color:#999;
        }
    }
    .projectBottom{
        .makesureBtn{
            display: inline-block;
            height: 40px;
            width: 100px;
            border:1px solid #2e8cb0;
            border-radius: 4px;
            background: #2e8cb0;
            color:white;
            line-height: 36px;
            font-size: 14px;
            cursor: pointer;
            // margin-top:10px;
            // margin-left:400px;
            // margin-top:30px;
            &:hover{
                border:1px solid #2e8cb0;
                background: white;
                color:#2e8cb0;
            }
        }
    }
    #edit{
       
        .usersList{
            .usersListUl{
                display: flex;
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
