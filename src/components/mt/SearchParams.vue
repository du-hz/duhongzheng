<template>
    <div class="table-list-wrap">
        <div class="list-search-wrap">
            <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="120px">
                <el-form-item label="条件名称">
                    <el-select v-model="searchForm.keyword" filterable  clearable min placeholder="请选择或输入搜索" size="medium" >
                        <el-option
                            v-for="item in keys"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="修改时间">
                    <el-form-item prop="startTime">
                        <el-date-picker
                            v-model="searchForm.startTime"
                            type="datetime"
                            id="startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始日期"
                            style="width: 200px;"
                            default-time="00:00:00"
                            clearable>
                        </el-date-picker>
                    </el-form-item>
                    <span style="padding-right: 10px;">至</span>
                    <el-form-item prop="endTime">
                        <el-date-picker
                            id="endTime"
                            type="datetime"
                            v-model="searchForm.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束日期"
                            style="width: 200px;"
                            default-time="23:59:59"
                            clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search('searchForm')">搜索</el-button>
                    <el-button type="primary" @click="reset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" header-row-class-name="tableheader"  border style="width: 100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="条件名称" width="200"  prop="name" align="center"></el-table-column>
            <el-table-column label="条件规则" width="200"  prop="searchString" align="center"></el-table-column>
            <el-table-column label="最后修改时间" width="200" prop="modifyTime" align="center">
            </el-table-column>
            <el-table-column label="预计人数" width="200" prop="ct" align="center">
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="editRow(scope.row)">去查看</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="deleteRow(scope.row.id)">删除</el-button>
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

export default {
  data () {
    return {
      pager: {
        size: 10,
        curPage: 1
      },
      totalNum: 0,
      keys: [],
      tableData: [],
      searchForm: {
        startTime: '',
        endTime: ''
      }
    }
  },
  created () {
    this.fetchKeys()
    this.fetchTable()
  },
  methods: {
    fetchKeys () {
      // 查询所有搜索条件名称
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/query-name').then((response) => {
        _vue.keys = response.data.data.list
      })
    },
    fetchTable () {
      // 获取搜索条件列表
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/query-params?page=' + _vue.pager.curPage + // 第几页
        '&rows=' + _vue.pager.size + // 页面尺寸
        '&start=' + (_vue.searchForm.startTime || '') +
        '&end=' + (_vue.searchForm.endTime || '') +
        '&key=' + (_vue.searchForm.keyword || '')
      ).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 1
      })
    },
    editRow (row) {
      this.$router.push({
        name: 'mtSearch',
        params: {
          saveOrUpdate: true,
          queryId: row.id,
          keyName: row.name,
          searchParams: row.searchParams
        }
      })
    },
    deleteRow (rowId) {
      let _vue = this
      _vue.$http.delete('/api/v1.0/candidate/query-params?id=' + rowId).then((response) => {
        _vue.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
        _vue.fetchTable()
      })
    },
    search () {
      this.fetchTable()
    },
    reset () {
      this.searchForm = {
        keyword: '',
        startTime: '',
        endTime: ''
      }
      this.fetchTable()
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchTable()
    }
  }
}
</script>
<style lang="scss" scoped>
    @import "~assets/css/variable";
    .multi-button-wrap {
        button {
        }
    }
    .dialog-bottom-tip {
        text-align: center;
        font-size: 15px;
        color: #666;
    }
    .form-line {
        height: 1px;
        background: #99a9bf;
    }
</style>
