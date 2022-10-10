<template>
<div class="sidebar-container"
    :style="{ width: collapsed ? 'auto' : '200px' }">
    <el-menu :default-active="activeIndex"  class="el-menu-demo"  background-color="rgba(31, 106, 255, 0)"
        text-color="#FFF" :collapse="collapsed"
        active-text-color="#165DFF" @select="handleSelect">
        <el-menu-item index="1"><i class="el-icon-data-line"></i><span>首页</span></el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-notebook-2"></i>
                <span>车辆管理</span>
            </template>
            <el-menu-item index="2-1">车辆统计</el-menu-item>
        </el-submenu>
         <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-user"></i>
                <span>司机管理</span>
            </template>
           <el-menu-item index="3-1">司机统计</el-menu-item>
        </el-submenu>
        
        <!-- <el-menu-item index="4">首页1</el-menu-item> -->
    </el-menu>
    <div class="collapsed">
        <i v-if="collapsed" @click="collapsedSwitch" class="el-icon-s-fold iconclass" ></i>
        <i v-if="!collapsed" @click="collapsedSwitch" class="el-icon-s-unfold iconclass"></i>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            activeIndex: '1',
            collapsed:false
        }
    },
    created(){
        this.activeIndex=this.$store.state.activeIndex

    },
    computed:{
        // activeIndex

    },
    watch:{
        '$store.state.activeIndex':{
            handler(newVal, objVal) {
                console.log(newVal,objVal,11);
                this.activeIndex=newVal
            },
        }
    },
    methods:{
        handleSelect(key, keyPath) {
            console.log(key, keyPath,'keyPath');
            if(key==4){
                this.routerLink('/review');
            }else if(key==1){
                this.routerLink('/reviews');
            }else if(key=='2-1'){
                this.routerLink('/vehicleList');
            }else if(key=='3-1'){
                this.routerLink('/driverList');
            }
            this.$store.commit('changeMenus',key)
            console.log(key, keyPath);
        },
        routerLink(path){
            this.$router.push({
                path:path
            });
        },
        collapsedSwitch(){
            this.collapsed=!this.collapsed;
        }
    }

}
</script>

<style lang="less" scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  z-index: 10;
  // @include background_color("scbg");
  background-color: rgba(31, 106, 255, 0.1);
  display: inline-block;
  text-align: left;
  position: relative;
  .collapsed{
      position: absolute;
        justify-content: flex-end;
        margin-right: 20px;
        display: flex;
        align-items: center;
        bottom: 140px;
        right: 10px;
        .iconclass{
            font-size:20px;
            color:white;
            cursor: pointer;
        }
  }
  }
/deep/ .el-menu-item.is-active{
    background-color: rgba(31, 106, 255, 0.1) !important;
    
}
/deep/ .el-menu{
    border: none;
}
.el-menu-item:focus{
background-color: rgba(31, 106, 255, 0.1) !important;
}
.el-menu-item:hover{
    background: rgba(31, 106, 255, 0.4) !important;
}
/deep/ .el-submenu__title:hover{
    background: rgba(31, 106, 255, 0.4) !important;
}
/deep/ .el-submenu__title:focus{
    background: rgba(31, 106, 255, 0.1) !important;
}
.el-menu-demo{
//     display: flex;
// flex-direction: column;
// align-items: flex-start;
// padding: 0px;

// position: absolute;
// width: 265px;
// left: 0px;
// top: 0px;
// bottom: -1px;

// background: rgba(31, 106, 255, 0.1);
}
</style>