<script src="../axios/ApiUrl.js"></script>
<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" height="50" width="50"/>
        <span>後台管理系統</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--側邊欄-->
      <el-aside :width="isCollapse ? '64px' : '200px ' ">
        <div class="toggle-button" @click="toggleCollapse">||</div>

        <!--側邊菜單-->
        <!-- 1級菜單-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                 unique-opened :collapse="isCollapse" router :default-active ="activePath">

          <el-submenu :index="item.menuId +''" v-for="item in menusList" :key="item.menuId">

            <template slot="title">
              <i :class="iconObj[item.menuId]"></i>
              <span>{{ item.name }}</span>
            </template>

            <!-- 2級菜單-->
            <el-menu-item :index="'/' +subItem.path " v-for="subItem in item.children" :key="subItem.menuId" @click="saveNavState('/' +subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.name }}</span>
              </template>

            </el-menu-item>

          </el-submenu>

        </el-menu>


      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menuListUrl , handleGetAxios } from '../axios/ApiUrl.js'

export default {
  created () {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menusList: [],
      iconObj: {
        '125': 'iconfont icon-user-icon',
        '103': 'iconfont icon-lock',
        '101': 'iconfont icon-Bag2',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-PortalReport'
      },
      isCollapse: false,
      activePath :''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList () {
      this.menusList =await handleGetAxios(menuListUrl)
    },
    // 折疊菜單
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333333;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .home-container {
    height: 100%;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #FFF;
    text-align: center;
    letter-spacing: 0.2em;
  }

</style>
