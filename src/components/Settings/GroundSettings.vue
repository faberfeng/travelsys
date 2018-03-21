<template>
  <div class="wrapper" id="groundSetting">
      <h4 class="title">场地与单体配置</h4>
      <div class="main">
        <div class="groundInfo groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-info.png"/>场地信息<span :class="[{'groundEdit-active':!canEdit},'groundEdit']" @click="groundInfoEdit"></span></h5>
            <div :class="[{'groundInfoInp-active':!canEdit},'groundInfoInp']">
                <ul>
                    <li><label>城市坐标系名称</label><el-input :disabled="canEdit" class="sInp"></el-input></li>
                    <li>
                        <label>场地原点</label>
                        <div>
                            <el-input :disabled="canEdit" class="sInp icon-X" placeholder="0.0"></el-input> 
                        </div>
                        <div>
                            <el-input  :disabled="canEdit" class="sInp spe icon-Y" placeholder="0.0"></el-input>
                        </div>
                        <label style="width:95px;">场地高程</label>
                        <div>
                            <el-input :disabled="canEdit" class="icon-Z" placeholder="0.0"></el-input>    
                        </div>
                    </li>
                    <li>
                        <label>工程规模</label>
                        <div>
                            <el-input class="scale icon-size" :disabled="canEdit" ></el-input>
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
                        <el-select v-model="value" class="elSelect">
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
                    <label>整体亮度</label><div><el-slider class="slider_P" v-model="value1"></el-slider></div>
                </div>
                <div class="groundSettingBodyC">
                    <el-checkbox v-model="checked">显示天空</el-checkbox>
                </div>
                <p v-show="!canEditCj" style="margin-bottom:-6px;"><el-button @click="saveEditCJ" class="btn btn-save" type="primary">保存</el-button><el-button class="btn btn-cancle" @click="groundInfoEditCJ">取消</el-button></p>
            </div>
        </div>
        <div class="singleList groundTitle">
            <h5 class="accountTitle"><img class="imgicon" src="../../assets/single-list.png"/>单体列表<span @click="addList" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="listData" style="width:100%">
                    <el-table-column prop="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="单体名称"></el-table-column>
                    <el-table-column prop="coordinate" label="轴网基点坐标"></el-table-column>
                    <el-table-column prop="high" label="首层相对高度"></el-table-column>
                    <el-table-column prop="angle" label="轴网转角"></el-table-column>
                    <el-table-column prop="action" label="操作" width="150">
                        <template slot-scope="scope" >
                            <div class="iconDiv1 iconDiv"  @click="listTableEdit(scope)" ><img  class="iconImg editIcon"  src="../../assets/edit.png"/></div>
                            <div class="iconDiv2 iconDiv"  @click="deleteRow(scope.$index, listData)" ><img class="iconImg"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="groundSource groundTitle">
           <h5 class="accountTitle"><img class="imgicon" src="../../assets/ground-resource.png"/>场地资源包<span @click="addList" class="groundIcon"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="groundTable">
                <el-table class="table" border :data="groundSourceData" style="width:100%">
                    <el-table-column prop="groundIndex" label="序号"></el-table-column>
                    <el-table-column prop="groundName" label="资源包名称"></el-table-column>
                    <el-table-column prop="groundCategroy" label="资源类型"></el-table-column>
                    <el-table-column prop="groundSourceName" label="资源名称"></el-table-column>
                    <el-table-column prop="groundSourceSize" label="资源包大小"></el-table-column>
                    <el-table-column prop="groundVersion" label="版本"></el-table-column>
                    <el-table-column prop="groundRemark" label="备注"></el-table-column>
                    <el-table-column prop="groundState" label="当时状态"></el-table-column>
                    <el-table-column prop="groundAction" label="操作" width='120'>
                        <template slot-scope="scope" >
                            <div class="iconDiv" @click="groundTableEdit(scope)"><img  class="iconImg editIcon"  src="../../assets/recircle.png"/></div>
                            <div class="iconDiv "><img  class="iconImg editIcon"  src="../../assets/info.png"/></div>
                            <div class="iconDiv " @click="deleteRow(scope.$index, groundSourceData)"><img  class="iconImg editIcon"  src="../../assets/delete.png"/></div>
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
          canEditCj:true,
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
            this.canEdit = this.canEdit?false:true;
        },
        saveEdit(){
            this.canEdit = true;
        },
         groundInfoEditCJ(){
            this.canEditCj = this.canEditCj?false:true;
        },
        saveEditCJ(){
            this.canEditCj = true;
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
            width: 96%;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            padding:0px 15px;
            margin: 10px 20px 0 0 ;
            text-align: left;
        }
        .groundTitle{
            width: 97%;
            padding-left: 20px;
            // margin-right: 20px;
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
        .icon-size::after{
            display: block;
            position: absolute;
            right: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: '平方米';
        }
        .icon-X::after{
            display: block;
            position: absolute;
            left: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: 'X=';
        }
        .icon-Y::after{
            display: block;
            position: absolute;
            left: 12px;
            top: 13px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            content: 'Y=';
        }
        .icon-Z::after{
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

