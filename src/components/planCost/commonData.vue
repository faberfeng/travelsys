<template>
<div id="CommenDataPage" v-loading.fullscreen.lock="fullscreenLoading">
     <form id="print-exportToExcel" action="1111" method="post" enctype="multipart/form-data" target="printLabel">
        <input type="hidden" name="projId" :value="projId">
        <input type="hidden" name="relaType" value="report">
        <input type="hidden" name="relaId" :value="rcId">
    </form>
    <div class="project" v-loading="loading">
        <p class="antsLine">
            成本管理<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">构件量清单</span><i class="icon-sanjiao-right"></i>
            <span class="strong">{{'数据-'+dataName}}</span>
        </p>
        <p class="header clearfix"  style="margin-top:20px;">
            <span class="left_header">
                <i class="detial icon"></i>明细基本信息
            </span>
             <span class="item-btn clearfix">
                <label class="item-btn-icon icon-0"  v-if="isbaobiao" @click="editReport()">设计</label>
                <label class="item-btn-icon icon-1"  v-if="isbaobiao" @click="showSnapshotBox()">快照</label>
                <label class="item-btn-icon icon-2" @click="exportToExcel()">导出EXCEL</label>
                <label class="item-btn-icon icon-3" @click="exportToExcel(true)">导出XML</label>
            </span>
        </p>
        <table :class="['UserList',rcStyle.tableBorderWidth == '0'?'noBorder':'']" border="1"  :style="{'width':rcStyle.tableWidth+'px'}">
            <thead :style="{'backgroundColor':rcStyle.tableTitleBgColor,'textAlign':rcStyle.titleAlign,'lineHeight':rcStyle.titleBorderHeight+'px','height':rcStyle.titleBorderHeight+'px'}">
                <tr v-show="rcStyle.showTitle != 0" :class="['userList-thead',rcStyle.tableBorderWidth == '0'?'noBorder':'']"  :style="{'backgroundColor':rcStyle.titleBgColor,'fontSize':rcStyle.titleFontSize+'px'}">
                    <th rowspan="1" :colspan="4+detailsHead.length-totalTitleNum" v-text="rcStyle.titleName"></th>
                </tr>
                <tr  class="userList-thead" style="font-size:14px;">
                    <!-- <th style="width:100px;" v-if="groupHead.monomer.length>0"></th>
                    <th style="width:100px;" v-if="groupHead.partition.length>0"></th>
                    <th style="width:100px;" v-if="groupHead.floor.length>0"></th> -->
                    <th v-for="(item,index) in detailsHead" :key="index+'_table'" v-text="item"></th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody :style="{'fontSize':rcStyle.tableFontSize+'px','textAlign':rcStyle.tableAlign}">
                <tr v-for="(val,index) in DatatableList" :key="index">
                    <td colspan="1" :style="{'backgroundColor':rcStyle.tableGroupBgColor}" v-if="index == 0" :rowspan="item.length" v-for="(item,key) in groupHead.monomer" :key="'monomer'+key">{{item.infoList[0]}}</td>
                    <td colspan="1" :style="{'backgroundColor':rcStyle.tableGroupBgColor}" v-if="index == 0" :rowspan="item.length" v-for="(item,key) in groupHead.partition" :key="'partition'+key">{{item.infoList[0]}}</td>
                    <td colspan="1" :style="{'backgroundColor':rcStyle.tableGroupBgColor}" v-if="index == 0" :rowspan="item.length" v-for="(item,key) in groupHead.floor" :key="'floor'+key">{{item.infoList[0]}}</td>
                    <td style="border-right:none;border-left: none;font-weight: bold;" v-for="(val_2,index_2) in val.level" :key="'kongge'+index_2" v-text="index_2==0?'小计':''"></td>
                    <td v-for="(val_1,index_1) in val.list" :key="index_1" v-text="val_1" ></td>
                    <td >
                        <button  class="locationBtn actionBtn" title="定位" @click="openLocation"></button>
                    </td>
                </tr>
                <tr :style="{'backgroundColor':rcStyle.tableTitleBgColor}" v-if="sumary_all">
                    <td :colspan="Footer.num" rowspan="1" style="font-weight: bold;">总计</td>
                    <td :colspan="Footer.info.length">{{sumary_all}}</td>
                </tr>
            </tbody>
        </table>
    </div>
      <div v-if="showSnapshot"  id="edit" class="dialog">
        <div class="el-dialog__header">
            <span class="el-dialog__title">添加报表快照</span>
            <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="cancelSnapshot">
                <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
        </div>
        <div class="el-dialog__body">
             <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">快照名称 :</label>
                    <input type="text" class="inp" v-model="snapShotName">
                </div>
             </div>
        </div>
        <div class="el-dialog__footer">
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addSnapshot">确定</button>
                <button class="editBtnC" @click="cancelSnapshot">取消</button>
            </div>
        </div>
    </div>
    <div id="mask" v-if="showSnapshot" ></div>
</div>       
</template>
<style  lang='less'>
  .navigation{
        z-index: 0!important;
    }
    #CommenDataPage{
        margin: 5px 20px!important;
       *{
           box-sizing: border-box;
       }
       .clearfix{
           clear: both;
           overflow: hidden;
           content: '';
       }
       #print-exportToExcel{
           display: none;
       }
        .dialog{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            .el-dialog__body{
                margin-top: 20px;
            }
            .editBody{
                margin: 0 20px;
                .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
                    margin: 0 5px;
                }
            }
            .item-attibuteAuth{
                float: left;
                width: 33.3%;
                padding-left: 78px;
                height: 14px;
                line-height: 14px;
                margin-bottom: 26px;
                text-align: left;
                .text{
                    font-size: 14px;
                    color: #666666;
                    margin-left: 10px;
                 }
                .checkbox-fileItem{
                    float: left;
                    position: relative;
                    padding-left:20px; 
                    cursor: pointer;
                    &::before{
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 12px;
                        height: 12px;
                        border: 1px solid #cccccc;
                        cursor: pointer;
                        background: #fff;
                        content: '';
                    }
                }
                .active{
                     &::before{
                        background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                        border: 1px solid #fc3439;
                     }
                }
                .checkbox-arr{
                    display: none;
                }
            }
        }
        #mask{
            z-index: 3000;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
        }
       .project{
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
         
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                margin: 20px;
                margin-left: 0;
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
                        // text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
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
                            // text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
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
                            height: 16px;
                            border: none;
                            cursor: pointer;
                            margin-right: 16px;
                        }
                        .locationBtn{
                            background: url('./images/location.png') no-repeat;
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
            .noBorder{
                border: none!important;
                th,td{
                      border: none!important;
                }
            }
            .textCenter{
                text-align: center!important;
                th,td{
                       text-align: center!important;
                }
            }
            .header{
                text-align: left;
                margin: 15px 0;
                border-bottom: 1px solid #e6e6e6;
                padding-bottom: 9px;
                .left_header{
                    font-size: 16px;
                    line-height: 16px;
                    color: #fc3439;
                    font-weight: bold;
                    padding-left:30px;
                    position: relative;
                    .list_{
                        background: url('./images/list_.png')no-repeat 0 0;
                    } 
                    .detial{
                        background: url('./images/detial.png')no-repeat 0 0;
                    } 
                    .icon{
                        display: block;
                        width: 20px;
                        height: 17px;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                }
                .right_header{
                    text-decoration: none;
                    float: right;
                    font-size: 14px;
                    color: #336699;
                    line-height: 14px;
                    margin-top:4px; 
                }
                .right-expend{
                    position: relative;
                    transition: all ease .5s;
                    &::after{
                        display: block;
                        position: absolute;
                        top: 1px;
                        left: -20px;
                        width: 12px;
                        height: 12px;
                        background: url('./images/expand.png') no-repeat 0 0;
                        content: '';
                    }
                }
                .right-pack-up{
                    transition: all ease .5s;
                    &::after{
                        transform: rotateZ(180deg);
                    }
                }
            }
            .title-list{
                font-size: 14px;
                line-height: 14px;
                color: #999999;
            }
            .item-btn{
                float: right;
                label{
                    float:left;
                    width:auto;
                    height:16px;
                    padding-left:30px; 
                    margin-left: 20px;
                    text-align:center;
                    line-height:16px;
                    font-size:14px;
                    color:#666666;
                    cursor: pointer;
                }
                .item-btn-icon{
                    position: relative;
                    &::after{
                        display: block;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 16px;
                        height: 16px;
                        background-size:100%; 
                        background-repeat:no-repeat; 
                        content: '';
                    }
                } 
                .icon-0{
                        &::after{
                         background-image: url('./images/design.png');
                        }
                }
                    .icon-1{
                        &::after{
                        background-image: url('./images/photo.png');
                        }
                }
                    .icon-2{
                        &::after{
                        background-image: url('./images/export1.png');
                        }
                }
                    .icon-3{
                        &::after{
                        background-image: url('./images/export2.png');
                        }
                }
            }
            .detialInfoTable{
                border-color: #e0e0e0;  
                thead{
                    tr{
                        th{
                            height: 50px;
                            padding-left: 10px;
                            background: #f2f2f2;
                            font-size: 14px;
                            color: #666666;
                            text-align: left;
                            font-weight: normal;
                            border-color: #e0e0e0; 
                        }
                    }
                }
                    tbody{
                    tr{
                        td{
                            height: 50px;
                            padding-left: 10px;
                            background: #ffffff;
                            font-size: 14px;
                            color: #333333;
                            text-align: left;
                            font-weight: normal;
                            border-color: #e0e0e0; 
                            
                        }
                        &:nth-of-type(2n){
                                td{
                                background: #fafafa;
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
        }
    }
</style>
<script>
import Vue from 'vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'

export default Vue.component('common-list',{
    props:['rcId','isSnapshot','isbaobiao'],
    data(){
        return {
            token:'',
            entId:'',//公司ID
            projId:'',
            projName:'',
            projAuth:[],
            userId:'',
            UPID:'',
            defaultSubProjId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            /*以下为后期添加数据*/
            fullscreenLoading:false,
            loading:false,
            pageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageLabelList:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            checkedItem:{},
            fullscreenloading:false,
            ManifestInfo:{},//清单基本信息
            detailsHead:[],
            groupHead:{
                monomer:[],//单体
                partition:[],//分区
                floor:[]//楼层
            },
            DatatableList:[],//明细基本信息
            Footer:{
                num:0,
                info:{}
            },
            showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            dataName:'',//数据列表名称
            showSnapshot:false,
            snapShotName:'',
            relaId:'',//关系ID
            rcStyle:{},
            totalTitleNum:0,
            sumary_all:'',
        }
    },
    created(){
            var vm = this
            vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
            vm.token = localStorage.getItem('token')
            vm.projId = localStorage.getItem('projId')
            vm.userId = localStorage.getItem('userid')
            vm.entId = localStorage.getItem('entId')
            vm.projName = localStorage.getItem('projName')
            vm.projAuth = localStorage.getItem('projAuth')
            vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
            vm.UPID = vm.$store.state.UPID
            vm.BDMSUrl = vm.$store.state.BDMSUrl
            vm.getIntoList();
    }, 
    mounted(){
        var vm = this
        //   const table1 = new tableResizable('test');
    },
    computed:{
        checkEditAuth: function () {
            // `this` 指向 vm 实例
                return this.projAuth.indexOf("01200303")>0
            }
    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.findManifestDetailList()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.findManifestDetailList()
        },
    },
    methods:{
        editReport(){
            var vm = this
            vm.$emit('toedit')
        },
        exportToExcel(val){
            var vm = this
            if(val){
                var printUrl = vm.BDMSUrl + 'project2/report/export/xml?token='+vm.token
            }else{
                var printUrl = vm.BDMSUrl + 'project2/report/export?token='+vm.token
            }
            $('#print-exportToExcel')[0].action = printUrl
            $('#print-exportToExcel').on('submit', function(event){
                // event.preventDefault() //阻止form表单默认提交
            })
            $('#print-exportToExcel').submit()
        },
        showSnapshotBox(){
            var vm = this
            vm.showSnapshot =true
        },
        cancelSnapshot(){
            var vm = this
            vm.showSnapshot = false
            vm.snapShotName = ''
        },
        addSnapshot(){
            var vm = this
            vm.fullscreenLoading =true
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/'+vm.projId+'/'+vm.rcId+'/snapshot/add',
                headers:{
                    token:vm.token
                },
                params:{
                    rssName:vm.snapShotName
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'快照添加成功!'
                    })
                    vm.cancelSnapshot()
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenLoading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        openLocation(){
            var vm  = this
            vm.$message({
                type:'info',
                message:'虚拟场景面板未打开，请打开左侧虚拟场景面板。'
            })
        },
        testIfIsNull(row, column, cellValue, index){
            if(cellValue == null)return '/'
            return cellValue
        },
        back(){
            var vm = this
            vm.$emit('back')
        },
        previewSnapshot(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/'+vm.rcId+'/content',
                headers:{
                    token:vm.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        getIntoList(){
            var vm = this;
            vm.fullscreenLoading =true;
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/'+vm.rcId+'/count',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                console.log(response.data);
                if(response.data.cd == 0){
                    vm.rcStyle = response.data.rt.rcStyle
                    vm.dataName = response.data.rt.reportName
                    vm.DatatableList = [];
                    vm.detailsHead = [];
                    vm.groupHead.monomer = [];
                    vm.groupHead.partition = [];
                    vm.groupHead.floor = [];
                    let titleLength = 0;
                    if(response.data.rt.rowList != null){
                        var rowLenth = response.data.rt.rowList.length;
                        var monomer_summary = [],
                        partition_summary = [],
                        floor_summary = [];
                        response.data.rt.rowList.forEach((element,index)=>{
                            if(element.rowType == 'ROW_TITLE'){
                                vm.detailsHead = element.infoList;
                                titleLength = element.infoList.length;
                            }else if(element.rowType == 'ROW_GROUP'){
                                var ROW_GROUP_length = vm.findChild(element.id,response.data.rt.rowList);
                                    element.length = ROW_GROUP_length
                                if(element.groupLevel == 1){//单体
                                    vm.groupHead.monomer.push(element)
                                }else if(element.groupLevel == 2){//分区
                                    vm.groupHead.partition.push(element)
                                }else if(element.groupLevel == 3){//楼层
                                    vm.groupHead.floor.push(element)
                                }
                            }else if(element.rowType == 'ROW_CONTENT'){ 
                                let itemIndex;
                                this.detailsHead.forEach((item,index)=>{
                                    if(item == '所在空间'){
                                        itemIndex = index;
                                    }
                                })
                                if(element.infoList[2]!='' && itemIndex!= undefined){
                                    element.infoList[itemIndex] = element.infoList[2];
                                }else if(element.infoList[1]!=''&& itemIndex!= undefined){
                                    element.infoList[itemIndex] = element.infoList[1];
                                }else if(element.infoList[0]!='' && itemIndex!= undefined){
                                    element.infoList[itemIndex] = element.infoList[0];
                                }
                                vm.DatatableList.push({
                                    'list':element.infoList,
                                    'level':element.groupLevel
                                });                                
                            }else if(element.rowType == 'ROW_SUMMARY'){
                                
                                if(element.count != null){
                                    this.sumary_all = element.count;
                                    
                                }
                                console.log(this.sumary_all)
                                if(element.groupLevel == 1){//单体 的 小计
                                    monomer_summary.push(element);
                                }else if(element.groupLevel == 2){//分区 的 小计
                                    partition_summary.push(element)
                                }else if(element.groupLevel == 3){//楼层 的 小计
                                    floor_summary.push(element);
                                }else if(element.groupLevel == 0){ //总计
                                    var totalFooterNum = 1;
                                    if(vm.groupHead.floor.length>0){
                                        totalFooterNum++;
                                        this.totalTitleNum++;
                                    }
                                    if(vm.groupHead.partition.length>0){
                                        totalFooterNum++;
                                        this.totalTitleNum++;
                                    }
                                    if(vm.groupHead.monomer.length>0){
                                        totalFooterNum++;
                                        this.totalTitleNum++;
                                    }
                                    vm.Footer.num = totalFooterNum;
                                    vm.Footer.info = element.infoList;
                                }
                            }
                        })
                        vm.DatatableList.forEach((item,index)=>{
                            item.list.splice(titleLength,item.list.length-titleLength);    
                        })
                        /**
                         * 查看各个小计数组，
                         * 确定插入总列表的方式
                         * 并对层级做标记
                        * ***/
                        if(floor_summary.length>0)vm.appendSummary(floor_summary,response.data.rt.rowList);
                        if(partition_summary.length>0)vm.appendSummary(partition_summary,response.data.rt.rowList);
                        if(monomer_summary.length>0)vm.appendSummary(monomer_summary,response.data.rt.rowList);
                    }
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fullscreenLoading =false
            }).catch((err)=>{
                console.log(err)
            })
        },
        /**
         * 查看各个小计数组，
         * 确定插入总列表的方式
         * 并对层级做标记
         * ***/
        appendSummary(obj,allObj){
            var vm = this
            var length = 0
            obj.forEach((ele,index)=>{
                length += vm.findChild(ele.parentId,allObj,0)
                vm.DatatableList.splice(length,0,{
                    'list':ele.infoList,
                    'level':vm.handelLevel(ele.groupLevel)
                })
                length++
            })      
        },
        handelLevel(level){
            switch(level){
                case 1:
                return 3;
                case 2:
                return 2; 
                case 3:
                return 1; 
            }
        },
        /***
         * @param id 父节点的id
         * @param obj 查询的数组
         * @returns length 
         * 
         * ****/
        findChild(id,obj,length=0){
            var vm = this
            if(obj.length == 0)return 0
            obj.forEach(ele=>{
                if(ele.parentId && ele.parentId == id){
                    if(ele.rowType == 'ROW_CONTENT' || ele.rowType == 'ROW_SUMMARY'){
                        length++
                    }else{
                        length += vm.findChild(ele.id,obj,length)
                    }
                }
            })
            return length
        },
        parseInfo(val){
            return JSON.stringify(val)
        },
        findManifestDetailList(isDialog=0){
                var vm = this
                //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
                /**
                 * @augments isDialog 判断是否是弹框
                 *   pageLabelList:{
                        pagePerNum:10,//一页几份数据
                        currentPage:1,//初始查询页数 第一页
                        total:0,//所有数据
                    },
                * **/
                var showType = 1
                if(vm.showType == 'combine'){
                    showType = 2
                }
                if(isDialog == 1){
                    var page = vm.pageLabelList.currentPage
                    var rows = vm.pageLabelList.pagePerNum
                }else{
                    var page = vm.pageDetial.currentPage
                    var rows = vm.pageDetial.pagePerNum
                }
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'manifest2/findManifestDetailList',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        projectId:vm.projId,
                        manifestId:vm.mId,
                        page:page,
                        rows:rows,
                        showType:showType,//显示类型 1 逐个显示 2 合并显示
                        currentColumns:''
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        if(response.data.rt != null){
                            vm.pageLabelList.total = response.data.rt.total
                            vm.pageDetial.total = response.data.rt.total
                            if(isDialog == 1){
                                if(response.data.rt.rows != null){
                                    vm.S_Label_quantitiesList = response.data.rt.rows
                                }else{
                                    vm.S_Label_quantitiesList = []
                                }
                            }else if(isDialog == 0){
                                if(response.data.rt.rows != null){
                                    vm.S_quantitiesList = response.data.rt.rows
                                    vm.S_quantitiesList.forEach((element,index) => {
                                        vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                        vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                                    });
                                }else{
                                    vm.S_quantitiesList = []
                                }
                            }else if(isDialog == 2){
                                if(response.data.rt.rows != null){
                                    vm.S_Label_quantitiesList = response.data.rt.rows
                                    vm.S_quantitiesList = response.data.rt.rows
                                    vm.S_quantitiesList.forEach((element,index) => {
                                        vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                        vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                                    });
                                }else{
                                    vm.S_Label_quantitiesList = []
                                    vm.S_quantitiesList = []
                                }
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
        changePage(val){//分页 0 -1 1 2
                var vm = this; 
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
        },
        // 补零
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
        },
        /**
             * 解析清单生成来源
        */
        parseMGSource(mGSource){
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
        parseMStatus(mStatus) {
            // 施工现场
            if(!mStatus)return false
            var constructionSite = mStatus.substring(0, 1);
            switch (constructionSite) {
                case '8':
                    return '终审驳回';
                case '7':
                    return '终审通过';
                case '6':
                    return '终审补充';
                case '5':
                    return '等待终审';
                case '4':
                    return '初审驳回';
                case '3':
                    return '初审通过';
                case '2':
                    return '初审补充';
                case '1':
                    return '等待初审';
                default:
                    break;
            }
            // 进度计划
            var scheduledPlan = mStatus.substring(1, 2);
            switch (scheduledPlan) {
                case '3':
                    return '已完工';
                case '2':
                    return '已开工';
                case '1':
                    return '已计划';
                default:
                    break;
            }
            // 物资采购
            var materialPurchasing = mStatus.substring(2, 3);
            switch (materialPurchasing) {
                case '9':
                    return '已签收';
                case '8':
                    return '已抽检';
                case '7':
                    return '已到场';
                case '6':
                    return '已发货';
                case '5':
                    return '已待发';
                case '4':
                    return '生产中';
                case '3':
                    return '已订货';
                case '2':
                    return '已选型';
                case '1':
                    return '待选型';
                default:
                    break;
            }
            
            // 成本管理
            var costControl = mStatus.substring(3, 4);
            switch (costControl) {
                case '6':
                    return '物料量核对完成';
                case '5':
                    return '物料量核对中';
                case '4':
                    return '工程量核对完成';
                case '3':
                    return '工程量核对中';
                case '2':
                    return '构件量核对完成';
                case '1':
                    return '构件量核对中';
                default:
                    break;
            }
            // 设计协调
            var designManage = mStatus.substring(4, 6);
            switch (designManage) {
                case 'A0':
                    return '施工图深化设计';
                case '70':
                    return '施工图设计';
                case '40':
                    return '初步设计';
                case '10':
                    return '方案设计';
                case '00':
                    return '未定义';
                default:
                    return '未定义';
            }
        },
        trim(str){ 
        /**去掉字符串前后所有空格*/
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
        },
        initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
    }
})
</script>
