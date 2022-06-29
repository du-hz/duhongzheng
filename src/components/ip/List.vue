<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="90px">
        <el-form-item label="关键字搜索">
          <el-input v-model="searchForm.content" placeholder="输入关键字" clearable></el-input>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select v-model="searchForm.oneType" clearable @change="changeOneType">
            <el-option v-for="item in oneTypeOpts" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="searchForm.twoType" clearable>
            <el-option  v-for="item in twoTypeOpts" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" clearable>
            <el-option v-for="item in supplierOpts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商状态">
          <el-select v-model="searchForm.status" clearable>
            <el-option label="全部" value="0"></el-option>
            <el-option label="已绑定" value="1"></el-option>
            <el-option label="未绑定" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('searchForm')">搜索</el-button>
          <el-button type="primary" plain @click="clearSearch">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="companyFullName"
        label="发布公司"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="供应商"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="levelOneType"
        label="一级分类"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="levelTwoType"
        label="二级分类"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="model"
        label="型号"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shortDesc"
        label="描述"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="审核状态"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.auditStatus | filterAuditStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="在线状态"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOffline === 0">在线</span>
          <span v-if="scope.row.isOffline === 1">已下线</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="200"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">查看</span>
          <span v-if="scope.row.isOffline === 1" class="text-link" @click="online(scope.row)" style="margin-left: 20px;display: inline-block">再次上线</span>
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
  </div>
</template>

<script>
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  data () {
    return {
      searchForm: {
        content: '',
        oneType: '',
        twoType: '',
        typeOneName: '',
        typeTwoName: '',
        supplierId: '',
        status: '0'
      },
      pager: {
        size: 10,
        page: 1
      },
      totalNum: 1,
      tableData: [],
      oneTypeOpts: [],
      twoTypeOpts: [],
      supplierOpts: []
    }
  },
  created () {
    this.fetchList()
    this.fetchType()
    this.fetchSupplier()
  },
  filters: {
    filterAuditStatus (val) {
      if (val === 1) return '审核通过'
      else if (val === 0) return '待审核'
      else if (val === 2) return '审核不通过'
    }
  },
  methods: {
    fetchList () {
      // 获取待审核IP列表
      let _vue = this
      _vue.searchForm.typeOneName = (_.findWhere(_vue.oneTypeOpts, {id: _vue.searchForm.oneType}) || {}).typeName || ''
      _vue.searchForm.typeTwoName = (_.findWhere(_vue.twoTypeOpts, {id: _vue.searchForm.twoType}) || {}).typeName || ''
      _vue.$http.get('/api/v1.0/ip/manage/list?page=' + _vue.pager.page + '&size=' + _vue.pager.size +
        '&content=' + _vue.searchForm.content +
        '&typeOneName=' + _vue.searchForm.typeOneName +
        '&typeTwoName=' + _vue.searchForm.typeTwoName +
        '&supplierId=' + _vue.searchForm.supplierId +
        '&status=' + _vue.searchForm.status).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    search () {
      this.fetchList()
    },
    handleCurrentChange (val) {
      // 下一页
      let _vue = this
      _vue.pager.page = val
      _vue.fetchList()
    },
    viewDetail (row) {
      this.$router.push({
        name: 'ipDetail',
        params: {
          id: row.id
        }
      })
    },
    fetchType () {
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/type').then((response) => {
        _vue.oneTypeOpts = Global.resetOthersType(response.data.data)
      })
    },
    changeOneType () {
      let _vue = this
      let opts = _.findWhere(_vue.oneTypeOpts, {id: _vue.searchForm.oneType})
      if (opts) {
        _vue.searchForm.twoType = ''
        _vue.twoTypeOpts = Global.resetOthersType(opts.children)
      }
    },
    fetchSupplier () {
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/list?page=1&size=99').then((response) => {
        _vue.supplierOpts = response.data.data.rows
      })
    },
    clearSearch () {
      this.searchForm.content = ''
      this.searchForm.oneType = ''
      this.searchForm.twoType = ''
      this.searchForm.supplierId = ''
      this.searchForm.status = '0'
    },
    online (ip) {
      // 再次上线
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/manage/same?name=' + ip.model).then((response) => {
        let result = response.data.data
        if (result.status === 1) {
          // 重名IP，不能再次上线
          _vue.$message({
            type: 'error',
            message: '已存在相同型号IP, 不能再次上线',
            center: true
          })
        } else {
          _vue.$http.post('/api/v1.0/ip/manage/online', {
            id: ip.id
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: 'IP上线成功',
              center: true
            })
            _vue.fetchList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
