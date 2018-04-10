<template>
  <div class="wrapper">
    <div id="constructorD"> 
        <h4 class="title"><span>结构设计分类编码</span></h4>
        <div class="manageWorktool" >
            <span class="worktooltitle">分类编码</span>
            <button class="btn" @click="addConstructor"><i class="el-icon-plus"></i>添加</button>
            <div class="worktable">
            <zk-table 
                index-text="序号"
                :data="constructorData" :columns="columns" :tree-type="props.treeType" 
                :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                :border="props.border" >
                    <template slot="appearence" slot-scope="scope">
                       <div v-html="scope.row.color_">

                       </div>
                       <!-- <p>{{scope.row.status}}<p> -->
                    </template>
                    <template slot="action" slot-scope="scope">
                        <div v-if="scope.row.status == 3">
                            <button class="actionBtn">材质设定</button>
                            <button class="actionBtn">扩展属性</button>
                            <button class="actionBtn">工程量映射</button>
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
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" @change="newCodeChange" v-model="newCode"/></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">新标题 :</label><input class="inp" placeholder="请输入" @change="newTitleChange" v-model="newTitle"/></div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整编码 :</label>
                        <span v-text="totalCode"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整标题 :</label>
                        <span v-text="totalTitle"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">材料索引 :</label>
                        <select class="editSelect" v-model="firstTitle">
                            <option v-for="(item,index) in firstTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div  class="editBodytwo edit-item clearfix"><label class="editInpText">材质索引 :</label>
                        <select class="editSelect" v-model="secondTitle">
                            <option v-for="(item,index) in firstTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div  class="editBodytwo edit-item clearfix"><label class="editInpText">材质索引 :</label>
                        <select class="editSelect" v-model="thirdTitle">
                            <option v-for="(item,index) in firstTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
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

export default {
    name:'ConstructorDesignCode',
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
                    label: '来源',
                    prop: 'source_',
                },
                {
                    label: '状态',
                    prop: 'status_',
                },
                {
                    label: '外观材质',
                    //prop:'color_',
                    type: 'template',
                    template: 'appearence',
                    minWidth:'150px'
                },
                {
                    label: '扩展属性',
                    prop: 'properties',
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
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/project2/',
            constructorData:[],
            confirmVisible:false,
            confirmVisibleTwo:false,
            rejectVisible:false,
            deleteDialog:false,
            passVisible:false,
            editListShowtwice:false,
            confirmObject:{},//提请行数据
            rejectObject:{},
            deleteObject:{},
            passObject:{},
            editObject:{},
            codeType:'',
            newCode:'',
            newTitle:'',
            totalCode:'',
            totalTitle:'',
            firstTitleData:['默认',"A2涂料-灰白127","A2涂料-灰白159","A2涂料-灰白191","A2涂料-灰白223","A2涂料-纯白","A2涂料-浅黄","A2涂料-米黄",
            "A2涂料-蛋黄","A2涂料-淡粉","A2涂料-中粉","A2涂料-深粉", "A2涂料-淡红","A2涂料-中红","A2涂料-深红","A2涂料-淡桔","A2涂料-桔黄",
            "A2涂料-淡绿","A2涂料-深绿","A2涂料-蓝紫","A2涂料-天蓝","A3油漆-红色","A3油漆-黄色","A3油漆-绿色","A3油漆-青色","A3油漆-蓝色",
            "A3油漆-洋红","A3油漆-白色","A3油漆-浅灰","A3油漆-银色","A3油漆-桔黄","A3油漆-黄绿","A3油漆-蓝绿","A3油漆-天蓝",
            "A3油漆-靛蓝","A3油漆-玫红","A3油漆-卡其","A3油漆-咖啡","A3油漆-灰白","A3油漆-深灰","A3油漆-黑色","B3室外玻璃-浅蓝","B3室外玻璃-深蓝",
            "B3室外玻璃-浅绿","B3室外玻璃-深绿","B3室外玻璃-浅灰","B3室外玻璃-深灰","B3室外玻璃-蓝色反射天空","B3室外玻璃-绿色反射天空","B3室外玻璃-灰色反射天空",
            "B3室外玻璃-不透明反射天空","U1001自定义","U1002自定义","U1003自定义","U1004自定义","U1005自定义","U1006自定义","U1007自定义","U1008自定义"],
            firstTitle:'',
            secondTitle:'',
            thirdTitle:''
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getProjectGenieClassByProject();

    },
    methods:{
        //获取分类编码树列表
        getProjectGenieClassByProject(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/getProjectGenieClassByProjId',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    tableName:'t31'
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.constructorData = response.data.rt;
                    this.diGuiStatus(this.constructorData);
                    this.diGuiSource(this.constructorData);
                    this.diGuiColor(this.constructorData);
                    console.log()
                    console.log(response.data);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
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
            console.log(this.confirmObject);
            axios({
                method:'post',
                url:this.baseUrl+'Config/updateGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    id:this.confirmObject.row.id,
                    level:this.confirmObject.row.level,
                    materialIndex:this.confirmObject.row.materialIndex,
                    number:this.confirmObject.row.number,
                    parNumber:this.confirmObject.row.number,
                    status:1,
                    table:'t31',
                    title:this.confirmObject.row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.confirmVisible = false;
                    this.getProjectGenieClassByProject();
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
        //编辑
        editList(scope){
            console.log(scope);
            this.firstTitle = this.firstTitleData[0];
            this.secondTitle = this.firstTitleData[0];
            this.thirdTitle = this.firstTitleData[0];
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
            this.firstTitle = scope.row.color_.split(':')[0];


            
            this.editListShowtwice = true;
        },
        //保存编辑
        editListSureBtn(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/updateGenieClass',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId
                },
                data:{
                    id:this.editObject.row.id,
                    level:this.editObject.row.level,
                    materialIndex:this.editObject.row.materialIndex,
                    number:this.editObject.row.number,
                    parNumber:this.editObject.row.number,
                    status:0,
                    title:this.editObject.row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.getProjectGenieClassByProject();
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
            this.editListShowtwice = false;
        },
        //删除
        deleteItem(scope){
            this.deleteObject = scope;
            this.deleteDialog = true;
        },
        //确认删除
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/deleteGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    genieClassId:this.deleteObject.row.id,
                    numbers:this.deleteObject.row.number
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.deleteDialog = false;
                    this.getProjectGenieClassByProject();
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
            console.log(scope)
            this.passObject = scope;
            this.passVisible =true;
        },
        //确认通过
        surePass(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/updateGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                },
                data:{
                    id:this.passObject.row.id,
                    level:this.passObject.row.level,
                    materialIndex:this.passObject.row.materialIndex,
                    number:this.passObject.row.number,
                    parNumber:this.passObject.row.number,
                    status:3,
                    table:'t31',
                    title:this.passObject.row.title,
                    type:this.passObject.row.type
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.passVisible =false;
                    this.getProjectGenieClassByProject();
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
                 url:this.baseUrl+'Config/updateGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    id:this.rejectObject.row.id,
                    level:this.rejectObject.row.level,
                    materialIndex:this.rejectObject.row.materialIndex,
                    number:this.rejectObject.row.number,
                    parNumber:this.rejectObject.row.number,
                    status:2,
                    table:'t31',
                    title:this.rejectObject.row.title
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.rejectVisible = false;
                    this.getProjectGenieClassByProject();
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
        //新建编码改变
        newCodeChange(){

        },
        //新建标题改变
        newTitleChange(){

        },
        //递归判断状态
        diGuiStatus(cData){
            cData.forEach((item,index,arr)=>{
                item.status_ = this.formatterStatus(item.status,item);
                if(item.children.length!=0){
                    this.diGuiStatus(item.children)
                }
            })
        },
        //递归判断来源
        diGuiSource(cData){
            cData.forEach((item,index,arr)=>{
                item.source_ = this.formatterType(item.type);
                if(item.children.length!=0){
                    this.diGuiSource(item.children)
                }
            })
        },
        //递归判断颜色
        diGuiColor(cData){
            var colorObject = '';
            cData.forEach((item,index,arr)=>{
                //datagrid-cell datagrid-cell-c2-materialIndex
                item.color_ = this.selectColor(item.materialIndex[0]);
                if(item.children.length!=0){
                    this.diGuiColor(item.children)
                }
            })
        },
        //判断来源
        formatterType(value) {
            if(value == 0){
                return "系统预置";
            }else if (value == 1) {
                return "企业标准";
            } else {
                return "工程标准";
            }
        },
        //判断状态
        formatterStatus(value, row, index) {
            if (row.type == 1) {
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
        //判断颜色
        selectColor(value) {
            var color = "";
            var text = "";
            switch (value) {
                case 12001:
                    color = "RGBA(127,127,127,255)";
                    text = "A2涂料-灰白127";
                    break;
                case 12002:
                    color = "RGBA(159,159,159,255)";
                    text = "A2涂料-灰白159";
                    break;
                case 12003:
                    color = "RGBA(191,191,191,255)";
                    text = "A2涂料-灰白191";
                    break;
                case 12004:
                    color = "RGBA(223,223,223,255)";
                    text = "A2涂料-灰白223";
                    break;
                case 12005:
                    color = "RGBA(255,255,255,255)";
                    text = "A2涂料-纯白";
                    break;
                case 12006:
                    color = "RGBA(255,255,191,255)";
                    text = "A2涂料-浅黄";
                    break;
                case 12007:
                    color = "RGBA(255,240,191,255)";
                    text = "A2涂料-米黄";
                    break;
                case 12008:
                    color = "RGBA(255,232,139,255)";
                    text = "A2涂料-蛋黄";
                    break;
                case 12009:
                    color = "RGBA(255,214,238,255)";
                    text = "A2涂料-淡粉";
                    break;
                case 12010:
                    color = "RGBA(255,152,201,255)";
                    text = "A2涂料-中粉";
                    break;
                case 12011:
                    color = "RGBA(255,62,160,255)";
                    text = "A2涂料-深粉";
                    break;
                case 12012:
                    color = "RGBA(255,105,105,255)";
                    text = "A2涂料-淡红";
                    break;
                case 12013:
                    color = "RGBA(255,62,62,255)";
                    text = "A2涂料-中红";
                    break;
                case 12014:
                    color = "RGBA(255,0,0,255)";
                    text = "A2涂料-深红";
                    break;
                case 12015:
                    color = "RGBA(255,186,116,255)";
                    text = "A2涂料-淡桔";
                    break;
                case 12016:
                    color = "RGBA(255,127,0,255)";
                    text = "A2涂料-桔黄";
                    break;
                case 12017:
                    color = "RGBA(99,255,99,255)";
                    text = "A2涂料-淡绿";
                    break;
                case 12018:
                    color = "RGBA(0,171,0,255)";
                    text = "A2涂料-深绿";
                    break;
                case 12019:
                    color = "RGBA(173,173,255,255)";
                    text = "A2涂料-蓝紫";
                    break;
                case 12020:
                    color = "RGBA(68,199,255,255)";
                    text = "A2涂料-天蓝";
                    break;

                case 13001:
                    color = "RGBA(255,0,0,255)";
                    text = "A3油漆-红色";
                    break;
                case 13002:
                    color = "RGBA(255,255,0,255)";
                    text = "A3油漆-黄色";
                    break;
                case 13003:
                    color = "RGBA(0,255,0,255)";
                    text = "A3油漆-绿色";
                    break;
                case 13004:
                    color = "RGBA(0,255,255,255)";
                    text = "A3油漆-青色";
                    break;
                case 13005:
                    color = "RGBA(0,0,255,255)";
                    text = "A3油漆-蓝色";
                    break;
                case 13006:
                    color = "RGBA(255,0,255,255)";
                    text = "A3油漆-洋红";
                    break;
                case 13007:
                    color = "RGBA(255,255,255,255)";
                    text = "A3油漆-白色";
                    break;
                case 13008:
                    color = "RGBA(167,167,167,255)";
                    text = "A3油漆-浅灰";
                    break;
                case 13009:
                    color = "RGBA(214,214,214,255)";
                    text = "A3油漆-银色";
                    break;
                case 13010:
                    color = "RGBA(255,128,0,255)";
                    text = "A3油漆-桔黄";
                    break;
                case 13011:
                    color = "RGBA(128,255,0,255)";
                    text = "A3油漆-黄绿";
                    break;
                case 13012:
                    color = "RGBA(0,255,128,255)";
                    text = "A3油漆-蓝绿";
                    break;
                case 13013:
                    color = "RGBA(0,128,255,255)";
                    text = "A3油漆-天蓝";
                    break;
                case 13014:
                    color = "RGBA(128,0,255,155)";
                    text = "A3油漆-靛蓝";
                    break;
                case 13015:
                    color = "RGBA(255,0,128,255)";
                    text = "A3油漆-玫红";
                    break;
                case 13016:
                    color = "RGBA(128,64,0,255)";
                    text = "A3油漆-卡其";
                    break;
                case 13017:
                    color = "RGBA(75,38,0,255)";
                    text = "A3油漆-咖啡";
                    break;
                case 13018:
                    color = "RGBA(91,91,91,255)";
                    text = "A3油漆-灰白";
                    break;
                case 13019:
                    color = "RGBA(63,63,63,255)";
                    text = "A3油漆-深灰";
                    break;
                case 13020:
                    color = "RGBA(0,0,0,255)";
                    text = "A3油漆-黑色";
                    break;

                case 23001:
                    color = "RGBA(127,191,255,40)";
                    text = "B3室外玻璃-浅蓝";
                    break;
                case 23002:
                    color = "RGBA(0,63,127,63)";
                    text = "B3室外玻璃-深蓝";
                    break;
                case 23003:
                    color = "RGBA(127,255,192,63)";
                    text = "B3室外玻璃-浅绿";
                    break;
                case 23004:
                    color = "RGBA(0,192,0,63)";
                    text = "B3室外玻璃-深绿";
                    break;
                case 23005:
                    color = "RGBA(75,75,75,128)";
                    text = "B3室外玻璃-浅灰";
                    break;
                case 23006:
                    color = "RGBA(54,54,54,128)";
                    text = "B3室外玻璃-深灰";
                    break;
                case 23007:
                    color = "RGBA(0,63,127,40)";
                    text = "B3室外玻璃-蓝色反射天空";
                    break;
                case 23008:
                    color = "RGBA(0,189,0,40)";
                    text = "B3室外玻璃-绿色反射天空";
                    break;
                case 23009:
                    color = "RGBA(56,56,56,40)";
                    text = "B3室外玻璃-灰色反射天空";
                    break;
                case 23010:
                    color = "RGBA(0,128,255,255)";
                    text = "B3室外玻璃-不透明反射天空";
                    break;//暂定天蓝色
                case 91001:
                    color = "RGBA(255,255,255,255)";
                    text = "U1001自定义";
                    break;
                case 91002:
                    color = "RGBA(255,255,255,255)";
                    text = "U1002自定义";
                    break;
                case 91003:
                    color = "RGBA(255,255,255,255)";
                    text = "U1003自定义";
                    break;
                case 91004:
                    color = "RGBA(255,255,255,255)";
                    text = "U1004自定义";
                    break;
                case 91005:
                    color = "RGBA(255,255,255,255)";
                    text = "U1005自定义";
                    break;
                case 91006:
                    color = "RGBA(255,255,255,255)";
                    text = "U1006自定义";
                    break;
                case 91007:
                    color = "RGBA(255,255,255,255)";
                    text = "U1007自定义";
                    break;
                case 91008:
                    color = "RGBA(255,255,255,255)";
                    text = "U1008自定义";
                    break;
                default:
                    color = "Black";
            }
            if(value == "10000"){
                return "";
            }else{
                //return text+':'+color;
                 return "<span padding:10px;'>" + text + "：</span><span  style='background-color:" + color + ";padding:10px;'> </span>";
            }
        },
        //添加设计结构
        addConstructor(){
            console.log(123);
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
</style>
<style lang='less'>
    #constructorD{
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
