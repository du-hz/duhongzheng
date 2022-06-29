<template>
    <div>
        <div class="list-search-wrap">
            <el-form :inline="true" class="form-inline" label-width="70px">
                <el-form-item>
                    <el-button size="mini">删除</el-button>
                    <el-button size="mini">新增</el-button>
                </el-form-item>
                <el-form-item prop="startCreateTime" style="padding-left: 100px;">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期"
                        style="width: 140px;"
                        clearable>
                    </el-date-picker>
                </el-form-item>
                <span style="padding-right: 10px;">至</span>
                <el-form-item prop="endCreateTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        placeholder="结束日期"
                        style="width: 140px;"
                        clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="contractNo" style="padding-left: 100px;">
                    <el-input clearable placeholder="输入新闻ID/新闻标题/标签检索" style="width: 200%;"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-table style="width: 100%"
        ref="multipleTable" :data="tableData">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="50px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="title"
                label="新闻标题"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop=""
                label="新闻来源"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="author"
                label="新闻作者"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="autoCategory"
                label="新闻分类"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="realR"
                label="真实阅读"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="virtualR"
                label="虚拟阅读"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="index"
                label="评论数"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="index"
                label="转发数"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                type="index"
                label="收藏数"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="createTimeText"
                label="创建时间"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                type="index"
                label="更新时间"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="tags"
                label="标签"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="150px"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="150px"
                align="center">
                <template slot-scope="scope">
                    <span class="text-link">编辑</span>
                    <span class="text-link">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pager-wrap">
        <el-pagination
        background
        layout="total, prev, pager, next"
        :total="pager.totalNum"
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
      id: this.$route.params.id,
      pager: {
        totalNum: Number,
        size: 10,
        page: 1
      },
      parm: {
        text: '',
        beginTime: '',
        endTime: ''
      },
      totalNum: 1,
      tableData: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      // 下一页
      this.pager.page = val
      this.getData()
    },
    getData () {
      let _vue = this
      _vue.$http.get('/api/v1.0/news/channel/detail/' + _vue.id +
      '?page=' + _vue.pager.page +
      '&per_page=' + _vue.pager.size +
      '&text=' + _vue.parm.text +
      '&beginTime=' + _vue.parm.beginTime +
      '&endTime=' + _vue.parm.endTime).then((response) => {
        _vue.tableData = response.data.data.data
        _vue.pager.totalNum = response.data.data.rows
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style>
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
