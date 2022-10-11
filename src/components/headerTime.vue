<template>
  <div class="info">
    <div class="date_info">{{ currentDate }}&nbsp;&nbsp;{{ currentWeek }}</div>
    <div class="time_info">
      <div class="time_num">
        <span>{{currenth[0]}}</span><span>{{currenth[1]}}</span>
      </div>:
      <div class="time_num">
        <span>{{currentm[0]}}</span><span>{{currentm[1]}}</span>
      </div>:
      <div class="time_num">
        <span>{{currents[0]}}</span><span>{{currents[1]}}</span>
      </div>
    </div>
    <!-- <div class="setting">
      <el-dropdown>
        <i class="el-icon-user-solid" style="font-size:20px"></i>
        <el-dropdown-menu>
          <el-dropdown-item>
            <i class="el-icon-back" style="font-size:16px"  @click="loginOut"></i>退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>
<script>
import moment from "moment";
import 'moment/locale/zh-cn'
export default {
  name:'HeaderTime',
  data () {
    return {
      currentTime: moment(new Date()).format("HH : mm : ss"),
      currentWeek: moment().format("dddd"),
      currentDate: moment(new Date()).format("YYYY年MM月DD日"),
      currenth: '',
      currentm: '',
      currents: '',
    };
  },
  mounted () {
    let vm = this;
    vm.headerTimeInterval = setInterval(function () {
      vm.currenth = moment(new Date()).format("HH");
      vm.currentm = moment(new Date()).format("mm");
      vm.currents = moment(new Date()).format("ss");
      vm.currentDate = moment(new Date()).format("YYYY年MM月DD日");
    }, 1000);
  },
  methods:{
    loginOut(){
      console.log('tuichu')
      this.$router.push({
        path:'/login'
      })
    },
    setting(){
      console.log('tuichu')
    }
  },
  beforeUnmount () {
    clearInterval(this.headerTimeInterval);
  },
};
</script>
<style lang="less" scoped>
.info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  background: url('../assets/imgs/header/timebanner.png') no-repeat;
  background-size:100% 100%;
  padding:0px 30px ;
  width: 300px;
  // color: black;
  .date_info {
    font-size: 13px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-right: 10px;
    // color: #ffffff;
  }
  .time_info {
    font-size: 16px;
    font-family: Arial;
    font-weight: bold;
    // color: #ffffff;
    display: flex;
    .time_num:not(:last-of-type) {
      margin-right: 6px;
    }
    .time_num:not(:first-of-type) {
      margin-left: 6px;
    }
    span {
      display: inline-block;
      width: 18px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      // border: 1px solid #2153a8;
      opacity: 1;
      border-radius: 4px;
    }
    span:not(:last-of-type) {
      margin-right: 2px;
    }
  }
  .setting{
    margin-left:20px;
    height: 36px;
    width: 36px;
    border-radius:50%;
    // border:1px solid #2153a8;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ccc;
  }
}
</style>