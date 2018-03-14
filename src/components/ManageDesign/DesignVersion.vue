<template>
    <div class="wrapper">
        <div class="header">
            <span>单体</span>
            <el-select v-model="value" placeholder="请选择" @change="valueChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">

                </el-option>
            </el-select>
        </div>
        <div class="table">
            <el-table border :data="tableData" style="width:100%;">
                <el-table-column label="版本号" prop="version"></el-table-column>
                <el-table-column label="相关空间" prop="action"></el-table-column>
                <el-table-column label="空间操作" prop="space"></el-table-column>
                <el-table-column label="相关内容节点" prop="domcontent"></el-table-column>
                <el-table-column label="节点操作" prop="domaction"></el-table-column>
                <el-table-column label="新增元素" prop="adddom"></el-table-column>
                <el-table-column label="更新元素" prop="updatedom"></el-table-column>
                <el-table-column label="删除元素" prop="deletedom"></el-table-column>
                <el-table-column label="元素总和" prop="domtotal"></el-table-column>
                <el-table-column label="更新用户" prop="updateuser"></el-table-column>
                <el-table-column label="更新时间" prop="updatetime"></el-table-column>
            </el-table>
        </div>
        
    </div>
</template>
<script>
export default {
  name:'DesignVersion',
  data(){
      return{
          options:[
              {
                  value:'全部',
                  label:'全部'
              },
              {
                  value:'企业自用办公楼',
                  label:'企业自用办公楼'
              }
          ],
          tableData:[
              {
                  version:'0',
                  action:'F1',
                  space:'不变',
                  domcontent:'Q1301_B1F~F1_STRUC.rvt',
                  domaction:'不变',
                  adddom:'0',
                  updatedom:'0',
                  deletedom:'408',
                  domtotal:'0',
                  updateuser:'王自强',
                  updatetime:'2017/10/18 09:46:05'

              },
              {
                  version:'0',
                  action:'BF1',
                  space:'不变',
                  domcontent:'Q1301_B1F~F1_STRUC.rvt',
                  domaction:'不变',
                  adddom:'0',
                  updatedom:'0',
                  deletedom:'1214',
                  domtotal:'-1214',
                  updateuser:'王自强',
                  updatetime:'2017/10/18 09:46:05'

              },

          ],
          value:'全部'
      }
  },
    methods:{
        valueChange(val){
            console.log(val);
        }
    }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
    }   
    .header{
        width: 100%;
        text-align: left;
        padding-top: 5px;
    }
    /* table表格 */
    .table{
        width: 100%;
        margin-top: 5px;
    }
</style>


