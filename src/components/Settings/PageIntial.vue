<template>
  <div class="wrapper" id="pageIntial">
      <h4 class="titleAll">分区与楼层配置</h4>
      <div class="pageInital">
        <div class="pageSelect">
            <div class="pageOption">
                <label>单位名称</label>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="pageOption">
                <label>建筑分区</label>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="pageBtn">
                <el-button class="btn" type="primary">+添加</el-button>
                <el-button class="btn" type="primary">编辑</el-button>
            </div>
        </div>
        <div class="flor">
            <h5 class="title"><img class="imgicon"  src="../../assets/columFloor.png"/> 竖向楼层<span @click="addFlor" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="pageTable"> 
                <el-table :data="florData" border style="width:95%">
                    <el-table-column label="序号" prop="index"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="标高值" prop="value"></el-table-column>
                    <el-table-column label="备注" prop="remarks" ></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <div class="iconDiv1 iconDiv"  @click="listTableEdit(scope)" ><img  class="iconImg editIcon"  src="../../assets/edit.png"/></div>
                            <div class="iconDiv2 iconDiv"  @click="deleteRow(scope.$index, florData)" ><img class="iconImg"  src="../../assets/delete.png"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div >
            <h5 class="title"><img class="imgicon"  src="../../assets/sourceBag.png"/> 分区资源包<span @click="addSource" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="sourceTable"> 
                <el-table :data="sourceData" border align="left" style="width:95%">
                    <el-table-column label="序号" prop="index"></el-table-column>
                    <el-table-column label="资源包名称" prop="sourceBagName"></el-table-column>
                    <el-table-column label="资源类型" prop="sourceType"></el-table-column>
                    <el-table-column label="资源名称" prop="sourceName"></el-table-column>
                    <el-table-column label="资源大小" prop="sourceSize"></el-table-column>
                    <el-table-column label="上传时间" prop="updateTime" ></el-table-column>
                    <el-table-column label="版本" prop="version"></el-table-column>
                    <el-table-column label="备注" prop="remarks"></el-table-column>
                    <el-table-column label="当前状态" prop="state"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope" >
                            <div class="iconDiv" @click="groundTableEdit(scope)"><img  class="iconImg editIcon"  src="../../assets/recircle.png"/></div>
                            <div class="iconDiv "><img  class="iconImg editIcon"  src="../../assets/info.png"/></div>
                            <div class="iconDiv " @click="deleteRow(scope.$index, sourceData)"><img  class="iconImg editIcon"  src="../../assets/delete.png"/></div>
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

      </div>
  </div>
</template>
<script>
export default {
  name:'PageIntial',
  data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        florData:[{
            index:'01',
            name:'极地楼层',
            value:'最小值',
            remarks:''

        }],
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
        }]
      }
    },
    methods:{
        addFlor(){
            console.log(123);
        },
        addSource(){
            console.log(345)
        },
        groundTableEdit(){

        },
        deleteRow(){

        },
        listTableEdit(){

        }

    }
}
</script>
<style lang='less'>
    #pageIntial{
        .wrapper{
            width: 100%;
        }
        .titleAll{
           color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            width: 95%;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            padding:0px 15px;
            margin: 10px 0px 0 0px ;
            text-align: left; 
        }
        .title{
            color: #fc343a;
            font-size: 18px;
            font-weight: bold;
            width: 95%;
            border-bottom:1px solid #ccc; 
            height: 50px;
            line-height: 50px;
            // padding:0px 15px;
            margin: 10px 15px 0 20px ;
            text-align: left;
        }

        .pageSelect{
            display: flex;
            margin-top: 20px;
            font-size: 0.8rem;
            color: #999999;
        }
        .pageOption{
            flex: 1;
            text-align: left;
            margin-left: 21px;
            max-width: 280px;
        }
        .pageBtn{
            width: 250px;
        }
        .btn{
            width: 95px;
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
        .imgicon {
            position: relative;
            top: 1px;
            margin-right: 12px;
        }
        .pageTable,.sourceTable{
            margin-left: 20px;
            margin-top: 30px;
            width: 100%;
            text-align: left;
        }
    }
    
</style>


