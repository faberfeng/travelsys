<template>
  <div id="header" class="header">
      <img :src="require('@/assets/imgs/header/header_bg.png')" />
      <div class="left_nav">
          <img class="img1" :src="require('@/assets/imgs/header/logo.png')" />
          <img class="img2" :src="require('@/assets/imgs/header/light.png')" />
          <img class="img3" :src="require('@/assets/imgs/header/bannertxt.png')" />
           <img class="img4" :src="require('@/assets/imgs/header/frame.png')" />
      </div>
      <div class="right_nav">
          <img class="img5" :src="require('@/assets/imgs/header/navbar_right.png')" />
      </div>
      <!-- <div class="left">
          <img src="../assets/logo.png" width="180px" height="48px" />
          <div>实时动态轨迹</div>
      </div> -->
      <div class="middle">
          <header-menu></header-menu>
      </div>
      <!-- <div class="right">
          <header-time></header-time>
      </div> -->
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
    color: #000;
    background: #095398;
    height: 100%;
    position: relative;
    z-index: 10003;
     height: 119px;
    img{
        position: absolute;
        width: 100%;
       
        left: 0px;
        top:0px;
    }
    .left_nav{
        position: absolute;
        .img1{
            width: 34px;
            top:15px;
            left: 30px;
        }
        .img2{
            width: 280px;
            left: 0px;
            top:10px;
        }
        .img3{
            width: 375px;
            top:20px;
            left: 70px;
        }
        .img4{
            width: 80px;
            top:42px;
            left: 430px;

        }


    }
    .right_nav{
        position: absolute;
        // right: 25px;
        .img5{
            width: 420px;
            left: 1350px;
            top:40px;
        }

    }
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