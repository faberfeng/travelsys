<template>
    <div>
        大大大大大的阿德啊大大的

    </div> 
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            midType:'',
            mid:'',
            haveToken:false,
            sharePath:'',

        }
    },
    created(){
        console.log(this.$route.path,'this.$route.path000');
        console.log(this.$route.name,'this.$route.name');
       this.sharePath=this.$route.path.replace(new RegExp("/qr/"), "")
        // console.log(shareNum,'shareNum');
        if(this.sharePath.indexOf("_haveToken")>0){
            this.sharePath=this.$route.path.replace(new RegExp("_haveToken"), "")
            this.haveToken=true;
            this.midType=this.sharePath.split('-')[1];
            this.mid=this.sharePath.split('-')[2].slice(3);
            
        }else{
            this.haveToken=false;
            this.midType=this.sharePath.split('-')[1];
            this.mid=this.sharePath.split('-')[2].slice(3);
        }
        console.log(this.haveToken,'this.haveToken');
        console.log(this.midType,'this.midType');
        console.log(this.mid,'this.mid');
        switch(this.midType){
            case 'QD':
                this.$router.push({
                    path:'/mobileQindan/mobileQingdanDetail',
                    query:{
                        haveToken:this.haveToken,
                        mid:this.mid,
                    }
                });
            case 'MX':
                this.$router.push({
                        path:'/mobileQindan/qingdanChioce',
                        query:{
                            haveToken:this.haveToken,
                            mid:this.mid,
                        }
                    });
            default: 
                    break;
        }
    },
    methods:{

    }
}
</script>

<style>

</style>
