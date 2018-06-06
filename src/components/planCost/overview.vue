<template>
    <div  id="costOverView">
        <div id="item-box-file">
            <router-link :to="'/Cost/management'" class="label-item label-item-active">  
                成本概览  
            </router-link>
            <router-link :to="'/Cost/goujianList'"  class="label-item">  
                构件量清单  
            </router-link>
            <router-link :to="'/Cost/quantities'"  class="label-item">  
                工程量清单  
            </router-link>
             <router-link :to="'/Cost/inventory'" class=" label-item">  
                物料量清单  
            </router-link>
            <router-link :to="''"  class="label-item">  
                成本审批  
            </router-link>
            <router-link :to="''"  class="label-item">  
                成本分析  
            </router-link>
        </div>
        <div class="tableBox" v-loading="loading">
            <table class="UserList" border="1" width="100%" >
                <thead class="head">
                    <tr>
                        <td width="12.5%">项目名称</td>
                        <td width="12.5%">构件总数</td>
                        <td width="12.5%">设计识别</td>
                        <td width="12.5%;">识别比例</td>
                        <td width="12.5%">出量总数</td>
                        <td width="12.5%;">出量比例</td>
                        <td width="12.5%">出料总数</td>
                        <td width="12.5%">出料比例</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in costOverviewData" :key="index">
                        <td>{{item.holderName}}</td>
                        <td>{{item.elementCount}}</td>
                        <td>{{item.designIdentity}}</td>
                        <td>{{item.designPercent+'%'}}</td>
                        <td>{{item.outputTotal}}</td>
                        <td>{{item.outputPercent+'%'}}</td>
                        <td>{{item.dischargeTotal}}</td>
                        <td>{{item.dischargePercent+'%'}}</td>
                    </tr>
                    <tr style="background-color:#f5f4f4;">
                        <td>合计</td>
                        <td>{{tfooter.componentCount}}</td>
                        <td>{{tfooter.designIdentity}}</td>
                        <td>{{Math.round(100*tfooter.designIdentity/tfooter.componentCount)+'%'}}</td>
                        <td>{{tfooter.outputTotal}}</td>
                        <td>{{Math.round(100*tfooter.outputTotal/tfooter.componentCount)+'%'}}</td>
                        <td>{{tfooter.dischargeTotal}}</td>
                        <td>{{Math.round(100*tfooter.dischargeTotal/tfooter.componentCount)+'%'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div ref="Pie" id="Pie"></div>
    </div>
</template>
<script>
import axios from 'axios';
var echarts = require('echarts');

export default {
  name:'DesignVersion',
    data(){
        return{
            costOverviewData:[],
            selectData:[],
            token:'',
            projId:'',
            BDMSUrl:'',
            selectValue:'',
            tfooter:{
                componentCount:0,
                designIdentity:0,
                outputTotal:0,
                dischargeTotal:0
            },
            loading:false,
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getCostOverView();
    },
    methods:{
        //进入设计版本页面
        getCostOverView(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/dynamic',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd != '0'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).then(()=>{
                vm.getModelCommitLogsFirst()
            })
        },
        //第一次啊加载数据
        getModelCommitLogsFirst(){
            var vm = this
            vm.loading = true
            axios({
                method:'post',
                url:vm.BDMSUrl+'project2/report/costDynamic',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.costOverviewData = response.data.rt
                        var data = []
                        var dataName = []
                        vm.costOverviewData.forEach(info=>{
                            data.push({
                                name:info.holderName, 
                                value:info.elementCount
                            })
                            dataName.push(info.holderName)
                            vm.tfooter.componentCount += info.elementCount
                            vm.tfooter.designIdentity += info.designIdentity
                            vm.tfooter.outputTotal += info.outputTotal
                            vm.tfooter.dischargeTotal += info.dischargeTotal
                        })
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('Pie'))
                        myChart.setOption({
                             title: {
                                text: '构件总数',
                                left: 'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}个 ({d}%)"
                            },
                            legend: {
                                // orient: 'horizontal',
                                // top: 'middle',
                                bottom: 10,
                                left: 'center',
                                data: dataName
                            },
                            series : [
                                {
                                    name: '构件总数',
                                    type: 'pie',
                                    radius: '60%',
                                    center: ['50%', '50%'],
                                    selectedMode: 'single',
                                    data:data,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
                vm.loading = false
            }).catch((err)=>{
                console.log(err)
            })
        },
       
        //判断空间操作
        getOperator(operator){
            if(operator == 0){
                return "增加";
            }else if(operator == 1){
                return "更新";
            }else if(operator == 2){
                return "删除";
            }else if(operator == 3){
                return "不变";
            }
        }
    }
}
</script>
<style lang="less" scoped>
    #costOverView{
        box-sizing: border-box;
        position: fixed;
        top: 116px;
        left: 26px;
        bottom:0;
        right: 0;
        overflow: auto;
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
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
                    overflow: hidden;
                    .singelOne{
                        float: left;
                        color: #999;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                    }
                }
        }
        .selectOption{
            position: relative;
            width: 212px;
            float: left;
            select{
                height: 28px;
                width: 212px;
                border-radius: 28px;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 10px;
                border: 1px solid #ccc;
            }
            .icon-sanjiaoone{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image:url('../ManageDesign/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 13px;
                left: 180px;
            }
        }
        .tableBox{
            display: block;
            padding: 20px;
            margin-right: 20px;
            min-height: 200px;
            width: 100%;
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                .head{
                    background: #f2f2f2;
                    td{
                        padding-left: 9px;
                        height: 52px;
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
                            padding-left: 9px;
                            height: 52px;
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
                    tr:nth-child(2n){
                        background: #fafafa
                    }
                }
            }
        }
        #Pie{
            display: block;
            width: 360px;
            height: 400px;
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    }
</style>



