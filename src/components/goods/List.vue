<template>
  <div>
    <!--  麵包屑導航區-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片區-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="請輸入內容" v-model="queryInfo.query" @clear="getGoodsList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goGoodsPage(true,null)">新增商品</el-button>
        </el-col>
      </el-row>
      <!--      表格區-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名稱" prop="name"></el-table-column>
        <el-table-column label="商品價格(元)" prop="price" width="120px"></el-table-column>
        <el-table-column label="商品數量" prop="quantity" width="100px"></el-table-column>
        <el-table-column label="建立時間" width="160px">
          <template slot-scope="scope">
            {{ scope.row.createDate | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="goGoodsPage(false,scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

import { getgoodsListApi} from '../../axios/ApiUrl'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5,
      },
      goodsList: [],
      total: 0,
      modifyDialogVisible: false
    }
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await getgoodsListApi(this.queryInfo)
      if (res.status === 200) {
        this.total = res.total
        this.goodsList = res.data
      } else {
        this.$message.error(res.message)
      }

    },

    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getGoodsList()
    },

    goGoodsPage (isNew , goods) {
      //到此頁面
      this.$router.push({
        name:'goods',
        params : {
          goods :goods,
          isNew :isNew,
        }
      })
    },
  },
  created () {
    this.getGoodsList()
  }

}
</script>

<style lang="less" scoped>

</style>
