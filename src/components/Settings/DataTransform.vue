<template>
  <div class="wrapper">
      <h4 class="title">数据传递标准预览</h4>
      <div class="dataTransform">
          <div class="dataCollectAnalysis">
              <h5 class="title"><i class="el-icon-document"></i>标准汇总分析<span class="imp"><i class="el-icon-document"></i>导入标准</span><span class="imp"><i class="el-icon-document"></i>导出标准</span></h5>
              <el-table border style="margin-top:8px;width:95%;" >
                  <el-table-column label="标准项目"></el-table-column>
                  <el-table-column label="系统预设"></el-table-column>
                  <el-table-column label="企业自定义"></el-table-column>
                  <el-table-column label="工程内定义"></el-table-column>
                  <el-table-column label="条目总数量"></el-table-column>
              </el-table>
          </div>
          <div class="dataTransAnalysis">
              <h5 class="title"><i class="el-icon-document"></i>数据传递分析</h5>
              <div class="dataTransAnalysisImg">
                <div class="pro"><el-progress type="circle" :percentage="0"></el-progress><p>构建总量909</p></div>
                <div class="pro"><el-progress type="circle" :percentage="25"></el-progress><p>设计识别909</p></div>
                <div class="pro"><el-progress type="circle" :percentage="100" status="success"></el-progress><p>工程计量909</p></div>
                <div class="pro"><el-progress type="circle" :percentage="50" status="exception"></el-progress><p>材料核实909</p></div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name:'DataTransform',
  data(){
      return {

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
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        width: 95%;
        border-bottom:1px solid #ccc; 
        height: 50px;
        line-height: 50px;
        padding:0px 15px;
        margin: 10px 0 0 0 ;
        text-align: left;
    }
    .imp{
        width: 80px;
        float: right;
        cursor: pointer;
    }
    .dataTransAnalysisImg{
        width: 100%;
        margin-top: 20px;
        display: flex;
    }
    .dataTransAnalysisImg .pro{
        flex: 1;
    }
</style>