<template>
    <div id="pointPositionMain" style="width: 100%;overflow-x: hidden">
        <h3 class="componentDetail"><span class="leftCancle" @click="backCancle()"></span>安全点位</h3>
            <div>
                <div class="information" >
                    <span class="text">基本信息</span>
                    <span id="click1" class="upImg" @click="toggle($event)" ></span>
                </div>
                <div class="list">
                    <p class="listLi"><span class="listP">项目名称</span><span class="listSpan">{{securityCheckItem.itemName}}</span></p>
                    <p class="listLi"><span class="listP">点位名称</span><span class="listSpan">{{checkPoint.name}}</span></p>
                    <p class="listLi"><span class="listP">检查频率</span><span class="listSpan">{{securityCheckItem.checkFrequency|checkFrequency}}</span></p>
                    <p class="listLi"><span class="listP">负责单位</span><span class="listSpan">{{securityCheckItem.respDeptName}}</span></p>
                    <p class="listLi"><span class="listP">负责人</span><span class="listSpan">{{securityCheckItem.respUserName}}</span></p>
                    <p class="listLi"><span class="listP">检查单位</span><span class="listSpan">{{securityCheckItem.checkDeptName}}</span></p>
                    <p class="listLi"><span class="listP">当前状态</span><span class="listSpan">{{checkPoint.currCheckStatus|currentStatus}}</span></p>
                    <p class="listLi" style="border-bottom:none;"><span class="listP">上次检查</span><span class="listSpan">{{checkPoint.expectCheckStatus|currentStatus}}</span></p>
                </div>
            </div>
            <div v-if="haveToken">
                <div class="information" >
                    <span class="text">检查操作</span>
                    <span id="click1" class="upImg" @click="toggle($event)" ></span>
                </div>
                <div class="list">
                    <div class="changeBtn">
                        <span class="pre blue"  @click="changeStatus(1)" >
                            确认安全
                        </span>
                        <span class="pre yellow"  @click="changeStatus(2)" >
                            需要整改
                        </span>
                        <span class="pre red"  @click="changeStatus(3)" >
                            急需整改
                        </span>
                    </div>
                </div>

            </div>
            <div>
                <div class="information"><span class="text">检查记录</span><span id="click8" class="upImg" @click="toggle($event)"></span></div>
                <!-- ({{page}}/{{pageInfo.totalCount}}) -->
                <div class="list">
                    <div class="turnPage">
                        <span class="pre notusable" id="turnPagePre" @click="changeMX(1)" >
                            上一页
                        </span>
                        <span class="pre" id="turnPageNext" @click="changeMX(2)">
                            下一页
                        </span>
                    </div>
                    <p class="listLi"><span class="listP">序号</span><span class="listSpan">{{checkPoint.id}}</span></p>
                    <p class="listLi"><span class="listP">检查状态</span><span class="listSpan">{{checkPoint.currCheckStatus|currentStatus}}</span></p>
                    <p class="listLi"><span class="listP">检查人</span><span class="listSpan">{{checkPoint.checkUserName}}</span></p>
                    <p class="listLi"><span class="listP">检查时间</span><span class="listSpan">{{checkPoint.checkTime|timeChange}}</span></p>
                </div>
            </div>

    </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios';
export default {
    data(){
        return{
            BDMSUrl:"",
            checkPoint:'',
            securityCheckItem:'',
            mid:'',
            tokenId:'',
            haveToken:false,
        }
    },
    filters:{
        checkFrequency(checkFrequencyNum){
            var checkFrequency
            if(checkFrequencyNum == 0) {
                checkFrequency = "每天";
            } else if(checkFrequencyNum == 1) {
                checkFrequency= "每隔一天";
            } else if(checkFrequency == 2) {
                checkFrequency= "每周两次";
            } else if(checkFrequencyNum == 3) {
                checkFrequency= "每周一次";
            } else if(checkFrequencyNum == 4) {
                checkFrequency= "两周一次";
            } else if(checkFrequencyNum == 5) {
                checkFrequency= "每月一次";
            } else if(checkFrequencyNum == 6) {
                checkFrequency= "两月一次";
            } else if(checkFrequencyNum == 7) {
                checkFrequency= "三月一次";
            } else {
                checkFrequency = "";
            }
            return checkFrequency
        },
        currentStatus(statusNum){
            var status;
            if(statusNum == 1) {
                status = "安全";
            } else if(statusNum == 2) {
                status = "不安全";
            } else if(statusNum == 3) {
                status = "未知";
            } else {
                status = "";
            }
            return status
        },
        timeChange(val){
            if(val==null){
                return ''
            }else{
                return moment(val).format('YYYY-MM-DD')
            }
        }
    },
    created(){
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.mid=this.$route.query.mid;
        this.tokenId=this.$route.query.tokenId;
        // console.log(this.$route.query.haveToken=="true");
        this.haveToken=this.$route.query.haveToken=="false"?false:true;
        console.log(this.tokenId,'this.tokenId');
        this.initData();
        
        console.log(this.mid,'this.mid');
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
            window.opener = null; 
            window.open('', '_self'); 
            window.close()
            
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
        changeMX(mold){
            axios({
                method:'get',
                url:this.BDMSUrl+'/mobile/getRecordForWeb.json',
                params:{
                    cpId:this.mid,
                    currCrId:this.checkPoint.id,
                    mold:mold
                }
            }).then((response)=>{
                if(response.data){
                    var obj=response.data;
                    if(obj.responseInfo.responseCode==102){
                        alert(obj.responseInfo.responseMessage)
                    }
                    console.log(obj,'记录');
                }
            })
        },
        changeStatus(status){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrl+'/mobile/updateSecurityStatus.json',
                headers:{
                    'tokenId':this.tokenId
                },
                params:{
                    cpId:vm.mid,
                    status:status,
                    projId:vm.checkPoint.projId
                }
            }).then((response)=>{
                if(response.data){
                    
                }
            })


        },
        initData(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'/mobile/getCheckPointForWeb.json',
                params:{
                    id:this.mid
                }
            }).then((response)=>{
                var obj=response.data;
                if(response.data.responseInfo.responseCode==1){
                    this.checkPoint=obj.checkPoint[0];
                    this.securityCheckItem=obj.securityCheckItem
                }
                console.log(obj,'obj00000');
            })
        },
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
    margin: 0;
    padding: 0;
}
#pointPositionMain{
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
            // .blue{
            //     color: blue;

            // }
            // .yellow{
            //     color: #bfbe8b;
            // }
            // .red{
            //     color:brown;
            // }

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
        // .listDocumentLi{
        //     .listAll{
        //         height: 4rem;
        //         padding:0.5rem;
        //         background:#f7f7f7;
        //         margin:0.2rem;
        //         .listL{
        //             float: left;
        //             img{
        //                 height: 2.5rem;
        //                 width: 2.5rem;
        //             }
        //         }
        //         .listR{
        //             float: right;
        //             width: 80%;
        //             // text-overflow:ellipsis;
        //             // overflow: hidden;
        //             // white-space: nowrap;
        //             text-align: left;
        //             .listRTop{
        //                 word-break: break-all;
        //                 color:#333333;
        //                 height: 2rem;
        //                 font-weight: 600;
        //             }
        //             .listRBottom{
        //                 display: block;
        //                 word-break: break-all;
        //                 color:#989898;
        //                 height: 2rem;
        //                 font-size:0.7rem;
        //                 margin-top:0.2rem;
        //             }
        //         }
        //     }
        // }
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
