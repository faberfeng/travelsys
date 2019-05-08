<template>
    <div id="wrapper">
        <div id="item-box-file">
            <span :class="['label-item',{'label-item-active':itemShow}]" @click="projectPerson()">项目成员</span>
            <span :class="['label-item',{'label-item-active':!itemShow}]" @click="temporaryPerson()">临时成员</span>
            <div v-show="itemShow" class="wrapperHead" @click="buildProperson">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div>
            <div v-show="!itemShow" class="wrapperHead" @click="buildTemperson">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div>
        </div>
        <div class="wrappBody" v-show="itemShow">
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序列</th>
                           <th>项目成员</th>
                           <th>人脸识别</th>
                           <th>指纹</th>
                           <th>有效时长</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <!-- <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
            <div style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                当前列表无数据
            </div>
            <div class="tableBodyPagination">
                <div class="tableBodyPaginationRight">
                    <el-pagination class="elPagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="1"
                        layout="sizes,prev, pager, next"
                        :total="TableListLength">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="wrappBody" v-show="!itemShow">
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序列</th>
                           <th>临时成员</th>
                           <th>人脸识别</th>
                           <th>指纹</th>
                           <th>有效时长</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <!-- <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
            <div style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                当前列表无数据
            </div>
            <div class="tableBodyPagination">
                <div class="tableBodyPaginationRight">
                    <el-pagination class="elPagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="1"
                        layout="sizes,prev, pager, next"
                        :total="TableListLength">
                    </el-pagination>
                </div>
            </div>


        </div>
        <div id="edit">
                <!-- <el-dialog title="添加IC卡" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">IC卡编号 :</label><input class="inp" placeholder="请输入" v-model="icCordNum"/></div>
                        <div class="editBodytwo">
                            <label class="editInpText">IC卡类别 :</label>
                             <select class="editSelect" v-model="icCordType" >
                                <option v-for="(item,index) in icOptions" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodytwo"><label class="editInpText">绑定人员 :</label>
                            <select class="editSelect" v-model="icCordOwner" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                    <p class="err" v-show="showErr">请输入完整信息</p>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addCard()">确定</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog> -->
        </div>
    </div>
</template>

<script>
export default {
    name:"faceAndFingerInput",
    data(){
        return{
            itemShow:true,
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
        }
    },
    created(){

    },
    methods:{
         projectPerson(){
             this.itemShow=true; 
         },
         temporaryPerson(){
             this.itemShow=false;
         },
        handleSizeChange(){
        },
        handleCurrentChange(){
        },
        //改变时间
        changeDatePicker(){
        },
        selectNameInfo(){
        },
       buildProperson(){


       },
       buildTemperson(){

       }
    }
}
</script>

<style lang="less" scoped>
    #wrapper{
        margin-top:51px;
        margin-right: 20px;
        #item-box-file {
            display: block;
            border: 1px solid #e6e6e6;
            height: 36px;
            padding-top: 16px;
            padding-left: 20px;
            
            background: #fafbfc;
            position: relative;
            .label-item {
                float: left;
                height: 34px;
                font-size: 14px;
                width: 106px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border-top: 3px solid #fafbfc;
                color: #999999;
                text-decoration: none;
            }
            .label-item-active {
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
            .wrapperHead{
                float: right;
                line-height: 22px;
                height: 54px;
                margin-right:15px;
                cursor: pointer;
                .el-icon-plus{
                    font-size: 16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
                .elName{
                    margin-left:4px;
                    font-size:16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
            }
        }
        .wrappBody{
            .tableBody{
                  margin-top:30px;
                    .tableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        thead{
                            background: #f2f2f2;
                            th{
                                padding-left: 6px;
                                padding-right: 15px;
                                height: 36px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 14px;
                                color: #333333;
                                font-weight: normal;
                            }
                        }
                        tbody{
                            tr{
                                .red{
                                    color: red;
                                }
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    .actionBtn{
                                        width: 18px;
                                        height: 18px;
                                        border: none;
                                        cursor: pointer;
                                        margin-left: 10px;

                                    }
                                    // .deleteBtn{
                                    //     background: url('../../assets/delete.png') no-repeat 0 0;
                                    // }
                                    // .editBtn{
                                    //     background: url('./images/overviewedit.png') no-repeat 0 0;
                                    // }
                                    // .upmoveBtn{
                                    //     background: url('./images/overviewup.png') no-repeat 0 0;
                                    // }
                                    // .downmoveBtn{
                                    //     background: url('./images/downmove.png') no-repeat 0 0;
                                    // }
                                    // .detailBtn{
                                    //     background: url('./images/overfile.png') no-repeat 0 0;
                                    // }
                                    // .exportBtn{
                                    //     background: url('./images/overviewdown.png') no-repeat 0 0;
                                    // }

                                }
                            }
                        }
                    }
            }
            .tableBodyPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .tableBodyPaginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 16px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                    }
            }

        }
    }

</style>
