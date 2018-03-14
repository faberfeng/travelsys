<template>
  <div class="wrapper">
      <h4 class="title">作业工具分类编码</h4>
      <div class="worktool">
        <h5 class="worktooltitle">分类编码 <span class="worktoolicon"><el-button class="btn" type="primary"><i class="el-icon-plus"></i>添加</el-button></span></h5>
        <div class="worktable">
            <el-table border :data="tableData5" style="width:95%"> 
                <el-table-column  type="expand" >
                    <template slot-scope="props">
                        <el-table border  :data="tableData5" style="width:100%">
                            <el-table-column label="序号" prop="index" >

                            </el-table-column>
                            <el-table-column label="编码" prop="code" >

                            </el-table-column>
                            <el-table-column label="标题" prop="title" >

                            </el-table-column>
                            <el-table-column label="来源" prop="source">

                            </el-table-column>
                            <el-table-column label="状态" prop="state">

                            </el-table-column>
                            <el-table-column label="操作" prop="action">

                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="序号" prop="index" >

                </el-table-column>
                <el-table-column label="编码" prop="code" >

                </el-table-column>
                <el-table-column label="标题" prop="title" >

                </el-table-column>
                <el-table-column label="来源" prop="source">

                </el-table-column>
                <el-table-column label="状态" prop="state">

                </el-table-column>
                <el-table-column label="操作" prop="action">

                </el-table-column>
            </el-table>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name:'WorkTool',
  data(){
      return {
          tableData5:[{
            index: '01',
            code:'010000',
            title: '信息工具',
            source: '行业标准',
            state: '正常使用',
        },
        {
            index: '02',
            code:'020000',
            title: '信息工具',
            source: '行业标准',
            state: '正常使用',
        }]
      }
  }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
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
    .worktooltitle{
        color: red;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        padding:10px 0px;
        margin: 0;
    }   
    .worktoolicon{
        float: right;
        width: 20%;
    }
    .worktable{
        width: 100%;

    }
</style>