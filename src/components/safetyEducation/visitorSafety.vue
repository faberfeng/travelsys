<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div id="safeWarpper">
            <div class="wrapper_left">
                <div class="wrapper_left_content">
                    <ul>
                        <li v-for="(item,index) in getVisitorInfoLists" :key="index">
                            <span class="one_Span"><i class="el-icon-menu"></i>{{item.remark}}</span>
                            <span class="two_Span"><label>访客人数：{{item.entourage}}</label></span>
                            <span class="three_Span"><label>日期：{{item.addtime}}</label></span>
                            <span class="four_Span"><label>单位：{{item.company}}</label></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="wrapper_right">
                <div class="wrapper_right_content">
                    <ul>
                        <li style="top:20px;left:20px;">
                            <div class="header">
                                <span>大标题</span>
                                <!-- <i class="el-icon-circle-plus"></i> -->
                            </div>
                            <div></div>
                        </li>
                         <li style="top:50px;left:40px;">
                             <div class="header">
                                <span>标题</span>
                                <i class="el-icon-circle-plus"></i>
                                <i class="el-icon-remove"></i>
                            </div>
                         </li>
                    </ul>
                    
                </div>
            </div>

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
                url:this.BDMSUrl+'visitor/getVisitorInfo',
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
            .wrapper_left{
                margin-top:40px;
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
                            border: 2px solid #44e2ba;
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
                margin-top:40px;
                width: 30%;
                height: 500px;
                float: left;
                // border:1px solid #ccc;
                .wrapper_right_content{
                    width: 90%;
                    margin: 20px auto;
                    ul{
                        position: relative;
                        li{
                            height: 200px;
                            width: 200px;
                            border:2px solid #44e2ba;
                            box-shadow: 0 16px 30px rgba(0,0,0,.1);
                            position: absolute;
                            background: white;
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
                            // top:20px;
                            // left:20px;
                        }
                    }

                }
            }
        }

}

</style>
