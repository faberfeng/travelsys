<template>
    <div id="userLogin">
        <div class="login" align="center">
            <img src="./images/logo-bim-3.png">
        </div>
        <div class="loginInfo">
            华建用户管理中心
        </div>
        <div class="warp">
            <div class="loginBox">
                <div class="loginCenter">
                    <div class="inpDiv">
                        <input type="text" class="accountInp" placeholder="邮箱|账号" v-model="accountVal"/>
                    </div>
                    <div class="inpDiv">
                        <input type="password" class="pwdInp" placeholder="密码 " v-model="passwordVal"/>
                    </div>
                </div>
                <div class="loginButton">
                    <input type="submit" @click.enter="userLogin" class="btn1" value="登陆">
                    <input type="submit" class="btn2" @click="registerCount()" value="注册账号">
                </div>
            </div>
        </div>
        <div class="footer">
            Copyright © 华建数创（上海）科技有限公司版权所有
        </div>


    </div>
</template>

<script>
import md5 from 'js-md5';
import axios from 'axios';
export default {
    name:'userLogin',
    data(){
        return{
            accountVal:'',
            passwordVal:'',
            BDMSUrl:'',
            projectData:'',
        }
    },
    created(){
        var vm=this;
        vm.BDMSUrl=vm.$store.state.BDMSUrl;
    },
    methods:{
        userLogin(){
            var vm=this;
            this.passwordVal = md5(this.passwordVal);
            var formData = new FormData();
            formData.append('userName',this.accountVal.trim());
            formData.append('password',this.passwordVal);

            axios({
                method: 'Post',
                // url: this.BDMSUrl + 'project2/login',
                url: this.BDMSUrl + 'api/v1/certification/login',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
                data:formData
            }).then((response) => {
                this.projectData = response.data;
                if(this.projectData.cd === '0'){
                    localStorage.setItem('tokenId', this.projectData.rt);
                    this.$router.push({
                        path: '/userInformation'
                    })
                    // this.$router.push({
                    //     path:'/projectlist'
                    // })
                }else if(this.projectData.cd === '-1'){
                    alert(this.projectData.msg)
                }
            })

        },
        registerCount(){
            var vm=this;
            vm.$router.push({
                path:'/registerIndex'
            })
        }
    }
}
</script>

<style lang="less" scope>
*{
    margin:0px;
    padding: 0px;
}

#userLogin{
    margin:0 auto;
    .login{
        height: 100px;
        margin-top: 100px;

    }
    .loginInfo{
        height: 100px;
        font-size: 40px;
        text-align: center;
        font-family: "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
        word-spacing: 15px;
        letter-spacing: 5px;
    }
    .warp{
        margin: 10px auto;
        width: 884px;
        .loginBox{
                background-color: #FEFEFE;
                border-radius: 5px;
                font: 14px 'Microsoft YaHei','微软雅黑';
                margin: 0 auto;
                border: 1px solid #BfD6E1;
                width: 400px;
            .loginCenter{
                border-bottom:1px #ccc dashed;
                .inpDiv{
                    margin: 20px;
                    
                     .accountInp{
                             width: 310px;
                            border: 1px solid #D2D9dC;
                            border-radius: 2px;
                            color: #444;
                            font: 12px 'Microsoft YaHei','微软雅黑';
                            padding: 8px 14px;
                            margin-top:20px;
                            margin-bottom: 8px;
                            height: 32px;
                               
                    }
                    .pwdInp{
                            border: 1px solid #D2D9dC;
                            border-radius: 2px;
                            color: #444;
                            font: 12px 'Microsoft YaHei','微软雅黑';
                            padding: 8px 14px;
                            margin-bottom: 8px;
                             width: 310px;
                             height: 32px;
                    }

                }


            }
            .loginButton{
                padding:20px 24px;
                input{
                    margin:0 auto;
                    width: 88%;
                    height:44px;
                    text-align: center;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    border: none;
                    outline: none;
                }
                .btn1{
                    color: #eee;
                    background: #0066cc;
                }
                .btn2{
                    margin-top:10px;
                    color: #636363;
                    background: #eee;
                }

            }
        }

    }
    .footer{
        color: #CCCCCC;
        padding: 10px;

    }
}
</style>
