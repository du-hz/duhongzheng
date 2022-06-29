<template>
  <div>
    <!-- 编辑IP信息用弹窗 统一成通用的部分 -->
    <el-dialog
      title="编辑IP信息"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible">
      <!-- 表单部分 -->
      <div class="form-wrap">
        <el-form :model="infoForm" label-width="200px">
          <el-form-item label="型号：">
            <span>{{infoForm.model}}</span>
          </el-form-item>
          <el-form-item label="IP类型：">
            <el-form-item>
              <div class="type-select-wrap">
                <div class="type-select-item" v-for="(item, index) in multiType" :key="index">
                  <el-select v-model="item.loIpType" placeholder="请选择IP类型" class="ip-type-select" @change="changeLoIpType(index)">
                    <el-option v-for="opt in item.loIpTypeOptions" :value="opt.id" :label="opt.typeName" :key="opt.id"></el-option>
                  </el-select>
                  <el-select v-model="item.lwIpType" placeholder="请选择二级IP类型" class="ip-type-select" @change="changeLwIpType(index)">
                    <el-option v-for="opt in item.lwIpTypeOptions" :value="opt.id" :label="opt.typeName" :key="opt.id"></el-option>
                  </el-select>
                  <span class="remove-type" v-if="index >= 1" @click="removeIpType(index)"><i class="el-icon-delete" title="删除IP类型"></i></span>
                </div>
              </div>
            </el-form-item>
            <div class="add-type-wrap">
              <div class="add-type-btn" @click="addIpType">
                <i class="el-icon-plus"></i>
                <span class="text">增加一个类型</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="供应商：">
            <el-select v-model="infoForm.ipSupplierId">
              <el-option v-for="supplier in supplierOptions" :key="supplier.id" class="item" :label="supplier.name" :value="parseInt(supplier.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简单描述：">
            <el-input v-model="infoForm.shortDesc"></el-input>
          </el-form-item>
          <el-form-item label="详细信息：">
            <el-input type="textarea" :rows="7" v-model="infoForm.detail" placeholder="请输入IP详细信息"></el-input>
          </el-form-item>
          <el-form-item v-for="(field, index) in fields" :key="index" :label="field.fieldName + '：'">
            <template v-if="field.fieldType === 1">
              <el-input placeholder="请输入内容" v-model="fieldValues[index].fieldValue"></el-input>
            </template>
            <template v-if="field.fieldType === 2">
              <el-select v-model="fieldValues[index].fieldValue" placeholder="请选择">
                <el-option
                  v-for="item in field.fieldOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>
            <template v-if="field.fieldType === 3">
              <el-checkbox-group v-model="fieldValues[index].fieldValue">
                <el-checkbox v-for="item in field.fieldOptions" :label="item" :key="item"></el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-if="field.fieldType === 4">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="fieldValues[index].fieldValue">
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="适合晶圆厂&工艺节点：">
            <div class="foundry-node-wrap">
              <div class="foundry-node-item" v-for="(item, index) in foundryNodeArr" :key="index">
                <el-select v-model="item.foundry" multiple filterable placeholder="请选择晶圆厂，可多选" style="width: 270px;">
                  <el-option v-for="(foundryItem, index) in recommendFoundryOpts" :key="index" :label="foundryItem.foundry" :value="foundryItem.foundry"></el-option>
                </el-select>
                <el-select v-model="item.node" multiple filterable placeholder="请选择工艺节点，可多选" style="width: 270px;">
                  <el-option v-for="(nodeItem, index) in recommendNodeOpts" :key="index" :label="nodeItem" :value="nodeItem"></el-option>
                </el-select>
                <span class="remove-icon" v-if="foundryNodeArr.length > 1" @click="removeFoundryNodeItem(index)"><i class="el-icon-delete" title="删除"></i></span>
              </div>
              <div class="other-input-fn-wrap">
                <el-checkbox v-model="otherFn">Others</el-checkbox>
                <div class="input-wrap" v-if="otherFn">
                  <el-input placeholder="请输入其他晶圆厂，如有多个请用逗号隔开" v-model="inputFoundry" style="width: 280px;"></el-input>
                  <el-input placeholder="请输入其他工艺节点，如有多个请用逗号隔开" v-model="inputNode" style="width: 280px;"></el-input>
                </div>
              </div>
              <div>
                <el-button @click="addFoundryNodeItem" type="primary" size="small" icon="el-icon-plus">Add</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="IP成熟度：">
            <el-select v-model="maturitySelect" placeholder="请选择" style="width: 250px;">
              <el-option v-for="(item, index) in maturityOpts" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-input placeholder="请输入内容" style="width: 350px;" v-if="maturitySelect === 'Others'" v-model.trim="infoForm.maturity"></el-input>
          </el-form-item>
          <el-form-item label="数据下载地址：">
            <el-form-item>
              <el-radio-group v-model="downloadType">
                <el-radio :label="1">在线地址</el-radio>
                <el-radio :label="2">上传PDF文件</el-radio>
              </el-radio-group>
              <template v-if="downloadType === 1">
                <el-input placeholder="请输入地址" v-model="infoForm.dataDownload"></el-input>
              </template>
              <template v-if="downloadType === 2">
                <div class="upload-url-wrap">
                  <el-upload
                    class="upload-url-btn"
                    :show-file-list="false"
                    action="http://upload.qiniup.com/"
                    :before-upload="beforeUrlUpload"
                    :on-progress="uploadUrlProgress"
                    :on-success="uploadUrlSuccess"
                    :on-error="uploadUrlError"
                    :data="uploadUrlData"
                    :multiple="false">
                    <el-button size="small" type="primary" :disabled="uploadingUrl">{{uploadingUrl ? '正在上传...' : '点击上传'}}</el-button>
                  </el-upload>
                  <a class="text-link" v-if="uploadedFileUrl !== ''" :href="uploadedFileUrl | filterQiniuFile" target="_blank">查看文件</a>
                </div>
              </template>
            </el-form-item>
          </el-form-item>
          <el-form-item label="结构图：">
            <img class="upload-image" v-if="uploadedImageUrl !== ''" :src="uploadedImageUrl | filterQiniuImage" alt="">
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              action="http://upload.qiniup.com/"
              :before-upload="beforeUpload"
              :on-progress="uploadProgress"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :data="uploadData"
              :multiple="false">
              <el-button size="small" type="primary" :disabled="uploading">{{uploading ? '正在上传...' : '点击上传'}}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="可交付内容：">
            <el-checkbox-group v-model="deliverCntChecked">
              <el-checkbox v-for="(item, index) in deliverCntOpts" :key="index" :label="item" :value="item" class="deliver-cnt-item"></el-checkbox>
            </el-checkbox-group>
            <el-input type="textarea" v-if="deliverCntChecked.indexOf('Others') !== -1" :rows="7" placeholder="请输入其他可交付内容，多项内容用换行隔开" v-model="deliverCntInput"></el-input>
          </el-form-item>
          <el-form-item label="特点：">
            <vue-ckeditor v-model="infoForm.feature" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
          <el-form-item label="优势：">
            <vue-ckeditor v-model="infoForm.advantage" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
          <el-form-item label="应用：">
            <vue-ckeditor v-model="infoForm.application" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer action-wrap">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

const recommendFoundryOpts = [
  { foundry: 'TSMC' },
  { foundry: 'UMC' },
  { foundry: 'GLOBALFOUNDRIES' },
  { foundry: 'Samsung' },
  { foundry: 'SMIC' },
  { foundry: 'TOWER JAZZ' },
  { foundry: 'Powerchip' },
  { foundry: 'Vanguard' },
  { foundry: 'HHGrace' },
  { foundry: 'DBhitek' },
  { foundry: 'SSMC' },
  { foundry: '1st Silicon' },
  { foundry: 'AMS' },
  { foundry: 'ASMC' },
  { foundry: 'Common Platform' },
  { foundry: 'CSMC' },
  { foundry: 'Cirrus' },
  { foundry: 'DongbuAnam' },
  { foundry: 'Fujitsu' },
  { foundry: 'HJTC' },
  { foundry: 'HLMC' },
  { foundry: 'Huali' },
  { foundry: 'IBM' },
  { foundry: 'IDM' },
  { foundry: 'iHP' },
  { foundry: 'Intel' },
  { foundry: 'MagnaChip' },
  { foundry: 'Maxchip' },
  { foundry: 'ON Semiconductor' },
  { foundry: 'SilTerra' },
  { foundry: 'STMicroelectronics' },
  { foundry: 'Toshiba' },
  { foundry: 'VIS' },
  { foundry: 'X-FAB' },
  { foundry: 'XMC' }
]
const recommendNodeOpts = [
  '14nm',
  '16nm',
  '28nm',
  '40nm',
  '55nm',
  '90nm',
  '0.11um',
  '0.13um',
  '0.153um',
  '0.162um',
  '0.18um',
  '0.35um',
  '7nm',
  '8nm',
  '10nm',
  '11nm',
  '12nm',
  '22nm',
  '45nm',
  '65nm',
  '80nm',
  '85nm',
  '95nm',
  '0.115um',
  '0.15um',
  '0.152um',
  '0.16um',
  '0.20um',
  '0.25um',
  '0.30um',
  '0.40um',
  '0.45um',
  '0.50um',
  '0.60um',
  '0.80um',
  '1.0um'
]
export default {
  props: ['ipId'],
  data () {
    return {
      infoForm: {
        foundry: [],
        node: [],
        maturity: '',
        dataDownload: '',
        deliverContent: '',
        feature: '',
        advantage: '',
        application: ''
      },
      editDialogVisible: false,
      defaultLogo: Global.CONFIG.SUPPLIER_DEFAULT_LOGO,
      recommendFoundryOpts: recommendFoundryOpts,
      recommendNodeOpts: recommendNodeOpts,
      uploadData: {
        key: '',
        token: ''
      },
      uploadedImageUrl: '',
      uploading: false,
      fields: [], // 特有字段
      fieldValues: [], // 特有字段对应的值
      downloadType: 1,
      uploadedFileUrl: '',
      uploadUrlData: {
        key: '',
        token: ''
      },
      uploadingUrl: false,
      loIpTypeOptions: [], // 一级分类
      lwIpTypeOptions: [], // 二级分类
      multiType: [],
      supplierOptions: [],
      ckeditorConfig: {
        toolbar: [
          [ 'BulletedList' ]
        ],
        height: 200
      },
      maturityOpts: [
        'Paper - DK ready',
        'Bronze - Silicon Proven',
        'MP - Mass Production',
        'Others'
      ],
      maturitySelect: '',
      deliverCntChecked: [],
      deliverCntOpts: [
        'Databook',
        'Behavioral model',
        'LEF file',
        'LIB file',
        'GDSII Layout Database',
        'CDL netlist for LVS',
        'Test report',
        'Assembly guidelines and full integration support',
        'Others'
      ],
      deliverCntInput: '',
      foundryNodeArr: [{
        foundry: [],
        node: []
      }],
      otherFn: false,
      inputFoundry: '',
      inputNode: ''
    }
  },
  mounted () {
  },
  created () {
    let _vue = this
    _vue.$http.get('/api/v1.0/ip/id?ipId=' + _vue.ipId).then((response) => {
      let result = response.data.data
      _vue.ipInfo = result
      let tmpFoundry = result.common.foundry
      let tmpNode = result.common.node
      _vue.infoForm = result.common
      _vue.infoForm.foundry = (result.common.foundry || '') === '' ? [] : (result.common.foundry || '').split(',')
      _vue.infoForm.node = (result.common.node || '') === '' ? [] : (result.common.node || '').split(',')
      _vue.uploadedImageUrl = result.common.structureDiagram || ''
      _vue.uploadData.key = result.common.structureDiagram || ''
      _vue.uploadUrlData.key = result.common.dataDownload || ''
      _vue.fieldValues = result.field
      if (_vue.maturityOpts.indexOf(_vue.infoForm.maturity) === -1) {
        _vue.maturitySelect = 'Others'
      } else {
        _vue.maturitySelect = _vue.infoForm.maturity
      }
      _vue.foundryNodeArr = JSON.parse(result.common.foundryNode || '[]')
      _vue.hasOtherFn(tmpFoundry, tmpNode)
      _vue.splitDeliverCnt(result.common.deliverContent || '')
      _vue.fetchType()
      _vue.fetchSupplierList()
      _vue.initForm()
    })
  },
  methods: {
    initForm () {
      let _vue = this
      console.log(_vue.ipAllInfo)
      _vue.uploadedImageUrl = _vue.infoForm.structureDiagram || ''
      if (_vue.infoForm.dataDownload.indexOf('cloud/download/') !== -1) {
        // 是上传的文件
        _vue.downloadType = 2
        _vue.uploadedFileUrl = _vue.infoForm.dataDownload
      }
      // 类型回填
      _vue.$http.get('/api/v1.0/ip/type').then((response) => {
        _vue.multiType = []
        _vue.loIpTypeOptions = response.data.data
        _.each(_vue.ipInfo.type, (item) => {
          let typeItem = {}
          typeItem.loIpType = item.levelOneId
          typeItem.lwIpType = item.levelTwoId
          typeItem.loIpTypeOptions = _vue.loIpTypeOptions
          let opts = _.findWhere(_vue.loIpTypeOptions, {id: item.levelOneId})
          if (opts) {
            typeItem.lwIpTypeOptions = opts.children
          }
          _vue.multiType.push(typeItem)
        })
        // 回显自定义字段
        _vue.fetchField(_vue.ipInfo.field)
      })
    },
    minusArr (arr1, arr2) {
      let tmp = []
      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) !== -1) {
          tmp.push(arr1[i])
        }
      }
      return _.difference(arr1, tmp)
    },
    hasOtherFn (foundry, node) {
      // 判断回显数据是否含有其他工艺节点
      let _vue = this
      let recFoundryArr = _.pluck(recommendFoundryOpts, 'foundry')
      if (foundry) {
        let fArr = foundry.split(',')
        let otherFoundryArr = _vue.minusArr(fArr, recFoundryArr)
        if (otherFoundryArr.length > 0) {
          _vue.otherFn = true
          _vue.inputFoundry = _vue.foundryNodeArr[_vue.foundryNodeArr.length - 1].foundry.toString()
          // _vue.inputFoundry = otherFoundryArr.toString()
          // 从foundryNodeArr 中移除其他项
          for (var i = 0; i < _vue.foundryNodeArr.length; i++) {
            let foundryItem = _vue.foundryNodeArr[i].foundry.toString()
            let interFoundryArr = _.intersection(otherFoundryArr, foundryItem)
            if (interFoundryArr.length > 0) {
              _vue.foundryNodeArr.splice(i, 1)
            }
          }
          if (_vue.foundryNodeArr.length === 0) {
            _vue.foundryNodeArr.push({
              foundry: [],
              node: []
            })
          }
        } else {
          _vue.inputFoundry = ''
        }
      } else {
        _vue.inputFoundry = ''
      }
      if (node) {
        let nArr = node.split(',')
        let otherNodeArr = _vue.minusArr(nArr, recommendNodeOpts)
        if (otherNodeArr.length > 0) {
          _vue.otherFn = true
          _vue.inputNode = _vue.foundryNodeArr[_vue.foundryNodeArr.length - 1].node.toString()
          // _vue.inputNode = otherNodeArr.toString()
          // 从foundryNodeArr 中移除其他项
          for (var j = 0; j < _vue.foundryNodeArr.length; j++) {
            let nodeItem = _vue.foundryNodeArr[j].node
            let interNodeArr = _.intersection(otherNodeArr, nodeItem)
            if (interNodeArr.length > 0) {
              _vue.foundryNodeArr.splice(j, 1)
            }
          }
          if (_vue.foundryNodeArr.length === 0) {
            _vue.foundryNodeArr.push({
              foundry: [],
              node: []
            })
          }
        } else {
          _vue.inputNode = ''
        }
      } else {
        _vue.inputNode = ''
      }
      if (!foundry && !node) {
        _vue.otherFn = false
      }
    },
    fetchType () {
      // 获取类型
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/type').then((response) => {
        _vue.loIpTypeOptions = response.data.data
        if (_vue.multiType.length === 0) {
          let typeObj = {
            loIpType: '',
            lwIpType: '',
            loIpTypeOptions: [],
            lwIpTypeOptions: []
          }
          typeObj.loIpTypeOptions = _vue.loIpTypeOptions
          _vue.multiType.push(typeObj)
        } else {
          _vue.multiType[0].loIpTypeOptions = _vue.loIpTypeOptions
        }
      })
    },
    fetchField (fieldParams) {
      // 根据类型获取专属字段
      let _vue = this
      let types = (_.uniq(_.compact(_.pluck(_vue.multiType, 'lwIpType') || ''))).toString()
      _vue.$http.get('/api/v1.0/ip/field?ids=' + types).then((response) => {
        _vue.fields = response.data.data
        let arr = []
        _.each(_vue.fields, (ele) => {
          if (ele.fieldType === 2 || ele.fieldType === 3) {
            if (ele.fieldOptions) {
              ele.fieldOptions = ele.fieldOptions.split(',')
              arr.push(ele)
            } else {
              arr.push(ele)
            }
          } else {
            arr.push(ele)
          }
        })
        _vue.fields = arr
        _vue.wrapFieldValues(_vue.fields, fieldParams)
      })
    },
    wrapFieldValues (fields, fieldParams) {
      let _vue = this
      _.each(fields, (ele) => {
        let valObj = {
          ipFieldId: ele.id,
          fieldValue: ''
        }
        if (ele.fieldType === 3) {
          valObj.fieldValue = []
        }
        // 可能有值的回填
        if (fieldParams && fieldParams.length > 0) {
          let tmpObj = _.findWhere(fieldParams, {ipFieldId: ele.id})
          if (tmpObj) {
            let tmp = tmpObj.fieldValue
            if (ele.fieldType === 3) {
              if (tmp === '') {
                valObj.fieldValue = []
              } else {
                valObj.fieldValue = tmp.split(',')
              }
            } else {
              valObj.fieldValue = tmp
            }
          }
        }
        _vue.fieldValues.push(valObj)
      })
    },
    fetchSupplierList () {
      // 获取所有供应商信息
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/list?page=1&size=99').then((response) => {
        _vue.supplierOptions = response.data.data.rows
      })
    },
    changeLoIpType (index) {
      // 切换一级分类
      let _vue = this
      let opts = _.findWhere(_vue.loIpTypeOptions, {id: _vue.multiType[index].loIpType})
      if (opts) {
        _vue.multiType[index].lwIpType = ''
        _vue.multiType[index].lwIpTypeOptions = opts.children
      }
    },
    changeLwIpType () {
      // 选中二级类型，重新获取field
      this.fetchField(this.ipInfo.field)
    },
    addIpType () {
      // 添加IP分类
      let _vue = this
      _vue.multiType.push({
        loIpType: '',
        lwIpType: '',
        loIpTypeOptions: _vue.loIpTypeOptions,
        lwIpTypeOptions: []
      })
    },
    removeIpType (index) {
      // 删除IP分类
      this.multiType.splice(index, 1)
    },
    beforeUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传',
          center: true,
          showClose: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传',
          center: true,
          showClose: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'cloud/diagram/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1] // 七牛文件存储路径
        return _vue.$http.post('/api/v1.0/qiniu/token/img', {
          type: 1
        }).then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadProgress (event, file) {
      this.uploading = true
    },
    uploadSuccess (res, file) {
      this.uploading = false
      this.uploadedImageUrl = file.response.key
    },
    uploadError () {
      this.uploading = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    beforeUrlUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '文件大小需小于10M，请重新上传',
          center: true
        })
        return false
      } else if (['application/pdf'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '请上传PDF格式文件',
          center: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'cloud/download/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1] // 七牛文件存储路径
        return _vue.$http.post('/api/v1.0/qiniu/token/file', {
          type: 1
        }).then(response => {
          _vue.uploadUrlData.token = response.data.data.token
          _vue.uploadUrlData.key = key
        })
      }
    },
    uploadUrlProgress () {
      this.uploadingUrl = true
    },
    uploadUrlSuccess (res, file) {
      this.uploadingUrl = false
      this.uploadedFileUrl = file.response.key
    },
    uploadUrlError () {
      this.uploadingUrl = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true
      })
    },
    contactDeliverCnt () {
      // 组合可交付内容
      let _vue = this
      let tmp = _vue.deliverCntChecked.join(';') + ';' + _vue.deliverCntInput.trim()
      _vue.infoForm.deliverContent = tmp.substring(0, tmp.length - 1)
    },
    splitDeliverCnt (cnt) {
      // 拆分可交付内容
      let _vue = this
      let arr = (cnt || '').split(';')
      _vue.deliverCntChecked = _.intersection(arr, _vue.deliverCntOpts)
      _vue.deliverCntInput = _.difference(arr, _vue.deliverCntOpts).toString()
    },
    splitFoundryNodeArr () {
      // 拆分 foundry & node
      let _vue = this
      _vue.infoForm.foundry = _.uniq(_.flatten(_.pluck(_vue.foundryNodeArr, 'foundry')))
      _vue.infoForm.node = _.uniq(_.flatten(_.pluck(_vue.foundryNodeArr, 'node')))
    },
    sureEdit () {
      let _vue = this
      let values = []
      _.each(_vue.fieldValues, (ele) => {
        if (_.isArray(ele.fieldValue)) {
          ele.fieldValue = ele.fieldValue.toString()
        }
        values.push(ele)
      })
      _vue.contactDeliverCnt()
      let foundry = ''
      let node = ''
      let foundryNode = ''
      if (_vue.otherFn) {
        if (_vue.inputFoundry.trim() !== '' || _vue.inputNode.trim() !== '') {
          _vue.foundryNodeArr.push({
            foundry: _vue.inputFoundry.trim().split(','),
            node: _vue.inputNode.trim().split(',')
          })
        }
      }
      _vue.splitFoundryNodeArr()
      console.log(_vue.foundryNodeArr)
      foundry = _vue.infoForm.foundry.toString()
      node = _vue.infoForm.node.toString()
      foundryNode = JSON.stringify(_vue.foundryNodeArr)
      _vue.$http.post('/api/v1.0/ip', {
        type: _.uniq(_.compact(_.pluck(_vue.multiType, 'lwIpType'))),
        cloudIpInfo: {
          id: _vue.ipId,
          ipSupplierId: _vue.infoForm.ipSupplierId,
          model: _vue.infoForm.model,
          shortDesc: _vue.infoForm.shortDesc,
          detail: _vue.infoForm.detail,
          foundry: foundry,
          node: node,
          foundryNode: foundryNode,
          maturity: _vue.maturitySelect === 'Others' ? _vue.infoForm.maturity : _vue.maturitySelect,
          structureDiagram: _vue.uploadData.key,
          deliverContent: _vue.infoForm.deliverContent,
          feature: _vue.infoForm.feature,
          application: _vue.infoForm.application,
          advantage: _vue.infoForm.advantage,
          dataDownload: _vue.downloadType === 1 ? _vue.infoForm.dataDownload : _vue.uploadUrlData.key
        },
        cloudIpInfoFields: values
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        _vue.editDialogVisible = false
        _vue.$emit('refreshData')
        // 刷新页面
        window.location.reload()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    addFoundryNodeItem () {
      // 添加 工厂 & 节点
      let _vue = this
      _vue.foundryNodeArr.push({
        foundry: [],
        node: []
      })
    },
    removeFoundryNodeItem (index) {
      // 删除 工厂 & 节点
      this.foundryNodeArr.splice(index, 1)
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
  .ip-head-info {
    margin: 20px 0;

    .main-title {
      font-size: 20px;
      color: #333;
      font-weight: 600;
      display: inline-block;
      margin-right: 20px;
      vertical-align: middle;
    }
    .logo {
      width: 180px;
    }
  }
  .form-wrap {
    max-height: 400px;
    overflow: auto;
  }
  .publish-wrap {
    margin-bottom: 30px;

    .sub-title {
      margin-bottom: 15px;

      .title {
        color: $primary-color;
        border-left: 2px solid $primary-color;
        padding-left: 10px;
      }
    }
  }
  .img-diagram {
    max-width: 400px;
  }
  .type-select-wrap {

    .type-select-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
      .ip-type-select {
        width: 250px;
      }
    }
  }
  .add-type-wrap {
    cursor: pointer;
  }
  .remove-type {
    cursor: pointer;
    i {
      font-size: 18px;
    }
  }
  .deliver-cnt-item {
    display: inline-block;
    margin-left: 0 !important;
    margin-right: 30px;
  }
  .foundry-node-wrap {
    .foundry-node-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
      .remove-icon {
        display: inline-block;
        margin-left: 20px;
        cursor: pointer;

        i {
          font-size: 20px;
          color: $primary-color;
        }
      }
    }
  }
  .upload-image {
    max-width: 300px;
  }
</style>
