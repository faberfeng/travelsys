<template>
    <div id="resourcePlan">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item">  
                个人日历  
                </router-link>
                <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item label-item-active">  
                资源计划  
                </router-link>
                <router-link :to="'/SchedulePlan/taskIndex'" class="label-item">  
                工程任务  
                </router-link>
                <router-link :to="'/SchedulePlan/calendarConfig'" class="label-item">  
                更多配置  
                </router-link>
            </div>
            <div class="resourcePlanBody">
                <div class="planHead">
                    <div class="planLeft">
                        <span :class="[{'planActive':isActive.item1},'dayPlan']" @click="getdayplan">日计划</span>
                        <span :class="[{'planActive':isActive.item2},'weekPlan']" @click="getweekplan">周计划</span>
                        <span :class="[{'planActive':isActive.item3},'monthPlan']" @click="getmonthplan">月计划</span>
                    </div>
                    <div class="planRight" @click="addNewResource">
                        增加新资源
                    </div>
                </div>
                <div class="timeChange">
                    <div v-show="planType==1"><i class="el-icon-caret-left action" @click="lastMonth"></i><span class="titleText">{{title}}</span><i class="el-icon-caret-right action" @click="nextMonth"></i></div>
                    <div v-show="planType==2"><i class="el-icon-caret-left action" @click="lastWeek"></i><span class="titleText">{{title}}</span><i class="el-icon-caret-right action" @click="nextWeek"></i></div>
                    <div v-show="planType==3"><i class="el-icon-caret-left action" @click="lastYear"></i><span class="titleText">{{title}}</span><i class="el-icon-caret-right action" @click="nextYear"></i></div>
                </div>
               <div class="chartlineBody">
                   
                    <vue-highcharts  :options="options" ref="lineCharts"></vue-highcharts>
                    <!-- <button @click="load">load</button> -->
               </div>
                <div  class="planList">
                    <table v-show="planType==1" class="planTabel" border="1" width="100%">
                        <thead>
                            <tr>
                                <td>名称</td>
                                <td>单位</td>
                                <td>显示计划</td>
                                <td>当前日计划</td>
                                <td>当前周计划</td>
                                <td>当前月计划</td>
                                <td>显示指派</td>
                                <td>任务日指派</td>
                                <td>任务周指派</td>
                                <td>任务月指派</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in resouceTypeByParamsList" :key="index">
                                <td v-text="item.name"></td>
                                <td v-text="item.unit"></td>
                                <td><el-checkbox v-model="item.isShowPlanBolean" @change="showPlanChange(index)"></el-checkbox></td>
                                <td ><span v-show="item.id!=isActive1">{{item.curDayPlan}}</span><input v-show="item.id==isActive1" v-model="planValue1" class="planInput" type="text"/></td>
                                <td><span>{{item.curWeekPlan}}</span></td>
                                <td v-text="item.curMonthPlan"></td>
                                <td><el-checkbox v-model="item.isShowAssignBolean" @change="showAssignChange(index)"></el-checkbox></td>
                                <td v-text="item.taskDayAssign"></td>
                                <td v-text="item.taskWeekAssign"></td>
                                <td v-text="item.taskMonthAssign"></td>
                                <td><i class="editBtn actionBtn" v-show="item.id!=isActive1" @click="edit(item.id)"></i><i v-show="item.id==isActive1" class="saveBtn actionBtn" @click="save(index)"></i><i class="deleteBtn actionBtn" @click="deletePlan(index)"></i></td>
                            </tr>
                        </tbody>
                    </table>

                     <table v-show="planType==2" class="planTabel" border="1" width="100%">
                        <thead>
                            <tr>
                                <td>名称</td>
                                <td>单位</td>
                                <td>显示计划</td>
                                <td>当前周计划</td>
                                <td>当前月计划</td>
                                <td>显示指派</td>
                                <td>任务周指派</td>
                                <td>任务月指派</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in resouceTypeByParamsList" :key="index">
                                <td v-text="item.name"></td>
                                <td v-text="item.unit"></td>
                                <td><el-checkbox v-model="item.isShowPlanBolean" @change="showPlanChange(index)"></el-checkbox></td>
                                <td><span v-show="item.id!=isActive2">{{item.curWeekPlan}}</span><input v-show="item.id==isActive2" v-model="planValue2" class="planInput" type="text"/></td>
                                <td v-text="item.curMonthPlan"></td>
                                <td><el-checkbox v-model="item.isShowAssignBolean" @change="showAssignChange(index)"></el-checkbox></td>
                                <td v-text="item.taskWeekAssign"></td>
                                <td v-text="item.taskMonthAssign"></td>
                                <td><i class="editBtn actionBtn" v-show="item.id!=isActive2" @click="edit(item.id)"></i><i v-show="item.id==isActive2" class="saveBtn actionBtn" @click="save(index)"></i><i class="deleteBtn actionBtn" @click="deletePlan(index)"></i></td>
                            </tr>
                        </tbody>
                    </table>

                     <table v-show="planType==3" class="planTabel" border="1" width="100%">
                        <thead>
                            <tr>
                                <td>名称</td>
                                <td>单位</td>
                                <td>显示计划</td>
                                <td>当前月计划</td>
                                <td>显示指派</td>
                                <td>任务月指派</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in resouceTypeByParamsThreeYearList" :key="index">
                                <td v-text="item.name"></td>
                                <td v-text="item.unit"></td>
                                <td><el-checkbox v-model="item.isShowPlanBolean" @change="showPlanChange(index)"></el-checkbox></td>
                                <td><span v-show="item.id!=isActive3">{{item.curMonthPlan}}</span><input v-show="item.id==isActive3" v-model="planValue3" class="planInput" type="text"/></td>
                                <td><el-checkbox v-model="item.isShowAssignBolean" @change="showAssignChange(index)" ></el-checkbox></td>
                                <td v-text="item.taskMonthAssign"></td>
                                <td><i class="editBtn actionBtn" v-show="item.id!=isActive3" @click="edit(item.id)"></i><i v-show="item.id==isActive3" class="saveBtn actionBtn" @click="save(index)"></i><i class="deleteBtn actionBtn" @click="deletePlan(index)"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="添加资源类别" :visible.sync="addResourceTypeDialog" @close="addResourceCancle">
                <div class="body">
                    <div class="head">
                        <span class="text">资源类别名称:</span>
                        <div class=editSelect1>
                            <select v-model="resourceTypeNameValue" @change="resourceTypeChange">
                                <option v-for="(item,index) in resourceTypeList" :key="index" :value="item.id">{{item.name}}</option>
                            </select>
                             <i class="icon-sanjiao"></i>
                        </div>
                    </div>
                    <div class="head"><span class="text">名称:</span>
                    <div class="tree">
                        <el-tree id="resourceTypeTree" ref="resourceTyepTree" highlight-current node-key="id" :default-expand-all='true' :data="resourceTypeData" :props="defaultProps" @node-click="nodeClick">
                        </el-tree>
                    </div>
                    </div>
                    <div class="head"><span class="text">单位:</span><input v-model="unitName" class="context" type="text"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addResourceTypeMakeSure">确定</button>
                    <button class="editBtnC" @click="addResourceCancle">取消</button>
                </div>
            </el-dialog>

        </div>
         <div id="inital">
            <!-- 工作日休息日删除 -->
            <el-dialog  :visible.sync="deleteResourcePlanDialog" width="398px" @close="deleteResourcePlanClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">确定删除吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteResourcePlanMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteResourcePlanClose">取消</button>
                </div>
            </el-dialog>
         </div>
        
    </div> 
</template>
<script>
import axios from 'axios'
import VueHighcharts from 'vue2-highcharts'
// import Drilldown from '../node_modules/highcharts/modules/Drilldown.js'
import Highcharts from 'highcharts'
export default{
    name:'resourcePlan',
    components: {
        VueHighcharts
    },
    data(){
        return {
            title:'',//显示当前时间
            deleteResourcePlanDialog:false,//删除任务资源弹窗
            addResourceTypeDialog:false,//增加资源任务树形弹窗
            planType:1,//计划类型(日、周、月)
            isActive1:'',
            isActive2:'',
            isActive3:'',
            planValue:'',
            planValue1:'',
            planValue2:'',
            planValue3:'',
            asyncData:{},
            isActive:{
                item1:false,
                item2:false,
                item3:false
            },
            nowTime:'',
            resouceTypeByParamsList:[],//日/周资源计划数据
            resouceTypeByParamsThreeYearList:[],//月资源计划数据
            lineDataOfMonthList:[],//日计划折线图
            LineDataOfHalfYearList:[],//周计划折线图
            LineDataOfThreeYearList:[],//月计划折线图
            lineCalendarTime1:[],
            lineName1:'',
            lineAmount1:'',
            lineCalendarTime2:[],
            lineName2:'',
            lineAmount2:'',
            lineCalendarTime3:[],
            lineName3:'',
            lineAmount3:'',
            lineCalendarTime4:[],
            lineName4:'',
            lineAmount4:'',
            isShowMonth:false,
            showInput:true,
            id:'',
            isShowPlan:'',//是否显示计划
            isShowAssign:'',//是否制定计划
            resourceTypeList:'',//加载资源类型
            resourceTypeNameValue:'',
            typeId:'',
            resourceTypeNameValue:'',//资源类型名
            resourceTypeTreeList:'', //加载资源类型树
            resourceTypeData:[],//类型树数据
            defaultProps:{
                children: 'children',
                label: 'text'
            },
            unitName:'',//单位名称
            categoriesNum:'',
            seriesNum:'',
            //引入曲线图
             options:{
                 chart: {
                    type: 'spline'
                },
                title: {
                   
                    text: '资源计划'
                },
                xAxis: {
                categories:[]
                },
                 yAxis: [{
                        title: {
                            text: '数量'
                        },
                        labels: {
                            align: 'left',
                            x: 3,
                            y: 16,
                            format: '{value:.,0f}'
                        },
                        showFirstLabel: false
                        }, { // right y axis
                            linkedTo: 0,
                            gridLineWidth: 0,
                            opposite: true,
                            title: {
                                text: null
                            },
                    }],
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },  
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 15,
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
                                click: function (e) {
                                    var html=this.title;
                                    // var str = html.charAt(html.length - 1);
                                    // console.log('大笨蛋急急急急急急');
                                        console.log(e.point.category);
                                        this.nowTime=e.point.category;
                                        console.log(this.nowTime);
                                        this.getResouceTypeByParams();
                                    // this.getResouceTypeByParams();
                                }
                            }
                        }
                    },

                },
                series:[],
            },       
        }
    },
    filters:{

    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid')
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getcurTime();
        this.getResouceTypeByParams();
        this.getLineDataOfMonth();    
    },
    mounted(){
        console.log('更新')
        this.isActive.item1=true;
        this.getResouceType();
        this.load();
    },
    updated(){
        
        // this.load();
    },
    methods:{
        //更换时间
        lastMonth(){
            var title = this.nowTime 
            var oDate1 = title.substring(4, 6);
            var nowTime = '';
            var year = '';
            var month = '';
            if (oDate1 == '01') {
                year = title.substring(0, 4) - 1;
                month = '12';
                nowTime = year + '1201';
            } else {
                year = title.substring(0, 4);
                month = oDate1 - 1;
                if (this.getStrSize(month.toString()) == 1) {
                    month = '0' + month;
                }
                nowTime = year + month + '01';
            }
            this.nowTime=nowTime;
            this.title=year + "年" + month + "月"
            this.getResouceTypeByParams();
            this.getLineDataOfMonth();
            this.resouceTypeByParamsList=[];
            this.lineDataOfMonthList=[];
        },
        nextMonth(){
            var title = this.nowTime;
            var oDate1 = title.substring(4, 6);
            var nowTime = '';
            var year = '';
            var month = '';
            if (oDate1 == '12') {
                year = Number(title.substring(0, 4)) + 1;
                month = '01';
                nowTime = year + '0101';
            } else {
                year = title.substring(0, 4);
                month = Number(oDate1) + 1;
                if (this.getStrSize(month.toString()) == 1) {
                    month = '0' + month;
                }
                nowTime = year + month + '01';
            }
            this.nowTime=nowTime;
            this.title=year + "年" + month + "月"
            this.getResouceTypeByParams();
            this.getLineDataOfMonth();
            this.resouceTypeByParamsList=[];
            this.lineDataOfMonthList=[];
        },
        lastWeek(){
            var title = this.nowTime;
            var oDate1 = title.substring(4, 6);
            var nowTime = '';
            var year = '';
            var month = '';
            var html = '';
            if (oDate1 < 7) {
                year = Number(title.substring(0, 4)) - 1;
                month = '12';
                nowTime = year + '1201';
                html = year + '年7月 - ' + year + '年12月';
            } else {
                year = title.substring(0, 4);
                month = Number(oDate1) - 6;
                if (this.getStrSize(month.toString()) == 1) {
                    month = '0' + month;
                }
                nowTime = year + month + '01';
                html = year + '年1月 - ' + year + '年6月';
            }
            this.title=html;
            this.nowTime=nowTime;
            this.getResouceTypeByParams();
            this.getLineDataOfHalfYear();
            this.resouceTypeByParamsList=[];
            this.LineDataOfHalfYearList=[];


        },
        nextWeek(){
            var title = this.nowTime
            var oDate1 = title.substring(4, 6);
            var nowTime = '';
            var year = '';
            var month = '';
            var html = '';
            if (oDate1 > 6) {
                year = Number(title.substring(0, 4)) + 1;
                month = '06';
                nowTime = year + '0601';
                html = year + '年1月 - ' + year + '年6月';
            } else {
                year = title.substring(0, 4);
                month = Number(oDate1) + 6;
                if (this.getStrSize(month.toString()) == 1) {
                    month = '0' + month;
                }
                nowTime = year + month + '01';
                html = year + '年7月 - ' + year + '年12月';
            }
            this.title=html;
            this.nowTime=nowTime;
            this.getResouceTypeByParams();
            this.getLineDataOfHalfYear();
            this.resouceTypeByParamsList=[];
            this.LineDataOfHalfYearList=[];
        },
        lastYear(){
            var title = this.nowTime;
            var html='';
            var year = Number(title.substring(0, 4)) - 3;
            var nowTime = year + title.substring(4, 8);
            html=(year - 1) + '年 ' + year + '年 ' + (year + 1) + '年';
            this.title=html;
            this.nowTime=nowTime;
            this.getResouceTypeByParamsThreeYear();
            this.getLineDataOfThreeYear();
            this.resouceTypeByParamsThreeYearList=[];
            this.LineDataOfThreeYearList=[];
        },
        nextYear(){
            var title =this.nowTime;
            var html='';
            var year = Number(title.substring(0, 4)) + 3;
            var nowTime = year + title.substring(4, 8);
            html=(year - 1) + '年 ' + year + '年 ' + (year + 1) + '年'
           this.title=html;
           this.nowTime=nowTime;
           this.getResouceTypeByParamsThreeYear();
            this.getLineDataOfThreeYear();
            this.resouceTypeByParamsThreeYearList=[];
            this.LineDataOfThreeYearList=[];
        },
         getStrSize(str) {
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        },
        //点击树型图
        nodeClick(obj){
            this.newId=obj.id;
            console.log(this.newId);
        },
        //点击新增新资源
        addNewResource(){
            this.addResourceTypeDialog=true;
            this.getResouceType();
            this.getResourceTypeTree();
        },
        addResourceTypeMakeSure(){
        axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/addResouceType1',
                headers:{
                    'token':this.token
                },
                data:{
                    name:this.newId,
                    reId:this.typeId,
                    unit:this.unitName,
                    isShowAssign: 0,
                    isShowPlan: 0,
                }
            }).then(response=>{

                if(response.data.cd=='0'){
                    this.getResouceTypeByParams();
                    this.unitName='',
                    this.resouceTypeByParamsList=[];
                    this.addResourceTypeDialog=false;
                }else if(response.data.cd=='10002'){
                    alert(response.data.rt);
                }else if(response.data.cd=='-1'){
                     alert(response.data.msg);
                }
            })
        },
        addResourceCancle(){
            this.addResourceTypeDialog=false;
        },
        resourceTypeChange(){
            this.resourceTypeList.forEach((item,index)=>{
                if(this.resourceTypeNameValue==item.id){
                    this.resourceTypeNameValue=item.id;
                }
            });
            this.getResourceTypeTree();
        },
        //获取资源类别
        getResouceType(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getResouceType',
                headers:{
                    'token':this.token
                }
            }).then(response=>{
                if(response.data.cd='0'){
                    this.resourceTypeList=response.data.rt
                    this.resourceTypeNameValue=this.resourceTypeList[0].id
                    // this.typeId=this.resourceTypeList[0].id
                }
            })
        },
        //添加资源类别树形结构
        getResourceTypeTree(){
            // console.log(this.typeId);
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourcePlanTree',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.resourceTypeNameValue
                }
            }).then(response=>{
                this.resourceTypeTreeList=response.data.rt
                this.resourceTypeData=response.data.rt
            })
        },
        // this.$refs.lineCharts.on('click', function(params){}),
         load(){
           
            let lineCharts = this.$refs.lineCharts;
            lineCharts.delegateMethod('showLoading', 'Loading...');
            // lineCharts.on('click', function(params){
            //     console.log(params)
            // })
            setTimeout(() => {
                
                if(this.planType==1){
                var num=this.lineDataOfMonthList.length;
                if(num==0){
                    lineCharts.removeSeries();
                    }else if(num==1){
                        lineCharts.removeSeries();
                        lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                        lineCharts.hideLoading();
                        lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime1});
                        }else if(num==2){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime2});
                        }else if(num==3){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime3});
                        }
                        else if(num==4){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.addSeries({name:this.lineName4,data:this.lineAmount4});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime4});
                        }
                }else if(this.planType==2){
                var num=this.LineDataOfHalfYearList.length;
                if(num==0){
                    lineCharts.removeSeries();
                    }else if(num==1){
                        lineCharts.removeSeries();
                        lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                        lineCharts.hideLoading();
                        lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime1});
                        }else if(num==2){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime2});
                        }else if(num==3){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime3});
                        }
                        else if(num==4){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.addSeries({name:this.lineName4,data:this.lineAmount4});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime4});
                        }
                }else if(this.planType==3){
                var num=this.LineDataOfThreeYearList.length;
                if(num==0){
                    lineCharts.removeSeries();
                    }else if(num==1){
                        lineCharts.removeSeries();
                        lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                        lineCharts.hideLoading();
                        lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime1});
                        }else if(num==2){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime2});
                        }else if(num==3){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime3});
                        }
                        else if(num==4){
                            lineCharts.removeSeries();
                            lineCharts.addSeries({name:this.lineName1,data:this.lineAmount1});
                            lineCharts.addSeries({name:this.lineName2,data:this.lineAmount2});
                            lineCharts.addSeries({name:this.lineName3,data:this.lineAmount3});
                            lineCharts.addSeries({name:this.lineName4,data:this.lineAmount4});
                            lineCharts.hideLoading();
                            lineCharts.getChart().xAxis[0].update({categories:this.lineCalendarTime4});
                        }
                }

            }, 20)
        },
        getdayplan(){
            this.isActive.item1=true;
            this.isActive.item2=false;
            this.isActive.item3=false;
            this.planType=1;
            var title = this.nowTime
            var year = title.substring(0, 4);
            var month= title.substring(4,6);
            var html=year+'年'+month+'月';
            this.title=html;
            this.getResouceTypeByParams();
            this.getLineDataOfMonth();
            this.resouceTypeByParamsList=[];
            this.lineDataOfMonthList=[];
           
        },
        getweekplan(){
            this.isActive.item1=false;
            this.isActive.item2=true;
            this.isActive.item3=false;
            this.planType=2;
            var title = this.nowTime;
            var oDate1 = title.substring(4, 6);
            var year = '';
            var month = '';
            var html = '';
            if (oDate1 >6) {
                year = Number(title.substring(0, 4));2018
                month = '12';
                html = year + '年7月 - ' + year + '年12月';
            } else {
                year = title.substring(0, 4);
                month = Number(oDate1) - 6;
                if (this.getStrSize(month.toString()) == 1) {
                    month = '0' + month;
                }
                html = year + '年1月 - ' + year + '年6月';
            }
            this.title=html;
            this.getResouceTypeByParams();
            this.getLineDataOfHalfYear();
            this.resouceTypeByParamsList=[];
            this.LineDataOfHalfYearList=[];
            
        },
        getmonthplan(){
            this.isActive.item1=false;
            this.isActive.item2=false;
            this.isActive.item3=true;
            this.planType=3;
            var title = this.nowTime;
            var html='';
            var year = Number(title.substring(0, 4));
            html=(year-1) + '年 ' + year + '年 ' + (year + 1) + '年';
            this.title=html;
            this.getResouceTypeByParamsThreeYear();
            this.getLineDataOfThreeYear();
            this.resouceTypeByParamsThreeYearList=[];
            this.LineDataOfThreeYearList=[];
        },
        //获取当前时间
        getcurTime(){
            let time='';
            let date=new Date();
            time=date.getFullYear()+'0'+(date.getMonth()+1)+''+date.getDate();
            this.nowTime=time;
            var title = this.nowTime
            var year = title.substring(0, 4);
            var month= title.substring(4,6);
            var html=year+'年'+month+'月';
            this.title=html;
        },
        //编辑
        edit(num){
            if(this.planType==1){
            this.resouceTypeByParamsList.forEach((item,index)=>{
                if(item.id==num){
                  this.isActive1=item.id    
                }
            })
            }else if(this.planType==2){
                this.resouceTypeByParamsList.forEach((item,index)=>{
                if(item.id==num){
                  this.isActive2=item.id    
                }
            })
            }else if(this.planType==3){
                this.resouceTypeByParamsThreeYearList.forEach((item,index)=>{
                if(item.id==num){
                  this.isActive3=item.id    
                }
            })
        }
        },
        save(index){
            if(this.planType==1){
                this.isActive1=!this.isActive1;
                this.planValue=this.planValue1;
                this.id=this.resouceTypeByParamsList[index].id;
            }else if(this.planType==2){
                this.isActive2=!this.isActive2
                this.planValue=this.planValue2;
                this.id=this.resouceTypeByParamsList[index].id;
            }else if(this.planType==3){
                this.isActive3=!this.isActive3
                this.planValue=this.planValue3;
                this.id=this.resouceTypeByParamsThreeYearList[index].id
            }
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/editResourceTaskPlan',
                headers:{
                    'token':this.token
                },
                params:{
                    planValue:this.planValue,
                    type:this.planType,
                    id:this.id,
                    nowTime:this.nowTime
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    if(this.planType==1){
                    this.getResouceTypeByParams();
                    this.getLineDataOfMonth();
                    this.resouceTypeByParamsList=[];
                    this.lineDataOfMonthList=[];
                    }else if(this.planType==2){
                        this.getResouceTypeByParams();
                        this.getLineDataOfHalfYear();
                        this.resouceTypeByParamsList=[];
                        this.LineDataOfHalfYearList=[];
                    }else if(this.planType==3){
                        this.getResouceTypeByParamsThreeYear();
                        this.getLineDataOfThreeYear();
                        this.resouceTypeByParamsThreeYearList=[];
                        this.LineDataOfThreeYearList=[];
                    }
                }
            })
        },
        //点击删除资源任务
        deletePlan(index){
            this.deleteResourcePlanDialog=true;
            if(this.planType==1){
                this.id=this.resouceTypeByParamsList[index].id;
            }else if(this.planType==2){
                this.id=this.resouceTypeByParamsList[index].id;
            }else if(this.planType==3){
                this.id=this.resouceTypeByParamsThreeYearList[index].id
            }
        },
        //确认删除资源任务
        deleteResourcePlanMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/deleteResourceType',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    id:this.id
                }
            }).then(response=>{
                if(response.data.cd=='10002'){
                    if(this.planType==1){
                    this.getResouceTypeByParams();
                    this.getLineDataOfMonth();
                    this.resouceTypeByParamsList=[];
                    this.lineDataOfMonthList=[];
                    }else if(this.planType==2){
                        this.getResouceTypeByParams();
                        this.getLineDataOfHalfYear();
                        this.resouceTypeByParamsList=[];
                        this.LineDataOfHalfYearList=[];
                    }else if(this.planType==3){
                        this.getResouceTypeByParamsThreeYear();
                        this.getLineDataOfThreeYear();
                        this.resouceTypeByParamsThreeYearList=[];
                        this.LineDataOfThreeYearList=[];
                    }
                }else if(response.data.cd=='10001'){
                    this.deleteResourcePlanDialog=false;
                    alert(response.data.msg)
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }
                this.deleteResourcePlanDialog=false;
            })
        },
        deleteResourcePlanClose(){
            this.deleteResourcePlanDialog=false;
        },
        //改变显示计划监听
        showPlanChange(index){
            this.ShowPlan(index)
        },
        
        //是否显示计划
        ShowPlan(index){
            if(this.planType<=2){
                this.id=this.resouceTypeByParamsList[index].id,
                this.isShowPlan=this.resouceTypeByParamsList[index].isShowPlanBolean?1:0
            }else if(this.planType==3){
                this.id=this.resouceTypeByParamsThreeYearList[index].id,
                this.isShowPlan=this.resouceTypeByParamsThreeYearList[index].isShowPlanBolean?1:0
            }//获取日、周、月计划传递给后台的数据

            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/alterIsShowPlan',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.id,
                    isShowPlan:this.isShowPlan
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    if(this.planType==1){
                        this.getResouceTypeByParams();
                        this.getLineDataOfMonth();
                        this.resouceTypeByParamsList=[];
                        this.lineDataOfMonthList=[];
                        }else if(this.planType==2){
                            this.getResouceTypeByParams();
                            this.getLineDataOfHalfYear();
                            this.resouceTypeByParamsList=[];
                            this.LineDataOfHalfYearList=[];
                        }else if(this.planType==3){
                            this.getResouceTypeByParamsThreeYear();
                            this.getLineDataOfThreeYear();
                            this.resouceTypeByParamsThreeYearList=[];
                            this.LineDataOfThreeYearList=[];
                        }
                }else if(response.data.cd=="10001"){
                    alert(response.data.msg)
                    this.isShowPlan=false;
                    if(this.planType==1){
                        this.getResouceTypeByParams();
                        this.getLineDataOfMonth();
                        this.resouceTypeByParamsList=[];
                        this.lineDataOfMonthList=[];
                        }else if(this.planType==2){
                            this.getResouceTypeByParams();
                            this.getLineDataOfHalfYear();
                            this.resouceTypeByParamsList=[];
                            this.LineDataOfHalfYearList=[];
                        }else if(this.planType==3){
                            this.getResouceTypeByParamsThreeYear();
                            this.getLineDataOfThreeYear();
                            this.resouceTypeByParamsThreeYearList=[];
                            this.LineDataOfThreeYearList=[];
                        }
                }
                else if(response.data.cd=='-1'){
                    alert(response.data.msg)
                }
            })
        },
        
        //触发是否指派计划
        showAssignChange(index){
            this.ShowAssign(index)
        },
        //是否指派计划
        ShowAssign(index){
            if(this.planType<=2){
                this.id=this.resouceTypeByParamsList[index].id,
                this.isShowAssign=this.resouceTypeByParamsList[index].isShowAssignBolean?1:0
            }else if(this.planType==3){
                this.id=this.resouceTypeByParamsThreeYearList[index].id,
                this.isShowAssign=this.resouceTypeByParamsThreeYearList[index].isShowAssignBolean?1:0
            }//获取日、周、月计划传递给后台的数据
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/alterIsShowAssign',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.id,
                    isShowAssign:this.isShowAssign
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    if(this.planType==1){
                        this.getResouceTypeByParams();
                        this.getLineDataOfMonth();
                        this.resouceTypeByParamsList=[];
                        this.lineDataOfMonthList=[];
                        }else if(this.planType==2){
                            this.getResouceTypeByParams();
                            this.getLineDataOfHalfYear();
                            this.resouceTypeByParamsList=[];
                            this.LineDataOfHalfYearList=[];
                        }else if(this.planType==3){
                            this.getResouceTypeByParamsThreeYear();
                            this.getLineDataOfThreeYear();
                            this.resouceTypeByParamsThreeYearList=[];
                            this.LineDataOfThreeYearList=[];
                        }
                }else if(response.data.cd=="10001"){
                    alert(response.data.msg)
                    this.isShowAssign=false;
                    if(this.planType==1){
                        this.getResouceTypeByParams();
                        this.getLineDataOfMonth();
                        this.resouceTypeByParamsList=[];
                        this.lineDataOfMonthList=[];
                        }else if(this.planType==2){
                            this.getResouceTypeByParams();
                            this.getLineDataOfHalfYear();
                            this.resouceTypeByParamsList=[];
                            this.LineDataOfHalfYearList=[];
                        }else if(this.planType==3){
                            this.getResouceTypeByParamsThreeYear();
                            this.getLineDataOfThreeYear();
                            this.resouceTypeByParamsThreeYearList=[];
                            this.LineDataOfThreeYearList=[];
                        }
                }else if(response.data.cd=='-1'){
                    
                    alert(response.data.msg)
                    
                    
                }
            })
        },
        lineData(num,obj){

        },
        //获取日计划图表
        getLineDataOfMonth(){
            axios({
                methods:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getLineDataOfMonth',
                headers:{
                    'token':this.token
                },
                params:{
                    nowTime:this.nowTime
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.lineDataOfMonthList=response.data.rt;
                    let caTime1=[],caName1=[],amount1=[],caTime2=[],caName2=[],amount2=[],caTime3=[],caName3=[],amount3=[],caTime4=[],caName4=[],amount4=[];
                    var num;
                    var obj;
                    obj=this.lineDataOfMonthList;
                    num=this.lineDataOfMonthList.length;
                    if(num==0){
                        this.lineCalendarTime1=caTime1;
                        this.lineName1=caName1;
                        this.lineAmount1=amount1;
                     }else if(num==1){
                        obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                        })}else if(num==2){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                        }else if(num==3){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                        }else if(num==4){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                            obj[3].forEach((item4)=>{
                                caTime4.push(item4.calendarTime);
                                    caName4=item4.name;
                                    amount4.push(item4.amount);
                                    this.lineCalendarTime4=caTime4;
                                    this.lineName4=caName4;
                                    this.lineAmount4=amount4;
                            })
                    }
                    this.load();
                    // var obj = this.lineDataOfMonthList;
                    // var categories = '[';
                    // var series = '[';
                    // for (var i in obj) {
                    //     var ml = obj[i];
                    //         series = series + "{'name':'" + ml[0].name + "','data':'[";
                    //         for (var j in ml) {
                    //             if (i == 0) {
                    //                 categories = categories + "'" + ml[j].calendarTime + "'";
                    //                 if (j == ml.length - 1) {

                    //                 } else {
                    //                     categories += ",";
                    //                 }
                    //             }
                    //             series = series + ml[j].amount;
                    //             if (j == ml.length - 1) {

                    //             } else {
                    //                 series += ",";
                    //             }
                    //         }
                    //         series += "]'}";
                    //         if (i == 7) {

                    //         } else {
                    //             series += ",";
                    //         }
                        

                    // }
                    // categories += ']';
                    // series +=']';
                    // this.categoriesNum=categories;
                    // this.seriesNum=series;
                    // this.load();
                   
                }else if(response.data.cd == '-1'){
                        console.log(response.data.msg)
                    }
            })
        },
        //获取折线图数据(周)
        getLineDataOfHalfYear(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getLineDataOfHalfYear',
                headers:{
                    'token':this.token
                },
                params:{
                    nowTime:this.nowTime
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.LineDataOfHalfYearList=response.data.rt
                    let caTime1=[],caName1=[],amount1=[],caTime2=[],caName2=[],amount2=[],caTime3=[],caName3=[],amount3=[],caTime4=[],caName4=[],amount4=[];
                    var num;
                    var obj;
                    obj=this.LineDataOfHalfYearList;
                    num=this.LineDataOfHalfYearList.length;
                    if(num==0){
                        this.lineCalendarTime1=caTime1;
                        this.lineName1=caName1;
                        this.lineAmount1=amount1;
                     }else if(num==1){
                        obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                        })}else if(num==2){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    console.log(JSON.stringify(this.lineCalendarTime1));
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                        }else if(num==3){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                        }else if(num==4){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                   
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                            obj[3].forEach((item4)=>{
                                caTime4.push(item4.calendarTime);
                                    caName4=item4.name;
                                    amount4.push(item4.amount);
                                    this.lineCalendarTime4=caTime4;
                                    this.lineName4=caName4;
                                    this.lineAmount4=amount4;
                            })
                    }
                    this.load();
            // var categories = "[";
            // var series = "[";
            // for (var i in obj) {
            //     var ml = obj[i];
            //         series = series + "{name:'" + ml[0].name + "',data:[";
            //         for (var j in ml) {
            //             if (i == 0) {
            //                 categories = categories + "'" + ml[j].calendarTime + "'";
            //                 if (j == ml.length - 1) {

            //                 } else {
            //                     categories += ",";
            //                 }
            //             }
            //             series = series + ml[j].amount;
            //             if (j == ml.length - 1) {

            //             } else {
            //                 series += ",";
            //             }
            //         }
            //         series += "]}";
            //         if (i == 7) {

            //         } else {
            //             series += ",";
            //         }
                

            // }
            // categories += "]";
            // series +="]";
                }else if(response.data.cd=='-1'){
                    console.log(response.data.msg)
                }
            })
        },
        //获取折线图数据(月)
        getLineDataOfThreeYear(){
             axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getLineDataOfThreeYear',
                headers:{
                    'token':this.token
                },
                params:{
                    nowTime:this.nowTime
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.LineDataOfThreeYearList=response.data.rt
                    let caTime1=[],caName1=[],amount1=[],caTime2=[],caName2=[],amount2=[],caTime3=[],caName3=[],amount3=[],caTime4=[],caName4=[],amount4=[];
                    var num;
                    var obj;
                    obj=this.LineDataOfThreeYearList;
                    num=this.LineDataOfThreeYearList.length;
                    if(num==0){
                        this.lineCalendarTime1=caTime1;
                        this.lineName1=caName1;
                        this.lineAmount1=amount1;
                     }else if(num==1){
                        obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                        })}else if(num==2){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                        }else if(num==3){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                        }else if(num==4){
                            obj[0].forEach((item1)=>{
                                    caTime1.push(item1.calendarTime);
                                    caName1=item1.name;
                                    amount1.push(item1.amount);
                                    this.lineCalendarTime1=caTime1;
                                    this.lineName1=caName1;
                                    this.lineAmount1=amount1;
                                    
                                })
                            obj[1].forEach((item2)=>{
                                caTime2.push(item2.calendarTime);
                                    caName2=item2.name;
                                    amount2.push(item2.amount);
                                    this.lineCalendarTime2=caTime2;
                                    this.lineName2=caName2;
                                    this.lineAmount2=amount2;
                            })
                            obj[2].forEach((item3)=>{
                                caTime3.push(item3.calendarTime);
                                    caName3=item3.name;
                                    amount3.push(item3.amount);
                                    this.lineCalendarTime3=caTime3;
                                    this.lineName3=caName3;
                                    this.lineAmount3=amount3;
                            })
                            obj[3].forEach((item4)=>{
                                caTime4.push(item4.calendarTime);
                                    caName4=item4.name;
                                    amount4.push(item4.amount);
                                    this.lineCalendarTime4=caTime4;
                                    this.lineName4=caName4;
                                    this.lineAmount4=amount4;
                            })
                    }
                    this.load();
                }else if(response.data.cd=='-1'){
                    console.log(response.data.msg)
                }
            })
        },
        //获取资源类型(日/周)
        getResouceTypeByParams(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getResouceTypeByParams',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    nowTime:this.nowTime
                }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        let str=response.data.rt
                        str.forEach((item)=>{
                            if(item.isShowPlan==1){
                                item.isShowPlanBolean=true;
                            }else{
                                item.isShowPlanBolean=false;
                            }
                            if(item.isShowAssign==1){
                                item.isShowAssignBolean=true;
                            }else{
                                item.isShowAssignBolean=false;
                            }
                            this.resouceTypeByParamsList.push(item);
                        })
                       
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }
                })
        },
        //获取资源类型(月)
        getResouceTypeByParamsThreeYear(){
            axios({
                method:'post',
                url:this.BDMSUrl+'/project2/schedule/'+this.projId+'/resourceType/getResouceTypeByParamsThreeYear',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    nowTime:this.nowTime
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    let str=response.data.rt
                        str.forEach((item)=>{
                            if(item.isShowPlan==1){
                                item.isShowPlanBolean=true;
                            }else{
                                item.isShowPlanBolean=false;
                            }
                            if(item.isShowAssign==1){
                                item.isShowAssignBolean=true;
                            }else{
                                item.isShowAssignBolean=false;
                            }
                            this.resouceTypeByParamsThreeYearList.push(item);
                        })
                    
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }
            })

        }

    }
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
    #resourcePlan{
        .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
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
        .resourcePlanBody{
            width:96%;
            margin:0 auto;
            padding: 12px;
            margin-top:20px;

            .planHead{
                height: 32px;
                box-sizing: border-box;
                .planLeft{
                    float: left;
                    .planActive{
                        color:#ffffff !important;
                        background: #fc3439 !important;
                    }
                    .dayPlan{
                        display: inline-block;
                        width: 64px;
                        height: 28px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .weekPlan{
                        display: inline-block;
                        width: 64px;
                        height: 28px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .monthPlan{
                        display: inline-block;
                        width: 64px;
                        height: 28px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                }
                .planRight{
                        float:right;
                        width: 108px;
                        height: 28px;
                        border:1px solid #fc3439;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color:#ffffff;
                        border-radius: 4px;
                        cursor: pointer;
                }

            }
            .timeChange{
                height: 20px;
                margin-bottom: 10px;
                margin: 0 auto;
                .action{
                    width: 20px;
                    height:20px;
                    background: #f2f2f2;
                }
                .titleText{
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: bold;
                    color: #333333;
                }
            }
            .chartlineBody{
                margin-top:20px;
                width: 100%;
                background: #fafafa;
            }
            .planList{
                // height: 270px;
                // overflow: auto;
                box-sizing: border-box;
                margin-top:20px;
                .planTabel{
                    border-collapse:collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                        background:#f2f2f2;
                        tr{
                            td{
                                padding-left:10px;
                                height: 40px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #666666;
                            }
                        }
                    }
                    tbody{
                        tr{
                            background:#fff;
                            td{
                                padding-left:10px;
                                height: 40px;
                                text-align: center;
                                font-size: 12px;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                color: #666666;
                                 .actionBtn{
                                        display: inline-block;
                                        width: 16px;
                                        height: 16px;
                                        border: none;
                                        cursor: pointer;
                                        margin-right: 16px;
                                    }
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat;
                                    }
                                    .editBtn{
                                            background: url('../../assets/edit.png') no-repeat;
                                        }
                                    .saveBtn{
                                        background: url('./images/worktask.png') no-repeat;
                                    }
                                    .planInput{
                                        width: 60px;
                                        height: 18px;

                                    }
                            }
                        }
                    }

                }
            }
        }
        //编辑弹出框
        #edit{
            .el-dialog{
            .el-dialog__body{
                    height: 340px;
                    background: #f2f2f2;
                    position: relative;
                    margin: 0 auto;
                    .body{
                        .head{
                            margin-top:30px;
                            .tree{
                                    right: 10px;
                                    height: 250px;
                                    width: 330px;
                                    margin-left: 189px;
                                    border:1px solid #fafafa;
                                    overflow:auto;    
                                    #resourceTypeTree{
                                    /*
                                    修改eleUI树形组件
                                    */
                                            .el-tree-node:focus .el-tree-node__content{
                                                background-color: transparent;
                                                height: 200px;
                                            }
                                            .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                                                    background-color: #dfdfdf;
                                            }
                                            .el-tree-node__label{
                                                font-size: 12px;
                                                min-height: 16px;
                                                color: #666666;
                                                padding-left: 22px; 
                                                position: relative;
                                            }
                                            .qjLeaf{
                                                font-weight: bold;
                                            }
                                            .el-tree-node__expand-icon .el-icon-caret-right:before{
                                                content: "\E604";
                                                color: #999999;
                                                font-weight: bold;
                                                display: block;
                                                position: absolute;
                                                top: 2px;
                                                left: 4px;
                                                width: 14px;
                                                height: 13px;
                                                background: url('./images/file.png')no-repeat 0 0 !important;
                                                content: '';
                                                
                                            }
                                            .el-tree-node__label::before{
                                                display: block;
                                                position: absolute;
                                                top: 2px;
                                                left: 4px;
                                                width: 14px;
                                                height: 13px;
                                                background: url('./images/file.png')no-repeat 0 0;
                                                content: '';
                                            }
                                            .el-tree-node__content{
                                                    height: 30px;
                                            }
                                            .is-current .el-tree-node__content{
                                                color: #333333;
                                            // font-weight: bold;
                                            }
                                            .is-current_fistload > .el-tree-node__content {
                                                background-color: #dfdfdf;
                                            }
                                        } 
                                }
                            .text{
                                float: left;
                                margin-left:75px;
                                height: 30px;
                                 color: #666;
                                font-size: 14px;
                                line-height: 30px;
                                font-weight: normal;
                                display: inline-block;
                            }
                            .editSelect1{
                                select{
                                    width: 330px;
                                    height: 30px;
                                    border: 1px solid #cccccc;
                                    position: relative;
                                    background: #fff;
                                    padding-left:10px;
                                    padding-right:20px;
                                    box-sizing: border-box;  
                                    margin-left: -115px;
                                    color: #333333;
                                    font-size: 14px;
                                    outline: none;
                                    }
                                    .icon-sanjiao{
                                        display: block;
                                        position: absolute;
                                        width: 12px;
                                        height: 7px;
                                        background-image:url('../Settings/images/sanjiao.png');
                                        background-size: 100% 100%;
                                        content: '';
                                        top: 122px;
                                        right: 155px;
                                    }
                            }
                            
                        }
                    .context{
                        height: 30px;
                        width: 330px;
                        margin-left:-65px;
                        }
                    }
            }
            }
        }
        //删除弹出框
         #inital{
            .deleteDialogImg{
                height: 50px;
                }
            .deleteDialogWarning{
            font-size: 18px;
            line-height: 18px;
            font-family: 'MicrosoftYahei';
            color: #fc3439;
            font-weight: bold;
            margin:20px 0 0 0;
            }
            .deleteDialogText{
                color: #333333;
                font-size: 14px;
                line-height: 14px;
                font-family: 'MicrosoftYahei';
                font-weight: normal;
                margin: 16px 5px 0px 5px;
            }
        }
    }
</style>
<style lang="less">
.tree{
                                   
                                    #resourceTypeTree{
                                    /*
                                    修改eleUI树形组件
                                    */
                                        
                                            .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                                                    background-color: #dfdfdf;
                                            }
                                            .el-tree-node__label{
                                                font-size: 12px;
                                                min-height: 16px;
                                                color: #666666;
                                                padding-left: 22px; 
                                                position: relative;
                                            }
                                            
                                            .el-tree-node__expand-icon .el-icon-caret-right:before{
                                                content: "\E604";
                                                color: #999999;
                                                font-weight: bold;
                                                display: block;
                                                position: absolute;
                                                top: 2px;
                                                left: 4px;
                                                width: 14px;
                                                height: 13px;
                                                background: url('./images/file.png')no-repeat 0 0 !important;
                                                content: '';
                                                
                                            }
                                            .el-tree-node__label::before{
                                                display: block;
                                                position: absolute;
                                                top: 2px;
                                                left: 4px;
                                                width: 14px;
                                                height: 13px;
                                                background: url('./images/file.png')no-repeat 0 0;
                                                content: '';
                                            }
                                           
                                        } 
                                }
</style>

