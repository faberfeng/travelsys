<template>
    <div  id="designVersion">
        <div id="item-box-file">
            <router-link :to="'/Design/management'" class=" label-item">  
                设计协调  
            </router-link>
            <router-link :to="'/Design/attributeManager'"  class="label-item">  
                属性管理  
            </router-link>
            <router-link :to="'/Design/designversion'"  class="label-item label-item-active">  
                设计版本  
            </router-link>
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
        </div>
        <div class="tableBox">
            <table class="UserList" border="1" width="100%" >
                <tbody class="head">
                    <tr>
                        <td width="7%">版本号</td>
                        <td width="10%">相关空间</td>
                        <td width="7%">空间操作</td>
                        <td width="7%;">相关内容节点</td>
                        <td width="10%">结点操作</td>
                        <td width="7%;">新增元素</td>
                        <td width="7%">更新元素</td>
                        <td width="7%">删除元素</td>
                        <td width="7%">元素总和源</td>
                        <td width="10%">更新用户</td>
                        <td width="10%">更新时间</td>
                    </tr>
                </tbody>
            </table>
            <table class="UserList"  id="detial-table" border="1" width="100%" >
                <tbody>
                    <tr v-for="(item,index) in designVersionData" :key="index">
                        <td width="7%">{{item.RootHolderVersion}}</td>
                        <td width="10%">{{item.RefHolderName}}</td>
                        <td width="7%">{{item.holderOperator}}</td>
                        <td  width="10%">{{item.RefNodeName?item.RefNodeName:'无'}}</td>
                        <td  width="7%">{{item.nodeOperator}}</td>
                        <td  width="7%">{{item.AddElementCount}}</td>
                        <td  width="7%">{{item.ModifyElementCount}}</td>
                        <td  width="7%">{{item.DeleteElementCount}}</td>
                        <td  width="7%">{{item.ElementCount}}</td>
                        <td  width="10%">{{item.UpdateUser}}</td>
                        <td width="10%">{{item.UpdateTime}}</td>
                    </tr>
                </tbody>
            </table>
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
<style lang="less" scoped>
    #designVersion{
        box-sizing: border-box;
        position: fixed;
        top: 116px;
        left: 26px;
        bottom:0;
        right: 0;
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
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
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
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
        .tableBox{
            display: block;
            padding: 20px;
            margin-right: 20px;
            min-height: 200px;
            width: 100%;
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                .head{
                    background: #f2f2f2;
                    td{
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
            #detial-table{
                display: block;
                position: fixed;
                top: 237px;
                left: 46px;
                bottom: 20px;
                right: 20px;
                width: auto;
                overflow: auto;
            }
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    }
</style>



