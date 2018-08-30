<template>
  <div id="datatransform">
      <h4 class="sTitle"><span>数据传递标准概览</span></h4>
      <div class="dataTransformClass">
          <div class="dataCollectAnalysis">
             <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform1.png"/>标准汇总分析<span class="import" @click="importBiaozhun"><span></span>导入标准</span><span class="export" @click="exportBiaozhun"><span></span>导出标准</span></h5>
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
              <h5 class="accountTitle"><img class="imgicon" src="../../assets/dataTransform2.png"/>数据传递分析</h5>
              <div class="dataTransAnalysisImg">
                <div class="pro"><el-progress type="circle" :percentage="100"></el-progress>
                <p>构件总量<span style="margin-left:15px;color:#666666;">{{component.elementCount}}</span></p>
                </div>
                <div class="pro"><el-progress type="circle" :percentage="component.designPercent"></el-progress>
                      <p>设计识别<span style="margin-left:15px;color:#666666;">{{component.designIdentity}}</span></p>
                </div>
                <div class="pro"><el-progress type="circle" :percentage="component.outputPercent"></el-progress>
                     <p>工程计量<span style="margin-left:15px;color:#666666;">{{component.outputTotal}}</span></p>
                </div>
                <div class="pro"><el-progress type="circle" :percentage="component.dischargePercent"></el-progress><p>材料核实<span style="margin-left:15px;color:#666666;">{{component.dischargeTotal}}</span></p></div>
              </div>
          </div>
      </div>
      <div id="edit">
            <el-dialog title="导出标准" :visible.sync="exportDialog" @close="addCancle">
                <div class="editBody">
                    <div class="editBodytwo"><P>请选择需要导出的标准项</P></div>
                    <div class="editBodytwo">
                        <table cellspacing="0" border cellpadding="0" class="elTable">
                            <thead>
                                <tr>
                                    <td>标准类型</td>
                                    <td>预置条目配置</td>
                                    <td>自定义条目</td>
                                    <td>自定义条目配置</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>专业工种分类编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[0]">{{exportStandarInfo.t13Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>作业工具分类编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[1]">{{exportStandarInfo.t17Count}}项</el-checkbox>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>设计构件分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[2]">{{exportStandarInfo.t31ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[3]">{{exportStandarInfo.t31Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[4]">{{exportStandarInfo.t31CustomConfigCount}}项</el-checkbox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>工程招标分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[5]">{{exportStandarInfo.t32ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[6]">{{exportStandarInfo.t32Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[7]">{{exportStandarInfo.t32CustomConfigCount}}项</el-checkbox>
                                    </td>

                                </tr>
                                <tr>
                                    <td>物资采购分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[8]">{{exportStandarInfo.t16ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[9]">{{exportStandarInfo.t16Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[10]">{{exportStandarInfo.t16CustomConfigCount}}项</el-checkbox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>构件属性语意编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[11]">{{exportStandarInfo.t4xCount}}项</el-checkbox>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMakeSure">导出</button>
                    <button class="editBtnC" @click="addCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导入标准" :visible.sync="importDialog" @close="importCancle">
                <div class="editBody">
                    <div class="editBodytwo"><P>请选择需要导入的标准项</P></div>
                    <div class="editBodytwo">
                        <table cellspacing="0" border cellpadding="0" class="elTable">
                            <thead>
                                <tr>
                                    <td>标准类型</td>
                                    <td>预置条目配置</td>
                                    <td>自定义条目</td>
                                    <td>自定义条目配置</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>专业工种分类编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[0]">{{jiexiData.t13Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>作业工具分类编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[1]">{{jiexiData.t17Count}}项</el-checkbox>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>设计构件分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[2]">{{jiexiData.t31ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[3]">{{jiexiData.t31Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[4]">{{jiexiData.t31CustomConfigCount}}项</el-checkbox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>工程招标分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[5]">{{jiexiData.t32ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[6]">{{jiexiData.t32Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[7]">{{jiexiData.t32CustomConfigCount}}项</el-checkbox>
                                    </td>

                                </tr>
                                <tr>
                                    <td>物资采购分类编码</td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[8]">{{jiexiData.t16ConfigCount}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[9]">{{jiexiData.t16Count}}项</el-checkbox>
                                    </td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[10]">{{jiexiData.t16CustomConfigCount}}项</el-checkbox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>构件属性语意编码</td>
                                    <td></td>
                                    <td>
                                        <el-checkbox v-model="isModelChecked[11]">{{jiexiData.t4xCount}}项</el-checkbox>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="editBodytwo">
                        <p>来源信息</p>
                        <p>工程名称：{{jiexiData.projectName}}</p>
                        <p>生成时间：{{jiexiData.createTime}}</p>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importMakeSure">导入</button>
                    <button class="editBtnC" @click="importCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="导入报告" :visible.sync="importResult">
                <div class="editBody">
                    <div class="editBodytwo">
                        <table cellspacing="0" border cellpadding="0" class="elTable">
                            <thead>
                                <tr>
                                    <td>标准类型</td>
                                    <td>新增加条目</td>
                                    <td>更新条目</td>
                                    <td>覆盖配置</td>
                                    <td>取消配置</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>专业工种分类编码</td>
                                    <td>{{importResultData.t13AddCount}}</td>
                                    <td>{{importResultData.t13UpdateCount}}</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>作业工具分类编码</td>
                                    <td>{{importResultData.t17AddCount}}</td>
                                    <td>{{importResultData.t17UpdateCount}}</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>设计构件分类编码</td>
                                    <td>{{importResultData.t31AddCount}}</td>
                                    <td>{{importResultData.t31UpdateCount}}</td>
                                    <td>{{importResultData.t31ConfigUpdateCount}}</td>
                                    <td>{{importResultData.t31ConfigCancelCount}}</td>
                                </tr>
                                <tr>
                                    <td>工程招标分类编码</td>
                                    <td>{{importResultData.t32AddCount}}</td>
                                    <td>{{importResultData.t32UpdateCount}}</td>
                                    <td>{{importResultData.t32ConfigUpdateCount}}</td>
                                    <td>{{importResultData.t32ConfigCancelCount}}</td>
                                </tr>
                                <tr>
                                    <td>物资采购分类编码</td>
                                    <td>{{importResultData.t16AddCount}}</td>
                                    <td>{{importResultData.t16UpdateCount}}</td>
                                    <td>{{importResultData.t16ConfigUpdateCount}}</td>
                                    <td>{{importResultData.t16ConfigCancelCount}}</td>
                                </tr>
                                <tr>
                                    <td>构件属性语意编码</td>
                                    <td>{{importResultData.t4xAddCount}}</td>
                                    <td>{{importResultData.t4xUpdateCount}}</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="importResultSure">确认</button>
                </div>
            </el-dialog>
            <el-dialog title="导入标准" :visible.sync="importStandarShow" @close="upImgCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody"><label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <button @click="selectImg" class="upImgBtn">选择xml文件</button>
                            <input class="upInput"  type="file" accept="xml/*" @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                        <span class="upImgText">{{fileName}}</span> 
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="upImgSure">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
            </el-dialog>
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
            BDMSUrl:'',
            dataTransformInfo:{},
            component:{},
            isModelChecked:[true,true,true,true,true,true,true,true,true,true,true,true],
            exportDialog:false,
            importStandarShow:false,
            importDialog:false,
            importResult:false,
            importResultData:{},
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
            }],
            exportStandarInfo:{},//导出信息数据
            fileName:'未选择任何文件',
            filesList:'',
            jiexiData:{}
        }
    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        this.getDataTransformInfo();
        
    },
    methods:{
        //数据传递标准概览页面信息
        getDataTransformInfo(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/dataTransferStandardOverview',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.dataTransformInfo = response.data.rt;
                    this.component = response.data.rt.component
                    this.dataTransformData[0].sNumber = 0;
                    this.dataTransformData[0].eNumber = 0;
                    this.dataTransformData[0].pNumber = this.dataTransformInfo.mapProjectCount;
                    this.dataTransformData[0].tNumber = this.dataTransformData[0].sNumber+this.dataTransformData[0].eNumber+this.dataTransformData[0].pNumber;
                    
                    this.dataTransformData[1].sNumber = this.dataTransformInfo.t31Count;
                    this.dataTransformData[1].eNumber = this.dataTransformInfo.t31CompanyCount;
                    this.dataTransformData[1].pNumber = this.dataTransformInfo.t31ProjectCount;
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
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取构件分类的属性定义信息(获取数据传递导出弹框信息)
        getExportStandarInfo(){
            axios.get(this.BDMSUrl+'project2/Config/getexportStandardInfo?projId='+this.projId+'&token='+this.token,{
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.exportStandarInfo = response.data.rt;
                }else if(response.data.cd  == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //导出标准
        exportBiaozhun(){
            this.exportDialog = true;
            this.getExportStandarInfo();
        },
        //确认导出
        addMakeSure(){
            var urlP='';
            this.isModelChecked.forEach((item,index)=>{
                if(item){
                    urlP=urlP+'&items='+index;
                }
            })
            this.exportDialog = false;
            var projectName = document.getElementsByClassName('headerText')[0].innerHTML;
            window.open(this.BDMSUrl + 'project2/Config/ExportStandardInfo?projId=' +this.projId + '&projectName=' + projectName + urlP+'&token='+this.token);
        },
        //取消导出
        addCancle(){
            this.exportDialog = false;
        },
        //导入标准
        importBiaozhun(){
            this.importStandarShow = true;
        },
        upImgSure(){
            var formData = new FormData();
            formData.append('fileData',this.filesList[0]);
            if(this.filesList.length == 0){
                alert('请选择上传文件')
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/Config/readStandardInfo',
                    headers:{
                        token:this.token,
                    },
                    params:{
                        projectId:this.projId,
                        items:''
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd == 0){
                        this.jiexiData = response.data.rt;
                        this.importStandarShow = false;
                        this.importDialog = true;
                    }else{
                        alert(response.data.msg)
                    }
                })
            }
        },
        //确认导入
        importMakeSure(){
            var formData = new FormData();
            formData.append('fileData',this.filesList[0]);
            var arr = [];
            this.isModelChecked.forEach((item,index)=>{
                if(item){
                    arr.push(index);
                }
            })
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/importStandardInfo',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    items:arr
                },
                data:formData
            }).then(response=>{
                if(response.data.cd == 0){
                    this.importResultData = response.data.rt;
                    this.importDialog = false;
                    this.importResult = true;
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //取消导入
        importCancle(){
            this.importDialog = false;
        },
        importResultSure(){
            this.importResult = false;
        },
        upImgCancle(){
            this.importStandarShow = false;
        },
        //选择图片
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            const list = this.$refs.file.files;
            this.fileName = list[0].name;
            this.filesList = list;
        },
    }
}
</script>
<style lang="less">
#datatransform{
    width: 100%;
    display: block;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    .elTable{
        margin: 0 auto;
        thead{
            color: #333;
        }
        tbody{
            font-size: 12px;
        }
        td{
            padding:10px;
        }
    }
    .el-table th{
        background-color: #f2f2f2!important;
        height: 36px;
        padding:0;
    }
    .el-table td{
        padding:0;
    }
    .el-table tr{
        height: 36px;
    }
    .updataImageSpan{
        overflow: hidden;
        width: 98px;
    }
    .editBodytwo{
        p{
            width: 439px;
            height: 30px;
            margin-top: 0;
            text-align: left;
            margin: 0 auto;
        }
    }
    .updataImageSpan input{
        position: absolute;
        left: 0px;
        top: 0px;
        opacity: 0;
        /* -ms-filter: 'alpha(opacity=0)'; */
    }
    .el-progress__text{
        color: #666666;
        font-size: 14px!important;
    }
    .dataTransformClass{
        margin: 0 20px 0 15px;
    }
    p{
        font-size: 14px;
        color: #333333;
        line-height: 14px;
        margin-top: 19px;
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
        margin-left: 15px;
        font-size: 18px;
        line-height: 18px;
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
}
</style>