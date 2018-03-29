<template>
  <div class="wrapper">
      <h4 class="title"><span>工程日志管理</span></h4>
      <div class="selectMode">
          <label>筛选</label>
          <div class="block">
            <el-date-picker
                v-model="loggerDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange">
            </el-date-picker>
        </div>
        <div class="btn">
            <el-button type="primary" @click="queryLogger">查询</el-button>
        </div>
      </div>
      <div class="projectTable">
        <el-table class="table" border :data="enterpriseLoggerData" style="width:95%">
            <el-table-column prop="operateUser" label="操作人"></el-table-column>
            <el-table-column prop="operateContent" label="事件"></el-table-column>
            <el-table-column prop="operateTime" label="操作时间"></el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="pagenation">   
        <div class="pagination">
            <el-pagination
                :page-sizes="[25,50,75]"
                 layout="total, sizes, prev, pager, next, jumper"
                :total="totalLoggerNumber"
                @size-change="pageSizeChange"
                @current-change="currentPageChange">
            </el-pagination>
        </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name:'ProjectLoggerManage',
  data(){
      return{
        enterpriseLoggerData:[],
        loggerDate:[],
        baseUrl:'http://10.252.26.240:8080/h2-bim-project/',
        token:'',
        projId:'',
        totalLoggerNumber:0,
        pageNo:0,
        pageSize:25,
        startDay:'',
        endDay:''
      }
  },
  created(){
      this.token = localStorage.getItem('token');
      this.projId = localStorage.getItem('projId');
      this.getEnterpriseAuthorization();
  },
  methods:{
      //企业日志权限判断
      getEnterpriseAuthorization(){
          axios({
              method:'get',
              url:this.baseUrl+'project2/log/'+this.projId+'/index',
              headers:{
                  'token':this.token
              }
          }).then(response=>{
              if(response.data.cd == '0'){
                  this.getLoggerList(this.pageNo,this.pageSize);
              }else if(response.data.cd == '-1'){
                  alert(response.data.msg)
              }else{
                  this.$router.push({
                      path:'/login'
                  })
              }
          })
      },
      //获取日志列表
      getLoggerList(index,number,start,end){
          axios({
              method:'post',
              url:this.baseUrl+'project2/log/'+this.projId+'/list',
              headers:{
                  'token':this.token
              },
              data:{
                pageNo:index,
                pageSize:number,
                start:start,
                end:end
              }
          }).then(response=>{
              if(response.data.cd == '0'){
                this.enterpriseLoggerData = response.data.rt.rows;
                this.enterpriseLoggerData.forEach((item,index,arr)=>{
                    arr[index].operateTime = new Date(item.operateTime).toLocaleString();
                });
                this.totalLoggerNumber = response.data.rt.pager.totalSize;
              }else if(response.data.cd == '-1'){
                  alert(response.data.cd)
              }else{
                  this.$router.push({
                      path:'/login'
                  })
              }
          })
      },
      //分页改动加载数据
      pageSizeChange(val){
          console.log(val)
          this.getLoggerList(this.pageNo,this.pageSize,this.startDay,this.endDay);
      },
      currentPageChange(val){
          this.pageNo = val;
          this.getLoggerList(this.pageNo,this.pageSize,this.startDay,this.endDay);
      },
      //日期选择
      dateChange(){
          if(this.loggerDate){
                this.startDay = new Date(this.loggerDate[0]).toLocaleString().split(' ')[0].split('/').join('-');
                this.endDay = new Date(this.loggerDate[1]).toLocaleString().split(' ')[0].split('/').join('-');
          }else{
              this.startDay = '';
              this.endDay = '';
          }
          
      },
      //查询 可复用getLoggerList（）函数
      queryLogger(){
        this.getLoggerList(this.pageNo,this.pageSize,this.startDay,this.endDay);
      }
  }
}
</script>
<style scoped>
    .wrapper{
        width: 100%;
    }
    .title{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        border-bottom:1px solid #ccc; 
        height: 50px;
        line-height: 50px;
        margin: 10px 20px 0 0px ;
        text-align: left;
    }
    .title span{
        width: 50%;
        margin-left: 15px;
    }
    .selectMode{
        display: flex;
        margin-top: 20px;
        height: 70px;
    }
    .selectMode label{
        width: 100px;
        height: 40px;
        line-height: 40px;
    }
    .block{
        flex: 1;
        text-align: left;
    }
    .btn{
        width: 100px;
        height: 40px;
        display: inline-block;
        margin-right: 10px;
    }
    .pagenation{
        text-align: right;
        margin: 5px 20px 0 15px;
        height: 50px;
    }
    .el-pagination{
            padding: 0;
    }
    .projectTable{
        width: 100%;
        text-align: left;
        margin: 0 20px 0 15px;
    }
</style>