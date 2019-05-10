<template>
    <div id="attentManageWarrp">
        <div class="itemtop"></div>
        <div class="itembottom">
            <div class="itemSeting"><span class="el-icon-setting" @click="timeSetting()">考勤时间设置</span></div>
             <div class="contentBody">
                <div class="tableBody">
                    <table class="tableList" border="1" cellspacing="0" width="100%">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>上班时间</th>
                            <th>下班时间</th>
                            <th>工作时长</th>
                            <th>编辑</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in cardLists" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.typeName}}</td>
                                <td>
                                    <button class="actionBtn editBtn" @click="editicCard(item)" title="更新"></button>
                                    <button class="actionBtn deleteBtn" @click="deleteicCard(item)" title="删除"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="cardList.length==0" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
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
                            :total="cardListLength">
                        </el-pagination>
                    </div>
                </div>

            </div>
        </div>
        <div id="edit">
                <el-dialog title="设置考勤时间" v-dialogDrag :visible.sync="addTimeSettingDialog" @close="addTimeCancle">
                    <div class="editBody">
                        <div class="editBodyone">
                            <label class="editInpText">上班打卡时间 :</label>
                            <!-- <el-date-picker
                                v-model="enterTime"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker> -->
                            <el-time-select
                                v-model="enterTime"
                                :picker-options="{
                                    start: '07:00',
                                    step: '01:00',
                                    end: '21:00'
                                }"
                                value-format="HH:mm:ss"
                                placeholder="选择时间">
                            </el-time-select>
                        </div>
                        <div class="editBodytwo">
                            <label class="editInpText">下班打卡时间 :</label>
                            <!-- <el-date-picker
                                v-model="leaveTime"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker> -->
                            <el-time-select
                                v-model="leaveTime"
                                :picker-options="{
                                    start: '07:00',
                                    step: '01:00',
                                    end: '21:00'
                                }"
                                value-format="HH:mm:ss"
                                placeholder="选择时间">
                            </el-time-select>
                        </div>
                        <!-- <div class="editBodyone"><label class="editInpText">IC卡编号 :</label><input class="inp" placeholder="请输入" v-model="icCordNum"/></div> -->
                        <!-- <div class="editBodytwo">
                            <label class="editInpText">IC卡类别 :</label>
                             <select class="editSelect" v-model="icCordType" >
                                <option v-for="(item,index) in icOptions" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodytwo"><label class="editInpText">绑定人员 :</label>
                            <select class="editSelect" v-model="icCordOwner" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div> -->
                    </div>
                    <!-- <p class="err" v-show="showErr">请输入完整信息</p> -->
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addTimeSeting()">确定</button>
                        <button class="editBtnC" @click="addTimeCancle">取消</button>
                    </div>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:'attentManage',
    data(){
        return{
            cardLists:[],
            cardList:[],
            cardListLength:1,
            currentPage:1,
            enterTime:'',//上班打卡时间
            leaveTime:'',//下班打卡时间
            addTimeSettingDialog:false,
            BDMSUrl:'',
            getCheckOnTimeList:[],

        }
    },
    created(){
        var vm=this;
        vm.projId = localStorage.getItem('projId');
        vm.token = localStorage.getItem('token');
        vm.projName=localStorage.getItem('projName');
        vm.userId = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
    },
    methods:{
        timeSetting(){
            this.addTimeSettingDialog=true;
        },
        editicCard(){

        },
        deleteicCard(){

        },
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        addTimeSeting(){
            axios({
                url:this.BDMSUrl+'attendancy/setCheckOnTime',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    enterTime:'1970-01-01'+'\0'+this.enterTime+':00',
                    leaveTime:'1970-01-01'+'\0'+this.leaveTime+':00'
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getCheckOnTime();
                    this.addTimeSettingDialog=false;
                }
            })

        },
        getCheckOnTime(){
            axios({
                url:this.BDMSUrl+'attendancy/getCheckOnTime',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                },
                method:"get"
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getCheckOnTimeList=response.data.rt;
                }
            })
        },
        addTimeCancle(){
            this.addTimeSettingDialog=false;

        }


    },
    
}
</script>

<style lang="less" scoped>
    #attentManageWarrp{
        width:98%;
        margin:0 auto;
        .itemtop{
            margin-top:20px;
            height:350px;
            border: 1px solid #ccc;
        }
        .itembottom{
            .itemSeting{
                float: right;
                margin-top:20px;
                color:#3296fa;
                cursor: pointer;
                .el-icon-setting{
                    font-size: 18px;
                }
            }
            .contentBody{
                    // margin-top:20px;
                    padding: 20px 0px;
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
        }



    }


</style>
