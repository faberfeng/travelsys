<template>
    <div ref="picViewOutSide" style="background-color:rgba(192,192,192,1);position:absolute;width:100%;height:100%" @mousedown="onmousedown" @contextmenu="oncontextmenu" @mousemove="onmousemove" @mouseup="onmouseup" @wheel="onwheel">
        <div ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute">            
            <pdf id="pdfD" ref="pdfDocument" @loaded="load" @page-size="pageSize" :src="url" ></pdf>
            <canvas ref="picViewImage"  style="position:absolute;top:0px;left:0px"></canvas>
            <canvas ref="drawCanvas" id="drawCanvas" style="position:absolute;top:0px;left:0px" @mousedown="oncanvasmousedown"></canvas>
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
    mounted(){
        
        this.drawStatus = "none";
        this.moveElement = false;
        this.ResolutionScale = 1.0;
        this.drawCount = 1;
        this.drawList = [];

        this.$refs.picView.style.width = this.$refs.picView.parentNode.offsetWidth + "px";
        this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight + "px";
        this.old_para = "";

        this.drawID = 0;

        setInterval(()=>{

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

                    this.old_para = this.para.source;
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
           


            
        },1000);
        

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
            this.drawcontext = this.drawCanvas.getContext('2d');

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
                        let a = setTimeout(()=>{
                            this.ResolutionScale = this.$refs.pdfDocument.pdf.getResolutionScale();
                            console.log(this.$refs.pdfDocument);
                            console.log(this.ResolutionScale);
                        },1000);
                        this.type = type;
                        
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
                                
                            }else{
                                this.sub_div.height = this.imageSize.width;
                                this.sub_div.width = this.imageSize.height;
                                this.canvas.height = this.imageSize.width;
                                this.canvas.width = this.imageSize.height;
                                this.drawCanvas.height = this.imageSize.width;
                                this.drawCanvas.width = this.imageSize.height;
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
                clearInterval(timer);
            },200);

            this.$refs.pdfDocument.$el.style.position = "";

            this.init(this.$refs.picView,this.para.source,this.para.type,1,0);
            
        },
        oncanvasmousedown(e){
            // console.log(e.layerX / this.ResolutionScale / this.scale,e.layerY / this.ResolutionScale / this.scale);
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            if(e.button == 0){
                if(this.moveElement){   //  移动标记

                }else{  //  绘制标记
                    if(this.drawCount > 0){
                        this.drawCount--;
                        
                        let find = false;

                        for(let i = 0;i < this.drawList.length;i++){
                            if(this.drawList[i].SID == this.drawID){
                                find = true;
                                this.drawList[i].position.push({x:X,y:Y});
                            }
                        }

                        if(find == false){this.drawList.push({SID:this.drawID,type:this.drawtype,position:[{x:X,y:Y}],count:1});}
                                
                        if(this.drawCount == 0){
                            if(this.drawList[this.drawList.length - 1].position.length == 2){
                                this.$refs.number_input.style.left = this.drawList[this.drawList.length - 1].position[1].x * this.ResolutionScale * this.scale + "px";
                                this.$refs.number_input.style.top  = this.drawList[this.drawList.length - 1].position[1].y * this.ResolutionScale * this.scale + "px"
                                this.$refs.number_input.style.display = "block";
                            }
                            this.drawID++;
                        }

                        this.Refresh();
                    }
                }
            }
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
            // console.log(e);

            // 

            if(e.button == 1){
                e.preventDefault();
                this.start_canvas.x = this.sub_div.offsetLeft;
                this.start_canvas.y = this.sub_div.offsetTop;
                this.start.x = e.screenX;
                this.start.y = e.screenY;
                this.status = "start_move";
            }
            // this.$emit('status_changed',this.status);
        },
        onmouseup(e){
            // console.log(e);
            this.status = "none";
        },
        onwheel(e){

            e.preventDefault();
            // console.log(e);
            
            if(e.deltaY < 0){
                this.size_big();
            }else if(e.deltaY > 0){
                this.size_small();

            }
            this.Refresh();
            
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
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width = this.imageSize.height + "px";
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
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
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width  = this.imageSize.height + "px";
                            this.canvas.height = this.imageSize.width;
                            this.canvas.width = this.imageSize.height;
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                        }

                        this.position_calculate();

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
                    }else{
                        this.sub_div.style.height = this.imageSize.width + "px";
                        this.sub_div.style.width = this.imageSize.height + "px";
                        this.drawCanvas.height = this.imageSize.width;
                        this.drawCanvas.width = this.imageSize.height;
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
                        }else{
                            this.sub_div.style.height = this.imageSize.width + "px";
                            this.sub_div.style.width  = this.imageSize.height + "px";
                            this.canvas.height = this.imageSize.width;
                            this.canvas.width = this.imageSize.height;
                            this.drawCanvas.height = this.imageSize.width;
                            this.drawCanvas.width = this.imageSize.height;
                        }

                        this.position_calculate();

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
        setDrawStatus(status,drawtype,count){
            this.status = "none";
            this.drawStatus = status;
            this.drawtype = "";
            this.moveElement = false;
            this.drawCount = count

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

            this.create_Multiple_points();

        },
        Refresh(){
            console.log(this.drawList)
            for(let i = 0;i < this.drawList.length;i++){

                let color = "#00CC00";

                let pointsArray = [];
                if(this.drawList[i].position.length == 2){
                    let dir = new THREE.Vector2(this.drawList[i].position[1].x - this.drawList[i].position[0].x,this.drawList[i].position[1].y - this.drawList[i].position[0].y);
                    let length = dir.length();
                    dir.normalize();

                    length /= this.drawList[i].count;

                    for(let j = 1; j < this.drawList[i].count;j++){
                        pointsArray.push({x:this.drawList[i].position[0].x + dir.x * length * j,y:this.drawList[i].position[0].y + dir.y * length * j});
                    }
                }

                switch(this.drawList[i].type){
                    case "move":
                        for(let j = 0;j<this.drawList[i].position.length;j++){this.drawMove(this.drawList[i].position[j],1.0,7.5,color);}
                        for(let j = 0;j<pointsArray.length;j++){this.drawMove(pointsArray[j],1.0,7.5,color);};
                        break;
                    case "level":
                        for(let j = 0;j<this.drawList[i].position.length;j++){this.drawLevel(this.drawList[i].position[j],1.0,7.5,color);}
                        for(let j = 0;j<pointsArray.length;j++){this.drawLevel(pointsArray[j],1.0,7.5,color);};
                        break;
                    case "force":
                        for(let j = 0;j<this.drawList[i].position.length;j++){this.drawForce(this.drawList[i].position[j],1.0,10,color);}
                        for(let j = 0;j<pointsArray.length;j++){this.drawForce(pointsArray[j],1.0,10,color);};
                        break;
                    case "slanting":
                        for(let j = 0;j<this.drawList[i].position.length;j++){this.drawSlanting(this.drawList[i].position[j],1.0,7.5,color);}
                        for(let j = 0;j<pointsArray.length;j++){this.drawSlanting(pointsArray[j],1.0,7.5,color);};
                        break;
                }
            }

            if(this.drawList.length > 0)
            if(this.drawList[this.drawList.length - 1].position.length == 2){
                this.$refs.number_input.style.left = this.drawList[this.drawList.length - 1].position[1].x * this.ResolutionScale * this.scale + "px";
                this.$refs.number_input.style.top  = this.drawList[this.drawList.length - 1].position[1].y * this.ResolutionScale * this.scale + "px"
            }
        },
        drawMove(position,scale,radius,color){

            this.drawcontext.fillStyle=color;
            this.drawcontext.strokeStyle=color;

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                0,
                2*Math.PI);
            this.drawcontext.stroke();
            this.drawcontext.fill();
        },
        drawLevel(position,scale,radius,color){

            this.drawcontext.fillStyle=color;
            this.drawcontext.strokeStyle=color;

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale ,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                0,
                Math.PI);
            this.drawcontext.stroke();
            this.drawcontext.fill();

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale ,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                Math.PI,
                2 * Math.PI);
            this.drawcontext.stroke();
        },
        drawForce(position,scale,radius,color){

            this.drawcontext.fillStyle=color;
            this.drawcontext.strokeStyle=color;

            this.drawcontext.fillRect(
            position.x * this.ResolutionScale * this.scale - radius * scale,
            position.y * this.ResolutionScale * this.scale - radius * 0.75 * scale,
            radius * scale * 2,
            radius * 0.75 * scale * 2);
        },
        drawSlanting(position,scale,radius,color){
            this.drawcontext.fillStyle=color;
            this.drawcontext.strokeStyle=color;

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                Math.PI / 2,
                Math.PI);
            this.drawcontext.lineTo(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale);
            this.drawcontext.stroke();
            this.drawcontext.fill();

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                Math.PI / 2 * 3,
                2 * Math.PI);
            this.drawcontext.lineTo(
                position.x * this.ResolutionScale * this.scale,
                position.y * this.ResolutionScale * this.scale);
            this.drawcontext.stroke();
            this.drawcontext.fill();

            this.drawcontext.beginPath();
            this.drawcontext.arc(
                position.x * this.ResolutionScale * this.scale ,
                position.y * this.ResolutionScale * this.scale,
                radius * scale,
                0,
                2 * Math.PI);
            this.drawcontext.stroke();
        },
        create_Multiple_points(){
            this.$refs.number_input.style.display = "none";

            if(this.drawList.length > 0){
                let count = 6;
                try{
                    count = parseInt(this.$refs.number_input_input.value);
                    
                }catch(e){
                    count = 6;
                }

                if(isNaN(count)){
                    count = 6;
                }

                this.drawList[this.drawList.length - 1].count = count;
            }

            this.Refresh();
        },
        pageSize(w,h){
            console.log(w,h);
        }
    }
}
</script>


