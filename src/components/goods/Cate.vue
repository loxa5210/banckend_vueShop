<template>
  <div>
    <!--  麵包屑導航區-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片視圖區-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">新增分類</el-button>
        </el-col>
      </el-row>
      <!--      表格區-->
      <el-table :data="categoryList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="分類名稱" prop="name"></el-table-column>
        <el-table-column label="子分類" prop="isChild" width="120px">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.isChild === true" style="color: lightblue;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="priority" width="100px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removerById(scope.row.categoryId)">刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--        分頁區-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 5, 10, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--    分類對話框-->
    <el-dialog title="新增分類" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">

      <!--      添加分類表單-->
      <el-form :model="addCatForm" label-width="80px" ref="addCatFormRef" :rules="addCatFormRules">
        <el-form-item label="分類名稱" prop="name">
          <el-input v-model="addCatForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="priority">
          <el-input v-model="addCatForm.priority"></el-input>
        </el-form-item>
        <el-form-item label="父級分類">
          <!--            options用來指定數據-->
          <!--            :props 用來指定配置對象-->
          <el-cascader v-model="addCatForm.parentId" :options="cateTreeList" :props="cascaderProps"
                       :clearable="true" @change="CateTreeChange">
          </el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryListApi, categoryUpdateApi, removeCategoryApi ,categoryTreeListUrl ,handleGetAxios} from '../../axios/ApiUrl'

export default {
  data () {
    return {
      //添加分類驗證
      addCatFormRules: {
        name: [{
          required: true,
          message: '請輸入分類名稱',
          trigger: 'blur'
        }]
      },
      //添加分類的數據對象
      addCatForm: {
        name: '',
        isChild: false,
        parentId: '',
        priority: 0
      },
      //商品分類數據列表
      categoryList: [],
      queryInfo: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      //控制對話框顯示隱藏
      addCateDialogVisible: false,
      //分類列表
      cateTreeList: [],
      cascaderProps: {
        checkStrictly: 'true',
        expandTrigger: 'hover',
        value: 'categoryId',
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await getCategoryListApi(this.queryInfo)
      if (res.status === 200) {
        this.total = res.total
        this.categoryList = res.data
      } else {
        this.$message.error(res.message)
      }
    },

    //監聽pageSize
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getCateTreeList()
      this.addCateDialogVisible = true
    },
    //獲取分類樹
    async getCateTreeList () {
      this.cateTreeList = await handleGetAxios(categoryTreeListUrl)

    },
    //選項發生變化時呼叫該方法
    CateTreeChange (value) {
      //取得最底層Id
      this.addCatForm.parentId = value[value.length - 1]
      this.addCatForm.isChild = true
    },
    addCateDialogClose () {
      this.$refs.addCatFormRef.resetFields()
      this.addCatForm.parentId = ''
      this.addCatForm.isChild = false
    },
    addCate () {
      this.$refs.addCatFormRef.validate(async valid => {
        if (valid) {
          // //const 宣告的變數其指向的值不能再被改變,在宣告變數的同時就需要指定值
          const { data: res } = await categoryUpdateApi(this.addCatForm)

          if (res.status === 200) {
            this.$message.success('新增分類成功')
            await this.getCateList()
            this.addCateDialogVisible = false
          } else {
            this.$message.error('新增分類失敗')
          }
        }
      })
    },
    async removerById (categoryId) {
      const { data: res } = await removeCategoryApi(categoryId)
      if (res.status === 200) {
        if (res.data) {
          await this.getCateList()
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)

        }
      }
    }

  },
}
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
