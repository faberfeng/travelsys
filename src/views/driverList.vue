<template>
  <commonTable :tableData="tableData" :columnData="columnData"></commonTable>
</template>

<script>
import commonTable from "@/components/commonTable.vue"
export default {
    name:'driverList',
    components:{
        commonTable
    },
    data(){
        return {
            columnData:[
                {
                    prop:"date",
                    name:"日期",
                    width:"180"
                },
                {
                    prop:"name",
                    name:"名字",
                    width:"180"
                },
                {
                    prop:"address",
                    name:"地址",
                }
            ],
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            
                

        }
    }

}
</script>

<style>

</style>