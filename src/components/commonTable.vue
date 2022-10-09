<template>
  <div>
  <el-table
    v-loading="loading"
    :data="tableData"
    :height="tableheight"
    size="small"
    :stripe="true"
    :default-sort="defaultSort"
    :header-cell-style="{background:'rgb(21, 41, 76)',color:'#FFFFFF',height:'42px',borderBottom: '1px solid #1F6AFF'}"
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
   <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4" -->
  <el-pagination
  background  
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
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
<style lang="less" scoped>
/deep/ .el-table tr.el-table__row{
  
  background-color: rgb(21, 41, 76) !important;
  color: white;
  border-bottom: 1px solid #1F6AFF;
}
/deep/ .el-table tr.el-table__row .el-table__row--striped{
  // background-color: black !important;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
  // background-color: black !important;
   background: linear-gradient(180deg, rgba(33, 64, 130, 1) 0%, rgba(23, 44, 80, 1) 100%);
  color: white;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
   background: linear-gradient(180deg, rgba(33, 64, 130, 1) 0%, rgba(23, 44, 80, 1) 100%);
  color: white;
  
}
/deep/ .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf{
border-bottom: 1px solid #1F6AFF;
}
// .el-table tr{
//   background-color: black !important;

// }

</style>