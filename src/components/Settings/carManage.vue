<template>
    <div id="wrapper">
            <div class="leftTxt">
               
                项目停车位总数:<span style="display:inline-block;margin-left:5px;">{{parkingCount}}</span>
                
                <el-input-number size="medium" class="allChange" v-model="parkingCount" @change="changeParkingCount()"></el-input-number>
                
            </div>
            <div class="wrapperHead" @click="bulidCarType" >
                 <span class="el-icon-plus"></span><span class="elName">添加车辆类型</span>
            </div>
            <div class="contentBody">
                <div class="tableBody">
                    <table class="tableList" border="1" cellspacing="0" width="100%">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>车辆类型</th>
                            <th>编辑</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in cardLists" :key="index">
                                <td>{{index+1}}</td>
                                <td></td>
                                <td>
                                    <button class="actionBtn editBtn" @click="editicCard(item)" title="更新"></button>
                                    <button class="actionBtn deleteBtn" @click="deleteicCard(item)" title="删除"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="cardList.length==0" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
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
                            :total="cardListLength">
                        </el-pagination>
                    </div>
                </div>

            </div>
            <div id="edit">
                <el-dialog title="添加IC卡" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">车辆类型 :</label><input class="inp" placeholder="请输入" v-model="carType"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addCard()">确定</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="更新IC卡" v-dialogDrag :visible.sync="editDialog" @close="editCancle">
                    <div class="editBody">
                        <div class="editBodyone"><label class="editInpText">车辆类型 :</label><input class="inp" placeholder="请输入" v-model="carType"/></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editCard()">确定</button>
                        <button class="editBtnC" @click="editCancle">取消</button>
                    </div>
                </el-dialog>
            </div>
        </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'icCordControl',
    data(){
        return{
            projId:'',
            token:'',
            BDMSUrl:'',
            parkingCount:1,//停车位总数
            carType:'',//车辆类型
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
            addDialog:false,//
            icCordName:"",//门禁名称
            icCordUrl:"",//门禁url
            icCordType:1,
            showErr:false,
            icCordOwner:'',
            icCordNum:'',//ic卡片编号
            icOptions:[{
                value:1,
                label:'项目卡'
            },{
                value:2,
                label:'临时卡'
            }],
            cardList:[],
            cardLists:[],
            userLists:[],
            editDialog:false,
            pageSize:10,
            pageNum:1,
            cardListLength:1,


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
        this.getCardList();
        
    },
    methods:{
        changeParkingCount(){
            axios({
                url:this.BDMSUrl+'vehicle/setParkingCount',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    parkingCount:this.parkingCount
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getParkingCount();
                }
            })
        },
        getParkingCount(){
            axios({
                url:this.BDMSUrl+'vehicle/getParkingCount',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.parkingCount=response.data.rt;
                }
            })
        },
        statusChange(val){
            if(val==1){
                return '持有中'
            }else if(val==2){
                return '已借出'
            }else if(val==3){
                return '未使用'
            }
        },
       
        //改变时间
        changeDatePicker(){

        },
        selectNameInfo(){

        },
        addMakeSure(){

        },
        addCancle(){
            this.addDialog=false;
            this.cardNo='';
        },
        editCancle(){
            this.editDialog=false;
            this.cardNo='';
        },
        bulidCarType(){
            this.addDialog=true;

        },
         handleSizeChange(val){
            this.cardLists=[];
            this.pageSize=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.cardListLength-1>=NumB&&this.cardListLength-1<=NumE){
                NumE=this.cardListLength-1;
            }
          
            for(var i=NumB;i<NumE+1;i++){
                this.cardLists.push(this.cardList[i])
            }

        },
        handleCurrentChange(val){
            this.cardLists=[];
            this.pageNum=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.cardListLength-1>=NumB&&this.cardListLength-1<=NumE){
                NumE=this.cardListLength-1;
            }
            for(var i=NumB;i<NumE+1;i++){
                this.cardLists.push(this.cardList[i])
            }
        },
        //获取卡片列表
        getCardList(){
            var vm=this;
            this.cardLists=[];
            axios({
                url:vm.BDMSUrl+'vehicle/getType',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                     projectId:this.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.cardList=response.data.rt;
                    this.cardListLength=response.data.rt.length;
                    if(this.cardListLength<11){
                        for(var i=0;i<this.cardListLength;i++){
                            this.cardLists.push(this.cardList[i])
                        }
                    }else{
                        for(var i=0;i<10;i++){
                            this.cardLists.push(this.cardList[i])
                        }
                    }
                   
                }
            })
        },
        getUserList(){
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
                }
            })
        },
        
        //添加卡片
        addCard(){
            var vm=this;
            axios({
                url:vm.BDMSUrl+'vehicle/addType',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                    projectId:this.projId,
                    name:this.carType
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.addDialog=false;
                    this.getCardList();
                    this.carType='';
                }
            })
        },
        editicCard(val){
            this.editDialog=true;
            // this.icCordNum=val.cardNo;
            // this.icCordType=val.cardType;
            // this.icCordOwner=val.owner;
            this.cardId=val.id;
            this.carType=val.name;
        },
        //更新卡片
        editCard(){
             var vm=this;
            axios({
                url:vm.BDMSUrl+'ic/updateCard',
                method:'get',
                headers:{
                    'token':this.token
                },
                params:{
                    id:vm.cardId,
                    name:vm.carType
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    this.editDialog=false;
                    this.getCardList();
                    // this.addCancle=false;
                    this.icCordNum='';
                    this.icCordType='';
                    // this.icCordOwner='';
                }
            })
        },
        deleteicCard(val){
            var vm=this;
            this.$confirm('您要删除当前所选卡？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+'vehicle/deleteType',
                    method:'GET',
                    params:{
                        id:val.id
                    },
                    headers:{
                        'token':this.token
                    }
                }).then((response)=>{
                    if(response.data.cd==0){
                        this.getCardList();
                    }else{
                        // this.$message({
                        //     type:'error',
                        //     message:response.data.msg
                        // })
                    }
                })
            })
        }

    }

}
</script>

<style lang="less" scoped>
    #wrapper{
        
        border: 1px solid #d9d9d9;
        height: 50px;
        background: rgb(250, 251, 252);
        font-size: 12px;
        margin-right: 10px;
        margin-top:51px;
        .leftTxt{
            float: left;
            line-height: 48px;
            height: 48px;
            margin-left:15px;
            font-size: 16px;
            font-weight: bold;
            .allChange{
                margin-left:15px;
            }
        }
        .allNum{
            line-height: 48px;
            height: 50px;
            font-size:22px;
            font-weight: bold;
        }
        .wrapperHead{
            float: right;
            line-height: 48px;
            height: 48px;
            margin-right:15px;
            // margin-top:8px;
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
        .contentBody{
                margin-top:20px;
                padding: 20px 0px;
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

                }
            }

           
        }
    }

</style>
