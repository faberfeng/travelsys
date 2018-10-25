<template>
    <div id="commonDetail">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{projctName}}</span>
                
            </p>
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
    }

</style>


