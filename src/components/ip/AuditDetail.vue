<template>
  <div>
    <div class="head-wrap">
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a>
    </div>
    <div class="ip-model-wrap">
      <el-row class="ip-head-info">
        <el-col :span="20">
          <span class="main-title">{{ipInfo.model}}</span>
        </el-col>
        <el-col :span="4">
          <img class="logo" v-if="ipInfo.supplierLogo" :src="ipInfo.supplierLogo" alt="">
          <img class="logo" v-if="!ipInfo.supplierLogo" :src="defaultLogo" alt="">
        </el-col>
      </el-row>
      <el-form label-width="200px">
        <el-form-item label="型号：">
          <span>{{ipInfo.model}}</span>
        </el-form-item>
        <el-form-item label="简单描述：">
          <span>{{ipInfo.shortDesc}}</span>
        </el-form-item>
        <el-form-item label="详细信息：">
          <div class="detail-info" v-html="(ipInfo.detail || '').replace(/\n/g, '<br/>')"></div>
        </el-form-item>
        <el-form-item v-for="(item, index) in fieldValues" :key="index" :label="item.fieldName + '：'">
          <span>{{item.fieldValue}}</span>
        </el-form-item>
        <el-form-item label="适合晶圆厂&工艺节点：">
          <span class="foundry-node-text" v-html="foundryNode"></span>
        </el-form-item>
        <el-form-item label="IP成熟度：">
          <span>{{ipInfo.maturity}}</span>
        </el-form-item>
        <el-form-item label="数据下载地址：">
          <a target="_blank" class="text-link" :href="ipInfo.dataDownload | filterQiniuFile">{{ipInfo.dataDownload | filterQiniuFile}}</a>
        </el-form-item>
        <el-form-item label="结构图：">
          <img v-if="ipInfo.structureDiagram" :src="ipInfo.structureDiagram | filterQiniuImage" alt="">
        </el-form-item>
        <el-form-item label="可交付内容：">
          <div class="editor-display" style="line-height: 1.8;" v-html="(ipInfo.deliverContent || '').replace('Others;', '').replace(/;/g, '<br>').replace(/\n/g, '<br>')"></div>
        </el-form-item>
        <el-form-item label="特点：">
          <div class="editor-display" v-html="ipInfo.feature"></div>
        </el-form-item>
        <el-form-item label="优势：">
          <div class="editor-display check" v-html="ipInfo.advantage"></div>
        </el-form-item>
        <el-form-item label="应用：">
          <div class="editor-display" v-html="ipInfo.application"></div>
        </el-form-item>
      </el-form>
      <div class="action-wrap fixed-bottom">
        <el-button v-if="ipInfo.auditStatus === 0" @click="checkIp(2)">审核不通过</el-button>
        <el-button v-if="ipInfo.auditStatus === 0" type="primary" @click="checkIp(1)">审核通过</el-button>
        <el-button @click="editIp">编辑IP</el-button>
      </div>
    </div>

    <!-- 编辑IP信息用弹窗 统一成通用的部分 -->
    <edit-ip ref="editIp" :ipId="id" @refreshData="fetchDetail"></edit-ip>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import EditIp from '@/components/ip/EditIp'
import _ from 'underscore'

export default {
  components: {
    EditIp
  },
  data () {
    return {
      id: this.$route.params.id,
      ipInfo: {},
      fieldValues: [],
      rules: {},
      editDialogVisible: false,
      defaultLogo: Global.CONFIG.SUPPLIER_DEFAULT_LOGO,
      uploadData: {
        key: '',
        token: ''
      },
      uploadedImageUrl: '',
      uploading: false,
      ipAllInfo: {},
      foundryNode: ''
    }
  },
  created () {
    let _vue = this
    _vue.fetchDetail()
  },
  methods: {
    fetchDetail () {
      // IP详情
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/id?ipId=' + _vue.id).then((response) => {
        let result = response.data.data
        _vue.ipAllInfo = result
        _vue.ipInfo = result.common
        _vue.uploadedImageUrl = result.common.structureDiagram || ''
        _vue.fieldValues = result.field
        console.log(result)
        _vue.foundryNode = ''
        let arr = JSON.parse(result.common.foundryNode || '[]')
        _.each(arr, (item) => {
          let s = item.foundry.join(',') + ' ' + item.node.join(',')
          _vue.foundryNode += s + '<br/>'
        })
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    checkIp (status) {
      // 审核IP
      let _vue = this
      _vue.$http.post('/api/v1.0/ip/check', {
        id: _vue.id,
        auditStatus: status
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '审核成功',
          center: true
        })
        _vue.fetchDetail()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    back () {
      // 返回列表
      this.$router.push({
        path: '/ip/audit/list'
      })
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
          _vue.uploadData.token = response.data.data
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
        center: true
      })
    },
    editIp () {
      // 编辑IP
      this.$refs.editIp.editDialogVisible = true
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
  .foundry-node-text {
    line-height: 1.8;
  }
  .detail-info {
    line-height: 1.6;
  }
  .ip-model-wrap {
    width: 80%;
  }
</style>
