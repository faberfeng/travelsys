<template>
<div>
    <img style="width:100%;height:100%;" :src="filePath"/>
</div>
</template>

<script>
export default {
    name:'filePreview',
    data(){
        return{
            BDMSUrl:'',
            filePath:'',
        }
    },
    created(){
        var vm=this;
        this.BDMSUrl=this.$store.state.BDMSUrl;
        this.filePath=this.BDMSUrl+this.$route.query.filePath;
        // console.log(this.filePath,'this.filePath');
        // console.log(this.BDMSUrl,'this.BDMSUrl')
    },
    methods:{

    }
}
</script>

<style>

</style>
