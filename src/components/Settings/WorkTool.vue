<template>
  <div class="wrapper">
      <h4 class="title"><span>作业工具分类编码</span></h4>
      <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            <el-table border :data="tableData5" style="width:100%"> 
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
        border-bottom:1px solid #ccc; 
        margin: 0 ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        margin-left: 15px;
        color: #fc343a;
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        margin: 22px 0 12px 15px;
    }
    .manageWorktool{
        margin: 0 20px 0 15px;
        text-align: left;
    }
    .worktooltitle{
        color:#fc3439;
        display: inline-block;
        width: 50%;
        text-align: left;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        margin: 0;
        text-align: left;
        margin: 30px 0 20px;
    }   
    .btn{
        width: 96px;
        height: 32px;
        border: none;
        border-radius: 2px;
        float: right;
        margin: 22px 0 12px 0;
        cursor: pointer;
        background: #fc3439;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .btn:hover{
        background: #ff5257
    }
    .btn i{
        margin-right: 10px;
    }
</style>