<template>
  <div>
      <Header/>
      <el-container>
        <HeaderMenu/>
        <el-container>
            <el-main> 
                <Tabs />
                <router-view :key="$route.path" /></el-main>
        </el-container>
    </el-container>
      <!-- <div class="homebox">
          <HeaderMenu/>
      </div>
      <router-view :key="$route.path" /> -->
  </div>
</template>

<script>
import Header from "@/components/header.vue"
import HeaderMenu from '@/components/headerMenu.vue'
import Tabs from '@/components/tabs.vue'
export default {
    name:'home',
    data(){
        return{

        }
    },
    components:{
        Header,
        HeaderMenu,
        Tabs
    }

}
</script>

<style lang="less" scoped>
.homebox{
    width: 100%;
    height: 100%;
    display: flex;
}


</style>