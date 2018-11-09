
<template>
    <div id="wuliao">
        <div class="topHeader">
            <div class="purchaseNav">
                <router-link :to="'/metarialpurchase/productioncenter'" class="navItem">  
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
                <router-link :to="'/metarialpurchase/checked'" class="navItem  navactive">  
                    检查验收  
                </router-link>
            </div>
            <div class="elselect" v-if="!showCommonList">
                <el-select v-model="selectUser" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in userGroup"
                    :key="index"
                    :label="item.ugName"
                    :value="item.ugId">
                    </el-option>
                </el-select>
                <label class="elselecttitle">群组:</label>
            </div>
            
            <div class="pbody" v-if="!showCommonList">
                <div class="pbodyleft">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="'已签收'+planData.length" name="first">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndexone == index ?'selectActive':'','lefttitlecontent']" v-for="(item,index) in planData" :key="index" @click="selectItem(item,index,false)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未签收'+noPlanData.length" name="second">
                            <div class="leftcontent">
                                <ul class="leftcontentul">
                                    <li class="lefttitle">
                                        <label class="lefttitlelab">订单号</label>
                                        <span class="lefttitlespan">订单名称</span>
                                    </li>
                                    <li :class="[selectIndextwo == index ?'selectActive':'','lefttitlecontent']" v-for="(item,index) in noPlanData" :key="index" @click="selectItem(item,index,true)">
                                        <label class="lefttitlelab">{{item.orderCode}}</label>
                                        <span class="lefttitlespan lefttitlespanone">{{item.orderTitle}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="pbodyright">
                    <div v-if="showDetail">
                        请在左侧内选择发货单
                    </div>
                    <div v-if="!showDetail" class="scrolldiv">
                        <p class="pbodyrighttitle">【{{itemTitle}}】详情</p>
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">检查记录</label>
                        </div>
                        <div class="borderbottom1">   
                            <div class="quanxuan">
                                <button v-if="!isReceipt" class="btn" @click="allCheckOver()" :class=" orderInfo.checkStatus === 2 ? 'content-hidden' : ''">检查完成</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>总数量</th>
                                        <th>取样数量</th>
                                        <th>取样率</th>
                                        <th>检查人</th>
                                        <th>检查时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) of orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.sampleSize"></td>
                                        <td v-text="item.sampleRate"></td>
                                        <td v-text="item.checkUserName"></td>
                                        <td v-text="item.checkDate_"></td>
                                        <td>
                                            <span class="detailsIcon" @click="showDetialList(item,index,noShowCheck)" title="详情"></span>
                                            <span v-if="!isReceipt" class="editIcon" :class=" item.checkStatus == 2 ? 'content-hidden' : ''" @click="showOver(index,item.id)" title="完成"></span>
                                            <span v-if="!isReceipt" class="backIcon" :class=" [item.checkStatus == 0 ? 'content-hidden' : '',orderInfo.checkStatus == 2 ? 'content-hidden' : '']" @click="showBackOver( index,item.id )" title="撤销"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="tableinfo">
                                <label class="checkqz">检查群组：</label><span class="checktext">{{orderInfo.checkUgName}}</span>
                                <label class="checkpeo">检查人：</label><span class="checktext">{{orderInfo.checkUserName}}</span>
                                <label class="checktime">检查时间：</label><span class="checktext">{{orderInfo.checkDate_}}</span>
                            </div>
                        </div>
                        <div class="jindu">
                            <i class="titleimg"></i>
                            <label class="titletext">签收记录</label>
                        </div>
                        <div class="borderbottom1">   
                            <div class="quanxuan huoweixuanz">
                                <label class="huoweilabel">当前货位：</label>
                                <el-select disabled :value="stockName + storageName +huoweiName"></el-select>
                            </div>
                            <div class="quanxuan">
                                <button v-if="!isReceipt" class="btn" :class=" orderInfo.receiptStatus == 1 ?'content-hidden':''" @click="AllReceiptOver()">签收订单</button>
                            </div>
                            <table class="UserList" border="1" width="100%">
                                <thead>
                                    <tr class="userList-thead">
                                        <th>清单编号</th>
                                        <th>清单名称</th>
                                        <th>总数量</th>
                                        <th>堆场位号</th>
                                        <th>签收状态</th>
                                        <th>签收人</th>
                                        <th>签收时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in orderDeatilData" :key="index">
                                        <td v-text="item.orderDetailCode"></td>
                                        <td v-text="item.title"></td>
                                        <td v-text="item.count"></td>
                                        <td v-text="item.warehouseName"></td>
                                        <td v-text="item.currentStep"></td>
                                        <td v-text="item.receiptUserName"></td>
                                        <td v-text="item.receiptDate_"></td>
                                        <td>
                                            <span class="detailsIcon" @click="showDetialList(item,index,!noShowCheck)" title="详情"></span>
                                            <span v-if="!isReceipt" class="editIcon" :class=" item.receiptStatus == 1 ? 'content-hidden' : ''" @click="showReceipt( index,item.id )" title="完成"></span>
                                            <span v-if="!isReceipt" class="backIcon" :class=" [item.receiptStatus == 0 ? 'content-hidden' : '',orderInfo.receiptStatus == 1 ? 'content-hidden' : '']" @click="showBackReceipt( index,item.id )" title="撤销"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="tableinfo">
                                <label class="checkqz">签收群组：</label><span class="checktext">{{orderInfo.receiptUgName}}</span>
                                <label class="checkpeo">签收人：</label><span class="checktext">{{orderInfo.receiptUserName}}</span>
                                <label class="checktime">签收时间：</label><span class="checktext">{{orderInfo.receiptDate_}}</span>
                            </div>
                        </div>
                        <div class="borderbottom1 huowei">
                            <div class="huoweileft">货位选择：</div>
                            <div class="huoweiright">
                                <div class="huiweirighttitle">
                                    <span @click="handleStore()" v-if="selectStatus == 1" :style=" selectStatus == 1 ? 'color:black':'' ">{{stockName}}</span>
                                    <span v-if="selectStatus == 0">选择堆场</span>
                                    <span @click="handleHuoJia()" v-if="selectStatus1 == 1">{{storageName}}</span>   
                                    <span v-if="selectStatus1 == 0">> 选择货架、货位</span>   
                                    <span>{{huoweiName}}</span>
                                </div>
                                <ul class="huiweirightimg" v-if="isclickHuoJia == false">
                                    <li v-for="(item,index) of store" :key="index" @click="clickStock(item,index)" :style=" index == stockSelecct ?'border:1px solid #fc3439 ' : 'border:1px solid #e6e6e6;' ">
                                        <div class="store">
                                            <a class="store_img"><img :src="item.imgPath" alt=""></a>
                                            <div class="store_edit">
                                                <a class="store_name">
                                                    <span>{{item.name}}</span>
                                                </a>
                                                <div v-if="index > 0" class="store_edit_detail">
                                                    <a>
                                                        <el-button class="edit" type="text" @click.stop="editName(item,index)"></el-button>
                                                    </a>
                                                    <a>
                                                        <el-button class="image" type="text" @click.stop="editImage(item,index)"></el-button>
                                                    </a>
                                                    <a>
                                                        <el-button class="delete" type="text" @click.stop="deleteStock(item,index)"></el-button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li @click="addStore()">
                                        <div>添加堆场</div>
                                    </li>
                                </ul>
                                <ul class="huojia" v-if="isclickHuoJia == true">
                                    <li v-for="(item,index) of storage" :key="index" :class=" index == storageSelect ? 'active' :'noactive' "  @click="clickHuoJia(item,index)">{{item.name}} </li>
                                    <li v-if="isclickHuoJia == true" :style="  isclickHuoJia == false ? 'display:none' : ''">
                                        <span  @click="showAdd = false" :class="showAdd == true? '' : 'content-hidden'">+添加货架</span>
                                        <div class="addHuoJia">
                                            <input class="content" v-model="newhuoJiaName" :class="showAdd == false? '' : 'content-hidden'" />
                                            <span class="sure"   :class="showAdd == false? '' : 'content-hidden'" @click="addHuoJia()">确定</span>
                                            <span class="cancel"  :class="showAdd == false? '' : 'content-hidden'" @click="showAdd = true">取消</span>
                                        </div>
                                    </li>
                                </ul>
                                <ul class="huowei" v-if="isclickHuoWei == 1">
                                    <li v-for="(item,index) of huoweiList"  :key="index"  :class=" index == huoweiSelect ? 'active' :'noactive' " @click="clickHuoWei(item,index)">{{item.name}}</li>
                                    <li>
                                        <span @click="showAddHuowei = false" :class="showAddHuowei == true ? '' : 'content-hidden'">+添加货位</span>
                                        <div class="addHuoWei">
                                            <input class="content" v-model="newhuoWeiName" :class="showAddHuowei == false? '' : 'content-hidden'" />
                                            <span class="sure"   :class="showAddHuowei == false? '' : 'content-hidden'" @click="addHuoWei()">确定</span>
                                            <span class="cancel"  :class="showAddHuowei == false? '' : 'content-hidden'" @click="showAddHuowei = true">取消</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <common-list v-on:back="backToH" @refreshData='getOrderDetail' :mId="checkItem.id" rType="5" :bId='checkItem.id' :isGongChengLiang="false" :title="'检查验收'"  :checkReceiptObj="CheckReceiptObj" :isShowcheck="isShowCheck" :isShowreceipt="isShowReceipt" :showEditallcheck='showEditAllCheck' :showEditallreceipt='showEditAllReceipt' v-if="showCommonList"></common-list>
        </div>

        <el-dialog title="图片上传" :visible.sync="upImg" @close="upImgCancle">
            <div class="editBody">
                <div class="editBodytwo imageBody"><label class=" imageBodyText">上传图片 :</label>
                    <span class="updataImageSpan">
                        <button @click="selectImg" class="upImgBtn">选择图片</button>
                        <input class="upInput"  type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
                    </span>
                    <span class="upImgText">{{imageName}}</span> 
                </div>
            </div>
            <p class="err" v-show="showErr">请输入完整信息</p>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="upImgSure">上传</button>
                <button class="editBtnC" @click="upImgCancle">取消</button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios';
import commonList from  './../planCost/qingDan.vue'


export default {
    name:'Checked',
    data(){
        return{
            activeName:'first',
            BDMSUrl:'',
            token:'',
            projId:'',
            userGroup:[],
            selectUser:'',
            planData:[],
            noPlanData:[],
            itemTitle:'',
            showDetail:true,
            orderDeatilData:[],
            orderInfoData:[],
            orderInfo:{},
            huoweiselect:'',
            selectIndexone:'-1',
            selectIndextwo:'-1',
            isReceipt:true,
            showCommonList:false,
            checkItem:{},
            isAllCheckOver:false,
            isAllReceiptOver:false,
            isCheckOver:false,
            isReceiptOver:false,
            store:[],
            defaultImageUrl:'http://10.252.26.240:8080/qjbim-file/upload/107/public/006/2017/12/13/02661b31-9687-4896-ba8c-b89ae30abd53.jpg',
            stockName:'',
            stockSelecct:0,
            storage:[],
            huoweiList:[],
            storageName: '',
            storageSelect: -1,
            huoweiSelect: -1,
            huoweiName: '',
            isclickStock: 0, 
            isclickHuoJia: false, 
            isclickHuoWei: 0, 
            showStore: true,
            selectStatus:0,
            selectStatus1:0,
            warehouseId:'',
            huoJiaId:"",
            huoWeiId:"",
            updeName:'',
            fileImage:'',
            dialogVisible: false,
            imgPath:'',
            imgIndex:-1,
            showAdd: true,
            showAddHuowei: true,
            imageName: '未选择任何图片',
            upImg: false,
            imageType: '2',
            QJFileManageSystemURL:'',
            showErr:false,
            filesList:[],
            userId:'',
            newhuoJiaName:'',
            newhuoWeiName:'',
            isAdd: false,
            showWuZi:true,
            isShowCheck:true,
            isShowReceipt:true,
            CheckObj:{},
            ReceiptObj:{},
            CheckReceiptObj:{},
            noShowCheck:true,
            showEditAllCheck:true,
            showEditAllReceipt:true,
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.getUserGroup();
        this.getStore( this.isAdd );
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        this.userId = localStorage.getItem('userid');
    },
    methods:{
        backToH(){
            this.showCommonList = false;
        },
        //编辑图片
        upImgCancle(){
            this.upImg = false;
        },
        //上传图片确认
        upImgSure(){
            let returnUrl = this.BDMSUrl+'project2/receipt/uploadFile?projId='+this.projId+'&id='+this.warehouseId;
            returnUrl = encodeURIComponent(returnUrl);              
            let formData = new FormData();
            formData.append('projId',this.projId);
            formData.append('type','1');
            formData.append('userId',this.userId);
            formData.append('modelCode','011');
            formData.append('returnUrl',returnUrl)
            formData.append('token',this.token);
            formData.append('file',this.filesList[0]);
            console.log("上传图片文件",formData,formData.get("file"));
            axios({
                method:'post',
                url:this.QJFileManageSystemURL + 'uploading/uploadFileInfo',
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
                data:formData
            }).then(response=>{
                if(response.data.cd== '0'){
                    this.upImg = false;
                    this.imageName = '未选择任何图片';
                    this.getStore( this.isAdd );
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                       path:'/login'
                    })
                }
            })
        },
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            const list = this.$refs.file.files;
            this.imageName = list[0].name;
            this.filesList = list;
        },
        //编辑堆场名字
        editName( items,i ){
            this.$prompt('请输入堆场名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{2,9}$/,
                inputErrorMessage: '堆场名格式不正确'
            }).then(({ value }) => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/renameWarehouseNode',
                    headers:{
                        token:this.token
                    },
                    params:{
                        id:items.id,
                        name:value
                    }
                }).then( res =>{
                    if( res.data.cd== 0 ){
                        this.$message({
                            type: 'success',
                            message: '堆场名修改成功！ ',
                        });
                        this.store.map( (item,index) =>{
                            if( i == index ){
                                item.name = value;
                            }
                        })
                    }else{
                        this.$message({
                            type: 'warring',
                            message: '修改失败！ ',
                        });
                    }
                }).catch();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
                
        },
        //测试
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        test(){
            this.store.map( (item,index)=>{
                    if( this.imgIndex == index ){
                        console.log("要编辑的图片",item);
                        item.imgPath = this.imgPath;
                    }
                });
            this.dialogVisible = false;
        },
        imgOnChange(e){
            let img = '';
            console.log(e.target.files);
            if(e.target.files.length){
                const file = e.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                const _this = this;
                fileReader.onload = function(res){
                    console.log(this.result);
                    img = this.result;
                    _this.imgPath = img;
                    console.log("要编辑的图片的地址",_this.imgPath);
                }
            }
            
        },
        //编辑堆场图片
        editImage(items,i){
            console.log("编辑堆场图片id",items.id);
            this.imgIndex = i;
            this.warehouseId = items.id;
            this.dialogVisible = true;
            this.upImg = true;     
        },
        //删除堆场
        deleteStock(item,index){
            console.log("删除堆场",item,index);
            this.warehouseId = item.id;
            this.$confirm('此操作将永久删除【'+item.name+'】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/removeWarehouse',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        level:item.level,
                        warehouseId:this.warehouseId
                    }
                }).then( res=>{
                    console.log("删除堆场",res);
                    if( res.data.cd == 0 ){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getStore( this.isAdd );
                    }else {
                        this.$message({
                            type: 'warring',
                            message: '删除失败!'
                        });
                    }
                }).catch();
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //添加堆场
        addStore(){
            console.log("添加堆场")
            this.$prompt('请输入堆场名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{2,9}$/,
                inputErrorMessage: '堆场名格式不正确'
            }).then(({ value }) => {
                console.log("请输入堆场名",value);
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/addWarehouseNode',
                    headers:{
                        token:this.token
                    },
                    data:{  
                        level: 1,
                        name: value,
                        parId: 0,
                        projId: this.projId,
                        whType: 1,
                    }
                }).then( res=>{
                    console.log("添加堆场的结果",res)
                    if( res.data.cd==0 ){
                        this.$message({
                            type: 'success',
                            message: "堆场添加成功！",
                        });
                        this.getStore( this.isAdd );
                    }else{
                            this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        //添加货架
        addHuoJia(){
            this.showAdd = true;
            this.isAdd = true;
            console.log("添加货架",this.newhuoJiaName)
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/addWarehouseNode',
                headers:{
                    token:this.token
                },
                data:{  
                    level: 2,
                    name: this.newhuoJiaName,
                    parId: this.warehouseId,
                    projId: this.projId,
                    whType: 1,
                }
            }).then( res=>{
                console.log("添加货架的结果",res)
                if( res.data.cd==0 ){
                    this.$message({
                        type: 'success',
                        message: "货架添加成功！",
                    });
                    this.getStore( this.isAdd );
                    this.getHuoJia(this.warehouseId);
                }else{
                        this.$message({
                        type: 'warring',
                        message: res.data.msg,
                    });
                }
            })
        },
        //添加货位
        addHuoWei(){
            this.showAddHuowei = true;
            this.huoweiList = [];
            this.isAdd = true;
            console.log("添加货位",this.newhuoWeiName)
            axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/addWarehouseNode',
                    headers:{
                        token:this.token
                    },
                    data:{  
                        level: 3,
                        name: this.newhuoWeiName,
                        parId: this.huoJiaId,
                        projId: this.projId,
                        whType: 1,
                    }
                }).then( res=>{
                    console.log("添加货位的结果",res)
                    if( res.data.cd==0 ){
                        this.$message({
                            type: 'success',
                            message: "货位添加成功！",
                        });
                        this.getStore( this.isAdd );
                        this.getHuoJia(this.warehouseId);
                        
                    }else{
                         this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                })
            
        },
        showDetialList(val,i,is){
            if(is){
                this.isShowCheck = true;
                this.isShowReceipt = false;
            }else{
                this.isShowReceipt = true;
                this.isShowCheck = false;
            }
            console.log(val);
            this.showCommonList = true;
            this.checkItem = {};
            this.checkItem = val;
            this.CheckReceiptObj = {};
            Object.assign(this.CheckReceiptObj,{
                                orderCode:this.orderInfo.orderCode,
                                orderTitle:this.orderInfo.orderTitle,
                                checkItem:this.checkItem,
                                orderId:this.orderInfo.id,
                                warehouseId:this.warehouseId,
                                stockName:this.stockName,
                            })
        },
        //堆场切换
        clickStock( items,i ){
            this.storageName = "";
            this.selectStatus = 1;   
            this.warehouseId = items.id;    
            this.showAdd = true;
            this.showAddHuowei = true;
            this.isclickHuoWei = 0;  
            this.storageSelect= -1,       
            this.store.map( (item,index)=>{
                if( i == index ){
                    this.stockName = item.name;
                    this.stockSelecct = i;
                    this.getHuoJia( item.id );
                }
            }); 
        },
        //货架切换
        clickHuoJia(items,i){
            this.huoJiaId = items.id;
            this.huoweiList = [];
            this.huoweiName = "";
            this.selectStatus1 = 1;
            this.showAdd = true;
            this.showAddHuowei = true;
            this.huoweiSelect = -1;
            this.isclickHuoWei = 1;
            this.storage.map( (item,index)=>{
                if( i == index ){
                    this.storageName = " - "+item.name;
                    this.storageSelect = i;
                    if(item.children != null){
                        this.huoweiList = item.children;
                        
                    }
                }
            }); 
            console.log("当前货架",this.storageName);
        },
        //货位切换
        clickHuoWei(items,i){
            this.huoWeiId = items.id;
            this.showAdd = true;
            this.showAddHuowei = true;
            this.huoweiList.map( (item,index)=>{
                if( i == index ){
                    this.huoweiName = " - "+item.name;
                    this.huoweiSelect = i;
                }
            });
        },
        //返回堆场
        handleStore(){
            this.isclickHuoJia = false;
            this.storage = [];
            this.storageName = "";
            this.huoweiList = [];
            this.huoweiName = "";
            this.showAdd = true;
            this.showAddHuowei = true;
            this.selectStatus1 = 0;
            this.isclickHuoWei = 0;
        },
        //返回货架
        handleHuoJia(){
            this.huoweiList = [];
            this.huoweiName = "";
            this.showAdd = true;
            this.showAddHuowei = true;
            this.isclickHuoWei = 0;
        },
        //检查记录 确认
        showOver( i,id ){
            let bill = "清单检测完成确认";
            let status = 2;
            let isSuse = '确认对当前清单内的构件抽检完成：';
            let isCheck = true;
            let isOver1 = true;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,item.warehouseName,isOver1,id );                   
                }
            })
        },
        //检查记录 撤销
        showBackOver( i,id ){
            let bill = "清单取消检测确认";
            let status = 0;
            let isSuse = "确认对当前清单内的构件撤销抽检：";
            let isCheck = true;
            let isOver1 = false;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,item.warehouseName,isOver1,id );
                }
            })
        },
        //签收记录 确认
        showReceipt( i,id ){
            let bill = "签收清单完成确认";
            let status = 1;
            let isSuse = '确认签收以下清单内所有构件：';
            let isCheck = false;
            let isOver1 = true;
            let warehouseName = this.stockName + this.storageName + this.huoweiName;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    if( item.checkStatus == 2 ){  
                        this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,warehouseName,isOver1,id );
                    }else{
                        this.$alert('清单【'+item.orderDetailCode+'】在签收之前应进行检查确认！', '提示', {
                            confirmButtonText: '确定',
                        });
                    }          
                }
            })
        },
        //签收记录 撤销
        showBackReceipt( i,id ){
            let bill = "取消签收清单确认";
            let status = 0;
            let isSuse = '取消签收以下清单内所有构件：';
            let isCheck = false;
            let isOver1 = false;
            this.orderDeatilData.map( (item,index)=>{
                if( i == index){
                    this.isOver( item.count,item.sampleSize,item.sampleRate,bill,i,status,isSuse,isCheck,item.orderDetailCode,item.title,item.warehouseName,isOver1,id );
                }
            })
        },
        //检查 全选确认
        allCheckOver(){
            let flag = this.orderDeatilData.some( (item,index) =>{
                return item.checkStatus == 0;
            });
            if( flag ){
                this.$alert('存在没有检查的清单，不能完成订单的检查!', '提示', {
                        confirmButtonText: '确定',
                    });
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/checkResult/checkOrder',
                    headers:{
                        token:this.token
                    },
                    params:{  
                        id:this.orderInfo.id,
                        projId:this.projId,
                        ugId: this.orderInfo.orderUgId,
                    }
                }).then( res =>{
                    if(res.data.cd == 0){
                        this.$message({
                            type: 'success',
                            message: "全部清单检查完成！",
                        });
                        this.orderInfo.checkStatus = 2;
                        this.orderInfo.checkUgName = this.orderInfo.orderUgName;
                        this.orderInfo.checkUserName = this.orderInfo.orderUserName;
                        this.orderInfo.checkDate_ = new Date().toLocaleString();
                    }else{
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                })
                
            }
        },
        //签收 全选确认
        AllReceiptOver(){
            if( this.orderInfo.checkStatus == 2 ){
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/receipt/receiptOrder',
                    headers:{
                        token:this.token
                    },
                    params:{
                        warehouseId: this.warehouseId,
                        id: this.orderInfo.id,
                        projId: this.projId,
                        ugId: this.orderInfo.orderUgId,
                    }
                }).then( res =>{
                    if( res.data.cd == 0 ){
                        this.$message({
                            type: 'success',
                            message: "全部清单签收完成！",
                        });
                        this.orderDeatilData.map( (item,index) =>{
                            item.receiptStatus = 1;
                        })
                        this.orderInfo.receiptStatus = 1;
                        this.orderInfo.receiptUgName = this.orderInfo.orderUgName;
                        this.orderInfo.receiptUserName = this.orderInfo.orderUserName;
                        this.orderInfo.receiptDate_ = new Date().toLocaleString();
                        this.getUserGroup();
                    }else {
                        this.$message({
                            type: 'warring',
                            message: res.data.msg,
                        });
                    }
                }).catch();
                
            }else{
                this.$alert('订单在签收之前应进行检查确认！', '提示', {
                        confirmButtonText: '确定',
                    });
            }
        },
        //确认弹出框
        isOver( count,sampleSize,sampleRate,bill,i,status,isSuse,isCheck,orderDetailCode,title,warehouseName,isOver1,id ) {
            const h = this.$createElement;
            if( isCheck ){
                this.$msgbox({
                title: bill,
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},isSuse),
                    h('p',null,'清单构件总数：'+count),
                    h('p',null,'已经检查数量：'+sampleSize),
                    h('p',null,'检查比例：'+sampleRate),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then( action => {
                    console.log("isOver1",isOver1);
                    if( isOver1 == true ){
                        console.log("111"+action);
                        axios({
                            method:'post',
                            url:this.BDMSUrl+'project2/checkResult/checkOrderDetail',
                            headers:{
                                token:this.token
                            },
                            params:{  
                                id:id,
                                projId:this.projId,
                            }
                        }).then( res =>{
                            this.$message({
                                type: 'success',
                                message: res.data.msg,
                            });
                            this.orderDeatilData.map( (item,index)=>{
                                if( i == index){
                                    item.checkStatus = status;
                                    item.checkUserName = this.orderInfo.orderUserName;    
                                    item.checkDate_ = new Date().toLocaleString();                   
                                }
                            }) 
                        }).catch( err =>{
                            alert(err)
                        });
                    }else {
                        axios({
                            method:'post',
                            url:this.BDMSUrl+'project2/checkResult/cancelCheckOrderDetail',
                            headers:{
                                token:this.token
                            },
                            params:{  
                                id:id,
                                projId:this.projId,
                                ugId: this.orderInfo.orderUgId,
                            }
                        }).then( res =>{
                            this.$message({
                                type: 'success',
                                message: res.data.msg,
                            });
                            this.orderDeatilData.map( (item,index)=>{
                                if( i == index){
                                    item.checkStatus = status;
                                    item.checkUserName = "";    
                                    item.checkDate_ = "";                       
                                }
                            }) 
                        }).catch( err =>{
                            alert(err)
                        });
                    }             
            });
            }else {
                this.$msgbox({
                title: bill,
                message: 
                h('div',null,[
                    h('p',{style:'color: #fc3439'},isSuse),
                    h('p',null,'清单名称：'+title),
                    h('p',null,'清单编号：'+orderDetailCode),
                    h('p',null,'货位号：'+warehouseName),
                ]
                ),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                        instance.confirmButtonLoading = false;
                        }, 300);
                    }, 1000);
                    } else {
                        done();
                    }
                }
                }).then(action => {
                    if( isOver1 == true ){
                        console.log("111"+action);
                        let warehouseId = this.warehouseId+','+this.huoJiaId+','+this.huoWeiId
                        axios({
                            method:'post',
                            url:this.BDMSUrl+'project2/receipt/receiptOrderDetail',
                            headers:{
                                token:this.token
                            },
                            params:{   
                                projId: this.projId,
                                id: id,
                                warehouseId: warehouseId,
                            }
                        }).then( res =>{
                            if(res.data.cd == 0){
                                this.$message({
                                    type: 'success',
                                    message: "验收清单成功！",
                                });
                                this.orderDeatilData.map( (item,index)=>{
                                    if( i == index){
                                        item.warehouseName = warehouseName;
                                        item.receiptStatus = status;
                                        item.receiptUserName = this.orderInfo.orderUserName;
                                        item.receiptDate_ = new Date().toLocaleString();                   
                                    }
                                }) 
                            }else {
                                this.$message({
                                    type: 'warring',
                                    message: "验收清单失败！",
                                });
                            }
                            
                        }).catch( err =>{
                            alert(err)
                        });
                    }else {
                        axios({
                            method:'post',
                            url:this.BDMSUrl+`project2/receipt/cancelReceiptDetail/${this.projId}/${id}`,
                            headers:{
                                token:this.token
                            },
                        }).then( res =>{
                            if(res.data.cd == 0){
                                this.$message({
                                    type: 'success',
                                    message: "撤销验收清单成功！",
                                });
                                this.orderDeatilData.map( (item,index)=>{
                                    if( i == index){
                                        item.receiptStatus = status;
                                        item.receiptUserName = "";
                                        item.receiptDate_ = "";
                                        item.warehouseName = "";
                                    }
                                })
                            }else{
                                this.$message({
                                    type: 'warring',
                                    message: '撤销验收清单失败！',
                                });
                            } 
                        }).catch( err =>{
                            alert(err)
                        });
                    }                  
                });
            }
        },
        handleClick(){
            this.selectIndexone = '-1';
            this.selectIndextwo = '-1';
            this.showDetail = true;
        },
        //获取群组
        getUserGroup(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getUserGroup',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        console.log("获取群组",response.data.rt)
                        this.userGroup = response.data.rt.ugList;
                        this.selectUser = response.data.rt.selectUgId;
                        this.getPlanList(this.selectUser);
                        this.getNoPlanList(this.selectUser);
                    } 
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //获取堆场信息
        getStore( isAdd ){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getWarehouse',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then( res =>{
                console.log("获取堆场信息",res);
                this.store = [];
                if( res.data.cd == 0 ){
                    if( res.data.rt != null ) {
                        this.store = res.data.rt;
                        if( isAdd ){
                            this.store.map( (item,index)=>{
                                if(item.id == this.warehouseId ){
                                    this.stockName = item.name;
                                }
                            });
                            // this.stockName = this.store[0].name;
                        }else {
                            this.stockName = this.store[0].name;
                            this.warehouseId = this.store[0].id;
                        }
                        
                        this.store.map( (item,index) =>{
                            if( item.image != null ){
                                item.imgPath = item.image.filePath;
                            }else{
                                item.imgPath = this.defaultImageUrl;
                            }
                            let obj = {};
                            obj.value = item.name;
                            obj.label = item.name;
                        });
                            console.log("获取堆场",this.store);                        
                    }
                }else{
                    alert(res.data.msg)
                }
            })
        },
        //获取货架、货位信息
        getHuoJia( id ){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getCurSelf',
                headers:{
                    token:this.token
                },
                params:{
                    projId: this.projId,
                    warehouseId: id,
                    pageNo: 1,
                    pageSize: 20,
                }
            }).then((res)=>{
                this.storage = [];
                let obj = res.data;
                if( obj.cd == 0){
                    this.storage = obj.rt.rows;
                    console.log("获取货架信息",this.storage);
                    this.isclickHuoJia = true; 
                }
                
            }).catch();
        },
        //已签收
        getPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'3' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
                            this.planData = response.data.rt.rows;
                            console.log("已签收",this.planData)
                        }else{
                            this.planData = [];
                        }
                        
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //未签收
        getNoPlanList(ugId){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/receipt/getOrderListByStatus',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    ugId:ugId,
                    orderStatus:'2' 
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        if(response.data.rt.rows!=null){
                            this.noPlanData = response.data.rt.rows;
                            console.log("未签收",this.noPlanData)
                        }else{
                            this.noPlanData = [];
                        }
                        
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        selectItem(item,index,flag){
            if(flag){
                this.selectIndextwo = index;
                this.isReceipt = false;
                this.showEditAllCheck = true;
                this.showEditAllReceipt = true;
            }else{
                this.selectIndexone = index;
                this.isReceipt = true;
                this.showEditAllCheck = false;
                this.showEditAllReceipt = false;
            }
            this.showDetail = false;
            this.itemTitle = item.orderTitle;
            this.getOrderDetail(item.id);
            this.getOrderPaymentItem(item.id);
            this.getOrderInfo(item.id)
        },
        //获取订单信息
        getOrderInfo(id){
            this.orderInfo = {};
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/order/getOrderInfo/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{                
                if(response.data.cd == 0){
                    this.orderInfo = response.data.rt;
                    console.log("获取订单信息",this.orderInfo)
                    if( this.orderInfo.checkDate != null && this.orderInfo.receiptDate != null ){                        
                        Object.assign(this.orderInfo,{
                            checkDate_:new Date(this.orderInfo.checkDate).toLocaleString(),
                            receiptDate_:new Date(this.orderInfo.receiptDate).toLocaleString(),
                        })
                    }else if( this.orderInfo.checkDate!=null && this.orderInfo.receiptDate == null ){
                        Object.assign(this.orderInfo,{
                            checkDate_:new Date(this.orderInfo.checkDate).toLocaleString(),
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取订单的清单列表
        getOrderDetail(id){
            this.orderDeatilData = [];   
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderDetail/'+id,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                
                if(response.data.cd == 0){
                    if(response.data.rt != null){                        
                        this.orderDeatilData = response.data.rt.rows;
                        let flag = this.orderDeatilData.some( (item,index) =>{
                            return item.checkStatus == 0;
                        });
                        if( !flag && this.orderInfo.checkStatus === 2){
                            this.orderInfo.checkStatus = 2;
                        }else{
                            this.orderInfo.checkStatus = 0;
                        }
                        console.log("获取订单的清单列表",this.orderDeatilData)
                        this.orderDeatilData.forEach((item)=>{
                            if( item.checkDate != null && item.receiptDate!=null ){
                                Object.assign(item,{
                                    checkDate_:new Date(item.checkDate).toLocaleString(),
                                    receiptDate_:new Date(item.receiptDate).toLocaleString(),
                                })
                            }else if( item.checkDate != null && item.receiptDate == null ){
                                Object.assign(item,{
                                    checkDate_:new Date(item.checkDate).toLocaleString(),
                                })
                            }
                        })
                        console.log("清单列表",this.orderDeatilData);
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //所属订单付款想列表
        getOrderPaymentItem(id){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/order/getOrderPaymentItem/'+id,
                headers:{
                    token:this.token
                },
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt != null){
                        this.orderInfoData = response.data.rt.rows;
                        console.log("所属订单付款想列表",this.orderInfoData)
                    }
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //查看详情
        viewDeatil(item){
            this.showCommonList = true;
        }
    }
}
</script>
<style lang="less">
#wuliao{
    ::-webkit-scrollbar{width:0px}
    
    .content-hidden {
        display: none;               
    }
    .topHeader{
        box-sizing: border-box;
        float: left;
        width: 100%;
        overflow: auto;
        max-height: 800px;
        .purchaseNav{
            height: 49px;
            padding-top: 16px;
            padding-left: 20px;
            background: #fafbfc;
            box-sizing: border-box;
            border-bottom: 1px solid #e6e6e6;
        }
        .elselect{
            overflow: hidden;
            margin-top:10px;
            margin-right: 50px;
            height: 40px;
            line-height: 40px;
            .el-select{
                float: right;
                margin-left: 10px;
            }
            .elselecttitle{
                float: right;
            }
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
            border: 1px solid #e6e6e6;
            margin: 10px 10px 10px 20px;
            display: flex;
            min-height: calc(100vh - 165px);
            .el-tabs__nav{
                height: 40px;
                line-height: 40px;
            }
        }
        .pbodyleft{
            width: 405px;
            height: 100%;
            border-right: 1px solid #e6e6e6;
            .el-tabs__content{
                margin-top: 10px;
                border-top: 1px solid #e6e6e6;
            }
            .leftcontent{
                .leftcontentul{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                }
                .lefttitle{
                    background: #f2f2f2;
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                }
                .lefttitlecontent{
                    height: 37px;
                    line-height: 37px;
                    text-align: left;
                    border-bottom: 1px solid #e6e6e6;
                    cursor: pointer;
                }
                .selectActive{
                    color: #333;
                    font-weight: bold;
                }
                .lefttitlelab{
                    display: inline-block;
                    margin-left: 20px;
                }
                .lefttitlespan{
                    display: inline-block;
                    margin-left: 87px;
                }
                .lefttitlespanone{
                    margin-left: 40px;
                }
            }
        }
        .pbodyright{
            flex: 1;
            overflow: scroll;
            .pbodyrighttitle{
                height: 39px;
                margin: 0;
                padding: 0;
                border-bottom: 1px solid #e6e6e6;
                text-align: left;
                line-height: 39px;
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
            .jindu{
                border-bottom: 1px solid #e6e6e6;
                margin: 0 30px 0 20px;
                text-align: left;
                height: 44px;
                line-height: 44px;
            }
            .titleimg{
            width: 15px;
            height:16px;
            display: inline-block;
            margin-right: 10px;
            background: url('./images/jindu.png') ;
            position: relative;
            top: 2px;
            }
            .shebeiimg{
                width: 14px;
                height:16px;
                display: inline-block;
                margin-right: 10px;
                background: url('./images/shebei.png') ;
                position: relative;
                top: 2px;
            }
            .titletext{
                color: #fc3439;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .borderbottom1{
            margin: 16px 30px 0px 20px;
        }
        .huowei{
            display: flex;
            margin-bottom: 30px;
            .huoweileft{
                width: 74px;
                font-size: 14px;
                color: #999;
                text-align: left;
            }
            .huoweiright{   
                flex: 1;
                border: 1px solid #fc3439;
                .huiweirighttitle{
                    height: 70px;
                    line-height: 70px;
                    margin: 0 20px;
                    text-align: left;
                    border-bottom: 1px solid #e6e6e6;
                    font-size: 14px;
                    color: #fc3439;
                    span {
                        cursor: pointer;
                    }
                }
                .huiweirightimg{
                    list-style: none;
                    padding: 0;
                    margin: 20px 0 20px 0px;
                    overflow: hidden;
                    li{
                        width: 160px;
                        height: 160px;
                        float: left;
                        margin-left: 20px;
                        .store {
                            display: inline-block;
                            width:158px;
                            height:158px;
                            position: relative;
                            border:1px solid #e6e6e6;
                            z-index:10;
                            .store_img {
                                display: inline-block;
                                position: absolute;
                                // margin: ;
                                top:0;
                                left:0;
                                width:100%;
                                height:100%;
                                z-index:1;
                                img {
                                    width: 158px;
                                    height: 158px;
                                    cursor: pointer;
                                }
                            }   
                            .store_edit {
                                display: inline-block;
                                width:100%;
                                height:50%;
                                position: absolute;
                                left:0;
                                bottom:0;
                                z-index: 2;
                                .store_name {
                                    position: absolute;
                                    width:100%;
                                    color: #e6e6e6;
                                    text-align: center;
                                    left:0;
                                    top:0;                                   
                                }
                                .store_edit_detail {
                                    position: absolute;
                                    bottom: 0px;
                                    left: 0;
                                    width: 100%;
                                    height: 50px;
                                    background: rgba(84, 84, 84,0.5);
                                    z-index: 3; 
                                    display: flex;
                                    justify-content: space-around;
                                    align-items: center;
                                    a{
                                        width:16px;
                                        height:16px;
                                        cursor: pointer;
                                        .edit {
                                            width:16px;
                                            height:16px;
                                            background: url('./images/edit.png') no-repeat  center center;
                                        }
                                        .image {
                                            width:16px;
                                            height:16px;
                                            background: url('./images/upload.png') no-repeat center center;
                                        }
                                        .delete {
                                            width:16px;
                                            height:16px;
                                            background: url('./images/delete2.png') no-repeat center center;
                                        }
                                    }
                                }
                            }                           
                        }
                    }
                    li:last-child {
                        cursor: pointer;
                        background: #f0f1f4 url('./images/add.png') no-repeat center center;
                        div {
                            margin: 100px auto;
                        }
                    }
                }
                .huojia {
                    list-style: none;
                    padding: 0;
                    margin: 20px;
                    overflow: hidden;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e6e6e6;
                    li {
                        width: 80px;
                        height: 35px;
                        float: left;
                        margin-right: 20px;
                        text-align: center;
                        line-height: 35px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    li:last-child{
                        background: none;
                        width:200px;
                        .addHuoJia {
                            display: flex;
                            justify-content: space-around;
                            line-height: 35px;
                            .content {
                                width:60px;
                                height:30px;
                                border:2px solid #e6e6e6;
                                line-height: 35px;
                            }
                            .sure {
                                width:50px;
                                height:35px;
                                text-align: center;
                                line-height: 35px;
                                 background:#fc3439;
                                color: #fff;
                            }
                            .cancel {
                                width:50px;
                                height:35px;
                                text-align: center;
                                line-height: 35px;
                                background: #f0f0f0;
                            }
                        }
                    }
                    .active {
                        background:#fc3439;
                        color: #fff;
                    }
                    .noactive {
                        background: #f0f0f0;
                    }
                }
                .huowei {
                    list-style: none;
                    padding: 0;
                    margin: 20px;
                    overflow: hidden;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e6e6e6;
                    li {
                        width: 80px;
                        height: 35px;
                        float: left;
                        margin-right: 20px;
                        text-align: center;
                        line-height: 35px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    li:last-child{
                        background: none;
                        width:200px;
                        .addHuoWei {
                            display: flex;
                            justify-content: space-around;
                            line-height: 35px;
                            .content {
                                width:60px;
                                height:30px;
                                border:2px solid #e6e6e6;
                                line-height: 35px;
                            }
                            .sure {
                                width:50px;
                                height:35px;
                                text-align: center;
                                line-height: 35px;
                                 background:#fc3439;
                                color: #fff;
                            }
                            .cancel {
                                width:50px;
                                height:35px;
                                text-align: center;
                                line-height: 35px;
                                background: #f0f0f0;
                            }
                        }
                    }
                    .active {
                        background:#fc3439;
                        color: #fff;
                    }
                    .noactive {
                        background: #f0f0f0;
                    }
                }
            }
        }
        .tableinfo{
            height: 32px;
            border-bottom: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            text-align: left;
            line-height: 32px;
            font-size: 12px;
            .checkqz{
                margin-left: 10px;
                color: #999;
            }
            .checkpeo{
                margin-left: 61px;
                color: #999;
            }
            .checktime{
                margin-left: 61px;
                color: #999;
            }
            .checktext{
                color: #333;
            }
        }
        .borderbottom{
            margin: 10px 30px 30px 20px;
        }
        .quanxuan{
            text-align:left;
            margin: 0 0 13px 0;
            line-height: 12px;
            overflow: hidden;
            .el-checkbox__label{
                font-size:12px;
                color: #999;
            }
            .btn{
                border: none;
                width: 75px;
                height: 28px;
                background: #f2f2f2;
                font-size: 12px;
                color: #666;
                float: right;
                cursor: pointer;
            }
        }
        .huoweixuanz{
            .huoweilabel{
                color: #999;
                font-size: 14px;
                line-height: 14px;
            }
        }
        .detailsIcon, .editIcon, .backIcon {
            float: left;
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 10px;
        }
        .detailsIcon{
            background: url('./images/detail.png') no-repeat 0 0;
        }
        .editIcon{
            background: url('./images/save1.png') no-repeat 0 0;
        }
        .backIcon{
            background: url('./images/back1.png') no-repeat 0 0;
        }
        .UserList{
            border-collapse: collapse;
            border: 1px solid #e6e6e6;
            thead {
                background: #f2f2f2;
                th {
                padding-left: 10px;
                height: 36px;
                text-align: left;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                font-size: 12px;
                color: #333333;
                }
            }
            tbody {
                tr {
                    td {
                        padding-left: 10px;
                        height: 36px;
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                    }
                    &:hover {
                        background: #fafafa;
                    }
                }
            }
        }
    } 
    .editBody{
        margin: 0 auto;
    }
    .editBodytwo{
        margin-top: 20px;
    }
    .imageBody{
       text-align: left;
    }
    .imageBody .imageBodyText{
        color: #666;
        font-size: 14px;
        line-height: 14px;
        font-weight: normal;
        display: inline-block;
        margin-right: 20px;
        margin-left: 94px;
        text-align: right;
   }
   .updataImageSpan{
        overflow: hidden;
        width: 98px;
    }
    .updataImageSpan input{
        position: absolute;
        left: 0px;
        top: 0px;
        opacity: 0;
        /* -ms-filter: 'alpha(opacity=0)'; */
    }
    .upImgBtn{
        width: 98px;
        height: 26px;
        border: 1px solid #ccc;
        cursor: pointer;
        background: #f9f9f9;
        font-size: 14px;
        font-weight: normal;
        color: #666;;
    }
    .upImgText{
        font-size:14px;
        line-height: 14px;
        display: inline-block;
        margin-left: 10px;
        font-weight: normal;
        color: #999;
    }
    .dialog-footer{
        text-align: center;
    }
    .editBtnS,.editBtnC{
        width: 111px;
        height: 36px;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 2px;
    }
    .editBtnS{
        background: #fc3439;
        margin-right: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .editBtnS:hover{
        background: #ff5257;
    }
    .editBtnC{
        color: #666;
        background: #fff;
        border: 1px solid #ccc;
    }
    .editBtnC:hover{
        background: #e6e6e6;
        color: #666;
    }
}
</style>

