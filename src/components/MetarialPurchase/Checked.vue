
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
            <div class="elselect">
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
            <div class="pbody">
                <div class="pbodyleft">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="'已签收'" name="first">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li class="lefttitlecontent" v-for="(item,index) in planData" :key="index" @click="selectItem(item)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="未签收" name="second">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li class="lefttitlecontent" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item)">
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
                                <el-checkbox>全选</el-checkbox>
                                <button class="btn">检查完成</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <th></th>
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
                                    <tr>
                                        <td><el-checkbox></el-checkbox></td>
                                        <td v-text="orderInfo.orderCode"></td>
                                        <td v-text="orderInfo.orderTitle"></td>
                                        <td v-text="orderInfo.componentSize"></td>
                                        <td v-text="orderInfo.sampleSize"></td>
                                        <td v-text="orderInfo.sampleRate"></td>
                                        <td v-text="orderInfo.checkUserName"></td>
                                        <td v-text="orderInfo.checkDate_"></td>
                                        <td v-text="orderInfo.orderUserName"></td>
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
                                <label class="huoweilabel">货位选择</label>
                                <el-select v-model="huoweiselect">
                                    <el-option value="1">123</el-option>
                                    <el-option value="2">233</el-option>
                                    <el-option value="3">345</el-option>
                                </el-select>
                            </div>
                            <div class="quanxuan">
                                <el-checkbox>全选</el-checkbox>
                                <button class="btn">签收订单</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <th></th>
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
                                        <td><el-checkbox></el-checkbox></td>
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.warehouseName"></td>
                                        <td v-text="item.currentStep"></td>
                                        <td v-text="item.receiptUserName"></td>
                                        <td v-text="item.checkDate_"></td>
                                        <td>
                                            <span class="editIcon" @click="viewDeatil(index)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="tableinfo">
                                <label class="checkqz">检查群组：</label><span class="checktext">{{orderInfo.checkUgName}}</span>
                                <label class="checkpeo">检查人：</label><span class="checktext">{{orderInfo.checkUserName}}</span>
                                <label class="checktime">签收时间：</label><span class="checktext">{{orderInfo.checkDate_}}</span>
                            </div>
                        </div>
                        <div class="borderbottom1 huowei">
                            <div class="huoweileft">货位选择：</div>
                            <div class="huoweiright">
                                <div class="huiweirighttitle">
                                    选择堆场
                                </div>
                                <ul class="huiweirightimg">
                                    <li>1</li>
                                    <li>2</li>
                                    <li>3</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
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

        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.getUserGroup();
    },
    methods:{
        handleClick(){

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
                        this.planData = response.data.rt.rows;
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
                        this.noPlanData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        selectItem(item){
            console.log(item)
            this.showDetail = false;
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
                    if(this.orderInfo.checkDate!=null){
                        Object.assign(this.orderInfo,{
                            checkDate_:new Date(this.orderInfo.checkDate).toLocaleString()
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
                        this.orderDeatilData.forEach((item)=>{
                            if(item.receiptDate!=null){
                                Object.assign(item,{
                                    checkDate_:new Date(item.receiptDate).toLocaleString()
                                })
                            }
                        })
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
        height: calc(100vh - 165px);
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
        .scrolldiv{
            overflow-y:scroll;
            height: calc(100vh - 226px); 
            // margin-bottom: 20px;
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
                    width: 150px;
                    height: 108px;
                    float: left;
                    margin-left: 20px;
                    border: 1px solid #e6e6e6;
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
}
</style>

