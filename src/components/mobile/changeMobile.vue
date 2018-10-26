<template>
  <div>
    <div class="header"><img @click="back" class="backImg" src="../../assets/mobile/back.png"/>
      <div class="headerDiv">BDMS建筑数据管理系统</div>
    </div>
    <img class="bg" src="../../assets/mobile/red_bg.png"/>
    <div class="cardDiv">
      <div class="textDiv">以下的邮箱地址在协同平台账号中与所登记的手机号并不匹配</div>
      <div class="textDiv">{{email}}</div>
      <div class="dashedLineDiv"></div>
      <div class="textDiv">该邮箱地址在协同平台账号中登记的手机号为</div>
      <div class="textDiv">{{mobile | hideMobile}}</div>
    </div>
    <div class="cardDiv">
      <div class="textDiv">选项一</div>
      <div class="textDivL">如果你是以上手机号的主人，可以通过验证以上手机号申请</div>
      <div class="textDivN">
        <div class="codeLabelDiv w4">验证码</div>
        <div class="codeLabelDiv w14 bAll">
          <div class="codeLabelDiv w9">
            <input class="inputText" placeholder="请输入验证码" v-model="code"/>
          </div>
          <div class="codeLabelDiv w3 bLeft">
            <button :style="btnStyle" @click="sendPhoneCode">{{codeTime}}</button>
          </div>
        </div>

      </div>
      <div style="margin-top: 1rem">
        <el-button type="danger" style="width: 90%" @click="submitInfo">提交</el-button>
      </div>
    </div>
    <div class="cardDiv">
      <div class="textDiv">选项二</div>
      <div class="textDivL">如果采用之前输入的手机号，需要更换邮箱地址重新提交</div>
      <div style="margin-top: 1rem">
        <el-button type="danger" style="width: 90%" @click="submitInfo">返回重新提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'changeMobile',
    data() {
      return {
        baseUrl: '',
        mobile: '18321185409',
        oldMobile: '18321185409',
        email: '1208155441@qq.com',
        code: '',
        codeTime: '发送',
        total: 60,
        btnStyle: 'border: 0;width: 4rem;height: 2rem;background-color: #FFFFFF;color: #fc3439;cursor: pointer;',
        projId: 0,
        projName: '',
        applyMessage: ''
      }
    },
    created() {
      this.oldMobile = this.$route.params.oldMobile;
      this.getPageData();
      if(this.oldMobile == ''){
        this.oldMobile = sessionStorage.getItem("oldMobile");
      }
    },
    filters: {
      hideMobile: function (mobile) {
        if (typeof(mobile) == 'undefined' || mobile.length == 0)
          return '';
        return mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
      }
    },
    methods: {
      getProjectinfo: function (projId) {
        axios({
          method: 'GET',
          url: this.baseUrl + '/mobile/getProjectNameByProjId',
          params: {
            projId: projId
          },
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        }).then((response) => {
          if (response.data.result) {
            this.projName = response.data.obj;
          } else {
            alert(response.data.msg);
          }
        })
      },
      sendPhoneCode: function () {
        if (this.codeTime == '重新发送' || this.codeTime == '发送') {
          if (this.mobile.length != 11 || isNaN(this.mobile) || this.mobile.substring(0, 1) != 1) {
            this.$message({
              message: '手机号码格式不正确',
              type: 'warning'
            });
            return;
          }
          axios({
            method: 'GET',
            url: this.baseUrl + 'mobile/sendPhoneCode',
            params: {
              mobile: this.oldMobile
            },
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },
          }).then((response) => {
            if (response.data.result) {
              this.codeTime = this.total + 's后重新发送';
              this.btnStyle = "border: 0;width: 6rem;height: 2rem;background-color: #FFFFFF;color: #EAEAEA;";
              let clock = window.setInterval(() => {
                this.total--;
                this.codeTime = this.total + 's后重新发送';
                if (this.total < 0) {     //当倒计时小于0时清除定时器
                  window.clearInterval(clock)
                  this.codeTime = '重新发送';
                  this.total = 60;
                  this.btnStyle = "border: 0;width: 6rem;height: 2rem;background-color: #FFFFFF;color: #fc3439;cursor: pointer;";
                }
              }, 1000)
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      submitInfo: function () {
        axios({
          method: 'GET',
          url: this.baseUrl + '/mobile/saveApplyInfo',
          params: {
            email: this.email,
            mobile: this.oldMobile,
            code: this.code,
            applyMessage: this.applyMessage,
            projId: this.projId
          },
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        }).then((response) => {
          if (response.data.result) {
            if (response.data.msg === "提交成功") {
              this.$router.push({
                name: 'applySuccess',
                params: {
                  projName: this.projName
                }
              })
            } else if (response.data.msg === "已经存在") {
              this.$router.push({
                name: 'hasExit',
                params: {
                  projName: this.projName
                }
              })
            } else if (response.data.msg === "已经申请") {
              this.$router.push({
                name: 'hasApply',
                params: {
                  obj: response.data.obj,
                  projName: this.projName
                }
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
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
        this.email = sessionStorage.getItem("email");
        this.mobile = sessionStorage.getItem("mobile");
        this.projId = sessionStorage.getItem("projId");
        this.projName = sessionStorage.getItem("projName");
        this.applyMessage = sessionStorage.getItem("applyMessage");
        this.baseUrl = sessionStorage.getItem("baseUrl");
      },
      setPageData:function () {
        sessionStorage.setItem("oldMobile", this.oldMobile);
      }

    },
    back: function () {
      this.$router.back(-1);
    }
  }
</script>
<style>
  #app {
    width: 100%;
    min-width: 100%;
    overflow-x: hidden;
  }

  body {
    overflow-x: hidden;
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
    text-align: left;
    margin-left: 1rem;
    font-size: 1rem;
    color: #c9c9c9;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .bg {
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .inputText {
    width: 100%;
    height: 2rem;
    padding-left: 1rem;
    border: 0;
  }

  .cardDiv {
    border: 1px #EAEAEA solid;
    margin: 1rem;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 5px #EAEAEA;
    padding: 1rem;
    position: relative;
    z-index: 10;
    top: -7rem;
    background: #fff;
  }

  .textDiv {
    height: 2rem;
    line-height: 2rem;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    height: auto;
  }

  .textDivL {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #808080;
    height: auto;
  }

  .textDivN {
    height: 2rem;
    line-height: 1.5rem;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .dashedLineDiv {
    border-bottom: 0.05rem #808080 dashed;
    margin-bottom: 2rem;
    margin-top: 2rem;
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

  .codeLabelDiv {
    display: inline-block;
  }

  .w4 {
    width: 21%;
  }

  .w9 {
    width: 59%;
  }

  .w3 {
    width: 36%;
  }

  .w14 {
    width: 73%;
  }

  .bAll {
    border: 1px #c9c9c9 solid;
    padding: 0.2rem;
  }

  .bLeft {
    border-left: 1px #c9c9c9 solid;
  }
</style>
