<template>
    <div id="commonPitchDetail">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">{{surveyName}}</span>
            </p>
            <div class="container">
                <div class="containerHead">
                    <div class="containerHeadLeft">
                        <span class="addOrder" @click="addIndexNum()">添加序列</span>
                        <span class="exportOrder">导出</span>
                    </div>
                    <div class="containerHeadMiddle"></div>
                    <div class="containerHeadRight">
                        <span class="autoImportTxt">采集方式:</span>
                        <select v-model="importMethod" class="autoImport">
                            <option v-for="(item,index) in importList" :key="index" :value="item.value" v-text="item.label"></option>
                        </select>                        
                        <i class="icon-sanjiao"></i>
                        <span v-show="importMethod==2" @click="importExcelData()" class="import">导入</span>
                        <span v-show="importMethod==1" class="import">配置</span>
                    </div>
                </div>
                <div class="containerTable">
                    <table class="containerList" border="1" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th rowspan="2">序列编号</th>
                                <th rowspan="2">关键字</th>
                                <th rowspan="2">起始标高</th>
                                <th rowspan="2">结束标高</th>
                                <th rowspan="2">点位间隔</th>
                                <th rowspan="2">点位数量</th>
                                <th colspan="3">当前最大值</th>
                                <th colspan="4">累计最大变化量</th>
                                <th rowspan="2">操作</th>
                            </tr>
                            <tr>
                                <th>位置</th>
                                <th>位移</th>
                                <th>报警</th>
                                <th>时间间隔</th>
                                <th>位置</th>
                                <th>变化</th>
                                <th>报警</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in getPitchBaseInfoList" :key="index">
                                <td v-text="$options.filters.addSprit(item.name)"></td>
                                <td v-text="$options.filters.addSprit(item.keyword)"></td>
                                <td v-text="$options.filters.addSprit(item.initDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.terminalDepth)"></td>
                                <td v-text="item.pointDistance"></td>
                                <td v-text="item.pointAmount"></td>
                                <td v-text="$options.filters.addSprit(item.maxDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.maxShift)"></td>
                                <td>{{item.maxAlert|shifouChange()}}</td>
                                <td v-text="$options.filters.addSprit(item.maxVariationInterval)"></td>
                                <td v-text="$options.filters.addSprit(item.maxVariationDepth)"></td>
                                <td v-text="$options.filters.addSprit(item.maxVariationShift)"></td>
                                <td>{{item.maxVariationAlert|shifouChange()}}</td>
                                <td>
                                    <button title="修改" class="editBtn actionBtn" @click="editPitchSeqBtn(item.id,item.itemId)"></button>
                                    <button title="删除" class="deleteBtn actionBtn" @click="deletePitchSeq(item.id,item.itemId)"></button>
                                    <button title="左侧显示" @click="leftDisplay(item.id,item.name)" class="leftLayBtn actionBtn"></button>
                                    <button title="右侧显示" @click="rightDisplay(item.id,item.name)" class="rightLayBtn actionBtn"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="containerBottom" v-show="totalShow">
                    <div class="containerBottomOne" v-show="leftShow">
                        <div class="oneHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{leftDisplayName}}详情</label>
                        </div>
                        <div class="oneTable">
                            <table class="tableList" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th>{{time|timeChange}}</th>
                                        <th>{{time1|timeChange}}</th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in leftDisplayList.recentVariation" :key="index">
                                        <td>{{leftDisplayListValue1[index].depth}}</td>
                                        <td >{{leftDisplayListValue1[index].shift}}</td>
                                        <td >{{leftDisplayListValue2[index].shift}}</td>
                                        <td>{{(leftDisplayList.recentVariation)[index].recentVariation|addSprit}}</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>{{time|timeChange}}</td>
                                        <td>{{time1|timeChange}}</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <td>3mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomTwo" v-show="leftShow">
                        <div class="twoHeader">
                            <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{leftDisplayName}}曲线</label>
                            <label class="editSpot">编辑标记</label>
                        </div>
                        <div class="twoGraph">
                            <vue-highcharts  :options="optionOnesLeft" ref="lineChartOne"></vue-highcharts>
                        </div>
                    </div>
                    <div class="containerBottomThree" v-show="rightShow">
                        <div class="threeHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{rightDisplayName}}详情</label>
                        </div>
                        <div class="threeTable">
                            <table class="tableList" border="1" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th rowspan="2">深度(m)</th>
                                        <th colspan="2">最新位移(m)</th>
                                        <th colspan="2">最近一次</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>变化量(mm)</th>
                                    </tr>
                                </thead>
                               <tbody>
                                    <tr v-for="(item,index) in rightDisplayList.recentVariation " :key="index">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">极值</td>
                                        <td>05-21 10:00</td>
                                        <td>05-21 11:00</td>
                                        <td>变化量(mm)</td>
                                    </tr>
                                    <tr>
                                        <td>5mm</td>
                                        <td>6mm</td>
                                        <td>3mm/d</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="containerBottomFour" v-show="rightShow">
                        <div class="fourHeader">
                             <label class="tableIcon"></label>
                            <label class="tableTxt">序列{{rightDisplayName}}曲线</label>
                             <label class="editSpot">编辑标记</label>
                        </div>
                        <div class="fourGraph">
                            <vue-highcharts  :options="optionOnesRight" ref="lineChartOne"></vue-highcharts>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="edit">
            <el-dialog  width="590px" :visible="addIndexNumShow" title="添加测斜序列" @close="addIndexNumCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editTxt">序列编号:</label>
                        
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点数量:</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">起始高度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束高度:</label>
                        <input placeholder="请输入数值" v-model="terminalDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点间距:</label>
                        <input placeholder="请输入数值" v-model="pointDistance" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">关键字:</label>
                        <input placeholder="请输入Excel对应表名" v-model="keyword" class="inp" style="width:140px !important;height:30px !important"/>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addPitchSeq()">确定</button>
                    <button class="editBtnC" @click="addIndexNumCancle()" >取消</button>
                </div>
            </el-dialog>
            <el-dialog  width="590px" :visible="editIndexNumShow" title="修改测斜序列" @close="editIndexNumCancle()">
                <div class="editBody">
                    <div class="editBodyone">
                        <label class="editTxt">序列编号:</label>
                        <label>{{indexName}}</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点数量:</label>
                        <label>{{spotNum}}</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">起始高度:</label>
                        <input placeholder="请输入数值" v-model="initDepth" readonly='readonly' class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">结束高度:</label>
                        <input placeholder="请输入数值" v-model="terminalDepth" class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">测点间距:</label>
                        <input placeholder="请输入数值" v-model="pointDistance" readonly='readonly' class="inp" style="width:140px !important;height:30px !important"/>
                        <label>m</label>
                    </div>
                    <div class="editBodytwo">
                        <label class="editTxt">关键字:</label>
                        <input placeholder="请输入Excel对应表名" v-model="keyword" class="inp" style="width:140px !important;height:30px !important"/>
                    </div>
                </div>
                 <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editPitchSeq()">确定</button>
                    <button class="editBtnC" @click="editIndexNumCancle()" >取消</button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import VueHighcharts from 'vue2-highcharts'
export default Vue.component('commonPitch-detail',{
        props:['surveyName','itemMonitorId','itemMonitorType','itemMonitorKeyWord'],
        components:{
            VueHighcharts
        },
        data(){
            return{
                leftShow:false,
                rightShow:false,
                totalShow:false,
                defaultSubProjId:'',
                token:'',
                projId:'',
                userId:'',
                BDMSUrl:'',
                QJFileManageSystemURL:'',
                importMethod:1,
                importList:[
                    {
                        value:1,
                        label:'自动采集'
                    },
                    {
                        value:2,
                        label:'手动导入'
                    }
                ],
                getPitchBaseInfoList:'',//获取斜度基本信息
                pitchDetailDataList:'',//获取数据详情（下面的图）
                addIndexNumShow:false,//增加序列
                editIndexNumShow:false,//修改序列
                initDepth:'',//起始标高
                terminalDepth:'',//结束标高
                pointDistance:'',//点位间隔
                keyword:'',//关键字
                indexName:'',//序列编号
                spotNum:'',//测点数量
                leftDisplayShow:'',
                rightDisplayShow:'',
                leftDisplayName:'',
                rightDisplayName:'',
                leftDisplayList:'',
                leftDisplayListValue:'',
                leftDisplayListValue1:[],
                leftDisplayListValue2:[],
                time:'',
                time1:'',
                rightDisplayList:'',
                itemseqId:'',
                seqId:'',
                show:false,
                 optionOnesLeft:{
                        chart: {
                            type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            // categories:['0.0','1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.5','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13'],
                            // tickInterval: 0.5,
                            //  tickPositions: [0, 20, 50, 100]
                            categories:[],
                        },
                        yAxis: {
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                               
                            
                                },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            
                            floating: true,
                            borderWidth: 0
                        },
                        plotOptions: {
                            spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    }
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click(e) {
                                        
                                        }
                                    }
                                }
                            },
                        },
                        series:[
                            {
                                name:'05-21',
                                data:[]
                            },
                            {
                                name:'05-21',
                                data:[]
                            }
                        ],
                },
                optionOnesRight:{
                        chart: {
                            type: 'spline',
                            inverted: true
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            // categories:['0.0','1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.5','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13'],
                            // tickInterval: 0.5,
                            //  tickPositions: [0, 20, 50, 100]
                            categories:[],
                        },
                        yAxis: {
                                title: {
                                    text: '数量'
                                },
                                labels:{
                                    enabled: true
                                },
                               
                            
                                },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            
                            floating: true,
                            borderWidth: 0
                        },
                        plotOptions: {
                            spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    }
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click(e) {
                                        
                                        }
                                    }
                                }
                            },
                        },
                        series:[
                            {
                                name:'05-21',
                                data:[]
                            },
                            {
                                name:'05-21',
                                data:[]
                            }
                        ],
                },



            }
        },
        created(){
             var vm = this;
            vm.defaultSubProjId = localStorage.getItem('defaultSubProjId')
            this.token = localStorage.getItem('token');
            this.projId = localStorage.getItem('projId');
            vm.userId  = localStorage.getItem('userid');
            vm.BDMSUrl = vm.$store.state.BDMSUrl;
            vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL;
            vm.getPitchBaseInfo();
        },
        filters:{
        shifouChange(val){
            if(val==false){
                return '否'
            }else if(val==true){
                return '是'
            }
        },
        addSprit(val){
            if(val==null){
                return '/'
            }else {
                return val
            }
        },
        timeChange(val) {
            if (val == null) {
            return '/';
            } else {
            return moment(val).format("MM-DD HH:mm");
            }
        },

        },
        watch:{

        },
        methods:{
            //返回
            back(){
                var vm = this
                vm.$emit('back')
            },
            importExcelData(){
                this.$emit('importExcelData',true,this.itemMonitorId,this.surveyName,this.itemMonitorType,this.itemMonitorKeyWord)

            },
            //添加序列号
            addIndexNum(){
                this.addIndexNumShow=true;
            },
            addIndexNumCancle(){
                this.addIndexNumShow=false;
            },
            //
            editIndexNumCancle(){
                this.editIndexNumShow=false;
            },
            //获取斜度基本信息（上面的表）
            getPitchBaseInfo(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getPitchBaseInfo',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemMonitorId
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        vm.getPitchBaseInfoList=response.data.rt;
                        console.log(vm.getPitchBaseInfoList);
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //根据序列ID获取数据详情（下面的图）
            getPitchDetailDataBySeqId(num){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/getPitchDetailDataBySeqId',
                    headers:{
                        'token':vm.token
                    },
                    params:{
                        seqId:num
                    }
                }).then((response)=>{
                    if(response.data.rt){
                        this.pitchDetailDataList=response.data.rt;
                        console.log(this.pitchDetailDataList);
                    }else if(respose.data.cd=='-1'){
                        vm.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }
                })
            },
            // 添加斜度序列
            addPitchSeq(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/addPitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemMonitorId,
                        initDepth:vm.initDepth,
                        terminalDepth:vm.terminalDepth,
                        pointDistance:vm.pointDistance,
                        keyword:vm.keyword
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.addIndexNumShow=false;
                        this.getPitchBaseInfo();
                        vm.initDepth='';
                        vm.terminalDepth='';
                        vm.pointDistance='';
                        vm.keyword='';
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //点击修改斜度序列
            editPitchSeqBtn(val,valItemId){
                var vm=this;
                vm.itemseqId=valItemId;
                vm.seqId=val;
                this.editIndexNumShow=true;
                this.getPitchBaseInfoList.forEach((item)=>{
                    if(item.id==val){
                        vm.indexName=item.name;
                        vm.spotNum=item.pointAmount;
                        vm.initDepth=item.initDepth;
                        vm.terminalDepth=item.terminalDepth;
                        vm.pointDistance=item.pointDistance;
                        vm.keyword=item.keyword;
                    }
                })
            },
            //修改斜度序列
            editPitchSeq(){
                var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/editPitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:vm.itemseqId,
                        seqId:vm.seqId,
                        initDepth:vm.initDepth,
                        terminalDepth:vm.terminalDepth,
                        pointDistance:vm.pointDistance,
                        keyword:vm.keyword
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.addIndexNumShow=false;
                        this.getPitchBaseInfo();
                        vm.initDepth='';
                        vm.terminalDepth='';
                        vm.pointDistance='';
                        vm.keyword='';
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //删除斜度序列
            deletePitchSeq(id,itemId){
                 var vm=this;
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'detectionInfo/deletePitchSeq',
                    headers:{
                        'token':vm.token,
                    },
                    params:{
                        itemId:itemId,
                        seqId:id
                    }
                }).then((response)=>{
                    if(response.data.cd=='0'){
                        this.getPitchBaseInfo();
                        vm.$message({
                            type:'info',
                            message:'序列删除成功'
                        })
                    }else if(response.data.cd=='-1'){
                        vm.$message({
                            type:"error",
                            message:response.data.msg
                        })
                    }
                })
            },
            //左侧显示
            leftDisplay(id,name){
                this.leftDisplayListValue1=[];
                this.leftDisplayListValue2=[];
                this.totalShow=true;
                this.leftShow=true;
                this.getPitchDetailDataBySeqId(id)
                if(this.pitchDetailDataList){
                    this.leftDisplayList=this.pitchDetailDataList;
                    this.leftDisplayListValue=this.leftDisplayList.recent2PitchData;
                    this.time=(this.leftDisplayList.recent2PitchData)[0].acquisitionTime;
                    this.time1=(this.leftDisplayList.recent2PitchData)[1].acquisitionTime;
                    this.leftDisplayListValue.forEach((item,index,array)=>{
                        // console.log(array[index].acquisitionTime,'array');
                        if(array[index].acquisitionTime==this.time){
                            this.leftDisplayListValue1.push(array[index])
                            // this.show=true;
                            // console.log('报错')
                        }else if(array[index].acquisitionTime==this.time1){
                            this.leftDisplayListValue2.push(array[index])
                        }
                    })
                    // if(this.show==true){
                    //     for(let i=0;i<(length/2);i++){
                    //         this.leftDisplayListValue1.push(this.leftDisplayListValue[i])
                    //     }
                    //     for(let a=(length/2);a<length;a++){
                    //         this.leftDisplayListValue2.push(this.leftDisplayListValue[a])
                    //     }
                    // }
                    this.leftDisplayName=name;
                    console.log(this.leftDisplayListValue1,'数据1')
                    console.log(this.leftDisplayListValue2,'数据2')
                    console.log(this.leftDisplayList,'左边数据')
                }
            },
            //右侧显示
            rightDisplay(id,name){
                this.totalShow=true;
                this.rightShow=true;
                this.getPitchDetailDataBySeqId(id)
                this.rightDisplayList=this.pitchDetailDataList;
                this.rightDisplayName=name;
                console.log(this.rightDisplayList,'右边数据')
            }
        }
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
select.autoImport{
        /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/  
            /*很关键：将默认的select选择框样式清除*/  
            appearance:none;  
            -moz-appearance:none;  
            -webkit-appearance:none;  
            /*在选择框的最右侧中间显示小箭头图片*/  
            /*为下拉小箭头留出一点位置，避免被文字覆盖*/  
            padding-right: 14px;  

    }
#commonPitchDetail{
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
                
        }
        .container{
            width: 98%;
            margin:0 auto;
            .containerHead{
                margin-top:28px;
                width: 98%;
                height: 34px;
                
                .containerHeadLeft{
                    float: left;
                    .addOrder{
                        display: inline-block;
                        width: 100px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
                        cursor: pointer;

                    }
                    .exportOrder{
                        display: inline-block;
                        width: 50px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #f2f2f2;
                        font-size: 12px;
                        line-height: 26px;
                        vertical-align: middle;
                        color:#666666;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
                .containerHeadMiddle{

                }
                .containerHeadRight{
                    float: right;
                    position:relative;
                    .autoImportTxt{
                        color:#999999;
                        font-size: 12px;
                        width: 60px;
                        height: 26px;
                        line-height: 26px;
                    }
                    .autoImport{
                        width: 121px;
                        height: 26px;
                        border: 1px solid #cccccc;
                        position: relative;
                        background: #fff;
                        padding-left: 10px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        margin-right: 0px;
                        color: #333333;
                        font-size: 14px;
                        border-radius: 2px;
                        outline: none;
                    }
                    .icon-sanjiao{
                        display: block;
                        position: absolute;
                        width: 12px;
                        height: 7px;
                        background-image: url('../Settings/images/sanjiao.png');
                        background-size: 100% 100%;
                        content: '';
                        top: 11px;
                        right: 65px;
                    }
                    .import{
                        display: inline-block;
                        width:54px;
                        height: 26px;
                        border:1px solid #f2f2f2;
                        background: #fc3439;
                        font-size: 12px;
                        line-height: 26px;
                        // vertical-align: middle;
                        color:#f2f2f2;
                        border-radius: 3px;
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
                                }
                    }
                    tbody{
                            tr{
                                td{
                                    padding-left: 6px;
                                    padding-right: 15px;
                                    height: 30px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    border-right: 1px solid #e6e6e6;
                                    font-size: 12px;
                                    color: #333333;
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
                                    .leftLayBtn{
                                        background: url('./images/leftLay.png') no-repeat 0 0;
                                    }
                                    .rightLayBtn{
                                        background: url('./images/rightLay.png') no-repeat 0 0;
                                    }
                                }
                            }
                    }

                }
            }
            .containerBottom{
                margin-top:32px;
                width: 100%;
                height: 550px;
                // border:1px solid #ccc;
                position: relative;
                .containerBottomOne{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:0;
                //    border-right:1px solid #ccc;
                    .oneHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        
                    }
                    .oneTable{
                        width:96%;
                        margin-top:18px;
                        .tableList{
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
                                }
                            }
                            tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                    }
                                }
                            }

                        }

                    }

                }
                .containerBottomTwo{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:25%;
                //    border-right:1px solid #ccc;
                    .twoHeader{
                         height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        .editSpot{
                            display: inline-block;
                            float: right;
                            font-size:12px;
                            color:#336699;
                            line-height: 30px;
                            cursor: pointer;
                        }
                    }
                    .twoGraph{
                        // height: 700px;
                        width: 96%;
                        margin:0 auto;
                        margin-top:20px;
                        // transform: rotate(90deg);
                        border:1px solid #ccc;
                        padding: 48px 15px 25px 15px;
                        // width: 100%;
                        

                    }
                }
                .containerBottomThree{
                    position: absolute;
                    width: 25%;
                    height: 550px;
                    left:50%;
                //    border-right:1px solid #ccc;
                    .threeHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/tabel.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                    }
                    .threeTable{
                         width:96%;
                        margin-top:18px;
                        .tableList{
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
                                }
                            }
                            tbody{
                                tr{
                                    td{
                                        padding-left: 6px;
                                        padding-right: 15px;
                                        height: 30px;
                                        text-align: center;
                                        box-sizing: border-box;
                                        border-right: 1px solid #e6e6e6;
                                        font-size: 12px;
                                        color: #333333;
                                    }
                                }
                            }

                        }
                    }
                }
                .containerBottomFour{
                     position: absolute;
                    width: 25%;
                    height: 650px;
                    left:75%;
                //    border-right:1px solid #ccc;
                    .fourHeader{
                        height:30px;
                        width:96%;
                        margin:0 auto;
                        border-bottom: 1px solid #ccc;
                        .tableIcon{
                            background: url('./images/graph.png') no-repeat;
                            width: 18px;
                            height: 18px;
                            display: block;
                            float: left;
                            margin-top: 9px;
                            margin-left: 4px;
                            margin-right: 7px;
                        }
                        .tableTxt{
                            color: #fc3439;
                            font-size: 16px;
                            float: left;
                            font-weight: bold;
                            line-height: 30px;
                        }
                        .editSpot{
                            display: inline-block;
                            float: right;
                            font-size:12px;
                            color:#336699;
                            line-height: 30px;
                            cursor: pointer;
                        }
                    }
                    .fourGraph{
                            width: 96%;
                            margin: 0 auto;
                            margin-top: 20px;
                            border: 1px solid #ccc;
                            padding: 48px 15px 25px 15px;
                    }
                }



            }
            


        }
    }
    #edit{
        .editTxt{
            color: #666;
            font-size: 14px;
            line-height: 14px;
            font-weight: normal;
            display: inline-block;
            margin-right: 20px;
            width: 30%;
            text-align: right;
            display: inline-block;
            margin-left: 40px;
        }
        .editBodyone,.editBodytwo{
                text-align: left;
            }
        .editInput{

        }
    }
}

</style>

