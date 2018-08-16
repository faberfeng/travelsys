<template>
    <div id="safetyChecking">
            <div class="topHeader">
                <div id="item-box-file">
                    <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                    质量检查
                    </router-link>
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item label-item-active">  
                    安全检查  
                    </router-link>
                </div>
                <div id="project" v-show="showSafetyCheck">
                    <div class="project_left">
                        <div class="information">
                            <h5 class="basic_information"><img class=imgIcon src="./images/information.png">基本信息</h5>
                            <div class="information_table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>项目名称</th>
                                            <th>检查频率</th>
                                            <th>负责单位</th>
                                            <th>负责人</th>
                                            <th>检查单位</th>
                                            <th>检查负责人</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="checkItemDataList">
                                            <td v-text="checkItemDataList.item.itemName"></td>
                                            <td></td>
                                            <td v-text="checkItemDataList.respDeptName"></td>
                                            <td v-text="checkItemDataList.respUserName"></td>
                                            <td v-text="checkItemDataList.checkDeptName"></td>
                                            <td v-text="checkItemDataList.checkUserName"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="checkSite">
                            <h5 class="checkSite_header"><img class=imgIcon src="./images/checksite.png">检查点位列表</h5>
                            <div class="checkLabelBtn">
                                <div class="btn" @click="printAllLabel" >打印全部标签</div>
                                <div class="btn1" @click="editSite">编辑点位</div>
                            </div>
                            <div class="checkSite_table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>位置</th>
                                            <th>安全状态</th>
                                            <th>检查时间</th>
                                            <th>检查人</th>
                                            <th>待查状态</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr :class="{'check':index==isshow}" v-for="(item,index) in checkPointsByItemIdList" :key="index" @click="checkItem(index)">
                                            <td>{{index+1}}</td>
                                            <td>{{item.checkPoint.name}}</td>
                                            <td>{{item.checkRecord.currCheckStatus}}</td>
                                            <td>{{item.checkRecord.checkTime | changeTime()}}</td>
                                            <td>{{item.checkUserName | nameChange()}}</td>
                                            <td>{{item.checkRecord.expectCheckStatus}}</td>
                                            <td>
                                                <button class="printLabelBtn actionBtn" @click.stop="printLabel(item.checkRecord.id)" title="打印标签"></button>
                                                <button class="checkBtn actionBtn" @click="srCheck(item.checkPoint.id)" title="检查"></button>
                                                <button class="deleteBtn actionBtn" @click="deleteCheckPoint(item.checkPoint.id)" title="删除"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                             <!--以下是page-navigitation-->
                            <div class="datagrid-pager pagination">
                                <table cellspacing="0" cellpadding="0" border="0" >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select class="pagination-page-list" v-model="pageDetial.pagePerNum">
                                                    <option value="4">4</option>
                                                    <option value="8">8</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </td>
                                            <td>
                                                    <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0,true)"></a>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1,true)"></a>
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
                                                <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1,true)"></a>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2,true)"></a>
                                            </td>
                                            <td>
                                                <div class="pagination-btn-separator"></div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" @click="getCheckPointsByItemId" class="btn-refresh btn-TAB"></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="bottom_table">
                                <div class="header_text">
                                    <span class="text">点位【】检查记录</span>
                                    <div class="selectBtn">
                                        <span class="pre_btn">上一条</span>
                                        <span class="next_btn">下一条</span>
                                    </div>
                                </div>
                                <div class="header_body" style="min-width: 1000px; overflow: auto">
                                    <p>
                                        <span>检查序号：</span><span id="checkNumber"></span>
                                        <span>状态：</span><span id="checkStatus"></span>
                                        <span>检查人：</span><span id="checkUser3"></span>
                                        <span>检查时间：</span><span id="checkTime"></span>
                                    </p>
                                    <ul id="checkPics" style="overflow: auto;"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="project_right">
                        <div class="checkProjectList_header">
                            <span class="text">检查项目目录</span>
                            <span class="clearfix_icon">
                                <i class="icon-goujian icon-add" title="添加"></i>
                                <i class="icon-goujian icon-edit"  title="更名"></i>
                                <i class="icon-goujian icon-delete" @click="deleteItemNode"  title="删除"></i>
                            </span>
                        </div>
                        <div class="tree">
                            <el-tree id="treeData" ref="treeData" highlight-current  node-key="id" :empty-text="'内容为空'" :data="loadzTreeDataList"  :props="defaultProps" @node-click="nodeClick">
                            </el-tree>
                        </div>
                    </div>

                </div>
            </div>
            <div v-if="labelListShow"  id="edit" class="dialog">
                    <div class="el-dialog__header">
                        <span class="el-dialog__title">标签信息预览</span>
                        <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListCancle">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                        </button>
                    </div>
                    <div class="el-dialog__body">
                        <div class="editBody">
                            <ul>
                                <li v-for="(item,index) in checkPointsForPageList" :key="index" class="item-label clearfix">
                                    <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-CP-' + addZero(item.id, 7)" alt="">
                                    <div class="right">
                                        <p class="item-list clearfix">
                                            <span class="text-left">点位名称：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,item.name)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">安全类别：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查项目：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查频率：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respUserName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkUserName)"></span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <!-- <el-pagination background v-if="!singleLable" layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                            @current-change="getCheckPointsForPage()" 
                            @prev-click="getCheckPointsForPage()"
                            @next-click="getCheckPointsForPage()"
                            :total="pageLabelList.total">
                            </el-pagination> -->
                        </div>
                    </div>
                    <div class="el-dialog__footer">
                        <div slot="footer" class="dialog-footer">
                            <button class="editBtnS">网页预览</button> 
                            <button class="editBtnC">打印当前页标签</button>
                        </div>
                    </div>
            </div>
            <div v-if="labelListShow1"  id="edit" class="dialog">
                    <div class="el-dialog__header">
                        <span class="el-dialog__title">标签信息预览</span>
                        <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="labelListCancle">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                        </button>
                    </div>
                    <div class="el-dialog__body">
                        <div class="editBody">
                            <ul>
                                <li v-for="(item,index) in checkPointsForPageList" :key="index" class="item-label clearfix">
                                    <img class="img_left" :src="BDMSUrl+'QRCode2/getQRimage/QR-CP-' + addZero(item.id, 7)" alt="">
                                    <div class="right">
                                        <p class="item-list clearfix">
                                            <span class="text-left">点位名称：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,item.name)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">安全类别：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查项目：</span>
                                        <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查频率：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.item.itemName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">负责人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.respUserName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查群组：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkDeptName)"></span>
                                        </p>
                                        <p class="item-list clearfix">
                                            <span class="text-left">检查人员：</span>
                                            <span class="text-right" v-text="testIfIsNull(null,null,checkItemDataList.checkUserName)"></span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <!-- <el-pagination background v-if="!singleLable" layout="prev, pager, next" :current-page.sync="pageLabelList.currentPage"
                            @current-change="getCheckPointsForPage()" 
                            @prev-click="getCheckPointsForPage()"
                            @next-click="getCheckPointsForPage()"
                            :total="pageLabelList.total">
                            </el-pagination> -->
                        </div>
                    </div>
                    <div class="el-dialog__footer">
                        <div slot="footer" class="dialog-footer">
                            <button class="editBtnS">网页预览</button> 
                            <button class="editBtnC">打印当前页标签</button>
                        </div>
                    </div>
            </div>
            <div id="mask" v-if="labelListShow||labelListShow1" ></div>
            <div id="edit">
                <el-dialog width="400px" title="安全状态修改" :visible="securityStatusShow" @close="srStatusCancle">
                    <div class="editBody">
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="securityStatus" label="1">确认安全</el-radio>
                        </div>
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="securityStatus"  label="2">需要整改</el-radio>
                        </div>
                        <div class="editBodytwo imageBody" style="padding-left:-15px;">
                            <el-radio v-model="securityStatus"  label="3">急需整改</el-radio>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="srStatusConfirm">确定</button>
                        <button class="editBtnC" @click="srStatusCancle">取消</button>
                    </div>
                </el-dialog>

                <!-- <el-dialog width="400px" title="添加安全检查项目" :visible="securityStatusShow" @close="srStatusCancle">

                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="srStatusConfirm">确定</button>
                        <button class="editBtnC" @click="srStatusCancle">取消</button>
                    </div>
                </el-dialog> -->
            </div>
            <div id="inital">
                <!-- 检查点位删除 -->
                <el-dialog  :visible.sync="deleteCheckPointDialog" width="398px" @close="deleteCheckPointClose">
                    <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                    <p class="deleteDialogWarning">删除提醒</p>
                    <p class="deleteDialogText">确定要删除选定的检查点位吗？该操作会删除该点位下所有的检查记录！</p>
                    <div slot="footer" class="dialog-footer">
                        <button class="deleteBtn" @click="deleteCheckPointMakeSure">确认</button>
                        <button class="cancelBtn" @click="deleteCheckPointClose">取消</button>
                    </div>
                </el-dialog>
                <!-- 删除检查项目节点 -->
                <el-dialog  :visible.sync="deleteItemNodeDialog" width="398px" @close="deleteItemNodeClose">
                    <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                    <p class="deleteDialogWarning">删除提醒</p>
                    <p class="deleteDialogText">确定要删除当前检查项目节点吗？</p>
                    <p class="deleteDialogCare">注意：所有与当前项目节点关联的检查点位、点位的检查记录都将被删除，并且不可恢复！</p>
                    <div slot="footer" class="dialog-footer">
                        <button class="deleteBtn" @click="deleteItemNodeMakeSure">确认</button>
                        <button class="cancelBtn" @click="deleteItemNodeClose">取消</button>
                    </div>
                </el-dialog>
            </div>
    </div>
</template>
<script>
import axios from 'axios'
import data from '../Settings/js/date.js'
import moment from 'moment'
export default {
    name:'safetyChecking',
    data(){
        return{
            entType:'',
            ugId:'',
            checkItemDataList:'',
            checkPointsByItemIdList:'',
            pointTotal:'',
            checkPointsForPageList:'',
            pointsForPagePager:'',
            loadzTreeDataList_original:'',//原始树形图
            loadzTreeDataList:[],
            itemId:-1,
            page:1,//默认
            rows:8, //默认
            showSafetyCheck:false,
            defaultProps:{
                children: 'children',
                label: 'itemName'
            },
             pageDetial:{
                pagePerNum:8,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:'',//所有数据
            },
            isshow:'',
            labelListShow:false,
            labelListShow1:false,
            deleteCheckPointDialog:false,
            deleteItemNodeDialog:false,
            pageLabelList:{
                pagePerNum:20,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            singleLable:false,
            securityStatus:'',
            securityStatusShow:false
        }
    },
    created(){
        var vm = this;
        // vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        vm.getSecurityCheck();
        vm.loadzTreeData();
        vm.getCheckPointsByItemId();
        vm.getCheckItemData();
    },
    mount(){

    },
    watch:{
        'pageDetial.currentPage':function(val,oldval){
            var vm = this
            vm.getCheckPointsByItemId()
        },
        'pageDetial.pagePerNum':function(val,oldval){
            var vm = this
            vm.getCheckPointsByItemId()
        },
        'pageDetial.currentPage':function(val,oldval){
          var vm = this
          vm.getCheckPointsForPage()
      },
      'pageDetial.pagePerNum':function(val,oldval){
          var vm = this
          vm.getCheckPointsForPage()
      },

    },
    filters:{
        changeTime(val){
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
        },
        nameChange(val){
            if(val==null){
                val='系统'
            }
            return val;
        }
    },
    methods:{
    //进入安全检查页面
    getSecurityCheck(){
        axios({
            method:'get',
            url:this.BDMSUrl+'/project2/security/securityCheck',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
            },
            
        }).then(response=>{
            if(response.data.cd=='0'){
                this.entType=response.data.rt.entType;
                this.ugId=response.data.rt.ugId;
                this.validateAuth();
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //验证用户权限
    validateAuth(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
                type:this.entType,
            },
            url:this.BDMSUrl+'/project2/buildSite/validateAuth'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.showSafetyCheck=true;
                // this.checkItemDataList=response.data.rt;
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查项目目录
    loadzTreeData(){
        var vm = this
            var setting={
                data:{
                    key:{
                        name: "itemName",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "itemId",
                        pIdKey: "parentItemId",
                        rootPId: 0
                    }
                }
            };
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId
            },
            url:this.BDMSUrl+'/project2/security/loadzTreeData'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.loadzTreeDataList_original=response.data.rt;
                this.loadzTreeDataList=data.transformTozTreeFormat(setting, response.data.rt);
                // console.log(this.loadzTreeDataList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查项目基本信息
    getCheckItemData(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/getCheckItemData'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkItemDataList=response.data.rt;
                console.log(this.checkItemDataList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //获取检查点位列表及对应点位最新的检查记录
    getCheckPointsByItemId(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId,
                projId:this.projId,
                page:this.pageDetial.currentPage,
                rows:this.pageDetial.pagePerNum
            },
            url:this.BDMSUrl+'/project2/security/getCheckPointsByItemId'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkPointsByItemIdList=response.data.rt.rows;
                this.pointTotal=response.data.rt.total;
                console.log(this.checkPointsByItemIdList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    nodeClick(obj){
        this.itemId=obj.itemId;
        console.log(this.itemId);
        this.getCheckItemData();
        this.getCheckPointsByItemId();
        
    },
    checkItem(num){
        this.isshow=num;
        console.log('dhsjdhj');
    },
    //打印全部标签
    printAllLabel(){
        this.labelListShow=true;
        this.getCheckPointsForPage();
    },
    labelListCancle(){
        this.labelListShow=false;
    },
    testIfIsNull(row, column, cellValue, index){
          if(cellValue == null)return '/'
          return cellValue
      },
      addZero(num,size){
        var len = ('' + num).length;
        return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
    },
    //获取指定检查项目下的指定页面的检查点位
    getCheckPointsForPage(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
                itemId:this.itemId,
                projId:this.projId,
                page:this.pageLabelList.currentPage,
                rows:this.pageLabelList.pagePerNum
            },
            url:this.BDMSUrl+'/project2/security/getCheckPointsForPage'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.checkPointsForPageList=response.data.rt.rows;
                this.pointsForPagePager=response.data.rt.pager;
                console.log(this.checkPointsForPageList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    //编辑点位
    editSite(){

    },
    //打印标签
    printLabel(num){
        // this.labelListShow1=true;
        this.getRelaFilesByCrId(num);
    },
    //获取检查记录关联的图片信息
    getRelaFilesByCrId(num){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               id:num
            },
            url:this.BDMSUrl+'/project2/security/getRelaFilesByCrId'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.getRelaFilesByCrIdList=response.data.rt;
                console.log(this.getRelaFilesByCrIdList);
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    srCheck(num){
        this.checkPointId=num;
         this.securityStatusShow=true;
    },
    srStatusCancle(){
        this.securityStatusShow=false;
    },
    srStatusConfirm(){
        var vm=this;
         axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               currCheckStatus:this.securityStatus,
               projId:this.projId,
               checkPointId:this.checkPointId
            },
            url:this.BDMSUrl+'/project2/security/updateCheckPointSecurityStatus'
        }).then(response=>{
            if(response.data.cd=='0'){
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                    vm.getCheckPointsByItemId();

            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })


    },
    //删除检查点位
    deleteCheckPoint(num){
        this.checkPointId=num;
        this.deleteCheckPointDialog=true;
    },
    //删除检查点位确认
    deleteCheckPointMakeSure(){
        var vm=this;
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               id:this.checkPointId
            },
            url:this.BDMSUrl+'/project2/security/deleteCheckPoint'
        }).then(response=>{
            if(response.data.cd=='0'){
                this.deleteCheckPointDialog=false;
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                vm.getCheckPointsByItemId();
            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    deleteCheckPointClose(){
        this.deleteCheckPointDialog=false;
    },
    //删除检查项目节点
    deleteItemNode(){
        this.deleteItemNodeDialog=true;
    },
    deleteItemNodeMakeSure(){
        var vm=this;
         axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/deleteItemNode'
        }).then(response=>{
            if(response.data.cd=='0'){
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                    vm.loadzTreeData();
                    this.itemId='';
                    this.deleteItemNodeDialog=false;

            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })
    },
    deleteItemNodeClose(){
        this.deleteItemNodeDialog=false;
    },
    //获取当前项目的用户群组
    getManageDept(){
        axios({
            method:'get',
            headers:{
                'token':this.token
            },
            params:{
               itemId:this.itemId
            },
            url:this.BDMSUrl+'/project2/security/getManageDept'
        }).then(response=>{
            if(response.data.cd=='0'){
                vm.$message(
                    {type:'success',
                    message:response.data.msg})
                    vm.loadzTreeData();
                    this.itemId='';
                    this.deleteItemNodeDialog=false;

            }else if(response.data.cd=='-1'){
                alert(response.data.msg);
            }
        })

    },
    changePage(val,isTop){//分页 0 -1 1 2
                var vm = this; 
                if(isTop){
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
                }else{
                      if(vm.pageDetial_1.currentPage == 1 && (val == 0 || val == -1)){
                        vm.$message('这已经是第一页!')
                        return false
                        }
                        if(vm.pageDetial_1.currentPage >= Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum) && (val == 1 || val == 2)){
                            vm.$message('这已经是最后一页!')
                            return false
                        }
                        switch(val){
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
                                vm.pageDetial_1.currentPage = Math.ceil(vm.pageDetial_1.total/vm.pageDetial_1.pagePerNum)
                                break;
                        }
                }
        }

    },
    // labelListConfirm(){
    //         var vm = this;
    //         var manifestId = '';
    //         if(this.isGongChengLiang){
    //             manifestId = this.manifestIdOne;
    //         }else{
    //             manifestId =vm.manifestId;
    //         }
    //         if(vm.singleLable == true){
    //             window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/'+vm.S_Label_quantitiesList[0].pkId)
    //         }else{
    //             window.open('/#/Cost/getManifestDetailInfoForPage/'+manifestId+'/0')
    //         }
    //   },


    
}
</script>
<style lang="less">
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
     .tree{
            height:200px;
            margin:10px 10px;
            overflow-y:auto;
                                    
            #treeData{
                .el-tree-node:focus .el-tree-node__content{
                    background-color: transparent;
                    }
                .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                        background-color: #dfdfdf;
                }
                .el-tree-node__label{
                    font-size: 12px;
                    color: #666666;
                    padding-left: 22px; 
                    position: relative;
                }
                .el-icon-caret-right:before{
                    content: "\E604";
                    color: #999999;
                    font-weight: bold;
                }
            
                .is-leaf:before{
                    content: ""!important;
                    color: #999999;
                    font-weight: bold;
                }
                .el-tree-node__label::before{
                    display: block;
                    position: absolute;
                    top: 2px;
                    left: 4px;
                    width: 14px;
                    height: 13px;
                    background: url('../ManageCost/images/file.png')no-repeat 0 0;
                    content: '';
                }
                .fileIcon::before{
                    width: 16px;
                    height: 16px;
                    top: 0px;
                    background-image: url('../ManageDesign/images/zTreeStandard.png');
                    background-position: -110px -32px;
                }
                .el-tree-node__content{
                        height: 30px;
                }
                .is-current .el-tree-node__content{
                    color: #333333;
                    font-weight: bold;
                }
            } 
        }
    #safetyChecking{
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
        }
        #project{
            width: 100%;
            height: 90%;
            padding:20px;
            margin-top:5px;
            .project_left{
                // border:1px solid red;
                width: 80%;
                height: 100%;
                float: left;
                .information{
                    margin-top:10px;
                    height:60px;
                    margin-bottom:25px;
                    .basic_information{
                        float: left;
                        margin-left:22px;
                        width: 100%;
                        color: #fc3439;
                        text-align: left;
                        font-size: 16px;
                        line-height: 16px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 11px;
                        margin: 0 0 0 0;
                        .imgIcon{
                            margin-right:11px;
                        }
                    }
                    .information_table{
                        width: 100%;
                        table {
                            margin: 0 auto;
                            width: 100%;
                            border-collapse: collapse;
                            // border-top: 1px solid #e6e6e6;
                            border-bottom: 1px solid #e6e6e6;
                            thead {
                            background: #f2f2f2;
                            tr {
                                th {
                                padding-left: 10px;
                                height: 30px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                border-left: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #666666;

                                }
                            }
                            }
                            tbody {
                            background: #fff;
                            tr {
                                td {
                                    padding-left: 10px;
                                    height: 30px;
                                    text-align: left;
                                    font-size: 12px;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    border-left: 1px solid #e6e6e6;
                                    color: #666666;
                                    border-bottom: 1px solid #e6e6e6;
                                    max-width: 80px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    
                                }
                            }
                            }
                        }   
                    }
                }
                .checkSite{
                    margin-top:75px;
                    height:300px;
                    // border:1px solid red;
                    margin-bottom:25px;
                    position: relative;
                    .checkSite_header{
                        float: left;
                        margin-left:22px;
                        width: 100%;
                        color: #fc3439;
                        text-align: left;
                        font-size: 16px;
                        line-height: 16px;
                        font-family: '微软雅黑';
                        font-weight: bold;
                        border-bottom: 1px solid #e6e6e6;
                        padding-bottom: 11px;
                        margin: 0 0 0 0;
                        .imgIcon{
                            margin-right:11px;
                        }
                    }
                    .checkLabelBtn{
                            width: 200px;
                            float:right;
                            position: absolute;
                            top:-1px;
                            right: 13px;
                        .btn{
                            margin-right:10px;
                            line-height: 23px;
                            padding:2px 12px;
                            font-size:14px;
                            display:inline-block;
                            height: 26px;
                            border: none;
                            cursor: pointer;
                            background-color:#f2f2f2;
                            border:1px solid #f3f3f3;
                            }
                        .btn1{
                        margin-right:-4px;
                        line-height: 23px;
                        padding:2px 12px;
                        font-size:14px;
                        float: right;
                        display:inline-block;
                        height: 26px;
                        border: none;
                        cursor: pointer;
                        background-color:#f2f2f2;
                        border:1px solid #f3f3f3;
                        }
                    }
                    .checkSite_table{
                        width: 100%;
                            table {
                                margin: 0 auto;
                                width: 100%;
                                border-collapse: collapse;
                                // border-top: 1px solid #e6e6e6;
                                border-bottom: 1px solid #e6e6e6;
                                thead {
                                    background: #f2f2f2;
                                    tr {
                                        th {
                                        padding-left: 10px;
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        border-left: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #666666;

                                        }
                                    }
                                }
                                tbody {
                                    background: #fff;
                                    .check{
                                        background:#0081c2;
                                        td{color:#fff !important;}
                                    }
                                    tr {
                                        td {
                                        padding-left: 10px;
                                        height: 30px;
                                        text-align: left;
                                        font-size: 12px;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        border-left: 1px solid #e6e6e6;
                                        color: #666666;
                                        border-bottom: 1px solid #e6e6e6;
                                        max-width: 80px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        .actionBtn{
                                                width: 16px;
                                                height: 17px;
                                                border: none;
                                                cursor: pointer;
                                                margin-right: 16px;
                                        }
                                        .printLabelBtn{
                                            background: url('./images/Printing.png') no-repeat;
                                        }
                                        .checkBtn{
                                            background: url('./images/check.png') no-repeat;
                                        }
                                            .deleteBtn{
                                            background: url('../../assets/delete.png') no-repeat;
                                        }
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
                        // padding: 3px 4px;
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
                }
                .bottom{
                    .bottom_table{
                        .header_text{
                            width: 100%;
                            height: 40px;
                            border:1px solid #999;
                            background-color:#f5f5f5;
                            position: relative;
                            .text{
                                float: left;
                                font-size:14px;
                                line-height: 40px;
                                margin-left:10px;
                                color:#666;
                            }
                            .selectBtn{
                                width: 150px;
                                float:right;
                                position: absolute;
                                top:4px;
                                right: 13px;
                                .pre_btn{
                                    margin-right:5px;
                                    line-height: 21px;
                                    padding:2px 12px;
                                    font-size:14px;
                                    display:inline-block;
                                    height: 26px;
                                    border: none;
                                    cursor: pointer;
                                    background-color:#ffffff;
                                    border:1px solid #f3f3f3;
                                }
                                .next_btn{
                                    margin-right:-4px;
                                    line-height: 21px;
                                    padding:2px 12px;
                                    font-size:14px;
                                    float: right;
                                    display:inline-block;
                                    height: 26px;
                                    border: none;
                                    cursor: pointer;
                                    background-color:#ffffff;
                                    border:1px solid #f3f3f3;
                                }
                            }
                        }
                        .header_body{
                            p{
                                margin-top:10px;
                                float: left;
                                span{
                                    margin-right: 20px;
                                    font-size:14px;
                                    line-height: 14px;
                                    color:#333333;
                                }
                            }


                        }
                    }

                }
            }
            .project_right{
                border:1px solid #999;
                // border-left:1px solid #999;
                // border-top:1px solid #999;
                width: 18%;
                height: 100%;
                float: right;
                .checkProjectList_header{
                    height: 40px;
                    border-bottom:1px solid #999; 
                    // min-width: 200px;
                    .text{
                        font-size: 16px;
                        line-height: 40px;
                        float: left;
                        display: inline-block;
                        margin-left:10px;
                        color: #333333;
                        font-weight: bold;
                    }
                    .clearfix_icon{
                        float: right;
                        display: inline-block;
                        margin-top:12px;
                        // width: 60%;
                        max-width: 200px;
                        .icon-goujian{
                            float: left;
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                        }
                        .icon-add{
                            background: url('../ManageCost/images/add.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                            }
                        }
                        .icon-edit{
                            float: right;
                            background: url('../ManageCost/images/edit.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/edit1.png')no-repeat 0 0;
                            } 
                        }
                        .icon-delete{
                            float: right;
                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                            margin-right: 10px;
                            &:hover{
                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                            } 
                        }
                    }

                }
               
            }
        }
        .dialog{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
            z-index: 3001;
            position: fixed;
            background: #fff;
            .el-dialog__body{
                margin-top: 20px;
            }
            .editBody{
                margin: 0 20px;
                .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
                    margin: 0 5px;
                }
            }
            .item-label{
                border-bottom: 1px solid #ebebeb;
                .img_left{
                    float: left;
                    width: 90px;
                    height: 90px;
                    margin:40px 30px 0 10px;
                }
                .right{
                    float: left;
                    width: 450px;
                    .item-list{
                        margin-bottom: 14px;
                        .text-left{
                            float: left;
                            font-size: 12px;
                            line-height: 12px;
                            width: 80px;
                            color: #999;
                            text-align: left;
                        }
                        .text-right{
                            float: left;
                            width: 300px;
                             font-size: 12px;
                            line-height: 12px;
                            color: #333333;
                            text-align: left;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        &:last-of-type{
                             margin-bottom: 20px; 
                        }
                    }
                }
                &:last-of-type{
                    border-bottom: none;
                }
            }
             .item-attibuteAuth{
                 float: left;
                 width: 33.3%;
                 padding-left: 78px;
                 height: 14px;
                 line-height: 14px;
                 margin-bottom: 26px;
                 text-align: left;
                 .text{
                    font-size: 14px;
                    color: #666666;
                    margin-left: 10px;
                 }
                .checkbox-fileItem{
                    float: left;
                    position: relative;
                    padding-left:20px; 
                    cursor: pointer;
                    &::before{
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 12px;
                        height: 12px;
                        border: 1px solid #cccccc;
                        cursor: pointer;
                        background: #fff;
                        content: '';
                    }
                }
                .active{
                     &::before{
                        background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                        border: 1px solid #fc3439;
                     }
                }
                .checkbox-arr{
                    display: none;
                }
             }
        }
        #mask{
            z-index: 3000;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
        }
        //删除弹出框
        #inital{
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
                margin: 16px 5px 0px 5px;
            }
            .deleteDialogCare{
                color: #333333;
                font-size: 14px;
                line-height: 14px;
                font-family: 'MicrosoftYahei';
                font-weight: normal;
                margin: 16px 5px 0px 5px;
                 color: #fc3439;
            }
        }
    }

</style>

