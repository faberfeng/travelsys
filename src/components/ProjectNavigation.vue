<template>
    <div id="projectNavigation">
        <div>i am ok</div>
        123
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
            axios.get(this.url).then((response)=>{
                console.log(response);
            })
        }
    }
}
</script>
<style lang="less">

</style>

