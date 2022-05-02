<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="车辆编号">
        <el-input size="small" :clearable="true" v-model="formInline.trafficName" placeholder="请输入车辆编号"></el-input>
    </el-form-item>
    <el-form-item label="司机姓名">
        <el-input size="small" :clearable="true" v-model="formInline.driverName" placeholder="请输入司机名称"></el-input>
    </el-form-item>
    <!-- <el-form-item label="当前位置">
        <el-select size="small" v-model="formInline.region" placeholder="当前位置">
            <el-option label="彭浦新村" value="ppxc"></el-option>
            <el-option label="汶水路" value="wsl"></el-option>
        </el-select>
    </el-form-item> -->
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
        <el-button size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
  props:['formdata'],
    data() {
      return {
        formInline: {
          trafficName: '',
          driverName: '',
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
          this.formInline.trafficName=newVal.trafficID;
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

<style>

</style>