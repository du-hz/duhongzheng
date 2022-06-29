<template>
  <div>
    <el-dialog
      class="projectmodify"
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="close"
      width="1200px"
      top="40px">
      <el-form ref="infoForm" :model="form" :rules="rules" label-width="70px" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户方" label-width="80px" prop="customer">
              <el-input v-model="form.customer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="项目城市" label-width="80px" prop="city">
              <el-input v-model="form.city"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" label-width="80px" prop="projectName">
              <el-input v-model="form.projectName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目负责人" label-width="100px" prop="leader">
              <el-select
                v-model="form.leader"
                filterable
                clearable
                remote
                placeholder="请输入负责人姓名"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="(value) => changeLeader(value)">
                <el-option
                  v-for="item in leaderOptions"
                  :key="item.id"
                  :label="item.id + '-' + item.name + '-' + item.post"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目负责人电话" label-width="110px">
              <el-input v-model="form.leaderMobile" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目负责人邮箱" label-width="110px">
              <el-input v-model="form.leaderEmail" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户方联系人" label-width="110px" prop="cusLeaderName">
              <el-input v-model="form.cusLeaderName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="客户方联系人电话" label-width="140px" prop="cusLeaderMobile">
              <el-input v-model="form.cusLeaderMobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="客户方联系人邮箱" label-width="140px" prop="cusLeaderEmail">
              <el-input v-model="form.cusLeaderEmail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="Foundry" label-width="70px" prop="supplierId">
              <el-select v-model="form.supplierId" clearable filterable placeholder="请选择" @focus="getSupplierInfo()">
                <el-option
                  v-for="item in info.foundry"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="节点" label-width="50px" prop="node">
              <el-select v-model="form.node" clearable filterable placeholder="请选择" @focus="getNodeInfo()">
                <el-option
                  v-for="item in info.nodes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="工艺" label-width="50px" prop="craft">
              <el-select v-model="form.craft" clearable filterable placeholder="请选择" @focus="getCraftInfo()">
                <el-option
                  v-for="item in info.technology"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="产品方向" label-width="80px" prop="proDirId">
              <el-select v-model="form.proDirId" clearable placeholder="请选择">
                <el-option
                  v-for="item in info.prodir"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="备注" label-width="60px" prop="note">
              <el-input v-model="form.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="项目时间" label-width="90px" prop="projectTime">
              <el-date-picker
                v-model="form.projectTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="isCustomerNeed">
              <el-checkbox v-model="form.isCustomerNeed">无需客户评价</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button type="primary" @click="onSubmit('infoForm')">{{buttonName}}</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from '../../../assets/js/global'
import moment from 'moment'

export default {
  componentName: 'TeamModify',
  props: ['form', 'editType'],
  data () {
    return {
      dialogVisible: false,
      title: '新增项目',
      buttonName: '立即修改',
      info: {
        foundry: [],
        technology: [],
        nodes: [],
        prodir: []
      },
      leaderOptions: [],
      loading: false,
      rules: {
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请填写项目城市', trigger: 'blur' }
        ],
        customer: [
          { required: true, message: '请填写客户方', trigger: 'blur' }
        ],
        leader: [
          { required: true, message: '请填写项目负责人', trigger: 'blur, change' }
        ],
        cusLeaderName: [
          { required: true, message: '请填写客户方联系人', trigger: 'blur' }
        ],
        cusLeaderMobile: [
          { required: true, message: '请填写客户方联系人电话', trigger: 'blur' },
          {pattern: Global.REGEX.MOBILE, message: '请检查客户方联系人电话', trigger: 'blur'}
        ],
        cusLeaderEmail: [
          { required: true, message: '请填写客户方联系人邮箱', trigger: 'blur' },
          {pattern: Global.REGEX.EMAIL, message: '请检查客户方联系人邮箱格式', trigger: 'blur'}
        ],
        supplierId: [
          { required: true, message: '请选择Foundry', trigger: 'blur, change' }
        ],
        craft: [
          { required: true, message: '请选择工艺', trigger: 'blur, change' }
        ],
        node: [
          { required: true, message: '请选择节点', trigger: 'blur, change' }
        ],
        proDirId: [
          { required: true, message: '请选择产品方向', trigger: 'blur, change' }
        ],
        projectTime: [
          { required: true, message: '请选择项目时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    editType: function (val, oldVal) {
      let _vue = this
      _vue.title = val === 1 ? '新增项目' : '修改项目'
      _vue.buttonName = val === 1 ? '立即保存' : '立即修改'
    },
    dialogVisible: function (val, oldVal) {
      if (val === true) {
        let _vue = this
        _vue.getInfo()
      }
    }
  },
  methods: {
    getInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/order/tapeout/select?supplierId=' + _vue.form.supplierId + '&craft=' + _vue.form.craft + '&node=' + _vue.form.node)
        .then(function (response) {
          _vue.info.foundry = response.data.data.foundry
          _vue.info.technology = response.data.data.crafts
          _vue.info.nodes = response.data.data.node
          _vue.info.prodir = Global.proDir()
        })
    },
    getSupplierInfo () {
      let _vue = this
      _vue.info.foundry = []
      _vue.$http.get('/api/v1.0/order/tapeout/select?supplierId=&craft=' + _vue.form.craft + '&node=' + _vue.form.node)
        .then(function (response) {
          _vue.info.foundry = response.data.data.foundry
        })
    },
    getCraftInfo () {
      let _vue = this
      _vue.info.technology = []
      _vue.$http.get('/api/v1.0/order/tapeout/select?supplierId=' + _vue.form.supplierId + '&craft=&node=' + _vue.form.node)
        .then(function (response) {
          _vue.info.technology = response.data.data.crafts
        })
    },
    getNodeInfo () {
      let _vue = this
      _vue.info.nodes = []
      _vue.$http.get('/api/v1.0/order/tapeout/select?supplierId=' + _vue.form.supplierId + '&craft=' + _vue.form.craft + '&node=')
        .then(function (response) {
          _vue.info.nodes = response.data.data.node
        })
    },
    onSubmit (formName) {
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          let jsonData = {
            'proName': _vue.form.projectName,
            'proCity': _vue.form.city,
            'customer': _vue.form.customer,
            'leaderId': _vue.form.leaderId,
            'cusLeaderName': _vue.form.cusLeaderName,
            'cusLeaderMobile': _vue.form.cusLeaderMobile,
            'custLeaderEmail': _vue.form.cusLeaderEmail,
            'proDir': _vue.form.proDirId,
            'supplie': _vue.form.supplierId,
            'node': _vue.form.node,
            'note': _vue.form.note,
            'craft': _vue.form.craft,
            'start': moment(_vue.form.projectTime[0]).format('YYYY-MM-DD'),
            'end': moment(_vue.form.projectTime[1]).format('YYYY-MM-DD'),
            'isCustomerNeed': _vue.form.isCustomerNeed
          }
          if (_vue.form.id === '') {
            _vue.$http.post('/api/v1.0/perf/project/', jsonData)
              .then(function () {
                _vue.$message({
                  message: '恭喜您，信息提交成功',
                  type: 'success'
                })
                _vue.$emit('refreshbizlines')
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
            _vue.$http.put('/api/v1.0/perf/project/' + _vue.form.id, jsonData)
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
      })
    },
    close () {
      this.$refs['infoForm'].clearValidate()
      this.dialogVisible = false
      if (this.title !== '新增项目') {
        this.$emit('refreshbizlines')
      }
    },
    cancel () {
      this.$refs['infoForm'].clearValidate()
      this.dialogVisible = false
      this.$emit('refreshbizlines')
    },
    remoteMethod (query) {
      let _vue = this
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          let projectId = _vue.form.id === undefined ? '' : _vue.form.id
          _vue.$http.get('/api/v1.0/perf/engineer?page=1&size=300&name=' + query + '&projectId=' + projectId).then(response => {
            this.leaderOptions = response.data.data.rows
          })
        }, 100)
      } else {
        this.leaderOptions = []
      }
    },
    changeLeader (value) {
      let _vue = this
      _vue.leaderOptions.forEach(elem => {
        if (elem.id === value) {
          _vue.form.leaderMobile = elem.mobile
          _vue.form.leaderId = elem.id
          _vue.form.leaderEmail = elem.email
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .projectmodify{
    & .el-row {
      margin-bottom: 5px;
    }

    & .el-input.is-disabled {
      & .el-input__inner{
        background-color: #fcfcfc;
      }
    }

    & .el-input.is-disabled .el-input__inner{
      color: #777;
    }
  }

</style>
