<template>
  <div class="set-main">
    <div class="left-menu">
      <div v-for="(item, index) in menuList" :key="index" class="menu-item" :class="isSelect === item.id ? 'active' : ''" @click="clickItem(item.id)">
        <span>{{item.name}}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="right-content">
      <div v-show="isSelect === 1" class="content-item item1">
        <el-form label-position="top" label-width="100px" :model="formId0">
          <el-form-item label="是否启用表单">
            <el-radio v-model="formId0.isEnable" label= '1'>启用</el-radio>
            <el-radio v-model="formId0.isEnable" label= '0'>停止</el-radio>
          </el-form-item>
          <el-form-item label="表单到期时间" style="border-bottom:none">
            <el-date-picker
              v-model="formId0.expirationTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否允许表单多次提交">
            <el-radio v-model="formId0.isRepeatSubmit" label= '0'>不可多次提交</el-radio>
            <el-radio v-model="formId0.isRepeatSubmit" label= '1'>可多次提交</el-radio>
          </el-form-item>
          <el-form-item label="是否允许更新用户信息">
            <el-radio v-model="formId0.isUpdateUserInfo" label= '1'>允许</el-radio>
            <el-radio v-model="formId0.isUpdateUserInfo" label= '0'>不允许</el-radio>
          </el-form-item>
          <el-form-item label="环境限制">
            <el-radio v-model="formId0.isOnlyWeixin" label= '1' >仅限微信环境</el-radio>
            <el-radio v-model="formId0.isOnlyWeixin" label= '0' >不限</el-radio>
          </el-form-item>
          <el-form-item label="是否进行页面缓存">
            <el-radio v-model="formId0.isCache" label= '1' >缓存</el-radio>
            <el-radio v-model="formId0.isCache" label= '0' >不缓存</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveData(0)" class="saveData">保存设置</el-button>
      </div>
      <div v-if="isSelect === 2" class="content-item">
        <el-form label-position="top" label-width="100px" :model="formId0">
          <el-form-item label="版本号">
            <el-input v-model="formId0.versionNumber"></el-input>
          </el-form-item>
          <el-form-item label="发送邮箱(最多5个，多个逗号分割)">
            <el-input v-model="formId0.toEmails"></el-input>
          </el-form-item>
          <el-form-item label="抄送邮箱(最多5个，多个逗号分割)">
            <el-input v-model="formId0.ccEmails"></el-input>
          </el-form-item>
          <el-form-item label="邮箱触发时间(可多选)">
            <el-select v-model="formId0.emailTrigger" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveData(1)" class="saveData">保存设置</el-button>
      </div>
      <div v-show="isSelect === 3" class="content-item">
        <div class="rulesBox">
          <div class="rulesTitle">填写表单后</div>
          <div class="content">
            <div @click="jump(1)" class="btn" :class="isJump === 1 ? 'activeJump' : ''"><p>展示提示文字</p></div>
            <div @click="jump(2)" class="btn" :class="isJump === 2 ? 'activeJump' : ''"><p>自动打开其他网页</p></div>
          </div>
        </div>
        <div class="jump1" v-show="isJump === 1">
          <div class="rulesBox">
            <div class="rulesTitle">提示文案</div>
            <div class="content">
              <div @click="jump1(1)" class="btn" :class="isJump1 === 1 ? 'activeJump' : ''"><p>系统默认文案</p></div>
              <div @click="jump1(2)" class="btn" :class="isJump1 === 2 ? 'activeJump' : ''"><p>提交后图文展示</p></div>
            </div>
          </div>
          <div class="jump1-box" v-show="isJump1 === 2">
            <div class="rulesBox">
              <div class="rulesTitle">输入富文本内容</div>
              <div class="ckeditor-container">
                <textarea name="content" id="formCkeditor"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="jump1" v-if="isJump === 2">
          <div class="rulesBox">
            <div class="rulesTitle">网页地址</div>
          </div>
          <div class="jump1-box">
            <el-input v-model="formId0.jumpLink"></el-input>
          </div>
        </div>
        <el-button type="primary" @click="saveData(2)" class="saveData">保存设置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import MyUploadAdapter from './js/MyUploadAdapter'
export default {
  data () {
    return {
      uuid: '',
      menuList: [{
        id: 1,
        name: '表单数据设置'
      },
      // {
      //   id: 2,
      //   name: '表单信息设置'
      // },
      {
        id: 3,
        name: '表单数据提交'
      }
      ],
      options: [{
        value: '1',
        label: '用户每次提交发送'
      }, {
        value: '2',
        label: '有效期内每天发送一次'
      }, {
        value: '3',
        label: '有效期结束发送'
      }],
      isSelect: 1,
      isJump: 1,
      isJump1: 1,
      formCkeditor: '',
      isSave: [true, true, true],
      formId0: {
        jumpStatus: 1,
        isRepeatSubmit: '0', // 是否允许表单多次提交，默认0 不可多次提交
        isUpdateUserInfo: '1', // 是否允许更新用户信息：默认1：允许
        isEnable: '1', // 是否启用
        isOnlyWeixin: '0', // 是否仅限微信环境
        isCache: '0', // 是否进行页面缓存
        jumpLink: '', // 成功后跳转链接
        jumpImageText: '', // 成功后显示图片
        // versionNumber: '', // 版本号默认1
        // toEmails: '', // 发送邮箱，最多5个，多个逗号分割
        // ccEmails: '', // 抄送邮箱，最多5个，多个逗号分割
        // emailTrigger: '', // 邮箱触发时间，多个逗号分割。类型：1：用户每次提交发送 2：有效期内每天发送一次 3：有效期结束发送
        expirationTime: '' // 表单关闭时间
      }
    }
  },
  created () {
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : ''
    if (this.uuid) {
      this.getSrtMsg()
    } else {
      window.setTimeout(() => {
        this.initBaseCkeditor()
      }, 500)
    }
  },
  methods: {
    getSrtMsg () {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${this.uuid}/configuration`).then((res) => {
        console.log('表单配置信息回显')
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          self.formId0.isRepeatSubmit = JSON.stringify(data.data.isRepeatSubmit)
          self.formId0.isUpdateUserInfo = JSON.stringify(data.data.isUpdateUserInfo)
          self.formId0.isEnable = JSON.stringify(data.data.isEnable)
          self.formId0.isOnlyWeixin = JSON.stringify(data.data.isOnlyWeixin)
          self.formId0.isCache = JSON.stringify(data.data.isCache)
          self.formId0.jumpLink = JSON.stringify(data.data.jumpLink)
          self.formId0.jumpImageText = data.data.jumpImageText
          self.formId0.expirationTime = data.data.expirationTime || ''
          self.formId0.jumpStatus = data.data.jumpStatus
          if (self.formId0.jumpStatus === 2) {
            self.isJump = 2
          }
          if (self.formId0.jumpStatus === 3) {
            self.isJump = 1
            self.isJump1 = 2
          }
          window.setTimeout(() => {
            this.initBaseCkeditor(this.formId0.jumpImageText)
          }, 500)
        }
      })
    },
    clickItem (index) {
      this.isSelect = index
    },
    jump (num) {
      this.isJump = num
      if (num === 1) {
        this.isJump1 = 1
      } else if (num === 2) {
        this.formId0.jumpStatus = 2
      }
    },
    jump1 (num) {
      if (num === 2) {
        // if (this.formId0.jumpImageText) {
        //   window.setTimeout(() => {
        //     this.initBaseCkeditor(this.formId0.jumpImageText)
        //   }, 500)
        // }
        this.formId0.jumpStatus = 3
      } else if (num === 1) {
        this.formId0.jumpStatus = 1
      }
      this.isJump1 = num
    },
    // 基本信息富文本编辑
    initBaseCkeditor (content) {
      let _vue = this
      window.ClassicEditor
        .create(document.querySelector('#formCkeditor'), {
          removePlugins: ['MediaEmbed', 'Table']
        })
        .then(formCkeditor => {
          if (content) {
            formCkeditor.setData(content)
          }
          _vue.formCkeditor = formCkeditor
          // 上传图片
          formCkeditor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader)
          }
        })
        .catch(error => {
          _vue.$message({
            type: 'warn',
            message: '编辑器初始化失败，请刷新页面或联系管理员',
            center: true,
            showClose: true
          })
          console.error(error)
        })
    },
    saveData (num) {
      let self = this
      if (this.isJump1 === 2) {
        this.formId0.jumpImageText = this.formCkeditor.getData()
      }
      this.formId0.jumpLink = this.formId0.jumpLink.replace(/"/g, '')
      let params = JSON.parse(JSON.stringify(this.formId0))
      this.$http.put(`/api/v1.0/common/form/${this.uuid}/configuration`, params).then((res) => {
        console.log('提交表单配置信息的编辑')
        console.log(res.data)
        let data = res.data
        if (data.code === 200) {
          self.$message({
            type: 'success',
            message: '信息保存成功'
          })
        } else {
          self.$message({
            type: 'error',
            message: '信息保存失败，请稍后再试'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './scss/color.scss';
@import './scss/base.scss';
.set-main{
  width: 60%;
  height: calc(100% - 20px);
  margin: 0 auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  >div{
    border: 1px solid #E7E9EB;
    border-radius: 4px;
    background-color: #fff;
  }
  .left-menu{
    width: 25%;
    min-height: 100px;
    .menu-item{
      width: calc(100% - 40px);
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E7E9EB;
    }
    .active{
      color: $titleColor;
    }
  }
  .right-content{
    width: calc(70% - 40px);
    height: calc(100% - 40px);
    overflow: auto;
    padding: 20px;
    margin-left: 30px;
    .content-item{
      width: 100%;
      height: auto;
      .saveData{
        margin-top: 10px;
      }
      .content{
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .btn{
          width: 110px;
          padding: 10px 20px;
          text-align: center;
          border: $border;
          margin-right: 20px;
          font-size: 13px;
          cursor: pointer;
          p{
            width: 100%;
          }
        }
        .btn:hover{
          border: $borderFocus;
          color: $titleColor;
        }
        .activeJump{
          border: $borderFocus;
          color: $titleColor;
        }
      }
      .jump1{

      }
    }
    .item1{
      .el-form{
        .el-form-item{
          border-bottom: $border;
        }
      }
    }
  }
}
</style>
