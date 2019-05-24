<template>
    <div id="safeNoticeMessages">
        <div class="projectInfo">
            <p class="antsLine">
                安全告知<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">返回</span><i class="icon-sanjiao-right"></i>
            </p>
        </div>
        <div class="safeNotice_body">
            <div class="header">
                <div class="header_left">
                    <div style="font-size:16px;text-align:center;color:#999;height:30px;line-height:30px;">观看安全教育视频后，来访人员请签字确认</div>
                    <video width="100%" height="100%" :src="BDMSUrl+deliverValue.filePath" controls="controls" style="border:1px solid #ccc;"></video>
                </div>
                <div class="header_right">
                    <div class="title">
                        <i class="el-icon-document"></i>{{deliverValue.title}}
                    </div>
                    <div class="body">
                        安全告知内容：{{deliverValue.text}}
                    </div>
                </div>
            </div>
            <div class="bottom">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <tbody>
                        <tr v-for="(item,index) in peoples" :key="index">
                            <td>{{item.length>=1?item[0]:''}}</td>
                            <td>{{item.length>=2?item[1]:''}}</td>
                            <td>{{item.length>=3?item[2]:''}}</td>
                            <td>{{item.length>=4?item[3]:''}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
            getVisitorInfoByIdList:'',
            people:[],
            peoples:[],
        }
    },
    created(){
         var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        this.getVisitorInfoById();
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
        getVisitorInfoById(){
            axios({
                url:this.BDMSUrl+'visitor/getVisitorInfoById',
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.visitorId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getVisitorInfoByIdList=response.data.rt;
                    console.log(this.getVisitorInfoByIdList,'this.getVisitorInfoByIdList');
                    console.log(this.getVisitorInfoByIdList.entourage.split(','));
                    this.people=this.getVisitorInfoByIdList.entourage.split(',');
                    console.log(this.people,'this.people');
                   for(let i=0;i<this.people.length/4;i++){
                       this.peoples.push(
                           this.people.slice((5*i),(5*i+4))
                       )
                   }
                   console.log(this.peoples,'this.peoples');
                }
            })
        }
        


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
            height: 500px;
            .header_left{
                width: 58%;
                height: 450px;
                // border:1px solid #ccc;
                display: inline-block;
                float: left;
            }
            .header_right{
                width: 32%;
                height: 482px;
                // border:1px solid #ccc;
                display: inline-block;
                margin-left: 20px;
                .title{
                    font-size: 24px;
                    font-weight: bold;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                }
                .body{
                    letter-spacing:.2em;
                    margin-top:10px;
                    font-size:16px;
                    height: 20px;
                    line-height: 20px;
                    text-align: left;

                }
                float: right;
            }

        }
        .bottom{
            width: 98%;
            margin:20px auto;
            height: 180px;
            // border:1px solid #ccc;
             .tableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        thead{
                            background: #f2f2f2;
                            th{
                                padding-left: 6px;
                                padding-right: 15px;
                                height: 36px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 14px;
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
                                    height: 40px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    .actionBtn{
                                        width: 18px;
                                        height: 18px;
                                        border: none;
                                        cursor: pointer;
                                        margin-left: 10px;

                                    }
                                  

                                }
                            }
                        }
                    }
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
