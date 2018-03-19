<template>
    <div id="projectNavigation">
        <div>i am ok</div>
        <el-button @click="back" type="primary">登陆</el-button>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name:'ProjectNavigation',
    data(){
        return{
            url:'http://10.252.26.240:8080/h2-bim-project/project2/ListCompany'
        }
    },
    created(){
        this.getProjectList();
        console.log(123);
    },
    methods:{
        getProjectList(){
            // axios.get(this.url).then((response)=>{
            //     console.log(response);
            // })
            axios({
                method:'GET',
                url:this.url,
                headers:{
                    'accept':'application/json;charset=UTF-8',
                }
            }).then((response)=>{
                console.log(response);
            })
        },
        back(){
            this.$router.push({
                path:'/login'
            })
        }
    }
}
</script>
<style lang="less">

</style>

