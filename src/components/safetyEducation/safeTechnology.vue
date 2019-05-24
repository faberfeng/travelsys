<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div class="contentBody" v-if="!buildSafeEducationShow&&!makeSureMessageShow&&!finishMessageShow">
            <div class="ForumSelector">
                <span class="name">筛选条件</span>
                <ul>
                    <!-- <li class="selectItem">
                        <el-select v-model="onePerson" placeholder="请选择">
                                    <el-option
                                    v-for="item in personList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                        </el-select>
                    </li> -->
                    <li class="selectItem">
                        <!-- <span class="title">时间</span> -->
                        <span class="itemContent">
                            <v2-datepicker format="yyyy-MM-DD" v-model="selectTime"  @change="changeDatePicker()" ></v2-datepicker>
                         </span>
                    </li>
                    <li class="selectItem">
                       <span class="title-right">
                            <input type="text" v-model="selectName" placeholder="请输入名称"  class="title-right-icon" @keyup.enter="selectNameInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="selectNameInfo"></span>
                        </span>
                    </li>
                     
                </ul>
                <div class="wrapperHead" @click="buildSafeEcology">
                    <span class="el-icon-plus"></span><span class="elName">新建安全技术交底</span>
                </div>
            </div>
            <div class="bodyList">
                <ul style="width:100%">
                    <li class="bodyLi" v-for="(item,index) in getSafetyTechnologyList" :key="index">
                        <span class="liSpanOne">{{index+1}}</span>
                        <span class="liSpanTwo">
                            <div style="height:40px;line-height:40px;text-align:left"><span style="font-size:16px;font-weight:bold;">{{item.title}}</span><span v-if="!item.joined" style="color:#2e8cb9;font-size:14px;display:inline-block;margin-left:40px;">活动进行中</span><span v-if="item.joined" style="color:rgba(255, 152, 0, 1);font-size:14px;display:inline-block;margin-left:40px;">已结束</span></div>
                            <div style="height:70px;line-height:75px;">
                                <span style="width:230px;text-align:left;font-size:16px;color:#999999;display:inline-block;">活动发起人：{{item.originator}}</span>
                                <span style="width:230px;text-align:left;font-size:16px;color:#999999;display:inline-block;">负责人：{{item.leader}}</span>
                                <span style="width:330px;text-align:left;font-size:16px;color:#999999;display:inline-block;">活动时间：{{timeChange(item.startTime)}}————{{timeChange(item.endTime)}}</span>
                            </div>
                        </span>
                        <span class="liSpanThree">
                            <span v-if="!item.joined" class="spanButton" @click="viewDetail(item)">查看详细</span>
                            <span v-if="item.joined" class="spanButton" @click="viewEndDetail(item)">查看详细</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <commonMessage v-if="buildSafeEducationShow" ref="commonMessage" @back="backHome" @refreshPage="refresh()" :wordType="wordType" :projectName="projectName"></commonMessage>
        <makeSureMessage v-if="makeSureMessageShow" :submitData="submitData" @back="backHomePage" :endProjectName="endProjectName" @refresh="refreshMakeSureMessage()" ref="makeSureMessage"></makeSureMessage>
        <finishMessage v-if="finishMessageShow" :submitData="submitFinishData" @back="backFinishHome" :endProjectName="endProjectFinishName"  ref="finishMessage"></finishMessage>
    </div>
</template>

<script>
import axios from 'axios'
import commonMessage from './commonMessage.vue'
import makeSureMessage from './makeSureMessage.vue'
import finishMessage from './finishMessage.vue'
import moment from 'moment'
export default {
    name:'safeTechnology',
    components:{
        commonMessage,makeSureMessage,finishMessage
    },
    data(){
        return{
            routerList:"",
            selectTime:"",
            selectName:"",
            personList:[{
                value:1,
                label:'活动发起者'
            }],
            onePerson:1,
            buildSafeEducationShow:false,
            makeSureMessageShow:false,
            wordType:2,
            projectName:'安全技术交底',
            endProjectName:'结束安全技术交底',
            getSafetyTechnologyList:[],
            submitData:{},
            finishMessageShow:false,
            submitFinishData:{},
            endProjectFinishName:'安全技术交底详情'

        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.BDMSUrl=this.$store.state.BDMSUrl;
        vm.loadingTitle();
        vm.getSafetyTechnology();
        vm.timeStamp=new Date().getTime();

    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'054','05403','/safetyEducation/safeTechnology','05401','/safetyEducation/visitorSafety','05402','/safetyEducation/safeEducation');
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
        changeDatePicker(){
            if(this.selectTime){
                this.getSafetyTechnology(this.selectTime,this.selectName);
            }else{
                this.getSafetyTechnology(this.timeStamp,this.selectName);
            }

        },
        selectNameInfo(){
            if(this.selectTime){
                    this.getSafetyTechnology(this.selectTime,this.selectName);
            }else{
                this.getSafetyTechnology(this.timeStamp,this.selectName);
            }
        },
        buildSafeEcology(){
            this.buildSafeEducationShow=true;

        },
        backHome(){
            this.buildSafeEducationShow=false;
        },
        refresh(){
            this.getSafetyTechnology();
            this.buildSafeEducationShow=false;
        },
        refreshMakeSureMessage(){
            this.getSafetyTechnology();
            this.makeSureMessageShow=false;
        },
        getSafetyTechnology(time,title){
            var vm=this;
            axios({
                url:this.BDMSUrl+'safety/getSafetyTechnology',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                    time:moment(time).format('YYYY-MM'),
                    title:title
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getSafetyTechnologyList=response.data.rt;
                }
            })
        },
        timeChange(val){
            if(val){
                return moment(val).format('YYYY-MM-DD')
            }
        },
        viewDetail(val){
            this.makeSureMessageShow=true;
            this.submitData=val;
        },
        viewEndDetail(val){
            this.submitFinishData=val;
            this.finishMessageShow=true;
        },
        backHomePage(){
            this.makeSureMessageShow=false;
        },
        backFinishHome(){
            this.finishMessageShow=false;
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
/***********设置滚动条************/
/* 设置滚动条的样式 */

.bodyList::-webkit-scrollbar {
    width:7px !important;
    height:50px;
}
/* 滚动槽 */
.bodyList::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0,0,0,0.5);
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
    border-radius:10px;
}
/* 滚动条滑块 */
.bodyList::-webkit-scrollbar-thumb{
    border-radius:10px;
    background:rgba(0,0,0,0.1);
    box-shadow: inset006pxrgba(0,0,0,0.5);
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
.bodyList::-webkit-scrollbar-thumb:window-inactive {
    background:rgba(255,0,0,0.4);
}
#content{
     width: 100%;
        .topHeader{
            box-sizing: border-box;
            // margin-top:107px;
            // float: left;
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
        .contentBody{
            margin-top:20px;
            padding: 20px 20px;
           .ForumSelector{
                        border: 1px solid #d9d9d9;
                        height: 50px;
                        color: #999999;
                        font-size: 12px;
                        // margin-right: 30px;
                        margin-right: 5px;
                        .name{
                            float: left;
                            width: 96px;
                            height: 48px;
                            line-height: 48px;
                            text-align: left;
                            padding-left: 10px;
                            background: #fafafa;
                        }
                        // .selectItemRight{
                        //         float: right;
                        //          width: 96px;
                        //         height: 48px;
                        //         line-height: 48px;
                        //         text-align: left;
                        //         padding-left: 10px;
                        //         font-size: 16px;
                        //         color:rgb(141, 141, 190);
                        //         cursor: pointer;
                        // }
                        .wrapperHead{
                            float: right;
                            line-height: 48px;
                            height: 48px;
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
                        >ul{
                            float: left;
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
                                    margin-top:4px;
                                    margin-left:4px;
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
                .bodyList{
                    margin-top:30px;
                    height: 500px;
                    overflow: auto;
                    .bodyLi{
                        height: 100px;
                        border-top:1px dashed #ccc;
                        border-bottom:1px dashed #ccc;
                        position: relative;
                        .liSpanOne{
                            left: 2%;
                            text-align: center;
                            line-height: 100px;
                            height: 100px;
                            display: inline-block;
                            position: absolute;
                            font-size:16px;
                            font-weight: bold;
                            color: #999;
                           
                        }
                        .liSpanTwo{
                            left: 10%;
                            text-align: center;
                            line-height: 80px;
                            height: 80px;
                            display: inline-block;
                            position: absolute;
                          
                        }
                        .liSpanThree{
                            left: 90%;
                            text-align: center;
                            line-height: 100px;
                            height: 100px;
                            display: inline-block;
                            position: absolute;
                            .spanButton{
                                display: inline-block;
                                height: 32px;
                                line-height: 30px;
                                text-align: center;
                                width: 70px;
                                color: rgb(126,209,245);
                                border: 1px solid rgb(126,209,245);
                                border-radius: 4px;
                                cursor: pointer;

                            }
                            
                        }
                        &:hover{
                            background: #fafafa;
                            // border-top:1px dashed #fafafa;
                            // border-bottom:1px dashed #fafafa;
                        }

                    }

                }
        }

}

</style>
