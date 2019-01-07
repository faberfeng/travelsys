
<template>
    <div id="fahuo">
        <div class="topHeader">
            <div class="purchaseNav">
                <!-- <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem  navactive">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem">  
                    检查验收  
                </router-link> -->
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['navItem',{'navactive':item.isShow}]">        
                </router-link>
            </div>
            <div class="elselect" v-if="!showCommonList">
                <el-select v-model="selectUser" placeholder="请选择" @change="groupChange">
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
                        <el-tab-pane :label="'已发货 '+planData.length" name="0">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndexone == index ? 'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,false)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未发货 '+noPlanData.length" name="1">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndextwo == index ?'selectActive':'','lefttitlecontent']" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item,index,true)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择发货单
                    </div>
                    <div v-if="!showDetail" class="scrolldiv">
                        <p class="pbodyrighttitle">【{{itemTitle}}】详情</p>
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">基本信息</label>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>单号</th>
                                        <th>名称</th>
                                        <th>定货方</th>
                                        <th>供货方</th>
                                        <th>发货日期</th>
                                        <th>经手人</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-text="orderInfo.orderCode"></td>
                                        <td v-text="orderInfo.orderTitle"></td>
                                        <td v-text="orderInfo.orderUgName"></td>
                                        <td v-text="orderInfo.supply"></td>
                                        <td v-text="orderInfo.sendDate_"></td>
                                        <td v-text="orderInfo.orderUserName"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="titleimg fukuan"></i>
                            <label class="titletext">付款项目</label>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>序号</th>
                                        <th>款项类型</th>
                                        <th>计价单位</th>
                                        <th>数量</th>
                                        <th>单价</th>
                                        <th>总价</th>
                                        <th>经手人</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderInfoData" :key="index">
                                        <td v-text="item.itemId"></td>
                                        <td v-text="item.itemName"></td>
                                        <td v-text="item.unit"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.unitPrice"></td>
                                        <td v-text="item.totalPrice"></td>
                                        <td v-text="item.userName"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="shebeiimg"></i>
                            <label class="titletext">设备主清单</label>
                            <button @click="viewAllDetail" class="alllist">全部标签</button>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>明细数量</th>
                                        <th>发货时间</th>
                                        <th>经手人</th>
                                        <th>发货状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.updateDateTime_"></td>
                                        <td v-text="item.sendRecordUserName"></td>
                                        <td v-text="item.sendStatus==0?'未发货':'发货'"></td>
                                        <td>
                                            <span class="biaoqianIcon " :title="'标签'" @click="tips(item)"></span>
                                            <span class="editdetail" :title="'明细'" @click="showDetialList(item,index)"></span>
                                            <span v-if="activeName == 1 && item.sendStatus ==0" class="sureSend" :title="'发货'" @click="sendGoods(item)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="bottomNav" v-if="activeName == 1">
                            <button @click="sendAllGoods" class="send">确认发货</button>
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id" rType="5" :bId='checkItem.id' :isGongChengLiang="false" :title="'发货管理'" :isShowFahuo="isShowFaHuo" :faHuoObj='DingDanObj' :isFahuo="isFaHuo" v-if="showCommonList"></common-list>
        </div>
        <div id="edit">
            <el-dialog title="发货确认" :visible.sync="sendshow" :before-close="sendCancel" width="398px">
                <div class="editBody" style="margin:0 30px;text-align:left">
                    <p>请确认以下订单发货信息</p>
                    <ul class="sendinfo">
                        <li>
                            <label>订单号:</label>
                            <span>{{selectObject.orderCode}}</span>
                        </li>
                        <li>
                            <label>清单名称:</label>
                            <span>{{sendGoodsObj.title}}</span>
                        </li>
                        <li>
                            <label>供货方:</label>
                            <span>{{suppyPeople}}</span>
                        </li>
                        <li>
                            <label>订货金额:</label>
                            <span>{{sendGoodsObj.amount}}￥</span>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="sendSure">发货</button>
                    <button class="editBtnC" @click="sendCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="发货确认" :visible.sync="sendAllshow" :before-close="sendAllCancel" width="398px">
                <div class="editBody" style="margin:0 30px;text-align:left">
                    <p>请确认以下订单发货信息</p>
                    <ul class="sendinfo">
                        <li>
                            <label>订单号:</label>
                            <span>{{selectObject.orderCode}}</span>
                        </li>
                        <li>
                            <label>清单名称:</label>
                            <span>{{sendAllGoodsObj.orderTitle}}</span>
                        </li>
                        <li>
                            <label>供货方:</label>
                            <span>{{sendAllGoodsObj.supply}}</span>
                        </li>
                        <li>
                            <label>订货金额:</label>
                            <span>{{sendAllGoodsObj.totalAmount}}￥</span>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="sendAllSure">发货</button>
                    <button class="editBtnC" @click="sendAllCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="标签信息预览" :visible.sync="isbiaoqianshow" @close="biaoqianCLose">
                <div class="editBody">
                    <p style="font-weight:bold">{{projectName}}项目物资清单标签</p>
                    <ul style="padding:0 20px">
                        <li class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(biaoqianInfo.pkId, 7)" alt="二维码">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">二维码URL：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mUrl"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">清单ID：</span>
                                    <span class="text-right" v-text="biaoqianInfo.pkId"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">订单名称：</span>
                                    <span class="text-right" v-text="selectObject.orderTitle"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">生成方式：</span>
                                    <span class="text-right" v-text="'【'+biaoqianInfo.mGSource_+'】'"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">源自业务：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mBSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建用户：</span>
                                    <span class="text-right" v-text="biaoqianInfo.creator"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建时间：</span>
                                    <span class="text-right" >{{new Date(biaoqianInfo.createTime).toLocaleString()}}</span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件数量：</span>
                                    <span class="text-right" v-text="biaoqianInfo.manifestDetailCount"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                    <button class="editBtnC" @click="printLabelList">打印当前页标签</button>
                </div>
            </el-dialog>
            <el-dialog title="全部清单标签预览" :visible.sync="isshowallbiaoqian" @close="isshowallbiaoqian = false">
                <div class="editBody">
                    <p style="font-weight:bold">{{projectName}}项目物资清单标签</p>
                    <ul style="padding:0 20px;height:300px;overflow-y:scroll">
                        <li class="item-label clearfix" v-for="(item,index) in allBiaoqianData" :key="index">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="二维码">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">二维码URL：</span>
                                    <span class="text-right" v-text="item.mUrl"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">清单ID：</span>
                                    <span class="text-right" v-text="item.pkId"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">订单名称：</span>
                                    <span class="text-right" v-text="selectObject.orderTitle"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">生成方式：</span>
                                    <span class="text-right" v-text="'【'+item.mGSource_+'】'"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">源自业务：</span>
                                    <span class="text-right" v-text="item.mBSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建用户：</span>
                                    <span class="text-right" v-text="item.creator"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建时间：</span>
                                    <span class="text-right" >{{new Date(item.createTime).toLocaleString()}}</span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件数量：</span>
                                    <span class="text-right" v-text="item.manifestDetailCount"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <el-pagination background  layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                     @current-change="findManifestDetailList(1)" 
                     @prev-click="findManifestDetailList(1)"
                     @next-click="findManifestDetailList(1)"
                    :total="pageLabelList.total">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                </div>
            </el-dialog>
        </div>
        <form style="visibility:hidden" action="http://10.252.26.240:8080/qjbim-project/project/order/QDQrCodeSingle" ref="manifestQrCodeSingleForm"  method="post" target="_blank">
            <input type="text" name="projectName" :value="projectName">
            <input type="text" name="manifestUrl" :value="biaoqianInfo.mUrl">
            <input type="text" name="manifestId" :value="biaoqianInfo.pkId">
            <input type="text" name="orderTitle" :value="selectObject.orderTitle">
            <input type="text" name="mGSource" :value="biaoqianInfo.mGSource_">
            <input type="text" name="mBSource" :value="biaoqianInfo.mBSource_">
            <input type="text" name="creator" :value="biaoqianInfo.creator">
            <input type="text" name="createTime" :value="new Date(biaoqianInfo.createTime).toLocaleString()">
            <input type="text" name="detailCount" :value="biaoqianInfo.manifestDetailCount">
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import commonList from  './../planCost/qingDan.vue'

export default {
    name:'FahuoManage',
    data(){
        return{
            routerList:'',
            moduleList:'',
            activeName:'0',
            BDMSUrl:'',
            token:'',
            projId:'',
            userGroup:[],
            selectUser:'',
            planData:[],
            noPlanData:[],
            itemTitle:'',
            showDetail:true,
            orderDeatilData:[],
            orderInfoData:[],
            orderInfo:{},
            isbiaoqianshow:false,
            biaoqianInfo:{},
            selectObject:{},
            projectName:'',
            isshowallbiaoqian:false,
            allBiaoqianData:[],
            pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            sendshow:false,
            sendGoodsObj:{},
            suppyPeople:'',
            sendAllshow:false,
            sendAllGoodsObj:{},
            selectIndexone:'-1',
            selectIndextwo:'-1',
            showCommonList:false,
            showWuZi:true,
            isShowFaHuo:true,
            isFaHuo:true,
            DingDanObj:{},
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.projectName = localStorage.getItem('projectName');
        this.moduleList=JSON.parse(localStorage.getItem('moduleList'))
        this.loadingTitle()
        this.getUserGroup();
    },
    methods:{
        loadingTitle(){
            var vn=this;
            vn.routerList=vn.getSecondGradeList(vn.moduleList,'011','01104','/metarialpurchase/fahuoManage','01103','/metarialpurchase/dinghuoManage','01105','/metarialpurchase/checked','01101','/metarialpurchase/productioncenter','01102','/metarialpurchase/wuliaopurchase');
            console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4,Code5,routerLink5){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                    if(item.moduleCode==Code5){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink5);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
        //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        backToH(){
            this.showCommonList = false;
        },
        showDetialList(val,i){
            console.log(val);
            this.showCommonList = true;
            this.checkItem = val;
            this.DingDanObj = {};
            Object.assign(this.DingDanObj,{
                                orderCode:this.orderInfo.orderCode,
                                orderTitle:this.orderInfo.orderTitle,
                                checkItem:this.checkItem,
                                orderId:this.orderInfo.id,
                            })
            console.log("订货管理到清单",this.DingDanObj); 
        },
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
            this.showDetail = true;
        },
        //群组改变
        groupChange(){
            this.getPlanList(this.selectUser);
            this.getNoPlanList(this.selectUser);
            this.showDetail = true;
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
                        if(response.data.rt.selectUgId == null){
                            this.selectUser = response.data.rt.ugList[0].ugId;
                        }else {
                            this.selectUser = response.data.rt.selectUgId;
                        }
                        this.getPlanList(this.selectUser);
                        this.getNoPlanList(this.selectUser);
                    } 
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //已发货
        getPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/delivery/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    sendStatus:'1' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows !=null){
                            this.planData = response.data.rt.rows;
                        }else{
                            this.planData = [];
                        }
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //未发货
        getNoPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/delivery/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    sendStatus:'0' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows != null){
                            this.noPlanData = response.data.rt.rows;
                        }else{
                            this.noPlanData = [];
                        }
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        selectItem(item,index,flag){
            if(flag){
                this.selectIndextwo = index;
                this.isFaHuo = false;
            }else{
                this.selectIndexone = index;
                this.isFaHuo = true;
            }
            this.showDetail = false;

            this.selectObject = item;
            this.itemTitle = item.orderTitle;
            this.getOrderDetail(item.id);
            this.getOrderPaymentItem(item.id);
            this.getOrderInfo(item.id)
        },
        //获取订单信息
        getOrderInfo(id){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderInfo/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.orderInfo = response.data.rt;
                    if(this.orderInfo.sendDate!=null){
                        Object.assign(this.orderInfo,{
                            sendDate_:new Date(this.orderInfo.sendDate).toLocaleString()
                        })
                    }
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取订单的清单列表
        getOrderDetail(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderDetail/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderDeatilData = response.data.rt.rows;
                        if(this.orderDeatilData!=null){
                            this.orderDeatilData.forEach((item)=>{
                                Object.assign(item,{
                                    updateDateTime_:new Date(item.updateDateTime).toLocaleString()
                                })
                            })
                        }  
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //所属订单付款想列表
        getOrderPaymentItem(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderPaymentItem/'+id,
                headers:{
                    token:this.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderInfoData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //查看详情
        viewDeatil(item){

        },
        //标签
        tips(item){
            this.isbiaoqianshow = true;
            this.shebeiObj = item;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getManifestInfoByBId',
                headers:{
                    token:this.token
                },
                params:{
                    bId:item.id,
                    rType:5,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.cd !=null){
                        this.biaoqianInfo = response.data.rt;
                        Object.assign(this.biaoqianInfo,{
                            mBSource_:this.parseMBSource(this.biaoqianInfo.mBSource),
                            mGSource_:this.parseMGSource(this.biaoqianInfo.mGSource)
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //网页预览
        labelListConfirm(){
            this.$refs.manifestQrCodeSingleForm.submit();
        },
                //打印当前标签页
        printLabelList(){
            alert('已向打印机发送请求！');
        },
        biaoqianCLose(){
            this.isbiaoqianshow = false;
        },
        parseMBSource(mBSource) {
            switch (mBSource) {
                case 1:
                    return "文档管理-关联构件";
                case 2:
                    return "进度计划-任务核实";
                case 3:
                    return "成本管理-工程量";
                case 4:
                    return "成本管理-物料量";
                case 5:
                    return "物资采购-订货管理";
                case 6:
                    return "讨论主题";
                case 7:
                    return "成本管理-报表快照";
                default:
                    return "";
            }
        },
        parseMGSource(mGSource) {
            switch (mGSource) {
                case 1:
                    return "选择集";
                case 2:
                    return "报表快照";
                case 3:
                    return "构件量生成";
                case 4:
                    return "外部导入";
                case 5:
                    return "构件量生成";
                default:
                    return "";
            }
        },
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
        },
        //查看全部标签
        viewAllDetail(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/listOrderDetailByOrderId',
                headers:{
                    token:this.token
                },
                params:{
                    pageNo:this.pageLabelList.currentPage,
                    pageSize:this.pageLabelList.pagePerNum,
                    orderId:this.selectObject.id
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.isshowallbiaoqian = true;
                    if(response.data.rt != null){
                        this.allBiaoqianData = response.data.rt.rows;
                        this.allBiaoqianData.forEach(item=>{
                            Object.assign(item,{
                                mBSource_:this.parseMBSource(item.mBSource),
                                mGSource_:this.parseMGSource(item.mGSource)
                            })
                        })
                        this.pageLabelList.total = response.data.rt.pager.totalSize;
                    }
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },
        findManifestDetailList(){

        },
        sendGoods(item){
            this.sendshow = true;
            this.sendGoodsObj = item;
            this.getSupply(this.selectUser);
        },
        getSupply(user){
            if(user == '595'){
                this.suppyPeople = '默认群组';
            }else if(user == '596'){
                this.suppyPeople = '质量验收';
            }else if(user == '597'){
                this.suppyPeople = '质量检查';
            }else if(user == '598'){
                this.suppyPeople = '安全验收';
            }else if(user == '599'){
                this.suppyPeople = '安全检查';
            }else if(user == '560'){
                this.suppyPeople = '供货商';
            }else if(user == '561'){
                this.suppyPeople = '施工单位';
            }else if(user == '562'){
                this.suppyPeople = '设计单位';
            }else if(user == '563'){
                this.suppyPeople = '建设单位';
            }
        },
        //发货确认
        sendSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/delivery/deliveryOrderDetail',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    id:this.sendGoodsObj.id
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.sendshow = false;
                    this.getOrderDetail(this.selectObject.id);
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //发货取消
        sendCancel(){
            this.sendshow = false;
        },
        //总的发货
        sendAllGoods(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderInfo/'+this.selectObject.id,
                headers:{
                    token:this.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    this.sendAllshow = true;
                    this.sendAllGoodsObj = response.data.rt;
                }else{
                    alert(response.data.msg)
                }
            })
        },
        sendAllSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/delivery/deliveryOrder',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderId:this.selectObject.id
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.sendAllshow = false;
                    this.getPlanList(this.selectUser);
                    this.getNoPlanList(this.selectUser);
                    this.showDetail = true;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        sendAllCancel(){
            this.sendAllshow = false;
        }

    }
}
</script>
<style lang="less">
#fahuo{
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
                    font-weight: bold;
                }
                .lefttitlelab{
                    display: inline-block;
                    margin-left: 20px;
                }
                .lefttitlespan{
                    display: inline-block;
                    margin-left: 87px;
                }
                .lefttitlespanone{
                    margin-left: 40px;
                }
            }
        }
        .pbodyright{
            flex: 1;
            overflow: scroll;
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
            .fukuan{
                width: 17px;
                height:16px;
                background: url('./images/fukuan.png') ;
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
            .alllist{
                width: 77px;
                height: 26px;
                border: none;
                background: #f5f5f5;
                color: #666;
                float: right;
                cursor: pointer;
                margin-top: 9px;
            }
        }
        .borderbottom{
            margin: 10px 30px 30px 20px;
        }
        .bottomNav{
            margin-top: 90px;
            .send{
                width: 102px;
                height: 36px;
                border: none;
                background: #fc3439;
                color: #fff;
                cursor: pointer;
                border-radius: 2px;
                font-size: 14px;
                font-family: 'Microsoft YaHei';
            }
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
        .biaoqianIcon{
            float: left;
            width: 12px;
            height: 12px;
            background: url('./images/editdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .editdetail{
            float: left;
            width: 10px;
            height: 12px;
            background: url('./images/viewdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .sureSend{
            float: left;
            width: 15px;
            height: 15px;
            background: url('./images/1-2.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
    }
    .clearfix {
      clear: both;
      overflow: hidden;
      content: '';
    }

    .img_left {
      float: left;
      width: 90px;
      height: 90px;
      margin: 40px 30px 0 10px;
    }

    .right {
      float: left;
      width: 400px;
      margin-top: 20px;

      .item-list {
        margin-bottom: 14px;

        .text-left {
          float: left;
          font-size: 12px;
          line-height: 12px;
          width: 80px;
          color: #999;
          text-align: left;
        }

        .text-right {
          float: left;
          width: 300px;
          font-size: 12px;
          line-height: 12px;
          color: #333333;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &:last-of-type {
          margin-bottom: 20px;
        } 
      }
    }
    .sendinfo{
        list-style: none;
        padding: 0;
        li{
            font-size: 14px;
            line-height: 14px;
            margin-top: 25px;
        }
    }
    #edit .el-dialog__body{
        margin-top: 20px;
    }
}
</style>

