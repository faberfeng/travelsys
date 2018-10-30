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
                    <span class="headLeftBtn">底图</span>
                    <span class="headLeftBtn">单点</span>
                    <span class="headLeftBtn">连续</span>
                    <span class="headLeftBtn">文字</span>
                </div>
                <div class="headMiddle">
                    <label>测试总数：80</label>
                    <label>报警：22</label>
                    <label>故障：2</label>
                </div>
                <div class="headRight">
                    <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==2" class="import">导入</span>
                        <span v-show="importMethod==1" class="import">配置</span>
                </div>
            </div>
            <div class="projectBodyCenter">
                <div class="operateTool">
                    <div class="operateToolLeft">
                        <span class="move"><i class="moveIcon"><label class="moveTxt">移动</label></i></span>
                        <span class="fault"><i class="faultIcon"><label class="faultTxt">故障</label></i></span>
                        <span class="deleteDraw"><i class="deleteDrawIcon"><label class="deleteDrawTxt">删除</label></i></span>
                    </div>
                </div>
                
            </div>
            <div class="projectBodyBottom">
                

            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
export default Vue.component('commonDetail',{
    props:['projctName','itemMonitorId'],
    name:'commonDetail',
    data(){
        return{
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
    },
    filters:{

    },
    watch:{

    },
    methods:{
        //返回
        back(){
            var vm = this
            vm.$emit('back')
        },

    }
})
</script>
<style lang="less">
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
                            // .operateToolRight{
                            //     float: right;
                            //     width: 62px;
                            //     height: 34px;
                            //     margin-left:10px;
                            //     border:1px solid #ccc;
                            //     border-radius:2px;
                            //     box-shadow: 1px 1px 2px #888888;
                            //     background: #fff;
                            //     .saveDrawTxt{
                            //         font-size:12px;
                            //         color:#666666;
                            //         line-height: 32px;
                            //     }
                            // }

                        }

            }
            .projectBodyBottom{

            }


        }
    }

</style>


