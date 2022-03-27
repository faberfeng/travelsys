<template>
    <div class="warrper">
        <common-from class="from" @onSubmit="onSubmit"></common-from>
        <commonTable class="table" :tableData="tableData" :columnData="columnData"></commonTable>
    </div>
</template>

<script>
import commonTable from "@/components/commonTable.vue"
import CommonFrom from '@/components/commonFromVehicle.vue'
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
                    prop:"vhnum",
                    name:"车辆编号",
                    width:"180"
                },
                {
                    prop:"location",
                    name:"当前位置",
                    width:"180"
                },
                {
                    prop:"distance",
                    name:"当天里程",
                },
                {
                    prop:"drnum",
                    name:"司机工号",
                },
                {
                    prop:"drname",
                    name:"司机姓名",
                }
            ],
            tableData: [{
                vhnum:'152',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'153',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'154',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'155',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                },
                {
                vhnum:'156',
                location:'彭浦新村',
                distance:'100km',
                drnum:'001',
                drname:'李四'
                }],
            
                

        }
    },
    methods:{
        onSubmit(data){
            console.log(data,'回调数据')
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