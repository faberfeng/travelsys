<template>
    <div id="safeNoticeMessages">
        <div class="projectInfo">
            <p class="antsLine">
                安全教育<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">返回</span><i class="icon-sanjiao-right"></i>
            </p>
        </div>
        <div class="safeNotice_body">
            <div class="header">
                <div class="header_left">
                    <div style="font-size:16px;text-align:center;color:#999;height:30px;line-height:30px;">观看安全教育视频后，来访人员请签字确认</div>
                    <video width="100%" height="100%" :src="BDMSUrl+deliverValue.filePath" controls="controls" style="border:1px solid #ccc;"></video>
                </div>
                <div class="header_right"></div>
            </div>
            <div class="bottom"></div>
             <div class="bottomBtn">
                 <span class="btn" @click="safeNoticeMakeSure()">完全访客安全告知</span>
             </div>


        </div>
    </div>    
</template>

<script>
import axios from 'axios'
export default {
    name:'safeNoticeMessage',
    props:['deliverValue','visitorId','safetyNotificationId'],
    data(){
        return{

        }
    },
    created(){
         var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        console.log(this.deliverValue,this.visitorId,'deliverValue');
    },
    methods:{
        back(){
            this.$emit('back')
        },
        safeNoticeMakeSure(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'safety/safetyNotificationConfirm',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    visitorId:this.visitorId,
                    safetyNotificationId:this.safetyNotificationId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.$emit('refresh')
                }
            })
        },

    }

}
</script>

<style lang="less" scoped>
#safeNoticeMessages{
     .projectInfo{
         margin: 10px 20px 20px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                border-bottom: 1px dashed #ccc;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }    
        }
    }
    .safeNotice_body{
        .header{
            width: 98%;
            margin:0 auto;
            .header_left{
                width: 58%;
                height: 450px;
                // border:1px solid #ccc;
                display: inline-block;
                // float: left;
            }
            .header_right{
                
                width: 32%;
                height: 450px;
                border:1px solid #ccc;
                display: inline-block;
                margin-left: 20px;
                // float: right;
            }

        }
        .bottom{
            width: 90%;
            margin:20px auto;
            height: 180px;
            border:1px solid #ccc;
        }
        .bottomBtn{
            margin:20px auto;
            height: 180px;
            .btn{
                width: 140px;
                height: 44px;
                color: #58adfb;
                text-align: center;
                line-height: 44px;
                text-decoration: none;
                border: 1px solid #58adfb;
                border-radius: 5px;
                font-size: 14px;
                display: inline-block;
                cursor: pointer;
                &:hover{
                    background: #58adfb;
                    color: #fff;
                }
            }

        }
    }

}


</style>
