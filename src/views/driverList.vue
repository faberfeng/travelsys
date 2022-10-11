<template>
    <div class="warrper">
    <common-from :formdata="formdata" class="from" @onSubmit="onSubmit"></common-from>
    <commonTable class="table" :loading="loading" :tableData="tableData" :columnData="columnData" :defaultSort="defaultSort" :ispagination="true"></commonTable>
    </div>
</template>


<script>
import commonTable from "@/components/commonTable.vue"
import CommonFrom from '@/components/commonFromDrive.vue'
import {getDriverList} from '@/api/commonApi.js'
import {returnStation} from "@/mock/drawData.js"
import moment from 'moment'
export default {
    name:'driverList',
    components:{
        commonTable,
        CommonFrom
    },
    data(){
        return {
            columnData:[
                {
                    prop:"driverId",
                    name:"司机工号",
                    sortable:true
                },
                {
                    prop:"driverName",
                    name:"司机姓名",
                },
                {
                    prop:"group",
                    name:"所属班组",
                    width:"180"
                },
                {
                    prop:"trafficID",
                    name:"车辆编号",
                    width:"180",
                    sortable:true
                },
                // {
                //     prop:"trafficName",
                //     name:"车辆名称",
                //     width:"180",
                // },
                {
                    prop:"location",
                    name:"当前位置",
                    width:"180"
                },
                {
                    prop:"todayDistance",
                    name:"当天里程(KM)",
                    sortable:true
                },
                {
                    prop:"totalDistance",
                    name:"总计里程(KM)",
                    sortable:true
                }, 
            ],
            tableData: [],
            defaultSort:{prop: 'totalDistance', order: 'descending'},
            loading:false,
            formdata:{}
        }
    },
    created(){

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

        }
    }
}
</script>

<style lang="less" scoped>
.warrper{
    margin: 20px;
    .form{
        margin: 10px auto;
    }
    .table{
        margin: 10px auto;
    }
}
</style>