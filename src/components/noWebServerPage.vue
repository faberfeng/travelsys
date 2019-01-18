<template>
    <div id="noprojectDiv">
         <div  class="noproject">
            <div class="noprojectLeft"><img src='../assets/noWebServer.png'></div>
            <div class="noprojectRight">
                <div class="noprojectRight_header">抱歉，虽然BDMS服务端已经启动,但是产品实例的激活码验证失败,请联系华建数创，并将以下信息提供给客服人员以核实产品授权信息</div>
                <div class="noprojectRight_bottom">
                    UPID:{{retunList.upId}}<br/>
                    BDMS服务地址：{{BDMSUrl}}<br/>
                    服务器识别码：{{retunList.hardCode}}<br/>
                    <!-- 电子邮箱：<br/>
                    客服电话：<br/> -->
                </div>
                <!-- <div></div> -->
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios"
export default {
    name:'noWebServerPage',
    data(){
        return{
            retunList:'',
            BDMSUrl:'',
        }
    },
    created(){
        var vm=this;
        this.BDMSUrl=this.$store.state.BDMSUrl
        vm.validateInstance();


    },
    
    methods:{
        getStyle(){
            var str=document.getElementById("noprojectDiv");

            str.style.width=document.clientWidth;
            str.style.height=document.clientHeight;
        },
        //实例验证
        validateInstance(){
            axios({
                method:'get',
                url: this.BDMSUrl +'user2/validateInstance',
             
            }).then((response) => {
                if(response.data.cd!=0){
                    // this.getStyle();
                    this.retunList=response.data.rt;
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            })
        },

    }
    
}
</script>
<style lang="less" scoped>
*{
    margin: 0;
    padding: 0;
}
li{
    list-style: none;
}
.clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    #noprojectDiv{
        width: 100%;
        height: 950px;
        background: #eff3f6;
    }
.noproject{
        width: 1320px;
        height: 450px;
        // border:1px solid red;
        position:absolute;
        top:50%;
        left:50%;
        margin-left:-570px;
        margin-top:-220px;
    }
    .noprojectLeft{
        float: left;
       margin-top:50px;
    }
    .noprojectRight{
        float: right;
        width: 880px;
        height: 170px;
        margin-top:142px;
        .noprojectRight_header{
            font-size:25.25px;
            color:#ff3333;
            font-weight: bold;
            text-align: left;
            line-height: 50px;
        }
        .noprojectRight_bottom{
            line-height: 28px;
            width: 540px;
            font-size:16px;
            color:#666666;
            font-weight: bold;
            text-align: left;
            margin-left:200px;
            margin-top:62px;
        }
}


</style>


