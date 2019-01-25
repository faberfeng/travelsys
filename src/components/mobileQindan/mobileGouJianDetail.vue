<template>
    <div id="GouJianMain" style="width: 100%;overflow-x: hidden">
        <h3 class="componentDetail"><span class="leftCancle" @click="backCancle()"></span>构件详情</h3>
        <div>
            <div class="information"><span class="text">基本信息</span><span id="click1" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">清单及序号</span><span class="listSpan">{{manifestDetailInfo.mid}}-{{manifestDetailInfo.pkId}}</span></p>
                <p class="listLi"><span class="listP">可追溯ID</span><span class="listSpan">{{manifestDetailInfo.dTraceId}}</span></p>
                <p class="listLi"><span class="listP">访问地址</span><span class="listSpan">{{manifestDetailInfo.mUrl}}</span></p>
                <p class="listLi"><span class="listP">构件名称</span><span class="listSpan">{{manifestDetailInfo.dName}}</span></p>
                <p class="listLi"><span class="listP">所在空间</span><span class="listSpan">{{manifestDetailInfo.partition}}</span></p>
                <p class="listLi"><span class="listP">单位</span><span class="listSpan">{{manifestDetailInfo.dUnit}}</span></p>
                <p class="listLi"><span class="listP">数量</span><span class="listSpan">{{manifestDetailInfo.dCount}}</span></p>
                <p class="listLi"><span class="listP">修改用户</span><span class="listSpan">{{manifestDetailInfo.updater}}</span></p>
                <p class="listLi"><span class="listP">修改时间</span><span class="listSpan">{{manifestDetailInfo.updateTime}}</span></p>
                <p class="listLi" style="border-bottom:none;">
                    <span class="listP">当前业务</span><span class="listSpan">{{manifestDetailInfo.mBSource}}</span>
    <!--
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 1">关联文档</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 2">进度计划</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 3">工程算量</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 4">产品选型</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 5">物资采购</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 6">讨论主题</span>
                <span class="listSpan" v-if="manifestDetailInfo.mBSource == 7">报表快照</span>
    -->
                </p>
            </div>
        </div>
        <div>
            <div class="information"><span class="text">设计信息</span><span id="click2" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">GUID</span><span class="listSpan">{{elementInfo.guid}}</span></p>
                <p class="listLi"><span class="listP">原始文件</span><span class="listSpan">{{elementInfo.originalFile}}</span></p>
                <p class="listLi"><span class="listP">原始分类</span><span class="listSpan">{{elementInfo.originalCategory}}</span></p>
                <p class="listLi"><span class="listP">原始ID</span><span class="listSpan">{{elementInfo.originalId}}</span></p>
                <p class="listLi"><span class="listP">原始名称</span><span class="listSpan">{{elementInfo.originalName}}</span></p>
                <p class="listLi"><span class="listP">创建工具</span><span class="listSpan">{{elementInfo.creator}}</span></p>
                <p class="listLi"><span class="listP">构件名称</span><span class="listSpan">{{elementInfo.name}}</span></p>
                <p class="listLi"><span class="listP">设计分类</span><span class="listSpan">{{elementInfo.gccode}}</span></p>
                <p class="listLi"><span class="listP">注释</span><span class="listSpan">{{elementInfo.comments}}</span></p>
                <p class="listLi"><span class="listP">标记</span><span class="listSpan">{{elementInfo.tag}}</span></p>
                <p class="listLi"><span class="listP">更新用户</span><span class="listSpan">{{elementInfo.editor}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">更新时间</span><span class="listSpan">{{elementInfo.updateTime}}</span></p>
            </div>
        </div>
        <div v-if="showSummaryInfo&&operateStatus!=2">
            <div class="information"><span class="text">可用操作</span><span id="click2" class="upImg" @click="toggle($event)"></span></div>
            <div class="list" >
                <div class="changeBtn">
                    <span v-show="operateStatus==0"  class="pre blue"  @click="startSure()" >
                        开工确认
                    </span>
                    <span v-show="operateStatus==1" class="pre yellow"  @click="completeSure()" >
                        完工确认
                    </span>
                    <!-- <span class="pre red"  @click="changeStatus(3)" >
                        确认发货
                    </span> -->
                </div>
            </div>  
        </div>
        <div v-if="showDocumentList">
            <div class="information"><span class="text">关联文档</span><span id="click3" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <div class="listDocumentLi"  v-for="(document,index) in documentList" :key="index">
                    <div class="listAll" @click="viewFile(document.filePath)">
                        <div class="listL">
                            <img :src="require('./image/icon/'+document.fileExtension.toUpperCase()+'.png')"> 
                        </div>
                        <div class="listR">
                            <span class="listRTop">{{document.fileName}}</span>
                            <span class="listRBottom">{{document.uploadUser}}    {{document.uploadFromExplorer|explorerFrom()}}    {{document.updateTime|timeChange()}}</span>
                        </div>
                    </div>
                </div>
                <!-- <p class="listLi"  v-for="(document,index) in documentList" :key="index"><span class="listP">{{document.fileName}}</span><span class="listSpan">预览</span></p> -->
            </div>
        </div>
        <div v-if="showProductLibrary">
            <div class="information"><span class="text">选型信息</span><span id="click4" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">产品ID</span><span class="listSpan">{{productLibrary.productId}}</span></p>
                <p class="listLi"><span class="listP">产品类型</span><span class="listSpan">{{productLibrary.productType}}</span></p>
                <p class="listLi"><span class="listP">产品名称</span><span class="listSpan">{{productLibrary.productName}}</span></p>
                <p class="listLi"><span class="listP">产品品牌</span><span class="listSpan">{{productLibrary.brand}}</span></p>
                <p class="listLi"><span class="listP">规格型号</span><span class="listSpan">{{productLibrary.specificationParameter}}</span></p>
                <p class="listLi"><span class="listP">供货商</span><span class="listSpan">{{productLibrary.supplier}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">标记</span><span class="listSpan">{{productLibrary.productTag}}</span></p>
            </div>
        </div>
        <div v-if="showPurchasingInfo">
            <div class="information"><span class="text">物资采购</span><span id="click5" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">订单编号</span><span class="listSpan">{{purchasingInfo.orderCode}}</span></p>
                <p class="listLi"><span class="listP">订单名称</span><span class="listSpan">{{purchasingInfo.orderTitle}}</span></p>
                <p class="listLi"><span class="listP">订货群组</span><span class="listSpan">{{purchasingInfo.orderUgName}}</span></p>
                <p class="listLi"><span class="listP">供货群组</span><span class="listSpan">{{purchasingInfo.supply}}</span></p>
                <p class="listLi"><span class="listP">前续环节</span><span class="listSpan">{{purchasingInfo.forewordStep}}</span></p>
                <p class="listLi"><span class="listP">当前环节</span><span class="listSpan">{{purchasingInfo.currentStep}}</span></p>
                <p class="listLi"><span class="listP">最后操作用户</span><span class="listSpan">{{purchasingInfo.updateUserName}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">最后操作时间</span><span class="listSpan">{{purchasingInfo.updateDateTime}}</span></p>
            </div>
        </div>
        <div v-if="showSummaryInfo">
            <div class="information"><span class="text">进度核实</span><span id="click6" class="upImg" @click="toggle($event)"></span></div>
            <div class="list">
                <p class="listLi"><span class="listP">任务名称</span><span class="listSpan">{{summaryInfo.taskName}}</span></p>
                <p class="listLi"><span class="listP">责任群组</span><span class="listSpan">{{summaryInfo.taskUserGroupName}}</span></p>
                <p class="listLi"><span class="listP">开工时间</span><span class="listSpan">{{summaryInfo.openWorkTime}}</span></p>
                <p class="listLi"><span class="listP">开工确认</span><span class="listSpan">{{summaryInfo.openWorkUserName}}</span></p>
                <p class="listLi"><span class="listP">完工时间</span><span class="listSpan">{{summaryInfo.finishWorkTime}}</span></p>
                <p class="listLi" style="border-bottom:none;"><span class="listP">完工确认</span><span class="listSpan">{{summaryInfo.finishWorkUserName}}</span></p>
            </div>
        </div>
    </div> 
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
    data(){
        return{
            manifestDetailInfo:{},
            purchasingInfo:{},//物资采购
            documentList:[],
            elementInfo:{},//设计信息
            productLibrary:{},//产品选型
            summaryInfo:{},//进度核实
            componentFinishCheck:'',
            operateStatus:'',
            showDocumentList:false,
            showProductLibrary:false,
            showSummaryInfo:false,
            showPurchasingInfo:false,
            mid:'',
            mdid:'',
            haveToken:false,
            tokenId:'',
            traceId:'',
            // BDMSUrl:'http://10.252.26.240:8080/h2-bim-project/',
            // QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file',
        }
    },
    created(){
        var vm=this;
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        this.mid=this.$route.query.mid;
        this.mdid=this.$route.query.mdid;
        this.traceId=this.$route.query.traceId;
        vm.tokenId=this.$route.query.tokenId;
        // this.haveToken=this.$route.query.haveToken;
        this.haveToken=this.$route.query.haveToken=="false"?false:true;
        
        
        console.log(this.mdid,'this.mdid');
        console.log(this.mid,'this.mid');
        console.log(this.tokenId,'this.tokenId')
        console.log(vm.traceId,'this.traceId');
        this.initData();
        // this.test();
    },
    filters:{
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
        backCancle(){
            this.$router.back(-1);
            // var userAgent = navigator.userAgent;
            // if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
            //     window.location.href="about:blank";
            // }else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){
            //     window.opener=null;window.open('about:blank','_self','').close();
            // }else {
            //     window.opener = null;
            //     window.open("about:blank", "_self");
            //     window.close();
            // }
        },
        
        //开工确认
        startSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'mobile/openWorkConfirm.json',
                headers:{
                    'tokenId':this.tokenId
                },
                params:{
                    id:this.mdid
                }
            }).then((response)=>{
                var obj=response.data
                console.log(obj,'返回的值。。。')
                if(obj.responseInfo.responseCode == 1){
                    this.initData();
                    alert(obj.info)
                }else if(obj.responseInfo.responseCode==101){
                    alert(obj.responseInfo.responseMessage)
                }else{
                    alert(obj.responseInfo.responseMessage)
                }
            })
        },
        //完工确认
        completeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'mobile/finishWorkConfirm.json',
                headers:{
                    'tokenId':this.tokenId
                },
                params:{
                    id:this.mdid
                }
            }).then((response)=>{
                var obj=response.data
                if(obj.responseInfo.responseCode == 1){
                    this.initData();
                    alert(obj.info)
                }else if(obj.responseInfo.responseCode==101){
                    alert(obj.responseInfo.responseMessage)
                }else{
                    alert(obj.responseInfo.responseMessage)
                }
            })

        },
        // test(){
        //     var vm=this;
        //     axios({
        //         method:'get',
        //         url:vm.BDMSUrl+'/mobile/selectManifestMain',
        //         params:{
        //             mid:this.mid,
        //             mdid:this.mdid
        //             // mdid:1899025,
        //             // mid:2157
        //         }         
        //         }).then((response)=>{
        //             var obj=response.data;
        //         })
        // },
        initData(){
            var vm=this;
            var getUrl;
            var apptype;
            if(this.tokenId){
                getUrl=vm.BDMSUrl+'mobile/ScanCommonManifestDetailResp.json'
                apptype=2
            }else{
                getUrl=vm.BDMSUrl+'/mobile/QjScanCommonManifestDetailResp.json'
                apptype='';
            }
            axios({
                method:'get',
                url:getUrl,
                // url:vm.BDMSUrl+'mobile/ScanCommonManifestDetailResp.json',
                // url:vm.BDMSUrl+'/mobile/QjScanCommonManifestDetailResp.json',
                headers:{
                    'tokenId':this.tokenId
                },
                params:{
                    bFrom:3,
                    mid:this.mid,
                    mdid:this.mdid,
                    traceId:decodeURIComponent(this.traceId),
                    appType:apptype
                    // mdid:1899025,
                    // mid:2157
                }
            }).then((response)=>{
                if(response.data.responseInfo.responseCode==1){
                    var obj=response.data;
                    // this.haveToken=this.$route.query.haveToken=="false"?false:true;
                    if(obj.manifestDetailInfo!=null && obj.manifestDetailInfo!=undefined) {
                        this.manifestDetailInfo = obj.manifestDetailInfo;
                        this.manifestDetailInfo.updateTime=this.convertTimestampToString(this.manifestDetailInfo.updateTime);
                        this.manifestDetailInfo.mBSource=this.parseMStatus(obj.manifestDetailInfo.dState);
                    }
                    if(obj.purchasingInfo!=null && obj.purchasingInfo!=undefined) {
                        this.purchasingInfo = obj.purchasingInfo;
                        this.purchasingInfo.updateDateTime=this.convertTimestampToString(this.purchasingInfo.updateDateTime);
                        this.showPurchasingInfo=true;
                    }
                    if(obj.documentList!=null && obj.documentList!=undefined) {
                        this.documentList = obj.documentList;
                        this.showDocumentList=true;
                    }
                    if(obj.elementInfo!=null && obj.elementInfo!=undefined) {
                        this.elementInfo = obj.elementInfo;
                    }
                    if(obj.productLibrary!=null && obj.productLibrary!=undefined) {
                        this.productLibrary = obj.productLibrary;
                        this.showProductLibrary=true;
                    }
                    if(obj.summaryInfo!=null && obj.summaryInfo!=undefined) {
                        this.summaryInfo = obj.summaryInfo;
                        this.summaryInfo.openWorkTime=this.convertTimestampToString(this.summaryInfo.openWorkTime);
                        this.summaryInfo.finishWorkTime=this.convertTimestampToString(this.summaryInfo.finishWorkTime);
                        this.componentFinishCheck=this.summaryInfo.componentFinishCheck;
                        this.operateStatus=this.summaryInfo.operateStatus
                        this.showSummaryInfo=true;
                    }
                }
            })

        },
        convertTimestampToString(time){
                var date = new Date(time*1000);
                return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
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
        }

    }

}
</script>

<style lang="less">
 #app {
    width: 100%;
    min-width: 100%;
  }
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
#GouJianMain{
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
            // background-size:1rem 1rem;
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
                font-weight: 400;
                // text-align: left;
                float: left;
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
