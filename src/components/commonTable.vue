<template>
  <div>
  <el-table
    v-loading="loading"
    :data="tableData"
    height="450"
    size="small"
    :default-sort="defaultSort"
    border
    style="width: 100%">
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
      }
    },
    create(){
      console.log(this.columnData,'columnData');
    }
  }
</script>
<style>

</style>