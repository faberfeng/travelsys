<template>
  <!-- style="overflow: hidden; left: 20px" -->
  <div id="drawingPic" style="overflow: hidden;">
    <sidebar></sidebar>
    <!-- <el-button @click="switchType">切换</el-button> -->
     <!-- v-loading="loading" -->
    <picView
     
      ref="pic"
      @load_points="loadPic"
      @finish="drawFinish"
      @status_changed="picView_status_changed"
      :para="paraList"
      :label="switchvalue"
      :iswheel="startshow"
      :time="time"
    ></picView>
    <div class="tooltxt" v-show="!showtool">
      <span style="color:white;z-index:2;;margin-top:5px">展开工具箱</span>
      <img id="downimg" @mousemove="imgmove"   :src="require('@/assets/rectangle.png')">
      <img id="downimg" style="color:white;z-index:1;margin-top:25px" @mousemove="imgmove"  :src="require('@/assets/rondown.png')">
    </div>
    <!-- <i class="el-icon-arrow-down" style="color:white;font-size:30px"></i> -->
    <div @mousemove="toolmove"  @mouseleave="toolover">
    <el-row id="drawingrow" v-show="showtool"    style="">
      <el-col :span="24">
              <i class="el-icon-circle-close iclose" @click="closeTool"></i>
              <!-- <i v-show="startshow" style="fontSize:18px;margin:auto 10px;cursor:pointer;" @click="bigsize" class="el-icon-zoom-in"></i>
              <i v-show="startshow" style="fontSize:18px;margin:0px 20px 0px 10px;cursor:pointer" @click="smallsize" class="el-icon-zoom-out"></i> -->
              <span class="spantxt">时间:</span>
              <el-date-picker
              style="width:172px"
                v-model="time"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                size="mini"
                :disabled="!startshow"
                @change="timechange"
                :picker-options="pickerOptions">
              </el-date-picker>
              <!-- &&startshow -->
              <el-tag size="small" class="iconcolor" style="cursor:pointer"  @click="backTime(1)">-1</el-tag>
              <el-tag size="small" class="iconcolor" style="cursor:pointer"  @click="backTime(5)">-5</el-tag>
              <span v-if="isSpeed" class="spantxt" style="margin-left:12px">倍速:</span>
              <el-input-number v-if="isSpeed" :precision="1" :step="0.5" size="mini" v-model="speednum" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
              <el-button style="margin-left:10px" v-show="startshow" type="success" icon="el-icon-video-play" size="mini" @click="startMove">开始</el-button>
              <el-button v-show="!startshow" class="iconcolor" type="danger" icon="el-icon-video-pause" size="mini" @click="endMove">停止</el-button>
              <el-button type="info" class="iconcolor" icon="el-icon-refresh-right" size="mini" @click="resetMove">重置</el-button>
              <el-switch
                style="margin-left:30px"
                v-model="switchvalue"
                active-text="显示标签"
                inactive-text="隐藏标签"
                @change="changswitch"
                >
                <!-- active-color="#13ce66"
                inactive-color="#ff4949" -->
              </el-switch>
        </el-col>
      <!-- <el-col :span="12">
          <el-button v-show="startshow" type="success" icon="el-icon-video-play" size="mini" @click="startMove">开始</el-button>
          <el-button v-show="!startshow" type="danger" icon="el-icon-video-pause" size="mini" @click="endMove">结束</el-button>
          <el-button type="info" icon="el-icon-refresh-right" size="mini" @click="resetMove">重置</el-button>
          <el-switch
            style="margin-left:60px"
            v-model="switchvalue"
            active-text="显示标签"
            inactive-text="隐藏标签"
            @change="changswitch"
            >
          </el-switch>
        </el-col> -->
    </el-row>
    </div>
  </div>
  
</template>

<script>
import moment from "moment";
import picView from "@/components/picViews.vue";
import sidebar from "./siderbar.vue"
export default {
  name: "review",
  components: {
    picView,
    sidebar
  },
  data() {
    return {
      showtool:true,
      paraList: {},
      loading:true,
      ispic:false,
      startshow:true,
      speed:0,
      speednum:1,
      speedgap:1000, //ms 1s=1000ms
      move_timer:0,
      isSpeed:false,
      time:new Date(),
      picktime:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      switchvalue:false,

    };
  },
  create() {
   
    
  },
  watch:{
    'time':{
      handler(newVal,oldVal){
        var vm=this;
        if(newVal<new Date(new Date().getTime()-100)){
          this.isSpeed=true;
          this.speedgap=15000;
        }else if(newVal>new Date(new Date().getTime()-100)){
          // this.resetMove();
          // vm.time=new Date();
          // vm.$set(vm.time,new Date())
          this.isSpeed=false;
          // vm.$nextTick(()=>{
          //   if(newVal!=new Date()){
          //    vm.time=new Date();
          //   }
          // })
          this.speednum=1;
          this.speedgap=2000;
         
          console.log(newVal,'newVal000');
        }
      }
    },
    'speednum':{
      handler(newVal,oldVal){
        var vm=this;
        vm.speed =this.speedgap*this.speednum;
        if(vm.time>new Date()){
          vm.time=new Date()
        }
      }
    }
  },
  mounted() {
    // this.paraList = {
    //   type: "png",
    //   source: "/static/images/12.jpg",
    //   angle: 0,
    // };
    this.$nextTick(()=>{
       var data1= document.getElementById('header').offsetHeight;
    var data2=document.getElementById('picView').offsetHeight;
    console.log(data1,data2,'data0001111');

    })
   
    // document.getElementById('drawingrow').style.top=data2+'px';
    
    this.paraList = {
      type: "png",
      // source:"2",
      source: "/static/images/bgdata1.png",
      // source: "http://103.40.192.26:10081/v1/vehicle/static/images/stationpic.png",
      // source:"http://103.40.192.26:10081/vehicle/static/images/stationpic.png",
      angle: 0,
    };

    
  },
  destroyed(){
    this.endMove();
    window.location.reload();
    console.log('是否消失00099');
  },
  methods: {
    imgmove(e){
      this.showtool=true;
    },
    toolmove(e){
      this.showtool=true;
    },
    closeTool(){
      this.showtool=false;
    },
    toolover(e){
      // this.showtool=false;
    },
    loadPic() {
      this.$refs.pic.Max_Select = 1;
    },
    drawFinish(data){
      // console.log(data,'ddddd');
      this.loading=data;
      if(!this.loading){
        this.resetMove()
      }
    },
    picView_status_changed() {},
    switchType(){
      if(this.ispic){
        this.paraList = {
          type: "pdf",
          source: "/static/images/A1.pdf",
          angle: 0,
        };
      }else{
        this.paraList = {
          type: "png",
          source: "/static/images/station.jpg",
          angle: 0,
        };
      }
      this.ispic=!this.ispic
    },
    handleChange(value){

    },
    //时间改变
    timechange(){
      if(this.time<new Date()){
        console.log(this.time,'time');
          this.isSpeed=true;
        }else{
          this.isSpeed=false;
        }
    },
    //回退时间
    backTime(data){
      this.time=new Date(this.time.getTime()-data*60*1000);
    },
    //开始
    startMove(){
      var vm=this;
      this.startshow=false;
      // this.$refs.pic.size_small(5)
      // this.$refs.pic.Refresh();
      vm.$refs.pic.beginMove(vm.time);
      vm.speed =this.speedgap*this.speednum;
      this.move_timer=setInterval(Move_timer_fun,2000);
      function Move_timer_fun(){
        vm.time=new Date(vm.time.getTime()+vm.speed);
        vm.$refs.pic.beginMove(vm.time);
      }
    },
    //结束
    endMove(){
      this.startshow=true;
      clearInterval(this.move_timer);
    },
    //重置
    resetMove(){
      var vm=this;
      this.startshow=true;
      clearInterval(this.move_timer);
      this.time=new Date();
      this.speednum=1;
      this.speedgap=2000;
      vm.startMove();
    },
    //显示标签
    changswitch(data){
      console.log(this.switchvalue,data,'data');
      // this.$refs.pic.switchLable(data);
    },
    bigsize(){
      this.$refs.pic.size_big()
      this.$refs.pic.Refresh();
    },
    smallsize(){
      this.$refs.pic.size_small()
       this.$refs.pic.Refresh();
    }
  },
};
</script>

<style lang="less" scoped>

#drawingPic {
  // margin: 0 auto;
  overflow: auto;
  position: absolute;
  // margin:10px;
  top: 120px;
  left: 0px;
  bottom: 0;
  right: 0px;
  // min-width: 1000px;
  // max-width: 1600px;
  // background: rgba(48, 48, 59, 1);
  .tooltxt{
    display: flex;
    // flex-direction: column;
    justify-content: center;
    // align-items: center;
    color: white;
    #downimg{
    position: absolute;
    // width: 40px;
    // height: 40px;
    cursor: pointer;

  }

  }
  
  #drawingrow{
    position: absolute;
    left:50%;
    z-index: 10000000;
    transform: translateX(-50%);
    // margin-left:-25%;
    // bottom: 10px;
    // bottom: 10%;

    // width: 50%;
    // margin-bottom: 10px;
    line-height: 40px;
    padding: 5px 15px;
    // border:1px solid #ebebeb;
    box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1);
    border-radius: 4px;
    // background: white;
    // background: rgb(13, 37, 74);
    background: linear-gradient(180deg, rgba(31, 106, 255, 0.2) 0%, rgba(31, 106, 255, 0) 100%), #011F3B;
    border: 0.607812px solid rgba(31, 106, 255, 0.9);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    i{
      &:hover{
        color: red;
      }
    }
   /deep/ .el-input__inner{
      background: rgba(31, 106, 255, 0.9);
      color: white;
      border:none;
    }
    /deep/ .el-input-number__decrease, .el-input-number__increase{
      background: none;
      color: white;
    }
    
    /deep/ .el-input-number__decrease.is-disabled, .el-input-number__increase.is-disabled{
      color: white;
    }
    .iclose{
      position: absolute;
      right: 0px;
      top: 0px;
      font-size: 12px;
      cursor: pointer;
    }
    .spantxt{
      // line-height: 16px;
      font-size: 16px;
      .redpoint{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin-right: 3px;
        background: red;
      }
    }
    .iconcolor{
      background: rgba(31, 106, 255, 0.9);
      color: white;
      border: none;
    }
  }
  /* height: 800px;
  width: 800px; */

  /* #drawPic {
    min-width: 700px;
    min-height: 500px;
  }  */
}

</style>
