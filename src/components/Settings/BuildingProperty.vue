<template>
    <div class="wrapper">
        <div id="buildProperty">
            <h4 class="title"><span>构建属性语意编码</span></h4>
            <div class="manageWorktool" >
                <span class="worktooltitle">分类编码</span>
                <span class="pTable">属性表:</span>
                <span class="inputSpan" style="display:inline-block;position:relative">
                    <select class="selectInp" v-model="propertyTable" @change="propertyTableChange">
                        <option value="t41">Table41-常规属性</option>
                        <option value="t42">Table42-呈现属性</option>
                        <option value="t43">Table43-设计属性</option>
                        <option value="t44">Table44-建造属性</option>
                    </select>
                    <i class="icon-sanjiaoone"></i>
                </span>
                
                <button class="btn" @click="addConstructor"><i class="el-icon-plus"></i>添加</button>
                <div class="worktable">
                    <zk-table 
                    index-text="序号"
                    :data="constructorData" :columns="columns" :tree-type="props.treeType" 
                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                    :border="props.border" >
                        <template slot="action" slot-scope="scope">
                            <div v-if="scope.row.status == 3">
                                <button class="actionBtn" >-</button>
                            </div>
                            <button class="actionBtn tiqingBtn"   v-if="scope.row.status == 0" @click="confirm(scope)"></button>
                            <button class="passBtn actionBtn" title="通过"   v-if="scope.row.status == 1" @click="pass(scope)"></button>
                            <button class="backBtn actionBtn" title="退回"   v-if="scope.row.status == 1" @click="reject(scope)"></button>
                            <button class="editBtn actionBtn" @click="editList(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                            <button class="deleteBtn actionBtn" @click="deleteItemProperty(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                        </template> 
                    </zk-table>
                </div>
            </div>
            <div id="edit">
                <el-dialog class="confirm" :visible.sync="confirmVisible" :before-close="confirmClose">
                    <span class="icon-confirm icon-request"></span>
                    <span class="title-confirm">确认提请</span>
                    <span class="text-confirm">确认提请本条分类编码？</span>
                    <div  class="dialog-footer">
                        <button class="editBtnS" @click="confirmSure">确认</button>
                        <button class="editBtnC" @click="confirmClose">取消</button>
                    </div>
                </el-dialog>
                <el-dialog class="confirm" :visible.sync="confirmVisibleTwo" :before-close="confirmCloseTwo">
                    <span class="icon-confirm icon-request"></span>
                    <span class="title-confirm">警告</span>
                    <span class="text-confirm">该编码的所有父编码必须为【已提请】状态，才能提请</span>
                    <div  class="dialog-footer">
                        <button class="editBtnS" @click="confirmVisibleTwo=false">确认</button>
                        <button class="editBtnC" @click="confirmCloseTwo">取消</button>
                    </div>
                </el-dialog>
                <el-dialog class="confirm" :visible.sync="passVisible" :before-close="cancelPass">
                    <span class="icon-confirm icon-request"></span>
                    <span class="title-confirm">确认通过</span>
                    <span class="text-confirm">确认通过本条分类编码的提请？<br/>
                        通过后编码和标题将无法再次修改</span>
                    <div  class="dialog-footer">
                        <button class="editBtnS" @click="surePass">确认</button>
                        <button class="editBtnC" @click="cancelPass">取消</button>
                    </div>
                </el-dialog>
                <el-dialog class="confirm" :visible.sync="rejectVisible" :before-close="cancelReject">
                    <span class="icon-confirm icon-request"></span>
                    <span class="title-confirm">确认退回</span>
                    <span class="text-confirm">确认退回本条分类编码的提请？</span>
                    <div  class="dialog-footer">
                        <button class="editBtnS" @click="sureReject">确认</button>
                        <button class="editBtnC" @click="cancelReject">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="修改编码" :visible.sync="editListShowtwice" :before-close="editListCancelBtn">
                    <div class="editBody">
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">属性表 :</label>
                            <input class="editSelect" v-model="propertyTableName" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                            <input class="editSelect" v-model="codeType" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div v-show="showFirst" class="editBodytwo edit-item clearfix cailiaoColor"><label class="editInpText">一级编码 :</label>
                            <input class="editSelect" v-model="firstTitle" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div v-show="showSecond"  class="editBodytwo edit-item clearfix cailiaoColor"><label class="editInpText">二级编码 :</label>
                            <input class="editSelect" v-model="secondTitle" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div v-show="showThird"  class="editBodytwo edit-item clearfix cailiaoColor"><label class="editInpText">三级编码 :</label>
                            <input class="editSelect" v-model="thirdTitle" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" disabled v-model="newCode"/></div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新标题 :</label><input class="inp" placeholder="请输入" @change="newTitleChange" v-model="newTitle"/></div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整编码 :</label>
                            <span v-text="totalCode" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整标题 :</label>
                            <span v-text="totalTitle" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">值类型 :</label>
                            <select class="editSelect" v-model="valueTypeTextT">
                                <option value="0">数值</option>
                                <option value="1">文本</option>
                                <option value="2">是否</option>
                                <option value="3">时间</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editListSureBtn">保存</button>
                        <button class="editBtnC" @click="editListCancelBtn">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="新增编码" :visible.sync="addListShow" :before-close="addListCancelBtn">
                    <div class="editBody">
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">属性表 :</label>
                            <select class="editSelect" v-model="propertyTable" @change="propertyTableChange">
                                <option value="t41">Table41-常规属性</option>
                                <option value="t42">Table42-呈现属性</option>
                                <option value="t43">Table43-设计属性</option>
                                <option value="t44">Table44-建造属性</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                            <select class="editSelect" v-model="codeType" @change="codeTypeChange">
                                <option>Level1</option>
                                <option>Level2</option>
                                <option>Level3</option>
                                <option>Level4</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div v-show="showO" class="editBodyone edit-item clearfix"><label class="editInpText">一级编码 :</label>
                            <select class="editSelect" v-model="firstTitleText" @change="firstTitleChange">
                                <option v-for="(item,index) in firstCodeData" :key="index">{{item}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                            <span v-text="'标题：'+fTitle" :title="'标题：'+fTitle" class="edit-item-biaoti"></span>
                        </div>
                        <div v-show="showT" class="editBodyone edit-item clearfix"><label class="editInpText">二级编码 :</label>
                            <select class="editSelect" v-model="secondTitleText" @change="secondTitleChange">
                                <option v-for="(item,index) in secondCodeData" :key="index">{{item}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                            <span v-text="'标题：'+sTitle" :title="'标题：'+sTitle" class="edit-item-biaoti"></span>
                        </div>
                        <div v-show="showS" class="editBodyone edit-item clearfix"><label class="editInpText">三级编码 :</label>
                            <select class="editSelect" v-model="thirdTitleText" @change="thirdTitleChange">
                                <option v-for="(item,index) in thirdCodeData" :key="index">{{item}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                            <span v-text="'标题：'+tTitle" :title="'标题：'+tTitle" class="edit-item-biaoti"></span>
                        </div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" :maxlength='maxInputLength' placeholder="请输入" @change="newCodeChange" v-model="newCode"/></div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新标题 :</label><input class="inp" placeholder="请输入" @change="newTitleChange" v-model="newTitle"/></div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整编码 :</label>
                            <span v-text="totalCode" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整标题 :</label>
                            <span v-text="totalTitle" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">值类型 :</label>
                            <select class="editSelect" v-model="valueTypeTextT">
                                <option value="0">数值</option>
                                <option value="1">文本</option>
                                <option value="2">是否</option>
                                <option value="3">时间</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addListSureBtn">保存</button>
                        <button class="editBtnC" @click="addListCancelBtn">取消</button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">确认删除本条分类编码？</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import './js/jquery-1.4.4.min.js';
export default {
  name:'BuildingProperty',
    data(){
        return {
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
                    width: '150px',
                },
                {
                    label: '标题',
                    prop: 'title',
                    minWidth: '50px',
                },
                {
                    label: '值类型',
                    prop:'valueTypeText',
                    minWidth:'150px'
                },
                {
                    label: '来源',
                    prop: 'source_',
                },
                {
                    label: '状态',
                    prop: 'status_',
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    width:'150px'
                }
            ],
            constructorData:[],
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
            confirmObject:{},
            passObject:{},
            delteProperty:{},
            propertyTable:'t41',
            confirmVisible:false,
            confirmVisibleTwo:false,
            passVisible:false,
            rejectVisible:false,
            deleteDialog:false,
            editListShowtwice:false,
            codeType:'',
            firstTitle:'',
            firstTitleData:[],
            secondTitle:'',
            thirdTitle:'',
            totalTitle:'',
            totalCode:'',
            newTitle:'',
            newCode:'',
            propertyTableName:'',
            valueTypeTextT:'',
            addListShow:false,
            showO:false,
            showT:false,
            showS:false,
            fTitle:'',
            sTitle:'',
            tTitle:'',
            secondCodeData:[],
            firstTitleText:'',
            secondTitleText:'',
            firstCodeData:[],
            thirdTitleText:'',
            thirdCodeData:[],
            maxInputLength:'2',
            showFirst:false,
            showSecond:false,
            showThird:false
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.propertyTable = 't41';
        this.getProjectGenClass(this.propertyTable);
    },
    mounted(){
        this.initKey();
    },
    methods:{
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
        //获得构件属性语意编码树列表
        getProjectGenClass(val){
            this.constructorData =[];
            axios({
                method:'get',
                url:this.baseUrl+'config2/component/getProjectGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    tableName:val,
                    type:1
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt){
                    this.constructorData = response.data.rt;
                       this.reJudgeValueType(this.constructorData);
                    }
                    console.log(response.data)
                }else if(response.data.cd =='-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //编辑
        editList(scope){
            console.log(scope)
            this.editObject = scope;
            this.propertyTableName = this.judgeType(this.propertyTable);
            this.codeType = 'Level'+scope.row.level;
            if(scope.row.level == 1){
                this.newCode = scope.row.number.substr(0,2);
                this.totalTitle = scope.row.title;
            }else if(scope.row.level == 2){
                this.newCode = scope.row.number.substr(2,2);
                this.constructorData.forEach((item,index)=>{
                    if(item.number==scope.row.parNumber){
                        this.totalTitle = item.title+'-'+scope.row.title;
                    }
                })
            }else if(scope.row.level == 3){
                this.newCode = scope.row.number.substr(4,2);
                this.constructorData.forEach((item,index)=>{
                    if(item.number.substr(0,2)==scope.row.parNumber.substr(0,2)){
                        this.totalTitle = item.title+'-';
                        item.children.forEach(item=>{
                            if(item.number == scope.row.parNumber){
                                this.totalTitle = this.totalTitle+item.title+'-'+scope.row.title;
                            }
                        })
                    }
                })
            }
            if(scope.row.level == '1'){
                this.showFirst = false;
                this.showSecond = false;
                this.showThird = false;
            }else if(scope.row.level == '2'){
                this.showFirst = true;
                this.showSecond = false;
                this.showThird = false;
                this.firstTitle = scope.row.number.substr(0,2);
            }else if(scope.row.level == '3'){
                this.showFirst = true;
                this.showSecond = true;
                this.showThird = false;
                this.firstTitle = scope.row.number.substr(0,2);
                this.secondTitle = scope.row.number.substr(2,2);
            }else if(scope.row.level == '4'){
                this.showFirst = true;
                this.showSecond = true;
                this.showThird = true;
                this.firstTitle = scope.row.number.substr(0,2);
                this.secondTitle = scope.row.number.substr(2,2);
                this.thirdTitle = scope.row.number.substr(4,2);
            }
            this.newTitle = scope.row.title;
            this.totalCode = scope.row.number;
            this.valueTypeTextT = scope.row.valueType;
            this.editListShowtwice = true;
        },
        //保存编辑
        editListSureBtn(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateAttributeCodeGenieClass',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId,
                    type:1
                },
                data:{
                    id:this.editObject.row.id,
                    number:this.editObject.row.number,
                    status:0,
                    table:'t41',
                    title:this.newTitle,
                    valueType:this.valueTypeTextT
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.getProjectGenClass(this.propertyTable);
                    this.totalTitle = '';
                    this.totalCode = '';
                    this.newCode = '';
                    this.newTitle = '';
                    this.codeType = '';
                    this.propertyTableName ="";
                    this.valueTypeTextT ="";
                    this.editListShowtwice = false;
                }else if(response.data.cd == '-1'){
                    console.log(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //取消编辑
        editListCancelBtn(){
            this.totalTitle = '';
            this.totalCode = '';
            this.newCode = '';
            this.newTitle = '';
            this.codeType = '';
            this.propertyTableName ="";
            this.valueTypeTextT = "";
            this.thirdTitle="";
            this.firstTitle = '';
            this.secondTitle = '';
            this.editListShowtwice = false;
        },
        newCodeChange(){
            if(this.codeType == "Level1"){
                this.totalCode = this.newCode+'0000';
            }else if(this.codeType == 'Level2'){
                this.totalCode = this.firstTitleText+this.newCode+'00';
            }else if(this.codeType == 'Level3'){
                this.totalCode = this.firstTitleText+this.secondTitleText+this.newCode;
            }else if(this.codeType == 'Level4'){
                this.totalCode = this.firstTitleText+this.secondTitleText+this.thirdTitleText+this.newCode;
            }
        },
        newTitleChange(){
            if(this.codeType == "Level1"){
                this.totalTitle = this.newTitle;
            }else if(this.codeType == 'Level2'){
                this.totalTitle = this.fTitle+'-'+ this.newTitle;
            }else if(this.codeType == 'Level3'){
                this.totalTitle = this.fTitle+'-'+this.sTitle+'-'+ this.newTitle;
            }else if(this.codeType == 'Level4'){
                this.totalTitle = this.fTitle+'-'+this.sTitle+'-'+this.tTitle+'-'+this.newTitle;
            }
        },
        //提请
        confirm(scope){
            this.confirmObject = scope;
            var parentNum = scope.row.parNumber;
            var status = '';
            if(parentNum){
                status = this.getParentNum(this.constructorData,parentNum);
            }
            if(status == 2){
                this.confirmVisibleTwo = true;
            }else if(status == 0 || status ==1){
                this.confirmVisible = true;
            }
        },
        //确认提请
        confirmSure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateAttributeCodeGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    type:1
                },
                data:{
                    id:this.confirmObject.row.id,
                    number:this.confirmObject.row.number,
                    status:1,
                    table:'t41',
                    title:this.confirmObject.row.title,
                    valueType:this.confirmObject.row.valueType,
                    regular:this.confirmObject.row.regular,
                    unit:this.confirmObject.row.unit
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.confirmVisible = false;
                    this.getProjectGenClass(this.propertyTable);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //取消提请
        confirmClose(){
            this.confirmVisible = false;
        },
        confirmCloseTwo(){
            this.confirmVisibleTwo =false;
        },
        //通过
        pass(scope){
            console.log(scope)
            this.passObject = scope;
            this.passVisible =true;
        },
        //确认通过
        surePass(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateAttributeCodeGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    type:1
                },
                data:{
                    id:this.passObject.row.id,
                    number:this.passObject.row.number,
                    status:3,
                    table:'t41',
                    title:this.passObject.row.title,
                    valueType:this.passObject.row.valueType,
                    regular:this.passObject.row.regular,
                    unit:this.passObject.row.unit
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.passVisible =false;
                    this.getProjectGenClass(this.propertyTable);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //取消通过
        cancelPass(){
            this.passVisible =false;
        },
        //退回
        reject(scope){
            this.rejectObject = scope;
            this.rejectVisible = true;
        },
        //确认退回
        sureReject(){
            axios({
                method:'post',
                 url:this.baseUrl+'config2/component/updateAttributeCodeGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    type:1
                },
                data:{
                    id:this.rejectObject.row.id,
                    number:this.rejectObject.row.number,
                    status:2,
                    table:'t41',
                    title:this.rejectObject.row.title,
                    valueType:this.rejectObject.row.valueType,
                    regular:this.rejectObject.row.regular,
                    unit:this.rejectObject.row.unit
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.rejectVisible = false;
                    this.getProjectGenClass(this.propertyTable);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //退回取消
        cancelReject(){
            this.rejectVisible = false;
        },
        //删除属性
        deleteItemProperty(scope){
            console.log(scope);
            this.delteProperty = scope;
            this.deleteDialog = true;
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/deleteAttributeCodeGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    genieClassId:this.delteProperty.row.id,
                    numbers:this.delteProperty.row.number,
                    id:this.delteProperty.row.id,
                    tableNo:'t41',
                    type:1
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    console.log(response.data)
                    this.getProjectGenClass(this.propertyTable);
                    this.deleteDialog = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //属性表改变
        propertyTableChange(){
            this.getProjectGenClass(this.propertyTable);
        },
        getParentNum(pData,pNum){
            var type = '';
            pData.forEach((item,index,arr)=>{
                if(item.number == pNum){
                    type = item.status;
                }else if(item.number != pNum && item.children.length!=0){
                    this.getParentNum(item.children,pNum);
                }
            })
            return type;
        },
        //判断属性表类型
        judgeType(value){
            switch(value){
                case 't41':
                    return 'Table41-常规属性';
                    break;
                case 't42':
                    return 'Table42-呈现属性';
                    break;
                case 't43':
                    return 'Table43-设计属性';
                    break; 
                case 't44':
                    return 'Table44-建造属性';
                    break; 
                default:
                    return;             
            }
        },
        //判断值类型
        judgeValueType(value){
            if (value == 0) {
                return "数值";
            } else if (value == 1) {
                return "文本";
            } else if (value == 2) {
                return "是否";
            } else if (value == 3) {
                return "时间";
            }
        },
        //格式化来源
       formatterType(value,type) {
            if (value == 0) {
                //var type = $("#type").val();
                if(type == 1){
                    return "系统预置";
                }else{
                    return "预置";
                }
            }else if (value == 1) {
                return "企业标准";
            } else {
                return "工程标准";
            }
        },
        //格式化状态
        formatterStatus(value, row, index) {
            if (value == 0) {
                return "未提请";
            } else if (value == 1) {
                return "已提请";
            } else if (value == 2) {
                return "已退回";
            } else {
                return "正常使用 ";
            }
        },
        //递归解析值类型
        reJudgeValueType(obj){
            obj.forEach(item=>{
                if(item.children.length != 0){
                    this.reJudgeValueType(item.children);
                }
                item.valueTypeText = this.judgeValueType(item.valueType);
                item.status_ = this.formatterStatus(item.status,item);
                item.source_ = this.formatterType(item.type,1);
            })
        },
        //添加编码
        addConstructor(){
            this.addListShow =true;
        },
        //确认添加
        addListSureBtn(){
            if(this.totalCode =='' || this.newTitle =='' || this.propertyTable =='' || this.valueTypeText ==''){
                alert('请确认表单是否填写正确');
            }else{
                if(this.newCode.split('').length != this.maxInputLength){
                    alert(`新建编码的长度必须是${this.maxInputLength}`);
                }else{
                    axios({
                        method:'post',
                        url:this.baseUrl+'config2/component/addAttributeCodeGenieClass',
                        headers:{
                            token:this.token
                        },
                        params:{
                            projId:this.projId,
                            type:1
                        },
                        data:{
                            level:this.codeType.substr(5,1),
                            number:this.totalCode,
                            status:0,
                            title:this.newTitle,
                            table:this.propertyTable,
                            valueType:this.valueTypeTextT,
                        }
                    }).then((response)=>{
                        if(response.data.cd == '0'){
                            this.getProjectGenClass(this.propertyTable);
                            this.showO = false;
                            this.showT = false;
                            this.codeType = '';
                            this.totalCode ='';
                            this.newTitle ='';
                            this.newCode ='';
                            this.totalTitle ='';
                            this.valueTypeTextT ='';
                            this.propertyTable ="";
                            this.addListShow = false;
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
            
        },
        //取消添加
        addListCancelBtn(){
            this.addListShow = false;
            this.showO = false;
            this.showT = false;
            this.codeType = '';
            this.totalCode ='';
            this.newTitle ='';
            this.newCode ='';
            this.totalTitle ='';
            this.valueTypeTextT ='';
            this.propertyTable ="";
        },
        //编码级别改变
        codeTypeChange(){
            this.firstCodeData =[];
            if(this.codeType == 'Level1'){
                this.showO = false;
                this.showT = false;
                this.showS = false;
                this.showF = false;
                this.maxInputLength = '2';
                this.newCode = '';
            }else if(this.codeType == 'Level2'){
                this.showO = true;
                this.showT = false;
                this.showS = false;
                this.showF = false;
                this.maxInputLength = '2';
                this.newCode = '';
            }else if (this.codeType == "Level3"){
                this.showO = true;
                this.showT = true;
                this.showS = false;
                this.maxInputLength = '2';
                this.newCode = '';
            }else if (this.codeType == "Level4"){
                this.showO = true;
                this.showT = true;
                this.showS = true;
                this.maxInputLength = '3';
                this.newCode = '';
            }
            this.constructorData.forEach(item=>{
                this.firstCodeData.push(item.number.substr(0,2));
            })
        },
        //一级标题改变
        firstTitleChange(){
            this.secondCodeData = [];
            var firstTitleDataObject = [];
            this.constructorData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                this.secondCodeData.push(item.number.substr(2,2));
            })
        },
        //二级标题改变
        secondTitleChange(){
            var firstTitleDataObject = {};
            var secondTitleDataObject = {};
            this.thirdCodeData = [];
            this.constructorData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    //this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                if(item.number.substr(2,2) == this.secondTitleText){
                    this.sTitle = item.title;
                    secondTitleDataObject = item.children;
                }
            });
            secondTitleDataObject.forEach(item=>{
                this.thirdCodeData.push(item.number.substr(4,2))
            })
        },
        //三级编码改变
        thirdTitleChange(){
            var firstTitleDataObject = {};
            var secondTitleDataObject = {};
            var thirdTitleDataObject ={};
            this.constructorData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                if(item.number.substr(2,2) == this.secondTitleText){
                    this.sTitle = item.title;
                    secondTitleDataObject = item.children;
                }
            });
            secondTitleDataObject.forEach(item=>{
                if(item.number.substr(4,2) == this.thirdTitleText){
                    this.tTitle = item.title;
                    thirdTitleDataObject = item.children;
                }
            })
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
        margin: 0 20px 20px 15px;
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
        margin-left: 20px;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
        margin-left: 20px;
    }
    .tiqingBtn{
        background: url('./images/tiqing.png') no-repeat;
    }
    .selectInp{
        height: 32px;
        width: 200px;
        border: 1px solid #d1d1d1;
        background: #fafafa;
        -webkit-appearance: none !important;
        -moz-appearance:textfield;
        padding-left: 10px;
        font-size: 12px;
        display: inline-block;
    }
    .pTable{
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        margin-left: 20px;
        width: 70px;
    }
    .inputSpan{
        display: inline-block;
        position: relative; 
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
</style>
<style lang='less'>
    #buildProperty{
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
            .editInpTextInp{
                line-height: 40px;
                color: #333;
                float: left;
                font-size: 14px;
                font-weight: normal;
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
            margin: 0 20px 20px 15px;
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
        .inp{
            position: relative;
            left: -15px;
        }
}
</style>