<template>
  <div style="width:100%;height:100%;">
      <Header/>
      <router-view :key="$route.path" />
  </div>
</template>

<script>
import Header from "@/components/header.vue"
export default {
    name:'home',
    data(){
        return{

        }
    },
    components:{
        Header
    }

}
</script>

<style>

</style>