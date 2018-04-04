<template>
  <div class="wrapper">
      <h4 class="title"><span>作业工具分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            <zk-table ref="table" :data="workToolData" :columns="columns" :tree-type="props.treeType"
            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
            :border="props.border" @tree-icon-click="expandChange($event)" @row-key="Key(row,rowIndex)">
                <template slot="action" slot-scope="scope">
                   <button class="editBtn actionBtn" @click="edit(scope.rowIndex)"></button>
                   <button class="deleteBtn actionBtn" @click="deleteItem(scope.rowIndex)"></button>
                </template> 
            </zk-table>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name:'WorkTool',
    data(){
            return {
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
                columns: [
                    {
                        label: '序号',
                        prop: 'number',
                        width: '100px',
                    },
                    {
                        label: '编码',
                        prop: 'number',
                        width: '200px',
                    },
                    {
                        label: '标题',
                        prop: 'title',
                        minWidth: '50px',
                    },
                    {
                        label: '来源',
                        prop: 'type',
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        minWidth: '200px',
                    },
                    {
                        label:'操作',
                        prop:'operator',
                        type: 'template',
                        template: 'action',
                        width:'150px'
                    }
                ],
                token:'',
                projId:'',
                baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
                workToolData:[]
            }

    },
    created(){
        this.projId = localStorage.getItem('projId');
        this.token  = localStorage.getItem('token');
        this.getWorkCode();
    },
    methods:{
        //专业工种分类/作业工具分类编码信息
        getWorkCode(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/getWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    tableNo:'t17'
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.workToolData = response.data.rt;
                    // for(let item of this.workToolData){
                    //     console.log(item.title);
                    // }
                    //console.log(this.workToolData);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //编辑
        edit(num){
            console.log(num)
        },
        //删除
        deleteItem(num){
            console.log(num)
        },
        //格式化来源
        formatterType(val){
            if (value == 0) {
                return "行业标准";
            }else if (value == 1) {
                return "企业标准";
            } else {
                return "工程标准";
            }
        },
        //格式化状态
        formatterStatus(value, row, index) {
            if (row.type == 0 || row.type == 1) {
                return '正常使用';
            } else {
                if (value == 0) {
                    return "未提请";
                } else if (value == 1) {
                    return "已提请";
                } else if (value == 2) {
                    return "已退回";
                } else {
                    return "正常使用 ";
                }
            }
        },
        expandChange($event){
            //console.log(row);
             //console.log(rowIndex);
            console.log($event)
        },
        Key(row,rowIndex){
            console.log(row);
            console.log(rowIndex)
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
    .actionBtn{
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
    }
    .editBtn{
        background: url('../../assets/edit.png') no-repeat;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
        margin-left: 20px;
    }
</style>