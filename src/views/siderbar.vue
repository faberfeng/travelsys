<template>
  <div class="siberbar" ref="siderbarRef" style="">
    <commonTable class="table" :loading="loading" :tableData="tableData" :columnData="columnData" :defaultSort="defaultSort"></commonTable>
    <div class="barswitch">
        <div v-show="!showbar" class="content" @click="switchbar">
            隐<br/>藏<br/>左<br/>边<br/>栏<br/>
            <i class="el-icon-d-arrow-left"></i>
        </div>
         <div v-show="showbar" class="content" @click="switchbar">
            显<br/>示<br/>左<br/>边<br/>栏<br/>
            <i class="el-icon-d-arrow-right"></i>
        </div>
    </div>
  </div>
</template>

<script>
import commonTable from "@/components/commonTable.vue"
import {getDriverList} from '@/api/commonApi.js'
import {returnStation} from "@/mock/drawData.js"
import moment from 'moment'
export default {
    components:{
        commonTable
    },
    data(){
        return{
            showbar:true,
            columnData:[
                {
                    prop:"driverId",
                    name:"工号",
                    sortable:true
                },
                {
                    prop:"driverName",
                    name:"姓名",
                },
                {
                    prop:"trafficID",
                    name:"车辆号",
                    width:"180",
                    sortable:true
                },
                {
                    prop:"location",
                    name:"位置",
                    width:"180"
                },
            ],
            tableData: [],
            defaultSort:{prop: 'totalDistance', order: 'descending'},
            loading:false,
            formdata:{}
        }
    },
    mounted(){
        var driverName=this.$route.query.name;
        var time=this.$route.query.time;
        this.formdata={
            driverName:driverName,
            time:time
        }
        this.getDriverLists(null,driverName,null,null,time);
    },
    methods:{
        onSubmit(data){
             this.$router.push({
                path:'/driverList'
            })
            this.getDriverLists(parseInt(data.trafficName),data.driverName,data.group,data.stationName,data.time)
        },
        getDriverLists(trafficName,driverName,group,stationName,time){
            let data={
                Time:time?moment(time).format('YYYY-MM-DD HH:mm:ss'):moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                trafficID:trafficName?[trafficName]:[], 
                driverName:driverName?[driverName]:[], //司机名称
                groupName:group?[group]:[],  //乘务组名称
                stationName:stationName?[stationName]:[]
            }
            this.loading=true;
            getDriverList(data).then((res)=>{
                var resdata=res.data.data
                resdata.forEach((item)=>{
                    item.location=(item.currentLocation.end!=""||item.currentLocation.start!="")?(item.currentLocation.end==item.currentLocation.start)?returnStation(item.currentLocation.start)[0].name:`${returnStation(item.currentLocation.start)[0].name}-${returnStation(item.currentLocation.end)[0].name}`:'/'
                    // item.group='/'
                })
                this.tableData=resdata;
                this.loading=false;
            })

        },
        switchbar(){
            this.showbar=!this.showbar;
            if(this.showbar){
                this.$refs.siderbarRef.style.left="-420px"
            }else{
                 this.$refs.siderbarRef.style.left="0px"
            }
        }
    }

}
</script>

<style lang="less" scoped>
.siberbar{
    width: 400px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    // overflow-y: auto;
    // overflow-x: hidden;
    flex-shrink: 0;
    z-index: 10;
    // @include background_color("scbg");
    background-color: rgba(8, 30, 57, 1);
    display: inline-block;
    text-align: left;
    position: absolute;
    left: -420px;
    top: 0px;
    z-index: 10000;
    padding: 30px 10px;
    // animation:3ms;
    transition: all 500ms;
    .barswitch{
        z-index: 10001;
        position:absolute;
        right: -20px;
        top:0px;
        text-align: center;
        // display: flex;
        // justify-content: center;
        
        .content{
            width: 25px;
            height: 112px;
            line-height: 18px;
            background: #1F6AFF;
            color: white;
            cursor: pointer;
        }

    }
}
</style>