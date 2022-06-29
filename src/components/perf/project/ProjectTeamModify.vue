<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="close"
      class="teammodify"
      width="1100px">
      <el-form class="teamTable" label-width="70px" label-position="left" ref="infoForm" :model="formField" :rules="rules" v-for="(formField, index) in form" v-bind:key="formField.key">
        <el-row>
          <el-col :span="7">
            <el-form-item label="成员姓名" label-width="80px" prop="name">
              <el-select
                v-model="formField.name"
                filterable
                clearable
                remote
                placeholder="请输入姓名"
                :remote-method="remoteMethod"
                :loading="loading"
                :disabled="editType === 1 ? false : true"
                @change="(value) => changeTeam(value, index)">
                <el-option
                  v-for="item in teamOptions"
                  :key="item.id"
                  :label="item.id + '-' + item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-form-item label="性别" label-width="40px">
              <el-input v-model="formField.sex" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="职位" label-width="40px">
              <el-input v-model="formField.post" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="工作年限" label-width="70px">
              <el-input :value="formField.workingYear + '年'" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成员参与时间" label-width="115px" prop="projectTime">
              <el-date-picker
                v-model="formField.projectTime"
                type="daterange"
                range-separator="至"
                start-placeholder="加入日期"
                end-placeholder="离开日期"
                :picker-options="pickerOptions"
                :onPick="joinProjectList(index)">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="1">
            <el-form-item label="参与项目" label-width="70px">
              <el-input v-model="formField.stat" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" align="right" v-if="form.length > 1">
            <el-button type="danger" @click="delItem(index)" size="middle">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="add" v-if="editType == 1" align="center">
        <i class="el-icon-circle-plus"  align="center" @click="addForm('infoForm')" style="font-size: 25px; cursor: pointer"></i>
      </div>
      <div class="btnArea"  align="center">
        <el-button type="primary" @click="onSubmit('infoForm')">{{buttonName}}</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  componentName: 'TeamModify',
  props: ['form', 'editType', 'projectData'],
  data () {
    return {
      dialogVisible: false,
      teamOptions: '',
      loading: false,
      title: '新增项目成员',
      buttonName: '立即新增',
      rules: {
        name: [
          { required: true, message: '请填写项目名称', trigger: 'blur, change' }
        ],
        projectTime: [
          { required: true, message: '请选择项目时间', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return true
        }
      }
    }
  },
  watch: {
    editType: function (val, oldVal) {
      let _vue = this
      _vue.title = val === 1 ? '新增项目成员' : '修改项目成员'
      _vue.buttonName = val === 1 ? '立即新增' : '立即修改'
      _vue.pickerOptions = {
        disabledDate (time) {
          return time.getTime() < _vue.projectData.start || time.getTime() > _vue.projectData.end
        }
      }
      if (val === 2) {
        this.joinProjectList(0)
      }
    }
  },
  methods: {
    onSubmit (formName) {
      let _vue = this
      let errorcount = 0
      let jsonData = {
        'members': []
      }
      _vue.$refs[formName].forEach((obj, index) => {
        obj.validate((valid) => {
          if (!valid) {
            errorcount += 1
          } else {
            let member = {
              'engineerId': obj.model.id,
              'start': moment(obj.model.projectTime[0]).format('YYYY-MM-DD'),
              'end': moment(obj.model.projectTime[1]).format('YYYY-MM-DD')
            }
            jsonData.members.push(member)
          }
        })
      })
      if (errorcount === 0) {
        if (_vue.editType === 1) {
          _vue.$http.post('/api/v1.0/perf/project/' + _vue.$parent.projectData.id + '/engineer', jsonData)
            .then(function () {
              _vue.$message({
                message: '恭喜您，信息提交成功',
                type: 'success'
              })
              _vue.close()
            })
            .catch(function () {
              _vue.$message({
                type: 'error',
                message: '信息提交失败，请稍后重试',
                center: true,
                showClose: true
              })
            })
        } else {
          _vue.$http.put('/api/v1.0/perf/project/' + _vue.$parent.projectData.id + '/engineer', jsonData)
            .then(function () {
              _vue.$message({
                message: '恭喜您，信息提交成功',
                type: 'success'
              })
              _vue.close()
            })
            .catch(function () {
              _vue.$message({
                type: 'error',
                message: '信息提交失败，请稍后重试',
                center: true,
                showClose: true
              })
            })
        }
      }
    },
    close () {
      this.$refs['infoForm'].forEach((obj, index) => {
        obj.clearValidate()
      })
      this.dialogVisible = false
      this.$emit('refreshbizlines')
    },
    remoteMethod (query) {
      let _vue = this
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          let projectId = _vue.$parent.projectData.id
          _vue.$http.get('/api/v1.0/perf/engineer?page=1&size=300&name=' + query + '&projectId=' + projectId).then(response => {
            let hasChoice = []
            this.teamOptions = []
            _vue.form.forEach(elem => {
              if (elem.id !== undefined) {
                hasChoice.push(elem.id)
              }
            })
            let teamOptions = response.data.data.rows
            teamOptions.forEach((elem, index) => {
              if (hasChoice.indexOf(elem.id) === -1) {
                this.teamOptions.push(elem)
              }
            })
          })
        }, 100)
      } else {
        this.teamOptions = []
      }
    },
    changeTeam (value, index) {
      let _vue = this
      _vue.teamOptions.forEach(elem => {
        if (elem.name === value) {
          _vue.form[index].sex = elem.sex
          _vue.form[index].id = elem.id
          _vue.form[index].workingYear = elem.workingYear
          _vue.form[index].post = elem.post
          _vue.joinProjectList(index)
        }
      })
    },
    joinProjectList (val) {
      let _vue = this
      let form = _vue.form[val]
      let pstatus = []
      let status = ''
      if (form.id && form.projectTime && form.projectTime.length > 1 && form.id !== '') {
        let startTime = moment(form.projectTime[0]).format('YYYY-MM-DD')
        let endTime = moment(form.projectTime[1]).format('YYYY-MM-DD')
        _vue.$http.get('/api/v1.0/perf/engineer/' + form.id + '?start=' + startTime + '&end=' + endTime).then(response => {
          pstatus = response.data.data.projects
          if (pstatus.length > 0) {
            if (pstatus.length > 1) {
              status = pstatus[0] + '等' + pstatus.length + '个'
            } else {
              status = pstatus[0]
            }
            form.stat = status
          } else {
            form.stat = ''
          }
        })
      }
    },
    addForm (formName) {
      let _vue = this
      let errorcount = 0
      _vue.$refs[formName].forEach((obj, index) => {
        obj.validate((valid) => {
          if (!valid) {
            errorcount += 1
          }
        })
      })
      if (errorcount === 0) {
        this.form.push({
          'name': '',
          'sex': '',
          'post': '',
          'workingYear': '',
          'projectTime': [],
          'status': '',
          'stat': '',
          'key': Date.now()
        })
      }
    },
    delItem (index) {
      let _vue = this
      _vue.form.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
  .teammodify {
    & .el-row {
      margin-bottom: 5px;
    }

    & .teamTable {
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }

    & .el-input.is-disabled {
      & .el-input__inner{
        background-color: #fcfcfc;
      }
    }

    & .add{
      margin-bottom: 30px;
    }

    & .el-input.is-disabled .el-input__inner{
      color: #777;
    }
  }
</style>
