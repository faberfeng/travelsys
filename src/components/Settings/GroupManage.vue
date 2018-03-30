<template>
  <div class="wrapper" id="groupPage">
      <h4 class="title">群组管理</h4>
      <div class="container-left">

      </div>
      <div class="container-right">

      </div>
  </div>
</template>

<style  lang='less'>
#groupPage{
    position: relative;
       .title{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        border-bottom:2px solid #ccc; 
        height: 50px;
        line-height: 50px;
        padding:0px 15px;
        margin: 10px 0 0 0 ;
        text-align: left;
    }
    .container-left{
        display: block;
    }
    .container-right{

    }
}
</style>

<script>
import axios from 'axios'

export default {
  name:'',
  data(){
      return {
          token:''
      }
  },
  watch:{
    
  },
  created(){
      var vm = this
  },
  methods:{
       
  }
}
</script>
 