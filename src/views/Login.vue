<template>
    <div class="bos_login">
        <div class="loginBody">
            <div class="loginWrapper">
                <div class="loginBgImg"></div>
                <div class="loginContent">
                    <div class="loginPadding">
                        <div class="loginHeader">
                            <!-- <img src="../assets/imgs/loginBos.png"> -->
                            <span class="title1">欢迎登录</span>
                            <span class="title2">地铁轨迹系统</span>
                        </div>
                        <div class="loginInp">
                            <input placeholder="请输入您的账号名称" size="large" :class="[{'errorInp':errorShow},'userInp']" autocomplete="off"  type="text"  v-model="userName" ref="userNameInput"/>
                            <i class="el-icon-user aicon"></i>
                        </div>
                        <div class="loginInp">
                            <input  type="password"  placeholder="请输入您的登录密码" size="large"   :class="[{'errorInp':errorShow},'userInp']" @mouseleave="leaveInp"  autocomplete="off"  @keyup.enter="loginMakeSure" v-model="password" ref="userNameInput"/>
                            <input type="password" autocomplete="new-password" style="display: none"/>
                            <i class="el-icon-lock aicon"></i>
                        </div>
                        <div class="forgetpassword">
                            <span class="autoLogin_week">
                                <el-checkbox class="aCheck" v-model="autoLoginShow" @change="autoLoginWeek" style="margin-right:4px;vertical-align:text-top"></el-checkbox>
                                <!-- <input type="checkbox" class="aCheck" v-model="autoLoginShow" @change="autoLoginWeek" style="margin-right:4px;vertical-align: text-bottom"/> -->
                                一周内自动登录</span>
                            <!-- <span class="forgetpasswordSpan" @click="forgetPassWord">忘记密码</span> -->
                        </div>
                        <div class="loginBtn" @click="loginMakeSure">
                            <span>登录</span>
                        </div>
                        <!-- <div class="skipRegist" @click="skipRegister">
                            <span style="color:#1890FF">
                                没有账号
                            </span>
                            <span style="color:#E11B22" >
                                注册
                            </span>
                        </div> -->
                    </div>
                    <div class="leftTop"></div>
                    <div class="rightTop"></div>
                    <div class="leftBottom"></div>
                    <div class="rightBottom"></div>
                    
                </div>
            </div>
        </div>
        <div class="register_txt1">
                <!-- <img style="width:118px;height:30px;cursor:pointer;vertical-align:top" @click="enterArctron" src="../assets/imgs/logoArctron.png">  -->
                <span style="line-height:30px">上海地铁1号线实时轨迹系统   Copyright © 2022</span>
        </div>
         <!-- <div class="register_footer">
             <div class="register_img">
                 <img src="../assets/imgs/hjlogo.png">
                 <img style="margin-left:10px" src="../assets/imgs/weixin.png">
             </div>
             <div class="register_txt">
                 沪ICP备31010102005250号   Copyright © 2019
             </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name:'bosLogin',
    data(){
        return{
            userName:'admin',
            password:'admin',
            access_token:'',
            errorShow:false,
            autoLoginShow:false
        }
    },
    created(){
        var vm=this;
        // vm.getAutoLogin();
    },
    methods:{
        getAutoLogin () {
            this.autoLoginShow=this.getCookie('autoLoginShow').toString()
            this.userName=this.getCookie('userName')
            this.password=this.getCookie('password')
            if(this.autoLoginShow){
                this.loginMakeSure()
            }else{
                this.autoLoginShow=false;
                this.userName='';
                this.password='';
            }
        },
        //一周内自动登陆
        autoLoginWeek (e) {
            if(this.userName&&this.password){
                this.autoLoginShow=e.target.checked;
                this.setCookie('autoLoginShow',this.autoLoginShow,7);
                this.setCookie('userName',this.userName,7);
                this.setCookie('password',this.password,7);
            }else{
                this.$message.info('请输入账号或者密码')
            }
            
        },
        //设置cookie
        setCookie (cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname+"="+cvalue+"; "+expires;
        },
        //获得cookie
        getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        },
        leaveInp(){

        },
        loginMakeSure(){
            if(this.userName=='admin'&&this.password=='admin'){
                this.$store.commit('changeMenus','1')
                this.$router.push({
                    path: '/reviews'
                })
            }else{
                this.$message.error('账号或者密码错误');;
            }
        },
        //忘记密码
        forgetPassWord(){
            let routeUrl =this.$router.resolve({path:'/forgetPassWord'});
            window.open(routeUrl.href, '_blank');
        }
    }

}
</script>

<style lang="less" scoped>
.bos_login{
    max-width:1920px;
    min-width:1200px;
    margin:0 auto;
    height:100%;
    position:relative;
    color: white;
    .loginBody{
        width: 100%;
        // height: calc(100vh);
        height: 100%;
        border:none;
        background: url('../assets/imgs/bg.png') repeat-y;
        background-position: center;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        //  filter: blur(1px);
        .loginWrapper{
            // max-width:1000px;
            max-height:630px;
            min-width: 800px;
            width: 80%;
            display: flex;
            flex-direction: row;
            // justify-content: center;
            justify-content: space-around;
            align-items: center;
            .loginBgImg{
                width: 60%;
                height:598px;
                max-width: 697px;
                border:none;
                background: url('../assets/imgs/bg-img.png') no-repeat;
                background-position: center;
                position: relative;
                // -webkit-filter: blur(1px); /* Chrome, Opera */
                // -moz-filter: blur(1px);
                // -ms-filter: blur(1px);    
                // filter: blur(1px);
            }
            .loginContent{
                width:38%;
                // height:400px;
                background:rgba(255,255,255,0.08);
                box-shadow:2px 5px 19px 0px rgba(0,0,0,0.08);
                border-radius:6px;
                min-width: 400px;
                max-width: 450px;
                height: 465px;
                position: relative;
                // -webkit-filter: blur(1px); /* Chrome, Opera */
                // -moz-filter: blur(1px);
                // -ms-filter: blur(1px);    
                // filter: blur(1px);
                .loginPadding{
                    padding: 70px 45px 30px 45px;
                    .loginHeader{
                        margin-bottom: 50px;
                        height: 36px;
                        width: 100%;
                        text-align: center;
                        white-space: nowrap;
                        .title1{
                            width:128px;
                            height:45px;
                            font-size:32px;
                            font-family:'PingFangSC-Medium,PingFang SC';
                            font-weight:500;
                            color:rgba(255,255,255,1);
                            line-height:45px;
                        }
                        .title2{
                            width:164px;
                            height:45px;
                            font-size:32px;
                            font-family:'PingFangSC-Medium,PingFang SC';
                            font-weight:500;
                            color:rgba(225,27,34,1);
                            line-height:45px;
                        }
                    }
                    .loginInp{
                        margin:25px auto;
                        width: 100%;
                        height: 40px;
                        position: relative;
                        input:focus-visible {
                                outline: none !important;
                        }
                        .userInp{
                            background: rgba(255, 255, 255, 0.08);
                            width: 92%;
                            max-width:360px;
                            height:40px;
                            border-radius:4px;
                            color: white;
                            border:1px solid rgba(153,153,153,0.6);
                            padding-left:30px; 
                            &:hover{
                                border:1px solid rgba(54,72,135,1);
                            }
                        }
                        .errorInp{
                            border:1px solid rgba(119,30,30,1);
                        }
                        .aicon{
                            position: absolute;
                            left:8px;
                            top:14px;
                            font-size: 16px;
                        }
                    }
                    .forgetpassword{
                        height: 40px;
                        width: 100%;
                        
                        .autoLogin_week{
                            text-align: left;
                            float: left;
                            width: 50%;
                            display: inline-block;
                            color:rgba(255,255,255,0.6);
                            cursor:pointer;
                            &:hover{
                                color: #E11B22;
                            }
                            .aCheck{
                                // width:16px;
                                // height:16px;
                                // // border: none;
                                // border:1px solid rgba(152,152,152,1);
                                // &:hover{
                                //     color: #E11B22;
                                // }
                            }
                        }
                        .forgetpasswordSpan{
                            text-align: right;
                            float: right;
                            width: 50%;
                            display: inline-block;
                            color:#1890FF;
                            cursor:pointer;
                            &:hover{
                                color: #E11B22;
                            }
                        }
                    }
                    .loginBtn{
                        width:100%;
                        height:40px;
                        // background:rgba(225,27,34,1);
                        background: #E11B22;
                        border-radius:4px;
                        line-height: 40px;
                        font-weight:500;
                        font-size: 16px;
                        cursor: pointer;
                        color: white;
                        &:hover{
                            background: #C70911;
                        }
                    }
                    .skipRegist{
                        margin:24px auto;
                        width:100%;
                        height:40px;
                        text-align: center;
                        line-height: 40px;
                        cursor: pointer;

                    }
                }
                .leftTop{
                    position: absolute;
                    background: url('../assets/imgs/leftTop.png');
                    top:0px;
                    left:0px;
                    width: 12px;
                    height: 12px;

                }
                .rightTop{
                     position: absolute;
                      background: url('../assets/imgs/rightTop.png');
                        top:0px;
                        right:0px;
                        width: 12px;
                        height: 12px;

                }
                .leftBottom{
                    position: absolute;
                    background: url('../assets/imgs/leftBottom.png');
                    left:0px;
                    bottom:0px;
                    width: 12px;
                    height: 12px;
                }
                .rightBottom{
                    position: absolute;
                    background: url('../assets/imgs/rightBottom.png');
                    bottom:0px;
                    right:0px;
                    width: 12px;
                    height: 12px;
                }

            }
        }
    }
    .register_footer{
        width:100%;
        height:120px;
        background:rgba(255,255,255,1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .register_img{
            width: 50%;
            height: 44px;
            margin-top:10px;
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
        .register_txt{
            width: 50%;
            height: 44px;
            margin-top:10px;
            color:black;
        }
    }
    .register_txt1{
        position: absolute;
        bottom: 30px;
        color:white;
        left:50%;
        font-size: 14px;
        line-height: 30px;
        margin-left:-170px;
        opacity: 0.7;
    }

}

</style>>
