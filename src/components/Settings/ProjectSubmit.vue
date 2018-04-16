<template>
    <div class="wrapper">
        <div id="projectSubmit">
            <h4 class="title"><span>工程招标分类编码</span></h4>
            <div class="manageWorktool" >
                <span class="worktooltitle">分类编码</span>
                <button class="btn" @click="addConstructor"><i class="el-icon-plus"></i>添加</button>
                <div class="worktable">
                    <zk-table 
                    index-text="序号"
                    :data="projectSubmitData" :columns="columns" :tree-type="props.treeType" 
                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                    :border="props.border" >
                        <template slot="action" slot-scope="scope">
                            <div v-if="scope.row.level == 4">
                                <button class="actionBtn projectYingShe" title="构件映射"  @click="setMeterial(scope)"></button>
                                <button class="actionBtn expandProperty" title="编辑特性"  @click="eeditProperty(scope)"></button>
                            </div>
                            <button class="actionBtn tiqingBtn"   v-if="scope.row.status == 0" @click="confirm(scope)"></button>
                            <button class="passBtn actionBtn" title="通过"   v-if="scope.row.status == 1" @click="pass(scope)"></button>
                            <button class="backBtn actionBtn" title="退回"   v-if="scope.row.status == 1" @click="reject(scope)"></button>
                            <button class="editBtn actionBtn" @click="editList(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                            <button class="deleteBtn actionBtn" @click="deleteItem(scope)" v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                        </template> 
                    </zk-table>
                </div>
            </div>
            <div id="edit">
                <el-dialog title="编辑特性" :visible.sync="editPropertyShow" :before-close="peditPropertyCancel">
                    <div class="editBody">
                        <zk-table 
                        index-text="序号"
                        :data="propertyData" :columns="columnsProperty" :tree-type="props.treeType" 
                        :expand-type="props.expandType" :selection-type="props.selectionType" 
                        :border="props.border" >
                            <template slot="action" slot-scope="scope">
                                <button class="deleteBtn actionBtn" style="margin-right:10px" @click="deleteProperty(scope)"></button>
                            </template> 
                        </zk-table>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editPropertySure">新增</button>
                        <button class="editBtnC" @click="peditPropertyCancel">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="新增特性" :visible.sync="addPropertyShow" :before-close="addPropertyancelBtn">
                    <div class="editBody">
                        <div class="editBodytwo edit-item clearfix addPropertyClass"><label class="editInpText">特性 :</label><input class="inp"  placeholder="请输入" v-model="newProperty"/></div>
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">值类型 :</label>
                            <select class="editSelect" v-model="propertyValueType">
                                <option value="0">数值</option>
                                <option value="1">文本</option>
                                <option value="2">是否</option>
                                <option value="3">时间</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">默认值 :</label><input class="inp" placeholder="请输入"  v-model="defaultValue"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addPropertySureBtn">保存</button>
                        <button class="editBtnC" @click="addPropertyancelBtn">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="添加编码" :visible.sync="addCodeShow" :before-close="listClose">
                    <div class="editBody">
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                            <select  @change="codeTypeChange" class="editSelect" v-model="codeType" >
                                <option value="1">Level1</option>
                                <option value="2">Level2</option>
                                <option value="3">Level3</option>
                                <option value="4">Level4</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div v-if="showFirst" class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                            <select @change="firstTitleChange" class="editSelect" v-model="firstTitleText">
                                <option v-for="(item,index) in firstCodeData" :key="index">{{item}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                            <span v-text="'标题：'+fTitle" :title="'标题：'+fTitle" class="edit-item-biaoti"></span>
                        </div>
                        <div v-if="showTwo" class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                            <select @change="secondTitleChange"  v-model="secondTitleText" class="editSelect">
                                <option v-for="(item,index) in secondCodeData" :key="index">{{item}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                            <span v-text="'标题：'+twoTitle" :title="'标题：'+twoTitle" class="edit-item-biaoti"></span>
                        </div>
                        <div v-if="showThird" class="editBodytwo edit-item clearfix">
                            <label class="editInpText">三级编码 :</label>
                            <select @change="thirdTitleChange"  v-model="thirdTitleText" class="editSelect">
                                <option v-for="(item,index) in thirdCodeData" :key="index">{{item}}</option>
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
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">计量单位 :</label><input class="inp"  placeholder="请输入" v-model="jiliang"/></div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">规则注释 :</label><input class="inp" placeholder="请输入" v-model="guize"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addListSure">保存</button>
                        <button class="editBtnC" @click="listClose">取消</button>
                    </div>
                </el-dialog>
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
                <el-dialog class="confirm" :visible.sync="rejectVisible" :before-close="cancelReject">
                    <span class="icon-confirm icon-request"></span>
                    <span class="title-confirm">确认退回</span>
                    <span class="text-confirm">确认退回本条分类编码的提请？</span>
                    <div  class="dialog-footer">
                        <button class="editBtnS" @click="sureReject">确认</button>
                        <button class="editBtnC" @click="cancelReject">取消</button>
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
                <el-dialog title="修改编码" :visible.sync="editListShowtwice" :before-close="editListCancelBtn">
                    <div class="editBody">
                        <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                            <input class="editSelect" v-model="codeType" disabled/>
                            <i class="icon-sanjiao"></i>
                        </div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" v-model="newCode" disabled/></div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">新标题 :</label><input class="inp" placeholder="请输入" @change="newTitleChangeTwo" v-model="newTitle"/></div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整编码 :</label>
                            <span v-text="totalCode" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodytwo edit-item clearfix">
                            <label class="editInpText">完整标题 :</label>
                            <span v-text="totalTitle" class="editInpTextInp"></span>
                        </div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">计量单位 :</label><input class="inp"  placeholder="请输入" v-model="jiliang"/></div>
                        <div class="editBodytwo edit-item clearfix"><label class="editInpText">规则注释 :</label><input class="inp" placeholder="请输入" v-model="guize"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editListSureBtn">保存</button>
                        <button class="editBtnC" @click="editListCancelBtn">取消</button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定要删除特性【{{peojectProperty}}】？</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deletePropertySure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
            <el-dialog  :visible.sync="deletePropertyDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">确认删除本条编码？</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deletePropertyMakeSure">删除</button>
                    <button class="cancelBtn" @click="deletePropertyDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name:'ProjectSubmit',
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
                    width: '200px',
                },
                {
                    label: '标题',
                    prop: 'title',
                    minWidth: '50px',
                },
                {
                    label: '计量单位',
                    minWidth:'150px',
                    prop:'unit'
                },
                {
                    label: '规则注释',
                    prop: 'regular',
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
            columnsProperty:[
                {
                    label: '特性',
                    prop: 'characterName',
                },
                {
                    label: '值类型',
                    prop: 'valueTypeText',
                },
                {
                    label: '默认值',
                    prop: 'value',
                },
                {
                    llabel:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    width:'150px'
                },
            ],
            projectSubmitData:[],
            projId:'',
            token:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
            propertyData:[],
            editPropertyShow:false,
            deleteDialog:false,
            peojectProperty:'',
            deletePropertyObject:{},
            editPropertyObject:{},
            addPropertyShow:false,
            newProperty:'',
            defaultValue:'',
            propertyValueType:'',
            addCodeShow:false,//添加编码
            codeType:'',//编码级别
            codeTypeData:[],
            firstTitleText:'',//一级标题
            firstCodeData:[],
            secondTitleText:'',//二级标题
            secondCodeData:[],
            thirdTitleText:'',//三级标题
            thirdCodeData:[],
            newCode:'',//新建编码
            newTitle:'',//新标题
            totalCode:'',//完整编码
            totalTitle:'',//完整标题
            showFirst: false,
            showTwo:false,
            showThird:false,
            fTitle:'',
            twoTitle:'',
            thTitle:'',
            jiliang:'',
            guize:'',
            deleteObject:{},
            deletePropertyDialog:false,
            confirmObject:{},
            confirmVisible:false,
            confirmVisibleTwo:false,
            passVisible:false,
            passObject:{},
            rejectVisible:false,
            rejectObject:{},
            editObject:{},
            editListShowtwice:false,
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getProjectGenieClass();
    },
    methods:{
        //获得构件属性语意编码树
        getProjectGenieClass(){
            axios({
                method:'get',
                url:this.baseUrl+'config2/component/getProjectGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    tableName:'t32',
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.projectSubmitData = response.data.rt;
                    this.reJudgeValueType(this.projectSubmitData);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //递归解析值类型
        reJudgeValueType(obj){
            obj.forEach(item=>{
                if(item.children.length != 0){
                    this.reJudgeValueType(item.children);
                }
                item.status_ = this.formatterStatus(item.status,item);
                item.source_ = this.formatterType(item.type,2);
            })
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
        formatterValueType(value) {
            if (value == 0) {
                return "数值";
            } else if(value == 1){
                return "文本";
            } else if(value == 2){
                return "是否";
            } else if(value == 3){
                return "时间";
            }
        },
        formatterType(value,type) {
            if (value == 0) {
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
        //构件映射
        setMeterial(scope){

        },
        //编辑特性
        eeditProperty(scope){
            this.editPropertyObject = scope;
            this.editPropertyShow =true;
            this.getEditProperty(scope);
        },
        getEditProperty(val){
            axios({
                method:'get',
                url:this.baseUrl+'config2/component/getGenieclassCharacter/'+this.projId,
                headers:{
                    token:this.token
                },
                params:{
                    tableName:'t32',
                    number:val.row.number
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.propertyData= response.data.rt.rows;
                    this.propertyData.forEach(item=>{
                        item.valueTypeText = this.formatterValueType(item.valueType);
                    })
                }else if (response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        
        //取消编辑
        peditPropertyCancel(){
            this.editPropertyShow =false;
        },
        //删除特性
        deleteProperty(scope){
            this.deleteDialog = true;
            this.deletePropertyObject = scope;
            this.peojectProperty = scope.row.characterName;
        },
        //确认删除
        deletePropertySure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/removeCharacter',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    characterId:this.deletePropertyObject.row.id
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.getEditProperty(this.editPropertyObject);
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
        //新增
        editPropertySure(){
            this.addPropertyShow =true;
        },
        addPropertySureBtn(){
            if(this.propertyValueType == '' || this.newProperty == '' ||this.defaultValue ==''){
                alert('请确认表单的正确性');
            }else{
                axios({
                    method:'post',
                    url:this.baseUrl+'config2/component/updateCharacter',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        characterName:this.newProperty,
                        tableName:'t32',
                        valueType:this.propertyValueType,
                        value:this.defaultValue,
                        number:this.editPropertyObject.row.number
                    }
                }).then(response=>{
                    if(response.data.cd == '0'){
                        this.addPropertyShow =false;
                        this.propertyValueType ='';
                        this.newProperty = '';
                        this.defaultValue = '';
                        this.getEditProperty(this.editPropertyObject);
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        addPropertyancelBtn(){
            this.addPropertyShow =false;
            this.propertyValueType ='';
            this.newProperty = '';
            this.defaultValue = '';
        },
        //添加取消
        listClose(){
            this.codeType = '';
            this.firstTitleText = '';
            this.secondTitleText = '';
            this.thirdTitleText = '';
            this.totalCode = '';
            this.totalTitle = '';
            this.newCode = '';
            this.newTitle = '';
            this.addCodeShow = false;
            this.newTitle = '';
            this.jiliang = '';
        },
        //添加确定
        addListSure(){
            if(this.codeType == '' || this.totalCode == '' || this.guize == '' || this.newTitle=='' ||this.jiliang == ''){
                alert('请检查表单是否输入完整');
            }else{
                axios({
                    method:'post',
                    url:this.baseUrl+'config2/component/addAttributeCodeGenieClass',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        type:2
                    },
                    data:{
                        level:this.codeType,
                        number:this.totalCode,
                        regular:this.guize,
                        status:0,
                        table:'t32',
                        title:this.newTitle,
                        unit:this.jiliang
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.getProjectGenieClass();
                        this.codeType = '';
                        this.firstTitleText = '';
                        this.secondTitleText = '';
                        this.thirdTitleText = '';
                        this.totalCode = '';
                        this.totalTitle = '';
                        this.newCode = '';
                        this.newTitle = '';
                        this.addCodeShow = false;
                        this.newTitle = '';
                        this.jiliang = '';
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //新增编码
        addConstructor(){
            this.addCodeShow = true;
        },
         //编码级别改变
        codeTypeChange(){
           this.firstCodeData =[];
           if(this.codeType == '1'){
                this.showFirst = false;
                this.showTwo = false;
                this.showThird = false;
           }else if(this.codeType == '2'){
                this.showFirst = true;
                this.showTwo = false;
                this.showThird = false;
            }else if(this.codeType == '3'){
                this.showFirst = true;
                this.showTwo = true;
                this.showThird = false;
            }else if (this.codeType = "4"){
                this.showFirst = true;
                this.showTwo = true;
                this.showThird = true;
            }
            this.projectSubmitData.forEach(item=>{
                this.firstCodeData.push(item.number.substr(0,2));
            })
        },
        //一级编码改变
        firstTitleChange(){
            this.secondCodeData = [];
            var firstTitleDataObject = [];
            this.projectSubmitData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                this.secondCodeData.push(item.number.substr(2,2));
            })
        },
        //二级编码改变
        secondTitleChange(){
            this.thirdCodeData = [];
            var firstTitleDataObject = {};
            var twoTitleDataObject = {};
            this.projectSubmitData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                
                if(item.number.substr(2,2) == this.secondTitleText){
                    this.twoTitle = item.title;
                    twoTitleDataObject = item.children;
                }
            });
            twoTitleDataObject.forEach(item=>{
                this.thirdCodeData.push(item.number.substr(4,2));
            })
        },
        //三级编码改变
        thirdTitleChange(){
            var firstTitleDataObject = {};
            this.thirdCodeData = [];
            var twoTitleDataObject = {};
            this.projectSubmitData.forEach(item=>{
                if(item.number.substr(0,2) == this.firstTitleText){
                    firstTitleDataObject = item.children;
                    this.fTitle = item.title;
                }
            });
            firstTitleDataObject.forEach(item=>{
                if(item.number.substr(2,2) == this.secondTitleText){
                    this.twoTitle = item.title;
                    twoTitleDataObject = item.children;
                }
            })
            twoTitleDataObject.forEach(item=>{
                this.thirdCodeData.push(item.number.substr(4,2));
                if(item.number.substr(4,2) == this.thirdTitleText){
                    this.thTitle = item.title;
                }
            })
        },
        newTitleCode(){
            if(this.codeType == '1'){
                this.totalCode = this.newCode+'0000';
            }else if (this.codeType == '2'){
                this.totalCode = this.firstTitleText+this.newCode+'00';
            }else if(this.codeType == '3'){
                this.totalCode = this.firstTitleText+this.secondTitleText+this.newCode;
            }else if(this.codeType == '4'){
                this.totalCode = this.firstTitleText+this.secondTitleText+this.thirdTitleText+this.newCode;
            }
        },
        newTitleChange(){
            if(this.codeType == '1'){
                this.totalTitle = this.newTitle;
            }else if (this.codeType == '2'){
                this.totalTitle = this.fTitle+'-'+this.newTitle;
            }else if(this.codeType == '3'){
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.newTitle;
            }else if(this.codeType == '4'){
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+this.newTitle;
            }
        },
        //循环遍历数据
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
                    type:2
                },
                data:{
                    id:this.confirmObject.row.id,
                    number:this.confirmObject.row.number,
                    regular:this.confirmObject.row.regular,
                    status:1,
                    table:'t32',
                    title:this.confirmObject.row.title,
                    unit:this.confirmObject.row.unit,
                    valueType:this.confirmObject.row.valueType
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.confirmVisible = false;
                    this.getProjectGenieClass();
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
        //删除
        deleteItem(scope){
            this.deleteObject = scope;
            this.deletePropertyDialog = true;
        },
        //确认删除
        deletePropertyMakeSure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/deleteAttributeCodeGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    type:2,
                    genieClassId:this.deleteObject.row.id,
                    numbers:this.deleteObject.row.number,
                    tableNo:'t32'
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.deletePropertyDialog = false;
                    this.getProjectGenieClass();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //通过
        pass(scope){
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
                    type:2
                },
                data:{
                    id:this.passObject.row.id,
                    number:this.passObject.row.number,
                    regular:this.passObject.row.regular,
                    status:3,
                    table:'t32',
                    title:this.passObject.row.title,
                    unit:this.passObject.row.unit,
                    valueType:this.passObject.row.valueType
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.passVisible =false;
                    this.getProjectGenieClass();
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
                    type:2
                },
                data:{
                    id:this.rejectObject.row.id,
                    number:this.rejectObject.row.number,
                    regular:this.rejectObject.row.regular,
                    status:2,
                    table:'t32',
                    title:this.rejectObject.row.title,
                    unit:this.rejectObject.row.unit,
                    valueType:this.rejectObject.row.valueType
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.rejectVisible = false;
                    this.getProjectGenieClass();
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
        //编辑
        editList(scope){
            this.editObject = scope;
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
            this.newTitle = scope.row.title;
            this.totalCode = scope.row.number;
            this.jiliang = scope.row.unit;
            this.guize = scope.row.regular;
            this.editListShowtwice = true;
        },
        //保存编辑
        editListSureBtn(){
            if(this.guize == '' || this.jiliang == ''){
                alert('请确定输入表单的完整性');
            }else{
                axios({
                    method:'post',
                    url:this.baseUrl+'config2/component/updateAttributeCodeGenieClass',
                    headers:{
                        token:this.token,
                    },
                    params:{
                        projId:this.projId,
                        type:2
                    },
                    data:{
                        id:this.editObject.row.id,
                        number:this.editObject.row.number,
                        regular:this.guize,
                        status:1,
                        table:'t32',
                        title:this.editObject.row.title,
                        unit:this.jiliang
                    }
                }).then((response)=>{
                    if(response.data.cd == '0'){
                        this.getProjectGenieClass();
                        this.totalTitle = '';
                        this.totalCode = '';
                        this.newCode = '';
                        this.newTitle = '';
                        this.codeType = '';
                        this.jiliang = '';
                        this.guize = '';
                        this.editListShowtwice = false;
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //取消编辑
        editListCancelBtn(){
            this.totalTitle = '';
            this.totalCode = '';
            this.newCode = '';
            this.newTitle = '';
            this.codeType = '';
            this.jiliang = '';
            this.guize = '';
            this.editListShowtwice = false;
        },
        //编辑时新标题改变
        newTitleChangeTwo(){
            this.totalTitle = this.newTitle;
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
        .expandProperty{
            background: url('./images/expandProperty.png') no-repeat;
        }
        .projectYingShe{
            background: url('./images/projectYingShe.png') no-repeat;
        }
</style>
<style lang='less'>
    #projectSubmit{
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
        .addPropertyClass{
            margin-bottom: 15px;
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