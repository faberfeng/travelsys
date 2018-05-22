<template>
<div id="attributeManager" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">图<br>纸</span>
                        <span class="item-version " @click="screenLeft.item = 2">联<br>系<br>人</span>
                        <span class="item-version-3 " @click="screenLeft.item = 3;">属<br>性</span>
                    </div>
                </div>
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
                        <span class="title">
                          数据版本 <input type="tel" v-model="dataVision">/{{holderMaxVersion}}
                           <span class="reset" @click="selectData">重设</span>
                        </span>
                        <span style="float: right;margin-right: 30px;">
                            <span class="item-btn clearfix">
                                <label>专业预设</label>
                                <label @click="basicAttributes_auth.show = true">基本属性</label>
                                <label @click="showExtension()">扩展属性</label>
                            </span>
                            <span class="item-upload" @click="editAttribute">编辑属性</span>
                        </span>
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
                        <p class="selectBar clearfix" v-if="!ShowClassify">
                          <span class="name">分类筛选</span>
                          <ul>
                              <li class="selectItem">
                                  <span class="title">专业</span>
                                  <el-select v-model="value_professional" ref="professional" placeholder="请选择">
                                      <el-option
                                      v-for="item in option_professional"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">系统</span>
                                  <el-select v-model="value_system"  ref="system" placeholder="请选择">
                                      <el-option
                                      v-for="item in options_system"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">类型</span>
                                  <el-select v-model="value_type"  ref="type" placeholder="请选择">
                                      <el-option
                                      v-for="item in options_type"
                                      :key="item.id"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                          </ul>
                        </p>
                    </div>
                    <p class="btn-selection clearfix">
                       <span class="redbtn" @click="selectData">筛选</span>
                       <span class="whitebtn" v-if="ShowClassify" @click="ShowClassify = false">更多</span>
                    </p>
                    <div class="project" v-loading="loading">
                        <!--以下是列表-->
                        <div style="padding-right:30px;">
                          <table class="UserList" border="1" width='100%'>
                              <thead>
                                  <tr  class="userList-thead">
                                      <th width="34px;" style="padding-right:10px;">
                                          <label  :class="[checkAll?'active':'','checkbox-fileItem']" for="allAttribute"></label>
                                          <input  type="checkbox" id='allAttribute' class="checkbox-att" v-model="checkAll">
                                      </th>
                                      <th v-if="basicAttributes_auth.old.holderType">所在空间</th>
                                      <th v-if="basicAttributes_auth.old.guid">元素GUID</th>
                                      <th v-if="basicAttributes_auth.old.originalFile">原始文件</th>
                                      <th v-if="basicAttributes_auth.old.originalCategory">原始分类</th>
                                      <th v-if="basicAttributes_auth.old.originalId">原始ID</th>
                                      <th v-if="basicAttributes_auth.old.originalName">原始名称</th>
                                      <th v-if="basicAttributes_auth.old.gccode">类型编码</th>
                                      <th v-if="basicAttributes_auth.old.gccodeName">类型名称</th>
                                      <th v-if="basicAttributes_auth.old.name">构件名称</th>
                                      <th v-if="basicAttributes_auth.old.creator">创建者</th>
                                      <th v-if="basicAttributes_auth.old.editor">编辑者</th>
                                      <th v-if="basicAttributes_auth.old.updateTime">更新时间</th>
                                      <th v-if="basicAttributes_auth.old.comments">注释</th>
                                      <th v-if="basicAttributes_auth.old.tag">标记</th>
                                      <th v-if="basicAttributes_auth.old.revision">版本号</th>
                                      <!--
                                            GCPropertyList:[],//扩展属性头部
                                            GCPropertyValueList:[],//扩展属性查询的值 库
                                      -->
                                       <th v-for="(item,key) in GCPropertyList" :key="key" v-if="item.checked">{{item.propertyTitle}}</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(val,index) in attributeList" :key="index">
                                      <td>
                                          <label  :class="[val.checked?'active':'','checkbox-fileItem']" :for="val.holderId+'Attribute'" ></label>
                                          <input  type="checkbox" :id="val.holderId+'Attribute'" class="checkbox-att" v-model="val.checked">
                                      </td>
                                      <td v-text="val.holderType"  v-if="basicAttributes_auth.old.holderType"></td>
                                      <td v-text="val.guid"  v-if="basicAttributes_auth.old.guid"></td>
                                      <td v-text="val.originalFile"  v-if="basicAttributes_auth.old.originalFile"></td>
                                      <td v-text="val.originalCategory"  v-if="basicAttributes_auth.old.originalCategory"></td>
                                      <td v-text="val.originalId"  v-if="basicAttributes_auth.old.originalId"></td>
                                      <td v-text="val.originalName"  v-if="basicAttributes_auth.old.originalName"></td>
                                      <td v-text="val.gccode"  v-if="basicAttributes_auth.old.gccode"></td>
                                      <td v-text="getGenieclassTitle(val.gccode)"  v-if="basicAttributes_auth.old.gccodeName"></td>
                                      <td v-text="val.name"  v-if="basicAttributes_auth.old.name"></td>
                                      <td v-text="val.creator"  v-if="basicAttributes_auth.old.creator"></td>
                                      <td v-text="val.editor"  v-if="basicAttributes_auth.old.editor"></td>
                                      <td v-text="val.updateTime"  v-if="basicAttributes_auth.old.updateTime"></td>
                                      <td v-text="val.comments"  v-if="basicAttributes_auth.old.comments"></td>
                                      <td v-text="val.tag"  v-if="basicAttributes_auth.old.tag"></td>
                                      <td v-text="val.revision"  v-if="basicAttributes_auth.old.revision"></td>
                                        <!--
                                            GCPropertyList:[],//扩展属性头部
                                            GCPropertyValueList:[],//扩展属性查询的值 库
                                      -->
                                     <td   v-if="item.checked" v-text="initVal(item.id,val.traceId)"  v-for="(item,key) in GCPropertyList" :key="key"></td>
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
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div v-if="screenLeft.item == 1" class="screenRight_1">
               111
            </div>
        </div>
        <div id="edit">
            <el-dialog title="基本属性" :visible="basicAttributes_auth.show" @close="basicCancle">
                <div class="clearfix" >
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.holderType?'active':'','checkbox-fileItem holderType_Attribute']" for="holderType_Attribute" ></label>
                          <input  type="checkbox" id="holderType_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.holderType">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.guid?'active':'','checkbox-fileItem guid_Attribute']" for="guid_Attribute" ></label>
                          <input  type="checkbox" id="guid_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.guid">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.originalFile?'active':'','checkbox-fileItem originalFile_Attribute']" for="originalFile_Attribute" ></label>
                          <input  type="checkbox" id="originalFile_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.originalFile">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.originalCategory?'active':'','checkbox-fileItem originalCategory_Attribute']" for="originalCategory_Attribute" ></label>
                          <input  type="checkbox" id="originalCategory_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.originalCategory">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.originalId?'active':'','checkbox-fileItem originalId_Attribute']" for="originalId_Attribute" ></label>
                          <input  type="checkbox" id="originalId_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.originalId">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.originalName?'active':'','checkbox-fileItem originalName_Attribute']" for="originalName_Attribute" ></label>
                          <input  type="checkbox" id="originalName_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.originalName">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.gccode?'active':'','checkbox-fileItem gccode_Attribute']" for="gccode_Attribute" ></label>
                          <input  type="checkbox" id="gccode_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.gccode">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.gccodeName?'active':'','checkbox-fileItem gccodeName_Attribute']" for="gccodeName_Attribute" ></label>
                          <input  type="checkbox" id="gccodeName_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.gccodeName">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.name?'active':'','checkbox-fileItem name_Attribute']" for="name_Attribute" ></label>
                          <input  type="checkbox" id="name_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.name">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.creator?'active':'','checkbox-fileItem creator_Attribute']" for="creator_Attribute" ></label>
                          <input  type="checkbox" id="creator_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.creator">
                    </span>
                    <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.editor?'active':'','checkbox-fileItem editor_Attribute']" for="editor_Attribute" ></label>
                          <input  type="checkbox" id="editor_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.editor">
                    </span>

                     <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.updateTime?'active':'','checkbox-fileItem updateTime_Attribute']" for="updateTime_Attribute" ></label>
                          <input  type="checkbox" id="updateTime_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.updateTime">
                    </span>
                     <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.comments?'active':'','checkbox-fileItem comments_Attribute']" for="comments_Attribute" ></label>
                          <input  type="checkbox" id="comments_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.comments">
                    </span>
                     <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.tag?'active':'','checkbox-fileItem tag_Attribute']" for="tag_Attribute" ></label>
                          <input  type="checkbox" id="tag_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.tag">
                    </span>
                     <span class="item-attibuteAuth">
                          <label  :class="[basicAttributes_auth.new.revision?'active':'','checkbox-fileItem revision_Attribute']" for="revision_Attribute" ></label>
                          <input  type="checkbox" id="revision_Attribute" class="checkbox-arr" v-model="basicAttributes_auth.new.revision">
                    </span>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="basicConfirm">确定</button>
                    <button class="editBtnC" @click="basicCancle">取消</button>
                </div>
            </el-dialog>
             <el-dialog title="显示扩展属性" :visible="extensionAttributesShow" @close="extensionCancle">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,key) in GCPropertyList_to_select" :key="key">
                          <label  :class="[item.extension_checked?'active':'','checkbox-fileItem']" :for="'extension_Attribute_'+key" ></label>
                          <input  type="checkbox" :id="'extension_Attribute_'+key" class="checkbox-arr" v-model="item.extension_checked">
                          <span  v-text="item.propertyTitle" class="text"></span>
                    </span>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="extensionConfirm">确定</button>
                    <button class="editBtnC" @click="extensionCancle">取消</button>
                </div>
            </el-dialog>
        </div>
</div>       
</template>
<style  lang='less'>
    #attributeManager{
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
        select.inp-search {  
                /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
                /*很关键：将默认的select选择框样式清除*/  
                appearance:none;  
                -moz-appearance:none;  
                -webkit-appearance:none;  
                /*在选择框的最右侧中间显示小箭头图片*/  
                /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
                padding-right: 14px;  
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
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                    position: relative;
                    &::after{
                        font-size: 14px;
                        color: #666666;
                        display: block;
                        position: absolute;
                        left: 24px;
                        width: 100px;
                        text-align: left;
                        top: 0;
                        line-height: 12px;
                    }
                }
                .holderType_Attribute::after{
                    content: '所在空间';
                }
                .guid_Attribute::after{
                    content: '元素GUID';
                }
                .originalFile_Attribute::after{
                    content: '原始文件';
                }
                .originalCategory_Attribute::after{
                    content: '原始分类';
                }
                .originalId_Attribute::after{
                    content: '原始ID';
                }
                .originalName_Attribute::after{
                    content: '原始名称';
                }
                .gccode_Attribute::after{
                    content: '类型编码';
                }
                .gccodeName_Attribute::after{
                    content: '类型名称';
                }
                .name_Attribute::after{
                    content: '构件名称';
                }
                .creator_Attribute::after{
                    content: '创建者';
                }
                .editor_Attribute::after{
                    content: '编辑者';
                }
                .updateTime_Attribute::after{
                    content: '更新时间';
                }
                .comments_Attribute::after{
                    content: '注释';
                }
                .tag_Attribute::after{
                    content: '标记';
                }
                .revision_Attribute::after{
                    content: '修订版本号';
                }
                .active{
                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
                }
                .checkbox-arr{
                    display: none;
                }
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
                    height: 68px;
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
                .active-version-3{//下边 版本 高显
                    .item-version{
                        z-index: 15;
                        &::after{
                            background: #fafafa;
                        }
                    }
                    .item-property::after{
                        background: #fff;
                    }
                    .item-version-3{
                        z-index: 10;
                        background: #fff;
                        color: #fc3439;
                        &::after{
                            background: #fff;
                        }
                    }
                }
                
            }
            #containerMessage{
                padding-left:30px; 
                padding-bottom: 65px;
                .header{
                    text-align: left;
                    margin: 15px 0;
                    .title{
                        font-size: 12px;
                        float: left;
                        color: #999999;
                        input{
                          width: 38px;
                          height: 20px;
                        }
                        .reset{
                          display: inline-block;
                            cursor: pointer;
                            width: 47px;
                            height: 24px;
                            line-height: 22px;
                            text-align: center;
                            color: #666666;
                            border: 1px solid #e6e6e6;
                            background: #ffffff;
                            border-radius: 2px;
                            font-size: 12px;
                            &:hover{
                                background: #e6e6e6;
                                color: #666;
                            }
                        }
                    }
                    .item-btn{
                       float: left;
                        margin-right: 30px;
                        label{
                          float:left;
                          width:74px;
                          height:26px;
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
                    }
                    .item-upload{
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
                            background: url('./images/edit_white.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    color: #999999;
                    font-size: 12px;
                    margin-right: 30px;
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
                                }
                                &:hover{
                                    background: #fafafa;
                                }
                            }
                        }
                    }
                     /**********一下是分页器的样式***************/
                    .datagrid-pager {
                        display: block;
                        margin-right: 30px;
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
        /*
        右侧
        */
        .box-right-container{
            display: block;
            position: fixed;
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
                    float: left;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
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
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'

export default {
  name:'Costover',
  components:{
        
  },
  data(){
      return {
         screenLeft:{
             show:true,
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
             basicAttributes:false,
             BindingArtifacts:false
         },
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
        basicAttributes_auth:{
            show:false,
            new:{
                holderType:true,//所在空间
                guid:false,//元素GUID
                originalFile:true,//原始文件
                originalCategory:true,//原始分类
                originalId:false,//原始ID
                originalName:true,//原始名称
                gccode:false,//类型编码
                gccodeName:true,//类型名称
                name:false,//构件名称
                creator:false,//创建者
                editor:true,//编辑者
                updateTime:true,//更新时间
                comments:true,//注释
                tag:true,//标记
                revision:true,//修订版本号
            },
            old:{
                holderType:true,//所在空间
                guid:false,//元素GUID
                originalFile:true,//原始文件
                originalCategory:true,//原始分类
                originalId:false,//原始ID
                originalName:true,//原始名称
                gccode:false,//类型编码
                gccodeName:true,//类型名称
                name:false,//构件名称
                creator:false,//创建者
                editor:true,//编辑者
                updateTime:true,//更新时间
                comments:true,//注释
                tag:true,//标记
                revision:true,//修订版本号
            }
        },//这是基本属性的table展示列表
        extensionAttributesShow:false,//扩展属性显隐
        pageDetial:{
            pagePerNum:10,//一页几份数据
            currentPage:1,//初始查询页数 第一页
            total:'',//所有数据
        },
        empty:false,
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
    //   <!-- options_monomer:[],//单体选项
    //     options_partition:[],//状态选项
    //     options_floor:[],//相关选项 -->
      value_monomer:function(val){
            var vm = this 
             if(val == 0) {
                vm.options_partition = [
                    {
                        id:'0',
                        Name:'无'
                }]
                    vm.options_floor = [
                    {
                        id:'0',
                        Name:'无'
                    }
                ]
            }else {
                vm.getPartitionBySubProjId() //加载分区
            }
      },
       value_partition:function(val){
            var vm = this 
            vm.findStorey()
      },
      value_professional:function(val){
            var vm = this 
            vm.getGenieClass(2)
      },
      value_system:function(val){
            var vm = this 
            vm.getGenieClass(3)
      },
      'show.basicAttributes':function(val){
          if(val){
            $("#basicAttributes").show(200);
          }else{
            $("#basicAttributes").hide(200);
          }
      },
     'show.BindingArtifacts':function(val){
          if(val){
            $("#BindingArtifacts").show(200);
          }else{
            $("#BindingArtifacts").hide(200);
          }
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
      showExtension(){
          var vm = this
          if(vm.GCPropertyList.length >0){
               vm.extensionAttributesShow = true
          }else{
              vm.$message({
                  type:'warning',
                  message:'没有扩展属性!'
              })
          }
      },
      initVal(id,traceId){
          /**
           * @param id 扩展属性headr id
           * @param traceId row列表traceId
           * **/
        var vm = this
        var valueFrom=1
        var pValue=""
        if(vm.GCPropertyValueList.length>0){
            for(var k=0;k<vm.GCPropertyValueList.length;k++) {
                if(vm.GCPropertyValueList[k].projectGcPropertyId == id && vm.GCPropertyValueList[k].traceId == traceId){
                    valueFrom=vm.GCPropertyValueList[k].valueFrom
                    pValue= vm.GCPropertyValueList[k].propertyValue
                    break
                }
            }
        }
        return pValue
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
      extensionCancle(){
         var vm =this
          vm.extensionAttributesShow = false
           vm.GCPropertyList.forEach((item,index)=>{
              if(item.checked){
                  vm.GCPropertyList_to_select[index].extension_checked = true
              }else{
                  vm.GCPropertyList_to_select[index].extension_checked = false
              }
          })
      },
      extensionConfirm(){
          var vm = this
          vm.extensionAttributesShow = false
          vm.GCPropertyList_to_select.forEach((item,index)=>{
              if(item.extension_checked){
                  vm.GCPropertyList[index].checked = true
              }else{
                  vm.GCPropertyList[index].checked = false
              }
          })
      },
      basicCancle(){
          var vm =this
          vm.basicAttributes_auth.show = false
          var b = {}
          $.extend(b,vm.basicAttributes_auth.old)
          vm.basicAttributes_auth.new = b
      },
      basicConfirm(){
          var vm = this
          vm.basicAttributes_auth.show = false
          var b = {}
          $.extend(b,vm.basicAttributes_auth.new)
          vm.basicAttributes_auth.old = b
      },
      getGenieClass(level,val){
            var vm = this
            var parentClassifyCode='';
            var gcCode = vm.value_professional
            var gcCode1 = vm.value_system
            var gcCode2 = vm.value_type
            if(level==2){
                parentClassifyCode= vm.value_professional
                vm.options_type = [
                    {
                        id:'0',
                        Name:'无'
                    },
                ]
            }else if(level==3){
                parentClassifyCode = vm.value_system
                if(parentClassifyCode==0){
                     vm.options_type = [
                        {
                            id:'0',
                            Name:'无'
                        },
                    ]
                }else if(parentClassifyCode==-1){
                    vm.options_type = [
                        {
                            id:'0',
                            Name:'无'
                        },
                        {
                            id:'-1',
                            Name:'全部'
                        },
                    ]
                }
            }
            if(parentClassifyCode==-1 || parentClassifyCode==0){
                return false
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/dc/getGenieClass',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    level:level,
                    parentClassifyCode:parentClassifyCode
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null && response.data.rt.length > 0){
                        if(level == 2){
                            vm.options_system = [
                                {
                                    id:'0',
                                    Name:'无'
                                },
                                {
                                    id:'-1',
                                    Name:'全部'
                                }
                            ]
                            response.data.rt.forEach((item,key)=>{
                                vm.options_system.push({
                                        id:item.number,
                                        Name:item.title
                                })//分区列表
                            })
                        }else if(level == 3){
                            vm.options_type = [
                                {
                                    id:'0',
                                    Name:'无'
                                },
                                {
                                    id:'-1',
                                    Name:'全部'
                                }
                            ]
                            response.data.rt.forEach((item,key)=>{
                                vm.options_type.push({
                                        id:item.number,
                                        Name:item.title
                                })//分区列表
                            })
                        }
                      
                    }else{
                        if(level == 2){
                             vm.options_system = [
                                {
                                    id:'0',
                                    Name:'无'
                            },
                            {
                                    id:'-1',
                                    Name:'全部'
                            }]
                        }else if(level == 3){
                             vm.options_type = [
                                {
                                    id:'0',
                                    Name:'无'
                            },{
                                    id:'-1',
                                    Name:'全部'
                            }]
                        }
                       
                    }
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      getPartitionBySubProjId(){
          var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/getPartitionBySubProjId',
            headers:{
                'token':vm.token
            },
            params:{
                subProjId:vm.value_monomer
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                 vm.options_partition = [
                        {
                        id:'0',
                        Name:'无'
                    },
                    {
                        id:'-1',
                        Name:'全部'
                    }
                ]
                vm.options_floor = [
                    {
                        id:'0',
                        Name:'无'
                    }
                ]
                if(response.data.rt != null && response.data.rt.length > 0){
                    response.data.rt.forEach((item,key)=>{
                          vm.options_partition.push({
                                id:item.ID,
                                Name:item.Name
                          })//分区列表
                    })
                }               
            }
        }).catch((err)=>{
            console.log(err)
        })
      },    
      findStorey(){
            var vm = this
            if(vm.value_partition==-1){
                vm.options_floor = [
                    {
                        id:'0',
                        Name:'无'
                    },
                    {
                        id:'-1',
                        Name:'全部'
                    }
                ]
                return false
            }
            if(vm.value_partition==0){
                 vm.options_floor = [
                    {
                        id:'0',
                        Name:'无'
                    },
                ]
                return false
            }
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/dc/findStorey/'+vm.value_partition,
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null && response.data.rt.rows.length > 0){
                        vm.options_floor = [
                            {
                                id:'0',
                                Name:'无'
                            },
                            {
                                id:'-1',
                                Name:'全部'
                            }
                        ]
                        response.data.rt.rows.forEach((item,key)=>{
                            vm.options_floor.push({
                                    id:item.ID,
                                    Name:item.Name
                            })//分区列表
                        })
                    }else{
                        vm.options_floor = [
                            {
                                id:'0',
                                Name:'无'
                        }]
                    }
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      getGenieclassTitle(gcCode){
            /**
             *
             * @param GenieclassTitle  类型信息列表
             * @param gcCode  类型编码
             * @param typeName  专业+系统
             * @returns {*}
             */
            var vm = this
            var typeName='';
          //   @param   value_professional:'-1',//专业 筛选关键字
          //   @param        value_system:'-1',//系统 筛选关键字
          //   @param        value_type:'-1',//类型 筛选关键字
            if(vm.value_professional != -1){
                typeName= vm.$refs.professional.selectedLabel +"-"
            }
            if(vm.value_system !=-1 && vm.value_system !=0){
                typeName+=vm.$refs.system.selectedLabel+"-"
            }
            if((vm.value_system ==-1 || vm.value_system ==0) && vm.value_type ==-1 || vm.value_type ==0){
                typeName=''
            }
            if(vm.GenieclassTitle && vm.GenieclassTitle.length>0){
                  for(var i=0;i<vm.GenieclassTitle.length;i++){
                      if(vm.GenieclassTitle[i].classifyCode==gcCode){
                          return typeName+vm.GenieclassTitle[i].classifyName;
                      }
                  }
            }
            return '';
      },
      editAttribute(){
          var vm = this
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
          if(isNaN(vm.dataVision) || vm.dataVision <=0 || vm.dataVision>vm.holderMaxVersion){
            vm.$message({
              type:'warning',
              message:'数据版本只能是1到'+vm.holderMaxVersion+'的正整数！'
            })
            return false
          }
          vm.fullscreenLoading = true
          /**
           * 下面是判断单体和单体类型
           * **/
          var holderId=''
          var isChildren=1
          var selectBuild=3//单体选择 1：选择了总体场地，2：全部单体，3：单个单体
          var holderType=7//6:场地，7：单体，8：分区，9：楼层
          if(vm.value_monomer == 0) {
              selectBuild = 1
              holderType=6
          }else if(vm.value_monomer == 'all'){
              selectBuild=2
              holderType=7
          }else{
              selectBuild=3
          }

          if(vm.value_monomer != -1){
              holderId = vm.value_monomer
              if(vm.value_partition!=-1){
                  if(vm.value_partition==0){//分区选择了（无）
                      isChildren=0
                  }else {
                      holderType=8
                      holderId = vm.value_partition
                      if (vm.value_floor != -1) {
                          isChildren=0
                          if(vm.value_floor==0){//楼层选择了（无）
                              //isChildren=0;
                          }else {
                              holderType=9
                              holderId = vm.value_floor
                          }
                      }else{
                          holderType = 9
                      }
                  }
              }else{
                      holderType = 8
                      if (vm.value_floor != 0) {
                          holderType = 9
                      }
              }
          }
          /**
           * 以下是第二行筛选的值
           * @param   value_professional:'-1',//专业 筛选关键字
            @param        value_system:'-1',//系统 筛选关键字
            @param        value_type:'-1',//类型 筛选关键字
           * **/
          
          var gcCode = vm.value_professional
          var gcCode1 = vm.value_system
          var gcCode2 = vm.value_type
          var gcNumber=''
          if(vm.value_professional!=-1){ //专业
              if(vm.value_system ==0){
                  gcNumber = vm.value_professional
              }else {
                  gcNumber = vm.value_professional
                  if (vm.value_system  != -1) { //系统
                      if (vm.value_type == 0) {
                          gcNumber = vm.value_system 
                      } else {
                          gcNumber = vm.value_system 
                          if (vm.value_type != -1) {//类型
                              gcNumber = vm.value_type
                          }
                      }
                  }
              }
          }
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
                  if(response.data.rt.gridDataJson.rows != null){
                    vm.empty = false
                    vm.attributeList = response.data.rt.gridDataJson.rows
                    vm.GCPropertyList = response.data.rt.gcproperty//扩展属性头部
                    var b = []
                    $.extend(b,vm.GCPropertyList)
                    vm.GCPropertyList_to_select = b//扩展属性头部
                    vm.GCPropertyValueList = response.data.rt.gcpropertyValue//扩展属性查询的值 库
                    vm.pageDetial.total = response.data.rt.gridDataJson.total
                    vm.attributeList.forEach(element => {
                        vm.$set(element,'checked',false)
                    });
                    vm.GCPropertyList.forEach(element => {
                        vm.$set(element,'checked',true)
                    })
                    vm.GCPropertyList_to_select.forEach(element => {
                        vm.$set(element,'extension_checked',true)
                    })
                  }else{
                    vm.empty = true
                    vm.pageDetial.total = 0
                    vm.attributeList = []
                    vm.GCPropertyList = []//扩展属性头部
                    vm.GCPropertyList_to_select = []
                    vm.GCPropertyValueList = []//扩展属性查询的值 库
                  }
                  if(response.data.rt.genieclassTitle != null){
                    vm.GenieclassTitle = response.data.rt.genieclassTitle
                  }else{
                    vm.GenieclassTitle = []
                  }
              }
              vm.fullscreenLoading = false
          }).catch((err)=>{
              console.log(err)
          })
      },
  }
}
</script>
