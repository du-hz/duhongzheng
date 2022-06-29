<template>
        <div v-bind:style="{'width':(oinputWidth?oinputWidth:'300')+'px'}"  style="line-height: 20px; border: 1px solid rgb(220, 223, 230); border-radius: 3px; padding-top: 1px; padding-bottom: 1px; padding-left: 20px; padding-right: 20px;">
        <el-tag size="small" @close="colseTag(tag)"
                v-for="tag in tags"
                :key="tag.id"
                closable>
            {{tag.name}}
        </el-tag>
        <el-button class="button-new-tag" size="small"  @click="showInput" style="padding-top: 2px; margin-left: 0px">{{addOTitle}}</el-button>
            <el-dialog title="提示"
                       :visible.sync="cascaderDialogVisible"
                       width="60%">
                <el-alert
                        title="警告"
                        type="warning"
                        description="该选项已选择过"
                        v-show="isRepeat"
                        :closable="false"
                        show-icon>
                </el-alert>
                <el-cascader v-model="jlOpts"
                             style="width:60%;"
                             :options="treeData"
                             change-on-select
                             separator="-"
                             @change="cascaderChange"
                ></el-cascader >
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cascaderDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="cascaderDialogSure">确 定</el-button>
                </span>
            </el-dialog>
        </div>
</template>
<script>
import _ from 'underscore'
import Global from 'assets/js/global'
export default {
  props: ['paramsIds', 'addTitle', 'treeArray', 'recordArray', 'size', 'inputWidth'],
  data () {
    return {
      tags: [],
      inputValue: null,
      cascaderDialogVisible: false,
      treeData: this.treeArray,
      recordData: this.recordArray,
      jlOpts: [],
      values: [],
      isRepeat: false,
      addOTitle: this.addTitle,
      valueIds: [],
      osize: this.size,
      oinputWidth: this.inputWidth
    }
  },
  created () {
    let _vue = this
    if (_vue.paramsIds !== undefined && _vue.paramsIds.length > 0) {
      _vue.resetTag(_vue.paramsIds)
      _vue.valueIds = _vue.paramsIds
      _vue.getFunctionIdFuc()
    }
  },
  watch: {
    paramsIds: function (newIds, oldIds) {
      let _vue = this
      _vue.resetTag(newIds)
      _vue.valueIds = newIds
    }
  },
  methods: {
    showInput () {
      let _vue = this
      _vue.cascaderDialogVisible = true
    },
    cascaderDialogSure () {
      let _vue = this
      let fid = _vue.getcascaderValue()
      if (fid !== -10086 && !_vue.isRepeat) {
        if (typeof (fid) === 'number' && fid < 0) {
          fid = -fid
        }
        _vue.valueIds.push(fid)
        _vue.resetTag(_vue.valueIds)
        _vue.resetCascader()
        _vue.cascaderDialogVisible = false
      }
      _vue.getFunctionIdFuc()
    },
    checkIsRepeat () {
      let _vue = this
      let fid = _vue.getcascaderValue()
      if (fid !== -10086) {
        if (typeof (fid) === 'number' && fid < 0) {
          fid = -fid
        }
        if (_vue.valueIds.indexOf(fid) > -1) {
          _vue.isRepeat = true
        } else {
          _vue.isRepeat = false
        }
      }
    },
    resetTag (fids) {
      console.log(fids)
      let _vue = this
      _vue.tags = []
      if (fids !== undefined && fids.length > 0) {
        fids.forEach(function (v, index) {
          if (typeof (v) === 'number' && v < 0) {
            v = -v
          }
          _vue.tags.push({
            id: v,
            name: _.find(_vue.recordData, (item) => {
              return item.id === v || (item.id + '' === v)
            }).fullname
          })
        })
      }
    },
    resetCascader () {
      let _vue = this
      _vue.jlOpts = []
    },
    getcascaderValue () {
      let _vue = this
      let cascaderId = -10086
      let cascaderLength = _vue.jlOpts.length
      if (cascaderLength > 0) {
        cascaderId = _vue.jlOpts[cascaderLength - 1]
      }
      return cascaderId
    },
    cascaderChange () {
      let _vue = this
      _vue.checkIsRepeat()
    },
    colseTag (tag) {
      let _vue = this
      _vue.valueIds.some(function (v, index) {
        if (v === tag.id || v === tag.id + '') {
          _vue.valueIds.splice(index, 1)
          return true
        }
      })
      _vue.resetTag(_vue.valueIds)
    },
    functionListShortConvert (functionIds) {
      if (functionIds != null && functionIds.length > 0) {
        let newFunctionIds = []
        functionIds.forEach((item, index) => {
          if (typeof (item) === 'number' && item < 0) {
            newFunctionIds.push(-item)
          } else {
            newFunctionIds.push(item)
          }
        })
        return newFunctionIds
      } else {
        return null
      }
    },
    getFunctionIdFuc () {
      // 组件返回选中职能
      let _vue = this
      _vue.$emit('getIds', _vue.valueIds)
      let tempValuesIds = _vue.functionListShortConvert(_vue.valueIds)
      let names = []
      let childrenIds = []
      let childrenNames = []
      if (tempValuesIds !== undefined && tempValuesIds !== null && tempValuesIds.length > 0) {
        let uus = []
        tempValuesIds.forEach(function (v) {
          _vue.recordData.some(function (u) {
            if (v === u.id) {
              uus.push(u)
              names.push(u.fullname)
              return true
            }
          })
        })
        uus.forEach(function (v) {
          let fatherU
          _vue.treeData.some(function (father) {
            // 去树形数据库里找到父级树
            if (v.id === father.value) {
              fatherU = father
              return true
            }
          })
          if (fatherU !== undefined && !Global.isBlankArr(fatherU.children)) {
            // 如果找到子级，就把子级的value和label填上
            fatherU.children.forEach(function (c) {
              childrenIds.push(c.value)
              childrenNames.push(c.label)
            })
          } else {
            // 如果没有找到子级，就把父级的value和label填上
            childrenIds.push(v.id)
            childrenNames.push(v.name)
          }
        })
      }
      console.log(childrenIds)
      console.log(names)
      console.log(childrenNames)
      _vue.$emit('getNames', names)
      _vue.$emit('getChildrenNames', childrenNames)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~assets/css/variable";
    .multi-button-wrap {
        button {
        }
    }
    .dialog-bottom-tip {
        text-align: center;
        font-size: 15px;
        color: #666;
    }
    .form-line {
        height: 1px;
        background: #99a9bf;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
        line-height: 20px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 25px;
        line-height: 20px;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
