<template>
    <div  id="inventory" v-loading.fullscreen="fullscreenloading">
        <div class="topHeader" >
            <div id="item-box-file">
                <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item ">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item label-item-active">  
                    物料量清单  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本审批  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本分析  
                </router-link>
            </div>
            <div class="project" v-if="!showCommonList" v-loading="loading">
                <!--以下是实时列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="target icon"></i>可追溯物料量清单
                        </span>
                        <a class="right" href="javascript:void(0)">+新增</a>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单ID</th>
                                <th>清单名称</th>
                                <th>类型编码条目</th>
                                <th>构件总数</th>
                                <th>已出物料量</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  S_quantitiesList" :key="index">
                                <td v-text="(pageDetial.pagePerNum*(pageDetial.currentPage-1))+index+1"></td>
                                <td v-text="val.id"></td>
                                <td v-text="val.detailName"></td>
                                <td v-text="val.itemsCount"></td>
                                <td v-text="val.componentCount"></td>
                                <td v-text="val.hasOut"></td>
                                <td v-text="val.totalPrice"></td>  
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createDate)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="edit(val)" ></button>
                                    <button class="listBtn actionBtn" title="清单"  @click="showlist(val)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.id,val.relaId,true)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无实时报表
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" S_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                        <option value="5">5</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </select>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,true)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,true)"></a>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-left:5px;">第</span>
                                </td>
                                <td>
                                        <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial.total/pageDetial.pagePerNum)}}页</span>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,true)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,true)"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
                <!--以下是快照列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="reportS icon"></i>独立物料量清单
                        </span>
                        <a class="right" href="javascript:void(0)">导入</a>
                    </p>
                   
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单ID</th>
                                <th>清单名称</th>
                                <th>物料量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  D_quantitiesList" :key="index">
                                <td v-text="(pageDetial_1.pagePerNum*(pageDetial_1.currentPage-1))+index+1"></td>
                                <td v-text="val.id"></td>
                                <td v-text="val.detailName"></td>
                                <td v-text="val.hasOut"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createDate)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="edit(val)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.id,0)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" D_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无快照报表
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" D_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial_1.pagePerNum">
                                        <option value="5">5</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </select>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1)"></a>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-left:5px;">第</span>
                                </td>
                                <td>
                                        <input class="pagination-num" type="text" v-model="pageDetial_1.currentPage">
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial_1.total/pageDetial_1.pagePerNum)}}页</span>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2)"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial_1.pagePerNum+',共'+pageDetial_1.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
            </div>
             <common-list v-on:back="backToH" :mId="checkItem.id" v-else></common-list>
        </div>
        <div id="edit">
            <el-dialog title="请选择需要出量的单体或场地" :visible="createMonomer.show" @close="createCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">单体或场地 :</label>
                        <span>
                             <el-select v-model="createMonomer.holderId" placeholder="请选择">
                                <el-option
                                :label="SitesList.name+'(场地)'"
                                :id="SitesList.id+'_id'"
                                 data-type="1"
                                 :data-name="SitesList.name"
                                :value="SitesList.id">
                                </el-option>
                                <el-option
                                    v-for="item in MonomerList"
                                    :key="item.value"
                                    :id="item.ID+'_id'"
                                    data-type="2"
                                     :data-name="item.Name"
                                    :label="item.Name+'(单体)'"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="createConfirm">确定</button>
                    <button class="editBtnC" @click="createCancle">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<style lang="less" >
    #inventory{
        .el-dialog{
            margin: 0 auto;
        }
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
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
                    overflow: hidden;
                    .singelOne{
                        float: left;
                        color: #999;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                    }
                }
        }
        .selectOption{
            position: relative;
            width: 212px;
            float: left;
            select{
                height: 28px;
                width: 212px;
                border-radius: 28px;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 10px;
                border: 1px solid #ccc;
            }
            .icon-sanjiaoone{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image:url('../ManageDesign/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 13px;
                left: 180px;
            }
        }
         .project{
             margin: 0 20px;
            .header{
                border-bottom: 2px solid #e6e6e6;
                margin: 20px 0;
                padding-bottom: 10px;
                .left{
                    float: left;
                    font-size: 16px;
                    line-height: 16px;
                    color: #fc3439;
                    font-weight: bold;
                    .reportS{
                        background: url('./images/listS.png')no-repeat 0 0;
                    } 
                    .target{
                        background: url('./images/target.png')no-repeat 0 0;
                    } 
                    .icon{
                        display: inline-block;
                        width: 20px;
                        height: 16px;
                        margin-right: 10px;
                    }
                }
                .item-btn{
                    float: right;
                    label,.label-item{
                        float:left;
                        width:auto;
                        height:26px;
                        padding: 0 9px;
                        border-top: 1px solid #e6e6e6;
                        border-bottom: 1px solid #e6e6e6;
                        text-align:center;
                        line-height:24px;
                        font-size:12px;
                        color:#666666;
                        cursor: pointer;
                        border-left: 1px solid #e6e6e6;
                        &:first-of-type{
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                        }
                        &:last-of-type{
                        border-right: 1px solid #e6e6e6;
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                        }
                    }
                    .label-item{
                            border-right: none!important;
                    }
                }
                .right{
                    text-decoration: none;
                    float: right;
                    font-size: 14px;
                    color: #336699;
                    line-height: 14px;
                    margin-top:4px; 
                }
            }
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                .checkbox-att{
                    display:none;
                }
                .checkbox-fileItem{
                    float: left;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                    position: relative;
                    margin-left:4px;
                }
                .active{
                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
                }
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 6px;
                        padding-right: 15px;
                        height: 55px;
                        text-align: left;
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
                            height: 55px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            .location{
                                display: block;
                                width: 12px;
                                height: 16px;
                                background: url('../ManageCost/images/location.png')no-repeat 0 0;
                                cursor: pointer;
                            }
                        }
                        .Strong{
                            font-weight: bold;
                        }
                        .actionBtn{
                            width: 16px;
                            height: 17px;
                            border: none;
                            cursor: pointer;
                            margin-right: 10px;
                        }
                        .editBtn{
                            background: url('../../assets/edit.png') no-repeat;
                        }
                        .deleteBtn{
                            background: url('../../assets/delete.png') no-repeat;
                        }
                        .dataBtn{
                            background: url('./images/data.png') no-repeat;
                        }
                        .listBtn{
                            background: url('./images/list.png') no-repeat;
                        }
                        .detailBtn{
                              background: url('./images/details.png') no-repeat;
                        }
                         .refreshBtn{
                              background: url('./images/refresh.png') no-repeat;
                        }
                    }
                    .activeTr{
                        background: #0081c2;
                        td{
                            color: #fff!important;
                        }
                    }
                }
            }
        }
        /**********一下是分页器的样式***************/
        .datagrid-pager {
            display: block;
            height: 31px;
            width: auto;
            border:1px solid #d4d4d4;
            // padding: 3px 4px;
            box-sizing: border-box;
            background: #f5f5f5;
        }
        .pagination{
            border-top: none;
        }
        .pagination table {
            float: left;
            height: 30px;
            th, td {
                min-width: 5px;
                padding: 0px;
                margin: 0px;
            }
        }
        .pagination-page-list {
            margin: 0px 6px;
            padding: 1px 2px;
            width: 43px;
            height: auto;
            border-width: 1px;
            border-style: solid;
        }
        .pagination .pagination-num {
            border-color: #D4D4D4;
            margin: 0 2px;
            width: 30px;
        }
        .pagination-btn-separator {
            float: left;
            height: 24px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #fff;
            margin: 3px 1px;
        }
        .btn-TAB{
            display: block;
            width:26px;
            height: 26px;
            cursor: pointer;
            position: relative;
            &:hover{
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                border-radius: 5px;
            }
            &::after{
                display: block;
                position: absolute;
                content: '';
                width: 10px;
                height: 10px;
                background-size: 100% 100%; 
                top: 8px;
                left: 8px;
            }
        }
        .btn-left0::after{
            background-image: url('../../assets/fenye2.png');
        }
        .btn-left1::after{
            background-image: url('../../assets/fenye1.png');
        }
        .btn-right0::after{
            background-image: url('../../assets/fenye4.png');
        }
        .btn-right1::after{
            background-image: url('../../assets/fenye3.png');
        }
        .btn-refresh::after{
            background-image: url('../../assets/fenye5.png');
        }
        .pagination-title{
            font-size: 14px;
            color: #333333;
        }
        .pagination-info{
            float: right;
            margin-top: 5px;
            margin-right: 25px;
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    }
</style>
<script>
import axios from 'axios';
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import commonList from  './qingDan.vue'
export default {
  name:'DesignVersion',
  components:{commonList},
  data(){
        return{
            token:'',
            projId:'',
            BDMSUrl:'',
            loading:false,
            fullscreenloading:false,
            S_quantitiesList:[],//构件的实时报表
             D_quantitiesList:[],//快照报表
            pageDetial:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageDetial_1:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            createMonomer:{
                show:false,
                holderId:'',
            },
            SitesList:{},//场地选项
            MonomerList:[],//单体选选项
            showCommonList:false,
            checkItem:{},
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getinventoryDetail()
    },
    watch:{
      'pageDetial.currentPage':function(val,oldval){
          var vm = this
          vm.getSnapWorkAmountList()
      },
      'pageDetial.pagePerNum':function(val,oldval){
          var vm = this
          vm.getSnapWorkAmountList()
      },
       'pageDetial_1.currentPage':function(val,oldval){
          var vm = this
          vm.getSingleWorkAmountList()
      },
      'pageDetial_1.pagePerNum':function(val,oldval){
          var vm = this
          vm.getSingleWorkAmountList()
      },
    },
    methods:{
        backToH(){
            var vm = this
            vm.showCommonList = false
        },
        showlist(val){
            var vm = this
            vm.showCommonList = true
            vm.checkItem = val
        },
        createConfirm(){
            var vm = this
            if(vm.createMonomer.holderId == ''){
                vm.$message({
                    type:'warning',
                    message:'请选择一个场地或单体!'
                })
                return false
            }else{
                console.log($('#'+vm.createMonomer.holderId+'_id'))
                var buildName = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.name
                var cType = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.type
            }
            vm.fullscreenloading =true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/generateBuildWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    holderId:vm.createMonomer.holderId,
                    buildName:buildName,
                    cType:cType,//1：场地； 2：单体
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.getSnapWorkAmountList()
                    vm.createCancle()
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenloading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        generateBuildWorkAmount(){
            var vm = this
            vm.createMonomer.show = true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSiteInfo',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.SitesList = response.data.rt
                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/findSubProject/'+vm.projId,
                    headers:{
                        token:vm.token
                    },
                }).then(response=>{
                    if(response.data.cd == 0){
                         if(response.data.rt.rows    != null)vm.MonomerList = response.data.rt.rows
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        },
        createCancle(){
            var vm = this
            vm.createMonomer.show = false
            vm.createMonomer.holderId = ''
        },
        reCalculate(mid){
            var vm = this
            vm.fullscreenloading = true
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/reCalculateWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    mId:mid,
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){

                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/report/handleWorkAmountCore',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        mId:mid,
                        projId:vm.projId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        vm.getSnapWorkAmountList()
                        vm.fullscreenloading = false
                    }
                })
            })
        },
        deleteItem(mid,bid,istop){
            var vm = this
            vm.$confirm('您要删除当前所选物料量清单？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/report/deleteMaterialDetail',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        manifestId:mid,
                        bId:bid,
                    }
                }).then(response=>{
                    if(response.data.cd != '0'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        var msg = ''
                        if(istop){
                            msg = '删除可追溯的物料量清单成功！'
                            vm.getSnapWorkAmountList()
                        }else{
                             msg = '删除可独立的物料量清单成功!'
                            vm.getSingleWorkAmountList()
                        }
                        vm.$message({
                            type:'success',
                            message:msg
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //进入设计版本页面
        getinventoryDetail(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/materialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd != '0'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).then(()=>{
                vm.getSnapWorkAmountList()
                vm.getSingleWorkAmountList()
            })
        },
        //加载实时报表数据
        getSnapWorkAmountList(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/loadMaterialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial.currentPage,
                    pageSize:vm.pageDetial.pagePerNum,
                    type:1//1 加载可追溯物料量清单 2 加载独立的物料量清单
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm.S_quantitiesList = response.data.rt.rows
                        }else{
                            vm.S_quantitiesList = []
                        }
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
         //加载快照报表数据
        getSingleWorkAmountList(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/loadMaterialDetail',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial_1.currentPage,
                    pageSize:vm.pageDetial_1.pagePerNum,
                    type:2//1 加载可追溯物料量清单 2 加载独立的物料量清单
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial_1.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm.D_quantitiesList = response.data.rt.rows
                        }else{
                            vm.D_quantitiesList = []
                        }
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
          changePage(val,isTop){//分页 0 -1 1 2
                var vm = this; 
                if(isTop){
                    if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                        vm.$message('这已经是第一页!')
                        return false
                    }
                    if(vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
                        vm.$message('这已经是最后一页!')
                        return false
                    }
                    switch(val){
                        case 0:
                            vm.pageDetial.currentPage = 1
                            break;
                        case -1:
                            vm.pageDetial.currentPage--
                            break;
                        case 1:
                            vm.pageDetial.currentPage++
                            break;
                        case 2:
                            vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum)
                            break;
                    }
                }else{
                      if(vm.pageDetial_1.currentPage == 1 && (val == 0 || val == -1)){
                        vm.$message('这已经是第一页!')
                        return false
                        }
                        if(vm.pageDetial_1.currentPage >= Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum) && (val == 1 || val == 2)){
                            vm.$message('这已经是最后一页!')
                            return false
                        }
                        switch(val){
                            case 0:
                                vm.pageDetial_1.currentPage = 1
                                break;
                            case -1:
                                vm.pageDetial_1.currentPage--
                                break;
                            case 1:
                                vm.pageDetial_1.currentPage++
                                break;
                            case 2:
                                vm.pageDetial_1.currentPage = Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum)
                                break;
                        }
                }
        },
        initName(name){
            if(!name)return ''
            var tt = name.substring(name.indexOf("[") + 1, name.lastIndexOf("]"))
            return tt;
        },
         initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
    }
}
</script>




