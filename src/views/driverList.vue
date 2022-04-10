<template>
    <div class="warrper">
    <common-from class="from" @onSubmit="onSubmit"></common-from>
    <commonTable class="table" :tableData="tableData" :columnData="columnData" :defaultSort="defaultSort"></commonTable>
    </div>
</template>


<script>
import commonTable from "@/components/commonTable.vue"
import CommonFrom from '@/components/commonFromDrive.vue'
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
                    prop:"drnum",
                    name:"司机工号",
                    width:"180",
                    sortable:true
                },
                {
                    prop:"drname",
                    name:"司机姓名",
                    width:"180"
                },
                {
                    prop:"group",
                    name:"司机乘务组",
                },
                {
                    prop:"blvhnum",
                    name:"当前开行车辆号",
                },
                {
                    prop:"location",
                    name:"当前位置",
                },
                {
                    prop:"todaydistance",
                    name:"当天里程",
                    sortable:true
                },
                {
                    prop:"totaldistance",
                    name:"累计里程",
                    sortable:true
                }
            ],
            tableData: [{
                    drnum:'001',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'002',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'003',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'004',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'005',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'006',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'007',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'008',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },{
                    drnum:'009',
                    drname:'李四',
                    group:'第五组',
                    blvhnum:'152',
                    location:'彭浦新村',
                    todaydistance:'120',
                    totaldistance:'300'
                },
                ],
            defaultSort:{prop: 'drnum', order: 'descending'}
            
                

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