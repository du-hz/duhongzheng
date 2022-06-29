<template>
  <div>
    <div class="head-wrap">
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a>
    </div>
    <div class="cnt-block basic-info">
      <div class="sub-title">
        <span class="title">基本信息</span>
        <span class="text-link edit-supplier" @click="editSupplier">编辑</span>
      </div>
      <div class="supplier-cnt">
        <div class="cnt-item">
          <span class="title">供应商名称：</span>
          <span class="cnt">{{supplierInfo.name}}</span>
        </div>
        <div class="cnt-item">
          <span class="title">供应商Logo：</span>
          <img class="logo" v-if="supplierInfo.logo" :src="supplierInfo.logo | filterQiniuImage" :alt="supplierInfo.name">
        </div>
        <div class="cnt-item">
          <span class="title">企业介绍：</span>
          <div class="introduce-wrap" v-html="(supplierInfo.introduce || '').replace(/\n/g, '<br/>')"></div>
        </div>
      </div>
    </div>
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">联系人列表</span>
      </div>
      <div class="subaccount-cnt table-list-wrap">
        <el-table
          :data="subaccountList"
          header-row-class-name="tableheader"
          border
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="currentJobTitle"
            label="职位"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系电话"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            label="当前身份"
            width="200"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isMasterIp === 1">需求接收人</span>
              <span v-if="scope.row.isMasterIp !== 1">其他联系人</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="text-action-wrap">
                <span class="text-link" v-if="scope.row.isMasterIp !== 1 && subaccountList.length > 1" @click="delSubaccount(scope.row)">删除</span>
                <span class="text-link" v-if="scope.row.isMasterIp !== 1" @click="setMaster(scope.row)">设为需求接收人</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">IP列表</span>
      </div>
      <div class="ip-cnt table-list-wrap">
        <el-table
          :data="ipList"
          header-row-class-name="tableheader"
          border
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="供应商"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="levelOneType"
            label="一级分类"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="levelTwoType"
            label="二级分类"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="model"
            label="型号"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="shortDesc"
            label="描述"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <span class="text-link" @click="viewIpDetail(scope.row)">查看</span>
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
    </div>

    <!-- 编辑供应商信息 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="supplierForm" label-width="120px">
        <el-form-item label="供应商名称：">
          <el-input v-model="supplierForm.name" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="供应商Logo：">
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
        <el-form-item label="企业介绍：">
          <el-input type="textarea" :rows="8" v-model="supplierForm.introduce"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align: center;">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'

export default {
  data () {
    return {
      id: this.$route.params.id,
      supplierInfo: {},
      subaccountList: [],
      ipList: [],
      totalNum: 0,
      pager: {
        page: 1,
        size: 10
      },
      defaultLogo: Global.CONFIG.SUPPLIER_DEFAULT_LOGO,
      uploadData: {
        key: '',
        token: ''
      },
      uploading: false,
      uploadedImageUrl: '',
      editDialogVisible: false,
      supplierForm: {
        id: '',
        name: '',
        logo: '',
        introduce: ''
      }
    }
  },
  created () {
    let _vue = this
    _vue.fetchSupplier()
    _vue.fetchSubaccount()
    _vue.fetchIpList()
  },
  methods: {
    fetchSupplier () {
      // 获取供应商信息
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/detail?id=' + _vue.id).then((response) => {
        _vue.supplierInfo = response.data.data
      })
    },
    fetchSubaccount () {
      // 获取子账号列表
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/subaccount?id=' + _vue.id).then((response) => {
        _vue.subaccountList = response.data.data
      })
    },
    fetchIpList () {
      // 获取IP列表
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/ipList?id=' + _vue.id + '&page=' + _vue.pager.page + '&size=' + _vue.pager.size).then((response) => {
        _vue.ipList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    back () {
      this.$router.push({
        path: '/ip/supplier/list'
      })
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchIpList()
    },
    editSupplier () {
      // 编辑供应商信息
      let _vue = this
      _vue.editDialogVisible = true
      _vue.supplierForm = {
        id: _vue.supplierInfo.id,
        name: _vue.supplierInfo.name,
        introduce: _vue.supplierInfo.introduce
      }
      _vue.uploadedImageUrl = _vue.supplierInfo.logo
      _vue.uploadData.key = _vue.supplierInfo.logo
    },
    beforeUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传',
          center: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传',
          center: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'cloud/supplier/logo/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1] // 七牛文件存储路径
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
    sureEdit () {
      // 提交编辑信息
      let _vue = this
      _vue.supplierForm.logo = _vue.uploadData.key
      _vue.$http.post('/api/v1.0/ip/supplier', _vue.supplierForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        _vue.editDialogVisible = false
        _vue.fetchSupplier()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    delSubaccount (row) {
      // 删除子账号
      let _vue = this
      _vue.$http.post('/api/v1.0/ip/supplier/delete', {
        id: row.id
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '删除成功',
          center: true
        })
        _vue.fetchSubaccount()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    setMaster (row) {
      // 设为主联系人
      let _vue = this
      _vue.$http.post('/api/v1.0/ip/supplier/master', {
        id: row.id
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '设置成功',
          center: true
        })
        _vue.fetchSubaccount()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    viewIpDetail (row) {
      this.$router.push({
        name: 'ipDetail',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .cnt-block {
    margin-top: 30px;

    .sub-title {
      margin-bottom: 20px;

      .title {
        color: $primary-color;
        padding-left: 10px;
        border-left: 2px solid $primary-color;
      }
      .edit-supplier {
        margin-left: 30px;
      }
    }
    .supplier-cnt {
      .cnt-item {
        margin-bottom: 15px;

        .title {
          display: inline-block;
          vertical-align: top;
        }
        .logo {
          max-width: 160px;
        }
        .introduce-wrap {
          display: inline-block;
          max-width: 800px;
        }
      }
    }
  }
  .upload-image {
    max-width: 160px;
  }
  .text-action-wrap {
    .text-link {
      display: inline-block;
      margin-right: 20px;
    }
  }
</style>
