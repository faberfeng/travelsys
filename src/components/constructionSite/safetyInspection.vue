<template>
    <div id="safetyInspection">
        <div id="GroupSelect">
             <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                现场连线  
                </router-link>
                <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                现场发文  
                </router-link>
                <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                质量检查
                </router-link>
                <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                安全检查  
                </router-link>
                <router-link :to="'/constructionSite/safetyInspection'" class="label-item label-item-active">  
                安全监测  
                </router-link>
            </div>
            <div id="inspectionBody">
                <div class="textBtnLeft">
                    <label class="recordTxt">导出报告</label>
                    <label class="exportTxt">巡视记录</label>
                </div>
                <div class="overviewBody">
                    <div class="overviewHead">
                        <label class="overviewHeadBtn"></label>
                        <label class="overviewHeadTxt">监测概况</label>
                    </div>
                    <div class="overviewFrame">
                        <ul class="overviewFrameUl">
                            <li class="overviewFrameLi">
                            </li>
                            <li class="overviewFrameLi1">
                                <div id="overviewPie"></div>
                            </li>
                            <li class="overviewFrameLi2">
                                <div id="overviewPie2"></div>
                            </li>
                            <li class="overviewFrameLi3"></li>
                            <li class="overviewFrameLi4"></li>
                            <!-- <li class="overviewFrameLi"></li> -->
                        </ul>
                    </div>
                </div>
                <div class="planeFigure">
                    <div class="planeFigureHead">
                        <div class="planeFigureHeadLeft">
                            <label class="planeFigureHeadLeftBtn"></label>
                            <label class="planeFigureHeadLeftTxt">平面图</label>
                        </div>
                        <div class="planeFigureHeadRight">
                            <span class="exportSaveBtn">导出保存</span>
                            <span class="uploadPicBtn">上传图片</span>
                            <span class="editSpotBtn">编辑点位</span>
                            <span class="drawLineBtn">多点对比</span>
                        </div>
                    </div>
                    <div class="planeFigureBody">
                    </div>
                </div>
                <div class="inspectTable">
                    <div class="inspectTableHead">
                        <div class="inspectTableHeadLeft">
                            <label class="inspectTableHeadLeftTxt">监测单位：</label>
                            <label class="inspectTableHeadLeftTxt"></label>
                        </div>
                        <div class="inspectTableHeadRight">
                            <div class="addData">数据录入</div>
                            <div class="addInspectContent">新增监测内容</div>
                        </div>
                    </div>
                    <div class="inspectTableBody">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                            <thead>
                            <tr>
                                <th rowspan="2">序号</th>
                                <th rowspan="2">监测内容</th>
                                <th rowspan="2">简写</th>
                                <th rowspan="2">测点数</th>
                                <th rowspan="2">最新数据</th>
                                <th colspan="3">本次最大变化量</th>
                                <th colspan="3">累计最大变化量</th>
                                <th rowspan="2">更多操作</th>
                            </tr>
                            <tr>
                                <th>点号</th>
                                <th>取值</th>
                                <th>报警</th>
                                <th>点号</th>
                                <th>取值</th>
                                <th>报警</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>水平位移</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>竖向位移</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>水位</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>受力</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                 <tr>
                                    <td>5</td>
                                    <td>斜度</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
var echarts = require('echarts');
export default {
    name:'safetyInspection',
    data(){
        return{
            selectUgId:'',
            ugList:'',
            token:'',
            projId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            userId:'',
            defaultSubProjId:'',
            detectionSummaryList:'',
            alertPointAmount:'',
            condition:'',
            
        }
    },
    created(){
        var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getAccessUserGroup();
    },
    filters:{

    },
    watch:{
        selectUgId:function(val){
            var vm=this;
            vm.getDetectionSummary();
        }
    },
    methods:{
        //获取可用的群组
        getAccessUserGroup(){
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getAccessUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                },
                
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.ugList=response.data.rt;
                        this.selectUgId=this.ugList[0].ugId;
                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })
        },
        //获取监测概况
        getDetectionSummary(){
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getDetectionSummary',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    userGroupId:this.selectUgId
                },
                }).then(response=>{
                    if(response.data.cd=='0'){
                        this.detectionSummaryList=response.data.rt;
                        this.alertPointAmount=this.detectionSummaryList.alertPointAmount;
                        this.condition=this.detectionSummaryList.condition;
                        var recentData=[];
                        var totalData=[];
                        recentData.push({
                            name:'报警',
                            value:this.alertPointAmount.recentAlertAmount
                        },{
                            name:'总数',
                            value:this.alertPointAmount.allAmount
                        })

                        totalData.push({
                            name:'报警',
                            value:this.alertPointAmount.totalAlertAmount
                        },
                        {
                             name:'总数',
                            value:this.alertPointAmount.allAmount
                            
                        })
                        
                        var myChart = echarts.init(document.getElementById('overviewPie'))
                        var myChart1 = echarts.init(document.getElementById('overviewPie2'))
                        myChart.setOption({
                             title: {
                                // text: '本次报警点位分布',
                                // left: 'left'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}个 ({d}%)"
                            },
                            legend: {
                                // orient: 'horizontal',
                                // top: 'middle',
                                bottom: 0,
                                left: 'center',
                                data:['报警','总数']
                            },
                            color:['#ff634d','#dcdcdc'],
                            series : [
                                {
                                    name: '本次报警点位分布',
                                    type: 'pie',
                                    radius: ['50%', '65%'],
                                    center: ['50%', '50%'],
                                    selectedMode: 'single',
                                    data:recentData,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    lableLine: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                }
                            ]
                        })
                        myChart1.setOption({
                             title: {
                                // text: '本次报警点位分布',
                                // left: 'left',
                                // fontSize:'14px',
                                // color:'#333333'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}个 ({d}%)"
                            },
                            legend: {
                                // orient: 'horizontal',
                                // top: 'middle',
                                bottom: 0,
                                left: 'center',
                                data:['报警','总数']
                            },
                            color:['#ffaa25','#dcdcdc'],
                            series : [
                                {
                                    name: '本次报警点位分布',
                                    type: 'pie',
                                    radius: ['50%', '65%'],
                                    center: ['50%', '50%'],
                                    selectedMode: 'single',
                                    data:totalData,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    lableLine: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                }
                            ]
                        })

                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })

        }


    }
    
}
</script>
<style lang="less">
  *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
     select.inp-search {  
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  
        }
    li{
        list-style: none;
    }
    #safetyInspection{
        .clearfix {
            clear: both;
            overflow: hidden;
            content: '';
        }
        #GroupSelect {
            display: inline-block;
            float: right;
            margin-top:-40px;
            margin-right:10px;
            width: 168px;
            height: 30px;
            .inp-search {
                width: 168px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #cccccc;
                position: relative;
                background: #fafafa;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                float: left;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .icon-sanjiao {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 19px;
                right: 18px;
            }
        }
         ::-webkit-scrollbar{width:0px}
        .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            max-height:800px;
            overflow: auto;
             #inspectionBody{
                margin:0 auto;
                position: relative;
               width: 96%;
                .textBtnLeft{
                    margin-top:10px;
                    height: 28px;
                    .recordTxt{
                        color:#999999;
                        font-size:14px;
                        display: block;
                        float: right;
                        margin-right: 15px;
                        cursor: pointer;
                    }
                    .exportTxt{
                        color:#336699;
                         margin-right: 15px;
                        display: block;
                        float: right;
                        font-size:14px;
                        cursor: pointer;
                    }
                }
                .overviewBody{
                    .overviewHead{
                        height:32px;
                         border-bottom: 1px solid #e6e6e6;
                        .overviewHeadBtn{
                            background:url('./images/overview.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top:9px;
                            margin-left:4px;
                            margin-right:7px;

                        }
                        .overviewHeadTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 32px;
                        }
                    }
                    .overviewFrame{
                        margin-top:20px;
                        .overviewFrameUl{
                            width: 100%;
                            height: 236px;
                            border:1px solid #e6e6e6;
                            position: relative;
                            .overviewFrameLi{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:0px;
                            }
                            .overviewFrameLi1{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:20%;
                                #overviewPie{
                                    position: relative;;
                                    display: block;
                                    width:200px;
                                    height:200px;
                                    // left:-50%;
                                    // top:-50%;
                                }
                            }
                            .overviewFrameLi2{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:40%;
                                 #overviewPie2{
                                    display: block;
                                     width:200px;
                                    height:200px;
                                   
                                }
                            }
                            .overviewFrameLi3{
                                width: 20%;
                                height: 236px;
                                border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:60%;
                            }
                            .overviewFrameLi4{
                                width: 20%;
                                height: 236px;
                                // border-right:1px solid #e6e6e6;
                                display: inline-block;
                                position: absolute;
                                left:80%;
                            }
                        }


                    }


                }
                .planeFigure{
                    margin-top:26px;
                    .planeFigureHead{
                        height: 32px;
                        border-bottom: 1px solid #e6e6e6;
                        .planeFigureHeadLeft{
                            // float: left;
                            .planeFigureHeadLeftBtn{
                                background:url('./images/planpic.png') no-repeat;
                                width: 18px;
                                height: 18px;
                                display: block;
                                float: left;
                                margin-top:9px;
                                margin-left:4px;
                                margin-right:7px;
                            }
                            .planeFigureHeadLeftTxt{
                                color: #fc3439;
                                font-size: 16px;
                                float: left;
                                font-weight: bold;
                                line-height: 32px;
                            }
                        }
                        .planeFigureHeadRight{
                            float: right;
                            .exportSaveBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .uploadPicBtn{
                                 display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }
                            .editSpotBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;

                            }
                            .drawLineBtn{
                                display: inline-block;
                                width: 84px;
                                height: 25px;
                                border:1px solid #f2f2f2;
                                background: #f2f2f2;
                                font-size: 12px;
                                line-height: 25px;
                                vertical-align: middle;
                                color:#666666;
                                border-radius: 2px;
                                cursor: pointer;
                            }

                        }
                    }
                    .planeFigureBody{
                        margin-top:15px !important;
                        margin:0 auto;
                        border:1px solid #e6e6e6;
                        height: 540px;
                        width: 100%;
                    }
                }
                .inspectTable{
                    margin-top:30px;
                    .inspectTableHead{
                        height: 32px;
                        .inspectTableHeadLeft{
                            float: left;
                            .inspectTableHeadLeftTxt{
                                // width: 78px;
                                font-size: 16px;
                                color:#666666;
                                line-height: 32px;
                                // font-weight: bold;
                            }
                        }
                        .inspectTableHeadRight{
                                float: right;
                                .addData{
                                    display: inline-block;
                                    width: 84px;
                                    height: 25px;
                                    border:1px solid #f2f2f2;
                                    background: #f2f2f2;
                                    font-size: 12px;
                                    line-height: 25px;
                                    vertical-align: middle;
                                    color:#666666;
                                    border-radius: 2px;
                                    cursor: pointer;
                                }
                                .addInspectContent{
                                    display: inline-block;
                                    width: 105px;
                                    height: 25px;
                                    border:1px solid #f2f2f2;
                                    background: #f2f2f2;
                                    font-size: 12px;
                                    line-height: 25px;
                                    vertical-align: middle;
                                    color:#666666;
                                    border-radius: 2px;
                                    cursor: pointer;
                                }
                        }

                    }
                    .inspectTableBody{
                        .inspectTableList{
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
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                            tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 36px;
                                        text-align: left;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                    }
                                }
                            }

                        }
                    }


                }


            }
        }
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
       

    }



</style>

