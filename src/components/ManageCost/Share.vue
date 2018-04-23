<template>
<div id="cloudDrive">
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div id="item-box-file">
                <span  class=" label-item">
                    <router-link :to="'/Drive/costover'">  
                    最近文档  
                   </router-link>
                </span>
                <span  class="label-item">
                    <router-link :to="'/Drive/cloudDrive'">  
                    工程云盘  
                   </router-link>
                </span>
                <span  class="label-item label-item-active">
                <router-link :to="'/Drive/Share'">  
                    已经分享  
                  </router-link>
                </span>
                <span  class="label-item">
                  <router-link :to="'/Drive/PersonalTransit'">  
                    个人中转  
                  </router-link>
                </span>
                <div class="item-search">
                    <span class="title-right">
                        <input type="text" v-model="fileSearchInfo" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="getInfo">
                        <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                    </span>
                    <span class="icon-type" @click="listStyle = (listStyle == 'card'?'table':'card')"></span>
                </div>
            </div>
            <p class="antsLine">
                文档管理<i class="icon-sanjiao-right"></i><span class="strong" @click="refreshPage()">已经分享</span><i class="icon-sanjiao-right"></i>
                 <span class="strong SH" v-for="item in ShareBreadList" :key="item.nodeId+'antLine_1'" @click="IntoDir(item)" v-html="item.nodeName+'<i class=\'icon-sanjiao-right\'></i>'"></span>
                  <span class="strong GD" v-for="item in FGBreadList" :key="item.nodeId+'antLine_2'" @click="IntoDir(item,true,true)" v-html="item.nodeName+'<i class=\'icon-sanjiao-right\'></i>'"></span>
                <span class="strong" v-for="item in breadList" :key="item.nodeId+'antLine_3'" @click="IntoDir(item,true)" v-html="item.nodeName+'<i class=\'icon-sanjiao-right\'></i>'"></span>
            </p>
            <p class="select-header clearfix">
                <label   :class="[checkAll?'active':'','checkbox-fileItem']" for="allfile" ></label>
                <input  type="checkbox" id='allfile' class="el-checkbox__original" v-model="checkAll">
                <!--
                    文件夹的操作：剪切、粘贴、复制、分享、（批量下载） 

                    具体文件（包括点位文件）的操作：剪切、粘贴、删除、更新、更名、复制、分享,（下载：：：：点位文件不包括下载）

                -->
                <ul class="operation">
                    <li   @click="copyURL" v-if="fgList.length>0 && showLocation" class="item copyhref"  data-clipboard-action="cut" data-clipboard-target="#copyInput">复制链接</li>
                     <li class="item"   @click="showLink"  v-if="fgList.length>0 && showLocation">地址</li>
                    <li class="item" @click="cancleShare" v-if='auth.canCancelShare'>取消分享</li>
                </ul>
                <!-- //http://10.252.26.240:8080/qjbim-project/cloud/share/a1a8eed2-9b9d-489d-94b0-e5185194eaed -->
                <input type="text" id="copyInput" v-if="fgList.length>0"
                :value="checkedItem.sharePassword !=null?'链接：http://10.252.26.240:8080/qjbim-project/cloud/share/'+checkedItem.shareNo+' 密码：'+checkedItem.sharePassword:'http://10.252.26.240:8080/qjbim-project/cloud/share/'+checkedItem.shareNo" style=" opacity: 0;">
            </p>
            <div>
            <!--文件夹代码-->
            <div id="file-container" v-if="listStyle == 'card'">
                <ul class="clearfix" style="padding: 0px 10px 15px 20px;">
                    <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in fileList" :key="index+'file'" >
                        <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click="checkItem(index,true)" ></label>
                        <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                        <div class="item-file-box clearfix">
                            <span  class="item-file-image">
                              <img :src="require('./images/icon/'+item.icon)" />
                            </span>
                            <span  class="item-file-detial">
                                <h3 v-text="item.fgName"></h3>
                                <p>由<span class="text-name" v-text="item.updateUser"></span>通过<span v-text="item.uploadFromExplorer == 1?'浏览器':'手机端'"></span>上传</p>
                                <p v-text="initData(item.updateTime)"></p>
                                <p class="operation">
                                    <span v-text="'版本'+item.version"></span>
                                     <i class="icon-goujian icon-search" @click="view(item.filePath)"></i>
                                    <i class="icon-goujian icon-download" @click="downLoad(item.filePath)"></i>
                                </p>
                            </span>
                        </div>
                    </li>
                     <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in fgList" :key="index+'folder_fg'"  @dblclick="IntoDir(item)">
                        <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click="checkShareItem(index)" ></label>
                        <input type="checkbox" :id='item.shareId+"file"' class="el-checkbox__original" v-model="item.checked">
                        <div class="item-file-box clearfix">
                            <span  class="item-file-image item-folder-image">
                            <img :src="require('./images/folderBig.png')" />
                            </span>
                            <span  class="item-file-detial">
                                <h3 v-text="item.shareName"></h3>
                                 <p style="line-height: 16px;" class="detial">由<span class="text-name"  v-text="item.userName"></span>通过<span  v-text="item.shareFrom == 0?'QB Cloud':'浏览器'"></span>分享</p>
                                <p class="operation">
                                    <span v-text="item.sharePassword ==null?'公开分享':'私有分享'" :style="{color:item.sharePassword ==null?'#fc3439':'#336699'}"></span>
                                    <span v-text="initData(item.shareTime)" style="color:#b3b3b3;float:right;padding-right:9px;"></span>
                                </p>
                            </span>
                        </div>
                    </li>
                    <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in folderList" :key="index+'folder'"  @dblclick="IntoDir(item,true)">
                        <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click="checkItem(index)" ></label>
                        <input type="checkbox" :id='item.nodeId+"file"' class="el-checkbox__original" v-model="item.checked">
                        <div class="item-file-box clearfix">
                            <span  class="item-file-image item-folder-image">
                            <img :src="require('./images/folderBig.png')" />
                            </span>
                            <span  class="item-file-detial">
                                <h3 v-text="item.nodeName"></h3>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div id="file-container-table" v-else>
                <table class="UserList" width='100%'>
                    <thead>
                          <tr  class="userList-thead" v-if="ShareStyleHeader">
                            <th style="width:55px;"></th>
                            <th style="min-width:428px;">文件名</th>
                            <th style="width:70px;"></th>
                            <th style="width:70px;">更新渠道</th>
                            <th style="width:80px;">类型</th>
                            <th style="width:40px;">版本</th>
                            <th style="min-width:60px;">上传人</th>
                            <th style="min-width:120px;">更新时间</th>
                        </tr>
                        <tr  class="userList-thead" v-else>
                            <th style="width:55px;"></th>
                            <th>文件名</th>
                            <th style="width:70px;"></th>
                            <th style="min-width:150px;">分享时间</th>
                            <th style="width:150px;">类型</th>
                            <th style="width:170px;">分享人</th>
                            <th style="width:100px;">分享渠道</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in fileList" :key="index" :class="[{'active':item.checked}]" >
                            <td @click="checkItem(index,true)">
                                <label :class="[item.checked?'active':'','checkbox-fileItem']" ></label>
                                <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                            </td>
                            <td>
                                <img :src="require('./images/icon/'+item.icon)" />
                                <span v-text="item.fgName"></span>
                            </td>
                            <td>
                                <i class="icon-goujian icon-download" @click="downLoad(item.filePath)"></i>
                                 <i class="icon-goujian icon-search" @click="view(item.filePath)"></i>
                            </td>
                            <td  v-text="item.shareFrom == 0?'QB Cloud':'浏览器'"></td>
                            <td v-text="splitType(item.icon)"></td>
                            <td v-text="item.version"></td>
                            <td v-text="item.uploadUser"></td>
                            <td v-text="initData(item.updateTime)"></td>
                        </tr>
                         <tr v-for="(item,index) in fgList" :key="index+'table_fg'" :class="[{'active':item.checked}]"  @dblclick="IntoDir(item)">
                            <td @click="checkShareItem(index)">
                                <label :class="[item.checked?'active':'','checkbox-fileItem']" ></label>
                                <input type="checkbox" :id='item.shareId+"file"' class="el-checkbox__original" v-model="item.checked">
                            </td>
                            <td>
                                <img :src="require('./images/folderBig.png')" />
                                <span v-text="item.shareName"></span>
                            </td>
                            <td></td>
                             <td v-text="initData(item.shareTime)"></td>
                            <td v-text="item.sharePassword ==null?'公开分享':'私有分享'"></td>
                             <td v-text="item.userName"></td>
                            <td  v-text="item.shareFrom == 0?'QB Cloud':'浏览器'"></td>
                        </tr>
                          <tr v-for="(item,index) in folderList" :key="index+'table'" :class="[{'active':item.checked}]"  @dblclick="IntoDir(item,true)">
                            <td @click="checkItem(index)">
                                <label :class="[item.checked?'active':'','checkbox-fileItem']" ></label>
                                <input type="checkbox" :id='item.nodeId+"file"' class="el-checkbox__original" v-model="item.checked">
                            </td>
                            <td>
                                <img :src="require('./images/folderBig.png')" />
                                <span v-text="item.nodeName"></span>
                            </td>
                            <td></td>
                            <td v-text="'-'"></td>
                            <td v-text="'文件夹'"></td>
                            <td v-text="'-'"></td>
                            <td v-text="'-'"></td>
                            <td v-text="item.createTime?initData(item.createTime):item.uploadTime?initData(item.uploadTime):'-'"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
          
        </div>
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active-version':'active-version-3']">
                    <span class="item-version " @click="screenLeft.item = 1">属<br>性</span>
                    <span class="item-version-3  " @click="screenLeft.item = 2">版<br>本</span>
                </div>
            </div>
            <div id="box-right" v-if="screenLeft.item == 1">
                <h3 class="header-attribute">
                    <i class="trrangle"></i>
                    基本属性
                    <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                </h3>
                <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]">
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">文件名</span>
                        <span class="detial-text-value" v-text="checkedItem.fgName"></span>
                    </li>
                      <li class="detial-item clearfix">
                        <span class="detial-text-name">版本</span>
                        <span class="detial-text-value" v-text="checkedItem.version"></span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">上传人</span>
                        <span class="detial-text-value" v-text="checkedItem.uploadUser"></span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">上传时间</span>
                        <span class="detial-text-value" v-text="initData(checkedItem.uploadTime)"></span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">更新人</span>
                        <span class="detial-text-value" v-text="checkedItem.updateUser"></span>
                    </li>
                     <li class="detial-item clearfix">
                        <span class="detial-text-name">更新时间</span>
                        <span class="detial-text-value" v-text="initData(checkedItem.updateTime)"></span>
                    </li>
                </ul>
                 <h3 class="header-attribute">
                    <i class="trrangle"></i>
                    绑定构件
                    <i :class="[{'active':show.BindingArtifacts},'icon-dropDown']" @click="show.BindingArtifacts = show.BindingArtifacts?false:true;"></i>
                </h3>
                <ul id="BindingArtifacts" :class="[{'show':show.BindingArtifacts}]">
                    <li class="goujian-item" v-for="(item,index) in GouJianItem" :key="index">
                        <p class="clearfix">
                            <i class="icon-goujian icon-add"></i>
                            <i class="icon-goujian icon-detial"></i>
                            <i class="icon-goujian icon-QRcode"></i>
                            <i class="icon-goujian icon-location"></i>
                            <i class="icon-goujian icon-delete"></i>
                        </p>
                        <p class="item-detial">
                            <span class="detial-text-name">ID :</span>
                           <span class="detial-text-value" v-text="item.main.pkId"></span>
                        </p>
                         <p class="item-detial">
                            <span class="detial-text-name">状态 :</span>
                           <span class="detial-text-value" v-text="parseMStatus(item.main.mStatus)+'('+item.main.mStatus+')'"></span>
                        </p>
                         <p class="item-detial">
                            <span class="detial-text-name">明细 :</span>
                           <span class="detial-text-value" v-text="item.details.length"></span>
                        </p>
                        <p class="item-detial">
                            <span class="detial-text-name">名称 :</span>
                           <span class="detial-text-value" v-text="item.main.mName"></span>
                        </p>
                    </li>
                </ul>
            </div>
            <div id="box-right-1" v-else>
                <p class="head" ><!-- v-if="checkedItem.dirId"-->
                    <i class="icon-goujian icon-search" @click="view()"></i>
                    <i class="icon-goujian icon-download" @click="downLoad()"></i>
                     <select v-model="posType" class="inp-search">
                        <option value="">所有版本</option>
                        <option value="1">本周更新</option>
                        <option value="2">本月更新</option>
                        <option value="3">本年更新</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </p>
                <ul>
                    <li class="item-version" v-for="(item,index) in  versionItem" :key="index">
                        <div class="clearfix">
                            <img :src="QJFileManageSystemURL+'/'+item.imgUuid" class="img" alt="">
                            <div class="versin-detial">
                                <span class="user-name" v-text="item.uploadUserName"></span>
                                <span class="version-number" v-text="'版本-'+item.version"></span>
                                <p class="version-des">上传了新文档</p>
                            </div>
                        </div>
                        <p class="item-date">{{initData(item.uploadTime)+'来自'+(item.uploadFromExplorer == 1?'浏览器':'手机端')+'更新'}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div id="edit">
             <el-dialog title="分享地址" :visible.sync="sharePath.show" @close="closeLink">
                <div class="editBody">
                    <div class="editBodytwo imageBody" v-if="sharePath.path !=''">
                        <label class=" imageBodyText">地址 :</label>
                        <textarea class="inp"  v-text="sharePath.path"></textarea>
                    </div>
                    <div class="editBodytwo imageBody" v-if="sharePath.password !=''">
                        <label class=" imageBodyText">密钥 :</label>
                        <input type="text" class="inp" :value="sharePath.password">
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="openUrl()">打开页面</button>
                    <button class="editBtnS copyhref"  data-clipboard-action="cut" data-clipboard-target="#copyInput" @click="copyURL" v-if="sharePath.path !=''">复制地址</button>
                    <button class="editBtnS" @click="closeLink">关闭</button>
                </div>
            </el-dialog>
        </div>
</div>
</template>
<style  lang='less'>
#cloudDrive{
    /*
        修改eleUI树形组件
    */

    .el-tree-node__label{
        font-size: 12px;
        color: #666666;
        padding-left: 22px; 
        position: relative;
    }
    .el-icon-caret-right:before{
           content: "\E604";
           color: #999999;
           font-weight: bold;
    }
    .el-tree-node__label::before{
        display: block;
        position: absolute;
        top: 2px;
        left: 4px;
        width: 14px;
        height: 13px;
        background: url('./images/file.png')no-repeat 0 0;
        content: '';
    }
    .el-tree-node__content{
            height: 30px;
    }
    .is-current .el-tree-node__content{
        color: #333333;
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
    #edit .el-dialog{
        margin: 0 auto;
        .upInput{
            display: none;
        }
          /* 上传文件按钮 */
        .imageBody{
        text-align: left;
        }
        .imageBody .imageBodyText{
                color: #666;
                font-size: 14px;
                line-height: 14px;
                font-weight: normal;
                display: inline-block;
                margin-right: 20px;
                margin-left: 94px;
                text-align: right;
        }
        .updataImageSpan{
            overflow: hidden;
            width: 98px;
        }
        .updataImageSpan input{
            position: absolute;
            left: 0px;
            top: 0px;
            opacity: 0;
            /* -ms-filter: 'alpha(opacity=0)'; */
        }
        .selectionBox{
            margin: 10px 50px;
            border:1px solid #cccccc;
            padding: 20px;
            p{
                text-align: left;
                font-size: 14px;
                line-height: 14px;
                color: #666666;
            }
        }
        .checkbox-fileItem{
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            margin-right: 5px;
            position: relative;
            &::after{
                font-size:12px;
                color:#cccccc;
                display: block;
                position: absolute;
                right: -30px;
                top: 0;
                line-height:12px;
                content: '';
            }
        }
        .active{
            background: url('./images/checked.png') no-repeat 1px 2px;
                border: 1px solid #fc3439;
        }
    }
    #GroupSelect{
        display: block;
        width: 168px;
        height: 30px;
        position: fixed;
        top: 77px;
        z-index: 1000;
        right: 24px;
        .inp-search{
            width: 168px;
            border-radius: 15px;
            height: 30px;
            border: 1px solid #cccccc;
            position: relative;
            background: #fafafa;
            padding-left:10px;
            padding-right:20px;
            box-sizing: border-box;  
            margin-right: 15px;
            float: left;
            color: #333333;
            font-size: 14px;
            outline: none;
        }
        .icon-sanjiao{
            display: block;
            position: absolute;
            width: 12px;
            height: 7px;
            background-image:url('../Settings/images/sanjiao.png');
            background-size: 100% 100%;
            content: '';
            top: 12px;
            right: 11px;
        }
    }
    .box-left-container{
        display: block;
        position: fixed;
        top: 115px;
        left: 26px;
        bottom: 0;
        right: 225px;
        transition:  all ease .5s;
        min-width: 950px;
        overflow-y: auto;
        #planeFigureDiv{
            overflow: auto;
            position: absolute;
            top: 106px;
            left: 0;
            bottom: 0;
            right: 25px;
            #planeDIV{
                display:block;
                position:absolute;
                margin: 0 15px 15px;
                #planeFigure{
                    min-width: 700px;
                    min-height: 500px;
                }
            }
            .round{
                display: block;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 24px;
                height: 32px;
                background: url('./images/site.png')no-repeat 0 0;
            }
            .active{
                background: url('./images/site1.png')no-repeat 0 0;
            }
        }
         .title-right{
            float: left;;
            width: 214px;
            height: 30px;
            margin-right: 10px;
            position: relative;
            .title-right-icon{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:40px;
                margin-right: 5px;
                outline: none;
                &:focus{
                      background: #ffffff;  
                }
            }
            .el-icon-search{
                position: absolute;
                right: 10px;
                top: 8px;
            }
        }
        .item-search{
            position: absolute;
            display: block;
            right: 35px;
            top: 10px;
            width: auto;
            .inp-search{
                width: 82px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:20px;
                box-sizing: border-box;  
                margin-right: 15px;
                float: left;
                color: #999999;
                font-size: 12px;
                outline: none;
            }
            .icon-sanjiao{
                display: block;
                position: absolute;
                width: 8px;
                height: 4px;
                background-image:url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 14px;
                right: 55px;
            }
            .icon-type{
                float: left;
                width: 30px;
                height: 30px;
                border: 1px solid #cccccc;
                background: #f2f2f2;
                position: relative;
                cursor: pointer;
                border-radius: 2px;
                &::after{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 5px;
                    width: 18px;
                    height: 13px;
                    background: url('./images/type.png')no-repeat 0 0;
                    content: '';
                }
                &:hover{
                      background: #fff6f7;
                }
            }
        }
        .antsLine{
            padding: 10px 10px 0px 20px;
            font-size: 12px;
            line-height: 12px;
            color: #999999;
            text-align: left;
            .icon-sanjiao-right{
                 display: inline-block;
                width: 7px;
                height: 10px;
                margin: 2px 7px 0;
                background-image:url('./images/sanjiaoright.png');
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
        .select-header{
            padding: 15px 10px 0px 20px;
            min-height: 41px;
            .checkbox-fileItem{
                float: left;
                width: 14px;
                height: 14px;
                border: 1px solid #cccccc;
                cursor: pointer;
                margin-right: 5px;
                position: relative;
                &::after{
                    font-size:12px;
                    color:#cccccc;
                    display: block;
                    position: absolute;
                    right: -30px;
                    top: 0;
                    line-height:12px;
                    content: '全部';
                }
            }
            .active{
                background: url('./images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
            }
            .operation{
                float: right;
                margin-right: 35px;
                .item{
                    float: left;
                    padding: 0 12px;
                    height: 26px;
                    line-height: 24px;
                    border-top: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    border-right: 1px solid #cccccc;
                    text-align: center;
                    color: #333333;
                    font-size: 12px;
                    cursor: pointer;
                    &:first-of-type{
                        border-left: 1px solid #cccccc;
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                    }
                     &:last-of-type{
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                    }
                    &:hover{
                        background:  #fff6f7;
                    }
                }
                .item-upload{
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
                        top: 8px;
                        left: 19px;
                        width: 12px;
                        height: 11px;
                        content: '';
                        background: url('./images/uploadfile.png') no-repeat 0 0;
                    }
                }
            }
            .icon{
                border:1px solid #cccccc;
                float: left;
                width: 99px;
                height: 26px;
                line-height: 26px;
                text-align: left;
                font-size: 12px;
                color: #333333;
                position: relative;
                padding-left:28px; 
                cursor: pointer;
                &::before{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 11px;
                    width: 12px;
                    height: 12px;
                    content: '';
                }
                &:hover{
                    background: #fff6f7;
                }
                
            }
            .icon:first-of-type{
                border-right: 0;
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }
            .icon-upload{
                 &::before{
                   background: url('./images/upload.png')no-repeat 0 0;
                }
            }
            .icon-refresh{
                &::before{
                   background: url('./images/refresh.png')no-repeat 0 0;
                }
            }
            .icon-new{
                // border-left: 0;
                 border-top-right-radius: 2px;
                 border-bottom-right-radius: 2px;
                &::before{
                      top: 7px;
                   background: url('./images/spot.png')no-repeat 0 0;
                }
            }
        }
        .select-header{
            text-align: left;
            .el-checkbox{
                float: left;
            }
            .button-download{
                float: right;
                width: 52px;
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: #333333;
                text-align: center;
                border: 1px solid #cccccc;
                border-radius: 2px;
                cursor: pointer;
                margin-right:25px; 
                &:hover{
                    background: #fff6f7;
                }
            }
        }
        #file-container{
            
             .icon-goujian{
                float: right;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .icon-download{
                background: url('./images/download.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/download1.png')no-repeat 0 0;
                }
            }
             .icon-search{
                background: url('./images/search.png')no-repeat 0 0;
                margin-right: 20px;
                &:hover{
                    background: url('./images/search1.png')no-repeat 0 0;
                }
            }
            .item-file{
                float: left;
                width: 290px;
                height: 120px;
                margin: 20px 15px 0 0;
                border-radius: 6px;
                box-shadow: 0px 1px 8px rgba(93,94,94,.16);
                position: relative;
                padding: 8px;
                .checkbox-fileItem{
                    display:block;
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                }
                .active{
                    background: url('./images/checked.png') no-repeat 1px 2px;
                     border: 1px solid #fc3439;
                }
                .item-file-box{
                    .item-file-image{
                        float: left;
                        margin-top:16px;
                        width: 70px;
                        height: 70PX;
                        border-radius: 50%;
                        background: #f2f2f2;
                        img{
                            width: 48px;
                            height: 48px;
                            display: block;
                            margin-top: 13PX;
                            margin-left: 11px;
                        } 
                    }
                    .item-folder-image{
                        img{
                            width: 36px;
                            height: 33px;
                            display: block;
                            margin-top: 19PX;
                            margin-left: 17px;
                        }
                    }
                    .item-file-detial{
                        display: block;
                        margin-left:80px; 
                        .detial{
                            span{
                            color: rgb(51, 102, 153);
                            max-width: 50px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            }
                        }
                        >h3{
                            text-align: left;
                            font-size: 14px;
                            color: #333333;
                            line-height: 20px;
                            margin: 9px 0 8px;
                            max-height: 40px;
                            overflow: hidden;
                        }   
                        >p{
                            font-size: 12px;
                            line-height: 12px;
                            color: #b3b3b3;
                            text-align: left;
                            margin-bottom:6px; 
                        }
                        .text-name{
                            color: #336699;
                        }
                        .operation{
                            display: block;
                            position: absolute;
                            bottom: 0;
                            left: 88px;
                            right: 0;
                            margin-bottom:14px; 
                            span{
                                color: #fc3439;
                            }
                        }
                    }
                }
            }
            .item-file-active{
                box-shadow: 0px 1px 8px rgba(252,52,57,.2);
            }
        }
        #file-container-table{
           margin-top: 10px;
            .UserList{
                border-collapse: collapse;
                thead{
                    border-bottom: 1px solid #d9d9d9;
                    th{
                        height: 32px;
                        text-align: left;
                        font-size: 12px;
                        color: #999999;
                        font-weight: normal;
                    }
                }
                tbody{
                    tr{
                        td{
                            height: 54px;
                            text-align: left;
                            box-sizing: border-box;
                            font-size: 14px;
                            color: #333333;
                            border-bottom: 1px solid #f2f2f2;
                            .checkbox-fileItem{
                                display:block;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #cccccc;
                                cursor: pointer;
                                margin-left: 20px;
                            }
                            .active{
                                background: url('./images/checked.png') no-repeat 1px 2px;
                                border: 1px solid #fc3439;
                            }
                            img{
                                height: 18px;
                                float: left;
                                margin-right: 7px;
                            }
                            .icon-goujian{
                                float: left;
                                display: none;
                                width: 16px;
                                height: 16px;
                                cursor: pointer;
                            }
                            .icon-download{
                                background: url('./images/download.png')no-repeat 0 0;
                                margin-right:20px; 
                                &:hover{
                                    background: url('./images/download1.png')no-repeat 0 0;
                                }
                            }
                            .icon-search{
                                background: url('./images/search.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/search1.png')no-repeat 0 0;
                                }
                            }
                        }
                        &:hover{
                            background: #fafafa;
                            .icon-goujian{
                                display: inline-block;
                            }
                        }
                    }
                    .active{
                        td{
                            background: #fafafa;
                             .icon-goujian{
                                display: inline-block;
                            }
                             .icon-download{
                                background: url('./images/download1.png')no-repeat 0 0;
                            }
                            .icon-search{
                                background: url('./images/search1.png')no-repeat 0 0;
                            }
                        }
                    }
                }
            }
        }
    }
    .box-left-avtive{
         right: 0px;
          transition:  all ease .5s;
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
        a{
            color: #999999;
            text-decoration: none;
        }
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
        width: 250px;
        padding-left: 25px;
        top: 116px;
        transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
           #center-selection{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 25px;
            border-right: 1px solid #cccccc;
            .SH_right{
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
                    background: url('./images/right.png')no-repeat 0 0;
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
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom: -9px;
                    width: 23px;
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
                height: 56px;
                background: #fafafa;
                padding-top:12px;
                font-size: 12px;
                color: #666666; 
                text-align: center;
                border-left: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom:-7px;
                    width: 23px;
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
                border-right: 1px solid #cccccc;
                position: relative;
                cursor: pointer;
                &::after{
                    display: block;
                    position: absolute;
                    bottom:-7px;
                    width: 23px;
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
        .screenRight_1{
            padding: 10px 14px 10px 10px;
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
            .icon-add{
                background: url('./images/add.png')no-repeat 0 0;
                margin-right: 75px;
                &:hover{
                    background: url('./images/add1.png')no-repeat 0 0;
                }
            }
            .icon-authrity{
                float: right;
                background: url('./images/authority.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/authority1.png')no-repeat 0 0;
                } 
            }
            .icon-edit{
                 float: right;
                background: url('./images/edit.png')no-repeat 0 0;
                margin-right: 10px;
                &:hover{
                    background: url('./images/edit1.png')no-repeat 0 0;
                } 
            }
            .icon-delete{
                 float: right;
                background: url('./images/delete.png')no-repeat 0 0;
                margin-right: 10px;
                &:hover{
                    background: url('./images/delete1.png')no-repeat 0 0;
                } 
            }
        }
    }
    .box-right-avtive{
        right: 0;
         transition: all ease .5s;
    }
    #box-right{
        padding: 19px 13px 0 10px;
        #basicAttributes{
            display: none;
            >li:last-of-type{
                padding-bottom: 7px;
            }
        }
        #BindingArtifacts{
            display: none;
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
                background:url('./images/arror.png')no-repeat 0 0; 
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
        .detial-item{
            font-size: 12px;
            line-height: 12px;
            margin-top: 16px;
            text-align: left;
            .detial-text-name{
                color: #999999;
                width: 65px;
                float: left;
            }
            .detial-text-value{
               float: left;
               color: #333333;
                max-width: 130px;
                overflow-x: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &:first-of-type{
                margin-top: 18px;
            }
        }
        .goujian-item{
            font-size: 12px;
            line-height: 12px;
            margin-top: 10px;
            padding: 10px;
            text-align: left;
            box-shadow: 0px 0px 8px rgba(93,94,94,.16);
            border-radius: 6px;
            .icon-goujian{
                float: left;
                width: 16px;
                height: 16px;
                margin-right: 10px;
                cursor: pointer;
            }
            .icon-add{
                background: url('./images/add.png')no-repeat 0 0;
                margin-right: 75px;
                &:hover{
                    background: url('./images/add1.png')no-repeat 0 0;
                }
            }
            .icon-detial{
                background: url('./images/detial.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/detial1.png')no-repeat 0 0;
                } 
            }
            .icon-QRcode{
                background: url('./images/qrcode.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/qrcode1.png')no-repeat 0 0;
                } 
            }
            .icon-location{
                background: url('./images/location.png')no-repeat 0 0;
                width: 12px;
                &:hover{
                    background: url('./images/location1.png')no-repeat 0 0;
                } 
            }
            .icon-delete{
                background: url('./images/delete.png')no-repeat 0 0;
                margin-right: 0;
                &:hover{
                    background: url('./images/delete1.png')no-repeat 0 0;
                } 
            }
            .detial-text-name{
                color: #999999;
                width: 65px;
                display: inline-block;
            }
            .detial-text-value{
                color: #333333;
                max-width: 130px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .item-detial{
                margin-top: 16px;
                &:first-of-type{
                     margin-top: 10px;
                }
            }
            &:first-of-type{
                padding-top: 14px;
            }
        }
    }
    #box-right-1{ 
        .head{
            padding: 11px 0 12px;
            height: 48px;
            border-bottom: 1px solid #cccccc;
            position: relative;
              .icon-goujian{
                float: left;
                width: 16px;
                height: 16px;
                cursor: pointer;
                margin-top: 6px;
                }
                .icon-download{
                    background: url('./images/download.png')no-repeat 0 0;
                    margin-left: 14px;
                    &:hover{
                        background: url('./images/download1.png')no-repeat 0 0;
                    }
                }
                .icon-search{
                    background: url('./images/search.png')no-repeat 0 0;
                    margin-left: 10px;
                    &:hover{
                        background: url('./images/search1.png')no-repeat 0 0;
                    }
                  }
               .inp-search{
                    width: 96px;
                    border-radius: 2px;
                    height: 24px;
                    border: 1px solid #e6e6e6;
                    position: relative;
                    background: #fafafa;
                    padding-left:10px;
                    padding-right:20px;
                    box-sizing: border-box;  
                    margin-right: 15px;
                    float: right;
                }
                .icon-sanjiao{
                    display: block;
                    position: absolute;
                    width: 12px;
                    height: 7px;
                    background-image:url('../Settings/images/sanjiao.png');
                    background-size: 100% 100%;
                    content: '';
                    top: 20px;
                    right: 22px;
                }
        }
        .item-version{
            margin:10px 15px 0 10px;
            border-bottom: 1px solid #e6e6e6;
            .img{
                float: left;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #ededed;
                margin-right:10px; 
            }
            .versin-detial{
                float: left;
                width: 150px;
                height: auto;
                position: relative;
                .user-name{
                    display: block;
                    color: #333333;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                    line-height: 22px;
                }
                .version-number{
                    display: block;
                    position: absolute;
                    min-width: 45px;
                    color: #fc3439;
                    font-size: 12px;
                    top: 0;
                    right: 0;
                    text-align: right;
                }
                .version-des{
                    font-size: 12px;
                    line-height: 18px;
                    padding: 3px 10px;
                    color: #666666;
                    background: #fafafa;
                    margin-top: 6px;
                }
            }
            .item-date{
                display: block;
                font-size: 12px;
                color: #cccccc;
                line-height: 12px;
                margin: 12px 0 11px;
                text-align: left;
            }
        }
    }
     /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
    width:15px;
     height: 15px;
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
    /*********************/
}
</style>
<script>
import ClipboardJS from'clipboard'
import axios from 'axios'
import './js/jquery-1.8.3.js'
import './js/jquery-ui-1.9.2.custom.js'
import './js/date.js'
import data from '../Settings/js/date.js'
import upload from '../uploadFile.vue'

export default {
  name:'Costover',
  components:{
      upload
  },
  data(){
      return {
        activeIndex:'1',
         tabShow:1,
         listStyle:'table',//列表展示方式
         fileSearchInfo:'',//查询文件名称
         checkAll: false,
         isIndeterminate: false,
         fileList:[],//文件列表
         folderList:[],//文件夹列表
         screenLeft:{
             show:true,
             item:1,
         },
         token:'',
         projId:'',
         userId:'',
         QJFileManageSystemURL:'',
         checkedItem:{},//选中的file
         GouJianItem:{},//选中file的构件
         versionItem:{},//选中file的版本信息
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
        docType:'',//个人上传是 1
         posType:'',//versionType
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        checkFileDir:{},//选中的文件夹信息
        QJ:{
            imageBackground:{},
            point:[]
        },
        sharePath:{
            show:false,
            path:'',
            password:''
        },
        hasImg:false,//没有全景图
        uploadImg:{
            checked:false
        },
        uploadtitle:'',
        isqj:0,
        QJfgid:0,//要上传或更新的fgid
        hasFileToPaste:{
            is:false,
            obj:{}
        },//session存在可以粘贴的文件
        expandedKeys:[],
        fgList:[],
        ShareBreadList:[],//蚂蚁线列表
        FGBreadList:[],//蚂蚁线列表
        breadList:[],//蚂蚁线列表
        fileName:{
            show:false,
            newFileName:'',
            currentFileName:'',
            title:'',
            new:true
        },
        ShareStyleHeader:false,
        shareIdList:[],//选中的最外层分享文件
        fileAll:[],//只要获取的文件（非分享层文件和fg层文件）都要往这里面添加
        auth:{
            canCancelShare:true
        },
        showLocation:false,
      }
  },
  created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.getIntoShareList()
    },
    mounted(){
        var vm = this 
    },
  watch:{
      checkAll:function(val){
          var vm = this
          if(val){
            vm.fileList.forEach((item,key)=>{
                vm.$set(item,'checked',true)
            })
             vm.folderList.forEach((item,key)=>{
                vm.$set(item,'checked',true)
            })
              vm.fgList.forEach((item,key)=>{
                vm.$set(item,'checked',true)
            })
          }else{
            vm.fileList.forEach((item,key)=>{
                vm.$set(item,'checked',false)
            })
            vm.folderList.forEach((item,key)=>{
                vm.$set(item,'checked',false)
            })
            vm.fgList.forEach((item,key)=>{
                vm.$set(item,'checked',false)
            })
          }
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
      posType:function(){
          var vm = this
          vm.getVersion()
      },
      docType:function(){
           var vm = this
           vm.getInfo()
      },
      checkFileDir:function(val){
          var vm = this

          /**
           * 从头添加目录
           * **/
          if(val.shareId){//最外层是分享页签
                vm.ShareBreadList = []
                vm.ShareBreadList.unshift({
                    nodeId:val.shareId,//目录id
                    nodeName:val.shareName,//目录名称
                })
          }else if(val.fgId){
                 vm.FGBreadList = []
                 vm.FGBreadList.push({
                    nodeId:val.fgId,//目录id
                    nodeName:val.fgName,//目录名称
                })
          }else{
              vm.breadList = []
              if(!val.isFG){
                vm.breadList.unshift({
                    nodeId:val.nodeId,//目录id
                    nodeName:val.nodeName,//目录名称
                    nodeParId:val.nodeParId
                })
                console.log(val.nodeParId)
                vm.findParent(val.nodeParId)
              }
          }
      }
  },
  methods:{
      refreshPage(){
          var vm = this
          var timestamp = Date.parse(new Date());
          /**
           *    vm.$router.push({
              path:`/home/projHome/${id}`,
              query: { firstView: 'Y' }
            })**/
        vm.getIntoShareList()
        vm.fileList = []
        vm.folderList = []
        vm.breadList = []
        vm.ShareBreadList=[]//蚂蚁线列表
        vm.FGBreadList=[]//蚂蚁线列表
        vm.ShareStyleHeader = false
        vm.showLocation = false
      },
        showLink(){
            var vm = this
            /**
             *    sharePath:{
                show:false,
                path:'',
                password:''
             },**/
             console.log(vm.checkedItem)
            vm.sharePath.show = true
            vm.sharePath.path = 'http://10.252.26.240:8080/qjbim-project/cloud/share/'+vm.checkedItem.shareNo
            vm.sharePath.password = vm.checkedItem.sharePassword !=null?vm.checkedItem.sharePassword:''
        },
        closeLink(){
            var vm = this
            vm.sharePath.show = false
            vm.sharePath.path = ''
            vm.sharePath.password = ''
        },
        openUrl(){
            var vm = this
            window.open(vm.sharePath.path);
        },
        cancleShare(){
            var vm = this
            console.log(vm.checkedItem)
            var fgIds = []
            var shareIdList = []
            if(vm.shareIdList.length==0){
                 vm.fgList.forEach((item,index)=>{
                    if(item.checked){
                        shareIdList.push(item.shareId)
                    }
                })
            }else{
                shareIdList = vm.shareIdList
                vm.folderList.forEach((item,index)=>{
                    if(item.checked){
                        if(item.fgId){
                              fgIds.push(item.fgId)
                        }else{
                              fgIds.push(item.nodeId)
                        }
                    }
                })
                vm.fileList.forEach((item,index)=>{
                    if(item.checked && item.fgId){
                        fgIds.push(item.fgId)
                    }
                })
            }
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/cancelShare',
                headers:{
                    'token':vm.token
                },
                data:{
                    fgIds:fgIds,
                    projId:vm.projId,
                    shareIdList:shareIdList
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                     if(vm.shareIdList.length==0){
                         vm.getIntoShareList()
                     }else{
                         if(vm.checkedItem.fgId){
                              vm.getInfoFolder()
                         }else{
                                vm.getSFInfo()//从分享文件最外层进入
                         }
                     }
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        findParent(val){
          var vm = this
          if(val == 0)return false
          console.log(vm.fileAll)
          for(var i=0;i<vm.fileAll.length;i++){
              if(vm.fileAll[i].nodeId == val){
                   vm.breadList.unshift({
                        nodeId:vm.fileAll[i].nodeId,//目录id
                        nodeName:vm.fileAll[i].nodeName,//目录名称
                        nodeParId:vm.fileAll[i].nodeParId
                    })
                    if(vm.fileAll[i].nodeParId != 0){
                          vm.findParent(vm.fileAll[i].nodeParId)
                    }
                    break
              }
          }
      },
        IntoDir(val,notsh,isFG){
            var vm = this
            vm.checkFileDir = val
            vm.ShareStyleHeader = true
            vm.shareIdList = []
            if(notsh){
                vm.getSFInfo()
                if(isFG){
                    vm.fileAll = []
                     vm.$set(vm.checkFileDir,'isFG',true)
                }
            }else{
                vm.shareIdList.push(val.shareId)
                vm.fileAll = []
                 if(!val.shareId){
                     vm.$set(vm.checkFileDir,'shareId',val.nodeId)
                    vm.$set(vm.checkFileDir,'shareName',val.nodeName)
                 }
                 vm.FGBreadList = []
                 vm.breadList = []
                vm.getInfoFolder()
            }
        },
      addFile(){
        var vm = this
        vm.fileName.show = true
        vm.fileName.new = true
        vm.fileName.title = '新建目录'
      },
      addfileCancle(){
          var vm = this
           vm.fileName.newFileName = ''
        vm.fileName.show = false
      },
      addfileConfirm(){
        var vm = this
        if(vm.fileName.new){
             axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/directory/add',
                headers:{
                    'token':vm.token
                },
                data:{
                    dirName: vm.fileName.newFileName,
                    dirParId: vm.checkFileDir.nodeId,//当前文件夹ID
                    ugId:vm.selectUgId,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录添加成功'
                    })
                    vm.fileName.show = false
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fileName.newFileName = ''
            }).catch((err)=>{
                console.log(err)
            })
        }else{
             axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/directory/'+vm.checkFileDir.nodeId+'/rename',
                headers:{
                    'token':vm.token
                },
                data:{
                    dirName: vm.fileName.newFileName,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录修改成功'
                    })
                    vm.fileName.show = false
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.fileName.newFileName = ''
            }).catch((err)=>{
                console.log(err)
            })
        }
      },
      renameFile(){
         var vm = this
        vm.fileName.show = true
         vm.fileName.new = false
        vm.fileName.title = '重命名目录'
      },
      deleteFile(){
        var vm = this
         vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/directory/'+vm.checkFileDir.nodeId+'/'+vm.projId+'/delete',
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'文件夹删除成功'
                    })
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
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
      uploadfile(){
        var vm = this
            vm.updateImg('文件上传',false,0)//非点位类型是0
      },
      /**
       * 私密分享：链接:http://10.252.26.240:8080/qjbim-project/cloud/share/2dfa27dc-3674-470a-86ed-363784268f7b  密码:b3yq
       * 公开分享：http://10.252.26.240:8080/qjbim-project/cloud/share/bba7acb1-301a-4ac0-81ac-c6c05f439076
       * **/
      copyURL(){
          var vm = this
          var clipboard = new ClipboardJS('.copyhref');

        clipboard.on('success', function(e) {
             vm.$message({
                    type:'success',
                    message:'复制成功'
                })
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
             vm.$message({
                type:'error',
                message:'复制失败'
            })
        });
      },
      shareURL(){
          var vm = this
          vm.sharePath.show = true
      },
      shareBtn(val){
        var vm = this
        axios({
            method:'POST',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/getShareFilePath',
            headers:{
                'token':vm.token
            },
            data:{
                fcIdList:[],
                fgIdList:[],
                projId:vm.projId,
                type:val
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.sharePath.path = response.data.rt.url
                vm.sharePath.password = response.data.rt.password?response.data.rt.password:''
                console.log(response.data.rt.password)
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      updateImg(val,is,index){
          var vm = this
          vm.uploadtitle = val
          if(is){
                vm.isqj = 1
          }else{
              vm.isqj = 0
          }
        vm.QJfgid = index
        vm.uploadImg.checked = true
      },
      hiddenupload(){
        var vm = this
        vm.uploadImg.checked = false
      },
      handleNodeClick(obj){
          console.log(obj)
          var vm = this
          if(!obj.children){
            vm.$message({
                type:'info',
                message:'这个文件夹没有子文件!'
            })
          }
          vm.checkFileDir = obj//选中的文件夹
          if(vm.expandedKeys.indexOf(vm.checkFileDir.nodeId) == -1){
            vm.expandedKeys.push(vm.checkFileDir.nodeId)
          }
        vm.getInfo()
      },
      parseMStatus(mStatus){
            // 施工现场
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
      splitType(val){
          return val.split('.')[0]
      },
      initData(val){
          if(!val)return ''
          var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
          return tt; 
      },
      /**
         * 预览文件集文件
         * @param fileUuid
         */
    view(filePath){
        //latestFile(fileId,fgId,"预览了文件"+fileName);
        var vm = this
        if(!filePath){
            if(vm.checkedItem){
                filePath =  vm.checkedItem.filePath
            }
        }
        if(!filePath){
            vm.$message({
            type:'info',
            message:'请勾选要预览的文件'
        })
        return false
        }
        window.open(vm.QJFileManageSystemURL+filePath+"/preview");
    },
    downLoad(filePath){
        //latestFile(fileId,fgId,"下载了文件"+fileName);
        var vm = this
         if(!filePath){
            if(vm.checkedItem){
                filePath =  vm.checkedItem.filePath
            }
        }
        if(!filePath){
             vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
            return false
        }
        window.open(vm.QJFileManageSystemURL + filePath+'');
    },
    downloadFile(){
        var vm = this
        var url = '/multiDownloadUrl?'
        var hasFilePath = false
        vm.fileList.forEach((item,key)=>{
            if(item.checked){
                hasFilePath = true
              url += 'urls='+item.filePath+'&'
            }
        })
        if(hasFilePath){
             vm.downLoad(url)
        }else{
            vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
        }
    },
    downloadBatchFile(){
        var vm = this
        var url = '/multiDownloadUrl?'
        var hasFilePath = false
        var fileId = []
        var empty = false
        for(var i=0;i<vm.folderList.length;i++){
            if(vm.folderList[i].checked){
                fileId.push(vm.folderList[i].nodeId)
            }
        }
        axios({
            method:'GET',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/getFileListByDirOrFile',
            headers:{
                'token':vm.token
            },
            params:{
                dirId:vm.checkFileDir.nodeId,//目录id
                fileId:fileId,//文件id
                projId:vm.projId
            },
        }).then((response)=>{
            if(response.data.cd == 0){
               if(response.data.rt.length>0){
                   for(var i= 0;i<response.data.rt.length;i++){
                        url += 'urls='+response.data.rt[i]+'&'
                   }
               }else{
                   empty = true
                   vm.$message({
                       type:'info',
                       message:"您所选择的文件夹为空，里面一无所有"
                   })
               }
            }
        }).catch((err)=>{
            console.log(err)
        })
        var timer = setInterval(function(){
            if(url != '/multiDownloadUrl?'){//如果url变化，结束定时器
                vm.downLoad(url)
                clearInterval(timer)
            }
            if(empty){//若ajax 执行完 empty为true，结束定时器
                 clearInterval(timer)
            }
        },100)
    },
    checkShareItem(val){
        var vm = this
        vm.checkedItem = vm.fgList[val]
        vm.fgList[val].checked =  vm.fgList[val].checked?false:true
        vm.showLocation = false
        var showLocationNum = 0
        for(var i=0;i<vm.fgList.length;i++){
            if(vm.fgList[i].checked){
                showLocationNum++
            }
        }
        if(showLocationNum == 1){//全部选中
            vm.showLocation = true
        }
    },
    checkItem(val,file){
        var vm = this
        vm.show.basicAttributes =true
        vm.show.BindingArtifacts =true
        vm.auth.canCancelShare = true
        if(file){
            vm.checkedItem = vm.fileList[val]
             vm.fileList[val].checked =  vm.fileList[val].checked?false:true
            vm.getGouJianInfo()
            vm.getVersion()
        }else{
             vm.checkedItem = vm.folderList[val]
             vm.folderList[val].checked =  vm.folderList[val].checked?false:true
        }
        for(var i=0;i<vm.fileList.length;i++){
            if(vm.fileList[i].checked && !vm.fileList[i].fgId){
                vm.auth.canCancelShare = false
                break
            }
        }
    },
    getVersion(){
         var vm = this
         var fgId = ''
         if(vm.checkedItem){
             if(!vm.checkedItem.fgId){
                 vm.versionItem = {}
                 return false
             }
             fgId = vm.checkedItem.fgId
         }
        axios({
            method:'POST',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/getFileGroupVersionList',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:fgId,
                versionType:vm.posType,
                docType:vm.docType//获取是1
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.versionItem = response.data.rt == null?{}:response.data.rt
                console.log( vm.versionItem)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getGouJianInfo(){
        var vm = this
        var relaId = ''
       
         if(vm.checkedItem){
             if(!vm.checkedItem.fgId){
                 vm.GouJianItem = []
                 return false
             }
             relaId = vm.checkedItem.fgId
         }
        axios({
            method:'GET',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/'+vm.projId+'/entityRelation/list',
            headers:{
                'token':vm.token
            },
            params:{
                relaId:relaId,
                relaType:1//获取是1
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.GouJianItem = response.data.rt.relaList == null?{}:response.data.rt.relaList
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getIntoShareList(){
        var vm = this
        axios({
            method:'GET',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/hasShared',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.selectUgId = response.data.rt.selectUgId
                vm.getInfo()
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
    getInfo(){
        var vm = this
        /**
         *             dirId: vm.checkFileDir.nodeId,//当前文件夹ID
            ugId: vm.selectUgId, //ugid是群组ID
         * **/
        axios({
            method:'POST',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/searchSharedFolderInfo',//查询单个文件 ，下面要查询单个文件夹
            headers:{
                'token':vm.token
            },
            params:{
                pageNo:1,
                pageSize:20,
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                if(response.data.rt.length>0){
                    vm.fgList = response.data.rt
                    vm.fgList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                    })
                }else{
                    vm.$message({
                        type:'info',
                        message:'未匹配到相应的数据'
                    })
                    vm.fgList = ''
                }
            }
        })
    },
    getInfoFolder(){
            /**
             * 
             * 点击进入fg文件夹
             * **/
            var vm = this
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/searchSharedFileGroupInfo',//查询单个文件 ，下面要查询单个文件夹
                headers:{
                    'token':vm.token
                },
                data:{
                    projId:vm.projId,
                    pageNo: 1,
                    dirId:vm.checkFileDir.shareId,
                    pageSize:20,//文件名称
                }
            }).then((response)=>{
                vm.fgList = []
                vm.folderList = []
                vm.fileList = []
                if(response.data.cd == 0){
                    if(response.data.rt.rows.length>0){
                        response.data.rt.rows.forEach((item,key)=>{
                            vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                            if(item.icon != null){
                                 vm.fileList.push(item)
                            }else{
                                  vm.$set(item,'nodeName',item.fgName)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                                  vm.$set(item,'nodeId',item.fgId)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                                  vm.folderList.push(item)
                            }
                        })
                    }else{
                        vm.$message({
                            type:'info',
                            message:'未匹配到相应的数据'
                        })
                    }
                }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getSFInfo(){
        var vm = this
        /**
         *             dirId: vm.checkFileDir.nodeId,//当前文件夹ID
            ugId: vm.selectUgId, //ugid是群组ID
         * **/
        axios({
            method:'POST',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/searchFileGroupInfo',//查询单个文件 ，下面要查询单个文件夹
            headers:{
                'token':vm.token
            },
            data:{
                dirId:vm.checkFileDir.nodeId,//
                pageNo:1,
                pageSize:20,
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                 vm.fileList = []
                if(response.data.rt.rows.length>0){
                    vm.fileList = response.data.rt.rows
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                    })
                }
                vm.getSFFolder()
            }
        })
    },
    getSFFolder(){
            /**
             * 
             * 获取单个文件夹
             * **/
            var vm = this
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/searchFolderInfo',//查询单个文件 ，下面要查询单个文件夹
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    ugId: -1,
                    parDirId:vm.checkFileDir.nodeId,
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    if(response.data.rt.length>0){
                        vm.folderList = response.data.rt
                        vm.folderList.forEach((item,key)=>{
                            vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                             var alreadyHas = false
                            for(var i= 0;i<vm.fileAll.length;i++){
                                if(item.nodeId == vm.fileAll[i].nodeId){
                                    alreadyHas = true
                                    break
                                }
                            }
                            /*
                                查询所有记录 没有相同nodeID，插入信息
                            */
                            if(!alreadyHas)vm.fileAll.push(item)
                        })
                    }else{
                        vm.folderList = []
                    }
                }else{
                    vm.folderList = []
                }
        }).catch((err)=>{
            console.log(err)
        })
    },
  }
}
</script>



