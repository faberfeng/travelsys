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
                   <button class="TiqingBtn actionBtn" title="提请"  v-if="scope.row.status == 0" @click="request(scope)"></button>
                    <button class="passBtn actionBtn" title="通过"   v-if="scope.row.status == 1" @click="pass(scope)"></button>
                     <button class="backBtn actionBtn" title="退回"   v-if="scope.row.status == 1" @click="reject(scope)"></button>
                   <button class="editBtn actionBtn" title="修改"  @click="edit(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                   <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                </template> 
            </zk-table>
        </div>
    </div>
      
      <div id='edit'>
        <el-dialog title="添加编码" :visible.sync="editListShow" :before-close="listClose">
            <div class="editBody">
                <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                    <select  @change="codeTypeChange" class="editSelect" v-model="codeType" >
                        <option v-for="(item,index) in codeTypeData" :key="index">{{item}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div v-if="showFirst" class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                    <select @change="firstTitleChange" class="editSelect" v-model="firstTitle">
                        <option v-for="(item,index) in firstTitleData" :key="index">{{item}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                    <span v-text="'标题：'+fTitle" :title="'标题：'+fTitle" class="edit-item-biaoti"></span>
                </div>
                <div v-if="showTwo" class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                    <select @change="secondTitleChange"  v-model="secondTitle" class="editSelect">
                        <option v-for="(item,index) in secondTitleData" :key="index">{{item}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                    <span v-text="'标题：'+twoTitle" :title="'标题：'+twoTitle" class="edit-item-biaoti"></span>
                </div>
                <div v-if="showThird" class="editBodytwo edit-item clearfix">
                    <label class="editInpText">三级编码 :</label>
                    <select @change="thirdTitleChange"  v-model="thirdTitle" class="editSelect">
                        <option v-for="(item,index) in thirdTitleData" :key="index">{{item}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                    <span v-text="'标题：'+thTitle" :title="'标题：'+thTitle" class="edit-item-biaoti"></span>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" @change="newTitleCode" v-model="newCode"/></div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">新标题 :</label><input class="inp" placeholder="请输入" @change="newTitleChange" v-model="newTitle"/></div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">完整编码 :</label>
                    <span v-text="totalCode"></span>
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">完整标题 :</label>
                    <span v-text="totalTitle"></span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addListSure">保存</button>
                <button class="editBtnC" @click="listClose">取消</button>
            </div>
        </el-dialog>
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
                    <input class="inp" placeholder="请输入" :value="initCode(codingToEdit.level)"/>
                </div>
                <div class="editBodytwo edit-item clearfix">
                    <label class="editInpText">新标题 :</label>
                    <input class="inp" placeholder="请输入"   v-model="codingToEdit.title"/>
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
        <el-dialog class="confirm"
        :visible.sync="confirmVisible"
        :before-close="confirmClose">
            <span class="icon-confirm"></span>
            <span class="title-confirm">删除提醒</span>
            <span class="text-confirm">确认删除本条分类编码？<br>
            删除后将无法撤销。</span>
             <div  class="dialog-footer">
                <button class="editBtnS" @click="deleteCode">删除</button>
                <button class="editBtnC" @click="confirmClose">取消</button>
            </div>
        </el-dialog>
        <el-dialog class="confirm"
        :visible.sync="confirmVisible_1"
        :before-close="remindClose">
            <span class="icon-confirm icon-request"></span>
            <span class="title-confirm" v-text="confirm.title"></span>
            <span class="text-confirm" v-html="confirm.msg"></span>
             <div  class="dialog-footer">
                <button class="editBtnS" @click="deleteCode">删除</button>
                <button class="editBtnC" @click="remindClose">取消</button>
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
            addCode:false,
            confirmVisible:false,
            confirmVisible_1:false,
            props: {
                    stripe: true,
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
                    minWidth: '260px',
                },
                {
                    label: '标题',
                    prop: 'title',
                    width: '185px',
                },
                {
                    label: '来源',
                    prop: 'type_',
                    width: '205px',   
                },
                {
                    label: '状态',
                    prop: 'status_',
                    width: '115px',
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    minWidth:'125px'
                }
            ],
            deleteWorkCode:{},//打算删除的workcode
            confirm:{
                msg:'',
                title:''
            },
            originalData:[],//原始未树状化数据,
            codeType:'',//编码级别
            codeTypeData:[],
            firstTitle:'',//一级标题
            firstTitleData:[],
            secondTitle:'',//二级标题
            secondTitleData:[],
            thirdTitle:'',//三级标题
            thirdTitleData:[],
            showFirst: false,
            showTwo:false,
            showThird:false,
            newCode:'',//新建编码
            newTitle:'',//新标题
            levelData:[],//等级数组
            totalCode:'',//完整编码
            totalTitle:'',//完整标题
            fTitle:'',
            twoTitle:'',
            thTitle:'',
            firstIndex:'',
            secondIndex:'',
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
        request(rows){//提请 status为0时
        // var projectId = window.parent.BIM.Tool.getCurrentProjId();
        // var row = $('#treegrid').treegrid('find', id); // reload the all rows
        // var parRow = $('#treegrid').treegrid('getParent', id);
        // if(parRow!=null){
        //     if(parRow.status==0||parRow.status==2){
        //         $.messager.alert("警告", "该编码的所有父编码必须为【已提请】状态，才能提请", "warning");
        //         return;
        //     }
        //     var parRow2 = $('#treegrid').treegrid('getParent', parRow.id);
        //     if(parRow2!=null){
        //         if(parRow2.status==0||parRow2.status==2){
        //             $.messager.alert("警告", "该编码的所有父编码必须为【已提请】状态，才能提请", "warning");
        //             return;
        //         }
        //         var parRow3 = $('#treegrid').treegrid('getParent', parRow2.id);
        //         if(parRow3!=null){
        //             if(parRow3.status==0||parRow3.status==2){
        //                 $.messager.alert("警告", "该编码的所有父编码必须为【已提请】状态，才能提请", "warning");
        //                 return;
        //             }
        //         }
        //     }
        // }
            var vm = this
            vm.confirmVisible_1 = true
            vm.confirm.title = '确认提请'
            vm.confirm.msg = '确认提请本条分类编码？<br>处于提请状态时将无法删除。'
        },
        pass(rows){//通过 status为1时

        },
         reject(rows){//退回 status 为1时
             var vm = this
            vm.confirmVisible_1 = true
            vm.confirm.title = '确认退回'
            vm.confirm.msg = '确认退回本条分类编码的提请？'
            vm.deleteWorkCode = deepCopy(rows.row)
            vm.deleteWorkCode.status = 2 //退回状态
            vm.deleteWorkCode.table = "t13"
        },
        checkCode(){
            var vm = this
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/config2/component/updateWorkCode',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                },
                data:{
                    "id":vm.deleteWorkCode.id,
                    "number":vm.deleteWorkCode.number,
                    "title":vm.deleteWorkCode.title,
                    "status":vm.deleteWorkCode.status,
                    "table":"t13"
                }
            }).then((response)=>{
                if(response.data.cd != 0){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }else{
                     vm.$message({
                        type:'success',
                        message:'操作成功！'
                    })
                    vm.deleteWorkCode = {}
                    vm.confirmVisible_1 = false
                    vm.getWorkCode()//重新获取列表，重新初始化序号
                } 
            }).catch((err)=>{
                console.log(err)
            })
        },
        remindClose(){
            var vm = this
            vm.confirmVisible_1 = false
        },
        confirmClose(){
            var vm = this
            vm.confirmVisible = false
            vm.deleteWorkCode = {}
        },
        initCode(key){
            if(!key)return false;
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
        PostaddUser(){//保存修改
                var vm = this
                axios({
                    method:'POST',
                    url:'http://10.252.26.240:8080/h2-bim-project/config2/component/updateWorkCode',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projectId:vm.projId
                    },
                    data:vm.codingToEdit
                }).then((response)=>{
                    console.log(response)
                    vm.addCode =false
                    vm.getWorkCode()
                }).catch((err)=>{
                    console.log(err)
                })
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
            var vm = this
            vm.confirmVisible = true
            vm.deleteWorkCode = num.row
        },
        deleteCode(){
             var vm = this
            axios({
                method:'POST',
                url:'http://10.252.26.240:8080/h2-bim-project/config2/component/deleteWorkCode',
                headers:{
                    'token':vm.token
                },
                data:vm.deleteWorkCode,
                params:{
                    projectId:vm.projId,
                }
            }).then((response)=>{
                if(response.data.cd == 40001){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }else{
                     vm.$message({
                        type:'success',
                        message:response.data.msg
                    })
                vm.deleteWorkCode = {}
                vm.confirmVisible = false
                } 
            }).catch((err)=>{
                console.log(err)
            })
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
                    projectId:this.projId,
                    tableNo:'t13'
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                var arr = response.data.rt
                var levelNum = {}
                for(var i=0;i<arr.length;i++){
                    vm.codeTypeData.push('Level'+arr[i].level);
                    arr[i].KeyID = i+1;
                    arr[i].type_ = vm.formatterType(arr[i].type)
                    arr[i].status_ = vm.formatterStatus(arr[i].status,arr[i])
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

                /*
                从文的添加的代码
                */
                vm.codeTypeData = Array.from(new Set(vm.codeTypeData));
                vm.codeType = vm.codeTypeData[0];//初始化编码级别
                vm.initKey()
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
        },
        newCodeChange(){

        },
          //编码级别改变
        codeTypeChange(){
            this.firstTitleData = [];
            this.totalCode = '';
            this.totalTitle = '';
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
            this.codingList.forEach((item,index,arr)=>{ 
                this.firstTitleData.push(item.number.substr(0,2)); 
                this.fTitle = arr[0].title;  
            })
            //一级编码操作
            this.secondTitleData = [];
            this.firstTitle = this.firstTitleData[0];//初始化一级编码
            this.codingList.forEach((item,index)=>{
                if(this.firstTitle == item.number.substr(0,2)){
                    this.fTitle = item.title
                    this.firstIndex = item.KeyID
                }
            })

            this.codingList[this.firstIndex-1].children.forEach((item,index)=>{
                this.secondTitleData.push(item.number.substr(2,2)); 
            })
            
        },
        //一级编码改变
        firstTitleChange(){
            this.totalCode  = '';
            this.secondTitleData = [];
            this.codingList.forEach((item,index)=>{
                if(this.firstTitle == item.number.substr(0,2)){
                    this.fTitle = item.title;
                    this.firstIndex = item.KeyID;
                };
            })
            console.log(this.firstIndex-1)
            this.codingList[this.firstIndex-1].children.forEach((item,index)=>{
                    this.secondTitleData.push(item.number.substr(2,2)); 
            });

        },
        //二级编码改变
        secondTitleChange(){
            this.totalCode  = '';
            this.thirdTitleData =[];

            this.codingList[this.firstIndex-1].children.forEach((item,index)=>{
                if(this.secondTitle == item.number.substr(2,2)){
                    this.twoTitle = item.title;
                }
            })

            this.secondIndex = this.secondTitle.split('')[0];
            var i =0;
            this.codingList[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                this.thirdTitleData.push(item.number.substr(4,2));
            });

        },
        //三级编码改变
        thirdTitleChange(){
            this.totalCode  = '';
            this.codingList[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                if(this.thirdTitle == item.number.substr(4,2)){
                    this.thTitle = item.title;
                }
            });
        },
        newTitleChange(){
            if(this.codeType == 'Level1'){
                this.totalCode = this.newCode+'0000';
                this.totalTitle = this.newTitle;
            }else if (this.codeType == 'Level2'){
                this.totalCode = this.firstTitle+this.newCode+'00';
                this.totalTitle = this.fTitle+'-'+this.newTitle;
            }else if(this.codeType == 'Level3'){
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.newTitle;
                this.totalCode = this.firstTitle+this.secondTitle+this.newCode;
            }else if(this.codeType == 'Level4'){
                this.totalCode = this.firstTitle+this.secondTitle+this.thirdTitle+this.newCode;
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+this.newTitle;
            }
        },
         //添加确定
        addListSure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/addWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    level:this.codeType.substr(5,1),
                    number:this.totalCode,
                    status:0,
                    table:"t13",
                    title:this.newTitle
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    console.log(response.data);
                    this.getWorkCode();
                    this.editListShow = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.push({
                        path:'/login'
                    })
                }
            })
        },
         newTitleCode(){
            if(this.codeType == 'Level1'){
                this.totalCode = this.newCode+'0000';
                this.totalTitle = this.newTitle;
            }else if (this.codeType == 'Level2'){
                this.totalCode = this.firstTitle+this.newCode+'00';
                this.totalTitle = this.fTitle+'-'+this.newTitle;
            }else if(this.codeType == 'Level3'){
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.newTitle;
                this.totalCode = this.firstTitle+this.secondTitle+this.newCode;
            }else if(this.codeType == 'Level4'){
                this.totalCode = this.firstTitle+this.secondTitle+this.thirdTitle+this.newCode;
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+this.newTitle;
            }
        },
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
    .inp {
        position: relative;
        left: -15px;
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
        margin-right: 16px;
    }
    .zk-table__cell-inner {
    padding: 6px 12px;
}   
    .editBtn{
        background: url('../../assets/edit.png') no-repeat;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
    }
    .TiqingBtn{
          background: url('./images/tiqing.png') no-repeat;
    }
    .passBtn{
        background: url('./images/pass.png') no-repeat;
    }
     .backBtn{
        background: url('./images/back.png') no-repeat;
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
    .confirm{
        .el-dialog{
            width: 398px!important;
            margin-left: -199px;
            border-radius: 4px;
        }
         .el-dialog__header{
            height: 40px; 
            padding: 0; 
            border-bottom: none; 
            text-align: left; 
        }
        .el-dialog__body{
            margin-top: 0;
            padding-bottom:33px; 
        }
        .icon-confirm{
            display: block;
            width: 50px;
            margin: 0 auto;
            height: 50px;
            background:url('./images/remind.png') no-repeat 0 0; 
        }
        .title-confirm{
            margin: 20px 0 15px;
            color: #fc3439;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            display: block;
        }
        .icon-request{
             background:url('./images/prompt.png') no-repeat 0 0; 
        }
        .text-confirm{
            display: block;
            font-size: 14px;
            text-align: center;
            color: #333333;
            line-height: 16px;
            margin-bottom: 30px;
        }
        .dialog-footer{
            button{
                border-radius: 2px;
            }
        }
    }
}
</style>