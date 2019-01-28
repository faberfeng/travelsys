<template>
    <div id="qingdanMain" style="width: 100%;overflow-x: hidden">
        <h3 class="componentDetail">清单详情</h3>
        <!-- <span class="leftCancle" @click="backCancle()"></span> -->
        <div>
            <div class="information" >
                <span class="text">清单基本信息</span>
                <span id="click1" class="upImg" @click="toggle($event)" ></span>
            </div>
            <div class="list">
                <p class="listLi"><span class="listP">清单编号</span><span class="listSpan">{{manifestMainInfo.pkId}}</span></p>
                <p class="listLi"><span class="listP">原始编号</span><span class="listSpan">{{manifestMainInfo.mOriginalId}}</span></p>
                <p class="listLi"><span class="listP">清单名称</span><span class="listSpan">{{manifestMainInfo.mName}}</span></p>
            <!-- <p class="listLi"><span class="listP">清单来源</span><span class="listSpan">{{manifestMainInfo.mType}}</span></p>-->
                <p class="listLi"><span class="listP">生成方式</span>
                <span class="listSpan" v-if="manifestMainInfo.mGSource == 1">选择集</span>
                <span class="listSpan" v-if="manifestMainInfo.mGSource == 2">报表快照</span>
                <span class="listSpan" v-if="manifestMainInfo.mGSource == 3">构件量生成</span>
                <span class="listSpan" v-if="manifestMainInfo.mGSource == 4">外部导入</span>
                <span class="listSpan" v-if="manifestMainInfo.mGSource == 5">构件量生成</span>
                </p>
                <p class="listLi"><span class="listP">源自业务</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 1">文档管理-关联构件</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 2">进度计划-任务核实</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 3">成本管理-工程量</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 4">成本管理-物料量</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 5">物资采购-订货管理</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 6">设计协调-讨论主题</span>
                <span class="listSpan" v-if="manifestMainInfo.mBSource == 7">成本管理-报表快照</span>
                </p>
                <p class="listLi"><span class="listP">创建用户</span><span class="listSpan">{{manifestMainInfo.creator}}</span></p>
                <p class="listLi"><span class="listP">创建时间</span><span class="listSpan">{{manifestMainInfo.createTime}}</span></p>
                <p class="listLi"><span class="listP">修改用户</span><span class="listSpan">{{manifestMainInfo.updater}}</span></p>
                <p class="listLi"><span class="listP">修改日期</span><span class="listSpan">{{manifestMainInfo.updateTime}}</span></p>
                <p class="listLi"><span class="listP">业务状态</span><span class="listSpan">{{manifestMainInfo.mStatus}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">变更版本</span><span class="listSpan">{{manifestMainInfo.mVersion}}</span></p>
            </div>
        </div>
        <div>
            <div class="information"><span class="text">明细基本信息({{page}}/{{pageInfo.totalCount}})</span><span id="click8" class="upImg" @click="toggle($event)"></span></div>
            
            <div class="list">
                <div class="turnPage">
                    <span class="pre notusable" id="turnPagePre" @click="changeMX(1)" >
                        上一页
                    </span>
                    <span class="pre" id="turnPageNext" @click="changeMX(2)">
                        下一页
                    </span>
                </div>
                <p class="listLi"><span class="listP">所在单体</span><span class="listSpan">{{manifestDetailInfo.build}}</span></p>
                <p class="listLi"><span class="listP">所在分区</span><span class="listSpan">{{manifestDetailInfo.partition}}</span></p>
                <p class="listLi"><span class="listP">所在楼层</span><span class="listSpan">{{manifestDetailInfo.storey}}</span></p>
                <p class="listLi"><span class="listP">可追溯ID</span><span class="listSpan">{{manifestDetailInfo.dTraceId}}</span></p>
                <p class="listLi"><span class="listP">类型名称</span><span class="listSpan">{{manifestDetailInfo.dGCCodeName}}</span></p>
                <p class="listLi"><span class="listP">构件名称</span><span class="listSpan">{{manifestDetailInfo.dName}}</span></p>
                <p class="listLi"><span class="listP">业务状态</span><span class="listSpan">{{manifestDetailInfo.dState}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">单位数量</span><span class="listSpan">{{manifestDetailInfo.dUnit}}</span></p>
                
            </div>
        </div>
        <!-- 关联清单 -->
        <div v-if="showDocumentList&&tokenId">
            <div class="information"><span class="text">关联文档</span><span id="click2" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <div class="listDocumentLi"  v-for="(document,index) in documentList" :key="index">
                    <div class="listAll" @click="viewFile(document.filePath)">
                        <div class="listL">
                            <img :src="require('./image/icon/'+fileIconChange(document.fileExtension.toUpperCase())+'.png')"> 
                        </div>
                        <div class="listR">
                            <span class="listRTop">{{document.fileName}}</span>
                            <span class="listRBottom">{{document.uploadUser}}    {{document.uploadFromExplorer|explorerFrom()}}    {{document.updateTime|timeChange()}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 报表快照 -->
        <div v-if="showReportsnapshotInfo&&tokenId">
            <div class="information"><span class="text">报表快照</span><span id="click3" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">报表ID</span><span class="listSpan">{{reportsnapshotInfo.id}}</span></p>
                <p class="listLi"><span class="listP">报表名称</span><span class="listSpan">{{reportsnapshotInfo.reportName}}</span></p>
                <p class="listLi"><span class="listP">快照名称</span><span class="listSpan">{{reportsnapshotInfo.name}}</span></p>
                <p class="listLi"><span class="listP">创建人</span><span class="listSpan">{{reportsnapshotInfo.createUser}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">创建日期</span><span class="listSpan">{{reportsnapshotInfo.createTime}}</span></p>
            </div>
        </div>
        <!-- 工程算量 -->
        <div v-if="showWorkAmountInfo&&tokenId">
            <div class="information"><span class="text">工程算量</span><span id="click4" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">出量构件数</span><span class="listSpan">{{workAmountInfo.componentNum}}</span></p>
                <p class="listLi"><span class="listP">工程量条目数</span><span class="listSpan">{{workAmountInfo.totalWorkAmount}}</span></p>
                <p class="listLi"><span class="listP">总价</span><span class="listSpan">{{workAmountInfo.totalPrice}}</span></p>
                <p class="listLi"><span class="listP">创建人</span><span class="listSpan">{{workAmountInfo.createUser}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">创建日期</span><span class="listSpan">{{workAmountInfo.createTime}}</span></p>
            </div>
        </div>
        <!-- 产品选型 -->
        <div v-if="showReportProductInfo&&tokenId">
            <div class="information"><span class="text">产品选型</span><span id="click5" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">选型构件数</span><span class="listSpan">{{reportProductInfo.componentCount}}</span></p>
                <p class="listLi"><span class="listP">产品条目数</span><span class="listSpan">{{reportProductInfo.itemsCount}}</span></p>
                <p class="listLi"><span class="listP">总价</span><span class="listSpan">{{reportProductInfo.totalPrice}}</span></p>
                <p class="listLi"><span class="listP">创建人</span><span class="listSpan">{{reportProductInfo.createUser}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">创建日期</span><span class="listSpan">{{reportProductInfo.createTime}}</span></p>
            </div>
        </div>
        <!-- 物资采购 -->
        <div v-if="showOrderInfo&&tokenId">
            <div class="information"><span class="text">物资采购</span><span id="click6" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">订单编号</span><span class="listSpan">{{orderInfo.orderCode}}</span></p>
                <p class="listLi"><span class="listP">订单名称</span><span class="listSpan">{{orderInfo.orderTitle}}</span></p>
                <p class="listLi"><span class="listP">订货群组</span><span class="listSpan">{{orderInfo.orderUgName}}</span></p>
                <p class="listLi"><span class="listP">供货群组</span><span class="listSpan">{{orderInfo.supply}}</span></p>
                <p class="listLi"><span class="listP">清单选型方式</span><span class="listSpan">{{orderDetailInfo.selectionMode}}</span></p>
                <p class="listLi"><span class="listP">前续环节</span><span class="listSpan">{{orderDetailInfo.forewordStep}}</span></p>
                <p class="listLi"><span class="listP">当前环节</span><span class="listSpan">{{orderDetailInfo.currentStep}}</span></p>
                <p class="listLi"><span class="listP">最后操作用户</span><span class="listSpan">{{orderDetailInfo.updateUserName}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">最后操作时间</span><span class="listSpan">{{orderDetailInfo.updateDateTime}}</span></p>
            </div>
        </div>
        <!-- <div v-if="haveToken">
            <div class="information"><span class="text">可用操作</span><span id="click2" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <div class="changeBtn">
                    <span class="pre blue"  @click="sureSend()" >
                        确认发货
                    </span>
                </div>
            </div>  
        </div> -->
        <!-- 任务进度 -->
        <div v-if="showTaskScheduleInfo&&tokenId">
            <div class="information"><span class="text">任务进度</span><span id="click7" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">任务名称</span><span class="listSpan">{{taskScheduleInfo.taskName}}</span></p>
                <p class="listLi"><span class="listP">计划开始</span><span class="listSpan">{{taskScheduleInfo.taskStart}}</span></p>
                <p class="listLi"><span class="listP">计划结束</span><span class="listSpan">{{taskScheduleInfo.taskEnd}}</span></p>
                <p class="listLi"><span class="listP">计划状态</span><span class="listSpan">{{taskScheduleInfo.taskStatus}}</span></p>
                <p class="listLi"><span class="listP">实际状态</span><span class="listSpan">{{taskScheduleInfo.actualStatus}}</span></p>
                <p class="listLi"><span class="listP">对比状态</span><span class="listSpan">{{taskScheduleInfo.comparisonStatus}}</span></p>
                <p class="listLi"><span class="listP">责任群组</span><span class="listSpan">{{taskScheduleInfo.taskUserGroupName}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">责任人</span><span class="listSpan">{{taskScheduleInfo.dutyUserName}}</span></p>
            </div>
        </div>
    </div>    
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:'mobileQindan',
    data(){
        return{
            manifestMainInfo:{},
                manifestDetailInfo:{},//明细列表
                pageInfo:{},//明细 分页信息
                documentList:[],//文档列表
                reportsnapshotInfo:{},//报表快照
                workAmountInfo:{},//工程算量
                reportProductInfo:{},//产品选型
                taskScheduleInfo:{},//任务进度
                orderInfo:{},
                orderDetailInfo:{},
                projectId:'',
                orderId:'',
                page:1,
                showDocumentList:false,
                showReportsnapshotInfo:false,
                showWorkAmountInfo:false,
                showReportProductInfo:false,
                showTaskScheduleInfo:false,
                showOrderInfo:false,
                mid:'',
                haveToken:'',
                tokenId:'',
                // BDMSUrl:'http://10.252.26.240:8080/h2-bim-project/',
                // QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file',
        }
    },
    created(){
        var vm=this;
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        this.mid=this.$route.query.mid;
        this.haveToken=this.$route.query.haveToken=="false"?false:true;
        this.tokenId=this.$route.query.tokenId;
        console.log(this.tokenId,'this.tokenId');
        console.log(vm.haveToken,'this.haveToken');
        this.initData();
    },
    filters:{
        sureSend(){
            axios({
                method:'get',
                url:this.BDMSUrl+'mobile/deliveryOrderComponent.json',
                params:{
                    id: this.orderId,
                    projectId:this.projectId
                }

            }).then((response)=>{
                var obj=response.data;
            })

        },
        timeChange(val){
            if(val==null){
                return ''
            }else{
                return moment(val).format('YYYY-MM-DD')
            }
        },
        explorerFrom(val){
            if(val==1){
                return '来自PC上传'
            }else if(val==2){
                return '来自Android上传'
            }
        },
    },

    methods:{
        fileIconChange(val){
            var vm = this
            // console.log(val,'val1111');
            var iconArr = ['AVI','BMP','CAD','DOC','DOCX','FILE','GIF','GMD','JPG','MIDI','MP3','MPEG','PDF','PNG','PPT','PPTX','RAR','RVT','TIFF','TXT','WAV','WMA','XLS','XLSX']
            if(iconArr.indexOf(val) > -1){
                return val
            }else{
                return 'FILE'
            }
        },
        viewFile(val){
            window.open(val);
        },
        backCancle(){
            window.opener = null; 
            window.open('', '_self'); 
            window.close()
            //  this.$router.back(-1);
            //  var userAgent = navigator.userAgent;
            // if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
            //     window.location.href="about:blank";
            // }else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){
            //     window.opener=null;window.open('about:blank','_self','').close();
            // }else {
            //     window.opener = null;
            //     window.open("", "_self");
            //     window.close();
            // }
        },
        toggle(event){
            var ev=window.event|| event;
            var target=ev.srcElement || ev.target;
            var node=$(target).parent().siblings(".list");
            if(node.is(":hidden")){
                $(target).addClass("upImg").removeClass("downImg");
            }else{
                $(target).addClass("downImg").removeClass("upImg");
            }
            node.toggle();
        },
        initData(){
            axios({
                url:this.BDMSUrl+'/mobile/QjScanCommonManifestResp.json',
                method:'GET',
                // headers:{

                // },
                params:{
                    id:this.mid,
                }
            }).then((response)=>{
                // response.data.responseInfo.responseCode==1
                if(response.data.responseInfo){
                    var obj=response.data;
                    // console.log(typeof(this.haveToken));
                    if(obj.manifestMainInfo!=null && obj.manifestMainInfo!=undefined) {
                        this.manifestMainInfo = obj.manifestMainInfo;
                        this.manifestMainInfo.createTime=this.convertTimestampToString(this.manifestMainInfo.createTime);
                        this.manifestMainInfo.updateTime=this.convertTimestampToString(this.manifestMainInfo.updateTime);
                        this.manifestMainInfo.mStatus=this.parseMStatus(this.manifestMainInfo.mStatus);
                        this.manifestMainInfo.mOriginalId=this.manifestMainInfo.mOriginalId==0?"":this.manifestMainInfo.mOriginalId;
                    }
                    if(obj.manifestDetailInfo!=null && obj.manifestDetailInfo!=undefined) {
                        this.manifestDetailInfo = obj.manifestDetailInfo;
                        this.manifestDetailInfo.dState=this.parseMStatus(this.manifestDetailInfo.dState);
                    }
                    if(obj.pageInfo!=null && obj.pageInfo!=undefined) {
                        this.pageInfo = obj.pageInfo;
                    }
                    if(obj.documentList!=null && obj.documentList!=undefined) {
                        this.documentList = obj.documentList;
                        if(this.haveToken==true){
                            this.showDocumentList=true;
                        }
                    }
                    if(obj.reportsnapshotInfo!=null && obj.reportsnapshotInfo!=undefined) {
                        this.reportsnapshotInfo = obj.reportsnapshotInfo;
                        this.reportsnapshotInfo.createTime=this.convertTimestampToString(this.reportsnapshotInfo.createTime);
                        if(this.haveToken==true){
                            this.showReportsnapshotInfo=true;
                        }
                    }
                    if(obj.workAmountInfo!=null && obj.workAmountInfo!=undefined) {
                        this.workAmountInfo = obj.workAmountInfo;
                        this.workAmountInfo.createTime=this.convertTimestampToString(this.workAmountInfo.createTime);
                        if(this.haveToken==true){
                            this.showWorkAmountInfo=true;
                        }
                        
                    }
                    if(obj.reportProductInfo!=null && obj.reportProductInfo!=undefined) {
                        this.reportProductInfo = obj.reportProductInfo;
                        this.reportProductInfo.createTime=this.convertTimestampToString(this.reportProductInfo.createTime);
                        if(this.haveToken==true){
                            this.showReportProductInfo=true;
                        }
                    }
                    if(obj.taskScheduleInfo!=null && obj.taskScheduleInfo!=undefined) {
                        this.taskScheduleInfo = obj.taskScheduleInfo;
                        this.taskScheduleInfo.taskStart=this.convertTimestampToString(this.taskScheduleInfo.taskStart);
                        this.taskScheduleInfo.taskEnd=this.convertTimestampToString(this.taskScheduleInfo.taskEnd);
                        if(this.haveToken==true){
                            this.showTaskScheduleInfo=true;
                        }
                    }
                    if(obj.orderInfo!=null && obj.orderInfo!=undefined) {
                        this.orderInfo = obj.orderInfo;
                        if(this.haveToken==true){
                            this.showOrderInfo=true;
                        }
                    }
                    if(obj.orderDetailInfo!=null && obj.orderDetailInfo!=undefined) {
                        this.orderDetailInfo = obj.orderDetailInfo;
                        this.orderDetailInfo.updateDateTime=this.convertTimestampToString(this.orderDetailInfo.updateDateTime);
                        this.projectId=this.orderDetailInfo.projectId;
                        this.orderId=this.orderDetailInfo.id;
                    }
                    if(this.page==1){
                        $("#turnPagePre").removeClass("usable").addClass("notusable");
                    }else{
                        $("#turnPagePre").removeClass("notusable").addClass("usable");
                    }
                    if(this.page==this.pageInfo.totalCount){
                        $("#turnPageNext").removeClass("usable").addClass("notusable");
                    }else{
                        $("#turnPageNext").removeClass("notusable").addClass("usable");
                    }
                    console.log(this.manifestMainInfo,'手机端返回的值');
                }
            })


        },
        convertTimestampToString(time){
                var date = new Date(time*1000);
                return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        },
        changeMX(op){
            //1:上一条 2:下一条
            if (op == 1){ // 上一页
                if (this.page!=1){
                    this.page--;
                } else {
                    return;
                }
            } else {// 下一页
                if (this.page<this.pageInfo.totalCount){
                    this.page++;
                } else {
                    return;
                }
            }
            axios({
                method:'get',
                url:this.BDMSUrl+'/mobile/QjPageManifestDetailInfo.json',
                params:{
                    id:this.mid,
                    qocIndex:this.page
                }
            }).then((response)=>{
                if(response.data.responseInfo.responseCode==1){
                    var obj=response.data;
                    if(obj.manifestDetailInfo!=null && obj.manifestDetailInfo!=undefined) {
                        this.manifestDetailInfo = obj.manifestDetailInfo;
                        this.manifestDetailInfo.dState=this.parseMStatus(this.manifestDetailInfo.dState);
                    }
                    if(this.page==1){
                        $("#turnPagePre").removeClass("usable").addClass("notusable");
                    }else{
                        $("#turnPagePre").removeClass("notusable").addClass("usable");
                    }
                    if(this.page==this.pageInfo.totalCount){
                        $("#turnPageNext").removeClass("usable").addClass("notusable");
                    }else{
                        $("#turnPageNext").removeClass("notusable").addClass("usable");
                    }
                }
            })
        },
        parseMStatus:function(mStatus){
                // 施工现场
                var constructionSite = mStatus.substring(0, 1);
                switch (constructionSite) {
                    case '8':
                        return '终审驳回';
                    case '7':
                        return '终审通过';
                    case '6':
                        return '终审补充';
                    case '5':
                        return '等待终审';
                    case '4':
                        return '初审驳回';
                    case '3':
                        return '初审通过';
                    case '2':
                        return '初审补充';
                    case '1':
                        return '等待初审';
                    default:
                        break;
                }
                // 进度计划
                var scheduledPlan = mStatus.substring(1, 2);
                switch (scheduledPlan) {
                    case '3':
                        return '已完工';
                    case '2':
                        return '已开工';
                    case '1':
                        return '已计划';
                    default:
                        break;
                }
                // 物资采购
                var materialPurchasing = mStatus.substring(2, 3);
                switch (materialPurchasing) {
                    case '9':
                        return '已签收';
                    case '8':
                        return '已抽检';
                    case '7':
                        return '已到场';
                    case '6':
                        return '已发货';
                    case '5':
                        return '已待发';
                    case '4':
                        return '生产中';
                    case '3':
                        return '已订货';
                    case '2':
                        return '已选型';
                    case '1':
                        return '待选型';
                    default:
                        break;
                }
                // 成本管理
                var costControl = mStatus.substring(3, 4);
                switch (costControl) {
                    case '6':
                        return '物料量核对完成';
                    case '5':
                        return '物料量核对中';
                    case '4':
                        return '工程量核对完成';
                    case '3':
                        return '工程量核对中';
                    case '2':
                        return '构件量核对完成';
                    case '1':
                        return '构件量核对中';
                    default:
                        break;
                }
                // 设计协调
                var designManage = mStatus.substring(4, 6);
                switch (designManage) {
                    case 'A0':
                        return '施工图深化设计';
                    case '70':
                        return '施工图设计';
                    case '40':
                        return '初步设计';
                    case '10':
                        return '方案设计';
                    case '00':
                        return '未定义';
                    default:
                        return '未定义';
                }
            },
        
    }

}
</script>
<style>
  #app {
    width: 100%;
    min-width: 100%;
  }
</style>
<style lang="less">
*{
    margin: 0;
    padding: 0;
}
html{font-size:16px}
@media screen and (min-width:320px) and (max-width:479px) {
    html {font-size: 18px}
}
@media screen and (min-width:480px) and (max-width:639px) {
    html {font-size: 20px}
}
@media screen and (min-width:640px) and (max-width:719px) {
    html {font-size: 22px}
}
@media screen and (min-width:720px) and (max-width:749px) {
    html {font-size: 26px}
}
@media screen and (min-width:750px) and (max-width:799px) {
    html {font-size: 30px}
}
@media screen and (min-width:800px) and (max-width:959px) {
    html {font-size: 32px}
}
@media screen and (min-width:960px) and (max-width:1079px) {
    html {font-size: 36px}
}
@media screen and (min-width:1080px) {
    html {font-size: 40px}
}
#qingdanMain{
    width:auto;
    // height:auto;
    background-color:#fff;
    position: relative;
    .componentDetail{
        width: 100%;
        // font-family:"PingFang-SC-Medium";
        font-family:"Microsoft YaHei";
        background:#43484e;
        height: 2.5rem;
        color: #ffffff;
        font-size:1rem;
        line-height: 2.5rem;
        font-weight:normal;
        position: relative;
        .leftCancle{
            position: absolute;
            background:url('./image/leftCancle.png');
            // background-repeat:no-repeat;
            background-size:2rem 2rem;
            background-repeat:no-repeat;
            // background-size:1rem 0.6rem;
            width:1rem;
            height:2rem;
            display:inline-block;
            top:0.1rem;
            left:0.6rem;
        }
        // .leftBack{
        //     //  float:left;
        //     position: absolute;
        //     background:url('./image/leftIcon.png');
        //     background-repeat:no-repeat;
        //     background-size:1rem 0.6rem;
        //     width:1rem;height:2rem;
        //     display:inline-block;
        //     top:0.5rem;
        //     left:0.3rem;
        // }
    }
    .information{
        width:100%;
        height:2.2rem;
        line-height:2.2rem;
        // background-color: #f2f2f2;
        font-size: 0.8rem;
        padding:0 1rem;
        box-sizing:border-box;
        border-bottom:1px solid #ccc;
        .text{
            color:#333;
            // font-weight:normal;
            font-family:"Microsoft YaHei";
            float: left;
            font-weight: 800;
        }
        .downImg{
            width:1rem;height:1rem;
            display:inline-block;
            float:right;
            background:url('./image/shouq.png');
            background-repeat:no-repeat;
            background-size:1rem 1rem;
            margin-top:0.6rem;
        }
        .upImg{
            width:1rem;height:1rem;
            display:inline-block;
            float:right;
            background:url('./image/xial.png');
            background-repeat:no-repeat;
            background-size:1rem 1rem;
            margin-top:0.6rem;
           
        }
    }
    
    // .information:after{content:'';clear:both;display:table;}
    .list{
        margin:0 0 0 1rem;background-color:#fff;font-size:0.8rem;
        .changeBtn{
            .pre{
                width: 4rem;
                height:1.8rem;
                line-height:1.8rem;
                margin-top:0.2rem;
                border:1px solid #ccc;
                display: inline-block;
                // float:left;
                text-align: center;
                border-radius: 4px;
                cursor: pointer;
                margin-right:1rem;
            }
        }
        .turnPage{
            width: 100%;height:2rem;
            .pre{
                width: 4rem;
                height:1.8rem;
                line-height:1.8rem;
                margin-top:0.2rem;
                border:1px solid #ccc;
                display: inline-block;
                // float:left;
                text-align: center;
                border-radius: 4px;
                cursor: pointer;
                margin-right:1rem;
            }
        }
        .turnPage .usable{
            color:#0486d1;
            border-color: #0486d1;
            // color:#333;
        }
        .turnPage .notusable{
            color:#666; 
        }
        .turnPage:after{content: '';clear:both;display:table;}
        .listDocumentLi{
            .listAll{
                height: 4rem;
                padding:0.5rem;
                background:#f7f7f7;
                margin:0.2rem;
                .listL{
                    float: left;
                    img{
                        height: 2.5rem;
                        width: 2.5rem;
                    }
                }
                .listR{
                    float: right;
                    width: 80%;
                    // text-overflow:ellipsis;
                    // overflow: hidden;
                    // white-space: nowrap;
                    text-align: left;
                    .listRTop{
                        word-break: break-all;
                        color:#333333;
                        height: 2rem;
                        font-weight: 600;
                    }
                    .listRBottom{
                        display: block;
                        word-break: break-all;
                        color:#989898;
                        height: 2rem;
                        font-size:0.7rem;
                        margin-top:0.4rem;
                    }
                }
            }
        }
        .listLi{
            width:100%;margin:0;padding:0;border-bottom:1px solid #ccc;height: 2.2rem;line-height: 2.2rem;
            .listP{
                display:inline-block;
                color:#333;
                margin:0;
                // text-align: left;
                float: left;
                font-weight: 400;
            }
            .listSpan{
                display:inline-block;
                width:68%;
                color:#666;
                text-align:right;
                margin:0 0.5rem 0 0;
                float:right;
                text-overflow:ellipsis;
                white-space:nowrap;
                overflow:hidden
            }
        }
    }

}



</style>
