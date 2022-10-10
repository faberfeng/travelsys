<template>
    <div class="warrper">
        <common-from :formdata="formdata" class="from" @onSubmit="onSubmit"></common-from>
        <commonTable class="table" :loading="loading" :tableData="tableData" :columnData="columnData" :defaultSort="defaultSort"></commonTable>
    </div>
</template>

<script>
import commonTable from "@/components/commonTable.vue"
import CommonFrom from '@/components/commonFromVehicle.vue'
import {getVerhicleList} from "@/api/commonApi.js"
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
                    prop:"trafficId",
                    name:"车辆编号",
                    width:"180",
                    sortable:true
                },
                {
                    prop:"trafficName",
                    name:"车辆名称",
                    width:"180",
                },
                {
                    prop:"location",
                    name:"当前位置",
                    width:"180"
                },
                // {
                //     prop:"drnum",
                //     name:"司机工号",
                //     sortable:true
                // },
                {
                    prop:"driverName",
                    name:"司机姓名",
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
            defaultSort:{prop: 'trafficId', order: 'descending'},
            loading:false,
            formdata:{}
        }
    },
    created(){

    },
    mounted(){
        var trafficID=this.$route.query.name?parseInt(this.$route.query.name):null;
        var time=this.$route.query.time;
        this.formdata={
            trafficID:trafficID,
            time:time
        }
        this.getVerhicleLists(trafficID,null,time);
    },
    methods:{
        onSubmit(data){
            console.log(data,'回调数据')
            this.$router.push({
                path:'/vehicleList',
            })
            this.getVerhicleLists(parseInt(data.trafficName),data.driverName,data.time)
        },
        getVerhicleLists(trafficName,driverName,time){
            let data={
                Time:time?moment(time).format('YYYY-MM-DD HH:mm:ss'):moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                trafficID:trafficName?[trafficName]:[], 
                driverName:driverName?[driverName]:[], //司机名称
                // group:[],  //乘务组名称
            }
            this.loading=true;
            getVerhicleList(data).then((res)=>{
                var resdata=res.data.data
                resdata.forEach((item)=>{
                    item.location=(item.currentLocation.end==item.currentLocation.start)?returnStation(item.currentLocation.start)[0].name:`${returnStation(item.currentLocation.start)[0].name}-${returnStation(item.currentLocation.end)[0].name}`
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
    // height: 400px;
    .form{
        margin: 10px auto;
    }
    .table{
        margin: 10px auto;
    }
}
</style>