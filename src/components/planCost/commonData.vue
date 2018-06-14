<template>
<div id="CommenDataPage" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="project" v-loading="loading">
        <p class="antsLine">
            成本管理<i class="icon-sanjiao-right"></i><span class="strong" @click="back()">构件量清单</span><i class="icon-sanjiao-right"></i>
            xiangmu名称
        </p>
        <p class="header clearfix"  style="overflow: auto;margin-top:30px;">
            <span class="left_header">
                <i class="detial icon"></i>明细基本信息
            </span>
            <a :class="['right_header','right-expend',bottomExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeBottomExpend()" v-text="bottomExpend.title"></a>
        </p>
        <p  class="clearfix" style="margin: 7px 0 10px;text-align:left;">
            <span  class="title-list" v-text="'明细总数：'+pageDetial.total"></span>
            <span class="item-btn clearfix">
                <label class="item-btn-icon icon-0" @click="changeShowType(true)">逐个显示</label>
                <label class="item-btn-icon icon-1" @click="changeShowType(false)">合并显示</label>
                <label class="item-btn-icon icon-2" @click="showLabel()">全部标签</label>
                <label class="item-btn-icon icon-3" @click="showLabelHeader()">显示列</label>
            </span>
        </p>
    </div>
</div>       
</template>
<style  lang='less' >
    #CommenDataPage{
        margin: 5px 20px;
       *{
           margin: 0;
           padding: 0;
           box-sizing: border-box;
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
                            height: 16px;
                            border: none;
                            cursor: pointer;
                            margin-right: 16px;
                        }
                        .editBtn{
                            background: url('../../assets/edit.png') no-repeat;
                        }
                        .deleteBtn{
                            background: url('../../assets/delete.png') no-repeat;
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
            .header{
                text-align: left;
                margin: 15px 0;
                .left_header{
                    float: left;
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
                label,.label-item{
                    float:left;
                    width:auto;
                    height:26px;
                    padding: 0 9px;
                    padding-left:27px; 
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
                .item-btn-icon{
                    position: relative;
                    &::after{
                        display: block;
                        position: absolute;
                        top: 7px;
                        left: 11px;
                        width: 12px;
                        height: 12px;
                        background-size:100%; 
                        content: '';
                    }
                } 
                .icon-0{
                        &::after{
                        background-image: url('./images/1-0.png');
                        }
                }
                    .icon-1{
                        &::after{
                        background-image: url('./images/1-1.png');
                        }
                }
                    .icon-2{
                        &::after{
                        background-image: url('./images/1-2.png');
                        }
                }
                    .icon-3{
                        &::after{
                        background-image: url('./images/1-3.png');
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
  props:['mId'],
  data(){
      return {
         screenLeft:{
             show:false,
             item:1,
         },
         token:'',
         entId:'',//公司ID
         projId:'',
         projName:'',
         userId:'',
         UPID:'',
         defaultSubProjId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         show:{
             basicAttributes:true,
            generalDesignInfo:true,
         },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
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
        detailsHead:[
             {
                name:'',
                show:true,
                prop:'SerialNumber',
            },
            {
                name:'序号',
                show:true,
                prop:'pkId',
            },
             {
                name:'所在单体',
                show:true,
                prop:'dBuild',
            },
             {
                name:'所在分区',
                show:true,
                prop:'dDistrict',
            },
             {
                name:'所在楼层',
                show:true,
                prop:'dStorey',
            },
             {
                name:'类型名称',
                show:true,
                prop:'classifyName',
            },
             {
                name:'名称',
                show:true,
                prop:'dName',
            },
             {
                name:'业务状态',
                show:true,
                prop:'dState_format',
            }, {
                name:'单位',
                show:true,
                prop:'dUnit',
            },
             {
                name:'数量',
                show:true,
                prop:'dCount',
            },
        ],
        detailsHead_model:[],
        showOperate:true,
        S_quantitiesList:[],//明细基本信息
        S_Label_quantitiesList:[],
        showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
        labelListShow:false,//
        ListHeaderShow:false,//
        topExpend:{
            title:'收起',
            isExpend:true
        },
        bottomExpend:{
            title:'收起',
            isExpend:true
        },
        singleLable:false,//单个标签展示 不需要分页器
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
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.UPID = vm.$store.state.UPID
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getIntoList()
  }, 
  mounted(){
      var vm = this
    //   const table1 = new tableResizable('test');
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
      testIfIsNull(row, column, cellValue, index){
          if(cellValue == null)return '/'
          return cellValue
      },
      back(){
          var vm = this
          vm.$emit('back')
      },
      getIntoList(){
        var vm = this
        vm.fullscreenLoading =true
        axios({
            method:'POST',
            url:vm.BDMSUrl+'manifest2/showColumns',
            headers:{
                token:vm.token
            },
            params:{
                type:2,//类型 1 企业物料产品库显示列 2 清单明细基本信息显示列 3 订货清单明细显示列
                projId:vm.projId
            }
        }).then(response=>{
            if(response.data.cd == 0){
                vm.getManifestInfoByMId()
                vm.findManifestDetailList(2)
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
    getManifestInfoByMId(){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'manifest2/getManifestInfoByMId',
                headers:{
                    token:vm.token
                },
                params:{
                    mId:vm.mId,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                       vm.ManifestInfo = response.data.rt  
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
    //加载明细列表
    changeShowType(val){
        var vm = this
         //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
         if(val && vm.showType == 'combine'){
              vm.showType = 'separate'
              vm.detailsHead[1].show = true //序号列不显示
              vm.findManifestDetailList()
         }
         if(!val && vm.showType == 'separate'){
              vm.showType = 'combine'
              vm.detailsHead[1].show = false //序号列不显示
              vm.findManifestDetailList()
         }
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
