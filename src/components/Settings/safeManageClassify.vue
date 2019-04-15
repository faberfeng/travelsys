<template>
    <div class="wrapper" id="safePage">
         <h4 class="title">安全检查分类</h4>
         <div class="usermanage">
            <h5 class="subtitle">分类列表
                <span class="subSpan">
                    <span @click="addType()" class="btn">添加</span>
                    <span @click="downExcel()" class="btn1">导出</span>
                </span>
            </h5>
            <div style="padding:0 20px;box-sizing: border-box;">
                <table class="UserList" border="1" width='100%'>
                    <thead>
                        <tr  class="userList-thead" >
                            <th width="18%">检查类型</th>
                            <th width="18%">分类名称</th>
                            <!-- <th width="50%">授权的功能模块</th> -->
                            <th width="14%;">操作 </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in classificationsList" :key="index"> 
                            <td>{{item.type==1?'安全检查':'质量检查'}}</td>
                            <td >{{item.name}}</td>
                            <td>
                                <span class="deleteIcon" @click="deleteType(item.id)"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="edit">
            <el-dialog  title="增加检查分类" :visible="addTypeShow" @close="typeClose">
            <div class="editBody" >
                <!-- <div class="editBodyone">
                    <label class="editInpText">检查类型：</label>
                    <el-select v-model="valueType" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->
                <div class="editBodyone">
                    <label class="editInpText">分类名称：</label>
                     <el-input placeholder="请输入文本" v-model="classifyName"  style="width:317px !important;height:30px !important"></el-input>
                </div>
            </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="PostaddType()" >确定</button>
                        <button class="editBtnC" @click="typeClose()" >取消</button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
export default {
    name:'safePage',
    data(){
        return{
            addTypeShow:false,
            options:[{
                value:'1',
                label:'安全检查',
            },
            {
                value:'2',
                label:'质量检查'
            }],
            classifyName:'',
            valueType:'1',
            BDMSUrl:'',
            token:"",
            projId:"",
            classificationsList:[],




        }
    },
    created(){
        var vm=this;
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.token=localStorage.getItem('token');
        this.projId=localStorage.getItem('projId');
        this.getClassifications();
    },
    methods:{
        addType(){
            this.addTypeShow=true;
            this.classifyName='';
        },
        downExcel(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'security/dl/ExportClassifiedStatistics',
                headers:{
                    'token':vm.token
                },
                params:{
                    type:0,
                    projectId:this.projId
                },
                responseType:'blob'
            }).then((response)=>{
                let blob = new Blob([response.data],{
                    type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
                });
                let objectUrl = URL.createObjectURL(blob);  //生成一个url
                window.location.href = objectUrl;   //浏览器打开这个url
            })
        },
        typeClose(){
            this.addTypeShow=false;
            this.classifyName='';    
                },
        PostaddType(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'security/addClassification',
                headers:{
                    'token':vm.token
                },
                method:'get',
                params:{
                    projId:this.projId,
                    name:this.classifyName,
                    type:1
                }
            }).then((response=>{
                if(response.data.cd=='0'){
                    this.getClassifications();
                    this.addTypeShow=false;
                    
                }else{
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            }))
        },
        deleteType(id){
            var vm=this;
            this.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'security/deleteClassification',
                    headers:{
                        'token':vm.token
                    },
                    method:'get',
                    params:{
                        classificationId:id
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getClassifications();
                    }
                })
            })
        },
        getClassifications(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'security/getClassifications',
                method:'GET',
                headers:{
                    'token':vm.token
                },
                params:{
                    projId:vm.projId,
                    type:1
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.classificationsList=response.data.rt;
                }
            })
        },

    }

}
</script>

<style lang="less" scoped>
.wrapper{
    .title{
        color: #fc343a;
        font-size: 18px;
        font-weight: bold;
        border-bottom:2px solid #ccc; 
        height: 50px;
        line-height: 50px;
        padding:0px 15px;
        margin: 10px 0 0 0 ;
        text-align: left;
    }
    .usermanage{
        .subtitle{
            color: #fc3439;
            height: 40px;
            line-height: 40px;
            text-align: left;
            margin: 20px 20px 15px 15px;
            font-size: 16px;
            font-weight: bold;
            .subSpan{
                float: right;
                height: 40px;
                line-height: 40px;
                position: relative;
                .btn{
                    float: left;
                    display: inline-block;
                    width: 96px;
                    height: 32px;
                    border-radius: 2px;
                    background: #fc3439;
                    color: #ffffff;
                    font-size: 14px;
                    text-align: right;
                    line-height: 32px;
                    cursor: pointer;
                    position: relative;
                    padding: 0 20px;
                    box-sizing: border-box;
                    letter-spacing: 2px;
                    font-weight: normal;
                }
                .btn1{
                    float: right;
                    width: 90px;
                    height: 32px;
                    margin-left:10px;
                    border-radius: 2px;
                    background: #ccc;
                    color: #ffffff;
                    font-size: 14px;
                    text-align: right;
                    line-height: 32px;
                    cursor: pointer;
                    position: relative;
                    padding: 0 28px;
                    box-sizing: border-box;
                    letter-spacing: 2px;
                    font-weight: normal;
                }
                .btn::after{
                    display: inline-block;
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background-image:url('./images/jiahao.png');
                    background-size: 100% 100%;
                    content: '';
                    top: 10px;
                    left: 23px;
                }
            }
        }
        .UserList{
            border-collapse: collapse;
            border: 1px solid #e6e6e6;
            thead{
                background: #f2f2f2;
                th{
                    padding-left: 10px;
                    height: 36px;
                    text-align: left;
                    box-sizing: border-box;
                    border-right: 1px solid #e6e6e6;
                    font-size: 12px;
                    color: #333333;
                }
            }
            tbody{
                tr{
                    td{
                        padding-left: 10px;
                        height: 36px;
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                        .deleteIcon{
                            float: left;
                            width: 16px;
                            height: 16px;
                            background: url('../../assets/delete.png')no-repeat 0 0;
                            cursor: pointer;
                        }
                    }
                    &:hover{
                        background: #fafafa;
                    }
                }
            }
        }

    }
}
</style>