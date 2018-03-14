<template>
  <div class="wrapper">
      <h4 class="title">分区与楼层配置</h4>
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
            <h5 class="title"><i class="el-icon-document"></i> 竖向楼层<span @click="addFlor" class="add"><i class="el-icon-plus"></i>新增</span></h5>
            <div class="pageTable"> 
                <el-table :data="florData" border style="width:95%">
                    <el-table-column label="序号" prop="index"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="标高值" prop="value"></el-table-column>
                    <el-table-column label="备注" prop="remarks" ></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <span class="iconEdit"><i class="el-icon-document"></i></span>
                            <span class="iconDelete"><i class="el-icon-delete"></i></span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div >
            <h5 class="title"><i class="el-icon-document"></i> 分区资源包<span @click="addSource" class="add"><i class="el-icon-plus"></i>新增</span></h5>
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
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <span class="iconEdit"><i class="el-icon-document"></i></span>
                            <span class="iconInfo"><i class="el-icon-info"></i></span>
                            <span class="iconDelete"><i class="el-icon-delete"></i></span>
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
        }
    }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
    }
    .title{
        color: red;
        width: 100%;
        border-bottom:1px solid #ccc; 
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding:10px 0px;
        margin: 0;
    }

    .pageSelect{
        display: flex;
        margin-top: 20px;
        font-size: 0.8rem;
        color: #999999;
    }
    .pageOption{
        flex: 1;
    }
    .pageBtn{
        width: 200px;
    }
    .add{
        float: right;
        color: #336699;
        cursor: pointer;
    }
    .flor{
        width: 100%;
    }
    .pageTable{
        width: 100%;
        margin-top: 20px;
        text-align: left;
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
    .sourceTable{
        width: 100%;
        margin-top: 20px;
    }
    .pagination{
        width: 100%;
        text-align: right;
        margin-top: 10px;
    }
</style>


