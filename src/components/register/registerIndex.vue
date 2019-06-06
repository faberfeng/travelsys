<template>
    <div id="registerIndex">
        <div class="header">
            <div class="headerInfo">
                <img src="./images/logo-3.png"/>
            </div>
        </div>
        <div class="content">
            <div class="info">
                <div class="infoLeft">
                        注册通行证
                </div>
                <div @click="returnUserLogin" class="infoRight">
                        返回
                </div>

            </div>
            <div class="dot-line"></div>
            <div class="registerBox">
                <table border="0">
                    <tbody>
                        <tr height="50px;">
                            <td align="right" width="135px">手机 : </td>
                            <td width="265px">
                                <input class="tdInput" v-model="phone" @focus="focusPhone()" @blur="blurPhone(1,phone)" placeholder="手机"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputPhoneShow" title="输入手机号(*非必填项)" type="info" show-icon>
                                </el-alert>
                                <!-- <el-alert v-show="inputPhoneNoShow" title="请输入有效的手机号" type="error" show-icon>
                                </el-alert> -->
                                <el-alert v-show="inputPhoneVfShow" title="手机号已被使用" type="error" show-icon>
                                </el-alert>
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">邮箱 : </td>
                            <td width="265px">
                                <input class="tdInput" v-model="email" @focus="focusEmail()" @blur="blurEmail(2,email)" placeholder="邮箱"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputEmailShow" title="请输入有效的电子邮箱，用于登陆和注册" type="info" show-icon>
                                </el-alert>
                                <el-alert v-show="inputEmailNoShow" title="请输入有效的电子邮箱" type="error" show-icon>
                                </el-alert>
                                <el-alert v-show="inputEmailVfShow" title="该邮箱已被使用" type="error" show-icon>
                                </el-alert>
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">姓名 : </td>
                            <td width="265px">
                                <input class="tdInput" v-model="realName" @focus="focusRealName()" @blur="blurRealName(3,realName)" placeholder="姓名"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputRealNameShow" title="3-20位，可由汉字、字母、数字和'_'组成" type="info" show-icon>
                                </el-alert>
                                <!-- <el-alert title="您还没有输入姓名" type="error" show-icon>
                                </el-alert> -->
                                 <el-alert v-show="inputRealNameVfShow" title="该用户已被存在" type="error" show-icon>
                                </el-alert>
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">账号 : </td>
                            <td width="265px">
                                <input class="tdInput" v-model="nickName" @focus="focusNickName()" @blur="blurNickName()" placeholder="账号"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputNickNameShow" title="3-20位，可由汉字、字母、数字和'_'组成" type="info" show-icon>
                                </el-alert>
                                <!-- <el-alert title="您还没有输入昵称" type="error" show-icon>
                                </el-alert> -->
                            </td>
                        </tr >
                        <tr height="100px">
                            <td align="right" width="135px">头像 : </td>
                            <td width="265px" colspan="2">
                                <div class="imgUpload">
                                    <label for="imgUploadInfo">
                                        <img style="margin-top:55px;cursion:pointer" v-show="!localAvaterUri" src="./images/add.png">
                                        <img style="width:148px;height:148px;padding:1px;" v-show="localAvaterUri" :src="localAvaterUri">
                                    </label>
                                    <input class="imgInput" type="file" accept="image/*" @change="addImg($event)" ref="imgUploadInfo"  id="imgUploadInfo" multiple="multiple"/>
                                </div>
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">密码 : </td>
                            <td width="265px">
                                <input class="tdInput" type="password"  v-model="passWord1" @focus="focusPassWord1()" @blur="blurPassWord1()"  placeholder="密码"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputPassWord1Show" title="密码需要由6-16个字母、数字和符号组成，区分大小写" type="info" show-icon>
                                </el-alert>
                                <!-- <el-alert title="您还没有输入密码" type="error" show-icon>
                                </el-alert> -->
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">确认密码 : </td>
                            <td width="265px">
                                <input class="tdInput" type="password"  v-model="passWord2" @focus="focusPassWord2()" @blur="blurPassWord2()"  placeholder="密码"/>
                            </td>
                            <td width="330px">
                                <el-alert v-show="inputPassWord2Show" title="请确认密码" type="info" show-icon>
                                </el-alert>
                                <el-alert v-show="inputPassWord2NoShow" title="密码不一致,请再次确认" type="error" show-icon>
                                </el-alert>
                            </td>
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">验证码 : </td>
                            <td width="265px">
                                <input class="tdInput1" v-model="validateCode" @focus="focusCode()" @blur="blurCode()" placeholder="验证码"/>
                                <input id="getCode" type="button" value="获取验证码" @click="sendMobileCode()"/>
                                <!-- <button @click="sendMobileCode()">发送验证码</button> -->
                            </td>
                            <!-- <td width="65px">
                                <button>发送验证码</button>
                            </td> -->
                            <td width="330px">
                                <el-alert v-show="inputCodeShow" title="输入手机验证码(*非必填项)" type="info" show-icon>
                                </el-alert>
                                <!-- <el-alert title="请输入手机验证码" type="error" show-icon>
                                </el-alert> -->
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="2">
                                <input type="submit" value="注册" id="registerMakeSure" class="registerMakeSure" @click="registerMakeSure()"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="footer">
            Copyright © 华建数创（上海）科技有限公司版权所有
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5';
export default {
    name:'registerIndex',
    data(){
        return{
            BDMSUrl:'',
            phone:'',//电话
            validateCode:'',//验证码
            email:'',//邮箱
            nickName:'',//昵称
            realName:'',//真实姓名
            passWord1:'',//密码
            passWord2:'',//再次确认密码
            avaterUri:'',//头像地址
            localAvaterUri:'',//当地头像地址
            fileList:'',//上传文件信息
            inputPhoneShow:false,
            inputPhoneNoShow:false,
            inputPhoneVfShow:false,
            inputCodeShow:false,
            inputEmailShow:false,
            inputEmailNoShow:false,
            inputEmailVfShow:false,
            inputRealNameShow:false,
            inputRealNameVfShow:false,
            inputNickNameShow:false,
            inputPassWord1Show:false,
            inputPassWord2Show:false,
            inputPassWord2NoShow:false,
            inputCodeShow:false,
            count:60,//间隔函数，1秒执行
            curCount:'', //当前剩余秒数
            InterValObj:'',
            code:'',
        }
    },
    created(){
        var vm=this;
        vm.BDMSUrl=vm.$store.state.BDMSUrl
    },
    methods:{
        //返回到用户中心
        returnUserLogin(){
            var vm=this;
            vm.$router.push({
                path:'/userLogin'
            })
        },
        //确认注册
        registerMakeSure(){
            var vm=this;
            // replace(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,'')
            if(vm.email==''){
                this.$message({
                    type:'info',
                    message:'邮箱不能为空'
                })

            }else if(vm.realName==''){
                    this.$message({
                        type:'info',
                        message:'姓名不能为空'
                    })
            }else if(vm.nickName==''){
                    this.$message({
                        type:'info',
                        message:'昵称不能为空'
                    })
            }
            // else if(vm.localAvaterUri==''){
            //      this.$message({
            //             type:'info',
            //             message:'头像不能为空'
            //         })
            // }
            else if(this.passWord1==''||this.passWord2==''){
                this.$message({
                        type:'info',
                        message:'密码不能为空'
                    })
            }else{
                axios({
                    url:vm.BDMSUrl+'register/reg',
                    method:'get',
                    params:{
                        phone:vm.phone,//电话
                        validateCode:vm.validateCode,//验证码
                        email:vm.email,//邮箱
                        nickname:vm.nickName.trim(),//昵称
                        realName:vm.realName.trim(),//真实姓名
                        pwd1:md5(vm.passWord1),//密码
                        pwd2:md5(vm.passWord2),//再次确认密码
                        avaterUri:vm.avaterUri,//头像地址
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        // this.$message({
                        //     type:'success',
                        //     message:'注册成功,请留意邮箱并进行激活'
                        // })
                        // vm.phone='';
                        // vm.validateCode='';
                        // vm.email='';
                        // vm.nickName='';
                        // vm.realName='';
                        // vm.passWord1='';
                        // vm.passWord2='';
                        // vm.avaterUri='';
                        // vm.localAvaterUri='';
                        setTimeout(()=>{
                            this.$router.push({
                                path:'/userRegisterSuccess'
                            })
                        },1000)
                    }else{

                    }
                })

            }
            
        },
        //发送验证码
        sendMobileCode(){
            var vm=this;
            

            if(this.phone==''){
                this.$message({
                    type:'success',
                    message:'请输入手机号'
                })
            }else{
                // this.curCount = this.count;
                // $('#getCode').attr("disabled", "true");
                // $('#getCode').val("请在"+this.curCount+"秒内输入");
                // this.InterValObj =window.setInterval(this.SetRemainTimes(),1000);
                axios({
                    url:vm.BDMSUrl+'register/sendValidateCode',
                    method:'get',
                    params:{
                        mobile:vm.phone
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.$message({
                            type:"success",
                            message:'手机验证发送成功,请注意查收'
                        })
                        vm.validateCode=response.data.rt;
                    }else{
                        this.$message({
                            type:"success",
                            message:'手机验证发送失败,请重新查收'
                        })
                    }
                })
            }
            
        },
        SetRemainTimes(){
            if(this.curCount == 0) {
               window.clearInterval(this.InterValObj); //停止计时器 
               $("#getCode").removeAttr("disabled"); //启用按钮 
               $("#getCode").val("重新发送验证码");
               this.code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效   
            } else {
               this.curCount--;
               $("#getCode").val("请在" + this.curCount + "秒内输入");
            }
        },
        addImg(file){
            var vm=this;
            vm.fileList=this.$refs.imgUploadInfo.files[0];
            if(vm.fileList){
                this.localAvaterUri=URL.createObjectURL(vm.fileList);
                vm.uploadAvater();
            }
            
        },
        //上传头像
        uploadAvater(){
            var vm=this;
            var formData=new FormData();
            formData.append('file',vm.fileList);
            axios({
                url:vm.BDMSUrl+'register/uploadAvater',
                method:'post',
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    this.avaterUri=response.data.rt;
                }
            })
        },
        //注册填写信息查重
        validateRepeat(type,value){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'register/validateRepeat',
                method:'get',
                params:{
                    type:type,//1-手机；2-邮箱；3-用户名
                    value:value,
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    if(response.data.rt=="ERROR"){
                        if(type==1){
                        this.inputPhoneVfShow=true;
                        }else if(type==2){
                            this.inputEmailVfShow=true;
                        }else if(type==3){
                            this.inputRealNameVfShow=true;
                        }
                    } 
                }
            })
        },

        //改变电话
        focusPhone(){
            this.inputPhoneShow=true;
            this.inputPhoneVfShow=false;
            this.inputPhoneNoShow=false;
        },
        blurPhone(type,value){
            this.inputPhoneShow=false;
             var regMobile=/^1\d{10}$/;
             if(regMobile.test(value)==false){
                 this.inputPhoneNoShow=true
             }else{
                this.validateRepeat(type,value)
             }
        },

        focusEmail(){
            this.inputEmailShow=true;
            this.inputEmailVfShow=false;
            this.inputEmailNoShow=false;
            
        },
        blurEmail(type,value){
            this.inputEmailShow=false;
            var reg=/^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;   
            if(reg.test(value)==false){
                this.inputEmailNoShow=true;
            }else{
                this.validateRepeat(type,value)
            }
            
        },
        blurRealName(type,value){
            this.inputRealNameShow=false;
            this.validateRepeat(type,value)
        },
        focusRealName(){
            this.inputRealNameShow=true;
            this.inputRealNameShow=false;
        },  
        focusNickName(){
            this.inputNickNameShow=true;
        },
        blurNickName(){
            this.inputNickNameShow=false;
        },
        focusPassWord1(){
            this.inputPassWord1Show=true;
        },
        blurPassWord1(){
            this.inputPassWord1Show=false;
        },
        focusPassWord2(){
            this.inputPassWord2Show=true;
            this.inputPassWord2NoShow=false
        },
        blurPassWord2(){
            this.inputPassWord2Show=false;
            if(this.passWord1!=this.passWord2){
                this.inputPassWord2NoShow=true
            }else{
                this.inputPassWord2NoShow=false
            }
        },
        focusCode(){
            this.inputCodeShow=true;
        },
        blurCode(){
            this.inputCodeShow=false;
        }






    }
}
</script>
<style lang="less" scope>
*{
    margin: 0px;
    padding: 0px;
}
li{
    list-style: none;
}
#registerIndex{
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
                width: 350px;
                padding: 25px;
                font-size: 22px;
                font-weight: bold;
                color: #0066cc;
                float: left;
            }
            .infoRight{
                padding: 25px;
                float: right;
                font-size: 14px;
                width: 170px;
                cursor: pointer;
            }
        }
        .dot-line{
            border-bottom:1px #ccc dashed; 
        }
        .registerBox{
                border-bottom: 1px solid #DDE0E8;
                padding: 24px;
            table{
                tbody{
                    font-size:14px;
                    tr{
                        td{
                            .tdInput{
                                width: 265px;
                                height: 32px;
                                display: inline-block;
                                padding: 4px;
                                font-size: 13px;
                                line-height: 18px;
                                color: #808080;
                                border: 1px solid #ccc;
                                border-radius:3px;
                                margin-right:3px;
                                margin-left:3px;
                            }
                            .tdInput1{
                                // width: 150px;
                                height: 32px;
                                display: inline-block;
                                padding: 4px;
                                font-size: 13px;
                                line-height: 18px;
                                color: #808080;
                                border: 1px solid #ccc;
                                border-radius:3px;
                                float: left;
                                margin-right:3px;
                                margin-left:3px;
                            }
                            .imgUpload{
                                margin-left:4px;
                                width: 150px;
                                height: 150px;
                                border:1px solid #ccc;
                                border-radius: 3px;
                                background: #F2F2F2;
                                &:hover{
                                    border:1px #0066cc dashed;
                                }
                                .imgInput{
                                    display: none;
                                }
                                // img{
                                //     margin-top:55px;
                                //     cursor: pointer;
                                // }
                            }
                            .registerMakeSure{
                                width: 300px;
                                color: #eee;
                                background: #0066cc;
                                font-family: Arial, Helvetica, sans-serif;
                                text-align: center;
                                position: relative;
                                overflow: hidden;
                                cursor: pointer;
                                border: none;
                                outline: none;
                                height: 32PX;
                                border-radius: 2px;
                                margin:10px;
                            }
                            button{
                                margin-top:5px;
                            }
                        }

                    }

                }
                
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
