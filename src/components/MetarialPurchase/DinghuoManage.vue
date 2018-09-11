
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
                        <el-tab-pane :label="'已订货'" name="first">
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
                        <el-tab-pane label="未订货" name="second">
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
                        请在左侧内选择订货单
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
                                        <th>操作</th>
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
                                        <td>
                                            <span v-if="item.itemId !=1" class="editIcon" @click="viewDeatil(item)" :title="'编辑'"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="jindu">
                            <i class="shebeiimg"></i>
                            <label class="titletext">设备主清单</label>
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
                                            <span class="biaoqianIcon " :title="'标签'" @click="tips(item)"></span>
                                            <span class="editdetail" :title="'编辑明细'" @click="viewDeatil(index)"></span>
                                            <span class="deleteIcon" :title="'删除'" @click="deleteItem(item)"></span>
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
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name:'DinghuoManage',
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
                        this.planData = response.data.rt.rows;
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
                        this.noPlanData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        selectItem(item){
            this.selectObject = item;
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
                        this.orderDeatilData.forEach((item)=>{
                            Object.assign(item,{
                                updateDateTime_:new Date(item.updateDateTime).toLocaleString()
                            })
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

    }
}
</script>
<style lang="less">
#wuliao{
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
        }
        .borderbottom{
            margin: 10px 30px 30px 20px;
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
}
</style>

