<template>
  <div id="picViewOutSide" ref="picViewOutSide"
  style="background-color:rgba(192,192,192,0);
  position:absolute;
  width:100%;
  height:100%;
  " @mousedown="onmousedown" @mousemove="onmousemove" @mouseup="onmouseup" @wheel="onwheel" @contextmenu="oncontextmenu">
    <div id="picView" ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute;cursor:pointer">
        <canvas id="picViewImage" ref="picViewImage" style="position:absolute;top:0px;left:0px"></canvas>
        <canvas id="drawCanvas" @mousedown="oncanvasmousedown" @mouseup="oncanvasmouseup" @mousemove="oncanvasmousemove" ref="drawCanvas" style="position:absolute;top:0px;left:0px"></canvas>
        <ul id="table" class="table" ref="table" style="" v-if="tableshow" >
            <!-- <li v-for="(item,index) in station_list" :key="index" :style="{'left':changScale(rotate_XY_display(item.position).x)+'px','top':changScale(rotate_XY_display(item.position).y)+'px','position':'absolute'}" @wheel="onwheelli"> -->
            <li v-for="(item,index) in station_list" :key="index" :style="{'left':item.position.x+'px','top':item.position.y+'px','position':'absolute'}" @wheel="onwheelli">
                <ul id="tableul" >
                    <li id="tableli" style="" ><i class="el-icon-s-flag"></i>{{item.name}}</li>
                    <li id="tableli">
                        <el-row>
                            <el-col :span="4" class="tbcol">序</el-col>
                            <el-col :span="20" class="tbcol">司机</el-col>
                        </el-row>
                    </li>
                    <li id="tableli"  v-for="(item1,index1) in item.data" :key="index1">
                        <el-row>
                            <el-col :span="4" class="tbcol">{{index1+1}}</el-col>
                            <el-col :span="20" class="tbcol">{{item1.name}}</el-col>
                        </el-row>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <el-dialog
        title="当前车辆信息牌"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-card class="box-card">
            <el-row type="flex">
                <el-col :span="8"><i class="el-icon-s-flag"></i>车辆名称:</el-col>
                <el-col :span="10">{{selectVel.trafficeName}}</el-col>
                <el-col :span="6"><el-link @click="clickVel(selectVel)" type="primary">详情</el-link></el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><i class="el-icon-s-custom"></i>当前司机:</el-col>
                <el-col :span="10">{{selectVel.driverName[0]}}</el-col>
                <el-col :span="6"><el-link type="primary" @click="clickDr(selectVel)">详情</el-link></el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><i class="el-icon-s-promotion"></i>当前方向:</el-col>
                <el-col :span="10">{{selectVel.direction=='up'?'下行':'上行'}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><i class="el-icon-map-location"></i>当前位置:</el-col>
                <el-col :span="10">{{selectVel.stationRegion.start}}--{{selectVel.stationRegion.end}}</el-col>
            </el-row>
         </el-card>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span> -->
    </el-dialog>  
  </div>
</template>

<script>
var THREE = require("three");
import {stationPositionData,verhiclePositionData,stationTable,driverList} from "@/mock/drawData.js";
export default {
    name:"picView",
    props:["para"],
    data(){
        return{
            old_para:'',
            Refresh_timer:0,
            move_timer:0,
            baseColor:{r:0,g:170,b:0},
            pointScale: 1.0,
            basicScale:{
                width:1420,
                height:627
            },
            basicValue:'',
            num:0,
            station_list:stationTable,
            tableshow:true,
            dialogVisible:false,
            selectVel:{
                id:null,
                driverName:[],
                trafficeName:null,
                stationRegion:{
                    start:null,
                    end:null
                },
                direction:null
            }
        }
    },
    destoryed(){
        clearInterval(this.Refresh_timer);
    },
    created(){
        this.station_list.forEach((item)=>{
            item.data=driverList;
        })
        console.log(this.station_list,'staionlist');
    },
    mounted(){
        // var vm=this;
        this.points=stationPositionData;
        this.position_list=verhiclePositionData;
        this.basicValue=((this.$refs.picView.parentNode.offsetWidth)/(this.basicScale.width));
        // console.log(this.$refs.picView.style.width,this.basicScale.width,this.basicValue,'基础值');
        //根据不同分辨率初始化数据
        this.points.forEach((item)=>{
            item.position={x:parseInt((item.position.x)*this.basicValue),y:parseInt((item.position.y)*this.basicValue)}
            item.position_down={x:parseInt((item.position_down.x)*this.basicValue),y:parseInt((item.position_down.y)*this.basicValue)}
        });
        this.position_list.forEach((item)=>{
            item.position=this.position_listFun(this.points,item.stationRegion,item.direction)
        })
        this.station_list.forEach((item)=>{
            item.position={x:parseInt((item.position.x)*this.basicValue),y:parseInt((item.position.y)*this.basicValue)}
        })
       
        // console.log(this.station_list,"this.position_list");
        this.lastMovePostion = { x: 0, y: 0 };
        this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+"px";
        this.$refs.picView.style.height=this.$refs.picView.parentNode.offsetHeight+"px";
        this.old_para="";
        this.Refresh_timer=setInterval(this.Refresh_timer_fun,500);
        
        console.log(this.points,"this.points");
    },
    methods:{
        clickVel(){
            this.$store.commit('changeMenus','2')
            this.$router.push({
                path:'/vehicleList'
            })    
        },
        clickDr(){
            this.$router.push({
                path:'/driverList'
            })
            this.$store.commit('changeMenus','3')
        },
        handleClose(){
            this.dialogVisible=false;
        },
        beginMove(){
            // this.num=0
            this.move_timer=setInterval(this.Move_timer_fun,1000);
            // this.$emit('beginMove');
        },
        Move_timer_fun(){
           
            this.position_list.forEach((item)=>{
                
                item.stationRegion={
                    start:this.points[item.id+this.num].num,
                    end:this.points[item.id+1+this.num].num
                }
                if((item.stationRegion.start=='xzl'&&item.stationRegion.end=='hzl')||item.stationRegion.end=='xzl'&&item.stationRegion.start=='hzl'){
                   item.position=this.position_listFun(this.points,{start:'hzl',end:'shhcz'},item.direction) 
                }else{
                    item.position=this.position_listFun(this.points,item.stationRegion,item.direction)
                }
            })
            // num++
            if(this.num>this.points.length-4){
                this.num--;
            }else{
                this.num++;
            }
            console.log(this.position_list,this.num,"this.position_list");
            // this.Refresh()
            this.loadPoints();
            this.Refresh();
            // this.Refresh_timer_fun();
        },
        stopMove(){
            clearInterval(this.move_timer);
            // this.$emit('stopMove');  
        },
        resetMove(){
            this.num=0;
            this.Move_timer_fun();
            clearInterval(this.move_timer);
        },
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
                    this.init(this.$refs.picView,this.para.source,this.para.type,0);
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
                            //  this.station_list.forEach((item)=>{
                            //         item.position =this.loadPoint_calculate(item.position);
                            // })
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
        //车辆位置信息转换
        position_listFun(points,stationRegion,direction){
            var data=points.filter((item)=>{
                return item.num==stationRegion.start||item.num==stationRegion.end
            }).map((item)=>{
                
                if(direction=='up'){
                    return item.position
                }else{
                    return item.position_down
                }
            })
            return{
                x:(data.reduce((prev,cur)=>{return cur.x+prev},0))/2,
                y:(data.reduce((prev,cur)=>{return cur.y+prev},0))/2
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
                // this.drawArc(this.drawcontext,item.position_change,this.pointScale,60,'red');
                // this.drawArc(this.drawcontext,item.position_down_change,this.pointScale,60,'red');
                
            });
            //车辆轨迹路线
            this.position_list.forEach((item)=>{
                // console.log(item,'00000');
                this.drawRect(this.drawcontext,item.position_change,this.pointScale,{width:340,height:150},item.direction=='up'?"rgba(216,30,6,1)":"rgba(216,30,6,1)");
                this.drawTxt(this.drawcontext,item.position_change,this.pointScale,200,item.trafficeName);
                // let imgsrc_r='/static/images/stationIcon_right.png';
                // let imgsrc_l='/static/images/stationIcon_left.png'
                let imgsrc_r='http://103.40.192.26:10081/vehicle/static/images/stationIcon_right.png';
                let imgsrc_l='http://103.40.192.26:10081/vehicle/static/images/stationIcon_left.png'
                this.drawImg(this.drawcontext,item.position_change,this.pointScale,300,item.direction=='up'?imgsrc_r:imgsrc_l,item.direction);
            })
            this.tablescale()
            
            console.log(this.position_list,'转化的点位');

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
        drawRect(drawcontext,position_,pointscale,radius,color){
            var position = this.rotate_XY_display(position_);
            // console.log(position,position_,'22222');
            // console
            drawcontext.lineWidth = 1;
            drawcontext.fillStyle = color;
            drawcontext.strokeStyle = color;
            drawcontext.beginPath();
            // drawcontext.fillRect((position.x-radius.width*pointscale*this.scale*this.ResolutionScale*this.Koeffzient/2)*this.ResolutionScale*this.scale,
            //     (position.y-radius.height*pointscale*this.scale*this.ResolutionScale*this.Koeffzient/2)*this.ResolutionScale*this.scale,radius.width*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,radius.height*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
            drawcontext.fillRect((position.x-radius.width*pointscale*this.Koeffzient/2)*this.ResolutionScale*this.scale,
                (position.y-radius.height*pointscale*this.Koeffzient/2)*this.ResolutionScale*this.scale,radius.width*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,radius.height*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
            drawcontext.closePath();
            drawcontext.stroke();
            drawcontext.fill();

        },
        //

        //绘画图片
        drawImg(drawcontext,position_,pointscale,radius,imgsrc,direction){
            // console.log(drawcontext,'ddddd');
            var position = this.rotate_XY_display(position_);
            // drawcontext.drawImage(imgsrc,position_.x,position_.y,100,100);
            var img = new Image();
            img.src=imgsrc;
            // console.log(img,'999');
            var x_width=direction=='up'?position.x+radius*pointscale*this.Koeffzient/2:position.x-radius*pointscale*this.Koeffzient*1.5
            img.onload=(e)=>{
                // console.log(e,'eee');
                // drawcontext.drawImage(img,position.x*this.ResolutionScale*this.scale,position_.y*this.ResolutionScale*this.scale,20,20);
                // drawcontext.drawImage(img,(position.x+radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient/2)*this.ResolutionScale*this.scale,(position_.y-radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient/2)*this.ResolutionScale*this.scale, radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
                drawcontext.drawImage(img,x_width*this.ResolutionScale*this.scale,(position_.y-radius*pointscale*this.Koeffzient/2)*this.ResolutionScale*this.scale, radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
                // radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient,radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient
            }
        },
        //绘画文字
        drawTxt(drawcontext,position_,pointscale,radius,text){
            // console.log(text,'text');
            var position = this.rotate_XY_display(position_);
            // console.log(`${radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient}px`);
            var fontsize=parseInt(radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient)+'px'
            // console.log(fontsize,'fontsize');
            drawcontext.font=fontsize;
            drawcontext.fillStyle="white";
            drawcontext.textAlign="center";
            drawcontext.textBaseline ="middle"
            drawcontext.fillText(text,position.x*this.ResolutionScale*this.scale,position.y*this.ResolutionScale*this.scale);
        },
        //图表重绘制
        drawTable(){
            // this.tableshow=false;
            // console.log(this.ResolutionScale,this.scale,'ddddd');
            // this.station_list.forEach((item)=>{
            //     item.position={
            //         x:this.rotate_XY_display(item.position).x,
            //         y:this.rotate_XY_display(item.position).y
            //     }
            // })
            // console.log(this.station_list,"this.station_list");
            // this.tableshow=true;
        },
        changScale(value){
            return value*this.ResolutionScale*this.scale
        },
        //图表缩放
        tablescale(){
            console.log(this.scale,'scale00');
            this.drawTable();
            // this.$refs.table.style.transform='scale('+this.scale+')';
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
            // this.tablescale();
            this.Refresh();
        },
        onwheelli(e){
            e.stopPropagation()
            // console.log(e,'阻止冒泡')

        },
         //画布鼠标放下
        oncanvasmousedown(e){
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            // console.log(e,`{x:${e.layerX},y:${e.layerY}}`,'画布放下');
            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;
            this.lastMovePostion = {x:X,y:Y};
            console.log(e,`{x:${e.layerX},y:${e.layerY}}`,X,Y,'画布放下');
            this.drawType='arc';
            
            if(e.button==0){
                var selectColorID =this.drawcontext.getImageData(e.layerX,
              e.layerY,
              1,
              1).data;
              console.log(selectColorID,'selectColorID');
              var returndata = this.position_list.filter((item)=>{
                  return (X-20<item.position_change.x&&item.position_change.x<X+20)&&(Y-20<item.position_change.y&&item.position_change.y<Y+20)
              })
              if(returndata.length>0){
                  this.selectVel=returndata[0];
                  this.dialogVisible=true;
              }
              console.log(returndata,'returndata000');
                // console.log(`位置：${position_temp.x}`)
                
                // this.Refresh();
                return;
            }
        },
        loadPoints(){
            this.points.forEach((item)=>{
                item.position_change=this.loadPoint_calculate(item.position);
                item.position_down_change=this.loadPoint_calculate(item.position_down);
            });
            this.position_list.forEach((item)=>{
                item.position_change=this.loadPoint_calculate(item.position);
            })
            // this.station_list.forEach((item)=>{
            //     item.position =this.loadPoint_calculate(item.position);
            // })
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
            // this.sub_div.style.cursor = "pointer";
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
*{
    margin: 0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
.table{
    z-index: 1000;
    position: relative;
    // left: 60px;
    // top: 230px;
    #tableul{
        width: 7rem;
        height: 6rem;
        // background: #935458;
        background: #cccc66;
         position: absolute;
         overflow: auto;
        #tableli{
            // width: 3rem;
            height: 1rem;
            font-size: 12px;
            white-space: nowrap;
            text-align: center;
            // color: white;
            color: black;
            line-height: 1rem;
            border-bottom: 1px solid black;
            .tbcol{
                border-right: 1px solid black;
                // color: white;

            }
        }
    }
}
</style>