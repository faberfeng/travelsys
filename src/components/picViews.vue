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
            <li v-for="(item,index) in station_list" :key="index" :style="{'left':changScale(rotate_XY_display(item.position_change).x)+'px','top':changScale(rotate_XY_display(item.position_change).y)+'px','position':'absolute'}" @wheel="onwheelli">
            <!-- <li v-for="(item,index) in station_list" :key="index" :style="{'left':changScale(rotate_XY_display(item.position).x)+'px','top':changScale(rotate_XY_display(item.position).y)+'px','position':'absolute'}" @wheel="onwheelli"> -->
            <!-- <li v-for="(item,index) in station_list" :key="index" :style="{'left':item.position.x+'px','top':item.position.y+'px','position':'absolute'}" @wheel="onwheelli"> -->
                <ul id="tableul" ref="tableul" style="" v-show="(item.data.length>0||(item.num!='shnz'&&item.num!='xjh'))">
                    <li id="tableli" style="" ><i class="el-icon-s-flag"></i>{{item.name}}</li>
                    <li id="tableli">
                        <el-row>
                            <el-col :span="4" class="tbcol">序</el-col>
                            <el-col :span="20" class="tbcol">司机</el-col>
                        </el-row>
                    </li>
                    <li id="tableli"  v-for="(item1,index1) in item.data" :key="index1" @click="clickDr(item1)">
                        <el-row>
                            <el-col :span="4" class="tbcol"><i class="el-icon-s-custom"></i>{{index1+1}}</el-col>
                            <el-col :span="20" class="tbcol">{{item1.driverName}}</el-col>
                        </el-row>
                    </li>
                </ul>
            </li>
        </ul>
        <ul id="tooltipul" class="tooltipul" ref="tooltipul" style="" v-if="tooltipshow">
            <li v-for="(item,index) in position_list" :key="index" :style="{'left':changScale(rotate_XY_display(item.position_change).x)+'px','top':changScale(rotate_XY_display(item.position_change).y)+'px','position':'absolute'}" id="tooltipli" class="tooltipli" ref="tooltipli" style="">
                <el-tooltip popper-class="tps" v-if="tooltipshow" :placement="item.direction=='down'?'top':'bottom'"  :value="item.tooltipshow"  :manual="true">
                    <div slot="content" ><el-link style="color:white !important;font-size:12px" @click="clickDr(item)">{{item.driverName}}</el-link><br/><el-link style="color:white !important" @click="clickVel(item)">{{item.trafficId}}</el-link></div>
                    <!-- <el-button>Top center</el-button> -->
                    <div style="position:absolute;left:0px;top:0px;width:0px;height:0px;background:red;font-size:12px"></div>
                </el-tooltip>
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
                <el-col :span="10">{{selectVel.trafficName}}</el-col>
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
import {getVerhiclePosition,getDriverListAsync} from "@/api/commonApi.js"
import {stationPositionData,verhiclePositionData,stationTable,driverList,returnStation} from "@/mock/drawData.js";
import moment from 'moment';
export default {
    name:"picView",
    props:["para","label","iswheel","time"],
    data(){
        return{
            old_para:'',
            Refresh_timer:0,
            baseColor:{r:0,g:170,b:0},
            pointScale: 1.0,
            scaleNum:4,
            basicScale:{
                width:1420,
                height:627
            },
            basicValue:'',
            num:0,
            station_list:[],
            tableshow:false, 
            tooltipshow:false,
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
            },
            allStation:[],
            // station_list:[],
            position_list:[],
            points:[],
            selectId:[]
        }
    },
    
    created(){
        this.station_list.forEach((item)=>{
            this.allStation.push(item.num);
            // item.data=driverList;
        })
    },
    watch:{
        'label':{
            handler(newVal,oldVal){
                console.log(newVal,oldVal,'data000');
                // this.loadPoints();
                this.switchPosition();
                this.Refresh();
                console.log(newVal,'newVallable');
            }
        }
    },
    async mounted(){
        // var vm=this; 
        var datas=await this.getDriverListAsyncs(this.allStation,null);
        this.station_list=stationTable;
        this.station_list.forEach((item)=>{
            item.data=datas.filter((item1)=>{
                return item.num==item1.currentLocation.start
            })
        })
        console.log(this.station_list,datas,'staionlist');
        this.points=stationPositionData;
        // this.position_list=verhiclePositionData;
        this.position_list=await this.getVerhiclePositions();
        this.basicValue=((this.$refs.picView.parentNode.offsetWidth)/(this.basicScale.width));
        //根据不同分辨率初始化数据
        this.points.forEach((item)=>{
            item.position={x:parseInt((item.position.x)*this.basicValue),y:parseInt((item.position.y)*this.basicValue)}
            item.position_down={x:parseInt((item.position_down.x)*this.basicValue),y:parseInt((item.position_down.y)*this.basicValue)}
        });
        // this.beginMove();
        this.position_list.forEach((item)=>{
            item.position=this.position_listFun(this.points,item.stationRegion,item.direction)
        })
        // console.log(this.position_list,'this.position_list00');
        this.station_list.forEach((item)=>{
            item.position={x:parseInt((item.position.x)*this.basicValue),y:parseInt((item.position.y)*this.basicValue)}
        })
        this.lastMovePostion = { x: 0, y: 0 };
        this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+"px";
        this.$refs.picView.style.height=this.$refs.picView.parentNode.offsetHeight+"px";
        this.old_para="";
        // this.loadPoints();
        this.Refresh_timer=setInterval(this.Refresh_timer_fun,500);
        
        // console.log(this.points,"this.points");
    },
    destoryed(){
        console.log('是否消失000');
        clearInterval(this.Refresh_timer);
    },
    methods:{
        //获取司机信息
        async getDriverListAsyncs(stationName,time){
            let data={
                Time:time?moment(time).format('YYYY-MM-DD HH:mm:ss'):moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                trafficID:[], 
                driverName:[], //司机名称
                groupName:[],  //乘务组名称
                stationName:stationName?stationName:[]
            }
            return await getDriverListAsync(data);

        },
        //接口获取车辆信息
       async getVerhiclePositions(Time,trafficID){
            let data=
                {
                    "Time": Time?moment(Time).format("YYYY-MM-DD HH:mm:ss"):moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    "trafficID": trafficID?[trafficID]:[]
                }
            return  await getVerhiclePosition(data)
        },
        clickVel(item){
            this.$store.commit('changeMenus','2')
            this.$router.push({
                path:'/vehicleList',
                query:{
                    name:item.trafficId,
                    time:moment(this.time).format('YYYY-MM-DD HH:mm:ss')
                }
            })    
        },
        clickDr(item){
            
            this.$router.push({
                path:'/driverList',
                query:{
                    time:moment(this.time).format('YYYY-MM-DD HH:mm:ss'),
                    name:item.driverName,
                    
                }
            })
            this.$store.commit('changeMenus','3')
        },
        handleClose(){
            this.dialogVisible=false;
        },
        beginMove(Time){
            this.Move_timer_fun(Time)
        },
       async Move_timer_fun(Time){
            // this.position_list=[];
            this.position_list=await this.getVerhiclePositions(Time);
            if(this.position_list.length!=0){
                this.position_list.forEach((item)=>{
                    if((item.stationRegion.start=='xzl'&&item.stationRegion.end=='hzl')||item.stationRegion.end=='xzl'&&item.stationRegion.start=='hzl'){
                    item.position=this.position_listFun(this.points,{start:'hzl',end:'shhcz'},item.direction) 
                    }else{
                        item.position=this.position_listFun(this.points,item.stationRegion,item.direction)
                    }
                })
            }
            var datas=await this.getDriverListAsyncs(this.allStation,Time);
            this.station_list.forEach((item)=>{
                item.data=datas.filter((item1)=>{
                    return item.num==item1.currentLocation.start
                })
            })
            console.log(this.position_list,"this.position_list");
            this.loadPoints();
            // this.loadPointPosition();
            this.Refresh();
        },
        Refresh_timer_fun(){
            // console.log(this.para,'para3')
            if(this.para.type == "png" || this.para.type == "jpg"){
                this.para.type = "PNG";
                if(this.para.source != this.old_para){
                    console.log(this.para,'para')
                    this.$refs.picViewImage.style.display = "block";
                    // debugger;
                    this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+'px';
                    this.$refs.picView.style.height = this.$refs.picView.parentNode.offsetHeight+'px';
                    this.$refs.picView.style.left = "0px";
                    this.$refs.picView.style.top = "45px";
                    // this.$refs.picView.style.marginTop=-(this.$refs.picView.parentNode.offsetHeight/2)+'px';
                    // this.$refs.picView.style.transform = "translateY(-50%)";
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
            // this.scale_list = [0.3,0.5,0.75,0.8,1.0,1.5,2.0,3.0]
            this.scale_list = [1.0,1.0,1.0,1.0,1.0,1.5,2.0,3.0] //缩放比例区间
            this.scale_list_index = 4;
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
                            this.$emit("finish",this.isRender);
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
            if(stationRegion.start==stationRegion.end){
                return data[0]
            }else{
                return{
                    x:(data.reduce((prev,cur)=>{return cur.x+prev},0))/2,
                    y:(data.reduce((prev,cur)=>{return cur.y+prev},0))/2
                } 
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
                    // this.drawArc(this.drawcontext,this.lastMovePostion,this.pointScale,60,'red');
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
                // rgba(216,30,6,1)
                this.drawRect(this.drawcontext,item.position_change,this.pointScale,{width:400*this.scaleNum,height:280*this.scaleNum},item.direction=='up'?"rgba(225, 2, 2, 1)":"rgba(225, 2, 2, 1)");
                this.drawTxt(this.drawcontext,item.position_change,this.pointScale,180*this.scaleNum,item.trafficId);
                // let imgsrc_r='http://103.40.192.26:10081/v1/vehicle/static/images/stationIcon_right4.png';
                // let imgsrc_l='http://103.40.192.26:10081/v1/vehicle/static/images/stationIcon_left4.png';
                let imgsrc_r='/static/images/stationIcon_right5.png';
                let imgsrc_l='/static/images/stationIcon_left5.png';
                http://103.40.192.26:10081/v1/vehicle
                // let imgsrc_r='http://103.40.192.26:10081/vehicle/static/images/stationIcon_right.png';
                // let imgsrc_l='http://103.40.192.26:10081/vehicle/static/images/stationIcon_left.png'
                this.drawImg(this.drawcontext,item.position_change,this.pointScale,280*this.scaleNum,item.direction=='up'?imgsrc_r:imgsrc_l,item.direction);
            })
            //图表重绘
            this.tablescale();
            //tooltip重绘
            this.drawTooltip();
            // console.log(this.position_list,'转化的点位');
                       
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
            var fontsize=parseInt(radius*pointscale*this.scale*this.ResolutionScale*this.Koeffzient);
            var font="'"+fontsize+' '+'Calibri'+"'";
            console.log(font,fontsize,'fontsize');
            // drawcontext.setFontSize(30);
            drawcontext.font=`${fontsize}px Calibri`;
            drawcontext.fillStyle="white";
            drawcontext.textAlign="center";
            drawcontext.textBaseline ="middle"
            drawcontext.fillText(text,position.x*this.ResolutionScale*this.scale,position.y*this.ResolutionScale*this.scale);
        },
        //图表重绘制
        drawTable(){
             var vm=this;
            this.tableshow=false;
            this.tableshow=true;
            this.$nextTick(()=>{
                // console.log(vm.scale,'999');
                vm.$refs.tableul.forEach((item)=>{
                    item.style.width=100*vm.scale+'px';
                    item.style.height=100*vm.scale+'px';
                    item.style.fontSize=parseInt(12*vm.scale)+'px';
                    if(vm.scale<1){
                        item.style.transform='scale('+vm.scale+')';
                        item.style['-webkit-transform']='scale('+vm.scale+')';
                    }else{
                        item.style.transform='scale(1)';
                        item.style['-webkit-transform']='scale(1)';
                    }
                })
            })
        },
        //tooltip绘制
        drawTooltip(){
            var vm=this;
            vm.tooltipshow=false;
            vm.$nextTick(()=>{
                vm.tooltipshow=true;
            })
            
        },
        changScale(value){
            return value*this.ResolutionScale*this.scale
        },
        //图表缩放
        tablescale(){
            this.drawTable();
        },
        //最外层画布鼠标操作事件
        //鼠标点下
        onmousedown(e){
            // console.log(e,'滚轮点下')
            if(e.button == 0||e.button == 1||e.button==2){
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
                let maxX=0,maxY=0;
                let minX=this.Main_div.offsetWidth-this.sub_div.offsetWidth;
                let minY=this.Main_div.offsetHeight-this.sub_div.offsetHeight;
                //判断移动不能留白
                if(dx+this.start_canvas.x>maxX){
                    this.sub_div.style.left="0px";
                }else if(dx+this.start_canvas.x<minX){
                    this.sub_div.style.left=this.sub_div.offsetLeft+'px';
                }else{
                    this.sub_div.style.left=dx+this.start_canvas.x+"px";
                }
                if(dy+this.start_canvas.y>maxY){
                    this.sub_div.style.top="45px"
                }else if(dy+this.start_canvas.y<minY){
                    this.sub_div.style.top=this.sub_div.offsetTop+"px";
                }else{
                    this.sub_div.style.top=dy+this.start_canvas.y+"px";
                }
                // this.Refresh();
            }
            // console.log(e,'滚轮移动')
        },
        //鼠标放下
        onmouseup(e){
            this.status = "none";
            this.Refresh();

            // console.log(e,'滚轮放下')

        },
        oncontextmenu(e){
            e.preventDefault();
        },
        //滚轮事件
        onwheel(e){
            // console.log(e,'滚轮');
           if(this.iswheel){
                e.preventDefault();
                if(e.deltaY<0){
                    this.size_big()
                }else if(e.deltaY>0){
                    this.size_small()
                }
                if(this.scale==1.0){
                    this.sub_div.style.left="0px";
                    this.sub_div.style.top="45px";
                }
                // this.loadPoints();
                this.Refresh();
           } 
        },
        onwheelli(e){
            e.stopPropagation()
            // console.log(e,'阻止冒泡')

        },
         //画布鼠标放下
        oncanvasmousedown(e){
            var vm=this;
            let X = e.layerX / this.ResolutionScale / this.scale;
            let Y = e.layerY / this.ResolutionScale / this.scale;
            // console.log(e,`{x:${e.layerX},y:${e.layerY}}`,'画布放下');
            var position_temp = this.rotate_XY(X,Y);
            X = position_temp.x;
            Y = position_temp.y;
            this.lastMovePostion = {x:X,y:Y};
            console.log(e,`{x:${e.layerX},y:${e.layerY}}`,X,Y,'画布放下');
            // this.drawType='arc';
            
            if(e.button==0){
            //     var selectColorID =this.drawcontext.getImageData(e.layerX,e.layerY,1,1).data;
            //   console.log(selectColorID,'selectColorID');
              var returndata = this.position_list.filter((item)=>{
                  return (X-30<item.position_change.x&&item.position_change.x<X+30)&&(Y-30<item.position_change.y&&item.position_change.y<Y+30)
              })
               Array.prototype.indexOf = function(val) { 
                    for (var i = 0; i < this.length; i++) { 
                    if (this[i] == val) return i; 
                    } 
                    return -1; 
                }; 
              Array.prototype.remove = function(val) { 
                    var index = this.indexOf(val); 
                    if (index > -1) { 
                    this.splice(index, 1); 
                    } 
                }; 
              if(returndata.length>0){
                this.position_list.forEach((item)=>{
                    returndata.forEach((item1)=>{
                        if(item.trafficId==item1.trafficId){
                            if(item.tooltipshow){
                                if(vm.selectId.length>0){
                                    vm.selectId.remove(item.trafficId)
                                }
                            }else{
                                vm.selectId.push(item.trafficId)
                            }
                            item.tooltipshow=!item.tooltipshow
                        }
                    }) 
                })
                // this.Refresh();
              }
             this.Refresh();
            //   console.log(this.position_list,returndata,'returndata000');
                return;
            }
        },
        loadPoints(){
            var vm=this;
            this.tableshow=false;
            this.tooltipshow=false;
            this.points.forEach((item)=>{
                item.position_change=this.loadPoint_calculate(item.position);
                item.position_down_change=this.loadPoint_calculate(item.position_down);
            });
           this.loadPointPosition();
            this.station_list.forEach((item)=>{
                item.position_change =this.loadPoint_calculate(item.position);
            })
            this.tableshow=true;
            this.tooltipshow=true;
            // console.log(this.points,this.station_list,'转化的点位lllll');
        },
        loadPointPosition(){
            var vm=this;
             this.position_list.forEach((item)=>{
                item.position_change=vm.loadPoint_calculate(item.position);
                item.tooltipshow=false;
                vm.selectId.forEach((item1)=>{
                        if(item.trafficId==item1){
                            // console.log(item.trafficId,'111');
                            item.tooltipshow=true;
                        }
                })
            })
            // console.log(this.position_list,'ooooo');
        },
       switchPosition(){
           var vm=this;
           console.log(this.position_list,"this.position_list");
           if(vm.label){
               this.position_list.forEach((item)=>{
                   vm.selectId.push(item.trafficId)
               })
           }else{
               vm.selectId=[]
           }
           this.loadPointPosition();
           console.log(vm.selectId,'vm.selectId');
       },
        //加载点位转换
        loadPoint_calculate(e){
            // / this.scale
            let X = e.x / this.ResolutionScale;
            let Y = e.y / this.ResolutionScale;
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
        size_small(index){
            console.log(index,'index000');
            switch(this.type){
                case "PNG":
                    this.scale_before = this.scale;
                    this.start_canvas.x = this.sub_div.offsetLeft;
                    this.start_canvas.y = this.sub_div.offsetTop;
                    this.start_canvas.w = this.sub_div.offsetWidth;
                    this.start_canvas.h = this.sub_div.offsetHeight;
                    this.scale_list_index=index?index:this.scale_list_index;
                    console.log(this.scale_list_index,'index000');
                    if(this.scale_list_index-1>0){
                        this.scale_list_index--;
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
    #tableul{
        width: 100px;
        height: 130px;
        // background: #935458;
        // background: #cccc66;
        background: linear-gradient(0deg, rgba(17, 133, 240, 0) -2.72%, rgba(31, 106, 255, 0.2) 100%);
         position: absolute;
         overflow: auto;
         font-size: 12px;
         border:1px solid rgba(17, 133, 240, 1);
         padding: 10px;
        #tableli{
            white-space: nowrap;
            text-align: center;
            // color: white;
            color: white;
            line-height: 24px;
            border-bottom: 1px dashed white;
            .tbcol{
                // border-right: 1px solid black;
                // color: white;

            }
        }
    }
}
.tooltipul{
    position: relative;
    z-index: 1001;
    .tooltipli{
        position: absolute;
        // .tps{
        //     background: rgb(89,49,53) !important;
        // }
        
    }
}
// /deep/ .tps .el-tooltip__popper .is-dark{
//         background: rgb(89,49,53) !important;
//         color: #FFF;
//         border: 1px solid rgb(254,211,105) !important;
    
// }
// ::v-deep(.el-tooltip__popper .is-dark){
    
// }
// /deep/ .el-tooltip__popper .is-dark{
        
// }
</style>