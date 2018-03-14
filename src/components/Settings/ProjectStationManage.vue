<template>
  <div class="wrapper">
      <h4 class="title">工程动态管理</h4>
      <div class="selectMode">
          <label>筛选</label>
          <div class="block">
            <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="btn">
            <el-button type="primary">查询</el-button>
        </div>
      </div>
      <div class="project">
          <ul class="projectList">
                <li>
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img src="http://q.qjbim.com/qjbim-file//upload/static/user_default_05.png"/>
                        </div> 
                        <div class="projectListText">
                            <p class="titleM"><strong>tyty</strong><a>查看文档<i class="el-icon-arrow-right"></i></a></p>
                            <p >在【工程文档】中【默认群组】内上传了文件【 WKPT_MEP_11F(2017.9.25定).gmd】</p>
                            <p class="projectBottom">2018-01-31 15:42:07<label>来自网页浏览器</label></p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="projectListInfo">
                        <div class="projectListImg">
                            <img src="http://q.qjbim.com/qjbim-file//upload/static/user_default_05.png"/>
                        </div> 
                        <div class="projectListText">
                            <p class="titleM"><strong>tyty</strong><a>查看文档<i class="el-icon-arrow-right"></i></a></p>
                            <p >在【工程文档】中【默认群组】内上传了文件【 WKPT_MEP_11F(2017.9.25定).gmd】</p>
                            <p class="projectBottom">2018-01-31 15:42:07<label>来自网页浏览器</label></p>
                        </div>
                    </div>
                </li>                 
            </ul>
      </div>
      <div class="pagenation">   
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name:'ProjectStationManage',
  data(){
      return{
        value6:''
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
    .selectMode{
        display: flex;
        margin-top: 20px;
        height: 70px;
        border-bottom: 1px solid #e6e6e6;
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

    .project{
        margin-top: 20px;
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
        background:#e0f0fd;
        margin-top: 5px; 
    }
    .projectListInfo{
        width: 100%;
        overflow: hidden;
        display: flex;
    }
    .projectListImg{
        width: 100px;
        float: left;
    }
    .projectListText{
        font-size: 12px;
        flex: 1;
        margin: 0 2px;
        float: left;
        text-align: left;
    }
    .projectListText .titleM{
        width: 100%;
    }
    .projectListText .titleM a{
        float: right;
        width: 100px;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        color: #ccc;
    }
    .projectListText .titleM a:hover{
        color: red;
    }
    .projectListBtn{
        width: 20%;
        float: left;
    }
    .projectList img{
        width: 50px;
        height: 50px;
        border-radius:50px; 
        margin-top: 10px;
    }
    .pagenation{
        text-align: right;
    }
</style>
