<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/*更改组件配色*/
.el-submenu__title{
  border-left: 2px solid red;
}
/*穿梭框样式*/
.el-transfer-panel__item .el-checkbox__input{
  left: 70px;
}
/*弹框信息*/
.el-dialog__header{
  height:50px;
  line-height: 50px;
  text-align: left;
  border: 1px solid #ccc;
}
.el-dialog__title{
  color: red;
}
.el-dialog__wrapper .el-input__inner{
  height: 31px;
  line-height: 31px;
  background: #fafafa;
}
.el-form-item{
  margin-bottom: 19px;
}
.el-dialog__footer{
  width: 100%;
  display: inline-block;
  text-align: center;
}
.el-dialog__footer .el-button{
  width: 111px;
  margin-left: 20px;
}
/**/
.el-tabs__active-bar{
  height: 3px;
  width: 56px;
}
.el-tabs__item{
  color: #333333;
  font-size: 14px;
  font-family: '微软雅黑'
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  /* border-top: 3px solid #fc3439; */
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item{
  font-size: 16px;
  width: 106px;
  font-weight: bold;
  color: #666666;
}
</style>
