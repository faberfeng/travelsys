<template>
    <div id="wrapper">
        <div class="leftTxt">门禁管理</div>
        <div class="wrapperHead" @click="buildAccess">
            <span class="el-icon-plus"></span><span class="elName">新建门禁</span>
        </div>
        <div class="contentBody">
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>门禁名称</th>
                           <th>门禁链接</th>
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
            <el-dialog title="新增门禁" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">门禁名称 :</label><input class="inp" placeholder="请输入" v-model="accessName"/></div>
                    <div class="editBodytwo"><label class="editInpText">门禁链接 :</label><input class="inp" placeholder="请输入" v-model="accessUrl"/></div>
                </div>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMakeSure">确定</button>
                    <button class="editBtnC" @click="addCancle">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name:'accessControl',
    data(){
        return{
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
            addDialog:false,//
            accessName:"",//门禁名称
            accessUrl:"",//门禁url
            showErr:false,


        }
    },
    created(){

    },
    methods:{
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        //改变时间
        changeDatePicker(){

        },
        selectNameInfo(){

        },
        addMakeSure(){

        },
        addCancle(){
            this.addDialog=false;
            this.accessName='';
            this.accessUrl='';
        },
        buildAccess(){
            this.addDialog=true;
        }

    }
}
</script>

<style lang="less" scoped>
#wrapper{
    
    border: 1px solid #d9d9d9;
    height: 50px;
    background: rgb(250, 251, 252);
    font-size: 12px;
    margin-right: 10px;
    margin-top:51px;
    .leftTxt{
        float: left;
        line-height: 48px;
        height: 48px;
        margin-left:15px;
        font-size: 16px;
        font-weight: bold;
    }
    .wrapperHead{
        float: right;
        line-height: 48px;
        height: 48px;
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
     .contentBody{
            margin-top:20px;
            padding: 20px 0px;
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
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat 0 0;
                                    }
                                    .editBtn{
                                        background: url('../../assets/edit.png') no-repeat 0 0;
                                    }
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
