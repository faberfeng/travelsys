<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'App',
   created() {
    /* eslint-disable*/
  }
}
</script>

<style lang="less">
*{margin:0; padding:0;} 
html,body{
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // background: rgba(44, 44, 44, 1);
  // overflow: hidden;
  min-width: 1000px;
  height: 100%;
  font-size: 12px;
  // background: black;
}
  /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
    width:0px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
    box-shadow:inset 006px rgba(0, 0, 0, .5);
    -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
    border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
    border-radius:10px;
    background:rgba(0,0,0,0.1);
    box-shadow:inset 006px rgba(0, 0, 0, .5);
    -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
    background:rgba(255,0,0,0.4);
    }
// /deep/ .tps .el-tooltip__popper .is-dark{
//         background: rgb(89,49,53) !important;
//         color: #FFF;
//         border: 1px solid rgb(254,211,105) !important;
    
// }
.tps{
  background: rgb(89,49,53) !important;
  border: 1px solid rgb(254,211,105) !important;
  padding: 5px !important;
}
</style>
