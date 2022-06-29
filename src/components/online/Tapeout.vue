<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-row class="form-row">
          <el-form-item label="生产形式" prop="tapeoutPlan">
            <el-select v-model="searchForm.tapeoutPlan" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="MPW(摩尔班车)" value="1"></el-option>
              <el-option label="MPW" value="2"></el-option>
              <el-option label="Full Mask" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-form-item prop="startCreateTime">
              <el-date-picker
                v-model="searchForm.startCreateTime"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
            <span style="padding-right: 10px;">至</span>
            <el-form-item prop="endCreateTime">
              <el-date-picker
                v-model="searchForm.endCreateTime"
                value-format="yyyy-MM-dd"
                placeholder="结束日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="工厂名称" prop="supplierId">
            <el-select v-model="searchForm.supplierId" filterable clearable placeholder="请选择" @change="fetchFilterData('supplier')" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点" prop="node">
            <el-select v-model="searchForm.node" filterable clearable placeholder="请选择" @change="fetchFilterData('node')" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工艺" prop="craft">
            <el-select v-model="searchForm.craft" filterable clearable placeholder="请选择" @change="fetchFilterData('craft')" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in craftOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button type="primary" @click="reset('searchForm')">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="list-header-action-wrap">
      <el-button type="primary" @click="addTapeout">新增</el-button>
    </div>
    <el-table
      header-row-class-name="tableheader"
      border
      style="width: 100%;"
      :data="tableData">
      <el-table-column
        type="index"
        label="序号"
        width="50px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tapeoutPlan"
        label="形式"
        width="140px"
        align="center">
        <template slot-scope="scope">
          {{scope.row.tapeoutPlan | filterPlanform}}
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="代工厂"
        min-width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="node"
        label="节点"
        min-width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="craft"
        label="工艺"
        min-width="140px"
        align="center">
      </el-table-column>
      <el-table-column
        label="GDS提交时间"
        width="160px"
        align="center">
        <template slot-scope="scope">
          {{scope.row.cutoffTime | filterDateformat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="预定客户数"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="150px"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="showTapeoutInfo(scope.row)">查看</el-button>
          <el-button
            size="small"
            type="primary"
            plain
            @click="editTapeoutInfo(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.size"
        @current-change="handleCurrentChangeOne">
      </el-pagination>
    </div>

    <!--新增编辑流片-->
    <el-dialog :title="dialogSyncTitle" :visible.sync="showAddTapeout" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="tapeoutForm" :rules="rules" ref="tapeoutForm" style="width: 80%;">
        <el-form-item label="生产类型" :label-width="formLabelWidth" prop="tapeoutPlan">
          <el-select v-model="tapeoutForm.tapeoutPlan" placeholder="请选择生产类型" style="width: 100%;">
            <el-option label="MPW(摩尔班车)" value="1"></el-option>
            <el-option label="MPW" value="2"></el-option>
            <el-option label="Full Mask" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代工厂" :label-width="formLabelWidth" prop="supplierId">
          <el-select v-model="tapeoutForm.supplierId" filterable clearable placeholder="请选择代工厂" @change="fetchFilterData('supplier')" style="width: 100%;">
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点" :label-width="formLabelWidth" prop="node">
          <el-select v-model="tapeoutForm.node" filterable clearable placeholder="请选择节点" @change="fetchFilterData('node')" style="width: 100%;">
            <el-option
              v-for="item in nodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺" :label-width="formLabelWidth" prop="craft">
          <el-select v-model="tapeoutForm.craft" filterable clearable placeholder="请选择工艺" @change="fetchFilterData('craft')" style="width: 100%;">
            <el-option
              v-for="item in craftOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="GDS提交时间" :label-width="formLabelWidth" prop="cutoffTime">
          <el-date-picker
            v-model="tapeoutForm.cutoffTime"
            type="date"
            placeholder="GDS提交时间"
            value-format="yyyy-MM-dd"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="价格：" :label-width="formLabelWidth" v-if="tapeoutForm.tapeoutPlan === '1'">
        </el-form-item>
        <el-form-item v-if="tapeoutForm.tapeoutPlan === '1'">
          <!-- 自定义拼团人数 -->
          <el-form :inline="true" class="interval-form">
            <el-button class="add-btn" type="primary" size="small" @click="addInterval">+Add</el-button>
            <el-row v-for="(interval, index) in tapeoutForm.priceInterval" :key="index">
              <el-col :span="12">
                <el-form-item label="" prop="minCt">
                  <el-input v-model="interval.minCt" class="interval-input count"></el-input>
                </el-form-item>
                <span class="split"> - </span>
                <el-form-item label="" prop="maxCt">
                  <el-input v-model="interval.maxCt" class="interval-input count"></el-input>
                </el-form-item>
                <span>人拼团</span>
              </el-col>
              <el-col :span="10">
                <el-form-item label="价格" prop="price">
                  <el-input v-model="interval.price" class="interval-input price"></el-input>
                  <span>美元</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="action-wrap" title="删除" @click="removeInterval(index)" v-if="tapeoutForm.priceInterval.length > 1">
                  <i class="el-icon-delete"></i>
                </div>
              </el-col>
            </el-row>
            <div class="price-tip">价格区间说明：<br/>1. 请确保价格区间拼团人数的连续性，如：1-5人，6-8人，等<br/>
              2. 最后一个价格区间的最大人数不需要填写，提交时会自动忽略，表示大于等于最少人数的价格区间；如：最后一个价格区间填写最少人数16，表示16人及以上的价格<br/>
              3. 如果价格待定，则价格不需填写
            </div>
          </el-form>
        </el-form-item>
        <div class="action-wrap">
          <el-button @click="closeTapeout('tapeoutForm')">取消</el-button>
          <el-button type="primary" @click="submitTapeout('tapeoutForm')">提交</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--查看流片-->
    <el-dialog title="流片展示信息" :visible.sync="showTapeoutInfoDialog" class="tapeout-info">
      <el-form :model="tapeoutInfo">
        <el-form-item label="创建时间：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.createTime}}</span>
        </el-form-item>
        <el-form-item label="生产类型：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.tapeoutPlan | filterPlanform}}</span>
        </el-form-item>
        <el-form-item label="代工厂：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.supplierName}}</span>
        </el-form-item>
        <el-form-item label="节点：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.node}}</span>
        </el-form-item>
        <el-form-item label="工艺：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.craft}}</span>
        </el-form-item>
        <el-form-item label="GDS提交时间：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.cutoffTime | filterDateformat}}</span>
        </el-form-item>
        <el-form-item label="预定客户数：" :label-width="formLabelWidth">
          <span>{{tapeoutInfo.orderCount}}</span>
        </el-form-item>
        <el-form-item label="价格：" :label-width="formLabelWidth" v-if="tapeoutForm.tapeoutPlan === '1'">
        </el-form-item>
        <el-form-item v-if="tapeoutForm.tapeoutPlan === '1'">
          <el-form :inline="true" class="interval-form">
            <el-row v-for="(interval, index) in tapeoutForm.priceInterval" :key="index">
              <template v-if="index < tapeoutForm.priceInterval.length - 1">
                <el-col :span="12">
                  <el-form-item label="" prop="interval.minCt">
                    <span>{{interval.minCt}}</span>
                  </el-form-item>
                  <span class="split"> - </span>
                  <el-form-item label="" prop="interval.maxCt">
                    <span>{{interval.maxCt}}</span>
                  </el-form-item>
                  <span>人拼团</span>
                </el-col>
              </template>
              <template v-if="index === tapeoutForm.priceInterval.length - 1">
                <el-col :span="12">
                  <span>{{interval.minCt}}人及以上拼团</span>
                </el-col>
              </template>
              <el-col :span="10">
                <el-form-item label="价格:" prop="interval.maxCt">
                  <span>{{interval.price}}</span>
                  <span>美元</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
              </el-col>
            </el-row>
          </el-form>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    var _vue = this
    return {
      searchForm: {
        tapeoutPlan: '',
        startCreateTime: '',
        endCreateTime: '',
        supplierId: '',
        node: '',
        craft: ''
      },
      pager: {
        curPage: 1,
        size: 20
      },
      tableData: [],
      totalNum: 0,
      supplierOptions: [],
      nodeOptions: [],
      craftOptions: [],
      tapeoutForm: {
        tapeoutPlan: '',
        supplierId: '',
        node: '',
        craft: '',
        cutoffTime: '',
        priceInterval: [{
          minCt: 1,
          maxCt: '',
          price: ''
        }] // minCt maxCt price  最小区间，最大区间，价格
      },
      showTapeoutInfoDialog: false,
      tapeoutInfo: {
        tapeoutPlan: '',
        supplierName: '',
        node: '',
        craft: '',
        cutoffTime: '',
        priceInterval: [],
        createTime: '',
        orderCount: 0
      },
      orderNo: '', // 区分是新增还是编辑
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (_vue.endTime !== '' && _vue.endTime !== null) {
            return time.getTime() > Date.now() || time.getTime() > new Date(_vue.endTime.replace(/-/g, '/'))
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (_vue.startTime !== '' && _vue.startTime !== null) {
            return time.getTime() < new Date(_vue.startTime.replace(/-/g, '/')) || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerFormEnd: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      },
      showAddTapeout: false,
      dialogSyncTitle: '新增',
      dialogShowRespin: false,
      formLabelWidth: '140px',
      rules: {
        tapeoutPlan: [
          { required: true, message: '请选择生产类型', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请选择代工厂', trigger: 'change' }
        ],
        node: [
          { required: true, message: '请选择节点', trigger: 'change' }
        ],
        craft: [
          { required: false, message: '请选择工艺', trigger: 'change' }
        ],
        cutoffTime: [
          { required: true, message: '请选择GDS提交时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.fetchFilterData()
    this.fetchTapeout()
  },
  methods: {
    fetchFilterData () {
      let _vue = this
      let reqUrl = Global.CONFIG.WEB_SERVER_URL + '/api/v1/supplier/crafts?type=1'
      reqUrl += '&supplier=' + _vue.tapeoutForm.supplierId
      reqUrl += '&node=' + _vue.tapeoutForm.node
      reqUrl += '&craft=' + _vue.tapeoutForm.craft
      _vue.$http.get(reqUrl).then(response => {
        if (_vue.tapeoutForm.supplierId === '') _vue.supplierOptions = response.data.data.supplier
        if (_vue.tapeoutForm.node === '') _vue.nodeOptions = response.data.data.node
        if (_vue.tapeoutForm.craft === '') _vue.craftOptions = response.data.data.craft
      })
    },
    fetchTapeout () {
      let _vue = this
      _vue.$http.get('/api/v1.0/order/tapeout/online/list?tapeout_plan=' + _vue.searchForm.tapeoutPlan +
          '&start_create_time=' + _vue.searchForm.startCreateTime +
        '&end_create_time=' + _vue.searchForm.endCreateTime +
        '&supplier_id=' + _vue.searchForm.supplierId +
        '&node=' + _vue.searchForm.node +
        '&craft=' + _vue.searchForm.craft +
        '&page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size
      ).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    search () {
      this.pager.curPage = 1
      this.fetchTapeout()
    },
    reset (formName) {
      this.$refs[formName].resetFields()
      this.pager.curPage = 1
      this.fetchTapeout()
    },
    addTapeout () {
      // tapeoutForm信息初始化
      this.tapeoutForm = {
        tapeoutPlan: '',
        supplierId: '',
        node: '',
        craft: '',
        cutoffTime: '',
        priceInterval: [{
          minCt: 1,
          maxCt: '',
          price: ''
        }]
      }
      this.orderNo = ''
      this.showAddTapeout = true
      this.dialogSyncTitle = '新增流片信息'
    },
    submitTapeout (formName) {
      // 表单验证
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          if (_vue.orderNo === '') {
            if (_vue.validatePriceInterval()) {
              _vue.$http.post('/api/v1.0/order/tapeout/online', {
                tapeoutPlan: _vue.tapeoutForm.tapeoutPlan,
                supplierId: _vue.tapeoutForm.supplierId,
                node: _vue.tapeoutForm.node,
                craft: _vue.tapeoutForm.craft,
                cutoffTime: _vue.tapeoutForm.cutoffTime,
                priceInterval: _vue.cvrtIntervalCount(_vue.tapeoutForm.priceInterval)
              }).then(() => {
                _vue.$message({
                  type: 'success',
                  message: '新增成功',
                  center: true
                })
                _vue.showAddTapeout = false
                this.$refs['searchForm'].resetFields()
                _vue.pager.curPage = 1
                _vue.fetchTapeout()
              }).catch(() => {
                _vue.$message({
                  type: 'error',
                  message: '请稍后重试',
                  center: true
                })
              })
            }
          } else {
            if (_vue.validatePriceInterval()) {
              _vue.$http.put('/api/v1.0/order/tapeout/online', {
                orderNo: _vue.orderNo,
                tapeoutPlan: _vue.tapeoutForm.tapeoutPlan,
                supplierId: _vue.tapeoutForm.supplierId,
                node: _vue.tapeoutForm.node,
                craft: _vue.tapeoutForm.craft,
                cutoffTime: _vue.tapeoutForm.cutoffTime,
                priceInterval: _vue.cvrtIntervalCount(_vue.tapeoutForm.priceInterval)
              }).then(() => {
                _vue.$message({
                  type: 'success',
                  message: '编辑成功',
                  center: true
                })
                _vue.showAddTapeout = false
                _vue.fetchTapeout()
              }).catch(() => {
                _vue.$message({
                  type: 'error',
                  message: '请稍后重试',
                  center: true
                })
              })
            }
          }
        }
      })
    },
    closeTapeout (formName) {
      this.showAddTapeout = false
      this.$refs[formName].resetFields()
    },
    handleCurrentChangeOne: function (val) {
      this.pager.curPage = val
      this.fetchTapeout()
    },
    showTapeoutInfo (data) {
      // 查看流片信息
      let _vue = this
      _vue.orderNo = data.orderNo
      _vue.$http.get('/api/v1.0/order/tapeout/online?order_no=' + _vue.orderNo).then((response) => {
        _vue.tapeoutInfo = response.data.data.tapeout
        _vue.showTapeoutInfoDialog = true
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editTapeoutInfo (data) {
      // 编辑流片信息
      let _vue = this
      _vue.orderNo = data.orderNo
      _vue.$http.get('/api/v1.0/order/tapeout/online?order_no=' + _vue.orderNo).then((response) => {
        let result = response.data.data.tapeout
        _vue.tapeoutForm.tapeoutPlan = result.tapeoutPlan + ''
        _vue.tapeoutForm.supplierId = result.supplierId
        _vue.tapeoutForm.node = result.node
        _vue.tapeoutForm.craft = result.craft
        _vue.tapeoutForm.cutoffTime = result.cutoffTime
        _vue.tapeoutForm.priceInterval = result.priceInterval
        // 如果没有任何区间，填充一个价格区间
        if (_vue.tapeoutForm.priceInterval.length === 0) {
          _vue.tapeoutForm.priceInterval.push({
            minCt: 1,
            maxCt: '',
            price: ''
          })
        }
        _vue.showAddTapeout = true
        _vue.dialogSyncTitle = '编辑流片信息'
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    addInterval () {
      // 添加价格区间
      if (this.tapeoutForm.priceInterval.length <= 9) {
        this.tapeoutForm.priceInterval.push({
          minCt: '',
          maxCt: '',
          price: ''
        })
        this.tapeoutForm.priceInterval = _.sortBy(this.tapeoutForm.priceInterval, (item) => { return parseInt(item.minCt) })
      } else {
        this.$message({
          type: 'error',
          message: '至多10个价格区间',
          center: true
        })
      }
    },
    removeInterval (index) {
      // 删除价格区间
      this.tapeoutForm.priceInterval.splice(index, 1)
      this.tapeoutForm.priceInterval = _.sortBy(this.tapeoutForm.priceInterval, (item) => { return parseInt(item.minCt) })
    },
    cvrtIntervalCount (priceInterval) {
      // priceInterval 中数据区间部分转换成数字
      let arr = []
      _.each(priceInterval, (interval) => {
        let item = {
          minCt: parseInt(interval.minCt),
          maxCt: parseInt(interval.maxCt),
          price: parseInt(interval.price)
        }
        arr.push(item)
      })
      return arr
    },
    validatePriceInterval () {
      // 摩尔班车价格区间拼团人数的验证
      let _vue = this
      let flag = true
      // 数组需要排序
      _vue.tapeoutForm.priceInterval = _.sortBy(_vue.tapeoutForm.priceInterval, (item) => { return parseInt(item.minCt) })
      if (_vue.tapeoutForm.tapeoutPlan + '' === '1' && _vue.tapeoutForm.priceInterval.length < 2) {
        flag = false
        _vue.$message({
          type: 'error',
          message: '至少需要2个价格区间',
          center: true
        })
      } else {
        if (_vue.tapeoutForm.tapeoutPlan + '' === '1') {
          for (let i = 0; i < _vue.tapeoutForm.priceInterval.length; i++) {
            let item = _vue.tapeoutForm.priceInterval[i]
            if (item.minCt === '' || parseInt(item.minCt) <= 0 || !Global.REGEX.INTEGER.test(parseInt(item.minCt))) {
              flag = false
              _vue.$message({
                type: 'error',
                message: '请填写最小拼团人数',
                center: true
              })
              return false
            }
            if (i === 0) {
              if (parseInt(item.minCt) !== 1) {
                flag = false
                _vue.$message({
                  type: 'error',
                  message: '第一价格区间拼团人数需要从1开始',
                  center: true
                })
                return false
              }
            } else {
              if (parseInt(item.minCt) !== parseInt(_vue.tapeoutForm.priceInterval[i - 1].maxCt) + 1) {
                flag = false
                _vue.$message({
                  type: 'error',
                  message: '请保持拼团人数的连续性',
                  center: true
                })
                return false
              }
            }
          }
        }
      }
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';

  .table-style {
    margin-bottom: 0;
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;

    .el-col {
      text-align: center;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
  }
  .tapeout-info {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .interval-form {
    text-align: center;
    position: relative;

    .interval-input {
      &.count {
        width: 70px;
      }
      &.price {
        width: 120px;
      }
    }
    .split {
      display: inline-block;
      margin-right: 10px;
    }
    .add-btn {
      position: absolute;
      right: 0;
      top: -60px;
    }
    .action-wrap {
      cursor: pointer;
      .el-icon-delete {
        font-size: 16px;
      }
    }
    .price-tip {
      line-height: 20px;
      color: #999;
      text-align: left;
    }
  }
</style>
