<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div id="safeWarpper">
            <div class="ForumSelector_safe">
                <ul>
                    <li class="selectItem">
                        <span class="itemContent">
                            <v2-datepicker format="yyyy-MM-DD" v-model="selectTime"  @change="changeDatePicker()" ></v2-datepicker>
                         </span>
                    </li>
                    <!-- <li class="selectItem">
                       <span class="title-right">
                            <input type="text" v-model="selectName" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="selectNameInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="selectNameInfo"></span>
                        </span>
                    </li> -->
                </ul>
            </div>
            <div class="wrapper_left">
                <div class="wrapper_left_content">
                    <ul>
                        
                        <li v-for="(item,index) in getVisitorInfoLists" :key="index">
                            <span class="one_Span"><i class="el-icon-success"></i>{{item.name}}</span>
                            <span class="two_Span"><label>告知人数：{{item.people}}</label></span>
                            <span class="three_Span"><label>日期：{{item.name.split(' ')[0]}}</label></span>
                            <!-- <span class="four_Span"><label>单位：{{item.company}}</label></span> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="wrapper_right">
                <div class="wrapper_right_content">
                    <ul>
                        <li style="top:20px;left:20px;">
                            <i class="el-icon-circle-plus" @click="addSafeMessage"></i>
                           <el-collapse v-model="activeName" accordion v-for="(item,index) in getSafetyNotificationList" :key="index">
                                <el-collapse-item :title="item.title" :name="index">
                                    <div style="text-align:left;font-size:16px;margin-left:10px;"><span style="font-weight:bold;">发起单位:</span>{{item.company}}</div>
                                    <div style="text-align:left;font-size:16px;margin-left:10px;"><span style="font-weight:bold;">安全通知:</span>{{item.text}}</div>
                                    <div style="text-align:left;font-size:16px;margin-left:10px;"><span style="font-weight:bold;">文件附件:</span><i class="el-icon-download" @click="downFile(item.filePath)"></i></div>
                                    <div style="text-align:right;margin-right:10px;"><i class="el-icon-delete" @click="deleteSafetyNotification(item.id)"></i></div>
                                </el-collapse-item>
                           </el-collapse>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog title="增加访客安全告知" :visible.sync="safeMessageShow" @click="safeMessageClose">
                <div class="editBody">
                    
                    <div class="title" style="height: 40px;line-height: 40px;font-size: 20px;font-weight: bold;padding: 5px;margin:5px;">
                        <label>来访安全告知</label><i class="el-icon-edit"></i>
                    </div>
                     <div  style="height:40px;margin:25px;">
                        <label style="width:20%;display:inline-block;">安全主题:</label>
                        <el-input  style="width:65%;" v-model="titleName"></el-input>
                    </div>
                    <div class="body_safeMessage" style="height:40px;margin:25px;">
                        <label style="width:20%;display:inline-block;vertical-align:top">安全告知通知:</label>
                        <el-input style="width:65%;" type="textarea" 
                            placeholder="请输入内容"
                            v-model="textName"
                            maxlength="300"
                            show-word-limit></el-input>
                    </div>
                    <div  style="height:40px;margin:25px;">
                        <label style="width:20%;display:inline-block;">安全告知发起单位:</label>
                        <el-input  style="width:65%;" v-model="companyName"></el-input>
                    </div>
                    <div style="height:40px;
                    margin:25px;">
                        <label style="width:20%;display:inline-block;">文件附件:</label>
                        <span style="width:65%;display:inline-block;">
                            <span style="width: 98px;height: 26px;border: 1px solid #dcdfe6;cursor: pointer;background: #f9f9f9;font-size: 14px;font-weight: 400;color: #666;display:inline-block" @click="selectFile()">
                                选择文件
                                <input type="file" ref="fileInfo" accept="video/*" id="fileInfos" @change="changeFile($event)" style="display:none"/>
                            </span>
                            <span style="font-size: 14px;
                                line-height: 14px;
                                display: inline-block;
                                margin-left: 10px;
                                font-weight: 400;
                                color: #999;
                                width: 277px;
                                text-align:left;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;">{{fileName}}</span>
                        </span>

                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="safeMessageMakeSure()" >确定</button>
                        <button class="editBtnC" @click="safeMessageClose()" >取消</button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:'',
    data(){
        return{
            routerList:"",
            getVisitorInfoList:[],
            getVisitorInfoLists:[],
            BDMSUrl:'',
            selectTime:"",
            selectName:'',
            safeMessageShow:false,
            safeTextarea:'',
            fileList:null,
            fileName:'未选择任何文件',
            safeMessageList:[],
            companyName:'',
            titleName:'',
            textName:'',
            getSafetyNotificationList:[],
            activeName:0
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        this.BDMSUrl=this.$store.state.BDMSUrl;
        vm.loadingTitle();
        vm.getVisitorInfo();
        vm.getSafetyNotification();
    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'054','05401','/safetyEducation/visitorSafety','05402','/safetyEducation/safeEducation','05403','/safetyEducation/safeTechnology');
        //   console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
            var vm=this;
            //   console.log(vm.moduleList,'获取的东西');
            var secondList=[];
            itemList.forEach((item)=>{
                if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                    secondList.push(item)
                    if(item.moduleCode==Code1){
                        vm.$set(item,'isShow',true);
                        vm.$set(item,'routerLink',routerLink1);
                    }
                    if(item.moduleCode==Code2){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink2);
                    }
                    if(item.moduleCode==Code3){
                        vm.$set(item,'isShow',false);
                        vm.$set(item,'routerLink',routerLink3);
                    }
                    if(item.moduleCode==Code4){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink4);
                    }
                }
            })
            secondList=secondList.sort(vm.compare('sequenceNo'))
            return secondList
        },
            //排序函数
        compare(property) {
            return function(a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        getVisitorInfo(time){
            this.getVisitorInfoLists=[];
            axios({
                url:this.BDMSUrl+'safety/getSafetyNotificationConfirm',
                method:'GET',
                params:{
                    projId:this.projId,
                    time:time
                },
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd==0){
                     this.getVisitorInfoList=response.data.rt;
                     this.getVisitorInfoListLength=this.getVisitorInfoList.length;
                     if(this.getVisitorInfoListLength<11){
                        for(var i=0;i<this.getVisitorInfoListLength;i++){
                            this.getVisitorInfoLists.push(this.getVisitorInfoList[i])
                        }
                    }else{
                        for(var i=0;i<10;i++){
                            this.getVisitorInfoLists.push(this.getVisitorInfoList[i])
                        }
                    }
                }
            })
        },
        timeChange(val){
            
                moment(val).format('YYYY-MM-DD');
            
        },
        changeDatePicker(){

        },
        selectNameInfo(){

        },
        safeMessageClose(){
            this.safeMessageShow=false;
        },
        safeMessageMakeSure(){
            var formData=new FormData();
            if(this.fileList){
                formData.append('file',this.fileList)
            }
            
            axios({
                url:this.BDMSUrl+'safety/addSafetyNotification',
                headers:{
                    'token':this.token
                },
                method:'post',
                params:{
                    projId:this.projId,
                    company:this.companyName,
                    text:this.textName,
                    title:this.titleName
                },
                data:formData
            }).then((response)=>{
                if(response.data.cd==0){
                    // this.safeMessageList=response.data.rt;
                    this.getSafetyNotification();
                    this.safeMessageShow=false;
                    this.companyName='';
                    this.textName='';
                    this.titleName='';
                    this.fileName="未选择任何文件";
                    document.getElementById('fileInfos').value='';
                    this.fileList='';
                }
            })
        },
        getSafetyNotification(){
            axios({
                url:this.BDMSUrl+'safety/getSafetyNotification',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getSafetyNotificationList=response.data.rt;
                }
            })
        },
        addSafeMessage(){
            this.safeMessageShow=true;
        },
        selectFile(){
            this.$refs.fileInfo.click();
        },
        changeFile(){
            this.fileList=this.$refs.fileInfo.files[0];
            // console.log(this.fileList,'this.fileList');
            this.fileName=this.fileList.name;
        },
        deleteSafetyNotification(id){
            this.$confirm('你要删除当前安全告知','提示',{
                confirmButtonText:'确认',
                cancleButtonText:'取消',
                type:'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'safety/deleteSafetyNotification',
                    headers:{
                        'token':this.token
                    },
                    method:'get',
                    params:{
                        id:id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getSafetyNotification()
                    }
                })
            })
        },
        downFile(file){
            if(file){
                window.open(this.BDMSUrl+file);
            }
        },



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
#content{
     width: 100%;
        .topHeader{
            box-sizing: border-box;
            // margin-top:107px;
            float: left;
            width: 100%;
            max-height: 800px;
            overflow: auto;
        }
        // ::-webkit-scrollbar{width:0px}
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
        #safeWarpper{
            width: 98%;
            margin:0px auto;
            .ForumSelector_safe{
                        // border: 1px solid #d9d9d9;
                        height: 120px;
                        // color: #999999;
                        // font-size: 12px;
                        // margin-right: 5px;
                        >ul{
                            float: left;
                            margin-top:16px;
                            .selectItem{
                                float: left;
                                .itemContent{
                                    display: inline-block;
                                    padding: 8px 15px 0 30px;
                                    height: 48px;
                                    line-height: 48px;
                                }
                                .title{
                                    display: inline-block;
                                    padding: 0 15px 0 30px;
                                    height: 48px;
                                    line-height: 48px;
                                }
                                .el-select{
                                    .el-input__inner{
                                        border:none;
                                        width: 100px;
                                        color:#333333;
                                        height: 38px;
                                    }
                                }
                                .title-right{
                                    float: left;;
                                    width: 214px;
                                    height: 33px;
                                    margin-left: 20px;
                                    margin-top:8px;
                                    position: relative;
                                    .title-right-icon{
                                        display: block;
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 15px;
                                        border: 1px solid #e6e6e6;
                                        position: relative;
                                        background: #fafafa;
                                        padding-left:10px;
                                        padding-right:40px;
                                        margin-right: 5px;
                                        outline: none;
                                        &:focus{
                                            background: #ffffff;  
                                        }
                                    }
                                    .el-icon-search{
                                        position: absolute;
                                        right: 16px;
                                        top: 10px;
                                        cursor: pointer;
                                    }
                                }
                            
                            }
                            .selectItem:first-of-type .el-select .el-input__inner{
                                width: 170px;
                            }
                        }
            }
            .wrapper_left{
                margin-top:20px;
                width: 70%;
                height: 500px;
                float: left;
                // border:1px solid #ccc;
                .wrapper_left_content{
                    padding: 10px;
                    ul{
                        li{
                            margin:10px;
                            height: 80px;
                            width: 100%;
                            // border: 2px solid #44e2ba;
                            border:1px solid #ccc;
                            position: relative;
                            animation: .2s forwards;
                            &:hover{
                                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                                    transform: translate3d(0,-5px,0);
                            }
                            .one_Span{
                                width: 45%;
                                height: 80px;
                                line-height: 80px;
                                font-size:28px;
                                font-weight: bold;
                                text-align: center;
                                display: inline-block;
                                 position: absolute;
                                 left:0px;
                                 white-space: nowrap;
                            }
                            .two_Span{
                                width: 25%;
                                height: 30px;
                                line-height: 30px;
                                font-size:16px;
                                display: inline-block;
                                position: absolute;
                                bottom: 2px;
                                 right:200px;
                                // position: relative;
                                // label{
                                //     bottom: 2px;
                                // }

                            }
                            .three_Span{
                                width: 25%;
                                height: 30px;
                                line-height: 30px;
                                font-size:16px;
                                display: inline-block;
                                position: absolute;
                                right:10px;
                                bottom: 2px;
                            }
                            .four_Span{
                                width: 25%;
                                height: 30px;
                                line-height: 30px;
                                font-size:16px;
                                display: inline-block;
                                position: absolute;
                                right:360px;
                                bottom: 2px;

                            }

                        }
                    }


                }
            }
            .wrapper_right{
                margin-top:20px;
                width: 30%;
                height: 500px;
                float: left;
                // border:1px solid #ccc;
                .wrapper_right_content{
                    width: 90%;
                    margin: 0px auto;
                    .el-icon-circle-plus{
                        height: 22px;
                        font-size:18px;
                        cursor: pointer;
                        
                        // font-size: 22px;
                        // float: left;
                    }

                    ul{
                        position: relative;
                        margin-left:40px;
                        li{
                            // height: 250px;
                            width: 100%;
                            // border:2px solid #44e2ba;
                            border:1px solid #ccc;
                            box-shadow: 0 16px 30px rgba(0,0,0,.1);
                            position: absolute;
                            background: white;
                            .el-icon-download{
                                 font-size: 18px;
                                 font-weight: bold;
                                cursor: pointer;
                            }
                            .el-icon-delete{
                                    font-size: 18px;
                                    cursor: pointer;

                            }
                            .header{
                                span{
                                    font-size: 16px;
                                }
                                .el-icon-circle-plus{
                                    position: absolute;
                                    font-size: 24px;
                                    right:5px;
                                    top:5px;
                                    cursor: pointer;
                                    // margin-left:20px;
                                }
                                .el-icon-remove{
                                    position: absolute;
                                    font-size: 24px;
                                    left:5px;
                                    top:5px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }

                }
            }
            #edit{
                .title{
                    height: 40px;
                    line-height: 40px;
                    font-size: 20px;
                    font-weight: bold;
                    padding: 5px;
                }
            }
        }

}

</style>
