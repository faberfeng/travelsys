<template>
    <div id="fieldMessage">
        <div id="GroupSelect">
            <select v-model="selectUgId" class="inp-search">
                <option :value="item.ugId" v-for="(item,index) in  ugList" :key="index" v-text="item.ugName"></option>
            </select>
            <i class="icon-sanjiao"></i>
        </div>
            <div class="topHeader">
                <div id="item-box-file">
                    <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldMessage'" class="label-item label-item-active">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                    质量检查
                    </router-link>
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                    安全检查  
                    </router-link>
                </div>
                <div class="box-left">
                    <div class="box_left_text">
                        <div class="left_slider">
                            <div :class="[screenLeft.item == 2?'active':(screenLeft.item == 1?'active-version':'active-version-3')]">
                                <span class="item-sendMsg" @click="sendMsg">收<br>件</span>
                                <span class="item-reviceMsg" @click="receiveMsg">发<br>件</span>
                                <span class="item-draft" @click="draftMsg">草<br>稿</span>
                            </div>
                        </div>
                        <div class="left_content">
                            <div class="left_content_box">
                                <!-- <div class="left_content_sendMsg" v-if="screenLeft.item==2">
                                    <div class="left_content_header">
                                            <span class="item_word">收件()</span>
                                            <span class="item-upload">新建</span>
                                    </div>
                                    <div class="left_content_body">
                                        <ul>
                                            <li></li>
                                        </ul>
                                    </div>
                                </div> -->
                                <div class="left_content_receive">
                                    <div class="left_content_header">
                                            <span class="item_word" v-if="screenLeft.item==2">收件({{rowsListLength}})</span>
                                            <span class="item_word" v-if="screenLeft.item==1">发件({{rowsListLength}})</span>
                                            <span class="item_word" v-if="screenLeft.item==0">草稿({{rowsListLength}})</span>
                                            <span class="item-upload" @click="newFile">新建</span>
                                    </div>
                                    <div class="left_content_body">
                                        <ul>
                                            <li v-for="(item,index) in rowsList" :key="index" :class="{'checkpoint':item.id==ischeck}" @click="checkItem(item.id)">
                                                <span :class="{'circle':item.id==ischeck}"></span>
                                                <span class="time">{{item.createDate|timeChange}}</span>
                                                <span class="value">{{item.subject}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- <div class="left_content_draft" v-if="screenLeft.item==0">
                                    <div class="left_content_header">
                                            <span class="item_word">草稿()</span>
                                            <span class="item-upload">新建</span>
                                    </div>
                                    <div class="left_content_body">
                                        <ul>
                                            <li></li>
                                        </ul>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div :class="[{'box-left':showLeftContent},'box-left-content']">
                        <div class="cancle">
                            <i class="cancle1" @click="cancleLeft"></i>
                        </div>
                        但是JFK就
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
export default {
    name:'fieldMessage',
    data(){
        return{
            contactIndexList:'',
            selectUgId:'',
            ugList:'',
            contactList:'',
            rowsList:'',
            rowsListLength:0,
            screenLeft:{
                show:true,
                item:2
            },
            ischeck:'',
            showLeftContent:false,
        }
    },
    created(){
         var vm = this;
        // vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        this.getContactIndex();
    },
    filters:{
        timeChange(val){
            if (val == null) {
                return;
                } else {
                return moment(val).format("YYYY-MM-DD HH:mm");
                }
            }

    },
    watch:{
        selectUgId: function (val) {
        var vm = this;
      },
    },
    methods:{
        //进入现场发文页面
        getContactIndex(){
            axios({
            method:'get',
            url:this.BDMSUrl+'/project2/buildSite/contactIndex',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
            },
            
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.contactIndexList=response.data.rt;
                    this.ugList=response.data.rt.pug.ugList;
                    this.selectUgId=response.data.rt.pug.selectUgId;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        //获取左侧列表信息
        getContactList(){
            axios({
            method:'get',
            url:this.BDMSUrl+'/project/contactList2/getContactList',
            headers:{
                'token':this.token
            },
            params:{
                projId:this.projId,
                status:this.screenLeft.item,
                ugId:this.selectUgId
            },
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.contactList=response.data.rt;
                    this.rowsList=response.data.rt.rows;
                    this.rowsListLength=response.data.rt.rows.length;
                    console.log(this.contactList);
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        sendMsg(){
            this.screenLeft.item = 2;
            this.getContactList();
        },
        receiveMsg(){
            this.screenLeft.item = 1;
            this.getContactList();
        },
        draftMsg(){
            this.screenLeft.item = 0;
            this.getContactList();
        },
        checkItem(num){
            this.ischeck=num;
        },
        cancleLeft(){
            this.showLeftContent=!this.showLeftContent;
        },
        newFile(){
            this.showLeftContent=!this.showLeftContent;
        }

    }
    
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    #fieldMessage{
        #GroupSelect {
            display: block;
            width: 168px;
            height: 30px;
            position: fixed;
            top: 77px;
            z-index: 1000;
            right: 24px;
            .inp-search {
                width: 168px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #cccccc;
                position: relative;
                background: #fafafa;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                float: left;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .icon-sanjiao {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 12px;
                right: 11px;
            }
        }
        .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
            .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
                .label-item-active{
                    color: #fc3439;
                    font-weight: bold;
                    border-top: 3px solid #fc3439;
                    border-left: 1px solid #e6e6e6;
                    border-right: 1px solid #e6e6e6;
                    border-bottom: 1px solid #fff;
                    background: #ffffff;
                }
        }
        .box-left{
            .box_left_text{
                // width: 90%;
                // margin-left:20px;
                
                margin-top:75px;
                display: block;
                position: fixed;
                left: 100px;
                bottom: 0;
                width: 100%;
                padding-left: 25px;
                top: 116px;
                transition: all .5s ease;
                background: #fff;
                z-index: 10;
                overflow-y: auto;
                .left_slider{
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 25px;
                    border-right: 1px solid #ccc;
                    .item-sendMsg{
                        display: block;
                        width: 25px;
                        height: 68px;
                        background: #fafafa;
                        padding-top:15px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        border-top:1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom: -9px;
                            width: 23px;
                            height: 15px;
                            background: #fafafa;
                            border-top: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                        }
                    } 
                    .item-reviceMsg{
                        display: block;
                        width: 25px;
                        height: 56px;
                        background: #fafafa;
                        padding-top:12px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom:-7px;
                            width: 23px;
                            height: 13px;
                            background: #fafafa;
                            border-bottom: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                            }
                    }
                    .item-draft{
                        display: block;
                        width: 25px;
                        height: 56px;
                        background: #fafafa;
                        padding-top:12px;
                        font-size: 12px;
                        color: #666666; 
                        text-align: center;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        position: relative;
                        cursor: pointer;
                        &::after{
                            display: block;
                            position: absolute;
                            bottom:-7px;
                            width: 23px;
                            height: 13px;
                            background: #fafafa;
                            border-bottom: 1px solid #cccccc;
                            transform: skewY(30deg);
                            content: '';
                            }
                    }
                    .active { //上边 收件 高显
                        .item-sendMsg {
                        background: #fff;
                        color: #fc3439;
                        }
                        .item-reviceMsg {
                        z-index: 15;
                        }
                        .item-draft {
                        z-index: 10;
                        }
                    }
                    .active-version { //中间 收件 高显
                        .item-reviceMsg { //收件
                        background: #fff;
                        color: #fc3439;
                        z-index: 15;
                        &::after {
                            background: #fff;
                        }
                        }
                        .item-sendMsg::after { //发件
                        background: #fff;
                        }
                        .item-draft { //草稿
                        z-index: 10;
                        }
                    }
                    .active-version-3 { //下边 草稿 高显
                        .item-reviceMsg {
                        z-index: 15;
                        &::after {
                            background: #fafafa;
                        }
                        }
                        .item-sendMsg::after {
                            background: #fff;
                        }
                        .item-draft {
                            z-index: 10;
                            background: #fff;
                            color: #fc3439;
                            &::after {
                                background: #fff;
                            }
                        }
                    }
                }
                .left_content{
                    border-top:1px solid #ccc;
                    padding: 19px 13px 0 10px;
                    .left_content_box{
                        //发送样式
                        .left_content_sendMsg,.left_content_receive,.left_content_draft{
                            .left_content_header{
                                height: 40px;
                                border-bottom: 1px solid #ccc;
                                    .item_word{
                                        font-size: 16px;
                                        color:#fc3439;
                                        line-height: 16px;
                                        float: left;
                                        margin-left:10px;
                                        font-weight: bold;
                                    }
                                    .item-upload{
                                        float: right;
                                        margin-right: 140px;
                                        background: #fc3439;
                                        color: #ffffff;
                                        font-size: 12px;
                                        height: 26px;
                                        width: 78px;
                                        border-radius: 2px;
                                        text-align: center;
                                        line-height: 26px;
                                        cursor: pointer;
                                    }
                            }
                            .left_content_body{
                                ul{
                                    li{
                                        float: left;
                                        margin-left:30px;
                                        margin-top:10px;
                                        width: 99%;
                                        height: 28px;
                                        font-size: 14px;
                                        line-height: 28px;
                                        text-align: left;
                                        color:#666666;
                                        cursor: pointer;
                                        .time{
                                            display: inline-block;
                                        }
                                        .value{
                                            display: inline-block;
                                            margin-left:20px;
                                        }
                                        .circle{
                                            width: 8px;
                                            height: 8px;
                                            vertical-align: middle;
                                            margin-right: 5px;
                                            margin-bottom: 5px;
                                            border-radius: 50%;
                                            background: #fc3439;
                                            display: inline-block;
                                        }
                                    }
                                    .checkpoint{
                                        color:black;
                                        font-weight: bold;
                                        background: #fafafa;
                                    }
                                }
                            }
                        }

                    }
                }
            }
            .box-left-content{
                margin-top:76px;
                display: block;
                position: fixed;
                right: 0px;
                bottom: 0;
                width: 40%;
                padding-left: 25px;
                top: 116px;
                transition: all .5s ease;
                background: #fff;
                z-index: 10;
                overflow-y: auto;
                // border-left:1px solid #ccc;
                
                // -webkit-box-shadow: 3px 3px 3px #aaaaaa;
                .cancle{
                    position: absolute;
                    bottom:0;
                    top: 0;
                    left: 0px;
                    width: 30px;
                    box-shadow:1px 1px 3px #aaa;
                    // border:1px solid #ccc;
                    border-right: 1px solid #ccc;
                    
                    .cancle1{
                        position: absolute;
                        height: 30px;
                        top: 0;
                        left: 0px;
                        width: 30px;
                        border-left:1px solid #ccc;
                        border-bottom:1px solid #ccc;
                        box-shadow:1px 1px 3px #aaa;
                        background-image: url('./images/cancle.png');
                    }
                }
            }
            .box-left{
                right: 0px;
                bottom: 0px;
                width: 0px;
                transition: all .5s ease;
            }
        }
    }

</style>

