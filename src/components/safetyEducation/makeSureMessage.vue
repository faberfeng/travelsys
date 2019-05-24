<template>
    <div id="makeSureMessage">
        <div class="projectInfo">
            <p class="antsLine">
                安全教育<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">{{endProjectName}}</span><i class="icon-sanjiao-right"></i>
            </p>
        </div>
        <div class="messageBody">
            <div class="headBody">
                    <h5>{{submitData.title}}</h5>
                    <div class="textBody">
                        <span>{{submitData.text}}</span>
                    </div>
                    <div class="textBottom">
                        <div class="left">
                            <label>附件：</label>
                            <label @click="downFiles(submitData.filePath)" class="leftLabel">{{submitData.fileName}}</label>
                        </div>
                        <div class="right">
                            <div class="rightText">
                                <span>活动开始时间:</span>
                                <label>{{timeChange(submitData.startTime)}}</label>
                            </div>
                            <div class="rightText">
                                <span>活动发起单位:</span>
                                <label>{{submitData.originator}}</label>
                            </div>
                            <div class="rightText">
                                <span>活动负责人:</span>
                                <label>{{submitData.leader}}</label>
                            </div>
                        </div>

                    </div>
                    
            </div>
            <div class="headBottom">
                <div class="bottomDiv">
                    <label>安全教育签到名单:</label>
                    <span class="inps" @click="addPeople()" >
                        <el-tag 
                            style="width:95px;margin:2px;text-align:center;"
                                v-for="tag in selectUserList"
                                :key="tag.userName"
                               closable
                                @close="closeTag(tag)"
                                type="">
                                {{tag.userName}}
                        </el-tag>
                    </span>
                </div>
                <div class="bottomDiv">
                    <label>附件:</label>
                    <span @click="clickFile" style="cursor:pointer">
                        <i class="el-icon-upload"></i>
                        <span>{{imgName}}</span>
                        <input style="opacity:0" type="file" ref="fileInp" class="fileInp" @change="fileChange($event)"/>
                    </span>

                </div>
                <!-- <div class="bottomDiv">
                    <label>结束时间:</label>
                    <el-date-picker
                        width="70%"
                        v-model="endTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div> -->
                <div class="bottomBtn">
                    <span class="makeSureBtn" @click="endProject()">结束活动</span>
                </div>
            </div>
        </div>
        <div id="edit">
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
import moment from 'moment'
import axios from 'axios'
export default {
    name:'makeSureMessage',
    props:['submitData','endProjectName'],
    data(){
        return{
            endTime:'',
            imgName:'未上传任何文件',
            fileList:null,
            addUserDialog:false,
            userLists:[],
            selectUserList:[]


        }
    },
    created(){
        console.log(this.submitData);
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.BDMSUrl=this.$store.state.BDMSUrl;
        if(vm.submitData.safetyEducationJoinners){
            vm.selectUserList=vm.submitData.safetyEducationJoinners;
        }
        if(vm.submitData.safetyTechnologyJoinners){
             vm.selectUserList=vm.submitData.safetyTechnologyJoinners;
        }
        console.log(vm.selectUserList,'vm.selectUserList');
        this.getUserList();
    },
    methods:{
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
                    console.log(this.userLists,'this.userLists');
                }
            })
        },
        back(){
            this.$emit('back');
        },
        downFiles(val){
            window.open(this.BDMSUrl+val)
        },
        timeChange(val){
            if(val){
                return moment(val).format('YYYY-MM-DD')
            }
        },
        clickFile(){
            this.$refs.fileInp.click()
        },
        fileChange(){
            this.fileList=this.$refs.fileInp.files[0];
            this.imgName=this.fileList.name;
        },
        closeTag(tag){
            this.selectUserList.splice(this.selectUserList.indexOf(tag), 1)
        },
        addUserCancle(){
            this.addUserDialog=false;
            this.userLists.forEach((item)=>{
                item.checkBoxShow=false;
            })
        },
        addPeople(){
            this.addUserDialog=true;
            this.selectUserList.forEach((item)=>{
                this.userLists.forEach((val)=>{
                    if(item.userId==val.userId){
                        val.checkBoxShow=true;
                    }
                })
            })
        },
        addUserListMakeSure(){
            this.selectUserList=[];
            this.userLists.forEach((item)=>{
                if(item.checkBoxShow==true){
                    this.selectUserList.push(item)
                }
                item.checkBoxShow=false;
            })
            this.selectUserList.forEach((item)=>{
                this.$set(item,'userName',item.name)
            })
            console.log(this.selectUserList,'最终确认的数字');
            this.addUserDialog=false;
        },
        endProject(){
            var vm=this;
            var url='';
            if(this.endProjectName=="结束安全教育"){
                url=this.BDMSUrl+'safety/finishSafetyEducation'
            }else{
                url=this.BDMSUrl+'safety/finishSafetyTechnology'
            }
            var formData=new FormData();
            formData.append('file',this.fileList);
            this.selectUserList=JSON.stringify(this.selectUserList);
            console.log(this.selectUserList,'this.selectUserList00000');
            axios({
                url:url,
                headers:{
                    'token':this.token
                },
                method:"post",
                params:{
                    id:vm.submitData.id,
                    joiner:this.selectUserList,
                },
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    this.selectUserList=[];
                    this.$emit('refresh');
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    *{
        margin:0px;
        padding: 0px;
    }
    ul,li{
        list-style: none;
    }
    #makeSureMessage{
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
        .messageBody{
            .headBody{
                height: 380px;
                border-bottom: 1px solid #ccc;
                h5{
                    font-size: 26px;
                    height: 30px;
                    line-height: 30px;
                    margin-bottom: 18px;
                }
                .textBody{
                    margin-top:20px;
                    width: 80%;
                    height: 200px;
                    margin: 0 auto;
                    text-align: left;

                     span{
                        
                        display: inline-block;
                        font-size:18px;
                        letter-spacing: .2rem;
                    }
                }
                .textBottom{
                    width: 80%;
                    margin:0 auto;
                    .left{
                        font-size:16px;
                        float: left;
                        .leftLabel{
                            color: #58adfb;
                            cursor: pointer;
                            font-size:14px;
                            &:hover{
                                color: #58ade1;
                            }
                        }
                    }
                    .right{
                         float: right;
                         .rightText{
                             font-size: 16px;
                             height: 40px;
                             line-height: 40px;
                              text-align: left;
                              span{
                                display: inline-block;
                                width:150px;
                              }
                             label{
                                 display: inline-block;
                                 width:250px;
                                //  overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap
                             }
                         }
                    }

                }
               
            }
            .headBottom{
                width: 94%;
                margin-top:30px;
                margin:0 auto;
                .bottomDiv{
                    // height: 100px;
                     margin-top:30px;
                    text-align: left;
                    .el-icon-upload{
                        font-size:20px;
                        cursor: pointer;
                    }

                    label{
                        font-size: 16px;
                        display: inline-block;
                        width: 10%;
                        height: 42px;
                        vertical-align: top;
                    }
                    .inps{
                        width: 75%;
                        height: 80px;
                        display:inline-block;
                        border:1px solid #ccc;
                        border-radius: 4px;
                        cursor: pointer;
                        overflow: auto;
                    }
                    


                }
                .bottomBtn{
                    float: right;
                    .makeSureBtn{
                        display: inline-block;
                        height: 36px;
                        border-radius: 4px;
                        width: 120px;
                        border:1px solid #e51c54;
                        color: #e51c54;
                        line-height: 34px;
                        cursor: pointer;
                        margin-right:100px;
                        margin-top:-100px;
                        &:hover{
                            background: #e51c54;
                            color:white;
                        }
                    }
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
