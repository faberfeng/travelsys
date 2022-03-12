<template>
  <!-- style="overflow: hidden; left: 20px" -->
  <div id="drawingPic" style="overflow: hidden;">
    <!-- <el-button @click="switchType">切换</el-button> -->
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
import picView from "@/components/picViews.vue";
export default {
  name: "review",
  components: {
    picView,
  },
  data() {
    return {
      paraList: {},
      ispic:false
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
      source: "/static/images/stationpic.png",
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
    }
  },
};
</script>

<style>
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
  /* height: 800px;
  width: 800px; */

  /* #drawPic {
    min-width: 700px;
    min-height: 500px;
  }  */
}
</style>
