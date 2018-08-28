<template>
<div id="attributeManager" v-loading.fullscreen.lock="fullscreenLoading">
        <div :class="[{'box-left-avtive':!screenLeft.show,'box-left-avtive_pre':!SHOWMain},'box-left-container']">
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
                <div id="containerMessage" v-show="SHOWMain">
                    <p class="header clearfix">
                        <span class="title">
                          数据版本 <input type="tel" v-model="dataVision">/{{holderMaxVersion}}
                           <span class="reset" @click="selectData">重设</span>
                        </span>
                        <span style="float: right;">
                            <span class="item-btn clearfix">
                                <label @click="SHOWMain = false;getPrevData()">专业预设</label>
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
                                  <el-select v-model="value_monomer" @change="canSearch = true" placeholder="请选择">
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
                                  <el-select v-model="value_partition" @change="canSearch = true" placeholder="请选择">
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
                                  <el-select v-model="value_floor" @change="canSearch = true" placeholder="请选择">
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
                                  <el-select v-model="value_professional" @change="canSearch = true" ref="professional" placeholder="请选择">
                                      <el-option
                                      v-for="item in option_professional"
                                      :key="item.key"
                                      :label="item.Name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">系统</span>
                                  <el-select v-model="value_system" @change="canSearch = true" ref="system" placeholder="请选择">
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
                                  <el-select v-model="value_type" @change="canSearch = true" ref="type" placeholder="请选择">
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
                        <p class="selectBar clearfix" v-if="!ShowModel">
                          <span class="name">模板筛选</span>
                          <ul>
                              <li class="selectItem">
                                  <span class="title">类别</span>
                                  <el-select v-model="value_leibie" @change="canSearch = true" ref="professional" placeholder="请选择">
                                      <el-option
                                      v-for="item in model_leibie"
                                      :key="item.key"
                                      :label="item.name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">模板</span>
                                  <el-select v-model="value_model" @change="canSearch = true" ref="system" placeholder="请选择">
                                      <el-option
                                      v-for="item in option_model"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                              <li class="selectItem">
                                  <span class="title">类型</span>
                                  <el-select v-model="value_typeC" @change="canSearch = true" ref="type" placeholder="请选择">
                                      <el-option
                                      v-for="item in option_typeC"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                      </el-option>
                                  </el-select>
                              </li>
                          </ul>
                        </p>
                    </div>
                    <p class="btn-selection clearfix">
                       <button :class="['redbtn',{'disabledBtn':!canSearch}]" @click="pageDetial.currentPage = 1;selectData()" :disabled="canSearch?false:'disabled'">筛选</button>
                       <span class="whitebtn" v-if="ShowModel" @click="showMore">更多</span>
                    </p>
                    <div class="project" v-loading="loading">
                        <!--以下是列表-->
                        <div style="overflow: auto;margin-top:10px;">
                          <table class="UserList" border="1" width='100%'>
                              <thead>
                                  <tr  class="userList-thead">
                                      <th width="34px;" style="padding-right:10px;">
                                          <label  :class="[checkAll?'active':'','checkbox-fileItem']" for="allAttribute" @click="initAll()"></label>
                                          <input  type="checkbox" id='allAttribute' class="checkbox-att" v-model="checkAll" >
                                      </th>
                                      <th v-if="GCPropertyList.length>0">定位</th>
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
                                  <tr v-for="(val,index) in attributeList" :key="index" :class="[val.checked?'activeTr':'']" @click.stop="checkLabel(index,false)">
                                      <td>
                                          <label  :class="[val.checked?'active':'','checkbox-fileItem']"  @click.stop="checkLabel(index,true)"></label>
                                      </td>
                                      <td  v-if="GCPropertyList.length>0">
                                          <i class="location"></i>
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
                                     <td   v-if="item.checked" v-text="initVal(item.id,val.traceId,false)" :class="[{'Strong':(initVal(item.id,val.traceId,true)==1)}]"  v-for="(item,key) in GCPropertyList" :key="key"></td>
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
                 <div id="containerMessage" v-show="!SHOWMain">
                    <p class="header clearfix">
                        <span class="button-add" @click="add()">添加</span>
                        <span class="button-back" @click="SHOWMain = true">返回</span>
                    </p>
                    <div class="ForumSelector">
                        <p  class="selectBar clearfix">
                          <span class="name">专业</span>
                          <ul>
                             <li :class="['selectItem-preset',{'selectItem-preset-active':item.checked}]" @click="initSelect(key)" v-for="(item,key) in option_professional_preset" :key="key" v-text="item.Name" :data-value="item.id"></li>
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
                                  <tr v-for="(val,index) in professionalList" :key="index">
                                        <td v-text="val.holderPathName"></td>
                                        <td v-text="val.gcName"></td>
                                        <td v-text="val.pGcName"></td>
                                        <td v-text="val.pValue"></td>
                                        <td >
                                            <button class="editBtn actionBtn" title="修改"  @click="edit(val)" ></button>
                                            <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.pkId)" ></button>
                                        </td>
                                  </tr>
                              </tbody>
                          </table>
                            <div v-if="empty" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                                  无符合当前筛选条件的记录
                            </div>
                        </div>
                        <!--以下是page-navigitation-->
                        <div class="datagrid-pager pagination" v-if="professionalList.length>0">
                            <table cellspacing="0" cellpadding="0" border="0" >
                              <tbody>
                                  <tr>
                                      <td>
                                          <select class="pagination-page-list" v-model="pre_pageDetial.pagePerNum">
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
                                              <input class="pagination-num" type="text" v-model="pre_pageDetial.currentPage">
                                        </td>
                                        <td>
                                            <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pre_pageDetial.total/pre_pageDetial.pagePerNum)}}页</span>
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
                                            <a href="javascript:void(0)" @click="getPrevData" class="btn-refresh btn-TAB"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="pagination-info pagination-title" v-text="'显示1到'+pre_pageDetial.pagePerNum+',共'+pre_pageDetial.total+'记录'"></div>
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']" v-if="SHOWMain">
            <div id="center-selection" v-if="SHOWMain">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property " @click="screenLeft.item = 1">属<br>性</span>
                        <span class="item-version " @click="screenLeft.item = 2">模<br>板</span>
                    </div>
            </div>
            <div v-show="screenLeft.show" v-if="screenLeft.item == 1" class="screenRight_1">
                <div v-if="ListCheckedNum == 1">
                        <h3 class="header-attribute" style="margin-top: 0px;">
                            <i class="trrangle"></i>
                            基本属性
                            <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                        </h3>
                        <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">所在空间</span>
                                <span class="detial-text-value" v-text="checkedItem.holderType?checkedItem.holderType:'（空）'" :title="checkedItem.holderType?checkedItem.holderType:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始文件</span>
                                <span class="detial-text-value" v-text="checkedItem.originalFile?checkedItem.originalFile:'（空）'" :title="checkedItem.originalFile?checkedItem.originalFile:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">原始ID</span>
                                <span class="detial-text-value" v-text="checkedItem.originalId?checkedItem.originalId:'（空）'" :title="checkedItem.originalId?checkedItem.originalId:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件名称</span>
                                <span class="detial-text-value" v-text="checkedItem.originalName?checkedItem.originalName:'（空）'" :title="checkedItem.originalName?checkedItem.originalName:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">脚本名称</span>
                                <span class="detial-text-value" v-text="checkedItem.name?checkedItem.name:'（空）'" :title="checkedItem.name?checkedItem.name:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">分类编码</span>
                                <span class="detial-text-value" v-text="checkedItem.gccode?checkedItem.gccode:'（空）'" :title="checkedItem.gccode?checkedItem.gccode:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">构件分类</span>
                                <span class="detial-text-value" v-text="getGenieclassTitle(checkedItem.gccode)" :title="getGenieclassTitle(checkedItem.gccode)"></span>
                            </li>
                        
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">创建程序</span>
                                <span class="detial-text-value" v-text="checkedItem.creator?checkedItem.creator:'（空）'" :title="checkedItem.creator?checkedItem.creator:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新用户</span>
                                <span class="detial-text-value" v-text="checkedItem.editor?checkedItem.editor:'（空）'" :title="checkedItem.editor?checkedItem.editor:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">更新时间</span>
                                <span class="detial-text-value" v-text="checkedItem.updateTime?checkedItem.updateTime:'（空）'" :title="checkedItem.updateTime?checkedItem.updateTime:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">标记</span>
                                <span class="detial-text-value" v-text="checkedItem.tag?checkedItem.tag:'（空）'" :title="checkedItem.tag?checkedItem.tag:'（空）'"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">注释</span>
                                <span class="detial-text-value" v-text="checkedItem.comments?checkedItem.comments:'（空）'" :title="checkedItem.comments?checkedItem.comments:'（空）'"></span>
                            </li>
                        </ul>
                        <div v-if="mapInfo!=null && mapInfo.length>0" style="margin-top:13px;">
                            <h3 class="header-attribute" style="margin-top: 0px;">
                                <i class="trrangle"></i>
                                设计属性
                                <i :class="[{'active':show.designAttributes},'icon-dropDown']" @click="show.designAttributes = show.designAttributes?false:true;"></i>
                            </h3>
                            <ul id="designAtt" :class="[{'show':show.designAttributes},'Att']" >
                                <li class="detial-item clearfix" v-for="(item,index) in mapInfo" :key="index">
                                    <span class="detial-text-name" v-text="item.classifyName"></span>
                                    <span class="detial-text-value" v-text="item.value?item.value:'（空）'" :title="item.value?item.value:'（空）'"></span>
                                </li>
                            </ul>
                        </div>
                        <div v-if="GCPropertyList!= null && GCPropertyList.length>0" style="margin-top:13px;">
                            <h3 class="header-attribute" style="margin-top: 0px;">
                                <i class="trrangle"></i>
                                扩展属性
                                <i :class="[{'active':show.extensionAttributes},'icon-dropDown']" @click="show.extensionAttributes = show.extensionAttributes?false:true;"></i>
                            </h3>
                            <ul id="extensionAtt" :class="[{'show':show.extensionAttributes},'Att']" >
                                <li class="detial-item clearfix" v-for="(item,index) in GCPropertyList" :key="index">
                                    <span class="detial-text-name" v-text="item.propertyTitle"></span>
                                    <span class="detial-text-value" v-text="initVal(item.id,checkedItem.traceId,false)" :title="initVal(item.id,checkedItem.traceId,false)"></span>
                                </li>
                            </ul>
                        </div>
                        <div  style="margin-top:13px;">
                            <h3 class="header-attribute" style="margin-top: 0px;">
                                <i class="trrangle"></i>
                                关联文档
                                <i :class="[{'active':show.relevantDoc},'icon-dropDown']" @click="show.relevantDoc = show.relevantDoc?false:true;"></i>
                            </h3>
                            <ul id="relevantDoc" :class="[{'show':show.relevantDoc},'Att']" v-if="fgList!=null && fgList.length>0">
                                <li class="detial-item clearfix" v-for="(item,index) in fgList" :key="index">
                                    <span class="detial-text-name" v-text="item.fgName" style="max-width: 120px;width: auto;float: left;"></span>
                                    <span class="icon-goujian icon-search" @click="view(item.filePath)"></span>
                                </li>
                            </ul>
                        </div>
                </div>
                <div v-if="ListCheckedNum > 1">
                     <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        多个选择
                        <i :class="[{'active':show.designAttributes},'icon-dropDown']" @click="show.designAttributes = show.designAttributes?false:true;"></i>
                    </h3>
                    <ul class="Att" >
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">构件数量</span>
                            <span class="detial-text-value" v-text="ListCheckedNum"></span>
                        </li>
                    </ul>
                     <!-- <div style="margin-top:13px;">
                        <h3 class="header-attribute" style="margin-top: 0px;">
                            <i class="trrangle"></i>
                            公共属性
                            <i :class="[{'active':show.designAttributes},'icon-dropDown']" @click="show.designAttributes = show.designAttributes?false:true;"></i>
                        </h3>
                        <ul  :class="[{'show':show.designAttributes},'Att']" >
                            <li class="detial-item clearfix" v-for="(item,index) in mapInfo" :key="index">
                                <span class="detial-text-name" v-text="item.classifyName"></span>
                                <span class="detial-text-value" v-text="item.value?item.value:'（空）'"></span>
                            </li>
                        </ul>
                    </div> -->
                </div>
            </div>
             <div v-show="screenLeft.show" v-if="screenLeft.item == 2" class="screenRight_1">
                 <h3 class="header-attribute" style="margin-top: 0px;">
                    <i class="trrangle"></i>
                    族
                    <i :class="[{'active':show.extensionAttributes},'icon-dropDown']" @click="show.extensionAttributes = show.extensionAttributes?false:true;"></i>
                </h3>
                <ul id="extensionAtt" :class="[{'show':show.extensionAttributes},'Att']" >
                    <li class="detial-item clearfix" v-for="(item,index) in templateInfos0Data" :key="index">
                        <span class="detial-text-name">{{item.key}}:</span>
                        <span class="detial-text-value">{{item.value}}</span>
                    </li>
                </ul>
                <h3 class="header-attribute" style="margin-top: 0px;">
                    <i class="trrangle"></i>
                    族类别
                    <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                </h3>
                <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']" >
                    <li class="detial-item clearfix" v-for="(item,index) in templateInfos1Data" :key="index">
                        <span class="detial-text-name">{{item.key}}:</span>
                        <span class="detial-text-value">{{item.value}}</span>
                    </li>
                </ul>
                <h3 class="header-attribute" style="margin-top: 0px;">
                    <i class="trrangle"></i>
                    族类型
                    <i :class="[{'active':show.relevantDoc},'icon-dropDown']" @click="show.relevantDoc = show.relevantDoc?false:true;"></i>
                </h3>
                <ul id="relevantDoc" :class="[{'show':show.relevantDoc},'Att']" >
                    <li class="detial-item clearfix" v-for="(item,index) in templateInfos2Data" :key="index">
                       <span class="detial-text-name">{{item.key}}:</span>
                        <span class="detial-text-value">{{item.value}}</span>
                    </li>
                </ul>
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
                          <label  v-text="item.propertyTitle" class="text" :for="'extension_Attribute_'+key"></label>
                    </span>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="extensionConfirm">确定</button>
                    <button class="editBtnC" @click="extensionCancle">取消</button>
                </div>
            </el-dialog>
             <el-dialog :title="'编辑属性(已勾选'+extension.num+'个构件)'" :visible="extension.show" @close="editCancle">
                <div class="table-extension" >
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th  width="100px">属性</th>
                                <th width="60px">值类型</th>
                                <th>取值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in GCPropertyList" :key="index">
                                <td v-text="val.propertyTitle"></td>
                                <td v-text="initValue(val.valueType)"></td>
                                <td :class="val.extendValue">
                                    <input :class="['inputvalue','property_value'+index]" type="text" v-if="val.valueType == 0 || val.valueType == 1" v-model="val.extendValue"/>
                                    <select style="width: 140px;" :class="['inputvalue-select','property_value'+index]" v-if="val.valueType == 2" v-model="val.extendValue">
                                        <option value="是">是</option> 
                                        <option value="否">否</option>
                                        <option value='@'>@</option>
                                    </select>
                                    <span  v-if="val.valueType == 3"  :class="['inputvalue-date','property_value'+index]">
                                        <!-- <input class=""  width="40px;" v-model="val.extendValue"/> -->
                                         <el-date-picker
                                            v-model="val.extendValue"
                                            :editable="false"
                                            type="date"
                                            placeholder="选择日期"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd"
                                            :disabled="val.timeChecked"
                                            >
                                        </el-date-picker>
                                          <input  type="checkbox" :id="index+'_allAttribute'" class="checkbox-att" v-model="val.timeChecked">
                                         <label  :class="[val.timeChecked?'active':'','checkbox-fileItem']"  :for="index+'_allAttribute'"></label>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editConfirm">确定</button>
                    <button class="editBtnC" @click="editCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog :title="pretitle" :visible.sync="preAddEdit.show" @close="addEditCancle">
                 <!-- object:{
                    monomer: '',//单体 筛选关键词
                    partition: '',//分区 筛选关键词
                    floor: '',//单体 筛选关键词
                    system:'',//系统 筛选关键字
                    type:'',//类型 筛选关键字
                    name:'',//属性名称
                    value:'',//属性取值
                } -->
                <div class="editBody">
                    <div class="editBodytwo clearfix">
                        <label class=" imageBodyText">空间范围 :</label>
                        <span class="item-select" id="monomer">
                             <el-select v-model="preAddEdit.object.monomer" @change="monomerChange"   multiple placeholder="单体">
                                <el-option
                                    v-for="(item,index) in options_monomer_pre"
                                    :key="index"
                                    :label="item.Name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                         <span class="item-select" id="partition">
                              <el-select v-model="preAddEdit.object.partition" @change="partitionChange" multiple placeholder="分区">
                                <el-option
                                    v-for="(item,index) in options_partition_pre"
                                    :key="index+item.Name"
                                    :label="item.Name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                         <span class="item-select" id="floor">
                            <el-select v-model="preAddEdit.object.floor"  multiple placeholder="楼层">
                                <el-option
                                    v-for="(item,index) in options_floor_pre"
                                    :key="index"
                                    :label="item.Name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                      <div class="editBodytwo clearfix">
                        <label class=" imageBodyText">构件类型 :</label>
                        <span class="item-select" style="width:212px;" id="system">
                              <el-select v-model="preAddEdit.object.system" @change="systemChange" placeholder="构件大类">
                                <el-option
                                    v-for="(item,index) in options_system_pre"
                                    :key="index"
                                    :label="item.Name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                         <span class="item-select" style="width:212px;" id="type">
                              <el-select v-model="preAddEdit.object.type" @change="typeChange(null)"  placeholder="构件小类">
                                <el-option
                                    v-for="(item,index) in options_type_pre"
                                    :key="index"
                                    :label="item.Name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                    <div class="editBodytwo clearfix">
                        <label class=" imageBodyText">属性名称 :</label>
                        <span class="item-select" style="width:212px;">
                            <select class="editSelect" v-model="preAddEdit.object.name" ref="attributeName" @change="nameChange(true)">
                                <option v-for="(item,index) in options_name" :value="item.propertyNumber"  :key="index">{{item.propertyTitle}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </div>
                     <div class="editBodytwo clearfix">
                        <label class=" imageBodyText">取值 :</label>
                        <div v-if="preAddEdit.object.name != ''">
                            <input type="text" class="inp" v-model="preAddEdit.object.value" v-if="preAddEdit.object.valueType == 0 || preAddEdit.object.valueType == 1"  placeholder="请输入">
                            <span class="item-select" style="width:212px;" v-if="preAddEdit.object.valueType == 2">
                                <select  class="editSelect"   v-model="preAddEdit.object.value">
                                    <option value="是">是</option> 
                                    <option value="否">否</option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </span>
                            <span  v-if="preAddEdit.object.valueType == 3"  class="inputvalue-date">
                                <el-date-picker
                                    v-model="preAddEdit.object.value"
                                    :editable="false"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    >
                                </el-date-picker>
                            </span>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addEditPreConfirm">确认</button>
                    <button class="editBtnC" @click="addEditCancle">取消</button>
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
                    background: #fff;
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
             .table-extension{
                 margin: 0 30px;
                .UserList{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    overflow: auto;
                    max-width: 100%;
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
                            height: 36px;
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
                                height: 36px;
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
                                .inputvalue{
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    border: none;
                                }
                                .inputvalue-select{
                                    width: 214px;
                                    border-radius: 2px;
                                    height: 30px;
                                    border: 1px solid #e6e6e6;
                                    position: relative;
                                    background: #fafafa;
                                    padding-left: 10px;
                                    padding-right: 40px;
                                    margin-top: 5px;
                                    -webkit-appearance: menulist;
                                    
                                }
                                .inputvalue-date{
                                    .el-input__inner{
                                        width: 100%;
                                        height: 36px;
                                        padding:0 30px;
                                    }
                                    .checkbox-fileItem{
                                        display: inline-block;
                                        //float: initial;
                                        margin-right: 10px;
                                        position: relative;
                                        &::after{
                                            display: block;
                                            position: absolute;
                                            top: -1px;
                                            right: -29px;
                                            line-height: 14px;
                                            content: '继承';
                                        }
                                    }
                                }
                            }
                            .Strong{
                                font-weight: bold;
                            }
                            &:hover{
                                background: #fafafa;
                            }
                        }
                        .activeTr{
                            background: #0081c2;
                            color: #fff;
                        }
                    }
                }
             }
             .imageBodyText{
                 float: left;
                 width: 140px;
                 text-align: right;
                 padding-right: 20px;
                 height: 38px;
                 line-height: 38px;
             }
             .inp{
                 float: left;
             }
             .editBodytwo{
                .item-select{
                    position: relative;
                    float: left;
                    margin-right: 10px;
                    width: 138px;
                    .el-select{
                        width: 100%;
                    }
                    .el-select__tags{
                        margin:0 5px;
                    }
                    .el-icon-close{
                      right: 0;
                      top: -2px;
                    }
                    .el-input__inner{
                        width: 100%;
                        padding-left: 10px;
                        height: 40px;
                    }
                    &:last-of-type{
                        margin-right: 0px;
                    }
                    .editSelect{
                        float: left;
                        width: 100%;
                        height: 38px;
                        padding: 10px;
                        border-radius: 2px;
                    }
                    .hideplace{
                        display: none;
                    }
                    .placeHolder{
                        display: block;
                        position: absolute;
                        width: auto;
                        height: 14px;
                        line-height: 14px;
                        color: #cccccc;
                        top: 12px;
                        left: 11px;
                    }
                     .icon-sanjiao {
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image: url('../Settings/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 15px;
                        right: 15px;
                    }
                }
                .inputvalue-date{
                    float: left;
                    .el-input{
                        width: 212px;
                    }
                    .el-input__inner{
                        width: 100%;
                        height: 36px;
                        padding:0 30px;
                    }
                    .checkbox-fileItem{
                        display: inline-block;
                        //float: initial;
                        margin-right: 10px;
                        position: relative;
                        &::after{
                            display: block;
                            position: absolute;
                            top: -1px;
                            right: -29px;
                            line-height: 14px;
                            content: '继承';
                        }
                    }
                }
             }
            
        }
        .box-left-container{
            // display: block;
            // position: fixed;
            // top: 115px;
            // left: 26px;
            // bottom: 0;
            // right: 225px;
            // // z-index: 1001;
            // transition:  all ease .5s;
            // overflow: auto;
            display: inline-block;
            width: 85%;
            position: relative;
            // margin-top:109px;
            // margin-left:24px;
            // z-index: 1001;
            transition:  all ease .5s;
            #containerMessage{
                padding-left:30px; 
                padding-bottom: 65px;
                margin-right: 30px;
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
                        label,.label-item{
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
                        .label-item{
                             border-right: none!important;
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
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    color: #999999;
                    font-size: 12px;
                    margin-bottom: 10px;
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
                            .selectItem-preset{
                                float: left;
                                margin: 0 20px;
                                height: 38px;
                                line-height: 38px;
                                color: #666666;
                                cursor: pointer;
                            }
                            .selectItem-preset-active{
                                color: #fc3439;
                            }
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
                                        width: 200px;
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
                    border: none;
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
                  .disabledBtn{
                       background: grey;
                        &:hover{
                            background: grey;
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
                                height: 36px;
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
                                    height: 36px;
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
            // margin-top: -763px;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            height: 785px;
            overflow-y: auto;
            overflow-x: hidden;
            #center-selection{
                // position: fixed;
                // top: 115px;
                // // bottom: 0;
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
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 30px;
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
                    margin-bottom: 5px;
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
            // border-left: 1px solid #cccccc;
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
        #extensionAtt{
            margin-bottom: 10px;
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
             basicAttributes:true,
             designAttributes:true,
             extensionAttributes:true,
             relevantDoc:true,
         },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        /*以下为后期添加数据*/
        options_monomer:[],//单体选项
        options_monomer_pre:[],
        options_partition:[
          {
              id:'0',
              Name:'无'
          },
        ],//分区选项
        options_partition_pre:[],
        options_floor:[
           {
              id:'0',
              Name:'无'
          },
        ],//楼层选项
        options_floor_pre:[],
        option_professional:[],
        option_professional_preset:[],
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
        options_system_pre:[],
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
        options_type_pre:[],
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
        ShowModel:true,//显示模板筛选选项
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
        pre_pageDetial:{
            pagePerNum:10,//一页几份数据
            currentPage:1,//初始查询页数 第一页
            total:'',//所有数据
        },
        empty:false,
        extension:{
            show:false,
            num:0,
        },
        checkedItem:{},//被选中的列表
        ListCheckedNum:0,
        mapInfo:[],//设计属性的列表
        fgList:[],//文档关联列表
        SHOWMain:true,
        checkedValue:'',
        professionalList:[],//扩展属性列表
        pretitle:'专业预设增加',
        preAddEdit:{
            show:false,
            object:{
                monomer: '',//单体 筛选关键词
                partition: '',//分区 筛选关键词
                floor: '',//单体 筛选关键词
                system:'',//系统 筛选关键字
                type:'',//类型 筛选关键字
                name:'',//属性名称
                value:'',//属性取值
                pkId:'',
                valueType:0
            }
        },
        options_name:[],//属性名称的列表
        canSearch:true,
        shownum:0,
        value_leibie:'',
        model_leibie:[],
        value_model:'',
        option_model:[],
        copyOption_model:[],
        value_typeC:'',
        option_typeC:[],
        copyoption_typeC:[],
        globalCode:'',
        globalBUildinInfo:'',
        templateInfos0Data:[],
        templateInfos1Data:[],
        templateInfos2Data:[],
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
        vm.getIntoDesignPage();
        //获取第三行参数
        this.getParams();
        this.getModelSelection(this.globalCode,this.globalBUildinInfo);
    },
    watch:{
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
                vm.getPartitionBySubProjId(false) //加载分区
                this.getParams();
                this.getModelSelection(this.globalCode,this.globalBUildinInfo);
            }
        },
        value_partition:function(val){
                var vm = this 
                vm.findStorey(false);
                this.getParams();
                this.getModelSelection(this.globalCode,this.globalBUildinInfo);
        },
        value_professional:function(val){
                var vm = this 
                vm.getGenieClass(2,false)
                this.getParams();
                this.getModelSelection(this.globalCode,this.globalBUildinInfo);
        },
        value_system:function(val){
                var vm = this 
                vm.getGenieClass(3,false)
                this.getParams();
                this.getModelSelection(this.globalCode,this.globalBUildinInfo);
        },
        'show.basicAttributes':function(val){
            if(val){
                $("#basicAtt").show(200);
            }else{
                $("#basicAtt").hide(200);
            }
        },
        'show.designAttributes':function(val){
            if(val){
                $("#designAtt").show(200);
            }else{
                $("#designAtt").hide(200);
            }
        },
        'show.extensionAttributes':function(val){
            if(val){
                $("#extensionAtt").show(200);
            }else{
                $("#extensionAtt").hide(200);
            }
        },
        'show.relevantDoc':function(val){
            if(val){
                $("#relevantDoc").show(200);
            }else{
                $("#relevantDoc").hide(200);
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
        'pre_pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.getPrevData()
        },
        'pre_pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.getPrevData()
        },
        checkedValue:function(val){
            var vm = this
            vm.getPrevData()
        },
        "value_type":function(){
            this.getParams();
            this.getModelSelection(this.globalCode,this.globalBUildinInfo);
        },
        "value_floor":function(){
            this.getParams();
            this.getModelSelection(this.globalCode,this.globalBUildinInfo);
        },
        "value_leibie":function(val,oldVal){
            let twoArr = [];
            if(val == 'ALL'){
                this.option_model = this.copyOption_model;
                if(this.option_model.length!=0){
                    this.value_model = this.option_model[0].id;
                }
            }else{
                this.copyOption_model.forEach(item=>{
                    if(val == item.parentID){
                        twoArr.push(item);
                    }
                });
                this.option_model = twoArr;
                this.option_model.unshift({
                    name:'全部',
                    id:'ALL'
                })
                this.value_model = this.option_model[0].id;
            }
        },
        "value_model":function(val,oldVal){
            let twoArr = [];
            if(val == 'ALL'){
                this.option_typeC = this.copyoption_typeC;
                if(this.option_typeC!=0){
                    this.value_typeC = this.option_typeC[0].id;
                }   
            }else{
                this.copyoption_typeC.forEach(item=>{
                    if(val == item.parentID){
                        twoArr.push(item);
                    }
                });
                this.option_typeC = twoArr;
                this.option_typeC.unshift({
                    name:'全部',
                    id:'ALL'
                })
                this.value_typeC = this.option_typeC[0].id;
            }
        }
    },
  methods:{
       nameChange(isInit){
            var vm = this 
            for(var i=0;i<vm.options_name.length;i++){
                if(vm.options_name[i].propertyNumber == vm.preAddEdit.object.name){
                    vm.preAddEdit.object.valueType = vm.options_name[i].valueType
                    if(isInit)vm.preAddEdit.object.value = ''
                    break
                }
            }
      },
      initAll(){
          var vm = this
          if(!vm.checkAll){
              vm.checkAll = true
                vm.attributeList.forEach((item,key)=>{
                    item.checked  = true
                })
          }else{
               vm.checkAll = false
             vm.attributeList.forEach((item,key)=>{
                item.checked  = false
            })
          }
      },
      typeChange(val){
        var vm = this
         axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/dc/getPgcData',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'token':vm.token
                },
                params:{
                    gcNumber:vm.preAddEdit.object.type,
                    projId:vm.projId,
                },
            }).then((response)=>{
                if(parseInt(response.data.cd) == 0){
                    if(response.data.rt != null){
                        vm.options_name = response.data.rt
                        if(val != null){
                             vm.preAddEdit.object.name = val
                        }else{
                            vm.preAddEdit.object.name = response.data.rt[0].propertyNumber
                            vm.nameChange(true)
                        }
                      
                    }else{
                        vm.options_name = []
                        vm.preAddEdit.object.name = ''
                    }
                  
                }
                if(vm.options_name.length == 0){
                    vm.$message({
                        type:'warning',
                        message:'无扩展属性！'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      systemChange(){
           var vm = this
           vm.getGenieClass(3,true)
      },
      partitionChange(){
          var vm = this
           vm.findStorey(true) //加载分区
      },
      monomerChange(val,index){
          var vm = this
          vm.getPartitionBySubProjId(true) //加载分区
      },
      addEditCancle(){
            var vm = this
            vm.preAddEdit.show = false
            vm.preAddEdit.object.monomer = []
            vm.preAddEdit.object.partition = []
            vm.preAddEdit.object.floor = []
            vm.options_name = []
            vm.preAddEdit.object.valueType = 0
            vm.preAddEdit.object.system = ''
            vm.preAddEdit.object.type = ''
            vm.preAddEdit.object.name = ''
            vm.preAddEdit.object.value = ''
      },
      add(){
          var vm = this
          vm.pretitle = '专业预设增加'
          vm.preAddEdit.show = true
          vm.getGenieClass(2,true)
      },
      edit(val){
            var vm = this 
            vm.preAddEdit.show = true
            vm.pretitle = '专业预设修改'
            //单体id 列表 
            var monomer_arr = val.holderBuild.split(',')
            if(monomer_arr.length > 0){
                vm.preAddEdit.object.monomer = monomer_arr
                //分区id 列表 
                if(val.holderPartition != ''){
                    vm.getPartitionBySubProjId(true) //加载分区
                    setTimeout(() => {
                        var Partition_arr = val.holderPartition.split(',')
                        if(Partition_arr.length > 0){
                            vm.preAddEdit.object.partition = Partition_arr
                              //列表id 列表 
                            if(val.holderStorey != ''){
                                vm.findStorey(true) //加载楼层
                                setTimeout(() => {
                                    var floor_arr = val.holderStorey.split(',')
                                    if(floor_arr.length > 0){
                                         vm.preAddEdit.object.floor = floor_arr
                                    }else{
                                         vm.preAddEdit.object.floor = []
                                    }
                                   
                                }, 0)
                            }else{
                                vm.preAddEdit.object.floor = []
                            }
                        }else{
                            vm.preAddEdit.object.partition = []
                            vm.preAddEdit.object.floor = []
                        }
                    }, 0)
                }else{
                    vm.preAddEdit.object.partition = []
                }
            }else{
                vm.preAddEdit.object.monomer = []
                vm.preAddEdit.object.partition = []
                vm.preAddEdit.object.floor = []
            }
            var Sys_type = val.gcName.split('-')
            vm.preAddEdit.object.system = ''
            vm.preAddEdit.object.type = ''
            if(Sys_type.length > 0){
                vm.getGenieClass(2,true)
                var timer3 = setInterval(function(){
                    if(vm.options_system_pre.length >0){
                        clearInterval(timer3)
                         for(var k=0;k<vm.options_system_pre.length;k++){
                            if(vm.options_system_pre[k].Name == Sys_type[0]){
                                vm.preAddEdit.object.system = vm.options_system_pre[k].id
                                //当存在构件大类时，此时判断存不存在构件小类
                                 if(Sys_type.length == 2){
                                        vm.getGenieClass(3,true)
                                        var timer = setInterval(function(){
                                            for(var k=0;k<vm.options_type_pre.length;k++){
                                                if(vm.options_type_pre[k].Name == Sys_type[1]){
                                                    clearInterval(timer)
                                                    vm.preAddEdit.object.type = vm.options_type_pre[k].id
                                                    vm.typeChange(val.pGcCode)
                                                    break
                                                }
                                            } 
                                        },100)
                                    }
                                break
                            }
                        }
                    }
                },100)
               
            }else{
                vm.preAddEdit.object.system =''
                vm.preAddEdit.object.type = ''
            }
            vm.preAddEdit.object.value = val.pValue

            if(val.pkId)vm.preAddEdit.object.pkId = val.pkId

            if(val.pValueType)vm.preAddEdit.object.valueType = val.pValueType
      },
      addEditPreConfirm(){
          var vm = this
        //    preAddEdit:{
        //     show:false,
        //     object:{
        //         monomer: '',//单体 筛选关键词
        //         partition: '',//分区 筛选关键词
        //         floor: '',//单体 筛选关键词
        //         system:'',//系统 筛选关键字
        //         type:'',//类型 筛选关键字
        //         name:'',//属性名称
        //         value:'',//属性取值
        //     }
        var type = 1
        var holderPathName = ''
        var monomerName = $('#monomer .el-select__tags-text')
        var monomerValue = ''
        if(vm.preAddEdit.object.monomer.length == 0){
            vm.$message({
                type:'warning',
                message:'请选择空间范围!'
            })
            return false
        }
        for(var i=0;i<monomerName.length;i++){
            if(monomerValue == ''){
                monomerValue = monomerName[i].innerHTML
            }else{
                monomerValue += '/'+ monomerName[i].innerHTML
            }
        }
        var partitionName = $('#partition .el-select__tags-text')
        var partitionValue = ''
        if(partitionName.length > 0){
           type = 2
        }
        for(var i=0;i<partitionName.length;i++){
            if(monomerValue == ''){
                partitionValue = partitionName[i].innerHTML
            }else{
                partitionValue += '/'+ partitionName[i].innerHTML
            }
        }
         var floorName = $('#floor .el-select__tags-text')
        var floorValue = ''
         if(floorName.length > 0){
           type = 3
        }
        for(var i=0;i<floorName.length;i++){
            if(floorValue == ''){
                floorValue = floorName[i].innerHTML
            }else{
                floorValue += '/'+ floorName[i].innerHTML
            }
        }
        var holderBuild = ''//单体id
        var holderPartition = ''//分区id
        var holderStorey = ''//楼层id
        /********获取单体id******/
        for(var j = 0;j<vm.preAddEdit.object.monomer.length;j++){
            if(j == 0){
                holderBuild = vm.preAddEdit.object.monomer[j]
            }else{
                holderBuild += ','+vm.preAddEdit.object.monomer[j]
            }
        }
        /********获取分区id******/
        for(var j = 0;j<vm.preAddEdit.object.partition.length;j++){
            if(j == 0){
                holderPartition = vm.preAddEdit.object.partition[j]
            }else{
                holderPartition += ','+vm.preAddEdit.object.partition[j]
            }
        }
        /********获取楼层id******/
        for(var j = 0;j<vm.preAddEdit.object.floor.length;j++){
            if(j == 0){
                holderStorey = vm.preAddEdit.object.floor[j]
            }else{
                holderStorey += ','+vm.preAddEdit.object.floor[j]
            }
        }
        if(type == 1){
              holderPathName = monomerValue
        }else if(type == 2){
              holderPathName = monomerValue+'-'+partitionValue
        }else{
              holderPathName = monomerValue+'-'+partitionValue+'-'+floorValue
        }
        var gcName_system = $('#system .el-input__inner')[0].value
        if(gcName_system == ''){
            vm.$message({
                type:'warning',
                message:'请选择构件类型!'
            })
            return false
        }
        var gcName_type = $('#type .el-input__inner')[0].value
        var gcName = ''
        gcName = gcName_system+'-'+gcName_type


        // options_name" :value="item.propertyNumber" :valuetype="item.valueType" :propertyTableName="item.propertyTableName" 
        var pValueType = ''
        var pTable = ''
        var pGcName = ''
        for(var i=0;i<vm.options_name.length;i++){
            if(vm.options_name[i].propertyNumber == vm.preAddEdit.object.name){
                pValueType = vm.options_name[i].valueType
                pTable = vm.options_name[i].propertyTableName
                pGcName = vm.options_name[i].propertyTitle
            }
        }

        var gcCode='';
        if(vm.preAddEdit.object.system != ''){
            gcCode = vm.preAddEdit.object.system
        }
        if(vm.preAddEdit.object.type != ''){
            gcCode = vm.preAddEdit.object.type
        }

        if(vm.preAddEdit.object.valueType == 0 && isNaN(vm.preAddEdit.object.value)){
            vm.$message({
                type:'warning',
                message:'当前专业预设的取值类型为数值，请输入数值!'
            })
            return false
        }
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/dc/addProfessionalSetting',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'token':vm.token
                },
                data:{
                    holderPathName:holderPathName,
                    holderBuild:holderBuild,//单体
                    holderPartition:holderPartition,//分区
                    holderStorey:holderStorey,//楼层
                    type:type,
                    gcCode:gcCode,
                    gcName:gcName,
                    pkId:vm.preAddEdit.object.pkId,
                    pGcCode:vm.preAddEdit.object.name,//属性名称
                    pValueType:pValueType,//属性 类型
                    pValue:vm.preAddEdit.object.value,//取值
                    pGcName:pGcName,//元素注释
                    projectId:vm.projId,
                    pTable:pTable// t43
                },
            }).then((response)=>{
                if(parseInt(response.data.cd) == 0){
                    vm.$message({
                        type:'success',
                        message:'编辑成功！'
                    })
                    vm.getPrevData()
                    vm.addEditCancle()
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      deleteItem(val){
          var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/deleteProfessionalSetting',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                pkId:val
            },
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
                vm.$message({
                    type:'success',
                    message:'删除成功！'
                })
                vm.getPrevData()
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      initSelect(key){
         var vm =this
         vm.option_professional_preset.forEach((item,index)=>{
             if(key == index){
                 item.checked = true
                 vm.checkedValue = item.id
                 vm.getGenieClass(2,true)
             }else{
                item.checked = false
             }
         })
      },
      getPrevData(val){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/pageProfessionalSetting',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                gcCode:vm.checkedValue,
                page:vm.pre_pageDetial.currentPage,
                rows:vm.pre_pageDetial.pagePerNum,
            },
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
                if(response.data.rt.rows != null){
                    vm.professionalList = response.data.rt.rows
                    vm.pre_pageDetial.total = response.data.rt.total
                }else{
                    vm.professionalList = []
                    vm.pre_pageDetial.total = 0
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      initValue(val){
          if(val == 0){
                return '数值'
          }else if(val == 1){
                return '文本'
          }else if(val == 2){
                 return '是否'
          }else if(val == 3){
                return '时间'
          }
          return ''
      },
       /**
         * 预览文件集文件
         * @param fileUuid
         */
        view(filePath){
            //latestFile(fileId,fgId,"预览了文件"+fileName);
            var vm = this
            window.open(vm.QJFileManageSystemURL+filePath+"/preview");
        },
        checkLabel(index,ismultiSelect){
            var vm = this;
            vm.mapInfo = [];
            if(ismultiSelect){
                vm.attributeList[index].checked = !vm.attributeList[index].checked
                var num = 0
                vm.checkedItem = {}
                vm.attributeList.forEach((item,key)=>{
                    if(item.checked){
                        if(num == 0){
                            vm.checkedItem = item
                        }else{
                            vm.checkedItem = {}
                        }
                        num++
                    }
                })
                vm.ListCheckedNum = num
                if(num == vm.attributeList.length){
                    vm.checkAll = true
                }else{
                    vm.checkAll = false
                }
                if(vm.ListCheckedNum == 1){
                    vm.getDesignAtt()
                }
            }else{
                vm.checkAll = false
                vm.attributeList.forEach((item,key)=>{
                    if(key == index){
                        vm.$set(item,'checked',true)
                        vm.checkedItem = item
                    }else{
                        vm.$set(item,'checked',false)
                    }
                })
                vm.ListCheckedNum = 1
                vm.getDesignAtt();
                this.getModelData(vm.attributeList[index].templateId)
            }
        },
        getModelData(tempId){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/dc/getTemplateInfo',
                headers:{
                    token:this.token
                },
                params:{
                    templateId:tempId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    console.log(response.data);
                    if(response.data.rt != null){
                        let templateInfos0 = response.data.rt.templateInfos0[0].attributes;
                        let templateInfos1 = response.data.rt.templateInfos1[0].attributes;
                        let templateInfos2 = response.data.rt.templateInfos2[0].attributes;
                        this.templateInfos0Data = [];
                        this.templateInfos1Data = [];
                        this.templateInfos2Data = [];
                        templateInfos0.forEach(val=>{
                            val.items.forEach(item=>{
                                if(val.items!=null){
                                    this.templateInfos0Data.push({
                                        key:item.split('#')[1].split('[')[1].split(']')[0],
                                        value:item.split('#')[2].split('[')[1].split(']')[0]
                                    })
                                }
                            })
                        })
                        templateInfos1.forEach(val=>{
                            if(val.items!=null){
                                val.items.forEach(item=>{
                                    this.templateInfos1Data.push({
                                        key:item.split('#')[1].split('[')[1].split(']')[0],
                                        value:item.split('#')[2].split('[')[1].split(']')[0]
                                    })
                                })  
                            }
                        })
                        templateInfos2.forEach(val=>{
                            if(val.items!=null){
                                val.items.forEach(item=>{
                                    this.templateInfos2Data.push({
                                        key:item.split('#')[1].split('[')[1].split(']')[0],
                                        value:item.split('#')[2].split('[')[1].split(']')[0]
                                    })
                                })
                            }
                        })
                    }
                }else{
                    alert(resposne.data.msg);
                }
            })
        },
      getDesignAtt(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/getPropertyInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                TraceId:vm.checkedItem.traceId,
                type:vm.checkedItem.type
            },
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
               vm.mapInfo = response.data.rt.mapInfo//这是设计属性
               vm.fgList = response.data.rt.fgList//这是设计属性
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      editAttribute(){
          var vm = this
          if(vm.GCPropertyList.length == 0){
             vm.$message({
                  type:'warning',
                  message:'没有可编辑的扩展属性!'
              })
              return false
          }
          var num = 0
          var c=0
          var message = ''
          var isInherit=-1;//0：自身 1：来自继承
          /**
           * @param  vm.GCPropertyList 扩展属性
           * @param  vm.attributeList 属性列表
           * **/
          vm.GCPropertyList.forEach((val,index)=>{
                c=0
                num = 0
                var tempValue='' //将要编辑的扩展属性的内容
                vm.attributeList.forEach((item,key)=>{
                    message = num >0?'多样':'@'
                    if(item.checked){
                     
                        var  valueFrom = vm.initVal(val.id,item.traceId,true)//扩展属性 的 来源
                        var  value = vm.initVal(val.id,item.traceId,false)//扩展属性的内容
                        if (c == 0) {//选则的第一条列表
                            if(valueFrom==1){
                                isInherit=0;
                            }else{
                                isInherit=1;
                            }
                            tempValue = value
                        }else{
                            if(isInherit==1){ //如果来自继承 继续
                                if(valueFrom==1){
                                    isInherit=0;
                                }else{
                                    isInherit=1;
                                }
                            }
                            if (tempValue != value) {
                                tempValue = message
                                if(val.valueType == 2 || val.valueType == 3){//是否 和 时间
                                    tempValue = message//@ 不会修改任意列表的值
                                }
                            }
                        }
                        /**下面定义了extendvalue的取值方法**/
                        if(isInherit==0) {
                            vm.$set(val,'extend_to_submit',tempValue)
                            vm.$set(val,'extendValue',tempValue)
                            if(val.valueType == 3){
                                vm.$set(val,'timeChecked',false)
                                vm.$set(val,'timeChecked_to_submit',false)
                            }
                        }else{//都来自继承  赋值@
                            vm.$set(val,'extend_to_submit',message)
                            vm.$set(val,'extendValue',message)
                             if(val.valueType == 3){
                                vm.$set(val,'timeChecked',true)
                                vm.$set(val,'timeChecked_to_submit',true)
                            }
                        }
                       
                        c++
                        num++
                    }
                })
          })
          if(num == 0){
              vm.$message({
                  type:'warning',
                  message:'请勾选需要编辑的构件!'
              })
              return false
          }
          vm.extension.num = num
          vm.extension.show = true
      },
      editConfirm(){
        var vm = this
        var traceIds = ''
        vm.attributeList.forEach((item,key)=>{
            if(item.checked){
                var traceid = encodeURIComponent(item.traceId)
                if(traceIds == ''){
                    traceIds = traceid
                }else{
                    traceIds += ','+traceid
                }
            }
        })
        var formData = []//formData只需要projectGcPropertyId和propertyValue
        for(var i=0;i<vm.GCPropertyList.length;i++){
            if(vm.GCPropertyList[i].valueType == 0 || vm.GCPropertyList[i].valueType == 1){
                if(vm.GCPropertyList[i].extendValue != '多样'){ //多样时保存原有内容
                    if(vm.GCPropertyList[i].valueType == 0 && vm.GCPropertyList[i].extendValue != '@' && isNaN(vm.GCPropertyList[i].extendValue)){//数值
                        vm.$message({
                            type:'warning',
                            message:vm.GCPropertyList[i].propertyTitle+' 的值类型为数值，请输入数值!'
                        })
                        return false
                    }
                     formData.push({
                        projectGcPropertyId:vm.GCPropertyList[i].id,
                        propertyValue:vm.GCPropertyList[i].extendValue
                    })
                }
            }else if(vm.GCPropertyList[i].valueType == 2){
                if(vm.GCPropertyList[i].extendValue != null && vm.GCPropertyList[i].extendValue != '多样'){ //当多个结果不一样时，为null
                    formData.push({
                        projectGcPropertyId:vm.GCPropertyList[i].id,
                        propertyValue:vm.GCPropertyList[i].extendValue
                    })
                }
            }else if(vm.GCPropertyList[i].valueType == 3){
                if(vm.GCPropertyList[i].timeChecked){//日期 并且 选择了继承
                    formData.push({
                        projectGcPropertyId:vm.GCPropertyList[i].id,
                        propertyValue:'@',
                    })
                }else{
                    if(vm.GCPropertyList[i].extendValue != '多样'){
                         formData.push({
                            projectGcPropertyId:vm.GCPropertyList[i].id,
                            propertyValue:vm.GCPropertyList[i].extendValue
                        })
                    }
                }
            }
        }
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/dc/updatePropertyValue',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId,
                traceIds:traceIds
            },
            data:formData,
        }).then((response)=>{
            if(parseInt(response.data.cd) == 0){
                 for(var i=0;i<vm.GCPropertyList.length;i++){
                    vm.GCPropertyList[i].extend_to_submit = vm.GCPropertyList[i].extendValue
                    if(vm.GCPropertyList[i].valueType == 3)vm.GCPropertyList[i].timeChecked_to_submit = vm.GCPropertyList[i].timeChecked
                }
                setTimeout(function(){
                    vm.selectData()
                },0)
            }
        }).catch((err)=>{
            console.log(err)
        })
          vm.extension.show = false
      },
      editCancle(){
        var vm = this
        vm.extension.show = false
        vm.GCPropertyList.forEach((item,key)=>{
            item.extendValue = item.extend_to_submit
            if(item.valueType == 3)item.timeChecked = item.timeChecked_to_submit
        })
      },
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
      initVal(id,traceId,from){
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
        if(from){
            if(valueFrom){
                return valueFrom
            }else{
                return '(空)'
            }
        }else{
             if(pValue){
                return pValue
            }else{
                return '(空)'
            }
        }
      },
      changePage(val,isZYYS){//分页 0 -1 1 2
            var vm = this; 
            if(isZYYS){ //pre_pageDetial.currentPage
                if(vm.pre_pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                    vm.$message('这已经是第一页!')
                    return false
                }
                if(vm.pre_pageDetial.currentPage >= Math.ceil(vm.pre_pageDetial.total/vm.pre_pageDetial.pagePerNum) && (val == 1 || val == 2)){
                    vm.$message('这已经是最后一页!')
                    return false
                }
                switch(val){
                    case 0:
                        vm.pre_pageDetial.currentPage = 1
                        break;
                    case -1:
                        vm.pre_pageDetial.currentPage--
                        break;
                    case 1:
                        vm.pre_pageDetial.currentPage++
                        break;
                    case 2:
                        vm.pre_pageDetial.currentPage = Math.ceil(vm.pre_pageDetial.total/vm.pre_pageDetial.pagePerNum)
                        break;
                }
            }else{
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
      getGenieClass(level,isPre){
            var vm = this
            var pCode = ''
            if(!isPre){
                var parentClassifyCode='';
                var gcCode = vm.value_professional
                var gcCode1 = vm.value_system
                var gcCode2 = vm.value_type
                if(level==2){
                    parentClassifyCode= vm.value_professional
                    vm.value_system = '0'
                    vm.value_type = '0'
                    vm.options_type = [
                        {
                            id:'0',
                            Name:'无'
                        },
                    ]
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
                }else if(level==3){
                    parentClassifyCode = vm.value_system
                    vm.value_type = '0'
                    if(parentClassifyCode==0){
                        vm.options_type = [
                            {
                                id:'0',
                                Name:'无'
                            },
                        ]
                    }else{
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
                 pCode = parentClassifyCode
            }else{
                if(level == 2){
                    pCode = vm.checkedValue
                }else{
                    pCode = vm.preAddEdit.object.system
                }
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
                    parentClassifyCode:pCode
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(!isPre){
                      
                        if(response.data.rt != null && response.data.rt.length > 0){
                             if(level == 2){
                                response.data.rt.forEach((item,key)=>{
                                    vm.options_system.push({
                                            id:item.number,
                                            Name:item.title
                                    })//分区列表
                                })
                            }else if(level == 3){
                                response.data.rt.forEach((item,key)=>{
                                    vm.options_type.push({
                                            id:item.number,
                                            Name:item.title
                                    })//分区列表
                                })
                            }
                        
                        }
                    }else{
                        if(level == 2){
                            vm.options_system_pre = []
                            if(response.data.rt != null && response.data.rt.length > 0){
                                    response.data.rt.forEach((item,key)=>{
                                        vm.options_system_pre.push({
                                                id:item.number,
                                                Name:item.title
                                        })//分区列表
                                    })
                            }
                        }else{
                            vm.options_type_pre = []
                            vm.preAddEdit.object.type = ''//清空构件小类的值
                            if(response.data.rt != null && response.data.rt.length > 0){
                                    response.data.rt.forEach((item,key)=>{
                                        vm.options_type_pre.push({
                                                id:item.number,
                                                Name:item.title
                                        })//分区列表
                                    })
                            }
                        }
                    }
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
      getPartitionBySubProjId(ispre){
          var vm = this;
          if(ispre){
              var subProjId = ''
              if(vm.preAddEdit.object.monomer.length>1 || vm.preAddEdit.object.monomer.length == 0){
                  /**如果单体单选，那么分区和楼层都清空**/
                  vm.options_partition_pre = []
                  vm.options_floor_pre = []
                  vm.preAddEdit.object.partition = []
                  vm.preAddEdit.object.floor = []
                  return false
              }
              subProjId = vm.preAddEdit.object.monomer[0]
          }
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/dc/getPartitionBySubProjId',
            headers:{
                'token':vm.token
            },
            params:{
                subProjId:ispre?subProjId:vm.value_monomer
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                if(!ispre){
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
                    vm.value_floor = '0'
                    vm.value_partition = '0'
                    if(response.data.rt != null && response.data.rt.length > 0){
                        response.data.rt.forEach((item,key)=>{
                            vm.options_partition.push({
                                    id:item.ID,
                                    Name:item.Name
                            })//分区列表
                            vm.options_partition_pre = []
                            vm.options_partition_pre.push({
                                    id:item.ID,
                                    Name:item.Name
                            })//分区列表
                        })
                    }
                }else{
                    vm.options_partition_pre = []
                     if(response.data.rt != null && response.data.rt.length > 0){
                        response.data.rt.forEach((item,key)=>{
                            vm.options_partition_pre.push({
                                    id:item.ID,
                                    Name:item.Name
                            })//分区列表
                        })
                    }
                }             
            }
        }).catch((err)=>{
            console.log(err)
        })
      },    
      findStorey(isPre){
            var vm = this
            if(!isPre){
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
                    vm.value_floor = '0'
                    return false
                }
                if(vm.value_partition==0){
                    vm.options_floor = [
                        {
                            id:'0',
                            Name:'无'
                        },
                    ]
                    vm.value_floor = '0'
                    return false
                }
                var url = vm.BDMSUrl+'project2/dc/findStorey/'+vm.value_partition
            }else{
                if(vm.preAddEdit.object.partition.length>1 || vm.preAddEdit.object.partition.length == 0){
                    /**如果单体单选，那么分区和楼层都清空**/
                    vm.options_floor_pre = []
                    vm.preAddEdit.object.floor = []
                    return false
                }
                var url = vm.BDMSUrl+'project2/dc/findStorey/'+vm.preAddEdit.object.partition[0]
            }
            axios({
                method:'GET',
                url:url,
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(!isPre){
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
                        vm.value_floor = '0'
                        if(response.data.rt.rows != null && response.data.rt.rows.length > 0){
                            vm.options_floor_pre = []
                            response.data.rt.rows.forEach((item,key)=>{
                                vm.options_floor.push({
                                        id:item.ID,
                                        Name:item.Name
                                })//分区列表
                                vm.options_floor_pre.push({
                                        id:item.ID,
                                        Name:item.Name
                                })//分区列表
                            })
                        }else{
                            vm.options_floor_pre = []
                            vm.options_floor = [
                                {
                                    id:'0',
                                    Name:'无'
                            }]
                        }
                    }else{
                        vm.options_floor_pre = []
                        if(response.data.rt.rows != null && response.data.rt.rows.length > 0){
                            response.data.rt.rows.forEach((item,key)=>{
                                vm.options_floor_pre.push({
                                        id:item.ID,
                                        Name:item.Name
                                })//分区列表
                            })
                        }
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
            if(parseInt(vm.value_professional) != -1){
                typeName= vm.$refs.professional.selectedLabel +"-"
            }
            if(parseInt(vm.value_system) !=-1 && parseInt(vm.value_system) !=0){
                typeName+=vm.$refs.system.selectedLabel+"-"
            }
            if((parseInt(vm.value_system ==-1) || parseInt(vm.value_system) ==0) && parseInt(vm.value_type) ==-1 || parseInt(vm.value_type) ==0){
                typeName=''
            }
            if(vm.GenieclassTitle && vm.GenieclassTitle.length>0){
                  for(var i=0;i<vm.GenieclassTitle.length;i++){
                      if(vm.GenieclassTitle[i].classifyCode==gcCode){
                          return typeName+vm.GenieclassTitle[i].classifyName;
                      }
                  }
            }
            return '(空)';
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
                $.extend(vm.options_monomer,response.data.rt.subProjects)//单体列表
                $.extend(vm.options_monomer_pre,response.data.rt.subProjects)//单体列表
                vm.options_monomer.unshift({
                    id:'0',
                    Name:'总体场地'
                },{
                    id:'all',
                    Name:'全部单体'
                },)
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
                    vm.option_professional = [{
                        id:'-1',
                        Name:'全部',
                        key:'000000'
                    }]
                    vm.option_professional_preset = []
                    if(response.data.rt.genieClassList != null){
                        response.data.rt.genieClassList.forEach((element,index)=>{
                            vm.option_professional.push({
                                id:element.number,
                                Name:element.title,
                                key:element.id
                            })
                            if(index == 0){
                                vm.option_professional_preset.push({
                                    id:element.number,
                                    Name:element.title,
                                    key:element.id,
                                    checked:true,
                                })
                                vm.checkedValue = element.number
                            }else{
                                vm.option_professional_preset.push({
                                    id:element.number,
                                    Name:element.title,
                                    key:element.id,
                                    checked:false,
                                })
                            }
                        })
                    }
                }

            }).catch((err)=>{
                console.log(err)
            })
        )
    },
        //筛选
        selectData(){
            this.getParams();
            this.fullscreenLoading = true;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/dc/searchPropertyData',
                headers:{
                    token:this.token
                },
                params:{
                    gcCode:this.globalCode,
                    gcNumber:this.globalCode,
                    projId:this.projId,
                    dataVision:this.dataVision,
                    rows:this.pageDetial.pagePerNum,
                    page:this.pageDetial.currentPage,
                    templateId:this.value_leibie+'__'+this.value_model+'__'+this.value_typeC,
                    buildInfo:this.globalBUildinInfo,
                }
            }).then(response=>{
                console.log(response.data)
                if(response.data.cd == 0){
                    this.canSearch = false;
                    if(response.data.rt.gridDataJson.rows != null){
                        this.empty = false
                        this.attributeList = response.data.rt.gridDataJson.rows
                        if(response.data.rt.gcproperty != null){
                            this.GCPropertyList = response.data.rt.gcproperty//扩展属性头部
                            var b = []
                            $.extend(b,this.GCPropertyList)
                            this.GCPropertyList_to_select = b//扩展属性头部
                            this.GCPropertyValueList = response.data.rt.gcpropertyValue//扩展属性查询的值 库
                            if(this.GCPropertyList != null){
                                this.GCPropertyList.forEach(element => {
                                    this.$set(element,'checked',true)
                                })
                            }
                            if(this.GCPropertyList_to_select != null){
                                this.GCPropertyList_to_select.forEach(element => {
                                    this.$set(element,'extension_checked',true)
                                })
                            }
                        }
                        this.pageDetial.total = response.data.rt.gridDataJson.total
                        if(this.attributeList != null){
                            this.attributeList.forEach(element => {
                                this.$set(element,'checked',false)
                            })
                        }
                    }else{
                        this.empty = true
                        this.pageDetial.total = 0
                        this.attributeList = []
                        this.GCPropertyList = []//扩展属性头部
                        this.GCPropertyList_to_select = []
                        this.GCPropertyValueList = []//扩展属性查询的值 库
                    }
                    if(response.data.rt.genieclassTitle != null){
                        this.GenieclassTitle = response.data.rt.genieclassTitle
                    }else{
                        this.GenieclassTitle = []
                    }
                }else{
                    alert(response.data.msg);
                }
                this.fullscreenLoading = false;
            })

            // var vm = this
            // if(isNaN(vm.dataVision) || vm.dataVision <=0 || vm.dataVision>vm.holderMaxVersion){
            //     vm.$message({
            //     type:'warning',
            //     message:'数据版本只能是1到'+vm.holderMaxVersion+'的正整数！'
            //     })
            //     return false
            // }
            // vm.fullscreenLoading = true
            // /**
            //  * 下面是判断单体和单体类型
            //  * **/
            // var holderId=''
            // var isChildren=1
            // var selectBuild=3//单体选择 1：选择了总体场地，2：全部单体，3：单个单体
            // var holderType=7//6:场地，7：单体，8：分区，9：楼层
            // if(vm.value_monomer == 0) {
            //     selectBuild = 1
            //     holderType=6
            // }else if(vm.value_monomer == 'all'){
            //     selectBuild=2
            //     holderType=7
            // }else{
            //     selectBuild=3
            // }

            // if(vm.value_monomer != -1){
            //     holderId = vm.value_monomer
            //     if(vm.value_partition!=-1){
            //         if(vm.value_partition==0){//分区选择了（无）
            //             isChildren=0
            //         }else {
            //             holderType=8
            //             holderId = vm.value_partition
            //             if (vm.value_floor != -1) {
            //                 isChildren=0
            //                 if(vm.value_floor==0){//楼层选择了（无）
            //                     //isChildren=0;
            //                 }else {
            //                     holderType=9
            //                     holderId = vm.value_floor
            //                 }
            //             }else{
            //                 holderType = 9
            //             }
            //         }
            //     }else{
            //             holderType = 8
            //             if (vm.value_floor != 0) {
            //                 holderType = 9
            //             }
            //     }
            // }
            // /**
            //  * 以下是第二行筛选的值
            //  * @param   value_professional:'-1',//专业 筛选关键字
            //     @param        value_system:'-1',//系统 筛选关键字
            //     @param        value_type:'-1',//类型 筛选关键字
            // * **/
            
            // var gcCode = vm.value_professional
            // var gcCode1 = vm.value_system
            // var gcCode2 = vm.value_type
            // var gcNumber=''
            // if(vm.value_professional!=-1){ //专业
            //     if(vm.value_system ==0){
            //         gcNumber = vm.value_professional
            //     }else {
            //         gcNumber = vm.value_professional
            //         if (vm.value_system  != -1) { //系统
            //             if (vm.value_type == 0) {
            //                 gcNumber = vm.value_system 
            //             } else {
            //                 gcNumber = vm.value_system 
            //                 if (vm.value_type != -1) {//类型
            //                     gcNumber = vm.value_type
            //                 }
            //             }
            //         }
            //     }
            // }
            // axios({
            //     method:'POST',
            //     url:vm.BDMSUrl+'project2/dc/searchPropertyData',
            //     headers:{
            //         'token':vm.token
            //     },
            //     params:{
            //         projId:vm.projId,
            //         dataVision:vm.dataVision,//数据版本
            //         isChildren:isChildren,
            //         selectBuild:selectBuild,
            //         holderType:holderType,
            //         holderId:holderId,
            //         gcCode:gcCode,
            //         gcCode1:gcCode1,
            //         gcCode2:gcCode2,
            //         gcNumber:gcNumber,
            //         rows:vm.pageDetial.pagePerNum,
            //         page:vm.pageDetial.currentPage,
            //     }
            // }).then((response)=>{
            //     if(response.data.cd == 0){
            //         vm.canSearch = false
            //         if(response.data.rt.gridDataJson.rows != null){
            //             vm.empty = false
            //             vm.attributeList = response.data.rt.gridDataJson.rows
            //             if(response.data.rt.gcproperty != null){
            //                 vm.GCPropertyList = response.data.rt.gcproperty//扩展属性头部
            //                 var b = []
            //                 $.extend(b,vm.GCPropertyList)
            //                 vm.GCPropertyList_to_select = b//扩展属性头部
            //                 vm.GCPropertyValueList = response.data.rt.gcpropertyValue//扩展属性查询的值 库
            //                 if(vm.GCPropertyList != null){
            //                     vm.GCPropertyList.forEach(element => {
            //                         vm.$set(element,'checked',true)
            //                     })
            //                 }
            //                 if(vm.GCPropertyList_to_select != null){
            //                     vm.GCPropertyList_to_select.forEach(element => {
            //                         vm.$set(element,'extension_checked',true)
            //                     })
            //                 }
            //             }
            //             vm.pageDetial.total = response.data.rt.gridDataJson.total
            //             if(vm.attributeList != null){
            //                 vm.attributeList.forEach(element => {
            //                     vm.$set(element,'checked',false)
            //                 })
            //             }
            //         }else{
            //             vm.empty = true
            //             vm.pageDetial.total = 0
            //             vm.attributeList = []
            //             vm.GCPropertyList = []//扩展属性头部
            //             vm.GCPropertyList_to_select = []
            //             vm.GCPropertyValueList = []//扩展属性查询的值 库
            //         }
            //         if(response.data.rt.genieclassTitle != null){
            //             vm.GenieclassTitle = response.data.rt.genieclassTitle
            //         }else{
            //             vm.GenieclassTitle = []
            //         }
            //     }
            //     vm.fullscreenLoading = false
            // }).catch((err)=>{
            //     console.log(err)
            // })
        },
        getParams(){
            if(this.value_professional == -1 && this.value_system == -1 && this.value_type ==-1 || this.value_professional == -1 && this.value_system == 0 && this.value_type ==0){
                this.globalCode = '000000';
            }else if(this.value_type != -1 && this.value_type!=0){
                this.globalCode = this.value_type;
            }else if(this.value_system != -1 && this.value_system != 0 && (this.value_type == -1 || this.value_type == 0)){
                this.globalCode = this.value_system;
            }else if(this.value_professional !== -1 &&(this.value_system == -1 || this.value_system == 0) && (this.value_type == -1 || this.value_type == 0)){
                this.globalCode = this.value_professional;
            }
            let oneParam = '',
                twoParam = '',
                threeParam = '';
            if(this.value_monomer == 0){
                oneParam = 'OVERALL_FIELD';
            }else if(this.value_monomer == 'all'){
                oneParam = 'ALL';
            }else{
                oneParam = this.value_monomer;
            }

            if(this.value_partition == 0){
                twoParam = 'NONE';
            }else{
                twoParam = this.value_partition;
            }
            if(this.value_floor == 0){
                threeParam = 'NONE';
            }else{
                threeParam = this.value_floor;
            }
            this.globalBUildinInfo = oneParam+'__'+twoParam+'__'+threeParam;
        },
        //显示更多筛选框
        showMore(){
            this.shownum+=1;
            if(this.shownum == 1){
                this.ShowClassify = false;
            }
            if(this.shownum == 2){
                this.ShowModel  =false;
                this.getParams();
                this.getModelSelection(this.globalCode,this.globalBUildinInfo);
            }
        },
        //获取第三栏的参数选项
        getModelSelection(codeparam,buildInfoparam){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/dc/getModelSelection',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    code:codeparam,
                    buildInfo:buildInfoparam,
                }
            }).then(response=>{
                console.log(response.data);
                if(response.data.cd == 0){
                    if(response.data.rt!=null){
                        this.model_leibie = response.data.rt.templateInfos0;
                        this.model_leibie.unshift({
                            name:'全部',
                            id:'ALL',
                        })
                        this.value_leibie = this.model_leibie[0].id;

                        this.option_model = response.data.rt.templateInfos1;
                        this.option_model.unshift({
                            name:'全部',
                            id:'ALL',
                        })
                        this.copyOption_model = this.option_model;
                        this.value_model = this.option_model[0].id;

                        this.option_typeC = response.data.rt.templateInfos2;
                        this.option_typeC.unshift({
                            name:'全部',
                            id:'ALL',
                        })
                        this.copyoption_typeC = this.option_typeC;
                        this.value_typeC = this.option_typeC[0].id;
                    }else{
                        this.model_leibie = [{
                            name:'全部',
                            id:'ALL',
                        }];
                        this.value_leibie = this.model_leibie[0].id;
                        this.option_model = [{
                            name:'全部',
                            id:'ALL',
                        }];
                        this.value_model = this.option_model[0].id;
                        this.option_typeC = [{
                            name:'全部',
                            id:'ALL',
                        }];
                        this.value_typeC = this.option_typeC[0].id;
                    }   
                }else{
                    alert(response.data.msg)
                }
            })
        },

    }
}
</script>
