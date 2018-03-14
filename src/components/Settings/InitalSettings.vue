<template>
    <div class="wrapper">
        <h4 class="title">工程初始配置</h4>
        <div class="account">
            <h5 class="accountTitle">工程账号</h5>
            <ul class="accountList">
                <li class="pre"><span>工程账号</span> <label>Q200117061402</label></li>
                <li class="pre"><span>工程名称</span> <label>企业自用办公楼</label></li>
                <li class="pre"><span>工程管理账号</span> <label>evan.qiang@qq.com</label></li>
                <li class="pre"><span>工程管理员姓名</span> <label>王自强</label></li>
                <li class="pre"><span>工程管理员电话</span> <label>13651762908</label></li>
                <li class="pre"><span>授权用户数量</span> <label>无限制使用  14个已使用</label><span class="logo"><el-checkbox v-model="checked">使用默认logo</el-checkbox></span></li>
                <li class="pre"><span>到期日期</span> <label>2018年12月31日</label></li>
                <li class="pre"><span>工程logo</span> <label><img /></label></li>
            </ul>
        </div>
        <div class="summary">
            <h5 class="accountTitle">工程概况<span class="add" @click="add"><i class="el-icon-plus"></i>新增</span></h5>
            <ul class="accountList uniqueList" >
                <li class="pre" v-for=" (item,index) in sumaryData" :key="index"><span>{{item.unity}}</span> <label>{{item.unityName}}</label><i @click="edit(index)" class="el-icon-document"></i><i @click="del(index)" class="el-icon-delete
"></i></li>
            </ul>
        </div>
        <div class="img">
            <h5 class="accountTitle">工程图片</h5>
            <ul class="imgUl">
                <li class="imgLi">
                    <div class="imgD">
                        <i class="el-icon-circle-plus-outline"></i>
                        <p>上传封面图片</p>
                    </div>
                </li>
                <li class="imgLi">
                    <div class="imgD">
                        <i class="el-icon-circle-plus-outline"></i>
                        <p>上传封面图片</p>
                    </div>
                </li>
                <li class="imgLi"></li>
            </ul>
        </div>
        <!--弹出的对话框-->
        <el-dialog title="工程概况信息编辑" :visible.sync="addDialog">
            <el-form >
                <el-form-item label="单位">
                    <el-input  auto-complete="off" v-model="projectUnity"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input  auto-complete="off" v-model="projectName"></el-input>
                </el-form-item>
            </el-form>
            <p class="err" v-show="showErr">请输入完整信息</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog=false">取消</el-button>
                <el-button type="primary" @click="addMakeSure">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="工程概况信息编辑" :visible.sync="editDialog">
            <el-form >
                <el-form-item label="单位">
                    <el-input  auto-complete="off" v-model="projectUnity"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input  auto-complete="off" v-model="projectName"></el-input>
                </el-form-item>
            </el-form>
            <p class="err" v-show="showErr">请输入完整信息</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog=false">取消</el-button>
                <el-button type="primary" @click="editMakeSure">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="工程概况信息编辑" :visible.sync="deleteDialog">
            <h3>确认删除吗？</h3>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog=false">取消</el-button>
                <el-button type="primary" @click="deleteMakeSure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'InitalSettings',
    data(){
        return{
            addDialog:false,
            editDialog:false,
            deleteDialog:false,
            showErr:false,
            checked:true,
            projectUnity:'',
            projectName:'',
            sumaryData:[
                {
                    unity:'使用单位',
                    unityName:'上海城市建设开发投资公司'
                },
                {
                    unity:'设计单位',
                    unityName:'同济大学建筑设计研究院'
                },
                {
                    unity:'工程名称',
                    unityName:'企业自用办公楼'
                },
                {
                    unity:'施工单位',
                    unityName:'上海建工'
                },
                {
                    unity:'监理单位',
                    unityName:'上海建科咨询有限公司'
                }
            ],
            index:''
        }
    },
    methods:{
        edit(index){
            this.editDialog = true;
            this.index = index;
        },
        del(index){
            this.deleteDialog = true;
        },
        add(){
            this.addDialog = true;
        },
        addMakeSure(){
             if(this.projectUnity !==''&& this.projectName !==''){
                this.sumaryData.push({
                    unity:this.projectUnity,
                    unityName:this.projectName
                })
                this.projectUnity='';
                this.projectName='';
                this.addDialog = false;
                this.showErr = false;
             }else{
                this.showErr = true;
             }
        },
        deleteMakeSure(){
            this.sumaryData.splice(this.index,1);
            this.deleteDialog = false;
        },
        editMakeSure(){
            if(this.projectUnity !==''&& this.projectName !==''){
                this.sumaryData[this.index].unity = this.projectUnity;
                this.sumaryData[this.index].unityName = this.projectName;
                this.projectUnity='';
                this.projectName='';
                this.editDialog = false;
                this.showErr = false;
            }else{
                this.showErr = true;
            }
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
        padding:10px 0px;
        margin: 0;
        text-align: left;
    }
    .account,.summary{
        border-bottom:1px solid #e6e6e6; 
        width: 100%;
    }
    .accountTitle{
        width: 100%;
        color: red;
        text-align: left;
        margin-bottom: 0;
    }
    .add{
        color: #ccc;
        float: right;
        cursor: pointer;
    }
    .accountList{
        display: inline-block;
        width: 100%;
        text-align: left;
        list-style:none;
        padding: 0;
    }
    .accountList .pre{
        color: #ccc;
        width: 100%;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        display: flex;
        
    } 
    .pre span{
        display: inline-block;
        width: 100px;
        height: 40px;
        text-align: right;
        font-size: 14px;
        cursor: pointer;
    }
    .pre label{
        color: black;
        display: inline-block;
        flex: 1;
        margin-left: 20px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .pre i{
        color:royalblue;
        visibility:hidden;
        line-height: 40px;
        display: block;
        height: 40px;
        width: 30px;

    }
    .pre img{
        width: 200px;
        height: 40px;
        background: #ccc;
    }
    .el-col{
        border: 1px solid #ccc;
    }
    .summary .pre:hover{
        background:#fff6f6;
    }
    .pre:hover i{
        visibility:visible;
    }
    .logo{
        text-align: left !important;
        width: 150px !important;
    }
    
    /*工程概况*/
    .summary .pre{
        display: flex;
    }
    .summary .pre span{
        width: 100px;
    }
    .summary .pre label{
        flex: 1;
    }
    .summary .pre i{
        width: 60px;
    }
    /*错误提示信息*/
    .err{
        width: 100%;
        text-align: left;
        color: red;
    }
    /*工程图片*/
    .imgUl{
        width:100%;
        list-style:none;   
    }
    .imgUl .imgLi{
        width: 150px;
        height: 150px;
        background: #ccc;
        float: left;
        margin: 10px;
        color: red;
        position: relative;
        text-align: center;
    }
    .imgLi p{
        margin: 5px; 
    }
    .imgLi .imgD{
        position: absolute;
        width: 100%;
        height: 50%;
        margin: auto;
        top: 0;
        bottom: 0;
        cursor: pointer;
    }
    .imgLi i{
        display: inline-block;

    }
</style>
