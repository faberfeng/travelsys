<template>
<div id="DesignManagement">
        <div id="GroupSelect">
            <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in  ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div id="item-box-file">
                <span  class="label-item-active label-item">
                    <router-link :to="'/Design/management'">  
                    设计协调  
                   </router-link>
                </span>
                <span  class="label-item">
                    <router-link :to="'/Design/attributeManager'">  
                    属性管理  
                   </router-link>
                </span>
                <span  class="label-item">
                <router-link :to="'/Design/designversion'">  
                    设计版本  
                  </router-link>
                </span>
            </div>
            <div id="containerMessage">
                <p class="header clearfix">
                    <span class="title">设计协同</span>
                    <span class="item-upload">新建主题</span>
                </p>
                <div class="ForumSelector">
                    <span class="name">筛选条件</span>
                    <ul>
                            <!-- options_monomer:[],//单体选项
                            options_status:[],//状态选项
                            options_about:[],//相关选项 -->
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
                            <span class="title">状态</span>
                            <el-select v-model="value_status" placeholder="请选择">
                                <el-option
                                v-for="item in options_status"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                          <li class="selectItem">
                            <span class="title">相关</span>
                            <el-select v-model="value_about" placeholder="请选择">
                                <el-option
                                v-for="item in options_about"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                    </ul>
                </div>
                 <div class="project">
                    <ul class="projectList">
                            <li v-for="(item,index) in CommunicationList" :key="index">
                                <div class="projectListInfo">
                                    <div class="projectListImg">
                                        <img :src="'http://10.252.26.240:8080/qjbim-file/'+item.userImg">
                                    </div> 
                                    <div class="projectListText">
                                        <p class="title"><label class="projectListTextName">{{item.userName}}</label><span :title="item.subTitle"  class="projectList-detial">{{item.content}}</span></p>
                                        <p class="font-color1">{{item.title}}</p>
                                        <p class="projectBottom">{{item.date | toLocalD}}<label>{{item.fromIn}}</label></p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                    <span class="item-property " @click="screenLeft.item = 1">图<br>纸</span>
                    <span class="item-version " @click="screenLeft.item = 2">联<br>系<br>人</span>
                    <span class="item-version-3  " @click="screenLeft.item = 3;">属<br>性</span>
                </div>
            </div>
            <div v-if="screenLeft.item == 1" class="screenRight_1">
                <div v-if="showAction">
                    <p class="clearfix" v-if="IsFolderAction">
                        <i class="icon-goujian icon-add" title="新建文件夹" @click="addFile"></i>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile"></i>
                        <i class="icon-goujian icon-edit"  title="重命名" @click="renameFile"></i>
                        <i class="icon-goujian icon-upload"  title="上传图纸" @click="uploadFile"></i>
                    </p>
                    <p class="clearfix" v-else>
                        <i class="icon-goujian icon-load" title="加载" @click="addFile"></i>
                        <i class="icon-goujian icon-view"  title="预览" ></i>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile"></i>
                        <i class="icon-goujian icon-edit"  title="编辑" @click="renameFile"></i>
                    </p>
                </div>
                <el-tree
                    :data="FileTree"
                    ref="fileTree_DesignManagement"
                    node-key="id"
                    :props="defaultProps"
                    :default-expanded-keys="expandedKeys"
                    highlight-current
                    @node-click="handleNodeClick"
                    id="cloudDirveFileTree"
                    :class="[showAction?'':'noTop']"
                >
                <span :class="['custom-tree-node','el-tree-node__label',data.isLeaf?'fileIcon':'']" slot-scope="{ node, data }" v-text="node.label"></span>
                </el-tree>
            </div>
            <div id="box-right" v-else-if="screenLeft.item == 2">
                222
            </div>
            <div id="box-right-1" v-else>
                333
            </div>
        </div>
      <div id="edit">
        <el-dialog title="文件重命名" :visible="PointFigure.renameshow" @close="renameCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">原文件名 :</label>
                    <span v-text="PointFigure.oldname"></span>
                </div>
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">新文件名 :</label>
                    <input type="text" class="inp" v-model="PointFigure.newname">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="renameIMG">更名</button>
                <button class="editBtnC" @click="renameCancle">取消</button>
            </div>
        </el-dialog>
         <el-dialog :title="fileName.title" :visible.sync="fileName.show" @close="addfileCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody">
                    <label class=" imageBodyText">目录名称 :</label>
                     <input type="text" class="inp" v-model="fileName.newFileName">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addfileConfirm">确认</button>
                <button class="editBtnC" @click="addfileCancle">取消</button>
            </div>
        </el-dialog>
         <el-dialog title="图纸上传" :visible.sync="drawingsUploadShow" @close="drawingsUploadCancel" class="uploadBox">
            <div class="editBody">
                <div class="yingsheProject">
                    <label class="yingsheProjectText">图纸列表 : </label>
                    <label class="editBtnS yingsheProjectBtn" for="drawingsInfo">选择文件</label>
                    <input class="upInput"  type="file" accept="image/*" @change="fileChanged($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                </div>
                <table class="fileContainer" border="1">
                    <thead>
                        <tr  class="userList-thead">
                            <th style="width:20%">图号</th>
                            <th style="width:27%">图名</th>
                            <th style="width:12%">比例</th>
                            <th style="width:19%;max-width:200px;">文件名称</th>
                            <th style="width:12%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in fileList" :key="index">
                            <td>
                                <input  placeholder="请输入" v-model="item.drawingNo" class="calculateInp">
                            </td>
                            <td>
                                <input  placeholder="请输入" v-model="item.drawingName" class="calculateInp">
                            </td>
                            <td>
                                <select v-model="item.proportion" class="inp-search" ref="proportion">
                                    <option value=""></option>
                                    <option value="1:20">1:20</option>
                                    <option value="1:25">1:25</option>
                                    <option value="1:30">1:30</option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </td>
                            <td v-text="item.fileName"></td>
                            <td>
                                 <button class="deleteBtn actionBtn" style="margin-right:10px" @click="deleteFileList(index)"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="drawingsUploadConfirm">上传</button>
                <button class="editBtnC" @click="drawingsUploadCancel">关闭</button>
            </div>
        </el-dialog>
    </div>
</div>
</template>
<style  lang='less'>
    #DesignManagement{
        /*
            修改eleUI树形组件
        */
        .el-tree-node:focus .el-tree-node__content{
            background-color: transparent;
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background-color: #dfdfdf;
        }
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
      
        .is-leaf:before{
            content: ""!important;
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
            background: url('../ManageCost/images/file.png')no-repeat 0 0;
            content: '';
        }
        .fileIcon::before{
            width: 16px;
            height: 16px;
             top: 0px;
            background-image: url('./images/zTreeStandard.png');
            background-position: -110px -32px;
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
        .upInput{
            display: none;
        }
        #edit{ 
            .el-dialog{
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
                background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
            }
            .yingsheProject{
                overflow: hidden;
                margin-bottom: 10px;
            }
            .yingsheProjectText{
                color: #999;
                display: block;
                float: left;
                margin-left: 30px;
                font-size: 14px;
                line-height: 36px;
            }
            .yingsheProjectBtn{
                float: right;
                margin-right: 30px;
                line-height: 36px;
            }
         }
         .uploadBox .el-dialog__body{
                margin-top: 21px;
                .fileContainer{
                    width: 600px;
                    margin: 0px 30px;
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                        background: #f8f8f9;
                        th{
                            padding-left: 10px;
                            height: 40px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    tbody{
                        tr{
                            td{
                                padding-left: 5px;
                                padding-right: 5px;
                                height: 40px;
                                text-align: left;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #333333;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                position: relative;
                                input,select{
                                    float: left;
                                    width: 100%;
                                    height: 32px;
                                    border: 1px solid #d1d1d1;
                                    border-radius: 2px;
                                    background: #fafafa;
                                    padding-left: 10px;
                                }
                                .icon-sanjiao{
                                    display: block;
                                    position: absolute;
                                    width: 12px;
                                    height: 7px;
                                    background-image:url('../Settings/images/sanjiao.png');
                                    background-size: 100% 100%;
                                    content: '';
                                    top: 16px;
                                    right: 11px;
                                }
                            }
                            &:hover{
                                background: #fafafa;
                            }
                        }
                    }
                }
                .actionBtn{
                    width: 16px;
                    height: 16px;
                    border: none;
                    cursor: pointer;
                    margin-right: 16px;
                    margin-top:9px;
                }
                .editBtn{
                    background: url('../../assets/edit.png') no-repeat;
                }
                .deleteBtn{
                    background: url('../../assets/delete.png') no-repeat;
                }
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
            #containerMessage{
                padding-left:30px; 
                .header{
                    text-align: left;
                    margin: 15px 0;
                    .title{
                        font-size: 14px;
                        float: left;
                        color: #fc3439;
                        font-weight: bold;
                    }
                    .item-upload{
                        float: right;
                        margin-right: 30px;
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
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                        }
                    }
                }
                .ForumSelector{
                    border: 1px solid #d9d9d9;
                    height: 40px;
                    color: #999999;
                    font-size: 12px;
                    margin-right: 30px;
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
                                }
                            }
                           
                        }
                        .selectItem:first-of-type .el-select .el-input__inner{
                            width: 170px;
                        }
                    }
                }
                  .project{
                    margin: 20px 0px 0 0px;
                }
                .projectList{
                        width: 100%;
                        list-style: none;
                        overflow: auto;
                        padding-left: 0;
                        margin-top: 0px;
                        
                }
                .projectList li{
                    display: inline-block;
                    width: 100%;
                    margin-top: 5px; 
                    border-bottom:1px solid #ebebeb;
                }
                .projectListInfo{
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                }
                .projectListImg{
                    width: 80px;
                    float: left;
                }
                .projectListText{
                    font-size: 12px;
                    flex: 1;
                    margin: 0 2px;
                    float: left;
                    text-align: left;
                }
                .projectListText .title{
                    width: 100%;
                    height: 35px;
                    line-height: 35px;
                    text-align: left;
                    font-size: 16px;
                    font-weight: bold;
                }
                .title span{
                    font-size: 14px;
                    display: inline-block;
                    margin-left: 20px;
                    color: #666;
                    position: relative;
                    top: 10px;
                }
                .projectListText .title a{
                    float: right;
                    width: 100px;
                    font-size: 14px;
                    cursor: pointer;
                    text-align: center;
                    color: #999;
                    line-height: 45px;
                }
                .projectListText .title a:hover{
                    color: #fc3439;
                }
                .projectListText .title a .el-icon-arrow-right{
                    margin-left: 1px;
                }
                .projectListBtn{
                    width: 20%;
                    float: left;
                }
                .projectList img{
                    width: 48px;
                    height: 48px;
                    border-radius:48px; 
                    margin: 15px 12px 10px;
                }
                .projectListTextName{
                    font-size: 18px;
                    font-family: '微软雅黑';
                    font-weight: bold;
                    display: inline-block;
                    /* float: left; */
                }
                .projectBottom{
                    width: 100%;
                    font-size: 12px;
                    font-family: '微软雅黑';
                    overflow: hidden;
                    color: #ccc;
                    margin-top: 20px;
                    margin-bottom: 6px;
                }
                .projectBottom label{
                    display: inline-block;
                    width: 30%;
                    margin-left: 20px;
                }
                .font-color1{
                    color: #333;
                    font-size: 14px;
                }
                .projectList-detial{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 500px;
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
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 10px;
                border-bottom: 1px solid #e6e6e6;
                #cloudDirveFileTree{
                    display: block;
                    position: absolute;
                    left: 35px;
                    right: 0;
                    bottom: 0;
                    top: 42px;
                    overflow-y: auto;
                }
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
                .icon-add{
                    background: url('../ManageCost/images/add.png')no-repeat 0 0;
                    margin-right: 75px;
                    &:hover{
                        background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                    }
                }
                .icon-authrity{
                    float: right;
                    background: url('../ManageCost/images/authority.png')no-repeat 0 0;
                    &:hover{
                        background: url('../ManageCost/images/authority1.png')no-repeat 0 0;
                    } 
                }
                .icon-edit{
                    float: right;
                    background: url('../ManageCost/images/edit.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('../ManageCost/images/edit1.png')no-repeat 0 0;
                    } 
                }
                .icon-load{
                    background: url('./images/loading.png')no-repeat 0 0;
                    margin-right: 75px;
                }
                .icon-upload{
                    float: right;
                    background: url('./images/upload.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/upload1.png')no-repeat 0 0;
                    } 
                }
                 .icon-view{
                    float: right;
                    background: url('./images/view.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/view1.png')no-repeat 0 0;
                    } 
                }
                .icon-delete{
                    float: right;
                    background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
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
                    background: url('../ManageCost/images/add.png')no-repeat 0 0;
                    margin-right: 75px;
                    &:hover{
                        background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                    }
                }
                .icon-detial{
                    background: url('../ManageCost/images/detial.png')no-repeat 0 0;
                    &:hover{
                        background: url('../ManageCost/images/detial1.png')no-repeat 0 0;
                    } 
                }
                .icon-QRcode{
                    background: url('../ManageCost/images/qrcode.png')no-repeat 0 0;
                    &:hover{
                        background: url('../ManageCost/images/qrcode1.png')no-repeat 0 0;
                    } 
                }
                .icon-location{
                    background: url('../ManageCost/images/location.png')no-repeat 0 0;
                    width: 12px;
                    &:hover{
                        background: url('../ManageCost/images/location1.png')no-repeat 0 0;
                    } 
                }
                .icon-delete{
                    background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                    margin-right: 0;
                    &:hover{
                        background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
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
                        background: url('../ManageCost/images/download.png')no-repeat 0 0;
                        margin-left: 14px;
                        &:hover{
                            background: url('../ManageCost/images/download1.png')no-repeat 0 0;
                        }
                    }
                    .icon-search{
                        background: url('../ManageCost/images/search.png')no-repeat 0 0;
                        margin-left: 10px;
                        &:hover{
                            background: url('../ManageCost/images/search1.png')no-repeat 0 0;
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
            .active-item{
            box-shadow: 0px 1px 8px rgba(252, 52, 57, 0.2);
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
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/jquery-ui-1.9.2.custom.js'
import '../ManageCost/js/date.js'
import data from '../Settings/js/date.js'

export default {
  name:'Costover',
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
         checkedItem:{},//选中的file
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
         FileTree_original:[],//原始文件树形图
        FileTree:[],//文件夹树形图
        defaultProps: {
          children: 'children',
          label: 'ddName',
          isLeaf:'leaf'
        },
        selectUgId:'',//选中的群组id
        ugList:[],//群组列表
        checkFileDir:{},//选中的文件夹信息
        PointFigure:{
            renameshow:false,
            oldname:'',//这是点位图的旧名称
            newname:'',//点位图新名称
            fgID:''
        },
        expandedKeys:[],
        fileName:{
            show:false,
            newFileName:'',
            currentFileName:'',
            title:'',
            new:true
        },
        /*以下为后期添加数据*/
        options_monomer:[],//单体选项
        options_status:[
            {
                id:'-1',
                Name:'全部状态'
            },{
                id:'1',
                Name:'正在处理'
            },{
                id:'2',
                Name:'解决完成'
            },{
                id:'3',
                Name:'终结讨论'
            }
        ],//状态选项
        options_about:[
            {
                id:'-1',
                Name:'全部讨论'
            },{
                id:'1',
                Name:'由我发表'
            },{
                id:'2',
                Name:'有我评论'
            },{
                id:'3',
                Name:'有提到我'
            },
            {
                id:'4',
                Name:'我的收藏'
            }
        ],//相关选项
        showAction:false,
        IsFolderAction:null,
        value_monomer: '',//单体 筛选关键词
        value_status: '-1',//单体 筛选关键词
        value_about: '-1',//单体 筛选关键词
        CommunicationList:[],//消息流列表
        drawingsUploadShow:false,//添加图纸弹窗的显隐
        fileList:[],//即将上传的文件集合
        columnsProject:[
            {
                label:'图号',
                prop:'drawingNo',
                type: 'template',
                template: 'drawingNo',
                width:'100px'
            },
            {
                label:'图名',
                prop:'drawingName',
                 type: 'template',
                template: 'drawingName',
                width:'147px'
            },
            {
                label:'比列',
                prop:'proportion',
                type: 'template',
                template: 'proportion',
                width:'100px'
            },
            {
                label:'文件名称',
                prop:'fileName',
                width:'150px'
            },
            {
                label:'操作',
                prop:'operator',
                type: 'template',
                template: 'action',
                width:'100px'
            },
        ],
        props: {
            stripe: false,
            border: true,
            showHeader: true,
            showSummary: false,
            showRowHover: true,
            showIndex: false,
            treeType: true,
            isFold: true,
            expandType: false,
            selectionType: false,
        }, 
      }
  },
  created(){
        var vm = this
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.getIntoDesignPage()
    },
  watch:{
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
      selectUgId:function(val){
            var vm = this 
            vm.getFileTree()
      },
  },
  methods:{
      addFile(){
        var vm = this
        vm.fileName.show = true
        vm.fileName.new = true
        vm.fileName.title = '新建目录'
      },
      deleteFileList(index){
          var vm = this
          vm.fileList.splice(index,1)
      },
       fileChanged(file){
            var vm = this
            const list = vm.$refs.drawingsInfo.files
            vm.fileList.push({
                file:list[0],//文件
                drawingNo:'',//图号
                proportion:'',//比例
                fileName:list[0].name,//文件名
                drawingName:list[0].name.split('.')[0],//图纸名
            })
            console.log(vm.fileList)
        },
      addfileCancle(){
          var vm = this
           vm.fileName.newFileName = ''
        vm.fileName.show = false
      },
      uploadFile(){
        var vm = this
        vm.drawingsUploadShow = true
      },
      drawingsUploadCancel(){
        var vm = this
        vm.drawingsUploadShow = false
        vm.fileList = []
      },
      drawingsUploadConfirm(){
        var vm = this
        vm.fileList.forEach((item,index)=>{
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
            var returnUrl = 'http://10.252.26.240:8080/h2-bim-project/project2/drawing/'+vm.projId+'/'+vm.defaultSubProjId+'/add?dcode='+item.drawingNo+'&ddId='+vm.checkFileDir.id+'&dname='+item.fileName+'&dscale='+item.proportion+'&entId='+vm.entId
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
             formData.append('type',1);
            formData.append('file',item.file);
            formData.append('userId',vm.userId);
            formData.append('modelCode','002');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                console.log(response)
                if(response.data.rt){
                    vm.drawingsUploadShow = false
                    vm.fileList = []
                }
            }).catch((err)=>{
                console.log(err)
                vm.drawingsUploadShow = false
                vm.fileList = []
            })
        })
      },
    uploadIMG(){
            var vm = this
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
           console.log(vm.dirid+':::'+vm.fgid+':::'+vm.des+':::'+vm.isqj)
            var returnUrl = "http://10.252.26.240:8080/h2-bim-project/project2/doc/uploadFile?dirId="+vm.dirid+"&fgId="+vm.fgid+"&fileDesc="+vm.des+"&isUploadPoint="+vm.isqj;
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
             formData.append('type',1);
            formData.append('file',vm.filesList);
            formData.append('userId',vm.userId);
            formData.append('modelCode','002');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                console.log(response)
                if(response.data.rt){
                    vm.des = ''
                    vm.imageName ='未选择任何文件'
                     vm.$emit('refreshqj')
                }
            }).catch((err)=>{
                vm.des = ''
                vm.imageName ='未选择任何文件'
                 vm.$emit('refreshqj')
                console.log(err)
            })
        },
      addfileConfirm(){
        var vm = this
        if(vm.fileName.new){
             axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/drawing/directory/add',
                headers:{
                    'token':vm.token
                },
                data:{
                    ddName: vm.fileName.newFileName,
                    ddParId: vm.checkFileDir.id,//当前文件夹ID
                    subProjId:vm.defaultSubProjId,
                    projId: vm.projId,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录添加成功'
                    })
                    vm.getFileTree()
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
                url:'http://10.252.26.240:8080/h2-bim-project/project2/drawing/directory/'+vm.checkFileDir.id+'/rename',
                headers:{
                    'token':vm.token
                },
                params:{
                    ddName: vm.fileName.newFileName,
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'目录修改成功'
                    })
                    vm.getFileTree()
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
       renameCancle(){
        var vm = this
        vm.PointFigure.renameshow = false
      },
      renameFile(){
         var vm = this
        if(vm.checkFileDir.ddParId == 0){
            vm.$message({
            type: 'error',
            message: '该节点不能修改名称！'
          });  
          return false
        }
        vm.fileName.show = true
         vm.fileName.new = false
        vm.fileName.title = '重命名目录'
      },
      deleteFile(){
        var vm = this
         if(vm.checkFileDir.ddParId == 0){
            vm.$message({
            type: 'error',
            message: '该节点不能删除！'
          });  
          return false
        }
         vm.$confirm('此操作将永久删除当前节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/drawing/directory/'+vm.checkFileDir.id+'/delete',
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'节点删除成功'
                    })
                    vm.getFileTree()
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
    renameIMG(){
        var vm = this
        var fgID = vm.PointFigure.fgID?vm.PointFigure.fgID:vm.checkedRound.ID
        axios({
            method:'POST',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/updateFileGroupName',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:fgID,
                fgName: vm.PointFigure.newname
            },
        }).then((response)=>{
            if(response.data.cd == 0){
              
            }
        }).catch((err)=>{
            console.log(err)
        })
      },
      handleNodeClick(obj){
          var vm = this
          vm.showAction = true
          if(!obj.isLeaf){
            vm.IsFolderAction = true
            if(!obj.children){
                vm.$message({
                    type:'info',
                    message:'这个文件夹没有子文件或图纸!'
                })
            }
          }else{
              vm.IsFolderAction = false
          }
         vm.checkFileDir = obj//选中的文件夹
         if(vm.expandedKeys.indexOf(vm.checkFileDir.id) == -1){
            vm.expandedKeys.push(vm.checkFileDir.id)
          }
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
    view(filePath,fileId,fileName){
        //latestFile(fileId,fgId,"预览了文件"+fileName);
        var vm = this
        if(!filePath){
            if(vm.checkedItem || vm.checkedRound){
                vm.versionItem.forEach((item)=>{
                    if(item.checked){
                        filePath =  item.filePath
                        fileId = item.fileId
                        fileName = item.fileName
                    }
                })
            }
        }
        if(!filePath){
            vm.$message({
            type:'info',
            message:'请勾选要预览的文件的版本'
        })
        return false
        }
        vm.latestFile(fileId,"下载了文件"+fileName);
        window.open(vm.QJFileManageSystemURL+filePath+"/preview");
    },
    getIntoDesignPage(){
        var vm = this
        axios({
            method:'GET',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/dc/designCoordination',
            headers:{
                'token':vm.token
            },
            params:{
                projId:vm.projId
            }
        }).then((response)=>{
            if(response.data.cd == 0){
                vm.ugList = response.data.rt.ugList
                vm.ugList.forEach((item)=>{
                    if(item.ugId == response.data.rt.selectUgId){
                        vm.$set(item,'checked',true)//设置checked属性，用于文件权限弹窗选择使用
                    }else{
                         vm.$set(item,'checked',false)//设置checked属性，用于文件权限弹窗选择使用
                    }
                })
                vm.options_monomer = response.data.rt.subProjects//单体列表
                vm.options_monomer.unshift({
                    id:response.data.rt.siteHolderId,
                    Name:'场地总体'
                },)
                vm.value_monomer = response.data.rt.siteHolderId
                vm.selectUgId = response.data.rt.selectUgId
                // vm.getFileTree()
                vm.getMessage()
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
    getMessage(){
        // var vm = this
        // axios({
        //     method:'GET',
        //     url:'http://10.252.26.240:8080/h2-bim-project/project2/doc/'+vm.projId+'/'+vm.selectUgId+'/directory',
        //     headers:{
        //         'token':vm.token
        //     },
        // }).then((response)=>{
        //     if(response.data.cd == 0){
        //         vm.FileTree_original = response.data.rt
        //         vm.FileTree = data.transformTozTreeFormat(setting, response.data.rt)
        //     }
        // }).catch((err)=>{
        //     console.log(err)
        // })
    },
    getFileTree(){
        var vm = this
        var setting = {
            data: {
                key:{
                    name: "ddName",
                    children:'children',
                    title:"ddName",
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "ddParId",
                    rootPId: 0
                }
            }
        };
        axios({
            method:'GET',
            url:'http://10.252.26.240:8080/h2-bim-project/project2/drawing/'+vm.projId+'/'+vm.defaultSubProjId+'/list',
            headers:{
                'token':vm.token
            },
        }).then((response)=>{
            if(response.data.cd == 0){
                var drawingList = response.data.rt.drawingList
                drawingList.forEach((item,index) => {
                    vm.$set(item,'ddParId',item.ddId)
                    vm.$set(item,'isLeaf',true)
                    vm.$set(item,'ddName',item.dname)
                });
                var drawingDirList = response.data.rt.drawingDirList
                var children = drawingDirList.concat(drawingList)
                vm.FileTree_original = children
                vm.FileTree = data.transformTozTreeFormat(setting, children)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
  }
}
</script>