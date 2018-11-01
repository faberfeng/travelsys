<template>
    <div ref="picViewOutSide" style="background-color:rgba(192,192,192,0);position:absolute;width:100%;height:100%" @mousedown="onmousedown" @contextmenu="oncontextmenu" @mousemove="onmousemove" @mouseup="onmouseup" @wheel="onwheel">
        <div ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute">            
            <pdf id="pdfD" ref="pdfDocument" @loaded="load" @page-size="pageSize" :src="url" ></pdf>
            <canvas ref="picViewImage"  style="position:absolute;top:0px;left:0px"></canvas>
            <canvas ref="drawCanvas" id="drawCanvas" style="position:absolute;top:0px;left:0px" @mousedown="oncanvasmousedown" @mousemove="oncanvasmousemove" @mouseup="oncanvasmouseup"></canvas>
            <canvas ref="drawCanvasSelect" id="drawCanvasSelect" style="position:absolute;top:0px;left:0px;display:none"></canvas>
            <div ref="number_input" style="width:200px;height:36px;border:1px solid red;display:none;position:absolute;background-color:rgba(255,255,255,1)">
                <input ref="number_input_input"  type = "text" style="position:absolute;left:2px;height:30px;top:2px;width:120px"/>
                <button @click="create_Multiple_points" style="right:2px;height:30px;top:2px;width:60px;position:absolute" >确定</button>
            </div>
            <input type="text"/>
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
        }
    },
    destroyed(){
        clearInterval(this.Refresh_timer);
    },
    mounted(){
        
        this.drawStatus = "none";
        this.editStatus = "normal";
        this.ResolutionScale = 1.0;
        this.drawCount = 0;
        this.drawMaxCount = 0;
        this.drawList = [];
        this.startMove = false;
        this.drawtype_move = true;
        this.drawtype_move = true;
        this.drawtype_level = true;
        this.drawtype_force = true;
        this.drawtype_slanting = true;
        this.Refresh_timer = null;
        this.drawing = false;
        this.lastMovePostion = {x:0,y:0};

        this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
        this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
        this.old_para = "";

        this.drawID = 1;


        this.Refresh_timer = setInterval(()=>{

            if(this.para.type == "")return;

            if(this.para.type == "pdf"){
                this.para.type = "PDF";
                if(this.para.source != this.old_para){

                    

                    this.$refs.pdfDocument.$el.style.display = "block";
                    this.$refs.picViewImage.style.display = "none";
                    this.$refs.pdfDocument.$el.style.position = "relative";
                    this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "0px";
                    this.url = this.para.source;
                    

                    this.ResolutionScale = this.PDFscale; 
                    
                    this.old_para = this.para.source;
                    this.size_R();
                }
            }else{



                this.para.type = "PNG";
                if(this.para.source != this.old_para){
                    this.$refs.pdfDocument.$el.style.display = "none";
                    this.$refs.picViewImage.style.display = "block";
                    this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "0px";
                    this.init(this.$refs.picView,this.para.source,this.para.type,1,0);
                    this.old_para = this.para.source;
                }
            }
            // console.log(this.para);
           
            this.Refresh();

            
        },500);

        

        
        

    },
    filters:{

    },
    watch:{
        para: (newVal,oldVal)=>{
        }
    },
    methods:{
        init(div,source,type,page_No,angle){

            
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

            if(angle == undefined){
                angle = 0;
            }

            this.angle = angle;
            this.page_No = page_No;

            while(this.angle < 0){
                this.angle += 360;
            }

            while(this.angle > 360){
                this.angle -= 360;
            }

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

                            this.context = this.canvas.getContext('2d');
                            this.oldImageSize = {width:this.sub_div.offsetWidth,height:this.sub_div.offsetWidth * (this.image.height / this.image.width)};
                            this.imageSize = {width:this.oldImageSize.width * this.scale,height:this.oldImageSize.height * this.scale};

                            if(this.angle == 0 || this.angle == 180){
                                this.sub_div.height = this.imageSize.height;
                                this.sub_div.width = this.imageSize.width;
                                this.canvas.height = this.imageSize.height;
                                this.canvas.width = this.imageSize.width;
                                this.drawCanvas.height = this.imageSize.height;
                                this.drawCanvas.width = this.imageSize.width;
                                this.drawCanvasSelect.height = this.imageSize.height;
                                this.drawCanvasSelect.width = this.imageSize.width;
                                
                            }else{
                                this.sub_div.height = this.imageSize.width;
                                this.sub_div.width = this.imageSize.height;
                                this.canvas.height = this.imageSize.width;
                                this.canvas.width = this.imageSize.height;
                                this.drawCanvas.height = this.imageSize.width;
                                this.drawCanvas.width = this.imageSize.height;
                                this.drawCanvasSelect.height = this.imageSize.width;
                                this.drawCanvasSelect.width = this.imageSize.height;
                            }

                            this.context.rotate(this.angle*Math.PI/180);

                            switch(this.angle){
                                case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);
                                case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);
                                case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);
                                case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);
                            }

                            // div.appendChild(this.Main_div);
                            this.isRender = false;
                            this.Refresh();
                        }
                    }

                    ///////////////////////////////////////////////////////////////////////////////////////////////

				break;
            }
            
            
            this.Refresh();
        },
        load(){
            // console.log(this.$refs.pdfDocument);
            
            this.Main_div = this.$refs.picViewOutSide;
            this.sub_div = this.$refs.picView;

            var timer = setInterval(()=>{
                this.sub_div.style.height = this.$refs.pdfDocument.$refs.canvasParent.offsetHeight + "px";
                this.oldImageSize = {width:this.$refs.pdfDocument.$refs.canvasParent.offsetWidth,height:this.$refs.pdfDocument.$refs.canvasParent.offsetHeight};
                this.drawCanvas.height = this.$refs.picView.offsetHeight;
                this.drawCanvas.width = this.$refs.picView.offsetWidth;
                this.drawCanvasSelect.height = this.$refs.picView.offsetHeight;
                this.drawCanvasSelect.width = this.$refs.picView.offsetWidth;
                clearInterval(timer);
            },200);

            this.$refs.pdfDocument.$el.style.position = ""; //  防抖

            this.init(this.$refs.picView,this.para.source,this.para.type,1,0);
            
        },
        oncanvasmousedown(e){
            // console.log(e.layerX / this.ResolutionScale / this.scale,e.layerY / this.ResolutionScale / this.scale);
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            if(e.button == 0){
                this.lastPostion = {x:X,y:Y};
                if(this.editStatus == "move"){   //  移动标记
                    this.startMove = true;
                }else{  //  绘制标记
                    if(this.drawCount > 0){
                        this.drawCount--;
                        
                        let find = false;

                        for(let i = 0;i < this.drawList.length;i++){
                            if(this.drawList[i].SID == this.drawID ){
                                find = true;
                                if(this.drawList[i].type == "text"){
                                    this.drawList[i].position.push({x:X,y:Y});
                                }
                            }
                        }

                        if(find == false){
                            // this.drawList.push({status:"normal",Selected:false,SID:this.drawID,type:this.drawtype,position:[{x:X,y:Y}],count:1,ID_out:-1,edited:true,TempPostion:{x:0,y:0},text:"文本"});
                            this.drawList.push(this.create(this.drawtype,this.drawItemId,{x:X,y:Y}));
                            this.$emit('finish',null);
                        }else{
                            
                            this.$refs.number_input_input.value = "6";
                            this.$refs.number_input.style.display = "block";
                        }

                        if(this.drawCount == 0){
                            
                            if(this.drawMaxCount == 2){   // 两个点完成绘制的
                                switch(this.drawList[this.drawList.length - 1].type){

                                    case "text":
                                        this.$refs.number_input.style.left = (this.drawList[this.drawList.length - 1].position[1].x * this.ResolutionScale * this.scale - 50) + "px";
                                        this.$refs.number_input.style.top  = (this.drawList[this.drawList.length - 1].position[1].y * this.ResolutionScale * this.scale - 16) + "px";
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
                                }
                                 
                                
                            }

                            if(this.drawMaxCount == 1){
                                
                            }

                            this.drawing = false;

                            this.drawID++;
                        }

                        this.Refresh();
                    }else{ // 选取元素
                        var selectColorID = this.drawcontextSelect.getImageData(e.layerX ,  e.layerY, 1, 1).data;
                        var red = selectColorID[0];
                        var green = selectColorID[1];
                        var blue = selectColorID[2];

                        var SID = red + green * 256 + blue * 256 *256;

                        // console.log(SID);


                        this.SelectedList = [];

                        for(let i = 0; i < this.drawList.length;i++){
                            this.drawList[i].Selected = false;
                            if(this.drawList[i].SID == SID){
                                this.SelectedList.push(this.drawList[i]);
                            }
                        }

                        for(let i = 0; i < this.SelectedList.length;i++){
                            this.SelectedList[i].Selected = true;
                        }

                        if(SID > 0){
                            this.$emit('status_changed',true,this.SelectedList);
                        }else{
                            this.$emit('status_changed',false,this.SelectedList);
                        }

                    }
                }
            }
        },
        oncanvasmousemove(e){
            
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            if(this.drawList.length > 0){
                if(this.drawList[this.drawList.length-1].type == "text" && this.drawList[this.drawList.length-1].position.length != 2){
                    this.drawList[this.drawList.length-1].TempPostion = {x:X,y:Y};
                }
            }

            if(this.startMove){
                for(let i = 0;i < this.SelectedList.length;i++){
                    if(this.SelectedList[i].type == "text"){
                        let dist = {x:this.SelectedList[i].position[1].x - this.SelectedList[i].position[0].x,y:this.SelectedList[i].position[1].y - this.SelectedList[i].position[0].y};

                        this.SelectedList[i].position[0].x = X;
                        this.SelectedList[i].position[0].y = Y;

                        this.SelectedList[i].position[1].x = X + dist.x;
                        this.SelectedList[i].position[1].y = Y + dist.y;

                    }else{
                        this.SelectedList[i].position[0].x = X;
                        this.SelectedList[i].position[0].y = Y;
                    }
                }
            }

            this.lastMovePostion = {x:X,y:Y};

            this.Refresh();
        },
        oncanvasmouseup(e){
            this.startMove = false;
            this.editStatus = "normal";
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
                            case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);
                            case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);
                            case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);
                            case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);
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
                            case 0: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0 					,0   				,this.canvas.width ,this.canvas.height);
                            case 90: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0					,-this.canvas.width ,this.canvas.height,this.canvas.width);
                            case 180: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width ,-this.canvas.height,this.canvas.width ,this.canvas.height);
                            case 270: 	this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0     				,this.canvas.height,this.canvas.width);
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

            for(let i = 0;i < this.drawList.length;i++){

                if(this.drawList[i].display==false){
                    continue;
                }

                let color = {r:0,g:170,b:0};

                if(this.drawList[i].isBroken){
                    color = {r:170,g:0,b:0};
                }

                if(this.drawList[i].isAlert){
                    color = {r:170,g:170,b:0}
                }
                let colorId = {r:this.drawList[i].SID % 256,g:parseInt(this.drawList[i].SID / 256) % 256,b:parseInt(this.drawList[i].SID / 256 / 256) % 25};

                switch(this.drawList[i].type){
                    case "move":
                            if(this.drawing){
                                this.drawMove(this.drawcontext,this.lastMovePostion,1.0,7.5,color,false,"","");
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                }
                            }

                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                this.drawMove(this.drawcontext,this.drawList[i].position[j],1.0,7.5,color,this.drawList[i].Selected,this.drawList[i].data,this.drawList[i].pointName);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],1.0,7.5,colorId);
                                
                            }
                        
                        break;
                    case "level":
                            if(this.drawing){
                                this.drawLevel(this.drawcontext,this.lastMovePostion,1.0,7.5,color,false,"","");
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                this.drawLevel(this.drawcontext,this.drawList[i].position[j],1.0,7.5,color,this.drawList[i].Selected,this.drawList[i].data,this.drawList[i].pointName);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],1.0,7.5,colorId);
                            }
                        
                        break;
                    case "force":
                            if(this.drawing){
                                this.drawForce(this.drawcontext,this.lastMovePostion,1.0,7.5,color,false,"","");
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                this.drawForce(this.drawcontext,this.drawList[i].position[j],1.0,10,color,this.drawList[i].Selected,this.drawList[i].data,this.drawList[i].pointName);
                                this.drawForce(this.drawcontextSelect,this.drawList[i].position[j],1.0,10,colorId);
                            }
                        
                        break;
                    case "slanting":
                            if(this.drawing){
                                this.drawSlanting(this.drawcontext,this.lastMovePostion,1.0,7.5,color,false,"","");
                                if(this.drawMaxCount == 2 && this.drawList[this.drawList.length - 1].position.length > 0 && this.drawCount != this.drawMaxCount){
                                    this.drawLine(this.drawcontext,this.drawList[this.drawList.length - 1].position[this.drawList[i].position.length - 1],this.lastMovePostion);
                                }
                            }
                            for(let j = 0;j<this.drawList[i].position.length;j++){
                                this.drawSlanting(this.drawcontext,this.drawList[i].position[j],1.0,7.5,color,this.drawList[i].Selected,this.drawList[i].data,this.drawList[i].pointName);
                                this.drawMove(this.drawcontextSelect,this.drawList[i].position[j],1.0,7.5,colorId);
                            }
                        
                        break;
                    case "text":
                        if(this.drawing){
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
                }
            }

            if(this.lastPostion){
                this.$refs.number_input.style.left = this.lastPostion.x * this.ResolutionScale * this.scale + "px";
                this.$refs.number_input.style.top  = this.lastPostion.y * this.ResolutionScale * this.scale + "px";
            }

            if(this.drawList.length > 0){
                if(this.drawList[this.drawList.length - 1].position.length == 2){
                    if(this.drawList[this.drawList.length - 1].type == "text"){
                        this.$refs.number_input.style.left = (this.drawList[this.drawList.length - 1].position[1].x * this.ResolutionScale * this.scale - 50) + "px";
                        this.$refs.number_input.style.top  = (this.drawList[this.drawList.length - 1].position[1].y * this.ResolutionScale * this.scale - 16) + "px";
                    }
                }
            }
        },
        drawLine(drawcontext,Start,End){
            var color_='rgb(0,0,0)';
            
            drawcontext.lineWidth=3;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();

            drawcontext.moveTo(Start.x * this.ResolutionScale * this.scale,Start.y * this.ResolutionScale * this.scale);
            drawcontext.lineTo(End.x * this.ResolutionScale * this.scale,End.y * this.ResolutionScale * this.scale);

            drawcontext.stroke();

        },
        drawMove(drawcontext,position,scale,radius,color,isSelected,data,pointName){
            
            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 50) / 2 + ',' + (color.g + 50) / 2 + ',' + (color.b + 255) / 2 + ')';
            }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();
            drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                0,
                2*Math.PI);
            drawcontext.stroke();
            drawcontext.fill();

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
        drawLevel(drawcontext,position,scale,radius,color,isSelected,data,pointName){

            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 50) / 2 + ',' + (color.g + 50) / 2 + ',' + (color.b + 255) / 2 + ')';
            }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();
            drawcontext.arc(
                position.x * this.ResolutionScale * this.scale ,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                0,
                Math.PI);
            drawcontext.stroke();
            drawcontext.fill();

            drawcontext.beginPath();
            drawcontext.arc(
                position.x * this.ResolutionScale * this.scale ,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                Math.PI,
                2 * Math.PI);
            drawcontext.stroke();

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
        drawForce(drawcontext,position,scale,radius,color,isSelected,data,pointName){
            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 50) / 2 + ',' + (color.g + 50) / 2 + ',' + (color.b + 255) / 2 + ')';
            }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.fillRect(
            position.x * this.ResolutionScale * this.scale - radius * scale,
            position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale,
            radius * scale * 2,
            radius * 0.75 * scale * 2);

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
        drawSlanting(drawcontext,position,scale,radius,color,isSelected,data,pointName){
            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 50) / 2 + ',' + (color.g + 50) / 2 + ',' + (color.b + 255) / 2 + ')';
            }
            drawcontext.lineWidth=1;
            drawcontext.fillStyle=color_;
            drawcontext.strokeStyle=color_;

            drawcontext.beginPath();
            drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
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
                radius * scale,
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
                radius * scale,
                0,
                2 * Math.PI);
            this.drawcontext.stroke();

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
        drawText(drawcontext,position_start,position_end,text,scale,color,select,isSelected){
            var color_="";
            if(!isSelected){
                color_ = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }else{
                color_ = 'rgb(' + (color.r + 50) / 2 + ',' + (color.g + 50) / 2 + ',' + (color.b + 255) / 2 + ')';
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
        create_Multiple_points(){
            this.$refs.number_input.style.display = "none";
            if(this.drawList.length > 0){
                if(this.drawList[this.drawList.length - 1].type == "text"){
                    this.drawList[this.drawList.length - 1].text = this.$refs.number_input_input.value;
                    // this.$emit('finish',null);
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

                    // this.$emit('finish',null);
                    
                }
            }

            this.Refresh();
        },
        pageSize(w,h){
            // console.log(w,h);
            this.$refs.pdfDocument.$el.style.position = ""; //  防抖
        },
        setDrawStatus(status,drawtype,drawItemId,count){
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
            this.drawing = true;

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
            }

            if(status == "text"){
                this.drawtype = "text";
            }

            this.$refs.number_input.style.display = "none";

        },
        setMoveStatus(){
            this.editStatus = "move";
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
                            typeNum:this.drawtypeNum                    //  type
                        };
            return item;
        },
        enableType(drawtype,drawItemId,status){
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
                item.pointName = this.drawList[i].pointName;
                item.type = this.drawList[i].typeNum;
                item.plotInfo = JSON.stringify(this.drawList[i]);
                
                if(item.type == 5){continue;}

                output.push(item);
            }

            return output;
        },
        loadPoints(list){
            this.drawList = [];
            this.SelectedList = [];
            // console.log(list);

            for(let i = 0;i < list.length;i++){
                
                let plotInfo = JSON.parse(list[i].plotInfo);

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
                            data:"none",
                            typeNum:list[i].type                               //  type
                        };
                this.drawList.push(item);

                this.drawID++;

            }
            this.Refresh();
            
        },
        enableLabel(status){
            this.displayLabel = status;
            this.Refresh();
        },
        changeBroken(){
            if(this.SelectedList.length > 0){
                for(let j = 0;j < this.SelectedList.length;j++){
                    this.SelectedList[j].isBroken = 0;
                }
                this.Refresh();
            }
        }
    }
}
</script>


