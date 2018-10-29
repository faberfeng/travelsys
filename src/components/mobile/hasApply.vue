<template>
  <div style="width: 100%;overflow-x: hidden;">
    <div class="header">
      <img @click="back" class="backImg" src="../../assets/mobile/back.png"/>
      <div class="headerDiv">BDMS建筑数据管理系统</div>
    </div>
    <div class="NullDiv"></div>
    <div class="labelDiv" style="color: #000;">您的用户账号已经提交过</div>
    <div class="pNameDiv">{{projName}}</div>
    <div class="labelDiv">BIM协同管理平台的申请</div>
    <div class="labelDiv">请耐心等待管理员审核</div>
    <div class="labelDiv">您可以更改申请留言</div>
    <div>
      <textarea class="textAreaMessage" maxlength="20" placeholder="请输入申请说明" v-model="applyMessage"></textarea>
    </div>
    <span class="nameLengthDiv"><span style="color: #D20202;">{{applyMessage | getRemarkLength}}</span>/20</span>
    <div style="margin-top: 1.5rem">
      <el-button type="danger" style="width: 90%" @click="submitInfo">提交</el-button>
    </div>
    <div class="NullDiv"></div>
    <div>
      <img src="../../assets/mobile/qrCode.png"/>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'hasApply',
    data() {
      return {
        projName: '',
        baseUrl: '',
        applyMessage: '',
        obj: new Object()
      }
    },
    created() {
      this.getPageData();
    },
    filters: {
      getRemarkLength: function (remark) {
        if (typeof(remark) == 'undefined')
          return 0;
        return remark.length;
      }
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      },
      submitInfo: function () {
        if(this.applyMessage.length == 0){
          this.$message({
            message: "留言不能为空",
            type: 'warning'
          });
          return;
        }
        this.setPageData();
        axios({
          method: 'GET',
          url: this.baseUrl + '/mobile/alterApplyInfo',
          params: {
            id: this.obj.id,
            applyMessage: this.applyMessage,
          },
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        }).then((response) => {
          if (response.data.result) {
            this.$router.push({
              name: 'applySuccess',
              params: {
                projName: this.projName
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      getPageData:function () {
        this.applyMessage = sessionStorage.getItem("applyMessage");
        this.projName = sessionStorage.getItem("projName");
        this.baseUrl = sessionStorage.getItem("baseUrl");
      },
      setPageData:function () {
        sessionStorage.setItem("applyMessage", this.applyMessage);
      }
    },
  }
</script>
<style>
  #app {
    width: 100%;
    min-width: 100%;
  }
</style>
<style lang="less">
    .header {
    width: 100%;
    height: 4rem;
    background-color: #fc3439;
    color: #FFFFFF;
    font-size: 1.5rem;
    font-weight: bolder;
    line-height: 4rem;
    text-align: left;
    padding-left: 0.5rem;
  }

  .labelDiv {
    margin-left: 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    color: #808080;
    text-align: center;
  }

  .pNameDiv {
    margin-left: 1rem;
    font-size: 1.5rem;
    color: #fc3439;
    text-align: center;
  }

  .backImg {
    position: relative;
    left: -1.5rem;
    top: -0.8rem;
  }

  .headerDiv {
    position: relative;
    top: -7.2rem;
    left: 2rem;
  }

  .NullDiv {
    margin: 2rem;
  }

  .textAreaMessage {
    width: 90%;
    height: 3rem;
    padding: 0.5rem;
    padding-left: 1rem;
    border: 1px #c9c9c9 solid;
  }

  .nameLengthDiv {
    float: right;
    margin-right: 1rem;
  }
</style>
