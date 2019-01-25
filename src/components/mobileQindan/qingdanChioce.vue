<template>
<div id="main" style="width: 100%;overflow-x: hidden">
    <h3 class="componentDetail">所在清单选择</h3>
    <!-- <span class="leftCancle" @click="backCancle()"></span> -->
    <div class="box" v-for="(main,index) in manifestMainList" :key="index">
        <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td>源自业务:</td>
                <td v-if="main.mBSource == 1">关联文档</td>
                <td v-if="main.mBSource == 2">进度计划</td>
                <td v-if="main.mBSource == 3">工程算量</td>
                <td v-if="main.mBSource == 4">产品选型</td>
                <td v-if="main.mBSource == 5">物资采购</td>
                <td v-if="main.mBSource == 6">讨论主题</td>
                <td v-if="main.mBSource == 7">报表快照</td>
            </tr>
            <tr>
                <td>主体名称:</td><td>{{main.mName}}</td>
            </tr>
            <tr>
                <td>清单序号:</td><td>{{main.pkId}}</td>
            </tr>
            <tr>
                <td>业务状态:</td><td>{{main.mStatus}}</td>
            </tr>
        </table>
        <div class="button"><button @click="selectmain(main.pkId)">点击查看构件详情</button></div>
    </div>
</div>
    
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            manifestMainList:[],
            tokenId:'',
            traceId:'',
            // BDMSUrl:'http://10.252.26.240:8080/h2-bim-project/',
            // QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file',
        }
    },
    created(){
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        this.mid=this.$route.query.mid;
        this.haveToken=this.$route.query.haveToken;
        this.tokenId=this.$route.query.tokenId;
        // this.haveToken=this.$route.query.haveToken=="false"?false:true;
        this.initData();
    },
    methods:{
        initData(){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'/mobile/QjScanCommonManifestDetailResp.json',
                params:{
                    bFrom:1,
                    mdid:this.mid
                    // mdid:1899025
                }
            }).then((response)=>{
                if(response.data){
                    var obj=response.data;
                    this.traceId=obj.traceId;
                    if(obj.manifestMainList!=null && obj.manifestMainList!=undefined){
                        obj.manifestMainList.forEach((item)=>{
                            item.mStatus=vm.parseMStatus(item.mStatus);
                        })
                        vm.manifestMainList=obj.manifestMainList
                    }
                    console.log(vm.manifestMainList,'vm.manifestMainList');
                }
            })
        },
        selectmain(mid){
            this.$router.push({
                path:'/mobileQindan/mobileGouJianDetail',
                query:{
                    mid:mid,
                    mdid:this.mid,
                    haveToken:this.haveToken,
                    tokenId:this.tokenId,
                    traceId:encodeURIComponent(this.traceId)
                }
            })
            //  window.location.href=this.BDMSUrl+"/mobile/selectManifestMain?mid="+mid+"&mdid="+2238;
             console.log(mid);
        },
        backCancle(){
            window.opener = null; 
            window.open('', '_self'); 
            window.close()
        //    var userAgent = navigator.userAgent;
        //     if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
        //         window.location.href="about:blank";
        //     }else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){
        //         window.opener=null;window.open('about:blank','_self','').close();
        //     }else {
        //         window.opener = null;
        //         window.open("about:blank", "_self");
        //         window.close();
        //     }
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
    },
    
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
    margin:0px;
    padding:0px;
}
#main{
    width:100%;
    height:auto;
    background-color:#fff;
    .componentDetail{
        width:100%;
        text-align:center;
        background-color:#43484e;;
        color:#fff;
        font-size:1rem;
        font-family:"Microsoft YaHei";
        height:2.5rem;
        line-height:2.5rem;
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
    }
    .box{
        width:100%;
        padding:3% 5%;
        box-sizing:border-box;
        border-bottom:1px solid #ccc;
        display:table;
        td:nth-of-type(odd){width:6rem;white-space: nowrap }
        td{padding:0.2rem;font-size: 0.8rem;}
        .button{display:table-cell;vertical-align:middle;text-align:center;width:20%;}
        button{padding:0.5rem;border:none;background-color:#0486d1;color:#fff;border-radius: 4px;}
    }

}


</style>
