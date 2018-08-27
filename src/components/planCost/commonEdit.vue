<template>
    <div id="commonEditBox">
         <div class="project" >
            <p class="antsLine">
                成本管理<i class="icon-sanjiao-right"></i><span  @click="back()">构件量清单</span><i class="icon-sanjiao-right"></i>
                <span class="strong">设计-{{rcName}}</span>
            </p>
            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_1 icon"></i>报表类型
                </span>
            </p>
            <div class="container">
                <p class="clearfix">
                    <span class="item-title">数据库</span>
                    <span class="item-container">
                        <select v-model="database" class="value-box">
                               <option v-for="(item,index) in dataBaseList" :key="index" :value="item.id" v-text="item.name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                </p>
                 <p class="clearfix">
                    <span class="item-title">报表名称</span>
                    <span class="item-container">
                        <input type="text" class="value-box" v-model="rcName" placeholder="请输入报表名称">
                    </span>
                </p>
            </div>
            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_2 icon"></i>查询范围
                </span>
            </p>
            <div class="container container-S">
                <p class="clearfix">
                    <span class="item-title">单体</span>
                    <span class="item-container">
                        <select  class="value-box" v-model="value_monomer" @change="value_monomer_change(false)">
                            <option v-for="(item,index) in options_monomer" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>

                    <span class="item-title">分区</span>
                    <span class="item-container">
                        <select v-model="value_partition" class="value-box" @change="value_partition_change(false)">
                            <option v-for="(item,index) in options_partition" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>

                     <span class="item-title">楼层</span>
                    <span class="item-container">
                        <select  v-model="value_floor" class="value-box">
                            <option v-for="(item,index) in options_floor" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                </p>
                 <p class="clearfix">
                    <span class="item-title">专业</span>
                    <span class="item-container">
                        <select v-model="value_professional" class="value-box" @change="value_professional_change(false)">
                            <option v-for="(item,index) in option_professional" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>

                    <span class="item-title">系统</span>
                    <span class="item-container">
                        <select  v-model="value_system" class="value-box" @change="value_system_change(false)">
                            <option v-for="(item,index) in options_system" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>

                     <span class="item-title">类型</span>
                    <span class="item-container">
                        <select name="" id="" class="value-box" v-model="value_type">
                            <option v-for="(item,index) in options_type" :key="index" :value="item.id" v-text="item.Name"  ></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                </p>
            </div>
            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_3 icon"></i>报表字段
                </span>
            </p>
             <div style="text-align: left;margin-left:110px;" class="clearfix">
                <div class="diolog-main">
                    <p class="clearfix" style="margin-bottom:6px;height:24px;">
                        <span class="title">可用字段</span>
                    </p>
                    <ul class="main-container">
                        <li :class="['userList-item',item.checked?'checked':'']" v-for="(item,key) in data_left" :key="key" @dbclick="addField()" @click="checkField(key)">
                            <span class="check-name" v-text="item.fieldName"></span>
                            <span :class="['icon','icon-selectUser',item.checked?'active':'']"></span>
                        </li>
                    </ul>
                </div>
                <span class="BTN centerBtn" @click="addField()">添加</span>
                <div class="diolog-main">
                    <p class="clearfix"  style="margin-bottom:6px;height:24px;">
                        <span class="title">报表字段</span>
                        <span class="BTN" @click="shiftUp()" style="margin-right:11px;">上移</span>
                        <span class="BTN" @click="shiftDown()">下移</span>
                        <span class="BTN" @click="showPrivateVariables()"  style="margin-left:11px;">字段设置</span>
                    </p>
                    <ul class="main-container ">
                        <li :class="['userList-item',item.checked?'active-check':'']" v-for='(item,index) in data_right' :key="index" @click="checkThisF(index)">
                            <span class="check-title" v-text="item.fieldName" v-if="index != EditIndex"></span>
                            <input type="text" class="value-field" v-model="item.fieldName" v-if="index == EditIndex">
                            <span class="icon icon-editfield" @click="editField(index)"></span>
                            <span class="icon icon-cancleUser" @click="removeField(index)" v-if="!item.isPrivate"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_4 icon"></i>过滤条件
                </span>
            </p>
            <div class="container container-F">
                <p class="clearfix" v-for="(item) in list_filter" :key="item.key" v-show="item.show">
                    <span class="item-container">
                        <select name="" v-model="item.build_name" class="value-box" @change="adjustCondition(item.key,item.build_name)">
                            <option value="nofield">【不使用】</option>
                            <option :value="val.fieldCode" v-text="val.fieldName" v-for="(val,index) in  data_right" :key="index"></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                    <span class="item-container">
                        <select class="value-box" v-model="item.filtertype" name="report-filter-field-filter-type">
                            <option value="CONTAINS" v-if="item.type == 'STRING'">包含</option>
                            <option value="NOTCONTAINS" v-if="item.type == 'STRING'">不包含</option>
                            <option value="EQUALS">等于</option>
                            <option value="NOTEQUALS"  v-if="item.type == 'STRING' || item.type == 'NUMBER'">不等于</option>
                            <option value="SMALL"  v-if="item.type == 'NUMBER'">小于</option>
                            <option value="SMALL_OR_EQUALS" v-if="item.type == 'NUMBER'">小于等于</option>
                             <option value="GREAT" v-if="item.type == 'NUMBER'">大于</option>
                            <option value="GREAT_OR_EQUALS" v-if="item.type == 'NUMBER'">大于等于</option>
                            <option value="STARTIS" v-if="item.type == 'STRING'">开始是</option>
                            <option value="ENDIS" v-if="item.type == 'STRING'">结束是</option>
                            <option value="TIME_EARLY_THAN" v-if="item.type == 'DATE'">早于</option>
                            <option value="TIME_LATER_THAN" v-if="item.type == 'DATE'">晚于</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                    <span class="item-container">
                        <input type="text" class="value-box" v-model="item.filtercontent" placeholder="请输入">
                    </span>
                    <span class="item-container" v-if="!item.disabled">
                        <select name="" v-model="item.val"  class="value-box" @change="changeFL(item.key,5)">
                            <option value="0">无</option>
                            <option value="1">并且</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                </p>
            </div>

            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_5 icon"></i>排序和分组
                </span>
            </p>
            <div class="container container-F">
                <p style="text-align: left;color: #999999;font-size: 14px;display:none">
                    分组行位置
                    <el-radio v-model="titlePosition" label="0">表头</el-radio>
                    <el-radio v-model="titlePosition" label="1">表尾</el-radio>
                </p>
                <p class="clearfix" v-for="(item) in list_order" :key="item.key" v-show="item.show">
                    <span class="item-container">
                        <select name="" id="" class="value-box" v-model="item.build_name">
                            <option value="nofield">【不使用】</option>
                            <option :value="val.fieldCode" v-text="val.fieldName" v-for="(val,index) in  data_right" :key="index"></option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                    <span class="item-container">
                        <select class="value-box" name="report-filter-field-filter-type" v-model="item.ordertype">
                            <option value="ACENding">升序排列 </option>
                            <option value="DESCENDING">降序排列</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                    <span class="item-container">
                        <select class="value-box" name="report-filter-field-filter-type" v-model="item.grouptype">
                            <option value="NONE_GROUP">只排序、不分组</option>
                            <option value="TITLE_GROUPVALUE_QUANTITY">分组显示标题、取值和数量</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                    <span class="item-container" v-if="item.key < 2">
                        <select name="" v-model="item.val"  class="value-box" @change="changeFL(item.key,3)">
                            <option value="0">无</option>
                            <option value="1">其次按</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </span>
                </p>
                 <p class="clearfix">
                   <label   :class="[displayType?'active':'','checkbox-fileItem']" for="displayType"></label>
                   <input   type="checkbox" id='displayType' class="hideInput"  v-model="displayType">
                    <label   :class="[displayTotal?'active':'','checkbox-fileItem','right-checkbox']" for="displayTotal"></label>
                   <input   type="checkbox" id='displayTotal' class="hideInput"  v-model="displayTotal">
                </p>
            </div>
            <p class="header clearfix">
                <span class="left_header">
                    <i class="icon_6 icon"></i>外观设置
                </span>
                <a :class="['right_header','right-expend',topExpend.isExpend?'':'right-pack-up']" href="javascript:void(0)"  @click="changeTopExpend()" v-text="topExpend.title"></a>
            </p>
            <div v-if="topExpend.isExpend" class="container container-F">
                <div class="box-style">
                    <p class="title">
                        标题样式
                    </p>
                    <p class="clearfix" style="margin-bottom:0;">
                        <span class="item-title">标题名称</span>
                        <span class="item-container">
                            <input type="text" class="value-box" v-model="titleName" placeholder="请输入标题名称">
                        </span>
                        <br>
                    </p>
                    <p style="text-align:left;margin-bottom:20px;padding-left:105px;">
                        <el-checkbox v-model="titleUseReportName" >使用表名</el-checkbox>
                        <el-checkbox v-model="styleShowTitle">显示标题</el-checkbox>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">字体大小</span>
                        <span class="item-container">
                            <select name="" id="" v-model="titleFontSize" class="value-box">
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                                <option value="20">20</option>
                                <option value="22">22</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">对齐方式</span>
                        <span class="item-container">
                            <select v-model="titleAlign" id="" class="value-box">
                                <option value="center">居中</option>
                                <option value="left">左对齐</option>
                                <option value="right">右对齐</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">标题行高</span>
                        <span class="item-container">
                            <select v-model="titleLineHeight" id="" class="value-box">
                                <option value="32">32</option>
                                <option value="34">34</option>
                                <option value="36">36</option>
                                <option value="38">38</option>
                                <option value="40">40</option>
                                <option value="42">42</option>
                                <option value="44">44</option>
                                <option value="46">46</option>
                                <option value="48">48</option>
                                <option value="50">50</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">背景颜色</span>
                        <el-color-picker
                            v-model="titleBgColor"
                            show-alpha
                            :predefine="predefineColors_1">
                        </el-color-picker>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">外边框</span>
                        <label   :class="[titleUseBorder?'active':'','checkbox-fileItem','border-checkbox']" for="titleUseBorder"></label>
                        <input   type="checkbox" id='titleUseBorder' class="hideInput"  v-model="titleUseBorder">
                    </p>
                </div>
                <div class="box-style">
                    <p class="title">
                        表格样式
                    </p>
                     <p class="clearfix">
                        <span class="item-title">表格宽度</span>
                        <span class="item-container" style="width:120px;">
                            <select name="" id="" v-model="tableWidth" class="value-box">
                                <option value="100%">自适应</option>
                                <option value="fixed">固定大小</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                         <span class="item-container" style="width:110px;" v-if="tableWidth == 'fixed'">
                            <input type="number" class="value-box" v-model="tableWidthVal" placeholder="请输入">
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">字体大小</span>
                        <span class="item-container">
                            <select name="" id="" v-model="tableFontsize" class="value-box">
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">表格行高</span>
                        <span class="item-container">
                            <select name="" v-model="tableLineHeight" class="value-box">
                                <option value="32">32</option>
                                <option value="34">34</option>
                                <option value="36">36</option>
                                <option value="38">38</option>
                                <option value="40">40</option>
                                <option value="42">42</option>
                                <option value="44">44</option>
                                <option value="46">46</option>
                                <option value="48">48</option>
                                <option value="50">50</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">文字对齐</span>
                        <span class="item-container">
                            <select v-model="tableAlign" id="" class="value-box">
                                <option selected="selected" value="center">居中</option>
                                <option value="left">左对齐</option>
                                <option value="right">右对齐</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                     <p class="clearfix">
                        <span class="item-title">显示网格</span>
                        <span class="item-container">
                            <select name="" v-model="showTableNet" class="value-box">
                                <option selected="selected" value="0">不显示</option>
                                <option selected="selected" value="1">显示</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </span>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">列名行背景色</span>
                        <el-color-picker
                            v-model="tableTitleBgColor"
                            show-alpha
                            :predefine="predefineColors_1">
                        </el-color-picker>
                    </p>
                    <p class="clearfix">
                        <span class="item-title">分组框背景色</span>
                        <el-color-picker
                            v-model="tableGroupBgColor"
                            show-alpha
                            :predefine="predefineColors_1">
                        </el-color-picker>
                    </p>
                </div>
            </div>
            <p>
                <span class="saveBtn" @click="saveForm()">保存</span>
                <span class="cancelBtn"  @click="saveForm(true)">数据</span>
            </p>
         </div>
        <div v-if="privateVariables.show"  id="edit" class="dialog">
                <div class="el-dialog__header">
                <span class="el-dialog__title">私有属性字段</span>
                <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="basicCancle">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <div class="clearfix" >
                    <span class="item-attibuteAuth" v-for="(item,index) in privateVariables.new" :key="index">
                        <label  :class="[item.checked?'active':'','checkbox-fileItem holderType_Attribute']" :for="item.code+'_Attribute'" v-text="item.name"></label>
                        <input  type="checkbox" :id="item.code+'_Attribute'" class="checkbox-arr" v-model="item.checked">
                    </span>
                </div>
            </div>
            <div class="el-dialog__footer">
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="basicConfirm">确定</button>
                    <button class="editBtnC" @click="basicCancle">取消</button>
                </div>
            </div>
        </div>
         <div id="mask" v-if="privateVariables.show"  @click="basicCancle"></div>
    </div>
</template>
<style lang="less">
   #commonEditBox{
       margin: 0 20px 20px!important;
       .hideInput{
           display: none;
       }
       .clearfix{
           overflow: hidden;
           clear: both;
           content: '';
       }
       *{
           margin: 0;
           padding: 0;
           box-sizing: border-box;
       }
        select{  
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            //appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  
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
                    .icon_1{
                    background: url('./images/add_1.png')no-repeat 0 0;
                    } 
                    .icon_2{
                    background: url('./images/add_2.png')no-repeat 0 0;
                    } 
                    .icon_3{
                    background: url('./images/add_3.png')no-repeat 0 0;
                    } 
                    .icon_4{
                    background: url('./images/add_4.png')no-repeat 0 0;
                    } 
                    .icon_5{
                    background: url('./images/add_5.png')no-repeat 0 0;
                    } 
                    .icon_6{
                        background: url('./images/add_6.png')no-repeat 0 0;
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
            .container{
                margin-top: 10px;
                margin-left:60px; 
                >p,.box-style{
                    margin-bottom: 20px;
                    .item-title{
                        font-size: 14px;
                        color: #999999;
                        float: left;
                        width: 70px;
                        height: 40px;
                        line-height: 40px;
                        margin-left: 30px;
                        text-align: left;
                    }
                    .item-container{
                        float: left;
                        width: 240px;
                        height: 40px;
                        position: relative;
                        .value-box{
                            display: block;
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                            border: 1px solid #dbdbdb;
                            padding-left: 12px;
                            color: #333333;
                        }
                        // input .value-box{
                           
                        // }
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
                   .checkbox-fileItem{
                        float: left;
                        width: 14px;
                        height: 14px;
                        border: 1px solid #cccccc;
                        cursor: pointer;
                        margin-right: 5px;
                        position: relative;
                        &::after{
                            font-size:14px;
                            color:#999999;
                            display: block;
                            position: absolute;
                            right: -135px;
                            top: 0;
                            line-height:14px;
                            content: '数据相同时合并多行';
                        }
                    }
                    .right-checkbox{
                        margin-left: 160px;
                         &::after{
                             right: -65px;
                             content: '显示总计';
                         }
                    }
                    .border-checkbox{
                         margin-left: 0px;
                         margin-top: 12px;
                         &::after{
                             right: -80px;
                             content: '使用外边框';
                         }
                    }
                    .active{
                        background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                            border: 1px solid #fc3439;
                        &::after{
                            color:#333;
                        }
                    }
                }
            }
            .container-S{
                .item-title{
                    padding-right: 20px;
                    text-align: right!important;
                }   
            }
            .container-F{
                margin-left: 110px;
                margin-bottom: 50px;
                .item-container{
                    margin-right: 10px;
                }
            }
            .box-style{
                border-bottom: 1px solid #f5f5f5;
                .item-title{
                    margin-left: 0!important;
                    width: 105px!important;
                }
                .title{
                    text-align: left;
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                    font-weight: bold;
                    margin: 20px 0px;
                }
                >p.clearfix{
                    margin-bottom: 20px;
                    text-align: left;
                }
            }
            .saveBtn{
                display: inline-block;
               line-height: 36px;
                background: #fc3439;
                margin-right: 20px;
                color: #fff;
                font-size: 14px;
                font-weight: normal;
                width: 111px;
                height: 36px;
                border: none;
                padding: 0;
                cursor: pointer;
                border-radius: 2px;
                    &:hover {
                        background: #ff5257;
                    }
            }
            .cancelBtn{
                display: inline-block;
                font-size: 14px;
               line-height: 36px;
                color: #666;
                background: #fff;
                border: 1px solid #ccc;
                width: 111px;
                height: 36px;
                padding: 0;
                cursor: pointer;
                border-radius: 2px;
            }
            .diolog-main{
                float: left;
                width: 240px;
                height: auto;
                .title{
                    font-size: 12px;
                    color: #999999;
                    float: left;
                    height: 24px;
                    line-height: 24px;
                    margin-right: 20px;
                }
                .main-container{
                    height:290px;
                    border: 1px solid #ebebeb;
                    overflow-y: auto;
                }
                .title-right{
                    display: block;
                    margin: 10px 10px 0 0;
                    height: 28px;
                    position: relative;
                    .title-right-icon{
                        display: block;
                        width: 100%;
                        height: 100%;
                        border-radius: 2px;
                        border: 1px solid #e6e6e6;
                        position: relative;
                        background: #fafafa;
                        padding-left:10px;
                        padding-right:40px;
                        margin-right: 5px;
                    }
                    .el-icon-search{
                            position: absolute;
                            right: 10px;
                            top: 8px;
                            cursor: pointer;
                    }
                }
                .checked{
                    background: #f5f5f5;
                }
                .userList-item{
                    position: relative;
                    height: 36px;
                    line-height: 36px;
                    padding-left: 10px;
                    cursor: pointer;
                    .check-name{
                        display: inline-block;
                        font-size: 14px;
                        line-height: 14px;
                        color: #333333;
                    }
                    .check-title{
                        display: inline-block;
                        font-size: 12px;
                        line-height: 14px;
                        color: #999999;
                    }
                    .icon-selectUser{
                        display: block;
                        position: absolute;
                        top: 11px;
                        right: 20px;
                        width: 14px;
                        height: 14px;
                        background-image:url('../Settings/images/a-1.png'); 
                    }
                    .icon-cancleUser{
                        display: block;
                        position: absolute;
                       top: 11px;
                        right: 20px;
                        width: 14px;
                        height: 14px;
                        background-image:url('../Settings/images/b-1.png'); 
                        &:hover{
                            background-image:url('../Settings/images/b-2.png'); 
                        } 
                    }
                    .value-field{
                        width: 160px;
                        height: 100%;
                        border: none;
                        background: transparent;
                        &:focus{
                            outline:none;
                        }
                    }
                    .icon-editfield{
                        display: block;
                        position: absolute;
                        top: 11px;
                        right: 54px;
                        width: 14px;
                        height: 14px;
                        background-image:url('../ManageCost/images/edit.png'); 
                        background-size: 100% 100%;
                        &:hover{
                            background-image:url('../ManageCost/images/edit1.png'); 
                        }
                    }
                    &:hover{
                         .icon-selectUser{
                            background-image:url('../Settings/images/a-2.png'); 
                        }
                       background: #f5f5f5;
                    } 
                    .icon-selectUser.active{
                        background-image:url('../Settings/images/a-2.png'); 
                    }
                }
                .active-check{
                        background: #f5f5f5;
                    .icon-cancleUser{
                        background-image:url('../Settings/images/b-2.png'); 
                    }
                        .icon-editfield{
                        background-image:url('../ManageCost/images/edit1.png'); 
                    }
                }
                /***********设置滚动条************/
                /* 设置滚动条的样式 */
                ::-webkit-scrollbar {
                    width:6px;
                }
                /* 滚动槽 */
                ::-webkit-scrollbar-track {
                    box-shadow: inset006pxrgba(0,0,0,0.5);
                    -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
                    border-radius:3px;
                }
                /* 滚动条滑块 */
                ::-webkit-scrollbar-thumb {
                    border-radius:3px;
                    background:rgba(0,0,0,0.1);
                    box-shadow: inset006pxrgba(0,0,0,0.5);
                    -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
                }
                ::-webkit-scrollbar-thumb:window-inactive {
                    background:#dfdfdf;
                }
            }
            .BTN{
                float: left;
                cursor: pointer;
                width: 50px;
                text-align: center;
                height: 24px;
                line-height: 22px;
                border:1px solid #d9d9d9;
                border-radius: 2px;
                color: #999999;
                font-size: 12px;
            }
            .centerBtn{
                margin: 100px 20px 0;
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
            .item-label{
                border-bottom: 1px solid #ebebeb;
                .img_left{
                    float: left;
                    width: 90px;
                    height: 90px;
                    margin:40px 30px 0 10px;
                }
                .right{
                    float: left;
                    width: 450px;
                    .item-list{
                        margin-bottom: 14px;
                        .text-left{
                            float: left;
                            font-size: 12px;
                            line-height: 12px;
                            width: 80px;
                            color: #999;
                            text-align: left;
                        }
                        .text-right{
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
                        &:last-of-type{
                             margin-bottom: 20px; 
                        }
                    }
                }
                &:last-of-type{
                    border-bottom: none;
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
   }
    .navigation{
        z-index: 0!important;
    }
</style>
<script>
import Vue from 'vue'
import axios from 'axios'
import {dataLeft} from './js/defaultData.js'
import '../ManageCost/js/jquery-1.8.3.js'
import data from '../Settings/js/date.js';
export default Vue.component('common-edit',{
    props:['rcId'],
    data(){
        const filter = (length)=>{
            const data = [];
            for (let i = 0; i < length; i++) {
                data.push({
                    key: i,
                    val:0,
                    build_name:'nofield',
                    ordertype:'ACENding',
                    grouptype:'NONE_GROUP',
                    filtertype:'',
                    filtercontent:'',
                    type:'',
                    show:i == 0?true:false,
                    disabled: i >= 4?true:false
                });
            }
            return data;
        }
        return {
            data_left:dataLeft,
            data_right:[],
            value3:[],
            token:'',
            entId:'',//公司ID
            projId:'',
            projName:'',
            userId:'',
            UPID:'',
            defaultSubProjId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            topExpend:{
                title:'收起',
                isExpend:true
            },
            EditIndex:-1,
            /*以下为后期添加数据*/
            rcName:'',
            // rcId:0,
            list_filter:filter(5),//过滤字段的列表
            list_order:filter(3),//过滤字段的列表

            titlePosition:'0',
            displayType:false,
            displayTotal:false,
            titleBgColor:'rgba(255,69,0,0.7)',
            tableTitleBgColor:'rgba(255,69,0,0.7)',
            tableGroupBgColor:'rgba(255,69,0,0.7)',
            predefineColors_1:[
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255,69,0,0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
            ],
            titleName:'',
            titleUseReportName:false,
            styleShowTitle:false,
            tableWidth:'100%',
            tableWidthVal:'',
            titleFontSize:12,
            titleAlign:'center',
            titleUseBorder:false,
            titleLineHeight:32,
            tableFontsize:12,
            tableLineHeight:32,
            tableAlign:'center',
            database:'ALL',
            showTableNet:0,
            dataBaseList:[
                {
                    name:'城市数据库',
                    id:'CITY'
                },{
                    name:'建筑数据库',
                    id:'BUILDING'
                },{
                    name:'全部',
                    id:'ALL'
                }
            ],//数据库
            options_monomer:[],//单体选项
            options_partition:[
                {
                    id:'NONE',
                    Name:'无'
                },
                ],//分区选项
                options_floor:[
                {
                    id:'NONE',
                    Name:'无'
                },
            ],//楼层选项
             option_professional:[],
            options_system:[
                {
                    id:'NONE',
                    Name:'无'
                },
                {
                    id:'-1',
                    Name:'全部'
                },
            ],//系统选项
            options_type:[
                {
                id:'NONE',
                Name:'无'
                },
                {
                    id:'-1',
                    Name:'全部'
                },
            ],//楼层选项
            value_monomer: '',//单体 筛选关键词
            value_partition: 'NONE',//分区 筛选关键词
            value_floor: 'NONE',//单体 筛选关键词
            value_professional:'-1',//专业 筛选关键字
            value_system:'-1',//系统 筛选关键字
            value_type:'-1',//类型 筛选关键字
            privateVariables:{
                show:false,
                new:[],
                old:[],
            },
            pageDetialTtotal:'',
            goujianList:[],
            flag:false,
        }
    },
    watch:{
        
    },
    created(){
        var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        vm.projName = localStorage.getItem('projName')
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.UPID = vm.$store.state.UPID
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        
        this.data_right = [];
        console.log(this.data_right);
        if(vm.rcId && vm.rcId != 0){
            vm.getReportData()
            vm.getIntoDesignPage(true)
        }else{
            vm.getIntoDesignPage(false)
            vm.addField()
        }
        vm.getPV();
    },
    methods:{
        adjustCondition(key,name){
            var vm = this
            if(name == 'nofield'){
                vm.list_filter[key].type = ''
                return false
            }
            for(let i=0;i<vm.data_right.length;i++){
                if(vm.data_right[i].fieldCode == name){
                    vm.list_filter[key].type = vm.data_right[i].fieldType
                    break
                }
            }
        },
        value_monomer_change(inheirt){
            var vm = this 
            if(vm.value_monomer == 0) {
                vm.options_partition = [
                    {
                        id:'NONE',
                        Name:'无'
                    }]
                vm.options_floor = [
                    {
                        id:'NONE',
                        Name:'无'
                    }
                ]
            }else {
                vm.getPartitionBySubProjId(inheirt) //加载分区
            }
        },
        value_partition_change(inheirt){
                var vm = this 
                vm.findStorey(inheirt)
        },
        value_professional_change(inheirt){
                var vm = this 
                vm.getGenieClass(2,inheirt)
        },
        value_system_change(inheirt){
                var vm = this 
                vm.getGenieClass(3,inheirt)
        },
        basicConfirm(){
            var vm = this
            var arr = []
            // fieldCode: "level_.part_name",
            // fieldName: "分区",
            // fieldType: "STRING",
            // checked:false,
            // tableType: 8
            vm.data_right.forEach((item,key)=>{
                if(!item.isPrivate){
                    arr.push(item)
                }
            })
            vm.data_right = arr
            vm.privateVariables.new.forEach(item=>{
                if(item.checked){
                    vm.data_right.push({
                        fieldCode: item.code,
                        fieldName: item.name,
                        fieldType: item.type,
                        checked:false,
                        isPrivate:false,
                        tableType: -1
                    })
                }
            })
            let {new:obj} = vm.privateVariables
            vm.privateVariables.old = obj
            vm.privateVariables.show = false
        },
        basicCancle(){
            var vm = this
            vm.privateVariables.show = false
            let {old} = vm.privateVariables
            vm.privateVariables.new = old
        },
        showPrivateVariables(){
            var  vm = this
            vm.privateVariables.show = true
        },
        getPV(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getAdditionalField',
                headers:{
                    token:vm.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.privateVariables.old = response.data.rt!=null?response.data.rt:[]
                    vm.privateVariables.old.forEach(item=>{
                        vm.$set(item,'checked',false)
                    })
                    let {old} = vm.privateVariables
                    vm.privateVariables.new = old
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
         getGenieClass(level,inheirt){//获取系统数据
            var vm = this
            var pCode = ''
            var parentClassifyCode='';
            var gcCode = vm.value_professional
            var gcCode1 = vm.value_system
            var gcCode2 = vm.value_type
            if(level==2){
                parentClassifyCode= vm.value_professional
                if(!inheirt)vm.value_system = 'NONE';
                if(!inheirt)vm.value_type = 'NONE';
                vm.options_type = [
                    {
                        id:'NONE',
                        Name:'无'
                    },
                ]
                vm.options_system = [
                    {
                        id:'NONE',
                        Name:'无'
                    },
                    {
                        id:'-1',
                        Name:'全部'
                    }
                ]
            }else if(level==3){
                parentClassifyCode = vm.value_system
                if(!inheirt)vm.value_type = 'NONE';
                if(parentClassifyCode==0){
                    vm.options_type = [
                        {
                            id:'NONE',
                            Name:'无'
                        },
                    ]
                }else{
                    if(!inheirt)vm.value_type = 'NONE';
                    vm.options_type = [
                        {
                            id:'NONE',
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
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
        findStorey(inheirt){
            var vm = this
            if(vm.value_partition==-1){
                vm.options_floor = [
                    {
                        id:'NONE',
                        Name:'无'
                    },
                    {
                        id:'-1',
                        Name:'全部'
                    }
                ]
                if(!inheirt)vm.value_floor = 'NONE';
                return false
            }
            if(vm.value_partition==0){
                vm.options_floor = [
                    {
                        id:'NONE',
                        Name:'无'
                    },
                ]
                if(!inheirt)vm.value_floor = 'NONE';
                return false
            }
            var url = vm.BDMSUrl+'project2/dc/findStorey/'+vm.value_partition
            axios({
                method:'GET',
                url:url,
                headers:{
                    'token':vm.token
                },
            }).then((response)=>{
                if(response.data.cd == 0){
                     vm.options_floor = [
                        {
                            id:'NONE',
                            Name:'无'
                        },
                        {
                            id:'-1',
                            Name:'全部'
                        }
                    ]
                    if(!inheirt)vm.value_floor = 'NONE'
                    if(response.data.rt.rows != null && response.data.rt.rows.length > 0){
                        response.data.rt.rows.forEach((item,key)=>{
                            vm.options_floor.push({
                                    id:item.ID,
                                    Name:item.Name
                            })//分区列表
                        })
                    }else{
                        vm.options_floor = [
                            {
                                id:'NONE',
                                Name:'无'
                        }]
                        if(!inheirt)vm.value_floor = 'NONE'
                    }
                }
            }).catch((err)=>{
                console.log(err)
            })
      },
        getDataBase(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getDatabase',
                headers:{
                    token:vm.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.dataBaseList = response.data.rt!=null?response.data.rt:[]
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
        getPartitionBySubProjId(inheirt){//加载分区数据
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
                                id:'NONE',
                                Name:'无'
                            },
                            {
                                id:'-1',
                                Name:'全部'
                            }
                        ]
                        if(!inheirt){
                             vm.options_floor = [
                                {
                                    id:'NONE',
                                    Name:'无'
                                }
                            ]
                            vm.value_floor = 'NONE'
                            vm.value_partition = 'NONE'
                        }
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
         getIntoDesignPage(isEdit){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/report/getBuild',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    $.extend(vm.options_monomer,response.data.rt)//单体列表
                    vm.options_monomer.unshift({
                        id:'OVERALL_FIELD',
                        Name:'总体场地'
                    },{
                        id:'ALL',
                        Name:'全部单体'
                    },)
                    if(!isEdit)vm.value_monomer = 'ALL'
                }
            }).then(
                axios({
                    method:'POST',
                    url:vm.BDMSUrl+'project2/report/getProfession',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projectId:vm.projId,
                        companyId:vm.entId
                    }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.option_professional = [{
                            id:'-1',
                            Name:'全部',
                        }]
                        if(response.data.rt != null){
                            response.data.rt.forEach((element,index)=>{
                                vm.option_professional.push({
                                    id:element.code,
                                    Name:element.title,
                                })
                            })
                        }
                    }

                }).catch((err)=>{
                    console.log(err)
                })
            )
        },
        getReportData(){
            var vm = this;
            // rc: rc,
            // fieldList: fieldList,
            // fieldFilterList: fieldFilterList,
            // fieldGroupList: fieldGroupList,
            // rcStyle: rcStyle,
           
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/rc/'+vm.rcId,
                headers:{
                    token:vm.token
                },
            }).then(response=>{
                 if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.rcName = response.data.rt.rcName//报表名称
                        vm.value_type = response.data.rt.rcTableName//表名 筛选 - 类型
                        vm.initFiled(false) 
                        vm.displayType = response.data.rt.displayType == 0?true:false//数据相同时合并多行
                        vm.displayTotal = response.data.rt.displayTotal == 1?true:false//显示总计
                        vm.titlePosition = response.data.rt.groupPosition+''//报表名称

                        vm.data_right = []
                        if(response.data.rt.fieldList != null && response.data.rt.fieldList.length>0){
                            response.data.rt.fieldList.forEach(ele=>{
                                for(var i=0;i<vm.data_left.length;i++){
                                    if(ele.fieldCode == vm.data_left[i].fieldCode){
                                        vm.$set(vm.data_left[i],'checked',true)
                                        vm.data_left[i].fieldName = ele.fieldAlias
                                        break
                                    }
                                }
                                for(var i=0;i<vm.privateVariables.new.length;i++){
                                    if(ele.fieldCode == vm.privateVariables.new[i].code){
                                        vm.$set(vm.privateVariables.new[i],'checked',true)
                                        break
                                    }
                                }
                            })
                            vm.addField()
                            vm.basicConfirm()
                        }
                       
                        var length = response.data.rt.filterList.length
                        if(length>0){
                            response.data.rt.filterList.forEach((element,index)=>{
                                if(element.fieldCode == 'range.db' || element.fieldCode == 'range.build' || element.fieldCode == 'range.profession'){
                                     switch(element.fieldCode){
                                         case 'range.db':
                                                vm.database = element.fieldSearchContent
                                            break;
                                        case 'range.build':

                                                vm.value_monomer = element.fieldSearchContent.split('&&')[0]
                                                vm.value_partition = element.fieldSearchContent.split('&&')[1]
                                                vm.value_floor = element.fieldSearchContent.split('&&')[2]
                                                vm.value_monomer_change(true)
                                                vm.value_partition_change(true)
                                            break;
                                        // case 'range.partition':
                                        //         vm.value_partition = element.fieldSearchContent
                                        //         vm.value_partition_change(true)
                                        //     break;
                                        // case 'range.storey':
                                        //         vm.value_floor = element.fieldSearchContent
                                        //     break;
                                        case 'range.profession':
                                        /**
                                            更改时间：2018-8-16
                                            因为默认为 000000；
                                            因此无何全部字段无法区分，默认为全部 -1
                                        **/
                                                vm.value_professional = element.fieldSearchContent.substr(0,2) == '00'?'-1':element.fieldSearchContent.substr(0,2)+'0000'
                                                vm.value_system = element.fieldSearchContent.substr(2,2) == '00'?'-1':element.fieldSearchContent.substr(0,4)+'00'
                                                vm.value_type = element.fieldSearchContent.substr(4,2) == '00'?'-1':element.fieldSearchContent
                                                vm.value_professional_change(true)
                                                vm.value_system_change(true)
                                            break;
                                        // case 'range.system':
                                        //         vm.value_system = element.fieldSearchContent
                                        //         vm.value_system_change(true)
                                        //     break;
                                        // case 'range.type':
                                        //         vm.value_type = element.fieldSearchContent
                                        //     break;
                                     }
                                }else{
                                    vm.list_filter[index].build_name = element.fieldCode
                                    vm.list_filter[index].val = 1

                                    vm.list_filter[index].filtercontent = element.fieldSearchContent
                                    vm.list_filter[index].filtertype = element.fieldSearchType
                                    vm.list_filter[index].show = true
                                }
                            })
                            vm.list_filter[vm.list_filter.length-1].val = 0
                        }
                        if(response.data.rt.groupList != null && response.data.rt.groupList.length>0){
                            response.data.rt.groupList.forEach((element,index)=>{
                                vm.list_order[index].build_name = element.fieldCode
                                vm.list_order[index].val = 1

                                vm.list_order[index].ordertype = element.fieldOrderType
                                vm.list_order[index].grouptype = element.fieldGroupType
                                vm.list_order[index].show = true
                            })
                            var length_list_order = response.data.rt.groupList.length
                            vm.list_order[length_list_order-1].val = 0
                        }
                        vm.styleShowTitle = response.data.rt.rcStyle.showTitle == 1?true:false
                        vm.titleName = response.data.rt.rcStyle.titleName
                        vm.titleUseReportName = response.data.rt.rcStyle.titleUseReportName == 1?true:false
                        vm.titleFontSize = parseInt(response.data.rt.rcStyle.titleFontSize)
                        vm.titleAlign = response.data.rt.rcStyle.titleAlign
                        vm.titleUseBorder = response.data.rt.rcStyle.titleUseBorder == 1?true:false

                        vm.titleLineHeight = parseInt(response.data.rt.rcStyle.titleBorderHeight)
                        vm.titleBgColor = response.data.rt.rcStyle.titleBgColor
                        vm.tableFontsize = parseInt(response.data.rt.rcStyle.tableFontSize)
                        vm.tableLineHeight = parseInt(response.data.rt.rcStyle.tableRowHeight)
                        if(response.data.rt.rcStyle.tableWidth == '100%'){
                            vm.tableWidth = response.data.rt.rcStyle.tableWidth
                        }else{
                             vm.tableWidth = 'fixed'
                            vm.tableWidthVal = response.data.rt.rcStyle.tableWidth
                        }
                        
                        vm.tableAlign = response.data.rt.rcStyle.tableAlign
                        vm.showTableNet = response.data.rt.rcStyle.tableBorderWidth
                        vm.tableTitleBgColor = response.data.rt.rcStyle.tableTitleBgColor
                        vm.tableGroupBgColor = response.data.rt.rcStyle.tableGroupBgColor
                    }
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
        realSaveForm(needCount){
            var vm = this
            if(vm.database == ''){
                vm.$message({
                    type:'warning',
                    message:'数据库不能为空!'
                })
                return false
            }
            var rcId = vm.rcId
            vm.fullscreenLoading =true

            needCount = needCount || false
            /***先获取rc 中的值***/
            const rcName = $.trim(vm.rcName)
            if (rcName == undefined || rcName == '') {
                vm.$message({
                    type:'warning',
                    message:'报表名称不能为空!'
                })
                return
            }
            let rtName = '';
            this.options_type.forEach(item=>{
                if(item.id == vm.value_type){
                    rtName = item.Name;
                }
            })
            var rc = {
                reportName: rcName,
                reportTableName: rtName,   //筛选 - 类型 表名
                displayType: vm.displayType?0:1,   //数据相同时合并多行
                displayTotal: vm.displayTotal?1:0,	//显示总计
                projId: vm.projId,
                groupPosition: vm.titlePosition   //分组行位置
            }
            /****报表字段***/
            var fieldList = new Array();
            vm.data_right.forEach(ele=>{
                fieldList.push({
                    fieldCode: ele.fieldCode,
                    fieldAlias: ele.fieldName,
                    fieldType: ele.fieldType, 
                    tableType: ele.tableType
                })
            })
            if (fieldList.length == 0) {
                vm.$message({
                    type:'warning',
                    message:'报表使用字段不能为空!'
                })
                return
            }

            /******过滤条件*****/
            var fieldFilterList = new Array()
            var fieldType_STRING = "STRING"
            var fieldType_DATETIME = "DATETIME"
            var fieldType_NUMBER = "NUMBER"
            var fieldType_BOOLEAN = "BOOLEAN"
            var error = ''
            // 过滤条件
            /**
             *   val:0,
                    build_name:'nofield',
                    filtertype:'',
                    filtercontent:'',
            **/
            vm.list_filter.forEach((ele,index)=>{
                if (ele.build_name == 'nofield') return
                var fieldName = ''
                var fieldType = ''
                var tableType = ''
                vm.data_right.forEach(res=>{
                    if(res.fieldCode == ele.build_name){
                        fieldName = res.fieldName
                        fieldType = res.fieldType
                        tableType = res.tableType
                    }
                })
                var content = ele.filtercontent
                if (fieldType == fieldType_DATETIME) {
                    content = ele.filtercontent //$(this).find('input[class=combo-value][name=report-filter-filter-content]').val();
                }
                if (content == undefined || content == '') {
                    error += '【' + fieldName + '】字段过滤条件不能为空'
                    return;
                }
                if (fieldType == fieldType_DATETIME && vm.isDate(content)) {
                    error += '【' + fieldName + '】字段过滤条件格式错误，正确格式为：2014-08-08'
                    return;
                }
                if (fieldType == fieldType_NUMBER && vm.isNumber(content)) {
                    error += '【' + fieldName + '】字段过滤条件格式错误，正确格式为：88或88.88'
                    return;
                }
                if (fieldType == fieldType_BOOLEAN && vm.isBoolean(content)) {
                    error += '【' + fieldName + '】字段过滤条件格式错误，正确格式为：TRUE或FALSE'
                    return;
                }
                fieldFilterList.push({
                    fieldCode: ele.build_name, 
                    fieldSearchType: ele.filtertype,
                    fieldSearchContent: content,
                    tableType: tableType
                })
            })
            /**数据库**/
             fieldFilterList.push({
                fieldCode: 'range.db', 
                fieldSearchType: 'EQUALS',
                fieldSearchContent: vm.database,
                tableType: -1
            })
            //  /**danti**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.build', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_monomer,
            //     tableType: -1
            // })
            //  /**分区**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.partition', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_partition,
            //     tableType: -1
            // })
            //  /**楼层**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.storey', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_floor,
            //     tableType: -1
            // })
              /***
             * 更改时间 2018-7-16
             * 后端更改 数据类型
             * 三项合并
             * ****/
            var combinCode_type = vm.value_monomer+'&&'+vm.value_partition+'&&'+vm.value_floor
            fieldFilterList.push({
                fieldCode: 'range.build', 
                fieldSearchType: 'EQUALS',
                fieldSearchContent: combinCode_type,
                tableType: -1
            })
             /**专业**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.profession', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_professional,
            //     tableType: -1
            // })
            //  /**系统**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.system', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_system,
            //     tableType: -1
            // })
            //  /**类型**/
            //  fieldFilterList.push({
            //     fieldCode: 'range.type', 
            //     fieldSearchType: 'EQUALS',
            //     fieldSearchContent: vm.value_type,
            //     tableType: -1
            // })
            /***
             * 更改时间 2018-7-10
             * 后端更改 数据类型
             * 三项合并
             * ****/
            var combinCode = '000000'
            if(vm.value_professional != -1){//专业选择 不为全部
                combinCode = vm.value_professional
                if(vm.value_system != -1 && vm.value_system != 'NONE'){
                     combinCode = vm.value_system
                     if(vm.value_type != -1 && vm.value_type != 'NONE'){
                           combinCode = vm.value_type
                     }
                }
            }
             fieldFilterList.push({
                fieldCode: 'range.profession', 
                fieldSearchType: 'EQUALS',
                fieldSearchContent: combinCode,
                tableType: -1
            })
            if (error != '') {
                 vm.$message({
                    type:'warning',
                    message:error
                })
                return;
            }
            /***排序和分组***/
            var fieldGroupList = new Array()
            vm.list_order.forEach((ele,index)=>{
                if (ele.build_name == 'nofield') return;
                var tableType = ''
                var fieldAlias = ''
                vm.data_right.forEach(res=>{
                    if(res.fieldCode == ele.build_name){
                        fieldAlias = res.fieldName
                        tableType = res.tableType
                    }
                })
                fieldGroupList.push({
                    fieldCode: ele.build_name,
                    fieldOrderType: ele.ordertype, 
                    fieldGroupType: ele.grouptype,
                    tableType: tableType, 
                    fieldAlias:fieldAlias 
                })
            })
            /*****判断 样式 过滤****/
            if (vm.titleUseReportName) {
                vm.titleName = rcName
            }
            if (vm.styleShowTitle && $.trim(vm.titleName) == '') {
                vm.$message({
                    type:'warning',
                    message:'标题样式-》显示标题后-标题内容不能为空'
                })
                return
            }
            var tableWidth = vm.tableWidth
            if (tableWidth == 'fixed') {
                tableWidth = vm.tableWidthVal
                if (tableWidth == '' || !vm.isNumber(tableWidth)) {
                    vm.$message({
                        type:'warning',
                        message:'表格样式-》表格固定宽度后-宽度值格式错误，正确格式为：20,30等'
                    })
                    return;
                }
            }
            var rcStyle = {
                showTitle: vm.styleShowTitle?1:0,
                titleName: $.trim(vm.titleName),
                titleUseReportName: vm.titleUseReportName?1:0,
                titleFontSize: vm.titleFontSize,
                titleAlign: vm.titleAlign,
                titleUseBorder: vm.titleUseBorder?1:0,
                titleBorderHeight: vm.titleLineHeight,
                titleBgColor: vm.titleBgColor,
                tableFontSize: vm.tableFontsize,
                tableRowHeight: vm.tableLineHeight,
                tableWidth: tableWidth,
                tableAlign: vm.tableAlign,
                tableBorderWidth: vm.showTableNet,
                tableTitleBgColor: vm.tableTitleBgColor,
                tableGroupBgColor: vm.tableGroupBgColor
            }
            var url = vm.BDMSUrl + 'project2/report/' + vm.projId + '/rc/' + rcId + '/update'
            if (rcId == undefined || rcId == 0) {
                url = vm.BDMSUrl + 'project2/report/' + vm.projId + '/rc/add'
            }
            axios({
                method:'POST',
                url:url,
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId,
                },
                data: {
                    rc: rc,
                    fieldList: fieldList,
                    fieldFilterList: fieldFilterList,
                    fieldGroupList: fieldGroupList,
                    rcStyle: rcStyle,
                    needCount:needCount
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    var msg = '';
                    if(rcId == 0){
                        msg = '创建报表成功！'
                    }else{
                        msg = '修改报表成功！'
                    }
                   
                    vm.$message({
                        type:'success',
                        message:msg
                    })
                    if(needCount){
                        var params = {
                            showData:true,
                            rcid:response.data.rt
                        }
                    }else{
                         var params = {
                            showData:false
                        }
                    }
                    vm.$emit('aftersave',params);
                    
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
        saveForm(needCount){
            var vm = this
            $.ajax({
                type: "POST",
                url:vm.BDMSUrl + 'project2/report/isRepeat',
                data:{
                    id: this.rcId,
                    name: this.rcName,
                    projId:vm.projId
                },
                headers:{
                    token:vm.token
                },
                async:false, //同步
                success:function(response){
                    if(response.cd == 0){
                        vm.realSaveForm(needCount);
                    }else if(response.cd == '10001'){
                        vm.$message({
                            type:'warning',
                            message:'名称重复!'
                        })
                    }
                }
            });
        },

        initFiled(isClear){
            var vm = this
            vm.data_right = []
            vm.data_left = dataLeft
            if(isClear){
                vm.addField()
            }
        },
        changeFL(key,length){
            var vm = this;
            if(length == 5){
                if(vm.list_filter[key].val == 1){
                    vm.list_filter[key+1].show = true
                }else{
                    for(var i = key+1;i<length;i++){
                        vm.list_filter[i].show = false
                        vm.list_filter[i].val = 0
                    }
                }
            }else if(length == 3){
                if(vm.list_order[key].val == 1){
                    vm.list_order[key+1].show = true;
                }else{
                    for(let i = key+1;i<length;i++){
                        vm.list_order[i].show = false;
                        vm.list_order[i].val = 0;
                        vm.list_order[i].build_name = 'nofield';
                        vm.list_order[i].ordertype = 'ACENding';
                        vm.list_order[i].grouptype = 'NONE_GROUP';
                    }
                }
            }
            
        },
        back(){
            var vm = this
            vm.$emit('back')
        },
        changeTopExpend(){
            var vm = this
            vm.topExpend.isExpend = !vm.topExpend.isExpend
            vm.topExpend.title = vm.topExpend.isExpend?'收起':'展开'
        },
        checkThisF(key){
            var vm = this
            vm
            vm.data_right.forEach((val,index)=>{
                if(index == key){
                    val.checked = true
                }else{
                    val.checked = false
                }
            })
        },
        checkField(key){
            var vm = this
            vm.data_left[key].checked = !vm.data_left[key].checked
        },
        editField(index){
            var vm  = this
            if(vm.EditIndex == index){
                 vm.EditIndex = -1
            }else{
                vm.EditIndex = index
            }
        },
        shiftUp(){
            var vm = this
            if(vm.data_right.length <=1){
                return false
            }
            for(var i=0;i<vm.data_right.length;i++){
              if(vm.data_right[i].checked){
                if(i<1)return false
                var obj = {
                    fieldCode: vm.data_right[i].fieldCode,
                    fieldName:vm.data_right[i].fieldName,
                    fieldType:vm.data_right[i].fieldType,
                    tableType:vm.data_right[i].tableType,
                    checked: true
                }
                vm.data_right.splice(i-1,0,obj)
                vm.data_right.splice(i+1,1)
                break
              }
            }
        },
        shiftDown(){
            var vm = this
            for(var i=0;i<vm.data_right.length;i++){
              if(vm.data_right[i].checked){
                if(i == vm.data_right.length-1)return false
                var obj = {
                    fieldCode: vm.data_right[i].fieldCode,
                    fieldName:vm.data_right[i].fieldName,
                    fieldType:vm.data_right[i].fieldType,
                    tableType:vm.data_right[i].tableType,
                    checked: true
                }
                vm.data_right.splice(i+2,0,obj)
                vm.data_right.splice(i,1)
                break
              }
            }
        },
        addField(){
            var vm = this
            var arr = []
            vm.data_left.forEach((element,index) => {
              if(element.checked){
                  vm.data_right.push({
                    fieldCode: element.fieldCode,
                    fieldName:element.fieldName,
                    fieldType:element.fieldType,
                    tableType:element.tableType,
                    checked: false
                })
              }else{
                  arr.push(element)
              }
            })
            vm.data_left = arr
        },
        removeField(index){
            var vm = this
            vm.data_left.push({
                fieldCode: vm.data_right[index].fieldCode,
                fieldName:vm.data_right[index].fieldName,
                fieldType:vm.data_right[index].fieldType,
                tableType:vm.data_right[index].tableType,
                checked: false
            })
            vm.data_right.splice(index,1)
        },
        isNumber(input) {
            var regInt = new RegExp("^[0-9]*$");
            if(!/^[0-9]*$/.test(input) && !/^(-?\d+)(\.\d+)?$/.test(input)){  
               return false;
            }  
            return true;
        },
        isDate(input) {
            var result = input.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
            if(result==null) {
                return false;
            }
            return true;
        },
        isBoolean(input) {
            if(input.toLocaleUpperCase() != "TRUE" && input.toLocaleUpperCase() != "FALSE") {
                return false;
            }
            return true;
        },
    }
})
</script>

