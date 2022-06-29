'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: 'http://adminp.mooreelite.com',
  FRONT_URL: 'http://adminp.mooreelite.com',
  QINIU_BUCKET_URL: 'http://uploadimg1.mooreelite.com',
  QINIU_BUCKET_FILE_URL: 'http://uploadfile1.mooreelite.com',
  QINIU_BUCKET_MOORE_FILE_URL: 'http://uploadfile1.moore.ren',
  QINIU_BUCKET_MOORE_IMAGE_URL: 'http://uploadimg1.moore.ren',
  QINIU_WFORM_IMG_URL: 'http://uploadimg1.moore.ren',  
  SUPPLIER_DEFAULT_LOGO: 'http://uploadimg1.mooreelite.com/cloud/supplier/default_logo.png',
  WEB_SERVER_URL: 'http://cloud.mooreelite.com',
  NEWS_MOBILE_URL: 'https://moore.live',
  IT_SERVER_URL: 'http://127.0.0.1:3000',
})
