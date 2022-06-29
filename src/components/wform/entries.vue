<template>
  <div class="table-main">
    <div>
      <!-- <table>
        <tr v-for="(item, index) in tableData" :key="index" class="table-rows">
          <th v-for="(i, n) in Object.keys(item)" :key="n" class="row-item top" v-if="index === 0" :style="dialogData[i] === '提交时间' || dialogData[i] === '访客ID' ? 'width:200px': ''">
            <div class="title">
              {{dialogData[i]}}
            </div>
          </th>
          <th v-for="(i, n) in Object.keys(item)" :key="n" class="row-item" v-if="index > 0" :style="dialogData[i] === '提交时间' || dialogData[i] === '访客ID' ? 'width:200px': ''">
            {{dialogData[i] === '序号' ? item[i] + 1 : item[i]}}
            </th>
        </tr>
      </table> -->
      <el-table
        v-if="isshow"
        :data="tableData"
        :header-cell-style="rowClass"
        style="width: 100%;"
        height= 'calc(100vh - 260px)'
        border>
        <el-table-column
          type="index"
          width="50"
          fixed="left"
          align="center">
        </el-table-column>
        <el-table-column
          label="用户ID"
          prop="submitUserId"
          width="100"
          fixed="left"
          align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in originalData.titles.details"
          :key="index"
          :label="item.value"
          :width="item.keyName === 'cf_email' ? 200 : 150"
          align="center">
          <template slot-scope="scope">
            <a v-if="item.keyName === 'cf_upload'" :href="scope.row.cf_upload | qiniuUrl" class="text-link" target="_blank">{{scope.row.cf_upload | uploadFilter}}</a>
            <span v-else>{{scope.row[item.keyName]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="utmSource"
          prop="utmSource"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="utmMedium"
          prop="utmMedium"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="utmCampaign"
          prop="utmCampaign"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="utmContent"
          prop="utmContent"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="utmTerm"
          prop="utmTerm"
          width="100"
          align="center">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="totalNum"
          :page-size="pager.pageSize"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { Base64 } from 'js-base64'
const Config = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')
export default {
  components: {
    draggable
  },
  data () {
    return {
      uuid: '',
      currentPage: '',
      pager: {
        currentPage: 1,
        pageSize: 20
      },
      isshow: false,
      originalData: [],
      totalNum: 0,
      tableData: [],
      dialogData: {}
    }
  },
  created () {
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : ''
    this.currentPage = this.$route.query.currentPage ? this.$route.query.currentPage : ''
    this.getDataList()
  },
  filters: {
    qiniuUrl (val) {
      let qiniuUrl = val
      if (val) {
        if (val.startsWith('http')) {
          qiniuUrl = val
        } else {
          // 需要拼接七牛域名
          qiniuUrl = Config.QINIU_BUCKET_MOORE_FILE_URL + '/' + val
        }
      }
      return qiniuUrl
    },
    uploadFilter (val) {
      if (val) {
        var index = val.indexOf('file/')
        var url = val.substring(index + 5, val.length)
        var index2 = url.indexOf('_')
        var url2 = url.substring(index2 + 1, url.length)
        var url3 = ''
        var value = ''
        if (url2.lastIndexOf('.') > -1) {
          var last = val.substring(val.lastIndexOf('.'))
          url3 = url2.substring(0, url2.lastIndexOf('.'))
          if (url3.indexOf('=') > -1) {
            value = Base64.decode(url3) + last
          } else {
            value = url3 + last
          }
        } else {
          value = Base64.decode(url2)
        }
        return value
      } else {
        return val
      }
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.pager.currentPage = value
      this.tableData = []
      this.originalData = []
      this.getDataList()
    },
    rowClass () {
      return 'background:#F3F4F7;color:#555'
    },
    getDataList () {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${self.uuid}/result?page=${this.pager.currentPage}&per_page=${this.pager.pageSize}`).then((res) => {
        let data = res.data.data
        self.originalData = data
        self.isshow = true
        console.log('用户提交信息', data)
        this.totalNum = data.total
        let tableData = data.submitLogs
        tableData.map(item => {
          let id = {submitUserId: item.submitUserId}
          let utmSource = {utmSource: item.utmSource}
          let utmMedium = {utmMedium: item.utmMedium}
          let utmCampaign = {utmCampaign: item.utmCampaign}
          let utmContent = {utmContent: item.utmContent}
          let utmTerm = {utmTerm: item.utmTerm}
          let newObj = Object.assign(id, item.details, utmSource, utmMedium, utmCampaign, utmContent, utmTerm)
          self.tableData.push(newObj)
          return item
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import './scss/color.scss';
.table-main{
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
}
.pagination {
  text-align: right;
  margin: 20px;
}
</style>
