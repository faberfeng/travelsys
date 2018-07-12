<template>
  <div class="wrapper" id="groundSetting">
      <h4 class="title"><span>场地与单体配置</span></h4>
      <div class="main">
        <div class="groundInfo groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-info.png"/>场地信息<span :class="[{'groundEdit-active':!canEdit},'groundEdit']" @click="groundInfoEdit"></span></h5>
            <div :class="[{'groundInfoInp-active':!canEdit},'groundInfoInp']">
                <ul>
                    <li><label>城市坐标系名称</label><el-input v-model="groundInfo.pointName" :disabled="canEdit" class="sInp"></el-input></li>
                    <li>
                        <label>场地原点</label>
                        <div>
                            <el-input v-model="groundInfo.pointX" :disabled="canEdit" class="sInp icon-X" placeholder="0.0"></el-input> 
                        </div>
                        <div>
                            <el-input v-model="groundInfo.pointY"  :disabled="canEdit" class="sInp spe icon-Y" placeholder="0.0"></el-input>
                        </div>
                        <label style="width:95px;">场地高程</label>
                        <div>
                            <el-input v-model="groundInfo.heightZ" :disabled="canEdit" class="icon-Z" placeholder="0.0"></el-input>    
                        </div>
                    </li>
                    <li>
                        <label>工程规模</label>
                        <div>
                            <el-input v-model="groundInfo.projectScale" class="scale icon-size" :disabled="canEdit" ></el-input>
                        </div>
                    </li>                
                </ul>
                <p v-show="!canEdit"><el-button @click="saveEdit" class="btn btn-save" type="primary">保存</el-button><el-button class="btn btn-cancle" @click="groundInfoEdit">取消</el-button></p>
            </div>
        </div>
        <div class="groundSetting groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-setting.png"/>场景设置
                 <span :class="[{'groundEdit-active':!canEditCj},'groundEdit']" @click="groundInfoEditCJ"></span>
            </h5>
            <div  :class="[{'groundInfoInp-active':!canEditCj},'groundSettingBody']">
                <div class="groundSettingBodyS">
                    <p class="firstP">
                        <label>效果等级</label>
                        <el-select v-model="SceneEnvironmentList.EffectLevel" class="elSelect" :disabled="sureToGroundSettings">
                            <el-option v-for="(item,index) in effectLevel" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </p>
                    <p>
                        <label>场景事件</label>
                        <el-select v-model="SceneEnvironmentList.SceneTime" :disabled="sureToGroundSettings">
                            <el-option v-for="(item,index) in groundThing" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </p>
                </div>
                <div class="groundSettingBodyP">
                    <label>整体亮度</label><div><el-slider :disabled="sureToGroundSettings" class="slider_P" v-model="SceneEnvironmentList.Brightness"></el-slider></div>
                </div>
                <div class="groundSettingBodyC">
                    <el-checkbox :disabled="sureToGroundSettings" v-model="SceneEnvironmentList.showSky">显示天空</el-checkbox>
                </div>
                <p v-show="!canEditCj" style="margin-bottom:-6px;"><el-button @click="saveEditCJ" class="btn btn-save" type="primary">保存</el-button><el-button class="btn btn-cancle" @click="groundInfoEditCJ">取消</el-button></p>
            </div>
        </div>
        <div class="singleList groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/single-list.png"/>单体列表<span @click="updateList" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="listData" style="width:100%">
                    <el-table-column prop="index" label="序号"></el-table-column>
                    <el-table-column prop="Name" label="单体名称"></el-table-column>
                    <el-table-column prop="Origin" label="轴网基点坐标"></el-table-column>
                    <el-table-column prop="OriginHeight" label="首层相对高度"></el-table-column>
                    <el-table-column prop="AxisAngle" label="轴网转角"></el-table-column>
                    <el-table-column prop="action" label="操作" width="150">
                        <template slot-scope="scope" >
                            <div class="iconDiv1 iconDiv"  @click="listTableEdit(scope)" ><img  class="iconImg editIcon"  src="../../assets/edit.png"/></div>
                            <div class="iconDiv2 iconDiv"  @click="deleteListRow(scope)" ><img class="iconImg"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="groundSource groundTitle" style="margin-bottom:30px;">
           <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-resource.png"/>场地资源包<span @click="addSource" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="unityData" style="width:100%">
                    <el-table-column prop="index" label="序号"></el-table-column>
                    <el-table-column prop="FileName" label="资源包名称"></el-table-column>
                    <el-table-column prop="ResourceType" label="资源类型"></el-table-column>
                    <el-table-column prop="ResourceName" label="资源名称"></el-table-column>
                    <el-table-column prop="FileSize" label="资源包大小"></el-table-column>
                    <el-table-column prop="UpdateTime" label="上传时间"></el-table-column>
                    <el-table-column prop="FileVersion" label="版本"></el-table-column>
                    <el-table-column prop="Comments" label="备注"></el-table-column>
                    <el-table-column prop="Loaded" label="当前状态"></el-table-column>
                    <el-table-column prop="groundAction" label="操作">
                        <template slot-scope="scope" >
                            <div class="iconDiv" @click="groundTableUninstall(scope)"><img  :alt="loadState?'加载资源':'卸载资源'" class="iconImg editIcon" src="../../assets/recircle.png"/></div>
                            <div class="iconDiv" @click="groundTableEdit(scope)"><img  class="iconImg editIcon"  src="../../assets/info.png"/></div>
                            <div class="iconDiv" @click="deleteTableRow(scope)"><img  class="iconImg editIcon"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagenation">   
                    <el-pagination background layout="prev, pager, next" :total="unityData.length"></el-pagination>
                </div>
            </div>
        </div>
        </div>
        <!--dialog-->
        <div id="edit">
            <el-dialog title="新增单体列表" :visible.sync="addListShow" :before-close="addListClose">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">单体名称 :</label><input class="inp" placeholder="请输入" v-model="addListname"/></div>
                    <div class="editBodytwo"><label class="editInpText">轴网基点坐标 :</label><input class="inp" placeholder="请输入数字(例:0 0)" v-model="addListcoordinate"/></div>
                    <div class="editBodytwo"><label class="editInpText">首层相对高度 :</label><input class="inp" placeholder="请输入数字(单位 m)"  v-model="addListhigh"/></div>
                    <div class="editBodytwo"><label class="editInpText">轴网转角 :</label><input class="inp" placeholder="请输入数字(正北为0°，逆时针计)" v-model="addListangle"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addListSure">确定</button>
                    <button class="editBtnC" @click="addListClose">取消</button>
                </div>
            </el-dialog>
            <el-dialog title="修改单体列表" :visible.sync="editListShow" :before-close="editListClose">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">单体名称 :</label><input class="inp" placeholder="请输入" v-model="addListname"/></div>
                    <div class="editBodytwo"><label class="editInpText">轴网基点坐标 :</label><input class="inp" placeholder="请输入" v-model="addListcoordinate"/></div>
                    <div class="editBodytwo"><label class="editInpText">首层相对高度 :</label><input class="inp" placeholder="请输入" v-model="addListhigh"/></div>
                    <div class="editBodytwo"><label class="editInpText">轴网转角 :</label><input class="inp" placeholder="请输入" v-model="addListangle"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editListSure">确定</button>
                    <button class="editBtnC" @click="editListClose">取消</button>
                </div>
            </el-dialog>
            <!-- 删除资源包 -->
            <el-dialog title="删除资源" :visible.sync="deleteUnityBundle" :before-close="deleteUnityClose">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">名称 :</label><input class="inp" disabled v-model="unityName"/></div>
                    <div class="editBodytwo"><label class="editInpText">场地 :</label><input class="inp" disabled v-model="unityGround"/></div>
                    <div class="editBodytwo"><label class="editInpText">备注 :</label><input class="inp" disabled v-model="unityRemark"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="deleteUnitySure">确定</button>
                    <button class="editBtnC" @click="deleteUnityClose">取消</button>
                </div>
            </el-dialog>
            <!-- 卸载资源包 -->
            <el-dialog :title="loadState?'加载资源':'卸载资源'" :visible.sync="uninstallUnityBundle" :before-close="deleteUnityClose">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">名称 :</label><input class="inp" disabled v-model="unityName"/></div>
                    <div class="editBodytwo"><label class="editInpText">场地 :</label><input class="inp" disabled v-model="unityGround"/></div>
                    <div class="editBodytwo"><label class="editInpText">备注 :</label><input class="inp" disabled v-model="unityRemark"/></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="uninstallUnityBundleSure">卸载</button>
                    <button class="editBtnC" @click="uninstallUnityBundleClose">取消</button>
                </div>
            </el-dialog>
            <!-- 资源包属性编辑 -->
            <el-dialog title="资源包属性编辑" :visible.sync="editUnityBundleProperty" :before-close="editUnityBundlePropertyClose">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText">资源包名 :</label><span>{{fileName}}</span>
                        <label class="editInpText">资源大小 :</label><span>{{fileName}}</span>
                    </div>
                    <div class="editBodytwo"><label class="editInpText">资源名称 :</label><input class="inp" v-model="editUnityName"/></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">发布平台 :</label>
                        <select  class="editSelect" v-model="platform" >
                            <option >Web</option>
                            <option >Android</option>
                            <option >iOS</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">单体外皮 :</label>
                        <select  class="editSelect" v-model="bundlesrface" >
                            <option v-for="(item,index) in editUnityPropertyData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo"><label class="editInpText">资源备注 :</label><input class="inp" v-model="editUnityRemark"/></div>
                    <div class="editBodytwo"><label class="editInpText"></label><el-checkbox v-model="isLoading">加载</el-checkbox></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editUnityBundlePropertySure">添加</button>
                    <button class="editBtnC" @click="editUnityBundlePropertyClose">取消</button>
                </div>
            </el-dialog>
            <!--新增资源包弹窗-->
            <el-dialog title="上传文件" :visible.sync="addgroundShow" :before-close="groundClose">
                <div class="editBody">
                    <div class="editBodytwo imageBody"><label class=" imageBodyText">上传文件 :</label>
                        <span class="updataImageSpan">
                            <button @click="selectImg" class="upImgBtn">选择文件</button>
                            <input class="upInput"  type="file"  @change="fileChanged" ref="file" multiple="multiple">
                        </span>
                        <span class="upImgText">{{fileName}}</span> 
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addGroundSure">上传</button>
                    <button class="editBtnC" @click="groundClose">取消</button>
                </div>
            </el-dialog>
            <!-- 修改场地资源包 -->
            <el-dialog title="修改场地资源包" :visible.sync="editgroundShow" :before-close="editGroundClose">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText">资源包名 :</label><span>{{resourceName}}</span>
                        <label class="editInpText">资源大小 :</label><span>{{resourceSize}}</span>
                    </div>
                    <div class="editBodytwo"><label class="editInpText">资源名称 :</label><input class="inp" v-model="editUnityName"/></div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">发布平台 :</label>
                        <select  class="editSelect" v-model="platform" >
                            <option >Web</option>
                            <option >Android</option>
                            <option >iOS</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo edit-item clearfix"><label class="editInpText">单体外皮 :</label>
                        <select  class="editSelect" v-model="bundlesrface" >
                            <option v-for="(item,index) in editUnityPropertyData" :key="index">{{item}}</option>
                        </select>
                        <i class="icon-sanjiao"></i>
                    </div>
                    <div class="editBodytwo"><label class="editInpText">资源备注 :</label><input class="inp" v-model="editUnityRemark"/></div>
                    <div class="editBodytwo"><label class="editInpText"></label><el-checkbox v-model="isLoading">加载</el-checkbox></div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editGroundSure">确 定</el-button>
                    <el-button @click="editGroundClose">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <!--删除提醒-->
        <div id="inital">
            <el-dialog  :visible.sync="deleteListDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除【{{deleProject}}】?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteListDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name:'GroundSettings',
  data(){
      return {
          value1:0,
          checked:false,
          canEdit:true,
          canEditCj:true,
          addListShow:false,
          addgroundShow:false,
          editgroundShow:false,
          editListShow:false,
          sureToGroundSettings:true,
          addListindex:'',
          addListname:'',
          addListcoordinate:'',
          addListhigh:'',
          addListangle:'',
          listIndexNumber:'',
          groundIndexNumber:'',
          value: '',
          groundIndex:'',
          groundName:'',
          groundCategroy:'',
          groundSourceName:'',
          groundSourceSize:'',
          groundVersion:'',
          groundRemark:'',
          deleteListDialog:false,
          groundState:'',
          effectLevel:[{
              value:'好',
              label:'好'
            },{
                value:'很好',
                label:'很好'
            },{
                value:'最好',
                laebl:'最好'
            }
          ],
          groundThing: [{
                value: '早晨',
                label: '早晨'
            }, {
                value: '上午',
                label: '上午'
            },{
                value: '中午',
                label: '中午'
            },{
                value: '下午',
                label: '下午'
            },{
                value: '傍晚',
                label: '傍晚'
            }],
            listData:[],
            baseUrl:'http://10.252.26.240:8080/',
            token:'',
            projId:'',
            effectLevelVal:'很好',//效果等级值
            groundThingVal:'早晨',//场景事件值
            groundInfo:{},//场地信息
            SceneEnvironmentList:{},//场景设置
            deleProject:'',
            deleteListObject:{},
            unityData:[],//场地资源包
            fileName:'未选择任何文件',
            filesList:[],
            fileUpdataPath:'',
            userId:'',
            deleteUnityBundle:false,
            unityGround:'',
            unityName:'',
            unityRemark:'',
            unityBundleSource:{},
            editUnityBundleProperty:false,//编辑资源包属性
            bundlesrface:'【不关联任何单体】',
            editUnityPropertyData:['【不关联任何单体】'],
            platform:'Web',
            isLoading:false,
            editUnityName:'',
            editUnityRemark:'',
            uninstallUnityBundle:false,
            unInstallData:{},
            loadState:false,
            resourceSize:'',
            resourceName:'',
            editGorundData:{}
        }
    },
    created(){
        this.fileUpdataPath = this.$store.state.QJFileManageSystemURL;
        this.userId = localStorage.getItem('userid')
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getGroundInformation();//场地信息
        this.getSceneEnvironment();//场景设置
        this.findSubProject();//获取单体列表 表格
    },
    methods:{
        groundInfoEdit(){
            this.canEdit = this.canEdit?false:true;
        },
        //保存场地信息
        saveEdit(){
            axios({
                method:'post',
                url:this.baseUrl+'/h2-bim-project/project2/Config/saveSite',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    heightZ:this.groundInfo.heightZ,
                    pointName:this.groundInfo.pointName,
                    pointX:this.groundInfo.pointX,
                    pointY:this.groundInfo.pointY,
                    projectScale:this.groundInfo.projectScale
                }
            }).then((response)=>{
                if(response.data.cd === '0'){
                    this.getGroundInformation();
                    this.canEdit = true;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
         groundInfoEditCJ(){
            this.canEditCj = this.canEditCj?false:true;
            if(this.sureToGroundSettings){
                this.sureToGroundSettings = false;
            }else{
                this.sureToGroundSettings = true;
            }
        },
        saveEditCJ(){
            if(this.SceneEnvironmentList.EffectLevel==='好'){
                this.SceneEnvironmentList.EffectLevel=0;
            }else if(this.SceneEnvironmentList.EffectLevel=='很好'){
                this.SceneEnvironmentList.EffectLevel=1;
            }else if(this.SceneEnvironmentList.EffectLevel=='最好'){
                this.SceneEnvironmentList.EffectLevel=2;
            };
            if(this.SceneEnvironmentList.SceneTime=='早晨'){
                this.SceneEnvironmentList.SceneTime=0;
            }else if(this.SceneEnvironmentList.SceneTime=='上午'){
                this.SceneEnvironmentList.SceneTime=1;
            }else if(this.SceneEnvironmentList.SceneTime=='中午'){
                this.SceneEnvironmentList.SceneTime=2;
            }else if(this.SceneEnvironmentList.SceneTime=='下午'){
                this.SceneEnvironmentList.SceneTime=3;
            }else if(this.SceneEnvironmentList.SceneTime=='傍晚'){
                this.SceneEnvironmentList.SceneTime=4;
            }
            axios({
                method:'post',
                url:this.baseUrl+'h2-bim-project/project2/Config/setSceneEnvironment',
                headers:{
                    'token':this.token
                },
                data:{
                    Brightness:this.SceneEnvironmentList.Brightness,
                    EffectLevel:this.SceneEnvironmentList.EffectLevel,
                    IsshowSky:this.SceneEnvironmentList.IsshowSky,
                    SceneTime:this.SceneEnvironmentList.SceneTime,
                    SkyType:this.SceneEnvironmentList.SkyType,
                    showSky:this.SceneEnvironmentList.showSky
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.canEditCj = true;
                    this.sureToGroundSettings = true;
                    this.getSceneEnvironment()
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        addList(){
            this.addListShow = true;
        },
        //新增单体列表子项
        updateList(){
            this.addListShow = true;
        },
        //确认新增单体列表子项
        addListSure(){
            var reg = new RegExp("^[0-9]*$");
            if(this.addListhigh != '' && !isNaN(this.addListhigh) && this.addListangle != '' &&  !isNaN(this.addListangle) && this.addListname != ''){
                if(this.addListcoordinate.split(' ').length == 2 && !isNaN(this.addListcoordinate.split(' ')[0])  && !isNaN(this.addListcoordinate.split(' ')[1])){
                    axios({
                        method:'post',
                        url:this.baseUrl+'h2-bim-project/project2/Config/updateSubProject',
                        headers:{
                            'token':this.token
                        },
                        params:{
                            projId:this.projId
                        },
                        data:{
                            AxisAngle:this.addListangle,
                            Name:this.addListname,
                            Origin:this.addListcoordinate,
                            OriginHeight:this.addListhigh,
                            UseCS:0
                        }
                    }).then((response)=>{
                        if(response.data.cd == '0'){
                            this.findSubProject();
                            this.addListname = '';
                            this.addListcoordinate='';
                            this.addListhigh='';
                            this.addListangle='';
                            this.addListShow = false;
                        }else if(response.data.cd ='-1'){
                            alert(response.data.msg);
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
                }else{
                    alert('警告! 轴网基点坐标取基点 X\Y 值被一个空格分隔!')
                }
                
            }else{
                alert('请正确输入表单')
            } 
        },
        //取消新增按钮
        addListClose(){
            this.addListname = '';
            this.addListcoordinate='';
            this.addListhigh='';
            this.addListangle='';
            this.addListShow = false;
        },
        //修改单体列表的信息
        listTableEdit(index){
            this.listIndexNumber = index.$index;
            this.addListindex = this.listData[this.listIndexNumber].index,
            this.addListname = this.listData[this.listIndexNumber].Name;
            this.addListcoordinate = this.listData[this.listIndexNumber].Origin,
            this.addListhigh = this.listData[this.listIndexNumber].OriginHeight;
            this.addListangle = this.listData[this.listIndexNumber].AxisAngle;
            this.editListShow = true;
        },
        //确认修改单体列表子项
        editListSure(){
            if(this.addListname === ''){
                alert('单体名称不能为空!');
            }else{
                if(this.addListhigh === '' || isNaN(this.addListhigh)){
                    alert('首层相对高度不能为空且为数字!');
                }else{
                    if(this.addListangle === '' || isNaN(this.addListangle)){
                        alert('轴网转角不能为空且为数字!');
                    }else{
                        if(this.addListcoordinate === ''){
                            alert('警告!轴网基点坐标不能为空!')
                        }else{
                            if(this.addListcoordinate.split(' ').length != 2 || isNaN(this.addListcoordinate.split(' ')[0])  || isNaN(this.addListcoordinate.split(' ')[1])){
                                alert('轴网基点坐标取基点 X\Y 值被一个空格分隔!')
                            }else{
                                axios({
                                    method:'post',
                                    url:this.baseUrl+'h2-bim-project/project2/Config/updateSubProject',
                                    headers:{
                                        'token':this.token
                                    },
                                    params:{
                                        projId:this.projId
                                    },
                                    data:{
                                        AxisAngle:this.addListangle,
                                        ID:this.listData[this.listIndexNumber].ID,
                                        Name:this.addListname,
                                        Origin:this.addListcoordinate,
                                        OriginHeight:this.addListhigh,
                                        ParentID:this.listData[this.listIndexNumber].ParentID,
                                        Type:this.listData[this.listIndexNumber].Type,
                                        UseCS:this.listData[this.listIndexNumber].UseCS
                                    }
                                }).then((response)=>{
                                    if(response.data.cd == '0'){
                                        this.findSubProject();
                                        this.editListShow = false;
                                        //清空数据
                                        this.addListindex = '';
                                        this.addListname = '';
                                        this.addListcoordinate='';
                                        this.addListhigh='';
                                        this.addListangle='';
                                    }else if(response.data.cd == '-1'){
                                        alert(response.data.msg);
                                    }
                                })
                            }
                        }
                    }
                }
            }
        },
        //编辑资源包
        groundTableEdit(scope){
            this.editGorundData = scope.row;
            this.editgroundShow = true;
            console.log(scope.row);
            this.editUnityPropertyData = ['【不关联任何单体】'];
            this.listData.forEach(item=>{
                this.editUnityPropertyData.push(item.Name)
            })
            this.editUnityName = scope.row.FileName;
            if(scope.row.Platform == 0){
                this.platform = 'Web';
            }else if(scope.row.Platform == 4){
                this.platform = 'Android';
            }else if(scope.row.Platform == 3){
                this.platform = 'iOS';
            }
            this.resourceName = scope.row.FileName
            this.resourceSize = scope.row.FileSize;
            
            this.bundlesrface = '【不关联任何单体】';
            this.listData.forEach(item=>{
                if(item.ID == scope.row.ResourceTag.split('=')[1]){
                    this.bundlesrface = item.Name;
                }
            })
            this.editUnityRemark = scope.row.Comments;
            if(scope.row.Loaded == '加载'){
                this.isLoading = true;
            }else{
                this.isLoading = false;
            }
        },
        editGroundSure(){
            
            var platform = 0;
            if(this.platform == 'Web'){
                platform = 0;
            }else if(this.platform == 'Android'){
                platform = 4;
            }else if(this.platform == 'iOS'){
                platform = 3;
            }
            axios({
                method:'post',
                url:this.baseUrl+'h2-bim-project/project2/Config/updateUnityBundle',
                headers:{
                    'token':this.token
                },
                params:{
                    holderId:this.groundInfo.siteId
                },
                data:{
                    Comments:this.editUnityRemark,
                    ID:this.editGorundData.ID,
                    Loaded:this.isLoading,
                    Platform:platform,
                    ResourceName:this.editGorundData.ResourceName,
                    ResourceTag:this.editGorundData.ResourceTag
                }

            }).then((response)=>{
                if(response.data.cd == 0){
                    console.log(response.data);
                    this.getUnityBundle();
                    this.editgroundShow = false;
                }else{
                    alert(response.data.cd)
                }
            })
        },
        editGroundClose(){
            this.editgroundShow = false;
        },
        editListClose(){
            this.editListShow = false
            this.addListindex = '';
            this.addListname = '';
            this.addListcoordinate='';
            this.addListhigh='';
            this.addListangle='';
        },
        groundClose(){
            this.editgroundShow = false;
            this.addgroundShow = false;
            //清空数据
            this.groundIndex = '',
            this.groundName = '';
            this.groundCategroy = '';
            this.groundSourceName = '';
            this.groundSourceSize = '';
            this.groundVersion = '';
            this.groundRemark = '';
            this.groundState = '';
        },
        deleteListRow(scope) {
            this.deleteListDialog = true;
            this.deleProject = scope.row.Name;
            this.deleteListObject = scope;
        },
        //确认删除单体列表子项
        deleteMakeSure(){
            axios({
                method:'get',
                url:this.baseUrl+'h2-bim-project/project2/Config/deleteSubProject',
                headers:{
                    'token':this.token
                },
                params:{
                    buildId:this.deleteListObject.row.ID,
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.deleteListDialog = false;
                    this.findSubProject();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //卸载资源包
        groundTableUninstall(scope){
            if(scope.row.Loaded == '加载'){
                this.loadState = false;
            }else{
                this.loadState = true;
            }
            this.unInstallData = scope.row;
            this.unityName = scope.row.FileName;
            this.unityGround = scope.row.ResourceType;
            this.unityRemark = scope.row.Comments;
            this.uninstallUnityBundle = true;

        },
        uninstallUnityBundleSure(){
            axios({
                method:'post',
                url:this.baseUrl+'h2-bim-project/project2/Config/setUnityBundleStatus',
                headers:{
                    'token':this.token
                },
                params:{
                    'bundleId':this.unInstallData.ID,
                    'bundleStatus':this.loadState

                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    alert('操作成功!');
                    this.getUnityBundle()
                    this.unityName ='';
                    this.unityGround ='';
                    this.unityRemark ='';
                    this.uninstallUnityBundle = false;
                }else{
                    alert(response.data.msg)
                }
            })
            
        },
        uninstallUnityBundleClose(){
            this.uninstallUnityBundle = false;
            this.unityName ='';
            this.unityGround ='';
            this.unityRemark ='';
        },
        //删除资源包
        deleteTableRow(scope) {
            this.unityBundleSource = scope.row;
            this.deleteUnityBundle = true;
            this.unityName = scope.row.FileName;
            this.unityGround = scope.row.ResourceType;
            this.unityRemark = scope.row.Comments;
        },
        //确认删除资源包
        deleteUnitySure(){
            axios({
                method:'get',
                url:this.baseUrl+'/h2-bim-project/project2/Config/deleteUnityBundle',
                headers:{
                    token:this.token
                },
                params:{
                    fileId:this.unityBundleSource.ID,
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    alert('删除成功！');
                    this.getUnityBundle();
                    this.deleteUnityBundle = false;
                    this.unityRemark = '';
                    this.unityName ='';
                    this.unityRemark ='';
                }else{
                    alert(response.data.msg)
                }
            })
        },
        deleteUnityClose(){
            this.deleteUnityBundle = false;
        },
        getGroundInformation(){
            axios({
                method:'get',
                url:this.baseUrl+'h2-bim-project/project2/Config/projectSiteDatumIndex',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.groundInfo = response.data.rt.site;
                    this.groundInfo.siteId = response.data.rt.siteId;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }).then(()=>{
                this.getUnityBundle();//获取场地资源包 表格
            })
        },
        getSceneEnvironment(){
            axios({
                method:'post',
                url:this.baseUrl+'h2-bim-project/project2/Config/getSceneEnvironmentByProjId',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    jsonData:{
                        projId:this.projId
                    }
                }

            }).then((response)=>{
                if(response.data.cd == '0'){
                    if(response.data.rt.EffectLevel=='0'){
                        response.data.rt.EffectLevel='好';
                    }else if(response.data.rt.EffectLevel=='1'){
                        response.data.rt.EffectLevel='很好';
                    }else if(response.data.rt.EffectLevel=='2'){
                        response.data.rt.EffectLevel='最好';
                    };
                    if(response.data.rt.SceneTime=='0'){
                        response.data.rt.SceneTime='早晨';
                    }else if(response.data.rt.SceneTime=='1'){
                        response.data.rt.SceneTime='上午';
                    }else if(response.data.rt.SceneTime=='2'){
                        response.data.rt.SceneTime='中午';
                    }else if(response.data.rt.SceneTime=='3'){
                        response.data.rt.SceneTime='下午';
                    }else if(response.data.rt.SceneTime=='4'){
                        response.data.rt.SceneTime='傍晚';
                    }
                    this.SceneEnvironmentList = response.data.rt;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
                
            })
        },
        findSubProject(){
            axios({
                method:'get',
                url:this.baseUrl+'h2-bim-project/project2/Config/findSubProject/'+this.projId,
                headers:{
                    token:this.token
                }
            }).then((response)=>{
                
                if(response.data.cd == '0'){
                    this.listData = response.data.rt.rows;
                    this.listData.forEach((item,index,arr)=>{
                        arr[index].index = index;
                    })
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
                
            })
        },
        //获取场地静态资源包
        getUnityBundle(){
            axios({
                method:'post',
                url:this.baseUrl+'h2-bim-project/project2/Config/getUnityBundleByHolderId',
                headers:{
                    token:this.token
                },
                params:{
                    holderId:this.groundInfo.siteId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.unityData = response.data.rt;
                    if(this.unityData !== null){
                        this.unityData.forEach((item,index,arr)=>{
                            arr[index].index = index+1;
                            arr[index].FileName=item.FileName.split('.')[0];
                            if(item.ResourceType == 'utr'){
                                arr[index].ResourceType = '场地';
                            }else if(item.ResourceType == 'umr'){
                                arr[index].ResourceType = '材质';
                            }else{
                                arr[index].ResourceType = '构件';
                            }
                            arr[index].FileSize = (item.FileSize/1024/1024).toFixed(2)+'MB';
                            if(item.Loaded) {
                                arr[index].Loaded = '加载';
                            }else{
                                arr[index].Loaded = '卸载';
                            }
                        })
                    }
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //新增资源包
        addSource(){
            this.addgroundShow = true;
            this.filesList = [];
        },
        //新增场地资源包
        addGroundSure(){
            var _this = this;
            if(_this.platform == 'Web'){
                _this.platform = 0;
            }else if(_this.platform == 'Android'){
                _this.platform = 4;
            }else if(_this.platform == 'iOS'){
                _this.platform = 3;
            }
            var editName =0;
            _this.listData.forEach((item,index)=>{
                if(item.Name == _this.bundlesrface){
                    editName = item.ID
                }
            })
            var returnUrl = _this.baseUrl+'/h2-bim-project/project2/upload/uploadBundleDataFile?holderId='+_this.groundInfo.siteId+'&mainAsset='+_this.editUnityName+'&assetComment='+_this.editUnityRemark+'&assetStatus='+_this.isLoading+'&platform'+_this.platform+'&buildSurface'+editName;
            returnUrl = encodeURIComponent(returnUrl);
            const formData = new FormData();
            formData.append('projId',_this.projId);
            formData.append('type','1');
            formData.append('userId',_this.userId);
            formData.append('modelCode','001');
            formData.append('returnUrl',returnUrl)
            formData.append('token',_this.token);
            formData.append('file',_this.filesList[0]);
            axios({
                method:'post',
                url:_this.fileUpdataPath + 'uploading/uploadFileInfo',
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
                data:formData
            }).then(response=>{
                if(response.data.cd== '0'){
                    _this.getUnityBundle()
                    _this.addgroundShow = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    _this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            const list = this.$refs.file.files;
            this.fileName = list[0].name;
            this.filesList = list;
            this.editUnityBundleProperty = true;
            this.listData.forEach(item=>{
                this.editUnityPropertyData.push(item.Name)
            })
        },
        editUnityBundlePropertySure(){
            this.editUnityBundleProperty = false;
        },
        editUnityBundlePropertyClose(){
            this.editUnityBundleProperty = false;
        }
    }
}
</script>
<style lang="less">
    #groundSetting{
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
        .wrapper{
            width: 100%;
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
        .groundTitle{
            width: 97%;
            padding-left: 20px;
        }
        .groundIcon{
            float: right;
            width: 60px;
            height: 100%;
            cursor: pointer;
            text-align: center;
            color: #336699;
            font-size: 14px;
            font-weight: normal;
        }
        .groundIcon:hover{
            font-weight: bold;
        }
        .accountTitle{
            width: 100%;
            color: #fc3439;
            text-align: left;
            font-size: 16px;
            font-family: '微软雅黑';
            font-weight: bold;
            margin: 5px 0 20px 0;
            border-bottom: 1px solid #ccc;
            height: 40px;
            line-height: 45px;
        }
        .groundInfoInp{
            display: inline-block;
            width: 100%;
            height: 248px;
            border: 1px solid #fff;
            list-style: none;
            padding: 0;
            color: #999999;
            font-size: 14px;
        }
        .groundInfoInp >ul{
            margin: 20px 0 16px;
            padding-left:8px; 
            padding-right:20px; 
        }
        .groundInfoInp-active{
            border: 1px solid #fc4349!important;
            border-radius: 2px;
        }
        .groundInfoInp li{
            display: inline-block;
            width: 100%;
            display: flex;
            margin: 18px 0;
        }
        .groundInfoInp label{
            width: 110px;
            height: 40px;
            text-align: right;
            margin-right: 10px;
            line-height: 40px;
            font-size: 14px;
            font-family: 'MrcrosoftYaHei';
        }  
        .groundInfoInp div{
            flex: 1;
            height: 37px;
        }  
        .sInp{
            float: left;
            min-width: 225px;
        }
        .scale{
            width: 225px;
            float: left;
            position: relative;
        }
        .spe{
            margin-left: 10px;
        }
        .btn{
            width: 110px;
            height: 34px;
            line-height: 34px;
            border: 1px solid #ffffff;
            padding: 0;
            text-align: center;
            border-radius: 2px;
        }
        .btn-save{
            border: 1px solid #fc3439;
            background: #fc3439;
        }
        .btn-cancle{
            border: 1px solid #cccccc;
            margin-left: 20px;
        }
        .groundSettingBody{
            color: #999999;
            width: 100%;
            border: 1px solid #ffffff;
            padding-bottom: 26px;
        }
        .groundSettingBodyS{
            display: flex;
            font-size: 14px;
        }
        .groundSettingBodyS p{
            flex: 1;
            max-width:319px;
            text-align: left;
        }
        .el-input__icon{
            width: 22px;
        }
        .groundSettingBodyS .firstP{
            margin-left: 65px;
        }
        .groundSettingBodyS label{
            width: 60px;
            height: 30px;
            color: #999;
            font-size:'MicrosoftYaHei';
            display: inline-block;
        }
       .groundSettingBodyS .elSelect{
           width: 225px;
       }
        .groundSettingBodyP{
            display:flex;
        }
        .groundSettingBodyP label{
            display: inline-block;
            width: 88px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            margin-left: 65px;
            text-align: left;
        }
        .groundSettingBodyP div{
            flex: 1;
            margin-left: -6px;
        }
        /**********控制滚动bar的小圆点样式**********/
        .el-slider__runway{
            height: 12px;
        }
        .el-slider__bar{
           height: 10px;
            top: 1px;
        }
        .el-slider__button-wrapper{
                top: -12px;
        }
        /**********控制滚动bar的小圆点样式**********/
        .groundSettingBodyC{
            text-align: left;
            position: relative;
            left: 59px;
            font-size: 12px;
            transform: scale(0.85);
            color:#333;
        }
        .groundSetting{
            .accountTitle{
                margin-bottom: 15px;
            }
        }
        .groundTable{
            width: 100%;
            text-align: left;
            margin-top: 20px;
        }
        .groundTable .table{
            flex: 1;
        }
        .pagenation{
            width: 100%;
            text-align: right;
            height: 40px;
            margin-top: 20px;
        }
        .editIcon{
            color: #fe731e;
        }
        .deleteIcon{
            color: #4573a2;
        }
        .infoIcon{
            color: #3ac737;
        }
        .imgicon {
            position: relative;
            top: 1px;
            margin-right: 12px;
        }
        .iconDiv{
            width: 30px;
            height: 30px;
            float: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center; 
            
        }
        .iconDiv2{
            margin-left: 11px;
        }
        .el-input.is-disabled .el-input__inner{
            height: 37px;
            background: #fafafa;
        }
        .groundEdit{
            float: right;
            width: 16px;
            height: 16px;
            position: relative;
            top: 15px;
            cursor: pointer;
            background: url(../../assets/ground-editpng.png) no-repeat 0 0;
            &:hover{
                background: url(../../assets/edit.png) no-repeat 0 0;
            }
        }
        .groundEdit-active{
             background: url(../../assets/edit.png) no-repeat 0 0;
        }
        .el-input__inner{
            height: 37px;
            color: #999999;
        }
        .iconImg{
            width: 16px;
            height: 16px;
            position: relative;
            top: 5px;
            margin-right: 25px;
        }
        .editIcon{
            margin-left: 10px;
        }
        .icon-size::before{
            display: block;
            position: absolute;
            right: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: '平方米';
        }
        .icon-X::before{
            display: block;
            position: absolute;
            left: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: 'X=';
        }
        .icon-X::after,.icon-Y::after,.icon-Z::after{
            display: block;
            position: absolute;
            left: 90%;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: '米';
        }
        .icon-Y::before{
            display: block;
            position: absolute;
            left: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: 'Y=';
        }
        .icon-Z::before{
            display: block;
            position: absolute;
            left: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: 'Z=';
        }
        .icon-X input,.icon-Y input,.icon-Z input,{
            padding-left: 32px;
        }
        .editBodyone,.editBodytwo{
            text-align: left;
        }
        .editInpText{
            display: inline-block;
            margin-left: 40px;
        }
        .edit-item{
            position: relative;
            .editSelect{
                float: left;
                width: 447px;
                height: 40px;
                padding: 10px;
            }
            .icon-sanjiao{
                position: relative;
                left: 580px;
                z-index: 100;
            }
            .editInpText{
                width: 100px;
                text-align: right;
                float: left;
                height: 40px;
                line-height: 40px;
            }
        }
        .clearfix{
            clear: both;
            overflow: hidden;
            content: '';
        }
    }
    /* 上传文件按钮 */
    #edit .imageBody{
       text-align: left;
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
    .el-tooltip__popper{
        padding: 1px 7.5px;
        margin-top: 10px!important;//不起作用
    }
    .el-tooltip__popper .popper__arrow{
        border-width: 3px!important;
    }

    .el-table--border th{
         background: #f2f2f2;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fafafa;
    }
    .el-table th{
            padding: 15px 0;
    }
    .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
     border-right: 1px solid #e0e0e0;
    }
    .el-table td, .el-table th.is-leaf {
        border-bottom: 1px solid #e0e0e0;
    }
    .el-table--border, .el-table--group {
        border: 1px solid #d9d9d9;
    }
    .el-table::before,.el-table--border::after, .el-table--group::after{
        display: none;
    }
</style>

