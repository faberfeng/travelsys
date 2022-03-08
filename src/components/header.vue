<template>
  <div class="header">
      <div class="left">
          <img src="../assets/logo.png" width="180px" height="48px" />
          实时动态轨迹
      </div>
      <div class="right">
          <el-avatar size="middle" :src="circleUrl"></el-avatar>

      </div>
  </div>
</template>

<script>
export default {
    circleUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}
</script>

<style lang="less" scoped>
.header{
    width: 100%;
    height: 60px;
    background: white;
    // border-bottom: 2px dotted #ebeef5;
    line-height: 60px;
    min-width: 800px; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.06);
    position: relative;
    z-index: 10px;
    .left{
        position: absolute;
        font-size: 16px;
        left: 20px;
        height: 100%;
        line-height: 60px;
        // text-align: center;
    }
    .right{
        position: absolute;
        right: 20px;
        height: 100%;
        line-height: 60px;
    }
}

</style>