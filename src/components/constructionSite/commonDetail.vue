<template>
    <div id="commonDetail">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{projctName}}</span>
            </p>
        </div>
        <div class="projectBody">
            <div class="projectBodyHead">
                <div class="headLeft">
                    <span class="headLeftBtn">导出</span>
                    <span :class="[{'isClickStyle':isClick},'headLeftBtn']" @click="baseMapEmit()">底图</span>
                    <span :class="[{'isClickStyle':isClick1},'headLeftBtn']" @click="spotClick()">单点</span>
                    <span :class="[{'isClickStyle':isClick2},'headLeftBtn']" @click="spotAllClick()">连续</span>
                    <span :class="[{'isClickStyle':isClick3},'headLeftBtn']" @click="drawingTxtClick()">文字</span>
                </div>
                <div class="headMiddle">
                    <label>测试总数： </label>
                    <label>报警： </label>
                    <label>故障： </label>
                </div>
                <div class="headRight">
                    <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==2" class="import" @click="handExportExcel()">导入</span>
                        <span v-show="importMethod==1" class="import">配置</span>
                </div>
            </div>
            <div class="projectBodyCenter">
                <div class="operateTool">
                    <div class="operateToolLeft" v-show="toolShow">
                        <span class="move" @click="enableMoveCommon"><i class="moveIcon"><label class="moveTxt">移动</label></i></span>
                        <span class="fault" @click="changeBrokenCommon"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                        <span class="deleteDraw" @click="deleteDrawCommon"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                    </div>
                    <div class="operateToolRight" v-show="saveDrawShow" >
                        <label class="saveDrawTxt" @click="saveDraw()">保存</label>
                    </div>
                </div>
                <div class="planeFigureGround" style="padding: 0px; overflow: auto;">
                            <!-- <img v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='jpg'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='png'" style="object-fit: contain;" :src="QJFileManageSystemURL+curBaseMapUrl">
                            <pdf v-show="curBaseMapUrl.substr(curBaseMapUrl.length-3)=='pdf'||curBaseMapUrl.substr(curBaseMapUrl.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+curBaseMapUrl"></pdf> -->
                    <picView ref="pic" @load_points="getAllMonitorPoint" @finish="drawFinish" @status_changed="picView_status_changed" :para="{type:curBaseMapUrl.substr(curBaseMapUrl.length-3),source:QJFileManageSystemURL+curBaseMapUrl}"></picView>
                </div>
                <div class="rightBottomCheck">
                        <el-checkbox v-model="picMark" style="display:block;width:120px;text-align:left">显示照片被标记</el-checkbox>
                        <el-checkbox v-model="displaySpotNum" @change="displaySubmitSpot()" style="display:block;width:100px;text-align:left;margin-left:0px;margin-top:5px;">显示点位读数</el-checkbox>
                </div>
                
            </div>
            <div class="projectBodyBottom">
                <div class="bottomTabel">
                    <table class="bottomTableList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">测点编号</th>
                                <th colspan="2">初始采集</th>
                                <th colspan="2">上次采集</th>
                                <th colspan="2">本次采集</th>
                                <th colspan="3">变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>采集时间</th>
                                <th>位移(mm)</th>
                                <th>变化时间</th>
                                <th>本次(mm)</th>
                                <th>累计(mm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getPointDatasList1" :key="index"> 
                                <td>{{item.pointName|addSprit()}}</td>
                                <td>{{item.initAcquisitionTime|timeChange()}}</td>
                                <td>{{item.initData|addSprit()}}</td>
                                <td>{{item.lastAcquisitionTime|timeChange()}}</td>
                                <td>{{item.lastData|addSprit()}}</td>
                                <td>{{item.latestAcquisitionTime|timeChange()}}</td>
                                <td>{{item.latestData|addSprit()}}</td>
                                <td>{{item.variationTime|timeStamp()}}</td>
                                <td>{{item.recentVariation|addSprit()}}</td>
                                <td>{{item.totalVariation|addSprit()}}</td>
                                <td>
                                    <button title="定位" class="location actionBtn"></button>
                                    <button title="曲线" @click="getCurve(item.pointId)" class="curve actionBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bottomTabelPagination">
                    <div class="paginationLeft">
                        <span class="leftTxtOne"><label style="color:#999;font-size:14px;line-height:62px">报警值：</label><label style="color:#333;font-size:14px;line-height:62px">单次3mm/d</label></span>
                        <span class="leftBtnOne" @click="editAlertValueBtn()">修改</span>
                        <span class="leftTxtTwo">
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">观测：</label><label style="color:#333;font-size:14px;line-height:62px">{{observerName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">计算：</label><label style="color:#333;font-size:14px;line-height:62px">{{calculatorName}}</label>
                            <label style="color:#999;font-size:14px;line-height:62px;display:inline-block;margin-left:30px">检核：</label><label style="color:#333;font-size:14px;line-height:62px">{{inspectorName}}</label>
                        </span>
                        <span class="leftBtnOne" @click="editPersonBtn()">修改</span>
                    </div>
                    <div class="paginationRight">
                        <el-pagination class="elPagination"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage2"
                            :page-sizes="[10]"
                            :page-size="1"
                            layout="sizes,prev, pager, next"
                            :total="getPointDatasListLength">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="修改监测内容相关人员" width="400px" :visible="editPersonShow" @close="editPersonCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText">观测员</label>
                        <select v-model="observerId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">计算员</label>
                        <select v-model="calculatorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText">核查员</label>
                        <select v-model="inspectorId" class="editPersonInput">
                            <option v-for="(item,index) in userGroupList" :key="index" :value="item.userId" v-text="item.userName"></option>
                        </select>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editPersonMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editPersonCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改报警值" width="600px" :visible="editAlertValueShow" @close="editAlertValueCancle()">
                <div class="editbody">
                    <div class="editBodyone">
                        <label class="editInpText" style="width:27% !important">累计报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertTotal" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm   kN</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertDay" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm/d  kN/d</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editInpText" style="width:27% !important">单次报警变化量：</label>
                        <input placeholder="请输入" v-model="variationAlertHour" class="inp" style="width:200px !important;height:32px !important"/>
                        <label>mm/h  kN/h</label>
                    </div>
                    <!-- <div class="editBodytwo">
                        <label class="editInpText">单次报警变化量：</label>
                    </div> -->
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editAlertArgumentsMakeSure()" >确定</button>
                    <button class="editBtnC" @click="editAlertValueCancle()" >取消</button>
                </div>
            </el-dialog>
            <!-- <el-dialog title="导入采集数据" :visible="importGatherDataShow" @close="importGatherDataCancle()">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">本地Excel文档:</label>
                        <span class="updataImageSpan">
                            <label for="fileInfo">
                                <button class="upImgBtn" >选择文件</button>
                                <input type="file" ref="importExcel" id="fileInfo" @change="addExcel($event)" class="upinput"/>
                            </label>
                            <span class="upImgText">{{excelFileListName}}<label v-show="!excelFileListName">未选择任何文件</label></span>
                        </span>
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">使用Excel表名:</label><select v-model="sheetIndex" class="sheetName"><option v-for="(item,index) in excelSheetInfo"  :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao1"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">对应监测内容:</label><label >{{monitorImportName}}</label></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">点位编号列名:</label><select v-model="spotNumCol" placeholder="请选择"  class="spotNumName"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao2"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集时间列名:</label><select class="gatherTimeName" v-model="timeCol" placeholder="请选择"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" ><label class="editInpText" style="width:18% !important;"><el-checkbox>使用统一时间:</el-checkbox><el-date-picker style="width:374px !important;margin-left:141px;margin-top:-40px;" v-model="unifiedTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker></label></div>
                    <div class="editBodytwo" v-show="monitorImportType==1"><label class="editInpText" style="width:18% !important;">位移取值列名:</label><select class="gatherTimeName" v-model="distanceCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==2"><label class="editInpText" style="width:18% !important;">高程取值列名:</label><select class="gatherTimeName" v-model="altitudeCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao3"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">管口标高取值列名:</label><select class="gatherTimeName" v-model="pipeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao4"></i></div>
                    <div class="editBodytwo" v-show="monitorImportType==3"><label class="editInpText" style="width:18% !important;">水位深度取值列名:</label><select class="gatherTimeName" v-model="gaugeHeightCol"><option v-for="(item,index) in sheetIndexList" :value="item.index" :key="index" v-text="item.name"></option></select><i class="icon-sanjiao5"></i></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="saveImportColumnValue" @change="saveImportColumnSetting()">保存以上列名匹配为默认</el-checkbox></label></div>
                    <div class="editBodytwo editBodytwo1" ><label class="editInpText editInpText1" style="width:18% !important;">现场监测工况:</label><textarea placeholder="请输入" class="spotTextArea" v-model="inputWorkingCondition"></textarea></div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;"><el-checkbox v-model="overwrite">覆盖上一次导入的数据</el-checkbox></label></div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" v-show="monitorImportType==4" @click="formulaSetting()" >公式设定</button>
                        <button class="editBtnC" style="margin-right:88px;" @click="verifyExcelDataBtn()">测试</button>
                        <button class="editBtnS" @click="importExcelDataMakeSure()" >确定</button>
                        <button class="editBtnC" @click="importGatherDataCancle()" >取消</button>
                </div>
            </el-dialog> -->
            <el-dialog title="底图管理" :visible="baseMapShow" @close="baseMapCancle()" width="740px">
                <div class="baseMapBody">
                    <ul class="clearfix" style="margin:0px 20px 0px 20px;">
                        <li class="baseMapBodyLi" @mouseenter="enter(item.id)" @mouseleave="leave()" @click="selectCurBaseMap(item.id)" style="padding: 0px; overflow: hidden;" v-for="(item,index) in baseCommonMapList" :key="index">
                            <img v-show="item.relativeUri.substr(item.relativeUri.length-3)=='jpg'||item.relativeUri.substr(item.relativeUri.length-3)=='png'" style="object-fit: contain;" class="baseMapBodyImg" :src="QJFileManageSystemURL+item.relativeUri">
                            <pdf v-show="item.relativeUri.substr(item.relativeUri.length-3)=='pdf'||item.relativeUri.substr(item.relativeUri.length-3)=='PDF'" ref="pdfDocument" id="drawingPdf"  :src="QJFileManageSystemURL+item.relativeUri"></pdf>
                            <div class="baseMapBodyLiBottom" v-show="item.id==hoverId">
                                <label class="baseMapName" v-text="item.name"></label>
                                <label v-show="item.useCount!=0" class="baseMapCount" >在用{{item.useCount}}</label>
                                <label v-show="item.useCount==0" class="deleteBaseMap" @click.stop="deleteBaseMap(item.id)"></label>
                            </div>
                        </li>
                        <li class="uploadBaseBody">
                            <div class="uploadBaseIcon">
                                <label for="drawingsInfo">
                                    <img style=" cursor: pointer"  src="./images/upload.png">
                                    <p>上传新底图</p>
                                </label>
                                <input class="upInput"  type="file"  @change="addBaseMap($event)" ref="drawingsInfo"  id="drawingsInfo" multiple="multiple">
                            </div>
                        </li>
                    </ul>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import picView from './picView.vue'
import pdf from 'vue-pdf'
import data from '../Settings/js/date';
export default Vue.component('commonDetail',{
    props:['projctName','itemMonitorId','itemMonitorType','userGroupId','itemMonitorKeyWord','curBaseMapUrl','itemSubmitbaseMapId'],
    components:{
            pdf,picView
    },
    name:'commonDetail',
    data(){
        return{
            picMark:false,
            displaySpotNum:false,
            importMethod:1,
            importList:[
                {
                    value:1,
                    label:'自动采集'
                },
                {
                    value:2,
                    label:'手动导入'
                }
            ],
            currentPage2:1,
            getAlertArgumentsList:'',//获取报警参数
            getPointDatasList:'',//数据表格
            getPointDatasList1:[],
            getPointDatasListLength:0,//数据表格长度
            pointId:'',//监测id
            editPersonShow:false,
            editAlertValueShow:false,//编辑报警值
            userGroupList:'',//监测人员列表
            observerId:"",
            calculatorId:'',
            inspectorId:'',
            observerName:'',
            calculatorName:'',
            inspectorName:'',
            getItemDutyUserList:'',
            variationAlertTotal:'',//报警变化量（累计）
            variationAlertDay:'',//报警变化量（天）
            variationAlertHour:'',//报警变化量（小时）
            commonMonitorMainItemList:'',//监测内容
            curCommonBaseMapUrl:'',//监测地址
            baseCommonMapList:'',
            monitorBaseMapId:'',
            baseMapShow:false,//底图显示
            hoverId:'',
            isClick:false,
            isClick1:false,
            isClick2:false,
            isClick3:false,
            toolShow:false,
            saveDrawShow:false,
            pageSize:10,
            pageNum:1
        }
    },
    created(){
        var vm = this;
        vm.userName  = localStorage.getItem('userName');
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId');
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getPointDatas();
        this.getUserByUserGroup();
        this.getItemDutyUser();
        this.getAllMonitorPoint();
        this.getMonitorItem()
        // this.getBaseMapList();
    },
    filters:{
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
            }
        },
        timeStamp(StatusMinute){	
            var day=parseInt(StatusMinute/1000/60/60/24);
            var hour=parseInt(StatusMinute/1000/60/60%24);
            var min= parseInt(StatusMinute/1000/60%60);
            StatusMinute="";
            if (day > 0)
            {
                StatusMinute= day + "d";
            } 
            if (hour>0)
            {
                StatusMinute += hour + "h";
            } 
            if (min>0)
            {
                StatusMinute += parseFloat(min) + "m";
            }
                return StatusMinute;
        }

    },
    watch:{
        userGroupId:function(val){
            // this.getBaseMapList()
            
        },
        // calculatorId:function(val){

        // },
        // observerId:function(val){

        // },
        // inspectorId:function(val){

        // }



    },
    mounted(){
        setTimeout(() => {
            this.displayInspectSpot()
        }, 200);
        // console.log(12);
    },
    methods:{
        displaySubmitSpot(){
            this.$refs.pic.enableLabel(this.displaySpotNum);

        },
        //显示当前监测内容监测点
        displayInspectSpot(){
            // console.log(this.commonMonitorMainItemList);
             for(let i = 0; i < this.commonMonitorMainItemList.length;i++){
                this.$refs.pic.enableType(this.commonMonitorMainItemList[i].type,this.commonMonitorMainItemList[i].id,this.commonMonitorMainItemList[i].spotNum);
            }
            this.$refs.pic.enableType(this.itemMonitorType,this.itemMonitorId,true);
            // console.log('触发')
        },
        baseMapCancle(){
            this.baseMapShow=false;
        },
        //返回
        back(){
            var vm = this
            vm.$emit('back')
        },
        //底图选择
        baseMapEmit(){
            // this.baseMapShow=true;
            this.isClick=true;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            // this.getBaseMapList();
            var vm=this;
            vm.$emit('baseMapEmit')
        },
        //单点
        spotClick(){
            this.isClick=false;
            this.isClick1=true;
            this.isClick2=false;
            this.isClick3=false;
            this.saveDrawShow=true;
            this.$refs.pic.setDrawStatus("onePoint",this.itemMonitorType,this.itemMonitorId,1);
        },
        //连续
        spotAllClick(){
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=true;
            this.isClick3=false;
            this.saveDrawShow=true;
            this.$refs.pic.setDrawStatus("onePoint",this.itemMonitorType,this.itemMonitorId,2);
        },
        //文字
        drawingTxtClick(){
            this.isClick=false;
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=true;
            this.$refs.pic.setDrawStatus("text",10000,10000,2);
        },
         //开启移动
        enableMoveCommon(){
            this.$refs.pic.setMoveStatus();
        },
        //删除点
        deleteDrawCommon(){
            this.$refs.pic.deleteDraw();
        },
        //修复故障
        changeBrokenCommon(){
            this.$refs.pic.changeBroken();
        },
        handleSizeChange(val){
            this.pageSize=val;
            this.getPointDatasList1=[];
            if(this.getPointDatasListLength<11){
                for(var i=0;i<this.getPointDatasListLength-1;i++){
                        this.getPointDatasList1.push(this.getPointDatasList[i])
                    }
            }else if(this.getPointDatasListLength>10){
                if(this.pageNum==1){
                    var num=0;
                    var num2=9*(this.pageSize);

                }else if(this.pageNum!=1){
                    if(this.getPointDatasListLength%(this.pageSize)!=0){
                        var num=(this.pageNum-1)*(this.pageSize)
                        var num2=(this.pageNum-1)*(this.pageSize)+((this.getPointDatasListLength)%(this.pageSize))
                    }else{
                        num2=(this.pageNum-1)*(this.pageSize)+(9+(this.pageNum-1)*(this.pageSize))
                    }
                }
                // console.log(num,'num')
                //  console.log(num2,'num2')
                for(var i=num;i<num2;i++){
                    this.getPointDatasList1.push(this.getPointDatasList[i])
                }
            }
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val){
            this.getPointDatasList1=[];
            this.pageNum=val;
            if(this.getPointDatasListLength<11){
                for(var i=0;i<this.getPointDatasListLength-1;i++){
                        this.getPointDatasList1.push(this.getPointDatasList[i])
                    }
            }else if(this.getPointDatasListLength>10){
                if(this.pageNum==1){
                    var num=0;
                    var num2=9;

                }else if(this.pageNum!=1){
                    if(this.getPointDatasListLength%(this.pageSize)!=0){
                        var num=(this.pageNum-1)*(this.pageSize)
                        var num2=(this.pageNum-1)*(this.pageSize)+((this.getPointDatasListLength)%(this.pageSize))
                    }else{
                        num2=(this.pageNum-1)*(this.pageSize)+(9+(this.pageNum-1)*(this.pageSize))
                    }
                }
                // console.log(num,'num')
                //  console.log(num2,'num2')
                for(var i=num;i<num2;i++){
                    this.getPointDatasList1.push(this.getPointDatasList[i])
                }
            }
            // console.log(this.getPointDatasList1,'this.getPointDatasList1');
            // console.log(`当前页: ${val}`);
        },
         //获取底图中所有的监测点
        getAllMonitorPoint(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getAllMonitorPoint',
                headers:{
                    'token':vm.token
                },
                params:{
                    baseMapId:vm.itemSubmitbaseMapId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.monitorPointInfo=response.data.rt;
                    this.$refs.pic.loadPoints(this.monitorPointInfo);
                }
            })
        },
        drawFinish(){
            this.isClick1=false;
            this.isClick2=false;
            this.isClick3=false;
            this.isClick=false;
            this.saveDrawShow=true;
        },
        picView_status_changed(val){
            // console.log(val);
            this.toolShow=val;
            this.saveDrawShow=val;
        },
        enter(val){
            this.hoverId=val;
        },
        leave(){
            this.hoverId='';

        },
        //删除当前底图
        deleteBaseMap(){

        },
        //选择当前底图
        selectCurBaseMap(){

        },
        //获取底图列表
        // getBaseMapList(){
        //     var vm=this;
        //     axios({
        //         method:'post',
        //         url:vm.BDMSUrl+'detectionInfo/getBaseMapList',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             userGroupId:vm.userGroupId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd=='0'){
        //             this.baseCommonMapList=response.data.rt;
        //             // console.log(this.baseMapList);
        //             //判断是否使用当前图纸
        //             if(!this.curCommonBaseMapUrl){
        //                 this.baseCommonMapList.forEach((item)=>{
        //                     if(item.isUsed==1){
        //                         this.curCommonBaseMapUrl=item.relativeUri;
        //                         this.monitorBaseMapId=item.id;
        //                         this.getAllMonitorPoint();
        //                     }
        //                 })
        //             }
        //             if(this.monitorBaseMapId){
        //                 this.baseCommonMapList.forEach((item)=>{
        //                     if(item.id==this.monitorBaseMapId){
        //                         this.curCommonBaseMapUrl=item.relativeUri;
        //                     }
        //                 })
        //             }
        //         }else{
        //             vm.$message({
        //                 type:"error",
        //                 msg:response.data.msg
        //             })
        //         }
        //     })
        // },
         //获取监测内容
        getMonitorItem(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getMonitorItem',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:vm.userGroupId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.commonMonitorMainItemList=response.data.rt;
                    this.commonMonitorMainItemList.forEach((item,index)=>{
                        this.$set(item,'spotNum',false)
                    })
                    // for(let i = 0; i < this.commonMonitorMainItemList.length;i++){
                    //     this.$refs.pic.enableType(this.commonMonitorMainItemList[i].type,this.commonMonitorMainItemList[i].id,this.commonMonitorMainItemList[i].spotNum);
                    // }
                    // this.drawItemId=this.commonMonitorMainItemList[0].id;
                    // this.drawItemType=this.commonMonitorMainItemList[0].type;
                    // console.log(this.commonMonitorMainItemList,'monitorMainItemList')
                }
            })
        },
        //获取群组中的用户
        getUserByUserGroup(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getUserByUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    userGroupId:this.userGroupId
                     
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.userGroupList=response.data.rt;
                    this.observerId=this.userGroupList[0].userId;
                    this.calculatorId=this.userGroupList[0].userId;
                    this.inspectorId=this.userGroupList[0].userId;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //手动导入数据
        handExportExcel(){
            this.$emit('importDataShow',true,this.itemMonitorId,this.projctName,this.itemMonitorType,this.itemMonitorKeyWord)
        },
        //获取用户名
        getUserName(){
            
        },
        saveDraw(){
            var vm=this;
            var list = this.$refs.pic.saveList();
            // console.log(list);
            axios({
                    method:'POST',
                    url:vm.BDMSUrl+'detectionInfo/editAllMonitorPoint',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        baseMapId:vm.itemSubmitbaseMapId
                    },
                    data:list
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.$message({
                            type:'success',
                            message:'保存监测点成功'
                        })
                        this.saveDrawShow=false;
                        this.getAllMonitorPoint();
                    }else if(response.data.cd=='-1'){
                        
                         this.$message({
                            type:'success',
                            message:response.data.msg
                        })
                    }
                })
        },
        //获取警报参数
        getAlertArguments(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getAlertArguments',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getAlertArgumentsList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //编辑警报参数
        editAlertArgumentsMakeSure(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editAlertArguments',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    variationAlertTotal:this.variationAlertTotal,
                    variationAlertDay:this.variationAlertDay,
                    variationAlertHour:this.variationAlertHour
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editAlertValueShow=false;
                    this.getAlertArguments();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        editAlertValueBtn(){
            this.editAlertValueShow=true;
        },
        //编辑相关人员
        editPersonBtn(){
            this.editPersonShow=true;
            this.getUserByUserGroup();
        },
        //取消监测项目人员
        editPersonCancle(){
            this.editPersonShow=false;
        },
        //编辑项目人员
        editPersonMakeSure(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    observer:this.observerId,
                    calculator:this.calculatorId,
                    inspector:this.inspectorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.editPersonShow=false;
                    this.getItemDutyUser();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取监测项目相关人员
        getItemDutyUser(){
            var vm=this;
            // this.getUserByUserGroup();
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getItemDutyUser',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.rt){
                     this.getItemDutyUserList=response.data.rt;
                     this.inspectorName=this.getItemDutyUserList.inspectorName;
                     this.calculatorName=this.getItemDutyUserList.calculatorName;
                     this.observerName=this.getItemDutyUserList.observerName;
                    // console.log(this.userGroupList)
                    //  this.userGroupList.forEach((item)=>{
                    //      if(this.getItemDutyUserList.inspector==item.userId){
                    //          this.inspectorName=item.userName;
                    //      }
                    //      if(this.getItemDutyUserList.calculator==item.userId){
                    //          this.calculatorName=item.userName;
                    //      }
                    //      if(this.getItemDutyUserList.observer==item.userId){
                    //          this.observerName=item.userName;
                    //      }
                    //  })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //取消编辑报警值
        editAlertValueCancle(){
            this.editAlertValueShow=false;
        },
        // 获取监测点采集数据（表格）
        getPointDatas(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointDatas',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPointDatasList=response.data.rt;
                    this.getPointDatasListLength=response.data.rt.length;
                    if(this.getPointDatasListLength<11){
                        for(var i=0;i<this.getPointDatasListLength-1;i++){
                            this.getPointDatasList1.push(this.getPointDatasList[i])
                        }
                    }else{
                        for(var i=0;i<10;i++){
                            this.getPointDatasList1.push(this.getPointDatasList[i])
                        }
                    }
                    // console.log(this.getPointDatasList1,'123');
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //点击获得曲线
        getCurve(pointId){
            this.pointId=pointId;
            if(this.itemMonitorType==1){
                this.getPointHorizontalShiftChartData()
            }else if(this.itemMonitorType==2){
                this.getPointVerticalShiftChartData()
            }else if(this.itemMonitorType==3){
                this.getPointGaugeChartData()
            }else if(this.itemMonitorType==4){
                this.getPointForceChartData()
            }
        },
        //获取30天曲线图（受力）
        getPointForceChartData(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointForceChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水位）
        getPointGaugeChartData(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointGaugeChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（水平位移）
        getPointHorizontalShiftChartData(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointHorizontalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取30天曲线图（垂直位移）
        getPointVerticalShiftChartData(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getPointVerticalShiftChartData',
                headers:{
                    'token':this.token
                },
                params:{
                    pointId:this.pointId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },


    }
})
</script>
<style lang="less">
    *{
        margin:0;
        padding: 0;
        box-sizing: border-box;
    }
    .isClickStyle{
         color: #ffffff !important;
        background: #fc3439 !important;
    }
    i{
        font-style:normal
    }
    li{list-style: none}
    select.autoImport{
            /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
                /*很关键：将默认的select选择框样式清除*/  
                appearance:none;  
                -moz-appearance:none;  
                -webkit-appearance:none;  
                /*在选择框的最右侧中间显示小箭头图片*/  
                /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
                padding-right: 14px;  

    }
    #commonDetail{
        margin: 0 20px 20px!important;
        .project{
            width: 100%;
            max-height: 800px;
            .antsLine{
                    padding: 10px 10px 15px 0px;
                    font-size: 12px;
                    line-height: 12px;
                    color: #999999;
                    text-align: left;
                    .icon-sanjiao-right{
                        display: inline-block;
                        width: 7px;
                        height: 10px;
                        margin: 2px 7px 0;
                        background-image:url('../ManageCost/images/sanjiaoright.png');
                        background-size: 100% 100%;
                    }
                    .strong{
                        cursor: pointer;
                        color: #333333;
                        font-weight: bold;
                        &:last-of-type .icon-sanjiao-right{
                            display: none;
                        }
                    }    
                }
            }
        .projectBody{
            width: 98%;
            margin:0 auto;
            .projectBodyHead{
                height: 32px;
                margin-top:26px;
                .headLeft{
                    float: left;
                    .headLeftBtn{
                        display: inline-block;
                        width: 54px;
                        height: 25px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 25px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 2px;
                        cursor: pointer;
                        margin-right: 3px;
                    }
                }
                .headMiddle{
                    width: 400px;
                    display: inline-block;
                    label{
                        line-height: 32px;
                        font-size: 14px;
                        color: #333333;
                    }
                }
                .headRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
                        color:#999999;
                        font-size: 12px;
                        width: 60px;
                        height: 26px;
                        line-height: 26px;
                    }
                    .autoImport{
                        width: 121px;
                        height: 26px;
                        border: 1px solid #cccccc;
                        position: relative;
                        background: #fff;
                        padding-left: 10px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        margin-right: 0px;
                        color: #333333;
                        font-size: 14px;
                        border-radius: 2px;
                        outline: none;
                    }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image: url('../Settings/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 11px;
                        right: 65px;
                    }
                    .import{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
            }
            .projectBodyCenter{
                        margin-top:15px !important;
                        margin:0 auto;
                        border:1px solid #e6e6e6;
                        height: 540px;
                        width: 100%;
                        position: relative;
                        .operateTool{
                            width: 288px;
                            height: 34px;
                            // border:1px solid #ccc;
                            float: right;
                            margin-top:15px;
                            margin-right:10px;
                            position: relative;
                            z-index: 10;
                            .operateToolLeft{
                                width:216px;
                                height: 34px;
                                float: left;
                                position: relative;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                background: #fff;
                                .move{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                   margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                     
                                    left:0%;
                                    .moveIcon{
                                        background: url('./images/move.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/move1.png') no-repeat 0 0;
                                        }
                                         .moveTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                      
                                        }
                                    }
                                   
                                }
                                .fault{
                                    display: inline-block;
                                    width: 33%;
                                    height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    border-right:1px dashed #ccc;
                                    left:33%;
                                    .faultIcon{
                                        background: url('./images/falut.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/fault1.png') no-repeat 0 0;
                                        }
                                         .faultTxt{
                                            line-height: 20px;
                                            color:#666666;
                                            font-size: 12px;
                                            display: block;
                                            margin-left: 12px;
                                            margin-top: 1px;
                                        }
                                    }
                                   
                                }
                                .deleteDraw{
                                    display: inline-block;
                                     height: 28px;
                                    margin-top:3px;
                                    position: absolute;
                                    left:72%;
                                    .deleteDrawIcon{
                                        background: url('./images/delete.png') no-repeat 0 0;
                                        width: 54px;
                                        height: 20px;
                                        display: inline-block;
                                        margin-right: -8px;
                                        margin-top: 2px;
                                        cursor: pointer;
                                        &:hover{
                                            background:url('./images/delete.png') no-repeat 0 0;
                                        }
                                    }
                                    .deleteDrawTxt{
                                        line-height: 20px;
                                        color:#666666;
                                        font-size: 12px;
                                        display: block;
                                        margin-left: 12px;
                                        margin-top: 1px;
                                    }
                                }

                            }
                            .operateToolRight{
                                float: right;
                                width: 62px;
                                height: 34px;
                                margin-left:10px;
                                border:1px solid #ccc;
                                border-radius:2px;
                                box-shadow: 1px 1px 2px #888888;
                                background: #fff;
                                .saveDrawTxt{
                                    font-size:12px;
                                    color:#666666;
                                    line-height: 32px;
                                }
                            }

                        }
                        .planeFigureGround{
                            z-index: 8;
                            height: 540px;
                            width: 100%;
                            position:absolute;
                            top:0px;
                            left: 0px;

                            img{
                                width: 100%;
                                height: 100%;
                                padding:5px;
                            }
                            #drawingPdf{
                                 width: 100%;
                                height: 530px;
                                padding:5px;
                            }
                        }
                        .rightBottomCheck{
                            position: absolute;
                            bottom:30px;
                            left:30px;
                            z-index:11;
                        }

            }
            .projectBodyBottom{
                margin-top:30px;
                .bottomTabel{
                    .bottomTableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                }
                            }
                             tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                        .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;
                                        }
                                        .location{
                                            background: url('../planCost/images/location.png') no-repeat 0 0;
                                        }
                                        .curve{
                                            background: url('./images/graph.png') no-repeat 0 0;
                                        }

                                    }
                                }
                             }
                    }
                }
                .bottomTabelPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .paginationLeft{
                        position: absolute;
                        left: 50px;
                        bottom: 0px;
                        .leftBtnOne{
                            display: inline-block;
                            width: 54px;
                            height: 25px;
                            border: 1px solid #e6e6e6;
                            background: #e6e6e6;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            margin-left: 30px;
                            margin-right: 100px;
                        }


                    }
                    .paginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 10px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                        .elPagination{
                            

                        }
                    }
                }
            }


        }
        #edit{
            .editPersonInput{
                width: 200px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .baseMapBody{
                height: 460px;
                .clearfix{
                    clear: both;
                    overflow: hidden;
                    content: '';
                }
                .baseMapBodyLi{
                    float: left;
                    display: inline-block;
                    position: relative;
                    width: 164px;
                    height: 122px;
                    // background: #f0f1f4;
                    margin-right: 10px;
                    margin-top:20px;
                    border-radius: 4px;
                    &:hover{
                        border:1px solid #ccc;
                    }
                    .baseMapBodyImg{
                        width: 100%;
                        height: 122px;
                        margin: 0;
                        padding: 0;
                        border-radius: 2px;
                        cursor: pointer;
                        object-fit: contain;
                        background: #f0f1f4;

                    }
                    .baseMapBodyLiBottom{
                        position: absolute;
                        width: 100%;
                        height: 26px;
                        background-color: #000;
                        opacity: 0.3;;
                        bottom: 0px;
                        left:0px;
                        .baseMapName{
                            color:#fff;
                            font-weight: bold;
                            float: left;
                            margin-left:10px;
                            width: 100px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .baseMapCount{
                            color:#fff;
                            font-weight: bold;
                            float: right;
                            margin-right: 10px

                        }
                        .deleteBaseMap{
                            background: url('./images/delete.png') no-repeat 0 0;
                            width: 20px;
                            height: 20px;
                            display: inline-block;   
                            float:right;
                            cursor: pointer;
                            margin-right:5px;
                        }
                    }
                }
                .uploadBaseBody{
                    float: left;
                    display: inline-block;
                    width: 164px;
                    height: 122px;
                    margin-top:20px;
                    background: #f0f1f4;
                    border-radius: 4px;
                    cursor: pointer;
                    &:hover{
                        border:1px dashed #0d6cb2;
                    }
                    .uploadBaseIcon{
                        // cursor: pointer;
                        margin:25px auto;
                        .upInput{
                            display: none;
                        }
                    }
                } 
            }
        }
    }

</style>


