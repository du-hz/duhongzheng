<template>
  <div>
    <!-- 职能条件 三级筛选 -->
    <el-select v-model="oneFunc" placeholder="一级职能" @change="changeOneFunc" clearable style="width: 160px;">
      <el-option
        v-for="item in functionOneOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="twoFunc" placeholder="二级职能" @change="changeTwoFunc" clearable style="width: 160px;">
      <el-option
        v-for="item in functionTwoOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="threeFunc" placeholder="三级职能" @change="changeThreeFunc" clearable style="width: 160px;">
      <el-option
        v-for="item in functionThreeOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import IndustryFunction from 'assets/js/industryFunction'
import _ from 'underscore'
export default {
  props: ['functionId'],
  data () {
    return {
      functionOneOptions: IndustryFunction.levelOne,
      functionTwoOptions: IndustryFunction.levelTwo,
      functionThreeOptions: IndustryFunction.levelThree,
      oneFunc: '',
      twoFunc: '',
      threeFunc: '',
      originFunctionId: this.functionId
    }
  },
  computed: {
    checkFuncLevel () {
      // 根据传入functionId, 确定是哪一级的职能
      let _vue = this
      let funcLevel = 1
      if (_vue.originFunctionId === '' || _vue.originFunctionId === undefined) {
        return funcLevel
      } else {
        let funObj = _.findWhere(IndustryFunction.levelOne, { id: parseInt(_vue.originFunctionId) })
        if (funObj === undefined) {
          funObj = _.findWhere(IndustryFunction.levelTwo, { id: parseInt(_vue.originFunctionId) })

          if (funObj === undefined) {
            funObj = _.findWhere(IndustryFunction.levelThree, { id: parseInt(_vue.originFunctionId) })
            funcLevel = funObj === undefined ? 1 : 3
          } else {
            funcLevel = 2
          }
        } else {
          funcLevel = 1
        }
      }
      return funcLevel
    }
  },
  created () {
    let _vue = this
    if (_vue.checkFuncLevel === 1) {
      _vue.oneFunc = _vue.originFunctionId
      _vue.changeOneFunc()
    } else if (_vue.checkFuncLevel === 2) {
      _vue.twoFunc = _vue.originFunctionId
      _vue.changeTwoFunc()
    } else if (_vue.checkFuncLevel === 3) {
      _vue.threeFunc = _vue.originFunctionId
      _vue.changeThreeFunc()
    }
  },
  methods: {
    // 子组件emit事件，返回输出值, 父组件统一监听on事件，获取输出值
    changeOneFunc () {
      let _vue = this
      if (_vue.oneFunc === '') {
        _vue.functionTwoOptions = IndustryFunction.levelTwo
      } else {
        _vue.functionTwoOptions = _.filter(IndustryFunction.levelTwo, (item) => {
          return item.parentId === parseInt(_vue.oneFunc)
        })
      }
      _vue.functionThreeOptions = IndustryFunction.levelThree
      _vue.getIndustryFunc()
    },
    changeTwoFunc () {
      let _vue = this
      if (_vue.twoFunc === '') {
        _vue.functionThreeOptions = IndustryFunction.levelThree
      } else {
        _vue.oneFunc = _.findWhere(IndustryFunction.levelTwo, { id: parseInt(_vue.twoFunc) }).parentId
        _vue.functionThreeOptions = _.filter(IndustryFunction.levelThree, (item) => {
          return item.parentId === parseInt(_vue.twoFunc)
        })
      }
      _vue.getIndustryFunc()
    },
    changeThreeFunc () {
      let _vue = this
      if (_vue.twoFunc === '') {
        _vue.twoFunc = _.findWhere(IndustryFunction.levelThree, { id: parseInt(_vue.threeFunc) }).parentId
      }
      if (_vue.oneFunc === '') {
        _vue.oneFunc = _.findWhere(IndustryFunction.levelTwo, { id: parseInt(_vue.twoFunc) }).parentId
      }
      _vue.functionTwoOptions = _.filter(IndustryFunction.levelTwo, (item) => {
        return item.parentId === parseInt(_vue.oneFunc)
      })
      _vue.getIndustryFunc()
    },
    getIndustryFunc () {
      // 组件返回选中职能
      let result = this.threeFunc === '' ? (this.twoFunc === '' ? this.oneFunc : this.twoFunc) : this.threeFunc
      this.$emit('selectFunction', result)
    }
  }
}
</script>
