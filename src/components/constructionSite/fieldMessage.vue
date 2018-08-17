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
                        <div :class="[{'left_content_box1':showLeftContent},'left_content']">
                            <div class="left_content_box">
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
                            </div>
                        </div>
                    </div>
                    <div :class="[{'box-left':showLeftContent},'box-left-content']">
                        <div class="cancle">
                            <i class="cancle1" @click="cancleLeft"></i>
                        </div>
                        <div class="box_header">
                            <span>详细</span>
                        </div>
                        <div class="box_content">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>主题：</th>
                                        <td><el-input v-model="projectValue"></el-input></td>
                                    </tr>
                                    <tr>
                                        <th>主送：</th>
                                        <td>
                                            <el-select v-model="mainSendMsgValue">
                                                <el-option :value="item.ugId" v-for="(item) in  ugList" :key="item.ugId" :label="item.ugName">
                                                </el-option>
                                            </el-select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>抄送：</th>
                                        <td>
                                            <el-select v-model="copySendMsgValue">
                                                <el-option :value="item.ugId" v-for="(item) in  ugList" :key="item.ugId" :label="item.ugName">
                                                </el-option>
                                            </el-select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>内容：</th>
                                        <td>
                                            <el-input
                                                type="textarea"
                                                :rows="5"
                                                :cols="100"
                                                placeholder="请输入内容"
                                                v-model="textarea">
                                            </el-input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="files">
                                <span class="text">附件:</span>
                                <span class="icon-eye" >视点</span>
                                <span class="icon-file" @click="showUploadBox_file">文档</span>
                                <span class="icon-message" >清单</span>
                                <span class="icon-image" @click="showUploadBox_img" >图片</span>
                            </div>
                            <div class="btn">
                                <span class="item-cancle" >取消</span>
                                <span class="item-save" >保存</span>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div :title="title" v-if="uploadshow"  id="edit" class="hahahha">
                    <div class="el-dialog__header">
                        <span class="el-dialog__title" v-text="type==1?'图片上传':'文件上传'"></span>
                        <button type="button" aria-label="Close" class="el-dialog__headerbtn"  @click="upImgCancle">
                            <i class="el-dialog__close el-icon el-icon-close"></i>
                        </button>
                    </div>
                    <div class="el-dialog__body">
                        <div class="editBody">
                            <div class="editBodytwo imageBody">
                                <label class=" imageBodyText">上传文件 :</label>
                                <span class="updataImageSpan">
                                    <span @click="selectImg">
                                        <button class="upImgBtn">选择文件</button>
                                    </span>
                                    <input class="upInput"  type="file" :accept="type == 1?'image/*':''" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
                                </span>
                                <span class="upImgText">{{imageName}}</span> 
                            </div>
                        </div>
                    </div>
                    <div class="el-dialog__footer">
                        <div slot="footer" class="dialog-footer">
                            <button class="editBtnS" @click="uploadIMG">上传</button>
                            <button class="editBtnC" @click="upImgCancle">取消</button>
                        </div>
                    </div>
                </div>
                <div id="mask" v-if="uploadshow"></div>
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
            mainSendMsgValue:'',
            copySendMsgValue:'',
            textarea:'',
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
            projectValue:'',
            uploadshow:false,
            type:'',
            imageName:'',
            filesList:'',
            attachList:'',
            title:'',
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
        vm.getContactIndex();
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
                    this.mainSendMsgValue=response.data.rt.pug.selectUgId;
                    this.copySendMsgValue=response.data.rt.pug.selectUgId;
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
        },
        showUploadBox_img(){
            var vm = this
            vm.type = 1
            vm.uploadshow = true
        },
        showUploadBox_file(){
             var vm = this
            vm.type = 2
            vm.uploadshow = true
        },
        fileChanged(file){
            var vm = this
            const list = vm.$refs.file.files
            vm.imageName = list[0].name
            if(vm.type == 1){
                 vm.attachList = list[0]
            }else{
                 vm.filesList = list[0]
            }
        },
        upImgCancle(){
            var vm = this
            vm.uploadshow = false
            vm.imageName = '未选择任何文件'
            vm.filesList = null
            vm.attachList = null
        },
        uploadIMG(){
            var vm = this
            if(vm.type == 1){
                if(vm.attachList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择图片！'
                    })
                    return false
                }
            }else{
                if(vm.filesList == null){
                    vm.$message({
                        type:'error',
                        message:'请选择文件！'
                    })
                    return false
                }
            }
            var returnUrl = vm.BDMSUrl+'project/contactList2/dcUpload?ugId='+vm.selectugid+"&type="+vm.type+'&dirId=-1'
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
            formData.append('type',1);
            if(vm.type == 1){
                  formData.append('file',vm.attachList);
            }else{
                formData.append('file',vm.filesList);
            }
            formData.append('userId',vm.userId);
            formData.append('modelCode','006');//施工现场的文件代码
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL+'/uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                if(response.data.rt){
                    if(vm.type == 1){
                         vm.attachId.push(response.data.rt)
                    }else{
                         vm.fileId.push(response.data.rt)
                    }
                    vm.$refs.file.value = ''
                    vm.upImgCancle()
                }
            }).catch((err)=>{
                vm.imageName ='未选择任何文件'
                console.log(err)
            })
        },
        selectImg(){
             this.$refs.file.click()
        },

    }
    
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
     .el-input__inner {
            width: 400px !important;
        }
    .upInput{
        display: none;
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
                // .left_content_box1{
                //     width: 40%;
                // }
                .left_content{
                    border-top:1px solid #ccc;
                    padding: 19px 13px 0 10px;
                    .left_content_box{
                        //发送样式
                        .left_content_receive{
                            .left_content_header{
                                height: 33px;
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
                width: 50%;
                padding-left: 25px;
                top: 116px;
                transition: all .7s ease;
                background: #fff;
                z-index: 10;
                overflow-y: auto;
                //  border-top: 1px solid #ccc;
                //  padding: 19px 13px 0 10px;
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
                .box_header{
                    height: 50px;
                    margin-left:20px;
                    // width: 90%;
                    border-bottom: 1px solid #ccc;
                    span{
                        font-size: 16px;
                        color:#fc3439;
                        line-height: 16px;
                        float: left;
                        margin-left:25px;
                        margin-top:20px;
                        font-weight: bold;
                        display: inline-block;
                        
                    }

                }
                .box_content{
                    table{
                        tbody{
                            th{
                                font-size: 14px;
                                line-height: 14px;
                                color:#666;
                            }
                            tr{
                                width: 100%;
                                margin-left:25px;
                                margin-top:30px;
                                display: inline-block;
                                
                            }
                        }
                        
                    }
                    .files{
                        width:400px;
                        height: 30px;
                        margin-left:10px;
                        margin-top:10px;
                            .text{
                                font-size: 14px;
                                line-height: 14px;
                                color:#666;
                                font-weight: bold;
                            }
                            span{
                                line-height: 16px;
                                height: 16px;
                                float: left;
                                position: relative;
                                cursor: pointer;
                                margin-left: 24px;
                                margin-right: 20px;
                                font-size: 12px;
                                color: #666666;
                            }
                            .icon-eye::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 12px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/eye.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-image::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 14px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/image.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-file::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 16px;
                                height: 18px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/file.png')no-repeat 0 0;
                                content: '';
                            }
                            .icon-message::before{
                                display: inline-block;
                                position: absolute;
                                left: -24px;
                                top: 2px;
                                width: 18px;
                                height: 15px;
                                line-height: 14px;
                                background: url('../ManageDesign/images/message.png')no-repeat 0 0;
                                content: '';
                            }
                        }
                        .btn{
                            float: right;
                            margin-right:100px;
                            .item-save{
                                float: right;
                                margin-right: 14px;
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
                            .item-cancle{
                                float: right;
                                margin-right: 14px;
                                background: #666;
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
                }
            }
            .box-left{
                right: 0px;
                bottom: 0px;
                width: 0px;
                transition: all .7s ease;
            }
        }
        #edit{
            position: fixed;
            z-index: 3003;
            background: #ffffff;
            }
        .hahahha{
            top: 15vh;
            left: 50%;
            width: 660px;
            margin-left:-330px;
            border-radius: 5px;
        }
        #mask{
            z-index: 3000;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
        }
       
    }

</style>

