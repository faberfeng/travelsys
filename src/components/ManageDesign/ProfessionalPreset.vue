<template>
<div id="ProfessionalPreset" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="['box-left-avtive','box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/Design/management'" class=" label-item">  
                     设计协调  
                    </router-link>
                    <router-link :to="'/Design/attributeManager'"  class="label-item label-item-active">  
                        属性管理  
                    </router-link>
                    <router-link :to="'/Design/designversion'"  class="label-item">  
                        设计版本  
                    </router-link>
                </div>
                <div id="containerMessage">
                    <p class="header clearfix">
                        <span class="button-add">添加</span>
                        <span class="button-back">返回</span>
                    </p>
                    <div class="ForumSelector">
                        <p  class="selectBar clearfix">
                          <span class="name">空间筛选</span>
                          <ul>
                              <li class="selectItem">
                                  <span class="title">单体</span>
                                  <el-select v-model="value_monomer" placeholder="请选择">
                                      <el-option
                                      v-for="item in options_monomer"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">分区</span>
                                  <el-select v-model="value_partition" placeholder="请选择">
                                      <el-option
                                      v-for="item in options_partition"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">楼层</span>
                                  <el-select v-model="value_floor" placeholder="请选择">
                                      <el-option
                                      v-for="item in options_floor"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                          </ul>
                        </p>
                    </div>
                    <div class="project" v-loading="loading">
                        <!--以下是列表-->
                        <div style="overflow: auto;">
                          <table class="UserList" border="1" width='100%'>
                              <thead>
                                  <tr  class="userList-thead">
                                    <th>空间范围</th>
                                    <th>构件类型</th>
                                    <th>属性名称</th>
                                    <th>取值</th>
                                    <th>操作</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(val,index) in attributeList" :key="index" :class="[val.checked?'activeTr':'']">
                                    
                                  </tr>
                              </tbody>
                          </table>
                            <div v-if="empty" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                  无符合当前筛选条件的记录
                            </div>
                        </div>
                        <!--以下是page-navigitation-->
                        <div class="datagrid-pager pagination" v-if="attributeList.length>0">
                            <table cellspacing="0" cellpadding="0" border="0" >
                              <tbody>
                                  <tr>
                                      <td>
                                          <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                                <option value="10">10</option>
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
                                              <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                                        </td>
                                        <td>
                                            <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial.total/pageDetial.pagePerNum)}}页</span>
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
                                            <a href="javascript:void(0)" @click="selectData" class="btn-refresh btn-TAB"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            
        </div>
</div>       
</template>
<style  lang='less'>
    #ProfessionalPreset{
        /*
            修改eleUI树形组件
        */
        .is-leaf:before{
            content: ""!important;
            color: #999999;
            font-weight: bold;
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        li{
            list-style: none;
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
        .show{
            display: block!important;
        }
        .upInput{
            display: none;
        }
        #edit{ 
            .el-dialog{
                margin: 0 auto;
            }
        }
        .box-left-container{
            display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 225px;
            z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;
            #center-selection{
                position: fixed;
                top: 115px;
                // bottom: 0;
                right: 225px;
                width: 25px;
                z-index: 100;
                transition: all ease .5s;
                background: #ffffff;
                .SH_right{
                    width: 25px;
                    height: 48px;
                    border-left: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    .icon-right{
                        display: block;
                        position: absolute;
                        top: 19px;
                        left: 6px;
                        width: 14px;
                        height: 14px;
                        background: url('../ManageCost/images/right.png')no-repeat 0 0;
                        transition: all ease .5s;
                        transform: rotateZ(0deg);
                    }
                }
                .item-property{//目录
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -9px;
                        width: 24px;
                        height: 15px;
                        background: #fafafa;
                        border-top: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }   
                .item-version{//属性
                    display: block;
                    width: 25px;
                    height: 55px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .item-version-3{//版本
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:24px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .active-version{//中间 属性 高显
                    .item-version{//属性
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after{
                            background: #fff;
                        }
                    }
                    .item-property::after{//目录
                        background: #fff;
                    }
                    .item-version-3{//版本
                        z-index: 10;
                    }
                }
                .active{//上边 目录 高显
                    .item-property{
                        background: #fff;
                        color: #fc3439;
                    }
                    .item-version{
                        z-index: 15;
                    }
                    .item-version-3{
                        z-index: 10;
                    }
                }
            }
            #containerMessage{
                padding-left:30px; 
                padding-bottom: 65px;
                margin-right: 30px;
                .header{
                    text-align: left;
                    margin: 15px 0;
                    .button-back{
                        float: right;
                        background: #ffffff;
                        color: #fc3439;
                        border: 1px solid #fc3439;
                        font-size: 12px;
                        height: 26px;
                        width: 86px;
                        border-radius: 2px;
                        line-height: 26px;
                        cursor: pointer;
                        text-align: center;
                    }
                    .button-add{
                        float: left;
                        background: #fc3439;
                        color: #ffffff;
                        font-size: 12px;
                        height: 26px;
                        border-radius: 2px;
                        text-align: left;
                        line-height: 26px;
                        padding-left: 42px;
                        padding-right: 16px;    
                        position: relative;
                        cursor: pointer;
                        &::before{
                            display: block;
                            position: absolute;
                            top: 7px;
                            left: 19px;
                            width: 12px;
                            height: 12px;
                            content: '';
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    color: #999999;
                    font-size: 12px;
                    .selectBar{
                      border-bottom: 1px dashed #e6e6e6;
                        &:last-of-type{
                            border-bottom: none;
                        }
                        .name{
                            float: left;
                            width: 96px;
                            height: 38px;
                            line-height: 38px;
                            text-align: left;
                            padding-left: 10px;
                            background: #fafafa;
                        }
                        >ul{
                            float: left;
                            .selectItem{
                                float: left;
                                .title{
                                    padding: 0 15px 0 30px;
                                    height: 38px;
                                    line-height: 38px;
                                }
                                .el-select{
                                    .el-input__inner{
                                        border:none;
                                        width: 100px;
                                        color:#333333;
                                        height: 38px;
                                    }
                                }
                              
                            }
                            .selectItem:first-of-type .el-select .el-input__inner{
                                width: 170px;
                            }
                        }
                    }
                }
                .btn-selection{
                  margin: 10px 0 30px;
                  .redbtn{
                    float: left;
                    width: 128px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    color: #fff;
                    background: #fc3439;
                    border-radius: 2px;
                    font-size: 14px;
                    margin-right: 10px;
                      cursor: pointer;
                    &:hover{
                        background: #ff5257;
                    }
                  }
                  .whitebtn{
                     float: left;
                     cursor: pointer;
                    width: 98px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    color: #999999;
                    border: 1px solid #e6e6e6;
                    background: #ffffff;
                    border-radius: 2px;
                    font-size: 14px;
                    &:hover{
                        background: #e6e6e6;
                        color: #666;
                    }
                  }
                }
                .project{
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
                            }
                            .activeTr{
                                background: #0081c2;
                                td{
                                   color: #fff!important;
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
        }
        .box-left-avtive{
            right: 0px;
            transition:  all ease .5s;
            #center-selection{
                right: 0;
                transition: all ease .5s;
            }
            .icon-right{
                transform: rotateZ(180deg)!important;
                transition: all ease .5s;
            }
        }
        .el-main{
            padding: 0;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
        }
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
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
        width:10px;
        height: 10px;
        }
        /* 滚动槽 */
        ::-webkit-scrollbar-track {
        box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
        border-radius:10px;
        }
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
        }
        ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
        }
    }
</style>
<script>
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'

export default {
  name:'Costover',
  components:{
        
  },
  data(){
      return {
         token:'',
         entId:'',//公司ID
         projId:'',
         userId:'',
         defaultSubProjId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        /*以下为后期添加数据*/
        options_monomer:[],//单体选项
        options_partition:[
          {
              id:'0',
              Name:'无'
          },
        ],//分区选项
        options_floor:[
           {
              id:'0',
              Name:'无'
          },
        ],//楼层选项
        option_professional:[
            {
                id:'-1',
                Name:'全部'
            },
            {
                id:'110000',
                Name:'场地'
            },{
                id:'210000',
                Name:'结构'
            },{
                id:'310000',
                Name:'建筑'
            },{
                id:'350000',
                Name:'室内'
            },
            {
                id:'410000',
                Name:'暖通'
            },
             {
                id:'430000',
                Name:'动力'
            },
            {
                id:'450000',
                Name:'给排水'
            },{
                id:'500000',
                Name:'电气'
            },{
                id:'510000',
                Name:'强电'
            },{
                id:'530000',
                Name:'弱电'
            },
            {
                id:'900000',
                Name:'未知'
            }
        ],
        options_system:[
           {
              id:'0',
              Name:'无'
          },
           {
              id:'-1',
              Name:'全部'
          },
        ],//系统选项
        options_type:[
            {
              id:'0',
              Name:'无'
          },
           {
              id:'-1',
              Name:'全部'
          },
        ],//楼层选项
        value_monomer: '',//单体 筛选关键词
        value_partition: '0',//分区 筛选关键词
        value_floor: '0',//单体 筛选关键词
        value_professional:'-1',//专业 筛选关键字
        value_system:'-1',//系统 筛选关键字
        value_type:'-1',//类型 筛选关键字
        projAuth:[],//当前用户的权限列表
        fullscreenLoading:false,
        loading:false,
        entType:'',
        dataVision:0,
        holderMaxVersion:0,//最大版本的id
        attributeList:[],//属性的列表
        GCPropertyList:[],//扩展属性头部
        GCPropertyList_to_select:[],//扩展属性头部
        GCPropertyValueList:[],//扩展属性查询的值 库
        GenieclassTitle:[],//类型信息列表
        checkAll:false,//全选所有
        ShowClassify:true,//显示分类筛选项
        extensionAttributesShow:false,//扩展属性显隐
        pageDetial:{
            pagePerNum:10,//一页几份数据
            currentPage:1,//初始查询页数 第一页
            total:'',//所有数据
        },
        empty:false,
        extension:{
            show:false,
            num:0,
        },
      }
  },
  created(){
        var vm = this
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.projAuth = localStorage.getItem('projAuth')
        vm.entType = localStorage.getItem('entType')
       
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getIntoDesignPage()
    },
  watch:{
      checkAll:function(val,oldval){
          var vm = this
          if(val){
                 vm.attributeList.forEach((item,key)=>{
                    item.checked  = true
                })
          }else{
             vm.attributeList.forEach((item,key)=>{
                item.checked  = false
            })
          }
      },
      value_monomer:function(val){
            var vm = this 
      },
       value_partition:function(val){
            var vm = this 
      },
      value_professional:function(val){
            var vm = this 
      },
      value_system:function(val){
            var vm = this 
      },
      'pageDetial.currentPage':function(val,oldval){
          var vm = this
          vm.selectData()
      },
      'pageDetial.pagePerNum':function(val,oldval){
          var vm = this
          vm.selectData()
      },
  },
  methods:{
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
      trim(str){ 
        /**去掉字符串前后所有空格*/
        return str.replace(/(^\s*)|(\s*$)/g, ""); 
      },
      getIntoDesignPage(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/designCoordination',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.options_monomer = response.data.rt.subProjects//单体列表
                vm.options_monomer.unshift({
                    id:'0',
                    Name:'总体场地'
                },{
                    id:'all',
                    Name:'全部单体'
                },)
                // vm.value_monomer = response.data.rt.siteHolderId
                 vm.value_monomer = '0'
            }

        }).catch((err)=>{
            console.log(err)
        }).then(
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/dc/attributeManagement',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.dataVision = response.data.rt.holderMaxVersion
                    vm.holderMaxVersion = response.data.rt.holderMaxVersion
                }

            }).catch((err)=>{
                console.log(err)
            })
        )
    },
    selectData(){
        var vm = this
          axios({
              method:'POST',
              url:vm.BDMSUrl+'project2/dc/searchPropertyData',
              headers:{
                  'token':vm.token
              },
              params:{
                  projId:vm.projId,
                  dataVision:vm.dataVision,//数据版本
                  isChildren:isChildren,
                  selectBuild:selectBuild,
                  holderType:holderType,
                  holderId:holderId,
                  gcCode:gcCode,
                  gcCode1:gcCode1,
                  gcCode2:gcCode2,
                  gcNumber:gcNumber,
                  rows:vm.pageDetial.pagePerNum,
                  page:vm.pageDetial.currentPage,
              }
          }).then((response)=>{
              if(response.data.cd == 0){

              }
              vm.fullscreenLoading = false
          }).catch((err)=>{
              console.log(err)
          })
      },
  }
}
</script>
