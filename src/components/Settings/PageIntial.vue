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
                    <el-table-column label="序号" prop="index"></el-table-column>
                    <el-table-column label="名称" prop="Name"></el-table-column>
                    <el-table-column label="标高值" prop="BottomHeight"></el-table-column>
                    <el-table-column label="备注" prop="Remark" ></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <div class="iconDiv1 iconDiv"  @click="listTableEdit(scope)" ><img  class="iconImg editIcon"  src="../../assets/edit.png"/></div>
                            <div class="iconDiv2 iconDiv"  @click="deleteFloorRow(scope.$index, florData)" ><img class="iconImg"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="flor">
            <h5 class="title" id="sourceB"><img class="imgicon"  src="../../assets/sourceBag.png"/> 分区资源包<span @click="addSource" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="sourceTable"> 
                <el-table :data="sourceData" border class="table"  style="width:100%">
                    <el-table-column label="序号" prop="index"></el-table-column>
                    <el-table-column label="资源包名称" prop="sourceBagName"></el-table-column>
                    <el-table-column label="资源类型" prop="sourceType"></el-table-column>
                    <el-table-column label="资源名称" prop="sourceName"></el-table-column>
                    <el-table-column label="资源大小" prop="sourceSize"></el-table-column>
                    <el-table-column label="上传时间" prop="updateTime" ></el-table-column>
                    <el-table-column label="版本" prop="version"></el-table-column>
                    <el-table-column label="备注" prop="remarks"></el-table-column>
                    <el-table-column label="当前状态" prop="state" width="120px"></el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template slot-scope="scope" >
                            <div class="iconDiv iconDiv2" @click="groundTableEdit(scope)"><img  class="iconImg editIcon"  src="../../assets/recircle.png"/></div>
                            <div class="iconDiv iconDiv2" style="width:17px;height:17px;"><img  class="iconImg editIcon"  src="../../assets/info.png"/></div>
                            <div class="iconDiv iconDiv2" @click="deleteRow(scope.$index, sourceData)"><img  class="iconImg editIcon"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                 layout="total, sizes, prev, pager, next, jumper"
                :total="199">
                </el-pagination>
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
                    <div class="editBodytwo"><label class="editInpText">楼层标高 :</label><input class="inp" placeholder="请输入" v-model="FloorValue"/></div>
                </div>
                <el-checkbox v-model="setAsDefault">设置为默认楼层</el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="makeEditFloorList">确定</button>
                    <button class="editBtnC" @click="cancleEditFloorList">取消</button>
                </div>
            </el-dialog>
            <!--新增资源包弹窗-->
            <el-dialog title="上传文件" :visible.sync="addpartitionShow" :before-close="addPartitionCancel">
                <div class="editBody">
                    <div class="editBodyone"><label class="editInpText">概要文件 :</label><span class="">企业自用办公楼4.png</span><div style="margin-left:208px;margin-top:11px;"><button class="upImgBtn">选择文件</button></div></div>
                    <div class="editBodytwo"><label class="editInpText">上传图片 :</label><button class="upImgBtn">选择文件</button><span class="upImgText">未选择任何文件</span></div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPartitionSure">上传</button>
                    <button class="editBtnC" @click="addPartitionCancel">取消</button>
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
        sourceData:[{
            index:'01',
            sourceBagName:'yanshichangdi',
            sourceType:'场地',
            sourceName:'yanshichangdi',
            sourceSize:'3.39MB',
            updateTime:'2017-10-23 17:40',
            version:'239',
            remarks:'',
            state:'加载'
        }],
        floorIndex:'',
        baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
        token:'',
        projId:'',
        partitionName:'',
        Area:'',
        editPartition:false,
        partitionIndex:0,
        addPartition:false,
        partitionIsDefault:false,
        deletePartionDialog:false,
        deletepartitionContent:''

      }
    },
    created(){
        this.token = localStorage.getItem('token');//获取token
        this.projId = localStorage.getItem('projId');//获取项目projId
        this.floorAndSceneInit();//分层与楼层初始化
    },
    methods:{
        //新增竖向楼层列表
        addFlor(){
            this.addFloorList = true;
        },
        //确认添加
        makeAddFloorList(){
            console.log(this.setAsAuto)
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/updateStorey',
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
                    this.florData.forEach((item,index,arr)=>{
                        arr[index].Remark = '';
                        arr[index].IsDefault = false;
                    })
                    this.florData.push({
                        "index":this.florData.length+1,
                        "Name":this.FloorName,
                        "BottomHeight":this.FloorValue,
                        "IsDefault": this.setAsAuto,
                    });
                    //修改备注
                    this.florData.forEach((item,index,arr)=>{
                        if(item.IsDefault){
                          arr[index].Remark = '默认楼层';  
                        }
                    })
                    //清空输入框的值
                    this.FloorName = '';
                    this.FloorValue = '';
                    //console.log(response.data);
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }
            })
            this.addFloorList = false;
        },
        //取消添加
        cancleAddFloorList(){
            this.addFloorList = false;
        },
        //编辑竖向楼层
        listTableEdit(scope){
            this.floorIndex = scope.$index;

            this.setAsDefault = this.florData[this.floorIndex].IsDefault;
            this.FloorName = this.florData[this.floorIndex].Name;
            this.FloorValue = this.florData[this.floorIndex].BottomHeight;
            this.editFloorList = true;
        },
        makeEditFloorList(){
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/updateStorey',
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
                console.log(response.data);
                this.florData[this.floorIndex].Name = this.FloorName;
                this.florData[this.floorIndex].BottomHeight = this.FloorValue;
                //修改备注
                this.florData.forEach((item,index,arr)=>{
                    arr[index].Remark = '';
                    arr[index].IsDefault = false;
                    //console.log( arr[index].Remark)
                })
                this.florData[this.floorIndex].Remark = "默认楼层";
                this.florData[this.floorIndex].IsDefault = true;
               // console.log(this.florData[this.floorIndex].Remark)
                 //清空输入框的内容
                this.FloorName ='';
                this.FloorValue = '';
            })
            this.editFloorList = false;
        },
        cancleEditFloorList(){
            this.editFloorList = false;
            this.FloorName ='';
            this.FloorValue = '';
        },
        //删除竖向楼层
        deleteFloorRow(index){
            this.floorIndex = index;
            if(this.florData[index].IsDefault){
                alert('默认楼层不能删除');
            }else{  
                this.deleteFloorDialog = true;
            }
        },
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/deleteStorey',
                headers:{
                    'token':this.token
                },
                params:{
                    storeyId:this.florData[this.floorIndex].ID
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.florData.splice(this.floorIndex,1);
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
        //新增分区资源包
        addSource(){
            this.addpartitionShow = true;
        },
        addPartitionSure(){
            this.addpartitionShow = false;
        },
        addPartitionCancel(){
            this.addpartitionShow = false;
        },
        groundTableEdit(){

        },
        deleteRow(){

        },
        
        //分区与楼层初始化
        floorAndSceneInit(){
            axios({
                method:'get',
                url:this.baseUrl+'project2/Config/floorAndSceneInit',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd == '0'){
                    this.subProjects= response.data.rt.subProjects;//单体信息
                    this.partitionList = response.data.rt.partitionList;//建筑分区
                    console.log(this.partitionList)
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
            }).then(()=>{
                this.findStore(this.partitionList,0)
            })
        },
        //改变单体名称值 来改变建筑分区的值
        changeSubProjects(val){
            axios({
                method:'get',
                url:this.baseUrl+'project2/Config/getPartitionBySubProjId',
                headers:{
                    'token':this.token
                },
                params:{
                    subProjId:this.subProjects[val].id
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
        //获取楼层
        findStore(val,index){
            console.log(val);
            console.log(index);
            var nextUrl = '';
            if(val[index].ID){
                nextUrl = val[index].ID;
            }else{
                nextUrl = val[index].id;
            }
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/findStorey/'+nextUrl,
                headers:{
                    'token':this.token
                }
            }).then(response=>{
                //console.log(response.data);
                if(response.data.cd == '0' && response.data.rt.rows){
                    this.florData = response.data.rt.rows;
                    this.florData.forEach((item,index,arr)=>{
                        arr[index].index = index;
                        arr[index].Remark = '';
                        if(item.IsDefault){
                            arr[index].Remark = '默认楼层';
                        }
                    });
                    
                } 
            })
        },
        //编辑建筑分区
        editPartitionList(){
            this.editPartition = true;
            this.partitionName = this.partitionList[this.partitionIndex].name || this.partitionList[this.partitionIndex].Name;
            this.Area = this.partitionList[this.partitionIndex].areaValue || this.partitionList[this.partitionIndex].AreaValue;
        },
        cancleEditPartitionList(){
            this.partitionName ='';
            this.Area ='';
            this.editPartition = false;
        },
        makeEditPartitionList(){
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/updatePartition',
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
                    IsDefault:this.partitionList[this.partitionIndex].IsDefault,
                    Name:this.partitionName,
                    ParentID:this.partitionList[this.partitionIndex].ParentID,
                    Type:this.partitionList[this.partitionIndex].Type,
                    Unit:this.partitionList[this.partitionIndex].Unit
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.partitionListName[this.partitionIndex].label = this.partitionName;
                    this.partitionList[this.partitionIndex].AreaValue = this.Area;
                    this.partitionName ='';
                    this.Area ='';
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
            
            axios({
                method:'post',
                url:this.baseUrl+'project2/Config/updatePartition',
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
                console.log(response.data);
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.partitionListName.push({
                        label:this.partitionName,
                        value:this.partitionListName.length+1
                    })
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
        },
        cancleAddPartitionList(){
            this.partitionName ='';
            this.Area ='';
            this.addPartition = false;
        },
        //删除建筑分区
        deletePartitionList(){
            this.deletepartitionContent = this.partitionListName[this.partitionIndex].label;
            this.deletePartionDialog = true;
        },
        deletePartitionMakeSure(){
            axios({
                method:'get',
                url:this.baseUrl+'project2/Config/deletePartition',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    partitionId:this.partitionList[this.partitionIndex].ID
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data);
                    this.partitionListName.splice(this.partitionIndex,1);
                    this.partitionListValue = this.partitionListName[0].label;
                    this.deletePartionDialog = false;
                } else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }
            })
            
        },
        
    }
}
</script>
<style lang='less'>
    #pageIn{
        .wrapper{
            width: 100%;
        }
        .pageI{
            margin: 0 20px 0 15px;
        }
        .titleAll{
           color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            margin: 10px 20px 0 0px ;
            text-align: left; 
        }
        .titleAll span{
            display: inline-block;
            margin-left: 15px;
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
            margin-left: 21px;
            max-width: 290px;
        }
        .pageOption1{
            margin-left: 60px;
        }
        .pageOption label{
            color: #999;
            font-weight: normal;
            font-size: 14px;
            font-family: 'MicrosoftYaHei';
            display: inline-block;
            margin-right: 10px;
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
        .editBodyone,.editBodytwo{
            text-align: left;
        }
        .editInpText{
            display: inline-block;
            margin-left: 89px;
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
       
    }
    
</style>


