<template>
  <div class="login_container">

    <div class="login_box">
      <!-- 頭象區-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登入表單區-->
      <el-form ref="loginFormRef" label-width="0px" class="login_from" :model="loginFrom" :rules="loginFromRules">
        <!-- 用戶名-->
        <el-form-item prop="email">
          <el-input prefix-icon="iconfont icon-user-icon" v-model="loginFrom.email"></el-input>
        </el-form-item>
        <!-- 密碼-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-lock" type="password" v-model="loginFrom.password"></el-input>
        </el-form-item>

        <!-- 按扭區-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi} from '../axios/ApiUrl'

export default {
  data () {
    return {
      loginFrom: {
        email: 'loxa5210@gmail.com',
        password: '123456'
      },
      // 表單驗證規則
      loginFromRules: {
        email: [
          {
            required: true,
            message: '請輸入用戶帳號',
            trigger: 'blur'
          },
          // {
          //   min: 3,
          //   max: 5,
          //   message: '長度在 3 到 5 個字',
          //   trigger: 'blur'
          // }
        ],
        password: [
          {
            required: true,
            message: '請輸入密碼',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '長度在 6 到 15 個字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    restLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {

        if (valid) {
          const { data: res } = await loginApi( this.loginFrom)


          console.log(res)
          if (res.status === 200) {

            this.$message({
              type: 'success',
              showClose: true,
              message: res.data.username + '歡迎光臨'
              // message: '登入成功'
            })
            //1.登入成功之後的token ,保存到客戶端
            window.sessionStorage.setItem('token', res.data.token)
            //2 登入成功導致Home
            await this.$router.push({ path: '/home' })

          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: '登入失敗'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b3b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #FFFF;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeee;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
