<template>
  <div class="wrapper">
    <h4 class="title"><span>设计结构分类编码</span></h4>
    <div class="manageWorktool">
        <span class="worktooltitle">分类编码</span>
        <button class="btn"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
    name:'ConstructorDesignMapped',
    data(){
        return {
            token:'',
            projId:'',
            baseUrl:'http://10.252.26.240:8080/h2-bim-project/project2/',
            page:'0',
            rows:'20'
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.getGeniceClassMapItem();
        this.getGeniceClassMapJson();
    },
    methods:{
        //获取分类映射信息
        getGeniceClassMapItem(){
            
            axios({
                method:'post',
                url:this.baseUrl+'Config/getGenieClassMapItem',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    page:this.page,
                    rows:this.rows
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data)
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        getGeniceClassMapJson(){
            axios({
                method:'post',
                url:this.baseUrl+'Config/getGenieClassJson',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    console.log(response.data)
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
   .wrapper{
        width: 100%;
    }
    .title{
        border-bottom:1px solid #ccc; 
        margin: 0 ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        margin-left: 15px;
        color: #fc343a;
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        margin: 22px 0 12px 15px;
    }
    .manageWorktool{
        margin: 0 20px 0 15px;
        text-align: left;
    }
    .worktooltitle{
        color:#fc3439;
        display: inline-block;
        width: 50%;
        text-align: left;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        margin: 0;
        text-align: left;
        margin: 30px 0 20px;
    }   
    .btn{
        width: 96px;
        height: 32px;
        border: none;
        border-radius: 2px;
        float: right;
        margin: 22px 0 12px 0;
        cursor: pointer;
        background: #fc3439;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .btn:hover{
        background: #ff5257
    }
    .btn i{
        margin-right: 10px;
    }

</style>