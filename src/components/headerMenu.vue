<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
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

<style>

</style>