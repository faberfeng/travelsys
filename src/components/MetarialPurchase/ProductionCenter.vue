<template>
    <div id="productionCenter">
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div class="purchaseNav">
                <router-link :to="'/'" class="navItem navactive">  
                    产品管理  
                </router-link>
                <router-link :to="'/metarialpurchase/wuliaopurchase'" class="navItem">  
                    物料跟踪  
                </router-link>
                <router-link :to="'/metarialpurchase/dinghuoManage'" class="navItem">  
                    订货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/fahuoManage'" class="navItem">  
                    发货管理  
                </router-link>
                <router-link :to="'/metarialpurchase/checked'" class="navItem">  
                    检查验收  
                </router-link>
            </div>
            <div class="pbody">
                <div class="pbodyTitle">
                    <label class="text">产品类型</label>
                    <select class="sel" v-model="productTypeData">
                        <option v-for="(item,index) in productType" :key="index">{{item}}</option>
                    </select>
                    <label class="text textone">产品品牌</label>
                    <select class="sel" v-model="productData">
                        <option v-for="(item,index) in productBrand" :key="index">{{item}}</option>
                    </select>
                    <button class="btn addbtn" @click="addProduction">添加</button>
                    <button class="btn importbtn" @click="importText">导入</button>
                    <button class="btn exportbtn" @click="exportTable">导出</button>
                </div>
                <div>
                    <table class="UserList" border="1" width='100%'>
                        <thead>
                            <tr  class="userList-thead">
                                <th>产品ID</th>
                                <th>供货单位</th>
                                <th>产品名称</th>
                                <th>产品类型</th>
                                <th>产品品牌</th>
                                <th>规格参数</th>
                                <th>单位</th>
                                <th>参考价格</th>
                                <th>标记</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in productionList" :key="index" @click="clickRow(item)">
                                <td>{{item.productId}}</td>
                                <td>{{item.supplier}}</td>
                                <td>{{item.productName}}</td>
                                <td>{{item.productType}}</td>
                                <td>{{item.brand}}</td>
                                <td>{{item.specificationParameter}}</td>
                                <td>{{item.unit}}</td>
                                <td>{{item.referencePrice}}</td>
                                <td>{{item.productTag}}</td>
                                <td >
                                    <button class="editBtn actionBtn" title="编辑"  @click="editData(item)" ></button>
                                    <button class="deleteBtn actionBtn" title="删除"  @click="deleteData(item)" ></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="datagrid-pager pagination">
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tbody>
                            <tr>
                                <td>
                                    <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
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
                                    <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1)"></a>
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
                                    <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2)"></a>
                                </td>
                                <td>
                                    <div class="pagination-btn-separator"></div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)" @click="initProLib(0,0)" class="btn-refresh btn-TAB"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                    <div style="clear:both;"></div>
                </div>
            </div>
        </div>
                <!--右侧-->
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div @click="showProperty = !showProperty" :class="{active:showProperty}">
                    <span class="item-property1">产<br/>品</span>
                </div>
            </div>
            <div  class="screenRight_1">
                <div v-show="screenLeft.show" v-if="showProperty">
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        基本信息
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                    <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">产品ID</span>
                            <span class="detial-text-value" :title="detailTableInfo.productId">{{detailTableInfo.productId}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">供货单位</span>
                            <span class="detial-text-value" :title="detailTableInfo.supplier">{{detailTableInfo.supplier}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">产品类型</span>
                            <span class="detial-text-value" :title="detailTableInfo.productType">{{detailTableInfo.productType}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">类型编码</span>
                            <span class="detial-text-value" :title="detailTableInfo.productTypeCode">{{detailTableInfo.productTypeCode}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">产品名称</span>
                            <span class="detial-text-value" :title="detailTableInfo.productName">{{detailTableInfo.productName}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">产品品牌</span>
                            <span class="detial-text-value" :title="detailTableInfo.brand">{{detailTableInfo.brand}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">规格参数</span>
                            <span class="detial-text-value" :title="detailTableInfo.specificationParameter">{{detailTableInfo.specificationParameter}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">单位</span>
                            <span class="detial-text-value" :title="detailTableInfo.unit">{{detailTableInfo.unit}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">参考价格</span>
                            <span class="detial-text-value" :title="detailTableInfo.referencePrice">{{detailTableInfo.referencePrice}}</span>
                        </li>
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">标记</span>
                            <span class="detial-text-value" :title="detailTableInfo.productTag">{{detailTableInfo.productTag}}</span>
                        </li>
                    </ul>
                    <h3 class="header-attribute" style="margin-top: 0px;">
                        <i class="trrangle"></i>
                        产品资料
                        <i :class="[{'active':show.basicAttributes},'icon-dropDown']" @click="show.basicAttributes = show.basicAttributes?false:true;"></i>
                    </h3>
                    <!-- <ul id="basicAtt" :class="[{'show':show.basicAttributes},'Att']">
                        <li class="detial-item clearfix">
                            <span class="detial-text-name">产品ID</span>
                            <span class="detial-text-value" :title="detailTableInfo.productId">{{detailTableInfo.productId}}</span>
                        </li>
                    </ul> -->
                </div>
            </div>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前所选记录吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="edit">
            <el-dialog title="新增产品" :visible.sync="addProductionShow" :before-close="cancleAddPartitionList">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText">供货单位 :</label><input class="inp" placeholder="请输入" v-model="supplyunit"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">产品名称 :</label><input class="inp" placeholder="请输入" v-model="productname"/>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">产品类型 :</label>
                        <select class="editSelect" v-model="producttype">
                            <option v-for="(item,index) in GenieClassData" :key="index">{{item.classifyName}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">产品品牌 :</label><input class="inp" placeholder="请输入" v-model="productbrand"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">规格参数 :</label><input class="inp" placeholder="请输入" v-model="guigeparams"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">单位 :</label><input class="inp" placeholder="请输入" v-model="productunit"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">参考价格 :</label><input class="inp" placeholder="请输入" v-model="refrenceprice"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">标记 :</label><input class="inp" placeholder="请输入" v-model="remarks"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeAddPartitionList">确定</button>
                    <button class="editBtnC" @click="cancleAddPartitionList">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="编辑产品" :visible.sync="editProductionShow" :before-close="canclEditPartitionList">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText">供货单位 :</label><input class="inp" placeholder="请输入" v-model="supplyunit"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">产品名称 :</label><input class="inp" placeholder="请输入" v-model="productname"/>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">产品类型 :</label>
                        <select class="editSelect" v-model="producttype">
                            <option v-for="(item,index) in GenieClassData" :key="index">{{item.classifyName}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">产品品牌 :</label><input class="inp" placeholder="请输入" v-model="productbrand"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">规格参数 :</label><input class="inp" placeholder="请输入" v-model="guigeparams"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">单位 :</label><input class="inp" placeholder="请输入" v-model="productunit"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">参考价格 :</label><input class="inp" placeholder="请输入" v-model="refrenceprice"/>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">标记 :</label><input class="inp" placeholder="请输入" v-model="remarks"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditPartitionList">确定</button>
                    <button class="editBtnC" @click="canclEditPartitionList">取消</button>
                </div>
            </el-dialog>
            <!--导入文件-->
            <el-dialog title="上传文件" :visible.sync="importTextShow" :before-close="importClose">
                <div class="editBody">
                    <div class="editBodytwo imageBody"><label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <button @click="selectFile" class="upImgBtn">选择文件</button>
                            <input class="upInput"  type="file"  @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                        <span class="upImgText">{{fileName}}</span> 
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importSure">上传</button>
                    <button class="editBtnC" @click="importClose">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="Excel方式导入" :visible.sync="importTypeShow" :before-close="importTypeClose">
                <div class="editBody">
                    <div class="editBodyone edit-item clearfix">
                        <label class="editInpText">选择工作表 :</label>
                        <select  class="editSelect" v-model="codeType" >
                            <option v-for="(item,index) in codeTypeData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix">
                        <label class="editInpText">产品明细数量 :</label>
                        <input class="inp" style="float:left" maxlength='2' placeholder="请输入" v-model="productNum" disabled/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="setColumn = true">设置列</button>
                    <button class="editBtnC" @click="importTypeClose">结束</button>
                </div>
            </el-dialog>
            <el-dialog title="设置导入列" :visible="setColumn" @close="setColumnCancle">
                <div class="editBody" style="max-height: 402px;overflow-y: auto;margin: 40px; margin-bottom: 0px;">
                    <div>
                        <table class="UserList" width='100%'>
                            <thead>
                                <tr class="userList-thead">
                                    <th style="width:150px;">原列明</th>
                                    <th style="min-width:328px;">导入后列名</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in columns" :key="index" >
                                    <td>
                                        <span v-text="item.name"></span>
                                    </td>
                                    <td style="position: relative;">
                                        <select class="editSelect" v-model="item.selectVal" style="width: 395px;border:1px solid #e6e6e6;">
                                            <option value="不导入">不导入</option>
                                            <option value="产品类型">产品类型</option>
                                            <option value="产品名称">产品名称</option>
                                            <option value="参考价格">参考价格</option>
                                            <option value="标记">标记</option>
                                            <option value="产品品牌">产品品牌</option>
                                            <option value="供货单位">供货单位</option>
                                            <option value="规格参数">规格参数</option>
                                            <option value="计量单位">计量单位</option>
                                        </select>
                                        <i class="icon-sanjiao" style="top: 20px;right: 15px;"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style="text-align:left;margin-left: 40px;">
                    <el-checkbox v-model="ingnoreData">忽略价格为空或0的行</el-checkbox>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="examineData">校验数据</button>
                    <button class="editBtnC" @click="setColumnCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="校验结果" :visible="showColumn" @close="importCancle">
                <div class="editBody">
                    <ul class="checkedlist">
                        <li v-for="(item,index) in checkResult" :key="index">{{item}}</li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importProductData">确认导入</button>
                    <button class="editBtnC" @click="importCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导入数据确认" :visible="showColumnTwo" @close="importCancleTwo">
                <div class="editBody">
                    <p>当前Excel页面内数据统计如下，确认将其导入到产品库？</p>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">待导入条目数行数统计 :</label>
                        <span v-text="dataCheckResults.importCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">可导入条目行数总计 :</label>
                        <span v-text="dataCheckResults.canImportCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">已经存在的条目数 :</label>
                        <span v-text="dataCheckResults.haveImportCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">新增产品库条目数 :</label>
                        <span v-text="dataCheckResults.newImportCount"></span>
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">更新产品库条目数 :</label>
                        <span v-text="dataCheckResults.updateCount"></span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importProductDataTwo">确认导入</button>
                    <button class="editBtnC" @click="importCancleTwo">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name:'ProductionCenter',
    data(){
        return{
            BDMSUrl:'',
            projId:'',
            token:'',
            productionList:[],
            pageDetial:{
                pagePerNum:20,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            productBrand:[],//产品品牌
            productData:'',
            productType:[],//产品类型
            originProductType:[],
            productTypeData:'',
            deleteDialog:false,
            deleteObj:{},
            addProductionShow:false,
            supplyunit:'',
            productname:'',
            producttype:'',
            productbrand:'',
            guigeparams:'',
            productunit:'',
            refrenceprice:'',
            remarks:'',
            GenieClassData:[],
            editProductionShow:false,
            editOneDay:{},
            importTextShow:false,
            fileName:'未选择任何文件',
            fileList:[],
            importTypeShow:false,
            setColumn:false,
            codeTypeData:[],
            codeType:'',
            productNum:'',
            columns:[],
            selectVal:'0',
            ingnoreData:true,
            tempFilePath:'',
            showColumn:false,
            showColumnTwo:false,
            checkResult:[],
            dataCheckResults:{
                importCount:'',
                canImportCount:'',
                haveImportCount:'',
                newImportCount:'',
                updateCount:"",
            },
            serializedFilePaths:[],
            screenLeft:{
                show:false
            },
            show:{
                basicAttributes:true,
                generalDesignInfo:true,
                reactDocument:true,
                goujianProperty:true,
                jiliangCondition:true,
                caculateForma:true,
                tezhengYingshe:true,
                tezhengMiaosu:true,
            },
            showProperty:true,
            detailTableInfo:{},
        }
    },
    created(){
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.projId = localStorage.getItem('projId');
        this.token = localStorage.getItem('token');
        this.getProductBrand();
        this.loadProductParam();
        this.initProLib(0,0);
        this.listGenieClassTreegrid();
    },
    watch:{
        'productTypeData':function(val){
            let ptype = '',
            pbrand='';
            if(val == '全部'){
                ptype = 0;
                this.getProductBrand();
            }else{
                this.originProductType.forEach(item=>{
                    if(item.classifyName == val){
                        ptype = item.classifyCode;
                    }
                })
            }
            if(ptype !=0 ){
                this.queryBrandByProductType(ptype);
            }
            this.initProLib(ptype,0);
        },
        'productData':function(val){
            let ptype ='',
            pbrand='';
            if(this.productTypeData == '全部'){
                ptype = 0;
            }else{
                this.originProductType.forEach(item=>{
                    if(item.classifyName == this.productTypeData){
                        ptype = item.classifyCode;
                    }
                })
            }
            if(val == '全部'){
                pbrand = '0';
            }else{
                pbrand = val;
            }
            this.initProLib(ptype,pbrand);
        },
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.initProLib(0,0)
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.initProLib(0,0)
        },
    },
    methods:{
        clickRow(item){
            this.detailTableInfo = item;
            console.log(this.detailTableInfo)
        },
        //获取品牌
        getProductBrand(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/getProductBrand',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.productBrand = response.data.rt;
                        this.productBrand.unshift('全部');
                        this.productData = this.productBrand[0];
                    }
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'./login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取产品类型
        loadProductParam(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/loadProductParam',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.originProductType = response.data.rt;
                        this.originProductType.forEach(item=>{
                            this.productType.push(item.classifyName);
                        })
                        this.productType.unshift('全部');
                        this.productTypeData = this.productType[0];
                    }
                }else if(response.data.cd == '1'){
                    this.$router.push({
                        path:'./login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //根据类型获取品牌
        queryBrandByProductType(param){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/productLibrary/queryBrandByProductType',
                headers:{
                    token:this.token
                },
                params:{
                    productType:param,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.productBrand = response.data.rt;
                    }
                    this.productBrand.unshift('全部');
                    this.productData = this.productBrand[0];                    
                }else if(response.data.cd == 1){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //产品库查询
        initProLib(ptype,pbrand){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/initProLib',
                headers:{
                    token:this.token
                },
                params:{
                    page:this.pageDetial.currentPage,
                    rows:this.pageDetial.pagePerNum,
                    productType:ptype,
                    brand:pbrand,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.productionList = response.data.rt.rows;
                        this.pageDetial.total = response.data.rt.total;
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
        //添加
        addProduction(){
            this.addProductionShow = true;
        },
        //确认新增
        makeAddPartitionList(){
            
            if(this.supplyunit == '' || this.productname == '' || this.producttype == '' || this.productbrand == '' || this.guigeparams == '' || this.unit == '' ||this.refrenceprice == '' || this.remarks == ''){
                alert('供货单位/产品类型/产品名称/产品品牌/单位/参考价格/标记 均为必输项目')
            }else{
                let producttypecode ='';
                this.GenieClassData.forEach(item=>{
                    if(item.classifyName == this.producttype){
                        producttypecode = item.classifyCode;
                    }
                })
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/productLibrary/checkPrimaryKeyExist',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        productType:producttypecode,
                        brand:this.productbrand,
                        specificationParameter:this.guigeparams,
                        unit:this.productunit,
                        referencePrice:this.refrenceprice,
                        productName:this.productname,
                        supplier:this.supplyunit
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.saveProduct(0);
                        this.addProductionShow = false;

                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        saveProduct(ptypeparam){
            let producttypecode ='';
            this.GenieClassData.forEach(item=>{
                if(item.classifyName == this.producttype){
                    producttypecode = item.classifyCode;
                }
            })
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/saveProduct',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    productId:ptypeparam,
                    productType:producttypecode,
                    brand:this.productbrand,
                    specificationParameter:this.guigeparams,
                    unit:this.productunit,
                    referencePrice:this.refrenceprice,
                    productName:this.productname,
                    supplier:this.supplyunit,
                    productTag:this.remarks
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.initProLib(0,0);
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //取消新增
        cancleAddPartitionList(){
            this.addProductionShow = false;
            this.producttypecode = '';
            this.productbrand = '';
            this.guigeparams = '';
            this.productunit = '';
            this.refrenceprice = '';
            this.productname = '';
            this.supplier = '';
        },
        exportTable(){
            window.open(this.BDMSUrl+'project2/productLibrary/exportProduct?token='+this.token+'&projId='+this.projId);
        },
        //编辑
        editData(item){
            console.log(item);
            this.editOneDay = item;
            this.GenieClassData.forEach(val=>{
                if(val.classifyCode == item.productTypeCode){
                    console.log(val)
                    this.producttype = val.classifyName;
                }
            })
            this.productbrand = item.brand;
            this.guigeparams = item.specificationParameter;
            this.productunit = item.unit;
            this.refrenceprice = item.referencePrice;
            this.productname = item.projectName;
            this.supplyunit = item.supplier;
            this.remarks = item.productTag;
            this.editProductionShow = true;
        },
        //确定编辑
        makeEditPartitionList(){
            
            let producttypecode ='';
            this.GenieClassData.forEach(item=>{
                if(item.classifyName == this.producttype){
                    producttypecode = item.classifyCode;
                }
            })
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/checkPrimaryKeyExist',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    productType:producttypecode,
                    brand:this.productbrand,
                    specificationParameter:this.guigeparams,
                    unit:this.productunit,
                    referencePrice:this.refrenceprice,
                    productName:this.productname,
                    supplier:this.supplyunit
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.saveProduct(this.editOneDay.productId);
                    this.editProductionShow = false;
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //删除编辑
        canclEditPartitionList(){
            this.editProductionShow = false;
        },
        //删除
        deleteData(scope){
            this.deleteDialog = true;
            this.deleteObj = scope;
        },
        //确认删除
        deleteMakeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/productLibrary/delProduct',
                headers:{
                    token:this.token
                },
                params:{
                    productId:this.deleteObj.productId,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.initProLib(0,0);
                    this.deleteDialog = false;
                }else if(response.data.cd == 1){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //产品类型获取构件分类编码
        listGenieClassTreegrid(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/listGenieClassTreegrid',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){

                    if(response.data.rt != null){
                        this.GenieClassData = response.data.rt.rows;
                    }
                }else if(response.data.cd == 1){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //表格翻页
        changePage(val){//分页 0 -1 1 2
            var vm = this; 
            if(vm.pageDetial.currentPage == 1 && (val == 0 || val == -1)){
                vm.$message('这已经是第一页!')
                return false
            }
            if(vm.pageDetial.currentPage >= Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum) && (val == 1 || val == 2)){
                vm.$message('这已经是最后一页!')
                return false
            }
            switch(val){
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
                    vm.pageDetial.currentPage = Math.ceil(vm.pageDetial.total/vm.pageDetial.pagePerNum)
                    break;
            }
        },
        //导入文件
        importText(){
            this.importTextShow = true;
        },
        //选择文件
        selectFile(){
            this.$refs.file.click();
        },
        fileChanged(){
            this.fileList = this.$refs.file.files[0];
            this.fileName = this.fileList.name;
        },
        //确认导入
        importSure(){

            this.importTextShow = false;
            
            let formData = new FormData();
            formData.append('filedata',this.fileList);
            if(this.fileList.length == 0){
                alert('请选择上传的Excel文件！');
            }else{
                if(this.fileName.split('.')[1] !== 'xls' && this.fileName.split('.')[1] !== 'sxls'){
                    alert('上传的文件格式必须是Excel文件');
                }else{
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'project2/productLibrary/uploadFile',
                        headers:{
                            token:this.token
                        },
                        params:{
                            projId:this.projId,
                            type:20
                        },
                        data:formData
                    }).then(response=>{
                        if(response.data.cd == 0){
                            console.log(response.data);
                            this.importTypeShow = true;
                            this.codeTypeData = [];
                            this.columns = [];
                            if(response.data.rt != null){
                               this.codeTypeData.push(response.data.rt.excelJson.title[0].sheetName);
                               this.codeType = this.codeTypeData[0];
                               response.data.rt.excelJson.title[0].sheetTile.forEach(item=>{
                                   this.columns.push({
                                       name:item,
                                       selectVal:'不导入',
                                   })
                               })
                               this.productNum = response.data.rt.excelJson.title[0].maxColumn;
                               this.tempFilePath = response.data.rt.path.split(',')[0];
                            }
                        }else{
                            alert(response.data.msg);
                        }
                    })
                }
            }
        },
        //取消导入
        importClose(){
            this.importTextShow = false;
        },
        importTypeClose(){
            this.importTypeShow = false;
        },
        //数据校验
        examineData(){
            var vm = this
            var form = new Array()
            var arr = []

            vm.columns.forEach(element => {
                if(element.selectVal != '不导入'){
                    form.push({
                        origName:element.name,
                        mappedName:element.selectVal,
                    })
                    arr.push(element.selectVal)
                }
            })  
            if (vm.isRepeat(form)) {
                 vm.$message({
                    type:'warning',
                    message:vm.isRepeat(form)+'列名重复！'
                })
                return;
            }
            if ($.inArray("产品类型", arr) == -1 || $.inArray("产品名称", arr) == -1 ||
                $.inArray("参考价格", arr) == -1 ) {
                 vm.$message({
                   type:'warning',
                   message:'产品类型，产品名称，参考价格三项为必选项！'
               })
                return;
            }
            axios({
                method:'POST',
                url:vm.BDMSUrl + 'project2/productLibrary/verifyProductLibData',
                headers:{
                   token:vm.token
                },
                params:{
                    projId:vm.projId,
                    tempFilePath:vm.tempFilePath,
                    sheetName:vm.codeType,
                    isIgnoreZero:this.ingnoreData,
                },
                data:form
            }).then((response)=>{
                console.log(response.data);
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.showColumn = true;
                        if(JSON.stringify(response.data.rt.checkResults) == '{}'){
                            this.checkResult = ['所有数据校验通过'];
                        }else{
                            this.checkResult = response.data.rt.checkResults.redundancyType;
                        }
                        
                        let result = response.data.rt.dataCheckResults;

                        this.dataCheckResults.importCount = result.importCount;
                        this.dataCheckResults.canImportCount = result.canImportCount;
                        this.dataCheckResults.haveImportCount = result.haveImportCount;
                        this.dataCheckResults.newImportCount = result.newImportCount;
                        this.dataCheckResults.updateCount = result.updateCount;
                        this.serializedFilePaths = response.data.rt.serializeFilePaths;
                    }
                    
                }else{
                    alert(response.data.msg);
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        isRepeat(arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i].mappedName]) return hash[arr[i].mappedName];
                hash[arr[i].mappedName] = arr[i].mappedName;
            }
            return false;
        },
        //取消
        setColumnCancle(){
            this.setColumn = false;
        },
        importProductData(){
            this.setColumn = false;
            this.showColumnTwo = true;
        },
        importCancle(){
            this.showColumn = false;
        },
        importProductDataTwo(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/productLibrary/importProductData',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId
                },
                data:this.serializedFilePaths
            }).then(response=>{
                if(response.data.cd == 0){
                    this.initProLib(0,0);
                    this.showColumnTwo = false;
                    this.importTypeShow = false;
                    this.showColumn = false;
                    alert('导入成功')
                }else{
                    alert(response.data.msg);
                }
            })
        },
        importCancleTwo(){
            this.showColumnTwo = false;
        }

    }
}
</script>
<style lang="less">
#productionCenter{
    .purchaseNav{
        height: 49px;
        padding-top: 16px;
        padding-left: 20px;
        background: #fafbfc;
        box-sizing: border-box;
        border-bottom: 1px solid #e6e6e6;
    }
    .navItem{
        height: 34px;
        width: 106px;
        float: left;
        line-height: 30px;
        font-size: 14px;
        text-decoration: none;
        color: #999;
    }
    .navactive{
        background: #fff;
        color: #fc3439;
        font-weight: bold;
        border-left: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        border-top: 3px solid #fc3439;
        box-sizing: border-box;
    }
    .pbody{
        padding:0 20px; 
        text-align: left;
        .pbodyTitle{
            width: 100%;
            height: 30px;
            margin: 18px 0 12px 0;
            .text{
                color: #999;
                font-size: 14px;
                line-height: 14px;
                margin-right: 10px;
            }
            .textone{
                margin-left: 20px;
            }
            .sel{
                height: 30px;
                width: 146px;
                border: 1px solid #dddddd;
                border-radius: 2px;
            }
            .btn{
                float: right;
                width: 68px;
                height: 30px;
                margin-left: 10px;
                cursor: pointer;
            }
            .addbtn{
                background: #fc3439;
                border: 1px solid #ff0000;
                color: #fff;
            }
            .exportbtn,.importbtn{
                background: #f2f2f2;
                border: 1px solid #f2f2f2;
                color: #666;
            }
        }
    }
    .UserList {
        border-collapse: collapse;
        border: 1px solid #e6e6e6;
        .checkbox-att {
            display: none;
        }
        .checkbox-fileItem {
            float: left;
            width: 14px;
            height: 14px;
            border: 1px solid #cccccc;
            cursor: pointer;
            position: relative;
            margin-left: 4px;
        }
        .active {
            background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
            border: 1px solid #fc3439;
        }
        thead {
            background: #f2f2f2;
            th {
                padding-left: 6px;
                padding-right: 15px;
                height: 36px;
                text-align: left;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                font-size: 12px;
                color: #333333;
                font-weight: normal;
            }
        }
        tbody {
            tr {
                td {
                    padding-left: 6px;
                    padding-right: 15px;
                    height: 36px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                    .location {
                    display: block;
                    width: 12px;
                    height: 16px;
                    background: url('../ManageCost/images/location.png')no-repeat 0 0;
                    cursor: pointer;
                    }
                }
                .Strong {
                    font-weight: bold;
                }
                .actionBtn {
                    width: 16px;
                    height: 17px;
                    border: none;
                    cursor: pointer;
                    margin-right: 16px;
                }
                .editBtn {
                    background: url('../../assets/edit.png') no-repeat;
                }
                .deleteBtn {
                    background: url('../../assets/delete.png') no-repeat;
                }
                }
                .activeTr {
                background: #0081c2;
                td {
                    color: #fff !important;
                }
            }
        }
    }
    /*删除弹框*/
    .deleteDialogImg {
      height: 50px;
    }

    .deleteDialogWarning {
      font-size: 18px;
      line-height: 18px;
      font-family: 'MicrosoftYahei';
      color: #fc3439;
      font-weight: bold;
      margin: 20px 0 0 0;
    }

    .deleteDialogText {
      color: #333333;
      font-size: 14px;
      line-height: 14px;
      font-family: 'MicrosoftYahei';
      font-weight: normal;
      margin: 16px 0 0 0;
    }

    /**********一下是分页器的样式***************/

    .datagrid-pager {
      display: block;
      height: 31px;
      width: auto;
      border: 1px solid #d4d4d4; // padding: 3px 4px;
      box-sizing: border-box;
      background: #f5f5f5;
    }

    .pagination {
      border-top: none;
    }

    .pagination table {
      float: left;
      height: 30px;
      th,
      td {
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

    .btn-TAB {
      display: block;
      width: 26px;
      height: 26px;
      cursor: pointer;
      position: relative;
      &:hover {
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
      }
      &::after {
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

    .btn-left0::after {
      background-image: url('../../assets/fenye2.png');
    }

    .btn-left1::after {
      background-image: url('../../assets/fenye1.png');
    }

    .btn-right0::after {
      background-image: url('../../assets/fenye4.png');
    }

    .btn-right1::after {
      background-image: url('../../assets/fenye3.png');
    }

    .btn-refresh::after {
      background-image: url('../../assets/fenye5.png');
    }

    .pagination-title {
      font-size: 14px;
      color: #333333;
    }

    .pagination-info {
      float: right;
      margin-top: 5px;
      margin-right: 25px;
    }

    .clearfix {
      clear: both;
      overflow: hidden;
      content: '';
    }
    .editSelect {
        border: none;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        -moz-appearance: none;
        -webkit-appearance: none;
        color: #333;
        width: 100px;
        float: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        
    }
    .edit-item{
            position: relative;
            .editSelect{
                float: left;
                width: 447px;
                height: 42px;
                padding: 10px;
                border: 1px solid #d1d1d1;
            }
            .editInpText{
                width: 100px;
                text-align: right;
                float: left;
                height: 40px;
                line-height: 40px;
                margin-left: 48px;
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
            .displayColor{
                display: block;
                width: 30px;
                height: 30px;
                border: 1px solid #ccc;
                overflow: hidden;
                float: left;
                margin-left: 120px;
                margin-top: 5px;
            }
            
        }
    .icon-sanjiao{
        right: 55px;
    }
    .updataImageSpan {
      overflow: hidden;
      width: 98px;
    }

    .updataImageSpan input {
      position: absolute;
      left: 0px;
      top: 0px;
      opacity: 0;
      /* -ms-filter: 'alpha(opacity=0)'; */
    }
    .checkedlist{
        list-style: none;
        padding: 0 20px;
        text-align: left;
        text-indent: 2px;
    }
    .box-left-avtive{
        width: 96%;
        transition:  all ease .5s;
        #center-selection{
            right: 0;
            transition: all ease .5s;
        }
        .icon-right{
            transform: rotateZ(180deg)!important;
            transition: all ease .5s;
        }
    }
    .box-right-avtive{
        width: 2%;
        transition: all ease .5s;
        // border-left: 1px solid #cccccc;
    }
    //左侧
    .box-left-container{
        // display: block;
        // position: fixed;
        // top: 116px;
        // left: 26px;
        // bottom:0;
        // overflow: auto;
        // right: 225px;
        // z-index:1000;
        // transition: all .5s;
        // overflow-y: scroll;
        display: inline-block;
        width: 85%;
        position: relative;
        // margin-top:109px;
        // margin-left:24px;
        // z-index: 1001;
        transition:  all ease .5s;
        
        .antsLine {
            padding: 10px 10px 15px 0px;
            font-size: 12px;
            line-height: 12px;
            color: #999999;
            text-align: left;
            .icon-sanjiao-right {
                display: inline-block;
                width: 7px;
                height: 10px;
                margin: 2px 7px 0;
                background-image: url('../ManageCost/images/sanjiaoright.png');
                background-size: 100% 100%;
            }
            .strong {
                cursor: pointer;
                color: #333333;
                font-weight: bold;
                &:last-of-type .icon-sanjiao-right {
                display: none;
                }
            }
        }
        .header {
            text-align: left;
            margin: 15px 0;
            border-bottom: 1px solid #e6e6e6;
            padding-bottom: 10px;
            height: 27px;
            .left_header {
                float: left;
                font-size: 16px;
                line-height: 16px;
                color: #fc3439;
                font-weight: bold;
                padding-left: 30px;
                position: relative;
                .list_ {
                    background: url('../planCost/images/goujiandetail.png')no-repeat 0 0;
                }
                .icon {
                    display: block;
                    width: 20px;
                    height: 17px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            .left_headerRight{
                float: right;
                font-size: 14px;
                line-height: 14px;
                color: #666;
                cursor: pointer;
                .list_icon_right{
                    background: url('../planCost/images/expandProperty.png') no-repeat;
                    display: inline-block;
                    width: 20px;
                    height: 17px;
                    position: relative;
                    top: 4px;
                    right: 10px;
                }
            }
            .right_header {
                text-decoration: none;
                float: right;
                font-size: 14px;
                color: #336699;
                line-height: 14px;
                margin-top: 4px;
            }
            .right-expend {
                position: relative;
                transition: all ease .5s;
                &::after {
                display: block;
                position: absolute;
                top: 1px;
                left: -20px;
                width: 12px;
                height: 12px;
                background: url('../planCost/images/expand.png') no-repeat 0 0;
                content: '';
                }
            }
            .right-pack-up {
                transition: all ease .5s;
                &::after {
                transform: rotateZ(180deg);
                }
            }
        }

    }
    //右侧
    .box-right-container{
        // display: block;
        // position: fixed;
        // overflow-y: auto;
        // right: 0px;
        // bottom: 0;
        // width: 225px;
        // top: 116px;
        // transition: all ease .5s;
        // background: #ffffff;
        // border-left:none;
        // z-index: 1000;
        // border-left: 1px solid #e6e6e6;
        //  display: inline-block;
        position: relative;
        float: right;
        width: 15%;
        // margin-top: -763px;
        transition: all ease .5s;
        background: #ffffff;
        z-index: 10;
        height: 785px;
        overflow-y: auto;
        overflow-x: hidden;
        #center-selection{
                // position: fixed;
                // top: 67px;
                // right: 225px;
                // width: 25px;
                // z-index: 100;
                // transition: all ease .5s;
                // background: #ffffff;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25px;
                border-right: 1px solid #cccccc;
                .SH_right{
                    width: 100%;
                    height: 48px;
                    border-left: 1px solid #cccccc;
                    background: #f2f2f2;
                    position: relative;
                    cursor: pointer;
                    .icon-right{
                        display: block;
                        position: absolute;
                        top: 19px;
                        left: 6px;
                        width: 14px;
                        height: 14px;
                        background: url('../ManageCost/images/right.png')no-repeat 0 0;
                        transition: all ease .5s;
                        transform: rotateZ(0deg);
                    }
                }
                .item-property1{
                    display: block;
                    width: 24px;
                    height: 48px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -7px;
                        width: 24px;
                        height: 1px;
                        z-index: 1000;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        -webkit-transform: skewY(30deg);
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .item-property{//目录
                    display: block;
                    width: 25px;
                    height: 60px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -7px;
                        width: 24px;
                        height: 16px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        -webkit-transform: skewY(30deg);
                        transform: skewY(30deg);
                        content: '';
                    }
                }   
                .item-version{//属性
                    display: block;
                    width: 25px;
                    height: 55px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .item-version-3{//版本
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:24px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                .active-version{//中间 属性 高显
                    .item-version{//属性
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after{
                            background: #fff;
                        }
                    }
                    .item-version-3{//版本
                        z-index: 10;
                    }
                }
                .active{//上边 目录 高显
                    .item-property,.item-property1{
                        // background: #fff;
                        color: #fc3439;
                    }
                    .item-version{
                        z-index: 15;
                    }
                    .item-version-3{
                        z-index: 10;
                    }
                }
            } 
        .screenRight_1{
            padding: 10px 0px 5px 0px;
            margin: 0 14px 0 30px;
            .noTop{
                top: 12px!important;
            }
            >p{
                padding-bottom:5px;
                border-bottom: 1px solid #e6e6e6;
                margin-bottom:10px;  
            }
            .icon-goujian{
                display: inline-block;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .icon-search{
                background: url('../ManageCost/images/search.png')no-repeat 0 0;
                margin-left: 10px;
                &:hover{
                    background: url('../ManageCost/images/search1.png')no-repeat 0 0;
                }
            }
            #basicAtt{
                padding: 0;
            }
            .header-attribute{
                font-size: 14px;
                color: #333333;
                line-height: 14px;
                padding-bottom:4px;
                border-bottom: 1px solid #e6e6e6;
                text-align: left; 
                .trrangle{
                    display: inline-block;
                    width: 0px;
                    height: 0px;
                    border-left: 10px solid #fc3439;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                }
                .icon-dropDown{
                    display: block;
                    width: 12px;
                    height: 12px;
                    background:url('../ManageCost/images/arror.png')no-repeat 0 0; 
                    float: right;
                    cursor: pointer;
                    transition:  all ease .2s;
                    transform: rotate(180deg);
                }
                .active{
                    transform: rotate(0deg);
                }
            }
            .header-attribute:last-of-type{
                margin-top: 30px;
            }
            .Att{
                >li:last-of-type{
                    padding-bottom: 7px;
                }
                .detial-item{
                    font-size: 12px;
                    line-height: 12px;
                    margin-top: 16px;
                    text-align: left;
                    list-style:none;
                }
                //文件图标
                .reactDocFileIcon{
                    display: inline-block;
                    width: 17px;
                    height: 18px;
                    background: url('../planCost/images/fileIcon.png') no-repeat;
                    position: relative;
                    top: 4px;
                }
                .fileIcon{
                    margin: 0 5px;
                }
                .fileSection{
                  padding-bottom: 0!important;
                  margin-bottom: 7px;  
                  cursor: pointer;
                }
                .fileSection:hover{
                    background: rgba(243, 243, 243, 1);
                }
                .fileSection:hover .reactDocFileIconAfter{
                    background: url('../planCost/images/fileIconHover.png') no-repeat;
                }
                .reactDocFileIconAfter{
                    display: inline-block;
                    width: 17px;
                    height: 18px;
                    background: url('../planCost/images/flieIconfter.png') no-repeat;
                    position: relative;
                    top: 4px;
                    left: 10px;
                }
                .detial-text-name{
                    color: #999999;
                    width: 65px;
                    display: inline-block;
                }
                .detial-text-value{
                    color: #333333;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                }
            }
        }
        .show{
            display: block!important;
        }
    }
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      box-shadow: inset 006px rgba(0, 0, 0, .5);
      -webkit-box-shadow: inset 006px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.1);
      box-shadow: inset 006px rgba(0, 0, 0, .5);
      -webkit-box-shadow: inset 006px rgba(0, 0, 0, 0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(255, 0, 0, 0.4);
    }
}
</style>

