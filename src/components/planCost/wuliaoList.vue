<template>
    <div id="wuliaoBody">
        <div  class="topHeader">
            <div id="item-box-file">
                <!-- <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item label-item-active">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item">  
                    物料量清单  
                </router-link> -->
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
            <div style="margin:0 auto;width:98%;"> 
                <div class="ForumSelector">
                    <span class="name">筛选条件</span>
                    <ul>
                            <!-- options_monomer:[],//单体选项
                            options_status:[],//状态选项
                            options_about:[],//相关选项 -->
                        <li class="selectItem">
                            <span class="title">群组</span>
                            <el-select v-model="selectUgId" placeholder="请选择">
                                <el-option
                                v-for="item in ugList"
                                :key="item.groupId"
                                :label="item.groupName"
                                :value="item.groupId">
                                </el-option>
                            </el-select>
                        </li>
                        <li class="selectItem">
                            <span class="title">层级</span>
                            <el-select v-model="value_monomer" placeholder="请选择">
                                <el-option
                                v-for="(item,index) in options_monomer"
                                :key="index"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                        
                        <!-- <li class="selectItem">
                            <el-button class="buttonPrimary" type="primary" @click="makeSure">算量生成</el-button>
                            <span class="title">相关</span>
                            <el-select v-model="value_about" placeholder="请选择">
                                <el-option
                                v-for="item in options_about"
                                :key="item.id"
                                :label="item.Name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button></el-button>
                        </li> -->
                    </ul>
                </div>
                <div style="margin-top:20px;padding:0px;box-sizing: border-box;">
                    <table class="UserList" border="1" width="100%" style="margin:0 auto;">
                        <thead>
                            <tr  class="userList-thead">
                                <th width="18%">层级名称</th>
                                <th width="18%">材料名称</th>
                                <th width="14%;">数量</th>
                                <th width="14%;">单位</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,index) in getWorkAmountDataList" :key="index">
                                    <td>{{val.leveName}}</td>
                                    <td>{{val.classifyName}}</td>
                                    <td>{{val.value}}</td>
                                    <td>{{val.unit}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
export default {
    name:'wuliaoList',
    data(){
        return{
            BDMSUrl:'',
            projId:'',
            selectUgId:'',
            options_monomer:[],
            value_monomer:'',
            ugList:[],
            getWorkAmountDataList:[],
            projectSubmitData:[],
            routerList:'',
            moduleList:'',
        }
    },
    watch:{
        selectUgId:function(val){
            var vm=this;
            vm.getCatalog();
        },
        value_monomer:function(val){
            var vm=this;
           
            vm.options_monomer.forEach((item)=>{
                if(item.id==this.value_monomer){
                    this.value_monomerName=item.Name
                }
            })
            vm.getWorkAmountData();
        }
    },
    created(){
        var vm=this;
        vm.BDMSUrl=vm.$store.state.BDMSUrl;
        vm.projId=localStorage.getItem('projId');
        vm.token=localStorage.getItem('token');
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.loadingTitle();
        vm.getIntoCloudD();
        vm.getProjectGenieClass();
        console.log(vm.moduleList,'vm.moduleList');
    },
    methods:{
        loadingTitle(){
            var vn=this;
            vn.routerList=vn.getSecondGradeList(vn.moduleList,'012','01205','/Cost/wuliaoList','01202','/Cost/goujianList','01201','/Cost/management','01203','/Cost/quantities','01204','/Cost/inventory');
            // console.log(vn.routerList,'vn.routerList')
        },
        //二级标题生成函数
        getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4,Code5,routerLink5){
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
                    if(item.moduleCode==Code5){
                        vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink5);
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
        makeSure(){
            this.getWorkAmountData()
        },
        getIntoCloudD(){
            var vm = this
            axios({
                method:'GET',
                // url:vm.BDMSUrl+'project2/doc/documentCloudDisk',
                // url:vm.BDMSUrl+'userGroup/getAllGroup',
                // url:vm.BDMSUrl+'userGroup/getUserGroup',
                url:vm.BDMSUrl+'userGroup/getUserGroup',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(Math.ceil(response.data.cd) == 0){
                    vm.ugList = response.data.rt
                    // response.data.rt.forEach((item)=>{
                    //     if(item.groupName.indexOf('质量检查')==-1){
                    //             vm.ugList.push(item);
                    //     }
                    // })
                    vm.selectUgId = response.data.rt[0].groupId;
                    // vm.getCatalog();
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        getCatalog(){
            var vm=this;
            vm.options_monomer=[];
            vm.value_monomer='';
            vm.value_monomerName='';
            axios({
                url:vm.BDMSUrl+'doc/getDirectoryWithAll',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId,
                    groupId:vm.selectUgId
                }
                }).then((response)=>{
                    if(response.data.cd==0){
                        // if(response.data.rt){}
                            response.data.rt.forEach((item)=>{
                                if(item.dirName.indexOf('@')>-1){
                                        vm.options_monomer.push(
                                            {
                                                'id':item.dirId,
                                                'Name':this.joinData(item.dirName)
                                            }
                                        )
                                    }
                            })
                            if(vm.options_monomer.length>0){
                                vm.value_monomer = vm.options_monomer[1].id;
                                vm.value_monomerName = vm.options_monomer[1].Name;
                                // if(vm.value_monomer){
                                //      vm.getWorkAmountData()
                                // }
                                
                            }
                    }
                })
            },
        joinData(val){
            return val.split('@')[0]
        },
        
        // 获取工程量数据
        getWorkAmountData(){
            var vm=this;
            this.getWorkAmountDataList=[];
            axios({
                url:this.BDMSUrl+"projectInfo/getWorkAmountData",
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:vm.projId,
                    directoryId:vm.value_monomer
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    if(response.data.rt.errorInfos.length>0){
                        let data=response.data.rt.errorInfos.join('<br>')
                        // alert(data)
                        this.$message({
                            type:'warning',
                            dangerouslyUseHTMLString: true,
                            message:data,
                            duration:10000,
                            showClose: true
                        })
                    }
                    response.data.rt.workAmountDatas.forEach((item)=>{
                            // console.log(item,'item00');
                            this.projectSubmitData.forEach((val)=>{
                                if(val.classifyCode==item.code){
                                    this.getWorkAmountDataList.push({
                                        'leveName':vm.value_monomerName,
                                        'classifyName':val.classifyName+'('+item.code+')',
                                        'value':item.value,
                                        'unit':item.unit
                                    })
                                }
                            })
                    })
                    // console.log(this.getWorkAmountDataList,'this.getWorkAmountDataList');
                }
            })
        },
        getProjectGenieClass(){
            $.ajax({
                    url:this.BDMSUrl+'projectInfo/getBiddingCode',
                    headers:{
                        token:this.token
                    },
                    type:'get',
                    data:{
                        projectId:this.projId
                    },
                    success:(response)=>{
                        if(response.cd==0){
                            this.typeDigui(response.rt)
                            // console.log(this.projectSubmitData,'this.projectSubmitData');
                            // this.projectSubmitData = response.rt;
                        }
                    }
                })
            },
        typeDigui(data){
            for(let i=0;i<data.length;i++){
                if(data[i].children.length>0){
                    this.typeDigui(data[i].children)
                }else{
                    this.projectSubmitData.push(data[i])
                }
            }
        }
    }
    
}
</script>

<style lang="less">
*{
    margin: 0px;
    padding: 0px;
}
ul li{
    list-style-type:none;
}
#wuliaoBody{
     .topHeader{
            // box-sizing: border-box;
            // position: fixed;
            // top: 116px;
            // left: 26px;
            // bottom:0;
            // right: 0;
            // overflow: auto;
            box-sizing: border-box;
            float: left;
            width: 100%;
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
                .header{
                    position: absolute;
                    display: block;
                    top: 13px;
                    right: 50px;
                    overflow: hidden;
                    .singelOne{
                        float: left;
                        color: #999;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                    }
                }
        }
     .ForumSelector{
        //  width: 98%;
            margin:0 auto;
            border: 1px solid #d9d9d9;
            height: 40px;
            color: #999999;
            font-size: 12px;
            margin-top: 30px;
            // margin-right: 5px;
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
                    .buttonPrimary{
                        margin-left:14px;
                        margin-top:6px;
                        padding: 6px;
                        display: block;
                        height: 25px;
                        width: 68px;
                    }
                    
                }
                .selectItem:first-of-type .el-select .el-input__inner{
                    width: 170px;
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
                }
                &:hover{
                    background: #fafafa;
                }
            }
        }
    }

}


</style>
