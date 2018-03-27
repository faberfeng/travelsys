<template>
    <div class="wrapper" id='in'>
        <h4 class="title"><span>工程初始配置</span></h4>
        <div class="account">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/project-id.png"/>工程账号 <span class="groundSpan" @click="retract"><img class="groundEdit"   :src="retractImg"/>{{retractText}}</span></h5>
            <ul class="accountList" >
                <li class="pre"><span>工程账号</span> <label>{{projectConfig.projAdminAccount}}</label></li>
                <li class="pre"><span>工程名称</span> <label>{{projectConfig.projName}}</label></li>
                <li class="pre"><span>工程管理账号</span> <label>{{projectConfig.projAdminEmail}}</label></li>
                <li class="pre"><span>工程管理员姓名</span> <label>{{projectConfig.projAdminName}}</label></li>
                <li class="pre" v-show="isShow"><span>工程管理员电话</span> <label>{{projectConfig.projTelphone}}</label></li>
                <li class="pre" v-show="isShow"><span>授权用户数量</span> <label>无限制使用  {{projectUseCount}}个已使用</label></li>
                <li class="pre" v-show="isShow"><span>到期日期</span> <label>{{projectConfig.projExpireTime | toLocalD}}</label></li>
                <li class="pre " id="pre" v-show="isShow">
                    <span>工程logo</span> 
                    <div class="preDiv">
                        <div class="imgDiv" @click="updataNewImage">
                            <div class="imgMask"><img class="hoverAdd" src="../../assets/hover-add.png"  /><img  src="../../assets/updata-logo.png"  /></div>
                            <img :src="projectImage.filePath" class="logo" style="width:200px;height:50px;"/></div>
                        <div style="margin:0;"><el-checkbox size="small" style="margin:0;width:115px;font-size:12px;" v-model="checked">使用默认logo</el-checkbox> <label style="margin-left:
                        -10px;color:#999999;font-size:12px;">200*50px,jpg/png格式</label></div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="summary">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/project-state.png"/>工程概况<span class="add" @click="add"><i class="el-icon-plus"></i> 新增</span></h5>
            <ul class="accountList uniqueList" >
                <li class="pre" v-for=" (item,index) in sumaryData" :key="index"><span>{{item.viewKey}}</span> <label>{{item.viewVal}}</label><img class="imgedit" @click="edit(index)" src="../../assets/edit.png"/><img @click="del(index)" class="imgdelete" src="../../assets/delete.png"/></li>
            </ul>
        </div>
        <div class="img">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/project-img.jpg">工程图片</h5>
            <ul class="imgUl">
                <!--封面图片-->
                <li class="imgLi" v-for="(item,index) in projectImageList" :key="index">
                    <div>
                        <img :src="item.filePath"/>
                    </div>
                    <div class="imgBottom"><label><div class="setAsLogo"></div>封面</label><span @click="deleteImage(index)"><div class="bottomDelete"></div>删除</span></div>
                </li>
                <li class="imgLi">
                    <div>
                        <img src="../../assets/firstPageImage.png"/>
                    </div>
                    <div class="imgBottom"><label><div class="setAsLogo"></div>设为封面</label><span> <div class="bottomDelete"></div>删除</span></div>
                </li>
                <!--上传图片-->
                <li class="imgLi" >
                    <div class="imgD" >
                        <div class="imgDMask">
                            <div class="imgMaskD"></div>
                            <p class="imgDMaskp">上传图片</p>
                        </div>
                    </div>
                </li>
                
            </ul>
        </div>
        <!--弹出的对话框-->
        <div id="edit">
            <el-dialog title="新增工程概况信息" :visible.sync="addDialog">
                <el-form >
                    <el-form-item label="单位 :">
                        <el-input class="inp"  v-model="projectUnity"></el-input>
                    </el-form-item>
                    <el-form-item label="名称 :">
                        <el-input class="inp"  v-model="projectName"></el-input>
                    </el-form-item>
                </el-form>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addMakeSure">确定</el-button>
                    <el-button @click="addDialog=false">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="工程概况信息编辑" :visible.sync="editDialog">
                <el-form >
                    <el-form-item label="单位 :">
                        <el-input  class="inp" v-model="projectUnity"></el-input>
                    </el-form-item>
                    <el-form-item label="名称 :">
                        <el-input  class="inp" v-model="projectName"></el-input>
                    </el-form-item>
                </el-form>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editMakeSure">确定</el-button>
                    <el-button @click="editDialog=false">取消</el-button>
                </div>
            </el-dialog>
        </div>
        
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除分区【西南区】?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import shouqiImg from '../../assets/arrow-top.png';
import zhankaiImg  from '../../assets/arrow-down.png';
import axios from 'axios';

export default {
    name:'InitalSettings',
    data(){
        return{
            addDialog:false,
            editDialog:false,
            deleteDialog:false,
            NotdeleteDialog:false,
            showErr:false,
            checked:false,
            projectUnity:'',
            projectName:'',
            retractImg:shouqiImg,
            retractText:'收起',
            isShow:true,
            token:'',
            projId:'',
            sumaryData:[],//工程概况信息列表
            //unity=>viewKey viewVal=>viewVal
            index:'',
            projectConfig:{},
            projectUseCount:'',
            projectImage:{},
            projectImageList:[],//获取工程图片列表
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getBasicSituation();//获取工程概况
        this.getProjectInitalConfig();//工程初始信息
        this.getProjectImageList();//获取工程图片列表
    },
    filters:{
        toLocalD(val){
            return new Date(val).toLocaleString();
        }
    },
    methods:{
        edit(index){
            this.editDialog = true;
            this.index = index;
            this.projectUnity = this.sumaryData[index].viewKey;
            this.projectName = this.sumaryData[index].viewVal;
        },
        del(index){
            this.index = index;
            this.deleteDialog = true;
        },
        add(){
            this.addDialog = true;
        },
        addMakeSure(){
             if(this.projectUnity !==''&& this.projectName !==''){
                this.sumaryData.push({
                    viewKey:this.projectUnity,
                    viewVal:this.projectName
                })
                axios({
                    method:'post',
                    url:'http://10.252.26.240:8080/h2-bim-project/project2/saveProjectOverview',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    data:{
                        id:0,
                        projId:localStorage.getItem('projId'),
                        viewKey:this.projectUnity,
                        viewVal:this.projectName
                    }
                }).then((response)=>{
                    if(response.data.cd==='0'){
                        alert('新增成功');
                    }
                });
                this.projectUnity='';
                this.projectName='';
                this.addDialog = false;
                this.showErr = false;
             }else{
                this.showErr = true;
             }
        },
        deleteMakeSure(){
            this.sumaryData.splice(this.index,1);
            this.deleteDialog = false;
            axios({
                method:'post',
                url:"http://10.252.26.240:8080/h2-bim-project/project2/delProjectOverview",
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.sumaryData[this.index].id
                }
            }).then((response)=>{
                console.log(response);
                if(response.data.cd === '0'){
                    alert('删除成功');
                }
            })
        },
        editMakeSure(){
            if(this.projectUnity !==''&& this.projectName !==''){
                this.sumaryData[this.index].viewKey = this.projectUnity;
                this.sumaryData[this.index].viewVal = this.projectName;
                axios({
                    method:'post',
                    url:'http://10.252.26.240:8080/h2-bim-project/project2/saveProjectOverview',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    data:{
                        id:this.sumaryData[this.index].id,
                        projId:this.sumaryData[this.index].projId,
                        viewKey:this.sumaryData[this.index].viewKey,
                        viewVal:this.sumaryData[this.index].viewVal
                    }
                }).then((response)=>{
                    //console.log(response);
                    if(response.data.cd==='0'){
                        alert('修改成功');
                    }
                });
                this.projectUnity='';
                this.projectName='';
                this.editDialog = false;
                this.showErr = false;
            }else{
                this.showErr = true;
            }
        },
        updataNewImage(){
            console.log(123)
        },
        retract(){
            if(this.retractImg === shouqiImg){
                this.retractImg = zhankaiImg;
                this.retractText = '展开';
                this.isShow = false;
            }else{
                this.retractImg = shouqiImg;
                this.retractText = '收起';
                this.isShow = true;
            }

        },
        deleteImage(index){
            console.log(index);
            this.projectImageList.splice(index,1);
            //this.projectImageList[index];
            axios({
                method:'post',
                url:"http://10.252.26.240:8080/h2-bim-project/project2/deleteProjectImage",
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    imageId:this.projectImageList[index].id,
                    fileId:this.projectImageList[index].fileId,
                }
            }).then((response)=>{
                if(response.data.cd==='0'){
                    alert('删除成功');
                }
            })
        },
        getBasicSituation(){
            var url = 'http://10.252.26.240:8080/h2-bim-project/project2/'+this.projId+'/overview/list';
            axios({
                method:'GET',
                url:url,
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                //console.log( response.data.rt);
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    this.sumaryData = response.data.rt;
                }
            })

        },
        getProjectInitalConfig(){
            axios({
                method:'get',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/projectConfigIndex',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                console.log(response.data.rt);
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    this.projectConfig = response.data.rt.project;
                    this.projectUseCount = response.data.rt.projectUserCount;
                    this.projectImage = response.data.rt.projectImage;
                }
            })
        },
        getProjectImageList(){
            axios({
                method:'get',
                url:'http://10.252.26.240:8080/h2-bim-project/project2/findProjectImage',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                console.log(response.data.rt);
                if(response.data.cd === '1'){
                    this.$router.push({
                        path:'/login'
                    })
                }else{
                    this.projectImageList = response.data.rt;
                }
            })
        }
    }
}
</script>
<style scoped>

    .wrapper{
        width: 100%;
    }
    .title{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        border-bottom:1px solid #ccc; 
        height: 50px;
        line-height: 50px;
        margin: 10px 20px 0 0px ;
        text-align: left;
    }
    .title span{
        width: 50%;
        margin-left: 15px;
    }
    .account,.summary,.img{
        /* width:97%; */
        margin-left: 15px;
        margin-right: 20px;
    }
    .accountTitle{
        width: 100%;
        color: #fc3439;
        text-align: left;
        font-size: 16px;
        font-family: '微软雅黑';
        font-weight: bold;
        margin: 20px 0 2px 0;
        border-bottom: 1px solid #e6e6e6;
        height: 45px;
        line-height: 45px;
    }
    .add{
        color: #336699;
        float: right;
        cursor: pointer;
        font-size: 14px;
        font-family: '微软雅黑';
        font-weight: normal;
    }
    .add:hover{
        font-weight: bold;
    }
    .accountList{
        display: inline-block;
        width: 100%;
        text-align: left;
        list-style:none;
        padding: 0;
        margin:0;
    }
    .accountList .pre{
        color: #ccc;
        width: 100%;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        display: flex;
        margin: 13px 0;
        
    } 
    .pre span{
        display: inline-block;
        width: 100px;
        height: 40px;
        text-align: right;
        font-size: 14px;
        cursor: pointer;
        color: #999999;
        font-size: '微软雅黑';
    }
    .pre label,.preDiv{
        color: #333333;
        font-size: '微软雅黑';
        display: inline-block;
        flex: 1;
        margin-left: 21px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .pre .imgedit,.pre .imgdelete{
        visibility:hidden;
        position: relative;
        top: 12px;
        margin-right: 22px;
        width: 16px ;
        height: 16px;

    }
    #pre{
        height: 100px;
    }
    #pre span{
        line-height: 20px;
    }
    .img{
        overflow-y: auto;
        margin-bottom: 40px;
    }
    .preDiv .imgDiv{
        width: 200px;
        height: 50px;
        display: inline-block;
        background: #f0f1f4;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .imgDiv{
        position: relative;
    }
    .imgDiv .imgMask{
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #999999;
        opacity:0.5;
        position: absolute;
        visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .hoverAdd{
        width: 20px;
        margin-right: 10px;
    }
    .preDiv .imgDiv:hover >.imgMask{
        visibility:visible;
    } 
    .logo{
        width: 139px;
        height: 42px;
    }
    .el-col{
        border: 1px solid #ccc;
    }
    .summary .pre:hover{
        background:#fff6f6;
    }
    .pre:hover .imgedit {
        visibility:visible;
    }
     .pre:hover .imgdelete{
        visibility:visible;
    }

    
    /*工程概况*/
    .summary .pre{
        display: flex;
    }
    .summary .pre span{
        width: 100px;
    }
    .summary .pre label{
        flex: 1;
    }
    .summary .pre i{
        width: 60px;
    }
    /*错误提示信息*/
    .err{
        width: 100%;
        text-align: left;
        color: red;
    }
    /*工程图片*/
    .imgUl{
        width:100%;
        height: 200px;
        list-style:none; 
        overflow: auto;
        padding: 0; 
        margin-top: 20px; 
        height: 400px;
    }
    .imgUl .imgLi{
        width: 200px;
        height: 145px;
        background: #f0f1f4;
        float: left;
        margin-right:20px;
        color: red;
        position: relative;
        text-align: center;
        cursor: pointer;
        margin-top: 20px;
    }
    .imgLi img{
        width: 200px;
        height: 145px;
    }
    .imgMaskD{
        width: 30px;
        height: 30px;
        margin: 0 auto;
        background: url('../../assets/updataImg.png')
    }
    .imgDMaskp{
        color: #ccc;
        margin: 5px; 
        font-size: 12px;
    }
    .imgUl .imgLi:hover .imgDMaskp{
        color: #df0010;
    }
    .imgUl .imgLi:hover .imgMaskD{
        background: url('../../assets/updataImg-hover.png')
    }
    .imgLi .imgD{
        position: absolute;
        width: 100%;
        height: 50%;
        margin: auto;
        top: 0;
        bottom: 0;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .imgLi:hover .imgBottom{
        visibility: visible;
    }
    .imgBottom{
        color: #999999;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
        text-align: left;
        visibility: hidden;
    }
    .imgBottom label{
        display: inline-block;
        width: 65px;
        cursor: pointer;
        margin-right: 15px;
    }
    .imgBottom label:hover{
        color: #fc3439;
    }
    .imgBottom label:hover .setAsLogo{
        background: url('../../assets/setAsLogo-hover.png');
    }
    .imgBottom span:hover .bottomDelete{
        background: url('../../assets/imgBottomDelete-hover.png');
    }
    .imgBottom span:hover{
        color: #336699;
    }
    .setAsLogo{
        width: 12px;
        height: 12px;
        display: inline-block;
        margin-right: 4px;
        background: url('../../assets/setAsLogo.png');
    }
    .bottomDelete{
        width: 12px;
        height: 12px;
        display: inline-block;
        margin-right: 4px;
        background: url('../../assets/imgBottomDelete.png');
        position: relative;
        top: 1px;
    }


    .imgicon {
        position: relative;
        top: 3px;
        margin-right: 12px;
    }
    .inp{
        width: 80%;
    }
    .groundSpan{
        color: #336699;
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
        float: right;
    }
    .groundEdit{
        display: inline-block;
        margin-right: 10px;
    }
    /*删除弹框*/
    .deleteDialogImg{
        height: 50px;
    }
    .deleteDialogWarning{
        font-size: 18px;
        font-family: 'MicrosoftYahei';
        color: #fc3439;
        font-weight: bold;
        margin:20px 0 0 0;
    }
    .deleteDialogText{
        color: #333333;
        font-size: 14px;
        font-family: 'MicrosoftYahei';
        font-weight: normal;
        margin: 10px 0 0 0;
    }
    
</style>
