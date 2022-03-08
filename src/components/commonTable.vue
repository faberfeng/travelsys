<template>
  <el-table
    :data="tableData"
    height="450"
    border
    style="width: 100%">
    <el-table-column 
      v-for="(item,index) in columnData" :key="index"
      :prop="item.prop"
      :label="item.name"
      :width="item.width"
      align="center">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name:'table',
    props:[
      "tableData",
      "columnData"
    ],
    data() {
      return {
      }
    },
    create(){
      console.log(this.columnData,'columnData');
    }
  }
</script>
<style>

</style>