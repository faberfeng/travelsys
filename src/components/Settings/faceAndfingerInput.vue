<template>
    <div id="wrapper">
        <div id="item-box-file1">
            <span :class="['label-item1',{'label-item-active1':itemShow}]" @click="projectPerson()">项目成员</span>
            <span :class="['label-item1',{'label-item-active1':!itemShow}]" @click="temporaryPerson()">临时成员</span>
            <div v-show="itemShow" class="wrapperHead" @click="buildProperson">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div>
            <div v-show="!itemShow" class="wrapperHead" @click="buildTemperson">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div>
        </div>
        <div class="wrappBody" v-show="itemShow">
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序列</th>
                           <th>项目成员</th>
                           <th>人脸识别</th>
                           <th>指纹</th>
                           <th>有效时长</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in getFingerFaceList" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{item.userName}}</td>
                            <td>
                                <span class="el-icon-news" @click="downFile(item.face)"></span>
                            </td>
                            <td>
                                <span class="el-icon-picture" @click="downFile(item.fingerprint)"></span>
                            </td>
                            <td>{{timeChange(item.deadTime)}}</td>
                            <td>
                                <button class="actionBtn editBtn" @click="updateFingerFace(item)"></button>
                                <button class="actionBtn deleteBtn" @click="deleteFingerFace(item)"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="!getFingerFaceList" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                当前列表无数据
            </div>
            <div class="tableBodyPagination">
                <div class="tableBodyPaginationRight">
                    <el-pagination class="elPagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="1"
                        layout="sizes,prev, pager, next"
                        :total="TableListLength">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="wrappBody" v-show="!itemShow">
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序列</th>
                           <th>临时成员</th>
                           <th>人脸识别</th>
                           <th>指纹</th>
                           <th>有效时长</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <!-- <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
            <div style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
                当前列表无数据
            </div>
            <div class="tableBodyPagination">
                <div class="tableBodyPaginationRight">
                    <el-pagination class="elPagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="1"
                        layout="sizes,prev, pager, next"
                        :total="TableListLength">
                    </el-pagination>
                </div>
            </div>


        </div>
        <div id="edit">
                <el-dialog title="添加人脸/指纹" v-dialogDrag :visible.sync="addfingerFaceDialog" @close="addFingerFaceCancle">
                    <div class="editBody">
                        <div  class="editBodytwo"><label class="editInpText">项目成员:</label>
                            <select class="editSelect" v-model="icCordOwner" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">人脸识别:</label>
                            <span class="upImgText1">{{faceImageName}}</span>
                            <span class="updataImageSpan">
                                <span @click="selectFaceImg">
                                    <span class="el-icon-news"></span>
                                </span>
                                <input class="upInput"  type="file" accept="images/*" @change="fileFaceChanged($event)" ref="fileFace"  id="fileFaceInfo" multiple="multiple">
                            </span>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">指纹录入:</label>
                            <span class="upImgText1">{{fingerImageName}}</span>
                            <span class="updataImageSpan">
                                <span @click="selectFingerImg">
                                    <span class="el-icon-picture"></span>
                                </span>
                                <input class="upInput"  type="file" accept="images/*" @change="fileFingerChanged($event)" ref="fileFinger"  id="fileFingerInfo" multiple="multiple">
                            </span>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">截至时间:</label>
                           <el-date-picker
                                v-model="endDate"
                                type="datetime"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>                        
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addFingerFace()">确定</button>
                        <button class="editBtnC" @click="addFingerFaceCancle">取消</button>
                    </div>
                </el-dialog>

                <el-dialog title="编辑人脸/指纹" v-dialogDrag :visible.sync="editfingerFaceDialog" @close="editFingerFaceCancle">
                    <div class="editBody">
                        <div  class="editBodytwo"><label class="editInpText">项目成员:</label>
                            <select class="editSelect" v-model="icCordOwner" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">人脸识别:</label>
                            <span class="upImgText1">{{faceImageName}}</span>
                            <span class="updataImageSpan">
                                <span @click="selectFaceImg">
                                    <span class="el-icon-news"></span>
                                </span>
                                <input class="upInput"  type="file" accept="images/*" @change="fileFaceChanged($event)" ref="fileFace"  id="fileFaceInfo" multiple="multiple">
                            </span>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">指纹录入:</label>
                            <span class="upImgText1">{{fingerImageName}}</span>
                            <span class="updataImageSpan">
                                <span @click="selectFingerImg">
                                    <span class="el-icon-picture"></span>
                                </span>
                                <input class="upInput"  type="file" accept="images/*" @change="fileFingerChanged($event)" ref="fileFinger"  id="fileFingerInfo" multiple="multiple">
                            </span>
                        </div>
                        <div  class="editBodytwo"><label class="editInpText">截至时间:</label>
                           <el-date-picker
                                v-model="endDate"
                                type="datetime"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>                        
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editFingerFace()">确定</button>
                        <button class="editBtnC" @click="editFingerFaceCancle">取消</button>
                    </div>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:"faceAndFingerInput",
    data(){
        return{
            itemShow:true,
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
            addfingerFaceDialog:false,
            fingerFaceOptions:[{
                value:1,
                label:'项目成员'
            },{
                value:2,
                label:'临时成员'
            }],
            fingerFaceType:1,
            userLists:[],
            icCordOwner:'',
            icCordOwnerName:'',
            faceImageName:'请上传人脸信息',
            fingerImageName:'请上传指纹信息',
            endDate:'',
            filesFaceList:null,
            filesFingerList:null,
            getFingerFaceList:[],
            editfingerFaceDialog:false,
            fingerFaceId:'',
        }
    },
    created(){
        var vm=this;
        vm.projId = localStorage.getItem('projId');
        vm.token = localStorage.getItem('token');
        vm.projName=localStorage.getItem('projName');
        vm.userId = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        this.getUserList();
        this.getFingerFace();

    },
    methods:{
        timeChange(val){
            if(val){
                   return moment(val).format("YYYY-MM-DD HH:mm:ss");
            }else{
                return null
            }
            

        },
        downFile(val){
            if(val){
                window.open(this.BDMSUrl+val);
            }
        },
        fileChanged(){

        },
       selectFaceImg(){
        this.$refs.fileFace.click();
       },
       fileFaceChanged(){
           var vm=this;
            vm.filesFaceList = vm.$refs.fileFace.files[0]
            vm.faceImageName=vm.filesFaceList.name;
            // vm.imageName = vm.filesList.name

       },
       selectFingerImg(){
           this.$refs.fileFinger.click();
       },
       fileFingerChanged(){
           var vm=this;
            vm.filesFingerList = vm.$refs.fileFinger.files[0];
            this.fingerImageName=vm.filesFingerList.name;
       },
        projectPerson(){
             this.itemShow=true; 
        },
        temporaryPerson(){
             this.itemShow=false;
         },
        handleSizeChange(){
        },
        handleCurrentChange(){
        },
        //改变时间
        changeDatePicker(){
        },
        selectNameInfo(){
        },
       buildProperson(){
           this.addfingerFaceDialog=true;
       },
       buildTemperson(){

       },
       addFingerFaceCancle(){
            this.addfingerFaceDialog=false;
            this.deadTime='';
            this.faceImageName='请上传人脸信息';
            this.fingerImageName='请上传指纹信息';
            document.getElementById('fileFaceInfo').value='';
            document.getElementById('fileFingerInfo').value='';
            this.filesFaceList=null;
            this.filesFingerList=null;
       },
        getUserList(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'user/getUserList',
                method:'GET',
                params:{
                    projectId:this.projId
                },
                headers:{
                    'token':this.token
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.userLists=response.data.rt;
                     this.icCordOwner=this.userLists[0].userId;
                     this.icCordOwnerName=this.userLists[0].name;
                }
            })
        },
        editFingerFace(){
            var vm=this;
             if(this.endDate==''){
                    this.$message({
                        type:'info',
                        message:'请选择截至时间'
                    })
            }else{
                 var formData=new FormData();
                 if(this.filesFaceList){
                    formData.append('face',this.filesFaceList);
                 }
                 if(this.filesFingerList){
                    formData.append('fingerprint',this.filesFingerList);
                 }
                axios({
                    url:this.BDMSUrl+'facefinger/update',
                    method:'POST',
                    params:{
                        projectId:this.projId,
                        type:1,
                        deadTime:moment(this.endDate).format("YYYY-MM-DD HH:mm:ss"),
                        userId:this.icCordOwner,
                        userName:this.icCordOwnerName,
                        id:this.fingerFaceId
                    },
                    data:formData,
                    headers:{
                        'token':this.token
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getFingerFace();
                        this.addfingerFaceDialog=false;
                        this.deadTime='';
                        this.faceImageName='请上传人脸信息';
                        this.fingerImageName='请上传指纹信息';
                        document.getElementById('fileFaceInfo').value='';
                        document.getElementById('fileFingerInfo').value='';
                        this.filesFaceList=null;
                        this.filesFingerList=null;
                    }
                })
            }

        },
        updateFingerFace(val){
            this.editfingerFaceDialog=true;
            this.endDate=moment(val.deadTime).format("YYYY-MM-DD HH:mm:ss");
            this.icCordOwner=val.userId;
            this.icCordOwnerName=val.userName;
            this.fingerFaceId=val.id;
        },
        deleteFingerFace(val){
            this.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'facefinger/delete',
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:val.id
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getFingerFace();
                    }
                })
            })
        },
        editFingerFaceCancle(){
            this.editfingerFaceDialog=false;
            this.deadTime='';
            this.faceImageName='请上传人脸信息';
            this.fingerImageName='请上传指纹信息';
            document.getElementById('fileFaceInfo').value='';
            document.getElementById('fileFingerInfo').value='';
            this.filesFaceList=null;
            this.filesFingerList=null;

        },
        addFingerFace(){
            var vm=this;
            if(this.filesFaceList==null){
                this.$message({
                    type:'info',
                    message:'请上传人脸信息'
                })

            }else if(this.filesFingerList==null){
                this.$message({
                    type:'info',
                    message:'请上传指纹信息'
                })
            }else if(this.endDate==''){
                    this.$message({
                        type:'info',
                        message:'请选择截至时间'
                    })
            }else{
                 var formData=new FormData();
                formData.append('face',this.filesFaceList);
                formData.append('fingerprint',this.filesFingerList);
                axios({
                    url:this.BDMSUrl+'facefinger/add',
                    method:'POST',
                    params:{
                        projectId:this.projId,
                        type:1,
                        deadTime:moment(this.endDate).format("YYYY-MM-DD HH:mm:ss"),
                        userId:this.icCordOwner,
                        userName:this.icCordOwnerName
                    },
                    data:formData,
                    headers:{
                        'token':this.token
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getFingerFace();
                        this.addfingerFaceDialog=false;
                        this.deadTime='';
                        this.faceImageName='请上传人脸信息';
                        this.fingerImageName='请上传指纹信息';
                        document.getElementById('fileFaceInfo').value='';
                        document.getElementById('fileFingerInfo').value='';
                        this.filesFaceList=null;
                        this.filesFingerList=null;
                    }
                })
            }
        },
        getFingerFace(){
            axios({
                url:this.BDMSUrl+'facefinger/get',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    type:1
                },
                method:"get"
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getFingerFaceList=response.data.rt;
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    #wrapper{
        margin-top:51px;
        margin-right: 20px;
        #item-box-file1 {
            display: block;
            border: 1px solid #e6e6e6;
            // height: 36px;
             height: 51px;
            padding-top: 16px;
            padding-left: 20px;
            
            background: #fafbfc;
            position: relative;
            .label-item1 {
                float: left;
                height: 34px;
                font-size: 14px;
                width: 106px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border-top: 3px solid #fafbfc;
                color: #999999;
                text-decoration: none;
            }
            .label-item-active1 {
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
            .wrapperHead{
                float: right;
                line-height: 22px;
                height: 54px;
                margin-right:15px;
                cursor: pointer;
                .el-icon-plus{
                    font-size: 16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
                .elName{
                    margin-left:4px;
                    font-size:16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
            }
        }
        .wrappBody{
            .tableBody{
                  margin-top:30px;
                    .tableList{
                        border-collapse: collapse;
                        border: 1px solid #e6e6e6;
                        thead{
                            background: #f2f2f2;
                            th{
                                padding-left: 6px;
                                padding-right: 15px;
                                height: 36px;
                                text-align: center;
                                box-sizing: border-box;
                                border-right: 1px solid #e6e6e6;
                                font-size: 14px;
                                color: #333333;
                                font-weight: normal;
                            }
                        }
                        tbody{
                            tr{
                                .red{
                                    color: red;
                                }
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 36px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 14px;
                                    color: #333333;
                                    .actionBtn{
                                        width: 18px;
                                        height: 18px;
                                        border: none;
                                        cursor: pointer;
                                        margin-left: 10px;

                                    }
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat 0 0;
                                    }
                                    .editBtn{
                                        background: url('../../assets/edit.png') no-repeat 0 0;
                                    }
                                    .el-icon-news{
                                        font-size: 20px;
                                        cursor: pointer;
                                    }
                                    .el-icon-picture{
                                        font-size: 20px;
                                        cursor: pointer;
                                    }

                                    // .upmoveBtn{
                                    //     background: url('./images/overviewup.png') no-repeat 0 0;
                                    // }
                                    // .downmoveBtn{
                                    //     background: url('./images/downmove.png') no-repeat 0 0;
                                    // }
                                    // .detailBtn{
                                    //     background: url('./images/overfile.png') no-repeat 0 0;
                                    // }
                                    // .exportBtn{
                                    //     background: url('./images/overviewdown.png') no-repeat 0 0;
                                    // }

                                }
                            }
                        }
                    }
            }
            .tableBodyPagination{
                    display: block;
                    height: 62px;
                    width: auto;
                    border-left: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    border-bottom: 1px solid #d4d4d4;
                    box-sizing: border-box;
                    background: #fafafa;
                    position: relative;
                    .tableBodyPaginationRight{
                        position: absolute;
                        right: 2px;
                        bottom: 16px;
                        .el-pagination .el-select .el-input .el-input__inner{
                                height: 28px !important;
                        }
                    }
            }

        }
        #edit{
            .editBody{
                .editBodytwo{
                    //  .el-input__inner{
                    //     width: 435px !important;
                    // }
                    .editSelect{
                        width: 447px;
                        height: 38px;
                        color: #333333;
                        background: #fafafa;
                        border: 1px solid #d1d1d1;
                        padding:0px 0px 0px 10px;
                    }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image:url('../SchedulePlan/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 185px;
                        right: 62px;
                    }
                    .upInput{
                            display: none;
                    }
                    /* 上传文件按钮 */
                    .imageBody{
                        text-align: left!important;
                    }
                    .el-radio__label{
                        padding-left: 10px;
                        padding-right: 10px;
                    }
                    .imageBodyText{
                        color: #666;
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: normal;
                        display: inline-block;
                        width: 175px;
                        padding-left: 94px;
                        text-align: left;
                    }
                    .updataImageSpan{
                        overflow: hidden;
                        width: 98px;
                        margin-left:-40px;
                        .el-icon-news{
                            font-size: 24px;
                            cursor: pointer;
                            width: 100px;
                            height: 24px;
                        }
                        .el-icon-picture{
                            font-size: 24px;
                            cursor: pointer;
                            width: 100px;
                            height: 24px;

                        }
                    }
                    .updataImageSpan input{
                        position: absolute;
                        left: 0px;
                        top: 0px;
                        opacity: 0;
                        /* -ms-filter: 'alpha(opacity=0)'; */
                    }
                    .upImgText1{
                            font-size: 14px;
                            line-height: 14px;
                            display: inline-block;
                            margin-left: 10px;
                            font-weight: normal;
                            color: #999;
                            /* width: 300px; */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            text-align: left;
                            width: 373px;
                    }

                }
            }

        }
    }

</style>
