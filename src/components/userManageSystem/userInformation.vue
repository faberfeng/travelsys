<template>
    <div id="userInformation">
        <div class="header">
            <div class="headerInfo">
                <img src="../register/images/logo-3.png"/>
            </div>
        </div>
        <div v-show="rePasswordShow" class="content">
            <div class="info">
                <div class="infoLeft">
                        账户基本信息
                </div>
                <div style="cursor:pointer" @click="userLoginOut" class="infoRight">
                    退出
                </div>
            </div>
            <div class="dot-line"></div>
            <div class="registerBox">
                <div class="imgLeft">
                    <img :src="userimg?userimg:require('../../assets/people.png')">
                    <!-- @click="clickHeadImg()" -->
                    <label  for="editHeadImg">修改头像</label>
                    <input style="display:none" @change="editHeadImg($event)" type="file" ref="editHeadImg" id="editHeadImg"/>
                </div>
                <ul class="infoUl" v-for="(item,index) in userInformatiomList" :key="index">
                    <li class="infoLi"  >
                        <label style="text-align:right">邮箱 :</label>
                        <label style="text-align:left">{{item.email}}</label>
                        <label></label>
                    </li>
                    <li class="infoLi">
                        <label style="text-align:right">状态 :</label>
                        <label style="text-align:left">{{item.userLevel==1?'激活':'未激活'}}</label>
                        <label></label>
                    </li>
                    <li class="infoLi">
                        <label style="text-align:right">手机 :</label>
                        <label style="text-align:left">{{item.tel}}</label>
                        <label></label>
                    </li>
                    <li class="infoLi">
                        <label style="text-align:right">姓名 :</label>
                        <label v-show="nameShow" style="text-align:left">{{name}}</label>
                        <input v-show="!nameShow" v-model="name"/>
                        <label v-show="nameShow"><a @click="editName()">修改姓名</a></label>
                        <label v-show="!nameShow"><a @click="makeName(name,name2)">完成</a></label>
                    </li>
                    <li class="infoLi">
                        <label  style="text-align:right">账号(昵称) :</label>
                        <label v-show="name2Show" style="text-align:left">{{name2}}</label>
                        <input v-show="!name2Show" v-model="name2"/>
                        <label v-show="name2Show"><a @click="editName2()">修改账号</a></label>
                        <label v-show="!name2Show"><a @click="makeName2(name,name2)">完成</a></label>
                    </li>
                    <li class="infoLi">
                        <label style="text-align:right">密码:</label>
                        <label style="text-align:left">******</label>
                        <label><a @click="editPwd()">修改密码</a></label>
                    </li>
                </ul>
               
            </div>
        </div>

        <div v-show="!rePasswordShow" class="content">
            <div class="info">
                <div class="infoLeft">
                        密码重置
                </div>
                <div style="cursor:pointer" @click="returnInfo" class="infoRight">
                    返回
                </div>
            </div>
            <div class="dot-line"></div>
            <div class="registerBox">
               <table border="0">
                   <tbody>
                       <tr height="50px;">
                            <td align="right" width="135px">原密码 : </td>
                            <td width="265px">
                                <input class="tdInput" type="password"  v-model="oldPassword"   placeholder="密码"/>
                            </td>
                            <!-- <td width="330px">
                                <el-alert v-show="inputPassWord1Show" title="密码需要由6-16个字母、数字和符号组成，区分大小写" type="info" show-icon>
                                </el-alert>
                                <el-alert title="您还没有输入密码" type="error" show-icon>
                                </el-alert>
                            </td> -->
                        </tr>
                         <tr height="50px;">
                            <td align="right" width="135px">密码 : </td>
                            <td width="265px">
                                <input class="tdInput" type="password"  v-model="newpassWord"   placeholder="密码"/>
                            </td>
                            <!-- <td width="330px">
                                <el-alert v-show="inputPassWord1Show" title="密码需要由6-16个字母、数字和符号组成，区分大小写" type="info" show-icon>
                                </el-alert>
                                <el-alert title="您还没有输入密码" type="error" show-icon>
                                </el-alert>
                            </td> -->
                        </tr>
                        <tr height="50px;">
                            <td align="right" width="135px">确认密码 : </td>
                            <td width="265px">
                                <input class="tdInput" type="password"  v-model="confirmPassword"   placeholder="密码"/>
                            </td>
                            <!-- <td width="330px">
                                <el-alert v-show="inputPassWord1Show" title="密码需要由6-16个字母、数字和符号组成，区分大小写" type="info" show-icon>
                                </el-alert>
                                <el-alert title="您还没有输入密码" type="error" show-icon>
                                </el-alert>
                            </td> -->
                        </tr>
                        <tr>
                            <td></td>
                            <td >
                                <input type="submit" value="完成" id="rePassMakeSure" class="rePassMakeSure" @click="rePassMakeSure()"/>
                            </td>
                            <td>
                                <input type="submit" value="取消" id="rePassCancle" class="rePassCancle" @click="rePassCancle()"/>
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
import md5 from 'js-md5'
export default {
    name:'userInformation',
    data(){
        return{
            tokenId:'',
            userInformatiomList:[],
            BDMSUrl:'',
            userimg:'',
            nameShow:true,
            name:'',
            name2Show:true,
            name2:'',
            pwdShow:true,
            password:'',
            rePasswordShow:true,
            oldPassword:'',
            newpassWord:'',
            confirmPassword:'',
            userId:'',
            fileLists:'',
            updateAvaterUri:'',
        }
    },
    created(){
        var vm=this;
        vm.tokenId=localStorage.getItem('tokenId');
        vm.BDMSUrl=vm.$store.state.BDMSUrl;
        vm.getOnlineInfo();

    },
    methods:{
        clickHeadImg(){
            this.$refs.editHeadImg.click();
        },
        editHeadImg(file){
            var vm=this;
            this.fileLists=this.$refs.editHeadImg.files[0];
             if(vm.fileLists){
                this.updateAvaterUri=URL.createObjectURL(vm.fileLists);
                this.userimg=this.updateAvaterUri;
                this.updateUserAvater();
            }

            
        },
        //确认修改头像
        updateUserAvater(){
            var vm=this;
            var formData=new FormData()
            formData.append('file',this.fileLists)
            axios({
                url:this.BDMSUrl+'/user/updateUserAvater',
                method:'POST',
                headers:{
                    'token':vm.tokenId
                },
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    // vm.getOnlineInfo();
                }
            })

        },
        userLoginOut(){
             var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'api/v1/certification/logout',
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.tokenId
                },
            }).then((response)=>{
                if(response.data.cd == "0"){
                    localStorage.removeItem('tokenId');
                    localStorage.clear('vuex');//清除所有localStorage
                    vm.$router.push({
                        path:'/userLogin'
                    }) 
                }
            }).catch((err)=>{
                console.log('退出失败!')
                console.log(err)
            })


        },
        //获取用户头像
        getAvater(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'user/avater',
                params:{
                    userId:vm.userId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    alert('失败')
                }else{
                    alert('成功')
                }
            })
        },
        getOnlineInfo(){
            var vm=this;
            this.userInformatiomList=[];
            axios({
                url:vm.BDMSUrl+'user/getOnlineInfo',
                headers:{
                    'token':vm.tokenId
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.userInformatiomList.push(response.data.rt.user);
                    this.name=response.data.rt.user.name;
                    this.name2=response.data.rt.user.name2;
                    this.userId=response.data.rt.user.userId;
                    if(response.data.rt.user.userAvater==null){
                        this.userimg=''
                    }else{
                        this.userimg=this.BDMSUrl+'user/avater?userId='+this.userId;
                    }
                    // this.getAvater();
                    
                    console.log(this.userInformatiomList,'this.userInformatiomList');
                }
                
            })
        },
        editName(){
            this.nameShow=false
        },
        makeName(name,name2){
            this.nameShow=true
            this.updateUserProfile(name,name2)

        },
        editName2(){
            this.name2Show=false
        },
        makeName2(name,name2){
            this.name2Show=true
            this.updateUserProfile(name,name2)
        },

        editPwd(){
            this.rePasswordShow=false
        },
        //返回
        returnInfo(){
            this.rePasswordShow=true
        },
        //修改用户信息
        updateUserProfile(realName,nickname){
            var vm=this;
            axios({
                url:this.BDMSUrl+'user/updateUserProfile',
                 method:'get',
                headers:{
                    'token':vm.tokenId
                },
                params:{
                    nickname:nickname,
                    realName:realName
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    // vm.getOnlineInfo()
                }
            })
        },
        rePassMakeSure(){
            var vm=this;
            if(vm.oldPassword==this.newpassWord){
                this.$message({
                    type:"info",
                    message:'新密码不可以与旧密码重复'
                })
            }else if(vm.confirmPassword!=this.newpassWord){
                this.$message({
                    type:"info",
                    message:'请确认新密码'
                })
            }else{
                 axios({
                url:vm.BDMSUrl+'user/resetPassword',
                method:'POST',
                headers:{
                    'token':vm.tokenId
                },
                params:{
                    oldPassword:vm.oldPassword,
                    password:vm.newpassword,
                    confirmPassword:vm.confirmPassword,
                    userId:vm.userId
                }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.$message({
                            type:"success",
                            message:'密码修改成功'
                        })
                        this.oldPassword='';
                        this.newpassWord='';
                        this.confirmPassword='';
                    }else{
                        this.$message({
                            type:"error",
                            message:response.data.msg
                        })

                    }
                })

            }
           
        },
        rePassCancle(){
            this.rePasswordShow=true
            this.oldPassword='';
            this.newpassWord='';
            this.confirmPassword='';
        }

        // user/updateUserProfile
    }
}
</script>

<style lang="less" scope>
*{
    margin:0px;
    padding: 0px;
}
ul,li{
    margin:0px;
    padding: 0px;
    list-style:none
}
#userInformation{
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
                width: 170px;
                padding: 25px;
                float: right;
                font-size: 14px;
            }
        }
        .dot-line{
            border-bottom:1px #ccc dashed; 
        }
        .registerBox{
                border-bottom: 1px solid #DDE0E8;
                padding: 24px;
                position: relative;
                .imgLeft{
                    position: absolute;
                    // float: left;
                    // width: 100px;
                    left:20px;
                    top:30px;
                    img{
                        width: 120px;
                        height: 120px;
                    }
                    label{
                        color: #0066cc;
                        display: block;
                        cursor: pointer;
                    }
                }
                .infoUl{
                    width: 600px;
                    // margin-left：50px
                    .infoLi{
                        height: 50px;
                        padding: 5px;
                        
                        label{
                            width: 100px;
                            font-size:14px;
                            display: inline-block;
                            a{
                                color: #0066cc;
                                outline: none;
                                border: none;
                                text-decoration: none;
                                cursor: pointer;
                                &:hover{
                                    color: #1f75dd;
                                }
                            }
                        }
                        input{
                            width: 130px;
                            height: 22px;
                            // border: none;
                            box-sizing: border-box;
                            outline: none;
                            padding-left:2px;
                            border-radius: 2px;
                            border:1px solid #ccc;
                        }
                    }
                }
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
                                .rePassMakeSure{
                                    width: 150px;
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
                                    display: inline-block;
                                    // float: left;


                                }
                                .rePassCancle{
                                    margin-left:20px;
                                    width: 150px;
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
                                    display: inline-block;
                                    // float: right;
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
