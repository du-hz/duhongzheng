<template>
  <div class="table-list-wrap">
    <div class="list-title">频道管理</div>
    <div class="operate-wrap">
      <el-button type="primary" @click="showAddChannelDialog">新增频道</el-button>
      <el-button type="primary" @click="updateChannel">保存并同步</el-button>
    </div>
    <el-row :gutter="40">
      <el-col :span="8">
        <div>
          <div class="table-title">PC端</div>
          <el-table
            :data="channelData.pc"
            class="pc-channel-table"
            row-key="id"
            header-row-class-name="tableheader">
            <el-table-column
              prop="id"
              label="频道ID"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              label="频道名称"
              width="200"
              align="center">
              <template slot-scope="scope">
                <span class="text-link" @click="view(scope.row)">{{scope.row.pcName}}</span>
                <span>( {{scope.row.count}} )</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否展示"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.pcDisplay === 1">是</span>
                <span v-if="scope.row.pcDisplay !== 1">否</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120px"
              fixed="right">
              <template slot-scope="scope">
                <span class="text-link" @click="edit(scope.row, 1)">编辑</span>
                <span class="text-link" @click="remove(scope.row, 1)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <div class="table-title">移动端（移动站频道名称请勿大于4个汉字）</div>
          <el-table
            :data="channelData.wx"
            class="wx-channel-table"
            row-key="id"
            header-row-class-name="tableheader">
            <el-table-column
              prop="id"
              label="频道ID"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              label="频道名称"
              width="200"
              align="center">
              <template slot-scope="scope">
                <span class="text-link" @click="view(scope.row)">{{scope.row.wxName}}</span>
                <span>( {{scope.row.count}} )</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否展示"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.wxDisplay === 1">是</span>
                <span v-if="scope.row.wxDisplay !== 1">否</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120px"
              fixed="right">
              <template slot-scope="scope">
                <span class="text-link" @click="edit(scope.row, 2)">编辑</span>
                <span class="text-link" @click="remove(scope.row, 2)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <div class="table-title">APP端</div>
          <el-table
            :data="channelData.app"
            class="app-channel-table"
            row-key="id"
            header-row-class-name="tableheader">
            <el-table-column
              prop="id"
              label="频道ID"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              label="频道名称"
              width="200"
              align="center">
              <template slot-scope="scope">
                <span class="text-link" @click="view(scope.row)">{{scope.row.appName}}</span>
                <span>( {{scope.row.count}} )</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否展示"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.appDisplay === 1">是</span>
                <span v-if="scope.row.appDisplay !== 1">否</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120px"
              fixed="right">
              <template slot-scope="scope">
                <span class="text-link" @click="edit(scope.row, 3)">编辑</span>
                <span class="text-link" @click="remove(scope.row, 3)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 新增频道弹窗 -->
    <el-dialog title="新增频道" :visible.sync="showAddDialog" width="40%">
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="频道名称">
          <el-input style="width: 80%;" v-model="channelForm.name" maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="频道说明">
          <el-input style="width: 80%;" type="textarea" :rows="4" maxlength="200" v-model="channelForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCompanyForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑频道弹窗 -->
    <el-dialog title="编辑频道" :visible.sync="showEditDialog" width="40%">
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="频道ID">
          <span>{{editChannelForm.id}}</span>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="频道名称">
          <el-input style="width: 80%;" v-model="editChannelForm.name" maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="频道说明">
          <el-input style="width: 80%;" type="textarea" :rows="4" maxlength="200" v-model="editChannelForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" style="width: 80%;">
        <el-form-item label="是否展示">
          <el-radio-group v-model="editChannelForm.display">
            <el-radio :label="1">展示</el-radio>
            <el-radio :label="0">不展示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 频道删除提示 -->
    <el-dialog title="删除频道" :visible.sync="showRemoveDialog" width="35%">
      <div class="main-tip">确定删除吗
        <span class="name" v-if="curType === 1">PC端-{{curChannel.pcName}}</span>
        <span class="name" v-if="curType === 2">移动端-{{curChannel.wxName}}</span>
        <span class="name" v-if="curType === 3">APP端-{{curChannel.appName}}</span>
        ？</div>
      <div class="sub-tip">在删除该频道的同时，还是删除
        <template v-if="curType === 1">
          <span class="name">移动端-{{curChannel.wxName}}</span> 和 <span class="name">APP端-{{curChannel.appName}}</span>
        </template>
        <template v-if="curType === 2">
          <span class="name">PC端-{{curChannel.pcName}}</span> 和 <span class="name">APP端-{{curChannel.appName}}</span>
        </template>
        <template v-if="curType === 3">
          <span class="name">PC端-{{curChannel.pcName}}</span> 和 <span class="name">移动端-{{curChannel.wxName}}</span>
        </template>
        ，同时会造成原该频道下的所有新闻，所属频道都为空。</div>
      <div class="action-wrap">
        <el-button @click="showRemoveDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRemove">确认删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      showAddDialog: false,
      showRemoveDialog: false,
      showEditDialog: false,
      channelData: {
        app: [],
        pc: [],
        wx: []
      },
      channelForm: {
        name: '',
        description: ''
      },
      editChannelForm: {
        id: '',
        name: '',
        display: 1,
        description: ''
      },
      curChannel: {},
      curType: '',
      mergeDataList: []
    }
  },
  created () {
    let _vue = this
    _vue.getList()
  },
  mounted () {
    let _vue = this
    let pcTable = document.querySelector('.pc-channel-table tbody')
    let wxTable = document.querySelector('.wx-channel-table tbody')
    let appTable = document.querySelector('.app-channel-table tbody')

    // NOTE: row-key 一定要设置
    window.Sortable.create(pcTable, {
      onEnd ({ newIndex, oldIndex }) {
        let targetRow = _vue.channelData.pc.splice(oldIndex, 1)[0]
        _vue.channelData.pc.splice(newIndex, 0, targetRow)
      }
    })
    window.Sortable.create(wxTable, {
      onEnd ({ newIndex, oldIndex }) {
        let targetRow = _vue.channelData.wx.splice(oldIndex, 1)[0]
        _vue.channelData.wx.splice(newIndex, 0, targetRow)
      }
    })
    window.Sortable.create(appTable, {
      onEnd ({ newIndex, oldIndex }) {
        let targetRow = _vue.channelData.app.splice(oldIndex, 1)[0]
        _vue.channelData.app.splice(newIndex, 0, targetRow)
      }
    })
  },
  methods: {
    showAddChannelDialog () {
      this.showAddDialog = true
      this.channelForm = {
        name: '',
        description: ''
      }
    },
    submitCompanyForm () {
      let _vue = this
      _vue.$http.post('/api/v1.0/news/channel/add', _vue.channelForm).then((response) => {
        _vue.$message({
          type: 'success',
          message: '添加成功',
          center: true
        })
        _vue.showAddDialog = false
        _vue.getList()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    getList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/news/channel/list').then((response) => {
        _vue.channelData = response.data.data
      })
    },
    updateChannel () {
      // 保存 & 同步信息
      let _vue = this
      _vue.mergeData()
      _vue.$http.put('/api/v1.0/news/channel/update', _vue.mergeDataList).then((response) => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        _vue.getList()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    mergeData () {
      // 把三个数组合并，主要合并对应id的排序值
      let _vue = this
      let wxIds = _.pluck(_vue.channelData.wx, 'id')
      let appIds = _.pluck(_vue.channelData.app, 'id')
      _vue.mergeDataList = []
      _.each(_vue.channelData.pc, (item, index) => {
        item.pcSortVal = index + 1
        item.wxSortVal = _.indexOf(wxIds, item.id) + 1
        item.appSortVal = _.indexOf(appIds, item.id) + 1

        item.wxName = _.findWhere(_vue.channelData.wx, {id: item.id}).wxName
        item.appName = _.findWhere(_vue.channelData.app, {id: item.id}).appName

        item.wxDisplay = _.findWhere(_vue.channelData.wx, {id: item.id}).wxDisplay
        item.appDisplay = _.findWhere(_vue.channelData.app, {id: item.id}).appDisplay

        _vue.mergeDataList.push(item)
      })
    },
    view (row) {
      // 查看对应新闻
      this.$router.push({
        path: '/news/content/check',
        query: {
          channelId: row.id
        }
      })
    },
    edit (row, type) {
      // 编辑名称
      let _vue = this
      _vue.editChannelForm.id = row.id
      _vue.editChannelForm.description = row.description || ''

      if (type === 1) {
        _vue.editChannelForm.name = row.pcName
        _vue.editChannelForm.display = row.pcDisplay
      }
      if (type === 2) {
        _vue.editChannelForm.name = row.wxName
        _vue.editChannelForm.display = row.wxDisplay
      }
      if (type === 3) {
        _vue.editChannelForm.name = row.appName
        _vue.editChannelForm.display = row.appDisplay
      }
      _vue.curChannel = row
      _vue.curType = type
      _vue.showEditDialog = true
    },
    remove (row, type) {
      // 移除
      let _vue = this
      _vue.showRemoveDialog = true
      _vue.curChannel = row
      _vue.curType = type
    },
    confirmRemove () {
      let _vue = this
      _vue.channelData.pc = _.filter(_vue.channelData.pc, (item) => {
        return item.id !== _vue.curChannel.id
      })
      _vue.channelData.wx = _.filter(_vue.channelData.wx, (item) => {
        return item.id !== _vue.curChannel.id
      })
      _vue.channelData.app = _.filter(_vue.channelData.app, (item) => {
        return item.id !== _vue.curChannel.id
      })
      _vue.showRemoveDialog = false
    },
    confirmEdit () {
      let _vue = this
      if (_vue.curType === 1) {
        console.log(_vue.channelData.pc)
        _.each(_vue.channelData.pc, (item, index) => {
          if (item.id === _vue.curChannel.id) {
            let channel = _vue.channelData.pc.splice(index, 1)[0]
            channel.pcName = _vue.editChannelForm.name
            channel.description = _vue.editChannelForm.description
            channel.pcDisplay = _vue.editChannelForm.display

            _vue.channelData.pc.splice(index, 0, channel)
          }
        })
      } else if (_vue.curType === 2) {
        _.each(_vue.channelData.wx, (item, index) => {
          if (item.id === _vue.curChannel.id) {
            let channel = _vue.channelData.wx.splice(index, 1)[0]
            channel.wxName = _vue.editChannelForm.name
            channel.description = _vue.editChannelForm.description
            channel.wxDisplay = _vue.editChannelForm.display

            _vue.channelData.wx.splice(index, 0, channel)
          }
        })
      } else if (_vue.curType === 3) {
        _.each(_vue.channelData.app, (item, index) => {
          if (item.id === _vue.curChannel.id) {
            let channel = _vue.channelData.app.splice(index, 1)[0]
            channel.appName = _vue.editChannelForm.name
            channel.description = _vue.editChannelForm.description
            channel.appDisplay = _vue.editChannelForm.display

            _vue.channelData.app.splice(index, 0, channel)
          }
        })
      }
      _.findWhere(_vue.channelData.pc, {id: _vue.curChannel.id}).description = _vue.editChannelForm.description
      _.findWhere(_vue.channelData.wx, {id: _vue.curChannel.id}).description = _vue.editChannelForm.description
      _.findWhere(_vue.channelData.app, {id: _vue.curChannel.id}).description = _vue.editChannelForm.description
      _vue.showEditDialog = false
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
  .text-link {
    display: inline-block;
    padding-right: 5px;
  }
  .main-tip {
    margin-bottom: 10px;
    text-align: center;
    font-size: 18px;

    .name {
      color: red;
      display: inline-block;
      padding-right: 5px;
    }
  }
  .sub-tip {
    margin-bottom: 20px;
    font-size: 15px;

    .name {
      color: red;
      display: inline-block;
      padding-right: 5px;
    }
  }
</style>
