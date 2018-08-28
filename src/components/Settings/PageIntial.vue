<template>
  <div class="wrapper" id="pageIn">
      <h4 class="titleAll"><span>分区与楼层配置</span></h4>
      <div class="pageI">
        <div class="pageSelect">
            <div class="pageOption">
                <label>单体名称</label>
                <el-select v-model="subProjectsValue" placeholder="请选择" @change="changeSubProjects">
                    <el-option
                    v-for="item in subProjectsName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="pageOption pageOption1">
                <label>建筑分区</label>
                <el-select v-model="partitionListValue" placeholder="请选择" @change="changePartionList">
                    <el-option
                    v-for="item in partitionListName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="pageBtn">
                <button class="addBtn" @click="addPartitionList">+添加</button>
                <button class="editBtn" @click="editPartitionList">编辑</button>
                <button class="editBtn" @click="deletePartitionList">删除</button>
            </div>
        </div>
        <div class="flor">
            <h5 class="title"><img class="imgicon"  src="../../assets/columFloor.png"/> 竖向楼层<span @click="addFlor" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="pageTable"> 
                <el-table :data="florData" border class="table" style="width:100%">
                    <el-table-column label="序号" prop="index" width='100px'></el-table-column>
                    <el-table-column label="名称" prop="Name"></el-table-column>
                    <el-table-column label="标高值" prop="BottomHeight"></el-table-column>
                    <el-table-column label="备注" prop="Remark" ></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <div class="iconDiv1 iconDiv"  @click="listTableEdit(scope)" ><img  class="iconImg editIcon"  src="../../assets/edit.png"/></div>
                            <div class="iconDiv2 iconDiv" v-if="scope.row.IsDefault==false" v-show="scope.row.BottomHeight != '最小值'"  @click="deleteFloorRow(scope, florData)" ><img class="iconImg"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="flor" style="margin-bottom:30px;">
            <h5 class="title" id="sourceB"><img class="imgicon"  src="../../assets/sourceBag.png"/> 分区资源包<span @click="addSource" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="sourceTable"> 
                <el-table :data="UnityBundle" border class="table"  style="width:100%">
                    <el-table-column prop="index" label="序号"></el-table-column>
                    <el-table-column prop="FileName" label="资源包名称"></el-table-column>
                    <el-table-column prop="ResourceType" label="资源类型"></el-table-column>
                    <el-table-column prop="ResourceName" label="资源名称"></el-table-column>
                    <el-table-column prop="FileSize" label="资源包大小"></el-table-column>
                    <el-table-column prop="UpdateTime" label="上传时间" width="200"></el-table-column>
                    <el-table-column prop="FileVersion" label="版本"></el-table-column>
                    <el-table-column prop="Comments" label="备注"></el-table-column>
                    <el-table-column prop="Loaded" label="当前状态"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" >
                            <div class="iconDiv iconDiv2" @click="groundTableUninstall(scope)"><img  class="iconImg editIcon"  src="../../assets/recircle.png"/></div>
                            <div class="iconDiv iconDiv2" style="width:17px;height:17px;" @click="groundTableEdit(scope)"><img  class="iconImg editIcon"  src="../../assets/info.png"/></div>
                            <div class="iconDiv iconDiv2" @click="deleteTableRow(scope)"><img  class="iconImg editIcon"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagenation">   
                <el-pagination background layout="prev, pager, next" v-if="UnityBundle!=null" :total="UnityBundle.length"></el-pagination>
            </div>
        </div>
        <!--dialog-->
        <div id="edit">
            <!--编辑分区-->
            <el-dialog title="编辑分区" :visible.sync="editPartition" :before-close="cancleEditPartitionList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">区域名称 :</label><input class="inp" placeholder="请输入" v-model="partitionName"/></div>
                    <div class="editBodytwo"><label class="editInpText">面积 :</label><input class="inp" placeholder="请输入" v-model="Area"/></div>
                </div>
                <el-checkbox v-model="partitionIsDefault" :disabled="isDisabled">作为默认分区</el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditPartitionList">确定</button>
                    <button class="editBtnC" @click="cancleEditPartitionList">取消</button>
                </div>
            </el-dialog>
            <!--新增建筑分区-->
            <el-dialog title="新增分区" :visible.sync="addPartition" :before-close="cancleAddPartitionList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">区域名称 :</label><input class="inp" placeholder="请输入" v-model="partitionName"/></div>
                    <div class="editBodytwo"><label class="editInpText">面积 :</label><input class="inp" placeholder="请输入" v-model="Area"/></div>
                </div>
                <el-checkbox v-model="partitionIsDefault">作为默认分区</el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeAddPartitionList">确定</button>
                    <button class="editBtnC" @click="cancleAddPartitionList">取消</button>
                </div>
            </el-dialog>
            <!--新增竖向楼层-->
            <el-dialog title="新增竖向楼层" :visible.sync="addFloorList" :before-close="cancleAddFloorList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">楼层名称 :</label><input class="inp" placeholder="请输入" v-model="FloorName"/></div>
                    <div class="editBodytwo"><label class="editInpText">楼层标高 :</label><input class="inp" placeholder="请输入" v-model="FloorValue"/></div>
                </div>
                <el-checkbox v-model="setAsAuto">设置为默认楼层</el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeAddFloorList">确定</button>
                    <button class="editBtnC" @click="cancleAddFloorList">取消</button>
                </div>
            </el-dialog>
            <!--编辑竖向楼层-->
            <el-dialog title="编辑竖向楼层" :visible.sync="editFloorList" :before-close="cancleEditFloorList">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">楼层名称 :</label><input class="inp" placeholder="请输入" v-model="FloorName"/></div>
                    <div class="editBodytwo"><label class="editInpText">楼层标高 :</label><input class="inp" placeholder="请输入"  :disabled="disableShowEdit" v-model="FloorValue"/></div>
                </div>
                <el-checkbox v-model="setAsDefault" :disabled="isDisabled">设置为默认楼层</el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditFloorList">确定</button>
                    <button class="editBtnC" @click="cancleEditFloorList">取消</button>
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
                    <div class="editBodytwo"><label class="editInpText">资源备注 :</label><input class="inp" v-model="editUnityRemark"/></div>
                    <div class="editBodytwo"><label class="editInpText"></label><el-checkbox v-model="isLoading">加载</el-checkbox><el-checkbox v-model="fenquwaipi">分区外皮</el-checkbox></div>
                    
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editGroundSure">确 定</el-button>
                    <el-button @click="editGroundClose">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 资源包属性编辑 -->
            <el-dialog title="资源包属性编辑" :visible.sync="editUnityBundleProperty" :before-close="editUnityBundlePropertyClose">
                <div class="editBody">
                    <div class="editBodytwo">
                        <label class="editInpText">资源包名 :</label><span>{{fileName}}</span>
                        <label class="editInpText">资源大小 :</label><span>{{fileSize}}</span>
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
                    <div class="editBodytwo"><label class="editInpText">资源备注 :</label><input class="inp" v-model="editUnityRemark"/></div>
                    <div class="editBodytwo"><label class="editInpText"></label><el-checkbox v-model="isLoading">加载</el-checkbox><el-checkbox v-model="fenquwaipi">分区外皮</el-checkbox></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editUnityBundlePropertySure">添加</button>
                    <button class="editBtnC" @click="editUnityBundlePropertyClose">取消</button>
                </div>
            </el-dialog>
        </div>
        <!--删除-->
        <div id="inital">
            <el-dialog  :visible.sync="deleteFloorDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deleteFloorDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
        <!--删除建筑分区-->
        <div id="inital">
            <el-dialog  :visible.sync="deletePartionDialog" width="398px">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除【{{deletepartitionContent}}】?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deletePartitionMakeSure">删除</button>
                    <button class="cancelBtn" @click="deletePartionDialog=false">取消</button>
                </div>
            </el-dialog>
        </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name:'PageIntial',
  data() {
      return {
        subProjects:[],//总单体名称信息
        subProjectsName:[],//单体名称
        subProjectsValue:'',//单体名称值
        partitionList: [],//总建筑分区信息 
        partitionListName:[],//建筑分区名称
        partitionListValue:'',//建筑分区值
        value: '',
        florData:[],
        addFloorList:false,
        editFloorList:false,
        deleteFloorDialog:false,
        setAsAuto:false,
        setAsDefault:false,
        addpartitionShow:false,
        FloorName:'',
        FloorValue:'',
        floorIndex:'',
        floorScope:{},
        BDMSUrl:'',
        token:'',
        projId:'',
        partitionName:'',
        Area:'',
        editPartition:false,
        partitionIndex:0,
        addPartition:false,
        partitionIsDefault:false,
        deletePartionDialog:false,
        deletepartitionContent:'',
        subProjectsIndex:0,
        isDisabled:false,
        disableShowEdit:'',
        UnityBundle:[],
        unityBundleSource:{},
        deleteUnityBundle:false,
        unityName:'',
        unityGround:'',
        unityRemark:'',
        addgroundShow:false,
        fileName:'未选择任何文件',
        fileSize:'',
        editgroundShow:false,
        editListShow:false,
        filesList:[],
        uninstallUnityBundle:false,
        unInstallData:{},
        loadState:false,
        resourceSize:'',
        resourceName:'',
        editGorundData:{},
        editUnityName:'',
        editUnityRemark:'',
        platform:'Web',
        isLoading:true,
        fenquwaipi:true,
        editUnityBundleProperty:false,
        fileUpdataPath:'',
        userId:''

      }
    },
    created(){
        var vm = this;
        this.userId = localStorage.getItem('userid');
        this.fileUpdataPath = this.$store.state.QJFileManageSystemURL;
        vm.token = localStorage.getItem('token');//获取token
        vm.projId = localStorage.getItem('projId');//获取项目projId
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.floorAndSceneInit();//分区与楼层初始化
    },
    methods:{
        //新增竖向楼层列表
        addFlor(){
            this.addFloorList = true;
        },
        //确认添加竖向楼层
        makeAddFloorList(){
            var reg = new RegExp("^-?\\d+$");//只能输入整数
            if(this.FloorName == '' || this.FloorValue == ''){
                alert('请输入完整表单！')
            }else{
                if(reg.test(this.FloorValue)){
                    var flag = this.florData.some(item=>{
                        if(item.Name == this.FloorName ||item.BottomHeight == this.FloorValue){
                            return true;
                        }else{
                            return false;
                        }
                    })
                    if(flag){
                        alert('楼层名称或标高值已存在!')
                    } else{
                        axios({
                            method:'post',
                            url:this.BDMSUrl+'project2/Config/updateStorey',
                            headers:{
                                'token':this.token
                            },
                            params:{
                                holderId:this.florData[0].ParentID,
                                flag:0,
                                projectId:this.projId
                            },
                            data:{
                                "Type": this.florData[0].Type,
                                "ParentID": this.florData[0].ParentID,
                                "Name": this.FloorName,
                                "BottomHeight": this.FloorValue,
                                "Unit":this.florData[0].Unit,
                                "IsDefault": this.setAsAuto
                            }
                         }).then(response=>{
                            if(response.data.cd == '0'){
                                this.findStore(this.partitionList,this.partitionIndex);
                                this.FloorName = '';
                                this.FloorValue = '';
                                this.setAsAuto = false;
                                this.addFloorList = false;
                            }else if(response.data.cd == '-1'){
                                alert(response.data.msg)
                            }else{
                                this.$router.push({
                                    path:'/login'
                                })
                            }
                        })
                    }
                }else{
                    alert('楼层标高只能输入正数！')
                }
            }
        },
        //取消添加
        cancleAddFloorList(){
            this.addFloorList = false;
        },
        //编辑竖向楼层
        listTableEdit(scope){
            if(scope.row.IsDefault){
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
            }
            if(scope.row.BottomHeight == '最小值'){
                this.disableShowEdit = true;
            }else{
                this.disableShowEdit = false;
            }

            this.floorIndex = scope.$index;
            this.setAsDefault = this.florData[this.floorIndex].IsDefault;
            this.FloorName = this.florData[this.floorIndex].Name;
            this.FloorValue = this.florData[this.floorIndex].BottomHeight;
            this.editFloorList = true;
        },
        makeEditFloorList(){
            var reg = new RegExp("^[0-9]*$");
            if(this.FloorValue=='最小值'){
                this.FloorValue = -2147483648;
            }
            var floorArr = this.FloorValue.toString().split('');
            if(this.FloorValue.toString().split('')[0] == '-'){
                var str = floorArr.shift();
            }
            if(floorArr != '' && reg.test(floorArr.join(''))){
                axios({
                    method:'post',
                    url:this.BDMSUrl+'project2/Config/updateStorey',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        holderId:this.florData[this.floorIndex].ID,
                        flag:1,
                        projectId:this.projId
                    },
                    data:{
                        ID: this.florData[this.floorIndex].ID,
                        Type: this.florData[this.floorIndex].Type,
                        ParentID: this.florData[this.floorIndex].ParentID,
                        Name: this.FloorName,
                        Group: "",
                        UnderID: this.florData[this.floorIndex].UnderID,
                        OverID: this.florData[this.floorIndex].OverID,
                        BottomHeight: this.FloorValue,
                        Unit:this.florData[this.floorIndex].Unit,
                        IsDefault: this.setAsDefault
                    }
                }).then(response=>{
                    if(response.data.cd == '0'){
                        this.editFloorList = false;
                        this.findStore(this.partitionList,this.partitionIndex);
                        this.FloorName ='';
                        this.FloorValue = '';
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg);
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }else{
                alert('楼层标高请输入数字！')
            }
        },
        cancleEditFloorList(){
            this.editFloorList = false;
            this.FloorName ='';
            this.FloorValue = '';
        },
        //删除竖向楼层
        deleteFloorRow(scope){
            this.floorIndex = scope.$index;
            this.deleteFloorDialog = true;
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/deleteStorey',
                headers:{
                    'token':this.token
                },
                params:{
                    storeyId:this.florData[this.floorIndex].ID
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.findStore(this.partitionList,this.partitionIndex);
                    this.deleteFloorDialog = false; 
                }else if(response.data.cd = '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //分区与楼层初始化
        floorAndSceneInit(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/floorAndSceneInit',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    if(response.data.rt!=null){
                        this.subProjects= response.data.rt.subProjects;//单体信息
                        this.partitionList = response.data.rt.partitionList;//建筑分区
                        this.partitionList.forEach((item,index)=>{
                            this.partitionListName.push({
                                label:item.name,
                                value:index
                            })
                        })
                        this.subProjects.forEach((item,index)=>{
                            this.subProjectsName.push({
                                label:item.name,
                                value:index
                            })
                        })
                        //初始化 单体名称 和 建筑分区的初始值
                        this.partitionListValue = this.partitionListName[0].label;
                        this.subProjectsValue = this.subProjectsName[0].label;
                    }
                }
            }).then(()=>{
                this.findStore(this.partitionList,0);
            })
        },
        //改变单体名称值 来改变建筑分区的值
        changeSubProjects(val){
            this.subProjectsIndex = val;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/getPartitionBySubProjId',
                headers:{
                    'token':this.token
                },
                params:{
                    subProjId:this.subProjects[this.subProjectsIndex].id
                } 
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.partitionListName = [];
                    this.partitionList = response.data.rt;
                    this.partitionList.forEach((item,index)=>{
                        this.partitionListName.push({
                            label:item.Name,
                            value:index
                        })
                    })
                    this.partitionListValue = this.partitionListName[0].label;
                    this.partitionIndex = 0;
                }else if(reeponse.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }).then(()=>{
                this.findStore(this.partitionList,0);
            })
        },
        //改变建筑分区的值
        changePartionList(val){
            this.partitionIndex = val;
            this.findStore(this.partitionList,val);
        },
        //获取竖向楼层
        findStore(val,index){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/findStorey/'+val[index].ID,
                headers:{
                    'token':this.token
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt != null){
                        this.florData = response.data.rt.rows;
                        this.florData.forEach((item,index,arr)=>{
                            if(item.IsDefault){
                                item = Object.assign(item,{
                                    Remark:'默认楼层'
                                })
                            };
                            if(item.BottomHeight == -2147483648){
                                item = Object.assign(item,{
                                    BottomHeight:'最小值',
                                    isShowDelete:false
                                })
                            }
                            item = Object.assign(item,{
                                index:index
                            })
                        });
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }).then(()=>{
                this.getUnityBundleByHolderId();
            })
        },
        //获取场地资源包
        getUnityBundleByHolderId(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/getUnityBundleByHolderId',
                headers:{
                    'token':this.token
                },
                params:{
                    holderId:this.florData[0].ParentID
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.UnityBundle = response.data.rt;
                    if(this.UnityBundle != null){
                        this.UnityBundle.forEach((item,index,arr)=>{
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
                }else if(response.data.cd =='1'){
                    alert(response.data.msg)
                }
            })
        },
        //编辑建筑分区
        editPartitionList(){
            this.editPartition = true;
            if(this.partitionList[this.partitionIndex].IsDefault){
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
            }
            this.partitionName = this.partitionList[this.partitionIndex].Name;
            this.Area = this.partitionList[this.partitionIndex].AreaValue;
            this.partitionIsDefault = this.partitionList[this.partitionIndex].IsDefault;
        },
        //取消编辑
        cancleEditPartitionList(){
            this.partitionName ='';
            this.Area ='';
            this.editPartition = false;
            this.partitionIsDefault = false;
        },
        //确认编辑
        makeEditPartitionList(){
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/updatePartition',
                headers:{
                    'token':this.token
                },
                params:{
                    subProjId:this.partitionList[this.partitionIndex].ParentID,
                    projId:this.projId
                },
                data:{
                    AreaValue:this.Area,
                    ID:this.partitionList[this.partitionIndex].ID,
                    IsDefault:this.partitionIsDefault,
                    Name:this.partitionName,
                    ParentID:this.partitionList[this.partitionIndex].ParentID,
                    Type:this.partitionList[this.partitionIndex].Type,
                    Unit:this.partitionList[this.partitionIndex].Unit
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.changeSubProjects(this.subProjectsIndex);
                    this.partitionName ='';
                    this.Area ='';
                    this.partitionIsDefault = false;
                    this.editPartition = false;
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
        //新增建筑分区
        addPartitionList(){
            this.addPartition = true;
        },
        makeAddPartitionList(){
            if(this.partitionName == '' ){
                alert('分区名称不能为空!');
            }else if(this.Area == ''){
                alert('面积不能为空!');
            }else{
                if(isNaN(this.Area)){
                    alert('面积必须是数字!')
                }else{
                    axios({
                        method:'post',
                        url:this.BDMSUrl+'project2/Config/updatePartition',
                        headers:{
                            token:this.token
                        },
                        params:{
                            projId:this.projId,
                            subProjId:this.partitionList[this.partitionIndex].ParentID
                        },
                        data:{
                            AreaValue:this.Area,
                            IsDefault:this.partitionIsDefault,
                            Name:this.partitionName,
                        }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.partitionListName.push({
                                label:this.partitionName,
                                value:this.partitionListName.length
                            })
                            this.changeSubProjects(this.subProjectsIndex);
                            this.partitionName ='';
                            this.Area ='';
                            this.addPartition = false;
                        }else if(response.data.cd == "-1"){
                            alert(response.data.msg)
                        }else{
                            this.$router.push({
                                path:'/login'
                            })
                        }
                    })
                }
            }  
        },
        cancleAddPartitionList(){
            this.partitionName ='';
            this.Area ='';
            this.addPartition = false;
        },
        //删除建筑分区
        deletePartitionList(){
            this.partitionList.forEach((item,index)=>{
                if(index == this.partitionIndex){
                    if(item.IsDefault){
                        alert('不能删除默认分区')
                    }else{
                        this.deletepartitionContent = this.partitionListName[this.partitionIndex].label;
                        this.deletePartionDialog = true;
                    }
                }
            })
             
        },
        //确认删除分区
        deletePartitionMakeSure(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/deletePartition',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    partitionId:this.partitionList[this.partitionIndex].ID
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.changeSubProjects(this.subProjectsIndex);
                    this.partitionListValue = this.partitionListName[0].label;
                    this.deletePartionDialog = false;
                } else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            
        },
         //新增分区资源包
        addSource(){
            this.addgroundShow = true;
            //this.$refs.file.files = [];
        },
        //新增分区资源包
        addGroundSure(){
            if(this.filesList.length == 0){
                alert("请选择上传的文件!")
            }else if(this.fileName.split('.')[1] != 'utr' && this.fileName.split('.')[1] != 'uer'){
                alert('请上传utr或者uer文件！');
            }else{
                if(this.platform == 'Web'){
                    this.platform = 0;
                }else if(this.platform == 'Android'){
                    this.platform = 4;
                }else if(this.platform == 'iOS'){
                    this.platform = 3;
                }
                var holderId = '';
                this.partitionList.forEach((item,index)=>{
                    if(item.Name == this.partitionListValue || index == this.partitionListValue){
                        holderId = item.ID
                    }
                })
                var returnUrl = this.BDMSUrl+'project2/upload/uploadBundleDataFile?holderId='+holderId+'&mainAsset='+encodeURIComponent(this.editUnityName)+'&assetComment='+encodeURIComponent(this.editUnityRemark)+'&assetStatus='+this.isLoading+'&platform'+this.platform+'&partitionSurface'+this.fenquwaipi;
                returnUrl = encodeURIComponent(returnUrl);
                const formData = new FormData();
                formData.append('projId',this.projId);
                formData.append('type','1');
                formData.append('userId',this.userId);
                formData.append('modelCode','001');
                formData.append('returnUrl',returnUrl)
                formData.append('token',this.token);
                formData.append('file',this.filesList[0]);
                axios({
                    method:'post',
                    url:this.fileUpdataPath + 'uploading/uploadFileInfo',
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                    data:formData
                }).then(response=>{
                    if(response.data.cd== '0'){
                        this.getUnityBundleByHolderId();
                        this.addgroundShow = false;
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
        },
        groundClose(){
            this.addgroundShow = false;
            this.$refs.file.files = {};
            this.fileName = '';
        },
        //编辑资源包
        groundTableEdit(scope){
            this.editGorundData = scope.row;
            this.editgroundShow = true;
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
            
            this.editUnityRemark = scope.row.Comments;
            if(this.editGorundData.ResourceTag!=null&&this.editGorundData.ResourceTag!=""){
                this.fenquwaipi = true;
            }else{
                this.fenquwaipi = false;
            }
            
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
                url:this.BDMSUrl+'project2/Config/updateUnityBundle',
                headers:{
                    'token':this.token
                },
                params:{
                    holderId:this.editGorundData.HolderID
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
                    this.getUnityBundleByHolderId();
                    this.editgroundShow = false;
                }else{
                    alert(response.data.cd)
                }
            })
        },
        editGroundClose(){
            this.editgroundShow = false;
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
                url:this.BDMSUrl+'project2/Config/setUnityBundleStatus',
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
                    this.getUnityBundleByHolderId()
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
            console.log(scope)
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
                url:this.BDMSUrl+'project2/Config/deleteUnityBundle',
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
                    this.getUnityBundleByHolderId();
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
        selectImg(){
            this.$refs.file.click();
        },
        fileChanged(){
            let list = [];
            list = this.$refs.file.files;
            this.fileName = list[0].name;
            this.fileSize = (list[0].size/1024).toFixed(2)+'M';
            this.filesList = list;
            if(this.fileName.split('.')[1] == 'utr' || this.fileName.split('.')[1] == 'uer'){
                this.editUnityBundleProperty = true;
            }else{
                alert("请上传utr或者uer文件！")
            }
            
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
<style lang='less'>
    #pageIn{
        .el-table__row{
            height:36px;
        }
        .el-table td,.el-table th{
            padding: 0;
        }
        .el-table tr{
            height: 36px;
        }
        .wrapper{
            width: 100%;
        }
        .pageI{
            margin: 0 20px 0 15px;
        }
        .titleAll{
            font-weight: bold;
            border-bottom:1px solid #ccc; 
            margin: 0px 20px 0 0px ;
            text-align: left;
        }
        .titleAll span{
            display: inline-block;
            margin-left: 15px;
            color: #fc343a;
            font-size: 18px;
            line-height: 18px;
            margin: 22px 0 11px 15px;
        }
        .title{
            color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            border-bottom:1px solid #e6e6e6; 
            height: 40px;
            line-height: 40px;
            margin: 30px 0px 0 0px ;
            text-align: left;
        }

        .pageSelect{
            display: flex;
            margin-top: 26px;
            font-size: 0.8rem;
            color: #999999;
        }
        .pageOption{
            flex: 1;
            text-align: left;
            // margin-left: 20px;
            width: 270px;
            float: left;
        }
        .pageOption1{
            margin-left: 60px;
            float: left;
        }
        .pageOption label{
            color: #999;
            font-weight: normal;
            font-size: 14px;
            line-height: 38px;
            font-family: 'MicrosoftYaHei';
            margin-right: 10px;
            float: left;
        }
        .pageOption.el-select{
            float: left;
            
        }
        .pageBtn{
            // width: 250px;
            text-align: left;
        }
        .addBtn,.editBtn{
            width: 95px;
            height: 38px;
            border: 1px solid #ccc;
            background: #fc3439;
            color: #fff;
            margin-left: 10px;
            cursor: pointer;
            padding: 0;
            border-radius: 2px;
            border: none;
        }
        .pageSelect .el-input--suffix .el-input__inner{
            height: 38px;
            width: 200px;
        }
        .add{
            float: right;
            color: #336699;
            cursor: pointer;
            font-size: 14px;
            font-family: 'MicroSoftYaHei';
            font-weight: normal;
        }
        .add:hover{
            font-weight: bold;
        }
        .flor{
            width: 100%;
            margin: 0 auto;
            .pagenation{
                width: 100%;
                text-align: right;
                height: 40px;
                margin-top: 20px;
            }
        }
        .iconEdit{
            color: #fe731e;
            width: 25%;
            display: inline-block;
            cursor: pointer;
            text-align: center;
        }
        .iconDelete{
            width: 25%;
            color: #4573a2;
            display: inline-block;
            cursor: pointer;
            text-align: center;
        }
        .iconInfo{
            width: 25%;
            color: #3ac737;
            display: inline-block;
            cursor: pointer;
            text-align: center;
        }
        .pagination{
            width: 100%;
            text-align: right;
            margin-top: 10px;
            margin-right: 20px;
            height: 50px;
        }
        .el-pagination{
            padding:0;
            // margin-right: 20px;
        }
        .iconDiv{
            width: 16px;
            height: 16px;
            float: left;
            cursor: pointer; 
            display: flex;
            align-items: center;
            justify-content: center;  
        }
        .iconDiv2{
            margin-left: 10px;
        }
        .imgicon {
            position: relative;
            top: 1px;
            margin-right: 12px;
        }
        #sourceB{
            margin-top: 50px;
        }
        .editBody{
            margin: 0 30px;
            
        }
        #edit .editSelect{
            // float: left;
            width: 447px;
            height: 42px;
            padding: 10px;
            position: relative;
            left: -5px;
        }
        .icon-sanjiao{
            position: relative;
            left: 530px;
            z-index: 100;
            top: -24px;

        }
        .editBodyone,.editBodytwo{
            text-align: left;
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
        .editInpText{
            display: inline-block;
            // margin-left: 89px;
        }
        .pageTable,.sourceTable{

            margin-top: 20px;
            width: 100%;
            text-align: left;
            display: flex;
            
        }
        .pageTable .table,.sourceTable .table{
            flex: 1;
        }
        .el-select__caret {
            margin-right: 10px;
            display: inline-block;
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
        .el-checkbox{
            display: block;
            float: left;
            margin-left: 140px;
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
       
    }
    
</style>


