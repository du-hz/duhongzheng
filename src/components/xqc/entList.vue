<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
        <el-form-item prop="value">
          <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select">
            <el-select v-model="searchForm.select" slot="prepend" placeholder="请选择">
              <el-option label="企业名称" value="1"></el-option>
              <el-option label="CRM公司编号" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="产品分类/产业链/应用领域" prop="type">
          <el-input v-model="searchForm.type" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="企业状态" prop="state">
          <el-select v-model="searchForm.state" placeholder="请选择" style="width: 180px;">
            <el-option label="用户端展示" value="1"></el-option>
            <el-option label="用户端不展示" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重要级别" prop="level">
          <el-select v-model="searchForm.level" placeholder="请选择" style="width: 180px;">
            <el-option label="潜收100" value="1"></el-option>
            <el-option label="潜收200" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset('searchForm')">重置</el-button>
          <el-button type="primary">更新企业信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        label="企业ID"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="企业名称"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="CRM公司编号"
        align="center"
        min-width="120px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="城市"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="重要级别"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="email"
        label="背景"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="产业链"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="产业分类"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="应用领域"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="相关网站"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="联系方式"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        min-width="150px">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isEmailValidate"
        label="企业状态"
        align="center"
        min-width="100px">
        <template slot-scope="scope">
          {{scope.row.isEmailValidate | filterEmailStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="首页排序"
        align="center"
        min-width="100px">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="100px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.size"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" :before-close="handleClose" width="40%" top="50px">
      <div class="el-descriptions">
        <div class="el-descriptions__header">系统信息</div>
        <ul class="el-descriptions__body">
          <li>
            <span>更新时间</span>
            <span>2023.03-23  23:59:59</span>
          </li>
          <li>
            <span>产业链</span>
            <span>晶园制造与代工（Foundry）</span>
          </li>
          <li>
            <span>产品分类</span>
            <span>模拟器件->电源管理；cpu->3nm</span>
          </li>
          <li>
            <span>应用领域</span>
            <span>航天军工</span>
          </li>
          <li>
            <span>相关网站</span>
            <span>企业官网   天眼查</span>
          </li>
        </ul>
      </div>
      <div class="el-descriptions">
        <div class="el-descriptions__header">企业基本信息</div>
        <ul class="el-descriptions__body">
          <li>
            <span>企业名称</span>
            <span>台积电（中国）有限公司</span>
          </li>
          <li>
            <span>英文名</span>
            <span>Taiwan Semiconductor Manufacturing Company</span>
          </li>
          <li>
            <span>CRM公司编号</span>
            <span>72543</span>
          </li>
          <li>
            <span>成立日期</span>
            <span>2003.08.04</span>
          </li>
          <li>
            <span>客户标签</span>
            <span>高大上</span>
          </li>
          <li>
            <span>背景</span>
            <span>港澳台</span>
          </li>
          <li>
            <span>城市</span>
            <span>上海</span>
          </li>
          <li>
            <span>重要级别</span>
            <span>潜收100</span>
          </li>
          <li>
            <span>联系方式</span>
            <span>18810537849</span>
          </li>
          <li>
            <span>经营地址</span>
            <span>上海市浦东新区张江镇</span>
          </li>
        </ul>
      </div>
      <div class="el-descriptions">
        <div class="el-descriptions__header">企业简介</div>
        <div class="el-descriptions__body">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </div>
      </div>
      <div class="el-descriptions">
        <div class="el-descriptions__header">功能操作</div>
        <ul class="el-descriptions__body">
          <li>
            <span>上传企业LOGO</span>
            <span>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </span>
          </li>
          <li>
            <span class="vertical-middle">企业状态</span>
            <span>
              <el-select v-model="userState" placeholder="请选择" style="width: 180px;">
                <el-option label="用户端展示" value="0"></el-option>
                <el-option label="用户端不展示" value="1"></el-option>
              </el-select>
            </span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        value: '',
        select: '1',
        type: '',
        state: '',
        level: ''
      },
      tableData: [{}],
      totalNum: 99,
      pager: {
        curPage: 1,
        size: 20
      },
      dialogVisible: false,
      userState: '',
      textarea: '',
      imageUrl: ''
    }
  },
  methods: {
    search () {
      // this.tableData.push({})
      console.log(this.searchForm)
    },
    reset (from) {
      this.$refs[from].resetFields()
      this.searchForm.select = '1'
      console.log(this.searchForm)
    },
    handleCurrentChange () {

    },
    edit () {
      this.dialogVisible = true
      console.log(this.dialogVisible)
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传企业LOGO只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传企业LOGO大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
.list-search-wrap {
  /deep/ .el-input-group__prepend {
    width: 100px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
