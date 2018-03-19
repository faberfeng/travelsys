<template>
  <div class="wrapper" id="groundSetting">
      <h4 class="title">场地与单体配置</h4>
      <div class="main">
        <div class="groundInfo groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-info.png"/>场地信息<img class="groundEdit" @click="groundInfoEdit" src="../../assets/ground-editpng.png"/></h5>
                <ul class="groundInfoInp">
                    <li><label>城市坐标系名称</label><el-input :disabled="canEdit" class="sInp"></el-input></li>
                    <li>
                        <label>场地原点</label>
                        <div>
                            <el-input :disabled="canEdit" class="sInp"></el-input> 
                        </div>
                        <div>
                            <el-input  :disabled="canEdit" class="sInp spe"></el-input>
                        </div>
                        <label>场地高程</label>
                        <div>
                            <el-input :disabled="canEdit"></el-input>    
                        </div>
                    </li>
                    <li>
                        <label>工程规模</label>
                        <div>
                            <el-input class="scale" :disabled="canEdit"></el-input>
                        </div>
                    </li>                
                </ul>
                <p><el-button @click="saveEdit" class="btn" type="primary">保存</el-button><el-button class="btn">取消</el-button></p>
        </div>
        <div class="groundSetting groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-setting.png"/>场景设置</h5>
            <div class="groundSettingBody">
                <div class="groundSettingBodyS">
                    <p>
                        <label>效果等级</label>
                        <el-select v-model="value">
                            <el-option v-for="(item,index) in options" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </p>
                    <p>
                        <label>场景事件</label>
                        <el-select v-model="value">
                            <el-option v-for="(item,index) in options" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </p>
                </div>
                <div class="groundSettingBodyP">
                    <label>整体亮度</label><div><el-slider v-model="value1"></el-slider></div>
                </div>
                <div class="groundSettingBodyC">
                    <el-checkbox v-model="checked">显示天空</el-checkbox>
                </div>
            </div>
        </div>
        <div class="singleList groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/single-list.png"/>单体列表<span @click="addList" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="listData" style="width:99%">
                    <el-table-column prop="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="单体名称"></el-table-column>
                    <el-table-column prop="coordinate" label="轴网基点坐标"></el-table-column>
                    <el-table-column prop="high" label="首层相对高度"></el-table-column>
                    <el-table-column prop="angle" label="轴网转角"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            
                            <el-button class="editIcon" @click="listTableEdit(scope)" type="text" size="small"><img  class="iconImg editIcon"  src="../../assets/edit.png"/></el-button>
                            <el-button class="deleteIcon" @click.native.prevent="deleteRow(scope.$index, listData)" type="text" size="small"><img class="iconImg"  src="../../assets/delete.png"/></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="groundSource groundTitle">
           <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-resource.png"/>场地资源包<span @click="addList" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="groundSourceData" style="width:99%">
                    <el-table-column prop="groundIndex" label="序号"></el-table-column>
                    <el-table-column prop="groundName" label="资源包名称"></el-table-column>
                    <el-table-column prop="groundCategroy" label="资源类型"></el-table-column>
                    <el-table-column prop="groundSourceName" label="资源名称"></el-table-column>
                    <el-table-column prop="groundSourceSize" label="资源包大小"></el-table-column>
                    <el-table-column prop="groundVersion" label="版本"></el-table-column>
                    <el-table-column prop="groundRemark" label="备注"></el-table-column>
                    <el-table-column prop="groundState" label="当时状态"></el-table-column>
                    <el-table-column prop="groundAction" label="操作">
                        <template slot-scope="scope">
                            <el-button class="editIcon" @click="groundTableEdit(scope)" type="text" size="small"><i class="el-icon-edit-outline"></i></el-button>
                            <el-button class="infoIcon" type="text" size="small"><i class="el-icon-info"></i></el-button>
                            <el-button class="deleteIcon" @click.native.prevent="deleteRow(scope.$index, groundSourceData)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagenation">   
                    <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
                </div>
                
            </div>
        </div>
      </div>
      <!--dialog-->
      <el-dialog class="openDialog" title="新增单体列表" :visible.sync="addListShow" :before-close="listClose">
            <el-form label-width="150px" label-position="right">
                <el-form-item label="序号">
                    <el-input v-model="addListindex"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="单体名称">
                    <el-input v-model="addListname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="轴网基点坐标">
                    <el-input v-model="addListcoordinate"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="首层相对高度">
                    <el-input v-model="addListhigh"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="轴网转角">
                    <el-input v-model="addListangle"  placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">   
                <el-button type="primary" @click="addListSure">确 定</el-button>
                <el-button @click="listClose">取 消</el-button>
            </span>
        </el-dialog> 
        <el-dialog title="修改单体列表" :visible.sync="editListShow" @click="listClose">
            <el-form label-width="150px" label-position="right" >
                <el-form-item label="序号">
                    <el-input v-model="addListindex"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="单体名称">
                    <el-input v-model="addListname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="轴网基点坐标">
                    <el-input v-model="addListcoordinate"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="首层相对高度">
                    <el-input v-model="addListhigh"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="轴网转角">
                    <el-input v-model="addListangle"  placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editListSure">确 定</el-button>
                <el-button @click="listClose">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增场地资源包" :visible.sync="addgroundShow" :before-close="groundClose">
            <el-form label-width="150px" label-position="right">
                <el-form-item label="序号">
                    <el-input v-model="groundIndex"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源包名称">
                    <el-input v-model="groundName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-input v-model="groundCategroy"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源名称">
                    <el-input v-model="groundSourceName"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源包大小">
                    <el-input v-model="groundSourceSize"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="groundVersion"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="groundRemark"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="当时状态">
                    <el-input v-model="groundState"  placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGroundSure">确 定</el-button>
                <el-button @click="groundClose">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改场地资源包" :visible.sync="editgroundShow" :before-close="groundClose">
            <el-form label-width="150px" label-position="right">
                <el-form-item label="序号">
                    <el-input v-model="groundIndex"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源包名称">
                    <el-input v-model="groundName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-input v-model="groundCategroy"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源名称">
                    <el-input v-model="groundSourceName"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="资源包大小">
                    <el-input v-model="groundSourceSize"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="groundVersion"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="groundRemark"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="当时状态">
                    <el-input v-model="groundState"  placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editGroundSure">确 定</el-button>
                <el-button @click="groundClose">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name:'GroundSettings',
  data(){
      return {
          value1:0,
          checked:false,
          canEdit:true,
          addListShow:false,
          addgroundShow:false,
          editgroundShow:false,
          editListShow:false,
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
          groundState:'',
          options: [{
            value: '选项1',
            label: '黄金糕'
            }, {
            value: '选项2',
            label: '双皮奶'
            }],
            listData:[{
                index: '01',
                name: '企业自用办公室',
                coordinate: '0.0',
                high:'47',
                angle:'0'
            }, {
                index: '02',
                name: '企业自用办公室',
                coordinate: '0.0',
                high:'47',
                angle:'0'
            }],
            groundSourceData:[{
                groundIndex: '01',
                groundName: 'yanshichangdi',
                groundCategroy: '场地',
                groundSourceName:'yanshichangdi',
                groundSourceSize:'3.39MB',
                groundVersion:'239',
                groundRemark:'2017-10-23 17:40',
                groundState:'加载'

            }, {
                groundIndex: '02',
                groundName: 'banggongqu_skin',
                groundCategroy: '场地',
                groundSourceName:'banggongqu_skin',
                groundSourceSize:'4.67MB',
                groundVersion:'241',
                groundRemark:'2017-10-23 17:40',
                groundState:'加载'
            }]
        }
    },
    methods:{
        groundInfoEdit(){
            this.canEdit = false;
            console.log(123);
        },
        saveEdit(){
            this.canEdit = true;
            console.log(123456);
        },
        addList(){
            this.addListShow = true;
        },
        addListSure(){
            this.listData.push({
                index: this.addListindex,
                name: this.addListname,
                coordinate: this.addListcoordinate,
                high:this.addListhigh,
                angle:this.addListangle
            });
            this.addListindex = '';
            this.addListname = '';
            this.addListcoordinate='';
            this.addListhigh='';
            this.addListangle='';
            setTimeout(()=>{
                this.addListShow = false;
            },0)
            
        },
        editListSure(){
            this.editListShow = false;
            this.listData[this.listIndexNumber].index = this.addListindex ,
            this.listData[this.listIndexNumber].name = this.addListname;
            this.listData[this.listIndexNumber].coordinate = this.addListcoordinate,
            this.listData[this.listIndexNumber].high = this.addListhigh;
            this.listData[this.listIndexNumber].angle = this.addListangle;
            //清空数据
            this.addListindex = '';
            this.addListname = '';
            this.addListcoordinate='';
            this.addListhigh='';
            this.addListangle='';
        },
        listTableEdit(index){
            this.listIndexNumber = index.$index;
            this.addListindex = this.listData[this.listIndexNumber].index,
            this.addListname = this.listData[this.listIndexNumber].name;
            this.addListcoordinate = this.listData[this.listIndexNumber].coordinate,
            this.addListhigh = this.listData[this.listIndexNumber].high;
            this.addListangle = this.listData[this.listIndexNumber].angle;
            this.editListShow = true;
            console.log(index.$index)
        },
        listClose(){
            this.addListShow = false;
            this.editListShow = false
             //清空数据
            this.addListindex = '';
            this.addListname = '';
            this.addListcoordinate='';
            this.addListhigh='';
            this.addListangle='';
            
        },
        groundSourceAdd(){
            this.addgroundShow = true;
        },
        addGroundSure(){
            this.groundSourceData.push({
                groundIndex: this.groundIndex,
                groundName: this.groundName,
                groundCategroy: this.groundCategroy,
                groundSourceName:this.groundSourceName,
                groundSourceSize:this.groundSourceSize,
                groundVersion:this.groundVersion,
                groundRemark:this.groundRemark,
                groundState:this.groundState,
            });
            this.groundIndex = '';
            this.groundName = '';
            this.groundCategroy='';
            this.groundSourceName='';
            this.groundSourceSize='';
            this.groundVersion='';
            this.groundRemark='';
            this.groundState='';
            this.addgroundShow = false;
        },
        groundTableEdit(index){
            this.groundIndexNumber = index.$index;
            this.groundIndex = this.groundSourceData[this.groundIndexNumber].groundIndex,
            this.groundName = this.groundSourceData[this.groundIndexNumber].groundName;
            this.groundCategroy = this.groundSourceData[this.groundIndexNumber].groundCategroy,
            this.groundSourceName = this.groundSourceData[this.groundIndexNumber].groundSourceName;
            this.groundSourceSize = this.groundSourceData[this.groundIndexNumber].groundSourceSize;
            this.groundVersion = this.groundSourceData[this.groundIndexNumber].groundVersion;
            this.groundRemark = this.groundSourceData[this.groundIndexNumber].groundRemark;
            this.groundState = this.groundSourceData[this.groundIndexNumber].groundState;

            console.log(index.$index);
            this.editgroundShow = true;
        },
        editGroundSure(){
            this.editgroundShow = false;
            this.groundSourceData[this.groundIndexNumber].groundIndex = this.groundIndex,
            this.groundSourceData[this.groundIndexNumber].groundName = this.groundName ;
            this.groundSourceData[this.groundIndexNumber].groundCategroy = this.groundCategroy;
            this.groundSourceData[this.groundIndexNumber].groundSourceName = this.groundSourceName;
            this.groundSourceData[this.groundIndexNumber].groundSourceSize = this.groundSourceSize;
            this.groundSourceData[this.groundIndexNumber].groundVersion = this.groundVersion;
            this.groundSourceData[this.groundIndexNumber].groundRemark = this.groundRemark;
            this.groundSourceData[this.groundIndexNumber].groundState = this.groundState;
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
        deleteRow(index, rows) {
            rows.splice(index, 1);
        }

    }
}
</script>
<style lang="less">
    #groundSetting{
        .wrapper{
            width: 100%;
        }
        .title{
            color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            width: 95%;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            padding:0px 15px;
            margin: 10px 0 0 0 ;
            text-align: left;
        }
        .groundTitle{
            width: 95%;
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
            margin: 20px 0 10px 0;
            border-bottom: 1px solid #ccc;
            height: 45px;
            line-height: 45px;
        }
        .groundInfoInp{
            display: inline-block;
            width: 100%;
            list-style: none;
            padding: 0;
            color: #999999;
            font-size: 14px;
        }
        .groundInfoInp li{
            display: inline-block;
            width: 100%;
            display: flex;
            margin: 15px 0;
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
        }
        .spe{
            margin-left: 10px;
        }
        .btn{
            width: 15%;
            max-width: 150px;
            min-width:70px;
        }

        .groundSettingBody{
            color: #999999;
            width: 100%;
        }
        .groundSettingBodyS{
            display: flex;
            font-size: 14px;
        }
        .groundSettingBodyS p{
            flex: 1;
            text-align: left;
        }
        .groundSettingBodyS label{
            width: 100px;
            height: 30px;
            display: inline-block;
        }
        .groundSettingBodyP{
            display:flex;
        }
        .groundSettingBodyP label{
            display: inline-block;
            width: 100px;
            height: 70px;
            line-height: 70px;
            text-align: left;
        }
        .groundSettingBodyP div{
            flex: 1;
            height: 30px;
            padding: 8px;
        }
        .groundSettingBodyC{
            text-align: left;
        }
        .groundTable{
            width: 100%;
            text-align: left;
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
        // .el-input__inner{
            
        // }
        .el-input.is-disabled .el-input__inner{
            height: 37px;
            background: #fafafa;
        }
        .groundEdit{
            float: right;
            position: relative;
            top: 15px;
            cursor: pointer;
        }
        .el-input__inner{
            height: 37px;
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

    }
    
</style>

