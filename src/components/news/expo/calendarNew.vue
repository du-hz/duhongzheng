<template>
  <div>
    <div class="main-line-title">{{id === '' ? '新建日历' : '编辑日历'}}</div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="活动名称" required>
        <el-input v-model="form.activityName" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="form.createTime">
          <p>创建时间：{{form.createTime | filterDateformat}}</p>
        </div>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-date-picker
          v-model="form.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="pickerOptions"
          placeholder="请选择活动开始时间">
        </el-date-picker>
        <!-- -
        <el-date-picker
          v-model="form.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择活动结束时间">
        </el-date-picker> -->
      </el-form-item>
      <el-form-item label="关联活动">
        <el-select
          style="width: 100%"
          v-model="tagArr.name"
          filterable
          remote
          clearable
          reserve-keyword
          default-first-option
          :multiple-limit="5"
          placeholder="请输入展会ID/展会标题"
          @change ="changeTag"
          :remote-method="remoteSeminarId">
          <el-option
            v-for="item in tagsOpts"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示" required>
        <el-radio-group v-model="form.display">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveCalendar">保存</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  name: 'guestNew',
  data () {
    let myDate = new Date()
    return {
      pickerOptions: {
        disabledDate (time) {
          let startyear = myDate.getFullYear() - 1
          let endyear = myDate.getFullYear() + 1
          let enddate = endyear + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
          let startdate = startyear + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
          let endDate = new Date(enddate)
          let startDate = new Date(startdate)
          return time.getTime() > endDate || time.getTime() < startDate
        },
        onPick ({minDate, maxDate}) {
          myDate = minDate
        }
      },
      id: (this.$route.query && this.$route.query.id) || '',
      tagsOpts: [],
      form: {
        startTime: '',
        endTime: '',
        activityName: '',
        display: 1,
        createTime: ''
      },
      tagArr: {name: '', id: ''}
    }
  },
  computed: {
  },
  mounted () {
    if (this.id) {
      this.getDetail()
    } else {
      if (window.sessionStorage.getItem('calendarObjDetail')) {
        let fromData = window.sessionStorage.getItem('calendarObjDetail')
        this.form = JSON.parse(fromData)
      }
    }
  },
  created () {
  },
  methods: {
    remoteSeminarId (query) { // 获取关联活动id
      console.log('联想获取关联活动id')
      let _vue = this
      _vue.$http.get('/api/v1.0/expo/expo/expo_list?page=1&per_page=20&text=' + query).then((response) => {
        if (response.data.data.rows.length > 0) {
          _vue.tagsOpts = _.sortBy(response.data.data.rows, 'id')
        } else {
          _vue.tagsOpts = []
        }
        // _vue.tagsOpts = response.data.data.rows.filter(item => {
        //   return item.title.toLowerCase()
        //     .indexOf(query.toLowerCase()) > -1
        // })
        console.log('_vue.tagsOpts-----------')
        console.log(_vue.tagsOpts)
      })
    },
    changeTag (e) {
      console.log('===========')
      console.log(e)
      this.tagArr.id = e
    },
    saveCalendar () {
      // 保存日历信息
      let _vue = this
      if (!this.form.activityName) {
        this.$message.warning('活动名称不得为空')
        return
      } else if (!this.form.startTime) {
        this.$message.warning('活动开始时间不得为空')
        return
      }
      let data = {
        title: this.form.activityName,
        seminarId: this.tagArr.id,
        calendarStartTime: this.form.startTime,
        // calendarEndTime: this.form.endTime,
        isShow: this.form.display
      }
      console.log(data)
      if (this.id) {
        _vue.$http.put(`/api/v1.0/expo/calendar/${_vue.id}/calendars`, data).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.$router.push({
            path: '/news/expo/calendar'
          })
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      } else {
        let url = '/api/v1.0/expo/calendar/calendars'
        _vue.$http.post(url, data).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.$router.push({
            path: '/news/expo/calendar'
          })
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    cancelOperate () {
      if (!this.id) {
        window.sessionStorage.setItem('calendarObjDetail', JSON.stringify(this.form))
      }
      // 取消返回
      this.$router.push({
        path: '/news/expo/calendar'
      })
    },
    getDetail () {
      this.$http.get(`/api/v1.0/expo/calendar/calendars/${this.id}/filter`).then((res) => {
        console.log(res)
        let data = res.data.data
        if (data) {
          this.form.startTime = data.startTime || ''
          // this.form.endTime = data.endTime || ''
          this.form.activityName = data.title || ''
          this.form.createTime = data.createTime || ''
          this.form.display = data.isShow === 0 ? 0 : 1
          this.tagArr = {name: data.seminarTitle, id: data.seminarId}
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
  .upload-image {
    &.cover-img {
      max-width: 200px;
      max-height: 200px;
    }
    &.share-img {
      max-width: 200px;
      max-height: 200px;
    }
  }
  .image-pick-wrap {
    margin-top: 20px;
    .radio-item {
      margin-top: 10px;
    }
  }
  .news-list {
    .list-search-wrap {
      margin-bottom: 20px;
      border-bottom: none;
    }
  }
  .action-icon {
    font-size: 18px;
    cursor: pointer;
  }
  .topic-related-container {
    > .el-row {
      margin: 0 !important;
    }
  }
</style>
