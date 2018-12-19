<template>
    <div id="fieldConnection">
            <div class="topHeader">
                <div id="item-box-file">
                    <router-link :to="'/constructionSite/safetyInspection'" class="label-item">  
                    安全监测  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldConnection'" class="label-item label-item-active">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                    质量检查
                    </router-link>
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                    安全检查  
                    </router-link>
                    
                </div>
                <div id="live_body">
                    <div class="videoDiv">
                        <div class="video_model"  @mouseenter="changeActive(1)" @mouseleave="removeActive(1)">
                            <div class="video_header" v-show="mouseToggle1" >
                                <span class="vt">场地模型</span>
                                <span class="fullScreen" @click="fullModule"></span>
                            </div>
                            <div class="video_body">
                                <!-- <iframe id="mm" style="width: 100%;height:calc(100%);border:0;" src="https://site.altizure.cn/s/ryLw2SAxX"></iframe> -->
                                 <model-obj ref="modelObj" id="mm" ></model-obj>
                                 <!-- static/Tile_8.obj -->
                                    <!-- <iframe style="width: 100%;height:100%"  src="../../../webGL/index.html"></iframe> -->
                                
                                <!-- src="https://site.altizure.cn/s/ryLw2SAxX" -->
                            </div>
                            <div class="video_bottom">
                                <span class="fullSet" @click="getMedia(1)"></span>
                                 <el-pagination 
                                    class="pagination"
                                    background
                                    @current-change="handlemodelCurrentChange"
                                    layout="prev, pager, next"
                                    :page-size="1"
                                    :total="modelPageTotal">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="video_model" @mouseenter="changeActive(2)" @mouseleave="removeActive(2)">
                            <div class="video_header" v-show="mouseToggle2">
                                <span class="vt">航拍视频</span>
                                <span class="fullScreen" @click="fullVideo"></span>
                            </div>
                            <div class="video_body">
                                <img v-show="this.mediaUrlList==[]" width="100%" height="310px" src="../../assets/nosource.png" >
                                <video v-show="this.mediaUrlList!=[]" id="videoPlay" width="100%" height="88%" controls="controls" ref="video" allowfullscreen="true" src="../../assets/nosource.png"></video>
                                <source type="video/mp4">
                                your browser does not support the video tag.
                            </div>
                            <div class="video_bottom">
                                <span class="fullSet" @click="getMedia(2)"></span>
                                <el-pagination 
                                class="pagination"
                                background
                                @current-change="handleVideoCurrentChange"
                                layout="prev, pager, next"
                                :page-size="1"
                                :total="videoPageTotal">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="video_model" @mouseenter="changeActive(3)" @mouseleave="removeActive(3)" >
                            <div class="video_header" v-show="mouseToggle3" >
                                <span class="vt">全景图片</span>
                                <span class="fullScreen" @click="fullPicture"></span>
                            </div>
                            <div class="video_body">
                                 <div id="planeDIV" width="200px" height="310px" v-show="!isFullPicture">
                                    <img v-show="qjpicShow"  width="100%" height="310px" ref="picture" src="../../assets/nosource.png" >
                                </div>
                                <div  id="planeDIV1"  v-show="isFullPicture">
                                    <img  width="100%" height="310px" ref="fullPicture" src="../../assets/nopic.jpg" >
                                    <ul>
                                        <li v-for="(item,index) in imgdetial1" :key="index">
                                            <span :class="['round']" @click="clickQjPic(item.index)"  :style="{'top':(20+item.y/2)+'px','left':(item.x/5)+'px'}">
                                            </span>
                                        </li>
                                    </ul>
                                    
                                </div>
                            </div>
                            <div class="video_bottom">
                                <span class="fullPicture" @click="showFullPicture">总图</span>
                                <span class="fullSet" @click="getMedia(3)" ></span>
                                <el-pagination 
                                class="pagination"
                                background
                                @current-change="handlePictureCurrentChange"
                                layout="prev, pager, next"
                                :page-size="1" 
                                :total="picturePageTotal">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="video_model" @mouseenter="changeActive(4)" @mouseleave="removeActive(4)">
                            <div v-show="mouseToggle4" class="video_header" >
                                <span class="vt" >实时直播</span>
                                <span class="fullScreen" @click="fullLive"></span>
                            </div>
                            <div class="video_body">
                                
                                <img  v-show="lineLiveImgShow" width="100%" height="310px" src="../../assets/nosource.png" >
                                <videoPlayer :playsinline="true" id="lineLive" class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
                                <!-- <iframe id="lineLive" ref="lineLive" style="width: 100%;height: calc(100% - 40px);border:0;pointer-events:none" allowfullscreen="true" allowtransparency="true" :src="livePathUrl"></iframe> -->
                            </div>
                            <div class="video_bottom">
                                <span class="fullSet" @click="getMedia1(4)"></span>
                                <el-pagination 
                                class="pagination"
                                background
                                @current-change="handleLiveCurrentChange"
                                layout="prev, pager, next"
                                :page-size="1"
                                
                                :total="livePageTotal">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <div class="messageDiv">
                        <!-- 会议设置 -->
                        <div class="setChatWindow" v-if="meetSetShow">
                            <div class="head">
                                <span class="head_txt">会议设置</span>
                                <span class="el-icon-close" @click="closeMeetSet"></span>
                            </div>
                            <ul>
                                <li class="body">
                                    <span class="body_txt">会议1</span>
                                    <span class="body_edit"></span>
                                </li>
                                <li class="body">
                                    <span class="body_txt1">设置置顶</span>
                                    <span class="body_setTop"> </span>
                                    <el-switch v-model="isMeetTopValue" active-color="#cccccc"  inactive-color="#1aad19" class="meetTop"></el-switch>
                                </li>
                                <li class="body"><span class="body_txt1">清除聊天记录</span></li>
                                <li class="body"><span class="body_txt1">退出会议</span></li>
                            </ul>
                            <!-- <span class="el-icon-close"></span> -->
                        </div>
                        <!-- 对话设置 -->
                        <div class="setChatWindow" v-if="oneByoneSetShow">
                            <div class="head">
                                <span class="head_txt">对话设置</span>
                                <span class="el-icon-close" @click="closeOneByoneSet"></span>
                            </div>
                            <ul>
                                <li class="body">
                                    <span class="body_txt1">设置置顶</span>
                                    <span class="body_setTop"> </span>
                                    <el-switch v-model="isMeetTopValue" active-color="#cccccc"  inactive-color="#1aad19" class="meetTop"></el-switch>
                                </li>
                                 <li class="body"><span class="body_txt1">发起会议</span></li>
                                <li class="body"><span class="body_txt1">清除聊天记录</span></li>
                            </ul>
                            <!-- <span class="el-icon-close"></span> -->
                        </div>
                        <div class="memberListWindow" v-show="memberListShow">
                            <div class="head">
                                <span class="head_txt">成员列表</span>
                                <span class="el-icon-close" @click="closememberList"></span>
                            </div>
                            <ul class="member_bodyUl">
                                <li class="member_body" v-for="(item,index) in userInfoList" :key="index" @click="selectChat(item.userId,item.realName)">
                                    <div class="header_info">
                                        <img :src="item.imgUuid?commomHeadPictureFile+item.imgUuid:require('../../assets/people.png')" class="header_img">
                                    </div>
                                    <div class="header_name">
                                        <span class="real_name" v-text="item.realName"></span>
                                        <span class="real_name1" v-text="item.account"></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="meetListWindow" v-show="meetListShow">
                            <div class="head">
                                <span class="head_txt">会议列表</span>
                                <span class="el-icon-close" @click="closemeetList"></span>
                            </div>
                        </div>
                        <div class="message_header">
                            <span class="text" @click="getMember">{{selectChatUserName}}</span>
                            <span class="moreChatBtn" @click="openMeetList"></span>
                            <span class="oneChatBtn" @click="openMemberList"></span>
                            <span v-show="moreBymoreShow" class="setBtn" @click="openMeetSet"></span>
                            <span v-show="oneByoneShow" class="setBtn" @click="openOneByOneSet"></span>
                        </div>
                        <div v-if="getMemberShow" class="member_list">
                            <ul :class="['clearfix','memberUl']">
                                <li class="memberLi" v-for="(item,index) in userInfoList" :key="index">
                                    <div class="getMember_info">
                                        <img  class="getMemberImg" :src="item.imgUuid?commomHeadPictureFile+item.imgUuid:require('../../assets/people.png')" />
                                    </div>
                                    <span class="getMember_txt" v-text="item.realName"></span>
                                </li>
                            </ul>
                        </div>
                        <!-- <div class="message_member">
                            <img class="memeberInfoImg" :src="userImg?userImg:require('../../assets/people.png')" />
                        </div> -->
                        <div class="message_body">
                            <p id="message"></p>
                        </div>
                        <div class="message_textarea">
                            <div class="message_file">
                                <span class="emotIcon"></span>
                                <span class="picIcon"></span>
                            </div>
                            <textarea @keyup.enter="sendMes()" v-model="sendText" id="messageTextArea" placeholder="按 Enter 发送，按 Ctrl + Enter 换行"></textarea>
                            <div class="message_btn">
                                <button @click="sendMes()" class="sendBtn">发送</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="edit">
                <el-dialog title="来源配置" :visible.sync="addMediaDialog" @close="addMediaCancle">
                    <div class="body">
                        <table class="planTabel" border="1" width="100%">
                            <thead>
                                <tr>
                                    <td>序号</td>
                                    <td>文件路径/URL路径</td>
                                    <td>操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr :class="{'select':index==isActive}" v-for="(item,index) in mediaUrlList" :key="index" @click="checkItem(index)">
                                    <td>{{index+1}}</td>
                                    <td>{{item.displayPath}}</td>
                                    <td>
                                        <button class="editBtn actionBtn" @click="editMediaUrl(item.fileGroupId)"></button>
                                        <button class="deleteBtn actionBtn" @click="deleteMediaUrl(item.id)"></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addResource">新增</button>
                        <button class="editBtnC" @click="addMediaCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="来源配置" :visible.sync="addMediaDialog1" @close="addMediaCancle1">
                    <div class="body">
                        <table class="planTabel" border="1" width="100%">
                            <thead>
                                <tr>
                                    <td>序号</td>
                                    <td>文件路径/URL路径</td>
                                    <td>操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr :class="{'select':index==isActive}" v-for="(item,index) in mediaUrlList1" :key="index" @click="checkItem(index)">
                                    <td>{{index+1}}</td>
                                    <td>{{item.displayPath}}</td>
                                    <td>
                                        <button class="editBtn actionBtn" @click="editMediaUrl1(item.fileGroupId)"></button>
                                        <button class="deleteBtn actionBtn" @click="deleteMediaUrl1(item.id)"></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addResource1">新增</button>
                        <button class="editBtnC" @click="addMediaCancle1">取消</button>
                    </div>
                </el-dialog>

                <el-dialog title="文件路径选择" :visible.sync="addResourceDialog" @close="addResourceCancle">
                    <div class="body1">
                        <div class="head">
                            <span class="text">群组选择:</span>
                            <div class=editSelect1>
                                <select v-model="ugGroupNameValue" @change="ugGroupChange">
                                    <option v-for="(item,index) in getUserGroupList" :key="index" :value="item.ugId">{{item.ugName}}</option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </div>
                        </div>
                        <div class="head"><span class="text">名称:</span>
                            <div class="tree_file">
                                <el-tree id="ugGroupTree" ref="ugGroupTree" highlight-current  node-key="id" :empty-text="'内容为空'" :data="fileTreeList"  :props="defaultProps" @node-click="nodeClick">
                                </el-tree>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addResourceMakeSure">保存</button>
                        <button class="editBtnC" @click="addResourceCancle">取消</button>
                    </div>
                </el-dialog>

                <el-dialog  title="媒体路径选择" :visible.sync="addResourceDialog1" @close="addResourceCancle1">
                    <div class="mediaUrl">
                        <div class="urlWord">目标URL</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="mediaUrl"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addResourceMakeSure1">保存</button>
                        <button class="editBtnC" @click="addResourceCancle1">取消</button>
                    </div>
                </el-dialog>

                <el-dialog title="文件路径选择" :visible.sync="updateResourceDialog" @close="updateResourceCancle">
                    <div class="body1">
                        <div class="head">
                            <span class="text">群组选择:</span>
                            <div class=editSelect1>
                                <select v-model="ugGroupNameValue" @change="ugGroupChange">
                                    <option v-for="(item,index) in getUserGroupList" :key="index" :value="item.ugId">{{item.ugName}}</option>
                                </select>
                                <i class="icon-sanjiao"></i>
                            </div>
                        </div>
                        <div class="head"><span class="text">名称:</span>
                            <div class="tree_file">
                                <el-tree id="ugGroupTree" ref="ugGroupTree" highlight-current  node-key="id" :default-expand-all='true' :data="fileTreeList"  :props="defaultProps" @node-click="nodeClick">
                                </el-tree>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="updateResourceMakeSure">保存</button>
                        <button class="editBtnC" @click="updateResourceCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="媒体路径选择" :visible.sync="updateResourceDialog1" @close="updateResourceCancle1">
                    <div class="mediaUrl">
                        <div class="urlWord">目标URL</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="mediaUrl"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="updateResourceMakeSure1">保存</button>
                        <button class="editBtnC" @click="updateResourceCancle1">取消</button>
                    </div>
                </el-dialog>
            </div>
    </div>
</template>
<script>
// import { ModelThree } from 'vue-3d-model'
var THREE = require('three');
import axios from 'axios'
import data from '../Settings/js/date.js'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import { ModelObj } from 'vue-3d-model'
import 'videojs-flash'
// var source= '';
var camera, scene, renderer;
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;
    var distance = 500;
export default {
    name:'fieldConnection',
    components: {
        videoPlayer,ModelObj
    },
    data(){
        return{
            playerOptions: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src: "" 
                }],  
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                 muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                // poster: "./images/baoc.png",
            },  
            lineLiveImgShow:true,
            // modelObjUrl:'',//modeluRl
            mediaUrl:'',//媒体URL
            sendText:'',
            token:'',
            projId:'',
            userImg:'',
            userId:'',
            BDMSUrl:'',
            QJFileManageSystemURL:'',
            isActive:'',
            PanoramaMainList:'',
            PanoramaPathList:'',
            getUserGroupList:'',//获得用户群组
            ugGroupNameValue:'',//用户名称值
            ugGroupName:'',
            ugId:'',
            groupName:'',
            type:'',
            addMediaDialog:false,
            addMediaDialog1:false,//增加媒体弹框
            addResourceDialog:false,
            addResourceDialog1:false,//增加资源弹框
            updateResourceDialog:false,//变更资源弹框
            updateResourceDialog1:false,
            mediaUrlList:[],//媒体url列表
            mediaUrlList1:[],
            fileTreeList_original:[],//文件树原列表
            fileTreeList:[],//文件树列表
             defaultProps:{
                // children: 'parent',
                label: 'name'
            },
            pathVideoUrl:'',
            pathPictureUrl:'../../asset/nopic.png',
            livePathUrl:'',
            isFullPicture:false,
            videoPageTotal:0,
            modelPageTotal:0,
            picturePageTotal:0,
            livePageTotal:0,
            currentPage3:1,
            fgId:'',//文件树所选id，
            getFgId:'',//获得文件所属群组
            obj:'',//所属的文件id
            fgName:'',//文件树所选name
            QJ:{
              imageBackground:{},
              point:[]
            },
            imgdetial1:'',
            imgdetial:{
                path:'',
                x:'',
                y:''
            },
            messageText:'',
            websock: null,
            // mouseToggle:false,
            mouseToggle1:false,
            mouseToggle2:false,
            mouseToggle3:false,
            mouseToggle4:false,
            qjpicShow:true,
            //即时通讯功能
            ws:'',
            isMeetTopValue:true,//会议是否置顶
            meetSetShow:false,//是否打开会议设置
            oneByoneSetShow:false,//是否私聊
            memberListShow:false,//是否打开成员列表
            oneByoneShow:false,//是否为私聊
            moreBymoreShow:true,//是否为群聊,初始进入项目大厅
            meetListShow:false,
            outsideUserList:'',//获得工程用户列表
            userInfo:'',//查询用户
            userIds:[],//用户ID
            userInfoList:'',//工程用户所有信息
            commomHeadPictureFile:'',
            selectChatUserId:'',//选择私聊id
            selectChatUserName:'项目大厅',//选择私聊名称
            getMemberShow:false,//获取某个会议室内的成员
            chatRecordList:[],
        }
    },
    filters:{

    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid')
        vm.userImg=localStorage.getItem('userImg')
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
        // vm.commomHeadPictureFile = vm.$store.state.commomHeadPictureFile;
        vm.commomHeadPictureFile = vm.QJFileManageSystemURL;
        // var obj = JSON.parse(sessionStorage.getItem('qjInfo'))
        // vm.imgdetial.path = obj.image
        // vm.imgdetial.x = obj.x
        // vm.imgdetial.y = obj.y
        this.getPanoramaMain();//获取全景图主图路径及点位信息
        this.getPanoramaPathList();//获取全景图真实路径集合
        
        this.getMediaInformation(2);
        this.getMediaInformation1(4);
        this.getUserGroup();
        this.getMediaInformation(1);
        this.getUserInfo();
        // this.initWebSocket();//现场连线
    },
    //   destroyed(){ 
    //       this.websock.close()
    //   }, 
      //离开路由之后断开websocket连接

    mounted(){
        // console.log(this.token,'this.token');
        this.ws = new WebSocket("ws://10.252.29.19:16800/websocket");
        
        // setTimeout(()=>{
        // },200)
        var that=this;
             this.ws.onopen = function () {
                var message = new Object();
                // var message={"type":"0","token":localStorage.getItem('token'),"projId":localStorage.getItem('projId')}
                message.token = localStorage.getItem('token');
                message.projId = localStorage.getItem('projId');
                message.type = "0";
                // console.log(message,'message');
                console.log(JSON.stringify(message),'ppp');
                console.log('连接成功');
                that.ws.send(JSON.stringify(message));
                // this.setMessageInnerHTML("open");
            }
        this.ws.onerror = function(){
            // that.setMessageInnerHTML("error");
        };
        this.ws.onmessage = function(event){
            console.log(JSON.parse(event.data),'回来的信息');
            that.setMessageInnerHTML(JSON.parse(event.data).value);
        };
        //连接关闭的回调方法
        this.ws.onclose = function(){
            // that.setMessageInnerHTML("close");
        };
        window.onbeforeunload = function(){
            that.ws.close();
        }

    //    this.getMediaInformation(4);
    // this.getMediaInformation(1);
    },
    watch:{
        
    },
    beforeUpdate(){

    },
    methods:{
        //即时通讯功能

            //发送短信
            sendMes(){
                var message = new Object();
                //私聊
                message.value = this.sendText;
                message.token = this.token;
                message.type = "1";
                message.to = this.selectChatUserId;
                message.projId = this.projId;
                console.log(JSON.stringify(message));
                this.ws.send(JSON.stringify(message));
                this.sendText="";
            },
            //将网页信息显示在网页上
            setMessageInnerHTML(innerHTML){
                document.getElementById('message').innerHTML += innerHTML + '<br/>';
            },
            //关闭会议设置
            closeMeetSet(){
                this.meetSetShow=false;
            },
            //打开会议设置
            openMeetSet(){
                this.meetSetShow=true;
            },
            //关闭对话设置
            closeOneByoneSet(){
                this.oneByoneSetShow=false;
            },
            //打开对话设置
            openOneByOneSet(){
                this.oneByoneSetShow=true;
            },
            //关闭成员列表
            closememberList(){
                 this.memberListShow=false;
            },
            //打开成员列表
            openMemberList(){
                this.memberListShow=true;
            },
            //关闭会议列表
            closemeetList(){
                this.meetListShow=false;
            },
            //打开会议列表
            openMeetList(){
                this.meetListShow=true;
            },
            getMember(){
                this.getMemberShow=!this.getMemberShow;
            },
            //获得工程用户列表
             getUserInfo(){//获得工程用户列表
                var vm = this
                vm.userIds=[]
                axios({
                    method:'GET',
                    url:vm.BDMSUrl+'project2/Config/projectUserList',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        projId:vm.projId,
                        queryParam:vm.userInfo
                    }
                }).then((response)=>{
                    if(response.data.rt != null){
                        vm.outsideUserList = response.data.rt;
                        console.log(vm.outsideUserList,'vm.outsideUserList')
                        vm.outsideUserList.forEach((item)=>{
                            vm.userIds.push(item.userId)
                        })
                        if(vm.userIds){
                            vm.getUserInfoByUserId()
                        }
                        
                        // vm.outsideUserList.forEach((ele)=>{
                        //     vm.$set(ele,'checked',false)
                        // })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            //根据用户ID获取用户信息
            getUserInfoByUserId(){
                var vm=this
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'/lc/getUserInfoByUserId',
                    headers:{
                        'token':vm.token
                    },
                    data:vm.userIds
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.userInfoList=response.data.rt;
                        console.log(this.userInfoList,'this.userInfoList');
                    }else if(response.data.cd==-1){

                    }
                })
            },
            //私聊选择用户
            selectChat(valId,name){
                this.selectChatUserId=valId;
                this.selectChatUserName=name;
                this.memberListShow=false;
                this.oneByoneShow=true;
            },

        fullModule(){
            var elem=document.getElementById("mm");
	        this.requestFullscreen(elem);
        },
        changeActive(val){
            if(val==1){
                this.mouseToggle1=true;
            }else if(val==2){
                this.mouseToggle2=true;
            }else if(val==3){
                this.mouseToggle3=true;
            }else if(val==4){
                this.mouseToggle4=true;
            }
        },
        removeActive(val){
            if(val==1){
                this.mouseToggle1=false;
            }else if(val==2){
                this.mouseToggle2=false;
            }else if(val==3){
                this.mouseToggle3=false;
            }else if(val==4){
                this.mouseToggle4=false;
            }
        },
        //实现全屏
        requestFullscreen( elem ) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.webkitRequestFullScreen) {
                // 对 Chrome 特殊处理，
                // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
                if ( window.navigator.userAgent.toUpperCase().indexOf( 'CHROME' ) >= 0 ) {
                    elem.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
                }
                // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
                else {
                    elem.webkitRequestFullScreen();
                }
            }
            else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
        },
        clickQjPic(val){
            this.isFullPicture=false;
            this.$refs.picture.src=this.QJFileManageSystemURL+this.PanoramaPathList[val];
            var source=this.QJFileManageSystemURL+this.PanoramaPathList[val];
            this.init(source);
        },
        fullVideo(){
          
            var elem=document.getElementById("videoPlay");
	        this.requestFullscreen(elem);
        },
        fullPicture(){
            var elem=document.getElementById("planeDIV");
	        this.requestFullscreen(elem);
        },
        fullLive(){
            var elem=document.getElementById("lineLive");
	        this.requestFullscreen(elem);
        },
        //打开设置
        openSetting(){

        },
        //获取用户群组
        getUserGroup(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/lc/getUserGroup',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getUserGroupList=response.data.rt;
                    this.ugGroupNameValue=this.getUserGroupList[0].ugId;
                    this.ugGroupName=this.getUserGroupList[0].ugName;
                }
            })
        },
        //获取文件树
        getFileTree(){
            var vm = this
            var setting = {
                data: {
                    key:{
                        name: "name",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                }
            };
            axios({
                method:'get',
                url:this.BDMSUrl+'/lc/getFileTree',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    ugId:this.ugGroupNameValue,
                    groupName:this.ugGroupName,
                    mediaType:this.type
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.fileTreeList_original=response.data.rt;
                    console.log(this.fileTreeList_original);
                    this.fileTreeList = data.transformTozTreeFormat(setting, response.data.rt);
                    console.log(this.fileTreeList)
                }
            })

        },
        //总图
        showFullPicture(){
            this.isFullPicture=true;
        },
        getMedia(type){
            this.addMediaDialog=true;
            this.mediaUrlList=[];
            this.getMediaInformation(type);
            // this.getMediaInformation1(type);
            // this.getMediaLiveInformation(type);
        },
        getMedia1(type){
            this.addMediaDialog1=true;
            this.getMediaInformation1(type);
            // this.getMediaInformation1(type);
            // this.getMediaLiveInformation(type);
        },
        //获取修改媒体
        getMediaInformation(type){
            this.type=type;
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/get',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:type
                }
            }).then(response=>{
                if(response.data.rt.length != 0){
                    this.mediaUrlList=response.data.rt;
                    if(type==1){
                        this.mediaUrlLists=response.data.rt;
                        this.modelPageTotal=this.mediaUrlLists.length;
                        this.$refs.modelObj.src=this.mediaUrlLists[0].path;
                    }
                    if(type==2){
                        this.videoPageTotal=this.mediaUrlList.length;
                        this.$refs.video.src=this.mediaUrlList[0].path;
                    }
                }else if(response.data.cd==-1){
                    alert(response.data.msg)
                }
                
            })
        },
        //获取直播
        getMediaInformation1(type){
            this.type=type;
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/get',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:type
                }
            }).then(response=>{
                if(response.data.rt.length!=0){
                    this.mediaUrlList1=response.data.rt;
                    this.lineLiveImgShow=false;
                    this.livePageTotal=this.mediaUrlList1.length;
                    console.log(this.playerOptions)
                    this.playerOptions.sources[0].src=this.mediaUrlList1[0].path;
                    // this.$refs.lineLive.src=this.mediaUrlList1[0].path;
                }else if(response.data.cd==-1){
                    alert(response.data.msg)

                }
                
            })
        },
        //改变模型
        handlemodelCurrentChange(val){
            this.$refs.modelObj.src=this.mediaUrlLists[val-1].path;
        },
        //改变视频
        handleVideoCurrentChange(val){
            this.$refs.video.src=this.mediaUrlList[val-1].path;
        },
        //改变全景图片
        handlePictureCurrentChange(val){
            this.isFullPicture=false;
            this.$refs.picture.src=this.QJFileManageSystemURL+this.PanoramaPathList[val-1];
            var source=this.QJFileManageSystemURL+this.PanoramaPathList[val-1];
            this.init(source);
        },
        //改变全景直播
        handleLiveCurrentChange(val){
            this.playerOptions.sources[0].src=this.mediaUrlList1[val-1].path;
        },
        checkItem(num){
            this.isActive=num;
        },
        //删除媒体文件
        deleteMediaUrl(num){
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/delete',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    id:num
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getMediaInformation(this.type);
                    // this.getMediaInformation1(this.type);
                    this.getPanoramaMain();//获取全景图主图路径及点位信息
                    this.getPanoramaPathList();//获取全景图真实路径集合
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        deleteMediaUrl1(num){
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/delete',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    id:num
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    // this.getMediaInformation(this.type);
                    this.getMediaInformation1(this.type);
                    
                    // this.getPanoramaMain();//获取全景图主图路径及点位信息
                    // this.getPanoramaPathList();//获取全景图真实路径集合
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        //获取文件所属群组
        getFileUserGroup(){
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/getFileUserGroup',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    fgId:this.getFgId,
                    mediaType:this.type
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.obj=response.data.rt;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        
        addMediaCancle(){
            this.addMediaDialog=false;
        },
         addMediaCancle1(){
            this.addMediaDialog1=false;
        },
        //增加资源
        addResource(){
            this.addResourceDialog=true;
            // this.getUserGroup();
            this.getFileTree();
            // this.getFileTree();
        },
        addResource1(){
            this.addResourceDialog1=true;
            // this.getUserGroup();
            // this.getFileTree();
            // this.getFileTree();

        },
        //取消资源弹框
        addResourceCancle(){
            this.addResourceDialog=false;
        },
         addResourceCancle1(){
             this.mediaUrl='';
            this.addResourceDialog1=false;
        },
        //用户群组改变
        ugGroupChange(){
            this.getUserGroupList.forEach((item,index)=>{
                if(item.ugId==this.ugGroupNameValue){
                    this.ugGroupName=item.ugName;
                }
            });
            this.getFileTree();

        },
        //树形图节点点击
        nodeClick(obj){
            this.fgId=obj.id;
            this.fgName=obj.name;
        },
        addResourceMakeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/add',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:this.type,
                    ugId:this.ugGroupNameValue,
                    fgId:this.fgId,
                    name:this.fgName,
                    path:'',
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getMediaInformation(this.type);
                    // this.getMediaInformation1(this.type);
                    this.getPanoramaMain();//获取全景图主图路径及点位信息
                    this.getPanoramaPathList();//获取全景图真实路径集合
                    this.addResourceDialog=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        addResourceMakeSure1(){
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/add',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:this.type,
                    path:this.mediaUrl,
                    ugId:'',
                    fgId:'',
                    name:''
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    // this.getMediaInformation(this.type);
                    this.getMediaInformation1(this.type);
                    this.addResourceDialog1=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })
        },
        //编辑媒体文件
        editMediaUrl(num){
            this.updateResourceDialog=true;
            this.mediaUrlList.forEach((item)=>{
                if(item.fileGroupId==num){
                    this.updateId=item.id;
                    this.getFgId=item.fileGroupId;
                }
            })
            this.getUserGroup();
            this.getFileUserGroup();
            this.getEditFileTree(num);
            this.getFileTree();
        },
        editMediaUrl1(num){
            this.updateResourceDialog1=true;
            this.mediaUrlList1.forEach((item)=>{
                if(item.fileGroupId==num){
                    this.updateId=item.id;
                    this.getFgId=item.fileGroupId;
                    this.mediaUrl=item.path;
                }
            }) 
        },
        //获取编辑文件树
        getEditFileTree(num){
            var vm = this
            var setting = {
                data: {
                    key:{
                        name: "name",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                }
            };
            axios({
                method:'get',
                url:this.BDMSUrl+'lc/getEditFileTree',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    ugId:this.ugGroupNameValue,
                    groupName:this.ugGroupName,
                    mediaType:this.type,
                    fgId:num
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.fileTreeList_original=response.data.rt;
                    this.fileTreeList = data.transformTozTreeFormat(setting, response.data.rt);
                }
            })
        },
        updateResourceMakeSure(){
             axios({
                method:'get',
                url:this.BDMSUrl+'lc/update',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:this.type,
                    ugId:this.ugGroupNameValue,
                    fgId:this.fgId,
                    name:this.fgName,
                    path:'',
                    id:this.updateId
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    this.getMediaInformation(this.type);
                    // this.getMediaInformation1(this.type);
                    this.getPanoramaMain();//获取全景图主图路径及点位信息
                    this.getPanoramaPathList();//获取全景图真实路径集合
                    this.updateResourceDialog=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        updateResourceMakeSure1(){
             axios({
                method:'get',
                url:this.BDMSUrl+'lc/update',
                headers:{
                    'token':this.token,
                },
                params:{
                    projectId:this.projId,
                    mediaType:this.type,
                    path:this.mediaUrl,
                    id:this.updateId
                }
            }).then(response=>{
                if(response.data.cd=='0'){
                    // this.getMediaInformation(this.type);
                    this.getMediaInformation1(this.type);
                    this.updateResourceDialog1=false;
                }else if(response.data.cd=='-1'){
                    alert(response.data.msg);
                }
            })

        },
        updateResourceCancle(){
            this.updateResourceDialog=false;
        },
        updateResourceCancle1(){
            this.mediaUrl='';
                        this.updateResourceDialog1=false;
        },
            //获取全景图主图路径及点位信息
        getPanoramaMain(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/lc/getPanoramaMain',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
                }).then(response=>{
                    if(response.data.rt.length!=0){
                        this.PanoramaMainList=response.data.rt;
                        this.$refs.fullPicture.src=this.PanoramaMainList.path;
                        this.imgdetial1=this.PanoramaMainList.list;
                        // this.qjpicShow=false;
                        // this.qjpicShow=false;
                        }
                    else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }
                })
        },
        //获取全景图真实路径集合
        getPanoramaPathList(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/lc/getPanoramaPathList',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then(response=>{
                if(response.data.rt.length!=0){
                    this.PanoramaPathList=response.data.rt;
                    this.picturePageTotal=this.PanoramaPathList.length;
                    this.$refs.picture.src=this.QJFileManageSystemURL+this.PanoramaPathList[0];
                    var source=this.QJFileManageSystemURL+this.PanoramaPathList[0];
                    this.qjpicShow=false;
                    this.init(source);
                }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }
            })
        },

        //全景图片渲染
         init(source){
                var vm = this
                var container, mesh;
                container = document.getElementById('planeDIV');
                camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );//相机
                camera.target = new THREE.Vector3( 0, 0, 0 );
                // camera.target = new THREE.Vector3( cx, cy, cz );
                // camera.aspect = window.innerWidth / window.innerHeight;
                // camera.lookAt(camera.target);
                // camera.updateProjectionMatrix();
                scene = new THREE.Scene();//场景
                var geometry = new THREE.SphereGeometry( 500, 60, 40 );//几何体
                geometry.scale( - 1, 1, 1 );
                var material = new THREE.MeshBasicMaterial( {
                    map: new THREE.TextureLoader().load(source)
                } );//材质
                mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );
                renderer = new THREE.WebGLRenderer();//渲染器
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize($("#planeDIV").width(),$("#planeDIV").height());
                // renderer.setSize(window.innerWidth-380,window.innerHeight-1000);
                container.innerHTML = ''
                container.appendChild( renderer.domElement );
                renderer.setClearColor(0xFFFFFF, 1.0);
                container.addEventListener( 'mousedown', vm.onDocumentMouseDown, false );
                container.addEventListener( 'mousemove', vm.onDocumentMouseMove, false );
                container.addEventListener( 'mouseup', vm.onDocumentMouseUp, false );
                container.addEventListener( 'wheel', vm.onDocumentMouseWheel, false );
                // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				// document.addEventListener( 'touchmove', onDocumentTouchMove, false );
                // document.addEventListener( 'mousewheel', mousewheel, false );
                // document.addEventListener('mousewheel', vm.mousewheel, false);
                
                

                container.addEventListener( 'dragover', function ( event ) {

                    event.preventDefault();
                    /** @namespace event.dataTransfer */
                    event.dataTransfer.dropEffect = 'copy';

                }, false );

                container.addEventListener('dragenter', function () {
                    document.body.style.opacity = 0.5;

                }, false );

                container.addEventListener( 'dragleave', function () {

                    document.body.style.opacity = 1;

                }, false );

               container.addEventListener( 'drop', function ( event ) {

                    event.preventDefault();

                    var reader = new FileReader();
                    reader.addEventListener( 'load', function ( event ) {

                        material.map.image.src = event.target.result;
                        material.map.needsUpdate = true;

                    }, false );
                    reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

                    document.body.style.opacity = 1;

                }, false );

                //
                window.addEventListener( 'resize', vm.onWindowResize, false );
                vm.animate();
            },

            onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize($("#planeDIV").width(),$("#planeDIV").height());

            },

            onDocumentMouseDown( event ) {

                event.preventDefault();

                isUserInteracting = true;

                onMouseDownMouseX = event.clientX;
                onMouseDownMouseY = event.clientY;

                onMouseDownLon = lon;
                onMouseDownLat = lat;

            },

            onDocumentMouseMove( event ) {

                if ( isUserInteracting === true ) {

                    lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
                    lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;

                }

            },  
            onDocumentMouseUp() {
                isUserInteracting = false;
            },
            onDocumentMouseWheel(event) {
                // distance += event.deltaY * 0.05;

                // distance = THREE.Math.clamp( distance, 400, 1000 );
                var x = event.pageX;
                var y = event.pageY;
                var div = $('#planeDIV');// 获取你想要的DIV
                var y1 = div.offset().top;  // div上面两个的点的y值
                var y2 = y1 + div.height();// div下面两个点的y值
                var x1 = div.offset().left;  // div左边两个的点的x值
                var x2 = x1 + div.width();  // div右边两个点的x的值
                
                    if( x < x1 || x > x2 || y < y1 || y > y2){
                        this.enableMouseWheel();
                        return;
                    }else{
                        this.disabledMouseWheel();
                // camera.fov += event.deltaY * 0.05;
                        var explorer =navigator.userAgent ;
                        if (explorer.indexOf("Firefox") >= 0){
                            camera.fov += event.deltaY * 1;
                        } else if (explorer.indexOf("Chrome") >= 0){
                            camera.fov += event.deltaY * 0.05;
                        } else if (explorer.indexOf("Ie") >= 0){
                            camera.fov += event.deltaY * 0.05;
                        }
                        if(camera.fov<10) camera.fov=10;
                        if(camera.fov>130) camera.fov=130;
                        camera.updateProjectionMatrix();
                        
                    }
                    
            },
            disabledMouseWheel() {
                if (document.addEventListener) {
                    document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
                }// W3C
                window.onmousewheel = document.onmousewheel = this.scrollFunc;// IE/Opera/Chrome
            },
            scrollFunc(evt) {
                evt = evt || window.event;
                if(evt.preventDefault) {
                    // Firefox
                    evt.preventDefault();
                    evt.stopPropagation();
                } else {
                    // IE
                    evt.cancelBubble=true;
                    evt.returnValue = false;
                }
                return false;
            },
            enableMouseWheel(){
                if (document.addEventListener) {
                    document.addEventListener('DOMMouseScroll', this.scrollFunc2, false);
                }// W3C
                window.onmousewheel = document.onmousewheel = this.scrollFunc2;// IE/Opera/Chrome
            },
            scrollFunc2(evt) {
                evt = evt || window.event;
                if(evt.preventDefault) {
                    // Firefox
                    //evt.preventDefault();
                    //evt.stopPropagation();
                } else {
                    // IE
                    evt.cancelBubble=false;
                    evt.returnValue = true;
                }
                return true;
            },
            animate() {
                var vm = this
                requestAnimationFrame( vm.animate );//动画
                vm.update();

            },
            update() {

                // if ( isUserInteracting === false ) {

                // lon += 0.1;

                // }

                lat = Math.max( - 85, Math.min( 85, lat ) );
                phi = THREE.Math.degToRad( 90 - lat );
                theta = THREE.Math.degToRad( lon );
                // camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );

                camera.target.x = distance * Math.sin( phi ) * Math.cos( theta );
                camera.target.y = distance * Math.cos( phi );
                camera.target.z = distance * Math.sin( phi ) * Math.sin( theta );

                camera.lookAt( camera.target );

                /*
                // distortion
                camera.position.copy( camera.target ).negate();
                */
                renderer.render( scene, camera );
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
    /***********设置滚动条************/
    /* 设置滚动条的样式 */
    .member_bodyUl::-webkit-scrollbar {
        width:7px !important;
    }
    /* 滚动槽 */
    .member_bodyUl::-webkit-scrollbar-track {
        box-shadow: inset006pxrgba(0,0,0,0.5);
        -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
        border-radius:10px;
    }
    /* 滚动条滑块 */
    .member_bodyUl::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        box-shadow: inset006pxrgba(0,0,0,0.5);
        -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
    }
    .member_bodyUl::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
    }
    /*********************/
    #fieldConnection{
        // /***********设置滚动条************/
        // /* 设置滚动条的样式 */
        // ::-webkit-scrollbar {
        //     width:7px;
        // }
        // /* 滚动槽 */
        // ::-webkit-scrollbar-track {
        //     box-shadow: inset006pxrgba(0,0,0,0.5);
        //     -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
        //     border-radius:10px;
        // }
        // /* 滚动条滑块 */
        // ::-webkit-scrollbar-thumb {
        //     border-radius:10px;
        //     background:rgba(0,0,0,0.1);
        //     box-shadow: inset006pxrgba(0,0,0,0.5);
        //     -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
        // }
        // ::-webkit-scrollbar-thumb:window-inactive {
        //     background:rgba(255,0,0,0.4);
        // }
        // /*********************/
         .topHeader{
            // box-sizing: border-box;
            // position: fixed;
            // top: 116px;
            // left: 26px;
            // bottom:0;
            // right: 0;
            // overflow: auto;
            box-sizing: border-box;
            float: left;
            width: 100%;
            overflow: auto;
            height: 800px;
        }
         ::-webkit-scrollbar{width:0px}
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
        #live_body{
            // margin-top:20px;
            margin:20px auto;
            // padding:10px;
            min-width: 1200px;
            width: 98%;
            height: 86%;
            // border:1px solid red;
            .videoDiv{
                width:70%;
                float: left;
                margin: 10px;
                height: 96%;
                // border:1px solid #0fc;
                .video_model{
                    border: 1px #c9c9c9 solid;
                    position: relative;
                    margin-left: 10px;
                    margin-bottom: 10px;
                    display: inline-block;
                    width: calc(50% - 20px);
                    height: calc(55% - 20px);
                    float: left;
                        .video_header{
                            position: absolute;
                            height: 40px;
                            width: 100%;
                            background-color: rgb(0, 0, 0);
                            opacity: 0.2;
                            z-index:900;
                            // display: none;
                            .vt{
                                    color: #fff;
                                    height: 40px;
                                    line-height: 40px;
                                    float: left;
                                    margin-left: 20px;
                                    font-size: 16px;
                                    // display: none;
                                }
                            // span{
                            //     color: #fff !important;
                            //     }
                            .fullScreen{
                                background-image: url(./images/fullScreen.png);
                                background-repeat: no-repeat;
                                background-size: 100% 100%;
                                width: 16px;
                                height: 16px;
                                float: right;
                                margin-right: 15px;
                                margin-top: 11px;
                                cursor: pointer;
                            }
                        }
                        // .video_header1{
                        //      position: absolute;
                        //     height: 40px;
                        //     width: 100%;
                        // }
                        .video_body{
                             position:relative;;
                            width: 100%;
                            height: 100%;
                            //  height: calc(100% - 20px);
                            #planeDIV{
                                position:absolute;
                                width:100%;
                                height:100%;
                                
                            }
                            #planeDIV1{
                                display: block;
                                height: 400px;
                                overflow: auto;
                                position: relative;
                                    .round{
                                        display: block;
                                        cursor: pointer;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 24px;
                                        height: 32px;
                                        background: url('./images/site.png')no-repeat 0 0;
                                    }
                                    .active{
                                        background: url('./images/site1.png')no-repeat 0 0;
                                    }
                            }
                            // .videoPlayer{
                            //     width: 100%;
                            // }
                            // .vjs_video_3-dimensions {
                            //     width: 100%;

                            // }
                        }
                        .video_bottom{
                            position: absolute;
                             height: 40px;
                            width: 100%;
                            background-color: white;
                            bottom:0px;
                            z-index: 999;
                            text-align: center;
                            border-top:1px solid #ccc;
                            .fullPicture{
                                float: left;
                                margin-left:20px;
                                font-size: 14px;
                                line-height: 40px;
                                color:#ccc;
                                cursor: pointer;
                                font-weight: bold;
                            }
                            .fullSet{
                                background-image: url(./images/set.png);
                                background-repeat: no-repeat;
                                background-size: 100% 100%;
                                width: 16px;
                                height: 16px;
                                float: right;
                                margin-right: 15px;
                                margin-top: 11px;
                                cursor: pointer;
                            }
                            .pagination{
                                margin:5px auto;
                            }

                        }
                }
            }
            .messageDiv{
                width:26%;
                float: right;
                margin: 8px;
                height: 100%;
                border:1px solid #ebebeb;
                position: relative;
                .setChatWindow{
                    height: 240px;
                    width: 240px;
                    background: #fff;
                    position: absolute;
                    right: 0px;
                    top:0px;
                    border:1px solid #ccc;
                    box-shadow: -2px 2px 2px #ccc;
                    z-index:3;
                    .head{
                        height: 48px;
                        border-bottom:1px solid #ededed; 
                        position: relative;
                        .head_txt{
                            position: absolute;
                            font-size: 16px;
                            color:#333333;
                            line-height: 48px;
                            left:12px;
                        }
                        .el-icon-close{
                            right: 14px;
                            top:12px;
                            position: absolute;
                            cursor: pointer;
                        }
                    }
                    .body{
                        height: 48px;
                        border-bottom:1px solid #ededed;
                        position: relative;
                        width: 96%;
                        margin:0 auto;
                        .body_txt{
                            color: #333;
                            font-size:14px;
                            position: absolute;
                            left:12px;
                            line-height: 48px;
                        }
                        .body_txt1{
                            color: #666;
                            font-size:14px;
                            position: absolute;
                            left:12px;
                            line-height: 48px;
                            cursor: pointer;
                        }
                        .meetTop{
                            width: 40px;
                            margin-top:14px;
                            margin-left:100px;
                        }
                        .body_edit{
                            background: url('./images/overviewedit.png') no-repeat 0 0;
                            width: 19px;
                            height: 16px;
                            display: inline-block;
                            // position: absolute;
                            // top:15px;
                            margin-left:1px;
                            margin-top:15px;
                            cursor: pointer;
                            &:hover{
                                background:url('./images/overviewedit.png') no-repeat 0 0;
                            }
                        }

                    }
                    // position: relative;
                    
                }
                .memberListWindow{
                    height: 100%;
                    width: 240px;
                    background: #fff;
                    position: absolute;
                    right: 0px;
                    top:0px;
                    border:1px solid #ccc;
                    box-shadow: -2px 2px 2px #ccc;
                    z-index:3;
                    // overflow-y: auto;
                    .head{
                        height: 40px;
                        border-bottom:1px solid #ededed; 
                        position: relative;
                        .head_txt{
                            position: absolute;
                            font-size: 16px;
                            color:#333333;
                            line-height: 40px;
                            left:12px;
                        }
                        .el-icon-close{
                            right: 14px;
                            top:12px;
                            position: absolute;
                            cursor: pointer;
                        }
                    }
                    .member_bodyUl{
                        height:500px;
                        overflow-y: auto;
                          
                        .member_body{
                            height:50px;
                            position: relative;
                            width: 100%;
                            &:hover{
                                background: #f0f0f0;
                            }
                            .header_info{
                                height: 40px;
                                width: 40px;
                                display: inline-block;
                                position: absolute;
                                left: 12px;
                                top:5px;
                                .header_img{
                                    height: 38px;
                                    width: 38px;
                                    border-radius: 38px;
                                }
                            }
                            .header_name{
                                max-width: 120px;
                                max-height: 40px;
                                position: absolute;
                                left:62px;
                                top:5px;
                                .real_name{
                                    display: block;
                                    text-align: left;
                                    font-size:14px;
                                    line-height: 20px;
                                    height: 20px;
                                    color:#333333;
                                }
                                .real_name1{
                                    display: block;
                                    text-align: left;
                                    text-align: left;
                                    font-size:14px;
                                    line-height: 20px;
                                    height: 20px;
                                    color:#cccccc;
                                }

                            }
                        }
                        // .member_body :hover{
                        //     background: red;
                        // }
                    }
                    
                }
                .meetListWindow{
                     height: 100%;
                    width: 240px;
                    background: #fff;
                    position: absolute;
                    right: 0px;
                    top:0px;
                    border:1px solid #ccc;
                    box-shadow: -2px 2px 2px #ccc;
                    z-index:3;
                    // overflow-y: auto;
                    .head{
                        height: 40px;
                        border-bottom:1px solid #ededed; 
                        position: relative;
                        .head_txt{
                            position: absolute;
                            font-size: 16px;
                            color:#333333;
                            line-height: 40px;
                            left:12px;
                        }
                        .el-icon-close{
                            right: 14px;
                            top:12px;
                            position: absolute;
                            cursor: pointer;
                        }
                    }

                }
                .message_header{
                    height: 40px;
                    background: #f5f5f5;
                    border-bottom: 1px solid #e6e6e6;
                    position: relative;
                    .text{
                        position: absolute;
                        // float: left;
                        font-size:14px;
                        // line-height: 40px;
                        color:#323232;
                        left:15px;
                        bottom: 10px;
                        cursor: pointer;
                        
                    }
                    .moreChatBtn{
                        background: url('./images/morePerson1.png') no-repeat 0 0;
                        width: 25px;
                        height: 25px;
                        display: inline-block;
                        position: absolute;
                        // top:15px;
                        right:88px;
                        bottom: 7px;
                        // margin-right: -8px;
                        // margin-top: 2px;
                        cursor: pointer;
                        &:hover{
                            background:url('./images/morePerson.png') no-repeat 0 0;
                        }
                    }
                    .oneChatBtn{
                        background: url('./images/person.png') no-repeat 0 0;
                        width: 25px;
                        height: 25px;
                        display: inline-block;
                        position: absolute;
                        // top:15px;
                        right: 50px;
                         bottom: 7px;
                        // margin-right: -8px;
                        // margin-top: 2px;
                        cursor: pointer;
                        &:hover{
                            background:url('./images/person1.png') no-repeat 0 0;
                        }
                    }
                    .setBtn{
                        background: url('./images/setChat.png') no-repeat 0 0;
                        width: 25px;
                        height: 25px;
                        display: inline-block;
                        position: absolute;
                        // top:15px;
                        right: 15px;
                         bottom: 7px;
                        // margin-right: -8px;
                        // margin-top: 2px;
                        cursor: pointer;
                        &:hover{
                            background:url('./images/setChat1.png') no-repeat 0 0;
                        }
                    }
                }
                .member_list{
                    height: 262px;
                    border-bottom:1px solid #ebebeb;
                    position: absolute;
                    top:40px;
                    overflow-y: auto;
                    background: #fff;
                    transition: 0.5s all;
                    .clearfix{
                        clear: both;
                        overflow: hidden;
                        content: '';
                    }
                    .memberUl{
                        width: 100%;
                        height: 100%;
                        .memberLi{
                            float: left;
                            width: 60px;
                            height: 60px;
                            // position: relative;
                            .getMember_info{
                                width: 30px;
                                height: 30px;
                                margin-top:10px;
                                // position: absolute;
                                .getMemberImg{
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 30px;
                                   margin-top:5px;
                                   margin-left:16px;
                                }
                            }
                            .getMember_txt{
                                display: block;
                                margin-top:10px;
                                color: #999;
                                font-size: 12px;

                            }
                        }

                    }
                    

                }
                .message_member{
                    height: 40px;
                    border-bottom: 1px solid #999;
                    .memeberInfoImg{
                        margin-top:3px;
                        height: 30px;
                        width: 30px;
                        border-radius: 50%;
                    }
                }
                .message_body{
                    height:70%;
                    background: #f5f5f5;
                    overflow-y: auto;
                }
                .message_textarea{
                    border-top:1px solid #e6e6e6;
                    .message_file{
                        height: 36px;
                        position: relative;
                        .emotIcon{
                            background: url('./images/emotIcon.png') no-repeat 0 0;
                            width: 16px;
                            height: 16px;
                            display: inline-block;
                            position: absolute;
                            top:14px;
                            left: 14px;
                            // margin-right: -8px;
                            // margin-top: 2px;
                            cursor: pointer;
                            &:hover{
                                background:url('./images/emotIcon1.png') no-repeat 0 0;
                            }
                        }
                        .picIcon{
                            background: url('./images/picIcon.png') no-repeat 0 0;
                            width: 16px;
                            height: 16px;
                            display: inline-block;
                            position: absolute;
                            top:14px;
                            left: 44px;
                            // margin-right: -8px;
                            // margin-top: 2px;
                            cursor: pointer;
                            &:hover{
                                background:url('./images/picIcon1.png') no-repeat 0 0;
                            }
                        }
                    }
                    #messageTextArea{
                            width: 97%;
                            margin: 6px;
                            height: 80px;
                            // height: 100%;
                            border: 0;
                            padding: 5px;
                    }
                    // input{
                    //     display: none;
                    // }
                        textarea {
                        resize: none;
                        text-decoration: none;
                        font-size: 12px;
                        }
                    .message_btn{
                        height: 36px;
                        position: relative;
                        .sendBtn{
                            position: absolute;
                            right:5px;
                            background: #fc3439;
                            margin-right: 20px;
                            color: #fff;
                            font-size: 14px;
                            font-weight: normal;
                            width: 60px;
                            height: 24px;
                            border: none;
                            padding: 0;
                            cursor: pointer;
                            border-radius: 2px;


                        }
                    }
                }
            }


        }
        #edit{
            .body{
                margin: 0 auto;
                width: 96%;
                border:1px solid #ccc;
                height: 500px;
                overflow-y: auto;

                .planTabel{
                    border-collapse:collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                        background:#f2f2f2;
                        tr{
                            td{
                                padding-left:10px;
                                height: 40px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 12px;
                                color: #666666;
                            }
                        }
                    }
                    tbody{
                        .select{
                            background:rgb(25, 147, 196);
                            cursor: pointer;
                            td{
                                color:white;
                            }
                        }
                        tr{
                            background:#fff;
                            cursor: pointer;
                            td{
                                padding-left:10px;
                                height: 40px;
                                text-align: center;
                                font-size: 12px;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                color: #666666;
                                 .actionBtn{
                                        display: inline-block;
                                        width: 16px;
                                        height: 16px;
                                        border: none;
                                        cursor: pointer;
                                        margin-right: 16px;
                                    }
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat;
                                    }
                                    .editBtn{
                                            background: url('../../assets/edit.png') no-repeat;
                                        }
                                    // .saveBtn{
                                    //     background: url('./images/worktask.png') no-repeat;
                                    // }
                            }
                        }
                    }

                }
                
            }
            .body1{
                margin: 0 auto;
                width: 96%;
                border:1px solid #ccc;
                height: 500px;
                .head{
                            margin-top:30px;
                            
                            .text{
                                float: left;
                                margin-left:75px;
                                height: 30px;
                                 color: #666;
                                font-size: 14px;
                                line-height: 30px;
                                font-weight: normal;
                                display: inline-block;
                            }
                            .editSelect1{
                                select{
                                    width: 330px;
                                    height: 30px;
                                    border: 1px solid #cccccc;
                                    position: relative;
                                    background: #fff;
                                    padding-left:10px;
                                    padding-right:20px;
                                    box-sizing: border-box;  
                                    margin-left: -115px;
                                    color: #333333;
                                    font-size: 14px;
                                    outline: none;
                                    }
                                    .icon-sanjiao{
                                        display: block;
                                        position: absolute;
                                        width: 12px;
                                        height: 7px;
                                        background-image:url('../Settings/images/sanjiao.png');
                                        background-size: 100% 100%;
                                        content: '';
                                        top: 152px;
                                        right: 169px;
                                    }
                            }
                            
                        }

            }
            .mediaUrl{

                .urlWord{
                    margin-left: -368px;
                    margin-bottom: 25px;
                }
                .urlInp{
                    .urlInp_inner{
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        border: 1px solid #dcdfe6;
                        box-sizing: border-box;
                        color: #606266;
                        display: inline-block;
                        font-size: inherit;
                        height: 37px;
                        line-height: 1;
                        outline: 0;
                        padding: 0 15px;
                        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                        width: 440px;
                    }

                }

            }
        }
    }

</style>

<style lang="less">
// .el-input__inner{
//     width:450px !important;
// }
.tree_file{
    height:350px;
    margin:0px 100px;
    overflow-y:auto;
                                   
        #ugGroupTree{
            .el-switch.is-checked .el-switch__core:after {
                left: 100%;
                margin-left: -17px;
            }
            .el-switch__core:after {
                content: "";
                position: absolute;
                top: 1px;
                left: 1px;
                border-radius: 100%;
                transition: all .3s;
                width: 16px;
                height: 16px;
                background-color: #fff;
            }
        /*
        修改eleUI树形组件
        */
                .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                        background-color: #dfdfdf;
                }
                .el-tree-node__label{
                    font-size: 12px;
                    min-height: 16px;
                    color: #666666;
                    padding-left: 22px; 
                    position: relative;
                }
                
                .el-tree-node__expand-icon .el-icon-caret-right:before{
                    content: "\E604";
                    color: #999999;
                    font-weight: bold;
                    display: block;
                    position: absolute;
                    top: 2px;
                    left: 4px;
                    width: 14px;
                    height: 13px;
                    background: url('./images/file.png')no-repeat 0 0 !important;
                    content: '';
                    
                }
                .el-tree-node__label::before{
                    display: block;
                    position: absolute;
                    top: 6px;
                    left: 4px;
                    width: 14px;
                    height: 13px;
                    background: url('./images/file.png')no-repeat 0 0;
                    content: '';
                }
                
            } 
    }

</style>




// WEBPACK FOOTER //
// src/components/constructionSite/fieldConnection.vue