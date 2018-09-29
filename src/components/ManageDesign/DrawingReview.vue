<template>
    <div id="drwaingReview">
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
                <div class="commentInformation" v-show="screenLeft.item == 3">
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
                <div @mouseenter="loadeds()" v-show="versionPath" class="drawingPic">
                    
                    <!-- <img id="drawPic" :src="this.QJFileManageSystemURL+this.versionPath"/> -->
                    <pdf ref="pdfDocument"   @num-pages="pageCount = $event" @page-loaded="currentPage = $event" :rotate="rotate" :src="this.QJFileManageSystemURL+this.versionPath"></pdf>
                </div>
                <!-- {{currentPage}} / {{pageCount}} -->
            </div>
            <div v-show="screenLeft.item == 3" id="drawingToolsBody">
                    <ul class="drawingTools">
                        <li><i class="drawingIcon zuoRotate" @click="zuoRotate()"></i></li>
                        <li><i class="drawingIcon youRotate" @click="youRotate()"></i></li>
                        <li><i class="drawingIcon straightLine" @click="straightLine()"><span style="color:#fc3439;font-size:14px;">直线</span></i></li>
                        <li><i class="drawingIcon circular" @click="circular()"><span style="color:#fc3439;font-size:14px;">圆形</span></i></li>
                        <li><i class="drawingIcon rectangle" @click="rectangleTool()"><span style="color:#fc3439;font-size:14px;">矩形</span></i></li>
                        <li><i class="drawingIcon cloudLine" @click="cloudLine()"><span style="color:#fc3439;font-size:14px;">云线</span></i></li>
                        <li><i class="drawingIcon text"><span style="color:#fc3439;font-size:14px;">文本</span></i></li>
                        <li><i class="drawingIcon appended"><span style="color:#fc3439;font-size:14px;">附注</span></i></li>
                    </ul>
            </div>
        </div>
        <div :class="[{'box-right-avtive':!screenLeft.show},'box-right-container']">
            <div id="center-selection">
                    <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                        <i class="icon-right"></i>
                    </div>
                    <div :class="[screenLeft.item == 1?'active':(screenLeft.item == 2?'active-version':'active-version-3')]">
                        <span class="item-property "  @click="screenLeft.item = 1">图<br>纸</span>
                        <span class="item-version " @click="versionClick">版<br>本</span>
                        <span class="item-version-3 " @click="annotationClick">批<br>注</span>
                    </div>
            </div>
            <div v-show="screenLeft.show" v-if="screenLeft.item == 1" class="screenRight_1">
                <div v-if="showAction">
                    <p class="clearfix" v-if="IsFolderAction">
                        <i class="icon-goujian icon-add" title="新建文件夹" @click="addFile"></i>
                        <i class="icon-goujian icon-delete"  title="删除" @click="deleteFile"></i>
                        <i class="icon-goujian icon-edit"  title="重命名" @click="renameFile"></i>
                        <i class="icon-goujian icon-upload"  title="上传图纸" @click="uploadFile"></i>
                    </p>
                    <el-tree
                        :data="FileTree"
                        ref="fileTree_drawingReview"
                        
                        :props="defaultProps"
                        
                        highlight-current
                        @node-click="handleNodeClick"
                        id="cloudDirveFileTree"
                    >
                    <!-- <span :class="['custom-tree-node','el-tree-node__label','hahahhaha',data.isLeaf?'fileIcon':'']" slot-scope="{ node, data }" v-text="node.label"></span> -->
                    </el-tree>
                </div>
            </div>
            <div v-show="screenLeft.show" v-else-if="screenLeft.item == 2" id="box-right">
                <div class="versionBody">
                    <div class="versionHead">图纸名称（版本号）</div>
                        <ul class="versionUl" v-for="(item,index) in drawingVersionList" :key="index" >
                            <li class="detial-item clearfix">
                                <span class="detial-text-name" >图号</span>
                                <span class="detial-text-value" v-text="item.drawingId"></span>
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
// import 'js/'
export default {
     components: {
        pdf
    },
    name:'drwaingReview',
    data(){
        return{
            currentPage: 0,
            pageCount: 0,
            screenLeft:{
                show:true,
                item:1,
            },
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
                // isLeaf:'leaf'
            },
            expandedKeys:[],
            checkFileDir:{},
            directoryId:'',
            drawingsUploadShow:false,
            fileList:[], //即将上传的文件集合
            drawingList:'',
            FileTree_original:[],
            FileTree:[],
            DirectoryList:[],
            drawingVersionList:'',
            pageNo:'',
            versionPath:'',//最新图纸路径
            annotationUserId:-1,//批注用户Id
            stage:'-1',//阶段
            isMark:'-1',//标记
            rotate:0,
            annotationInfo:'',
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
            allUserList:''
        }

    },
    filters: {
      timeChange(val) {
        if (val == null) {
          return;
        } else {
          return moment(val).format("YYYY-MM-DD HH:mm");
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
    },
    watch:{
        annotationUserId:function(val){
            this.queryAnnotation()
        },
        stage:function(val){
            this.queryAnnotation()
        },
        isMark:function(val){
            this.queryAnnotation()
        }

    },
    mounted(){
        
        
    },
    methods:{
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
                    // console.log(this.allUserList);
                }else{
                    this.message({
                        type:'error',
                        message:response.data.msg
                    })
                } 
            })

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
        //图纸工具栏操作
        zuoRotate(){
            this.rotate += 90;
        },
        youRotate(){
            this.rotate -= 90;
        },
        straightLine(){
            this.isDrawing=true;
            this.shapeType="1";
        },
        circular(){
            this.shapeType="2";
        },
        rectangleTool(){
            this.isDrawing=true;
            this.shapeType="3";
        },
        cloudLine(){
            this.isDrawing=true;
            this.shapeType="4";
        },
        drawingClick(){
            this.screenLeft.item = 1;
            // this.FileTree_original=[],
            // this.FileTree=[],
            // this.DirectoryList=[],
            // this.drawingList=[],
            // this.getDirectory()
        },
        versionClick(){
            this.screenLeft.item = 2;
            if(this.drawingId){
                this.getDrawingVersionList();
            }
           
        },
        annotationClick(){
            this.screenLeft.item = 3
        },
        loadeds(){
            //  alert('hdjsf')
            // console.log($event);
            this.$refs.pdfDocument.$refs.canvasParent.children[0].style.position="absolute"
            // this.$refs.pdfDocument.$refs.canvasParent.children[0].onmouseover= ()=>{
            if(document.getElementById("abs")){return;}
            let canvas1 = document.createElement("canvas");
            canvas1.id = "abs";
            canvas1.style.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.width;
            canvas1.style.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].style.height;
            // console.log(this.$refs.pdfDocument.$refs.canvasParent.children[0].style.height)
            // console.log(this.$refs.pdfDocument.$refs.canvasParent.children[0].style.width)
            canvas1.style.position = "absolute";
            canvas1.style.left=0;
            canvas1.style.top=0;
            // canvas.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].width;
            // canvas.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].height;
            canvas1.width = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetWidth;
            canvas1.height = this.$refs.pdfDocument.$refs.canvasParent.children[0].offsetHeight;
            this.$refs.pdfDocument.$refs.canvasParent.appendChild(canvas1);
            let start = {x:0,y:0};
            let end = {x:0,y:0};
            var points = [];
            let beginDraw = false;
            var FinishDraw = false;
            let ctx=canvas1.getContext("2d");
            ctx.strokeStyle='rgb(252, 52, 57)';
            ctx.lineWidth=3;
            canvas1.onmousedown = (e)=>{
                if(e.button == 0){
                    beginDraw = true;
                    start.x = e.layerX;
                    start.y = e.layerY;
                    if(this.shapeType=="4"){
                        if(!FinishDraw){
                            start.x = e.layerX;
                            start.y = e.layerY;
                            if(points.length > 0){
                                if( Math.pow((points[0].x - e.layerX)*(points[0].x - e.layerX) + 
                                            (points[0].y - e.layerY)*(points[0].y - e.layerY),0.5) <= 20){	// 首尾链接算完成
                                    points.push({x:points[0].x,y:points[0].y});
                                    FinishDraw = true;
                                    canvas1.onmousemove(e);
                                    // this.isDrawing = false;
                                    beginDraw=false;
                                    return;
                                }
                            }
                            points.push({x:e.layerX,y:e.layerY});
                            console.log(points);
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
                if(this.shapeType!="4"){
                    this.coordinateInfoList=[];
                    beginDraw = false;
                    canvas1.drawElements.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},t:this.shapeType});
                    this.coordinateInfoList.push({s:{x:start.x,y:start.y},e:{x:end.x,y:end.y},t:this.shapeType});
                    this.addAnnotation();
                }
                // beginDraw = false;
                // console.log(canvas1.drawElements);
                console.log(this.coordinateInfoList);
            }
            canvas1.onmousemove = (e)=>{
                let x =  e.layerX;
                let y =  e.layerY;
                if(beginDraw){
                    ctx.clearRect(0,0,canvas1.offsetWidth,canvas1.offsetHeight);
                    for(let i = 0;i < canvas1.drawElements.length;i++){
                        switch(canvas1.drawElements[i].t){
                            case "1":
                                ctx.beginPath();
                                ctx.moveTo(canvas1.drawElements[i].s.x,canvas1.drawElements[i].s.y)
                                ctx.lineTo(canvas1.drawElements[i].e.x,canvas1.drawElements[i].e.y)
                                ctx.stroke(); 
                                break;
                            case "2":
                                ctx.beginPath();
                                ctx.ellipse(canvas1.drawElements[i].s.x + (canvas1.drawElements[i].e.x - canvas1.drawElements[i].s.x)/2,canvas1.drawElements[i].s.y + (canvas1.drawElements[i].e.y - canvas1.drawElements[i].s.y)/2,Math.abs(canvas1.drawElements[i].e.x - canvas1.drawElements[i].s.x)/2,Math.abs(canvas1.drawElements[i].e.y - canvas1.drawElements[i].s.y)/2,0,0,Math.PI*2,true);
                                ctx.stroke(); 
                                break;
                            case "3":
                                ctx.beginPath();
                                ctx.rect(canvas1.drawElements[i].s.x,canvas1.drawElements[i].s.y,canvas1.drawElements[i].e.x - canvas1.drawElements[i].s.x,canvas1.drawElements[i].e.y - canvas1.drawElements[i].s.y);
                                ctx.stroke(); 
                                break;
                        }
                    }
                    switch(this.shapeType){
                        case "1":
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
                        ctx.beginPath();
                        ctx.ellipse(start.x + (x - start.x)/2,start.y + (y - start.y)/2,Math.abs(x - start.x)/2,Math.abs(y - start.y)/2,0,0,Math.PI*2,true);
                        ctx.stroke(); 
                        end.x = x;
                        end.y = y;
                        break;
                        case "3":
                        ctx.beginPath();
                        ctx.rect(start.x,start.y,x - start.x,y - start.y);
                        ctx.stroke(); 
                        end.x = x;
                        end.y = y;
                        break;
                        case "4":
                        {
                            ctx.clearRect(0,0,canvas1.offsetWidth,canvas1.offsetHeight);
                            ctx.beginPath();
                            if(!FinishDraw){
                                if(points.length > 1){	//	画结束位置
                                    ctx.rect(points[0].x - 10,points[0].y - 10,20,20);
                                }
                            }
                            ctx.stroke()
                            this.drawCloudLine(ctx,points,20,FinishDraw,{x:e.layerX,y:e.layerY});
                        }
                        break;
                    } 
                }
            }
            canvas1.drawElements = [];
        },
        //添加批注
        addAnnotation(){
            var vm=this
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/addAnnotation',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    annotationInfo:this.annotationInfo,
                    drawingVersionId:this.drawingId,
                    reviewStage:this.stage,
                    type:this.coordinateInfoList[0].t,
                    // projectId:vm.projId
                },
                data:{
                     coordinateInfo:JSON.stringify(this.coordinateInfoList)
                }

            }).then((response)=>{
                if(response.data.cd='0'){
                    alert('hfjd')
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
            axios({
                url:vm.BDMSUrl+'dc/drawingReview/queryAnnotation',
                method:'post',
                headers:{
                    'token':vm.token
                },
                params:{
                    drawingVersionId:this.drawingId,
                    annotationUserId:this.annotationUserId,
                    stage:this.stage,
                    isMark:this.isMark
                    // projectId:vm.projId
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    alert("jfkdjk")
                }else{
                    alert(response.data.msg);
                    // this.message({
                    //     type:'error',
                    //     message:response.data.msg
                    // })
                } 
            })
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
            console.log(this.data);
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
                if(response.data.cd='0'){
                    vm.DirectoryList=response.data.rt;
                    vm.DirectoryList.forEach((item)=>{
                        

                    })
                    
                    this.getDrawingList()
                    vm.DirectoryList.forEach((item,index) => {
                            // vm.$set(item,'directory',item.code)
                            // vm.$set(item,'name',item.drawingNumber+'('+item.drawingName+')')
                        });
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
                if(response.data.rt.length!=0){
                     vm.drawingList=response.data.rt;
                    console.log(vm.drawingList)
                    console.log(this.DirectoryList)
                    if(vm.drawingList != null){
                        vm.drawingList.forEach((item,index) => {
                            vm.$set(item,'name',item.drawingNumber+'('+item.drawingName+')')
                        });
                    }
                    
                     this.DirectoryList.forEach((item)=>{
                        this.drawingList.forEach((item1)=>{
                            if(item.code==item1.directory){
                                let a=[];
                                a.push(item1)
                                vm.$set(item,'children',a)
                                // console.log(item);
                            }
                        })
                    })
                    vm.FileTree = data.transformTozTreeFormat(setting, this.DirectoryList)
                    console.log(vm.FileTree);
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
        //获取图纸最新版本路径
        getMaxVersionPath(){
            var vm=this;
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
                    console.log(this.versionPath);
                }
            })
        },
        handleNodeClick(obj){
            var vm=this
            vm.showAction = true
            if(!obj.isLeaf){
                vm.IsFolderAction = true
                if(!obj.children){
                    vm.$message({
                        type:'info',
                        message:'这个文件夹没有子文件或图纸!'
                    })
                }
            }else{
                vm.IsFolderAction = false
            }
            vm.checkFileDir = obj//选中的文件夹
            vm.directoryId=obj.code
            vm.drawingId=obj.id
            console.log(vm.directoryId);
            console.log(vm.drawingId);
            if(vm.drawingId){
                this.getMaxVersionPath();
            }
         
            //  vm.drawingList.forEach((item)=>{
            //      vm.DirectoryList.forEach((item1)=>{
            //          if(item1.code==item.directory){
            //             item1.push({'children':item})
            //         }
            //      })
                
            //  })
            //  console.log(vm.DirectoryList);
            if(vm.expandedKeys.indexOf(vm.checkFileDir.code) == -1){
                vm.expandedKeys.push(vm.checkFileDir.code)
            }
            console.log(vm.expandedKeys);
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
                }
            })
        },
        //新建文件夹
        addFile(){
        },
        //删除文件夹
        deleteFile(){
        
        },
        renameFile(){

        },
        uploadFile(){
            var vm = this
            vm.drawingsUploadShow = true
        },
        drawingsUploadCancel(){
            var vm = this
            vm.drawingsUploadShow = false
            vm.fileList=[]
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
            var vm = this
            const list = vm.$refs.drawingsInfo.files
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
        //删除文件
         deleteFileList(index){
            var vm = this
            vm.fileList.splice(index,1)

        },
        drawingsUploadConfirm(){
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
                var returnUrl = vm.BDMSUrl+'dc/drawingReview/addDrawing?projectId='+vm.projId+'&drawingNumber='+item.drawingNo+'&directory='+vm.directoryId+'&drawingName='+item.fileName+'&ratio='+item.proportion+'&pageNo=4'
                returnUrl = encodeURIComponent(returnUrl);
                var formData = new FormData()
                formData.append('token',vm.token);
                formData.append('projId',vm.projId);
                formData.append('type',1);
                formData.append('file',item.file);
                formData.append('userId',vm.userId);
                formData.append('modelCode','004');
                formData.append('returnUrl',returnUrl);
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
                            vm.getDrawingList()
                        }
                        if(response.data.cd != 0){
                            vm.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }
                    })
            })
        },

        
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
                // margin-left:-640px;
                margin-top:22px;
                width: 642px;
                height: 38px;
            }
            .drawingPic{
                    overflow: auto;
                    position: absolute;
                    top: 130px;
                    left: 0;
                    bottom: 0;
                    right: 25px;
                    width: 100%;
                    height: 800px;
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
                margin-left:-255px;
                    .drawingTools{
                        width: 568px;
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
                                left:120px;
                                top:9px;
                                background: url('./images/zx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/zx1.png')no-repeat 0 0;
                                }
                            }
                            .circular{
                                left:190px;
                                top:9px;
                                background: url('./images/yx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/yx1.png')no-repeat 0 0;
                                }
                            }
                            .rectangle{
                                left:260px;
                                top:9px;
                                background: url('./images/jx.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/jx1.png')no-repeat 0 0;
                                }
                            }
                            .cloudLine{
                                 left:330px;
                                top:9px;
                                background: url('./images/yunxian.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/yunxian1.png')no-repeat 0 0;
                                }
                            }
                            .text{
                                 left:400px;
                                top:9px;
                                background: url('./images/wenb.png')no-repeat 0 0;
                                &:hover{
                                    background: url('./images/wenb1.png')no-repeat 0 0;
                                }
                            }
                            .appended{
                                left:470px;
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
            overflow-y: auto;
            overflow-x: hidden;
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
                    .versionUl{
                        // margin-left：20px
                        // width: 400px;
                        text-align: left;
                        width: 100%;
                        height: 80px;
                        text-align: left;
                        border-bottom: 1px solid #e6e6e6;
                        .detial-item{
                                font-size: 12px;
                                line-height: 12px;
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
        }
    }

</style>