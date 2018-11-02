<template>
    <div id="walkThrough">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">现场巡视记录</span>
                <span class="leftTime">最新数据：{{nowDate}}</span>
            </p>
            <div class="container">
                <div class="containerHead">
                    <div class="containerHeadLeft">最近巡视者：{{userName}}</div>
                    <div class="containerHeadRight">
                        <span class="addCheckcontent" @click="addCheckContentBtn()">
                            添加巡视内容
                        </span>
                        <span v-show="!isEditShow" class="writeNewContent" @click="writeNewRecord()">
                            录入新记录
                        </span>
                        <span v-show="isEditShow" class="writeNewContent" @click="saveNewRecord()">
                            保存记录
                        </span>
                    </div>
                </div>
                <div class="containerTable">
                    <table class="containerList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">分类</th>
                                <th rowspan="2">巡视监测内容</th>
                                <th colspan="2"><label class="left">上一次</label><label class="middle">历史巡视</label><label class="right">下一次</label></th>
                                <th colspan="2">最近巡视(今天)</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>结果</th>
                                <th>备注</th>
                                <th>结果</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td rowspan="4"></td>
                            </tr> -->
                            <tr v-for="(item,index) in getPatrolRecordLists" :key="index">
                                <td :rowspan="item.patrolTypeNamespan" :class="{'hidden': item.patrolTypeNamedis}">{{item.patrolTypeName}}</td>
                                <td :rowspan="item.patrolNamespan" :class="{'hidden': item.patrolNamedis}" v-text="item.patrolName"></td>
                                <!-- <td :rowspan="item.historyResultspan" :class="{'hidden': item.historyResultdis}" v-text="item.historyResult"></td>
                                <td :rowspan="item.historyRemarkspan" :class="{'hidden': item.historyRemarkdis}" v-text="item.historyRemark"></td>
                                <td :rowspan="item.recentResultspan" :class="{'hidden': item.recentResultdis}" v-text="item.recentResult"></td>
                                <td :rowspan="item.recentRemarkspan" :class="{'hidden': item.recentRemarkdis}" v-text="item.recentRemark"></td> -->
                                <td v-show="saveShow" v-text="item.historyResult"></td>
                                <td v-show="saveShow" v-text="item.historyRemark"></td>
                                <!-- <td v-show="saveShow"  v-text="item.recentResult"></td>
                                <td v-show="saveShow" v-text="item.recentRemark"></td> -->
                                <td width="180px" ><input v-show="isEditShow" :id="'inputResult'+item.id" placeholder="请输入结果" class="tdInp"/></td>
                                <td width="180px"><input v-show="isEditShow" :id="'inputRemark'+item.id" placeholder="请录入备注" class="tdInp"/></td>
                                <!-- <td v-show="isEditShow">{{item.todayResult}}</td>
                                <td v-show="isEditShow">{{item.todayRemark}}</td> -->
                                <td>
                                    <button title="修改" @click="renamePatrolBtn(item.id,item.patrolTypeId,item.patrolName)" class="editBtn actionBtn"></button>
                                    <button title="删除" class="deleteBtn actionBtn" @click="deletePatrol(item.id)"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="containerBottom">
                    <div class="containerBottomLeft">
                        <div class="containerBottomLeftHead">
                            <label class="LeftBtn"></label>
                            <label class="LeftBtnTxt">历史巡视总结:</label><label class="LeftBtnTxtTime">{{historySummaryListTime}}</label>
                            <label class="leftBtnLast" @click="nextSummary(historySummaryListId)">下一次</label>
                            <label class="leftBtnNext" @click="lastSummary(historySummaryListId)">上一次</label>
                        </div>
                        <div class="HeadBody">
                            <textarea class="textareaBody" readonly="readonly" v-model="historySummaryList"></textarea>
                        </div>
                    </div>
                    <div class="containerBottomRight">
                        <div class="containerBottomRightHead">
                            <label class="LeftBtn"></label>
                            <label class="LeftBtnTxt">最近巡视总结:</label><label class="LeftBtnTxtTime">{{newSummaryListTime}}</label>
                            <label class="leftBtnNext" @click="writeNewSummary()">录入新巡视</label>
                        </div>
                        <div class="HeadBody">
                            <textarea class="textareaBody" :readonly="!excessWordSizeShow" @input="descInput()" v-model="newSummaryList">
                            </textarea>
                            <label class="submitBtn" v-show="addSummaryShow" @click="saveSummary()">保存</label>
                            <label v-show="addSummaryShow" class="wordLength">{{txtVal}}/200</label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div id="edit">
            <el-dialog :visible="addCheckContentShow" title="添加巡视内容" @close="addCheckContentCancle">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText">巡视分类：</label>
                        <select v-model="typeId" class="eidtInput" >
                            <option v-for="(item,index) in getPatrolTypesList" :key="index" :value="item.id" v-text="item.patrolTypeName"></option>
                        </select>
                    </div>
                     <div class="editBodytwo">
                        <label class="editInpText">巡视内容：</label>
                        <input placeholder="请输入文本" v-model="patrolName"  class="inp" style="width:368px !important;height:30px !important"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPatrol()">确定</button>
                    <button class="editBtnC" @click="addCheckContentCancle()">取消</button>
                </div>
            </el-dialog>
            <el-dialog :visible="renameCheckContentShow" title="巡视内容更名" @close="renameCheckContentCancle">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editInpText">原名：</label>
                        <label>{{lastPatrolName}}</label>
                    </div>
                     <div class="editBodytwo">
                        <label class="editInpText">新名：</label>
                        <input placeholder="请输入文本" v-model="newPatrolName"  class="inp" style="width:368px !important;height:30px !important"/>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="renamePatrol()">确定</button>
                    <button class="editBtnC" @click="renameCheckContentCancle()">取消</button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import moment from 'moment'
export default Vue.component('walkThrough',{
    props:['userSelectId'],
    name:'walkThrough',
    data(){
        return{
            nowDate:'',//当前时间
            userName:'',
            // userSelectId:'',
            typeId:'',//巡视类型ID
            patrolId:'',//巡视内容ID
            patrolName:'',//巡视内容名称
            addCheckContentShow:false,//添加巡视记录弹窗
            renameCheckContentShow:false,//重命名巡视记录
            getPatrolTypesList:'',//监测内容类型
            getPatrolRecordList:'',//获取巡视记录
            getPatrolRecordLists:'',
            patrolreName:'',
            newPatrolName:'',//新名
            lastPatrolName:'',//原名
            isEditShow:false,//是否可以编辑
            editPatrolList:[],
            getAllPatrolSummaryList:'',//获取所有巡视总结
            summaryListLength:'',//巡视总结长度
            newSummaryList:'',//新增巡视内容
            newSummaryListTime:'',//时间
            historySummaryList:'',//历史巡视内容
            historySummaryListTime:'',//历史时间
            historySummaryListId:'',
            addSummaryShow:false,//是否显示保存按钮
            excessWordSizeShow:false,//是否超过字数
            txtVal:0,//文本框的字数
            saveShow:true,
            checkList:[]
        }

    },
    watch:{
        // userSelectId:function(val){
        //     var vm=this;
        //     vm.initPatrolPresupposition();
        //     vm.getPatrolRecord();
        // }
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
        vm.curTime();
        vm.initPatrolPresupposition();
        vm.getPatrolRecord();
        vm.getAllPatrolSummary();
    },
    filters:{

    },
    methods:{
        back(){
            var vm = this
            vm.$emit('back')
        },
        curTime(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
             this.nowDate = year + "-" + month + "-" + day;
        },
        //动态数据相同类型表格合并
         combineCell(list) {
            for (var field in list[0]) {
                var k = 0;
                while (k < list.length) {
                    list[k][field + 'span'] = 1;
                    list[k][field + 'dis'] = false;
                    for (var i = k + 1; i <= list.length - 1; i++) {
                        if (list[k][field] == list[i][field] && list[k][field] != '') {
                            list[k][field + 'span']++;
                            list[k][field + 'dis'] = false;
                            list[i][field + 'span'] = 1;
                            list[i][field + 'dis'] = true;
                        } else {
                            break;
                        }
                    }
                    k = i;
                }
            }
            return list;
        },
        // 初始化巡视类型和内容预设信息
        initPatrolPresupposition(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/initPatrolPresupposition',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){

                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取巡视类型
        getPatrolTypes(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getPatrolTypes',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    vm.getPatrolTypesList=response.data.rt;
                    vm.typeId=vm.getPatrolTypesList[0].id;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //
        addCheckContentCancle(){
            var vm=this;
            vm.addCheckContentShow=false;
            this.typeId='';
            this.patrolName='';
        },
        addCheckContentBtn(){
            var vm=this;
            vm.getPatrolTypes();
            vm.addCheckContentShow=true;
        },
        writeNewRecord(){
            var vm=this;
            vm.isEditShow=true;
        },
        saveNewRecord(){
            var vm=this;
            this.getPatrolRecordLists.forEach((item)=>{
                this.checkList.push(
                    {
                        "id":item.id,
                        "remark":document.getElementById('inputRemark'+item.id).value,
                        "result":document.getElementById('inputResult'+item.id).value
                    }
                )
            })
            console.log(this.checkList,'this.checkList')
             axios({
                method:'post',
                url:this.BDMSUrl+'detectionInfo/editPatrolRecord',
                headers:{
                    'token':vm.token
                },
                data:vm.checkList
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPatrolRecord();
                    vm.isEditShow=false;
                    this.$message({
                        type:'info',
                        message:'编辑巡视记录内容成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //编辑巡视记录内容
        editPatrolRecord(){
            var vm=this;
           
        },
        //添加巡视内容
        addPatrol(){
             var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/addPatrol',
                headers:{
                    'token':vm.token
                },
                params:{
                    typeId:this.typeId,
                    userGroupId:this.userSelectId,
                    patrolName:this.patrolName,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.addCheckContentShow=false;
                    this.typeId='';
                    this.patrolName='';
                    this.getPatrolRecord();
                    this.$message({
                        type:'info',
                        message:'添加巡视内容成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        // 删除巡视内容
        deletePatrol(val){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/deletePatrol',
                headers:{
                    'token':vm.token
                },
                params:{
                    patrolId:val
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPatrolRecord()
                    this.$message({
                        type:'info',
                        message:'删除成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //添加巡视类型
        addPatrolType(){

        },
        //获取巡视记录
        getPatrolRecord(){
             var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getPatrolRecord',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPatrolRecordList=response.data.rt;
                    
                    var map = new Map();
                    for (var i = 0; i < this.getPatrolRecordList.length;i++){
                        var patrolTypeId = this.getPatrolRecordList[i].patrolTypeId;
                        if (!map.has(patrolTypeId)) {
                            var array = new Array();
                            array.push(this.getPatrolRecordList[i]);
                            map.set(patrolTypeId, array);
                        }
                        else {
                            var array = map.get(patrolTypeId);
                            array.push(this.getPatrolRecordList[i]);
                            map.set(patrolTypeId, array);
                        }
                    }
                    var list=[];
                    map.forEach(function (value, key, mapObject) {
                        // console.log(key);
                        for(var i=0;i<value.length;i++){
                            list.push(value[i])
                        } 
                        console.log(value);
                    }); 
                    console.log(list,'list')               
                    this.getPatrolRecordList=this.combineCell(list);
                    this.getPatrolRecordLists=this.getPatrolRecordList;
                    console.log(this.getPatrolRecordLists);
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取上一次历史记录
        getPreviousHistoryRecord(){
             var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getPreviousHistoryRecord',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId,
                    currentHistoryDate:'',
                    patrolId:'',
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    // this.getPatrolRecordList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //编辑巡视内容弹框
        renamePatrolBtn(id,patrolTypeId,name){
            console.log(id,'巡视内容ID')
            console.log(patrolTypeId,'巡视类型ID')
            console.log(name,'内容')
            var vm=this;
            vm.renameCheckContentShow=true;
            vm.typeId=patrolTypeId;
            vm.patrolId=id;
            vm.lastPatrolName=name
        },
        //取消编辑巡视内容
        renameCheckContentCancle(){
            var vm=this;
            vm.renameCheckContentShow=false;
            vm.patrolId='';
            vm.newPatrolName='';
            vm.typeId='';
        },
        //重命名巡视内容
        renamePatrol(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/renamePatrol',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId,
                    patrolId:vm.patrolId,
                    patrolName:vm.newPatrolName,
                    typeId:vm.typeId,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getPatrolRecord();
                    vm.renameCheckContentShow=false;
                    vm.patrolId='';
                    vm.newPatrolName='';
                    vm.typeId='';
                    this.$message({
                        type:'info',
                        message:'名称修改成功'
                    })
                    // this.getPatrolRecordList=response.data.rt;
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //获取所有巡视总结
        getAllPatrolSummary(){
            var vm=this;
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/getAllPatrolSummary',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId,
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.getAllPatrolSummaryList=response.data.rt;
                    this.summaryListLength=this.getAllPatrolSummaryList.length;
                    this.newSummaryList=this.getAllPatrolSummaryList[this.summaryListLength-1].summary;
                    this.newSummaryListTime=this.initData(this.getAllPatrolSummaryList[this.summaryListLength-1].insertTime);
                    this.newSummaryListId=this.getAllPatrolSummaryList[this.summaryListLength-1].id;
                    if(this.summaryListLength>1){
                        this.historySummaryList=this.getAllPatrolSummaryList[this.summaryListLength-2].summary;
                        this.historySummaryListTime=this.initData(this.getAllPatrolSummaryList[this.summaryListLength-2].insertTime);
                        this.historySummaryListId=this.getAllPatrolSummaryList[this.summaryListLength-2].id;
                    }
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        //时间变化
        initData(val){
            if (val == null) {
                return;
                } else {
                return moment(val).format("YY-MM-DD");
                }
        },
        //上一次历史巡视总结记录
        lastSummary(val){
            this.getAllPatrolSummaryList.forEach((item,index)=>{
                if(item.id==val){
                    if((index-1)<0){
                         this.$message({
                            type:'error',
                            message:'没有更多的历史巡视记录'
                        })
                        return;
                    }else{
                        this.historySummaryList=this.getAllPatrolSummaryList[index-1].summary;
                        this.historySummaryListId=this.getAllPatrolSummaryList[index-1].id;
                    }
                }
            })
        },
        //下一次历史巡视总结记录
        nextSummary(val){
            this.getAllPatrolSummaryList.forEach((item,index)=>{
                if(item.id==val){
                    
                    if((index+1)>(this.getAllPatrolSummaryList.length-1)){
                        this.$message({
                            type:'error',
                            message:'没有更多的历史巡视记录'
                        })
                        return;
                    }else{
                        this.historySummaryList=this.getAllPatrolSummaryList[index+1].summary;
                        this.historySummaryListId=this.getAllPatrolSummaryList[index+1].id;
                    }
                    console.log(index);
                }
            })
        },
        //上一次历史巡视总结记录

        //增加巡视总结记录
        writeNewSummary(){
            this.addSummaryShow=true;
            this.excessWordSizeShow=true;
            this.newSummaryList='';
            this.newSummaryListTime=this.nowDate;
            this.historySummaryList=this.getAllPatrolSummaryList[this.summaryListLength-1].summary;
            this.historySummaryListTime=this.initData(this.getAllPatrolSummaryList[this.summaryListLength-1].insertTime);
            this.historySummaryListId=this.getAllPatrolSummaryList[this.summaryListLength-1].id;
        },
        //保存巡视总结记录
        saveSummary(){
            var vm=this;
            
            axios({
                method:'get',
                url:this.BDMSUrl+'detectionInfo/addPatroSummary',
                headers:{
                    'token':vm.token
                },
                params:{
                    userGroupId:this.userSelectId,
                    summaryInfo:this.newSummaryList
                }
            }).then((response)=>{
                if(response.data.cd=='0'){
                    this.addSummaryShow=false;
                    this.excessWordSizeShow=false;
                    this.getAllPatrolSummary();
                    this.$message({
                        type:'success',
                        message:'录入巡视总结成功'
                    })
                }else if(response.data.cd=='-1'){
                    this.$message({
                        type:'error',
                        message:response.data.msg
                    })
                }
            })
        },
        descInput(){
            this.txtVal = this.newSummaryList.length;
            if(this.txtVal>200){
                this.txtVal=200;
                this.newSummaryList=this.subWord(this.newSummaryList);
                // this.excessWordSizeShow=false;
                this.$message({
                    type:'info',
                    message:'巡视情况总结字数不可以超过200'
                })
            }
        },
        subWord(val){
            if(val.length>200){
                return val.substr(0,200)
            }else{
                return val
            }
        }
    },

}
)
</script>
<style lang="less">
*{
    margin:0;
    padding: 0;
    box-sizing: border-box;
}
i{
    font-style:normal
}
li{list-style: none}
select.eidtInput{
        /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  

    }
#walkThrough{
    margin: 0 20px 20px!important;
    .project{
        width: 100%;
        max-height: 800px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }
                .strong{
                    cursor: pointer;
                    color: #333333;
                    font-weight: bold;
                    &:last-of-type .icon-sanjiao-right{
                        display: none;
                    }
                }
                .leftTime{
                    display:inline-block;
                    float: right;
                    font-size: 12px;
                    color:#666666;

                }    
        }
        .container{
            width: 98%;
            margin:0 auto;
            .containerHead{
                margin-top:25px;
                height: 32px;
                .containerHeadLeft{
                    color: #666666;
                    font-size: 14px;
                    float: left;
                    line-height: 32px;
                }
                .containerHeadRight{
                    float:right;
                    .addCheckcontent{
                        display: inline-block;
                        width: 114px;
                        height: 28px;
                        border: 1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color: #666666;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    .writeNewContent{
                        display: inline-block;
                        width: 98px;
                        height: 28px;
                        border: 1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 28px;
                        vertical-align: middle;
                        color: #666666;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                }
            }
            .containerTable{
                    margin-top:10px;
                .containerList{
                    border-collapse: collapse;
                    border: 1px solid #e6e6e6;
                    thead{
                                background: #f2f2f2;
                                th{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    font-weight: normal;
                                    .left{
                                       cursor: pointer;
                                        display: inline-block;
                                        float: left;
                                        &:hover{
                                            color:#336699;
                                        }
                                    }
                                    .right{
                                        cursor: pointer;
                                        display: inline-block;
                                        float:right;
                                         &:hover{
                                            color:#336699;
                                        }
                                    }
                                }
                    }
                    tbody{
                            tr{
                                td{
                                    // padding-left: 6px;
                                    // padding-right: 15px;
                                    height: 30px;
                                    text-align: left;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
                                    .tdInp{
                                        width: 178px;
                                        height: 28px;
                                    }
                                    .actionBtn{
                                            width: 18px;
                                            height: 18px;
                                            border: none;
                                            cursor: pointer;
                                            margin-left: 10px;

                                    }
                                    .editBtn{
                                        background: url('./images/overviewedit.png') no-repeat 0 0;
                                    }
                                    .deleteBtn{
                                        background: url('./images/delete1.png') no-repeat 0 0;
                                    }
                                }
                                .hidden{
                                    display: none;
                                }
                            }
                    }
                }
            }
            .containerBottom{
                width: 100%;
                margin-top:34px;
                height: 100px;
                .containerBottomLeft{
                    width: 49%;
                    float: left;
                     height: 100px;
                    //   border:1px solid #ccc;
                    .containerBottomLeftHead{
                        height: 32px;
                        border-bottom:1px solid #ccc;
                        .LeftBtn{
                            background: url('./images/time1.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .LeftBtnTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 32px;
                        }
                        .LeftBtnTxtTime{
                            color:#666666;
                            font-size: 14px;
                            line-height: 32px;
                            float:left;
                        }
                        .leftBtnLast{
                            display: inline-block;
                            width: 68px;
                            height: 25px;
                            border: 1px solid #f2f2f2;
                            background: #e6e6e6;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            float: right;
                            margin-top:4px;
                           
                        }
                        .leftBtnNext{
                            display: inline-block;
                            width: 68px;
                            height: 25px;
                            border: 1px solid #f2f2f2;
                            background: #e6e6e6;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            float: right;
                             margin-right: 5px;
                             margin-top:4px;
                        }

                    }
                    .HeadBody{
                        margin-top:15px;
                        .textareaBody{
                            width: 100%;
                            height: 198px;
                            color:#333333;
                            font-size: 14px;
                            padding:10px;
                        }
                    }
                }
                .containerBottomRight{
                    width: 49%;
                    float:right;
                     height: 100px;
                    //  border:1px solid #ccc;
                     .containerBottomRightHead{
                        height: 32px;
                        border-bottom:1px solid #ccc;
                        .LeftBtn{
                            background: url('./images/time2.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .LeftBtnTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 32px;
                        }
                        .LeftBtnTxtTime{
                            color:#666666;
                            font-size: 14px;
                            line-height: 32px;
                            float: left;
                        }
                        .leftBtnNext{
                            display: inline-block;
                            width: 100px;
                            height: 25px;
                            border: 1px solid #f2f2f2;
                            background: #e6e6e6;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #666666;
                            border-radius: 2px;
                            cursor: pointer;
                            float: right;
                             margin-top:4px;
                        }
                     }
                     .HeadBody{
                        margin-top:15px;
                         position: relative;
                        .textareaBody{
                            width: 100%;
                            height: 198px;
                            color:#333333;
                            font-size: 14px;
                            padding:10px;
                        }
                        .submitBtn{
                            display: inline-block;
                            width: 70px;
                            height: 25px;
                            border: 1px solid #f2f2f2;
                            background: #fc3439;
                            font-size: 12px;
                            line-height: 25px;
                            vertical-align: middle;
                            color: #ffffff;
                            border-radius: 4px;
                            cursor: pointer;
                            position: absolute;
                            left:5px;
                            bottom: 10px;
                        }
                        .wordLength{
                            display: inline-block;
                            position: absolute;
                            right:5px;
                            bottom: 10px;
                        }
                    }
                }
            }

        }
    }
    #edit{
        .eidtInput{
            width: 368px;
            border-radius: 2px;
            height: 30px;
            border: 1px solid #cccccc;
            position: relative;
            background: #fafafa;
            padding-left: 10px;
            padding-right: 20px;
            box-sizing: border-box;
            margin-right: 15px;
            color: #333333;
            font-size: 14px;
            outline: none;
        }
        .editBodyone,.editBodytwo{
            text-align: left;
        }
        .editInpText{
                display: inline-block;
                margin-left: 40px;
        }
       
    }
}

</style>

