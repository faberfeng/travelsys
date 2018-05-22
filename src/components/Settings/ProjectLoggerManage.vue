<template>
    <div class="wrapper">
        <h4 class="title"><span>工程日志管理</span></h4>
        <div class="loggerManage">
            <div class="selectMode">
                <label>筛选</label>
                <div class="block">
                    <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期"  @change="dateChange1"></el-date-picker>
                    <span class="yi"></span>
                    <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期"  @change="dateChange2"></el-date-picker>
                </div>
                <button class="queryBtn"  @click="queryLogger">查询</button>
            </div>
            <div class="projectTable">
                <el-table class="table" border :data="enterpriseLoggerData" style="width:100%">
                    <el-table-column prop="operateUser" label="操作人" width="200px"></el-table-column>
                    <el-table-column prop="operateContent" label="事件"></el-table-column>
                    <el-table-column prop="operateTime" label="操作时间" width="250px"></el-table-column>
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
        BDMSUrl:'',
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
      var vm = this
      this.token = localStorage.getItem('token');
      this.projId = localStorage.getItem('projId');
      vm.BDMSUrl = vm.$store.state.BDMSUrl
      this.getEnterpriseAuthorization();
  },
  methods:{
      //企业日志权限判断
      getEnterpriseAuthorization(){
          axios({
              method:'get',
              url:this.BDMSUrl+'project2/log/'+this.projId+'/index',
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
              url:this.BDMSUrl+'project2/log/'+this.projId+'/list',
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
          this.getLoggerList(this.pageNo,this.pageSize,this.startDay,this.endDay);
      },
      currentPageChange(val){
          this.pageNo = val;
          this.getLoggerList(this.pageNo,this.pageSize,this.startDay,this.endDay);
      },
      //日期选择
      dateChange1(){
            if(this.startDay){
                this.startDay = new Date(this.startDay).toLocaleString().split(' ')[0].split('/').join('-'); 
            }else{
                this.startDay = '';
            }
      },
      dateChange2(){
            if(this.endDay){
                this.endDay = new Date(this.endDay ).toLocaleString().split(' ')[0].split('/').join('-');
            }else{
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
    .loggerManage{
        margin: 0 20px 0 15px;
    }
    .title{
        border-bottom:1px solid #ccc; 
        margin: 0px 20px 0 0px ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        color: #fc343a;
        font-weight: bold;
        font-size: 18px;
        line-height: 18px;
        margin: 22px 0 12px 15px;

    }
    .selectMode{
        display: flex;
        margin-top: 30px;
    }
    .selectMode label{
        height: 36px;
        text-align: left;
        line-height: 36px;
        display: inline-block;
        margin-right: 20px;
        font-size: 14px;
        font-weight: normal;
        color: #666;
    }
    /* .block{
        height: 36px;
    } */
    .queryBtn{
        width: 111px;
        height: 36px;
        display: inline-block;
        background: #fc3439;
        border: none;
        border-radius: 2px;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
        padding: 0;
        margin-left: 20px;
        cursor: pointer;
    }
    .pagenation{
        text-align: right;
        margin: 20px 0px 0 0px;
        height: 50px;
    }
    .el-pagination{
            padding: 0;
    }
    .projectTable{
        width: 100%;
        text-align: left;
        margin-top: 30px;
    }
    .yi{
        width: 13px;
        height: 0px;
        margin: 0 10px;
        display: inline-block;
        border-bottom: 1px solid #333;
        position: relative;
        top: -3px;
    }
    /*日期选择器*/
    .el-date-editor{
        height: 36px;
        width: 146px;
    }
</style>