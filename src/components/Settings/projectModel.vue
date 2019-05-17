<template>
    <div id="attentManageWarrp">
        <div class="itemtop">
            <div class="flex">
                <div>
                    <calendar
                        ref="calendar1"
                        :multi="calendar1.multi"
                        :zero="calendar1.zero"
                        :events="calendar1.events" 
                        :lunar="calendar1.lunar" 
                        :value="calendar1.value" 
                        :begin="calendar1.begin" 
                        :end="calendar1.end" 
                        :weeks="calendar1.weeks" 
                        :months="calendar1.months" 
                        @select="selectTime"
                        ></calendar>
                </div>
            </div>
            <div class="flexLeft">
                <div class="canlenCard">
                    <h5>5月</h5>
                    <span>上班天数:21天</span>
                    <span>休息天数：9天</span>
                </div>
                <div class="canendBtn">
                    <span class="spanBtn">编辑</span>
                </div>

            </div>

        </div>
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
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getCheckOnTimeList" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{timeChange(item.enterTime)}}</td>
                                <td>{{timeChange(item.leaveTime)}}</td>
                                <td>{{timeLength(item.leaveTime-item.enterTime)}}小时</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="getCheckOnTimeList.length==0" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                    当前列表无数据
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
import calendar from './calendar.vue'
export default {
    name:'attentManage',
    components: {
        calendar
    },
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
            //日历
             calendar1:{
                 multi:true,
                 zero:true,
                //  [2019,5,12],[2019,5,13],[2019,5,14],[2019,5,15],[2019,5,16],
                value:[], //默认日期
                lunar:true, //显示农历
                weeks:['日', '一', '二', '三', '四', '五', '六'],
                display:"2018/02/16",
                months:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                events:{
                    // '2018-7-2':'工作日',
                    // '2017-7-20':'$408',
                    // '2017-7-21':'$460',
                    // '2017-7-22':'$500',
                },
                // begin:[2019,5,11], //可选开始日期
                // end:[2019,6,11], //可选结束日期
                select(value){
                    console.log(value,'value');
                },
                selectMonth(month,year){
                    
                },
                selectYear(year){
                   
                },
                timestamp:Date.now()
            },

        }
    },
    created(){
        var vm=this;
        vm.projId = localStorage.getItem('projId');
        vm.token = localStorage.getItem('token');
        vm.projName=localStorage.getItem('projName');
        vm.userId = localStorage.getItem('userId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        this.getCheckOnTime();
    },
    methods:{
        selectTime(value){
            console.log(value,'选择了当前时间');
            
        },
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
                    this.getCheckOnTimeList.push(response.data.rt);
                }
            })
        },
        timeChange(val){
            if(val){
                return moment(val).format('HH:ss')
            }
        },
        timeLength(val){
            return parseInt(val/(1000*60*60))
        },
        addTimeCancle(){
            this.addTimeSettingDialog=false;

        },
    },
    
}
</script>

<style lang="less" scoped>
    #attentManageWarrp{
        width:98%;
        margin:0 auto;
        .itemtop{
            margin-top:20px;
            height:380px;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: row;
            .flex{
                padding:10px;
                width: 70%;
                // border-right:1px solid #ccc;
            }
            .flexLeft{
                height: inherit;
                width: 30%;
                border-left:1px solid #ccc;
                display: flex;
                flex-direction: column;
                justify-content:center;
                align-items: center;
                animation: dataList-ani2 2s forwards;
                .canlenCard{
                    // margin-top:20px;
                    width: 200px;
                    height: 200px;
                    border: 2px solid #44e2ba;
                    display: flex;
                    justify-content:center;
                    flex-direction: column;
                    // align-items:center;

                    &:hover{
                        box-shadow: 0 15px 30px rgba(0,0,0,.1);
                        transform: translate3d(0,-5px,0);
                    }
                    h5{
                        
                        color: #44e2ba;
                        font-size:40px;
                        font-weight: bold;
                        line-height: 44px;
                        height: 44px;
                        margin:10px;
                    }
                    span{
                        color: #666;
                        font-size:16px;
                        line-break: 20px;
                        height: 20px;
                        display: block;
                    }
                }
                .canendBtn{
                    margin-top:20px;
                    .spanBtn{
                        width: 150px;
                        height: 44px;
                        color: #58adfb;
                        text-align: center;
                        line-height: 44px;
                        text-decoration: none;
                        border: 1px solid #58adfb;
                        border-radius: 5px;
                        font-size: 14px;
                        display: inline-block;
                        cursor: pointer;
                        &:hover{
                            background: #58adfb;
                            color: #fff;
                        }
                    }

                }
            }
            
            // float: left;
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
