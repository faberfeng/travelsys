<template>
  <div class="header">
      <div class="left">
          <img src="../assets/logo.png" width="180px" height="48px" />
          <div>实时动态轨迹</div>
          
      </div>
      <div class="middle">
          <header-menu></header-menu>
      </div>
      <div class="right">
          <header-time></header-time>
      </div>
  </div>
</template>

<script>
import HeaderTime from '@/components/headerTime.vue'
import HeaderMenu from '@/components/headerMenu.vue'
export default {
  components: { HeaderTime,HeaderMenu },
    circleUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}
</script>

<style lang="less" scoped>
.header{
    width: 100%;
    height:61px;
    background: #fff;
    color: #000;
    // background: #272727;
    // color: #e3e3e3;
    // border-bottom: 2px dotted #ebeef5;
    line-height: 60px;
    min-width: 800px; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.06);
    position: relative;
    z-index: 10;
    // position: fixed;
    // top: 0;
    // left: 0;
    // color: black;
    // width: 100%;
    // height: 60px;
    // display: flex;
    // justify-content: flex-end;
    // user-select: none;
    // background: white;
    // background: url("../assets/line.png") no-repeat center / 90%;
    .left{
        position: absolute;
        font-size: 16px;
        left: 20px;
        height: 100%;
        line-height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        // text-align: center;
    }
    .middle{
        position: absolute;
        left: 350px;
        height: 60px;
    }
    .right{
        position: absolute;
        right: 20px;
        // height: 100%;
        line-height: 60px;
    }
    
}

</style>