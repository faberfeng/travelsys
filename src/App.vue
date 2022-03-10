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
</style>
