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
.settingsLeft .el-menu{
  background: #fafafa;
}
.el-menu .is_active{
  background: #ececec;
}
 .is-opened .el-submenu__title {
  border-left: 4px solid #df0010;
  background: #7a818a;
  color: #d0d2d5;
}
.el-menu-item {
  width: 190px !important;
  min-width: 190px !important;
  padding-left: 0 !important;
  margin: 0 !important;
  font-size: 14px;
  font-family: '微软雅黑';
}
.el-submenu__title{
  padding-left: 0px !important;
}
.el-submenu__icon-arrow .el-icon-arrow-down{
  color: black;
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
/* .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  border-top: 3px solid #fc3439; 
} */
.el-tabs--border-card>.el-tabs__header .el-tabs__item{
  font-size: 16px;
  width: 106px;
  font-weight: bold;
  color: #666666;
}
.el-tabs__header{
  margin-bottom: 0px;
}
.el-tabs__nav-wrap{
  padding-left: 18px;
}
/* .el-submenu{
  
} */
</style>
