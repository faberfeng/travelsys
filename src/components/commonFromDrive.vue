<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="司机姓名">
        <el-input size="small" :clearable="true" v-model="formInline.driverName" placeholder="请输入司机姓名"></el-input>
    </el-form-item>
    <el-form-item label="车辆编号">
        <el-input size="small" :clearable="true" v-model="formInline.trafficName" placeholder="请输入车辆编号"></el-input>
    </el-form-item>
    <!-- <el-form-item label="所属车站">
        <el-input size="small" v-model="formInline.stationName" placeholder="请输入所属车站"></el-input>
    </el-form-item> -->
    <el-form-item label="乘务组">
        <el-select size="small" :clearable="true" v-model="formInline.group" placeholder="所属班组">
            <el-option label="乘务一组" value="乘务一组"></el-option>
            <el-option label="乘务二组" value="乘务二组"></el-option>
            <el-option label="乘务三组" value="乘务三组"></el-option>
            <el-option label="乘务四组" value="乘务四组"></el-option>
            <el-option label="高峰班组" value="高峰班组"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="时间">
        <el-date-picker
            size="small"
            v-model="formInline.time"
            type="datetime"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker> 
    </el-form-item>
    <el-form-item>
        <el-button size="small" icon="el-icon-search" class="bgcolor" type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
    props:['formdata'],
    data() {
      return {
        formInline: {
          driverName: '',
          trafficName: '',
          stationName:'',
          group:'',
          time:new Date()
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    watch:{
      'formdata':{
        handler(newVal,oldVal){
          this.formInline.time=newVal.time?newVal.time:new Date();
          this.formInline.driverName=newVal.driverName;
        }
      }
    },
    methods: {
      onSubmit() {
          // this.formInline.time = new Date();
          this.$emit('onSubmit',this.formInline)
      }
    }

}
</script>

<style lang="less" scoped>
/deep/ input.el-input__inner{
  background-color:rgb(31, 58, 115);
  border:none;
  color: #86909C;
}
/deep/ .el-picker-panel.el-date-picker.el-popper.has-sidebar.has-time{
  background-color: rgb(28, 53, 100);

}
/deep/ .el-picker-panel__sidebar{
 background-color: rgb(28, 53, 100);
}
/deep/ .bgcolor{
  background: #165DFF;
  border: none;
}
/deep/ .el-form-item__label{
  color: #fff;
}
/deep/ .el-select-dropdown.el-popper{
  background: none;
  border:1px solid rgb(28, 53, 100);
}
</style>