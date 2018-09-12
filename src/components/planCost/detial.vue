<template>
<div id="CommenListTwo" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="[{'box-left-avtive':!screenLeft.show,},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="containerMessage">
                    <div class="project" v-loading="loading">
                        <p class="antsLine">
                            成本管理<i class="icon-sanjiao-right"></i><span class="strong" @click="back()" v-text="title"></span><i class="icon-sanjiao-right"></i>
                            物料量清单明细
                        </p>
                        <p class="header clearfix"  style="margin-top:30px;">
                            <span class="left_header">
                                <i class="detial icon"></i>物料量清单明细
                            </span>
                            <a :class="['right_header','right-expend',bottomExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)" @click="changeBottomExpend()" v-text="bottomExpend.title"></a>
                        </p>
                        <div v-show="bottomExpend.isExpend">
                            <div style="overflow: auto;">
                                <zk-table 
                                    index-text="序号"
                                    :data="S_quantitiesList" :columns="columns" :tree-type="props.treeType" 
                                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                                    @cell-click="rowClick" row-class-name="row_self"
                                    :border="props.border" empty-text="正在加载...">
                                        <template slot="action" slot-scope="scope">
                                            <button class="locationBtn actionBtn" title="定位"  v-if="scope.row.relaType != 4" @click="locate(scope)"></button>
                                            <button class="detialBtn actionBtn" title="重新选型" 
                                            v-if="scope.row.relaId != 0 && scope.row.relaId != null && scope.row.mStatus.substring(2, 1) < 3" @click.stop="openLabel(scope.row)"></button>
                                        </template> 
                                </zk-table>
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
                                                <a href="javascript:void(0)" @click="findList()" class="btn-refresh btn-TAB"></a>
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
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']" >
             <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.show = true;screenLeft.item = 1">构<br>件</span>
                        <span class="item-version " @click="screenLeft.show = true;screenLeft.item = 2">选<br>型</span>
                    </div>
            </div>
            <div v-show="screenLeft.show" v-if="screenLeft.item == 1" class="screenRight_1">
                <div>
                        <h3 class="header-attribute" style="margin-top: 0px;">
                            <i class="trrangle"></i>
                            基本属性
                            <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                        </h3>
                        <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">清单及序号</span>
                                <span class="detial-text-value" v-text="checkedItem.manifestId+'-'+checkedItem.detailId" :title="checkedItem.manifestId+'-'+checkedItem.detailId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">可追溯ID</span>
                                <span class="detial-text-value" v-text="checkedItem.traceId" :title="checkedItem.traceId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName" :title="checkedItem.originalName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">所在空间</span>
                                <span class="detial-text-value" v-text="checkedItem.space" :title="checkedItem.space"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">单位</span>
                                <span class="detial-text-value" v-text="checkedItem.unit" :title="checkedItem.unit"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">数量</span>
                                <span class="detial-text-value" v-text="checkedItem.count" :title="checkedItem.count"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">修改用户</span>
                                <span class="detial-text-value" v-text="checkedItem.detailUpdateUser" :title="checkedItem.detailUpdateUser"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">修改时间</span>
                                <span class="detial-text-value" v-text="initData(checkedItem.detailUpdateTime)" :title="initData(checkedItem.detailUpdateTime)"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">业务状态</span>
                            </li>
                        </ul>
                        <h3 class="header-attribute" style="margin-top: 33px;">
                            <i class="trrangle"></i>
                            设计属性
                            <i :class="[{'active':show.generalDesignInfo},'icon-dropDown']" @click="show.generalDesignInfo = show.generalDesignInfo?false:true;"></i>
                        </h3>
                        <ul id="genealAtt" :class="[{'show':show.generalDesignInfo},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">GUID</span>
                                <span class="detial-text-value" v-text="checkedItem.guid" :title="checkedItem.guid"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始文件</span>
                                <span class="detial-text-value" v-text="checkedItem.originalFile" :title="checkedItem.originalFile"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始分类</span>
                                <span class="detial-text-value" v-text="checkedItem.originalCategory" :title="checkedItem.originalCategory"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始ID</span>
                                <span class="detial-text-value" v-text="checkedItem.originalId" :title="checkedItem.originalId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName" :title="checkedItem.originalName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">创建工具</span>
                                <span class="detial-text-value" v-text="checkedItem.creator" :title="checkedItem.creator"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">设计分类</span>
                                <span class="detial-text-value" v-text="checkedItem.classifyName" :title="checkedItem.classifyName"></span>
                            </li>


                            <li class="detial-item clearfix">
                                <span class="detial-text-name">注释</span>
                                <span class="detial-text-value" v-text="checkedItem.comment" :title="checkedItem.comment"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">标记</span>
                                <span class="detial-text-value" v-text="checkedItem.tag" :title="checkedItem.tag"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新用户</span>
                                <span class="detial-text-value" v-text="checkedItem.editor" :title="checkedItem.editor"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新时间</span>
                                <span class="detial-text-value" v-text="initData(checkedItem.entityUpdateTime)" :title="initData(checkedItem.entityUpdateTime)"></span>
                            </li>
                        </ul>
                        <div  style="margin-top:13px;">
                            <h3 class="header-attribute" style="margin-top: 0px;">
                                <i class="trrangle"></i>
                                关联文档
                                <i :class="[{'active':show.relevantDoc},'icon-dropDown']" @click="show.relevantDoc = show.relevantDoc?false:true;"></i>
                            </h3>
                            <ul id="relevantDoc" :class="[{'show':show.relevantDoc},'Att']" v-if="AssociatedDocumentList.length>0">
                                <li class="detial-item clearfix" v-for="(item,index) in AssociatedDocumentList" :key="index">
                                    <span class="detial-text-name" v-text="item.fgName" style="max-width: 120px;width: auto;float: left;"></span>
                                    <span class="icon-goujian icon-search" @click="view(item.filePath)"></span>
                                </li>
                            </ul>
                        </div>
                </div>
            </div>
             <div v-show="screenLeft.show" v-if="screenLeft.item == 2" class="screenRight_1">
                <div>
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                            构件分类
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                        <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">分类编码</span>
                                <span class="detial-text-value" :title="leftInfo.classifyCode">{{leftInfo.classifyCode}}</span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件专业</span>
                                <span class="detial-text-value" v-text="leftInfo.classifyCode" :title="leftInfo.classifyCode"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件系统</span>
                                <span class="detial-text-value" v-text="leftInfo.classifyCode" :title="leftInfo.classifyCode"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件类型</span>
                                <span class="detial-text-value" v-text="leftInfo.classifyCode" :title="leftInfo.classifyCode"></span>
                            </li>
                        </ul>
                        <h3 class="header-attribute" style="margin-top: 33px;">
                            <i class="trrangle"></i>
                                产品分类
                            <i :class="[{'active':show.generalDesignInfo},'icon-dropDown']" @click="show.generalDesignInfo = show.generalDesignInfo?false:true;"></i>
                        </h3>
                        <ul id="genealAtt" :class="[{'show':show.generalDesignInfo},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">分类编码</span>
                                <span class="detial-text-value" v-text="checkedItem.guid" :title="checkedItem.guid"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">大类</span>
                                <span class="detial-text-value" v-text="checkedItem.originalFile" :title="checkedItem.originalFile"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">中类</span>
                                <span class="detial-text-value" v-text="checkedItem.originalCategory" :title="checkedItem.originalCategory"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">小类</span>
                                <span class="detial-text-value" v-text="checkedItem.originalId" :title="checkedItem.originalId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">类型</span>
                                <span class="detial-text-value" v-text="leftInfo.productType" :title="leftInfo.productType"></span>
                            </li>
                        </ul>
                        <h3 class="header-attribute" style="margin-top: 33px;">
                            <i class="trrangle"></i>
                                产品实例
                            <i :class="[{'active':show.generalDesignInfo},'icon-dropDown']" @click="show.generalDesignInfo = show.generalDesignInfo?false:true;"></i>
                        </h3>
                        <ul id="genealAtt" :class="[{'show':show.generalDesignInfo},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">ID</span>
                                <span class="detial-text-value" v-text="leftInfo.relaId" :title="leftInfo.relaId"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">品牌</span>
                                <span class="detial-text-value" v-text="leftInfo.brand" :title="leftInfo.brand"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">名称</span>
                                <span class="detial-text-value" v-text="leftInfo.productName" :title="leftInfo.productName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">规格参数</span>
                                <span class="detial-text-value" v-text="leftInfo.specificationParameter" :title="leftInfo.specificationParameter"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">单位</span>
                                <span class="detial-text-value" v-text="leftInfo.unit" :title="leftInfo.unit"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">价格</span>
                                <span class="detial-text-value" v-text="leftInfo.TotalPrice" :title="leftInfo.TotalPrice"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">登记时间</span>
                                <span class="detial-text-value" v-text="leftInfo.unit" :title="leftInfo.unit"></span>
                            </li>
                        </ul>
                </div>
            </div>
        </div>
        <div v-if="labelListShow"  id="edit" class="dialog">
            <div class="el-dialog__header">
                    <span class="el-dialog__title">产品类型和实例选型</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                 <div class="editBody">
                     <h1 class="title_product">构件信息： </h1>
                    <el-table  :data="selectRow"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">
                        <el-table-column
                            v-for="(item,index) in detailsHead" :key="index"
                            :prop="item.prop"
                            :label="item.name"
                            v-if="item.show"
                            align="center"
                            :fixed="index == 0?'left':false"
                            :width="index == 0?'50':''"
                        >
                        </el-table-column>
                    </el-table>
                      <h1 class="title_product">产品类型： </h1>
                      <el-table  :data="selectRow"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">
                        <el-table-column
                            v-for="(item,index) in productHead" :key="index"
                            :prop="item.prop"
                            :label="item.name"
                            v-if="item.show"
                            align="center"
                            :fixed="index == 0?'left':false"
                            :width="index == 0?'50':''"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="operate"
                            label="操作"
                            v-if="showOperate"
                            fixed="right"
                            align="center"
                            >
                            <template slot-scope="scope">
                                <button class="locationBtn actionBtn" title="更换类型"  @click.stop="openLocation(scope)" ></button>
                            </template>
                        </el-table-column>
                    </el-table>
                         <h1 class="title_product">产品实例：</h1>
                      <el-table  :data="selectRow"  border style="width: 100%" class="detialInfoTable"  @row-click="checkLabel">
                        <el-table-column
                            v-for="(item,index) in productHead" :key="index"
                            :prop="item.prop"
                            :label="item.name"
                            v-if="item.show"
                            align="center"
                            :fixed="index == 0?'left':false"
                            :width="index == 0?'50':''"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="operate"
                            label="操作"
                            v-if="showOperate"
                            fixed="right"
                            align="center"
                            >
                            <template slot-scope="scope">
                                <button class="detialBtn actionBtn" title="更换产品"  @click.stop="openLocation(scope)" ></button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="labelListConfirm">确认</button>
                    <button class="editBtnC" @click="labelListCancle">取消</button>
                </div>
            </div>
        </div>
        <div id="mask" v-if="labelListShow || ListHeaderShow" ></div>
    </div>       
</template>
<style  lang='less' >
     .navigation{
        z-index: 0!important;
    }
    #CommenListTwo{
        #print-qrcode{
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
                .title_product{
                    font-size: 14px;
                    text-align: left;
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
            .actionBtn{
                width: 16px;
                height: 17px;
                border: none;
                cursor: pointer;
                margin-right: 10px;
            }
            .locationBtn{
                background: url('./images/location.png') no-repeat;
            }
            .detialBtn{
                background: url('./images/detial_.png') no-repeat;
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
        .box-left-container{
            // display: block;
            // position: fixed;
            // top: 165px;
            // left: 26px;
            // bottom: 0;
            // right: 225px;
            // z-index: 1001;
            // transition:  all ease .5s;
            // overflow: auto;
            display: inline-block;
            width: 85%;
            position: relative;
            transition:  all ease .5s;
             #center-selection{
                // position: fixed;
                // top: 115px;
                // right: 225px;
                // width: 25px;
                // z-index: 100;
                // transition: all ease .5s;
                // background: #ffffff;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25px;
                border-right: 1px solid #cccccc;
                .SH_right{
                    // width: 25px;
                    // height: 50px;
                    width: 100%;
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
                    height: 75px;
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
                        bottom: -7px;
                        width: 24px;
                        height: 13px;
                        background: #fff;
                        border-top: 1px solid #cccccc;
                        border-bottom: 1px solid #cccccc;
                        -webkit-transform: skewY(30deg);
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
                }
                .active{//上边 目录 高显
                    .item-property{
                        background: #fff;
                        color: #fc3439;
                        &::after{
                            background: #fafafa;
                        }
                    }
                    .item-version{
                        z-index: 15;
                    }
                }
            }
            #containerMessage{
                // padding-left:30px; 
                padding-bottom: 65px;
                margin-right: 25px;
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
                .left-item-box{
                    // min-width: 770px;
                    padding: 18px;
                    padding-right:0; 
                    margin-right:200px; 
                    text-align: left;
                    .item{
                        display: inline-block;
                        width: 32%;
                        margin-bottom: 20px;
                        .left{
                            float: left;
                            text-align: left;
                            font-size: 14px;
                            line-height: 14px;
                            color: #999999;
                            font-weight: normal;
                            margin-right: 11px;
                        }
                        .right{
                            float: left;
                            text-align: left;
                            font-size: 14px;
                            line-height: 14px;
                            color: #333333;
                            font-weight: normal;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .right-QRcode{
                    display: block;
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    width: 120px;
                    height: 120px;
                    padding: 5px;
                    border: 1px solid #e0e0e0;
                    background: #ffffff;
                    img{
                        width: 109px;
                        height: 109px;;
                    }
                }
                 .actionBtn{
                    width: 16px;
                    height: 17px;
                    border: none;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .locationBtn{
                    background: url('./images/location.png') no-repeat;
                }
                .detialBtn{
                    background: url('./images/detial_.png') no-repeat;
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
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 10px;
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
             width: 98%;
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
            // display: block;
            // position: fixed;
            // overflow-y: auto;
            // right: -225px;
            // bottom: 0;
            // width: 225px;
            // top: 116px;
            // transition: all ease .5s;
            // background: #ffffff;
            // z-index: 10;
            // border-left:none;
            // z-index: 1000;
            display: inline-block;
            position: relative;
            float: right;
            width: 15%;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            height: 785px;
            overflow-y: auto;
            overflow-x: hidden;
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 35px;
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
            width: 2%;
            transition: all ease .5s;
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
        .zk-table{
            color: #333333;
        }
        .zk-table--tree-icon{
            position: relative;
                width: 40px;
        display: inline-block;
        z-index: 10;
        background: #ffffff;
        }
        .zk-table--row-hover .zk-table--tree-icon{
            background: #ebf7ff;
        }
        .zk-table--tree-icon::after {
            display: block;
            position: absolute;
                top: 6px;
                left: 20px;
            width: 15px;
            height: 12px;
            background:url('../Settings/images/folder_1.png')no-repeat 0 0; 
        content: '';
        }
        .zk-icon-minus-square-o::after{
            background:url('../Settings/images/folder.png')no-repeat 0 0; 
        }
        .zk-table__body-row>td:first-of-type{
            width: 45px;
        }
        .zk-table--level-4-cell,.zk-table--level-3-cell,.zk-table--level-2-cell,.zk-table--level-1-cell,.zk-table--level-5-cell{
             position: relative;
        }
        .zk-table--level-4-cell::before,.zk-table--level-3-cell::before,.zk-table--level-2-cell::before,.zk-table--level-1-cell::before,.zk-table--level-5-cell::before{
            display: block;
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 14px;
            background:url('../Settings/images/file.png')no-repeat 0 0; 
            content: '';
            z-index: 1;
        }
        .zk-table__cell-inner {
        padding: 6px 12px;
        }   
    }
</style>
<script>
import Vue from 'vue'
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import dataTransform from '../Settings/js/date.js'
export default Vue.component('common-list',{
  props:['detailId','title','rType','bId','isGongChengLiang'],
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
        fullscreenLoading:false,
        ManifestInfo:{},//清单基本信息
        props: {
                stripe: true,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: true,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
        }, 
         columns: [
            {
                label: '产品类型',
                prop: 'productType',
                minWidth: '160px',
            },
            {
                label: '产品ID',
                prop: 'relaId',
                width: '85px',
            },
            {
                label: '产品名称',
                prop: 'productName',
                width: '205px',   
            },
            {
                label: '品牌',
                prop: 'brand',
                width: '115px',
            },

             {
                label: '规格参数',
                prop: 'specificationParameter',
                minWidth: '60px',
            },
            {
                label: '数量',
                prop: 'totalCount',
                width: '85px',
            },
            {
                label: '单位',
                prop: 'unit',
                width: '55px',   
            },
            {
                label: '单价',
                prop: 'referencePrice',
                width: '115px',
            },
             {
                label: '总价',
                prop: 'TotalPrice',
                width: '115px',
            },
            {
                label:'操作',
                prop:'operate',
                type: 'template',
                template: 'action',
                Width:'55px'
            }
        ],
        detailsHead:[
             {
                name:'所在空间',
                show:true,
                prop:'floor',
            },
            {
                name:'构件名称',
                show:true,
                prop:'originalName',
            },
             {
                name:'构建类型',
                show:true,
                prop:'classifyName',
            },
             {
                name:'类型编码',
                show:true,
                prop:'classifyCode',
            },
             {
                name:'注释',
                show:true,
                prop:'comments',
            },
             {
                name:'标记',
                show:true,
                prop:'tag',
            },
        ],
        productHead:[
            {
                name:'类型编码',
                show:true,
                prop:'productTypeCode',
            },
            {
                name:'产品大类',
                show:true,
                prop:'productType',
            },
             {
                name:'产品中类',
                show:true,
                prop:'classifyName',
            },
             {
                name:'产品小类',
                show:true,
                prop:'classifyCode',
            },
             {
                name:'产品类型',
                show:true,
                prop:'productType',
            },
        ],
        detailsHead_model:[],
        showOperate:true,
        S_quantitiesList:[],//物料量清单明细
        selectRow:[],
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
        AssociatedDocumentList:[],//
        leftInfo:{},
        TraceID:'',
        HolderPath:'',
        GCCode:''
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
    }, 
    mounted(){
        var vm = this
        vm.findList()
    },
    watch:{
        'show.basicAttributes':function(val){
            if(val){
                $("#basicAtt").show(200);
            }else{
                $("#basicAtt").hide(200);
            }
        },
        'show.generalDesignInfo':function(val){
            if(val){
                $("#genealAtt").show(200);
            }else{
                $("#genealAtt").hide(200);
            }
        },
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.findList()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.findList()
        },
    },
    methods:{
        locate(scope){
            if(document.getElementById('webgl').style.display=='none'){
            this.$message({
                type:'info',
                message:'请打开顶部的虚拟场景'
            })
            }else{
                this.TraceID=String(scope.row.dTraceId);
                this.HolderPath=JSON.parse(scope.row.dHolderPath);
                // this.HolderPath=scope.row.dHolderPath;
                this.GCCode=scope.row.dGCCode;
                const para={"TraceID":this.TraceID,"HolderPath":this.HolderPath,"GCCode":this.GCCode}
                const app = document.getElementById('webIframe').contentWindow;
                app.postMessage({command:"LookAtEntities",parameter:para},"*");
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        },
        //单击某行
        rowClick(row,rowIndex,event){
            // console.log(row);
            // console.log(rowIndex);
            // console.log(event)
        },
        checkLabel(scope){
            var vm = this
            vm.screenLeft.show = true
            if(scope.row){
                var pkId = scope.row.pkId
                var tag = 1
            }else if(scope.pkId){
                var pkId = scope.pkId
                    var tag = 2
            }
            axios({
                method:'GET',
                url:vm.BDMSUrl+'show2/getEntityDetailInfo',
                headers:{
                    token:vm.token
                },
                params:{
                    detailId:pkId,//类型 1 企业物料产品库显示列 2 清单物料量清单明细显示列 3 订货清单明细显示列
                    projectId:vm.projId
                }
            }).then(response=>{
                vm.checkedItem = {}
                if(response.data.cd == 0){
                    if(response.data.rt !=null)vm.checkedItem = response.data.rt
                    if(tag == 1){
                        vm.$set(vm.checkedItem,'space',scope.row.dStorey ? scope.row.dStorey : (scope.row.dDistrict ? scope.row.dDistrict : (scope.row.dBuild ? scope.row.dBuild : "")))
                        vm.$set(vm.checkedItem,'unit',scope.row.unit)
                    }else if( tag == 2){
                        vm.$set(vm.checkedItem,'space',scope.dStorey ? scope.dStorey : (scope.dDistrict ? scope.dDistrict : (scope.dBuild ? scope.dBuild : "")))
                        vm.$set(vm.checkedItem,'unit',scope.unit)
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
        openLabel(row){
            var vm = this;
            this.leftInfo = row;
            console.log(this.leftInfo);
            this.screenLeft.show = true;
            vm.labelListShow = true;
            vm.selectRow = [];
            vm.selectRow.push(row);
        },
        openLocation(){
            var vm  = this
            vm.$message({
                type:'info',
                message:'虚拟场景面板未打开，请打开左侧虚拟场景面板。'
            })
        },
        changeBottomExpend(){
            var vm = this
            vm.bottomExpend.isExpend = !vm.bottomExpend.isExpend
            vm.bottomExpend.title = vm.bottomExpend.isExpend?'收起':'展开'
        },
        changeTopExpend(){
            var vm = this
            vm.topExpend.isExpend = !vm.topExpend.isExpend
            vm.topExpend.title = vm.topExpend.isExpend?'收起':'展开'
        },
        labelListConfirm(){
            var vm = this
            if(vm.singleLable == true){
                window.open('/#/Cost/getManifestDetailInfoForPage/'+vm.manifestId+'/'+vm.S_Label_quantitiesList[0].pkId)
            }else{
                window.open('/#/Cost/getManifestDetailInfoForPage/'+vm.manifestId+'/0')
            }
        },
        labelListCancle(){
            var vm = this
            vm.labelListShow = false
        },
        headerListCancle(){
            var vm = this
            vm.ListHeaderShow = false
            vm.detailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        headerListConfirm(){
            var vm = this
            vm.ListHeaderShow = false
            vm.detailsHead_model.forEach((item,index)=>{
                vm.$set(item,'show',item.showModel)
                vm.$set(vm.detailsHead[index],'show',item.showModel)
            })
        },
        showLabel(){
            var vm = this
            vm.labelListShow = true
        },
        showLabelHeader(){
            var vm = this
            vm.ListHeaderShow = true
            var b = []
            $.extend(b,vm.detailsHead)
            vm.detailsHead_model = b
            vm.detailsHead_model.forEach((item,index)=>{
                vm.$set(item,'showModel',item.show)
            })
        },
        back(){
            var vm = this
            vm.$emit('back')
        },
        findList(isDialog=0){
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
                /*@李从文
                    这个接口对应 show/getManifestDetailInfo
                */
                if(vm.showType == 'combine'){
                    showType = 2
                }
                var page = vm.pageDetial.currentPage
                var rows = vm.pageDetial.pagePerNum
                var setting = {
                    data: {
                        key:{
                            children:'children'
                        },
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "_parentId",
                            rootPId: 0
                        }
                    }
                }
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/report/listMaterialComponent',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        projectId:vm.projId,
                        detailId:vm.detailId,
                        page:page,
                        rows:rows,
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        if(response.data.rt.rows != null){
                            vm.pageDetial.total = response.data.rt.total
                            // TotalPrice
                            let arr = response.data.rt.rows
                            arr.forEach(ele=>{
                                if(ele.id == 0){
                                    vm.$set(ele,'TotalPrice','-')
                                }
                                let num = parseFloat((ele.totalCount * ele.referencePrice).toFixed(2))
                                vm.$set(ele,'TotalPrice',num)
                            })
                            vm.S_quantitiesList = dataTransform.transformTozTreeFormat(setting, arr);
                            console.log(vm.S_quantitiesList)
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
