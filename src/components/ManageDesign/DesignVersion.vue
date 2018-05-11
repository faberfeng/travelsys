<template>
    <div class="wrapper" id="designVersion">
        <div class="header">
            <span class="singelOne">单体</span>
            <div class="selectOption">
                <select v-model="selectValue" @change="getModelCommitLogs">
                    <option :value="holderId">全部</option>
                    <option  v-for="(item,index) in selectData" :key="index" :value="item.ID" >{{item.Name}}</option>
                </select>
                <i class="icon-sanjiaoone"></i>
            </div>
        </div>
        <div class="table">
            <div style="padding:0;box-sizing: border-box;">
                <table class="UserList" border="1" width='100%'>
                    <thead>
                        <tr class="userList-thead">
                            <th width="7%">版本号</th>
                            <th width="10%">相关空间</th>
                            <th width="7%">空间操作</th>
                            <th width="7%;">相关内容节点</th>
                            <th width="10%">结点操作</th>
                            <th width="7%;">新增元素</th>
                            <th width="7%">更新元素</th>
                            <th width="7%">删除元素</th>
                            <th width="7%">元素总和源</th>
                            <th width="10%">更新用户</th>
                            <th width="10%">更新时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in designVersionData" :key="index">
                            <td>{{item.RootHolderVersion}}</td>
                            <td>{{item.RefHolderName}}</td>
                            <td>{{item.holderOperator}}</td>
                            <td>{{item.RefNodeName?item.RefNodeName:'无'}}</td>
                            <td>{{item.nodeOperator}}</td>
                            <td>{{item.AddElementCount}}</td>
                            <td>{{item.ModifyElementCount}}</td>
                            <td>{{item.DeleteElementCount}}</td>
                            <td>{{item.ElementCount}}</td>
                            <td>{{item.UpdateUser}}</td>
                            <td>{{item.UpdateTime}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>
</template>
<script>
import axios from 'axios';
export default {
  name:'DesignVersion',
    data(){
        return{
            designVersionData:[],
            selectData:[],
            token:'',
            projId:'',
            BDMSUrl:'',
            selectValue:'',
            holderId:''
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.getDesignVersion();
    },
    methods:{
        //进入设计版本页面
        getDesignVersion(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/dc/designVersion',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.selectData = response.data.rt.subProjects;
                    this.holderId = response.data.rt.holderId;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }).then(()=>{
                this.getModelCommitLogsFirst(this.holderId);
                this.selectValue = this.holderId;
            })
        },
        //第一次啊加载数据
        getModelCommitLogsFirst(val){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/dc/getModelCommitLogs',
                headers:{
                    token:this.token
                },
                params:{
                    buildId:val
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt){
                        this.designVersionData = response.data.rt;
                        this.designVersionData.forEach(item=>{
                            item = Object.assign(item,{
                                holderOperator:this.getOperator(item.HolderOperator),
                                nodeOperator:this.getOperator(item.NodeOperator)
                            })
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //查询容器的数据更新日志
        getModelCommitLogs(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/dc/getModelCommitLogs',
                headers:{
                    token:this.token
                },
                params:{
                    buildId:this.selectValue
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt){
                        this.designVersionData = response.data.rt;
                        this.designVersionData.forEach(item=>{
                            item = Object.assign(item,{
                                holderOperator:this.getOperator(item.HolderOperator),
                                nodeOperator:this.getOperator(item.NodeOperator)
                            })
                            
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //判断空间操作
        getOperator(operator){
            if(operator == 0){
                return "增加";
            }else if(operator == 1){
                return "更新";
            }else if(operator == 2){
                return "删除";
            }else if(operator == 3){
                return "不变";
            }
        }
    }
}
</script>
<style lang="less">
    #designVersion{
        width: 100%;
        box-sizing: border-box;
        .header{
            margin: 60px 20px 10px 20px;
            overflow: hidden;
            .singelOne{
                float: left;
                color: #999;
                font-size: 12px;
                height: 30px;
                line-height: 30px;
                margin-right: 10px;
            }
        }
        .selectOption{
            position: relative;
            width: 212px;
            float: left;
            select{
                height: 28px;
                width: 212px;
                border-radius: 28px;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 10px;
                border: 1px solid #ccc;
            }
            .icon-sanjiaoone{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image:url('./images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 13px;
                left: 180px;
            }
        }
        .table{
            margin: 0 20px 50px 20px;
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 9px;
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
                            padding-left: 9px;
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
                    tr:nth-child(2n){
                        background: #fafafa
                    }
                }
            }
        }
    }
</style>



