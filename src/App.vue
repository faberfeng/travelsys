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
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1200px;
  height: 100%;
}
.UserList{
   td,th{
    border-bottom: 1px solid #e6e6e6;
   }
}
.el-date-editor.el-input{
  width: 435px !important;
}
.dialog-footer{
    text-align: center;
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
/*弹框信息*/
#inital .el-dialog__header{
  padding:0;
}
#inital .el-dialog__headerbtn{
  top:10px;
  right: 10px;
}
#inital .el-dialog__footer{
  padding: 0;
  margin: 41px 0 33px 0;
}
.el-dialog__footer{
  text-align: center!important;
}
#inital .el-dialog__body{
  padding:30px 0 0px 0;
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
#edit .el-dialog{
  width: 660px;
}
#edit .el-dialog__header{
  height: 68px;
  padding:0;
  border-bottom: 2px solid #e6e6e6;
  text-align: left;
}
 #edit .editSelect{
    width: 388px;
    height: 30px;
    color: #333333;
    background: #fafafa;
    border: 1px solid #d1d1d1;
}
 #edit .icon-sanjiao{
  display: block;
    position: absolute;
    width: 12px;
    height: 7px;
    background-image:url('./components/Settings/images/sanjiao.png');
    background-size: 100% 100%;
    content: '';
    top: 18px;
    right: 42px;
}
 #edit select{  
/*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
/*很关键：将默认的select选择框样式清除*/  
appearance:none;  
-moz-appearance:none;  
-webkit-appearance:none;  
/*在选择框的最右侧中间显示小箭头图片*/  
/*为下拉小箭头留出一点位置，避免被文字覆盖*/  
padding-right: 14px;  
}  
/*清除ie的默认选择框样式清除，隐藏下拉箭头*/  
 #edit select::-ms-expand { display: none; }  
  #edit select:focus{
    outline: none;
}
#edit  .el-dialog__title{
  color:#fc3439;
  font-size: 18px;
  line-height:18px; 
  font-weight: bold;
  font-family: 'MicrosoftYaHei';
  display: inline-block;
  margin: 34px 0 15px 30px;
}
#edit .el-dialog__headerbtn{
  top:10px;
  right: 10px;
}
#edit .el-dialog__body{
  padding: 0;
  margin-top:40px;
}
#edit .el-form-item{
  margin: 0 20px auto;
  width: 70%;
}
#edit .el-form-item__label{
  padding: 0;
  
}
#edit .el-input__inner{
  // width: 322px;
  // height: 36px;
}
#edit .el-dialog__footer{
  padding: 0;
  margin: 30px 0 40px 0;
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
/*日期选择器*/
.el-date-editor{
    height: 36px;
    width: 146px;
  }
  .el-input__inner{
      height: 36px !important;
  }
  .el-input__prefix{
      top: -2px;
  }
  #in .el-checkbox__inner{
      width: 12px;
      height: 12px;
      position: relative;
      top: -1px;
  }
  #in .el-checkbox__label{
      font-size: 12px;
      font-weight: normal;
  }
   /*编辑弹框*/
    #edit .editBody{
        margin: 0 auto;
    }
    #edit .editBodytwo{
        margin-top: 20px;
    }
    #edit .editInpText{
        color: #666;
        font-size: 14px;
        line-height: 14px;
        font-weight: normal;
        display: inline-block;
        margin-right: 20px;
        width: 15%;
        text-align: right;
    }
    #edit .inp{
        width: 435px;
        height: 38px;
        border: 1px solid #d1d1d1;
        border-radius: 2px;
        background: #fafafa;
        padding-left: 10px;
    }
    #edit .inp::-webkit-input-placeholder,#edit .inp::-ms-input-placeholder,#edit .inp::-moz-input-placeholder{
        color: #b3b3b3;
    }
    #edit .editBtnS,#edit .editBtnC{
        width: 111px;
        height: 36px;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 2px;
    }
    #edit .editBtnS{
        background: #fc3439;
        margin-right: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    #edit .editBtnS:hover{
        background: #ff5257;
    }
    #edit .editBtnC{
        color: #666;
        background: #fff;
        border: 1px solid #ccc;
    }
    #edit .editBtnC:hover{
        background: #e6e6e6;
        color: #666;
    }
    #edit .upImgBtn{
        width: 98px;
        height: 26px;
        border: 1px solid #ccc;
        cursor: pointer;
        background: #f9f9f9;
        font-size: 14px;
        font-weight: normal;
        color: #666;;
    }
    /* #edit .upInput{
        width: 98px;
        height: 26px;
        background: #f9f9f9;
    } */
    #edit .upImgText{
        font-size:14px;
        line-height: 14px;
        display: inline-block;
        margin-left: 10px;
        font-weight: normal;
        color: #999;
    }

    // #webgl{
    //     height: 650px;
    //     width: 100%;
    //     position: fixed;
    //     top:68px;
    //     left:0px;
    //     display: inline-block;
    //     transition: all 0.7s ease;
    // }
    // .navigation{
    //     height:46px;
    //     width:100%;
    //     position: fixed;
    //     top: 46px; 
    //     left: 26px;
    //     right: 0;
    //     background: #fff;
    //     z-index: 1000!important;
    //     transition: all 0.7s ease;
    // }
    // .navigation1{
    //     height:46px;
    //     width:100%;
    //     position: fixed;
    //     top: 590px; 
    //     left: 26px;
    //     right: 0;
    //     background: #fff;
    //     z-index: 1000!important;
    //     transition: all 0.7s ease;
    // }
    // .settingsRight{
    //     display: block;
    //     margin-left: 219px;
    //     margin-top: 116px;
    //     transition: all 0.7s ease;
    // }
    // .settingsRight1{
    //     top:635px;
    //     position: fixed;
    //     display: block;
    //     margin-left: 219px;
    //     height: 100%;
    //     overflow:auto;
    //     transition: all 0.7s ease;
    // } 
</style>
