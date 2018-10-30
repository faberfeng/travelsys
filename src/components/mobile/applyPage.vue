<template>
  <div>
    <div class="header">BDMS建筑数据管理系统</div>
    <div class="labelDivT">申请加入</div>
    <div class="pNameDivT" v-text="projName"></div>
    <div class="labelDivT">手机号</div>
    <div>
      <input class="inputText" placeholder="请输入手机号" v-model="mobile"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivT">邮箱</div>
    <div>
      <input class="inputText" placeholder="请输入邮箱" v-model="email"/>
    </div>
    <div class="lineDiv"></div>
    <div>
      <div class="labelDivT">验证码</div>
      <div class="inLineDiv">
        <input class="inputText" placeholder="请输入验证码" v-model="code"/>
      </div>
      <div class="inLineDiv">
        <button :style="btnStyle" @click="sendPhoneCode">{{codeTime}}</button>
      </div>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivT">申请留言</div>
    <div>
      <textarea class="textAreaMessage" maxlength="20" placeholder="请输入申请说明" v-model="applyMessage"></textarea>
    </div>
    <span class="nameLengthDiv"><span style="color: #D20202;">{{applyMessage | getRemarkLength}}</span>/20</span>
    <div class="labelDivT">建议注明工作单位和岗位</div>
    <div style="margin-top: 1rem">
      <el-button type="danger" style="width: 90%" @click="submitInfo">提交</el-button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'applyPage',
    data() {
      return {
        projName: '',
        baseUrl: 'http://10.252.29.13:8079/',
        mobile: '',
        email: '',
        code: '',
        codeTime: '获取验证码',
        total: 60,
        btnStyle: 'border: 0;width: 6rem;height: 2rem;background-color: #FFFFFF;color: #fc3439;cursor: pointer;',
        applyMessage: '',
        totalMessage: 20,
        projId: 0
      }
    },
    created() {
//      this.baseUrl = this.$store.state.BDMSUrl;;
      let url = window.location.href;
      let strs = url.split("/");
      let projId = strs[strs.length - 1];
      this.projId = projId;
      this.getProjectinfo(projId);
      this.getPageData();
    },
    filters: {
      getRemarkLength: function (remark) {
        if (typeof(remark) == 'undefined' || remark == null)
          return 0;
        return remark.length;
      }
    },
    methods: {
      getProjectinfo: function (projId) {
        axios({
          method: 'GET',
          url: this.baseUrl + 'mobile/getProjectNameByProjId',
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
        if (this.codeTime == '重新发送验证码' || this.codeTime == '获取验证码') {
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
              mobile: this.mobile
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
                  this.codeTime = '重新发送验证码';
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
        if (this.mobile.length != 11 || isNaN(this.mobile) || this.mobile.substring(0, 1) != 1) {
          this.$message({
            message: '手机号码格式不正确',
            type: 'warning'
          });
          return false;
        }
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
        if (this.email === "") { //输入不能为空
          this.$message({
            message: '邮箱不能为空',
            type: 'warning'
          });
          return false;
        } else if (!reg.test(this.email)) { //正则验证不通过，格式不对
          this.$message({
            message: '邮箱格式不正确',
            type: 'warning'
          });
          return false;
        }
        this.setPageData();
        axios({
          method: 'GET',
          url: this.baseUrl + '/mobile/saveApplyInfo',
          params: {
            email: this.email,
            mobile: this.mobile,
            code: this.code,
            applyMessage: this.applyMessage,
            projId: this.projId
          },
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        }).then((response) => {
          if (response.data.result) {
            if (response.data.msg === '账号不存在') {
              this.$router.push({
                name: 'register',
                params: {
                  email: this.email,
                  mobile: this.mobile,
                  projId: this.projId,
                  applyMessage: this.applyMessage,
                  projName: this.projName,
                  baseUrl: this.baseUrl
                }
              })
            } else if (response.data.msg === "提交成功") {
              this.$router.push({
                name: 'applySuccess',
                params: {
                  projName: this.projName
                }
              })
            } else if (response.data.msg === "已经存在") {
              this.$router.push({
                name: 'hasExist',
                params: {
                  projName: this.projName
                }
              })
            } else if (response.data.msg === "邮箱和手机号不匹配") {
              this.$router.push({
                name: 'changeMobile',
                params: {
                  email: this.email,
                  mobile: this.mobile,
                  oldMobile: response.data.obj,
                  projId: this.projId,
                  applyMessage: this.applyMessage,
                  projName: this.projName,
                  baseUrl: this.baseUrl
                }
              })
            } else if (response.data.msg === "已经申请") {
              this.$router.push({
                name: 'hasApply',
                params: {
                  obj: response.data.obj,
                  projName: this.projName,
                  baseUrl: this.baseUrl
                }
              })
            } else if (response.data.msg === "邮箱未激活") {
              this.$message({
                message: "您的账号尚未激活",
                type: 'warning'
              });
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
      getPageData: function () {
        this.mobile = sessionStorage.getItem("mobile");
        this.email = sessionStorage.getItem("email");
        this.code = sessionStorage.getItem("code");
        this.applyMessage = sessionStorage.getItem("applyMessage");
      },
      setPageData: function () {
        sessionStorage.setItem("mobile", this.mobile == null ? "" : this.mobile);
        sessionStorage.setItem("email", this.email == null ? "" : this.email);
        sessionStorage.setItem("code", this.code == null ? "" : this.code);
        sessionStorage.setItem("applyMessage", this.applyMessage == null ? "" : this.applyMessage);
        sessionStorage.setItem("projName", this.projName);
        sessionStorage.setItem("projId", this.projId);
        sessionStorage.setItem("baseUrl", this.baseUrl);
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
<style lang='less'>
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

  .labelDivT {
    text-align: left;
    margin-left: 1rem;
    font-size: 1rem;
    color: #c9c9c9;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .pNameDivT {
    text-align: left;
    margin-left: 1rem;
    font-size: 1rem;
    color: #fc3439;
  }

  .inLineDiv {
    display: inline-block;
    width: 49%;
  }

  .inputText {
    width: 95%;
    height: 2rem;
    padding-left: 1rem;
    border: 0;
  }

  .lineDiv {
    height: 1rem;
    border-bottom: 1px #EAEAEA solid;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 1rem;
  }

  .textAreaMessage {
    width: 90%;
    height: 3rem;
    padding: 0.5rem;
    padding-left: 1rem;
    border: 0;
  }

  .nameLengthDiv {
    float: right;
    margin-right: 1rem;
  }
</style>
