<template>
    <div id="htlmToPdf">
        <div  class="pdfStyle" id="pdfDom">
                <!-- 封面 -->
                <div class="pdfCover">
                    <div class="pdfImg">
                        <img id="img1" style="width:400px;height:100px;" src="../../assets/huajianlogo.png"/>
                    </div>
                    <h5 style="margin-top:20px;color:#000;font-size:18px;">{{projectName}}--监测报表</h5>
                    <div class="time"><label>本次观测日期:</label><label>2018/11/12</label><label>前次观测日期:</label><label>2018/11/11</label></div> 
                    <div class="tableList">
                        <div class="tableListDiv">
                            <ul>
                                <li ></li>
                            </ul>
                        </div>
                    </div>       
                </div>
                <!-- 概述 -->
                <div class="pdfSummary">
                    <label class="pdfSummaryHead">概述</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <div class="inspectTableList1">
                        <table class="inspectTableList" border="1" cellspacing="0" width="100%">
                                <!-- <tr class="contentTr"></tr> -->
                                <thead>
                                    <tr>
                                        <th style="height:100px;">工况</th>
                                        <th style="height:100px;" colspan="11"></th>
                                    </tr>
                                    <tr>
                                        <th rowspan="2">序号</th>
                                        <th rowspan="2">监测类型</th>
                                        <th rowspan="2">监测内容</th>
                                        <th rowspan="2">简写</th>
                                        <th rowspan="2">测点数</th>
                                        <th rowspan="2">最新数据</th>
                                        <th colspan="3">本次最大变化量</th>
                                        <th colspan="3">累计最大变化量</th>
                                    </tr>
                                    <tr>
                                        <th>点号</th>
                                        <th>取值</th>
                                        <th >报警</th>
                                        <th>点号</th>
                                        <th>取值</th>
                                        <th>报警</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in getMonitorMainTableList" :key="index">
                                        <td v-text="index+1"></td>
                                        <td>{{item.type|monitorTypeChange()}}</td>
                                        <td v-text="item.name"></td>
                                        <td v-text="item.logogram"></td>
                                        <td v-text="item.count"></td>
                                        <td >{{item.latestTime|timeChange()}}</td>
                                        <td >{{item.recentPointName|addSprit()}}</td>
                                        <td>{{item.recentVariation|addSprit1()}}</td>
                                        <td :class="[{'red':item.recentAlert==true}]" >{{item.recentAlert|shifouChange()}}</td>
                                        <td>{{item.totalPointName|addSprit()}}</td>
                                        <td>{{item.totalVariation|addSprit2()}}</td>
                                        <td :class="[{'red':item.totalAlert==true}]">{{item.totalAlert|shifouChange()}}</td>
                                    </tr>
                                    <tr>
                                        <td style="height:100px;">巡视情况</td>
                                        <td style="height:100px;" colspan="11"></td>
                                    </tr>
                                    <tr>
                                        <td style="height:100px;">监测综述及建议</td>
                                        <td style="height:100px;" colspan="11"></td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>

                </div>
                <!-- 现场巡检 -->
                <div class="pdfInspection">
                     <label class="pdfSummaryHead">现场巡检</label>
                    <div class="pdfSummarytext"><label>工程名称:{{projectName}}</label></div>
                    <!-- <div class="containerTable">
                    <table class="containerList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">分类</th>
                                <th rowspan="2">巡视监测内容</th>
                                <th colspan="2"><label class="left" @click="getPreviousHistoryRecord()">上一次</label><label class="middle">历史巡视{{historyTime|timeChange()}}</label><label class="right" @click="getNextHistoryRecord()" >下一次</label></th>
                                <th colspan="2">最近巡视(今天)</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>结果</th>
                                <th>备注</th>
                                <th>结果</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            <tr v-for="(item,index) in getPatrolRecordLists" :key="index">
                                <td :rowspan="item.patrolTypeNamespan" :class="{'hidden': item.patrolTypeNamedis}">{{item.patrolTypeName}}</td>
                                <td :rowspan="item.patrolNamespan" :class="{'hidden': item.patrolNamedis}" v-text="item.patrolName"></td>
                              
                                <td  v-text="item.historyResult"></td>
                                <td  v-text="item.historyRemark"></td>
                                <td v-show="saveShow"  v-text="item.recentResult"></td>
                                <td v-show="saveShow" v-text="item.recentRemark"></td>
                            
                                <td width="180px" ><label v-show="!isEditShow&&hasTodayRecordBoolen">{{item.todayResult}}</label><input v-show="isEditShow" :id="'inputResult'+item.id" placeholder="请输入结果" class="tdInp"/></td>
                                <td width="180px"><label v-show="!isEditShow&&hasTodayRecordBoolen">{{item.todayRemark}}</label><input v-show="isEditShow" :id="'inputRemark'+item.id" placeholder="请录入备注" class="tdInp"/></td>
                               
                                <td>
                                    <button title="修改" @click="renamePatrolBtn(item.id,item.patrolTypeId,item.patrolName)" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn" @click="deletePatrol(item.id)"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->
                    
                </div>
                <!-- 竖向位移 -->
                <div class="verticalLength">

                </div>
                <!-- 下载到本地 -->
        </div>
        <div>
            <button class="downbtn" @click="getPdf()">下载到本地</button>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default {
     components: {
        pdf,jsPDF,html2canvas
    },
    name:'htmlToPdf',
    data(){
        return{
            ugSelectId:window.location.href.substr(window.location.href.length-4),//获取到项目群组ID
            getReportSettingList:'',//获取报告保存的选项
            getSiteConditionList:'',//获取最新现场工况
            getPatrolRecordList:'',//获取巡视记录
            hasTodayRecordBoolen:'',
            historyTime:'',
            getMonitorMainTableList:'',//获取监测内容主表
            coverPath:'',//封面地址
        }
    },
    created(){
         var vm = this;
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.projectName =localStorage.getItem('projectName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        // this.getUrl();
        this.getReportSetting();
        this.getMonitorMainTable();
        console.log(this.ugSelectId,'ugSelectId');
    },
    filters:{
        monitorTypeChange(val){
            if(val==1){
                return '水平位移'
            }else if(val==2){
                return '竖向位移'
            }else if(val==3){
                return '水位'
            }else if(val==4){
                return '受力'
            }else if(val==5){
                return '斜度'
            }
        },
        shifouChange(val){
            if(val==false){
                return '否'
            }else if(val==true){
                return '是'
            }
        },
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        addSprit1(val){
            if(val==null){
                return '/'
            }else {
                return val.recentVariation
            }
        },
        addSprit2(val){
             if(val==null){
                return '/'
            }else {
                return val.totalVariation
            }
        },
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("YYYY-MM-DD HH:mm");
            }
        },

    },
    watch:{

    },
    methods:{
       
        getUrl(){
            console.log();
        },
        //获取报告保存的选项
        getReportSetting(){
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getReportSetting',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.getReportDatasList=response.data.rt;
                    this.getReportSettingList=response.data.rt;
                    this.coverPath=this.QJFileManageSystemURL+this.getReportSettingList.coverPath;
                    console.log(this.getReportSettingList,'this.getReportSettingList');
                }
            })
        },
        // 获取最新现场工况
        getSiteCondition(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getSiteCondition',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.getReportDatasList=response.data.rt;
                    this.getSiteConditionList=response.data.rt;
                }
            })
        },

        //获取巡视记录
        getPatrolRecord(){
              var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'detectionInfo/getPatrolRecord',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.getReportDatasList=response.data.rt;
                    this.getPatrolRecordList=response.data.rt;
                }
            })
        },
        //获取监测内容主表
        getMonitorMainTable(){
             var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'detectionInfo/getMonitorMainTable',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.ugSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.getReportDatasList=response.data.rt;
                    this.getMonitorMainTableList=response.data.rt;
                }
            })
        },
        //  getPatrolRecord(){
        //      var vm=this;
        //     axios({
        //         method:'get',
        //         url:this.BDMSUrl+'detectionInfo/getPatrolRecord',
        //         headers:{
        //             'token':vm.token
        //         },
        //         params:{
        //             userGroupId:this.userSelectId
        //         }
        //     }).then((response)=>{
        //         if(response.data.cd=='0'){
        //             this.getPatrolRecordList=response.data.rt.patrolInfos;
        //             this.hasTodayRecordBoolen=response.data.rt.hasTodayRecord;
        //             var map = new Map();
        //             for (var i = 0; i < this.getPatrolRecordList.length;i++){
        //                 var patrolTypeId = this.getPatrolRecordList[i].patrolTypeId;
        //                 if (!map.has(patrolTypeId)) {
        //                     var array = new Array();
        //                     array.push(this.getPatrolRecordList[i]);
        //                     map.set(patrolTypeId, array);
        //                 }
        //                 else {
        //                     var array = map.get(patrolTypeId);
        //                     array.push(this.getPatrolRecordList[i]);
        //                     map.set(patrolTypeId, array);
        //                 }
        //             }
        //             var list=[];
        //             map.forEach(function (value, key, mapObject) {
        //                 // console.log(key);
        //                 for(var i=0;i<value.length;i++){
        //                     list.push(value[i])
        //                 } 
        //                 console.log(value);
        //             }); 
        //             console.log(list,'list')               
        //             this.getPatrolRecordList=this.combineCell(list);

        //             this.getPatrolRecordLists=this.getPatrolRecordList;
        //             this.getPatrolRecordLists.forEach((item)=>{
        //                 this.userGroupIdList.push(item.id);
        //             })
        //             this.historyTime=this.getPatrolRecordLists[0].historyDate;
        //             console.log(this.userGroupIdList,'this.userGroupIdList');
        //             console.log(this.getPatrolRecordLists);
        //         }else if(response.data.cd=='-1'){
        //             this.$message({
        //                 type:'error',
        //                 message:response.data.msg
        //             })
        //         }
        //     })
        // },

         //html转PDF
        getPdf(){
                let pdfDom = document.querySelector('#pdfDom')
                console.log(pdfDom,'pdfDom');
                html2canvas(pdfDom, {allowTaint: true}).then(function(canvas){
                            var contentWidth = canvas.width;
                            var contentHeight = canvas.height;
                            //一页pdf显示html页面生成的canvas高度;
                            var pageHeight = contentWidth / 592.28 * 841.89;
                            //未生成pdf的html页面高度
                            var leftHeight = contentHeight;
                            //页面偏移
                            var position = 0;
                            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                            var imgWidth = 595.28;
                            var imgHeight = 592.28/contentWidth * contentHeight;
                            var pageData = canvas.toDataURL('image/jpeg', 1.0);

                            var pdf = new jsPDF('', 'pt', 'a4');

                            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                            //当内容未超过pdf一页显示的范围，无需分页
                            if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                            } else {
                                while(leftHeight > 0) {
                                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                                    leftHeight -= pageHeight;
                                    position -= 841.89;
                                    //避免添加空白页
                                    if(leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
                            pdf.save('导出检测报告.pdf');
                            console.log(pdf,'pdf1234');
                        })
                // html2canvas();
            }
    }
}
</script>
<style lang="less">
*{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{list-style: none;}
#htlmToPdf{
    width: 100%;
    margin: 0 auto;
    .pdfStyle{
        .pdfCover{
            width:90%;
            border:1px solid #ccc;
            // margin-bottom: 10px;
            margin:10px auto;
            .pdfImg{
                margin-top:50px;
                #img1{
                    background: #ccc;
                }
            }
            .time{
                margin-top:20px;
            }
            .tableList{
                margin:30px auto;
                width: 80%;
                .tableListDiv{
                    height: 500px;
                    border:1px solid #000;
                }
            }
            
            
        }
        .pdfSummary{
            .pdfSummaryHead{
                display:inline-block;
                width: 90%;
                font-size: 18px;
                color:#000;
                font-weight: bold;
                height: 40px;
                line-height: 40px;
                border-bottom:2px solid #ccc;
            }
            .pdfSummarytext{
                display:inline-block;
                width: 90%;
                 height: 40px;
                 position: relative;
                //  margin-left:5px;
                 label{
                     position: absolute;
                     left:5px;
                     top:5px;
                     font-size:16px;
                 }


            }
            .inspectTableList1{
                width: 90%;
                margin:0 auto;
                        .inspectTableList{
                            
                            border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            thead{
                                // background: #f2f2f2;
                                background: #fff;
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
                                    .red{
                                        color: red;
                                    }
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                        // .actionBtn{
                                        //     width: 18px;
                                        //     height: 18px;
                                        //     border: none;
                                        //     cursor: pointer;
                                        //     margin-left: 10px;

                                        // }
                                        // .deleteBtn{
                                        //     background: url('../../assets/delete.png') no-repeat 0 0;
                                        // }
                                        // .editBtn{
                                        //     background: url('./images/overviewedit.png') no-repeat 0 0;
                                        // }
                                        // .upmoveBtn{
                                        //     background: url('./images/overviewup.png') no-repeat 0 0;
                                        // }
                                        // .downmoveBtn{
                                        //     background: url('./images/downmove.png') no-repeat 0 0;
                                        // }
                                        // .detailBtn{
                                        //     background: url('./images/overfile.png') no-repeat 0 0;
                                        // }
                                        // .exportBtn{
                                        //     background: url('./images/overviewdown.png') no-repeat 0 0;
                                        // }
                                    }
                                }
                            }
                        }
                    }
        }
        .pdfInspection{
             .pdfSummaryHead{
                display:inline-block;
                width: 90%;
                font-size: 18px;
                color:#000;
                font-weight: bold;
                height: 40px;
                line-height: 40px;
                border-bottom:2px solid #ccc;
            }
            .pdfSummarytext{
                display:inline-block;
                width: 90%;
                 height: 40px;
                 position: relative;
                //  margin-left:5px;
                 label{
                     position: absolute;
                     left:5px;
                     top:5px;
                     font-size:16px;
                 }
            }
        }

       

    }
    .downbtn{
        margin-top:20px;
        background: #fc3439;
        // margin-right: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
        width: 111px;
        height: 36px;
        border: none;
        padding: 0;
        cursor: pointer;
        border-radius: 2px;
    }

}


</style>


