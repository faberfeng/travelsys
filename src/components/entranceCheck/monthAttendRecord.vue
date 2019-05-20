<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
         <div class="contentBody">
            <div class="ForumSelector">
                <span class="name">筛选条件</span>
                <ul>
                    <li class="selectItem">
                        <!-- <span class="title">时间</span> -->
                        <span class="itemContent">
                            <v2-datepicker format="yyyy-MM" v-model="selectTime"  @change="changeDatePicker()" ></v2-datepicker>
                         </span>
                    </li>
                    <li class="selectItem">
                       <span class="title-right">
                            <input type="text" v-model="selectName" placeholder="请输入姓名"  class="title-right-icon" @keyup.enter="selectNameInfo">
                            <span  class="title-right-edit-icon el-icon-search" @click="selectNameInfo"></span>
                        </span>
                    </li>
                     
                </ul>
                <span class="selectItemRight" >
                        导出
                </span>
                   
            </div>
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序号</th>
                           <th>姓名</th>
                           <th>单位</th>
                           <th>工种</th>
                           <th>考勤班次</th>
                           <th>休息天数</th>
                           <th>迟到</th>
                           <th>早退</th>
                           <th>旷工</th>
                           <th>加班</th>
                       </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in getAttendancyByMonthLists" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.department}}</td>
                            <td>{{item.kind.length==0?'/':item.kind}}</td>
                            <td>{{item.workingDay}}</td>
                            <td>{{item.restDay}}</td>
                            <td>{{item.lateDay}}</td>
                            <td>{{item.leaveEarlyDay}}</td>
                            <td>{{item.overtimeDay}}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="getAttendancyByMonthList.length==0" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
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
                        :total="getAttendancyByMonthListLength">
                    </el-pagination>
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
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
            getAttendancyByMonthList:[],
            getAttendancyByMonthLists:[],
            getAttendancyByMonthListLength:1,
            timeStamp:'',
            pageSize:10,
            pageNum:1,
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
        vm.timeStamp=new Date().getTime();
        vm.loadingTitle();
        vm.getAttendancyByMonth('',vm.timeStamp);

    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'052','05202','/entranceCheck/monthAttendRecord','05201','/entranceCheck/todayAttendRecord','05203','/entranceCheck/entranceRecord');
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
         handleSizeChange(val){
            this.getAttendancyByMonthLists=[];
            this.pageSize=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getAttendancyByMonthListLength-1>=NumB&&this.getAttendancyByMonthListLength-1<=NumE){
                NumE=this.getAttendancyByMonthListLength-1;
            }
          
            for(var i=NumB;i<NumE+1;i++){
                this.getAttendancyByMonthLists.push(this.getAttendancyByMonthList[i])
            }

        },
        handleCurrentChange(val){
            this.getAttendancyByMonthLists=[];
            this.pageNum=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getAttendancyByMonthListLength-1>=NumB&&this.getAttendancyByMonthListLength-1<=NumE){
                NumE=this.getAttendancyByMonthListLength-1;
            }
            for(var i=NumB;i<NumE+1;i++){
                this.getAttendancyByMonthLists.push(this.getAttendancyByMonthList[i])
            }
        },
        //改变时间
        changeDatePicker(){
            this.getAttendancyByMonth(this.selectName,this.selectTime);
        },
        selectNameInfo(){
            this.getAttendancyByMonth(this.selectName,this.selectTime)
        },
        getAttendancyByMonth(name,date){
            this.getAttendancyByMonthLists=[];
            axios({
                url:this.BDMSUrl+'attendancy/getAttendancyByMonth',
                headers:{
                    'token':this.token
                },
                params:{
                    name:name,
                    projectId:this.projId,
                    date:moment(date).format('YYYY-MM')+'-01'
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getAttendancyByMonthList=response.data.rt;
                    this.getAttendancyByMonthListLength=this.getAttendancyByMonthList.length;
                    if(this.getAttendancyByMonthListLength<11){
                        for(var i=0;i<this.getAttendancyByMonthListLength;i++){
                            this.getAttendancyByMonthLists.push(this.getAttendancyByMonthList[i])
                        }
                    }else{
                        for(var i=0;i<10;i++){
                            this.getAttendancyByMonthLists.push(this.getAttendancyByMonthList[i])
                        }
                    }
                }else{

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
                        .selectItemRight{
                                float: right;
                                 width: 96px;
                                height: 48px;
                                line-height: 48px;
                                text-align: left;
                                padding-left: 10px;
                                font-size: 16px;
                                color:rgb(141, 141, 190);
                                cursor: pointer;
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
                                    // .deleteBtn{
                                    //     background: url('../../assets/delete.png') no-repeat 0 0;
                                    // }
                                    // .editBtn{
                                    //     background: url('./images/overviewedit.png') no-repeat 0 0;
                                    // }
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

}

</style>
