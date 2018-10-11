<template>
    <div id="drwaingReview" >
        <div :class="[{'box-left-avtive':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;height:785px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/Design/drawingReview'" class="label-item-active label-item">  
                     图纸评审  
                    </router-link>
                    <router-link :to="'/Design/management'" class="label-item">  
                     设计协调  
                    </router-link>
                    <router-link :to="'/Design/attributeManager'"  class="label-item">  
                        属性管理  
                    </router-link>
                    <router-link :to="'/Design/designversion'"  class="label-item">  
                        设计版本  
                    </router-link>
                </div>
                <div class="commentInformation" >
                    <div class="commentTool" v-show="screenLeft.item == 3">
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
                    <div class="rotate" v-show="versionPath&&!annotationlist">
                        <i class="drawingIcon zuoRotate" @click="zuoRotate(drawingFileUrl1)"></i>
                        <i class="drawingIcon youRotate" @click="youRotate(drawingFileUrl1)"></i>
                    </div>
                </div>
                <div class="noImg" v-show="!versionPath">
                        <img style="width:140px;height:115px" src="../../assets/nodata.png"/>
                        <p style="font-size:16px;color:#ccc">请在右侧列表中选择需要浏览的图纸</p>
                </div>

                <div  v-loading="loading"  v-show="versionPath" id="drawingPic">
                    
                    <!-- @mouseover="loadeds()" -->
                    <div id="imgCanvasDiv">
                        <canvas v-show="imgShow" id="imgCanvas"  width="1200" height="800">
                            <!-- <img id="drawPic" :src="drawingFileUrl"/> -->
                        </canvas>
                    </div>
                    <!-- <pdf  ref="pdfDocument_upload"    @num-pages="pageCount = $event" @page-loaded="currentPage = $event" :rotate="rotate" :src="pdfUrl" :page="pageAllCount"></pdf> -->
                    <pdf v-show="pdfShow" ref="pdfDocument" id="drawingPdf" @loaded="loadsNew()"   @num-pages="pageCount = $event" @page-loaded="currentPage = $event"  :src="drawingFileUrl1"></pdf>

                </div>
                <!-- {{currentPage}} / {{pageCount}} -->
            </div>
            <div v-show="screenLeft.item == 3&&!isSelect" id="drawingToolsBody">
                    <ul class="drawingTools">
                        <!-- <li><i class="drawingIcon zuoRotate" @click="zuoRotate()"></i></li>
                        <li><i class="drawingIcon youRotate" @click="youRotate()"></i></li> -->
                        <li><i class="drawingIcon straightLine" @click="straightLine()"><span style="color:#fc3439;font-size:14px;">直线</span></i></li>
                        <li><i class="drawingIcon circular" @click="circular()"><span style="color:#fc3439;font-size:14px;">圆形</span></i></li>
                        <li><i class="drawingIcon rectangle" @click="rectangleTool()"><span style="color:#fc3439;font-size:14px;">矩形</span></i></li>
                        <li><i class="drawingIcon cloudLine" @click="cloudLine()"><span style="color:#fc3439;font-size:14px;">云线</span></i></li>
                        <li><i class="drawingIcon text" @click="drawingText()"><span style="color:#fc3439;font-size:14px;">文本</span></i></li>
                        <li><i class="drawingIcon appended" @click="appended()"><span style="color:#fc3439;font-size:14px;">附注</span></i></li>
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
                <div v-if="showAction">
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
                        :class="[showAction?'':'noTop']"
                    >
                    <span :class="['custom-tree-node','el-tree-node__label','hahahhaha',data.isLeaf?'fileIcon':'']" slot-scope="{ node, data }" v-text="node.label"></span>
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
                    <div class="drawingApendedHead" >{{drawingName+'('+drawingNumber+letterChange(this.version)+')'}}<div  v-show="annotationlist" class="export" @click="exportAnnotation()">导出</div></div>
                    
                    <li :class="[{'clickbody':isClick==item.id},'drawingApendedInfobody']" @click="downIconComment(item.id)" v-show="annotationlist" v-for="(item,index) in annotationlist" :key="index">
                        <!-- :src="shapeImg(item.coordinateInfo.t) -->
                        <div class="apendedInfoOne">
                            <!-- <form v-on="shapeImg(item.coordinateInfo.t)"> -->
                                <img id="img1" width="16px" height="16px" :src="shapeImg(JSON.parse(item.coordinateInfo)[index].t)" >
                            <!-- </form> -->
                        <label class="userName" v-text="item.updateUserName"></label><div class="deleteMark" @click.stop="deleteAnnotation(item.id)"></div><el-checkbox class="isMarkCheck" v-model="item.isMarkValue" @click.stop="true" @change="isMarkChange(item.isMarked,item.id)"></el-checkbox><div class="downIcon" @click.stop="foldComment(item.id)" ></div></div>
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
                                <th style="width:20%">图号</th>
                                <th style="width:27%">图名</th>
                                <th style="width:12%">比例</th>
                                <th style="width:19%;max-width:200px;">文件名称</th>
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
                                <td v-text="item.fileName"></td>
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
                        <i class="icon-sanjiao" style="top: 16px;left: 330px;"></i>
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
var THREE = require('three');
var isUserInteracting = false;
export default {
     components: {
        pdf
    },
    name:'drwaingReview',
    data(){
        return{
            showComment:true,//是否折叠评论
            isClick:'',
            selectShape:'',//选中图纸上的标注
            isId:'',//是否ID
            drawingFileUrl:'',
            drawingFileUrl1:'',
            drawingVersionId:'',
            version:'',
            queryAnnotationList:'',
            coordinateInfoList_all:'',
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
        this.$nextTick(() => {
            this.$refs.fileTree_drawingReview.setCurrentKey(110000); // treeBox 元素的ref   value 绑定的node-key
        });
        // this.load();
    },
    mounted(){
    },
    watch:{
        annotationUserId:function(val){
            this.isSelect='';
            this.queryAnnotation()
            this.exportAnnotation()
        },
        stage:function(val){
             this.isSelect='';
            this.queryAnnotation()
            this.exportAnnotation()
            // this.addAnnotation()
        },
        isMark:function(val){
            this.queryAnnotation()
            this.exportAnnotation()
        },
       

    },
    mounted(){
    //    window.onresize = () => { 
    //        this.loadsNew();
    //    }
    },
    methods:{
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
            }else if(val=11){
                 return this.letterList[val-1];
            }else if(val==''){
                return '';
            }
        },
        shapeImg(val){
                if(val==1){
                    return require('./images/zx1.png')
                }else if(val==2){
                    return require('./images/yx1.png')
                }else if(val==3){
                    return require('./images/jx1.png')
                }else if(val==4){
                    return require('./images/yunxian1.png')
                }else if(val==5){
                    return require('./images/wenb1.png')
                }else if(val==6){
                    return require('./images/fuz1.png')
                }else if(val=undefined){
                    return;
                }
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
            this.queryAnnotation();
            // this.allList=JSON.parse(this.coordinateInfoList_all)
            // console.log(this.allList,'this.allList');
            //  if(document.getElementById('abs')){
            //      let can=document.getElementById('abs');
            //     can.drawElements=Object.assign(can.drawElements,this.allList)
            //     console.log(can.drawElements);
            //         {    // 已经选择标注
            //                     for(let i = 0;i < can.drawElements.length;i++){
            //                         if(can.drawElements[i].ID ==this.selectShape){ // 如果选中则改变标签状态为 selected
            //                             can.drawElements[i].status = "selected";
            //                         }else{
            //                             can.drawElements[i].status = "none";
            //                         }
                                   
            //                     }
            //                      can.reflash();
            //                     return;
            //         }
            // }
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
            // this.isSelect='';
            this.isSelect=val;
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
            // console.log(this.drawingVersionList,"jkdsjdjj");
            this.drawingVersionList.forEach((item)=>{
                if(val==item.id){
                    this.drawingFileUrl=this.QJFileManageSystemURL+item.fileUri;
                    this.drawingVersionId=item.id;
                    this.version=item.versionId;
                    if(item.fileUri.substr(item.fileUri.length-3)=='pdf'||item.fileUri.substr(item.fileUri.length-3)=='PDF')
                        {   this.pdfShow=true;
                            this.imgShow=false;
                            this.drawingFileUrl1=this.drawingFileUrl;
                        }else{
                            this.imgShow=true;
                            this.pdfShow=false;
                            var width=c.width;
                            var height=c.height;
                            // console.log(width,'',height)
                            var ctx_img = c.getContext("2d");
                            ctx_img.clearRect(0,0,width,height);
                            var img = new Image();
                            img.onload =function() {
                                ctx_img.drawImage(img,0, 0);
                                }
                            img.src = this.drawingFileUrl;
                        }
                }
            })
            this.queryAnnotation();
            // console.log(this.drawingFileUrl);
        },
        //获取图纸旋转信息
        getdrawInfo(){

        },
        //图纸工具栏操作
        zuoRotate(val){

                this.rotate=(this.rotate-90)%360;
                // var drawing4=document.getElementById('drawingPdf');
               
                var drawing=document.getElementById('abs');
                var drawing1=document.getElementById('abs').previousSibling;
                var drawing2=document.getElementById('abs').nextSibling;
                var drawing3=document.getElementById('canvas_select');
                // let ctx=drawing.getContext("2d");
                // let ctx_select=drawing3.getContext("2d");
                // ctx.rotate(this.rotate*Math.PI/180);
                // ctx_select.rotate(this.rotate*Math.PI/180);
                drawing.style.transform = 'rotate('+this.rotate +'deg)'
                drawing1.style.transform = 'rotate('+this.rotate +'deg)'
                drawing2.style.transform = 'rotate('+this.rotate +'deg)'
                drawing3.style.transform = 'rotate('+this.rotate +'deg)'
                // drawing4.style.transform = 'rotate('+this.rotate +'deg)'
                //  this.loadeds();
                this.updateDrawingRotateInfo();
        },
        youRotate(val){
            console.log(val);
            console.log(this.$refs.pdfDocument.src,'123');
                this.rotate=(this.rotate+90)%360;
                // var drawing4=document.getElementById('drawingPdf');
                // this.loadsNew();
                 
                
                var drawing=document.getElementById('abs');
                var drawing1=document.getElementById('abs').previousSibling;
                var drawing2=document.getElementById('abs').nextSibling;
                var drawing3=document.getElementById('canvas_select');
                // let ctx=drawing.getContext("2d");
                // let ctx_select=drawing3.getContext("2d");
                // ctx.rotate(this.rotate*Math.PI/180);
                // ctx_select.rotate(this.rotate*Math.PI/180);
                drawing.style.transform = 'rotate('+this.rotate +'deg)'
                drawing1.style.transform = 'rotate('+this.rotate +'deg)'
                drawing2.style.transform = 'rotate('+this.rotate +'deg)'
                drawing3.style.transform = 'rotate('+this.rotate +'deg)'
                // drawing4.style.transform = 'rotate('+this.rotate +'deg)'
                // this.loadeds();
                this.updateDrawingRotateInfo();
        },
        straightLine(){
            this.isDrawing=true;
            this.shapeType="1";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        circular(){
            this.isDrawing=true;
            this.shapeType="2";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        rectangleTool(){
            this.isDrawing=true;
            this.shapeType="3";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        cloudLine(){
            this.isDrawing=true;
            this.shapeType="4";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        drawingText(){
            this.isDrawing=true;
            this.shapeType="5";
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        appended(){
            this.isDrawing=true;
            this.shapeType="6";
            this.beginDraw = true;
            if(this.stage=='-1'){
                this.stage='1';//阶段
            }
            this.isMark='0';//标记
            this.getAllUser();
        },
        drawingClick(){
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
             this.screenLeft.item = 3
            //  this.isSelect='';
            //  this.biaozhushow=true;
            // this.loadeds()
            this.queryAnnotation()
        },
        reloaded(){
            this.allList='';
            let canvas1 = document.getElementById("abs");
            // console.log(canvas1);
            let start = {x:0,y:0};
            let end = {x:0,y:0};
            var points = [];
            this.beginDraw = false;
            var FinishDraw = false;
            let ctx=canvas1.getContext("2d");
            ctx.strokeStyle='rgb(252, 52, 57)';
            ctx.lineWidth=3;
            let canvas_select = document.getElementById("canvas_select");
            let ctx_select=canvas_select.getContext("2d");
            this.allList=JSON.parse(this.coordinateInfoList_all)
            this.layerID=this.allList[this.allList.length-1].ID;
            console.log(this.layerID);
            // console.log(typeof(this.allList),'0000');
            this.allList.forEach((item)=>{
                this.drawingMethodsSave(item,ctx,ctx_select);
            })
        },
        loadsNew(){
            var that =  this; 
            setTimeout(()=>{
                that.loadeds()
                },25
            )
        },
        //此为可以需要批注，加载canvas等
        loadeds(){
             this.allList='';
            //  this.rotate=0;
            // alert('dff')
            //  alert('hdjsf')
            // console.log($event);
            // this.$refs.pdfDocument.$refs.canvasParent.children[0].onmouseover= ()=>{
                // console.log(this.coordinateInfoList_all);
            
            if(document.getElementById("abs")){
                    this.getDrawingRotateInfo();
                    return;
                }
            // let fz_img = new Image();
            // fz_img.src = "./images/fuz1.png";
            let canvas1 = document.createElement("canvas");
            let start = {x:0,y:0};
            let end = {x:0,y:0};
            var points = [];
            this.beginDraw = false;
            var FinishDraw = false;
            let ctx=canvas1.getContext("2d");
            ctx.strokeStyle='rgb(252, 52, 57)';
            ctx.lineWidth=3;
        
            {   //  建立显示图层
                if(this.pdfShow==true){
                    this.$refs.pdfDocument.$refs.canvasParent.children[0].style.position="absolute";
                    canvas1.id = "abs";
                    canvas1.style.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.width;
                    // console.log("前缀1",canvas1.style.width)
                    canvas1.style.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.height;
                    //  console.log("前缀2",canvas1.style.height)
                    canvas1.style.position = "absolute";
                    canvas1.style.left=0;
                    canvas1.style.top=0;
                    // console.log("前缀11",canvas1.width)
                    canvas1.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetWidth
                    canvas1.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetHeight
                    this.StartWidth = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetWidth
                    this.StartHeight = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetHeight
                    this.$refs.pdfDocument.$refs.canvasParent.appendChild(canvas1);
                    if(this.drawingId){
                        this.getDrawingRotateInfo();
                    }
                }else if(this.imgShow==true){
                    canvas1.id ="abs";
                    var img=document.getElementById("imgCanvas")
                    var imgDiv=document.getElementById("imgCanvasDiv")
                    canvas1.width = img.width;
                    canvas1.height = img.height;
                    canvas1.style.position = "absolute";
                    canvas1.style.left=0;
                    canvas1.style.top=0;
                    imgDiv.appendChild(canvas1);
                }
            }   
            let canvas_select = document.createElement("canvas");
            let ctx_select=canvas_select.getContext("2d");
            {   //  建立选择图层
                if(this.pdfShow==true){
                    canvas_select.id = "canvas_select";
                    canvas_select.style.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.width;
                    canvas_select.style.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.height;
                    console.log("前缀2",canvas_select.style.width);
                    canvas_select.style.display = "none";
                    canvas_select.style.position = "absolute";
                    canvas_select.style.left=0;
                    canvas_select.style.top=0;
                    canvas_select.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetWidth;
                    canvas_select.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetHeight;
                    // this.$refs.pdfDocument.$refs.canvasParent.appendChild(canvas1);
                }else if(this.imgShow==true){
                    canvas_select.id = "canvas_select";
                    var img=document.getElementById("imgCanvas")
                    var imgDiv=document.getElementById("imgCanvasDiv")
                    canvas_select.width = img.width;
                    canvas_select.height = img.height;
                    canvas_select.style.display = "none";
                    canvas_select.style.position = "absolute";
                    canvas_select.style.left=0;
                    canvas_select.style.top=0;
                    // imgDiv.appendChild(canvas_select);
                }
                // ctx_select.strokeStyle='rgb(252, 52, 57)';
                this.$refs.pdfDocument.$refs.canvasParent.appendChild(canvas_select);
                canvas_select.onclick = (e)=>{console.log("canvas_select"); canvas_select.style.display = "none";}
            }
                // canvas1.drawElements=[];
                let input = document.createElement("input");
                input.id="absInp"
                input.style.width = "196px";
                input.style.height = "28px";
                input.style.display = "none";
                input.style.position = "absolute";
                input.type="text";
                canvas1.parentNode.appendChild(input);
                // console.log(this.coordinateInfoAllListss);
                // this.coordinateInfoList_all.forEach((item)=>{
                //     this.drawingMethodsSave(item,ctx,ctx_select);
                
                // })
                // this.drawingMethods(this.shapeType,ctx,start,end,x,y,FinishDraw,points,e)
               
                canvas1.reflash = (e)=>{
                    
                    // console.log(canvas1.drawElements);
                    
                    ctx.clearRect(0,0,this.StartWidth,this.StartHeight);
                    ctx_select.clearRect(0,0,this.StartWidth,this.StartHeight);
                    //  console.log(canvas1.drawElements,'reflash')
                    // ctx.clearRect(0,0,canvas1.offsetWidth,canvas1.offsetHeight);
                    this.coordinateInfoAllList=canvas1.drawElements;

                   
                    // console.log(this.commentShapeType)
                    // console.log(this.allList,'图纸批注')
                    
                    // console.log(canvas1.drawElements);
                   canvas1.drawElements.forEach((item)=>{
                       this.drawingMethodsSave(item,ctx,ctx_select);
                   })
                   this.allList='';
                }
                // if(screenLeft.item ==3){
                //     canvas1.onmousedown();
                //     canvas1.onmousemove();
                //     canvas1.onmouseup();
                // }

                    var canvas_start_move = {x:0,y:0};
                    var canvas_start_position = {top:0,left:0};
                    var canvas_move_status = "none";
                    var changeSize_position = {x:0,y:0};
                 
                    canvas1.onmousedown = (e)=>{
                        // let ex=e.layerX.style.transform='rotate('+this.rotate +'deg)'
                        // let ey=e.layerY.style.transform='rotate('+this.rotate +'deg)'
                        var layerX_ = e.layerX / this.Koeffizent;
                        var layerY_ = e.layerY / this.Koeffizent;


                        var center = {x:(canvas1.offsetWidth/2)/this.Koeffizent,y:(canvas1.offsetHeight/2)/this.Koeffizent};
                        console.log(center);
                        var V3 = new THREE.Vector3(layerX_,layerY_,0);
                        V3.x -= center.x;
                        V3.y -= center.y;
                        var Matrix = new THREE.Matrix4();
                        Matrix.makeRotationZ(this.rotate*Math.PI/180);
                        V3.applyMatrix4(Matrix);
                        V3.x += center.x;
                        V3.y += center.y;
                        layerX_ = V3.x;
                        layerY_ = V3.y;
                        console.log(layerX_,'计算的坐标x');
                        console.log(layerY_,'计算的坐标y');

                        console.log(e.layerX,'坐标x');
                        console.log(e.layerY,'坐标y');
                        canvas1.drawElements=Object.assign(canvas1.drawElements,this.allList)
                        if(input.style.display == "block"){
                            input.style.display = "none";
                            for(let i = 0;i < canvas1.drawElements.length;i++){
                                if(canvas1.drawElements[i].ID == this.layerID){
                                    canvas1.drawElements[i].text = input.value;
                                    // console.log(canvas1.drawElements," ",canvas1.drawElements[i].text);
                                }
                            }
                            var coordinateLen=this.coordinateInfoAllList.length
                            this.commentShapeType=this.coordinateInfoAllList[coordinateLen-1].t;
                            console.log(this.commentShapeType);
                            this.coordinateInfoAllList=canvas1.drawElements;
                            this.addAnnotation();

                            
                            // console.log(canvas1.drawElements,'输入值');
                            
                            // this.commentShapeType='5'
                            // this.addAnnotation();
                        }

                        // this.isDrawing=false;
                        var selectColorID = ctx_select.getImageData(layerX_ ,  layerY_, 1, 1).data;
                        var red = selectColorID[0];
                        var green = selectColorID[1];
                        var blue = selectColorID[2];
                        console.log(selectColorID);
                        if(!this.beginDraw){
                            console.log('选中');
                            if(red != 0 || green != 0 || blue != 0){    // 已经选择标注
                                for(let i = 0;i < canvas1.drawElements.length;i++){
                                    if(canvas1.drawElements[i].ID == red + green * 256 + blue * 256 *256){ // 如果选中则改变标签状态为 selected
                                        canvas1.drawElements[i].status = "selected";
                                    }else{
                                        canvas1.drawElements[i].status = "none";
                                    }
                                   
                                }
                                 canvas1.reflash();
                                return;
                            }
                        }

                        if(e.button == 0&&this.isDrawing){

                            this.beginDraw = true;
                            start.x = layerX_;
                            start.y = layerY_;
                            this.layerID++;
                            if(this.shapeType=="4"){
                                if(!FinishDraw){
                                    start.x = layerX_;
                                    start.y = layerY_;
                                    if(points.length > 0){
                                        if( Math.pow((points[0].x - layerX_)*(points[0].x - layerX_) + 
                                                    (points[0].y - layerY_)*(points[0].y - layerY_),0.5) <= 20){	// 首尾链接算完成
                                            points.push({x:points[0].x,y:points[0].y});
                                            FinishDraw = true;
                                            canvas1.onmousemove(e);
                                            // this.isDrawing = false;
                                            this.beginDraw=false;
                                            this.isDrawing=false;
                                            
                                            start.x = 1000000000;
                                            start.y = 1000000000;

                                            end.x = -1000000000;
                                            end.y = -1000000000;

                                            let points_2 = [];

                                            for(let i = 0; i < points.length;i++){
                                                if(points[i].x > end.x){
                                                    end.x = points[i].x;
                                                }

                                                if(points[i].x < start.x){
                                                    start.x = points[i].x;
                                                }

                                                if(points[i].y > end.y){
                                                    end.y = points[i].y;
                                                }

                                                if(points[i].y < start.y){
                                                    start.y = points[i].y;
                                                }

                                                points_2.push({x:points[i].x,y:points[i].y});

                                            }

                                            start.x -= 20;
                                            start.y -= 20;
                                            end.x += 20;
                                            end.y += 20;
                                            canvas1.drawElements=Object.assign(canvas1.drawElements,this.allList)
                                            canvas1.drawElements.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},points:points_2,t:this.shapeType,ID:this.layerID,annotationInfo:'',status:"none"});
                                            this.coordinateInfoList.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},points:points_2,t:this.shapeType,ID:this.layerID,annotationInfo:'',status:"none"});
                                            this.coordinateInfoAllList=canvas1.drawElements;
                                            var coordinateLen=this.coordinateInfoAllList.length
                                            this.commentShapeType=this.coordinateInfoAllList[coordinateLen-1].t;
                                            console.log(this.commentShapeType);
                                            this.addAnnotation();
                                            points = [];
                                            FinishDraw = false;

                                            return;
                                        }
                                    }
                                    points.push({x:layerX_,y:layerY_});
                                }
                                canvas1.onmousemove(e);
                            }
                            
                        }
                        // if(e.button == 2){
                        //     FinishDraw = false;
                        // 	points = [];
                        // }
                        
                    }
                    canvas1.onmouseup = (e)=>{

                        var layerX_ = e.layerX / this.Koeffizent;
                        var layerY_ = e.layerY / this.Koeffizent;
                        // var center = {x:canvas1.offsetWidth/2,y:canvas1.offsetHeight/2};
                        var center = {x:(canvas1.offsetWidth/2)/this.Koeffizent,y:(canvas1.offsetHeight/2)/this.Koeffizent};
                        console.log(center);
                        var V3 = new THREE.Vector3(layerX_,layerY_,0);
                        V3.x -= center.x;
                        V3.y -= center.y;
                        var Matrix = new THREE.Matrix4();
                        Matrix.makeRotationZ(this.rotate*Math.PI/180);
                        V3.applyMatrix4(Matrix);
                        V3.x += center.x;
                        V3.y += center.y;
                        layerX_ = V3.x;
                        layerY_ = V3.y;
                        console.log(layerX_,'计算的坐标x up');
                        console.log(layerY_,'计算的坐标y up');
                        console.log(e.layerX,'坐标x up');
                        console.log(e.layerY,'坐标y up');
                        if(this.beginDraw){
                            if(this.shapeType!="4"){
                                this.coordinateInfoList=[];
                                this.beginDraw = false;
                                this.isDrawing=false;
                                canvas1.drawElements=Object.assign(canvas1.drawElements,this.allList)
                                // console.log(canvas1.drawElements);
                                canvas1.drawElements.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},t:this.shapeType,ID:this.layerID,annotationInfo:'',status:"none"});

                                this.coordinateInfoList.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},t:this.shapeType,ID:this.layerID,annotationInfo:'',status:"none"});
                                 var coordinateLen=this.coordinateInfoAllList.length
                                this.commentShapeType=this.coordinateInfoAllList[coordinateLen-1].t;
                                // console.log(this.commentShapeType);
                                if(this.shapeType!= "5"){
                                    this.addAnnotation();
                                    // canvas_select.style.display = "block";
                                }
                                // console.log(this.coordinateInfoList);
                                if(this.shapeType == "5"){
                                    input.value = "标注";
                                    input.style.left = (end.x  - 98) * this.Koeffizent + "px";
                                    input.style.top = (end.y - 14) * this.Koeffizent + "px";
                                    input.style.display = "block";
                                    // console.log(input.text);
                                }
                                canvas1.reflash();
                            }else{
                                
                            }
                        }
                       
                        // console.log(this.coordinateInfoList);
                    }
                    canvas1.onmousemove = (e)=>{
                        // alert('触发节点down2')

                        var layerX_ = e.layerX / this.Koeffizent;
                        var layerY_ = e.layerY / this.Koeffizent;

                        // var center = {x:canvas1.offsetWidth/2,y:canvas1.offsetHeight/2};
                        var center = {x:(canvas1.offsetWidth/2)/this.Koeffizent,y:(canvas1.offsetHeight/2)/this.Koeffizent};
                        // console.log(center);
                        var V3 = new THREE.Vector3(layerX_,layerY_,0);
                        V3.x -= center.x;
                        V3.y -= center.y;
                        var Matrix = new THREE.Matrix4();
                        Matrix.makeRotationZ(this.rotate*Math.PI/180);
                        V3.applyMatrix4(Matrix);
                        V3.x += center.x;
                        V3.y += center.y;
                        layerX_ = V3.x;
                        layerY_ = V3.y;
                            // console.log(e.layerX,'坐标x move');
                            // console.log(e.layerY,'坐标y move');
                        let x =  layerX_;
                        let y =  layerY_;
                        if(this.beginDraw&&this.isDrawing){
                            canvas1.drawElements=Object.assign(canvas1.drawElements,this.allList)//此为两个数组连接，需要保存之前的数据
                            canvas1.reflash();
                            this.drawingMethods(this.shapeType,ctx,start,end,x,y,FinishDraw,points,e)
                        }
                    }

                    document.getElementById('drawingPic').onmousemove = (e)=>{
                        
                        changeSize_position.x = (e.target.offsetWidth / 2 - e.layerX) / e.target.offsetWidth;
                        changeSize_position.y = (e.target.offsetHeight / 2 - e.layerY) / e.target.offsetHeight;

                    }

                    document.getElementById('drawingPic').onmousewheel = (e)=>{
                        e.preventDefault();

                        if(e.deltaY > 0){
                            
                            if(this.Koeffizent < 1){
                                return
                            }
                            this.Koeffizent *= 0.8;
                            
                        }else{
                            
                            if(this.Koeffizent > 3){
                                return;
                            }
                            this.Koeffizent *= 1.25;
                        }

                        var pdf_div = document.getElementById('drawingPdf');

                        // var drawingPic = document.getElementById('drawingPic');

                        var h = this.$refs.pdfDocument.$refs.canvasParent.children[0].height / this.$refs.pdfDocument.$refs.canvasParent.children[0].width ;

                        pdf_div.style.width = this.Koeffizent * 100 + "%";
                        pdf_div.style.height = this.Koeffizent * 100 + "%";

                        var annotationLayer = document.getElementsByClassName("annotationLayer");
                        annotationLayer[0].style.display = "none";

                        canvas1.style.width = pdf_div.offsetWidth + "px";
                        canvas1.style.height = pdf_div.offsetWidth * h + "px";

                        canvas_select.style.width = pdf_div.offsetWidth + "px";
                        canvas_select.style.height = pdf_div.offsetWidth * h + "px";

                        ///////////////////////////// 改变位置 //////////////////////////////////

                        var drawingPic = document.getElementById('drawingPic');

                        if(drawingPic.scrollWidth >= drawingPic.offsetWidth){

                            // console.log(drawingPic.offsetHeight," ",drawingPic.offsetWidth);
                            // console.log(drawingPic.scrollHeight," ",drawingPic.scrollWidth," ",drawingPic.scrollTop," ",drawingPic.scrollLeft);

                            if(changeSize_position.x < 0){
                                drawingPic.scrollLeft = (drawingPic.scrollWidth - drawingPic.offsetWidth);
                            }else{
                                drawingPic.scrollLeft = 0;
                            }

                            if(changeSize_position.y < 0){
                                drawingPic.scrollTop = (drawingPic.scrollHeight - drawingPic.offsetHeight);
                            }else{
                                drawingPic.scrollTop = 0;
                            }

                        }


                        /////////////////////////////////////////////////////////////////////////
                    }

            canvas1.drawElements=[];
            this.coordinateInfoList=[];
        },
        //绘图方法储存函数
        drawingMethodsSave(item,ctx,ctx_select){
            switch(item.t){
                    case "1":
                        ctx.strokeStyle='rgb(252, 52, 57)';
                        ctx.lineWidth=3;
                        ctx.beginPath();
                        ctx.moveTo(item.s.x,item.s.y)
                        ctx.lineTo(item.e.x,item.e.y)
                        ctx.stroke();
                        //直线选中变样式
                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();
                            ctx.rect(item.s.x - 5,item.s.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.e.y - 5,10,10);
                            ctx.stroke();
                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                        }
                        ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                        ctx_select.lineWidth=12;
                        ctx_select.beginPath();
                        ctx_select.moveTo(item.s.x,item.s.y)
                        ctx_select.lineTo(item.e.x,item.e.y)
                        ctx_select.stroke();
                        break;
                    case "2":
                        ctx.strokeStyle='rgb(252, 52, 57)';
                        ctx.lineWidth=3;
                        ctx.beginPath();
                        ctx.ellipse(item.s.x + (item.e.x - item.s.x)/2,item.s.y + (item.e.y - item.s.y)/2,Math.abs(item.e.x - item.s.x)/2,Math.abs(item.e.y - item.s.y)/2,0,0,Math.PI*2,true);
                        ctx.stroke();
                        
                        //圆形选中变样式
                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();
                            ctx.rect(item.s.x - 5,item.s.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.s.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.s.y - 5,10,10);
                            ctx.stroke();
                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                            ctx.setLineDash([12,6]);
                            ctx.beginPath();
                            ctx.moveTo(item.s.x + 5,item.s.y);
                            ctx.lineTo(item.e.x - 5,item.s.y);
                            ctx.moveTo(item.e.x ,item.s.y + 5);
                            ctx.lineTo(item.e.x ,item.e.y - 5);
                            ctx.moveTo(item.e.x - 5,item.e.y);
                            ctx.lineTo(item.s.x + 5,item.e.y);
                            ctx.moveTo(item.s.x,item.e.y - 5);
                            ctx.lineTo(item.s.x,item.s.y + 5);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                        ctx_select.lineWidth=12;
                        ctx_select.beginPath();
                        ctx_select.ellipse(item.s.x + (item.e.x - item.s.x)/2,item.s.y + (item.e.y - item.s.y)/2,Math.abs(item.e.x - item.s.x)/2,Math.abs(item.e.y - item.s.y)/2,0,0,Math.PI*2,true);
                        ctx_select.stroke();

                        // ctx_select.fillStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';;
                        // ctx_select.fill();
                        
                        break;
                    case "3":
                        ctx.strokeStyle='rgb(252, 52, 57)';
                        ctx.lineWidth=3;
                        ctx.beginPath();
                        ctx.rect(item.s.x,item.s.y,item.e.x - item.s.x,item.e.y - item.s.y);
                        ctx.stroke(); 
                        //矩形选中变样式
                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();
                            ctx.rect(item.s.x - 5,item.s.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.s.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.s.y - 5,10,10);
                            ctx.stroke();
                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                        }

                        ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                        ctx_select.lineWidth=12;
                        ctx_select.beginPath();
                        ctx_select.rect(item.s.x,item.s.y,item.e.x - item.s.x,item.e.y - item.s.y);
                        ctx_select.stroke();

                        // ctx_select.fillStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';;
                        // ctx_select.fill();
                        break;
                    case "4":
                        ctx.strokeStyle='rgb(252, 52, 57)';
                        ctx.lineWidth=3;
                        ctx.beginPath();
                        
                        this.drawCloudLine(ctx,item.points,20,true,item.points[item.points.length - 1]);

                        ctx.stroke(); 

                        //矩形选中变样式
                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();
                            ctx.setLineDash([]);
                            ctx.rect(item.s.x - 5,item.s.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.s.x - 5,item.e.y - 5,10,10);
                            ctx.rect(item.e.x - 5,item.s.y - 5,10,10);
                            ctx.stroke();
                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                            ctx.setLineDash([12,6]);
                            ctx.beginPath();
                            ctx.moveTo(item.s.x + 5,item.s.y);
                            ctx.lineTo(item.e.x - 5,item.s.y);
                            ctx.moveTo(item.e.x ,item.s.y + 5);
                            ctx.lineTo(item.e.x ,item.e.y - 5);
                            ctx.moveTo(item.e.x - 5,item.e.y);
                            ctx.lineTo(item.s.x + 5,item.e.y);
                            ctx.moveTo(item.s.x,item.e.y - 5);
                            ctx.lineTo(item.s.x,item.s.y + 5);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                        ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                        ctx_select.lineWidth=24;
                        ctx_select.beginPath();
                        ctx_select.moveTo(item.points[0].x,item.points[0].y);
                        for(let j = 0; j < item.points.length - 1;j++){ // 画中间线
                            ctx_select.lineTo(item.points[j + 1].x,item.points[j + 1].y);
                        }

                        ctx_select.stroke();

                        // ctx_select.fillStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';;
                        // ctx_select.fill();

                        break;

                    case "5":

                        ctx.strokeStyle='rgb(252, 52, 57)';
                        ctx.lineWidth=3;
                        let text_X = item.e.x - 120;
                        let text_Y = item.e.y;

                        if(item.e.x < item.s.x){
                            text_X = item.e.x + 120;
                        }

                        ctx.beginPath();
                        let dir = new THREE.Vector2(text_X - item.s.x,text_Y - item.s.y);
                        let length = dir.length();
                        dir.normalize();

                        // length -= 16;

                        ctx.moveTo(item.s.x + dir.x * 16,item.s.y + dir.y * 16);
                        ctx.lineTo(item.s.x  + dir.x * length,item.s.y  + dir.y * length);
                        
                        //执行画线
                        ctx.stroke();

                        //////////////////////////////////////////////////////////////////////

                        let V = new THREE.Vector2(text_X - item.s.x,text_Y - item.s.y);
                        V.normalize();
                        let angle = V.angle();

                        let M = new THREE.Matrix4();
                        M.makeRotationZ(angle);

                        let V1 = new THREE.Vector3(16,8,0);
                        let V2 = new THREE.Vector3(16,-8,0);

                        V1.applyMatrix4(M);
                        V2.applyMatrix4(M);

                        // ctx.lineWidth=1;
                        ctx.beginPath();
                        
                        ctx.moveTo(item.s.x,item.s.y);
                        ctx.lineTo(item.s.x + V1.x,item.s.y + V1.y);
                        ctx.lineTo(item.s.x + V2.x,item.s.y + V2.y);
                        ctx.lineTo(item.s.x,item.s.y);
                        ctx.stroke();
                        ctx.fillStyle='rgb(252, 52, 57)';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.moveTo(text_X,text_Y);
                        ctx.lineTo(item.e.x,text_Y);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(item.e.x - 100,text_Y + 16);
                        ctx.lineTo(item.e.x + 100,text_Y + 16);
                        ctx.lineTo(item.e.x + 100,text_Y - 16);
                        ctx.lineTo(item.e.x - 100,text_Y - 16);
                        ctx.lineTo(item.e.x - 100,text_Y + 16);

                        ctx.stroke();

                        ctx.fillStyle='rgb(255,255,255)';
                        ctx.fill();
                        
                        if(item.text){
                            ctx.fillStyle='rgb(252, 52, 57)';
                            ctx.font="18px Georgia";
                            ctx.fillText(item.text,item.e.x - 96,text_Y + 6,192);
                        }

                        //矩形选中变样式
                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();

                            ctx.rect(item.e.x - 100 - 5,text_Y + 16 - 5,10,10);
                            ctx.rect(item.e.x + 100 - 5,text_Y + 16 - 5,10,10);
                            ctx.rect(item.e.x + 100 - 5,text_Y - 16 - 5,10,10);
                            ctx.rect(item.e.x - 100 - 5,text_Y - 16 - 5,10,10);
                            ctx.stroke();

                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                        }

                            ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                            ctx_select.lineWidth=3;
                            ctx_select.beginPath();
                            ctx_select.rect(item.e.x - 100,item.e.y - 16,200,32);
                            ctx_select.stroke();

                            // ctx_select.fillStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';;
                            // ctx_select.fill();
                        
                        break;
                    case "6":

                        let fz_img = document.getElementById("fz_img_for_draw");
                        ctx.drawImage(fz_img,item.e.x - 9,item.e.y - 9);

                        if(item.status == "selected"){
                            ctx.strokeStyle='rgb(0, 0, 0)';
                            ctx.lineWidth=1;
                            ctx.beginPath();

                            ctx.rect(item.e.x - 12,item.e.y - 12,4,4);
                            ctx.rect(item.e.x - 12,item.e.y + 8,4,4);
                            ctx.rect(item.e.x + 8,item.e.y + 8,4,4);
                            ctx.rect(item.e.x + 8,item.e.y - 12,4,4);
                            ctx.stroke();

                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                            ctx.setLineDash([]);
                        }
                        ctx_select.strokeStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';
                        ctx_select.lineWidth=12;
                        ctx_select.beginPath();
                        ctx_select.rect(item.e.x - 10,item.e.y - 10,20,20);
                        ctx_select.stroke();

                        ctx_select.fillStyle='rgb(' + item.ID % 256 +  ','+ parseInt(item.ID / 256) % 256  + ', 0)';;
                        ctx_select.fill();
                        break
            } 
        },
        //绘图方法函数
        drawingMethods(shapeType,ctx,start,end,x,y,FinishDraw,points,e){

            var layerX_ = e.layerX / this.Koeffizent;
            var layerY_ = e.layerY / this.Koeffizent;

            switch(shapeType){
                        case "1":
                            ctx.strokeStyle='rgb(252, 52, 57)';
                            ctx.lineWidth=3;
                            ctx.beginPath();
                            ctx.moveTo(start.x,start.y);
                            ctx.lineTo(x,y);
                            // ctx.rect(start.x,start.y,x - start.x,y - start.y);
                            ctx.stroke(); 
                            end.x = x;
                            end.y = y;
                            // console.log(start.x,"",start.y);                        
                        break;
                        case "2":
                            ctx.strokeStyle='rgb(252, 52, 57)';
                            ctx.lineWidth=3;
                            ctx.beginPath();
                            ctx.ellipse(start.x + (x - start.x)/2,start.y + (y - start.y)/2,Math.abs(x - start.x)/2,Math.abs(y - start.y)/2,0,0,Math.PI*2,true);
                            ctx.stroke(); 
                            end.x = x;
                            end.y = y;
                        break;
                        case "3":
                            ctx.strokeStyle='rgb(252, 52, 57)';
                            ctx.lineWidth=3;
                            ctx.beginPath();
                            ctx.rect(start.x,start.y,x - start.x,y - start.y);
                            ctx.stroke(); 
                            end.x = x;
                            end.y = y;
                        break;
                        case "4":
                        {
                            ctx.strokeStyle='rgb(252, 52, 57)';
                            ctx.lineWidth=3;
                            ctx.beginPath();
                            if(!FinishDraw){
                                if(points.length > 1){	//	画结束位置
                                    ctx.rect(points[0].x - 10,points[0].y - 10,20,20);
                                }
                            }
                            ctx.stroke()
                            this.drawCloudLine(ctx,points,20,FinishDraw,{x:layerX_,y:layerY_});
                        }
                        break;
                        case "5":

                            ctx.strokeStyle='rgb(252, 52, 57)';
                            ctx.lineWidth=3;
                            let text_X = layerX_ - 120;
                            let text_Y = layerY_;

                            if(layerX_ < start.x){
                                text_X = layerX_ + 120;
                            }

                            ctx.beginPath();
                            let dir = new THREE.Vector2(text_X - start.x,text_Y - start.y);
                            let length = dir.length();
                            dir.normalize();

                            // length -= 16;

                            ctx.moveTo(start.x + dir.x * 16,start.y + dir.y * 16);
                            ctx.lineTo(start.x  + dir.x * length,start.y  + dir.y * length);
                            
                            //执行画线
                            ctx.stroke();

                            //////////////////////////////////////////////////////////////////////

                            let V = new THREE.Vector2(text_X - start.x,text_Y - start.y);
                            V.normalize();
                            let angle = V.angle();

                            let M = new THREE.Matrix4();
                            M.makeRotationZ(angle);

                            let V1 = new THREE.Vector3(16,8,0);
                            let V2 = new THREE.Vector3(16,-8,0);

                            V1.applyMatrix4(M);
                            V2.applyMatrix4(M);
                            // ctx.lineWidth=1;
                            ctx.beginPath();
                            ctx.moveTo(start.x,start.y);
                            ctx.lineTo(start.x + V1.x,start.y + V1.y);
                            ctx.lineTo(start.x + V2.x,start.y + V2.y);
                            ctx.lineTo(start.x,start.y);
                            ctx.stroke();
                            ctx.fillStyle='rgb(252, 52, 57)';
                            ctx.fill();
                            ctx.beginPath();
                            ctx.moveTo(text_X,text_Y);
                            ctx.lineTo(layerX_,text_Y);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(layerX_ - 100,text_Y + 16);
                            ctx.lineTo(layerX_ + 100,text_Y + 16);
                            ctx.lineTo(layerX_ + 100,text_Y - 16);
                            ctx.lineTo(layerX_ - 100,text_Y - 16);
                            ctx.lineTo(layerX_ - 100,text_Y + 16);
                            ctx.stroke();
                            ctx.fillStyle='rgb(255,255,255)';
                            ctx.fill();
                            end.x = x;
                            end.y = y;
                            
                        break;
                        case "6":
                            let fz_img = document.getElementById("fz_img_for_draw");
                            ctx.drawImage(fz_img,x - 9,y - 9);

                            end.x = x;
                            end.y = y;
                        break;
                    }


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
            // document.getElementById('abs').previousSibling.style.transform = 'rotate('+this.rotate +'deg)';
            // document.getElementById('abs').style.transform = 'rotate('+this.rotate +'deg)';
            // document.getElementById('abs').nextSibling.style.transform = 'rotate('+this.rotate +'deg)';
            // document.getElementById('canvas_select').style.transform = 'rotate('+this.rotate +'deg)';
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
                        this.rotate=response.data.rt.rotateInfo;
                    }
                    document.getElementById('abs').previousSibling.style.transform = 'rotate('+this.rotate +'deg)';
                    document.getElementById('abs').style.transform = 'rotate('+this.rotate +'deg)';
                    document.getElementById('abs').nextSibling.style.transform = 'rotate('+this.rotate +'deg)';
                    document.getElementById('canvas_select').style.transform = 'rotate('+this.rotate +'deg)';
                        // let ctx=document.getElementById('abs').getContext("2d");
                        // let ctx_select=document.getElementById('canvas_select').getContext("2d");
                        // ctx.rotate(this.rotate*Math.PI/180);
                        // ctx_select.rotate(this.rotate*Math.PI/180);
                    
                }else{
                    // this.$message({
                    //     type:'error',
                    //     message:response.data.msg
                    // })
                } 
            })
        },
        //添加批注
        addAnnotation(){

            var vm=this
            if(this.shapeType=='5'){
                this.annotationInfo=this.coordinateInfoAllList[this.coordinateInfoAllList.length-1].text;
                console.log(this.annotationInfo);
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
                    type:this.commentShapeType,
                    // projectId:vm.projId
                },
                data:{
                     coordinateInfo:JSON.stringify(this.coordinateInfoAllList)
                }
            }).then((response)=>{
                if(response.data.cd='0'){
                    this.queryAnnotation();
                    this.annotationInfo='';
                    this.commentShapeType='';
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
                    
                }else{
                    this.message({
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
            if(document.getElementById('abs')){
                let absInp=document.getElementById('absInp');
                document.getElementById('abs').drawElements=[];
                document.getElementById('abs').reflash();
            }
            if(this.drawingVersionId==''){
                return;
            }else{
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
                    this.coordinateInfoList_all=this.annotationlist[len-1].coordinateInfo;
                     this.loadeds();
                    this.reloaded();
                    this.annotationlist.forEach((item,index)=>{
                        if(item.isMarked==0){
                            this.$set(item,'isMarkValue',false);
                        }else if(item.isMarked==1){
                            this.$set(item,'isMarkValue',true);
                        }
                        if(this.isClick){
                            if(item.id==this.isClick){
                                this.selectShape=JSON.parse(item.coordinateInfo)[index].ID;
                                // console.log(this.selectShape,'成功');
                                this.allList=JSON.parse(this.coordinateInfoList_all)
                                // console.log(this.allList,'this.allList');
                                if(document.getElementById('abs')){
                                    let can=document.getElementById('abs');
                                    can.drawElements=Object.assign(can.drawElements,this.allList)
                                    console.log(can.drawElements);
                                        {  // 已经选择标注
                                                    for(let i = 0;i < can.drawElements.length;i++){
                                                        if(can.drawElements[i].ID ==this.selectShape){ // 如果选中则改变标签状态为 selected
                                                            can.drawElements[i].status = "selected";
                                                        }else{
                                                            can.drawElements[i].status = "none";
                                                        }
                                                    }
                                                    can.reflash();
                                                    return;
                                        }
                                }
                            }
                        }
                    })
                    var len=this.annotationlist.length;
                    this.commentLen=len;
                    this.coordinateInfoList_all=this.annotationlist[len-1].coordinateInfo;
                    this.loadeds();
                    this.reloaded();
                    // console.log(this.annotationlist,'获取列表');
                   
                    
                }
            })
            
            }
        },
         drawCloudLine(cxt,points,radio,finish,last){
			var counterclockwise = false;
			////////////////// 画角 /////////////////////

			if(finish){
				cxt.beginPath();
				
				let a1 = this.angle(points[0].x,points[0].y,points[points.length - 2].x,points[points.length - 2].y);
				let a2 = this.angle(points[0].x,points[0].y,points[1].x,points[1].y); // 

				let l = this.getLength(points[0].x,points[0].y,points[points.length - 2].x,points[points.length - 2].y);
				let l2 = l - parseInt(l / (radio * 1.5))*(radio * 1.5);
				l2 /= 2;
				let a11 = Math.acos(l2 / radio);
				a11 = Math.abs(a11);

				cxt.arc(points[0].x,points[0].y,radio,a1 + a11,a2 - Math.PI / 4,counterclockwise);
				cxt.stroke();

			}else{
				if(points.length > 1){
					cxt.beginPath();
					
					let a1 = this.angle(points[points.length-1].x,points[points.length-1].y,points[points.length-2].x,points[points.length-2].y);
					let a2 = this.angle(points[points.length-1].x,points[points.length-1].y,last.x,last.y); // 

					let l = this.getLength(points[points.length-1].x,points[points.length-1].y,points[points.length-2].x,points[points.length-2].y);
					let l2 = l - parseInt(l / (radio * 1.5))*(radio * 1.5);
					l2 /= 2;
					let a11 = Math.acos(l2 / radio);
					a11 = Math.abs(a11);


					cxt.arc(points[points.length-1].x,points[points.length-1].y,radio,a1 + a11,a2 - Math.PI / 4 ,counterclockwise);
					cxt.stroke();
				}
			}

			for(let i = 0; i < points.length - 2;i++){ 

				cxt.beginPath();
				
				let a1 = this.angle(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);
				let a2 = this.angle(points[i + 1].x,points[i + 1].y,points[i + 2].x,points[i + 2].y); // 

				let l = this.getLength(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);
				let l2 = l - parseInt(l / (radio * 1.5))*(radio * 1.5);
				l2 /= 2;
				let a11 = Math.acos(l2 / radio);
				a11 = Math.abs(a11);

				cxt.arc(points[i + 1].x,points[i + 1].y,radio,a1 + a11,a2 - Math.PI / 4 ,counterclockwise);
				cxt.stroke();
			}

			/////////////////////////////////////////////

			/////////////////// 画线 /////////////////////

			for(let i = 0; i < points.length - 1;i++){

				let l = this.getLength(points[i].x,points[i].y,points[i + 1].x,points[i + 1].y);
				let a1 = this.angle(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);

				let dir = {x:points[i + 1].x - points[i].x,y:points[i + 1].y - points[i].y};
				dir = this.normalize(dir);

				let k = radio * 1.5;

				for(let j = 1;j < Math.ceil(l / k);j++){

					cxt.beginPath();

					let item = {x:points[i].x + j*k * dir.x,y:points[i].y + j*k * dir.y};
					cxt.arc(item.x,item.y,radio,a1 + Math.PI / 5 ,a1 + Math.PI / 5 * 4,counterclockwise);

					cxt.stroke();
				}
			}

			//////////////////////////////////////////////

			///////////////// 画当前线 ////////////////////

			if(points.length > 0){

				let l = this.getLength(	points[points.length-1].x,
									points[points.length-1].y,last.x,last.y);
				let a1 = this.angle(last.x,last.y,points[points.length-1].x,points[points.length-1].y);

				let dir = {x:last.x - points[points.length-1].x,y:last.y - points[points.length-1].y};
				dir = this.normalize(dir);

				let k = radio * 1.5;

				for(let j = 1;j < Math.ceil(l / k);j++){

					cxt.beginPath();

					let item = {x:points[points.length-1].x + j*k * dir.x,y:points[points.length-1].y + j*k * dir.y};
					cxt.arc(item.x,item.y,radio,a1 + Math.PI / 5 ,a1 + Math.PI / 5 * 4,counterclockwise);

					cxt.stroke();
				}
			}
			//////////////////////////////////////////////
			return counterclockwise;
		},
		angle(x1,y1,x2,y2){
			let x = x2 - x1;
			let y = y2 - y1;

			var angle = Math.atan2( y, x );

			if ( angle < 0 ) angle += 2 * Math.PI;

			return angle;
		},
        getLength(x1,y1,x2,y2){
            return Math.pow((x1 - x2)*(x1 - x2) + 
                            (y1 - y2)*(y1 - y2),0.5)
        },
        normalize(dir){
            let l = Math.pow(dir.x*dir.x + dir.y*dir.y,0.5);

            return {x:dir.x/l,y:dir.y/l};
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
                    this.getDrawingList();
                    // console.log(vm.DirectoryList);
                    vm.showAction = true
                }else{
                    vm.message({
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
                        idKey: "directory",
                        pIdKey: "code",
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
                     this.DirectoryList.forEach((item)=>{
                         let a=[];
                        this.drawingList.forEach((item1)=>{
                            if(item.code==item1.directory){
                                a.push(item1)
                                vm.$set(item,'children',a)
                            }
                        })
                    })
                    // console.log(this.DirectoryList,'目录列表');
                    vm.FileTree = data.transformTozTreeFormat(setting, this.DirectoryList)
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
                        vm.FileTree.forEach((item)=>{
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
                        this.getDrawingRotateInfo();
                        this.getMaxVersionPath();
                        
                    }
                    this.expandedKeys.push(this.directoryId);
                    console.log(this.expandedKeys);
                    
                    // vm.directoryId='';
                    // vm.expandedKeys=[];
                   

                    // console.log(vm.FileTree);
                    // var drawingDirList=this.DirectoryList
                    // if(vm.drawingList != null){
                    //   var children = vm.drawingList.concat(drawingDirList)
                    // }else{
                    //     var children = drawingDirList
                    // }
                    // console.log(children)
                    // vm.FileTree_original = children
                    // vm.FileTree = data.transformTozTreeFormat(setting, children)
                    // console.log(vm.FileTree)
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
            
            var vm=this;
            vm.loading=true;
            axios({
                url:this.BDMSUrl+'dc/drawingReview/getMaxVersionPath',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    drawingId:this.drawingId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.versionPath=response.data.rt;
                    this.drawingFileUrl=this.QJFileManageSystemURL+this.versionPath;
                    if(this.versionPath.substr(this.versionPath.length-3)=='pdf'||this.versionPath.substr(this.versionPath.length-3)=='PDF')
                        {   this.pdfShow=true;
                            this.imgShow=false;
                            this.drawingFileUrl1=this.drawingFileUrl;
                            var source=this.drawingFileUrl;
                           
                            // console.log(source);
                            // this.getDrawingRotateInfo();
                            // document.getElementById('abs').previousSibling.style.transform = 'rotate('+this.rotate +'deg)';
                            // this.init(source);
                            //删除之前节点abs
                        }else{
                            this.imgShow=true;
                            this.pdfShow=false;
                            //绘制文件是png和jpg格式的图片
                            var c = document.getElementById("imgCanvas");//此为之前创建的一个图片框架
                           
                            var width=c.width;
                            var height=c.height;
                            var ctx_img = c.getContext("2d");
                            ctx_img.clearRect(0,0,width,height);
                            var img = new Image();
                            img.onload =function() {
                                ctx_img.drawImage(img,0, 0);
                                }
                            img.src = this.drawingFileUrl;
                            var source=this.drawingFileUrl;
                            // this.init(source);
                        }
                        // this.loadeds();
                        
                        
                    // console.log(this.versionPath);
                }
                this.loading=false;
            })
        },
        handleNodeClick(obj){
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
                        this.loading=false;
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
            vm.drawingsUploadShow = true
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
                    ratio:vm.editDrawing.dscale//图纸比例
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
            vm.fileList=[]
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
                var returnUrl = vm.BDMSUrl+'dc/drawingReview/updateVersion?drawingId='+vm.checkFileDir.id+'&pageNo=1'
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
                    fileName:list[0].name,//文件名
                    drawingName:list[0].name.split('.')[0],//图纸名
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
            // setTimeout(function(){
            //       vm.fileList.push({
            //         file:list[0],//文件
            //         drawingNo:'',//图号
            //         proportion:'',//比例
            //         fileName:list[0].name,//文件名
            //         drawingName:list[0].name.split('.')[0],//图纸名
            //         dwidth:dwidth,
            //         dheight:dheight
            //     })
            // },0)
            // console.log(JSON.stringify(vm.fileList));
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
                var returnUrl = vm.BDMSUrl+'dc/drawingReview/addDrawing?projectId='+vm.projId+'&drawingNumber='+item.drawingNo+'&directory='+vm.directoryId+'&drawingName='+item.drawingName+'&ratio='+item.proportion+'&pageNo=1'
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
                            vm.getDirectory()
                            // vm.getDrawingList()
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                             vm.fileList = []
                        }
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
        .el-tree-node__content{
                height: 30px;
        }
        .is-current .el-tree-node__content{
            color: #333333;
            font-weight: bold;
        }
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
                                // &:hover{
                                //     background: url('./images/zuox1.png')no-repeat 0 0;
                                // }
                            }
                            .youRotate{
                                left:70px;
                                top:9px;
                                background: url('./images/youx.png')no-repeat 0 0;
                                // &:hover{
                                //     background: url('./images/youx1.png')no-repeat 0 0;
                                // }
                            }
                }
            }
            .noImg{
                    margin:150px auto;
                }
            #drawingPic{
                    margin:0 auto;
                    overflow: auto;
                    position: absolute;
                    top: 115px;
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
            #drawingToolsBody{
                position: absolute;
                bottom: 50px;
                left:50%;
                width: 100%;
                margin-left:-210px;
                    .drawingTools{
                        width: 475px;
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
                 padding: 10px 13px 0 40px;
                 .versionBody{
                     .versionHead{
                        font-size:14px;
                        color:#333333;
                        font-weight: bold;
                        height: 28px;
                        width: 100%;
                        text-align: left;
                        margin-left: 1px;
                        border-bottom: 1px solid #e6e6e6;
                     }
                     .versionUlSel{
                         background-color: #e6e6e6;
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
                        margin:3px;
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
                 padding: 10px 13px 0 40px;
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
                        width: 100%;
                        text-align: left;
                        margin-left: 1px;
                        border-bottom: 1px solid #e6e6e6;
                        .export{
                            float: right;
                            margin-right:10px;
                            cursor: pointer;
                            color:#fc3439;
                        }
                     }
                     .clickbody{
                         background: #e2e2e2;
                     }
                    .drawingApendedInfobody{
                        margin:20px 3px;
                        position: relative;
                        border-bottom: 1px solid #ccc;
                         .apendedInfoOne{
                             width: 100%;
                             height: 30px;
                             img{
                                 float: left;
                                 margin-top:7px;
                                 margin-right: 2px
                             }
                             .userName{
                                 float: left;
                                 font-size: 14px;
                                 color:#333333;
                                 line-height: 30px;
                             }
                             .deleteMark{
                                 margin-left: 103px;
                                 margin-top:6px;
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
                                 right:4px;

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
                            margin-left:8px;
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
                                height: 18px;
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
                                height: 30px;
                                 padding-left:4px;
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
                                        .replyName{
                                            font-size:14px;
                                            color:#333333;
                                            width: 45px;
                                            display: inline-block;
                                            text-align: left;
                                        }
                                        .replyTime{
                                            margin-left:4px;
                                            font-size:12px;
                                            color:#666666;
                                            width: 90px;
                                            display: inline-block;
                                            text-align: left;
                                        }
                                        .deleteMark1{
                                            // margin-left: 78px;
                                            // margin-top:2px;
                                            display:inline-block;
                                            background: url('../ManageCost/images/delete.png')no-repeat 0 0;
                                            margin-left: 30px;
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
                    .editUpDrawingText{
                        display:inline-block;
                        width: 60px;
                        font-size: 14px;
                        color:#666666;
                        text-align: right;
                    }
                    .editUpDrawingValue{
                        margin-left:40px;
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

                    .editUpDrawingProjectText{
                        display:inline-block;
                        
                        margin-left: -122px;
                        width: 60px;
                        font-size: 14px;
                        color:#666666;
                        text-align: left;
                    }
                    .editUpDrawingProjectText1{
                        margin-left: 39px;
                        display: inline-block;
                        width: 120px;
                        font-size: 14px;
                        color: #333333;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;

                    }
                    .editUpDrawingProjectBtn{
                            margin-top:10px;
                            margin-left: 100px;
                            display: block;
                            width: 80px;
                            height: 30px;
                            border: none;
                            line-height: 30px;
                            padding: 0;
                            cursor: pointer;
                            border-radius: 2px;
                            background: #e2e2e2;
                            margin-right: 20px;
                            color: #8f8f8f;
                            font-size: 14px;
                            font-weight: normal;
                    }
                }
            }
        }
    }

</style>