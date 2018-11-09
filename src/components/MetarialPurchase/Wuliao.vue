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
            <div class="elselect" v-if="!showCommonList" >
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
            <div class="pbody" v-if="!showCommonList">
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
                                <ul class="leftcontentul leftcontentul-template">
                                    <li class="lefttitle-template">
                                        <div class="lefttitlelab-template"><label>模板名称</label></div>
                                        <!-- <div class="lefttitlespan-template"><span>使用次数</span></div> -->
                                    </li>
                                    <li :class="[selectIndexthree == index ?'selectActive':'','lefttitlecontent']" class="lefttitlecontent-template" v-for="(item,index) in templateData" :key="index" @click="selectItem(item,index,3)">                   <div class="lefttitlelab-template"><label>{{item.planTemplateName}}</label></div>                  <div class="lefttitlespan-template">
                                            <!-- <span class="lt">{{item.isCheck}}</span> -->
                                            <span class="rt">
                                                <i @click="deletePlanTemplate(item.id)" title="删除模板" class="deleteIcon"></i>
                                            </span>
                                        </div>                                     
                                    </li> 
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择跟踪计划单
                        <div class="newTemplate" :class=" isClick === 3 ?'isChange':''" @click="toggleNewTemp">
                            <span>新建模板</span>
                        </div>
                    </div>
                    
                    <div v-if="!showDetail" class="scrolldiv">
                        <div class="pbodyrighttitle">
                            <div class="title-lt title">
                                <span>
                                    【{{planTemplateName}}】详情
                                </span>
                            </div>
                            <div class="title-rt" :style="isNew === 0? 'width:270px':'width:180px'" v-if="showButton">
                                <div :class="[ isClick === 1 ?'isChange':'']"  @click="toggleSave(  )">
                                    <span>保存</span>
                                </div>
                                <div :class="[ isClick === 2 ?'isChange':'',isNew === 0 ? '' : 'content-hidden']" @click="toggleSaveAs( 1 )">
                                    <span>另存为</span>
                                </div>                               
                                <div :class=" isClick === 3 ?'isChange':''" @click="toggleNewTemp(  )">
                                    <span>新建模板</span>
                                </div>
                                
                            </div>
                        </div>
                            
                        <div v-if="isTemplate" class="pbodyrighttitle-plan">
                            <div class="jindu">
                                <i class="titleimg"></i>
                                <label class="titletext">进度</label>
                                <span class="curData">当前日期 {{planInfo.currtDate}}</span>
                            </div>
                            <div v-if="showjindujihua">
                                <div class="jindujihua">
                                    <label class="jindujihuatext">计划进度-{{currtPlanStep}}</label>
                                    <!-- <button class="jiadubutton" v-if="planInfo.relaType == 1">链接任务</button> -->
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
                                <span :class="planInfo.isStart == 0 ? '' : 'content-hidden'" class="startPlan" @click="StartPlan(planInfo.id)">启动计划</span>
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
                                                <span class="editIcon" @click="showDetialList(item,index)"></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div v-else class="pbodyrighttitle-temp"> 
                            <div class="temp-content">
                                <div class="content-form">
                                    <el-form ref="form" :model="form" label-width="70px">
                                        <el-form-item label="模板名称">
                                            <el-input v-model="planTemplateName"></el-input>
                                        </el-form-item>

                                        <el-form-item label="启动环节">
                                            <el-checkbox-group v-model="checkvalue" @change="handleCheckedCitiesChange">
                                                <el-checkbox  v-for="(item,index) of checkLists_flow" :label="item.flow" :key="index" :class="[index == 0 ? 'content-hidden' : '',index == 1 ? 'clear-left' :'']" @change="handleCheckd(item.ischeck,index)"></el-checkbox>                                            
                                            </el-checkbox-group>
                                        </el-form-item>

                                        <el-form-item class="jihuabody-temp">
                                            <ul class="jihuabodyul-temp">
                                                <li v-for="(item,index) of checkLists_flow" :key="index" :style=" item.ischeck == 0 ? 'display:none': ''" >
                                                    <div class="limiddle-temp" :class=" 0 == index ? 'content-hidden' : ''">
                                                        <p class="limiddletext">{{item.flowList.startPlan}}天</p>
                                                        <i class="limiddelimg1"></i>
                                                        <i class="limiddelimg2"></i>
                                                    </div>
                                                    <div class="border-temp" :class="[item.isClick == 1?'divtwo':'divone']" @click="toggleColor(index)">
                                                        <p class="ptitle-temp">{{item.flow}}</p>
                                                        <p :class=" 0 == index ? 'content-hidden' : ''">({{item.flowList.endPlan}}天)</p>
                                                    </div>                                                   
                                                </li>   
                                            </ul>
                                        </el-form-item>

                                        <div  v-for="(item,index) in checkLists_flow" :key="index">
                                            <div v-if="index == 0"></div>
                                            <div v-else>
                                                <StartCom v-if="selectValueList.length && startPlanList.length && endPlanList.length" :startPlan="startPlanList[index-1]" :endPlan="endPlanList[index-1]" :selectValueIndex="selectValueList[index-1]" :endSelectValueIndex="endSelectValueIndexList[index-1]" :index="index" :style=" item.isClick == 0?'display:none':'' " @getStartPlan="getStartPlan" @getEndPlan="getEndPlan"/>
                                            </div>
                                        </div>
                                    </el-form>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id" rType="5" :bId='checkItem.id' :isGongChengLiang="false" :title="'物料跟踪'"  v-if="showCommonList"></common-list>
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
import { start_options,end_options,checkLists_flow,end_options1 } from "./constants"
import StartCom from './components/start.vue'
import commonList from  './../planCost/qingDan.vue'

// const checkList=['订货下单','厂家发货','抽样检查','到场签收'];
export default {
    name:'Wuliao',
    components :{
        StartCom,   
    },
    data(){
        return{
            isIndeterminate: true,
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
            isTemplate: true,
            isClick: 0,
            showButton: true,
            isSave: false,
            isSaveName: '',
            form: {},
            planTemplateName:'',
            checkvalue:[],
            checkLists_flow:this.copyflowlist(),
            start_options: start_options,
            selectValueList:[],
            endSelectValueIndexList:[],
            startPlanList:[],
            endPlanList:[],
            startConditionList:[],
            isCheckList:[],
            isClickList:[],
            flowList:[],
            end_options,
            end_options1,
            isNew: 0,
            planTemplateId: '',
            showCommonList:false,
            checkItem:{},
            planId:'',
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
            this.showDetail = true;
            console.log("切换");
        },
        //启动计划
        StartPlan(){
            console.log("启动计划");
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/plan/startPlan',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    id:this.planId, 
                }
            }).then( res =>{
                if(res.data.cd == 0){
                    this.$message({
                        message: '启动计划成功!',
                        type: 'success'
                    });
                    this.getPlanInfo(this.planId);
                }else {
                    this.$message({
                        message: '启动计划失败!',
                        type: 'warring'
                    });
                }
            }).catch( err =>{
                alert(err);
            });
        },
        backToH(){
            this.showCommonList = false;
        },
        showDetialList(val,i){
            console.log(val);
            this.showCommonList = true;
            this.checkItem = val;
        },
        copyflowlist(){
            let arr = [];
            checkLists_flow.map( (item)=>{
                const data = Object.assign({},item);
                arr.push(data);
            })
            return arr;
        },
        mustSelect() {
            this.$alert('订货下单环节为必选环节！', '', {
            confirmButtonText: '确定',
            });
        },
        // handleClick1(){
        //     this.selectIndexone = '-1';
        //     this.selectIndextwo = '-1';
        //     this.selectIndexthree = '-1';
        // },
        changeGroup(){
            this.getPlanList(this.selectUser);
            this.getNoPlanList(this.selectUser);
            // this.planTemplateIndex();
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
                            console.log("有计划列表",this.planData)
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
                        console.log("模板管理",this.templateData);
                    }else{
                        this.templateData =[];
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        selectItem(item,index,flag){
            this.showDetail = false;
            if(flag == 1){
                this.selectIndexone = index;
                this.showjindujihua = true;
                this.getOrderDetail(item.id,item.orderId,item.plantemplateId);
                this.getPlanInfo(item.id);
                this.itemTitle = item.planName;
                
                this.isTemplate= true;
                this.showButton= false;
                this.planId = item.id;
                console.log("有计划id",this.planId);
            }else if(flag == 2){
                this.selectIndextwo = index;
                this.showjindujihua = false;
                this.getNoOrderDetail(item.id);
                this.getOrderInfo(item.id);
                this.itemTitle = item.orderTitle;
                // this.planTemplateName = item.orderTitle;
                this.isTemplate= true;
                this.showButton= false;
            }else if(flag == 3){
                this.selectIndexthree = index;
                this.isTemplate= false;
                this.showButton= true;
                if(item == null){
                    console.log("item为空");
                }else {
                    this.getTempDetail(item.id);
                }  
            }
        },
        //新建模板
        toggleNewTemp(){
            this.selectItem(null,-1,3);
            this.isNew = 1;
            this.isClick = 3;
            this.planTemplateName = '新模板' ;
            this.startPlanList = [];
            this.endPlanList = [];
            this.selectValueList = [];
            this.endSelectValueIndexList = [];
            this.checkvalue = [];
            this.checkLists_flow = this.copyflowlist();
            this.checkLists_flow.map( ( item,index ) => {
                item.ischeck = 1;
                item.isClick = 0;
                if ( index > 0 ) {
                    item.flowList.startPlan = 0 ;
                    item.flowList.endPlan = 0 ;                    
                    this.startPlanList.push(item.flowList.startPlan);
                    this.endPlanList.push(item.flowList.endPlan);
                    this.selectValueList.push(item.flowList.startCondition);
                    this.endSelectValueIndexList.push(item.flowList.endCondition);
                    this.checkvalue.push(item.flow);
                }
                if( index === 1 ) {
                    item.isClick = 1;
                }
            });
            this.selectValueList = [].concat(this.selectValueList);
            this.endSelectValueIndexList = [].concat(this.endSelectValueIndexList);
            
        },
        //保存 计划模板
        savePlanTemplate( type ){
            let planTemplateId = this.planTemplateId;
            let projId = this.projId;
            let planTemplateName = this.planTemplateName;
            let form = {
                template:{},
                order:{},
                sendPro:{},
                check:{},
                receipt:{}
            };
            if( planTemplateName == null || planTemplateName == '' ){
                this.isNull();
                return;
            }                        
            form.template = {
                planTemplateName: planTemplateName,
                projId: projId,
                id:null,
            }
            if( type === 0 ){
                form.template.id = planTemplateId;
            }else {
                form.template.id = null;
            }
            this.checkLists_flow.map( (item,index)=>{
                if( index >0 ) {
                    if( index === 1 ){
                        form.template.isOrder = item.ischeck;
                        form.order.endCondition = item.flowList.endCondition;
                        form.order.endPlan = item.flowList.endPlan;
                        if( type === 0 ){
                            form.order.id = item.flowList.id;
                        }else {
                            form.order.id = null;
                        }                        
                        form.order.startCondition = item.flowList.startCondition;
                        form.order.startPlan = item.flowList.startPlan;
                        form.order.type = item.flowList.type;
                    }
                    if( index === 2 ){
                        form.template.isSend = item.ischeck;
                        form.sendPro.endCondition = item.flowList.endCondition;
                        form.sendPro.endPlan = item.flowList.endPlan;
                        if( type === 0 ){
                            form.sendPro.id = item.flowList.id;
                        }else {
                            form.sendPro.id = null;
                        }                        
                        form.sendPro.startCondition = item.flowList.startCondition;
                        form.sendPro.startPlan = item.flowList.startPlan;
                        form.sendPro.type = item.flowList.type;
                    }
                    if( index === 3 ){
                        form.template.isCheck = item.ischeck;
                        form.check.endCondition = item.flowList.endCondition;
                        form.check.endPlan = item.flowList.endPlan;
                        if( type === 0 ){
                            form.check.id = item.flowList.id;
                        }else {
                            form.check.id = null;
                        }                        
                        form.check.startCondition = item.flowList.startCondition;
                        form.check.startPlan = item.flowList.startPlan;
                        form.check.type = item.flowList.type;
                    }
                    if( index === 4 ){
                        form.template.isReceipt = item.ischeck;
                        form.receipt.endCondition = item.flowList.endCondition;
                        form.receipt.endPlan = item.flowList.endPlan;
                        if( type === 0 ){
                            form.receipt.id = item.flowList.id;
                        }else {
                            form.receipt.id = null;
                        }                        
                        form.receipt.startCondition = item.flowList.startCondition;
                        form.receipt.startPlan = item.flowList.startPlan;
                        form.receipt.type = item.flowList.type;
                    }
                }
            })
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/planTemplate/addPlanTemplate',
                headers:{
                    token:this.token
                },
                data:form
            }).then( res =>{                
                if( type === 0 ){                    
                    if( res.data.cd == 0 ){
                        this.$message({
                            message: '保存成功!',
                            type: 'success'
                        });
                        this.planTemplateIndex();
                        
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                        return;
                    }
                }else {
                    if( res.data.cd == 0 ){
                        this.$message({
                            type: 'success',
                            message: '新建模板成功!'
                        });
                        this.planTemplateIndex();
                        
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                        return;
                    }
                }
            }).catch( err =>{
                alert(err);
            });
            
        },
        //保存
        toggleSave(){
            this.isClick = 1;
            this.savePlanTemplate( this.isNew );
        },
        //另存
        toggleSaveAs( ){
            this.isClick = 2;
            this.savePlanTemplate( 1 );
        },
        getStartPlan(obj){
            const index = obj.index;
            const startPlanDay = obj.startPlanDay;
            this.checkLists_flow[index].flowList.startPlan = startPlanDay;
            
        },
        getEndPlan(obj){
            const index = obj.index;
            const endPlanDay = obj.endPlanDay;
            this.checkLists_flow[index].flowList.endPlan = endPlanDay;
        },
        handleCheckedCitiesChange(val){
            if(val.indexOf("订货下单") < 0){
                this.checkvalue = ["订货下单"].concat(val);
            }
        },
        //启动点击事件
        toggleColor(i) {
            if( i==0 ) {               
                return;
            }
            this.checkLists_flow.map( ( item,index ) => {
                item.isClick = 0;
                
            })
            this.checkLists_flow[i].isClick = 1;
        },
        //启动环节切换事件
        handleCheckd( ischeck,i ){            
            this.checkLists_flow[1].isClick = 1;
            if( ischeck === 1){
                if( i===1 ){                    
                    this.checkLists_flow[i].ischeck = 1;
                    this.mustSelect();
                    return;
                }else {
                    this.checkLists_flow[i].ischeck = 0;         
                    this.checkLists_flow[i].flowList.startPlan = 0;
                    this.checkLists_flow[i].flowList.endPlan = 0;
                }                                
            }else { 
                this.checkLists_flow[i].ischeck = 1;
            }
            this.startPlanList = [];
            this.endPlanList = [];
            this.checkLists_flow.map( (item,index) => {
                item.isClick = 0;
                this.isClickList = [];
                if( item.ischeck === 1 ){
                    this.isClickList.push(item);
                }
                if(index > 0) {
                    this.start_options[index-1].ischeck=item.ischeck;                   
                    this.startPlanList.push(item.flowList.startPlan);
                    this.endPlanList.push(item.flowList.endPlan);            
                }                                    
            })
            this.toggleColor(i == 1 ? 2 : 1);
        },
        //获取模版详细信息
        getTempDetail(id){
            this.isNew = 0;
            this.selectValueList = [];
            this.endSelectValueIndexList = [];
            this.startPlanList = [];
            this.endPlanList = [];
            this.endSelectValueIndexList = [];
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/planTemplate/getPlanTemplate/'+id,
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    id:id,
                    token:this.token,
                }
            }).then( res => {
                let obj= res.data;
                this.planTemplateName=obj.qjPlanTemplate.planTemplateName;
                this.planTemplateId = obj.qjPlanTemplate.id;
                
                for( let i=0; obj.qjPlanTemplateStep!=null && i<obj.qjPlanTemplateStep.length; i++ ){
                    if( obj.qjPlanTemplateStep[i].type == 1 ){// 定货
                        this.checkLists_flow[1].flowList = obj.qjPlanTemplateStep[i];
                    }else if( obj.qjPlanTemplateStep[i].type == 2 ){// 发货
                        this.checkLists_flow[2].flowList = obj.qjPlanTemplateStep[i];
                    }else if( obj.qjPlanTemplateStep[i].type == 3 ){// 到场检查
                        this.checkLists_flow[3].flowList = obj.qjPlanTemplateStep[i];
                    }else if( obj.qjPlanTemplateStep[i].type == 4 ){// 到场签收
                        this.checkLists_flow[4].flowList = obj.qjPlanTemplateStep[i];
                    }
                }

                this.checkLists_flow[1].ischeck = obj.qjPlanTemplate.isOrder;
                this.checkLists_flow[2].ischeck = obj.qjPlanTemplate.isSend;
                this.checkLists_flow[3].ischeck = obj.qjPlanTemplate.isCheck;
                this.checkLists_flow[4].ischeck = obj.qjPlanTemplate.isReceipt;

                this.checkvalue = [];
                this.isClickList = [];
                this.checkLists_flow.map((item,index)=>{
                    item.isClick= 0;                    
                    if(index == 1){
                        this.checkLists_flow[index].isClick = 1;
                    }                    
                    if(index > 0){                    
                                      
                        this.selectValueList.push(item.flowList.startCondition);
                        this.endSelectValueIndexList.push(item.flowList.endCondition);
                        this.startPlanList.push(item.flowList.startPlan);
                        this.endPlanList.push(item.flowList.endPlan);
                        this.start_options[index-1].ischeck=item.ischeck;
                        this.start_options[index-1].startCondition=item.flowList.startCondition;
                    }
                    if(item.ischeck == 1){
                        this.checkvalue.push(item.flow);
                        this.isClickList.push(item);
                    }
                    
                })
                this.selectValueList = [].concat(this.selectValueList);
                this.endSelectValueIndexList = [].concat(this.endSelectValueIndexList);
                this.startPlanList = [].concat(this.startPlanList);
                this.endPlanList = [].concat(this.endPlanList);
            })
        },
        //删除计划模板
        deletePlanTemplate(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                axios({
                    method:'get',
                    url:this.BDMSUrl+'project2/planTemplate/deletePlanTemplate',
                    headers:{
                        token:this.token,
                    },
                    params:{
                        projId:this.projId,
                        id:id
                    }
                }).then( res =>{
                    if(res.data.cd == 0){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.planTemplateIndex();
                        this.toggleNewTemp();
                    }else{
                        alert(res.data.msg);
                    }           
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //确定是否删除弹窗
        isDelete(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                axios({
                    method:'get',
                    url:this.BDMSUrl+'project2/planTemplate/deletePlanTemplate',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        planId:id
                    }
                }).then( res =>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })              
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //确定模板名是否为空
        isNull(){
            this.$alert('模板名称不能为空!', '提示', {
                confirmButtonText: '确定',
            });
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
                    this.planTemplateName = this.planInfo.orderTitle;
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
                        console.log("获取清单详情",this.orderDeatilData);
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
                        console.log("获取计划详情",this.planInfo);
                        this.planTemplateName = this.planInfo.orderTitle;
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
                .leftcontentul-template {
                    li {                       
                        height: 37px;
                        line-height: 37px;
                        display: flex;
                        justify-content: space-between;
                        .lefttitlelab-template {                            
                            text-align: left;
                            padding-left: 20px;
                        }
                        .lefttitlespan-template {
                            width: 155px;
                            text-align: left;
                            padding-left: 10px;
                        }
                    }
                    .lefttitle-template {
                        background: #f2f2f2;
                    }          
                    .lefttitlecontent-template {
                        border-bottom: 1px solid #e6e6e6;
                        cursor: pointer;                       
                        .lefttitlespan-template {
                            position: relative;
                            .rt {
                                position: absolute;
                                top:0;
                                right:0;
                            }
                        }
                    }
                    .deleteIcon{
                        visibility: hidden;
                        height: 16px;
                        width: 16px;
                        background: url('./images/delete1.png');
                    }
                    .lefttitlecontent-template:hover .deleteIcon{
                            visibility: visible;
                    }
                    
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
            .newTemplate {
                width: 80px;
                height: 25px;
                font-size: 14px;
                border:1px solid #fc3439;
                border-radius: 3px;
                text-align: center;
                line-height: 25px;
                cursor: pointer;               
                color: #fc3439;
                float: right;
                margin:20px 20px 0 0;
            }
            .content-hidden {
                display: none;               
            }
            .clear-left {
                margin-left: 0;
            }
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
                padding: 0 20px 0 15px;
                display: flex;
                justify-content: space-between;
                
                .title span {
                    display: inline-block;
                    text-align: left;                   
                }
                .title-rt {
                    width: 270px;
                    line-height: 39px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    div {
                        width: 80px;
                        height: 25px;
                        font-size: 14px;
                        border:1px solid #fc3439;
                        border-radius: 3px;
                        text-align: center;
                        line-height: 25px;
                        cursor: pointer;
                    }
                    
                }
            }
            .isChange {
                    color: #fff;
                    background: #fc3439;
                }
            .pbodyrighttitle-temp {
                width: 100%;
                height:1000px;
                // background: orchid;
                padding: 20px;
                .content-form {
                    padding-right:30px;
                }
                .el-checkbox-group {
                    text-align: left;
                    
                }
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
            .jihuabody-temp {
                
                .jihuabodyul-temp {
                   list-style: none;
                   padding: 0;
                   overflow: hidden;
                   li:first-child {
                        width:95px;
                    }
                   li {
                        width:135px;
                        float: left;
                        display: flex;
                        justify-content: space-around;                       
                    }
                    .divone{
                        width: 88px;
                        height: 84px;
                        border: 1.5px solid #e6e6e6;
                    }
                    .divtwo{
                        width: 88px;
                        height: 84px;
                        border: 1.5px solid #fc3439;
                    }
                    .border-temp {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        p {
                            line-height: 20px;
                        }
                    }
                    .limiddle-temp {
                        height: 84px;
                        line-height: 80px;
                        width: 33px;
                        text-align: center;
                        .limiddletext{
                            color: #666;
                            font-size: 10px;
                            margin: 0;
                            height: 84px;
                        }
                        .limiddelimg1{
                            background:#e6e6e6 url('./images/icon1.png');
                            display:block;
                            width:31px;
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
                            left: 31px;
                        }
                    }
                    .limiddle-temp-hidden {
                        visibility: hidden;
                        // margin-left:0;
                    }
                }
            }
            .detail-temp {
                .detail-content-temp {
                    width: 615px;
                    border:2px solid #e6e6e6;
                    padding:20px 0px 20px 20px;
                    margin-top: 30px;
                    .el-form-item__label, .el-form-item__content {
                        line-height: 60px;
                    }
                    .el-form-item__label {
                        padding-right: 25px;
                    }
                    .el-select>.el-input {
                        width: 265px;
                    }
                    .detail-input-temp {
                        .el-input {
                            display: inline-block;
                            width: 50px;
                            margin:0 10px;
                        }
                    }
                    .select-temp {
                        text-align: left;
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
                    margin-right: 20px;
                    font-size: 12px;
                    color: #666;
                }
                .startPlan {
                    background: #fc3439;
                    border: none;
                    border-radius: 2px;
                    width: 68px;
                    float: right;
                    height: 26px;
                    position: relative;
                    top: 9px;
                    // right:10px;
                    cursor: pointer;
                    font-size: 12px;
                    color: #f6f6f6;
                    text-align: center;
                    line-height: 26px;
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

