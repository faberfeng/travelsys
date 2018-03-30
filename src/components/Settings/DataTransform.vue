<template>
  <div class="wrapper">
      <h4 class="sTitle"><span>数据传递标准预览</span></h4>
      <div class="dataTransform">
          <div class="dataCollectAnalysis">
              
             <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform1.png"/>标准汇总分析<span class="import"><span></span>导入标准</span><span class="export"><span></span>导出标准</span></h5>
              <div class="dataTransformTable">
                  <el-table border style="width:100%;" >
                    <el-table-column label="标准项目"></el-table-column>
                    <el-table-column label="系统预设"></el-table-column>
                    <el-table-column label="企业自定义"></el-table-column>
                    <el-table-column label="工程内定义"></el-table-column>
                    <el-table-column label="条目总数量"></el-table-column>
                </el-table>
              </div>
          </div>
          <div class="dataTransAnalysis">
              <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform2.png"/>工程概况</h5>
              <div class="dataTransAnalysisImg">
                <div class="pro"><el-progress type="circle" :percentage="0"></el-progress><p>构建总量</p></div>
                <div class="pro"><el-progress type="circle" :percentage="25"></el-progress><p>设计识别909</p></div>
                <div class="pro"><el-progress type="circle" :percentage="100" status="success"></el-progress><p>工程计量909</p></div>
                <div class="pro"><el-progress type="circle" :percentage="50" status="exception"></el-progress><p>材料核实909</p></div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'DataTransform',
    data(){
        return {
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
            dataTransformInfo:{}
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getDataTransformInfo();
    },
    methods:{
        //数据传递标准概览页面信息
        getDataTransformInfo(){
            axios({
                method:'get',
                url:this.baseUrl+'project2/Config/dataTransferStandardOverview',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.dataTransformInfo = response.data.rt;
                    console.log(response.data)
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
    }
    .dataTransform{
        width: calc(100vw - 254px);
        margin: 0 20px 0 15px;
    }
    .sTitle{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        width: 100%;
        border-bottom:1px solid #ccc; 
        height: 50px;
        line-height: 50px;
        margin: 0 ;
        text-align: left;
    }
    .sTitle span{
        margin-left: 20px;
    }
    .accountTitle{
        width: 100%;
        color: #fc3439;
        text-align: left;
        font-size: 16px;
        font-family: '微软雅黑';
        font-weight: bold;
        margin: 20px 0px 0px 0px;
        border-bottom: 1px solid #e6e6e6;
        height: 45px;
        line-height: 45px;
    }
    .imgicon {
        position: relative;
        top: 1px;
        margin-right: 6px;
    }
    .import,.export{
        float: right;
        color: #666;
        font-weight: normal;
        cursor: pointer;
        font-size: 14px;
        font-weight: normal;
    }
    .import:hover,.export:hover{
        color: #fc3439;
    }
    .export{
        display: inline-block;
        margin-right: 24px;
    }
    .import span{
        width: 16px;
        height: 16px;
        display: inline-block;
        background: url("../../assets/dataTransform3.png")
    }
    .export span{
        width: 16px;
        height: 16px;
        display: inline-block;
        background: url("../../assets/dataTransform4.png")
    }
    .import span,.export span{
        margin-right: 10px;
        position: relative;
        top: 2px;
    }
    .imp{
        width: 80px;
        float: right;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        font-weight: normal;
    }
    
    .dataTransformTable{
        margin: 20px 0px 0 0px;
        width: 100%;
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