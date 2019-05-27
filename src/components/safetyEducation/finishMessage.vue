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
                                <span>活动结束时间:</span>
                                <label>{{timeChange(submitData.endTime)}}</label>
                            </div>
                            <div class="rightText">
                                <span>活动发起单位:</span>
                                <label>{{submitData.originator}}</label>
                            </div>
                            <div class="rightText">
                                <span>活动负责人:</span>
                                <label>{{submitData.leader}}</label>
                            </div>
                            <div class="rightText">
                                <span>结束附件:</span>
                                <label @click="downFiles(submitData.endFilePath)" style="color:#58ade1;cursor:pointer">{{submitData.endFileName}}</label>
                            </div>
                        </div>

                    </div>
                    
            </div>
            <div class="headBottom">
                <table class="headTable" border="1" cellspacing="0" width="100%">
                    <tbody >
                        <tr v-for="(item,index) in finisUserLists" :key="index">
                            <td>{{item.length>=1?item[0].userName:''}}</td>
                            <td>{{item.length>=2?item[1].userName:''}}</td>
                            <td>{{item.length>=3?item[2].userName:''}}</td>
                            <td>{{item.length>=4?item[3].userName:''}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
            selectUserList:[],
            finisUserLists:[],
            finisUserListValue:[],
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
        vm.finisUserListValue=JSON.parse(this.submitData.joined);
        console.log(vm.finisUserListValue,'vm.finisUserLists');
        console.log(this.endProjectName,'endProjectName');
        if(this.endProjectName!='安全教育详情页'){
             this.getUserList()
        }
    },
    methods:{
        getUserList(){
            var vm=this;
            this.finisUserLists=[];
            var length=vm.finisUserListValue.length;
            for(let i=0;i<=length/4;i++){
                this.finisUserLists.push(
                    vm.finisUserListValue.slice((5*i),(5*i+4))
                )
            }
            console.log(this.finisUserLists,'this.finisUserLists');
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
                height: 450px;
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
                .headTable{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    margin-top:20px;
                     tbody{
                            tr{
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    border-bottom: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                }
                            }
                            }
                }
            }

        }
        
    }
</style>
