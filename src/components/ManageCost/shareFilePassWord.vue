<template>
    <div id="shareFilePassWord">
        <el-row class="container-header">
            <el-col :span="24" class="header">
                <div class="headerImg">
                    <img src='./images/shareFileLogo.png'/>
                    <!-- <img :src="proimg?proimg:require('../assets/defaultlogo.png')"/> -->
                </div>
                <div class="headerText">工程云盘</div>
                <div class="headerInfo">
                    <a class="userCenter" href="http://bdms.arctron.cn/arctron-usercenter">用户中心</a>
                    <span class="appDownLoad" href="">客户端下载</span>
                </div>
            </el-col>
        </el-row>
        <div class="sharePassBody">
            <div class="center">
                <div class="center_item">
                    工程云盘
                </div>
                <div class="center_frame">
                    <div class="center_frame_top">
                        <img class="userImg" :src="userImg?userImg:require('../../assets/people.png')"/>
                        <label class="userItem"><label class="userItem_bold" v-text="user.realName"></label>给你加密分享了文件</label>
                    </div>
                    <div class="center_frame_bottom">
                        <div class="pass_word">请输入访问密码</div>
                        <div class="password_inp"><input v-model="passwordValue" class="text_inp"/><button class="submit" @click="getFilePathByPassWord">提取文件</button></div>
                    </div>
                </div>
            </div>
            <div class="fix_background"></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default{
    data(){
        return{
            qjShareGroup:'',
            user:'',
            shareNo:'',
            userImg:'',
            passwordValue:''
            }
    },
    created(){
        var vm=this;
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
    },
    mounted(){
        this.searchShareFile();
    },
    methods:{
        trim(str){
            return str.replace(/\s/g,"")
        },
        searchShareFile(){
            this.shareNo=this.$route.path
            var str="/cloud/sharePassword/"
            this.shareNo=this.shareNo.replace(new RegExp(str), "")
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/doc/share/'+this.shareNo
            }).then((response)=>{
                if(response.data.cd=='10002'){
                    this.qjShareGroup=response.data.rt.qjShareGroup
                    this.user=response.data.rt.user
                    this.userImg=this.trim(this.user.imgUuid)
                }
            })
        },
        getFilePathByPassWord(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/doc/getFilePathByPassWord',
                params:{
                    passWord:this.passwordValue
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.passwordShowNo=response.data.rt;
                    this.$router.push({
                        path:`/cloud/share/${this.passwordShowNo}`,
                    })
                }
            })
        }
    }
}
</script>
<style lang="less">
li{
    list-style-type:none;
}
#shareFilePassWord{
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size: 14px;
      }
    a:active{
    decoration:none;
    }
    .container-header{
        width: 100%;
        height: 68px;
        /* position: fixed; */
        margin: 0px;
        padding:0px;
        /* left: 0;
        right: 0; */
        z-index: 1001;
        /* overflow-y: auto; */
        .header{
            height: 68px;
            background: #25282d;
            overflow: hidden;
            display: flex;
            .headerImg{
                width: 200px;
                height: 50px;
                margin:10px 5px;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;

                }
            }
            .headerText{
                font-size: 18px;
                height: 67px;
                text-align: left;
                line-height: 67px;
                color: white;
                font-family: "微软雅黑";
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                flex: 1;
            }
            .headerInfo{
                width: 200px;
                height: 68px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .userCenter{
                    color:#d9d9d9;
                    font-size: 14px;
                    text-decoration:none;
                    display: inline-block;
                    margin-right:15px;
                }
                .appDownLoad{
                    color:#d9d9d9;
                    font-size: 14px;
                    text-decoration:none
                }
            }


        }
    }
    .sharePassBody{
        width: 100%;
        height: 800px;
        background: #f5f5f5;
        .center{
            width:480px;  
            height:340px;  
            position:absolute;  
            left:50%;  
            top:50%;  
            margin:-160px 0 0 -280px;
            .center_item{
                font-size:36px;
                color:#fc3439;
                line-height: 36px;
            }
            .center_frame{
                width: 480px;
                margin:30px auto;
                height: 250px;
                background: #fff;
                border:1px solid #fafafa;
                border-radius: 4px;
                box-shadow: 1px;
                .center_frame_top{
                    height: 85px;
                    background: #fc3439;
                    .userImg{
                        height:50px;
                        width:50px;
                        position: absolute;
                        border-radius: 50%;
                        border:1px solid #ccc;
                        // margin-top:20px;
                        margin:15px 0px 15px -120px;
                    }
                    .userItem{
                        display: inline-block;
                        margin-left:-25px;
                        margin-top:35px;
                        color:#fff;
                        font-size: 12px;
                        line-height: 14px;
                        .userItem_bold{
                            margin-right: 5px;
                            font-weight: bold;
                            font-size: 14px;
                        }
                    }
                }
                .center_frame_bottom{
                    width: 80%;
                    margin:0 auto;
                    .pass_word{
                        font-size: 14px;
                        color:#666666;
                        line-height: 14px;
                        margin-top:45px;
                        margin-left:-290px;
                    }
                    .password_inp{
                        font-size: 14px;
                        .text_inp{
                            margin-top:10px;
                            background-image: none;
                            border-radius: 4px;
                            height: 36px;
                            width: 300px;
                            border: 1px solid #d1d1d1;
                            border-radius: 2px;
                            background: #f1f1f1;
                            padding-left: 10px;
                        }
                        .submit{
                            color:#fff;
                            height:36px;
                            width: 70px;
                            background: #fc3439;
                            border-radius:2px;
                            // border: 1px solid #d1d1d1;
                            margin-left:10px;
                        }
                        button{
                            margin: 0;
                            padding: 0;
                            border: 1px solid transparent;  //自定义边框
                            outline: none;  
                        }



                    }
                    
                    
                }
            }
        }
        .fix_background{
            position: fixed;
            bottom: 0px;
            left: 0px;
            background: url('./images/fixBackground.png')no-repeat 0 0;
            // height: 260px;
            // width: 100%;
        }
    }


}
</style>