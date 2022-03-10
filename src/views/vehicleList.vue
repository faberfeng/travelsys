<template>
    <div class="warrper">
        <common-from class="from" @onSubmit="onSubmit"></common-from>
        <commonTable class="table" :tableData="tableData" :columnData="columnData"></commonTable>
    </div>
</template>

<script>
import commonTable from "@/components/commonTable.vue"
import CommonFrom from '@/components/commonFrom.vue'
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