<template>
  <div>
    <!--  麵包屑導航區-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.isNew === true">{{ addWord }}</el-breadcrumb-item>
      <el-breadcrumb-item v-else>{{ modifyWord }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片-->
    <el-card>
      <!--    提示區-->
      <el-alert v-if="this.isNew === true" title="新增商品資訊" type="info" center show-icon :closable="false"></el-alert>
      <el-alert v-else title="修改商品資訊" type="info" center show-icon :closable="false"></el-alert>

      <!--      步驟條-->
      <el-steps :active="activeIndex -0" finish-status="success" :space="500" align-center>
        <el-step title="基本資料"></el-step>
        <el-step title="商品內容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab區域-->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="100px" label-position="top">
        <el-tabs :tab-position="`left`" v-model="activeIndex" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本訊息" name="0">基本訊息

            <el-form-item label="商品名稱" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>

            <el-form-item label="商品價格" prop="price">
              <el-input v-model="addForm.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品數量" prop="quantity">
              <el-input v-model="addForm.quantity" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分類" prop="categoryId">
              <el-cascader
                v-model="addForm.categoryId"
                :options="categoryList"
                :props="categoryProps"
                @change="handleChange"></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品內容" name="2">
            <!-- Two-way Data-Binding -->
            <quill-editor v-model="addForm.context"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">確認</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { categoryTreeListUrl, handleGetAxios, goodsUpdateUrl, modifyApi, goodsAddApi } from '../../axios/ApiUrl'

export default {
  data () {
    return {
      isNew: null,
      modifyWord: '修改商品',
      addWord: '新增商品',
      activeIndex: '0',
      // 表單數據對象
      addForm: {
        goodsId: '',
        name: '',
        price: 0,
        quantity: 0,
        context: '',
        categoryId: 0,

      },
      addFormRules: {
        name: [{
          required: true,
          message: '請輸入商品名稱',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '請輸入商品價格',
          trigger: 'blur'
        }],
        quantity: [{
          required: true,
          message: '請輸入商品數量',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '請輸入商品分類',
          trigger: 'blur'
        }]
      },
      categoryList: [],
      categoryProps: {
        expandTrigger: 'hover',
        label: 'name',
        value: 'categoryId',
        children: 'children'
      },
    }
  },
  created () {
    this.getGoodsData()
    this.getCateList()

  },
  methods: {
    getGoodsData () {
      this.isNew = this.$route.params.isNew
      if(this.isNew === undefined){
        this.isNew = true; //避免重整時無值
      }
      const goods = this.$route.params.goods
      if (goods != null) {
        this.addForm = goods
      }
    },
    async getCateList () {
      this.categoryList = await handleGetAxios(categoryTreeListUrl)
    },
    handleChange (value) {
      //取得最後一層的分類Id
      this.addForm.categoryId = value[value.length - 1]
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.categoryId === 0) {
        this.$message.error('請先選擇商品分類')
        return false
      }

    },
    async addGoods () {
      const { data: res } = await goodsAddApi(this.addForm)

      if (res.status === 200) {
        //跳轉至
        await this.$router.push('/goods')
        return this.$message.success(this.addWord + '成功')
      } else {
        return this.$message.error(res.message)
      }
    },
    async modifyGood () {
      //修改
      const { data: res } = await modifyApi(goodsUpdateUrl, this.addForm.goodsId, this.addForm)

      if (res.status === 200) {
        //跳轉至
        await this.$router.push('/goods')
        return this.$message.success(this.modifyWord + '成功')
      } else {
        return this.$message.error(res.message)

      }
    },

    async add () {
      await this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('請輸入必填欄位')
        }
      })

      if (this.isNew || this.isNew === 'undefined') {
        await this.addGoods()
      } else {
        await this.modifyGood()

      }
    }

  },
}
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 5px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>
