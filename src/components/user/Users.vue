<template>
  <div>
    <!--  麵包屑導航區-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>會員管理</el-breadcrumb-item>
      <el-breadcrumb-item>會員列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片視圖區-->
    <el-card class="box-card">
      <div style="margin-top: 15px;">

        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="請輸入搜尋內容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">新增會員</el-button>
          </el-col>
        </el-row>

        <!--列表區-->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="電子信箱"></el-table-column>
          <el-table-column prop="mobile" label="電話"></el-table-column>
          <el-table-column label="狀態">
            <!--            以下的值會覆蓋 el-table-column -prop 中的值-->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" disabled>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!--            修改按鈕-->
              <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                           @click="showEditDialog(scope.row.userId)"></el-button>
              </el-tooltip>
              <!--            刪除按鈕-->
              <el-tooltip effect="dark" content="刪除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="removeUserById(scope.row.userId)"></el-button>
              </el-tooltip>

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

        <!--        添加會員輸入匡-->
        <el-dialog title="新增會員" :visible.sync="addDialogVisible" width="70%" @close="addDialogClose">
          <!--          內容主體區域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-form-item label=姓名 prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label=密碼 prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>

            <el-form-item label=電子信箱 prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>

            <el-form-item label=手機 prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">確定</el-button>
          </span>
        </el-dialog>
        <!--        修改會員輸入匡-->
        <el-dialog title="修改會員" :visible.sync="editDialogVisible" width="70%" @close="editDialogClose">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
            <el-form-item label=電子信箱 prop="email">
              <el-input v-model="editForm.email" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label=姓名 prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label=手機 prop="mobile">
              <el-input v-model="editForm.mobile" :disabled="true"></el-input>
            </el-form-item>
          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserListApi, usersAddApi, getUserApi, modifyApi, usersUpdateUrl, usersStatusUrl } from '../../axios/ApiUrl'

export default {
  data () {

    const checkEmail = (rule, value, cb) => {
      //驗證郵箱正則
      const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (regEmail.test(value)) {
        // 合法
        return cb()
      } else {
        cb(new Error('請輸入合法電子信箱'))
      }
    }
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^09\d{2}-?\d{3}-?\d{3}$/
      if (regMobile.test(value)) {
        // 合法
        return cb()
      } else {
        cb(new Error('請輸入合法手機號碼'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      userInfo: {},
      total: 0,
      addDialogVisible: false, ///新增 -  控制對話筐的顯示與隱藏
      editDialogVisible: false,  //修改 - 控制對話筐的顯示與隱藏
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 新增表單驗證
      addFormRules: {
        username: [
          {
            required: true,
            message: '請輸入姓名',
            trigger: 'blur'
          },
          {
            min: 3,
            mix: 10,
            message: '姓名長度3~10字',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '請輸入密碼',
            trigger: 'blur'
          },
          {
            min: 6,
            mix: 15,
            message: '密碼長度6~15',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '請輸入電子信箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '請輸入電話',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }

        ],
      },
      // 修改表單驗證
      editFormRules: {
        email: [
          {
            required: true,
            message: '請輸入電子信箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '請輸入電話',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }

        ],
      },
      editForm: {}
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await getUserListApi(this.queryInfo)
      if (res.status === 200) {
        this.total = res.total
        this.userList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 監聽pageSize
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getUserList()

    },
    //監聽頁碼值改變
    handleCurrentChange (newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getUserList()
    },
    //監聽對話關關閉事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    //新增新用戶
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await usersAddApi(this.addForm)
          if (res.status === 200) {
            this.$message.success(res.message)
            //關閉對話框
            this.addDialogVisible = false
            //重新獲取用戶列表
            await this.getUserList()
          } else {
            this.$message.success(res.message)
          }
        }

      })
    },

    async showEditDialog (id) {
      this.editDialogVisible = true
      //取出data中命名為res
      const { data: res } = await getUserApi(id)
      if (res.status === 200) {
        this.editForm = res.data
      } else {
        // this.editDialogVisible = false
        return this.$message.error('查詢失敗')
      }
    },
    //修改用戶
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await modifyApi(usersUpdateUrl, this.editForm.userId, { username: this.editForm.username })
          if (res.status === 200) {
            //關閉對話框
            this.editDialogVisible = false
            //重新獲取用戶列表
            await this.getUserList()
            //提示修改成功
            this.$message.success(res.message)
          } else {
            return this.$message.error(res.message)
          }
        }

      })
    },
    //根據Id進行移除
    async removeUserById (id) {
      const confirmResult = await this.$confirm(
        '請確認是否將此用戶狀態設成無效? ', '注意', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      //確認刪除回傳 confirm
      if (confirmResult === 'confirm') {
        const { data: res } = await modifyApi(usersStatusUrl, id)
        if (res.status === 200) {
          this.$message.success(res.message)
          //關閉對話框
          this.addDialogVisible = false
          //重新獲取用戶列表
          await this.getUserList()
        } else {
          this.$message.success(res.message)
        }

      } else {
        return this.$message.info('取消刪除')
      }
    }
  }
}
</script>

<style scoped>
</style>
