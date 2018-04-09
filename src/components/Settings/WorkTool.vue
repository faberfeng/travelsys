<template>
  <div class="wrapper">
      <h4 class="title"><span>作业工具分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn" @click="addList"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            <zk-table 
             index-text="序号"
            :data="workToolData" :columns="columns" :tree-type="props.treeType"
            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
            :border="props.border">
                <template slot="action" slot-scope="scope">
                   <button class=""   v-if="scope.row.status == 0" @click="edit(scope)">提请</button>
                    <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">通过</button>
                     <button class=""   v-if="scope.row.status == 1" @click="edit(scope)">退回</button>
                   <button class="editBtn actionBtn" @click="edit(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                   <button class="deleteBtn actionBtn" @click="deleteItem(scope.rowIndex)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                </template> 
            </zk-table>
        </div>
    </div>
      <div id="edit">
        <el-dialog title="添加编码" :visible.sync="editListShow" :before-close="listClose">
            <div class="editBody">
                <div class="editBodyone"><label class="editInpText">编码级别 :</label>
                    <select  @change="codeTypeChange" class="editSelect" v-model="codeType" >
                        <option v-for="(item,index) in codeTypeData" :key="index">{{item}}</option>
                    </select>
                </div>
                <div v-if="showFirst" class="editBodytwo"><label class="editInpText">一级编码 :</label>
                    <select @change="firstTitleChange" class="editSelect" v-model="firstTitle">
                        <option v-for="(item,index) in firstTitleData" :key="index">{{item}}</option>
                    </select>
                    <label>标题:{{fTitle}}</label>
                </div>
                <div v-if="showTwo" class="editBodytwo"><label class="editInpText">二级编码 :</label>
                    <select @change="secondTitleChange"  v-model="secondTitle" class="editSelect">
                        <option v-for="(item,index) in secondTitleData" :key="index">{{item}}</option>
                    </select>
                    <label>标题:{{twoTitle}}</label>
                </div>
                <div v-if="showThird" class="editBodytwo">
                    <label class="editInpText">三级编码 :</label>
                    <select @change="thirdTitleChange"  v-model="thirdTitle" class="editSelect">
                        <option v-for="(item,index) in thirdTitleData" :key="index">{{item}}</option>
                    </select>
                    <label>标题:{{thTitle}}</label>
                </div>
                <div class="editBodytwo"><label class="editInpText">新建编码 :</label><input class="inp" placeholder="" v-model="newCode"/></div>
                <div class="editBodytwo"><label class="editInpText">新标题 :</label><input class="inp" placeholder="" v-model="newTitle"/></div>
                <div class="editBodytwo"><label class="editInpText">完整编码 :</label><input class="inp" placeholder="" v-model="totalCode"/></div>
                <div class="editBodytwo"><label class="editInpText">完整标题 :</label><input class="inp" placeholder="" v-model="totalTitle"/></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addListSure">保存</button>
                <button class="editBtnC" @click="listClose">取消</button>
            </div>
        </el-dialog>
  </div>
  </div>

</template>
<script>
import axios from 'axios';
import './js/jquery-1.4.4.min.js'
import data from './js/date.js'
export default {
  name:'WorkTool',
    data(){
            return {
                editListShow:false,
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
                token:'',
                projId:'',
                baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
                workToolData:[],
                codeType:'',//编码级别
                codeTypeData:[],
                firstTitle:'',//一级标题
                firstTitleData:[],
                secondTitle:'',//二级标题
                secondTitleData:[],
                thirdTitle:'',//三级标题
                thirdTitleData:[],
                newCode:'',//新建编码
                newTitle:'',//新标题
                levelData:[],//等级数组
                showFirst: false,
                showTwo:false,
                showThird:false,
                fTitle:'',
                twoTitle:'',
                thTitle:'',
                firstIndex:'',
                secondIndex:'',
                totalCode:'',//完整编码
                totalTitle:'',//完整标题
            }

    },
    created(){
        this.projId = localStorage.getItem('projId');
        this.token  = localStorage.getItem('token');
        this.getWorkCode();
    },
    mounted(){
        setTimeout(function(){
            //console.log($('.zk-table__body-row').length);
            var $allListElements = $('li');
            for(var i=0;i<$('.zk-table__body-row').length;i++){
                $('.zk-table__body-row')[i].getElementsByClassName('zk-table__body-cell')[0].getElementsByClassName('zk-table__cell-inner')[0].innerHTML = i+1;
            }
        },1000)
    },
    methods:{
        //专业工种分类/作业工具分类编码信息
        getWorkCode(){
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
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    tableNo:'t17'
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    var arrList = response.data.rt;
                    arrList.forEach((item,index)=>{
                        this.codeTypeData.push('Level'+item.level);
                    })
                    this.codeTypeData = Array.from(new Set(this.codeTypeData));
                    this.codeType = this.codeTypeData[0];//初始化编码级别
                    //console.log(this.codeTypeData)
                    arrList.forEach((item,index,arr)=>{
                        arr[index].KeyID = index+1;
                        arr[index].type_ = this.formatterType(arr[index].type);
                        arr[index].status_ = this.formatterStatus(arr[index].id,arr[index]);
                    })
                    this.workToolData = data.transformTozTreeFormat(setting, arrList);

                    console.log(this.workToolData);
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
        formatterType(value){
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
        //添加按钮
        addList(){
            this.editListShow = true;
        },
        //编辑确定
        addListSure(){
            axios({
                method:'post',
                url:this.baseUrl+'/config2/component/addWorkCode',
                headers:{
                    token:this.token
                },
                data:{
                    level:this.codeType.substr(5,1),
                    number:this.totalCode,
                    status:0,
                    table:'t17',
                    title:this.newTitle
                }
            }).then(response=>{
                console.log(response)
            })
            this.editListShow = false;
        },
        //编辑取消
        listClose(){
            this.editListShow = false;
        },
        //编码级别改变
        codeTypeChange(){
            this.firstTitleData = [];
            if(this.codeType == 'Level2'){
                this.showFirst = true;
                this.showTwo = false;
                this.showThird = false;
            }else if(this.codeType == 'Level3'){
                this.showFirst= true;
                this.showTwo = true;
                this.showThird = false;
            }else if(this.codeType == 'Level4'){
                this.showFirst= true;
                this.showTwo = true;
                this.showThird = true;
            }else{
                this.showFirst= false;
                this.showTwo = false;
                this.showThird = false;
            };
            this.workToolData.forEach((item,index,arr)=>{ 
                this.firstTitleData.push(item.number.substr(0,2)); 
                this.fTitle = arr[0].title;  
            })
            //一级编码操作
            this.firstTitle = this.firstTitleData[0];//初始化一级编码
            this.firstIndex = this.firstTitle.split('')[1];
            this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                this.secondTitleData.push(item.number.substr(2,2)); 
            })
            this.totalCode = this.firstTitle+this.newCode;
            this.totalTitle = this.fTitle+this.newTitle;
        },
        //一级编码改变
        firstTitleChange(){
            this.totalCode  = '';
            this.secondTitleData = [];
            this.workToolData.forEach((item,index)=>{
                if(this.firstTitle == item.number.substr(0,2)){
                    this.fTitle = item.title;
                }
            })
            this.firstIndex = this.firstTitle.split('')[1];
            this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                this.secondTitleData.push(item.number.substr(2,2)); 
            });
            this.totalCode = this.firstTitle+this.newCode;
            this.totalTitle = this.fTitle+this.newTitle;
        },
        //二级编码改变
        secondTitleChange(){
            this.totalCode  = '';
            this.thirdTitleData =[];

            this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                if(this.secondTitle == item.number.substr(2,2)){
                    this.twoTitle = item.title;
                }
            })

            this.secondIndex = this.secondTitle.split('')[0];
            var i =0;
            //console.log(this.firstIndex,this.secondIndex);
            this.workToolData[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                this.thirdTitleData.push(item.number.substr(4,2));
            });
            this.totalCode = this.firstTitle+this.secondTitle+this.newCode;
            this.totalTitle = this.fTitle+'-'+this.twoTitle+this.newTitle;
        },
        //三级编码改变
        thirdTitleChange(){
            this.totalCode  = '';
            this.workToolData[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                if(this.thirdTitle == item.number.substr(4,2)){
                    this.thTitle = item.title;
                }
            });
            this.totalCode = this.firstTitle+this.secondTitle+this.thirdTitle+this.newCode;
            this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+this.newTitle;
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
    #edit .editSelect{
        width: 308px;
        height: 38px;
        background: #fafafa;
        border: 1px solid #d1d1d1;
    }
</style>