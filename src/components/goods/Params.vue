<template>
  <div>
    <!--  麵包屑導航區-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>參數列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片區-->
    <el-card>
      <!-- 頭部警告區-->
      <el-alert title="注意只允许为第三方分类设置参数！" show-icon type="warning" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>選擇商品分類：</span>
          <!-- 選擇商品分類級連框-->
          <!--            options用來指定數據-->
          <!--            :props 用來指定配置對象-->
          <el-cascader
            v-model="selectedCateKeys" :options="cateList" :props="cateProps"
            @change="handleCateChange">
          </el-cascader>
          <!--          Tab頁籤區域-->
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!--            動態參數-->
            <el-tab-pane label="動態參數" name="many" :disabled="isBtnDisabled">
              <el-button type="primary" size="mini" @click="addDialogVisible = true" :disabled="isBtnDisabled">新增參數
              </el-button>
              <!--              動態參數表格-->
              <el-table :data="manyTableDate" border stripe>
                <!--   展開行-->
                <el-table-column type="expand">
                  <template slot-scope="scope">

                    <el-tag v-for="(item , index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row ,index)">
                      {{ item }}
                    </el-tag>

                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                    </el-button>
                  </template>


                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="參數名稱" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="showEditDialog(scope.row.attr_id)">修改
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                      刪除
                    </el-button>
                  </template>

                </el-table-column>

              </el-table>
            </el-tab-pane>
            <!--            靜態參數-->
            <el-tab-pane label="靜態參數" name="only" :disabled="isBtnDisabled">
              <el-button type="primary" size="mini" @click="addDialogVisible = true" :disabled="isBtnDisabled">新增屬性
              </el-button>
              <!--              靜態參數表格-->

              <el-table :data="onlyTableDate" border stripe>
                <!--   展開行-->
                <el-table-column type="expand">
                  <template slot-scope="scope">

                    <el-tag v-for="(item , index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row ,index)">
                      {{ item }}
                    </el-tag>

                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="屬性名稱" prop="attr_name"></el-table-column>
                <el-table-column label="操作">

                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="showEditDialog(scope.row.attr_id)">修改
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                      刪除
                    </el-button>
                  </template>

                </el-table-column>

              </el-table>
            </el-tab-pane>
          </el-tabs>

        </el-col>
      </el-row>
    </el-card>
    <!--      添加參數對話框 動態與靜態-->
    <el-dialog :title="'新增'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

      <el-form :model="addForm" :rules="addRuleForm" ref="addFormRef" label-width="100px">

        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改-->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">

      <el-form :model="editForm" :rules="addRuleForm" ref="editFormRef" label-width="100px">

        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //級聯選擇商品分類
      selectedCateKeys: [],
      activeName: 'many',
      manyTableDate: [],
      onlyTableDate: [],
      //控制添加對話框
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_id: '',
        attr_name: ''
      },
      //表單驗證對象 新增跟修改共用
      addRuleForm: {
        attr_name: {
          required: true,
          message: '請輸入參數名稱',
          trigger: 'blur'
        }
      },
      editDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      //const 宣告的變數其指向的值不能再被改變,在宣告變數的同時就需要指定值
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status === 200) {
        this.cateList = res.data
      } else {
        this.$message.error('獲取分類失敗')
      }
    },
    async handleCateChange () {
      if (this.selectedCateKeys.length === 3) {
        await this.getParamsData()
      } else {
        //表示選擇不是第三及分類
        this.manyTableDate = []
        this.onlyTableDate = []
        this.selectedCateKeys = []
      }
    },
    // tab頁籤點擊事件
    handleTabClick () {
      this.getParamsData()
    },

    async getParamsData () {
      //根據所選分類Id ,和當前所處的面板
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: this.activeName } })

      if (res.meta.status === 200) {
        //將字串轉成陣列
        res.data.forEach(item => {
          //如果是空的回傳空陣列
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          //控制按鈕與對話框切換顯示
          item.inputVisible = false
          //對話框內容
          item.inputValue = ''

        })

        if (this.activeName === 'many') {
          this.manyTableDate = res.data
        } else {
          this.onlyTableDate = res.data
        }
      } else {
        this.$message.error('獲取資料失敗')
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    addCate () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {

          const { data: res } = await this.$http.post(`categories/${this.catId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          if (res.meta.status === 201) {
            this.$message.success('新增成功')
            this.addDialogVisible = false
            await this.getParamsData()

          } else {
            this.$message.error('新增失敗')

          }

        }
      })

    },

    async showEditDialog (attr_id) {
      this.editDialogVisible = true

      //根據所選分類Id ,和當前所處的面板
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })

      if (res.meta.status === 200) {
        this.editForm = res.data
      } else {
        this.$message.error('獲取資料失敗')
      }
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    editCate () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            })

          if (res.meta.status === 200) {
            this.editDialogVisible = false
            await this.getParamsData()
            this.$message.success('修改資料成功')

          } else {
            this.$message.error('獲取資料失敗')
          }
        }

      })
    },
    async removeParams (attr_id) {
      const confirmResult = await this.$confirm('請確認是否要進行刪除', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warring'
      }).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.catId}/attributes/${attr_id}`)
        if (res.meta.status === 200) {
          await this.getParamsData()
          this.$message.success('刪除成功')
        } else {
          this.$message.error('刪除失敗')
        }
      } else {
        this.$message.info('已取消刪除')
      }

    },

    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        //隱藏對話框
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue)
        row.inputValue = ''
        //隱藏對話框
        row.inputVisible = false

        //發起請求
        await this.saveAttrVals(row)

      }

    },
    // 點擊按鈕展示輸入框
    showInput (row) {
      // console.log(inputVisible)
      row.inputVisible = true
      // console.log(inputVisible)
      //對話框獲得焦點
      //$nextTick 方法作用 當頁面上元素被重新炫染之後才會指定回調函數中的代碼
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })

    },

    handleClose(row ,index){
      console.log(row)


      row.attr_vals.splice(index,1)
      this.saveAttrVals(row)
    },

    //將對attr_vals 存入資料庫
    async saveAttrVals (row) {
      //發起糗情
      const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')

        })

      if (res.meta.status === 200) {
        this.$message.success('修改資料成功')
      } else {
        this.$message.error('修改資料失敗')
      }
    }

  },
  computed: {
    //動態計算標題
    titleText () {
      if (this.activeName === 'many') {
        return '動態參數'
      } else {
        return '靜態屬性'
      }
    },
    //如果按鈕需要被禁用
    isBtnDisabled () {
      return this.selectedCateKeys.length !== 3
    },
    // 當前選中的三級分類Id
    catId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
