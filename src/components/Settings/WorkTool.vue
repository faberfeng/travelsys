<template>
  <div class="wrapper" >
      <div id="workT">
        <h4 class="title"><span>作业工具分类编码</span></h4>
        <div class="manageWorktool">
            <span class="worktooltitle">分类编码</span>
            <button class="btn" @click="addList"><i class="el-icon-plus"></i>添加</button>
            <div class="worktable">
                <zk-table 
                index-text="序号"
                :data="workToolData" :columns="columns" :tree-type="props.treeType"
                :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                :border="props.border" @row-click="RowClick">
                    <template slot="action" slot-scope="scope">
                        <button class="actionBtn tiqingBtn" title="提请"  v-if="scope.row.status == 0" @click="confirmBtn(scope)"></button>
                        <button class="passBtn actionBtn" title="通过"   v-if="scope.row.status == 1" @click="pass(scope)"></button>
                        <button class="backBtn actionBtn" title="退回"   v-if="scope.row.status == 1" @click="reject(scope)"></button>
                        <button class="editBtn actionBtn" title="修改" @click="editListBtn(scope)"   v-if="scope.row.status == 2 || scope.row.status == 0"></button>
                        <button class="deleteBtn actionBtn" title="删除" @click="deleteItem(scope)"   v-if="scope.row.status == 2 || scope.row.status == 0" ></button>
                    </template> 
                </zk-table>
            </div>
        </div>
        <div id="edit">
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
            <el-dialog title="编辑编码" :visible.sync="editListShowtwice" :before-close="editListCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                        <input class="editSelect" v-model="codeType" disabled/>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div v-if="showFirst" class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                        <input class="editSelect" v-model="firstTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+fTitle" :title="'标题：'+fTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="showTwo" class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                        <input class="editSelect" v-model="secondTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+twoTitle" :title="'标题：'+twoTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="showThird" class="editBodytwo edit-item clearfix">
                        <label class="editInpText">三级编码 :</label>
                        <input class="editSelect" v-model="thirdTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+thTitle" :title="'标题：'+thTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" disabled @change="newTitleCode" v-model="newCode"/></div>
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
                    <button class="editBtnS" @click="editListSureBtn">保存</button>
                    <button class="editBtnC" @click="editListCancelBtn">取消</button>
                </div>
            </el-dialog>
            <el-dialog class="confirm" :visible.sync="confirmVisible" :before-close="confirmClose">
                <span class="icon-confirm icon-request"></span>
                <span class="title-confirm">确认提请</span>
                <span class="text-confirm">确认提请本条分类编码？</span>
                <div  class="dialog-footer">
                    <button class="editBtnS" @click="deleteCode">确认</button>
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
                        width:'150px'
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
                arrList:[],//原始的数组
                deleteDialog:false,
                confirmVisible:false,
                deleteObject:{},//删除时获取的行数据
                editListShowtwice:false,
                editObject:{},//编辑时获得的行数据
                confirmObject:{},//提请时的行数据
                passVisible:false,
                surePassObject:{},
                rejectObject:{},
                rejectVisible:false,
                confirmVisibleTwo:false
            }

    },
    created(){
        this.projId = localStorage.getItem('projId');
        this.token  = localStorage.getItem('token');
        
        this.getWorkCode();
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
                    this.arrList = response.data.rt;
                    this.arrList.forEach((item,index)=>{
                        this.codeTypeData.push('Level'+item.level);
                    })
                    this.codeTypeData = Array.from(new Set(this.codeTypeData));
                    this.codeType = this.codeTypeData[0];//初始化编码级别
                    this.arrList.forEach((item,index,arr)=>{
                        arr[index].KeyID = index+1;
                        arr[index].type_ = this.formatterType(arr[index].type);
                        arr[index].status_ = this.formatterStatus(arr[index].status,arr[index]);
                    })
                    this.workToolData = data.transformTozTreeFormat(setting, this.arrList);

                    // console.log(this.arrList);
                    console.log(this.workToolData)
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
        editListBtn(scope){
            this.editObject=scope;
            console.log(scope);
            this.editListShowtwice = true;
            if(scope.row.level=='1'){
                this.codeType = 'Level'+scope.row.level;
                this.newCode = scope.row.number.substr(0,2);
                this.newTitle = scope.row.title;
                this.totalCode = scope.row.number;
                this.totalTitle = scope.row.title;
            }else if(scope.row.level=='2'){
                this.showFirst = true;
                this.codeType = 'Level'+scope.row.level;
                this.firstTitle = this.newCode = scope.row.number.substr(0,2);
                this.secondTitle = this.newCode = scope.row.number.substr(2,2);
                this.totalCode = scope.row.number;
                this.newTitle = scope.row.title;
                this.workToolData.forEach((item,index)=>{
                    if(this.firstTitle == item.number.substr(0,2)){
                        this.fTitle = item.title;
                        this.firstIndex = item.KeyID;
                    };
                })
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+scope.row.title;
            }else if(scope.row.level == '3'){
                this.showFirst = true;
                this.showTwo = true;

                this.codeType = 'Level'+scope.row.level;
                this.firstTitle = this.newCode = scope.row.number.substr(0,2);
                this.secondTitle = this.newCode = scope.row.number.substr(2,2);
                this.thirdTitle = this.newCode = scope.row.number.substr(4,2);
                this.totalCode = scope.row.number;
                this.newTitle = scope.row.title;
                this.workToolData.forEach((item,index)=>{
                    if(this.firstTitle == item.number.substr(0,2)){
                        this.fTitle = item.title;
                        this.firstIndex = item.KeyID;
                    };
                })
                this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                    if(this.secondTitle == item.number.substr(2,2)){
                        this.twoTitle = item.title;
                    }
                })
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+scope.row.title;
            }else if(scope.row.level == '4'){
                this.showFirst = true;
                this.showTwo = true;
                this.showThird = true;

                this.codeType = 'Level'+scope.row.level;
                this.firstTitle = this.newCode = scope.row.number.substr(0,2);
                this.secondTitle = this.newCode = scope.row.number.substr(2,2);
                this.thirdTitle = this.newCode = scope.row.number.substr(4,2);
                this.newCode = scope.row.number.substr(6,2);
                this.newTitle = scope.row.title;
                this.totalCode = scope.row.number;
                
                this.workToolData.forEach((item,index)=>{
                    if(this.firstTitle == item.number.substr(0,2)){
                        this.fTitle = item.title;
                        this.firstIndex = item.KeyID;
                    };
                })
                this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                    if(this.secondTitle == item.number.substr(2,2)){
                        this.twoTitle = item.title;
                    }
                })
                this.secondIndex = this.secondTitle.split('')[0];
                this.workToolData[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                    if(this.thirdTitle == item.number.substr(4,2)){
                        this.thTitle = item.title;
                    }
                });
                this.totalTitle = this.fTitle+'-'+this.twoTitle+'-'+this.thTitle+'-'+scope.row.title;
            }
        },
        //编辑确认按钮
        editListSureBtn(){
            console.log(this.editObject)
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.editObject.row.id,
                    number:this.editObject.row.number,
                    status:0,
                    table:'t17',
                    title:this.newTitle
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.editListShowtwice = false;
                    this.newTitle = '';
                    this.getWorkCode();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.push({
                        path:'/login'
                    })
                }
            })
        },
        //编辑取消按钮
        editListCancelBtn(){
            this.editListShowtwice = false;
        },
        //删除
        deleteItem(num){
            this.deleteDialog = true;
            this.deleteObject = num;
            console.log(num);
            
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/deleteWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.deleteObject.row.id,
                    number:this.deleteObject.row.number,
                    table:'t17'
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.deleteDialog = false;
                    this.getWorkCode();
                }else if (response.data.cd == '-1'){
                    alert('response.data.msg')
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }   
            })
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
                    table:'t17',
                    title:this.newTitle
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    console.log(response.data);
                    this.getWorkCode();
                    this.codeType = '';
                    this.firstTitle = '';
                    this.secondTitle = '';
                    this.totalCode = '';
                    this.totalTitle = '';
                    this.newCode = '';
                    this.newTitle = '';
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
        //编辑取消
        listClose(){
            this.editListShow = false;
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
            this.workToolData.forEach((item,index,arr)=>{ 
                this.firstTitleData.push(item.number.substr(0,2)); 
                this.fTitle = arr[0].title;  
            })
            //一级编码操作
            this.secondTitleData = [];
            this.firstTitle = this.firstTitleData[0];//初始化一级编码
            this.workToolData.forEach((item,index)=>{
                if(this.firstTitle == item.number.substr(0,2)){
                    this.fTitle = item.title;
                    this.firstIndex = item.KeyID;
                };
            })

            this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                this.secondTitleData.push(item.number.substr(2,2)); 
            })
            
        },
        //一级编码改变
        firstTitleChange(){
            this.totalCode  = '';
            this.secondTitleData = [];
            this.workToolData.forEach((item,index)=>{
                if(this.firstTitle == item.number.substr(0,2)){
                    this.fTitle = item.title;
                    this.firstIndex = item.KeyID;
                };
            })
            this.workToolData[this.firstIndex-1].children.forEach((item,index)=>{
                    this.secondTitleData.push(item.number.substr(2,2)); 
            });

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
            this.workToolData[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                this.thirdTitleData.push(item.number.substr(4,2));
            });

        },
        //三级编码改变
        thirdTitleChange(){
            this.totalCode  = '';
            this.workToolData[this.firstIndex-1].children[this.secondIndex-1].children.forEach((item,index)=>{
                if(this.thirdTitle == item.number.substr(4,2)){
                    this.thTitle = item.title;
                }
            });
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
        RowClick(row,rowIndex){
            //console.log(row);
            //console.log(rowIndex)
            //console.log(row.path[2].children[1].children[0].children[0].innerHTML);
            //console.log(rowIndex);
            //console.log($event)
            //console.log($('.zk-table__body-row')[1])
            //$('.zk-table__body-row')[rowIndex.length].style.background = '#ccc';
        },
        //提请按钮
        confirmBtn(scope){
            this.confirmObject = scope;
            
            var parentNum = scope.row.parNumber;
            var type = '';
            console.log(parentNum);
            if(parentNum){
                this.arrList.forEach((item,index,arr)=>{
                    if(item.number == parentNum){
                        console.log(item.type)
                        type = item.type;
                    }
                })
            }
            if(type == 2){
                this.confirmVisibleTwo = true;
            }else if(type == 0 || type ==1){
                this.confirmVisible = true;
            }
            
        },
        confirmCloseTwo(){
            this.confirmVisibleTwo=false;
        },
        //确认提请
        deleteCode(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.confirmObject.row.id,
                    number:this.confirmObject.row.number,
                    status:1,
                    table:'t17',
                    title:this.confirmObject.row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                   this.confirmVisible = false;
                    this.getWorkCode();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //取消提请
        confirmClose(){
            this.confirmVisible = false;
        },
        //通过
        pass(scope){
            this.passVisible =true;
            this.surePassObject = scope;
            
        },
        surePass(){
            axios({
                method:'post',
                url:this.baseUrl+'config2/component/updateWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.surePassObject.row.id,
                    number:this.surePassObject.row.number,
                    status:3,
                    table:'t17',
                    title:this.surePassObject.row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                   this.passVisible = false;
                    this.getWorkCode();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.push({
                        path:'/login'
                    })
                }
            })
        },
        cancelPass(){
            this.passVisible = false;
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
                url:this.baseUrl+'config2/component/updateWorkCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.rejectObject .row.id,
                    number:this.rejectObject .row.number,
                    status:2,
                    table:'t17',
                    title:this.rejectObject .row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                   this.rejectVisible = false;
                    this.getWorkCode();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.push({
                        path:'/login'
                    })
                }
            })
        },
        cancelReject(){
            this.rejectVisible = false;
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
        margin-left: 20px;
    }
    .deleteBtn{
        background: url('../../assets/delete.png') no-repeat;
        margin-left: 20px;
    }
    .tiqingBtn{
          background: url('./images/tiqing.png') no-repeat;
    }
    #edit .editSelect{
        width: 308px;
        height: 38px;
        background: #fafafa;
        border: 1px solid #d1d1d1;
    }
    /* 弹窗 */
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
    /* 删除弹框 */
    .deleteDialogImg{
        height: 50px;
    }
    .deleteDialogWarning{
        font-size: 18px;
        line-height: 18px;
        font-family: 'MicrosoftYahei';
        color: #fc3439;
        font-weight: bold;
        margin:20px 0 0 0;
    }
    .deleteDialogText{
        color: #333333;
        font-size: 14px;
        line-height: 14px;
        font-family: 'MicrosoftYahei';
        font-weight: normal;
        margin: 16px 0 0 0;
    }
</style>
<style lang='less'>
    #workT{
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
    .inp{
        position: relative;
        left: -15px;
    }

}
</style>
