<template>
    <div id="content">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
        </div>
        <div class="contentBody" v-if="!safeNoticeShow">
            <div class="ForumSelector">
                <span class="name">筛选条件</span>
                <ul>
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
                <!-- <span class="selectItemRight" @click="exportVisiterWord" >
                        导出
                </span> -->
                <div class="wrapperHead" @click="buildVisitorRegister">
                    <span class="el-icon-plus"></span><span class="elName">访客登记</span>
                </div>
            </div>
            <div class="tableBody">
                <table class="tableList" border="1" cellspacing="0" width="100%">
                    <thead>
                       <tr>
                           <th>序号</th>
                           <th>访客登记</th>
                           <th>随行人员</th>
                           <th>单位</th>
                           <th>门禁</th>
                           <th>是否有车辆</th>
                           <th>登记时间</th>
                           <th>离开时间</th>
                           <th>安全告知</th>
                           <th>备注</th>
                           <th>编辑</th>
                       </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in getVisitorInfoLists" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{returnUserName(item.mainVisitor)}}</td>
                            <td>{{item.entourage}}</td>
                            <td>{{item.company}}</td>
                            <td>
                                <span v-show="item.isReturnCard=='0'">{{item.contactInfo}}</span>
                                <span v-show="item.isReturnCard=='1'" class="iconBtn">已归还</span>
                            </td>
                            <td>{{item.carInfo}}</td>
                            <td>{{item.addtime|timeChange()}}</td>
                            <td>{{item.leavetime|timeChange()}}</td>
                            <!-- {{item.safetyNotification}} -->
                            <td>
                                <span class="noticeBtn" v-show="item.safetyNotification=='0'" @click="lookSafeVideo(item.id)">观看</span>
                                <span class="noticeBtn" v-show="item.safetyNotification=='1'" @click="lookSafeVideoSuccess(item.safetyNotificationId)">已完成</span>
                            </td>
                            <td>{{item.remark}}</td>
                            <td>
                                <i v-if="!item.leavetime" class="el-icon-remove-outline" title="访客离开" @click="updateVisiter(item)"></i>
                                <button class="actionBtn deleteBtn" title="删除" @click="deleteVisiter(item.id)"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="getVisitorInfoList.length==0" style="height: 250px;text-align: center;font-size: 18px;line-height: 250px;border-left:1px solid #ccc;border-right:1px solid #ccc;" >
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
                        :total="getVisitorInfoListLength">
                    </el-pagination>
                </div>
            </div>
        </div>
         <safeNoticeMessage v-if="safeNoticeShow" @back="backHome()" :deliverValue="deliverValue" :visitorId='visitorId' :safetyNotificationId="selectValue" @refresh="refreshPage()"  ref="safeNoticeMessges"></safeNoticeMessage>
        <div id="edit">
                <el-dialog title="添加访客登记" v-dialogDrag :visible.sync="addDialog" @close="addCancle">
                    <div class="editBody">
                        <!-- <div class="editBodyone"><label class="editInpText">访客登记 :</label><input class="inp" placeholder="请输入" v-model="icCordNum"/></div> -->
                        <div class="editBodytwo"><label class="editInpText">接待人 :</label>
                            <select class="editSelect" v-model="mainVisitor" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="editBodytwo"><label class="editInpText">临时IC卡号 :</label><input class="inp" placeholder="请输入" v-model="icCardNo"/></div>
                         <div class="editBodytwo"><label class="editInpText">单位名称 :</label><input class="inp" placeholder="请输入单位" v-model="company"/></div>
                        <div class="editBodytwo"><label class="editInpText">随行人员 :</label><input class="inp" placeholder="姓名以'-'隔开(张三-李四)" v-model="entourage"/></div>
                        <!-- <i class="el-icon-circle-plus" style="font-size:18px;cursor:pointer" @click="addPerson"></i> -->
                        <div class="editBodytwo"><label class="editInpText">车辆信息 :</label><input class="inp" placeholder="请输入车辆号牌" v-model="carInfo"/></div>
                        <div class="editBodytwo"><label class="editInpText">联系方式 :</label><input class="inp" placeholder="请输入" v-model="contactInfo"/></div>
                        <!-- <div class="editBodytwo"><label class="editInpText">门禁方式 :</label>
                        </div> -->
                        <div class="editBodytwo"><label class="editInpText">备注 :</label><input class="inp" placeholder="请输入" v-model="remark"/></div>
                         <!-- <div class="editBodytwo">
                            <label class="editInpText">IC卡类别 :</label>
                             <select class="editSelect" v-model="icCordType" >
                                <option v-for="(item,index) in icOptions" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div> -->
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="addvisitorRecord()">确定</button>
                        <button class="editBtnC" @click="addCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="安全告知列表" width="400px" v-dialogDrag :visible.sync="safeNoticeListDialog" @close="safeVideoCancle">
                    <div class="editBody">
                        <el-select style="width:80%;" v-model="selectValue" placeholder="请选择">
                            <el-option
                            v-for="item in getSafetyNotificationList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="safeVideoMakeSure()">观看</button>
                        <button class="editBtnC" @click="safeVideoCancle">取消</button>
                    </div>
                </el-dialog>
                <el-dialog title="编辑访客登记" v-dialogDrag :visible.sync="editDialog" @close="editCancle">
                    <div class="editBody">
                        <!-- <div class="editBodyone"><label class="editInpText">访客登记 :</label><input class="inp" placeholder="请输入" v-model="icCordNum"/></div> -->
                        <div class="editBodytwo"><label class="editInpText">接待人 :</label>
                            <select class="editSelect" v-model="mainVisitor" >
                                <option v-for="(item,index) in userLists" :value="item.userId" :key="index">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="editBodytwo"><label class="editInpText">临时IC卡号 :</label><input class="inp" placeholder="请输入" v-model="icCardNo"/></div>
                         <div class="editBodytwo"><label class="editInpText">随行单位 :</label><input class="inp" placeholder="请输入单位" v-model="company"/></div>
                        <div class="editBodytwo"><label class="editInpText">随行人员 :</label><input class="inp" placeholder="请输入人数" v-model="entourage"/></div>
                        <div class="editBodytwo"><label class="editInpText">车辆信息 :</label><input class="inp" placeholder="请输入车辆号牌" v-model="carInfo"/></div>
                        <div class="editBodytwo"><label class="editInpText">联系方式 :</label><input class="inp" placeholder="请输入" v-model="contactInfo"/></div>
                        <!-- <div class="editBodytwo"><label class="editInpText">门禁方式 :</label>
                        </div> -->
                        <div class="editBodytwo"><label class="editInpText">备注 :</label><input class="inp" placeholder="请输入" v-model="remark"/></div>
                         <!-- <div class="editBodytwo">
                            <label class="editInpText">IC卡类别 :</label>
                             <select class="editSelect" v-model="icCordType" >
                                <option v-for="(item,index) in icOptions" :value="item.value" :key="index">{{item.label}}</option>
                            </select>
                            <i class="icon-sanjiao"></i>
                        </div> -->
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="editvisitorRecord()">确定</button>
                        <button class="editBtnC" @click="editCancle">取消</button>
                    </div>
                </el-dialog>
        </div>
       
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import safeNoticeMessage from './safeNoticeMessage.vue'
export default {
    name:'visitorRegister',
    components:{
        safeNoticeMessage
    },
    data(){
        return{
            routerList:"",
            moduleList:'',
            TableListLength:1,//表格长度
            currentPage:1,//当前页
            selectTime:"",//筛选时间
            selectName:"",//筛选名称
            addDialog:false,
            userLists:[],
            mainVisitor:'',//主要访客
            BDMSUrl:'',
            carInfo:"",
            contactInfo:'',//联系方式
            entourage:'',//随行人员
            icCardNo:'',//临时卡号
            company:'',//公司
            remark:'',//备注
            getVisitorInfoList:[],
            getVisitorInfoLists:[],
            getVisitorInfoListLength:1,
            editDialog:false,
            pageSize:10,
            pageNum:1,
            safeNoticeListDialog:false,
            getSafetyNotificationList:[],
            selectValue:'',
            deliverValue:"",
            safeNoticeShow:false,
            visitorId:'',
            leavetime:'',
        }
    },
    filters:{
         timeChange(val){
            if(val){
                return moment(val).format('YYYY-MM-DD HH:ss:mm');
            }
        }
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token');
        vm.projId = localStorage.getItem('projId');
        vm.userId = localStorage.getItem('userid');
        vm.projName = localStorage.getItem('projName');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.loadingTitle();
        this.getUserList();
        this.getVisitorInfo();
        this.getSafetyNotification();
        this.leavetime=new Date().getTime()

    },
    methods:{
         loadingTitle(){
          var vn=this;
          vn.routerList=vn.getSecondGradeList(vn.moduleList,'056','05601','/visitorRegister/visitorRegister','05602','/visitorRegister/carRegister');
          console.log(vn.routerList,'vn.routerList')
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
        addPerson(){

        },
        addCarRegisterMakeSure(){
            var vm=this;
            var data={
                    "carNumber": vm.carInfo,
                    "carType": 10,
                    "contactInfo":vm.contactInfo,
                    "contactUser": vm.entourage.split('-')[0],
                    "projId": vm.projId
            }
            $.ajax({
                url:this.BDMSUrl+'car/addCarInfo',
                type:'post',
                dataType:'json',
                headers:{
                    'token':this.token
                },
                data:JSON.stringify(data),
                contentType:'application/json;charset=utf-8',
                success:(response)=>{
                        this.getVisitorInfo();
                }
            })
        },
        addvisitorRecord(){
            var data={}
            var vm=this;
            // var data=moment(new Date().getTime()).format('YYYY-MM')
            data={
                "carInfo":vm.carInfo,
                "company":vm.company,
                "contactInfo":vm.contactInfo,
                "entourage":vm.entourage,
                "icCardNo":vm.icCardNo,
                "mainVisitor": vm.mainVisitor,
                "projId": vm.projId,
                "remark": vm.remark
            }
            axios({
                url:this.BDMSUrl+'visitor/addVisitorInfo',
                headers:{
                    'token':this.token
                },
                method:'post',
                data:data
            }).then((response)=>{
                if(response.data.cd==0){
                    
                    this.addCarRegisterMakeSure();
                    this.addDialog=false;
                    data={};
                    vm.carInfo='';
                    vm.company='';
                    vm.contactInfo='';
                    vm.entourage='';
                    vm.icCardNo='';
                    vm.remark='';
                }
            })
        },
        editCancle(){
            var vm=this;
            vm.editDialog=false;
            vm.carInfo='';
            vm.company='';
            vm.contactInfo='';
            vm.entourage='';
            vm.icCardNo='';
            vm.remark='';

        },
       
        //更新
        updateVisiter(item){
            this.editId=item.id;
            this.carInfo=item.carInfo;
            this.company=item.company;
            this.contactInfo=item.contactInfo;
            this.entourage=item.entourage;
            this.icCardNo=item.icCardNo;
            this.mainVisitor=item.mainVisitor;
            this.remark=item.remark;
            // this.editDialog=true;
            this.editvisitorRecord();
        },
        editvisitorRecord(){
            var data={}
            var vm=this;
            // var data=moment(new Date().getTime()).format('YYYY-MM')
            data={
                "id":vm.editId,
                "carInfo":vm.carInfo,
                "company":vm.company,
                "contactInfo":vm.contactInfo,
                "entourage":vm.entourage,
                "icCardNo":vm.icCardNo,
                "mainVisitor": vm.mainVisitor,
                "projId": vm.projId,
                "remark": vm.remark,
                'isReturnCard':1,
                'leavetime':moment(this.leavetime).format('YYYY-MM-DD HH:ss:mm')
            }
            axios({
                url:this.BDMSUrl+'visitor/addVisitorInfo',
                headers:{
                    'token':this.token
                },
                method:'post',
                data:data
            }).then((response)=>{
                if(response.data.cd==0){
                    this.getVisitorInfo();
                    // this.editDialog=false;
                    this.$message({
                        type:'info',
                        message:'访客离开成功'
                    })
                }
            })

        },
        //删除
        deleteVisiter(val){
            this.$confirm('您要删除当前所选主题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                axios({
                    url:this.BDMSUrl+"visitor/deleteVisitorInfo",
                    headers:{
                        'token':this.token
                    },
                    params:{
                        id:val
                    },
                    method:'get'
                }).then(((response)=>{
                    if(response.data.cd==0){
                        this.getVisitorInfo();
                    }
                }))
            })
            
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
        addCancle(){
            var vm=this;
            this.addDialog=false;
             vm.carInfo='';
            vm.company='';
            vm.contactInfo='';
            vm.entourage='';
            vm.icCardNo='';
            vm.remark='';
        },
        addCard(){

        },
        handleSizeChange(val){
            this.getVisitorInfoLists=[];
            this.pageSize=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getVisitorInfoListLength-1>=NumB&&this.getVisitorInfoListLength-1<=NumE){
                NumE=this.getVisitorInfoListLength-1;
            }
          
            for(var i=NumB;i<NumE+1;i++){
                this.getVisitorInfoLists.push(this.getVisitorInfoList[i])
            }

        },
        handleCurrentChange(val){
            this.getVisitorInfoLists=[];
            this.pageNum=val;
            var NumB=this.pageSize*(this.pageNum-1)
            var NumE=this.pageSize*this.pageNum-1
            if(this.getVisitorInfoListLength-1>=NumB&&this.getVisitorInfoListLength-1<=NumE){
                NumE=this.getVisitorInfoListLength-1;
            }
            for(var i=NumB;i<NumE+1;i++){
                this.getVisitorInfoLists.push(this.getVisitorInfoList[i])
            }

        },
        //改变时间
        changeDatePicker(){

        },
        selectNameInfo(){

        },
        //导出
        exportVisiterWord(){

        },
        buildVisitorRegister(){
            this.addDialog=true;

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
                    this.mainVisitor=this.userLists[0].userId;
                }
            })
        },
        returnUserName(val){
            var data='';
            this.userLists.forEach((item)=>{
                if(item.userId==val){
                    data=item.name
                }
            })
            return data
        },
        lookSafeVideo(id){
                this.safeNoticeListDialog=true;
                this.visitorId=id;
        },
        lookSafeVideoSuccess(){
            
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
                    this.selectValue=this.getSafetyNotificationList[0].id;
                }
            })
        },
        safeVideoMakeSure(){
            this.getSafetyNotificationList.forEach((item)=>{
                if(this.selectValue==item.id){
                    this.deliverValue=item;
                }
            })
            this.safeNoticeShow=true;
            this.safeNoticeListDialog=false;


        },
        safeVideoCancle(){
            this.safeNoticeListDialog=false;
        },
        backHome(){
            this.safeNoticeShow=false;
        },
        refreshPage(){
            this.getVisitorInfo()
            this.safeNoticeShow=false;
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
                                // float: right;
                                 width: 96px;
                                height: 48px;
                                line-height: 48px;
                                text-align: left;
                                padding-left: 10px;
                                font-size: 16px;
                                color:rgb(141, 141, 190);
                                cursor: pointer;
                        }
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
                                    .deleteBtn{
                                        background: url('../../assets/delete.png') no-repeat 0 0;
                                    }
                                    .el-icon-remove-outline{
                                        font-size: 20px;
                                        cursor: pointer;
                                        // color:#fff;
                                    }
                                    .editBtn{
                                        background: url('../../assets/edit.png') no-repeat 0 0;
                                    }
                                    .noticeBtn{
                                        display: inline-block;
                                        width: 50px;
                                        height: 24px;
                                        line-height: 24px;
                                        border:1px solid #58adfb;
                                        color:#58adfb;
                                        border-radius: 4px;
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
                                    .iconBtn{
                                        width: 50px;
                                        height: 20px;
                                        line-height: 18px;
                                        border-radius: 4px;
                                        border: 1px solid #58adfb;
                                        background: white;
                                        color: #58adfb;
                                        display: inline-block;
                                    }

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
            .editSelect{
                    width: 436px;
                    height: 38px;
                    color: #333333;
                    background: #fafafa;
                    border: 1px solid #d1d1d1;
                    padding:0px 0px 0px 10px;
                }
        }

}

</style>
