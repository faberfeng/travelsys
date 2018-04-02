<template>
  <div class="wrapper" id="Professional">
      <h4 class="title"><span>专业工种分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
        <table class="UserList" border="1" width='100%'>
            <thead>
                <tr  class="userList-thead">
                    <th width="5%">序号</th>
                    <th width="28%">编码</th>
                    <th width="20%">标题</th>
                    <th width="22%">来源</th>
                    <th width="12%">状态</th>
                    <th width="13%;">操作 </th>
                </tr>
            </thead>
        </table>
          <el-tree :data="codingList"   node-key="id" :props="defaultProps" @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="item-code item-code-index" v-text="node.key"></div>
                    <div class="item-code " style="width:28%">编码</div>
                    <div class="item-code " style="width:20%">标题</div>
                    <div class="item-code " style="width:22%">来源</div>
                    <div class="item-code " style="width:12%">状态</div>
                    <div class="item-code " style="width:13%;">操作 </div>
                </span>
          </el-tree>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'Professional',
    data(){
        return {
            codingList:[],//编码列表
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
            defaultProps:{
              children: 'children',
               label: 'number'
            }
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getWorkCode()
    },
    methods:{
        handleNodeClick(data) {
            console.log(data);
        },
        //专业种类分类/作业工具分类编码信息
        getWorkCode(){
            var vm = this
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/getWorkCode',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId,
                    tableNo:'t13'
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    vm.codingList = response.data.rt
                }else if(response.data.cd == '-1'){
                    vm.$message({
                        type:'warning',
                        message:response.data.msg
                    })
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            })
        }
    }

}
</script>
<style  lang='less'>
#Professional{
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
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
    .el-tree-node__content{
        height: auto;
        padding-left:5%!important; 
    }
    // .el-tree-node__expand-icon{
    //     display: none;
    // }
    .custom-tree-node{
        width: 100%;
        height: auto;
        position: relative;
    }
    .item-code{
        float: left;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #333333;
        border-bottom: 1px solid #e0e0e0;
        border-right:  1px solid #e0e0e0;
    }
    .item-code-index{
        position: absolute;
        left: -5%;
        top: 0;
        width: 5%;
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
}
</style>