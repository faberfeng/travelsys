<template>
    <div id="personContent">
        <div class="contentHead">
            <div class="contentHeadLeft">
                <img class="imgCenter" :src="userImg?userImg:require('../../assets/people.png')">
            </div>
            <div class="contentHeadRight">
                <ul style="width:50%;height:inherit;float:left;">
                    <li class="rightLi">
                        <label class="nameLabel">姓名：</label><label class="itemLabel">发</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">账号：</label><label class="itemLabel">faber</label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">岗位：</label><label class="itemLabel"></label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">成员类型：</label><label class="itemLabel"></label>
                    </li>
                </ul>
                <ul style="width:50%;height:inherit;float:right;">
                    <li class="rightLi">
                        <label class="nameLabel">诚信评价：</label><label class="itemLabel"></label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">本月考勤：</label><label class="itemLabel"></label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">出勤班次：</label><label class="itemLabel"></label>
                    </li>
                    <li class="rightLi">
                        <label class="nameLabel">休息天数：</label><label class="itemLabel"></label>
                    </li>

                </ul>
            </div>
        </div>
        <div class="contentBottom">
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                    <div class="basicInfWrapper">
                        <div class="leftWrapper">
                            <div class="boxInp">
                                <label class="wrapperLabel">姓名:</label>
                                <input v-model="name" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">民族:</label>
                                <input v-model="nation" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">性别:</label>
                                <select v-model="sex" class="wrapperInp" placeholder="请选择">
                                    <option class="optionClass" v-for="item in sexOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    {{item.label}}
                                    </option>
                                </select>
                                <!-- <el-select v-model="sex" width="65%" placeholder="请选择">
                                    <el-option
                                    v-for="item in sexOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> -->
                                <!-- <input v-model="sex" class="wrapperInp"/> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">出生年月:</label>
                                <!-- <input v-model="birthday" class="wrapperInp"/> -->
                                <span class="wrapperInp">
                                    <v2-datepicker format="yyyy-MM-DD" v-model="birthday" width="100%" ></v2-datepicker>
                                </span>
                                <!-- <el-date-picker
                                    v-model="birthday"
                                    type="date"
                                    width="65% !important"
                                    placeholder="选择日期">
                                </el-date-picker> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">文化程度:</label>
                                <select v-model="education" class="wrapperInp" placeholder="请选择">
                                    <option class="optionClass" v-for="item in eduOptions"
                                    :key="item.value"
                                    :value="item.value">
                                    {{item.label}}
                                    </option>
                                </select>
                                <!-- <input v-model="education" class="wrapperInp"/> -->
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">专业:</label>
                                <input v-model="profession" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">联系方式:</label>
                                <input v-model="phone" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">住址:</label>
                                <input v-model="address" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">现住址:</label>
                                <input v-model="registeredAddress" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">身份证号:</label>
                                <input v-model="certificationNo" class="wrapperInp"/>
                            </div>
                            <div class="boxInp">
                                <label class="wrapperLabel">职称:</label>
                                <input v-model="technicalTitle" class="wrapperInp"/>
                            </div>
                        </div>
                        <div class="rightWrapper">
                            <div class="rightBox">
                                <label class="wrapperLabel"></label>
                                <span style="width:65%;display:inline-block;position:relative;height:132px;">
                                    <span class="imgCircle" @click="clickUserImg()">
                                        <img v-if="avaterUri" :src="avaterUriFile"/>
                                        <i v-if="!avaterUri" class="el-icon-circle-plus">
                                        </i>
                                        <label v-if="!avaterUri" style="display:block">上传头像</label>
                                        <input type="file" ref="uploadUserImg" accept="images/*" @change="changeUserImg($event)" style="opacity:0">
                                    </span>
                                </span>
                            </div>
                            <!-- <div class="rightBox">
                                <label class="wrapperLabel">身份证号:</label>
                                <input v-model="certificationNo" class="wrapperInp"/>
                            </div> -->
                            <div class="rightBox">
                                 <label class="wrapperLabel"></label>
                                  <span style="width:65%;display:inline-block;position:relative;height:140px;">
                                    <span class="personCircle" @click="clickCertificate()">
                                        <img v-if="certificationPhoto" :src="certificationPhoto">
                                        <i v-if="!certificationPhoto" class="el-icon-upload"></i>
                                        <label v-if="!certificationPhoto" style="display:block">上传身份证照片</label>
                                    </span>
                                    <input type="file" ref="uploadCertificateImg" accept="images/*" @change="changeCertificateImg($event)" style="opacity:0">
                                  </span>
                            </div>
                            <div class="rightBox">
                                <!-- 岗位证书: -->
                                <label class="wrapperLabel"></label>
                                <span style="width:65%;display:inline-block;position:relative;height:140px;">
                                    <span class="personCircle" @click="clickstationCertificate()">
                                        <img v-if="stationCertiyPhoto" :src="stationCertiyPhoto">
                                        <i v-if="!stationCertiyPhoto" class="el-icon-upload"></i>
                                        <label v-if="!stationCertiyPhoto" style="display:block">上传岗位证书照</label>
                                    </span>
                                    <input type="file" ref="uploadStationCertificateImg" accept="images/*" @change="changestationCertiImg($event)" style="opacity:0">
                                  </span>
                            </div>
                            <!-- <div class="rightBox">
                                <label class="wrapperLabel">职称:</label>
                                <input v-model="technicalTitle" class="wrapperInp"/>
                            </div> -->
                            <div class="makeBtn">
                                <span class="btnSure" @click="personInfoMakeSure">确认</span>
                            </div>
                        </div>
                    </div>
                    
                </el-tab-pane>
                <el-tab-pane label="考勤信息">
                    <!-- <div class="enterInfWrapper">
                        <div>
                            <calendar
                                ref="calendar1"
                                :multi="calendar1.multi"
                                :zero="calendar1.zero"
                                :events="calendar1.events" 
                                :lunar="calendar1.lunar" 
                                :value="calendar1.value" 
                                :begin="calendar1.begin" 
                                :end="calendar1.end" 
                                :weeks="calendar1.weeks" 
                                :months="calendar1.months" 
                                ></calendar>
                        </div>
                    </div> -->
                    <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>姓名</th>
                                            <th>部门</th>
                                            <th>进场时间</th>
                                            <th>打卡方式</th>
                                            <th>考勤情况</th>
                                            <th>出场时间</th>
                                            <th>打卡方式</th>
                                            <th>考勤情况</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in getAttendancyByUserIdList" :key="index">
                                            <td>{{index+1}}</td>
                                            <td>{{item.department}}</td>
                                            <td>{{timeChange(item.enterTime)}}</td>
                                            <td>{{entOutCheckType(item.checkInType)}}</td>
                                            <td>{{doorType(item.enterStatus)}}</td>
                                            <td>{{timeChange(item.leaveTime)}}</td>
                                            <td>{{entOutCheckType(item.checkOutType)}}</td>
                                            <td>{{doorType(item.leaveStatus)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <el-tab-pane label="从业信息">
                    <div class="workInfoWrapper">
                        <div class="header">
                            <div class="titleBtn">
                                <i class="el-icon-s-custom"></i>
                                当前工作信息
                            </div>
                            <div class="titleInfo">
                                <div class="Wrapper" style="float:left;">
                                    <div class="boxInp">
                                        <label class="wrapperLabel">岗位:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">入职时间:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">所属单位:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">成员类型:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel">合同到期:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                </div>
                                <div class="Wrapper" style="float:right;">
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">三级安全教育卡:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">安全交底记录:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">技术交底记录:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">特种操作证书:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                    <div class="boxInp">
                                        <label class="wrapperLabel" style="width:20% !important">合同附件:</label>
                                        <input class="wrapperInp"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="titleBtn">
                                <i class="el-icon-s-custom"></i>
                                过往履历信息
                            </div>
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>时间</th>
                                            <th>单位</th>
                                            <th>岗位</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="诚信信息">
                    <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>时间</th>
                                            <th>事件类型</th>
                                            <th>事件</th>
                                            <th>处理结果</th>
                                            <th>更多</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <el-tab-pane label="安全教育信息">
                     <div class="workInfoWrapper">
                        <div class="bottom">
                            <div class="bottomTable">
                                <table class="tableList" border="1" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>安全教育</th>
                                            <th>安全教育</th>
                                            <th>教育类别</th>
                                            <th>活动发起单位</th>
                                            <th>更多</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="账号安全">定时任务补偿</el-tab-pane> -->
            </el-tabs>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import calendar from '../Settings/calendar.vue'
export default {
    name:'projectPerson',
    components: {
        calendar
    },
    data(){
        return{
            projId:'',
            token:'',
            BDMSUrl:'',
            getStaffProfileList:'',
            userImg:'',
            sexOptions:[{
                value:1,
                label:'男'
            },
            {
                value:2,
                label:'女'
            }],
            eduOptions:[
                {
                    value:0,
                    label:'初中'
                },
                {
                    value:1,
                    label:'高中'
                },
                {
                    value:2,
                    label:'专科'
                },
                {
                    value:3,
                    label:'本科及以上'
                }
            ],
            calendar1:{
                 multi:true,
                 zero:true,
                value:[[2019,5,12],[2019,5,13],[2019,5,14],[2019,5,15],[2019,5,16],], //默认日期
                lunar:true, //显示农历
                weeks:['日', '一', '二', '三', '四', '五', '六'],
                display:"2018/02/16",
                months:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                events:{
                    // '2018-7-2':'工作日',
                    // '2017-7-20':'$408',
                    // '2017-7-21':'$460',
                    // '2017-7-22':'$500',
                },
                // begin:[2019,5,11], //可选开始日期
                // end:[2019,6,11], //可选结束日期
                select(value){
                    console.log(value,'value');
                },
                selectMonth(month,year){
                    
                },
                selectYear(year){
                   
                },
                timestamp:Date.now()
            },
            address:'',
            avaterUri:'',
            birthday:'',
            certificationNo:'',	
            certificationPhoto:'',
            stationCertiyPhoto:'',
            education:1,
            name:'',
            nation:'',
            phone:'',
            profession:'',
            registeredAddress:'',
            sex:1,
            stationCertificate:'',
            technicalTitle:'',
            userImgList:null,
            cerfiticateImgList:null,
            stationCerfiticateImgList:null,
            getStaffProfileList:'',
            getAttendancyByUserIdList:[],
            timestamps:'',
        }
    },
    created(){
        var vm=this;
        vm.projId = localStorage.getItem('projId');
        vm.token = localStorage.getItem('token');
        vm.projName=localStorage.getItem('projName');
        vm.userId = localStorage.getItem('userId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.userImg=localStorage.getItem('userImg');
        vm.userName=localStorage.getItem('userName');
        // console.log(vm.userName,'vm.userName');
        vm.timestamps=moment(new Date().getTime()).format('YYYY-MM');
        vm.name=vm.userName;
        vm.getAttendancyByUserId(vm.timestamps)
        console.log(vm.userId,'vm.userId000');
    },
    methods:{
        getStaffProfile(){
            axios({
                url:this.BDMSUrl+'user/getStaffProfile',
                headers:{
                    'token':this.token
                },
                params:{
                    userId:this.userId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getStaffProfileList=response.data.rt;
                }
            })
        },
        personInfoMakeSure(){
            var vm=this;
            var formData=new FormData();
            formData.append('file',this.cerfiticateImgList);
            formData.append('file',this.stationCerfiticateImgList);
            // var data={
            //             "address": this.address,
            //             "avaterUri": this.avaterUri,
            //             "birthday": this.birthday,
            //             "certificationNo": this.certificationNo,
            //             "certificationPhoto": this.certificationPhoto,
            //             "education": this.education,
            //             "name": this.name,
            //             "nation": this.nation,
            //             "phone": this.phone,
            //             "profession": this.profession,
            //             "registeredAddress": this.registeredAddress,
            //             "sex": this.sex,
            //             "stationCertificate": this.stationCertificate,
            //             "technicalTitle": this.technicalTitle,
            //             "userId":this.userId
            //     }
            axios({
                url:this.BDMSUrl+'user/setStaffProfile',
                headers:{
                    'token':this.token,
                    'Content-Type':'multipart/form-data'
                },
                method:'post',
                params:{
                    projectId:this.projId,
                    address: this.address,
                    avaterUri: this.avaterUri,
                    birthday: moment(this.birthday).format('YYYY-MM-DD'),
                    certificationNo: this.certificationNo,
                    // certificationPhoto: this.certificationPhoto,
                    education: this.education,
                    name: this.name,
                    nation: this.nation,
                    phone: this.phone,
                    profession: this.profession,
                    registeredAddress: this.registeredAddress,
                    sex: this.sex,
                    // stationCertificate: this.stationCertificate,
                    technicalTitle: this.technicalTitle,
                    userId:this.userId
                },
                data:formData
            }).then((response)=>{
                this.getStaffProfile();
            })
        },
        getStaffProfile(){
            axios({
                url:this.BDMSUrl+'user/getStaffProfile',
                headers:{
                    'token':this.token
                },
                params:{
                    userId:this.userId
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getStaffProfileList=response.data.rt;
                }
            })
        },
        getAttendancyByUserId(date){
            axios({
                url:this.BDMSUrl+'attendancy/getAttendancyByUserId',
                headers:{
                    'token':this.token
                },
                params:{
                    userId:this.userId,
                    projectId:this.projId,
                    date:date+'-01'
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getAttendancyByUserIdList=response.data.rt;
                }
            })
        },

        clickUserImg(){
            this.$refs.uploadUserImg.click();
        },
        changeUserImg(){
                this.userImgList=this.$refs.uploadUserImg.files[0];
                this.avaterUriFile=URL.createObjectURL(this.userImgList);
                if(this.userImgList){
                    var formData=new FormData();
                    formData.append('file',this.userImgList)
                    axios({
                        url:this.BDMSUrl+'register/uploadAvater',
                        headers:{
                            'token':this.token
                        },
                        method:'post',
                        data:formData
                    }).then((response)=>{
                        if(response.data.cd==0){
                                this.avaterUri=response.data.rt;
                        }
                    })
                }
        },
        clickCertificate(){
            this.$refs.uploadCertificateImg.click();
        },
        changeCertificateImg(){
            this.cerfiticateImgList=this.$refs.uploadCertificateImg.files[0]
            this.certificationPhoto=URL.createObjectURL(this.cerfiticateImgList);
                // if(this.cerfiticateImgList){
                //     var formData=new FormData();
                //     formData.append('file',this.cerfiticateImgList)
                //     axios({
                //         url:this.BDMSUrl+'design/dcUpload',
                //         method:'post',
                //         headers:{
                //             'token':this.token
                //         },
                //         params:{
                //             projectId:this.projId
                //         },
                //         data:formData
                //     }).then((response)=>{
                //         if(response.data.cd==0){
                //                 this.certificationPhoto=response.data.rt.uri;
                //         }
                //     })
                // }
        },
        clickstationCertificate(){
            this.$refs.uploadStationCertificateImg.click();
        },
        changestationCertiImg(){
            this.stationCerfiticateImgList=this.$refs.uploadStationCertificateImg.files[0]
            this.stationCertiyPhoto=URL.createObjectURL(this.stationCerfiticateImgList);
            //  if(this.stationCerfiticateImgList){
            //         var formData=new FormData();
            //         formData.append('file',this.stationCerfiticateImgList)
            //         axios({
            //             url:this.BDMSUrl+'design/dcUpload',
            //             method:'post',
            //             headers:{
            //                 'token':this.token
            //             },
            //             params:{
            //                 projectId:this.projId
            //             },
            //             data:formData
            //         }).then((response)=>{
            //             if(response.data.cd==0){
            //                     this.stationCertiyPhoto=response.data.rt.uri;
            //             }
            //         })
            // }
        }
    },



}
</script>

<style lang="less" scoped>
*{
    margin:0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
#personContent{
    // margin-top:20px;
    width: 96%;
    margin:30px auto;
    .contentHead{
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        // border:1px solid #ccc;
        height: 250px;
        border-radius: 4px;
        .contentHeadLeft{
            width: 25%;
            height: 250px;
            // display: flex;
            background: #f8f8f8;
            position: relative;
            // text-align: left;
            .imgCenter{
                position: absolute;
                top:-21px;
                left:10%;
                width: 80%;
                margin:0 auto;

                height: 250px;
                // width: 100%;
                // height: 100%;
                margin:20px auto;
                // justify-content: center;
                // align-items: center;
            }
        }
        .contentHeadRight{
            width: 70%;
            margin-left:5%;
            height: 250px;
            background: #f8f8f8;
            .rightLi{
                height: 26px;
                padding: 15px;
                font-size:16px;
                font-weight: 500;
                .nameLabel{
                    width: 50%;
                    height: inherit;
                    line-height: 26px;
                    text-align: center;
                    display: inline-block;

                }
                .itemLabel{
                    width: 50%;
                    height: inherit;
                    line-height: 26px;
                    text-align: center;
                    display: inline-block;

                }

            }
        }
    }
    .contentBottom{
        margin-top:20px;
        // .el-tabs__header{
        //     height: 41px !important;
        // }
        // .el-tabs--border-card > .el-tabs__header .el-tabs__item {
        //     font-size: 16px;
        //     width: 122px;
        //     font-weight: bold;
        //     color: #666666;
        // }
        .basicInfWrapper{
            width: 100%;
            margin:15px;
            .leftWrapper{
                width: 50%;
                float: left;
                .boxInp{
                    margin-top:5px;
                    .wrapperLabel{
                        width: 15%;
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        font-size:16px;
                        text-align: left;
                    }
                    .wrapperInp{
                        width: 65%;
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        border: 1px solid #dcdfe6;
                        box-sizing: border-box;
                        color: #606266;
                        display: inline-block;
                        font-size: inherit;
                        height: 40px;
                        line-height: 1;
                        outline: 0;
                        padding: 0 15px;
                        .optionClass{
                            height: 28px;
                        }
                    }
                }
                

            }
            .rightWrapper{
                width: 50%;
                float: right;
                .rightBox{
                    margin-top:5px;
                     .wrapperLabel{
                        width: 15%;
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        font-size:16px;
                        text-align: left;
                    }
                    .imgCircle{
                        display: inline-block;
                        width: 125px;
                        height: 125px;
                        border:1px solid #ccc;
                        border-radius: 4px;
                        // margin-left:-184px;
                        position: absolute;
                        top: 9px;
                        left: 0px;
                        // margin-bottom: 10px;
                        &:hover{
                            border:1px dashed #06c;
                        }
                        img{
                            position: absolute;
                            top:0px;
                            left:0px;
                            width: 125px;
                            height: 125px;
                        }
                        .el-icon-circle-plus{
                            font-size: 26px;
                            margin-top:34px;
                            margin-bottom:4px;
                            cursor: pointer;
                        }
                    }
                    .personCircle{
                        display: inline-block;
                        width: 250px;
                        height: 140px;
                        border:1px solid #ccc;
                        border-radius: 4px;
                        position: absolute;
                        top:0px;
                        left:0px;
                        img{
                            position: absolute;
                            top:0px;
                            left:0px;
                            width: 250px;
                            height: 140px;
                        }
                        // margin-left:-58px;
                        // margin-bottom: 10px;
                        &:hover{
                            border:1px dashed #06c;
                        }
                        .el-icon-upload{
                            font-size: 26px;
                            margin-top:34px;
                            margin-bottom:4px;
                            cursor: pointer;
                        }

                    }
                    .wrapperInp{
                        width: 65%;
                        background-color: #fff;
                        background-image: none;
                        border-radius: 4px;
                        border: 1px solid #dcdfe6;
                        box-sizing: border-box;
                        color: #606266;
                        display: inline-block;
                        font-size: inherit;
                        height: 40px;
                        line-height: 1;
                        outline: 0;
                        padding: 0 15px;
                    }
                    


                }
                .makeBtn{
                    width: 100%;
                    height: 50px;
                    margin:20px auto;
                    .btnSure{
                        width: 140px;
                        height: 44px;
                        color: #58adfb;
                        text-align: center;
                        line-height: 44px;
                        text-decoration: none;
                        border: 1px solid #58adfb;
                        border-radius: 5px;
                        font-size: 14px;
                        display: inline-block;
                        cursor: pointer;
                        &:hover{
                            background: #58adfb;
                            color: #fff;
                        }
                    }
                }
               

            }
        }
        .enterInfWrapper{
            padding: 20px;
            margin:20px;
        }
        .workInfoWrapper{
            margin:20px auto;
            .header{
                height: 310px;
                .titleBtn{
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    background: #58adfb;
                    color:white;
                    border: 1px solid white;
                    border-radius: 4px;
                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    .el-icon-s-custom{
                        font-size:20px;
                    }
                }
                .titleInfo{
                    margin:30px auto;
                    .Wrapper{
                        width: 50%;
                        
                        .boxInp{
                            margin-top:5px;
                            .wrapperLabel{
                                width: 15%;
                                display: inline-block;
                                height: 30px;
                                line-height: 30px;
                                font-size:16px;
                                text-align: left;
                            }
                            .wrapperInp{
                                width: 65%;
                                background-color: #fff;
                                background-image: none;
                                border-radius: 4px;
                                border: 1px solid #dcdfe6;
                                box-sizing: border-box;
                                color: #606266;
                                display: inline-block;
                                font-size: inherit;
                                height: 40px;
                                line-height: 1;
                                outline: 0;
                                padding: 0 15px;
                            }
                        }
                    }
                }
            }
            .bottom{
                .titleBtn{
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    background: #58adfb;
                    color:white;
                    border: 1px solid white;
                    border-radius: 4px;
                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    .el-icon-s-custom{
                        font-size:20px;
                    }
                }
                .bottomTable{
                    margin-top:20px;
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

                                    }
                                }
                            }
                        }
                }
            }
        }
       
    }
}
</style>
