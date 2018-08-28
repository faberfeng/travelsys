<template>
    <div id="wuliao">
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
                    <el-tab-pane :label="'有计划'" name="first">
                        <div class="leftcontent">
                            <ul class="leftcontentul">
                                <li class="lefttitle">
                                    <label class="lefttitlelab">订单号</label>
                                    <span class="lefttitlespan">订单名称</span>
                                </li>
                                <li class="lefttitlecontent" v-for="(item,index) in planData" :key="index" @click="selectItem(item)">
                                    <label class="lefttitlelab">{{item.planName.split(' ')[0]}}</label>
                                    <span class="lefttitlespan lefttitlespanone">{{item.planName.split(' ')[1]+item.planName.split(' ')[2]}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="无计划" name="second">
                        <div class="leftcontent">
                            <ul class="leftcontentul">
                                <li class="lefttitle">
                                    <label class="lefttitlelab">订单号</label>
                                    <span class="lefttitlespan">订单名称</span>
                                </li>
                                <li class="lefttitlecontent" v-for="(item,index) in noPlanData" :key="index">
                                    <label class="lefttitlelab">{{item.orderCode}}</label>
                                    <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="模板" name="third">
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
                    <div class="jindujihua">
                        <label class="jindujihuatext">计划进度-计划环节: 厂家发货</label>
                        <button class="jiadubutton">链接任务</button>
                    </div>
                    <div class="jihuabody">
                        <ul class="jihuabodyul">
                            <li class="li1">
                                <p class="ptitle">启动</p>
                                <span class="spantitle">{{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.day1}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li2">
                                <p class="ptitle">订货下单</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.day2}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li3">
                                <p class="ptitle">厂家发货</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.day3}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li4">
                                <p class="ptitle">抽样检查</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.day4}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li5">
                                <p class="ptitle">到场签收</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="jindujihua">
                        <label class="jindujihuatext">实际进度-实际环节: 厂家发货</label>
                        <span class="jiadutext">{{planInfo.result}}</span>
                    </div>
                    <div class="jihuabody">
                        <ul class="jihuabodyul">
                            <li class="li1" style="visibility:hidden">
                                <p class="ptitle">启动</p>
                                <span class="spantitle">{{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="li2" style="margin-left:30px">
                                <p class="ptitle">订货下单</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.realDay0}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li3">
                                <p class="ptitle">厂家发货</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.realDay1}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li4">
                                <p class="ptitle">抽样检查</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
                            </li>
                            <li class="limiddle">
                                <p class="limiddletext">{{planInfo.realDay2}}</p>
                                <i class="limiddelimg1"></i>
                                <i class="limiddelimg2"></i>
                            </li>
                            <li class="li5">
                                <p class="ptitle">到场签收</p>
                                <span class="spantitle">开始 {{planInfo.orderCreateDate}}</span>
                                <span class="spantitle">完成 {{planInfo.orderCreateDate}}</span>
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
                                    <td v-text="item.sendRecordUserName"></td>
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
                        this.noPlanData = response.data.rt.rows;
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
                    }
                }else{
                    alert(reponse.data.msg);
                }
            })
        },
        selectItem(item){
            console.log(item)
            this.showDetail = false;
            this.itemTitle = item.planName;
            this.getOrderDetail(item.id,item.orderId,item.plantemplateId);
            this.getPlanInfo(item.id)

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
                    console.log(response.data);
                    if(response.data.rt != null){
                        this.orderDeatilData = response.data.rt.rows;
                    }
                }else{
                    alert(response.data.msg);
                }
            })
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
                    console.log(response.data);
                    if(response.data.rt != null){
                        this.planInfo = response.data.rt;
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
    top: 116px;
    position: fixed;
    left: 26px;
    width: 100%;
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
        .el-tabs__header{
            height: 40px;  
        }
        .el-tabs__nav{
            height: 40px;
            //width: 350px;
            line-height: 40px;
        }
        // .el-tabs__item{
        //     width: 90px;
        //     font-size: 14px;
        //     color: #999;
        //     padding: 0;
        // }
        // .is-active{
        //     color: #fc3439;
        // }
        // .el-tabs__active-bar{
        //     width: 90px!important;
        // }
        // .el-tabs__active-bar{
        //     left: 40px
        // }
        // #tab-first{
        //     margin-left: 40px;
        // }
        // #tab-second{
        //     margin-left: 0px;
        // }
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
                        font-size: 12px;
                        margin: 0;
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
                        top: -37px;
                        left: 25px;
                    }
                }
                .li1{
                    width: 88px;
                    height: 84px;
                    margin-left: 30px;
                }
                .li1,.li2{
                    border: 1.5px solid #fc3439;
                }
                .li2,.li3,.li4,.li5{
                    // margin-left: 30px;
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
            margin: 0 30px 0 35px;
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
</style>

