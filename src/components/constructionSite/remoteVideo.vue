<template>
    <div id="remoteVideo">
        <div class="topHeader">
                <div id="item-box-file">
                    <!-- <router-link :to="'/constructionSite/safetyInspection'" class="label-item">  
                    安全监测
                    </router-link>
                    <router-link :to="'/constructionSite/safetyCheckings'" class="label-item">  
                    安全检查  
                    </router-link>
                    <router-link :to="'/constructionSite/safetyRuning'" class="label-item">  
                    安全巡检  
                    </router-link>
                    <router-link :to="'/constructionSite/remoteVideo'" class="label-item label-item-active">  
                    远程视频  
                    </router-link> -->
                    <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                    </router-link>
                </div>
                <div class="videoBody">
                        <div class="head">{{cameraNameId}}</div>
                        <div class="body">
                            <videoPlayer :playsinline="true" id="lineLive" class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
                        </div>
                        <div class="openSetDiv">
                            <span class="openSet" @click="openSet()"></span>
                        </div>
                        <ul id="bottomUl" >
                            <span :class="['el-icon-arrow-left','leftIcon']" style="font-size: 30px;" @click="leftSlide"></span>
                            <li v-for="(item,index) in mediaUrlList" class="bottomLi" :key="index">
                                <img style="cursor:pointer;" src="./images/play1.png"  @click="changeVideo(item.path,item.cameraId)">
                                <span style="display:block;color:#ccc;font-size:14px;">{{item.cameraId}}</span>
                            </li>
                            <span :class="['el-icon-arrow-right','rightIcon']" style="font-size: 30px;" @click="rightSlide"></span>
                        </ul>


                </div>
        </div>
        <div id="edit">
                <!-- <el-dialog title="来源配置" :visible.sync="addMediaDialog" @close="addMediaCancle">
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
                </el-dialog> -->
                <el-dialog  title="媒体路径选择" :visible.sync="addResourceDialog" @close="addResourceCancle">
                    <div class="mediaUrl">
                        <div class="urlWord" style="margin-left:-352px !important">摄像机名称ID</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="cameraID"/></div>
                    </div>
                   <div class="mediaUrl">
                        <div class="urlWord" style="margin-left:-365px !important">摄像机类型</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="cameraType"/></div>
                    </div>
                    <div class="mediaUrl">
                        <div class="urlWord" style="margin-left:-404px !important">备注</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="cameraRemark"/></div>
                    </div>
                    <div class="mediaUrl">
                        <div class="urlWord">目标URL</div>
                        <div class="urlInp"><input class="urlInp_inner" v-model="mediaUrl"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addResourceMakeSure">保存</button>
                        <button class="editBtnC" @click="addResourceCancle">取消</button>
                    </div>
                </el-dialog>

        </div>
        
    </div>
</template>
<script>
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import { videoPlayer } from 'vue-video-player'
import axios from 'axios'
export default {
    name:'remoteVideo',
    components: {
        videoPlayer
    },
    data(){
        window.addEventListener("message", (evt)=>{
                       this.callback(evt)},true
        );
        return{
            routerList:'',
            moduleList:'',
            mediaUrlList:'',
            cameraNameId:'',
            addMediaDialog:false,
            addResourceDialog:false,
            cameraID:'',
            cameraType:'',
            cameraRemark:'',
            mediaUrl:'',



            // playerOptions:{
            //     margin:'0 auto',
            //     height: '300',  
            //     playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            //     autoplay: true, //如果true,浏览器准备好时开始回放。
            //     muted: false, // 默认情况下将会消除任何音频。
            //     // loop: false, // 导致视频一结束就重新开始。
            //     // autoplay: true,  
            //     // controls: true,
            //     // muted: false,
            //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            //     language: 'zh-CN',
            //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            //     sources:[{
            //         type: "rtmp/mp4",
            //         src: "" //url地址
            //     }],
            //     poster: " ", //你的封面地址
            //     // width: document.documentElement.clientWidth,
            //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            //     controlBar: {
            //         timeDivider: true,
            //         durationDisplay: true,
            //         remainingTimeDisplay: false,
            //         fullscreenToggle: true  //全屏按钮
            //     }
            // },
            playerOptions: {  
                // width:'inherit',
                margin:'0 auto',
                height: '300',  
                sources: [{  
                    type: "rtmp/mp4",  
                    src: "" 
                }],  
                // aspectRatio: '16:9',
                techOrder: ['flash'],  
                autoplay: true,  
                controls: true,
                muted: false,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                // poster: "./images/baoc.png",
            },
            token:'',
            projId:'',
            userId:'',
            projName:'',
        }
    },
    created(){
        var vm=this;
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'))
        this.BDMSUrl=this.$store.state.BDMSUrl;
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        this.loadingTitle();
        this.getMediaInformation(4);
    },
    methods:{
        callback(e){
            console.log(e.data,'e.data.command');
            switch(e.data.command){
                // console.log()
                case "CurrentSelectedLabel":
                    {
                        if(e.data.parameter.type=="Camera"){
                            // console.log(e.data.parameter.value.Tag.split(";")[0].split("=")[1],'Tag');
                            var str=e.data.parameter.value.Tag.split(";")[0].split("=")[1];
                            console.log(e.data.parameter.value.CameraUrl);
                            if(e.data.parameter.value.CameraUrl){
                                this.playerOptions.sources[0].src=e.data.parameter.value.CameraUrl;
                                this.cameraNameId=e.data.parameter.value.Tag.split(";")[0].split("=")[1]; //摄影机id
                                document.body.scrollTop = 850;
                                document.documentElement.scrollTop = 850;
                                this.$message({
                                    type:'info',
                                    message:'正在加载摄像机头...'
                                })
                            }else{
                                this.$message({
                                    type:'info',
                                    message:'机位监控没有视频流'
                                })
                            }
                        }
                    }
                break;
            }
        },
        checkItem(){

        },
        addMediaCancle(){

        },
        addResource(){

        },
        editMediaUrl(){

        },
        deleteMediaUrl(){

        },
        changeVideo(path,name){
            this.playerOptions.sources[0].src=path;
            this.cameraNameId=name;
            console.log(path,'index',name,'name');

        },
        getNextVideo(index){
            console.log('1111');
            console.log(index,'111111')
            // this.playerOptions.sources[0].src=path;
            // this.cameraNameId=name;
            // console.log(path,'index1',name,'name1');
        },
        addResourceCancle(){
            this.addResourceDialog=false;
            this.cameraID="";
            this.cameraType="";
            this.cameraRemark="";
            this.mediaUrl="";
        },
        addResourceMakeSure(){
            if(this.cameraID==""){
                this.$message({
                    type:'info',
                    message:'请输入摄像机名称ID'
                })
            }else if(this.mediaUrl==""){
                this.$message({
                    type:'info',
                    message:'请输入目标Url'
                })
            }else{
                 axios({
                    method:'get',
                    url:this.BDMSUrl+'lc/add',
                    headers:{
                        'token':this.token,
                    },
                    params:{
                        projectId:this.projId,
                        mediaType:4,
                        path:this.mediaUrl,
                        ugId:'',
                        fgId:'',
                        name:'',
                        cameraId:this.cameraID,
                        cameraType:this.cameraType,
                        cameraRemark:this.cameraRemark
                    }
                }).then(response=>{
                    if(response.data.cd=='0'){
                        // this.getMediaInformation(this.type);
                        this.$message({
                            type:'info',
                            message:'添加监控流成功'
                        })
                        this.getMediaInformation(4);
                        this.addResourceDialog=false;
                        this.cameraID="";
                        this.mediaUrl="";
                        this.cameraType="";
                        this.cameraRemark="";
                    }else if(response.data.cd=='-1'){
                        alert(response.data.msg);
                    }
                })
            }
        },
        openSet(){
            this.addResourceDialog=true;
        },
        leftSlide(){
            document.getElementById("bottomUl").offsetLeft="100px"
        },
        rightSlide(){
            document.getElementById("bottomUl").offsetRight="100px"
        },
        loadingTitle(){
            var vn=this;
            vn.routerList=vn.getSecondGradeList(vn.moduleList,'006','00603','/constructionSite/remoteVideo','00602','/constructionSite/safetyRuning','00601','/constructionSite/safetyCheckings','00604','/constructionSite/safetyInspection');
            console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
        //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
         //获取直播
        getMediaInformation(type){
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
                    this.mediaUrlList=response.data.rt;
                    this.playerOptions.sources[0].src=this.mediaUrlList[0].path;
                    this.cameraNameId=this.mediaUrlList[0].cameraId;
                    // this.$refs.lineLive.src=this.mediaUrlList1[0].path;
                }else if(response.data.cd==-1){
                    alert(response.data.msg)
                }
            })
        },

    }
    
}
</script>
<style lang="less" scope>
#remoteVideo{
     .topHeader{
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
        .videoBody{
            margin:20px auto;
            width: 80%;
           
            .head{
                
                display: inline;
                font-size: 26px;
                
                font-weight: 400;
                color: #ccc;
                cursor: default;
                
            }
            .openSetDiv{
                margin-top:10px;
                height: 20px;
                position: relative;
                .openSet{
                    background-image: url(./images/set.png);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    width: 16px;
                    height: 16px;
                    right:5px;
                    // float: right;
                    position: absolute;
                    // margin-right: 15px;
                    // margin-top: 11px;
                    cursor: pointer;
                }
            }
            #bottomUl{
                    height: 140px;
                    width:100%;
                    background: #fff;
                    overflow: hidden;
                    position: relative;
                    z-index:10000000000;
                    .leftIcon{
                        position: absolute;
                        left:2px;
                        top:34%;
                        cursor: pointer;
    
                    }
                    .rightIcon{
                        position: absolute;
                        right:2px;
                        top:34%;
                        cursor: pointer;
                    }
                    .bottomLi{
                        display: inline-block;
                        margin:6px;
                        transition: all 0.6s
                        // img{
                        //     transition: all 0.6s
                        // }
                        // img:hover{
                        //     transform: scale(1.1);
                        // }
                        // position: absolute;
                    }
                    .bottomLi:hover{
                        transform: scale(1.1);
                    }

            }
            
            .body{
                margin-top:10px;
                 height: 600px;
                border:1px solid #ccc;
                #lineLive{
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }
            #bottom{
                // height: 100px;
                margin-top:30px;
                // z-index:10000;
                // border:1px solid #ccc;
                // li{
                //     float: left;
                //     margin:4px;
                //     img{
                //         cursor: pointer;
                //     } 
                // }

            }

        }
        #edit{
             .mediaUrl{

                .urlWord{
                    margin-left: -368px;
                    margin-top: 5px;
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
