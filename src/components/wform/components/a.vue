<template>
  <div>
                    <div class="closePage" @click.stop="closePage(index)" v-show="clickPage === index"><img src="./img/closePages.png" alt=""></div>
                <div class="page-num">第{{index + 1}}页，共{{formData.pages.length}}页</div>
                <div class="item" v-for="(li, num) in item.formControls" :key="num" @click="editForm(li, num, index)" :class="clickItem === num && clickPage === index ? 'active' : ''" v-show="li.keyName !== 'cf_code'">
                  <div class="fun-area" @click="closeItem(index, num, li, $event)" v-show="clickItem === num && clickPage === index && li.keyName !== 'cf_code'">
                    <img src="./img/closeItem.png" alt="">
                  </div>
                  <div class="move-area" v-show="clickItem === num && clickPage === index">
                    <div class="up" @click.stop="moveUp(index, num)" :class="num === 0 && index === 0 ? 'donotClick' : 'canClick'">
                      <img src="./img/up.png" alt="">
                    </div>
                    <div class="down" @click.stop="moveDown(index, num)" :class="num === (item.formControls.length - 1) && index === (formData.pages.length - 1) ? 'donotClick' : 'canClick'">
                      <img src="./img/down.png" alt="">
                    </div>
                  </div>
                  <div class="item-form" v-if="li.identifier === 'cf_textarea'">
                    <div v-html="li.defaultValue"></div>
                  </div>
                  <!-- 单行文本 -->
                  <div class="item-form" v-if="li.identifier === 'cf_text' && li.identifier !== 'cf_code'">
                    <div class="name" :style="li.controlType === 2 ? 'cursor: auto;' : 'cursor: pointer;'">{{li.title ? li.title : '单行文本'}}：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                  </div>
                  <!-- 手机 -->
                  <div class="item-form" v-if="li.identifier === 'cf_mobile'">
                    <div class="name">{{li.title}} ：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                  </div>
                  <div v-if="li.identifier === 'cf_mobile' && li.verifications.filter(res=>res.mode === 15).length " class="code-box">
                    <div class="name">验证码：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" placeholder="请输入验证码" readonly></el-input></div>
                  </div>
                  <!-- 多行文本 -->
                  <div class="item-form" v-if="li.identifier === 'cf_text_multi'">
                    <div class="name">{{li.title ? li.title : '多行文本'}}：</div>
                    <div class="input"><el-input type='textarea' v-model="li.defaultValue" :placeholder="li.prompting" maxlength="30" show-word-limit readonly></el-input></div>
                  </div>
                  <!-- 单选框组 -->
                  <div class="item-form" v-if="li.identifier === 'cf_radio'">
                    <div class="name">{{li.title ? li.title : '单选框组'}}：</div>
                    <!-- 竖向排序 radioActive -->
                    <div class="check">
                      <el-radio v-for='(radio, radioIndex) in li.options' :key="radioIndex" v-model="li.defaultValue" :label="radio.value" readonly>{{radio.value}}</el-radio>
                    </div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 多选框组 -->
                  <div class="item-form" v-if="li.identifier === 'cf_checkbox'">
                    <div class="name">{{li.title ? li.title : '多选框组'}}：</div>
                    <!-- 竖向排序 radioActive -->
                    <div class="check">
                      <el-checkbox  v-for='(radio, radioIndex) in li.options' :key="radioIndex" :label="radio" :value="radio | filterCheck(li.defaultValue)">{{radio.value}}</el-checkbox >
                    </div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 下拉框 -->
                  <div class="item-form" v-if="li.identifier === 'cf_select' && li.controlType === 1">
                    <div class="name">下拉框：</div>
                    <!-- 是否多选 multiple -->
                      <el-select v-model="li.defaultValue" placeholder="请选择" style="width:95%" readonly>
                        <el-option
                          v-for="item in li.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 固定功能下拉框 -->
                  <div class="item-form" v-if="li.identifier === 'cf_select' && li.controlType === 2">
                    <div class="name">{{li.title}}</div>
                    <!-- 是否多选 multiple -->
                      <el-select v-model="li.defaultValue" placeholder="请选择" style="width:95%" readonly>
                        <el-option
                          v-for="item in li.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 数字 -->
                  <div class="item-form" v-if="li.identifier === 'cf_num'">
                    <div class="name">{{li.title ? li.title : '数字'}}：</div>
                      <!-- <el-input-number label="描述文字" readonly v-model="li.defaultValue"></el-input-number> -->
                      <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 日期选择器 -->
                  <div class="item-form" v-if="li.identifier === 'cf_date'">
                    <div class="name">{{li.title ? li.title : '日期选择器'}}：</div>
                      <!-- 选择日 -->
                      <el-date-picker
                        v-model="li.defaultValue"
                        type="date"
                        value-format="yyyy-MM-dd"
                        readonly
                        :placeholder="li.prompting">
                      </el-date-picker>
                    </div>
                  <!-- 时间选择器 -->
                  <div class="item-form" v-if="li.identifier === 'cf_time'">
                    <div class="name">{{li.title ? li.title : '时间选择器'}}：</div>
                      <!-- 固定时间点 -->
                      <!-- <el-time-select
                        v-model="li.defaultValue"
                        :picker-options="{
                          start: li.verifications[10].value || '00:00',
                          step: '00:10',
                          end:  li.verifications[11].value || '23:59'
                        }"
                        placeholder="选择时间点">
                      </el-time-select> -->
                      <el-time-select
                        v-model="li.defaultValue"
                        readonly
                        :placeholder="li.prompting">
                      </el-time-select>
                    </div>
                </div>
  </div>
</template>