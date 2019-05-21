<template>
    <div  ref="picViewOutSide" style="background-color:rgba(192,192,192,0);position:absolute;width:100%;height:100%" @mousedown="onmousedown" @contextmenu="oncontextmenu" @mousemove="onmousemove" @mouseup="onmouseup" @wheel="onwheel">
        
        <div id="pdfImport" ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute">            
            <pdf id="pdfD" ref="pdfDocument" @loaded="load" @page-size="pageSize" :src="url" :rotate="R"></pdf>
            <canvas ref="picViewImage"  style="position:absolute;top:0px;left:0px"></canvas>
            <canvas ref="drawCanvas" id="drawCanvas" style="position:absolute;top:0px;left:0px" @dblclick="Select_item" @mousedown="oncanvasmousedown" @mousemove="oncanvasmousemove" @mouseup="oncanvasmouseup"></canvas>
            <canvas ref="drawCanvasSelect" id="drawCanvasSelect" style="position:absolute;top:0px;left:0px;display:none"></canvas>
            <div ref="loading" style="position:absolute;top:0px;left:0px;width:100%;height:100%;background:#ffffff"></div>
            <div ref="listItem" style="position:absolute;top:0px;left:0px;border: 1px solid #000000;background:#ffffff">
                <ul>
                    <li v-for="(item,index) in pointGroupDataList" :key="index">
                        <span>{{item.name}} - {{item.data}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div ref="number_input" style="width:200px;height:36px;border:1px solid red;display:none;position:absolute;background-color:rgba(255,255,255,1)">
            <input ref="number_input_input"  type = "text" style="position:absolute;left:2px;height:30px;top:2px;width:120px"/>
            <button @click="create_Multiple_points" style="right:2px;height:30px;top:2px;width:60px;position:absolute" >确定</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import pdf from 'vue-pdf'
var THREE = require('three');

export default {
    components: {
        pdf: pdf
    },
    props:['para'],
    name:'picView',
    data(){
        return{
            url:'',
            R:0,
            baseColor:{r:0,g:170,b:0},
            Max_Select:10000,
            Max_type:1000,
            Selected_typeNum_List:[],
            userData:{},
            old_para:"",
            drawList:[],
            pointScale:1.0,
            Refresh_timer:0,
            pointGroupDataList:[],
            pointContentShow:false,
        }
    },
    destroyed(){
        clearInterval(this.Refresh_timer);
    },
    mounted(){
        
        this.drawStatus = "none";
        this.editStatus = "normal";
        this.editStatus2 = false;
        this.ResolutionScale = 1.0;
        this.drawCount = 0;
        this.drawMaxCount = 0;
        this.startMove = false;
        this.drawtype_move = true;
        this.drawtype_move = true;
        this.drawtype_level = true;
        this.drawtype_force = true;
        this.drawtype_slanting = true;
        this.drawing = false;
        this.lastMovePostion = {x:0,y:0};
        this.PDFsize = {width:0,height:0};
        this.SelectedList_last_length = 0;
        this.needChangeBroken = false;

        this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
        this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
        this.old_para = "";

        this.drawID = 1;

        this.Refresh_timer = setInterval(this.Refresh_timer_fun,500);
    },
    filters:{

    },
    watch:{
        para: (newVal,oldVal)=>{
            // console.log(newVal);
        }
    },
    methods:{
        Refresh_timer_fun(){
            
            // console.log(this.drawList);
            // console.log(this.$refs.picView.parentNode.offsetWidth, this.$refs.picView.parentNode.offsetHeight);
            
            // console.log(this.para,'this.para.type')
                // .toLowerCase()
            if(this.para.type=="pdf"||this.para.type=="PDF"){
                this.para.type="PDF";
                if(this.para.source != this.old_para){

                    // console.log(this.para);

                    this.drawList = [];

                    this.$refs.loading.style.display = "block";

                    this.$refs.pdfDocument.$el.style.display = "block";
                    this.$refs.picViewImage.style.display = "none";
                    this.$refs.pdfDocument.$el.style.position = "relative";
                    this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "0px";


                    if(this.para.angle != undefined){

                        this.angle = parseInt(this.para.angle);
                        this.R = 0;
                    }
                    
                    this.url = this.para.source + "?random=" + Math.random();

                    if(this.sub_div){
                        this.ResolutionScale = this.PDFscale;
                        // this.sub_div.style.height = this.PDFsize.height + "px";
                        // this.sub_div.style.width = this.PDFsize.width + "px";
                    }
                    
                    this.old_para = this.para.source;
                    
                }
            }else if(this.para.type=="png"||this.para.type=="jpg"){
                this.para.type="PNG";
                if(this.para.source != this.old_para){
                    this.drawList = [];
                    this.$refs.pdfDocument.$el.style.display = "none";
                    this.$refs.picViewImage.style.display = "block";
                    this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "0px";
                    if(this.para.angle != undefined){
                        this.angle = parseInt(this.para.angle);
                    }

                    this.init(this.$refs.picView,this.para.source,this.para.type,1,0);
                    this.old_para = this.para.source;
                    
                }
            }
            if(this.para.type=="")return;
            
           
            this.Refresh();

            
        
        },
        Select_item(){
            if(this.SelectedList.length > 0){
                if(this.SelectedList[0].type == "Select_img_Mark"){
                    this.$emit('Image_Mark',this.SelectedList[0]);
                }
            }
        },
        init(div,source,type,page_No,angle){
            this.Koeffzient = 0.1;
            this.scale_list = [0.3,0.5,0.75,0.8,1.0,1.5,2.0,3.0];
            this.scale_list_index = 4;
            this.scale = this.scale_list[this.scale_list_index];
            this.Original_width;
            this.Original_height;
            this.isRender = false;
            this.status = "none";
            this.start = {x:0,y:0};
            this.start_canvas = {x:0,y:0};
            this.image = new Image();
            this.canvas;
            this.drawCanvas = this.$refs.drawCanvas;
            this.drawCanvasSelect = this.$refs.drawCanvasSelect;
            this.drawcontext = this.drawCanvas.getContext('2d');
            this.drawcontextSelect = this.drawCanvasSelect.getContext('2d');
            this.SelectedList = [];
            this.displayLabel = false;

            if(page_No == undefined){
                page_No = 1;
            }

            if(page_No < 0){
                page_No = 1;
            }

            this.page_No = page_No;

            switch(type){
                case "PDF":

                    //////////////////////////////////////// 获取 PDF /////////////////////////////////////////////
                    {

                        // this.$refs.pdfDocument.src = source;
                        // this.$refs.pdfDocument.page = 1;
                        this.ResolutionScale = this.sub_div.offsetWidth / 1024.0;
                        this.PDFscale = this.ResolutionScale;
                        this.type = type;
                        // this.$emit('load_points',null);
                        this.Refresh();
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////////

                    break;
                case "PNG":

                    ////////////////////////////////////////// 图片 ///////////////////////////////////////////////

                    {
                        
                        this.$refs.loading.style.display = "none";
                        this.sub_div = this.$refs.picView;
                        this.sub_div.style.position = "absolute";
                        this.canvas = this.$refs.picViewImage;
                        this.type = type;

                        this.Main_div = this.$refs.picViewOutSide;
                        // this.Main_div.style.position = "absolute";
                        // this.Main_div.style.width = (div.offsetWidth - 4) + "px";
                        // this.Main_div.style.height = (div.offsetHeight - 4) + "px";
                        
                        // this.Main_div.style.border="3px solid rgba(255,255,255,0.5)";
                        this.Main_div.style.overflow = "hidden";


                        this.isRender = true;
                        this.image.src = source;
                        this.image.onload = (e)=>{

                            this.ResolutionScale = 1.0 * this.sub_div.offsetWidth / this.image.width;

                            this.oldImageSize = {width:this.sub_div.offsetWidth,height:this.sub_div.offsetWidth * (this.image.height / this.image.width)};
                            this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                            if(this.angle == 0 || this.angle == 180){
                                this.sub_div.style.height = this.imageSize.height + "px";
                                this.sub_div.style.width = this.imageSize.width + "px";
                                this.canvas.height = this.imageSize.height;
                                this.canvas.width = this.imageSize.width;
                                this.drawCanvas.height = this.imageSize.height;
                                this.drawCanvas.width = this.imageSize.width;
                                this.drawCanvasSelect.height = this.imageSize.height;
                                this.drawCanvasSelect.width = this.imageSize.width;
                                
                            }else{
                                this.sub_div.style.height = this.imageSize.width + "px";
                                this.sub_div.style.width  = this.imageSize.height + "px";
                                this.canvas.height = this.imageSize.width;
                                this.canvas.width = this.imageSize.height;
                                this.drawCanvas.height = this.imageSize.width;
                                this.drawCanvas.width = this.imageSize.height;
                                this.drawCanvasSelect.height = this.imageSize.width;
                                this.drawCanvasSelect.width = this.imageSize.height;
                            }

                            this.context = this.canvas.getContext('2d');
                            this.context.rotate(this.angle*Math.PI/180);

                            switch(this.angle){
                                case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                                case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                                case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                                case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                            }

                            // div.appendChild(this.Main_div);
                            this.isRender = false;
                            this.Refresh();
                        }
                    }

                    ///////////////////////////////////////////////////////////////////////////////////////////////

				break;
            }
            
            this.$emit('load_points',null);

            this.Refresh();
        },
        load(){
            
            this.Main_div = this.$refs.picViewOutSide;
            this.sub_div = this.$refs.picView;

            var timer = setInterval(()=>{
                
                this.sub_div.style.height = this.$refs.pdfDocument.$refs.canvasParent.offsetHeight + "px";
                this.oldImageSize = {
                                        width:this.$refs.pdfDocument.$refs.canvasParent.offsetWidth,
                                        height:this.$refs.pdfDocument.$refs.canvasParent.offsetHeight
                                    };
                this.drawCanvas.height = this.$refs.picView.offsetHeight;
                this.drawCanvas.width = this.$refs.picView.offsetWidth;
                this.drawCanvasSelect.height = this.$refs.picView.offsetHeight;
                this.drawCanvasSelect.width = this.$refs.picView.offsetWidth;
                this.PDFsize = {width:this.oldImageSize.width,height:this.oldImageSize.height};

                this.R = this.angle;
                this.size_R();  // 初始时修改尺寸

                this.$refs.loading.style.display = "none";
                
                clearInterval(timer);
            },1000);

            this.$refs.pdfDocument.$el.style.position = ""; //  防抖

            this.init(this.$refs.picView,this.para.source,this.para.type,1,0);
            
        },
        setNumber_inputPostion(position_){

            var position = this.rotate_XY_display(position_);

            this.$refs.number_input.style.left = (this.sub_div.offsetLeft   + position.x * this.ResolutionScale * this.scale - 50) + "px";
            this.$refs.number_input.style.top  = (this.sub_div.offsetTop    + position.y * this.ResolutionScale * this.scale - 16) + "px";
        },
        oncanvasmousedown(e){
            // console.log(e.layerX / this.ResolutionScale / this.scale,e.layerY / this.ResolutionScale / this.scale);
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            this.$refs.listItem.style.display = "none";

            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;

            if(e.button == 0 || e.button == 2){
                this.lastPostion = {x:X,y:Y};
                
                    if(this.drawCount > 0 && this.drawing){ //  绘制标记
                        this.drawCount--;
                        
                        let find = false;

                        for(let i = 0;i < this.drawList.length;i++){
                            if(this.drawList[i].SID == this.drawID ){
                                find = true;
                                switch(this.drawList[i].type){
                                    case "text":
                                        this.drawList[i].position.push({x:X,y:Y});
                                        break;
                                    case "line":
                                        this.drawList[i].position.push({x:X,y:Y});
                                        break;
                                    case "circular":
                                        this.drawList[i].position.push({x:X,y:Y});
                                        break;
                                    case "rectangle":
                                        this.drawList[i].position.push({x:X,y:Y});
                                        break;
                                    case "cloud":

                                        if(this.drawList[i].position.length > 2){
                                            let dist = new THREE.Vector2(X - this.drawList[i].position[0].x,Y - this.drawList[i].position[0].y).length();
                                            if(dist < 10){
                                                this.drawList[i].position.push({x:this.drawList[i].position[0].x,y:this.drawList[i].position[0].y});
                                                this.drawCount = 0;
                                                this.drawFinish();
                                            }else{
                                                this.drawList[i].position.push({x:X,y:Y});
                                            }
                                        }else{
                                            this.drawList[i].position.push({x:X,y:Y});
                                        }
                                        break;
                                }
                            }
                        }

                        if(find == false){
                            // this.drawList.push({status:"normal",Selected:false,SID:this.drawID,type:this.drawtype,position:[{x:X,y:Y}],count:1,ID_out:-1,edited:true,TempPostion:{x:0,y:0},text:"文本"});
                            this.drawList.push(this.create(this.drawtype,this.drawItemId,{x:X,y:Y}));
                            
                            if(this.drawMaxCount == 1){
                                this.drawFinish();
                            }
                        }else{
                            
                            // if(this.drawtype == "move" || this.drawtype == "move" || this.drawtype == "move" || this.drawtype == "move")
                            // {
                            //     this.$refs.number_input_input.value = "6";
                            //     this.$refs.number_input.style.display = "block";
                            // }
                        }

                        if(this.drawCount == 0){
                            
                            this.userData = {};

                            if(this.drawMaxCount == 2){   // 两个点完成绘制的
                                switch(this.drawList[this.drawList.length - 1].type){

                                    case "text":
                                        this.$refs.number_input_input.value = "";
                                        this.$refs.number_input.style.display = "block";
                                        break;
                                    case "move":
                                        this.$refs.number_input_input.value = "6";
                                        this.$refs.number_input.style.display = "block";
                                        break;
                                    case "level":
                                        this.$refs.number_input_input.value = "6";
                                        this.$refs.number_input.style.display = "block";
                                        break;
                                    case "force":
                                        this.$refs.number_input_input.value = "6";
                                        this.$refs.number_input.style.display = "block";
                                        break;
                                    case "slanting":
                                        this.$refs.number_input_input.value = "6";
                                        this.$refs.number_input.style.display = "block";
                                        break;
                                    default:
                                        this.drawFinish();
                                        break;
                                }
                                 
                                
                            }

                            if(this.drawMaxCount == 1){

                            }

                            if(this.drawList[this.drawList.length - 1].type == "Select_img_Mark"){
                                this.setDrawCancel();
                            }else{
                                this.drawCount = this.drawMaxCount;
                            }


                            // this.drawing = false;
                            // this.drawCount = this.drawMaxCount;
                            this.drawID++;
                        }

                        this.Refresh();
                    }
                    else
                    { 
                       if(this.needChangeBroken){

                            var selectColorID = this.drawcontextSelect.getImageData(e.layerX ,  e.layerY, 1, 1).data;
                            var red = selectColorID[0];
                            var green = selectColorID[1];
                            var blue = selectColorID[2];

                            var SID = red + green * 256 + blue * 256 *256;

                            // console.log(SID);

                            if(selectColorID[3] != 255){
                                SID = 0;
                            }

                            if(SID > 0){
                                for(let i = 0; i < this.drawList.length;i++){
                                    if(this.drawList[i].SID == SID){
                                        this.drawList[i].isBroken = !this.drawList[i].isBroken;
                                        this.Refresh();
                                        this.$emit('Broken_changed',this.drawList[i]);
                                        break;
                                    }
                                }
                            }
                            
                        }else{
                            // 选取元素
                            
                            if(this.editStatus2 == false){
                                return;
                            } 

                            var selectColorID = this.drawcontextSelect.getImageData(e.layerX ,  e.layerY, 1, 1).data;
                            var red = selectColorID[0];
                            var green = selectColorID[1];
                            var blue = selectColorID[2];

                            var SID = red + green * 256 + blue * 256 *256;

                            // console.log(SID);

                            if(selectColorID[3] != 255){
                                SID = 0;
                            }

                            if(SID < 1){
                                this.SelectedList = [];
                                this.Selected_typeNum_List = [];
                            }

                            /////////////////  Max_Select 为1特例 ////////////////

                            if(this.Max_Select == 1){ 

                                this.SelectedList = [];
                                this.Selected_typeNum_List = [];

                                for(let i = 0; i < this.drawList.length;i++){
                                    this.drawList[i].Selected = false;
                                    if(this.drawList[i].SID == SID){
                                        this.SelectedList.push(this.drawList[i]);
                                        this.SelectedList[0].Selected = true;
                                        
                                    }
                                }
                            
                                if(SID > 0){
                                    if(e.button == 2){
                                        this.pointGroupDataList =this.SelectedList[this.SelectedList.length - 1].pointGroupData;
                                        this.$refs.listItem.style.display = "block";
                                        this.$refs.listItem.style.top = e.layerY + "px";
                                        this.$refs.listItem.style.left = e.layerX  + "px";
                                    }
                                    this.$emit('status_changed',true,this.SelectedList);
                                }else{
                                    this.$emit('status_changed',false,this.SelectedList);
                                }

                                this.Refresh();
                                return;
                            
                            }

                            //////////////// Select_img_Mark 特例 /////////////////

                            {
                                var find_Select_img_Mark = false;
                                for(let i = 0; i < this.drawList.length;i++){
                                    if(this.drawList[i].SID == SID){
                                        if(this.drawList[i].type == "Select_img_Mark"){
                                            find_Select_img_Mark = true;
                                        }
                                    }
                                }

                                if(find_Select_img_Mark){

                                    for(let i = 0; i < this.drawList.length;i++){
                                        this.drawList[i].Selected = false;
                                    }
                                    
                                    this.SelectedList = [];
                                    this.Selected_typeNum_List = [];
                                    // this.SelectedList.push(this.drawList[this.drawList.length - 1]);

                                    for(let i = 0; i < this.drawList.length;i++){
                                        if(this.drawList[i].SID == SID){
                                            this.SelectedList.push(this.drawList[i]);
                                        }
                                    }
                        

                                    this.SelectedList[0].Selected = true;

                                    if(SID > 0){
                                        if(e.button == 2){
                                            this.pointGroupDataList =this.SelectedList[this.SelectedList.length - 1].pointGroupData;
                                            this.$refs.listItem.style.display = "block";
                                            this.$refs.listItem.style.top = e.layerY + "px";
                                            this.$refs.listItem.style.left = e.layerX  + "px";
                                        }
                                        this.$emit('status_changed',true,this.SelectedList);
                                    }else{
                                        this.$emit('status_changed',false,this.SelectedList);
                                    }

                                    this.Refresh();
                                    return;
                                }else{
                                    let temp_SelectedList = this.SelectedList;
                                    this.SelectedList = [];

                                    for(let i = 0; i < this.drawList.length;i++){
                                        this.drawList[i].Selected = false;
                                    }

                                    for(let i = 0; i < temp_SelectedList.length;i++){
                                        if(temp_SelectedList[i].type != "Select_img_Mark"){
                                            temp_SelectedList[i].Selected = true;
                                            this.SelectedList.push(temp_SelectedList[i]);
                                        }
                                    }

                                }

                                
                            }

                            ///////////////////////////////////////////////////////

                            if(this.SelectedList.length < this.Max_Select){

                                for(let i = 0; i < this.drawList.length;i++){
                                    this.drawList[i].Selected = false;
                                    if(this.drawList[i].SID == SID){
                                        // this.SelectedList.push(this.drawList[i]);
                                        var find = false;
                                        for(let j = 0;j < this.SelectedList.length;j++){
                                            if(this.SelectedList[j].SID == SID){
                                                find = true;
                                            }
                                        }

                                        var typeNum_enable = true;

                                        if(this.Selected_typeNum_List.length >= this.Max_type){
                                            
                                            typeNum_enable = false;

                                            for(let j = 0; j < this.Selected_typeNum_List.length;j++){
                                                if(this.Selected_typeNum_List[j] == this.drawList[i].typeNum){
                                                    typeNum_enable = true;
                                                }
                                            }

                                            
                                        }else{
                                            let find_type = false;

                                            for(let j = 0; j < this.Selected_typeNum_List.length;j++){
                                                if(this.Selected_typeNum_List[j] == this.drawList[i].typeNum){
                                                    find_type = true;
                                                }
                                            }
                                            if(!find_type){this.Selected_typeNum_List.push(this.drawList[i].typeNum);}
                                        }

                                        if(!find && typeNum_enable){
                                            this.SelectedList.push(this.drawList[i]);
                                        }
                                    }
                                }

                                for(let i = 0; i < this.SelectedList.length;i++){
                                    this.SelectedList[i].Selected = true;
                                }

                                if(SID > 0){
                                    if(e.button == 2){
                                        this.pointGroupDataList =this.SelectedList[this.SelectedList.length - 1].pointGroupData;
                                        this.$refs.listItem.style.display = "block";
                                        this.$refs.listItem.style.top = e.layerY + "px";
                                        this.$refs.listItem.style.left = e.layerX  + "px";

                                    }
                                    this.$emit('status_changed',true,this.SelectedList);
                                }else{
                                    this.$emit('status_changed',false,this.SelectedList);
                                }

                                this.Refresh();
                            }

                            

                            if(this.editStatus == "move" && SID != 0){   //  移动标记
                                
                                // if(this.SelectedList_last_length > 0 && this.SelectedList_last_length == this.SelectedList.length){
                                    
                                    var center={x:X,y:Y};

                                    for(let i = 0; i < this.SelectedList.length;i++){
                                        this.SelectedList[i].TempPostion.x = this.SelectedList[i].position[0].x - center.x;
                                        this.SelectedList[i].TempPostion.y = this.SelectedList[i].position[0].y - center.y;
                                    }

                                    this.startMove = true;
                                    
                                    
                                // }
                            }

                            this.SelectedList_last_length = this.SelectedList.length;
                        }

                    }
                
            }

            
        },
        Selected2(id){

            this.SelectedList = [];
            
            for(let i = 0; i < this.drawList.length;i++){
                this.drawList[i].Selected = false;
                if(this.drawList[i].ID_out == id){
                    this.SelectedList.push(this.drawList[i]);
                }
            }

            for(let i = 0; i < this.SelectedList.length;i++){
                this.SelectedList[i].Selected = true;
            }

        },
        oncanvasmousemove(e){
            
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;

            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;

            if(this.drawList.length > 0){
                if(this.drawList[this.drawList.length-1].type == "text" && this.drawList[this.drawList.length-1].position.length != 2){
                    this.drawList[this.drawList.length-1].TempPostion = {x:X,y:Y};
                }
            }

            if(this.startMove){
                for(let i = 0;i < this.SelectedList.length;i++){
                    // if(this.SelectedList[i].type == "text"){
                    //     let dist = {x:this.SelectedList[i].position[1].x - this.SelectedList[i].position[0].x,y:this.SelectedList[i].position[1].y - this.SelectedList[i].position[0].y};

                    //     this.SelectedList[i].position[0].x = X;
                    //     this.SelectedList[i].position[0].y = Y;

                    //     this.SelectedList[i].position[1].x = X + dist.x;
                    //     this.SelectedList[i].position[1].y = Y + dist.y;

                    // }else{
                    //     this.SelectedList[i].position[0].x = X;
                    //     this.SelectedList[i].position[0].y = Y;
                    // }

                    var relative_position = [];

                    for(let j = 0;j < this.SelectedList[i].position.length;j++){
                        var position = {};
                        position.x = this.SelectedList[i].position[j].x -  this.SelectedList[i].position[0].x;
                        position.y = this.SelectedList[i].position[j].y -  this.SelectedList[i].position[0].y;
                        relative_position.push(position);
                    }

                    for(let j = 0;j < this.SelectedList[i].position.length;j++){
                        this.SelectedList[i].position[j].x = X + this.SelectedList[i].TempPostion.x + relative_position[j].x;
                        this.SelectedList[i].position[j].y = Y + this.SelectedList[i].TempPostion.y + relative_position[j].y;
                    }
                }
            }

            this.lastMovePostion = {x:X,y:Y};

            this.Refresh();
        },
        oncanvasmouseup(e){
            this.startMove = false;

            if(this.editStatus2 == true){
                this.drawing = false;
                this.editStatus = "move"
            }
            // this.editStatus = "normal";
        },
        onmousemove(e){
            if(this.status == "start_move"){
                let dx = e.screenX - this.start.x;
                let dy = e.screenY - this.start.y;

                this.sub_div.style.left = (dx + this.start_canvas.x) + "px";
                this.sub_div.style.top = (dy + this.start_canvas.y) + "px";
            }
        },
        oncontextmenu(e){
            e.preventDefault();
        },
        onmousedown(e){

            if(e.button == 1){
                e.preventDefault();
                this.start_canvas.x = this.sub_div.offsetLeft;
                this.start_canvas.y = this.sub_div.offsetTop;
                this.start.x = e.screenX;
                this.start.y = e.screenY;
                this.status = "start_move";
            }
            
        },
        onmouseup(e){
            // console.log(e);
            this.status = "none";
        },
        onwheel(e){

            if(e.shiftKey){
                e.preventDefault();
                
                if(e.deltaY < 0){
                    this.size_big();
                }else if(e.deltaY > 0){
                    this.size_small();

                }
                this.Refresh();
            }
            
        },
        size_R(){
            switch(this.type){

                case "PDF":
                    this.scale_before = this.scale;

                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;

                   {
                        this.scale = this.scale_list[this.scale_list_index];

                        this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                        if(this.angle == 0 || this.angle == 180){
                            this.sub_div.style.height = this.imageSize.height + "px";
                            this.sub_div.style.width = this.imageSize.width + "px";
                            this.drawCanvas.height = this.imageSize.height;
                            this.drawCanvas.width = this.imageSize.width;
                            this.drawCanvasSelect.height = this.imageSize.height;
                            this.drawCanvasSelect.width = this.imageSize.width;
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width = this.imageSize.height + "px";
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                            this.drawCanvasSelect.height = this.imageSize.width;
                            this.drawCanvasSelect.width = this.imageSize.height;
                        }

                        
                    }
                    break;
                case "PNG":

                    this.scale_before = this.scale;

                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;


                    this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                    if(this.angle == 0 || this.angle == 180){
                        this.sub_div.style.height = this.imageSize.height + "px";
                        this.sub_div.style.width  = this.imageSize.width + "px";
                        this.canvas.height = this.imageSize.height;
                        this.canvas.width = this.imageSize.width;
                        this.drawCanvas.height = this.imageSize.height;
                        this.drawCanvas.width = this.imageSize.width;
                        this.drawCanvasSelect.height = this.imageSize.height;
                        this.drawCanvasSelect.width = this.imageSize.width;
                    }else{
                        this.sub_div.style.height = this.imageSize.width + "px";
                        this.sub_div.style.width  = this.imageSize.height + "px";
                        this.canvas.height = this.imageSize.width;
                        this.canvas.width = this.imageSize.height;
                        this.drawCanvas.height = this.imageSize.width;
                        this.drawCanvas.width = this.imageSize.height;
                        this.drawCanvasSelect.height = this.imageSize.width;
                        this.drawCanvasSelect.width = this.imageSize.height;
                    }

                    this.position_calculate();
                    this.context = this.canvas.getContext('2d');
                    this.context.rotate(this.angle*Math.PI/180);

                    switch(this.angle){
                        case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                        case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                        case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                        case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                    }
                    


                    break;

            }
        },
        size_big(){

            switch(this.type){

                case "PDF":
                    this.scale_before = this.scale;

                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;

                    if(this.scale_list_index + 1 < this.scale_list.length){
                        this.scale_list_index ++;
                        this.scale = this.scale_list[this.scale_list_index];

                        this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                        if(this.angle == 0 || this.angle == 180){
                            this.sub_div.style.height = this.imageSize.height + "px";
                            this.sub_div.style.width = this.imageSize.width + "px";
                            this.drawCanvas.height = this.imageSize.height;
                            this.drawCanvas.width = this.imageSize.width;
                            this.drawCanvasSelect.height = this.imageSize.height;
                            this.drawCanvasSelect.width = this.imageSize.width;
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width = this.imageSize.height + "px";
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                            this.drawCanvasSelect.height = this.imageSize.width;
                            this.drawCanvasSelect.width = this.imageSize.height;
                        }

                        this.position_calculate();

                        
                    }
                    break;
                case "PNG":
                    this.scale_before = this.scale;

                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;

                    if(this.scale_list_index + 1 < this.scale_list.length){
                        this.scale_list_index ++;
                        this.scale = this.scale_list[this.scale_list_index];

                        this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                        if(this.angle == 0 || this.angle == 180){
                            this.sub_div.style.height = this.imageSize.height + "px";
                            this.sub_div.style.width  = this.imageSize.width + "px";
                            this.canvas.height = this.imageSize.height;
                            this.canvas.width = this.imageSize.width;
                            this.drawCanvas.height = this.imageSize.height;
                            this.drawCanvas.width = this.imageSize.width;
                            this.drawCanvasSelect.height = this.imageSize.height;
                            this.drawCanvasSelect.width = this.imageSize.width;
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width  = this.imageSize.height + "px";
                            this.canvas.height = this.imageSize.width;
                            this.canvas.width = this.imageSize.height;
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                            this.drawCanvasSelect.height = this.imageSize.width;
                            this.drawCanvasSelect.width = this.imageSize.height;
                        }

                        this.position_calculate();
                        this.context = this.canvas.getContext('2d');
                        this.context.rotate(this.angle*Math.PI/180);

                        switch(this.angle){
                            case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                            case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                            case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                            case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                        }
                    }

                    break;

            }
            
        },
        size_small(){

            switch(this.type){

                case "PDF":
                this.scale_before = this.scale;

                this.start_canvas.x = this.sub_div.offsetLeft;
                this.start_canvas.y = this.sub_div.offsetTop;
                this.start_canvas.w = this.sub_div.offsetWidth;
                this.start_canvas.h = this.sub_div.offsetHeight;

                if(this.scale_list_index - 1 >= 0){
                    this.scale_list_index --;
                    this.scale = this.scale_list[this.scale_list_index];

                    this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                    if(this.angle == 0 || this.angle == 180){
                        this.sub_div.style.height = this.imageSize.height + "px";
                        this.sub_div.style.width = this.imageSize.width + "px";
                        this.drawCanvas.height = this.imageSize.height;
                        this.drawCanvas.width = this.imageSize.width;
                        this.drawCanvasSelect.height = this.imageSize.height;
                        this.drawCanvasSelect.width = this.imageSize.width;
                    }else{
                        this.sub_div.style.height = this.imageSize.width + "px";
                        this.sub_div.style.width = this.imageSize.height + "px";
                        this.drawCanvas.height = this.imageSize.width;
                        this.drawCanvas.width = this.imageSize.height;
                        this.drawCanvasSelect.height = this.imageSize.width;
                        this.drawCanvasSelect.width = this.imageSize.height;
                    }

                    this.position_calculate();

                    
                }break;

                case "PNG":
                    this.scale_before = this.scale;

                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;

                    if(this.scale_list_index - 1 >= 0){
                        this.scale_list_index --;
                        this.scale = this.scale_list[this.scale_list_index];

                        this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                        if(this.angle == 0 || this.angle == 180){
                            this.sub_div.style.height = this.imageSize.height + "px";
                            this.sub_div.style.width  = this.imageSize.width + "px";
                            this.canvas.height = this.imageSize.height;
                            this.canvas.width = this.imageSize.width;
                            this.drawCanvas.height = this.imageSize.height;
                            this.drawCanvas.width = this.imageSize.width;
                            this.drawCanvasSelect.height = this.imageSize.height;
                            this.drawCanvasSelect.width = this.imageSize.width;
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width  = this.imageSize.height + "px";
                            this.canvas.height = this.imageSize.width;
                            this.canvas.width = this.imageSize.height;
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                            this.drawCanvasSelect.height = this.imageSize.width;
                            this.drawCanvasSelect.width = this.imageSize.height;
                        }

                        this.position_calculate();
                        this.context = this.canvas.getContext('2d');
                        this.context.rotate(this.angle*Math.PI/180);

                        switch(this.angle){
                            case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                            case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                            case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                            case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                        }
                    }

                    break;
            }
        },
        position_calculate(){
            var Center_div = {x:this.Main_div.offsetWidth/2,y:this.Main_div.offsetHeight/2};

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            var Center_before = {x:this.start_canvas.x + this.start_canvas.w / 2,y:this.start_canvas.y + this.start_canvas.h / 2};
            var Center_now = {x:this.sub_div.offsetLeft + this.sub_div.offsetWidth / 2,y:this.sub_div.offsetTop + this.sub_div.offsetHeight / 2};
            

            var Vector_before 	= new THREE.Vector2(Center_before.x - Center_div.x,Center_before.y 	- Center_div.y);
            var Vector_now 		= new THREE.Vector2(Center_now.x 	- Center_div.x,Center_now.y 	- Center_div.y);

            var Vector_before_dir=new THREE.Vector2(Center_before.x - Center_div.x,Center_before.y 	- Center_div.y);
            Vector_before_dir.normalize();
            var Vector_before_length = Vector_before.length();

            var Vector = new THREE.Vector2(
                            Vector_before_dir.x * (Vector_before_length * this.scale / this.scale_before),
                            Vector_before_dir.y * (Vector_before_length * this.scale / this.scale_before)
                            );
            var Vector_D = new THREE.Vector2(Vector_now.x - Vector.x,Vector_now.y - Vector.y);

            
            this.sub_div.style.left = (this.sub_div.offsetLeft - Vector_D.x) + "px";
            this.sub_div.style.top = (this.sub_div.offsetTop - Vector_D.y) + "px";

        },
        Refresh(){

            if(!this.drawcontext){
                return;
            }
            
            this.drawcontext.clearRect(0,0,this.sub_div.offsetWidth,this.sub_div.offsetHeight);
            this.drawcontextSelect.clearRect(0,0,this.sub_div.offsetWidth,this.sub_div.offsetHeight);

            if(this.drawing){   //  单点
                let color = this.baseColor;
                switch(this.drawtype){
                    case "move":
                        this.drawMove(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                        break;
                    case "level":
                        this.drawLevel(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                        break;
                    case "force":
                        this.drawForce(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                        break;
                    case "slanting":
                        this.drawSlanting(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                        break;
                    case "Mark":
                        this.drawMark(this.drawcontext,this.lastMovePostion,false,1,this.baseColor);
                        break;
                    case "Select_img_Mark":
                        this.drawSelectImgMark(this.drawcontext,this.lastMovePostion,false,1,this.baseColor,false,this.userData);
                        break;
                }
            }

            for(let i = 0;i < this.drawList.length;i++){

                // if(this.drawList[i].display==false){
                //     continue;
                // }

                var needContinue = false;

                let color = this.baseColor;
               
                if(this.drawList[i].isAlert){
                    color = {r:170,g:0,b:0};    //  报警颜色
                }
                 if(this.drawList[i].isBroken){
                    color = {r:250,g:250,b:0}   //  故障颜色 
                }

                let colorId = {r:this.drawList[i].SID % 256,g:parseInt(this.drawList[i].SID / 256) % 256,b:parseInt(this.drawList[i].SID / 256 / 256) % 25};
                
                var data = "";
                var name = "";

                var drawItemTagType_ = null;

                if(this.drawList[i].pointGroupData){
                    needContinue = true;
                    for(let k = 0; k < this.drawList[i].pointGroupData.length;k++){
                        if(this.drawList[i].pointGroupData[k].display == true){
                            this.drawList[i].type = this.drawList[i].pointGroupData[k].itemTypeToDisplay;
                            drawItemTagType_ = this.drawList[i].pointGroupData[k].sign;
                            data = this.drawList[i].pointGroupData[k].data;
                            name = this.drawList[i].pointGroupData[k].name;
                            needContinue = false;
                            break;
                        }
                    }
                }

                if(needContinue){
                    continue;
                }

                switch(this.drawList[i].type){
                    case "move":
                            if(this.drawing){
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[this.drawList.length - 1].position.length - 1],this.lastMovePostion);
                                    this.drawMove(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                                }
                            }

                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                var drawItemTagType = this.drawItemTagType;

                                if(drawItemTagType_){
                                    drawItemTagType = drawItemTagType_;
                                }

                                // var data = "";
                                // var name = "";
                                // if(this.drawList[i].pointGroupData){
                                //     drawItemTagType = this.drawList[i].pointGroupData[0].sign;
                                //     data = this.drawList[i].pointGroupData[0].data;
                                //     name = this.drawList[i].pointGroupData[0].name;
                                // }

                                var need_Alert = false;

                                if(this.drawList[i].pointGroupData){
                                    for(var i_ = 0; i_ < this.drawList[i].pointGroupData.length;i_++){
                                        if(this.drawList[i].pointGroupData[i_].isAlert){
                                            need_Alert = true;
                                        }
                                    }
                                }

                                if(need_Alert){
                                    this.drawAlert(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);
                                }

                                if(this.drawList[i].isBroken){this.drawBroken(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                if(this.drawList[i].Selected){this.drawSelected(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}

                                this.drawMove(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5,color,this.drawList[i].Selected,data,name,drawItemTagType);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],this.pointScale,7.5,colorId);
                                
                            }
                        
                        break;
                    case "level":
                            if(this.drawing){
                                
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                    this.drawLevel(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                var drawItemTagType = this.drawItemTagType;
                                if(drawItemTagType_){
                                    drawItemTagType = drawItemTagType_;
                                }
                                // var data = "";
                                // var name = "";
                                // if(this.drawList[i].pointGroupData){
                                //     drawItemTagType = this.drawList[i].pointGroupData[0].sign;
                                //     data = this.drawList[i].pointGroupData[0].data;
                                //     name = this.drawList[i].pointGroupData[0].name;
                                // }

                                var need_Alert = false;

                                if(this.drawList[i].pointGroupData){
                                    for(var i_ = 0; i_ < this.drawList[i].pointGroupData.length;i_++){
                                        if(this.drawList[i].pointGroupData[i_].isAlert){
                                            need_Alert = true;
                                        }
                                    }
                                }

                                if(need_Alert){
                                    this.drawAlert(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);
                                }

                                if(this.drawList[i].isBroken){this.drawBroken(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                if(this.drawList[i].Selected){this.drawSelected(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                this.drawLevel(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5,color,this.drawList[i].Selected,data,name,drawItemTagType);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],this.pointScale,7.5,colorId);
                            }
                        
                        break;
                    case "force":
                            if(this.drawing){
                                
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                    this.drawForce(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                var drawItemTagType = this.drawItemTagType;
                                if(drawItemTagType_){
                                    drawItemTagType = drawItemTagType_;
                                }
                                // var data = "";
                                // var name = "";
                                // if(this.drawList[i].pointGroupData){
                                //     drawItemTagType = this.drawList[i].pointGroupData[0].sign;
                                //     data = this.drawList[i].pointGroupData[0].data;
                                //     name = this.drawList[i].pointGroupData[0].name;
                                // }

                                var need_Alert = false;

                                if(this.drawList[i].pointGroupData){
                                    for(var i_ = 0; i_ < this.drawList[i].pointGroupData.length;i_++){
                                        if(this.drawList[i].pointGroupData[i_].isAlert){
                                            need_Alert = true;
                                        }
                                    }
                                }

                                if(need_Alert){
                                    this.drawAlert(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);
                                }
                                if(this.drawList[i].isBroken){this.drawBroken(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                if(this.drawList[i].Selected){this.drawSelected(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                this.drawForce(this.drawcontext,this.drawList[i].position[j],this.pointScale,10,color,this.drawList[i].Selected,data,name,drawItemTagType);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],this.pointScale,10,colorId);
                            }
                        
                        break;
                    case "slanting":
                            if(this.drawing){
                                
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                    this.drawSlanting(this.drawcontext,this.lastMovePostion,this.pointScale,7.5,color,false,"","",this.drawItemTagType);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                var drawItemTagType = this.drawItemTagType;
                                if(drawItemTagType_){
                                    drawItemTagType = drawItemTagType_;
                                }
                                // var data = "";
                                // var name = "";
                                // if(this.drawList[i].pointGroupData){
                                //     drawItemTagType = this.drawList[i].pointGroupData[0].sign;
                                //     data = this.drawList[i].pointGroupData[0].data;
                                //     name = this.drawList[i].pointGroupData[0].name;
                                // }
                                 var need_Alert = false;

                                if(this.drawList[i].pointGroupData){
                                    for(var i_ = 0; i_ < this.drawList[i].pointGroupData.length;i_++){
                                        if(this.drawList[i].pointGroupData[i_].isAlert){
                                            need_Alert = true;
                                        }
                                    }
                                }

                                if(need_Alert){
                                    this.drawAlert(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);
                                }
                                if(this.drawList[i].isBroken){this.drawBroken(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                if(this.drawList[i].Selected){this.drawSelected(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5);}
                                this.drawSlanting(this.drawcontext,this.drawList[i].position[j],this.pointScale,7.5,color,this.drawList[i].Selected,data,name,drawItemTagType);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],this.pointScale,7.5,colorId);
                            }
                        
                        break;
                    case "text":
                        if(this.drawing && this.drawList[i].position.length == 1){
                            this.drawMove(this.drawcontext,this.lastMovePostion,1.0,3.5,color,false,"","");
                        }
                        if(this.drawList[i].position.length < 2){
                            this.drawText(this.drawcontext,this.drawList[i].position[0],this.drawList[i].TempPostion,this.drawList[i].text,1.0,color,false,this.drawList[i].Selected);
                            this.drawText(this.drawcontextSelect,this.drawList[i].position[0],this.drawList[i].TempPostion,this.drawList[i].text,1.0,colorId,true);
                        }else{
                            this.drawText(this.drawcontext,this.drawList[i].position[0],this.drawList[i].position[1],this.drawList[i].text,1.0,color,false,this.drawList[i].Selected);
                            this.drawText(this.drawcontextSelect,this.drawList[i].position[0],this.drawList[i].position[1],this.drawList[i].text,1.0,colorId,true);
                        }
                        break;
                    case "line":

                        if(this.drawing){
                            if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[this.drawList.length - 1].position.length - 1],this.lastMovePostion,2,1,this.baseColor);
                            }
                        }
                        if(this.drawList[i].position.length == 2){
                            this.drawLine(this.drawcontext,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],2,1,this.baseColor,this.drawList[i].Selected);
                            this.drawLine(this.drawcontextSelect,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],9,1,colorId);
                        }
                        break;
                    case "circular":

                        if(this.drawing){
                            if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                this.drawcircular(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[this.drawList.length - 1].position.length - 1],this.lastMovePostion,2,1,this.baseColor);
                            }
                        }
                        if(this.drawList[i].position.length == 2){
                            this.drawcircular(this.drawcontext,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],2,1,this.baseColor,this.drawList[i].Selected);
                            this.drawcircular(this.drawcontextSelect,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],9,1,colorId);
                        }
                        break;
                    case "rectangle":

                        if(this.drawing){
                            if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount && this.drawtype == this.drawList[i].type){
                                this.drawrectangle(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[this.drawList.length - 1].position.length - 1],this.lastMovePostion,2,1,this.baseColor);
                            }
                        }
                        if(this.drawList[i].position.length == 2){
                            this.drawrectangle(this.drawcontext,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],2,1,this.baseColor,this.drawList[i].Selected);
                            this.drawrectangle(this.drawcontextSelect,this.drawList[i].position[this.drawList[i].position.length - 1],this.drawList[i].position[this.drawList[i].position.length - 2],9,1,colorId);
                        }
                        break;
                    case "Mark":
                        
                        this.drawMark(this.drawcontext      ,this.drawList[i].position[this.drawList[i].position.length - 1],false,1,this.baseColor,this.drawList[i].Selected);
                        this.drawMark(this.drawcontextSelect,this.drawList[i].position[this.drawList[i].position.length - 1],true,1,colorId);
                        
                        break;
                    case "cloud":

                        var points = [];
                        var last_temp = this.rotate_XY_display(this.lastMovePostion);
                        var last = {x:last_temp.x * this.ResolutionScale * this.scale,y:last_temp.y * this.ResolutionScale * this.scale};

                        for(var k = 0;k < this.drawList[i].position.length;k++){

                            var Position_temp = this.rotate_XY_display(this.drawList[i].position[k]);

                            points.push({x:Position_temp.x * this.ResolutionScale * this.scale,y:Position_temp.y * this.ResolutionScale * this.scale});
                        }

                        this.drawCloud(this.drawcontext,points,last,15,2,1,this.baseColor,this.drawList[i].Selected);
                        this.drawCloud(this.drawcontextSelect,points,last,15,9,1,colorId);

                        if(this.drawList[i].position.length > 2){   // 画封闭点位置

                            if(this.drawList[i].position[0].x == this.drawList[i].position[this.drawList[i].position.length - 1].x && this.drawList[i].position[0].y == this.drawList[i].position[this.drawList[i].position.length - 1].y){

                            }else{
                                this.drawcontext.lineWidth=2;
                                this.drawcontext.fillStyle="rgb(0,192,0)";
                                this.drawcontext.strokeStyle="rgb(0,192,0)";

                                var position_ = this.rotate_XY_display(this.drawList[i].position[0]);

                                this.drawcontext.beginPath();
                                this.drawcontext.arc(
                                    position_.x * this.ResolutionScale * this.scale,
                                    position_.y * this.ResolutionScale * this.scale,
                                    10,
                                    0,
                                    2*Math.PI);
                                this.drawcontext.stroke();
                                this.drawcontext.fill();
                            }
                        }

                        break;
                    case "Select_img_Mark":
                        
                        this.drawSelectImgMark(this.drawcontext      ,this.drawList[i].position[this.drawList[i].position.length - 1],false,1,this.baseColor,this.drawList[i].Selected,this.drawList[i].userData);
                        this.drawSelectImgMark(this.drawcontextSelect,this.drawList[i].position[this.drawList[i].position.length - 1],true,1,colorId,false,this.drawList[i].userData);
                        
                        break;
                }
            }

            if(this.lastPostion){
                if(this.drawList.length > 0){
                    if(this.drawList[this.drawList.length - 1].position[1]){
                        this.setNumber_inputPostion(this.drawList[this.drawList.length - 1].position[1]);
                    }else{
                        this.setNumber_inputPostion(this.lastPostion);
                    }
                }
            }
        },
        drawCloud(drawcontext,points,last,radius,Width,scale,color,isSelected){
            var color_='rgb(0,0,0)';

            if(Width){
                drawcontext.lineWidth = Width;
            }else{
                drawcontext.lineWidth=3;
            }

            if(color){
                if(!isSelected){
                    color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                }else{
                    drawcontext.lineWidth=7;
                    color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
                }
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            

            var finish = false;

            if(points[0].x == points[points.length-1].x && points[0].y == points[points.length-1].y && points.length > 3){
                finish = true;
            }

            ////////////////// 画角 /////////////////////

            var counterclockwise = false;

			if(finish){
				drawcontext.beginPath();
				
				let a1 = this.getAngle(points[0].x,points[0].y,points[points.length - 2].x,points[points.length - 2].y);
				let a2 = this.getAngle(points[0].x,points[0].y,points[1].x,points[1].y); // 

				let l = this.getLength(points[0].x,points[0].y,points[points.length - 2].x,points[points.length - 2].y);
				let l2 = l - parseInt(l / (radius * 1.5))*(radius * 1.5);
				l2 /= 2;
				let a11 = Math.acos(l2 / radius);
				a11 = Math.abs(a11);

				drawcontext.arc(points[0].x,points[0].y,radius,a1 + a11,a2 - Math.PI / 4,counterclockwise);
				drawcontext.stroke();

			}else{
				if(points.length > 1){
					drawcontext.beginPath();
					
					let a1 = this.getAngle(points[points.length-1].x,points[points.length-1].y,points[points.length-2].x,points[points.length-2].y);
					let a2 = this.getAngle(points[points.length-1].x,points[points.length-1].y,last.x,last.y); // 

					let l = this.getLength(points[points.length-1].x,points[points.length-1].y,points[points.length-2].x,points[points.length-2].y);
					let l2 = l - parseInt(l / (radius * 1.5))*(radius * 1.5);
					l2 /= 2;
					let a11 = Math.acos(l2 / radius);
					a11 = Math.abs(a11);


					drawcontext.arc(points[points.length-1].x,points[points.length-1].y,radius,a1 + a11,a2 - Math.PI / 4 ,counterclockwise);
					drawcontext.stroke();
				}
			}

			for(let i = 0; i < points.length - 2;i++){ 

				drawcontext.beginPath();
				
				let a1 = this.getAngle(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);
				let a2 = this.getAngle(points[i + 1].x,points[i + 1].y,points[i + 2].x,points[i + 2].y); // 

				let l = this.getLength(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);
				let l2 = l - parseInt(l / (radius * 1.5))*(radius * 1.5);
				l2 /= 2;
				let a11 = Math.acos(l2 / radius);
				a11 = Math.abs(a11);

				drawcontext.arc(points[i + 1].x,points[i + 1].y,radius,a1 + a11,a2 - Math.PI / 4 ,counterclockwise);
				drawcontext.stroke();
			}

			/////////////////////////////////////////////

			/////////////////// 画线 /////////////////////

			for(let i = 0; i < points.length - 1;i++){

				let l = this.getLength(points[i].x,points[i].y,points[i + 1].x,points[i + 1].y);
				let a1 = this.getAngle(points[i + 1].x,points[i + 1].y,points[i + 0].x,points[i + 0].y);

				let dir = {x:points[i + 1].x - points[i].x,y:points[i + 1].y - points[i].y};
				dir = this.normalize(dir);

				let k = radius * 1.5;

				for(let j = 1;j < Math.ceil(l / k);j++){

					drawcontext.beginPath();

					let item = {x:points[i].x + j*k * dir.x,y:points[i].y + j*k * dir.y};
					drawcontext.arc(item.x,item.y,radius,a1 + Math.PI / 5 ,a1 + Math.PI / 5 * 4,counterclockwise);

					drawcontext.stroke();
				}
			}

			//////////////////////////////////////////////

			///////////////// 画当前线 ////////////////////

			if(points.length > 0 && !finish){

				let l = this.getLength(	points[points.length-1].x,points[points.length-1].y,last.x,last.y);
				let a1 = this.getAngle(last.x,last.y,points[points.length-1].x,points[points.length-1].y);

				let dir = {x:last.x - points[points.length-1].x,y:last.y - points[points.length-1].y};
				dir = this.normalize(dir);

				let k = radius * 1.5;

				for(let j = 1;j < Math.ceil(l / k);j++){

					drawcontext.beginPath();

					let item = {x:points[points.length-1].x + j*k * dir.x,y:points[points.length-1].y + j*k * dir.y};
					drawcontext.arc(item.x,item.y,radius,a1 + Math.PI / 5 ,a1 + Math.PI / 5 * 4,counterclockwise);

					drawcontext.stroke();
				}
			}
			//////////////////////////////////////////////

        },
        drawSelectImgMark(drawcontext,position_,select,scale,color,isSelected,userData){
            var color_='rgb(0,0,0)';
            var position = this.rotate_XY_display(position_);

            if(color){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;
            drawcontext.lineWidth=3;

            drawcontext.beginPath();
            let fz_img = document.getElementById(userData.DrawImg);
            if(select){
                drawcontext.rect(
                    (position.x * this.ResolutionScale * this.scale - fz_img.width / 2),
                    (position.y * this.ResolutionScale * this.scale - fz_img.height/ 2),
                    fz_img.width ,
                    fz_img.height );
                drawcontext.fill();
            }else{
                
                if(isSelected){
                    fz_img = document.getElementById(userData.SelectImg);                    
                }else{
                    fz_img = document.getElementById(userData.DrawImg);
                }

                drawcontext.drawImage(fz_img,position.x* this.ResolutionScale * this.scale - 9,position.y* this.ResolutionScale * this.scale - 9);
            }

            drawcontext.stroke();

        },
        drawMark(drawcontext,position_,select,scale,color,isSelected){
            var position = this.rotate_XY_display(position_);
            var color_='rgb(0,0,0)';
            drawcontext.lineWidth=3;
            if(color){
                if(!isSelected){
                    color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                }else{
                    drawcontext.lineWidth=7;
                    color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
                }
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();
            let fz_img = document.getElementById("fz_img_for_draw");

            if(select){
                drawcontext.rect(
                    (position.x * this.ResolutionScale * this.scale - fz_img.width / 2),
                    (position.y * this.ResolutionScale * this.scale - fz_img.height / 2),
                    fz_img.width ,
                    fz_img.height );
                drawcontext.fill();
            }else{
                
                drawcontext.drawImage(fz_img,position.x* this.ResolutionScale * this.scale - 9,position.y* this.ResolutionScale * this.scale - 9);

                if(isSelected){
                    drawcontext.rect(
                    (position.x * this.ResolutionScale * this.scale - fz_img.width / 2),
                    (position.y * this.ResolutionScale * this.scale - fz_img.height / 2),
                    fz_img.width ,
                    fz_img.height );
                    // drawcontext.fill();
                }
            }

            drawcontext.stroke();

        },
        drawrectangle(drawcontext,Start_,End_,radius,scale,color,isSelected){
            var Start = this.rotate_XY_display(Start_);
            var End = this.rotate_XY_display(End_)
            var color_='rgb(0,0,0)';
            drawcontext.lineWidth=radius;

            if(color){
                if(!isSelected){
                    color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                }else{
                    drawcontext.lineWidth=7;
                    color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
                }
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();

            drawcontext.rect(
                Start.x * this.ResolutionScale * this.scale,
                Start.y * this.ResolutionScale * this.scale,
                (End.x - Start.x) * this.ResolutionScale * this.scale,
                (End.y - Start.y) * this.ResolutionScale * this.scale);

            drawcontext.stroke();

        },
        drawcircular(drawcontext,Start_,End_,radius,scale,color,isSelected){
            var Start = this.rotate_XY_display(Start_);
            var End = this.rotate_XY_display(End_)
            var color_='rgb(0,0,0)';
            drawcontext.lineWidth=radius;

            if(color){
                if(!isSelected){
                    color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                }else{
                    drawcontext.lineWidth=7;
                    color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
                }
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();

            drawcontext.ellipse(
                (Start.x + (End.x - Start.x)/2) * this.ResolutionScale * this.scale,
                (Start.y + (End.y - Start.y)/2) * this.ResolutionScale * this.scale,
                Math.abs(End.x - Start.x)/2 * this.ResolutionScale * this.scale,
                Math.abs(End.y - Start.y)/2 * this.ResolutionScale * this.scale,
                0,0,Math.PI*2,true);

            drawcontext.stroke();

        },
        drawLine(drawcontext,Start_,End_,radius,scale,color,isSelected){
            var Start = this.rotate_XY_display(Start_);
            var End = this.rotate_XY_display(End_)

            var color_='rgb(0,0,0)';
            drawcontext.lineWidth=radius;
            if(color){
                if(!isSelected){
                    color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                }else{
                    drawcontext.lineWidth=7;
                    color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
                }
            }

            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();

            drawcontext.moveTo(Start.x * this.ResolutionScale * this.scale,Start.y * this.ResolutionScale * this.scale);
            drawcontext.lineTo(End.x * this.ResolutionScale * this.scale,End.y * this.ResolutionScale * this.scale);

            drawcontext.stroke();

        },
        drawMove(drawcontext,position_,scale,radius,color,isSelected,data,pointName,type){
            var position = this.rotate_XY_display(position_);
            var color_="";

            if(type == "W" ){color.r =   0;color.g = 255;color.b = 255;}
            if(type == "LZ"){color.r = 255;color.g =   0;color.b = 255;}
            if(type == "DB"){color.r =   0;color.g =   0;color.b =   0;}
            if(type == "F" ){color.r = 255;color.g =   0;color.b =   0;}
            if(type == "FC"){color.r =   0;color.g = 255;color.b = 255;}
            if(type == "YS"){color.r =   0;color.g =   0;color.b =   0;}
            if(type == ""  ){color.r =   0;color.g =   0;color.b =   0;}
            if(type == "DL"){color.r =   0;color.g = 255;color.b =   0;}
            if(type == "MQ"){color.r = 255;color.g =   0;color.b = 255;}
            if(type == "SS"){color.r =   0;color.g = 255;color.b = 255;}
            if(type == "DX"){color.r =   0;color.g =   0;color.b = 255;}
            if(type == "SS"){color.r = 255;color.g = 127;color.b = 127;}
            if(type == undefined){}

            // if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            // }else{
            //     color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
            // }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            if((type != "LZ" && type != "FC") || type == undefined){
                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    2*Math.PI);
                drawcontext.stroke();
                drawcontext.fill();
            }

            if(type == "LZ"){
                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    2*Math.PI);
                drawcontext.stroke();

                drawcontext.beginPath();
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale * Math.sqrt(3) / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale + radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale * Math.sqrt(3) / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale + radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient);
                
                drawcontext.closePath();//结束路径状态
                drawcontext.fill();

                drawcontext.stroke();
            }

            if(type == "FC"){
                
                drawcontext.lineWidth= radius * scale * this.scale * this.ResolutionScale * this.Koeffzient / 5 * 3;

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale / 4 * 3 * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    2*Math.PI);
                drawcontext.stroke();
                
                // drawcontext.fill();

                drawcontext.stroke();
            }

            if(this.displayLabel){
                if(data){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(data,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale * this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale + 10* this.scale * this.ResolutionScale * this.Koeffzient);
                }

                if(pointName){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(pointName,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale * this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale - 4 * this.scale * this.ResolutionScale * this.Koeffzient);
                }
            }
        },
        drawLevel(drawcontext,position_,scale,radius,color,isSelected,data,pointName,type){
            var position = this.rotate_XY_display(position_);
            var color_="";

            if(type == "SW" ){color.r =   0;color.g =   0;color.b = 255;}
            if(type == "CYS"){color.r =   0;color.g =   0;color.b = 255;}

            // if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            // }else{
            //     color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
            // }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            if(type == "SW" ){

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale ,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    Math.PI);
                drawcontext.stroke();
                drawcontext.fill();

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale ,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    Math.PI,
                    2 * Math.PI);
                drawcontext.stroke();
            }

            if(type == "CYS" ){

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    Math.PI);
                drawcontext.stroke();
                drawcontext.fill();

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale ,
                    position.y * this.ResolutionScale * this.scale,
                    radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    Math.PI,
                    2 * Math.PI);

                drawcontext.stroke();

                drawcontext.beginPath();
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale * Math.sin( Math.PI / 5 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 5 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale * Math.sin( Math.PI / 5 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 5 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.stroke();

                drawcontext.beginPath();
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale * Math.sin( Math.PI / 3 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 3 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale * Math.sin( Math.PI / 3 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 3 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.stroke();

                 drawcontext.beginPath();
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale * Math.sin( Math.PI / 2.2 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 2.2 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale * Math.sin( Math.PI / 2.2 )* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale * Math.cos( Math.PI / 2.2 )* this.scale * this.ResolutionScale * this.Koeffzient,
                );
                drawcontext.stroke();
            }

            if(this.displayLabel){
                if(data){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(data,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale* this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale + 10* this.scale * this.ResolutionScale * this.Koeffzient);
                }

                if(pointName){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(pointName,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale* this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale - 4* this.scale * this.ResolutionScale * this.Koeffzient);
                }
            }
        },
        drawForce(drawcontext,position_,scale,radius,color,isSelected,data,pointName,type){
            var position = this.rotate_XY_display(position_);
            var color_="";

            if(type == "ZL"){color.r =   0;color.g = 255;color.b = 0;}
            if(type == "YL"){color.r =   0;color.g = 255;color.b = 0;}
            if(type == "TY"){color.r =   0;color.g = 255;color.b = 0;}
            if(type == "SY"){color.r =   0;color.g = 255;color.b = 0;}

            // if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            // }else{
            //     color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
            // }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            if(type == "ZL"){

                drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 2 * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.75 * scale * 2 * this.scale * this.ResolutionScale * this.Koeffzient);
            }

            if(type == "YL"){

                drawcontext.beginPath();
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale * Math.sqrt(3) / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale * Math.sqrt(3) / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale + radius * scale* this.scale * this.ResolutionScale * this.Koeffzient);
                
                drawcontext.closePath();//结束路径状态
                drawcontext.fill();

                drawcontext.stroke();
            }

            if(type == "TY"){

                drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.25 * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 2* this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.5 * scale * 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.beginPath();
                
                drawcontext.rect(
                    position.x * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    radius * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                    radius * scale* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.stroke();
            }

            if(type == "SY"){
                drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.0 * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.5 * scale * 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.beginPath();
                
                drawcontext.rect(
                    position.x * this.ResolutionScale * this.scale - radius * scale / 2* this.scale * this.ResolutionScale * this.Koeffzient,
                    position.y * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                    radius * scale* this.scale * this.ResolutionScale * this.Koeffzient,
                    radius * scale * 2* this.scale * this.ResolutionScale * this.Koeffzient);

                drawcontext.stroke();
            }

            if(this.displayLabel){
                if(data){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(data,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale* this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale + 10* this.scale * this.ResolutionScale * this.Koeffzient);
                }

                if(pointName){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(pointName,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale* this.scale * this.ResolutionScale * this.Koeffzient,position.y * this.ResolutionScale * this.scale - 4* this.scale * this.ResolutionScale * this.Koeffzient);
                }
            }
        },
        drawSlanting(drawcontext,position_,scale,radius,color,isSelected,data,pointName,type){
            var position = this.rotate_XY_display(position_);
            var color_="";

            if(type == "CX"){color.r = 255;color.g = 0;color.b = 0;}
            if(type == "TX"){color.r = 0;color.g = 0;color.b = 0;}
            if(type == "QX"){color.r = 0;color.g = 255;color.b = 0;}

            // if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            // }else{
            //     color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
            // }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            if(type == "CX" || type == "TX" ){

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius  * scale * this.scale * this.ResolutionScale * this.Koeffzient ,
                    Math.PI / 2,
                    Math.PI);
                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale);
                drawcontext.stroke();
                drawcontext.fill();

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale,
                    radius  * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    Math.PI / 2 * 3,
                    2 * Math.PI);
                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale,
                    position.y * this.ResolutionScale * this.scale);
                drawcontext.stroke();
                drawcontext.fill();

                drawcontext.beginPath();
                drawcontext.arc(
                    position.x * this.ResolutionScale * this.scale ,
                    position.y * this.ResolutionScale * this.scale,
                    radius  * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                    0,
                    2 * Math.PI);
                drawcontext.stroke();
            }

            if(type == "QX"){
                drawcontext.beginPath();
                
                drawcontext.moveTo(
                    position.x * this.ResolutionScale * this.scale + radius * scale / 2,
                    position.y * this.ResolutionScale * this.scale - radius * scale);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale / 2,
                    position.y * this.ResolutionScale * this.scale + radius * scale);

                drawcontext.lineTo(
                    position.x * this.ResolutionScale * this.scale - radius * scale / 2,
                    position.y * this.ResolutionScale * this.scale - radius * scale);
                
                drawcontext.closePath();//结束路径状态
                drawcontext.fill();

                drawcontext.stroke();
            }

            if(this.displayLabel){
                if(data){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(data,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale,position.y * this.ResolutionScale * this.scale + 10);
                }

                if(pointName){
                    drawcontext.fillStyle=color_;
                    drawcontext.font="12px Georgia";
                    drawcontext.fillText(pointName,position.x * this.ResolutionScale * this.scale + radius * 1.6 * scale,position.y * this.ResolutionScale * this.scale - 4);
                }
            }
        },
        drawText(drawcontext,position_start_,position_end_,text,scale,color,select,isSelected){
            
            var position_start = this.rotate_XY_display(position_start_);
            var position_end = this.rotate_XY_display(position_end_)

            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 100) / 2 + ',' + (color.g + 100) / 2 + ',' + (color.b + 255) / 2 + ')';
            }
            drawcontext.lineWidth=3;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            let start = {x:position_start.x * this.ResolutionScale * this.scale,y:position_start.y * this.ResolutionScale * this.scale};
            let end = {x:position_end.x * this.ResolutionScale * this.scale,y:position_end.y * this.ResolutionScale * this.scale};

            let end2 = {x:end.x,y:end.y};

            if(end.x < start.x){
                end2.x += 60;
            }else{
                end2.x -= 60;
            }

            drawcontext.beginPath();
            let dir = new THREE.Vector2(end2.x - start.x,end2.y - start.y);
            let length = dir.length();
            dir.normalize();

            // length -= 16;

            drawcontext.moveTo(start.x + dir.x * 16    ,start.y + dir.y * 16);
            drawcontext.lineTo(start.x + dir.x * length,start.y + dir.y * length);
            
            //执行画线
            drawcontext.stroke();

            //////////////////////////////////////////////////////////////////////

            let V = new THREE.Vector2(end2.x - start.x,end2.y - start.y);
            V.normalize();
            let angle = V.angle();

            let M = new THREE.Matrix4();
            M.makeRotationZ(angle);

            let V1 = new THREE.Vector3(16,8,0);
            let V2 = new THREE.Vector3(16,-8,0);

            V1.applyMatrix4(M);
            V2.applyMatrix4(M);

            // ctx.lineWidth=1;
            drawcontext.beginPath();
            
            drawcontext.moveTo(start.x         ,start.y);
            drawcontext.lineTo(start.x + V1.x  ,start.y + V1.y);
            drawcontext.lineTo(start.x + V2.x  ,start.y + V2.y);
            drawcontext.lineTo(start.x         ,start.y);
            drawcontext.stroke();
            drawcontext.fillStyle=color_;
            drawcontext.fill();

            drawcontext.beginPath();
            drawcontext.moveTo(end2.x,end2.y);
            drawcontext.lineTo(end.x,end2.y);
            drawcontext.stroke();

            drawcontext.beginPath();
            drawcontext.moveTo(end.x - 50,end2.y + 16);
            drawcontext.lineTo(end.x + 50,end2.y + 16);
            drawcontext.lineTo(end.x + 50,end2.y - 16);
            drawcontext.lineTo(end.x - 50,end2.y - 16);
            drawcontext.lineTo(end.x - 50,end2.y + 16);

            drawcontext.stroke();

            if(select == false){
                drawcontext.fillStyle='rgb(255,255,255)';
            }
            drawcontext.fill();
            
            if(select == false){
                if(text){
                    drawcontext.fillStyle='rgb(0, 0, 0)';
                    drawcontext.font="18px Georgia";
                    drawcontext.fillText(text,end.x - 46,end2.y + 6,92);
                }
            }

            
        },
        drawBroken(drawcontext,position_,scale,radius){

            var position = this.rotate_XY_display(position_);

            drawcontext.lineWidth=2;
            drawcontext.strokeStyle="rgba(0,0,0,1)";
            drawcontext.fillStyle="rgba(255,0,0,1)";
            drawcontext.setLineDash([3]);

            drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient + (radius + 10) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale* this.scale * this.ResolutionScale * this.Koeffzient - (radius + 5) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 2.5 * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.75 * scale * 2 * this.scale * this.ResolutionScale * this.Koeffzient);

            drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient + (radius + 10) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale* this.scale * this.ResolutionScale * this.Koeffzient - (radius + 5) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 0.2 * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.75 * scale * 3.5 * this.scale * this.ResolutionScale * this.Koeffzient);

            drawcontext.setLineDash([]);
            
        },drawAlert(drawcontext,position_,scale,radius){

            var position = this.rotate_XY_display(position_);

            drawcontext.lineWidth=2;
            drawcontext.strokeStyle="rgba(0,0,0,1)";
            drawcontext.fillStyle="rgba(168,168,0,1)";
            drawcontext.setLineDash([3]);

            drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient + (radius + 13) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale* this.scale * this.ResolutionScale * this.Koeffzient - (radius + 8) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 2.5 * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.75 * scale * 2 * this.scale * this.ResolutionScale * this.Koeffzient);

            drawcontext.fillRect(
                position.x * this.ResolutionScale * this.scale - radius * scale* this.scale * this.ResolutionScale * this.Koeffzient + (radius + 13) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale* this.scale * this.ResolutionScale * this.Koeffzient - (radius + 8) * scale * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * scale * 0.2 * this.scale * this.ResolutionScale * this.Koeffzient,
                radius * 0.75 * scale * 3.5 * this.scale * this.ResolutionScale * this.Koeffzient);

            drawcontext.setLineDash([]);
            
        },
        drawSelected(drawcontext,position_,scale,radius){

            var position = this.rotate_XY_display(position_);

            drawcontext.lineWidth=2;
            drawcontext.strokeStyle="rgba(0,0,0,1)";
            
            drawcontext.setLineDash([3]);

            drawcontext.beginPath();
            drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale * this.scale * this.ResolutionScale * this.Koeffzient  * 1.5,
                0,
                2*Math.PI);
            drawcontext.stroke();

            drawcontext.setLineDash([]);
            
        },
        create_Multiple_points(){
            this.$refs.number_input.style.display = "none";
            if(this.drawList.length > 0){
                if(this.drawList[this.drawList.length - 1].type == "text"){
                    this.drawList[this.drawList.length - 1].text = this.$refs.number_input_input.value;
                    this.drawFinish();
                }else{
                    
                    let count = 6;
                    try{
                        count = parseInt(this.$refs.number_input_input.value);
                    }catch(e){
                        count = 6;
                    }

                    if(isNaN(count)){
                        count = 6;
                    }
                    // this.drawList[this.drawList.length - 1].count = count;

                    // 平均添加点

                    let dir = new THREE.Vector2(this.lastPostion.x - this.drawList[this.drawList.length - 1].position[0].x,this.lastPostion.y - this.drawList[this.drawList.length - 1].position[0].y);
                    let length = dir.length();
                    dir.normalize();
                    count--;
                    length /= count;
                    let lastPointPosition = {x:this.drawList[this.drawList.length - 1].position[0].x,y:this.drawList[this.drawList.length - 1].position[0].y}

                    for(let j = 1; j < count + 1;j++){
                        // pointsArray.push({x:this.drawList[i].position[0].x + dir.x * length * j,y:this.drawList[i].position[0].y + dir.y * length * j});
                        let newPosition = {
                                            x:lastPointPosition.x + dir.x * length * j,
                                            y:lastPointPosition.y + dir.y * length * j
                                            };
                        let temp_type = this.drawList[this.drawList.length - 1].type;
                        // this.drawList.push({status:"normal",Selected:false,SID:this.drawID,type:temp_type,position:[{x:newPosition.x,y:newPosition.y}],count:1,ID_out:-1,edited:true,TempPostion:{x:0,y:0},text:"文本"});
                        this.drawList.push(this.create(temp_type,this.drawItemId,newPosition));
                        this.drawID++;
                    }

                    this.drawFinish();
                    
                }
            }

            this.Refresh();
        },
        drawFinish(){
            // this.sub_div.style.cursor = "default";
            this.$emit('finish',this.drawList);
        },
        pageSize(w,h){
            // console.log(w,h);
            this.$refs.pdfDocument.$el.style.position = ""; //  防抖
        },
        setDrawCancel(){
            this.sub_div.style.cursor = "default";
            this.editStatus = "normal";
            this.drawing = false;
            this.needChangeBroken = false;

            if(this.editStatus2 == true){
                this.drawing = false;
                this.editStatus = "move";
            }

        },
        setHeader(prefix,startNo,value){
            this.prefix = prefix;
            this.startNo = startNo;
            this.Koeffzient = value * 0.03;

            this.Refresh();

            console.log(this.prefix,this.startNo,this.Koeffzient);
        },
        setDrawStatus(status,drawtype,drawItemTagType,drawItemId,count,color,userData){
            this.status = "none";
            this.drawStatus = status;
            this.drawtype = "";
            this.moveElement = false;
            this.drawCount = count;
            this.editStatus = "normal";
            this.startMove = false;
            this.drawItemId = drawItemId;
            this.drawtypeNum = drawtype;
            this.drawMaxCount = count;
            this.drawItemTagType = drawItemTagType;
            this.drawing = true;
            if(color){
                this.baseColor = color;
            }
            this.sub_div.style.cursor = "crosshair";

            switch(drawtype){
                case 1: //  位移
                    this.drawtype = "move";
                    break;
                case 2: //  位移
                    this.drawtype = "move";
                    break;
                case 3: //  水位
                    this.drawtype = "level";
                    break;
                case 4: //  力
                    this.drawtype = "force";
                    break;
                case 5: //  倾斜
                    this.drawtype = "slanting";
                    break;
                case 101: // 线段
                    this.drawtype = "line";
                    break;
                case 102: // 椭圆
                    this.drawtype = "circular";
                    break;
                case 103: // 方块
                    this.drawtype = "rectangle";
                    break;
                case 104: // 云线
                    this.drawtype = "cloud";
                    break;
                case 105: // 标记
                    this.drawtype = "Mark";
                    break;
                case 10001: // 图标
                    this.drawtype = "Select_img_Mark";
                    break;
                case 10000: // 文字
                    this.drawtype = "text";
                    break;
            }

            if(userData){
                this.userData = userData;
            }else{
                this.userData = {};
            }

            // if(status == "text"){
            //     this.drawtype = "text";
            // }

            // console.log(this.drawtype);

            this.$refs.number_input.style.display = "none";

        },
        setMoveStatus(enable){
            
            console.log(enable);
            this.editStatus2 = enable;

            if(enable == false){
                this.editStatus = "normal";
            }else{
                 this.editStatus = "move";
            }
            // this.sub_div.style.cursor = "default";
            // this.drawing = false;
        },
        deleteDraw(){
            if(this.SelectedList.length > 0){
                let temp = this.drawList;
                this.drawList = [];

                for(let i = 0;i < temp.length;i++){
                    let find = false;

                    for(let j = 0;j < this.SelectedList.length;j++){
                        if(this.SelectedList[j].SID == temp[i].SID){
                            find = true;
                        }
                    }

                    if(find == false){
                        this.drawList.push(temp[i]);
                    }
                }

                this.Refresh();
            }
        },
        create(type,ItemId,position){
            let item = {
                            data:"",                                    //  data
                            ItemId:ItemId,                              //  itemId
                            ID_out:-1,                                  //  id
                            isAlert:0,                                  //  isAlert
                            isBroken:0,                                 //  isBroken
                            itemName:"",                                //  itemName
                            pointName:"",                               //  pointName
                            status:"normal",
                            Selected:false,
                            SID:this.drawID,
                            type:type,
                            position:[{x:position.x,y:position.y}],
                            count:1,
                            TempPostion:{x:position.x,y:position.y},
                            text:"文本",
                            display:true,
                            data:"none",
                            pointName:"new point",
                            typeNum:this.drawtypeNum,                    //  type,
                            userData:this.userData,
                            prefix:this.prefix,
                            startNo: (this.startNo != undefined)?this.startNo++:0,
                            drawItemTagType:this.drawItemTagType,
                            drawMaxCount:this.drawMaxCount
                        };
            // console.log(item);
            return item;
        },
        enableType(drawtype,sign,status,contentType){

            for(let i = 0; i < this.drawList.length;i++){

                if(this.drawList[i].pointGroupData){
                    for(let j = 0; j < this.drawList[i].pointGroupData.length;j++)
                    if(this.drawList[i].pointGroupData[j].itemType == drawtype && this.drawList[i].pointGroupData[j].sign == sign ){

                        if(this.drawList[i].pointGroupData[j].itemId == contentType){
                            // this.drawList[i].display = status;
                            this.drawList[i].pointGroupData[j].display = status;
                        }
                    }
                }
            }

            this.Refresh();
        },
        enableTypeOne(drawtype,drawItemId,status){
            // switch(drawtype){
            //     case 1: //  位移
            //         this.drawtype_move = status;
            //         break;
            //     case 2: //  位移
            //         this.drawtype_move = status;
            //         break;
            //     case 3: //  水位
            //         this.drawtype_level = status;
            //         break;
            //     case 4: //  力
            //         this.drawtype_force = status;
            //         break;
            //     case 5: //  倾斜
            //         this.drawtype_slanting = status;
            //         break;
            // }

            for(let i = 0; i < this.drawList.length;i++){
                if(this.drawList[i].typeNum == drawtype && this.drawList[i].ItemId == drawItemId){
                    this.drawList[i].display = status;
                }else{
                    this.drawList[i].display = false;
                }
            }

            this.Refresh();
        },
        saveList(){
            var output = [];

            for(let i = 0; i < this.drawList.length;i++){
                var item = {};

                item.data = this.drawList[i].data;
                item.itemId = this.drawList[i].ItemId;
                item.id = this.drawList[i].ID_out;
                item.isAlert = this.drawList[i].isAlert;
                item.isBroken = this.drawList[i].isBroken;
                item.itemName = this.drawList[i].itemName;
                item.pointName = this.drawList[i].name;
                item.type = this.drawList[i].typeNum;
                item.plotInfo = JSON.stringify(this.drawList[i]);
                item.prefix = this.drawList[i].prefix;
                item.startNo = this.drawList[i].startNo;
                item.drawItemTagType = this.drawList[i].drawItemTagType;
                item.drawMaxCount = this.drawList[i].drawMaxCount;
                
                // if(item.type == 5){continue;}

                output.push(item);
            }

            return output;
        },
        getType(itemType){
            var drawtype = "";
            switch(itemType){
                case 1: //  位移
                    drawtype = "move";
                    break;
                case 2: //  位移
                    drawtype = "move";
                    break;
                case 3: //  水位
                    drawtype = "level";
                    break;
                case 4: //  力
                    drawtype = "force";
                    break;
                case 5: //  倾斜
                    drawtype = "slanting";
                    break;
                case 101: // 线段
                    drawtype = "line";
                    break;
                case 102: // 椭圆
                    drawtype = "circular";
                    break;
                case 103: // 方块
                    drawtype = "rectangle";
                    break;
                case 104: // 云线
                    drawtype = "cloud";
                    break;
                case 105: // 标记
                    drawtype = "Mark";
                    break;
                case 10001: // 图标
                    drawtype = "Select_img_Mark";
                    break;
                case 10000: // 文字
                    drawtype = "text";
                    break;
            }

            return drawtype;
        }
        ,
        loadPoints(list){
            this.drawList = [];
            this.SelectedList = [];
            this.drawID = 1;
            // console.log(list);

            for(let i = 0;i < list.length;i++){
                
                let plotInfo = JSON.parse(list[i].plotInfo);
                // console.log(plotInfo,'plotInfo')

                
                if(list[i].pointGroupData){

                    for(let j = 0; j < list[i].pointGroupData.length;j++){

                        list[i].pointGroupData[j].itemTypeToDisplay = this.getType(list[i].pointGroupData[j].itemType);
                        list[i].pointGroupData[j].display = true;
                    }

                    let item = {
                                data:list[i].data,                                  //  data
                                ItemId:list[i].itemId,                              //  itemId
                                ID_out:list[i].id,                                  //  id
                                isAlert:list[i].isAlert,                            //  isAlert
                                isBroken:list[i].isBroken,                          //  isBroken
                                itemName:list[i].itemName,                          //  itemName
                                pointName:list[i].pointName,                        //  pointName
                                status:"normal",
                                Selected:false,
                                SID:this.drawID,
                                type:plotInfo.type,
                                position:plotInfo.position,
                                count:1,
                                TempPostion:plotInfo.TempPostion,
                                text:plotInfo.text,
                                display:true,
                                typeNum:null,                               //  type
                                userData:plotInfo.userData,
                                pointGroupData:list[i].pointGroupData
                            };

                    if(list[i].pointGroupData>0){
                        item.isBroken = list[i].pointGroupData[0].isBroken;
                    }
                    
                    this.drawList.push(item);

                    this.drawID++;
                }

            }
            this.Refresh();
            
        },
        loadPoints2(list){
            this.drawList= [];
            this.drawID = 1;
            // console.log(list);
            this.baseColor = {r:255,g:0,b:0};
            for(let i = 0; i < list.length;i++){
                var listItem = JSON.parse(list[i].coordinateInfo);

                let item = {
                            data:listItem.data,                                  //  data
                            ItemId:listItem.itemId,                              //  itemId
                            ID_out:list[i].id,                                  //  id
                            isAlert:listItem.isAlert,                            //  isAlert
                            isBroken:listItem.isBroken,                          //  isBroken
                            itemName:listItem.itemName,                          //  itemName
                            pointName:listItem.pointName,                        //  pointName
                            status:"normal",
                            Selected:false,
                            SID:this.drawID,
                            type:listItem.type,
                            position:listItem.position,
                            count:1,
                            TempPostion:listItem.TempPostion,
                            text:listItem.text,
                            display:true,
                            typeNum:listItem.type                               //  type
                        };
                this.drawList.push(item);

                this.drawID++;
            }
        },
        clearAll(){
            this.drawList= [];
            this.drawID = 1;
        },
        enableLabel(status){
            this.displayLabel = status;
            this.Refresh();
        },
        changeBroken(){
            // if(this.SelectedList.length > 0){
            //     for(let j = 0;j < this.SelectedList.length;j++){
            //         this.SelectedList[j].isBroken = 0;
            //     }
            //     this.Refresh();
            // }
            this.needChangeBroken = true;
        },
        getAngle(x1,y1,x2,y2){
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
        rotation(angle){
            this.angle = angle;
            while(this.angle < 0){
                this.angle += 360;
            }

            while(this.angle >= 360){
                this.angle -= 360;
            }

            switch(this.type){
                case "PDF":
                    this.R = this.angle;
                    this.size_R();
                    break;
                default:
                    this.size_R();
                    break;
                    
            }
        },
        rotate_XY(x,y){
            var X = x;
            var Y = y;

            var Temp_Size = {width:this.oldImageSize.width / this.ResolutionScale,height:this.oldImageSize.height / this.ResolutionScale};
            if(this.type == "PDF"){
                Temp_Size = {width:1024,height:1024 * (this.oldImageSize.height / this.oldImageSize.width)};
            }

            switch(this.angle){
                case 0: 	break;
                case 90: 	X -= Temp_Size.height;break;
                case 180: 	X -= Temp_Size.width; Y-=Temp_Size.height;break;
                case 270: 	Y -= Temp_Size.width;break;
            }

            var m = new THREE.Matrix4();
            m.makeRotationZ(-this.angle / 180 * Math.PI);
            var V = new THREE.Vector3(X,Y,0);

            V.applyMatrix4(m);

            X=V.x;
            Y=V.y;

            return {x:X,y:Y};
        },
        rotate_XY_display(position){
            var X = position.x;
            var Y = position.y;

            var m = new THREE.Matrix4();
            m.makeRotationZ(this.angle / 180 * Math.PI);
            var V = new THREE.Vector3(X,Y,0);

            V.applyMatrix4(m);

            X=V.x;
            Y=V.y;

            if(this.oldImageSize == undefined){
                return {x:X,y:Y};
            }

            var Temp_Size = {width:this.oldImageSize.width / this.ResolutionScale,height:this.oldImageSize.height / this.ResolutionScale};
            if(this.type == "PDF"){
                Temp_Size = {width:1024,height:1024 * (this.oldImageSize.height / this.oldImageSize.width)};
            }

            switch(this.angle){
                case 0: 	break;
                case 90: 	X +=Temp_Size.height;break;
                case 180: 	X +=Temp_Size.width; Y+=Temp_Size.height;break;
                case 270: 	Y +=Temp_Size.width;break;
            }
            
            return {x:X,y:Y};
        },
        setPointScale(scale){
            this.pointScale = scale;
            this.Refresh();
        },
        print_priority_points(width,height){
            
            var min = {x:1000000000,y:1000000000};
            var max = {x:-1000000000,y:-1000000000};
            var width_inside = 0;
            var height_inside = 0;
            var count  = 0;

            var timer = setInterval(()=>{

                if(this.oldImageSize){

                    clearInterval(timer);
                    if(this.oldImageSize.width != 0 && this.oldImageSize.height != 0){

                        for(let i = 0; i < this.drawList.length;i++){
                            if(this.drawList[i].display){
                                count++;
                                for(let j = 0;j < this.drawList[i].position.length;j++){
                                    
                                    var position = this.rotate_XY_display(this.drawList[i].position[j])
                                    
                                    position.x *= this.ResolutionScale;
                                    position.y *= this.ResolutionScale;
                                    // console.log(position);

                                    if(position.x > max.x){
                                        max.x = position.x;
                                    }

                                    if(position.y > max.y){
                                        max.y = position.y;
                                    }

                                    if(position.x < min.x){
                                        min.x = position.x;
                                    }

                                    if(position.y < min.y){
                                        min.y = position.y;
                                    }
                                }
                            }
                        }

                        width_inside = Math.abs(max.x - min.x);
                        height_inside = Math.abs(max.y - min.y);

                        var scale = 1;
                        
                        // if(count == 4){
                        //     console.log("---------------------------------------");
                        //     console.log(width_inside,height_inside,max,min);
                        // }

                        if(height_inside > width_inside){
                            scale *= height / height_inside;
                        }else{
                            scale *= width / width_inside;
                        }

                        width_inside *= scale;
                        height_inside *= scale;
                        max.x *= scale;
                        max.y *= scale;
                        min.x *= scale;
                        min.y *= scale;

                        var scale2 = 1;

                        if(height_inside > width_inside){
                            if(width_inside > width){
                                scale2 = width / width_inside;
                            }
                        }else{
                             if(height_inside > height){
                                scale2 = height / height_inside;
                            }
                        }

                        scale2 *= 0.8;

                        width_inside *= scale2;
                        height_inside *= scale2;
                        max.x *= scale2;
                        max.y *= scale2;
                        min.x *= scale2;
                        min.y *= scale2;

                        var center = {x:(max.x + min.x) / 2,y:(max.y + min.y) / 2}

                        var center_out = {x:width / 2,y:height / 2};
                        var center_diff = {x:center_out.x - center.x,y:center_out.y - center.y};

                        this.scale = scale * scale2;

                        // if(count == 4){
                        //     console.log(width_inside,height_inside,this.scale,center,center_out,center_diff);
                        //     console.log("---------------------------------------");
                        // }

                        switch(this.type){
                            case "PDF":
                                this.start_canvas.x = this.sub_div.offsetLeft;
                                this.start_canvas.y = this.sub_div.offsetTop;
                                this.start_canvas.w = this.sub_div.offsetWidth;
                                this.start_canvas.h = this.sub_div.offsetHeight;

                                {

                                    this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                                    if(this.angle == 0 || this.angle == 180){
                                        this.sub_div.style.height = this.imageSize.height + "px";
                                        this.sub_div.style.width = this.imageSize.width + "px";
                                        this.drawCanvas.height = this.imageSize.height;
                                        this.drawCanvas.width = this.imageSize.width;
                                        this.drawCanvasSelect.height = this.imageSize.height;
                                        this.drawCanvasSelect.width = this.imageSize.width;
                                    }else{
                                        this.sub_div.style.height = this.imageSize.width + "px";
                                        this.sub_div.style.width = this.imageSize.height + "px";
                                        this.drawCanvas.height = this.imageSize.width;
                                        this.drawCanvas.width = this.imageSize.height;
                                        this.drawCanvasSelect.height = this.imageSize.width;
                                        this.drawCanvasSelect.width = this.imageSize.height;
                                    }

                                    this.sub_div.style.left = center_diff.x + "px";
                                    this.sub_div.style.top = center_diff.y + "px";
                                }
                                break;
                            case "PGN":

                                this.start_canvas.x = this.sub_div.offsetLeft;
                                this.start_canvas.y = this.sub_div.offsetTop;
                                this.start_canvas.w = this.sub_div.offsetWidth;
                                this.start_canvas.h = this.sub_div.offsetHeight;

                                this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                                if(this.angle == 0 || this.angle == 180){
                                    this.sub_div.style.height = this.imageSize.height + "px";
                                    this.sub_div.style.width  = this.imageSize.width + "px";
                                    this.canvas.height = this.imageSize.height;
                                    this.canvas.width = this.imageSize.width;
                                    this.drawCanvas.height = this.imageSize.height;
                                    this.drawCanvas.width = this.imageSize.width;
                                    this.drawCanvasSelect.height = this.imageSize.height;
                                    this.drawCanvasSelect.width = this.imageSize.width;
                                }else{
                                    this.sub_div.style.height = this.imageSize.width + "px";
                                    this.sub_div.style.width  = this.imageSize.height + "px";
                                    this.canvas.height = this.imageSize.width;
                                    this.canvas.width = this.imageSize.height;
                                    this.drawCanvas.height = this.imageSize.width;
                                    this.drawCanvas.width = this.imageSize.height;
                                    this.drawCanvasSelect.height = this.imageSize.width;
                                    this.drawCanvasSelect.width = this.imageSize.height;
                                }

                                this.context = this.canvas.getContext('2d');
                                this.context.rotate(this.angle*Math.PI/180);

                                switch(this.angle){
                                    case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                                    case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                                    case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                                    case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                                }

                                this.sub_div.style.left = center_diff.x + "px";
                                this.sub_div.style.top = center_diff.y + "px";

                                break;
                        }

                        

                        // console.log(max,min);
                        // console.log(max2,min2);
                    }
                }
            },200);
           
            
        },
        print_priority_pic(width,height){   //  外部宽高

            var width_inside = 0;
            var height_inside = 0;

            var timer = setInterval(()=>{

                if(this.oldImageSize){

                    clearInterval(timer);
                    if(this.oldImageSize.width != 0 && this.oldImageSize.height != 0){

                        clearInterval(timer);
                        
                        if(this.angle == 90 || this.angle == 270)
                        {
                            width_inside = this.oldImageSize.height;
                            height_inside = this.oldImageSize.width;
                        }else{
                            width_inside = this.oldImageSize.width;
                            height_inside = this.oldImageSize.height;
                        }

                        var scale = 1;

                        if(width_inside > width){
                            scale *= width / width_inside;
                        }

                        width_inside *= scale;
                        height_inside *= scale;

                        if(height_inside > height){
                            scale *= height / height_inside;
                        }

                        this.scale = scale;

                        switch(this.type){

                            case "PDF":
                                this.start_canvas.x = this.sub_div.offsetLeft;
                                this.start_canvas.y = this.sub_div.offsetTop;
                                this.start_canvas.w = this.sub_div.offsetWidth;
                                this.start_canvas.h = this.sub_div.offsetHeight;

                                {

                                    this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                                    if(this.angle == 0 || this.angle == 180){
                                        this.sub_div.style.height = this.imageSize.height + "px";
                                        this.sub_div.style.width = this.imageSize.width + "px";
                                        this.drawCanvas.height = this.imageSize.height;
                                        this.drawCanvas.width = this.imageSize.width;
                                        this.drawCanvasSelect.height = this.imageSize.height;
                                        this.drawCanvasSelect.width = this.imageSize.width;
                                        this.sub_div.style.left = (width - this.sub_div.style) / 2 + "px";
                                        this.sub_div.style.top = (height - this.imageSize.height) / 2 + "px";
                                    }else{
                                        this.sub_div.style.height = this.imageSize.width + "px";
                                        this.sub_div.style.width = this.imageSize.height + "px";
                                        this.drawCanvas.height = this.imageSize.width;
                                        this.drawCanvas.width = this.imageSize.height;
                                        this.drawCanvasSelect.height = this.imageSize.width;
                                        this.drawCanvasSelect.width = this.imageSize.height;
                                        this.sub_div.style.left = (width - this.imageSize.height) / 2 + "px";
                                        this.sub_div.style.top = (height - this.sub_div.style) / 2 + "px";
                                    }

                                    
                                }
                                
                                break;
                            case "PNG":
                                this.start_canvas.x = this.sub_div.offsetLeft;
                                this.start_canvas.y = this.sub_div.offsetTop;
                                this.start_canvas.w = this.sub_div.offsetWidth;
                                this.start_canvas.h = this.sub_div.offsetHeight;

                                this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                                if(this.angle == 0 || this.angle == 180){
                                    this.sub_div.style.height = this.imageSize.height + "px";
                                    this.sub_div.style.width  = this.imageSize.width + "px";
                                    this.canvas.height = this.imageSize.height;
                                    this.canvas.width = this.imageSize.width;
                                    this.drawCanvas.height = this.imageSize.height;
                                    this.drawCanvas.width = this.imageSize.width;
                                    this.drawCanvasSelect.height = this.imageSize.height;
                                    this.drawCanvasSelect.width = this.imageSize.width;
                                    this.sub_div.style.left = (width - this.sub_div.style) / 2 + "px";
                                    this.sub_div.style.top = (height - this.imageSize.height) / 2 + "px";
                                }else{
                                    this.sub_div.style.height = this.imageSize.width + "px";
                                    this.sub_div.style.width  = this.imageSize.height + "px";
                                    this.canvas.height = this.imageSize.width;
                                    this.canvas.width = this.imageSize.height;
                                    this.drawCanvas.height = this.imageSize.width;
                                    this.drawCanvas.width = this.imageSize.height;
                                    this.drawCanvasSelect.height = this.imageSize.width;
                                    this.drawCanvasSelect.width = this.imageSize.height;
                                    this.sub_div.style.left = (width - this.imageSize.height) / 2 + "px";
                                    this.sub_div.style.top = (height - this.sub_div.style) / 2 + "px";
                                }

                                this.context = this.canvas.getContext('2d');
                                this.context.rotate(this.angle*Math.PI/180);

                                switch(this.angle){
                                    case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);break;
                                    case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);break;
                                    case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);break;
                                    case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);break;
                                }

                                break;

                        }
                                    
                        
                    }

                }

            },200);


        }
    }
}
</script>


