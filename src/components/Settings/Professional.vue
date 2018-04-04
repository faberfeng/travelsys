<template>
  <div class="wrapper" id="Professional">
      <h4 class="title"><span>专业工种分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
         <zk-table 
             index-text="序号"
            :data="codingList" :columns="columns" :tree-type="props.treeType" 
            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
            :border="props.border" >
                <template slot="action" slot-scope="scope">
                   <button class=""   v-if="scope.row.status == 0" @click="edit(scope)">提请</button>
                    <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">通过</button>
                     <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">退回</button>
                   <button class="editBtn actionBtn" @click="edit(scope)"></button>
                   <!-- v-if="scope.row.status == 2 || scope.row.status == 0"-->
                   <button class="deleteBtn actionBtn" @click="deleteItem(scope.rowIndex)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                </template> 
            </zk-table>
        </div>
    </div>
      
      <div id=edit>
        <el-dialog title="编辑编码" :visible.sync="addCode" :before-close="userClose">
            <div class="editBody">
                <div class="editBodyone edit-item clearfix">
                    <label class="editInpText">编码级别 :</label>
                    <select  class="editSelect" disabled v-model="codingToEdit.level">
                        <option v-for="(item,index) in codingToEdit.level" :key="index" :value="item" v-text="'Level'+item"></option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix" v-for="(item,index) in codingToEdit.level" :key="index">
                    <label class="editInpText" v-text="item+'级编码 :'"></label>
                    <select class="editSelect" disabled>
                        <option v-text="initCode(item)"></option>
                    </select>
                     <i class="icon-sanjiao"></i>
                    <span v-text="'标题：'+initTitle(item)" :title="'标题：'+initTitle(item)" class="edit-item-biaoti"></span>
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">新建编码 :</label>
                    <!-- <input class="inp" placeholder="请输入" :value="initCode(codingToEdit.level)"/> -->
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">新标题 :</label>
                    <input class="inp" placeholder="请输入" :value="codingToEdit.title"/>
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">完整编码 :</label>
                    <span v-text="codingToEdit.number"></span>
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">完整标题 :</label>
                    <span v-text="codingToEdit.title"></span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="PostaddUser">确定</button>
                <button class="editBtnC" @click="userClose">取消</button>
            </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import './js/jquery-1.4.4.min.js'
import data from './js/date.js'
import axios from 'axios'
export default {
    name:'Professional',
    data(){
        return {
            codingList:[],//编码列表
            codingToEdit:{},//要编辑的编码
            levelNum:{},
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
            defaultProps:{
              children: 'children',
               label: 'number'
            },
            addCode:false,
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
                    prop: 'type_',
                },
                {
                    label: '状态',
                    prop: 'status_',
                    minWidth: '200px',
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    width:'100px'
                }
            ],
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getWorkCode()
    },
    mounted(){
        var vm = this
        vm.initKey()
      
    },
    methods:{
        initCode(key){
            var vm = this
            var codingToEdit = key*2 -2
            return vm.codingToEdit.number.substr(codingToEdit,2)
        },
        initTitle(key){
            var vm = this
            var codingToEdit = key*2 -2
            var a1 = vm.codingToEdit.number.substr(0,2)
            var a2 = vm.codingToEdit.number.substr(2,2)
            var a3 = vm.codingToEdit.number.substr(4,2)
            switch(key){
                case 1:
                    return vm.levelNum[a1].title;
                break;
                  case 2:
                    return vm.levelNum[a1][a2].title;
                break;
                  case 3:
                    return vm.levelNum[a1][a2][a3].title;
                break;
            }
        },
        initKey(){
            var timer = setInterval(function(){
                if($('.zk-table__body-row').length >0){
                    clearInterval(timer)
                    for(var i=0;i<$('.zk-table__body-row').length;i++){
                        $('.zk-table__body-row')[i].getElementsByClassName('zk-table__body-cell')[0].getElementsByClassName('zk-table__cell-inner')[0].innerHTML = i+1
                    }
                }
            },100)
        },
        userClose(){
            var vm = this
            vm.addCode = false
        },
        PostaddUser(){

        },
        /**
         * 格式化来源
         * @param value
         * @returns {String}
         */
        formatterType(value) {
            if (value == 0) {
                return "行业标准";
            }else if (value == 1) {
                return "企业标准";
            } else {
                return "工程标准";
            }
        },
        /**
         * 格式化状态
         * @param value
         * @param row
         * @param index
         * @returns {String}
         */
             //编辑
        edit(num){
            console.log(num)
            var vm = this
            axios({
                method:'GET',
                url:'http://10.252.26.240:8080/h2-bim-project/config2/component/editWorkCode',
                headers:{
                    'token':vm.token
                },
                params:{
                    genieClassId:num.row.id,
                    tableNo: 't13'
                }
            }).then((response)=>{
                vm.codingToEdit = num.row
                vm.addCode = true
            }).catch((err)=>{
                console.log(err)
            })
        },
        //删除
        deleteItem(num){
            console.log(num)
        },
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
        handleNodeClick(data) {
            
            console.log(data);
        },
        //专业种类分类/作业工具分类编码信息
        getWorkCode(){
            var vm = this
             var setting = {
                data: {
                    key:{
                        name: "authName",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "number",
                        pIdKey: "parNumber",
                        rootPId: 0
                    }
                }
            };
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
                var arr = response.data.rt
                var levelNum = {}
                for(var i=0;i<arr.length;i++){
                    arr[i].type_ = vm.formatterType(arr[i].type)
                    arr[i].status_ = vm.formatterStatus(arr[i].id,arr[i])
                    //根据level截取number
                    switch(arr[i].level){
                        case 1:
                            levelNum[parseInt(arr[i].number.substr(0,2))]= {}
                            levelNum[parseInt(arr[i].number.substr(0,2))].title = arr[i].title
                        break;
                        case 2:
                                levelNum[parseInt(arr[i].number.substr(0,2))][parseInt(arr[i].number.substr(2,2))]= {}
                                levelNum[parseInt(arr[i].number.substr(0,2))][parseInt(arr[i].number.substr(2,2))].title = arr[i].title
                        break;
                        case 3:
                                levelNum[parseInt(arr[i].number.substr(0,2))][parseInt(arr[i].number.substr(2,2))][parseInt(arr[i].number.substr(4,2))]= {}
                                levelNum[parseInt(arr[i].number.substr(0,2))][parseInt(arr[i].number.substr(2,2))][parseInt(arr[i].number.substr(4,2))].title = arr[i].title
                        break;
                    }
                }
                console.log(levelNum)
                vm.levelNum = levelNum
                 var a = data.transformTozTreeFormat(setting, arr)
                vm.codingList = a
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
    .el-dialog__body{
        margin-top: 30px;
    }
    .editBodytwo{
    margin-top: 15px;
    }
    .editBodyone{
         margin-bottom: 25px;
    }
    .edit-item{
        position: relative;
        .editSelect{
            float: left;
            width: 436px;
            height: 40px;
            padding: 10px;
        }
        .editInpText{
            width: 100px;
            text-align: right;
            float: left;
            height: 40px;
            line-height: 40px;
        }
        .edit-item-biaoti{
            display: block;
            font-size: 12px;
            color: #999999;
            float: left;
            line-height: 12px;
            margin-left: 120px;
            margin-top: 5px;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .el-dialog{
        left: 50%;
        width: 586px!important;
        margin-left:-293px;
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
     .actionBtn{
        width: 16px;
        height: 16px;
        border: none;
        cursor: pointer;
    }
    .zk-table__cell-inner {
    padding: 6px 12px;
}   
    .editBtn{
        background: url('../../assets/edit.png') no-repeat;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
        margin-left: 20px;
    }
    .el-tree-node__content{
        height: auto;
        border-bottom: 1px solid #e0e0e0;
    }
    .el-tree-node{
 border-bottom:1px solid #e0e0e0;
    }
    .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover {
    background-color: #fff;
}
    .el-tree{
        border-left:1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }
     .editIcon{
        float: left;
        width: 17px;
        height: 17px;
        background: url('../../assets/edit.png')no-repeat 0 0;
        cursor: pointer;
        margin-right: 20px;
    }
    .deleteIcon{
        float: left;
        width: 17px;
        height: 17px;
        background: url('../../assets/delete.png')no-repeat 0 0;
        cursor: pointer;
    }
    .custom-tree-node{
        width: 100%;
        height: auto;
    }
    .el-tree-node__content{
        border-bottom: 1px solid #e0e0e0;
    }
    .item-code{
        float: right;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        font-size: 14px;
        color: #333333;
        border-right:  1px solid #e0e0e0;
    }
    .item-index{
        display: block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        position: absolute;
        left: 0;
        top: 0;
    }
    .el-tree-node{
        padding-left:50px!important; 
        // position: relative;
    }
    .el-tree-node__expand-icon.expanded{
        transform: rotate(0deg); 
    }
    .el-icon-caret-right::after{
        display: block;
        width: 15px;
        height: 14px;
        content: '';
        position: absolute;
        top: 0px;
        left: -3px;
        background: url('./images/folder.png')no-repeat 0 0;
    }
    .is-leaf::after{
        display: block;
        width: 15px;
        height: 14px;
        content: '';
        position: absolute;
        top: -2px;
        left: 4px;
        background: url('./images/file.png')no-repeat 0 0;
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