<template>
    <div  id="quantitiesList" v-loading.fullscreen="fullscreenloading">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item ">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item label-item-active">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item">  
                    物料量清单  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本审批  
                </router-link>
                <router-link :to="''"  class="label-item">  
                    成本分析  
                </router-link>
            </div>
            <div class="project" v-loading="loading" v-if='!showDetail'>
                <!--以下是实时列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="target icon"></i>实时可追溯工程量清单
                        </span>
                        <span class="item-btn clearfix">
                            <label @click="SHOWMain = false">配置映射</label>
                            <label @click="generateBuildWorkAmount()">新建单体清单</label>
                            <label @click="showExtension()">新建自定义清单</label>
                        </span>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单名称</th>
                                <th>构件数量</th>
                                <th>已出工程量的构件数量</th>
                                <th>工程量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  S_quantitiesList" :key="index">
                                <td v-text="val.manifestId"></td>
                                <td v-text="initName(val.name)"></td>
                                <td v-text="val.componentNum"></td>
                                <td v-text="val.gifWorkAmount"></td>
                                <td v-text="val.workAmountNum"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createTime)"></td>
                                <td v-if="val.HasbId">
                                    <button class="detailBtn actionBtn" title="明细"  @click="viewDetail(val)" ></button>
                                    <button class="listBtn actionBtn" title="清单"  @click="viewList(val)" ></button>
                                    <button class="refreshBtn actionBtn" title="刷新"  @click="reCalculate(val.manifestId,index)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.manifestId,val.bId,true)" ></button>
                                </td>
                                 <td v-else>
                                     <a href="javascript:void(0);" style="text-decoration: none;">正在生成工程量，请耐心等待...</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" S_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无实时报表
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" S_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                        <option value="5">5</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </select>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'1')"></a>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-left:5px;">第</span>
                                </td>
                                <td>
                                        <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial.total/pageDetial.pagePerNum)}}页</span>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'1')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'1')"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
                <!--以下是快照列表-->
                <div>
                    <p class="header clearfix">
                        <span class="left">
                            <i class="reportS icon"></i>独立工程量清单
                        </span>
                        <a class="right" href="javascript:void(0)">导入Excel</a>
                    </p>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>ID</th>
                                <th>清单名称</th>
                                <th>工程量条目</th>
                                <th>总价</th>
                                <th>创建人</th>
                                <th>创建日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in  D_quantitiesList" :key="index">
                                <td v-text="val.manifestId"></td>
                                <td v-text="val.name"></td>
                                <td v-text="val.workAmountNum"></td>
                                <td v-text="val.totalPrice"></td>
                                <td v-text="val.createUserName"></td>
                                <td v-text="initData(val.createTime)"></td>
                                <td >
                                    <button class="detailBtn actionBtn" title="明细"  @click="edit(val)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteItem(val.manifestId,2)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if=" D_quantitiesList.length == 0" style="height:250px;text-align: center;font-size:18px;line-height:250px;">
                            无快照报表
                    </div>
                </div>
                <!--以下是page-navigitation-->
                <div class="datagrid-pager pagination" v-if=" D_quantitiesList.length>0">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial_1.pagePerNum">
                                        <option value="5">5</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </select>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'2')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'2')"></a>
                                </td>
                                <td>
                                        <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-left:5px;">第</span>
                                </td>
                                <td>
                                        <input class="pagination-num" type="text" v-model="pageDetial_1.currentPage">
                                </td>
                                <td>
                                    <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(pageDetial_1.total/pageDetial_1.pagePerNum)}}页</span>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'2')"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'2')"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="getSnapWorkAmountList" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial_1.pagePerNum+',共'+pageDetial_1.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
            </div>
            <div>

            </div>
            <div class="worktable project" v-if='showDetail'>
                <p class="antsLine">
                    <a class="backToProjectBtn" @click="backToProject">工程量清单</a>
                    <i class="icon-sanjiao-right"></i>
                    <span class="strong" @click="back()" v-text="viewProjectDetail.viewDetailName"></span>
                </p>
                <p class="header clearfix">
                    <span class="item-btn clearfix">
                        <label @click="threePrice">三价</label>
                        <label @click="generateBuildWorkAmount()">导入单价</label>
                        <label @click="exportExcel">导出Excel</label>
                        <label @click="exportXml">导出xml</label>
                        <label @click="printObject">打印</label>
                    </span>
                </p>
                <zk-table 
                    index-text="序号"
                    :data="codingList" :columns="columns" :tree-type="props.treeType"
                    :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                    :border="props.border" empty-text="正在加载...">
                    <template slot="action" slot-scope="scope">
                        <button title="明细"></button>
                        <button title="编辑"></button>
                    </template> 
                </zk-table>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="请选择需要出量的单体或场地" :visible="createMonomer.show" @close="createCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">单体或场地 :</label>
                        <span>
                             <el-select v-model="createMonomer.holderId" placeholder="请选择">
                                <el-option :label="SitesList.name+'(场地)'" :id="SitesList.id+'_id'"
                                data-type="1"
                                :data-name="SitesList.name"
                                :value="SitesList.id">
                                </el-option>
                                <el-option
                                    v-for="item in MonomerList"
                                    :key="item.value"
                                    :id="item.ID+'_id'"
                                    data-type="2"
                                    :data-name="item.Name"
                                    :label="item.Name+'(单体)'"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="createConfirm">确定</button>
                    <button class="editBtnC" @click="createCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="新建可追溯工程量清单" :visible="editBySelfShow" @close="customCancle">
                <div class="project">
                    <div>
                        <table border="1" class="UserList" width="100%">
                            <thead>
                                <tr  class="userList-thead">
                                    <th>清单类型</th>
                                    <th>清单ID</th>
                                    <th>清单名称</th>
                                    <th>明细数量</th>
                                    <th>业务来源</th>
                                    <th>业务状态</th>
                                    <th>创建时间</th>
                                    <th>创建人</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in  customData" :key="index">
                                    <td>{{item.type_c}}</td>
                                    <td>{{item.detailId}}</td>
                                    <td>{{item.detailName}}</td>
                                    <td>{{item.componentCount}}</td>
                                    <td>{{item.relaType_c}}</td>
                                    <td></td>
                                    <td>{{new Date(item.createTime).toLocaleString()}}</td>
                                    <td>{{item.createUser}}</td>
                                    <td>
                                        <input type="checkbox" v-model="item.isChecked"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div  class="datagrid-pager pagination">
                            <table cellspacing="0" cellpadding="0" border="0" >
                                <tbody>
                                    <tr>
                                        <td>
                                            <select class="pagination-page-list" v-model="customPageDetial.pagePerNum">
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                                <option value="40">40</option>
                                                <option value="50">50</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="pagination-btn-separator"></div>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,'3')"></a>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,'3')"></a>
                                        </td>
                                        <td>
                                            <div class="pagination-btn-separator"></div>
                                        </td>
                                        <td>
                                            <span  class="pagination-title" style="padding-left:5px;">第</span>
                                        </td>
                                        <td>
                                            <input class="pagination-num" type="text" v-model="customPageDetial.currentPage">
                                        </td>
                                        <td>
                                            <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(customPageDetial.total/customPageDetial.pagePerNum)}}页</span>
                                        </td>
                                        <td>
                                            <div class="pagination-btn-separator"></div>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,'3')"></a>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,'3')"></a>
                                        </td>
                                        <td>
                                            <div class="pagination-btn-separator"></div>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0)" @click="showExtension" class="btn-refresh btn-TAB"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="pagination-info pagination-title" v-text="'显示1到'+customPageDetial.pagePerNum+',共'+customPageDetial.total+'记录'"></div>
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="selectScence">场景选择</button>
                    <button class="editBtnS" @click="customConfirm">确认</button>
                    <button class="editBtnC" @click="customCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="三价配置" :visible="viewProjectDetail.showThreePrice" @close="createCancle">
                <div>
                    <span>显示列</span>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[0]">内部价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[1]">导入价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[2]">参考价</el-checkbox>
                </div>
                <div>
                    <button>将内部价复制到参考价</button>
                </div>
                <div>
                    <button>将导入价复制到参考价</button>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="showThreePriceCenter">确定</button>
                    <button class="editBtnC" @click="showThreePriceCancel">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="请选择导出价" :visible="viewProjectDetail.exportExcelShow" @close="createCancle">
                <div>
                    <sapn>导出价</sapn>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[0]">内部价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[1]">导入价</el-checkbox>
                    <el-checkbox v-model="viewProjectDetail.threePriceArr[2]">参考价</el-checkbox>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="exportExcelShowCenter">确定</button>
                    <button class="editBtnC" @click="sexportExcelShowCancel">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
export default {
  name:'DesignVersion',
    data(){
        return{
            token:'',
            projId:'',
            BDMSUrl:'',
            loading:false,
            fullscreenloading:false,
            S_quantitiesList:[],//构件的实时报表
            D_quantitiesList:[],//快照报表
            pageDetial:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            customPageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            pageDetial_1:{
                pagePerNum:5,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            createMonomer:{
                show:false,
                holderId:'',
            },
            SitesList:{},//场地选项
            MonomerList:[],//单体选选项
            editBySelfShow:false,
            customData:[],
            codingList:[],
            columns: [
                {
                    label: '序号',
                    prop: 'no',
                    minWidth: '260px',
                },
                {
                    label: '项目编码',
                    prop: 'number',
                    width: '185px',
                },
                {
                    label: '项目名称',
                    prop: 'title',
                    width: '205px',   
                },
                {
                    label: '项目特征描述',
                    prop: 'characterValues[0].characterName',
                    width: '115px',
                },
                {
                    label: '工程量',
                    prop: 'amount',
                    width: '115px',
                },
                {
                    label: '计量单位',
                    prop: 'unit',
                    width: '115px',
                },
                {
                    label: '内部单价',
                    prop: 'price',
                    width: '115px',
                },
                {
                    label: '内部合价',
                    prop: 'totalPrice',
                    width: '115px',
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    // minWidth:'125px'
                }
            ],
            props: {
                stripe: true,
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
            showDetail:false,
            viewProjectDetail:{
                viewDetailName:'',
                showThreePrice:false,
                threePriceArr:[true,false,false],
                // addNeibuPrice:true,
                // addDaoruPrice:false,
                // addCankaoPrice:false,
                exportExcelShow:false,
            },//工程量明细
            viewDetailObject:{},
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.getInentityDetail();
    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.getSnapWorkAmountList()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.getSnapWorkAmountList()
        },
        'pageDetial_1.currentPage':function(val,oldval){
            var vm = this
            vm.getSingleWorkAmountList()
        },
        'pageDetial_1.pagePerNum':function(val,oldval){
            var vm = this
            vm.getSingleWorkAmountList()
        },
        'customPageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.showExtension()
        },
        'customPageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.showExtension()
        },
      
    },
    methods:{
        //确认添加单体清单
        createConfirm(){
            var vm = this;
            if(vm.createMonomer.holderId == ''){
                vm.$message({
                    type:'warning',
                    message:'请选择一个场地或单体!'
                })
                return false;
            }else{
                var buildName = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.name;
                var cType = $('#'+vm.createMonomer.holderId+'_id')[0].dataset.type;
            }
            vm.fullscreenloading =true;
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/generateBuildWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    holderId:vm.createMonomer.holderId,
                    buildName:buildName,
                    cType:cType,//1：场地； 2：单体
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    var resData = response.data.rt;
                    axios({
                        method:'get',
                        url:vm.BDMSUrl+'project2/report/fromComponentListToEngineeringList',
                        headers:{
                            token:vm.token
                        },
                        params:{
                            mId:resData.pkId,
                            gsource:resData.mGSource,
                            bsource:resData.mBSource,
                            projId:vm.projId
                        }
                    }).then(response=>{
                        if(response.data.cd == 0){
                            vm.getSnapWorkAmountList();
                            vm.createCancle();
                            vm.fullscreenloading =false;
                        }else{
                            alert(response.data.msg);
                        }
                    })
                    
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                
            }).catch((err)=>{
                console.log(err)
            })
        },
        //取消添加单体清单
        createCancle(){
            var vm = this;
            vm.createMonomer.show = false;
            vm.createMonomer.holderId = '';
        },
        //新建单体清单
        generateBuildWorkAmount(){
            var vm = this
            vm.createMonomer.show = true;
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSiteInfo',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.SitesList = response.data.rt;
                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/findSubProject/'+vm.projId,
                    headers:{
                        token:vm.token
                    },
                }).then(response=>{
                    if(response.data.cd == 0){
                         if(response.data.rt.rows!= null){
                            vm.MonomerList = response.data.rt.rows;
                        }
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        },
        
        //新建自定义清单
        showExtension(){
            this.editBySelfShow = true;
            var formData = new FormData();
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/loadManifest',
                headers:{
                    token:this.token,
                },
                params:{
                    projectId:this.projId,
                    type:1,
                    page:this.customPageDetial.currentPage,
                    rows:this.customPageDetial.pagePerNum
                },
                data:formData
            }).then(response=>{
                if(response.data.cd == 0){
                    this.customData = response.data.rt.rows;
                    this.customPageDetial.total = response.data.rt.total;
                    var type_c = '';
                    var relaType_c ='';
                    this.customData.forEach((item,index)=>{
                        if(item.type == 1){
                            type_c = '构件量清单';
                        }else if(item.type == 2){
                            type_c = '工程量清单';
                        }else if(item.type == 3){
                            type_c = '物料量清单';
                        }
                        if(item.relaType == 2){
                            relaType_c = '进度计划-任务核实';
                        }else if(item.relaType == 1){
                            relaType_c = "文档管理-关联构件" ;
                        }else if(item.relaType == 7){
                            relaType_c = "成本管理-报表快照" ;
                        }
                        Object.assign(item,{
                            type_c:type_c,
                            relaType_c:relaType_c,
                            isChecked:false
                        })
                    });
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //确认
        customConfirm(){
            this.customData.forEach((item,index)=>{
                if(item.isChecked == true){
                    this.fromComponentListToEngineeringList(item.detailId, 3, item.relaType);
                }
            })
        },
        //取消
        customCancle(){
            this.editBySelfShow = false;
        },
        /**
         * 将构件量转换成工程量
         * @param mId
        */
        fromComponentListToEngineeringList(mId, gsource, bsource){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/fromComponentListToEngineeringList',
                headers:{
                    token:this.token,
                },
                params:{
                    projId:this.projId,
                    mId:mId,
                    gsource:gsource,
                    bsource:bsource
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.lodeSnapWorkAmountList();
                    this.reCalculate(response.data.rt,0);
                    this.editBySelfShow = false;
                }else{
                    alert(response.data.msg);
                }
                
            })
        },
        lodeSnapWorkAmountList(pageNo){
            pageNo = pageNo || 1;
            if (!pageNo || isNaN(pageNo) || pageNo < 1) return;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/getSnapWorkAmountList',
                headers:{
                    token:this.token
                },
                params:{
                    pageNo: pageNo,
                    pageSize: 5,
                    projectId: this.projId
                }

            }).then(response=>{
                if(response.data.cd == 0){
                    
                }else{
                    alert(response.data.msg);
                }
            })
        },

        //场景选择
        selectScence(){
            alert('功能未完善！')
            return false;
        },
        reCalculate(mid,index){
            var vm = this
            vm.fullscreenloading = true
            vm.$set(vm.S_quantitiesList[index],'HasbId',false)
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/reCalculateWorkAmount',
                headers:{
                    token:vm.token
                },
                params:{
                    mId:mid,
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                     vm.fullscreenloading = false
                }
            }).then(response=>{
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/report/handleWorkAmountCore',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        mId:mid,
                        projId:vm.projId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        vm.getSnapWorkAmountList()
                    }
                })
            })
        },

        deleteItem(mid,bid,istop){
            var vm = this
            vm.$confirm('确定要将清单与当前业务解除关联关系吗？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'/manifest2/deleteMBRelation',
                    headers:{
                        token:vm.token
                    },
                    params:{
                        mId:mid,
                        bId:bid,
                        bType:3
                    }
                }).then(response=>{
                    if(response.data.cd != '0'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        vm.$message({
                            type:'success',
                            message:'清单删除成功!'
                        })
                        if(istop){
                            vm.getSnapWorkAmountList()
                        }else{
                            vm.getSingleWorkAmountList()
                        }
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //进入设计版本页面
        getInentityDetail(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/workAmountList',
                headers:{
                    token:vm.token
                },
                params:{
                    projId:vm.projId
                }
            }).then(response=>{
                if(response.data.cd != '0'){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }).then(()=>{
                vm.getSnapWorkAmountList()
                vm.getSingleWorkAmountList()
            })
        },
        //实时可追溯工程量清单
        getSnapWorkAmountList(){
            var vm = this;
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSnapWorkAmountList',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial.currentPage,
                    pageSize:vm.pageDetial.pagePerNum,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.total;
                        if(response.data.rt.rows != null){
                            vm.S_quantitiesList = response.data.rt.rows;
                            vm.S_quantitiesList.forEach((Element,index)=>{
                                if(Element.bId != null){
                                    vm.$set(Element,'HasbId',true)
                                }else{
                                     vm.reCalculate(Element.manifestId,index)
                                }
                            });
                        }
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
         //加载快照报表数据
        getSingleWorkAmountList(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/report/getSingleWorkAmountList',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    pageNo:vm.pageDetial_1.currentPage,
                    pageSize:vm.pageDetial_1.pagePerNum,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        vm.pageDetial_1.total = response.data.rt.pager.totalSize
                        if(response.data.rt.rows != null){
                            vm. D_quantitiesList = response.data.rt.rows
                        }
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        //表格页码改变时重新获取数据
        changePage(val, isTop) { //分页 0 -1 1 2
            var vm = this;
            if (isTop == '1') {
                if (vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total / vm.pageDetial.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
                case 0:
                    vm.pageDetial.currentPage = 1
                    break;
                case -1:
                    vm.pageDetial.currentPage--
                    break;
                case 1:
                    vm.pageDetial.currentPage++
                    break;
                case 2:
                    vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total / vm.pageDetial.pagePerNum)
                    break;
                }
            } else if(isTop == '2') {
                if (vm.pageDetial_1.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.pageDetial_1.currentPage >= Math.ceil(vm.pageDetial_1.total / vm.pageDetial_1.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
                case 0:
                    vm.pageDetial_1.currentPage = 1
                    break;
                case -1:
                    vm.pageDetial_1.currentPage--
                    break;
                case 1:
                    vm.pageDetial_1.currentPage++
                    break;
                case 2:
                    vm.pageDetial_1.currentPage = Math.ceil(vm.pageDetial_1.total / vm.pageDetial_1.pagePerNum)
                    break;
                }
            }else if(isTop == '3'){
                if (vm.customPageDetial.currentPage == 1 && (val == 0 || val == -1)) {
                vm.$message('这已经是第一页!')
                return false
                }
                if (vm.customPageDetial.currentPage >= Math.ceil(vm.customPageDetial.total / vm.customPageDetial.pagePerNum) && (val == 1 || val == 2)) {
                vm.$message('这已经是最后一页!')
                return false
                }
                switch (val) {
                case 0:
                    vm.customPageDetial.currentPage = 1
                    break;
                case -1:
                    vm.customPageDetial.currentPage--
                    break;
                case 1:
                    vm.customPageDetial.currentPage++
                    break;
                case 2:
                    vm.customPageDetial.currentPage = Math.ceil(vm.customPageDetial.total / vm.customPageDetial.pagePerNum)
                    break;
                }
            }
        },
        initName(name){
            if(!name)return ''
            var tt = name.substring(name.indexOf("[") + 1, name.lastIndexOf("]"))
            return tt;
        },
         initData(val){
            if(!val)return ''
            var tt=new Date(val).Format('yyyy-MM-dd hh:mm') 
            return tt; 
        },
        edit(){

        },
        back(){

        },
        //返回工程量清单
        backToProject(){
            this.showDetail = false;
        },
        //查看明细
        viewDetail(val){
            console.log(val);
            this.viewDetailObject = val;
            this.showDetail = true;
            this.viewProjectDetail.viewDetailName = val.name.split('-')[0]+'-'+'工程量明细';
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/getSnapWorkAmouontDetail',
                headers:{
                    token:this.token
                },
                params:{
                    id:val.manifestId,
                    projId:this.projId,
                    type:1
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.codingList = response.data.rt;
                }else{
                    alert(response.data.msg)
                }
                console.log(response.data);
            })
        }, 
        //三价配置
        threePrice(){
            this.viewProjectDetail.showThreePrice = true;
        },
        showThreePriceCenter(){
            this.viewProjectDetail.showThreePrice = false;
        },
        showThreePriceCancel(){
            this.viewProjectDetail.showThreePrice = false;
        },
        //导出excel
        exportExcel(){
            this.viewProjectDetail.exportExcelShow = true;
        },
        exportExcelShowCenter(){
            var mainId = this.viewDetailObject.manifestId;
            var projId = this.projId;
            var excelName = this.viewDetailObject.name+'明细';
            var threeArr =[];
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('内部价');
            }
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('导入价');
            }
            if(this.viewProjectDetail.threePriceArr[0]){
                threeArr.push('参考价');
            }
            var priceType = threeArr.join('-');
            window.open(this.BDMSUrl+'project2/report/exportEngineeringDetailToExcel?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&excelName='+excelName+'&priceType='+priceType);
            this.viewProjectDetail.exportExcelShow = false;
        },
        sexportExcelShowCancel(){
            this.viewProjectDetail.exportExcelShow = false;
        },
        //导出xml
        exportXml(){
            var mainId = this.viewDetailObject.manifestId;
            var xmlName = this.viewDetailObject.name+'明细';
            var projId = this.projId;
            window.open(this.BDMSUrl+'project2/report/exportEngineeringDetailToXML?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&xmlName='+xmlName);
        },
        //打印
        printObject(){
            var mainId = this.viewDetailObject.manifestId;
            var title = this.viewDetailObject.name+'明细';
            var projId = this.projId;
            window.open(this.BDMSUrl+'project2/report/printPreview?token='+this.token+'&mainId='+mainId+'&projId='+projId+'&title='+title);
        },
        //查看清单
        viewList(val){
            axios({
                method:'get',
                url:this.BDMSUrl+'show2/taskManifestDetail',
                headers:{
                    token:this.token
                },
                params:{
                    manifestId:val.manifestId,
                    projId:this.projId
                }
            }).then(response=>{
                console.log(response.data)
            })
        },
       
    }
}
</script>
<style lang="less" >
    #quantitiesList{
        .el-dialog{
            margin: 0 auto;
        }
        .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
              .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
                .label-item-active{
                    color: #fc3439;
                    font-weight: bold;
                    border-top: 3px solid #fc3439;
                    border-left: 1px solid #e6e6e6;
                    border-right: 1px solid #e6e6e6;
                    border-bottom: 1px solid #fff;
                    background: #ffffff;
                }
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
                    overflow: hidden;
                    .singelOne{
                        float: left;
                        color: #999;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                    }
                }
        }
        .selectOption{
            position: relative;
            width: 212px;
            float: left;
            select{
                height: 28px;
                width: 212px;
                border-radius: 28px;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 10px;
                border: 1px solid #ccc;
            }
            .icon-sanjiaoone{
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image:url('../ManageDesign/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 13px;
                left: 180px;
            }
        }
        .project{
            margin: 0 20px;
            .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
            .icon-sanjiao-right{
                display: inline-block;
                width: 7px;
                height: 10px;
                margin: 2px 7px 0;
                background-image:url('../ManageCost/images/sanjiaoright.png');
                background-size: 100% 100%;
            }
            .strong{
                cursor: pointer;
                color: #333333;
                font-weight: bold;
                &:last-of-type .icon-sanjiao-right{
                        display: none;
                    }
                }       
            }
            .backToProjectBtn{
                cursor: pointer;
            }
            .backToProjectBtn:hover{
                color:#fc3439;
            }
            .header{
                border-bottom: 2px solid #e6e6e6;
                margin: 20px 0;
                padding-bottom: 10px;
                .left{
                    float: left;
                    font-size: 16px;
                    line-height: 16px;
                    color: #fc3439;
                    font-weight: bold;
                     padding-left:30px;
                    position: relative;
                    .reportS{
                        background: url('./images/listS.png')no-repeat 0 0;
                    } 
                    .target{
                        background: url('./images/target.png')no-repeat 0 0;
                    } 
                    .icon{
                       display: block;
                        width: 20px;
                        height: 17px;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                }
                .item-btn{
                    float: right;
                    label,.label-item{
                        float:left;
                        width:auto;
                        height:26px;
                        padding: 0 9px;
                        border-top: 1px solid #e6e6e6;
                        border-bottom: 1px solid #e6e6e6;
                        text-align:center;
                        line-height:24px;
                        font-size:12px;
                        color:#666666;
                        cursor: pointer;
                        border-left: 1px solid #e6e6e6;
                        &:first-of-type{
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                        }
                        &:last-of-type{
                        border-right: 1px solid #e6e6e6;
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                        }
                    }
                    .label-item{
                            border-right: none!important;
                    }
                }
                .right{
                    text-decoration: none;
                    float: right;
                    font-size: 14px;
                    color: #336699;
                    line-height: 14px;
                    margin-top:4px; 
                }
            }
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                .checkbox-att{
                    display:none;
                }
                .checkbox-fileItem{
                    float: left;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                    position: relative;
                    margin-left:4px;
                }
                .active{
                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                    border: 1px solid #fc3439;
                }
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 6px;
                        padding-right: 15px;
                        height: 55px;
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                        font-weight: normal;
                    }
                }
                tbody{
                    tr{
                        td{
                            padding-left: 6px;
                            padding-right: 15px;
                            height: 55px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                            .location{
                                display: block;
                                width: 12px;
                                height: 16px;
                                background: url('../ManageCost/images/location.png')no-repeat 0 0;
                                cursor: pointer;
                            }
                        }
                        .Strong{
                            font-weight: bold;
                        }
                        .actionBtn{
                            width: 16px;
                            height: 17px;
                            border: none;
                            cursor: pointer;
                            margin-right: 10px;
                        }
                        .editBtn{
                            background: url('../../assets/edit.png') no-repeat;
                        }
                        .deleteBtn{
                            background: url('../../assets/delete.png') no-repeat;
                        }
                        .dataBtn{
                            background: url('./images/data.png') no-repeat;
                        }
                        .listBtn{
                            background: url('./images/list.png') no-repeat;
                        }
                        .detailBtn{
                              background: url('./images/details.png') no-repeat;
                        }
                         .refreshBtn{
                              background: url('./images/refresh.png') no-repeat;
                        }
                    }
                    .activeTr{
                        background: #0081c2;
                        td{
                            color: #fff!important;
                        }
                    }
                }
            }
        }
        /**********一下是分页器的样式***************/
        .datagrid-pager {
            display: block;
            height: 31px;
            width: auto;
            border:1px solid #d4d4d4;
            box-sizing: border-box;
            background: #f5f5f5;
        }
        .pagination{
            border-top: none;
        }
        .pagination table {
            float: left;
            height: 30px;
            th, td {
                min-width: 5px;
                padding: 0px;
                margin: 0px;
            }
        }
        .pagination-page-list {
            margin: 0px 6px;
            padding: 1px 2px;
            width: 43px;
            height: auto;
            border-width: 1px;
            border-style: solid;
        }
        .pagination .pagination-num {
            border-color: #D4D4D4;
            margin: 0 2px;
            width: 30px;
        }
        .pagination-btn-separator {
            float: left;
            height: 24px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #fff;
            margin: 3px 1px;
        }
        .btn-TAB{
            display: block;
            width:26px;
            height: 26px;
            cursor: pointer;
            position: relative;
            &:hover{
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                border-radius: 5px;
            }
            &::after{
                display: block;
                position: absolute;
                content: '';
                width: 10px;
                height: 10px;
                background-size: 100% 100%; 
                top: 8px;
                left: 8px;
            }
        }
        .btn-left0::after{
            background-image: url('../../assets/fenye2.png');
        }
        .btn-left1::after{
            background-image: url('../../assets/fenye1.png');
        }
        .btn-right0::after{
            background-image: url('../../assets/fenye4.png');
        }
        .btn-right1::after{
            background-image: url('../../assets/fenye3.png');
        }
        .btn-refresh::after{
            background-image: url('../../assets/fenye5.png');
        }
        .pagination-title{
            font-size: 14px;
            color: #333333;
        }
        .pagination-info{
            float: right;
            margin-top: 5px;
            margin-right: 25px;
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    }
</style>




