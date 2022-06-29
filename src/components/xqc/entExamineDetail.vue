<template>
  <div class="table-list-wrap">
    <div class="head-wrap">
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a>
    </div>
    <div class="error-correction" v-show="true">
      <div class="title-center">
        <span>公司名称：阿尔卡科技有限公司</span>
      </div>
      <div class="min-box">
        <div class="min-box-bottom">
          <div class="min-box-left">
            <span>修改前</span>
            <span>修改后</span>
          </div>
        </div>
      </div>
      <div class="min-box">
        <span>企业简历</span>
        <div class="min-box-bottom">
          <div class="min-box-left">
            <div class="min-box-padding">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="textarea"
                disabled>
              </el-input>
            </div>
            <div class="min-box-padding">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="textarea"
                disabled>
              </el-input>
            </div>
          </div>
          <div class="min-box-right">
            <el-checkbox v-model="checked">当前行错误</el-checkbox>
          </div>
        </div>
      </div>
      <div class="min-box">
        <span>官网</span>
        <div class="min-box-bottom">
          <div class="min-box-left">
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="min-box-right">
            <el-checkbox v-model="checked">当前行错误</el-checkbox>
          </div>
        </div>
      </div>
      <div class="min-box">
        <span>企业logo</span>
        <div class="min-box-bottom">
          <div class="min-box-left">
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="min-box-right">
            <el-checkbox v-model="checked">当前行错误</el-checkbox>
          </div>
        </div>
      </div>
      <div class="min-box">
        <span>产品信息</span>
        <div class="min-box-bottom">
          <div class="min-box-left">
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="min-box-right">
            <el-checkbox v-model="checked">当前行错误</el-checkbox>
          </div>
        </div>
      </div>
      <div class="min-box">
        <span>佐证信息</span>
        <div class="min-box-bottom">
          <div class="min-box-left">
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="min-box-padding">
              <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="min-box-right">
            <el-checkbox v-model="checked">当前行错误</el-checkbox>
          </div>
        </div>
      </div>
      <div class="cnt-block basic-info">
        <div class="sub-title">
          <span class="title">提交人信息</span>
        </div>
        <div class="supplier-cnt">
          <div class="cnt-item">
            <span class="title">姓名：</span>
            <span class="cnt">刘畊宏</span>
            <span class="cnt">查看</span>
          </div>
          <div class="cnt-item">
            <span class="title">职位：</span>
            <span class="cnt">魔法师</span>
          </div>
          <div class="cnt-item">
            <span class="title">公司名称：</span>
            <span class="cnt">哆蕾咪有限公司</span>
            <span class="cnt">查看</span>
            <!-- <div class="introduce-wrap" v-html="(supplierInfo.introduce || '').replace(/\n/g, '<br/>')"></div> -->
          </div>
          <div class="cnt-item">
            <span class="title">提价时间：</span>
            <span class="cnt">2022-02-24</span>
          </div>
        </div>
      </div>
      <div class="cnt-block basic-info">
        <div class="sub-title">
          <span class="title">审核区</span>
        </div>
        <div class="supplier-cnt">
          <div class="radio-item">
            <el-radio v-model="radio" label="1">审核通过</el-radio>
            <el-radio v-model="radio" label="2">退回修改</el-radio>
            <el-radio v-model="radio" label="3">审核不通过</el-radio>
          </div>
          <div class="textarea-item">
            <div class="title">审核意见</div>
            <div class="textarea-item-el">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="textarea">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary">提交</el-button>
      </div>
    </div>
    <div class="add" v-show="false">
      <div class="cnt-block basic-info">
        <div class="sub-title">
          <span class="title">新增企业信息</span>
        </div>
        <div class="supplier-cnt">
          <div class="cnt-item">
            <span class="title">公司名称</span>
            <span class="cnt">阿尔法羊测试有限公司</span>
            <span class="checkbox-right">
              <el-checkbox v-model="checked">当前行错误</el-checkbox>
            </span>
          </div>
          <div class="cnt-item">
            <span class="title">企业简历</span>
            <span class="cnt">国内排行第三</span>
            <span class="checkbox-right">
              <el-checkbox v-model="checked">当前行错误</el-checkbox>
            </span>
          </div>
          <div class="cnt-item">
            <span class="title">城市</span>
            <span class="cnt">上海</span>
            <span class="checkbox-right">
              <el-checkbox v-model="checked">当前行错误</el-checkbox>
            </span>
          </div>
          <div class="cnt-item">
            <span class="title">地址</span>
            <span class="cnt">张江镇</span>
            <span class="checkbox-right">
              <el-checkbox v-model="checked">当前行错误</el-checkbox>
            </span>
          </div>
          <div class="cnt-item">
            <span class="title">佐证信息</span>
            <span class="cnt">www.baidu.com</span>
            <span class="checkbox-right">
              <el-checkbox v-model="checked">当前行错误</el-checkbox>
            </span>
          </div>
        </div>
      </div>
      <div class="cnt-block basic-info">
        <div class="sub-title">
          <span class="title">提交人信息</span>
        </div>
        <div class="supplier-cnt">
          <div class="cnt-item">
            <span class="title">姓名</span>
            <span class="cnt">刘畊宏</span>
          </div>
          <div class="cnt-item">
            <span class="title">职位</span>
            <span class="cnt">测试</span>
          </div>
          <div class="cnt-item">
            <span class="title">公司名称</span>
            <span class="cnt">阿尔法羊测试有限公司</span>
          </div>
          <div class="cnt-item">
            <span class="title">提价时间</span>
            <span class="cnt">2022-02-02</span>
          </div>
        </div>
      </div>
      <div class="cnt-block basic-info">
        <div class="sub-title">
          <span class="title">审核区</span>
        </div>
        <div class="supplier-cnt">
          <div class="radio-item">
            <el-radio v-model="radio" label="1">审核通过</el-radio>
            <el-radio v-model="radio" label="2">退回修改</el-radio>
            <el-radio v-model="radio" label="3">审核不通过</el-radio>
          </div>
          <div class="textarea-item">
            <div class="title">审核意见</div>
            <div class="textarea-item-el">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="textarea">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      name: '',
      textarea: '',
      radio: 0
    }
  },
  methods: {
    back () {
      // 返回列表
      this.$router.push({
        path: '/xqc/ent/examine'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list-wrap {
  min-width: 900px;
}
.title-center {
  width: 80%;
  display: block;
  text-align: center;
}
.min-box {
  width: 100%;
  &>span {
    width: 80%;
    display: block;
    text-align: center;
  }
  .min-box-bottom {
    width: 100%;
    display: flex;
    .min-box-left {
      width: 80%;
      display: flex;
      justify-content: space-around;
      .min-box-padding {
        width: 30%;
      }
    }
    .min-box-right {
      width: 20%;
    }
  }
}

.cnt-block {
  margin-top: 30px;
  .sub-title {
    margin-bottom: 20px;
    .title {
      color: #409eff;
      padding-left: 10px;
      border-left: 2px solid #409eff;
    }
  }
  .supplier-cnt {
    .cnt-item {
      margin-bottom: 15px;
      .title {
        display: inline-block;
        vertical-align: top;
        width: 200px;
        text-align: right;
        padding-right: 20px;
      }
    }
    .radio-item {
      text-align: center;
    }
    .textarea-item {
      width: 100%;
      .title {
        text-align: center;
        padding: 20px 0 10px 0;
      }
      .textarea-item-el {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-textarea {
          width: 50%;
        }
      }
    }
  }
}

.footer {
  width: 100%;
  text-align: center;
  padding: 30px 0;
  .el-button {
    width: 100px;
  }
}
.checkbox-right {
  width: 330px;
  float: right;
}
</style>
