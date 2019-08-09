<template>
    <div>
        <img :src="getValue" width="100%" height="100%"/>
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
