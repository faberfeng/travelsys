<template>
  <!-- style="overflow: hidden; left: 20px" -->
  <div id="drawingPic" style="overflow: hidden;">
    <!-- <el-button @click="switchType">切换</el-button> -->
    <el-row id="drawingrow">
      <el-col :span="16">
          <el-row type="flex">
            <el-col justify="start"  :span="8"><span class="spantxt"><span class="redpoint"></span>当前轨迹时间:</span><span class="spantxt" style="font-weight:bold">{{picktime}}</span></el-col>
            <el-col :span="16">
              <span class="spantxt">回溯开始时间:</span>
              <el-date-picker
                v-model="time"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                size="mini"
                :picker-options="pickerOptions">
              </el-date-picker>
              <span class="spantxt" style="margin-left:12px">倍速:</span>
              <el-input-number size="mini" v-model="speednum" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
            </el-col>
          </el-row>
      </el-col>
      <el-col :span="8">
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
            <!-- active-color="#13ce66"
            inactive-color="#ff4949" -->
          </el-switch>
        </el-col>
    </el-row>
    <picView
      ref="pic"
      @load_points="loadPic"
      @finish="drawFinish"
      @status_changed="picView_status_changed"
      :para="paraList"
    ></picView>
  </div>
</template>

<script>
import moment from "moment";
import picView from "@/components/picViews.vue";
export default {
  name: "review",
  components: {
    picView,
  },
  data() {
    return {
      paraList: {},
      ispic:false,
      startshow:true,
      speednum:1,
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
      switchvalue:true
    };
  },
  create() {
    
  },
  mounted() {
    // this.paraList = {
    //   type: "png",
    //   source: "/static/images/12.jpg",
    //   angle: 0,
    // };
    this.paraList = {
      type: "png",
      // source: "/static/images/stationpic.png",
      source:"http://103.40.192.26:10081/vehicle/static/images/stationpic.png",
      angle: 0,
    };
  },
  methods: {
    loadPic() {
      this.$refs.pic.Max_Select = 1;
    },
    drawFinish() {},
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
    //开始
    startMove(){
      this.startshow=false;
      this.$refs.pic.beginMove()
    },
    //结束
    endMove(){
      this.startshow=true;
      this.$refs.pic.stopMove()
    },
    //重置
    resetMove(){
      this.startshow=true;
      this.$refs.pic.resetMove()
    },
    //显示标签
    changswitch(){
      
    }
  },
};
</script>

<style lang="less" scoped>
#drawingPic {
  margin: 0 auto;
  overflow: auto;
  position: absolute;
  margin:10px;
  top: 66px;
  left: 0px;
  bottom: 0;
  right: 0px;
  min-width: 1000px;
  max-width: 1600px;
  #drawingrow{
    margin-bottom: 10px;
    line-height: 40px;
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
  }
  /* height: 800px;
  width: 800px; */

  /* #drawPic {
    min-width: 700px;
    min-height: 500px;
  }  */
}
</style>
