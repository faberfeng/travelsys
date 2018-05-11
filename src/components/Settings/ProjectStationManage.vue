<template>
  <div class="wrapper" id="projectStation">
      <h4 class="sTitle"><span>工程动态管理</span></h4>
      <div class="stationManage">
          <div class="selectMode">
            <label>筛选</label>
            <div class="block">
                    <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期"  @change="dateChange1"></el-date-picker>
                    <span class="yi"></span>
                    <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期"  @change="dateChange2"></el-date-picker>
                <!-- <el-date-picker
                    v-model="loggerDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" @change="dateChange">
                </el-date-picker> -->
            </div>
            <button class="queryBtn" @click="queryProjectStation">查询</button>
        </div>
        <div class="project">
            <ul class="projectList">
                    <li v-for="(item,index) in projectStationList" :key="index">
                        <div class="projectListInfo">
                            <div class="projectListImg">
                                <img :src="'http://10.252.26.240:8080/qjbim-file/'+item.userImg">
                            </div> 
                            <div class="projectListText">
                                <p class="title"><label class="projectListTextName">{{item.userName}}</label><span :title="item.subTitle"  class="projectList-detial">{{item.content}}</span></p>
                                <p class="font-color1">{{item.title}}</p>
                                <p class="projectBottom">{{item.date | toLocalD}}<label>{{item.fromIn}}</label></p>
                            </div>
                        </div>
                    </li>
                </ul>
        </div>
        <div class="pagenation">   
            <div class="pagination">
                <el-pagination
                    :page-sizes="[10,20,30,40,50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalInfoNumber"
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
  name:'ProjectStationManage',
  data(){
      return{
        loggerDate:'',
        BDMSUrl:'',
        token:'',
        projId:'',
        projectStationList:[],
        isAuthorization:false,
        totalInfoNumber:0,
        pageNo:0,
        pageSize:10,
        startDay:'',
        endDay:''
      }
  },
  created(){
      var vm = this
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getAuthorization();

  },
  filters:{
      toLocalD(val){
          return new Date(val).toLocaleString();
      }
  },
  methods:{
      //工程动态页面权限判断
    getAuthorization(){
        axios({
            method:'get',
            url:this.BDMSUrl+'project2/dynamic/'+this.projId+'/index',
            headers:{
                'token':this.token
            }
        }).then(response=>{
            if(response.data.cd == '0'){
                this.isAuthorization = true;
            }else if(response.data.cd == '-1'){
                alert(response.data.msg)
            }else{
                this.$router.push({
                    path:'/login'
                })
            }
        }).then(()=>{
            this.getUserInfoList(this.pageNo,this.pageSize);
        })
    },
    //获取用户动态信息列表
    getUserInfoList(index,number,start,end){
        axios({
            method:'post',
            url:this.BDMSUrl+'project2/dynamic/project/'+this.projId+'/list',
            headers:{
                token:this.token
            },
            data:{
                pageNo:index,
                pageSize:number,
                start:start,
                end:end
            }
        }).then(response=>{
            if(response.data.cd == '0'){
                this.projectStationList = response.data.rt.rows;
                this.totalInfoNumber =  response.data.rt.pager.totalSize;
            }else if(response.data.cd == '-1'){
                alert(response.data.msg)
            }else{
                this.$router.push({
                    path:'/login'
                })
            }
            
        })
    },
    //每页条数改变时
    pageSizeChange(val){
        this.pageSize = val;
        this.getUserInfoList(this.pageNo,this.pageSize,this.startDay,this.endDay);
    },
    //当前页改变时
    currentPageChange(val){
        this.pageNo=val;
        this.getUserInfoList(this.pageNo,this.pageSize,this.startDay,this.endDay);
    },
    //按日期查询
    queryProjectStation(){
        this.getUserInfoList(this.pageNo,this.pageSize,this.startDay,this.endDay);
    },
    //日期选择
    dateChange1(){
        if(this.startDay){
            this.startDay = new Date(this.startDay).toLocaleString().split(' ')[0].split('/').join('-'); 
        }else{
            this.startDay = '';
        }
        console.log(this.startDay);
      },
      dateChange2(){
        if(this.endDay){
            this.endDay = new Date(this.endDay ).toLocaleString().split(' ')[0].split('/').join('-');
        }else{
            this.endDay = '';
        }
        console.log(this.endDay);
      },
  }
}
</script>
<style lang="less">
    #projectStation{
        .stationManage{
            margin: 0 20px 0 15px;
            
        }
        .sTitle{
            border-bottom:1px solid #ccc; 
            margin: 0px 20px 0 0px ;
            text-align: left;
        }
        
        .sTitle span{
            display: inline-block;
            margin: 22px 0 12px 15px;
            color: #fc343a;
            font-size: 18px;
            line-height: 18px;
            font-weight: bold;
        }
        .selectMode{
            display: flex;
            margin: 20px 0px 0 0;
            border-bottom: 1px solid #ccc;
            padding-bottom: 30px;
        }
        .selectMode label{
            text-align: left;
            height: 36px;
            margin-right: 20px;
            line-height: 36px;
            font-size: 14px;
            font-weight: normal;
            color: #666;
        }
        // .block{
        //     flex: 1;
        //     text-align: left;
        // }
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

        .project{
            margin: 20px 0px 0 0px;
        }
        .projectList{
                width: 100%;
                list-style: none;
                overflow: auto;
                padding-left: 0;
                margin-top: 0px;
                
        }
        .projectList li{
            display: inline-block;
            width: 100%;
            margin-top: 5px; 
            border-bottom:1px solid #ebebeb;
        }
        .projectListInfo{
            width: 100%;
            overflow: hidden;
            display: flex;
        }
        .projectListImg{
            width: 80px;
            float: left;
        }
        .projectListText{
            font-size: 12px;
            flex: 1;
            margin: 0 2px;
            float: left;
            text-align: left;
        }
        .projectListText .title{
            width: 100%;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 16px;
            font-weight: bold;
        }
        .title span{
            font-size: 14px;
            display: inline-block;
            margin-left: 20px;
            color: #666;
            position: relative;
            top: 10px;
        }
        .projectListText .title a{
            float: right;
            width: 100px;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            color: #999;
            line-height: 45px;
        }
        .projectListText .title a:hover{
            color: #fc3439;
        }
        .projectListText .title a .el-icon-arrow-right{
            margin-left: 1px;
        }
        .projectListBtn{
            width: 20%;
            float: left;
        }
        .projectList img{
            width: 48px;
            height: 48px;
            border-radius:48px; 
            margin: 15px 12px 10px;
        }
        .projectListTextName{
            font-size: 18px;
            font-family: '微软雅黑';
            font-weight: bold;
            display: inline-block;
            /* float: left; */
        }
        .projectBottom{
            width: 100%;
            font-size: 12px;
            font-family: '微软雅黑';
            overflow: hidden;
            color: #ccc;
            margin-top: 20px;
            margin-bottom: 6px;
        }
        .projectBottom label{
            display: inline-block;
            width: 30%;
            margin-left: 20px;
        }
        .font-color1{
            color: #333;
            font-size: 14px;
        }
        .projectList-detial{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 500px;
        }
        .pagenation{
            text-align: right;
            margin: 20px 0px 0 0px;
            height: 50px;
        }
        .el-pagination{
            padding: 0;
        }
        /*日期选择器*/
        .el-date-editor{
            height: 36px;
            width: 146px;
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
    }
    
</style>
