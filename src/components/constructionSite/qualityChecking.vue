<template>
    <div id="qualityChecking">
            <div class="topHeader">
                <div id="item-box-file">
                    <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/constructionSite/qualityChecking'" class="label-item label-item-active">  
                    质量检查
                    </router-link>
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                    安全检查  
                    </router-link>
                </div>
                <div id="containerMessage">
                   <div class="ForumSelector">
                        <span class="name">筛选条件</span>
                        <ul>
                            <li class="selectItem">
                                <span class="title">状态</span>
                                <el-select v-model="value_status" placeholder="请选择">
                                    <el-option
                                    v-for="item in options_status"
                                    :key="item.id"
                                    :label="item.Name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </li>
                            <li class="selectItem">
                                <span class="title">相关</span>
                                <el-select v-model="value_about" placeholder="请选择">
                                    <el-option
                                    v-for="item in options_about"
                                    :key="item.id"
                                    :label="item.Name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </li>
                        </ul>
                        <p class="header clearfix">
                            <span class="item-upload" @click="sendChange">发起整改</span>
                        </p>
                    </div>
                </div>
            </div>
            <div id="edit">
                <el-dialog title="检查类型选择" :visible.sync="checkTypeSelectDialog" @close="checkTypeSelectCancle">
                    <div class="editBody">
                        
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="checkTypeSelectMakeSure">更名</button>
                        <button class="editBtnC" @click="checkTypeSelectCancle">取消</button>
                    </div>
                </el-dialog>
            </div>
            
    </div>
</template>
<script>
export default {
    name:'qualityChecking',
    data(){
        return{
            /*以下为后期添加数据*/
            value_status:'',
            value_about:'',
            options_status:[
            {
                id:'-1',
                Name:'全部状态'
            },{
                id:'1',
                Name:'等待整改'
            },{
                id:'2',
                Name:'等待检查'
            },{
                id:'3',
                Name:'继续整改'
            },{
                id:'4',
                Name:'整改撤销'
            },{
                id:'5',
                Name:'整改完成'
            }
        ],//状态选项
        options_about:[
            {
                id:'-1',
                Name:'全部讨论'
            },{
                id:'1',
                Name:'由我发表'
            },{
                id:'2',
                Name:'有我评论'
            },{
                id:'3',
                Name:'有提到我'
            },
            {
                id:'4',
                Name:'我的收藏'
            }
        ],//相关选项
        //质量检查进入信息
        qualityCheckList:'',
        checkTypeSelectDialog:false,

        }
    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid')
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
    },
    mount(){

    },
    filters:{

    },
    methods:{
        //进入质量检查页面
        qualityCheck(){
            axios({
                method:'get',
                url:this.BDMSUrl+'/project2/buildSite/qualityCheck',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd=="0"){
                    this.qualityCheckList=response.data.rt
                }else if(response.data.cd=="-1"){
                    alert(response.data.msg)
                }
            })
        },
        //验证用户权限

        checkTypeSelectMakeSure(){
            this.checkTypeSelectDialog=false;
        },
        checkTypeSelectCancle(){
            this.checkTypeSelectDialog=false;
        },
        sendChange(){
            this.checkTypeSelectDialog=true;
        }

    },
    
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    #qualityChecking{
         .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
            .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
                .label-item-active{
                    color: #fc3439;
                    font-weight: bold;
                    border-top: 3px solid #fc3439;
                    border-left: 1px solid #e6e6e6;
                    border-right: 1px solid #e6e6e6;
                    border-bottom: 1px solid #fff;
                    background: #ffffff;
                }
        }
        #containerMessage{
                margin-top:20px;
                padding-left:30px;
                .ForumSelector{
                    // border: 1px solid #d9d9d9;
                    height: 40px;
                    color: #999999;
                    font-size: 12px;
                    margin-right: 30px;
                    .name{
                        float: left;
                        width: 96px;
                        height: 38px;
                        line-height: 38px;
                        text-align: left;
                        padding-left: 10px;
                        background: #fafafa;
                    }
                    >ul{
                        float: left;
                        .selectItem{
                            float: left;
                            .title{
                                padding: 0 15px 0 30px;
                                height: 38px;
                                line-height: 38px;
                            }
                            .el-select{
                                .el-input__inner{
                                    border:none;
                                    width: 100px;
                                    color:#333333;
                                    height: 38px;
                                }
                            }
                           
                        }
                        .selectItem:first-of-type .el-select .el-input__inner{
                            width: 170px;
                        }
                    }
                    .header{
                    text-align: left;
                    height: 40px;
                    padding:6px;
                    // margin: 15px 0;
                    .item-upload{
                        float: right;
                        margin-right: 30px;
                        background: #fc3439;
                        color: #ffffff;
                        font-size: 12px;
                        height: 26px;
                        border-radius: 2px;
                        text-align: left;
                        line-height: 26px;
                        padding-left: 42px;
                        padding-right: 16px;    
                        position: relative;
                        cursor: pointer;
                        &::before{
                            display: block;
                            position: absolute;
                            top: 8px;
                            left: 19px;
                            width: 12px;
                            height: 11px;
                            content: '';
                            background: url('./images/whiteJiahao.png') no-repeat 0 0;
                            }
                        }
                    }
                }
        }
        
    }

</style>

