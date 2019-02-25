<template>
    <div>
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
            tokenId:'',
            sharePath1:'',
        }
    },
    created(){
        // console.log(this.$route.path,'this.$route.path000');
        // console.log(this.$route.name,'this.$route.name');
       this.sharePath=this.$route.path.replace(new RegExp("/qr/"), "")
    //    console.log(this.sharePath,'this.sharePath');
        // console.log(shareNum,'shareNum');
        if(this.sharePath.indexOf("_haveToken")>0){
            this.sharePath=this.sharePath.replace(new RegExp("_haveToken"), "")
            this.sharePath1=this.sharePath.split('=')[0];
            this.tokenId=this.sharePath.split('=')[1];
            // console.log(this.sharePath1,'this.sharePath7777');
            // console.log(this.tokenId,'this.tokenId');
            this.haveToken=true;
            this.midType=this.sharePath1.split('-')[1];
            if(this.midType=='QD'){
                this.mid=this.sharePath1.split('-')[2].slice(3);
            }else if(this.midType=='MX'){
                this.mid=this.sharePath1.split('-')[2];
            }else if(this.midType=='CP'){
                this.mid=this.sharePath1.split('-')[2].slice(4);
            }
        }else{
            this.haveToken=false;
            this.midType=this.sharePath.split('-')[1];
            if(this.midType=='QD'){
                this.mid=this.sharePath.split('-')[2].slice(3);
            }else if(this.midType=='MX'){
                this.mid=this.sharePath.split('-')[2];
            }else if(this.midType=='CP'){
                this.mid=this.sharePath.split('-')[2].slice(4);
            }
        }
        // console.log(this.haveToken,'this.haveToken');
        // console.log(this.midType,'this.midType');
        // console.log(this.mid,'this.mid');
        if(this.midType=='QD'){
             this.$router.push({
                    path:'/mobileQindan/mobileQingdanDetail',
                    query:{
                        haveToken:this.haveToken,
                        mid:this.mid,
                        tokenId:this.tokenId
                    }
                });
        }else if(this.midType=='MX'){
            this.$router.push({
                        path:'/mobileQindan/qingdanChioce',
                        query:{
                            haveToken:this.haveToken,
                            mid:this.mid,
                            tokenId:this.tokenId
                        }
                    });
        }else if(this.midType=='CP'){
            this.$router.push({
                        path:'/mobileQindan/pointPosition',
                        query:{
                            haveToken:this.haveToken,
                            mid:this.mid,
                            tokenId:this.tokenId
                        }
                    });
        }
        // switch(this.midType){
        //     case 'QD':
        //         this.$router.push({
        //             path:'/mobileQindan/mobileQingdanDetail',
        //             query:{
        //                 haveToken:this.haveToken,
        //                 mid:this.mid,
        //             }
        //         });
        //     case 'MX':
        //         this.$router.push({
        //                 path:'/mobileQindan/qingdanChioce',
        //                 query:{
        //                     haveToken:this.haveToken,
        //                     mid:this.mid,
        //                 }
        //             });
        //     default: 
        //             break;
        // }
    },
    methods:{

    }
}
</script>

<style>

</style>
