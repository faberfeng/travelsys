<template>
  <div class="wrapper" id="ShejiGoujian">
    <h4 class="title"><span>设计结构分类编码</span></h4>
    <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            <div style="padding:0 20px;box-sizing: border-box;">
                <table class="UserList" border="1" width='100%'>
                    <thead>
                        <tr  class="userList-thead">
                            <th width="15%">名称</th>
                            <th width="20%">账号</th>
                            <th width="10%">工程管理员</th>
                            <th width="15%;">以被分配到的岗位</th>
                            <th width="16%">添加时间</th>
                            <th width="12%;">添加人</th>
                            <th width="12%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val,index) in userList" :key="index">
                            <td v-text="val.userName"></td>
                            <td v-text="val.account"></td>
                            <td v-text="val.isAdmin ==2?'是':'不是'"></td>
                            <td>
                                <span v-for="(item,key) in val.userPositions" :key="key" v-text="item.posName"></span>
                            </td>
                            <td v-text="val.addTimeStr"></td>
                            <td v-text="val.addUser"></td>
                            <td>
                                <span v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位'))"
                                    class="editIcon" @click="addUser(val.userId)"></span>
                                <span v-if="!(val.posType == 0 || (val.posName == '工程管理员' && val.posTypeName == '工程内岗位')) && !(val.posName == '默认岗位' && val.posTypeName == '合作方岗位')" 
                                class="deleteIcon" @click="deleteUser(val.id)"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>
<style  lang='less'>
#ShejiGoujian{
    *{
        box-sizing: border-box;
        
    }
    .el-button{
        width: 112px;
        height: 36px;
        line-height: 36px;
        padding: 0;
    }
        /***********设置滚动条************/
            /* 设置滚动条的样式 */
            ::-webkit-scrollbar {
            width:7px;
            }
            /* 滚动槽 */
            ::-webkit-scrollbar-track {
            -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
            border-radius:10px;
            }
            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
            border-radius:10px;
            background:rgba(0,0,0,0.1);
            -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
            }
            ::-webkit-scrollbar-thumb:window-inactive {
            background:rgba(255,0,0,0.4);
            }
            /*********************/
            .editIcon{
                float: left;
                width: 17px;
                height: 16px;
                background: url('../../assets/edit.png')no-repeat 0 0;
                cursor: pointer;
                margin-right: 20px;
            }
            .deleteIcon{
                float: left;
                width: 16px;
                height: 16px;
                background: url('../../assets/delete.png')no-repeat 0 0;
                cursor: pointer;
            }
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 10px;
                        height: 52px;
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                    }
                }
                tbody{
                    tr{
                        td{
                            padding-left: 10px;
                            height: 52px;
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
            .pagination{
                width: 100%;
                text-align: right;
                margin-top: 10px;
                margin-right: 20px;
            }
            .el-pagination{
                padding:0;
                // margin-right: 20px;
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
                }
                .el-icon-search{
                    position: absolute;
                    right: 10px;
                    top: 8px;
                }
            }
            .title-right-edit-icon{
                display: block;
                position: absolute;
                top: 7px;
                right: 8px;
                width: 16px;
                height: 16px;
                content: '';
                // background: url('./images/1-1.png')no-repeat 0 0;
                cursor: pointer;
                &::before{
                    color: #a5adb3;
                }
            }
            .el-dialog{
                width: 586px;
                .el-dialog__header{
                    padding: 34px 0 17px 30px;
                    text-align: left;
                    border-bottom: 1px solid #cccccc;
                    .el-dialog__title{
                        font-size: 20px;
                    color: #fc3439;
                    line-height: 20px;
                    font-weight: bold;
                    }
                    .el-dialog__headerbtn{
                        top: 10px;
                        right: 10px;
                    }
                }
                .el-dialog__body{
                    padding: 22px 45px 20px;
                    .log-head{
                        margin-bottom: 7px;
                        .log-head-title{
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                            float: left;
                        }
                       
                        .el-radio{
                            float: left;
                            span{
                                color: #666666;
                            }
                        }
                    }
                    .JobName{
                        display: block;
                        padding-left: 80px;
                        box-sizing: border-box;
                        input{
                           float: left;
                            width: 312px;
                            height: 32px;
                            padding: 0 10px;
                            box-sizing: border-box;
                            border-radius: 2px;
                            border:1px solid #e0e0e0;
                            background: #fafafa; 
                        }
                        .btn{
                            float: left;
                            width: 95px;
                            text-align: center;
                            &::after{
                                display: none;
                            }
                        }
                    }
                    .log-body{
                        margin-top: 20px;
                        position: relative;
                        .log-head-position{
                            color: #333333;
                            font-weight: bold;
                        }
                        .position-all{
                            width: 408px;
                            height: 165px;
                            overflow-y: auto;
                            border: 1px solid #e0e0e0;
                            background: #fafafa;
                            margin-top: 4px;
                            .el-checkbox{
                                display: block;
                                margin:8px 10px; 
                                .el-checkbox__label{
                                    color: #666666;
                                }
                            }
                        }
                        .log-head-title{
                            display: block;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                        }
                         .userInfo{
                            float: right;
                            width: 415px;
                            .image-user{
                                float: left;
                                width: 80px;
                                height: 80px;
                                background: url('./images/people.png')no-repeat 0 0 ;
                            }
                            .info-user{
                                float: left;
                                margin-left: 20px;
                                p{
                                    margin: 0;
                                    height: 30px;
                                    line-height: 30px;
                                    font-size: 14px;
                                    .name{
                                        color: #999999;
                                    }
                                    .detial{
                                        color: #333333;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                        .el-tree{
                            float: left;
                            width: 414px;
                            height: 278px;
                            overflow: auto;
                            padding: 5px;
                            box-sizing: border-box;
                            border:1px solid #e0e0e0;
                        }
                    }
                    .el-dialog__footer{
                        padding: 0 0 20px;
                    }
                }

            }
            .clearfix{
                clear: both;
                overflow: hidden;
                content: '';
            }
            /**********一下是分页器的样式***************/
            .datagrid-pager {
                display: block;
                margin: 0 20px;
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
                margin-top: 5px;
            }
}
</style>
<script>
import axios from 'axios';

export default {
    name:'ConstructorDesignMapped',
    data(){
        return {
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/project2/',
            page:'0',
            rows:'20'
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getGeniceClassMapItem();
        this.getGeniceClassMapJson();
    },
    methods:{
        //获取分类映射信息
        getGeniceClassMapItem(){
            
            axios({
                method:'post',
                url:this.baseUrl+'Config/getGenieClassMapItem',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    page:this.page,
                    rows:this.rows
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data)
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        getGeniceClassMapJson(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/getGenieClassJson',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data)
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
   .wrapper{
        width: 100%;
    }
    .title{
        border-bottom:1px solid #ccc; 
        margin: 0 ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        margin-left: 15px;
        color: #fc343a;
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        margin: 22px 0 12px 15px;
    }
    .manageWorktool{
        margin: 0 20px 0 15px;
        text-align: left;
    }
    .worktooltitle{
        color:#fc3439;
        display: inline-block;
        width: 50%;
        text-align: left;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        margin: 0;
        text-align: left;
        margin: 30px 0 20px;
    }   
    .btn{
        width: 96px;
        height: 32px;
        border: none;
        border-radius: 2px;
        float: right;
        margin: 22px 0 12px 0;
        cursor: pointer;
        background: #fc3439;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .btn:hover{
        background: #ff5257
    }
    .btn i{
        margin-right: 10px;
    }

</style>