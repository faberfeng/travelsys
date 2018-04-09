<template>
  <div class="wrapper">
      <h4 class="title"><span>结构设计分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn" @click="addConstructor"><i class="el-icon-plus"></i>添加</button>
        <!-- <div class="worktable">
         <zk-table 
             index-text="序号"
            :data="codingList" :columns="columns" :tree-type="props.treeType" 
            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
            :border="props.border" >
                <template slot="action" slot-scope="scope">
                   <button class=""   v-if="scope.row.status == 0" @click="edit(scope)">提请</button>
                    <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">通过</button>
                     <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">退回</button>
                   <button class="editBtn actionBtn" @click="edit(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                   <button class="deleteBtn actionBtn" @click="deleteItem(scope.rowIndex)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                </template> 
            </zk-table>
        </div> -->
    </div>
  </div>
</template>
<script>
export default {
    name:'ConstructorDesignCode',
    data(){
        return {

        }
    },
    methods:{
        addConstructor(){
            console.log(123);
        }
    }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
        /* border-left: 1px solid #ccc; */
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