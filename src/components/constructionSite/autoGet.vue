<template>
    <el-dialog title="自动采集配置" :visible="autoAcquisitionShow" @close="autoAcquisitionCancle()">
                <div class="editBody" >
                    <div class="editBodyone"><label class="editInpText" style="width:18% !important;">采集设备厂家：</label><select class="gatherTimeName" @click="manufacturerChange" v-model="manufacturerValue" placeholder="请选择"><option v-for="(item,index) in manufacturerList" :value="item.value" :key="index" v-text="item.label"></option></select>
                    </div>
                    <div class="editBodytwo" v-show="manufacturerValue=='华桓'"><label class="editInpText" style="width:18% !important;">项目ID：</label><input v-model="nodeId" class="gatherTimeNameInp"/>
                    </div>
                    <div class="editBodytwo"><label class="editInpText" style="width:18% !important;">采集频率：</label>
                        <el-radio v-model="collectRateRadio" label="1">1小时</el-radio>
                        <el-radio v-model="collectRateRadio" label="2">1天</el-radio>
                    </div>
                    <div class="editBodytwo" v-show="collectRateRadio=='2'"><label class="editInpText" style="width:18% !important;">采集时间：</label>
                        <select class="gatherTimeName" v-model="collectHour" placeholder="请选择"><option v-for="(item,index) in timeList" :value="item.value" :key="index" v-text="item.label"></option></select>
                    </div>
                     <div class="editBodytwo" v-show="manufacturerValue=='基康'">
                         <label class="editInpText" style="width:13% !important;">仪器ID设置</label>
                         <div class="tool">
                             <span class="export" @click="autoExport()"><label class="export1"></label><label class="exportTxt" >导入</label></span>
                             <span class="export" @click="clearDeviceMonitorPointRelation()"><label class="export2"></label><label class="exportTxt">清空</label></span>
                        </div>
                        <div id="toolTbale">
                            <table class="toolTbaleList" style="table-layout: fixed;" border="1" cellspacing="0" width="100%">
                                 <thead>
                                    <tr>
                                        <th width="100px">点位名称</th>
                                        <th width="300px">仪器ID</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <tr v-for="(item,index) in getDeviceMonitorPointRelationList" :key="index">
                                        <td width="30%">{{item.virtualPointName}}</td>
                                        <td width="70%">{{item.devicePointName}}</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="autoAcquisitionMakeSure()" >确定</button>
                        <button class="editBtnC" @click="autoAcquisitionCancle()" >取消</button>
                </div>
            </el-dialog>
    
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
export default  Vue.component('commonAutoGet',{
    props:[],
    name:'commonAutoGet',
    data(){
        return {
            autoAcquisitionShow:false,
            manufacturerValue:'华桓',
            uploadshow:false,
            filesList:'',
            imageName:'',
            getSingleSheetTitleInfoList:'',
            devicePointIndex:'',
            virtualPointIndex:'',
            collectRateRadio:'1',
            collectHour:0,
             manufacturerList:[
                {
                    value:'华桓',
                    label:'华桓'
                },
                {
                    value:'基康',
                    label:'基康'
                }
            ],
        }
    },
    created(){
        var vm = this;
        vm.userName  = localStorage.getItem('userName');
        vm.defaultSubProjId = localStorage.getItem('defaultSubProjId');
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.userId  = localStorage.getItem('userid');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
    },
    methods:{
         //自动采集按钮
        autoAcquisitionBtn(){
            this.autoAcquisitionShow=true;
            this.getCollectSetting();
           
        },
        //取消自动采集配置
        autoAcquisitionCancle(){
            this.autoAcquisitionShow=false;
        },
        manufacturerChange(){
            if(this.manufacturerValue=='基康'){
                this.getDeviceMonitorPointRelation();
            }
        },
        //自动采集配置确认
        autoAcquisitionMakeSure(){
            if(this.manufacturerValue=='华桓'){
                this.editHuahuanNode();
                this.setCollectSetting();
                this.nodeId='';
            }else if(this.manufacturerValue=='基康'){
                this.setCollectSetting();
                 this.$message({
                        type:'success',
                        message:'自动采集成功'
                    })
                this.autoAcquisitionShow=false;
            }


        },
        //导入
        autoExport(){
            this.uploadshow=true;
        },
        upImgCancle(){
            this.uploadshow=false;
        },
        fileChanged(file){
            var vm = this
            vm.filesList = vm.$refs.file.files[0]; //[]
            vm.imageName = vm.filesList.name;
            var formData =new FormData();
            formData.append('multipartFile',vm.filesList);
                axios({
                    method:'post',
                    headers:{
                        'token':vm.token
                    },
                    url:vm.BDMSUrl+'detectionInfo/getSingleSheetTitleInfo',
                    data:formData
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getSingleSheetTitleInfoList=response.data.rt;
                        // this.devicePointIndex=this.getSingleSheetTitleInfoList[2].index;
                        // this.virtualPointIndex=this.getSingleSheetTitleInfoList[2].index;
                        // vm.filesList='';
                        // vm.imageName='未选择任何文件';
                        // vm.uploadshow=false;
                    }
            })
            // console.log(vm.filesList,'vm.filesList');
        },
        //上传
        uploadIMG(){
            var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/importDeviceMonitorPoint',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                    devicePointIndex:this.devicePointIndex,//设备点位下标
                    virtualPointIndex:this.virtualPointIndex,//虚拟点位下标
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // alert('23');
                    vm.uploadshow=false;
                    this.$message({
                        type:'success',
                        message:'文件导入成功'
                    })
                    this.getDeviceMonitorPointRelation();
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
            document.getElementById('fileInfo').value="";
        },
        //测试
        testProject(){
            var vm=this;
            var formData =new FormData();
            formData.append('multipartFile',vm.filesList);
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/verifyImportDeviceMonitorPoint',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                    devicePointIndex:this.devicePointIndex,//设备点位下标
                    virtualPointIndex:this.virtualPointIndex,//虚拟点位下标
                },
                data:formData
                // data:vm.multipartFile
            }).then((response)=>{
                if(response.data.rt){
                    this.testShow=true;
                    this.$message({
                        type:'success',
                        message:'测试成功'
                    })
                    // alert('23');
                    // vm.uploadshow=false;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取点位关系
        getDeviceMonitorPointRelation(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getDeviceMonitorPointRelation',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                },
            }).then((response)=>{
                if(response.data.rt.length!=0){
                    this.getDeviceMonitorPointRelationList=response.data.rt;
                    document.getElementById('toolTbale').style.height='300px';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }else{
                    // document.getElementById('toolTbale').style.height='0px';
                }
            })
        },
        //设置采集配置
        setCollectSetting(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/setCollectSetting',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                    collectRate:parseInt(this.collectRateRadio),//采集频率
                    collectHour:this.collectHour,//采集时间
                },
            }).then((response)=>{
                if(response.data.rt){
                    this.manufacturerValue='';
                    this.collectRateRadio='1';
                    this.collectHour='';
                   
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取采集配置
        getCollectSetting(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getCollectSetting',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                    collectRate:parseInt(this.collectRateRadio),//采集频率
                    collectHour:this.collectHour,//采集时间
                },
            }).then((response)=>{
                if(response.data.rt){
                    this.manufacturerValue=response.data.rt.manufacturer;
                    if( this.manufacturerValue=="基康"){
                        this.getDeviceMonitorPointRelation();
                    }
                    this.collectRateRadio=response.data.rt.collectRate==1?'1':'2';
                    this.collectHour=response.data.rt.collectHour;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //清空点位关系
        clearDeviceMonitorPointRelation(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/clearDeviceMonitorPointRelation',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:vm.itemMonitorId,
                    manufacturer:vm.manufacturerValue,
                },
            }).then((response)=>{
                if(response.data.cd=='0'){
                        document.getElementById('toolTbale').style.height='0px';
                        this.getDeviceMonitorPointRelation()
                    // this.manufacturerValue='';
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //添加/华环项目节点
        editHuahuanNode(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editHuahuanNode',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId,
                    nodeId:this.nodeId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.autoAcquisitionShow=false;
                    this.nodeId='';
                    this.$message({
                        type:'success',
                        message:'自动采集成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        // 获取华环项目节点
        getHuahuanNode(){
             var vm=this;
            axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/getHuahuanNode',
                headers:{
                    'token':this.token
                },
                params:{
                    itemId:this.itemMonitorId
                }
            }).then((response)=>{
                if(response.data.rt){
                    this.getHuahuanNodeList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },

    }
})
</script>
<style lang="less">
            *{
                margin:0px;
                padding: 0px;
            }
            i{
                font-style:normal
            }
            li{list-style: none}
            .gatherTimeName{
                width: 375px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .gatherTimeNameInp{
                width: 375px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .tool{
                float: right;
                margin-right:52px;
                .export{
                    position: relative;
                    width:60px;
                    display: inline-block;
                    .export1{
                         display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: none;
                        cursor: pointer;
                        margin-right:10px;
                        // margin-top:10px;
                        background: url('./images/export.png') no-repeat 0 0;
                    }
                    .export2{
                         display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: none;
                        cursor: pointer;
                        margin-right:10px;
                        // margin-top:10px;
                        background: url('./images/clear.png') no-repeat 0 0;
                    }
                    .export3{
                         display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: none;
                        cursor: pointer;
                        margin-right:10px;
                        // margin-top:10px;
                        background: url('./images/save1.png') no-repeat 0 0;
                    }
                    .exportTxt{
                        position: absolute;
                        width: 50px;
                        top:-3px;
                        cursor: pointer;
                        // left:2px;
                        
                        // display: inline-block;
                    }
                   

                }
                .clear{

                }
                .text{

                }
                


            }
            #toolTbale{
                width: 85%;
                margin:10px auto;
                // height: 300px;
                overflow: auto;
                position: relative;
                .toolTbaleList{
                    // position: fixed;
                    // table-layout: fixed
                     border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                            overflow: auto;
                            thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 32px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
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
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                        /*
                                        溢出隐藏
                                        */
                                        overflow: hidden;
                                        /*
                                        显示省略号
                                        */
                                        text-overflow: ellipsis;
                                        /*
                                        不换行
                                        */
                                        white-space: nowrap;
                                    }
                                }
                            }
                }
                .toolTbaleList1{
                    border-collapse: collapse;
                            border: 1px solid #e6e6e6;
                    overflow: auto;
                            tbody{
                                tr{
                                    .red{
                                        color: red;
                                    }
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 32px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                        /*
                                        溢出隐藏
                                        */
                                        overflow: hidden;
                                        /*
                                        显示省略号
                                        */
                                        text-overflow: ellipsis;
                                        /*
                                        不换行
                                        */
                                        white-space: nowrap;
                                    }
                                }
                            }
                }
            }
            .sheetName{
                width: 375px;
                border-radius: 2px;
                height: 32px;
                border: 1px solid #cccccc;
                position: relative;
                background: #ffffff;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
</style>


