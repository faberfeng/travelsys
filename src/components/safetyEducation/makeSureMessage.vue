<template>
    <div id="makeSureMessage">
        <div class="projectInfo">
            <p class="antsLine">
                安全教育<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">结束安全教育</span><i class="icon-sanjiao-right"></i>
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
                                <label>2019-02-25</label>
                            </div>
                            <div class="rightText">
                                <span>活动发起单位:</span>
                                <label>2019-02-25</label>
                            </div>
                            <div class="rightText">
                                <span>活动负责人:</span>
                                <label>2019-02-25</label>
                            </div>

                        </div>

                    </div>
                    
            </div>
            <div class="headBottom">
                <div class="bottomDiv">
                    <label>安全教育签到名单:</label>
                    <span class="inps"></span>
                </div>
                <div class="bottomDiv">
                    <label>附件:</label>
                    <span>
                        <i class="el-icon-upload"></i>
                        <span>{{imgName}}</span>
                        <input style="opacity:0" type="file"/>
                    </span>

                </div>
                <div class="bottomDiv">
                    <label>结束时间:</label>
                    <el-date-picker
                        width="70%"
                        v-model="endTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div class="bottomBtn">
                    <span class="makeSureBtn">结束活动</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'makeSureMessage',
    props:['submitData'],
    data(){
        return{
            endTime:'',
            imgName:'未上传任何文件'

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
    },
    methods:{
        back(){
            this.$emit('back');
        },
        downFiles(val){
            window.open(this.BDMSUrl+val)
        }

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
                             font-size: 18px;
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
                        font-size: 18px;
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
    }
</style>
