<template>
    <div class="wrapper" id="pageIn">
        <h4 class="titleAll"><span>层级管理配置</span></h4>
        <div class="pageI">
            <div class="pageSelect">
                <div class="pageBtn">
                    <button class="addBtn" v-if="showBtn" @click="addPartitionList">+添加</button>
                    <!-- <button class="editBtn" @click="editPartitionList">编辑</button>
                    <button class="editBtn" @click="deletePartitionList">删除</button> -->
                </div>
            </div>
        </div>
        <div class="worktable">
            <zk-table index-text="序号" :data="constructorData" :columns="columns" :tree-type="props.treeType" 
                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                    :border="props.border"  empty-text="正在加载..." @row-click="rowClick"  >
                     <template slot="action" slot-scope="scope">
                        <button class="editBtn actionBtn" @click="editList(scope)"></button>
                        <button class="deleteBtn1 actionBtn" @click="deleteItem(scope)"></button>
                     </template>
            </zk-table>
        </div>
        <div id="edit">
            <el-dialog title="新增层级" :visible.sync="addPartitionShow" :before-close="cancleAddPartitionList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">容器名称 :</label><input class="inp" placeholder="请输入" v-model="holderValue"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeAddPartitionList">确定</button>
                    <button class="editBtnC" @click="cancleAddPartitionList">取消</button>
                </div>
            </el-dialog>

            <el-dialog title="修改层级" :visible.sync="editPartitionShow" :before-close="cancleEditPartitionList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">容器名称 :</label><input class="inp" placeholder="请输入" v-model="holderValue"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditPartitionList">确定</button>
                    <button class="editBtnC" @click="cancleEditPartitionList">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deletePartitionDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deletePartitionDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            constructorData:[],
            holderValue:'',
            addPartitionShow: false,
            editPartitionShow: false,
            deletePartitionDialog:false,
            props: {
                stripe: false,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: true,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
            }, 
            columns: [
                {
                    label: '容器编号',
                    prop: 'holderId',
                    width: '350px',
                },
                {
                    label: '容器名称',
                    prop: 'holderName',
                    minWidth: '250px',
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    width:'250px'
                }
            ],
            holderName:'',
            holderId:'',
            showBtn:false,
        }
    },
    created(){
        var vm = this
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        this.getProjectHolderChildren();
    },
    methods:{
        addPartitionList(){
            this.addPartitionShow=true;
        },
        cancleAddPartitionList(){
            this.addPartitionShow=false;
            this.holderValue=''
        },
        makeAddPartitionList(){
            axios({
                url:this.BDMSUrl+'/api/v1/addHolder',
                headers:{
                    'token':this.token
                },
                params:{
                    parentId:this.holderId,
                    name:this.holderValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getProjectHolderChildren();
                    this.addPartitionShow=false;
                    this.holderValue='';
                    this.holderId='';
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        cancleEditPartitionList(){
            this.editPartitionShow=false;
        },
        makeEditPartitionList(){
            axios({
                url:this.BDMSUrl+'/api/v1/alterHolder',
                headers:{
                    'token':this.token
                },
                params:{
                    parentId:this.holderId,
                    name:this.holderValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getProjectHolderChildren()
                    this.holderValue='';
                    this.holderId='';
                    
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
            this.editPartitionShow=false;
            
        },

        deleteMakeSure(){
            axios({
                url:this.BDMSUrl+'/api/v1/deleteHolder',
                headers:{
                    'token':this.token
                },
                params:{
                    holderId:this.holderId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                    this.getProjectHolderChildren()
                    this.deletePartitionDialog=false;
                    this.holderValue='';
                    this.holderId='';
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },

       getProjectHolderChildren(){
           var vm=this;
           this.constructorData=[];
           axios({
                url:vm.BDMSUrl+'api/v1/projectHolderChildren',
                method:'get',
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.constructorData.push(response.data.rt);
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
       },
       editList(scope){
           this.editPartitionShow=true;
           console.log(scope.row.holderId,'scope');
           this.holderValue=scope.row.holderName;
           this.holderId=scope.row.holderId;
       },


       deleteItem(scope){
           this.holderId=scope.row.holderId;
           this.deletePartitionDialog=true;

       },
    //    treeIconClick(rowIndex){
    //        this.selectRowList = rowIndex;
    //        console.log(this.selectRowList,'000');

    //    },
       rowClick(row, rowIndex,$event){
            // console.log(row);
            console.log(rowIndex);
            // console.log($event)
            {
                if(row.target._prevClass=="zk-table__cell-inner"){
                    row.target.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
                    item.style.backgroundColor='white'
                    })
                    row.target.parentElement.parentElement.style.backgroundColor='#0081c2'
                }
                if(row.target._prevClass=="zk-table__body-cell zk-table--border-cell"){
                    row.target.parentElement.parentElement.childNodes.forEach((item)=>{
                    item.style.backgroundColor='white'
                    })
                    row.target.parentElement.style.backgroundColor='#0081c2'
                }
                if(row.target._prevClass=="zk-table--level-3-cell"||"zk-table--level-4-cell"){
                    row.target.parentElement.parentElement.parentElement.parentElement.childNodes.forEach((item)=>{
                    item.style.backgroundColor='white'
                    })
                    row.target.parentElement.parentElement.parentElement.style.backgroundColor='#0081c2'
                }
            }
            this.selectRowList = rowIndex;
            this.selectRowList.forEach((item, index) => {
                if (item._isHover == true) {
                    this.selectChildren=item.children
                    console.log(this.selectChildren,'this.selectChildren');
                    this.holderId=item.holderId,
                    this.holderName=item.holderName
                    console.log(this.holderId,'this.holderId');
                    this.showBtn=true;
                }
            })

       }

    }

}
</script>

<style lang="less" scope>
    #pageIn{
        width: 100%;
        display: block;
        height: 800px;
        overflow-y: auto;
        overflow-x: hidden;

        .titleAll{
            font-weight: bold;
            border-bottom:1px solid #ccc; 
            margin: 0px 20px 0 0px ;
            text-align: left;
            span{
                    display: inline-block;
                    margin-left: 15px;
                    color: #fc343a;
                    font-size: 18px;
                    line-height: 18px;
                    margin: 22px 0 11px 15px;
            }
        }
        .pageI{
            margin: 0 20px 0 15px;
            .pageSelect{
                    display: flex;
                    margin-top: 26px;
                    font-size: 0.8rem;
                    color: #999999;
                    float: right;
                .pageBtn{
                    text-align: left;
                    .addBtn,.editBtn{
                        width: 95px;
                        height: 38px;
                        border: 1px solid #ccc;
                        background: #fc3439;
                        color: #fff;
                        margin-left: 10px;
                        cursor: pointer;
                        padding: 0;
                        border-radius: 2px;
                        border: none;
                    }
                }

            }

        }
        .worktable{
            margin-top:80px;
        }

        .edit{

        }


        .zk-table{
        color: #333333;
        }
        .zk-table--tree-icon{
            position: relative;
            width: 40px;
            display: inline-block;
            z-index: 10;
            background: #ffffff;
        }
        .zk-table--row-hover .zk-table--tree-icon{
            background: #ebf7ff;
        }
        .zk-table--tree-icon::after {
            display: block;
            position: absolute;
            top: 6px;
            left: 20px;
            width: 15px;
            height: 12px;
            background:url('./images/folder_1.png')no-repeat 0 0; 
        content: '';
        }
        .zk-icon-minus-square-o::after{
            background:url('./images/folder.png')no-repeat 0 0; 
        }
        .zk-table__body-row>td:first-of-type{
            width: 45px;
        }
        .zk-table--level-4-cell,.zk-table--level-3-cell,.zk-table--level-2-cell,.zk-table--level-1-cell,.zk-table--level-5-cell{
            position: relative;
        }
        .zk-table--level-4-cell::before,.zk-table--level-3-cell::before,.zk-table--level-2-cell::before,.zk-table--level-1-cell::before,.zk-table--level-5-cell::before{
            display: block;
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 14px;
            background:url('./images/file.png')no-repeat 0 0; 
            content: '';
            z-index: 1;
        }
        .zk-table__cell-inner {
            padding: 0px 12px;
        } 
        .zk-table__body-row,.zk-table__header-row{
            height: 36px;
        }
        .editBtn{
            background: url('../../assets/edit.png') no-repeat;
        }
        .deleteBtn1{
            background: url('../../assets/delete.png') no-repeat;
        }
        .actionBtn{
            width: 16px;
            height: 16px;
            border: none;
            cursor: pointer;
            margin-right: 16px;
            margin-top:9px;
        }
    }

</style>

