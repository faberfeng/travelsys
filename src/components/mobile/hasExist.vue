<template>
  <div style="width: 100%;overflow-x: hidden;">
    <div class="headerApply">
      <img @click="back" class="backImg" src="../../assets/mobile/back.png"/>
      <div class="headerDiv">BDMS建筑数据管理系统</div>
    </div>
    <div class="NullDiv"></div>
    <div class="labelDiv" style="color: #000;">您的用户账号已在项目</div>
    <div class="pNameDiv">{{projName}}</div>
    <div class="labelDiv">的协同名单中，无需重新提交申请</div>
    <div class="NullDiv"></div>
    <div>
      <img src="../../assets/mobile/qrCode.png"/>
    </div>
    <div class="labelDiv">平台登录地址</div>
    <div class="labelDiv">bdms.arctron.cn</div>
  </div>
</template>
<script>

  export default {
    name: 'hasExist',
    data() {
      return {
        projName: '',
      }
    },
    created() {
      this.projName = this.$route.params.projName;
    },

    methods: {
      back:function () {
          this.$router.back(-1);
      }
    },
  }
</script>
<style>
  #app {
    width: 100%;
    min-width: 100%;
  }
</style>
<style lang="less">
  .headerApply {
    width: 100%;
    height: 4rem;
    background-color: #fc3439;
    color: #FFFFFF;
    font-size: 1.5rem;
    font-weight: bolder;
    line-height: 4rem;
    text-align: left;
    padding-left: 0.5rem;
  }

  .labelDiv {
    margin-left: 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    color: #808080;
    text-align: center;
  }

  .pNameDiv {
    margin-left: 1rem;
    font-size: 1.5rem;
    color: #fc3439;
    text-align: center;
  }

  .backImg {
    position: relative;
    left: -1.5rem;
    top: -0.8rem;
  }

  .headerDiv {
    position: relative;
    top: -7.2rem;
    left: 2rem;
  }
  .NullDiv{
    margin: 2rem;
  }
</style>
