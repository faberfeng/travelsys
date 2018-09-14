<template>
    <div id="wuliao">
        <div class="topHeader">
            <div class="purchaseNav">
                <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem navactive">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem">  
                    检查验收  
                </router-link>
            </div>
            <div class="elselect">
                <el-select @change="changeGroup" v-model="selectUser" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in userGroup"
                    :key="index"
                    :label="item.ugName"
                    :value="item.ugId">
                    </el-option>
                </el-select>
                <label class="elselecttitle">群组:</label>
            </div>
            <div class="pbody">
                <div class="pbodyleft">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="'有计划 '+planData.length" name="first">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndexone == index?'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,1)">
                                        <label class="lefttitlelab">{{item.planName.split(' ')[0]}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.planName.split(' ')[1]+item.planName.split(' ')[2]}}</span>
                                        <span>
                                            <i @click="deletePlan(item)" title="删除计划" class="deleteIcon"></i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'无计划 '+noPlanData.length" name="second">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndextwo == index ?'selectActive':'','lefttitlecontent']" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item,index,2)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                        <span>
                                            <i @click="addPlan(item)" title="添加计划" class="addPlanIcon"></i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'模板 '+templateData.length" name="third">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">模板名称</label>
                                        <span class="lefttitlespan">使用次数</span>
                                    </li>
                                    <li class="lefttitlecontent" v-for="(item,index) in templateData" :key="index">
                                        <label class="lefttitlelab">{{item.planTemplateName}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.isCheck}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择跟踪计划单
                    </div>
                    <div v-if="!showDetail" class="scrolldiv">
                        <p class="pbodyrighttitle">【{{itemTitle}}】详情</p>
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">进度</label>
                            <span class="curData">当前日期 {{planInfo.currtDate}}</span>
                        </div>
                        <div v-if="showjindujihua">
                            <div class="jindujihua">
                                <label class="jindujihuatext">计划进度-{{currtPlanStep}}</label>
                                <button class="jiadubutton" v-if="planInfo.relaType == 1">链接任务</button>
                            </div>
                            <div class="jihuabody">
                                <ul class="jihuabodyul">
                                    <li :class="[planInfo.isStart == 0?'li1two':'li1one']">
                                        <p class="ptitle">启动</p>
                                        <span class="spantitle">{{planInfo.planStartDate}}</span>
                                    </li>
                                    <li class="limiddle">
                                        <div v-if="planInfo.isStart ==1&&planInfo.day1 !== ''&&planInfo.day1 !== undefined">
                                            <p class="limiddletext">{{planInfo.day1}}</p>
                                            <i class="limiddelimg1"></i>
                                            <i class="limiddelimg2"></i>
                                        </div>
                                    </li>
                                    <li :class="'div-ul-li-'+planStatus[1]">
                                        <p class="ptitle">订货下单</p>
                                        <span v-if="planInfo.planOrderStartDate" class="spantitle">开始 {{planInfo.planOrderStartDate}}</span>
                                        <span v-if="planInfo.planOrderEndDate" class="spantitle">完成 {{planInfo.planOrderEndDate}}</span>
                                    </li>
                                    <li class="limiddle">
                                        <div v-if="planInfo.isStart ==1&&planInfo.day2 !== ''&&planInfo.day2 !== undefined">
                                            <p class="limiddletext">{{planInfo.day2}}</p>
                                            <i class="limiddelimg1"></i>
                                            <i class="limiddelimg2"></i>
                                        </div>
                                    </li>
                                    <li :class="'div-ul-li-'+planStatus[2]">
                                        <p class="ptitle">厂家发货</p>
                                        <span v-if="planInfo.planSendStartDate" class="spantitle">开始 {{planInfo.planSendStartDate}}</span>
                                        <span v-if="planInfo.planSendEndDate" class="spantitle">完成 {{planInfo.planSendEndDate}}</span>
                                    </li>
                                    <li class="limiddle">
                                        <div v-if="planInfo.isStart ==1&&planInfo.day3 !== ''&&planInfo.day3 !== undefined">
                                            <p class="limiddletext">{{planInfo.day3}}</p>
                                            <i class="limiddelimg1"></i>
                                            <i class="limiddelimg2"></i>
                                        </div>
                                    </li>
                                    <li :class="'div-ul-li-'+planStatus[3]">
                                        <p class="ptitle">抽样检查</p>
                                        <span v-if="planInfo.planCheckStartDate" class="spantitle">开始 {{planInfo.planCheckStartDate}}</span>
                                        <span v-if="planInfo.planCheckEndDate" class="spantitle">完成 {{planInfo.planCheckEndDate}}</span>
                                    </li>
                                    <li class="limiddle">
                                        <div v-if="planInfo.isStart ==1&&planInfo.day4 !== ''&&planInfo.day4 !== undefined">
                                            <p class="limiddletext">{{planInfo.day4}}</p>
                                            <i class="limiddelimg1"></i>
                                            <i class="limiddelimg2"></i>
                                        </div>
                                    </li>
                                    <li :class="'div-ul-li-'+planStatus[4]">
                                        <p class="ptitle">到场签收</p>
                                        <span v-if="planInfo.planReceiptStartDate" class="spantitle">开始 {{planInfo.planReceiptStartDate}}</span>
                                        <span v-if="planInfo.planReceiptEndDate" class="spantitle">完成 {{planInfo.planReceiptEndDate}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="jindujihua">
                            <label class="jindujihuatext">实际进度-{{currtRealStep}}</label>
                            <span class="jiadutext">{{planInfo.result}}</span>
                        </div>
                        <div class="jihuabody">
                            <ul class="jihuabodyul">
                                <li class="li1one" style="visibility:hidden">
                                    <p class="ptitle">启动</p>
                                    <span class="spantitle">{{planInfo.orderCreateDate}}</span>
                                </li>
                                <li :class="'div-ul-li-'+realPlanStatus[1]" style="margin-left:30px">
                                    <p class="ptitle">订货下单</p>
                                    <span class="spantitle">{{planInfo.orderDate?planInfo.orderDate:'未开始'}}</span>
                                </li>
                                <li class="limiddle">
                                    <div v-show="planInfo.realDay1!=undefined && planInfo.realDay1!=''">
                                        <p class="limiddletext">{{planInfo.realDay1}}</p>
                                        <i class="limiddelimg1"></i>
                                        <i class="limiddelimg2"></i>
                                    </div>
                                </li>
                                <li  :class="'div-ul-li-'+realPlanStatus[2]">
                                    <p class="ptitle">厂家发货</p>
                                    <div v-if="planInfo.sendDateEnd == '' && planInfo.sendDateStart == ''">
                                        <span class="spantitle">未开始</span>
                                    </div>
                                    <div v-else>
                                        <span class="spantitle">开始 {{planInfo.sendDateStart}}</span>
                                        <span v-if="planInfo.sendDateEnd!=''" class="spantitle">完成 {{planInfo.sendDateEnd}}</span>
                                    </div>
                                </li>
                                <li class="limiddle">
                                    <div v-show="planInfo.realDay2!=undefined && planInfo.realDay2!=''">
                                        <p class="limiddletext">{{planInfo.realDay2}}</p>
                                        <i class="limiddelimg1"></i>
                                        <i class="limiddelimg2"></i>
                                    </div>
                                </li>
                                <li :class="'div-ul-li-'+realPlanStatus[3]">
                                    <p class="ptitle">抽样检查</p>
                                    <div v-if="planInfo.checkDateEnd == '' && planInfo.checkDateStart == ''">
                                        <span class="spantitle">未开始</span>
                                    </div>
                                    <div v-else>
                                        <span class="spantitle">开始 {{planInfo.checkDateStart}}</span>
                                        <span v-if="planInfo.checkDateEnd!=''" class="spantitle">完成 {{planInfo.checkDateEnd}}</span>
                                    </div>
                                </li>
                                <li class="limiddle">
                                    <div  v-show="planInfo.realDay3!=undefined && planInfo.realDay3!=''">
                                        <p class="limiddletext">{{planInfo.realDay3}}</p>
                                        <i class="limiddelimg1"></i>
                                        <i class="limiddelimg2"></i>
                                    </div>
                                </li>
                                <li :class="'div-ul-li-'+realPlanStatus[4]">
                                    <p class="ptitle">到场签收</p>
                                    <div v-if="planInfo.receiptDateEnd == '' && planInfo.receiptDateStart == ''">
                                        <span class="spantitle">未开始</span>
                                    </div>
                                    <div v-else>
                                        <span class="spantitle">开始 {{planInfo.receiptDateStart}}</span>
                                        <span v-if="planInfo.receiptDateEnd!=''" class="spantitle">完成 {{planInfo.receiptDateEnd}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="biaoqian">
                            <ul class="biaoqianul">
                                <li class="icon1 icon"></li>
                                <li class="icontext">未开始</li>
                                <li class="icon2 icon"></li>
                                <li class="icontext">进行中</li>
                                <li class="icon3 icon"></li>
                                <li class="icontext">已完成</li>
                            </ul>
                        </div>
                        <div class="jindu">
                            <i class="shebeiimg"></i>
                            <label class="titletext">设备主清单</label>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>明细/构件数量</th>
                                        <th>当前环节</th>
                                        <th>业务状态</th>
                                        <th>操作人</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.currentStep"></td>
                                        <td v-text="item.status"></td>
                                        <td v-text="item.userName"></td>
                                        <td>
                                            <span class="editIcon" @click="viewDeatil(index)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="套用模板" :visible.sync="addplantShow" :before-close="addPlanClose">
                <div class="editBody">
                    <div class="editBodytwo editBodyone edit-item clearfix"><label class="editInpText">进度模板 :</label>
                        <select class="editSelect" v-model="planModel" >
                            <option v-for="(item,index) in templateData" :key="index" :value="item.id">{{item.planTemplateName}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>订货单 :</label>
                        <input class="inp" disabled v-model="dinghuo"/>
                    </div>
                    <div style="text-align:left;margin-left:168px;">
                        <el-checkbox  v-model="start">同时启动</el-checkbox>
                    </div>
                    
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPlanSure">新建</button>
                    <button class="editBtnC" @click="addPlanClose">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name:'Wuliao',
    data(){
        return{
            activeName:'first',
            BDMSUrl:'',
            token:'',
            projId:'',
            userGroup:[],
            selectUser:'',
            planData:[],
            noPlanData:[],
            templateData:[],
            itemTitle:'',
            showDetail:true,
            orderDeatilData:[],
            planInfo:{},//计划详情
            selectIndexone:'-1',
            selectIndextwo:'-1',
            selectIndexthree:'-1',
            currtRealStep:'',
            currtPlanStep:'',
            showjindujihua:true,
            planStatus:['show','show','show','show','show'],
            realPlanStatus:['show','show','show','show','show'],
            addplantShow:false,
            planModel:'',
            dinghuo:'',
            start:false,
            addPlanObj:{},


        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.getUserGroup();
        this.planTemplateIndex();
    },
    methods:{
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
            this.selectIndexthree = '-1';
        },
        changeGroup(){
            this.getPlanList(this.selectUser);
            this.getNoPlanList(this.selectUser);
            this.planTemplateIndex();
        },
        //获取群组
        getUserGroup(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getUserGroup',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.userGroup = response.data.rt.ugList;
                        this.selectUser = response.data.rt.selectUgId;
                        this.getPlanList(this.selectUser);
                        this.getNoPlanList(this.selectUser);
                    } 
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //有计划列表
        getPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/plan/getPlanList',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows != null){
                            this.planData = response.data.rt.rows;
                        }else{
                            this.planData = [];
                        }
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //无计划列表
        getNoPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/plan/getNoPlanList',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows !=null){
                            this.noPlanData = response.data.rt.rows;
                        }else{
                            this.noPlanData = [];
                        }
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //模板管理
        planTemplateIndex(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/planTemplate/planTemplateIndex',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.templateData = response.data.rt;
                        this.planModel = this.templateData[0].id;
                    }else{
                        this.templateData =[];
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        selectItem(item,index,flag){
            // console.log(item);
            this.showDetail = false;
            if(flag == 1){
                this.selectIndexone = index;
                this.showjindujihua = true;
                this.getOrderDetail(item.id,item.orderId,item.plantemplateId);
                this.getPlanInfo(item.id);
                this.itemTitle = item.planName;
            }else if(flag == 2){
                this.selectIndextwo = index;
                this.showjindujihua = false;
                this.getNoOrderDetail(item.id);
                this.getOrderInfo(item.id);
                this.itemTitle = item.orderTitle;
            }else if(flag == 3){
                this.selectIndexthree = index;
            }
        },
        //获取无计划设备著清单
        getNoOrderDetail(id){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderDetail/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
                            this.orderDeatilData = response.data.rt.rows;
                        }else{
                            this.orderDeatilData = [];
                        }
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取无计划进度
        getOrderInfo(id){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/plan/getOrderInfo',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderId:id
                }
            }).then(response=>{
                if (response.data.cd == 0) {
                    this.planInfo = response.data.rt;
                    this.getCurrentStep(this.planInfo.currtRealStep); //实际进度
                    for (let i = 1; i < 5; i++) {
                        if (this.planInfo.checkAndReceipt == 1) {
                            this.realPlanStatus[1] = 'show-end';
                            this.realPlanStatus[2] = 'show-end';
                            this.realPlanStatus[3] = 'show-select';
                            this.realPlanStatus[4] = 'show-select';
                        } else {
                            if (i < this.planInfo.currtRealStep) {
                                this.realPlanStatus[i] = 'show-end';
                            } else if (i == this.planInfo.currtRealStep) {
                                this.realPlanStatus[i] = 'show-select';
                            }
                        }
                    }
                    if (this.planInfo.orderDate == '') {
                        this.realPlanStatus[1] = 'show';
                    }
                    if (this.planInfo.sendDateStart == '' && this.planInfo.sendDateEnd == '') {
                        this.realPlanStatus[2] = 'show';
                    }
                    if (this.planInfo.checkDateStart == '' && this.planInfo.checkDateEnd == '') {
                        this.realPlanStatus[3] = 'show';
                    }
                    if (this.planInfo.receiptDateStart == '' && this.planInfo.receiptDateEnd == '') {
                        this.realPlanStatus[4] = 'show';
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取清单详情
        getOrderDetail(id,orderId,templateId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/plan/getOrderDetail/'+id+'/'+orderId+'/'+templateId,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderDeatilData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        getState(sta){
            if(sta.substr(1,1) == '1'){
                return '已计划('+sta+')';
            }else if(sta.substr(1,2) == '2'){
                return '已开工('+sta+')';
            }else if(sta.substr(1,2) == '2'){
                return '已完工('+sta+')';
            }
        },
        //获取计划详情
        getPlanInfo(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/plan/getPlanInfo',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    id:id
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.planInfo = response.data.rt;
                        this.getCurrentStep(this.planInfo.currtRealStep);//实际进度
                        this.getCurrtPlanStep(this.planInfo.isStart,this.planInfo.currtPlanStep,this.planInfo.currtPlanStepEnd);//计划进度
                        // 0 启动 1 订货下单 2 厂家发货 3 到场检查 4 到场签收
                        for(let i = 1;i<5;i++){
                            if(this.planInfo.checkAndReceipt == 1){
                                this.realPlanStatus[1] = 'show-end';
                                this.realPlanStatus[2] = 'show-end';
                                this.realPlanStatus[3] = 'show-select';
                                this.realPlanStatus[4] = 'show-select';
                            }else{
                                if(i<this.planInfo.currtRealStep){
                                    this.realPlanStatus[i] = 'show-end';
                                }else if(i == this.planInfo.currtRealStep){
                                    this.realPlanStatus[i] = 'show-select';
                                }
                            }

                            if(i<= this.planInfo.currtPlanStepEnd){
                                this.planStatus[i] = 'show-end';
                            }else{
                                this.planStatus[i] = 'show';
                            }
                            if(i == this.planInfo.currtPlanStep){
                                this.planStatus[i] = 'show-select';
                            }
                        }
                        if(this.planInfo.orderDate == ''){
                            this.realPlanStatus[1] = 'show';
                        }
                        if(this.planInfo.sendDateStart=='' && this.planInfo.sendDateEnd == ''){
                            this.realPlanStatus[2] = 'show';
                        }
                        if(this.planInfo.checkDateStart=='' && this.planInfo.checkDateEnd == ''){
                            this.realPlanStatus[3] = 'show';
                        }
                        if(this.planInfo.receiptDateStart=='' && this.planInfo.receiptDateEnd == ''){
                            this.realPlanStatus[4] = 'show';
                        }
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //获取实际进度
        getCurrentStep(step){
            if(step == '1'){
                this.currtRealStep = '实际环节：订货下单';
            }else if(step == '2'){
                this.currtRealStep = '实际环节：厂家发货';
            }else if(step == '3'){
                this.currtRealStep = '实际环节：到场检查';
            }else if(step == '4'){
                this.currtRealStep = '实际环节：到场签收';
            }else if(step == '5'){
                this.currtRealStep = '实际环节：所有环节已经完成';
            }
        },
        //获取计划进度
        getCurrtPlanStep(isStart,currtStep,currtPlanEnd){
            if(isStart == 1){
                if(currtStep == 0){
                    if(currtPlanEnd == 0){
                        this.currtPlanStep = '计划环节：计划启动';
                    }else if(currtPlanEnd == 1){
                        this.currtPlanStep = '计划环节：订货下单已完成';
                    }else if(currtPlanEnd == 2){
                        this.currtPlanStep = '计划环节：厂家发货已完成';
                    }else if(currtPlanEnd == 3){
                        this.currtPlanStep = '计划环节：到场检查已完成';
                    }else if(currtPlanEnd == 4){
                        this.currtPlanStep = '计划环节：到场签收已完成';
                    }else if(currtPlanEnd == 5){
                        this.currtPlanStep = '计划环节：所有环节已完成';
                    }
                }else{
                    // 时间在其中的一个环节中
					if(currtStep==1){
                        this.currtPlanStep = '计划环节：订货下单';
					}else if(currtStep==2){
                        this.currtPlanStep = '计划环节：厂家发货';
					}else if(currtStep==3){
                        this.currtPlanStep = '计划环节：到场检查';
					}else if(currtStep==4){
                        this.currtPlanStep = '计划环节：到场签收';
					}else if(currtStep==5){
                        this.currtPlanStep = '计划环节：所有环节已完成';
					}
                }
            }else{
                this.currtPlanStep = '计划环节：计划未启动';
            }
        },
        //删除已计划
        deletePlan(item){
            this.$confirm('将订货单所套用进度模板删除后，订货单将恢复为“无计划”状态，是否删除？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    method:'get',
                    url:this.BDMSUrl+'project2/plan/removePlan',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        planId:item.id
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getPlanList(this.selectUser);
                        this.getNoPlanList(this.selectUser);
                    }else{
                        alert(response.data.msg);
                    }
                })
            })
        },
        //添加计划
        addPlan(item){
            this.addplantShow = true;
            this.addPlanObj = item;
            this.dinghuo = item.orderCode +' '+ item.orderTitle;
        },
        addPlanSure(){
            let isStart;
            if(this.start){
                isStart = 1;
            }else{
               isStart = 0; 
            }
            
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/plan/addPlan',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    isStart:isStart,
                    orderId:this.addPlanObj.id,
                    plantemplateId:this.planModel
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getPlanList(this.selectUser);
                    this.getNoPlanList(this.selectUser);
                    this.addplantShow = false;
                }else{
                    alert(responsed.data.msg)
                }
            })
        },
        addPlanClose(){
            this.addplantShow = false;
        },
        //查看详情
        viewDeatil(item){

        }
    }
}
</script>
<style lang="less">
#wuliao{
    ::-webkit-scrollbar{width:0px}
    .topHeader{
        box-sizing: border-box;
        float: left;
        width: 100%;
        overflow: auto;
        max-height: 800px;
        
        .purchaseNav{
            height: 49px;
            padding-top: 16px;
            padding-left: 20px;
            background: #fafbfc;
            box-sizing: border-box;
            border-bottom: 1px solid #e6e6e6;
        }
        .elselect{
            overflow: hidden;
            margin-top:10px;
            margin-right: 50px;
            height: 40px;
            line-height: 40px;
            .el-select{
                float: right;
                margin-left: 10px;
            }
            .elselecttitle{
                float: right;
            }
        }
        .navItem{
            height: 34px;
            width: 106px;
            float: left;
            line-height: 30px;
            font-size: 14px;
            text-decoration: none;
            color: #999;
        }
        .navactive{
            background: #fff;
            color: #fc3439;
            font-weight: bold;
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            border-top: 3px solid #fc3439;
            box-sizing: border-box;
        }
        .pbody{
            border: 1px solid #e6e6e6;
            margin: 10px 10px 10px 20px;
            display: flex;
            min-height: calc(100vh - 165px);
            .el-tabs__header{
                height: 40px;  
            }
            .el-tabs__nav{
                height: 40px;
                line-height: 40px;
            }
        }
        .pbodyleft{
            width: 405px;
            height: 100%;
            border-right: 1px solid #e6e6e6;
            .el-tabs__content{
                margin-top: 10px;
                border-top: 1px solid #e6e6e6;
            }
            .leftcontent{
                .leftcontentul{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                }
                .lefttitle{
                    background: #f2f2f2;
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                }
                .lefttitlecontent{
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                    border-bottom: 1px solid #e6e6e6;
                    cursor: pointer;
                }
                .selectActive{
                    color: #333;
                    font-weight:bold;
                }
                .lefttitlelab{
                    display: inline-block;
                    margin-left: 20px;
                }
                .lefttitlespan{
                    display: inline-block;
                    margin-left: 87px;
                }
                .lefttitlecontent:hover .deleteIcon{
                    visibility: visible;
                }
                .deleteIcon{
                    visibility: hidden;
                    height: 16px;
                    width: 16px;
                    background: url('./images/delete1.png');
                    float: right;
                    margin-right: 10px;
                    margin-top: 10px;
                }
                .lefttitlecontent:hover .addPlanIcon{
                    visibility: visible;
                }
                .addPlanIcon{
                    visibility: hidden;
                    height: 16px;
                    width: 16px;
                    background: url('./images/1-2.png');
                    float: right;
                    margin-right: 10px;
                    margin-top: 10px;
                }
                .lefttitlespanone{
                    margin-left: 40px;
                }
            }
        }
        .pbodyright{
            flex: 1;
            overflow-y:scroll;
            .pbodyrighttitle{
                height: 39px;
                margin: 0;
                padding: 0;
                border-bottom: 1px solid #e6e6e6;
                text-align: left;
                line-height: 39px;
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
            .jihuabody{
                .jihuabodyul{
                    list-style: none;
                    padding: 0;
                    overflow: hidden;
                    li{
                        float: left;
                        display: block;
                    }
                    .limiddle{
                        height: 84px;
                        line-height: 80px;
                        width: 30px;
                        text-align: center;
                        // padding: 0 3px;
                        .limiddletext{
                            color: #666;
                            font-size: 10px;
                            margin: 0;
                            height: 84px;
                        }
                        .limiddelimg1{
                            background: url('./images/icon1.png');
                            display:block;
                            width:25px;
                            height: 1px; 
                            position: relative;
                            top: -33px;
                        }
                        .limiddelimg2{
                            background: url('./images/icon2.png');
                            display:block;
                            width:5px;
                            height:9px; 
                            position: relative;
                            top: -38px;
                            left: 26px;
                        }
                    }
                    //未开始
                    .div-ul-li-show{
                        width: 116px;
                        height: 84px;
                        border: 1.5px solid #e6e6e6;
                    }
                    //进行中
                    .div-ul-li-show-select{
                        width: 116px;
                        height: 84px;
                        border: 1.5px solid #33bb44;
                    }
                    //完成
                    .div-ul-li-show-end{
                        width: 116px;
                        height: 84px;
                        border: 1.5px solid #fc3439;
                    }
                    .li1one{
                        width: 88px;
                        height: 84px;
                        margin-left: 30px;
                        border: 1.5px solid #fc3439;
                    }
                    .li1two{
                        width: 88px;
                        height: 84px;
                        margin-left: 30px;
                        border: 1.5px solid #e6e6e6;
                    }
                    .li2{
                        border: 1.5px solid #fc3439;
                    }
                    .li2,.li3,.li4,.li5{
                        width: 116px;
                        height: 84px;
                    }
                    .li3{
                        border:1.5px solid #33bb44;
                    }
                    .li4,.li5{
                        border:1px solid #e6e6e6;
                    }
                    .ptitle{
                        color: #333;
                        font-size: 14px;
                        margin: 0;
                        line-height: 14px;
                        margin: 17px 0 0 10px;
                        width: 100%;
                        text-align: left;
                    }
                    .spantitle{
                        font-size: 12px;
                        color: #666;
                        margin: 10px 0 0 10px;
                        line-height: 12px;
                        height: 12px;
                        width: 100%;
                        text-align: left;
                        display: block;
                    }
                }
            }
            .biaoqian{
                display: block;
                margin: 20px 20px 0px 30px;
                overflow: hidden;
                .biaoqianul{
                    list-style: none;
                    text-align: right;
                    overflow: hidden;
                    float: right;
                    text-align: right;
                    li{
                        float:left;
                    }
                    .icon{
                        display: inline-block;
                        width: 15px;
                        height: 10px;
                    
                    }
                    .icon1{
                        border: 1px solid #e6e6e6;
                        position: relative;
                        top: 2px;
                        margin-right: 5px;
                    }
                    .icon2{
                        border: 1px solid #33bb44;
                        margin-left:20px;
                        position: relative;
                        margin-right: 5px;
                        top: 2px;
                    }
                    .icon3{
                        border: 1px solid #fc3439;
                        margin-left:20px;
                        position: relative;
                        margin-right: 5px;
                        top: 2px;
                    }
                    .icontext{
                        font-size: 12px;
                        color: #666;
                    }
                }
            }
            .jindu{
                border-bottom: 1px solid #e6e6e6;
                margin: 0 30px 0 20px;
                text-align: left;
                height: 44px;
                line-height: 44px;
            }
            .titleimg{
            width: 15px;
            height:16px;
            display: inline-block;
            margin-right: 10px;
            background: url('./images/jindu.png') ;
            position: relative;
            top: 2px;
            }
            .shebeiimg{
                width: 14px;
                height:16px;
                display: inline-block;
                margin-right: 10px;
                background: url('./images/shebei.png') ;
                position: relative;
                top: 2px;
            }
            .titletext{
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
            .curData{
                font-size: 12px;
                color: #666;
                float: right;
            }
            .jindujihua{
                border-bottom: 1px solid #e6e6e6;
                margin: 0 30px 15px 35px;
                text-align: left;
                height: 44px;
                line-height: 44px;
                .jindujihuatext{
                    color: #666;
                    font-size: 14px;
                    font-weight: bold;
                }
                .jiadubutton{
                    background: #f6f6f6;
                    border: none;
                    width: 68px;
                    float: right;
                    height: 26px;
                    position: relative;
                    top: 9px;
                    cursor: pointer;
                    font-size: 12px;
                    color: #666;
                }
                .jiadutext{
                    float: right;
                    font-size: 12px;
                    color: #666;
                }
            }
        }
        .borderbottom{
            margin: 10px 30px 30px 20px;
        }
        .editIcon{
            float: left;
            width: 17px;
            height: 16px;
            background: url('./images/viewdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .UserList{
            border-collapse: collapse;
            border: 1px solid #e6e6e6;
            thead {
                background: #f2f2f2;
                th {
                padding-left: 10px;
                height: 36px;
                text-align: left;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                font-size: 12px;
                color: #333333;
                }
            }
            tbody {
                tr {
                td {
                    padding-left: 10px;
                    height: 36px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                }
                &:hover {
                    background: #fafafa;
                }
                }
            }
        }
    }
    .editSelect{
        width: 447px;
        height:38px;
        padding-left: 10px;
    }
    .editBodyone{
        position: relative;
        .icon-sanjiao{
            display: block;
            position: absolute;
            width: 12px;
            height: 7px;
            // background-image:url('./images/sanjiao.png');
            background-size: 100% 100%;
            content: '';
            top: 18px;
            left: 590px;
        }
    }
}
</style>

