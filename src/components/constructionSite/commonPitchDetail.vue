<template>
    <div id="commonPitchDetail">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{surveyName}}</span>
            </p>
            <div class="container">
                <div class="containerHead">
                    <div class="containerHeadLeft">
                        <span class="addOrder">添加序列</span>
                        <span class="exportOrder">导出</span>
                    </div>
                    <div class="containerHeadMiddle"></div>
                    <div class="containerHeadRight">
                        <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==2" class="import">导入</span>
                        <span v-show="importMethod==1" class="import">配置</span>
                    </div>
                </div>
                <div class="containerTable">
                    <table class="containerList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">序列编号</th>
                                <th rowspan="2">关键字</th>
                                <th rowspan="2">起始标高</th>
                                <th rowspan="2">结束标高</th>
                                <th rowspan="2">点位间隔</th>
                                <th rowspan="2">点位数量</th>
                                <th colspan="3">当前最大值</th>
                                <th colspan="4">累计最大变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>位置</th>
                                <th>位移</th>
                                <th>报警</th>
                                <th>时间间隔</th>
                                <th>位置</th>
                                <th>变化</th>
                                <th>报警</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CX-1</td>
                                <td>QTCX-1</td>
                                <td>0.00</td>
                                <td>-10.000</td>
                                <td>0.500</td>
                                <td>21</td>
                                <td>7.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>1d1h0m</td>
                                <td>7.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>
                                    <button title="修改" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn"></button>
                                    <button title="左侧显示" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" class="rightLayBtn actionBtn"></button>
                                </td>
                            </tr>
                            <tr>
                                <td>CX-2</td>
                                <td>QTCX-2</td>
                                <td>0.01</td>
                                <td>-14.000</td>
                                <td>0.400</td>
                                <td>21</td>
                                <td>6.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>1d1h0m</td>
                                <td>7.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>
                                    <button title="修改" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn"></button>
                                    <button title="左侧显示" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" class="rightLayBtn actionBtn"></button>
                                </td>
                            </tr>
                             <tr>
                                <td>CX-3</td>
                                <td>QTCX-3</td>
                                <td>0.03</td>
                                <td>-16.020</td>
                                <td>0.620</td>
                                <td>24</td>
                                <td>6.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>1d1h0m</td>
                                <td>7.500</td>
                                <td>2</td>
                                <td>是</td>
                                <td>
                                    <button title="修改" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn"></button>
                                    <button title="左侧显示" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" class="rightLayBtn actionBtn"></button>
                                </td>
                            </tr>
                             <tr>
                                <td>CX-4</td>
                                <td>QTCX-4</td>
                                <td>0.03</td>
                                <td>-18.020</td>
                                <td>0.420</td>
                                <td>22</td>
                                <td>6.500</td>
                                <td>2</td>
                                <td>否</td>
                                <td>1d1h0m</td>
                                <td>7.500</td>
                                <td>4</td>
                                <td>是</td>
                                <td>
                                    <button title="修改" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn"></button>
                                    <button title="左侧显示" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" class="rightLayBtn actionBtn"></button>
                                </td>
                             </tr>
                        </tbody>
                    </table>
                </div>
                <div class="containerBottom">
                    <div class="containerBottomOne">
                        <div class="oneHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列CX-01详情</label>
                        </div>
                        <div class="oneTable">
                            <table class="tableList" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th>05-21 10:00</th>
                                        <th>05-21 11:00</th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in indexTailList1" :key="index">
                                        <td v-text="item.depth"></td>
                                        <td v-text="item.distance1"></td>
                                        <td v-text="item.distance2"></td>
                                        <td v-text="item.changeNum"></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>05-21 10:00</td>
                                        <td>05-21 11:00</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <td>3mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomTwo">
                        <div class="twoHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列CX-01曲线</label>
                        </div>
                        <div class="twoGraph">
                            <vue-highcharts  :options="optionOnes" ref="lineChartOne"></vue-highcharts>
                        </div>
                    </div>
                    <div class="containerBottomThree">
                        <div class="threeHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列CX-02详情</label>
                        </div>
                        <div class="threeTable">
                            <table class="tableList" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                               <tbody>
                                    <tr v-for="(item,index) in indexTailList2" :key="index">
                                        <td v-text="item.depth"></td>
                                        <td v-text="item.distance1"></td>
                                        <td v-text="item.distance2"></td>
                                        <td v-text="item.changeNum"></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>05-21 10:00</td>
                                        <td>05-21 11:00</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <td>3mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomFour">
                        <div class="fourHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列CX-02曲线</label>
                        </div>
                        <div class="fourGraph">
                            <vue-highcharts  :options="optionOnes" ref="lineChartOne"></vue-highcharts>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueHighcharts from 'vue2-highcharts'
export default Vue.component('commonPitch-detail',{
        props:['surveyName'],
        components:{
            VueHighcharts
        },
        data(){
            return{
                importMethod:1,
                importList:[
                    {
                        value:1,
                        label:'自动采集'
                    },
                    {
                        value:2,
                        label:'手动导入'
                    }
                ],
                indexTailList1:[
                    {
                        depth:0,
                        distance1:3,
                        distance2:4,
                        changeNum:0.02
                    },
                    {
                    depth:0.5,
                    distance1:3.95,
                    distance2:4.01,
                    changeNum:-0.01
                    },
                    {
                    depth:1.0,
                    distance1:4.6,
                    distance2:4.9,
                    changeNum:-0.01
                    },
                    {
                    depth:1.5,
                    distance1:5.4,
                    distance2:4.7,
                    changeNum:0.01
                    },
                    {
                    depth:2.0,
                    distance1:3.9,
                    distance2:5.4,
                    changeNum:-0.1
                    },
                    {
                    depth:3,
                    distance1:5.3,
                    distance2:4.7,
                    changeNum:-0.21
                    },
                    {
                    depth:3.5,
                    distance1:3.6,
                    distance2:5.4,
                    changeNum:-0.01
                    },
                    {
                    depth:4,
                    distance1:3.6,
                    distance2:4.7,
                    changeNum:-0.03
                    },
                    {
                    depth:4.5,
                    distance1:5.3,
                    distance2:4.6,
                    changeNum:0.11
                    },
                    {
                    depth:5,
                    distance1:3.9,
                    distance2:4.6,
                    changeNum:0.01
                    },
                    {
                    depth:5.5,
                    distance1:7.3,
                    distance2:5.4,
                    changeNum:-0.01
                    },
                    {
                    depth:6,
                    distance1:7.3,
                    distance2:6.4,
                    changeNum:0.21
                    },
                ],
                indexTailList2:[
                    {
                        depth:0,
                        distance1:3.6,
                        distance2:4.5,
                        changeNum:0.01
                    },
                     {
                    depth:0.5,
                    distance1:3.95,
                    distance2:4.01,
                    changeNum:-0.01
                    },
                    {
                    depth:1.0,
                    distance1:4.6,
                    distance2:4.9,
                    changeNum:-0.01
                    },
                    {
                    depth:1.5,
                    distance1:5.4,
                    distance2:4.7,
                    changeNum:0.01
                    },
                    {
                    depth:2.0,
                    distance1:3.9,
                    distance2:5.4,
                    changeNum:-0.1
                    },
                    {
                    depth:3,
                    distance1:5.3,
                    distance2:4.7,
                    changeNum:-0.21
                    },
                    {
                    depth:3.5,
                    distance1:3.6,
                    distance2:5.4,
                    changeNum:-0.01
                    },
                    {
                    depth:4,
                    distance1:3.6,
                    distance2:4.7,
                    changeNum:-0.03
                    },
                    {
                    depth:4.5,
                    distance1:5.3,
                    distance2:4.6,
                    changeNum:0.11
                    },
                    {
                    depth:5,
                    distance1:3.9,
                    distance2:4.6,
                    changeNum:0.01
                    },
                    {
                    depth:5.5,
                    distance1:7.3,
                    distance2:5.4,
                    changeNum:-0.01
                    },
                    {
                    depth:6,
                    distance1:7.3,
                    distance2:6.4,
                    changeNum:0.21
                    }

                ],
                 optionOnes:{
                        chart: {
                            type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            // categories:['0.0','1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.5','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13'],
                            // tickInterval: 0.5,
                            //  tickPositions: [0, 20, 50, 100]
                            categories:['0.0','1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.5','6.0'],
                        },
                        yAxis: {
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                               
                            
                                },
                                
                        // labels: {
                        //     formatter: function () {
                        //         return this.value;
                        //     }
                        // },  
                        // tooltip: {
                        //     crosshairs: true,
                        //     shared: true
                        // },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            
                            floating: true,
                            borderWidth: 0
                        },
                        plotOptions: {
                            spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    }
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click(e) {
                                        
                                        }
                                    }
                                }
                            },
                        },
                        series:[
                            {
                                name:'05-21',
                                data:[12.21,12.23,12.43,12.64,13.05,13.32,13.14,12.65,12.44,12.38,12.01]
                            },
                            {
                                name:'05-21',
                                data:[12.2,12.3,12.4,12.6,13.0,13.3,13.1,12.6,12.4,12.3,12.1]
                                //  data:[12.1,12.3,12.5,13.6,13.7,13.8,14.3,14.4,14.5,15.2,15.4,15.6,16.2,16.5,16.6,17.3,17.4,17.5,18.3,18.4,18.5,18.5,18.4,18.3,17.6,17.5,17.4,16.6,16.5,16.4,15.4,15.3,15.2,14.6,14.4,14.1,13.6,13.4,13.1,12.9,12.7,12.6]
                                // data:[23,34,54,24,56,12,35,57]
                            }
                        ],
            },



            }
        },
        created(){

        },
        filters:{

        },
        watch:{

        },
        methods:{
            //返回
            back(){
                var vm = this
                vm.$emit('back')
            }

        }
    }
)

</script>
<style lang="less">
*{
    margin:0;
    padding: 0;
    box-sizing: border-box;
}
i{
    font-style:normal
}
li{list-style: none}
select.autoImport{
        /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  

    }
#commonPitchDetail{
    margin: 0 20px 20px!important;
    .project{
        width: 100%;
        max-height: 800px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }
                .strong{
                    cursor: pointer;
                    color: #333333;
                    font-weight: bold;
                    &:last-of-type .icon-sanjiao-right{
                        display: none;
                    }
                }
                
        }
        .container{
            width: 98%;
            margin:0 auto;
            .containerHead{
                margin-top:28px;
                width: 98%;
                height: 34px;
                
                .containerHeadLeft{
                    float: left;
                    .addOrder{
                        display: inline-block;
                        width: 100px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;

                    }
                    .exportOrder{
                        display: inline-block;
                        width: 50px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
                .containerHeadMiddle{

                }
                .containerHeadRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
                        // display: inline-block;
                        color:#999999;
                        font-size: 12px;
                        width: 60px;
                        height: 26px;
                        line-height: 26px;
                    }
                    .autoImport{
                        width: 121px;
                        height: 26px;
                        border: 1px solid #cccccc;
                        position: relative;
                        background: #fff;
                        padding-left: 10px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        margin-right: 0px;
                        color: #333333;
                        font-size: 14px;
                        border-radius: 2px;
                        outline: none;
                    }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image: url('../Settings/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 11px;
                        right: 65px;
                    }
                    .import{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                }
            }
            .containerTable{
                margin-top:10px;
                .containerList{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                    height: 30px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;

                                    }
                                    .editBtn{
                                        background: url('./images/overviewedit.png') no-repeat 0 0;
                                    }
                                    .deleteBtn{
                                        background: url('./images/delete1.png') no-repeat 0 0;
                                    }
                                    .leftLayBtn{
                                        background: url('./images/leftLay.png') no-repeat 0 0;
                                    }
                                    .rightLayBtn{
                                        background: url('./images/rightLay.png') no-repeat 0 0;
                                    }
                                }
                            }
                    }

                }
            }
            .containerBottom{
                margin-top:32px;
                width: 100%;
                height: 550px;
                // border:1px solid #ccc;
                position: relative;
                .containerBottomOne{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:0;
                //    border-right:1px solid #ccc;
                    .oneHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .oneTable{
                        width:96%;
                        margin-top:18px;
                        .tableList{
                             border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                        height: 30px;
                                        text-align: center;
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
                .containerBottomTwo{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:25%;
                //    border-right:1px solid #ccc;
                    .twoHeader{
                         height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .twoGraph{
                        // height: 700px;
                        width: 96%;
                        margin:0 auto;
                        margin-top:20px;
                        // transform: rotate(90deg);
                        border:1px solid #ccc;
                        padding: 48px 15px 25px 15px;
                        // width: 100%;
                        

                    }
                }
                .containerBottomThree{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:50%;
                //    border-right:1px solid #ccc;
                    .threeHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .threeTable{
                         width:96%;
                        margin-top:18px;
                        .tableList{
                             border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
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
                                        height: 30px;
                                        text-align: center;
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
                .containerBottomFour{
                     position: absolute;
                    width: 25%;
                    height: 650px;
                    left:75%;
                //    border-right:1px solid #ccc;
                    .fourHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .fourGraph{
                            width: 96%;
                            margin: 0 auto;
                            margin-top: 20px;
                            border: 1px solid #ccc;
                            padding: 48px 15px 25px 15px;
                    }
                }



            }
            


        }
    }
}

</style>

