
<template>
    <div id="dinghuo">
        <div class="topHeader">
            <div class="purchaseNav">
                <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem navactive">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem">  
                    检查验收  
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
                        <el-tab-pane :label="'已订货 '+planData.length" name="0">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[index == selectIndexone?'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,false)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未订货 '+noPlanData.length" name="1">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li  :class="[index == selectIndextwo?'selectActive':'','lefttitlecontent']" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item,index,true)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                        <span class="showIcon">
                                            <i  @click="editOrder(item)" class="noplanEdit"></i>
                                            <i @click="removeOrder(item)" class="noplanDelete"></i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择订货单
                        <button @click="newListBtn" class="newList">新建订单</button>
                    </div>
                    <div v-if="!showDetail" class="scrolldiv">
                        <p class="pbodyrighttitle">
                            【{{selectObject.orderTitle}}】详情
                            <button @click="newListBtn" v-if="activeName == 1" class="newList">新建订单</button>    
                        </p>
                        
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
                                        <th>订货日期</th>
                                        <th>经手人</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-text="orderInfo.orderCode"></td>
                                        <td v-text="orderInfo.orderTitle"></td>
                                        <td v-text="orderInfo.orderUgName"></td>
                                        <td v-text="orderInfo.supply"></td>
                                        <td v-text="orderInfo.orderDate_"></td>
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
                                        <th v-if="activeName == 1">操作</th>
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
                                        <td v-if="activeName == 1">
                                            <span v-if="item.itemId !=1" class="editIcon" @click="viewDeatil(item)" :title="'编辑'"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="shebeiimg"></i>
                            <label class="titletext">设备主清单</label>
                            <button v-if="activeName == 1" @click="viewAllDetail" style="margin-left:10px;" class="alllist">添加清单</button>
                            <button @click="viewAllDetail" class="alllist">全部标签</button>
                        </div>
                        <div class="borderbottom">   
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr  class="userList-thead">
                                        <th>清单</th>
                                        <th>来源</th>
                                        <th>清单名称</th>
                                        <th>构件数</th>
                                        <th>清单总价</th>
                                        <th>增加日期</th>
                                        <th>经手人</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.amount"></td>
                                        <td v-text="item.updateDateTime_"></td>
                                        <td v-text="item.updateUserName"></td>
                                        <td>
                                            <span class="biaoqianIcon" :title="'标签'" @click="tips(item)"></span>
                                            <span class="editdetail" :title="'明细'" @click="showDetialList(item,index)"></span>
                                            <span v-if="activeName == 1" class="deleteIcon" :title="'删除'" @click="deleteItem(item)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id" rType="5" :bId='checkItem.id' :isGongChengLiang="false" :title="'订货管理'"  v-if="showCommonList"></common-list>
        </div>
        <div id="edit">
            <el-dialog title="编辑付款项目" :visible.sync="editfukuan.show" :before-close="editfukuanCancel">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">计价单位 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.computerunit"/></div>
                    <div class="editBodytwo"><label class="editInpText">数量 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.amount"/></div>
                    <div class="editBodytwo"><label class="editInpText">单价 :</label><input class="inp" placeholder="请输入" v-model="editfukuan.price"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editfukuanSure">确定</button>
                    <button class="editBtnC" @click="editfukuanCancel">取消</button>
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
            <el-dialog title="新建订货单" :visible.sync="addNewListShow" :before-close="listClose">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>订单名称 :</label>
                        <input class="inp" placeholder="请输入" v-model="newListName"/>
                    </div>
                    <div class="editBodytwo editBodyone edit-item clearfix"><label class="editInpText">供货方 :</label>
                        <select class="editSelect" v-model="suppyModel" >
                            <option value="595">默认群组</option>
                            <option value="596">质量验收</option>
                            <option value="597">质量检查</option>
                            <option value="598">安全验收</option>
                            <option value="599">安全检查</option>
                            <option value="560">供货商</option>
                            <option value="561">施工单位</option>
                            <option value="562">设计单位</option>
                            <option value="563">建设单位</option>
                            <option value="563">测试群组</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addListSure">新建</button>
                    <button class="editBtnC" @click="listClose">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="更改订货单名称" :visible.sync="editListTitle" :before-close="editListTitleCancel">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>订单名称 :</label>
                        <input class="inp" placeholder="请输入" v-model="editTitle"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editListTitleSure">更改</button>
                    <button class="editBtnC" @click="editListTitleCancel">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg">
                    <img src="../../assets/warning.png"/>
                </div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
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
    name:'DinghuoManage',
    data(){
        return{
            activeName:'0',
            BDMSUrl:'',
            token:'',
            selectIndexone:'-1',
            selectIndextwo:'-1',
            projId:'',
            userGroup:[],
            selectUser:'',
            planData:[],
            noPlanData:[],
            showDetail:true,
            orderDeatilData:[],
            orderInfoData:[],
            orderInfo:{},
            selectObject:{},//左侧选中的数据
            editfukuan:{
                show:false,
                computerunit:'',
                amount:'',
                price:'',
                obj:'',//选中行的数据
            },
            deleteDialog:false,
            deleteObjItem:{},
            isbiaoqianshow:false,
            biaoqianInfo:{},
            shebeiObj:{},
            projectName:'',
            isshowallbiaoqian:false,
            allBiaoqianData:[],
            pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            addNewListShow:false,
            newListName:'',
            suppyModel:'595',
            editListTitle:false,
            editTitle:'',
            editTitleObj:{},
            showCommonList:false,
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.projectName = localStorage.getItem('projectName');
        this.getUserGroup();
    },
    methods:{
        backToH(){
            this.showCommonList = false;
        },
        showDetialList(val,i){
            console.log(val);
            this.showCommonList = true;
            this.checkItem = val;
        },
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
            this.showDetail = true;
        },
        groupChange(){
            this.getPlanList(this.selectUser);
            this.getNoPlanList(this.selectUser);
            this.showDetail = true;
        },
        //新建订单
        newListBtn(){
            this.addNewListShow = true;
        },
        addListSure(){
            this.addNewListShow = false;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/add',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderTitle:this.newListName,
                    orderUgId:this.suppyModel,
                    supplyUgId:this.suppyModel

                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getNoPlanList(this.selectUser);
                    this.newListName = '';
                    this.suppyModel = '';
                }else{
                    alert(response.data.msg);
                }
            })
        },
        listClose(){
            this.addNewListShow = false;
        },  
        //删除订单
        removeOrder(item){
            this.$confirm('确定要删除此订单？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/removeOrder',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        orderId:item.id,
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getNoPlanList(this.selectUser);
                    }else{
                        alert(response.data.msg);
                    }
                })
            })
            
        },
        //编辑订单
        editOrder(item){
            this.editTitleObj = item;
            this.editListTitle = true;
            this.editTitle = item.orderTitle
        },
        editListTitleSure(){
            this.editListTitle = false;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/updateOrderTitle',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    orderId:this.editTitleObj.id,
                    orderTitle:this.editTitle
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getNoPlanList(this.selectUser);
                }else{
                    alert(response.data.msg);
                }
            })
        },
        editListTitleCancel(){
            this.editListTitle = false;
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
        //已订货
        getPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'2' 
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
                    alert(response.data.msg)
                }
            })
        },
        //
        getNoPlanList(ugId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'1' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
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
        selectItem(item,index,flag){
            if(flag){
                this.selectIndextwo = index;
            }else{
                this.selectIndexone = index;
            }
            this.selectObject = item;
            this.showDetail = false;
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
                    if(this.orderInfo.orderDate!=null){
                        Object.assign(this.orderInfo,{
                            orderDate_:new Date(this.orderInfo.orderDate).toLocaleString()
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
                        if(this.orderDeatilData !=null){
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
            this.editfukuan.obj = item;
            this.editfukuan.show = true;
            this.editfukuan.computerunit = item.unit;
            this.editfukuan.amount = item.count;
            this.editfukuan.price = item.unitPrice;
        },
        //确认编辑
        editfukuanSure(){
            if(this.editfukuan.amount != '' && this.editfukuan.price != '' && this.editfukuan.computerunit != ''){
                let totalPrice = this.editfukuan.amount*this.editfukuan.price;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/order/updatePaymentItem',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:this.editfukuan.obj.id,
                        count:this.editfukuan.amount,
                        unit:this.editfukuan.computerunit,
                        unitPrice:this.editfukuan.price,
                        totalPrice:totalPrice,
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getOrderPaymentItem(this.selectObject.id);
                        this.editfukuan.show = false;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }else{
                alert('计价单位，数量，单价都为必输项!');
            }
        },
        //取消编辑
        editfukuanCancel(){
            this.editfukuan.show = false;
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
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
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
        //删除设备清单
        deleteItem(item){
            this.deleteDialog = true;
            this.deleteObjItem = item;
        },
        //删除确定
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/removeOrderDetail',
                headers:{
                    token:this.token
                },
                params:{
                    orderId:this.deleteObjItem.orderId,
                    id:this.deleteObjItem.id
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getOrderDetail(this.selectObject.id);
                    this.deleteDialog = false;
                }else{
                    alert(response.data.msg);
                }
            })

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

        }

    }
}
</script>
<style lang="less">
#dinghuo{
    ::-webkit-scrollbar{width:0px}//隐藏滚动条
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
                .showIcon{
                    float: right;
                    visibility: hidden;
                }
                .selectActive{
                    color: #333;
                    font-weight: bold;
                }
                .lefttitlecontent:hover .showIcon{
                    visibility: visible;
                }
                .lefttitlelab{
                    display: inline-block;
                    margin-left: 20px;
                }
                .lefttitlespan{
                    display: inline-block;
                    margin-left: 87px;
                }
                .noplanEdit{
                    display: inline-block;
                    width: 17px;
                    height: 16px;
                    background: url('./images/1-2.png')no-repeat 0 0;
                    cursor: pointer;
                    margin-right: 12px;
                }
                .noplanDelete{
                    display: inline-block;
                    width: 17px;
                    height: 16px;
                    margin-right: 10px;
                    background: url('./images/delete1.png')no-repeat 0 0;
                    cursor: pointer;
                }
                .lefttitlespanone{
                    margin-left: 40px;
                }
            }
        }
        .pbodyright{
            flex: 1;
            overflow: scroll;
            // .scrolldiv{
            //     overflow-y:scroll;
            //     height: calc(100vh - 226px); 
            //     // margin-bottom: 20px;
            // }
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
            .newList{
                height: 26px;
                width: 77px;
                border: none;
                float: right;
                margin-top: 9px;
                margin-right: 20px;
                background: #fc3439;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                font-family: 'Microsoft YaHei';
            }
            .jindu{
                border-bottom: 1px solid #e6e6e6;
                margin: 0 20px;
                text-align: left;
                height: 44px;
                line-height: 44px;
                overflow: hidden;
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
            margin: 10px 20px 30px 20px;
        }
        .editIcon{
            float: left;
            width: 17px;
            height: 16px;
            background: url('./images/1-2.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .biaoqianIcon{
            float: left;
            width: 12px;
            height: 12px;
            background: url('./images/viewdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .editdetail{
            float: left;
            width: 10px;
            height: 12px;
            background: url('./images/editdetail.png')no-repeat 0 0;
            cursor: pointer;
            margin-right: 20px;
        }
        .deleteIcon{
            float: left;
            width: 12px;
            height: 12px;
            background: url('./images/deleteIcon.png')no-repeat 0 0;
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
    .clearfix{
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

