<template>
  <div id="picViewOutSide" ref="picViewOutSide"
  style="background-color:rgba(192,192,192,0);
  position:absolute;
  width:100%;
  height:100%;
  ">
    <div id="picView" ref="picView" style="width:100%;height:100%;overflow:hidden;position:absolute">
        <canvas id="picViewImage" style="position:absolute;top:0px;left:0px"></canvas>
        <canvas id="drawCanvas" ref="drawCanvas" style="position:absolute;top:0px;left:0px"></canvas>
    </div>

  </div>
</template>

<script>
export default {
    name:"picView",
    props:["para"],
    data(){
        return{
            old_para:'',
            Refresh_timer:0,


        }
    },
    destoryed(){
        clearInterval(this.Refresh_timer);
    },
    mounted(){
        // var vm=this;
        this.$refs.picView.style.width =this.$refs.picView.parentNode.offsetWidth+"px";
        this.$refs.picView.style.height=this.$refs.picView.parentNode.offsetHeight+"px";
        this.old_para="";
        this.Refresh_timer=setInterval(this.Refresh_timer_fun,500
        );
    },
    methods:{
        Refresh_timer_fun(){
            // console.log(this.para,'para')
            if(this.para.type == "png" || this.para.type == "jpg"){
                this.para.type = "PNG";
                if(this.para.source != this.old_para){
                    this.$refs.picViewImage.style.display = "block";
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
            this.scale_list = [0.3,0.5,0.75,0.8,1.0,1.5,2.0,3.0] //缩放比例区间
            this.scale_list_index = 4;
            this.scale = this.scale_list[this.scale_list_index];
            this.isRender = false;
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
                            if(this.angle == 0||this.angle == 180){
                                this.sub_div.style.height = this.imageSize.height+"px";
                                this.sub_div.style.width = this.imageSize.width+"px";
                                this.canvas.height = this.imageSize.height;
                                this.canvas.width = this.imageSize.width;
                                this.drawCanvas.height = this.imageSize.height;
                                this.drawCanvas.width = this.imageSize.width;
                            }else{
                                this.sub_div.style.height = this.imageSize.height+"px";
                                this.sub_div.style.width = this.imageSize.width+"px";
                                this.canvas.height = this.imageSize.height;
                                this.canvas.width = this.imageSize.width;
                                this.drawCanvas.height = this.imageSize.height;
                                this.drawCanvas.width = this.imageSize.width;
                            }
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
                            this.isRender = false;



                        }
                        

                    }
            }
        },
        Refresh(){
            if(!this.drawcontext){
                return;
            }
            this.drawcontext.clearRect(0,0,this.sub_div.offsetWidth,this.sub_div.offsetHeight);
        }


    }

}
</script>

<style>

</style>