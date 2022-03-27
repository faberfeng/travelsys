<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="司机姓名">
        <el-input size="small" v-model="formInline.user" placeholder="审批人"></el-input>
    </el-form-item>
    <el-form-item label="车辆编号">
        <el-input size="small" v-model="formInline.user" placeholder="审批人"></el-input>
    </el-form-item>
    <el-form-item label="当前位置">
        <el-select size="small" v-model="formInline.region" placeholder="活动区域">
            <el-option label="彭浦新村" value="ppxc"></el-option>
            <el-option label="共康路" value="gkl"></el-option>`
        </el-select>
    </el-form-item>
    <el-form-item label="时间">
        <el-date-picker
            size="small"
            v-model="formInline.time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker>
        
    </el-form-item>
    <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
      return {
        formInline: {
          user: '',
          region: '',
          time:''
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      onSubmit(formInline) {
          this.$emit('onSubmit',formInline)
        console.log('submit!');
      }
    }

}
</script>

<style>

</style>