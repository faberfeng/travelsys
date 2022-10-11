<template>
  <div id="header" class="header">
      <img class="img0" :src="require('@/assets/imgs/header/header_bg.png')" />
      <div class="left_nav">
          <img class="img1" :src="require('@/assets/imgs/header/logo.png')" />
          <img class="img2" :src="require('@/assets/imgs/header/light.png')" />
          <img class="img3" :src="require('@/assets/imgs/header/bannertxt.png')" />
           <img class="img4" :src="require('@/assets/imgs/header/frame.png')" />
      </div>
      <div class="right_nav" v-if="dashborad">
          <img class="img5" :src="require('@/assets/imgs/header/navbar_right.png')" />
      </div>
      <div class="right_nav1" v-if="!dashborad">
          <div class="top">
              <!-- <img  :src="require('@/assets/imgs/header/timebanner.png')"> -->
              <header-time></header-time>
          </div>
          <div class="bottom">
              <img  :src="require('@/assets/imgs/header/tipbanner.png')">
              <div class="tiptxt">
                 <span class="txt"> 1.任何情况下，站至站台后进行开门作业；2.易造成错开门的作业场景，提高安全意识，规范作业；</span>
              </div>
          </div>
      </div>
      <!-- <div class="left">
          <img src="../assets/logo.png" width="180px" height="48px" />
          <div>实时动态轨迹</div>
      </div> -->
      <!-- <div class="middle">
          <header-menu></header-menu>
      </div> -->
      <!-- <div class="right">
          <header-time></header-time>
      </div> -->
  </div>
</template>

<script>
import HeaderTime from '@/components/headerTime.vue'
import HeaderMenu from '@/components/headerMenu.vue'
export default {
    props:["dashborad"],
    name:'header',
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
    .img0{
        position: absolute;
        width: 100%;
       
        left: 0px;
        top:0px;
    }
    .left_nav{
        position: absolute;
        .img1{
            position: absolute;
            width: 34px;
            top:15px;
            left: 30px;
        }
        .img2{
            position: absolute;
            width: 280px;
            left: 0px;
            top:10px;
        }
        .img3{
            position: absolute;
            width: 375px;
            top:20px;
            left: 70px;
        }
        .img4{
            position: absolute;
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
    .right_nav1{
        height: 100px;
        min-width: 680px;
        // width: 200px;
        position: absolute;
        left: 900px;
        top:30px;
        text-align: left;
        .top{
            height: 30px;
            img{
            height: 20px;
        }
        }
        .bottom{
            height: 30px;
            // white-space: nowrap;
            img{
                height: 30px;
            }
            .tiptxt{
                background: url('../assets/imgs/header/txtbanner.png') no-repeat;
                background-size: 100% 100%;
                color: white;
                padding: 0px 10px;
                float: right;
                margin-left:10px;
                // vertical-align: center;
                .txt{
                    line-height: 30px;
                }
                // height: 100px;
                // display: inline-block;
            }
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