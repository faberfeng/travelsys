<template>
  <div>
  <el-table
    v-loading="loading"
    :data="tableData"
    :height="tableheight"
    size="small"
    :default-sort="defaultSort"
    border
    style="width: 100%;overflow:auto">
    <el-table-column 
      v-for="(item,index) in columnData" :key="index"
      :prop="item.prop"
      :label="item.name"
      :width="item.width"
      :sortable="item.sortable"
      align="center">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  export default {
    name:'table',
    props:[
      "tableData",
      "columnData",
      "defaultSort",
      "loading"
    ],
    data() {
      return {
        tableheight:null
      }
    },
    create(){
     
      
      // console.log(this.columnData,this.tableheight,'columnData');
    },
     mounted(){
        this.tableheight=document.body.offsetHeight-190
        console.log(this.columnData,this.tableheight,'columnData');
     }
  }
</script>
<style>

</style>