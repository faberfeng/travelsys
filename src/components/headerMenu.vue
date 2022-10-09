<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo"  background-color="rgba(31, 106, 255, 0.1)"
      text-color="#165DFF"
      active-text-color="#ffd04b" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <!-- <el-menu-item index="4">首页1</el-menu-item> -->
      <el-menu-item index="2">车辆统计</el-menu-item>
      <el-menu-item index="3">司机统计</el-menu-item>
  </el-menu>
</template>

<script>
export default {
    data(){
        return{
            activeIndex: '1',
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
            if(key==4){
                this.routerLink('/review');
            }else if(key==1){
                this.routerLink('/reviews');
            }else if(key==2){
                this.routerLink('/vehicleList');
            }else if(key==3){
                this.routerLink('/driverList');
            }
            this.$store.commit('changeMenus',key)
            console.log(key, keyPath);
        },
        routerLink(path){
            this.$router.push({
                path:path
            });
        }
    }

}
</script>

<style lang="less" scoped>
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