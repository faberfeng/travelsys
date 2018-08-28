<template>
    <div id="wrapper">
        <h4 class="title">物资采购分类编码</h4>
        <div class="manageWorktool">
            <span class="worktooltitle">分类编码</span>
            <button class="btn" @click="addList"><i class="el-icon-plus"></i>新建</button>
            <div class="worktable">
                <zk-table 
                index-text="序号"
                :data="goodsData" :columns="columns" :tree-type="props.treeType"
                :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                :border="props.border" empty-text="正在加载...">
                    <template slot="action" slot-scope="scope">
                        <div v-if="scope.row.status == 0">
                            <button class="TiqingBtn actionBtn" title="提请"   @click="confirmBtn(scope)"></button>
                            <button class="editBtn actionBtn" title="编辑"  @click="editListBtn(scope)"></button>
                            <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(scope)"></button>
                        </div>
                        <div v-else-if="scope.row.status==1">
                            <button class="passBtn actionBtn" title="通过" @click="pass(scope)"></button>
                            <button class="backBtn actionBtn" title="退回" @click="reject(scope)"></button>
                        </div>
                        <div v-else-if="scope.row.status==2">
                            <button class="editBtn actionBtn" title="编辑"  @click="editListBtn(scope)"></button>
                            <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(scope)"></button>
                        </div>
                        <div v-else>
                            <div v-if="scope.row.children && scope.row.children.length > 0">
                            </div>
                            <div v-else>
                                <button class="actionBtn goujianyingshe" title="构件量编码" @click="unicodeGoujian(scope)"></button>
                            </div>
                        </div>
                    </template> 
                </zk-table>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="添加编码" :visible.sync="addListData.editListShow" :before-close="listClose">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                        <select class="editSelect" v-model="addListData.codeType" >
                            <option v-for="(item,index) in addListData.codeTypeData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div v-if="addListData.showFirst" class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                        <select class="editSelect" v-model="addListData.firstTitle">
                            <option v-for="(item,index) in addListData.firstTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.fTitle" :title="'标题：'+addListData.fTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="addListData.showTwo" class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                        <select  v-model="addListData.secondTitle" class="editSelect">
                            <option v-for="(item,index) in addListData.secondTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.twoTitle" :title="'标题：'+addListData.twoTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="addListData.showThird" class="editBodytwo edit-item clearfix">
                        <label class="editInpText">三级编码 :</label>
                        <select v-model="addListData.thirdTitle" class="editSelect">
                            <option v-for="(item,index) in addListData.thirdTitleData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.thTitle" :title="'标题：'+addListData.thTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText"><i class="redDot"></i>新建编码 :</label><input class="inp" maxlength='2' placeholder="请输入" @change="newTitleCode" v-model="addListData.newCode" /></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText"><i class="redDot"></i>新标题 :</label><input class="inp" placeholder="请输入"  @change="newTitleChange" v-model="addListData.newTitle"/></div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">计量单位 :</label>
                        <select v-model="addListData.caulate" class="editSelect">
                            <option value="1">个</option>
                            <option value="2">米</option>
                            <option value="3">平方米</option>
                            <option value="4">立方米</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整编码 :</label>
                        <span v-text="addListData.totalCode" class="totalCodeClass"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整标题 :</label>
                        <span v-text="addListData.totalTitle" class="totalCodeClass"></span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addListSure">保存</button>
                    <button class="editBtnC" @click="listClose">取消</button>
                </div>
            </el-dialog>
            <el-dialog class="confirm" :visible.sync="confirmVisible" :before-close="confirmClose">
                <span class="icon-confirm icon-request"></span>
                <span class="title-confirm">确认提请</span>
                <span class="deleteDialogText">确认提请本条分类编码？</span>
                <span class="text-confirm">处于提请状态时将无法删除。</span>
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
            <el-dialog title="编辑编码" :visible.sync="editListShowtwice" :before-close="editListCancelBtn">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix"><label class="editInpText">编码级别 :</label>
                        <input class="editSelect" v-model="addListData.codeType" disabled/>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div v-if="addListData.showFirst" class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                        <input class="editSelect" v-model="addListData.firstTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.fTitle" :title="'标题：'+addListData.fTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="addListData.showTwo" class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                        <input class="editSelect" v-model="addListData.secondTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.twoTitle" :title="'标题：'+addListData.twoTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div v-if="addListData.showThird" class="editBodytwo edit-item clearfix">
                        <label class="editInpText">三级编码 :</label>
                        <input class="editSelect" v-model="addListData.thirdTitle" disabled/>
                        <i class="icon-sanjiao"></i>
                        <span v-text="'标题：'+addListData.thTitle" :title="'标题：'+addListData.thTitle" class="edit-item-biaoti"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>新建编码 :</label>
                        <input class="inp" maxlength='2' placeholder="请输入" disabled v-model="addListData.newCode"/>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText"><i class="redDot"></i>新标题 :</label>
                        <input class="inp" placeholder="请输入" @change="newTitleChange" v-model="addListData.newTitle"/>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">计量单位 :</label>
                        <select v-model="addListData.caulate" class="editSelect">
                            <option value="1">个</option>
                            <option value="2">米</option>
                            <option value="3">平方米</option>
                            <option value="4">立方米</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整编码 :</label>
                        <span v-text="addListData.totalCode" class="totalCodeClass"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整标题 :</label>
                        <span v-text="addListData.totalTitle" class="totalCodeClass"></span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editListSureBtn">保存</button>
                    <button class="editBtnC" @click="editListCancelBtn">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="编辑构建量映射" :visible.sync="editGoujianShow" :before-close="editGoujianShowClose">
                <div class="editBody">
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">一级编码 :</label>
                        <select v-model="editoneData" class="editSelect">
                            <option v-for="(item,index) in editoneDataArray" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div  class="editBodytwo edit-item clearfix"><label class="editInpText">二级编码 :</label>
                        <select  v-model="edittwoData" class="editSelect">
                            <option v-for="(item,index) in edittwoDataArray" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">三级编码 :</label>
                        <select v-model="editthreeData" class="editSelect">
                            <option v-for="(item,index) in editthreeDataArray" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">编码映射 :</label>
                        <span v-text="encodeYingshe" class="totalCodeClass"></span>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">完整标题 :</label>
                        <span v-text="totalAllTitle" class="totalCodeClass"></span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editGoujianShowSure">保存</button>
                    <button class="editBtnC" @click="editGoujianShowClose">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">确认删除本条分类编码？</p>
                <p class="deleteDialogText">删除后将无法撤销。</p>
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
import dataJs from './js/date.js'
export default {
    name:'MaterialPurchase',
    data(){
        return {
            token:'',
            projId:'',
            BDMSurl:this.$store.state.BDMSUrl,
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
                        prop: '_unit',
                    },
                    {
                        label: '构件量映射',
                        prop: 'componentMap',
                    },
                    {
                        label: '来源',
                        prop: '_source',
                    },
                    {
                        label: '状态',
                        prop: '_state',
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
                goodsData:[],
                addListData:{
                    codeTypeData:['Level1','Level2','Level3','Level4'],//编码级别
                    editListShow:false,
                    codeType:'',
                    showFirst:false,
                    firstTitleData:[],
                    firstTitle:'',
                    fTitle:'',
                    showTwo:false,
                    secondTitle:'',
                    secondTitleData:[],
                    twoTitle:'',
                    showThird:false,
                    thirdTitle:'',
                    thirdTitleData:[],
                    thTitle:'',
                    newCode:'',
                    newTitle:'',
                    totalCode:'',
                    totalTitle:'',
                    caulate:'1',
                    secondIndex:'',
                    firstIndex:'',
                },
                firstData:[],
                secondData:[],
                thirdData:[],
                confirmVisible:false,
                confirmVisibleTwo:false,
                arrList:[],
                confirmObject:{},
                deleteDialog:false,
                deleteObject:{},
                passVisible:false,
                surePassObject:{},
                rejectVisible:false,
                rejectObject:{},
                editListShowtwice:false,
                editObject:{},
                editGoujianShow:false,
                editoneData:'',
                edittwoData:'',
                editthreeData:'',
                editoneDataArray:[],
                edittwoDataArray:[],
                editthreeDataArray:[],
                unicodeResponseData:[],
                encodeYingshe:'',//编码映射
                totalAllTitle:'',//完整标题
                unicodeData:{}
                
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getMaterialPurchase();
    },
    watch:{
        'addListData.codeType':function(val,oldVal){
            if(val == 'Level1'){
                this.addListData.showFirst = false;
                this.addListData.showTwo = false;
                this.addListData.showThird = false;
            }else if(val == 'Level2'){
                this.addListData.showFirst = true;
                this.addListData.showTwo = false;
                this.addListData.showThird = false;
            }else if(val == 'Level3'){
                this.addListData.showFirst = true;
                this.addListData.showTwo = true;
                this.addListData.showThird = false;
            }else if(val == 'Level4'){
                this.addListData.showFirst = true;
                this.addListData.showTwo = true;
                this.addListData.showThird = true;
            }
        },
        'addListData.firstTitle':function(val){
            this.addListData.secondTitleData =[];
            this.addListData.secondTitle ='';
            this.firstData.forEach(item=>{
                if(item.number.substr(0,2) == val){
                    this.addListData.fTitle = item.title;
                }
            });
            this.secondData.forEach(item=>{
                if(item.parNumber.substr(0,2) == val){
                    this.addListData.secondTitleData.push(item.number.substr(2,2));
                }
            });
            this.addListData.secondTitle = this.addListData.secondTitleData[0];
        },
        'addListData.secondTitle':function(val){
            this.addListData.thirdTitleData = [];
            this.addListData.thirdTitle = '';
            this.secondData.forEach(item=>{
                if(item.number.substr(2,2) == val && item.parNumber.substr(0,2)==this.addListData.firstTitle){
                    this.addListData.twoTitle = item.title;
                }
            });
            this.thirdData.forEach(item=>{
                if(item.number.substr(2,2) == val && item.parNumber.substr(2,2)==this.addListData.secondTitle && item.parNumber.substr(0,2)==this.addListData.firstTitle){
                    this.addListData.thirdTitleData.push(item.number.substr(4,2));
                }
            });
            this.addListData.thirdTitle = this.addListData.thirdTitleData[0];
        },
        'addListData.thirdTitle':function(val){
            this.addListData.thTitle = '';
            this.thirdData.forEach(item=>{
                if(item.number.substr(4,2) == val && item.parNumber.substr(2,2)==this.addListData.secondTitle && item.parNumber.substr(0,2)==this.addListData.firstTitle){
                    this.addListData.thTitle = item.title;
                }
            });
        },
        'editoneData':function(val,oldVal){
            let num = val.split('-')[0];
            this.edittwoDataArray= [];
            this.unicodeResponseData.forEach(item=>{
                if(item.number.substr(0,2) == num && item.children!=null){
                    item.children.forEach(item2=>{
                        this.edittwoDataArray.push(item2.number.substr(2,2)+'-'+item2.title);
                    })
                }
            })
            this.edittwoData = this.edittwoDataArray[0];
            if(this.unicodeData.componentMap!=null){
                this.edittwoDataArray.forEach((item,index)=>{
                if(item.split('-')[0] == this.unicodeData.componentMap.substr(2,2)){
                    this.edittwoData = this.edittwoDataArray[index];
                        }
                })
            }
        },
        'edittwoData':function(val,oldVal){
            let num = this.editoneData.split('-')[0];
            this.editthreeDataArray = [];
            this.unicodeResponseData.forEach(item=>{
                if(item.number.substr(0,2) == num && item.children!=null){
                    item.children.forEach(item2=>{
                        if(item2.number.substr(2,2) == val.split('-')[0] && item2.children!=null){
                            item2.children.forEach(item3=>{
                                this.editthreeDataArray.push(item3.number.substr(4,2)+'-'+item3.title);
                            })
                        }
                    })
                }
            })
            this.editthreeData = this.editthreeDataArray[0];
                        if(this.unicodeData.componentMap!=null){
                            this.editthreeDataArray.forEach((item,index)=>{
                                if(item.split('-')[0] == this.unicodeData.componentMap.substr(4,2)){
                                    this.editthreeData = this.editthreeDataArray[index];
                                }
                            })
                        }
        },
        'editthreeData':function(val){
            this.encodeYingshe = '31-'+this.editoneData.split('-')[0]+' '+this.edittwoData.split('-')[0]+' '+this.editthreeData.split('-')[0];
            this.totalAllTitle = this.editoneData.split('-')[1]+'-'+this.edittwoData.split('-')[1]+'-'+this.editthreeData.split('-')[1];
        }
    },
    methods:{
        //获取物质采购分类编码
        getMaterialPurchase(){
            let setting = {
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
                url:this.BDMSurl+'config2/component/getMaterialPurchase',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    tableNo:'t16'
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.arrList = response.data.rt;
                        let tempData = response.data.rt;
                        tempData.forEach(item=>{
                            if(item.level == '1'){
                                this.addListData.firstTitleData.push(item.number.substr(0,2));
                                this.firstData.push(item);
                            }else if(item.level == '2'){
                                this.secondData.push(item);
                            }else if(item.level == '3'){
                                this.thirdData.push(item);
                            }
                        })
                        this.addListData.codeType = this.addListData.codeTypeData[0];
                        this.addListData.fTitle = this.firstData.title;

                        tempData.forEach(item=>{
                            Object.assign(item,{
                                _state:this.formatterStatus(item.status,item),
                                _source:this.formatterType(item.type)
                            })
                        })  
                        tempData.forEach(item=>{
                            if(item.unit == '1'){
                                Object.assign(item,{
                                    _unit:'个'
                                })
                            }else if(item.unit == '2'){
                                Object.assign(item,{
                                    _unit:'米'
                                })
                            }else if(item.unit == '3'){
                                Object.assign(item,{
                                    _unit:'平方米'
                                })
                            }else if(item.unit == '4'){
                                Object.assign(item,{
                                    _unit:'立方米'
                                })
                            }
                        }) 
                        this.goodsData = dataJs.transformTozTreeFormat(setting, tempData);
                        this.addListData.firstTitle = this.addListData.firstTitleData[0];
                    }
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
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
        //新增
        addList(){
            this.addListData.editListShow = true;
        },
        //确认新增
        addListSure(){
            let level = '';
            level = this.addListData.codeType.substr(5,1);
            axios({
                method:'post',
                url:this.BDMSurl+'config2/component/addMaterialPurchase',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    level:level,
                    number:this.addListData.totalCode,
                    status:'0',
                    table:'t16',
                    title:this.addListData.newTitle,
                    type:'2',
                    unit:this.addListData.caulate,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getMaterialPurchase();
                    this.addListData.editListShow = false;
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //取消新增
        listClose(){
            this.addListData.editListShow = false;
        },
        //构建量编码
        unicodeGoujian(scope){
            this.editGoujianShow = true;
            this.unicodeData = scope.row;
            
            console.log(scope.row)
            axios({
                method:'get',
                url:this.BDMSurl+'company2/standard/findComponentAmountCode',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    tableNo:'t31'
                }
            }).then(response=>{
                if(response.data.cd == 0){                    
                    if(response.data.rt != null){
                        this.unicodeResponseData = response.data.rt;
                        this.unicodeResponseData.forEach(item=>{
                            this.editoneDataArray.push(item.number.substr(0,2)+'-'+item.title);
                        })
                        this.editoneData = this.editoneDataArray[0];
                        if(this.unicodeData.componentMap!=null){
                            this.editoneDataArray.forEach((item,index)=>{
                                if(item.split('-')[0] == this.unicodeData.componentMap.substr(0,2)){
                                    this.editoneData = this.editoneDataArray[index];
                                }
                            })
                        }
                        this.unicodeResponseData.forEach(item=>{
                            if(item.number.substr(0,2) == this.editoneData.split('-')[0] && item.children!=null){
                                item.children.forEach(item2=>{
                                    this.edittwoDataArray.push(item2.number.substr(2,2)+'-'+item2.title);
                                })
                            }
                        });
                        this.edittwoData = this.edittwoDataArray[0];
                        if(this.unicodeData.componentMap!=null){
                            this.edittwoDataArray.forEach((item,index)=>{
                                if(item.split('-')[0] == this.unicodeData.componentMap.substr(2,2)){
                                    this.edittwoData = this.edittwoDataArray[index];
                                }
                            })
                        }
                        this.unicodeResponseData.forEach(item=>{
                            if(item.number.substr(0,2) == this.editoneData.split('-')[0] && item.children!=null){
                                item.children.forEach(item2=>{
                                    if(item2.number.substr(2,2) == this.edittwoData.split('-')[0] && item2.children!=null){
                                        item2.children.forEach(item3=>{
                                            this.editthreeDataArray.push(item3.number.substr(4,2)+'-'+item3.title);
                                        })
                                    }
                                })
                            }
                        });
                        this.editthreeData = this.editthreeDataArray[0];
                        if(this.unicodeData.componentMap!=null){
                            this.editthreeDataArray.forEach((item,index)=>{
                                if(item.split('-')[0] == this.unicodeData.componentMap.substr(4,2)){
                                    this.editthreeData = this.editthreeDataArray[index];
                                }
                            })
                        }
                        
                    }
                    
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        editGoujianShowSure(){
            axios({
                method:'post',
                url:this.BDMSurl+'company2/standard/saveComponentAmountCode',
                headers:{
                    token:this.token
                },
                data:{
                    classifyCode:this.unicodeData.number,
                    componentCode:this.editoneData.split('-')[0]+this.edittwoData.split('-')[0]+this.editthreeData.split('-')[0],
                    componentTile:this.editthreeData.split('-')[1],
                    projectId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.getMaterialPurchase();
                    this.editGoujianShow = false;
                }else if(response.data.cd ==1){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        editGoujianShowClose(){
            this.editGoujianShow = false;
        },
        newTitleCode(){
            if(this.addListData.codeType == 'Level1'){
                this.addListData.totalCode = this.addListData.newCode+'0000';
                this.addListData.totalTitle = this.addListData.newTitle;
            }else if (this.addListData.codeType == 'Level2'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.newCode+'00';
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.newTitle;
            }else if(this.addListData.codeType == 'Level3'){
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.newTitle;
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.newCode;
            }else if(this.addListData.codeType == 'Level4'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.thirdTitle+this.addListData.newCode;
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.thTitle+'-'+this.addListData.newTitle;
            }
        },
        newTitleChange(){
            if(this.addListData.codeType == 'Level1'){
                this.addListData.totalCode = this.addListData.newCode+'0000';
                this.addListData.totalTitle = this.addListData.newTitle;
            }else if (this.addListData.codeType == 'Level2'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.newCode+'00';
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.newTitle;
            }else if(this.addListData.codeType == 'Level3'){
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.newTitle;
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.newCode;
            }else if(this.addListData.codeType == 'Level4'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.thirdTitle+this.addListData.newCode;
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.thTitle+'-'+this.addListData.newTitle;
            }
        },
        //提请
        confirmBtn(scope){
            this.confirmObject = scope.row;
            var parentNum = scope.row.parNumber;
            console.log(scope.row)
            var type = '';
            var status = '';
            if(parentNum){
                this.arrList.forEach((item,index,arr)=>{
                    if(item.number == parentNum){
                        type = item.type;
                        status =item.status;
                    }
                })
            }
            if (type == 0 || type == 1) {
                this.confirmVisible = true;
            } else {
                if (status == 0) {
                    this.confirmVisibleTwo = true;
                } else if (status == 1) {
                    this.confirmVisible = true;
                } else if (status == 2) {
                    this.confirmVisibleTwo = true;
                } else {
                    this.confirmVisible = true;
                }
            } 
        },
        //确认提请
        deleteCode(){
            axios({
                method:'post',
                url:this.BDMSurl+'config2/component/updateMaterialPurchase',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.confirmObject.id,
                    status:'1',
                    title:this.confirmObject.title,
                    unit:this.confirmObject.unit,
                    number:this.confirmObject.number
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                   this.confirmVisible = false;
                    this.getMaterialPurchase();
                }else if(response.data.cd == '1'){
                    this.push({
                        path:'/login'
                    })
                }else {
                    alert(response.data.msg);
                }
            })
        },
        //取消提请
        confirmClose(){
            this.confirmVisible = false;
        },
        confirmCloseTwo(){
            this.confirmVisibleTwo=false;
        },
        //通过
        pass(scope){
            this.surePassObject = scope;
            var status = '';
            if(scope.row.parNumber){
                this.arrList.forEach(item=>{
                    if(item.number == scope.row.parNumber ){
                        status = item.status
                    }
                })
                if(status == 0 || status == 1 || status == 2){
                    alert('该编码的所有父编码必须为【正常使用】状态，才能通过提请!')
                }else{
                    this.passVisible =true;
                }
            }else{
                this.passVisible =true;
            }
            
        },
        surePass(){
            axios({
                method:'post',
                url:this.BDMSurl+'config2/component/updateMaterialPurchase',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.surePassObject.row.id,
                    status:3,
                    title:this.surePassObject.row.title,
                    unit:this.surePassObject.row.unit,
                    number:this.surePassObject.row.number
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.passVisible = false;
                    this.getMaterialPurchase();
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
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
                url:this.BDMSurl+'config2/component/updateMaterialPurchase',
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
                    title:this.rejectObject .row.title,
                    unit:this.rejectObject .row.unit
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                   this.rejectVisible = false;
                    this.getMaterialPurchase();
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        cancelReject(){
            this.rejectVisible = false;
        },
        //修改
        editListBtn(scope){
            this.editObject = scope;
            this.editListShowtwice = true;
            console.log(this.editObject)
            this.addListData.caulate = this.editObject.row.unit;
            if(scope.row.level=='1'){
                this.addListData.codeType = 'Level'+scope.row.level;
                this.addListData.newCode = scope.row.number.substr(0,2);
                this.addListData.newTitle = scope.row.title;
                this.addListData.totalCode = scope.row.number;
                this.addListData.totalTitle = scope.row.title;
            }else if(scope.row.level=='2'){
                this.addListData.showFirst = true;
                this.addListData.codeType = 'Level'+scope.row.level;
                this.addListData.firstTitle = scope.row.number.substr(0,2);
                this.addListData.secondTitle = scope.row.number.substr(2,2);
                this.addListData.newCode = scope.row.number.substr(2,2);
                this.addListData.totalCode = scope.row.number;
                this.addListData.newTitle = scope.row.title;
                this.goodsData.forEach((item,index)=>{
                    if(this.addListData.firstTitle == item.number.substr(0,2)){
                        this.addListData.fTitle = item.title;
                    };
                })
                this.addListData.totalTitle = this.addListData.fTitle+'-'+scope.row.title;
            }else if(scope.row.level == '3'){
                this.addListData.showFirst = true;
                this.addListData.showTwo = true;
                this.addListData.codeType = 'Level'+scope.row.level;
                this.addListData.firstTitle = scope.row.number.substr(0,2);
                this.addListData.secondTitle = scope.row.number.substr(2,2);
                this.addListData.thirdTitle = scope.row.number.substr(4,2);
                this.addListData.newCode = scope.row.number.substr(4,2);
                this.addListData.totalCode = scope.row.number;
                
                this.addListData.newTitle = scope.row.title;
                this.goodsData.forEach((item,index)=>{
                    if(this.addListData.firstTitle == item.number.substr(0,2)){
                        this.addListData.fTitle = item.title;
                        this.addListData.firstIndex = index;
                    };
                })
                this.goodsData[this.addListData.firstIndex].children.forEach((item,index)=>{
                    if(this.addListData.secondTitle == item.number.substr(2,2)){
                        this.addListData.twoTitle = item.title;
                    }
                })
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+scope.row.title;
            }else if(scope.row.level == '4'){
                this.addListData.showFirst = true;
                this.addListData.showTwo = true;
                this.addListData.showThird = true;

                this.addListData.codeType = 'Level'+scope.row.level;
                this.addListData.firstTitle  = scope.row.number.substr(0,2);
                this.addListData.secondTitle  = scope.row.number.substr(2,2);
                this.addListData.thirdTitle = scope.row.number.substr(4,2);
                this.addListData.newCode = scope.row.number.substr(6,2);
                this.addListData.newTitle = scope.row.title;
                this.addListData.totalCode = scope.row.number;
                
                this.goodsData.forEach((item,index)=>{
                    if(this.addListData.firstTitle == item.number.substr(0,2)){
                        console.log(item)
                        this.addListData.fTitle = item.title;
                        this.addListData.firstIndex = index;
                    };
                })
                this.goodsData[this.addListData.firstIndex].children.forEach((item,index)=>{
                    if(this.addListData.secondTitle == item.number.substr(2,2)){
                        console.log(item)
                        this.addListData.twoTitle = item.title;
                        this.addListData.secondIndex = index;
                    }
                })
                //this.addListData.secondIndex = this.addListData.secondTitle.split('')[0];
                this.goodsData[this.addListData.firstIndex].children[this.addListData.secondIndex].children.forEach((item,index)=>{
                    console.log(item)
                    if(this.addListData.thirdTitle == item.number.substr(4,2)){
                        this.addListData.thTitle = item.title;
                    }
                });
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.thTitle+'-'+scope.row.title;
            }
        },
        //编辑确认按钮
        editListSureBtn(){
            if(this.newTitle == ''){
                alert('请输入新标题!');
            }else{
                var flag = '';
                if(this.editObject.row.status == 2){
                    flag = 1;
                }else if(this.editObject.row.status == 0){
                    flag = 0;
                }
                axios({
                    method:'post',
                    url:this.BDMSurl+'config2/component/updateMaterialPurchase',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projectId:this.projId
                    },
                    data:{
                        id:this.editObject.row.id,
                        number:this.editObject.row.number,
                        unit:this.addListData.caulate,
                        status:flag,
                        title:this.addListData.newTitle
                    }
                }).then((response)=>{
                    if(response.data.cd == '0'){
                        this.editListShowtwice = false;
                        this.addListData.codeType = 'Level1';
                        this.addListData.showFirst = false;
                        this.addListData.showTwo = false;
                        this.addListData.showThird = false;
                        this.getMaterialPurchase();
                    }else if(response.data.cd == '1'){
                        this.$router.push({
                            path:'/login'
                        })
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
            
        },
        //编辑取消按钮
        editListCancelBtn(){
            this.editListShowtwice = false;
            this.addListData.codeType = 'Level1';
            this.addListData.showFirst = false;
            this.addListData.showTwo = false;
            this.addListData.showThird = false;
        },
        newTitleChange(){
            if(this.addListData.codeType == 'Level1'){
                this.addListData.totalCode = this.addListData.newCode+'0000';
                this.addListData.totalTitle = this.addListData.newTitle;
            }else if (this.addListData.codeType == 'Level2'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.newCode+'00';
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.newTitle;
            }else if(this.addListData.codeType == 'Level3'){
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.newTitle;
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.newCode;
            }else if(this.addListData.codeType == 'Level4'){
                this.addListData.totalCode = this.addListData.firstTitle+this.addListData.secondTitle+this.addListData.thirdTitle+this.addListData.newCode;
                this.addListData.totalTitle = this.addListData.fTitle+'-'+this.addListData.twoTitle+'-'+this.addListData.thTitle+'-'+this.addListData.newTitle;
            }
        },
        //删除
        deleteItem(num){
            this.deleteDialog = true;
            this.deleteObject = num;
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSurl+'config2/component/deleteMaterialPurchase',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:{
                    id:this.deleteObject.row.id,
                    number:this.deleteObject.row.number,
                    table:'t16'
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.deleteDialog = false;
                    this.getMaterialPurchase();
                }else if (response.data.cd == '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert('response.data.msg');
                }   
            })
        },
    }
}
</script>
<style lang="less">
    #wrapper{
        .zk-table__body-row,.zk-table__header-row{
            height: 36px;
        }
        .zk-table__cell-inner{
            padding: 0px 12px;
        }
        .title{
            color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            padding:0px 15px;
            margin: 0 ;
            text-align: left;
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
            margin-right: 16px;
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
        .goujianyingshe{
            background: url('./images/projectYingShe.png') no-repeat;
        }
        .passBtn{
            background: url('./images/pass.png') no-repeat;
        }
        .backBtn{
            background: url('./images/back.png') no-repeat;
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
        #edit{
            .confirm{
                .el-dialog{
                    width: 398px!important;
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
            .el-dialog{
                width: 586px;
            }
            .redDot{
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background: #fc3439;
                margin: 4px 4px 2px;
            }
            .editBodytwo{
                margin-top: 15px;
            }
            .totalCodeClass{
                width: 447px;
                height: 40px;
                line-height: 40px;
                text-align: left;
                float: left;
            }
            .inp {
                position: relative;
                left: -15px;
                box-sizing: border-box;
                height: 40px;
                width: 436px;
            }
            .editBody{
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
                        box-sizing: border-box;
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
                .clearfix{
                    clear: both;
                    overflow: hidden;
                    content: '';
                }   
            }
        }
    }
</style>