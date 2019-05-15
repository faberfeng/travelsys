<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div class="contentBody" v-if="!buildSafeEducationShow">
            <div class="ForumSelector">
                <span class="name">筛选条件</span>
                <ul>
                    <li class="selectItem">
                        <el-select v-model="onePerson" placeholder="请选择">
                                    <el-option
                                    v-for="item in personList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                        </el-select>
                    </li>
                    <li class="selectItem">
                        <!-- <span class="title">时间</span> -->
                        <span class="itemContent">
                            <v2-datepicker format="yyyy-MM-DD" v-model="selectTime"  @change="changeDatePicker()" ></v2-datepicker>
                         </span>
                    </li>
                    <li class="selectItem">
                       <span class="title-right">
                            <input type="text" v-model="selectName" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="selectNameInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="selectNameInfo"></span>
                        </span>
                    </li>
                     
                </ul>
                <div class="wrapperHead" @click="buildSafeEducation">
                    <span class="el-icon-plus"></span><span class="elName">新建安全教育</span>
                </div>
            </div>
            <div class="bodyList">
                <ul style="width:100%">
                    <li class="bodyLi" v-for="(item,index) in getSafetyEducationList" :key="index">
                        <span class="liSpanOne">{{index+1}}</span>
                        <span class="liSpanTwo">
                            <div style="height:40px;line-height:40px;text-align:left"><span style="font-size:16px;font-weight:bold;">{{item.title}}</span><span></span></div>
                            <div style="height:70px;line-height:75px;">
                                <span style="width:230px;text-align:left;font-size:16px;color:#999999;display:inline-block;">活动发起单位：{{item.originator}}</span>
                                <span style="width:230px;text-align:left;font-size:16px;color:#999999;display:inline-block;">负责人：{{item.leader}}</span>
                                <span style="width:330px;text-align:left;font-size:16px;color:#999999;display:inline-block;">活动时间：{{timeChange(item.startTime)}}————{{timeChange(item.endTime)}}</span>
                            </div>
                        </span>
                        <span class="liSpanThree">
                            <span class="spanButton">查看详细</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <commonMessage v-if="buildSafeEducationShow" ref="commonMessage" @refreshPage="refresh()" @back="backHome" :projectName="projectName" :wordType="wordType"></commonMessage>
    </div>
</template>

<script>
import axios from 'axios'
import commonMessage from './commonMessage.vue'
import moment from 'moment'
export default {
    name:'safeEducation',
    components:{
        commonMessage
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
            getSafetyEducationList:[],
            projectName:'安全教育',
            wordType:1
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
        vm.getSafetyEducation();

    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'054','05402','/safetyEducation/safeEducation','05401','/safetyEducation/visitorSafety','05403','/safetyEducation/safeTechnology');
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

        },
        selectNameInfo(){

        },
        buildSafeEducation(){
            this.buildSafeEducationShow=true;

        },
        backHome(){
            this.buildSafeEducationShow=false;
        },
        refresh(){
            this.getSafetyEducation();
            this.buildSafeEducationShow=false;
        },
        getSafetyEducation(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'safety/getSafetyEducation',
                headers:{
                    'token':this.token
                },
                params:{
                    projId:this.projId,
                   
                },
                method:'get'
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getSafetyEducationList=response.data.rt;
                }
            })
        },
        timeChange(val){
            if(val){
                return moment(val).format('YYYY-MM-DD')
            }

        }


    },

}
</script>

<style lang="less">
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
