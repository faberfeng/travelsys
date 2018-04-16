<template>
  <div class="wrapper">
      <h4 class="sTitle"><span>数据传递标准概览</span></h4>
      <div class="dataTransformClass">
          <div class="dataCollectAnalysis">
             <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform1.png"/>标准汇总分析<span class="import"><span></span>导入标准</span><span class="export"><span></span>导出标准</span></h5>
              <div class="dataTransformTable" >
                  <el-table border style="width:100%;" :data="dataTransformData">
                    <el-table-column label="标准项目" prop="name"></el-table-column>
                    <el-table-column label="系统预设" prop="sNumber"></el-table-column>
                    <el-table-column label="企业自定义" prop="eNumber"></el-table-column>
                    <el-table-column label="工程内定义" prop="pNumber"></el-table-column>
                    <el-table-column label="条目总数量" prop="tNumber"></el-table-column>
                </el-table>
              </div>
          </div>
          <div class="dataTransAnalysis">
              <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform2.png"/>工程概况</h5>
              <div class="dataTransAnalysisImg">
                <div class="pro"><el-progress type="circle" :percentage="0"></el-progress><p>构件总量</p></div>
                <div class="pro"><el-progress type="circle" :percentage="25"></el-progress><p>设计识别</p></div>
                <div class="pro"><el-progress type="circle" :percentage="100" status="success"></el-progress><p>工程计量</p></div>
                <div class="pro"><el-progress type="circle" :percentage="50" status="exception"></el-progress><p>材料核实</p></div>
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
            dataTransformInfo:{},
            dataTransformData:[{
                name:"设计构件分类映射（Revit映射）",
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,

            },{
                name:"设计构件分类编码" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            },{
                name:"物资采购分类编码" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            },{
                name:"构件属性语意编码（常规属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            },{
                name:"构件属性语意编码（呈现属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0, 
            },{
                name:"构件属性语意编码（设计属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            },{
                name:"构件属性语意编码（设计属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0, 
            },{
                name:"构件属性语意编码（建造属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            },{
                name:"构件属性语意编码（使用属性）" ,
                sNumber:0,
                eNumber:0,
                pNumber:0,
                tNumber:0,
            }]
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getDataTransformInfo();
        this.getExportStandarInfo();
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
                    this.dataTransformData[0].sNumber = 0;
                    this.dataTransformData[0].eNumber = 0;
                    this.dataTransformData[0].pNumber = this.dataTransformInfo.mapProjectCount;
                    this.dataTransformData[0].tNumber = this.dataTransformData[0].sNumber+this.dataTransformData[0].eNumber+this.dataTransformData[0].pNumber;
                    
                    this.dataTransformData[1].sNumber = this.dataTransformInfo.t31Count;
                    this.dataTransformData[1].eNumber = this.dataTransformInfo.t31CompanyCount;
                    this.dataTransformData[1].pNumber = this.dataTransformInfo.t31CompanyCount;
                    this.dataTransformData[1].tNumber = this.dataTransformData[1].sNumber+this.dataTransformData[1].eNumber+this.dataTransformData[1].pNumber;
                    
                    this.dataTransformData[2].sNumber = this.dataTransformInfo.t32Count;
                    this.dataTransformData[2].eNumber = this.dataTransformInfo.t32CompanyCount;
                    this.dataTransformData[2].pNumber = this.dataTransformInfo.t32ProjectCount;
                    this.dataTransformData[2].tNumber = this.dataTransformData[2].sNumber+this.dataTransformData[2].eNumber+this.dataTransformData[2].pNumber;
                    
                    this.dataTransformData[3].sNumber = this.dataTransformInfo.t16Count;
                    this.dataTransformData[3].eNumber = this.dataTransformInfo.t16CompanyCount;
                    this.dataTransformData[3].pNumber = this.dataTransformInfo.t16ProjectCount;
                    this.dataTransformData[3].tNumber = this.dataTransformData[3].sNumber+this.dataTransformData[3].eNumber+this.dataTransformData[3].pNumber;

                    this.dataTransformData[4].sNumber = this.dataTransformInfo.t41Count;
                    this.dataTransformData[4].eNumber = this.dataTransformInfo.t41CompanyCount;
                    this.dataTransformData[4].pNumber = this.dataTransformInfo.t41ProjectCount;
                    this.dataTransformData[4].tNumber = this.dataTransformData[4].sNumber+this.dataTransformData[4].eNumber+this.dataTransformData[4].pNumber;

                    this.dataTransformData[5].sNumber = this.dataTransformInfo.t42Count;
                    this.dataTransformData[5].eNumber = this.dataTransformInfo.t42CompanyCount;
                    this.dataTransformData[5].pNumber = this.dataTransformInfo.t42ProjectCount;
                    this.dataTransformData[5].tNumber = this.dataTransformData[5].sNumber+this.dataTransformData[5].eNumber+this.dataTransformData[5].pNumber;

                    this.dataTransformData[6].sNumber = this.dataTransformInfo.t43Count;
                    this.dataTransformData[6].eNumber = this.dataTransformInfo.t43CompanyCount;
                    this.dataTransformData[6].pNumber = this.dataTransformInfo.t43ProjectCount;
                    this.dataTransformData[6].tNumber = this.dataTransformData[6].sNumber+this.dataTransformData[6].eNumber+this.dataTransformData[6].pNumber;

                    this.dataTransformData[7].sNumber = this.dataTransformInfo.t44Count;
                    this.dataTransformData[7].eNumber = this.dataTransformInfo.t44CompanyCount;
                    this.dataTransformData[7].pNumber = this.dataTransformInfo.t44ProjectCount;
                    this.dataTransformData[7].tNumber = this.dataTransformData[7].sNumber+this.dataTransformData[7].eNumber+this.dataTransformData[7].pNumber;

                    this.dataTransformData[8].sNumber = this.dataTransformInfo.t45Count;
                    this.dataTransformData[8].eNumber = this.dataTransformInfo.t45CompanyCount;
                    this.dataTransformData[8].pNumber = this.dataTransformInfo.t45ProjectCount;
                    this.dataTransformData[8].tNumber = this.dataTransformData[8].sNumber+this.dataTransformData[8].eNumber+this.dataTransformData[8].pNumber;
                    //console.log(this.dataTransformInfo)
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取构建分类的属性定义信息
        getExportStandarInfo(){
            axios.get(this.baseUrl+'project2/Config/getexportStandardInfo?projId='+this.projId,{
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data.rt)
                }else if(response.data.cd  == '-1'){
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
    .dataTransformClass{
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
        line-height: 16px;
        font-family: '微软雅黑';
        font-weight: bold;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 11px;
        margin: 20px 0 0 0;

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