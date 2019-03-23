<template>
    <div id="active">
        <div class="header">
            <div class="headerInfo">
                <img src="./images/logo-3.png"/>
            </div>
        </div>
        <div class="content" >
            <div class="info">
                <div class="infoLeft1">
                        {{activeTxt}}
                </div>
            </div>
            <div class="dot-line"></div>
            <div class="activeBox">
                <p v-if="activeShow">请点击<a href="https://bim.arctron.cn/BDMSTest/#/login">BDMS管理系统</a>登入使用</p>
                <p v-if="!activeShow">请重新验证激活</p>
            </div>
        </div>
        <div class="footer">
            Copyright © 华建数创（上海）科技有限公司版权所有
        </div>
    </div>    
</template>

<script>
import axios from 'axios'
export default {
    name:'active',
    data(){
        return{
            BDMSUrl:'',
            email:'',
            activeCode:'',
            activeShow:false,
            activeTxt:''
        }
    },
    created(){
        var vm=this;
        vm.BDMSUrl=vm.$store.state.BDMSUrl;
        vm.email=vm.$route.query.email;
        vm.activeCode=vm.$route.query.activeCode;
    },
    mounted(){
        this.userActive();
    },
    methods:{
        userActive(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'register/userActive',
                params:{
                    email:vm.email,
                    activeCode:vm.activeCode
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.activeTxt='激活成功,恭喜'+vm.email+'注册成功';
                    this.activeShow=true;
                }else{
                    this.activeTxt='激活失败,请重新发送邮件激活';
                    this.activeShow=false;
                }
            })
        }

    }
}
</script>

<style lang="less" scope>
    a{text-decoration:none;}
    *{
        margin:0px;
        padding: 0px;
    }
    #active{
        font: 12px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
        color: #000;
        margin: 0 auto;
        background: #F2F2F2;
        .header{
            padding-top: 25px;
                height: 75px;
                background: #ececec;
                border-bottom: 1px solid #d9d9d9;
            .headerInfo{
                width: 900px;
                margin:0 auto;
                float: left;

            }
        }
        .content{
            width: 850px;
            margin:0 auto;
            border: 1px solid #ccc;
            margin-top:30px;
            padding:0 20px;
            background: #fff;
            // height: 800px;
            height: auto;
            .info{
                width: 850px;
                height: 75px;
                .infoLeft{
                    width: 550px;
                    padding: 25px;
                    font-size: 22px;
                    font-weight: bold;
                    color: #0066cc;
                    float: left;
                }
            }
            .dot-line{
                border-bottom:1px #ccc dashed; 
            }
            .activeBox{
                // position: absolute;
                // width: 250px;
                // height: 200px;
                // border:1px solid #ccc;
                // background: #f0f0f0;
                // // top:40%;
                // margin-top:200px;
                // left:40%;
                p{
                    margin:10px 80px;
                    font-size: 14px;
                    color:black;
                    text-align: left;
                }
            }
        }
        .footer{
            margin: 0 auto;
            width: 600px;
            text-align: center;
            font-size: 12px;
            color: #CCCCCC;
            padding: 10px;
        }
    }

</style>
