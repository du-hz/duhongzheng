<template>
  <div class="free-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created () {
    console.log('this.$route.query.id:' + this.$route.query.id)
    let id = this.$route.query.id
    // let id = 'dwyWAkdVmG6e'
    let self = this
    this.$http.get('/api/v1.0/extra/sfa/businessform?id=' + id).then((res) => {
      console.log('表单类型')
      let type = res.data.data.form.formType
      console.log(type)
      if (type === 1) {
        self.goFormPage('xpform', id)
      }
      if (type === 2) {
        self.goFormPage('gylform', id)
      }
      if (type === 3) {
        self.goFormPage('rcform', id)
      }
      if (type === 4) {
        self.goFormPage('qyfwform', id)
      }
    })
  },
  methods: {
    goFormPage (path, id) {
      this.$router.push({path: `/free/jsjform/${path}`, query: {id: id, ran: Math.floor(Math.random() * 1000000)}})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .free-container {
    width: 1200px;
    margin: 0 auto;
  }
</style>
