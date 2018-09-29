<template>
<div>
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/Drive/costover'" class="label-item-active label-item">  
                    最近文档  
                    </router-link>
                    <router-link :to="'/Drive/cloudDrive'" class="label-item">  
                    工程云盘  
                    </router-link>
                    <router-link :to="'/Drive/Share'" class="label-item">  
                        已经分享  
                    </router-link>
                    <router-link :to="'/Drive/PersonalTransit'" class="label-item">  
                        个人中转  
                    </router-link>
                    <div class="item-search">
                        <span class="title-right">
                            <input type="text" v-model="fileSearchInfo" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="getInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                        </span>
                        <span class="icon-type" @click="listStyle = (listStyle == 'card'?'table':'card')"></span>
                    </div>
                </div>
                <p class="select-header clearfix">
                        <label :class="[checkAll?'active':'','checkbox-fileItem']" for="allfile" @click="initAll()"></label>
                        <input type="checkbox" id='allfile' class="el-checkbox__original" v-model="checkAll">
                        <span class="button-download" @click="downloadFile">下载</span>
                </p>
                <div id="file-container" v-if="listStyle == 'card'">
                    <ul class="clearfix" style="padding: 0px 10px 15px 20px;">
                        <li :class="[{'item-file-active':item.checked},'item-file']" v-for="(item,index) in fileList" :key="index"  @click="checkItem(index)">
                            <label :class="[item.checked?'active':'','checkbox-fileItem']"  @click.stop="checkItem(index,true)"></label>
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
                                        <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                        <i class="icon-goujian icon-download" @click="downLoad(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                    </p>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="file-container-table" v-else>
                    <table class="UserList" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th style="width:55px;"></th>
                                <th style="min-width:428px;">文件名</th>
                                <th style="width:70px;"></th>
                                <th style="width:70px;">更新渠道</th>
                                <th style="width:50px;">类型</th>
                                <th style="width:40px;">版本</th>
                                <th style="min-width:60px;">上传人</th>
                                <th style="min-width:150px;">更新时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in fileList" :key="index" :class="[{'active':item.checked}]"  @click="checkItem(index)">
                                <td>
                                    <label :class="[item.checked?'active':'','checkbox-fileItem']" @click.stop="checkItem(index,true)"></label>
                                    <input type="checkbox" :id='item.fileId+"file"' class="el-checkbox__original" v-model="item.checked">
                                </td>
                                <td>
                                    <img :src="require('./images/icon/'+item.icon)" />
                                    <span v-text="item.fgName"></span>
                                </td>
                                <td>
                                    <i class="icon-goujian icon-download" @click="downLoad(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                    <i class="icon-goujian icon-search" @click="view(item.filePath,item.fileId,item.fileName,item.fgId)"></i>
                                </td>
                                <td  v-text="item.uploadFromExplorer == 1?'浏览器':'手机端'"></td>
                                <td v-text="splitType(item.icon)"></td>
                                <td v-text="item.version"></td>
                                <td v-text="item.uploadUser"></td>
                                <td v-text="initData(item.updateTime)"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':'active-version']">
                    <span class="item-property " @click="screenLeft.item = 1;">属<br>性</span>
                    <span class="item-version " @click="screenLeft.item = 2">版<br>本</span>
                </div>
            </div>
            <div id="box-right" v-show="screenLeft.show" v-if="screenLeft.item == 1">
                <h3 class="header-attribute" style="margin-top: 0px;">
                    <i class="trrangle"></i>
                    基本属性
                    <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                </h3>
                <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]" v-if="fileCheckedNum == 1">
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
                 <ul id="basicAttributes" :class="[{'show':show.basicAttributes}]" v-else>
                    <li class="detial-item clearfix">
                        <span class="detial-text-name">选择数量</span>
                        <span class="detial-text-value" v-text="fileCheckedNum"></span>
                    </li>
                </ul>
                <div v-if="fileCheckedNum == 1">
                    <h3 class="header-attribute">
                        <i class="trrangle"></i>
                        绑定构件
                        <i :class="[{'active':show.BindingArtifacts},'icon-dropDown']" @click="show.BindingArtifacts = show.BindingArtifacts?false:true;"></i>
                    </h3>
                    <ul id="BindingArtifacts" :class="[{'show':show.BindingArtifacts}]">
                        <li class="goujian-item" v-for="(item,index) in GouJianItem" :key="index">
                            <p class="clearfix">
                                <i class="icon-goujian icon-detial"></i>
                                <i class="icon-goujian icon-QRcode" @click="viewListQrcode(item)"></i>
                                <i class="icon-goujian icon-location"></i>
                                <i class="icon-goujian icon-delete" @click="deleteList(item)"></i>
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
                                <span class="detial-text-value" :title="item.main.mName" v-text="item.main.mName"></span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="box-right-1" v-show="screenLeft.show" v-else-if="fileCheckedNum == 1">
                <p class="head">
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
                    <li :class="[item.checked?'active-item':'','item-version']" v-for="(item,index) in  versionItem"  @click="selectVersion(index)" :key="index">
                        <div class="clearfix">
                            <img :src="item.imgUuid?QJFileManageSystemURL+'/'+item.imgUuid:require('../../assets/people.png')" class="img" alt="">
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
            <el-dialog title="标签信息预览" :visible.sync="isbiaoqianshow" @close="biaoqianCLose">
                <div class="editBody">
                    <ul style="padding:0 20px">
                        <li class="item-label clearfix">
                            <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(biaoqianInfo.pkId, 7)" alt="二维码">
                            <div class="right">
                                <p class="item-list clearfix">
                                    <span class="text-left">清单ID：</span>
                                    <span class="text-right" v-text="biaoqianInfo.pkId"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">清单名称：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mName"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">生成方式：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mGSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">源自业务：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mBSource_"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建用户：</span>
                                    <span class="text-right" v-text="biaoqianInfo.creator"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">创建时间：</span>
                                    <span class="text-right">{{new Date(biaoqianInfo.createTime).toLocaleString()}}</span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">变更版本：</span>
                                    <span class="text-right" v-text="biaoqianInfo.mVersion"></span>
                                </p>
                                <p class="item-list clearfix">
                                    <span class="text-left">明细数量：</span>
                                    <span class="text-right" v-text="biaoqianInfo.manifestDetailCount"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="labelListConfirm">网页预览</button>
                        <button class="editBtnC" @click="printLabelList">打印当前页标签</button>
                </div>
            </el-dialog>
        </div>
         <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">是否移除清单【{{removelistitem}}】?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
        <form style="visibility:hidden" action="http://bdms.arctron.cn/h2-bim-project/manifest/manifest/qrcodeSingle" ref="manifestQrCodeSingleForm"  method="post" target="_blank">
            <input type="text" name="manifestId" :value="biaoqianInfo.pkId">
            <input type="text" name="mName" :value="biaoqianInfo.mName">
            <input type="text" name="mGSource" :value="biaoqianInfo.mGSource_">
            <input type="text" name="mBSource" :value="biaoqianInfo.mBSource_">
            <input type="text" name="creator" :value="biaoqianInfo.creator">
            <input type="text" name="createTime" :value="new Date(biaoqianInfo.createTime).toLocaleString()">
            <input type="text" name="mVersion" :value="biaoqianInfo.mVersion">
            <input type="text" name="manifestDetailCount" :value="biaoqianInfo.manifestDetailCount">
        </form>
</div>
</template>
<style scoped lang='less'>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #edit .el-dialog__body{
        margin-top:20px;
    }
    .img_left {
      float: left;
      width: 90px;
      height: 90px;
      margin: 40px 30px 0 10px;
    }
    .right {
      float: left;
      width: 400px;
      margin-top: 20px;

      .item-list {
        margin-bottom: 14px;

        .text-left {
          float: left;
          font-size: 12px;
          line-height: 12px;
          width: 80px;
          color: #999;
          text-align: left;
        }

        .text-right {
          float: left;
          width: 300px;
          font-size: 12px;
          line-height: 12px;
          color: #333333;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &:last-of-type {
          margin-bottom: 20px;
        }
      }
    }
    .show{
        display: block!important;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .box-left-container{
        // display: block;
        // position: fixed;
        // overflow-x: hidden;
        // top: 115px;
        // left: 26px;
        // bottom: 0;
        // right: 225px;
        // transition:  all ease .5s;
        // overflow: auto;
        display: inline-block;
        width: 85%;
        position: relative;
        // margin-top:109px;
        // margin-left:24px;
        // z-index: 1001;
        transition:  all ease .5s;
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
        .select-header{
                padding: 15px 10px 0px 20px;
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
                    .item-file-detial{
                        display: block;
                        margin-left:80px; 
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
                            height: 36px;
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
         width: 98%;
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
        //   display: block;
        // position: fixed;
        // right: -225px;
        // bottom: 0;
        // width: 250px;
        // padding-left: 25px;
        // top: 116px;
        // transition: all ease .5s;
        // background: #ffffff;
        // z-index: 10;
        // overflow-y: auto;
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
            .item-property{
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
            .item-version{
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
            .active-version{
                .item-version{
                      background: #fff;
                    color: #fc3439;
                     width: 25px;
                    &::after{
                        background: #fff;
                        // border-right: 1px solid #ffffff;
                    }
                }
                .item-property::after{
                    background: #fff;
                }
            }
            .active{
                .item-property{
                      background: #fff;
                      color: #fc3439;
                }
                .item-property{
                   width: 25px;
                }
            }
        }
    }
    .box-right-avtive{
        width: 2%;
        transition: all ease .5s;
    }
    #box-right{
        padding: 19px 13px 0 10px;
        margin-left:24px;
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
                font-size: 12px;
            }
            .detial-text-value{
                float: left;
                color: #333333;
                max-width: 100px;
                overflow-x: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
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
                width: 45px;
                display: inline-block;
                font-size: 12px;
            }
            .detial-text-value{
                color: #333333;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
                font-size: 12px;
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
        select.inp-search {  
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            // appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  
        }  
        .head{
            padding: 11px 0 12px;
            height: 48px;
            margin-left:20px;
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
            margin:10px 15px 0 30px;
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
    /*删除弹框*/
    .deleteDialogImg{
        height: 50px;
    }
    #inital{
        .el-dialog{
            margin:15vh auto;
        }
    }
    .deleteDialogWarning{
        font-size: 18px;
        line-height: 18px;
        font-family: 'MicrosoftYahei';
        color: #fc3439;
        font-weight: bold;
        margin:20px 0 0 0;
    }
    .deleteDialogText{
        color: #333333;
        font-size: 14px;
        line-height: 14px;
        font-family: 'MicrosoftYahei';
        font-weight: normal;
        margin: 16px 0 0 0;
    }
     /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
    width:7px;
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
</style>
<script>
import axios from 'axios'
import '../Settings/js/jquery-1.4.4.min.js'
import './js/date.js'
export default {
  name:'Costover',
  data(){
      return {
        activeIndex:'1',
         tabShow:1,
         listStyle:'table',//列表展示方式
         fileSearchInfo:'',//查询文件名称
         checkAll: false,
         isIndeterminate: false,
         fileList:[],//文件列表
         isbiaoqianshow:false,
         biaoqianInfo:{},
         screenLeft:{
             show:true,
             item:1,
         },
         pageDetial:{
              pagePerNum:30,//一页几份数据
              currentPage:1,//初始查询页数 第一页
              total:0,//所有数据
          },
         token:'',
         projId:'',
         QJFileManageSystemURL:'',
         BDMSUrl:'',
         checkedItem:{},//选中的file
         GouJianItem:{},//选中file的构件
         versionItem:{},//选中file的版本信息
         show:{
             basicAttributes:false,
             BindingArtifacts:false
         },
         posType:'',//versionType
        fileCheckedNum:0,//选中的文件数量
        WebGlUrl:'',
        deleteDialog:false,
        deleteInfo:{},
        removelistitem:'',
      }
  },
  created(){
      var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        this.WebGlUrl = this.$store.state.GMDUrl;
        vm.getInfo()
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
      posType:function(){
          var vm = this
          vm.getVersion()
      }
  },
  methods:{
       initAll(){
          var vm = this
          if(!vm.checkAll){
                vm.checkAll = true
                if(vm.fileList.length>0){
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',true)
                    })   
                }
              
                vm.show.basicAttributes =true
                vm.show.BindingArtifacts =true
                vm.fileCheckedNum = vm.fileList.length
          }else{
               vm.checkAll = false
                vm.fileList.forEach((item,key)=>{
                    vm.$set(item,'checked',false)
                })
                vm.fileCheckedNum = 0
          }
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
    selectVersion(val){
        var vm = this
         vm.versionItem.forEach((item)=>{
            vm.$set(item,'checked',false)
        })
         vm.$set(vm.versionItem[val],'checked',true)
    },
    splitType(val){
        return val.split('.')[0]
    },
    initData(val){
        if(!val)return ''
        var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
        return tt; 
    },
     addZero(num,size){
        var len = ('' + num).length;
        return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
    },
    labelListConfirm(){


    },
    printLabelList(){


    },
    //删除构件清单
    deleteList(item){
        this.deleteDialog = true;
        this.deleteInfo = item;
        this.removelistitem= item.main.pkId;
    },
    deleteMakeSure(){
        axios({
                method:'post',
                url:this.BDMSUrl+'model2/'+this.projId+'/entityRelation/'+this.deleteInfo.main.pkId+'/'+this.fileList[0].fgId+'/'+this.deleteInfo.main.mVersion+'/delete',
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getGouJianInfo();
                    this.deleteDialog = false;
                }else{  
                    alert(response.data.msg);
                }
            })



    },
    //清单二维码
    viewListQrcode(item){
        axios({
            method:'post',
            url:this.BDMSUrl+'manifest2/getManifestInfoByMId',
            headers:{
                token:this.token
            },
            params:{
                mId:item.main.pkId
            }
        }).then(response=>{
            if(response.data.cd == 0){
                this.isbiaoqianshow = true;
                this.biaoqianInfo = response.data.rt;
                Object.assign(this.biaoqianInfo,{
                    mBSource_:this.parseMBSource(this.biaoqianInfo.mBSource),
                    mGSource_:this.parseMGSource(this.biaoqianInfo.mGSource)
                })
            }else{
                alert(response.data.msg);
            }
        })
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
        parseMGSource(mGSource) {
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
    //绑定清单
    biaoqianCLose(){
        this.isbiaoqianshow=false;
    },
    /**
    * 预览文件集文件
    * @param fileUuid
    */
    view(filePath,fileId,fileName,fgId){
        //latestFile(fileId,fgId,"预览了文件"+fileName);
        console.log(fileName);
        var vm = this
        if(vm.checkedItem && !filePath){
            vm.versionItem.forEach((item)=>{
                if(item.checked){
                    filePath =  item.filePath
                }
            })
        }
        if(!filePath){
            vm.$message({
                type:'info',
                message:'请勾选要预览的文件的版本'
            })
            return false
        }
        if(fileName.split('.')[1] == 'gmd' || fileName.split('.')[1] == 'GMD'){
            window.open(this.WebGlUrl+"/gmdModel/index.html?url="+encodeURIComponent(this.QJFileManageSystemURL+filePath)+'#/showcompany');
        }else{
            window.open(vm.QJFileManageSystemURL+filePath+"/preview");
        }
    },
    downLoad(filePath, fileId, fileName,fgId){
        //latestFile(fileId,fgId,"下载了文件"+fileName);
        var vm = this
         if(vm.checkedItem && !filePath){
            vm.versionItem.forEach((item)=>{
                if(item.checked){
                    filePath =  item.filePath
                }
            })
        }
        if(!filePath){
            vm.$message({
                type:'info',
                message:'请勾选要下载的文件的版本'
            })
            return false
        }
        window.open(vm.QJFileManageSystemURL + filePath);
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
    checkItem(val,isCtrl){
        var vm = this
        vm.show.basicAttributes =true
        vm.show.BindingArtifacts =true
        var fileCheckList = []
        vm.fileCheckedNum = 0
        if(isCtrl){//多选
            vm.fileList[val].checked =  vm.fileList[val].checked?false:true
            for(var i=0;i<vm.fileList.length;i++){
                if(vm.fileList[i].checked){
                    vm.fileCheckedNum++
                    fileCheckList.push(vm.fileList[i])
                }
            }
            vm.checkedItem = {}
            if(vm.fileCheckedNum == 1){
                 vm.checkedItem = fileCheckList[0]
                vm.getGouJianInfo()
                vm.getVersion()
            }else if(vm.fileCheckedNum == vm.fileList.length){
                vm.checkAll = true
            }
            if(vm.fileCheckedNum != vm.fileList.length){
                vm.checkAll = false
            }
        }else{//单选
            vm.checkAll = false
            for(var i=0;i<vm.fileList.length;i++){
                vm.$set(vm.fileList[i],'checked',false)
            }
            vm.fileCheckedNum = 1
            vm.$set(vm.fileList[val],'checked',true)
            vm.checkedItem = vm.fileList[val]
            vm.getGouJianInfo()
            vm.getVersion()
        }
    },
    getVersion(){
         var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/getFileGroupVersionList',
            headers:{
                'token':vm.token
            },
            params:{
                fgId:vm.checkedItem.fgId,
                versionType:vm.posType,
                docType:''//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.versionItem = response.data.rt == null?{}:response.data.rt
                vm.versionItem.forEach((item)=>{
                    vm.$set(item,'checked',false)
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getGouJianInfo(){
        var vm = this
        axios({
            method:'GET',
            url:vm.BDMSUrl+'project2/doc/'+vm.projId+'/entityRelation/list',
            headers:{
                'token':vm.token
            },
            params:{
                relaId:vm.checkedItem.fgId,
                relaType:1//获取是1
            },
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                vm.GouJianItem = response.data.rt.relaList == null?{}:response.data.rt.relaList
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    changePage(val){//分页 0 -1 1 2
        var vm = this 
        if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
            vm.$message('这已经是第一页!')
            return false
        }else if(vm.pageDetial.currentPage == Math.ceil(vm.pageDetial.total%vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
            vm.$message('这已经是最后一页!')
            return false
        }else{
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
                    vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total%vm.pageDetial.pagePerNum)
                    break;
            }
        }

    },
    getInfo(){
        var vm = this
        axios({
            method:'POST',
            url:vm.BDMSUrl+'project2/doc/searchLatestFileGroupInfo',
            headers:{
                'token':vm.token
            },
            data:{
                condition:vm.fileSearchInfo,//文件名称
                dirId:"",//
                pageNo:vm.pageDetial.currentPage,
                docType: "string",//
                pageSize:vm.pageDetial.pagePerNum,
                projId:vm.projId
            }
        }).then((response)=>{
            if(Math.ceil(response.data.cd) == 0){
                if(response.data.rt.rows.length>0){
                    if(vm.fileSearchInfo != ''){
                        vm.fileList = response.data.rt.rows
                    }else{
                        // vm.fileList = vm.fileList.concat(response.data.rt.rows)
                         vm.fileList = response.data.rt.rows
                    }
                    vm.fileList.forEach((item,key)=>{
                        vm.$set(item,'checked',false)//设置了属性的get和set ,可以让vue获取该属性的变化，并渲染vitualdom
                    })
                    vm.pageDetial.currentPage++
                }
            }

        }).catch((err)=>{
            console.log(err)
        })
    },
  }
}
</script>



