<template>
  <div id="app">
    
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
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1200px;
}
/*更改组件配色*/
.settingsLeft .el-menu{
  background: #fafafa;
}
 .settingsLeft .el-menu .is_active{
  background: #ececec;
}
.settingsLeft.is-opened .el-submenu__title {
  border-left: 4px solid #df0010;
  background: #7a818a;
  color: #d0d2d5;
}
.settingsLeft .el-menu-item {
  width: 190px !important;
  min-width: 190px !important;
  padding-left: 0 !important;
  margin: 0 !important;
  font-size: 14px;
  font-family: '微软雅黑';
  
}
.settingsLeft .el-menu-item:hover{
  background-color: none;
}
.el-menu-item.is-active{
  color: #fc3439;
  font-weight: bold;
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
#inital .el-dialog__header{
  padding:0;
}
#inital .el-dialog__headerbtn{
  top:10px;
  right: 10px;
}
#inital .el-dialog__footer{
  padding: 28px 0 30px 0;
}
#inital .el-dialog__body{
  padding:40px 0 0px 0;
}
#inital .el-dialog__footer .el-button{
  height: 36px;
  margin-left: 18px;
}
#inital .deleteBtn,#inital .cancelBtn{
  width: 111px;
  height: 36px;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 2px;
}
#inital .deleteBtn{
  color: #fff;
  background: #fc3439;
  border: none;
}
#inital .deleteBtn:hover{
  background: #ff5257;

}
#inital .cancelBtn{
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  font-family: 'MicrosoftYaHei';
  background: #fff;
}
#inital .cancelBtn:hover{
  color: #666;
  background: #e6e6e6;
}

#edit .el-dialog__header{
  height: 68px;
  padding:0;
  border-bottom: 1px solid #e6e6e6;
  text-align: left;
}
#edit  .el-dialog__title{
  color:#fc3439;
  font-size: 18px;
  font-weight: bold;
  font-family: 'MicrosoftYaHei';
  width: 150px;
  height: 26px;
  display: inline-block;
  margin: 34px 0 15px 30px;
}
#edit .el-dialog__headerbtn{
  top:10px;
  right: 10px;
}
#edit .el-dialog__body{
  padding: 40px 20px 30px 20px;
  width: 70%;
  margin: 0 auto;
}
#edit .el-form-item{
  margin: 0 20px auto;
  width: 70%;
}
#edit .el-form-item__label{
  padding: 0;
  
}
#edit .el-input__inner{
  width: 388px;
  height: 30px;
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
  color:#fc3439;
}
.el-tabs__item.is-active{
  color: #fc3439;
}
.el-tabs__item{
  color: #333333;
  font-size: 14px;
  font-family: '微软雅黑'
}
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
.projectTab .el-tabs__nav-wrap{
  padding-left: 0;
}
.el-tabs__header{
  height: 48px;
}
.el-tabs__nav{
  height: 48px;
  line-height: 48px;
}
.el-tabs__item{
  font-size: 14px;
  font-family: 'MicrosoftYaHei';
  color: #333333;
}
.el-tabs__item.is-active{
  font-weight: bold;
}
.is-opened .el-submenu__title{
  border-left: 4px solid #df0010;
  background: #7a818a;
  color: #ffffff;
}
.el-menu-item-group__title{
  padding: 0;
}
.is-opened  .el-submenu__title i{
  color: #fff;
}
.el-submenu__title i{
  color: #666666;
}
.el-menu-item:focus, .el-menu-item:hover{
  background-color:inherit;
}
.el-submenu__title:focus{
  background-color:#7a818a;
}
/* .el-submenu__title:hover{
  background-color:inherit;
}  */
/*日期选择器*/
.el-date-editor{
    height: 36px;
    width: 146px;
  }
  .el-input__inner{
      height: 36px;
  }
  .el-input__prefix{
      top: -2px;
  }

</style>
