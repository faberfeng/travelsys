<template>
    <div class="wrapper" id='in'>
        <h4 class="title"><span>工程初始配置</span></h4>
        <div class="account">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/project-id.png"/>工程账号 <span class="groundSpan" @click="retract"><img class="groundEdit"   :src="retractImg"/>{{retractText}}</span></h5>
            <ul class="accountList" >
                <li class="pre"><span>工程账号</span> <label>{{projectConfig.projectId}}</label></li>
                <li class="pre"><span>工程名称</span> <label>{{proName}}</label></li>
                <!-- <li class="pre"><span>工程管理账号</span> <label>{{projectConfig.projAdminEmail}}</label></li> -->
                <li class="pre" v-show="isShow"><span>工程创建者</span> <label>{{projectConfig.creater}}</label></li>
                 <li class="pre"><span>工程状态</span> <label>{{projectConfig.strStatus}}</label></li>
                
                <!-- <li class="pre" v-show="isShow"><span>授权用户数量</span> <label>{{projectConfig.projUserNum}}  {{projectUseCount}}个已使用</label></li>
                <li class="pre" v-show="isShow"><span>到期日期</span> <label>{{projectConfig.projExpireTime | toLocalD}}</label></li> -->
                <li class="pre " id="pre" v-show="isShow">
                    <span>工程logo</span> 
                    <div class="preDiv">
                        <div class="imgDiv" @click="updataNewImage">
                            <div class="imgMask"><img class="hoverAdd" src="../../assets/hover-add.png"  /><img  src="../../assets/updata-logo.png"  /></div>
                            <img v-if="projectImage" :src="BDMSUrlQRCode+projectImage" class="logo" style="width:200px;height:50px;"/>
                            </div>
                        <!-- <div style="margin:0;">
                            <el-checkbox @change="isAsDefault()" size="small" style="margin:0;width:115px;font-size:12px;" v-model="isAsdefault">使用默认logo</el-checkbox> 
                            <label style="margin-left:-10px;color:#999999;font-size:12px;">200*50px,jpg/png格式</label>
                        </div> -->
                    </div>
                </li>
                <!-- <li class="pre" id="preQRCode">
                    <span>加入工程二维码</span>
                    <div class="QRCode">
                        <img :src="BDMSUrlQRCode+'QRCode2/ApplyQr/'+projId+'/10/5'" style="width:155px;height:155px;"/>
                    </div>
                    <div class="QRCode1">
                         <div class="fulscreen" @click="fullSreen()"><img class="fulscreenImg" src="./images/fullSreen1.png">全屏</div>
                        <div class="downFile" @click="downQRCode()"><img class="downFileImg" src="./images/downFile1.png">下载</div>
                    </div>
                </li> -->
            </ul>
        </div>
        <div class="summary">
            <h5 class="accountTitle"><img class="imgicon" src="./images/editMenus.png"/>自定义菜单<span class="add" @click="addMenus"><i class="el-icon-plus"></i> 新增</span></h5>
            <ul class="accountList uniqueList" >
                <li class="pre" v-for=" (item,index) in menusInfoData" :key="index"><span>{{item.title}}</span> <label>{{item.url}}</label><img class="imgedit" @click="editMenus(index)" src="../../assets/edit.png"/><img v-if="item.status==1" @click="editStatus(index,0)" title="停用" class="imgdelete" src="./images/stop.png"/><img v-if="item.status==0" title="启用" @click="editStatus(index,1)" class="imgdelete" src="./images/start.png"/><img @click="delMenus(index)" class="imgdelete" src="../../assets/delete.png"/></li>
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
                <li v-if="projectImageList.length>0" class="imgLi" v-for="(item,index) in projectImageList" :key="index">
                    <div>
                        <img :src="BDMSUrlQRCode+item.path"/>
                    </div>
                    <div class="imgBottom"><label @click="setAsCover(index)"><div class="setAsLogo"></div><label style="width:80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.imgName}}</label></label><span @click="deleteImage(index)"><div class="bottomDelete"></div>删除</span></div>
                </li>
                <!--上传图片-->
                <li class="imgLi" @click='updataCoverImg'>
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
            <el-dialog width="400px" :visible.sync="fullSreenShow" @close="fullSreenCancle()">
                <div class="qrcodeBody">
                    <div>
                        <img :src="BDMSUrlQRCode+'QRCode2/ApplyQr/'+projId+'/18/9'" style="width:235px;height:235px;border-radius:4px;"/>
                    </div>
                    <div style="font-size:18px;color:#333333;margin-top:10px;">打开手机浏览器扫码申请加入</div>
                    <div style="font-size:16px;color:#999999;margin-top:10px;">{{projectName}}</div>
                    <div style="font-size:16px;color:#999999;margin-top:5px;">BIM协同管理平台</div>

                </div>
            </el-dialog>
            <el-dialog title="新增工程概况信息" :visible.sync="addDialog" @close="addCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">标题 :</label><input class="inp" placeholder="请输入" v-model="projectUnity"/></div>
                    <div class="editBodytwo"><label class="editInpText">取值 :</label><input class="inp" placeholder="请输入" v-model="projectName"/></div>
                </div>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMakeSure">确定</button>
                    <button class="editBtnC" @click="addCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="工程概况信息编辑" :visible.sync="editDialog" @close="editCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">标题 :</label><input class="inp" placeholder="请输入" v-model="projectUnity"/></div>
                    <div class="editBodytwo"><label class="editInpText">取值 :</label><input class="inp" placeholder="请输入" v-model="projectName"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editMakeSure">确定</button>
                    <button class="editBtnC" @click="editCancle">取消</button>
                </div>
            </el-dialog>
            <!-- 自定义菜单 -->
             <el-dialog title="新增自定义菜单信息" :visible.sync="addMenusDialog" @close="addMenusCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">标题 :</label><input class="inp" placeholder="请输入" v-model="menusTitle"/></div>
                    <div class="editBodytwo"><label class="editInpText">URL地址 :</label><input class="inp" placeholder="Https://" v-model="menusUrl"/></div>
                </div>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addMenusMakeSure">确定</button>
                    <button class="editBtnC" @click="addMenusCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="自定义菜单信息编辑" :visible.sync="editMenusDialog" @close="editMenusCancle">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">标题 :</label><input class="inp" placeholder="请输入" v-model="menusTitle"/></div>
                    <div class="editBodytwo"><label class="editInpText">URL地址 :</label><input class="inp" placeholder="请输入" v-model="menusUrl"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editMenusMakeSure">确定</button>
                    <button class="editBtnC" @click="editMenusCancle">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="图片上传" :visible.sync="upImg" @close="upImgCancle">
                <div class="editBody">
                    <div class="editBodytwo imageBody"><label class=" imageBodyText">上传图片 :</label>
                        <span class="updataImageSpan">
                            <button @click="selectImg" class="upImgBtn">选择图片</button>
                            <input class="upInput"  type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                        <span class="upImgText">{{imageName}}</span> 
                    </div>
                </div>
                <p class="err" v-show="showErr">请输入完整信息</p>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="upImgSure">上传</button>
                    <button class="editBtnC" @click="upImgCancle">取消</button>
                </div>
            </el-dialog>
        </div>
        <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前所选记录吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteDialog=false">取消</button>
                </div>
            </el-dialog>
            <el-dialog  :visible.sync="deleteMenusDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前所选记录吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMenusMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteMenusDialog=false">取消</button>
                </div>
            </el-dialog>
             <el-dialog  :visible.sync="changeStatusMenusDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">更改提醒</p>
                <p class="deleteDialogText" >您是否要{{statusText}}该菜单吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="changeStatusMenusMakeSure">确认</button>
                    <button class="cancelBtn" @click="changeStatusMenusDialog=false">取消</button>
                </div>
            </el-dialog>
            <el-dialog  :visible.sync="deleteImageVisiable" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">您要删除当前所选图片吗?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteImageSure">删除</button>
                    <button class="cancelBtn" @click="deleteImageVisiable=false">取消</button>
                </div>
            </el-dialog>
        </div>
        <!-- <div id="mask" v-if="fullSreenShow" ></div> -->
        
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
            //自定义菜单信息
            addMenusDialog:false,
            editMenusDialog:false,
            deleteMenusDialog:false,
            menusIndex:'',
            statusIndex:'',
            statusNum:'',
            changeStatusMenusDialog:false,
            statusText:'',
            NotdeleteDialog:false,
            showErr:false,
            upImg:false,
            isAsdefault:false,
            projectUnity:'',
            projectName:'',
            menusTitle:'',//自定义菜单名称
            menusUrl:'',//自定义菜单地址
            menusStatus:'',//自定义菜单状态
            BDMSUrl:'',
            retractImg:shouqiImg,
            retractText:'收起',
            isShow:true,
            imageName:'未选择任何图片',
            imageType:'',
            filesList:[],
            token:'',
            projId:'',
            sumaryData:[],//工程概况信息列表
            menusInfoData:[],//自定义菜单信息
            //unity=>viewKey viewVal=>viewVal
            index:'',
            projectConfig:{},
            proName:'',
            projectUseCount:'',
            projectImage:null,
            projectImageList:[],//获取工程图片列表
            firstCoverImg:[],//封面图片
            header:{
                userName:'',
                userId:'', 
                projectName:'华建Q系列工程协同应用系统',
                projectImg:'',
            }, 
            deleteImageVisiable:false,
            deleteImageIndex:'',
            userId:'',
            QJFileManageSystemURL:'',
            projectLogoConfig:{},
            fullSreenShow:false,
            projectName:'',
        }
    },
    created(){
       // var vm = this;
        this.QJFileManageSystemURL=this.$store.state.QJFileManageSystemURL;
        this.BDMSUrl = this.$store.state.BDMSUrl+'api/v1/main/main/';
        this.BDMSUrlQRCode=this.$store.state.BDMSUrl
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userid');
        this.projId = localStorage.getItem('projId');
        // this.projectName = localStorage.getItem('projectName');
        this.getMenusInfo();//获取自定义菜单信息
        this.getBasicSituation();//获取工程概况
        this.getProjectInitalConfig();//工程初始信息
        this.getProjectImageList();//获取工程图片列表
        this.findProjectLogo();//获取工程logo列表
    },
    filters:{
        toLocalD(val){
            return new Date(val).toLocaleString();
        }
    },
    methods:{
        //下载二维码
        downQRCode(){
            var vm=this;
            window.open(vm.BDMSUrlQRCode+'QRCode2/ApplyQr/'+vm.projId+'/32/15');
        },
        //全屏
        fullSreen(){
            var vm=this;
            vm.fullSreenShow=true;
        },
        fullSreenCancle(){
            var vm=this;
            vm.fullSreenShow=false;
        },
        //增加自定义菜单
        addMenus(){
            
            if(this.menusInfoData.length>=3){
                this.$message({
                    type:'info',
                    message:'最多可扩展3个自定义菜单'
                })
            }else{
                this.addMenusDialog = true;
            }
        },
        add(){
            this.addDialog = true;
        },
        addMakeSure(){
            if(this.projectUnity ==''|| this.projectName ==''){
                alert('请输入标题或取值');
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrlQRCode+'api/v1/main/saveProjectOverview',
                    // url:'http://10.252.26.117:8080/bdms_war_exploded/api/v1/main/saveProjectOverview',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    data:{
                        // id:null,
                        projId:localStorage.getItem('projId'),
                        viewKey:this.projectUnity,
                        viewVal:this.projectName
                    }
                }).then((response)=>{
                    if(response.data.cd==='0'){
                        this.getBasicSituation();
                        this.projectUnity='';
                        this.projectName='';
                        this.addDialog = false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                });
            }
        },
        //增加自定义菜单确认
        addMenusMakeSure(){
            if(this.menusTitle ==''|| this.menusUrl ==''){
                alert('请输入标题或URL地址');
            }else{
                axios({
                    method:'get',
                    url:this.BDMSUrlQRCode+'api/v1/main/addCustomMenu',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    params:{
                        projectId:localStorage.getItem('projId'),
                        url:this.menusUrl,
                        title:this.menusTitle
                    }
                }).then((response)=>{
                    if(response.data.cd==='0'){
                        this.getMenusInfo();
                        this.menusUrl='';
                        this.menusTitle='';
                        this.addMenusDialog = false;
                        // window.location.reload(true);
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                });
            }
        },
        //删除自定义菜单
        delMenus(index){
            this.menusIndex = index;
            this.deleteMenusDialog =true;
        },
        deleteMenusMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrlQRCode+"api/v1/main/deleteCustomMenu",
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.menusInfoData[this.menusIndex].id
                }
            }).then((response)=>{
                if(response.data.cd === '0'){
                    this.getMenusInfo();
                    this.deleteMenusDialog = false;
                    // window.location.reload(true);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        del(index){
            this.index = index;
            this.deleteDialog = true;
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrlQRCode+"api/v1/main/delProjectOverview",
                headers:{
                    'token':this.token
                },
                params:{
                    id:this.sumaryData[this.index].id
                }
            }).then((response)=>{
                if(response.data.cd === '0'){
                    this.getBasicSituation();
                    this.deleteDialog = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        editMenus(index){
            this.editMenusDialog=true;
            this.menusIndex =index;
            this.menusTitle = this.menusInfoData[index].title;
            this.menusUrl =this.menusInfoData[index].url;
            this.menusStatus =this.menusInfoData[index].status;
        },
        editMenusMakeSure(){
            if(this.menusTitle ==''|| this.menusUrl ==''){
                alert('请输入标题或URL地址');
            }else{
                axios({
                    method:'get',
                    url:this.BDMSUrlQRCode+'api/v1/main/editCustomMenu',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    params:{
                        projectId:localStorage.getItem('projId'),
                        id:this.menusInfoData[this.menusIndex].id,
                        url:this.menusUrl,
                        title:this.menusTitle,
                        status:this.menusStatus,
                    }
                }).then((response)=>{
                    if(response.data.cd==='0'){
                        this.getMenusInfo();
                        this.menusUrl='';
                        this.menusTitle='';
                        this.menusStatus='';
                        this.editMenusDialog = false;
                        // window.location.reload(true);
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                });
            }
        },

        editStatus(index,statusNum){
            this.statusIndex=index;
            this.statusNum=statusNum;
            if(statusNum==0){
                this.statusText='停用'
            }else if(statusNum==1){
                this.statusText='启用'
            }
            this.changeStatusMenusDialog=true;
            
        },
        changeStatusMenusMakeSure(){
             axios({
                    method:'get',
                    url:this.BDMSUrlQRCode+'config2/component/editCustomMenu',
                    headers:{
                        'token':this.token,
                        "Content-Type": "application/json"
                    },
                    params:{
                        projectId:localStorage.getItem('projId'),
                        id:this.menusInfoData[this.statusIndex].id,
                        url:this.menusInfoData[this.statusIndex].url,
                        title:this.menusInfoData[this.statusIndex].title,
                        status:this.statusNum,
                    }
                }).then((response)=>{
                    if(response.data.cd==='0'){
                        this.getMenusInfo();
                        // window.location.reload(true);
                        this.changeStatusMenusDialog=false;
                    }else if(response.data.cd  == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                });

        },
        edit(index){
            this.editDialog = true;
            this.index = index;
            this.projectUnity = this.sumaryData[index].viewKey;
            this.projectName = this.sumaryData[index].viewVal;
        },
        editMakeSure(){
            if(this.projectUnity =='' ||  this.projectName ==''){
                alert('请输入标题或取值');
            }else{
                axios({
                    method:'post',
                    url:this.BDMSUrlQRCode+'api/v1/main/saveProjectOverview',
                    headers:{
                        'token':this.token,
                    },
                    data:{
                        id:this.sumaryData[this.index].id,
                        projId:this.sumaryData[this.index].projId,
                        viewKey:this.projectUnity,
                        viewVal:this.projectName
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getBasicSituation();
                        this.projectUnity='';
                        this.projectName='';
                        this.editDialog = false;
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg);
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                }); 
            }
        },
        //上传新logo
        updataNewImage(){
            this.imageType = 1;
            this.upImg = true;
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
        //删除图片
        deleteImage(index){
            this.deleteImageIndex = index;
            this.deleteImageVisiable = true;
            
        },
        //确认删除
        deleteImageSure(){
            var vm=this;
            axios({
                method:'get',
                url:vm.BDMSUrlQRCode+'api/v1/main/deleteProjectImage',
                headers:{
                    'token':this.token
                },
                params:{
                    // projId:this.projId,
                    id:this.projectImageList[this.deleteImageIndex].id,
                    // fileId:this.projectImageList[this.deleteImageIndex].fileId,
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.deleteImageVisiable = false;
                    this.getProjectImageList();
                }else if(response.data.cd == '-1'){
                    alert(response.data.cd)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        getBasicSituation(){
            var url = this.BDMSUrl+''+this.projId+'/overview/list';
            axios({
                method:'GET',
                url:url,
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.sumaryData = response.data.rt;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })

        },
        //获取自定义菜单信息
        getMenusInfo(){
            axios({
                method:'GET',
                url:this.BDMSUrlQRCode+'api/v1/main/getCustomMenu',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.menusInfoData = response.data.rt;
                    
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },

        //获取工程初始信息
        getProjectInitalConfig(){
            axios({
                method:'get',
                url:this.BDMSUrlQRCode+'api/v1/main/index',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.projectConfig = response.data.rt.project;
                    // this.$store.commit('changeProjectLogo',{
                    //     // projectImg:response.data.rt.projectImage?response.data.rt.image[0].filePath:''
                    //     projectImg:response.data.rt.image[0]
                    // })
                    //  this.projectImage = response.data.rt.image[0];
                     this.proName=this.projectConfig.projectName;
                    // this.projectLogoConfig = response.data.rt.projectConfig;
                    // this.isAsdefault = response.data.rt.projectConfig.confVal;
                    if(this.isAsdefault == 'true'){
                        this.isAsdefault = true;
                    }else{
                        this.isAsdefault = false;
                    }
                    
                    // this.projectUseCount = response.data.rt.projectUserCount;
                   
                    // console.log(this.projectImage);
                }else if(response.data.cd === '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //获取工程logo
        findProjectLogo(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'findProjectLogo',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                     this.$store.commit('changeProjectLogo',{
                        // projectImg:response.data.rt.projectImage?response.data.rt.image[0].filePath:''
                        projectImg:this.BDMSUrlQRCode+response.data.rt.path
                    })
                    this.isAsdefault = false;
                    if(this.isAsdefault){
                        this.$store.commit('switchLogo',{
                            isDefaultLogo:false
                        })
                    }else{
                        this.$store.commit('switchLogo',{
                            isDefaultLogo:true
                        })
                    }
                    // if(this.isAsdefault == 'true'){
                    //     this.isAsdefault = true;
                    // }else{
                    //     this.isAsdefault = false;
                    // }
                    this.projectImage =response.data.rt.path;
                }else{
                     console.log(this.projectImage,'this.projectImage');
                }
            })
        },
        //获取工程图片
        getProjectImageList(){
            axios({
                method:'get',
                url:this.BDMSUrl+'findProjectImage',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    if(response.data.rt){
                        this.projectImageList = response.data.rt;
                        this.projectImageList.forEach((item,index,arr)=>{
                            if(item.imgType == '2'){
                                arr[index].text = '设为封面';
                            }else{
                                arr[index].text = '封面'
                            }
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //设为封面
        setAsCover(number){
            axios({
                method:'get',
                url:this.BDMSUrlQRCode+'api/v1/main/setCover',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    id:this.projectImageList[number].id
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.$message({
                        type:"success",
                        message:'设置成功'
                    })
                    // alert('设置成功')
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }).then(()=>{
                this.getProjectImageList();
            })
        },
        //上传图片
        updataCoverImg(){
            this.upImg = true;
            this.imageType = 2;
        },
        upImgSure(){
            // let returnUrl = this.BDMSUrl+'/uploadImage?imageType='+this.imageType;
            // returnUrl = encodeURIComponent(returnUrl);
            let formData = new FormData();
            // formData.append('projId',this.projId);
            // formData.append('type','1');
            // formData.append('userId',this.userId);
            // formData.append('modelCode','001');
            // formData.append('returnUrl',returnUrl)
            // formData.append('token',this.token);
            formData.append('file',this.filesList[0]);
            var vm=this;
            axios({
                method:'post',
                url:vm.BDMSUrlQRCode+'api/v1/main/dcUpload',
                headers:{
                    'token':vm.token
                },
                data:formData,
                params:{
                    type:this.imageType,
                    projId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getProjectImageList();
                    this.findProjectLogo();
                    this.upImg = false;
                    this.imageName = '未选择任何图片';
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }
            })
            // axios({
            //     method:'post',
            //     url:this.QJFileManageSystemURL + 'uploading/uploadFileInfo',
            //     headers:{
            //         'Content-Type': 'multipart/form-data'
            //     },
            //     data:formData
            // }).then(response=>{
            //     if(response.data.cd== '0'){
            //         this.getProjectImageList();
            //         this.getProjectInitalConfig();
            //         this.upImg = false;
            //         this.imageName = '未选择任何图片';
            //     }else if(response.data.cd == '-1'){
            //         alert(response.data.msg)
            //     }else{
            //         this.$router.push({
            //             path:'/login'
            //         })
            //     }
            // })
        },

        upImgCancle(){
            this.upImg = false;
        },
        //选择图片
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            const list = this.$refs.file.files;
            this.imageName = list[0].name;
            this.filesList = list;
        },
        //是否为默认图片
        isAsDefault(){ 
            if(this.isAsdefault){
                this.$store.commit('switchLogo',{
                    isDefaultLogo:false
                })
            }else{
                this.$store.commit('switchLogo',{
                    isDefaultLogo:true
                })
            }
            axios({
                method:'post',
                url:this.BDMSUrl+'useDefaultLogo',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    confValue:this.isAsdefault
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                }else {
                    alert(response.data.msg)
                }
            })
        },
        //弹窗关闭
        addCancle(){
            this.addDialog = false;
            this.projectUnity = '';
            this.projectName ='';
        },
        editCancle(){
            this.editDialog = false;
            this.projectUnity = '';
            this.projectName ='';
        },
        //自定义弹窗关闭
        addMenusCancle(){
            this.addMenusDialog = false;
        },
        editMenusCancle(){
            this.editMenusDialog = false;
        },

    }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
        display: block;
        height: 800px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .title{
        font-weight: bold;
        border-bottom:1px solid #ccc; 
        margin: 0px 20px 0 0px ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        margin-left: 15px;
        color: #fc343a;
        font-size: 18px;
        line-height: 18px;
        margin: 22px 0 11px 15px;
    }
    .account,.summary,.img{
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
        min-width: 100px;
        height: 40px;
        text-align: right;
        font-size: 14px;
        cursor: pointer;
        color: #999999;
    }
    .pre label,.preDiv{
        color: #333333;
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
    .pre .QRCode{
         width: 100%;
         height: 150px;
         margin-left: 21px;
        margin-top:10px;
        /* display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center; */
    }
    .pre .QRCode1{
        /* width: 100%;
        height: 50px;
        margin-left: 21px;
        margin-top:10px; */
        /* float: left; */
        position: absolute;
        left:124px;
        bottom: -22px;
    }
    .pre .QRCode1 .fulscreen{
        color:#fc3439;
        font-size:12px;
        font-weight: normal;
        cursor: pointer;
        display: inline-block;
        width: 80px;
    }
    .pre .QRCode1 .fulscreen .fulscreenImg{
        margin-top:10px;
    }

    .pre .QRCode1 .downFile{
         color:#336699;
        font-size:12px;
        font-weight: normal;
        cursor: pointer;
        display: inline-block;
        width: 78px;
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
    #preQRCode{
        height: 160px;
        position: relative;
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
    /* .summary .pre span{
        width: 100px;
    } */
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
        line-height: 18px;
        font-family: 'MicrosoftYahei';
        color: #fc3439;
        font-weight: bold;
        margin:20px 0 0 0;
    }
    .deleteDialogText{
        color: #333333;
        font-size: 14px;
        line-height: 14px;
        font-family: 'MicrosoftYahei';
        font-weight: normal;
        margin: 16px 0 0 0;
    }
    /* 上传文件按钮 */
    #edit .imageBody{
       text-align: left;
    }
    #edit .qrcodeBody{
        height: 420px;

    }
    .imageBody .imageBodyText{
        color: #666;
        font-size: 14px;
        line-height: 14px;
        font-weight: normal;
        display: inline-block;
        margin-right: 20px;
        margin-left: 94px;
        text-align: right;
   }
   .updataImageSpan{
        overflow: hidden;
        width: 98px;
    }
    .updataImageSpan input{
        position: absolute;
        left: 0px;
        top: 0px;
        opacity: 0;
        /* -ms-filter: 'alpha(opacity=0)'; */
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
</style>
