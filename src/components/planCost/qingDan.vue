<template>
<div id="CommenList" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="[{'box-left-avtive':!screenLeft.show,},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">属<br>性</span>
                    </div>
                </div>
                <div id="containerMessage">
                    <div class="project" v-loading="loading">
                        <!--以下是列表-->
                        <p class="header clearfix">
                             <span style="" class="button-back" @click="back()">返回</span>
                        </p>
                        <div class="clearfix">
                             <table class="table-list" border="1" width='100%'>
                                <thead>
                                    <tr  class="userList-thead">
                                        <td >生成方式</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.pkId"></td>
                                        <td >生成方式</td>
                                        <td style="width: 150px;background: #fff;" v-text="parseMGSource(ManifestInfo.mGSource)"></td>
                                        <td >创建用户</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.creator"></td>
                                        <td >创建时间</td>
                                        <td style="width: 150px;background: #fff;" v-text="initData(ManifestInfo.createTime)"></td>
                                    </tr>
                                    <tr  class="userList-thead">
                                        <td >原始编号</td>
                                        <td style="width: 150px;background: #fff;" v-text="(ManifestInfo.mOriginalId == 0)?'-':ManifestInfo.mOriginalId"></td>
                                        <td >业务来源</td>
                                        <td style="width: 150px;background: #fff;" v-text="parseMBSource(ManifestInfo.mBSource)"></td>
                                        <td >修改用户</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.updater"></td>
                                        <td >修改时间</td>
                                        <td style="width: 150px;background: #fff;" v-text="initData(ManifestInfo.updateTime)"></td>
                                    </tr>
                                    <tr  class="userList-thead">
                                        <td >清单名称</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.mName"></td>
                                        <td >版本号</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.mVersion"></td>
                                        <td >业务状态</td>
                                        <td style="width: 150px;background: #fff;" v-text="parseMStatus(ManifestInfo.mStatus)+'('+ ManifestInfo.mStatus +')'"></td>
                                        <td >清单类型</td>
                                        <td style="width: 150px;background: #fff;" v-text="ManifestInfo.mType"></td>
                                    </tr>
                                </thead>
                               </table>
                               <div class="right-QRcode">
                                   <img :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(ManifestInfo.pkId, 7) " alt="">
                               </div>
                        </div>
                        <div style="overflow: auto;margin-top:10px;">
                            <p>
                                <button @click="changeShowType(true)">逐个显示</button>
                                <button @click="changeShowType(false)">合并显示</button>
                                <button @click="showLabel()">全部标签</button>
                                <button>显示列</button>
                            </p>
                           <el-table  :data="S_quantitiesList"  border style="width: 100%">
                                <el-table-column
                                v-for="(item,index) in detailsHead" :key="index"
                                :prop="item.prop"
                                :label="item.name"
                                v-if="item.show"
                                align="center"
                                :fixed="index == 0?'left':false"
                                :width="index == 0?'50':''"
                                :formatter="testIfIsNull"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="operate"
                                    label="操作"
                                    v-if="showOperate"
                                    fixed="right"
                                    align="center"
                                    :formatter="testIfIsNull"
                                    >
                                     <template slot-scope="scope">
                                        <button class="editBtn actionBtn" title="明细"  @click="edit(val)" ></button>
                                        <button class="dataBtn actionBtn" title="清单"  @click="showlist(val)" v-if="showType == 'separate'"></button>
                                        <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.id,val.relaId,true)" ></button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                  无符合当前筛选条件的记录
                            </div>
                        </div>
                        <!--以下是page-navigitation-->
                        <div class="datagrid-pager pagination" v-if="S_quantitiesList.length>0">
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
                                            <a href="javascript:void(0)" @click="findManifestDetailList" class="btn-refresh btn-TAB"></a>
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
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']" >
            <div v-if="screenLeft.item == 1" class="screenRight_1">
                <div>
                        <h3 class="header-attribute" style="margin-top: 0px;">
                            <i class="trrangle"></i>
                            基本属性
                            <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                        </h3>
                        <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">所在空间</span>
                                <span class="detial-text-value" v-text="checkedItem.holderType"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始文件</span>
                                <span class="detial-text-value" v-text="checkedItem.originalFile"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始ID</span>
                                <span class="detial-text-value" v-text="checkedItem.originalId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">脚本名称</span>
                                <span class="detial-text-value" v-text="checkedItem.name"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">分类编码</span>
                                <span class="detial-text-value" v-text="checkedItem.gccode"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件分类</span>
                                <span class="detial-text-value" v-text="checkedItem.gccodeName"></span>
                            </li>
                        
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">创建程序</span>
                                <span class="detial-text-value" v-text="checkedItem.creator"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新用户</span>
                                <span class="detial-text-value" v-text="checkedItem.editor"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新时间</span>
                                <span class="detial-text-value" v-text="checkedItem.updateTime"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">标记</span>
                                <span class="detial-text-value" v-text="checkedItem.tag?checkedItem.tag:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">注释</span>
                                <span class="detial-text-value" v-text="checkedItem.comments?checkedItem.comments:'（空）'"></span>
                            </li>
                        </ul>
                </div>
            </div>
        </div>
        <div v-if="labelListShow"  id="edit" class="dialog">
                <div class="el-dialog__header">
                    <span class="el-dialog__title">标签信息预览</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                 <div class="editBody">
                    <ul>
                        <li v-for="(item,index) in S_quantitiesList" :key="index" class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">可追踪ID：</span>
                                    <span class="text-right" v-text="testIfIsNull(null,null,item.dTraceId)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件名称：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.dName)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在单体：</span>
                                   <span class="text-right" v-text="testIfIsNull(null,null,item.dBuild)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在分区：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.dDistrict)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">所在楼层：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.dStorey)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件分类：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.classifyName)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件注释：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentComments)"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">构件标记：</span>
                                     <span class="text-right" v-text="testIfIsNull(null,null,item.componentTag)"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                    <button class="editBtnS" @click="labelListConfirm">打印当前页标签</button>
                    <button class="editBtnC" @click="labelListCancle">取消</button>
                </div>
            </div>
        </div>
        <div id="mask" v-if="labelListShow" @click="labelListCancle"></div>
</div>       
</template>
<style  lang='less' >
     .navigation{
        z-index: 0!important;
    }
    #CommenList{
        .dialog{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            .editBody{
                margin: 20px;
            }
            .item-label{
                border-bottom: 1px solid #cccccc;
                .img_left{
                    float: left;
                    width: 150px;
                    height: 150px;
                    margin-right: 15px;
                }
                .right{
                    float: left;
                    width: 450px;
                    .item-list{
                        .text-left{
                            float: left;
                            width: 80px;
                            text-align: left;
                        }
                        .text-right{
                             float: left;
                            width: 300px;
                            text-align: left;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                }
                &:last-of-type{
                    border-bottom: none;
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
        .table-resizable {
        position: relative;
        }

        .table-resizing {
        cursor: col-resize !important;
        user-select: none;
        }
        table {
        margin: 0 !important;
        table-layout: fixed;
        }

        table td {
        word-break: break-all;
        }

        table th {
        position: relative;
        user-select: none;
        }

        .resizable-hold {
        position: absolute;
        left: 200px;
        top: 0;
        bottom: 0;
        width: 0;
        border-left: 1px solid rgb(223, 230, 236);
        z-index: 10;
        display: none;
        }

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
            top: 165px;
            left: 26px;
            bottom: 0;
            right: 225px;
            z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;
            #center-selection{
                position: fixed;
                top: 115px;
                right: 225px;
                width: 25px;
                z-index: 100;
                transition: all ease .5s;
                background: #ffffff;
                .SH_right{
                    width: 25px;
                    height: 50px;
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
                    height: 60px;
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
                        height: 2px;
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
                margin-right: 25px;
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
                        line-height: 24px;
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
                            background: url('../ManageDesign/images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .table-list{
                    float: left;
                    width: 87%;
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    background: red;
                    thead{
                        background: #f2f2f2;
                        .userList-thead{
                            height: 55px;
                            text-align: center;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            font-weight: normal;
                        }
                    }
                }
                .right-QRcode{
                    float: right;
                    width: 10%;
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
                .project{
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
        }
        .box-left-avtive,.box-left-avtive_pre{
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
        /*
        右侧
        */
        .box-right-container{
            display: block;
            position: fixed;
            overflow-y: auto;
            right: -225px;
            bottom: 0;
            width: 225px;
            top: 116px;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            border-left:none;
            z-index: 1000;
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 10px;
                border-bottom: 1px solid #e6e6e6;
                .noTop{
                    top: 12px!important;
                }
                >p{
                    padding-bottom:5px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom:10px;  
                }
                .icon-goujian{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                .icon-search{
                    background: url('../ManageCost/images/search.png')no-repeat 0 0;
                    margin-left: 10px;
                    &:hover{
                        background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                    }
                }
                 .header-attribute{
                    font-size: 14px;
                    color: #333333;
                    line-height: 14px;
                    padding-bottom:4px;
                    border-bottom: 1px solid #e6e6e6;
                    text-align: left; 
                    .trrangle{
                        display: inline-block;
                        width: 0px;
                        height: 0px;
                        border-left: 10px solid #fc3439;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                    }
                    .icon-dropDown{
                        display: block;
                        width: 12px;
                        height: 12px;
                        background:url('../ManageCost/images/arror.png')no-repeat 0 0; 
                        float: right;
                        cursor: pointer;
                        transition:  all ease .2s;
                        transform: rotate(180deg);
                    }
                    .active{
                        transform: rotate(0deg);
                    }
                }
                .header-attribute:last-of-type{
                    margin-top: 30px;
                }
                 .Att{
                    >li:last-of-type{
                        padding-bottom: 7px;
                    }
                    .detial-item{
                        font-size: 12px;
                        line-height: 12px;
                        margin-top: 16px;
                        text-align: left;
                    }
                     .detial-text-name{
                        color: #999999;
                        width: 65px;
                        display: inline-block;
                    }
                    .detial-text-value{
                        color: #333333;
                        max-width: 120px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                    }
                }
            }
        }
        .box-right-avtive{
            right: 0;
            transition: all ease .5s;
            border-left: 1px solid #cccccc;
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
import Vue from 'vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'

export default Vue.component('common-list',{
  props:['mId','selectugid','holderid','iscomment','keycomment','dcid','valuemonomer','valuestatus','valueabout'],
  data(){
      return {
         screenLeft:{
             show:false,
             item:1,
         },
         token:'',
         entId:'',//公司ID
         projId:'',
         userId:'',
         defaultSubProjId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         show:{
             basicAttributes:true,
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
        showOperate:true,
        S_quantitiesList:[],//明细基本信息
        showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
        labelListShow:false,//
      }
  },
  created(){
        var vm = this
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
       
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getIntoList()
  }, 
  mounted(){
      var vm = this
    //   const table1 = new tableResizable('test');
  },
  watch:{
      'show.basicAttributes':function(val){
          if(val){
            $("#basicAtt").show(200);
          }else{
            $("#basicAtt").hide(200);
          }
      },
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
      labelListConfirm(){

      },
      labelListCancle(){
        var vm = this
        vm.labelListShow = false
      },
      showLabel(){
          var vm = this
          vm.labelListShow = true
      },
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
                vm.findManifestDetailList()
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
    findManifestDetailList(){
            var vm = this
             //   showType:'separate',// 1. sepatate ,逐个显示 2. combine，合并显示
            var showType = 1
            if(vm.showType == 'combine'){
                showType = 2
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
                    page:vm.pageDetial.currentPage,
                    rows:vm.pageDetial.pagePerNum,
                    showType:showType,//显示类型 1 逐个显示 2 合并显示
                    currentColumns:''
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.total
                        if(response.data.rt.rows != null){
                            vm.S_quantitiesList = response.data.rt.rows
                            vm.S_quantitiesList.forEach((element,index) => {
                                vm.$set(element,'SerialNumber',vm.pageDetial.pagePerNum*(vm.pageDetial.currentPage-1)+index+1)//列表序号
                                vm.$set(element,'dState_format',vm.parseMStatus(element.dState)+ "(" + element.dState + ")")//业务状态
                            });
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
