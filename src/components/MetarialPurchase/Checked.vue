
<template>
    <div id="wuliao">
        <div class="topHeader">
            <div class="purchaseNav">
                <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem  navactive">  
                    检查验收  
                </router-link>
            </div>
            <div class="elselect" v-if="!showCommonList">
                <el-select v-model="selectUser" placeholder="请选择">
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
                        <el-tab-pane :label="'已签收'+planData.length" name="first">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndexone == index ?'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,false)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未签收'+noPlanData.length" name="second">
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
                            <label class="titletext">检查记录</label>
                        </div>
                        <div class="borderbottom1">   
                            <div class="quanxuan">
                                <!-- <el-checkbox v-if="!isReceipt">全选</el-checkbox> -->
                                <button v-if="!isReceipt" class="btn" @click="allCheckOver()" :class=" orderInfo.checkStatus === 2 ? 'content-hidden' : ''">检查完成</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <!-- <th v-if="!isReceipt"></th> -->
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>总数量</th>
                                        <th>取样数量</th>
                                        <th>取样率</th>
                                        <th>检查人</th>
                                        <th>检查时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) of orderDeatilData" :key="index">
                                        <!-- <td v-if="!isReceipt"><el-checkbox></el-checkbox></td> -->
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.sampleSize"></td>
                                        <td v-text="item.sampleRate"></td>
                                        <td v-text="item.checkUserName"></td>
                                        <td v-text="item.checkDate_"></td>
                                        <td>
                                            <span class="detailsIcon" @click="showDetialList(item,index)" title="详情"></span>
                                            <span v-if="!isReceipt" class="editIcon" :class=" item.checkStatus == 2 ? 'content-hidden' : ''" @click="showOver(index)" title="完成"></span>
                                            <span v-if="!isReceipt" class="backIcon" :class=" [item.checkStatus == 0 ? 'content-hidden' : '',orderInfo.checkStatus == 2 ? 'content-hidden' : '']" @click="showBackOver( index )" title="撤销"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="tableinfo">
                                <label class="checkqz">检查群组：</label><span class="checktext">{{orderInfo.checkUgName}}</span>
                                <label class="checkpeo">检查人：</label><span class="checktext">{{orderInfo.checkUserName}}</span>
                                <label class="checktime">检查时间：</label><span class="checktext">{{orderInfo.checkDate_}}</span>
                            </div>
                        </div>
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">签收记录</label>
                        </div>
                        <div class="borderbottom1">   
                            <div class="quanxuan huoweixuanz">
                                <label class="huoweilabel">当前货位：</label>
                                <el-select v-model="huoweiselect">
                                    <el-option :value="item.id" v-for="(item,index) of store" :key="index" :label="item.name"></el-option>
                                    <!-- <el-option value="2">233</el-option>
                                    <el-option value="3">345</el-option> -->
                                </el-select>
                            </div>
                            <div class="quanxuan">
                                <button v-if="!isReceipt" class="btn" :class=" isAllReceiptOver ?'content-hidden':''" @click="AllReceiptOver()">签收订单</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>总数量</th>
                                        <th>堆场位号</th>
                                        <th>签收状态</th>
                                        <th>签收人</th>
                                        <th>签收时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.warehouseName"></td>
                                        <td v-text="item.currentStep"></td>
                                        <td v-text="item.receiptUserName"></td>
                                        <td v-text="item.receiptDate_"></td>
                                        <td>
                                            <span class="detailsIcon" @click="showDetialList(item,index)" title="详情"></span>
                                            <span v-if="!isReceipt" class="editIcon" :class=" item.receiptStatus == 1 ? 'content-hidden' : ''" @click="showReceipt( index )" title="完成"></span>
                                            <span v-if="!isReceipt" class="backIcon" :class=" item.receiptStatus == 0 ? 'content-hidden' : ''" @click="showBackReceipt( index )" title="撤销"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="tableinfo">
                                <label class="checkqz">签收群组：</label><span class="checktext">{{orderInfo.receiptUgName}}</span>
                                <label class="checkpeo">签收人：</label><span class="checktext">{{orderInfo.receiptUserName}}</span>
                                <label class="checktime">签收时间：</label><span class="checktext">{{orderInfo.receiptDate_}}</span>
                            </div>
                        </div>
                        <div class="borderbottom1 huowei">
                            <div class="huoweileft">货位选择：</div>
                            <div class="huoweiright">
                                <div class="huiweirighttitle">
                                    选择堆场
                                </div>
                                <ul class="huiweirightimg">
                                    <li v-for="(item,index) of store" :key="index">
                                        <div class="store">
                                            <a class="store_img"><img :src="item.imgPath" alt=""></a>
                                            <div class="store_edit">
                                                <a class="store_name">
                                                    <span>{{item.name}}</span>
                                                </a>
                                                <div v-if="index > 0" class="store_edit_detail">
                                                    <a>
                                                        <img src="./images/edit.png" alt="">
                                                    </a>
                                                    <a>
                                                        <img src="./images/upload.png" alt="">
                                                    </a>
                                                    <a>
                                                        <img src="./images/delete2.png" alt="">
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" :mId="checkItem.id" rType="5" :bId='checkItem.id' :isGongChengLiang="false" :title="'检查验收'"  v-if="showCommonList"></common-list>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import commonList from  './../planCost/qingDan.vue'


export default {
    name:'Checked',
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
            itemTitle:'',
            showDetail:true,
            orderDeatilData:[],
            orderInfoData:[],
            orderInfo:{},
            huoweiselect:'',
            selectIndexone:'-1',
            selectIndextwo:'-1',
            isReceipt:true,
            showCommonList:false,
            checkItem:{},
            isAllCheckOver:false,
            isAllReceiptOver:false,
            isCheckOver:false,
            isReceiptOver:false,
            store:[],
            defaultImageUrl:'http://10.252.26.240:8080/qjbim-file/upload/107/public/006/2017/12/13/02661b31-9687-4896-ba8c-b89ae30abd53.jpg',

        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.getUserGroup();
        this.getStore();
    },
    methods:{
        showDetialList(val,i){
            console.log(val);
            this.showCommonList = true;
            this.checkItem = val;
        },
        
        //检查记录 确认
        showOver( i ){
            let bill = "清单检测完成确认";
            let status = 2;
            let isSuse = '确认对当前清单内的构件抽检完成：';
            let isCheck = true;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck );                   
                }
            })
        },
        //检查记录 撤销
        showBackOver( i ){
            let bill = "清单取消检测确认";
            let status = 0;
            let isSuse = "确认对当前清单内的构件撤销抽检：";
            let isCheck = true;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck );
                }
            })
        },
        //签收记录 确认
        showReceipt( i ){
            let bill = "签收清单完成确认";
            let status = 1;
            let isSuse = '确认签收以下清单内所有构件：';
            let isCheck = false;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    if( item.checkStatus == 2 ){
                        this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,item.warehouseName );
                    }else{
                        this.$alert('清单【'+item.orderDetailCode+'】在签收之前应进行检查确认！', '提示', {
                            confirmButtonText: '确定',
                        });
                    }          
                }
            })
            console.log("...showReceipt");
        },
        //签收记录 撤销
        showBackReceipt( i ){
            let bill = "取消签收清单确认";
            let status = 0;
            let isSuse = '取消签收以下清单内所有构件：';
            let isCheck = false;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,item.warehouseName );
                }
            })
        },
        //检查 全选确认
        allCheckOver(){
            let flag = this.orderDeatilData.some( (item,index) =>{
                return item.checkStatus == 0;
            });
            if( flag ){
                this.$alert('存在没有检查的清单，不能完成订单的检查!', '提示', {
                        confirmButtonText: '确定',
                    });
            }else{
                this.isAllCheckOver = true;
                this.orderInfo.checkStatus = 2;
            }
        },
        //签收 全选确认
        AllReceiptOver(){
            if( this.orderInfo.checkStatus == 2 ){
                this.orderDeatilData.map( (item,index) =>{
                    item.receiptStatus = 1;
                })
                this.isAllReceiptOver = true;
            }else{
                this.$alert('订单在签收之前应进行检查确认！', '提示', {
                        confirmButtonText: '确定',
                    });
            }
        },
        //确认弹出框
        isOver( count,sampleSize,sampleRate,bill,i,status,isSuse,isCheck,orderDetailCode,title,warehouseName ) {
            const h = this.$createElement;
            if( isCheck ){
                this.$msgbox({
                title: bill,
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},isSuse),
                    h('p',null,'清单构件总数：'+count),
                    h('p',null,'已经检查数量：'+sampleSize),
                    h('p',null,'检查比例：'+sampleRate),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then(action => {
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    this.orderDeatilData.map( (item,index)=>{
                        if( i == index){
                            item.checkStatus = status;                       
                        }
                    })      
            });
            }else {
                this.$msgbox({
                title: bill,
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},isSuse),
                    h('p',null,'清单名称：'+title),
                    h('p',null,'清单编号：'+orderDetailCode),
                    h('p',null,'货位号：'+warehouseName),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then(action => {
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    this.orderDeatilData.map( (item,index)=>{
                        if( i == index){
                            item.receiptStatus = status;                       
                        }
                    })      
            });
            }
        },
         backToH(){
            // var vm = this
            // vm.showCommonEdit = false
            this.showCommonList = false;
        },
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
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
                        console.log("获取群组",response.data.rt)
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
        //获取堆场信息
        getStore(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getWarehouse',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then( res =>{
                console.log("获取堆场信息",res);
                this.store = [];
                // if(response.data.cd == 0){
                //     if(response.data.rt != null){
                //         console.log("获取群组",response.data.rt)
                //         this.userGroup = response.data.rt.ugList;
                //         this.selectUser = response.data.rt.selectUgId;
                //         this.getPlanList(this.selectUser);
                //         this.getNoPlanList(this.selectUser);
                //     } 
                // }else{
                //     alert(response.data.msg)
                // }
                if( res.data.cd == 0 ){
                    if( res.data.rt != null ) {
                        this.store = res.data.rt;
                        this.store.map( (item,index) =>{
                            if( item.image != null ){
                                item.imgPath = item.image.filePath;
                            }else{
                                item.imgPath = this.defaultImageUrl;
                            }
                            console.log("获取堆场url",item);
                        });
                        
                        // this.store.push(res.data.rt.Object.assign({},item));
                        //  Object.assign(this.orderInfo,{
                        //     checkDate_:new Date(this.orderInfo.checkDate).toLocaleString(),
                        //     receiptDate_:new Date(this.orderInfo.receiptDate).toLocaleString(),
                        // })
                        // res.data.rt.map( (item)=>{
                        //     const obj=Object.assign({},item);
                        //     this.store.push(obj);
                        // });
                        // this.store.map( (item) =>{
                        //     if
                        //     console.log("获取堆场",item);
                        // })
                        
                    }
                }else{
                    alert(res.data.msg)
                }
            })
        },
        //已签收
        getPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'3' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
                            this.planData = response.data.rt.rows;
                            console.log("已签收",this.planData)
                        }else{
                            this.planData = [];
                        }
                        
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //未签收
        getNoPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getOrderListByStatus',
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
                        if(response.data.rt.rows!=null){
                            this.noPlanData = response.data.rt.rows;
                            console.log("未签收",this.noPlanData)
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
                this.isReceipt = false;
            }else{
                this.selectIndexone = index;
                this.isReceipt = true;
            }

            this.showDetail = false;
            this.itemTitle = item.orderTitle;
            this.getOrderDetail(item.id);
            this.getOrderPaymentItem(item.id);
            this.getOrderInfo(item.id)

        },
        //获取订单信息
        getOrderInfo(id){
            this.orderInfo = {};
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderInfo/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{                
                if(response.data.cd == 0){
                    this.orderInfo = response.data.rt;
                    console.log("获取订单信息",this.orderInfo)
                    if( this.orderInfo.checkDate != null && this.orderInfo.receiptDate != null ){                        
                        Object.assign(this.orderInfo,{
                            checkDate_:new Date(this.orderInfo.checkDate).toLocaleString(),
                            receiptDate_:new Date(this.orderInfo.receiptDate).toLocaleString(),
                        })
                    }else if( this.orderInfo.checkDate!=null && this.orderInfo.receiptDate == null ){
                        Object.assign(this.orderInfo,{
                            checkDate_:new Date(this.orderInfo.checkDate).toLocaleString(),
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取订单的清单列表
        getOrderDetail(id){
            this.orderDeatilData = [];
            
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
                        let flag = this.orderDeatilData.some( (item,index) =>{
                            return item.checkStatus == 0;
                        });
                        if( !flag && this.orderInfo.checkStatus === 2){
                            this.orderInfo.checkStatus = 2;
                        }else{
                            this.orderInfo.checkStatus = 0;
                        }
                        console.log("获取订单的清单列表",this.orderDeatilData)
                        this.orderDeatilData.forEach((item)=>{
                            if( item.checkDate != null && item.receiptDate!=null ){
                                Object.assign(item,{
                                    checkDate_:new Date(item.checkDate).toLocaleString(),
                                    receiptDate_:new Date(item.receiptDate).toLocaleString(),
                                })
                            }else if( item.checkDate != null && item.receiptDate == null ){
                                Object.assign(item,{
                                    checkDate_:new Date(item.checkDate).toLocaleString(),
                                })
                            }
                        })
                        console.log("清单列表",this.orderDeatilData);
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
                        console.log("所属订单付款想列表",this.orderInfoData)
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //查看详情
        viewDeatil(item){
            this.showCommonList = true;
        }
    }
}
</script>
<style lang="less">
#wuliao{
    ::-webkit-scrollbar{width:0px}
    .content-hidden {
        display: none;               
    }
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
        }
        .borderbottom1{
            margin: 16px 30px 0px 20px;
        }
        .huowei{
            display: flex;
            margin-bottom: 30px;
            .huoweileft{
                width: 74px;
                font-size: 14px;
                color: #999;
                text-align: left;
            }
            .huoweiright{   
                flex: 1;
                border: 1px solid #fc3439;
                .huiweirighttitle{
                    height: 70px;
                    line-height: 70px;
                    margin: 0 20px;
                    text-align: left;
                    border-bottom: 1px solid #e6e6e6;
                    font-size: 14px;
                    color: #fc3439;

                }
                .huiweirightimg{
                    list-style: none;
                    padding: 0;
                    margin: 20px 0 20px 0px;
                    overflow: hidden;
                    li{
                        width: 160px;
                        height: 160px;
                        float: left;
                        margin-left: 20px;
                        border: 1px solid #e6e6e6;
                        
                        .store {
                            display: inline-block;
                            width:156px;
                            height:156px;
                            position: relative;
                            border:2px solid #e6e6e6;
                            z-index:10;
                            .store_img {
                                display: inline-block;
                                position: absolute;
                                // margin: ;
                                top:0;
                                left:0;
                                width:100%;
                                height:100%;
                                z-index:1;
                                img {
                                    width: 156px;
                                    height: 156px;
                                    cursor: pointer;
                                }
                            }   
                            .store_edit {
                                display: inline-block;
                                width:100%;
                                height:50%;
                                position: absolute;
                                left:0;
                                bottom:0;
                                z-index: 2;
                                .store_name {
                                    position: absolute;
                                    width:100%;
                                    color: #e6e6e6;
                                    text-align: center;
                                    left:0;
                                    top:0;                                   
                                }
                                .store_edit_detail {
                                    position: absolute;
                                    bottom:10px;
                                    left:25px;
                                    width:100px;
                                    z-index: 3;
                                    display: flex;
                                    justify-content: space-around;
                                    a img {
                                        cursor: pointer;
                                    }
                                    // background-color: lightgray;
                                }
                            }
                            
                        }
                        
                    }
                }
            }
        }
        .tableinfo{
            height: 32px;
            border-bottom: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            text-align: left;
            line-height: 32px;
            font-size: 12px;
            .checkqz{
                margin-left: 10px;
                color: #999;
            }
            .checkpeo{
                margin-left: 61px;
                color: #999;
            }
            .checktime{
                margin-left: 61px;
                color: #999;
            }
            .checktext{
                color: #333;
            }
        }
        .borderbottom{
            margin: 10px 30px 30px 20px;
        }
        .quanxuan{
            text-align:left;
            margin: 0 0 13px 0;
            line-height: 12px;
            overflow: hidden;
            .el-checkbox__label{
                font-size:12px;
                color: #999;
            }
            .btn{
                border: none;
                width: 75px;
                height: 28px;
                background: #f2f2f2;
                font-size: 12px;
                color: #666;
                float: right;
                cursor: pointer;
            }
        }
        .huoweixuanz{
            .huoweilabel{
                color: #999;
                font-size: 14px;
                line-height: 14px;
            }
        }
        .detailsIcon, .editIcon, .backIcon {
            float: left;
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 10px;
        }
        .detailsIcon{
            background: url('./images/detail.png') no-repeat 0 0;
        }
        .editIcon{
            background: url('./images/save1.png') no-repeat 0 0;
        }
        .backIcon{
            background: url('./images/back1.png') no-repeat 0 0;
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
}
</style>

