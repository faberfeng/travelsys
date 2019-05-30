<template>
<div>
    <!-- <div>jshfjsdgfhdsghsdhjfsd</div> -->
    
    <!-- <iframe >
        <embed width="100%" height="100%" :src="getUrl" type="application/pdf" internalinstanceid="35">
    </iframe> -->
        <pdf
            :src="getUrl"
            
        ></pdf>
</div> 
</template>

<script>
import pdf from 'vue-pdf'
export default {
    name:'pdfView',
    components: {
        pdf
    },
    data(){
        return{
            currentPage: 0,
            pageCount: 0,
            getUrl:'',
        }
    },
    created(){
        this.getUrl=this.$route.query.url;
        console.log(this.getUrl,'this.getUrl');
    },
    methods:{

    }
}
</script>

<style>

</style>
