<template>
  <div class="wrapper">
      <h4 class="title">工程日志管理</h4>
      <div class="selectMode">
          <label>筛选</label>
          <div class="block">
            <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="btn">
            <el-button type="primary">查询</el-button>
        </div>
      </div>
      <div class="projectTable">
        <el-table class="table" border :data="tableData" style="width:95%">
            <el-table-column prop="index" label="操作人"></el-table-column>
            <el-table-column prop="name" label="事件"></el-table-column>
            <el-table-column prop="coordinate" label="操作时间"></el-table-column>
        </el-table>
      </div>
      <div class="pagenation">   
        <el-pagination background layout="prev, pager, next" :total="500"></el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name:'ProjectLoggerManage',
  data(){
      return{
        tableData:[{
            index: '岳树巧',
            name: '"企业自用办公楼"工程，“文档管理”页面，删除文件集:某项目-F2管线综合.gmd',
            coordinate: '2018-03-06 13:21:16',
        }, {
            index: '岳树巧',
            name: '"企业自用办公楼"工程，“文档管理”页面，删除文件集:某项目-F2管线综合.gmd',
            coordinate: '2018-03-06 13:21:16',
        }],
        value6:''
      }
  }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
        /* border-left: 1px solid #ccc; */
    }
    .title{
        color: red;
        width: 100%;
        border-bottom:1px solid #ccc; 
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding:10px 0px;
        margin: 0;
    }

    .selectMode{
        display: flex;
        margin-top: 20px;
        height: 70px;
    }
    .selectMode label{
        width: 100px;
        height: 40px;
        line-height: 40px;
    }
    .block{
        flex: 1;
        text-align: left;
    }
    .btn{
        width: 100px;
        height: 40px;
        display: inline-block;
        margin-right: 10px;
    }
    .pagenation{
        margin:20px 0;
        text-align: right;
    }
    .projectTable{
        width: 100%;
        text-align: left;
    }
</style>