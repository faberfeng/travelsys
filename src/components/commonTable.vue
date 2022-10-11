<template>
  <div>
  <el-table
    v-loading="loading"
    :data="tableData"
    :height="tableheight"
    size="small"
    :stripe="true"
    :fit="true"
    :default-sort="defaultSort"
    :header-cell-style="{background:'rgb(21, 41, 76)',color:'#FFFFFF',height:'42px',borderBottom: '1px solid #1F6AFF'}"
    style="width: 100%;">
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
      v-if="ispagination"
    style="margin:40px auto;float:right"
      background  
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="40">
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
      "loading",
      "ispagination"
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
        this.tableheight=document.body.offsetHeight-320
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
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
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
/deep/ .el-pagination.is-background .el-pager li{
  background: none;
  color: #FFFFFF;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
  background: #0052D9;
  color: #FFFFFF;
}
/deep/ .el-pagination .btn-next, .el-pagination .btn-prev{
  background: none;
}
/deep/ .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
background: none !important;
}
/deep/ .el-pagination.is-background .btn-prev{
  background: none !important;
}
/deep/ .el-pagination button:disabled{
background: none;
}
/deep/ .el-pagination__total{
  color: white;
}
/deep/ .el-pagination__jump{
  color: white;

}
/deep/ .el-input__inner{
  background-color: rgba(31, 106, 255, 0.4);
  border:none;
  color: white;
}
/deep/ .el-table, .el-table__expanded-cell{
  background-color: #095398;
}
/deep/ .el-table--border::after, .el-table--group::after, .el-table::before{
  background: none;
}

// .el-pagination button:disabled{

// }

</style>