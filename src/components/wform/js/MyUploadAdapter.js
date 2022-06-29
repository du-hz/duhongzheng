import * as qiniu from 'qiniu-js'
import Global from 'assets/js/global'
import axios from 'axios'

// 从服务器获取token
async function getUploadToken () {
  try {
    const { data } = await axios.post('/api/v1.0/qiniu/token/img?bucket=moore', {
      type: 1
    })
    return data.data.token
  } catch (error) {
    return Promise.reject(error)
  }
}

// 上传文件到七牛
async function qiniuUpload (file) {
  // 用时间戳作为文件名
  console.log('qiniuUpload:')
  console.log(file)
  const time = new Date().getTime()
  const token = await getUploadToken()
  let arr = Global.splitFileName(file.name)
  let newFileName = 'news/content/' + time + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
  return qiniu.upload(file, newFileName, token, {
    mimeType: ['image/png', 'image/jpeg', 'image/gif']
  })
}

export default class UploadAdapter {
  constructor (loader) {
    this.loader = loader
    this.uploader = null
  }
  // 通过这个方法，会把上传到服务器的文件地址展示到编辑器中
  async upload () {
    const file = await this.loader.file
    this.uploader = await qiniuUpload(file)
    return new Promise((resolve, reject) => {
      this.uploader.subscribe(data => {
        // next
      }, error => {
        // 上传出错 error
        console.error(error)
        return reject(error)
      }, data => {
        // 上传完成  complete
        console.log('upload image success---')
        console.log(data.key)
        // 返回给编辑器
        resolve({
          default: Global.CONFIG.QINIU_BUCKET_MOORE_IMAGE_URL + '/' + data.key
        })
      })
    })
  }
  // 这个方法会在编辑器销毁时候，终止文件上传
  abort () {
    if (this.uploader) {
      // this.uploader.unsubscribe()
    }
  }
}
