<template>
    <div id="wrapper">
        <div id="item-box-file1">
            <span :class="['label-item1',{'label-item-active1':itemShow}]" @click="controlList()">监控列表</span>
            <span :class="['label-item1',{'label-item-active1':!itemShow}]" @click="dangerLevel()">危险源等级</span>
            <div v-show="itemShow" class="wrapperHead" @click="buildVideo">
                <span class="el-icon-plus"></span><span class="elName">添加监控视频</span>
            </div>
            <!-- <div v-show="!itemShow" class="wrapperHead" @click="buildDangerLevel">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div> -->
        </div>
        <div class="itemBody">
            <ul class="cardUl">
                <li class="cardLi" v-for="(item,index) in getCameraLists" :key="index">
                    <h4>{{item.name}}</h4>
                    <h3>危险源级别:<span style="color:red;">{{item.level}}</span></h3>
                    <div class="operation">
                        <span @click="locationVideo(item)" class="el-icon-location actBtn"></span>
                        <span @click="editVideo(item)" class="el-icon-edit-outline actBtn"></span>
                        <span @click="deleteVideo(item.id)" class="el-icon-delete actBtn"></span>
                    </div>
                </li>
            </ul>
        </div>
        <div id="edit">
                <el-dialog title="添加视频监控" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">摄像头名称 :</label><input class="inp" placeholder="请输入" v-model="videoName"/></div>
                        <div class="editBodytwo"><label class="editInpText">摄像头地址 :</label><input class="inp" placeholder="请输入" v-model="videoUrl"/></div>
                        <div class="editBodytwo">
                            <label class="editInpText">危险源级别 :</label>
                            <select class="editSelect" v-model="dangerLevel" >
                                <option v-for="(item,index) in dangerList" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                        </div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="setVideo(videoName,videoUrl,dangerLevels)">放置摄像头</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog>

                 <!-- <el-dialog title="添加视频监控" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">摄像头名称 :</label><input class="inp" placeholder="请输入" v-model="videoName"/></div>
                        <div class="editBodytwo"><label class="editInpText">摄像头地址 :</label><input class="inp" placeholder="请输入" v-model="videoUrl"/></div>
                        <div class="editBodytwo">
                            <label class="editInpText">危险源级别 :</label>
                            <select class="editSelect" v-model="dangerLevel" >
                                <option v-for="(item,index) in dangerList" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                        </div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="setVideo(videoName,videoUrl,dangerLevels)">放置摄像头</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog> -->
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
var app;
var ScreenPara;
var CurrentSelectPara;
export default {
    name:'controlVideo',
    data(){
        return{
            itemShow:true,
            dangerLevels:'1',
            dangerList:[{
                value:'1',
                label:'A'
            }],
            addDialog:false,
            videoName:'',
            videoUrl:'',
            getCameraLists:[]
        }
    },
    created(){
        var vm=this;
        window.addEventListener("message", (evt)=>{this.callback(evt)});
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.entId=localStorage.getItem('entId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.appShareUrl= vm.$store.state.appShareUrl;
        vm.token  = localStorage.getItem('token');
        this.getCameraList();

    },
    destoryed(){
            window.removeEventListener("message", (evt)=>{this.callback(evt)});
    },
    methods:{
        callback(e){
           // console.log(e)
            switch(e.data.command){
			case "EngineReady":
				break;
            case "CameraListUpdate":
                this.getCameraList();
                break;
		    }
        },
        buildVideo(){
            this.addDialog=true;
        },
        buildDangerLevel(){

        },
        controlList(){
            this.itemShow=true;
        },
        dangerLevel(){
            this.itemShow=false;
        },
        //放置摄像头
        setVideo(videoName,videoUrl,dangerLevel){
            if(document.getElementById('webgl').style.display=='none'){
                this.$message({
                    type:'info',
                    message:'请打开顶部的虚拟场景'
                })
            }else{
                    const app = document.getElementById('webIframe').contentWindow;
                    const parList={'videoName':videoName,'videoUrl':videoUrl,'dangerLevel':dangerLevel,'projectId':this.projId,'token':this.token}
                    console.log(parList,'parList000');
                    // app.postMessage({command:"Init",parameter:null},"*");
                    app.postMessage({command:"startSetCamera",parameter:parList},"*");
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    this.addDialog=false;
            }

        },
        getCameraList(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'camera/getCameraList',
                method:'GET',
                params:{
                    projectId:this.projId
                },
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getCameraLists=response.data.rt;
                }
            })
        },
        locationVideo(val){
            if(document.getElementById('webgl').style.display=='none'){
                this.$message({
                    type:'info',
                    message:'请打开顶部的虚拟场景'
                })
            }else{
                    const app = document.getElementById('webIframe').contentWindow;
                    app.postMessage({command:"LookAtCamera",parameter:val.position},"*");
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
            }
        },
        editVideo(){

        },

        deleteVideo(id){
            this.$confirm('你是否删除该摄像头','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'camera/deleteCamera',
                    method:"GET",
                    params:{
                        id:id
                    },
                    headers:{
                        'token':this.token
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getCameraList();
                        const app = document.getElementById('webIframe').contentWindow;
                        app.postMessage({command:"CameraListUpdate",parameter:null},"*");
                    }
                })
            })
        },
        addCancle(){
            this.addDialog=false;
        }


    }

}
</script>

<style lang="less" scoped>
*{
    margin:0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
    #wrapper{
        margin-top:51px;
        margin-right: 20px;
        #item-box-file1 {
            display: block;
            border: 1px solid #e6e6e6;
            // height: 36px;
            height: 51px;
            padding-top: 16px;
            padding-left: 20px;
            
            background: #fafbfc;
            position: relative;
            .label-item1 {
                float: left;
                height: 34px;
                font-size: 14px;
                width: 106px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border-top: 3px solid #fafbfc;
                color: #999999;
                text-decoration: none;
            }
            .label-item-active1 {
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
            .wrapperHead{
                float: right;
                line-height: 22px;
                height: 54px;
                margin-right:15px;
                cursor: pointer;
                .el-icon-plus{
                    font-size: 16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
                .elName{
                    margin-left:4px;
                    font-size:16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
            }
        }
        .itemBody{
            width: 98%;
            margin:0 auto;
            height: 600px;
            // border: 1px solid #ccc;
            overflow: auto;
            padding: 5px;
            .cardUl{
                display: flex;
                flex-direction:row;
                flex-wrap:wrap;
                // flex-wrap: nowrap;
                justify-content: flex-start;
                flex-shrink: 1;
                .cardLi{
                    position: relative;
                    width: 22%;
                    height: 200px;
                    background: #fff;
                    box-sizing: border-box;
                    float: left;
                    list-style: none;
                    border: 1px solid #eaebec;
                    border-top: solid 2px #2e8cb9;
                    padding: 20px;
                    transition: all .2s linear;
                    margin: 20px;
                    &:hover{
                        box-shadow: 0 15px 30px rgba(0,0,0,.1);
                        transform: translate3d(0,-5px,0);
                    }
                    h4{
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 16px;
                        color: #2e8cb5;
                        padding: 18px 0 10px;
                    }
                     h3{
                            font-weight: 400;
                            font-size: 28px;
                            line-height: 28px;
                            color: #2e8cb5;
                            padding-bottom: 18px;
                    }
                    .operation{
                        margin-top:20px;
                        justify-content:center
                        .actBtn{
                            display: inline-block;
                            margin:5px;
                            cursor: pointer;

                        }
                        .el-icon-location{
                            font-size: 20px;
                            color: #2e8cb0;
                            margin:5px;
                            cursor: pointer;
                            &:hover{
                                color: #2e8c80;
                            }
                        }
                        .el-icon-edit-outline{
                            font-size: 20px;
                            color: #2e8cb0;
                             margin:5px;
                            cursor: pointer;
                             &:hover{
                                color: #2e8c80;
                            }
                        }
                        .el-icon-delete{
                            font-size: 20px;
                            color: #2e8cb0;
                             margin:5px;
                            cursor: pointer;
                             &:hover{
                                color: #2e8c80;
                            }
                        }
                    }
                    
                }

            }

        }
        #edit{
            .editSelect{
                    width: 436px;
                    height: 38px;
                    color: #333333;
                    background: #fafafa;
                    border: 1px solid #d1d1d1;
                    padding:0px 0px 0px 10px;
                }
        }
    }


</style>
