<template>
  <div class="set-main">
    <div class="content">
      <div class="title">
        <p class="active">字段规则</p>
      </div>
      <div class="modular">
        <div class="jianjie" v-show="!isShow">
          <p>你可以为选择字段（单项选择、多项选择、图片单选、图片多选、评分、下拉框和多级下拉框）设定一些规则：在填写者选择某选项后，触发显示位于该字段之后的其他字段</p>
        </div>
        <div class="addNewRules" @click="showRules" v-show="!isShow">
          <p><i class="el-icon-plus"></i> 添加新规则</p>
        </div>
        <div class="showRules" v-show="isShow">
          <div class="showLeft">
            <div class="rules-box">
              <div class="rules-item warn">
                <p>
                  请注意！为避免客户端产生空白页，规则所对应的字段应存在于同一页。
                </p>
              </div>
              <div class="rules-item warn" v-if="isWarn">
                <p>
                  请注意！您有超过2个或以上的规则应用于同一字段，这可能会导致提交时规则冲突，字段无法正确显示或被隐藏。为了表单正常显示和填写，请修改当前的规则，避免一个字段被多个规则控制。
                </p>
              </div>
              <div class="rules-item" v-for="(item, index) in rulesList" :key="index" :style="isSelect === index ? 'background-color:#e0f2ff' : 'background-color:#ffe9ed'" @click="selectItem(item,index)">
                <div class="left">
                  <p>如果：</p>
                  <p>就显示：</p>
                </div>
                <div class="right" :style="item.controlTitle && item.value && item.relations.length > 0 ? 'color:#2C3340' : 'color:#e34152'">
                  <p>在“{{item.controlTitle}}”选择了“{{item.value}}”</p>
                  <p>
                    <span v-for="(i, n) in item.relations" :key="n">
                      {{i.relationTitle}}{{n === (item.relations.length - 1) ? '' : ','}}
                    </span>
                  </p>
                </div>
                <div class="del-btn" v-show="isSelect === index" @click="delItem(item, index, $event)">
                    <i class="el-icon-remove-outline"></i>
                </div>
              </div>
            </div>
            <div class="addNewRules" @click="addRuleItem">
              <p><i class="el-icon-plus"></i> 添加新规则</p>
            </div>
            <el-button type="primary" @click="saveRules">保存</el-button>
          </div>
          <div class="showRight" :style="'margin-top:' + marginTop + 'px'" v-if="isShowRight">
            <div class="leftCaret">
              <div class="icon"></div>
            </div>
            <div class="title"><i class="el-icon-setting"></i> 设置规则</div>
            <p>如果：</p>
            <p>在______中</p>
            <div class="controls-box">
              <div v-for="(item, index) in controlsList" :key="index" class="controls-item" v-if="item.controlType === 1" @click="selectControls(item, index)" :class="rulesList[isSelect].selectC === index ? 'activeItem' : ''">
                {{item.title}}
              </div>
            </div>
            <p>选择了______</p>
            <div class="controls-box">
              <div v-for="(item, index) in valuesData" :key="index" class="controls-item" style="padding:0" @click="selectValue(item, index)" :class="rulesList[isSelect].selectV === index ? 'activeItem' : ''">
                  <i class="el-icon-minus" style="color:#646D7F;"></i>{{item.value}}
              </div>
            </div>
            <p>就显示以下字段</p>
            <div class="controls-box">
               <el-checkbox-group v-model="checkList" v-for="(item, index) in controlsSelect" :key="index" class="controls-item" @change='checkboxChange' v-if="item.title !== '身份'" >
                <el-checkbox :label="item.relationTitle">{{item.relationTitle}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      uuid: '',
      // 字段规则使用字段
      isShow: false,
      isWarn: false,
      isShowRight: true,
      rulesList: [{ // 字段规则列表
        id: '',
        controlId: '',
        controlTitle: '',
        value: '',
        relations: [],
        valueArr: [],
        selectC: -1,
        selectV: -1
      }],
      isSelect: 0, // 当前选择的字段规则下标
      marginTop: 0,
      controlsSelect: [], // 保存当前可显示字段
      valuesData: [], // 保存规则选择项
      checkList: [], // 保存当前选择的可显示字段
      canSelectCheck: [], // 用于对比是否有显示字段重复被规则
      // 字段规则数据
      controlsList: [],
      controlsListAll: [],
      controlsSelectList: []
    }
  },
  created () {
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : ''
    this.getFormControls()
  },
  methods: {
    // 获取表单的所有控件
    getFormControls () {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${this.uuid}/controls`).then((res) => {
        let data = res.data
        if (data.code === 200) {
          self.getFormRule()
          self.controlsListAll = self.controlsList = data.data
          self.controlsSelect = self.controlsList.map(item => {
            return {
              id: item.id || '',
              relationTitle: item.title,
              relationId: item.controlId
            }
          })
          self.controlsSelectList = self.controlsSelect
        }
        console.log('获取表单的所有控件')
        console.log(data)
      })
    },
    // 获取表单控件的规则
    getFormRule () {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${this.uuid}/rule`).then((res) => {
        let data = res.data
        console.log('获取表单控件的规则')
        console.log(data)
        if (data.code === 200) {
          if (data.data.length > 0) {
            self.isShow = true
          }
          let rulesList = data.data
          let controlsList = JSON.parse(JSON.stringify(self.controlsList))
          rulesList.map((i, n) => {
            controlsList.map((ii, nn) => {
              if (i.controlTitle === ii.title) {
                rulesList[n].selectC = nn
                rulesList[n].valueArr = controlsList[nn].options
              }
              controlsList[nn].options.map((obj, oi) => {
                if (obj.value === i.value) {
                  rulesList[n].selectV = oi
                }
                return obj
              })
            })
            return i
          })
          self.controlsSelect = this.controlsSelect.map(obj => {
            rulesList[0].relations.map(item => {
              if (obj.relationTitle === item.relationTitle) {
                obj.id = item.id
                self.checkList.push(obj.relationTitle)
              }
              return item
            })
            return obj
          }).filter(i => i.relationTitle !== rulesList[0].controlTitle)
          self.valuesData = controlsList[rulesList[0].selectC].options
          self.rulesList = rulesList
        }
      })
    },
    showRules () {
      this.isShow = true
    },
    addRuleItem () {
      let item = {
        controlTitle: '',
        value: '',
        relations: []
      }
      this.rulesList.push(item)
    },
    selectItem (item, index) {
      this.isShowRight = true
      if (this.isSelect !== index) {
        this.canSelectCheck = this.checkList
      }
      this.isSelect = index
      this.marginTop = index * 70
      this.valuesData = item.valueArr
      if (item.controlTitle) {
        this.controlsSelect = this.controlsSelect.filter(obj => {
          return obj.relationTitle !== item.controlTitle
        })
      }
      if (item.relations.length > 0) {
        this.checkList = item.relations.map(obj => { return obj.relationTitle })
      } else {
        this.checkList = []
      }
    },
    delItem (item, index, e) {
      this.checkList = []
      this.isWarn = false
      this.isSelect = 0
      this.marginTop = 0
      this.isShowRight = false
      this.rulesList.splice(index, 1)
      e.stopPropagation()
    },
    // 设置规则选择控件
    selectControls (item, index) {
      this.rulesList[this.isSelect].selectC = index
      this.rulesList[this.isSelect].selectV = -1
      this.rulesList[this.isSelect].value = ''
      this.rulesList[this.isSelect].controlTitle = item.title
      this.rulesList[this.isSelect].id = ''
      this.rulesList[this.isSelect].controlId = item.controlId
      this.rulesList[this.isSelect].valueArr = item.options
      this.checkList = []
      this.valuesData = item.options
      this.controlsSelect = this.controlsSelect.filter(obj => {
        return obj.relationTitle !== item.title
      })
    },
    selectValue (item, index) {
      this.rulesList[this.isSelect].optionId = item.optionId
      this.rulesList[this.isSelect].selectV = index
      this.rulesList[this.isSelect].value = item.value
    },
    checkboxChange (val) {
      let a = val.join(',')
      if (a.indexOf('手机') !== -1 && a.indexOf('验证码') === -1) {
        val.push('验证码')
      } else if (a.indexOf('手机') === -1 && a.indexOf('验证码') !== -1) {
        val.map((item, index) => {
          if (item === '验证码') {
            val.splice(index, 1)
          }
        })
      }
      this.controlsList = JSON.parse(JSON.stringify(this.controlsListAll))
      let filters = [...new Set(this.canSelectCheck.concat(val))]
      filters.map(i => {
        this.controlsList.map((obj, index) => {
          if (obj.title === i) {
            this.controlsList.splice(index, 1)
          }
        })
        return i
      })
      let arr = []
      this.controlsSelectList.map(obj => {
        if (val.length === 1) {
          if (val[0] === obj.relationTitle) {
            arr.push(obj)
          }
        } else if (val.length > 1) {
          val.map(item => {
            if (item === obj.relationTitle) {
              arr.push(obj)
            }
          })
        }
        return obj
      })
      this.rulesList[this.isSelect].relations = JSON.parse(JSON.stringify(arr))
      let newArr = []
      for (let i = 0; i < this.canSelectCheck.length; i++) {
        for (let j = 0; j < val.length; j++) {
          if (val[j] === this.canSelectCheck[i]) {
            newArr.push(val[j])
          }
        }
      }
      if (newArr.length > 0) {
        this.isWarn = true
      } else {
        this.isWarn = false
      }
    },
    saveRules () {
      for (let i in this.rulesList) {
        if (this.rulesList[i].relations.length === 0) {
          this.$message({
            message: '请选择字段规则的显示字段',
            type: 'warning'
          })
          return
        }
      }
      if (this.isWarn) {
        this.$message({
          message: '您有超过2个或以上的规则应用于同一字段，请修改当前的规则',
          type: 'error'
        })
        return
      }
      let params = this.rulesList.map(item => {
        let control = {
          id: item.id,
          controlId: item.controlId,
          controlTitle: item.controlTitle,
          optionId: item.optionId,
          value: item.value,
          relations: item.relations
        }
        return control
      })
      console.log('提交的信息')
      console.log(params)
      this.$http.put(`/api/v1.0/common/form/${this.uuid}/rule`, params).then((res) => {
        console.log('提交编辑的规则信息')
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            message: `字段规则保存成功！`,
            type: 'success'
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
  .content{
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    padding: 20px;
    overflow: auto;
    background-color: #fff;
    .title{
      width: 100%;
      height: 50px;
      border-bottom: $border;
      line-height: 50px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      p{
        width: 100px;
        height: 50px;
        margin-right: 10px;
        text-align: center;
        cursor: pointer;
        border-bottom: $border;
      }
      .active{
        color: $titleColor;
        border-bottom: $borderFocus;
      }
    }
    .modular{
      width: 100%;
      height: 100%;
      .jianjie{
        margin-top: 20px;
        width: 80%;
        height: 50px;
        line-height: 24px;
      }
      .addNewRules:hover{
        background-color: $titleColorDisabled;
        border: $borderFocus;
      }
      .addNewRules{
        width: 80%;
        height: 50px;
        border: $border;
        margin: 10px 0;
        text-align: center;
        line-height: 50px;
        color: $titleColor;
        cursor: pointer;
      }
      .showRules{
        width: 100%;
        min-height: calc(100% - 20px);
        padding-top: 20px;
        display: flex;
        justify-content: flex-start;
        .showLeft{
          width: 60%;
          height: auto;
          .addNewRules{
            width: 90%;
          }
          .rules-box{
            width: 90%;
            height: auto;
            .rules-item{
              width: calc(100% - 40px);
              height: auto;
              padding: 10px 20px;
              // height: 70px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              position: relative;
              .left{
                width: 70px;
                text-align: right;
                margin-right: 10px;
                color: #999;
              }
              .right{
                  width: calc(100% - 70px);
                // p{
                //   height: 20px;
                // }
              }
              .del-btn{
                position: absolute;
                bottom: 0;
                right: 5px;
                font-size: 20px;
                font-weight: 600;
                color: #f56c6c;
                cursor: pointer;
              }
            }
            .warn{
              background-color: #ffe9ed;
              color: #ff2851;
              border: 1px solid #ffa9b9;
              margin-bottom: 20px;
            }
          }
        }
        .showRight{
          width: calc(40% - 40px);
          height: auto;
          padding: 20px;
          border: $border;
          box-shadow: 0 2px 7px rgba(51,51,51,0.3);
          position: relative;
          .line{
            span{
              display:inline-block;
              width:50px;
              text-align:center;
              border-bottom: 1px solid #333;
            }
          }
          .leftCaret{
              display: inline-block;
              width: 0;
              height: 0;
              border: 11px solid transparent;
              border-right: 12px solid #ebebeb;
              border-left-width: 0;
              position: absolute;
              left: -13px;
              top: -11px;
              margin-top: 35px;
            .icon{
                display: inline-block;
                width: 0;
                height: 0;
                border: 11px solid transparent;
                border-right: 12px solid #fff;
                border-left-width: 0;
                position: absolute;
                left: 1px;
                top: -11px;
            }
          }
          .title{
            margin-bottom: 10px;
          }
          >p{
            margin: 10px 0;
          }
          .controls-box{
            width: 100%;
            min-height: 100px;
            border: $border;
            .controls-item{
              width: calc(100% - 20px);
              padding: 0 10px;
              height: 25px;
              line-height: 25px;
            }
            .activeItem{
              background-color: $titleColorDisabled;
            }
          }
        }
      }
    }
  }
}
</style>
