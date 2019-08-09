<template>
    <div>
        <video :src="getValue" width="100%" height="100%" controls="controls">
            您的浏览器不支持 video 标签。
        </video> 
    </div>
</template>

<script>
export default {
    name:'picturePreview',
    data(){
        return{

        }
    },
    created(){
         this.BDMSUrl = this.$store.state.BDMSUrl;
        this.getValue=this.BDMSUrl+this.$route.query.id
       
    }

}
</script>

<style>

</style>
