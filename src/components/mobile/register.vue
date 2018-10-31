<template>
  <div style="width: 100%;overflow-x: hidden;">
    <div class="headerApply">
      <img @click="back" class="backImg" src="../../assets/mobile/back.png"/>
      <div class="headerDiv">BDMS建筑数据管理系统</div>
    </div>
    <div class="labelDivR">你的手机号及邮箱未注册过BIM协同管理平台</div>
    <div class="pNameDivR">请补充以下空缺信息</div>
    <div class="labelDivR">手机号</div>
    <div>
      <input class="inputText" readonly placeholder="请输入手机号" v-model="mobile"/>
    </div>
    <div class="labelDivR">邮箱</div>
    <div>
      <input class="inputText" placeholder="请输入邮箱" v-model="email"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivR">用户名<span style="color: red;">*</span></div>
    <div>
      <input class="inputText" placeholder="请输入用户名" v-model="account"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivR">真实姓名<span style="color: red;">*</span></div>
    <div>
      <input class="inputText" placeholder="请输入姓名" v-model="realName"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivR">QQ号</div>
    <div>
      <input class="inputText" placeholder="请输入qq号" v-model="qq"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivR">密码<span style="color: red;">*</span></div>
    <div>
      <input class="inputText" placeholder="请输入密码" type="password" v-model="pwd"/>
    </div>
    <div class="lineDiv"></div>
    <div class="labelDivR">密码确认</div>
    <div>
      <input class="inputText" placeholder="请确认密码" type="password" v-model="pwdRepeat"/>
    </div>
    <div class="lineDiv"></div>

    <div style="margin-top: 1rem">
      <el-button type="danger" style="width: 90%" @click="submitInfo">提交</el-button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import md5 from 'js-md5';

  export default {
    name: 'applyPage',
    data() {
      return {
        projName: '',
        baseUrl: '',
        mobile: '',
        email: '',
        account: '',
        applyMessage: '',
        projId: 0,
        realName: '',
        qq: '',
        pwd: '',
        pwdRepeat: ''
      }
    },
    created() {
      this.getPageData();
    },

    methods: {
      submitInfo: function () {

        let str = this.checknickname(this.account);
        if (str != "" ) {
          this.$message({
            message: str,
            type: 'warning'
          });
          return false;
        }
        if (this.realName === "") { //输入不能为空
          this.$message({
            message: '真实姓名不能为空',
            type: 'warning'
          });
          return false;
        }

        if (this.pwd.length == 0) { //输入不能为空
          this.$message({
            message: '密码不能为空',
            type: 'warning'
          });
          return false;
        }
        if (!isNaN(this.pwd)) { //输入不能为空
          this.$message({
            message: '密码不能全是数字',
            type: 'warning'
          });
          return false;
        }
        if (this.pwd != this.pwdRepeat) { //输入不能为空
          this.$message({
            message: '两次输入的密码不一样',
            type: 'warning'
          });
          return false;
        }
        axios({
          method: 'GET',
          url: this.baseUrl + '/mobile/saveRegisterApplyInfo',
          params: {
            email: this.email,
            mobile: this.mobile,
            account: this.account,
            realName: this.realName,
            qq: this.qq,
            passWord: md5(this.pwd),
            applyMessage: this.applyMessage,
            projId: this.projId
          },
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        }).then((response) => {
          if (response.data.result) {
            if (response.data.msg === '提交成功') {
              this.$router.push({
                name: 'registerSuccess',
                params: {
                  email: this.email,
                  mobile: this.mobile,
                  projId: this.projId,
                  applyMessage: this.applyMessage,
                  projName: this.projName
                }
              })
            } else if (response.data.msg === "该账号已被注册") {
              this.$message({
                message: "用户名已被使用",
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
      back: function () {
        this.$router.back(-1);
      },
      getPageData: function () {
        this.mobile = sessionStorage.getItem("mobile");
        this.email = sessionStorage.getItem("email");
        this.code = sessionStorage.getItem("code");
        this.applyMessage = sessionStorage.getItem("applyMessage");
        this.projId = sessionStorage.getItem("projId");
        this.projName = sessionStorage.getItem("projName");
        this.baseUrl = sessionStorage.getItem("baseUrl");
      },
      checknickname: function (a) {
        if (/[\u4e00-\u9fa5]/.test(a)) {
          return "用户名不能包含汉字";
        }
        var c = /^[\w|\u4E00-\u9FA5]+$/,
          d = this.getByteCount(this.trimString(a));
        if (d == 0) {
          return "请填写用户名。";
        } else {
          if (d < 3) {
            return "不少于3个字符(数字，字母和下划线)。";
          } else {
            if (d > 20) {
              return "不超过20个字符(数字，字母和下划线)。";
            } else {
              if (!a.match(c)) {
                return "账号仅可使用字母、数字或下划线。";
              }
            }
          }
        }
        return "";
      },
      trimString:function (a) {
        return a.replace(/(^\s*)|(\s*$)/g, "");
      },
      getByteCount:function (str) {
        var a = str.replace(/(<.*?>)/ig, "");
        a = a.replace(/([\u0391-\uFFE5])/ig, "11");
        var c = a.length;
        return c;
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
  .headerApply {
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

  .labelDivR {
    text-align: left;
    margin-left: 1rem;
    font-size: 1rem;
    color: #c9c9c9;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .pNameDivR {
    text-align: left;
    margin-left: 1rem;
    font-size: 1rem;
    color: #fc3439;
  }

  .inLineDiv {
    display: inline-block;
    width: 49.5%;
  }

  .inputText {
    width: 100%;
    height: 2rem;
    padding-left: 1rem;
    border: 0;
  }

  .lineDiv {
    height: 1rem;
    border-bottom: 1px #EAEAEA solid;
    width: 92%;
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
</style>
