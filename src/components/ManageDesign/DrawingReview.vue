<template>
    <div id="drwaingReview" >
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;height:785px;">
                <div id="item-box-file">
                    <router-link :to="'/Design/management'" class="label-item">  
                     设计协调  
                    </router-link>
                    <router-link :to="'/Design/drawingReview'" class="label-item-active label-item">  
                     图纸评审  
                    </router-link>
                    <router-link :to="'/Design/attributeManager'"  class="label-item">  
                        属性管理  
                    </router-link>
                    <router-link :to="'/Design/designversion'"  class="label-item">  
                        设计版本  
                    </router-link>
                </div>
                
                <div class="commentInformation" >
                    <div class="commentTool" v-show="screenLeft.item == 3||screenLeft.item == 2">
                        <label style="font-size:14px; color:#999999;margin-right:4px">批注人:</label>
                        <el-select style="height:30px !important;width:130px;margin-right:10px;" v-model="annotationUserId" class="commentSel">
                            <el-option  class="commentOpt" v-for="item in allUserList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
                        </el-select>
                        <label style="font-size:14px; color:#999999;margin-right:4px" >阶段:</label>
                        <el-select style="height:30px !important;width:130px;margin-right:10px;" v-model="stage" class="commentSel">
                            <el-option class="commentOpt" v-for="item in stageList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                        <label style="font-size:14px; color:#999999;margin-right:4px">标记:</label>
                        <el-select style="height:30px !important;width:130px;margin-right:10px;" v-model="isMark" class="commentSel">
                            <el-option class="commentOpt" v-for="item in isMarkList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
                        </el-select>
                    </div>
                    <!-- <div class="rotate" v-show="versionPath&&!annotationlist"> -->
                    <div v-show="versionPath" class="rotate">
                        <i class="drawingIcon bigRotate" @click="bigRotate()"></i>
                        <i class="drawingIcon smallRotate" @click="smallRotate()"></i>
                        <i class="drawingIcon zuoRotate" @click="zuoRotate(drawingFileUrl1)"></i>
                        <i class="drawingIcon youRotate" @click="youRotate(drawingFileUrl1)"></i>
                    </div>
                </div>
               
<!-- v-show="versionPath" -->
                <div class="drawingBody">
                    <div class="noImg" v-show="!versionPath">
                            <img style="width:140px;height:115px;margin-top:150px;" src="../../assets/nodata.png"/>
                            <p style="font-size:16px;color:#ccc">请在右侧列表中选择需要浏览的图纸</p>
                    </div>
                    <div id="drawingPic" style="overflow:hidden;left:20px">
                        <picView ref="pic" @load_points="loadPic"  @finish="drawFinish" @status_changed="picView_status_changed" :para="paraList" ></picView>
                    </div>
                </div>
                <!-- {{currentPage}} / {{pageCount}} -->
            </div>
            <div v-show="screenLeft.item == 3" id="drawingToolsBody">
                    <ul class="drawingTools">
                        <!-- <li><i class="drawingIcon zuoRotate" @click="zuoRotate()"></i></li>
                        <li><i class="drawingIcon youRotate" @click="youRotate()"></i></li> -->
                        <li><i class="drawingIcon straightLine" @click="straightLine()"><span style="color:#fc3439;font-size:14px;">直线</span></i></li>
                        <li><i class="drawingIcon circular" @click="circular()"><span style="color:#fc3439;font-size:14px;">圆形</span></i></li>
                        <li><i class="drawingIcon rectangle" @click="rectangleTool()"><span style="color:#fc3439;font-size:14px;">矩形</span></i></li>
                        <li><i class="drawingIcon cloudLine" @click="cloudLine()"><span style="color:#fc3439;font-size:14px;">云线</span></i></li>
                        <li><i class="drawingIcon text" @click="drawingText()"><span style="color:#fc3439;font-size:14px;">文本</span></i></li>
                        <li><i class="drawingIcon appended" @click="appended()"><span style="color:#fc3439;font-size:14px;">附注</span></i></li>
                         <li><i class="drawingIcon select" @click="selectDraw()"><span style="color:#fc3439;font-size:14px;">选择</span></i></li>
                        <img id="fz_img_for_draw" src="./images/fuz1.png" style="display:none"/>
                    </ul>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']" >
            <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property "  @click="drawingClick()">图<br>纸</span>
                        <span class="item-version " @click="versionClick()">版<br>本</span>
                        <span class="item-version-3 " @click="annotationClick()">批<br>注</span>
                    </div>
            </div>
            <div v-show="screenLeft.item == 1"  class="screenRight_1">
                <div >
                    <p class="clearfix" v-if="IsFolderAction">
                        <i class="icon-goujian icon-add" title="添加图纸" @click="uploadFile"></i>
                        <!-- <i class="icon-goujian icon-upload"  title="上传图纸" ></i> -->
                    </p>
                    <p class="clearfix" v-else>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile()"></i>
                        <i class="icon-goujian icon-edit"  title="编辑" @click="editMap()"></i>
                        <i class="icon-goujian icon-update"  title="更新" @click="updateFile()"></i>
                    </p>
                    <el-tree
                        :data="FileTree"
                        node-key="code" 
                        ref="fileTree_drawingReview"
                        :props="defaultProps"
                        :default-expanded-keys="expandedKeys"
                        :expand-on-click-node="false"
                        :default-checked-keys="checkedKeys"
                        @node-expand="nodeClick"
                        @node-collapse="nodeClickClose"
                        :highlight-current="true"
                        @node-click="handleNodeClick"
                        :check-strictly="true"
                        id="cloudDirveFileTree"
                        
                    >
                    <span :class="['custom-tree-node','elselect','el-tree-node__label','hahahhaha',data.isLeaf?'fileIcon':'']" slot-scope="{ node, data }" v-text="node.label"></span>
                    </el-tree>
                </div>
            </div>
            <div v-show="screenLeft.item == 2" id="box-right">
                <div class="versionBody">
                    <div class="versionHead">{{drawingName}}</div>
                        <ul :class="[{'versionUlSel':item.id==isSelect},'versionUl']" v-for="(item,index) in drawingVersionList" :key="index" @click="selectVersion(item.id)">

                            <li class="detial-item clearfix">
                                <span class="detial-text-name" >图号</span>
                                <span class="detial-text-value" v-text="drawingNumber+letterChange(item.versionId)"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">上传人</span>
                                <span class="detial-text-value" v-text="item.insertUserName"></span>
                            </li>
                            <li class="detial-item clearfix">
                                <span class="detial-text-name">上传时间</span>
                                <span class="detial-text-value">{{item.insertTime|timeChange()}}</span>
                            </li>
                        </ul>
                </div>
            </div>
            <div v-show="screenLeft.item == 3" id="box-right1">
                <ul class="drawingApendedInfo">
                    <div class="drawingApendedHead" ><label class="label1">{{drawingName+'('+drawingNumber+letterChange(this.version)+')'}}</label><div  v-show="annotationlist" class="export" @click="exportAnnotation()">导出</div></div>
                    
                    <li :class="[{'clickbody':isClick==item.id},'drawingApendedInfobody']" @click.stop="downIconComment(item.id)" v-show="annotationlist" v-for="(item,index) in annotationlist" :key="index">
                        <!-- :src="shapeImg(item.coordinateInfo.t) -->
                        <div class="apendedInfoOne">
                            <!-- <form v-on="shapeImg(item.coordinateInfo.t)"> -->
                                <img id="img1" width="16px" height="16px" :src="shapeImg(JSON.parse(item.coordinateInfo).typeNum)" >
                            <!-- </form> -->
                            <label class="userName" v-text="item.updateUserName"></label>
                            <div class="deleteMark" @click.stop="deleteAnnotation(item.id)"></div>
                            <el-checkbox class="isMarkCheck" v-model="item.isMarkValue" @click.stop="true" @change="isMarkChange(item.isMarked,item.id)"></el-checkbox>
                            <div class="downIcon" @click.stop="foldComment(item.id)" ></div>
                        </div>
                        <div class="apendedInfoTwo"><label class="updateTime">{{item.updateTime|updateTimeChange()}}</label><label class="reviewStage">{{item.reviewStage|stageListChange()}}</label></div>
                        <!-- <div class="commentIcon"></div> -->
                        <!-- <div class="appendedInfotext">{{JSON.parse(item.coordinateInfo)[index].annotationInfo}}</div> -->
                        <div class="appendedInfotext">{{item.annotationInfo}}</div>
                        <div class="apendedInfoinp" v-show="(item.id==isId)?true:false" ><input v-show="!item.annotationInfo" @click.stop="true" placeholder="请输入评审文字" class="apendedInfoinput" @change="editAnnotationWord(item.id)" v-model="apendedInfoText" type="text"/></div>
                        <div class="commentBody" v-show="(item.id==isId)?true:false">
                                <div v-show="item.annotationInfo">
                                    <textarea  rows="3" cols="20" type="text" placeholder="请回复" @click.stop="true" @change="addReply(item.id)" v-model="replayList" class="commentInfoinput">
                                    </textarea>
                                    <!-- <div class="replayBtn" @click="addReply(item.id)">回复</div> -->
                                    <ul class="replyUl" v-show="showComment">
                                        <li class="replyLi" v-show="(item.id==item1.annotationId)?true:false" v-for="(item1,index1) in replyList" :key="index1">
                                            <div class="replyOne"><label class="replyName" v-text="item1.insertUserName"></label><label class="replyTime">{{item1.insertTime|updateTimeChange()}}</label><label v-show="(replyList.length-1)==index1" class="deleteMark1" @click.stop="deleteComment(item1.id)"></label></div>
                                            <div class="replyTwo" v-text="item1.replyInfo"></div>
                                        </li>
                                    </ul>
                                </div>
                        </div>
                    </li>
                </ul> 
            </div>
        </div>
        <div id="edit">
            <el-dialog title="图纸上传" :visible.sync="drawingsUploadShow" @close="drawingsUploadCancel" class="uploadBox">
                <div class="editBody">
                    <div class="yingsheProject">
                        <label class="yingsheProjectText">图纸列表 : </label>
                        <label class="editBtnS yingsheProjectBtn" for="drawingsInfo">选择文件</label>
                        <input class="upInput"  type="file"  @change="fileChanged($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                    </div>
                    <table class="fileContainer" border="1">
                        <thead>
                            <tr  class="userList-thead">
                                <th style="width:15%">图号</th>
                                <th style="width:15%">图名</th>
                                <th style="width:15%">比例</th>
                                <th style="width:29%">相关空间</th>
                                <th style="width:14%;max-width:50px;">文件名称</th>
                                <th style="width:12%">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in fileList" :key="index">
                                <td>
                                    <input  placeholder="请输入" v-model="item.drawingNo" class="calculateInp">
                                </td>
                                <td>
                                    <input  placeholder="请输入" v-model="item.drawingName" class="calculateInp">
                                </td>
                                <td>
                                    <select v-model="item.proportion" class="inp-search" ref="proportion">
                                        <option value=""></option>
                                        <option value="1:20">1:20</option>
                                        <option value="1:25">1:25</option>
                                        <option value="1:30">1:30</option>
                                    </select>
                                    <i class="icon-sanjiao"></i>
                                </td>
                                <td>
                                    <select v-model="holderId" class="inp-search">
                                        <option v-for="(val,index) in getHoldersList" :key="index" :value="val.holderId" v-html="val.holderName"></option>
                                    </select>
                                    <i class="icon-sanjiao"></i>
                                </td>
                                <td style="max-width:100px;" v-text="item.fileName"></td>
                                <td>
                                    <button class="deleteBtn actionBtn" style="margin-right:10px" @click="deleteFileList(index)"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="drawingsUploadConfirm">上传</button>
                    <button class="editBtnC" @click="drawingsUploadCancel">关闭</button>
                </div>
            </el-dialog>
            <el-dialog title="图纸编辑" :visible="editDrawing.renameshow" @close="editDrawingCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">图号 :</label>
                        <input type="text" class="inp" v-model="editDrawing.dcode">
                    </div>
                    <div class="editBodytwo imageBody">
                        <label class=" imageBodyText">图名 :</label>
                        <input type="text" class="inp" v-model="editDrawing.dname">
                    </div>
                    <div class="editBodytwo imageBody" style="position: relative;">
                        <label class=" imageBodyText">比例 :</label>
                        <select class="inp-search" v-model="editDrawing.dscale">
                            <option value="1:20">1:20</option> 
                            <option value="1:25">1:25</option> 
                            <option value="1:30">1:30</option>
                        </select>
                        <i class="icon-sanjiao" style="top: 16px;left: 350px;"></i>
                    </div>
                    <div class="editBodytwo imageBody" style="position: relative;">
                        <label class=" imageBodyText">相关空间：</label>
                        <select class="inp-search" v-model="holderId">
                            <option v-for="(val,index) in getHoldersList" :key="index" :value="val.holderId" v-html="val.holderName"></option> 
                        </select>
                        <i class="icon-sanjiao" style="top: 16px;left: 350px;"></i>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="confirmDrawing">确定</button>
                    <button class="editBtnC" @click="editDrawingCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog width="500px" title="更新图纸" :visible="editDrawing.updateshow" @close="updateDrawingCancle">
                <div class="editBody">
                    <div class="editUpDrawing">
                        <label class="editUpDrawingText">图号:</label><label class="editUpDrawingValue" v-text="editDrawing.dcode"></label>
                    </div>
                    <div class="editUpDrawing">
                        <label class="editUpDrawingText">图名:</label><label class="editUpDrawingValue" v-text="editDrawing.dname"></label>
                    </div>
                    <div class="editUpDrawing">
                        <label class="editUpDrawingText">比例:</label><label class="editUpDrawingValue" v-text="editDrawing.dscale"></label>
                    </div>
                    <div class="editUpDrawingProject">
                        <label class="editUpDrawingProjectText">上传文件:</label>
                        <label class="editUpDrawingProjectText1" v-text="this.updateFileName"></label>
                        <label class="editUpDrawingProjectBtn" for="drawingsUpdateInfo">浏览</label>
                        <input class="upInput"  type="file"  @change="fileUpdateChanged($event)" ref="drawingsUpdateInfo"  id="drawingsUpdateInfo">
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="confirmUpdateDrawing">确定</button>
                    <button class="editBtnC" @click="updateDrawingCancle">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import '../ManageCost/js/jquery-1.8.3.js'
import '../ManageCost/js/date.js'
import data from '../Settings/js/date.js'
import moment from 'moment';
import pdf from 'vue-pdf'
import picView from '../constructionSite/picView.vue'
var THREE = require('three');
var isUserInteracting = false;
export default {
     components: {
        pdf,picView
    },
    name:'drwaingReview',
    data(){
        return{
            drawingShow:false,
            showComment:true,//是否折叠评论
            isClick:'',
            selectShape:'',//选中图纸上的标注
            isId:'',//是否ID
            drawingFileUrl:'',
            drawingFileUrl1:'',
            drawingVersionId:'',
            version:'',
            queryAnnotationList:'',
            annotationlist:'',//信息列表
            commentLen:'',//评论条数
            replyList:'',//回复列表
            apendedInfoText:'',//标记卡片描述信息
            replayList:'',
            shapeList:[
                {
                    val:"1",
                    imgUrl:require('./images/zx1.png')
                },
                {
                    val:"2",
                    imgUrl:require('./images/yx1.png')
                },
                {
                    val:"3",
                    imgUrl:require('./images/jx1.png')
                },
                {
                    val:"4",
                    imgUrl:require('./images/yunxian1.png')
                },
                {
                    val:"5",
                    imgUrl:require('./images/wenb1.png')
                },
                {
                    val:"6",
                    imgUrl:require('./images/fuz1.png')
                },
            ],
            avatars:'',
            replyList:'',
            isSelect:'',//是否选择版本
            pageAllCount:0,
            pdfUrl:'',
            currentPage: 0,
            pageCount: 0,
            screenLeft:{
                show:true,
                item:1,
            },
            loading:false,
            drawingLoading:false,
            showAction:true,
            IsFolderAction:true,
            defaultSubProjId:'',
            token:'',
            projId:'',
            userId:'',
            entId:'',
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf:'leaf'
            },
            expandedKeys:[],
            checkedKeys:[],
            checkFileDir:{},
            directoryId:'',
            drawingsUploadShow:false,
            fileList:[], //即将上传的文件集合
            drawingList:'',
            FileTree_original:[],
            FileTree:[],
            DirectoryList:[],
            drawingVersionList:'',
            drawingZxVersionId:'',
            pageNo:'',
            versionPath:'',//最新图纸路径
            picShow:false,
            annotationUserId:'',//批注用户Id
            stage:'1',//阶段
            isMark:'0',//标记
            // isMarkValue:false,
            isMarkId:'',
            rotate:0,
            annotationInfo:'',
            updateFileName:'',//更新文件名
            updateFileList:'',//更新文件
            editDrawing:{
                renameshow:false,
                updateshow:false,
                dId:'',
                dcode:'',//这是点位图的旧名称
                dname:'',//点位图新名称
                dscale:''
            },
            //评审阶段列表
            stageList:[
                 {
                    value:'-1',
                    label:'全部'

                },
                {
                    value:'1',
                    label:'专业协调'
                },
                {
                    value:'2',
                    label:'内部校对'
                },
                {
                    value:'3',
                    label:'内部审核'
                },
                {
                    value:'4',
                    label:'业主审核'
                },
               
            ],
            isMarkList:[
                 {
                    value:'-1',
                    label:'全部'
                },
                {
                    value:'0',
                    label:'否'
                },
                {
                    value:'1',
                    label:'是'
                },
               
            ],
            isDrawing:false,
            shapeType:'',
            coordinateInfoList:[],
            coordinateInfoAllList:[],
            coordinateInfoAllListss:[],
            commentShapeType:'',//传递形状类型
            allUserList:'',
            beginDraw:false,
            layerID:0, // 图层 ID 每次累加保证每个图层都有不同ID（颜色）选取
            Koeffizent:1.0, // 缩放大小比例参数
            StartWidth:0,   // 缩放时清空范围
            StartHeight:0,  // 缩放时清空范围
            pdfShow:false,
            imgShow:false,
            commentShow:false,//评论下拉框
            allList:'',
            letterList:[' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
            drawingNumber:'',
            drawingName:'',
            getHoldersList:'',//空间楼层列表
            holderId:'',//容器ID
            fileGroupId:'',//文件夹ID
            paraList:{},
        }
    },
    filters: {
        
        stageListChange(val){
            if(val=='1'){
                return '专业协调'
            }else if(val=='2'){
                return '内部校对'
            }else if(val=='3'){
                return '内部审核'
            }else if(val==4){
                return '业主审核'
            }
        },
        timeChange(val) {
            if (val == null) {
            return;
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
            }
        },
        updateTimeChange(val){
            if (val == null) {
                return;
            } else {
                return moment(val).format("YY-MM-DD HH:mm");
            }
        }
    },
    created(){
        var vm=this;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.userId = localStorage.getItem('userid')
        vm.entId = localStorage.getItem('entId')
        this.getDirectory()
        // this.getAllUser()
        this.getAllUser()
        this.createDrawingDirectory()
        this.getHolders()
        this.$nextTick(() => {
            this.$refs.fileTree_drawingReview.setCurrentKey(110000); // treeBox 元素的ref   value 绑定的node-key
        });
       
        // this.load();
    },
    mounted(){
        console.log('fjjjk')
         console.log(this.$refs.pic.$el.style,'fjjj');
        //  this.$refs.pic.$el.style.display="none";
    },
    watch:{
        annotationUserId:function(val){
            // this.isSelect='';
            this.queryAnnotation()
            // this.exportAnnotation()
        },
        stage:function(val){
            //  this.isSelect='';
            this.queryAnnotation()
            // this.exportAnnotation()
            // this.addAnnotation()
        },
        isMark:function(val){
            this.queryAnnotation()
            // this.exportAnnotation()
        },
       

    },
    mounted(){
    //    window.onresize = () => { 
    //        this.loadsNew();
    //    }
    },
    methods:{
        drawFinish(e){
            // console.log(e);
            this.addAnnotation(e[e.length - 1]);
        },
        loadPic(){
             this.$refs.pic.Max_Select = 1;
             console.log(this.$refs.pic.$el.style,'fjjj');
            //  this.$refs.pic.$el.style
        },
        picView_status_changed(a,b){
            console.log(a,b);
            if(a==true){
                this.isClick=b[0].ID_out;
                this.isId=b[0].ID_out;
                // this.drawingShow=true;
            }else if(a==false){
                this.isClick='';
                this.isId='';
            }
        },
        letterChange(val){
            if(val==1){
                return this.letterList[val-1];
            }else if(val==2){
                return this.letterList[val-1];
            }else if(val==3){
                return this.letterList[val-1];
            }else if(val==4){
                return this.letterList[val-1];
            }else if(val==5){
                return this.letterList[val-1];
            }else if(val==6){
                return this.letterList[val-1];
            }else if(val==7){
                 return this.letterList[val-1];
            }else if(val==8){
                return this.letterList[val-1];
            }else if(val==9){
                return this.letterList[val-1];
            }else if(val==10){
                return this.letterList[val-1];
            }else if(val==11){
                 return this.letterList[val-1];
            }else if(val==null){
                return '';
            }
        },
        shapeImg(val){
                if(val==101){
                    return require('./images/zx1.png')
                }else if(val==102){
                    return require('./images/yx1.png')
                }else if(val==103){
                    return require('./images/jx1.png')
                }else if(val==104){
                    return require('./images/yunxian1.png')
                }else if(val==10000){
                    return require('./images/wenb1.png')
                }else if(val==105){
                    return require('./images/fuz1.png')
                }else if(val=undefined){
                    return;
                }
        },
        //获取单体分区楼层三个级别的容器信息
        getHolders(){
            var vm=this;
             axios({
                url:vm.BDMSUrl+'dc/drawingReview/getHolders',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getHoldersList=response.data.rt;
                    this.getHoldersList.unshift({ 
                        "holderId": null,
                        "holderName": "无",
                        "holderType": ""
                    })
                     this.getHoldersList.forEach((item)=>{
                         if(item.holderType==7){
                             item.holderName='&nbsp&nbsp'+item.holderName
                         }
                         if(item.holderType==8){
                             item.holderName='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+item.holderName
                         }
                         if(item.holderType==9){
                              item.holderName='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+item.holderName
                         }
                     })
                    // this.holderId=null;
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //创建/同步图纸目录
        createDrawingDirectory(){
            var vm=this;
             axios({
                url:vm.BDMSUrl+'dc/drawingReview/createDrawingDirectory',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){

                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //获取工程中的用户
        getAllUser(){
            this.allUserList=''
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/getAllUser',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                   this.allUserList=response.data.rt;
                   this.allUserList.unshift({userId: -1, userName: "全部", account: "", userPositions: null})
                   this.annotationUserId=parseInt(this.userId);
                    // console.log(this.allUserList);
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //下拉评论
        downIconComment(val){
             this.allList='';
            this.isId=val;
            this.isClick=val;
             this.$refs.pic.Selected2(val);
            // this.queryAnnotation();
        },
        onmouse(){
            var that=this;
            var hei=window.innerHeight;//获取窗体高度
            var oDiv = this.$refs.msgSpan.$el;//vue通过$refs获取元素属性
            var oTop = this.$refs.msgtop;
            // that.$refs.msgSpan.$parent.$parent.$parent.$el.style.webkitUserSelect='none';//添加样式控制拖拽时禁止全选动作
            // that.$refs.msgSpan.$parent.$parent.$parent.$el.style.mozUserSelect='none';//添加样式控制拖拽时禁止全选动作
            oDiv.onmousedown = function(ev){
            var disY = ev.clientY - oDiv.offsetTop;
            var web='-webkit-user-select';
            // console.log(ev.clientY)
            // console.log(oDiv.offsetTop)
            document.onmousemove = function(ev){
            // var t = ev.clientY-disY;
            var t = hei-ev.clientY;
            if(t<=180){
                oTop.style.height=170+'px';
            }else{
                oDiv.style.height = t+'px';
                oTop.style.height = t - 30 +'px';
            }
            };
            document.onmouseup = function(){
                document.onmousemove=null; 
                document.onmouseup=null;
            // that.$refs.msgSpan.$parent.$parent.$parent.$el.style.webkitUserSelect='';//取消样式控制拖拽时禁止全选动作
            // that.$refs.msgSpan.$parent.$parent.$parent.$el.style.mozUserSelect='';//取消样式控制拖拽时禁止全选动作
            };
        };
        },
        //选择版本
        selectVersion(val){
            var vm=this;
            this.isSelect=val;
           
            this.drawingVersionList.forEach((item)=>{
                if(val==item.id){
                    this.drawingFileUrl=this.QJFileManageSystemURL+item.fileUri;
                    this.drawingVersionId=item.id;
                    this.version=item.versionId;
                    console.log(this.version,'this.version');
                   var type=(vm.drawingFileUrl.substr(vm.drawingFileUrl.length-3)).toString();
                    console.log(type);
                    this.paraList={type:type,source:vm.drawingFileUrl,angle:this.rotate};
                }
            })
            setTimeout(()=>{
                this.queryAnnotation();
            },1000)
           
        },
        //获取图纸旋转信息
        getdrawInfo(){

        },
        //放大
        bigRotate(){
            this.$refs.pic.size_big()

        },
        smallRotate(){
             this.$refs.pic.size_small()
        },
        //图纸工具栏操作
        zuoRotate(val){
                this.$refs.pic.rotation(this.$refs.pic.angle - 90);
                this.rotate = this.$refs.pic.angle;
                this.updateDrawingRotateInfo();
        },
        youRotate(val){
                this.$refs.pic.rotation(this.$refs.pic.angle + 90);
                this.rotate = this.$refs.pic.angle;
                this.updateDrawingRotateInfo();
        },
        straightLine(){
            this.isDrawing=true;
            this.shapeType="1";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.$refs.pic.setDrawStatus('none',101,0,2,{r:255,g:0,b:0});
            this.isMark='0';//标记
             this.annotationUserId=parseInt(this.userId);
        },
        circular(){
            this.isDrawing=true;
            this.shapeType="2";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }

            this.$refs.pic.setDrawStatus('none',102,0,2,{r:255,g:0,b:0});
            this.isMark='0';//标记
            this.annotationUserId=parseInt(this.userId);
        },
        rectangleTool(){
            this.isDrawing=true;
            this.shapeType="3";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }

            this.$refs.pic.setDrawStatus('none',103,0,2,{r:255,g:0,b:0});
            this.isMark='0';//标记
            this.annotationUserId=parseInt(this.userId);
        },
        cloudLine(){
            this.isDrawing=true;
            this.shapeType="4";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }

            this.$refs.pic.setDrawStatus('none',104,0,10000,{r:255,g:0,b:0});
            this.isMark='0';//标记
            this.annotationUserId=parseInt(this.userId);
        },
        drawingText(){
            this.isDrawing=true;
            this.shapeType="5";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }

            this.$refs.pic.setDrawStatus('text',10000,10000,2,{r:255,g:0,b:0});
            this.isMark='0';//标记
            this.annotationUserId=parseInt(this.userId);
        },
        appended(){
            this.isDrawing=true;
            this.shapeType="6";
            this.beginDraw = true;
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.$refs.pic.setDrawStatus('none',105,0,1,{r:255,g:0,b:0});
            this.isMark='0';//标记
            this.annotationUserId=parseInt(this.userId);
        },
        //选择
        selectDraw(){
            this.$refs.pic.setDrawCancel();
        },
        drawingClick(){
            this.$refs.pic.clearAll();
            this.screenLeft.item = 1;
            this.isSelect='';
            this.allList='';
            //清除批注遗留的canvas；
            if(document.getElementById('abs')){
                let absInp=document.getElementById('absInp');
                document.getElementById('abs').drawElements=[];
                document.getElementById('abs').reflash();
                // alert('234')
            }
            // this.FileTree_original=[],
            // this.FileTree=[],
            // this.DirectoryList=[],
            // this.drawingList=[],
            // this.getDirectory()
        },
        versionClick(){
            this.screenLeft.item = 2;
            this.isSelect=this.drawingVersionId;
            this.queryAnnotation();
            // if(this.drawingId){
            //     this.getDrawingVersionList();
            // }
        },
        annotationClick(){
            var vm=this;
             this.screenLeft.item = 3
            //  this.isSelect='';
            //  this.biaozhushow=true;
            // this.loadeds()
            //  this.isSelect=this.drawingVersionId;
             this.drawingVersionId=this.drawingVersionList[this.drawingVersionList.length-1].id;
            vm.drawingFileUrl=this.QJFileManageSystemURL+this.drawingVersionList[this.drawingVersionList.length-1].fileUri;
            this.version=this.drawingVersionList[this.drawingVersionList.length-1].versionId;
            console.log(this.version,'this.version12')
            var type=(vm.drawingFileUrl.substr(vm.drawingFileUrl.length-3)).toString();
            console.log(type);
            this.paraList={type:type,source:vm.drawingFileUrl,angle:this.rotate};
            console.log(this.drawingVersionId);
            console.log(this.drawingVersionList);
             setTimeout(()=>{
                this.queryAnnotation();
            },500)
            // this.queryAnnotation();
        },
        //更新图纸旋转信息
        updateDrawingRotateInfo(){
             var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/updateDrawingRotateInfo',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                   drawingId:this.drawingId,
                   rotateInfo:this.rotate,
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // alert('更新图纸旋转信息成功');
                    console.log('更新图纸旋转信息成功',this.rotate);
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //获取图纸旋转信息
        getDrawingRotateInfo(){
             var vm=this
             this.rotate=0;
             console.log(this.drawingFileUrl,'this.drawingFileUrl');
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/getDrawingRotateInfo',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                   drawingId:this.drawingId,
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    if(response.data.rt){
                        if(isNaN(response.data.rt.rotateInfo)){
                            this.rotate = 0;
                        }else{
                            this.rotate=response.data.rt.rotateInfo;    //  先改角度再改地址
                        }
                        console.log(parseInt(this.rotate),'this.rotate');
                    }
                     var type=(vm.drawingFileUrl.substr(vm.drawingFileUrl.length-3)).toString();
                    console.log(type);
                    this.paraList={type:type,source:vm.drawingFileUrl,angle:this.rotate};
                   
                    console.log(this.paraList,'this.paraList');
                }else{
                    
                } 
                 if(vm.versionPath){
                        this.picShow=true;
                        // console.log(document.getElementById('#drawingPic'))
                        // console.log(this.$refs.pic.$el.style.display)
                        this.$refs.pic.$el.style.display="block"
                        // document.getElementById('#drawingPic').style.top='115px';
                }
            })
        },
        //添加批注
        addAnnotation(data){
            var vm=this;
            var type = 0;
            switch(data.drawtype){
                case "line":type=1;break;
                case "circular":type=2;break;
                case "rectangle":type=3;break;
                case "cloud":type=4;break;
                case "text":type=5;break;
                case "Mark":type=6;break;
            }

            if(data.drawtype == "text"){
                this.annotationInfo = data.text;
            }else{
                this.annotationInfo = "";
            }
            
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/addAnnotation',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationInfo:this.annotationInfo,
                    drawingVersionId:this.drawingVersionId,
                    reviewStage:this.stage,
                    type:type,
                    // projectId:vm.projId
                },
                data:{
                     coordinateInfo:JSON.stringify(data)
                }
            }).then((response)=>{
                if(response.data.cd='0'){
                    this.queryAnnotation();
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //编辑批注文字
        editAnnotationWord(val){
            var vm=this;
            axios({
                url:this.BDMSUrl+'dc/drawingReview/editAnnotationWord',
                methods:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationId:val,
                    word:this.apendedInfoText
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.queryAnnotation();
                    this.apendedInfoText='';
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                     this.apendedInfoText='';
                }
            })
        },
        //添加回复
        addReply(val){
            var vm=this;
            if(vm.replayList==''){
                this.$message({
                    type:'info',
                    message:'回复内容不能为空'
                })
            }else{
                axios({
                    url:this.BDMSUrl+'dc/drawingReview/addReply',
                    methods:'get',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        annotationId:val,
                        replyInfo:this.replayList
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        // console.log('回复成功')
                        this.queryAnnotation();
                        this.showComment=true;
                        this.replayList='';
                    }
                })
            }
        }, 
        //删除回复
        deleteComment(val){
            var vm=this;
                axios({
                    url:this.BDMSUrl+'dc/drawingReview/deleteReply',
                    methods:'get',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        replyId:val
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.queryAnnotation();
                    }else{
                        this.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
        },
        //是否批注
        isMarkBoolen(val){
            if(val==1){
                return true
            }else if(val==0){
                return false;
            }
        },
        //是否增减批注
        isMarkChange(isMarkVal,MarkId){
            if(isMarkVal==0){
                this.isMarkId=MarkId
                this.addMark();
            }else if(isMarkVal==1){
                this.isMarkId=MarkId
                this.removeMark()
            }
        },
        //是否折叠评论
        foldComment(id){
            this.annotationlist.forEach((item)=>{
                if(item.id==id){
                    this.showComment=!this.showComment
                }
            })

        },
        //删除批注卡片
        deleteAnnotation(num){
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/deleteAnnotation',
                method:'GET',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationId:num
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.$message({
                        type:'info',
                        message:'删除成功'
                    })
                    this.queryAnnotation();
                    // alert('添加批注ID')
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //添加批注ID
        addMark(){
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/addMark',
                method:'GET',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationId:this.isMarkId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.queryAnnotation();
                    // alert('添加批注ID')
                    
                }else{
                    vm.message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //移除批注Id
        removeMark(){
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/removeMark',
                method:'GET',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationId:this.isMarkId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.queryAnnotation();
                    // alert('移除批注Id');
                }else{
                    vm.message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //获取批注列表
        queryAnnotation(){
            var vm=this
            vm.annotationlist='';
            // vm.isSelect='';
            //清除批注遗留的canvas；
            if(this.drawingVersionId==''){
                return;
            }else{
                console.log("queryAnnotation");
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/queryAnnotation',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    drawingVersionId:this.drawingVersionId,
                    annotationUserId:this.annotationUserId,
                    stage:this.stage,
                    isMark:this.isMark,
                    // drawingId:this.checkFileDir.id
                    // projectId:vm.projId
                },
            }).then((response)=>{
                if(response.data.cd=='-1'){
                    // this.$message({
                    //     type:'error',
                    //     message:response.data.msg
                    // })
                }
                else if(response.data.rt.annotationlist.length!=0){
                    this.queryAnnotationList=response.data.rt;
                    this.annotationlist=response.data.rt.annotationlist;
                    console.log(this.annotationlist,'表单信息');
                    this.replyList=response.data.rt.replyList;
                    var len=this.annotationlist.length;
                    this.commentLen=len;
                    this.annotationlist.forEach((item,index)=>{
                        if(item.isMarked==0){
                            this.$set(item,'isMarkValue',false);
                        }else if(item.isMarked==1){
                            this.$set(item,'isMarkValue',true);
                        }
                        // if(this.isClick){
                        //     if(item.id==this.isClick){
                        //         this.selectShape=JSON.parse(item.coordinateInfo).id;
                        //         // console.log(this.selectShape,'成功');
                        //         // console.log(this.allList,'this.allList');
                        //         this.$refs.pic.Selected2(this.selectShape);

                        //     }
                        // }
                    })
                    var len=this.annotationlist.length;
                    this.commentLen=len;
                    // console.log(this.annotationlist,'获取列表');

                   this.$refs.pic.loadPoints2(this.annotationlist);
                    
                }else{
                    this.$refs.pic.loadPoints2([]);
                }
            })
            
            }
        },
        //获取目录
        getDirectory(){
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/getDirectory',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    vm.DirectoryList=response.data.rt;
                    vm.DirectoryList.forEach((item)=>{
                        vm.$set(item,'directory',0)
                    })
                    console.log(vm.DirectoryList,'directory')
                    this.getDrawingList();
                    // console.log(vm.DirectoryList);
                    // vm.showAction = true
                }else{
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })
        },
        //获取图纸列表
        getDrawingList(){
            // this.getDirectory()
            var vm=this;
            var setting = {
                data: {
                    key:{
                        name: "name",
                        children:'children',
                        title:"name",
                    },
                    simpleData: {
                        enable: true,
                        idKey: "code",
                        pIdKey: "directory",
                        rootPId: 0
                    }
                }
            }
            axios({
                method:'get',
                url:vm.BDMSUrl+'dc/drawingReview/getDrawingList',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                     vm.drawingList=response.data.rt;
                    if(vm.drawingList != null){
                        vm.drawingList.forEach((item,index) => {
                            vm.$set(item,'isLeaf',true)
                            vm.$set(item,'name',item.drawingNumber+'('+this.deleteLastName(item.drawingName)+')')
                            vm.$set(item,'code',item.id)
                        });
                    }  
                    var list=[{'code':0,'name':'图纸','directory':0}]
                     this.DirectoryList.forEach((item)=>{
                         let a=[];
                        this.drawingList.forEach((item1)=>{
                            if(item.code==item1.directory){
                                a.push(item1)
                                vm.$set(item,'children',a)
                            }
                        })
                    })
                    vm.$set(list[0],'children',this.DirectoryList);
                    console.log(list,'最新目录');
                    console.log(this.DirectoryList,'目录列表');
                    vm.FileTree = data.transformTozTreeFormat(setting,list);
                    console.log(vm.FileTree);
                    // console.log(vm.FileTree,'树形图列表');
                    if(this.drawingId){
                        vm.drawingList.forEach((item)=>{
                        if(item.id==vm.checkFileDir.id){
                            this.drawingList=item.id;
                            }
                        });
                    }else{
                        let strId='';
                        let strLen='';
                        console.log(vm.FileTree,'vm.FileTree');
                        console.log(vm.directoryId,'vm.directoryId');
                        vm.FileTree[0].children.forEach((item)=>{
                            if(item.code==vm.directoryId){
                                strLen=item.children.length;
                                strId=item.children[strLen-1].id;
                                this.drawingName=item.children[strLen-1].drawingName;
                                this.drawingNumber=item.children[strLen-1].drawingNumber;
                            }
                        });
                        this.drawingId=strId;
                    }                   
                     console.log(this.drawingId,'初始加载');
                     if(this.drawingId){
                        this.getDrawingVersionList();
                        // this.queryAnnotation();
                        // this.getDrawingRotateInfo();
                        this.getMaxVersionPath();
                        
                    }
                    this.expandedKeys.push(this.directoryId);
                    console.log(this.expandedKeys);
                }
            })
        },
        //去除后缀名
        deleteLastName(str){
            var reg = /.w+$/;   
            return str.replace(reg,'');    
        },
        //获取图纸最新版本路径
        getMaxVersionPath(){
            var drawingIdList=[];
            this.drawingLoading=true;
            drawingIdList.push(this.drawingId);
            console.log(drawingIdList);
            var vm=this;
            vm.loading=true;
            axios({
                url:this.BDMSUrl+'dc/drawingReview/getMaxVersionPath',
                method:'post',
                headers:{
                    'token':vm.token
                },
                data:drawingIdList
            }).then((response)=>{
                if(response.data.rt){
                    vm.versionPath=(response.data.rt)[0].fileUri;
                    vm.drawingFileUrl=vm.QJFileManageSystemURL+vm.versionPath;
                    
                    vm.getDrawingRotateInfo();
                    // vm.paraList={angle:this.rotate,type:vm.drawingFileUrl.substr(vm.drawingFileUrl.length-3),source:vm.drawingFileUrl};
                    // console.log(vm.paraList,'this.paraList');
                    this.drawingLoading=false;

                    // if(this.versionPath.substr(this.versionPath.length-3)=='pdf'||this.versionPath.substr(this.versionPath.length-3)=='PDF')
                    //     {   this.pdfShow=true;
                    //         this.imgShow=false;
                    //         this.drawingFileUrl1=this.drawingFileUrl;
                    //         var source=this.drawingFileUrl;
                           
                    //         // console.log(source);
                    //         // this.getDrawingRotateInfo();
                    //         // document.getElementById('abs').previousSibling.style.transform = 'rotate('+this.rotate +'deg)';
                    //         // this.init(source);
                    //         //删除之前节点abs
                    //     }else{
                    //         this.imgShow=true;
                    //         this.pdfShow=false;
                    //         //绘制文件是png和jpg格式的图片
                    //         var c = document.getElementById("imgCanvas");//此为之前创建的一个图片框架
                           
                    //         var width=c.width;
                    //         var height=c.height;
                    //         var ctx_img = c.getContext("2d");
                    //         ctx_img.clearRect(0,0,width,height);
                    //         var img = new Image();
                    //         img.onload =function() {
                    //             ctx_img.drawImage(img,0, 0);
                    //             }
                    //         img.src = this.drawingFileUrl;
                    //         var source=this.drawingFileUrl;
                    //         // this.init(source);
                    //     }
                    //     // this.loadeds();
                        
                        
                    // console.log(this.versionPath);
                }
                this.loading=false;
            })
        },
        handleNodeClick(obj){
             this.drawingLoading=true;
            // this.annotationlist='';
            this.allList='';
            this.rotate=0;
            //清除批注遗留的canvas；
            if(document.getElementById('abs')){
                let absInp=document.getElementById('absInp');
                document.getElementById('abs').drawElements=[];
                document.getElementById('abs').reflash();
                // alert('234')
            }
            var vm=this;
            vm.checkedKeys=[];
             vm.checkedKeys.push(obj.code)
            //  console.log(vm.checkedKeys)
            vm.showAction = true
            if(!obj.isLeaf){
                vm.IsFolderAction = true
            }else{
                vm.IsFolderAction = false
            }

            vm.checkFileDir=obj//选中的文件夹
            // console.log(vm.checkFileDir);
            vm.directoryId=obj.code
            vm.drawingId=obj.id
            vm.drawingName=obj.drawingName
            vm.drawingNumber=obj.drawingNumber
             
            // console.log(vm.directoryId,'vm.directoryId')
            // console.log( vm.drawingId,' vm.drawingId')
            if(vm.checkFileDir.id){
                //清除原来的canvas和inuput
                this.drawingFileUrl1='';
                this.drawingFileUrl='';
            //   this.getDrawingRotateInfo();
                this.getMaxVersionPath();
                this.getDrawingVersionList();
            }
            
            
        },
        nodeClick(data,node,self){
            var vm = this
            if(vm.expandedKeys.indexOf(data.code) == -1){
                vm.expandedKeys.push(data.code)
            }
            console.log(vm.expandedKeys);
        },
        nodeClickClose(data,node,self){
            var vm = this
            if(vm.expandedKeys.indexOf(data.code) != -1){
                 vm.expandedKeys.splice(vm.expandedKeys.indexOf(data.code),1)
            }
            // console.log(vm.expandedKeys);
        },
        //导出批注
        exportAnnotation(){
             var vm=this;
             if(this.drawingVersionId==''){
                return;
            }else{
                 window.open(this.BDMSUrl+'dc/drawingReview/exportAnnotation?token='+vm.token+'&drawingVersionId='+vm.drawingVersionId+'&annotationUserId='+vm.annotationUserId+'&stage='+vm.stage+'&isMark='+vm.isMark,'_blank');
            }
        },
        //获取图纸版本列表
        getDrawingVersionList(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'dc/drawingReview/getDrawingVersionList',
                method:'get',
                headers:{
                    'token':vm.token
                },
                params:{
                    drawingId:this.drawingId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.drawingVersionList=response.data.rt;
                    console.log(this.drawingVersionList);
                    let listLen=this.drawingVersionList.length;
                    this.drawingZxVersionId=this.drawingVersionList[listLen-1].id;
                    this.version=this.drawingVersionList[listLen-1].versionId;
                    this.drawingVersionId=this.drawingZxVersionId;
                    this.fileGroupId=this.drawingVersionList[0].fileGroupId;
                    console.log(this.fileGroupId,'文件id',this.drawingVersionId)
                    // this.isSelect=this.drawingVersionId;
                    // console.log(this.drawingZxVersionId);
                    // console.log(this.drawingVersionList);
                }
            })
        },
        //删除文件夹
        deleteFile(){
          var vm = this
            vm.$confirm('此操作将永久删除该图纸, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method:'get',
                    url:vm.BDMSUrl+'/dc/drawingReview/deleteDrawing',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        drawingId:vm.checkFileDir.id
                    }
                }).then((response)=>{
                    if(response.data.cd == 0){
                        vm.$message({
                            type:'success',
                            message:'图纸删除成功'
                        })
                        // this.loading=false;
                        this.drawingFileUrl1='';
                        this.drawingFileUrl='';
                        this.checkFileDir=[];
                        this.versionPath='';
                        this.rotate=0;
                        // //清除批注遗留的canvas；
                        // if(document.getElementById('abs')){
                        //     let canvas1=document.getElementById('abs');
                        //     let absInp=document.getElementById('absInp');
                        //     canvas1.parentNode.removeChild(canvas1);
                        //     absInp.parentNode.removeChild(absInp);
                        // }
                         //清除批注遗留的canvas；
                        if(document.getElementById('abs')){
                            let absInp=document.getElementById('absInp');
                            document.getElementById('abs').drawElements=[];
                            document.getElementById('abs').reflash();
                        }
                       if(!this.versionPath){
                            this.$refs.pic.$el.style.display='none'
                        }
                        // document.getElementById('abs')
                       vm.getDirectory();
                    }else if(response.data.cd == -1){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
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
        editMap(){
             var vm = this
            vm.editDrawing.renameshow = true
            vm.editDrawing.dId = vm.checkFileDir.id
            vm.editDrawing.dcode = vm.checkFileDir.drawingNumber
            vm.editDrawing.dname = vm.checkFileDir.drawingName
            vm.editDrawing.dscale = vm.checkFileDir.ratio
            vm.holderId=vm.checkFileDir.holderId
        },
        updateFile(){
            var vm = this
            vm.editDrawing.updateshow = true
            vm.editDrawing.dId = vm.checkFileDir.id
            vm.editDrawing.dcode = vm.checkFileDir.drawingNumber
            vm.editDrawing.dname = vm.checkFileDir.drawingName
            vm.editDrawing.dscale = vm.checkFileDir.ratio
        },
        uploadFile(){
            var vm = this
            if(vm.checkFileDir.code==0){
                vm.$message({
                    type:'error',
                    message:'系统文件，不能操作'
                })
            }else if(vm.checkFileDir.code){
                vm.drawingsUploadShow = true
            }
            
        },
        confirmDrawing(){
            var vm = this
            if(vm.editDrawing.dcode == ''){
                vm.$message({
                    type:'error',
                    message:'图号不能为空！'
                })
                return false
            }
            if(vm.editDrawing.dname == ''){
                vm.$message({
                    type:'error',
                    message:'图名不能为空！'
                })
                return false
            }
            axios({
                method:'get',
                url:vm.BDMSUrl+'dc/drawingReview/editDrawing',
                headers:{
                    'token':vm.token
                },
                params:{
                    drawingId:vm.editDrawing.dId,//这是图纸ID
                    drawingNumber:vm.editDrawing.dcode,//这是图纸图号
                    drawingName:vm.editDrawing.dname,//图纸名称
                    ratio:vm.editDrawing.dscale,//图纸比例
                    holderId:vm.holderId
                }
            }).then((response)=>{
                if(response.data.cd == 0){
                    vm.$message({
                        type:'success',
                        message:'图纸修改成功'
                    })
                    vm.getDirectory()
                }else if(response.data.cd == -1){
                    vm.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
                vm.editDrawing.renameshow = false
                vm.editDrawing.dId = ''
                vm.editDrawing.dcode =''
                vm.editDrawing.dname = ''
                vm.editDrawing.dscale = ''
            }).catch((err)=>{
                console.log(err)
            })
        },
        editDrawingCancle(){
            var vm = this
            vm.editDrawing.renameshow = false
            vm.editDrawing.dId = ''
            vm.editDrawing.dcode = ''
            vm.editDrawing.dname = ''
            vm.editDrawing.dscale = ''
        },
        drawingsUploadCancel(){
            var vm = this
            vm.drawingsUploadShow = false
            vm.fileList=[];
            document.getElementById('drawingsInfo').value='';
        },
        updateDrawingCancle(){
            var vm=this;
            this.editDrawing.updateshow=false;
            vm.updateFileName='';
            vm.updateFileList='';
            
        },
        confirmUpdateDrawing(){
                var vm=this;
                this.annotationlist='';
                var returnUrl = vm.BDMSUrl+'dc/drawingReview/updateVersion?drawingId='+vm.checkFileDir.id+'&pageNo=1'+'&projectId='+this.projId+'&fileGroupId='+this.fileGroupId
                returnUrl = encodeURIComponent(returnUrl);
                var formData = new FormData()
                formData.append('token',vm.token);
                formData.append('projId',vm.projId);
                formData.append('type',1);
                formData.append('file',vm.updateFileList);
                formData.append('userId',vm.userId);
                formData.append('modelCode','004');
                formData.append('returnUrl',returnUrl);
                // this.$refs.pdfDocument_upload.src=item.file;
                // console.log(this.$refs.pdfDocument_upload);
                axios({
                        method:'POST',
                        url:vm.QJFileManageSystemURL+ 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                        headers:{
                            'Content-Type': 'multipart/form-data'
                        },
                        data:formData,
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            vm.editDrawing.updateshow = false
                            vm.updateFileName=''
                            vm.updateFileList=''
                            this.rotate=0;
                            vm.getDirectory();
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                        // vm.fileList = [];
                    })
        },
        //图片尺寸验证  
        verificationPicFile(file) {  
                var filePath = file.value;  
                if(filePath){  
                    //读取图片数据  
                    var filePic = file.files[0];  
                    var reader = new FileReader();  
                    reader.onload = function (e) {  
                        var data = e.target.result;  
                        //加载图片获取图片真实宽度和高度  
                        var image = new Image();  
                        image.onload=function(){  
                            var width = image.width;  
                            var height = image.height;  
                            if (width == 720 | height == 1280){  
                                alert("文件尺寸符合！");  
                            }else {  
                                alert("文件尺寸应为：720*1280！");  
                                file.value = "";  
                                return false;  
                            }  
                        };  
                        image.src= data;  
                    };  
                    reader.readAsDataURL(filePic);  
                }else{  
                    return false;  
                }  
            },
        fileChanged(file){
            var vm = this;
            const list = vm.$refs.drawingsInfo.files;
            this.verificationPicFile(list[0]);
            var reader = new FileReader();  
            var dwidth = 0
            var dheight = 0
            reader.onload = function (e) {  
                var data = e.target.result;  
                //加载图片获取图片真实宽度和高度  
                var image = new Image();  
                image.onload=function(){  
                    dwidth = image.width;  
                    dheight = image.height;  
                }; 
                image.src= data;   
            };  
            reader.readAsDataURL(list[0])
            setTimeout(function(){
                  vm.fileList.push({
                    file:list[0],//文件
                    drawingNo:'',//图号
                    proportion:'',//比例
                    fileName:(list[0].name).replace(/\s*/g,""),//文件名
                    drawingName:(list[0].name).replace(/\s*/g,"").split('.')[0],//图纸名
                    dwidth:dwidth,
                    dheight:dheight
                })
            },0)
        },
        fileUpdateChanged(file){
            var vm = this
            const list = vm.$refs.drawingsUpdateInfo.files
            this.updateFileName=list[0].name
            this.updateFileList=list[0]
            var reader = new FileReader();  
            var dwidth = 0
            var dheight = 0
            reader.onload = function (e) {  
                var data = e.target.result;  
                //加载图片获取图片真实宽度和高度  
                var image = new Image();  
                image.onload=function(){  
                    dwidth = image.width;  
                    dheight = image.height;  
                }; 
                image.src= data;   
            };  
            reader.readAsDataURL(list[0])
        },
        //删除文件
         deleteFileList(index){
            var vm = this
            vm.fileList.splice(index,1)

        },
        drawingsUploadConfirm(){
            this.annotationlist='';
            var vm = this
            for(var i=0;i<vm.fileList.length;i++){
                // <input  placeholder="请输入" v-model="item.drawingNo" class="calculateInp">
                // <input  placeholder="请输入" v-model="item.drawingName" class="calculateInp">
                if(vm.fileList[i].drawingNo == ''){
                    vm.$message({
                        type:'error',
                        message:'图号不能为空！'
                    })
                    return false
                }
                if(vm.fileList[i].drawingName == ''){
                    vm.$message({
                        type:'error',
                        message:'图名不能为空！'
                    })
                    return false
                }
                if(vm.fileList[i].proportion == ''){
                    vm.$message({
                        type:'error',
                        message:'比例不能为空！'
                    })
                    return false
                }
            }
            vm.fileList.forEach((item,index)=>{
                var returnUrl = vm.BDMSUrl+'dc/drawingReview/addDrawing?projectId='+vm.projId+'&drawingNumber='+item.drawingNo+'&directory='+vm.directoryId+'&drawingName='+item.drawingName+'&ratio='+item.proportion+'&pageNo=1'+'&holderId='+vm.holderId
                returnUrl = encodeURIComponent(returnUrl);
                var formData = new FormData()
                formData.append('token',vm.token);
                formData.append('projId',vm.projId);
                formData.append('type',1);
                formData.append('file',item.file);
                formData.append('userId',vm.userId);
                formData.append('modelCode','004');
                formData.append('returnUrl',returnUrl);
                // this.$refs.pdfDocument_upload.src=item.file;
                // console.log(this.$refs.pdfDocument_upload);
                axios({
                        method:'POST',
                        url:vm.QJFileManageSystemURL+ 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                        headers:{
                            'Content-Type': 'multipart/form-data'
                        },
                        data:formData,
                    }).then((response)=>{
                        if(response.data.cd=='0'){
                            vm.drawingsUploadShow = false
                            vm.fileList = []
                            vm.holderId=''
                            vm.getDirectory()
                            // this.getMaxVersionPath();
                            vm.getDrawingList()
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                             vm.fileList = []
                        }
                        document.getElementById('drawingsInfo').value='';
                    })
            })
        }
     }

}
</script>
<style lang="less" scope>
    #drwaingReview{
        i{
            font-style:normal
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        li{
            list-style: none;
        }
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
            width:15px;
            height: 15px;
        }
        /* 滚动槽 */
        ::-webkit-scrollbar-track {
            box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
            border-radius:10px;
        }
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
            border-radius:10px;
            background:rgba(0,0,0,0.1);
            box-shadow:inset 006px rgba(0, 0, 0, .5);
        -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
        }
        ::-webkit-scrollbar-thumb:window-inactive {
            background:rgba(255,0,0,0.4);
        }
         /*
            修改eleUI树形组件
        */
        .el-tree-node:focus .el-tree-node__content{
            background-color: transparent;
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background-color: #dfdfdf;
        }
        // .el-tree--highlight-current .el-tree-node.is-current .elselect{
        //         background-color: #000;
        // }
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
            width: 12px;
            
            color: #999999;
            display:inline-block;
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
            background-image: url('./images/zTreeStandard.png');
            background-position: -110px -32px;
        }
        // .elselect{
        //     background: #333333;
        // }
        .el-tree-node__content{
                height: 30px;
        }
        .is-current .el-tree-node__content{
            color: #333333;
            font-weight: bold;
        }
        // .is-current .el-tree-node__content {
        //     background: #333333;
        // }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
        .box-left-container{
            display: inline-block;
            width: 85%;
            position: relative;
            transition:  all ease .5s;
            .commentInformation{
                // float: left;
                // margin-left:-420px;
                min-width: 1000px;
                max-width: 1600px;
                margin-top:22px;
                // width: 600px;
                position: relative;
                height: 38px;
                .commentTool{
                     position: absolute;
                     left:60px;
                     .el-input__inner{
                        height: 30px !important;
                        padding-left:5px;
                    }

                }
                .rotate{
                    float: right;
                    // position: relative;
                    position: absolute;
                    right: 30px;
                    top: 0px;
                    width: 100px;
                    height: 30px;
                    .drawingIcon{
                                width: 80px;
                                height: 26px;
                                cursor: pointer;
                                position: absolute;
                            }
                            .zuoRotate{
                                left:30px;
                                top:9px;
                                background: url('./images/zuox.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/xuanzl.png')no-repeat 0 0;
                                }
                            }
                            .youRotate{
                                left:70px;
                                top:9px;
                                background: url('./images/youx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/xuanzr.png')no-repeat 0 0;
                                }
                            }
                            .bigRotate{
                                left:-50px;
                                top:9px;
                                background: url('./images/big.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/big1.png')no-repeat 0 0;
                                }
                            }
                            .smallRotate{
                                 left:-10px;
                                top:9px;
                                background: url('./images/small.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/small1.png')no-repeat 0 0;
                                }
                            }

                }
            }
            // .noImg{
            //         margin:10px auto;
            //         // z-index:1000;
            //     }
            .drawingBody{
                    height: 650px;
                    width: 100%;
                    position: relative;
                .noImg{
                    height: 580px;
                    width: 100%;
                    position: absolute;
                    top:0px;
                    left:0px;
                    z-index:1000;
                    background:#fff;
                    padding:3px;
                    
                }
                #drawingPic{
                        margin:0 auto;
                        overflow: auto;
                        position: absolute;
                        top: 0px;
                        left: 0;
                        bottom: 0;
                        right: 25px;
                        min-width: 1000px;
                        max-width: 1600px;
                        // height: 800px;
                        // width:800px;
                    
                    #drawPic{
                        min-width: 700px;
                        min-height: 500px;
                    }
                }
            }
            #drawingToolsBody{
                position: absolute;
                bottom: 50px;
                left:50%;
                width: 100%;
                margin-left:-210px;
                    .drawingTools{
                        width: 530px;
                        height: 36px;
                        background-color:#3b3b3b;
                        position: relative;
                            // height: 30px;
                            .drawingIcon{
                                width: 80px;
                                height: 26px;
                                // line-height: 26px;
                                cursor: pointer;
                                position: absolute;
                            }
                            .zuoRotate{
                                left:10px;
                                top:9px;
                                background: url('./images/zuox.png')no-repeat 0 0;
                                // z-index: 10;
                                //  width: 26px;
                                // height: 26px;
                                // cursor: pointer;
                                &:hover{
                                    background: url('./images/zuox1.png')no-repeat 0 0;
                                }
                            }
                            .youRotate{
                                left:50px;
                                top:9px;
                                background: url('./images/youx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/youx1.png')no-repeat 0 0;
                                }
                            }
                            .straightLine{
                                left:30px;
                                top:9px;
                                background: url('./images/zx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/zx1.png')no-repeat 0 0;
                                }
                            }
                            .circular{
                                left:100px;
                                top:9px;
                                background: url('./images/yx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/yx1.png')no-repeat 0 0;
                                }
                            }
                            .rectangle{
                                left:170px;
                                top:9px;
                                background: url('./images/jx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/jx1.png')no-repeat 0 0;
                                }
                            }
                            .cloudLine{
                                 left:240px;
                                top:9px;
                                background: url('./images/yunxian.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/yunxian1.png')no-repeat 0 0;
                                }
                            }
                            .text{
                                 left:310px;
                                top:9px;
                                background: url('./images/wenb.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/wenb1.png')no-repeat 0 0;
                                }
                            }
                            .appended{
                                left:380px;
                                top:9px;
                                background: url('./images/fuz.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/fuz1.png')no-repeat 0 0;
                                }
                            }
                            .select{
                                left:450px;
                                top:9px;
                                background: url('./images/select.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/select1.png')no-repeat 0 0;
                                }
                            }
                    }
            }
        }
        .box-left-avtive{
            width: 98%;
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
        .box-right-container{
            // display: inline-block;
            position: relative;
            float: right;
            width: 15%;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            height: 785px;
            // overflow-y: auto;
            // overflow-x: hidden;
             #center-selection{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25px;
                border-right: 1px solid #cccccc;
                .SH_right{
                    width: 25px;
                    height: 48px;
                    border-left: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
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
                .item-property{//目录
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    border-right: 1px solid #ccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -9px;
                        width: 24px;
                        height: 15px;
                        background: #fafafa;
                        border-top: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }   
                .item-version{//属性
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    border-right: 1px solid #ccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 0px;
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
                    border-right: 1px solid #ccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 24px;
                        height: 0px;
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
                    .item-property::after{//目录
                        background: #fff;
                    }
                    .item-version-3{//版本
                        z-index: 10;
                    }
                }
                .active{//上边 目录 高显
                    .item-property{
                        background: #fff;
                        color: #fc3439;
                    }
                    .item-version{
                        z-index: 15;
                    }
                    .item-version-3{
                        z-index: 10;
                    }
                }
                .active-version-3{//下边 版本 高显
                    .item-version{
                        z-index: 15;
                        &::after{
                            background: #fafafa;
                        }
                    }
                    .item-property::after{
                        background: #fff;
                    }
                    .item-version-3{
                        z-index: 10;
                        background: #fff;
                        color: #fc3439;
                        &::after{
                            background: #fff;
                        }
                    }
                }
                
            }
            .screenRight_1{
                padding: 10px 0px 5px 0px;
                margin: 0 14px 0 30px;
                border-bottom: 1px solid #e6e6e6;
                #cloudDirveFileTree{
                    display: block;
                    position: absolute;
                    left: 32px;
                    right: 0;
                    bottom: 0;
                    top: 42px;
                    overflow-y: auto;
                }
                .noTop{
                    top: 12px!important;
                }
                >p{
                    padding-bottom:5px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom:10px;  
                }
                .icon-goujian{
                    float: left;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                .icon-add{
                    background: url('../ManageCost/images/add.png')no-repeat 0 0;
                    margin-right: 75px;
                    &:hover{
                        background: url('../ManageCost/images/add1.png')no-repeat 0 0;
                    }
                }
                .icon-authrity{
                    float: right;
                    background: url('../ManageCost/images/authority.png')no-repeat 0 0;
                    &:hover{
                        background: url('../ManageCost/images/authority1.png')no-repeat 0 0;
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
                .icon-load{
                    background: url('./images/loading.png')no-repeat 0 0;
                    margin-right: 75px;
                }
                .icon-upload{
                    float: right;
                    background: url('./images/upload.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/upload1.png')no-repeat 0 0;
                    } 
                }
                 .icon-view{
                    float: right;
                    background: url('./images/view.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/view1.png')no-repeat 0 0;
                    } 
                }
                .icon-update{
                    float: right;
                    background: url('./images/update.png')no-repeat 0 0;
                    margin-right: 10px;
                    &:hover{
                        background: url('./images/update1.png')no-repeat 0 0;
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
            #box-right{
                 padding: 10px 0px 0px 26px;
                 .versionBody{
                     .versionHead{
                        font-size:14px;
                        color:#333333;
                        font-weight: bold;
                        height: 28px;
                        width:100%;
                        text-align: left;
                        margin-left: 1px;
                        border-bottom: 1px solid #e6e6e6;
                        padding-left:4px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        
                     }
                     .versionUlSel{
                         background-color: #f6f6f6;
                        //  padding:5px;
                     }
                    //  .versionUl &:hover{
                    //      background-color: #999;
                    //  }
                    .versionUl{
                        // margin-left：20px
                        // width: 400px;
                        text-align: left;
                        padding: 4px;
                        width: 100%;
                        height: 122px;
                        // margin:3px;
                        text-align: left;
                        border-bottom: 1px solid #e6e6e6;
                    //     &:hover{
                    //      background-color: #fafafa;
                    //  }
                        .detial-item{
                                font-size: 12px;
                                line-height: 16px;
                                margin-top: 16px;
                                text-align: left;
                                // width: 200px;
                                // height: 15px;
                                .detial-text-name{
                                    color: #999999;
                                    width: 65px;
                                    float: left;
                                }
                                .detial-text-value{
                                    float: left;
                                    color: #333333;
                                    max-width: 130px;
                                    cursor: pointer;
                                    overflow: hidden;
                                    // overflow-x: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                &:first-of-type{
                                    margin-top: 18px;
                                }
                                .detail-text{
                                    font-size: 12px;
                                    line-height: 16px;
                                    overflow: hidden;
                                    width: 70px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    display: inline-block;
                                    margin-left: 10px;
                                    color:#333333;
                                }
                            }
                        }

                 }

            }
            #box-right1{
                 padding: 10px 0px 0px 26px;
                 ::-webkit-scrollbar{width:0px}
                .drawingApendedInfo{
                    width: 100%;
                    height: 800px;
                    overflow: auto;
                    .drawingApendedHead{
                        font-size:14px;
                        color:#333333;
                        font-weight: bold;
                        height: 28px;
                        // width: 100%;
                        text-align: left;
                        margin-left: 1px;
                        border-bottom: 1px solid #e6e6e6;
                        padding-left:7px; 
                        position: relative;
                        .label1{
                            width: 80%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: inline-block;
                        }
                        .export{
                            // float: right;
                            // margin-right:10px;
                            right:10px;
                            top:2px;
                            cursor: pointer;
                            color:#fc3439;
                            position: absolute;
                        }
                     }
                     .clickbody{
                         background: #f6f6f6;
                     }
                    .drawingApendedInfobody{
                        margin:0px 0px;
                        position: relative;
                        border-bottom: 1px solid #ccc;
                        padding: 4px;
                         .apendedInfoOne{
                             width: 100%;
                             height: 30px;
                             position: relative;
                             img{
                                 float: left;
                                 margin-top:7px;
                                 margin-right: 4px;
                                 margin-left:4px;

                             }
                             .userName{
                                 float: left;
                                 font-size: 14px;
                                 color:#333333;
                                 line-height: 30px;
                                 width: 60px;
                                 overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                text-align: left;
                             }
                             .deleteMark{
                                 position: absolute;
                                 top:6px;
                                 right: 40px;
                                //  margin-left: 103px;
                                //  margin-top:6px;
                                 display:inline-block;
                                background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                margin-right: 10px;
                                &:hover{
                                    background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                                }
                                width: 16px;
                                height: 16px;

                             }
                             .isMarkCheck{
                                 float: right;
                                 line-height: 30px;
                                 margin-right: 25px;
                             }
                             .downIcon{
                                 position:absolute;
                                 width: 12px;
                                 height: 12px;
                                 background: url('./images/zhank.png')no-repeat 0 0;
                                 top:9px;
                                 right:6px;
                                 cursor: pointer;

                             }
                        }
                        .appendedInfotext{
                            text-align: left;
                            height: 20px;
                            font-size:12px;
                            color:#666666;
                            line-height: 20px;
                            white-space: nowrap;
                            overflow: hidden;
                            width: 100%;
                            text-overflow: ellipsis;
                            margin-left:8px;
                        }
                        .apendedInfoTwo{
                            height: 20px;
                            margin-left:5px;
                            .updateTime{
                                float: left;
                                font-size: 12px;
                                 color:#666666;
                                 line-height: 20px;
                            }
                            .reviewStage{
                                float: left;
                                margin-left:10px;
                                font-size: 12px;
                                 color:#666666;
                                 line-height: 20px;
                            }
                            .commentIcon{
                                position:absolute;
                                width: 18px;
                                height: 18px;
                                background: url('./images/fuz.png')no-repeat 0 0;
                                top:32px;
                                right:14px;

                            }
                        }
                        .apendedInfoinp{
                            .apendedInfoinput{
                                margin-top:5px;
                                width: 96%;
                                height: 22px;
                                padding-left:4px;
                                // border-radius: 2px;
                                // background: #fafafa;
                                // box-sizing: border-box;
                                // outline: none;

                            }
                        }
                        .commentBody{
                            transition: all 0.7s ease;
                            margin-top:10px;
                            
                            .commentInfoinput{
                                margin-top:5px;
                                width: 96%;
                                height: 38px;
                                padding-left:5px;
                                padding-top:5px;
                                // font-size: 12px;
                                // color:#cccccc;
                            }
                            .replayBtn{
                                background: #fc3439;
                                margin-left:4px;
                                color: #fff;
                                font-size: 12px;
                                font-weight: normal;
                                width: 40px;
                                height: 20px;
                                border: none;
                                padding: 0;
                                cursor: pointer;
                                border-radius: 2px;
                            }
                            .replyUl{
                                // transition-duration: 0.7s;
                                transition: all 0.2s;
                                margin-top:8px;
                                .replyLi{
                                    transition: all 0.2s;
                                    margin:8px;
                                    width:100%;
                                    .replyOne{
                                        margin-bottom: 4px;
                                        text-align: left;
                                        position: relative;
                                        .replyName{
                                            // font-size:14px;
                                            // color:#333333;
                                            // width: 45px;
                                            // display: inline-block;
                                            // text-align: left;

                                            float: left;
                                            font-size: 14px;
                                            color:#333333;
                                            line-height: 20px;
                                            width: 60px;
                                            overflow: hidden;
                                            text-overflow:ellipsis;
                                            white-space: nowrap;
                                            text-align: left;
                                        }
                                        .replyTime{
                                            margin-left:2px;
                                            font-size:12px;
                                            color:#666666;
                                            width: 90px;
                                            line-height: 20px;
                                            display: inline-block;
                                            text-align: left;
                                        }
                                        .deleteMark1{
                                            // margin-left: 78px;
                                            // margin-top:2px;
                                            position: absolute;
                                            display:inline-block;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                            top:2px;
                                            right: 13px;
                                            &:hover{
                                                background: url('../ManageCost/images/delete1.png')no-repeat 0 0;
                                            }
                                            width: 16px;
                                            height: 16px;
                                            // line-height: 16px;
                                        }

                                    }
                                    .replyTwo{
                                        text-align: left;
                                        font-size:12px;
                                        color:#666666;
                                        width: 92%;

                                    }

                                }
                            }

                        }
                    }
                }

            }
        }
        .box-right-avtive{
            width: 2%;
            transition: all ease .5s;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
        }
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
        #edit{ 
             .inp-search{
                width: 200px;
                height: 38px;
                border: 1px solid #d1d1d1;
                border-radius: 2px;
                background: #fafafa;
                padding-left: 10px;
            }
            .el-dialog{
                margin: 0 auto;
                .upInput{
                    display: none;
                }
                /* 上传文件按钮 */
                .imageBody{
                    text-align: left!important;
                }
                .el-radio__label{
                    padding-left: 10px;
                    padding-right: 10px;
                }
                .imageBodyText{
                    color: #666;
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: normal;
                    display: inline-block;
                    width: 175px;
                    padding-left: 94px;
                    text-align: left;
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
                .selectionBox{
                    margin: 10px 50px;
                    border:1px solid #cccccc;
                    padding: 20px;
                    p{
                        text-align: left;
                        font-size: 14px;
                        line-height: 14px;
                        color: #666666;
                    }
                }
                .checkbox-fileItem{
                    float: left;
                    width: 14px;
                    height: 14px;
                    border: 1px solid #cccccc;
                    cursor: pointer;
                    margin-right: 5px;
                    position: relative;
                    &::after{
                        font-size:12px;
                        color:#cccccc;
                        display: block;
                        position: absolute;
                        right: -30px;
                        top: 0;
                        line-height:12px;
                        content: '';
                    }
                }
                .active{
                    background: url('../ManageCost/images/checked.png') no-repeat 1px 2px;
                        border: 1px solid #fc3439;
                }
                .yingsheProject{
                    overflow: hidden;
                    margin-bottom: 10px;
                }
                .yingsheProjectText{
                    color: #999;
                    display: block;
                    float: left;
                    margin-left: 30px;
                    font-size: 14px;
                    line-height: 36px;
                }
                .yingsheProjectBtn{
                    float: right;
                    margin-right: 30px;
                    line-height: 36px;
                }
            }
            .uploadBox .el-dialog__body{
                    margin-top: 21px;
                    .fileContainer{
                        width: 600px;
                        margin: 0px 30px;
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        thead{
                            background: #f8f8f9;
                            th{
                                padding-left: 10px;
                                height: 36px;
                                text-align: left;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #333333;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                        tbody{
                            tr{
                                td{
                                    padding-left: 5px;
                                    padding-right: 5px;
                                    height: 36px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    position: relative;
                                    input,select{
                                        float: left;
                                        width: 100%;
                                        height: 32px;
                                        border: 1px solid #d1d1d1;
                                        border-radius: 2px;
                                        background: #fafafa;
                                        padding-left: 10px;
                                    }
                                    .icon-sanjiao{
                                        display: block;
                                        position: absolute;
                                        width: 12px;
                                        height: 7px;
                                        background-image:url('../Settings/images/sanjiao.png');
                                        background-size: 100% 100%;
                                        content: '';
                                        top: 16px;
                                        right: 11px;
                                    }
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
                        margin-top:9px;
                    }
                    .editBtn{
                        background: url('../../assets/edit.png') no-repeat;
                    }
                    .deleteBtn{
                        background: url('../../assets/delete.png') no-repeat;
                    }
            }
            .editBody{
                .editUpDrawing{
                    margin-top:10px;
                    margin-left:-60px;
                    .editUpDrawingText{
                        display:inline-block;
                        width: 60px;
                        font-size: 14px;
                        color:#666666;
                        text-align: left;
                    }
                    .editUpDrawingValue{
                        margin-left:0px;
                        display:inline-block;
                        width: 120px;
                        font-size: 14px;
                        color:#333333;
                        text-align: left;
                    }
                }
                .editUpDrawingProject{
                    width: 400px;
                    margin-left:109px;
                    margin-top:10px;
                    position: relative;
                    height: 30px;
                    .editUpDrawingProjectText{
                        display:inline-block;
                        // margin-left: -122px;
                        width: 60px;
                        font-size: 14px;
                        color:#666666;
                        text-align: left;
                        position: absolute;
                         top:0px;
                         left:-6px;
                    }
                    .editUpDrawingProjectText1{
                        // margin-left: 39px;
                        top:0px;
                         left:171px;
                        display: inline-block;
                        width: 120px;
                        font-size: 14px;
                        color: #333333;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        position: absolute;

                    }
                    .editUpDrawingProjectBtn{
                        position: absolute;
                            // margin-top:10px;
                            // margin-left: 100px;
                            top:0px;
                            left:82px;
                            display: block;
                            width: 80px;
                            height: 28px;
                            border: none;
                            line-height: 28px;
                            padding: 0;
                            cursor: pointer;
                            border-radius: 2px;
                            background: #f9f9f9;
                            border: 1px solid #ccc;
                            background: #f9f9f9;
                            font-size: 14px;
                            font-weight: normal;
                            margin-right: 20px;
                            color: #000;

                    }
                }
            }
        }
    }

</style>