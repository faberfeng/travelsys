<template>
  <div id="picViewOutSide" ref="picViewOutSide"
  style="background-color:rgba(192,192,192,0);
  position:absolute;
  width:100%;
  height:100%;
  " @mousedown="onmousedown" @mousemove="onmousemove" @mouseup="onmouseup" @wheel="onwheel" @contextmenu="oncontextmenu" >
    <div id="picView" ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute">
        <canvas id="picViewImage" ref="picViewImage" style="position:absolute;top:0px;left:0px"></canvas>
        <canvas id="drawCanvas" @mousedown="oncanvasmousedown" @mouseup="oncanvasmouseup" @mousemove="oncanvasmousemove" ref="drawCanvas" style="position:absolute;top:0px;left:0px"></canvas>
        <div id="table" class="table" ref="table" style="">
            <ul id="tableul" style="">
                <li id="tableli" style=""></li>
            </ul>
        </div>
    </div>
    
    
  </div>
</template>

<script>
var THREE = require("three");
import {stationPositionData} from "@/mock/drawData.js";
export default {
    name:"picView",
    props:["para"],
    data(){
        return{
            old_para:'',
            Refresh_timer:0,
            baseColor:{r:0,g:170,b:0},
            pointScale: 1.0,
        }
    },
    destoryed(){
        clearInterval(this.Refresh_timer);
    },
    mounted(){
        // var vm=this;
       
        this.points=stationPositionData;
         console.log(this.points,stationPositionData,'data');
        this.lastMovePostion = { x: 0, y: 0 };
        this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+"px";
        this.$refs.picView.style.height=this.$refs.picView.parentNode.offsetHeight+"px";
        this.old_para="";
        this.Refresh_timer=setInterval(this.Refresh_timer_fun,500);
    },
    methods:{
        Refresh_timer_fun(){
            // console.log(this.para,'para')
            if(this.para.type == "png" || this.para.type == "jpg"){
                this.para.type = "PNG";
                if(this.para.source != this.old_para){
                    console.log(this.para,'para')
                    this.$refs.picViewImage.style.display = "block";
                    
                    // debugger;
                    this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+'px';
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight+'px';
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "0px";
                    if(this.para.angle != undefined){
                        this.angle = parseInt(this.para.angle);
                    }
                    this.init(this.$refs.picView,this.para.source,this.para.type,0)
                    this.old_para = this.para.source;
                    
                }
            }
        },
        //初始化图片
        init(div,source,type,angle){
            this.Koeffzient = 0.1;
            this.scale_list = [0.3,0.5,0.75,0.8,1.0,1.5,2.0,3.0] //缩放比例区间
            this.scale_list_index = 4;
            this.scale_table_index=4;
            this.scale_table=this.scale_list[this.scale_table_index];
            this.scale = this.scale_list[this.scale_list_index];
            this.isRender = false;
            this.status = "none";
            this.start ={x:0,y:0};
            this.start_canvas = {x:0,y:0};
            this.image = new Image();
            this.drawCanvas = this.$refs.drawCanvas;
            this.drawcontext = this.drawCanvas.getContext("2d");
            //判断何种类型渲染
            switch(type){
                case "PNG":
                    /////////////图片//////////////
                    {
                        this.Main_div =this.$refs.picViewOutSide;
                        this.Main_div.style.overflow="hidden";
                        this.sub_div = this.$refs.picView;
                        this.sub_div.style.position="absolute";
                        this.canvas = this.$refs.picViewImage;
                        this.type =type;
                        this.isRender = true;
                        this.image.src =source;
                        this.image.onload = (e)=>{
                            var vm=this;
                            //分辩率刻度
                            this.ResolutionScale=(1.0*this.sub_div.offsetWidth)/this.image.width;
                            this.oldImageSize = {
                                width:this.sub_div.offsetWidth,
                                height:this.sub_div.offsetWidth*(this.image.height/this.image.width)
                            };
                            this.imageSize = {
                                width:this.oldImageSize.width*this.scale,
                                height:this.oldImageSize.height*this.scale
                            };
                            console.log(this.imageSize,'imageSize')
                            this.initByangle();
                            this.context = this.canvas.getContext("2d");
                            this.context.rotate((this.angle*Math.PI)/180);
                            switch(this.angle){
                                case 0:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.canvas.width,this.canvas.height);
                                    break;
                                case 90:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,-this.canvas.width,this.canvas.height,this.canvas.width);
                                    break;
                                case 180:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width,-this.canvas.height,this.canvas.width,this.canvas.height);
                                    break;
                                case 270:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0,this.canvas.height,this.canvas.width);
                                    break;
                            }
                             this.loadPoints();
                             this.Refresh();
                            this.isRender = false;
                        }
                        break;

                    }
            }
            
        },
        //根据角度初始化公共方法
        initByangle(){
            if(this.angle == 0||this.angle == 180){
                this.sub_div.style.height = this.imageSize.height+"px";
                this.sub_div.style.width = this.imageSize.width+"px";
                this.canvas.height = this.imageSize.height;
                this.canvas.width = this.imageSize.width;
                this.drawCanvas.height = this.imageSize.height;
                this.drawCanvas.width = this.imageSize.width;
            }else{
                this.sub_div.style.height = this.imageSize.width + "px";
                this.sub_div.style.width = this.imageSize.height + "px";
                this.canvas.height = this.imageSize.width;
                this.canvas.width = this.imageSize.height;
                this.drawCanvas.height = this.imageSize.width;
                this.drawCanvas.width = this.imageSize.height;
            }
        },
        //清理画布
        Refresh(){
            if(!this.drawcontext){
                return;
            }
            this.drawcontext.clearRect(0,0,this.sub_div.offsetWidth,this.sub_div.offsetHeight);
            switch(this.drawType){
                case "rect":
                    break;
                case "arc":
                    console.log(this.drawType,'this.drawType');
                    this.drawArc(this.drawcontext,this.lastMovePostion,this.pointScale,60,'red');
                    break;
                case "img":
                    break;
            }
            this.points.forEach((item)=>{
                // item.position_change=this.loadPoint(item.position);
                // item.position_down_change=this.loadPoint(item.position_down);
                this.drawArc(this.drawcontext,item.position_change,this.pointScale,60,'red');
                this.drawArc(this.drawcontext,item.position_down_change,this.pointScale,60,'red');
            });
            // console.log(this.points,'转化的点位');

        },
        
        //绘画圆点
        drawArc(drawcontext,position_,pointscale,radius,color){
            var position = this.rotate_XY_display(position_);
            // console.log(drawcontext,position_,pointscale,radius,color,position.x,position.y,'dada');
            drawcontext.lineWidth = 1;
            drawcontext.fillStyle = color;
            drawcontext.strokeStyle = color;
            drawcontext.beginPath();
            // console.log(radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
            drawcontext.arc(
                position.x*this.ResolutionScale*this.scale,
                position.y*this.ResolutionScale*this.scale,
                radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,
                0,
                2*Math.PI,
                true
            );
            drawcontext.closePath();
            drawcontext.stroke();
            drawcontext.fill();
        },


        //绘画正方小方块
        drawRect(drawcontext,position_,x){

        },
        //最外层画布鼠标操作事件
        //鼠标点下
        onmousedown(e){
            // console.log(e,'滚轮点下')
            if(e.button == 1||e.button==2){
                e.preventDefault();
                this.start_canvas.x=this.sub_div.offsetLeft;
                this.start_canvas.y=this.sub_div.offsetTop;
                this.start.x=e.screenX;
                this.start.y=e.screenY;
                this.status = "start_move";
            }
        },
        //鼠标拖住移动
        onmousemove(e){
            if(this.status == "start_move"){
                let dx = e.screenX-this.start.x;
                let dy = e.screenY-this.start.y;
                this.sub_div.style.left=dx+this.start_canvas.x+"px";
                this.sub_div.style.top=dy+this.start_canvas.y+"px";
            }
            // console.log(e,'滚轮移动')
        },
        //鼠标放下
        onmouseup(e){
            this.status = "none";
            // console.log(e,'滚轮放下')

        },
        oncontextmenu(e){
            e.preventDefault();
        },
        //滚轮事件
        onwheel(e){
            // console.log(e,'滚轮');
            e.preventDefault();
            if(e.deltaY<0){
                this.size_big()
            }else if(e.deltaY>0){
                this.size_small()
            }
            this.tablescale();
            this.Refresh();
        },
         //画布鼠标放下
        oncanvasmousedown(e){
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            console.log(e,`{x:${e.layerX},y:${e.layerY}}`,'画布放下');
            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;
            this.lastMovePostion = {x:X,y:Y};
            this.drawType='arc';
            if(e.button==0){
                // console.log(`位置：${position_temp.x}`)
                this.sub_div.style.cursor = "default";
                this.Refresh();
                return;
            }
        },
        loadPoints(){
            this.points.forEach((item)=>{
                item.position_change=this.loadPoint_calculate(item.position);
                item.position_down_change=this.loadPoint_calculate(item.position_down);
            });
            console.log(this.points,'转化的点位');
        },
        //加载点位转换
        loadPoint_calculate(e){
            let X = e.x / this.ResolutionScale / this.scale;
            let Y = e.y / this.ResolutionScale / this.scale;
            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;
            return {x:X,y:Y}
        },
        //画布移动
        oncanvasmousemove(e){

        },
        //画布鼠标拿起
        oncanvasmouseup(e){

        },
        rotate_XY(x, y) {
                var X = x;
                var Y = y;

                var Temp_Size = {
                    width: this.oldImageSize.width / this.ResolutionScale,
                    height: this.oldImageSize.height / this.ResolutionScale,
                };
                switch (this.angle) {
                    case 0:
                    break;
                    case 90:
                    X -= Temp_Size.height;
                    break;
                    case 180:
                    X -= Temp_Size.width;
                    Y -= Temp_Size.height;
                    break;
                    case 270:
                    Y -= Temp_Size.width;
                    break;
                }

                var m = new THREE.Matrix4();
                m.makeRotationZ((-this.angle / 180) * Math.PI);
                var V = new THREE.Vector3(X, Y, 0);

                V.applyMatrix4(m);

                X = V.x;
                Y = V.y;

                return { x: X, y: Y };
        },
        rotate_XY_display(position) {
            var X = position.x;
            var Y = position.y;

            var m = new THREE.Matrix4();
            m.makeRotationZ((this.angle / 180) * Math.PI);
            var V = new THREE.Vector3(X, Y, 0);

            V.applyMatrix4(m);

            X = V.x;
            Y = V.y;

            if (this.oldImageSize == undefined) {
                return { x: X, y: Y };
            }

            var Temp_Size = {
                width: this.oldImageSize.width / this.ResolutionScale,
                height: this.oldImageSize.height / this.ResolutionScale,
            };
            switch (this.angle) {
                case 0:
                break;
                case 90:
                X += Temp_Size.height;
                break;
                case 180:
                X += Temp_Size.width;
                Y += Temp_Size.height;
                break;
                case 270:
                Y += Temp_Size.width;
                break;
            }

            return { x: X, y: Y };
        },
        //放大
        size_big(){
            switch(this.type){
                case "PNG":
                    this.scale_before = this.scale;
                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;
                    if(this.scale_list_index+1<this.scale_list.length){
                        this.scale_list_index++;
                        this.scale_table_index--;
                        this.scale_table=this.scale_list[this.scale_table_index];
                        this.scale=this.scale_list[this.scale_list_index];
                        this.imageSize={
                            width:this.oldImageSize.width*this.scale,
                            height:this.oldImageSize.height*this.scale
                        }
                        //根据角度初始化画布
                        this.initByangle();
                        //位置计算
                        this.position_calculate();
                        this.context = this.canvas.getContext("2d");
                        this.context.rotate((this.angle*Math.PI)/180);
                        switch(this.angle){
                                case 0:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.canvas.width,this.canvas.height);
                                    break;
                                case 90:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,-this.canvas.width,this.canvas.height,this.canvas.width);
                                    break;
                                case 180:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width,-this.canvas.height,this.canvas.width,this.canvas.height);
                                    break;
                                case 270:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0,this.canvas.height,this.canvas.width);
                                    break;
                            }
                    }
                    break;
            }
        },
        //缩小
        size_small(){
            switch(this.type){
                case "PNG":
                    this.scale_before = this.scale;
                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;
                    if(this.scale_list_index-1>0){
                        this.scale_list_index--;
                        this.scale_table_index++;
                        this.scale_table=this.scale_list[this.scale_table_index];
                        this.scale=this.scale_list[this.scale_list_index];
                        this.imageSize={
                            width:this.oldImageSize.width*this.scale,
                            height:this.oldImageSize.height*this.scale
                        }
                        //根据角度初始化画布
                        this.initByangle();
                        //位置计算
                        this.position_calculate();
                        this.context = this.canvas.getContext("2d");
                        this.context.rotate((this.angle*Math.PI)/180);
                        switch(this.angle){
                                case 0:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,0,this.canvas.width,this.canvas.height);
                                    break;
                                case 90:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,0,-this.canvas.width,this.canvas.height,this.canvas.width);
                                    break;
                                case 180:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.width,-this.canvas.height,this.canvas.width,this.canvas.height);
                                    break;
                                case 270:
                                    this.context.drawImage(this.image,0,0,this.image.width,this.image.height,-this.canvas.height,0,this.canvas.height,this.canvas.width);
                                    break;
                            }
                    }
                    break;
            }
        },
        tablescale(){
            console.log(this.scale,'scale00');
            this.$refs.table.style.transform='scale('+this.scale+')';
        },
        //位置计算
        position_calculate(){
            var Center_div ={
                x:this.Main_div.offsetWidth/2,
                y:this.Main_div.offsetHeight/2
            };

            ////////////////////////////////////////
            var Center_before ={
                x:this.start_canvas.x + this.start_canvas.w/2,
                y:this.start_canvas.y + this.start_canvas.h/2,
            };
            var Center_now = {
                x:this.sub_div.offsetLeft + this.sub_div.offsetWidth/2,
                y:this.sub_div.offsetTop + this.sub_div.offsetHeight/2,
            }
            var Vector_before = new THREE.Vector2(
                Center_before.x-Center_div.x,
                Center_before.y-Center_div.y
            )
            var Vector_now = new THREE.Vector2(
                Center_now.x-Center_div.x,
                Center_now.y-Center_div.y
            )
            var Vector_before_dir = new THREE.Vector2(
                Center_before.x-Center_div.x,
                Center_before.y-Center_div.y
            );
            Vector_before_dir.normalize();
            var Vector_before_length = Vector_before.length();
            var Vector = new THREE.Vector2(
                Vector_before_dir.x*((Vector_before_length*this.scale)/this.scale_before),
                Vector_before_dir.y*((Vector_before_length*this.scale)/this.scale_before)
            )
            var Vector_D = new THREE.Vector2(
                Vector_now.x - Vector.x,
                Vector_now.y - Vector.y
            );
            // console.log(`之前:${Vector_before.length()},现在:${Vector_now.normalize()},绝对:${Vector},目标:${Vector_D}`)
            this.sub_div.style.left = this.sub_div.offsetLeft - Vector_D.x +"px";
            this.sub_div.style.top = this.sub_div.offsetTop-Vector_D.y+"px";
        },
        //


    }

}
</script>

<style lang="less" scoped>
.table{
    width: 3rem;
    height: 3rem;
    background: red;
    z-index: 1000;
    position: absolute;
    // left: 60px;
    // top: 230px;
}
</style>