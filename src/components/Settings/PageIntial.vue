<template>
  <div class="wrapper" id="pageIn">
      <h4 class="titleAll">分区与楼层配置</h4>
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
                <button class="addBtn">+添加</button>
                <button class="editBtn">编辑</button>
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
        <el-dialog title="新增竖向楼层" :visible.sync="addFloorList" @click="cancleAddFloorList">
            <el-form label-width="150px" label-position="right" >
                <el-form-item label="楼层名称">
                    <el-input v-model="FloorName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="楼层标高">
                    <el-input v-model="FloorValue"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-checkbox v-model="setAsAuto">设置为默认楼层</el-checkbox>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="makeAddFloorList">确 定</el-button>
                <el-button @click="cancleAddFloorList">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑竖向楼层-->
        <el-dialog title="编辑竖向楼层" :visible.sync="editFloorList" @click="cancleEditFloorList">
            <el-form label-width="150px" label-position="right" >
                <el-form-item label="楼层名称">
                    <el-input v-model="FloorName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="楼层标高">
                    <el-input v-model="FloorValue"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-checkbox v-model="setAsDefault">设置为默认楼层</el-checkbox>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="makeEditFloorList">确 定</el-button>
                <el-button @click="cancleEditFloorList">取 消</el-button>
            </span>
        </el-dialog>
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
        FloorName:'',
        FloorValue:'',

        Remark:'',
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
                    this.florData.push({
                        "index":this.florData.length+1,
                        "Name":this.FloorName,
                        "BottomHeight":this.FloorValue
                    });
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
           // console.log(this.florData[this.floorIndex].IsDefault);
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
                this.florData[this.floorIndex].Remark = "默认楼层";
                this.florData.forEach((item,index,arr)=>{
                    arr[index].Remark = '';
                })
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
        addSource(){
            console.log(345)
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
                    //console.log(this.partitionList)
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
                    axios({
                        method:'post',
                        url:this.baseUrl+'project2/Config/findStorey/'+this.partitionList[0].id,
                        headers:{
                            'token':this.token
                        }
                    }).then(response=>{
                        if(response.data.cd == '0'){
                            this.florData = response.data.rt.rows;
                            this.florData.forEach((item,index,arr)=>{
                                arr[index].index = index;
                                if(item.IsDefault){
                                    arr[index].Remark = '默认楼层';
                                }
                            })
                        console.log(response.data);
                        } 
                    })
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
                console.log(response.data);
                if(response.data.cd == '0' && response.data.rt.rows){
                    this.florData = response.data.rt.rows;
                    this.florData.forEach((item,index,arr)=>{
                        arr[index].index = index;
                        if(item.IsDefault){
                            arr[index].Remark = '默认楼层';
                        }
                    });
                    
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
            margin: 10px 20px 0 15px ;
            text-align: left; 
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
            width: 250px;
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


