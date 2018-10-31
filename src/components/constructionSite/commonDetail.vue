<template>
    <div id="commonDetail">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{projctName}}</span>
            </p>
        </div>
        <div class="projectBody">
            <div class="projectBodyHead">
                <div class="headLeft">
                    <span class="headLeftBtn">导出</span>
                    <span class="headLeftBtn">底图</span>
                    <span class="headLeftBtn">单点</span>
                    <span class="headLeftBtn">连续</span>
                    <span class="headLeftBtn">文字</span>
                </div>
                <div class="headMiddle">
                    <label>测试总数：80</label>
                    <label>报警：22</label>
                    <label>故障：2</label>
                </div>
                <div class="headRight">
                    <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==2" class="import">导入</span>
                        <span v-show="importMethod==1" class="import">配置</span>
                </div>
            </div>
            <div class="projectBodyCenter">
                <div class="operateTool">
                    <div class="operateToolLeft">
                        <span class="move"><i class="moveIcon"><label class="moveTxt">移动</label></i></span>
                        <span class="fault"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                        <span class="deleteDraw"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                    </div>
                </div>
                
            </div>
            <div class="projectBodyBottom">
                <div class="bottomTabel">
                    <table class="bottomTableList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">测点编号</th>
                                <th colspan="2">初始采集</th>
                                <th colspan="2">上次采集</th>
                                <th colspan="2">本次采集</th>
                                <th colspan="3">变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>变化时间</th>
                                <th>本次(mm)</th>
                                <th>累计(mm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getPointDatasList" :key="index"> 
                                <td>{{item.pointName|addSprit()}}</td>
                                <td>{{item.initAcquisitionTime|timeChange()}}</td>
                                <td>{{item.initData|addSprit()}}</td>
                                <td>{{item.lastAcquisitionTime|timeChange()}}</td>
                                <td>{{item.lastData|addSprit()}}</td>
                                <td>{{item.latestAcquisitionTime|timeChange()}}</td>
                                <td>{{item.latestData|addSprit()}}</td>
                                <td>{{item.variationTime|timeStamp()}}</td>
                                <td>{{item.recentVariation|addSprit()}}</td>
                                <td>{{item.totalVariation|addSprit()}}</td>
                                <td>
                                    <button title="定位" class="location actionBtn"></button>
                                    <button title="曲线" @click="getCurve(item.pointId)" class="curve actionBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bottomTabelPagination">
                    <div class="paginationLeft">
                        <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">报警值：</label><label style="color:#333;font-size:14px;line-height:62px">单次3mm/d</label></span>
                        <span class="leftBtnOne" @click="editAlertValueBtn()">修改</span>
                        <span class="leftTxtTwo">
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">观测：</label><label style="color:#333;font-size:14px;line-height:62px">{{observerName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">计算：</label><label style="color:#333;font-size:14px;line-height:62px">{{calculatorName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">检核：</label><label style="color:#333;font-size:14px;line-height:62px">{{inspectorName}}</label>
                        </span>
                        <span class="leftBtnOne" @click="editPersonBtn()">修改</span>
                    </div>
                    <div class="paginationRight">
                        <el-pagination class="elPagination"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage2"
                            :page-sizes="[10, 20, 30, 40,50]"
                            :page-size="10"
                            layout="sizes,prev, pager, next"
                            :total="50">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="修改监测内容相关人员" width="400px" :visible="editPersonShow" @close="editPersonCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText">观测员</label>
                        <select v-model="observerId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">计算员</label>
                        <select v-model="calculatorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">核查员</label>
                        <select v-model="inspectorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editPersonMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editPersonCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改报警值" width="600px" :visible="editAlertValueShow" @close="editAlertValueCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText" style="width:27% !important">累计报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertTotal" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm   kN</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertDay" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm/d  kN/d</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertHour" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm/h  kN/h</label>
                    </div>
                    <!-- <div class="editBodytwo">
                        <label class="editInpText">单次报警变化量：</label>
                    </div> -->
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editAlertArgumentsMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editAlertValueCancle()" >取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
export default Vue.component('commonDetail',{
    props:['projctName','itemMonitorId','itemMonitorType','userGroupId'],
    name:'commonDetail',
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
            currentPage2:5,
            getAlertArgumentsList:'',//获取报警参数
            getPointDatasList:'',//数据表格
            pointId:'',//监测id
            editPersonShow:false,
            editAlertValueShow:false,//编辑报警值
            userGroupList:'',//监测人员列表
            observerId:"",
            calculatorId:'',
            inspectorId:'',
            observerName:'',
            calculatorName:'',
            inspectorName:'',
            getItemDutyUserList:'',
            variationAlertTotal:'',//报警变化量（累计）
            variationAlertDay:'',//报警变化量（天）
            variationAlertHour:'',//报警变化量（小时）

        }
    },
    created(){
        var vm = this;
        vm.userName  = localStorage.getItem('userName');
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId');
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getPointDatas();
        this.getUserByUserGroup();
        this.getItemDutyUser();
    },
    filters:{
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
            }
        },
        timeStamp(StatusMinute){	
            var day=parseInt(StatusMinute/60/60/24);
            var hour=parseInt(StatusMinute/60/60%24);
            var min= parseInt(StatusMinute/60%60);
            StatusMinute="";
            if (day > 0)
            {
                StatusMinute= day + "d";
            } 
            if (hour>0)
            {
                StatusMinute += hour + "h";
            } 
            if (min>0)
            {
                StatusMinute += parseFloat(min) + "m";
            }
                return StatusMinute;
        }

    },
    watch:{
        // calculatorId:function(val){

        // },
        // observerId:function(val){

        // },
        // inspectorId:function(val){

        // }



    },
    methods:{
        //返回
        back(){
            var vm = this
            vm.$emit('back')
        },
        handleSizeChange(val){
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val){
            console.log(`当前页: ${val}`);
        },
        //获取群组中的用户
        getUserByUserGroup(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getUserByUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    userGroupId:this.userGroupId
                     
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.userGroupList=response.data.rt;
                    this.observerId=this.userGroupList[0].userId;
                    this.calculatorId=this.userGroupList[0].userId;
                    this.inspectorId=this.userGroupList[0].userId;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取用户名
        getUserName(){
            


        },
        //获取警报参数
        getAlertArguments(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getAlertArguments',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getAlertArgumentsList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //编辑警报参数
        editAlertArgumentsMakeSure(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editAlertArguments',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    variationAlertTotal:this.variationAlertTotal,
                    variationAlertDay:this.variationAlertDay,
                    variationAlertHour:this.variationAlertHour
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editAlertValueShow=false;
                    this.getAlertArguments();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        editAlertValueBtn(){
            this.editAlertValueShow=true;
        },
        //编辑相关人员
        editPersonBtn(){
            this.editPersonShow=true;
            this.getUserByUserGroup();
        },
        //取消监测项目人员
        editPersonCancle(){
            this.editPersonShow=false;
        },
        //编辑项目人员
        editPersonMakeSure(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    observer:this.observerId,
                    calculator:this.calculatorId,
                    inspector:this.inspectorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editPersonShow=false;
                    this.getItemDutyUser();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取监测项目相关人员
        getItemDutyUser(){
            var vm=this;
            // this.getUserByUserGroup();
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.rt){
                     this.getItemDutyUserList=response.data.rt;
                    //  this.inspectorName=this.getItemDutyUserList.inspector;
                    //  this.calculatorName=this.getItemDutyUserList.calculator;
                    //  this.observerName=this.getItemDutyUserList.observer;
                    // console.log(this.userGroupList)
                    //  this.userGroupList.forEach((item)=>{
                    //      if(this.getItemDutyUserList.inspector==item.userId){
                    //          this.inspectorName=item.userName;
                    //      }
                    //      if(this.getItemDutyUserList.calculator==item.userId){
                    //          this.calculatorName=item.userName;
                    //      }
                    //      if(this.getItemDutyUserList.observer==item.userId){
                    //          this.observerName=item.userName;
                    //      }
                    //  })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //取消编辑报警值
        editAlertValueCancle(){
            this.editAlertValueShow=false;
        },
        // 获取监测点采集数据（表格）
        getPointDatas(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointDatas',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointDatasList=response.data.rt;
                    console.log(this.getPointDatasList,'123');
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //点击获得曲线
        getCurve(pointId){
            this.pointId=pointId;
            if(this.itemMonitorType==1){
                this.getPointVerticalShiftChartData()
            }else if(this.itemMonitorType==2){
                this.getPointVerticalShiftChartData()
            }else if(this.itemMonitorType==3){
                this.getPointGaugeChartData()
            }else if(this.itemMonitorType==4){
                this.getPointForceChartData()
            }
        },
        //获取30天曲线图（受力）
        getPointForceChartData(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointForceChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水位）
        getPointGaugeChartData(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointGaugeChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水平位移）
        getPointHorizontalShiftChartData(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointHorizontalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（垂直位移）
        getPointVerticalShiftChartData(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointVerticalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },


    }
})
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
    #commonDetail{
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
            }
        .projectBody{
            width: 98%;
            margin:0 auto;
            .projectBodyHead{
                height: 32px;
                margin-top:26px;
                .headLeft{
                    float: left;
                    .headLeftBtn{
                        display: inline-block;
                        width: 54px;
                        height: 25px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 25px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 2px;
                        cursor: pointer;
                        margin-right: 3px;
                    }
                }
                .headMiddle{
                    width: 400px;
                    display: inline-block;
                    label{
                        line-height: 32px;
                        font-size: 14px;
                        color: #333333;
                    }
                }
                .headRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
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
            .projectBodyCenter{
                        margin-top:15px !important;
                        margin:0 auto;
                        border:1px solid #e6e6e6;
                        height: 540px;
                        width: 100%;
                        position: relative;
                        .operateTool{
                            width: 288px;
                            height: 34px;
                            // border:1px solid #ccc;
                            float: right;
                            margin-top:15px;
                            margin-right:10px;
                            position: relative;
                            z-index: 10;
                            .operateToolLeft{
                                width:216px;
                                height: 34px;
                                float: left;
                                position: relative;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                background: #fff;
                                .move{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                   margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                     
                                    left:0%;
                                    .moveIcon{
                                        background: url('./images/move.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/move1.png') no-repeat 0 0;
                                        }
                                         .moveTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                      
                                        }
                                    }
                                   
                                }
                                .fault{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                    left:33%;
                                    .faultIcon{
                                        background: url('./images/falut.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/fault1.png') no-repeat 0 0;
                                        }
                                         .faultTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                        }
                                    }
                                   
                                }
                                .deleteDraw{
                                    display: inline-block;
                                     height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    left:72%;
                                    .deleteDrawIcon{
                                        background: url('./images/delete.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/delete.png') no-repeat 0 0;
                                        }
                                    }
                                    .deleteDrawTxt{
                                        line-height: 20px;
                                        color:#666666;
                                        font-size: 12px;
                                        display: block;
                                        margin-left: 12px;
                                        margin-top: 1px;
                                    }
                                }

                            }
                            // .operateToolRight{
                            //     float: right;
                            //     width: 62px;
                            //     height: 34px;
                            //     margin-left:10px;
                            //     border:1px solid #ccc;
                            //     border-radius:2px;
                            //     box-shadow: 1px 1px 2px #888888;
                            //     background: #fff;
                            //     .saveDrawTxt{
                            //         font-size:12px;
                            //         color:#666666;
                            //         line-height: 32px;
                            //     }
                            // }

                        }

            }
            .projectBodyBottom{
                margin-top:30px;
                .bottomTabel{
                    .bottomTableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
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
                                        height: 32px;
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
                                        .location{
                                            background: url('../planCost/images/location.png') no-repeat 0 0;
                                        }
                                        .curve{
                                            background: url('./images/graph.png') no-repeat 0 0;
                                        }

                                    }
                                }
                             }
                    }
                }
                .bottomTabelPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .paginationLeft{
                        position: absolute;
                        left: 50px;
                        bottom: 0px;
                        .leftBtnOne{
                            display: inline-block;
                            width: 54px;
                            height: 25px;
                            border: 1px solid #e6e6e6;
                            background: #e6e6e6;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            margin-left: 10px;
                            margin-right: 100px;
                        }


                    }
                    .paginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 10px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                        .elPagination{
                            

                        }
                    }
                }
            }


        }
        #edit{
            .editPersonInput{
                width: 200px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
        }
    }

</style>


