<template>
<div>
        <div class="box-left-container">
            <div id="item-box-file">
                <span  class="label-item-active label-item">最近文档</span>
                <span  class="label-item">工程云盘</span>
                <span  class="label-item">已经分享</span>
                <span  class="label-item">个人中转</span>
                <div class="item-search">
                        <span class="title-right">
                        <input type="text" v-model="fileSearchInfo" placeholder="请输入文件名称"  class="title-right-icon" @keyup.enter="getInfo">
                        <span  class="title-right-edit-icon el-icon-search" @click="getInfo"></span>
                    </span>
                    <span class="icon-type"></span>
                </div>
            </div>
            <div>
                <p style="text-align: left;">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <span class="button-download">下载</span>
                </p>
            </div>
        </div>
        <div class="box-right-container">
            <div id="box-left">
                <h3 class="header-attribute">
                    <i class="trrangle"></i>
                    基本属性
                    <i class="icon-dropDown"></i>
                </h3>
                <ul style="padding-bottom:38px;">
                    <li class="detial-item">
                        <span class="detial-text-name">文档名称</span>
                        <span class="detial-text-value">2222.png</span>
                    </li>
                      <li class="detial-item">
                        <span class="detial-text-name">文档名称</span>
                        <span class="detial-text-value">2222.png</span>
                    </li>
                </ul>
                 <h3 class="header-attribute">
                    <i class="trrangle"></i>
                    绑定构件
                    <i class="icon-dropDown"></i>
                </h3>
                <ul>
                    <li class="goujian-item">
                        <p class="clearfix">
                            <i class="icon-goujian icon-add"></i>
                            <i class="icon-goujian icon-detial"></i>
                            <i class="icon-goujian icon-QRcode"></i>
                            <i class="icon-goujian icon-location"></i>
                            <i class="icon-goujian icon-delete"></i>
                        </p>
                        <p class="item-detial">
                            <span class="detial-text-name">文档名称</span>
                           <span class="detial-text-value">2222.png</span>
                        </p>
                         <p class="item-detial">
                            <span class="detial-text-name">文档名称</span>
                           <span class="detial-text-value">2222.png</span>
                        </p>
                         <p class="item-detial">
                            <span class="detial-text-name">文档名称</span>
                           <span class="detial-text-value">2222.png</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
</div>
</template>
<style scoped lang='less'>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
    .box-left-container{
        display: block;
        position: fixed;
        top: 116px;
        left: 26px;
        bottom: 0;
        right: 225px;
        border-right: 1px solid #cccccc;
         .title-right{
            float: left;;
            width: 214px;
            height: 30px;
            margin-right: 10px;
            position: relative;
            .title-right-icon{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                border: 1px solid #e6e6e6;
                position: relative;
                background: #fafafa;
                padding-left:10px;
                padding-right:40px;
                margin-right: 5px;
                outline: none;
                &:focus{
                      background: #ffffff;  
                }
            }
            .el-icon-search{
                position: absolute;
                right: 10px;
                top: 8px;
            }
        }
        .item-search{
            position: absolute;
            display: block;
            right: 10px;
            top: 10px;
            width: auto;
            .icon-type{
                float: left;
                width: 30px;
                height: 30px;
                border: 1px solid #cccccc;
                background: #f2f2f2;
                position: relative;
                cursor: pointer;
                border-radius: 2px;
                &::after{
                    display: block;
                    position: absolute;
                    top: 8px;
                    left: 5px;
                    width: 18px;
                    height: 13px;
                    background: url('./images/type.png')no-repeat 0 0;
                    content: '';
                }
                &:hover{
                      background: #fff6f7;
                }
            }
        }
    }
    .el-main{
        padding: 0;
    }
    #item-box-file{
        display: block;
        border-bottom: 1px solid #e6e6e6;
        height: 49px;
        padding-top: 16px;
        padding-left:20px; 
        background: #fafbfc;
        position: relative;
    }
    .label-item{
        float: left;
        height: 34px;
        font-size: 14px;
        width:106px;
        text-align: center;
        color: #999999;
        line-height: 30px;
        cursor: pointer;
        border-top: 3px solid #fafbfc;
    }
    .label-item-active{
        color: #fc3439;
        font-weight: bold;
        border-top: 3px solid #fc3439;
        border-left: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #fff;
        background: #ffffff;
    }

    /*
      右侧
    */
    .box-right-container{
        display: block;
        position: fixed;
        right: 0;
        bottom: 0;
        width: 225px;
        top: 116px;
    }
    #box-left{
        padding: 19px 13px 0 10px;
        .header-attribute{
            font-size: 14px;
            color: #333333;
            line-height: 14px;
            padding-bottom:4px;
            border-bottom: 1px solid #e6e6e6;
            text-align: left; 
            .trrangle{
                display: inline-block;
                width: 0px;
                height: 0px;
                border-left: 10px solid #fc3439;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
            }
            .icon-dropDown{
                display: block;
                width: 12px;
                height: 12px;
                background:url('./images/arror.png')no-repeat 0 0; 
                float: right;
                cursor: pointer;
            }
        }
        .detial-item{
            font-size: 12px;
            line-height: 12px;
            margin-top: 16px;
            text-align: left;
            .detial-text-name{
                color: #999999;
                width: 65px;
                display: inline-block;
            }
            .detial-text-value{
                color: #333333;
            }
            &:first-of-type{
                margin-top: 18px;
            }
        }
        .goujian-item{
            font-size: 12px;
            line-height: 12px;
            margin-top: 10px;
            padding: 10px;
            text-align: left;
            box-shadow: 0px 0px 8px rgba(93,94,94,.16);
            border-radius: 6px;
            .icon-goujian{
                float: left;
                width: 16px;
                height: 16px;
                margin-right: 10px;
                cursor: pointer;
            }
            .icon-add{
                background: url('./images/add.png')no-repeat 0 0;
                margin-right: 75px;
                &:hover{
                    background: url('./images/add1.png')no-repeat 0 0;
                }
            }
            .icon-detial{
                background: url('./images/detial.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/detial1.png')no-repeat 0 0;
                } 
            }
            .icon-QRcode{
                background: url('./images/qrcode.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/qrcode1.png')no-repeat 0 0;
                } 
            }
            .icon-location{
                background: url('./images/location.png')no-repeat 0 0;
                width: 12px;
                &:hover{
                    background: url('./images/location1.png')no-repeat 0 0;
                } 
            }
            .icon-delete{
                background: url('./images/delete.png')no-repeat 0 0;
                margin-right: 0;
                &:hover{
                    background: url('./images/delete1.png')no-repeat 0 0;
                } 
            }
            .detial-text-name{
                color: #999999;
                width: 65px;
                display: inline-block;
            }
            .detial-text-value{
                color: #333333;
            }
            .item-detial{
                margin-top: 16px;
                &:first-of-type{
                     margin-top: 10px;
                }
            }
            &:first-of-type{
                padding-top: 14px;
            }
        }
    }
</style>
<script>
export default {
  name:'Costover',
  data(){
      return {
        activeIndex:'1',
         tabShow:1,
         fileSearchInfo:'',//查询文件名称
      }
  },
  created(){
    //   console.log(88888888888888)
  },
  methods:{
    getInfo(){
        var vm = this
        
    },
  }
}
</script>



